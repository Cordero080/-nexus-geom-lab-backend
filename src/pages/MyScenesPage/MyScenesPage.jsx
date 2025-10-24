import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScene } from "../../context/SceneContext";
import SceneCard from "../../components/Gallery/SceneCard";
import "./MyScenesPage.css";

/**
 * Gallery Page - User's scene collection
 * Shows all scenes created by the user
 */
export default function MyScenesPage() {
  const navigate = useNavigate();
  const { loadScene, deleteScene } = useScene();

  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState(null);

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
