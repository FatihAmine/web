import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import '../../../css/Login.css';
import logo from '../../../assets/Logo/Logo.png';

import { auth, signInWithEmailAndPassword, setupFCM, onForegroundMessage } from '../../../firebaseClient';
import api from '../../../api';

const Login = () => {
  const canvasRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const navigate = useNavigate();

  // (Optionnel) écouter les notifications quand l'app est au premier plan
  useEffect(() => {
    onForegroundMessage((payload) => {
      console.log('[FCM] Foreground message:', payload);
    });
  }, []);

  // ==== Ton animation canvas inchangée ====
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
        const y = canvas.height / 2 + Math.sin((x + offset) * 0.01) * 50 + Math.sin((x + offset) * 0.02) * 30;
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
    return () => { window.removeEventListener('resize', setCanvasSize); cancelAnimationFrame(animationId); };
  }, []);

  // ==== LOGIN sécurisé: Firebase -> /me -> FCM -> check admin -> navigate ====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg(null);
    setLoading(true);

    try {
      // 1) Connexion Firebase
      await signInWithEmailAndPassword(auth, email.trim(), password);

      // 2) Ping backend /me (met à jour users/{uid}, log 'LOGIN')
      const { data: me } = await api.get('/me');

      // 3) Vérifie rôle admin
      if (me.role !== 'admin') {
        setErrMsg("Accès réservé à l'administration.");
        setLoading(false);
        return;
      }

      // 4) FCM (première connexion) : permission + envoi du token
      const { supported, token } = await setupFCM();
      if (supported && token) {
        await api.post('/me/fcm', { token }); // stocké côté back (arrayUnion)
      }

      // 5) Redirection
      setLoading(false);
      navigate("/AdminDashboard");
    } catch (err) {
      console.error(err);
      setErrMsg("Email ou mot de passe invalide.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <canvas ref={canvasRef} className="login-canvas-bg" />
      <div className="login-wrapper">
        <div className="login-content">
          <div className="login-glow-effect"></div>
          <div className="login-card">
            <div className="login-header">
              <div className="login-logo">
                <img src={logo} alt="Ynov Logo" className="login-logo-img" />
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
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {errMsg && <div style={{ color: 'tomato', marginBottom: 8 }}>{errMsg}</div>}

              <button disabled={loading} className="login-submit-btn">
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
