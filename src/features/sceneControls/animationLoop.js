import { animateSpectralOrbs } from "./spectralOrbs";

export function startAnimationLoop(renderer, scene, camera, animationIdRef) {
  let lastTime = performance.now();

  function animate() {
    animationIdRef.current = requestAnimationFrame(animate); // Schedule next frame

    // Calculate delta time
    const currentTime = performance.now();
    const delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Animate orbs
    animateSpectralOrbs(delta);

    renderer.render(scene, camera); // Render the current frame
  }
  animate(); // Start the loop
}
