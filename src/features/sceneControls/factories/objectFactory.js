import * as THREE from "three";
import { createGeometry } from "../geometryCreation";
import {
  createSolidMaterial,
  createWireframeMaterial,
} from "./materialFactory";
import { createSphereWireframe } from "./wireframeBuilders/sphereWireframe";
import { createBoxWireframe } from "./wireframeBuilders/boxWireframe";
import { createHypercubeWireframe } from "./wireframeBuilders/hypercubeWireframe";
import { createCpdTesseractWireframe } from "./wireframeBuilders/cpdTesseractWireframe";
import { createOctahedronWireframe } from "./wireframeBuilders/octahedronWireframe";
import {
  createTetrahedronWireframe,
  createIcosahedronWireframe,
  createDodecahedronWireframe,
  createCommonWireframe,
} from "./wireframeBuilders/commonWireframe";
import { createTetrahedronHyperframe } from "./hyperframeBuilders/tetrahedronHyperframe";
import { createBoxHyperframe } from "./hyperframeBuilders/boxHyperframe";
import { createOctahedronHyperframe } from "./hyperframeBuilders/octahedronHyperframe";
import { createIcosahedronHyperframe } from "./hyperframeBuilders/icosahedronHyperframe";
import { createHypercubeHyperframe } from "./hyperframeBuilders/hypercubeHyperframe";
import { createCompoundHypercubeHyperframe } from "./hyperframeBuilders/compoundHypercubeHyperframe";
import { create120CellHyperframe } from "./hyperframeBuilders/cell120Hyperframe";
import { createCompound120CellHyperframe } from "./hyperframeBuilders/compoundCell120Hyperframe";
import { create24CellHyperframe } from "./hyperframeBuilders/cell24Hyperframe";
import { createCompound24CellHyperframe } from "./hyperframeBuilders/compoundCell24Hyperframe";
import { create16CellHyperframe } from "./hyperframeBuilders/cell16Hyperframe";
import { create600CellHyperframe } from "./hyperframeBuilders/cell600Hyperframe";
import { createCompound600CellHyperframe } from "./hyperframeBuilders/compoundCell600Hyperframe";
// Tesseract hyperframes removed: render only mesh + wireframe (no inner center-lines/connectors)
import { createMegaTesseractCenterline } from "./hyperframeBuilders/megaTesseractCenterline";
import { createCpdTesseractCenterline } from "./hyperframeBuilders/cpdTesseractCenterline";

// Shared pools keep mega tesseract variants responsive during slider edits.
const solidMaterialPool = new Map();
const wireframeMaterialPool = new Map();
const hyperframeCache = new Map();

function ensureSolidMaterialConfig(material, config) {
  if (!material) return null;
  const { baseColor, metalness, emissiveIntensity, wireframeIntensity } =
    config;
  // Use RGB part only for Three.js Color (strip alpha if present)
  const rgbColor = baseColor.slice(0, 7);
  const color = new THREE.Color(rgbColor);
  material.color.copy(color);
  material.metalness = metalness;
  material.roughness = 0.2;
  material.emissive.copy(color).multiplyScalar(emissiveIntensity);
  const opacity = 1 - wireframeIntensity / 100;
  material.opacity = opacity;
  material.transparent = opacity < 1;
  material.needsUpdate = true;
  return material;
}

function ensureWireframeMaterialConfig(material, config) {
  if (!material) return null;
  const { baseColor, metalness, emissiveIntensity, wireframeIntensity } =
    config;
  // Use RGB part only for Three.js Color (strip alpha if present)
  const rgbColor = baseColor.slice(0, 7);
  const color = new THREE.Color(rgbColor);
  material.color.copy(color);
  material.metalness = metalness;
  material.roughness = 0.2;
  material.emissive.copy(color).multiplyScalar(emissiveIntensity);
  const opacity = wireframeIntensity / 100;
  material.opacity = opacity;
  material.transparent = true;
  material.needsUpdate = true;
  return material;
}

function getMaterialPoolKey(geometry, objectType) {
  if (!geometry || !geometry.userData) return null;
  const { isMegaTesseract, isCompoundMegaTesseract, isCpdTesseract, variant } =
    geometry.userData;
  const isMegaFamily =
    isMegaTesseract || isCompoundMegaTesseract || isCpdTesseract;
  if (!isMegaFamily) return null;
  const variantKey = variant ? `-${variant}` : "";
  return `${objectType || geometry.type}${variantKey}`;
}

function getSolidMaterial(materialKey, materialConfig) {
  if (!materialKey) {
    return createSolidMaterial(materialConfig);
  }
  if (!solidMaterialPool.has(materialKey)) {
    solidMaterialPool.set(materialKey, createSolidMaterial(materialConfig));
  }
  return ensureSolidMaterialConfig(
    solidMaterialPool.get(materialKey),
    materialConfig
  );
}

function getWireframeMaterial(materialKey, materialConfig, overrides = {}) {
  if (!materialKey || overrides.isStandardWireframe) {
    return ensureWireframeMaterialConfig(
      createWireframeMaterial({ ...materialConfig, ...overrides }),
      { ...materialConfig, ...overrides }
    );
  }
  if (!wireframeMaterialPool.has(materialKey)) {
    wireframeMaterialPool.set(
      materialKey,
      createWireframeMaterial(materialConfig)
    );
  }
  return ensureWireframeMaterialConfig(
    wireframeMaterialPool.get(materialKey),
    materialConfig
  );
}

function cloneGroupWithUserData(group) {
  if (!group) return null;
  const cloned = group.clone(true);
  cloned.userData = { ...group.userData };
  cloned.traverse((child) => {
    if (child !== cloned) {
      child.userData = { ...child.userData };
    }
  });
  return cloned;
}

function getHyperframeKey(geometry, hyperframeColor, hyperframeLineColor) {
  if (!geometry || !geometry.userData) return null;
  const { isMegaTesseract, isCompoundMegaTesseract, isCpdTesseract, variant } =
    geometry.userData;
  if (!isMegaTesseract && !isCompoundMegaTesseract && !isCpdTesseract) {
    return null;
  }
  let prefix = "cpd";
  if (isCompoundMegaTesseract) prefix = "compoundMega";
  else if (isMegaTesseract) prefix = "mega";

  const signatureFields = [
    "translationStep",
    "layerGap",
    "baseOffset",
    "translationAxis",
    "sweepScales",
    "sweepOffsets",
    "radialStep",
    "twistStep",
    "duplicateScale",
    "duplicateRotation",
    "duplicateOffset",
    "mirrorEnabled",
    "baseTranslationStep",
    "baseLayerGap",
    "baseSweepScales",
    "baseTranslationAxis",
    "componentCount",
  ];

  const signature = { variant: variant || "baseline" };
  signatureFields.forEach((field) => {
    if (field in geometry.userData && geometry.userData[field] !== undefined) {
      signature[field] = geometry.userData[field];
    }
  });

  // Include colors in cache key so hyperframe updates when colors change
  if (hyperframeColor !== undefined)
    signature.hyperframeColor = hyperframeColor;
  if (hyperframeLineColor !== undefined)
    signature.hyperframeLineColor = hyperframeLineColor;

  return `${prefix}:${JSON.stringify(signature)}`;
}

