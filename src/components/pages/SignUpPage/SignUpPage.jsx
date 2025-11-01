import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { BeamScanButton } from "../../features/HUD";
import "./SignUpPage.css";
import sharedStyles from "../../../styles/shared.module.scss";
import "../../layout/NavBar/nav.css";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const bgRef = useRef(null);
  const fgRef = useRef(null);
  
  const [portalState] = useState({ colors: ['#ff00cc', '#00fff7', '#1a003a'] });
  const [glyphState] = useState(['ψ', 'Ω', 'Σ']);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced cursor effects
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const gravityField = document.getElementById('gravity-field');
    const wormhole = document.getElementById('wormhole');
    const dimensionalRift = document.getElementById('dimensional-rift');

    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        if (cursor) {
          cursor.style.left = e.clientX + 'px';
          cursor.style.top = e.clientY + 'px';
        }
        if (gravityField) {
          gravityField.style.left = e.clientX - 100 + 'px';
          gravityField.style.top = e.clientY - 100 + 'px';
        }
        if (dimensionalRift) {
          dimensionalRift.style.left = e.clientX - 150 + 'px';
          dimensionalRift.style.top = e.clientY - 150 + 'px';
        }
      });
    };

    const handleClick = (e) => {
      if (wormhole) {
        wormhole.style.left = e.clientX - 50 + 'px';
        wormhole.style.top = e.clientY - 50 + 'px';
        wormhole.classList.remove('ripple');
        void wormhole.offsetWidth;
        wormhole.classList.add('ripple');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // 3D Parallax effect
  useEffect(() => {
    const handleParallax = (e) => {
      const scrollY = window.scrollY;
      let mx = 0, my = 0;
      if (e && e.type === 'mousemove') {
        mx = (e.clientX / window.innerWidth) - 0.5;
        my = (e.clientY / window.innerHeight) - 0.5;
      }
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${mx * 30}px, ${-scrollY * 0.08 + my * 20}px, 0)`;
      }
      if (fgRef.current) {
        fgRef.current.style.transform = `translate3d(${mx * 80}px, ${-scrollY * 0.18 + my * 40}px, 0)`;
      }
    };
    window.addEventListener('scroll', handleParallax);
    window.addEventListener('mousemove', handleParallax);
    handleParallax();
    return () => {
      window.removeEventListener('scroll', handleParallax);
      window.removeEventListener('mousemove', handleParallax);
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Username must be less than 20 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call signup from AuthContext
      await signup(formData.username, formData.email, formData.password);
      
      // Redirect to homepage on success
      navigate('/');
    } catch (error) {
      setErrors({ submit: error.message || 'Sign up failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Enhanced Holographic Cursor System */}
      <div className="cursor" id="cursor"></div>
      <div className="gravity-field" id="gravity-field"></div>
      <div className="wormhole" id="wormhole"></div>
      <div className="dimensional-rift" id="dimensional-rift"></div>

      {/* 3D Parallax Layers */}
      <div ref={bgRef} className="parallax-bg-layer" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 1920 400" style={{position:'absolute',top:0,left:0,width:'100vw',height:'40vh',pointerEvents:'none', background: `linear-gradient(120deg, ${portalState.colors[0]} 0%, ${portalState.colors[1]} 60%, ${portalState.colors[2]} 100%)`, transition: 'background 1.2s cubic-bezier(0.4,0,0.2,1)'}}>
          <defs>
            <linearGradient id="bg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.18"/>
              <stop offset="100%" stopColor={portalState.colors[1]} stopOpacity="0.08"/>
            </linearGradient>
          </defs>
          <polygon points="0,0 1920,0 1600,400 0,300" fill="url(#bg-grad1)"/>
          <ellipse cx="1600" cy="80" rx="220" ry="60" fill={portalState.colors[2]+"22"}/>
        </svg>
      </div>
      <div ref={fgRef} className="parallax-fg-layer" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 1920 400" style={{position:'absolute',top:0,left:0,width:'100vw',height:'40vh',pointerEvents:'none'}}>
          <defs>
            <linearGradient id="fg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.22"/>
            </linearGradient>
          </defs>
          <polygon points="1920,0 1920,400 400,400 0,200" fill="url(#fg-grad1)"/>
          <ellipse cx="320" cy="120" rx="180" ry="40" fill="#fff2"/>
        </svg>
      </div>

      {/* Scene Background with Clip-Path */}
      <div className="scene-background bg-gallery-reality"></div>

      <div className="signup-page">
        {/* Navigation Bar */}
        <nav
        className="quantum-nav"
        style={{
          background: `linear-gradient(90deg, rgba(0,0,0,0.82) 80%, ${portalState.colors[1]}22 100%)`,
          boxShadow: `0 2px 16px 0 ${portalState.colors[2]}11`,
          transition: 'background 1.2s cubic-bezier(0.4,0,0.2,1), box-shadow 1.2s'
        }}
      >
        <div className="nav-logo">
          <span
            className="logo-text"
            data-text="N3XUS_GEOM"
            style={{
              color: '#fff',
              filter: `drop-shadow(0 0 4px ${portalState.colors[1]}66)`,
              transition: 'filter 1.2s'
            }}
          >N3XUS_GEOM</span>
          <span style={{
            marginLeft: 10,
            fontSize: 16,
            color: portalState.colors[2] + '99',
            letterSpacing: '0.12em',
            verticalAlign: 'middle',
            opacity: 0.55,
            filter: `blur(0.2px) drop-shadow(0 0 2px ${portalState.colors[1]}44)`,
            transition: 'color 1.2s, filter 1.2s, opacity 1.2s'
          }}>
            {glyphState.join(' ')}
          </span>
          <div className="logo-particles"></div>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link nav-link--home" data-dimension="0">// HOME</Link>
          {/* Hide SIGN UP link since we're on this page */}
          <Link to="/login" className="nav-link" data-dimension="1">// LOGIN</Link>
        </div>
        <div className="nav-quantum-field"></div>
        </nav>

        <div className="signup-container">
        <div className="signup-header">
          <h1 className="signup-title">
            <span className="title-glow title-word-left" data-word="CREVTE">CRE<span className="title-inverted-v">V</span>TE</span>
            <span className="title-separator">//</span>
            <span className="title-glow title-word-right" data-word="VCCOUNT"><span className="title-inverted-v">V</span>CCOUNT</span>
          </h1>
          <p className="signup-subtitle">
            / / JOIN THE QUANTUM REALM
          </p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${errors.username ? 'error' : ''} ${formData.username ? 'has-value' : ''}`}
              placeholder="Enter username..."
              autoComplete="username"
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''} ${formData.email ? 'has-value' : ''}`}
              placeholder="Enter email..."
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''} ${formData.password ? 'has-value' : ''}`}
              placeholder="Enter password..."
              autoComplete="new-password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''} ${formData.confirmPassword ? 'has-value' : ''}`}
              placeholder="Confirm password..."
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          {errors.submit && (
            <div className="submit-error">{errors.submit}</div>
          )}

          <div style={{ marginTop: '0px', display: 'flex', justifyContent: 'center' }}>
            <BeamScanButton
              onClick={handleSubmit}
              label={isLoading ? "INITIALIZING..." : "SIGN UP"}
              disabled={isLoading}
            />
          </div>

          <div className="form-footer">
            <p className="footer-text">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="link-button"
              >
                Login here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
