import React, { useState } from 'react';
import Sidebar from '../component/sidebar';
import {
  Menu,
  X,
  Bell,
  Search,
  UserPlus,
  Users,
  UserCheck,
  UserX,
  Clock,
  Mail,
  Shield,
  Eye,
  Trash2,
  Edit,
  EyeOff
} from 'lucide-react';
import '../../css/admin/GestionUtilisateursAdmin.css';

const userData = {
  firstName: "Mohammed",
  lastName: "Alaoui",
  role: "Super Administrateur",
  profilePic: "https://ui-avatars.com/api/?name=Mohammed+Alaoui&background=17766e&color=fff&size=200"
};

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
  const [showPassword, setShowPassword] = useState(false);
  
  const [users, setUsers] = useState([
    { id: 1, name: "Ahmed Bennani", role: "Étudiant", email: "ahmed.b@ynov.ma", status: "active" },
    { id: 2, name: "Fatima Idrissi", role: "Parent", email: "fatima.i@gmail.com", status: "active" },
    { id: 3, name: "Karim Tazi", role: "Personnel", email: "karim.t@ynov.ma", status: "inactive" },
    { id: 4, name: "Sara Fassi", role: "Étudiant", email: "sara.f@ynov.ma", status: "pending" },
    { id: 5, name: "Omar Belkhir", role: "Étudiant", email: "omar.b@ynov.ma", status: "active" },
    { id: 6, name: "Amina Rachid", role: "Parent", email: "amina.r@gmail.com", status: "active" }
  ]);
  
  const [form, setForm] = useState({ name: '', email: '', role: '', password: '' });

  const handleLogout = () => {
    console.log('Logout clicked');
  };

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

  // Stats
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
        onLogout={handleLogout}
        userData={userData}
      />

      {sidebarOpen && (
        <div
          className="admin-users-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`admin-users-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <button
            className="admin-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
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
            
            {/* Stats Cards */}
            <div className="admin-users-stats-grid">
              <div className="admin-users-stat-card stat-total">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Total Utilisateurs</p>
                  <h3 className="stat-value">{totalUsers}</h3>
                </div>
              </div>
              <div className="admin-users-stat-card stat-active">
                <div className="stat-icon">
                  <UserCheck size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Actifs</p>
                  <h3 className="stat-value">{activeUsers}</h3>
                </div>
              </div>
              <div className="admin-users-stat-card stat-pending">
                <div className="stat-icon">
                  <Clock size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">En Attente</p>
                  <h3 className="stat-value">{pendingUsers}</h3>
                </div>
              </div>
              <div className="admin-users-stat-card stat-inactive">
                <div className="stat-icon">
                  <UserX size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Inactifs</p>
                  <h3 className="stat-value">{inactiveUsers}</h3>
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="admin-users-toolbar">
              <button className="admin-users-add-btn" onClick={() => setModalOpen(true)}>
                <UserPlus size={20} />
                <span>Ajouter utilisateur</span>
              </button>
              <div className="admin-users-searchbox">
                <Search size={18} />
                <input
                  className="admin-users-search"
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Rechercher utilisateurs..."
                  aria-label="Rechercher"
                />
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
                      <div className="user-avatar">
                        {user.name.charAt(0)}
                      </div>
                      <span className={`user-status ${getStatusClass(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </div>
                    <div className="user-card-body">
                      <h3 className="user-name">{user.name}</h3>
                      <div className="user-meta">
                        <div className="user-meta-item">
                          <Shield size={14} />
                          <span className="user-role">{user.role}</span>
                        </div>
                        <div className="user-meta-item">
                          <Mail size={14} />
                          <span className="user-email">{user.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="user-card-footer">

                      <button className="user-action-btn edit" onClick={() => openEditModal(user)}>
                        <Edit size={16} />
                        <span>Modifier</span>
                      </button>
                      <button className="user-action-btn delete" onClick={() => openDeleteModal(user)}>
                        <Trash2 size={16} />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* MODALS */}
          {/* Add User Modal */}
          {modalOpen && (
            <div className="admin-users-modal-backdrop">
              <form className="admin-users-modal" onSubmit={handleAddUser}>
                <button className="admin-users-modal-close" type="button" onClick={() => setModalOpen(false)}>
                  <X size={22} />
                </button>
                <h3 className="admin-users-modal-title">
                  <UserPlus size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#10b981"}} />
                  Ajouter un utilisateur
                </h3>
                <div className="admin-users-modal-fields">
                  <label>Nom
                    <input name="name" required value={form.name} onChange={handleFormChange} autoFocus />
                  </label>
                  <label>Email
                    <input name="email" type="email" required value={form.email} onChange={handleFormChange} />
                  </label>
                  <label>Mot de passe
                    <div className="admin-users-password">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={form.password}
                        onChange={handleFormChange}
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </label>
                  <label>Rôle
                    <select name="role" required value={form.role} onChange={handleFormChange}>
                      <option value="">Choisir...</option>
                      <option>Étudiant</option>
                      <option>Parent</option>
                      <option>Personnel</option>
                    </select>
                  </label>
                </div>
                <button className="admin-users-modal-submit" type="submit">
                  <UserPlus size={16} style={{verticalAlign: "middle", marginRight: 6}} />
                  Ajouter
                </button>
              </form>
            </div>
          )}

          {/* View User Modal */}
          {viewUser && (
            <div className="admin-users-modal-backdrop">
              <div className="admin-users-modal">
                <button className="admin-users-modal-close" type="button" onClick={() => setViewUser(null)}>
                  <X size={22} />
                </button>
                <h3 className="admin-users-modal-title">
                  <Eye size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#3b82f6"}} />
                  Voir utilisateur
                </h3>
                <div className="admin-users-modal-fields">
                  <div className="modal-field">
                    <strong>Nom :</strong>
                    <span>{viewUser.name}</span>
                  </div>
                  <div className="modal-field">
                    <strong>Email :</strong>
                    <span>{viewUser.email}</span>
                  </div>
                  <div className="modal-field">
                    <strong>Rôle :</strong>
                    <span>{viewUser.role}</span>
                  </div>
                  <div className="modal-field">
                    <strong>Statut :</strong>
                    <span className={`user-status ${getStatusClass(viewUser.status)}`} style={{display: 'inline-block', padding: '0.3rem 0.8rem', borderRadius: '999px'}}>
                      {getStatusText(viewUser.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          {editUser && (
            <div className="admin-users-modal-backdrop">
              <form className="admin-users-modal" onSubmit={handleEditSubmit}>
                <button className="admin-users-modal-close" type="button" onClick={() => setEditUser(null)}>
                  <X size={22} />
                </button>
                <h3 className="admin-users-modal-title">
                  <Edit size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#f59e0b"}} />
                  Modifier utilisateur
                </h3>
                <div className="admin-users-modal-fields">
                  <label>Nom
                    <input name="name" required value={editUser.name} onChange={handleEditChange} autoFocus />
                  </label>
                  <label>Email
                    <input name="email" required type="email" value={editUser.email} onChange={handleEditChange} />
                  </label>
                  <label>Rôle
                    <select name="role" required value={editUser.role} onChange={handleEditChange}>
                      <option>Étudiant</option>
                      <option>Parent</option>
                      <option>Personnel</option>
                    </select>
                  </label>
                  <label>Statut
                    <select name="status" required value={editUser.status} onChange={handleEditChange}>
                      <option value="active">Actif</option>
                      <option value="pending">En attente</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </label>
                </div>
                <button className="admin-users-modal-submit" type="submit">
                  <Edit size={15} style={{verticalAlign: "middle", marginRight: 5}} />
                  Sauvegarder
                </button>
              </form>
            </div>
          )}

          {/* Delete Modal */}
          {deleteUser && (
            <div className="admin-users-modal-backdrop">
              <div className="admin-users-modal">
                <button className="admin-users-modal-close" type="button" onClick={() => setDeleteUser(null)}>
                  <X size={22} />
                </button>
                <h3 className="admin-users-modal-title">
                  <Trash2 size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#ef4444"}} />
                  Confirmer la suppression
                </h3>
                <div style={{ marginBottom: '1.2rem', color: '#ef4444', fontWeight: 700, fontSize: "0.98rem" }}>
                  Supprimer l'utilisateur <span>{deleteUser.name}</span> ?
                </div>
                <button className="admin-users-modal-submit delete" type="button" onClick={handleDelete}>
                  <Trash2 size={15} style={{verticalAlign: "middle", marginRight: 5}} />
                  Supprimer
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
