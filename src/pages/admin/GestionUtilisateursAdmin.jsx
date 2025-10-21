// src/pages/admin/GestionUtilisateursAdmin.jsx
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../component/sidebar';
import {
  Menu, X, Bell, Search, UserPlus,
  Mail, Shield, Trash2, Edit, Check
} from 'lucide-react';
import '../../css/admin/GestionUtilisateursAdmin.css';
import api from '../../api';
import { auth } from '../../firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10; // 10 éléments par page

const userData = {
  firstName: "Mohammed",
  lastName: "Alaoui",
  role: "Super Administrateur",
  profilePic: "https://ui-avatars.com/api/?name=Mohammed+Alaoui&background=17766e&color=fff&size=200"
};

const NIVEAUX = ['B1', 'B2', 'B3', 'M1', 'M2'];

// map "Étudiant/Parent/Personnel" -> "etudiant/parent/personnel"
const mapRoleToApi = (label) => {
  if (!label) return '';
  const l = label.toLowerCase();
  if (l.startsWith('étud') || l.startsWith('etud')) return 'etudiant';
  if (l.startsWith('parent')) return 'parent';
  if (l.startsWith('person')) return 'personnel';
  return '';
};
// map inverse pour UI
const mapRoleToUi = (apiRole) => {
  if (apiRole === 'etudiant') return 'Étudiant';
  if (apiRole === 'parent') return 'Parent';
  if (apiRole === 'personnel') return 'Personnel';
  return apiRole || '';
};

/** Dropdown multi (style select), options = [{id,label}] */
function StudentMultiDropdown({ label = 'Étudiants', options, value, onChange, placeholder = 'Sélectionner…' }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const selected = options.filter(o => value.includes(o.id));
  const text = selected.length ? selected.map(o => o.label).join(', ') : '';
  const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));
  const toggle = (id) => value.includes(id) ? onChange(value.filter(v => v !== id)) : onChange([...value, id]);

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
        <span className={`dropdown-value ${text ? '' : 'placeholder'}`}>{text || placeholder}</span>
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
            {filtered.length === 0 && <div className="dropdown-empty">Aucun résultat</div>}
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

