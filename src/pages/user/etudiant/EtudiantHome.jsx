import React, { useState } from 'react';
import Sidebar from '../../component/sidebaretudiant';
import { 
  Bell,
  FileText, 
  Clock, 
  Menu, 
  X,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/etudiant/EtudiantHome.css';

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  
  const userData = {
    firstName: "Mohamed",
    lastName: "Alami",
    role: "Étudiant",
    profilePic: "https://ui-avatars.com/api/?name=Mohamed+Alami&background=17766e&color=fff&size=200"
  };

  const stats = [
    {
      id: 1,
      title: 'Total Documents',
      value: '24',
      icon: <FileText size={24} />,
      color: '#5eead4',
      change: '+3'
    },
    {
      id: 2,
      title: 'Demandes en attente',
      value: '3',
      icon: <Clock size={24} />,
      color: '#f59e0b',
      change: '+1'
    },
    {
      id: 3,
      title: 'Demandes approuvées',
      value: '15',
      icon: <CheckCircle size={24} />,
      color: '#10b981',
      change: '+5'
    },
    {
      id: 4,
      title: 'Demandes rejetées',
      value: '2',
      icon: <XCircle size={24} />,
      color: '#ef4444',
      change: '0'
    }
  ];

  const recentDocuments = [
    { id: 1, name: "Certificat de Scolarité", type: "Certificat", date: "2025-10-05", status: "approved" },
    { id: 2, name: "Bulletin S1 2024", type: "Bulletin", date: "2025-09-28", status: "approved" },
    { id: 3, name: "Convention de Stage", type: "Convention", date: "2025-09-15", status: "pending" },
    { id: 4, name: "Attestation de Réussite", type: "Attestation", date: "2025-08-20", status: "approved" }
  ];

  const pendingRequests = [
    { id: 1, document: "Relevé de Notes", requestDate: "2025-10-10", status: "pending" },
    { id: 2, document: "Attestation d'Inscription", requestDate: "2025-10-08", status: "pending" },
    { id: 3, document: "Certificat de Stage", requestDate: "2025-10-01", status: "approved" }
  ];

  const handleLogout = () => {
    navigate('/etudiant/login');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'pending': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'pending': return 'En cours';
      default: return 'En attente';
    }
  };

  return (
    <div className="dashboard-container">
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

      <main className={`dashboard-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="dashboard-header">
          <button 
            className="dashboard-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="dashboard-page-title">Tableau de bord</h1>
          <div className="dashboard-header-actions">
            <button className="dashboard-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="dashboard-stats-grid">
            {stats.map((stat) => (
              <div key={stat.id} className="dashboard-stat-card">
                <div className="stat-icon" style={{background: `${stat.color}1a`, color: stat.color}}>
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <p className="stat-label">{stat.title}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                  <div className="stat-change" style={{color: '#10b981'}}>
                    +{stat.change} ce mois
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Documents & Requests Grid */}
          <div className="dashboard-content-grid">
            {/* Recent Documents */}
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">Documents récents</h3>
                <button 
                  className="dashboard-view-all-btn"
                  onClick={() => navigate('/etudiant/documents')}
                >
                  Voir tout
                </button>
              </div>
              <div className="dashboard-documents-list">
                {recentDocuments.map(doc => {
                  const StatusIcon = getStatusIcon(doc.status);
                  return (
                    <div key={doc.id} className="dashboard-document-item">
                      <div className="dashboard-document-icon">
                        <FileText size={20} />
                      </div>
                      <div className="dashboard-document-info">
                        <h4 className="dashboard-document-name">{doc.name}</h4>
                        <p className="dashboard-document-meta">{doc.type} • {doc.date}</p>
                      </div>
                      <div 
                        className="dashboard-document-status" 
                        style={{color: getStatusColor(doc.status)}}
                      >
                        <StatusIcon size={16} />
                      </div>
                      {doc.status === 'approved' && (
                        <button className="dashboard-download-btn">
                          <Download size={18} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pending Requests */}
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">Demandes en cours</h3>
                <button 
                  className="dashboard-view-all-btn"
                  onClick={() => navigate('/etudiant/demandes')}
                >
                  Voir tout
                </button>
              </div>
              <div className="dashboard-requests-list">
                {pendingRequests.map(req => {
                  const StatusIcon = getStatusIcon(req.status);
                  return (
                    <div key={req.id} className="dashboard-request-item">
                      <div className="dashboard-request-info">
                        <h4 className="dashboard-request-name">{req.document}</h4>
                        <p className="dashboard-request-date">Demandé le {req.requestDate}</p>
                      </div>
                      <div 
                        className="dashboard-status-badge" 
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

export default StudentDashboard;
