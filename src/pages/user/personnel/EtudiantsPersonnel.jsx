// src/components/personnel/EtudiantsPersonnel.jsx
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
  User,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/personnel/EtudiantsPersonnel.css';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/personnel' },
  { id: 'requests', icon: Clock, label: 'Demandes', path: '/personnel/demandes' },
  { id: 'documents', icon: FileText, label: 'Gestion Documents', path: '/personnel/documents' },
  { id: 'students', icon: Users, label: 'Étudiants', path: '/personnel/students' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/personnel/notifications' },
  { id: 'settings', icon: Settings, label: 'Paramètres', path: '/personnel/settings' }
];

const studentsData = [
  {
    id: 1,
    name: "Ahmed Bennani",
    class: "1ère année Informatique",
    status: "active",
    matricule: "YNOV2025111",
    birthDate: "2005-09-26",
    email: "ahmed.bennani@ynov.ma"
  },
  {
    id: 2,
    name: "Sara Idrissi",
    class: "3ème année Marketing",
    status: "active",
    matricule: "YNOV2025012",
    birthDate: "2003-06-14",
    email: "sara.idrissi@ynov.ma"
  },
  {
    id: 3,
    name: "Omar Tazi",
    class: "2ème année Finance",
    status: "inactive",
    matricule: "YNOV2025099",
    birthDate: "2004-02-10",
    email: "omar.tazi@ynov.ma"
  }
];

const EtudiantsPersonnel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('students');
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const userData = {
    firstName: "Karim",
    lastName: "El Amrani",
    profilePic: "https://ui-avatars.com/api/?name=Karim+El+Amrani&background=17766e&color=fff&size=200"
  };

  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };
  const closeStudentModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const filteredStudents = studentsData.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.matricule.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="personnel-students-page">
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
          <h1 className="personnel-page-title">Étudiants</h1>
        </header>
        <div className="personnel-students-content">
          <div className="personnel-students-searchbar">
            <Search size={20} className="personnel-students-search-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom, classe, matricule..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="personnel-students-search-input"
            />
          </div>
          <div className="personnel-students-grid">
            {filteredStudents.map(student => (
              <div className="personnel-student-card" key={student.id}>
                <div className="personnel-student-avatar">
                  <User size={32} />
                </div>
                <div className="personnel-student-info">
                  <h4 className="personnel-student-name">{student.name}</h4>
                  <p className="personnel-student-class">{student.class}</p>
                  <span className={`personnel-student-status ${student.status === "active" ? "active" : "inactive"}`}>
                    {student.status === "active" ? "Actif" : "Inactif"}
                  </span>
                </div>
                <button className="personnel-student-details-btn" onClick={() => openStudentModal(student)}>
                  Détails
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      {showModal && selectedStudent && (
        <div className="personnel-student-modal-overlay">
          <div className="personnel-student-modal">
            <div className="personnel-student-modal-header">
              <h2>Détails de l'étudiant</h2>
              <button className="personnel-student-modal-close" onClick={closeStudentModal}>
                <X size={24} />
              </button>
            </div>
            <div className="personnel-student-modal-body">
              <div className="personnel-student-modal-row">
                <span className="label">Nom :</span>
                <span>{selectedStudent.name}</span>
              </div>
              <div className="personnel-student-modal-row">
                <span className="label">Classe :</span>
                <span>{selectedStudent.class}</span>
              </div>
              <div className="personnel-student-modal-row">
                <span className="label">Matricule :</span>
                <span>{selectedStudent.matricule}</span>
              </div>
              <div className="personnel-student-modal-row">
                <span className="label">Date de naissance :</span>
                <span>{selectedStudent.birthDate}</span>
              </div>
              <div className="personnel-student-modal-row">
                <span className="label">Email :</span>
                <span>{selectedStudent.email}</span>
              </div>
              <div className="personnel-student-modal-row">
                <span className="label">Statut :</span>
                <span className={`personnel-student-status ${selectedStudent.status === "active" ? "active" : "inactive"}`}>
                  {selectedStudent.status === "active" ? "Actif" : "Inactif"}
                </span>
              </div>
            </div>
            <div className="personnel-student-modal-footer">
              <button className="personnel-student-modal-close-btn" onClick={closeStudentModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EtudiantsPersonnel;
