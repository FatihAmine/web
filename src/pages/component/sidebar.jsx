// src/pages/admin/component/sidebar.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Home,
  Users,
  FileText,
  LogOut,
  Bell,
  Activity,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';                 // ✅ chemin depuis /pages/admin/component
import { auth, signOut as fbSignOut } from '../../firebaseClient';
import './sidebar.css';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/AdminDashboard' },
  { id: 'users', icon: Users, label: 'Utilisateurs', path: '/admin/gestion-utilisateurs' },
  { id: 'documents', icon: FileText, label: 'Documents', path: '/admin/gestion-documents' },
  { id: 'logs', icon: Activity, label: 'Journalisation', path: '/admin/journalisation' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/admin/notifications' },
];

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  onLogout,        // optionnel (callback)
  userData,        // optionnel (valeur de secours avant /admin/me)
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // === état profil admin ===
  const [admin, setAdmin] = useState(() => ({
    firstName: userData?.firstName || '',
    lastName : userData?.lastName  || '',
    role     : userData?.role      || '',
    displayName: userData ? `${userData.firstName ?? ''} ${userData.lastName ?? ''}`.trim() : '',
    profilePic: userData?.profilePic || '',
    email: userData?.email || '',
  }));
  const [loadingMe, setLoadingMe] = useState(false);

  // === ouverture/fermeture persistée ===
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setSidebarOpen(JSON.parse(savedState));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // === onglet actif depuis l’URL ===
  useEffect(() => {
    const currentItem = menuItems.find((item) => item.path === location.pathname);
    if (currentItem) setActiveTab(currentItem.id);
  }, [location.pathname, setActiveTab]);

  // === fetch du profil admin (/api/admin/me) ===
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingMe(true);
        const { data } = await api.get('/admin/me'); // requireAuth + role admin

        if (cancelled) return;

        // Construction des noms
        const firstName =
          data.prenom ??
          data.firstName ??
          (data.displayName ? data.displayName.split(' ')[0] : '') ??
          '';
        const lastName =
          data.nom ??
          data.lastName ??
          (data.displayName ? data.displayName.split(' ').slice(1).join(' ') : '') ??
          '';

        const displayName =
          data.displayName ||
          [data.prenom, data.nom].filter(Boolean).join(' ') ||
          [firstName, lastName].filter(Boolean).join(' ') ||
          data.email ||
          '';

        setAdmin({
          firstName,
          lastName,
          role: (data.role === 'admin' ? 'Administrateur' : data.role) || '',
          displayName,
          profilePic:
            data.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'Admin')}&background=17766e&color=fff&size=200`,
          email: data.email || '',
        });
      } catch (e) {
        if (e?.response?.status === 401 || e?.response?.status === 403) {
          navigate('/admin/login', { replace: true });
          return;
        }
        console.error('GET /admin/me failed', e?.response?.data || e);
      } finally {
        if (!cancelled) setLoadingMe(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // avatar (fallback)
  const avatarUrl = useMemo(() => {
    if (admin.profilePic) return admin.profilePic;
    const name = admin.displayName || 'Admin';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=17766e&color=fff&size=200`;
  }, [admin.profilePic, admin.displayName]);

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

  const handleLogout = async () => {
    // 🔐 Déconnexion Firebase (le SDK invalide le token côté client)
    try { await fbSignOut(auth); } catch (_) {}
    // (Facultatif) nettoyer des clés locales app si tu en as
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    if (onLogout) onLogout();
    navigate('/admin/login', { replace: true });
    // ⚠️ On NE supprime PAS le token FCM ici pour continuer à recevoir les notifications.
  };

  return (
    <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : 'admin-sidebar-closed'}`}>
      {/* Bouton demi-cercle sur le bord droit */}
      <button
        className="admin-toggle-tab-btn"
        onClick={handleToggle}
        aria-label={sidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
      >
        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      <div className="admin-sidebar-content">
        <div className="admin-profile-section">
          <img src={avatarUrl} alt="Profile" className="admin-profile-pic" />
          {sidebarOpen && (
            <div className="admin-profile-info">
              <h3 className="admin-profile-name">
                {loadingMe ? 'Chargement…' : (admin.displayName || `${admin.firstName} ${admin.lastName}` || 'Admin')}
              </h3>
              <p className="admin-profile-role">
                {loadingMe ? '—' : (admin.role || 'Administrateur')}
              </p>
            </div>
          )}
        </div>

        <nav className="admin-menu">
          {menuItems.map((item) => (
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
