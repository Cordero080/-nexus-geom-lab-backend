import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

/**
 * Creates a hypercube (tesseract) - 4D cube projected into 3D
 *
 * A tesseract has:
 * - 16 vertices (8 inner + 8 outer cube)
 * - 32 edges (12 per cube + 8 connecting edges)
 * - 24 square faces
 * - 8 cubic cells
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
/**
 * Creates a hypercube (tesseract) - 4D cube projected into 3D
 *
 * A tesseract has:
 * - 16 vertices (8 inner + 8 outer cube)
 * - 32 edges (12 per cube + 8 connecting edges)
 * - 24 square faces
 * - 8 cubic cells
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createHypercube(options = {}) {
  const parts = [];

  // Outer cube scale and inner cube scale (for 4D projection)
  const outerScale = 1.0;
  const innerScale = 0.5;

  // Create outer cube
  const outerCube = new THREE.BoxGeometry(outerScale * 2, outerScale * 2, outerScale * 2);
  parts.push(outerCube);

  // Create inner cube (representing 4D projection)
  const innerCube = new THREE.BoxGeometry(innerScale * 2, innerScale * 2, innerScale * 2);
  parts.push(innerCube);

  // Create 6 connecting frustum faces (one for each cube face)
  // These create the indented/concave appearance
  const halfOuter = outerScale;
  const halfInner = innerScale;

  // Helper function to create a frustum connecting outer face to inner face
  const createFrustumBetweenFaces = (axis, isPositive) => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    // Define the 4 corner vertices for outer and inner square faces
    let outerVerts, innerVerts;

    if (axis === 'z') {
      const zo = isPositive ? halfOuter : -halfOuter;
      const zi = isPositive ? halfInner : -halfInner;
      outerVerts = [
        new THREE.Vector3(-halfOuter, -halfOuter, zo),
        new THREE.Vector3(halfOuter, -halfOuter, zo),
        new THREE.Vector3(halfOuter, halfOuter, zo),
        new THREE.Vector3(-halfOuter, halfOuter, zo),
      ];
      innerVerts = [
        new THREE.Vector3(-halfInner, -halfInner, zi),
        new THREE.Vector3(halfInner, -halfInner, zi),
        new THREE.Vector3(halfInner, halfInner, zi),
        new THREE.Vector3(-halfInner, halfInner, zi),
      ];
    } else if (axis === 'x') {
      const xo = isPositive ? halfOuter : -halfOuter;
      const xi = isPositive ? halfInner : -halfInner;
      outerVerts = [
        new THREE.Vector3(xo, -halfOuter, -halfOuter),
        new THREE.Vector3(xo, -halfOuter, halfOuter),
        new THREE.Vector3(xo, halfOuter, halfOuter),
        new THREE.Vector3(xo, halfOuter, -halfOuter),
      ];
      innerVerts = [
        new THREE.Vector3(xi, -halfInner, -halfInner),
        new THREE.Vector3(xi, -halfInner, halfInner),
        new THREE.Vector3(xi, halfInner, halfInner),
        new THREE.Vector3(xi, halfInner, -halfInner),
      ];
    } else {
      // y
      const yo = isPositive ? halfOuter : -halfOuter;
      const yi = isPositive ? halfInner : -halfInner;
      outerVerts = [
        new THREE.Vector3(-halfOuter, yo, -halfOuter),
        new THREE.Vector3(halfOuter, yo, -halfOuter),
        new THREE.Vector3(halfOuter, yo, halfOuter),
        new THREE.Vector3(-halfOuter, yo, halfOuter),
      ];
      innerVerts = [
        new THREE.Vector3(-halfInner, yi, -halfInner),
        new THREE.Vector3(halfInner, yi, -halfInner),
        new THREE.Vector3(halfInner, yi, halfInner),
        new THREE.Vector3(-halfInner, yi, halfInner),
      ];
    }

    // Add vertices (outer then inner) with proper UVs
    outerVerts.forEach((v, i) => {
      positions.push(v.x, v.y, v.z);
      normals.push(0, 0, 1); // Placeholder, will be computed
      // Map to 0-1 UV space based on position in quad
      uvs.push(i === 0 || i === 3 ? 0 : 1, i < 2 ? 0 : 1);
    });
    innerVerts.forEach((v, i) => {
      positions.push(v.x, v.y, v.z);
      normals.push(0, 0, 1); // Placeholder, will be computed
      // Map to 0-1 UV space based on position in quad
      uvs.push(i === 0 || i === 3 ? 0 : 1, i < 2 ? 0 : 1);
    });

    // Create 4 quads (trapezoids) connecting the edges
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;

      // Outer edge indices
      const o1 = i;
      const o2 = next;

      // Inner edge indices (offset by 4)
      const i1 = i + 4;
      const i2 = next + 4;

      // Create two triangles for this trapezoid
      // Triangle 1: outer1 -> outer2 -> inner1
      indices.push(o1, o2, i1);
      // Triangle 2: outer2 -> inner2 -> inner1
      indices.push(o2, i2, i1);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  };

  // Create all 6 frustum faces
  parts.push(createFrustumBetweenFaces('z', true)); // Front (Z+)
  parts.push(createFrustumBetweenFaces('z', false)); // Back (Z-)
  parts.push(createFrustumBetweenFaces('x', true)); // Right (X+)
  parts.push(createFrustumBetweenFaces('x', false)); // Left (X-)
  parts.push(createFrustumBetweenFaces('y', true)); // Top (Y+)
  parts.push(createFrustumBetweenFaces('y', false)); // Bottom (Y-)

  // Merge all geometries
  console.log('Attempting to merge hypercube parts:', parts.length);
  parts.forEach((part, i) => {
    console.log(`Part ${i} attributes:`, Object.keys(part.attributes));
  });

  const mergedHypercube = mergeGeometries(parts);

  if (!mergedHypercube) {
    console.error('Failed to merge hypercube geometries!');
    // Return just the outer cube as fallback
    return parts[0];
  }

  console.log('Successfully merged hypercube');

  // Mark it as compound for wireframe builders
  mergedHypercube.userData.isCompound = true;
  mergedHypercube.userData.baseType = 'HypercubeGeometry';
  mergedHypercube.userData.isHypercube = true;
  mergedHypercube.userData.outerScale = outerScale;
  mergedHypercube.userData.innerScale = innerScale;

  return mergedHypercube;
}

/**
 * Metadata for the hypercube geometry
 */
export const metadata = {
  name: 'hypercube',
  displayName: '◻ Hypercube (Tesseract)',
  category: 'polytopes',
  description: '4D hypercube (tesseract) projected into 3D space',
  isCompound: true,
  defaultOptions: {},
};
