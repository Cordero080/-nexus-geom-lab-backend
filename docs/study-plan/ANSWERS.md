# Study Plan Companion Answers

Teacher-style notes that walk through every topic in `docs/STUDY_PLAN.md`. Each section includes an explanation, an analogy to anchor the idea, and a short code example you can run or adapt.

---

## 1. Geometry Foundations

### 1.1 Tesseract Construction Pipeline (`createTesseractWithFaces`)

- **Explanation:** The function builds a hypercube by combining an outer cube, an inner cube, and six frustum "tunnels" that connect corresponding faces. Offsetting the inner cube avoids z-fighting and hints at the 4D connection.
- **Analogy:** Picture two nested glass aquariums connected by slanted transparent tunnels—water could flow between them without leaks. The tunnels represent the frustum bridges.
- **Code Example:**

  ```js
  import * as THREE from "three";
  import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

  function miniTesseract(outer = 1.5, inner = 1.0) {
    const geometries = [];
    const outerCube = new THREE.BoxGeometry(outer, outer, outer);
    geometries.push(outerCube);

    const innerCube = new THREE.BoxGeometry(inner, inner, inner);
    innerCube.translate(0, 0.01, 0); // lift to avoid z-fighting
    geometries.push(innerCube);

    const halfOuter = outer / 2;
    const halfInner = inner / 2;
    const depth = (outer - inner) / 2;

    const makeFrustum = (rotation) => {
      const frustum = new THREE.CylinderGeometry(
        halfInner,
        halfOuter,
        depth,
        4
      );
      frustum.rotateY(Math.PI / 4);
      rotation(frustum);
      return frustum;
    };

    geometries.push(
      makeFrustum((g) => g.translate(0, halfOuter + depth / 2, 0))
    ); // top
    geometries.push(
      makeFrustum((g) => {
        g.translate(0, -(halfOuter + depth / 2), 0);
        g.rotateX(Math.PI);
      })
    );

    return mergeGeometries(geometries, false);
  }
  ```

### 1.2 Merge Strategies (`BufferGeometryUtils.mergeGeometries`)

- **Explanation:** Merging fuses multiple `BufferGeometry` instances into one. This reduces draw calls and ensures a single vertex normal computation after combining shapes.
- **Analogy:** Combining LEGO modules into a single glued sculpture—you no longer move each block, but the sculpture is sturdier and faster to display.
- **Code Example:**
  ```js
  const combined = mergeGeometries([
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(0.6, 16, 16).translate(0, 0.8, 0),
  ]);
  combined.computeVertexNormals();
  ```

### 1.3 Transformation Anatomy

- **Explanation:** Variant IV chains scaling, rotation, translation, twist, and radial offsets. Order matters: scale → rotate → translate. Quaternions handle twist smoothly.
- **Analogy:** Think of dressing a mannequin: first shrink clothes (scale), rotate arms (rotation), then position on the runway (translation); twisting is like rotating around the mannequin’s spine.
- **Code Example:**

  ```js
  const geom = new THREE.BoxGeometry(1, 1, 1);
  const twistAxis = new THREE.Vector3(0, 1, 0);
  const twistQuat = new THREE.Quaternion().setFromAxisAngle(
    twistAxis,
    Math.PI / 6
  );

  geom.scale(0.8, 0.8, 0.8);
  geom.applyQuaternion(twistQuat);
  geom.translate(0, 0.5, 0);
  ```

---

## 2. Variant-Specific Logic

### 2.1 Variant II Nesting

- **Explanation:** A second pair of tesseracts is cloned, scaled (default `0.85`), then merged. This doubles the structure depth without altering the outer silhouette.
- **Analogy:** Russian nesting dolls: you place a smaller doll inside the larger one, aligned so openings match.
- **Code Experiment:**
  ```js
  const innerScale = 0.85;
  const inner = createTesseractWithFaces(2.0, 1.5, Math.PI / 8).clone();
  inner.scale(innerScale, innerScale, innerScale);
  inner.translate(0, 0.03, 0);
  const nested = mergeGeometries([base, inner]);
  ```

### 2.2 Variant III Recursive Sweep

- **Explanation:** Uses `translationStep`, `layerGap`, and `baseOffset` to stack phase-shifted clones across three scale bands.
- **Analogy:** Like stacking vinyl records on a spindle, leaving a small gap (`layerGap`) between each.
- **Practice Exercise:** try `translationStep = 0.005` to compact the layers, then `0.02` to stretch them—observe how the gallery view changes.

### 2.3 Variant IV Axis Shift & Radial Push

- **Explanation:** Generates a translation axis (x/y/z), computes a perpendicular radial basis, adds twist with quaternions, and translates clones along both axes.
- **Analogy:** A spiral staircase: choose the central pole (axis), then each step both climbs (translation) and rotates around the pole (twist).
- **Code Snippet:**

  ```js
  const axis = new THREE.Vector3(1, 0, 0).normalize();
  const radial = new THREE.Vector3()
    .crossVectors(axis, new THREE.Vector3(0, 1, 0))
    .normalize();
  const twist = new THREE.Quaternion().setFromAxisAngle(axis, Math.PI / 9);

  const clone = base.clone();
  clone.applyQuaternion(twist);
  clone.translate(radial.x * 0.05, radial.y * 0.05, radial.z * 0.05);
  ```

