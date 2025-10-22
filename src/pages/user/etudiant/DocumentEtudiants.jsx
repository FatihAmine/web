// src/pages/etudiant/MesDocuments.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../component/sidebaretudiant';
import CustomDropdown from '../../component/CustomDropdown';
import {
  Bell,
  FileText,
  Menu,
  X,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/etudiant/DocumentEtudiants.css';
import api from '../../../api'; // ← axios préconfiguré (avec ID token)

function toDateAny(v) {
  if (!v) return new Date();
  if (v instanceof Date) return v;
  if (typeof v === 'string' || typeof v === 'number') return new Date(v);
  if (v?._seconds) return new Date(v._seconds * 1000);
  if (v?.seconds) return new Date(v.seconds * 1000);
  return new Date(v);
}
function fmtISO(d) {
  const dt = toDateAny(d);
  return isNaN(+dt) ? '' : dt.toISOString().slice(0, 10);
}
const nameOf = (obj) =>
  obj?.displayName ||
  [obj?.prenom, obj?.nom].filter(Boolean).join(' ') ||
  obj?.email ||
  '—';

const MesDocuments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeTab, setActiveTab] = useState('documents');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [docs, setDocs] = useState([]);

  const navigate = useNavigate();
  const handleLogout = () => navigate('/etudiant/login');

  // Charger uniquement les demandes envoyées (sent) pour l'utilisateur courant
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        // ✨ important : on demande "scope=mine&status=sent"
        const { data } = await api.get('/requests', {
          params: { scope: 'mine', status: 'sent', limit: 200 },
        });
        if (!mounted) return;
        const items = Array.isArray(data?.items) ? data.items : [];
        // Normalise pour l’affichage
        const mapped = items.map((r) => ({
          id: r.id,
          title: r.type || 'Document',
          docType: r.type || 'Document',
          uploadDate: fmtISO(r.sentAt || r.updatedAt || r.createdAt),
          year: String((toDateAny(r.sentAt || r.updatedAt || r.createdAt)).getFullYear()),
          status: 'valid', // côté étudiant: "sent" = document disponible
          // On ne met PAS d’URL directe ici → on passera par l’API /download
          requestedForName: nameOf(r.requestedFor),
          requestedByName: nameOf(r.requestedBy),
        }));
        setDocs(mapped);
      } catch (e) {
        console.error('GET /requests?scope=mine&status=sent', e?.response?.data || e.message);
        setErr("Impossible de charger vos documents.");
        setDocs([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Filtres dynamiques à partir des types présents
  const filterOptions = useMemo(() => {
    const set = new Set();
    docs.forEach(d => { if (d.docType) set.add(String(d.docType)); });
    return [
      { value: '', label: 'Tous les types', icon: Filter, color: '#5eead4' },
      ...Array.from(set).sort().map(t => ({
        value: t, label: t, icon: FileText, color: '#5eead4'
      }))
    ];
  }, [docs]);

  // Helpers statut (côté étudiant: valid = document disponible)
  const getDocStatusIcon = (status) => status === 'valid' ? CheckCircle : (status === 'pending' ? Clock : XCircle);
  const getDocStatusColor = (status) => status === 'valid' ? '#10b981' : (status === 'pending' ? '#f59e0b' : '#ef4444');
  const getDocStatusText = (status) => status === 'valid' ? 'Disponible' : (status === 'pending' ? 'En traitement' : 'Rejeté');

  // Recherche/filtre
  const filteredDocuments = docs.filter(doc => {
    const searchOk = [doc.title, doc.requestedForName, doc.requestedByName].join(' ').toLowerCase()
      .includes(searchTerm.toLowerCase());
    const filterOk = !filterType || String(doc.docType).toLowerCase() === filterType.toLowerCase();
    return searchOk && filterOk;
  });

  // Stats
  const totalDocs = docs.length;
  const validDocs = docs.filter(d => d.status === 'valid').length;
  const pendingDocs = docs.filter(d => d.status === 'pending').length;

  // Télécharger en appelant l’API backend (sécurisée)
  const handleDownload = async (docItem) => {
    try {
      const { data } = await api.get(`/requests/${docItem.id}/download`);
      if (data?.url) {
        // ouvre l'URL Cloudinary en nouvelle fenêtre/onglet
        window.open(data.url, '_blank', 'noopener,noreferrer');
      } else {
        alert('Fichier introuvable pour ce document.');
      }
    } catch (e) {
      console.error('download failed', e?.response?.data || e.message);
      alert('Téléchargement impossible.');
    }
  };

  return (
    <div className="mes-documents-page">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userData={{
          firstName: "Mohamed",
          lastName: "Alami",
          role: "Étudiant",
          profilePic: "https://ui-avatars.com/api/?name=Mohamed+Alami&background=17766e&color=fff&size=200"
        }}
      />

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <main className={`mes-documents-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="mes-documents-page-header">
          <button
            className="mes-documents-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="mes-documents-page-title">Mes Documents (envoyés)</h1>
          <div className="mes-documents-header-actions">
            <button className="mes-documents-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="mes-documents-container">
          {/* Stats Cards */}
          <div className="mes-documents-stats-grid">
            <div className="mes-documents-stat-card stat-total">
              <div className="stat-icon"><FileText size={24} /></div>
              <div className="stat-info">
                <p className="stat-label">Total Documents</p>
                <h3 className="stat-value">{totalDocs}</h3>
              </div>
            </div>
            <div className="mes-documents-stat-card stat-valid">
              <div className="stat-icon"><CheckCircle size={24} /></div>
              <div className="stat-info">
                <p className="stat-label">Disponibles</p>
                <h3 className="stat-value">{validDocs}</h3>
              </div>
            </div>
            <div className="mes-documents-stat-card stat-pending">
              <div className="stat-icon"><Clock size={24} /></div>
              <div className="stat-info">
                <p className="stat-label">En Traitement</p>
                <h3 className="stat-value">{pendingDocs}</h3>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mes-documents-filters">
            <CustomDropdown
              options={filterOptions}
              value={filterType}
              onChange={setFilterType}
              icon={Filter}
            />
            <div className="mes-documents-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher documents (titre / noms)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mes-documents-search-input"
              />
            </div>
          </div>

          {/* Documents Grid */}
          <div className="mes-documents-grid">
            {loading ? (
              <div className="mes-documents-empty">
                <Clock size={64} />
                <h3>Chargement…</h3>
              </div>
            ) : err ? (
              <div className="mes-documents-empty">
                <AlertCircle size={64} />
                <h3>{err}</h3>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="mes-documents-empty">
                <FileText size={64} />
                <h3>Aucun document envoyé</h3>
                <p>Les documents apparaîtront ici dès qu’ils seront envoyés par l’administration.</p>
              </div>
            ) : (
              filteredDocuments.map((doc) => {
                const StatusIcon = getDocStatusIcon(doc.status);
                return (
                  <div key={doc.id} className="mes-documents-card">
                    <div className="doc-card-header">
                      <div className="doc-icon"><FileText size={20} /></div>
                      <span
                        className="doc-status"
                        style={{ background: `${getDocStatusColor(doc.status)}1a`, color: getDocStatusColor(doc.status) }}
                      >
                        <StatusIcon size={16} />
                        {getDocStatusText(doc.status)}
                      </span>
                    </div>

                    <div className="doc-card-body">
                      <h3 className="doc-title">{doc.title}</h3>
                      <div className="doc-meta">
                        <div className="doc-meta-item"><Calendar size={14} /><span>{doc.uploadDate}</span></div>
                        <div className="doc-meta-item"><FileText size={14} /><span>Année {doc.year}</span></div>
                      </div>
                      <div className="doc-type-badge">
                        <span className={`doc-type ${String(doc.docType).toLowerCase().replace(/\s+/g, '-')}`}>
                          {doc.docType}
                        </span>
                      </div>
                    </div>

                    <div className="doc-card-footer">
                      <button className="doc-action-btn download" onClick={() => handleDownload(doc)}>
                        <Download size={16} />
                        <span>Télécharger</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MesDocuments;
