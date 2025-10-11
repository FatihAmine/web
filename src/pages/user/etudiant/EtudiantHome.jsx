import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  Upload, 
  Clock, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import '../../../css/etudiant/EtudiantHome.css';

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const userData = {
    firstName: "Mohamed",
    lastName: "Alami",
    profilePic: "https://ui-avatars.com/api/?name=Mohamed+Alami&background=17766e&color=fff&size=200"
  };

  const stats = {
    totalDocuments: 24,
    pendingRequests: 3,
    approvedRequests: 15,
    rejectedRequests: 2
  };

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

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Tableau de bord' },
    { id: 'documents', icon: FileText, label: 'Mes Documents' },
    { id: 'requests', icon: Clock, label: 'Mes Demandes' },
    { id: 'upload', icon: Upload, label: 'Téléverser' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'settings', icon: Settings, label: 'Paramètres' }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      case 'pending': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
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
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'dashboard-sidebar-open' : 'dashboard-sidebar-closed'}`}>
        <div className="dashboard-sidebar-content">
          <div className="dashboard-profile-section">
            <img src={userData.profilePic} alt="Profile" className="dashboard-profile-pic" />
            {sidebarOpen && (
              <div className="dashboard-profile-info">
                <h3 className="dashboard-profile-name">{userData.firstName} {userData.lastName}</h3>
                <p className="dashboard-profile-role">Étudiant</p>
              </div>
            )}
          </div>

          <nav className="dashboard-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`dashboard-menu-item ${activeTab === item.id ? 'dashboard-menu-item-active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <button className="dashboard-disconnect-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <main className="dashboard-main-content">
        <header className="dashboard-header">
          <button 
            className="dashboard-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="dashboard-page-title">
            {menuItems.find(item => item.id === activeTab)?.label}
          </h1>
        </header>

        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="dashboard-stats-grid">
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon" style={{background: 'linear-gradient(135deg, #17766e, #14635c)'}}>
                <FileText size={24} />
              </div>
              <div className="dashboard-stat-info">
                <p className="dashboard-stat-label">Total Documents</p>
                <h2 className="dashboard-stat-value">{stats.totalDocuments}</h2>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
                <Clock size={24} />
              </div>
              <div className="dashboard-stat-info">
                <p className="dashboard-stat-label">Demandes en attente</p>
                <h2 className="dashboard-stat-value">{stats.pendingRequests}</h2>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                <CheckCircle size={24} />
              </div>
              <div className="dashboard-stat-info">
                <p className="dashboard-stat-label">Demandes approuvées</p>
                <h2 className="dashboard-stat-value">{stats.approvedRequests}</h2>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon" style={{background: 'linear-gradient(135deg, #ef4444, #dc2626)'}}>
                <XCircle size={24} />
              </div>
              <div className="dashboard-stat-info">
                <p className="dashboard-stat-label">Demandes rejetées</p>
                <h2 className="dashboard-stat-value">{stats.rejectedRequests}</h2>
              </div>
            </div>
          </div>

          {/* Documents & Requests */}
          <div className="dashboard-content-grid">
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">Documents récents</h3>
                <button className="dashboard-view-all-btn">Voir tout</button>
              </div>
              <div className="dashboard-documents-list">
                {recentDocuments.map(doc => (
                  <div key={doc.id} className="dashboard-document-item">
                    <div className="dashboard-document-icon">
                      <FileText size={20} />
                    </div>
                    <div className="dashboard-document-info">
                      <h4 className="dashboard-document-name">{doc.name}</h4>
                      <p className="dashboard-document-meta">{doc.type} • {doc.date}</p>
                    </div>
                    <div className="dashboard-document-status" style={{color: getStatusColor(doc.status)}}>
                      {getStatusIcon(doc.status)}
                    </div>
                    <button className="dashboard-download-btn">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">Demandes en cours</h3>
                <button className="dashboard-view-all-btn">Voir tout</button>
              </div>
              <div className="dashboard-requests-list">
                {pendingRequests.map(req => (
                  <div key={req.id} className="dashboard-request-item">
                    <div className="dashboard-request-info">
                      <h4 className="dashboard-request-name">{req.document}</h4>
                      <p className="dashboard-request-date">Demandé le {req.requestDate}</p>
                    </div>
                    <div className="dashboard-status-badge" style={{
                      background: `${getStatusColor(req.status)}20`,
                      color: getStatusColor(req.status)
                    }}>
                      {getStatusIcon(req.status)}
                      <span>{getStatusText(req.status)}</span>
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

export default StudentDashboard;