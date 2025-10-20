import React, { useState } from 'react';
import Sidebar from '../../component/sidebaretudiant';
import CustomDropdown from '../../component/CustomDropdown';
import {
  Bell,
  FileText,
  Menu,
  X,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Send,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/etudiant/DemandesEtudiants.css';

const StudentRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [urgency, setUrgency] = useState('normal');
  
  const navigate = useNavigate();

  const userData = {
    firstName: "Mohamed",
    lastName: "Alami",
    role: "Étudiant",
    profilePic: "https://ui-avatars.com/api/?name=Mohamed+Alami&background=17766e&color=fff&size=200"
  };

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

  const filterOptions = [
    { value: '', label: 'Tous les statuts', icon: Filter, color: '#5eead4' },
    { value: 'pending', label: 'En attente', icon: AlertCircle, color: '#f59e0b' },
    { value: 'in_progress', label: 'En cours', icon: Clock, color: '#3b82f6' },
    { value: 'approved', label: 'Approuvées', icon: CheckCircle, color: '#10b981' },
    { value: 'rejected', label: 'Rejetées', icon: XCircle, color: '#ef4444' }
  ];

  const handleLogout = () => {
    navigate('/etudiant/login');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'pending': return AlertCircle;
      case 'in_progress': return Clock;
      default: return Clock;
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
      case 'in_progress': return 'En cours';
      default: return 'En attente';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === '' || request.status === filterStatus;
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
    approved: requests.filter(r => r.status === 'approved').length
  };

  return (
    <div className="student-requests-page">
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

      <main className={`student-requests-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="student-requests-page-header">
          <button
            className="student-requests-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="student-requests-page-title">Mes Demandes</h1>
          <div className="student-requests-header-actions">
            <button className="student-requests-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="student-requests-container">
          {/* Header with New Request Button */}
          <div className="student-requests-top-bar">
            <p className="student-requests-subtitle">Gérez et suivez toutes vos demandes de documents</p>
            <button
              className="student-requests-new-btn"
              onClick={() => setShowNewRequestModal(true)}
            >
              <Plus size={20} />
              <span>Nouvelle demande</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="student-requests-stats-grid">
            <div className="student-requests-stat-card stat-total">
              <div className="stat-icon">
                <FileText size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total</p>
                <h3 className="stat-value">{stats.total}</h3>
              </div>
            </div>
            <div className="student-requests-stat-card stat-pending">
              <div className="stat-icon">
                <AlertCircle size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">En attente</p>
                <h3 className="stat-value">{stats.pending}</h3>
              </div>
            </div>
            <div className="student-requests-stat-card stat-progress">
              <div className="stat-icon">
                <Clock size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">En cours</p>
                <h3 className="stat-value">{stats.inProgress}</h3>
              </div>
            </div>
            <div className="student-requests-stat-card stat-approved">
              <div className="stat-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Approuvées</p>
                <h3 className="stat-value">{stats.approved}</h3>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="student-requests-filters">
            <CustomDropdown
              options={filterOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              icon={Filter}
            />
            <div className="student-requests-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher par document ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="student-requests-search-input"
              />
            </div>
          </div>
          {/* Requests Grid */}
          <div className="student-requests-grid">
            {filteredRequests.length === 0 ? (
              <div className="student-requests-empty">
                <FileText size={64} />
                <h3>Aucune demande trouvée</h3>
                <p>
                  {searchTerm || filterStatus
                    ? "Essayez de modifier vos critères de recherche"
                    : "Vous n'avez pas encore fait de demande"}
                </p>
                {!searchTerm && !filterStatus && (
                  <button
                    className="student-requests-empty-btn"
                    onClick={() => setShowNewRequestModal(true)}
                  >
                    <Plus size={20} />
                    Faire une demande
                  </button>
                )}
              </div>
            ) : (
              filteredRequests.map(request => {
                const StatusIcon = getStatusIcon(request.status);
                return (
                  <div key={request.id} className="student-requests-card">
                    <div className="request-card-header">
                      <div className="request-icon">
                        <FileText size={20} />
                      </div>
                      <div className="request-badges">
                        {request.urgency === 'urgent' && (
                          <span className="urgency-badge">
                            <AlertCircle size={14} />
                            Urgent
                          </span>
                        )}
                        <span 
                          className="status-badge"
                          style={{
                            background: `${getStatusColor(request.status)}1a`,
                            color: getStatusColor(request.status)
                          }}
                        >
                          <StatusIcon size={16} />
                          {getStatusText(request.status)}
                        </span>
                      </div>
                    </div>
                    <div className="request-card-body">
                      <h3 className="request-title">{request.documentType}</h3>
                      <p className="request-tracking">#{request.trackingNumber}</p>
                      <div className="request-meta">
                        <div className="request-meta-item">
                          <Calendar size={14} />
                          <span>{request.requestDate}</span>
                        </div>
                        <div className="request-meta-item">
                          <FileText size={14} />
                          <span>{request.reason}</span>
                        </div>
                      </div>
                      {request.status === 'rejected' && request.rejectionReason && (
                        <div className="rejection-notice">
                          <AlertCircle size={16} />
                          <p>{request.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                    <div className="request-card-footer">
                      <button
                        className="request-action-btn view"
                        onClick={() => { 
                          setActiveRequest(request); 
                          setShowDetailsModal(true); 
                        }}
                      >
                        <Eye size={16} />
                        <span>Détails</span>
                      </button>
                      {request.status === 'approved' && request.downloadUrl && (
                        <a
                          href={request.downloadUrl}
                          
                          download
                        >                    
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
      {showDetailsModal && activeRequest && (
        <div className="student-requests-modal-backdrop">
          <div className="student-requests-modal">
            <button
              className="student-requests-modal-close"
              onClick={() => setShowDetailsModal(false)}
            >
              <X size={22} />
            </button>
            <h3 className="student-requests-modal-title">
              <FileText size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#5eead4"}} />
              Détail de la demande
            </h3>
            <div className="student-requests-modal-fields">
              <div className="modal-field">
                <strong>Document :</strong>
                <span>{activeRequest.documentType}</span>
              </div>
              <div className="modal-field">
                <strong>Numéro de suivi :</strong>
                <span>{activeRequest.trackingNumber}</span>
              </div>
              <div className="modal-field">
                <strong>Date :</strong>
                <span>{activeRequest.requestDate}</span>
              </div>
              <div className="modal-field">
                <strong>Motif :</strong>
                <span>{activeRequest.reason}</span>
              </div>
              <div className="modal-field">
                <strong>Statut :</strong>
                <span style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '999px',
                  background: `${getStatusColor(activeRequest.status)}1a`,
                  color: getStatusColor(activeRequest.status),
                  fontWeight: 600,
                  display: 'inline-block'
                }}>
                  {getStatusText(activeRequest.status)}
                </span>
              </div>
              {activeRequest.rejectionReason && (
                <div className="modal-field">
                  <strong style={{color: '#ef4444'}}>Motif du rejet :</strong>
                  <span style={{color: '#ef4444'}}>{activeRequest.rejectionReason}</span>
                </div>
              )}
            </div>
            <div className="student-requests-modal-footer">
              {activeRequest.downloadUrl && activeRequest.status === 'approved' && (
                <a
                  href={activeRequest.downloadUrl}
                  className="student-requests-download-btn"
                  download
                >
                  <Download size={18} /> Télécharger
                </a>
              )}
              <button 
                className="student-requests-close-btn" 
                onClick={() => setShowDetailsModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="student-requests-modal-backdrop">
          <div className="student-requests-modal">
            <button 
              className="student-requests-modal-close"
              onClick={() => setShowNewRequestModal(false)}
            >
              <X size={22} />
            </button>
            <h3 className="student-requests-modal-title">
              <Plus size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#5eead4"}} />
              Nouvelle demande de document
            </h3>
            <form onSubmit={handleNewRequest} className="student-requests-form">
              <div className="form-group">
                <label className="form-label">Type de document *</label>
                <select
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Sélectionnez un type de document</option>
                  {documentTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Motif de la demande *</label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="form-textarea"
                  placeholder="Ex: Pour un dossier de bourse, pour l'employeur, etc."
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Urgence</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="urgency"
                      value="normal"
                      checked={urgency === 'normal'}
                      onChange={(e) => setUrgency(e.target.value)}
                    />
                    <span>Normal (5-7 jours)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="urgency"
                      value="urgent"
                      checked={urgency === 'urgent'}
                      onChange={(e) => setUrgency(e.target.value)}
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
                  <Send size={18} />
                  Envoyer
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

