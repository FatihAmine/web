// src/components/parent/NotificationsParents.jsx
import React, { useState } from 'react';
import {
  Home,
  Users,
  FileText,
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
import '../../../css/parent/NotificationsParents.css';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/parent' },
  { id: 'children', icon: Users, label: 'Mes Enfants', path: '/parent/children' },
  { id: 'documents', icon: FileText, label: 'Documents', path: '/parent/documents' },
  { id: 'requests', icon: Clock, label: 'Demandes', path: '/parent/demandes' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/parent/notifications' },
  { id: 'settings', icon: Settings, label: 'Paramètres', path: '/parent/settings' }
];

const notifications = [
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
    title: "Rappel",
    message: "Reçu d'inscription manquant pour Sara, merci de le téléverser rapidement.",
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

const NotificationsParents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const navigate = useNavigate();

  const userData = {
    firstName: "Fatima",
    lastName: "Bennani",
    profilePic: "https://ui-avatars.com/api/?name=Fatima+Bennani&background=17766e&color=fff&size=200"
  };

  return (
    <div className="parent-notifications-page">
      <aside className={`parent-sidebar ${sidebarOpen ? 'parent-sidebar-open' : 'parent-sidebar-closed'}`}>
        <div className="parent-sidebar-content">
          <div className="parent-profile-section">
            <img src={userData.profilePic} alt="Profile" className="parent-profile-pic" />
            {sidebarOpen && (
              <div className="parent-profile-info">
                <h3 className="parent-profile-name">{userData.firstName} {userData.lastName}</h3>
                <p className="parent-profile-role">Parent</p>
              </div>
            )}
          </div>
          <nav className="parent-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                }}
                className={`parent-menu-item ${activeTab === item.id ? 'parent-menu-item-active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
                type="button"
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
          <button className="parent-disconnect-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
      <main className="parent-main-content">
        <header className="parent-header">
          <button className="parent-toggle-sidebar-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="parent-page-title">Notifications</h1>
        </header>
        <div className="parent-notifications-content">
          <div className="parent-notifications-list">
            {notifications.map(note => (
              <div
                key={note.id}
                className={`parent-notification-card${note.seen ? ' parent-notification-card-seen' : ''}`}
                style={{
                  borderLeft: `6px solid ${getTypeColor(note.type)}`
                }}
              >
                <div className="parent-notification-card-header">
                  <div
                    className="parent-notification-card-icon"
                    style={{ background: `${getTypeColor(note.type)}20`, color: getTypeColor(note.type) }}
                  >
                    {getTypeIcon(note.type)}
                  </div>
                  <h3 className="parent-notification-card-title">{note.title}</h3>
                </div>
                <p className="parent-notification-card-message">{note.message}</p>
                <div className="parent-notification-card-footer">
                  <span className="parent-notification-card-date">{note.date}</span>
                  <button
                    className="parent-notification-card-view-btn"
                    onClick={() => { setActiveNotification(note); setShowDetailsModal(true); }}
                  >
                    <Eye size={18} />
                    Détails
                  </button>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="parent-notifications-empty">
                <Bell size={64} className="parent-notifications-empty-icon" />
                <h3 className="parent-notifications-empty-title">Aucune notification pour le moment</h3>
                <p className="parent-notifications-empty-text">Vous serez informé ici de toutes les mises à jour importantes</p>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Details Modal */}
      {showDetailsModal && activeNotification && (
        <div className="parent-notifications-modal-overlay">
          <div className="parent-notifications-details-modal">
            <div className="parent-notifications-details-header">
              <h2>Détail de la notification</h2>
              <button
                className="parent-notifications-details-close"
                onClick={() => setShowDetailsModal(false)}
              ><X size={24}/></button>
            </div>
            <div className="parent-notifications-details-body">
              <div className="parent-notifications-details-row">
                <span className="label">Titre :</span>
                <span>{activeNotification.title}</span>
              </div>
              <div className="parent-notifications-details-row">
                <span className="label">Reçu le :</span>
                <span>{activeNotification.date}</span>
              </div>
              <div className="parent-notifications-details-row">
                <span className="label">Type :</span>
                <span>{getTypeIcon(activeNotification.type)} {getTypeColor(activeNotification.type)}</span>
              </div>
              <div className="parent-notifications-details-row">
                <span className="label">Message :</span>
                <span>{activeNotification.message}</span>
              </div>
              <div className="parent-notifications-details-row">
                <span className="label">Statut :</span>
                <span className={`parent-notifications-details-status ${activeNotification.seen ? 'vu' : 'non-vu'}`}>
                  {activeNotification.seen ? 'Vu' : 'Non vu'}
                </span>
              </div>
            </div>
            <div className="parent-notifications-details-footer">
              <button className="parent-notifications-details-close-btn" onClick={() => setShowDetailsModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsParents;
