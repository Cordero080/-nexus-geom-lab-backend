import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Multi-layered Holographic Cube with Iridescent Shimmer
 * Three transparent cube layers with edge wireframe
 */
export default function HolographicCube({ size }) {
  const edgeMaterialRef = useRef();
  const cubeMaterialRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Animate edge wireframe color - cycle through cyan, magenta, yellow
    if (edgeMaterialRef.current) {
      const r = Math.sin(time * 0.5) * 0.5 + 0.5;
      const g = Math.sin(time * 0.5 + 2) * 0.5 + 0.5;
      const b = Math.sin(time * 0.5 + 4) * 0.5 + 0.5;
      edgeMaterialRef.current.color.setRGB(r, g, b);
    }
    
    // Cube material shimmer effect - rainbow iridescence
    if (cubeMaterialRef.current) {
      const shimmerTime = time * 0.8;
      const hue = (shimmerTime * 0.1) % 1;
      const r = Math.abs(Math.sin((shimmerTime + hue * 6.28) * 0.5)) * 0.5 + 0.3;
      const g = Math.abs(Math.sin((shimmerTime + hue * 6.28 + 2) * 0.5)) * 0.5 + 0.3;
      const b = Math.abs(Math.sin((shimmerTime + hue * 6.28 + 4) * 0.5)) * 0.5 + 0.5;
      cubeMaterialRef.current.color.setRGB(r, g, b);
      cubeMaterialRef.current.emissiveIntensity = 0.3 + Math.sin(shimmerTime * 2) * 0.15;
    }
  });

  return (
    <>
      {/* Outer holographic layer */}
      <mesh>
        <boxGeometry args={[size * 1.02, size * 1.02, size * 1.02]} />
        <meshPhysicalMaterial
          color="#ff00ff"
          transparent
          opacity={0.08}
          metalness={1.0}
          roughness={0.0}
          transmission={0.95}
          side={THREE.DoubleSide}
          iridescence={1.0}
          iridescenceIOR={2.5}
          iridescenceThicknessRange={[400, 1600]}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
        />
      </mesh>
      
      {/* Middle shimmering layer */}
      <mesh>
        <boxGeometry args={[size, size, size]} />
        <meshPhysicalMaterial
          ref={cubeMaterialRef}
          color="#00ffff"
          transparent
          opacity={0.15}
          metalness={0.95}
          roughness={0.02}
          transmission={0.8}
          thickness={0.5}
          side={THREE.DoubleSide}
          emissive="#00ffff"
          emissiveIntensity={0.3}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          iridescence={1.0}
          iridescenceIOR={1.8}
          iridescenceThicknessRange={[200, 1200]}
        />
      </mesh>
      
      {/* Inner holographic core */}
      <mesh>
        <boxGeometry args={[size * 0.98, size * 0.98, size * 0.98]} />
        <meshPhysicalMaterial
          color="#ffff00"
          transparent
          opacity={0.06}
          metalness={1.0}
          roughness={0.0}
          transmission={0.98}
          side={THREE.DoubleSide}
          iridescence={1.0}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 600]}
        />
      </mesh>
      
      {/* Cube edges (wireframe) */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial ref={edgeMaterialRef} color="#00ffff" linewidth={2} />
      </lineSegments>
    </>
  );
}
