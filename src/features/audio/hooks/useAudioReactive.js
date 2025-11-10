import { useEffect, useRef } from "react";

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

  useEffect(() => {
    if (!isEnabled || !objectsRef.current || objectsRef.current.length === 0) {
      return;
    }

    const { bass, mids } = audioData;

    // Apply higher thresholds to filter out subtle ambient noise (crickets, etc.)
    const bassThreshold = 0.4;
    const midsThreshold = 0.35;

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

      const velocity = rotationVelocityRef.current[index];

      // Store original position
      if (!basePositionRef.current[index] && obj.solidMesh) {
        basePositionRef.current[index] = {
          x: obj.solidMesh.position.x,
          y: obj.solidMesh.position.y,
          z: obj.solidMesh.position.z,
        };
      }

      // BASS → Slight scale + position movement
      const scaleFactor = Math.min(1.15, 1 + normalizedBass * 0.9);
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
