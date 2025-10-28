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
 * Creates a compound mega tesseract - 8 tesseracts at cross angles
 *
 * This takes the mega-tesseract (4 tesseracts) and adds another 4 tesseracts
 * rotated at perpendicular angles to create a cross-compound structure:
 * - First mega set: 4 tesseracts (original rotations)
 * - Second mega set: 4 tesseracts (rotated 90° on X and Z axes)
 *
 * Each tesseract has outer cube, inner cube, and 6 connecting frustum faces.
 * Total: 8 complete 4D hypercubes merged at cross angles for maximum complexity.
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createCompoundMegaTesseract(options = {}) {
  // Scale factor: 88% of original (was 80%, now increased by 10%)
  const scale = 0.88;

  // FIRST MEGA SET - Original 4 tesseracts from mega-tesseract
  // Inner pair
  const mega1 = createTesseractWithFaces(0.75 * scale, 0.375 * scale, null);
  const mega2 = createTesseractWithFaces(
    0.75 * scale,
    0.375 * scale,
    Math.PI / 4
  );
  mega2.translate(0, 0.01, 0);

  // Outer pair
  const mega3 = createTesseractWithFaces(2.0 * scale, 1.5 * scale, Math.PI / 8);
  mega3.translate(0, 0.02, 0);
  const mega4 = createTesseractWithFaces(
    2.0 * scale,
    1.5 * scale,
    Math.PI / 8 + Math.PI / 4
  );
  mega4.translate(0, 0.03, 0);

  // SECOND MEGA SET - 4 tesseracts rotated at cross angles (90° perpendicular)
  // Rotate on X axis to create cross effect
  const cross1 = createTesseractWithFaces(
    0.75 * scale,
    0.375 * scale,
    Math.PI / 6
  );
  cross1.rotateX(Math.PI / 2); // 90° rotation on X
  cross1.translate(0, 0.04, 0);

  const cross2 = createTesseractWithFaces(
    0.75 * scale,
    0.375 * scale,
    Math.PI / 6 + Math.PI / 4
  );
  cross2.rotateX(Math.PI / 2);
  cross2.translate(0, 0.05, 0);

  // Larger cross pair - rotated on Z axis
  const cross3 = createTesseractWithFaces(
    2.0 * scale,
    1.5 * scale,
    Math.PI / 5
  );
  cross3.rotateZ(Math.PI / 2); // 90° rotation on Z
  cross3.translate(0, 0.06, 0);

  const cross4 = createTesseractWithFaces(
    2.0 * scale,
    1.5 * scale,
    Math.PI / 5 + Math.PI / 4
  );
  cross4.rotateZ(Math.PI / 2);
  cross4.translate(0, 0.07, 0);

  // Merge all EIGHT tesseracts into cross-compound structure
  const mergedCompoundMega = mergeGeometries(
    [mega1, mega2, mega3, mega4, cross1, cross2, cross3, cross4],
    false
  );

  // Recompute normals for proper lighting
  mergedCompoundMega.computeVertexNormals();

  // Mark it as compound mega tesseract for wireframe builders
  mergedCompoundMega.userData.isCompound = true;
  mergedCompoundMega.userData.baseType = "BoxGeometry";
  mergedCompoundMega.userData.isCompoundMegaTesseract = true;
  mergedCompoundMega.userData.isMegaTesseract = true; // Also mark as mega for hyperframe
  mergedCompoundMega.userData.componentCount = 8;

  return mergedCompoundMega;
}

/**
 * Metadata for the compound mega tesseract geometry
 */
export const metadata = {
  name: "cpd-megatesseract",
  displayName: "💎💎💎 Compound Mega-Tesseract",
  category: "polytopes",
  description:
    "Cross-compound mega-tesseract - 8 complete 4D hypercubes at perpendicular angles",
  isCompound: true,
  isSuperCompound: true,
  isUltraCompound: true,
  defaultOptions: {},
};
