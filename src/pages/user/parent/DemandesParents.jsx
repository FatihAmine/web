// src/pages/user/parent/DemandesParents.jsx
import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from '../../component/sidebarparent';
import CustomDropdown from '../../component/CustomDropdown';
import {
  Bell,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Menu,
  X,
  Plus,
  Eye,
  Download,
  Calendar,
  Send,
  User,
  Users,
  RotateCw
} from 'lucide-react';
import '../../../css/parent/DemandesParents.css';
import { useNavigate } from 'react-router-dom';
import api from '../../../api'; // axios avec ID token

// Utils dates (ISO / Date / Firestore Timestamp)
function toDateAny(v) {
  if (!v) return new Date();
  if (v instanceof Date) return v;
  if (typeof v === 'string' || typeof v === 'number') return new Date(v);
  if (v?._seconds) return new Date(v._seconds * 1000);
  if (v?.seconds) return new Date(v.seconds * 1000);
  return new Date(v);
}

// map Firestore request -> UI
function mapRequest(r) {
  const rf = r.requestedFor || {};
  const childName =
    rf.displayName ||
    [rf.prenom, rf.nom].filter(Boolean).join(' ') ||
    rf.email ||
    '—';

  return {
    id: r.id,
    childUid: r.requestedForUid || null,
    childName,
    documentType: r.type || 'Document',
    requestDate: toDateAny(r.createdAt).toISOString().slice(0, 10),
    status: r.status || 'pending',
    reason: r.notes || '',
    rejectionReason: r.rejectionReason || '',
    processedBy: r.assignedToName || '',
    downloadUrl: r.downloadUrl || '' // si tu la stockes côté backend
  };
}

