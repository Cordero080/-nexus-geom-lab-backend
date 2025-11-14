import { jest } from '@jest/globals';
import * as THREE from 'three';
import { createSolidMaterial, createWireframeMaterial } from './materialFactory';

// Mock THREE.MeshStandardMaterial
jest.mock('three', () => ({
  MeshStandardMaterial: jest.fn((config) => ({
    color: config.color || {},
    metalness: config.metalness || 0,
    roughness: config.roughness || 0,
    emissive: config.emissive || {},
    opacity: config.opacity || 1,
    transparent: config.transparent || false,
    side: config.side || 2,
  })),
  Color: jest.fn(function (hex) {
    this.hex = hex;
    this.multiplyScalar = jest.fn((scalar) => this);
    this.copy = jest.fn(() => this);
    return this;
  }),
  DoubleSide: 2,
}));

describe('Material Factory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSolidMaterial', () => {
    it('should create material with correct base color', () => {
      const config = {
        baseColor: '#ff00cc',
        metalness: 0.5,
        emissiveIntensity: 1.0,
        wireframeIntensity: 0,
      };

      const material = createSolidMaterial(config);

      expect(THREE.Color).toHaveBeenCalledWith('#ff00cc');
      expect(material.metalness).toBe(0.5);
    });

    it('should strip alpha channel from 8-character hex colors', () => {
      const config = {
        baseColor: '#ff00ccff',
        metalness: 0.7,
        emissiveIntensity: 0.5,
        wireframeIntensity: 0,
      };

      createSolidMaterial(config);

      expect(THREE.Color).toHaveBeenCalledWith('#ff00cc');
    });

    it('should calculate opacity from wireframeIntensity', () => {
      const config = {
        baseColor: '#00ffff',
        metalness: 0.5,
        emissiveIntensity: 1.0,
        wireframeIntensity: 50,
      };

      const material = createSolidMaterial(config);

      expect(material.opacity).toBe(0.5); // 1 - (50/100) = 0.5
      expect(material.transparent).toBe(true);
    });

    it('should set transparent based on opacity', () => {
      const config = {
        baseColor: '#00ffff',
        metalness: 0.5,
        emissiveIntensity: 1.0,
        wireframeIntensity: 0,
      };

      const material = createSolidMaterial(config);

      expect(material.opacity).toBe(1);
      // Solid material is always transparent to allow wireframe blending
      expect(material.transparent).toBe(true);
    });
  });

  describe('createWireframeMaterial', () => {
    it('should create wireframe material with correct opacity', () => {
      const config = {
        baseColor: '#ff00cc',
        metalness: 0.5,
        emissiveIntensity: 1.0,
        wireframeIntensity: 75,
      };

      const material = createWireframeMaterial(config);

      expect(material.opacity).toBe(0.75); // wireframeIntensity / 100
      expect(material.transparent).toBe(true);
    });

    it('should handle zero wireframe intensity', () => {
      const config = {
        baseColor: '#00ffff',
        metalness: 0.5,
        emissiveIntensity: 1.0,
        wireframeIntensity: 0,
      };

      const material = createWireframeMaterial(config);

      // Wireframe materials are always transparent
      expect(material.transparent).toBe(true);
    });

    it('should handle full wireframe intensity', () => {
      const config = {
        baseColor: '#00ffff',
        metalness: 0.5,
        emissiveIntensity: 1.0,
        wireframeIntensity: 100,
      };

      const material = createWireframeMaterial(config);

      expect(material.opacity).toBe(1);
      expect(material.transparent).toBe(true);
    });
  });
});
