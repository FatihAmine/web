// src/components/parent/EtudiantsParents.jsx
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
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/parent/EtudiantsParents.css';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/parent' },
  { id: 'children', icon: Users, label: 'Mes Enfants', path: '/parent/children' },
  { id: 'documents', icon: FileText, label: 'Documents', path: '/parent/documents' },
  { id: 'requests', icon: Clock, label: 'Demandes', path: '/parent/demandes' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/parent/notifications' },
  { id: 'settings', icon: Settings, label: 'Paramètres', path: '/parent/settings' }
];

const childrenData = [
  {
    id: 1,
    name: "Ahmed Bennani",
    class: "1ère année Informatique",
    status: "active",
    birthDate: "2005-09-26",
    matricule: "YNOV2025111",
    email: "ahmed.bennani@ynov.ma"
  },
  {
    id: 2,
    name: "Sara Bennani",
    class: "3ème année Marketing",
    status: "active",
    birthDate: "2003-06-14",
    matricule: "YNOV2025033",
    email: "sara.bennani@ynov.ma"
  }
];

const EtudiantsParents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('children');
  const [selectedChild, setSelectedChild] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const userData = {
    firstName: "Fatima",
    lastName: "Bennani",
    profilePic: "https://ui-avatars.com/api/?name=Fatima+Bennani&background=17766e&color=fff&size=200"
  };

  const openChildModal = (child) => {
    setSelectedChild(child);
    setShowModal(true);
  };
  const closeChildModal = () => {
    setShowModal(false);
    setSelectedChild(null);
  };

  return (
    <div className="parent-children-page">
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
          <h1 className="parent-page-title">Mes Enfants</h1>
        </header>
        <div className="parent-children-content">
          <div className="parent-children-grid">
            {childrenData.map(child => (
              <div className="parent-children-card" key={child.id}>
                <div className="parent-children-avatar">
                  <User size={32} />
                </div>
                <div className="parent-children-info">
                  <h4 className="parent-children-name">{child.name}</h4>
                  <p className="parent-children-class">{child.class}</p>
                  <span className="parent-children-status active">
                    Actif
                  </span>
                </div>
                <button className="parent-children-details-btn" onClick={() => openChildModal(child)}>
                  Voir les détails
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Modal details for child */}
      {showModal && selectedChild && (
        <div className="parent-children-modal-overlay">
          <div className="parent-children-modal">
            <div className="parent-children-modal-header">
              <h2>Détails de l'étudiant</h2>
              <button className="parent-children-modal-close" onClick={closeChildModal}>
                <X size={24} />
              </button>
            </div>
            <div className="parent-children-modal-body">
              <div className="parent-children-modal-row">
                <span className="label">Nom :</span>
                <span>{selectedChild.name}</span>
              </div>
              <div className="parent-children-modal-row">
                <span className="label">Classe :</span>
                <span>{selectedChild.class}</span>
              </div>
              <div className="parent-children-modal-row">
                <span className="label">Date de naissance :</span>
                <span>{selectedChild.birthDate}</span>
              </div>
              <div className="parent-children-modal-row">
                <span className="label">Matricule :</span>
                <span>{selectedChild.matricule}</span>
              </div>
              <div className="parent-children-modal-row">
                <span className="label">Email :</span>
                <span>{selectedChild.email}</span>
              </div>
              <div className="parent-children-modal-row">
                <span className="label">Statut :</span>
                <span className="parent-children-status active">Actif</span>
              </div>
            </div>
            <div className="parent-children-modal-footer">
              <button className="parent-children-modal-close-btn" onClick={closeChildModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EtudiantsParents;
