# Study Plan V2: Refactored Architecture (November 14, 2025)

**Purpose**: Structured learning path for understanding the newly refactored codebase  
**Context**: Post-refactoring (geometry consolidation + state extraction + quick wins)  
**Duration**: 4 weeks (adaptable to your pace)  
**Philosophy**: Learn by tracing, building complexity incrementally

> **💡 Read First**: [STUDY_METHOD_PHILOSOPHY.md](./STUDY_METHOD_PHILOSOPHY.md) explains WHY this study approach is optimized for complex codebases.

---

## 📋 Quick Links

- **[Study Method Philosophy](./STUDY_METHOD_PHILOSOPHY.md)** - WHY this approach works (read this first!)
- **[Study Guide](./STUDY_GUIDE_REFACTORED.md)** - 6 core concepts to master
- **[Claude Prompts](./CLAUDE_STUDY_PROMPT.md)** - AI-assisted learning templates
- **[Refactoring Changelog](./REFACTORING_CHANGELOG.md)** - Complete history of changes

---

## 🎯 Study Plan Overview

### What Changed Since Original Plan

**Original Focus (Pre-Nov 14):**
- Understanding monolithic App.jsx (553 lines)
- Tracing state through massive components
- Learning from duplicated code patterns
- Navigating relative import hell (`../../../`)

**New Focus (Post-Nov 14):**
- Understanding custom hooks pattern (useSceneState)
- Tracing state through clean architecture
- Learning from DRY principles and shared utilities
- Navigating with path aliases (`@/`)

### Core Difference
**Old architecture**: Study complexity by untangling spaghetti  
**New architecture**: Study complexity by understanding patterns

---

## 🧠 My Study Method Philosophy

## 📅 4-Week Study Plan

### Week 1: Foundations & Simple Flows

**Goal**: Understand new architecture patterns, trace simple data flows

#### Day 1: Path Aliases & Project Structure (2 hours)
**Focus**: Navigation and organization

**Files to Study:**
- `vite.config.js` (path alias config)
- `jsconfig.json` (VS Code support)
- `src/App.jsx` (updated imports)
- `src/main.jsx` (updated imports)

**Activities:**
1. Read `vite.config.js` resolve.alias section
2. Test autocomplete: type `@/` and see suggestions
3. Convert 5 relative imports to path aliases in a test file
4. Document the before/after

**Trace Exercise:**
```
Pick one import in App.jsx:
  import Controls from '@/components/features/Controls/Controls';

Trace it:
  1. What does @/ resolve to? (./src)
  2. Full path: ./src/components/features/Controls/Controls.jsx
  3. Open that file
  4. Find its exports
  5. Go back to App.jsx, see how it's used
```

**Document:**
- Write: "Path aliases map @ symbols to actual file paths"
- Why: "Makes imports cleaner and refactoring easier"
- Example: Show before/after import

---

#### Day 2: Custom Hooks Pattern (2 hours)
**Focus**: useSceneState hook structure

**Files to Study:**
- `src/hooks/useSceneState.js` (full file, 131 lines)
- `src/App.jsx` (lines 40-92, hook usage)

**Activities:**
1. Count the useState calls in useSceneState (should be 22)
2. Identify the 5 domains (material, hyperframe, scene, lighting, animation)
3. Trace the return object structure
4. See how App.jsx destructures it

**Trace Exercise:**
```
Follow metalness state:
  1. In useSceneState.js, find: const [metalness, setMetalness] = useState(0.5);
  2. Find in return object: metalness, setMetalness,
  3. In App.jsx, find destructuring: metalness, setMetalness,
  4. Find where it's used: <ThreeScene metalness={metalness} ... />
```

**Compare:**
**Before (App.jsx - OLD):**
```javascript
const [metalness, setMetalness] = useState(0.5);
const [emissiveIntensity, setEmissiveIntensity] = useState(0);
// ... 20 more useState calls
```

**After (App.jsx - NEW):**
```javascript
const { metalness, setMetalness, emissiveIntensity, setEmissiveIntensity, ... } = useSceneState();
```

**Document:**
- Write: "Custom hooks extract stateful logic into reusable functions"
- Why: "Organizes related state, makes component cleaner"
- Pattern: "Create hook → Define state → Return state + setters → Destructure in component"

---

