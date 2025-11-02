import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import BeamScanButton from "../../features/HUD/BeamScanButton/BeamScanButton";
import HomeBackground from "../../shared/HomeBackground/HomeBackground";
import "./LoginPage.css";
import sharedStyles from "../../../styles/shared.module.scss";
import "../../layout/NavBar/nav.css";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    submit: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  // Quantum portal state for dynamic navbar colors
  const [portalState] = useState({
    colors: ['#ff006e', '#8338ec', '#3a86ff']
  });

  // Quantum glyphs for navbar
  const [glyphState] = useState(['◬', '◭', '◮']);

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

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear submit error when user starts typing
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
    
    // Validate field and update errors
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);
    
    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        submit: ''
      });
      return;
    }

    setIsLoading(true);
    setErrors({ email: '', password: '', submit: '' });

    try {
      // Call login from AuthContext
      await login(formData.email, formData.password);
      
      // Redirect to homepage on success
      navigate('/');
    } catch (error) {
      setErrors({ submit: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HomeBackground portalState={portalState}>
      {/* Enhanced Holographic Cursor System */}
      <div className="cursor" id="cursor"></div>

      <div className="login-page">
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
            {/* Hide LOGIN link since we're on this page */}
            <Link to="/signup" className="nav-link" data-dimension="1">// SIGN UP</Link>
          </div>
          <div className="nav-quantum-field"></div>
        </nav>

        <div className="login-container">
          <div className="login-header">
            <h1 className="login-title">
              <span className="title-glow title-word-left" data-word="VCCESS"><span className="title-inverted-v">V</span>CCESS</span>
              <span className="title-separator">//</span>
              <span className="title-glow title-word-right" data-word="PORTVL">PORT<span className="title-inverted-v">V</span>L</span>
            </h1>
            <p className="login-subtitle">
              / / ENTER THE QUANTUM REALM
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
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
                autoComplete="current-password"
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {errors.submit && (
              <div className="submit-error">{errors.submit}</div>
            )}

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
              <BeamScanButton
                onClick={handleSubmit}
                label={isLoading ? "ACCESSING..." : "LOGIN"}
                disabled={isLoading}
              />
            </div>

            <div className="form-footer">
              <p className="footer-text">
                Don't have an account?{' '}
                <Link to="/signup" className="footer-link">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </HomeBackground>
  );
};

export default LoginPage;
