import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';

export default function FBXModel({ url, scale = 0.01, rotation = [0, 0, 0], positionY = -1.8, offsetX = 0, offsetZ = 0, isPlaying = true, onModelLoaded }) {
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
        console.log(`Loading model: ${url}, scale: ${scale}`);

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
          console.log(`Model ${url} has ${fbx.animations.length} animation(s):`, fbx.animations.map(anim => anim.name));
          const mixer = new THREE.AnimationMixer(fbx);
          mixerRef.current = mixer;

          // Clone the animation and remove root position tracks to prevent position drift
          const clip = fbx.animations[0].clone();
          // Remove only the root translation so characters stay centered while limb motion persists
          clip.tracks = clip.tracks.filter((track) => {
            const parts = track.name.split('.');
            const property = parts.length ? parts[parts.length - 1].toLowerCase() : '';
            if (property !== 'position') {
              return true;
            }

            const nodePath = parts.slice(0, -1).join('.').toLowerCase();
            const isRootPosition = nodePath.endsWith('hips') || nodePath.endsWith('root') || nodePath.endsWith('pelvis');
            return !isRootPosition;
          });

          // Create the action and store it
          const action = mixer.clipAction(clip);
          actionRef.current = action;

          // Play if isPlaying is true initially
          if (isPlaying) {
            action.play();
          }
        } else {
          console.log(`Model ${url} has no animations`);
        }

        // Add to scene
        if (groupRef.current) {
          groupRef.current.add(fbx);
        }

        // Wait for all textures to load before calling onModelLoaded
        const imagePromises = [];
        fbx.traverse((child) => {
          if (child.isMesh && child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((mat) => {
              if (mat.map && mat.map.image) {
                const img = mat.map.image;
                if (!img.complete) {
                  imagePromises.push(new Promise((resolve) => {
                    img.addEventListener('load', resolve, { once: true });
                  }));
                }
              }
            });
          }
        });

        if (imagePromises.length > 0) {
          Promise.all(imagePromises).then(() => {
            if (onModelLoaded) onModelLoaded();
          });
        } else {
          if (onModelLoaded) onModelLoaded();
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
    }
  });

  return <group ref={groupRef} position={[offsetX, positionY, offsetZ]} />;
}
