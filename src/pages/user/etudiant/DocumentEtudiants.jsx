// src/components/Etudiant/MesDocuments.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  FileText,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/etudiant/DocumentEtudiants.css';

const MesDocuments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeDocument, setActiveDocument] = useState(null);

  const navigate = useNavigate();
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const documents = [
    {
      id: 1,
      title: "Attestation de Scolarité",
      docType: "Attestation",
      uploadDate: "2025-09-15",
      year: "2025",
      status: "valid",
      downloadUrl: "#",
    },
    {
      id: 2,
      title: "Bulletin S1",
      docType: "Bulletin",
      uploadDate: "2025-07-04",
      year: "2024",
      status: "valid",
      downloadUrl: "#",
    },
    {
      id: 3,
      title: "Certificat de Réussite",
      docType: "Certificat",
      uploadDate: "2025-07-12",
      year: "2025",
      status: "valid",
      downloadUrl: "#",
    },
    {
      id: 4,
      title: "Convention de Stage",
      docType: "Convention",
      uploadDate: "2025-06-16",
      year: "2025",
      status: "pending",
    },
    {
      id: 5,
      title: "Attestation d'Inscription",
      docType: "Attestation",
      uploadDate: "2024-09-25",
      year: "2024",
      status: "valid",
      downloadUrl: "#",
    }
  ];

  const typeOptions = [
    "all",
    "Attestation",
    "Bulletin",
    "Certificat",
    "Convention"
  ];

  const getDocStatusIcon = status => {
    switch (status) {
      case "valid":
        return <CheckCircle size={20} />;
      case "pending":
        return <Clock size={20} />;
      case "rejected":
        return <XCircle size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  const getDocStatusColor = status => {
    switch (status) {
      case "valid":
        return '#10b981';
      case "pending":
        return '#f59e0b';
      case "rejected":
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getDocStatusText = status => {
    switch (status) {
      case "valid":
        return "Valide";
      case "pending":
        return "En traitement";
      case "rejected":
        return "Rejeté";
      default:
        return "Valide";
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const searchOk = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const filterOk = filterType === 'all' || doc.docType === filterType;
    return searchOk && filterOk;
  });

  return (
    <div className="mes-documents-page">
      {/* Sidebar */}
      <aside className={`mes-documents-sidebar ${sidebarOpen ? 'mes-documents-sidebar-open' : 'mes-documents-sidebar-closed'}`}>
        <div className="mes-documents-sidebar-content">
          <div className="mes-documents-profile-section">
            <img src={userData.profilePic} alt="Profile" className="mes-documents-profile-pic" />
            {sidebarOpen && (
              <div className="mes-documents-profile-info">
                <h3 className="mes-documents-profile-name">{userData.firstName} {userData.lastName}</h3>
                <p className="mes-documents-profile-role">Étudiant</p>
              </div>
            )}
          </div>
          <nav className="mes-documents-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                }}
                className={`mes-documents-menu-item ${activeTab === item.id ? 'mes-documents-menu-item-active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
          <button className="mes-documents-disconnect-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="mes-documents-main-content">
        {/* Header */}
        <header className="mes-documents-page-header">
          <button
            className="mes-documents-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="mes-documents-page-title">Mes Documents</h1>
        </header>
        <div className="mes-documents-container">
          <div className="mes-documents-header">
            <div className="mes-documents-title-section">
              <p className="mes-documents-subtitle">Accédez et téléchargez tous vos documents scolaires archivés</p>
            </div>
          </div>

          {/* Filters */}
          <div className="mes-documents-filters">
            <div className="mes-documents-search">
              <Search className="mes-documents-search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="mes-documents-search-input"
              />
            </div>
            {/* Custom filter dropdown */}
            <div className="mes-documents-custom-filter" ref={filterRef}>
              <button
                className="mes-documents-filter-dropdown-btn"
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                aria-label="Filtrer par type"
                type="button"
              >
                <Filter size={20} />
                <span>
                  {filterType === "all" ? "Tous les types" : filterType}
                </span>
                <span className={`mes-documents-filter-arrow ${filterDropdownOpen ? "open" : ""}`}></span>
              </button>
              {filterDropdownOpen && (
                <ul className="mes-documents-filter-options">
                  {typeOptions.map((type, i) => (
                    <li
                      key={i}
                      className={`mes-documents-filter-option${type === filterType ? ' active' : ''}`}
                      onClick={() => { setFilterType(type); setFilterDropdownOpen(false); }}
                    >
                      {type === "all" ? "Tous les types" : type}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Documents List */}
          <div className="mes-documents-list">
            {filteredDocuments.map(doc => (
              <div key={doc.id} className="mes-documents-card">
                <div className="mes-documents-card-header">
                  <div className="mes-documents-card-title-section">
                    <h3 className="mes-documents-card-title">{doc.title}</h3>
                    <span className="mes-documents-type">{doc.docType}</span>
                  </div>
                  <div
                    className="mes-documents-status-badge"
                    style={{
                      background: `${getDocStatusColor(doc.status)}20`,
                      color: getDocStatusColor(doc.status),
                    }}>
                    {getDocStatusIcon(doc.status)}
                    <span>{getDocStatusText(doc.status)}</span>
                  </div>
                </div>
                <div className="mes-documents-card-body">
                  <div className="mes-documents-info-grid">
                    <div className="mes-documents-info-item">
                      <Calendar size={16} className="mes-documents-info-icon" />
                      <div>
                        <p className="mes-documents-info-label">Date d'archivage</p>
                        <p className="mes-documents-info-value">{doc.uploadDate}</p>
                      </div>
                    </div>
                    <div className="mes-documents-info-item">
                      <FileText size={16} className="mes-documents-info-icon" />
                      <div>
                        <p className="mes-documents-info-label">Année</p>
                        <p className="mes-documents-info-value">{doc.year}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mes-documents-card-footer">
                  <button
                    className="mes-documents-action-btn mes-documents-view-btn"
                    onClick={() => { setActiveDocument(doc); setShowDetailsModal(true); }}
                  >
                    <Eye size={18} />
                    Détails
                  </button>
                  {doc.status === "valid" && doc.downloadUrl && (
                    <button className="mes-documents-action-btn mes-documents-download-btn">
                      <Download size={18} />
                      Télécharger
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredDocuments.length === 0 && (
              <div className="mes-documents-empty">
                <FileText size={64} className="mes-documents-empty-icon" />
                <h3 className="mes-documents-empty-title">Aucun document trouvé</h3>
                <p className="mes-documents-empty-text">
                  {searchTerm || filterType !== 'all'
                    ? "Essayez de modifier vos critères de recherche"
                    : "Aucun document archivé pour le moment"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Details Modal */}
      {showDetailsModal && activeDocument && (
        <div className="mes-documents-modal-overlay">
          <div className="mes-documents-details-modal">
            <div className="mes-documents-details-header">
              <h2>Détail du document</h2>
              <button
                className="mes-documents-details-close"
                onClick={() => setShowDetailsModal(false)}
              ><X size={24}/></button>
            </div>
            <div className="mes-documents-details-body">
              <div className="mes-documents-details-row">
                <span className="label">Titre :</span>
                <span>{activeDocument.title}</span>
              </div>
              <div className="mes-documents-details-row">
                <span className="label">Type :</span>
                <span>{activeDocument.docType}</span>
              </div>
              <div className="mes-documents-details-row">
                <span className="label">Année :</span>
                <span>{activeDocument.year}</span>
              </div>
              <div className="mes-documents-details-row">
                <span className="label">Date d'archivage :</span>
                <span>{activeDocument.uploadDate}</span>
              </div>
              <div className="mes-documents-details-row">
                <span className="label">Statut :</span>
                <span className={`mes-documents-details-status ${activeDocument.status}`}>
                  {getDocStatusText(activeDocument.status)}
                </span>
              </div>
            </div>
            <div className="mes-documents-details-footer">
              {activeDocument.downloadUrl && activeDocument.status === 'valid' && (
                <a
                  href={activeDocument.downloadUrl}
                  className="mes-documents-details-download-btn"
                  download
                >
                  <Download size={20} /> Télécharger le document
                </a>
              )}
              <button className="mes-documents-details-close-btn" onClick={() => setShowDetailsModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesDocuments;
