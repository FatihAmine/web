import React, { useState } from 'react';
import Sidebar from '../../component/sidebaretudiant';
import CustomDropdown from '../../component/CustomDropdown';
import {
  Bell,
  FileText,
  Menu,
  X,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/etudiant/DocumentEtudiants.css';

const MesDocuments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [activeTab, setActiveTab] = useState('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeDocument, setActiveDocument] = useState(null);

  const navigate = useNavigate();

  const userData = {
    firstName: "Mohamed",
    lastName: "Alami",
    role: "Étudiant",
    profilePic: "https://ui-avatars.com/api/?name=Mohamed+Alami&background=17766e&color=fff&size=200"
  };

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
      id: 5,
      title: "Attestation d'Inscription",
      docType: "Attestation",
      uploadDate: "2024-09-25",
      year: "2024",
      status: "valid",
      downloadUrl: "#",
    },
    {
      id: 6,
      title: "Relevé de Notes S2",
      docType: "Bulletin",
      uploadDate: "2024-06-30",
      year: "2024",
      status: "valid",
      downloadUrl: "#",
    }
  ];

  const filterOptions = [
    { value: '', label: 'Tous les types', icon: Filter, color: '#5eead4' },
    { value: 'Attestation', label: 'Attestation', icon: FileText, color: '#10b981' },
    { value: 'Bulletin', label: 'Bulletin', icon: FileText, color: '#3b82f6' },
    { value: 'Certificat', label: 'Certificat', icon: FileText, color: '#8b5cf6' },
    { value: 'Convention', label: 'Convention', icon: FileText, color: '#f59e0b' }
  ];

  const handleLogout = () => {
    navigate('/etudiant/login');
  };

  const getDocStatusIcon = status => {
    switch (status) {
      case "valid": return CheckCircle;
      case "pending": return Clock;
      case "rejected": return XCircle;
      default: return CheckCircle;
    }
  };

  const getDocStatusColor = status => {
    switch (status) {
      case "valid": return '#10b981';
      case "pending": return '#f59e0b';
      case "rejected": return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDocStatusText = status => {
    switch (status) {
      case "valid": return "Valide";
      case "pending": return "En traitement";
      case "rejected": return "Rejeté";
      default: return "Valide";
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const searchOk = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const filterOk = filterType === '' || doc.docType === filterType;
    return searchOk && filterOk;
  });

  // Stats
  const totalDocs = documents.length;
  const validDocs = documents.filter(d => d.status === 'valid').length;
  const pendingDocs = documents.filter(d => d.status === 'pending').length;

  return (
    <div className="mes-documents-page">
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

      <main className={`mes-documents-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="mes-documents-page-header">
          <button
            className="mes-documents-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="mes-documents-page-title">Mes Documents</h1>
          <div className="mes-documents-header-actions">
            <button className="mes-documents-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="mes-documents-container">
          {/* Stats Cards */}
          <div className="mes-documents-stats-grid">
            <div className="mes-documents-stat-card stat-total">
              <div className="stat-icon">
                <FileText size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Documents</p>
                <h3 className="stat-value">{totalDocs}</h3>
              </div>
            </div>
            <div className="mes-documents-stat-card stat-valid">
              <div className="stat-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Valides</p>
                <h3 className="stat-value">{validDocs}</h3>
              </div>
            </div>
            <div className="mes-documents-stat-card stat-pending">
              <div className="stat-icon">
                <Clock size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">En Traitement</p>
                <h3 className="stat-value">{pendingDocs}</h3>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mes-documents-filters">
            <CustomDropdown
              options={filterOptions}
              value={filterType}
              onChange={setFilterType}
              icon={Filter}
            />
            <div className="mes-documents-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher documents..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="mes-documents-search-input"
              />
            </div>
          </div>

          {/* Documents Grid */}
          <div className="mes-documents-grid">
            {filteredDocuments.length === 0 ? (
              <div className="mes-documents-empty">
                <FileText size={64} />
                <h3>Aucun document trouvé</h3>
                <p>
                  {searchTerm || filterType
                    ? "Essayez de modifier vos critères de recherche"
                    : "Aucun document archivé pour le moment"}
                </p>
              </div>
            ) : (
              filteredDocuments.map(doc => {
                const StatusIcon = getDocStatusIcon(doc.status);
                return (
                  <div key={doc.id} className="mes-documents-card">
                    <div className="doc-card-header">
                      <div className="doc-icon">
                        <FileText size={20} />
                      </div>
                      <span 
                        className="doc-status"
                        style={{
                          background: `${getDocStatusColor(doc.status)}1a`,
                          color: getDocStatusColor(doc.status)
                        }}
                      >
                        <StatusIcon size={16} />
                        {getDocStatusText(doc.status)}
                      </span>
                    </div>
                    <div className="doc-card-body">
                      <h3 className="doc-title">{doc.title}</h3>
                      <div className="doc-meta">
                        <div className="doc-meta-item">
                          <Calendar size={14} />
                          <span>{doc.uploadDate}</span>
                        </div>
                        <div className="doc-meta-item">
                          <FileText size={14} />
                          <span>Année {doc.year}</span>
                        </div>
                      </div>
                      <div className="doc-type-badge">
                        <span className={`doc-type ${doc.docType.toLowerCase()}`}>
                          {doc.docType}
                        </span>
                      </div>
                    </div>
                    <div className="doc-card-footer">
                      {doc.status === "valid" && doc.downloadUrl && (
                        <a
                          href={doc.downloadUrl}
                          className="doc-action-btn download"
                          download
                        >
                          <Download size={16} />
                          <span>Télécharger</span>
                        </a>
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
      {showDetailsModal && activeDocument && (
        <div className="mes-documents-modal-backdrop">
          <div className="mes-documents-modal">
            <button
              className="mes-documents-modal-close"
              onClick={() => setShowDetailsModal(false)}
            >
              <X size={22} />
            </button>
            <h3 className="mes-documents-modal-title">
              <FileText size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#5eead4"}} />
              Détail du document
            </h3>
            <div className="mes-documents-modal-fields">
              <div className="modal-field">
                <strong>Titre :</strong>
                <span>{activeDocument.title}</span>
              </div>
              <div className="modal-field">
                <strong>Type :</strong>
                <span>{activeDocument.docType}</span>
              </div>
              <div className="modal-field">
                <strong>Année :</strong>
                <span>{activeDocument.year}</span>
              </div>
              <div className="modal-field">
                <strong>Date d'archivage :</strong>
                <span>{activeDocument.uploadDate}</span>
              </div>
              <div className="modal-field">
                <strong>Statut :</strong>
                <span style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '999px',
                  background: `${getDocStatusColor(activeDocument.status)}1a`,
                  color: getDocStatusColor(activeDocument.status),
                  fontWeight: 600,
                  display: 'inline-block'
                }}>
                  {getDocStatusText(activeDocument.status)}
                </span>
              </div>
            </div>
            <div className="mes-documents-modal-footer">
              {activeDocument.downloadUrl && activeDocument.status === 'valid' && (
                <a
                  href={activeDocument.downloadUrl}
                  className="mes-documents-download-btn"
                  download
                >
                  <Download size={18} /> Télécharger
                </a>
              )}
              <button 
                className="mes-documents-close-btn" 
                onClick={() => setShowDetailsModal(false)}
              >
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