#### Day 3: Simple State Flow - Metalness Slider (2.5 hours)
**Focus**: Trace one complete user interaction

**Files to Study (open all 5 side by side):**
1. `src/components/features/Controls/sections/MaterialPropertiesSection.jsx`
2. `src/components/features/Controls/Controls.jsx`
3. `src/App.jsx`
4. `src/hooks/useSceneState.js`
5. `src/features/sceneControls/ThreeScene.jsx`

**Trace Exercise:**
```
User moves metalness slider from 0.5 to 0.8

Step 1: UI Event
  File: MaterialPropertiesSection.jsx
  User moves slider
  onChange event fires: onMetalnessChange(0.8)
  Question: Where does onMetalnessChange come from?

Step 2: Prop Drilling
  File: MaterialPropertiesSection.jsx
  onMetalnessChange is a prop passed from parent
  Trace to parent: Controls.jsx
  Find prop: onMetalnessChange={onMetalnessChange}
  Question: Where does Controls get it?

Step 3: Root Component
  File: Controls.jsx
  onMetalnessChange prop comes from App.jsx
  Trace to App.jsx
  Find: <Controls onMetalnessChange={setMetalness} ... />
  Question: Where does setMetalness come from?

Step 4: Custom Hook
  File: App.jsx
  setMetalness destructured from useSceneState()
  const { metalness, setMetalness, ... } = useSceneState();
  Trace to hook

Step 5: State Update
  File: useSceneState.js
  const [metalness, setMetalness] = useState(0.5);
  setMetalness(0.8) updates state
  App.jsx re-renders with new metalness value

Step 6: Prop Passing to 3D
  File: App.jsx
  <ThreeScene metalness={0.8} ... />
  Passes new value as prop

Step 7: 3D Update
  File: ThreeScene.jsx
  Receives metalness prop
  useMaterialUpdates hook watches for changes
  Updates Three.js material.metalness = 0.8
```

**Document:**
```
Flow: User interaction → Event → Prop callback → State setter → Re-render → Prop update → 3D update

Files involved: 5
Pattern: Unidirectional data flow
Hook's role: Centralized state management
```

**Draw Diagram:**
```
[User Slider]
     ↓
[MaterialPropertiesSection - onChange]
     ↓
[Controls - prop passing]
     ↓
[App.jsx - setMetalness from hook]
     ↓
[useSceneState - useState]
     ↓
[App.jsx - re-render with new metalness]
     ↓
[ThreeScene - receives metalness prop]
     ↓
[Three.js Material - updates metalness]
```

---

#### Day 4: DRY Principle - Geometry Consolidation (2 hours)
**Focus**: Understanding shared utilities

**Files to Study:**
- `src/features/sceneControls/utils/geometryHelpers.js` (shared function)
- `src/features/sceneControls/geometries/polytopes/compoundTesseract.js` (usage)
- `src/features/sceneControls/geometries/polytopes/megaTesseract.js` (usage)

**Activities:**
1. Read `createTesseractWithFaces` in geometryHelpers.js
2. Count how many files import it (search project: "createTesseractWithFaces")
3. Understand the function signature: `({ scale, hyperframeColor, baseColor, options })`
4. See how it's used in one polytope file

**Compare:**
**Before (compoundTesseract.js - OLD):**
```javascript
// 80-line function defined inside THIS file
function createTesseractWithFaces(options) {
  // ... tons of geometry code ...
}

// Used locally
const tesseract = createTesseractWithFaces({ scale, hyperframeColor, baseColor });
```

**After (compoundTesseract.js - NEW):**
```javascript
// Just import it
import { createTesseractWithFaces } from '../utils/geometryHelpers';

// Use the shared function
const tesseract = createTesseractWithFaces({ scale, hyperframeColor, baseColor });
```

**Impact Analysis:**
- **Before**: 8 files × 80 lines = 640 lines of duplicate code
- **After**: 1 file × 80 lines = 80 lines (shared)
- **Bug fix**: Before = change 8 files identically, After = change 1 file
- **Consistency**: All tesseracts use same creation logic

**Document:**
- Write: "DRY principle = Don't Repeat Yourself"
- Why: "Duplicate code = duplicate bugs, duplicate maintenance"
- Pattern: "Extract to shared utility → Import where needed → Single source of truth"

---

