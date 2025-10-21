import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import FBXModel from './FBXModel';

export default function RotatingCube({ size = 3, fbxUrl = null }) {
  const cubeRef = useRef();
  const innerLightRef = useRef();

  // Rotation animation
  useFrame((state, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += delta * 0.5; // Rotate clockwise around Y axis only
    }
    
    // Pulse the inner light
    if (innerLightRef.current) {
      innerLightRef.current.intensity = (size / 3) * 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });
  
  // Scale inner sphere based on cube size
  const sphereRadius = size * 0.27;

  return (
    <group ref={cubeRef} position={[0, -0.5, 0]}>
      {/* Transparent cube container */}
      <mesh>
        <boxGeometry args={[size, size, size]} />
        <meshPhysicalMaterial
          color="#00ffff"
          transparent
          opacity={0.12}
          metalness={0.1}
          roughness={0.1}
          transmission={0.9}
          thickness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Cube edges (wireframe) */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color="#00ffff" linewidth={2} />
      </lineSegments>
      
      {/* Interior point light */}
      <pointLight
        ref={innerLightRef}
        position={[0, 0, 0]}
        color="#ff00ff"
        intensity={1.5}
        distance={size}
      />
      
      {/* FBX Model or placeholder sphere */}
      {fbxUrl ? (
        <FBXModel url={fbxUrl} scale={0.001275} />
      ) : (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[sphereRadius, 32, 32]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      )}
    </group>
  );
}
