import React, { useState } from 'react';
import Sidebar from '../../component/sidebarparent';
import CustomDropdown from '../../component/CustomDropdown';
import {
  Bell,
  Menu,
  X,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Filter,
  Clock,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/parent/NotificationsParents.css';

const NotificationsParents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [activeTab, setActiveTab] = useState('notifications');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const [filterType, setFilterType] = useState('');
  const navigate = useNavigate();

  const userData = {
    firstName: "Fatima",
    lastName: "Bennani",
    role: "Parent",
    profilePic: "https://ui-avatars.com/api/?name=Fatima+Bennani&background=17766e&color=fff&size=200"
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Document disponible",
      message: "Le bulletin S1 2024-2025 d'Ahmed est disponible au téléchargement.",
      date: "2025-10-15 10:28",
      type: "success",
      seen: false
    },
    {
      id: 2,
      title: "Demande approuvée",
      message: "La demande d'attestation de scolarité de Sara a été approuvée.",
      date: "2025-10-14 14:12",
      type: "info",
      seen: true
    },
    {
      id: 3,
      title: "Demande rejetée",
      message: "Convention de Stage pour Ahmed rejetée : justification manquante.",
      date: "2025-10-12 16:44",
      type: "error",
      seen: false
    },
    {
      id: 4,
      title: "Rappel important",
      message: "Reçu d'inscription manquant pour Sara, merci de le téléverser rapidement.",
      date: "2025-10-08 09:00",
      type: "warning",
      seen: false
    },
    {
      id: 5,
      title: "Nouvelle notification",
      message: "Le personnel administratif vous a envoyé un message concernant Ahmed.",
      date: "2025-10-05 11:30",
      type: "info",
      seen: true
    }
  ]);

  const filterOptions = [
    { value: '', label: 'Tous les types', icon: Filter, color: '#5eead4' },
    { value: 'success', label: 'Succès', icon: CheckCircle, color: '#10b981' },
    { value: 'info', label: 'Information', icon: Info, color: '#3b82f6' },
    { value: 'warning', label: 'Avertissement', icon: AlertCircle, color: '#f59e0b' },
    { value: 'error', label: 'Erreur', icon: XCircle, color: '#ef4444' }
  ];

  const handleLogout = () => {
    navigate('/parent/login');
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, seen: true } : n
    ));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'info': return Info;
      case 'error': return XCircle;
      case 'warning': return AlertCircle;
      default: return Bell;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'info': return '#3b82f6';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'success': return 'Succès';
      case 'info': return 'Information';
      case 'error': return 'Erreur';
      case 'warning': return 'Avertissement';
      default: return 'Notification';
    }
  };

  const filteredNotifications = notifications.filter(n => 
    filterType === '' || n.type === filterType
  );

  const totalNotifs = notifications.length;
  const unreadNotifs = notifications.filter(n => !n.seen).length;
  const successNotifs = notifications.filter(n => n.type === 'success').length;
  const warningNotifs = notifications.filter(n => n.type === 'warning').length;

  return (
    <div className="parent-notifications-page">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userData={userData}
      />

      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className={`parent-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="parent-header">
          <button
            className="parent-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="parent-page-title">Notifications</h1>
          <div className="parent-header-actions">
            <button className="parent-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              {unreadNotifs > 0 && <span className="notification-badge"></span>}
            </button>
          </div>
        </header>

        <div className="parent-notifications-content">
          {/* Stats Cards */}
          <div className="parent-notif-stats-grid">
            <div className="parent-notif-stat-card stat-total">
              <div className="stat-icon">
                <Bell size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total</p>
                <h3 className="stat-value">{totalNotifs}</h3>
              </div>
            </div>
            <div className="parent-notif-stat-card stat-unread">
              <div className="stat-icon">
                <AlertCircle size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Non Lues</p>
                <h3 className="stat-value">{unreadNotifs}</h3>
              </div>
            </div>
            <div className="parent-notif-stat-card stat-success">
              <div className="stat-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Succès</p>
                <h3 className="stat-value">{successNotifs}</h3>
              </div>
            </div>
            <div className="parent-notif-stat-card stat-warning">
              <div className="stat-icon">
                <AlertCircle size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Alertes</p>
                <h3 className="stat-value">{warningNotifs}</h3>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="parent-notif-toolbar">
            <CustomDropdown
              options={filterOptions}
              value={filterType}
              onChange={setFilterType}
              icon={Filter}
            />
          </div>

          {/* Notifications Grid */}
          <div className="parent-notifications-grid">
            {filteredNotifications.length === 0 ? (
              <div className="parent-notifications-empty">
                <Bell size={64} />
                <h3>Aucune notification trouvée</h3>
                <p>Vous serez informé ici de toutes les mises à jour importantes</p>
              </div>
            ) : (
              filteredNotifications.map(note => {
                const NotifIcon = getTypeIcon(note.type);
                const iconColor = getTypeColor(note.type);
                return (
                  <div
                    key={note.id}
                    className={`parent-notification-card ${!note.seen ? 'unread' : ''}`}
                  >
                    <div className="notif-card-header">
                      <div
                        className="notif-icon"
                        style={{
                          background: `${iconColor}1a`,
                          color: iconColor
                        }}
                      >
                        <NotifIcon size={20} />
                      </div>
                      {!note.seen && <span className="notif-unread-badge">Nouveau</span>}
                    </div>
                    <div className="notif-card-body">
                      <h3 className="notif-title">{note.title}</h3>
                      <p className="notif-message">{note.message}</p>
                      <div className="notif-meta">
                        <div className="notif-meta-item">
                          <Clock size={14} />
                          <span>{note.date}</span>
                        </div>
                      </div>
                    </div>
                 
                      {!note.seen && (
                        <button
                          className="notif-action-btn mark-read"
                          onClick={() => handleMarkAsRead(note.id)}
                        >
                          <CheckCircle size={16} />
                          <span>Marquer lu</span>
                        </button>
                      )}

                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Details Modal */}
      {showDetailsModal && activeNotification && (
        <div className="parent-notifications-modal-backdrop">
          <div className="parent-notifications-modal">
            <button
              className="parent-notifications-modal-close"
              onClick={() => setShowDetailsModal(false)}
            >
              <X size={22} />
            </button>
            <h3 className="parent-notifications-modal-title">
              <Bell size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#5eead4"}} />
              Détail de la notification
            </h3>
            <div className="parent-notifications-modal-fields">
              <div className="modal-field">
                <strong>Titre :</strong>
                <span>{activeNotification.title}</span>
              </div>
              <div className="modal-field">
                <strong>Message :</strong>
                <span>{activeNotification.message}</span>
              </div>
              <div className="modal-field">
                <strong>Reçu le :</strong>
                <span>{activeNotification.date}</span>
              </div>
              <div className="modal-field">
                <strong>Type :</strong>
                <span style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '999px',
                  background: `${getTypeColor(activeNotification.type)}1a`,
                  color: getTypeColor(activeNotification.type),
                  fontWeight: 600,
                  display: 'inline-block'
                }}>
                  {getTypeLabel(activeNotification.type)}
                </span>
              </div>
              <div className="modal-field">
                <strong>Statut :</strong>
                <span style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '999px',
                  background: activeNotification.seen ? '#10b9811a' : '#f59e0b1a',
                  color: activeNotification.seen ? '#10b981' : '#f59e0b',
                  fontWeight: 600,
                  display: 'inline-block'
                }}>
                  {activeNotification.seen ? 'Lu' : 'Non lu'}
                </span>
              </div>
            </div>
            <button
              className="parent-notifications-modal-close-btn"
              onClick={() => setShowDetailsModal(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsParents;
