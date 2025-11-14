import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Animated 3D wave background for HomePage
 * Sits as the deepest layer behind all CSS parallax effects
 */
export default function HomeAnimatedBackground({ portalColors }) {
  const meshRef = useRef();
  const geometryRef = useRef();

  // Create plane geometry with subdivisions for wave animation
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(500, 500, 50, 50);

    // Store original positions for animation
    const positions = geo.attributes.position.array;
    geo.userData.originalPositions = new Float32Array(positions);

    return geo;
  }, []);

  // Animate vertices every frame
  useFrame((state) => {
    if (!geometryRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = geometryRef.current.attributes.position.array;
    const originalPositions = geometryRef.current.userData.originalPositions;

    // Create flowing wave effect with multiple sine waves
    for (let i = 0; i < positions.length; i += 3) {
      const x = originalPositions[i];
      const y = originalPositions[i + 1];

      // Slower, more gentle waves for HomePage
      const wave1 = Math.sin(x * 0.02 + time * 0.3) * 8;
      const wave2 = Math.sin(y * 0.02 + time * 0.25) * 8;
      const wave3 = Math.sin((x + y) * 0.015 + time * 0.35) * 5;

      positions[i + 2] = wave1 + wave2 + wave3;
    }

    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.computeVertexNormals();

    // Subtle rotation
    if (meshRef.current) {
      meshRef.current.rotation.z = time * 0.03;
    }
  });

  // Very subtle, dark colors that blend into the background
  const baseColor = '#0a0020';
  const emissiveColor = portalColors?.[0] || '#1a0040';

  return (
    <mesh ref={meshRef} position={[0, 0, -250]} rotation={[-Math.PI / 10, 0, 0]}>
      <primitive object={geometry} ref={geometryRef} attach="geometry" />
      <meshStandardMaterial
        color={baseColor}
        emissive={emissiveColor}
        emissiveIntensity={0.15}
        wireframe={false}
        side={THREE.DoubleSide}
        metalness={0.8}
        roughness={0.5}
        opacity={0.3}
        transparent={true}
      />
    </mesh>
  );
}
