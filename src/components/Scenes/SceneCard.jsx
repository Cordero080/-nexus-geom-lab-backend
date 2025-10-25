import React, { useState } from "react";
import ScrambleButton from "../ScrambleButton/ScrambleButton";
import "./SceneCard.css";

/**
 * SceneCard - Reusable card component for scene galleries
 * 
 * Props:
 * - scene: Scene object with id, name, description, userId, createdAt, viewCount
 * - showLoadButton: Show "Load" button
 * - showEditButton: Show "Edit" button
 * - showDeleteButton: Show "Delete" button
 * - onLoad: Callback when Load clicked
 * - onEdit: Callback when Edit clicked
 * - onDelete: Callback when Delete clicked
 * - creatorName: Username of creator (optional)
 */
export default function SceneCard({
  scene,
  showLoadButton = false,
  showEditButton = false,
  showDeleteButton = false,
  onLoad,
  onEdit,
  onDelete,
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
          </div>
        )}
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
          {/* Load Button */}
          {showLoadButton && (
            <ScrambleButton
              variant="primary"
              onClick={() => onLoad?.(scene)}
            >
              Load
            </ScrambleButton>
          )}

          {/* Edit Button */}
          {showEditButton && (
            <ScrambleButton
              variant="secondary"
              onClick={() => onEdit?.(scene)}
            >
              Edit
            </ScrambleButton>
          )}

          {/* Delete Button */}
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
