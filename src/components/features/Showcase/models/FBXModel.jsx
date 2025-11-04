import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';

// Y-AXIS MOVEMENT CONFIGURATION
// Configure allowNaturalYMovement in: src/Showcase/data/mockAnimations.js
// Used by: src/Showcase/components/ShowcaseViewer/ShowcaseViewer.jsx

export default function FBXModel({ url, scale = 0.01, rotation = [0, 0, 0], positionY = -1.8, offsetX = 0, offsetZ = 0, isPlaying = true, onModelLoaded, allowNaturalYMovement = false, onAnimationTimeUpdate = null }) {
  const groupRef = useRef();
  const mixerRef = useRef();
  const modelRef = useRef();
  const actionRef = useRef();

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

        // INITIAL MODEL POSITIONING:
        // Center the model and place at bottom (this is the starting position)
        const box = new THREE.Box3().setFromObject(fbx);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center horizontally, place at bottom of cube
        fbx.position.x = -center.x;  // Center on X-axis
        fbx.position.z = -center.z;  // Center on Z-axis
        fbx.position.y = -box.min.y; // Y-ANCHOR: Put feet at y=0 (initial ground position)
        // NOTE: If allowNaturalYMovement=true, animation can move model up/down from this base

        // Setup animation mixer if animations exist
        if (fbx.animations && fbx.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(fbx);
          mixerRef.current = mixer;

          // Clone the animation and remove root position tracks to prevent position drift
          const clip = fbx.animations[0].clone();
          
          // ANIMATION Y-AXIS CONTROL SYSTEM:
          // This filter controls whether models can move naturally in Y-axis or stay grounded
          // Remove only the root translation so characters stay centered while limb motion persists
          clip.tracks = clip.tracks.filter((track) => {
            const parts = track.name.split('.');
            const property = parts.length ? parts[parts.length - 1].toLowerCase() : '';
            if (property !== 'position') {
              return true; // Keep all non-position tracks (rotation, scale, etc.)
            }

            const nodePath = parts.slice(0, -1).join('.').toLowerCase();
            const isRootPosition = nodePath.endsWith('hips') || nodePath.endsWith('root') || nodePath.endsWith('pelvis');
            
            // Y-AXIS MOVEMENT DECISION POINT:
            // Configure this setting in: src/Showcase/data/mockAnimations.js
            // If allowNaturalYMovement is true, preserve Y-axis animation for acrobatic moves
            if (allowNaturalYMovement && isRootPosition) {
              // Keep only Y-axis movement, remove X and Z to prevent drifting
              return track.name.includes('.position');
            }
            
            // Default: Remove all root position tracks to keep model grounded
            return !isRootPosition;
          });

          // Create the action and store it
          const action = mixer.clipAction(clip);
          actionRef.current = action;

          // Play if isPlaying is true initially
          if (isPlaying) {
            action.play();
          }
        }

        // Add to scene
        if (groupRef.current) {
          groupRef.current.add(fbx);
        }

        // Call onModelLoaded immediately - don't wait for textures
        // This makes the model appear faster in the gallery
        if (onModelLoaded) onModelLoaded();

        // Optimize textures and adjust materials for specific models
        fbx.traverse((child) => {
          if (child.isMesh && child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((mat) => {
              // Reduce texture quality for gallery view
              if (mat.map) {
                mat.map.minFilter = THREE.LinearFilter;
                mat.map.generateMipmaps = false;
              }
              

            });
          }
        });
      },
      undefined, // Progress callback
      (error) => {
        // FBX loading failed silently
      }
    );

    // Cleanup
    return () => {
      // Stop and dispose animation mixer
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
      
      // Dispose of the model and its resources
      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if (child.isMesh) {
            // Dispose geometry
            if (child.geometry) {
              child.geometry.dispose();
            }
            
            // Dispose materials and textures
            if (child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((mat) => {
                // Dispose textures
                if (mat.map) mat.map.dispose();
                if (mat.normalMap) mat.normalMap.dispose();
                if (mat.roughnessMap) mat.roughnessMap.dispose();
                if (mat.metalnessMap) mat.metalnessMap.dispose();
                if (mat.emissiveMap) mat.emissiveMap.dispose();
                if (mat.aoMap) mat.aoMap.dispose();
                if (mat.lightMap) mat.lightMap.dispose();
                // Dispose material
                mat.dispose();
              });
            }
          }
        });
        
        // Remove from scene
        if (groupRef.current) {
          groupRef.current.remove(modelRef.current);
        }
        
        modelRef.current = null;
      }
      
      actionRef.current = null;
    };
  }, [url, scale]);

  // Handle play/pause when isPlaying changes
  useEffect(() => {
    if (actionRef.current) {
      if (isPlaying) {
        actionRef.current.play();
      } else {
        actionRef.current.stop();
      }
    }
  }, [isPlaying]);

  // Update animation mixer
  useFrame((state, delta) => {
    if (mixerRef.current && isPlaying) {
      mixerRef.current.update(delta);
      
      // Call onAnimationTimeUpdate callback with current animation time
      if (onAnimationTimeUpdate && actionRef.current) {
        const currentTime = actionRef.current.time;
        onAnimationTimeUpdate(currentTime);
      }
    }
  });

  return <group ref={groupRef} position={[offsetX, positionY, offsetZ]} />;
}
