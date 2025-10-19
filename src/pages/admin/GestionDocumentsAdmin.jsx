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
  Edit,
  Trash2,
  BarChart3,
  Shield,
  Database,
  Activity,
  FilePlus,
  Download,
  Upload,
  Filter,
  Info
} from 'lucide-react';
import '../../css/admin/GestionDocumentsAdmin.css';

const AdminDocuments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('documents');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState(null);
  const [editDoc, setEditDoc] = useState(null);
  const [deleteDoc, setDeleteDoc] = useState(null);
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState([
    { id: 1, name: "Attestation d'inscription - Ahmed Bennani", type: "Attestation", student: "Ahmed Bennani", status: "generated", date: "2025-10-15", size: "245 KB" },
    { id: 2, name: "Bulletin S1 - Fatima Idrissi", type: "Bulletin", student: "Fatima Idrissi", status: "pending", date: "2025-10-14", size: "180 KB" },
    { id: 3, name: "Certificat de réussite - Karim Tazi", type: "Certificat", student: "Karim Tazi", status: "generated", date: "2025-10-13", size: "320 KB" },
    { id: 4, name: "Convention de stage - Sara Fassi", type: "Convention", student: "Sara Fassi", status: "draft", date: "2025-10-12", size: "156 KB" }
  ]);
  const [form, setForm] = useState({ name: '', type: '', student: '' });

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
      case 'generated': return 'admin-docs-status-generated';
      case 'pending': return 'admin-docs-status-pending';
      case 'draft': return 'admin-docs-status-draft';
      default: return '';
    }
  };

  const filteredDocs = documents.filter(
    d =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.type.toLowerCase().includes(query.toLowerCase()) ||
      d.student.toLowerCase().includes(query.toLowerCase())
  );

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddDoc = (e) => {
    e.preventDefault();
    setDocuments(documents.concat({
      ...form,
      id: Date.now(),
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      size: '0 KB'
    }));
    setForm({ name: '', type: '', student: '' });
    setModalOpen(false);
  };

  const openEditModal = (doc) => {
    setEditDoc({ ...doc });
  };

  const handleEditChange = (e) => {
    setEditDoc({ ...editDoc, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setDocuments(documents.map(d =>
      d.id === editDoc.id ? { ...d, ...editDoc } : d
    ));
    setEditDoc(null);
  };

  const openViewModal = (doc) => {
    setViewDoc(doc);
  };

  const openDeleteModal = (doc) => {
    setDeleteDoc(doc);
  };

  const handleDelete = () => {
    setDocuments(documents.filter(d => d.id !== deleteDoc.id));
    setDeleteDoc(null);
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
          <h1 className="admin-page-title">Gestion Documents</h1>
        </header>
        <div className="admin-content">
          <div className="admin-docs-toolbar">
            <div className="admin-docs-toolbar-left">
              <button
                className="admin-docs-add-btn"
                onClick={() => setModalOpen(true)}
              >
                <FilePlus size={20} />
                <span>Nouveau document</span>
              </button>
              <button className="admin-docs-upload-btn">
                <Upload size={18} />
                <span>Importer</span>
              </button>
            </div>
            <div className="admin-docs-toolbar-right">
              <button className="admin-docs-filter-btn">
                <Filter size={18} />
                <span>Filtrer</span>
              </button>
              <div className="admin-docs-searchrow">
                <Search size={17} />
                <input
                  className="admin-docs-search"
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Rechercher documents..."
                  aria-label="Rechercher"
                />
              </div>
            </div>
          </div>

          <div className="admin-docs-table-container" role="region" aria-label="Liste documents">
            <table className="admin-docs-table">
              <thead>
                <tr>
                  <th>Nom du document</th>
                  <th>Type</th>
                  <th>Étudiant</th>
                  <th>Date</th>
                  <th>Taille</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="admin-docs-empty">Aucun document trouvé</td>
                  </tr>
                ) : (
                  filteredDocs.map(d => (
                    <tr key={d.id}>
                      <td>{d.name}</td>
                      <td>
                        <span className={`admin-docs-type ${d.type.toLowerCase()}`}>
                          {d.type}
                        </span>
                      </td>
                      <td>{d.student}</td>
                      <td>{d.date}</td>
                      <td>{d.size}</td>
                      <td>
                        <span className={`admin-docs-status ${getStatusClass(d.status)}`}>
                          {d.status === 'generated'
                            ? 'Généré'
                            : d.status === 'pending'
                            ? 'En attente'
                            : 'Brouillon'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-docs-actions">
                          <button
                            className="admin-docs-action-btn admin-docs-action-view"
                            title="Voir"
                            onClick={() => openViewModal(d)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="admin-docs-action-btn admin-docs-action-download"
                            title="Télécharger"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            className="admin-docs-action-btn admin-docs-action-edit"
                            title="Modifier"
                            onClick={() => openEditModal(d)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="admin-docs-action-btn admin-docs-action-delete"
                            title="Supprimer"
                            onClick={() => openDeleteModal(d)}
                          >
                            <Trash2 size={16} />
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

        {/* ADD DOCUMENT MODAL */}
        {modalOpen && (
          <div className="admin-docs-modal-backdrop">
            <form className="admin-docs-modal admin-docs-modal-dark" onSubmit={handleAddDoc}>
              <button
                className="admin-docs-modal-close"
                type="button"
                onClick={() => setModalOpen(false)}
                title="Fermer"
                aria-label="Fermer"
              >
                <X size={22} />
              </button>
              <h3 className="admin-docs-modal-title">
                <FilePlus size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#10b981"}} />
                Nouveau document
              </h3>
              <div className="admin-docs-modal-fields">
                <label>Nom du document
                  <input
                    name="name"
                    required
                    value={form.name}
                    onChange={handleFormChange}
                    autoFocus
                  />
                </label>
                <label>Type
                  <select
                    name="type"
                    required
                    value={form.type}
                    onChange={handleFormChange}
                  >
                    <option value="">Choisir...</option>
                    <option>Attestation</option>
                    <option>Bulletin</option>
                    <option>Certificat</option>
                    <option>Convention</option>
                  </select>
                </label>
                <label>Étudiant
                  <input
                    name="student"
                    required
                    value={form.student}
                    onChange={handleFormChange}
                  />
                </label>
              </div>
              <button className="admin-docs-modal-submit" type="submit">
                <FilePlus size={16} style={{verticalAlign: "middle", marginRight: 6}} />
                Créer
              </button>
            </form>
          </div>
        )}

        {/* VIEW MODAL */}
        {viewDoc && (
          <div className="admin-docs-modal-backdrop">
            <div className="admin-docs-modal admin-docs-modal-dark">
              <button
                className="admin-docs-modal-close"
                type="button"
                onClick={() => setViewDoc(null)}
                title="Fermer"
                aria-label="Fermer"
              >
                <X size={22} />
              </button>
              <h3 className="admin-docs-modal-title">
                <Eye size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#3b82f6"}} />
                Détails du document
              </h3>
              <div className="admin-docs-modal-fields">
                <div><Info size={15} style={{marginRight:5, color:"#94a3b8", verticalAlign:"middle"}} /> <strong>Nom :</strong> {viewDoc.name}</div>
                <div><Info size={15} style={{marginRight:5, color:"#94a3b8", verticalAlign:"middle"}} /> <strong>Type :</strong> {viewDoc.type}</div>
                <div><Info size={15} style={{marginRight:5, color:"#94a3b8", verticalAlign:"middle"}} /> <strong>Étudiant :</strong> {viewDoc.student}</div>
                <div><Info size={15} style={{marginRight:5, color:"#94a3b8", verticalAlign:"middle"}} /> <strong>Date :</strong> {viewDoc.date}</div>
                <div><Info size={15} style={{marginRight:5, color:"#94a3b8", verticalAlign:"middle"}} /> <strong>Taille :</strong> {viewDoc.size}</div>
                <div><Info size={15} style={{marginRight:5, color:"#94a3b8", verticalAlign:"middle"}} /> <strong>Statut :</strong> {viewDoc.status === "generated" ? "Généré" : viewDoc.status === "pending" ? "En attente" : "Brouillon"}</div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {editDoc && (
          <div className="admin-docs-modal-backdrop">
            <form className="admin-docs-modal admin-docs-modal-dark" onSubmit={handleEditSubmit}>
              <button
                className="admin-docs-modal-close"
                type="button"
                onClick={() => setEditDoc(null)}
                title="Fermer"
                aria-label="Fermer"
              >
                <X size={22} />
              </button>
              <h3 className="admin-docs-modal-title">
                <Edit size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#f59e0b"}} />
                Modifier document
              </h3>
              <div className="admin-docs-modal-fields">
                <label>Nom du document
                  <input
                    name="name"
                    required
                    value={editDoc.name}
                    onChange={handleEditChange}
                    autoFocus
                  />
                </label>
                <label>Type
                  <select
                    name="type"
                    required
                    value={editDoc.type}
                    onChange={handleEditChange}
                  >
                    <option>Attestation</option>
                    <option>Bulletin</option>
                    <option>Certificat</option>
                    <option>Convention</option>
                  </select>
                </label>
                <label>Étudiant
                  <input
                    name="student"
                    required
                    value={editDoc.student}
                    onChange={handleEditChange}
                  />
                </label>
                <label>Statut
                  <select
                    name="status"
                    required
                    value={editDoc.status}
                    onChange={handleEditChange}
                  >
                    <option value="draft">Brouillon</option>
                    <option value="pending">En attente</option>
                    <option value="generated">Généré</option>
                  </select>
                </label>
              </div>
              <button className="admin-docs-modal-submit" type="submit">
                <Edit size={15} style={{verticalAlign: "middle", marginRight: 5}} />
                Sauvegarder
              </button>
            </form>
          </div>
        )}

        {/* DELETE MODAL */}
        {deleteDoc && (
          <div className="admin-docs-modal-backdrop">
            <div className="admin-docs-modal admin-docs-modal-dark">
              <button
                className="admin-docs-modal-close"
                type="button"
                onClick={() => setDeleteDoc(null)}
                title="Fermer"
                aria-label="Fermer"
              >
                <X size={22} />
              </button>
              <h3 className="admin-docs-modal-title">
                <Trash2 size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#ef4444"}} />
                Confirmer la suppression
              </h3>
              <div style={{marginBottom: '1.2rem', color: '#ef4444', fontWeight: 700, fontSize: "0.98rem", display:"flex", alignItems:"center"}}>
                <Info size={16} style={{marginRight:4, color:"#ef4444"}} />
                Supprimer le document <span style={{marginLeft:6}}>{deleteDoc.name}</span> ?
              </div>
              <button className="admin-docs-modal-submit admin-docs-modal-delete" type="button" onClick={handleDelete}>
                <Trash2 size={15} style={{verticalAlign: "middle", marginRight: 5}} />
                Supprimer
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDocuments;
