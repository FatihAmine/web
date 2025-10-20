import React, { useState } from 'react';
import Sidebar from '../../component/sidebarparent';
import {
  Bell,
  Menu,
  X,
  User,
  Mail,
  Calendar,
  GraduationCap,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/parent/EtudiantsParents.css';

const EtudiantsParents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [activeTab, setActiveTab] = useState('children');
  const [selectedChild, setSelectedChild] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const userData = {
    firstName: "Fatima",
    lastName: "Bennani",
    role: "Parent",
    profilePic: "https://ui-avatars.com/api/?name=Fatima+Bennani&background=17766e&color=fff&size=200"
  };

  const childrenData = [
    {
      id: 1,
      name: "Ahmed Bennani",
      class: "1ère année Informatique",
      status: "active",
      birthDate: "26/09/2005",
      matricule: "YNOV2025111",
      email: "ahmed.bennani@ynov.ma",
      year: "2024-2025"
    },
    {
      id: 2,
      name: "Sara Bennani",
      class: "3ème année Marketing",
      status: "active",
      birthDate: "14/06/2003",
      matricule: "YNOV2025033",
      email: "sara.bennani@ynov.ma",
      year: "2024-2025"
    }
  ];

  const handleLogout = () => {
    navigate('/parent/login');
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
          <h1 className="parent-page-title">Mes Enfants</h1>
          <div className="parent-header-actions">
            <button className="parent-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="parent-children-content">
          <div className="parent-children-header">
            <p className="parent-children-subtitle">
              Consultez les informations de vos enfants inscrits
            </p>
          </div>

          <div className="parent-children-grid">
            {childrenData.map(child => (
              <div className="parent-children-card" key={child.id}>
                <div className="child-card-header">
                  <div className="child-avatar">
                    <User size={32} />
                  </div>
                  <span className="child-status-badge">
                    <CheckCircle size={14} />
                    Actif
                  </span>
                </div>
                <div className="child-card-body">
                  <h3 className="child-name">{child.name}</h3>
                  <div className="child-info">
                    <div className="child-info-item">
                      <GraduationCap size={16} />
                      <span>{child.class}</span>
                    </div>
                    <div className="child-info-item">
                      <Mail size={16} />
                      <span>{child.email}</span>
                    </div>
                  </div>
                </div>
                <div className="child-card-footer">
                  <button 
                    className="child-details-btn" 
                    onClick={() => openChildModal(child)}
                  >
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && selectedChild && (
        <div className="parent-children-modal-backdrop">
          <div className="parent-children-modal">
            <button 
              className="parent-children-modal-close" 
              onClick={closeChildModal}
            >
              <X size={22} />
            </button>
            <h3 className="parent-children-modal-title">
              <User size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#5eead4"}} />
              Détails de l'étudiant
            </h3>
            <div className="parent-children-modal-body">
              <div className="modal-field">
                <strong>Nom complet :</strong>
                <span>{selectedChild.name}</span>
              </div>
              <div className="modal-field">
                <strong>Classe :</strong>
                <span>{selectedChild.class}</span>
              </div>
              <div className="modal-field">
                <strong>Année scolaire :</strong>
                <span>{selectedChild.year}</span>
              </div>
              <div className="modal-field">
                <strong>Date de naissance :</strong>
                <span>{selectedChild.birthDate}</span>
              </div>
              <div className="modal-field">
                <strong>Matricule :</strong>
                <span>{selectedChild.matricule}</span>
              </div>
              <div className="modal-field">
                <strong>Email :</strong>
                <span>{selectedChild.email}</span>
              </div>
              <div className="modal-field">
                <strong>Statut :</strong>
                <span style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '999px',
                  background: '#10b9811a',
                  color: '#10b981',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <CheckCircle size={14} />
                  Actif
                </span>
              </div>
            </div>
            <button 
              className="parent-children-modal-close-btn" 
              onClick={closeChildModal}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EtudiantsParents;
