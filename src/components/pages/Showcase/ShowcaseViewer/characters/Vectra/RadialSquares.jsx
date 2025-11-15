import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * RadialSquares - Magical radial effect for Vectra
 * Creates nested expanding compound tesseract duplicates that emanate from center
 */
export default function RadialSquares({ animationTime = 0, cubeSize = 3 }) {
  const compoundFramesRef = useRef([]);
  const burstTimeRef = useRef(0);
  const activeBurstRef = useRef(false);
  const previousAnimationTimeRef = useRef(0);

  // Create multiple compound tesseract copies that will expand
  const compoundCount = 6; // Number of expanding compound tesseracts

  // Define the 5 layers of the compound tesseract with their asymmetric scales
  const tesseractLayers = [
    { scale: [0.4, 0.4, 1.4], color: '#d643f3', opacity: 0.9 },
    { scale: [0.6, 1.4, 0.6], color: '#75fad9', opacity: 0.8 },
    { scale: [1.4, 0.8, 0.8], color: '#b3f343', opacity: 0.7 },
    { scale: [1.0, 1.0, 1.0], color: '#e6ebea', opacity: 0.6 },
    { scale: [1.2, 1.2, 1.2], color: '#d643f3', opacity: 0.5 },
  ];

  useFrame((state, delta) => {
    // Detect animation loop restart (time went backwards)
    if (animationTime < previousAnimationTimeRef.current) {
      activeBurstRef.current = false;
      burstTimeRef.current = 0;
    }
    previousAnimationTimeRef.current = animationTime;

    // Check if we should trigger - 2000ms (2 seconds) after animation starts
    const triggerTime = 1.2;

    if (
      !activeBurstRef.current &&
      animationTime >= triggerTime &&
      animationTime < triggerTime + 0.1
    ) {
      activeBurstRef.current = true;
      burstTimeRef.current = 0;
      console.log(`✨ Compound tesseract burst triggered at ${animationTime.toFixed(2)}s`);
    }

    // Update burst effect
    if (activeBurstRef.current) {
      burstTimeRef.current += delta;

      const burstDuration = 2;
      const burstProgress = burstTimeRef.current / burstDuration;

      if (burstProgress > 1) {
        activeBurstRef.current = false;
        // Hide all compound frames
        compoundFramesRef.current.forEach((compound) => {
          if (compound) {
            compound.scale.setScalar(0);
          }
        });
      } else {
        // Animate compound tesseracts expanding outward
        compoundFramesRef.current.forEach((compound, i) => {
          if (!compound) return;

          const delay = i * 0.001;
          const adjustedProgress = Math.max(0, burstProgress - delay);

          if (adjustedProgress <= 0) {
            compound.scale.setScalar(0);
            return;
          }

          // Ease out for smooth expansion
          const easeProgress = 1 - Math.pow(1 - adjustedProgress, 1);

          // Scale from tiny to large
          const baseScale = 0.3 + easeProgress * (2.0 + i * 0.4);
          compound.scale.setScalar(baseScale);

          // Simple fade
          const fadeStart = 0.6;
          let opacity = 0.9;
          if (adjustedProgress > fadeStart) {
            opacity = 0.9 * (1 - (adjustedProgress - fadeStart) / (1 - fadeStart));
          }

          // Update opacity for all layer children
          compound.children.forEach((layer) => {
            if (layer.material) {
              layer.material.opacity = opacity * layer.material.userData.baseOpacity;
            }
          });
        });
      }
    } else {
      // Hide frames when not active
      compoundFramesRef.current.forEach((compound) => {
        if (compound) {
          compound.scale.setScalar(0);
        }
      });
    }
  });

  return (
    <group>
      {[...Array(compoundCount)].map((_, compoundIndex) => (
        <group
          key={compoundIndex}
          ref={(el) => (compoundFramesRef.current[compoundIndex] = el)}
          position={[0, 0, 0]}
        >
          {/* Render all 5 layers of the compound tesseract */}
          {tesseractLayers.map((layer, layerIndex) => {
            // Create a unique material for each layer to control opacity independently
            const material = new THREE.LineBasicMaterial({
              color: layer.color,
              linewidth: 2,
              opacity: 0,
              transparent: true,
            });
            material.userData = { baseOpacity: layer.opacity };

            return (
              <lineSegments
                key={layerIndex}
                position={[0, 0, 0]}
                scale={layer.scale}
                material={material}
              >
                <edgesGeometry args={[new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)]} />
              </lineSegments>
            );
          })}
        </group>
      ))}
    </group>
  );
}
