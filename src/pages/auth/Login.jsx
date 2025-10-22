// src/pages/Login.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import '../../css/Login.css';
import logo from '../../assets/Logo/Logo.png';

// Firebase + axios API
import { auth, signInWithEmailAndPassword, setupFCM } from '../../firebaseClient';
import api from '../../api';

function routeForRole(role) {
  switch (role) {
    case 'etudiant':  return '/etudiant';
    case 'parent':    return '/parent';
    case 'personnel': return '/personnel';
    default:          return '/login';
  }
}

const Login = () => {
  const canvasRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  // Forgot password flow
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerifyCode, setShowVerifyCode] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // small loaders for each step of forgot flow
  const [busyForgot, setBusyForgot] = useState(false);
  const [busyVerify, setBusyVerify] = useState(false);
  const [busyReset, setBusyReset] = useState(false);

  const navigate = useNavigate();

  // ====== Canvas BG (inchangé) ======
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
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
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

  // ====== Login flow ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      const { data: me } = await api.get('/me');

      const platform = (navigator.platform || '').slice(0, 32);
      const ua = (navigator.userAgent || '').slice(0, 200);
      const deviceInfo = `${platform} • ${ua}`.slice(0, 255);

      try {
        await api.post('/session/log-signin', { provider: 'password', deviceInfo });
      } catch (e) {
        console.warn('SIGN_IN log failed', e?.response?.data || e.message);
      }

      try {
        const { supported, token } = await setupFCM();
        if (supported && token && token.length >= 10) {
          await api.post('/fcm/register', { token });
        }
      } catch (e) {
        console.warn('FCM register failed', e?.response?.data || e.message);
      }

      navigate(routeForRole(me.role), { replace: true });
    } catch (err) {
      console.error('LOGIN ERR', err?.response?.data || err.message);
      alert('Identifiants invalides ou erreur réseau.');
    } finally {
      setBusy(false);
    }
  };

  // ====== Mot de passe oublié (règles: email doit exister & ne pas être admin) ======
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail || busyForgot) return;

    setBusyForgot(true);
    try {
      await api.post('/password/forgot', { email: forgotEmail });
      setShowForgotPassword(false);
      setShowVerifyCode(true);
      alert('Un code a été envoyé à votre adresse e-mail.');
    } catch (err) {
      const status = err?.response?.status;
      const code   = err?.response?.data?.error;
      console.error('forgot', err?.response?.data || err.message);

      if (status === 404 && code === 'EMAIL_NOT_FOUND') {
        // ✅ Ta règle: email inconnu ou admin => même message
        alert("Email n'existe plus.");
        // on reste sur ce step (ne pas avancer)
      } else {
        alert("Impossible d'envoyer le code. Réessayez.");
      }
    } finally {
      setBusyForgot(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !verificationCode || busyVerify) return;

    setBusyVerify(true);
    try {
      await api.post('/password/verify', {
        email: forgotEmail,
        code: verificationCode,
      });
      setShowVerifyCode(false);
      setShowResetPassword(true);
    } catch (err) {
      const code = err?.response?.data?.error;
      console.error('verify', err?.response?.data || err.message);

      if (code === 'CODE_EXPIRED') {
        alert("Code expiré. Cliquez sur 'Renvoyer le code'.");
      } else if (code === 'TOO_MANY_ATTEMPTS') {
        alert("Trop de tentatives. Demandez un nouveau code.");
      } else if (code === 'CODE_ALREADY_USED') {
        alert("Ce code a déjà été utilisé. Demandez un nouveau code.");
      } else {
        alert("Code invalide.");
      }
    } finally {
      setBusyVerify(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (busyReset) return;

    if (newPassword !== confirmNewPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    if (!forgotEmail || !verificationCode) {
      alert('Session de réinitialisation invalide.');
      return;
    }

    setBusyReset(true);
    try {
      await api.post('/password/reset', {
        email: forgotEmail,
        code: verificationCode,
        newPassword,
      });
      alert('Mot de passe réinitialisé avec succès !');

      // reset UI
      setShowResetPassword(false);
      setForgotEmail('');
      setVerificationCode('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      const code = err?.response?.data?.error;
      console.error('reset', err?.response?.data || err.message);

      if (code === 'CODE_EXPIRED') {
        alert("Code expiré. Cliquez sur 'Renvoyer le code'.");
      } else if (code === 'TOO_MANY_ATTEMPTS') {
        alert("Trop de tentatives. Demandez un nouveau code.");
      } else if (code === 'CODE_ALREADY_USED') {
        alert("Ce code a déjà été utilisé. Demandez un nouveau code.");
      } else if (code === 'INVALID_CODE') {
        alert("Code invalide. Vérifiez et réessayez.");
      } else {
        alert("Impossible de réinitialiser le mot de passe.");
      }
    } finally {
      setBusyReset(false);
    }
  };

  const handleResendCode = async () => {
    if (!forgotEmail) {
      alert("Entrez d'abord votre email.");
      return;
    }
    try {
      await api.post('/password/forgot', { email: forgotEmail });
      alert('Nouveau code envoyé.');
    } catch (err) {
      const status = err?.response?.status;
      const code   = err?.response?.data?.error;

      if (status === 404 && code === 'EMAIL_NOT_FOUND') {
        alert("Email n'existe plus.");
      } else {
        alert('Le code n’a pas pu être renvoyé.');
      }
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowVerifyCode(false);
    setShowResetPassword(false);
    setForgotEmail('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="login-container">
      <canvas ref={canvasRef} className="logingin-canvas-bg" />
      <div className="login-wrapper">
        <div className="login-content">
          <div className="login-glow-effect"></div>
          <div className="login-card">
            {/* Login Form */}
            {!showForgotPassword && !showVerifyCode && !showResetPassword && (
              <>
                <div className="login-header">
                  <div>
                    <div className="login-logo">
                      <img src={logo} alt="Ynov Logo" className="login-logo-img" />
                    </div>
                  </div>
                  <h1 className="login-title">Ynov Campus</h1>
                  <p className="login-subtitle">Connectez-vous à votre espace</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
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

                  <div className="login-form-group">
                    <label className="login-label">Mot de passe</label>
                    <div className="login-input-wrapper">
                      <Lock className="login-input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="login-toggle-password"
                        aria-label="Afficher/masquer le mot de passe"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="login-form-options">
                    <label className="login-remember-me">
                      <input type="checkbox" className="login-checkbox" />
                      Se souvenir de moi
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="login-forgot-password"
                    >
                      Mot de passe oublié?
                    </button>
                  </div>

                  <button type="submit" disabled={busy} className="login-submit-btn">
                    {busy ? 'Connexion…' : 'Se connecter'}
                  </button>
                </form>
              </>
            )}

            {/* Forgot Password - Email Input */}
            {showForgotPassword && (
              <>
                <div className="login-header">
                  <button onClick={handleBackToLogin} className="login-back-btn">
                    <ArrowLeft size={20} />
                    Retour
                  </button>
                  <h1 className="login-title">Mot de passe oublié?</h1>
                  <p className="login-subtitle">
                    Entrez votre email pour recevoir un code de vérification
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="login-form">
                  <div className="login-form-group">
                    <label className="login-label">Email</label>
                    <div className="login-input-wrapper">
                      <Mail className="login-input-icon" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="login-input"
                        placeholder="votre.email@ynov.com"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="login-submit-btn" disabled={busyForgot}>
                    {busyForgot ? 'Envoi…' : 'Envoyer le code'}
                  </button>
                </form>
              </>
            )}

            {/* Verify Code */}
            {showVerifyCode && (
              <>
                <div className="login-header">
                  <button onClick={handleBackToLogin} className="login-back-btn">
                    <ArrowLeft size={20} />
                    Retour
                  </button>
                  <h1 className="login-title">Code de vérification</h1>
                  <p className="login-subtitle">
                    Entrez le code envoyé à {forgotEmail}
                  </p>
                </div>

                <form onSubmit={handleVerifyCode} className="login-form">
                  <div className="login-form-group">
                    <label className="login-label">Code de vérification</label>
                    <div className="login-input-wrapper">
                      <Lock className="login-input-icon" />
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="login-input"
                        placeholder="000000"
                        maxLength="6"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="login-submit-btn" disabled={busyVerify}>
                    {busyVerify ? 'Vérification…' : 'Vérifier le code'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="login-resend-btn"
                    disabled={busyVerify || busyForgot}
                  >
                    Renvoyer le code
                  </button>
                </form>
              </>
            )}

            {/* Reset Password */}
            {showResetPassword && (
              <>
                <div className="login-header">
                  <button onClick={handleBackToLogin} className="login-back-btn">
                    <ArrowLeft size={20} />
                    Retour
                  </button>
                  <h1 className="login-title">Nouveau mot de passe</h1>
                  <p className="login-subtitle">
                    Créez un nouveau mot de passe sécurisé
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="login-form">
                  <div className="login-form-group">
                    <label className="login-label">Nouveau mot de passe</label>
                    <div className="login-input-wrapper">
                      <Lock className="login-input-icon" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="login-input"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="login-toggle-password"
                        aria-label="Afficher/masquer nouveau mot de passe"
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="login-form-group">
                    <label className="login-label">Confirmer le mot de passe</label>
                    <div className="login-input-wrapper">
                      <Lock className="login-input-icon" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="login-input"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="login-toggle-password"
                        aria-label="Afficher/masquer confirmation"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="login-submit-btn" disabled={busyReset}>
                    {busyReset ? 'Mise à jour…' : (<><Check size={20} style={{ marginRight: '8px' }} /> Réinitialiser le mot de passe</>)}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
