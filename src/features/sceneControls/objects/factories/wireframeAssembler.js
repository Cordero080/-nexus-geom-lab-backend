/**
 * Wireframe Assembler
 *
 * Routes geometry to the correct wireframe builder to create edge line meshes.
 * Determines which wireframe style based on geometry type (sphere, box, tesseract, etc.).
 */

import { getWireframeMaterial } from './materialCache';
import { createSphereWireframe } from './wireframeBuilders/sphereWireframe';
import { createBoxWireframe } from './wireframeBuilders/boxWireframe';
import { createHypercubeWireframe } from './wireframeBuilders/hypercubeWireframe';
import { createCpdTesseractWireframe } from './wireframeBuilders/cpdTesseractWireframe';
import { createOctahedronWireframe } from './wireframeBuilders/octahedronWireframe';
import {
  createTetrahedronWireframe,
  createIcosahedronWireframe,
  createDodecahedronWireframe,
  createCommonWireframe,
} from './wireframeBuilders/commonWireframe';

/**
 * Assembles wireframe mesh based on geometry type
 * Routes to appropriate wireframe builder with material configuration
 *
 * @param {THREE.BufferGeometry} geometry - The base geometry
 * @param {Object} materialConfig - Material properties (baseColor, metalness, etc.)
 * @param {string} materialKey - Cache key for material pooling (null for non-pooled)
 * @returns {Object} { wireframeMesh, wireframeMaterial }
 */
export function assembleWireframe(geometry, materialConfig, materialKey) {
  let wireframeMesh;
  let wireframeMaterial;

  // Create appropriate wireframe based on geometry type
  if (geometry.type === 'SphereGeometry') {
    wireframeMaterial = getWireframeMaterial(null, materialConfig);
    wireframeMesh = createSphereWireframe(geometry, wireframeMaterial);
  } else if (
    geometry.type === 'BoxGeometry' ||
    (geometry.userData && geometry.userData.baseType === 'BoxGeometry') ||
    (geometry.userData && geometry.userData.baseType === 'HypercubeGeometry')
  ) {
    // Check if it's the compound hypercube (2 hypercubes interpenetrating)
    if (geometry.userData && geometry.userData.isCpdHypercube) {
      wireframeMaterial = getWireframeMaterial(null, materialConfig);
      wireframeMesh = createHypercubeWireframe(geometry, wireframeMaterial);
    }
    // Check if it's the new hypercube (tesseract with hyperframe)
    else if (
      geometry.userData &&
      geometry.userData.isHypercube &&
      !geometry.userData.isCpdTesseract
    ) {
      wireframeMaterial = getWireframeMaterial(null, materialConfig);
      wireframeMesh = createHypercubeWireframe(geometry, wireframeMaterial);
    }
    // Check if it's a mega tesseract (4 tesseracts)
    else if (geometry.userData && geometry.userData.isMegaTesseract) {
      wireframeMaterial = getWireframeMaterial(materialKey, materialConfig);
      wireframeMesh = createCpdTesseractWireframe(geometry, wireframeMaterial);
    }
    // Check if it's a compound mega tesseract (8 tesseracts)
    else if (geometry.userData && geometry.userData.isCompoundMegaTesseract) {
      wireframeMaterial = getWireframeMaterial(materialKey, materialConfig);
      wireframeMesh = createCpdTesseractWireframe(geometry, wireframeMaterial);
    }
    // Check if it's a compound tesseract (2 tesseracts)
    else if (geometry.userData && geometry.userData.isCpdTesseract) {
      wireframeMaterial = getWireframeMaterial(materialKey, materialConfig);
      wireframeMesh = createCpdTesseractWireframe(geometry, wireframeMaterial);
    } else {
      wireframeMaterial = getWireframeMaterial(null, materialConfig);
      wireframeMesh = createBoxWireframe(geometry, wireframeMaterial);
    }
  } else if (
    geometry.type === 'OctahedronGeometry' ||
    (geometry.userData && geometry.userData.baseType === 'OctahedronGeometry')
  ) {
    wireframeMaterial = getWireframeMaterial(null, materialConfig);
    wireframeMesh = createOctahedronWireframe(geometry, wireframeMaterial);
  } else if (
    geometry.type === 'TetrahedronGeometry' ||
    (geometry.userData && geometry.userData.baseType === 'TetrahedronGeometry')
  ) {
    wireframeMaterial = getWireframeMaterial(null, materialConfig);
    wireframeMesh = createTetrahedronWireframe(geometry, wireframeMaterial);
  } else if (
    geometry.type === 'IcosahedronGeometry' ||
    (geometry.userData && geometry.userData.baseType === 'IcosahedronGeometry')
  ) {
    wireframeMaterial = getWireframeMaterial(null, materialConfig);
    // 600-cell uses same icosahedron wireframe as compound icosahedron
    wireframeMesh = createIcosahedronWireframe(geometry, wireframeMaterial);
  } else if (
    geometry.type === 'DodecahedronGeometry' ||
    (geometry.userData && geometry.userData.baseType === 'DodecahedronGeometry')
  ) {
    wireframeMaterial = getWireframeMaterial(null, materialConfig);
    wireframeMesh = createDodecahedronWireframe(geometry, wireframeMaterial);
  } else {
    // Standard thin wireframe for other geometries
    wireframeMaterial = getWireframeMaterial(null, materialConfig, {
      ...materialConfig,
      isStandardWireframe: true,
    });
    wireframeMesh = createCommonWireframe(
      geometry,
      wireframeMaterial,
      geometry.userData?.isFloatingCity ? 0.3 : 1.0 // Scale cylinder radius by 70% for floating city
    );
  }

  return { wireframeMesh, wireframeMaterial };
}
