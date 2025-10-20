import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/sidebarparent';
import { 
  Bell,
  FileText, 
  Menu, 
  X,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  User,
  Clock,
  Users
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../css/parent/ParentHome.css';

const ParentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTabFromPath = () => {
    if (location.pathname.includes('/children')) return 'children';
    if (location.pathname.includes('/documents')) return 'documents';
    if (location.pathname.includes('/demandes')) return 'requests';
    if (location.pathname.includes('/notifications')) return 'notifications';
    if (location.pathname.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  const userData = {
    firstName: "Fatima",
    lastName: "Bennani",
    role: "Parent",
    profilePic: "https://ui-avatars.com/api/?name=Fatima+Bennani&background=17766e&color=fff&size=200"
  };

  const children = [
    { id: 1, name: "Ahmed Bennani", class: "1ère année Informatique", status: "active" },
    { id: 2, name: "Sara Bennani", class: "3ème année Marketing", status: "active" }
  ];

  const stats = [
    {
      id: 1,
      title: 'Enfants inscrits',
      value: '2',
      icon: <Users size={24} />,
      color: '#5eead4',
      change: '+0'
    },
    {
      id: 2,
      title: 'Demandes en cours',
      value: '4',
      icon: <Clock size={24} />,
      color: '#f59e0b',
      change: '+2'
    },
    {
      id: 3,
      title: 'Documents reçus',
      value: '18',
      icon: <FileText size={24} />,
      color: '#10b981',
      change: '+5'
    },
    {
      id: 4,
      title: 'Alertes',
      value: '1',
      icon: <Bell size={24} />,
      color: '#ef4444',
      change: '+1'
    }
  ];

  const recentDocuments = [
    { id: 1, childName: "Ahmed Bennani", name: "Bulletin S1 2024-2025", type: "Bulletin", date: "2025-10-05", status: "approved" },
    { id: 2, childName: "Sara Bennani", name: "Attestation de Scolarité", type: "Attestation", date: "2025-09-28", status: "approved" },
    { id: 3, childName: "Ahmed Bennani", name: "Certificat d'Inscription", type: "Certificat", date: "2025-09-15", status: "pending" },
    { id: 4, childName: "Sara Bennani", name: "Relevé de Notes", type: "Bulletin", date: "2025-08-20", status: "approved" }
  ];

  const pendingRequests = [
    { id: 1, childName: "Ahmed Bennani", document: "Attestation de Réussite", requestDate: "2025-10-10", status: "pending" },
    { id: 2, childName: "Sara Bennani", document: "Convention de Stage", requestDate: "2025-10-08", status: "in_progress" },
    { id: 3, childName: "Ahmed Bennani", document: "Certificat de Scolarité", requestDate: "2025-10-01", status: "approved" }
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

  return (
    <div className="parent-dashboard-container">
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

      <main className={`parent-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="parent-header">
          <button 
            className="parent-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="parent-page-title">Tableau de bord</h1>
          <div className="parent-header-actions">
            <button className="parent-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>

          </div>
        </header>

        <div className="parent-content">
          {/* Stats Cards */}
          <div className="parent-stats-grid">
            {stats.map((stat) => (
              <div key={stat.id} className="parent-stat-card">
                <div className="stat-icon" style={{background: `${stat.color}1a`, color: stat.color}}>
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <p className="stat-label">{stat.title}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                  <div className="stat-change" style={{color: '#10b981'}}>
                    {stat.change !== '+0' && `${stat.change} ce mois`}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Children Cards */}
          <div className="parent-section">
            <div className="parent-section-header">
              <h3 className="parent-section-title">Mes Enfants</h3>
            </div>
            <div className="parent-children-grid">
              {children.map(child => (
                <div key={child.id} className="parent-child-card">
                  <div className="parent-child-avatar">
                    <User size={32} />
                  </div>
                  <div className="parent-child-info">
                    <h4 className="parent-child-name">{child.name}</h4>
                    <p className="parent-child-class">{child.class}</p>
                    <span className="parent-child-status">
                      <CheckCircle size={14} />
                      Actif
                    </span>
                  </div>
                  <button className="parent-view-details-btn">Voir détails</button>
                </div>
              ))}
            </div>
          </div>

          {/* Documents & Requests Grid */}
          <div className="parent-content-grid">
            {/* Recent Documents */}
            <div className="parent-card">
              <div className="parent-card-header">
                <h3 className="parent-card-title">Documents récents</h3>
                <button 
                  className="parent-view-all-btn"
                  onClick={() => navigate('/parent/documents')}
                >
                  Voir tout
                </button>
              </div>
              <div className="parent-documents-list">
                {recentDocuments.map(doc => {
                  const StatusIcon = getStatusIcon(doc.status);
                  return (
                    <div key={doc.id} className="parent-document-item">
                      <div className="parent-document-icon">
                        <FileText size={20} />
                      </div>
                      <div className="parent-document-info">
                        <h4 className="parent-document-name">{doc.name}</h4>
                        <p className="parent-document-meta">{doc.childName}</p>
                        <p className="parent-document-date">{doc.type} • {doc.date}</p>
                      </div>
                      <div 
                        className="parent-document-status" 
                        style={{color: getStatusColor(doc.status)}}
                      >
                        <StatusIcon size={16} />
                      </div>
                      {doc.status === 'approved' && (
                        <button className="parent-download-btn">
                          <Download size={18} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pending Requests */}
            <div className="parent-card">
              <div className="parent-card-header">
                <h3 className="parent-card-title">Demandes en cours</h3>
                <button 
                  className="parent-view-all-btn"
                  onClick={() => navigate('/parent/demandes')}
                >
                  Voir tout
                </button>
              </div>
              <div className="parent-requests-list">
                {pendingRequests.map(req => {
                  const StatusIcon = getStatusIcon(req.status);
                  return (
                    <div key={req.id} className="parent-request-item">
                      <div className="parent-request-info">
                        <h4 className="parent-request-name">{req.document}</h4>
                        <p className="parent-request-child">{req.childName}</p>
                        <p className="parent-request-date">Demandé le {req.requestDate}</p>
                      </div>
                      <div 
                        className="parent-status-badge" 
                        style={{
                          background: `${getStatusColor(req.status)}1a`,
                          color: getStatusColor(req.status)
                        }}
                      >
                        <StatusIcon size={16} />
                        <span>{getStatusText(req.status)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
