import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

/**
 * Helper function to create a single hypercube with frustum faces
 * @param {number} outerScale - Scale of outer cube
 * @param {number} innerScale - Scale of inner cube
 * @param {THREE.Euler} rotation - Optional rotation to apply
 * @returns {THREE.BufferGeometry} Complete hypercube with outer, inner, and connecting frustum faces
 */
function createHypercubeWithFaces(outerScale, innerScale, rotation = null) {
  const parts = [];

  // Create outer cube
  const outerCube = new THREE.BoxGeometry(outerScale * 2, outerScale * 2, outerScale * 2);
  if (rotation) {
    outerCube.rotateX(rotation.x);
    outerCube.rotateY(rotation.y);
    outerCube.rotateZ(rotation.z);
  }
  parts.push(outerCube);

  // Create inner cube
  const innerCube = new THREE.BoxGeometry(innerScale * 2, innerScale * 2, innerScale * 2);
  if (rotation) {
    innerCube.rotateX(rotation.x);
    innerCube.rotateY(rotation.y);
    innerCube.rotateZ(rotation.z);
  }
  parts.push(innerCube);

  // Create 6 connecting frustum faces
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
      uvs.push(i === 0 || i === 3 ? 0 : 1, i < 2 ? 0 : 1);
    });
    innerVerts.forEach((v, i) => {
      positions.push(v.x, v.y, v.z);
      normals.push(0, 0, 1); // Placeholder, will be computed
      uvs.push(i === 0 || i === 3 ? 0 : 1, i < 2 ? 0 : 1);
    });

    // Create 4 quads (trapezoids) connecting the edges
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;

      const o1 = i;
      const o2 = next;
      const i1 = i + 4;
      const i2 = next + 4;

      // Create two triangles for this trapezoid
      indices.push(o1, o2, i1);
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
  const frustums = [
    createFrustumBetweenFaces('z', true), // Front (Z+)
    createFrustumBetweenFaces('z', false), // Back (Z-)
    createFrustumBetweenFaces('x', true), // Right (X+)
    createFrustumBetweenFaces('x', false), // Left (X-)
    createFrustumBetweenFaces('y', true), // Top (Y+)
    createFrustumBetweenFaces('y', false), // Bottom (Y-)
  ];

  // Apply rotation to frustums if specified
  if (rotation) {
    frustums.forEach((frustum) => {
      frustum.rotateX(rotation.x);
      frustum.rotateY(rotation.y);
      frustum.rotateZ(rotation.z);
    });
  }

  parts.push(...frustums);

  // Merge all parts
  return mergeGeometries(parts);
}

/**
 * Creates a 9-compound hypercube - nine interpenetrating hypercubes
 *
 * Each hypercube consists of:
 * - Outer cube
 * - Inner cube (representing 4D projection)
 * - 6 connecting frustum faces (creating concave indentations)
 *
 * The 9 hypercubes are arranged in a cube 9-compound configuration
 * with distinct rotations to create a beautiful symmetric structure.
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createNineCompoundHypercube(options = {}) {
  const outerScale = 1.0;
  const innerScale = 0.5;

  // Create 9-compound hypercube (cube 9-compound configuration)
  // These are the 9 distinct rotations that create a proper compound
  const hypercubes = [];

  // The 9 orientations for a cube 9-compound
  // Based on rotations around different axes to ensure visual distinction
  const rotations = [
    new THREE.Euler(0, 0, 0), // Identity
    new THREE.Euler(Math.PI / 4, 0, 0), // 45° X
    new THREE.Euler(0, Math.PI / 4, 0), // 45° Y
    new THREE.Euler(0, 0, Math.PI / 4), // 45° Z
    new THREE.Euler(Math.PI / 4, Math.PI / 4, 0), // 45° X+Y
    new THREE.Euler(Math.PI / 4, 0, Math.PI / 4), // 45° X+Z
    new THREE.Euler(0, Math.PI / 4, Math.PI / 4), // 45° Y+Z
    new THREE.Euler(Math.PI / 4, Math.PI / 4, Math.PI / 4), // 45° X+Y+Z
    new THREE.Euler(Math.PI / 3, Math.PI / 3, Math.PI / 3), // 60° all axes
  ];

  // Create all 9 hypercubes
  rotations.forEach((rotation) => {
    const hypercube = createHypercubeWithFaces(outerScale, innerScale, rotation);
    hypercubes.push(hypercube);
  });

  // Merge all 9 hypercubes
  console.log('Attempting to merge 9-compound hypercube parts');
  const mergedCpdHypercube = mergeGeometries(hypercubes);

  if (!mergedCpdHypercube) {
    console.error('Failed to merge 9-compound hypercube geometries!');
    return hypercubes[0];
  }

  console.log('Successfully merged 9-compound hypercube');

  // Recompute normals for proper lighting
  mergedCpdHypercube.computeVertexNormals();

  // Mark it as 9-compound hypercube for wireframe builders
  mergedCpdHypercube.userData.isCompound = true;
  mergedCpdHypercube.userData.baseType = 'HypercubeGeometry';
  mergedCpdHypercube.userData.is9CpdHypercube = true;
  mergedCpdHypercube.userData.outerScale = outerScale;
  mergedCpdHypercube.userData.innerScale = innerScale;
  mergedCpdHypercube.userData.compoundCount = 9; // 9-compound
  mergedCpdHypercube.userData.rotations = rotations; // Store all rotations for hyperframe

  return mergedCpdHypercube;
}

/**
 * Metadata for the 9-compound hypercube geometry
 */
export const metadata = {
  name: 'nineCompoundHypercube',
  displayName: '◻◻◻ 9Cpd-Hypercube',
  category: 'polytopes',
  description: 'Nine 4D hypercubes in a cube 9-compound configuration',
  isCompound: true,
  defaultOptions: {},
};