function getHyperframeFromCache(key, builder) {
  if (!key) return builder();
  if (!hyperframeCache.has(key)) {
    hyperframeCache.set(key, builder());
  }
  const cached = hyperframeCache.get(key);
  return {
    centerLines: cloneGroupWithUserData(cached.centerLines),
    centerLinesMaterial: cached.centerLinesMaterial,
    curvedLines: cloneGroupWithUserData(cached.curvedLines),
    curvedLinesMaterial: cached.curvedLinesMaterial,
  };
}

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
      "icosahedron", // Uses createGeometry - gets proper material setup
      "sphere", // Uses createGeometry - gets proper material setup
      "box", // Maps to basic THREE.BoxGeometry but through createGeometry
      "octahedron", // Uses createGeometry - gets proper material setup
      "tetrahedron", // Uses createGeometry - gets proper material setup
    ];
    const selectedType = geometryTypes[objectIndex % geometryTypes.length];

    // Use createGeometry for all types to ensure consistent material handling
    if (selectedType === "box") {
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
    (geometry.type === "BoxGeometry" ||
      (geometry.userData && geometry.userData.baseType === "BoxGeometry")) &&
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
  let wireframeMesh;
  let wireframeMaterial;

  // Create appropriate wireframe based on geometry type
  if (geometry.type === "SphereGeometry") {
    wireframeMaterial = getWireframeMaterial(null, materialConfig);
    wireframeMesh = createSphereWireframe(geometry, wireframeMaterial);
  } else if (
    geometry.type === "BoxGeometry" ||
    (geometry.userData && geometry.userData.baseType === "BoxGeometry") ||
    (geometry.userData && geometry.userData.baseType === "HypercubeGeometry")
  ) {
    // Check if it's the compound hypercube (2 hypercubes interpenetrating)
    if (geometry.userData && geometry.userData.isCpdHypercube) {
      wireframeMaterial = getWireframeMaterial(null, materialConfig);
      wireframeMesh = createHypercubeWireframe(geometry, wireframeMaterial);
      console.log("🔷 USING COMPOUND HYPERCUBE WIREFRAME");
    }
    // Check if it's the new hypercube (tesseract with hyperframe)
    else if (
      geometry.userData &&
      geometry.userData.isHypercube &&
      !geometry.userData.isCpdTesseract
    ) {
      wireframeMaterial = getWireframeMaterial(null, materialConfig);
      wireframeMesh = createHypercubeWireframe(geometry, wireframeMaterial);
      console.log("🔷 USING HYPERCUBE WIREFRAME");
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
    geometry.type === "OctahedronGeometry" ||
    (geometry.userData && geometry.userData.baseType === "OctahedronGeometry")
  ) {
    wireframeMaterial = getWireframeMaterial(null, materialConfig);
    wireframeMesh = createOctahedronWireframe(geometry, wireframeMaterial);
  } else if (
    geometry.type === "TetrahedronGeometry" ||
    (geometry.userData && geometry.userData.baseType === "TetrahedronGeometry")
  ) {
    wireframeMaterial = getWireframeMaterial(null, materialConfig);
    wireframeMesh = createTetrahedronWireframe(geometry, wireframeMaterial);
  } else if (
    geometry.type === "IcosahedronGeometry" ||
    (geometry.userData && geometry.userData.baseType === "IcosahedronGeometry")
  ) {
    wireframeMaterial = getWireframeMaterial(null, materialConfig);
    // 600-cell uses same icosahedron wireframe as compound icosahedron
    wireframeMesh = createIcosahedronWireframe(geometry, wireframeMaterial);
  } else if (
    geometry.type === "DodecahedronGeometry" ||
    (geometry.userData && geometry.userData.baseType === "DodecahedronGeometry")
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
  let centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial;

  if (
    geometry.type === "TetrahedronGeometry" ||
    geometry.constructor.name === "TetrahedronGeometry" ||
    (geometry.userData && geometry.userData.baseType === "TetrahedronGeometry")
  ) {
    // Check if it's a 16-cell
    if (geometry.userData && geometry.userData.is16Cell) {
      const result = create16CellHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
        result);
    } else {
      // Regular compound tetrahedron
      const result = createTetrahedronHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
        result);
    }
  } else if (
    geometry.type === "BoxGeometry" ||
    (geometry.userData && geometry.userData.baseType === "BoxGeometry") ||
    (geometry.userData && geometry.userData.baseType === "HypercubeGeometry")
  ) {
    // Check if it's the compound hypercube (2 hypercubes interpenetrating)
    if (geometry.userData && geometry.userData.isCpdHypercube) {
      const result = createCompoundHypercubeHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
        result);
      console.log("🔷 USING COMPOUND HYPERCUBE HYPERFRAME");
    }
    // Check if it's the new hypercube (tesseract with hyperframe)
    else if (
      geometry.userData &&
      geometry.userData.isHypercube &&
      !geometry.userData.isCpdTesseract
    ) {
      const result = createHypercubeHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
        result);
    }
    // Check if it's a compound tesseract (two interpenetrating 4D hypercubes) or regular tesseract (single 4D hypercube)
    else if (geometry.userData && geometry.userData.isCpdTesseract) {
      const isMega = geometry.userData.isMegaTesseract;
      const isCompoundMega = geometry.userData.isCompoundMegaTesseract;
      const hyperframeKey = getHyperframeKey(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );

      if (isCompoundMega) {
        ({
          centerLines,
          centerLinesMaterial,
          curvedLines,
          curvedLinesMaterial,
        } = getHyperframeFromCache(hyperframeKey, () =>
          createCpdTesseractCenterline(
            geometry,
            hyperframeColor,
            hyperframeLineColor
          )
        ));
      } else if (isMega && !isCompoundMega) {
        ({
          centerLines,
          centerLinesMaterial,
          curvedLines,
          curvedLinesMaterial,
        } = getHyperframeFromCache(hyperframeKey, () =>
          createMegaTesseractCenterline(
            geometry,
            hyperframeColor,
            hyperframeLineColor
          )
        ));
      } else if (!isMega && !isCompoundMega) {
        ({
          centerLines,
          centerLinesMaterial,
          curvedLines,
          curvedLinesMaterial,
        } = getHyperframeFromCache(hyperframeKey, () =>
          createCpdTesseractCenterline(
            geometry,
            hyperframeColor,
            hyperframeLineColor
          )
        ));
      } else {
        // For other tesseract-based geometries, keep hyperframe disabled
        centerLines = new THREE.Group();
        curvedLines = new THREE.Group();
        centerLinesMaterial = null;
        curvedLinesMaterial = null;
      }
    } else {
      const result = createBoxHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
        result);
    }
  } else if (
    geometry.type === "OctahedronGeometry" ||
    (geometry.userData && geometry.userData.baseType === "OctahedronGeometry")
  ) {
    // Check if it's a compound 24-cell
    if (geometry.userData && geometry.userData.isCompound24Cell) {
      const result = createCompound24CellHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
        result);
    }
    // Check if it's a 24-cell
    else if (geometry.userData && geometry.userData.is24Cell) {
      const result = create24CellHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
        result);
    } else {
      // Regular compound octahedron
      const result = createOctahedronHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
        result);
    }
  } else if (
    geometry.type === "IcosahedronGeometry" ||
    (geometry.userData && geometry.userData.baseType === "IcosahedronGeometry")
  ) {
    // Check if it's a compound 600-cell
    if (geometry.userData && geometry.userData.isCompound600Cell) {
      const result = createCompound600CellHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
        result);
    }
    // Check if it's a 600-cell
    else if (geometry.userData && geometry.userData.is600Cell) {
      const result = create600CellHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
        result);
    } else {
      // Regular compound icosahedron
      const result = createIcosahedronHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
        result);
    }
  } else if (
    geometry.type === "DodecahedronGeometry" ||
    (geometry.userData && geometry.userData.baseType === "DodecahedronGeometry")
  ) {
    // Check if it's a compound 120-cell
    if (geometry.userData && geometry.userData.isCompound120Cell) {
      const result = createCompound120CellHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
        result);
    } else {
      // Regular 120-cell
      const result = create120CellHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
        result);
    }
  } else {
    // OTHER GEOMETRIES: Create generic hyperframes
    const result = createGenericHyperframe(
      geometry,
      hyperframeColor,
      hyperframeLineColor,
      geometry.userData.isFloatingCity // Pass floating city flag
    );
    ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
      result);
  }

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
  if (
    objectType === "quantummanifold" ||
    objectType === "compoundquantummanifold"
  ) {
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
    objectType === "sphere" ||
    objectType === "compoundsphere" ||
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
      wireframeMesh &&
      wireframeMesh.userData &&
      wireframeMesh.userData.edgePairs
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

/**
 * Creates generic hyperframes for non-standard geometries (TorusKnot, etc.)
 * Includes spiral center lines and edge connections
 */
function createGenericHyperframe(
  geometry,
  spiralColor,
  edgeColor,
  isFloatingCity = false
) {
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgeVertices = edgesGeometry.attributes.position.array;

  // Reduce line width by 70% for floating city
  const lineWidthMultiplier = isFloatingCity ? 0.3 : 1.0;

  // ========================================
  // 1. CREATE CENTER LINES (Spiral connections)
  // ========================================
  const centerLinesGeometry = new THREE.BufferGeometry();
  const centerLinesPositions = [];

  // Use actual wireframe edge endpoints for connections
  for (let j = 0; j < edgeVertices.length; j += 12) {
    // Every other edge
    const endX = edgeVertices[j + 3]; // End point of edge
    const endY = edgeVertices[j + 4];
    const endZ = edgeVertices[j + 5];

    // Create spiral path from center to edge endpoint
    const steps = 8; // Number of spiral steps
    for (let step = 0; step < steps; step++) {
      const t1 = step / steps;
      const t2 = (step + 1) / steps;

      // Spiral parameters
      const radius1 = t1 * 0.8; // Gradually increase radius
      const radius2 = t2 * 0.8;
      const angle1 = t1 * Math.PI * 2; // One full rotation
      const angle2 = t2 * Math.PI * 2;

      // Interpolate toward the actual edge point
      const normalizer = Math.sqrt(endX * endX + endY * endY + endZ * endZ);
      const x1 = Math.cos(angle1) * radius1 * (endX / normalizer);
      const y1 = Math.sin(angle1) * radius1 * (endY / normalizer) + t1 * endY;
      const z1 = t1 * endZ;

      const x2 = Math.cos(angle2) * radius2 * (endX / normalizer);
      const y2 = Math.sin(angle2) * radius2 * (endY / normalizer) + t2 * endY;
      const z2 = t2 * endZ;

      centerLinesPositions.push(x1, y1, z1, x2, y2, z2);
    }
  }

  // Create center lines mesh
  let centerLines, centerLinesMaterial;
  if (centerLinesPositions.length > 0) {
    centerLinesGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(centerLinesPositions, 3)
    );

    const baseOpacity = 0.6 * lineWidthMultiplier;
    centerLinesMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(spiralColor),
      transparent: true,
      opacity: baseOpacity,
      linewidth: lineWidthMultiplier, // Note: linewidth doesn't work on all platforms
    });

    // Store base opacity for material updates
    centerLinesMaterial.userData = { baseOpacity };

    centerLines = new THREE.LineSegments(
      centerLinesGeometry,
      centerLinesMaterial
    );
  } else {
    centerLines = new THREE.Object3D();
    centerLinesMaterial = null;
  }

  // ========================================
  // 2. CREATE CURVED LINES (Edge connections)
  // ========================================
  const curvedLinesGeometry = new THREE.BufferGeometry();
  const curvedLinesPositions = [];

  // Connect wireframe edges to create enhanced patterns
  for (let j = 0; j < edgeVertices.length; j += 6) {
    const edge1Start = [
      edgeVertices[j],
      edgeVertices[j + 1],
      edgeVertices[j + 2],
    ];
    const edge1End = [
      edgeVertices[j + 3],
      edgeVertices[j + 4],
      edgeVertices[j + 5],
    ];

    // Find nearby edges to connect to
    for (let k = j + 6; k < edgeVertices.length && k < j + 36; k += 6) {
      const edge2Start = [
        edgeVertices[k],
        edgeVertices[k + 1],
        edgeVertices[k + 2],
      ];
      const edge2End = [
        edgeVertices[k + 3],
        edgeVertices[k + 4],
        edgeVertices[k + 5],
      ];

      // Calculate distance between edge endpoints
      const dist1 = Math.sqrt(
        (edge1End[0] - edge2Start[0]) ** 2 +
          (edge1End[1] - edge2Start[1]) ** 2 +
          (edge1End[2] - edge2Start[2]) ** 2
      );

      const dist2 = Math.sqrt(
        (edge1End[0] - edge2End[0]) ** 2 +
          (edge1End[1] - edge2End[1]) ** 2 +
          (edge1End[2] - edge2End[2]) ** 2
      );

      // Connect to nearby edge points
      const maxDist = 1.2;

      if (dist1 < maxDist) {
        curvedLinesPositions.push(...edge1End, ...edge2Start);
      } else if (dist2 < maxDist) {
        curvedLinesPositions.push(...edge1End, ...edge2End);
      }
    }
  }

  // Create curved lines mesh
  let curvedLines, curvedLinesMaterial;
  if (curvedLinesPositions.length > 0) {
    curvedLinesGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(curvedLinesPositions, 3)
    );

    const baseOpacity = 0.4 * lineWidthMultiplier;
    curvedLinesMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(edgeColor),
      transparent: true,
      opacity: baseOpacity,
      linewidth: lineWidthMultiplier,
    });

    // Store base opacity for material updates
    curvedLinesMaterial.userData = { baseOpacity };

    curvedLines = new THREE.LineSegments(
      curvedLinesGeometry,
      curvedLinesMaterial
    );
  } else {
    curvedLines = new THREE.Object3D();
    curvedLinesMaterial = null;
  }

  return { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial };
}

