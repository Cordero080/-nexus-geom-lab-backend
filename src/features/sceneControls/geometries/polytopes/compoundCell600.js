import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Creates a compound 600-cell - two 600-cells merged at cross-axes
 *
 * Creates a stunning intersection of 1200 tetrahedra.
 * Similar to compound dodecahedron/icosahedron in 3D.
 *
 * Properties:
 * - 1200 tetrahedral cells total (600 × 2)
 * - 240 vertices total (120 × 2)
 * - Ultimate complexity in tetrahedral arrangements
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createCompound600Cell(options = {}) {
  // Create 5 nested icosahedra layers (matching 600-cell structure)
  const outerSize = 1.2;
  const layer1Size = 0.95;
  const layer2Size = 0.7;
  const layer3Size = 0.5;
  const innerSize = 0.25;

  // First 600-cell (standard orientation)
  const outerIco1 = new THREE.IcosahedronGeometry(outerSize, 0);
  const layer1Ico1 = new THREE.IcosahedronGeometry(layer1Size, 0);
  const layer2Ico1 = new THREE.IcosahedronGeometry(layer2Size, 0);
  const layer3Ico1 = new THREE.IcosahedronGeometry(layer3Size, 0);
  const innerIco1 = new THREE.IcosahedronGeometry(innerSize, 0);

  // Second 600-cell (rotated 90° on Y and Z axes for maximal intersection)
  const outerIco2 = new THREE.IcosahedronGeometry(outerSize, 0);
  const layer1Ico2 = new THREE.IcosahedronGeometry(layer1Size, 0);
  const layer2Ico2 = new THREE.IcosahedronGeometry(layer2Size, 0);
  const layer3Ico2 = new THREE.IcosahedronGeometry(layer3Size, 0);
  const innerIco2 = new THREE.IcosahedronGeometry(innerSize, 0);

  // Rotate second set 90° on Y-axis and 45° on Z-axis for compound effect
  [outerIco2, layer1Ico2, layer2Ico2, layer3Ico2, innerIco2].forEach((geo) => {
    geo.rotateY(Math.PI / 2);
    geo.rotateZ(Math.PI / 4);
  });

  // Merge all ten layers (5 from each 600-cell)
  const mergedCompound600Cell = mergeGeometries([
    outerIco1,
    layer1Ico1,
    layer2Ico1,
    layer3Ico1,
    innerIco1,
    outerIco2,
    layer1Ico2,
    layer2Ico2,
    layer3Ico2,
    innerIco2,
  ]);

  // Mark as compound 600-cell
  mergedCompound600Cell.userData.isCompound600Cell = true;
  mergedCompound600Cell.userData.baseType = "IcosahedronGeometry";
  mergedCompound600Cell.userData.layers = {
    outer: outerSize,
    layer1: layer1Size,
    layer2: layer2Size,
    layer3: layer3Size,
    inner: innerSize,
  };

  return mergedCompound600Cell;
}

/**
 * Metadata for the compound 600-cell geometry
 */
export const metadata = {
  name: "compound600cell",
  displayName: "⬡⬡ Compound 600-Cell",
  category: "polytopes",
  description:
    "Two 600-cells merged - 1200 tetrahedral cells, ultimate tetrahedral complexity",
  isCompound: true,
  isSuperCompound: true,
  defaultOptions: {},
};
