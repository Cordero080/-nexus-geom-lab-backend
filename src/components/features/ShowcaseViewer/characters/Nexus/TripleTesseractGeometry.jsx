import React from 'react';
import * as THREE from 'three';

/**
 * Triple Tesseract System for Nexus Prime
 * Three additional tesseract layers with different rotations and animations
 */
export default function TripleTesseractGeometry({
  size,
  fourthTesseractInnerRef,
  fourthTesseractOuterRef,
}) {
  return (
    <>
      {/* Second tesseract layer - same size, rotated 90° on X-axis (vertical) */}
      {/* Inner cube - rotated */}
      <lineSegments position={[0, 0, 0]} scale={[0.6, 0.6, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color="#00ff00" linewidth={2} opacity={0.8} transparent />
      </lineSegments>

      {/* Outer cube - rotated */}
      <lineSegments position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color="#00dd00" linewidth={2} opacity={0.6} transparent />
      </lineSegments>

      {/* Third tesseract layer - phase sweep at 30 degrees */}
      {/* Inner cube - angled stretch */}
      <lineSegments position={[0, 0, 0]} scale={[0.6, 0.7, 0.6]} rotation={[0, Math.PI / 6, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color="#44ff00" linewidth={2} opacity={0.8} transparent />
      </lineSegments>

      {/* Outer cube - angled stretch */}
      <lineSegments position={[0, 0, 0]} scale={[1.2, 1.3, 1.2]} rotation={[0, Math.PI / 6, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color="#66ff22" linewidth={2} opacity={0.6} transparent />
      </lineSegments>

      {/* Fourth tesseract layer - phase sweep symmetrically opposite at -30 degrees */}
      {/* Inner cube - opposite angled stretch with animated pulsing */}
      <lineSegments position={[0, 0, 0]} scale={[0.6, 0.7, 0.6]} rotation={[0, -Math.PI / 6, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial
          ref={fourthTesseractInnerRef}
          color="#88ff44"
          linewidth={2}
          opacity={0.7}
          transparent
        />
      </lineSegments>

      {/* Outer cube - opposite angled stretch with animated pulsing */}
      <lineSegments position={[0, 0, 0]} scale={[1.2, 1.3, 1.2]} rotation={[0, -Math.PI / 6, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial
          ref={fourthTesseractOuterRef}
          color="#1bd0d7ff"
          linewidth={2}
          opacity={0.5}
          transparent
        />
      </lineSegments>
    </>
  );
}
