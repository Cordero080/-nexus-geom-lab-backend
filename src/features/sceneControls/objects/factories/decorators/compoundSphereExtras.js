/**
 * Compound Sphere Decorators
 *
 * Creates elaborate visual effects for compound sphere geometries:
 * - Orbital rings with animated particles
 * - Fibonacci spiral orbs with golden ratio spacing
 * - Energy streams connecting icosahedral vertices
 * - Lightning arcs along geodesic paths
 * - Hopf flow lines showing topological structure
 * - Wave propagation from center
 * - Internal orbiting spheres
 * 
 * Includes special handling for Floating City geometries (reduced density)
 */

import * as THREE from "three";

/**
 * Creates animated extras for Compound Sphere
 * @param {THREE.BufferGeometry} geometry - The base compound sphere geometry
 * @returns {THREE.Group} Group containing all extra visual elements
 */
export function createCompoundSphereExtras(geometry) {
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

/**
 * Creates reduced-density extras for Floating City geometries
 * Lighter version to maintain visibility of city structures
 * 
 * @param {THREE.BufferGeometry} geometry - The base floating city geometry
 * @returns {THREE.Group} Group containing minimal extra visual elements
 */
export function createFloatingCityExtras(geometry) {
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
