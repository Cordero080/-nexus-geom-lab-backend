import React, { useState } from "react";
import ScrambleButton from "../ScrambleButton/ScrambleButton";
import "./SceneCard.css";

/**
 * SceneCard - Reusable card component for scene galleries
 * 
 * Props:
 * - scene: Scene object with id, name, description, isPublic, userId, createdAt, viewCount
 * - showLoadButton: Show "Load" button (for own scenes)
 * - showEditButton: Show "Edit" button (for own scenes)
 * - showDeleteButton: Show "Delete" button (for own scenes)
 * - showViewButton: Show "View" button (for public scenes)
 * - showRemixButton: Show "Remix" button (for public scenes)
 * - onLoad: Callback when Load clicked
 * - onEdit: Callback when Edit clicked
 * - onDelete: Callback when Delete clicked
 * - onView: Callback when View clicked
 * - onRemix: Callback when Remix clicked
 * - creatorName: Username of creator (optional, for public gallery)
 */
export default function SceneCard({
  scene,
  showLoadButton = false,
  showEditButton = false,
  showDeleteButton = false,
  showViewButton = false,
  showRemixButton = false,
  onLoad,
  onEdit,
  onDelete,
  onView,
  onRemix,
  creatorName = null,
}) {
  const [imageError, setImageError] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Generate placeholder gradient (based on scene ID for consistency)
  const getPlaceholderGradient = (id) => {
    const colors = [
      ["#667eea", "#764ba2"], // Purple
      ["#f093fb", "#f5576c"], // Pink
      ["#4facfe", "#00f2fe"], // Blue
      ["#43e97b", "#38f9d7"], // Green
      ["#fa709a", "#fee140"], // Orange/Pink
      ["#30cfd0", "#330867"], // Teal/Purple
    ];

    // Simple hash to pick consistent color
    const hash = id?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    const [color1, color2] = colors[hash % colors.length];

    return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
  };

  return (
    <div className="scene-card">
      {/* Thumbnail */}
      <div
        className="scene-card__thumbnail"
        style={{ background: getPlaceholderGradient(scene.id) }}
      >
        {scene.thumbnailUrl && !imageError ? (
          <img
            src={scene.thumbnailUrl}
            alt={scene.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="scene-card__placeholder">
            <span className="scene-card__icon">🌌</span>
          </div>
        )}

        {/* Public/Private Badge */}
        <div className="scene-card__badge-container">
          {scene.isPublic ? (
            <span className="scene-card__badge scene-card__badge--public">
              🌐 Public
            </span>
          ) : (
            <span className="scene-card__badge scene-card__badge--private">
              🔒 Private
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="scene-card__info">
        <h3 className="scene-card__title">{scene.name}</h3>

        {scene.description && (
          <p className="scene-card__description">{scene.description}</p>
        )}

        {/* Meta */}
        <div className="scene-card__meta">
          {creatorName && (
            <span className="scene-card__creator">@{creatorName}</span>
          )}
          <span className="scene-card__date">{formatDate(scene.createdAt)}</span>
          <span className="scene-card__views">👁️ {scene.viewCount || 0}</span>
        </div>

        {/* Actions */}
        <div className="scene-card__actions">
          {/* Load Button (Own Scenes) */}
          {showLoadButton && (
            <ScrambleButton
              variant="primary"
              onClick={() => onLoad?.(scene)}
            >
              Load
            </ScrambleButton>
          )}

          {/* Edit Button (Own Scenes) */}
          {showEditButton && (
            <ScrambleButton
              variant="secondary"
              onClick={() => onEdit?.(scene)}
            >
              Edit
            </ScrambleButton>
          )}

          {/* View Button (Public Scenes) */}
          {showViewButton && (
            <ScrambleButton
              variant="primary"
              onClick={() => onView?.(scene)}
            >
              View
            </ScrambleButton>
          )}

          {/* Remix Button (Public Scenes) */}
          {showRemixButton && (
            <ScrambleButton
              variant="secondary"
              onClick={() => onRemix?.(scene)}
            >
              Remix
            </ScrambleButton>
          )}

          {/* Delete Button (Own Scenes) */}
          {showDeleteButton && (
            <ScrambleButton
              variant="danger"
              onClick={() => onDelete?.(scene)}
            >
              Delete
            </ScrambleButton>
          )}
        </div>
      </div>
    </div>
  );
}
