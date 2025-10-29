import { jest } from "@jest/globals";
import * as THREE from "three";
import { initializeScene } from "./features/sceneControls/sceneSetup";

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
  })),
  Scene: jest.fn(() => ({ add: jest.fn(), children: [] })),
  PerspectiveCamera: jest.fn(() => ({
    position: { set: jest.fn() },
  })),
  AmbientLight: jest.fn(),
  DirectionalLight: jest.fn(),
  PCFSoftShadowMap: 2,
}));

describe("initializeScene", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a scene, camera, and renderer", () => {
    const result = initializeScene();

    // Verify WebGLRenderer was instantiated
    expect(THREE.WebGLRenderer).toHaveBeenCalledTimes(1);

    // Verify renderer methods were called
    const mockRendererInstance = THREE.WebGLRenderer.mock.results[0].value;
    expect(mockRendererInstance.setSize).toHaveBeenCalled();
    expect(mockRendererInstance.shadowMap.enabled).toBe(true);

    // Verify the returned objects
    expect(result).toHaveProperty("scene");
    expect(result).toHaveProperty("camera");
    expect(result).toHaveProperty("renderer");
  });
});
