import React, { useState } from "react";
import ScrambleButton from "../../ui/ScrambleButton/ScrambleButton";
import styles from "./SceneCard.module.scss";
import { formatDate, getPlaceholderGradient } from "../../../utils/coreHelpers";

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
 * - portalColors: Array of portal colors [color0, color1, color2]
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
  isHighlighted = false,
  portalColors = ['#00ffff', '#ff00ff', '#ffff00'],
}) {
  const [imageError, setImageError] = useState(false);

  const OutlineSVG = ({ id }) => {
    // Hexagonal portal SVG matching empty state
    return (
      <svg className={styles.sceneCardGeo} viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <linearGradient id={`card-grad-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={portalColors[0]} stopOpacity="0.8"/>
            <stop offset="50%" stopColor={portalColors[1]} stopOpacity="0.6"/>
            <stop offset="100%" stopColor={portalColors[2]} stopOpacity="0.8"/>
          </linearGradient>
          <filter id={`card-glow-${id}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Outer hexagon */}
        <polygon 
          points="60,10 95,32.5 95,77.5 60,100 25,77.5 25,32.5" 
          stroke={`url(#card-grad-${id})`}
          strokeWidth="2" 
          fill="none"
          filter={`url(#card-glow-${id})`}
        />
        {/* Inner hexagon */}
        <polygon 
          points="60,25 82.5,37.5 82.5,67.5 60,80 37.5,67.5 37.5,37.5" 
          stroke={portalColors[1]} 
          strokeWidth="1.5" 
          fill="none"
          opacity="0.6"
        />
        {/* Center cube wireframe */}
        <path 
          d="M 45,45 L 60,35 L 75,45 L 75,65 L 60,75 L 45,65 Z M 60,35 L 60,55 M 45,45 L 60,55 M 75,45 L 60,55 M 45,65 L 60,75 M 75,65 L 60,75" 
          stroke={portalColors[0]} 
          strokeWidth="1.5" 
          fill="none"
          opacity="0.8"
        />
        {/* Corner nodes */}
        <circle cx="60" cy="10" r="3" fill={portalColors[0]} opacity="0.9"/>
        <circle cx="95" cy="32.5" r="3" fill={portalColors[1]} opacity="0.9"/>
        <circle cx="95" cy="77.5" r="3" fill={portalColors[2]} opacity="0.9"/>
        <circle cx="60" cy="100" r="3" fill={portalColors[0]} opacity="0.9"/>
        <circle cx="25" cy="77.5" r="3" fill={portalColors[1]} opacity="0.9"/>
        <circle cx="25" cy="32.5" r="3" fill={portalColors[2]} opacity="0.9"/>
      </svg>
    );
  };

  return (
    <div className={`${styles.sceneCard} ${isHighlighted ? styles.sceneCardHighlighted : ''}`}>
      {/* Thumbnail */}
      <div
        className={styles.sceneCardThumbnail}
        style={{ background: getPlaceholderGradient(scene.id) }}
      >
        {scene.thumbnailUrl && !imageError ? (
          <img
            src={scene.thumbnailUrl}
            alt={scene.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.sceneCardPlaceholder}>
            {/* Geometric outline placeholder - shape-aware */}
            <OutlineSVG id={scene.id} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className={styles.sceneCardInfo}>
        <h3 className={styles.sceneCardTitle}>{scene.name}</h3>

        {scene.description && (
          <p className={styles.sceneCardDescription}>{scene.description}</p>
        )}

        {/* Meta */}
        <div className={styles.sceneCardMeta}>
          {creatorName && (
            <span className={styles.sceneCardCreator}>@{creatorName}</span>
          )}
          <span className={styles.sceneCardDate}>{formatDate(scene.createdAt)}</span>
          <span className={styles.sceneCardViews}>👁️ {scene.viewCount || 0}</span>
        </div>

        {/* Actions */}
        <div className={styles.sceneCardActions}>
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
