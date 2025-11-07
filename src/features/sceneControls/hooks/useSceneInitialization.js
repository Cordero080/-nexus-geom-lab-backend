import { useEffect } from "react";
import { initializeScene } from "../sceneSetup";
import { initializeLighting } from "../lightingSetup";

/**
 * Initializes the Three.js scene, camera, renderer, and lighting
 * Runs once on component mount
 *
 * @param {Object} refs - References to Three.js objects
 * @param {Object} refs.sceneRef - Reference to store the scene
 * @param {Object} refs.cameraRef - Reference to store the camera
 * @param {Object} refs.rendererRef - Reference to store the renderer
 * @param {Object} refs.mountRef - Reference to the DOM element to mount the canvas
 * @param {Object} refs.ambientLightRef - Reference to store ambient light
 * @param {Object} refs.directionalLightRef - Reference to store directional light
 * @param {Object} refs.animationIdRef - Reference to store animation frame ID
 * @param {Object} lightingProps - Lighting configuration
 * @param {string} lightingProps.ambientLightColor - Ambient light color hex
 * @param {number} lightingProps.ambientLightIntensity - Ambient light intensity
 * @param {string} lightingProps.directionalLightColor - Directional light color hex
 * @param {number} lightingProps.directionalLightIntensity - Directional light intensity
 * @param {number} lightingProps.directionalLightX - Directional light X position
 * @param {number} lightingProps.directionalLightY - Directional light Y position
 * @param {number} lightingProps.directionalLightZ - Directional light Z position
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
