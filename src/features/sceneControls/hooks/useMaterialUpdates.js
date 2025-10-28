import { useEffect } from "react";
import * as THREE from "three";

/**
 * Manages material property updates for all objects
 * Responds to material prop changes without recreating objects
 *
 * @param {Object} objectsRef - Reference to array of object data
 * @param {Object} materialProps - Material configuration properties
 * @param {number} materialProps.scale - Scale value for all objects
 * @param {number} materialProps.metalness - Metalness value (0-1)
 * @param {number} materialProps.emissiveIntensity - Emissive intensity (0-2, multiplied by baseColor)
 * @param {string} materialProps.baseColor - Base color hex
 * @param {number} materialProps.wireframeIntensity - Wireframe opacity (0-100)
 * @param {string} materialProps.hyperframeColor - Spiral color hex
 * @param {string} materialProps.hyperframeLineColor - Edge color hex
 */
export function useMaterialUpdates(objectsRef, materialProps) {
  const {
    scale,
    metalness,
    emissiveIntensity,
    baseColor,
    wireframeIntensity,
    hyperframeColor,
    hyperframeLineColor,
  } = materialProps;

  // SCALE UPDATER
  useEffect(() => {
    objectsRef.current.forEach(
      ({ solidMesh, wireframeMesh, centerLines, curvedLines, mesh }) => {
        // Handle dual-mesh objects
        if (solidMesh) solidMesh.scale.setScalar(scale);
        if (wireframeMesh) wireframeMesh.scale.setScalar(scale);
        // Handle hyperframe elements
        if (centerLines) centerLines.scale.setScalar(scale);
        if (curvedLines) curvedLines.scale.setScalar(scale);
        // Handle legacy single mesh objects
        if (mesh) mesh.scale.setScalar(scale);
      }
    );
  }, [scale]);

  // METALNESS UPDATER (real PBR metalness - adjust lighting to see effect)
  useEffect(() => {
    objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
      // Update solid material
      if (material) {
        material.metalness = metalness;
        material.roughness = 0.2; // Keep roughness low for shiny metal effect
        material.needsUpdate = true;
      }
      // Update wireframe material
      if (wireframeMaterial) {
        wireframeMaterial.metalness = metalness;
        wireframeMaterial.roughness = 0.2;
        wireframeMaterial.needsUpdate = true;
      }
    });
  }, [metalness]);

  // NOTE: Specular color is not used in MeshStandardMaterial (PBR uses metalness/roughness instead)
  // Specular color updater removed

  // EMISSIVE INTENSITY UPDATER (creates glow effect using baseColor)
  useEffect(() => {
    const emissiveColor = new THREE.Color(baseColor).multiplyScalar(
      emissiveIntensity
    );

    objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
      // Update solid material
      if (material) {
        material.emissive = emissiveColor.clone();
        material.needsUpdate = true;
      }
      // Update wireframe material
      if (wireframeMaterial) {
        wireframeMaterial.emissive = emissiveColor.clone();
        wireframeMaterial.needsUpdate = true;
      }
    });
  }, [emissiveIntensity, baseColor]);

  // BASE COLOR UPDATER
  useEffect(() => {
    // Convert hex color string to Three.js color number
    const convertedColor = parseInt(baseColor.replace("#", ""), 16);

    objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
      // Update solid material
      if (material) {
        material.color.setHex(convertedColor);
        material.needsUpdate = true;
      }
      // Update wireframe material
      if (wireframeMaterial) {
        wireframeMaterial.color.setHex(convertedColor);
        wireframeMaterial.needsUpdate = true;
      }
    });
  }, [baseColor]);

  // BASE COLOR DEBUGGER (duplicate for debugging)
  useEffect(() => {
    const convertedColor = parseInt(baseColor.replace("#", ""), 16);

    objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
      if (material) {
        material.color.setHex(convertedColor);
        material.needsUpdate = true;
      }

      if (wireframeMaterial) {
        wireframeMaterial.color.setHex(convertedColor);
        wireframeMaterial.needsUpdate = true;
      }
    });
  }, [baseColor]);

  // WIREFRAME INTENSITY UPDATER
  useEffect(() => {
    const intensity = wireframeIntensity / 100; // Convert 0-100 range to 0-1 range

    objectsRef.current.forEach(
      (
        {
          material,
          wireframeMaterial,
          centerLinesMaterial,
          curvedLinesMaterial,
        },
        index
      ) => {
        if (material && wireframeMaterial) {
          // DUAL-MESH BLENDING: Smooth transition between solid and wireframe
          if (intensity === 0) {
            // Full solid: solid mesh visible, wireframe mesh invisible
            material.transparent = false;
            material.opacity = 1;
            wireframeMaterial.transparent = true;
            wireframeMaterial.opacity = 0;
          } else if (intensity === 1) {
            // Full wireframe: solid mesh invisible, wireframe mesh visible
            material.transparent = true;
            material.opacity = 0;
            wireframeMaterial.transparent = true;
            wireframeMaterial.opacity = 1;
          } else {
            // Blended: both meshes partially visible
            material.transparent = true;
            material.opacity = 1 - intensity; // Solid fades out as wireframe increases
            wireframeMaterial.transparent = true;
            wireframeMaterial.opacity = intensity; // Wireframe fades in as intensity increases
          }

          // UPDATE HYPERFRAME ELEMENTS
          if (centerLinesMaterial) {
            // Preserve base opacity (e.g., 0.18 for floating city, 0.6 for others)
            const baseOpacity =
              centerLinesMaterial.userData?.baseOpacity ?? 0.8;
            centerLinesMaterial.opacity = baseOpacity;
            centerLinesMaterial.needsUpdate = true;
          }

          if (curvedLinesMaterial) {
            // Preserve base opacity (e.g., 0.12 for floating city, 0.4 for others)
            const baseOpacity =
              curvedLinesMaterial.userData?.baseOpacity ?? 0.8;
            curvedLinesMaterial.opacity = baseOpacity;
            curvedLinesMaterial.needsUpdate = true;
          }

          material.needsUpdate = true;
          wireframeMaterial.needsUpdate = true;
        } else if (material) {
          // Legacy single-mesh fallback (old wireframe behavior)
          if (intensity === 0) {
            material.wireframe = false;
            material.transparent = false;
            material.opacity = 1;
          } else {
            material.wireframe = true;
            material.transparent = true;
            material.opacity = 0.3 + intensity * 0.7;
          }
          material.needsUpdate = true;
        }
      }
    );
  }, [wireframeIntensity]);

  // HYPERFRAME SPIRAL COLOR UPDATER
  useEffect(() => {
    const convertedColor = new THREE.Color(hyperframeColor);

    objectsRef.current.forEach(({ centerLinesMaterial }, index) => {
      if (centerLinesMaterial) {
        centerLinesMaterial.color.copy(convertedColor);
        centerLinesMaterial.needsUpdate = true;
      }
    });
  }, [hyperframeColor]);

  // HYPERFRAME EDGE COLOR UPDATER
  useEffect(() => {
    const convertedColor = new THREE.Color(hyperframeLineColor);

    objectsRef.current.forEach(({ curvedLinesMaterial }, index) => {
      if (curvedLinesMaterial) {
        curvedLinesMaterial.color.copy(convertedColor);
        curvedLinesMaterial.needsUpdate = true;
      }
    });
  }, [hyperframeLineColor]);
}
