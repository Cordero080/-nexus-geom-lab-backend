# Custom Hooks Inventory

Quick reference list of all custom hooks in the application.

## Summary

**Total Custom Hooks: 11**

---

## Hooks by Location

### Scene Context Hooks

| Hook         | Location                        | Purpose                        |
| ------------ | ------------------------------- | ------------------------------ |
| `useScene()` | `/src/context/SceneContext.jsx` | Access scene state and methods |
| `useAuth()`  | `/src/context/AuthContext.jsx`  | Access authentication state    |

### Three.js Setup Hooks

| Hook                       | Location                                                      | Purpose                            |
| -------------------------- | ------------------------------------------------------------- | ---------------------------------- |
| `useSceneInitialization()` | `/src/features/sceneControls/hooks/useSceneInitialization.js` | Initialize scene, camera, renderer |
| `useCameraController()`    | `/src/features/sceneControls/hooks/useCameraController.js`    | Control camera view modes          |
| `useLightingUpdates()`     | `/src/features/sceneControls/hooks/useLightingUpdates.js`     | Update lighting in real-time       |

### Object & Material Hooks

| Hook                   | Location                                                  | Purpose                         |
| ---------------------- | --------------------------------------------------------- | ------------------------------- |
| `useObjectManager()`   | `/src/features/sceneControls/hooks/useObjectManager.js`   | Create and manage scene objects |
| `useMaterialUpdates()` | `/src/features/sceneControls/hooks/useMaterialUpdates.js` | Update material properties      |

### Animation & Interaction Hooks

| Hook                     | Location                                                    | Purpose                         |
| ------------------------ | ----------------------------------------------------------- | ------------------------------- |
| `useAnimationLoop()`     | `/src/features/sceneControls/hooks/useAnimationLoop.js`     | Manage animation loop           |
| `useObjectInteraction()` | `/src/features/sceneControls/hooks/useObjectInteraction.js` | Handle object mouse interaction |

### Effects & Environment Hooks

| Hook                     | Location                                               | Purpose                  |
| ------------------------ | ------------------------------------------------------ | ------------------------ |
| `useMouseTracking()`     | `/src/features/sceneControls/hooks/useSceneEffects.js` | Track mouse for effects  |
| `useEnvironmentUpdate()` | `/src/features/sceneControls/hooks/useSceneEffects.js` | Update scene environment |

### Text Effects Hooks

| Hook                | Location                       | Purpose                        |
| ------------------- | ------------------------------ | ------------------------------ |
| `useTextScramble()` | `/src/utils/textScrambler.jsx` | Animate text scrambling effect |

---

## Hooks by Category

### 🎬 Scene Management (2)

1. `useScene()` - Full scene state and methods
2. `useAuth()` - User authentication and permissions

### 🖼️ Three.js Initialization (3)

1. `useSceneInitialization()` - Setup scene and renderer
2. `useCameraController()` - Manage camera position
3. `useLightingUpdates()` - Control lighting

### 🎨 Object & Material (2)

1. `useObjectManager()` - Create/destroy objects
2. `useMaterialUpdates()` - Tweak appearance in real-time

### ⚙️ Animation & Interaction (2)

1. `useAnimationLoop()` - Main animation frame loop
2. `useObjectInteraction()` - Mouse-based object rotation

### ✨ Effects & Environment (2)

1. `useMouseTracking()` - Mouse position tracking
2. `useEnvironmentUpdate()` - Scene background/environment

### 📝 UI Effects (1)

1. `useTextScramble()` - Text scrambling animation

---

## Common Hook Patterns

### Pattern 1: Three.js Setup

```javascript
useSceneInitialization()
  ↓
useAnimationLoop()
  ↓
All rendering hooks (camera, lighting, objects)
```

### Pattern 2: Material Updates

```javascript
useObjectManager()  // Create objects once
  ↓
useMaterialUpdates()  // Update continuously without rebuilding
```

### Pattern 3: Interaction

```javascript
useObjectInteraction()  // Detect hover/interaction
  ↓
Passed to useAnimationLoop()  // Applied in animation frame
```

