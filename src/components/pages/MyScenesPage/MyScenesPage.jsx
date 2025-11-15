import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useScene } from '../../../context/SceneContext';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { getMyScenes } from '../../../services/sceneApi'; // Import API function
import SceneCard from './SceneCard.jsx';
import CustomSelect from '../../ui/CustomSelect/CustomSelect';
import ScrambleButton from '../../ui/ScrambleButton/ScrambleButton';
import BeamScanButton from '../../ui/BeamScanButton/BeamScanButton';
import { DeleteSuccessModal } from '../../ui/Modals';
import QuantumNav from '../HomePage/components/QuantumNav';
import HomeBackground from '../../shared/HomeBackground/HomeBackground';
import QuantumPortalShowcase from '../Showcase/QuantumPortalShowcase';
import { quantumCollapse } from '../../../utils/coreHelpers';
import './MyScenesPage.css';
import styles from './MyScenesPage.module.scss';
import sharedStyles from '../../../styles/shared.module.scss';
import '../../layout/NavBar/nav.css';
import { GEOM_LAB_LINK_TEXT, SHOWCASE_LINK_TEXT } from '../../layout/NavBar/navLabels';
import homeStyles from '../HomePage/HomeIndex.module.scss';

/**
 * PORTAL WORLDS SYSTEM
 */
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

