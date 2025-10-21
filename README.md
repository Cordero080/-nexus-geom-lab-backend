# Three.js React Project

A Three.js-based 3D visualization project with multiple geometries and animation styles.

## Project Structure

Each 3D shape consists of multiple components that must move together in unison:

### Shape Components
- **Solid Mesh**: The main visible geometry
- **Wireframe Cylinders**: Thick cylindrical wireframe edges that outline the shape
- **Center Lines (Inner Structure)**: Internal wireframe pattern (e.g., spiral for spheres, inner geometry for polyhedra)
- **Curved Lines (Connecting Rods)**: Green connection rods linking vertices or inner/outer structures

### Geometry Types
- **Structured Geometries**: Sphere, Box, Octahedron, Tetrahedron, Icosahedron
  - Have mathematically perfect vertex positions
  - Use thick cylinder-based wireframes
  - Have geometry-specific inner structures
  
- **Unstructured Geometries**: Torus, TorusKnot, custom shapes
  - Can be freely deformed
  - Use standard thin wireframes

## Animation Styles

1. **rotate** - Simple rotation
2. **float** - Floating/bobbing motion
3. **spiral** - Spiral movement pattern
4. **liquid** - Liquid metal morphing
5. **chaos** - Chaotic movement
6. **alien** - Omni-directional oscillation (✅ fully working)
7. **dna** - DNA helix warping
8. **magnetic** - Magnetic field deformation (🔧 partially working)

## Current Status

### ✅ Completed
- Alien animation: All components (mesh, wireframe, centerLines, curvedLines) stay synchronized during transform-based animations
- Magnetic animation: Mesh and wireframe cylinders now bend together during vertex deformation

### 🔧 Work In Progress
- **Magnetic Animation**: Inner wireframe structure (centerLines) and connecting rods (curvedLines) need to sync with mesh deformation
  - Current behavior: centerLines and curvedLines are being updated based on deformed vertex positions
  - Issue: They appear disconnected from the mesh/wireframe during the magnetic animation
  - Required: All embedded structures must move in unison with the mesh depending on the animation type

## Key Technical Details

### Animation Architecture
- **Transform-based animations** (rotate, float, spiral, alien): Modify mesh position/rotation/scale, wireframes follow via synchronization
- **Vertex-deformation animations** (liquid, dna, magnetic): Modify geometry vertex positions, wireframes must be updated to follow deformed vertices

### Wireframe Synchronization Methods
1. **Transform copying**: `wireframeMesh.position.copy(solidMesh.position)` - Used for transform-based animations
2. **Direct vertex updates**: Update wireframe cylinder positions/orientations based on deformed vertex positions - Used for vertex-deformation animations

## Development

```bash
npm install
npm run dev
```

## Documentation

See [WIREFRAME_FIX_DOCUMENTATION.md](./WIREFRAME_FIX_DOCUMENTATION.md) for detailed information about the alien animation wireframe fix.
