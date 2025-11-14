/**
 * Hyperframe Assembler
 *
 * Routes geometry to the correct hyperframe builder to create inner spiral/connector lines.
 * Adds visual depth by showing internal dimensional structure within complex geometries.
 */

import * as THREE from 'three';
import { getHyperframeKey, getHyperframeFromCache } from './materialCache';
import { createTetrahedronHyperframe } from './hyperframeBuilders/tetrahedronHyperframe';
import { createBoxHyperframe } from './hyperframeBuilders/boxHyperframe';
import { createOctahedronHyperframe } from './hyperframeBuilders/octahedronHyperframe';
import { createIcosahedronHyperframe } from './hyperframeBuilders/icosahedronHyperframe';
import { createHypercubeHyperframe } from './hyperframeBuilders/hypercubeHyperframe';
import { createSimpleCompoundHypercubeHyperframe } from './hyperframeBuilders/simpleCompoundHypercubeHyperframe';
import { createCompoundHypercubeHyperframe } from './hyperframeBuilders/compoundHypercubeHyperframe';
import { create120CellHyperframe } from './hyperframeBuilders/cell120Hyperframe';
import { createCompound120CellHyperframe } from './hyperframeBuilders/compoundCell120Hyperframe';
import { create24CellHyperframe } from './hyperframeBuilders/cell24Hyperframe';
import { createCompound24CellHyperframe } from './hyperframeBuilders/compoundCell24Hyperframe';
import { create16CellHyperframe } from './hyperframeBuilders/cell16Hyperframe';
import { create600CellHyperframe } from './hyperframeBuilders/cell600Hyperframe';
import { createCompound600CellHyperframe } from './hyperframeBuilders/compoundCell600Hyperframe';
import { createMegaTesseractCenterline } from './hyperframeBuilders/megaTesseractCenterline';
import { createCpdTesseractCenterline } from './hyperframeBuilders/cpdTesseractCenterline';

/**
 * Assembles hyperframe based on geometry type
 * Routes to appropriate hyperframe builder with color configuration
 * Uses caching for complex mega-tesseract variants
 *
 * @param {THREE.BufferGeometry} geometry - The base geometry
 * @param {string} hyperframeColor - Color for spiral center lines
 * @param {string} hyperframeLineColor - Color for edge connections
 * @returns {Object} { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial }
 */