### Pattern 4: Context Access

```javascript
useScene()  // Get scene state
useAuth()   // Get user permissions
  ↓
Used to guard operations and render UI
```

---

## Hook Parameters Cheat Sheet

| Hook                       | Key Parameters                 |
| -------------------------- | ------------------------------ |
| `useSceneInitialization()` | refs, lightingProps            |
| `useObjectManager()`       | refs, objectProps              |
| `useMaterialUpdates()`     | objectsRef, materialProps      |
| `useAnimationLoop()`       | refs, settings, interactionFns |
| `useObjectInteraction()`   | refs                           |
| `useLightingUpdates()`     | refs, lightingProps            |
| `useCameraController()`    | cameraRef, cameraView          |
| `useMouseTracking()`       | rendererRef, cameraRef         |
| `useEnvironmentUpdate()`   | sceneRef, environment, hue     |
| `useTextScramble()`        | finalText, duration, trigger   |
| `useScene()`               | (context only)                 |
| `useAuth()`                | (context only)                 |

---

## Return Values Quick Reference

| Hook                       | Returns                                                |
| -------------------------- | ------------------------------------------------------ |
| `useSceneInitialization()` | void (side effects)                                    |
| `useObjectManager()`       | void (manages refs)                                    |
| `useMaterialUpdates()`     | void (manages refs)                                    |
| `useAnimationLoop()`       | void (manages animation)                               |
| `useObjectInteraction()`   | { getUserRotation, decayUserRotations, hoveredObject } |
| `useLightingUpdates()`     | void (manages refs)                                    |
| `useCameraController()`    | void (manages camera)                                  |
| `useMouseTracking()`       | void (tracks mouse)                                    |
| `useEnvironmentUpdate()`   | void (updates scene)                                   |
| `useTextScramble()`        | string (display text)                                  |
| `useScene()`               | { state, actions, setters }                            |
| `useAuth()`                | { user, token, isAuthenticated, methods }              |

---

## Dependency Tracking

### Zero Dependencies (Run Once)

- `useSceneInitialization()` - Empty dependency array `[]`
- `useMouseTracking()` - Empty dependency array `[]`

### Single Dependencies (Re-run on Change)

- `useCameraController()` - Depends on `[cameraView]`

### Multiple Dependencies (Complex Updates)

- `useObjectManager()` - Depends on geometry props `[objectCount, objectType, ...]`
- `useMaterialUpdates()` - Multiple color/property effects with specific deps
- `useLightingUpdates()` - Separate effects for each light property
- `useAnimationLoop()` - Depends on `[animationStyle, cameraView]`
- `useTextScramble()` - Depends on `[finalText, duration, trigger]`

---

## Performance Notes

1. **useObjectManager()** - Expensive (rebuilds geometry), avoid changing props frequently
2. **useMaterialUpdates()** - Cheap (only updates material), safe to run every frame
3. **useLightingUpdates()** - Cheap, safe to run frequently
4. **useAnimationLoop()** - Should run continuously for smooth animation
5. **useObjectInteraction()** - Event listener based, minimal overhead
6. **useTextScramble()** - Animation loop with 50ms intervals

---

## Common Issues & Solutions

| Issue                       | Likely Cause                                                 | Solution                                        |
| --------------------------- | ------------------------------------------------------------ | ----------------------------------------------- |
| Objects not visible         | Scene not initialized                                        | Ensure `useSceneInitialization()` runs first    |
| Material changes don't show | Using `useObjectManager()` instead of `useMaterialUpdates()` | Use `useMaterialUpdates()` for real-time tweaks |
| Animation stutters          | Too many deps in animation hook                              | Memoize interaction functions                   |
| Lights not updating         | Light refs not passed to updates                             | Ensure refs from init are passed to updates     |
| Camera doesn't move         | `useCameraController()` not receiving cameraView             | Pass cameraView prop from parent                |
| Mouse tracking not working  | Renderer not ready                                           | Verify renderer ref exists                      |
| Text scramble stuck         | Trigger prop not true                                        | Set `trigger={true}` to start animation         |
