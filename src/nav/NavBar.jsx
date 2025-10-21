
import React from "react";
import "./nav.css";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="quantum-nav">
      <div className="nav-logo">
        <span className="logo-text" data-text="Quantum Playground">Quantum Playground</span>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/playground" className="nav-link">Playground</Link>
        <Link to="/showcase" className="nav-link">Showcase</Link>
      </div>
    </nav>
  );
}
