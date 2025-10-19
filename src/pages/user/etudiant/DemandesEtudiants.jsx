import React, { useState, useRef, useEffect } from 'react';
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
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Send,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/etudiant/DemandesEtudiants.css';

const statusOptions = [
  { key: 'all', label: 'Tous les statuts' },
  { key: 'pending', label: 'En attente' },
  { key: 'in_progress', label: 'En cours' },
  { key: 'approved', label: 'Approuvées' },
  { key: 'rejected', label: 'Rejetées' }
];

const StudentRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [urgency, setUrgency] = useState('normal');
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

  const requests = [
    {
      id: 1,
      documentType: "Attestation de Scolarité",
      requestDate: "2025-10-10",
      status: "pending",
      reason: "Pour la banque",
      urgency: "urgent",
      estimatedDate: "2025-10-15",
      trackingNumber: "REQ-2025-001234"
    },
    {
      id: 2,
      documentType: "Relevé de Notes S1",
      requestDate: "2025-10-08",
      status: "in_progress",
      reason: "Candidature master",
      urgency: "normal",
      estimatedDate: "2025-10-12",
      trackingNumber: "REQ-2025-001198",
      processedBy: "Mme. Benali"
    },
    {
      id: 3,
      documentType: "Certificat de Réussite",
      requestDate: "2025-10-01",
      status: "approved",
      reason: "Dossier employeur",
      urgency: "normal",
      completedDate: "2025-10-05",
      trackingNumber: "REQ-2025-001145",
      processedBy: "M. Tazi",
      downloadUrl: "#"
    },
    {
      id: 4,
      documentType: "Convention de Stage",
      requestDate: "2025-09-28",
      status: "rejected",
      reason: "Stage à l'étranger",
      urgency: "urgent",
      rejectionReason: "Documents incomplets - Stage hors Maroc nécessite accord préalable",
      trackingNumber: "REQ-2025-001089",
      processedBy: "Mme. Idrissi"
    },
    {
      id: 5,
      documentType: "Attestation d'Inscription",
      requestDate: "2025-09-25",
      status: "approved",
      reason: "Assurance étudiante",
      urgency: "normal",
      completedDate: "2025-09-27",
      trackingNumber: "REQ-2025-001034",
      processedBy: "M. Alami",
      downloadUrl: "#"
    },
    {
      id: 6,
      documentType: "Bulletin 2024-2025",
      requestDate: "2025-09-20",
      status: "approved",
      reason: "Dossier de bourse",
      urgency: "urgent",
      completedDate: "2025-09-22",
      trackingNumber: "REQ-2025-000987",
      processedBy: "Mme. Fassi",
      downloadUrl: "#"
    }
  ];

  const documentTypes = [
    "Attestation de Scolarité",
    "Attestation d'Inscription",
    "Attestation de Réussite",
    "Certificat de Scolarité",
    "Relevé de Notes",
    "Bulletin Semestriel",
    "Convention de Stage",
    "Certificat de Stage",
    "Attestation de Non-Redoublement"
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle size={20} />;
      case 'rejected': return <XCircle size={20} />;
      case 'pending': return <AlertCircle size={20} />;
      case 'in_progress': return <Clock size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending': return '#f59e0b';
      case 'in_progress': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours de traitement';
      default: return 'En attente';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleNewRequest = (e) => {
    e.preventDefault();
    setShowNewRequestModal(false);
    setSelectedDocumentType('');
    setRequestReason('');
    setUrgency('normal');
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="student-requests-page">
      {/* Sidebar */}
      <aside className={`student-requests-sidebar ${sidebarOpen ? 'student-requests-sidebar-open' : 'student-requests-sidebar-closed'}`}>
        <div className="student-requests-sidebar-content">
          <div className="student-requests-profile-section">
            <img src={userData.profilePic} alt="Profile" className="student-requests-profile-pic" />
            {sidebarOpen && (
              <div className="student-requests-profile-info">
                <h3 className="student-requests-profile-name">{userData.firstName} {userData.lastName}</h3>
                <p className="student-requests-profile-role">Étudiant</p>
              </div>
            )}
          </div>
          <nav className="student-requests-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                }}
                className={`student-requests-menu-item ${activeTab === item.id ? 'student-requests-menu-item-active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
          <button className="student-requests-disconnect-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="student-requests-main-content">
        <header className="student-requests-page-header">
          <button
            className="student-requests-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="student-requests-page-title">Mes Demandes</h1>
        </header>
        <div className="student-requests-container">
          <div className="student-requests-header">
            <div className="student-requests-title-section">
              <p className="student-requests-subtitle">Gérez et suivez toutes vos demandes de documents</p>
            </div>
            <button
              className="student-requests-new-btn"
              onClick={() => setShowNewRequestModal(true)}
            >
              <Plus size={20} />
              <span>Nouvelle demande</span>
            </button>
          </div>
          <div className="student-requests-stats">
            <div className="student-requests-stat-card">
              <div className="student-requests-stat-icon" style={{background: '#3b82f6'}}>
                <FileText size={24} />
              </div>
              <div className="student-requests-stat-info">
                <p className="student-requests-stat-label">Total</p>
                <p className="student-requests-stat-value">{stats.total}</p>
              </div>
            </div>
            <div className="student-requests-stat-card">
              <div className="student-requests-stat-icon" style={{background: '#f59e0b'}}>
                <AlertCircle size={24} />
              </div>
              <div className="student-requests-stat-info">
                <p className="student-requests-stat-label">En attente</p>
                <p className="student-requests-stat-value">{stats.pending}</p>
              </div>
            </div>
            <div className="student-requests-stat-card">
              <div className="student-requests-stat-icon" style={{background: '#3b82f6'}}>
                <Clock size={24} />
              </div>
              <div className="student-requests-stat-info">
                <p className="student-requests-stat-label">En cours</p>
                <p className="student-requests-stat-value">{stats.inProgress}</p>
              </div>
            </div>
            <div className="student-requests-stat-card">
              <div className="student-requests-stat-icon" style={{background: '#10b981'}}>
                <CheckCircle size={24} />
              </div>
              <div className="student-requests-stat-info">
                <p className="student-requests-stat-label">Approuvées</p>
                <p className="student-requests-stat-value">{stats.approved}</p>
              </div>
            </div>
            <div className="student-requests-stat-card">
              <div className="student-requests-stat-icon" style={{background: '#ef4444'}}>
                <XCircle size={24} />
              </div>
              <div className="student-requests-stat-info">
                <p className="student-requests-stat-label">Rejetées</p>
                <p className="student-requests-stat-value">{stats.rejected}</p>
              </div>
            </div>
          </div>
          <div className="student-requests-filters">
            <div className="student-requests-search">
              <Search className="student-requests-search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher par document ou numéro de suivi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="student-requests-search-input"
              />
            </div>
            {/* Custom Filter Dropdown */}
            <div className="student-requests-custom-filter" ref={filterRef}>
              <button
                className="student-requests-filter-dropdown-btn"
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                aria-label="Filtrer par statut"
                type="button"
              >
                <Filter size={20} />
                <span>
                  {statusOptions.find(opt => opt.key === filterStatus)?.label}
                </span>
                <span className={`student-requests-filter-arrow ${filterDropdownOpen ? "open" : ""}`}></span>
              </button>
              {filterDropdownOpen && (
                <ul className="student-requests-filter-options">
                  {statusOptions.map(opt => (
                    <li
                      key={opt.key}
                      className={`student-requests-filter-option${filterStatus === opt.key ? " active" : ""}`}
                      onClick={() => { setFilterStatus(opt.key); setFilterDropdownOpen(false); }}
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="student-requests-list">
            {filteredRequests.map(request => (
              <div key={request.id} className="student-requests-card">
                <div className="student-requests-card-header">
                  <div className="student-requests-card-title-section">
                    <h3 className="student-requests-card-title">{request.documentType}</h3>
                    <span className="student-requests-tracking">#{request.trackingNumber}</span>
                  </div>
                  <div className="student-requests-card-badges">
                    {request.urgency === 'urgent' && (
                      <span className="student-requests-urgency-badge">
                        <AlertCircle size={14} />
                        Urgent
                      </span>
                    )}
                    <div
                      className="student-requests-status-badge"
                      style={{
                        background: `${getStatusColor(request.status)}20`,
                        color: getStatusColor(request.status)
                      }}
                    >
                      {getStatusIcon(request.status)}
                      <span>{getStatusText(request.status)}</span>
                    </div>
                  </div>
                </div>
                <div className="student-requests-card-body">
                  <div className="student-requests-info-grid">
                    <div className="student-requests-info-item">
                      <Calendar size={16} className="student-requests-info-icon" />
                      <div>
                        <p className="student-requests-info-label">Date de demande</p>
                        <p className="student-requests-info-value">{request.requestDate}</p>
                      </div>
                    </div>
                    <div className="student-requests-info-item">
                      <FileText size={16} className="student-requests-info-icon" />
                      <div>
                        <p className="student-requests-info-label">Motif</p>
                        <p className="student-requests-info-value">{request.reason}</p>
                      </div>
                    </div>
                    {request.status === 'pending' && request.estimatedDate && (
                      <div className="student-requests-info-item">
                        <Clock size={16} className="student-requests-info-icon" />
                        <div>
                          <p className="student-requests-info-label">Date estimée</p>
                          <p className="student-requests-info-value">{request.estimatedDate}</p>
                        </div>
                      </div>
                    )}
                    {request.status === 'in_progress' && (
                      <div className="student-requests-info-item">
                        <User size={16} className="student-requests-info-icon" />
                        <div>
                          <p className="student-requests-info-label">Traité par</p>
                          <p className="student-requests-info-value">{request.processedBy}</p>
                        </div>
                      </div>
                    )}
                    {request.status === 'approved' && (
                      <div className="student-requests-info-item">
                        <CheckCircle size={16} className="student-requests-info-icon" />
                        <div>
                          <p className="student-requests-info-label">Date de validation</p>
                          <p className="student-requests-info-value">{request.completedDate}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {request.status === 'rejected' && request.rejectionReason && (
                    <div className="student-requests-rejection">
                      <AlertCircle size={16} />
                      <div>
                        <p className="student-requests-rejection-title">Raison du rejet</p>
                        <p className="student-requests-rejection-text">{request.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="student-requests-card-footer">
                  <button
                    className="student-requests-action-btn student-requests-view-btn"
                    onClick={() => { setActiveRequest(request); setShowDetailsModal(true); }}
                  >
                    <Eye size={18} />
                    Détails
                  </button>
                  {request.status === 'approved' && request.downloadUrl && (
                    <button className="student-requests-action-btn student-requests-download-btn">
                      <Download size={18} />
                      Télécharger
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filteredRequests.length === 0 && (
              <div className="student-requests-empty">
                <FileText size={64} className="student-requests-empty-icon" />
                <h3 className="student-requests-empty-title">Aucune demande trouvée</h3>
                <p className="student-requests-empty-text">
                  {searchTerm || filterStatus !== 'all'
                    ? "Essayez de modifier vos critères de recherche"
                    : "Vous n'avez pas encore fait de demande"}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <button
                    className="student-requests-empty-btn"
                    onClick={() => setShowNewRequestModal(true)}
                  >
                    <Plus size={20} />
                    Faire une demande
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Details Modal */}
      {showDetailsModal && activeRequest && (
        <div className="student-requests-modal-overlay">
          <div className="student-requests-details-modal">
            <div className="student-requests-details-header">
              <h2>Détail de la demande</h2>
              <button
                className="student-requests-details-close"
                onClick={() => setShowDetailsModal(false)}
              ><X size={24}/></button>
            </div>
            <div className="student-requests-details-body">
              <div className="student-requests-details-row">
                <span className="label">Document :</span>
                <span>{activeRequest.documentType}</span>
              </div>
              <div className="student-requests-details-row">
                <span className="label">Numéro de suivi :</span>
                <span>{activeRequest.trackingNumber}</span>
              </div>
              <div className="student-requests-details-row">
                <span className="label">Date :</span>
                <span>{activeRequest.requestDate}</span>
              </div>
              <div className="student-requests-details-row">
                <span className="label">Motif :</span>
                <span>{activeRequest.reason}</span>
              </div>
              <div className="student-requests-details-row">
                <span className="label">Statut :</span>
                <span className={`student-requests-details-status ${activeRequest.status}`}>
                  {getStatusText(activeRequest.status)}
                </span>
              </div>
              {activeRequest.urgency && (
                <div className="student-requests-details-row">
                  <span className="label">Urgence :</span>
                  <span>{activeRequest.urgency === 'urgent' ? 'Urgent' : 'Normal'}</span>
                </div>
              )}
              {activeRequest.estimatedDate && (
                <div className="student-requests-details-row">
                  <span className="label">Date estimée :</span>
                  <span>{activeRequest.estimatedDate}</span>
                </div>
              )}
              {activeRequest.completedDate && (
                <div className="student-requests-details-row">
                  <span className="label">Validée le :</span>
                  <span>{activeRequest.completedDate}</span>
                </div>
              )}
              {activeRequest.processedBy && (
                <div className="student-requests-details-row">
                  <span className="label">Traité par :</span>
                  <span>{activeRequest.processedBy}</span>
                </div>
              )}
              {activeRequest.rejectionReason && (
                <div className="student-requests-details-row" style={{ color: '#ef4444', fontWeight: 600 }}>
                  <span className="label" style={{ color: '#ef4444' }}>Motif du rejet :</span>
                  <span>{activeRequest.rejectionReason}</span>
                </div>
              )}
            </div>
            <div className="student-requests-details-footer">
              {activeRequest.downloadUrl && activeRequest.status === 'approved' && (
                <a
                  href={activeRequest.downloadUrl}
                  className="student-requests-details-download-btn"
                  download
                >
                  <Download size={20} /> Télécharger le document
                </a>
              )}
              <button className="student-requests-details-close-btn" onClick={() => setShowDetailsModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="student-requests-modal-overlay">
          <div className="student-requests-modal">
            <div className="student-requests-modal-header">
              <h2 className="student-requests-modal-title">Nouvelle demande de document</h2>
              <button 
                className="student-requests-modal-close"
                onClick={() => setShowNewRequestModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleNewRequest} className="student-requests-modal-form">
              <div className="student-requests-form-group">
                <label className="student-requests-form-label">Type de document *</label>
                <select
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                  className="student-requests-form-select"
                  required
                >
                  <option value="">Sélectionnez un type de document</option>
                  {documentTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="student-requests-form-group">
                <label className="student-requests-form-label">Motif de la demande *</label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="student-requests-form-textarea"
                  placeholder="Ex: Pour un dossier de bourse, pour l'employeur, etc."
                  rows="4"
                  required
                />
              </div>

              <div className="student-requests-form-group">
                <label className="student-requests-form-label">Urgence</label>
                <div className="student-requests-radio-group">
                  <label className="student-requests-radio-label">
                    <input
                      type="radio"
                      name="urgency"
                      value="normal"
                      checked={urgency === 'normal'}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="student-requests-radio"
                    />
                    <span>Normal (5-7 jours)</span>
                  </label>
                  <label className="student-requests-radio-label">
                    <input
                      type="radio"
                      name="urgency"
                      value="urgent"
                      checked={urgency === 'urgent'}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="student-requests-radio"
                    />
                    <span>Urgent (2-3 jours)</span>
                  </label>
                </div>
              </div>

              <div className="student-requests-modal-footer">
                <button
                  type="button"
                  className="student-requests-cancel-btn"
                  onClick={() => setShowNewRequestModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="student-requests-submit-btn">
                  <Send size={20} />
                  Envoyer la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRequests;