import React, { useState, useEffect } from 'react';
import './nav.scss';
import sharedStyles from '../../../styles/shared.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/AuthContext';
import ScrambleButton from '../../ui/ScrambleButton/ScrambleButton';
import ScrambleLink from '../../ui/ScrambleLink/ScrambleLink';
import { GEOM_LAB_LINK_TEXT, SHOWCASE_LINK_TEXT } from './navLabels';

export default function NavBar({ portalColors = null, glyphs = null, navScrolled = false }) {
  const { isAuthenticated, user, logout, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const [isShowcaseViewer, setIsShowcaseViewer] = useState(false);

  // Check if showcase viewer is active
  useEffect(() => {
    const checkViewerActive = () => {
      setIsShowcaseViewer(document.body.classList.contains('showcase-viewer-active'));
    };

    // Check initially
    checkViewerActive();

    // Set up mutation observer to watch for body class changes
    const observer = new MutationObserver(checkViewerActive);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Quick login for demo (you can replace with a proper modal later)
  const handleQuickLogin = () => {
    login('demo@example.com', 'password');
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

  // Check if we're on geom lab routes or showcase viewer
  const isGeomLab = location.pathname === '/geom-lab' || location.pathname === '/geometry-lab';
  const shouldUseClearNav = isGeomLab || isShowcaseViewer;

  // Apply quantum reactive colors if provided
  const quantumStyle = portalColors
    ? {
        background: navScrolled
          ? `linear-gradient(135deg, ${portalColors[0]}15, ${portalColors[1]}10, rgba(0,0,0,0.9))`
          : `linear-gradient(135deg, ${portalColors[0]}25, ${portalColors[1]}20, rgba(0,0,0,0.85))`,
        backdropFilter: navScrolled ? 'blur(20px)' : 'blur(30px)',
        borderBottom: `2px solid ${portalColors[1]}44`,
        boxShadow: `0 2px 24px ${portalColors[1]}22`,
        transition: 'all 1.2s ease',
      }
    : {};

  return (
    <nav
      className={`quantum-nav${shouldUseClearNav ? ' showcase-viewer-navbar' : ''}`}
      style={quantumStyle}
    >
      <div className="nav-logo">
        <Link to="/" className="logo-text" data-text={user?.username || 'N3XUS_GEOM'}>
          {user?.username || 'N3XUS_GEOM'}
        </Link>
      </div>
      <div className="nav-links">
        {/* ALWAYS show these - public links (hide if on current page) */}
        {location.pathname !== '/' && (
          <ScrambleLink to="/" className="nav-link nav-link--home">
            // HOME
          </ScrambleLink>
        )}
        {location.pathname !== '/scenes' && (
          <ScrambleLink to="/scenes" className="nav-link">
            // SCENES
          </ScrambleLink>
        )}
        {location.pathname !== '/showcase' && (
          <ScrambleLink to="/showcase" className="nav-link">
            {SHOWCASE_LINK_TEXT}
          </ScrambleLink>
        )}
        {location.pathname !== '/geometry-lab' && location.pathname !== '/geom-lab' && (
          <ScrambleLink to="/geometry-lab" className="nav-link">
            {GEOM_LAB_LINK_TEXT}
          </ScrambleLink>
        )}
        {/* Conditional links based on authentication */}
        {isAuthenticated ? (
          <>
            <div className="nav-terminal">
              <button onClick={logout} className="terminal-cursor" title="Logout">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <>
            {location.pathname !== '/signup' && (
              <ScrambleLink to="/signup" className="nav-link">
                // SIGN UP
              </ScrambleLink>
            )}
            {location.pathname !== '/login' && (
              <ScrambleLink to="/login" className="nav-link">
                // LOGIN
              </ScrambleLink>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
