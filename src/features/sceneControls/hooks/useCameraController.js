import { useEffect } from "react";

/**
 * Controls camera position based on cameraView prop
 *
 * @param {Object} cameraRef - Reference to the Three.js camera
 * @param {string} cameraView - Camera view mode ('free', 'orbit', 'top', 'side', 'cinematic')
 */
export function useCameraController(cameraRef, cameraView) {
  useEffect(() => {
    if (!cameraRef.current) return; // Safety check

    const camera = cameraRef.current;

    // DEBUG: Log cameraView changes and camera position
    console.log("[ThreeScene] cameraView effect:", cameraView);

    // POSITION CAMERA based on cameraView prop
    switch (cameraView) {
      case "free":
        camera.position.set(0, 0, 6); // Standard front view
        break;
      case "orbit":
        camera.position.set(0, 3, 6); // Elevated view for orbiting
        camera.lookAt(0, 0, 0); // Look at center
        break;
      case "top":
        camera.position.set(0, 10, 0); // Directly above
        camera.lookAt(0, 0, 0); // Look down at center
        break;
      case "side":
        camera.position.set(10, 0, 0); // Far to the right side
        camera.lookAt(0, 0, 0); // Look at center
        break;
      case "cinematic":
        camera.position.set(-3, 2, 5); // Dramatic angle
        camera.lookAt(0, 0, 0); // Look at center
        break;
    }

    console.log("[ThreeScene] camera position after update:", camera.position);
  }, [cameraView]); // Run when cameraView prop changes
}
