import * as THREE from "three";
import { createCpdTesseractWireframe } from "../wireframeBuilders/cpdTesseractWireframe";

const OUTER_SIZE = 1.5;
const INNER_SIZE = 0.75;
const INNER_Y_OFFSET = 0.01;
const SECOND_TESSERACT_Y_OFFSET = 0.02;
const SECOND_TESSERACT_ROTATION = Math.PI / 4;
const CENTERLINE_SCALE = 0.6;
const CONNECTOR_RADIUS = 0.006;
const BRIDGE_RADIUS = CONNECTOR_RADIUS * 0.85;
const CONNECTOR_SEGMENTS = 10;

function generateCubeVertices(
  size,
  rotationY = 0,
  localYOffset = 0,
  globalYOffset = 0
) {
  const half = size / 2;
  const vertices = [];
  const rotationMatrix = new THREE.Matrix4();

  if (rotationY !== 0) {
    rotationMatrix.makeRotationY(rotationY);
  }

  const translation = new THREE.Vector3(0, localYOffset + globalYOffset, 0);

  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const vertex = new THREE.Vector3(sx * half, sy * half, sz * half);
        if (rotationY !== 0) {
          vertex.applyMatrix4(rotationMatrix);
        }
        vertex.add(translation);
        vertices.push(vertex);
      }
    }
  }

  return vertices;
}

function applyCenterScaling(vertices, center, scale) {
  return vertices.map((v) =>
    v.clone().sub(center).multiplyScalar(scale).add(center)
  );
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

  const axisOuterVertices = generateCubeVertices(OUTER_SIZE, 0, 0, 0);
  const axisInnerVertices = generateCubeVertices(
    INNER_SIZE,
    0,
    INNER_Y_OFFSET,
    0
  );

  const rotatedOuterVertices = generateCubeVertices(
    OUTER_SIZE,
    SECOND_TESSERACT_ROTATION,
    0,
    SECOND_TESSERACT_Y_OFFSET
  );
  const rotatedInnerVertices = generateCubeVertices(
    INNER_SIZE,
    SECOND_TESSERACT_ROTATION,
    INNER_Y_OFFSET,
    SECOND_TESSERACT_Y_OFFSET
  );

  const scaledAxisInner = applyCenterScaling(
    axisInnerVertices,
    center,
    CENTERLINE_SCALE
  );
  const scaledRotatedInner = applyCenterScaling(
    rotatedInnerVertices,
    center,
    CENTERLINE_SCALE
  );

  scaledAxisInner.forEach((innerVertex, index) => {
    const outerVertex = axisOuterVertices[index];
    const connector = createCylinderBetweenPoints(
      innerVertex,
      outerVertex,
      CONNECTOR_RADIUS,
      connectorsMaterial
    );
    if (connector) curvedLines.add(connector);
  });

  scaledRotatedInner.forEach((innerVertex, index) => {
    const outerVertex = rotatedOuterVertices[index];
    const connector = createCylinderBetweenPoints(
      innerVertex,
      outerVertex,
      CONNECTOR_RADIUS,
      connectorsMaterial
    );
    if (connector) curvedLines.add(connector);
  });

  scaledAxisInner.forEach((axisVertex, index) => {
    const rotatedVertex = scaledRotatedInner[index];
    const connector = createCylinderBetweenPoints(
      axisVertex,
      rotatedVertex,
      BRIDGE_RADIUS,
      connectorsMaterial
    );
    if (connector) curvedLines.add(connector);
  });

  curvedLines.userData.skipDynamicUpdates = true;
  curvedLines.userData.edgePairs = null;

  return {
    centerLines,
    centerLinesMaterial,
    curvedLines,
    curvedLinesMaterial: connectorsMaterial,
  };
}
