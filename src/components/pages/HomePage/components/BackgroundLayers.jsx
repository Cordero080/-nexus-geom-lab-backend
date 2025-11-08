import React from 'react';
import styles from '../HomeIndex.module.scss';

/**
 * All background layers for HomePage including portal bg and parallax layers
 * @param {Object} portalState - Current portal color state
 * @param {Object} bgRef - Ref for background parallax layer
 * @param {Object} fgRef - Ref for foreground parallax layer
 */
export default function BackgroundLayers({ portalState, bgRef, fgRef }) {
  return (
    <>
      {/* Base Dark Layer */}
      <div className={styles.baseDark}></div>

      {/* Quantum Portal Background Layer */}
      <div 
        className={styles.quantumPortalLayer}
        style={{
          '--portal-color-0': portalState.colors[0],
          '--portal-color-1': portalState.colors[1],
          '--portal-color-2': portalState.colors[2]
        }}
      />

      {/* Inverted veil to cover quantum colors at top */}
      <div className={styles.quantumVeil}></div>

      {/* Dark Top Veil */}
      <div className={styles.darkTopVeil}></div>

      {/* Dynamic Portal Background - With fade-out like Showcase */}
      <div className="dynamic-portal-bg" aria-hidden="true">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 1920 1080" 
          className="portal-svg"
          style={{
            '--portal-svg-background': `linear-gradient(120deg, 
              ${portalState.colors[0]} 0%, 
              ${portalState.colors[1]} 60%, 
              ${portalState.colors[2]} 100%
            )`
          }}
        >
          <defs>
            <linearGradient id="portal-glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.6"/>
              <stop offset="50%" stopColor={portalState.colors[1]} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={portalState.colors[2]} stopOpacity="0.6"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1920" height="1080" fill="url(#portal-glow)"/>
        </svg>
      </div>

      {/* 3D Parallax Layers */}
      <div ref={bgRef} className={styles.parallaxBgLayer} aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 1920 400">
          <defs>
            <linearGradient id="homepage-parallax-bg-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="1"/>
              <stop offset="100%" stopColor="#0a0f1a" stopOpacity="1"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1920" height="400" fill="url(#homepage-parallax-bg-grad)"/>
        </svg>
      </div>
      <div ref={fgRef} className={styles.parallaxFgLayer} aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 1920 400">
          <defs>
            <linearGradient id="homepage-parallax-fg-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="1"/>
              <stop offset="100%" stopColor="#0a0f1a" stopOpacity="1"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1920" height="400" fill="url(#homepage-parallax-fg-grad)"/>
        </svg>
      </div>
    </>
  );
}
