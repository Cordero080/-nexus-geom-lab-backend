# Geometry Creation Guide

## Overview

This guide explains how geometries are created, organized, and used in Nexus Geom Lab. Understanding this system is essential for adding new geometric objects or modifying existing ones.

---

## 🏗️ Geometry Architecture

### Directory Structure

```
src/features/sceneControls/geometries/
├── polytopes/         → 4D polytopes and polyhedra
├── compound/          → Compound/merged simple geometries
├── curved/            → Spheres, tori, and curved surfaces
└── manifolds/         → Non-orientable surfaces (Klein bottles, Möbius)
```

---

## 📐 Geometry Categories

### 1. Polytopes (polytopes/)

**Purpose:** 3D polyhedra and 4D polytope projections

**Examples:**

- `icosahedron.js` - Compound icosahedron (merkaba/stella octangula)
- `hessianPolychoron.js` - 15-shell compound with icosahedral symmetry
- `tesseract.js` - 4D hypercube projection
- `cell120.js` - 120-cell 4D polytope
- `megaTesseract.js` - Multi-layer tesseract compounds

**Common Properties:**

- High vertex counts
- Complex symmetry groups
- Often use `mergeGeometries` for compounds
- Based on Three.js primitive geometries

---

### 2. Compound (compound/)

**Purpose:** Simple geometries merged into compounds

**Examples:**

- `compoundSphere.js` - Multiple spheres merged
- `compoundTorus.js` - Nested/rotated tori

**Pattern:**

- Take simple base geometry
- Create multiple instances
- Apply different rotations/scales
- Merge into single geometry

---

### 3. Curved (curved/)

**Purpose:** Smooth curved surfaces

**Examples:**

- `sphere.js` - Basic sphere geometry

**Characteristics:**

- Smooth surfaces
- High segment counts for quality
- Often used as base for compounds

---

### 4. Manifolds (manifolds/)

**Purpose:** Non-orientable and topologically interesting surfaces

**Examples:**

- `quantumManifold.js` - 3 Klein bottles merged
- `mobiusSphere.js` - Möbius strip variants
- `compoundQuantumManifold.js` - Multiple manifold layers

**Characteristics:**

- Parametric surface generation
- Mathematical surface equations
- Non-orientable (no inside/outside)

---

## 🔨 Geometry Factory Pattern

### Standard Factory Structure

Every geometry file follows this pattern:

```javascript
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * JSDoc describing the geometry
 *
 * @param {Object} options - Configuration options
 * @param {number} options.scale - Overall scale (optional)
 * @param {number} options.detail - Level of detail (optional)
 * @returns {THREE.BufferGeometry}
 */
export function createGeometryName(options = {}) {
  // Extract options with defaults
  const scale = options.scale || 1.0;
  const detail = options.detail || 1;

  // Create geometry
  const geometry = new THREE.SomeGeometry(scale, detail);

  // Add user data for system identification
  geometry.userData.isCompound = false; // or true
  geometry.userData.baseType = "SomeGeometry";

  return geometry;
}

/**
 * Metadata for the geometry (used in UI)
 */
export const metadata = {
  name: "geometryname", // kebab-case identifier
  displayName: "🔷 Geometry Name", // UI display with emoji
  category: "polytopes", // Category folder name
  description: "Short description",
  isCompound: false,
  defaultOptions: {
    scale: 1.0,
    detail: 1,
  },
};
```

---

## 📝 Real-World Example: Creating a Compound Icosahedron

### Step-by-Step Breakdown

**File:** `polytopes/icosahedron.js`

```javascript
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

export function createIcosahedron(options = {}) {
  // STEP 1: Define scale (can be overridden)
  const scale = 1.15;

  // STEP 2: Create base geometries
  const ico1 = new THREE.IcosahedronGeometry(scale);
  const ico2 = new THREE.IcosahedronGeometry(scale);

  // STEP 3: Apply transformations
  // Rotate second icosahedron to create stella octangula effect
  ico2.rotateX(Math.PI / 2); // 90° on X
  ico2.rotateY(Math.PI / 6); // 30° on Y

  // STEP 4: Merge into compound
  const mergedIco = mergeGeometries([ico1, ico2]);

  // STEP 5: Add metadata for system
  mergedIco.userData.isCompound = true;
  mergedIco.userData.baseType = "IcosahedronGeometry";

  return mergedIco;
}

export const metadata = {
  name: "icosahedron",
  displayName: "⬡ Compound Icosahedron",
  category: "polytopes",
  description: "Two icosahedra merged with stella octangula effect (merkaba)",
  isCompound: true,
  defaultOptions: {},
};
```

### What Makes This a "Compound"?

1. **Multiple geometries merged** - 2 icosahedra become 1 geometry
2. **Rotational relationship** - Second is rotated for symmetry
3. **Marked in userData** - `isCompound: true` tells the system
4. **Single object in scene** - Renders as one mesh, not two

---

## 🌟 Advanced Example: Hessian Polychoron

**File:** `polytopes/hessianPolychoron.js`

### The Complexity

This is a "super-compound" with:

