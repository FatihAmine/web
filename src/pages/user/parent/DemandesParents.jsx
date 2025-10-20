import React, { useState } from 'react';
import Sidebar from '../../component/sidebarparent';
import CustomDropdown from '../../component/CustomDropdown';
import { 
  Bell,
  FileText,
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
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
  Users
} from 'lucide-react';
import '../../../css/parent/DemandesParents.css';
import { useNavigate } from 'react-router-dom';

const DemandesParents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterChild, setFilterChild] = useState('');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const navigate = useNavigate();

  const userData = {
    firstName: "Fatima",
    lastName: "Bennani",
    role: "Parent",
    profilePic: "https://ui-avatars.com/api/?name=Fatima+Bennani&background=17766e&color=fff&size=200"
  };

  const children = [
    { id: 1, name: "Ahmed Bennani", class: "1ère année Informatique" },
    { id: 2, name: "Sara Bennani", class: "3ème année Marketing" }
  ];

  const requests = [
    {
      id: 1,
      childName: "Ahmed Bennani",
      documentType: "Attestation de Scolarité",
      requestDate: "2025-10-10",
      status: "pending",
      reason: "Pour ouverture compte bancaire",
      urgency: "urgent",
      estimatedDate: "2025-10-15",
      trackingNumber: "REQ-2025-001234"
    },
    {
      id: 2,
      childName: "Sara Bennani",
      documentType: "Relevé de Notes S1",
      requestDate: "2025-10-08",
      status: "in_progress",
      reason: "Candidature master à l'étranger",
      urgency: "normal",
      estimatedDate: "2025-10-12",
      trackingNumber: "REQ-2025-001198",
      processedBy: "Mme. Benali"
    },
    {
      id: 3,
      childName: "Ahmed Bennani",
      documentType: "Certificat de Réussite",
      requestDate: "2025-10-01",
      status: "approved",
      reason: "Dossier de bourse",
      urgency: "normal",
      completedDate: "2025-10-05",
      trackingNumber: "REQ-2025-001145",
      processedBy: "M. Tazi",
      downloadUrl: "#"
    },
    {
      id: 4,
      childName: "Sara Bennani",
      documentType: "Convention de Stage",
      requestDate: "2025-09-28",
      status: "rejected",
      reason: "Stage international",
      urgency: "urgent",
      rejectionReason: "Documents incomplets - Nécessite autorisation parentale notariée",
      trackingNumber: "REQ-2025-001089",
      processedBy: "Mme. Idrissi"
    }
  ];

  const documentTypes = [
    "Attestation de Scolarité",
    "Attestation d'Inscription",
    "Attestation de Réussite",
    "Certificat de Scolarité",
    "Relevé de Notes",
    "Bulletin Semestriel",
    "Convention de Stage"
  ];

  const statusOptions = [
    { value: '', label: 'Tous les statuts', icon: Filter, color: '#5eead4' },
    { value: 'pending', label: 'En attente', icon: AlertCircle, color: '#f59e0b' },
    { value: 'in_progress', label: 'En cours', icon: Clock, color: '#3b82f6' },
    { value: 'approved', label: 'Approuvées', icon: CheckCircle, color: '#10b981' },
    { value: 'rejected', label: 'Rejetées', icon: XCircle, color: '#ef4444' }
  ];

  const childOptions = [
    { value: '', label: 'Tous les enfants', icon: Users, color: '#5eead4' },
    ...children.map(child => ({
      value: child.name,
      label: child.name,
      icon: User,
      color: '#5eead4'
    }))
  ];

  const handleLogout = () => {
    navigate('/parent/login');
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
                         request.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.childName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === '' || request.status === filterStatus;
    const matchesChild = filterChild === '' || request.childName === filterChild;
    return matchesSearch && matchesFilter && matchesChild;
  });

  const handleNewRequest = (e) => {
    e.preventDefault();
    setShowNewRequestModal(false);
    setSelectedChild('');
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
    <div className="parent-requests-page">
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

      <main className={`parent-requests-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="parent-requests-page-header">
          <button 
            className="parent-requests-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="parent-requests-page-title">Mes Demandes</h1>
          <div className="parent-requests-header-actions">
            <button className="parent-requests-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="parent-requests-container">
          <div className="parent-requests-top-bar">
            <p className="parent-requests-subtitle">Gérez les demandes de documents pour vos enfants</p>
            <button 
              className="parent-requests-new-btn"
              onClick={() => setShowNewRequestModal(true)}
            >
              <Plus size={20} />
              <span>Nouvelle demande</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="parent-requests-stats-grid">
            <div className="parent-requests-stat-card stat-total">
              <div className="stat-icon">
                <FileText size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total</p>
                <h3 className="stat-value">{stats.total}</h3>
              </div>
            </div>
            <div className="parent-requests-stat-card stat-pending">
              <div className="stat-icon">
                <AlertCircle size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">En attente</p>
                <h3 className="stat-value">{stats.pending}</h3>
              </div>
            </div>
            <div className="parent-requests-stat-card stat-progress">
              <div className="stat-icon">
                <Clock size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">En cours</p>
                <h3 className="stat-value">{stats.inProgress}</h3>
              </div>
            </div>
            <div className="parent-requests-stat-card stat-approved">
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
          <div className="parent-requests-filters">
            <CustomDropdown
              options={childOptions}
              value={filterChild}
              onChange={setFilterChild}
              icon={Users}
            />
            <CustomDropdown
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              icon={Filter}
            />
            <div className="parent-requests-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="parent-requests-search-input"
              />
            </div>
          </div>

          {/* Requests Grid */}
          <div className="parent-requests-grid">
            {filteredRequests.length === 0 ? (
              <div className="parent-requests-empty">
                <FileText size={64} />
                <h3>Aucune demande trouvée</h3>
                <p>
                  {searchTerm || filterStatus || filterChild
                    ? "Essayez de modifier vos critères de recherche"
                    : "Vous n'avez pas encore fait de demande"}
                </p>
                {!searchTerm && !filterStatus && !filterChild && (
                  <button 
                    className="parent-requests-empty-btn"
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
                  <div key={request.id} className="parent-requests-card">
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
                      <div className="request-child-badge">
                        <User size={14} />
                        <span>{request.childName}</span>
                      </div>
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
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="parent-requests-modal-backdrop">
          <div className="parent-requests-modal">
            <button 
              className="parent-requests-modal-close"
              onClick={() => setShowNewRequestModal(false)}
            >
              <X size={22} />
            </button>
            <h3 className="parent-requests-modal-title">
              <Plus size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#5eead4"}} />
              Nouvelle demande de document
            </h3>
            <form onSubmit={handleNewRequest} className="parent-requests-form">
              <div className="form-group">
                <label className="form-label">Enfant concerné *</label>
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Sélectionnez un enfant</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.name}>
                      {child.name} - {child.class}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Type de document *</label>
                <select
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">Sélectionnez un type</option>
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
                  placeholder="Ex: Pour un dossier de bourse..."
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
              <div className="parent-requests-modal-footer">
                <button
                  type="button"
                  className="parent-requests-cancel-btn"
                  onClick={() => setShowNewRequestModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="parent-requests-submit-btn">
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

export default DemandesParents;
