import { jest } from "@jest/globals";
import * as THREE from "three";
import { initializeScene } from "./features/sceneControls/setup/sceneSetup";

// Mock Three.js classes and methods
jest.mock("three", () => ({
  WebGLRenderer: jest.fn(() => ({
    domElement: {
      getContext: jest.fn(),
      style: {},
    },
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
    setClearColor: jest.fn(),
    shadowMap: { enabled: false, type: 0 },
    toneMapping: 0,
    toneMappingExposure: 1.0,
  })),
  Scene: jest.fn(() => ({
    add: jest.fn(),
    children: [],
    background: null,
    environment: null,
  })),
  PerspectiveCamera: jest.fn(() => ({
    position: { set: jest.fn() },
  })),
  PMREMGenerator: jest.fn(() => ({
    compileEquirectangularShader: jest.fn(),
    fromScene: jest.fn(),
    dispose: jest.fn(),
  })),
  WebGLCubeRenderTarget: jest.fn(() => ({
    texture: {},
  })),
  CubeCamera: jest.fn(() => ({})),
  Color: jest.fn(() => ({})),
  AmbientLight: jest.fn(),
  DirectionalLight: jest.fn(),
  PCFSoftShadowMap: 2,
  ACESFilmicToneMapping: 1,
}));

describe("initializeScene", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a scene, camera, and renderer", () => {
    const result = initializeScene();

    // Verify WebGLRenderer was instantiated (called twice: once for PMREMGenerator, once for main renderer)
    expect(THREE.WebGLRenderer).toHaveBeenCalled();

    // Verify Scene was created (called twice: main scene + environment scene)
    expect(THREE.Scene).toHaveBeenCalled();

    // Verify PerspectiveCamera was created
    expect(THREE.PerspectiveCamera).toHaveBeenCalledWith(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Verify camera position was set
    const cameraInstance = THREE.PerspectiveCamera.mock.results[0].value;
    expect(cameraInstance.position.set).toHaveBeenCalledWith(0, 0, 6);

    // Verify PMREMGenerator was created for environment mapping
    expect(THREE.PMREMGenerator).toHaveBeenCalled();

    // Verify WebGLCubeRenderTarget was created
    expect(THREE.WebGLCubeRenderTarget).toHaveBeenCalledWith(256);

    // Verify CubeCamera was created
    expect(THREE.CubeCamera).toHaveBeenCalledWith(0.1, 1000, expect.anything());

    // Verify renderer configuration
    const rendererInstance = THREE.WebGLRenderer.mock.results[1].value; // Second call is main renderer
    expect(rendererInstance.setSize).toHaveBeenCalledWith(
      window.innerWidth,
      window.innerHeight
    );
    expect(rendererInstance.setClearColor).toHaveBeenCalledWith(0x000000, 0);
    expect(rendererInstance.shadowMap.enabled).toBe(true);
    expect(rendererInstance.toneMappingExposure).toBe(1.0);

    // Verify the returned objects
    expect(result).toHaveProperty("scene");
    expect(result).toHaveProperty("camera");
    expect(result).toHaveProperty("renderer");
  });
});
