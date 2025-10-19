// src/components/parent/ParametresParents.jsx
import React, { useState } from 'react';
import {
  Home,
  Users,
  FileText,
  Clock,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Save,
  Globe,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/parent/ParametresParents.css';

const TABS = [
  { key: 'profil', label: 'Profil', icon: <User size={18} /> },
  { key: 'prefs', label: 'Préférences', icon: <Globe size={18} /> },
  { key: 'securite', label: 'Sécurité', icon: <Lock size={18} /> }
];

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/parent' },
  { id: 'children', icon: Users, label: 'Mes Enfants', path: '/parent/children' },
  { id: 'documents', icon: FileText, label: 'Documents', path: '/parent/documents' },
  { id: 'requests', icon: Clock, label: 'Demandes', path: '/parent/demandes' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/parent/notifications' },
  { id: 'settings', icon: Settings, label: 'Paramètres', path: '/parent/settings' }
];

const ParametresParents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('settings');
  const [currentSection, setCurrentSection] = useState('profil');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "Fatima",
    lastName: "Bennani",
    email: "fatima.bennani@ynov.ma",
    language: "fr",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleSave = (e) => {
    e.preventDefault();
    setEditing(false);
    // Simulate save logic here
  };

  return (
    <div className="parents-settings-page">
      <aside className={`parent-sidebar ${sidebarOpen ? 'parent-sidebar-open' : 'parent-sidebar-closed'}`}>
        <div className="parent-sidebar-content">
          <div className="parent-profile-section">
            <img
              src={`https://ui-avatars.com/api/?name=${form.firstName}+${form.lastName}&background=17766e&color=fff&size=200`}
              alt="Profile"
              className="parent-profile-pic"
            />
            {sidebarOpen && (
              <div className="parent-profile-info">
                <h3 className="parent-profile-name">{form.firstName} {form.lastName}</h3>
                <p className="parent-profile-role">Parent</p>
              </div>
            )}
          </div>
          <nav className="parent-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                }}
                className={`parent-menu-item ${activeTab === item.id ? 'parent-menu-item-active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
                type="button"
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
          <button className="parent-disconnect-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
      <main className="parent-main-content">
        <header className="parent-header">
          <button
            className="parent-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="parent-page-title">Paramètres du compte</h1>
        </header>
        <div className="parent-settings-container">
          <div className="parent-settings-tabs">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`parent-settings-tab-btn${currentSection === tab.key ? ' active' : ''}`}
                onClick={() => setCurrentSection(tab.key)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <form className="parent-settings-form-card" onSubmit={handleSave}>
            {currentSection === 'profil' &&
              <div className="parent-settings-section">
                <h2 className="parent-settings-form-title">Profil parent</h2>
                <div className="parent-settings-form-block">
                  <div className="parent-settings-form-group">
                    <label className="parent-settings-form-label">Prénom</label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      disabled={!editing}
                      className="parent-settings-form-input"
                      required
                    />
                  </div>
                  <div className="parent-settings-form-group">
                    <label className="parent-settings-form-label">Nom</label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      disabled={!editing}
                      className="parent-settings-form-input"
                      required
                    />
                  </div>
                  <div className="parent-settings-form-group">
                    <label className="parent-settings-form-label">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled
                      className="parent-settings-form-input"
                      required
                    />
                  </div>
                </div>
              </div>
            }
            {currentSection === 'prefs' &&
              <div className="parent-settings-section">
                <h2 className="parent-settings-form-title">Préférences</h2>
                <div className="parent-settings-form-block">
                  <div className="parent-settings-form-group">
                    <label className="parent-settings-form-label">Langue</label>
                    <select
                      name="language"
                      value={form.language}
                      onChange={handleChange}
                      disabled={!editing}
                      className="parent-settings-form-select"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>
            }
            {currentSection === 'securite' &&
              <div className="parent-settings-section">
                <h2 className="parent-settings-form-title">Sécurité du compte</h2>
                <div className="parent-settings-form-block">
                  <div className="parent-settings-form-group">
                    <label className="parent-settings-form-label">Nouveau mot de passe</label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={!editing}
                      className="parent-settings-form-input"
                      placeholder="Nouveau mot de passe"
                    />
                  </div>
                  <div className="parent-settings-form-group">
                    <label className="parent-settings-form-label">Confirmer mot de passe</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      disabled={!editing}
                      className="parent-settings-form-input"
                      placeholder="Confirmer mot de passe"
                    />
                  </div>
                </div>
              </div>
            }
            <div className="parent-settings-form-footer">
              {!editing ? (
                <button
                  type="button"
                  className="parent-settings-edit-btn"
                  onClick={() => setEditing(true)}
                >
                  <Settings size={18} />
                  Modifier
                </button>
              ) : (
                <button
                  type="submit"
                  className="parent-settings-save-btn"
                >
                  <Save size={18} />
                  Sauvegarder
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ParametresParents;
