# Mega Tesseract Study Plan

A targeted revision guide covering the architecture, math, and performance tooling used across the mega tesseract project. Use it to solidify concepts before demos, interviews, or further iteration.

> 📘 **Companion Answers:** Detailed teacher-style explanations, analogies, and runnable snippets for every section live in `docs/study-plan/ANSWERS.md`.

## 1. Geometry Foundations

### 1.1 Tesseract Construction Pipeline

Revisit `createTesseractWithFaces` and articulate how the outer cube, inner cube, and six frustum bridges work together. Draw the pipeline as concentric cubes connected by tunnels and note the tiny `0.01` translation that prevents z-fighting. Being able to explain this mechanism is a differentiator—most demos skip over how the 4D intuition maps to explicit geometry.

### 1.2 Merge Strategies and Normal Care

Walk through `BufferGeometryUtils.mergeGeometries` using a micro example (box + sphere) and inspect the resulting vertex normals. Practice recomputing normals after a merge and describe why failing to do so causes harsh lighting seams. Mention this in your presentation; reviewers appreciate hearing that you watched for shading artifacts.

### 1.3 Transformation Anatomy

Study the order of transforms in `compoundMegaTesseract4.js`: scale → apply quaternion twist → translate along the axial and radial bases. Sketch the basis vectors and explain how the quaternion encodes the spiral twist. Tie this back to linear algebra concepts (cross product, normalization) so you demonstrate math fluency.

## 2. Variant-Specific Logic

### 2.1 Nested Variant (cpd-megatesseract-2)

Understand how the `innerScale` (default `0.85`) produces the Russian-doll effect. Experiment with a few values and capture screenshots to show in your portfolio. Emphasize that you deliberately tuned overlap to balance visual density and readability.

### 2.2 Phased Sweep (cpd-megatesseract-3)

Rehearse how `translationStep`, `layerGap`, and `baseOffset` interact. Build a quick REPL or CodeSandbox snippet to tweak these live; include it in your notes as evidence of experimentation. Be ready to explain why you chose three scale bands (`[1.0, 0.72, 0.52]`) and what happens if you add a fourth.

### 2.3 Axis Shift Spiral (cpd-megatesseract-4)

Highlight the computation of `radialBasis` via cross products and the use of quaternions for twist. This is prime “above-and-beyond” material—cite it when contrasting your project with standard Three.js showpieces. Practice a concise explanation of how radial push and axial translation interplay to create the spiral resonance.

## 3. Scene Management & Performance

### 3.1 Object Factory Pipeline

Trace props from `App.jsx` → `Controls.jsx` → `useObjectManager` → `createSceneObject`. Create a flow diagram and rehearse calmly narrating each hop. Stress that this separation allowed you to plug in caching and pooling without touching the UI layer.

### 3.2 Material Pooling Strategy

Review the pooled material maps you added. Note why updating a single shared material dramatically reduced slider hitching. Prepare a short anecdote about profiling before/after pooling (even qualitative observations like “color drags went from choppy to smooth”).

### 3.3 Hyperframe Caching

Recap how `hyperframeCache` and `cloneGroupWithUserData` cut down on hyperframe rebuilds. Capture a snippet of the cache key logic (`mega|compoundMega|variant`) and explain how it preserves `userData`. Mention that this is the kind of systems thinking interviewers love—caching isn’t glamorous but it signals engineering maturity.

## 4. Advanced Optimization Paths

### 4.1 Instanced Mesh Prototype

Draft a mini plan for migrating sweep duplicates to `THREE.InstancedMesh`. Even if you haven’t shipped it yet, outline the steps (shared geometry, instance matrices, dummy Object3D). Showing you know where to go next makes the project feel alive.

### 4.2 Shader Uniform Roadmap

Summarize how a custom `ShaderMaterial` with uniforms for base color, emissive strength, and wireframe blend would replace repeated CPU updates. Include the GLSL stub from the companion answers. This tells assessors you’re aware of GPU-side optimizations beyond the basics.

### 4.3 Profiling Workflow

Document your profiling routine: “Start Chrome DevTools Performance, drag a slider, inspect the longest tasks, check `renderer.info.render.calls`.” Include baseline numbers or qualitative notes in your journal so you can cite them later.

## 5. Documentation & Communication

### 5.1 Variant Storytelling

Re-read `docs/features/MEGA_TESSERACT_VARIANTS.md` and prepare a one-minute pitch for each variant. Mention key parameters (e.g., `radialStep`, `layerGap`) and why they matter visually. This differentiates you from demos that just flip through pretty meshes.

### 5.2 Ownership Narrative

List bullet points that underscore your leadership: geometry experimentation, caching strategy, performance diagnostics, study materials. Practice answering “What did you personally build?” with confidence: “I designed the merge strategies, implemented caching, and authored the variant guide so others can reproduce the pipeline.”

### 5.3 Teaching Assets

Point to the companion `ANSWERS.md` and highlight that you created analogies and runnable snippets. This shows you can teach, not just code—an asset in interviews and team settings.

## Suggested Weekly Cadence

1. **Day 1–2:** Rebuild a simplified mega tesseract from scratch without referencing code; focus on geometry assembly.
2. **Day 3:** Deep dive into Variant III or IV, tweak parameters, and note visual outcomes.
3. **Day 4:** Practice profiling the app during slider drags; record observed bottlenecks.
4. **Day 5:** Experiment with instancing or shader uniforms in a sandbox project.
5. **Day 6:** Update documentation or record short explanations; rehearse the project story.
6. **Day 7:** Rest or review notes—revisit any concepts that still feel shaky.

Keep this plan nearby as you iterate—the goal is to be conversant in both the math behind the geometry and the engineering decisions that keep the experience smooth.
