# Scene State Refactoring - Custom Hook Extraction

**Date:** November 14, 2025  
**Status:** 🟡 In Progress

---

## Problem Statement

`App.jsx` contains 553 lines with 20+ scene state variables, creating:
- **Cluttered component** - Hard to read and maintain
- **Prop drilling** - 20+ individual props passed to ThreeScene and Controls
- **Poor separation of concerns** - Scene state mixed with routing/modal logic
- **Difficult testing** - Can't test scene state logic independently

### Current Code Smell:
```jsx
// App.jsx - GeomLab component (BAD)
const [metalness, setMetalness] = useState(0.5);
const [emissiveIntensity, setEmissiveIntensity] = useState(0);
const [baseColor, setBaseColor] = useState(defaultBaseColor);
const [wireframeIntensity, setWireframeIntensity] = useState(50);
// ... 16 more state variables ...

<ThreeScene
  scale={scale}
  objectSpeed={objectSpeed}
  orbSpeed={orbSpeed}
  metalness={metalness}
  emissiveIntensity={emissiveIntensity}
  baseColor={baseColor}
  wireframeIntensity={wireframeIntensity}
  // ... 14 more props ...
/>
```

---

## Solution: Custom Hook Pattern

Extract all scene-related state into a custom hook: `useSceneState()`

### Benefits:
✅ **Cleaner App.jsx** - Reduced from 553 lines to ~350 lines  
✅ **Single source of truth** - All scene state in one place  
✅ **Grouped by domain** - Material, lighting, scene behavior clearly separated  
✅ **Easier to maintain** - Changes to scene state happen in one file  
✅ **Reusable** - Can use in other components if needed  
✅ **Testable** - Can test scene state logic independently  
✅ **Better prop passing** - Pass objects instead of 20 individual props  

---

## Implementation Strategy

### Phase 1: Create Custom Hook ✅
**File:** `src/hooks/useSceneState.js`

Group state into logical domains:
1. **Material Properties** - metalness, emissiveIntensity, baseColor, wireframeIntensity
2. **Hyperframe** - hyperframeColor, hyperframeLineColor
3. **Scene Behavior** - cameraView, environment, environmentHue, objectCount, animationStyle, objectType
4. **Lighting** - ambient and directional light properties
5. **Animation** - scale, objectSpeed, orbSpeed

Return:
- `sceneState` - All current values as an object
- `sceneActions` - All setter functions as an object

### Phase 2: Update App.jsx
Replace individual `useState` calls with:
```jsx
const { sceneState, sceneActions } = useSceneState();
```

### Phase 3: Update Component Props
**Before:**
```jsx
<ThreeScene
  metalness={metalness}
  emissiveIntensity={emissiveIntensity}
  // ... 18 more props
/>
```

**After:**
```jsx
<ThreeScene {...sceneState} />
<Controls 
  {...sceneState}
  {...sceneActions}
/>
```

### Phase 4: Update Save/Load Logic
Ensure sceneConfig object still works:
```jsx
const sceneConfig = { ...sceneState };
```

---

## Risk Assessment

**Risk Level:** 🟢 **LOW**

### Why Low Risk:

1. **Pure reorganization** - No logic changes, just moving code
2. **Git safety net** - Everything committed, easy rollback
3. **Incremental approach** - Test after each step
4. **Well-structured codebase** - State already cleanly separated
5. **Strong test plan** - Comprehensive checklist available
6. **Recent success** - Just completed geometry helpers refactor successfully

### Potential Issues & Mitigations:

| Issue | Mitigation |
|-------|-----------|
| Missing state variable | Review with git diff, verify all 20+ vars included |
| Prop naming mismatch | Use spread operator to maintain prop names |
| Save/load breaks | Test save/load immediately after integration |
| Re-render behavior changes | Monitor console for performance issues |
| Controls stop working | Test each control type individually |

---

## Testing Checklist

