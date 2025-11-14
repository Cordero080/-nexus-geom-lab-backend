import { useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';

/**
 * USER INTERACTION HOOK - Mouse-over rotation interference (no click required!)
 *
 * What it does:
 * 1. Raycasts from mouse position to detect hovered objects
 * 2. Adds rotation interference when mouse hovers over object
 * 3. Stores rotation offsets per object ID
 * 4. Gradually decays rotation when mouse leaves (damping effect)
 * 5. Provides getUserRotation/decayUserRotations to animation loop
 *
 * Why it matters:
 * - Creates playful, tactile interaction without clicks
 * - Objects "react" to mouse presence
 * - Smooth damping makes it feel natural
 * - Returns functions for animation loop to use each frame
 *
 * @param {Object} refs - Scene, camera, renderer references for raycasting
 * @returns {Object} Functions: getUserRotation, setUserRotation, decayUserRotations
 */
export function useObjectInteraction(refs) {
  const { sceneRef, cameraRef, rendererRef } = refs;

  const hoveredObject = useRef(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  // Store user rotation offsets for each object
  const objectRotations = useRef(new Map());

  // Get user rotation for an object
  const getUserRotation = useCallback((objectId) => {
    return objectRotations.current.get(objectId) || { x: 0, y: 0, z: 0 };
  }, []);

  // Set user rotation for an object
  const setUserRotation = useCallback((objectId, rotation) => {
    objectRotations.current.set(objectId, rotation);
  }, []);

  const decayUserRotations = useCallback(() => {
    const damping = 0.92; // ADJUST: Controls how quickly rotation slows down after mouse leaves (0.0 = instant stop, 1.0 = never stops)
    const epsilon = 0.0001; // ADJUST: Minimum rotation value before stopping completely (smaller = more gradual stop)
    objectRotations.current.forEach((rotation, objectId) => {
      const decayed = {
        x: rotation.x * damping,
        y: rotation.y * damping,
        z: rotation.z * damping,
      };

      if (
        Math.abs(decayed.x) < epsilon &&
        Math.abs(decayed.y) < epsilon &&
        Math.abs(decayed.z) < epsilon
      ) {
        objectRotations.current.delete(objectId);
      } else {
        objectRotations.current.set(objectId, decayed);
      }
    });
  }, []);

  // Setup event listeners (listen on window to avoid pointer-event issues)
  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    if (!scene || !camera || !renderer || !renderer.domElement) {
      return;
    }

    const canvas = renderer.domElement;
    canvas.style.pointerEvents = 'auto';

    const collectInteractiveMeshes = () => {
      const meshes = [];
      scene.traverse((child) => {
        if (
          child.isMesh &&
          !child.userData.isSpectralOrb &&
          !child.userData.isEnvironment &&
          child.userData.objectId &&
          child.visible
        ) {
          meshes.push(child);
        }
      });
      return meshes;
    };

    let lastClientX = null;
    let lastClientY = null;

    const handleMouseMove = (event) => {
      const currentScene = sceneRef.current;
      const currentCamera = cameraRef.current;
      const currentRenderer = rendererRef.current;

      if (!currentScene || !currentCamera || !currentRenderer) {
        return;
      }

      const rect = currentRenderer.domElement.getBoundingClientRect();
      const insideCanvas =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      // If outside canvas but we have a hovered object, continue tracking mouse movement
      if (!insideCanvas && hoveredObject.current) {
        const rotationSensitivity = 0.001; // ADJUST: How responsive object rotation is to mouse movement (higher = more sensitive)
        const clampDelta = (value, limit = 0.05) => {
          // ADJUST: Maximum rotation speed per frame (higher = faster spins)
          return Math.max(-limit, Math.min(limit, value));
        };

        const deltaY =
          lastClientX === null
            ? 0
            : clampDelta((event.clientX - lastClientX) * rotationSensitivity);
        const deltaX =
          lastClientY === null
            ? 0
            : clampDelta((event.clientY - lastClientY) * rotationSensitivity);

        lastClientX = event.clientX;
        lastClientY = event.clientY;

        const objectId = hoveredObject.current.userData.objectId || hoveredObject.current.uuid;
        const currentRotation = getUserRotation(objectId);

        const newRotation = {
          x: currentRotation.x + deltaX,
          y: currentRotation.y + deltaY,
          z: currentRotation.z,
        };

        setUserRotation(objectId, newRotation);
        return;
      }

      // If outside canvas and no hovered object, reset and return
      if (!insideCanvas) {
        hoveredObject.current = null;
        currentRenderer.domElement.style.cursor = 'default';
        lastClientX = event.clientX;
        lastClientY = event.clientY;
        return;
      }

      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, currentCamera);

      const interactiveMeshes = collectInteractiveMeshes();
      const intersects = raycaster.current.intersectObjects(interactiveMeshes, false);

      if (intersects.length === 0) {
        hoveredObject.current = null;
        currentRenderer.domElement.style.cursor = 'default';
        lastClientX = event.clientX;
        lastClientY = event.clientY;
        return;
      }

      const intersectedObject = intersects[0].object;
      hoveredObject.current = intersectedObject;
      currentRenderer.domElement.style.cursor = 'pointer';

      const rotationSensitivity = 0.001; // ADJUST: How responsive object rotation is to mouse movement (higher = more sensitive)

      // Clamp rotation injection so spins stay smooth
      const clampDelta = (value, limit = 0.05) => {
        // ADJUST: Maximum rotation speed per frame (higher = faster spins)
        return Math.max(-limit, Math.min(limit, value));
      };

      const deltaY =
        lastClientX === null ? 0 : clampDelta((event.clientX - lastClientX) * rotationSensitivity);
      const deltaX =
        lastClientY === null ? 0 : clampDelta((event.clientY - lastClientY) * rotationSensitivity);

      lastClientX = event.clientX;
      lastClientY = event.clientY;

      const objectId = intersectedObject.userData.objectId || intersectedObject.uuid;
      const currentRotation = getUserRotation(objectId);

      const newRotation = {
        x: currentRotation.x + deltaX,
        y: currentRotation.y + deltaY,
        z: currentRotation.z,
      };

      setUserRotation(objectId, newRotation);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [sceneRef, cameraRef, rendererRef, getUserRotation, setUserRotation]);

  return {
    getUserRotation,
    decayUserRotations,
    hoveredObject: hoveredObject.current,
  };
}
