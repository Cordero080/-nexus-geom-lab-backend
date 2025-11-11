import { useEffect } from "react";
import { initializeScene } from "../../threeSetup/sceneSetup";
import { initializeLighting } from "../../threeSetup/lightingSetup";

/**
 * CORE INFRASTRUCTURE HOOK - Initializes Three.js scene on component mount
 *
 * What it does:
 * 1. Calls threeSetup/ functions to create Three.js objects (scene, camera, renderer, lights)
 * 2. Stores Three.js objects in refs so other hooks can access/modify them
 * 3. Adds renderer canvas to DOM
 * 4. Sets up window resize listener to keep canvas responsive
 * 5. Cleans up on unmount (removes listeners, disposes renderer)
 *
 * Why it matters:
 * - This is the React→Three.js bridge - where state values become 3D objects
 * - Runs ONCE on mount (empty dependency array)
 * - All other hooks depend on these refs being populated
 *
 * @param {Object} refs - Empty ref containers to fill with Three.js objects
 * @param {Object} lightingProps - Current state values for lighting (color, intensity, position)
 */
export function useSceneInitialization(refs, lightingProps) {
  const {
    sceneRef,
    cameraRef,
    rendererRef,
    mountRef,
    ambientLightRef,
    directionalLightRef,
    animationIdRef,
  } = refs;

  const {
    ambientLightColor,
    ambientLightIntensity,
    directionalLightColor,
    directionalLightIntensity,
    directionalLightX,
    directionalLightY,
    directionalLightZ,
  } = lightingProps;

  useEffect(() => {
    // 1. CREATE SCENE - The 3D world container
    const { scene, camera, renderer } = initializeScene();
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Store camera reference in scene.userData for particle systems
    scene.userData.camera = camera;

    // 2. CREATE LIGHTS - Using current prop values
    const {
      ambientLight,
      directionalLight,
      directionalLight2,
      hemisphereLight,
      pointLight1,
      rectLight,
    } = initializeLighting({
      ambientLightColor,
      ambientLightIntensity,
      directionalLightColor,
      directionalLightIntensity,
      directionalLightPosition: {
        x: directionalLightX,
        y: directionalLightY,
        z: directionalLightZ,
      },
    });

    // Store lights in refs so we can update them later
    ambientLightRef.current = ambientLight;
    directionalLightRef.current = directionalLight;

    // Add lights to the scene
    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.add(directionalLight2);
    scene.add(hemisphereLight);
    scene.add(pointLight1);
    scene.add(rectLight);

    // 3. HANDLE WINDOW RESIZE - Keep canvas matching screen size

    // 3. HANDLE WINDOW RESIZE - Keep canvas matching screen size
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 4. CLEANUP FUNCTION - Runs when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []); // Empty dependency array = run once on mount
}
