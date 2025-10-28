import React, { useState } from "react";
import ScrambleButton from "../ScrambleButton/ScrambleButton";
import styles from "./SceneCard.module.scss";
import { formatDate, getPlaceholderGradient } from "../../utils/coreHelpers";

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
  isHighlighted = false,
}) {
  const [imageError, setImageError] = useState(false);

  // Determine scene object type for placeholder outline (fallback to generic)
  const objectType = (scene?.config?.objectType || scene?.objectType || '').toLowerCase();

  const OutlineSVG = ({ id }) => {
    const gradId = `scene-wire-${id}`;
    const commonDefs = (
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ffff" />
          <stop offset="100%" stopColor="#ff00ff" />
        </linearGradient>
      </defs>
    );

    const stroke = `url(#${gradId})`;

    // Simple, lightweight wireframe shapes per object type
    switch (objectType) {
      case 'box':
      case 'cube':
        // Isometric cube: front + back squares with connectors
        return (
          <svg className="scene-card__geo" viewBox="0 0 200 200" aria-hidden="true">
            {commonDefs}
            <g fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="50" y="50" width="80" height="80" className="geo-outline" />
              <rect x="70" y="30" width="80" height="80" className="geo-outline geo-outline--inner" />
              <line x1="50" y1="50" x2="70" y2="30" className="geo-connector" />
              <line x1="130" y1="50" x2="150" y2="30" className="geo-connector" />
              <line x1="50" y1="130" x2="70" y2="110" className="geo-connector" />
              <line x1="130" y1="130" x2="150" y2="110" className="geo-connector" />
            </g>
          </svg>
        );
      case 'icosahedron':
        // Stylized polyhedron using triangles and a hex-like core
        return (
          <svg className="scene-card__geo" viewBox="0 0 200 200" aria-hidden="true">
            {commonDefs}
            <g fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="100,15 160,50 160,120 100,155 40,120 40,50" className="geo-outline" />
              <polygon points="100,45 140,68 140,102 100,125 60,102 60,68" className="geo-outline geo-outline--inner" />
              <line x1="100" y1="15" x2="100" y2="45" className="geo-connector" />
              <line x1="160" y1="50" x2="140" y2="68" className="geo-connector" />
              <line x1="160" y1="120" x2="140" y2="102" className="geo-connector" />
              <line x1="100" y1="155" x2="100" y2="125" className="geo-connector" />
              <line x1="40" y1="120" x2="60" y2="102" className="geo-connector" />
              <line x1="40" y1="50" x2="60" y2="68" className="geo-connector" />
            </g>
          </svg>
        );
      case 'octahedron':
        return (
          <svg className="scene-card__geo" viewBox="0 0 200 200" aria-hidden="true">
            {commonDefs}
            <g fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="100,20 160,100 100,180 40,100" className="geo-outline" />
              <polygon points="100,45 135,100 100,155 65,100" className="geo-outline geo-outline--inner" />
              <line x1="40" y1="100" x2="160" y2="100" className="geo-connector" />
              <line x1="100" y1="20" x2="100" y2="180" className="geo-connector" />
            </g>
          </svg>
        );
      case 'sphere':
        // Equator + two longitudes as arcs/ellipses
        return (
          <svg className="scene-card__geo" viewBox="0 0 200 200" aria-hidden="true">
            {commonDefs}
            <g fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="100" cy="100" r="60" className={styles.geoOutline} />
              <ellipse cx="100" cy="100" rx="60" ry="24" className={`${styles.geoOutline} ${styles.geoOutlineInner}`} />
              <ellipse cx="100" cy="100" rx="24" ry="60" className={`${styles.geoOutline} ${styles.geoOutlineInner}`} />
            </g>
          </svg>
        );
      default:
        // Generic hex/poly wireframe (existing fallback)
        return (
          <svg className={styles.sceneCardGeo} viewBox="0 0 200 200" aria-hidden="true">
            {commonDefs}
            <g fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="100,10 173,55 173,145 100,190 27,145 27,55" className={styles.geoOutline} />
              <polygon points="100,40 153,70 153,130 100,160 47,130 47,70" className={`${styles.geoOutline} ${styles.geoOutlineInner}`} />
              <line x1="100" y1="10" x2="100" y2="40" className={styles.geoConnector} />
              <line x1="173" y1="55" x2="153" y2="70" className={styles.geoConnector} />
              <line x1="173" y1="145" x2="153" y2="130" className={styles.geoConnector} />
              <line x1="100" y1="190" x2="100" y2="160" className={styles.geoConnector} />
              <line x1="27" y1="145" x2="47" y2="130" className={styles.geoConnector} />
              <line x1="27" y1="55" x2="47" y2="70" className={styles.geoConnector} />
              <line x1="27" y1="55" x2="173" y2="145" className={styles.geoDiagonal} />
              <line x1="173" y1="55" x2="27" y2="145" className={styles.geoDiagonal} />
            </g>
          </svg>
        );
    }
  };

  // Helper functions now imported from utils/coreHelpers.js

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
