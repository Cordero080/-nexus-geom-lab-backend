import { useEffect } from "react";

/**
 * PROPERTY UPDATE HOOK - Controls camera position based on view mode
 *
 * What it does:
 * 1. Updates camera position when cameraView prop changes
 * 2. Switches between 'free', 'orbit', and 'top' view modes
 * 3. Adjusts lookAt direction for some views
 *
 * Why it matters:
 * - Provides different perspectives for viewing 3D objects
 * - Simple position updates (no complex camera controls needed)
 * - Runs whenever user changes view mode
 *
 * @param {Object} cameraRef - Camera object reference
 * @param {string} cameraView - View mode ('free', 'orbit', 'top')
 */
export function useCameraController(cameraRef, cameraView) {
  useEffect(() => {
    if (!cameraRef.current) return; // Safety check

    const camera = cameraRef.current;

    // DEBUG: Log cameraView changes and camera position

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
    }
  }, [cameraView]); // Run when cameraView prop changes
}
