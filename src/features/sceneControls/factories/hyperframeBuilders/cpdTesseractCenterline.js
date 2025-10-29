import * as THREE from "three";
import { createCpdTesseractWireframe } from "../wireframeBuilders/cpdTesseractWireframe";

const CENTERLINE_SCALE = 0.6;
const CONNECTOR_RADIUS = 0.0025;
const CONNECTOR_SEGMENTS = 10;

function makeConnectionKey(a, b) {
  const keyA = `${a.x.toFixed(5)}_${a.y.toFixed(5)}_${a.z.toFixed(5)}`;
  const keyB = `${b.x.toFixed(5)}_${b.y.toFixed(5)}_${b.z.toFixed(5)}`;
  return keyA < keyB ? `${keyA}|${keyB}` : `${keyB}|${keyA}`;
}

function collectUniqueVertices(bufferGeometry, precision = 4) {
  const positionsAttr = bufferGeometry.getAttribute("position");
  if (!positionsAttr) return [];

  const positions = positionsAttr.array;
  const unique = new Map();

  for (let i = 0; i < positions.length; i += 3) {
    const vertex = new THREE.Vector3(
      positions[i],
      positions[i + 1],
      positions[i + 2]
    );
    const key = `${vertex.x.toFixed(precision)}_${vertex.y.toFixed(
      precision
    )}_${vertex.z.toFixed(precision)}`;
    if (!unique.has(key)) {
      unique.set(key, vertex);
    }
  }

  return Array.from(unique.values());
}

function createCylinderBetweenPoints(start, end, radius, material) {
  const distance = start.distanceTo(end);
  if (distance < 1e-4) return null;

  const cylinderGeom = new THREE.CylinderGeometry(
    radius,
    radius,
    distance,
    CONNECTOR_SEGMENTS
  );
  const cylinderMesh = new THREE.Mesh(cylinderGeom, material);

  const midpoint = start.clone().add(end).multiplyScalar(0.5);
  cylinderMesh.position.copy(midpoint);
  cylinderMesh.lookAt(end);
  cylinderMesh.rotateX(Math.PI / 2);

  cylinderMesh.userData.baseLength = distance;
  cylinderMesh.userData.skipDynamicUpdates = true;

  return cylinderMesh;
}

/**
 * Build a half-scale centerline duplicate for the compound tesseract (object type "box").
 * Reuses the compound tesseract wireframe builder to mirror the exact edge layout while
 * keeping only the red inner cube skeleton (no frustum connectors).
 */
export function createCpdTesseractCenterline(
  geometry,
  hyperframeColor,
  _hyperframeLineColor
) {
  const workingGeometry = geometry.clone();
  workingGeometry.computeBoundingBox();

  const bbox = workingGeometry.boundingBox;
  const center = bbox.getCenter(new THREE.Vector3());

  // Recenter, scale to half size, and restore position so the duplicate sits at the core
  workingGeometry.translate(-center.x, -center.y, -center.z);
  workingGeometry.scale(CENTERLINE_SCALE, CENTERLINE_SCALE, CENTERLINE_SCALE);
  workingGeometry.translate(center.x, center.y, center.z);
  workingGeometry.computeBoundingBox();
  workingGeometry.computeBoundingSphere();

  const centerLinesMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(hyperframeColor || "#ff003c"),
    transparent: false,
    opacity: 1.0,
  });

  const centerLines = createCpdTesseractWireframe(
    workingGeometry,
    centerLinesMaterial,
    {
      radiusScale: 0.45,
    }
  );

  if (centerLines) {
    centerLines.position.set(0, 0, 0);
    // Prevent animation systems from trying to deform these lines
    centerLines.userData.edgePairs = null;
    centerLines.userData.skipDynamicUpdates = true;
  }

  const connectorsMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(_hyperframeLineColor || "#4cff88"),
    transparent: false,
    opacity: 1,
  });

  const curvedLines = new THREE.Group();
  curvedLines.name = "cpdTesseractConnectors";

  const sourceEdgesGeometry = new THREE.EdgesGeometry(workingGeometry);
  const targetEdgesGeometry = new THREE.EdgesGeometry(geometry);

  const sourceVertices = collectUniqueVertices(sourceEdgesGeometry, 4);
  const targetVertices = collectUniqueVertices(targetEdgesGeometry, 4);

  const targetRadii = targetVertices.map((vertex) =>
    vertex.clone().sub(center).length()
  );
  const expectedOuterRadius = Math.max(...targetRadii, 0);
  const minOuterRadius = expectedOuterRadius * 0.75;
  const maxOuterRadius = expectedOuterRadius + 0.1;

  const usedConnections = new Set();

  sourceVertices.forEach((sourceVertex) => {
    const sourceDir = sourceVertex.clone().sub(center);
    const sourceRadius = sourceDir.length();
    if (sourceRadius < 1e-6) return;
    sourceDir.normalize();

    let bestTarget = null;
    let bestAlignment = -Infinity;
    let smallestRadiusDiff = Infinity;

    targetVertices.forEach((targetVertex) => {
      const targetDir = targetVertex.clone().sub(center);
      const targetRadius = targetDir.length();
      if (targetRadius <= sourceRadius + 1e-3) return;

      if (targetRadius < minOuterRadius || targetRadius > maxOuterRadius)
        return;

      targetDir.normalize();
      const alignment = sourceDir.dot(targetDir);
      if (alignment < 0.9) return;

      const radiusDiff = targetRadius - sourceRadius;
      const isBetterAlignment = alignment > bestAlignment + 1e-4;
      const isCloserRadius =
        Math.abs(alignment - bestAlignment) <= 1e-4 &&
        radiusDiff < smallestRadiusDiff;

      if (isBetterAlignment || isCloserRadius) {
        bestAlignment = alignment;
        smallestRadiusDiff = radiusDiff;
        bestTarget = targetVertex;
      }
    });

    if (!bestTarget) return;

    const key = makeConnectionKey(sourceVertex, bestTarget);
    if (usedConnections.has(key)) return;

    const connector = createCylinderBetweenPoints(
      sourceVertex,
      bestTarget,
      CONNECTOR_RADIUS,
      connectorsMaterial
    );
    if (!connector) return;

    usedConnections.add(key);
    curvedLines.add(connector);
  });

  sourceEdgesGeometry.dispose();
  targetEdgesGeometry.dispose();

  curvedLines.userData.skipDynamicUpdates = true;
  curvedLines.userData.edgePairs = null;

  return {
    centerLines,
    centerLinesMaterial,
    curvedLines,
    curvedLinesMaterial: connectorsMaterial,
  };
}
