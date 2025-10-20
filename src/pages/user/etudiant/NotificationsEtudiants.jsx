import React, { useState } from 'react';
import Sidebar from '../../component/sidebaretudiant';
import CustomDropdown from '../../component/CustomDropdown';
import {
  Bell,
  Menu,
  X,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Clock,
  Trash2,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/etudiant/NotificationsEtudiants.css';

const NotificationEtudiant = () => {
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
    firstName: "Mohamed",
    lastName: "Alami",
    role: "Étudiant",
    profilePic: "https://ui-avatars.com/api/?name=Mohamed+Alami&background=17766e&color=fff&size=200"
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Demande approuvée",
      message: "Votre demande d'Attestation de Scolarité a été approuvée.",
      date: "2025-10-15 11:10",
      type: "success",
      seen: false
    },
    {
      id: 2,
      title: "Document téléversé",
      message: "Votre bulletin semestriel a été téléversé et est en cours de traitement.",
      date: "2025-10-13 18:40",
      type: "info",
      seen: true
    },
    {
      id: 3,
      title: "Demande rejetée",
      message: "Convention de Stage rejetée : documents incomplets, veuillez compléter votre dossier.",
      date: "2025-10-11 09:30",
      type: "error",
      seen: false
    },
    {
      id: 4,
      title: "Rappel important",
      message: "N'oubliez pas de uploader l'attestation d'assurance étudiante avant le 20/10/2025.",
      date: "2025-10-10 15:09",
      type: "warning",
      seen: false
    },
    {
      id: 5,
      title: "Nouveau message",
      message: "Le personnel administratif vous a envoyé un message concernant votre dossier.",
      date: "2025-10-09 14:20",
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
    navigate('/etudiant/login');
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, seen: true } : n
    ));
  };

  const getTypeIcon = type => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'info': return Info;
      case 'warning': return AlertCircle;
      default: return Bell;
    }
  };

  const getTypeColor = type => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
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

  // Stats
  const totalNotifs = notifications.length;
  const unreadNotifs = notifications.filter(n => !n.seen).length;
  const successNotifs = notifications.filter(n => n.type === 'success').length;
  const warningNotifs = notifications.filter(n => n.type === 'warning').length;

  return (
    <div className="notification-page">
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
            <button className="notification-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              {unreadNotifs > 0 && <span className="notification-badge"></span>}
            </button>
          </div>
        </header>

        <div className="notification-container">
          {/* Stats Cards */}
          <div className="notification-stats-grid">
            <div className="notification-stat-card stat-total">
              <div className="stat-icon">
                <Bell size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total</p>
                <h3 className="stat-value">{totalNotifs}</h3>
              </div>
            </div>
            <div className="notification-stat-card stat-unread">
              <div className="stat-icon">
                <AlertCircle size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Non Lues</p>
                <h3 className="stat-value">{unreadNotifs}</h3>
              </div>
            </div>
            <div className="notification-stat-card stat-success">
              <div className="stat-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Succès</p>
                <h3 className="stat-value">{successNotifs}</h3>
              </div>
            </div>
            <div className="notification-stat-card stat-warning">
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
          <div className="notification-toolbar">
            <CustomDropdown
              options={filterOptions}
              value={filterType}
              onChange={setFilterType}
              icon={Filter}
            />
          </div>

          {/* Notifications Grid */}
          <div className="notification-grid">
            {filteredNotifications.length === 0 ? (
              <div className="notification-empty">
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
                    className={`notification-card ${!note.seen ? 'unread' : ''}`}
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
                    <div className="notif-card-footer">
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
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Details Modal */}
      {showDetailsModal && activeNotification && (
        <div className="notification-modal-backdrop">
          <div className="notification-modal">
            <button
              className="notification-modal-close"
              onClick={() => setShowDetailsModal(false)}
            >
              <X size={22} />
            </button>
            <h3 className="notification-modal-title">
              <Bell size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#5eead4"}} />
              Détail de la notification
            </h3>
            <div className="notification-modal-fields">
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
              className="notification-modal-close-btn"
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

export default NotificationEtudiant;
