import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Adds additional lights from multiple angles ONLY when metalness is high
 * This gives metallic surfaces more to reflect, making the effect visible from all angles
 *
 * @param {Object} sceneRef - Reference to the Three.js scene
 * @param {number} metalness - Current metalness value (0-1)
 */
export function useMetalnessLighting(sceneRef, metalness) {
  // Refs to store the extra lights so we can remove them later
  const rimLight1Ref = useRef(null);
  const rimLight2Ref = useRef(null);
  const backLightRef = useRef(null);
  const volumeLightRef = useRef(null); // Bottom-right light for volume
  const southLightRef = useRef(null); // South light at 8 o'clock position

  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;

    // If metalness is high (> 0.4), add rim lights from the sides and back
    if (metalness > 0.4) {
      // Create lights if they don't exist
      if (!rimLight1Ref.current) {
        // LEFT RIM LIGHT - lights up the left side
        // DirectionalLight(color, intensity) - intensity scales with metalness value
        const rimLight1 = new THREE.DirectionalLight("#ffffff", metalness * 3);
        rimLight1.position.set(-10, 5, 0); // position.set(x, y, z) - x: left(-)/right(+), y: down(-)/up(+), z: back(-)/forward(+)
        rimLight1Ref.current = rimLight1;
        scene.add(rimLight1);
      } else {
        // Update intensity based on metalness - MUST MATCH creation intensity formula
        rimLight1Ref.current.intensity = metalness * 3;
      }

      if (!rimLight2Ref.current) {
        // RIGHT RIM LIGHT - lights up the right side
        // DirectionalLight(color, intensity) - intensity scales with metalness value
        const rimLight2 = new THREE.DirectionalLight("#ffffff", metalness * 3);
        rimLight2.position.set(10, 5, 0); // position.set(x, y, z) - x: left(-)/right(+), y: down(-)/up(+), z: back(-)/forward(+)
        rimLight2Ref.current = rimLight2;
        scene.add(rimLight2);
      } else {
        // Update intensity based on metalness - MUST MATCH creation intensity formula
        rimLight2Ref.current.intensity = metalness * 3;
      }

      if (!backLightRef.current) {
        // BACK LIGHT - lights up the back side
        // DirectionalLight(color, intensity) - intensity scales with metalness value
        const backLight = new THREE.DirectionalLight("#ffffff", metalness * 3);
        backLight.position.set(0, 5, -10); // position.set(x, y, z) - x: left(-)/right(+), y: down(-)/up(+), z: back(-)/forward(+)
        backLightRef.current = backLight;
        scene.add(backLight);
      } else {
        // Update intensity based on metalness - MUST MATCH creation intensity formula
        backLightRef.current.intensity = metalness * 3; // FIXED: was metalness * 2
      }

      if (!volumeLightRef.current) {
        // BOTTOM-RIGHT VOLUME LIGHT - soft light at appealing angle to show depth
        // DirectionalLight(color, intensity) - intensity scales with metalness value
        const volumeLight = new THREE.DirectionalLight(
          "#ffffff",
          metalness * 1.5 // Lower multiplier = softer, more subtle light
        );
        volumeLight.position.set(8, -6, 12); // Bottom-right, angled upward | position.set(x, y, z) - x: left(-)/right(+), y: down(-)/up(+), z: back(-)/forward(+)
        volumeLightRef.current = volumeLight;
        scene.add(volumeLight);
      } else {
        // Update intensity based on metalness - MUST MATCH creation intensity formula
        volumeLightRef.current.intensity = metalness * 1.5;
      }

      if (!southLightRef.current) {
        // SOUTH LIGHT - at 8 o'clock position (low, front-right)
        // DirectionalLight(color, intensity) - intensity scales with metalness value
        const southLight = new THREE.DirectionalLight(
          "#ffffff",
          metalness * 5 // Higher multiplier = stronger, brighter light (adjust to taste: try 2-7)
        );
        southLight.position.set(6, -8, 12); // South position, 8 o'clock angle | position.set(x, y, z) - x: left(-)/right(+), y: down(-)/up(+), z: back(-)/forward(+)
        southLightRef.current = southLight;
        scene.add(southLight);
      } else {
        // Update intensity based on metalness - MUST MATCH creation intensity formula
        southLightRef.current.intensity = metalness * 5; // FIXED: was metalness * 2
      }
    } else {
      // If metalness is low, remove the extra lights
      if (rimLight1Ref.current) {
        scene.remove(rimLight1Ref.current);
        rimLight1Ref.current = null;
      }
      if (rimLight2Ref.current) {
        scene.remove(rimLight2Ref.current);
        rimLight2Ref.current = null;
      }
      if (backLightRef.current) {
        scene.remove(backLightRef.current);
        backLightRef.current = null;
      }
      if (volumeLightRef.current) {
        scene.remove(volumeLightRef.current);
        volumeLightRef.current = null;
      }
      if (southLightRef.current) {
        scene.remove(southLightRef.current);
        southLightRef.current = null;
      }
    }
  }, [sceneRef, metalness]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sceneRef.current) {
        if (rimLight1Ref.current) {
          sceneRef.current.remove(rimLight1Ref.current);
        }
        if (rimLight2Ref.current) {
          sceneRef.current.remove(rimLight2Ref.current);
        }
        if (backLightRef.current) {
          sceneRef.current.remove(backLightRef.current);
        }
        if (volumeLightRef.current) {
          sceneRef.current.remove(volumeLightRef.current);
        }
        if (southLightRef.current) {
          sceneRef.current.remove(southLightRef.current);
        }
      }
    };
  }, [sceneRef]);
}
