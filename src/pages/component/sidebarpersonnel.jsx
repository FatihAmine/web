// src/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import {
  Home,
  FileText,
  LogOut,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './sidebar.css';

// ✅ axios (ajoute l'ID token Firebase) + Firebase
import api from '../../api';               
import { signOut } from '../../firebaseClient';

const menuItems = [
  { id: 'dashboard',     icon: Home,     label: 'Tableau de bord', path: '/personnel' },
  { id: 'documents',     icon: FileText, label: 'Documents',       path: '/personnel/documents' },
  { id: 'notifications', icon: Bell,     label: 'Notifications',   path: '/personnel/notifications' },
  { id: 'settings',      icon: Settings, label: 'Paramètres',      path: '/personnel/settings' }
];

// Helpers
function fullNameFromMe(me) {
  const prenom = (me?.prenom || '').trim();
  const nom    = (me?.nom || '').trim();
  if (prenom || nom) return `${prenom}${nom ? ` ${nom}` : ''}`.trim();
  if (me?.displayName) return me.displayName;
  if (me?.email) return me.email.split('@')[0];
  return '';
}

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 utilisateur courant depuis /api/me
  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);

  // ------- State persistence (comme ton code) -------
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      const isOpen = JSON.parse(savedState);
      setSidebarOpen(isOpen);
    }
  }, [setSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // ------- Active tab depuis l'URL -------
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath);
    if (currentItem) setActiveTab(currentItem.id);
  }, [location.pathname, setActiveTab]);

  // ------- Charger /api/me (toujours la source de vérité) -------
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/me'); // token ajouté par l'intercepteur axios
        if (mounted) setMe(data);
      } catch (e) {
        if (mounted) setMe(null);
      } finally {
        if (mounted) setLoadingMe(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  const handleToggle = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };

  // 🔓 Logout: ne pas désinscrire le token FCM (tu veux continuer à recevoir les notifications)
  const handleLogout = async () => {
    try { await signOut(); } catch (_) {}
    if (onLogout) onLogout();
    // facultatif: nettoyer d'anciens mocks
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  // Données d'affichage à partir de "me"
  const fullName = fullNameFromMe(me);
  const role     = me?.role || '';
  const photoURL = me?.photoURL || '/avatar.png'; // on garde le profil <img> comme tu veux

  return (
    <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : 'admin-sidebar-closed'}`}>
      {/* Half-circle toggle button on right edge */}
      <button
        className="admin-toggle-tab-btn"
        onClick={handleToggle}
        aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      <div className="admin-sidebar-content">
        <div className="admin-profile-section">
          {/* 👇 garde l'image de profil telle quelle, mais source = utilisateur courant */}
          <img src={photoURL} alt="Profile" className="admin-profile-pic" />
          {sidebarOpen && (
            <div className="admin-profile-info">
              <h3 className="admin-profile-name">
                {loadingMe ? '…' : fullName}
              </h3>
              <p className="admin-profile-role">
                {loadingMe ? '' : role}
              </p>
            </div>
          )}
        </div>

        <nav className="admin-menu">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`admin-menu-item ${activeTab === item.id ? 'admin-menu-item-active' : ''}`}
              title={!sidebarOpen ? item.label : ''}
              aria-label={item.label}
            >
              <item.icon size={22} className="menu-icon" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className="admin-disconnect-btn" onClick={handleLogout}>
          <LogOut size={22} className="menu-icon" />
          {sidebarOpen && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
