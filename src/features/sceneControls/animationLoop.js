import { animateSpectralOrbs } from "./spectralOrbs";
import * as THREE from "three";

/**
 * Animation functions for different styles
 */
const animationStyles = {
  rotate: (objData, t, index) => {
    const {
      solidMesh,
      wireframeMesh,
      centerLines,
      curvedLines,
      geometry,
      originalPositions,
    } = objData;

    // Reset vertices to original positions
    if (geometry && originalPositions && solidMesh) {
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i++) {
        positions[i] = originalPositions[i];
      }
      geometry.attributes.position.needsUpdate = true;
    }

    // Apply rotation to ALL components including curvedLines
    const meshes = [solidMesh, wireframeMesh, centerLines, curvedLines].filter(
      Boolean
    );
    meshes.forEach((mesh) => {
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.01;
    });
  },

  float: (objData, t, index) => {
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

    // Apply floating motion to ALL components including curvedLines
    const meshes = [solidMesh, wireframeMesh, centerLines, curvedLines].filter(
      Boolean
    );
    meshes.forEach((mesh) => {
      mesh.position.y = originalPosition.y + Math.sin((t + phase) * 0.8) * 0.5;
      mesh.rotation.x += 0.003;
      mesh.rotation.y += 0.006;
    });
  },

  spiral: (objData, t, index) => {
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
  },

  chaos: (objData, t, index) => {
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
  },

  alien: (objData, t, index) => {
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

    // Reset vertices to original positions (no vertex morphing for omni rotation)
    if (geometry && originalPositions && solidMesh) {
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i++) {
        positions[i] = originalPositions[i];
      }
      geometry.attributes.position.needsUpdate = true;
    }

    // Omni-directional rotation - multiple rotation axes with different speeds
    const meshes = [solidMesh, wireframeMesh, centerLines, curvedLines].filter(
      Boolean
    );
    meshes.forEach((mesh) => {
      // Complex multi-axis rotation for omni effect
      mesh.rotation.x += Math.sin(t * 0.8 + phase) * 0.008;
      mesh.rotation.y += Math.cos(t * 1.2 + phase) * 0.01;
      mesh.rotation.z += Math.sin(t * 0.6 + phase) * 0.006;

      // Add oscillating position for omni movement
      mesh.position.x = originalPosition.x + Math.sin(t * 1.5 + phase) * 0.3;
      mesh.position.y = originalPosition.y + Math.cos(t * 1.8 + phase) * 0.3;
      mesh.position.z = originalPosition.z + Math.sin(t * 1.1 + phase) * 0.3;
    });
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
  cameraView
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
        animationStyles[animationStyle](objData, t, index);
      });
    }

    // Animate camera
    animateCamera(camera, cameraView, t);

    // Render the frame
    renderer.render(scene, camera);
  }

  animate();
}
