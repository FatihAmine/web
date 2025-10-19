// src/components/personnel/DocumentPersonnel.jsx
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
  Download,
  Search,

  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/personnel/DocumentPersonnel.css';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/personnel' },
  { id: 'requests', icon: Clock, label: 'Demandes', path: '/personnel/demandes' },
  { id: 'documents', icon: FileText, label: 'Gestion Documents', path: '/personnel/documents' },
  { id: 'students', icon: Users, label: 'Étudiants', path: '/personnel/students' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/personnel/notifications' },
  { id: 'settings', icon: Settings, label: 'Paramètres', path: '/personnel/settings' }
];

const documentTypes = [
  "Tous les types",
  "Attestation",
  "Bulletin",
  "Certificat",
  "Convention",
  "Relevé de Notes"
];

const documents = [
  {
    id: 1,
    studentName: "Ahmed Bennani",
    type: "Attestation",
    name: "Attestation de Scolarité",
    date: "2025-10-03",
    status: "approved",
    downloadUrl: "#"
  },
  {
    id: 2,
    studentName: "Sara Idrissi",
    type: "Bulletin",
    name: "Bulletin S1 2024",
    date: "2025-09-29",
    status: "pending"
  },
  {
    id: 3,
    studentName: "Omar Tazi",
    type: "Certificat",
    name: "Certificat de Réussite",
    date: "2025-09-27",
    status: "approved",
    downloadUrl: "#"
  },
  {
    id: 4,
    studentName: "Leila Fassi",
    type: "Convention",
    name: "Convention de Stage",
    date: "2025-09-25",
    status: "rejected"
  }
];

const getStatusIcon = status => {
  switch (status) {
    case 'approved': return <CheckCircle size={18} />;
    case 'pending': return <AlertCircle size={18} />;
    case 'rejected': return <XCircle size={18} />;
    default: return <Clock size={18} />;
  }
};

const getStatusColor = status => {
  switch (status) {
    case 'approved': return '#10b981';
    case 'pending': return '#f59e0b';
    case 'rejected': return '#ef4444';
    default: return '#6b7280';
  }
};

const getStatusText = status => {
  switch (status) {
    case 'approved': return 'Disponible';
    case 'pending': return 'En attente';
    case 'rejected': return 'Rejeté';
    default: return 'En attente';
  }
};

const DocumentPersonnel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tous les types');
  const navigate = useNavigate();
  const userData = {
    firstName: "Karim",
    lastName: "El Amrani",
    profilePic: "https://ui-avatars.com/api/?name=Karim+El+Amrani&background=17766e&color=fff&size=200"
  };

  const filteredDocs = documents.filter(doc =>
    (filterType === "Tous les types" || doc.type === filterType) &&
    (
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="personnel-docs-page">
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
          <h1 className="personnel-page-title">Gestion Documents</h1>
        </header>
        <div className="personnel-docs-content">
          <div className="personnel-docs-filters">
            <div className="personnel-docs-search">
              <Search size={20} className="personnel-docs-search-icon" />
              <input
                type="text"
                placeholder="Rechercher un document, un étudiant..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="personnel-docs-search-input"
              />
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="personnel-docs-filter-select"
            >
              {documentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="personnel-docs-list">
            {filteredDocs.length === 0 ? (
              <div className="personnel-docs-empty">
                <FileText size={64} className="personnel-docs-empty-icon" />
                <h3>Aucun document trouvé</h3>
                <p>Essayez d'élargir votre recherche ou de changer le filtre.</p>
              </div>
            ) : (
              filteredDocs.map(doc => (
                <div key={doc.id} className="personnel-docs-item">
                  <div className="personnel-docs-avatar">
                    <User size={24} />
                  </div>
                  <div className="personnel-docs-info">
                    <h4 className="personnel-docs-name">{doc.name}</h4>
                    <p className="personnel-docs-student">{doc.studentName}</p>
                    <p className="personnel-docs-date"><Calendar size={16} /> {doc.date}</p>
                  </div>
                  <div className="personnel-docs-status"
                    style={{
                      background: `${getStatusColor(doc.status)}15`,
                      color: getStatusColor(doc.status)
                    }}>
                    {getStatusIcon(doc.status)}
                    <span>{getStatusText(doc.status)}</span>
                  </div>
                  {doc.downloadUrl && (
                    <a href={doc.downloadUrl} className="personnel-docs-download-btn" download>
                      <Download size={18} />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentPersonnel;
