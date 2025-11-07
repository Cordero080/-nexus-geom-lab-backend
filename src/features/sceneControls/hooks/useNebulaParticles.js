import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Creates an unconventional nebula particle system with:
 * - Volumetric layered sheets (not just dots)
 * - Procedural color mutations
 * - Turbulent flow fields
 * - Depth-reactive opacity
 *
 * For sunset environment: Creates floating geometric dust particles
 */
export function useNebulaParticles(
  sceneRef,
  environment,
  environmentHue = 0,
  orbSpeedRef
) {
  const nebulaSystemRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Clean up existing system if switching environments
    if (nebulaSystemRef.current) {
      sceneRef.current.remove(nebulaSystemRef.current.system);
      if (nebulaSystemRef.current.geometry)
        nebulaSystemRef.current.geometry.dispose();
      if (nebulaSystemRef.current.material)
        nebulaSystemRef.current.material.dispose();
      if (nebulaSystemRef.current.texture)
        nebulaSystemRef.current.texture.dispose();
      nebulaSystemRef.current = null;
      sceneRef.current.userData.animateNebula = null;
    }

    // Handle sunset environment - floating geometric dust
    if (environment === "sunset") {
      createSunsetDust();
      return;
    }

    // Only create nebula for 'space' environment
    if (environment !== "space") {
      return;
    }

    function createSunsetDust() {
      const dustCount = 2000; // Increased for better coverage
      const group = new THREE.Group();
      const dustParticles = [];

      // Sunset color palette----------------------
      const sunsetColors = [
        new THREE.Color(0xff6b35), // Orange
        new THREE.Color(0xffd700), // Gold
        new THREE.Color(0xff1493), // Deep pink
        new THREE.Color(0xff8c00), // Dark orange
        new THREE.Color(0xffa500), // Orange
      ];

      for (let i = 0; i < dustCount; i++) {
        // Alternate between small icosahedrons and tetrahedrons
        const geometry =
          i % 2 === 0
            ? new THREE.IcosahedronGeometry(0.2, 0)
            : new THREE.TetrahedronGeometry(0.4, 0);

        const color = sunsetColors[i % sunsetColors.length];

        // Particles in front should be more transparent to not obscure view
        const isFront = Math.random() > 0.5;
        const baseOpacity = isFront ? 0.1 : 0.4;

        const material = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: baseOpacity,
          wireframe: Math.random() > 0.1, // Mix of solid and wireframe
          depthWrite: !isFront, // Particles in front don't write to depth buffer
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Position particles in 3D space around origin
        // Mix of close (in front) and far (behind) particles
        const radius = isFront
          ? 10 + Math.random() * 10 // Close particles (5-15 units from center)
          : 20 + Math.random() * 20; // Far particles (20-80 units from center)

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
        mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
        mesh.position.z = radius * Math.cos(phi);

        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI * 2;
        mesh.rotation.y = Math.random() * Math.PI * 2;
        mesh.rotation.z = Math.random() * Math.PI * 2;

        group.add(mesh);

        // Store animation data
        dustParticles.push({
          mesh,
          isFront,
          baseOpacity,
          rotationSpeed: {
            x: (Math.random() - 1.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 3.5) * 0.01,
          },
          driftSpeed: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 1.5) * 0.015,
            z: (Math.random() - 0.5) * 0.02,
          },
          initialPos: mesh.position.clone(),
          phase: Math.random() * Math.PI * 2,
        });
      }

      sceneRef.current.add(group);
      nebulaSystemRef.current = {
        system: group,
        dustParticles,
      };

      // Animation function for sunset dust
      function animateSunsetDust() {
        if (!nebulaSystemRef.current) return;

        const speed = orbSpeedRef?.current || 1.0;
        timeRef.current += 0.001 * speed;

        const { dustParticles } = nebulaSystemRef.current;

        dustParticles.forEach((particle) => {
          const {
            mesh,
            isFront,
            rotationSpeed,
            driftSpeed,
            initialPos,
            phase,
            baseOpacity,
          } = particle;

          // Gentle rotation
          mesh.rotation.x += rotationSpeed.x * speed;
          mesh.rotation.y += rotationSpeed.y * speed;
          mesh.rotation.z += rotationSpeed.z * speed;

          // Different orbital patterns for front vs back particles
          if (isFront) {
            // Front particles: clockwise orbit around object (XY plane)
            const orbitRadius = 4;
            const orbitSpeed = 0.2;
            const angle = timeRef.current * orbitSpeed + phase;

            mesh.position.x = Math.cos(angle) * orbitRadius;
            mesh.position.y =
              Math.sin(angle) * orbitRadius +
              Math.sin(timeRef.current * 0.3 + phase) * 2;
            mesh.position.z =
              initialPos.z + Math.sin(timeRef.current * 0.4 + phase) * 3;
          } else {
            // Back particles: counter-clockwise orbit in larger radius (XZ plane)
            const orbitRadius = 50;
            const orbitSpeed = 0.15;
            const angle = -(timeRef.current * orbitSpeed + phase); // Negative for counter-clockwise

            mesh.position.x =
              Math.cos(angle) * orbitRadius +
              Math.sin(timeRef.current * 2.2 + phase) * 22.2;
            mesh.position.y =
              initialPos.y + Math.sin(timeRef.current * 1.25 + phase) * 8;
            mesh.position.z = Math.sin(angle) * orbitRadius;
          }

          // Subtle opacity pulse (use baseOpacity for front/back differentiation)
          mesh.material.opacity =
            baseOpacity + Math.sin(timeRef.current + phase) * 0.1;
        });
      }

      sceneRef.current.userData.animateNebula = animateSunsetDust;
    }

    // Configuration - reduced for better performance
    const particleCount = 400;
    const spread = 10;

    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount); // For color mutation
    const orbitRadii = new Float32Array(particleCount); // Distance from center
    const orbitAngles = new Float32Array(particleCount); // Current angle in orbit
    const orbitSpeeds = new Float32Array(particleCount); // Rotation speed
    const spiralFactors = new Float32Array(particleCount); // Fibonacci spiral influence
    const morphPhases = new Float32Array(particleCount); // For pattern morphing
    const orbitGroups = new Float32Array(particleCount); // Which of 3 orbital groups (0, 1, or 2)

    // Cellular automata state (alive/dead or energy level)
    const cellStates = new Float32Array(particleCount); // 0 = dead, 1 = alive
    const cellEnergy = new Float32Array(particleCount); // Energy level for spreading

    // Fractal generation state
    const fractalIterations = new Float32Array(particleCount); // Current iteration depth
    const fractalSeeds = new Float32Array(particleCount); // Random seed for each particle

    // Initialize particles in volumetric sheets
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Assign to one of 3 orbital groups
      const group = i % 3;
      orbitGroups[i] = group;

      // Create layered sheets instead of uniform distribution
      const sheet = Math.floor(Math.random() * 6); // 5 nebula sheets
      const sheetDepth = sheet * 30 - 20; // -40 to +40

      // Different orbital parameters for each group
      // Group 0: Inner orbit, faster
      // Group 1: Middle orbit, medium speed
      // Group 2: Outer orbit, slower
      let baseRadius, speedMultiplier, verticalSpread;

      if (group === 0) {
        baseRadius = 8 + Math.random() * 25; // 8 to 33 units (inner)
        speedMultiplier = 1.5; // Faster
        verticalSpread = 6; // Tighter vertical
      } else if (group === 1) {
        baseRadius = 35 + Math.random() * 30; // 35 to 65 units (middle)
        speedMultiplier = 2.0; // Medium
        verticalSpread = 9; // Medium vertical
      } else {
        baseRadius = 67 + Math.random() * 23; // 67 to 90 units (outer)
        speedMultiplier = 0.7; // Slower
        verticalSpread = 12; // Wider vertical
      }

      orbitRadii[i] = baseRadius;
      orbitAngles[i] = Math.random() * Math.PI * 1; // Random starting angle

      // Set rotation direction based on group:
      // Group 0: Clockwise (positive)
      // Group 1: Counter-clockwise (negative)
      // Group 2: Clockwise (positive)
      const direction = group === 1 ? -1 : 1;
      orbitSpeeds[i] =
        (0.0008 + Math.random() * 0.001) * speedMultiplier * direction;

      // Add Fibonacci spiral influence
      const phi = 1.618033988749895; // Golden ratio
      const goldenAngle = (Math.PI * 2) / (phi * phi); // ~137.5 degrees
      const spiralPhase = i / particleCount;
      spiralFactors[i] = spiralPhase;

      // Bias angle toward Fibonacci pattern (moderate influence)
      const fibonacciAngle = i * goldenAngle;
      orbitAngles[i] = orbitAngles[i] * 0.3 + fibonacciAngle * 0.7; // 70% Fibonacci, 30% random

      // Initial position in orbit
      positions[i3] = Math.cos(orbitAngles[i]) * orbitRadii[i];
      positions[i3 + 1] = (Math.random() - 0.5) * verticalSpread; // Group-specific vertical spread
      positions[i3 + 2] = Math.sin(orbitAngles[i]) * orbitRadii[i];

      // Turbulent flow field velocities - slower for smooth clouds
      const angle = Math.random() * Math.PI * 4;
      const speed = 0.005 + Math.random() * 0.01; // Much slower
      velocities[i3] = Math.cos(angle) * speed;
      velocities[i3 + 1] = Math.sin(angle) * speed * 0.3;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.005;

      // Varying sizes for depth feel - smaller particles
      sizes[i] = 2 + Math.random() * 3;

      // Color phase for mutation
      phases[i] = Math.random() * Math.PI * 2;

      // Morph phase for pattern transitions
      morphPhases[i] = Math.random() * Math.PI * 2;

      // Initialize cellular automata - start some cells alive
      cellStates[i] = Math.random() > 0.85 ? 1 : 0; // 15% start alive
      cellEnergy[i] = cellStates[i] * Math.random(); // Random initial energy

      // Initialize fractal properties
      fractalIterations[i] = 0;
      fractalSeeds[i] = Math.random();

      // Initial colors - softer nebula colors
      const hue = (sheet / 5) * 0.2 + 0.55; // Purple to pink range
      const color = new THREE.Color().setHSL(hue, 0.9, 0.5);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Create a circular texture for particles (this fixes the square issue)
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    // Create radial gradient for soft circular particle
    const gradient = ctx.createRadialGradient(3, 35, 0, 35, 35, 35);
    gradient.addColorStop(0, "rgba(221, 35, 218, 1)");
    gradient.addColorStop(0.3, "rgba(83, 242, 10, 0.83)");
    gradient.addColorStop(0.6, "rgba(221, 8, 186, 0.58)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);

    // Simple PointsMaterial with texture
    const material = new THREE.PointsMaterial({
      size: 3,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });

    const particleSystem = new THREE.Points(geometry, material);
    sceneRef.current.add(particleSystem);
    nebulaSystemRef.current = {
      system: particleSystem,
      geometry,
      material,
      velocities,
      phases,
      texture,
      orbitRadii,
      orbitAngles,
      orbitSpeeds,
      spiralFactors,
      morphPhases,
      orbitGroups,
      cellStates,
      cellEnergy,
      fractalIterations,
      fractalSeeds,
    };

    // Animation function
    function animate() {
      if (!nebulaSystemRef.current) return;

      // Use orb speed to control nebula particle animation speed
      const speed = orbSpeedRef?.current || 1.0;
      timeRef.current += 0.1 * speed; // Nebula speed scales with orb speed

      const {
        geometry,
        velocities,
        phases,
        orbitRadii,
        orbitAngles,
        orbitSpeeds,
        spiralFactors,
        morphPhases,
        orbitGroups,
        cellStates,
        cellEnergy,
        fractalIterations,
        fractalSeeds,
      } = nebulaSystemRef.current;
      const positions = geometry.attributes.position.array;
      const colors = geometry.attributes.color.array;
      const sizes = geometry.attributes.size.array;

      // Morphing pattern: slowly cycle through different distributions
      const morphCycle = (timeRef.current * 0.05) % (Math.PI * 2); // ~60 second cycle
      const morphIntensity = Math.sin(morphCycle) * 0.5 + 0.5; // 0 to 1

      // CELLULAR AUTOMATA: Update every few frames for spreading behavior
      if (Math.floor(timeRef.current) % 3 === 0) {
        // Run cellular automata rules
        const newCellStates = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const x = positions[i3];
          const y = positions[i3 + 1];
          const z = positions[i3 + 2];

          // Find nearby particles (neighbors within distance threshold)
          let aliveNeighbors = 0;
          let totalEnergy = 0;
          const neighborDistance = 15; // Detection radius

          for (let j = 0; j < particleCount; j++) {
            if (i === j) continue;
            const j3 = j * 3;
            const dx = positions[j3] - x;
            const dy = positions[j3 + 1] - y;
            const dz = positions[j3 + 2] - z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < neighborDistance) {
              aliveNeighbors += cellStates[j];
              totalEnergy += cellEnergy[j];
            }
          }

          // Cellular automata rules (modified Conway's Life for 3D space)
          // Cell becomes alive if it has 2-4 alive neighbors, dies otherwise
          if (cellStates[i] === 1) {
            // Alive cell: survive with 2-5 neighbors
            newCellStates[i] =
              aliveNeighbors >= 2 && aliveNeighbors <= 5 ? 1 : 0;
          } else {
            // Dead cell: born with 3-4 neighbors
            newCellStates[i] =
              aliveNeighbors >= 3 && aliveNeighbors <= 4 ? 1 : 0;
          }

          // Energy spreads from neighbors
          cellEnergy[i] = Math.min(1, totalEnergy * 0.15 + cellEnergy[i] * 0.8);
          if (newCellStates[i] === 0) {
            cellEnergy[i] *= 0.95; // Decay when dead
          }
        }

        // Copy new states
        for (let i = 0; i < particleCount; i++) {
          cellStates[i] = newCellStates[i];
        }
      }

      // FRACTAL GENERATION: Julia set-inspired iteration
      // Each particle iterates through fractal calculations
      const fractalTime = timeRef.current * 0.02;
      const cX = Math.cos(fractalTime) * 0.7; // Complex constant for Julia set
      const cY = Math.sin(fractalTime) * 0.3;

      // Update every frame but slowly
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const group = orbitGroups[i];

        // Update orbital angle - scales with orb speed, smooth continuous motion
        orbitAngles[i] += orbitSpeeds[i] * speed;

        // Apply gentle spiral expansion over time (very slow) - group-specific
        const spiralExpansion =
          Math.sin(timeRef.current * 0.01 + spiralFactors[i] * Math.PI) *
          (group === 0 ? 1.5 : group === 1 ? 2 : 2.5);
        const currentRadius = orbitRadii[i] + spiralExpansion;

        // MORPHING: Add pattern variation based on morph cycle
        // Morph between tight spiral and loose cloud
        const morphOffset =
          Math.sin(morphCycle + morphPhases[i]) * 5 * morphIntensity;
        const morphedRadius = currentRadius + morphOffset;

        // Calculate new position based on orbit - SMOOTH continuous circular motion
        const baseX = Math.cos(orbitAngles[i]) * morphedRadius;
        const baseZ = Math.sin(orbitAngles[i]) * morphedRadius;

        // Very subtle turbulence (don't hide the orbit motion) - reduced for smoother flow
        const turbulence = Math.sin(timeRef.current * 0.3 + phases[i]) * 0.2;
        const driftY = Math.sin(timeRef.current * 0.05 + phases[i]) * 0.008;

        // Smooth position updates - no sudden changes
        positions[i3] = baseX + turbulence;
        positions[i3 + 1] += driftY;
        positions[i3 + 2] = baseZ + turbulence * 0.3;

        // Keep vertical position in bounds - gentler correction
        const maxY = group === 0 ? 8 : group === 1 ? 12 : 15;
        if (Math.abs(positions[i3 + 1]) > maxY) {
          positions[i3 + 1] *= 0.95; // Gentle pull back
        }

        // FRACTAL ITERATION: Calculate fractal depth for this particle
        // Using normalized position as seed for Julia-like iteration
        let zX = positions[i3] / 100 + fractalSeeds[i];
        let zY = positions[i3 + 2] / 100 + fractalSeeds[i];
        let iteration = 0;
        const maxIterations = 20;

        // Julia set iteration: z = z² + c
        for (let iter = 0; iter < maxIterations; iter++) {
          const zX2 = zX * zX - zY * zY + cX;
          const zY2 = 2 * zX * zY + cY;
          zX = zX2;
          zY = zY2;

          if (zX * zX + zY * zY > 4) break;
          iteration++;
        }

        fractalIterations[i] = iteration / maxIterations; // Normalize to 0-1

        // Slow color changes with rainbow spectrum cycling
        if (i % 5 === 0) {
          const colorPhase = timeRef.current * 0.5 + phases[i];

          // Cycle through full rainbow spectrum based on morph cycle
          const baseHue =
            (Math.sin(colorPhase) * 0.1 + 0.6 + environmentHue / 360) % 1;
          const morphHue = (spiralFactors[i] + morphCycle * 0.1) % 1; // Rainbow shift

          // Blend between base color and morphing rainbow
          let hue =
            baseHue * (1 - morphIntensity * 1) +
            morphHue * (morphIntensity * 0.3);

          // CELLULAR AUTOMATA EFFECT: Alive cells glow brighter and shift color
          if (cellStates[i] === 1) {
            hue = (hue + cellEnergy[i] * 0.2) % 1; // Energy shifts hue
          }

          // FRACTAL EFFECT: Color based on iteration depth
          const fractalHue =
            (fractalIterations[i] + timeRef.current * 0.01) % 1;
          hue = hue * 0.7 + fractalHue * 0.3; // Blend fractal influence

          let saturation = 1.7 + morphIntensity * 0.2; // More saturated during morph
          let lightness = 0.5;

          // Brighten alive cells
          if (cellStates[i] === 1) {
            saturation = Math.min(1, saturation + cellEnergy[i] * 0.3);
            lightness = 0.5 + cellEnergy[i] * 0.2; // Brighter when alive
          }

          const color = new THREE.Color().setHSL(hue, saturation, lightness);
          colors[i3] = color.r;
          colors[i3 + 1] = color.g;
          colors[i3 + 2] = color.b;
        }

        // Size morphing - particles pulse during pattern change
        let baseSize = (2 + Math.random() * 2) * (1 + morphIntensity * 0.3);

        // CELLULAR AUTOMATA: Alive cells are larger
        if (cellStates[i] === 1) {
          baseSize *= 1 + cellEnergy[i] * 0.5; // Up to 50% larger
        }

        // FRACTAL: Particles at certain iteration depths pulse
        if (fractalIterations[i] > 0.7) {
          baseSize *= 1 + Math.sin(timeRef.current * 2 + i) * 0.2;
        }

        sizes[i] = baseSize;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;
    }

    // Store animation function in scene userData for access in main animation loop
    sceneRef.current.userData.animateNebula = animate;

    // Cleanup
    return () => {
      if (sceneRef.current) {
        sceneRef.current.userData.animateNebula = null;
        if (nebulaSystemRef.current) {
          sceneRef.current.remove(nebulaSystemRef.current.system);

          // Clean up geometries and materials for sunset dust
          if (nebulaSystemRef.current.dustParticles) {
            nebulaSystemRef.current.dustParticles.forEach(({ mesh }) => {
              if (mesh.geometry) mesh.geometry.dispose();
              if (mesh.material) mesh.material.dispose();
            });
          }

          // Clean up space nebula
          if (nebulaSystemRef.current.geometry)
            nebulaSystemRef.current.geometry.dispose();
          if (nebulaSystemRef.current.material)
            nebulaSystemRef.current.material.dispose();
          if (nebulaSystemRef.current.texture)
            nebulaSystemRef.current.texture.dispose();

          nebulaSystemRef.current = null;
        }
      }
    };
  }, [sceneRef, environment, environmentHue]);

  return nebulaSystemRef;
}
