import React, { useState } from 'react';
import Sidebar from '../../component/sidebaretudiant';
import {
  Bell,
  Menu,
  X,
  User,
  Lock,
  Globe,
  Save,
  Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/etudiant/ParametresEtudiants.css';

const TABS = [
  { key: 'profil', label: 'Profil', icon: User },
  { key: 'securite', label: 'Sécurité', icon: Lock },
];

const ParametresEtudiants = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [activeTab, setActiveTab] = useState('settings');
  const [currentSection, setCurrentSection] = useState('profil');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "Mohamed",
    lastName: "Alami",
    email: "mohamed.alami@ynov.ma",
    language: "fr",
    twoFactor: "off",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const userData = {
    firstName: form.firstName,
    lastName: form.lastName,
    role: "Étudiant",
    profilePic: `https://ui-avatars.com/api/?name=${form.firstName}+${form.lastName}&background=17766e&color=fff&size=200`
  };

  const handleLogout = () => {
    navigate('/etudiant/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setEditing(false);
    console.log('Settings saved:', form);
  };

  return (
    <div className="params-page">
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
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className={`params-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="params-page-header">
          <button
            className="params-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="params-page-title">Paramètres du compte</h1>
          <div className="params-header-actions">
            <button className="params-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="params-container">
          {/* Tabs */}
          <div className="params-tabs">
            {TABS.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.key}
                  className={`params-tab-btn${currentSection === tab.key ? ' active' : ''}`}
                  onClick={() => setCurrentSection(tab.key)}
                >
                  <TabIcon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Card */}
          <form className="params-form-card" onSubmit={handleSave}>
            {currentSection === 'profil' && (
              <div className="params-section">
                <h2 className="params-form-title">
                  <User size={20} style={{verticalAlign: 'middle', marginRight: '8px', color: '#5eead4'}} />
                  Profil étudiant
                </h2>
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
                    <span className="params-form-hint">L'email ne peut pas être modifié</span>
                  </div>
                </div>
              </div>
            )}

            {currentSection === 'securite' && (
              <div className="params-section">
                <h2 className="params-form-title">
                  <Lock size={20} style={{verticalAlign: 'middle', marginRight: '8px', color: '#5eead4'}} />
                  Sécurité du compte
                </h2>
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
                      placeholder="••••••••"
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
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="params-form-group">
                    <label className="params-form-label">Authentification à deux facteurs (2FA)</label>
                    <select
                      name="twoFactor"
                      value={form.twoFactor}
                      onChange={handleChange}
                      disabled={!editing}
                      className="params-form-select"
                    >
                      <option value="off">Désactivé</option>
                      <option value="email">Par Email</option>
                      <option value="app">Application Authenticator</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentSection === 'prefs' && (
              <div className="params-section">
                <h2 className="params-form-title">
                  <Globe size={20} style={{verticalAlign: 'middle', marginRight: '8px', color: '#5eead4'}} />
                  Préférences
                </h2>
                <div className="params-form-block">
                  <div className="params-form-group">
                    <label className="params-form-label">Langue de l'interface</label>
                    <select
                      name="language"
                      value={form.language}
                      onChange={handleChange}
                      disabled={!editing}
                      className="params-form-select"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="params-form-footer">
              {!editing ? (
                <button
                  type="button"
                  className="params-edit-btn"
                  onClick={() => setEditing(true)}
                >
                  <Edit size={18} />
                  <span>Modifier</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="params-cancel-btn"
                    onClick={() => {
                      setEditing(false);
                      setForm({
                        firstName: "Mohamed",
                        lastName: "Alami",
                        email: "mohamed.alami@ynov.ma",
                        language: "fr",
                        twoFactor: "off",
                        password: "",
                        confirmPassword: ""
                      });
                    }}
                  >
                    <X size={18} />
                    <span>Annuler</span>
                  </button>
                  <button
                    type="submit"
                    className="params-save-btn"
                  >
                    <Save size={18} />
                    <span>Sauvegarder</span>
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ParametresEtudiants;
