import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * QuantumShockwave - Nexus Prime's punch effect
 * Creates expanding geometric rings + green energy particles
 */
export default function QuantumShockwave({ triggerTimes = [], animationTime = 0 }) {
  const ringsRef = useRef([]);
  const particlesRef = useRef();
  const shockwaveTimeRef = useRef(0);
  const activeShockwaveRef = useRef(false);
  const lastTriggeredIndexRef = useRef(-1);
  const previousAnimationTimeRef = useRef(0);

  // Create green energy particles
  const particleCount = 333;
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const sizes = [];
    
    for (let i = 0; i < particleCount; i++) {
      // Start at center
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      // Radial outward velocities
      const angle = (i / particleCount) * Math.PI * 2;
      const radiusVariation = 3.2 + Math.random() * 3.6;
      
      velocities.push({
        x: Math.cos(angle) * 15 * radiusVariation,
        y: (Math.random() - 0.5) * 8, // More vertical spread
        z: Math.sin(angle) * 15 * radiusVariation
      });
      
      // Varying particle sizes
      sizes.push(0.1 + Math.random() * 0.2);
    }
    
    return { positions, velocities, sizes };
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.attributes.position.array;
    
    // Detect animation loop restart
    if (animationTime < previousAnimationTimeRef.current) {
      lastTriggeredIndexRef.current = -1;
    }
    previousAnimationTimeRef.current = animationTime;
    
    // Check for trigger
    let shouldTrigger = false;
    let triggeredIndex = -1;
    
    const nextIndex = lastTriggeredIndexRef.current + 1;
    if (nextIndex < triggerTimes.length) {
      const time = triggerTimes[nextIndex];
      const timeDiff = animationTime - time;
      
      if (timeDiff >= 0 && timeDiff < 0.2) {
        shouldTrigger = true;
        triggeredIndex = nextIndex;
      }
    }
    
    if (shouldTrigger) {
      activeShockwaveRef.current = true;
      shockwaveTimeRef.current = 0;
      lastTriggeredIndexRef.current = triggeredIndex;
      
      console.log(`Quantum shockwave ${triggeredIndex + 1} triggered at ${animationTime.toFixed(2)}s`);
      
      // Reset particles to center with slight spread
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 0.3;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      }
    }
    
    // Update shockwave effect
    if (activeShockwaveRef.current) {
      shockwaveTimeRef.current += delta;
      const progress = shockwaveTimeRef.current / 0.6; // 0.6s duration
      
      if (progress > 1) {
        activeShockwaveRef.current = false;
        // Hide particles
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] = 0;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = 0;
        }
      } else {
        // Animate particles outward with quantum wave effect
        for (let i = 0; i < particleCount; i++) {
          const velocity = particles.velocities[i];
          
          // Wave distortion
          const wave = Math.sin(progress * 10 - (i / particleCount) * Math.PI * 3) * 0.25;
          
          // Quantum flutter effect
          const flutter = Math.sin(shockwaveTimeRef.current * 10 + i) * 0.1;
          
          positions[i * 3] += (velocity.x * delta * (1.5 + wave)) + flutter;
          positions[i * 3 + 1] += (velocity.y * delta) + flutter * 0.5;
          positions[i * 3 + 2] += (velocity.z * delta * (1.5 + wave)) + flutter;
        }
      }
      
      particlesRef.current.attributes.position.needsUpdate = true;
      
      // Update rings with individual speed control
      ringsRef.current.forEach((ring, index) => {
        if (ring) {
          // 🎚️ RING DURATION CONTROL - Make second ring expand slower over longer time
          // Lower stagger delay for second ring = starts later but lasts longer
          const staggerDelay = index === 1 ? .10 : (index * 0.10); // Second ring delayed more
          const ringProgress = Math.max(0, progress - staggerDelay);
          
          // 🎚️ RING SPEED CONTROL - Adjust expansion speed
          // Lower value = slower expansion, keeps going longer
          const speedMultiplier = index === 1 ? 0.4 : 1.0; // Second ring expands 60% slower
          const adjustedProgress = ringProgress * speedMultiplier;
          
          const scale = 1 + adjustedProgress * 20; // Ring expansion size
          
          // Make first shockwave (triggeredIndex 0) more opaque
          const isFirstShockwave = lastTriggeredIndexRef.current === 0;
          const baseOpacity = isFirstShockwave ? 0.6 : 0.3; // First is more opaque
          const opacity = Math.max(0, 1 - adjustedProgress); // Fade as it expands
          
          ring.scale.set(scale, scale, scale);
          ring.material.opacity = opacity * baseOpacity;
        }
      });
    }
  });

  return (
    <group>
      {/* Shockwave Rings - Only 2 rings now (0=first, 1=second) */}
      {[0, 1].map((index) => (
        <mesh
          key={index}
          ref={(el) => (ringsRef.current[index] = el)}
          //axis of shockwave
          rotation={[Math.PI / 1.5, 4, 0]}
        >
          {/* Make first shockwave thinner - check if it's the first trigger */}
          <torusGeometry args={[2, 0.03, 8, 32]} />
          {/* 🎨 RING COLOR CONTROL - Change the hex color below */}
          <meshBasicMaterial
            color={new THREE.Color("#10c22e")} // ← CHANGE THIS COLOR (6-char hex only)
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      
      {/* Green Energy Particles */}
      <points>
        <bufferGeometry ref={particlesRef}>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={new Float32Array(particles.sizes)}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#10c22e"
          size={0.15}
          transparent
          opacity={activeShockwaveRef.current ? 0.9 : 0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
}