export default function MyScenesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadScene, deleteScene } = useScene();
  const { isAuthenticated, logout, user, token } = useAuth();

  const highlightSceneId = location.state?.highlightSceneId;

  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState(null);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [deletedSceneName, setDeletedSceneName] = useState('');

  const [portalState, setPortalState] = useState(() => quantumCollapse(portalWorlds));
  const [glyphState, setGlyphState] = useState(() => quantumCollapse(glyphSets));
  const [navScrolled, setNavScrolled] = useState(false);
  
  // Smooth color interpolation
  const [currentColors, setCurrentColors] = useState(portalState.colors);
  const [targetColors, setTargetColors] = useState(portalState.colors);
  const animationRef = useRef(null);

  const bgRef = useRef(null);
  const fgRef = useRef(null);

  // Smooth color interpolation
  useEffect(() => {
    setTargetColors(portalState.colors);
    
    const startTime = Date.now();
    const duration = 800;
    const startColors = [...currentColors];
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const eased = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress;
      
      const interpolated = startColors.map((start, i) => {
        const target = portalState.colors[i];
        const startRGB = hexToRgb(start);
        const targetRGB = hexToRgb(target);
        
        const r = Math.round(startRGB.r + (targetRGB.r - startRGB.r) * eased);
        const g = Math.round(startRGB.g + (targetRGB.g - startRGB.g) * eased);
        const b = Math.round(startRGB.b + (targetRGB.b - startRGB.b) * eased);
        
        return rgbToHex(r, g, b);
      });
      
      setCurrentColors(interpolated);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [portalState.colors]);

  // Parallax effect (matching Showcase)
  useEffect(() => {
    const handleParallax = (e) => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
      const progress = Math.min(1, scrollY / maxScroll);
      let mx = 0,
        my = 0;
      if (e && e.type === 'mousemove') {
        mx = e.clientX / window.innerWidth - 0.5;
        my = e.clientY / window.innerHeight - 0.5;
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

  /**
   * QUANTUM COLLAPSE EVENT SYSTEM
   *
   * Implements the core Portal Worlds functionality - whenever user scrolls or clicks,
   * the quantum state "collapses" into a new dimensional configuration. This simulates
   * the quantum uncertainty principle where observation changes the system state.
   *
   * Each collapse randomly selects:
   * - New portal world (color scheme)
   * - New glyph set (mathematical symbols)
   *
   * The entire interface then transitions to reflect the new quantum state,
   * creating a dynamic, ever-changing user experience.
   */
  useEffect(() => {
    const handleQuantumCollapse = () => {
      // Collapse quantum superposition into definite states
      const newPortalState = quantumCollapse(portalWorlds);
      const newGlyphState = quantumCollapse(glyphSets);

      // Update React state to trigger UI re-render with new colors
      setPortalState(newPortalState);
      setGlyphState(newGlyphState);
    };

    const handleClickCollapse = () => {
      handleQuantumCollapse();
    };

    // Attach quantum collapse to user interaction events
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

  // Fetch user's scenes when component mounts or token changes
  useEffect(() => {
    if (token) {
      fetchMyScenes();
    }
  }, [token]);

  // Clear highlight state after initial render to prevent persistence
  useEffect(() => {
    if (highlightSceneId) {
      // Clear the navigation state after 3 seconds so highlight doesn't persist
      const timer = setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [highlightSceneId, navigate, location.pathname]);

  const fetchMyScenes = async () => {
    setLoading(true);

    try {
      // Check if user is authenticated and has token
      if (!token) {
        setLoading(false);
        return;
      }

      // Call the real API
      const data = await getMyScenes(token);

      // Backend returns { success: true, scenes: [...] }
      const scenesArray = data.scenes || data || [];
      setScenes(scenesArray);
    } catch (error) {
      // Set empty array on error
      setScenes([]);
    } finally {
      setLoading(false);
    }
  };

  // Sort scenes
  const getSortedScenes = () => {
    let sorted = [...scenes];

    // Apply sort
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'most-viewed':
        sorted.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return sorted;
  };

  const sortedScenes = getSortedScenes();

  // Load scene into editor
  const handleLoad = (scene) => {
    loadScene(scene, user?.id);
    navigate('/geometry-lab'); // Navigate to editor
  };

  // Edit scene (same as load for now)
  const handleEdit = (scene) => {
    handleLoad(scene);
  };

  // Delete scene
  const handleDeleteClick = (scene) => {
    setSceneToDelete(scene);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!sceneToDelete || !token) return;

    try {
      // Use _id or id, whichever exists
      const sceneId = sceneToDelete._id || sceneToDelete.id;
      await deleteScene(sceneId, token);

      // Remove from local state
      setScenes(scenes.filter((s) => (s._id || s.id) !== sceneId));

      // Store scene name for success modal
      setDeletedSceneName(sceneToDelete.name);

      // Close delete confirmation modal
      setShowDeleteModal(false);
      setSceneToDelete(null);

      // Show success modal
      setShowDeleteSuccessModal(true);
    } catch (error) {
      alert('Failed to delete scene. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSceneToDelete(null);
  };

  return (
    <>
      {/* Three.js Quantum Portal Effect - Top */}
      <QuantumPortalShowcase
        position="top"
        sceneColors={{
          color1: currentColors[0],
          color2: currentColors[1],
          color3: currentColors[2],
        }}
      />

      {/* Three.js Quantum Portal Effect - Bottom */}
      <QuantumPortalShowcase
        position="bottom"
        sceneColors={{
          color1: currentColors[0],
          color2: currentColors[1],
          color3: currentColors[2],
        }}
      />

      {/* Three.js Quantum Portal Effect - Middle */}
      <QuantumPortalShowcase
        position="middle"
        sceneColors={{
          color1: currentColors[0],
          color2: currentColors[1],
          color3: currentColors[2],
        }}
      />

      {/* Clip-path background layer (matching HomePage) */}
      <div className="bg-gallery-layer bg-gallery-reality" aria-hidden="true"></div>

      {/* Showcase-style background layers */}
      <div ref={bgRef} className="parallax-bg-layer" aria-hidden="true">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 400"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '40vh',
            pointerEvents: 'none',
            background: `linear-gradient(120deg, ${portalState.colors[0]} 0%, ${portalState.colors[1]} 60%, ${portalState.colors[2]} 100%)`,
            transition: 'background 3s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <defs>
            <linearGradient id="myscenes-bg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.18" />
              <stop offset="100%" stopColor={portalState.colors[1]} stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <polygon points="0,0 1920,0 1600,400 0,300" fill="url(#myscenes-bg-grad1)" />
          <ellipse cx="1600" cy="80" rx="220" ry="60" fill={portalState.colors[2] + '22'} />
        </svg>
      </div>
      <div ref={fgRef} className="parallax-fg-layer" aria-hidden="true">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 400"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '40vh',
            pointerEvents: 'none',
          }}
        >
          <defs>
            <linearGradient id="myscenes-fg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.22" />
            </linearGradient>
          </defs>
          <polygon points="1920,0 1920,400 400,400 0,200" fill="url(#myscenes-fg-grad1)" />
          <ellipse cx="320" cy="120" rx="180" ry="40" fill="#ffffff22" />
        </svg>
      </div>

      <div className="my-scenes-page">
        <QuantumNav
          portalState={portalState}
          glyphState={glyphState}
          navScrolled={navScrolled}
          isAuthenticated={isAuthenticated}
          logout={logout}
          currentPage="scenes"
        />

        {/* Header */}
        <div className="my-scenes-page__header">
          <h1 className="quantum-page-title" data-text="MY SCENES">
            MY SCENES
          </h1>
          <p className="quantum-page-subtitle">Your collection of geometric creations</p>
        </div>

        {/* Controls */}
        <div className="my-scenes-page__controls">
          {/* Sort */}
          <div className="my-scenes-page__control-group">
            <label>Sort:</label>
            <CustomSelect
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'most-viewed', label: 'Most Viewed' },
                { value: 'name', label: 'Name (A-Z)' },
              ]}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="my-scenes-page__loading">
            <div className="my-scenes-page__spinner"></div>
            <p>Loading your scenes...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && sortedScenes.length === 0 && (
          <div className="my-scenes-page__empty">
            <div className="my-scenes-page__empty-icon">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="empty-grad1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.8" />
                    <stop offset="50%" stopColor={portalState.colors[1]} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={portalState.colors[2]} stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="empty-glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Outer hexagon */}
                <polygon
                  points="60,10 95,32.5 95,77.5 60,100 25,77.5 25,32.5"
                  stroke="url(#empty-grad1)"
                  strokeWidth="2"
                  fill="none"
                  filter="url(#empty-glow)"
                />
                {/* Inner hexagon */}
                <polygon
                  points="60,25 82.5,37.5 82.5,67.5 60,80 37.5,67.5 37.5,37.5"
                  stroke={portalState.colors[1]}
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.6"
                />
                {/* Center cube wireframe */}
                <path
                  d="M 45,45 L 60,35 L 75,45 L 75,65 L 60,75 L 45,65 Z M 60,35 L 60,55 M 45,45 L 60,55 M 75,45 L 60,55 M 45,65 L 60,75 M 75,65 L 60,75"
                  stroke={portalState.colors[0]}
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.8"
                />
                {/* Corner nodes */}
                <circle cx="60" cy="10" r="3" fill={portalState.colors[0]} opacity="0.9" />
                <circle cx="95" cy="32.5" r="3" fill={portalState.colors[1]} opacity="0.9" />
                <circle cx="95" cy="77.5" r="3" fill={portalState.colors[2]} opacity="0.9" />
                <circle cx="60" cy="100" r="3" fill={portalState.colors[0]} opacity="0.9" />
                <circle cx="25" cy="77.5" r="3" fill={portalState.colors[1]} opacity="0.9" />
                <circle cx="25" cy="32.5" r="3" fill={portalState.colors[2]} opacity="0.9" />
              </svg>
            </div>
            <h2>NO SCENES DETECTED</h2>
            <p>GENERATE YOUR FIRST CUSTOM OBJECT IN THE LAB</p>
            <BeamScanButton onClick={() => navigate('/geometry-lab')} label="CREATE" />
          </div>
        )}

        {/* Scene Grid */}
        {!loading && sortedScenes.length > 0 && (
          <div className="my-scenes-page__grid">
            {/* Create New Scene Card */}
            <div
              className="create-scene-card"
              onClick={() => navigate('/geometry-lab')}
              style={{
                border: `2px dashed ${portalState.colors[0]}`,
                background: `linear-gradient(135deg, ${portalState.colors[0]}15, ${portalState.colors[1]}10)`,
              }}
            >
              <div
                className="create-scene-card__icon"
                style={{
                  color: portalState.colors[0],
                  textShadow: `0 0 20px ${portalState.colors[0]}`,
                }}
              >
                +
              </div>
              <h3
                className="create-scene-card__title"
                style={{
                  color: portalState.colors[0],
                  opacity: 0.8,
                }}
              >
                Create New Scene
              </h3>
              <p className="create-scene-card__subtitle">Start a new geometric creation</p>
            </div>

            {/* Existing Scene Cards */}
            {sortedScenes.map((scene) => (
              <SceneCard
                key={scene._id || scene.id}
                scene={scene}
                showLoadButton={true}
                showEditButton={true}
                showDeleteButton={true}
                onLoad={handleLoad}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                isHighlighted={(scene._id || scene.id) === highlightSceneId}
                portalColors={portalState.colors}
              />
            ))}
          </div>
        )}

        {/* Back to Lab Button - Below Scene Cards */}
        {!loading && sortedScenes.length > 0 && (
          <div className={styles.backToLabButtonWrapper}>
            <BeamScanButton onClick={() => navigate('/geom-lab')} label="BACK TO LAB" />
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="delete-modal-overlay" onClick={cancelDelete}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
              <div className="delete-modal__icon">⬢</div>
              <h2 className="delete-modal__title">¿Delete Scene?</h2>
              <p className="delete-modal__message">
                Are you sure you want to delete <strong>"{sceneToDelete?.name}"</strong>?
                <br />
                This action cannot be undone.
              </p>
              <div className="delete-modal__actions">
                <ScrambleButton
                  variant="secondary"
                  onClick={cancelDelete}
                  className="delete-modal__btn"
                >
                  Cancel
                </ScrambleButton>
                <ScrambleButton
                  variant="danger"
                  onClick={confirmDelete}
                  className="delete-modal__btn"
                >
                  Delete Forever
                </ScrambleButton>
              </div>
            </div>
          </div>
        )}

        {/* Delete Success Modal */}
        <DeleteSuccessModal
          isOpen={showDeleteSuccessModal}
          onClose={() => setShowDeleteSuccessModal(false)}
          sceneName={deletedSceneName}
        />
      </div>
    </>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
