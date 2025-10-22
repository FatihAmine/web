// src/pages/etudiant/NotificationEtudiant.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../component/sidebaretudiant';
import { Bell, Menu, X, CheckCircle, XCircle, FileText, Clock, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/etudiant/NotificationsEtudiants.css';
import api from '../../../api'; // ✅ axios avec ID token

/* Utils dates (ISO / Date / Firestore Timestamp) */
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

/** Normalise l’enveloppe renvoyée par le backend */
const normalizeList = (data) => {
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.notifications)) return data.notifications;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
};

/** Map → format UI étudiant (on ne garde que approved / rejected / document_sent) */
function mapStudentNotif(n) {
  const kind = String(n.kind || '').toLowerCase();

  // On ne montre pas request_submitted côté étudiant
  if (!['request_approved', 'request_rejected', 'document_sent'].includes(kind)) {
    return null;
  }

  // champs communs
  const base = {
    id: n.id || n.notifId || n.requestId || Math.random().toString(36).slice(2),
    type: n.type || 'Document',
    notes: n.notes || '',
    rejectionReason: n.rejectionReason || '',
    createdAt: n.createdAt || n.approvedAt || n.rejectedAt || new Date(),
  };

  if (kind === 'request_approved') {
    return { ...base, status: 'approved', title: 'Demande approuvée' };
  }
  if (kind === 'request_rejected') {
    return { ...base, status: 'rejected', title: 'Demande rejetée' };
  }
  // document_sent
  return { ...base, status: 'sent', title: 'Document envoyé' };
}

/** Icône + couleur selon statut */
function iconFor(status) {
  if (status === 'approved') return { Icon: CheckCircle, color: '#10b981' };
  if (status === 'rejected') return { Icon: XCircle, color: '#ef4444' };
  return { Icon: FileText, color: '#3b82f6' }; // sent
}

const NotificationEtudiant = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeTab, setActiveTab] = useState('notifications');

  const [items, setItems] = useState([]);     // notifications UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const handleLogout = () => navigate('/etudiant/login');

  const fetchMine = async () => {
    setLoading(true);
    setError('');
    try {
      // feed personnel de l’utilisateur (uid) → scope=mine
      const { data } = await api.get('/notifications', { params: { scope: 'mine', limit: 100 } });
      const mapped = normalizeList(data)
        .map(mapStudentNotif)
        .filter(Boolean) // ne garde que les 3 types souhaités
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setItems(mapped);
    } catch (e) {
      console.error('STUDENT NOTIFS ERR', e?.response?.data || e.message);
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
    fetchMine();
  }, []);

  const refresh = () => fetchMine();

  return (
    <div className="notification-page">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        // pas de userData en dur
      />

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className={`notification-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="notification-page-header">
          <button
            className="notification-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="notification-page-title">Notifications</h1>
          <div className="notification-header-actions">
            <button className="notification-notif-btn" onClick={refresh} title="Rafraîchir">
              <RotateCw size={18} />
            </button>
            <button className="notification-notif-btn" aria-label="Notifications">
              <Bell size={20} />
            </button>
          </div>
        </header>

        <div className="notification-container">
          {/* Erreur (si besoin) */}
          {error && (
            <div style={{ color: '#ef4444', margin: '0 0 16px', fontWeight: 600 }}>
              {error}{' '}
              <button onClick={refresh} style={{ marginLeft: 8 }}>
                Réessayer
              </button>
            </div>
          )}

          {/* Liste */}
          {loading ? (
            <div className="notification-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="notification-card" style={{ opacity: 0.6 }}>
                  <div className="notif-card-header">
                    <div className="notif-icon" style={{ background: '#263244', width: 48, height: 48 }} />
                  </div>
                  <div className="notif-card-body">
                    <div style={{ height: 14, width: 160, background: '#1f2a3a', borderRadius: 6, marginBottom: 10 }} />
                    <div style={{ height: 12, background: '#1f2a3a', borderRadius: 6 }} />
                    <div style={{ height: 12, background: '#1f2a3a', borderRadius: 6, marginTop: 8 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="notification-grid">
              {items.length === 0 ? (
                <div className="notification-empty">
                  <Bell size={64} />
                  <h3>Aucune notification trouvée</h3>
                  <p>Vous serez informé ici de toutes les mises à jour importantes.</p>
                </div>
              ) : (
                items.map((n) => {
                  const { Icon, color } = iconFor(n.status);
                  const title = n.title;

                  // Message selon les règles
                  const message =
                    n.status === 'rejected'
                      ? `${n.type} — ${n.rejectionReason || 'Motif non précisé'}`
                      : `${n.type}${n.notes ? ` — ${n.notes}` : ''}`;

                  return (
                    <div key={n.id} className="notification-card">
                      <div className="notif-card-header">
                        <div className="notif-icon" style={{ background: `${color}1a`, color }} title={title}>
                          <Icon size={20} />
                        </div>
                      </div>

                      <div className="notif-card-body">
                        <h3 className="notif-title">{title}</h3>
                        <p className="notif-message">{message}</p>
                        <div className="notif-meta">
                          <div className="notif-meta-item" title={toDateAny(n.createdAt).toLocaleString()}>
                            <Clock size={14} />
                            <span>{formatTimeAgo(n.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationEtudiant;
