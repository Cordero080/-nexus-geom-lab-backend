import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import FBXModel from '../../Showcase/models/FBXModel';
import HolographicCube from './components/HolographicCube';
import TesseractGeometry from './components/TesseractGeometry';
import NexusCube from '../characters/Nexus/NexusCube';
import CompoundTesseractGeometry from '../characters/Vectra/CompoundTesseractGeometry';
import FloatingOrbs from './components/FloatingOrbs';
import HolographicPanels from './components/HolographicPanels';
import GlitchBurst from '../characters/Icarus/GlitchBurst';
import RadialSquares from '../characters/Vectra/RadialSquares';
import QuantumShockwave from '../characters/Nexus/QuantumShockwave';

export default function RotatingCube({ 
  size = 3, 
  fbxUrl = null, 
  scale = 0.001275, 
  rotation = [0, 0, 0], 
  positionY = -1.8, 
  offsetX = 0, 
  offsetZ = 0, 
  cubeY = -0.5, 
  isPlaying = true, 
  onModelLoaded, 
  preloadedModel = null, 
  allowNaturalYMovement = false, 
  animationId = null,
  speed = 1.0 
}) {
  const cubeRef = useRef();
  const innerLightRef = useRef();
  
  // Refs for fourth tesseract animation (Nexus Prime)
  const fourthTesseractInnerRef = useRef();
  const fourthTesseractOuterRef = useRef();
  
  // Track animation time for glitch effects
  const [animationTime, setAnimationTime] = useState(0);
  
  // Mouse drag state for trackball-style rotation
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const rotationSpeed = useRef({ x: 0, y: 0 });
  const { size: viewportSize } = useThree((state) => state.viewport);
  
  // Define punch times for Icarus animations (in seconds)
  // Adjust these values to match the actual punch moments in the animations
  const icarusPunchTimes = animationId === 1 
    ? [1.1, 2.9, 3.4] // Solar Ascension punch moments
    : animationId === 4 
    ? [0.8, 1.2, 2.2] // Phoenix Dive punch moments (Qi Flow)
    : [];
  
  // Define punch times for Nexus Prime (Warrior Flip animation)
  // TODO: Watch animation and adjust these timing values
  const nexusPunchTimes = animationId === 3 
    ? [1.5, 2.4, 2.8] // ONE explosion only - at the last punch
    : [];
  
  const handleAnimationTimeUpdate = (time) => {
    setAnimationTime(time);
  };

  // 🎮 CUBE ROTATION & ANIMATIONS
  useFrame((state, delta) => {
    if (cubeRef.current) {
      // Apply trackball rotation when dragging
      if (isDragging.current && (rotationSpeed.current.x !== 0 || rotationSpeed.current.y !== 0)) {
        // Create rotation quaternions for each axis - NEGATE Y for correct up/down
        const rotX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -rotationSpeed.current.y);
        const rotY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationSpeed.current.x);
        
        // Combine rotations
        const rotation = new THREE.Quaternion().multiplyQuaternions(rotY, rotX);
        cubeRef.current.quaternion.premultiply(rotation);
        
        // Damping
        rotationSpeed.current.x *= 0.95;
        rotationSpeed.current.y *= 0.95;
      } else if (!isDragging.current) {
        // Gentle auto-rotate on y-axis only when not dragging
        const autoRotY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), delta * 0.5 * speed);
        cubeRef.current.quaternion.premultiply(autoRotY);
      }
    }
    
    // Inner light pulsing - apply speed multiplier
    if (innerLightRef.current) {
      innerLightRef.current.intensity = (size / 3) * 1.5 + Math.sin(state.clock.elapsedTime * 2 * speed) * 0.5;
    }
    
    // Animate fourth tesseract lines (Nexus Prime only) - apply speed multiplier
    if (fourthTesseractInnerRef.current && fourthTesseractOuterRef.current) {
      const time = state.clock.elapsedTime * speed;
      fourthTesseractInnerRef.current.opacity = 0.5 + Math.sin(time * 2) * 0.3;
      fourthTesseractOuterRef.current.opacity = 0.3 + Math.sin(time * 2 + Math.PI) * 0.2;
    }
  });
  
  const sphereRadius = size * 0.27;

  const handlePointerDown = (e) => {
    e.stopPropagation();
    isDragging.current = true;
    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    
    const deltaX = e.clientX - previousMouse.current.x;
    const deltaY = e.clientY - previousMouse.current.y;
    
    // Trackball-style rotation - deltaY is applied directly (negation happens in useFrame)
    rotationSpeed.current.x = deltaX * 0.01;
    rotationSpeed.current.y = deltaY * 0.01;
    
    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  React.useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <group 
      ref={cubeRef} 
      onPointerDown={handlePointerDown}
      // 🎚️ CUBE POSITION CONTROL - Adjust Y position for each character's cube
      position={[
        0, 
        animationId === 3 ? 0.2 : 0.2,  // Raised higher for better centering
        0
      ]}
      // 🎚️ CUBE SCALE CONTROL - Adjust these values to resize each character's cube
      scale={
        (animationId === 1 || animationId === 4) ? 0.85 : // Icarus
        animationId === 2 ? 0.87 :                          // Vectra
        animationId === 3 ? 0.86 :                           // Nexus Prime - CONTROL SCALE HERE
        1.0
      }
    >
      {/* Holographic Cube Layers */}
      <HolographicCube size={size} />
      
      {/* Basic Tesseract - For Icarus only */}
      {(animationId === 1 || animationId === 4) && (
        <TesseractGeometry size={size} />
      )}
      
      {/* NexusCube - Compound Tesseract for Nexus Prime */}
      {animationId === 3 && (
        <NexusCube size={size} />
      )}
      
      {/* Compound Tesseract - Only for Vectra */}
      {animationId === 2 && (
        <CompoundTesseractGeometry size={size} />
      )}
      
      {/* Holographic Panels */}
      <HolographicPanels size={size} />
      
      {/* Floating Orbs */}
      <FloatingOrbs size={size} />
      
      {/* Interior point light - removed pink for Nexus Prime only */}
      {animationId !== 3 && (
        <pointLight
          ref={innerLightRef}
          position={[0, 0, 0]}
          color="#ff00ff"
          intensity={1.5}
          distance={size}
        />
      )}
      
      {/* Green reflective lighting for Nexus Prime only */}
      {animationId === 3 && (
        <pointLight position={[4, 12, 4]} color="#10c22e" intensity={1.5} distance={size} />
      )}
      
      {/* Glitch Burst effects for ALL Icarus punches */}
      {(animationId === 1 || animationId === 4) && icarusPunchTimes.length > 0 && (
        <GlitchBurst 
          triggerTimes={icarusPunchTimes} 
          animationTime={animationTime} 
        />
      )}
      
      {/* Radial expanding tesseract for Vectra - triggers at 2 seconds */}
      {animationId === 2 && (
        <RadialSquares 
          animationTime={animationTime}
          cubeSize={size}
        />
      )}
      
      {/* Quantum Shockwave effect for Nexus Prime punches */}
      {animationId === 3 && nexusPunchTimes.length > 0 && (
        <QuantumShockwave 
          triggerTimes={nexusPunchTimes} 
          animationTime={animationTime} 
        />
      )}
      
      {/* FBX Model or placeholder sphere */}
      {fbxUrl ? (
        <FBXModel 
          url={fbxUrl} 
          scale={scale} 
          rotation={rotation} 
          positionY={positionY} 
          offsetX={offsetX} 
          offsetZ={offsetZ} 
          isPlaying={isPlaying} 
          onModelLoaded={onModelLoaded} 
          preloadedModel={preloadedModel} 
          allowNaturalYMovement={allowNaturalYMovement}
          onAnimationTimeUpdate={handleAnimationTimeUpdate}
          speed={speed}
        />
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
