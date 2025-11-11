# Scene Controls Architecture

## 📁 Directory Structure

```
src/features/sceneControls/
├── ThreeScene.jsx              → Main React component
├── ThreeScene.css              → Scene styles
│
├── core/                       → ⚠️ CONFUSING NAME - Should be "setup/"
│   ├── environmentSetup.js     → Pure functions for environment config
│   ├── lightingSetup.js        → Pure functions for lighting setup
│   └── sceneSetup.js           → Pure functions for scene creation
│
├── hooks/                      → React hooks (organized by purpose)
│   ├── core/                   → CORE INFRASTRUCTURE hooks
│   │   ├── useSceneInitialization.js  → Creates scene, camera, renderer
│   │   └── useObjectManager.js        → Creates/manages 3D objects
│   │
│   ├── effects/                → VISUAL EFFECTS hooks
│   │   ├── useNebulaParticles.js      → Particle system
│   │   ├── useMetalnessLighting.js    → Metalness-based lighting
│   │   └── useSceneEffects.js         → Environment & mouse tracking
│   │
│   ├── updates/                → PROPERTY UPDATE hooks
│   │   ├── useCameraController.js     → Camera position updates
│   │   ├── useLightingUpdates.js      → Lighting property updates
│   │   └── useMaterialUpdates.js      → Material property updates
│   │
│   └── interaction/            → USER INTERACTION hooks
│       ├── useAnimationLoop.js        → Main animation loop
│       └── useObjectInteraction.js    → Mouse-over interactions
│
├── animation/                  → Animation logic
│   └── animationLoop.js        → Animation styles (orbital, chaotic, etc.)
│
├── objects/                    → 3D object creation
│   ├── spectralOrbs.js         → Spectral orb objects
│   └── ...
│
├── geometries/                 → Geometry definitions
│   └── geometryFactory.js      → Creates different geometry types
│
└── utils/                      → Utility functions
    └── ...
```

---

## 🎯 Key Distinction: `core/` vs `hooks/core/`

### ❌ Problem: Two folders named "core"

1. **`sceneControls/core/`** (should be renamed to `setup/`)
   - **Type:** Pure JavaScript functions
   - **Purpose:** Setup utilities for Three.js
   - **No React:** Just functions, no hooks
   - **Example:** `createScene()`, `setupLighting()`, `updateEnvironment()`

2. **`sceneControls/hooks/core/`**
   - **Type:** React hooks
   - **Purpose:** Core infrastructure hooks that run ONCE on mount
   - **Uses React:** useState, useEffect, useRef
   - **Example:** `useSceneInitialization()`, `useObjectManager()`
   - **Dependencies:** Calls the functions from `core/setup/`

### ✅ Recommended Fix: Rename `core/` → `setup/`

```diff
src/features/sceneControls/
- ├── core/                    → Pure utility functions
+ ├── setup/                   → Pure utility functions
  │   ├── environmentSetup.js
  │   ├── lightingSetup.js
  │   └── sceneSetup.js
  │
  ├── hooks/
  │   ├── core/                → Core React hooks (keep this name)
  │   │   ├── useSceneInitialization.js  (calls setup/ functions)
  │   │   └── useObjectManager.js
```

---

## 🔄 Hook Execution Flow

### Order of Execution (Critical!)

```
1. CORE INFRASTRUCTURE (hooks/core/)
   ↓
   useSceneInitialization()  → Creates scene, camera, renderer, lights
   useObjectManager()         → Creates 3D objects
   ↓
   Everything else depends on these being initialized first!

2. VISUAL EFFECTS (hooks/effects/)
   ↓
   useMouseTracking()         → Mouse position tracking
   useEnvironmentUpdate()     → Environment setup
   useNebulaParticles()       → Particle effects
   useMetalnessLighting()     → Extra lighting

3. PROPERTY UPDATES (hooks/updates/)
   ↓
   useCameraController()      → Camera position
   useMaterialUpdates()       → Material properties
   useLightingUpdates()       → Light properties

4. USER INTERACTION (hooks/interaction/)
   ↓
   useObjectInteraction()     → Mouse-over effects
   useAnimationLoop()         → Main animation loop (runs last!)
```

---

## 📝 Naming Convention

### Setup Functions (in `setup/` folder)
- **Pattern:** `verbNoun()` - imperative, action-based
- **Examples:**
  - `createScene()`
  - `updateEnvironment()`
  - `setupLighting()`
- **Return:** Three.js objects or void
- **No React:** Pure functions

### React Hooks (in `hooks/` folders)
- **Pattern:** `useSomething()` - React convention
- **Examples:**
  - `useSceneInitialization()`
  - `useMaterialUpdates()`
  - `useAnimationLoop()`
- **Return:** Usually void (may return refs or helper functions)
- **Uses React:** useState, useEffect, useRef

---

## 🧩 How They Connect

```javascript
// In hooks/core/useSceneInitialization.js
import { createScene } from '../../setup/sceneSetup';      // Pure function
import { updateEnvironment } from '../../setup/environmentSetup';  // Pure function

export function useSceneInitialization(refs, config) {
  useEffect(() => {
    // Hook CALLS the pure setup functions
    const scene = createScene();
    updateEnvironment(scene, config.environment);
    
    // Store in refs for other hooks to access
    refs.sceneRef.current = scene;
  }, []);
}
```

**Flow:**
1. `ThreeScene.jsx` calls `useSceneInitialization()` (React hook)
2. Hook calls `createScene()` (pure function from `setup/`)
3. Hook stores result in refs
4. Other hooks access refs to modify scene

---

## 🎨 Mental Model

Think of it as layers:

```
┌─────────────────────────────────────────┐
│   ThreeScene.jsx (React Component)      │
│   - Manages React state & refs          │
│   - Calls hooks in specific order       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   hooks/ (React Hooks Layer)            │
│   - useSceneInitialization              │
│   - useObjectManager                    │
│   - useMaterialUpdates                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   setup/ (Pure Functions Layer)         │
│   - createScene()                       │
│   - setupLighting()                     │
│   - updateEnvironment()                 │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Three.js Library                      │
│   - THREE.Scene                         │
│   - THREE.Camera                        │
│   - THREE.Renderer                      │
└─────────────────────────────────────────┘
```

---

## 📌 Summary

| Folder | Type | React? | Purpose | Example |
|--------|------|--------|---------|---------|
| `setup/` | Functions | ❌ No | Create Three.js objects | `createScene()` |
| `hooks/core/` | Hooks | ✅ Yes | Initialize on mount | `useSceneInitialization()` |
| `hooks/effects/` | Hooks | ✅ Yes | Add visual effects | `useNebulaParticles()` |
| `hooks/updates/` | Hooks | ✅ Yes | React to prop changes | `useMaterialUpdates()` |
| `hooks/interaction/` | Hooks | ✅ Yes | Handle user input | `useAnimationLoop()` |

**Key Insight:** 
- `setup/` = **What** to create (pure functions)
- `hooks/` = **When** to create it (React lifecycle)
