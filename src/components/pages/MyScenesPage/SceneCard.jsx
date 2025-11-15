import React, { useState } from 'react';
import ScrambleButton from '../../ui/ScrambleButton/ScrambleButton';
import styles from './SceneCard.module.scss';
import { formatDate, getPlaceholderGradient } from '../../../utils/coreHelpers';

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

  // Determine scene object type for placeholder outline (fallback to generic)
  const objectType = (scene?.config?.objectType || scene?.objectType || '').toLowerCase();

  const OutlineSVG = ({ id }) => {
    const gradId = `card-grad-${id}`;
    const commonDefs = (
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={portalColors[0]} stopOpacity="0.8" />
          <stop offset="50%" stopColor={portalColors[1]} stopOpacity="0.6" />
          <stop offset="100%" stopColor={portalColors[2]} stopOpacity="0.8" />
        </linearGradient>
      </defs>
    );

    const stroke = `url(#${gradId})`;

    // Shape-aware wireframe SVGs with portal color gradients
    switch (objectType) {
      case 'box':
      case 'cube':
        // Isometric cube: front + back squares with connectors
        return (
          <svg className={styles.sceneCardGeo} viewBox="0 0 200 200" aria-hidden="true">
            {commonDefs}
            <g
              fill="none"
              stroke={stroke}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="20" y="40" width="120" height="120" className={styles.geoOutline} />
              <rect
                x="60"
                y="10"
                width="120"
                height="120"
                className={`${styles.geoOutline} ${styles.geoOutlineInner}`}
              />
              <line x1="20" y1="40" x2="60" y2="10" className={styles.geoConnector} />
              <line x1="140" y1="40" x2="180" y2="10" className={styles.geoConnector} />
              <line x1="20" y1="160" x2="60" y2="130" className={styles.geoConnector} />
              <line x1="140" y1="160" x2="180" y2="130" className={styles.geoConnector} />
            </g>
          </svg>
        );
      case 'icosahedron':
        // Stylized polyhedron using triangles and a hex-like core
        return (
          <svg className={styles.sceneCardGeo} viewBox="0 0 200 200" aria-hidden="true">
            {commonDefs}
            <g
              fill="none"
              stroke={stroke}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon
                points="100,10 180,50 180,150 100,190 20,150 20,50"
                className={styles.geoOutline}
              />
              <polygon
                points="100,40 150,70 150,130 100,160 50,130 50,70"
                className={`${styles.geoOutline} ${styles.geoOutlineInner}`}
              />
              <line x1="100" y1="10" x2="100" y2="40" className={styles.geoConnector} />
              <line x1="180" y1="50" x2="150" y2="70" className={styles.geoConnector} />
              <line x1="180" y1="150" x2="150" y2="130" className={styles.geoConnector} />
              <line x1="100" y1="190" x2="100" y2="160" className={styles.geoConnector} />
              <line x1="20" y1="150" x2="50" y2="130" className={styles.geoConnector} />
              <line x1="20" y1="50" x2="50" y2="70" className={styles.geoConnector} />
            </g>
          </svg>
        );
      case 'octahedron':
        return (
          <svg className={styles.sceneCardGeo} viewBox="0 0 200 200" aria-hidden="true">
            {commonDefs}
            <g
              fill="none"
              stroke={stroke}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="100,10 180,100 100,190 20,100" className={styles.geoOutline} />
              <polygon
                points="100,45 145,100 100,155 55,100"
                className={`${styles.geoOutline} ${styles.geoOutlineInner}`}
              />
              <line x1="20" y1="100" x2="180" y2="100" className={styles.geoConnector} />
              <line x1="100" y1="10" x2="100" y2="190" className={styles.geoConnector} />
            </g>
          </svg>
        );
      case 'sphere':
        // Equator + two longitudes as arcs/ellipses
        return (
          <svg className={styles.sceneCardGeo} viewBox="-10 -10 220 220" aria-hidden="true">
            {commonDefs}
            <g
              fill="none"
              stroke={stroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="100" cy="100" r="60" className={styles.geoOutline} />
              <ellipse
                cx="100"
                cy="100"
                rx="60"
                ry="24"
                className={`${styles.geoOutline} ${styles.geoOutlineInner}`}
              />
              <ellipse
                cx="100"
                cy="100"
                rx="24"
                ry="60"
                className={`${styles.geoOutline} ${styles.geoOutlineInner}`}
              />
            </g>
          </svg>
        );
      default:
        // Generic hex/poly wireframe (fallback)
        return (
          <svg className={styles.sceneCardGeo} viewBox="-10 -10 220 220" aria-hidden="true">
            {commonDefs}
            <g
              fill="none"
              stroke={stroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon
                points="100,10 173,55 173,145 100,190 27,145 27,55"
                className={styles.geoOutline}
              />
              <polygon
                points="100,40 153,70 153,130 100,160 47,130 47,70"
                className={`${styles.geoOutline} ${styles.geoOutlineInner}`}
              />
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

  return (
    <div className={`${styles.sceneCard} ${isHighlighted ? styles.sceneCardHighlighted : ''}`}>
      {/* Thumbnail */}
      <div
        className={styles.sceneCardThumbnail}
        style={{ background: getPlaceholderGradient(scene.id) }}
      >
        {scene.thumbnailUrl && !imageError ? (
          <img src={scene.thumbnailUrl} alt={scene.name} onError={() => setImageError(true)} />
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

        {scene.description && <p className={styles.sceneCardDescription}>{scene.description}</p>}

        {/* Meta */}
        <div className={styles.sceneCardMeta}>
          {creatorName && <span className={styles.sceneCardCreator}>@{creatorName}</span>}
          <span className={styles.sceneCardDate}>{formatDate(scene.createdAt)}</span>
          <span className={styles.sceneCardViews}>👁️ {scene.viewCount || 0}</span>
        </div>

        {/* Actions */}
        <div className={styles.sceneCardActions}>
          {/* Load Button */}
          {showLoadButton && (
            <ScrambleButton variant="primary" onClick={() => onLoad?.(scene)}>
              Load
            </ScrambleButton>
          )}

          {/* Edit Button */}
          {showEditButton && (
            <ScrambleButton variant="secondary" onClick={() => onEdit?.(scene)}>
              Edit
            </ScrambleButton>
          )}

          {/* Delete Button */}
          {showDeleteButton && (
            <ScrambleButton variant="danger" onClick={() => onDelete?.(scene)} className="delete-btn">
              X
            </ScrambleButton>
          )}
        </div>
      </div>
    </div>
  );
}
