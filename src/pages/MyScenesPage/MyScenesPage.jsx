import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useScene } from "../../context/SceneContext";
import { useAuth } from "../../context/AuthContext";
import SceneCard from "../../components/Gallery/SceneCard";
import "./MyScenesPage.css";

/**
 * QUANTUM COLLAPSE UTILITY
 * 
 * Simulates quantum superposition collapse - randomly selects one state from multiple possibilities.
 * This is inspired by quantum mechanics where particles exist in multiple states simultaneously
 * until "observed" (measured), at which point they collapse into a single definite state.
 * 
 * @param {Array} states - Array of possible quantum states to collapse into
 * @returns {*} - Randomly selected state from the array
 */
function quantumCollapse(states) {
  return states[Math.floor(Math.random() * states.length)];
}

/**
 * PORTAL WORLDS SYSTEM
 * 
 * Five distinct quantum dimensions, each with unique color palettes representing different
 * cosmic environments. These worlds dynamically shift the entire UI theme, creating an
 * immersive experience where users feel like they're navigating through parallel dimensions.
 * 
 * Each portal world contains:
 * - colors[0]: Primary color (used in gradients, backgrounds)
 * - colors[1]: Secondary color (used in glows, accents)  
 * - colors[2]: Accent color (used in highlights, borders)
 * - label: Thematic name representing the dimensional space
 */
const portalWorlds = [
  { colors: ['#ff00cc', '#00fff7', '#1a003a'], label: 'Fractal' },    // 🌀 Cyberpunk pink/cyan
  { colors: ['#ffea00', '#7300ffff', '#003a2a'], label: 'Nebula' },   // ☄️ Cosmic yellow/purple  
  { colors: ['#ff3300', '#cc00ff', '#0a0f1a'], label: 'Inferno' },    // 🔥 Volcanic red/magenta
  { colors: ['#00ff33', '#00aaff', '#003a3a'], label: 'Emerald' },    // 💎 Crystalline green/blue
  { colors: ['#fff', '#00fff7', '#0a0f1a'], label: 'Singularity' },   // ⭐ Stellar white/cyan
];

/**
 * QUANTUM GLYPH SETS
 * 
 * Greek mathematical symbols that change alongside portal worlds, representing different
 * quantum states and mathematical concepts. These glyphs appear in the navigation bar
 * as subtle indicators of the current dimensional frequency.
 */
const glyphSets = [
  ['ψ', 'Ω', 'Σ'], // Psi (wave function), Omega (frequency), Sigma (summation)
  ['λ', 'Φ', 'Ξ'], // Lambda (wavelength), Phi (golden ratio), Xi (cascade)
  ['π', 'Δ', 'Γ'], // Pi (circular constant), Delta (change), Gamma (transformation)
  ['μ', 'θ', 'ζ'], // Mu (micro scale), Theta (angle), Zeta (riemann)
  ['τ', 'β', 'η'], // Tau (time constant), Beta (velocity), Eta (efficiency)
];

/**
 * GALLERY PAGE - USER'S SCENE COLLECTION
 * 
 * Interactive quantum-themed gallery showcasing user-created 3D geometric scenes.
 * Features dynamic Portal Worlds theming system that transforms the entire interface
 * based on quantum collapse events triggered by user interaction.
 * 
 * Key Features:
 * - Responsive grid layout (3/2/1 columns)
 * - Real-time quantum theming system
 * - Parallax geometric backgrounds
 * - Interactive scene cards with Load/Edit/Delete actions
 * - Quantum navigation with portal-reactive colors
 * - Dynamic glyph system representing mathematical concepts
 */
