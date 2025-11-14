/**
 * Object Factory
 *
 * Main orchestrator that assembles complete 3D objects from geometry, materials, wireframes, and hyperframes.
 * Coordinates between specialized assemblers to build scene-ready objects with all visual components.
 */

import * as THREE from 'three';
import { createGeometry } from '../geometryCreation';
import { getSolidMaterial, getMaterialPoolKey } from './materialCache';
import { assembleWireframe } from './wireframeAssembler';
import { assembleHyperframe } from './hyperframeAssembler';
import { createQuantumManifoldExtras } from './decorators/quantumManifoldExtras';
import {
  createCompoundSphereExtras,
  createFloatingCityExtras,
} from './decorators/compoundSphereExtras';

/**
 * Creates a complete 3D object with all components:
 * - Solid mesh
 * - Thick wireframe cylinders
 * - Hyperframes (inner dimensional frameworks)
 * - Connecting rods (curved lines)
 *
 * @param {Object} config - Configuration object
 * @param {string} config.objectType - Type of geometry to create (if single object)
 * @param {number} config.objectCount - Total number of objects being created
 * @param {number} config.objectIndex - Index of this specific object
 * @param {string} config.baseColor - Base color for materials
 * @param {number} config.metalness - Metalness value (0-1)
 * @param {number} config.emissiveIntensity - Emissive intensity (0-2)
 * @param {number} config.wireframeIntensity - Wireframe opacity intensity
 * @param {string} config.hyperframeColor - Color for spiral center lines
 * @param {string} config.hyperframeLineColor - Color for edge connections
 * @returns {Object} Object containing all mesh components and metadata
 */
