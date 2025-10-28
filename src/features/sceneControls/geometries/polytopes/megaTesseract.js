import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Helper function to create a tesseract with connecting frustum faces
 *
 * Creates a complete tesseract (4D hypercube) with:
 * - Outer cube
 * - Inner cube
 * - 6 connecting frustum faces (one for each cube face)
 *
 * @param {number} outerSize - Size of outer cube
 * @param {number} innerSize - Size of inner cube
 * @param {number} rotation - Optional rotation to apply (in radians)
 * @returns {THREE.BufferGeometry} Complete tesseract
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
  const halfOuter = outerSize / 2;
  const halfInner = innerSize / 2;
  const depth = (outerSize - innerSize) / 2;

  // Top face frustum (Y+)
  const topFrustum = new THREE.CylinderGeometry(halfInner, halfOuter, depth, 4);
  topFrustum.rotateY(Math.PI / 4);
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
 * Creates a mega tesseract - compound tesseract with outer encasing layer
 *
 * This is a scaled-down version of the compound tesseract with an additional
 * outer layer, creating a 4-layer structure:
 * - Inner pair: Two smaller tesseracts (compound)
 * - Outer pair: Two larger encasing tesseracts
 *
 * Each tesseract has outer cube, inner cube, and 6 connecting frustum faces.
 * Total: 4 complete tesseracts merged together.
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createMegaTesseract(options = {}) {
  // INNER PAIR - First tesseract with connecting faces (SMALLER)
  const megaTess1 = createTesseractWithFaces(0.75, 0.375, null);

  // Second tesseract rotated 45° on Y axis (simulates 4D rotation)
  const megaTess2 = createTesseractWithFaces(0.75, 0.375, Math.PI / 4);
  megaTess2.translate(0, 0.01, 0); // Slight offset to prevent z-fighting

  // OUTER PAIR - Larger encasing layer
  const megaTess3 = createTesseractWithFaces(2.0, 1.5, Math.PI / 8);
  megaTess3.translate(0, 0.02, 0);

  const megaTess4 = createTesseractWithFaces(
    2.0,
    1.5,
    Math.PI / 8 + Math.PI / 4
  );
  megaTess4.translate(0, 0.03, 0);

  // Merge all four tesseracts
  const mergedMegaTesseract = mergeGeometries(
    [megaTess1, megaTess2, megaTess3, megaTess4],
    false
  );

  // Recompute normals for proper lighting
  mergedMegaTesseract.computeVertexNormals();

  // Mark it as mega tesseract for wireframe builders
  mergedMegaTesseract.userData.isCompound = true;
  mergedMegaTesseract.userData.baseType = "BoxGeometry";
  mergedMegaTesseract.userData.isMegaTesseract = true;
  mergedMegaTesseract.userData.componentCount = 4;

  return mergedMegaTesseract;
}

/**
 * Metadata for the mega tesseract geometry
 */
export const metadata = {
  name: "cpdtesseract",
  displayName: "📦📦 Mega Tesseract",
  category: "polytopes",
  description:
    "4-layer compound tesseract with outer encasing - 4 complete 4D hypercubes merged",
  isCompound: true,
  isSuperCompound: true,
  defaultOptions: {},
};
