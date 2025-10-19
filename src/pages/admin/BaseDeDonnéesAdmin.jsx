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
  Database,
  Download,
  Upload,
  Search,
  Shield,
  BarChart3,
  Activity,
  Archive,
  RefreshCcw
} from 'lucide-react';
import '../../css/admin/BaseDeDonnéesAdmin.css';

const dbStats = [
  { label: "Sauvegarde", value: "Active", icon: <Download />, color: "#10b981" },
  { label: "Dernière mise à jour", value: "2025-10-17 12:21", icon: <Archive />, color: "#3b82f6" },
  { label: "Total documents", value: "5678", icon: <FileText />, color: "#f59e0b" },
  { label: "Volume", value: "68 MB", icon: <Database />, color: "#8b5cf6" },
  { label: "Moteur", value: "Firestore", icon: <Shield />, color: "#ef4444" }
];

const dbActivity = [
  { id: 1, operation: "Sauvegarde", user: "Admin", time: "2025-10-17 12:21", result: "Succès" },
  { id: 2, operation: "Ajout document", user: "Sara Fassi", time: "2025-10-17 11:54", result: "Succès" },
  { id: 3, operation: "Suppression", user: "Karim Tazi", time: "2025-10-16 16:10", result: "Erreur" },
  { id: 4, operation: "Restauration", user: "System", time: "2025-10-16 13:01", result: "Succès" }
];

const storageBreakdown = [
  { name: "Étudiants", size: 32, color: "#10b981" },
  { name: "Parents", size: 17, color: "#f59e0b" },
  { name: "Documents", size: 13, color: "#3b82f6" },
  { name: "Personnel", size: 6, color: "#8b5cf6" }
];

const AdminBaseDonnees = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('database');
  const [search, setSearch] = useState('');

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

  const filteredActivity = dbActivity.filter(
    log => log.operation.toLowerCase().includes(search.toLowerCase())
      || log.user.toLowerCase().includes(search.toLowerCase())
      || log.result.toLowerCase().includes(search.toLowerCase())
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
      {/* MAIN */}
      <main className="admin-main-content">
        <header className="admin-header">
          <button className="admin-toggle-sidebar-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="admin-page-title">Base de données</h1>
        </header>
        <div className="admin-content">
          {/* Cards */}
          <div className="admin-db-cards-grid">
            {dbStats.map((stat, idx) => (
              <div className="admin-db-card" key={idx}>
                <div className="admin-db-card-icon" style={{background: stat.color}}>
                  {stat.icon}
                </div>
                <div className="admin-db-card-info">
                  <div className="admin-db-card-label">{stat.label}</div>
                  <div className="admin-db-card-value">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Toolbar */}
          <div className="admin-db-toolbar">
            <button className="admin-db-backup-btn">
              <Download size={17} /> Sauvegarder
            </button>
            <button className="admin-db-restore-btn">
              <Upload size={16} /> Restaurer
            </button>
            <button className="admin-db-refresh-btn">
              <RefreshCcw size={15} /> Rafraichir
            </button>
            <div className="admin-db-searchrow">
              <Search size={16} />
              <input
                className="admin-db-search"
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher action..."
                aria-label="Rechercher"
                style={{minWidth:'110px'}}
              />
            </div>
          </div>
          {/* Storage Breakdown */}
          <div className="admin-db-storage-breakdown">
            <h3 className="admin-db-section-title">Répartition du stockage</h3>
            <div className="admin-db-storage-list">
              {storageBreakdown.map((col, i) => (
                <div key={i} className="admin-db-storage-item">
                  <span className="admin-db-storage-name">{col.name}</span>
                  <span className="admin-db-storage-bar" style={{background: col.color, width: `${col.size * 2.5}%`}}></span>
                  <span className="admin-db-storage-size">{col.size} MB</span>
                </div>
              ))}
            </div>
          </div>
          {/* Logs Table */}
          <div className="admin-db-table-container">
            <table className="admin-db-table">
              <thead>
                <tr>
                  <th>Opération</th>
                  <th>Utilisateur</th>
                  <th>Résultat</th>
                  <th>Date/Heure</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivity.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="admin-db-empty">Aucune opération trouvée</td>
                  </tr>
                ) : (
                  filteredActivity.map(log => (
                    <tr key={log.id}>
                      <td>{log.operation}</td>
                      <td>{log.user}</td>
                      <td>
                        <span className={`admin-db-result ${log.result}`}>{log.result}</span>
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

export default AdminBaseDonnees;