// ========================================
// Quantum Manifold Extras (Clifford flows, golden spiral, clouds, threads)
// ========================================
function createQuantumManifoldExtras(geometry) {
  const group = new THREE.Group();

  // Colors
  const colGold = new THREE.Color("#FFD700");
  const colCyan = new THREE.Color("#80FFFF");
  const colDeepBlue = new THREE.Color("#0b3d91");
  const colPurple = new THREE.Color("#6A0DAD");

  // Parametric Klein (matches geometryCreation.js)
  const scale = 0.65;
  const klein = (u, v) => {
    const cu = Math.cos(u);
    const su = Math.sin(u);
    const c2 = Math.cos(u / 2);
    const s2 = Math.sin(u / 2);
    const sv = Math.sin(v);
    const s2v = Math.sin(2 * v);
    const R = 1.2;
    const x = (R + c2 * sv - s2 * s2v) * cu;
    const y = (R + c2 * sv - s2 * s2v) * su;
    const z = s2 * sv + c2 * s2v;
    return new THREE.Vector3(x * scale, y * scale, z * scale);
  };

  // Clifford attractor mapped to (u,v) domain then onto surface
  const createCliffordFlows = () => {
    // Chaos-inspired flows constrained to the surface by integrating in (u,v)
    // Direction is snapped toward iso-param lines so paths follow mesh wireframe curvature.
    const flows = new THREE.Group();
    const a = -1.4,
      b = 1.6,
      c = 1.0,
      d = 0.7; // Clifford params
    const flowCount = 5;
    const steps = 620;
    const transient = 40;
    const stepUV = 0.035; // param step size
    const twoPi = Math.PI * 2;

    // Finite-difference tangent basis on the surface
    const h = 1e-3;
    const tangentBasis = (u, v) => {
      const p = klein(u, v);
      const pu = klein((u + h) % twoPi, v)
        .sub(p)
        .multiplyScalar(1 / h);
      const pv = klein(u, (v + h) % twoPi)
        .sub(p)
        .multiplyScalar(1 / h);
      // Normalize basis vectors in param space (we only use them for direction snapping)
      pu.normalize();
      pv.normalize();
      return { pu, pv, p };
    };

    for (let f = 0; f < flowCount; f++) {
      // Seed attractor state and (u,v)
      let x = (Math.random() * 2 - 1) * 0.6;
      let y = (Math.random() * 2 - 1) * 0.6;
      let u = Math.random() * twoPi;
      let v = Math.random() * twoPi;
      const positions = [];

      // Burn-in to stabilize the attractor
      for (let i = 0; i < transient; i++) {
        const xn = Math.sin(a * y) + c * Math.cos(a * x);
        const yn = Math.sin(b * x) + d * Math.cos(b * y);
        x = xn;
        y = yn;
      }

      for (let i = 0; i < steps; i++) {
        // Advance Clifford to get a direction cue
        const xn = Math.sin(a * y) + c * Math.cos(a * x);
        const yn = Math.sin(b * x) + d * Math.cos(b * y);
        const du_a = xn - x;
        const dv_a = yn - y;
        x = xn;
        y = yn;

        // Convert to param direction (normalized)
        let dirU = du_a;
        let dirV = dv_a;
        const len = Math.hypot(dirU, dirV) || 1;
        dirU /= len;
        dirV /= len;

        // Snap toward iso-param (wireframe) directions using surface tangents
        const { pu, pv, p } = tangentBasis(u, v);
        // Build an approximate 3D direction for (u) and (v) and pick whichever aligns with attractor direction
        // Project a blended param direction into 3D for the choice
        const candU = pu; // along ∂S/∂u
        const candV = pv; // along ∂S/∂v
        // Create a pseudo 3D attractor direction by mixing basis vectors with param dir
        const attract3D = candU
          .clone()
          .multiplyScalar(dirU)
          .add(candV.clone().multiplyScalar(dirV))
          .normalize();
        const dotU = Math.abs(attract3D.dot(candU));
        const dotV = Math.abs(attract3D.dot(candV));
        // Choose the dominant iso-direction and keep a small portion of the other for organic flow
        let stepU = 0,
          stepV = 0;
        if (dotU >= dotV) {
          stepU = Math.sign(dirU) || (Math.random() < 0.5 ? 1 : -1);
          stepV = 0.2 * Math.sign(dirV);
        } else {
          stepV = Math.sign(dirV) || (Math.random() < 0.5 ? 1 : -1);
          stepU = 0.2 * Math.sign(dirU);
        }

        // Advance in param space and wrap
        u = (u + stepUV * stepU + twoPi) % twoPi;
        v = (v + stepUV * stepV + twoPi) % twoPi;

        const pNext = klein(u, v);
        positions.push(pNext.x, pNext.y, pNext.z);
      }

      if (positions.length >= 6) {
        const buf = new THREE.BufferGeometry();
        buf.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3)
        );
        const mat = new THREE.LineBasicMaterial({
          color: f === 0 ? colGold : f % 2 ? colDeepBlue : colPurple,
          transparent: true,
          opacity: f === 0 ? 0.85 : 0.52,
        });
        const line = new THREE.Line(buf, mat);
        const phase = Math.random() * Math.PI * 2;
        line.onBeforeRender = (
          renderer,
          scene,
          camera,
          geometry_,
          material_
        ) => {
          const t = performance.now() * 0.001 + phase;
          material_.opacity = (f === 0 ? 0.7 : 0.48) + Math.sin(t * 1.0) * 0.09;
        };
        flows.add(line);
      }
    }
    return flows;
  };

  // Golden spiral tube following the first flow path
  const createGoldenSpiralTube = (flowsGroup) => {
    if (!flowsGroup || flowsGroup.children.length === 0) return null;
    const seedLine = flowsGroup.children[0];
    const posAttr = seedLine.geometry.getAttribute("position");
    const pts = [];
    for (let i = 0; i < posAttr.count; i++) {
      pts.push(
        new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i))
      );
    }
    if (pts.length < 8) return null;
    const curve = new THREE.CatmullRomCurve3(pts);
    const phi = (1 + Math.sqrt(5)) / 2;
    const tubularSegments = 300;
    const radiusBase = 0.02;
    const radialSegments = 8;

    const frames = curve.computeFrenetFrames(tubularSegments, true);
    const positions = [];
    const indices = [];
    const normals = [];
    for (let i = 0; i <= tubularSegments; i++) {
      const t = i / tubularSegments;
      const point = curve.getPoint(t);
      const n = frames.normals[i];
      const b = frames.binormals[i];
      const angleSteps = radialSegments;
      const radius = radiusBase * Math.pow(phi, (t - 0.5) * 0.5); // subtle phi growth
      for (let j = 0; j <= angleSteps; j++) {
        const ang = (j / angleSteps) * Math.PI * 2;
        const normal = new THREE.Vector3()
          .copy(n)
          .multiplyScalar(Math.cos(ang))
          .add(new THREE.Vector3().copy(b).multiplyScalar(Math.sin(ang)));
        const vertex = new THREE.Vector3()
          .copy(point)
          .add(normal.multiplyScalar(radius));
        positions.push(vertex.x, vertex.y, vertex.z);
        normals.push(normal.x, normal.y, normal.z);
      }
    }
    const segRing = radialSegments + 1;
    for (let i = 0; i < tubularSegments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * segRing + j;
        const bIdx = (i + 1) * segRing + j;
        const c = (i + 1) * segRing + (j + 1);
        const d = i * segRing + (j + 1);
        indices.push(a, bIdx, d, bIdx, c, d);
      }
    }
    const tube = new THREE.BufferGeometry();
    tube.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    tube.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    tube.setIndex(indices);
    const mat = new THREE.MeshStandardMaterial({
      color: colGold,
      emissive: colGold.clone().multiplyScalar(0.6),
      metalness: 0.6,
      roughness: 0.3,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(tube, mat);
    // Phase across dimensions (subtle scale/opacity pulse)
    const phase = Math.random() * Math.PI * 2;
    mesh.onBeforeRender = (renderer, scene, camera, geom_, mat_) => {
      const t = performance.now() * 0.001 + phase;
      mat_.opacity = 0.8 + Math.sin(t * 0.6) * 0.15;
      const s = 1 + Math.sin(t * 0.6) * 0.02;
      mesh.scale.set(s, s, s);
    };
    return mesh;
  };

  // Approximate self-intersections via coarse spatial binning of the parametric surface
  const createQuantumClouds = () => {
    const clouds = new THREE.Group();
    const uSeg = 72,
      vSeg = 36;
    const cell = 0.18;
    const bins = new Map();
    const paramPairs = new Map();
    const twoPi = Math.PI * 2;
    for (let i = 0; i <= uSeg; i++) {
      const u = (i / uSeg) * twoPi;
      for (let j = 0; j <= vSeg; j++) {
        const v = (j / vSeg) * twoPi;
        const p = klein(u, v);
        const kx = Math.round(p.x / cell);
        const ky = Math.round(p.y / cell);
        const kz = Math.round(p.z / cell);
        const key = `${kx},${ky},${kz}`;
        if (!bins.has(key)) bins.set(key, []);
        bins.get(key).push(p.clone());
        if (!paramPairs.has(key)) paramPairs.set(key, []);
        paramPairs.get(key).push(new THREE.Vector2(u, v));
      }
    }
    const cloudGeom = new THREE.SphereGeometry(0.09, 12, 12);
    const cloudMat = new THREE.MeshPhysicalMaterial({
      color: colCyan,
      transmission: 0.9,
      transparent: true,
      opacity: 0.45,
      roughness: 0.2,
      metalness: 0.0,
      emissive: colCyan.clone().multiplyScalar(0.5),
      emissiveIntensity: 1.0,
      depthWrite: false,
    });
    for (const [key, pts] of bins.entries()) {
      if (pts.length < 3) continue;
      // Roughly ensure different param sources
      const params = paramPairs.get(key);
      let farParam = false;
      for (let i = 0; i < params.length && !farParam; i++) {
        for (let j = i + 1; j < params.length; j++) {
          const du = Math.abs(params[i].x - params[j].x);
          const dv = Math.abs(params[i].y - params[j].y);
          if (du + dv > 1.5) {
            farParam = true;
            break;
          }
        }
      }
      if (!farParam) continue;
      const center = pts
        .reduce((acc, p) => acc.add(p), new THREE.Vector3())
        .multiplyScalar(1 / pts.length);
      const m = new THREE.Mesh(cloudGeom, cloudMat.clone());
      m.position.copy(center);
      m.userData.pulsePhase = Math.random() * Math.PI * 2;
      m.onBeforeRender = (renderer, scene, camera, g, mat) => {
        const tt = performance.now() * 0.001 + m.userData.pulsePhase;
        const s = 0.9 + Math.sin(tt * 1.8) * 0.2;
        m.scale.setScalar(s);
        mat.opacity = 0.35 + (Math.sin(tt * 1.8) * 0.5 + 0.5) * 0.3;
      };
      clouds.add(m);
    }
    return clouds;
  };

  // Entanglement threads connecting opposite param points
  const createEntanglementThreads = () => {
    const lines = new THREE.Group();
    const pairs = 28;
    const twoPi = Math.PI * 2;
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color("#FFFFFF"),
      transparent: true,
      opacity: 0.5,
    });
    for (let i = 0; i < pairs; i++) {
      const u = Math.random() * twoPi;
      const v = Math.random() * twoPi;
      const p1 = klein(u, v);
      const p2 = klein((u + Math.PI) % twoPi, (v + Math.PI) % twoPi);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
          [p1.x, p1.y, p1.z, p2.x, p2.y, p2.z],
          3
        )
      );
      const line = new THREE.Line(geo, mat);
      const phase = Math.random() * Math.PI * 2;
      line.onBeforeRender = (renderer, scene, camera, g, m) => {
        const t = performance.now() * 0.001 + phase;
        m.opacity = 0.35 + Math.sin(t * 1.2) * 0.15;
      };
      lines.add(line);
    }
    return lines;
  };

  // No internal elements - keep just the clean outer Klein surface
  return group;
}