#### Day 5: Error Boundaries (1.5 hours)
**Focus**: Understanding error handling

**Files to Study:**
- `src/components/shared/ErrorBoundary/ErrorBoundary.jsx`
- `src/components/shared/ErrorBoundary/ErrorBoundary.css`
- `src/main.jsx` (app wrapper)

**Activities:**
1. Read ErrorBoundary class component
2. Identify lifecycle methods: `getDerivedStateFromError`, `componentDidCatch`
3. Understand the fallback UI
4. See how main.jsx wraps the app

**Trace Exercise:**
```
Simulate component error:

Step 1: Error Thrown
  ThreeScene.jsx encounters bad geometry data
  Throws: new Error("Invalid geometry!")

Step 2: Error Propagates
  React propagates up component tree
  Reaches ErrorBoundary wrapper

Step 3: Lifecycle Method
  ErrorBoundary.getDerivedStateFromError() called
  Returns: { hasError: true }

Step 4: State Update
  ErrorBoundary re-renders with hasError = true

Step 5: Fallback UI
  render() method checks state.hasError
  Shows: "⚠️ Something Went Wrong" UI instead of broken component

Step 6: User Actions
  User clicks "Try Again" → handleReset → { hasError: false } → try rendering again
  User clicks "Go Home" → window.location.href = '/' → navigate away
```

**What It Catches vs Doesn't:**
```
✅ CAN catch:
  - Rendering errors (bad JSX, undefined property access)
  - Lifecycle errors (componentDidMount throws)
  - Constructor errors

❌ CANNOT catch:
  - Event handler errors (use try/catch)
  - Async errors (promises, setTimeout)
  - Server-side rendering
  - Errors in ErrorBoundary itself
```

**Document:**
- Write: "Error boundaries prevent component errors from crashing entire app"
- Why: "Better UX (show fallback instead of blank screen), easier debugging"
- Pattern: "Class component → lifecycle methods → conditional render"

---

### Week 2: Medium Complexity Flows

**Goal**: Trace flows involving multiple states, useEffect, Three.js integration

#### Day 6: Color Flow with Format Conversion (2 hours)
**Focus**: baseColor from HTML input to Three.js

**Files to Study:**
- `src/components/features/Controls/sections/MaterialPropertiesSection.jsx`
- `src/hooks/useSceneState.js`
- `src/features/sceneControls/ThreeScene.jsx`
- `src/features/sceneControls/hooks/updates/useMaterialUpdates.js`

