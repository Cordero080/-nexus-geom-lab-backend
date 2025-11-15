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

  // 🎚️ INDIVIDUAL BURST CONFIGURATION
  // Configure each burst separately: [burst1, burst2, burst3]
  const burstConfigs = [
    {
      particleCount: 333, // Number of particles
      particleSize: 0.15, // Base particle size
      sizeVariation: 0.2, // Random size variation
      radiusBase: 3.2, // Base explosion radius
      radiusVariation: 3.6, // Random radius variation
      speed: 15, // Particle speed multiplier
      verticalSpread: 8, // Vertical spread amount
      duration: 0.6, // How long the burst lasts (seconds)
    },
    {
      particleCount: 500, // Most particles for final burst
      particleSize: 0.7, // Larger particles
      sizeVariation: 0.25,
      radiusBase: 9.0, // Widest spread
      radiusVariation: 5.5,
      speed: 20, // Fastest
      verticalSpread: 40,
      duration: 30,
    },
    {
      particleCount: 700, // Most particles for final burst
      particleSize: 0.2, // Larger particles
      sizeVariation: 0.15,
      radiusBase: 20.0, // Widest spread
      radiusVariation: 7.5,
      speed: 3, // Fastest
      verticalSpread: 70,
      duration: 3.7,
    },
  ];

  // Get max particle count for buffer allocation
  const maxParticleCount = Math.max(...burstConfigs.map((c) => c.particleCount));

  // Create gradient particles (magenta to green)
  const particles = useMemo(() => {
    const positions = new Float32Array(maxParticleCount * 3);
    const colors = new Float32Array(maxParticleCount * 3);

    for (let i = 0; i < maxParticleCount; i++) {
      // Start at center
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      // Gradient from magenta to green based on particle index
      const gradient = i / maxParticleCount;
      const magenta = new THREE.Color('#ff00ff');
      const green = new THREE.Color('#00ff00');
      const color = magenta.clone().lerp(green, gradient);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [maxParticleCount]);

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

      console.log(
        `Quantum shockwave ${triggeredIndex + 1} triggered at ${animationTime.toFixed(2)}s`
      );

      // Get config for this burst
      const config = burstConfigs[triggeredIndex] || burstConfigs[0];
      const particleCount = config.particleCount;

      // Reset particles to center with slight spread
      for (let i = 0; i < maxParticleCount; i++) {
        if (i < particleCount) {
          // Active particles for this burst
          positions[i * 3] = (Math.random() - 0.5) * 0.3;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
        } else {
          // Hide extra particles
          positions[i * 3] = 0;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = 0;
        }
      }
    }

    // Update shockwave effect
    if (activeShockwaveRef.current) {
      shockwaveTimeRef.current += delta;

      // Get config for current burst
      const config = burstConfigs[lastTriggeredIndexRef.current] || burstConfigs[0];
      const particleCount = config.particleCount;
      const progress = shockwaveTimeRef.current / config.duration;

      if (progress > 1) {
        activeShockwaveRef.current = false;
        // Hide particles
        for (let i = 0; i < maxParticleCount; i++) {
          positions[i * 3] = 0;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = 0;
        }
      } else {
        // Animate particles outward with quantum wave effect
        for (let i = 0; i < particleCount; i++) {
          // Calculate velocity based on current burst config
          const angle = (i / particleCount) * Math.PI * 2;
          const radiusVariation = config.radiusBase + Math.random() * config.radiusVariation;

          const velocity = {
            x: Math.cos(angle) * config.speed * radiusVariation,
            y: (Math.random() - 0.5) * config.verticalSpread,
            z: Math.sin(angle) * config.speed * radiusVariation,
          };

          // Wave distortion
          const wave = Math.sin(progress * 10 - (i / particleCount) * Math.PI * 3) * 0.25;

          // Quantum flutter effect
          const flutter = Math.sin(shockwaveTimeRef.current * 10 + i) * 0.1;

          positions[i * 3] += velocity.x * delta * (1.5 + wave) + flutter;
          positions[i * 3 + 1] += velocity.y * delta + flutter * 0.5;
          positions[i * 3 + 2] += velocity.z * delta * (1.5 + wave) + flutter;
        }
      }

      particlesRef.current.attributes.position.needsUpdate = true;

      // Update rings with individual speed control
      // Only show rings for the LAST trigger (index 2 = third burst at 2.8s)
      const isLastBurst = lastTriggeredIndexRef.current === triggerTimes.length - 1;

      ringsRef.current.forEach((ring, index) => {
        if (ring) {
          if (!isLastBurst) {
            // Hide rings for first two bursts
            ring.scale.set(0, 0, 0);
            ring.material.opacity = 0;
          } else {
            // Show rings only for last burst
            // 🎚️ RING DURATION CONTROL - Make second ring expand faster
            // No delay - both start together
            const staggerDelay = 0;
            const ringProgress = Math.max(0, progress - staggerDelay);

            // 🎚️ RING SPEED CONTROL - Adjust expansion speed
            // Higher value = faster expansion
            const speedMultiplier = index === 1 ? 1.5 : 1.0; // Second ring expands 50% faster
            const adjustedProgress = ringProgress * speedMultiplier;

            // Glitch effect - random interruptions as it fades
            const glitchChance = adjustedProgress > 0.5 ? Math.random() : 0; // More glitches near the end
            const glitchIntensity = glitchChance > 0.7 ? Math.random() * 0.5 : 0; // 30% chance to glitch

            const scale = (1 + adjustedProgress * 80) * (1 - glitchIntensity * 0.3); // MUCH wider expansion with glitch jitter

            // Make first shockwave (triggeredIndex 0) more opaque
            const isFirstShockwave = lastTriggeredIndexRef.current === 0;
            const baseOpacity = isFirstShockwave ? 0.6 : 0.3; // First is more opaque

            // Glitchy fade - flicker opacity
            const glitchFlicker = glitchChance > 0.8 ? 0 : 1; // Occasional blinks
            const opacity = Math.max(0, (1 - adjustedProgress) * glitchFlicker); // Fade as it expands with glitch blinks

            ring.scale.set(scale, scale, scale);
            ring.material.opacity = opacity * baseOpacity;
          }
        }
      });
    }
  });

  return (
    <group>
      {/* Shockwave Rings - Only 2 rings now (0=first, 1=second) */}
      {[0, 1].map((index) => {
        // Create spectral/rainbow colors for each ring
        const hue = (index * 0.15 + shockwaveTimeRef.current * 0.5) % 1; // Shift hue over time
        const spectralColor = new THREE.Color().setHSL(hue, 1.0, 0.4); // Lower lightness = darker, more saturated

        return (
          <mesh
            key={index}
            ref={(el) => (ringsRef.current[index] = el)}
            //axis of shockwave
            rotation={[Math.PI / 1.5, 4, 0]}
          >
            {/* Make first shockwave thinner - check if it's the first trigger */}
            <torusGeometry args={[2, 0.015, 8, 32]} />
            {/* 🎨 RING COLOR CONTROL - Spectral rainbow effect */}
            <meshBasicMaterial
              color={spectralColor}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {/* Gradient Energy Particles (Magenta to Green) */}
      <points>
        <bufferGeometry ref={particlesRef}>
          <bufferAttribute
            attach="attributes-position"
            count={maxParticleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={maxParticleCount}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={
            activeShockwaveRef.current
              ? burstConfigs[lastTriggeredIndexRef.current]?.particleSize || 0.15
              : 0.15
          }
          transparent
          opacity={activeShockwaveRef.current ? 0.5 : 0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
}
