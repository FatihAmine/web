import React, { useState } from 'react';
import { 
  Home,
  FileText,
  Users,
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  Eye,
  Edit,

  Check,
  Ban,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/personnel/DemandesPersonnel.css';
const DemandesPersonnel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const navigate = useNavigate();
  const userData = {
    firstName: "Karim",
    lastName: "El Amrani",
    role: "Personnel Administratif",
    profilePic: "https://ui-avatars.com/api/?name=Karim+ElAmrani&background=17766e&color=fff&size=200"
  };

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/personnel' },
  { id: 'requests', icon: Clock, label: 'Demandes', path: '/personnel/demandes' },
  { id: 'documents', icon: FileText, label: 'Gestion Documents', path: '/personnel/documents' },
  { id: 'students', icon: Users, label: 'Étudiants', path: '/personnel/students' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/personnel/notifications' },
  { id: 'settings', icon: Settings, label: 'Paramètres', path: '/personnel/settings' }
];

  const requests = [
    {
      id: 1,
      studentName: "Ahmed Bennani",
      studentEmail: "ahmed.b@ynov.ma",
      documentType: "Attestation de Scolarité",
      requestDate: "2025-10-11",
      status: "pending",
      reason: "Pour la banque",
      priority: "urgent",
      trackingNumber: "REQ-2025-001234",
      requestedBy: "Parent"
    },
    {
      id: 2,
      studentName: "Sara Idrissi",
      studentEmail: "sara.i@ynov.ma",
      documentType: "Relevé de Notes",
      requestDate: "2025-10-11",
      status: "in_progress",
      reason: "Candidature master",
      priority: "normal",
      trackingNumber: "REQ-2025-001198",
      assignedTo: "Moi",
      requestedBy: "Étudiant"
    },
    {
      id: 3,
      studentName: "Omar Tazi",
      studentEmail: "omar.t@ynov.ma",
      documentType: "Certificat de Réussite",
      requestDate: "2025-10-10",
      status: "pending",
      reason: "Dossier employeur",
      priority: "normal",
      trackingNumber: "REQ-2025-001145",
      requestedBy: "Étudiant"
    },
    {
      id: 4,
      studentName: "Leila Fassi",
      studentEmail: "leila.f@ynov.ma",
      documentType: "Convention de Stage",
      requestDate: "2025-10-10",
      status: "approved",
      reason: "Stage entreprise",
      priority: "normal",
      trackingNumber: "REQ-2025-001089",
      processedBy: "M. Tazi",
      completedDate: "2025-10-11",
      requestedBy: "Parent"
    },
    {
      id: 5,
      studentName: "Youssef Alaoui",
      studentEmail: "youssef.a@ynov.ma",
      documentType: "Bulletin S1",
      requestDate: "2025-10-09",
      status: "rejected",
      reason: "Dossier bourse",
      priority: "urgent",
      trackingNumber: "REQ-2025-001023",
      rejectionReason: "Moyenne insuffisante pour bourse",
      processedBy: "Mme. Benali",
      requestedBy: "Étudiant"
    },
    {
      id: 6,
      studentName: "Amina Chahdi",
      studentEmail: "amina.c@ynov.ma",
      documentType: "Attestation d'Inscription",
      requestDate: "2025-10-08",
      status: "pending",
      reason: "Assurance",
      priority: "urgent",
      trackingNumber: "REQ-2025-000998",
      requestedBy: "Parent"
    },
    {
      id: 7,
      studentName: "Hassan Berrada",
      studentEmail: "hassan.b@ynov.ma",
      documentType: "Relevé de Notes",
      requestDate: "2025-10-07",
      status: "in_progress",
      reason: "Transfert université",
      priority: "normal",
      trackingNumber: "REQ-2025-000967",
      assignedTo: "Mme. Idrissi",
      requestedBy: "Étudiant"
    },
    {
      id: 8,
      studentName: "Zineb Mansouri",
      studentEmail: "zineb.m@ynov.ma",
      documentType: "Certificat de Stage",
      requestDate: "2025-10-06",
      status: "approved",
      reason: "Validation stage",
      priority: "normal",
      trackingNumber: "REQ-2025-000945",
      processedBy: "Moi",
      completedDate: "2025-10-09",
      requestedBy: "Étudiant"
    }
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
      case 'in_progress': return 'En cours';
      default: return 'En attente';
    }
  };

  const getPriorityColor = (priority) => {
    return priority === 'urgent' ? '#ef4444' : '#94a3b8';
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
    return matchesSearch && matchesFilter && matchesPriority;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    urgent: requests.filter(r => r.priority === 'urgent' && r.status !== 'approved' && r.status !== 'rejected').length
  };

  return (
    <div className="personnel-requests-page">
      {/* Sidebar */}
      <aside className={`personnel-requests-sidebar ${sidebarOpen ? 'personnel-requests-sidebar-open' : 'personnel-requests-sidebar-closed'}`}>
        <div className="personnel-requests-sidebar-content">
          <div className="personnel-requests-profile-section">
            <img src={userData.profilePic} alt="Profile" className="personnel-requests-profile-pic" />
            {sidebarOpen && (
              <div className="personnel-requests-profile-info">
                <h3 className="personnel-requests-profile-name">{userData.firstName} {userData.lastName}</h3>
                <p className="personnel-requests-profile-role">{userData.role}</p>
              </div>
            )}
          </div>

          <nav className="personnel-requests-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                }}
                className={`personnel-requests-menu-item ${activeTab === item.id ? 'personnel-requests-menu-item-active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <button className="personnel-requests-disconnect-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="personnel-requests-main-content">
        {/* Header */}
        <header className="personnel-requests-page-header">
          <button 
            className="personnel-requests-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="personnel-requests-page-title">Gestion des Demandes</h1>
        </header>

        <div className="personnel-requests-container">
          <div className="personnel-requests-header">
            <div className="personnel-requests-title-section">
              <p className="personnel-requests-subtitle">Traitez et gérez toutes les demandes de documents</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="personnel-requests-stats">
            <div className="personnel-requests-stat-card">
              <div className="personnel-requests-stat-icon" style={{background: '#3b82f6'}}>
                <FileText size={24} />
              </div>
              <div className="personnel-requests-stat-info">
                <p className="personnel-requests-stat-label">Total</p>
                <p className="personnel-requests-stat-value">{stats.total}</p>
              </div>
            </div>

            <div className="personnel-requests-stat-card">
              <div className="personnel-requests-stat-icon" style={{background: '#f59e0b'}}>
                <AlertCircle size={24} />
              </div>
              <div className="personnel-requests-stat-info">
                <p className="personnel-requests-stat-label">En attente</p>
                <p className="personnel-requests-stat-value">{stats.pending}</p>
              </div>
            </div>

            <div className="personnel-requests-stat-card">
              <div className="personnel-requests-stat-icon" style={{background: '#3b82f6'}}>
                <Clock size={24} />
              </div>
              <div className="personnel-requests-stat-info">
                <p className="personnel-requests-stat-label">En cours</p>
                <p className="personnel-requests-stat-value">{stats.inProgress}</p>
              </div>
            </div>

            <div className="personnel-requests-stat-card">
              <div className="personnel-requests-stat-icon" style={{background: '#10b981'}}>
                <CheckCircle size={24} />
              </div>
              <div className="personnel-requests-stat-info">
                <p className="personnel-requests-stat-label">Approuvées</p>
                <p className="personnel-requests-stat-value">{stats.approved}</p>
              </div>
            </div>

            <div className="personnel-requests-stat-card">
              <div className="personnel-requests-stat-icon" style={{background: '#ef4444'}}>
                <XCircle size={24} />
              </div>
              <div className="personnel-requests-stat-info">
                <p className="personnel-requests-stat-label">Rejetées</p>
                <p className="personnel-requests-stat-value">{stats.rejected}</p>
              </div>
            </div>

            <div className="personnel-requests-stat-card">
              <div className="personnel-requests-stat-icon" style={{background: '#ef4444'}}>
                <AlertCircle size={24} />
              </div>
              <div className="personnel-requests-stat-info">
                <p className="personnel-requests-stat-label">Urgentes</p>
                <p className="personnel-requests-stat-value">{stats.urgent}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="personnel-requests-filters">
            <div className="personnel-requests-search">
              <Search className="personnel-requests-search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher par étudiant, document ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="personnel-requests-search-input"
              />
            </div>

            <div className="personnel-requests-filter-group">
              <Filter size={20} className="personnel-requests-filter-icon" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="personnel-requests-filter-select"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="approved">Approuvées</option>
                <option value="rejected">Rejetées</option>
              </select>
            </div>

            <div className="personnel-requests-filter-group">
              <AlertCircle size={20} className="personnel-requests-filter-icon" />
              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="personnel-requests-filter-select"
              >
                <option value="all">Toutes priorités</option>
                <option value="urgent">Urgentes</option>
                <option value="normal">Normales</option>
              </select>
            </div>
          </div>

          {/* Requests Table */}
          <div className="personnel-requests-table-card">
            <div className="personnel-requests-table-container">
              <table className="personnel-requests-table">
                <thead className="personnel-requests-table-head">
                  <tr>
                    <th className="personnel-requests-table-th">Étudiant</th>
                    <th className="personnel-requests-table-th">Document</th>
                    <th className="personnel-requests-table-th">Date</th>
                    <th className="personnel-requests-table-th">Demandé par</th>
                    <th className="personnel-requests-table-th">Priorité</th>
                    <th className="personnel-requests-table-th">Statut</th>
                    <th className="personnel-requests-table-th">Actions</th>
                  </tr>
                </thead>
                <tbody className="personnel-requests-table-body">
                  {filteredRequests.map(request => (
                    <tr key={request.id} className="personnel-requests-table-row">
                      <td className="personnel-requests-table-td">
                        <div className="personnel-requests-student-cell">
                          <div className="personnel-requests-student-avatar">
                            {request.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="personnel-requests-student-name">{request.studentName}</p>
                            <p className="personnel-requests-student-email">{request.studentEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="personnel-requests-table-td">
                        <p className="personnel-requests-doc-type">{request.documentType}</p>
                        <p className="personnel-requests-tracking">#{request.trackingNumber}</p>
                      </td>
                      <td className="personnel-requests-table-td personnel-requests-date-cell">
                        {request.requestDate}
                      </td>
                      <td className="personnel-requests-table-td">
                        <span className="personnel-requests-requester-badge">
                          {request.requestedBy}
                        </span>
                      </td>
                      <td className="personnel-requests-table-td">
                        <span 
                          className="personnel-requests-priority-badge"
                          style={{
                            background: `${getPriorityColor(request.priority)}20`,
                            color: getPriorityColor(request.priority)
                          }}
                        >
                          {request.priority === 'urgent' ? 'Urgent' : 'Normal'}
                        </span>
                      </td>
                      <td className="personnel-requests-table-td">
                        <div 
                          className="personnel-requests-status-badge"
                          style={{
                            background: `${getStatusColor(request.status)}20`,
                            color: getStatusColor(request.status)
                          }}
                        >
                          {getStatusIcon(request.status)}
                          <span>{getStatusText(request.status)}</span>
                        </div>
                      </td>
                      <td className="personnel-requests-table-td">
                        <div className="personnel-requests-action-buttons">
                          <button className="personnel-requests-action-btn personnel-requests-view-btn" title="Voir">
                            <Eye size={16} />
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button className="personnel-requests-action-btn personnel-requests-approve-btn" title="Approuver">
                                <Check size={16} />
                              </button>
                              <button className="personnel-requests-action-btn personnel-requests-reject-btn" title="Rejeter">
                                <Ban size={16} />
                              </button>
                            </>
                          )}
                          {request.status === 'in_progress' && (
                            <button className="personnel-requests-action-btn personnel-requests-edit-btn" title="Modifier">
                              <Edit size={16} />
                            </button>
                          )}
                          <button className="personnel-requests-action-btn personnel-requests-message-btn" title="Message">
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRequests.length === 0 && (
              <div className="personnel-requests-empty">
                <FileText size={64} className="personnel-requests-empty-icon" />
                <h3 className="personnel-requests-empty-title">Aucune demande trouvée</h3>
                <p className="personnel-requests-empty-text">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemandesPersonnel;