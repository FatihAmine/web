// src/components/personnel/ParametresPersonnel.jsx
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
  User,
  Save,
  Globe,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/personnel/ParametresPersonnel.css';

const TABS = [
  { key: 'profil', label: 'Profil', icon: <User size={18} /> },
  { key: 'prefs', label: 'Préférences', icon: <Globe size={18} /> },
  { key: 'securite', label: 'Sécurité', icon: <Lock size={18} /> }
];

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/personnel' },
  { id: 'requests', icon: Clock, label: 'Demandes', path: '/personnel/demandes' },
  { id: 'documents', icon: FileText, label: 'Gestion Documents', path: '/personnel/documents' },
  { id: 'students', icon: Users, label: 'Étudiants', path: '/personnel/students' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/personnel/notifications' },
  { id: 'settings', icon: Settings, label: 'Paramètres', path: '/personnel/settings' }
];

const ParametresPersonnel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('settings');
  const [currentSection, setCurrentSection] = useState('profil');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "Karim",
    lastName: "El Amrani",
    email: "karim.elamrani@ynov.ma",
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
    <div className="personnel-settings-page">
      <aside className={`personnel-sidebar ${sidebarOpen ? 'personnel-sidebar-open' : 'personnel-sidebar-closed'}`}>
        <div className="personnel-sidebar-content">
          <div className="personnel-profile-section">
            <img
              src={`https://ui-avatars.com/api/?name=${form.firstName}+${form.lastName}&background=17766e&color=fff&size=200`}
              alt="Profile"
              className="personnel-profile-pic"
            />
            {sidebarOpen && (
              <div className="personnel-profile-info">
                <h3 className="personnel-profile-name">{form.firstName} {form.lastName}</h3>
                <p className="personnel-profile-role">Personnel</p>
              </div>
            )}
          </div>
          <nav className="personnel-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                }}
                className={`personnel-menu-item ${activeTab === item.id ? 'personnel-menu-item-active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
                type="button"
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
          <button className="personnel-disconnect-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
      <main className="personnel-main-content">
        <header className="personnel-header">
          <button
            className="personnel-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="personnel-page-title">Paramètres du compte</h1>
        </header>
        <div className="personnel-settings-container">
          <div className="personnel-settings-tabs">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`personnel-settings-tab-btn${currentSection === tab.key ? ' active' : ''}`}
                onClick={() => setCurrentSection(tab.key)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <form className="personnel-settings-form-card" onSubmit={handleSave}>
            {currentSection === 'profil' &&
              <div className="personnel-settings-section">
                <h2 className="personnel-settings-form-title">Profil personnel</h2>
                <div className="personnel-settings-form-block">
                  <div className="personnel-settings-form-group">
                    <label className="personnel-settings-form-label">Prénom</label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      disabled={!editing}
                      className="personnel-settings-form-input"
                      required
                    />
                  </div>
                  <div className="personnel-settings-form-group">
                    <label className="personnel-settings-form-label">Nom</label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      disabled={!editing}
                      className="personnel-settings-form-input"
                      required
                    />
                  </div>
                  <div className="personnel-settings-form-group">
                    <label className="personnel-settings-form-label">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled
                      className="personnel-settings-form-input"
                      required
                    />
                  </div>
                </div>
              </div>
            }
            {currentSection === 'prefs' &&
              <div className="personnel-settings-section">
                <h2 className="personnel-settings-form-title">Préférences</h2>
                <div className="personnel-settings-form-block">
                  <div className="personnel-settings-form-group">
                    <label className="personnel-settings-form-label">Langue</label>
                    <select
                      name="language"
                      value={form.language}
                      onChange={handleChange}
                      disabled={!editing}
                      className="personnel-settings-form-select"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>
            }
            {currentSection === 'securite' &&
              <div className="personnel-settings-section">
                <h2 className="personnel-settings-form-title">Sécurité du compte</h2>
                <div className="personnel-settings-form-block">
                  <div className="personnel-settings-form-group">
                    <label className="personnel-settings-form-label">Nouveau mot de passe</label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={!editing}
                      className="personnel-settings-form-input"
                      placeholder="Nouveau mot de passe"
                    />
                  </div>
                  <div className="personnel-settings-form-group">
                    <label className="personnel-settings-form-label">Confirmer mot de passe</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      disabled={!editing}
                      className="personnel-settings-form-input"
                      placeholder="Confirmer mot de passe"
                    />
                  </div>
                </div>
              </div>
            }
            <div className="personnel-settings-form-footer">
              {!editing ? (
                <button
                  type="button"
                  className="personnel-settings-edit-btn"
                  onClick={() => setEditing(true)}
                >
                  <Settings size={18} />
                  Modifier
                </button>
              ) : (
                <button
                  type="submit"
                  className="personnel-settings-save-btn"
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

export default ParametresPersonnel;
