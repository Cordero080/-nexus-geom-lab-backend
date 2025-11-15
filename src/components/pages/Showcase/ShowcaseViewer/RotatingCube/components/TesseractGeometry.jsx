import React from 'react';
import * as THREE from 'three';

/**
 * Basic Tesseract (4D Hypercube) Geometry
 * Used for Icarus and as base layer for Nexus Prime
 * Consists of inner cube, outer cube, and 8 connecting corner lines
 */
export default function TesseractGeometry({ size }) {
  return (
    <>
      {/* Inner cube of tesseract */}
      <lineSegments position={[0, 0, 0]} scale={[0.6, 0.6, 0.6]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color="#ff8800" linewidth={2} opacity={0.8} transparent />
      </lineSegments>

      {/* Outer cube of tesseract */}
      <lineSegments position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color="#ffaa00" linewidth={2} opacity={0.6} transparent />
      </lineSegments>

      {/* Connecting lines between inner and outer cubes (8 corners) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={16}
            array={
              new Float32Array([
                // Connect 8 corners from inner to outer cube
                -size * 0.3,
                -size * 0.3,
                -size * 0.3,
                -size * 0.6,
                -size * 0.6,
                -size * 0.6, // corner 1
                size * 0.3,
                -size * 0.3,
                -size * 0.3,
                size * 0.6,
                -size * 0.6,
                -size * 0.6, // corner 2
                -size * 0.3,
                size * 0.3,
                -size * 0.3,
                -size * 0.6,
                size * 0.6,
                -size * 0.6, // corner 3
                size * 0.3,
                size * 0.3,
                -size * 0.3,
                size * 0.6,
                size * 0.6,
                -size * 0.6, // corner 4
                -size * 0.3,
                -size * 0.3,
                size * 0.3,
                -size * 0.6,
                -size * 0.6,
                size * 0.6, // corner 5
                size * 0.3,
                -size * 0.3,
                size * 0.3,
                size * 0.6,
                -size * 0.6,
                size * 0.6, // corner 6
                -size * 0.3,
                size * 0.3,
                size * 0.3,
                -size * 0.6,
                size * 0.6,
                size * 0.6, // corner 7
                size * 0.3,
                size * 0.3,
                size * 0.3,
                size * 0.6,
                size * 0.6,
                size * 0.6, // corner 8
              ])
            }
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffcc33" opacity={0.5} transparent linewidth={1} />
      </line>
    </>
  );
}