// Symmetric center ring: clean golden tube ring around the calm core
function createCentralGoldenSymmetry() {
  const R = 0.45; // ring radius at center
  const tubularSegments = 240;
  const radialSegments = 10;
  const thickness = 0.018;
  const positions = [];
  const normals = [];
  const indices = [];

  // Build a simple circle curve around Y-axis
  const twoPi = Math.PI * 2;
  const framesTangent = [];
  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const ang = t * twoPi;
    const x = Math.cos(ang) * R;
    const y = 0;
    const z = Math.sin(ang) * R;

    // Tangent for ring around Y-axis
    const tangent = new THREE.Vector3(-Math.sin(ang), 0, Math.cos(ang));
    const normal = new THREE.Vector3(0, 1, 0).cross(tangent).normalize();
    const binormal = tangent.clone().cross(normal).normalize();
    framesTangent.push({
      p: new THREE.Vector3(x, y, z),
      n: normal,
      b: binormal,
    });
  }

  const segRing = radialSegments + 1;
  for (let i = 0; i <= tubularSegments; i++) {
    const { p, n, b } = framesTangent[i];
    for (let j = 0; j <= radialSegments; j++) {
      const ang = (j / radialSegments) * twoPi;
      const dir = n
        .clone()
        .multiplyScalar(Math.cos(ang))
        .add(b.clone().multiplyScalar(Math.sin(ang)));
      const v = p.clone().add(dir.multiplyScalar(thickness));
      positions.push(v.x, v.y, v.z);
      normals.push(dir.x, dir.y, dir.z);
    }
  }
  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * segRing + j;
      const bIdx = (i + 1) * segRing + j;
      const c = (i + 1) * segRing + (j + 1);
      const d = i * segRing + (j + 1);
      indices.push(a, bIdx, d, bIdx, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setIndex(indices);

  const colGold = new THREE.Color("#FFD700");
  const mat = new THREE.MeshStandardMaterial({
    color: colGold,
    emissive: colGold.clone().multiplyScalar(0.6),
    metalness: 0.6,
    roughness: 0.3,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(geo, mat);
  // Gentle breathing to feel alive but organized
  const phase = Math.random() * Math.PI * 2;
  ring.onBeforeRender = (renderer, scene, camera, g, m) => {
    const t = performance.now() * 0.001 + phase;
    const s = 1 + Math.sin(t * 0.8) * 0.015;
    ring.scale.set(s, s, s);
    m.opacity = 0.8 + Math.sin(t * 0.5) * 0.08;
  };
  return ring;
}

/**
 * Create animated extras for Compound Sphere
 */
function createCompoundSphereExtras(geometry) {
  // Check if this is a floating city - if so, use reduced extras
  if (geometry.userData.isFloatingCity) {
    return createFloatingCityExtras(geometry);
  }

  const group = new THREE.Group();
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

  // Icosahedral vertices for reference
  const a = 1.0 / Math.sqrt(3);
  const b = a / phi;
  const c = a * phi;
  const icoVertices = [
    [0, b, -c],
    [b, c, 0],
    [-b, c, 0],
    [0, b, c],
    [0, -b, c],
    [-c, 0, b],
    [c, 0, b],
    [0, -b, -c],
    [c, 0, -b],
    [-c, 0, -b],
    [b, -c, 0],
    [-b, -c, 0],
  ];

  // ========================================
  // 1. ORBITAL RINGS (like electrons)
  // ========================================
  function createOrbitalRing(radius, tilt, particleCount, color, speed) {
    const ringGroup = new THREE.Group();
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const particleGeom = new THREE.SphereGeometry(0.12, 12, 12);
      const particleMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
      });
      const particle = new THREE.Mesh(particleGeom, particleMat);

      // Add glow
      const glowGeom = new THREE.SphereGeometry(0.18, 12, 12);
      const glowMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        side: THREE.BackSide,
      });
      const glow = new THREE.Mesh(glowGeom, glowMat);
      particle.add(glow);

      particle.userData = {
        angle: (i / particleCount) * Math.PI * 2,
        radius,
        speed,
      };
      particles.push(particle);
      ringGroup.add(particle);
    }

    ringGroup.rotation.x = tilt.x;
    ringGroup.rotation.y = tilt.y;
    ringGroup.rotation.z = tilt.z;

    ringGroup.userData = { particles };
    return ringGroup;
  }

  const ring1 = createOrbitalRing(2.5, { x: 0, y: 0, z: 0 }, 12, 0x00ffff, 1.0);
  const ring2 = createOrbitalRing(
    2.8,
    { x: Math.PI / 3, y: 0, z: 0 },
    10,
    0xff00ff,
    0.8
  );
  const ring3 = createOrbitalRing(
    3.1,
    { x: 0, y: Math.PI / 4, z: Math.PI / 4 },
    8,
    0xffff00,
    1.2
  );

  group.add(ring1, ring2, ring3);

  // ========================================
  // 2. FIBONACCI SPIRAL ORBS (Large visible orbs)
  // ========================================
  const fibOrbs = [];
  const fibCount = 30;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < fibCount; i++) {
    const t = i / fibCount;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = goldenAngle * i;

    // Create larger orbs with gradient
    const orbGeom = new THREE.SphereGeometry(0.15, 16, 16);
    const orbColor = new THREE.Color().setHSL(i / fibCount, 1.0, 0.6);
    const orbMat = new THREE.MeshBasicMaterial({
      color: orbColor,
      transparent: true,
      opacity: 0.85,
    });
    const orb = new THREE.Mesh(orbGeom, orbMat);

    // Add bright glow
    const glowGeom = new THREE.SphereGeometry(0.25, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: orbColor,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeom, glowMat);
    orb.add(glow);

    orb.userData = {
      baseInclination: inclination,
      baseAzimuth: azimuth,
      orbitRadius: 3.5,
      orbitSpeed: 0.4 + (i % 5) * 0.1,
      phaseOffset: i * 0.2,
      pulseSpeed: 1.5 + (i % 4) * 0.3,
    };

    fibOrbs.push(orb);
    group.add(orb);
  }

  // ========================================
  // 3. ENERGY STREAMS (between icosahedral vertices)
  // ========================================
  const energyStreams = [];
  const streamConnections = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0], // Top ring
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4], // Bottom ring
    [0, 6],
    [1, 5],
    [2, 4],
    [3, 7], // Vertical connections
  ];

  streamConnections.forEach(([idx1, idx2], streamIdx) => {
    const particles = [];
    const particlesPerStream = 8;
    const streamColor = new THREE.Color().setHSL(
      streamIdx / streamConnections.length,
      1.0,
      0.5
    );

    for (let i = 0; i < particlesPerStream; i++) {
      const particleGeom = new THREE.SphereGeometry(0.03, 6, 6);
      const particleMat = new THREE.MeshBasicMaterial({
        color: streamColor,
        transparent: true,
        opacity: 0.6,
      });
      const particle = new THREE.Mesh(particleGeom, particleMat);

      particle.userData = {
        startVertex: icoVertices[idx1],
        endVertex: icoVertices[idx2],
        progress: i / particlesPerStream,
        speed: 0.015,
        scale: 0.88,
      };

      particles.push(particle);
      group.add(particle);
    }

    energyStreams.push(particles);
  });

  // ========================================
  // 4. LIGHTNING ARCS (geodesic paths)
  // ========================================
  const lightningArcs = [];
  const arcConnections = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ]; // Top ring connections

  arcConnections.forEach(([idx1, idx2]) => {
    const segments = 12;
    const points = [];
    const [x1, y1, z1] = icoVertices[idx1];
    const [x2, y2, z2] = icoVertices[idx2];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = x1 * (1 - t) + x2 * t;
      const y = y1 * (1 - t) + y2 * t;
      const z = z1 * (1 - t) + z2 * t;
      const len = Math.sqrt(x * x + y * y + z * z);
      points.push(
        new THREE.Vector3((x / len) * 0.88, (y / len) * 0.88, (z / len) * 0.88)
      );
    }

    const arcGeom = new THREE.BufferGeometry().setFromPoints(points);
    const arcMat = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.0,
      linewidth: 2,
    });
    const arc = new THREE.Line(arcGeom, arcMat);

    arc.userData = { baseOpacity: 0.8, pulseSpeed: 2 + Math.random() * 2 };
    lightningArcs.push(arc);
    group.add(arc);
  });

  // ========================================
  // 5. HOPF FLOW LINES
  // ========================================
  const hopfFlows = [];
  const hopfCircles = 3;
  const pointsPerCircle = 24;

  for (let circle = 0; circle < hopfCircles; circle++) {
    const circlePhase = (circle / hopfCircles) * Math.PI * 2;
    const points = [];

    for (let i = 0; i <= pointsPerCircle; i++) {
      const t = (i / pointsPerCircle) * Math.PI * 2;
      const hopfRadius = 0.55;
      const x = hopfRadius * Math.cos(t) * Math.cos(circlePhase);
      const y = hopfRadius * Math.cos(t) * Math.sin(circlePhase);
      const z = hopfRadius * Math.sin(t);
      points.push(new THREE.Vector3(x, y, z));
    }

    const hopfGeom = new THREE.BufferGeometry().setFromPoints(points);
    const hopfMat = new THREE.LineBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.4,
      linewidth: 2,
    });
    const hopfLine = new THREE.Line(hopfGeom, hopfMat);

    hopfLine.userData = { circleIndex: circle, flowSpeed: 0.5 };
    hopfFlows.push(hopfLine);
    group.add(hopfLine);
  }

  // ========================================
  // 6. WAVE PROPAGATION (from center outward)
  // ========================================
  const waveRings = [];
  const waveCount = 5;

  for (let i = 0; i < waveCount; i++) {
    const segments = 32;
    const waveGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(segments * 3);

    for (let j = 0; j < segments; j++) {
      const angle = (j / segments) * Math.PI * 2;
      positions[j * 3] = Math.cos(angle);
      positions[j * 3 + 1] = Math.sin(angle);
      positions[j * 3 + 2] = 0;
    }

    waveGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const waveMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.0,
      linewidth: 2,
    });
    const waveRing = new THREE.LineLoop(waveGeom, waveMat);

    waveRing.userData = {
      waveIndex: i,
      currentRadius: 0,
      maxRadius: 2.0,
      speed: 0.3,
      delay: i * 0.5,
    };

    waveRings.push(waveRing);
    group.add(waveRing);
  }

  // ========================================
  // 7. INTERNAL FIBONACCI ORBITING SPHERES
  // ========================================
  const internalOrbs = [];
  const internalOrbCount = 20;
  // Reuse goldenAngle already defined above

  for (let i = 0; i < internalOrbCount; i++) {
    const t = i / internalOrbCount;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = goldenAngle * i;

    // Create glowing orbs (LARGER and more visible)
    const orbSize = 0.15 + (i % 3) * 0.03; // Varying sizes - much larger
    const orbGeom = new THREE.SphereGeometry(orbSize, 16, 16);
    const orbColor = new THREE.Color().setHSL(i / internalOrbCount, 1.0, 0.7);
    const orbMat = new THREE.MeshBasicMaterial({
      color: orbColor,
      transparent: true,
      opacity: 0.9,
    });
    const orb = new THREE.Mesh(orbGeom, orbMat);

    // Add glow (larger and brighter)
    const glowGeom = new THREE.SphereGeometry(orbSize * 2.0, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: orbColor,
      transparent: true,
      opacity: 0.5,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeom, glowMat);
    orb.add(glow);

    orb.userData = {
      baseInclination: inclination,
      baseAzimuth: azimuth,
      orbitRadius: 0.5 + (i % 5) * 0.15, // Inner orbits (0.5 to 1.1)
      orbitSpeed: 0.5 + (i % 4) * 0.15,
      phaseOffset: i * 0.25,
      pulseSpeed: 1.2 + (i % 3) * 0.3,
      bobSpeed: 0.8 + (i % 3) * 0.2,
      bobAmplitude: 0.1 + (i % 3) * 0.05,
    };

    internalOrbs.push(orb);
    group.add(orb);
  }

  // ========================================
  // ANIMATION CALLBACK
  // ========================================
  group.onBeforeRender = () => {
    const t = performance.now() * 0.001;

    // Animate orbital rings
    [ring1, ring2, ring3].forEach((ring) => {
      ring.userData.particles.forEach((particle) => {
        particle.userData.angle += 0.016 * particle.userData.speed;
        const x = Math.cos(particle.userData.angle) * particle.userData.radius;
        const z = Math.sin(particle.userData.angle) * particle.userData.radius;
        particle.position.set(x, 0, z);

        // Pulse opacity
        particle.material.opacity =
          0.6 + Math.sin(t * 3 + particle.userData.angle) * 0.3;
      });
    });

    // Animate Fibonacci spiral orbs
    fibOrbs.forEach((orb) => {
      const data = orb.userData;
      const orbitPhase = t * data.orbitSpeed + data.phaseOffset;

      const x =
        Math.sin(data.baseInclination) *
        Math.cos(data.baseAzimuth + orbitPhase) *
        data.orbitRadius;
      const y =
        Math.sin(data.baseInclination) *
        Math.sin(data.baseAzimuth + orbitPhase) *
        data.orbitRadius;
      const z = Math.cos(data.baseInclination) * data.orbitRadius;

      orb.position.set(x, y, z);

      // Pulsing scale and opacity
      const pulse =
        Math.sin(t * data.pulseSpeed + data.phaseOffset) * 0.5 + 0.5;
      const scale = 1 + pulse * 0.3;
      orb.scale.setScalar(scale);
      orb.material.opacity = 0.7 + pulse * 0.3;
    });

    // Animate internal orbiting spheres (Fibonacci spiral inside)
    internalOrbs.forEach((orb) => {
      const data = orb.userData;
      const orbitPhase = t * data.orbitSpeed + data.phaseOffset;

      // Fibonacci spiral motion (inside the main sphere)
      const x =
        Math.sin(data.baseInclination) *
        Math.cos(data.baseAzimuth + orbitPhase) *
        data.orbitRadius;
      const y =
        Math.sin(data.baseInclination) *
        Math.sin(data.baseAzimuth + orbitPhase) *
        data.orbitRadius;
      const z = Math.cos(data.baseInclination) * data.orbitRadius;

      // Add gentle bobbing motion
      const bob =
        Math.sin(t * data.bobSpeed + data.phaseOffset) * data.bobAmplitude;

      orb.position.set(x, y + bob, z);

      // Pulsing scale and glow
      const pulse =
        Math.sin(t * data.pulseSpeed + data.phaseOffset) * 0.5 + 0.5;
      const scale = 0.8 + pulse * 0.4;
      orb.scale.setScalar(scale);
      orb.material.opacity = 0.6 + pulse * 0.4;
    });

    // Animate energy streams
    energyStreams.forEach((particles) => {
      particles.forEach((particle) => {
        const data = particle.userData;
        data.progress += data.speed;
        if (data.progress > 1) data.progress = 0;

        const [x1, y1, z1] = data.startVertex;
        const [x2, y2, z2] = data.endVertex;

        const t_interp = data.progress;
        const x = x1 * (1 - t_interp) + x2 * t_interp;
        const y = y1 * (1 - t_interp) + y2 * t_interp;
        const z = z1 * (1 - t_interp) + z2 * t_interp;

        particle.position.set(x * data.scale, y * data.scale, z * data.scale);
        particle.material.opacity = Math.sin(data.progress * Math.PI) * 0.8;
      });
    });

    // Animate lightning arcs (random flashes)
    lightningArcs.forEach((arc) => {
      const pulse = Math.sin(t * arc.userData.pulseSpeed) * 0.5 + 0.5;
      const flash = Math.random() > 0.97 ? 1.0 : 0;
      arc.material.opacity =
        pulse * arc.userData.baseOpacity * 0.3 + flash * 0.8;
    });

    // Animate Hopf flow lines
    hopfFlows.forEach((hopf) => {
      hopf.rotation.z += 0.005 * hopf.userData.flowSpeed;
      const pulse = Math.sin(t * 1.5 + hopf.userData.circleIndex) * 0.5 + 0.5;
      hopf.material.opacity = 0.2 + pulse * 0.4;
    });

    // Animate wave propagation
    waveRings.forEach((wave) => {
      const data = wave.userData;
      const effectiveTime = t - data.delay;

      if (effectiveTime > 0) {
        data.currentRadius += data.speed * 0.016;

        if (data.currentRadius > data.maxRadius) {
          data.currentRadius = 0;
        }

        wave.scale.setScalar(data.currentRadius);

        const fadeIn = Math.min(data.currentRadius / 0.3, 1);
        const fadeOut = 1 - data.currentRadius / data.maxRadius;
        wave.material.opacity = fadeIn * fadeOut * 0.6;
      }
    });
  };

  return group;
}

