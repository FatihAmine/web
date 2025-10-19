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
  BarChart3,
  Shield,
  Database,
  Activity,
  Download,
  PieChart,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import '../../css/admin/StatistiquesAdmin.css';

const AdminStatistiques = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('statistics');
  const [period, setPeriod] = useState("mois");

  // Example stats data (replace with API/backend later)
  const stats = {
    totalUsers: 1248,
    totalDocuments: 5678,
    totalRequests: 78,
    totalParents: 334,
    documentsThisMonth: 456,
    totalStudents: 890,
    activePersonnel: 24,
    treatedRequests: 63,
  };
  const documentStats = [
    { type: "Attestations", count: 1234, percentage: 32, trend: "up", color: "#10b981" },
    { type: "Bulletins", count: 987, percentage: 26, trend: "up", color: "#3b82f6" },
    { type: "Certificats", count: 876, percentage: 23, trend: "down", color: "#8b5cf6" },
    { type: "Conventions", count: 721, percentage: 19, trend: "up", color: "#f59e0b" }
  ];
  const recentMetrics = [
    { id: 1, label: "Utilisateurs ajoutés", value: "+17", date: "2025-10-17", category: "Utilisateurs", icon: <Users size={17} color="#10b981" /> },
    { id: 2, label: "Documents générés", value: "129", date: "2025-10-16", category: "Documents", icon: <FileText size={17} color="#3b82f6" /> },
    { id: 3, label: "Demandes traitées", value: "23", date: "2025-10-15", category: "Demandes", icon: <Clock size={17} color="#f59e0b" /> },
    { id: 4, label: "Parents inscrits", value: "+4", date: "2025-10-14", category: "Parents", icon: <Users size={17} color="#8b5cf6" /> }
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

  return (
    <div className="admin-dashboard-container">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : 'admin-sidebar-closed'}`}>
        <div className="admin-sidebar-content">
          <div className="admin-profile-section">
            <img
              src="https://ui-avatars.com/api/?name=Mohammed+Alaoui&background=17766e&color=fff&size=200"
              alt="Profile"
              className="admin-profile-pic"
            />
            {sidebarOpen && (
              <div className="admin-profile-info">
                <h3 className="admin-profile-name">Mohammed Alaoui</h3>
                <p className="admin-profile-role">Super Administrateur</p>
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
      {/* MAIN CONTENT */}
      <main className="admin-main-content">
        <header className="admin-header">
          <button className="admin-toggle-sidebar-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="admin-page-title">Statistiques</h1>
        </header>
        <div className="admin-content">
          {/* Toolbar */}
          <div className="admin-stats-toolbar">
            <div className="admin-stats-period-select">
              <Calendar size={20} />
              <select className="admin-stats-period" value={period} onChange={e => setPeriod(e.target.value)}>
                <option value="jour">Aujourd'hui</option>
                <option value="semaine">Cette semaine</option>
                <option value="mois">Ce mois</option>
                <option value="annee">Cette année</option>
                <option value="tout">Tout</option>
              </select>
            </div>
            <div className="admin-stats-toolbar-actions">
              <button className="admin-stats-download-btn">
                <Download size={19} /> Télécharger
              </button>
              <button className="admin-stats-report-btn">
                <PieChart size={18} /> Rapport PDF
              </button>
              <div className="admin-stats-searchrow">
                <Search size={17} />
                <input
                  className="admin-stats-search"
                  type="search"
                  placeholder="Rechercher métrique..."
                  aria-label="Rechercher"
                  style={{minWidth:'130px'}}
                />
              </div>
              <button className="admin-stats-filter-btn">
                <Filter size={18} />
                Filtrer
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="admin-stats-cards-grid">
            <div className="admin-stats-card">
              <div className="admin-stats-card-icon" style={{background:'#17766e'}}>
                <Users size={24} />
              </div>
              <div className="admin-stats-card-info">
                <div className="admin-stats-card-label">Total utilisateurs</div>
                <div className="admin-stats-card-value">{stats.totalUsers}</div>
              </div>
            </div>
            <div className="admin-stats-card">
              <div className="admin-stats-card-icon" style={{background:'#3b82f6'}}>
                <FileText size={24} />
              </div>
              <div className="admin-stats-card-info">
                <div className="admin-stats-card-label">Documents</div>
                <div className="admin-stats-card-value">{stats.totalDocuments}</div>
              </div>
            </div>
            <div className="admin-stats-card">
              <div className="admin-stats-card-icon" style={{background:'#f59e0b'}}>
                <Clock size={24} />
              </div>
              <div className="admin-stats-card-info">
                <div className="admin-stats-card-label">Demandes</div>
                <div className="admin-stats-card-value">{stats.totalRequests}</div>
              </div>
            </div>
            <div className="admin-stats-card">
              <div className="admin-stats-card-icon" style={{background:'#8b5cf6'}}>
                <Users size={24} />
              </div>
              <div className="admin-stats-card-info">
                <div className="admin-stats-card-label">Parents</div>
                <div className="admin-stats-card-value">{stats.totalParents}</div>
              </div>
            </div>
            <div className="admin-stats-card">
              <div className="admin-stats-card-icon" style={{background:'#10b981'}}>
                <TrendingUp size={24} />
              </div>
              <div className="admin-stats-card-info">
                <div className="admin-stats-card-label">Docs ce mois</div>
                <div className="admin-stats-card-value">{stats.documentsThisMonth}</div>
              </div>
            </div>
          </div>

          {/* Document Breakdown */}
          <div className="admin-stats-breakdown">
            <h3 className="admin-stats-section-title">Répartition Documents</h3>
            <div className="admin-stats-docbreakdown-list">
              {documentStats.map((doc, i) => (
                <div key={i} className="admin-stats-docbreakdown-item">
                  <div className="admin-stats-docbreakdown-header">
                    <span className="admin-stats-docbreakdown-type">{doc.type}</span>
                    <span className="admin-stats-docbreakdown-count">{doc.count}</span>
                  </div>
                  <div className="admin-stats-docbreakdown-bar">
                    <div
                      className="admin-stats-docbreakdown-fill"
                      style={{width:`${doc.percentage}%`, background: doc.color}}
                    ></div>
                  </div>
                  <div className="admin-stats-docbreakdown-footer">
                    <span className="admin-stats-docbreakdown-percentage">{doc.percentage}%</span>
                    <span className={`admin-stats-docbreakdown-trend ${doc.trend === 'up' ? 'up' : 'down'}`}>
                      {doc.trend === 'up' ? '↑' : '↓'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Metrics Table */}
          <div className="admin-stats-tablewrap">
            <h3 className="admin-stats-section-title">Activité récente</h3>
            <table className="admin-stats-table">
              <thead>
                <tr>
                  <th>Métrique</th>
                  <th>Catégorie</th>
                  <th>Date</th>
                  <th>Valeur</th>
                </tr>
              </thead>
              <tbody>
                {recentMetrics.map(m => (
                  <tr key={m.id}>
                    <td>
                      <span className="admin-stats-metricicon">{m.icon}</span>
                      {m.label}
                    </td>
                    <td>{m.category}</td>
                    <td>{m.date}</td>
                    <td><span className="admin-stats-value">{m.value}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminStatistiques;
