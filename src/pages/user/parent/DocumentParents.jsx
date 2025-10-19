// src/components/parent/DocumentParents.jsx
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
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Search,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/parent/DocumentParents.css';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/parent' },
  { id: 'children', icon: Users, label: 'Mes Enfants', path: '/parent/children' },
  { id: 'documents', icon: FileText, label: 'Documents', path: '/parent/documents' },
  { id: 'requests', icon: Clock, label: 'Demandes', path: '/parent/demandes' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/parent/notifications' },
  { id: 'settings', icon: Settings, label: 'Paramètres', path: '/parent/settings' }
];

const documentTypes = [
  "Tous les types",
  "Bulletin",
  "Attestation",
  "Certificat",
  "Convention",
  "Relevé de Notes"
];

const docs = [
  {
    id: 1,
    childName: "Ahmed Bennani",
    type: "Bulletin",
    name: "Bulletin S1 2024-2025",
    date: "2025-10-05",
    status: "approved",
    downloadUrl: "#"
  },
  {
    id: 2,
    childName: "Sara Bennani",
    type: "Attestation",
    name: "Attestation de Scolarité",
    date: "2025-09-28",
    status: "approved",
    downloadUrl: "#"
  },
  {
    id: 3,
    childName: "Ahmed Bennani",
    type: "Certificat",
    name: "Certificat d'Inscription",
    date: "2025-09-15",
    status: "pending"
  },
  {
    id: 4,
    childName: "Sara Bennani",
    type: "Bulletin",
    name: "Relevé de Notes S2",
    date: "2025-08-20",
    status: "approved",
    downloadUrl: "#"
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

const DocumentParents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tous les types');
  const navigate = useNavigate();

  const userData = {
    firstName: "Fatima",
    lastName: "Bennani",
    profilePic: "https://ui-avatars.com/api/?name=Fatima+Bennani&background=17766e&color=fff&size=200"
  };

  const filteredDocs = docs.filter(doc =>
    (filterType === "Tous les types" || doc.type === filterType) &&
    (
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.childName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="parent-docs-page">
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
          <h1 className="parent-page-title">Documents</h1>
        </header>
        <div className="parent-docs-content">
          <div className="parent-docs-filters">
            <div className="parent-docs-search">
              <Search size={20} className="parent-docs-search-icon" />
              <input
                type="text"
                placeholder="Rechercher un document, un enfant..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="parent-docs-search-input"
              />
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="parent-docs-filter-select"
            >
              {documentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="parent-docs-list">
            {filteredDocs.length === 0 ? (
              <div className="parent-docs-empty">
                <FileText size={64} className="parent-docs-empty-icon" />
                <h3>Aucun document trouvé</h3>
                <p>Essayez de modifier vos critères de recherche.</p>
              </div>
            ) : (
              filteredDocs.map(doc => (
                <div key={doc.id} className="parent-docs-item">
                  <div className="parent-docs-avatar">
                    <User size={24} />
                  </div>
                  <div className="parent-docs-info">
                    <h4 className="parent-docs-name">{doc.name}</h4>
                    <p className="parent-docs-child">{doc.childName}</p>
                    <p className="parent-docs-date"><Calendar size={16} /> {doc.date}</p>
                  </div>
                  <div className="parent-docs-status"
                    style={{
                      background: `${getStatusColor(doc.status)}15`,
                      color: getStatusColor(doc.status)
                    }}>
                    {getStatusIcon(doc.status)}
                    <span>{getStatusText(doc.status)}</span>
                  </div>
                  {doc.downloadUrl && (
                    <a href={doc.downloadUrl} className="parent-docs-download-btn" download>
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

export default DocumentParents;
