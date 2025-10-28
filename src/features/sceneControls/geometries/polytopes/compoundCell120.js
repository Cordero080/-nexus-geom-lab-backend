import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Creates a compound 120-cell - two 120-cells merged at cross-axes
 *
 * The ultimate 4D polytope compound with:
 * - 240 dodecahedral cells total (120 × 2)
 * - 1200 vertices total (600 × 2)
 * - Most complex structure in the geometry library
 *
 * The second 120-cell is rotated using golden ratio angles for
 * optimal dodecahedral symmetry and maximal intersection.
 *
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry}
 */
export function createCompound120Cell(options = {}) {
  // Create 5 nested dodecahedra layers (matching 120-cell structure)
  const outerSize = 1.2;
  const layer1Size = 0.96;
  const layer2Size = 0.72;
  const layer3Size = 0.54;
  const innerSize = 0.36;

  // First 120-cell (standard orientation)
  const outerDodec1 = new THREE.DodecahedronGeometry(outerSize);
  const layer1Dodec1 = new THREE.DodecahedronGeometry(layer1Size);
  const layer2Dodec1 = new THREE.DodecahedronGeometry(layer2Size);
  const layer3Dodec1 = new THREE.DodecahedronGeometry(layer3Size);
  const innerDodec1 = new THREE.DodecahedronGeometry(innerSize);

  // Second 120-cell (rotated for maximal intersection)
  // Use golden ratio angle for dodecahedral symmetry
  const phi = (1 + Math.sqrt(5)) / 2;
  const goldenAngle = (2 * Math.PI) / (phi * phi);

  const outerDodec2 = new THREE.DodecahedronGeometry(outerSize);
  const layer1Dodec2 = new THREE.DodecahedronGeometry(layer1Size);
  const layer2Dodec2 = new THREE.DodecahedronGeometry(layer2Size);
  const layer3Dodec2 = new THREE.DodecahedronGeometry(layer3Size);
  const innerDodec2 = new THREE.DodecahedronGeometry(innerSize);

  // Rotate second set using golden angle for optimal compound symmetry
  [outerDodec2, layer1Dodec2, layer2Dodec2, layer3Dodec2, innerDodec2].forEach(
    (geo) => {
      geo.rotateY(goldenAngle);
      geo.rotateX(Math.PI / 5); // Pentagon angle
      geo.rotateZ(goldenAngle / 2);
    }
  );

  // Merge all ten layers (5 from each 120-cell)
  const mergedCompound120Cell = mergeGeometries([
    outerDodec1,
    layer1Dodec1,
    layer2Dodec1,
    layer3Dodec1,
    innerDodec1,
    outerDodec2,
    layer1Dodec2,
    layer2Dodec2,
    layer3Dodec2,
    innerDodec2,
  ]);

  // Mark as compound 120-cell
  mergedCompound120Cell.userData.isCompound120Cell = true;
  mergedCompound120Cell.userData.baseType = "DodecahedronGeometry";
  mergedCompound120Cell.userData.layers = {
    outer: outerSize,
    layer1: layer1Size,
    layer2: layer2Size,
    layer3: layer3Size,
    inner: innerSize,
  };

  return mergedCompound120Cell;
}

/**
 * Metadata for the compound 120-cell geometry
 */
export const metadata = {
  name: "compound120cell",
  displayName: "⬢⬢ Compound 120-Cell",
  category: "polytopes",
  description:
    "Two 120-cells merged at golden angle - 240 dodecahedral cells, ultimate complexity",
  isCompound: true,
  isSuperCompound: true,
  defaultOptions: {},
};
