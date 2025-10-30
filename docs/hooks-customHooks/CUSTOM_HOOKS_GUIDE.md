# Custom Hooks Guide

This document provides a comprehensive overview of all custom hooks in the nexus-geom-3D application, organized by category with descriptions, parameters, and example usage.

---

## Table of Contents

1. [Scene Management Hooks](#scene-management-hooks)
2. [Three.js Initialization & Setup](#threejs-initialization--setup)
3. [Material & Object Management](#material--object-management)
4. [Animation & Interaction](#animation--interaction)
5. [Lighting & Camera](#lighting--camera)
6. [Effects & Environment](#effects--environment)
7. [UI & Text Effects](#ui--text-effects)
8. [Context Hooks](#context-hooks)

---

## Scene Management Hooks

### `useScene()`

**Location:** `/src/context/SceneContext.jsx`

**Purpose:** Access the Scene Context and manage scene state across the application.

**What it does:**

- Manages current scene ID, ownership, metadata (name, description, isPublic)
- Tracks scene mode: 'fresh', 'loaded', or 'remixed'
- Provides methods to save, load, delete, and reset scenes
- Stores and retrieves scene configuration

**Returns:**

```javascript
{
  // State
  currentSceneId: string | null,
  sceneOwner: string | null,        // User ID of scene owner
  sceneName: string,
  sceneDescription: string,
  isPublic: boolean,
  sceneMode: 'fresh' | 'loaded' | 'remixed',
  loadedConfig: Object | null,      // Scene configuration

  // Computed
  isOwnScene: (currentUserId) => boolean,

  // Actions
  saveScene: async (sceneData, userId, token) => Promise<Object>,
  loadScene: (scene, currentUserId) => Object,
  deleteScene: async (sceneId, token) => Promise<void>,
  resetScene: () => void,

  // Setters
  setSceneName: (name) => void,
  setSceneDescription: (description) => void,
  setIsPublic: (isPublic) => void
}
```

**Example Usage:**

```javascript
import { useScene } from "@/context/SceneContext";

function MyComponent() {
  const { currentSceneId, sceneName, saveScene, loadScene, isOwnScene } =
    useScene();

  // Check if user owns the current scene
  const ownsScene = isOwnScene(userId);

  // Save a new scene
  const handleSave = async () => {
    await saveScene(
      {
        name: "My Scene",
        description: "Beautiful geometry",
        isPublic: true,
        config: {
          /* scene config */
        },
      },
      userId,
      token
    );
  };

  // Load a scene
  const handleLoad = (sceneData) => {
    const config = loadScene(sceneData, userId);
    // Apply config to scene
  };

  return <div>{sceneName || "New Scene"}</div>;
}
```

---

## Three.js Initialization & Setup

### `useSceneInitialization()`

**Location:** `/src/features/sceneControls/hooks/useSceneInitialization.js`

**Purpose:** Initialize the Three.js scene, camera, renderer, and lighting on component mount.

**What it does:**

- Creates the Three.js scene, camera, and renderer
- Mounts renderer canvas to DOM
- Initializes ambient and directional lights
- Sets up window resize event listener
- Handles cleanup on unmount (cancels animation frames, removes event listeners)

**Parameters:**

```javascript
refs: {
  sceneRef,                    // Reference to store the scene
  cameraRef,                   // Reference to store the camera
  rendererRef,                 // Reference to store the renderer
  mountRef,                    // Reference to DOM element for canvas
  ambientLightRef,             // Reference to store ambient light
  directionalLightRef,         // Reference to store directional light
  animationIdRef               // Reference to store animation frame ID
}

lightingProps: {
  ambientLightColor: string,           // Hex color (e.g., "#ffffff")
  ambientLightIntensity: number,       // 0-1 range
  directionalLightColor: string,       // Hex color
  directionalLightIntensity: number,   // 0-1 range
  directionalLightX: number,           // X position
  directionalLightY: number,           // Y position
  directionalLightZ: number            // Z position
}
```

**Returns:** `void` (side effects only)

**Example Usage:**

```javascript
import { useSceneInitialization } from "@/features/sceneControls/hooks/useSceneInitialization";
import { useRef, useEffect } from "react";

function ThreeJsComponent() {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const mountRef = useRef(null);
  const ambientLightRef = useRef(null);
  const directionalLightRef = useRef(null);
  const animationIdRef = useRef(null);

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
      ambientLightColor: "#ffffff",
      ambientLightIntensity: 0.5,
      directionalLightColor: "#ffff99",
      directionalLightIntensity: 1,
      directionalLightX: 5,
      directionalLightY: 10,
      directionalLightZ: 7,
    }
  );

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
}
```

---

## Material & Object Management

### `useObjectManager()`

**Location:** `/src/features/sceneControls/hooks/useObjectManager.js`

**Purpose:** Manage object creation and updates in the Three.js scene.

**What it does:**

- Creates all scene objects using the object factory
- Removes old objects when props change
- Stores object data for animations and updates
- Separates solid meshes, wireframe meshes, and hyperframe elements
- Optimization: Color changes don't trigger rebuild; only geometry-affecting props do

**Parameters:**

```javascript
refs: {
  sceneRef,                    // Reference to the scene
  objectsRef,                  // Reference to array of object data
  materialRef                  // Reference to main material for debugging
}

objectProps: {
  objectCount: number,         // Number of objects to create
  objectType: string,          // Type of geometry (e.g., 'tesseract')
  baseColor: string,           // Base color hex
  metalness: number,           // 0-1
  emissiveIntensity: number,   // 0-2
  wireframeIntensity: number,  // Wireframe opacity
  hyperframeColor: string,     // Spiral color hex
  hyperframeLineColor: string, // Edge color hex
  // Optional geometry-specific props
  cpdTK_p?: number,
  cpdTK_q?: number,
  cpdTK_tubeRadius?: number,
  cpdTK_gap?: number
}
```

**Returns:** `void` (manages refs)

**Example Usage:**

```javascript
import { useObjectManager } from "@/features/sceneControls/hooks/useObjectManager";

function ControlPanel() {
  const [objectCount, setObjectCount] = useState(5);
  const [objectType, setObjectType] = useState("tesseract");
  const [baseColor, setBaseColor] = useState("#ff00ff");

  useObjectManager(
    { sceneRef, objectsRef, materialRef },
    {
      objectCount,
      objectType,
      baseColor,
      metalness: 0.7,
      emissiveIntensity: 1.5,
      wireframeIntensity: 30,
      hyperframeColor: "#00ffff",
      hyperframeLineColor: "#ffff00",
    }
  );

  return (
    <div>
      <input
        type="number"
        value={objectCount}
        onChange={(e) => setObjectCount(+e.target.value)}
      />
      <input
        type="color"
        value={baseColor}
        onChange={(e) => setBaseColor(e.target.value)}
      />
    </div>
  );
}
```

---

### `useMaterialUpdates()`

**Location:** `/src/features/sceneControls/hooks/useMaterialUpdates.js`

**Purpose:** Update material properties without recreating objects.

**What it does:**

- Updates scale, metalness, roughness, emissive intensity, and colors
- Handles both solid and wireframe meshes
- Manages hyperframe element colors and opacity
- Uses deduplication to avoid updating same material multiple times
- Optimized for real-time UI updates

**Parameters:**

```javascript
objectsRef:                    // Reference to array of object data

materialProps: {
  scale: number,               // Scale multiplier for all objects
  metalness: number,           // 0-1 (PBR metalness)
  emissiveIntensity: number,   // 0-2 (multiplied by baseColor)
  baseColor: string,           // Base color hex
  wireframeIntensity: number,  // 0-100 opacity
  hyperframeColor: string,     // Spiral color hex
  hyperframeLineColor: string  // Edge color hex
}
```

**Returns:** `void` (manages refs)

**Example Usage:**

```javascript
import { useMaterialUpdates } from "@/features/sceneControls/hooks/useMaterialUpdates";

function MaterialSliders() {
  const [scale, setScale] = useState(1);
  const [metalness, setMetalness] = useState(0.7);
  const [emissive, setEmissive] = useState(1);

  useMaterialUpdates(objectsRef, {
    scale,
    metalness,
    emissiveIntensity: emissive,
    baseColor: "#00ffff",
    wireframeIntensity: 50,
    hyperframeColor: "#ff00ff",
    hyperframeLineColor: "#ffff00",
  });

  return (
    <div>
      <input
        type="range"
        min="0"
        max="2"
        step="0.1"
        value={scale}
        onChange={(e) => setScale(+e.target.value)}
      />
      Scale: {scale}
    </div>
  );
}
```

---

## Animation & Interaction

### `useAnimationLoop()`

**Location:** `/src/features/sceneControls/hooks/useAnimationLoop.js`

**Purpose:** Manage the main animation loop for the Three.js scene.

**What it does:**

- Starts the animation loop using `startAnimationLoop()`
- Handles animation style and camera view updates
- Integrates user interaction functions (rotation overrides)
- Cleans up animation frame on unmount

**Parameters:**

```javascript
refs: {
  rendererRef,                 // Renderer reference
  sceneRef,                    // Scene reference
  cameraRef,                   // Camera reference
  animationIdRef,              // Animation frame ID reference
  objectsRef                   // Objects reference
}

settings: {
  animationStyle: string,      // Current animation style
  cameraView: string           // Camera view mode
}

interactionFns?: {             // Optional user interaction functions
  getUserRotation: (objectId) => { x, y, z },
  decayUserRotations: () => void
}
```

**Returns:** `void` (manages animation frame)

**Example Usage:**

```javascript
import { useAnimationLoop } from "@/features/sceneControls/hooks/useAnimationLoop";

function AnimatedScene() {
  const [animationStyle, setAnimationStyle] = useState("orbit");
  const [cameraView, setCameraView] = useState("free");

  const { getUserRotation, decayUserRotations } = useObjectInteraction(refs);

  useAnimationLoop(
    { rendererRef, sceneRef, cameraRef, animationIdRef, objectsRef },
    { animationStyle, cameraView },
    { getUserRotation, decayUserRotations }
  );

  return (
    <div>
      <select
        value={animationStyle}
        onChange={(e) => setAnimationStyle(e.target.value)}
      >
        <option>orbit</option>
        <option>spin</option>
      </select>
    </div>
  );
}
```

---

### `useObjectInteraction()`

**Location:** `/src/features/sceneControls/hooks/useObjectInteraction.js`

**Purpose:** Handle object rotation from mouse movement (no click required).

**What it does:**

- Detects mouse movement over objects using raycasting
- Stores rotation offsets for each object
- Applies damping to decay rotations smoothly
- Changes cursor to pointer on hover
- Clamps delta values to keep spins smooth

**Parameters:**

```javascript
refs: {
  sceneRef, // Scene reference
    cameraRef, // Camera reference
    rendererRef; // Renderer reference
}
```

**Returns:**

```javascript
{
  getUserRotation: (objectId) => { x, y, z },  // Get stored rotation for object
  decayUserRotations: () => void,              // Decay all stored rotations
  hoveredObject: Object | null                 // Currently hovered object
}
```

**Example Usage:**

```javascript
import { useObjectInteraction } from "@/features/sceneControls/hooks/useObjectInteraction";

function InteractiveScene() {
  const interaction = useObjectInteraction({
    sceneRef,
    cameraRef,
    rendererRef,
  });

  // In animation loop:
  // const userRotation = interaction.getUserRotation(objectId);
  // Apply userRotation to object
  // interaction.decayUserRotations();

  return <div>Hover over objects to rotate them</div>;
}
```

---

## Lighting & Camera

### `useLightingUpdates()`

**Location:** `/src/features/sceneControls/hooks/useLightingUpdates.js`

**Purpose:** Update lighting properties in real-time without recreating lights.

**What it does:**

- Updates ambient light color and intensity
- Updates directional light color, intensity, and position
- Clamps values to safe ranges
- Converts hex colors to Three.js color format

**Parameters:**

```javascript
refs: {
  ambientLightRef,             // Reference to ambient light
  directionalLightRef          // Reference to directional light
}

lightingProps: {
  ambientLightColor: string,           // Hex color
  ambientLightIntensity: number,       // 0-1 range
  directionalLightColor: string,       // Hex color
  directionalLightIntensity: number,   // 0-1 range (min 0.05)
  directionalLightX: number,           // -50 to 50
  directionalLightY: number,           // -50 to 50
  directionalLightZ: number            // -50 to 50
}
```

**Returns:** `void` (manages refs)

**Example Usage:**

```javascript
import { useLightingUpdates } from "@/features/sceneControls/hooks/useLightingUpdates";

function LightingPanel() {
  const [ambientColor, setAmbientColor] = useState("#ffffff");
  const [ambientIntensity, setAmbientIntensity] = useState(0.5);

  useLightingUpdates(
    { ambientLightRef, directionalLightRef },
    {
      ambientLightColor: ambientColor,
      ambientLightIntensity: ambientIntensity,
      directionalLightColor: "#ffff99",
      directionalLightIntensity: 1,
      directionalLightX: 5,
      directionalLightY: 10,
      directionalLightZ: 7,
    }
  );

  return (
    <div>
      <input
        type="color"
        value={ambientColor}
        onChange={(e) => setAmbientColor(e.target.value)}
      />
    </div>
  );
}
```

---

### `useCameraController()`

**Location:** `/src/features/sceneControls/hooks/useCameraController.js`

**Purpose:** Control camera position based on view mode.

**What it does:**

- Positions camera based on `cameraView` prop
- Supports 'free', 'orbit', and 'top' views
- Updates camera position and look-at target

**Parameters:**

```javascript
cameraRef,                     // Reference to the camera
cameraView: string             // 'free' | 'orbit' | 'top'
```

**Returns:** `void` (manages camera position)

**Example Usage:**

```javascript
import { useCameraController } from "@/features/sceneControls/hooks/useCameraController";

function CameraControls() {
  const [cameraView, setCameraView] = useState("free");

  useCameraController(cameraRef, cameraView);

  return (
    <select value={cameraView} onChange={(e) => setCameraView(e.target.value)}>
      <option value="free">Free View</option>
      <option value="orbit">Orbit View</option>
      <option value="top">Top View</option>
    </select>
  );
}
```

---

## Effects & Environment

### `useMouseTracking()`

**Location:** `/src/features/sceneControls/hooks/useSceneEffects.js`

**Purpose:** Track mouse position for orb interaction effects.

**What it does:**

- Updates mouse position on window mousemove events
- Passes position to spectral orbs for interaction
- Cleans up event listener on unmount

**Parameters:**

```javascript
rendererRef, // Reference to renderer
  cameraRef; // Reference to camera
```

**Returns:** `void` (manages mouse tracking)

**Example Usage:**

```javascript
import { useMouseTracking } from "@/features/sceneControls/hooks/useSceneEffects";

function OrbScene() {
  useMouseTracking(rendererRef, cameraRef);

  return <div ref={mountRef} />;
}
```

---

### `useEnvironmentUpdate()`

**Location:** `/src/features/sceneControls/hooks/useSceneEffects.js`

**Purpose:** Update the scene environment when environment type or hue changes.

**What it does:**

- Updates scene environment (background, textures, etc.)
- Applies hue shift in degrees (0-360)
- Responds to environment prop changes

**Parameters:**

```javascript
sceneRef,                      // Reference to the scene
environment: string,           // Environment type
environmentHue: number         // Hue shift in degrees (0-360)
```

**Returns:** `void` (updates scene environment)

**Example Usage:**

```javascript
import { useEnvironmentUpdate } from "@/features/sceneControls/hooks/useSceneEffects";

function EnvironmentSelector() {
  const [environment, setEnvironment] = useState("space");
  const [hue, setHue] = useState(0);

  useEnvironmentUpdate(sceneRef, environment, hue);

  return (
    <div>
      <select
        value={environment}
        onChange={(e) => setEnvironment(e.target.value)}
      >
        <option>space</option>
        <option>studio</option>
        <option>urban</option>
      </select>
      <input
        type="range"
        min="0"
        max="360"
        value={hue}
        onChange={(e) => setHue(+e.target.value)}
      />
      Hue: {hue}°
    </div>
  );
}
```

---

## UI & Text Effects

### `useTextScramble()`

**Location:** `/src/utils/textScrambler.jsx`

**Purpose:** Create a text scrambling animation effect.

**What it does:**

- Animates text by scrambling with random characters and settling progressively
- Uses Katakana characters for the scramble effect
- Returns the current display text to render
- Completes when all characters have settled

**Parameters:**

```javascript
finalText: string,             // Final text to settle on
duration?: number,             // Duration in milliseconds (default: 2000)
trigger?: boolean              // Whether to start animation (default: true)
```

**Returns:** `string` - The current display text

**Example Usage:**

```javascript
import { useTextScramble, ScrambleText } from "@/utils/textScrambler";

// Using the hook
function ScrambledTitle() {
  const displayText = useTextScramble("アトリエ", 2000, true);

  return <h1>{displayText}</h1>;
}

// Using the component
function App() {
  return (
    <ScrambleText
      finalText="NEXUS GEOM"
      duration={2500}
      trigger={true}
      className="title"
      style={{ fontSize: "2em" }}
    />
  );
}
```

---

## Context Hooks

### `useAuth()`

**Location:** `/src/context/AuthContext.jsx`

**Purpose:** Access authentication state and methods across the application.

**What it does:**

- Manages user login, signup, and logout
- Persists auth state in localStorage
- Tracks unlocked Noetechs (features)
- Provides loading state for async operations
- Restores session on app reload

**Returns:**

```javascript
{
  user: {
    id: string,
    username: string,
    email: string,
    unlockedNoetechs: string[]  // Array of unlocked feature keys
  } | null,
  token: string | null,
  isAuthenticated: boolean,
  isLoading: boolean,

  // Methods
  login: async (email, password) => Promise<Object>,
  signup: async (username, email, password) => Promise<Object>,
  logout: () => void,
  addUnlockedNoetechs: (newKeys: string[]) => void
}
```

**Example Usage:**

```javascript
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isAuthenticated) {
    return <div>Welcome, {user.username}!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## All Custom Hooks Inventory

### Scene & Context Management

- ✅ `useScene()` - Scene state and methods
- ✅ `useAuth()` - Authentication state and methods

### Three.js Setup

- ✅ `useSceneInitialization()` - Initialize scene, camera, renderer
- ✅ `useCameraController()` - Control camera views
- ✅ `useLightingUpdates()` - Update lighting properties

### Object & Material Management

- ✅ `useObjectManager()` - Create and manage scene objects
- ✅ `useMaterialUpdates()` - Update material properties in real-time

### Animation & Interaction

- ✅ `useAnimationLoop()` - Main animation loop
- ✅ `useObjectInteraction()` - Handle object rotation from mouse

### Effects & Environment

- ✅ `useMouseTracking()` - Track mouse for orb effects
- ✅ `useEnvironmentUpdate()` - Update scene environment

### UI & Text

- ✅ `useTextScramble()` - Text scrambling animation

**Total: 11 custom hooks**

---

## Hook Dependencies & Relationships

```
useSceneInitialization()
    ↓
useSceneEffects (useMouseTracking + useEnvironmentUpdate)
useAnimationLoop()
useObjectInteraction()
    ↓
useObjectManager()
useMaterialUpdates()
    ↓
useLightingUpdates()
useCameraController()

useScene()  (Context)
useAuth()   (Context)
    ↓
useTextScramble()
```

---

## Best Practices

1. **Use `useRef` for Three.js objects** - Keep references consistent across renders
2. **Separate concerns** - Object creation, material updates, lighting, animation each have dedicated hooks
3. **Optimize with deduplication** - Material updates use Sets to avoid duplicate updates
4. **Handle cleanup** - All hooks with event listeners or animation frames properly clean up
5. **localStorage for persistence** - Auth and scene data automatically saved/restored
6. **Dependency arrays** - Each hook specifies exact dependencies to prevent unnecessary re-runs
