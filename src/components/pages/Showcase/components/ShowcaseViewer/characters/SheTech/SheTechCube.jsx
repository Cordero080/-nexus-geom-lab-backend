import React from 'react';
import * as THREE from 'three';

/**
 * SheTechCube - Tall rectangular purple holographic container
 * Used for She-Tech character (#004) - provides more vertical space
 */
export default function SheTechCube({ size }) {
  const width = size * 1.6; // WIDER left to right
  const height = size; // Normal height
  const depth = size * 1.6; // DEEPER (front to back)

  return (
    <group>
      {/* Main rectangular wireframe - purple */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
        <lineBasicMaterial color="#8a2be2" transparent opacity={0.6} />
      </lineSegments>

      {/* Inner rectangular wireframe - lighter purple */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width * 0.7, height * 0.7, depth * 0.7)]} />
        <lineBasicMaterial color="#ba55d3" transparent opacity={0.4} />
      </lineSegments>

      {/* Corner accent spheres */}
      {[
        [-width/2, -height/2, -depth/2], [width/2, -height/2, -depth/2],
        [-width/2, height/2, -depth/2], [width/2, height/2, -depth/2],
        [-width/2, -height/2, depth/2], [width/2, -height/2, depth/2],
        [-width/2, height/2, depth/2], [width/2, height/2, depth/2],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#8a2be2" transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Subtle purple glow */}
      <pointLight position={[0, 0, 0]} color="#8a2be2" intensity={0.5} distance={size * 2} />
    </group>
  );
}

