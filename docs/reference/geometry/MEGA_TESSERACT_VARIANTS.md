# Mega Tesseract Variants Overview

This document summarizes the current set of mega tesseract geometries, the merge strategies that shape them, and the tunable parameters you can adjust when exploring new layouts.

## Geometry Variants

- **Mega Tesseract (cpdtesseract)**
  - Two full-size tesseracts offset by 45° and merged.
  - Minimal pairing (2 components) that forms the baseline for the compound variants.
- **Compound Mega Tesseract (cpd-megatesseract)**
  - Six large tesseract copies (baseline plus ±30° rotations) merged for rhythmic overlap.
  - Acts as the "phase sweep" reference for later variants.
- **Compound Mega Tesseract II (cpd-megatesseract-2)**
  - Nested pair: baseline sweep plus an inner set scaled to 85%.
  - Provides doubled depth without changing the outer silhouette dramatically.
- **Compound Mega Tesseract III (cpd-megatesseract-3)**
  - Recursive phased sweep across three scale bands.
  - Translation steps create stacked layers with positive and negative phase copies.
- **Compound Mega Tesseract IV (cpd-megatesseract-4)**
  - Axis-shift sweep with radial pushes and twist offsets.
  - Introduces directional translation and spiral resonance along a chosen axis.

All variants are composed by duplicating the baseline `createTesseractWithFaces` geometry and merging the resulting `BufferGeometry` instances via `BufferGeometryUtils.mergeGeometries()`.

## Merge Strategies and Options

### Baseline Pairing (Variants 0 and 1)

- **Merge Type:** Linear stack of rotated duplicates.
- **Manual Tweaks:** Adjust the translation offsets inside `compoundMegaTesseract.js` to widen or tighten the pair spacing if needed.

### Nested Double (Variant II)

- **Merge Type:** Outer pair + inner pair scaled to `0.85`.
- **Manual Tweaks:** Change `innerScale` in `compoundMegaTesseract2.js` to alter nesting density. Lower values shrink the inner core further; higher values bring it closer to the shell, increasing overlap.

### Phased Sweep (Variant III)

- **Merge Type:** Three scale bands (`[1.0, 0.72, 0.52]`) with phased translations.
- **Tunable Options:**
  - `cpdMega3TranslationStep`: controls vertical separation between duplicates.
  - `cpdMega3LayerGap`: spacing between the scale bands.
  - `cpdMega3BaseOffset`: initial lift applied before the sweeps start.
- **Manual Tweaks:** Adjust these values in the `options` object passed to `createCompoundMegaTesseractExperimental` (e.g., via scene controls or programmatic overrides). Larger translation steps spread the layers; smaller gaps produce tighter stacks.

### Axis Shift Spiral (Variant IV)

- **Merge Type:** Axis-aligned translation with twist and radial offsets applied per pattern step.
- **Tunable Options:**
  - `cpdMega4Axis`: axis for the main translation (`"x"`, `"y"`, `"z"`).
  - `cpdMega4TranslationStep`: distance moved along the translation axis per pattern.
  - `cpdMega4LayerGap`: separation between scale bands.
  - `cpdMega4BaseOffset`: initial offset before the first sweep.
  - `cpdMega4TwistStep`: radians of twist applied per pattern step around the axis.
  - `cpdMega4RadialStep`: radial push magnitude; higher values flare the structure outward.
  - `cpdMega4Scales`: array of scale factors per band (default `[1.0, 0.82, 0.64, 0.46]`).
- **Manual Tweaks:** Update these options when invoking `createCompoundMegaTesseractAxisShift`. For quick experimentation, start by modifying `translationStep` for axial spacing, then adjust `radialStep` to control how far the layers spiral out.

## Workflow Tips

1. **Caching:** Each builder caches its merged geometry; when you tweak parameters, bump `cacheKey` logic or refresh the runtime so the new configuration rebuilds.
2. **Material Separation:** Geometry tweaks do not require material changes—use the shared material pools introduced in `objectFactory.js` to keep performance high during iterations.
3. **Incremental Exploration:** Change one parameter at a time (e.g., increase `layerGap` by 0.01) and reload the scene to observe the impact without losing track.
4. **Instancing Consideration:** For heavier experiments, convert repeating sweeps into instanced meshes before committing to a configuration—this maintains visual fidelity while reducing rebuild cost.

Use these settings as a launch pad for new mega tesseract variants while keeping performance and structural clarity intact.
