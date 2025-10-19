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
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  BarChart3,
  Shield,
  Database,
  Activity,
  UserPlus
} from 'lucide-react';
import '../../css/admin/GestionUtilisateursAdmin.css';

const AdminUsers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [query, setQuery] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [users, setUsers] = useState([
    { id: 1, name: "Ahmed Bennani", role: "Étudiant", email: "ahmed.b@ynov.ma", status: "active" },
    { id: 2, name: "Fatima Idrissi", role: "Parent", email: "fatima.i@gmail.com", status: "active" },
    { id: 3, name: "Karim Tazi", role: "Personnel", email: "karim.t@ynov.ma", status: "inactive" },
    { id: 4, name: "Sara Fassi", role: "Étudiant", email: "sara.f@ynov.ma", status: "pending" }
  ]);

  const [form, setForm] = useState({ name: '', email: '', role: '', password: '' });

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Tableau de bord' },
    { id: 'users', icon: Users, label: 'Gestion Utilisateurs' },
    { id: 'documents', icon: FileText, label: 'Gestion Documents' },
    { id: 'requests', icon: Clock, label: 'Demandes' },
    { id: 'statistics', icon: BarChart3, label: 'Statistiques' },
    { id: 'logs', icon: Activity, label: 'Journalisation' },
    { id: 'security', icon: Shield, label: 'Sécurité' },
    { id: 'database', icon: Database, label: 'Base de données' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'settings', icon: Settings, label: 'Paramètres' }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'admin-users-status-active';
      case 'pending': return 'admin-users-status-pending';
      case 'inactive': return 'admin-users-status-inactive';
      default: return '';
    }
  };

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase())
  );

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    setUsers(users.concat({
      ...form,
      id: Date.now(),
      status: 'pending'
    }));
    setForm({ name: '', email: '', role: '', password: '' });
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

  return (
    <div className="admin-dashboard-container">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : 'admin-sidebar-closed'}`}>
        <div className="admin-sidebar-content">
          <div className="admin-profile-section">
            <img
              src="https://ui-avatars.com/api/?name=Mohammed+Alaoui&background=17766e&color=fff&size=200"
              alt="Profile"
              className="admin-profile-pic"
            />
            {sidebarOpen && (
              <div className="admin-profile-info">
                <h3 className="admin-profile-name">Mohammed Alaoui</h3>
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
          <button
            className="admin-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="admin-page-title">Gestion Utilisateurs</h1>
        </header>

        <div className="admin-content">
          <div className="admin-users-toolbar">
            <button className="admin-users-add-btn" onClick={() => setModalOpen(true)}>
              <UserPlus size={20} />
              <span>Ajouter un utilisateur</span>
            </button>
            <div className="admin-users-searchrow">
              <Search size={17} />
              <input
                className="admin-users-search"
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher par nom, email ou rôle..."
                aria-label="Rechercher"
              />
            </div>
          </div>

          <div className="admin-users-table-container" role="region" aria-label="Liste utilisateurs">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Rôle</th>
                  <th>Email</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-users-empty">Aucun utilisateur trouvé</td>
                  </tr>
                ) : (
                  filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>
                        <span className={`admin-users-role ${u.role.toLowerCase()}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`admin-users-status ${getStatusClass(u.status)}`}>
                          {u.status === 'active'
                            ? 'Actif'
                            : u.status === 'pending'
                            ? 'En attente'
                            : 'Inactif'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-users-actions">
                          <button className="admin-users-action-btn admin-users-action-view" title="Voir" onClick={() => openViewModal(u)}>
                            <Eye size={17} />
                          </button>
                          <button className="admin-users-action-btn admin-users-action-edit" title="Modifier" onClick={() => openEditModal(u)}>
                            <Edit size={17} />
                          </button>
                          <button className="admin-users-action-btn admin-users-action-delete" title="Supprimer" onClick={() => openDeleteModal(u)}>
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* === ADD USER MODAL === */}
        {modalOpen && (
          <div className="admin-users-modal-backdrop">
            <form className="admin-users-modal enhanced" onSubmit={handleAddUser}>
              <button className="admin-users-modal-close" type="button" onClick={() => setModalOpen(false)} title="Fermer">
                <X size={22} />
              </button>
              <h3 className="admin-users-modal-title">Ajouter un utilisateur</h3>
              <div className="admin-users-modal-fields">
                <label>Nom
                  <input
                    name="name"
                    required
                    value={form.name}
                    onChange={handleFormChange}
                    autoFocus
                  />
                </label>
                <label>Email
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleFormChange}
                  />
                </label>
                <label>Mot de passe
                  <div className="password-input">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={handleFormChange}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
                <label>Rôle
                  <select
                    name="role"
                    required
                    value={form.role}
                    onChange={handleFormChange}
                  >
                    <option value="">Choisir...</option>
                    <option>Étudiant</option>
                    <option>Parent</option>
                    <option>Personnel</option>
                    <option>Admin</option>
                  </select>
                </label>
              </div>
              <button className="admin-users-modal-submit" type="submit">
                Ajouter
              </button>
            </form>
          </div>
        )}

        {/* VIEW / EDIT / DELETE MODALS remain unchanged */}
        {viewUser && (
          <div className="admin-users-modal-backdrop">
            <div className="admin-users-modal">
              <button className="admin-users-modal-close" type="button" onClick={() => setViewUser(null)}>
                <X size={22} />
              </button>
              <h3 className="admin-users-modal-title">Voir utilisateur</h3>
              <div className="admin-users-modal-fields">
                <div><strong>Nom :</strong> {viewUser.name}</div>
                <div><strong>Email :</strong> {viewUser.email}</div>
                <div><strong>Rôle :</strong> {viewUser.role}</div>
                <div><strong>Statut :</strong> {viewUser.status}</div>
              </div>
            </div>
          </div>
        )}

        {editUser && (
          <div className="admin-users-modal-backdrop">
            <form className="admin-users-modal" onSubmit={handleEditSubmit}>
              <button className="admin-users-modal-close" type="button" onClick={() => setEditUser(null)}>
                <X size={22} />
              </button>
              <h3 className="admin-users-modal-title">Modifier utilisateur</h3>
              <div className="admin-users-modal-fields">
                <label>Nom
                  <input name="name" required value={editUser.name} onChange={handleEditChange} />
                </label>
                <label>Email
                  <input name="email" required type="email" value={editUser.email} onChange={handleEditChange} />
                </label>
                <label>Rôle
                  <select name="role" required value={editUser.role} onChange={handleEditChange}>
                    <option>Étudiant</option>
                    <option>Parent</option>
                    <option>Personnel</option>
                    <option>Admin</option>
                  </select>
                </label>
              </div>
              <button className="admin-users-modal-submit" type="submit">
                Sauvegarder
              </button>
            </form>
          </div>
        )}

        {deleteUser && (
          <div className="admin-users-modal-backdrop">
            <div className="admin-users-modal">
              <button className="admin-users-modal-close" type="button" onClick={() => setDeleteUser(null)}>
                <X size={22} />
              </button>
              <h3 className="admin-users-modal-title">Confirmer la suppression</h3>
              <div style={{ marginBottom: '2rem', color: '#ef4444', fontWeight: 700 }}>
                Supprimer l'utilisateur <span>{deleteUser.name}</span> ?
              </div>
              <button className="admin-users-modal-submit admin-users-modal-delete" type="button" onClick={handleDelete}>
                Supprimer
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUsers;
