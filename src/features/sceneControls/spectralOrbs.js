import * as THREE from "three";

// Store orb references for cleanup and animation
let orbGroup = null;
let orbs = [];

// Mouse position in 3D space
let mouse3D = new THREE.Vector3(0, 0, 0);
let mouseRaycaster = new THREE.Raycaster();
let mouse2D = new THREE.Vector2();

/**
 * Create spectral orbs that orbit around objects in the scene
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {number} count - Number of orbs to create
 * @param {number} orbitRadius - Distance from center
 * @param {number} hueShift - Hue rotation in degrees (0-360)
 */
export function createSpectralOrbs(
  scene,
  count = 8,
  orbitRadius = 4,
  hueShift = 0
) {
  // Clean up existing orbs
  removeSpectralOrbs(scene);

  // Create a group to hold all orbs
  orbGroup = new THREE.Group();
  orbs = [];

  // Spectral colors (rainbow/mystical palette)
  const baseColors = [
    0xff00ff, // Magenta
    0x00ffff, // Cyan
    0xff0066, // Hot Pink
    0x0080ff, // Electric Blue
    0xff6600, // Orange
    0x80ff00, // Lime
    0x8000ff, // Purple
    0xffff00, // Yellow
  ];

  // Apply hue shift to all colors
  const spectralColors = baseColors.map((color) => {
    const threeColor = new THREE.Color(color);
    threeColor.offsetHSL(hueShift / 360, 0, 0); // Convert degrees to 0-1 range for THREE.js
    return threeColor.getHex();
  });

  // Create main gradient orbs
  for (let i = 0; i < count; i++) {
    // Create biomorphic blob geometry with more vertices for morphing
    const geometry = new THREE.SphereGeometry(0.3, 332, 32);

    // Store original positions for morphing
    const positionAttribute = geometry.attributes.position;
    const originalPositions = new Float32Array(positionAttribute.array);

    // Base color for glow spheres
    const color = spectralColors[i % spectralColors.length];

    // Create gradient vertex colors
    const colors = new Float32Array(positionAttribute.count * 3);
    const color1 = new THREE.Color(spectralColors[i % spectralColors.length]);
    const color2 = new THREE.Color(
      spectralColors[(i + 1) % spectralColors.length]
    );
    const color3 = new THREE.Color(
      spectralColors[(i + 2) % spectralColors.length]
    );

    for (let j = 0; j < positionAttribute.count; j++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(
        positionAttribute,
        j
      );

      // Use Y position to create vertical gradient
      const t = (vertex.y / 0.2 + 1) * 0.5; // Normalize to 0-1

      // Create smooth gradient between 3 colors
      let finalColor;
      if (t < 0.5) {
        finalColor = color1.clone().lerp(color2, t * 2);
      } else {
        finalColor = color2.clone().lerp(color3, (t - 0.5) * 2);
      }

      colors[j * 3] = finalColor.r;
      colors[j * 3 + 1] = finalColor.g;
      colors[j * 3 + 2] = finalColor.b;
    }

    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Create glowing material with vertex colors
    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const orb = new THREE.Mesh(geometry, material);

    // NO POINT LIGHTS - they wash out the background

    // Create outer biomorphic glow
    const glowGeometry = new THREE.SphereGeometry(0.35, 24, 24);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    orb.add(glow);

    // Add secondary inner glow for depth
    const innerGlowGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const innerGlowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
    });
    const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
    orb.add(innerGlow);

    // Position orbs with organic spacing
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    const y = (Math.random() - 0.5) * 3;

    orb.position.set(x, y, z);

    // Store data for biomorphic animation
    orb.userData = {
      isSpectralOrb: true, // Flag for easy identification
      geometry: geometry,
      originalPositions: originalPositions,
      angle: angle,
      orbitRadius: orbitRadius + (Math.random() - 0.5) * 1,
      orbitSpeed: 0.15 + Math.random() * 0.25,
      // Mysterious movement patterns
      driftX: Math.random() * 0.3,
      driftY: Math.random() * 0.4,
      driftZ: Math.random() * 0.3,
      driftPhaseX: Math.random() * Math.PI * 2,
      driftPhaseY: Math.random() * Math.PI * 2,
      driftPhaseZ: Math.random() * Math.PI * 2,
      // Morphing parameters
      morphSpeed: 2.5 + Math.random() * 3.5,
      morphIntensity: 0.15 + Math.random() * 0.25,
      morphPhase: Math.random() * Math.PI * 2,
      // Pulsing
      pulseSpeed: 0.8 + Math.random() * 1.2,
      pulseOffset: Math.random() * Math.PI * 2,
      baseOpacity: 0.75 + Math.random() * 0.25,
      // References
      glow: glow,
      glowGeometry: glowGeometry,
      innerGlow: innerGlow,
    };

    orbGroup.add(orb);
    orbs.push(orb);
  }

  // Create smaller companion orbs (non-gradient, solid colors)
  const smallOrbCount = count * 2; // Twice as many small orbs
  for (let i = 0; i < smallOrbCount; i++) {
    // Smaller geometry
    const geometry = new THREE.SphereGeometry(0.08, 16, 16);
    const positionAttribute = geometry.attributes.position;
    const originalPositions = new Float32Array(positionAttribute.array);

    // Solid color (no gradient)
    const color = spectralColors[i % spectralColors.length];
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.7,
    });

    const smallOrb = new THREE.Mesh(geometry, material);

    // Single small glow
    const glowGeometry = new THREE.SphereGeometry(0.12, 12, 12);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    smallOrb.add(glow);

    // Position in between main orbs
    const angle = (i / smallOrbCount) * Math.PI * 2 + Math.PI / count;
    const smallOrbitRadius = orbitRadius * (0.6 + Math.random() * 0.3); // Closer orbit
    const x = Math.cos(angle) * smallOrbitRadius;
    const z = Math.sin(angle) * smallOrbitRadius;
    const y = (Math.random() - 0.5) * 2;

    smallOrb.position.set(x, y, z);

    // Store data for animation (simpler than main orbs)
    smallOrb.userData = {
      isSpectralOrb: true, // Flag for easy identification
      geometry: geometry,
      originalPositions: originalPositions,
      angle: angle,
      orbitRadius: smallOrbitRadius,
      orbitSpeed: 0.2 + Math.random() * 0.3, // Slightly faster orbit
      driftX: Math.random() * 0.2,
      driftY: Math.random() * 0.3,
      driftZ: Math.random() * 0.2,
      driftPhaseX: Math.random() * Math.PI * 2,
      driftPhaseY: Math.random() * Math.PI * 2,
      driftPhaseZ: Math.random() * Math.PI * 2,
      morphSpeed: 1.5 + Math.random() * 2,
      morphIntensity: 0.1 + Math.random() * 0.15,
      morphPhase: Math.random() * Math.PI * 2,
      pulseSpeed: 1 + Math.random() * 1.5,
      pulseOffset: Math.random() * Math.PI * 2,
      baseOpacity: 0.6 + Math.random() * 0.2,
      glow: glow,
      isSmall: true, // Flag to identify small orbs
    };

    orbGroup.add(smallOrb);
    orbs.push(smallOrb);
  }

  scene.add(orbGroup);
  return orbGroup;
}