export function createSceneObject(config) {
  const {
    objectType,
    objectCount,
    objectIndex,
    baseColor,
    metalness,
    emissiveIntensity,
    wireframeIntensity,
    hyperframeColor,
    hyperframeLineColor,
    // Optional geometry-specific overrides
    cpdTK_p,
    cpdTK_q,
    cpdTK_tubeRadius,
    cpdTK_gap,
  } = config;

  // ========================================
  // 1. GEOMETRY SELECTION
  // ========================================
  let geometry;
  if (objectCount === 1) {
    // Single object: use the selected objectType
    const options = {};
    geometry = createGeometry(objectType, options);
  } else {
    // Multiple objects: cycle through different types for variety using createGeometry
    const geometryTypes = [
      'icosahedron', // Uses createGeometry - gets proper material setup
      'sphere', // Uses createGeometry - gets proper material setup
      'box', // Maps to basic THREE.BoxGeometry but through createGeometry
      'octahedron', // Uses createGeometry - gets proper material setup
      'tetrahedron', // Uses createGeometry - gets proper material setup
    ];
    const selectedType = geometryTypes[objectIndex % geometryTypes.length];

    // Use createGeometry for all types to ensure consistent material handling
    if (selectedType === 'box') {
      // For box, create standard BoxGeometry since we don't have custom box in createGeometry
      geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    } else {
      geometry = createGeometry(selectedType, {});
    }
  }

  // Store original vertex positions for advanced animations
  const originalPositions = geometry.attributes.position.array.slice();

  // ========================================
  // 2. MATERIAL CREATION
  // ========================================
  const materialConfig = {
    baseColor,
    metalness,
    emissiveIntensity,
    wireframeIntensity,
  };
  const materialKey = getMaterialPoolKey(geometry, objectType);
  const solidMaterial = getSolidMaterial(materialKey, materialConfig);

  // ========================================
  // 3. SOLID MESH CREATION
  // ========================================
  // Create a container so we can optionally add a rotated duplicate solid for Box (compound)
  const solidMesh = new THREE.Group();
  const primarySolid = new THREE.Mesh(geometry, solidMaterial);
  primarySolid.castShadow = true;
  primarySolid.receiveShadow = true;
  solidMesh.add(primarySolid);

  // If this is a standard Box hypercube (not compound tesseract), add a rotated duplicate solid cube
  if (
    (geometry.type === 'BoxGeometry' ||
      (geometry.userData && geometry.userData.baseType === 'BoxGeometry')) &&
    !(geometry.userData && geometry.userData.isCpdTesseract)
  ) {
    const rotatedGeom = geometry.clone();
    const rotatedSolid = new THREE.Mesh(rotatedGeom, solidMaterial);
    // Apply a gentle rotation and slight scale to reduce z-fighting, matching wireframe/hyperframe duplicate
    rotatedSolid.rotation.y = Math.PI / 4;
    rotatedSolid.scale.setScalar(0.98);
    rotatedSolid.castShadow = true;
    rotatedSolid.receiveShadow = true;
    solidMesh.add(rotatedSolid);
  }

  // Generate unique object ID for interaction
  const objectId = `object_${objectIndex}_${Date.now()}`;

  // Add userData for identification
  solidMesh.userData.objectId = objectId;

  // ========================================
  // 4. WIREFRAME CREATION (GEOMETRY-SPECIFIC)
  // ========================================
  const { wireframeMesh, wireframeMaterial } = assembleWireframe(
    geometry,
    materialConfig,
    materialKey
  );

  // Add userData to wireframe mesh for interaction
  if (wireframeMesh) {
    wireframeMesh.userData.objectId = objectId;
  }

  // Ensure all child meshes carry the objectId for raycasting-based hover
  // (the interaction hook filters only meshes with userData.objectId)
  if (solidMesh) {
    solidMesh.traverse((child) => {
      if (child.isMesh) {
        child.userData.objectId = objectId;
      }
    });
  }
  if (wireframeMesh) {
    const target = wireframeMesh.isGroup ? wireframeMesh : null;
    if (target) {
      target.traverse((child) => {
        if (child.isMesh) {
          child.userData.objectId = objectId;
        }
      });
    } else if (wireframeMesh.isMesh) {
      wireframeMesh.userData.objectId = objectId;
    }
  }

  // ========================================
  // 5. HYPERFRAME CREATION
  // ========================================
  const { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = assembleHyperframe(
    geometry,
    hyperframeColor,
    hyperframeLineColor
  );

  // ========================================
  // 6. POSITIONING
  // ========================================
  if (objectCount === 1) {
    // Single object at center
    solidMesh.position.set(0, 0, 0);
    wireframeMesh.position.set(0, 0, 0);
    centerLines.position.set(0, 0, 0);
    curvedLines.position.set(0, 0, 0);
  } else {
    // Multiple objects arranged in a circle
    const angle = (objectIndex / objectCount) * Math.PI * 2;
    const radius = 3;
    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.9) * 1; // Random Y position for variety
    const z = Math.sin(angle) * radius;

    solidMesh.position.set(x, y, z);
    wireframeMesh.position.set(x, y, z);
    centerLines.position.set(x, y, z);
    curvedLines.position.set(x, y, z);
  }

  // ========================================
  // 7. SHADOW CONFIGURATION
  // ========================================
  // Shadows are set on child meshes above; group holds both
  wireframeMesh.castShadow = true;
  wireframeMesh.receiveShadow = true;

  // ========================================
  // 8. RETURN COMPLETE OBJECT DATA
  // ========================================
  // Klein Attractor extras removed
  // Inject extras for Quantum Manifold (including compound)
  if (objectType === 'quantummanifold' || objectType === 'compoundquantummanifold') {
    try {
      const extrasGroup = createQuantumManifoldExtras(geometry);
      if (extrasGroup) {
        // Attach extras to solid so they inherit rotation/position
        solidMesh.add(extrasGroup);
      }
    } catch (e) {
      // Fail-safe: do not crash scene if extras fail to build
      // eslint-disable-next-line no-console
    }
  }

  // Inject extras for Compound Sphere (including super-compound and floating city)
  if (
    objectType === 'sphere' ||
    objectType === 'compoundsphere' ||
    (geometry && geometry.userData && geometry.userData.isFloatingCity)
  ) {
    try {
      const extrasGroup = createCompoundSphereExtras(geometry);
      if (extrasGroup) {
        // Attach extras to solid so they inherit rotation/position
        solidMesh.add(extrasGroup);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
    }
  }

  return {
    objectId, // Use the generated objectId
    solidMesh,
    wireframeMesh,
    centerLines,
    curvedLines,
    material: solidMaterial,
    wireframeMaterial,
    centerLinesMaterial,
    curvedLinesMaterial,
    geometry,
    originalPositions,
    // Extract thick cylinders data for vertex deformation animations
    thickCylinders:
      wireframeMesh && wireframeMesh.isGroup
        ? wireframeMesh.children.filter((m) => m.isMesh)
        : null,
    edgePairs:
      wireframeMesh && wireframeMesh.userData && wireframeMesh.userData.edgePairs
        ? wireframeMesh.userData.edgePairs
        : null,
    // Store original position for animations
    originalPosition: solidMesh.position.clone(),
    // Random phase for varied animations
    phase: Math.random() * Math.PI * 2,
    // Magnetic points for magnetic field animation effect
    magneticPoints: [
      {
        x: Math.random() * 4 - 2,
        y: Math.random() * 4 - 2,
        z: Math.random() * 4 - 2,
        strength: Math.random() + 0.5,
      },
      {
        x: Math.random() * 4 - 2,
        y: Math.random() * 4 - 2,
        z: Math.random() * 4 - 2,
        strength: Math.random() + 0.5,
      },
      {
        x: Math.random() * 4 - 2,
        y: Math.random() * 4 - 2,
        z: Math.random() * 4 - 2,
        strength: Math.random() + 0.5,
      },
    ],
  };
}
