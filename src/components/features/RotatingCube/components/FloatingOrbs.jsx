import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Three Floating Orbs with Spectral Color Animation
 * Each orb has different size, orbit pattern, and color cycling
 */
export default function FloatingOrbs({ size }) {
  const orbRef = useRef();
  const orbLightRef = useRef();
  const orbMaterialRef = useRef();
  const orbGlowRef = useRef();
  
  const orb2Ref = useRef();
  const orb2LightRef = useRef();
  const orb2MaterialRef = useRef();
  const orb2GlowRef = useRef();
  
  const orb3Ref = useRef();
  const orb3LightRef = useRef();
  const orb3MaterialRef = useRef();
  const orb3GlowRef = useRef();

  useFrame((state) => {
    // Orb 1 movement - elevated 3D orbit
    if (orbRef.current) {
      const time = state.clock.elapsedTime * 1;
      const baseRadius = size * 1;
      const angle = time;
      
      orbRef.current.position.x = Math.cos(angle) * baseRadius;
      orbRef.current.position.z = Math.sin(angle) * baseRadius;
      orbRef.current.position.y = size * 0.3 + Math.sin(time * 2.5) * size * 0.02;
      
      const pulse = 1 + Math.sin(time * 3) * 0.15;
      orbRef.current.scale.set(pulse, pulse, pulse);
    }
    
    // Orb 2 movement
    if (orb2Ref.current) {
      const time = state.clock.elapsedTime * 1;
      const baseRadius = size * 1;
      const angle = time + Math.PI * 0.66;
      
      orb2Ref.current.position.x = Math.cos(angle) * baseRadius;
      orb2Ref.current.position.z = Math.sin(angle) * baseRadius;
      orb2Ref.current.position.y = size * 0.1 + Math.sin(time * 1.8) * size * 0.1;
      
      const pulse = 1 + Math.sin(time * 3.5) * 0.15;
      orb2Ref.current.scale.set(pulse, pulse, pulse);
    }
    
    // Orb 3 movement
    if (orb3Ref.current) {
      const time = state.clock.elapsedTime * 0.5;
      const baseRadius = size * 0.18;
      const angle = time + Math.PI * 1.33;
      
      orb3Ref.current.position.x = Math.cos(angle) * baseRadius;
      orb3Ref.current.position.z = Math.sin(angle) * baseRadius;
      orb3Ref.current.position.y = -size * 0.15 + Math.sin(time * 2.2) * size * 0.08;
      
      const pulse = 1 + Math.sin(time * 4) * 0.15;
      orb3Ref.current.scale.set(pulse, pulse, pulse);
    }
    
    // Orb 1 spectral colors
    if (orbMaterialRef.current && orbGlowRef.current && orbLightRef.current) {
      const time = state.clock.elapsedTime;
      const hue = (time * 0.5) % 1;
      
      const r = Math.abs(Math.sin(hue * Math.PI * 2));
      const g = Math.abs(Math.sin((hue + 2.33) * Math.PI * 4));
      const b = Math.abs(Math.sin((hue + 0.66) * Math.PI * 2));
      
      orbMaterialRef.current.color.setRGB(r, g, b);
      orbMaterialRef.current.emissive.setRGB(r, g, b);
      orbGlowRef.current.color.setRGB(r * 0.8, g * 0.8, b * 0.8);
      orbLightRef.current.color.setRGB(r, g, b);
      orbLightRef.current.intensity = 1.5 + Math.sin(time * 2.5) * 0.7;
    }
    
    // Orb 2 spectral colors
    if (orb2MaterialRef.current && orb2GlowRef.current && orb2LightRef.current) {
      const time = state.clock.elapsedTime;
      const hue = ((time * 0.5) + 0.33) % 1;
      
      const r = Math.abs(Math.sin(hue * Math.PI * 2));
      const g = Math.abs(Math.sin((hue + 0.33) * Math.PI * 2));
      const b = Math.abs(Math.sin((hue + 0.66) * Math.PI * 2));
      
      orb2MaterialRef.current.color.setRGB(r, g, b);
      orb2MaterialRef.current.emissive.setRGB(r, g, b);
      orb2GlowRef.current.color.setRGB(r * 0.8, g * 0.8, b * 0.8);
      orb2LightRef.current.color.setRGB(r, g, b);
      orb2LightRef.current.intensity = 1 + Math.sin(time * 2.8) * 0.5;
    }
    
    // Orb 3 spectral colors
    if (orb3MaterialRef.current && orb3GlowRef.current && orb3LightRef.current) {
      const time = state.clock.elapsedTime;
      const hue = ((time * 0.5) + 0.66) % 1;
      
      const r = Math.abs(Math.sin(hue * Math.PI * 2));
      const g = Math.abs(Math.sin((hue + 0.33) * Math.PI * 2));
      const b = Math.abs(Math.sin((hue + 0.66) * Math.PI * 2));
      
      orb3MaterialRef.current.color.setRGB(r, g, b);
      orb3MaterialRef.current.emissive.setRGB(r, g, b);
      orb3GlowRef.current.color.setRGB(r * 0.8, g * 0.8, b * 0.8);
      orb3LightRef.current.color.setRGB(r, g, b);
      orb3LightRef.current.intensity = 0.9 + Math.sin(time * 3.2) * 0.4;
    }
  });

  return (
    <>
      {/* Orb 1 */}
      <group ref={orbRef} position={[0, 0, 0]}>
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
        
        <pointLight
          ref={orbLightRef}
          position={[0, 0, 0]}
          color="#00ffff"
          intensity={1.5}
          distance={size * 0.8}
        />
      </group>
      
      {/* Orb 2 */}
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
      
      {/* Orb 3 */}
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
    </>
  );
}
