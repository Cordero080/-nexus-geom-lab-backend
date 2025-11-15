import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AnimatedBackground() {
  const meshRef = useRef();
  const geometryRef = useRef();

  // Create the plane geometry with many vertices for the wave effect
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(400, 400, 40, 40);

    // Store original positions
    const positions = geo.attributes.position.array;
    geo.userData.originalPositions = new Float32Array(positions);

    return geo;
  }, []);

  // Animate the vertices
  useFrame((state) => {
    if (!geometryRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = geometryRef.current.attributes.position.array;
    const originalPositions = geometryRef.current.userData.originalPositions;

    // Create wave effect - much smaller, more frequent waves
    for (let i = 0; i < positions.length; i += 3) {
      const x = originalPositions[i];
      const y = originalPositions[i + 1];

      // Multiple sine waves for trippy effect - optimized
      const wave1 = Math.sin(x * 0.03 + time * 0.5) * 5;
      const wave2 = Math.sin(y * 0.03 + time * 0.3) * 5;
      const wave3 = Math.sin((x + y) * 0.02 + time * 0.4) * 3;

      positions[i + 2] = wave1 + wave2 + wave3;
    }

    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.computeVertexNormals();

    // Slowly rotate the whole mesh
    if (meshRef.current) {
      meshRef.current.rotation.z = time * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -100]} rotation={[-Math.PI / 6, 0, 0]}>
      <primitive object={geometry} ref={geometryRef} attach="geometry" />
      <meshStandardMaterial
        color="#4a1a5a"
        emissive="#1a0033"
        emissiveIntensity={0.3}
        wireframe={false}
        side={THREE.DoubleSide}
        metalness={0.5}
        roughness={0.5}
      />
    </mesh>
  );
}
