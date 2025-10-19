import React, { useState } from 'react';
import { 
  Home,
  Users,
  FileText,
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
import '../../../css/parent/DemandesParents.css';
import { useNavigate } from 'react-router-dom';

const DemandesParents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterChild, setFilterChild] = useState('all');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const navigate = useNavigate();
  const userData = {
    firstName: "Fatima",
    lastName: "Bennani",
    profilePic: "https://ui-avatars.com/api/?name=Fatima+Bennani&background=17766e&color=fff&size=200"
  };

  const children = [
    { id: 1, name: "Ahmed Bennani", class: "1ère année Informatique" },
    { id: 2, name: "Sara Bennani", class: "3ème année Marketing" }
  ];

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/parent' },
  { id: 'children', icon: Users, label: 'Mes Enfants', path: '/parent/children' },
  { id: 'documents', icon: FileText, label: 'Documents', path: '/parent/documents' },
  { id: 'requests', icon: Clock, label: 'Demandes', path: '/parent/demandes' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/parent/notifications' },
  { id: 'settings', icon: Settings, label: 'Paramètres', path: '/parent/settings' }
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
    },
    {
      id: 5,
      childName: "Ahmed Bennani",
      documentType: "Attestation d'Inscription",
      requestDate: "2025-09-25",
      status: "approved",
      reason: "Assurance scolaire",
      urgency: "normal",
      completedDate: "2025-09-27",
      trackingNumber: "REQ-2025-001034",
      processedBy: "M. Alami",
      downloadUrl: "#"
    },
    {
      id: 6,
      childName: "Sara Bennani",
      documentType: "Bulletin 2024-2025",
      requestDate: "2025-09-20",
      status: "approved",
      reason: "Dossier famille nombreuse",
      urgency: "normal",
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
                         request.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.childName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    const matchesChild = filterChild === 'all' || request.childName === filterChild;
    return matchesSearch && matchesFilter && matchesChild;
  });

  const handleNewRequest = (e) => {
    e.preventDefault();
    console.log('New request:', {
      child: selectedChild,
      documentType: selectedDocumentType,
      reason: requestReason,
      urgency: urgency
    });
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
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="parent-requests-page">
      {/* Sidebar */}
      <aside className={`parent-requests-sidebar ${sidebarOpen ? 'parent-requests-sidebar-open' : 'parent-requests-sidebar-closed'}`}>
        <div className="parent-requests-sidebar-content">
          <div className="parent-requests-profile-section">
            <img src={userData.profilePic} alt="Profile" className="parent-requests-profile-pic" />
            {sidebarOpen && (
              <div className="parent-requests-profile-info">
                <h3 className="parent-requests-profile-name">{userData.firstName} {userData.lastName}</h3>
                <p className="parent-requests-profile-role">Parent</p>
              </div>
            )}
          </div>

          <nav className="parent-requests-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                }}
                className={`parent-requests-menu-item ${activeTab === item.id ? 'parent-requests-menu-item-active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <button className="parent-requests-disconnect-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="parent-requests-main-content">
        {/* Header */}
        <header className="parent-requests-page-header">
          <button 
            className="parent-requests-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="parent-requests-page-title">Mes Demandes</h1>
        </header>

        <div className="parent-requests-container">
          <div className="parent-requests-header">
            <div className="parent-requests-title-section">
              <p className="parent-requests-subtitle">Gérez les demandes de documents pour vos enfants</p>
            </div>
            <button 
              className="parent-requests-new-btn"
              onClick={() => setShowNewRequestModal(true)}
            >
              <Plus size={20} />
              <span>Nouvelle demande</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="parent-requests-stats">
            <div className="parent-requests-stat-card">
              <div className="parent-requests-stat-icon" style={{background: '#3b82f6'}}>
                <FileText size={24} />
              </div>
              <div className="parent-requests-stat-info">
                <p className="parent-requests-stat-label">Total</p>
                <p className="parent-requests-stat-value">{stats.total}</p>
              </div>
            </div>

            <div className="parent-requests-stat-card">
              <div className="parent-requests-stat-icon" style={{background: '#f59e0b'}}>
                <AlertCircle size={24} />
              </div>
              <div className="parent-requests-stat-info">
                <p className="parent-requests-stat-label">En attente</p>
                <p className="parent-requests-stat-value">{stats.pending}</p>
              </div>
            </div>

            <div className="parent-requests-stat-card">
              <div className="parent-requests-stat-icon" style={{background: '#3b82f6'}}>
                <Clock size={24} />
              </div>
              <div className="parent-requests-stat-info">
                <p className="parent-requests-stat-label">En cours</p>
                <p className="parent-requests-stat-value">{stats.inProgress}</p>
              </div>
            </div>

            <div className="parent-requests-stat-card">
              <div className="parent-requests-stat-icon" style={{background: '#10b981'}}>
                <CheckCircle size={24} />
              </div>
              <div className="parent-requests-stat-info">
                <p className="parent-requests-stat-label">Approuvées</p>
                <p className="parent-requests-stat-value">{stats.approved}</p>
              </div>
            </div>

            <div className="parent-requests-stat-card">
              <div className="parent-requests-stat-icon" style={{background: '#ef4444'}}>
                <XCircle size={24} />
              </div>
              <div className="parent-requests-stat-info">
                <p className="parent-requests-stat-label">Rejetées</p>
                <p className="parent-requests-stat-value">{stats.rejected}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="parent-requests-filters">
            <div className="parent-requests-search">
              <Search className="parent-requests-search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher par document, enfant ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="parent-requests-search-input"
              />
            </div>

            <div className="parent-requests-filter-group">
              <Users size={20} className="parent-requests-filter-icon" />
              <select 
                value={filterChild}
                onChange={(e) => setFilterChild(e.target.value)}
                className="parent-requests-filter-select"
              >
                <option value="all">Tous les enfants</option>
                {children.map(child => (
                  <option key={child.id} value={child.name}>{child.name}</option>
                ))}
              </select>
            </div>

            <div className="parent-requests-filter-group">
              <Filter size={20} className="parent-requests-filter-icon" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="parent-requests-filter-select"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="approved">Approuvées</option>
                <option value="rejected">Rejetées</option>
              </select>
            </div>
          </div>

          {/* Requests List */}
          <div className="parent-requests-list">
            {filteredRequests.map(request => (
              <div key={request.id} className="parent-requests-card">
                <div className="parent-requests-card-header">
                  <div className="parent-requests-card-title-section">
                    <h3 className="parent-requests-card-title">{request.documentType}</h3>
                    <div className="parent-requests-child-badge">
                      <User size={14} />
                      <span>{request.childName}</span>
                    </div>
                    <span className="parent-requests-tracking">#{request.trackingNumber}</span>
                  </div>
                  <div className="parent-requests-card-badges">
                    {request.urgency === 'urgent' && (
                      <span className="parent-requests-urgency-badge">
                        <AlertCircle size={14} />
                        Urgent
                      </span>
                    )}
                    <div 
                      className="parent-requests-status-badge"
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

                <div className="parent-requests-card-body">
                  <div className="parent-requests-info-grid">
                    <div className="parent-requests-info-item">
                      <Calendar size={16} className="parent-requests-info-icon" />
                      <div>
                        <p className="parent-requests-info-label">Date de demande</p>
                        <p className="parent-requests-info-value">{request.requestDate}</p>
                      </div>
                    </div>

                    <div className="parent-requests-info-item">
                      <FileText size={16} className="parent-requests-info-icon" />
                      <div>
                        <p className="parent-requests-info-label">Motif</p>
                        <p className="parent-requests-info-value">{request.reason}</p>
                      </div>
                    </div>

                    {request.status === 'pending' && request.estimatedDate && (
                      <div className="parent-requests-info-item">
                        <Clock size={16} className="parent-requests-info-icon" />
                        <div>
                          <p className="parent-requests-info-label">Date estimée</p>
                          <p className="parent-requests-info-value">{request.estimatedDate}</p>
                        </div>
                      </div>
                    )}

                    {request.status === 'in_progress' && (
                      <div className="parent-requests-info-item">
                        <User size={16} className="parent-requests-info-icon" />
                        <div>
                          <p className="parent-requests-info-label">Traité par</p>
                          <p className="parent-requests-info-value">{request.processedBy}</p>
                        </div>
                      </div>
                    )}

                    {request.status === 'approved' && (
                      <div className="parent-requests-info-item">
                        <CheckCircle size={16} className="parent-requests-info-icon" />
                        <div>
                          <p className="parent-requests-info-label">Date de validation</p>
                          <p className="parent-requests-info-value">{request.completedDate}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {request.status === 'rejected' && request.rejectionReason && (
                    <div className="parent-requests-rejection">
                      <AlertCircle size={16} />
                      <div>
                        <p className="parent-requests-rejection-title">Raison du rejet</p>
                        <p className="parent-requests-rejection-text">{request.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="parent-requests-card-footer">
                  <button className="parent-requests-action-btn parent-requests-view-btn">
                    <Eye size={18} />
                    Détails
                  </button>
                  {request.status === 'approved' && request.downloadUrl && (
                    <button className="parent-requests-action-btn parent-requests-download-btn">
                      <Download size={18} />
                      Télécharger
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredRequests.length === 0 && (
              <div className="parent-requests-empty">
                <FileText size={64} className="parent-requests-empty-icon" />
                <h3 className="parent-requests-empty-title">Aucune demande trouvée</h3>
                <p className="parent-requests-empty-text">
                  {searchTerm || filterStatus !== 'all' || filterChild !== 'all'
                    ? "Essayez de modifier vos critères de recherche"
                    : "Vous n'avez pas encore fait de demande"}
                </p>
                {!searchTerm && filterStatus === 'all' && filterChild === 'all' && (
                  <button 
                    className="parent-requests-empty-btn"
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

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="parent-requests-modal-overlay">
          <div className="parent-requests-modal">
            <div className="parent-requests-modal-header">
              <h2 className="parent-requests-modal-title">Nouvelle demande de document</h2>
              <button 
                className="parent-requests-modal-close"
                onClick={() => setShowNewRequestModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleNewRequest} className="parent-requests-modal-form">
              <div className="parent-requests-form-group">
                <label className="parent-requests-form-label">Enfant concerné *</label>
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="parent-requests-form-select"
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

              <div className="parent-requests-form-group">
                <label className="parent-requests-form-label">Type de document *</label>
                <select
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                  className="parent-requests-form-select"
                  required
                >
                  <option value="">Sélectionnez un type de document</option>
                  {documentTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="parent-requests-form-group">
                <label className="parent-requests-form-label">Motif de la demande *</label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="parent-requests-form-textarea"
                  placeholder="Ex: Pour un dossier de bourse, pour l'employeur, etc."
                  rows="4"
                  required
                />
              </div>

              <div className="parent-requests-form-group">
                <label className="parent-requests-form-label">Urgence</label>
                <div className="parent-requests-radio-group">
                  <label className="parent-requests-radio-label">
                    <input
                      type="radio"
                      name="urgency"
                      value="normal"
                      checked={urgency === 'normal'}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="parent-requests-radio"
                    />
                    <span>Normal (5-7 jours)</span>
                  </label>
                  <label className="parent-requests-radio-label">
                    <input
                      type="radio"
                      name="urgency"
                      value="urgent"
                      checked={urgency === 'urgent'}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="parent-requests-radio"
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

export default DemandesParents;