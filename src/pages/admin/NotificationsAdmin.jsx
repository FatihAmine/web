import React, { useState } from 'react';
import Sidebar from '../component/sidebar';
import CustomDropdown from '../component/CustomDropdown';
import {
  Menu,
  X,
  Bell,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Shield,
  Database,
  BellOff,
  Clock,
  AlertCircle
} from 'lucide-react';
import '../../css/admin/NotificationsAdmin.css';
import { useNavigate } from 'react-router-dom';

const userData = {
  firstName: "Mohammed",
  lastName: "Alaoui",
  role: "Super Administrateur",
  profilePic: "https://ui-avatars.com/api/?name=Mohammed+Alaoui&background=17766e&color=fff&size=200"
};

const typeIcons = {
  info: CheckCircle,
  alert: AlertTriangle,
  security: Shield,
  update: Database
};

const typeColors = {
  info: "#10b981",
  alert: "#f59e0b",
  security: "#ef4444",
  update: "#3b82f6"
};

const demoNotifications = [
  { id: 1, type: "info", title: "Sauvegarde réussie", message: "Base de données sauvegardée avec succès.", time: "Il y a 10 min", unread: false },
  { id: 2, type: "alert", title: "Disque presque plein", message: "Seuil critique de stockage atteint (90%).", time: "Il y a 20min", unread: true },
  { id: 3, type: "security", title: "Nouvelle connexion", message: "Connexion à partir d'un nouvel appareil.", time: "Il y a 30 min", unread: true },
  { id: 4, type: "update", title: "Mise à jour système", message: "Version 1.2 installée.", time: "Il y a 1 h", unread: false },
  { id: 5, type: "info", title: "Document généré", message: "Attestation créée pour Ahmed Bennani.", time: "Il y a 2 h", unread: true },
  { id: 6, type: "alert", title: "Tentative échouée", message: "Échec de génération PDF pour Sara Idrissi.", time: "Il y a 3 h", unread: false },
];

