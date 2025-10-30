# Understanding Data Flow & Parameter Deconstruction

This guide helps you trace where parameters come from and how they flow through your hooks.

---

## The Core Concept: Destructuring in Function Parameters

When you see code like this in a hook:

```javascript
export function useObjectManager(refs, objectProps) {
  const { sceneRef, objectsRef, materialRef } = refs;
  const { objectCount, objectType, baseColor } = objectProps;
```

The destructuring (the curly braces `{ }`) means:

- **Take the object that was passed in**
- **Extract specific properties from it**
- **Create local variables with those names**

---

## Full Data Flow Example: useObjectManager()

### Step 1: Where It Starts (ThreeScene.jsx)

```javascript
// Line 59-72: CREATE REFS
const sceneRef = useRef(null);
const objectsRef = useRef([]);
const materialRef = useRef(null);
const cameraRef = useRef(null);
// ... more refs ...

// Line 73+: STATE (from parent component props)
const objectCount = 5; // From props passed to ThreeScene
const objectType = "tesseract"; // From props
const baseColor = "#ff00ff"; // From props
```

### Step 2: How It's Passed to the Hook (ThreeScene.jsx, lines 85-88)

```javascript
useObjectManager(
  { sceneRef, objectsRef, materialRef }, // ← FIRST OBJECT PARAMETER
  {
    objectCount,
    objectType,
    baseColor,
    metalness,
    emissiveIntensity,
    wireframeIntensity,
    hyperframeColor,
    hyperframeLineColor,
  } // ← SECOND OBJECT PARAMETER
);
```

**Translation:**

- First parameter is an object with THREE properties: `sceneRef`, `objectsRef`, `materialRef`
- Second parameter is an object with MANY properties: `objectCount`, `objectType`, etc.

### Step 3: How It's Received in the Hook (useObjectManager.js, line 21)

```javascript
export function useObjectManager(refs, objectProps) {
  // DESTRUCTURE first parameter (refs)
  const { sceneRef, objectsRef, materialRef } = refs;

  // DESTRUCTURE second parameter (objectProps)
  const {
    objectCount,
    objectType,
    baseColor,
    metalness,
    emissiveIntensity,
    wireframeIntensity,
    hyperframeColor,
    hyperframeLineColor,
    cpdTK_p,
    cpdTK_q,
    cpdTK_tubeRadius,
    cpdTK_gap,
  } = objectProps;

  // NOW YOU CAN USE THESE DIRECTLY:
  // sceneRef.current
  // objectsRef.current
  // objectCount (the number)
  // objectType (the string)
  // etc...
}
```

### Step 4: Inside the Hook

```javascript
useEffect(() => {
  if (!sceneRef.current) return; // Use sceneRef directly now!

  const scene = sceneRef.current;

  objectsRef.current.forEach((obj) => {
    // Use objectsRef directly!
    scene.remove(obj.solidMesh);
  });

  for (let i = 0; i < objectCount; i++) {
    // Use objectCount directly!
    const objectData = createSceneObject({
      objectType, // Use objectType directly!
      objectCount, // Use objectCount directly!
      objectIndex: i,
      baseColor, // Use baseColor directly!
      metalness, // Use metalness directly!
      // ... pass all the props ...
    });
  }
}, [objectCount, objectType, cpdTK_p, cpdTK_q, cpdTK_tubeRadius, cpdTK_gap]);
```

---

## All Hooks Documented This Way

### useSceneInitialization()

**Passed from ThreeScene.jsx:**

```javascript
useSceneInitialization(
  {
    sceneRef,
    cameraRef,
    rendererRef,
    mountRef,
    ambientLightRef,
    directionalLightRef,
    animationIdRef,
  },
  {
    ambientLightColor,
    ambientLightIntensity,
    directionalLightColor,
    directionalLightIntensity,
    directionalLightX,
    directionalLightY,
    directionalLightZ,
  }
);
```

**Received in hook:**

```javascript
export function useSceneInitialization(refs, lightingProps) {
  const { sceneRef, cameraRef, rendererRef, mountRef, ambientLightRef, directionalLightRef, animationIdRef } = refs;
  const { ambientLightColor, ambientLightIntensity, directionalLightColor, directionalLightIntensity,
          directionalLightX, directionalLightY, directionalLightZ } = lightingProps;
```

---

### useObjectInteraction()

**Passed from ThreeScene.jsx:**

```javascript
const { getUserRotation, decayUserRotations } = useObjectInteraction({
  sceneRef,
  cameraRef,
  rendererRef,
});
```

**Received in hook:**

```javascript
export function useObjectInteraction(refs) {
  const { sceneRef, cameraRef, rendererRef } = refs;

  // Returns an object with these properties:
  return {
    getUserRotation,
    decayUserRotations,
    hoveredObject: hoveredObject.current,
  };
}
```

---

### useAnimationLoop()

**Passed from ThreeScene.jsx:**

```javascript
useAnimationLoop(
  { rendererRef, sceneRef, cameraRef, animationIdRef, objectsRef },
  { animationStyle, cameraView },
  { getUserRotation, decayUserRotations }
);
```

**Received in hook:**

```javascript
export function useAnimationLoop(refs, settings, interactionFns = {}) {
  const { rendererRef, sceneRef, cameraRef, animationIdRef, objectsRef } = refs;
  const { animationStyle, cameraView } = settings;

  // interactionFns is already destructured in params with defaults
  // If not passed, it defaults to {}
}
```

---

## Quick Reference: Where Each Parameter Comes From

