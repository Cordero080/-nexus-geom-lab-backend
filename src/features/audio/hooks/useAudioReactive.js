import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Audio Reactive Animation Hook
 *
 * Applies audio frequency data to geometry properties:
 * - Bass → Scale (pulsing) + X-axis rotation + Z-position movement
 * - Mids → Y-axis and Z-axis rotation
 * - Color cycling preserves user's brightness/saturation, only cycles hue
 *
 * @param {Object} objectsRef - Reference to scene objects
 * @param {Object} audioData - Audio frequency data { bass, mids, highs, overall }
 * @param {boolean} isEnabled - Whether audio reactivity is enabled
 * @param {string} baseColor - User's chosen base color (e.g., '#670d48')
 * @param {string} hyperframeColor - User's chosen hyperframe color
 * @param {string} hyperframeLineColor - User's chosen hyperframe line color
 */
export function useAudioReactive(
  objectsRef,
  audioData,
  isEnabled,
  baseColor,
  hyperframeColor,
  hyperframeLineColor
) {
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

  // Helper function to convert hex to HSL
  const hexToHSL = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 0, l: 0 };

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return { h, s, l };
  };

  // Helper function to convert HSL to hex
  const hslToHex = (h, s, l) => {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return parseInt(`0x${toHex(r)}${toHex(g)}${toHex(b)}`);
  };

  // Generate color palette from base color (preserving saturation and lightness)
  const generateColorPalette = (baseColorHex) => {
    const { h, s, l } = hexToHSL(baseColorHex);
    const palette = [];

    // Generate 8 colors by cycling hue, keeping S and L constant
    for (let i = 0; i < 8; i++) {
      const newHue = (h + i / 8) % 1; // Evenly distribute hues around the color wheel
      palette.push(hslToHex(newHue, s, l));
    }

    return palette;
  };

  // Mesh colors - generated from baseColor
  const meshColorPalette = generateColorPalette(baseColor || "#670d48");

  // Hyperframe colors - generated from hyperframeColor
  const hyperframeColorPalette = generateColorPalette(
    hyperframeColor || "#ff1a8c"
  );

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