/**
 * Animate the spectral orbs with biomorphic morphing
 * @param {number} delta - Time delta in seconds
 */
export function animateSpectralOrbs(delta) {
  if (!orbGroup || orbs.length === 0) return;

  const time = Date.now() * 0.001;

  orbs.forEach((orb, index) => {
    const data = orb.userData;

    // Mysterious orbital motion with drift
    data.angle += delta * data.orbitSpeed;

    // Base orbit position
    let x = Math.cos(data.angle) * data.orbitRadius;
    let z = Math.sin(data.angle) * data.orbitRadius;
    let y = 0;

    // Smaller orbs have tighter drift
    const driftMultiplier = data.isSmall ? 0.8 : 1.5;

    // Add organic drifting movement
    x += Math.sin(time * data.driftX + data.driftPhaseX) * driftMultiplier;
    y +=
      Math.cos(time * data.driftY + data.driftPhaseY) * (driftMultiplier * 1.3);
    z += Math.sin(time * data.driftZ + data.driftPhaseZ) * driftMultiplier;

    // Add secondary wave for more mysterious movement
    if (!data.isSmall) {
      y += Math.sin(time * 0.3 + index) * 0.8;
      x += Math.cos(time * 0.4 + index * 0.5) * 3.5;
    } else {
      y += Math.sin(time * 0.5 + index) * 0.5;
      x += Math.cos(time * 0.6 + index * 0.7) * 0.3;
    }

    // Remove mouse attraction/orbit logic for small orbs
    // Small orbs now only use mysterious drifting and orbital motion

    orb.position.set(x, y, z);

    // Biomorphic morphing - deform vertices
    const positionAttribute = data.geometry.attributes.position;
    const originalPositions = data.originalPositions;

    for (let i = 0; i < positionAttribute.count; i++) {
      const i3 = i * 3;

      // Get original position
      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];
      const oz = originalPositions[i3 + 2];

      // Create organic deformation with multiple noise layers
      const noise1 =
        Math.sin(time * data.morphSpeed + ox * 10 + data.morphPhase) *
        data.morphIntensity;
      const noise2 =
        Math.cos(
          time * data.morphSpeed * 1.3 + oy * 8 + data.morphPhase * 1.5
        ) *
        data.morphIntensity *
        0.7;
      const noise3 =
        Math.sin(
          time * data.morphSpeed * 0.7 + oz * 12 + data.morphPhase * 0.8
        ) *
        data.morphIntensity *
        0.5;

      const totalNoise = noise1 + noise2 + noise3;

      // Apply deformation
      positionAttribute.setXYZ(
        i,
        ox * (1 + totalNoise),
        oy * (1 + totalNoise * 1.2),
        oz * (1 + totalNoise * 0.9)
      );
    }

    positionAttribute.needsUpdate = true;
    data.geometry.computeVertexNormals();

    // Morph the glow as well for consistency (only for large orbs with glowGeometry)
    if (data.glowGeometry) {
      const glowPosition = data.glowGeometry.attributes.position;
      for (let i = 0; i < glowPosition.count; i++) {
        const vertex = new THREE.Vector3().fromBufferAttribute(glowPosition, i);
        const distortion =
          Math.sin(time * data.morphSpeed * 0.8 + vertex.length() * 5) * 0.15;
        vertex.multiplyScalar(1 + distortion);
        glowPosition.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      glowPosition.needsUpdate = true;
    }

    // Pulsing glow effect
    const pulse =
      Math.sin(time * data.pulseSpeed + data.pulseOffset) * 0.5 + 0.5;
    const opacity = data.baseOpacity * (0.5 + pulse * 0.5);

    orb.material.opacity = opacity;
    data.glow.material.opacity = opacity * (data.isSmall ? 0.15 : 0.25);

    // Inner glow only on large orbs
    if (data.innerGlow) {
      data.innerGlow.material.opacity = 0.3 + pulse * 0.3;
    }

    // Organic rotation (faster for small orbs)
    const rotSpeed = data.isSmall ? 1.5 : 1;
    orb.rotation.x +=
      delta * (0.3 + Math.sin(time * 0.5 + index) * 0.2) * rotSpeed;
    orb.rotation.y +=
      delta * (0.4 + Math.cos(time * 0.3 + index) * 0.3) * rotSpeed;
    orb.rotation.z +=
      delta * (0.2 + Math.sin(time * 0.7 + index) * 0.15) * rotSpeed;

    // Glow counter-rotation for more organic feel
    data.glow.rotation.x -= delta * 0.3 * rotSpeed;
    data.glow.rotation.y += delta * 0.5 * rotSpeed;

    if (data.innerGlow) {
      data.innerGlow.rotation.z += delta * 0.8;
    }
  });

  // Slow mysterious rotation of entire group
  orbGroup.rotation.y += delta * 0.08;
  orbGroup.rotation.x = Math.sin(time * 0.1) * 0.1;
}

