import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * VISUAL EFFECTS HOOK - Adds extra lights when metalness is high
 *
 * What it does:
 * 1. Dynamically adds 7 rim/back/spot lights when metalness > 0.4
 * 2. Gives metallic surfaces more light sources to reflect from all angles
 * 3. Scales light intensity based on metalness value
 * 4. Removes lights when metalness drops below threshold
 *
 * Why it matters:
 * - Makes metalness effect visible from all camera angles
 * - Without these lights, metallic objects look flat from certain views
 * - Adds dramatic rim lighting and volumetric effects
 * - Performance-friendly: only active when needed
 *
 * @param {Object} sceneRef - Three.js scene to add lights to
 * @param {number} metalness - Current metalness value (0-1)
 */
export function useMetalnessLighting(sceneRef, metalness) {
  // Refs to store the extra lights so we can remove them later
  const rimLight1Ref = useRef(null);
  const rimLight2Ref = useRef(null);
  const backLightRef = useRef(null);
  const volumeLightRef = useRef(null); // Bottom-right light for volume
  const southLightRef = useRef(null); // South light at 8 o'clock position
  const spotLightRef = useRef(null); // Focused spotlight from above
  const reflectiveLightRef = useRef(null); // Distant bottom reflective light

  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;

    // If metalness is high (> 0.4), add rim lights from the sides and back
    if (metalness > 0.4) {
      // Create lights if they don't exist
      if (!rimLight1Ref.current) {
        // LEFT RIM LIGHT - lights up the left side
        // DirectionalLight(color, intensity) - intensity scales with metalness value
        const rimLight1 = new THREE.DirectionalLight("#ffffff", metalness * 10); // EXTREME TEST
        rimLight1.position.set(-10, 5, 0); // position.set(x, y, z) - x: left(-)/right(+), y: down(-)/up(+), z: back(-)/forward(+)
        rimLight1Ref.current = rimLight1;
        scene.add(rimLight1);
      } else {
        // Update intensity based on metalness - MUST MATCH creation intensity formula
        // DEBUGGING: Check if light is still in scene
        const stillInScene = scene.getObjectById(rimLight1Ref.current.id);
        if (!stillInScene) {
          scene.add(rimLight1Ref.current);
        }
        rimLight1Ref.current.intensity = metalness * 10; // EXTREME TEST
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
        // DEBUGGING: Check if light is still in scene
        const stillInScene = scene.getObjectById(rimLight2Ref.current.id);
        if (!stillInScene) {
          scene.add(rimLight2Ref.current);
        }
        rimLight2Ref.current.intensity = metalness * 3;
      }

      if (!backLightRef.current) {
        // BACK LIGHT - lights up the back side
        // DirectionalLight(color, intensity) - intensity scales with metalness value
        const backLight = new THREE.DirectionalLight(
          "#5fcdfcff",
          metalness * 3
        );
        backLight.position.set(0, 5, -10); // position.set(x, y, z) - x: left(-)/right(+), y: down(-)/up(+), z: back(-)/forward(+)
        backLightRef.current = backLight;
        scene.add(backLight);
      } else {
        // Update intensity based on metalness - MUST MATCH creation intensity formula
        // DEBUGGING: Check if light is still in scene
        const stillInScene = scene.getObjectById(backLightRef.current.id);
        if (!stillInScene) {
          scene.add(backLightRef.current);
        }
        backLightRef.current.intensity = metalness * 3; // FIXED: was metalness * 2
      }

      if (!volumeLightRef.current) {
        // BOTTOM-RIGHT VOLUME LIGHT - soft light at appealing angle to show depth
        // DirectionalLight(color, intensity) - intensity scales with metalness value
        const volumeLight = new THREE.DirectionalLight(
          "#ffffff",
          metalness * 2.5 // Lower multiplier = softer, more subtle light
        );
        volumeLight.position.set(8, -6, 12); // Bottom-right, angled upward | position.set(x, y, z) - x: left(-)/right(+), y: down(-)/up(+), z: back(-)/forward(+)
        volumeLightRef.current = volumeLight;
        scene.add(volumeLight);
      } else {
        // Update intensity based on metalness - MUST MATCH creation intensity formula
        // DEBUGGING: Check if light is still in scene
        const stillInScene = scene.getObjectById(volumeLightRef.current.id);
        if (!stillInScene) {
          scene.add(volumeLightRef.current);
        }
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
        // DEBUGGING: Check if light is still in scene
        const stillInScene = scene.getObjectById(southLightRef.current.id);
        if (!stillInScene) {
          scene.add(southLightRef.current);
        }
        southLightRef.current.intensity = metalness * 5; // FIXED: was metalness * 2
      }

      if (!spotLightRef.current) {
        // FOCUSED SPOTLIGHT - shines directly down on the object with a focused beam
        const spotLight = new THREE.SpotLight(
          "#f9e45dff",
          metalness * 9, // Higher intensity for visibility
          30, // distance
          Math.PI * 0.1, // narrow angle (cone)
          0.5 // penumbra (soft edge)
        );
        spotLight.position.set(0, 15, 5); // Above and slightly forward
        spotLight.target.position.set(0, 0, 0); // Point at center
        scene.add(spotLight);
        scene.add(spotLight.target); // SpotLight needs its target added to scene
        spotLightRef.current = spotLight;
      } else {
        // Update intensity based on metalness
        const stillInScene = scene.getObjectById(spotLightRef.current.id);
        if (!stillInScene) {
          scene.add(spotLightRef.current);
          scene.add(spotLightRef.current.target);
        }
        spotLightRef.current.intensity = metalness * 8;
      }

      if (!reflectiveLightRef.current) {
        // BLUE BOTTOM LIGHT - bright blue light shining up from directly below
        const reflectiveLight = new THREE.SpotLight(
          "#4A90E2", // Nice blue color - noticeable!
          metalness * 12, // Much stronger intensity so you can see it
          30, // closer distance for stronger effect
          Math.PI * 0.4, // wider angle to light up the whole bottom
          0.3 // sharper edges for more visible effect
        );
        reflectiveLight.position.set(0, -15, 0); // Directly below, closer for stronger effect
        reflectiveLight.target.position.set(0, 0, 0); // Point up at center
        scene.add(reflectiveLight);
        scene.add(reflectiveLight.target);
        reflectiveLightRef.current = reflectiveLight;
      } else {
        // Update intensity based on metalness
        const stillInScene = scene.getObjectById(reflectiveLightRef.current.id);
        if (!stillInScene) {
          scene.add(reflectiveLightRef.current);
          scene.add(reflectiveLightRef.current.target);
        }
        reflectiveLightRef.current.intensity = metalness * 12;
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
      if (spotLightRef.current) {
        scene.remove(spotLightRef.current);
        scene.remove(spotLightRef.current.target); // Remove target too
        spotLightRef.current = null;
      }
      if (reflectiveLightRef.current) {
        scene.remove(reflectiveLightRef.current);
        scene.remove(reflectiveLightRef.current.target);
        reflectiveLightRef.current = null;
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
        if (spotLightRef.current) {
          sceneRef.current.remove(spotLightRef.current);
          if (spotLightRef.current.target) {
            sceneRef.current.remove(spotLightRef.current.target);
          }
        }
        if (reflectiveLightRef.current) {
          sceneRef.current.remove(reflectiveLightRef.current);
          if (reflectiveLightRef.current.target) {
            sceneRef.current.remove(reflectiveLightRef.current.target);
          }
        }
      }
    };
  }, [sceneRef]);
}
