import { useEffect } from "react";
import { createSceneObject } from "../factories/objectFactory";

/**
 * Manages object creation and updates
 * Recreates all objects when relevant props change
 *
 * @param {Object} refs - References to Three.js objects
 * @param {Object} refs.sceneRef - Reference to the scene
 * @param {Object} refs.objectsRef - Reference to array of object data
 * @param {Object} refs.materialRef - Reference to main material for debugging
 * @param {Object} objectProps - Object configuration properties
 * @param {number} objectProps.objectCount - Number of objects to create
 * @param {string} objectProps.objectType - Type of geometry
 * @param {string} objectProps.baseColor - Base color hex
 * @param {string} objectProps.specularColor - Specular color hex
 * @param {number} objectProps.shininess - Shininess value
 * @param {number} objectProps.specularIntensity - Specular intensity
 * @param {number} objectProps.wireframeIntensity - Wireframe opacity
 * @param {string} objectProps.intricateWireframeSpiralColor - Spiral color hex
 * @param {string} objectProps.intricateWireframeEdgeColor - Edge color hex
 */
export function useObjectManager(refs, objectProps) {
  const { sceneRef, objectsRef, materialRef } = refs;
  const {
    objectCount,
    objectType,
    baseColor,
    specularColor,
    shininess,
    specularIntensity,
    wireframeIntensity,
    intricateWireframeSpiralColor,
    intricateWireframeEdgeColor,
  } = objectProps;

  useEffect(() => {
    if (!sceneRef.current) return; // Safety check

    const scene = sceneRef.current;

    // REMOVE OLD OBJECTS from scene and clear reference array
    objectsRef.current.forEach((obj) => {
      // Remove solid and wireframe meshes
      if (obj.solidMesh) scene.remove(obj.solidMesh);
      if (obj.wireframeMesh) scene.remove(obj.wireframeMesh);
      // Remove intricate wireframe elements
      if (obj.centerLines) scene.remove(obj.centerLines);
      if (obj.curvedLines) scene.remove(obj.curvedLines);
      // Handle legacy single mesh objects
      if (obj.mesh) scene.remove(obj.mesh);
    });
    objectsRef.current = [];

    // CREATE NEW OBJECTS using current prop values
    for (let i = 0; i < objectCount; i++) {
      // Create object using factory
      const objectData = createSceneObject({
        objectType,
        objectCount,
        objectIndex: i,
        baseColor,
        specularColor,
        shininess,
        specularIntensity,
        wireframeIntensity,
        intricateWireframeSpiralColor,
        intricateWireframeEdgeColor,
      });

      // Add all components to scene
      const { solidMesh, wireframeMesh, centerLines, curvedLines } = objectData;
      scene.add(solidMesh);
      scene.add(wireframeMesh);
      scene.add(centerLines);
      scene.add(curvedLines);

      console.log(`Added object ${i} to scene:`, {
        solidMesh: solidMesh.type,
        wireframeMesh: wireframeMesh.type,
        centerLines: centerLines ? centerLines.type : "NULL",
        curvedLines: curvedLines ? curvedLines.type : "NULL",
        centerLinesChildren: centerLines ? centerLines.children?.length : "N/A",
        curvedLinesChildren: curvedLines ? curvedLines.children?.length : "N/A",
        position: solidMesh.position,
      });

      // Store object data for animations and updates
      objectsRef.current.push(objectData);
    }

    // Store first material as main reference for debugging
    if (objectsRef.current.length > 0) {
      materialRef.current = objectsRef.current[0].material;
      console.log(
        "Set main material reference, specular color:",
        objectsRef.current[0].material.specular.getHex()
      );
    }

    console.log(
      `Created ${objectsRef.current.length} objects with current React state values`
    );
  }, [objectCount, baseColor, specularColor, objectType]);
  // Effect runs when these props change
}