- **5 compound groups** (pentagonal symmetry)
- **3 layers per group** (nested icosahedra)
- **15 total shells**
- **Icosahedral 5-fold symmetry**

### The Code Pattern

```javascript
export function createHessianPolychoron(options = {}) {
  const baseRotationAngle = (2 * Math.PI) / 5; // 72° (pentagonal)
  const compounds = [];

  // Create 5 compounds with rotational symmetry
  for (let i = 0; i < 5; i += 1) {
    // Each compound has 3 nested layers (different sizes)
    const outer = new THREE.IcosahedronGeometry(1.2, 1);
    const middle = new THREE.IcosahedronGeometry(1.0, 1);
    const inner = new THREE.IcosahedronGeometry(0.72, 1);

    // Apply icosahedral symmetry
    const primaryRotation = baseRotationAngle * i; // 0°, 72°, 144°, 216°, 288°
    const secondaryRotation = Math.atan(2); // ~63.43° (golden angle)

    // Rotate all three layers
    outer.rotateY(primaryRotation);
    outer.rotateX(secondaryRotation);

    middle.rotateY(primaryRotation);
    middle.rotateX(secondaryRotation);
    middle.rotateZ(Math.PI / 10); // Additional twist

    inner.rotateY(primaryRotation);
    inner.rotateX(secondaryRotation);
    inner.rotateZ(Math.PI / 6);

    // Add all 3 to the compound array
    compounds.push(outer, middle, inner);
  }

  // Merge all 15 geometries into one
  const merged = mergeGeometries(compounds, false);
  merged.computeVertexNormals();

  // Rich metadata for this complex structure
  merged.userData.isHessianPolychoron = true;
  merged.userData.isSuperCompound = true;
  merged.userData.componentCount = 15;
  merged.userData.symmetry = "icosahedral-5-fold";
  merged.userData.layers = {
    compounds: 5,
    layersPerCompound: 3,
    symmetryAngle: baseRotationAngle,
  };

  return merged;
}
```

### Key Concepts

**Pentagonal Symmetry:**

- 360° / 5 = 72° between each compound

**Nested Layers:**

- Outer (1.2), Middle (1.0), Inner (0.72) - decreasing scales

**Golden Angle:**

- `Math.atan(2)` ≈ 63.43° - related to golden ratio (φ)

**Super-Compound:**

- Multiple compounds merged
- Marked with `isSuperCompound: true`

---

## 🎨 Parametric Surfaces: Quantum Manifold

**File:** `manifolds/quantumManifold.js`

### Klein Bottle Mathematics

```javascript
export function createQuantumManifold(options = {}) {
  const uSegments = options.uSegments || 160;
  const vSegments = options.vSegments || 80;
  const scale = options.scale || 0.479;

  // Klein bottle parametric function
  const klein = (u, v) => {
    const cu = Math.cos(u);
    const su = Math.sin(u);
    const c2 = Math.cos(u / 2);
    const s2 = Math.sin(u / 2);
    const sv = Math.sin(v);
    const s2v = Math.sin(2 * v);

    const R = 1.2; // radius scale
    const x = (R + c2 * sv - s2 * s2v) * cu;
    const y = (R + c2 * sv - s2 * s2v) * su;
    const z = s2 * sv + c2 * s2v;

    return new THREE.Vector3(x, y, z);
  };

  // Build geometry from parametric surface
  const geom = new THREE.BufferGeometry();
  const positions = [];

  // Generate vertex positions
  for (let i = 0; i <= uSegments; i++) {
    const u = (i / uSegments) * (Math.PI * 2);
    for (let j = 0; j <= vSegments; j++) {
      const v = (j / vSegments) * (Math.PI * 2);
      const p = klein(u, v).multiplyScalar(scale);
      positions.push(p.x, p.y, p.z);
    }
  }

  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  // ... build indices, compute normals

  return geom;
}
```

### Parametric Pattern

1. **Define parametric function** - Math equations for surface
2. **Iterate over UV space** - Sample the surface
3. **Generate vertices** - Calculate 3D positions
4. **Build indices** - Connect vertices into faces
5. **Compute normals** - For proper lighting

---

## 🔧 Geometry Helpers & Utilities

### mergeGeometries

**Purpose:** Combine multiple geometries into one

```javascript
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

const geometries = [geo1, geo2, geo3];
const merged = mergeGeometries(geometries);
```

**When to use:**

- Creating compounds
- Performance optimization (fewer draw calls)
- Building complex shapes from primitives

---

### Buffer Geometry Methods

```javascript
// Rotate geometry
geometry.rotateX(angle);
geometry.rotateY(angle);
geometry.rotateZ(angle);

// Scale geometry
geometry.scale(x, y, z);

// Translate geometry
geometry.translate(x, y, z);

// Compute normals (for lighting)
geometry.computeVertexNormals();

// Convert indexed to non-indexed
geometry.toNonIndexed();
```

---

## 📊 userData Properties

### Standard Properties

