import * as THREE from "three";

export function updateEnvironment(scene, environment) {
  if (!scene) return;

  const createEnvironment = (envType) => {
    switch (envType) {
      case "nebula": {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = 512;
        canvas.height = 512;
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#090033ff");
        gradient.addColorStop(0.3, "#45146bff");
        gradient.addColorStop(0.7, "#980ae4cd");
        gradient.addColorStop(1, "#033867ff");
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        scene.background = new THREE.CanvasTexture(canvas);
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
        break;
      }
      default:
        scene.background = new THREE.Color(0x000000);
    }
  };

  createEnvironment(environment);
}
