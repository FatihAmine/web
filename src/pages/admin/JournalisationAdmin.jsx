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
  Eye,
} from 'lucide-react';
import '../../css/admin/JournalisationAdmin.css';

const logTypes = {
  success: { color: "#10b981", label: "Succès" },
  info:    { color: "#3b82f6", label: "Info" },
  warning: { color: "#f59e0b", label: "Avertissement" },
  error:   { color: "#ef4444", label: "Erreur" }
};

const sampleLogs = [
  { id: 1, action: "Création utilisateur", user: "Admin", details: "Nouvel étudiant: Ahmed Bennani", time: "Il y a 5 min", type: "success" },
  { id: 2, action: "Modification document", user: "Personnel_01", details: "Bulletin modifié pour Sara Idrissi", time: "Il y a 15 min", type: "info" },
  { id: 3, action: "Suppression demande", user: "Admin", details: "Demande #1234 supprimée", time: "Il y a 30 min", type: "warning" },
  { id: 4, action: "Erreur système", user: "System", details: "Échec de génération PDF", time: "Il y a 1h", type: "error" },
  { id: 5, action: "Export données", user: "Admin", details: "Export base de données complète", time: "Il y a 2h", type: "success" }
];

const AdminJournalisation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('logs');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [logDetails, setLogDetails] = useState(null);

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

  const filteredLogs = sampleLogs
    .filter(log => filter === 'all' || log.type === filter)
    .filter(log =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="admin-page-title">Journalisation Système</h1>
        </header>
        <div className="admin-content">
          <div className="admin-logs-toolbar">
            <div className="admin-logs-toolbar-filters">
              <Filter size={18} />
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="admin-logs-filter"
                aria-label="Filtrer par type"
              >
                <option value="all">Tous types</option>
                <option value="success">Succès</option>
                <option value="info">Info</option>
                <option value="warning">Avertissement</option>
                <option value="error">Erreur</option>
              </select>
            </div>
            <div className="admin-logs-toolbar-actions">
              <button className="admin-logs-download-btn">
                <Download size={17} /> Télécharger
              </button>
              <div className="admin-logs-searchrow">
                <Search size={17} />
                <input
                  className="admin-logs-search"
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher log..."
                  aria-label="Rechercher"
                  style={{minWidth:'120px'}}
                />
              </div>
            </div>
          </div>
          <div className="admin-logs-table-container">
            <table className="admin-logs-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Utilisateur</th>
                  <th>Détails</th>
                  <th>Type</th>
                  <th>Heure</th>
                  <th>Voir</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-logs-empty">Aucun log trouvé</td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id}>
                      <td>{log.action}</td>
                      <td>{log.user}</td>
                      <td>{log.details}</td>
                      <td>
                        <span
                          className="admin-logs-type"
                          style={{
                            background: logTypes[log.type]?.color + "1a",
                            color: logTypes[log.type]?.color
                          }}
                        >
                          {logTypes[log.type]?.label}
                        </span>
                      </td>
                      <td>{log.time}</td>
                      <td>
                        <button
                          className="admin-logs-view-btn"
                          onClick={() => setLogDetails(log)}
                          title="Voir détail"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {logDetails && (
          <div className="admin-logs-modal-backdrop">
            <div className="admin-logs-modal">
              <button
                className="admin-logs-modal-close"
                type="button"
                onClick={() => setLogDetails(null)}
                title="Fermer"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
              <h3 className="admin-logs-modal-title">
                <Activity size={16} style={{marginRight:6, color: logTypes[logDetails.type].color}} />
                Détail du log
              </h3>
              <div className="admin-logs-modal-fields">
                <div><strong>Action :</strong> {logDetails.action}</div>
                <div><strong>Utilisateur :</strong> {logDetails.user}</div>
                <div><strong>Détails :</strong> {logDetails.details}</div>
                <div><strong>Type :</strong> <span style={{color: logTypes[logDetails.type].color}}>{logTypes[logDetails.type].label}</span></div>
                <div><strong>Heure :</strong> {logDetails.time}</div>
              </div>
              <button
                type="button"
                className="admin-logs-modal-close-btn"
                onClick={() => setLogDetails(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminJournalisation;
