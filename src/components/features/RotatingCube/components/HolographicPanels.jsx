import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Holographic Panels with Ripple Wave Animation
 * Front and back panels with dynamic vertex displacement and color cycling
 */
export default function HolographicPanels({ size }) {
  const frontPanelRef = useRef();
  const backPanelRef = useRef();
  const frontPanelGeometryRef = useRef();
  const backPanelGeometryRef = useRef();

  useFrame((state) => {
    if (frontPanelRef.current && backPanelRef.current && frontPanelGeometryRef.current && backPanelGeometryRef.current) {
      const time = state.clock.elapsedTime;
      
      // Animate ripple waves on front panel
      const frontPositions = frontPanelGeometryRef.current.attributes.position;
      const segmentsX = 32;
      const segmentsY = 32;
      
      for (let i = 0; i <= segmentsX; i++) {
        for (let j = 0; j <= segmentsY; j++) {
          const index = i * (segmentsY + 1) + j;
          const x = (i / segmentsX - 0.5);
          const y = (j / segmentsY - 0.5);
          const dist = Math.sqrt(x * x + y * y) * 2;
          
          const wave1 = Math.sin(dist * 12 - time * 2) * 0.02;
          const wave2 = Math.sin(dist * 8 - time * 1.5 + Math.PI) * 0.015;
          const wave3 = Math.sin(dist * 15 - time * 2.5) * 0.01;
          const z = (wave1 + wave2 + wave3) * (1 - dist * 0.3);
          
          frontPositions.setZ(index, z);
        }
      }
      frontPositions.needsUpdate = true;
      
      // Animate ripple waves on back panel
      const backPositions = backPanelGeometryRef.current.attributes.position;
      
      for (let i = 0; i <= segmentsX; i++) {
        for (let j = 0; j <= segmentsY; j++) {
          const index = i * (segmentsY + 1) + j;
          const x = (i / segmentsX - 0.5);
          const y = (j / segmentsY - 0.5);
          const dist = Math.sqrt(x * x + y * y) * 2;
          
          const wave1 = Math.sin(dist * 10 - time * 1.8 + Math.PI * 0.5) * 0.02;
          const wave2 = Math.sin(dist * 14 - time * 2.2) * 0.012;
          const wave3 = Math.sin(dist * 6 - time * 1.3) * 0.018;
          const z = (wave1 + wave2 + wave3) * (1 - dist * 0.3);
          
          backPositions.setZ(index, z);
        }
      }
      backPositions.needsUpdate = true;
      
      // Front panel color animation
      const frontHue = (time * 0.15) % 1;
      const frontR = Math.abs(Math.sin(frontHue * Math.PI * 2 + time * 0.5));
      const frontG = Math.abs(Math.sin((frontHue + 0.33) * Math.PI * 2 + time * 0.5));
      const frontB = Math.abs(Math.sin((frontHue + 0.66) * Math.PI * 2 + time * 0.5));
      
      frontPanelRef.current.color.setRGB(frontR * 0.7, frontG * 0.7, frontB * 0.7);
      frontPanelRef.current.emissive.setRGB(frontR, frontG, frontB);
      frontPanelRef.current.emissiveIntensity = 0.4 + Math.sin(time * 1.5) * 0.2;
      frontPanelRef.current.opacity = 0.25 + Math.sin(time * 1.2) * 0.08;
      
      // Back panel color animation
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

  return (
    <>
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
    </>
  );
}
