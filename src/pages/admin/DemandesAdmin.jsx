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
  Trash2,
  BarChart3,
  Shield,
  Database,
  Activity,
  Download,
  TrendingUp,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import '../../css/admin/DemandesAdmin.css';
const AdminRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterRole, setFilterRole] = useState('all');

  const userData = {
    firstName: "Mohammed",
    lastName: "Alaoui",
    role: "Super Administrateur",
    profilePic: "https://ui-avatars.com/api/?name=Mohammed+Alaoui&background=17766e&color=fff&size=200"
  };

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Tableau de bord' },
    { id: 'users', icon: Users, label: 'Gestion Utilisateurs' },
    { id: 'documents', icon: FileText, label: 'Gestion Documents' },
    { id: 'requests', icon: Clock, label: 'Demandes' },
    { id: 'statistics', icon: BarChart3, label: 'Statistiques' },
    { id: 'logs', icon: Activity, label: 'Journalisation' },
    { id: 'security', icon: Shield, label: 'Sécurité' },
    { id: 'database', icon: Database, label: 'Base de données' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'settings', icon: Settings, label: 'Paramètres' }
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
      requestedBy: "Parent",
      requestedByName: "Fatima Bennani",
      assignedTo: null
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
      requestedBy: "Étudiant",
      requestedByName: "Sara Idrissi",
      assignedTo: "Karim El Amrani"
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
      requestedBy: "Étudiant",
      requestedByName: "Omar Tazi",
      assignedTo: null
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
      requestedBy: "Parent",
      requestedByName: "Hassan Fassi",
      processedBy: "M. Tazi",
      completedDate: "2025-10-11"
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
      requestedBy: "Étudiant",
      requestedByName: "Youssef Alaoui",
      rejectionReason: "Moyenne insuffisante",
      processedBy: "Mme. Benali"
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
      requestedBy: "Parent",
      requestedByName: "Laila Chahdi",
      assignedTo: null
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
      requestedBy: "Étudiant",
      requestedByName: "Hassan Berrada",
      assignedTo: "Mme. Idrissi"
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
      requestedBy: "Étudiant",
      requestedByName: "Zineb Mansouri",
      processedBy: "Karim El Amrani",
      completedDate: "2025-10-09"
    },
    {
      id: 9,
      studentName: "Karim Bensouda",
      studentEmail: "karim.b@ynov.ma",
      documentType: "Attestation de Scolarité",
      requestDate: "2025-10-05",
      status: "approved",
      reason: "Visa étudiant",
      priority: "urgent",
      trackingNumber: "REQ-2025-000921",
      requestedBy: "Parent",
      requestedByName: "Nadia Bensouda",
      processedBy: "M. Tazi",
      completedDate: "2025-10-07"
    },
    {
      id: 10,
      studentName: "Salma Benchekroun",
      studentEmail: "salma.b@ynov.ma",
      documentType: "Bulletin Annuel",
      requestDate: "2025-10-04",
      status: "in_progress",
      reason: "Dossier famille",
      priority: "normal",
      trackingNumber: "REQ-2025-000898",
      requestedBy: "Parent",
      requestedByName: "Rachid Benchekroun",
      assignedTo: "Karim El Amrani"
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle size={18} />;
      case 'rejected': return <XCircle size={18} />;
      case 'pending': return <AlertCircle size={18} />;
      case 'in_progress': return <Clock size={18} />;
      default: return <Clock size={18} />;
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
                         request.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestedByName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
    const matchesRole = filterRole === 'all' || request.requestedBy === filterRole;
    return matchesSearch && matchesFilter && matchesPriority && matchesRole;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    urgent: requests.filter(r => r.priority === 'urgent' && r.status !== 'approved' && r.status !== 'rejected').length,
    unassigned: requests.filter(r => r.status === 'pending' && !r.assignedTo).length,
    todayRequests: requests.filter(r => r.requestDate === '2025-10-11').length
  };

  const performanceStats = {
    avgProcessingTime: "2.5 jours",
    successRate: "87%",
    activePersonnel: 5,
    documentsThisWeek: 24
  };

  return (
    <div className="admin-requests-page">
      {/* Sidebar */}
      <aside className={`admin-requests-sidebar ${sidebarOpen ? 'admin-requests-sidebar-open' : 'admin-requests-sidebar-closed'}`}>
        <div className="admin-requests-sidebar-content">
          <div className="admin-requests-profile-section">
            <img src={userData.profilePic} alt="Profile" className="admin-requests-profile-pic" />
            {sidebarOpen && (
              <div className="admin-requests-profile-info">
                <h3 className="admin-requests-profile-name">{userData.firstName} {userData.lastName}</h3>
                <p className="admin-requests-profile-role">{userData.role}</p>
              </div>
            )}
          </div>

          <nav className="admin-requests-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`admin-requests-menu-item ${activeTab === item.id ? 'admin-requests-menu-item-active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <button className="admin-requests-disconnect-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-requests-main-content">
        {/* Header */}
        <header className="admin-requests-page-header">
          <button 
            className="admin-requests-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="admin-requests-page-title">Gestion Globale des Demandes</h1>
          <div className="admin-requests-header-actions">
            <button className="admin-requests-export-btn">
              <Download size={20} />
              <span>Exporter</span>
            </button>
          </div>
        </header>

        <div className="admin-requests-container">
          <div className="admin-requests-header">
            <div className="admin-requests-title-section">
              <p className="admin-requests-subtitle">Vue d'ensemble et supervision de toutes les demandes</p>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="admin-requests-main-stats">
            <div className="admin-requests-stat-card">
              <div className="admin-requests-stat-icon" style={{background: 'linear-gradient(135deg, #17766e, #14635c)'}}>
                <FileText size={28} />
              </div>
              <div className="admin-requests-stat-info">
                <p className="admin-requests-stat-label">Total Demandes</p>
                <h2 className="admin-requests-stat-value">{stats.total}</h2>
                <p className="admin-requests-stat-trend">
                  <TrendingUp size={14} />
                  <span>+12% ce mois</span>
                </p>
              </div>
            </div>

            <div className="admin-requests-stat-card">
              <div className="admin-requests-stat-icon" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
                <AlertCircle size={28} />
              </div>
              <div className="admin-requests-stat-info">
                <p className="admin-requests-stat-label">En Attente</p>
                <h2 className="admin-requests-stat-value">{stats.pending}</h2>
                <p className="admin-requests-stat-trend">
                  <span>{stats.unassigned} non assignées</span>
                </p>
              </div>
            </div>

            <div className="admin-requests-stat-card">
              <div className="admin-requests-stat-icon" style={{background: 'linear-gradient(135deg, #3b82f6, #2563eb)'}}>
                <Clock size={28} />
              </div>
              <div className="admin-requests-stat-info">
                <p className="admin-requests-stat-label">En Cours</p>
                <h2 className="admin-requests-stat-value">{stats.inProgress}</h2>
                <p className="admin-requests-stat-trend">
                  <span>{performanceStats.avgProcessingTime} en moyenne</span>
                </p>
              </div>
            </div>

            <div className="admin-requests-stat-card">
              <div className="admin-requests-stat-icon" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                <CheckCircle size={28} />
              </div>
              <div className="admin-requests-stat-info">
                <p className="admin-requests-stat-label">Approuvées</p>
                <h2 className="admin-requests-stat-value">{stats.approved}</h2>
                <p className="admin-requests-stat-trend">
                  <span>{performanceStats.successRate} taux de succès</span>
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="admin-requests-secondary-stats">
            <div className="admin-requests-secondary-stat">
              <div className="admin-requests-secondary-stat-icon">
                <XCircle size={20} />
              </div>
              <div className="admin-requests-secondary-stat-info">
                <p className="admin-requests-secondary-stat-label">Rejetées</p>
                <p className="admin-requests-secondary-stat-value">{stats.rejected}</p>
              </div>
            </div>
            <div className="admin-requests-secondary-stat">
              <div className="admin-requests-secondary-stat-icon">
                <AlertCircle size={20} />
              </div>
              <div className="admin-requests-secondary-stat-info">
                <p className="admin-requests-secondary-stat-label">Urgentes</p>
                <p className="admin-requests-secondary-stat-value">{stats.urgent}</p>
              </div>
            </div>
            <div className="admin-requests-secondary-stat">
              <div className="admin-requests-secondary-stat-icon">
                <UserCheck size={20} />
              </div>
              <div className="admin-requests-secondary-stat-info">
                <p className="admin-requests-secondary-stat-label">Personnel Actif</p>
                <p className="admin-requests-secondary-stat-value">{performanceStats.activePersonnel}</p>
              </div>
            </div>
            <div className="admin-requests-secondary-stat">
              <div className="admin-requests-secondary-stat-icon">
                <FileText size={20} />
              </div>
              <div className="admin-requests-secondary-stat-info">
                <p className="admin-requests-secondary-stat-label">Cette Semaine</p>
                <p className="admin-requests-secondary-stat-value">{performanceStats.documentsThisWeek}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="admin-requests-filters">
            <div className="admin-requests-search">
              <Search className="admin-requests-search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher par étudiant, document, demandeur ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-requests-search-input"
              />
            </div>

            <div className="admin-requests-filter-group">
              <Users size={20} className="admin-requests-filter-icon" />
              <select 
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="admin-requests-filter-select"
              >
                <option value="all">Tous les rôles</option>
                <option value="Étudiant">Étudiants</option>
                <option value="Parent">Parents</option>
              </select>
            </div>

            <div className="admin-requests-filter-group">
              <Filter size={20} className="admin-requests-filter-icon" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="admin-requests-filter-select"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="approved">Approuvées</option>
                <option value="rejected">Rejetées</option>
              </select>
            </div>

            <div className="admin-requests-filter-group">
              <AlertCircle size={20} className="admin-requests-filter-icon" />
              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="admin-requests-filter-select"
              >
                <option value="all">Toutes priorités</option>
                <option value="urgent">Urgentes</option>
                <option value="normal">Normales</option>
              </select>
            </div>
          </div>

          {/* Requests Table */}
          <div className="admin-requests-table-card">
            <div className="admin-requests-table-container">
              <table className="admin-requests-table">
                <thead className="admin-requests-table-head">
                  <tr>
                    <th className="admin-requests-table-th">ID</th>
                    <th className="admin-requests-table-th">Étudiant</th>
                    <th className="admin-requests-table-th">Document</th>
                    <th className="admin-requests-table-th">Demandé par</th>
                    <th className="admin-requests-table-th">Date</th>
                    <th className="admin-requests-table-th">Priorité</th>
                    <th className="admin-requests-table-th">Assigné à</th>
                    <th className="admin-requests-table-th">Statut</th>
                    <th className="admin-requests-table-th">Actions</th>
                  </tr>
                </thead>
                <tbody className="admin-requests-table-body">
                  {filteredRequests.map(request => (
                    <tr key={request.id} className="admin-requests-table-row">
                      <td className="admin-requests-table-td">
                        <span className="admin-requests-id">#{request.id}</span>
                      </td>
                      <td className="admin-requests-table-td">
                        <div className="admin-requests-student-cell">
                          <div className="admin-requests-student-avatar">
                            {request.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="admin-requests-student-name">{request.studentName}</p>
                            <p className="admin-requests-student-email">{request.studentEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="admin-requests-table-td">
                        <p className="admin-requests-doc-type">{request.documentType}</p>
                        <p className="admin-requests-tracking">#{request.trackingNumber}</p>
                      </td>
                      <td className="admin-requests-table-td">
                        <div className="admin-requests-requester-info">
                          <span className="admin-requests-requester-badge">
                            {request.requestedBy}
                          </span>
                          <p className="admin-requests-requester-name">{request.requestedByName}</p>
                        </div>
                      </td>
                      <td className="admin-requests-table-td admin-requests-date-cell">
                        {request.requestDate}
                      </td>
                      <td className="admin-requests-table-td">
                        <span 
                          className="admin-requests-priority-badge"
                          style={{
                            background: `${getPriorityColor(request.priority)}20`,
                            color: getPriorityColor(request.priority)
                          }}
                        >
                          {request.priority === 'urgent' ? 'Urgent' : 'Normal'}
                        </span>
                      </td>
                      <td className="admin-requests-table-td">
                        {request.assignedTo ? (
                          <span className="admin-requests-assigned-badge">
                            {request.assignedTo}
                          </span>
                        ) : (
                          <span className="admin-requests-unassigned-badge">
                            Non assigné
                          </span>
                        )}
                      </td>
                      <td className="admin-requests-table-td">
                        <div 
                          className="admin-requests-status-badge"
                          style={{
                            background: `${getStatusColor(request.status)}20`,
                            color: getStatusColor(request.status)
                          }}
                        >
                          {getStatusIcon(request.status)}
                          <span>{getStatusText(request.status)}</span>
                        </div>
                      </td>
                      <td className="admin-requests-table-td">
                        <div className="admin-requests-action-buttons">
                          <button className="admin-requests-action-btn admin-requests-view-btn" title="Voir">
                            <Eye size={16} />
                          </button>
                          <button className="admin-requests-action-btn admin-requests-edit-btn" title="Modifier">
                            <Edit size={16} />
                          </button>
                          <button className="admin-requests-action-btn admin-requests-message-btn" title="Message">
                            <MessageSquare size={16} />
                          </button>
                          <button className="admin-requests-action-btn admin-requests-delete-btn" title="Supprimer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRequests.length === 0 && (
              <div className="admin-requests-empty">
                <FileText size={64} className="admin-requests-empty-icon" />
                <h3 className="admin-requests-empty-title">Aucune demande trouvée</h3>
                <p className="admin-requests-empty-text">
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

export default AdminRequests;