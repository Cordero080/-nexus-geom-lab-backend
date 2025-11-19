import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils';

// Geometry modules
import { createCompoundFloatingCity } from '../geometries/curved/compoundFloatingCity.js';
import { createCompoundSphere } from '../geometries/compound/compoundSphere.js';
import { createHessianPolychoron } from '../geometries/polytopes/hessianPolychoron.js';
import { createSphere } from '../geometries/compound/sphere.js';
import { createIcosahedron } from '../geometries/polytopes/icosahedron.js';
import { createCompoundTesseract } from '../geometries/polytopes/compoundTesseract.js';
import { createQuantumManifold } from '../geometries/manifolds/quantumManifold.js';
import { createCompoundQuantumManifold } from '../geometries/manifolds/compoundQuantumManifold.js';
import { createOctahedron } from '../geometries/polytopes/octahedron.js';
import { createTetrahedron } from '../geometries/polytopes/tetrahedron.js';
import { create120Cell } from '../geometries/polytopes/cell120.js';
import { createCompound120Cell } from '../geometries/polytopes/compoundCell120.js';
import { create24Cell } from '../geometries/polytopes/cell24.js';
import { createCompound24Cell } from '../geometries/polytopes/compoundCell24.js';
import { create16Cell } from '../geometries/polytopes/cell16.js';
import { create600Cell } from '../geometries/polytopes/cell600.js';
import { createCompound600Cell } from '../geometries/polytopes/compoundCell600.js';
import { createMobiusSphere } from '../geometries/manifolds/mobiusSphere.js';
import { createMegaTesseract } from '../geometries/polytopes/megaTesseract.js';
import { createCompoundMegaTesseract } from '../geometries/polytopes/compoundMegaTesseract.js';
import { createCompoundMegaTesseractNested } from '../geometries/polytopes/compoundMegaTesseract2.js';
import { createCompoundMegaTesseractExperimental } from '../geometries/polytopes/compoundMegaTesseract3.js';
import { createCompoundMegaTesseractAxisShift } from '../geometries/polytopes/compoundMegaTesseract4.js';
import { createSimpleCompoundHypercube } from '../geometries/polytopes/simpleCompoundHypercube.js';
import { createCompoundHypercube } from '../geometries/polytopes/compoundHypercube.js';

export function createGeometry(type = 'icosahedron', options = {}) {
  switch (type) {
    case 'quantummanifold':
      // Use modular geometry - see geometries/manifolds/quantumManifold.js
      return createQuantumManifold(options.quantummanifold || options);

    case 'compoundquantummanifold':
      // Use modular geometry - see geometries/manifolds/compoundQuantumManifold.js
      return createCompoundQuantumManifold(options.quantummanifold || options);

    case 'icosahedron':
      // Use modular geometry - see geometries/polytopes/icosahedron.js
      return createIcosahedron(options);

    case 'sphere':
      // Use modular geometry - see geometries/compound/sphere.js
      return createSphere(options);

    case 'compoundsphere':
      // Use modular geometry - see geometries/compound/compoundSphere.js
      return createCompoundSphere(options);

    case 'compoundfloatingcity':
      // Use modular geometry - see geometries/curved/compoundFloatingCity.js
      return createCompoundFloatingCity(options);

    case 'simplecpdhypercube':
      // Use modular geometry - see geometries/polytopes/simpleCompoundHypercube.js
      return createSimpleCompoundHypercube(options);

    case 'cube':
      // Use modular geometry - see geometries/polytopes/compoundHypercube.js
      return createCompoundHypercube(options);

    case 'box':
      // Use modular geometry - see geometries/polytopes/compoundTesseract.js
      return createCompoundTesseract(options);

    case 'hessianpolychoron':
      // Use modular geometry - see geometries/polytopes/hessianPolychoron.js
      return createHessianPolychoron(options);

    case 'hypercube':
      // OLD HYPERCUBE (simple concentric cubes) - kept for reference
      // Use "box" for the new compound tesseract instead
      const outerCube = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const innerCube = new THREE.BoxGeometry(0.75, 0.75, 0.75);
      innerCube.translate(0, 0.02, 0);
      const mergedBox = mergeGeometries([outerCube, innerCube], false);
      mergedBox.computeVertexNormals();
      mergedBox.userData.isCompound = true;
      mergedBox.userData.baseType = 'BoxGeometry';
      mergedBox.userData.isHypercube = true;
      return mergedBox;
    case 'cpdtesseract':
      // Use modular geometry - see geometries/polytopes/megaTesseract.js
      return createMegaTesseract(options);
    case 'cpd-megatesseract':
      // Use modular geometry - see geometries/polytopes/compoundMegaTesseract.js
      return createCompoundMegaTesseract(options);
    case 'cpd-megatesseract-2':
      return createCompoundMegaTesseractNested(options);
    case 'cpd-megatesseract-3':
      return createCompoundMegaTesseractExperimental(options);
    case 'cpd-megatesseract-4':
      return createCompoundMegaTesseractAxisShift(options);
    case 'octahedron':
      // Use modular geometry - see geometries/polytopes/octahedron.js
      return createOctahedron(options);

    case 'tetrahedron':
      // Use modular geometry - see geometries/polytopes/tetrahedron.js
      return createTetrahedron(options);

    case 'mobiussphere':
      // Use modular geometry - see geometries/manifolds/mobiusSphere.js
      return createMobiusSphere(options);

    case '120cell':
      // Use modular geometry - see geometries/polytopes/cell120.js
      return create120Cell(options);

    case 'compound120cell':
      // Use modular geometry - see geometries/polytopes/compoundCell120.js
      return createCompound120Cell(options);

    case '24cell':
      // Use modular geometry - see geometries/polytopes/cell24.js
      return create24Cell(options);

    case 'compound24cell':
      // Use modular geometry - see geometries/polytopes/compoundCell24.js
      return createCompound24Cell(options);

    case '16cell':
      // Use modular geometry - see geometries/polytopes/cell16.js
      return create16Cell(options);

    case '600cell':
      // Use modular geometry - see geometries/polytopes/cell600.js
      return create600Cell(options);

    case 'compound600cell':
      // Use modular geometry - see geometries/polytopes/compoundCell600.js
      return createCompound600Cell(options);

    default:
      return new THREE.IcosahedronGeometry();
  }
}
