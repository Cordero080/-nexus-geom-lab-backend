import React, { useEffect, useRef, useState } from 'react';
import styles from '../HomeIndex.module.scss';
import QuantumPortal from './QuantumPortal';

/**
 * All background layers for HomePage including portal bg and parallax layers
 * @param {Object} portalState - Current portal color state
 * @param {Object} bgRef - Ref for background parallax layer
 * @param {Object} fgRef - Ref for foreground parallax layer
 */
export default function BackgroundLayers({ portalState, bgRef, fgRef }) {
  const [currentColors, setCurrentColors] = useState(portalState.colors);
  const [targetColors, setTargetColors] = useState(portalState.colors);
  const animationRef = useRef(null);

  useEffect(() => {
    setTargetColors(portalState.colors);
    
    const startTime = Date.now();
    const duration = 800; // Reduced to 0.8 seconds for faster transition
    const startColors = [...currentColors];
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease in-out
      const eased = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress;
      
      const interpolated = startColors.map((start, i) => {
        const target = portalState.colors[i];
        const startRGB = hexToRgb(start);
        const targetRGB = hexToRgb(target);
        
        const r = Math.round(startRGB.r + (targetRGB.r - startRGB.r) * eased);
        const g = Math.round(startRGB.g + (targetRGB.g - startRGB.g) * eased);
        const b = Math.round(startRGB.b + (targetRGB.b - startRGB.b) * eased);
        
        return rgbToHex(r, g, b);
      });
      
      setCurrentColors(interpolated);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [portalState.colors]);

  return (
    <>
      {/* Three.js Quantum Portal Effect - Top */}
      <QuantumPortal
        position="top"
        sceneColors={{
          color1: currentColors[0],
          color2: currentColors[1],
          color3: currentColors[2],
        }}
      />

      {/* Three.js Quantum Portal Effect - Bottom */}
      <QuantumPortal
        position="bottom"
        sceneColors={{
          color1: currentColors[0],
          color2: currentColors[1],
          color3: currentColors[2],
        }}
      />

      {/* Three.js Quantum Portal Effect - Middle */}
      <QuantumPortal
        position="middle"
        sceneColors={{
          color1: currentColors[0],
          color2: currentColors[1],
          color3: currentColors[2],
        }}
      />

      {/* Base Dark Layer */}
      <div className={styles.baseDark}></div>

      {/* Quantum Portal Background Layer */}
      <div
        className={styles.quantumPortalLayer}
        style={{
          '--portal-color-0': currentColors[0],
          '--portal-color-1': currentColors[1],
          '--portal-color-2': currentColors[2],
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
              ${currentColors[0]} 0%, 
              ${currentColors[1]} 60%, 
              ${currentColors[2]} 100%
            )`,
          }}
        >
          <defs>
            <linearGradient id="portal-glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={currentColors[0]} stopOpacity="0.6" />
              <stop offset="50%" stopColor={currentColors[1]} stopOpacity="0.4" />
              <stop offset="100%" stopColor={currentColors[2]} stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1920" height="1080" fill="url(#portal-glow)" />
        </svg>
      </div>

      {/* 3D Parallax Layers */}
      <div ref={bgRef} className={styles.parallaxBgLayer} aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 1920 400">
          <defs>
            <linearGradient id="homepage-parallax-bg-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="1" />
              <stop offset="100%" stopColor="#0a0f1a" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1920" height="400" fill="url(#homepage-parallax-bg-grad)" />
        </svg>
      </div>
      <div ref={fgRef} className={styles.parallaxFgLayer} aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 1920 400">
          <defs>
            <linearGradient id="homepage-parallax-fg-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="1" />
              <stop offset="100%" stopColor="#0a0f1a" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1920" height="400" fill="url(#homepage-parallax-fg-grad)" />
        </svg>
      </div>
    </>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
