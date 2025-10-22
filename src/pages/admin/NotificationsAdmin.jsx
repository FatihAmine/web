// src/pages/admin/NotificationsAdmin.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../component/sidebar';
import {
  Menu,
  X,
  Bell,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  FileText,
  MessageSquare,
  Clock,
  UserCircle,
  RotateCw
} from 'lucide-react';
import '../../css/admin/NotificationsAdmin.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // ✅ axios avec ID token

const userData = {
  firstName: 'Mohammed',
  lastName: 'Alaoui',
  role: 'Super Administrateur',
  profilePic:
    'https://ui-avatars.com/api/?name=Mohammed+Alaoui&background=17766e&color=fff&size=200',
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
      style={{ background: `${color}1a`, color, display: 'inline-flex', alignItems: 'center', gap: 6 }}
    >
      <Icon size={14} />
      {text}
    </span>
  );
}

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
  // côté backend on peut renvoyer soit un document "notification" enrichi,
  // soit un résumé d'une demande. On gère les deux cas.
  const request = n.request || n; // fallback
  const requestedBy = request.requestedBy || n.requestedBy || {};
  const requestedFor = request.requestedFor || n.requestedFor || {};

  return {
    id: request.id || request.requestId || n.id, // seulement pour la clé React
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

const AdminNotifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeTab, setActiveTab] = useState('notifications');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  const [rejectModal, setRejectModal] = useState({ open: false, id: null, reason: '' });

  const navigate = useNavigate();
  const handleLogout = () => navigate('/admin');

  // charge les notifications admin
  const fetchNotifs = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/notifications', {
        params: { scope: 'admin', limit: 100 },
      });
      // data.items attendu → sinon fallback à data
      const list = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setItems(list.map(mapNotif));
    } catch (e) {
      console.error('NOTIFS ERR', e?.response?.data || e.message);
      setError("Impossible de charger les notifications.");
      setItems([]); // vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
    // (optionnel) rechargement périodique :
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
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(s);
    });
  }, [items, q]);

  // (UI démo) approbation / rejet locales — à remplacer plus tard par un PATCH backend si tu veux agir depuis cette page.
  const approveLocal = (id) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, status: 'approved', approvedAt: new Date() } : n)));
  const openReject = (id) => setRejectModal({ open: true, id, reason: '' });
  const submitRejectLocal = () => {
    if (!rejectModal.id || !rejectModal.reason.trim()) return;
    setItems((prev) =>
      prev.map((n) =>
        n.id === rejectModal.id
          ? { ...n, status: 'rejected', rejectedAt: new Date(), rejectionReason: rejectModal.reason.trim() }
          : n
      )
    );
    setRejectModal({ open: false, id: null, reason: '' });
  };
  const cancelReject = () => setRejectModal({ open: false, id: null, reason: '' });

  return (
    <div className="admin-notif-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userData={userData}
      />

      {sidebarOpen && <div className="admin-notif-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className={`admin-notif-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <button
            className="admin-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="admin-page-title">Notifications (Demandes)</h1>
          <div className="admin-header-actions" style={{ gap: 8 }}>
            <button className="admin-search-btn" onClick={fetchNotifs} title="Rafraîchir">
              <RotateCw size={18} />
            </button>
            <button className="admin-search-btn" aria-label="Notifications">
              <Bell size={20} />
              {items.some((n) => n.status === 'pending' || n.status === 'in_progress') && (
                <span className="notification-badge" />
              )}
            </button>
          </div>
        </header>

        <main className="admin-notif-main">
          <div className="admin-notif-toolbar" style={{ gap: 12 }}>
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
            <div style={{ color: '#ef4444', marginBottom: 16, fontWeight: 600 }}>
              {error} <button onClick={fetchNotifs} style={{ marginLeft: 8 }}>Réessayer</button>
            </div>
          )}

          {/* Chargement */}
          {loading ? (
            <div className="admin-notif-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="admin-notif-card" style={{ opacity: 0.6 }}>
                  <div className="notif-card-header">
                    <div className="notif-icon" style={{ background: '#263244', width: 48, height: 48 }} />
                    <div style={{ height: 14, width: 140, background: '#1f2a3a', borderRadius: 6 }} />
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
            <div className="admin-notif-grid">
              {filtered.length === 0 ? (
                <div className="admin-notif-empty-state">
                  <Bell size={64} />
                  <h3>Aucune notification</h3>
                  <p>Essayez un autre mot-clé.</p>
                </div>
              ) : (
                filtered.map((n) => (
                  <div key={n.id} className="admin-notif-card">
                    <div className="notif-card-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="notif-icon" style={{ background: '#17766e1a', color: '#17766e' }} title="Demande de document">
                          <FileText size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{n.type || 'Type non renseigné'}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                            <StatusBadge status={n.status} />
                            <span className="notif-time" title={toDateAny(n.createdAt).toLocaleString()}>
                              <Clock size={14} style={{ marginRight: 6 }} />
                              {formatTimeAgo(n.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* (ID volontairement masqué côté UI) */}
                    </div>

                    <div className="notif-card-body">
                      <div className="notif-row">
                        <div className="notif-label">
                          <User size={16} />
                          <span>Envoyée par</span>
                        </div>
                        <div className="notif-value">
                          <strong>{n.requestedBy?.name || '—'}</strong> <RoleChip role={n.requestedBy?.role} />
                        </div>
                      </div>

                      <div className="notif-row">
                        <div className="notif-label">
                          <User size={16} />
                          <span>Pour</span>
                        </div>
                        <div className="notif-value">
                          <strong>{n.requestedFor?.name || '—'}</strong>
                          {n.requestedFor?.filiere || n.requestedFor?.niveau ? (
                            <span style={{ marginLeft: 8, opacity: 0.8 }}>
                              {[n.requestedFor?.niveau || '', n.requestedFor?.filiere || ''].filter(Boolean).join(' • ')}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="notif-row">
                        <div className="notif-label">
                          <MessageSquare size={16} />
                          <span>Motif</span>
                        </div>
                        <div className="notif-value">{n.notes || '—'}</div>
                      </div>

                      {n.status === 'rejected' && n.rejectionReason && (
                        <div className="notif-row">
                          <div className="notif-label" style={{ color: '#ef4444' }}>
                            <XCircle size={16} />
                            <span>Motif du rejet</span>
                          </div>
                          <div className="notif-value" style={{ color: '#ef4444' }}>{n.rejectionReason}</div>
                        </div>
                      )}

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
                      {(n.status === 'pending' || n.status === 'in_progress') && (
                        <>
                          <button
                            className="notif-action-btn view"
                            title="Voir les détails (démo)"
                            onClick={() => alert(`Aperçu (${n.type})`)}
                          >
                            <Eye size={16} />
                            <span>Détails</span>
                          </button>
                          {/* Actions locales démo (remplace par PATCH backend si tu veux agir ici) */}
                          <button className="notif-action-btn approve" onClick={() => approveLocal(n.id)} title="Approuver">
                            <CheckCircle size={16} />
                            <span>Approuver</span>
                          </button>
                          <button className="notif-action-btn reject" onClick={() => openReject(n.id)} title="Rejeter">
                            <XCircle size={16} />
                            <span>Rejeter</span>
                          </button>
                        </>
                      )}

                      {n.status === 'approved' && (
                        <div className="notif-state-info" style={{ color: '#10b981', fontWeight: 600 }}>
                          <CheckCircle size={16} style={{ marginRight: 6 }} />
                          Demande approuvée
                        </div>
                      )}
                      {n.status === 'rejected' && (
                        <div className="notif-state-info" style={{ color: '#ef4444', fontWeight: 600 }}>
                          <XCircle size={16} style={{ marginRight: 6 }} />
                          Demande rejetée
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal Rejet (local/démo) */}
      {rejectModal.open && (
        <div className="admin-notif-modal-backdrop">
          <div className="admin-notif-modal">
            <button className="admin-notif-modal-close" onClick={cancelReject}>
              <X size={22} />
            </button>
            <h3 className="admin-notif-modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <XCircle size={18} style={{ color: '#ef4444' }} />
              Rejeter la demande
            </h3>
            <div className="admin-notif-modal-fields">
              <label className="form-label">Motif du rejet *</label>
              <textarea
                rows={4}
                className="form-textarea"
                placeholder="Expliquez la raison du rejet…"
                value={rejectModal.reason}
                onChange={(e) => setRejectModal((m) => ({ ...m, reason: e.target.value }))}
              />
            </div>
            <div className="admin-notif-modal-actions" style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button className="admin-notif-modal-cancel" onClick={cancelReject}>Annuler</button>
              <button
                className="admin-notif-modal-submit"
                onClick={submitRejectLocal}
                disabled={!rejectModal.reason.trim()}
                style={{ background: '#ef4444', color: 'white' }}
              >
                Rejeter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
