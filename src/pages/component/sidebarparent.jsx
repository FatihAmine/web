// src/components/parent/Sidebar.jsx  (ou remplace ton fichier existant)
import React, { useEffect, useState } from 'react';
import {
  Home,
  Users,
  FileText,
  LogOut,
  Bell,
  Settings,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './sidebar.css';

import api from '../../api';                // <-- adapte le chemin si besoin
import { signOut } from '../../firebaseClient'; // <-- adapte le chemin si besoin

const menuItems = [
  { id: 'dashboard',   icon: Home,   label: 'Tableau de bord', path: '/parent' },
  { id: 'children',    icon: Users,  label: 'Mes Enfants',     path: '/parent/children' },
  { id: 'documents',   icon: FileText, label: 'Documents',     path: '/parent/documents' },
  { id: 'requests',    icon: Clock,  label: 'Demandes',        path: '/parent/demandes' },
  { id: 'notifications', icon: Bell, label: 'Notifications',   path: '/parent/notifications' },
  { id: 'settings',    icon: Settings, label: 'Paramètres',    path: '/parent/settings' }
];

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // -- utilisateur courant depuis /api/me --
  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);

  // Charger /api/me (source de vérité)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/me'); // { prenom, nom, role, photoURL, ... }
        if (mounted) setMe(data);
      } catch (e) {
        if (mounted) setMe(null); // 401 => ton interceptor peut rediriger vers /login
      } finally {
        if (mounted) setLoadingMe(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // -- persistance état du volet --
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

  // -- onglet actif depuis l'URL --
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath);
    if (currentItem) setActiveTab(currentItem.id);
  }, [location.pathname, setActiveTab]);

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

  // Logout sans désinscrire le token FCM
  const handleLogout = async () => {
    try { await signOut(); } catch (_) {}
    if (onLogout) onLogout();
    // nettoyages locaux éventuels
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  // -- affichage depuis "me" --
  const firstName = (me?.prenom || '').trim();
  const lastName  = (me?.nom || '').trim();
  const fullName  = loadingMe ? '…' : (firstName || lastName ? `${firstName}${lastName ? ` ${lastName}` : ''}` : (me?.displayName || me?.email?.split('@')[0] || ''));
  const role      = loadingMe ? '' : (me?.role || '');
  const photoURL  = (me?.photoURL && me.photoURL.trim()) ? me.photoURL : '/avatar.png';

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
          {/* Image de profil: on garde exactement ton balisage */}
          <img src={photoURL} alt="Profile" className="admin-profile-pic" />
          {sidebarOpen && (
            <div className="admin-profile-info">
              <h3 className="admin-profile-name">{fullName}</h3>
              <p className="admin-profile-role">{role}</p>
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