| Parameter Name        | Where It Comes From    | What It Contains                             |
| --------------------- | ---------------------- | -------------------------------------------- |
| `sceneRef`            | ThreeScene.jsx line 59 | `useRef(null)` pointing to Three.js scene    |
| `objectsRef`          | ThreeScene.jsx line 66 | `useRef([])` array of all objects            |
| `materialRef`         | ThreeScene.jsx line 61 | `useRef(null)` pointing to first material    |
| `cameraRef`           | ThreeScene.jsx line 63 | `useRef(null)` pointing to Three.js camera   |
| `rendererRef`         | ThreeScene.jsx line 64 | `useRef(null)` pointing to Three.js renderer |
| `mountRef`            | ThreeScene.jsx line 60 | `useRef(null)` pointing to DOM element       |
| `animationIdRef`      | ThreeScene.jsx line 67 | `useRef(null)` for animation frame ID        |
| `ambientLightRef`     | ThreeScene.jsx line 69 | `useRef(null)` pointing to ambient light     |
| `directionalLightRef` | ThreeScene.jsx line 70 | `useRef(null)` pointing to directional light |
| `objectCount`         | ThreeScene props       | Number (e.g., 5)                             |
| `objectType`          | ThreeScene props       | String (e.g., 'tesseract')                   |
| `baseColor`           | ThreeScene props       | Hex color string (e.g., '#ff00ff')           |
| `metalness`           | ThreeScene props       | Number 0-1                                   |
| `emissiveIntensity`   | ThreeScene props       | Number 0-2                                   |
| `wireframeIntensity`  | ThreeScene props       | Number 0-100                                 |
| `animationStyle`      | ThreeScene props       | String ('orbit', 'spin', etc.)               |
| `cameraView`          | ThreeScene props       | String ('free', 'orbit', 'top')              |

---

## Visual Diagram: The Complete Flow

```
┌─────────────────────────────────────────────────────────────┐
│ ThreeScene.jsx (The Central Hub)                            │
│                                                              │
│ const sceneRef = useRef(null)         ┐                     │
│ const objectsRef = useRef([])         │                     │
│ const materialRef = useRef(null)      │ REFS (from useState │
│ const cameraRef = useRef(null)        │ and useRef)         │
│ const rendererRef = useRef(null)      │                     │
│ const mountRef = useRef(null)         ┘                     │
│                                                              │
│ const objectCount = props.objectCount ┐                     │
│ const objectType = props.objectType   │ PROPS (from parent  │
│ const baseColor = props.baseColor     │ component)          │
│ ... more props ...                    ┘                     │
└─────────────────────────────────────────────────────────────┘
                         ↓
        ┌────────────────────────────────┐
        │ Package & Pass to Hooks        │
        └────────────────────────────────┘
                         ↓
    ┌────────────────────────────────────────────┐
    │ useObjectManager(                          │
    │   { sceneRef, objectsRef, materialRef },   │
    │   { objectCount, objectType, baseColor,... │
    │ )                                          │
    └────────────────────────────────────────────┘
                         ↓
    ┌────────────────────────────────────────────┐
    │ Inside Hook: Destructure & Use             │
    │                                            │
    │ const { sceneRef, objectsRef, ... } = refs│
    │ const { objectCount, objectType, ... } = props
    │                                            │
    │ NOW USE THEM:                              │
    │ - sceneRef.current                         │
    │ - objectsRef.current                       │
    │ - objectCount                              │
    │ - objectType                               │
    └────────────────────────────────────────────┘
```

---

## Study Method: The Three-Step Process

### Step 1: Read ThreeScene.jsx

- Find where each `useRef` is created
- See what it's initialized to
- Find where hooks are called

### Step 2: Read the Hook File

- See what parameters it receives
- See how they're destructured
- See how they're used inside

### Step 3: Trace Backwards from Error

If something breaks, trace backwards:

```
Error: "Cannot read property 'current' of undefined"
    ↓
Which variable is undefined?
    ↓
Where was it destructured?
    ↓
What object did it come from?
    ↓
Was it passed correctly from ThreeScene.jsx?
```

---

## Common Patterns You'll See

### Pattern 1: Refs Object

```javascript
// In ThreeScene.jsx
const sceneRef = useRef(null);
const cameraRef = useRef(null);

// Pass them as an object
useHook({ sceneRef, cameraRef });

// In the hook
export function useHook(refs) {
  const { sceneRef, cameraRef } = refs; // ← Destructure
}
```

### Pattern 2: Props Object

```javascript
// In ThreeScene.jsx
const objectCount = 5;
const objectType = "tesseract";

// Pass them as an object
useHook({ objectCount, objectType });

// In the hook
export function useHook(props) {
  const { objectCount, objectType } = props; // ← Destructure
}
```

### Pattern 3: Multiple Objects

```javascript
// Pass multiple objects as separate params
useHook(
  { ref1, ref2 }, // First object
  { prop1, prop2 } // Second object
);

// Receive them
export function useHook(refs, props) {
  const { ref1, ref2 } = refs;
  const { prop1, prop2 } = props;
}
```

### Pattern 4: Returning Values

```javascript
// Hook returns an object
const { value1, value2 } = useHook(...);

// Inside hook
return {
  value1: someValue,
  value2: someOtherValue,
};
```

---

## Debugging Tip: Add Console Logs

```javascript
export function useObjectManager(refs, objectProps) {
  console.log("useObjectManager received:");
  console.log("refs:", refs); // See entire first object
  console.log("objectProps:", objectProps); // See entire second object

  const { sceneRef, objectsRef, materialRef } = refs;
  console.log("Destructured sceneRef:", sceneRef); // Should have .current

  const { objectCount, objectType } = objectProps;
  console.log("objectCount:", objectCount, typeof objectCount); // Should be a number
}
```

This shows you exactly what's being passed and helps identify where values come from!
