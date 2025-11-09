import { useEffect } from "react";
import { startAnimationLoop } from "../animation/animationLoop";

/**
 * Hook to manage the main animation loop
 *
 * @param {Object} refs - References to Three.js objects
 * @param {Object} refs.rendererRef - Renderer reference
 * @param {Object} refs.sceneRef - Scene reference
 * @param {Object} refs.cameraRef - Camera reference
 * @param {Object} refs.animationIdRef - Animation ID reference
 * @param {Object} refs.objectsRef - Objects reference
 * @param {Object} refs.objectSpeedRef - Object speed reference (allows speed changes without restarting animation)
 * @param {Object} refs.orbSpeedRef - Orb speed reference (allows speed changes without restarting animation)
 * @param {Object} settings - Animation settings
 * @param {string} settings.animationStyle - Current animation style
 * @param {string} settings.cameraView - Current camera view
 * @param {Object} interactionFns - Functions for user interaction (rotation overrides)
 * @param {Function} interactionFns.getUserRotation - Returns rotation offset for objectId
 * @param {Function} interactionFns.decayUserRotations - Decays stored rotation offsets each frame
 */
export function useAnimationLoop(refs, settings, interactionFns = {}) {
  const {
    rendererRef,
    sceneRef,
    cameraRef,
    animationIdRef,
    objectsRef,
    objectSpeedRef,
    orbSpeedRef,
  } = refs;
  const { animationStyle, cameraView } = settings;

  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    // Start the animation loop
    startAnimationLoop(
      rendererRef.current,
      sceneRef.current,
      cameraRef.current,
      animationIdRef,
      objectsRef,
      animationStyle,
      cameraView,
      interactionFns,
      objectSpeedRef,
      orbSpeedRef
    );

    // Cleanup - Cancel animation when effect re-runs or component unmounts
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [animationStyle, cameraView, interactionFns]);
}
