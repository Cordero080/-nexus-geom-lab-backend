import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScene } from "../../context/SceneContext";
import SceneCard from "../../components/Gallery/SceneCard";
import "./PublicGalleryPage.css";

/**
 * Public Gallery Page - Community scenes
 * Shows all public scenes from all users
 */
export default function PublicGalleryPage() {
  const navigate = useNavigate();
  const { loadScene } = useScene();

  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  // Mock user data (replace with actual auth context)
  const currentUser = {
    id: "user_123",
    username: "demo_user",
  };

  // Fetch public scenes
  useEffect(() => {
    fetchPublicScenes();
  }, []);

  const fetchPublicScenes = async () => {
    setLoading(true);

    // TODO: Replace with actual API call
    // const response = await fetch(`${API_URL}/scenes?public=true`);
    // const data = await response.json();

    // Mock data for now
    const mockScenes = [
      {
        id: "public_scene_1",
        userId: "user_456",
        username: "cosmic_artist",
        name: "Nebula Dreams",
        description: "A floating tetrahedron in a cosmic nebula",
        isPublic: true,
        config: {},
        createdAt: "2025-10-22T14:30:00Z",
        viewCount: 342,
        likeCount: 67,
      },
      {
        id: "public_scene_2",
        userId: "user_789",
        username: "geometry_wizard",
        name: "Spiral Galaxy",
        description: "Icosahedron with spiral animation and hyperframe",
        isPublic: true,
        config: {},
        createdAt: "2025-10-21T10:15:00Z",
        viewCount: 521,
        likeCount: 89,
      },
      {
        id: "public_scene_3",
        userId: "user_101",
        username: "3d_master",
        name: "Alien Hyperspace",
        description: "Alien oscillations with purple gradients",
        isPublic: true,
        config: {},
        createdAt: "2025-10-20T08:45:00Z",
        viewCount: 892,
        likeCount: 142,
      },
      {
        id: "public_scene_4",
        userId: currentUser.id, // User's own public scene
        username: currentUser.username,
        name: "Chaos Theory",
        description: "Chaotic movements visualizing mathematical chaos",
        isPublic: true,
        config: {},
        createdAt: "2025-10-19T16:20:00Z",
        viewCount: 234,
        likeCount: 45,
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
      case "most-liked":
        sorted.sort((a, b) => b.likeCount - a.likeCount);
        break;
      default:
        break;
    }

    return sorted;
  };

  const sortedScenes = getSortedScenes();

  // View scene in detail
  const handleView = (scene) => {
    console.log("Opening scene viewer:", scene);
    // TODO: Open full-screen scene viewer modal
    alert(`Scene Viewer modal coming soon!\n\nScene: ${scene.name}\nBy: @${scene.username}`);
  };

  // Remix scene (load into editor)
  const handleRemix = (scene) => {
    console.log("Remixing scene:", scene);
    loadScene(scene, currentUser.id);
    navigate("/geometry-lab");
  };

  return (
    <div className="public-gallery-page">
      {/* Header */}
      <div className="public-gallery-page__header">
        <h1 className="public-gallery-page__title">Public Gallery</h1>
        <p className="public-gallery-page__subtitle">
          Explore geometric creations from the community
        </p>
      </div>

      {/* Controls */}
      <div className="public-gallery-page__controls">
        {/* Sort */}
        <div className="public-gallery-page__control-group">
          <label>Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="public-gallery-page__select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-viewed">Most Viewed</option>
            <option value="most-liked">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="public-gallery-page__loading">
          <div className="public-gallery-page__spinner"></div>
          <p>Loading community scenes...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && sortedScenes.length === 0 && (
        <div className="public-gallery-page__empty">
          <span className="public-gallery-page__empty-icon">🌍</span>
          <h2>No public scenes yet</h2>
          <p>Be the first to share a creation with the community!</p>
        </div>
      )}

      {/* Scene Grid */}
      {!loading && sortedScenes.length > 0 && (
        <div className="public-gallery-page__grid">
          {sortedScenes.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              showViewButton={true}
              showRemixButton={true}
              onView={handleView}
              onRemix={handleRemix}
              creatorName={scene.username}
            />
          ))}
        </div>
      )}
    </div>
  );
}
