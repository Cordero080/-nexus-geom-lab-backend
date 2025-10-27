
import React, { useState } from "react";
import "./nav.css";
import "../styles/shared.css";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ScrambleButton from "../components/ScrambleButton/ScrambleButton";

export default function NavBar() {
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

  return (
    <nav className="quantum-nav">
      <div className="nav-logo">
        <span className="logo-text" data-text="Nexus Geom 3D">Nexus Geom-3D</span>
      </div>
      <div className="nav-links">
         {/* ALWAYS show these - public links */}
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/geometry-lab" className="nav-link">Geom Lab</Link>
        <Link to="/showcase" className="nav-link">Showcase</Link>
         {/* Conditional links based on authentication */}
        {isAuthenticated ? (
          <>
            <Link to="/scenes" className="nav-link">Scenes</Link>
            <button onClick={logout} className="nav-link nav-link-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" className="nav-link">Sign Up</Link>
            <Link to="/login" className="nav-link">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}
