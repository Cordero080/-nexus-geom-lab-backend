import * as THREE from 'three';

export function initializeScene() {
  // Create the scene
  const scene = new THREE.Scene();

  // Add a simple gradient environment map for metallic reflections
  // This ensures metallic materials have something to reflect
  const pmremGenerator = new THREE.PMREMGenerator(new THREE.WebGLRenderer());
  pmremGenerator.compileEquirectangularShader();

  // Create a simple color gradient texture for environment
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x111111);

  // Use a basic CubeCamera to generate environment map
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
  const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
  scene.environment = cubeRenderTarget.texture;

  // Create the camera
  const camera = new THREE.PerspectiveCamera(
    40, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
  );
  camera.position.set(0, 0, 6);

  // Create the renderer with alpha: true for transparency
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  // Set clear color to transparent (but scene.background will override this when set)
  renderer.setClearColor(0x000000, 0);

  return { scene, camera, renderer };
}
