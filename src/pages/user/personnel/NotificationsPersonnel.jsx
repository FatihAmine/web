// src/pages/personnel/NotificationsPersonnel.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../component/sidebarpersonnel';
import {
  Menu,
  X,
  Bell,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  FileText,
  MessageSquare,
  Clock,
  UserCircle,
  RotateCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/personnel/NotificationsPersonnel.css';
import api from '../../../api'; // ✅ axios avec ID token

// (Optionnel) en-tête pour la sidebar — tu peux le supprimer si ton Sidebar n'en a pas besoin
const userData = {
  firstName: '—',
  lastName: '—',
  role: 'Personnel',
  profilePic: 'https://ui-avatars.com/api/?name=P&background=17766e&color=fff&size=200',
};

// -- utils temps (accepte ISO, Date, Firestore Timestamp)
function toDateAny(v) {
  if (!v) return new Date();
  if (v instanceof Date) return v;
  if (typeof v === 'string' || typeof v === 'number') return new Date(v);
  if (v?._seconds) return new Date(v._seconds * 1000);
  if (v?.seconds) return new Date(v.seconds * 1000);
  return new Date(v);
}
function formatTimeAgo(value) {
  const ts = toDateAny(value);
  const diffMs = Date.now() - ts.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  return `il y a ${d} j`;
}

// badge de statut
function StatusBadge({ status }) {
  const map = {
    pending: { color: '#f59e0b', text: 'En attente', Icon: AlertCircle },
    in_progress: { color: '#3b82f6', text: 'En cours', Icon: Clock },
    approved: { color: '#10b981', text: 'Approuvée', Icon: CheckCircle },
    rejected: { color: '#ef4444', text: 'Rejetée', Icon: XCircle },
  };
  const { color, text, Icon } = map[status] || map.pending;
  return (
    <span
      className="notif-status-badge"
      style={{
        background: `${color}1a`,
        color,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <Icon size={14} />
      {text}
    </span>
  );
}

// chip rôle
function RoleChip({ role }) {
  const label = role === 'parent' ? 'Parent' : 'Étudiant';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '0.2rem 0.6rem',
        borderRadius: 999,
        fontSize: 12,
        background: '#5eead41a',
        color: '#17766e',
        fontWeight: 600,
      }}
      title={`Rôle: ${label}`}
    >
      <UserCircle size={14} /> {label}
    </span>
  );
}

// mappe une notif venant du backend vers le format UI attendu
function mapNotif(n) {
  const request = n.request || n; // document enrichi ou résumé
  const requestedBy = request.requestedBy || n.requestedBy || {};
  const requestedFor = request.requestedFor || n.requestedFor || {};

  // ⚠️ On garde séparément: id de la notif ET id de la request
  const requestId =
    request.requestId || request.id || n.requestId || null;

  return {
    notifId: n.id || request.id || request.requestId || null, // id notification (clé React si besoin)
    requestId, // id de la demande — utilisé pour PATCH status
    kind: n.kind || request.kind || null, // request_submitted | request_approved | request_rejected | document_sent
    createdAt: n.createdAt || request.createdAt,
    status: request.status || n.status || 'pending',
    type: request.type || n.type || 'Document',
    notes: request.notes || n.notes || '',
    approvedAt: request.approvedAt || n.approvedAt,
    rejectedAt: request.rejectedAt || n.rejectedAt,
    rejectionReason: request.rejectionReason || n.rejectionReason,
    requestedBy: {
      name:
        requestedBy.name ||
        requestedBy.displayName ||
        [requestedBy.prenom, requestedBy.nom].filter(Boolean).join(' ') ||
        '—',
      role: requestedBy.role || request.requestedByRole || 'etudiant',
    },
    requestedFor: {
      name:
        requestedFor.name ||
        requestedFor.displayName ||
        [requestedFor.prenom, requestedFor.nom].filter(Boolean).join(' ') ||
        '—',
      filiere: requestedFor.filiere || null,
      niveau: requestedFor.niveau || null,
    },
  };
}

