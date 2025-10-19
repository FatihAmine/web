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
  ChevronRight,
  Eye,
  EyeOff,
  User,
  Mail,
  Sun,
  Moon,
  Shield,
  Globe,
  Bell as BellIcon
} from 'lucide-react';
import '../../css/admin/ParamètresAdmin.css';

const userData = {
  firstName: "Mohammed",
  lastName: "Alaoui",
  email: "admin@ynov.ma"
};

const AdminParametres = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('settings');
  const [info, setInfo] = useState({firstName: userData.firstName, lastName: userData.lastName, email: userData.email});
  const [showPwd, setShowPwd] = useState(false);
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("fr");
  const [notif, setNotif] = useState(true);
  const [saved, setSaved] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Tableau de bord' },
    { id: 'users', icon: Users, label: 'Gestion Utilisateurs' },
    { id: 'documents', icon: FileText, label: 'Gestion Documents' },
    { id: 'requests', icon: Clock, label: 'Demandes' },
    { id: 'statistics', icon: Bell, label: 'Statistiques' },
    { id: 'logs', icon: Settings, label: 'Journalisation' },
    { id: 'security', icon: Shield, label: 'Sécurité' },
    { id: 'database', icon: FileText, label: 'Base de données' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'settings', icon: Settings, label: 'Paramètres' }
  ];

  function handleInfoChange(e) {
    setInfo({...info, [e.target.name]: e.target.value});
  }
  function handlePwdChange(e) { setPassword(e.target.value); }
  function handleSave(e){
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
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
                <h3 className="admin-profile-name">{info.firstName} {info.lastName}</h3>
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
          <h1 className="admin-page-title">Paramètres</h1>
        </header>
        <div className="admin-content">
          {/* Settings cards */}
          <div className="admin-settings-cards-grid">
            <div className="admin-settings-card">
              <User size={26}/>
              <div>
                <div className="admin-settings-card-label">Nom</div>
                <div className="admin-settings-card-value">{info.firstName} {info.lastName}</div>
              </div>
            </div>
            <div className="admin-settings-card">
              <Mail size={24}/>
              <div>
                <div className="admin-settings-card-label">Email</div>
                <div className="admin-settings-card-value">{info.email}</div>
              </div>
            </div>
            <div className="admin-settings-card">
              <Globe size={24}/>
              <div>
                <div className="admin-settings-card-label">Langue</div>
                <div className="admin-settings-card-value">{lang==="fr"?"Français":"Anglais"}</div>
              </div>
              <select className="admin-settings-lang" value={lang} onChange={e=>setLang(e.target.value)}>
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
              </select>
            </div>
            <div className="admin-settings-card">
              <Sun size={24} style={{display:theme==="dark"?"none":"inline"}}/>
              <Moon size={24} style={{display:theme==="dark"?"inline":"none"}}/>
              <div>
                <div className="admin-settings-card-label">Thème</div>
                <div className="admin-settings-card-value">{theme==="dark"?'Sombre':'Clair'}</div>
              </div>
              <button className="admin-settings-toggle"
                      onClick={()=>setTheme(theme==="dark"?"light":"dark")}>
                {theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}
              </button>
            </div>
            <div className="admin-settings-card">
              <BellIcon size={24}/>
              <div>
                <div className="admin-settings-card-label">Notifications</div>
                <div className="admin-settings-card-value">
                  {notif?"Activées":"Désactivées"}
                </div>
              </div>
              <div>
                <label className="admin-settings-switch">
                  <input type="checkbox" checked={notif} onChange={e=>setNotif(e.target.checked)} />
                  <span className="admin-settings-slider"></span>
                </label>
              </div>
            </div>
          </div>
          {/* Personal Info Form */}
          <form className="admin-settings-form" onSubmit={handleSave}>
            <h3 className="admin-settings-section-title">Informations personnelles</h3>
            <div className="admin-settings-form-row">
              <label>
                Prénom
                <input name="firstName" value={info.firstName} onChange={handleInfoChange} required />
              </label>
              <label>
                Nom
                <input name="lastName" value={info.lastName} onChange={handleInfoChange} required />
              </label>
            </div>
            <label>Email
              <input type="email" name="email" value={info.email} onChange={handleInfoChange} required />
            </label>
            <label>Mot de passe
              <div className="admin-settings-pwdrow">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handlePwdChange}
                  placeholder="Nouveau mot de passe"
                  autoComplete="new-password"
                  minLength={5}
                />
                <button
                  type="button"
                  className="admin-settings-eye"
                  tabIndex={-1}
                  onClick={()=>setShowPwd(!showPwd)}
                  aria-label={showPwd ? "Masquer" : "Afficher"}
                >
                  {showPwd ? <EyeOff size={18}/> : <Eye size={18}/> }
                </button>
              </div>
            </label>
            <button className="admin-settings-save-btn" type="submit">
              Enregistrer
              <ChevronRight size={17} style={{marginLeft:4}}/>
            </button>
            {saved && <span className="admin-settings-save-success">Modifications enregistrées !</span>}
          </form>
        </div>
      </main>
    </div>
  );
};
export default AdminParametres;
