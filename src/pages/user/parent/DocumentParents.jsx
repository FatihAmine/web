import React, { useState } from 'react';
import Sidebar from '../../component/sidebarparent';
import CustomDropdown from '../../component/CustomDropdown';
import {
  Bell,
  FileText,
  Menu,
  X,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Search,
  User,
  Filter,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/parent/DocumentParents.css';

const DocumentParents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [activeTab, setActiveTab] = useState('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterChild, setFilterChild] = useState('');
  const navigate = useNavigate();

  const userData = {
    firstName: "Fatima",
    lastName: "Bennani",
    role: "Parent",
    profilePic: "https://ui-avatars.com/api/?name=Fatima+Bennani&background=17766e&color=fff&size=200"
  };

  const children = [
    { id: 1, name: "Ahmed Bennani" },
    { id: 2, name: "Sara Bennani" }
  ];

  const docs = [
    {
      id: 1,
      childName: "Ahmed Bennani",
      type: "Bulletin",
      name: "Bulletin S1 2024-2025",
      date: "2025-10-05",
      status: "approved",
      downloadUrl: "#"
    },
    {
      id: 2,
      childName: "Sara Bennani",
      type: "Attestation",
      name: "Attestation de Scolarité",
      date: "2025-09-28",
      status: "approved",
      downloadUrl: "#"
    },
    {
      id: 4,
      childName: "Sara Bennani",
      type: "Bulletin",
      name: "Relevé de Notes S2",
      date: "2025-08-20",
      status: "approved",
      downloadUrl: "#"
    },
    {
      id: 5,
      childName: "Ahmed Bennani",
      type: "Attestation",
      name: "Attestation de Réussite",
      date: "2025-07-15",
      status: "approved",
      downloadUrl: "#"
    },
    {
      id: 6,
      childName: "Sara Bennani",
      type: "Convention",
      name: "Convention de Stage",
      date: "2025-06-10",
      status: "approved",
      downloadUrl: "#"
    }
  ];

  const typeOptions = [
    { value: '', label: 'Tous les types', icon: Filter, color: '#5eead4' },
    { value: 'Bulletin', label: 'Bulletin', icon: FileText, color: '#3b82f6' },
    { value: 'Attestation', label: 'Attestation', icon: FileText, color: '#10b981' },
    { value: 'Certificat', label: 'Certificat', icon: FileText, color: '#8b5cf6' },
    { value: 'Convention', label: 'Convention', icon: FileText, color: '#f59e0b' }
  ];

  const childOptions = [
    { value: '', label: 'Tous les enfants', icon: Users, color: '#5eead4' },
    ...children.map(child => ({
      value: child.name,
      label: child.name,
      icon: User,
      color: '#5eead4'
    }))
  ];

  const handleLogout = () => {
    navigate('/parent/login');
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return AlertCircle;
      case 'rejected': return XCircle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'approved': return 'Disponible';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejeté';
      default: return 'En attente';
    }
  };

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.childName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === '' || doc.type === filterType;
    const matchesChild = filterChild === '' || doc.childName === filterChild;
    return matchesSearch && matchesType && matchesChild;
  });

  // Stats
  const totalDocs = docs.length;
  const availableDocs = docs.filter(d => d.status === 'approved').length;
  const pendingDocs = docs.filter(d => d.status === 'pending').length;

  return (
    <div className="parent-docs-page">
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

      <main className={`parent-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="parent-header">
          <button 
            className="parent-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="parent-page-title">Documents</h1>
          <div className="parent-header-actions">
            <button className="parent-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="parent-docs-content">
          {/* Stats Cards */}
          <div className="parent-docs-stats-grid">
            <div className="parent-docs-stat-card stat-total">
              <div className="stat-icon">
                <FileText size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Documents</p>
                <h3 className="stat-value">{totalDocs}</h3>
              </div>
            </div>
            <div className="parent-docs-stat-card stat-available">
              <div className="stat-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Disponibles</p>
                <h3 className="stat-value">{availableDocs}</h3>
              </div>
            </div>
            <div className="parent-docs-stat-card stat-pending">
              <div className="stat-icon">
                <AlertCircle size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">En Attente</p>
                <h3 className="stat-value">{pendingDocs}</h3>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="parent-docs-filters">
            <CustomDropdown
              options={childOptions}
              value={filterChild}
              onChange={setFilterChild}
              icon={Users}
            />
            <CustomDropdown
              options={typeOptions}
              value={filterType}
              onChange={setFilterType}
              icon={Filter}
            />
            <div className="parent-docs-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher documents..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="parent-docs-search-input"
              />
            </div>
          </div>

          {/* Documents Grid */}
          <div className="parent-docs-grid">
            {filteredDocs.length === 0 ? (
              <div className="parent-docs-empty">
                <FileText size={64} />
                <h3>Aucun document trouvé</h3>
                <p>
                  {searchTerm || filterType || filterChild
                    ? "Essayez de modifier vos critères de recherche"
                    : "Aucun document disponible pour le moment"}
                </p>
              </div>
            ) : (
              filteredDocs.map(doc => {
                const StatusIcon = getStatusIcon(doc.status);
                return (
                  <div key={doc.id} className="parent-docs-card">
                    <div className="doc-card-header">
                      <div className="doc-icon">
                        <FileText size={20} />
                      </div>
                      <span 
                        className="doc-status"
                        style={{
                          background: `${getStatusColor(doc.status)}1a`,
                          color: getStatusColor(doc.status)
                        }}
                      >
                        <StatusIcon size={16} />
                        {getStatusText(doc.status)}
                      </span>
                    </div>
                    <div className="doc-card-body">
                      <h3 className="doc-title">{doc.name}</h3>
                      <div className="doc-child-badge">
                        <User size={14} />
                        <span>{doc.childName}</span>
                      </div>
                      <div className="doc-meta">
                        <div className="doc-meta-item">
                          <Calendar size={14} />
                          <span>{doc.date}</span>
                        </div>
                        <div className="doc-meta-item">
                          <FileText size={14} />
                          <span>{doc.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="doc-card-footer">
                      {doc.status === 'approved' && doc.downloadUrl && (
                        <a
                          href={doc.downloadUrl}
                          className="doc-download-btn"
                          download
                        >
                          <Download size={16} />
                          <span>Télécharger</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentParents;