export function assembleHyperframe(geometry, hyperframeColor, hyperframeLineColor) {
  let centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial;

  if (
    geometry.type === 'TetrahedronGeometry' ||
    geometry.constructor.name === 'TetrahedronGeometry' ||
    (geometry.userData && geometry.userData.baseType === 'TetrahedronGeometry')
  ) {
    // Check if it's a 16-cell
    if (geometry.userData && geometry.userData.is16Cell) {
      const result = create16CellHyperframe(geometry, hyperframeColor, hyperframeLineColor);
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
    } else {
      // Regular compound tetrahedron
      const result = createTetrahedronHyperframe(geometry, hyperframeColor, hyperframeLineColor);
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
    }
  } else if (
    geometry.type === 'BoxGeometry' ||
    (geometry.userData && geometry.userData.baseType === 'BoxGeometry') ||
    (geometry.userData && geometry.userData.baseType === 'HypercubeGeometry')
  ) {
    // Check if it's the compound hypercube (9 hypercubes interpenetrating)
    if (
      geometry.userData &&
      geometry.userData.isCpdHypercube &&
      geometry.userData.compoundCount === 9
    ) {
      const result = createCompoundHypercubeHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
    }
    // Check if it's the simple compound hypercube (2 hypercubes interpenetrating)
    else if (
      geometry.userData &&
      geometry.userData.isCpdHypercube &&
      geometry.userData.compoundCount === 2
    ) {
      const result = createSimpleCompoundHypercubeHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
    }
    // Check if it's the new hypercube (tesseract with hyperframe)
    else if (
      geometry.userData &&
      geometry.userData.isHypercube &&
      !geometry.userData.isCpdTesseract
    ) {
      const result = createHypercubeHyperframe(geometry, hyperframeColor, hyperframeLineColor);
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
    }
    // Check if it's a compound tesseract (two interpenetrating 4D hypercubes) or regular tesseract (single 4D hypercube)
    else if (geometry.userData && geometry.userData.isCpdTesseract) {
      const isMega = geometry.userData.isMegaTesseract;
      const isCompoundMega = geometry.userData.isCompoundMegaTesseract;
      const hyperframeKey = getHyperframeKey(geometry, hyperframeColor, hyperframeLineColor);

      if (isCompoundMega) {
        ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
          getHyperframeFromCache(hyperframeKey, () =>
            createCpdTesseractCenterline(geometry, hyperframeColor, hyperframeLineColor)
          ));
      } else if (isMega && !isCompoundMega) {
        ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
          getHyperframeFromCache(hyperframeKey, () =>
            createMegaTesseractCenterline(geometry, hyperframeColor, hyperframeLineColor)
          ));
      } else if (!isMega && !isCompoundMega) {
        ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } =
          getHyperframeFromCache(hyperframeKey, () =>
            createCpdTesseractCenterline(geometry, hyperframeColor, hyperframeLineColor)
          ));
      } else {
        // For other tesseract-based geometries, keep hyperframe disabled
        centerLines = new THREE.Group();
        curvedLines = new THREE.Group();
        centerLinesMaterial = null;
        curvedLinesMaterial = null;
      }
    } else {
      const result = createBoxHyperframe(geometry, hyperframeColor, hyperframeLineColor);
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
    }
  } else if (
    geometry.type === 'OctahedronGeometry' ||
    (geometry.userData && geometry.userData.baseType === 'OctahedronGeometry')
  ) {
    // Check if it's a compound 24-cell
    if (geometry.userData && geometry.userData.isCompound24Cell) {
      const result = createCompound24CellHyperframe(geometry, hyperframeColor, hyperframeLineColor);
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
    }
    // Check if it's a 24-cell
    else if (geometry.userData && geometry.userData.is24Cell) {
      const result = create24CellHyperframe(geometry, hyperframeColor, hyperframeLineColor);
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
    } else {
      // Regular compound octahedron
      const result = createOctahedronHyperframe(geometry, hyperframeColor, hyperframeLineColor);
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
    }
  } else if (
    geometry.type === 'IcosahedronGeometry' ||
    (geometry.userData && geometry.userData.baseType === 'IcosahedronGeometry')
  ) {
    // Check if it's a compound 600-cell
    if (geometry.userData && geometry.userData.isCompound600Cell) {
      const result = createCompound600CellHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
    }
    // Check if it's a 600-cell
    else if (geometry.userData && geometry.userData.is600Cell) {
      const result = create600CellHyperframe(geometry, hyperframeColor, hyperframeLineColor);
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
    } else {
      // Regular compound icosahedron
      const result = createIcosahedronHyperframe(geometry, hyperframeColor, hyperframeLineColor);
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
    }
  } else if (
    geometry.type === 'DodecahedronGeometry' ||
    (geometry.userData && geometry.userData.baseType === 'DodecahedronGeometry')
  ) {
    // Check if it's a compound 120-cell
    if (geometry.userData && geometry.userData.isCompound120Cell) {
      const result = createCompound120CellHyperframe(
        geometry,
        hyperframeColor,
        hyperframeLineColor
      );
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
    } else {
      // Regular 120-cell
      const result = create120CellHyperframe(geometry, hyperframeColor, hyperframeLineColor);
      ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
    }
  } else {
    // OTHER GEOMETRIES: Create generic hyperframes
    const result = createGenericHyperframe(
      geometry,
      hyperframeColor,
      hyperframeLineColor,
      geometry.userData.isFloatingCity // Pass floating city flag
    );
    ({ centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial } = result);
  }

  return { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial };
}

/**
 * Creates generic hyperframes for non-standard geometries (TorusKnot, Manifolds, etc.)
 * Includes spiral center lines and edge connections
 */
function createGenericHyperframe(geometry, spiralColor, edgeColor, isFloatingCity = false) {
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
      'position',
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

    centerLines = new THREE.LineSegments(centerLinesGeometry, centerLinesMaterial);
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
    const edge1Start = [edgeVertices[j], edgeVertices[j + 1], edgeVertices[j + 2]];
    const edge1End = [edgeVertices[j + 3], edgeVertices[j + 4], edgeVertices[j + 5]];

    // Find nearby edges to connect to
    for (let k = j + 6; k < edgeVertices.length && k < j + 36; k += 6) {
      const edge2Start = [edgeVertices[k], edgeVertices[k + 1], edgeVertices[k + 2]];
      const edge2End = [edgeVertices[k + 3], edgeVertices[k + 4], edgeVertices[k + 5]];

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
      'position',
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

    curvedLines = new THREE.LineSegments(curvedLinesGeometry, curvedLinesMaterial);
  } else {
    curvedLines = new THREE.Object3D();
    curvedLinesMaterial = null;
  }

  return { centerLines, centerLinesMaterial, curvedLines, curvedLinesMaterial };
}
