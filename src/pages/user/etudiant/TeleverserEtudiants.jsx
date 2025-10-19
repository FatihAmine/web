// src/components/Etudiant/TeleverserEtudiant.jsx
import React, { useState, useRef } from 'react';
import {
  Home,
  FileText,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Eye,
  File,
  Trash2,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/etudiant/TeleverserEtudiants.css';

const TeleverserEtudiant = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const userData = {
    firstName: "Mohamed",
    lastName: "Alami",
    profilePic: "https://ui-avatars.com/api/?name=Mohamed+Alami&background=17766e&color=fff&size=200"
  };

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Tableau de bord', path: '/etudiant' },
    { id: 'documents', icon: FileText, label: 'Mes Documents', path: '/etudiant/documents' },
    { id: 'requests', icon: Clock, label: 'Mes Demandes', path: '/etudiant/demandes' },
    { id: 'upload', icon: Upload, label: 'Téléverser', path: '/etudiant/upload' },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/etudiant/notifications' },
    { id: 'settings', icon: Settings, label: 'Paramètres', path: '/etudiant/settings' }
  ];

  const documentTypes = [
    "Attestation de Scolarité",
    "Attestation d'Inscription", 
    "Attestation de Réussite",
    "Certificat de Scolarité",
    "Relevé de Notes",
    "Bulletin Semestriel",
    "Convention de Stage",
    "Certificat de Stage",
    "Rapport de Stage",
    "Mémoire",
    "Projet de Fin d'Études",
    "Autre"
  ];

  const yearOptions = [
    "2025",
    "2024", 
    "2023",
    "2022",
    "2021"
  ];

  // Mock uploaded files history
  const uploadedFiles = [
    {
      id: 1,
      name: "Bulletin_S1_2024.pdf",
      type: "Bulletin Semestriel",
      uploadDate: "2025-10-15",
      size: "2.3 MB",
      status: "approved"
    },
    {
      id: 2,
      name: "Convention_Stage_Maroc_YNOV.pdf", 
      type: "Convention de Stage",
      uploadDate: "2025-10-12",
      size: "1.8 MB",
      status: "pending"
    },
    {
      id: 3,
      name: "Attestation_Inscription_2025.pdf",
      type: "Attestation d'Inscription",
      uploadDate: "2025-10-10",
      size: "1.2 MB", 
      status: "rejected"
    }
  ];

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
      progress: 0
    }));
    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setSelectedFiles(selectedFiles.filter(f => f.id !== fileId));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
      progress: 0
    }));
    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const simulateUpload = () => {
    if (selectedFiles.length === 0 || !selectedDocumentType || !selectedYear) {
      alert('Veuillez remplir tous les champs requis et sélectionner au moins un fichier.');
      return;
    }

    setIsUploading(true);
    
    selectedFiles.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setUploadProgress(prev => ({
          ...prev,
          [file.id]: progress
        }));
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(prev => ({
          ...prev,
          [file.id]: 100
        }));
      }, 3000);
    });

    setTimeout(() => {
      setIsUploading(false);
      setShowSuccessModal(true);
      // Reset form
      setTimeout(() => {
        setSelectedFiles([]);
        setSelectedDocumentType('');
        setSelectedYear('');
        setDescription('');
        setUploadProgress({});
        setShowSuccessModal(false);
      }, 2000);
    }, 3500);
  };

  const getFileStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      default: return <File size={16} />;
    }
  };

  const getFileStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getFileStatusText = (status) => {
    switch(status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="televerser-page">
      {/* Sidebar */}
      <aside className={`televerser-sidebar ${sidebarOpen ? 'televerser-sidebar-open' : 'televerser-sidebar-closed'}`}>
        <div className="televerser-sidebar-content">
          <div className="televerser-profile-section">
            <img src={userData.profilePic} alt="Profile" className="televerser-profile-pic" />
            {sidebarOpen && (
              <div className="televerser-profile-info">
                <h3 className="televerser-profile-name">{userData.firstName} {userData.lastName}</h3>
                <p className="televerser-profile-role">Étudiant</p>
              </div>
            )}
          </div>
          <nav className="televerser-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(item.path);
                }}
                className={`televerser-menu-item ${activeTab === item.id ? 'televerser-menu-item-active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
          <button className="televerser-disconnect-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="televerser-main-content">
        <header className="televerser-page-header">
          <button
            className="televerser-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="televerser-page-title">Téléverser des Documents</h1>
        </header>

        <div className="televerser-container">
          <div className="televerser-header">
            <div className="televerser-title-section">
              <p className="televerser-subtitle">Ajoutez vos documents personnels à votre dossier étudiant</p>
            </div>
          </div>

          <div className="televerser-form-container">
            {/* Upload Form */}
            <div className="televerser-form-card">
              <h2 className="televerser-form-title">Nouveau téléversement</h2>
              
              {/* Document Info */}
              <div className="televerser-form-section">
                <div className="televerser-form-row">
                  <div className="televerser-form-group">
                    <label className="televerser-form-label">Type de document *</label>
                    <select
                      value={selectedDocumentType}
                      onChange={(e) => setSelectedDocumentType(e.target.value)}
                      className="televerser-form-select"
                      required
                    >
                      <option value="">Sélectionnez le type</option>
                      {documentTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="televerser-form-group">
                    <label className="televerser-form-label">Année académique *</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="televerser-form-select"
                      required
                    >
                      <option value="">Sélectionnez l'année</option>
                      {yearOptions.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="televerser-form-group">
                  <label className="televerser-form-label">Description (optionnelle)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="televerser-form-textarea"
                    placeholder="Ajoutez une description ou des notes sur ce document..."
                    rows="3"
                  />
                </div>
              </div>

              {/* File Upload Zone */}
              <div className="televerser-upload-section">
                <div
                  className="televerser-dropzone"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={48} className="televerser-dropzone-icon" />
                  <h3 className="televerser-dropzone-title">Glissez vos fichiers ici</h3>
                  <p className="televerser-dropzone-text">
                    ou <span className="televerser-dropzone-link">cliquez pour parcourir</span>
                  </p>
                  <p className="televerser-dropzone-formats">
                    Formats acceptés: PDF, DOC, DOCX, JPG, PNG (Max: 10MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="televerser-file-input"
                  />
                </div>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="televerser-files-section">
                  <h3 className="televerser-files-title">Fichiers sélectionnés ({selectedFiles.length})</h3>
                  <div className="televerser-files-list">
                    {selectedFiles.map(file => (
                      <div key={file.id} className="televerser-file-item">
                        <div className="televerser-file-info">
                          <File size={20} className="televerser-file-icon" />
                          <div className="televerser-file-details">
                            <p className="televerser-file-name">{file.name}</p>
                            <p className="televerser-file-size">{file.size}</p>
                          </div>
                        </div>
                        {isUploading ? (
                          <div className="televerser-progress">
                            <div className="televerser-progress-bar">
                              <div 
                                className="televerser-progress-fill"
                                style={{ width: `${uploadProgress[file.id] || 0}%` }}
                              ></div>
                            </div>
                            <span className="televerser-progress-text">
                              {Math.round(uploadProgress[file.id] || 0)}%
                            </span>
                          </div>
                        ) : (
                          <button
                            className="televerser-remove-btn"
                            onClick={() => removeFile(file.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="televerser-form-footer">
                <button
                  className="televerser-submit-btn"
                  onClick={simulateUpload}
                  disabled={isUploading || selectedFiles.length === 0}
                >
                  {isUploading ? (
                    <>
                      <Clock size={20} />
                      Téléversement en cours...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Téléverser les fichiers
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Recent Uploads */}
            <div className="televerser-history-card">
              <h2 className="televerser-history-title">Téléversements récents</h2>
              <div className="televerser-history-list">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="televerser-history-item">
                    <div className="televerser-history-info">
                      <div className="televerser-history-header">
                        <p className="televerser-history-name">{file.name}</p>
                        <div 
                          className="televerser-history-status"
                          style={{ 
                            background: `${getFileStatusColor(file.status)}20`,
                            color: getFileStatusColor(file.status)
                          }}
                        >
                          {getFileStatusIcon(file.status)}
                          <span>{getFileStatusText(file.status)}</span>
                        </div>
                      </div>
                      <div className="televerser-history-details">
                        <span className="televerser-history-type">{file.type}</span>
                        <span className="televerser-history-date">{file.uploadDate}</span>
                        <span className="televerser-history-size">{file.size}</span>
                      </div>
                    </div>
                    <button className="televerser-history-btn">
                      <Eye size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="televerser-modal-overlay">
          <div className="televerser-success-modal">
            <div className="televerser-success-icon">
              <Check size={48} />
            </div>
            <h3 className="televerser-success-title">Téléversement réussi!</h3>
            <p className="televerser-success-text">
              Vos documents ont été téléversés avec succès. Ils seront traités dans les prochaines 24h.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeleverserEtudiant;
