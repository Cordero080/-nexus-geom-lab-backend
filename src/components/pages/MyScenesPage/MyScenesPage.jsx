import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useScene } from "../../../context/SceneContext";
import { useAuth } from "../../../context/AuthContext";
import { getMyScenes } from "../../../services/sceneApi"; // Import API function
import SceneCard from "../../features/Scenes/SceneCard"; // Corrected import path to Scenes
import CustomSelect from "../../ui/CustomSelect/CustomSelect";
import ScrambleButton from "../../ui/ScrambleButton/ScrambleButton";
import { BeamScanButton } from "../../features/HUD";
import { DeleteSuccessModal } from "../../ui/Modals";
import NavBar from "../../layout/NavBar/NavBar";
import HomeBackground from "../../shared/HomeBackground/HomeBackground";
import { quantumCollapse } from "../../../utils/coreHelpers";
import "./MyScenesPage.css";
import sharedStyles from "../../../styles/shared.module.scss";
import "../../layout/NavBar/nav.css";
import { GEOM_LAB_LINK_TEXT, SHOWCASE_LINK_TEXT } from "../../layout/NavBar/navLabels";

// quantumCollapse now imported from utils/coreHelpers.js

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
  { colors: ['#ff3300', '#cc00ff', '#0a0f1a'], label: 'Being' },    // 🔥 Volcanic red/magenta
  { colors: ['#00ff33', '#00aaff', '#003a3a'], label: '' },    // 💎 Crystalline green/blue
  { colors: ['#cfccbeff', '#056864ff', '#210205ff'], label: 'Singularity' },   // ⭐ Stellar white/cyan
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
  const location = useLocation();
  const { loadScene, deleteScene } = useScene();
  const { isAuthenticated, logout, user, token } = useAuth(); // Get user and token from auth

  // Get highlighted scene ID from navigation state
  const highlightSceneId = location.state?.highlightSceneId;

  // Scene management state
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState(null);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [deletedSceneName, setDeletedSceneName] = useState("");

  /**
   * QUANTUM STATE MANAGEMENT
   * 
   * Current portal dimension and glyph set - these determine the active color scheme
   * and mathematical symbols throughout the interface. Initial state is randomly
   * collapsed from the available quantum superposition.
   */
  const [portalState, setPortalState] = useState(() => quantumCollapse(portalWorlds));
  const [glyphState, setGlyphState] = useState(() => quantumCollapse(glyphSets));

  // Parallax is now handled by HomeBackground component

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
    loadScene(scene, user?.id);
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
      alert("Failed to delete scene. Please try again.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSceneToDelete(null);
  };

  return (
    <HomeBackground portalState={portalState}>
      <div className="my-scenes-page">
        <NavBar portalColors={portalState.colors} glyphs={glyphState} />

      {/* Header */}
      <div className="my-scenes-page__header">
        <h1 className={`${sharedStyles.pageTitle} my-scenes-page__title`}>
          <span className="title-word" data-word="MY">MY</span>
          {' '}
          <span className="title-word" data-word="SCENES">SCENES</span>
        </h1>
        <p className={`${sharedStyles.pageSubtitle} my-scenes-page__subtitle`}>
          Your collection of geometric creations``
        </p>
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
              { value: 'name', label: 'Name (A-Z)' }
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
          <span className="my-scenes-page__empty-icon">�</span>
          <h2>No scenes yet</h2>
          <p>Create your first geometric masterpiece in the Geometry Lab!</p>
          <BeamScanButton
            onClick={() => navigate("/geometry-lab")}
            label="CREATE"
          />
        </div>
      )}

      {/* Scene Grid */}
      {!loading && sortedScenes.length > 0 && (
        <div className="my-scenes-page__grid">
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
            />
          ))}
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
    </HomeBackground>
  );
}