export default function MyScenesPage() {
  const navigate = useNavigate();
  const { loadScene, deleteScene } = useScene();
  const { isAuthenticated, logout } = useAuth();

  // Scene management state
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState(null);

  /**
   * QUANTUM STATE MANAGEMENT
   * 
   * Current portal dimension and glyph set - these determine the active color scheme
   * and mathematical symbols throughout the interface. Initial state is randomly
   * collapsed from the available quantum superposition.
   */
  const [portalState, setPortalState] = useState(() => quantumCollapse(portalWorlds));
  const [glyphState, setGlyphState] = useState(() => quantumCollapse(glyphSets));

  /**
   * PARALLAX SYSTEM REFS
   * 
   * References to background and foreground parallax layers for independent
   * transformation during scroll and mouse movement, creating depth illusion.
   */
  const bgRef = useRef(null);
  const fgRef = useRef(null);

  /**
   * PARALLAX DEPTH SYSTEM
   * 
   * Creates immersive 3D depth illusion by moving background layers at different speeds
   * relative to scroll position and mouse movement. Background moves slower (0.08x scroll),
   * foreground moves faster (0.18x scroll), simulating depth parallax.
   * 
   * Mouse movement adds subtle interactive parallax for enhanced depth perception.
   */
  useEffect(() => {
    const handleParallax = (e) => {
      const scrollY = window.scrollY;
      let mx = 0, my = 0;
      
      // Calculate mouse position relative to viewport center (-0.5 to 0.5)
      if (e && e.type === 'mousemove') {
        mx = (e.clientX / window.innerWidth) - 0.5;
        my = (e.clientY / window.innerHeight) - 0.5;
      }
      
      // Apply differential parallax speeds for depth illusion
      if (bgRef.current) {
        // Background layer: slower movement creates distant appearance
        bgRef.current.style.transform = `translate3d(${mx * 30}px, ${-scrollY * 0.08 + my * 20}px, 0)`;
      }
      if (fgRef.current) {
        // Foreground layer: faster movement creates closer appearance  
        fgRef.current.style.transform = `translate3d(${mx * 80}px, ${-scrollY * 0.18 + my * 40}px, 0)`;
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
      console.log('🌀 Quantum collapse triggered!'); // Debug: Collapse event fired
      
      // Collapse quantum superposition into definite states
      const newPortalState = quantumCollapse(portalWorlds);
      const newGlyphState = quantumCollapse(glyphSets);
      
      console.log('🎨 New portal state:', newPortalState.label); // Debug: New dimension
      
      // Update React state to trigger UI re-render with new colors
      setPortalState(newPortalState);
      setGlyphState(newGlyphState);
    };
    
    const handleClickCollapse = () => {
      console.log('🖱️ Click quantum collapse triggered!'); // Debug: Click event
      handleQuantumCollapse();
    };

    // Attach quantum collapse to user interaction events
    window.addEventListener('scroll', handleQuantumCollapse);
    window.addEventListener('click', handleClickCollapse);
    console.log('📡 Quantum event listeners initialized'); // Debug: Setup complete
    
    return () => {
      window.removeEventListener('scroll', handle);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // Mock user data (replace with actual auth context)
  const currentUser = {
    id: "user_123",
    username: "demo_user",
    token: "mock_token",
  };

  // Fetch user's scenes
  useEffect(() => {
    fetchMyScenes();
  }, []);

  const fetchMyScenes = async () => {
    setLoading(true);

    // TODO: Replace with actual API call
    // const response = await fetch(`${API_URL}/scenes/my-scenes`, {
    //   headers: { 'Authorization': `Bearer ${currentUser.token}` }
    // });
    // const data = await response.json();

    // Mock data for now
    const mockScenes = [
      {
        id: "scene_1",
        userId: currentUser.id,
        name: "Purple Hyperspace",
        description: "An alien oscillating icosahedron in a nebula environment",
        config: {},
        createdAt: "2025-10-20T10:30:00Z",
        viewCount: 42,
        likeCount: 7,
      },
      {
        id: "scene_2",
        userId: currentUser.id,
        name: "Floating Sphere",
        description: "Gentle floating motion with cyan glow",
        config: {},
        createdAt: "2025-10-18T15:20:00Z",
        viewCount: 3,
        likeCount: 0,
      },
      {
        id: "scene_3",
        userId: currentUser.id,
        name: "Chaos Cube",
        description: "Chaotic movement with hyperframe visualization",
        config: {},
        createdAt: "2025-10-15T09:00:00Z",
        viewCount: 128,
        likeCount: 23,
      },
    ];

    // Reduce timeout to minimize layout shift
    setTimeout(() => {
      setScenes(mockScenes);
      setLoading(false);
    }, 100);
  };

  // Sort scenes
  const getSortedScenes = () => {
    let sorted = [...scenes];

    // Apply sort
    switch (sortBy) {
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "most-viewed":
        sorted.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "name":
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
    console.log("Loading scene into editor:", scene);
    loadScene(scene, currentUser.id);
    navigate("/geometry-lab"); // Navigate to editor
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
    if (!sceneToDelete) return;

    try {
      await deleteScene(sceneToDelete.id, currentUser.token);
      
      // Remove from local state
      setScenes(scenes.filter((s) => s.id !== sceneToDelete.id));
      
      // Close modal
      setShowDeleteModal(false);
      setSceneToDelete(null);
    } catch (error) {
      console.error("Failed to delete scene:", error);
      alert("Failed to delete scene. Please try again.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSceneToDelete(null);
  };

  return (
    <div className="my-scenes-page">
      {/* QUANTUM NAVIGATION */}
      <nav
        className="quantum-nav"
        id="quantum-nav"
        style={{
          background: `linear-gradient(90deg, rgba(0,0,0,0.82) 80%, ${portalState.colors[1]}22 100%)`,
          boxShadow: `0 2px 16px 0 ${portalState.colors[2]}11`,
          transition: 'background 1.2s cubic-bezier(0.4,0,0.2,1), box-shadow 1.2s'
        }}
      >
        <div className="nav-logo">
          <span
            className="logo-text"
            data-text="GALLERY_V2.0"
            style={{
              color: '#fff',
              filter: `drop-shadow(0 0 4px ${portalState.colors[1]}66)`,
              transition: 'filter 1.2s'
            }}
          >
            GALLERY_V2.0
          </span>
          {/* Subtle quantum glyphs in navbar */}
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
          <Link to="/gallery" className="nav-link" data-dimension="1">// GALLERY</Link>
          <Link to="/showcase" className="nav-link" data-dimension="2">// SHOWCASE</Link>
          {isAuthenticated && (
            <div className="nav-terminal">
              <button 
                onClick={logout}
                className="terminal-cursor"
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  color: '#00ff88'
                }}
              >
                [LOGOUT]
              </button>
            </div>
          )}
        </div>
        <div className="nav-quantum-field"></div>
      </nav>

      {/* Geometric Background Layers */}
      <div ref={bgRef} className="parallax-bg-layer" aria-hidden="true">
        {/* Abstract SVG/gradient background shapes, quantum-reactive */}
        <svg width="100%" height="100%" viewBox="0 0 1920 400" style={{position:'absolute',top:0,left:0,width:'100vw',height:'40vh',pointerEvents:'none', background: `linear-gradient(120deg, ${portalState.colors[0]} 0%, ${portalState.colors[1]} 60%, ${portalState.colors[2]} 100%)`, transition: 'background 1.2s cubic-bezier(0.4,0,0.2,1)'}}>
          <defs>
            <linearGradient id="bg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.18"/>
              <stop offset="100%" stopColor={portalState.colors[1]} stopOpacity="0.08"/>
            </linearGradient>
          </defs>
          <polygon points="0,0 1920,0 1600,400 0,300" fill="url(#bg-grad1)"/>
          <ellipse cx="1600" cy="80" rx="220" ry="60" fill={portalState.colors[2]+"22"}/>
        </svg>
      </div>
      <div ref={fgRef} className="parallax-fg-layer" aria-hidden="true">
        {/* Foreground SVG/gradient shapes */}
        <svg width="100%" height="100%" viewBox="0 0 1920 400" style={{position:'absolute',top:0,left:0,width:'100vw',height:'40vh',pointerEvents:'none'}}>
          <defs>
            <linearGradient id="fg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.22"/>
            </linearGradient>
          </defs>
          <polygon points="1920,0 1920,400 400,400 0,200" fill="url(#fg-grad1)"/>
          <ellipse cx="320" cy="120" rx="180" ry="40" fill="#fff2"/>
        </svg>
      </div>

      {/* Scene Background with Clip-Path */}
      <div className="scene-background bg-gallery-reality"></div>

      {/* Header */}
      <div className="my-scenes-page__header">
        <h1 className="my-scenes-page__title">Gallery</h1>
        <p className="my-scenes-page__subtitle">
          Your collection of geometric creations
        </p>
      </div>

      {/* Controls */}
      <div className="my-scenes-page__controls">
        {/* Sort */}
        <div className="my-scenes-page__control-group">
          <label>Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="my-scenes-page__select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-viewed">Most Viewed</option>
            <option value="name">Name (A-Z)</option>
          </select>
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
          <span className="my-scenes-page__empty-icon">🌌</span>
          <h2>No scenes yet</h2>
          <p>Create your first geometric masterpiece in the Geometry Lab!</p>
          <button
            className="my-scenes-page__cta"
            onClick={() => navigate("/geometry-lab")}
          >
            Start Creating
          </button>
        </div>
      )}

      {/* Scene Grid */}
      {!loading && sortedScenes.length > 0 && (
        <div className="my-scenes-page__grid">
          {sortedScenes.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              showLoadButton={true}
              showEditButton={true}
              showDeleteButton={true}
              onLoad={handleLoad}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={cancelDelete}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal__icon">⚠️</div>
            <h2 className="delete-modal__title">Delete Scene?</h2>
            <p className="delete-modal__message">
              Are you sure you want to delete <strong>"{sceneToDelete?.name}"</strong>?
              <br />
              This action cannot be undone.
            </p>
            <div className="delete-modal__actions">
              <button
                className="delete-modal__btn delete-modal__btn--cancel"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="delete-modal__btn delete-modal__btn--delete"
                onClick={confirmDelete}
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
