import React, { useState } from 'react';
import Sidebar from '../../component/sidebarpersonnel';
import { 
  Bell,
  Menu,
  X,
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  FileText,
  TrendingUp,
  Activity,
  Calendar,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/personnel/PersonnelHome.css';

const PersonnelDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  
  const userData = {
    firstName: "Karim",
    lastName: "El Amrani",
    role: "Personnel Administratif",
    profilePic: "https://ui-avatars.com/api/?name=Karim+ElAmrani&background=17766e&color=fff&size=200"
  };

  const stats = [
    {
      id: 1,
      title: 'Demandes en attente',
      value: '12',
      icon: <Clock size={24} />,
      color: '#f59e0b',
      change: '+3 aujourd\'hui',
      percentage: '+25%'
    },
    {
      id: 2,
      title: 'Traitées aujourd\'hui',
      value: '8',
      icon: <CheckCircle size={24} />,
      color: '#10b981',
      change: '+2 cette semaine',
      percentage: '+15%'
    },
    {
      id: 3,
      title: 'Total Étudiants',
      value: '245',
      icon: <Users size={24} />,
      color: '#5eead4',
      change: '+12 ce mois',
      percentage: '+5%'
    },
    {
      id: 4,
      title: 'Documents générés',
      value: '156',
      icon: <FileText size={24} />,
      color: '#3b82f6',
      change: '+24 cette semaine',
      percentage: '+18%'
    },
  ];

  const recentRequests = [
    { 
      id: 1, 
      studentName: "Ahmed Bennani", 
      document: "Attestation de Scolarité", 
      requestDate: "2025-10-11", 
      status: "pending", 
      priority: "high",
      class: "3ème année Informatique"
    },
    { 
      id: 2, 
      studentName: "Sara Idrissi", 
      document: "Relevé de Notes", 
      requestDate: "2025-10-11", 
      status: "in_progress", 
      priority: "medium",
      class: "2ème année Marketing"
    },
    { 
      id: 3, 
      studentName: "Omar Tazi", 
      document: "Certificat de Réussite", 
      requestDate: "2025-10-10", 
      status: "pending", 
      priority: "low",
      class: "1ère année Design"
    },
    { 
      id: 4, 
      studentName: "Leila Fassi", 
      document: "Convention de Stage", 
      requestDate: "2025-10-10", 
      status: "approved", 
      priority: "medium",
      class: "3ème année Business"
    },
    { 
      id: 5, 
      studentName: "Youssef Alaoui", 
      document: "Bulletin S1", 
      requestDate: "2025-10-09", 
      status: "approved", 
      priority: "low",
      class: "2ème année Informatique"
    },
    { 
      id: 6, 
      studentName: "Amina Rachid", 
      document: "Attestation de Stage", 
      requestDate: "2025-10-09", 
      status: "in_progress", 
      priority: "high",
      class: "3ème année Marketing"
    }
  ];

  const recentActivity = [
    { 
      id: 1, 
      action: "Demande approuvée", 
      user: "Ahmed Bennani", 
      document: "Attestation de Scolarité", 
      time: "Il y a 5 min",
      icon: <CheckCircle size={18} />,
      color: '#10b981'
    },
    { 
      id: 2, 
      action: "Document généré", 
      user: "Sara Idrissi", 
      document: "Relevé de Notes", 
      time: "Il y a 15 min",
      icon: <FileText size={18} />,
      color: '#3b82f6'
    },
    { 
      id: 3, 
      action: "Demande rejetée", 
      user: "Omar Tazi", 
      document: "Certificat", 
      time: "Il y a 1h",
      icon: <XCircle size={18} />,
      color: '#ef4444'
    },
    { 
      id: 4, 
      action: "Nouveau téléversement", 
      user: "Personnel Admin", 
      document: "Bulletins S1 2024", 
      time: "Il y a 2h",
      icon: <Activity size={18} />,
      color: '#f59e0b'
    },
    { 
      id: 5, 
      action: "Étudiant ajouté", 
      user: "Karim El Amrani", 
      document: "Nouveau dossier", 
      time: "Il y a 3h",
      icon: <Users size={18} />,
      color: '#5eead4'
    }
  ];

  const monthlyStats = {
    totalRequests: 156,
    approvedRequests: 132,
    pendingRequests: 12,
    rejectedRequests: 12
  };

  const handleLogout = () => {
    navigate('/personnel/login');
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

      <main className={`personnel-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="personnel-header">
          <button 
            className="personnel-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="personnel-page-title">Tableau de bord</h1>
          <div className="personnel-header-actions">
            <button className="personnel-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="personnel-content">
          {/* Welcome Section */}
          <div className="personnel-welcome-section">
            <div className="welcome-text">
              <h2>Bienvenue, {userData.firstName} {userData.lastName}</h2>
              <p>Voici un aperçu de votre activité aujourd'hui</p>
            </div>
            <div className="welcome-date">
              <Calendar size={20} />
              <span>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="personnel-stats-grid">
            {stats.map((stat) => (
              <div key={stat.id} className="personnel-stat-card">
                <div className="stat-icon" style={{background: `${stat.color}1a`, color: stat.color}}>
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <p className="stat-label">{stat.title}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                  <div className="stat-footer">
                    <span className="stat-change" style={{color: '#10b981'}}>
                      {stat.change}
                    </span>
                    <span className="stat-percentage" style={{color: stat.color}}>
                      <TrendingUp size={14} />
                      {stat.percentage}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Monthly Overview */}
          <div className="personnel-overview-card">
            <h3 className="personnel-section-title">Vue d'ensemble mensuelle</h3>
            <div className="personnel-overview-grid">
              <div className="overview-item">
                <div className="overview-icon" style={{background: '#3b82f61a', color: '#3b82f6'}}>
                  <FileText size={24} />
                </div>
                <div className="overview-content">
                  <p className="overview-label">Total demandes</p>
                  <h3 className="overview-value">{monthlyStats.totalRequests}</h3>
                </div>
                <div className="overview-bar">
                  <div 
                    className="overview-bar-fill" 
                    style={{width: '100%', background: '#3b82f6'}}
                  ></div>
                </div>
              </div>

              <div className="overview-item">
                <div className="overview-icon" style={{background: '#10b9811a', color: '#10b981'}}>
                  <CheckCircle size={24} />
                </div>
                <div className="overview-content">
                  <p className="overview-label">Approuvées</p>
                  <h3 className="overview-value">{monthlyStats.approvedRequests}</h3>
                </div>
                <div className="overview-bar">
                  <div 
                    className="overview-bar-fill" 
                    style={{width: `${(monthlyStats.approvedRequests / monthlyStats.totalRequests) * 100}%`, background: '#10b981'}}
                  ></div>
                </div>
              </div>

              <div className="overview-item">
                <div className="overview-icon" style={{background: '#f59e0b1a', color: '#f59e0b'}}>
                  <Clock size={24} />
                </div>
                <div className="overview-content">
                  <p className="overview-label">En attente</p>
                  <h3 className="overview-value">{monthlyStats.pendingRequests}</h3>
                </div>
                <div className="overview-bar">
                  <div 
                    className="overview-bar-fill" 
                    style={{width: `${(monthlyStats.pendingRequests / monthlyStats.totalRequests) * 100}%`, background: '#f59e0b'}}
                  ></div>
                </div>
              </div>

              <div className="overview-item">
                <div className="overview-icon" style={{background: '#ef44441a', color: '#ef4444'}}>
                  <XCircle size={24} />
                </div>
                <div className="overview-content">
                  <p className="overview-label">Rejetées</p>
                  <h3 className="overview-value">{monthlyStats.rejectedRequests}</h3>
                </div>
                <div className="overview-bar">
                  <div 
                    className="overview-bar-fill" 
                    style={{width: `${(monthlyStats.rejectedRequests / monthlyStats.totalRequests) * 100}%`, background: '#ef4444'}}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="personnel-content-grid">
            {/* Requests List */}
            <div className="personnel-card personnel-card-large">
              <div className="personnel-card-header">
                <h3 className="personnel-card-title">Demandes récentes</h3>
                <span className="personnel-view-all">Voir tout →</span>
              </div>
              <div className="personnel-requests-list">
                {recentRequests.map(request => {
                  const StatusIcon = getStatusIcon(request.status);
                  return (
                    <div key={request.id} className="personnel-request-item">
                      <div className="request-item-header">
                        <div className="student-info">
                          <div className="student-avatar">
                            {request.studentName.charAt(0)}
                          </div>
                          <div className="student-details">
                            <h4 className="student-name">{request.studentName}</h4>
                            <p className="student-class">{request.class}</p>
                          </div>
                        </div>
                        <span 
                          className="priority-badge" 
                          style={{
                            background: `${getPriorityColor(request.priority)}1a`,
                            color: getPriorityColor(request.priority)
                          }}
                        >
                          {getPriorityText(request.priority)}
                        </span>
                      </div>
                      <div className="request-item-body">
                        <div className="request-document">
                          <FileText size={16} />
                          <span>{request.document}</span>
                        </div>
                        <div className="request-date">
                          <Calendar size={14} />
                          <span>{request.requestDate}</span>
                        </div>
                      </div>
                      <div 
                        className="request-status-badge" 
                        style={{
                          background: `${getStatusColor(request.status)}1a`,
                          color: getStatusColor(request.status)
                        }}
                      >
                        <StatusIcon size={16} />
                        <span>{getStatusText(request.status)}</span>
                      </div>
                    </div>
                  );
                })}
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
                    <div 
                      className="activity-icon"
                      style={{
                        background: `${activity.color}1a`,
                        color: activity.color
                      }}
                    >
                      {activity.icon}
                    </div>
                    <div className="activity-content">
                      <h4 className="activity-action">{activity.action}</h4>
                      <p className="activity-details">
                        <User size={14} style={{verticalAlign: 'middle', marginRight: '4px'}} />
                        {activity.user}
                      </p>
                      <p className="activity-document">{activity.document}</p>
                      <p className="activity-time">
                        <Clock size={12} style={{verticalAlign: 'middle', marginRight: '4px'}} />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonnelDashboard;
