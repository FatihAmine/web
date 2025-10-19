import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  Users,
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
  Edit,
  Trash2,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/personnel/PersonnelHome.css';

const PersonnelDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();
  const userData = {
    firstName: "Karim",
    lastName: "El Amrani",
    role: "Personnel Administratif",
    profilePic: "https://ui-avatars.com/api/?name=Karim+ElAmrani&background=17766e&color=fff&size=200"
  };

  const stats = {
    pendingRequests: 12,
    processedToday: 8,
    totalStudents: 245,
    documentsGenerated: 156
  };

  const recentRequests = [
    { id: 1, studentName: "Ahmed Bennani", document: "Attestation de Scolarité", requestDate: "2025-10-11", status: "pending", priority: "high" },
    { id: 2, studentName: "Sara Idrissi", document: "Relevé de Notes", requestDate: "2025-10-11", status: "in_progress", priority: "medium" },
    { id: 3, studentName: "Omar Tazi", document: "Certificat de Réussite", requestDate: "2025-10-10", status: "pending", priority: "low" },
    { id: 4, studentName: "Leila Fassi", document: "Convention de Stage", requestDate: "2025-10-10", status: "approved", priority: "medium" },
    { id: 5, studentName: "Youssef Alaoui", document: "Bulletin S1", requestDate: "2025-10-09", status: "rejected", priority: "low" }
  ];

  const recentActivity = [
    { id: 1, action: "Demande approuvée", user: "Ahmed Bennani", document: "Attestation", time: "Il y a 5 min" },
    { id: 2, action: "Document généré", user: "Sara Idrissi", document: "Relevé de Notes", time: "Il y a 15 min" },
    { id: 3, action: "Demande rejetée", user: "Omar Tazi", document: "Certificat", time: "Il y a 1h" },
    { id: 4, action: "Nouveau téléversement", user: "Personnel", document: "Bulletins S1 2024", time: "Il y a 2h" }
  ];

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/personnel' },
  { id: 'requests', icon: Clock, label: 'Demandes', path: '/personnel/demandes' },
  { id: 'documents', icon: FileText, label: 'Gestion Documents', path: '/personnel/documents' },
  { id: 'students', icon: Users, label: 'Étudiants', path: '/personnel/students' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/personnel/notifications' },
  { id: 'settings', icon: Settings, label: 'Paramètres', path: '/personnel/settings' }
];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      case 'pending': return <AlertCircle size={16} />;
      case 'in_progress': return <Clock size={16} />;
      default: return <Clock size={16} />;
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
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityText = (priority) => {
    switch(priority) {
      case 'high': return 'Urgent';
      case 'medium': return 'Moyen';
      case 'low': return 'Faible';
      default: return 'Normal';
    }
  };

  return (
    <div className="personnel-dashboard-container">
      {/* Sidebar */}
      <aside className={`personnel-sidebar ${sidebarOpen ? 'personnel-sidebar-open' : 'personnel-sidebar-closed'}`}>
        <div className="personnel-sidebar-content">
          <div className="personnel-profile-section">
            <img src={userData.profilePic} alt="Profile" className="personnel-profile-pic" />
            {sidebarOpen && (
              <div className="personnel-profile-info">
                <h3 className="personnel-profile-name">{userData.firstName} {userData.lastName}</h3>
                <p className="personnel-profile-role">{userData.role}</p>
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
          <button 
            className="personnel-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="personnel-page-title">
            {menuItems.find(item => item.id === activeTab)?.label}
          </h1>
          <div className="personnel-header-actions">
            <button className="personnel-search-btn">
              <Search size={20} />
            </button>
            <button className="personnel-filter-btn">
              <Filter size={20} />
            </button>
          </div>
        </header>

        <div className="personnel-content">
          {/* Stats Cards */}
          <div className="personnel-stats-grid">
            <div className="personnel-stat-card">
              <div className="personnel-stat-icon" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
                <Clock size={24} />
              </div>
              <div className="personnel-stat-info">
                <p className="personnel-stat-label">Demandes en attente</p>
                <h2 className="personnel-stat-value">{stats.pendingRequests}</h2>
              </div>
            </div>

            <div className="personnel-stat-card">
              <div className="personnel-stat-icon" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                <CheckCircle size={24} />
              </div>
              <div className="personnel-stat-info">
                <p className="personnel-stat-label">Traitées aujourd'hui</p>
                <h2 className="personnel-stat-value">{stats.processedToday}</h2>
              </div>
            </div>

            <div className="personnel-stat-card">
              <div className="personnel-stat-icon" style={{background: 'linear-gradient(135deg, #17766e, #14635c)'}}>
                <Users size={24} />
              </div>
              <div className="personnel-stat-info">
                <p className="personnel-stat-label">Total Étudiants</p>
                <h2 className="personnel-stat-value">{stats.totalStudents}</h2>
              </div>
            </div>

            <div className="personnel-stat-card">
              <div className="personnel-stat-icon" style={{background: 'linear-gradient(135deg, #3b82f6, #2563eb)'}}>
                <FileText size={24} />
              </div>
              <div className="personnel-stat-info">
                <p className="personnel-stat-label">Documents générés</p>
                <h2 className="personnel-stat-value">{stats.documentsGenerated}</h2>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="personnel-content-grid">
            {/* Requests Table */}
            <div className="personnel-card personnel-card-large">
              <div className="personnel-card-header">
                <h3 className="personnel-card-title">Demandes récentes</h3>
                <div className="personnel-card-actions">
                  <button className="personnel-filter-btn-small">
                    <Filter size={16} />
                    Filtrer
                  </button>
                </div>
              </div>
              <div className="personnel-table-container">
                <table className="personnel-table">
                  <thead className="personnel-table-head">
                    <tr>
                      <th className="personnel-table-th">Étudiant</th>
                      <th className="personnel-table-th">Document</th>
                      <th className="personnel-table-th">Date</th>
                      <th className="personnel-table-th">Priorité</th>
                      <th className="personnel-table-th">Statut</th>
                      <th className="personnel-table-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="personnel-table-body">
                    {recentRequests.map(request => (
                      <tr key={request.id} className="personnel-table-row">
                        <td className="personnel-table-td">
                          <div className="personnel-student-cell">
                            <div className="personnel-student-avatar">
                              {request.studentName.charAt(0)}
                            </div>
                            <span>{request.studentName}</span>
                          </div>
                        </td>
                        <td className="personnel-table-td">{request.document}</td>
                        <td className="personnel-table-td personnel-date-cell">{request.requestDate}</td>
                        <td className="personnel-table-td">
                          <span className="personnel-priority-badge" style={{
                            background: `${getPriorityColor(request.priority)}20`,
                            color: getPriorityColor(request.priority)
                          }}>
                            {getPriorityText(request.priority)}
                          </span>
                        </td>
                        <td className="personnel-table-td">
                          <div className="personnel-status-badge" style={{
                            background: `${getStatusColor(request.status)}20`,
                            color: getStatusColor(request.status)
                          }}>
                            {getStatusIcon(request.status)}
                            <span>{getStatusText(request.status)}</span>
                          </div>
                        </td>
                        <td className="personnel-table-td">
                          <div className="personnel-action-buttons">
                            <button className="personnel-action-btn personnel-view-btn" title="Voir">
                              <Eye size={16} />
                            </button>
                            <button className="personnel-action-btn personnel-edit-btn" title="Modifier">
                              <Edit size={16} />
                            </button>
                            <button className="personnel-action-btn personnel-delete-btn" title="Supprimer">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="personnel-card">
              <div className="personnel-card-header">
                <h3 className="personnel-card-title">Activité récente</h3>
              </div>
              <div className="personnel-activity-list">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="personnel-activity-item">
                    <div className="personnel-activity-icon">
                      <div className="personnel-activity-dot"></div>
                    </div>
                    <div className="personnel-activity-content">
                      <h4 className="personnel-activity-action">{activity.action}</h4>
                      <p className="personnel-activity-details">
                        {activity.user} • {activity.document}
                      </p>
                      <p className="personnel-activity-time">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="personnel-quick-actions">
            <h3 className="personnel-section-title">Actions rapides</h3>
            <div className="personnel-actions-grid">
              <button className="personnel-quick-action-btn">
                <FileText size={24} />
                <span>Générer un document</span>
              </button>
              <button className="personnel-quick-action-btn">
                <CheckCircle size={24} />
                <span>Approuver en masse</span>
              </button>
              <button className="personnel-quick-action-btn">
                <Users size={24} />
                <span>Ajouter un étudiant</span>
              </button>
              <button className="personnel-quick-action-btn">
                <BarChart3 size={24} />
                <span>Voir les rapports</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonnelDashboard;