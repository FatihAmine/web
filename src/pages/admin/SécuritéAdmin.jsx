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
  Shield,
  Database,
  Activity,
  Filter,
  Download,
  CheckCircle,
  AlertTriangle,
  Lock,
  Key,
  User,
} from 'lucide-react';
import '../../css/admin/SécuritéAdmin.css';

const securityStats = [
  { label: "Authentification protégée", value: "Active", icon: <Lock />, color: "#10b981" },
  { label: "Connexion HTTPS", value: "Validée", icon: <CheckCircle />, color: "#3b82f6" },
  { label: "Dernière connexion", value: "2025-10-17 15:44", icon: <User />, color: "#f59e0b" },
  { label: "Rôles utilisateurs", value: "Admin, Parent, Étudiant, Personnel", icon: <Key />, color: "#8b5cf6" },
  { label: "Tentatives échouées", value: "0", icon: <AlertTriangle />, color: "#ef4444" }
];
const activityLogs = [
  { id: 1, action: "Connexion", user: "Ahmed Bennani", time: "2025-10-17 15:44", type: "Succès", result: "Validé" },
  { id: 2, action: "Changement mot de passe", user: "Fatima Idrissi", time: "2025-10-17 10:08", type: "Succès", result: "Validé" },
  { id: 3, action: "Ajout rôle Admin", user: "Karim Tazi", time: "2025-10-16 18:41", type: "Avertissement", result: "En attente" },
  { id: 4, action: "Blocage utilisateur", user: "Sara Fassi", time: "2025-10-16 12:22", type: "Erreur", result: "Rejeté" }
];

const AdminSecurite = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('security');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Tableau de bord' },
    { id: 'users', icon: Users, label: 'Gestion Utilisateurs' },
    { id: 'documents', icon: FileText, label: 'Gestion Documents' },
    { id: 'requests', icon: Clock, label: 'Demandes' },
    { id: 'statistics', icon: Activity, label: 'Statistiques' },
    { id: 'logs', icon: Activity, label: 'Journalisation' },
    { id: 'security', icon: Shield, label: 'Sécurité' },
    { id: 'database', icon: Database, label: 'Base de données' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'settings', icon: Settings, label: 'Paramètres' }
  ];

  const logTypeMap = {
    "Succès": "#10b981",
    "Erreur": "#ef4444",
    "Avertissement": "#f59e0b",
  };

  const filteredLogs = activityLogs
    .filter(log => filter === 'all' || log.type === filter)
    .filter(log =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.result.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="admin-dashboard-container">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : 'admin-sidebar-closed'}`}>
        <div className="admin-sidebar-content">
          <div className="admin-profile-section">
            <img src="https://ui-avatars.com/api/?name=Mohammed+Alaoui&background=17766e&color=fff&size=200"
              alt="Profile" className="admin-profile-pic"/>
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
          <h1 className="admin-page-title">Sécurité</h1>
        </header>
        <div className="admin-content">
          {/* Cards */}
          <div className="admin-security-cards-grid">
            {securityStats.map((stat, idx) => (
              <div className="admin-security-card" key={idx}>
                <div className="admin-security-card-icon" style={{background: stat.color}}>
                  {stat.icon}
                </div>
                <div className="admin-security-card-info">
                  <div className="admin-security-card-label">{stat.label}</div>
                  <div className="admin-security-card-value">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Toolbar */}
          <div className="admin-security-toolbar">
            <div className="admin-security-toolbar-filters">
              <Filter size={17} />
              <select value={filter} onChange={e=>setFilter(e.target.value)} className="admin-security-filter">
                <option value="all">Tous types</option>
                <option value="Succès">Succès</option>
                <option value="Avertissement">Avertissement</option>
                <option value="Erreur">Erreur</option>
              </select>
            </div>
            <div className="admin-security-toolbar-actions">
              <button className="admin-security-download-btn">
                <Download size={16} /> Télécharger
              </button>
              <div className="admin-security-searchrow">
                <Search size={16} />
                <input
                  className="admin-security-search"
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher activité..."
                  aria-label="Rechercher"
                  style={{minWidth:'110px'}}
                />
              </div>
            </div>
          </div>
          {/* Log Table */}
          <div className="admin-security-table-container">
            <table className="admin-security-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Utilisateur</th>
                  <th>Type</th>
                  <th>Résultat</th>
                  <th>Heure</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-security-empty">Aucune activité trouvée</td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id}>
                      <td>{log.action}</td>
                      <td>{log.user}</td>
                      <td>
                        <span
                          className="admin-security-type"
                          style={{
                            background: logTypeMap[log.type] + "1a",
                            color: logTypeMap[log.type]
                          }}
                        >
                          {log.type}
                        </span>
                      </td>
                      <td>
                        <span className="admin-security-result">{log.result}</span>
                      </td>
                      <td>{log.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSecurite;
