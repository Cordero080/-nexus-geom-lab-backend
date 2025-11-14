import { useEffect } from 'react';
import { startAnimationLoop } from '../../animation/animationLoop';

/**
 * USER INTERACTION HOOK - Main animation loop (runs last!)
 *
 * What it does:
 * 1. Starts the requestAnimationFrame loop
 * 2. Renders scene every frame
 * 3. Applies animation styles (orbital, chaotic, static, etc)
 * 4. Handles user rotation overrides from mouse interactions
 * 5. Stores animation ID for cleanup
 *
 * Why it matters:
 * - This is what makes everything move!
 * - MUST run AFTER all other hooks (needs objects/lights to exist)
 * - Cancels animation on unmount to prevent memory leaks
 * - Restarts when animation style or camera view changes
 *
 * @param {Object} refs - All Three.js object references
 * @param {Object} settings - Animation settings (style, view, speeds)
 * @param {Object} interactionFns - Functions for user rotation overrides
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