const NotificationsPersonnel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeTab, setActiveTab] = useState('notifications');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  // états pour actions backend
  const [actBusyId, setActBusyId] = useState(null); // id de request en cours d'action
  const [rejectModal, setRejectModal] = useState({ open: false, requestId: null, reason: '' });

  const navigate = useNavigate();
  const handleLogout = () => navigate('/personnel');

  // Normalise différentes enveloppes de réponse
  const normalizeList = (data) => {
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.notifications)) return data.notifications;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  };

  // Récupère les notifs staff (role:personnel)
  const fetchNotifs = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/notifications', {
        params: { scope: 'personnel', limit: 100 },
      });
      const list = normalizeList(data).map(mapNotif);
      setItems(list);
    } catch (e) {
      console.error('NOTIFS ERR', e?.response?.data || e.message);
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        'Impossible de charger les notifications.';
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
    // (optionnel) rafraîchissement périodique
    // const t = setInterval(fetchNotifs, 30000);
    // return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    const src = items;
    if (!q.trim()) return src;
    const s = q.toLowerCase();
    return src.filter((n) => {
      const hay = [
        n.type,
        n.notes,
        n.requestedBy?.name,
        n.requestedBy?.role,
        n.requestedFor?.name,
        n.requestedFor?.filiere,
        n.requestedFor?.niveau,
        n.status,
        n.kind,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(s);
    });
  }, [items, q]);

  const unreadCount = items.filter(
    (n) => n.status === 'pending' || n.status === 'in_progress'
  ).length;

  // --- Actions BACKEND ---

  const approveRequest = async (requestId) => {
    if (!requestId) return;
    setActBusyId(requestId);
    setError('');
    try {
      await api.patch(`/requests/${requestId}/status`, { status: 'approved' });
      // MAJ locale: on marque cette carte "approved"
      setItems((prev) =>
        prev.map((n) =>
          n.requestId === requestId ? { ...n, status: 'approved', approvedAt: new Date() } : n
        )
      );
    } catch (e) {
      console.error('APPROVE ERR', e?.response?.data || e.message);
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "Échec de l'approbation.";
      setError(msg);
    } finally {
      setActBusyId(null);
    }
  };

  const openReject = (requestId) => setRejectModal({ open: true, requestId, reason: '' });
  const cancelReject = () => setRejectModal({ open: false, requestId: null, reason: '' });

  const submitReject = async () => {
    if (!rejectModal.requestId || !rejectModal.reason.trim()) return;
    setActBusyId(rejectModal.requestId);
    setError('');
    try {
      await api.patch(`/requests/${rejectModal.requestId}/status`, {
        status: 'rejected',
        rejectionReason: rejectModal.reason.trim(),
      });
      // MAJ locale
      setItems((prev) =>
        prev.map((n) =>
          n.requestId === rejectModal.requestId
            ? {
                ...n,
                status: 'rejected',
                rejectedAt: new Date(),
                rejectionReason: rejectModal.reason.trim(),
              }
            : n
        )
      );
      cancelReject();
    } catch (e) {
      console.error('REJECT ERR', e?.response?.data || e.message);
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        'Échec du rejet.';
      setError(msg);
    } finally {
      setActBusyId(null);
    }
  };

  return (
    <div className="personnel-notifications-page">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userData={userData}
      />

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <main
        className={`personnel-main-content ${
          sidebarOpen ? 'sidebar-open' : 'sidebar-closed'
        }`}
      >
        <header className="personnel-header">
          <button
            className="personnel-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="personnel-page-title">Notifications (Demandes)</h1>
          <div className="personnel-header-actions" style={{ gap: 8 }}>
            <button className="personnel-notif-btn" onClick={fetchNotifs} title="Rafraîchir">
              <RotateCw size={18} />
            </button>
            <button className="personnel-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-badge" />}
            </button>
          </div>
        </header>

        <div className="personnel-notifications-content">
          {/* Barre de recherche */}
          <div className="personnel-notif-toolbar" style={{ gap: 12 }}>
            <div className="admin-notif-searchrow">
              <Search size={18} />
              <input
                className="admin-notif-search"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher (type, motif, étudiant, parent, statut)…"
                aria-label="Rechercher"
              />
            </div>
          </div>

          {error && (
            <div style={{ color: '#ef4444', margin: '10px 0 16px', fontWeight: 600 }}>
              {error}{' '}
              <button onClick={fetchNotifs} style={{ marginLeft: 8 }}>
                Réessayer
              </button>
            </div>
          )}

          {/* Liste / Chargement */}
          {loading ? (
            <div className="personnel-notifications-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="personnel-notification-card" style={{ opacity: 0.6 }}>
                  <div className="notif-card-header" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="notif-icon" style={{ background: '#263244', width: 48, height: 48 }} />
                      <div style={{ height: 14, width: 140, background: '#1f2a3a', borderRadius: 6 }} />
                    </div>
                  </div>
                  <div className="notif-card-body">
                    <div style={{ height: 12, background: '#1f2a3a', borderRadius: 6 }} />
                    <div style={{ height: 12, background: '#1f2a3a', borderRadius: 6, marginTop: 8 }} />
                    <div style={{ height: 12, background: '#1f2a3a', borderRadius: 6, marginTop: 8 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="personnel-notifications-grid">
              {filtered.length === 0 ? (
                <div className="personnel-notifications-empty">
                  <Bell size={64} />
                  <h3>Aucune notification</h3>
                  <p>Essayez un autre mot-clé.</p>
                </div>
              ) : (
                filtered.map((n) => {
                  const canAct =
                    n.kind === 'request_submitted' &&
                    (n.status === 'pending' || n.status === 'in_progress') &&
                    !!n.requestId;

                  return (
                    <div key={`${n.notifId || n.requestId}`} className="personnel-notification-card">
                      <div className="notif-card-header" style={{ justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            className="notif-icon"
                            style={{ background: '#17766e1a', color: '#17766e' }}
                            title="Demande de document"
                          >
                            <FileText size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700 }}>
                              {n.type || 'Type non renseigné'}
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                marginTop: 4,
                              }}
                            >
                              <StatusBadge status={n.status} />
                              <span className="notif-time" title={toDateAny(n.createdAt).toLocaleString()}>
                                <Clock size={14} style={{ marginRight: 6 }} />
                                {formatTimeAgo(n.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* ID masqué */}
                      </div>

                      <div className="notif-card-body">
                        {/* Envoyée par */}
                        <div className="notif-row">
                          <div className="notif-label">
                            <User size={16} />
                            <span>Envoyée par</span>
                          </div>
                          <div className="notif-value">
                            <strong>{n.requestedBy?.name || '—'}</strong>{' '}
                            <RoleChip role={n.requestedBy?.role} />
                          </div>
                        </div>

                        {/* Pour */}
                        <div className="notif-row">
                          <div className="notif-label">
                            <User size={16} />
                            <span>Pour</span>
                          </div>
                          <div className="notif-value">
                            <strong>{n.requestedFor?.name || '—'}</strong>
                            {n.requestedFor?.filiere || n.requestedFor?.niveau ? (
                              <span style={{ marginLeft: 8, opacity: 0.8 }}>
                                {[n.requestedFor?.niveau || '', n.requestedFor?.filiere || '']
                                  .filter(Boolean)
                                  .join(' • ')}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* Motif */}
                        <div className="notif-row">
                          <div className="notif-label">
                            <MessageSquare size={16} />
                            <span>Motif</span>
                          </div>
                          <div className="notif-value">{n.notes || '—'}</div>
                        </div>

                        {/* Rejet (si déjà rejetée) */}
                        {n.status === 'rejected' && n.rejectionReason && (
                          <div className="notif-row">
                            <div className="notif-label" style={{ color: '#ef4444' }}>
                              <XCircle size={16} />
                              <span>Motif du rejet</span>
                            </div>
                            <div className="notif-value" style={{ color: '#ef4444' }}>
                              {n.rejectionReason}
                            </div>
                          </div>
                        )}

                        {/* Approuvée (si déjà approuvée) */}
                        {n.status === 'approved' && (
                          <div className="notif-row">
                            <div className="notif-label" style={{ color: '#10b981' }}>
                              <CheckCircle size={16} />
                              <span>Demande approuvée</span>
                            </div>
                            <div className="notif-value" style={{ color: '#10b981' }}>
                              {n.approvedAt ? `(${formatTimeAgo(n.approvedAt)})` : ''}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="notif-card-footer">
                        {canAct ? (
                          <>
                            <button
                              className="notif-action-btn approve"
                              onClick={() => approveRequest(n.requestId)}
                              title="Approuver"
                              disabled={actBusyId === n.requestId}
                            >
                              <CheckCircle size={16} />
                              <span>{actBusyId === n.requestId ? 'En cours…' : 'Approuver'}</span>
                            </button>
                            <button
                              className="notif-action-btn reject"
                              onClick={() => openReject(n.requestId)}
                              title="Rejeter"
                              disabled={actBusyId === n.requestId}
                            >
                              <XCircle size={16} />
                              <span>Rejeter</span>
                            </button>
                          </>
                        ) : n.status === 'approved' ? (
                          <div className="notif-state-info" style={{ color: '#10b981', fontWeight: 600 }}>
                            <CheckCircle size={16} style={{ marginRight: 6 }} />
                            Demande approuvée
                          </div>
                        ) : n.status === 'rejected' ? (
                          <div className="notif-state-info" style={{ color: '#ef4444', fontWeight: 600 }}>
                            <XCircle size={16} style={{ marginRight: 6 }} />
                            Demande rejetée
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal de rejet (intégré au backend) */}
      {rejectModal.open && (
        <div className="personnel-notifications-modal-backdrop">
          <div className="personnel-notifications-modal">
            <button className="personnel-modal-close" onClick={cancelReject}>
              <X size={22} />
            </button>
            <h3 className="personnel-modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <XCircle size={18} style={{ color: '#ef4444' }} />
              Rejeter la demande
            </h3>
            <div className="personnel-modal-fields">
              <label className="form-label">Motif du rejet *</label>
              <textarea
                rows={4}
                className="form-textarea"
                placeholder="Expliquez la raison du rejet…"
                value={rejectModal.reason}
                onChange={(e) => setRejectModal((m) => ({ ...m, reason: e.target.value }))}
              />
            </div>
            <div className="personnel-modal-actions" style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button className="personnel-modal-cancel" onClick={cancelReject}>
                Annuler
              </button>
              <button
                className="personnel-modal-submit"
                onClick={submitReject}
                disabled={!rejectModal.reason.trim() || actBusyId === rejectModal.requestId}
                style={{ background: '#ef4444', color: 'white' }}
              >
                {actBusyId === rejectModal.requestId ? 'Envoi…' : 'Rejeter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPersonnel;
