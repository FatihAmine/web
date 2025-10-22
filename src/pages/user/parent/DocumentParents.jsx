// src/pages/user/parent/DocumentParents.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../component/sidebarparent';
import CustomDropdown from '../../component/CustomDropdown';
import {
  Bell,
  FileText,
  Menu,
  X,
  Download,
  CheckCircle,
  AlertCircle,
  Calendar,
  Search,
  User,
  Filter,
  Users,
  Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/parent/DocumentParents.css';
import api from '../../../api'; // axios préconfiguré (avec ID token)

function toDateAny(v) {
  if (!v) return new Date();
  if (v instanceof Date) return v;
  if (typeof v === 'string' || typeof v === 'number') return new Date(v);
  if (v?._seconds) return new Date(v._seconds * 1000);
  if (v?.seconds) return new Date(v.seconds * 1000);
  return new Date(v);
}
function formatDateISO(d) {
  try { return toDateAny(d).toISOString().slice(0, 10); }
  catch { return ''; }
}
const nameOf = (obj) =>
  obj?.displayName ||
  [obj?.prenom, obj?.nom].filter(Boolean).join(' ') ||
  obj?.email ||
  '—';

// ---- Map Firestore request -> document UI (status 'sent') ----
function mapDoc(r) {
  const rf = r.requestedFor || {};
  return {
    id: r.id,
    childUid: r.requestedForUid || null,
    childName: nameOf(rf),
    type: r.type || 'Document',
    // date d’envoi prioritaire (sentAt), sinon approvedAt/updatedAt/createdAt
    date: formatDateISO(r.sentAt || r.approvedAt || r.updatedAt || r.createdAt),
    status: 'sent',                       // cette page ne montre que “envoyé”
    // on ne dépend PAS d’une URL en base; on passera par /download
  };
}

const DocumentParents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeTab, setActiveTab] = useState('documents');

  // données
  const [children, setChildren] = useState([]);
  const [items, setItems] = useState([]);       // documents envoyés
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // filtres / recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterChild, setFilterChild] = useState('');

  const navigate = useNavigate();
  const handleLogout = () => navigate('/parent/login');

  // ---- Fetch enfants (pour filtre) ----
  const fetchChildren = async () => {
    try {
      const { data } = await api.get('/parent/children');
      setChildren(Array.isArray(data?.items) ? data.items : []);
    } catch (e) {
      console.warn('GET /parent/children', e?.response?.data || e.message);
      setChildren([]); // pas bloquant
    }
  };

  // ---- Fetch documents envoyés (sent) ----
  const fetchDocs = async () => {
    setLoading(true); setErr('');
    try {
      // On demande UNIQUEMENT les sent de ce parent (scope=mine)
      const { data } = await api.get('/requests', {
        params: { scope: 'mine', status: 'sent', limit: 100 }
      });
      const src = Array.isArray(data?.items) ? data.items
               : Array.isArray(data)       ? data
               : [];
      setItems(src.map(mapDoc));
    } catch (e) {
      console.error('GET /requests?scope=mine&status=sent', e?.response?.data || e.message);
      setErr("Impossible de charger les documents envoyés.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChildren(); fetchDocs(); }, []);

  // ---- options filtres dynamiques ----
  const childOptions = useMemo(() => ([
    { value: '', label: 'Tous les enfants', icon: Users, color: '#5eead4' },
    ...children.map((c) => ({
      value: c.uid,
      label:
        c.displayName ||
        `${c.prenom || ''} ${c.nom || ''}`.trim() ||
        c.email || c.uid,
      icon: User, color: '#5eead4'
    }))
  ]), [children]);

  const typeOptions = useMemo(() => {
    const set = new Set();
    items.forEach(d => d?.type && set.add(String(d.type)));
    return [
      { value: '', label: 'Tous les types', icon: Filter, color: '#5eead4' },
      ...Array.from(set).sort().map(t => ({ value: t, label: t, icon: FileText, color: '#5eead4' }))
    ];
  }, [items]);

  // ---- filtre local ----
  const filtered = items.filter((d) => {
    const q = searchTerm.trim().toLowerCase();
    const hay = [d.type, d.childName].join(' ').toLowerCase();
    const okSearch = !q || hay.includes(q);
    const okType = !filterType || d.type === filterType;
    const okChild = !filterChild || d.childUid === filterChild;
    return okSearch && okType && okChild;
  });

  // ---- stats ----
  const totalDocs = items.length;

  // ---- download via backend /requests/:id/download ----
  const handleDownload = async (doc) => {
    try {
      const { data } = await api.get(`/requests/${doc.id}/download`);
      if (data?.url) window.open(data.url, '_blank');
      else alert('Fichier introuvable pour ce document.');
    } catch (e) {
      console.error('download failed', e?.response?.data || e.message);
      alert('Téléchargement impossible.');
    }
  };

  return (
    <div className="parent-docs-page">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userData={{
          firstName: "Fatima",
          lastName: "Bennani",
          role: "Parent",
          profilePic: "https://ui-avatars.com/api/?name=Fatima+Bennani&background=17766e&color=fff&size=200"
        }}
      />

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className={`parent-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="parent-header">
          <button
            className="parent-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="parent-page-title">Documents envoyés</h1>
          <div className="parent-header-actions">
            <button className="parent-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="parent-docs-content">
          {/* Stats */}
          <div className="parent-docs-stats-grid">
            <div className="parent-docs-stat-card stat-total">
              <div className="stat-icon"><FileText size={24} /></div>
              <div className="stat-info">
                <p className="stat-label">Total</p>
                <h3 className="stat-value">{totalDocs}</h3>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="parent-docs-filters">
            <CustomDropdown
              options={childOptions}
              value={filterChild}
              onChange={setFilterChild}
              icon={Users}
            />
            <CustomDropdown
              options={typeOptions}
              value={filterType}
              onChange={setFilterType}
              icon={Filter}
            />
            <div className="parent-docs-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher (type / enfant)…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="parent-docs-search-input"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="parent-docs-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="parent-docs-card" style={{ opacity: .6 }}>
                  <div className="doc-card-header">
                    <div className="doc-icon"><FileText size={20} /></div>
                    <span className="doc-status" style={{ background: '#1f2a3a', color: '#94a3b8' }}>Chargement…</span>
                  </div>
                  <div className="doc-card-body">
                    <h3 className="doc-title" style={{ opacity: .7 }}>...</h3>
                    <div className="doc-child-badge"><User size={14} /><span>...</span></div>
                    <div className="doc-meta">
                      <div className="doc-meta-item"><Calendar size={14} /><span>…</span></div>
                      <div className="doc-meta-item"><FileText size={14} /><span>…</span></div>
                    </div>
                  </div>
                </div>
              ))
            ) : err ? (
              <div className="parent-docs-empty">
                <AlertCircle size={64} />
                <h3>{err}</h3>
                <button onClick={fetchDocs} className="doc-download-btn" style={{ marginTop: 12 }}>
                  Réessayer
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="parent-docs-empty">
                <FileText size={64} />
                <h3>Aucun document envoyé</h3>
                <p>Utilisez les filtres ou réessayez plus tard.</p>
              </div>
            ) : (
              filtered.map((doc) => (
                <div key={doc.id} className="parent-docs-card">
                  <div className="doc-card-header">
                    <div className="doc-icon"><FileText size={20} /></div>
                    <span className="doc-status" style={{ background: '#3b82f61a', color: '#3b82f6' }}>
                      <Send size={16} /> Envoyé
                    </span>
                  </div>
                  <div className="doc-card-body">
                    <h3 className="doc-title">{doc.type}</h3>
                    <div className="doc-child-badge">
                      <User size={14} />
                      <span>{doc.childName}</span>
                    </div>
                    <div className="doc-meta">
                      <div className="doc-meta-item">
                        <Calendar size={14} />
                        <span>{doc.date}</span>
                      </div>
                      <div className="doc-meta-item">
                        <FileText size={14} />
                        <span>{doc.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="doc-card-footer">
                    <button className="doc-download-btn" onClick={() => handleDownload(doc)}>
                      <Download size={16} />
                      <span>Télécharger</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentParents;