/**
 * Remove spectral orbs from scene
 * @param {THREE.Scene} scene - The Three.js scene
 */
export function removeSpectralOrbs(scene) {
  if (orbGroup) {
    // Clean up all orbs
    orbs.forEach((orb) => {
      if (orb.geometry) orb.geometry.dispose();
      if (orb.material) orb.material.dispose();
      if (orb.userData.glow) {
        if (orb.userData.glow.geometry) orb.userData.glow.geometry.dispose();
        if (orb.userData.glow.material) orb.userData.glow.material.dispose();
      }
      if (orb.userData.glowGeometry) orb.userData.glowGeometry.dispose();
      if (orb.userData.innerGlow) {
        if (orb.userData.innerGlow.geometry)
          orb.userData.innerGlow.geometry.dispose();
        if (orb.userData.innerGlow.material)
          orb.userData.innerGlow.material.dispose();
      }
    });

    scene.remove(orbGroup);
    orbGroup = null;
    orbs = [];
  }
}

/**
 * Update spectral orb colors without recreating them (prevents jerking)
 * @param {THREE.Scene} scene - The Three.js scene containing the orbs
 * @param {number} hueShift - Hue rotation in degrees (0-360)
 */
export function updateSpectralOrbHue(scene, hueShift = 0) {
  console.log('[updateSpectralOrbHue] Called with hueShift:', hueShift);
  if (!scene) return;

  // Find all spectral orbs in the scene
  const sceneOrbs = [];
  scene.traverse((child) => {
    if (child.userData && child.userData.isSpectralOrb) {
      sceneOrbs.push(child);
    }
  });

  console.log('[updateSpectralOrbHue] Found', sceneOrbs.length, 'orbs');
  if (sceneOrbs.length === 0) return;

  // Base spectral colors
  const baseColors = [
    0xff00ff, // Magenta
    0x00ffff, // Cyan
    0xff0066, // Hot Pink
    0x0080ff, // Electric Blue
    0xff6600, // Orange
    0x80ff00, // Lime
    0x8000ff, // Purple
    0xffff00, // Yellow
  ];

  // Update each orb's color with new hue
  sceneOrbs.forEach((orb, index) => {
    const baseColorIndex = index % baseColors.length;
    
    // For orbs with vertex colors (gradient orbs), update the vertex colors
    if (orb.geometry && orb.geometry.attributes.color) {
      const colorAttribute = orb.geometry.attributes.color;
      
      // Get the three gradient colors with hue shift
      const color1 = new THREE.Color(baseColors[index % baseColors.length]);
      const color2 = new THREE.Color(baseColors[(index + 1) % baseColors.length]);
      const color3 = new THREE.Color(baseColors[(index + 2) % baseColors.length]);
      
      if (index === 0) {
        console.log('[updateSpectralOrbHue] Before hue shift:', color1.getHexString());
      }
      
      color1.offsetHSL(hueShift / 360, 0, 0);
      color2.offsetHSL(hueShift / 360, 0, 0);
      color3.offsetHSL(hueShift / 360, 0, 0);
      
      if (index === 0) {
        console.log('[updateSpectralOrbHue] After hue shift (', hueShift, 'deg):', color1.getHexString());
      }
      
      // Update vertex colors
      const positionAttribute = orb.geometry.attributes.position;
      for (let j = 0; j < positionAttribute.count; j++) {
        const vertex = new THREE.Vector3().fromBufferAttribute(positionAttribute, j);
        const t = (vertex.y / 0.2 + 1) * 0.5;
        
        let finalColor;
        if (t < 0.5) {
          finalColor = color1.clone().lerp(color2, t * 2);
        } else {
          finalColor = color2.clone().lerp(color3, (t - 0.5) * 2);
        }
        
        colorAttribute.setXYZ(j, finalColor.r, finalColor.g, finalColor.b);
      }
      
      if (index === 0) {
        console.log('[updateSpectralOrbHue] Updated', positionAttribute.count, 'vertices');
      }
      
      colorAttribute.needsUpdate = true;
    } else {
      // For solid color orbs (small orbs), just update material color
      const threeColor = new THREE.Color(baseColors[baseColorIndex]);
      threeColor.offsetHSL(hueShift / 360, 0, 0);
      
      if (orb.material) {
        orb.material.color.copy(threeColor);
      }
    }
    
    // Update glow materials with hue shift
    const glowColor = new THREE.Color(baseColors[baseColorIndex]);
    glowColor.offsetHSL(hueShift / 360, 0, 0);
    
    if (orb.userData.glow && orb.userData.glow.material) {
      orb.userData.glow.material.color.copy(glowColor);
    }

    if (orb.userData.innerGlow && orb.userData.innerGlow.material) {
      orb.userData.innerGlow.material.color.copy(glowColor);
    }
  });
}

/**
 * Update orb count
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {number} count - New number of orbs
 * @param {number} orbitRadius - Orbit radius
 * @param {number} hueShift - Hue rotation in degrees (0-360)
 */
export function updateSpectralOrbCount(
  scene,
  count,
  orbitRadius = 4,
  hueShift = 0
) {
  createSpectralOrbs(scene, count, orbitRadius, hueShift);
}

/**
 * Update mouse position for orb interaction
 * @param {MouseEvent} event - Mouse move event
 * @param {THREE.Camera} camera - The camera
 * @param {HTMLElement} domElement - Canvas element
 */
export function updateMousePosition(event, camera, domElement) {
  // Convert mouse position to normalized device coordinates (-1 to +1)
  const rect = domElement.getBoundingClientRect();
  mouse2D.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse2D.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // Cast ray from camera through mouse position
  mouseRaycaster.setFromCamera(mouse2D, camera);

  // Project mouse position onto a plane at z=0 (where orbs roughly are)
  const planeZ = 0;
  const distance =
    (planeZ - camera.position.z) / mouseRaycaster.ray.direction.z;
  mouse3D
    .copy(mouseRaycaster.ray.origin)
    .add(mouseRaycaster.ray.direction.multiplyScalar(distance));
}
