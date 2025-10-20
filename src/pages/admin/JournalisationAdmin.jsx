import React, { useState } from 'react';
import Sidebar from '../component/sidebar';
import CustomDropdown from '../component/CustomDropdown';
import {
  Menu,
  X,
  Bell,
  Search,
  Filter,
  Activity,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  User,
  Clock
} from 'lucide-react';
import '../../css/admin/JournalisationAdmin.css';
import { useNavigate } from 'react-router-dom';

const userData = {
  firstName: "Mohammed",
  lastName: "Alaoui",
  role: "Super Administrateur",
  profilePic: "https://ui-avatars.com/api/?name=Mohammed+Alaoui&background=17766e&color=fff&size=200"
};

const logTypes = {
  success: { color: "#10b981", label: "Succès", icon: CheckCircle },
  info: { color: "#3b82f6", label: "Info", icon: Info },
  warning: { color: "#f59e0b", label: "Avertissement", icon: AlertTriangle },
  error: { color: "#ef4444", label: "Erreur", icon: XCircle }
};

const sampleLogs = [
  { id: 1, action: "Création utilisateur", user: "Admin", details: "Nouvel étudiant: Ahmed Bennani", time: "Il y a 5 min", type: "success" },
  { id: 2, action: "Modification document", user: "Personnel_01", details: "Bulletin modifié pour Sara Idrissi", time: "Il y a 15 min", type: "info" },
  { id: 3, action: "Suppression demande", user: "Admin", details: "Demande #1234 supprimée", time: "Il y a 30 min", type: "warning" },
  { id: 4, action: "Erreur système", user: "System", details: "Échec de génération PDF", time: "Il y a 1h", type: "error" },
  { id: 5, action: "Export données", user: "Admin", details: "Export base de données complète", time: "Il y a 2h", type: "success" },
  { id: 6, action: "Connexion système", user: "Personnel_02", details: "Authentification réussie", time: "Il y a 3h", type: "success" },
  { id: 7, action: "Tentative accès refusé", user: "Unknown", details: "Tentative d'accès non autorisé", time: "Il y a 4h", type: "error" },
  { id: 8, action: "Mise à jour profil", user: "Étudiant_123", details: "Modification des informations personnelles", time: "Il y a 5h", type: "info" }
];

const AdminJournalisation = () => {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeTab, setActiveTab] = useState('logs');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [logDetails, setLogDetails] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const filterOptions = [
    { value: 'all', label: 'Tous types', icon: Filter, color: '#5eead4' },
    { value: 'success', label: 'Succès', icon: CheckCircle, color: '#10b981' },
    { value: 'info', label: 'Info', icon: Info, color: '#3b82f6' },
    { value: 'warning', label: 'Avertissement', icon: AlertTriangle, color: '#f59e0b' },
    { value: 'error', label: 'Erreur', icon: XCircle, color: '#ef4444' }
  ];

  const filteredLogs = sampleLogs
    .filter(log => filter === 'all' || log.type === filter)
    .filter(log =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase())
    );

  // Stats
  const totalLogs = sampleLogs.length;
  const successLogs = sampleLogs.filter(l => l.type === 'success').length;
  const errorLogs = sampleLogs.filter(l => l.type === 'error').length;
  const warningLogs = sampleLogs.filter(l => l.type === 'warning').length;

  return (
    <div className="admin-logs-container">
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
          className="admin-logs-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`admin-logs-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <button
            className="admin-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="admin-page-title">Journalisation Système</h1>
          <div className="admin-header-actions">
            <button className="admin-search-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <main className="admin-logs-main">
          <section className="admin-logs-content">
            
            {/* Stats Cards */}
            <div className="admin-logs-stats-grid">
              <div className="admin-logs-stat-card stat-total">
                <div className="stat-icon">
                  <Activity size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Total Logs</p>
                  <h3 className="stat-value">{totalLogs}</h3>
                </div>
              </div>
              <div className="admin-logs-stat-card stat-success">
                <div className="stat-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Succès</p>
                  <h3 className="stat-value">{successLogs}</h3>
                </div>
              </div>
              <div className="admin-logs-stat-card stat-warning">
                <div className="stat-icon">
                  <AlertTriangle size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Avertissements</p>
                  <h3 className="stat-value">{warningLogs}</h3>
                </div>
              </div>
              <div className="admin-logs-stat-card stat-error">
                <div className="stat-icon">
                  <XCircle size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Erreurs</p>
                  <h3 className="stat-value">{errorLogs}</h3>
                </div>
              </div>
            </div>

            {/* Toolbar with Custom Dropdown */}
            <div className="admin-logs-toolbar">
              <CustomDropdown
                options={filterOptions}
                value={filter}
                onChange={setFilter}
                icon={Filter}
              />
              <div className="admin-logs-searchrow">
                <Search size={18} />
                <input
                  className="admin-logs-search"
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher logs..."
                  aria-label="Rechercher"
                />
              </div>
            </div>

            {/* Logs Grid */}
            <div className="admin-logs-grid">
              {filteredLogs.length === 0 ? (
                <div className="admin-logs-empty-state">
                  <Activity size={64} />
                  <h3>Aucun log trouvé</h3>
                  <p>Essayez de modifier vos filtres de recherche</p>
                </div>
              ) : (
                filteredLogs.map(log => {
                  const LogIcon = logTypes[log.type].icon;
                  return (
                    <div 
                      key={log.id} 
                      className="admin-logs-card"
                      onClick={() => setLogDetails(log)}
                    >
                      <div className="log-card-header">
                        <div 
                          className="log-icon"
                          style={{ 
                            background: logTypes[log.type].color + '1a',
                            color: logTypes[log.type].color 
                          }}
                        >
                          <LogIcon size={20} />
                        </div>
                        <span 
                          className="log-status"
                          style={{ 
                            background: logTypes[log.type].color + '1a',
                            color: logTypes[log.type].color 
                          }}
                        >
                          {logTypes[log.type].label}
                        </span>
                      </div>
                      <div className="log-card-body">
                        <h3 className="log-title">{log.action}</h3>
                        <p className="log-details">{log.details}</p>
                        <div className="log-meta">
                          <div className="log-meta-item">
                            <User size={14} />
                            <span>{log.user}</span>
                          </div>
                          <div className="log-meta-item">
                            <Clock size={14} />
                            <span>{log.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Log Details Modal */}
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
                  <X size={22} />
                </button>
                <h3 className="admin-logs-modal-title">
                  <Activity size={18} style={{verticalAlign: "middle", marginRight: 8, color: logTypes[logDetails.type].color}} />
                  Détail du log
                </h3>
                <div className="admin-logs-modal-fields">
                  <div className="modal-field">
                    <strong>Action :</strong> 
                    <span>{logDetails.action}</span>
                  </div>
                  <div className="modal-field">
                    <strong>Utilisateur :</strong> 
                    <span>{logDetails.user}</span>
                  </div>
                  <div className="modal-field">
                    <strong>Détails :</strong> 
                    <span>{logDetails.details}</span>
                  </div>
                  <div className="modal-field">
                    <strong>Type :</strong> 
                    <span style={{
                      padding: '0.3rem 0.8rem',
                      borderRadius: '999px',
                      background: logTypes[logDetails.type].color + '1a',
                      color: logTypes[logDetails.type].color,
                      fontWeight: 600,
                      display: 'inline-block'
                    }}>
                      {logTypes[logDetails.type].label}
                    </span>
                  </div>
                  <div className="modal-field">
                    <strong>Heure :</strong> 
                    <span>{logDetails.time}</span>
                  </div>
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
    </div>
  );
};

export default AdminJournalisation;
