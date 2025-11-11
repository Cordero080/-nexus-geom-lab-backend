import React from 'react';
import { Link } from 'react-router-dom';
import { GEOM_LAB_LINK_TEXT, SHOWCASE_LINK_TEXT } from '../../../layout/NavBar/navLabels';

/**
 * Quantum-themed navigation bar with dynamic portal colors
 * @param {Object} portalState - Current portal color state
 * @param {Array} glyphState - Current quantum glyph state
 * @param {boolean} navScrolled - Whether nav is in scrolled state
 * @param {boolean} isAuthenticated - User authentication status
 * @param {Function} logout - Logout handler
 * @param {string} currentPage - Current page to hide from nav (optional)
 */
export default function QuantumNav({ portalState, glyphState, navScrolled, isAuthenticated, logout, currentPage }) {
  return (
    <nav
      className="quantum-nav"
      id="quantum-nav"
      style={{
        '--nav-background': navScrolled 
          ? `linear-gradient(135deg, ${portalState.colors[0]}15, ${portalState.colors[1]}10, rgba(0,0,0,0.9))` 
          : `linear-gradient(135deg, ${portalState.colors[0]}25, ${portalState.colors[1]}20, rgba(0,0,0,0.85))`,
        '--nav-backdrop-filter': navScrolled ? 'blur(20px)' : 'blur(30px)',
        '--nav-border-bottom': `2px solid ${portalState.colors[1]}44`,
        '--nav-box-shadow': `0 2px 24px ${portalState.colors[1]}22`
      }}
    >
      <div className="nav-logo">
        <span
          className="logo-text"
          data-text="N3XUS_GEOM"
          style={{
            '--logo-filter': `drop-shadow(0 0 4px ${portalState.colors[1]}66)`
          }}
        >N3XUS_GEOM</span>
        {/* Subtle quantum glyphs in navbar */}
        <span 
          className="nav-quantum-glyphs"
          style={{
            '--glyph-color': portalState.colors[1],
            '--glyph-filter': `blur(0.3px) drop-shadow(0 0 4px ${portalState.colors[1]}88)`,
            '--glyph-text-shadow': `0 0 8px ${portalState.colors[1]}, 0 0 2px ${portalState.colors[0]}`
          }}
        >
          {glyphState.join(' ')}
        </span>
        <div className="logo-particles"></div>
      </div>
      <div className="nav-links">
        {isAuthenticated && (
          <>
            {currentPage !== 'home' && <Link to="/" className="nav-link nav-link--home" data-dimension="0">// HOME</Link>}
            {currentPage !== 'scenes' && <Link to="/scenes" className="nav-link" data-dimension="1">// SCENES</Link>}
            {currentPage !== 'showcase' && <Link to="/showcase" className="nav-link" data-dimension="2">{SHOWCASE_LINK_TEXT}</Link>}
            {currentPage !== 'geom-lab' && <Link to="/geom-lab" className="nav-link" data-dimension="3">{GEOM_LAB_LINK_TEXT}</Link>}
            <div className="nav-terminal">
              <button 
                onClick={logout}
                className="terminal-cursor"
              >
                [L0GOUT]
              </button>
            </div>
          </>
        )}
      </div>
      <div className="nav-quantum-field"></div>
    </nav>
  );
}
