import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * IcarusEnvironment - Code Breaker Theme (Simplified)
 * Clean, minimal background with only floating geometric particles
 */
export default function IcarusEnvironment() {
  const particlesRef = useRef();

  // Create floating particles at different depths
  const particles = useMemo(() => {
    const temp = [];
    const geometries = [
      new THREE.BoxGeometry(0.3, 0.1, 0.3),
      new THREE.OctahedronGeometry(0.2),
      new THREE.TetrahedronGeometry(0.25),
    ];

    for (let i = 0; i < 100; i++) {
      const geometry = geometries[i % geometries.length];

      // Distribute particles in 3 depth layers
      const layer = i % 3;
      let z;
      if (layer === 0)
        z = -15 - Math.random() * 10; // Far back
      else if (layer === 1)
        z = -8 - Math.random() * 5; // Middle
      else z = -3 - Math.random() * 2; // Close to camera

      const particle = {
        geometry,
        position: [
          (Math.random() - 0.5) * 30, // X spread
          (Math.random() - 0.5) * 20, // Y spread
          z,
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        rotationSpeed: [
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
        ],
        driftSpeed: [
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.005,
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
    </group>
  );
}
