import { useEffect } from 'react';
import * as THREE from 'three';

/**
 * PROPERTY UPDATE HOOK - Updates material properties when state changes
 *
 * What it does:
 * 1. Accesses existing objects via objectsRef (created by useObjectManager)
 * 2. Updates scale, metalness, emissive, colors without recreating objects
 * 3. Each property has its own useEffect for targeted updates
 * 4. Handles special materials (wireframe, hyperframe spiral, edges)
 *
 * Why it matters:
 * - Efficient updates (modify existing materials, don't recreate geometry)
 * - Keeps Three.js materials in sync with React state
 * - Separated effects = only update what changed
 * - Runs AFTER useObjectManager (depends on objects existing in ref)
 *
 * @param {Object} objectsRef - Ref containing array of object data
 * @param {Object} materialProps - Current state values for materials
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
    objectsRef.current.forEach(({ solidMesh, wireframeMesh, centerLines, curvedLines, mesh }) => {
      // Store user's base scale in userData for animation access
      // Handle dual-mesh objects
      if (solidMesh) {
        solidMesh.userData.baseScale = scale;
        solidMesh.scale.setScalar(scale);
      }
      if (wireframeMesh) {
        wireframeMesh.userData.baseScale = scale;
        wireframeMesh.scale.setScalar(scale);
      }
      // Handle hyperframe elements
      if (centerLines) {
        centerLines.userData.baseScale = scale;
        centerLines.scale.setScalar(scale);
      }
      if (curvedLines) {
        curvedLines.userData.baseScale = scale;
        curvedLines.scale.setScalar(scale);
      }
      // Handle legacy single mesh objects
      if (mesh) {
        mesh.userData.baseScale = scale;
        mesh.scale.setScalar(scale);
      }
    });
  }, [scale]);

  // METALNESS UPDATER (real PBR metalness - adjust lighting to see effect)
  useEffect(() => {
    const processedSolid = new Set();
    const processedWireframe = new Set();
    objectsRef.current.forEach(({ solidMesh, wireframeMesh, material, wireframeMaterial }) => {
      // Update shared material references
      if (material && !processedSolid.has(material)) {
        processedSolid.add(material);
        material.metalness = metalness;
        material.roughness = 0.2;
        material.needsUpdate = true;
      }
      if (wireframeMaterial && !processedWireframe.has(wireframeMaterial)) {
        processedWireframe.add(wireframeMaterial);
        wireframeMaterial.metalness = metalness;
        wireframeMaterial.roughness = 0.2;
        wireframeMaterial.needsUpdate = true;
      }

      // Also traverse mesh children for complex geometries
      if (solidMesh) {
        solidMesh.traverse((child) => {
          if (child.isMesh && child.material && !processedSolid.has(child.material)) {
            processedSolid.add(child.material);
            child.material.metalness = metalness;
            child.material.roughness = 0.2;
            child.material.needsUpdate = true;
          }
        });
      }
      if (wireframeMesh) {
        wireframeMesh.traverse((child) => {
          if (child.isMesh && child.material && !processedWireframe.has(child.material)) {
            processedWireframe.add(child.material);
            child.material.metalness = metalness;
            child.material.roughness = 0.2;
            child.material.needsUpdate = true;
          }
        });
      }
    });
  }, [metalness]);

  // NOTE: Specular color is not used in MeshStandardMaterial (PBR uses metalness/roughness instead)
  // Specular color updater removed

  // EMISSIVE INTENSITY UPDATER (creates glow effect using baseColor)
  useEffect(() => {
    // Use RGB part only for Three.js Color
    const rgbColor = baseColor.slice(0, 7); // Remove alpha if present
    const emissiveColor = new THREE.Color(rgbColor).multiplyScalar(emissiveIntensity);
    const processedSolid = new Set();
    const processedWireframe = new Set();
    objectsRef.current.forEach(({ solidMesh, wireframeMesh, material, wireframeMaterial }) => {
      // Update shared material references
      if (material && !processedSolid.has(material)) {
        processedSolid.add(material);
        material.emissive.copy(emissiveColor);
        material.needsUpdate = true;
      }
      if (wireframeMaterial && !processedWireframe.has(wireframeMaterial)) {
        processedWireframe.add(wireframeMaterial);
        wireframeMaterial.emissive.copy(emissiveColor);
        wireframeMaterial.needsUpdate = true;
      }

      // Also traverse mesh children for complex geometries
      if (solidMesh) {
        solidMesh.traverse((child) => {
          if (child.isMesh && child.material && !processedSolid.has(child.material)) {
            processedSolid.add(child.material);
            child.material.emissive.copy(emissiveColor);
            child.material.needsUpdate = true;
          }
        });
      }
      if (wireframeMesh) {
        wireframeMesh.traverse((child) => {
          if (child.isMesh && child.material && !processedWireframe.has(child.material)) {
            processedWireframe.add(child.material);
            child.material.emissive.copy(emissiveColor);
            child.material.needsUpdate = true;
          }
        });
      }
    });
  }, [emissiveIntensity, baseColor]);

  // BASE COLOR UPDATER
  useEffect(() => {
    // Convert hex color string to Three.js color number (strip alpha channel)
    const hexColor = baseColor.slice(1, 7); // Remove # and alpha (ff)
    // ↑ .slice(1, 7) removes '#' at start AND 'ff' alpha at end
    // ↑ hexColor = '0000ff' (6-char hex, no # symbol)
    const convertedColor = parseInt(hexColor, 16);

    objectsRef.current.forEach(({ solidMesh, wireframeMesh, material, wireframeMaterial }) => {
      // Update solid mesh materials
      if (solidMesh) {
        solidMesh.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.color.setHex(convertedColor);
            child.material.needsUpdate = true;
          }
        });
      }
      // Update wireframe mesh materials
      if (wireframeMesh) {
        wireframeMesh.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.color.setHex(convertedColor);
            child.material.needsUpdate = true;
          }
        });
      }
      // Also update the shared material references directly
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

    const processedSolid = new Set();
    const processedWireframe = new Set();
    const processedCenter = new Set();
    const processedCurved = new Set();

    objectsRef.current.forEach(
      ({ material, wireframeMaterial, centerLinesMaterial, curvedLinesMaterial }) => {
        if (material && wireframeMaterial && !processedSolid.has(material)) {
          processedSolid.add(material);
          processedWireframe.add(wireframeMaterial);

          if (intensity === 0) {
            material.transparent = false;
            material.opacity = 1;
            wireframeMaterial.transparent = true;
            wireframeMaterial.opacity = 0;
          } else if (intensity === 1) {
            material.transparent = true;
            material.opacity = 0;
            wireframeMaterial.transparent = true;
            wireframeMaterial.opacity = 1;
          } else {
            material.transparent = true;
            material.opacity = 1 - intensity;
            wireframeMaterial.transparent = true;
            wireframeMaterial.opacity = intensity;
          }

          material.needsUpdate = true;
          wireframeMaterial.needsUpdate = true;
        } else if (material && !processedSolid.has(material) && !wireframeMaterial) {
          processedSolid.add(material);
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

        if (centerLinesMaterial && !processedCenter.has(centerLinesMaterial)) {
          processedCenter.add(centerLinesMaterial);
          const baseOpacity = centerLinesMaterial.userData?.baseOpacity ?? 0.8;
          centerLinesMaterial.opacity = baseOpacity;
          centerLinesMaterial.needsUpdate = true;
        }

        if (curvedLinesMaterial && !processedCurved.has(curvedLinesMaterial)) {
          processedCurved.add(curvedLinesMaterial);
          const baseOpacity = curvedLinesMaterial.userData?.baseOpacity ?? 0.8;
          curvedLinesMaterial.opacity = baseOpacity;
          curvedLinesMaterial.needsUpdate = true;
        }
      }
    );
  }, [wireframeIntensity]);

  // HYPERFRAME SPIRAL COLOR UPDATER
  useEffect(() => {
    // Strip alpha channel if present (8-char hex to 6-char hex)
    const rgbColor = hyperframeColor.slice(0, 7);
    const convertedColor = new THREE.Color(rgbColor);

    objectsRef.current.forEach(({ centerLines }) => {
      if (centerLines) {
        // Handle LineSegments/Line objects (for generic hyperframes like Möbius sphere)
        if (centerLines.isLine || centerLines.isLineSegments) {
          if (centerLines.material) {
            centerLines.material.color.copy(convertedColor);
            centerLines.material.needsUpdate = true;
          }
        }
        // Traverse all child meshes/lines and update their materials
        centerLines.traverse((child) => {
          if ((child.isMesh || child.isLine || child.isLineSegments) && child.material) {
            child.material.color.copy(convertedColor);
            child.material.needsUpdate = true;
          }
        });
      }
    });
  }, [hyperframeColor]);

  // HYPERFRAME EDGE COLOR UPDATER
  useEffect(() => {
    // Strip alpha channel if present (8-char hex to 6-char hex)
    const rgbColor = hyperframeLineColor.slice(0, 7);
    const convertedColor = new THREE.Color(rgbColor);

    objectsRef.current.forEach(({ curvedLines }) => {
      if (curvedLines) {
        // Handle LineSegments/Line objects (for generic hyperframes like Möbius sphere)
        if (curvedLines.isLine || curvedLines.isLineSegments) {
          if (curvedLines.material) {
            curvedLines.material.color.copy(convertedColor);
            curvedLines.material.needsUpdate = true;
          }
        }
        // Traverse all child meshes/lines and update their materials
        curvedLines.traverse((child) => {
          if ((child.isMesh || child.isLine || child.isLineSegments) && child.material) {
            child.material.color.copy(convertedColor);
            child.material.needsUpdate = true;
          }
        });
      }
    });
  }, [hyperframeLineColor]);
}
