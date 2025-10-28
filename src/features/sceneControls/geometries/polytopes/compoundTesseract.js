import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Helper function to create a tesseract with connecting frustum faces between outer and inner cubes
 * @param {number} outerSize - Size of outer cube
 * @param {number} innerSize - Size of inner cube
 * @param {THREE.Euler} rotation - Optional rotation to apply
 * @returns {THREE.BufferGeometry} Complete tesseract with outer, inner, and connecting faces
 */
function createTesseractWithFaces(outerSize, innerSize, rotation = null) {
  const geometries = [];

  // Outer cube
  const outer = new THREE.BoxGeometry(outerSize, outerSize, outerSize);
  if (rotation) outer.rotateY(rotation);
  geometries.push(outer);

  // Inner cube
  const inner = new THREE.BoxGeometry(innerSize, innerSize, innerSize);
  if (rotation) inner.rotateY(rotation);
  inner.translate(0, 0.01, 0); // Slight offset to prevent z-fighting
  geometries.push(inner);

  // Create 6 connecting frustums (one for each face of the cube)
  // Each frustum connects a face of the outer cube to the corresponding face of the inner cube
  const halfOuter = outerSize / 2;
  const halfInner = innerSize / 2;
  const depth = (outerSize - innerSize) / 2;

  // Top face frustum (Y+)
  const topFrustum = new THREE.CylinderGeometry(halfInner, halfOuter, depth, 4);
  topFrustum.rotateY(Math.PI / 4); // Align square cross-section
  topFrustum.translate(0, halfOuter + depth / 2, 0);
  if (rotation) topFrustum.rotateY(rotation);
  geometries.push(topFrustum);

  // Bottom face frustum (Y-)
  const bottomFrustum = new THREE.CylinderGeometry(
    halfOuter,
    halfInner,
    depth,
    4
  );
  bottomFrustum.rotateY(Math.PI / 4);
  bottomFrustum.translate(0, -(halfOuter + depth / 2), 0);
  if (rotation) bottomFrustum.rotateY(rotation);
  geometries.push(bottomFrustum);

  // Front face frustum (Z+)
  const frontFrustum = new THREE.CylinderGeometry(
    halfInner,
    halfOuter,
    depth,
    4
  );
  frontFrustum.rotateY(Math.PI / 4);
  frontFrustum.rotateX(Math.PI / 2);
  frontFrustum.translate(0, 0, halfOuter + depth / 2);
  if (rotation) frontFrustum.rotateY(rotation);
  geometries.push(frontFrustum);

  // Back face frustum (Z-)
  const backFrustum = new THREE.CylinderGeometry(
    halfOuter,
    halfInner,
    depth,
    4
  );
  backFrustum.rotateY(Math.PI / 4);
  backFrustum.rotateX(Math.PI / 2);
  backFrustum.translate(0, 0, -(halfOuter + depth / 2));
  if (rotation) backFrustum.rotateY(rotation);
  geometries.push(backFrustum);

  // Right face frustum (X+)
  const rightFrustum = new THREE.CylinderGeometry(
    halfInner,
    halfOuter,
    depth,
    4
  );
  rightFrustum.rotateY(Math.PI / 4);
  rightFrustum.rotateZ(Math.PI / 2);
  rightFrustum.translate(halfOuter + depth / 2, 0, 0);
  if (rotation) rightFrustum.rotateY(rotation);
  geometries.push(rightFrustum);

  // Left face frustum (X-)
  const leftFrustum = new THREE.CylinderGeometry(
    halfOuter,
    halfInner,
    depth,
    4
  );
  leftFrustum.rotateY(Math.PI / 4);
  leftFrustum.rotateZ(Math.PI / 2);
  leftFrustum.translate(-(halfOuter + depth / 2), 0, 0);
  if (rotation) leftFrustum.rotateY(rotation);
  geometries.push(leftFrustum);

  return mergeGeometries(geometries, false);
}

/**
 * Creates a compound tesseract (4D hypercube) - two interpenetrating tesseracts
 *
 * Each tesseract consists of:
 * - Outer cube
 * - Inner cube
 * - 6 connecting frustum faces (representing 4D depth)
 *
 * The second tesseract is rotated 45° to create a compound 4D structure,
 * simulating rotation in the 4th dimension.
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createCompoundTesseract(options = {}) {
  // First tesseract with connecting faces
  const tesseract1 = createTesseractWithFaces(1.5, 0.75, null);

  // Second tesseract rotated 45° on Y axis (simulates 4D rotation)
  const tesseract2 = createTesseractWithFaces(1.5, 0.75, Math.PI / 4);
  tesseract2.translate(0, 0.02, 0); // Slight offset to prevent z-fighting

  // Merge both complete tesseracts
  const mergedCpdTesseract = mergeGeometries([tesseract1, tesseract2], false);

  // Recompute normals for proper lighting
  mergedCpdTesseract.computeVertexNormals();

  // Mark it as compound tesseract for wireframe builders
  mergedCpdTesseract.userData.isCompound = true;
  mergedCpdTesseract.userData.baseType = "BoxGeometry";
  mergedCpdTesseract.userData.isCpdTesseract = true; // Flag for compound tesseract

  return mergedCpdTesseract;
}

/**
 * Metadata for the compound tesseract geometry
 */
export const metadata = {
  name: "box",
  displayName: "📦 Compound Tesseract",
  category: "polytopes",
  description: "Two 4D hypercubes interpenetrating - simulates 4D rotation",
  isCompound: true,
  defaultOptions: {},
};
