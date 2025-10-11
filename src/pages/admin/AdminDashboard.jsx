import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  Users,
  Clock, 
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
  BarChart3,
  Shield,
  Database,
  Activity,
  UserPlus,
  FilePlus,
  TrendingUp,
  Download,
  Archive
} from 'lucide-react';
import '../../css/admin/AdminDashboard.css';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const userData = {
    firstName: "Mohammed",
    lastName: "Alaoui",
    role: "Super Administrateur",
    profilePic: "https://ui-avatars.com/api/?name=Mohammed+Alaoui&background=17766e&color=fff&size=200"
  };

  const stats = {
    totalUsers: 1248,
    totalDocuments: 5678,
    pendingRequests: 45,
    systemAlerts: 3,
    activePersonnel: 24,
    totalStudents: 890,
    totalParents: 334,
    documentsThisMonth: 456
  };

  const recentUsers = [
    { id: 1, name: "Ahmed Bennani", role: "Étudiant", email: "ahmed.b@ynov.ma", status: "active", joinDate: "2025-10-10" },
    { id: 2, name: "Fatima Idrissi", role: "Parent", email: "fatima.i@gmail.com", status: "active", joinDate: "2025-10-09" },
    { id: 3, name: "Karim Tazi", role: "Personnel", email: "karim.t@ynov.ma", status: "active", joinDate: "2025-10-08" },
    { id: 4, name: "Sara Fassi", role: "Étudiant", email: "sara.f@ynov.ma", status: "pending", joinDate: "2025-10-07" }
  ];

  const systemLogs = [
    { id: 1, action: "Création utilisateur", user: "Admin", details: "Nouvel étudiant: Ahmed Bennani", time: "Il y a 5 min", type: "success" },
    { id: 2, action: "Modification document", user: "Personnel_01", details: "Bulletin modifié pour Sara Idrissi", time: "Il y a 15 min", type: "info" },
    { id: 3, action: "Suppression demande", user: "Admin", details: "Demande #1234 supprimée", time: "Il y a 30 min", type: "warning" },
    { id: 4, action: "Erreur système", user: "System", details: "Échec de génération PDF", time: "Il y a 1h", type: "error" },
    { id: 5, action: "Export données", user: "Admin", details: "Export base de données complète", time: "Il y a 2h", type: "success" }
  ];

  const systemAlerts = [
    { id: 1, title: "Espace disque faible", message: "L'espace de stockage est à 85%", severity: "warning", time: "Il y a 1h" },
    { id: 2, title: "Sauvegarde échouée", message: "La sauvegarde automatique a échoué", severity: "error", time: "Il y a 3h" },
    { id: 3, title: "Mise à jour disponible", message: "Nouvelle version système disponible", severity: "info", time: "Il y a 5h" }
  ];

  const documentStats = [
    { type: "Attestations", count: 1234, percentage: 32, trend: "up" },
    { type: "Bulletins", count: 987, percentage: 26, trend: "up" },
    { type: "Certificats", count: 876, percentage: 23, trend: "down" },
    { type: "Conventions", count: 721, percentage: 19, trend: "up" }
  ];

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

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'inactive': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLogTypeColor = (type) => {
    switch(type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getAlertColor = (severity) => {
    switch(severity) {
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : 'admin-sidebar-closed'}`}>
        <div className="admin-sidebar-content">
          <div className="admin-profile-section">
            <img src={userData.profilePic} alt="Profile" className="admin-profile-pic" />
            {sidebarOpen && (
              <div className="admin-profile-info">
                <h3 className="admin-profile-name">{userData.firstName} {userData.lastName}</h3>
                <p className="admin-profile-role">{userData.role}</p>
              </div>
            )}
          </div>

          <nav className="admin-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`admin-menu-item ${activeTab === item.id ? 'admin-menu-item-active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <button className="admin-disconnect-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <main className="admin-main-content">
        <header className="admin-header">
          <button 
            className="admin-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="admin-page-title">
            {menuItems.find(item => item.id === activeTab)?.label}
          </h1>
          <div className="admin-header-actions">
            <button className="admin-search-btn">
              <Search size={20} />
            </button>
            <button className="admin-notification-btn">
              <Bell size={20} />
              <span className="admin-notification-badge">{stats.systemAlerts}</span>
            </button>
          </div>
        </header>

        <div className="admin-content">
          {/* Main Stats Grid */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{background: 'linear-gradient(135deg, #17766e, #14635c)'}}>
                <Users size={28} />
              </div>
              <div className="admin-stat-info">
                <p className="admin-stat-label">Total Utilisateurs</p>
                <h2 className="admin-stat-value">{stats.totalUsers}</h2>
                <p className="admin-stat-trend admin-stat-trend-up">
                  <TrendingUp size={14} />
                  <span>+12% ce mois</span>
                </p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{background: 'linear-gradient(135deg, #3b82f6, #2563eb)'}}>
                <FileText size={28} />
              </div>
              <div className="admin-stat-info">
                <p className="admin-stat-label">Total Documents</p>
                <h2 className="admin-stat-value">{stats.totalDocuments}</h2>
                <p className="admin-stat-trend admin-stat-trend-up">
                  <TrendingUp size={14} />
                  <span>+8% ce mois</span>
                </p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
                <Clock size={28} />
              </div>
              <div className="admin-stat-info">
                <p className="admin-stat-label">Demandes en attente</p>
                <h2 className="admin-stat-value">{stats.pendingRequests}</h2>
                <p className="admin-stat-trend admin-stat-trend-neutral">
                  <span>-5 depuis hier</span>
                </p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{background: 'linear-gradient(135deg, #ef4444, #dc2626)'}}>
                <AlertCircle size={28} />
              </div>
              <div className="admin-stat-info">
                <p className="admin-stat-label">Alertes Système</p>
                <h2 className="admin-stat-value">{stats.systemAlerts}</h2>
                <p className="admin-stat-trend admin-stat-trend-down">
                  <span>Nécessite attention</span>
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="admin-secondary-stats">
            <div className="admin-secondary-stat">
              <div className="admin-secondary-stat-icon">
                <Users size={20} />
              </div>
              <div className="admin-secondary-stat-info">
                <p className="admin-secondary-stat-label">Étudiants</p>
                <p className="admin-secondary-stat-value">{stats.totalStudents}</p>
              </div>
            </div>
            <div className="admin-secondary-stat">
              <div className="admin-secondary-stat-icon">
                <Users size={20} />
              </div>
              <div className="admin-secondary-stat-info">
                <p className="admin-secondary-stat-label">Parents</p>
                <p className="admin-secondary-stat-value">{stats.totalParents}</p>
              </div>
            </div>
            <div className="admin-secondary-stat">
              <div className="admin-secondary-stat-icon">
                <Shield size={20} />
              </div>
              <div className="admin-secondary-stat-info">
                <p className="admin-secondary-stat-label">Personnel</p>
                <p className="admin-secondary-stat-value">{stats.activePersonnel}</p>
              </div>
            </div>
            <div className="admin-secondary-stat">
              <div className="admin-secondary-stat-icon">
                <FileText size={20} />
              </div>
              <div className="admin-secondary-stat-info">
                <p className="admin-secondary-stat-label">Docs ce mois</p>
                <p className="admin-secondary-stat-value">{stats.documentsThisMonth}</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="admin-main-grid">
            {/* Recent Users */}
            <div className="admin-card admin-card-users">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Utilisateurs récents</h3>
                <button className="admin-add-btn">
                  <UserPlus size={18} />
                  Ajouter
                </button>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead className="admin-table-head">
                    <tr>
                      <th className="admin-table-th">Nom</th>
                      <th className="admin-table-th">Rôle</th>
                      <th className="admin-table-th">Email</th>
                      <th className="admin-table-th">Date</th>
                      <th className="admin-table-th">Statut</th>
                      <th className="admin-table-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="admin-table-body">
                    {recentUsers.map(user => (
                      <tr key={user.id} className="admin-table-row">
                        <td className="admin-table-td">
                          <div className="admin-user-cell">
                            <div className="admin-user-avatar">
                              {user.name.charAt(0)}
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="admin-table-td">
                          <span className="admin-role-badge">{user.role}</span>
                        </td>
                        <td className="admin-table-td admin-email-cell">{user.email}</td>
                        <td className="admin-table-td admin-date-cell">{user.joinDate}</td>
                        <td className="admin-table-td">
                          <span className="admin-status-dot" style={{
                            background: getStatusColor(user.status)
                          }}>
                            <span className="admin-status-text">{user.status === 'active' ? 'Actif' : 'En attente'}</span>
                          </span>
                        </td>
                        <td className="admin-table-td">
                          <div className="admin-action-buttons">
                            <button className="admin-action-btn admin-view-btn" title="Voir">
                              <Eye size={16} />
                            </button>
                            <button className="admin-action-btn admin-edit-btn" title="Modifier">
                              <Edit size={16} />
                            </button>
                            <button className="admin-action-btn admin-delete-btn" title="Supprimer">
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

            {/* System Logs */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Journalisation Système</h3>
                <button className="admin-filter-btn-small">
                  <Filter size={16} />
                  Filtrer
                </button>
              </div>
              <div className="admin-logs-list">
                {systemLogs.map(log => (
                  <div key={log.id} className="admin-log-item">
                    <div className="admin-log-icon" style={{
                      background: `${getLogTypeColor(log.type)}20`,
                      color: getLogTypeColor(log.type)
                    }}>
                      <Activity size={16} />
                    </div>
                    <div className="admin-log-content">
                      <h4 className="admin-log-action">{log.action}</h4>
                      <p className="admin-log-details">{log.details}</p>
                      <p className="admin-log-meta">{log.user} • {log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts & Document Stats */}
          <div className="admin-bottom-grid">
            {/* System Alerts */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Alertes Système</h3>
                <span className="admin-alert-count">{systemAlerts.length}</span>
              </div>
              <div className="admin-alerts-list">
                {systemAlerts.map(alert => (
                  <div key={alert.id} className="admin-alert-item">
                    <div className="admin-alert-indicator" style={{
                      background: getAlertColor(alert.severity)
                    }}></div>
                    <div className="admin-alert-content">
                      <h4 className="admin-alert-title">{alert.title}</h4>
                      <p className="admin-alert-message">{alert.message}</p>
                      <p className="admin-alert-time">{alert.time}</p>
                    </div>
                    <button className="admin-alert-dismiss">✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Statistics */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Répartition des Documents</h3>
              </div>
              <div className="admin-doc-stats-list">
                {documentStats.map((doc, index) => (
                  <div key={index} className="admin-doc-stat-item">
                    <div className="admin-doc-stat-header">
                      <span className="admin-doc-stat-type">{doc.type}</span>
                      <span className="admin-doc-stat-count">{doc.count}</span>
                    </div>
                    <div className="admin-doc-stat-bar">
                      <div 
                        className="admin-doc-stat-fill"
                        style={{width: `${doc.percentage}%`}}
                      ></div>
                    </div>
                    <div className="admin-doc-stat-footer">
                      <span className="admin-doc-stat-percentage">{doc.percentage}%</span>
                      <span className={`admin-doc-stat-trend ${doc.trend === 'up' ? 'admin-doc-trend-up' : 'admin-doc-trend-down'}`}>
                        {doc.trend === 'up' ? '↑' : '↓'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="admin-quick-actions-section">
            <h3 className="admin-section-title">Actions Rapides</h3>
            <div className="admin-actions-grid">
              <button className="admin-quick-action-card">
                <div className="admin-quick-action-icon" style={{background: 'linear-gradient(135deg, #17766e, #14635c)'}}>
                  <UserPlus size={28} />
                </div>
                <h4 className="admin-quick-action-title">Nouvel utilisateur</h4>
                <p className="admin-quick-action-desc">Créer un compte utilisateur</p>
              </button>

              <button className="admin-quick-action-card">
                <div className="admin-quick-action-icon" style={{background: 'linear-gradient(135deg, #3b82f6, #2563eb)'}}>
                  <FilePlus size={28} />
                </div>
                <h4 className="admin-quick-action-title">Générer document</h4>
                <p className="admin-quick-action-desc">Créer un nouveau document</p>
              </button>

              <button className="admin-quick-action-card">
                <div className="admin-quick-action-icon" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                  <Download size={28} />
                </div>
                <h4 className="admin-quick-action-title">Export données</h4>
                <p className="admin-quick-action-desc">Exporter la base de données</p>
              </button>

              <button className="admin-quick-action-card">
                <div className="admin-quick-action-icon" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
                  <Archive size={28} />
                </div>
                <h4 className="admin-quick-action-title">Archivage</h4>
                <p className="admin-quick-action-desc">Archiver les documents</p>
              </button>

              <button className="admin-quick-action-card">
                <div className="admin-quick-action-icon" style={{background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'}}>
                  <BarChart3 size={28} />
                </div>
                <h4 className="admin-quick-action-title">Rapports</h4>
                <p className="admin-quick-action-desc">Générer des rapports</p>
              </button>

              <button className="admin-quick-action-card">
                <div className="admin-quick-action-icon" style={{background: 'linear-gradient(135deg, #ef4444, #dc2626)'}}>
                  <Database size={28} />
                </div>
                <h4 className="admin-quick-action-title">Sauvegarde</h4>
                <p className="admin-quick-action-desc">Sauvegarder le système</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;