**Special Focus: Color format handling**
- HTML input: 8-character hex (#4a0e78ff with alpha)
- Three.js: 6-character hex (#4a0e78 without alpha)

**Trace Exercise:**
```
User picks new base color: #ff0000 (red)

Step 1: Color Picker
  File: MaterialPropertiesSection.jsx
  <input type="color" value={baseColor} onChange={(e) => onBaseColorChange(e.target.value)} />
  Emits: #ff0000ff (8 chars with alpha)

Step 2: Format Handling
  Question: How does the app handle the alpha channel?
  Trace to wherever baseColor is applied to Three.js
  Find: Color parsing/stripping logic

Step 3: State Update
  File: useSceneState.js
  setBaseColor('#ff0000ff')

Step 4: Three.js Application
  File: useMaterialUpdates.js
  Watch for baseColor changes
  Strip to 6 chars: #ff0000
  Apply: material.color.set('#ff0000')
```

**Compare:**
**Issue (OLD - if not handled):**
```javascript
material.color.set('#ff0000ff'); // Three.js breaks with 8-char hex!
```

**Fixed (NEW):**
```javascript
const cleanColor = baseColor.slice(0, 7); // Strip alpha
material.color.set(cleanColor); // Works!
```

**Document:**
- Write: "Color format conversion between HTML inputs and Three.js"
- Bug found: "8-char hex from HTML input breaks Three.js (expects 6-char)"
- Solution: "Strip alpha channel before applying to material"

---

#### Day 7: Lighting System (2.5 hours)
**Focus**: 7-light metalness system

**Files to Study:**
- `src/features/sceneControls/hooks/effects/useMetalnessLighting.js`
- `src/features/sceneControls/ThreeScene.jsx`

**Activities:**
1. Read useMetalnessLighting hook
2. Understand the logic: `if (metalness > 0.4)` trigger all 7 lights
3. Trace light color cycling
4. See how lights affect materials

**Trace Exercise:**
```
User sets metalness to 0.6 (above 0.4 threshold)

Step 1: State Update
  metalness changes to 0.6
  Passes to ThreeScene

Step 2: Hook Response
  File: useMetalnessLighting.js
  useEffect watches metalness
  Condition: if (metalness > 0.4) → true
  Activate all 7 directional lights

Step 3: Light Configuration
  Each light has:
    - Position: [x, y, z]
    - Color: Cycling through spectrum
    - Intensity: Based on metalness value

Step 4: Visual Result
  High metalness + multiple lights = dramatic reflections
  Low metalness (<0.4) = simpler lighting
```

**Why 7 lights?**
- Metallic materials reflect light dramatically
- Multiple light sources create interesting reflections
- Optimized: Only active when metalness > 0.4 (performance)

**Document:**
- Write: "Metalness lighting system dynamically enables 7 lights for metallic materials"
- Why: "Metallic surfaces need multiple light sources for realistic appearance"
- Performance: "Conditional activation (metalness > 0.4) saves resources"

---

#### Day 8: Animation System (2 hours)
**Focus**: Scale, speeds, animation styles

**Files to Study:**
- `src/features/sceneControls/hooks/interaction/useAnimationLoop.js`
- `src/features/sceneControls/animation/`

**Activities:**
1. Understand the animation loop (requestAnimationFrame)
2. Trace how `objectSpeed` and `orbSpeed` affect rotation
3. See different animation styles (rotate, float, omni-intellect)

**Trace Exercise:**
```
User changes object speed from 1.0 to 2.0

Step 1: State Change
  setObjectSpeed(2.0)

Step 2: Animation Loop
  File: useAnimationLoop.js
  Every frame (60fps):
    - Calculate delta time
    - Apply rotation: object.rotation.y += objectSpeed * deltaTime

Step 3: Visual Result
  Faster rotation (2x speed)

Compare animation styles:
  - rotate: Simple Y-axis rotation
  - float: Rotation + up/down movement
  - omni-intellect: Complex 5-phase choreography
```

**Document:**
- Write: "Animation loop runs at 60fps, applies transformations each frame"
- Speed control: "objectSpeed multiplier affects rotation rate"
- Styles: "Different algorithms for movement patterns"

---

#### Day 9: Camera System (2 hours)
**Focus**: Free, Orbit, Top views

**Files to Study:**
- `src/features/sceneControls/hooks/updates/useCameraController.js`
- `src/features/sceneControls/ThreeScene.jsx`

**Activities:**
1. Understand Three.js camera positioning
2. See how cameraView state triggers different configurations
3. Trace OrbitControls integration

**Trace Exercise:**
```
User switches camera from "free" to "orbit"

Step 1: State Change
  setCameraView('orbit')

Step 2: Hook Response
  File: useCameraController.js
  useEffect watches cameraView
  
  Switch statement:
    case 'orbit':
      - Enable OrbitControls
      - Lock camera to orbit around origin
      - User can rotate view with mouse

    case 'free':
      - Disable OrbitControls
      - Camera moves freely through space

    case 'top':
      - Position camera above scene (0, 50, 0)
      - Look down at origin
```

**Document:**
- Write: "Camera system offers 3 view modes with different controls"
- OrbitControls: "Three.js utility for mouse-controlled camera rotation"
- Use cases: "Orbit for inspection, Free for exploration, Top for overview"

---

#### Day 10: Environment System (1.5 hours)
**Focus**: Background environments and hue shifting

**Files to Study:**
- `src/data/portalWorlds.js`
- `src/features/sceneControls/core/environmentSetup.js`

**Activities:**
1. See the portalWorlds data structure
2. Understand hue rotation (0-360 degrees)
3. Trace how environment changes background

**Trace Exercise:**
```
User selects "Nebula" environment

Step 1: State Change
  setEnvironment('nebula')

Step 2: Environment Lookup
  File: portalWorlds.js
  Find nebula config: { colors: ['#ffea00', '#7300ffff', '#003a2a'], ... }

Step 3: Apply to Scene
  File: environmentSetup.js
  Set background colors
  Apply post-processing effects

User adjusts environmentHue: 180

Step 4: Hue Rotation
  Rotate color wheel 180 degrees
  Nebula colors shift to complementary colors
```

**Document:**
- Write: "Environment system with predefined color palettes"
- Hue rotation: "Dynamic color shifting without changing environment"
- Data-driven: "portalWorlds.js defines all environments"

---

### Week 3: Complex Features & Full Flows

**Goal**: Understand multi-component features, save/load system, unlock progression

#### Day 11: Save Scene Flow (3 hours)
**Focus**: Complete save/load system

**Files to Study:**
- `src/components/features/SaveButton/SaveControls.jsx`
- `src/services/sceneApi.jsx`
- `src/context/SceneContext.jsx`
- `src/App.jsx` (sceneConfig object)

**Trace Exercise:**
```
User clicks "Save Scene" button

Step 1: Gather Scene Config
  File: App.jsx
  sceneConfig object: {
    metalness,
    emissiveIntensity,
    baseColor,
    // ... all 22 state values
  }

Step 2: Save Modal
  File: SaveControls.jsx
  Show modal: "Name Your Scene"
  User enters: "Cool Purple Tesseract"

Step 3: API Call
  File: sceneApi.jsx
  POST /api/scenes
  Body: {
    name: "Cool Purple Tesseract",
    description: "",
    config: { metalness: 0.5, baseColor: "#4a0e78", ... }
  }
  Headers: { Authorization: Bearer <token> }

Step 4: Backend
  Express route: POST /scenes
  Save to MongoDB
  Check unlock progression (scene count)

Step 5: Success Feedback
  Modal closes
  Alert: "Scene saved!"
  hasUnsavedChanges = false
```

**Load Scene Flow:**
```
User clicks scene in "My Scenes"

Step 1: Fetch Scene
  GET /api/scenes/:id
  Response: { config: { metalness: 0.8, baseColor: "#ff0000", ... } }

Step 2: Context Update
  File: SceneContext.jsx
  setLoadedConfig(response.config)

Step 3: Apply Config
  File: App.jsx
  useEffect watches loadedConfig
  When changed:
    setMetalness(loadedConfig.metalness)
    setBaseColor(loadedConfig.baseColor)
    // ... all 22 states updated

Step 4: Scene Reconstructs
  All components re-render with new values
  3D scene updates to match saved state
```

**Document:**
- Write: "Save/load system persists scene state to MongoDB"
- sceneConfig: "Object containing all 22 state values"
- Context pattern: "SceneContext shares loaded config across app"

---

#### Day 12: Unlock Progression System (2.5 hours)
**Focus**: Gamification and character unlocks

**Files to Study:**
- Backend: `routes/scenes.js`, `models/User.js`
- Frontend: `src/components/features/SaveButton/UnlockModal.jsx`

**Activities:**
1. Understand unlock thresholds (1 scene → Icarus, 2 → Vectra, etc.)
2. Trace unlock check logic
3. See unlock modal animation

**Trace Exercise:**
```
User saves 2nd scene → Vectra unlocks

Step 1: Save Scene
  POST /api/scenes
  Backend saves scene to DB

Step 2: Count Scenes
  Backend: User.find({ userId }).countDocuments()
  Count: 2 scenes

Step 3: Check Unlocks
  Logic:
    sceneCount >= 1 → unlock Icarus
    sceneCount >= 2 → unlock Vectra
    sceneCount >= 3 → unlock Nexus Prime
    sceneCount >= 4 → unlock animations

  New unlock: "Vectra"

Step 4: Update User
  User.updateOne({ userId }, { $addToSet: { unlockedCharacters: "Vectra" } })

Step 5: Response
  Response: { scene, newUnlock: "Vectra" }

Step 6: Frontend
  File: UnlockModal.jsx
  Receive newUnlock: "Vectra"
  Show modal: "🎉 You unlocked Vectra!"
  Play sound effect (unlock.wav)

Step 7: User Clicks Modal
  Navigate to /showcase
  User sees newly unlocked character
```

**Document:**
- Write: "Unlock system rewards scene creation with character/animation unlocks"
- Thresholds: "1, 2, 3, 4+ scenes trigger unlocks"
- Backend logic: "Counts scenes, checks thresholds, updates user doc"

---

#### Day 13: Audio Reactive System (3 hours)
**Focus**: Microphone input → geometry transformation

**Files to Study:**
- `src/features/audio/hooks/useAudioAnalyzer.js`
- `src/features/audio/hooks/useAudioReactive.js`

**Activities:**
1. Understand Web Audio API integration
2. Trace FFT (Fast Fourier Transform) analysis
3. See frequency → geometry mapping

**Trace Exercise:**
```
User enables audio reactive mode

Step 1: Microphone Access
  File: useAudioAnalyzer.js
  navigator.mediaDevices.getUserMedia({ audio: true })
  User grants permission

Step 2: Audio Context
  Create AudioContext
  Create AnalyserNode
  Connect: microphone → analyser → destination

Step 3: FFT Analysis
  Every frame (60fps):
    analyser.getByteFrequencyData(dataArray)
    Result: Array of 0-255 values representing frequencies

Step 4: Frequency Mapping
  File: useAudioReactive.js
  
  Bass (20-250 Hz) → X-axis rotation + scale pulse
  Mid (250-2000 Hz) → Y/Z-axis rotation
  
  Sensitivity thresholds:
    55% for rotation
    50% for scale (only when very loud)

Step 5: Apply to Geometry
  object.rotation.x += bassFrequency * deltaTime
  object.scale.set(1 + (loudness * 0.2))

Step 6: Color Cycling
  Every 3 full rotations:
    Cycle to next color in palette
    Mesh and hyperframe drift out of sync
```

**Document:**
- Write: "Audio reactive system maps microphone input to geometry transformations"
- FFT: "Analyzes frequency spectrum in real-time"
- Mapping: "Bass affects rotation/scale, mids affect multi-axis rotation"
- Performance: "Noise filtering prevents jitter, momentum physics for natural feel"

---

#### Day 14: Character Showcase System (2.5 hours)
**Focus**: FBX models, animations, visual effects

**Files to Study:**
- `src/components/features/ShowcaseViewer/`
- Character effect files (QuantumShockwave, GlitchBurst, RadialSquares)

**Activities:**
1. Understand FBX loading pipeline
2. Trace animation switching
3. See character-specific effects

**Trace Exercise:**
```
User selects Nexus Prime character

Step 1: Model Loading
  FBX file: /public/models/nexusPrime.fbx
  Load model + animations

Step 2: Animation System
  Default animation: "Warrior Flip"
  animationActions: Map of available animations

Step 3: Visual Effects
  File: QuantumShockwave.jsx
  Trigger times: [0.8s, 1.6s, 2.2s]
  
  At animation time = 0.8s:
    Create shockwave ring
    Expand outward
    Fade out
    Spectral color gradient

Step 4: User Changes Animation
  AnimationSwitcher: Select "Idle"
  Switch action:
    currentAction.fadeOut(0.5)
    newAction.fadeIn(0.5)
    newAction.play()

Step 5: Speed Control
  User adjusts speed: 0.5x
  All animations play at half speed
  Effects trigger at correct times
```

**Document:**
- Write: "Character showcase with FBX models, multiple animations, visual effects"
- Pipeline: "Meshy → Mixamo → Blender → React Three Fiber"
- Effects: "Timed to specific animation moments for cinematic feel"

---

### Week 4: Application & Mastery

**Goal**: Apply patterns to new features, teach concepts, prepare for interviews

#### Day 15: Add New Feature - Fog Intensity (3 hours)
**Focus**: End-to-end feature implementation

**Hands-On Project:**
Add a "Fog Intensity" slider using patterns learned.

**Step-by-Step:**
```
1. Add State to useSceneState.js:
   const [fogIntensity, setFogIntensity] = useState(0);
   Return: fogIntensity, setFogIntensity,

2. Destructure in App.jsx:
   const { ..., fogIntensity, setFogIntensity } = useSceneState();

3. Create Slider in MaterialPropertiesSection.jsx:
   <input
     type="range"
     min="0"
     max="1"
     step="0.1"
     value={fogIntensity}
     onChange={(e) => onFogIntensityChange(Number(e.target.value))}
   />

4. Pass Handler in Controls.jsx:
   <MaterialPropertiesSection
     fogIntensity={fogIntensity}
     onFogIntensityChange={onFogIntensityChange}
     ...
   />

5. Pass from App.jsx to ThreeScene:
   <ThreeScene fogIntensity={fogIntensity} ... />

6. Apply in ThreeScene.jsx:
   useEffect(() => {
     scene.fog = new THREE.Fog('#000000', 1, 50 * (1 - fogIntensity));
   }, [fogIntensity, scene]);

7. Test:
   - Move slider
   - See fog intensity change in 3D scene
   - Verify state persists
```

**What You Learned:**
- Following established patterns
- Understanding data flow viscerally
- Connecting UI → state → 3D

---

#### Day 16: Code Review & Refactoring Opportunities (2 hours)
**Focus**: Critical analysis of current code

**Activities:**
1. Search for remaining duplicate code
2. Identify components that could extract custom hooks
3. Find opportunities for shared utilities
4. Propose architectural improvements

**Review Exercise:**
```
Question: Are there more opportunities for DRY?

Search project for:
  - Duplicate validation logic
  - Repeated Three.js patterns
  - Similar event handlers
  - Copy-pasted useEffect blocks

Document findings:
  - What's duplicated?
  - Where could we consolidate?
  - What would the shared utility look like?
  - Why hasn't it been done yet? (Valid reasons or oversight?)
```

**Document:**
- Write: "Opportunities for further refactoring"
- List 3-5 potential improvements
- For each: Why it matters, How to implement, Trade-offs

---

#### Day 17: Presentation Prep - Technical Deep Dive (2.5 hours)
**Focus**: Prepare to explain architecture to technical audience

**Create:**
1. **5-minute technical presentation** on refactoring
2. **Data flow diagram** (pick one complex flow)
3. **Before/after code comparison** (show improvement)
4. **Architectural decision defense** (why custom hooks? why path aliases?)

**Practice:**
- Explain useSceneState pattern
- Walk through complete state flow
- Justify refactoring decisions
- Answer tough questions:
  - "Why not use Redux?"
  - "Why custom hooks instead of Context?"
  - "How do you test this?"
  - "What would you do differently?"

**Document:**
- Create presentation slides (simple, code-heavy)
- Write talking points for each slide
- Prepare for Q&A

---

#### Day 18: Teaching Session - Explain to Someone (2 hours)
**Focus**: Feynman Technique - teach to learn

**Activities:**
1. Find a friend/colleague/rubber duck
2. Explain 3 concepts:
   - Custom hooks pattern (useSceneState)
   - DRY principle (geometry consolidation)
   - Path aliases (import organization)

**Teaching Template:**
```
"Let me explain custom hooks..."

1. The Problem:
   "Our App.jsx had 22 useState calls scattered everywhere. It was 553 lines and hard to read."

2. The Solution:
   "We extracted all state into a custom hook called useSceneState."

3. How It Works:
   [Open files, show code]
   "The hook defines all state in one place, organized by purpose.
    Then it returns everything as a flat object.
    The component just destructures what it needs."

4. Why It's Better:
   "Now App.jsx is cleaner. State is organized logically. We could reuse the hook elsewhere if needed."

5. The Pattern:
   "Custom hooks are for extracting stateful logic. If you find yourself repeating useState blocks, extract a hook."

Now you try explaining it back to me...
```

**Outcome:**
If you can teach it clearly, you understand it deeply.

---

#### Day 19: Mock Technical Interview (2 hours)
**Focus**: Practice explaining under pressure

**Scenarios:**

**Question 1: "Walk me through how state flows in your app"**
```
Your answer:
  "Great question. Let me pick a specific example - the metalness slider."
  
  [Open files, trace step by step]
  
  "When the user moves the slider, it fires onChange in MaterialPropertiesSection.
   That calls onMetalnessChange, which is a prop passed from Controls,
   which got it from App.jsx, where it's setMetalness from the useSceneState hook.
   
   The hook updates state, App re-renders, passes new metalness to ThreeScene,
   which watches for changes and updates the Three.js material.
   
   The pattern is unidirectional: UI → event → state → re-render → 3D update."
```

**Question 2: "Why did you refactor App.jsx?"**
```
Your answer:
  "App.jsx was 553 lines with 22 useState calls. It was doing too much.
   
   I extracted state management into useSceneState for three reasons:
   1. Organization - state is grouped by purpose (material, lighting, etc.)
   2. Reusability - the hook could be used elsewhere if needed
   3. Readability - App.jsx is cleaner, easier to understand
   
   It follows the custom hooks pattern from React - extract stateful logic."
```

**Question 3: "How do you handle errors?"**
```
Your answer:
  "We use an Error Boundary component that wraps the entire app.
   
   It's a class component with componentDidCatch lifecycle method.
   When a component throws during render, the boundary catches it,
   logs the error, and shows a fallback UI instead of a blank screen.
   
   Users can click 'Try Again' to reset, or 'Go Home' to navigate away.
   
   This prevents one broken component from crashing the entire app."
```

**Document:**
- Write down weak answers
- Research better explanations
- Practice until smooth

---

#### Day 20: Build Something New (3 hours)
**Focus**: Apply all patterns independently

**Project Ideas:**
1. **Add a new control section** (e.g., "Post-Processing Effects")
2. **Create a new custom hook** (e.g., useThreeJsSetup)
3. **Add error boundary to specific feature** (e.g., wrap ThreeScene separately)
4. **Extract more duplicate code** (find and consolidate)

**Success Criteria:**
- [ ] Follow existing patterns (no new patterns unless justified)
- [ ] Use path aliases (@/ imports)
- [ ] Document why you made architectural choices
- [ ] Test thoroughly
- [ ] Explain what you built to someone

**Document:**
- Write a mini changelog (like REFACTORING_CHANGELOG.md)
- Explain decisions
- List what you learned

---

## 🎓 Study Method: Old vs New Architecture

### Studying the OLD Structure (Pre-Nov 14)

**Challenges:**
```
App.jsx (553 lines)
  ├─ 22 useState calls scattered
  ├─ Imports: ../../components/features/Controls
  ├─ Massive prop drilling
  └─ Hard to trace state relationships

Geometry files:
  ├─ 8 files with identical 80-line function
  ├─ Duplication everywhere
  └─ Inconsistencies creeping in

No error handling:
  └─ Component error = white screen of death
```

**Study approach:**
1. Untangle spaghetti code
2. Search for state declarations
3. Trace messy relative imports
4. Identify what's duplicated
5. Understand what SHOULD be refactored

---

### Studying the NEW Structure (Post-Nov 14)

**Improvements:**
```
App.jsx (cleaner)
  ├─ 1 useSceneState() hook call
  ├─ Imports: @/hooks/useSceneState
  ├─ Clean prop passing
  └─ Organized structure

Geometry files:
  ├─ 1 shared function in utils/
  ├─ 7 files import it
  └─ Single source of truth

Error handling:
  └─ ErrorBoundary catches errors gracefully
```

**Study approach:**
1. Understand clean patterns
2. Follow organized state domains
3. Navigate with clean @/ imports
4. See DRY principle in action
5. Understand WHY patterns are better

---

### Why New Structure is Better for Learning

**Old Architecture:**
- Learn what NOT to do
- Reverse-engineer bad patterns
- Focus: "How did this get messy?"

**New Architecture:**
- Learn best practices
- Follow intentional design
- Focus: "Why is this pattern good?"

**Key Insight:**
Studying well-architected code teaches you to DESIGN well.  
Studying messy code teaches you to REFACTOR.  
Both are valuable, but NEW architecture is better for learning fundamentals.

---

### You're Ready for Senior-Level Discussions

When interviewers ask:
- "How do you manage state?" → You have 3 answers (hooks, context, custom hooks) with trade-offs
- "How do you handle errors?" → You explain error boundaries with lifecycle methods
- "How do you organize code?" → You discuss DRY, separation of concerns, custom hooks
- "Walk me through a feature" → You trace complete flows across multiple files

**You're not an imposter. You're a developer who understands architecture.**

---

## 📚 Related Documentation

- [REFACTORING_CHANGELOG.md](./REFACTORING_CHANGELOG.md) - What changed
- [STUDY_GUIDE_REFACTORED.md](./STUDY_GUIDE_REFACTORED.md) - Concepts to study
- [CLAUDE_STUDY_PROMPT.md](./CLAUDE_STUDY_PROMPT.md) - AI-assisted learning
- [Original Study Plan](./study-plan-update/6_DAY_STUDY_PLAN_UPDATED.md) - Pre-refactoring approach

---

**Created**: November 14, 2025  
**Duration**: 4 weeks (flexible)  
**Philosophy**: Trace flows, build complexity incrementally, document learning  
**Goal**: Master refactored architecture through hands-on study