// Floating City Extras - Reduced hyperframe density for open viewing
function createFloatingCityExtras(geometry) {
  const group = new THREE.Group();
  const phi = (1 + Math.sqrt(5)) / 2;

  // Only 2 minimal orbital rings (instead of 3)
  function createOrbitalRing(radius, tilt, particleCount, color, speed) {
    const ringGroup = new THREE.Group();
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const particleGeom = new THREE.SphereGeometry(0.08, 10, 10); // Smaller
      const particleMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.7, // More transparent
      });
      const particle = new THREE.Mesh(particleGeom, particleMat);

      // Smaller glow
      const glowGeom = new THREE.SphereGeometry(0.12, 10, 10);
      const glowMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide,
      });
      const glow = new THREE.Mesh(glowGeom, glowMat);
      particle.add(glow);

      particle.userData = {
        angle: (i / particleCount) * Math.PI * 2,
        radius,
        speed,
      };
      particles.push(particle);
      ringGroup.add(particle);
    }

    ringGroup.rotation.x = tilt.x;
    ringGroup.rotation.y = tilt.y;
    ringGroup.rotation.z = tilt.z;

    ringGroup.userData = { particles };
    return ringGroup;
  }

  // Only 2 rings, fewer particles
  const ring1 = createOrbitalRing(2.8, { x: 0, y: 0, z: 0 }, 8, 0x00ccff, 1.0);
  const ring2 = createOrbitalRing(
    3.2,
    { x: Math.PI / 3, y: 0, z: 0 },
    6,
    0xff66ff,
    0.8
  );

  group.add(ring1, ring2);

  // Reduced Fibonacci orbs (only 12 instead of 30)
  const fibCount = 12;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < fibCount; i++) {
    const t = i / fibCount;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = goldenAngle * i;

    const orbGeom = new THREE.SphereGeometry(0.1, 12, 12); // Smaller
    const orbColor = new THREE.Color().setHSL(i / fibCount, 0.8, 0.5);
    const orbMat = new THREE.MeshBasicMaterial({
      color: orbColor,
      transparent: true,
      opacity: 0.7, // More transparent
    });
    const orb = new THREE.Mesh(orbGeom, orbMat);

    const radius = 4.0;
    orb.position.set(
      radius * Math.sin(inclination) * Math.cos(azimuth),
      radius * Math.cos(inclination),
      radius * Math.sin(inclination) * Math.sin(azimuth)
    );

    group.add(orb);
  }

  // Minimal pulsing waves (only 3 instead of 6)
  const waveCount = 3;
  for (let i = 0; i < waveCount; i++) {
    const waveGeom = new THREE.TorusGeometry(1.0, 0.01, 8, 32);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    const wave = new THREE.Mesh(waveGeom, waveMat);

    wave.userData = {
      speed: 0.3 + i * 0.1,
      maxRadius: 4.0,
      currentRadius: (i / waveCount) * 4.0,
    };

    group.add(wave);
  }

  // Animation function
  group.userData.animate = (deltaTime) => {
    // Animate orbital rings
    [ring1, ring2].forEach((ring) => {
      ring.userData.particles.forEach((particle) => {
        const data = particle.userData;
        data.angle += deltaTime * data.speed;

        particle.position.x = Math.cos(data.angle) * data.radius;
        particle.position.z = Math.sin(data.angle) * data.radius;
      });
    });

    // Animate waves
    group.children.forEach((child) => {
      if (child.userData.speed && child.geometry.type === "TorusGeometry") {
        const data = child.userData;
        data.currentRadius += deltaTime * data.speed;

        if (data.currentRadius > data.maxRadius) {
          data.currentRadius = 0;
        }

        child.scale.setScalar(data.currentRadius);

        const fadeIn = Math.min(data.currentRadius / 0.3, 1);
        const fadeOut = 1 - data.currentRadius / data.maxRadius;
        child.material.opacity = fadeIn * fadeOut * 0.4; // Even more transparent
      }
    });
  };

  return group;
}
