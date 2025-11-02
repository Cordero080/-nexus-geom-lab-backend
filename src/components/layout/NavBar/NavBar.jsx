
import React, { useState } from "react";
import "./nav.css";
import sharedStyles from "../../../styles/shared.module.scss";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ScrambleButton from "../../ui/ScrambleButton/ScrambleButton";
import { GEOM_LAB_LINK_TEXT, SHOWCASE_LINK_TEXT } from "./navLabels";

export default function NavBar({ portalColors = null, glyphs = null }) {
  const { isAuthenticated, user, logout, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();

  // Quick login for demo (you can replace with a proper modal later)
  const handleQuickLogin = () => {
    login("demo@example.com", "password");
  };

  // Get current page name
  const getPageName = () => {
    const path = location.pathname;
    if (path === '/showcase') return 'SHOWCASE';
    if (path === '/geometry-lab') return 'Geom Lab';
    if (path === '/scenes') return 'MY SCENES';
    if (path === '/') return 'HOME';
    return '';
  };

  // Check if we're on geom lab routes
  const isGeomLab = location.pathname === '/geom-lab' || location.pathname === '/geometry-lab';
  
  // Apply quantum reactive colors if provided
  const quantumStyle = portalColors ? {
    background: `linear-gradient(90deg, ${portalColors[0]}15, ${portalColors[1]}08)`,
    borderBottom: `1px solid ${portalColors[0]}40`,
    transition: 'background 1.2s cubic-bezier(0.4,0,0.2,1), border-bottom-color 1.2s cubic-bezier(0.4,0,0.2,1)'
  } : {};
  
  return (
    <nav className={`quantum-nav${isGeomLab ? ' geom-lab-navbar' : ''}`} style={quantumStyle}>
      <div className="nav-logo">
        <span className="logo-text" data-text="N3XUS_GEOM">N3XUS_GEOM</span>
        {glyphs && (
          <span className="quantum-glyphs" style={{
            marginLeft: '12px',
            fontSize: '0.9em',
            opacity: 0.6,
            color: portalColors ? portalColors[1] : '#00fff7',
            transition: 'color 1.2s cubic-bezier(0.4,0,0.2,1)',
            letterSpacing: '0.3em'
          }}>
            {glyphs.join(' ')}
          </span>
        )}
      </div>
      <div className="nav-links">
         {/* ALWAYS show these - public links (hide if on current page) */}
  {location.pathname !== '/' && <Link to="/" className="nav-link nav-link--home">// HOME</Link>}
        {location.pathname !== '/geometry-lab' && (
          <Link to="/geometry-lab" className="nav-link">{GEOM_LAB_LINK_TEXT}</Link>
        )}
  <Link to="/showcase" className="nav-link">{SHOWCASE_LINK_TEXT}</Link>
         {/* Conditional links based on authentication */}
        {isAuthenticated ? (
          <>
            {location.pathname !== '/scenes' && <Link to="/scenes" className="nav-link">// SCENES</Link>}
            <div className="nav-terminal">
              <button 
                onClick={logout}
                className="terminal-cursor"
              >
                [LOGOUT]
              </button>
            </div>
          </>
        ) : (
          <>
            {location.pathname !== '/signup' && <Link to="/signup" className="nav-link">// SIGN UP</Link>}
            {location.pathname !== '/login' && <Link to="/login" className="nav-link">// LOGIN</Link>}
          </>
        )}
      </div>
    </nav>
  );
}
