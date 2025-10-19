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
  Database,
  BarChart3,
  Shield,
  Activity,
  Eye,
  Trash2,
  CheckCircle,
  AlertTriangle,
  BellOff,
} from 'lucide-react';
import '../../css/admin/NotificationsAdmin.css';

const demoNotifications = [
  { id: 1, type: "info", title: "Sauvegarde réussie", message: "Base de données sauvegardée avec succès.", time: "Il y a 2h", unread: false },
  { id: 2, type: "alert", title: "Disque presque plein", message: "Seuil critique de stockage atteint (90%).", time: "Il y a 1h", unread: true },
  { id: 3, type: "security", title: "Nouvelle connexion", message: "Connexion à partir d'un nouvel appareil.", time: "Il y a 20min", unread: true },
  { id: 4, type: "update", title: "Mise à jour système", message: "Version 1.2 installée.", time: "Il y a 5min", unread: false },
];

const typeIcons = {
  info:   <CheckCircle size={20} color="#10b981" />,
  alert:  <AlertTriangle size={20} color="#f59e0b" />,
  security: <Shield size={20} color="#ef4444" />,
  update: <Database size={20} color="#3b82f6" />
};

const AdminNotifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

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

  function filterNotifications(notifs){
    return notifs
      .filter(n => filter==="all" || n.type===filter)
      .filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.message.toLowerCase().includes(search.toLowerCase()) ||
        n.time.toLowerCase().includes(search.toLowerCase())
      );
  }

  const [notifications, setNotifications] = useState(demoNotifications);

  function toggleRead(id){
    setNotifications(notifications.map(n =>
      n.id===id ? { ...n, unread: !n.unread } : n
    ));
  }
  function handleDelete(id){
    setNotifications(notifications.filter(n => n.id!==id));
    setConfirmDelete(null);
  }

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
          <h1 className="admin-page-title">Notifications</h1>
        </header>
        <div className="admin-content">
          {/* Toolbar */}
          <div className="admin-notif-toolbar">
            <div className="admin-notif-toolbar-filters">
              <Filter size={17} />
              <select value={filter} onChange={e=>setFilter(e.target.value)} className="admin-notif-filter">
                <option value="all">Tous types</option>
                <option value="info">Info</option>
                <option value="alert">Alerte</option>
                <option value="security">Sécurité</option>
                <option value="update">Système</option>
              </select>
            </div>
            <div className="admin-notif-toolbar-actions">
              <div className="admin-notif-searchrow">
                <Search size={16} />
                <input
                  className="admin-notif-search"
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher notification..."
                  aria-label="Rechercher"
                  style={{minWidth:'110px'}}
                />
              </div>
            </div>
          </div>
          {/* Cards */}
          <div className="admin-notif-list">
            {filterNotifications(notifications).length === 0 ? (
              <div className="admin-notif-empty">
                <BellOff size={26} /> Aucune notification trouvée
              </div>
            ) : (
              filterNotifications(notifications).map(notif => (
                <div className={`admin-notif-card${notif.unread?' admin-notif-unread':''}`} key={notif.id}>
                  <div className="admin-notif-card-icon">
                    {typeIcons[notif.type]}
                  </div>
                  <div className="admin-notif-card-info">
                    <div className="admin-notif-card-title">{notif.title}</div>
                    <div className="admin-notif-card-message">{notif.message}</div>
                    <div className="admin-notif-card-time">{notif.time}</div>
                  </div>
                  <div className="admin-notif-card-actions">
                    <button
                      className="admin-notif-action-btn"
                      title={notif.unread ? "Marquer comme lu" : "Marquer comme non lu"}
                      onClick={()=>toggleRead(notif.id)}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      className="admin-notif-action-btn admin-notif-action-delete"
                      title="Supprimer"
                      onClick={()=>setConfirmDelete(notif.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Confirm Delete Popup */}
          {confirmDelete && (
            <div className="admin-notif-modal-backdrop">
              <div className="admin-notif-modal">
                <button className="admin-notif-modal-close" onClick={()=> setConfirmDelete(null)}>
                  <X size={20} />
                </button>
                <h3 className="admin-notif-modal-title">
                  <Trash2 size={18} style={{marginRight:8,color:"#ef4444"}} /> Supprimer la notification
                </h3>
                <div className="admin-notif-modal-fields">
                  Voulez-vous vraiment supprimer cette notification ?
                </div>
                <button
                  className="admin-notif-modal-submit admin-notif-modal-delete"
                  onClick={()=>handleDelete(confirmDelete)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminNotifications;
