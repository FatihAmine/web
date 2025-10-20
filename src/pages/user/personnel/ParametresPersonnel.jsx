import React, { useState } from 'react';
import Sidebar from '../../component/sidebarpersonnel';
import {
  Bell,
  Menu,
  X,
  User,
  Save,
  Globe,
  Lock,
  Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/personnel/ParametresPersonnel.css';

const TABS = [
  { key: 'profil', label: 'Profil', icon: User },
  { key: 'securite', label: 'Sécurité', icon: Lock }
];

const ParametresPersonnel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
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

  const userData = {
    firstName: form.firstName,
    lastName: form.lastName,
    role: "Personnel Administratif",
    profilePic: `https://ui-avatars.com/api/?name=${form.firstName}+${form.lastName}&background=17766e&color=fff&size=200`
  };

  const handleLogout = () => {
    navigate('/personnel/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setEditing(false);
    // Simulate save logic here
    console.log('Settings saved:', form);
  };

  return (
    <div className="personnel-settings-page">
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

      <main className={`personnel-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="personnel-header">
          <button 
            className="personnel-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="personnel-page-title">Paramètres du compte</h1>
          <div className="personnel-header-actions">
            <button className="personnel-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="personnel-settings-container">
          {/* Tabs Navigation */}
          <div className="personnel-settings-tabs">
            {TABS.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.key}
                  className={`personnel-settings-tab-btn${currentSection === tab.key ? ' active' : ''}`}
                  onClick={() => setCurrentSection(tab.key)}
                >
                  <TabIcon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Card */}
          <form className="personnel-settings-form-card" onSubmit={handleSave}>
            {currentSection === 'profil' && (
              <div className="personnel-settings-section">
                <h2 className="personnel-settings-form-title">
                  <User size={20} style={{verticalAlign: 'middle', marginRight: '8px', color: '#5eead4'}} />
                  Profil personnel
                </h2>
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
                    <span className="personnel-settings-form-hint">L'email ne peut pas être modifié</span>
                  </div>
                </div>
              </div>
            )}

            {currentSection === 'prefs' && (
              <div className="personnel-settings-section">
                <h2 className="personnel-settings-form-title">
                  <Globe size={20} style={{verticalAlign: 'middle', marginRight: '8px', color: '#5eead4'}} />
                  Préférences
                </h2>
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
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentSection === 'securite' && (
              <div className="personnel-settings-section">
                <h2 className="personnel-settings-form-title">
                  <Lock size={20} style={{verticalAlign: 'middle', marginRight: '8px', color: '#5eead4'}} />
                  Sécurité du compte
                </h2>
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
                      placeholder="••••••••"
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
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="personnel-settings-form-footer">
              {!editing ? (
                <button
                  type="button"
                  className="personnel-settings-edit-btn"
                  onClick={() => setEditing(true)}
                >
                  <Edit size={18} />
                  <span>Modifier</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="personnel-settings-cancel-btn"
                    onClick={() => {
                      setEditing(false);
                      setForm({
                        firstName: "Karim",
                        lastName: "El Amrani",
                        email: "karim.elamrani@ynov.ma",
                        language: "fr",
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
                    className="personnel-settings-save-btn"
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

export default ParametresPersonnel;
