# Geometry Helpers Consolidation Plan

**Date:** November 14, 2025  
**Status:** 🟡 Planned (Not Yet Executed)

## Problem Statement

`createTesseractWithFaces` helper function is duplicated across 8 files in the codebase, leading to maintenance burden and potential inconsistencies.

## Current State

### Duplicate Files Analysis

| File | Status | Lines | Exports |
|------|--------|-------|---------|
| `src/utils/geometryHelpers.js` | ❌ Orphaned (never imported) | 165 | `createTesseractWithFaces` + wireframe utils |
| `src/features/sceneControls/utils/geometryHelpers.js` | ✅ Actively used | 83 | Wireframe utils only |
| `compoundTesseract.js` | ✅ Used | 132 | `createCompoundTesseract` |
| `megaTesseract.js` | ✅ Used | 187 | `createMegaTesseract` |
| `compoundMegaTesseract.js` | ✅ Used | 211 | `createCompoundMegaTesseract` |
| `compoundMegaTesseract2.js` | ✅ Used | 164 | `createCompoundMegaTesseractNested` |
| `compoundMegaTesseract3.js` | ✅ Used | 214 | `createCompoundMegaTesseractExperimental` |
| `compoundMegaTesseract4.js` | ✅ Used | 275 | `createCompoundMegaTesseractAxisShift` |
| `compoundMegaTesseract5.js` | ⚠️ Not in index | 394 | `createCompoundMegaTesseractFive` |

### Import Analysis

**ThreeScene.jsx imports from:**
```javascript
'../../utils/geometryHelpers'  // → src/features/sceneControls/utils/geometryHelpers.js
```

**Wireframe builders import from:**
```javascript
'../../../utils/geometryHelpers'  // → src/features/sceneControls/utils/geometryHelpers.js
```

**Conclusion:** `src/utils/geometryHelpers.js` is completely unused (dead code).

---

## Proposed Changes

### Phase 1: Consolidate Helper Function

**Move `createTesseractWithFaces` to the active helper file:**

1. **Add to:** `src/features/sceneControls/utils/geometryHelpers.js`
   - Import `mergeGeometries` from Three.js utils
   - Add complete `createTesseractWithFaces` function
   - Export it for use by polytope files

2. **Delete:** `src/utils/geometryHelpers.js`
   - This file is orphaned (never imported)
   - All useful code will be migrated

### Phase 2: Refactor Polytope Files (7 files)

Update each file to import instead of duplicate:

**Files to update:**
1. `src/features/sceneControls/geometries/polytopes/compoundTesseract.js`
2. `src/features/sceneControls/geometries/polytopes/megaTesseract.js`
3. `src/features/sceneControls/geometries/polytopes/compoundMegaTesseract.js`
4. `src/features/sceneControls/geometries/polytopes/compoundMegaTesseract2.js`
5. `src/features/sceneControls/geometries/polytopes/compoundMegaTesseract3.js`
6. `src/features/sceneControls/geometries/polytopes/compoundMegaTesseract4.js`
7. `src/features/sceneControls/geometries/polytopes/compoundMegaTesseract5.js`

**Changes per file:**
```diff
+ import { createTesseractWithFaces } from '../../utils/geometryHelpers';
  import * as THREE from 'three';
  import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

- /**
-  * Helper function to create a tesseract...
-  * [80+ lines of duplicated code]
-  */
- function createTesseractWithFaces(outerSize, innerSize, rotation = null) {
-   // ... entire function body
- }

  export function createCompound[Mega]Tesseract[Variant](options = {}) {
    // ... uses createTesseractWithFaces
  }
```

---

## Benefits

✅ **Single Source of Truth** - One canonical implementation  
✅ **Easier Maintenance** - Fix bugs in one place  
✅ **Smaller File Sizes** - Remove ~80 lines from 7 files  
✅ **Consistent Behavior** - All variants use same base function  
✅ **Cleaner Imports** - Clear dependency structure  

---

## Risks & Mitigation

### Risk 1: Breaking Changes
**Mitigation:** 
- Test all geometry types after changes
- Run `npm run dev` and verify each tesseract variant renders correctly
- Check for any import errors

### Risk 2: Subtle Implementation Differences
**Mitigation:**
- Already verified all 8 implementations are 99.9% identical
- Only comment differences (no logic changes)

### Risk 3: Git Merge Conflicts
**Mitigation:**
- This is on main branch, no active feature branches
- Commit this plan first, then make changes in single atomic commit

---

## Implementation Checklist

### Pre-Implementation
- [x] Analyze all duplicate files
- [x] Verify which files are actually used
- [x] Document current state
- [ ] Commit this plan document

### Implementation
- [ ] Add `createTesseractWithFaces` to `src/features/sceneControls/utils/geometryHelpers.js`
- [ ] Add `mergeGeometries` import to `src/features/sceneControls/utils/geometryHelpers.js`
- [ ] Update 7 polytope files to import instead of duplicate
- [ ] Delete `src/utils/geometryHelpers.js`
- [ ] Verify no other files import from deleted file
- [ ] Run `npm run lint` to check for errors
- [ ] Run `npm run format` to ensure consistent formatting

### Testing
- [ ] Run `npm run dev`
- [ ] Test each tesseract variant in the app:
  - [ ] compoundTesseract
  - [ ] megaTesseract
  - [ ] compoundMegaTesseract
  - [ ] compoundMegaTesseractNested
  - [ ] compoundMegaTesseractExperimental
  - [ ] compoundMegaTesseractAxisShift
  - [ ] compoundMegaTesseractFive
- [ ] Verify no console errors
- [ ] Verify geometries render correctly

### Post-Implementation
- [ ] Commit changes with descriptive message
- [ ] Push to GitHub
- [ ] Update this document with completion date

---

## Rollback Plan

If issues arise:
```bash
git revert HEAD  # Revert the consolidation commit
npm run dev      # Verify app works again
```

---

## Files Changed Summary

**Modified (8 files):**
- `src/features/sceneControls/utils/geometryHelpers.js` (add function)
- `src/features/sceneControls/geometries/polytopes/compoundTesseract.js`
- `src/features/sceneControls/geometries/polytopes/megaTesseract.js`
- `src/features/sceneControls/geometries/polytopes/compoundMegaTesseract.js`
- `src/features/sceneControls/geometries/polytopes/compoundMegaTesseract2.js`
- `src/features/sceneControls/geometries/polytopes/compoundMegaTesseract3.js`
- `src/features/sceneControls/geometries/polytopes/compoundMegaTesseract4.js`
- `src/features/sceneControls/geometries/polytopes/compoundMegaTesseract5.js`

**Deleted (1 file):**
- `src/utils/geometryHelpers.js`

**Total Impact:**
- ~560 lines removed (duplicated code)
- ~80 lines added (single implementation + imports)
- **Net reduction: ~480 lines**

---

## Success Criteria

✅ All tesseract variants render correctly  
✅ No import errors  
✅ No console warnings  
✅ Linting passes  
✅ Formatting is consistent  
✅ App builds successfully  
✅ File count reduced by 1  
✅ Total line count reduced by ~480 lines  

---

## Notes

- This is a **refactoring only** - no functionality changes
- All existing function signatures remain the same
- All export names remain unchanged
- This improves code quality without affecting user-facing features
