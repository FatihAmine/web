import React, { useEffect } from 'react';
import {
  Home,
  Users,
  FileText,
  LogOut,
  Bell, 
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './sidebar.css';

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/AdminDashboard' },
  { id: 'users', icon: Users, label: 'Utilisateurs', path: '/admin/gestion-utilisateurs' },
  { id: 'documents', icon: FileText, label: 'Documents', path: '/admin/gestion-documents' },
  { id: 'logs', icon: Activity, label: 'Journalisation', path: '/admin/journalisation' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/admin/notifications' }
];

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  onLogout,
  userData,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      const isOpen = JSON.parse(savedState);
      setSidebarOpen(isOpen);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => item.path === currentPath);
    if (currentItem) {
      setActiveTab(currentItem.id);
    }
  }, [location.pathname, setActiveTab]);

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
    
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleToggle = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    if (onLogout) {
      onLogout();
    }
    
    navigate('/admin');
  };

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
          <img src={userData.profilePic} alt="Profile" className="admin-profile-pic" />
          {sidebarOpen && (
            <div className="admin-profile-info">
              <h3 className="admin-profile-name">{userData.firstName} {userData.lastName}</h3>
              <p className="admin-profile-role">{userData.role}</p>
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
