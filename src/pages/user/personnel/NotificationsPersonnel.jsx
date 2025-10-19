// src/components/personnel/NotificationsPersonnel.jsx
import React, { useState } from 'react';
import {
  Home,
  FileText,
  Users,
  Clock,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/personnel/NotificationsPersonnel.css';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/personnel' },
  { id: 'requests', icon: Clock, label: 'Demandes', path: '/personnel/demandes' },
  { id: 'documents', icon: FileText, label: 'Gestion Documents', path: '/personnel/documents' },
  { id: 'students', icon: Users, label: 'Étudiants', path: '/personnel/students' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/personnel/notifications' },
  { id: 'settings', icon: Settings, label: 'Paramètres', path: '/personnel/settings' }
];

const notifications = [
  {
    id: 1,
    title: "Nouvelle demande urgente",
    message: "Nouvelle demande d'attestation de scolarité de Ahmed Bennani.",
    date: "2025-10-15 10:28",
    type: "success",
    seen: false
  },
  {
    id: 2,
    title: "Document généré",
    message: "Bulletin S1 2024 généré pour Sara Idrissi.",
    date: "2025-10-14 14:12",
    type: "info",
    seen: true
  },
  {
    id: 3,
    title: "Demande rejetée",
    message: "Demande de convention de stage pour Omar Tazi rejetée.",
    date: "2025-10-12 16:44",
    type: "error",
    seen: false
  },
  {
    id: 4,
    title: "Rappel",
    message: "Attention ! Vous avez 6 demandes non traitées.",
    date: "2025-10-08 09:00",
    type: "reminder",
    seen: false
  }
];

const getTypeIcon = (type) => {
  switch (type) {
    case 'success': return <CheckCircle size={20} />;
    case 'info':    return <Bell size={20} />;
    case 'error':   return <XCircle size={20} />;
    case 'reminder':return <AlertCircle size={20} />;
    default:        return <Bell size={20} />;
  }
};
const getTypeColor = (type) => {
  switch (type) {
    case 'success': return '#10b981';
    case 'info':    return '#3b82f6';
    case 'error':   return '#ef4444';
    case 'reminder':return '#f59e0b';
    default:        return '#6b7280';
  }
};

const NotificationsPersonnel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const navigate = useNavigate();

  const userData = {
    firstName: "Karim",
    lastName: "El Amrani",
    profilePic: "https://ui-avatars.com/api/?name=Karim+El+Amrani&background=17766e&color=fff&size=200"
  };

  return (
    <div className="personnel-notifications-page">
      <aside className={`personnel-sidebar ${sidebarOpen ? 'personnel-sidebar-open' : 'personnel-sidebar-closed'}`}>
        <div className="personnel-sidebar-content">
          <div className="personnel-profile-section">
            <img src={userData.profilePic} alt="Profile" className="personnel-profile-pic" />
            {sidebarOpen && (
              <div className="personnel-profile-info">
                <h3 className="personnel-profile-name">{userData.firstName} {userData.lastName}</h3>
                <p className="personnel-profile-role">Personnel</p>
              </div>
            )}
          </div>
          <nav className="personnel-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                }}
                className={`personnel-menu-item ${activeTab === item.id ? 'personnel-menu-item-active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
                type="button"
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
          <button className="personnel-disconnect-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
      <main className="personnel-main-content">
        <header className="personnel-header">
          <button className="personnel-toggle-sidebar-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="personnel-page-title">Notifications</h1>
        </header>
        <div className="personnel-notifications-content">
          <div className="personnel-notifications-list">
            {notifications.map(note => (
              <div
                key={note.id}
                className={`personnel-notification-card${note.seen ? ' personnel-notification-card-seen' : ''}`}
                style={{
                  borderLeft: `6px solid ${getTypeColor(note.type)}`
                }}
              >
                <div className="personnel-notification-card-header">
                  <div
                    className="personnel-notification-card-icon"
                    style={{ background: `${getTypeColor(note.type)}20`, color: getTypeColor(note.type) }}
                  >
                    {getTypeIcon(note.type)}
                  </div>
                  <h3 className="personnel-notification-card-title">{note.title}</h3>
                </div>
                <p className="personnel-notification-card-message">{note.message}</p>
                <div className="personnel-notification-card-footer">
                  <span className="personnel-notification-card-date">{note.date}</span>
                  <button
                    className="personnel-notification-card-view-btn"
                    onClick={() => { setActiveNotification(note); setShowDetailsModal(true); }}
                  >
                    <Eye size={18} />
                    Détails
                  </button>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="personnel-notifications-empty">
                <Bell size={64} className="personnel-notifications-empty-icon" />
                <h3 className="personnel-notifications-empty-title">Aucune notification pour le moment</h3>
                <p className="personnel-notifications-empty-text">
                  Vous serez informé ici de toutes les mises à jour importantes
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      {showDetailsModal && activeNotification && (
        <div className="personnel-notifications-modal-overlay">
          <div className="personnel-notifications-details-modal">
            <div className="personnel-notifications-details-header">
              <h2>Détail de la notification</h2>
              <button
                className="personnel-notifications-details-close"
                onClick={() => setShowDetailsModal(false)}
              ><X size={24}/></button>
            </div>
            <div className="personnel-notifications-details-body">
              <div className="personnel-notifications-details-row">
                <span className="label">Titre :</span>
                <span>{activeNotification.title}</span>
              </div>
              <div className="personnel-notifications-details-row">
                <span className="label">Reçu le :</span>
                <span>{activeNotification.date}</span>
              </div>
              <div className="personnel-notifications-details-row">
                <span className="label">Type :</span>
                <span>{getTypeIcon(activeNotification.type)} {getTypeColor(activeNotification.type)}</span>
              </div>
              <div className="personnel-notifications-details-row">
                <span className="label">Message :</span>
                <span>{activeNotification.message}</span>
              </div>
              <div className="personnel-notifications-details-row">
                <span className="label">Statut :</span>
                <span className={`personnel-notifications-details-status ${activeNotification.seen ? 'vu' : 'non-vu'}`}>
                  {activeNotification.seen ? 'Vu' : 'Non vu'}
                </span>
              </div>
            </div>
            <div className="personnel-notifications-details-footer">
              <button className="personnel-notifications-details-close-btn" onClick={() => setShowDetailsModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPersonnel;
