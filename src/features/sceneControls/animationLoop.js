export function startAnimationLoop(renderer, scene, camera, animationIdRef) {
  function animate() {
    animationIdRef.current = requestAnimationFrame(animate); // Schedule next frame
    renderer.render(scene, camera); // Render the current frame
  }
  animate(); // Start the loop
}
