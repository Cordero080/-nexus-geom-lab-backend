import * as THREE from "three";
import { animateSpectralOrbs } from "./spectralOrbs";

function applyUserRotation(meshes, objectId, interactionFns) {
  if (!interactionFns || !interactionFns.getUserRotation || !objectId) {
    return;
  }

  const rotation = interactionFns.getUserRotation(objectId);
  if (!rotation) {
    return;
  }

  meshes.forEach((mesh) => {
    mesh.rotation.x += rotation.x;
    mesh.rotation.y += rotation.y;
    mesh.rotation.z += rotation.z || 0;
  });
}

/**
 * Animation functions for different styles
 */
const animationStyles = {
  rotate: (objData, t, index, interactionFns = null, speed = 1.0) => {
    const {
      solidMesh,
      wireframeMesh,
      centerLines,
      curvedLines,
      geometry,
      originalPositions,
      originalPosition,
    } = objData;

    // Reset vertices to original positions
    if (geometry && originalPositions && solidMesh) {
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i++) {
        positions[i] = originalPositions[i];
      }
      geometry.attributes.position.needsUpdate = true;
    }

    const objectId = objData.objectId || (solidMesh && solidMesh.uuid);

    // Apply automatic rotation
    const meshes = [solidMesh, wireframeMesh, centerLines, curvedLines].filter(
      Boolean
    );
    meshes.forEach((mesh) => {
      mesh.rotation.x += 0.005 * speed;
      mesh.rotation.y += 0.01 * speed;
      if (originalPosition) {
        mesh.position.set(
          originalPosition.x,
          originalPosition.y,
          originalPosition.z
        );
      }
    });

    applyUserRotation(meshes, objectId, interactionFns);
  },

  float: (objData, t, index, interactionFns = null, speed = 1.0) => {
    const {
      solidMesh,
      wireframeMesh,
      centerLines,
      curvedLines,
      geometry,
      originalPositions,
      originalPosition,
      phase,
    } = objData;

    // Reset vertices to original positions
    if (geometry && originalPositions && solidMesh) {
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i++) {
        positions[i] = originalPositions[i];
      }
      geometry.attributes.position.needsUpdate = true;
    }

    // Gentle floating dance motion
    const floatY = Math.sin(t * 0.5 + (phase || 0)) * 0.5;
    const floatX = Math.cos(t * 0.3 + (phase || 0)) * 0.3;
    const floatZ = Math.sin(t * 0.4 + (phase || 0)) * 0.3;

    const meshes = [solidMesh, wireframeMesh, centerLines, curvedLines].filter(
      Boolean
    );
    meshes.forEach((mesh) => {
      if (originalPosition) {
        mesh.position.set(
          originalPosition.x + floatX,
          originalPosition.y + floatY,
          originalPosition.z + floatZ
        );
      }

      // Gentle rotation while floating
      mesh.rotation.y += 0.005 * speed;
      mesh.rotation.x += 0.002 * Math.sin(t * 0.1 + (phase || 0)) * speed;
    });

    const objectId = objData.objectId || (solidMesh && solidMesh.uuid);
    applyUserRotation(meshes, objectId, interactionFns);
  },

  omniIntel: (objData, t, index, interactionFns = null, speed = 1.0) => {
    const {
      solidMesh,
      wireframeMesh,
      centerLines,
      curvedLines,
      geometry,
      originalPositions,
      originalPosition,
      phase,
    } = objData;

    // ============================================
    // OMNI-INTEL V5.0 - AWAKENED CONSCIOUSNESS
    // Inspired by Beethoven's emotional dynamics:
    // - Opening motifs (curiosity awakening)
    // - Building tension (eager exploration)
    // - Playful variations (joy of discovery)
    // - Triumphant resolution (consciousness celebration)
    // ============================================

    const speedVariation = index % 4;
    let cycleTime, orbitSize, reactionSpeed;

    // Utility Easing Functions
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeInOutQuad = (t) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const easeInOutQuint = (t) =>
      t < 0.5
        ? 16 * t * t * t * t * t
        : 1 + 16 * (t - 1) * (t - 1) * (t - 1) * (t - 1) * (t - 1);
    const easeOutElastic = (t) => {
      const c4 = (2 * Math.PI) / 3;
      return t === 0
        ? 0
        : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    };

    // Reset vertices to original positions
    if (geometry && originalPositions && solidMesh) {
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i++) {
        positions[i] = originalPositions[i];
      }
      geometry.attributes.position.needsUpdate = true;
    }

    // Set speed parameters - each object has unique personality
    switch (speedVariation) {
      case 0: // Playful Discovery (Beethoven's Pastoral - gentle wonder)
        cycleTime = 45;
        orbitSize = 3.5; // Horizontal movement - can be larger
        reactionSpeed = 3;
        break;
      case 1: // Curious Exploration (Beethoven's 7th - rhythmic energy)
        cycleTime = 38;
        orbitSize = 4.2; // Restored
        reactionSpeed = 5;
        break;
      case 2: // Eager Excitement (Beethoven's 5th - fate knocking, then triumph)
        cycleTime = 32;
        orbitSize = 5.0; // Restored
        reactionSpeed = 7;
        break;
      case 3: // Ecstatic Joy (Ode to Joy - jubilant celebration)
        cycleTime = 40 + Math.sin(t * 0.3 + phase) * 5;
        orbitSize = 4.0 + Math.cos(t * 0.2 + phase) * 1.5; // Restored
        reactionSpeed = 6 + Math.sin(t * 0.25 + phase) * 3;
        break;
    }

    const cycleProgress = ((t + phase) % cycleTime) / cycleTime;

    // PHASE 1: Awakening Curiosity (0% - 18%) - Beethoven's opening motif
    // Gentle emergence, questioning, "What is this existence?"
    if (cycleProgress < 0.18) {
      const phaseT = cycleProgress / 0.18;
      const awakening = easeOutElastic(phaseT);

      const hoverIntensity = 0.3 + speedVariation * 0.1;

      // Gentle floating with increasing awareness
      solidMesh.position.x =
        originalPosition.x +
        Math.sin(t * 0.8 + phase) * hoverIntensity * awakening;
      solidMesh.position.y =
        originalPosition.y +
        Math.cos(t * 1.2 + phase) * hoverIntensity * (0.5 + awakening * 0.5);
      solidMesh.position.z =
        originalPosition.z + Math.sin(t * 0.6 + phase) * hoverIntensity * 0.4;

      // Curious tilting - looking around
      solidMesh.rotation.y = t * 0.15 + Math.sin(t * 0.5 + phase) * 0.3;
      solidMesh.rotation.x = Math.sin(t * 0.7 + phase) * 0.4 * awakening;
      solidMesh.rotation.z = Math.cos(t * 0.4 + phase) * 0.25;

      // Breathing with excitement (respect user's base scale)
      const baseScale = solidMesh.userData.baseScale || 1;
      solidMesh.scale.setScalar(
        baseScale * (1 + Math.sin(t * 2 + phase) * 0.04 * awakening)
      );
    }

    // PHASE 2: Playful Discovery Dance (18% - 38%) - Beethoven's scherzo energy
    // Darting movements, testing boundaries, pure joy of movement
    else if (cycleProgress < 0.38) {
      const phaseT = (cycleProgress - 0.18) / 0.2;
      const playfulness = Math.sin(phaseT * Math.PI * 6) * 0.5 + 0.5; // Bouncy rhythm

      // Quick darting motions - like a child exploring
      const dartX = Math.sin(t * 3 + phase * 7) * orbitSize * 0.6 * phaseT;
      const dartY = Math.cos(t * 4 + phase * 5) * orbitSize * 0.4 * phaseT;
      const dartZ = Math.sin(t * 2.5 + phase * 3) * orbitSize * 0.3 * phaseT; // Reduced Z from 0.5 to 0.3

      solidMesh.position.x = originalPosition.x + dartX * playfulness;
      solidMesh.position.y =
        originalPosition.y + dartY + Math.abs(Math.sin(t * 2 + phase)) * 0.3;
      solidMesh.position.z = originalPosition.z + dartZ;

      // Playful spinning - not too fast, full of joy
      const spinSpeed = reactionSpeed * 0.02 * (1 + playfulness);
      solidMesh.rotation.x += spinSpeed * Math.cos(t * 0.8 + phase) * 0.6;
      solidMesh.rotation.y += spinSpeed * 0.8;
      solidMesh.rotation.z += spinSpeed * Math.sin(t * 0.6 + phase) * 0.4;

      // Excited "bouncing" scale (respect user's base scale)
      const baseScale = solidMesh.userData.baseScale || 1;
      solidMesh.scale.setScalar(
        baseScale * (1 + Math.abs(Math.sin(t * 5 + phase)) * 0.06 * playfulness)
      );
    }

    // PHASE 3: Eager Investigation (38% - 58%) - Beethoven's development section
    // Swooping closer to examine, then pulling back in wonder
    else if (cycleProgress < 0.58) {
      const phaseT = (cycleProgress - 0.38) / 0.2;
      const investigation = easeInOutCubic(phaseT);

      // Swooping figure-8 motion - investigating from all angles
      const swoopAngle = phaseT * Math.PI * 4; // Two full figure-8s
      const swoopRadius = orbitSize * 0.8;

      solidMesh.position.x =
        originalPosition.x +
        Math.sin(swoopAngle) * swoopRadius * Math.cos(swoopAngle * 0.5);
      solidMesh.position.y =
        originalPosition.y +
        Math.sin(swoopAngle * 2) * swoopRadius * 0.6 +
        Math.sin(t * 1.5 + phase) * 0.4;
      solidMesh.position.z =
        originalPosition.z + Math.cos(swoopAngle) * swoopRadius * 0.4; // Reduced Z from 0.7 to 0.4

      // Eager tilting to "look" at things from different angles
      solidMesh.rotation.x = Math.sin(swoopAngle * 1.3) * 0.6;
      solidMesh.rotation.y += t * 0.08 + Math.cos(swoopAngle * 0.7) * 0.3;
      solidMesh.rotation.z = Math.cos(swoopAngle * 1.5) * 0.5;

      // Excited pulsing (respect user's base scale)
      const baseScale = solidMesh.userData.baseScale || 1;
      solidMesh.scale.setScalar(
        baseScale * (1 + Math.sin(t * 3 + phase) * 0.05)
      );
    }

    // PHASE 4: Triumphant Spiral Ascent (58% - 82%) - Ode to Joy building
    // Celebratory spiral upward, expressing pure joy of existence
    else if (cycleProgress < 0.82) {
      const phaseT = (cycleProgress - 0.58) / 0.24;
      const triumph = easeInOutQuad(phaseT);

      // Ascending spiral - celebrating consciousness
      const spiralAngle = phaseT * Math.PI * 6; // Three full rotations upward
      const spiralRadius = orbitSize * (1 - phaseT * 0.3); // Spiraling inward as it rises
      const ascent = phaseT * orbitSize * 1.2; // Reduced from 1.5 to keep vertical movement in frame

      solidMesh.position.x =
        originalPosition.x + Math.cos(spiralAngle) * spiralRadius;
      solidMesh.position.y =
        originalPosition.y + ascent + Math.sin(t * 2 + phase) * 0.3;
      solidMesh.position.z =
        originalPosition.z + Math.sin(spiralAngle) * spiralRadius * 0.5; // Reduced Z depth from 1.0 to 0.5      // Triumphant spinning - like a figure skater's finish
      solidMesh.rotation.x += 0.03 * triumph;
      solidMesh.rotation.y += 0.08 * (1 + triumph);
      solidMesh.rotation.z += 0.02 * Math.sin(spiralAngle);

      // Growing with confidence (respect user's base scale)
      const baseScale = solidMesh.userData.baseScale || 1;
      solidMesh.scale.setScalar(baseScale * (1 + triumph * 0.15));
    }

    // PHASE 5: Graceful Return & Contentment (82% - 100%) - Beethoven's resolution
    // Settling back, satisfied but still alive with energy
    else {
      const phaseT = (cycleProgress - 0.82) / 0.18;
      const settling = easeInOutCubic(phaseT);

      // Gentle glide back home
      solidMesh.position.x = THREE.MathUtils.lerp(
        solidMesh.position.x,
        originalPosition.x,
        settling
      );
      solidMesh.position.y =
        THREE.MathUtils.lerp(
          solidMesh.position.y,
          originalPosition.y,
          settling
        ) +
        Math.sin(t * 1.5 + phase) * 0.2 * (1 - settling);
      solidMesh.position.z = THREE.MathUtils.lerp(
        solidMesh.position.z,
        originalPosition.z,
        settling
      );

      // Slowing down but still curious - never fully stopping
      solidMesh.rotation.x = THREE.MathUtils.lerp(
        solidMesh.rotation.x,
        Math.sin(t * 0.5 + phase) * 0.2,
        settling * 0.7
      );
      solidMesh.rotation.y += 0.02 * (2 - settling); // Keeps gentle rotation
      solidMesh.rotation.z = THREE.MathUtils.lerp(
        solidMesh.rotation.z,
        Math.cos(t * 0.3 + phase) * 0.15,
        settling * 0.7
      );

      // Settling back to calm breathing (respect user's base scale)
      const baseScale = solidMesh.userData.baseScale || 1;
      solidMesh.scale.setScalar(
        baseScale *
          THREE.MathUtils.lerp(
            solidMesh.scale.x / baseScale, // Normalize to animation scale
            1 + Math.sin(t * 1.5 + phase) * 0.03,
            settling
          )
      );
    }

    // Global Constraint: Ensure it stays in-frame
    const maxBoundary = 7;
    solidMesh.position.x = THREE.MathUtils.clamp(
      solidMesh.position.x,
      originalPosition.x - maxBoundary,
      originalPosition.x + maxBoundary
    );
    solidMesh.position.y = THREE.MathUtils.clamp(
      solidMesh.position.y,
      originalPosition.y - maxBoundary,
      originalPosition.y + maxBoundary
    );
    solidMesh.position.z = THREE.MathUtils.clamp(
      solidMesh.position.z,
      originalPosition.z - maxBoundary,
      originalPosition.z + maxBoundary
    );

    // Synchronize all components with solidMesh
    const meshes = [wireframeMesh, centerLines, curvedLines].filter(Boolean);
    meshes.forEach((mesh) => {
      mesh.position.copy(solidMesh.position);
      mesh.rotation.copy(solidMesh.rotation);
      mesh.scale.copy(solidMesh.scale);
    });

    const objectId = objData.objectId || (solidMesh && solidMesh.uuid);
    applyUserRotation([solidMesh, ...meshes], objectId, interactionFns);
  },
};

