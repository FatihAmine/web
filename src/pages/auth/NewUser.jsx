// src/pages/auth/NewUser.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Check } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../css/Login.css';
import logo from '../../assets/Logo/Logo.png';
import api from '../../api';

const NewUser = () => {
  const canvasRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [pwd1, setPwd1] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  // ===== Fond animé (identique à ta page) =====
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1500;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.z -= 3;
        if (this.z <= 0) { this.reset(); this.z = 1500; }
      }
      draw() {
        const x = (this.x - canvas.width / 2) * (1000 / this.z) + canvas.width / 2;
        const y = (this.y - canvas.height / 2) * (1000 / this.z) + canvas.height / 2;
        const size = (1 - this.z / 1500) * this.size * 3;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        const opacity = 1 - this.z / 1500;
        ctx.fillStyle = `rgba(23, 118, 110, ${opacity * 0.8})`;
        ctx.fill();
      }
    }
    const particles = Array.from({ length: 150 }, () => new Particle());

    const drawWave = (offset, color, alpha) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      for (let x = 0; x < canvas.width; x += 5) {
        const y =
          canvas.height / 2 +
          Math.sin((x + offset) * 0.01) * 50 +
          Math.sin((x + offset) * 0.02) * 30;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${color}, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(23, 118, 110, 0.05)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawWave(time * 2, '23, 118, 110', 0.3);
      drawWave(time * 3 + 100, '20, 100, 95', 0.2);
      drawWave(time * 1.5 + 200, '17, 85, 80', 0.15);

      particles.forEach((p) => { p.update(); p.draw(); });
      time += 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // ===== Validation du token dans l'URL =====
  useEffect(() => {
    const token = searchParams.get('t'); // notre jeton d’invitation
    if (!token) {
      setErr('Lien invalide : jeton manquant. Demandez un nouveau lien.');
      setLoading(false);
      return;
    }
    // Rien à vérifier côté front : la validation/consommation se fera au POST.
    setLoading(false);
  }, [searchParams]);

  // ===== Soumission: POST /api/auth/initial-password =====
  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting || loading) return;

    const token = searchParams.get('t');
    setErr('');

    if (!token) {
      setErr('Lien invalide : jeton manquant.');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr('Saisissez un email valide.');
      return;
    }
    if (!pwd1 || pwd1.length < 8) {
      setErr('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (pwd1 !== pwd2) {
      setErr('Les deux mots de passe ne correspondent pas.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/auth/initial-password', {
        token,
        email,
        password: pwd1
      });

      alert('Mot de passe défini avec succès. Vous pouvez vous connecter.');
      navigate('/login', { replace: true }); // login « normal »
    } catch (e) {
      const code = e?.response?.data?.error || '';
      let msg = "Impossible de définir le mot de passe.";
      if (code === 'TOKEN_NOT_FOUND') msg = "Lien invalide. Demandez un nouveau lien.";
      if (code === 'TOKEN_ALREADY_USED') msg = "Ce lien a déjà été utilisé.";
      if (code === 'TOKEN_EXPIRED') msg = "Lien expiré. Demandez un nouveau lien.";
      if (code === 'EMAIL_MISMATCH') msg = "L’email ne correspond pas à l’invitation.";
      if (code === 'WEAK_PASSWORD') msg = "Mot de passe trop faible (au moins 8 caractères).";
      setErr(msg);
      console.error('initial-password failed', e?.response?.data || e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <canvas ref={canvasRef} className="logingin-canvas-bg" />
      <div className="login-wrapper">
        <div className="login-content">
          <div className="login-glow-effect"></div>
          <div className="login-card">
            <div className="login-header">
              <div className="login-logo">
                <img src={logo} alt="Logo" className="login-logo-img" />
              </div>
              <h1 className="login-title">Ynov Campus</h1>
              <p className="login-subtitle">Définir le mot de passe</p>
            </div>

            {loading ? (
              <div style={{ color: '#cbd5e1', padding: '12px 0' }}>Chargement…</div>
            ) : (
              <form className="login-form" onSubmit={onSubmit}>
                {/* Email saisi par l'utilisateur */}
                <div className="login-form-group">
                  <label className="login-label">Email</label>
                  <div className="login-input-wrapper">
                    <Mail className="login-input-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="login-input"
                      placeholder="votre.email@ynov.com"
                      required
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="login-form-group">
                  <label className="login-label">Mot de passe</label>
                  <div className="login-input-wrapper">
                    <Lock className="login-input-icon" />
                    <input
                      type={show1 ? 'text' : 'password'}
                      value={pwd1}
                      onChange={(e) => setPwd1(e.target.value)}
                      className="login-input"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShow1((v) => !v)}
                      className="login-toggle-password"
                    >
                      {show1 ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirmation */}
                <div className="login-form-group">
                  <label className="login-label">Confirmer le mot de passe</label>
                  <div className="login-input-wrapper">
                    <Lock className="login-input-icon" />
                    <input
                      type={show2 ? 'text' : 'password'}
                      value={pwd2}
                      onChange={(e) => setPwd2(e.target.value)}
                      className="login-input"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShow2((v) => !v)}
                      className="login-toggle-password"
                    >
                      {show2 ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {err && (
                  <div style={{ color: '#ef4444', fontSize: 13, marginTop: 6 }}>
                    {err}
                  </div>
                )}

                <button type="submit" className="login-submit-btn" disabled={submitting}>
                  <Check size={20} style={{ marginRight: '8px' }} />
                  {submitting ? 'Enregistrement…' : 'Définir le mot de passe'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
