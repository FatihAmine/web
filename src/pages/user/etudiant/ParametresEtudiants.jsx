import React, { useState } from 'react';
import {
  Home,
  FileText,
  Upload,
  Clock,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Lock,
  Globe,
  Save,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/etudiant/ParametresEtudiants.css';

const TABS = [
  { key: 'profil', label: 'Profil', icon: <User size={18} /> },
  { key: 'securite', label: 'Sécurité', icon: <Lock size={18} /> },
  { key: 'prefs', label: 'Préférences', icon: <Globe size={18} /> },
];

const ParametresEtudiants = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('settings');
  const [currentSection, setCurrentSection] = useState('profil');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "Mohamed",
    lastName: "Alami",
    email: "mohamed.alami@ynov.ma",
    language: "fr",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/etudiant' },
    { id: 'documents', icon: FileText, label: 'Mes Documents', path: '/etudiant/documents' },
    { id: 'requests', icon: Clock, label: 'Mes Demandes', path: '/etudiant/demandes' },
    { id: 'upload', icon: Upload, label: 'Téléverser', path: '/etudiant/upload' },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/etudiant/notifications' },
    { id: 'settings', icon: Settings, label: 'Paramètres', path: '/etudiant/settings' }
  ];

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
    <div className="params-page">
      {/* Sidebar */}
      <aside className={`params-sidebar ${sidebarOpen ? 'params-sidebar-open' : 'params-sidebar-closed'}`}>
        <div className="params-sidebar-content">
          <div className="params-profile-section">
            <img
              src={`https://ui-avatars.com/api/?name=${form.firstName}+${form.lastName}&background=17766e&color=fff&size=200`}
              alt="Profile"
              className="params-profile-pic"
            />
            {sidebarOpen && (
              <div className="params-profile-info">
                <h3 className="params-profile-name">{form.firstName} {form.lastName}</h3>
                <p className="params-profile-role">Étudiant</p>
              </div>
            )}
          </div>
          <nav className="params-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                }}
                className={`params-menu-item ${activeTab === item.id ? 'params-menu-item-active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
          <button className="params-disconnect-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="params-main-content">
        <header className="params-page-header">
          <button
            className="params-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="params-page-title">Paramètres du compte</h1>
        </header>
        <div className="params-container">
          <div className="params-tabs">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`params-tab-btn${currentSection === tab.key ? ' active' : ''}`}
                onClick={() => setCurrentSection(tab.key)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <form className="params-form-card" onSubmit={handleSave}>
            {currentSection === 'profil' &&
              <div className="params-section">
                <h2 className="params-form-title">Profil étudiant</h2>
                <div className="params-form-block">
                  <div className="params-form-group">
                    <label className="params-form-label">Prénom</label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      disabled={!editing}
                      className="params-form-input"
                      required
                    />
                  </div>
                  <div className="params-form-group">
                    <label className="params-form-label">Nom</label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      disabled={!editing}
                      className="params-form-input"
                      required
                    />
                  </div>
                  <div className="params-form-group">
                    <label className="params-form-label">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled
                      className="params-form-input"
                      required
                    />
                  </div>
                </div>
              </div>
            }
            {currentSection === 'securite' &&
              <div className="params-section">
                <h2 className="params-form-title">Sécurité</h2>
                <div className="params-form-block">
                  <div className="params-form-group">
                    <label className="params-form-label">Nouveau mot de passe</label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={!editing}
                      className="params-form-input"
                      placeholder="Nouveau mot de passe"
                    />
                  </div>
                  <div className="params-form-group">
                    <label className="params-form-label">Confirmer mot de passe</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      disabled={!editing}
                      className="params-form-input"
                      placeholder="Confirmer mot de passe"
                    />
                  </div>
                  <div className="params-form-group">
                    <label className="params-form-label">2FA</label>
                    <select
                      name="2fa"
                      className="params-form-select"
                      disabled={!editing}
                    >
                      <option value="off">Désactivé</option>
                      <option value="email">Email</option>
                      <option value="app">App Authenticator</option>
                    </select>
                  </div>
                </div>
              </div>
            }
            {currentSection === 'prefs' &&
              <div className="params-section">
                <h2 className="params-form-title">Préférences</h2>
                <div className="params-form-block">
                  <div className="params-form-group">
                    <label className="params-form-label">Langue</label>
                    <select
                      name="language"
                      value={form.language}
                      onChange={handleChange}
                      disabled={!editing}
                      className="params-form-select"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>
            }
            <div className="params-form-footer">
              {!editing ? (
                <button
                  type="button"
                  className="params-edit-btn"
                  onClick={() => setEditing(true)}
                >
                  <Settings size={18} />
                  Modifier
                </button>
              ) : (
                <button
                  type="submit"
                  className="params-save-btn"
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

export default ParametresEtudiants;
