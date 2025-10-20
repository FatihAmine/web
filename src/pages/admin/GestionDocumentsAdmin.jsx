import React, { useState } from 'react';
import Sidebar from '../component/sidebar';
import CustomDropdown from '../component/CustomDropdown';
import {
  Menu,
  X,
  Bell,
  Search,
  Filter,
  FileText,
  Calendar,
  User,
  HardDrive,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';
import '../../css/admin/GestionDocumentsAdmin.css';
import { useNavigate } from 'react-router-dom';

const userData = {
  firstName: "Mohammed",
  lastName: "Alaoui",
  role: "Super Administrateur",
  profilePic: "https://ui-avatars.com/api/?name=Mohammed+Alaoui&background=17766e&color=fff&size=200"
};

const AdminDocuments = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [documents, setDocuments] = useState([
    { id: 1, name: "Attestation d'inscription - Ahmed Bennani", type: "Attestation", student: "Ahmed Bennani", status: "generated", date: "2025-10-15", size: "245 KB" },
    { id: 2, name: "Bulletin S1 - Fatima Idrissi", type: "Bulletin", student: "Fatima Idrissi", status: "pending", date: "2025-10-14", size: "180 KB" },
    { id: 3, name: "Certificat de réussite - Karim Tazi", type: "Certificat", student: "Karim Tazi", status: "generated", date: "2025-10-13", size: "320 KB" },
    { id: 4, name: "Convention de stage - Sara Fassi", type: "Convention", student: "Sara Fassi", status: "draft", date: "2025-10-12", size: "156 KB" },
    { id: 5, name: "Relevé de notes - Omar Belkhir", type: "Bulletin", student: "Omar Belkhir", status: "generated", date: "2025-10-11", size: "198 KB" },
    { id: 6, name: "Attestation de stage - Amina Rachid", type: "Attestation", student: "Amina Rachid", status: "pending", date: "2025-10-10", size: "220 KB" }
  ]);

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const filterOptions = [
    { value: '', label: 'Tous les statuts', icon: Filter, color: '#5eead4' },
    { value: 'pending', label: 'En attente', icon: Clock, color: '#f59e0b' },
    { value: 'generated', label: 'Généré', icon: CheckCircle, color: '#10b981' }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'generated': return 'admin-docs-status-generated';
      case 'pending': return 'admin-docs-status-pending';
      case 'draft': return 'admin-docs-status-draft';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'generated': return 'Généré';
      case 'pending': return 'En attente';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  const filteredDocs = documents.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.type.toLowerCase().includes(query.toLowerCase()) ||
      d.student.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = !statusFilter || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalDocs = documents.length;
  const generatedDocs = documents.filter(d => d.status === 'generated').length;
  const pendingDocs = documents.filter(d => d.status === 'pending').length;

  return (
    <div className="admin-docs-container">
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
          className="admin-docs-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`admin-docs-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <button
            className="admin-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="admin-page-title">Gestion Documents</h1>
          <div className="admin-header-actions">
            <button className="admin-search-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <main className="admin-docs-main">
          <section className="admin-docs-content">
            
            {/* Stats Cards */}
            <div className="admin-docs-stats-grid">
              <div className="admin-docs-stat-card stat-total">
                <div className="stat-icon">
                  <FileText size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Total Documents</p>
                  <h3 className="stat-value">{totalDocs}</h3>
                </div>
              </div>
              <div className="admin-docs-stat-card stat-generated">
                <div className="stat-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Générés</p>
                  <h3 className="stat-value">{generatedDocs}</h3>
                </div>
              </div>
              <div className="admin-docs-stat-card stat-pending">
                <div className="stat-icon">
                  <Calendar size={24} />
                </div>
                <div className="stat-info">
                  <p className="stat-label">En Attente</p>
                  <h3 className="stat-value">{pendingDocs}</h3>
                </div>
              </div>
            </div>

            {/* Toolbar with Custom Dropdown */}
            <div className="admin-docs-toolbar">
              <CustomDropdown
                options={filterOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                icon={Filter}
              />
              <div className="admin-docs-searchrow">
                <Search size={18} />
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

            {/* Documents Grid */}
            <div className="admin-docs-grid">
              {filteredDocs.length === 0 ? (
                <div className="admin-docs-empty-state">
                  <FileText size={64} />
                  <h3>Aucun document trouvé</h3>
                  <p>Essayez de modifier vos filtres de recherche</p>
                </div>
              ) : (
                filteredDocs.map(doc => (
                  <div key={doc.id} className="admin-docs-card">
                    <div className="doc-card-header">
                      <div className="doc-icon">
                        <FileText size={20} />
                      </div>
                      <span className={`doc-status ${getStatusClass(doc.status)}`}>
                        {getStatusText(doc.status)}
                      </span>
                    </div>
                    <div className="doc-card-body">
                      <h3 className="doc-title">{doc.name}</h3>
                      <div className="doc-meta">
                        <div className="doc-meta-item">
                          <User size={14} />
                          <span>{doc.student}</span>
                        </div>
                        <div className="doc-meta-item">
                          <Calendar size={14} />
                          <span>{doc.date}</span>
                        </div>
                        {doc.size && (
                          <div className="doc-meta-item">
                            <HardDrive size={14} />
                            <span>{doc.size}</span>
                          </div>
                        )}
                      </div>
                      <div className="doc-type-badge">
                        <span className={`doc-type ${doc.type.toLowerCase()}`}>{doc.type}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDocuments;
