import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Audio Reactive Animation Hook
 *
 * Applies audio frequency data to geometry properties:
 * - Bass → Scale (pulsing) + X-axis rotation + Z-position movement
 * - Mids → Y-axis and Z-axis rotation
 *
 * @param {Object} objectsRef - Reference to scene objects
 * @param {Object} audioData - Audio frequency data { bass, mids, highs, overall }
 * @param {boolean} isEnabled - Whether audio reactivity is enabled
 */
export function useAudioReactive(objectsRef, audioData, isEnabled) {
  const basePositionRef = useRef({});
  const rotationVelocityRef = useRef({}); // Track rotation momentum
  const meshRotationCountRef = useRef({}); // Track mesh rotations separately
  const hyperframeRotationCountRef = useRef({}); // Track hyperframe rotations separately
  const lastMeshRotationRef = useRef({});
  const lastHyperframeRotationRef = useRef({});
  const meshColorIndexRef = useRef({});
  const hyperframeColorIndexRef = useRef({});
  const meshTargetColorRef = useRef({}); // Target color for smooth transition
  const hyperframeTargetColorRef = useRef({}); // Target color for smooth transition

  // Mesh colors - darker (based on baseColor #670d48)
  const meshColorPalette = [
    0x670d48, // Dark magenta (base color)
    0x0d6748, // Dark teal (complementary)
    0x67480d, // Dark amber
    0x0d4867, // Dark blue
    0x48670d, // Dark olive green
    0x480d67, // Dark purple
    0x670d30, // Dark crimson
    0x30670d, // Dark lime
  ];

  // Hyperframe colors - brighter versions
  const hyperframeColorPalette = [
    0xff1a8c, // Bright magenta
    0x1affb3, // Bright teal
    0xffb31a, // Bright amber
    0x1a8cff, // Bright blue
    0xb3ff1a, // Bright lime green
    0xb31aff, // Bright purple
    0xff1a66, // Bright pink-red
    0x66ff1a, // Bright chartreuse
  ];

  useEffect(() => {
    if (!isEnabled || !objectsRef.current || objectsRef.current.length === 0) {
      return;
    }

    const { bass, mids } = audioData;

    // Apply higher thresholds to filter out subtle ambient noise (crickets, etc.)
    const bassThreshold = 0.55;
    const midsThreshold = 0.5;

    const activeBass = bass > bassThreshold ? bass - bassThreshold : 0;
    const activeMids = mids > midsThreshold ? mids - midsThreshold : 0;

    // Rescale to 0-1 range after threshold
    const normalizedBass = activeBass / (1 - bassThreshold);
    const normalizedMids = activeMids / (1 - midsThreshold);

    objectsRef.current.forEach((obj, index) => {
      // Initialize rotation velocity for this object
      if (!rotationVelocityRef.current[index]) {
        rotationVelocityRef.current[index] = { x: 0, y: 0, z: 0 };
      }

      // Initialize rotation tracking for mesh and hyperframe separately
      if (meshRotationCountRef.current[index] === undefined) {
        meshRotationCountRef.current[index] = 0;
        lastMeshRotationRef.current[index] = 0;
        meshColorIndexRef.current[index] = 0;
      }
      if (hyperframeRotationCountRef.current[index] === undefined) {
        hyperframeRotationCountRef.current[index] = 0;
        lastHyperframeRotationRef.current[index] = 0;
        hyperframeColorIndexRef.current[index] = 0;
      }

      const velocity = rotationVelocityRef.current[index];

      // Store original position
      if (!basePositionRef.current[index] && obj.solidMesh) {
        basePositionRef.current[index] = {
          x: obj.solidMesh.position.x,
          y: obj.solidMesh.position.y,
          z: obj.solidMesh.position.z,
        };
      }

      // BASS → Scale only when very loud (threshold for growth)
      const growthThreshold = 0.6; // Medium-high threshold
      const scaleAmount =
        normalizedBass > growthThreshold
          ? ((normalizedBass - growthThreshold) / (1 - growthThreshold)) * 0.2
          : 0;
      const scaleFactor = 1 + scaleAmount;
      const moveAmount = normalizedBass * 0.5;

      // Audio adds to rotation velocity (momentum builds up)
      velocity.y += normalizedMids * 0.03; // Y-axis from mids only
      velocity.x += normalizedBass * 1.0; // X-axis from bass - spins up fast
      velocity.z += normalizedMids * 0.75; // Z-axis from mids

      // Apply very strong friction/drag (stops quickly)
      const friction = 0.5; // 50% friction per frame - very aggressive
      velocity.x *= friction;
      velocity.y *= friction;
      velocity.z *= friction;

      // Stop completely if velocity is very small
      const threshold = 0.01;
      if (Math.abs(velocity.x) < threshold) velocity.x = 0;
      if (Math.abs(velocity.y) < threshold) velocity.y = 0;
      if (Math.abs(velocity.z) < threshold) velocity.z = 0;

      // Track MESH rotations and change mesh colors every 3 spins
      if (obj.solidMesh) {
        const currentRotation = obj.solidMesh.rotation.x;
        const totalRotation = Math.abs(currentRotation);
        const completedRotations = Math.floor(totalRotation / (Math.PI * 2));

        const prevCompleted = Math.floor(
          Math.abs(lastMeshRotationRef.current[index]) / (Math.PI * 2)
        );

        if (
          completedRotations > prevCompleted &&
          completedRotations % 3 === 0
        ) {
          meshColorIndexRef.current[index] =
            (meshColorIndexRef.current[index] + 1) % meshColorPalette.length;
          const newColorHex =
            meshColorPalette[meshColorIndexRef.current[index]];

          // Set target color for smooth transition
          meshTargetColorRef.current[index] = new THREE.Color(newColorHex);
        }

        // Smoothly lerp to target color (10% per frame)
        if (meshTargetColorRef.current[index]) {
          if (obj.material) {
            obj.material.color.lerp(meshTargetColorRef.current[index], 0.1);
            obj.material.emissive.lerp(meshTargetColorRef.current[index], 0.1);
          }
          if (obj.wireframeMaterial) {
            obj.wireframeMaterial.color.lerp(
              meshTargetColorRef.current[index],
              0.1
            );
          }
        }

        lastMeshRotationRef.current[index] = currentRotation;
      }

      // Track HYPERFRAME rotations using combined X+Y rotation and change hyperframe colors every 3 spins
      if (obj.centerLines) {
        const rotationX = Math.abs(obj.centerLines.rotation.x);
        const rotationY = Math.abs(obj.centerLines.rotation.y);
        const combinedRotation = rotationX + rotationY; // Combine both axes
        const completedRotations = Math.floor(combinedRotation / (Math.PI * 2));

        const prevCompleted = Math.floor(
          Math.abs(lastHyperframeRotationRef.current[index]) / (Math.PI * 2)
        );

        if (
          completedRotations > prevCompleted &&
          completedRotations % 3 === 0
        ) {
          hyperframeColorIndexRef.current[index] =
            (hyperframeColorIndexRef.current[index] + 1) %
            hyperframeColorPalette.length;
          const newColorHex =
            hyperframeColorPalette[hyperframeColorIndexRef.current[index]];

          // Set target color for smooth transition
          hyperframeTargetColorRef.current[index] = new THREE.Color(
            newColorHex
          );
        }

        // Smoothly lerp to target color (10% per frame)
        if (hyperframeTargetColorRef.current[index]) {
          if (obj.centerLinesMaterial) {
            obj.centerLinesMaterial.color.lerp(
              hyperframeTargetColorRef.current[index],
              0.1
            );
          }
          if (obj.curvedLinesMaterial) {
            obj.curvedLinesMaterial.color.lerp(
              hyperframeTargetColorRef.current[index],
              0.1
            );
          }
        }

        lastHyperframeRotationRef.current[index] = combinedRotation;
      }

      if (obj.solidMesh) {
        obj.solidMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
        // Move in/out (z-axis) based on bass
        const basePos = basePositionRef.current[index];
        obj.solidMesh.position.z = basePos.z + moveAmount;
        // Apply velocity-based rotation (momentum with slowdown)
        obj.solidMesh.rotation.y += velocity.y;
        obj.solidMesh.rotation.x += velocity.x;
        obj.solidMesh.rotation.z += velocity.z;
      }

      if (obj.wireframeMesh) {
        obj.wireframeMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
        const basePos = basePositionRef.current[index];
        obj.wireframeMesh.position.z = basePos.z + moveAmount;
        obj.wireframeMesh.rotation.y += velocity.y;
        obj.wireframeMesh.rotation.x += velocity.x;
        obj.wireframeMesh.rotation.z += velocity.z;
      }

      // Apply scale to hyperframe lines too
      if (obj.centerLines) {
        obj.centerLines.scale.set(scaleFactor, scaleFactor, scaleFactor);
        const basePos = basePositionRef.current[index];
        obj.centerLines.position.z = basePos.z + moveAmount;
        obj.centerLines.rotation.y += velocity.y;
        obj.centerLines.rotation.x += velocity.x;
        obj.centerLines.rotation.z += velocity.z;
      }

      if (obj.curvedLines) {
        obj.curvedLines.scale.set(scaleFactor, scaleFactor, scaleFactor);
        const basePos = basePositionRef.current[index];
        obj.curvedLines.position.z = basePos.z + moveAmount;
        obj.curvedLines.rotation.y += velocity.y;
        obj.curvedLines.rotation.x += velocity.x;
        obj.curvedLines.rotation.z += velocity.z;
      }
    });
  }, [objectsRef, audioData, isEnabled]);

  // Reset to defaults when disabled
  useEffect(() => {
    if (!isEnabled && objectsRef.current) {
      objectsRef.current.forEach((obj, index) => {
        const basePos = basePositionRef.current[index];

        if (obj.solidMesh) {
          obj.solidMesh.scale.set(1, 1, 1);
          if (basePos)
            obj.solidMesh.position.set(basePos.x, basePos.y, basePos.z);
        }
        if (obj.wireframeMesh) {
          obj.wireframeMesh.scale.set(1, 1, 1);
          if (basePos)
            obj.wireframeMesh.position.set(basePos.x, basePos.y, basePos.z);
        }
        if (obj.centerLines) {
          obj.centerLines.scale.set(1, 1, 1);
          if (basePos)
            obj.centerLines.position.set(basePos.x, basePos.y, basePos.z);
        }
        if (obj.curvedLines) {
          obj.curvedLines.scale.set(1, 1, 1);
          if (basePos)
            obj.curvedLines.position.set(basePos.x, basePos.y, basePos.z);
        }
      });
    }
  }, [isEnabled, objectsRef]);
}
