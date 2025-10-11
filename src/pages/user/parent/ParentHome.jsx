import React, { useState } from 'react';
import { 
  Home, 
  Users,
  FileText, 
  Clock, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  User
} from 'lucide-react';
import '../../../css/parent/ParentHome.css';

const ParentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const userData = {
    firstName: "Fatima",
    lastName: "Bennani",
    profilePic: "https://ui-avatars.com/api/?name=Fatima+Bennani&background=17766e&color=fff&size=200"
  };

  // Parent can have multiple children
  const children = [
    { id: 1, name: "Ahmed Bennani", class: "1ère année Informatique", status: "active" },
    { id: 2, name: "Sara Bennani", class: "3ème année Marketing", status: "active" }
  ];

  const stats = {
    totalChildren: 2,
    pendingRequests: 4,
    documentsReceived: 18,
    alerts: 1
  };

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

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Tableau de bord' },
    { id: 'children', icon: Users, label: 'Mes Enfants' },
    { id: 'documents', icon: FileText, label: 'Documents' },
    { id: 'requests', icon: Clock, label: 'Demandes' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'settings', icon: Settings, label: 'Paramètres' }
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

  return (
    <div className="parent-dashboard-container">
      {/* Sidebar */}
      <aside className={`parent-sidebar ${sidebarOpen ? 'parent-sidebar-open' : 'parent-sidebar-closed'}`}>
        <div className="parent-sidebar-content">
          <div className="parent-profile-section">
            <img src={userData.profilePic} alt="Profile" className="parent-profile-pic" />
            {sidebarOpen && (
              <div className="parent-profile-info">
                <h3 className="parent-profile-name">{userData.firstName} {userData.lastName}</h3>
                <p className="parent-profile-role">Parent</p>
              </div>
            )}
          </div>

          <nav className="parent-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`parent-menu-item ${activeTab === item.id ? 'parent-menu-item-active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <button className="parent-disconnect-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <main className="parent-main-content">
        <header className="parent-header">
          <button 
            className="parent-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="parent-page-title">
            {menuItems.find(item => item.id === activeTab)?.label}
          </h1>
          <button className="parent-new-request-btn">
            <Plus size={20} />
            <span>Nouvelle demande</span>
          </button>
        </header>

        <div className="parent-content">
          {/* Stats Cards */}
          <div className="parent-stats-grid">
            <div className="parent-stat-card">
              <div className="parent-stat-icon" style={{background: 'linear-gradient(135deg, #17766e, #14635c)'}}>
                <Users size={24} />
              </div>
              <div className="parent-stat-info">
                <p className="parent-stat-label">Enfants inscrits</p>
                <h2 className="parent-stat-value">{stats.totalChildren}</h2>
              </div>
            </div>

            <div className="parent-stat-card">
              <div className="parent-stat-icon" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
                <Clock size={24} />
              </div>
              <div className="parent-stat-info">
                <p className="parent-stat-label">Demandes en cours</p>
                <h2 className="parent-stat-value">{stats.pendingRequests}</h2>
              </div>
            </div>

            <div className="parent-stat-card">
              <div className="parent-stat-icon" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                <FileText size={24} />
              </div>
              <div className="parent-stat-info">
                <p className="parent-stat-label">Documents reçus</p>
                <h2 className="parent-stat-value">{stats.documentsReceived}</h2>
              </div>
            </div>

            <div className="parent-stat-card">
              <div className="parent-stat-icon" style={{background: 'linear-gradient(135deg, #ef4444, #dc2626)'}}>
                <Bell size={24} />
              </div>
              <div className="parent-stat-info">
                <p className="parent-stat-label">Alertes</p>
                <h2 className="parent-stat-value">{stats.alerts}</h2>
              </div>
            </div>
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
                    <span className="parent-child-status" style={{
                      background: '#10b98120',
                      color: '#10b981'
                    }}>
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
            <div className="parent-card">
              <div className="parent-card-header">
                <h3 className="parent-card-title">Documents récents</h3>
                <button className="parent-view-all-btn">Voir tout</button>
              </div>
              <div className="parent-documents-list">
                {recentDocuments.map(doc => (
                  <div key={doc.id} className="parent-document-item">
                    <div className="parent-document-icon">
                      <FileText size={20} />
                    </div>
                    <div className="parent-document-info">
                      <h4 className="parent-document-name">{doc.name}</h4>
                      <p className="parent-document-meta">{doc.childName} • {doc.type}</p>
                      <p className="parent-document-date">{doc.date}</p>
                    </div>
                    <div className="parent-document-status" style={{color: getStatusColor(doc.status)}}>
                      {getStatusIcon(doc.status)}
                    </div>
                    <button className="parent-download-btn">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="parent-card">
              <div className="parent-card-header">
                <h3 className="parent-card-title">Demandes en cours</h3>
                <button className="parent-view-all-btn">Voir tout</button>
              </div>
              <div className="parent-requests-list">
                {pendingRequests.map(req => (
                  <div key={req.id} className="parent-request-item">
                    <div className="parent-request-info">
                      <h4 className="parent-request-name">{req.document}</h4>
                      <p className="parent-request-child">{req.childName}</p>
                      <p className="parent-request-date">Demandé le {req.requestDate}</p>
                    </div>
                    <div className="parent-status-badge" style={{
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

export default ParentDashboard;