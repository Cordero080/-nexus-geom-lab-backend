
import React, { useState } from "react";
import "./nav.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ScrambleButton from "../components/ScrambleButton/ScrambleButton";

export default function NavBar() {
  const { isAuthenticated, user, logout, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Quick login for demo (you can replace with a proper modal later)
  const handleQuickLogin = () => {
    login("demo@example.com", "password");
  };

  return (
    <nav className="quantum-nav">
      <div className="nav-logo">
        <span className="logo-text" data-text="Geom Lab">Geom Lab</span>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/geometry-lab" className="nav-link">Geom Lab</Link>
            <Link to="/gallery" className="nav-link">Gallery</Link>
            <Link to="/showcase" className="nav-link">Showcase</Link>
            <button onClick={logout} className="nav-link nav-link-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={handleQuickLogin} className="nav-link nav-link-button">
              Sign In
            </button>
            <button onClick={handleQuickLogin} className="nav-link nav-link-button">
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
