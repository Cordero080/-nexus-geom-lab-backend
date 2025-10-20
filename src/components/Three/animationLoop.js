/**
 * Starts the animation loop for Three.js rendering.
 * @param {THREE.WebGLRenderer} renderer - The Three.js renderer
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {THREE.Camera} camera - The Three.js camera
 * @param {React.MutableRefObject} animationIdRef - Ref to store the animation ID
 */
export function startAnimationLoop(renderer, scene, camera, animationIdRef) {
  function animate() {
    animationIdRef.current = requestAnimationFrame(animate); // Schedule next frame
    renderer.render(scene, camera); // Render the current frame
  }
  animate(); // Start the loop
}
