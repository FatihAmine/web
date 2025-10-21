// src/pages/admin/AdminUsers.jsx
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../component/sidebar';
import {
  Menu, X, Bell, Search, UserPlus, Users, UserCheck, UserX, Clock,
  Mail, Shield, Trash2, Edit, Check
} from 'lucide-react';
import '../../css/admin/GestionUtilisateursAdmin.css';

const userData = {
  firstName: "Mohammed",
  lastName: "Alaoui",
  role: "Super Administrateur",
  profilePic: "https://ui-avatars.com/api/?name=Mohammed+Alaoui&background=17766e&color=fff&size=200"
};

const NIVEAUX = ['B1', 'B2', 'B3', 'M1', 'M2'];

/** Dropdown multi (style = comme un select), options = [{id,label}] */
function StudentMultiDropdown({ label = 'Étudiants', options, value, onChange, placeholder = 'Sélectionner…' }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const selected = options.filter(o => value.includes(o.id));
  const text = selected.length ? selected.map(o => o.label).join(', ') : '';

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="dropdown-field" ref={ref}>
      <label className="dropdown-label">{label}</label>
      <div
        className={`dropdown-control ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`dropdown-value ${text ? '' : 'placeholder'}`}>
          {text || placeholder}
        </span>
        <span className="dropdown-caret">▾</span>
      </div>

      {open && (
        <div className="dropdown-panel">
          <input
            className="dropdown-search"
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div role="listbox" className="dropdown-options">
            {filtered.length === 0 && (
              <div className="dropdown-empty">Aucun résultat</div>
            )}
            {filtered.map(opt => {
              const active = value.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  className={`dropdown-option ${active ? 'active' : ''}`}
                  role="option"
                  aria-selected={active}
                  onClick={() => toggle(opt.id)}
                >
                  <span className={`checkbox ${active ? 'checked' : ''}`}>
                    {active && <Check size={14} />}
                  </span>
                  <span>{opt.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const AdminUsers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeTab, setActiveTab] = useState('users');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [query, setQuery] = useState('');

  const [users, setUsers] = useState([
    { id: 1, displayName: "Ahmed Bennani", role: "Étudiant", emailLogin: "ahmed.b@ynov.ma", email: "ahmed@gmail.com", status: "active", filiere: "Info", niveau: "M1" },
    { id: 2, displayName: "Fatima Idrissi", role: "Parent", emailLogin: "fatima.i@ynov.ma", email: "fatima.i@gmail.com", status: "active", parentOf: ['uidDemo1'] },
    { id: 3, displayName: "Karim Tazi", role: "Personnel", emailLogin: "karim.t@ynov.ma", email: "karim.t@gmail.com", status: "inactive" },
  ]);

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    emailLogin: '',
    email: '',
    role: '',
    filiere: '',
    niveau: '',
    parentOf: []
  });

  // placeholder pour l’instant (branchera sur GET /api/users/etudiants/min)
  const [studentOptions] = useState([
    { id: 'uidDemo1', label: 'Sara El Amrani' },
    { id: 'uidDemo2', label: 'Omar Belkhir' },
    { id: 'uidDemo3', label: 'Yassine El Idrissi' },
  ]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'admin-users-status-active';
      case 'pending': return 'admin-users-status-pending';
      case 'inactive': return 'admin-users-status-inactive';
      default: return '';
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'inactive': return 'Inactif';
      default: return status;
    }
  };

  const filteredUsers = users.filter(u =>
    (u.displayName || '').toLowerCase().includes(query.toLowerCase()) ||
    (u.emailLogin || '').toLowerCase().includes(query.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(query.toLowerCase())
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      setForm(prev => ({
        ...prev,
        role: value,
        filiere: value === 'Étudiant' ? prev.filiere : '',
        niveau: value === 'Étudiant' ? prev.niveau : '',
        parentOf: value === 'Parent' ? prev.parentOf : []
      }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!form.prenom || !form.nom || !form.emailLogin || !form.email || !form.role) {
      alert('Remplis prénom, nom, Login email, Email et Rôle.');
      return;
    }
    if (form.role === 'Étudiant' && (!form.filiere || !form.niveau)) {
      alert('Pour Étudiant, filière et niveau sont requis.');
      return;
    }
    if (form.role === 'Parent' && (!form.parentOf || form.parentOf.length === 0)) {
      alert('Pour Parent, choisis au moins un étudiant.');
      return;
    }
    const displayName = `${form.prenom} ${form.nom}`.trim();
    const newUser = {
      id: Date.now(),
      displayName,
      role: form.role,
      emailLogin: form.emailLogin,
      email: form.email,
      status: 'pending',
      ...(form.role === 'Étudiant' ? { filiere: form.filiere, niveau: form.niveau } : {}),
      ...(form.role === 'Parent' ? { parentOf: form.parentOf } : {})
    };
    setUsers(prev => prev.concat(newUser));
    setForm({
      prenom: '',
      nom: '',
      emailLogin: '',
      email: '',
      role: '',
      filiere: '',
      niveau: '',
      parentOf: []
    });
    setModalOpen(false);
  };

  const openEditModal = (user) => setEditUser({ ...user });
  const handleEditChange = (e) => setEditUser({ ...editUser, [e.target.name]: e.target.value });
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === editUser.id ? { ...u, ...editUser } : u));
    setEditUser(null);
  };
  const openViewModal = (user) => setViewUser(user);
  const openDeleteModal = (user) => setDeleteUser(user);
  const handleDelete = () => {
    setUsers(users.filter(u => u.id !== deleteUser.id));
    setDeleteUser(null);
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;

  return (
    <div className="admin-users-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => console.log('Logout')}
        userData={userData}
      />

      {sidebarOpen && <div className="admin-users-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className={`admin-users-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <button className="admin-toggle-sidebar-btn mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="admin-page-title">Gestion Utilisateurs</h1>
          <div className="admin-header-actions">
            <button className="admin-search-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <main className="admin-users-main">
          <section className="admin-users-content">
            {/* Stats */}
            <div className="admin-users-stats-grid">
              <div className="admin-users-stat-card stat-total"><div className="stat-icon"><Users size={24} /></div><div className="stat-info"><p className="stat-label">Total Utilisateurs</p><h3 className="stat-value">{totalUsers}</h3></div></div>
              <div className="admin-users-stat-card stat-active"><div className="stat-icon"><UserCheck size={24} /></div><div className="stat-info"><p className="stat-label">Actifs</p><h3 className="stat-value">{activeUsers}</h3></div></div>
              <div className="admin-users-stat-card stat-pending"><div className="stat-icon"><Clock size={24} /></div><div className="stat-info"><p className="stat-label">En Attente</p><h3 className="stat-value">{pendingUsers}</h3></div></div>
              <div className="admin-users-stat-card stat-inactive"><div className="stat-icon"><UserX size={24} /></div><div className="stat-info"><p className="stat-label">Inactifs</p><h3 className="stat-value">{inactiveUsers}</h3></div></div>
            </div>

            {/* Toolbar */}
            <div className="admin-users-toolbar">
              <button className="admin-users-add-btn" onClick={() => setModalOpen(true)}>
                <UserPlus size={20} /><span>Ajouter utilisateur</span>
              </button>
              <div className="admin-users-searchbox">
                <Search size={18} />
                <input className="admin-users-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher utilisateurs..." aria-label="Rechercher" />
              </div>
            </div>

            {/* Users Grid */}
            <div className="admin-users-grid">
              {filteredUsers.length === 0 ? (
                <div className="admin-users-empty-state">
                  <Users size={64} />
                  <h3>Aucun utilisateur trouvé</h3>
                  <p>Essayez de modifier vos critères de recherche</p>
                </div>
              ) : (
                filteredUsers.map(user => (
                  <div key={user.id} className="admin-users-card">
                    <div className="user-card-header">
                      <div className="user-avatar">{(user.displayName || 'U').charAt(0)}</div>
                      <span className={`user-status ${getStatusClass(user.status || 'pending')}`}>{getStatusText(user.status || 'pending')}</span>
                    </div>
                    <div className="user-card-body">
                      <h3 className="user-name">{user.displayName}</h3>
                      <div className="user-meta">
                        <div className="user-meta-item"><Shield size={14} /><span className="user-role">{user.role}</span></div>
                        <div className="user-meta-item"><Mail size={14} /><span className="user-email">{user.emailLogin}</span></div>
                      </div>
                    </div>
                    <div className="user-card-footer">
                      <button className="user-action-btn edit" onClick={() => setEditUser(user)}><Edit size={16} /><span>Modifier</span></button>
                      <button className="user-action-btn delete" onClick={() => setDeleteUser(user)}><Trash2 size={16} /><span>Supprimer</span></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* MODALS */}
          {modalOpen && (
            <div className="admin-users-modal-backdrop">
              <form className="admin-users-modal" onSubmit={handleAddUser}>
                <button className="admin-users-modal-close" type="button" onClick={() => setModalOpen(false)}><X size={22} /></button>
                <h3 className="admin-users-modal-title"><UserPlus size={18} style={{ verticalAlign: "middle", marginRight: 8, color: "#10b981" }} />Ajouter un utilisateur</h3>

                <div className="admin-users-modal-fields">
                  {/* Commun */}
                  <label>Prénom
                    <input name="prenom" required value={form.prenom} onChange={handleFormChange} autoFocus />
                  </label>

                  <label>Nom
                    <input name="nom" required value={form.nom} onChange={handleFormChange} />
                  </label>

                  <label>Login email
                    <input name="emailLogin" type="email" required value={form.emailLogin} onChange={handleFormChange} placeholder="prenom.nom@ynov.ma" />
                  </label>

                  <label>Email
                    <input name="email" type="email" required value={form.email} onChange={handleFormChange} placeholder="email.personnel@example.com" />
                  </label>

                  <label>Rôle
                    <select name="role" required value={form.role} onChange={handleFormChange}>
                      <option value="">Choisir...</option>
                      <option>Étudiant</option>
                      <option>Parent</option>
                      <option>Personnel</option>
                    </select>
                  </label>

                  {/* Étudiant */}
                  {form.role === 'Étudiant' && (
                    <>
                      <label>Filière
                        <input name="filiere" required value={form.filiere} onChange={handleFormChange} placeholder="Informatique, ..." />
                      </label>

                      <label>Niveau
                        <select name="niveau" required value={form.niveau} onChange={handleFormChange}>
                          <option value="">Choisir niveau...</option>
                          {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </label>
                    </>
                  )}

                  {/* Parent — dropdown multi (style = select) */}
                  {form.role === 'Parent' && (
                    <StudentMultiDropdown
                      label="Étudiants"
                      options={studentOptions}
                      value={form.parentOf}
                      onChange={(vals) => setForm(prev => ({ ...prev, parentOf: vals }))}
                      placeholder="Sélectionner un ou plusieurs"
                    />
                  )}
                </div>

                <button className="admin-users-modal-submit" type="submit">
                  <UserPlus size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
                  Ajouter
                </button>
              </form>
            </div>
          )}

          {/* View */}
          {viewUser && (
            <div className="admin-users-modal-backdrop">
              <div className="admin-users-modal">
                <button className="admin-users-modal-close" type="button" onClick={() => setViewUser(null)}><X size={22} /></button>
                <h3 className="admin-users-modal-title">Voir utilisateur</h3>
                <div className="admin-users-modal-fields">
                  <div className="modal-field"><strong>Nom :</strong> <span>{viewUser.displayName}</span></div>
                  <div className="modal-field"><strong>Login email :</strong> <span>{viewUser.emailLogin}</span></div>
                  <div className="modal-field"><strong>Email :</strong> <span>{viewUser.email}</span></div>
                  <div className="modal-field"><strong>Rôle :</strong> <span>{viewUser.role}</span></div>
                  <div className="modal-field">
                    <strong>Statut :</strong>
                    <span className={`user-status ${getStatusClass(viewUser.status || 'pending')}`} style={{ display: 'inline-block', padding: '0.3rem 0.8rem', borderRadius: '999px' }}>
                      {getStatusText(viewUser.status || 'pending')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit (démo) */}
          {editUser && (
            <div className="admin-users-modal-backdrop">
              <form className="admin-users-modal" onSubmit={handleEditSubmit}>
                <button className="admin-users-modal-close" type="button" onClick={() => setEditUser(null)}><X size={22} /></button>
                <h3 className="admin-users-modal-title">Modifier utilisateur</h3>
                <div className="admin-users-modal-fields">
                  <label>Nom complet
                    <input name="displayName" required value={editUser.displayName || ''} onChange={handleEditChange} autoFocus />
                  </label>
                  <label>Login email
                    <input name="emailLogin" required type="email" value={editUser.emailLogin || ''} onChange={handleEditChange} />
                  </label>
                  <label>Email
                    <input name="email" required type="email" value={editUser.email || ''} onChange={handleEditChange} />
                  </label>
                  <label>Rôle
                    <select name="role" required value={editUser.role || ''} onChange={handleEditChange}>
                      <option>Étudiant</option>
                      <option>Parent</option>
                      <option>Personnel</option>
                    </select>
                  </label>
                  <label>Statut
                    <select name="status" required value={editUser.status || 'pending'} onChange={handleEditChange}>
                      <option value="active">Actif</option>
                      <option value="pending">En attente</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </label>
                </div>
                <button className="admin-users-modal-submit" type="submit">
                  <Edit size={15} style={{ verticalAlign: "middle", marginRight: 5 }} />
                  Sauvegarder
                </button>
              </form>
            </div>
          )}

          {/* Delete */}
          {deleteUser && (
            <div className="admin-users-modal-backdrop">
              <div className="admin-users-modal">
                <button className="admin-users-modal-close" type="button" onClick={() => setDeleteUser(null)}><X size={22} /></button>
                <h3 className="admin-users-modal-title"><Trash2 size={18} style={{ verticalAlign: "middle", marginRight: 8, color: "#ef4444" }} />Confirmer la suppression</h3>
                <div style={{ marginBottom: '1.2rem', color: '#ef4444', fontWeight: 700, fontSize: "0.98rem" }}>
                  Supprimer l'utilisateur <span>{deleteUser.displayName}</span> ?
                </div>
                <button className="admin-users-modal-submit delete" type="button" onClick={handleDelete}>
                  <Trash2 size={15} style={{ verticalAlign: "middle", marginRight: 5 }} />Supprimer
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
