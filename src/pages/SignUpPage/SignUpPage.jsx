import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BeamScanButton } from '../../components/HUD';
import { QuantumCursor } from '../../components/Effects';
import './SignUpPage.css';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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
      
      // Redirect to playground on success
      navigate('/playground');
    } catch (error) {
      setErrors({ submit: error.message || 'Sign up failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <QuantumCursor />
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
            data-text="JS_LAB_V2.0"
            style={{
              color: '#fff',
              filter: `drop-shadow(0 0 4px ${portalState.colors[1]}66)`,
              transition: 'filter 1.2s'
            }}
          >
            PVBL0_P!ST0LA_V2.0
          </span>
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
          <Link to="/" className="nav-link" data-dimension="0">// HOME</Link>
          <Link to="/login" className="nav-link" data-dimension="1">// LOGIN</Link>
        </div>
        <div className="nav-quantum-field"></div>
        </nav>

        <div className="signup-container">
        <div className="signup-header">
          <h1 className="signup-title">
            <span className="title-glow">CREATE</span>
            <span className="title-separator">//</span>
            <span className="title-glow">ACCOUNT</span>
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
