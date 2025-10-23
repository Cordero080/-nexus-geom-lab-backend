import * as THREE from "three";
import { createSpectralOrbs, removeSpectralOrbs } from "./spectralOrbs";

export function updateEnvironment(scene, environment) {
  if (!scene) return;

  const createEnvironment = (envType) => {
    switch (envType) {
      case "nebula":
      case "matrix": {
        // Don't set scene.background - let CSS background show through
        scene.background = null;

        // Add spectral orbs (NO lights, won't affect background)
        createSpectralOrbs(scene, 8, 4);
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
        break;
      }
      default:
        scene.background = null;
        removeSpectralOrbs(scene);
    }
  };

  createEnvironment(environment);
}