const GestionUtilisateursAdmin = () => {
  const navigate = useNavigate();

  // ===== Guard: si token/compte invalide -> login
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { navigate('/admin/login', { replace: true }); return; }
      try {
        const { data: me } = await api.get('/me'); // vérifie côté back
        if (me.role !== 'admin') { navigate('/admin/login', { replace: true }); return; }
        setAuthReady(true);
      } catch {
        navigate('/admin/login', { replace: true });
      }
    });
    return () => unsub();
  }, [navigate]);

  // ===== UI states
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [activeTab, setActiveTab] = useState('users');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);

  // Edition / Suppression
  const [editUser, setEditUser] = useState(null);          // objet user complet (UI)
  const [editLoading, setEditLoading] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const [query, setQuery] = useState('');

  // -------- liste affichée --------
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false); // contrôle le bouton "Charger plus"

  // -------- form création --------
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

  // Étudiants (pour ajout parent & édition parent)
  const [studentOptions, setStudentOptions] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // fetch des étudiants quand modal AJOUT ouverte ET rôle = Parent (uniquement les libres)
  useEffect(() => {
    const shouldLoad = modalOpen && form.role === 'Parent';
    if (!shouldLoad) return;

    let cancelled = false;
    (async () => {
      try {
        setStudentsLoading(true);
        const { data } = await api.get('/users/etudiants/min', {
          params: { limit: 50, availableOnly: true }
        });
        if (cancelled) return;
        const opts = (data.items || []).map(it => ({
          id: it.id,
          label: it.displayName || [it.prenom, it.nom].filter(Boolean).join(' ') || it.id
        }));
        setStudentOptions(opts);
      } catch (e) {
        console.error('LOAD STUDENTS FAILED', e?.response?.data || e.message);
        setStudentOptions([]);
      } finally {
        if (!cancelled) setStudentsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [modalOpen, form.role]);

  // fetch des étudiants quand MODALE EDIT ouverte et rôle = Parent (inclure les déjà rattachés)
  useEffect(() => {
    const shouldLoad = !!editUser && editUser.role === 'Parent';
    if (!shouldLoad) return;

    let cancelled = false;
    (async () => {
      try {
        setStudentsLoading(true);
        // ⚠️ ici on met availableOnly=false pour aussi voir les étudiants déjà rattachés (dont ceux rattachés à ce parent)
        const { data } = await api.get('/users/etudiants/min', {
          params: { limit: 100, availableOnly: false }
        });
        if (cancelled) return;
        const opts = (data.items || []).map(it => ({
          id: it.id,
          label: it.displayName || [it.prenom, it.nom].filter(Boolean).join(' ') || it.id
        }));
        setStudentOptions(opts);
      } catch (e) {
        console.error('LOAD STUDENTS FAILED', e?.response?.data || e.message);
        setStudentOptions([]);
      } finally {
        if (!cancelled) setStudentsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [editUser]);

  // ====== CHARGEMENT USERS (GET /api/users/full) ======
  const mapApiUserToUi = (u) => ({
    id: u.id,
    displayName: u.displayName || [u.prenom, u.nom].filter(Boolean).join(' ') || u.email,
    role: mapRoleToUi(u.role),
    emailLogin: u.email || '',
    email: u.notifyEmail || '',
    // on garde aussi prenom/nom pour édition
    prenom: u.prenom || '',
    nom: u.nom || '',
    filiere: u.filiere || '',
    niveau: u.niveau || '',
    parentUid: u.parentUid || null,
    parentOf: Array.isArray(u.parentOf) ? u.parentOf : []
  });

  const fetchUsers = async ({ append = false, cursor = null, role = null } = {}) => {
    try {
      setLoadingUsers(true);
      const params = { limit: PAGE_SIZE };
      if (cursor) params.cursor = cursor;
      if (role) params.role = mapRoleToApi(role);

      const { data } = await api.get('/users/full', { params });
      const incoming = (data.items || []).map(mapApiUserToUi);

      setUsers(prev => append ? [...prev, ...incoming] : incoming);
      setNextCursor(data.nextCursor || null);

      // si le back ne renvoie pas hasMore, on devine : plein + nextCursor
      const computedHasMore = (incoming.length === PAGE_SIZE) && Boolean(data.nextCursor);
      setHasMore(typeof data.hasMore === 'boolean' ? data.hasMore : computedHasMore);
    } catch (e) {
      if (e?.response?.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      console.error('LOAD USERS FAILED', e?.response?.data || e.message);
      setUsers([]); setNextCursor(null); setHasMore(false);
    } finally {
      setLoadingUsers(false);
    }
  };

  // chargement initial (quand garde OK)
  useEffect(() => { if (authReady) fetchUsers(); }, [authReady]);

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

  // ====== AJOUT (POST /api/users) ======
  const [creating, setCreating] = useState(false);
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (creating) return;

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

    const payload = {
      role: mapRoleToApi(form.role),
      email: form.emailLogin,
      notifyEmail: form.email,
      prenom: form.prenom,
      nom: form.nom
    };
    if (payload.role === 'etudiant') {
      payload.filiere = form.filiere;
      payload.niveau = form.niveau;
    }
    if (payload.role === 'parent') {
      payload.parentOf = form.parentOf;
    }

    try {
      setCreating(true);
      await api.post('/users', payload);
      await fetchUsers(); // recharge la 1ère page
      setForm({
        prenom: '', nom: '', emailLogin: '', email: '', role: '',
        filiere: '', niveau: '', parentOf: []
      });
      setModalOpen(false);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      console.error(err);
      alert(err?.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  // ====== EDITION (PATCH /api/users/:uid) ======
  const openEditModal = (user) => {
    setEditError('');
    setEditUser({ ...user }); // user.role = 'Étudiant' | 'Parent' | 'Personnel'
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser) return;

    try {
      setEditLoading(true);
      setEditError('');

      // rôle immuable → on NE l’envoie pas
      const payload = {
        email: editUser.emailLogin,      // login email
        notifyEmail: editUser.email      // email perso
      };

      // si présents dans l’objet
      if (typeof editUser.prenom !== 'undefined') payload.prenom = editUser.prenom;
      if (typeof editUser.nom !== 'undefined') payload.nom = editUser.nom;

      if (editUser.role === 'Étudiant') {
        payload.filiere = editUser.filiere || null;
        payload.niveau  = editUser.niveau  || null;
      }

      if (editUser.role === 'Parent') {
        payload.parentOf = Array.isArray(editUser.parentOf) ? editUser.parentOf : [];
      }

      await api.patch(`/users/${editUser.id}`, payload);
      await fetchUsers(); // recharge la 1ère page
      setEditUser(null);
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message;
      setEditError(msg || 'Échec de la mise à jour');
      console.error('PATCH failed', err?.response?.data || err);
    } finally {
      setEditLoading(false);
    }
  };

  // ====== SUPPRESSION (DELETE /api/users/:uid) ======
  const openDeleteModal = (user) => {
    setDeleteError('');
    setDeleteUser(user);
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    try {
      setDeleteLoading(true);
      setDeleteError('');
      await api.delete(`/users/${deleteUser.id}`);
      setDeleteUser(null);
      await fetchUsers(); // recharge la 1ère page
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      const payload = err?.response?.data;
      const msg = payload?.message || payload?.error || 'Suppression impossible';
      setDeleteError(msg);
      console.error('DELETE failed', payload || err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openViewModal = (user) => setViewUser(user);

  // ===== UI =====
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
            {/* Toolbar */}
            <div className="admin-users-toolbar">
              <button className="admin-users-add-btn" onClick={() => setModalOpen(true)}>
                <UserPlus size={20} /><span>Ajouter utilisateur</span>
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
            {loadingUsers && users.length === 0 && (
              <div style={{ padding: '1rem', opacity:.7 }}>Chargement…</div>
            )}

            <div className="admin-users-grid">
              {filteredUsers.length === 0 && !loadingUsers ? (
                <div className="admin-users-empty-state">
                  <UserPlus size={64} />
                  <h3>Aucun utilisateur trouvé</h3>
                  <p>Essayez de modifier vos critères de recherche</p>
                </div>
              ) : (
                filteredUsers.map(user => (
                  <div key={user.id} className="admin-users-card">
                    <div className="user-card-header">
                      <div className="user-avatar">{(user.displayName || 'U').charAt(0)}</div>
                    </div>
                    <div className="user-card-body">
                      <h3 className="user-name">{user.displayName}</h3>
                      <div className="user-meta">
                        <div className="user-meta-item">
                          <Shield size={14} /><span className="user-role">{user.role}</span>
                        </div>
                        <div className="user-meta-item">
                          <Mail size={14} /><span className="user-email">{user.emailLogin}</span>
                        </div>
                      </div>
                    </div>
                    <div className="user-card-footer">
                      <button className="user-action-btn edit" onClick={() => openEditModal(user)}>
                        <Edit size={16} /><span>Modifier</span>
                      </button>
                      <button className="user-action-btn delete" onClick={() => openDeleteModal(user)}>
                        <Trash2 size={16} /><span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:16 }}>
              {hasMore && nextCursor && (
                <button
                  className="admin-users-add-btn"
                  onClick={() => fetchUsers({ append: true, cursor: nextCursor })}
                  disabled={loadingUsers}
                >
                  {loadingUsers ? 'Chargement…' : 'Charger plus'}
                </button>
              )}
            </div>
          </section>

          {/* ===== MODAL — AJOUT ===== */}
          {modalOpen && (
            <div className="admin-users-modal-backdrop">
              <form className="admin-users-modal" onSubmit={handleAddUser}>
                <button
                  className="admin-users-modal-close"
                  type="button"
                  onClick={() => setModalOpen(false)}
                >
                  <X size={22} />
                </button>
                <h3 className="admin-users-modal-title">
                  <UserPlus size={18} style={{ verticalAlign: "middle", marginRight: 8, color: "#10b981" }} />
                  Ajouter un utilisateur
                </h3>

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

                  {/* Parent — liste backend */}
                  {form.role === 'Parent' && (
                    <>
                      {studentsLoading && <div style={{fontSize:12, opacity:.7}}>Chargement des étudiants…</div>}
                      <StudentMultiDropdown
                        label="Étudiants"
                        options={studentOptions}
                        value={form.parentOf}
                        onChange={(vals) => setForm(prev => ({ ...prev, parentOf: vals }))}
                        placeholder="Sélectionner un ou plusieurs"
                      />
                      {!studentsLoading && studentOptions.length === 0 && (
                        <div style={{fontSize:12, opacity:.7}}>Aucun étudiant disponible (non rattaché).</div>
                      )}
                    </>
                  )}
                </div>

                <button className="admin-users-modal-submit" type="submit" disabled={creating}>
                  <UserPlus size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
                  {creating ? 'Création…' : 'Ajouter'}
                </button>
              </form>
            </div>
          )}

          {/* ===== MODAL — VIEW ===== */}
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
                </div>
              </div>
            </div>
          )}

          {/* ===== MODAL — EDIT (connectée au backend) ===== */}
          {editUser && (
            <div className="admin-users-modal-backdrop">
              <form className="admin-users-modal" onSubmit={handleEditSubmit}>
                <button className="admin-users-modal-close" type="button" onClick={() => setEditUser(null)}><X size={22} /></button>
                <h3 className="admin-users-modal-title">Modifier utilisateur</h3>

                <div className="admin-users-modal-fields">
                  {/* Rôle affiché, non modifiable (immutabilité) */}
                  <label>Rôle
                    <input value={editUser.role} readOnly />
                  </label>

                  {/* Champs prénom/nom si disponibles */}
                  <label>Prénom
                    <input name="prenom" value={editUser.prenom || ''} onChange={handleEditChange} />
                  </label>
                  <label>Nom
                    <input name="nom" value={editUser.nom || ''} onChange={handleEditChange} />
                  </label>

                  <label>Login email
                    <input name="emailLogin" required type="email" value={editUser.emailLogin || ''} onChange={handleEditChange} />
                  </label>

                  <label>Email
                    <input name="email" required type="email" value={editUser.email || ''} onChange={handleEditChange} />
                  </label>

                  {/* Étudiant */}
                  {editUser.role === 'Étudiant' && (
                    <>
                      <label>Filière
                        <input name="filiere" value={editUser.filiere || ''} onChange={handleEditChange} />
                      </label>
                      <label>Niveau
                        <select name="niveau" value={editUser.niveau || ''} onChange={handleEditChange}>
                          <option value="">—</option>
                          {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </label>
                    </>
                  )}

                  {/* Parent — rattachements (ajout/suppression d'étudiants) */}
                  {editUser.role === 'Parent' && (
                    <>
                      {studentsLoading && <div style={{fontSize:12, opacity:.7}}>Chargement des étudiants…</div>}
                      <StudentMultiDropdown
                        label="Étudiants rattachés"
                        options={studentOptions}
                        value={Array.isArray(editUser.parentOf) ? editUser.parentOf : []}
                        onChange={(vals) => setEditUser(prev => ({ ...prev, parentOf: vals }))}
                        placeholder="Sélectionner un ou plusieurs"
                      />
                      <div style={{fontSize:12, opacity:.7, marginTop:6}}>
                        Astuce : si vous sélectionnez un étudiant déjà rattaché à un autre parent, le backend refusera et un message d’erreur s’affichera.
                      </div>
                    </>
                  )}

                  {editError && (
                    <div style={{color:'#ef4444', fontSize:13, marginTop:4}}>{editError}</div>
                  )}
                </div>

                <button className="admin-users-modal-submit" type="submit" disabled={editLoading}>
                  <Edit size={15} style={{ verticalAlign: "middle", marginRight: 5 }} />
                  {editLoading ? 'Enregistrement…' : 'Sauvegarder'}
                </button>
              </form>
            </div>
          )}

          {/* ===== MODAL — DELETE (connectée au backend) ===== */}
          {deleteUser && (
            <div className="admin-users-modal-backdrop">
              <div className="admin-users-modal">
                <button className="admin-users-modal-close" type="button" onClick={() => setDeleteUser(null)}><X size={22} /></button>
                <h3 className="admin-users-modal-title">
                  <Trash2 size={18} style={{ verticalAlign: "middle", marginRight: 8, color: "#ef4444" }} />
                  Confirmer la suppression
                </h3>
                <div style={{ marginBottom: '0.6rem' }}>
                  Supprimer l'utilisateur <strong>{deleteUser.displayName}</strong> ?
                </div>
                {deleteError && (
                  <div style={{color:'#ef4444', fontSize:13, marginBottom:8}}>
                    {deleteError}
                  </div>
                )}
                <div style={{ display:'flex', gap:10 }}>
                  <button className="admin-users-modal-submit delete" type="button" onClick={handleDelete} disabled={deleteLoading}>
                    <Trash2 size={15} style={{ verticalAlign: "middle", marginRight: 5 }} />
                    {deleteLoading ? 'Suppression…' : 'Supprimer'}
                  </button>
                  <button className="admin-users-modal-submit" type="button" onClick={() => setDeleteUser(null)} disabled={deleteLoading}>
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GestionUtilisateursAdmin;
