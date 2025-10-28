import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Creates a floating city geometry with thin curves and negative space
 *
 * Ethereal architectural structure with:
 * - 5 foundation ring platforms with district nodes
 * - 6 vertical elevator shaft connectors
 * - 4 orbital ring structures with stations
 * - Central nested core spheres
 * - 8 transport tube segments
 * - 12 skyway bridges
 * - 16 observation spheres (Fibonacci distribution)
 * - 40 accent light spheres
 * - Spire rings at both poles
 *
 * @param {Object} options - Configuration options
 * @param {number} options.scale - Scale multiplier (default: 0.72)
 * @returns {THREE.BufferGeometry}
 */
export function createFloatingCity(options = {}) {
  const parts = [];
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
  const scale = options.scale || 0.72; // Scale down by 28% (60% + 20% = 72% of original size)

  // FOUNDATION RING PLATFORMS - Thin tori as floating platforms
  const platformLevels = 5;
  for (let level = 0; level < platformLevels; level++) {
    const yPos = (level / (platformLevels - 1) - 0.5) * 2.5 * scale;
    const radius = (1.2 - Math.abs(yPos / scale) * 0.2) * scale; // Narrower at top/bottom
    const platform = new THREE.TorusGeometry(radius, 0.02 * scale, 8, 32);
    platform.translate(0, yPos, 0);
    parts.push(platform);

    // District nodes on each platform (small spheres)
    const nodesPerLevel = 8 + level * 2; // More nodes on middle levels
    for (let i = 0; i < nodesPerLevel; i++) {
      const angle = (i / nodesPerLevel) * Math.PI * 2;
      const node = new THREE.SphereGeometry(0.04 * scale, 12, 12);
      node.translate(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius);
      parts.push(node);
    }
  }

  // VERTICAL CONNECTORS - Thin tori creating elevator shafts
  const connectorCount = 6;
  for (let i = 0; i < connectorCount; i++) {
    const angle = (i / connectorCount) * Math.PI * 2;
    const offset = 0.8 * scale;

    const connector = new THREE.TorusGeometry(
      0.08 * scale,
      0.015 * scale,
      6,
      24
    );
    connector.rotateX(Math.PI / 2);
    connector.translate(Math.cos(angle) * offset, 0, Math.sin(angle) * offset);
    parts.push(connector);

    // Small spheres along vertical connectors (elevator cars)
    for (let j = 0; j < 4; j++) {
      const yPos = (j / 3 - 0.5) * 2.0 * scale;
      const car = new THREE.SphereGeometry(0.025 * scale, 10, 10);
      car.translate(Math.cos(angle) * offset, yPos, Math.sin(angle) * offset);
      parts.push(car);
    }
  }

  // ORBITAL RING STRUCTURES - Diagonal rings at golden angle
  const orbitalRings = 4;
  for (let i = 0; i < orbitalRings; i++) {
    const angle = (i / orbitalRings) * Math.PI * 2;
    const tiltAngle = Math.PI / 6;

    const ring = new THREE.TorusGeometry(1.4 * scale, 0.018 * scale, 8, 40);
    ring.rotateX(tiltAngle);
    ring.rotateY(angle);
    parts.push(ring);

    // Orbital stations (spheres) on each ring
    const stationsPerRing = 12;
    for (let j = 0; j < stationsPerRing; j++) {
      const ringAngle = (j / stationsPerRing) * Math.PI * 2;
      const station = new THREE.SphereGeometry(0.035 * scale, 12, 12);

      // Position on tilted ring
      const x = 1.4 * scale * Math.cos(ringAngle);
      const y = 1.4 * scale * Math.sin(ringAngle) * Math.cos(tiltAngle);
      const z = 1.4 * scale * Math.sin(ringAngle) * Math.sin(tiltAngle);

      // Rotate around Y axis for each orbital ring
      const finalX = x * Math.cos(angle) - z * Math.sin(angle);
      const finalZ = x * Math.sin(angle) + z * Math.cos(angle);

      station.translate(finalX, y, finalZ);
      parts.push(station);
    }
  }

  // CENTRAL CORE SPHERES - Nested spheres as city center
  const coreSpheres = [0.15, 0.25, 0.35];
  coreSpheres.forEach((radius) => {
    const core = new THREE.SphereGeometry(radius * scale, 16, 16);
    parts.push(core);
  });

  // TRANSPORT TUBES - Curved paths connecting districts
  const tubeSegments = 8;
  for (let i = 0; i < tubeSegments; i++) {
    const angle1 = (i / tubeSegments) * Math.PI * 2;
    const angle2 = ((i + 1) / tubeSegments) * Math.PI * 2;
    const radius = 1.0 * scale;

    // Create curved tube as small torus
    const tube = new THREE.TorusGeometry(0.12 * scale, 0.012 * scale, 6, 16);
    tube.rotateZ(Math.PI / 2);

    // Position between two points on a circle
    const midAngle = (angle1 + angle2) / 2;
    tube.rotateY(midAngle);
    tube.translate(
      Math.cos(midAngle) * radius,
      Math.sin(i * 0.5) * 0.3 * scale, // Vertical wave
      Math.sin(midAngle) * radius
    );
    parts.push(tube);
  }

  // SKYWAY BRIDGES - Thin diagonal connections
  const bridgeCount = 12;
  for (let i = 0; i < bridgeCount; i++) {
    const angle = (i / bridgeCount) * Math.PI * 2;
    const level = Math.floor(i / 3);
    const yStart = (level / 4 - 0.5) * 2.0 * scale;
    const yEnd = yStart + 0.5 * scale;

    const bridge = new THREE.TorusGeometry(0.06 * scale, 0.01 * scale, 6, 12);

    // Tilt for diagonal connection
    bridge.rotateX(Math.PI / 6);
    bridge.rotateY(angle);
    bridge.translate(
      Math.cos(angle) * 0.9 * scale,
      (yStart + yEnd) / 2,
      Math.sin(angle) * 0.9 * scale
    );
    parts.push(bridge);
  }

  // OBSERVATION SPHERES - Floating viewpoints at golden ratio positions
  const observationPoints = 16;
  for (let i = 0; i < observationPoints; i++) {
    // Fibonacci sphere distribution
    const y = 1 - (i / (observationPoints - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = i * phi * Math.PI * 2;

    const sphere = new THREE.SphereGeometry(0.03 * scale, 10, 10);
    sphere.translate(
      radius * Math.cos(theta) * 1.6 * scale,
      y * 1.2 * scale,
      radius * Math.sin(theta) * 1.6 * scale
    );
    parts.push(sphere);
  }

  // ACCENT SPHERES - Tiny lights scattered throughout
  const accentCount = 40;
  for (let i = 0; i < accentCount; i++) {
    const angle = (i / accentCount) * Math.PI * 2 * phi; // Golden angle
    const radius = (0.6 + Math.random() * 0.8) * scale;
    const yPos = (Math.random() - 0.5) * 2.0 * scale;

    const accent = new THREE.SphereGeometry(0.015 * scale, 8, 8);
    accent.translate(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius);
    parts.push(accent);
  }

  // SPIRE RINGS - Thin rings at the poles
  for (let pole = 0; pole < 2; pole++) {
    const yPos = (pole === 0 ? 1.5 : -1.5) * scale;

    for (let ring = 0; ring < 3; ring++) {
      const ringRadius = (0.3 + ring * 0.15) * scale;
      const spireRing = new THREE.TorusGeometry(
        ringRadius,
        0.012 * scale,
        6,
        20
      );
      spireRing.translate(
        0,
        yPos - ring * 0.2 * scale * (pole === 0 ? 1 : -1),
        0
      );
      parts.push(spireRing);

      // Small spheres on spire rings
      const nodesOnSpire = 6 + ring * 2;
      for (let i = 0; i < nodesOnSpire; i++) {
        const angle = (i / nodesOnSpire) * Math.PI * 2;
        const node = new THREE.SphereGeometry(0.02 * scale, 8, 8);
        node.translate(
          Math.cos(angle) * ringRadius,
          yPos - ring * 0.2 * scale * (pole === 0 ? 1 : -1),
          Math.sin(angle) * ringRadius
        );
        parts.push(node);
      }
    }
  }

  // Merge all parts
  const mergedCity = mergeGeometries(parts, false);
  mergedCity.computeVertexNormals();

  // Mark as floating city
  mergedCity.userData.isCompound = true;
  mergedCity.userData.baseType = "SphereGeometry";
  mergedCity.userData.isFloatingCity = true;
  mergedCity.userData.componentCount = parts.length;

  return mergedCity;
}

/**
 * Metadata for the floating city geometry
 */
export const metadata = {
  name: "floatingcity",
  displayName: "🏙️ Floating City",
  category: "curved",
  description:
    "Ethereal architectural structure with thin curves and massive negative space",
  isCompound: true,
  defaultOptions: {
    scale: 0.72,
  },
};