```javascript
geometry.userData = {
  // Basic identification
  isCompound: true / false, // Is this merged geometries?
  baseType: "IcosahedronGeometry", // Three.js base type

  // Compound-specific
  isSuperCompound: true, // Is this a compound of compounds?
  componentCount: 15, // How many pieces merged?

  // Symmetry info
  symmetry: "icosahedral-5-fold", // Symmetry group description
  layers: {
    // Layer structure
    compounds: 5,
    layersPerCompound: 3,
    symmetryAngle: (2 * Math.PI) / 5,
  },
};
```

### Why userData?

- **System identification** - Wireframe builder uses this
- **Hyperframe logic** - Different hyperframes for different types
- **Debug information** - Inspect geometry properties
- **Feature flags** - Enable/disable features per geometry

---

## 🎯 Adding a New Geometry

### Step-by-Step Guide

**Scenario:** Add a "Compound Octahedron"

#### 1. Create the File

```
src/features/sceneControls/geometries/polytopes/compoundOctahedron.js
```

#### 2. Write the Factory Function

```javascript
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

export function createCompoundOctahedron(options = {}) {
  const scale = options.scale || 1.0;

  // Create two octahedra
  const oct1 = new THREE.OctahedronGeometry(scale);
  const oct2 = new THREE.OctahedronGeometry(scale);

  // Rotate second for compound effect
  oct2.rotateY(Math.PI / 4); // 45°

  // Merge
  const merged = mergeGeometries([oct1, oct2]);

  // Metadata
  merged.userData.isCompound = true;
  merged.userData.baseType = "OctahedronGeometry";
  merged.userData.componentCount = 2;

  return merged;
}

export const metadata = {
  name: "compoundoctahedron",
  displayName: "◆ Compound Octahedron",
  category: "polytopes",
  description: "Two octahedra merged with rotational symmetry",
  isCompound: true,
  defaultOptions: {
    scale: 1.0,
  },
};
```

#### 3. Export from Category Index

**File:** `polytopes/index.js`

```javascript
export {
  createCompoundOctahedron,
  metadata as compoundOctahedronMetadata,
} from "./compoundOctahedron.js";
```

#### 4. Register in Geometry Registry

**File:** `features/sceneControls/utils/geometryRegistry.js` (or similar)

```javascript
import {
  createCompoundOctahedron,
  compoundOctahedronMetadata,
} from "../geometries/polytopes";

geometryRegistry.register({
  ...compoundOctahedronMetadata,
  createFunction: createCompoundOctahedron,
});
```

#### 5. Test It!

Use in your scene:

```javascript
const geometry = createCompoundOctahedron({ scale: 1.5 });
const material = new THREE.MeshStandardMaterial();
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

---

## 🧪 Testing Your Geometry

### Checklist

- [ ] Geometry renders without errors
- [ ] Wireframe mode works correctly
- [ ] Rotations apply properly
- [ ] Material updates work
- [ ] Hyperframe (if applicable) displays correctly
- [ ] Performance is acceptable (check vertex count)
- [ ] Metadata is complete and accurate

### Debug Tips

```javascript
// Log geometry info
console.log("Vertices:", geometry.attributes.position.count);
console.log("User Data:", geometry.userData);

// Visualize with VertexNormalsHelper
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper";
const helper = new VertexNormalsHelper(mesh, 0.1);
scene.add(helper);
```

---

## 📐 Mathematical Concepts Used

### Golden Ratio (φ)

```javascript
const phi = (1 + Math.sqrt(5)) / 2; // ≈ 1.618
const goldenAngle = Math.atan(2); // ≈ 63.43° (related to φ)
```

**Used in:**

- Hessian polychoron rotations
- Icosahedral symmetry
- Natural spiral patterns

### Symmetry Groups

**Pentagonal:** 72° rotations (360° / 5)

```javascript
const angle = (2 * Math.PI) / 5;
```

**Hexagonal:** 60° rotations (360° / 6)

```javascript
const angle = (2 * Math.PI) / 6;
```

**Icosahedral:** Complex 5-fold and 3-fold axes

### Parametric Surfaces

**General pattern:**

```javascript
f(u, v) = [x(u,v), y(u,v), z(u,v)]
where u, v ∈ [0, 2π]
```

**Examples:**

- Klein bottle
- Möbius strip
- Torus

---

## 🚀 Best Practices

### 1. Always Include Metadata

Every geometry needs a metadata export for the UI.

### 2. Use Descriptive Names

`createHessianPolychoron` not `createHP`

### 3. Document Complex Math

Add comments explaining unusual rotations or formulas.

### 4. Consider Performance

High vertex counts = slower rendering. Balance quality vs performance.

### 5. Test with Wireframe

Ensure wireframe mode reveals structure correctly.

### 6. Mark Compounds Properly

Set `userData.isCompound = true` for merged geometries.

---

## 🎓 Key Takeaways

1. **Factory pattern** - Every geometry is a function returning BufferGeometry
2. **Metadata** - Required for UI integration
3. **userData** - System uses this for features (wireframe, hyperframe)
4. **mergeGeometries** - Essential for compounds
5. **Categories** - Organize by polytopes, curved, manifolds, compound
6. **Parametric surfaces** - Build from mathematical equations
7. **Symmetry** - Use rotation angles based on mathematical groups

This system allows infinite geometric exploration while maintaining clean, testable code.
