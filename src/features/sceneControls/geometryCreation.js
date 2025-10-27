import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Create a tesseract with connecting frustum faces between outer and inner cubes
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

export function createGeometry(type = "icosahedron") {
  switch (type) {
    case "icosahedron":
      // Create compound icosahedron - two merged together
      const ico1 = new THREE.IcosahedronGeometry();
      const ico2 = new THREE.IcosahedronGeometry();

      // Rotate second icosahedron to create stella octangula / merkaba effect
      ico2.rotateX(Math.PI / 2);
      ico2.rotateY(Math.PI / 6);

      // Merge the two geometries
      const mergedIco = mergeGeometries([ico1, ico2]);
      // Mark it as compound for wireframe builders
      mergedIco.userData.isCompound = true;
      mergedIco.userData.baseType = "IcosahedronGeometry";

      return mergedIco;
    case "sphere":
      return new THREE.SphereGeometry(1, 16, 16);
    case "cube":
      // Simple cube (BoxGeometry) for classic cube shape
      // Kept separate from "box" which represents the compound tesseract variant
      return new THREE.BoxGeometry(1.5, 1.5, 1.5);
    case "box":
      // COMPOUND TESSERACT (was "hypercube") - two 4D hypercubes interpenetrating
      // Each tesseract has outer cube, inner cube, AND 6 connecting frustum faces
      // Second tesseract rotated 45° to create compound 4D structure

      // First tesseract with connecting faces
      const tesseract1 = createTesseractWithFaces(1.5, 0.75, null);

      // Second tesseract rotated 45° on Y axis (simulates 4D rotation)
      const tesseract2 = createTesseractWithFaces(1.5, 0.75, Math.PI / 4);
      tesseract2.translate(0, 0.02, 0); // Slight offset to prevent z-fighting

      // Merge both complete tesseracts
      const mergedCpdTesseract = mergeGeometries(
        [tesseract1, tesseract2],
        false
      );

      // Recompute normals for proper lighting
      mergedCpdTesseract.computeVertexNormals();

      // Mark it as compound tesseract for wireframe builders
      mergedCpdTesseract.userData.isCompound = true;
      mergedCpdTesseract.userData.baseType = "BoxGeometry";
      mergedCpdTesseract.userData.isCpdTesseract = true; // Flag for compound tesseract

      return mergedCpdTesseract;
    case "hypercube":
      // OLD HYPERCUBE (simple concentric cubes) - kept for reference
      // Use "box" for the new compound tesseract instead
      const outerCube = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const innerCube = new THREE.BoxGeometry(0.75, 0.75, 0.75);
      innerCube.translate(0, 0.02, 0);
      const mergedBox = mergeGeometries([outerCube, innerCube], false);
      mergedBox.computeVertexNormals();
      mergedBox.userData.isCompound = true;
      mergedBox.userData.baseType = "BoxGeometry";
      mergedBox.userData.isHypercube = true;
      return mergedBox;
    case "cpdtesseract":
      // ALIAS to "box" case - keeping for backward compatibility
      // Just return the same compound tesseract structure
      return createGeometry("box");
    case "octahedron":
      // Create compound octahedron - two merged at 45° rotation
      const oct1 = new THREE.OctahedronGeometry();
      const oct2 = new THREE.OctahedronGeometry();

      // Rotate second octahedron 45° on Y axis for compound effect
      oct2.rotateY(Math.PI / 4);

      // Slight vertical offset to prevent z-fighting on overlapping faces
      oct2.translate(0, 0.02, 0);

      // Merge the two geometries
      const mergedOct = mergeGeometries([oct1, oct2], false);

      // Recompute normals for proper lighting
      mergedOct.computeVertexNormals();

      // Mark it as compound for wireframe builders
      mergedOct.userData.isCompound = true;
      mergedOct.userData.baseType = "OctahedronGeometry";

      return mergedOct;
    case "tetrahedron":
      // Create compound tetrahedron (stella octangula) - two interpenetrating tetrahedrons
      const tet1 = new THREE.TetrahedronGeometry(1.2);
      const tet2 = new THREE.TetrahedronGeometry(1.2);

      // Invert second tetrahedron by scaling -1 on all axes (creates true dual tetrahedron)
      tet2.scale(-1, -1, -1);

      // Slight vertical offset to prevent z-fighting on overlapping faces
      tet2.translate(0, 0.02, 0);

      // Merge the two geometries
      const mergedTet = mergeGeometries([tet1, tet2], false);

      // Recompute normals for proper lighting
      mergedTet.computeVertexNormals();

      // Mark it as compound for wireframe builders
      mergedTet.userData.isCompound = true;
      mergedTet.userData.baseType = "TetrahedronGeometry";

      return mergedTet;
    case "torusknot":
      return new THREE.TorusKnotGeometry(1, 0.2, 150, 16);
    default:
      return new THREE.IcosahedronGeometry();
  }
}