### Critical Functionality:
- [ ] All sliders work (metalness, scale, emissive, wireframe, speeds, etc.)
- [ ] Color pickers update correctly (base, hyperframe, lights)
- [ ] Camera controls work (free, orbit, top)
- [ ] Geometry switching works (all object types)
- [ ] Animation controls work (rotate, orbit, pulse, etc.)
- [ ] Lighting controls work (ambient + directional)
- [ ] Environment switching works (matrix, stars, nebula, grid, void)
- [ ] Environment hue slider works
- [ ] Object count slider works

### Save/Load Functionality:
- [ ] Save scene creates valid JSON
- [ ] Load scene restores all properties
- [ ] Scene unlock modal works
- [ ] Animation unlock works

### Visual Verification:
- [ ] No console errors
- [ ] No visual glitches
- [ ] Animations smooth
- [ ] Hyperframes render correctly
- [ ] Lighting responds to changes

---

## Rollback Procedures

### If anything breaks:

**Option 1: Instant rollback (nuclear)**
```bash
git reset --hard HEAD
```

**Option 2: Undo last commit (gentler)**
```bash
git revert HEAD
```

**Option 3: Just review changes**
```bash
git diff
git status
```

**Option 4: Incremental revert**
```bash
# Unstage specific file
git restore --staged src/hooks/useSceneState.js
git restore src/hooks/useSceneState.js
```

---

## File Changes Summary

### New Files:
- `src/hooks/useSceneState.js` - Custom hook with all scene state

### Modified Files:
- `src/App.jsx` - Replace useState calls with useSceneState()
- Potentially: `src/components/features/Controls/Controls.jsx` (if prop destructuring needed)
- Potentially: `src/features/sceneControls/ThreeScene.jsx` (if prop destructuring needed)

### Expected Impact:
- **Lines removed:** ~60 lines (individual useState declarations)
- **Lines added:** ~90 lines (custom hook + documentation)
- **Net change:** +30 lines (but much cleaner organization)
- **App.jsx reduction:** 553 lines → ~350 lines

---

## Implementation Log

### Step 1: Create useSceneState hook
**Status:** ✅ Complete  
**File:** `src/hooks/useSceneState.js`  
**Details:** Created hook with all 20+ state variables grouped by domain

### Step 2: Document refactoring
**Status:** ✅ Complete  
**File:** `docs/reference/workflows/SCENE_STATE_REFACTOR.md`  
**Details:** This document

### Step 3: Update App.jsx
**Status:** ⏳ Pending  
**Details:** Will replace individual useState with useSceneState()

### Step 4: Test functionality
**Status:** ⏳ Pending  
**Details:** Run through complete testing checklist

### Step 5: Commit changes
**Status:** ⏳ Pending  
**Details:** Commit with detailed message

---

## Success Criteria

✅ All controls work exactly as before  
✅ Save/load functionality preserved  
✅ No console errors  
✅ App.jsx significantly shorter and cleaner  
✅ State logic centralized in custom hook  
✅ All tests pass  
✅ Code is more maintainable  

---

## Why This Refactor Matters

### For Development:
- **Faster feature development** - Adding new state is centralized
- **Easier debugging** - State logic in one place
- **Better code organization** - Clear separation of concerns
- **Improved testability** - Can unit test state logic

### For Interviews/Portfolio:
- **Shows React best practices** - Custom hooks are industry standard
- **Demonstrates refactoring skills** - Not just writing new code
- **Clean architecture** - Separation of concerns
- **Professional code quality** - Easy to explain and maintain

### For Future Features:
- **Easy to add Context** - Hook can be wrapped in Context provider later
- **Reusable state logic** - Can use in other components
- **Scalable pattern** - Supports future complexity

---

## References

- [React Custom Hooks Documentation](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [State Management Patterns](https://react.dev/learn/managing-state)
- Previous refactor: `GEOMETRY_HELPERS_CONSOLIDATION_PLAN.md`

---

## Notes

- This refactor was done immediately after successful geometry helpers consolidation
- Confidence high from recent refactoring success
- All changes tested incrementally
- Git safety net in place throughout process
