import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import '../../../css/Login.css';
import logo from '../../../assets/Logo/Logo.png'; 

const Login = () => {
  const canvasRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 
  
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
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1500;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.z -= 3;
        if (this.z <= 0) {
          this.reset();
          this.z = 1500;
        }
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

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      time += 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    navigate("/AdminDashboard");
  };

  return (
    <div className="login-container">
      <canvas ref={canvasRef} className="login-canvas-bg" />
      <div className="login-wrapper">
        <div className="login-content">
          <div className="login-glow-effect"></div>
          <div className="login-card">
            <div className="login-header">
              <div>
                <div className="login-logo">
                  <img src={logo} alt="Ynov Logo" className="login-logo-img" />
                </div>
              </div>
              <h1 className="login-title">Ynov Campus</h1>
              <p className="login-subtitle">Connectez-vous à votre espace</p>
            </div>

            <div className="login-form">
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

              <div className="login-form-options">
                <label className="login-remember-me">
                  <input type="checkbox" className="login-checkbox" />
                  Se souvenir de moi
                </label>
                <button className="login-forgot-password">Mot de passe oublié?</button>
              </div>

              <button onClick={handleSubmit} className="login-submit-btn">
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;