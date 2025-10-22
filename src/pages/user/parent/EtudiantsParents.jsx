// src/pages/user/parent/EtudiantsParents.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../component/sidebarparent';
import {
  Bell,
  Menu,
  X,
  User,
  Mail,
  GraduationCap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../css/parent/EtudiantsParents.css';
import api from '../../../api';

const EtudiantsParents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeTab, setActiveTab] = useState('children');

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const [selectedChild, setSelectedChild] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/parent/login');
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setLoadError('');
      try {
        const { data } = await api.get('/parent/children'); // { ok, items: [...] }
        if (!mounted) return;
        setChildren(Array.isArray(data?.items) ? data.items : []);
      } catch (e) {
        console.error('GET /parent/children failed', e?.response?.data || e.message);
        if (!mounted) return;
        setLoadError("Impossible de charger la liste des enfants.");
        setChildren([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const displayNameOf = (c) =>
    c?.displayName ||
    `${c?.prenom || ''} ${c?.nom || ''}`.trim() ||
    c?.email ||
    c?.uid;

  const classOf = (c) =>
    [c?.niveau, c?.filiere].filter(Boolean).join(' • ');

  const openChildModal = (childRaw) => {
    const child = {
      uid: childRaw?.uid,
      name: displayNameOf(childRaw),
      class: classOf(childRaw),
      year: childRaw?.academicYear || childRaw?.annee || null,
      birthDate: childRaw?.birthDate || null,
      matricule: childRaw?.matricule || childRaw?.studentId || null,
      email: childRaw?.email || null,
    };
    setSelectedChild(child);
    setShowModal(true);
  };

  const closeChildModal = () => {
    setShowModal(false);
    setSelectedChild(null);
  };

  return (
    <div className="parent-children-page">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className={`parent-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="parent-header">
          <button
            className="parent-toggle-sidebar-btn mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="parent-page-title">Mes Enfants</h1>
          <div className="parent-header-actions">
            <button className="parent-notif-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
          </div>
        </header>

        <div className="parent-children-content">
          <div className="parent-children-header">
            <p className="parent-children-subtitle">
              Consultez les informations de vos enfants inscrits
            </p>
          </div>

          {loading && (
            <div className="parent-children-empty">
              <User size={48} />
              <h3>Chargement…</h3>
              <p>Récupération de vos enfants.</p>
            </div>
          )}

          {!loading && loadError && (
            <div className="parent-children-empty">
              <User size={48} />
              <h3>Erreur</h3>
              <p>{loadError}</p>
            </div>
          )}

          {!loading && !loadError && children.length === 0 && (
            <div className="parent-children-empty">
              <User size={48} />
              <h3>Aucun enfant</h3>
              <p>Aucun étudiant n’est rattaché à votre compte.</p>
            </div>
          )}

          {!loading && !loadError && children.length > 0 && (
            <div className="parent-children-grid">
              {children.map((c) => {
                const name = displayNameOf(c);
                const klass = classOf(c);
                const email = c?.email;

                return (
                  <div className="parent-children-card" key={c.uid}>
                    <div className="child-card-header">
                      <div className="child-avatar">
                        <User size={32} />
                      </div>
                    </div>
                    <div className="child-card-body">
                      <h3 className="child-name">{name}</h3>
                      <div className="child-info">
                        {klass && (
                          <div className="child-info-item">
                            <GraduationCap size={16} />
                            <span>{klass}</span>
                          </div>
                        )}
                        {email && (
                          <div className="child-info-item">
                            <Mail size={16} />
                            <span>{email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="child-card-footer">
                      <button
                        className="child-details-btn"
                        onClick={() => openChildModal(c)}
                      >
                        Voir les détails
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {showModal && selectedChild && (
        <div className="parent-children-modal-backdrop">
          <div className="parent-children-modal">
            <button className="parent-children-modal-close" onClick={closeChildModal}>
              <X size={22} />
            </button>
            <h3 className="parent-children-modal-title">
              <User size={18} style={{ verticalAlign: 'middle', marginRight: 8, color: '#5eead4' }} />
              Détails de l'étudiant
            </h3>
            <div className="parent-children-modal-body">
              <div className="modal-field">
                <strong>Nom complet :</strong>
                <span>{selectedChild.name}</span>
              </div>

              {selectedChild.class && (
                <div className="modal-field">
                  <strong>Classe :</strong>
                  <span>{selectedChild.class}</span>
                </div>
              )}

              {selectedChild.year && (
                <div className="modal-field">
                  <strong>Année scolaire :</strong>
                  <span>{selectedChild.year}</span>
                </div>
              )}

              {selectedChild.birthDate && (
                <div className="modal-field">
                  <strong>Date de naissance :</strong>
                  <span>{selectedChild.birthDate}</span>
                </div>
              )}

              {selectedChild.matricule && (
                <div className="modal-field">
                  <strong>Matricule :</strong>
                  <span>{selectedChild.matricule}</span>
                </div>
              )}

              {selectedChild.email && (
                <div className="modal-field">
                  <strong>Email :</strong>
                  <span>{selectedChild.email}</span>
                </div>
              )}
            </div>
            <button className="parent-children-modal-close-btn" onClick={closeChildModal}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EtudiantsParents;
