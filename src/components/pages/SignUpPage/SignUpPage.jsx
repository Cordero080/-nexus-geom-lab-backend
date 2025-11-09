import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import BeamScanButton from "../../ui/BeamScanButton/BeamScanButton";
import { quantumCollapse } from "../../../utils/coreHelpers";
import "./SignUpPage.css";
import "../../layout/NavBar/nav.css";
import homeStyles from "../HomePage/HomeIndex.module.scss";

// Portal worlds system (matching MyScenesPage/Showcase)
const portalWorlds = [
  { colors: ['#ff00cc', '#00fff7', '#1a003a'], label: 'Fractal' },
  { colors: ['#ffea00', '#7300ffff', '#003a2a'], label: 'Nebula' },
  { colors: ['#ff3300', '#cc00ff', '#0a0f1a'], label: 'Being' },
  { colors: ['#00ff33', '#00aaff', '#003a3a'], label: '' },
  { colors: ['#cfccbeff', '#056864ff', '#210205ff'], label: 'Singularity' },
];

const glyphSets = [
  ['ψ', 'Ω', 'Σ'],
  ['λ', 'Φ', 'Ξ'],
  ['π', 'Δ', 'Γ'],
  ['μ', 'θ', 'ζ'],
  ['τ', 'β', 'η'],
];

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  // Quantum state management (matching MyScenesPage/Showcase)
  const [portalState, setPortalState] = useState(() => quantumCollapse(portalWorlds));
  const [glyphState, setGlyphState] = useState(() => quantumCollapse(glyphSets));
  const [navScrolled, setNavScrolled] = useState(false);
  
  // Parallax layer refs (matching MyScenesPage/Showcase)
  const bgRef = useRef(null);
  const fgRef = useRef(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Parallax effect (matching MyScenesPage/Showcase)
  useEffect(() => {
    const handleParallax = (e) => {
      const scrollY = window.scrollY;
      const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const progress = Math.min(1, scrollY / maxScroll);
      let mx = 0, my = 0;
      if (e && e.type === 'mousemove') {
        mx = (e.clientX / window.innerWidth) - 0.5;
        my = (e.clientY / window.innerHeight) - 0.5;
      }
      
      const motionDampen = 1 - progress * 0.3;
      
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${mx * 15 * motionDampen}px, ${-scrollY * 0.04 + my * 8 * motionDampen}px, 0)`;
        bgRef.current.style.opacity = String(1 - progress * 0.4);
      }
      
      if (fgRef.current) {
        fgRef.current.style.transform = `translate3d(${mx * 45 * motionDampen}px, ${-scrollY * 0.12 + my * 25 * motionDampen}px, 0)`;
        fgRef.current.style.opacity = String(0.9 - progress * 0.6);
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

  // Quantum collapse on user interaction (matching MyScenesPage/Showcase)
  useEffect(() => {
    const handleQuantumCollapse = () => {
      const newPortalState = quantumCollapse(portalWorlds);
      const newGlyphState = quantumCollapse(glyphSets);
      setPortalState(newPortalState);
      setGlyphState(newGlyphState);
    };
    
    const handleClickCollapse = () => {
      handleQuantumCollapse();
    };

    window.addEventListener('scroll', handleQuantumCollapse);
    window.addEventListener('click', handleClickCollapse);
    
    return () => {
      window.removeEventListener('scroll', handleQuantumCollapse);
      window.removeEventListener('click', handleClickCollapse);
    };
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const handleNavScroll = () => {
      if (window.scrollY > 50) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };
    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll();
    return () => window.removeEventListener('scroll', handleNavScroll);
  }, []);

  // Enhanced cursor effects
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const handleMouseMove = (e) => {
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
      {/* Base Dark Layer */}
      <div className={homeStyles.baseDark}></div>

      {/* Quantum Portal Background Layer */}
      <div 
        className={homeStyles.quantumPortalLayer}
        style={{
          background: `
            radial-gradient(circle at 30% 120%, 
              ${portalState.colors[0]} 0%, 
              ${portalState.colors[1]} 30%, 
              ${portalState.colors[2]} 60%, 
              transparent 80%
            ),
            radial-gradient(circle at 70% 130%, 
              ${portalState.colors[1]} 0%, 
              ${portalState.colors[2]} 40%, 
              ${portalState.colors[0]} 70%,
              transparent 90%
            )
          `
        }}
      />

      {/* Inverted veil to cover quantum colors at top */}
      <div className={homeStyles.quantumVeil}></div>

      {/* Dark Top Veil */}
      <div className={homeStyles.darkTopVeil}></div>

      {/* Dynamic Portal Background */}
      <div style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: -3, 
        pointerEvents: 'none',
      }} aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          background: `linear-gradient(120deg, 
            ${portalState.colors[0]} 0%, 
            ${portalState.colors[1]} 60%, 
            ${portalState.colors[2]} 100%
          )`,
          transition: 'background 1.2s cubic-bezier(0.4,0,0.2,1)',
          filter: 'brightness(1.3) saturate(1.8)',
        }}>
          <defs>
            <linearGradient id="signup-portal-glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.6"/>
              <stop offset="50%" stopColor={portalState.colors[1]} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={portalState.colors[2]} stopOpacity="0.6"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1920" height="1080" fill="url(#signup-portal-glow)"/>
        </svg>
      </div>

      {/* Clip-path background layer (matching Showcase/MyScenesPage) */}
      <div className="bg-gallery-layer bg-gallery-reality" aria-hidden="true"></div>
      
      {/* Showcase-style parallax background layers */}
      <div ref={bgRef} className="parallax-bg-layer" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 1920 400" style={{position:'absolute',top:0,left:0,width:'100vw',height:'40vh',pointerEvents:'none', background: `linear-gradient(120deg, ${portalState.colors[0]} 0%, ${portalState.colors[1]} 60%, ${portalState.colors[2]} 100%)`, transition: 'background 3s cubic-bezier(0.4,0,0.2,1)'}}>
          <defs>
            <linearGradient id="signup-bg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.18"/>
              <stop offset="100%" stopColor={portalState.colors[1]} stopOpacity="0.08"/>
            </linearGradient>
          </defs>
          <polygon points="0,0 1920,0 1600,400 0,300" fill="url(#signup-bg-grad1)"/>
          <ellipse cx="1600" cy="80" rx="220" ry="60" fill={portalState.colors[2] + '22'}/>
        </svg>
      </div>
      <div ref={fgRef} className="parallax-fg-layer" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 1920 400" style={{position:'absolute',top:0,left:0,width:'100vw',height:'40vh',pointerEvents:'none'}}>
          <defs>
            <linearGradient id="signup-fg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.22"/>
            </linearGradient>
          </defs>
          <polygon points="1920,0 1920,400 400,400 0,200" fill="url(#signup-fg-grad1)"/>
          <ellipse cx="320" cy="120" rx="180" ry="40" fill="#ffffff22"/>
        </svg>
      </div>

      {/* Enhanced Holographic Cursor System */}
      <div className="cursor" id="cursor"></div>

      <div className="signup-page">
        <nav 
          className={`quantum-nav ${navScrolled ? 'scrolled' : ''}`}
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
            {/* Subtle quantum glyphs in navbar */}
            <span style={{
              marginLeft: 10,
              fontSize: 16,
              color: portalState.colors[1],
              letterSpacing: '0.12em',
              verticalAlign: 'middle',
              opacity: 0.8,
              filter: `blur(0.3px) drop-shadow(0 0 4px ${portalState.colors[1]}88)`,
              transition: 'color 1.2s, filter 1.2s, opacity 1.2s',
              textShadow: `0 0 8px ${portalState.colors[1]}, 0 0 2px ${portalState.colors[0]}`
            }}>
              {glyphState.join(' ')}
            </span>
            <div className="logo-particles"></div>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link nav-link--home" data-dimension="0">// HOME</Link>
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
