# Compound Hyperframe Consistency

> **2025-10-28 · Hyperframe retirement** — The legacy mega/compound tesseract hyperframe builders no longer ship with the scene controls. Both geometries now expose only the actual merged meshes, their edge wireframes, and the refreshed centerline builders described below. This keeps the visual scaffolding aligned with what the sliders control and avoids maintaining duplicate hyperframe logic that diverged from the latest geometry edits. For the full story, keep reading; the historical notes remain for reference.

**Date**: October 28, 2025  
**Issue**: Compound mega tesseract hyperframe didn't match its geometry structure  
**Philosophy**: Hyperframes should accurately reflect the merged geometry they represent

---

## The Problem

When implementing compound geometries, there are two architectural approaches:

### Compound Icosahedron (CORRECT ✅)

- **Geometry**: 2 icosahedrons merged together (rotated)
- **Hyperframe**: 2 inner icosahedrons as wireframes (matching the actual structure)
- **Result**: Hyperframe accurately represents what's merged

### Compound Mega Tesseract (WAS INCONSISTENT ❌)

- **Geometry**: 8 tesseracts merged together (4 mega set + 4 cross set)
- **Hyperframe**: Used same builder as 4-tesseract mega (only 2 inner cubes shown)
- **Result**: Hyperframe didn't reflect the actual 8-tesseract structure

---

## The Inconsistency Explained

The compound icosahedron established a clear pattern:

> **"The hyperframe should visually represent each component of the compound geometry"**

However, the compound mega tesseract broke this pattern:

- It merged **8 complete tesseracts** with specific rotations:
  - First mega set (4 tesseracts): Original Y-axis rotations
  - Second cross set (4 tesseracts): Perpendicular X/Z-axis rotations
- But the hyperframe only showed **2 inner cubes** (from the basic mega tesseract hyperframe)
- This made the hyperframe a "symbolic representation" rather than an "accurate reflection"

### Why This Matters

Hyperframes serve as the dimensional framework - they should reveal the underlying structure, not simplify it. When you see a compound mega tesseract, the hyperframe should show you:

- All 8 tesseract cores (inner cubes)
- Their specific rotational orientations
- How they interpenetrate in 3D space

The old approach hid 6 of the 8 tesseract cores from view.

---

## The Solution (Historical Reference)

Originally, we addressed the mismatch by introducing dedicated hyperframe builders (`compoundMegaTesseractHyperframe.js`, `megaTesseractHyperframeSimple.js`) that rendered every inner cube. That section is preserved below for context, even though the files were removed in the latest cleanup. The guiding takeaways still hold: whatever scaffolding we ship must match the geometry users manipulate.

## 2025-10-28 · Centerline Refresh (see docs/technical)

- Mega tesseract centerline now samples real edge vertices and links every inner corner to the next outward lattice point, so no joints are skipped.
- Compound tesseract centerline inherits hyperframe slider colors for both the red skeleton and green connectors.
- Compound tesseract connectors now share the geometry-sampled pipeline from the mega build—each of the 16 red corners advances along its edge direction until it hits the outer tesseract lattice for the active object type, and the connector radius is tuned to keep the rails slender.
- Touchpoints: `src/features/sceneControls/factories/hyperframeBuilders/megaTesseractCenterline.js`, `.../cpdTesseractCenterline.js`.

---

## Related Geometries

This consistency now applies across all tesseract variants:

| Geometry                    | Components Merged                           | Hyperframe Inner Structures | Status        |
| --------------------------- | ------------------------------------------- | --------------------------- | ------------- |
| Compound Icosahedron        | 2 icosahedrons                              | 2 inner icosahedrons        | ✅ Consistent |
| Compound Tesseract          | 2 tesseracts                                | 2 inner cubes               | ✅ Consistent |
| Mega Tesseract              | 4 tesseracts (2 small + 2 large pairs)      | 4 inner cubes               | ✅ **Fixed**  |
| **Compound Mega Tesseract** | **8 tesseracts (4 mega set + 4 cross set)** | **8 inner cubes**           | ✅ **Fixed**  |

### Implementation Details

**Compound Tesseract** (Already Consistent):

- Merges 2 complete tesseracts with Y rotations (0°, 45°)
- Hyperframe shows 2 inner cubes at innerSize=0.375
- Uses `createCpdTesseractHyperframe`

**Mega Tesseract** (Now Fixed):

- Merges 4 complete tesseracts:
  - Inner pair: 2 smaller (rotation: 0°, 45°, innerSize=0.375)
  - Outer pair: 2 larger (rotation: 22.5°, 67.5°, innerSize=1.5)
- **Previous issue**: Old hyperframe showed 2 base cubes + 4 artistic rotated cubes (6 total) - didn't match geometry
- **Fix**: Created `createMegaTesseractHyperframeSimple` showing exactly 4 inner cubes matching the 4 merged tesseracts
- Hyperframe now accurately reflects: 2 cubes at innerSize1=0.375, 2 cubes at innerSize2=1.5

**Compound Mega Tesseract** (Now Fixed):

- Merges 8 complete tesseracts (first mega set + cross set with X/Z rotations)
- Hyperframe shows all 8 inner cubes with correct rotations
- Uses dedicated `createCompoundMegaTesseractHyperframe`

All compound geometries now follow the same architectural truth: the hyperframe reflects the actual merged structure.

---

## Files Modified (Current Change)

- Removed the legacy hyperframe builders under `src/features/sceneControls/factories/hyperframeBuilders/`.
- Updated `src/features/sceneControls/geometries/polytopes/megaTesseract.js` to keep only the two large tesseracts that the new centerline expects.
- Trimmed `src/features/sceneControls/geometries/polytopes/compoundMegaTesseract.js` so the primary rotation data is easier to reason about (logic unchanged, just formatting).
- Simplified `src/features/sceneControls/factories/objectFactory.js` to wire in the centerline builders directly and avoid instantiating the legacy hyperframes.
- Added radius scaling support to `src/features/sceneControls/factories/wireframeBuilders/cpdTesseractWireframe.js` because wireframes now stand in for the deleted hyperframes.