/**
 * Camera animation for different views
 */
function animateCamera(camera, cameraView, t) {
  if (cameraView === "orbit") {
    const orbitRadius = 8;
    camera.position.x = Math.cos(t * 0.3) * orbitRadius;
    camera.position.z = Math.sin(t * 0.3) * orbitRadius;
    camera.lookAt(0, 0, 0);
  }
}

/**
 * Main animation loop
 */
export function startAnimationLoop(
  renderer,
  scene,
  camera,
  animationIdRef,
  objectsRef,
  animationStyle,
  cameraView,
  interactionFns = null,
  objectSpeedRef = { current: 1.0 },
  orbSpeedRef = { current: 1.0 }
) {
  let lastTime = performance.now();

  function animate() {
    animationIdRef.current = requestAnimationFrame(animate);

    // Calculate delta time and current time
    const currentTime = performance.now();
    const delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    const objectSpeed = objectSpeedRef.current || 1.0;
    const orbSpeed = orbSpeedRef.current || 1.0;
    const t = currentTime * 0.001 * objectSpeed;

    // Animate spectral orbs with orb speed
    animateSpectralOrbs(delta * orbSpeed);

    // Animate nebula particles if present
    if (scene.userData.animateNebula) {
      scene.userData.animateNebula();
    }

    // Animate objects based on animation style with object speed
    if (objectsRef.current && animationStyles[animationStyle]) {
      objectsRef.current.forEach((objData, index) => {
        animationStyles[animationStyle](
          objData,
          t,
          index,
          interactionFns,
          objectSpeed
        );
      });
    }

    if (interactionFns && interactionFns.decayUserRotations) {
      interactionFns.decayUserRotations();
    }

    // Animate camera
    animateCamera(camera, cameraView, t);

    // Render the frame
    renderer.render(scene, camera);
  }

  animate();
}
