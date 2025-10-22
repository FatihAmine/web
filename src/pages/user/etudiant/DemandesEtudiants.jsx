// src/pages/etudiant/DemandesEtudiants.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../component/sidebaretudiant';
import {
  Bell,
  FileText,
  Menu,
  X,
  Plus,
  Eye,
  Calendar,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  RotateCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/etudiant/DemandesEtudiants.css';
import api from '../../../api'; // axios avec ID token

const OTHER_SENTINEL = '__OTHER__';

/* Utils date (gère ISO / Date / Firestore Timestamp) */
function toDateAny(v) {
  if (!v) return new Date();
  if (v instanceof Date) return v;
  if (typeof v === 'string' || typeof v === 'number') return new Date(v);
  if (v?._seconds) return new Date(v._seconds * 1000);
  if (v?.seconds) return new Date(v.seconds * 1000);
  return new Date(v);
}
function formatYYYYMMDD(v) {
  const d = toDateAny(v);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* Map backend → UI */
function mapRequest(r) {
  return {
    id: r.id || r.requestId,
    documentType: r.type || 'Document',
    requestDate: formatYYYYMMDD(r.createdAt || r.submittedAt || new Date()), // ← date d’envoi de la demande
    status: r.status || 'pending', // pending | in_progress | approved | rejected | sent
    reason: r.notes || '',          // ← motif / note de la demande
    rejectionReason: r.rejectionReason || '',
    processedBy: r.assignedToName || null,
    completedDate: r.sentAt
      ? formatYYYYMMDD(r.sentAt)
      : r.approvedAt
      ? formatYYYYMMDD(r.approvedAt)
      : null,
  };
}

const StudentRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeTab, setActiveTab] = useState('requests');

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);

  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [customDocumentType, setCustomDocumentType] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();
  const handleLogout = () => navigate('/etudiant/login');

  const documentTypes = [
    'Attestation de Scolarité',
    "Attestation d'Inscription",
    "Attestation de Réussite",
    'Certificat de Scolarité',
    'Relevé de Notes',
    'Bulletin Semestriel',
    'Convention de Stage',
    'Certificat de Stage',
    'Attestation de Non-Redoublement',
    OTHER_SENTINEL, // Autre (préciser)
  ];

  const normalizeList = (data) => {
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  };

  /** Fetch: toutes mes demandes */
  const fetchRequests = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await api.get('/requests', { params: { scope: 'mine', limit: 100 } });
      const list = normalizeList(data).map(mapRequest);
      setRequests(list);
    } catch (e) {
      console.error('GET /requests?scope=mine ERR', e?.response?.data || e.message);
      setErr(
        e?.response?.data?.error ||
          e?.response?.data?.message ||
          "Impossible de charger vos demandes."
      );
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  // Création: POST /api/requests
  const handleNewRequest = async (e) => {
    e.preventDefault();
    const finalType =
      selectedDocumentType === OTHER_SENTINEL
        ? customDocumentType.trim()
        : selectedDocumentType;

    if (!finalType) { alert('Veuillez préciser le type de document.'); return; }
    if (!requestReason.trim()) { alert('Veuillez saisir le motif de la demande.'); return; }
    if (creating) return;

    setCreating(true);
    try {
      const payload = { type: finalType, notes: requestReason.trim() };
      const { data } = await api.post('/requests', payload);
      setRequests((prev) => [
        mapRequest({ id: data.id, type: finalType, status: data.status || 'pending', notes: requestReason.trim(), createdAt: new Date() }),
        ...prev,
      ]);
      setShowNewRequestModal(false);
      setSelectedDocumentType('');
      setCustomDocumentType('');
      setRequestReason('');
      alert('Votre demande a été envoyée avec succès.');
    } catch (err2) {
      console.error('POST /requests ERR', err2?.response?.data || err2.message);
      alert("Impossible d’envoyer la demande. Réessayez.");
    } finally {
      setCreating(false);
    }
  };

  // Statuts
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':   return CheckCircle;
      case 'rejected':   return XCircle;
      case 'pending':    return AlertCircle;
      case 'in_progress':return Clock;
      case 'sent':       return Send;
      default:           return Clock;
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':   return '#10b981';
      case 'rejected':   return '#ef4444';
      case 'pending':    return '#f59e0b';
      case 'in_progress':return '#3b82f6';
      case 'sent':       return '#0ea5e9';
      default:           return '#6b7280';
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case 'approved':   return 'Approuvé';
      case 'rejected':   return 'Rejeté';
      case 'pending':    return 'En attente';
      case 'in_progress':return 'En cours';
      case 'sent':       return 'Envoyé';
      default:           return 'En attente';
    }
  };

  // Stats simples
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    inProgress: requests.filter((r) => r.status === 'in_progress').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    sent: requests.filter((r) => r.status === 'sent').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="student-requests-page">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className={`student-requests-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="student-requests-page-header">
          <button
            className="student-requests-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="student-requests-page-title">Mes Demandes</h1>
          <div className="student-requests-header-actions" style={{ gap: 8 }}>
            <button className="student-requests-notif-btn" onClick={fetchRequests} title="Rafraîchir">
              <RotateCw size={18} />
            </button>
            <button className="student-requests-notif-btn" aria-label="Notifications">
              <Bell size={20} />
            </button>
          </div>
        </header>

        <div className="student-requests-container">
          {/* Top bar */}
          <div className="student-requests-top-bar">
            <p className="student-requests-subtitle">Gérez et suivez toutes vos demandes de documents</p>
            <button className="student-requests-new-btn" onClick={() => setShowNewRequestModal(true)}>
              <Plus size={20} />
              <span>Nouvelle demande</span>
            </button>
          </div>

          {/* Stats */}
          <div className="student-requests-stats-grid">
            <div className="student-requests-stat-card stat-total">
              <div className="stat-icon"><FileText size={24} /></div>
              <div className="stat-info"><p className="stat-label">Total</p><h3 className="stat-value">{stats.total}</h3></div>
            </div>
            <div className="student-requests-stat-card stat-pending">
              <div className="stat-icon"><AlertCircle size={24} /></div>
              <div className="stat-info"><p className="stat-label">En attente</p><h3 className="stat-value">{stats.pending}</h3></div>
            </div>
            <div className="student-requests-stat-card stat-progress">
              <div className="stat-icon"><Clock size={24} /></div>
              <div className="stat-info"><p className="stat-label">En cours</p><h3 className="stat-value">{stats.inProgress}</h3></div>
            </div>
            <div className="student-requests-stat-card stat-approved">
              <div className="stat-icon"><CheckCircle size={24} /></div>
              <div className="stat-info"><p className="stat-label">Approuvées</p><h3 className="stat-value">{stats.approved}</h3></div>
            </div>
            <div className="student-requests-stat-card stat-sent">
              <div className="stat-icon"><Send size={24} /></div>
              <div className="stat-info"><p className="stat-label">Envoyées</p><h3 className="stat-value">{stats.sent}</h3></div>
            </div>
            <div className="student-requests-stat-card stat-rejected">
              <div className="stat-icon"><XCircle size={24} /></div>
              <div className="stat-info"><p className="stat-label">Rejetées</p><h3 className="stat-value">{stats.rejected}</h3></div>
            </div>
          </div>

          {/* Erreur */}
          {err && (
            <div style={{ color: '#ef4444', margin: '10px 0 16px', fontWeight: 600 }}>
              {err} <button onClick={fetchRequests} style={{ marginLeft: 8 }}>Réessayer</button>
            </div>
          )}

          {/* Grille des demandes */}
          <div className="student-requests-grid">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="student-requests-card" style={{ opacity: 0.6 }}>
                  <div className="request-card-header">
                    <div className="request-icon" />
                    <div className="request-badges">
                      <span className="status-badge" style={{ opacity: 0.5 }}>Chargement…</span>
                    </div>
                  </div>
                  <div className="request-card-body">
                    <div style={{ height: 16, background: '#1f2a3a', borderRadius: 6, width: '60%' }} />
                    <div style={{ height: 12, background: '#1f2a3a', borderRadius: 6, width: '70%', marginTop: 8 }} />
                  </div>
                </div>
              ))
            ) : requests.length === 0 ? (
              <div className="student-requests-empty">
                <FileText size={64} />
                <h3>Aucune demande trouvée</h3>
                <p>Vous n'avez pas encore fait de demande</p>
                <button className="student-requests-empty-btn" onClick={() => setShowNewRequestModal(true)}>
                  <Plus size={20} />
                  Faire une demande
                </button>
              </div>
            ) : (
              requests.map((request) => {
                const StatusIcon = getStatusIcon(request.status);
                return (
                  <div key={request.id} className="student-requests-card">
                    <div className="request-card-header">
                      <div className="request-icon"><FileText size={20} /></div>
                      <div className="request-badges">
                        <span
                          className="status-badge"
                          style={{
                            background: `${getStatusColor(request.status)}1a`,
                            color: getStatusColor(request.status),
                          }}
                        >
                          <StatusIcon size={16} />
                          {getStatusText(request.status)}
                        </span>
                      </div>
                    </div>

                    <div className="request-card-body">
                      <h3 className="request-title">{request.documentType}</h3>
                      {/* ⬇️ Ligne "tracking number" supprimée */}

                      <div className="request-meta">
                        {/* Date d’envoi de la demande */}
                        <div className="request-meta-item">
                          <Calendar size={14} />
                          <span>{request.requestDate}</span>
                        </div>

                        {/* Motif / note de la demande */}
                        {request.reason && (
                          <div className="request-meta-item">
                            <FileText size={14} />
                            <span>{request.reason}</span>
                          </div>
                        )}
                      </div>

                      {request.status === 'rejected' && request.rejectionReason && (
                        <div className="rejection-notice">
                          <AlertCircle size={16} />
                          <p>{request.rejectionReason}</p>
                        </div>
                      )}
                    </div>

                    <div className="request-card-footer">
                      <button
                        className="request-action-btn view"
                        onClick={() => {
                          setActiveRequest(request);
                          setShowDetailsModal(true);
                        }}
                      >
                        <Eye size={16} />
                        <span>Détails</span>
                      </button>

                      {/* ⬇️ Pas de bouton Télécharger ici */}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Détails */}
      {showDetailsModal && activeRequest && (
        <div className="student-requests-modal-backdrop">
          <div className="student-requests-modal">
            <button className="student-requests-modal-close" onClick={() => setShowDetailsModal(false)}>
              <X size={22} />
            </button>
            <h3 className="student-requests-modal-title">Détail de la demande</h3>
            <div className="student-requests-modal-fields">
              <div className="modal-field"><strong>Document :</strong><span>{activeRequest.documentType}</span></div>
              <div className="modal-field"><strong>Date d’envoi :</strong><span>{activeRequest.requestDate}</span></div>
              {activeRequest.reason && (
                <div className="modal-field"><strong>Motif :</strong><span>{activeRequest.reason}</span></div>
              )}
              <div className="modal-field">
                <strong>Statut :</strong>
                <span
                  style={{
                    padding: '0.3rem 0.8rem',
                    borderRadius: '999px',
                    background: `${getStatusColor(activeRequest.status)}1a`,
                    color: getStatusColor(activeRequest.status),
                    fontWeight: 600,
                    display: 'inline-block',
                  }}
                >
                  {getStatusText(activeRequest.status)}
                </span>
              </div>
              {activeRequest.rejectionReason && (
                <div className="modal-field">
                  <strong style={{ color: '#ef4444' }}>Motif du rejet :</strong>
                  <span style={{ color: '#ef4444' }}>{activeRequest.rejectionReason}</span>
                </div>
              )}
            </div>
            <div className="student-requests-modal-footer">
              {/* ⬇️ Pas de bouton Télécharger dans la modale non plus */}
              <button className="student-requests-close-btn" onClick={() => setShowDetailsModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nouvelle demande */}
      {showNewRequestModal && (
        <div className="student-requests-modal-backdrop">
          <div className="student-requests-modal">
            <button className="student-requests-modal-close" onClick={() => setShowNewRequestModal(false)}>
              <X size={22} />
            </button>
            <h3 className="student-requests-modal-title">
              <Plus size={18} style={{ verticalAlign: 'middle', marginRight: 8, color: '#5eead4' }} />
              Nouvelle demande de document
            </h3>
            <form onSubmit={handleNewRequest} className="student-requests-form">
              <div className="form-group">
                <label className="form-label">Type de document *</label>
                <select
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Sélectionnez un type de document</option>
                  {documentTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type === OTHER_SENTINEL ? 'Autre (préciser)' : type}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDocumentType === OTHER_SENTINEL && (
                <div className="form-group">
                  <label className="form-label">Précisez le type *</label>
                  <input
                    type="text"
                    value={customDocumentType}
                    onChange={(e) => setCustomDocumentType(e.target.value)}
                    className="form-input"
                    placeholder="Ex : Attestation de bourse, Certificat spécifique..."
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Motif de la demande *</label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="form-textarea"
                  placeholder="Ex: Pour un dossier de bourse, pour l'employeur, etc."
                  rows="4"
                  required
                />
              </div>

              <div className="student-requests-modal-footer">
                <button
                  type="button"
                  className="student-requests-cancel-btn"
                  onClick={() => setShowNewRequestModal(false)}
                  disabled={creating}
                >
                  Annuler
                </button>
                <button type="submit" disabled={creating} className="student-requests-submit-btn">
                  <Send size={18} />
                  {creating ? 'Envoi…' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRequests;
