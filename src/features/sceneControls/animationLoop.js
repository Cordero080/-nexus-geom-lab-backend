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
  rotate: (objData, t, index, interactionFns = null) => {
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
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.01;
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

  float: (objData, t, index, interactionFns = null) => {
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

    // Gentle floating motion
    const floatY = Math.sin(t * 0.001 + (phase || 0)) * 0.5;
    const meshes = [solidMesh, wireframeMesh, centerLines, curvedLines].filter(
      Boolean
    );
    meshes.forEach((mesh) => {
      if (originalPosition) {
        mesh.position.set(
          originalPosition.x,
          originalPosition.y + floatY,
          originalPosition.z
        );
      }
    });

    const objectId = objData.objectId || (solidMesh && solidMesh.uuid);
    applyUserRotation(meshes, objectId, interactionFns);
  },

  spiral: (objData, t, index, interactionFns = null) => {
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

    // Apply spiral motion to ALL components including curvedLines
    const spiralRadius = 2;
    const spiralSpeed = 0.5;
    const meshes = [solidMesh, wireframeMesh, centerLines, curvedLines].filter(
      Boolean
    );

    meshes.forEach((mesh) => {
      mesh.position.x =
        originalPosition.x + Math.cos((t + phase) * spiralSpeed) * spiralRadius;
      mesh.position.z =
        originalPosition.z + Math.sin((t + phase) * spiralSpeed) * spiralRadius;
      mesh.position.y =
        originalPosition.y + Math.sin((t + phase) * spiralSpeed * 2) * 1;
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.02;
    });

    const objectId = objData.objectId || (solidMesh && solidMesh.uuid);
    applyUserRotation(meshes, objectId, interactionFns);
  },

  chaos: (objData, t, index, interactionFns = null) => {
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

    // Apply chaotic motion to ALL components including curvedLines
    const meshes = [solidMesh, wireframeMesh, centerLines, curvedLines].filter(
      Boolean
    );
    meshes.forEach((mesh) => {
      mesh.position.x =
        originalPosition.x +
        Math.sin((t + phase) * 2.3) * Math.cos((t + phase) * 1.1) * 1.5;
      mesh.position.y =
        originalPosition.y +
        Math.cos((t + phase) * 1.7) * Math.sin((t + phase) * 2.2) * 1.5;
      mesh.position.z =
        originalPosition.z +
        Math.sin((t + phase) * 1.4) * Math.cos((t + phase) * 3.1) * 1.5;
      mesh.rotation.x += Math.sin(t + phase) * 0.02;
      mesh.rotation.y += Math.cos(t + phase) * 0.03;
      mesh.rotation.z += Math.sin(t + phase * 2) * 0.015;
    });

    const objectId = objData.objectId || (solidMesh && solidMesh.uuid);
    applyUserRotation(meshes, objectId, interactionFns);
  },

  omniIntel: (objData, t, index, interactionFns = null) => {
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
    // OMNI-INTEL V4.0 - SENTIENT SYMPHONY
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

    // Reset vertices to original positions
    if (geometry && originalPositions && solidMesh) {
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i++) {
        positions[i] = originalPositions[i];
      }
      geometry.attributes.position.needsUpdate = true;
    }

    // Set speed parameters based on emotional state
    switch (speedVariation) {
      case 0: // Reflective & Smooth (Emotion: Curiosity)
        cycleTime = 30;
        orbitSize = 3;
        reactionSpeed = 10;
        break;
      case 1: // Observational & Measured (Emotion: Calm Intelligence)
        cycleTime = 22;
        orbitSize = 4.5;
        reactionSpeed = 15;
        break;
      case 2: // Focused & Intense (Emotion: Determination/Aversion)
        cycleTime = 16;
        orbitSize = 6;
        reactionSpeed = 20;
        break;
      case 3: // Erratic & Unpredictable (Emotion: Disturbed/Agitated)
        cycleTime = 18 + Math.sin(t * 0.5 + phase) * 3;
        orbitSize = 5 + Math.cos(t * 0.3 + phase) * 1.5;
        reactionSpeed = 18 + Math.sin(t * 0.7 + phase) * 5;
        break;
    }

    const cycleProgress = ((t + phase) % cycleTime) / cycleTime;

    // PHASE 1: Initial Float & Contemplation (0% - 20%)
    if (cycleProgress < 0.2) {
      const hoverIntensity = 0.15 + speedVariation * 0.05;

      solidMesh.position.x =
        originalPosition.x + Math.sin(t * 3 + phase) * hoverIntensity * 1.2;
      solidMesh.position.y =
        originalPosition.y + Math.cos(t * 4 + phase) * hoverIntensity;
      solidMesh.position.z =
        originalPosition.z + Math.sin(t * 2 + phase) * hoverIntensity * 0.5;

      solidMesh.rotation.y = t * 0.3 + phase;
      solidMesh.rotation.x = Math.sin(t * 0.7 + phase) * 0.3;
      solidMesh.rotation.z = Math.cos(t * 0.4 + phase) * 0.2;

      solidMesh.scale.setScalar(1 + Math.sin(t * 2 + phase) * 0.03);
    }

    // PHASE 2: Symphonic Pause & Dervish Dance (20% - 35%)
    else if (cycleProgress < 0.35) {
      const t_spin = (cycleProgress - 0.2) / 0.15;
      const eased_pos = easeInOutQuad(t_spin);

      solidMesh.position.x = THREE.MathUtils.lerp(
        solidMesh.position.x,
        originalPosition.x,
        eased_pos * 0.5
      );
      solidMesh.position.y = THREE.MathUtils.lerp(
        solidMesh.position.y,
        originalPosition.y,
        eased_pos * 0.5
      );
      solidMesh.position.z = THREE.MathUtils.lerp(
        solidMesh.position.z,
        originalPosition.z,
        eased_pos * 0.5
      );

      const longWaveModulator = Math.sin(t * 0.5 + phase * 2) * 0.5 + 0.5;
      const buildUpFactor = easeInOutQuint(t_spin);
      const minSpeed = 0.05 + speedVariation * 0.05;
      const maxSpeed = reactionSpeed * 0.05;

      const currentSpinSpeed = THREE.MathUtils.lerp(
        minSpeed,
        maxSpeed * longWaveModulator,
        buildUpFactor
      );

      solidMesh.rotation.x +=
        currentSpinSpeed * 1.5 * Math.sin(t * 0.4 + phase);
      solidMesh.rotation.y += currentSpinSpeed * 2.0;
      solidMesh.rotation.z +=
        currentSpinSpeed * 1.0 * Math.cos(t * 0.7 + phase);

      solidMesh.position.x +=
        Math.sin(t * 10 + phase) * (1 - buildUpFactor) * 0.02;
      solidMesh.position.y +=
        Math.cos(t * 8 + phase) * (1 - buildUpFactor) * 0.02;
    }

    // PHASE 3: Elliptical Recede & Curious Return (35% - 50%)
    else if (cycleProgress < 0.5) {
      const t_dash = (cycleProgress - 0.35) / 0.15;
      const eased_recede = easeInOutQuad(t_dash);

      const maxDashDistance = orbitSize * 1.5;
      const ellipseHeight = orbitSize * 0.4;

      solidMesh.position.x =
        originalPosition.x +
        Math.sin(eased_recede * Math.PI) * maxDashDistance * 0.3;
      solidMesh.position.y =
        originalPosition.y + Math.cos(eased_recede * Math.PI) * ellipseHeight;
      solidMesh.position.z =
        originalPosition.z - eased_recede * maxDashDistance * 0.8;

      solidMesh.rotation.x = Math.sin(t * 5 + phase) * 0.1 * (1 - eased_recede);
      solidMesh.rotation.y = eased_recede * Math.PI * 2;
      solidMesh.rotation.z = Math.cos(t * 3 + phase) * 0.1;
    }

    // PHASE 4: Erratic Figure-8 Ellipse Observation (50% - 85%)
    else if (cycleProgress < 0.85) {
      const t_figure8 = (cycleProgress - 0.5) / 0.35;
      const t_angle = t_figure8 * Math.PI * 2 * 1.5;
      const ellipseRadiusX = orbitSize * 0.8;
      const ellipseRadiusY = orbitSize * 0.5;
      const ellipseRadiusZ = orbitSize * 0.4;
      const centerZ = -orbitSize * 0.3;

      solidMesh.position.x =
        originalPosition.x + ellipseRadiusX * Math.cos(t_angle);
      solidMesh.position.y =
        originalPosition.y +
        ellipseRadiusY * Math.sin(t_angle * 2) * Math.sin(t * 3 + phase) * 0.5 +
        Math.sin(t_figure8 * Math.PI * 4) * 0.5;
      solidMesh.position.z =
        originalPosition.z + centerZ + ellipseRadiusZ * Math.sin(t_angle);

      solidMesh.rotation.z = Math.sin(t_angle * 0.5) * 0.8;
      solidMesh.rotation.x = Math.cos(t_angle * 0.7) * 0.5;
      solidMesh.rotation.y += (t * 0.5 + phase) * 0.1;
    }

    // PHASE 5: Swift Return & Re-entry (85% - 100%)
    else {
      const t_return = (cycleProgress - 0.85) / 0.15;
      const eased = easeInOutCubic(t_return);

      solidMesh.position.x = THREE.MathUtils.lerp(
        solidMesh.position.x,
        originalPosition.x,
        eased
      );
      solidMesh.position.y = THREE.MathUtils.lerp(
        solidMesh.position.y,
        originalPosition.y,
        eased
      );
      solidMesh.position.z = THREE.MathUtils.lerp(
        solidMesh.position.z,
        originalPosition.z,
        eased
      );

      solidMesh.rotation.x = THREE.MathUtils.lerp(
        solidMesh.rotation.x,
        0,
        eased * 0.5
      );
      solidMesh.rotation.y = THREE.MathUtils.lerp(
        solidMesh.rotation.y,
        0,
        eased * 0.5
      );
      solidMesh.rotation.z = THREE.MathUtils.lerp(
        solidMesh.rotation.z,
        0,
        eased * 0.5
      );

      solidMesh.scale.setScalar(1 + (1 - eased) * 0.05);
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
  } else if (cameraView === "cinematic") {
    camera.position.x = -3 + Math.sin(t * 0.1) * 1;
    camera.position.y = 2 + Math.cos(t * 0.15) * 0.5;
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
  interactionFns = null
) {
  let lastTime = performance.now();

  function animate() {
    animationIdRef.current = requestAnimationFrame(animate);

    // Calculate delta time and current time
    const currentTime = performance.now();
    const delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    const t = currentTime * 0.001;

    // Animate spectral orbs
    animateSpectralOrbs(delta);

    // Animate objects based on animation style
    if (objectsRef.current && animationStyles[animationStyle]) {
      objectsRef.current.forEach((objData, index) => {
        animationStyles[animationStyle](objData, t, index, interactionFns);
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
