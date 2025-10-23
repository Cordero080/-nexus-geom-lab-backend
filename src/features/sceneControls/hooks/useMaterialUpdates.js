import { useEffect } from "react";
import * as THREE from "three";

/**
 * Manages material property updates for all objects
 * Responds to material prop changes without recreating objects
 *
 * @param {Object} objectsRef - Reference to array of object data
 * @param {Object} materialProps - Material configuration properties
 * @param {number} materialProps.scale - Scale value for all objects
 * @param {number} materialProps.shininess - Shininess value
 * @param {string} materialProps.specularColor - Specular color hex
 * @param {number} materialProps.specularIntensity - Specular intensity
 * @param {string} materialProps.baseColor - Base color hex
 * @param {number} materialProps.wireframeIntensity - Wireframe opacity (0-100)
 * @param {string} materialProps.intricateWireframeSpiralColor - Spiral color hex
 * @param {string} materialProps.intricateWireframeEdgeColor - Edge color hex
 */
export function useMaterialUpdates(objectsRef, materialProps) {
  const {
    scale,
    shininess,
    specularColor,
    specularIntensity,
    baseColor,
    wireframeIntensity,
    intricateWireframeSpiralColor,
    intricateWireframeEdgeColor,
  } = materialProps;

  // SCALE UPDATER
  useEffect(() => {
    objectsRef.current.forEach(
      ({ solidMesh, wireframeMesh, centerLines, curvedLines, mesh }) => {
        // Handle dual-mesh objects
        if (solidMesh) solidMesh.scale.setScalar(scale);
        if (wireframeMesh) wireframeMesh.scale.setScalar(scale);
        // Handle intricate wireframe elements
        if (centerLines) centerLines.scale.setScalar(scale);
        if (curvedLines) curvedLines.scale.setScalar(scale);
        // Handle legacy single mesh objects
        if (mesh) mesh.scale.setScalar(scale);
      }
    );
  }, [scale]);

  // SHININESS UPDATER
  useEffect(() => {
    console.log("Updating shininess to:", shininess);
    objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
      // Update solid material
      if (material) {
        material.shininess = shininess;
        material.needsUpdate = true;
        console.log(`Updated material ${index} shininess to:`, shininess);
      }
      // Update wireframe material
      if (wireframeMaterial) {
        wireframeMaterial.shininess = shininess;
        wireframeMaterial.needsUpdate = true;
        console.log(
          `Updated wireframe material ${index} shininess to:`,
          shininess
        );
      }
    });
  }, [shininess]);

  // SPECULAR COLOR UPDATER
  useEffect(() => {
    console.log("Updating specular color to:", specularColor);
    console.log("Number of objects:", objectsRef.current.length);

    if (objectsRef.current.length === 0) {
      console.log("No objects available for specular update");
      return;
    }

    // Convert hex color string to Three.js color number
    const convertedColor = parseInt(specularColor.replace("#", ""), 16);
    console.log("Converted color value:", convertedColor);

    objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
      // Update solid material
      if (material) {
        console.log(`Updating material ${index} specular color`);
        material.specular.setHex(convertedColor);
        material.needsUpdate = true;
      } else {
        console.log(`Material ${index} is null`);
      }
      // Update wireframe material
      if (wireframeMaterial) {
        console.log(`Updating wireframe material ${index} specular color`);
        wireframeMaterial.specular.setHex(convertedColor);
        wireframeMaterial.needsUpdate = true;
      }
    });
  }, [specularColor]);

  // SPECULAR INTENSITY UPDATER
  useEffect(() => {
    console.log("Updating specular intensity to:", specularIntensity);

    objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
      // Update solid material
      if (material) {
        material.reflectivity = specularIntensity;
        material.needsUpdate = true;
        console.log(
          `Updated material ${index} specular intensity to:`,
          specularIntensity
        );
      } else {
        console.log(`Material ${index} is null`);
      }
      // Update wireframe material
      if (wireframeMaterial) {
        wireframeMaterial.reflectivity = specularIntensity;
        wireframeMaterial.needsUpdate = true;
        console.log(
          `Updated wireframe material ${index} specular intensity to:`,
          specularIntensity
        );
      }
    });
  }, [specularIntensity]);

  // BASE COLOR UPDATER
  useEffect(() => {
    console.log("Updating base color to:", baseColor);
    // Convert hex color string to Three.js color number
    const convertedColor = parseInt(baseColor.replace("#", ""), 16);
    console.log("Converted base color value:", convertedColor);

    objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
      // Update solid material
      if (material) {
        material.color.setHex(convertedColor);
        material.needsUpdate = true;
        console.log(`Updated material ${index} base color`);
      }
      // Update wireframe material
      if (wireframeMaterial) {
        wireframeMaterial.color.setHex(convertedColor);
        wireframeMaterial.needsUpdate = true;
        console.log(`Updated wireframe material ${index} base color`);
      }
    });
  }, [baseColor]);

  // BASE COLOR DEBUGGER (duplicate for debugging)
  useEffect(() => {
    console.log("Base color change detected:", baseColor);
    console.log("Objects in objectsRef:", objectsRef.current);

    const convertedColor = parseInt(baseColor.replace("#", ""), 16);
    console.log("Converted base color value:", convertedColor);

    objectsRef.current.forEach(({ material, wireframeMaterial }, index) => {
      if (material) {
        material.color.setHex(convertedColor);
        material.needsUpdate = true;
        console.log(`Updated material ${index} base color to:`, material.color);
      } else {
        console.log(`Material ${index} is null`);
      }

      if (wireframeMaterial) {
        wireframeMaterial.color.setHex(convertedColor);
        wireframeMaterial.needsUpdate = true;
        console.log(
          `Updated wireframe material ${index} base color to:`,
          wireframeMaterial.color
        );
      } else {
        console.log(`Wireframe material ${index} is null`);
      }
    });
  }, [baseColor]);

  // WIREFRAME INTENSITY UPDATER
  useEffect(() => {
    const intensity = wireframeIntensity / 100; // Convert 0-100 range to 0-1 range

    console.log(
      `Updating wireframe intensity to ${wireframeIntensity}% (${intensity}) for ${objectsRef.current.length} objects`
    );

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
        console.log(`Updating object ${index}:`, {
          hasMaterial: !!material,
          hasWireframeMaterial: !!wireframeMaterial,
          hasCenterLinesMaterial: !!centerLinesMaterial,
          hasCurvedLinesMaterial: !!curvedLinesMaterial,
        });

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

          // UPDATE INTRICATE WIREFRAME ELEMENTS
          if (centerLinesMaterial) {
            centerLinesMaterial.opacity = 0.8; // Keep bright red lines visible
            centerLinesMaterial.needsUpdate = true;
          }

          if (curvedLinesMaterial) {
            curvedLinesMaterial.opacity = 0.8; // Keep bright green lines visible
            curvedLinesMaterial.needsUpdate = true;
          }

          material.needsUpdate = true;
          wireframeMaterial.needsUpdate = true;

          console.log(
            `Wireframe intensity ${wireframeIntensity}%: solid opacity = ${material.opacity}, wireframe opacity = ${wireframeMaterial.opacity}`
          );
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

  // INTRICATE WIREFRAME SPIRAL COLOR UPDATER
  useEffect(() => {
    console.log(
      "Updating intricate wireframe spiral color to:",
      intricateWireframeSpiralColor
    );
    const convertedColor = new THREE.Color(intricateWireframeSpiralColor);

    objectsRef.current.forEach(({ centerLinesMaterial }, index) => {
      if (centerLinesMaterial) {
        centerLinesMaterial.color.copy(convertedColor);
        centerLinesMaterial.needsUpdate = true;
        console.log(`Updated center lines material ${index} color`);
      }
    });
  }, [intricateWireframeSpiralColor]);

  // INTRICATE WIREFRAME EDGE COLOR UPDATER
  useEffect(() => {
    console.log(
      "Updating intricate wireframe edge color to:",
      intricateWireframeEdgeColor
    );
    const convertedColor = new THREE.Color(intricateWireframeEdgeColor);

    objectsRef.current.forEach(({ curvedLinesMaterial }, index) => {
      if (curvedLinesMaterial) {
        curvedLinesMaterial.color.copy(convertedColor);
        curvedLinesMaterial.needsUpdate = true;
        console.log(`Updated curved lines material ${index} color`);
      }
    });
  }, [intricateWireframeEdgeColor]);
}