const AdminNotifications = () => {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeTab, setActiveTab] = useState('notifications');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [notifications, setNotifications] = useState(demoNotifications);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const filterOptions = [
    { value: 'all', label: 'Tous types', icon: Filter, color: '#5eead4' },
    { value: 'info', label: 'Info', icon: CheckCircle, color: '#10b981' },
    { value: 'alert', label: 'Alerte', icon: AlertTriangle, color: '#f59e0b' },
    { value: 'security', label: 'Sécurité', icon: Shield, color: '#ef4444' },
    { value: 'update', label: 'Système', icon: Database, color: '#3b82f6' }
  ];

  function filterNotifications(notifs) {
    return notifs
      .filter(n => filter === "all" || n.type === filter)
      .filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.message.toLowerCase().includes(search.toLowerCase()) ||
        n.time.toLowerCase().includes(search.toLowerCase())
      );
  }

  function toggleRead(id) {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, unread: !n.unread } : n
    ));
  }

  function handleDelete(id) {
    setNotifications(notifications.filter(n => n.id !== id));
    setConfirmDelete(null);
  }

  function markAllAsRead() {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  }

  // Stats
  const totalNotifs = notifications.length;
  const unreadNotifs = notifications.filter(n => n.unread).length;
  const infoNotifs = notifications.filter(n => n.type === 'info').length;
  const alertNotifs = notifications.filter(n => n.type === 'alert').length;

  return (
    <div className="admin-notif-container">
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
          className="admin-notif-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`admin-notif-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <button
            className="admin-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="admin-page-title">Notifications</h1>
          <div className="admin-header-actions">
            <button className="admin-search-btn" aria-label="Notifications">
              <Bell size={20} />
              {unreadNotifs > 0 && <span className="notification-badge"></span>}
            </button>
          </div>
        </header>

        <main className="admin-notif-main">
          <section className="admin-notif-content">
            
            {/* Stats Cards */}
            <div className="admin-notif-stats-grid">
              <div className="admin-notif-stat-card stat-total">
                <div className="stat-icon">
                  <Bell size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Total Notifications</p>
                  <h3 className="stat-value">{totalNotifs}</h3>
                </div>
              </div>
              <div className="admin-notif-stat-card stat-unread">
                <div className="stat-icon">
                  <AlertCircle size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Non Lues</p>
                  <h3 className="stat-value">{unreadNotifs}</h3>
                </div>
              </div>
              <div className="admin-notif-stat-card stat-info">
                <div className="stat-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Info</p>
                  <h3 className="stat-value">{infoNotifs}</h3>
                </div>
              </div>
              <div className="admin-notif-stat-card stat-alert">
                <div className="stat-icon">
                  <AlertTriangle size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Alertes</p>
                  <h3 className="stat-value">{alertNotifs}</h3>
                </div>
              </div>
            </div>

            {/* Toolbar with Custom Dropdown */}
            <div className="admin-notif-toolbar">
              <CustomDropdown
                options={filterOptions}
                value={filter}
                onChange={setFilter}
                icon={Filter}
              />
              <div className="admin-notif-searchrow">
                <Search size={18} />
                <input
                  className="admin-notif-search"
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher notifications..."
                  aria-label="Rechercher"
                />
              </div>
              {unreadNotifs > 0 && (
                <button className="admin-notif-mark-all-btn" onClick={markAllAsRead}>
                  <CheckCircle size={18} />
                  <span>Tout marquer lu</span>
                </button>
              )}
            </div>

            {/* Notifications Grid */}
            <div className="admin-notif-grid">
              {filterNotifications(notifications).length === 0 ? (
                <div className="admin-notif-empty-state">
                  <BellOff size={64} />
                  <h3>Aucune notification trouvée</h3>
                  <p>Essayez de modifier vos filtres de recherche</p>
                </div>
              ) : (
                filterNotifications(notifications).map(notif => {
                  const NotifIcon = typeIcons[notif.type];
                  const iconColor = typeColors[notif.type];
                  return (
                    <div
                      key={notif.id}
                      className={`admin-notif-card ${notif.unread ? 'admin-notif-unread' : ''}`}
                    >
                      <div className="notif-card-header">
                        <div
                          className="notif-icon"
                          style={{
                            background: iconColor + '1a',
                            color: iconColor
                          }}
                        >
                          <NotifIcon size={20} />
                        </div>
                        {notif.unread && <span className="notif-unread-badge">Nouveau</span>}
                      </div>
                      <div className="notif-card-body">
                        <h3 className="notif-title">{notif.title}</h3>
                        <p className="notif-message">{notif.message}</p>
                        <div className="notif-meta">
                          <div className="notif-meta-item">
                            <Clock size={14} />
                            <span>{notif.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="notif-card-footer">
                        <button
                          className="notif-action-btn view"
                          title={notif.unread ? "Marquer comme lu" : "Marquer comme non lu"}
                          onClick={() => toggleRead(notif.id)}
                        >
                          <Eye size={16} />
                          <span>{notif.unread ? 'Marquer lu' : 'Non lu'}</span>
                        </button>
                        <button
                          className="notif-action-btn delete"
                          title="Supprimer"
                          onClick={() => setConfirmDelete(notif.id)}
                        >
                          <Trash2 size={16} />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Delete Confirmation Modal */}
          {confirmDelete && (
            <div className="admin-notif-modal-backdrop">
              <div className="admin-notif-modal">
                <button
                  className="admin-notif-modal-close"
                  onClick={() => setConfirmDelete(null)}
                >
                  <X size={22} />
                </button>
                <h3 className="admin-notif-modal-title">
                  <Trash2 size={18} style={{ verticalAlign: "middle", marginRight: 8, color: "#ef4444" }} />
                  Supprimer la notification
                </h3>
                <div className="admin-notif-modal-fields">
                  Voulez-vous vraiment supprimer cette notification ?
                </div>
                <button
                  className="admin-notif-modal-submit admin-notif-modal-delete"
                  onClick={() => handleDelete(confirmDelete)}
                >
                  <Trash2 size={15} style={{ verticalAlign: "middle", marginRight: 5 }} />
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminNotifications;
