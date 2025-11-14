import { useEffect, useRef } from 'react';
import { createSceneObject } from '../../objects/factories/objectFactory';

/**
 * CORE INFRASTRUCTURE HOOK - Manages 3D object creation and updates
 *
 * What it does:
 * 1. Creates 3D objects using object factory (geometry + materials)
 * 2. Adds them to the Three.js scene
 * 3. Stores object data in objectsRef for other hooks to access
 * 4. Recreates objects when count/type/style changes
 * 5. Updates existing objects when only material properties change
 *
 * Why it matters:
 * - Separates creation (expensive) from updates (cheap)
 * - Provides object data to animation and interaction hooks
 * - Runs AFTER useSceneInitialization (depends on scene existing)
 *
 * @param {Object} refs - Refs for scene and object storage
 * @param {Object} objectProps - Current state values for objects (count, type, colors, etc)
 */
export function useObjectManager(refs, objectProps) {
  const { sceneRef, objectsRef, materialRef } = refs;
  const {
    objectCount,
    objectType,
    baseColor,
    metalness,
    emissiveIntensity,
    wireframeIntensity,
    hyperframeColor,
    hyperframeLineColor,
    // Geometry-specific (optional) props
    cpdTK_p,
    cpdTK_q,
    cpdTK_tubeRadius,
    cpdTK_gap,
  } = objectProps;

  // Track latest base color separately so we avoid rebuilding geometry on color tweaks.
  const baseColorRef = useRef(baseColor);

  useEffect(() => {
    baseColorRef.current = baseColor;
  }, [baseColor]);

  useEffect(() => {
    if (!sceneRef.current) return; // Safety check

    const scene = sceneRef.current;

    // REMOVE OLD OBJECTS from scene and clear reference array
    objectsRef.current.forEach((obj) => {
      // Remove solid and wireframe meshes
      if (obj.solidMesh) scene.remove(obj.solidMesh);
      if (obj.wireframeMesh) scene.remove(obj.wireframeMesh);
      // Remove hyperframe elements
      if (obj.centerLines) scene.remove(obj.centerLines);
      if (obj.curvedLines) scene.remove(obj.curvedLines);
      // Handle legacy single mesh objects
      if (obj.mesh) scene.remove(obj.mesh);
    });
    objectsRef.current = [];

    // CREATE NEW OBJECTS using current prop values
    const resolvedBaseColor = baseColorRef.current;

    for (let i = 0; i < objectCount; i++) {
      // Create object using factory
      const objectData = createSceneObject({
        objectType,
        objectCount,
        objectIndex: i,
        baseColor: resolvedBaseColor,
        metalness,
        emissiveIntensity,
        wireframeIntensity,
        hyperframeColor,
        hyperframeLineColor,
        cpdTK_p,
        cpdTK_q,
        cpdTK_tubeRadius,
        cpdTK_gap,
      });

      // Add all components to scene
      const { solidMesh, wireframeMesh, centerLines, curvedLines } = objectData;
      scene.add(solidMesh);
      scene.add(wireframeMesh);
      scene.add(centerLines);
      scene.add(curvedLines);

      // Store object data for animations and updates
      objectsRef.current.push(objectData);
    }

    // Store first material as main reference for debugging
    if (objectsRef.current.length > 0) {
      materialRef.current = objectsRef.current[0].material;
    }
    // Only rebuild when geometry-affecting inputs change. Color and material
    // adjustments route through useMaterialUpdates to avoid expensive rebuilds.
  }, [objectCount, objectType, cpdTK_p, cpdTK_q, cpdTK_tubeRadius, cpdTK_gap]);
  // Effect runs when these props change
}
