import * as THREE from "three";
import {
  createSpectralOrbs,
  removeSpectralOrbs,
  updateSpectralOrbHue,
} from "./spectralOrbs";

// Track current environment and orb state per scene
const sceneState = new WeakMap();

export function updateEnvironment(scene, environment, hueShift = 0) {
  if (!scene) return;

  // Get or create state for this scene
  if (!sceneState.has(scene)) {
    sceneState.set(scene, { currentEnvironment: null, orbsCreated: false });
  }
  const state = sceneState.get(scene);

  // If environment changed, recreate everything
  if (state.currentEnvironment !== environment) {
    state.currentEnvironment = environment;
    state.orbsCreated = false;

    const createEnvironment = (envType) => {
      switch (envType) {
        case "nebula":
        case "matrix": {
          // Don't set scene.background - let CSS background show through
          scene.background = null;

          // Add spectral orbs with hue shift (NO lights, won't affect background)
          createSpectralOrbs(scene, 8, 4, hueShift);
          state.orbsCreated = true;
          break;
        }
        case "space": {
          const spaceCanvas = document.createElement("canvas");
          const spaceCtx = spaceCanvas.getContext("2d");
          spaceCanvas.width = 1024;
          spaceCanvas.height = 1024;
          const baseGrad = spaceCtx.createLinearGradient(
            0,
            0,
            0,
            spaceCanvas.height
          );
          baseGrad.addColorStop(0, "#0a0f1c");
          baseGrad.addColorStop(0.3, "#1a1a2e");
          baseGrad.addColorStop(0.7, "#16213ed9");
          baseGrad.addColorStop(1, "#0f0f23");
          spaceCtx.fillStyle = baseGrad;
          spaceCtx.fillRect(0, 0, spaceCanvas.width, spaceCanvas.height);
          scene.background = new THREE.CanvasTexture(spaceCanvas);

          // Remove orbs from other environments
          removeSpectralOrbs(scene);
          state.orbsCreated = false;
          break;
        }
        default:
          scene.background = null;
          removeSpectralOrbs(scene);
          state.orbsCreated = false;
      }
    };

    createEnvironment(environment);
  } else {
    // Same environment, just update hue of existing orbs
    if (
      state.orbsCreated &&
      (environment === "nebula" || environment === "matrix")
    ) {
      updateSpectralOrbHue(scene, hueShift);
    }
  }
}
