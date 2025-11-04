import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import FBXModel from '../Showcase/models/FBXModel';

export default function RotatingCube({ size = 3, fbxUrl = null, scale = 0.001275, rotation = [0, 0, 0], positionY = -1.8, offsetX = 0, offsetZ = 0, cubeY = -0.5, isPlaying = true, onModelLoaded, preloadedModel = null, allowNaturalYMovement = false, animationId = null }) {
  const cubeRef = useRef();
  const innerLightRef = useRef();
  const edgeMaterialRef = useRef();
  const cubeMaterialRef = useRef();
  const orbRef = useRef();
  const orbLightRef = useRef();
  const orbMaterialRef = useRef();
  const orbGlowRef = useRef();
  
  // Second orb (half size)
  const orb2Ref = useRef();
  const orb2LightRef = useRef();
  const orb2MaterialRef = useRef();
  const orb2GlowRef = useRef();
  
  // Third orb (slightly smaller than second)
  const orb3Ref = useRef();
  const orb3LightRef = useRef();
  const orb3MaterialRef = useRef();
  const orb3GlowRef = useRef();
  
  // Holographic panel materials
  const frontPanelRef = useRef();
  const backPanelRef = useRef();
  
  // Refs for ripple wave geometry
  const frontPanelGeometryRef = useRef();
  const backPanelGeometryRef = useRef();

  // 🎮 CUBE ROTATION CONTROLS - OPTIONS FOR VARIETY:
  
  // OPTION 1: Simple Y-axis spin (current) - Clean turntable rotation
  useFrame((state, delta) => {
    if (cubeRef.current) {
      // cubeRef.current.rotation.x += delta * 0.2; // X-axis speed
      cubeRef.current.rotation.y += delta * 0.5; // Y-axis speed
      // cubeRef.current.rotation.z += delta * 0.5; // Z-axis speed
    }
  
  // OPTION 2: Oscillating rotation - Rocks back and forth instead of spinning
  // const time = state.clock.elapsedTime;
  // if (cubeRef.current) {
  //   cubeRef.current.rotation.x = Math.sin(time * 0.5) * 0.3; // Rock on X
  //   cubeRef.current.rotation.y += delta * 0.5; // Spin on Y
  //   cubeRef.current.rotation.z = Math.cos(time * 0.3) * 0.2; // Wave on Z
  // }
  
  // OPTION 3: Diagonal axis - Rotates around a tilted axis
  // if (cubeRef.current) {
  //   const angle = state.clock.elapsedTime * 0.5;
  //   cubeRef.current.rotation.set(
  //     Math.sin(angle) * 0.5,
  //     angle,
  //     Math.cos(angle) * 0.5
  //   );
  // }
  
  // OPTION 4: Speed up over time - Accelerates rotation
  // const speed = 0.1 + (state.clock.elapsedTime * 0.01) % 1;
  // if (cubeRef.current) {
  //   cubeRef.current.rotation.y += delta * speed;
  // }
  
  // OPTION 5: Random wobble - Chaotic movement
  // if (cubeRef.current) {
  //   cubeRef.current.rotation.x += delta * (0.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
  //   cubeRef.current.rotation.y += delta * (0.5 + Math.cos(state.clock.elapsedTime * 2) * 0.1);
  //   cubeRef.current.rotation.z += delta * (0.1 + Math.sin(state.clock.elapsedTime * 4) * 0.05);
  // }
    
    // 🌟 ORB 1 MOVEMENT CONTROLS
    // Floating orb animation - elevated 3D orbit with depth
    if (orbRef.current) {
      const time = state.clock.elapsedTime * 1; // Overall animation speed (higher = faster orbit)
      const baseRadius = size * 1; // Orbit radius (distance from center)
      
      // Circular orbit in XZ plane (horizontal)
      const angle = time;
      const radiusXZ = baseRadius;
      
      orbRef.current.position.x = Math.cos(angle) * radiusXZ;
      orbRef.current.position.z = Math.sin(angle) * radiusXZ;
      
      // Elevated Y position with gentle wave
      orbRef.current.position.y = size * 0.3 + Math.sin(time * 2.5) * size * 0.02; // Vertical float height & wave speed
      
      // Pulse the orb scale
      const pulse = 1 + Math.sin(time * 3) * 0.15; // Pulse speed & intensity (0.15 = 15% size change)
      orbRef.current.scale.set(pulse, pulse, pulse);
    }
    
    // Floating orb 2 animation - different orbit pattern
    if (orb2Ref.current) {
      const time = state.clock.elapsedTime * 1;
      const baseRadius = size * 1;
      
      const angle = time + Math.PI * 0.66; // Offset starting position
      
      orb2Ref.current.position.x = Math.cos(angle) * baseRadius;
      orb2Ref.current.position.z = Math.sin(angle) * baseRadius;
      orb2Ref.current.position.y = size * 0.1 + Math.sin(time * 1.8) * size * 0.1;
      
      const pulse = 1 + Math.sin(time * 3.5) * 0.15;
      orb2Ref.current.scale.set(pulse, pulse, pulse);
    }
    
    // Floating orb 3 animation - different orbit pattern
    if (orb3Ref.current) {
      const time = state.clock.elapsedTime * 0.5;
      const baseRadius = size * 0.18;
      
      const angle = time + Math.PI * 1.33; // Different offset
      
      orb3Ref.current.position.x = Math.cos(angle) * baseRadius;
      orb3Ref.current.position.z = Math.sin(angle) * baseRadius;
      orb3Ref.current.position.y = -size * 0.15 + Math.sin(time * 2.2) * size * 0.08;
      
      const pulse = 1 + Math.sin(time * 4) * 0.15;
      orb3Ref.current.scale.set(pulse, pulse, pulse);
    }
    
    // Animate orb 1 spectral colors - cycle through rainbow
    if (orbMaterialRef.current && orbGlowRef.current && orbLightRef.current) {
      const time = state.clock.elapsedTime;
      const hue = (time * .5) % 1; // Cycle through hue
      
      // Create rainbow spectrum colors
      const r = Math.abs(Math.sin(hue * Math.PI * 2));
      const g = Math.abs(Math.sin((hue + 2.33) * Math.PI * 4));
      const b = Math.abs(Math.sin((hue + 0.66) * Math.PI * 2));
      
      // Apply to orb materials
      orbMaterialRef.current.color.setRGB(r, g, b);
      orbMaterialRef.current.emissive.setRGB(r, g, b);
      orbGlowRef.current.color.setRGB(r * 0.8, g * 0.8, b * 0.8);
      
      // Sync light color with orb
      orbLightRef.current.color.setRGB(r, g, b);
      orbLightRef.current.intensity = 1.5 + Math.sin(time * 2.5) * 0.7;
    }
    
    // Animate orb 2 spectral colors - offset hue
    if (orb2MaterialRef.current && orb2GlowRef.current && orb2LightRef.current) {
      const time = state.clock.elapsedTime;
      const hue = ((time * 0.5) + 0.33) % 1; // Offset by 1/3
      
      const r = Math.abs(Math.sin(hue * Math.PI * 2));
      const g = Math.abs(Math.sin((hue + 0.33) * Math.PI * 2));
      const b = Math.abs(Math.sin((hue + 0.66) * Math.PI * 2));
      
      orb2MaterialRef.current.color.setRGB(r, g, b);
      orb2MaterialRef.current.emissive.setRGB(r, g, b);
      orb2GlowRef.current.color.setRGB(r * 0.8, g * 0.8, b * 0.8);
      orb2LightRef.current.color.setRGB(r, g, b);
      orb2LightRef.current.intensity = 1 + Math.sin(time * 2.8) * 0.5;
    }
    
    // Animate orb 3 spectral colors - different offset hue
    if (orb3MaterialRef.current && orb3GlowRef.current && orb3LightRef.current) {
      const time = state.clock.elapsedTime;
      const hue = ((time * 0.5) + 0.66) % 1; // Offset by 2/3
      
      const r = Math.abs(Math.sin(hue * Math.PI * 2));
      const g = Math.abs(Math.sin((hue + 0.33) * Math.PI * 2));
      const b = Math.abs(Math.sin((hue + 0.66) * Math.PI * 2));
      
      orb3MaterialRef.current.color.setRGB(r, g, b);
      orb3MaterialRef.current.emissive.setRGB(r, g, b);
      orb3GlowRef.current.color.setRGB(r * 0.8, g * 0.8, b * 0.8);
      orb3LightRef.current.color.setRGB(r, g, b);
      orb3LightRef.current.intensity = 0.9 + Math.sin(time * 3.2) * 0.4;
    }
    
    // 💡 INNER LIGHT CONTROLS
    // Pulse the inner light intensity
    if (innerLightRef.current) {
      innerLightRef.current.intensity = (size / 3) * 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5; // Base intensity + pulse variation
    }
    
    // 🌈 EDGE COLOR CONTROLS
    // Animate edge wireframe color - cycle through cyan, magenta, yellow
    if (edgeMaterialRef.current) {
      const time = state.clock.elapsedTime;
      const r = Math.sin(time * 0.5) * 0.5 + 0.5; // Red channel oscillation
      const g = Math.sin(time * 0.5 + 2) * 0.5 + 0.5; // Green channel (phase shifted)
      const b = Math.sin(time * 0.5 + 4) * 0.5 + 0.5; // Blue channel (phase shifted)
      edgeMaterialRef.current.color.setRGB(r, g, b);
    }
    
    // ✨ HOLOGRAPHIC SHIMMER CONTROLS
    // Cube material shimmer effect - rainbow iridescence
    if (cubeMaterialRef.current) {
      const time = state.clock.elapsedTime * 0.8; // Shimmer speed
      // Create rainbow effect that shifts continuously
      const hue = (time * 0.1) % 1; // Hue rotation speed
      const r = Math.abs(Math.sin((time + hue * 6.28) * 0.5)) * 0.5 + 0.3;
      const g = Math.abs(Math.sin((time + hue * 6.28 + 2) * 0.5)) * 0.5 + 0.3;
      const b = Math.abs(Math.sin((time + hue * 6.28 + 4) * 0.5)) * 0.5 + 0.5;
      cubeMaterialRef.current.color.setRGB(r, g, b);
      
      // Animate emissive intensity for shimmer
      cubeMaterialRef.current.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.15; // Base glow + pulse
    }
    
        
    // Animate holographic panels with ripple waves
    if (frontPanelRef.current && backPanelRef.current && frontPanelGeometryRef.current && backPanelGeometryRef.current) {
      const time = state.clock.elapsedTime;
      
      // Animate ripple waves on front panel
      const frontPositions = frontPanelGeometryRef.current.attributes.position;
      const segmentsX = 32; // Must match geometry segments
      const segmentsY = 32;
      
      for (let i = 0; i <= segmentsX; i++) {
        for (let j = 0; j <= segmentsY; j++) {
          const index = i * (segmentsY + 1) + j;
          
          // Get normalized position (-0.5 to 0.5)
          const x = (i / segmentsX - 0.5);
          const y = (j / segmentsY - 0.5);
          
          // Distance from center
          const dist = Math.sqrt(x * x + y * y) * 2;
          
          // Multiple ripple waves from center
          const wave1 = Math.sin(dist * 12 - time * 2) * 0.02;
          const wave2 = Math.sin(dist * 8 - time * 1.5 + Math.PI) * 0.015;
          const wave3 = Math.sin(dist * 15 - time * 2.5) * 0.01;
          
          const z = (wave1 + wave2 + wave3) * (1 - dist * 0.3); // Fade at edges
          
          frontPositions.setZ(index, z);
        }
      }
      frontPositions.needsUpdate = true;
      
      // Animate ripple waves on back panel (offset timing)
      const backPositions = backPanelGeometryRef.current.attributes.position;
      
      for (let i = 0; i <= segmentsX; i++) {
        for (let j = 0; j <= segmentsY; j++) {
          const index = i * (segmentsY + 1) + j;
          
          const x = (i / segmentsX - 0.5);
          const y = (j / segmentsY - 0.5);
          const dist = Math.sqrt(x * x + y * y) * 2;
          
          // Different ripple pattern for back panel
          const wave1 = Math.sin(dist * 10 - time * 1.8 + Math.PI * 0.5) * 0.02;
          const wave2 = Math.sin(dist * 14 - time * 2.2) * 0.012;
          const wave3 = Math.sin(dist * 6 - time * 1.3) * 0.018;
          
          const z = (wave1 + wave2 + wave3) * (1 - dist * 0.3);
          
          backPositions.setZ(index, z);
        }
      }
      backPositions.needsUpdate = true;
      
      // Color animation
      const frontHue = (time * 0.15) % 1;
      const frontR = Math.abs(Math.sin(frontHue * Math.PI * 2 + time * 0.5));
      const frontG = Math.abs(Math.sin((frontHue + 0.33) * Math.PI * 2 + time * 0.5));
      const frontB = Math.abs(Math.sin((frontHue + 0.66) * Math.PI * 2 + time * 0.5));
      
      frontPanelRef.current.color.setRGB(frontR * 0.7, frontG * 0.7, frontB * 0.7);
      frontPanelRef.current.emissive.setRGB(frontR, frontG, frontB);
      frontPanelRef.current.emissiveIntensity = 0.4 + Math.sin(time * 1.5) * 0.2;
      frontPanelRef.current.opacity = 0.25 + Math.sin(time * 1.2) * 0.08;
      
      const backHue = ((time * 0.15) + 0.5) % 1;
      const backR = Math.abs(Math.sin(backHue * Math.PI * 2 + time * 0.5));
      const backG = Math.abs(Math.sin((backHue + 0.33) * Math.PI * 2 + time * 0.5));
      const backB = Math.abs(Math.sin((backHue + 0.66) * Math.PI * 2 + time * 0.5));
      
      backPanelRef.current.color.setRGB(backR * 0.7, backG * 0.7, backB * 0.7);
      backPanelRef.current.emissive.setRGB(backR, backG, backB);
      backPanelRef.current.emissiveIntensity = 0.4 + Math.sin(time * 1.8) * 0.2;
      backPanelRef.current.opacity = 0.25 + Math.sin(time * 1.5) * 0.08;
    }
  });
  
  // Scale inner sphere based on cube size
  const sphereRadius = size * 0.27;

  return (
    // 📦 GROUP COMPONENT - Container that groups all 3D objects (cube, orbs, model, tesseract)
    // Everything inside rotates/scales together. Uses cubeRef for animation control.
    <group 
      ref={cubeRef} 
      position={[0, cubeY, 0]}                       //adjsust vertical position/scale
      scale={
        (animationId === 1 || animationId === 4) ? 0.85 : // 85% for Icarus
        animationId === 2 ? 0.87 :                          // 87% for Vectra (compound tesseract)
        animationId === 3 ? 0.80 :                          // 80% for Nexus Prime (triple tesseract)
        1.0                                                 // 100% for others
      }
    >
      {/* Multi-layered holographic cubes for depth shimmer */}
      {/* Outer holographic layer */}
      <mesh>
        <boxGeometry args={[size * 1.02, size * 1.02, size * 1.02]} />
        <meshPhysicalMaterial
          color="#ff00ff"
          transparent
          opacity={0.08}
          metalness={1.0}
          roughness={0.0}
          transmission={0.95}
          side={THREE.DoubleSide}
          iridescence={1.0}
          iridescenceIOR={2.5}
          iridescenceThicknessRange={[400, 1600]}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
        />
      </mesh>
      
      {/* Middle shimmering layer */}
      <mesh>
        <boxGeometry args={[size, size, size]} />
        <meshPhysicalMaterial
          ref={cubeMaterialRef}
          color="#00ffff"
          transparent
          opacity={0.15}
          metalness={0.95}
          roughness={0.02}
          transmission={0.8}
          thickness={0.5}
          side={THREE.DoubleSide}
          emissive="#00ffff"
          emissiveIntensity={0.3}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          iridescence={1.0}
          iridescenceIOR={1.8}
          iridescenceThicknessRange={[200, 1200]}
        />
      </mesh>
      
      {/* Inner holographic core */}
      <mesh>
        <boxGeometry args={[size * 0.98, size * 0.98, size * 0.98]} />
        <meshPhysicalMaterial
          color="#ffff00"
          transparent
          opacity={0.06}
          metalness={1.0}
          roughness={0.0}
          transmission={0.98}
          side={THREE.DoubleSide}
          iridescence={1.0}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 600]}
        />
      </mesh>
      
      {/* Cube edges (wireframe) */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial ref={edgeMaterialRef} color="#00ffff" linewidth={2} />
      </lineSegments>
      
      {/* 🔥 TESSERACT (4D Hypercube) - For Icarus and Nexus Prime */}
      {(animationId === 1 || animationId === 4 || animationId === 3) && (
        <>
          {/* Inner cube of tesseract */}
          <lineSegments position={[0, 0, 0]} scale={[0.6, 0.6, 0.6]}>
            <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
            <lineBasicMaterial color="#ff8800" linewidth={2} opacity={0.8} transparent />
          </lineSegments>
          
          {/* Outer cube of tesseract */}
          <lineSegments position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
            <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
            <lineBasicMaterial color="#ffaa00" linewidth={2} opacity={0.6} transparent />
          </lineSegments>
          
          {/* Connecting lines between inner and outer cubes (8 corners) */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={16}
                array={new Float32Array([
                  // Connect 8 corners from inner to outer cube
                  -size*0.3, -size*0.3, -size*0.3,  -size*0.6, -size*0.6, -size*0.6, // corner 1
                  size*0.3, -size*0.3, -size*0.3,   size*0.6, -size*0.6, -size*0.6,  // corner 2
                  -size*0.3, size*0.3, -size*0.3,   -size*0.6, size*0.6, -size*0.6,  // corner 3
                  size*0.3, size*0.3, -size*0.3,    size*0.6, size*0.6, -size*0.6,   // corner 4
                  -size*0.3, -size*0.3, size*0.3,   -size*0.6, -size*0.6, size*0.6,  // corner 5
                  size*0.3, -size*0.3, size*0.3,    size*0.6, -size*0.6, size*0.6,   // corner 6
                  -size*0.3, size*0.3, size*0.3,    -size*0.6, size*0.6, size*0.6,   // corner 7
                  size*0.3, size*0.3, size*0.3,     size*0.6, size*0.6, size*0.6     // corner 8
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#ffcc33" opacity={0.5} transparent linewidth={1} />
          </line>
        </>
      )}
      
      {/* 🔲 TRIPLE TESSERACT - Only for Nexus Prime (ID: 3) - Multi-axis Rotation */}
      {animationId === 3 && (
        <>
          {/* Second tesseract layer - same size, rotated 90° on X-axis (vertical) */}
          {/* Inner cube - rotated */}
          <lineSegments position={[0, 0, 0]} scale={[0.6, 0.6, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
            <lineBasicMaterial color="#00ff00" linewidth={2} opacity={0.8} transparent />
          </lineSegments>
          
          {/* Outer cube - rotated */}
          <lineSegments position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
            <lineBasicMaterial color="#00dd00" linewidth={2} opacity={0.6} transparent />
          </lineSegments>
          
          {/* Third tesseract layer - phase sweep at 30 degrees */}
          {/* Inner cube - angled stretch */}
          <lineSegments position={[0, 0, 0]} scale={[0.6, 0.7, 0.6]} rotation={[0, Math.PI / 6, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
            <lineBasicMaterial color="#44ff00" linewidth={2} opacity={0.8} transparent />
          </lineSegments>
          
          {/* Outer cube - angled stretch */}
          <lineSegments position={[0, 0, 0]} scale={[1.2, 1.3, 1.2]} rotation={[0, Math.PI / 6, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
            <lineBasicMaterial color="#66ff22" linewidth={2} opacity={0.6} transparent />
          </lineSegments>
          
          {/* Fourth tesseract layer - phase sweep symmetrically opposite at -30 degrees */}
          {/* Inner cube - opposite angled stretch */}
          <lineSegments position={[0, 0, 0]} scale={[0.6, 0.7, 0.6]} rotation={[0, -Math.PI / 6, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
            <lineBasicMaterial color="#88ff44" linewidth={2} opacity={0.7} transparent />
          </lineSegments>
          
          {/* Outer cube - opposite angled stretch */}
          <lineSegments position={[0, 0, 0]} scale={[1.2, 1.3, 1.2]} rotation={[0, -Math.PI / 6, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
            <lineBasicMaterial color="#1bd0d7ff" linewidth={2} opacity={0.5} transparent />
          </lineSegments>
        </>
      )}
      
      {/* 🌀 COMPOUND TESSERACT with PHASE SWEEP - Only for Vectra (ID: 2) */}
      {animationId === 2 && (
        <>
          {/* Innermost cube - Purple core */}
          <lineSegments position={[0, 0, 0]} scale={[0.4, 0.4, 1.4]}>
            <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
            <lineBasicMaterial color="#d643f3" linewidth={2} opacity={0.9} transparent />
          </lineSegments>
          
          {/* Second layer cube - Cyan */}
          <lineSegments position={[0, 0, 0]} scale={[0.6, 1.4, 0.6]}>
            <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
            <lineBasicMaterial color="#75fad9" linewidth={2} opacity={0.8} transparent />
          </lineSegments>
          
          {/* Third layer cube - Purple */}
          <lineSegments position={[0, 0, 0]} scale={[1.4, 0.8, 0.8]}>
            <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
            <lineBasicMaterial color="#d643f3" linewidth={2} opacity={0.7} transparent />
          </lineSegments>
          
          {/* Fourth layer cube - Cyan */}
          <lineSegments position={[0, 0, 0]} scale={[1.0, 1.0, 1.0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
            <lineBasicMaterial color="#e6ebeaff" linewidth={2} opacity={0.6} transparent />
          </lineSegments>
          
          {/* Outermost cube - Purple */}
          <lineSegments position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
            <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
            <lineBasicMaterial color="#d643f3" linewidth={2} opacity={1.5} transparent />
          </lineSegments>
          
          {/* Connecting lines from innermost to second layer (8 corners) */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={16}
                array={new Float32Array([
                  -size*0.2, -size*0.2, -size*0.2,  -size*0.3, -size*0.3, -size*0.3,
                  size*0.2, -size*0.2, -size*0.2,   size*0.3, -size*0.3, -size*0.3,
                  -size*0.2, size*0.2, -size*0.2,   -size*0.3, size*0.3, -size*0.3,
                  size*0.2, size*0.2, -size*0.2,    size*0.3, size*0.3, -size*0.3,
                  -size*0.2, -size*0.2, size*0.2,   -size*0.3, -size*0.3, size*0.3,
                  size*0.2, -size*0.2, size*0.2,    size*0.3, -size*0.3, size*0.3,
                  -size*0.2, size*0.2, size*0.2,    -size*0.3, size*0.3, size*0.3,
                  size*0.2, size*0.2, size*0.2,     size*0.3, size*0.3, size*0.3
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#b854e6" opacity={0.4} transparent linewidth={1} />
          </line>
          
          {/* Connecting lines from second to third layer */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={16}
                array={new Float32Array([
                  -size*0.3, -size*0.3, -size*0.3,  -size*0.4, -size*0.4, -size*0.4,
                  size*0.3, -size*0.3, -size*0.3,   size*0.4, -size*0.4, -size*0.4,
                  -size*0.3, size*0.3, -size*0.3,   -size*0.4, size*0.4, -size*0.4,
                  size*0.3, size*0.3, -size*0.3,    size*0.4, size*0.4, -size*0.4,
                  -size*0.3, -size*0.3, size*0.3,   -size*0.4, -size*0.4, size*0.4,
                  size*0.3, -size*0.3, size*0.3,    size*0.4, -size*0.4, size*0.4,
                  -size*0.3, size*0.3, size*0.3,    -size*0.4, size*0.4, size*0.4,
                  size*0.3, size*0.3, size*0.3,     size*0.4, size*0.4, size*0.4
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#5fc9b8" opacity={0.4} transparent linewidth={1} />
          </line>
          
          {/* Connecting lines from third to fourth layer */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={16}
                array={new Float32Array([
                  -size*0.4, -size*0.4, -size*0.4,  -size*0.5, -size*0.5, -size*0.5,
                  size*0.4, -size*0.4, -size*0.4,   size*0.5, -size*0.5, -size*0.5,
                  -size*0.4, size*0.4, -size*0.4,   -size*0.5, size*0.5, -size*0.5,
                  size*0.4, size*0.4, -size*0.4,    size*0.5, size*0.5, -size*0.5,
                  -size*0.4, -size*0.4, size*0.4,   -size*0.5, -size*0.5, size*0.5,
                  size*0.4, -size*0.4, size*0.4,    size*0.5, -size*0.5, size*0.5,
                  -size*0.4, size*0.4, size*0.4,    -size*0.5, size*0.5, size*0.5,
                  size*0.4, size*0.4, size*0.4,     size*0.5, size*0.5, size*0.5
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#b854e6" opacity={0.4} transparent linewidth={1} />
          </line>
          
          {/* Connecting lines from fourth to outermost layer */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={16}
                array={new Float32Array([
                  -size*0.5, -size*0.5, -size*0.5,  -size*0.6, -size*0.6, -size*0.6,
                  size*0.5, -size*0.5, -size*0.5,   size*0.6, -size*0.6, -size*0.6,
                  -size*0.5, size*0.5, -size*0.5,   -size*0.6, size*0.6, -size*0.6,
                  size*0.5, size*0.5, -size*0.5,    size*0.6, size*0.6, -size*0.6,
                  -size*0.5, -size*0.5, size*0.5,   -size*0.6, -size*0.6, size*0.6,
                  size*0.5, -size*0.5, size*0.5,    size*0.6, -size*0.6, size*0.6,
                  -size*0.5, size*0.5, size*0.5,    -size*0.6, size*0.6, size*0.6,
                  size*0.5, size*0.5, size*0.5,     size*0.6, size*0.6, size*0.6
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#5fc9b8" opacity={0.3} transparent linewidth={1} />
          </line>
        </>
      )}
      
      {/* Holographic front panel with ripple waves */}
      <mesh position={[0, 0, size / 2 + 0.01]}>
        <planeGeometry ref={frontPanelGeometryRef} args={[size * 0.9, size * 0.9, 32, 32]} />
        <meshPhysicalMaterial
          ref={frontPanelRef}
          color="#00ffff"
          transparent
          opacity={0.25}
          metalness={0.9}
          roughness={0.1}
          transmission={0.6}
          thickness={0.2}
          emissive="#00ffff"
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
          wireframe={false}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          iridescence={0.8}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[100, 800]}
        />
      </mesh>
      
      {/* Holographic back panel with ripple waves */}
      <mesh position={[0, 0, -size / 2 - 0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry ref={backPanelGeometryRef} args={[size * 0.9, size * 0.9, 32, 32]} />
        <meshPhysicalMaterial
          ref={backPanelRef}
          color="#ff00ff"
          transparent
          opacity={0.25}
          metalness={0.9}
          roughness={0.1}
          transmission={0.6}
          thickness={0.2}
          emissive="#ff00ff"
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
          wireframe={false}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          iridescence={0.8}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[100, 800]}
        />
      </mesh>
      
      {/* Floating orb inside the cube */}      <group ref={orbRef} position={[0, 0, 0]}>
        {/* Outer glow halo */}
        <mesh renderOrder={10}>
          <sphereGeometry args={[size * 0.04, 12, 12]} />
          <meshBasicMaterial
            ref={orbGlowRef}
            color="#ff00ff"
            transparent
            opacity={0.3}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
        
        {/* Middle shimmer layer */}
        <mesh renderOrder={11}>
          <sphereGeometry args={[size * 0.02, 12, 12]} />
          <meshStandardMaterial
            ref={orbMaterialRef}
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1.2}
            transparent
            opacity={0.7}
            metalness={0.8}
            roughness={0.2}
            depthWrite={false}
          />
        </mesh>
        
        {/* Core bright orb */}
        <mesh renderOrder={12}>
          <sphereGeometry args={[size * 0.012, 12, 12]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={2.5}
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </mesh>
        
        {/* Orb point light */}
        <pointLight
          ref={orbLightRef}
          position={[0, 0, 0]}
          color="#00ffff"
          intensity={1.5}
          distance={size * 0.8}
        />
      </group>
      
      {/* Second floating orb (half size) */}
      <group ref={orb2Ref} position={[0, 0, 0]}>
        <mesh renderOrder={10}>
          <sphereGeometry args={[size * 0.02, 10, 10]} />
          <meshBasicMaterial
            ref={orb2GlowRef}
            color="#00ff00"
            transparent
            opacity={0.3}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
        
        <mesh renderOrder={11}>
          <sphereGeometry args={[size * 0.01, 10, 10]} />
          <meshStandardMaterial
            ref={orb2MaterialRef}
            color="#00ff00"
            emissive="#00ff00"
            emissiveIntensity={1.2}
            transparent
            opacity={0.7}
            metalness={0.8}
            roughness={0.2}
            depthWrite={false}
          />
        </mesh>
        
        <mesh renderOrder={12}>
          <sphereGeometry args={[size * 0.006, 10, 10]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={2.5}
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </mesh>
        
        <pointLight
          ref={orb2LightRef}
          position={[0, 0, 0]}
          color="#00ff00"
          intensity={1}
          distance={size * 0.6}
        />
      </group>
      
      {/* Third floating orb (slightly smaller than second) */}
      <group ref={orb3Ref} position={[0, 0, 0]}>
        <mesh renderOrder={10}>
          <sphereGeometry args={[size * 0.016, 8, 8]} />
          <meshBasicMaterial
            ref={orb3GlowRef}
            color="#ff0000"
            transparent
            opacity={0.3}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
        
        <mesh renderOrder={11}>
          <sphereGeometry args={[size * 0.008, 8, 8]} />
          <meshStandardMaterial
            ref={orb3MaterialRef}
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={1.2}
            transparent
            opacity={0.7}
            metalness={0.8}
            roughness={0.2}
            depthWrite={false}
          />
        </mesh>
        
        <mesh renderOrder={12}>
          <sphereGeometry args={[size * 0.005, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={2.5}
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </mesh>
        
        <pointLight
          ref={orb3LightRef}
          position={[0, 0, 0]}
          color="#ff0000"
          intensity={0.9}
          distance={size * 0.5}
        />
      </group>
      
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
      
      {/* Green reflective lighting for Nexus Prime only - optimized */}
      {animationId === 3 && (
        <pointLight position={[4, 12, 4]} color="#10c22eff" intensity={1.5} distance={size} />
      )}
      
      {/* FBX Model or placeholder sphere */}
      {fbxUrl ? (
        <FBXModel url={fbxUrl} scale={scale} rotation={rotation} positionY={positionY} offsetX={offsetX} offsetZ={offsetZ} isPlaying={isPlaying} onModelLoaded={onModelLoaded} preloadedModel={preloadedModel} allowNaturalYMovement={allowNaturalYMovement} />
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
