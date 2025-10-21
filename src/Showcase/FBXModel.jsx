import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';

export default function FBXModel({ url, scale = 0.01, rotation = [0, 0, 0], positionY = -1.8, offsetX = 0, offsetZ = 0 }) {
  const groupRef = useRef();
  const mixerRef = useRef();
  const modelRef = useRef();

  useEffect(() => {
    const loader = new FBXLoader();
    
    loader.load(
      url,
      (fbx) => {
        // Store the model
        modelRef.current = fbx;
        
        // Scale the model
        fbx.scale.setScalar(scale);
        
        // Apply rotation if needed
        fbx.rotation.set(rotation[0], rotation[1], rotation[2]);
        
        // Center the model and place at bottom
        const box = new THREE.Box3().setFromObject(fbx);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Center horizontally, place at bottom of cube
        fbx.position.x = -center.x;
        fbx.position.z = -center.z;
        fbx.position.y = -box.min.y; // Put feet at y=0
        
        // Setup animation mixer if animations exist
        if (fbx.animations && fbx.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(fbx);
          mixerRef.current = mixer;
          
          // Clone the animation and remove root position tracks to prevent position drift
          const clip = fbx.animations[0].clone();
          clip.tracks = clip.tracks.filter(track => {
            // Keep all tracks except root position (removes X and Z position animation)
            return !track.name.includes('.position');
          });
          
          // Play the modified animation
          const action = mixer.clipAction(clip);
          action.play();
        }
        
        // Add to scene
        if (groupRef.current) {
          groupRef.current.add(fbx);
        }
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('Error loading FBX:', error);
      }
    );
    
    // Cleanup
    return () => {
      if (modelRef.current && groupRef.current) {
        groupRef.current.remove(modelRef.current);
      }
    };
  }, [url, scale]);

  // Update animation mixer
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return <group ref={groupRef} position={[offsetX, positionY, offsetZ]} />;
}
