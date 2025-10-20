import React, { useState } from 'react';
import Sidebar from '../../component/sidebarpersonnel';
import CustomDropdown from '../../component/CustomDropdown';
import {
  Bell,
  FileText,
  Menu,
  X,
  Search,
  Filter,
  Check,
  X as XIcon,
  Calendar,
  User,
  Clock,
  Upload,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/personnel/DocumentPersonnel.css';

const DocumentPersonnel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeTab, setActiveTab] = useState('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  const userData = {
    firstName: "Karim",
    lastName: "El Amrani",
    role: "Personnel Administratif",
    profilePic: "https://ui-avatars.com/api/?name=Karim+El+Amrani&background=17766e&color=fff&size=200"
  };

  const [documents, setDocuments] = useState([
    { id: 1, studentName: "Ahmed Bennani", type: "Attestation", name: "Attestation de Scolarité", date: "2025-10-03", status: "approved" },
    { id: 2, studentName: "Sara Idrissi", type: "Bulletin", name: "Bulletin S1 2024", date: "2025-09-29", status: "pending" },
    { id: 3, studentName: "Omar Tazi", type: "Certificat", name: "Certificat de Réussite", date: "2025-09-27", status: "approved" },
    { id: 4, studentName: "Leila Fassi", type: "Convention", name: "Convention de Stage", date: "2025-09-25", status: "rejected" },
    { id: 5, studentName: "Youssef Alaoui", type: "Relevé de Notes", name: "Relevé de Notes S2", date: "2025-09-20", status: "pending" },
    { id: 6, studentName: "Amina Rachid", type: "Attestation", name: "Attestation de Stage", date: "2025-09-18", status: "approved" }
  ]);

  const filterOptions = [
    { value: '', label: 'Tous les types', icon: Filter, color: '#5eead4' },
    { value: 'Attestation', label: 'Attestation', icon: FileText, color: '#10b981' },
    { value: 'Bulletin', label: 'Bulletin', icon: FileText, color: '#3b82f6' },
    { value: 'Certificat', label: 'Certificat', icon: FileText, color: '#8b5cf6' },
    { value: 'Convention', label: 'Convention', icon: FileText, color: '#f59e0b' },
    { value: 'Relevé de Notes', label: 'Relevé de Notes', icon: FileText, color: '#ec4899' }
  ];

  const handleLogout = () => {
    navigate('/personnel/login');
  };

  const openApprovalModal = (doc) => {
    setSelectedDoc(doc);
    setShowApprovalModal(true);
    setUploadedFile(null);
    setNotes('');
  };

  const openRejectionModal = (doc) => {
    setSelectedDoc(doc);
    setShowRejectionModal(true);
    setRejectionReason('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleApprove = (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      alert('Veuillez télécharger le document');
      return;
    }
    
    setDocuments(documents.map(doc => 
      doc.id === selectedDoc.id 
        ? { ...doc, status: 'approved', uploadedFile: uploadedFile.name, notes } 
        : doc
    ));
    
    setShowApprovalModal(false);
    setSelectedDoc(null);
    setUploadedFile(null);
    setNotes('');
  };

  const handleReject = (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      alert('Veuillez indiquer la raison du rejet');
      return;
    }
    
    setDocuments(documents.map(doc => 
      doc.id === selectedDoc.id 
        ? { ...doc, status: 'rejected', rejectionReason } 
        : doc
    ));
    
    setShowRejectionModal(false);
    setSelectedDoc(null);
    setRejectionReason('');
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'approved': return Check;
      case 'pending': return Clock;
      case 'rejected': return XIcon;
      default: return Clock;
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
      case 'approved': return 'Approuvé';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejeté';
      default: return 'En attente';
    }
  };

  const filteredDocs = documents.filter(doc =>
    (filterType === '' || doc.type === filterType) &&
    (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     doc.studentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalDocs = documents.length;
  const approvedDocs = documents.filter(d => d.status === 'approved').length;
  const pendingDocs = documents.filter(d => d.status === 'pending').length;

  return (
    <div className="personnel-docs-page">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userData={userData}
      />

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className={`personnel-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="personnel-header">
          <button 
            className="personnel-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="personnel-page-title">Gestion Documents</h1>
          <div className="personnel-header-actions">
            <button className="personnel-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="personnel-docs-content">
          {/* Stats Cards */}
          <div className="personnel-docs-stats-grid">
            <div className="personnel-docs-stat-card stat-total">
              <div className="stat-icon"><FileText size={24} /></div>
              <div className="stat-info">
                <p className="stat-label">Total Documents</p>
                <h3 className="stat-value">{totalDocs}</h3>
              </div>
            </div>
            <div className="personnel-docs-stat-card stat-approved">
              <div className="stat-icon"><Check size={24} /></div>
              <div className="stat-info">
                <p className="stat-label">Approuvés</p>
                <h3 className="stat-value">{approvedDocs}</h3>
              </div>
            </div>
            <div className="personnel-docs-stat-card stat-pending">
              <div className="stat-icon"><Clock size={24} /></div>
              <div className="stat-info">
                <p className="stat-label">En Attente</p>
                <h3 className="stat-value">{pendingDocs}</h3>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="personnel-docs-toolbar">
            <CustomDropdown
              options={filterOptions}
              value={filterType}
              onChange={setFilterType}
              icon={Filter}
            />
            <div className="personnel-docs-searchrow">
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher documents..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="personnel-docs-search-input"
              />
            </div>
          </div>

          {/* Documents Grid */}
          <div className="personnel-docs-grid">
            {filteredDocs.length === 0 ? (
              <div className="personnel-docs-empty-state">
                <FileText size={64} />
                <h3>Aucun document trouvé</h3>
                <p>Essayez de modifier vos filtres de recherche</p>
              </div>
            ) : (
              filteredDocs.map(doc => {
                const StatusIcon = getStatusIcon(doc.status);
                return (
                  <div key={doc.id} className="personnel-docs-card">
                    <div className="doc-card-header">
                      <div className="doc-icon"><FileText size={20} /></div>
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
                      <div className="doc-meta">
                        <div className="doc-meta-item"><User size={14} /><span>{doc.studentName}</span></div>
                        <div className="doc-meta-item"><Calendar size={14} /><span>{doc.date}</span></div>
                      </div>
                      <div className="doc-type-badge">
                        <span className={`doc-type ${doc.type.toLowerCase().replace(/\s+/g, '-')}`}>{doc.type}</span>
                      </div>
                    </div>

                    <div className="doc-card-footer">
                      <button 
                        className="doc-action-btn approve"
                        onClick={() => openApprovalModal(doc)}
                        disabled={doc.status === 'approved'}
                      >
                        <Check size={16} />
                        <span>Approuver</span>
                      </button>
                      <button 
                        className="doc-action-btn reject"
                        onClick={() => openRejectionModal(doc)}
                        disabled={doc.status === 'rejected'}
                      >
                        <XIcon size={16} />
                        <span>Refuser</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Approval Modal */}
      {showApprovalModal && selectedDoc && (
        <div className="personnel-modal-backdrop">
          <div className="personnel-modal">
            <button 
              className="personnel-modal-close"
              onClick={() => setShowApprovalModal(false)}
            >
              <X size={22} />
            </button>
            <h3 className="personnel-modal-title">
              <Check size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#10b981"}} />
              Approuver le document
            </h3>
            
            <form onSubmit={handleApprove} className="personnel-modal-form">
              <div className="modal-info-section">
                <div className="modal-field">
                  <strong>Étudiant :</strong>
                  <span>{selectedDoc.studentName}</span>
                </div>
                <div className="modal-field">
                  <strong>Document :</strong>
                  <span>{selectedDoc.name}</span>
                </div>
                <div className="modal-field">
                  <strong>Type :</strong>
                  <span>{selectedDoc.type}</span>
                </div>
                <div className="modal-field">
                  <strong>Date de demande :</strong>
                  <span>{selectedDoc.date}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Télécharger le document signé *</label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="file-input"
                    required
                  />
                  <label htmlFor="file-upload" className="file-upload-label">
                    <Upload size={24} />
                    <span>{uploadedFile ? uploadedFile.name : 'Cliquer pour télécharger'}</span>
                    <small>PDF, DOC, DOCX (Max 10MB)</small>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (optionnel)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-textarea"
                  placeholder="Ajouter des notes..."
                  rows="3"
                />
              </div>

              <div className="personnel-modal-footer">
                <button
                  type="button"
                  className="personnel-cancel-btn"
                  onClick={() => setShowApprovalModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="personnel-submit-btn approve">
                  <Check size={18} />
                  Approuver et envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedDoc && (
        <div className="personnel-modal-backdrop">
          <div className="personnel-modal">
            <button 
              className="personnel-modal-close"
              onClick={() => setShowRejectionModal(false)}
            >
              <X size={22} />
            </button>
            <h3 className="personnel-modal-title">
              <AlertCircle size={18} style={{verticalAlign: "middle", marginRight: 8, color: "#ef4444"}} />
              Refuser le document
            </h3>
            
            <form onSubmit={handleReject} className="personnel-modal-form">
              <div className="modal-info-section">
                <div className="modal-field">
                  <strong>Étudiant :</strong>
                  <span>{selectedDoc.studentName}</span>
                </div>
                <div className="modal-field">
                  <strong>Document :</strong>
                  <span>{selectedDoc.name}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Raison du rejet *</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="form-textarea"
                  placeholder="Veuillez indiquer la raison du rejet..."
                  rows="4"
                  required
                />
              </div>

              <div className="personnel-modal-footer">
                <button
                  type="button"
                  className="personnel-cancel-btn"
                  onClick={() => setShowRejectionModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="personnel-submit-btn reject">
                  <XIcon size={18} />
                  Confirmer le rejet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentPersonnel;
