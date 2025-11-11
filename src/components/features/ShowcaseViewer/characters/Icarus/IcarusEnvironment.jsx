import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * IcarusEnvironment - Code Breaker Theme
 * Creates a layered 3D environment with depth for Icarus-X character background
 * Features:
 * - Floating geometric particles (cubes, octahedrons, tetrahedrons)
 * - Layered depth with 3 distance planes
 * - Pulsing grid floor
 * - Animated wireframe structures
 * - Cyan/orange/blue color scheme
 */
export default function IcarusEnvironment() {
  const particlesRef = useRef();
  const gridRef = useRef();
  const ringRefs = useRef([]);

  // Create floating particles at different depths
  const particles = useMemo(() => {
    const temp = [];
    const geometries = [
      new THREE.BoxGeometry(0.3, 0.1, 0.3),
      new THREE.OctahedronGeometry(0.2),
      new THREE.TetrahedronGeometry(0.25),
    ];

    for (let i = 0; i < 150; i++) {
      const geometry = geometries[i % geometries.length];
      
      // Distribute particles in 3 depth layers
      const layer = i % 3;
      let z;
      if (layer === 0) z = -15 - Math.random() * 10; // Far back
      else if (layer === 1) z = -8 - Math.random() * 5; // Middle
      else z = -3 - Math.random() * 2; // Close to camera

      const particle = {
        geometry,
        position: [
          (Math.random() - 0.5) * 30, // X spread
          (Math.random() - 0.5) * 20, // Y spread
          z
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ],
        rotationSpeed: [
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ],
        driftSpeed: [
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.005
        ],
        scale: 0.5 + Math.random() * 1.2,
        color: layer === 0 ? '#12f3e4ff' : layer === 1 ? '#ff8c00' : '#88c5e9',
        initialPos: null,
      };
      
      particle.initialPos = [...particle.position];
      temp.push(particle);
    }
    return temp;
  }, []);

  // Animate particles
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate and drift particles
    particles.forEach((particle, i) => {
      const mesh = particlesRef.current?.children[i];
      if (!mesh) return;

      // Rotation
      mesh.rotation.x += particle.rotationSpeed[0];
      mesh.rotation.y += particle.rotationSpeed[1];
      mesh.rotation.z += particle.rotationSpeed[2];

      // Floating drift
      mesh.position.x = particle.initialPos[0] + Math.sin(time * 0.5 + i) * 2;
      mesh.position.y = particle.initialPos[1] + Math.cos(time * 0.3 + i) * 1.5;
      mesh.position.z = particle.initialPos[2] + Math.sin(time * 0.2 + i) * 0.5;

      // Pulse opacity based on depth
      const opacity = 0.3 + Math.sin(time + i * 0.1) * 0.2;
      mesh.material.opacity = opacity;
    });

    // Pulse grid
    if (gridRef.current) {
      gridRef.current.material.opacity = 0.15 + Math.sin(time * 2) * 0.001;
    }
  });

  return (
    <group>
      {/* Ambient particles */}
      <group ref={particlesRef}>
        {particles.map((particle, i) => (
          <mesh
            key={i}
            position={particle.position}
            rotation={particle.rotation}
            scale={particle.scale}
          >
            <primitive object={particle.geometry} />
            <meshBasicMaterial
              color={particle.color}
              wireframe={Math.random() > 0.5}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Grid floor - creates depth perception */}
      <mesh
        ref={gridRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -5, -8]}
      >
        <planeGeometry args={[50, 50, 25, 25]} />
        <meshBasicMaterial
          color="#4ecdc4"
          wireframe
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Large background wireframe sphere - creates boundary */}
      <mesh position={[0, 0, -25]}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial
          color="#4ecdc4"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Glowing point lights matching Icarus colors */}
      <pointLight position={[-10, 5, -5]} intensity={1.5} color="#4ecdc4" distance={20} />
      <pointLight position={[10, -3, -8]} intensity={1.2} color="#ff8c00" distance={15} />
      <pointLight position={[0, 8, -12]} intensity={1} color="#88c5e9" distance={18} />

      {/* Ambient fog for depth */}
      <fog attach="fog" args={['#0a0a0a', 10, 40]} />
    </group>
  );
}
