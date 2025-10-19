// src/components/Etudiant/NotificationEtudiant.jsx
import React, { useState } from 'react';
import {
  Home,
  FileText,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/etudiant/NotificationsEtudiants.css';

const NotificationEtudiant = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const navigate = useNavigate();

  const userData = {
    firstName: "Mohamed",
    lastName: "Alami",
    profilePic: "https://ui-avatars.com/api/?name=Mohamed+Alami&background=17766e&color=fff&size=200"
  };

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/etudiant' },
    { id: 'documents', icon: FileText, label: 'Mes Documents', path: '/etudiant/documents' },
    { id: 'requests', icon: Clock, label: 'Mes Demandes', path: '/etudiant/demandes' },
    { id: 'upload', icon: Upload, label: 'Téléverser', path: '/etudiant/upload' },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/etudiant/notifications' },
    { id: 'settings', icon: Settings, label: 'Paramètres', path: '/etudiant/settings' }
  ];

  // Example notifications data
  const notifications = [
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
      title: "Rappel",
      message: "N’oubliez pas de uploader l’attestation d’assurance étudiante avant le 20/10/2025.",
      date: "2025-10-10 15:09",
      type: "reminder",
      seen: false
    }
  ];

  const getTypeIcon = type => {
    switch (type) {
      case 'success': return <CheckCircle size={20} />;
      case 'error':   return <XCircle size={20} />;
      case 'info':    return <Bell size={20} />;
      case 'reminder':return <AlertCircle size={20} />;
      default:        return <Bell size={20} />;
    }
  };
  const getTypeColor = type => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error':   return '#ef4444';
      case 'info':    return '#3b82f6';
      case 'reminder':return '#f59e0b';
      default:        return '#6b7280';
    }
  };

  return (
    <div className="notification-page">
      {/* Sidebar */}
      <aside className={`notification-sidebar ${sidebarOpen ? 'notification-sidebar-open' : 'notification-sidebar-closed'}`}>
        <div className="notification-sidebar-content">
          <div className="notification-profile-section">
            <img src={userData.profilePic} alt="Profile" className="notification-profile-pic" />
            {sidebarOpen && (
              <div className="notification-profile-info">
                <h3 className="notification-profile-name">{userData.firstName} {userData.lastName}</h3>
                <p className="notification-profile-role">Étudiant</p>
              </div>
            )}
          </div>
          <nav className="notification-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                }}
                className={`notification-menu-item ${activeTab === item.id ? 'notification-menu-item-active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
          <button className="notification-disconnect-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="notification-main-content">
        <header className="notification-page-header">
          <button
            className="notification-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="notification-page-title">Notifications</h1>
        </header>
        <div className="notification-container">
          <div className="notification-header">
            <div className="notification-title-section">
              <p className="notification-subtitle">
                Retrouvez toutes les notifications importantes de votre dossier étudiant.
              </p>
            </div>
          </div>
          <div className="notification-list">
            {notifications.map(note => (
              <div
                key={note.id}
                className={`notification-card${note.seen ? ' notification-card-seen' : ''}`}
                style={{
                  borderLeft: `6px solid ${getTypeColor(note.type)}`
                }}
              >
                <div className="notification-card-header">
                  <div
                    className="notification-card-icon"
                    style={{ background: `${getTypeColor(note.type)}20`, color: getTypeColor(note.type) }}
                  >
                    {getTypeIcon(note.type)}
                  </div>
                  <h3 className="notification-card-title">{note.title}</h3>
                </div>
                <p className="notification-card-message">{note.message}</p>
                <div className="notification-card-footer">
                  <span className="notification-card-date">{note.date}</span>
                  <button
                    className="notification-card-view-btn"
                    onClick={() => { setActiveNotification(note); setShowDetailsModal(true); }}
                  >
                    <Eye size={18} />
                    Détails
                  </button>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="notification-empty">
                <Bell size={64} className="notification-empty-icon" />
                <h3 className="notification-empty-title">Aucune notification pour le moment</h3>
                <p className="notification-empty-text">
                  Vous serez informé ici de toutes les mises à jour importantes
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Details Modal */}
      {showDetailsModal && activeNotification && (
        <div className="notification-modal-overlay">
          <div className="notification-details-modal">
            <div className="notification-details-header">
              <h2>Détail de la notification</h2>
              <button
                className="notification-details-close"
                onClick={() => setShowDetailsModal(false)}
              ><X size={24}/></button>
            </div>
            <div className="notification-details-body">
              <div className="notification-details-row">
                <span className="label">Titre :</span>
                <span>{activeNotification.title}</span>
              </div>
              <div className="notification-details-row">
                <span className="label">Reçu le :</span>
                <span>{activeNotification.date}</span>
              </div>
              <div className="notification-details-row">
                <span className="label">Type :</span>
                <span>{getTypeIcon(activeNotification.type)} {getTypeColor(activeNotification.type)}</span>
              </div>
              <div className="notification-details-row">
                <span className="label">Message :</span>
                <span>{activeNotification.message}</span>
              </div>
              <div className="notification-details-row">
                <span className="label">Statut :</span>
                <span className={`notification-details-status ${activeNotification.seen ? 'vu' : 'non-vu'}`}>
                  {activeNotification.seen ? 'Vu' : 'Non vu'}
                </span>
              </div>
            </div>
            <div className="notification-details-footer">
              <button className="notification-details-close-btn" onClick={() => setShowDetailsModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationEtudiant;
