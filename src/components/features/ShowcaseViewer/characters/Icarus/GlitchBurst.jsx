import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * GlitchBurst - Visual glitch effect that triggers at specific times
 * Creates fragmented, glitchy particles that burst outward in radial pattern
 */
export default function GlitchBurst({ triggerTimes = [], animationTime = 0 }) {
  const particlesRef = useRef();
  const glitchTimeRef = useRef(0);
  const activeGlitchRef = useRef(false);
  const lastTriggeredIndexRef = useRef(-1);
  const previousAnimationTimeRef = useRef(0);

  // Create glitch particles
  const particleCount = 120;
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const colors = new Float32Array(particleCount * 3);
    const angles = []; // Store angles for radial pattern
    const rotationSpeeds = []; // Store rotation speeds for each particle
    const sizes = []; // Store sizes for variation
    
    for (let i = 0; i < particleCount; i++) {
      // Start at center
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      // Radial pattern: evenly distributed angles around circle
      const angle = (i / particleCount) * Math.PI * 2.5;
      const radiusVariation = 1.8 + Math.random() * 0.4; // Some variance in distance
      
      angles.push(angle);
      
      // Random rotation speeds for each particle
      rotationSpeeds.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 20
      });
      
      // Varying sizes - some larger, some smaller
      sizes.push(0.08 + Math.random() * 0.15);
      
      // Velocities point outward in radial pattern
      velocities.push({
        x: Math.cos(angle) * 30 * radiusVariation,
        y: (Math.random() - 0.5) * 4, // Some vertical variation
        z: Math.sin(angle) * 10 * radiusVariation
      });
      
      // Glitch colors: cyan, magenta, yellow (RGB channel separation effect)
      const colorChoice = Math.random();
      if (colorChoice < 0.55) {
        colors[i * 3] = 0;     // Cyan
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 1;     // Magenta
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 1;
      } else {
        colors[i * 3] = 1;     // Yellow
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 0;
      }
    }
    
    return { positions, velocities, colors, angles, rotationSpeeds, sizes };
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.attributes.position.array;
    
    // Detect animation loop restart (time went backwards)
    if (animationTime < previousAnimationTimeRef.current) {
      // Animation looped - reset trigger index to start from beginning
      lastTriggeredIndexRef.current = -1;
    }
    previousAnimationTimeRef.current = animationTime;
    
    // Check if we should trigger a new glitch burst IN ORDER
    let shouldTrigger = false;
    let triggeredIndex = -1;
    
    // Only check the next trigger in sequence
    const nextIndex = lastTriggeredIndexRef.current + 1;
    if (nextIndex < triggerTimes.length) {
      const time = triggerTimes[nextIndex];
      const timeDiff = animationTime - time;
      
      // Trigger when we pass the time (within 0.2s window)
      // Removed activeGlitchRef check so we can queue next trigger
      if (timeDiff >= 0 && timeDiff < 0.2) {
        shouldTrigger = true;
        triggeredIndex = nextIndex;
      }
    }
    
    if (shouldTrigger) {
      activeGlitchRef.current = true;
      glitchTimeRef.current = 0;
      lastTriggeredIndexRef.current = triggeredIndex;
      
      // Debug: log when glitch triggers
      console.log(`Glitch burst ${triggeredIndex + 1} triggered at ${animationTime.toFixed(2)}s`);
      
      // Reset particles to center
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 5.5) * 0.5;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      }
    }
    
    // Update glitch effect
    if (activeGlitchRef.current) {
      glitchTimeRef.current += delta;
      
      // Check if this is the 3rd burst (index 2)
      const isThirdBurst = lastTriggeredIndexRef.current === 2;
      
      // Duration: 3rd burst lasts longer (0.8s) for slow motion effect
      const burstDuration = isThirdBurst ? 0.8 : 0.4;
      const glitchProgress = glitchTimeRef.current / burstDuration;
      
      if (glitchProgress > 1) {
        activeGlitchRef.current = false;
        // Hide particles
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] = 0;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = 0;
        }
      } else {
        // Slow motion effect for 3rd burst: reduce speed in middle section
        let speedMultiplier = 1.0;
        if (isThirdBurst) {
          // Very slow motion in the last 30% of the burst (0.7 to 1.0)
          if (glitchProgress > 0.7) {
            // Ultra slow: 10% speed in final moments
            speedMultiplier = 0.1;
          } else if (glitchProgress > 0.2 && glitchProgress < 0.7) {
            // Slow down to 80% speed in middle
            speedMultiplier = 0.8;
          } else {
            // Normal speed at start
            speedMultiplier = 1.0;
          }
        }
        
        // Animate particles outward in radial pattern with glitch effect
        for (let i = 0; i < particleCount; i++) {
          const velocity = particles.velocities[i];
          const angle = particles.angles[i];
          const rotSpeed = particles.rotationSpeeds[i];
          
          // Add radial wave distortion
          const wave = Math.sin(glitchProgress * 8 - (i / particleCount) * Math.PI * 2) * 0.2;
          
          // Add rotation to particles (simulate spinning fragments)
          const rotationX = Math.cos(glitchTimeRef.current * rotSpeed.x + i) * 0.2;
          const rotationY = Math.sin(glitchTimeRef.current * rotSpeed.y + i) * 0.2;
          const rotationZ = Math.cos(glitchTimeRef.current * rotSpeed.z + i) * 0.15;
          
          // Add glitch jitter perpendicular to radial direction
          const jitterX = Math.sin(glitchTimeRef.current * 40 + i) * 0.15;
          const jitterY = Math.sin(glitchTimeRef.current * 50 + i * 2) * 0.3;
          const jitterZ = Math.cos(glitchTimeRef.current * 40 + i) * 0.15;
          
          // Combine movement with rotation
          positions[i * 3] += ((velocity.x * delta * (2 + wave)) + jitterX + rotationX) * speedMultiplier;
          positions[i * 3 + 1] += ((velocity.y * delta) + jitterY + rotationY) * speedMultiplier;
          positions[i * 3 + 2] += ((velocity.z * delta * (1 + wave)) + jitterZ + rotationZ) * speedMultiplier;
        }
      }
      
      particlesRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points>
      <bufferGeometry ref={particlesRef}>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
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
        size={0.15}
        vertexColors
        transparent
        opacity={activeGlitchRef.current ? 0.85 : 0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
}