const DemandesParents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeTab, setActiveTab] = useState('requests');

  // Filtres
  const [filterChild, setFilterChild] = useState('');

  // Enfants
  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [childrenError, setChildrenError] = useState('');

  // Demandes (réelles depuis backend)
  const [requests, setRequests] = useState([]);
  const [loadingReq, setLoadingReq] = useState(true);
  const [reqError, setReqError] = useState('');

  // Formulaire nouvelle demande
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedChildUid, setSelectedChildUid] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [otherDocType, setOtherDocType] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();
  const handleLogout = () => navigate('/parent/login');

  // Types de documents
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
    '__OTHER__'
  ];

  // Options enfant
  const childOptions = useMemo(
    () => [
      { value: '', label: 'Tous les enfants', icon: Users, color: '#5eead4' },
      ...children.map((c) => ({
        value: c.uid,
        label:
          c.displayName ||
          `${c.prenom || ''} ${c.nom || ''}`.trim() ||
          c.email ||
          c.uid,
        icon: User,
        color: '#5eead4'
      }))
    ],
    [children]
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'in_progress': return Clock;
      case 'pending':
      default: return AlertCircle;
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'in_progress': return '#3b82f6';
      case 'pending':
      default: return '#f59e0b';
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'in_progress': return 'En cours';
      case 'pending':
      default: return 'En attente';
    }
  };

  // ====== API calls ======
  const fetchChildren = async () => {
    setLoadingChildren(true);
    setChildrenError('');
    try {
      const { data } = await api.get('/parent/children');
      setChildren(Array.isArray(data?.items) ? data.items : []);
    } catch (e) {
      console.error('GET /parent/children failed', e?.response?.data || e.message);
      setChildrenError("Impossible de charger la liste des enfants.");
      setChildren([]);
    } finally {
      setLoadingChildren(false);
    }
  };

  // ⚠️ Ne récupère que les demandes de CE parent : scope=mine
  const fetchRequests = async () => {
    setLoadingReq(true);
    setReqError('');
    try {
      const { data } = await api.get('/requests', {
        params: { scope: 'mine', limit: 100 }
      });
      const src = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setRequests(src.map(mapRequest));
    } catch (e) {
      console.error('GET /requests?scope=mine failed', e?.response?.data || e.message);
      setReqError("Impossible de charger vos demandes.");
      setRequests([]);
    } finally {
      setLoadingReq(false);
    }
  };

  // on mount: charger enfants + demandes
  useEffect(() => {
    fetchChildren();
    fetchRequests();
  }, []);

  // Filtrage local par enfant (uid)
  const filteredRequests = useMemo(() => {
    if (!filterChild) return requests;
    return requests.filter((r) => r.childUid === filterChild);
  }, [requests, filterChild]);

  // Stats (Total = pending + in_progress)
  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === 'pending').length;
    const inProgress = requests.filter((r) => r.status === 'in_progress').length;
    const approved = requests.filter((r) => r.status === 'approved').length;
    return {
      total: pending + inProgress,
      pending,
      inProgress,
      approved
    };
  }, [requests]);

  // Nouvelle demande
  const handleNewRequest = async (e) => {
    e.preventDefault();
    if (!selectedChildUid) return alert('Sélectionnez un enfant.');
    let typeToSend = selectedDocumentType;
    if (selectedDocumentType === '__OTHER__') {
      if (!(otherDocType || '').trim()) return alert('Veuillez préciser le type de document.');
      typeToSend = otherDocType.trim();
    }
    if (!typeToSend) return alert('Sélectionnez un type de document.');
    if (!requestReason.trim()) return alert('Indiquez un motif.');

    if (creating) return;
    setCreating(true);
    try {
      const payload = {
        studentUid: selectedChildUid,
        type: typeToSend,
        notes: requestReason.trim()
      };
      await api.post('/requests', payload);
      await fetchRequests(); // rafraîchir
      setShowNewRequestModal(false);
      setSelectedChildUid('');
      setSelectedDocumentType('');
      setOtherDocType('');
      setRequestReason('');
      alert('Votre demande a été envoyée avec succès.');
    } catch (err) {
      console.error('CREATE REQUEST (parent) ERR', err?.response?.data || err.message);
      alert("Impossible d'envoyer la demande. Réessayez.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="parent-requests-page">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className={`parent-requests-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="parent-requests-page-header">
          <button
            className="parent-requests-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="parent-requests-page-title">Mes Demandes</h1>
          <div className="parent-requests-header-actions">
            <button className="parent-requests-notif-btn" onClick={fetchRequests} title="Rafraîchir">
              <RotateCw size={18} />
            </button>
            <button className="parent-requests-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="parent-requests-container">
          <div className="parent-requests-top-bar">
            <p className="parent-requests-subtitle">Gérez les demandes de documents pour vos enfants</p>
            <button className="parent-requests-new-btn" onClick={() => setShowNewRequestModal(true)}>
              <Plus size={20} />
              <span>Nouvelle demande</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="parent-requests-stats-grid">
            <div className="parent-requests-stat-card stat-total">
              <div className="stat-icon"><FileText size={24} /></div>
              <div className="stat-info">
                <p className="stat-label">Total (actives)</p>
                <h3 className="stat-value">{stats.total}</h3>
              </div>
            </div>
            <div className="parent-requests-stat-card stat-pending">
              <div className="stat-icon"><AlertCircle size={24} /></div>
              <div className="stat-info">
                <p className="stat-label">En attente</p>
                <h3 className="stat-value">{stats.pending}</h3>
              </div>
            </div>
            <div className="parent-requests-stat-card stat-progress">
              <div className="stat-icon"><Clock size={24} /></div>
              <div className="stat-info">
                <p className="stat-label">En cours</p>
                <h3 className="stat-value">{stats.inProgress}</h3>
              </div>
            </div>
            <div className="parent-requests-stat-card stat-approved">
              <div className="stat-icon"><CheckCircle size={24} /></div>
              <div className="stat-info">
                <p className="stat-label">Approuvées</p>
                <h3 className="stat-value">{stats.approved}</h3>
              </div>
            </div>
          </div>

          {/* Filtres : uniquement par enfant */}
          <div className="parent-requests-filters">
            <CustomDropdown options={childOptions} value={filterChild} onChange={setFilterChild} icon={Users} />
          </div>

          {/* Erreurs / chargement */}
          {reqError && (
            <div style={{ color: '#ef4444', margin: '8px 0 16px', fontWeight: 600 }}>
              {reqError} <button onClick={fetchRequests} style={{ marginLeft: 8 }}>Réessayer</button>
            </div>
          )}

          {/* Liste des demandes */}
          <div className="parent-requests-grid">
            {loadingReq ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="parent-requests-card" style={{ opacity: 0.6 }}>
                  <div className="request-card-header">
                    <div className="request-icon" />
                    <div className="request-badges">
                      <span className="status-badge" style={{ opacity: 0.5 }}>Chargement…</span>
                    </div>
                  </div>
                  <div className="request-card-body">
                    <div style={{ height: 14, width: 160, background: '#1f2a3a', borderRadius: 6, marginBottom: 8 }} />
                    <div style={{ height: 12, width: '70%', background: '#1f2a3a', borderRadius: 6, marginBottom: 6 }} />
                    <div style={{ height: 12, width: '40%', background: '#1f2a3a', borderRadius: 6 }} />
                  </div>
                </div>
              ))
            ) : filteredRequests.length === 0 ? (
              <div className="parent-requests-empty">
                <FileText size={64} />
                <h3>Aucune demande trouvée</h3>
                <p>Modifiez le filtre (enfant) ou créez une nouvelle demande.</p>
                <button className="parent-requests-empty-btn" onClick={() => setShowNewRequestModal(true)}>
                  <Plus size={20} />
                  Faire une demande
                </button>
              </div>
            ) : (
              filteredRequests.map((request) => {
                const StatusIcon = getStatusIcon(request.status);
                return (
                  <div key={request.id} className="parent-requests-card">
                    <div className="request-card-header">
                      <div className="request-icon"><FileText size={20} /></div>
                      <div className="request-badges">
                        <span
                          className="status-badge"
                          style={{ background: `${getStatusColor(request.status)}1a`, color: getStatusColor(request.status) }}
                        >
                          <StatusIcon size={16} />
                          {getStatusText(request.status)}
                        </span>
                      </div>
                    </div>

                    <div className="request-card-body">
                      <h3 className="request-title">{request.documentType}</h3>

                      <div className="request-child-badge">
                        <User size={14} />
                        <span>{request.childName}</span>
                      </div>

                      {/* ❌ Numéro de suivi supprimé */}
                      {/* <p className="request-tracking">#{request.trackingNumber}</p> */}

                      <div className="request-meta">
                        <div className="request-meta-item">
                          <Calendar size={14} />
                          <span>{request.requestDate}</span>
                        </div>
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
                      <button className="request-action-btn view" onClick={() => {}}>
                        <Eye size={16} />
                        <span>Détails</span>
                      </button>
                      {request.status === 'approved' && request.downloadUrl && (
                        <a href={request.downloadUrl} className="parent-requests-download-btn" download>
                          <Download size={16} />
                          <span>Télécharger</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Modal Nouvelle demande */}
      {showNewRequestModal && (
        <div className="parent-requests-modal-backdrop">
          <div className="parent-requests-modal">
            <button className="parent-requests-modal-close" onClick={() => setShowNewRequestModal(false)}>
              <X size={22} />
            </button>
            <h3 className="parent-requests-modal-title">
              <Plus size={18} style={{ verticalAlign: 'middle', marginRight: 8, color: '#5eead4' }} />
              Nouvelle demande de document
            </h3>

            <form onSubmit={handleNewRequest} className="parent-requests-form">
              {/* Enfant concerné */}
              <div className="form-group">
                <label className="form-label">Enfant concerné *</label>
                <select
                  value={selectedChildUid}
                  onChange={(e) => setSelectedChildUid(e.target.value)}
                  className="form-select"
                  required
                  disabled={loadingChildren}
                >
                  <option value="">{loadingChildren ? 'Chargement…' : 'Sélectionnez un enfant'}</option>
                  {children.map((c) => {
                    const label =
                      c.displayName ||
                      `${c.prenom || ''} ${c.nom || ''}`.trim() ||
                      c.email ||
                      c.uid;
                    const sub = [c.niveau, c.filiere].filter(Boolean).join(' • ');
                    return (
                      <option key={c.uid} value={c.uid}>
                        {label}{sub ? ` — ${sub}` : ''}
                      </option>
                    );
                  })}
                </select>
                {childrenError && <p className="form-hint error">{childrenError}</p>}
                {!loadingChildren && !childrenError && children.length === 0 && (
                  <p className="form-hint">Aucun enfant rattaché à votre compte.</p>
                )}
              </div>

              {/* Type de document */}
              <div className="form-group">
                <label className="form-label">Type de document *</label>
                <select
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Sélectionnez un type</option>
                  {documentTypes.map((type, idx) =>
                    type === '__OTHER__'
                      ? <option key={idx} value="__OTHER__">Autre (préciser)</option>
                      : <option key={idx} value={type}>{type}</option>
                  )}
                </select>
              </div>

              {/* Champ "Autre" */}
              {selectedDocumentType === '__OTHER__' && (
                <div className="form-group">
                  <label className="form-label">Préciser le document *</label>
                  <input
                    type="text"
                    value={otherDocType}
                    onChange={(e) => setOtherDocType(e.target.value)}
                    className="form-input"
                    placeholder="Ex: Certificat de scolarité bilingue, etc."
                    required
                  />
                </div>
              )}

              {/* Motif */}
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

              <div className="parent-requests-modal-footer">
                <button
                  type="button"
                  className="parent-requests-cancel-btn"
                  onClick={() => setShowNewRequestModal(false)}
                  disabled={creating}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="parent-requests-submit-btn"
                  disabled={creating || loadingChildren}
                >
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

export default DemandesParents;
