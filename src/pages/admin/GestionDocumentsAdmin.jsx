// src/pages/admin/GestionDocumentsAdmin.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../component/sidebar';
import CustomDropdown from '../component/CustomDropdown';
import {
  Bell,
  FileText,
  Menu,
  X,
  Search,
  Filter,
  Check,
  X as XIcon,
  Calendar,
  User,
  Clock,
  Upload,
  AlertCircle,
  Send,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../css/admin/GestionDocumentsAdmin.css';
import api from '../../api'; // axios préconfiguré

function toDateAny(v) {
  if (!v) return new Date();
  if (v instanceof Date) return v;
  if (typeof v === 'string' || typeof v === 'number') return new Date(v);
  if (v?._seconds) return new Date(v._seconds * 1000);
  if (v?.seconds) return new Date(v.seconds * 1000);
  return new Date(v);
}
function formatDateISO(d) {
  const dt = toDateAny(d);
  return isNaN(+dt) ? '' : dt.toISOString().slice(0, 10);
}
const nameOf = (obj) =>
  obj?.displayName ||
  [obj?.prenom, obj?.nom].filter(Boolean).join(' ') ||
  obj?.email ||
  '—';

const GestionDocumentsAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeTab, setActiveTab] = useState('documents');

  // filtres / recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  // modals
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // données
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [requests, setRequests] = useState([]); // items venant du backend (approved + sent)

  const navigate = useNavigate();
  const handleLogout = () => navigate('/personnel/login');

  // ---- Charger depuis le backend (approved + sent) ----
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const { data } = await api.get('/requests', {
          params: { scope: 'admin', limit: 100 },
        });
        if (!mounted) return;
        const items = Array.isArray(data?.items) ? data.items : [];
        setRequests(items);
      } catch (e) {
        console.error('GET /requests?scope=admin failed', e?.response?.data || e.message);
        if (!mounted) setErr(''); else setErr("Impossible de charger les demandes.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // types (pour filtre simple par libellé type)
  const filterOptions = useMemo(() => {
    const set = new Set();
    requests.forEach(r => { if (r?.type) set.add(String(r.type)); });
    return [
      { value: '', label: 'Tous les types', icon: Filter, color: '#5eead4' },
      ...Array.from(set).sort().map(t => ({
        value: t, label: t, icon: FileText, color: '#5eead4'
      }))
    ];
  }, [requests]);

  // mapping status (admin voit seulement approved/sent)
  const getStatusIcon = (status) => status === 'approved' ? Check : (status === 'sent' ? Send : Clock);
  const getStatusColor = (status) => status === 'approved' ? '#10b981' : (status === 'sent' ? '#3b82f6' : '#6b7280');
  const getStatusText  = (status) => status === 'approved' ? 'Approuvé' : (status === 'sent' ? 'Envoyé' : status);

  // recherche/filtre local
  const filtered = requests.filter(r => {
    const typeOk = !filterType || String(r.type || '').toLowerCase() === filterType.toLowerCase();
    const hay = [
      r.type,
      nameOf(r.requestedFor),
      nameOf(r.requestedBy),
      r.notes,
      r.id
    ].join(' ').toLowerCase();
    const q = searchTerm.trim().toLowerCase();
    const searchOk = !q || hay.includes(q);
    return typeOk && searchOk;
  });

  // stats
  const totalDocs = requests.length;
  const approvedDocs = requests.filter(r => r.status === 'approved').length;
  const sentDocs = requests.filter(r => r.status === 'sent').length;

  // ouvrir envoi (seulement quand status = approved)
  const openSendModal = (req) => {
    setSelectedReq(req);
    setShowSendModal(true);
    setUploadedFile(null);
    setNotes('');
    setIsUploading(false);
  };
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  // Envoi du document :
  // - si fichier sélectionné → POST /requests/:id/upload (multipart) avec notify=true
  // - sinon → PATCH /requests/:id/document (juste notif)
  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedReq) return;

    try {
      setIsUploading(true);

      if (uploadedFile) {
        const fd = new FormData();
        fd.append('file', uploadedFile);
        fd.append('notes', notes || '');
        fd.append('notify', 'true'); // → passe en "sent" + notifs

        const { data } = await api.post(`/requests/${selectedReq.id}/upload`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // maj locale
        setRequests(prev =>
          prev.map(r =>
            r.id === selectedReq.id
              ? {
                  ...r,
                  status: 'sent',
                  sentAt: new Date().toISOString(),
                  documentUrl: data?.attachment?.secureUrl || r.documentUrl
                }
              : r
          )
        );
      } else {
        // fallback sans fichier: notif simple
        await api.patch(`/requests/${selectedReq.id}/document`, { notes: notes || '' });
        setRequests(prev =>
          prev.map(r =>
            r.id === selectedReq.id
              ? { ...r, status: 'sent', sentAt: new Date().toISOString() }
              : r
          )
        );
      }

      setShowSendModal(false);
      setSelectedReq(null);
      setUploadedFile(null);
      setNotes('');
      alert('Document envoyé.');
    } catch (e2) {
      console.error('send document failed', e2?.response?.data || e2.message);
      alert("Échec d'envoi du document.");
    } finally {
      setIsUploading(false);
    }
  };

  // Télécharger le document (ouvre l’URL Cloudinary)
  const handleDownload = async (reqItem) => {
    try {
      const { data } = await api.get(`/requests/${reqItem.id}/download`);
      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        alert('Fichier introuvable pour cette demande.');
      }
    } catch (e) {
      console.error('download failed', e?.response?.data || e.message);
      alert('Téléchargement impossible.');
    }
  };

  return (
    <div className="personnel-docs-page">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userData={{
          firstName: "Karim",
          lastName: "El Amrani",
          role: "Administrateur",
          profilePic: "https://ui-avatars.com/api/?name=Karim+El+Amrani&background=17766e&color=fff&size=200"
        }}
      />

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className={`personnel-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="personnel-header">
          <button
            className="personnel-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="personnel-page-title">Gestion Documents (Admin)</h1>
          <div className="personnel-header-actions">
            <button className="personnel-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="personnel-docs-content">
          {/* Stats */}
          <div className="personnel-docs-stats-grid">
            <div className="personnel-docs-stat-card stat-total">
              <div className="stat-icon"><FileText size={24} /></div>
              <div className="stat-info">
                <p className="stat-label">Total (approuvés & envoyés)</p>
                <h3 className="stat-value">{totalDocs}</h3>
              </div>
            </div>
            <div className="personnel-docs-stat-card stat-approved">
              <div className="stat-icon"><Check size={24} /></div>
              <div className="stat-info">
                <p className="stat-label">Approuvés</p>
                <h3 className="stat-value">{approvedDocs}</h3>
              </div>
            </div>
            <div className="personnel-docs-stat-card stat-pending">
              <div className="stat-icon"><Send size={24} /></div>
              <div className="stat-info">
                <p className="stat-label">Envoyés</p>
                <h3 className="stat-value">{sentDocs}</h3>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="personnel-docs-toolbar">
            <CustomDropdown
              options={filterOptions}
              value={filterType}
              onChange={setFilterType}
              icon={Filter}
            />
            <div className="personnel-docs-searchrow">
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher (type / étudiant / demandeur / id)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="personnel-docs-search-input"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="personnel-docs-grid">
            {loading ? (
              <div className="personnel-docs-empty-state">
                <Clock size={64} />
                <h3>Chargement…</h3>
              </div>
            ) : err ? (
              <div className="personnel-docs-empty-state">
                <AlertCircle size={64} />
                <h3>{err}</h3>
              </div>
            ) : filtered.length === 0 ? (
              <div className="personnel-docs-empty-state">
                <FileText size={64} />
                <h3>Aucun document</h3>
                <p>Aucune demande approuvée/envoyée ne correspond à vos filtres.</p>
              </div>
            ) : (
              filtered.map((r) => {
                const StatusIcon = getStatusIcon(r.status);
                const statusColor = getStatusColor(r.status);
                const studentName = nameOf(r.requestedFor);
                const requesterName = nameOf(r.requestedBy);
                const docTitle = r.type || 'Document';
                const dateStr = formatDateISO(r.createdAt);

                return (
                  <div key={r.id} className="personnel-docs-card">
                    <div className="doc-card-header">
                      <div className="doc-icon"><FileText size={20} /></div>
                      <span
                        className="doc-status"
                        style={{ background: `${statusColor}1a`, color: statusColor }}
                      >
                        <StatusIcon size={16} />
                        {getStatusText(r.status)}
                      </span>
                    </div>

                    <div className="doc-card-body">
                      <h3 className="doc-title">{docTitle}</h3>

                      <div className="doc-meta">
                        <div className="doc-meta-item"><User size={14} /><span>Pour : {studentName}</span></div>
                        <div className="doc-meta-item"><User size={14} /><span>Par : {requesterName}</span></div>
                        <div className="doc-meta-item"><Calendar size={14} /><span>{dateStr}</span></div>
                      </div>

                      {r.notes && (
                        <div className="doc-type-badge" title="Motif / notes">
                          <span className="doc-type">{r.notes}</span>
                        </div>
                      )}
                    </div>

                    <div className="doc-card-footer">
                      {/* Envoyer (upload+notif) si approuvé */}
                      {r.status === 'approved' && (
                        <button
                          className="doc-action-btn approve"
                          onClick={() => openSendModal(r)}
                          disabled={isUploading}
                        >
                          <Send size={16} />
                          <span>Envoyer le document</span>
                        </button>
                      )}

                      {/* Télécharger si déjà envoyé ou si une URL existe */}
                      {(r.status === 'sent' || r.documentUrl) && (
                        <button
                          className="doc-action-btn approve"
                          onClick={() => handleDownload(r)}
                        >
                          <Download size={16} />
                          <span>Télécharger</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Send (document) Modal */}
      {showSendModal && selectedReq && (
        <div className="personnel-modal-backdrop">
          <div className="personnel-modal">
            <button
              className="personnel-modal-close"
              onClick={() => setShowSendModal(false)}
              disabled={isUploading}
            >
              <X size={22} />
            </button>
            <h3 className="personnel-modal-title">
              <Send size={18} style={{ verticalAlign: 'middle', marginRight: 8, color: '#3b82f6' }}/>
              Envoyer le document
            </h3>

            <form onSubmit={handleSend} className="personnel-modal-form">
              <div className="modal-info-section">
                <div className="modal-field"><strong>Document :</strong><span>{selectedReq.type || 'Document'}</span></div>
                <div className="modal-field"><strong>Étudiant :</strong><span>{nameOf(selectedReq.requestedFor)}</span></div>
                <div className="modal-field"><strong>Demandeur :</strong><span>{nameOf(selectedReq.requestedBy)}</span></div>
                <div className="modal-field"><strong>Créée le :</strong><span>{formatDateISO(selectedReq.createdAt)}</span></div>
              </div>

              {/* Upload fichier → envoyé au backend si présent */}
              <div className="form-group">
                <label className="form-label">Télécharger le fichier (PDF/DOC/DOCX)</label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="file-input"
                    disabled={isUploading}
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    <Upload size={24} />
                    <span>{uploadedFile ? uploadedFile.name : 'Cliquer pour sélectionner'}</span>
                    <small>PDF, DOC, DOCX (Max 10MB)</small>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message / Notes (affiché dans la notif)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-textarea"
                  placeholder="Ex: Document disponible au téléchargement dans votre espace."
                  rows="3"
                  disabled={isUploading}
                />
              </div>

              <div className="personnel-modal-footer">
                <button
                  type="button"
                  className="personnel-cancel-btn"
                  onClick={() => setShowSendModal(false)}
                  disabled={isUploading}
                >
                  Annuler
                </button>
                <button type="submit" className="personnel-submit-btn approve" disabled={isUploading}>
                  <Send size={18} />
                  {isUploading ? 'Envoi…' : (uploadedFile ? 'Uploader et notifier' : 'Notifier sans fichier')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionDocumentsAdmin;
