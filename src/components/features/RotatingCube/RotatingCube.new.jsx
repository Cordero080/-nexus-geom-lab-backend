import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import FBXModel from '../Showcase/models/FBXModel';
import HolographicCube from './components/HolographicCube';
import TesseractGeometry from './components/TesseractGeometry';
import TripleTesseractGeometry from './components/TripleTesseractGeometry';
import CompoundTesseractGeometry from './components/CompoundTesseractGeometry';
import FloatingOrbs from './components/FloatingOrbs';
import HolographicPanels from './components/HolographicPanels';

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
  animationId = null 
}) {
  const cubeRef = useRef();
  const innerLightRef = useRef();
  
  // Refs for fourth tesseract animation (Nexus Prime)
  const fourthTesseractInnerRef = useRef();
  const fourthTesseractOuterRef = useRef();

  // 🎮 CUBE ROTATION & ANIMATIONS
  useFrame((state, delta) => {
    // Main cube rotation
    if (cubeRef.current) {
      cubeRef.current.rotation.y += delta * 0.5;
    }
    
    // Inner light pulsing
    if (innerLightRef.current) {
      innerLightRef.current.intensity = (size / 3) * 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
    
    // Animate fourth tesseract lines (Nexus Prime only)
    if (fourthTesseractInnerRef.current && fourthTesseractOuterRef.current) {
      const time = state.clock.elapsedTime;
      fourthTesseractInnerRef.current.opacity = 0.5 + Math.sin(time * 2) * 0.3;
      fourthTesseractOuterRef.current.opacity = 0.3 + Math.sin(time * 2 + Math.PI) * 0.2;
    }
  });
  
  const sphereRadius = size * 0.27;

  return (
    <group 
      ref={cubeRef} 
      position={[0, cubeY, 0]}
      scale={
        (animationId === 1 || animationId === 4) ? 0.85 : // Icarus
        animationId === 2 ? 0.87 :                          // Vectra
        animationId === 3 ? 0.80 :                          // Nexus Prime
        1.0
      }
    >
      {/* Holographic Cube Layers */}
      <HolographicCube size={size} />
      
      {/* Basic Tesseract - For Icarus and Nexus Prime */}
      {(animationId === 1 || animationId === 4 || animationId === 3) && (
        <TesseractGeometry size={size} />
      )}
      
      {/* Triple Tesseract - Only for Nexus Prime */}
      {animationId === 3 && (
        <TripleTesseractGeometry 
          size={size} 
          fourthTesseractInnerRef={fourthTesseractInnerRef}
          fourthTesseractOuterRef={fourthTesseractOuterRef}
        />
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
        <pointLight position={[4, 12, 4]} color="#10c22eff" intensity={1.5} distance={size} />
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