---

## 3. Scene Management & Performance

### 3.1 Object Factory Pipeline

- **Explanation:** `createSceneObject` orchestrates geometry creation, applies pooled materials, builds wireframes/hyperframes, and positions objects.
- **Analogy:** An assembly line where each station (geometry, material, wireframe, hyperframe) adds components before the product (Three.js group) ships to the scene.
- **Checklist:** follow props from `App.jsx → Controls.jsx → useObjectManager → createSceneObject` to ensure understanding of data flow.

### 3.2 Material Pooling

- **Explanation:** Pools keyed by variant reuse `MeshStandardMaterial` instances; slider updates modify one material instead of dozens.
- **Analogy:** Sharing a single paint bucket for multiple canvases—change the paint once, every canvas updates instantly.
- **Code Snippet:**
  ```js
  const pool = new Map();
  function getMaterial(key, config) {
    if (!pool.has(key)) pool.set(key, createSolidMaterial(config));
    return ensureSolidMaterialConfig(pool.get(key), config);
  }
  ```

### 3.3 Hyperframe Caching

- **Explanation:** Hyperframe builders (center lines + connectors) run once per variant; clones reuse cached groups, preserving `userData` via `cloneGroupWithUserData`.
- **Analogy:** Storing a 3D-print mold: reuse the mold instead of sculpting each piece by hand.
- **Tip:** Call `getHyperframeKey(geometry)` to see the cache key logic.

---

## 4. Advanced Optimization Paths

### 4.1 Instanced Meshes

- **Explanation:** Replace repeated geometry merges with `THREE.InstancedMesh`, sharing vertex buffers while per-instance transforms vary.
- **Analogy:** One chess piece mold creates all pawns; you simply place them at different board coordinates.
- **Starter Code:**

  ```js
  const instanceCount = 20;
  const geom = new THREE.BoxGeometry(0.1, 0.1, 1);
  const mat = new THREE.MeshStandardMaterial({ color: 0x00ffcc });
  const instanced = new THREE.InstancedMesh(geom, mat, instanceCount);

  const dummy = new THREE.Object3D();
  for (let i = 0; i < instanceCount; i++) {
    dummy.position.set(i * 0.2, 0, 0);
    dummy.updateMatrix();
    instanced.setMatrixAt(i, dummy.matrix);
  }
  scene.add(instanced);
  ```

### 4.2 Shader Uniform Strategy

- **Explanation:** A custom shader exposes uniforms (`uBaseColor`, `uEmissive`, `uWireframeMix`) so slider changes update GPU values, not CPU-side material properties.
- **Analogy:** Instead of repainting the walls, change the smart-light color via an app—only the bulb’s state changes.
- **Minimal GLSL Fragment:**

  ```glsl
  uniform vec3 uBaseColor;
  uniform float uWireframeMix;
  varying float vEdgeFactor; // computed in vertex shader

  void main() {
    vec3 base = uBaseColor;
    vec3 wire = vec3(1.0);
    float mixFactor = smoothstep(0.0, 1.0, uWireframeMix * vEdgeFactor);
    gl_FragColor = vec4(mix(base, wire, mixFactor), 1.0);
  }
  ```

### 4.3 Profiling Workflow

- **Explanation:** Use Chrome DevTools Performance panel to capture slider interactions—note main thread time, FPS, memory. `renderer.info.render.calls` provides draw-call counts.
- **Analogy:** Like a pit crew reading lap telemetry—identify where the slowdown occurs before tuning the engine.
- **Checklist:**
  1. Start recording, drag a color slider.
  2. Stop recording → inspect the longest tasks.
  3. Compare draw calls (`renderer.info.render.calls`) before/after instancing.

---

## 5. Documentation & Communication

### 5.1 Variant Guide Recap

- **Explanation:** Be able to summarize each variant’s purpose + main parameters. Practice a 60-second pitch for each.
- **Analogy:** Elevator pitch for different car trims—same body, different tuning.

### 5.2 Narrative Ownership

- **Guidance:** Frame AI as a collaborator: highlight that you directed the geometry experiments, validated performance strategies, and documented the system. Mention the study plan and caches as your strategic contributions.

---

## Suggested Weekly Cadence (With Teacher Notes)

1. **Day 1–2:** Reimplement `createTesseractWithFaces` from scratch; confirm frustum math by sketching cross-sections.
2. **Day 3:** Tweak Variant III parameters—capture screenshots + note how each parameter shifts the silhouette.
3. **Day 4:** Profile slider drags; jot down CPU time before/after caches.
4. **Day 5:** Build a small instancing demo (even a grid of cubes) to cement the pattern.
5. **Day 6:** Record yourself explaining one variant; watch it back and refine clarity.
6. **Day 7:** Write a short journal entry on what clicked and what needs review.

Use this companion alongside the main study plan to reinforce concepts, test yourself, and keep a library of runnable references.
