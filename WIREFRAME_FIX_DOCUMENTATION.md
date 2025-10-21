# Wireframe Disconnection Fix - Alien Animation

## Problem

Wireframes (thick cylinder edges and inner centerLines) were disconnected from the mesh during the alien/omni animation. The wireframe would stay in place while the solid mesh moved, rotated, and scaled.

## Root Cause

The animation loop was iterating through `meshesToAnimate` array which included `[solidMesh, wireframeMesh, centerLines, curvedLines]` and applying transformations to ALL of them independently. This caused:

1. Each mesh to be animated separately
2. Wireframes to receive their own transformations instead of following the solidMesh
3. Desynchronization between solid mesh and its wireframes

## Solution

### Step 1: Only Animate solidMesh

Added a check at the start of the alien animation case to skip execution for non-solidMesh objects:

```javascript
case 'alien':
  // Only animate solidMesh - wireframes will be synchronized after
  if (currentMesh !== solidMesh) break;

  // ... rest of alien animation code
```

### Step 2: Synchronize Wireframes After Animation

After all transformations are applied to solidMesh, copy its position, rotation, and scale to the wireframe meshes:

```javascript
// Synchronize wireframe and centerLines with solidMesh
if (wireframeMesh) {
  wireframeMesh.position.copy(solidMesh.position);
  wireframeMesh.rotation.copy(solidMesh.rotation);
  wireframeMesh.scale.copy(solidMesh.scale);
}
if (centerLines) {
  centerLines.position.copy(solidMesh.position);
  centerLines.rotation.copy(solidMesh.rotation);
  centerLines.scale.copy(solidMesh.scale);
}
if (curvedLines) {
  curvedLines.position.copy(solidMesh.position);
  curvedLines.rotation.copy(solidMesh.rotation);
  curvedLines.scale.copy(solidMesh.scale);
}
```

### Step 3: Geometry-Specific CenterLines Patterns

Implemented different centerLines rebuilding patterns for different geometry types:

- **Spheres**: Complex spiral pattern for radial inner structure
- **Boxes & Octahedrons**: Clean linear interpolation for angular edges
- **Tetrahedrons**: Direct vertex connections for triangular structure
- **Other geometries**: Original noisy pattern with speed variation

### Step 4: Skip Wireframe Updates for Structured Geometries

Prevented `updateThickWireframeCylinders` from being called for structured geometries (sphere, box, octahedron, tetrahedron) to preserve their perfect wireframe positioning:

```javascript
if (objData.thickCylinders && objData.edgePairs && geometry) {
  const isSphere = geometry.type === "SphereGeometry";
  const isBox = geometry.type === "BoxGeometry";
  const isOctahedron = geometry.type === "OctahedronGeometry";
  const isTetrahedron = geometry.type === "TetrahedronGeometry";
  const shouldMaintainStructure =
    isSphere || isBox || isOctahedron || isTetrahedron;

  if (!shouldMaintainStructure) {
    updateThickWireframeCylinders(objData);
  }
}
```

## Results

- Wireframes now stay perfectly flush with mesh surfaces throughout all alien animation phases
- All structured geometries (sphere, box, octahedron, tetrahedron) maintain their perfect wireframe structures
- Inner centerLines display appropriate patterns for each geometry type
- No wireframe distortion or disconnection during movement, rotation, or scaling

## Key Lessons

1. **Single Source of Truth**: Only animate the main mesh (solidMesh), then synchronize dependent objects
2. **Geometry-Specific Handling**: Different geometries require different wireframe patterns
3. **Preserve Structure**: Structured geometries should not have their wireframes recalculated during animation
4. **Transform Inheritance**: Use `.copy()` to synchronize transformations between related meshes

## Related Commits

- `5283b50` - Fix wireframe disconnection in alien animation - synchronize transforms
- `8d6f4cb` - Fix wireframe disconnection for structured geometries in all animations
