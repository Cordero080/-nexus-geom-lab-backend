# Nexus-Geom 3D 🌌

## Interactive 3D Geometry Platform with Character Animation Showcase

<div align="center">

![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.180-000000?style=for-the-badge&logo=three.js)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?style=for-the-badge&logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express)

**A Multi-Dimensional 3D Art Platform** combining interactive geometry manipulation, character animation showcases, and gamified progression systems.

[� Full Documentation](./docs) | [🎮 User Guide](#user-journey) | [🏗️ Architecture](#project-architecture)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [User Journey](#user-journey)
- [Project Architecture](#project-architecture)
- [Technical Deep Dive](#technical-deep-dive)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [API Reference](#api-reference)
- [Contributing](#contributing)

---

## 🌟 Overview

**Nexus-Geom 3D** is a full-stack web application that transforms abstract mathematical concepts into interactive 3D art experiences. It's not just a 3D viewer—it's a **creative platform** where users can:

- **Create**: Manipulate complex 3D geometries with real-time controls
- **Explore**: Discover animated characters in an immersive showcase gallery
- **Progress**: Unlock new content through scene creation and saving
- **Share**: Save and manage personal scene collections

### 🎨 What Makes This Project Unique

**Technical Sophistication**

- Advanced Three.js rendering with synchronized multi-component objects
- Real-time vertex manipulation and animation systems
- Full-stack authentication with JWT and MongoDB
- Gamified progression system with unlock mechanics

**Visual Impact**

- Dynamic quantum-themed UI that responds to user interaction
- Ethereal transparent cubes with character animations
- Custom particle effects and environmental systems
- Responsive glassmorphic design patterns

**User Experience**

- Progressive disclosure through unlockable content
- Contextual save/load workflows with navigation blocking
- Real-time visual feedback for all interactions
- Seamless integration between geometry editor and showcase gallery

---

## 🎯 Key Features

### 1. 🔧 Interactive Geometry Lab

---

## 🎯 Key Features

### 1. 🔧 Interactive Geometry Lab

The heart of the application—a real-time 3D geometry editor with sophisticated controls:

**Geometric Primitives** (24 types)

- **4D Polytopes**: 120-Cell, 600-Cell, 24-Cell, 16-Cell with compound variants
- **Hyperdimensional**: Quantum Manifolds, Hessian Polychorons, Möbius Spheres
- **Tesseracts**: Multiple compound tesseract variations (Mega-Tesseract I-IV)
- **Classical**: Sphere, Cube, Octahedron, Tetrahedron, Icosahedron variants
- **Compound Geometries**: Multi-layered structures with synchronized inner/outer forms
- Each with mathematically perfect vertex positioning and unique wireframe patterns
- Support for both single and multi-object scenes

**Animation Systems** (6 algorithms)

- **Rotate**: Smooth continuous rotation
- **Float**: Gentle bobbing motion with sine wave patterns
- **Omni-Intellect**: Omni-directional oscillation with complex transforms

**Material Controls**

- **Metalness**: 0 (plastic/rubber) to 1 (chrome/metal)
- **Emissive Intensity**: Self-illumination glow (0-2)
- **Base Color**: Full hex color picker
- **Wireframe Intensity**: Blend between solid and wireframe (0-100%)
- **Hyperframe Colors**: Custom coloring for inner structures and connecting rods

**Lighting System**

- **Ambient Light**: Global illumination with color and intensity controls
- **Directional Light**: Sunlight simulation with 3D position controls (X, Y, Z)
- **Environment Hue**: Universal hue shift (0-360°) affecting backgrounds and orbs

**Camera Views** (5 modes)

- Free, Orbit, Top, Side, Cinematic

### 2. 🎭 Character Animation Showcase

A curated gallery of 3D animated characters inside rotating transparent energy cubes:

**Multi-Character System**

- **Icarus-X**: Celestial seraph with wings (Solar Ascension, Phoenix Dive animations)
- **Vectra**: Holographic spellcaster (Holographic Spellcast animation)
- **Nexus-Prime**: Cybernetic warrior (Warrior Flip animation)

**Visual Presentation**

- Characters suspended in transparent rotating cubes
- Interior point lighting creating ethereal glow effects
- Character-specific gradient backgrounds (blue tech, cyan, fire orange)
- Spectral lighting systems (cyan/magenta spotlights, directional blue lights)

**Interactive Viewer**

- Full-screen modal with orbital camera controls
- Animation switcher (appears when multiple animations unlocked for same character)
- Smooth transitions between animations
- Detailed character descriptions and lore

**Technical Pipeline**

```
Meshy.ai → Mixamo → Blender → FBXLoader → React Three Fiber
(Generate)  (Animate) (Texture)  (Load)      (Display)
```

### 3. 🔐 Authentication & User Management

Secure JWT-based authentication system:

**User Features**

- Sign up with username/email/password
- Login with session persistence
- Protected routes for authenticated content
- Automatic token refresh and validation

**Security**

- bcrypt password hashing
- JWT token-based authentication
- Protected API endpoints
- CORS configuration for frontend-backend communication

### 4. 💾 Scene Save/Load System

Complete scene configuration persistence:

**Save Features**

- Captures all 20+ control values (materials, lighting, animation, geometry)
- Contextual save button states:
  - **"Save Scene"** (fresh creation)
  - **"Transmute"** + **"Save As New"** (editing own scene)
  - **"Save Scene"** (remixing public scene)
- Unsaved changes detection with navigation blocking
- Confirmation modals before leaving unsaved work

**My Scenes Page**

- Grid gallery of user's saved scenes
- Scene cards with metadata (name, date, view count)
- Load scenes back into Geometry Lab
- Delete scenes with confirmation
- Sort options: Newest, Oldest, Most Viewed, Name

**Scene Loading**

- One-click load from My Scenes page
- Applies all saved configurations to controls
- Maintains scene state during navigation
- Smooth transition into Geometry Lab

### 5. 🎮 Progressive Unlock System

Gamified progression that unlocks content through scene creation:

**Unlock Progression**

1. **Scene 1** → Unlocks **Icarus-X** Noetech (default: Solar Ascension)
2. **Scene 2** → Unlocks **Vectra** Noetech (default: Holographic Spellcast)
3. **Scene 3** → Unlocks **Nexus-Prime** Noetech (default: Warrior Flip)
4. **Scene 4+** → Unlocks additional animations for existing characters

**Unlock Notifications**

- Cyberpunk-themed modals with glitch effects
- Distinguish between Noetech (character) and Animation unlocks
- Particle effects and visual celebration
- Auto-dismiss after viewing

**Gallery Behavior**

- Shows only unlocked Noetechs in grid view
- Locked items display overlay with lock icon
- Animation switcher appears when multiple animations unlocked
- Progress persists across sessions

### 6. 🌀 Quantum Portal Worlds Theme System

Dynamic UI theming that simulates quantum mechanics:

**5 Dimensional Realities**

- **Fractal**: Cyberpunk pink/cyan
- **Nebula**: Cosmic yellow/purple
- **Inferno**: Volcanic red/magenta
- **Emerald**: Crystalline green/blue
- **Singularity**: Stellar white/cyan

**Quantum Collapse Mechanics**

- Interface exists in "superposition" (all states simultaneously)
- User interaction (scroll/click) causes "observation"
- System "collapses" into one definite visual state
- Colors propagate through navigation, backgrounds, glyphs, and effects

**Visual Effects**

- Parallax background layers with mouse tracking
- Greek mathematical symbols (ψ, Ω, Σ, λ, Φ, Ξ)
- Smooth cubic-bezier transitions (1.2s)
- Real-time color updates across all UI elements

### 7. 🎨 Advanced Wireframe System

Complex multi-component 3D objects with synchronized movement:

**Wireframe Components**

- **Solid Mesh**: Primary visible geometry
- **Thick Wireframes**: Cylinder-based edges (not just lines)
- **Inner Structures**: Geometry-specific patterns (spirals, inner frames)
- **Connecting Rods**: Green links between inner/outer structures

**Synchronization Methods**

- **Transform-based**: Copy position/rotation for simple animations
- **Vertex-deformation**: Update wireframes based on deformed vertices
- All components move in perfect unison during animations

---

## 🚀 User Journey

### The Complete User Story

**Act 1: Discovery**

1. **Land on Home Page** with quantum-themed parallax backgrounds
2. **Click "Enter"** to begin journey
3. **Redirect to Login/Signup** if not authenticated
4. **Create Account** with username, email, password

**Act 2: Creation** 5. **Enter Geometry Lab** - see default icosahedron with rotate animation 6. **Explore Controls Panel**:

- Change object type to sphere
- Switch animation to "alien" for omni-directional movement
- Adjust metalness to 0.8 for metallic look
- Increase emissive intensity to 1.5 for glow effect
- Change base color to magenta (#ff00ff)
- Adjust wireframe intensity to 75%
- Modify hyperframe colors for inner structures
- Shift environment hue to 180° for complementary colors

7. **Experiment with Lighting**:
   - Adjust ambient light intensity
   - Move directional light position
   - Change light colors

**Act 3: First Save** 8. **Click "Save Scene"** button 9. **Enter scene name**: "Cosmic Sphere" 10. **Success notification appears** 11. **Unlock Modal triggers**: "Icarus-X Noetech Unlocked!" with particle effects 12. **Navigate to NavBar** → Click "Showcase"

**Act 4: Showcase Discovery** 13. **View Showcase Gallery**: See Icarus-X in rotating transparent cube 14. **Click Icarus-X card** to open full-screen viewer 15. **Interact with Viewer**: - Orbital camera controls (drag to rotate) - Read character lore and description - Notice: Only one animation available (no switcher yet) 16. **Close viewer** (X button or ESC key)

**Act 5: Progression** 17. **Return to Geometry Lab**: Create another scene 18. **Save Scene 2**: "Ethereal Octahedron" 19. **Unlock Modal**: "Vectra Noetech Unlocked!" 20. **Showcase Gallery Updates**: Now shows both Icarus-X and Vectra

**Act 6: Multi-Animation Unlock** 21. **Create and save Scenes 3 & 4** 22. **Scene 3 unlocks**: Nexus-Prime Noetech 23. **Scene 4 unlocks**: "Phoenix Dive" animation for Icarus-X 24. **Return to Showcase**: Icarus-X card still shows default "Solar Ascension" 25. **Click Icarus-X**: Full viewer opens 26. **Animation Switcher Appears**! Dropdown with two options: - Solar Ascension (default) - Phoenix Dive (newly unlocked) 27. **Switch Animation**: Character smoothly transitions to Phoenix Dive 28. **Experience**: Different character pose, animation loop, and visual effects

**Act 7: Scene Management** 29. **Navigate to "My Scenes"** page via NavBar 30. **View Scene Gallery**: Grid of all saved scenes 31. **Load a Scene**: - Click "Load" on "Cosmic Sphere" card - Redirected to Geometry Lab - All controls restore to saved state (metalness, colors, lighting, etc.) 32. **Contextual Save Buttons Appear**: - "Transmute" (update existing scene) - "Save As New" (create variant) 33. **Make Changes**: Adjust emissive intensity, change animation to "spiral" 34. **Click "Transmute"**: Updates existing scene 35. **Navigation Blocking**: Try to leave page - Modal appears: "Save Scene?" - Options: Save & Exit, Exit Without Saving, Cancel

**Act 8: Mastery** 36. **Create 10+ scenes** to unlock all animations 37. **Build personal collection** of varied geometries and styles 38. **Explore all combinations**: 24 geometries × 6 animations × ∞ configurations 39. **Master the controls**: 4D polytopes, hyperdimensional manifolds, compound structures, lighting, materials, hyperframes, environments

---

## 🏗️ Project Architecture

### Folder Structure Explained

```
nexus-geom-3D/
│
├── 📁 backend/                           # Express.js API Server
│   ├── 📁 config/
│   │   └── db.js                        # MongoDB connection setup
│   ├── 📁 models/
│   │   ├── User.js                      # User schema with unlockedAnimations array
│   │   └── Scene.js                     # Scene schema with config JSONB field
│   ├── 📁 routes/
│   │   ├── auth.js                      # Signup, login, profile endpoints
│   │   └── scenes.js                    # Scene CRUD + unlock progression logic
│   ├── 📁 middleware/
│   │   └── auth.js                      # JWT verification middleware
│   └── index.js                         # Server entry point with CORS & Express setup
│
├── 📁 src/                              # React Frontend
│   │
│   ├── 📁 components/                   # UI Components
│   │   ├── 📁 features/                # Feature-specific components
│   │   │   ├── 📁 Controls/            # Geometry Lab control panels
│   │   │   │   ├── Controls.jsx        # Main control panel orchestrator
│   │   │   │   ├── MaterialControls.jsx
│   │   │   │   ├── LightingControls.jsx
│   │   │   │   ├── AnimationControls.jsx
│   │   │   │   └── EnvironmentControls.jsx
│   │   │   ├── 📁 SaveButton/          # Context-aware save functionality
│   │   │   │   └── SaveControls.jsx    # Save/Transmute/Save As New logic
│   │   │   └── 📁 Showcase/            # Character animation gallery
│   │   │       ├── ShowcaseGallery.jsx # Grid of animated character cards
│   │   │       ├── ShowcaseCard.jsx    # Individual character card
│   │   │       ├── FBXModel.jsx        # FBX loader with animation mixer
│   │   │       └── data/
│   │   │           └── mockAnimations.js # Animation configuration data
│   │   │
│   │   ├── 📁 layout/                  # Layout components
│   │   │   └── 📁 NavBar/
│   │   │       └── NavBar.jsx          # Main navigation with auth state
│   │   │
│   │   ├── 📁 pages/                   # Page-level components
│   │   │   ├── 📁 HomePage/
│   │   │   │   └── HomePage.jsx        # Landing page with parallax & quantum themes
│   │   │   ├── 📁 MyScenesPage/
│   │   │   │   └── MyScenesPage.jsx    # User's saved scenes gallery
│   │   │   ├── 📁 SignUpPage/
│   │   │   │   └── SignUpPage.jsx      # User registration form
│   │   │   └── 📁 LoginPage/
│   │   │       └── LoginPage.jsx       # Authentication form
│   │   │
│   │   ├── 📁 shared/                  # Shared/reusable components
│   │   │   └── (common UI elements)
│   │   │
│   │   └── 📁 ui/                      # Generic UI components
│   │       ├── 📁 ScrambleButton/      # Animated button with text scramble
│   │       ├── 📁 Effects/             # Visual effects
│   │       │   └── QuantumCursor.jsx   # Custom cursor with particles
│   │       └── � Modals/              # Modal dialogs
│   │
│   ├── 📁 context/                      # React Context Providers
│   │   ├── AuthContext.jsx             # Authentication state management
│   │   │                                # Provides: user, token, login(), signup(), logout()
│   │   └── SceneContext.jsx            # Scene configuration state
│   │                                    # Provides: loadedConfig, loadScene(), resetScene()
│   │
│   ├── 📁 features/                     # Complex feature modules
│   │   └── 📁 sceneControls/           # Geometry Lab 3D engine
│   │       ├── ThreeScene.jsx          # Main 3D canvas component (199 lines!)
│   │       │
│   │       ├── 📁 factories/           # Object creation factories
│   │       │   ├── materialFactory.js   # Material creation (metalness, emissive)
│   │       │   ├── objectFactory.js     # Complete object assembly
│   │       │   ├── 📁 wireframeBuilders/
│   │       │   │   ├── sphereWireframe.js
│   │       │   │   ├── boxWireframe.js
│   │       │   │   ├── octahedronWireframe.js
│   │       │   │   └── commonWireframe.js
│   │       │   └── 📁 intricateWireframeBuilders/
│   │       │       ├── tetrahedronIntricate.js
│   │       │       ├── boxIntricate.js
│   │       │       ├── octahedronIntricate.js
│   │       │       └── icosahedronIntricate.js
│   │       │
│   │       ├── 📁 hooks/               # Custom React hooks for 3D logic
│   │       │   ├── useSceneInitialization.js  # Scene, camera, renderer setup
│   │       │   ├── useObjectManager.js        # Object creation/updates
│   │       │   ├── useCameraController.js     # Camera positioning
│   │       │   ├── useMaterialUpdates.js      # Material property updates
│   │       │   ├── useLightingUpdates.js      # Lighting controls
│   │       │   ├── useSceneEffects.js         # Mouse tracking, environment
│   │       │   └── useAnimationLoop.js        # Animation lifecycle
│   │       │
│   │       └── 📁 utils/               # Utility functions
│   │           ├── animationLoop.js     # Animation algorithms (rotate, float, alien, etc.)
│   │           ├── animateCamera.js     # Camera animation logic
│   │           └── geometryHelpers.js   # Geometry calculations
│   │
│   ├── 📁 services/                     # API Integration Layer
│   │   └── sceneApi.js                 # Scene CRUD operations
│   │                                    # Functions: saveScene(), getMyScenes(), loadScene(),
│   │                                    #           updateScene(), deleteScene()
│   │
│   ├── 📁 styles/                       # Global Styles & Themes
│   │   ├── shared.module.scss          # Shared component styles
│   │   ├── quantumBackground.css       # Portal Worlds theme styles
│   │   ├── quantumTitles.css           # Animated title effects
│   │   └── invertedLetters.module.scss # Special typography effects
│   │
│   ├── 📁 utils/                        # General Utilities
│   │   ├── coreHelpers.js              # Core utility functions
│   │   ├── geometryHelpers.js          # Geometry math helpers
│   │   ├── textScrambler.js            # Text scramble animation
│   │   └── threeConstants.js           # Three.js constants
│   │
│   ├── App.jsx                          # Main app router & state orchestration
│   ├── main.jsx                         # React entry point
│   └── index.css                        # Global CSS reset & base styles
│
├── 📁 public/                           # Static Assets
│   ├── 📁 models/                      # FBX animation files
│   │   ├── icarus-wings.fbx
│   │   ├── icarus-bangs.fbx
│   │   ├── vectra-hologram.fbx
│   │   └── nexus-warrior.fbx
│   ├── 📁 fonts/                       # Custom typography
│   └── 📁 soundEffects/                # (Future: audio integration)
│
└── 📁 docs/                             # Comprehensive Documentation
    ├── README.md                        # Master documentation hub
    ├── 📁 technical/                   # Technical specifications
    ├── 📁 reference/                   # API references
    └── 📁 study-plan/                  # Development roadmap
```

### Component Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         App.jsx                              │
│  - AuthProvider wraps entire app                            │
│  - SceneProvider wraps route content                        │
│  - Routes handle page navigation                            │
└────────────┬────────────────────────────────────────────────┘
             │
             ├── Route: /                      (Public)
             │   └── HomePage
             │       └── Parallax backgrounds + Quantum theme
             │
             ├── Route: /signup                (Public)
             │   └── SignUpPage
             │       └── Calls: AuthContext.signup()
             │
             ├── Route: /login                 (Public)
             │   └── LoginPage
             │       └── Calls: AuthContext.login()
             │
             ├── Route: /geom-lab              (Protected)
             │   └── GeomLab Component
             │       ├── State: 20+ control values (metalness, scale, colors...)
             │       ├── <ThreeScene /> (receives 20 props)
             │       ├── <Controls /> (receives 40 props for setters)
             │       ├── <SaveControls /> (receives sceneConfig)
             │       └── <ExitButton /> (triggers save modal)
             │
             ├── Route: /showcase              (Protected)
             │   └── ShowcaseGallery
             │       ├── Fetches: user.unlockedAnimations from AuthContext
             │       ├── Filters: mockAnimations by unlock status
             │       ├── Displays: ShowcaseCard grid
             │       └── Opens: Full-screen viewer modal
             │
             └── Route: /scenes                (Protected)
                 └── MyScenesPage
                     ├── Fetches: getMyScenes(token) from API
                     ├── Displays: Scene cards with metadata
                     ├── Actions: Load → SceneContext.loadScene()
                     │          Delete → sceneApi.deleteScene()
                     └── Navigation: Load → navigate to /geom-lab
```

### State Management Architecture

**AuthContext (Global)**

```javascript
{
  user: { id, username, email, unlockedAnimations: [] },
  token: "jwt-token-string",
  isAuthenticated: boolean,
  isLoading: boolean,

  // Methods
  login(credentials),
  signup(userData),
  logout(),
  refreshUser()  // Re-fetch user data after unlock
}
```

**SceneContext (Global)**

```javascript
{
  loadedConfig: { ...20+ scene properties } | null,
  currentSceneId: string | null,

  // Methods
  loadScene(config, sceneId),  // Loads scene into Geometry Lab
  resetScene()                  // Clears loaded config
}
```

**GeomLab Component (Local)**

```javascript
{
  // 20+ local state values for all controls
  metalness, emissiveIntensity, baseColor, wireframeIntensity,
  hyperframeColor, hyperframeLineColor, cameraView, environment,
  environmentHue, objectCount, animationStyle, objectType,
  ambientLightColor, ambientLightIntensity, directionalLightColor,
  directionalLightIntensity, directionalLightX/Y/Z, scale,

  // Save flow state
  hasUnsavedChanges: boolean,
  showSavePrompt: boolean,
  nextPath: string | null,
  allowNavigation: boolean
}
```

### API Communication Flow

```
┌──────────────────┐          HTTP Request           ┌──────────────────┐
│                  │     (with JWT in header)        │                  │
│  React Frontend  │─────────────────────────────────▶│  Express Backend │
│  (Port: 5173)    │                                  │  (Port: 3000)    │
│                  │◀─────────────────────────────────│                  │
└──────────────────┘          JSON Response           └──────────────────┘
                                                                │
                                                                ├─▶ MongoDB
                                                                │   - users
                                                                │   - scenes
                                                                │
                                                                └─▶ Unlock Logic
                                                                    checkAndUnlock()
```

**Example: Save Scene Flow**

1. User clicks "Save Scene" in Geometry Lab
2. SaveControls.jsx captures `sceneConfig` (20+ values)
3. Calls `saveScene(sceneData, token)` from sceneApi.js
4. API makes POST request to `http://localhost:3000/api/scenes`
5. Backend authenticates JWT token (middleware)
6. Backend saves scene to MongoDB
7. Backend checks unlock progression: `checkAndUnlockAnimations(user, sceneNumber)`
8. Backend returns: `{ scene, newlyUnlocked: [{animationId, noetechKey}] }`
9. Frontend updates AuthContext with new unlocks
10. Frontend shows unlock notification modal
11. User navigates to Showcase to see unlocked content

---

## � Technical Deep Dive

## 🔧 Technical Deep Dive

### 1. Synchronized Multi-Component 3D Objects

Each geometry in the Geometry Lab consists of **four synchronized components** that must move together in perfect unison:

```javascript
const sceneObject = {
  // 1. Solid Mesh - Primary visible geometry
  solidMesh: THREE.Mesh(geometry, physicalMaterial),

  // 2. Thick Wireframe - Cylinder-based edges (not just lines!)
  wireframeMesh: THREE.Group([...cylinderMeshes]),

  // 3. Inner Structures - Geometry-specific patterns
  centerLines: THREE.LineSegments(spiralGeometry, lineMaterial),

  // 4. Connecting Rods - Links between inner/outer structures
  curvedLines: [THREE.Mesh(tubeGeometry, rodMaterial), ...]
};
```

**Animation Synchronization Methods:**

**A. Transform-Based Animations** (Rotate, Float, Spiral, Alien)

```javascript
// All components follow the mesh's transform
animationStyles.alien(objects, time);

// Implementation
objects.forEach((obj) => {
  // Update main mesh position/rotation
  obj.solidMesh.rotation.x = Math.sin(time * 0.5) * 0.3;
  obj.solidMesh.position.y = Math.cos(time * 0.8) * 1.5;

  // Wireframe and structures copy transform
  obj.wireframeMesh.position.copy(obj.solidMesh.position);
  obj.wireframeMesh.rotation.copy(obj.solidMesh.rotation);
});
```

**B. Vertex-Deformation Animations** (Magnetic)

```javascript
// Wireframes must update based on deformed vertices
const positions = geometry.attributes.position.array;
for (let i = 0; i < positions.length; i += 3) {
  // Apply magnetic force to each vertex
  positions[i] += forceX;
  positions[i + 1] += forceY;
  positions[i + 2] += forceZ;
}
geometry.attributes.position.needsUpdate = true;

// Update wireframe cylinders to match new vertex positions
updateWireframeCylinders(wireframeMesh, geometry);
```

### 2. Advanced Wireframe Architecture

Traditional Three.js wireframes are thin lines. This project uses **thick cylinder-based wireframes** for dramatic visual impact:

**Factory Pattern Implementation:**

```javascript
// factories/wireframeBuilders/sphereWireframe.js
export function createSphereWireframe(
  radius,
  color,
  widthSegments,
  heightSegments
) {
  const group = new THREE.Group();

  // Create cylinder for each edge
  for (let lat = 0; lat < heightSegments; lat++) {
    for (let lon = 0; lon < widthSegments; lon++) {
      const start = getVertexPosition(lat, lon);
      const end = getVertexPosition(lat, lon + 1);

      const cylinder = createEdgeCylinder(start, end, 0.02, color);
      group.add(cylinder);
    }
  }

  return group;
}
```

**Hyperframe (Inner Structures):**

```javascript
// factories/intricateWireframeBuilders/icosahedronIntricate.js
export function createIcosahedronIntricate(scale, color, lineColor) {
  // Inner scaled-down icosahedron
  const innerGeometry = new THREE.IcosahedronGeometry(scale * 0.6);
  const centerLines = new THREE.LineSegments(
    new THREE.EdgesGeometry(innerGeometry),
    new THREE.LineBasicMaterial({ color })
  );

  // 12 connecting rods from inner to outer vertices
  const curvedLines = [];
  for (let i = 0; i < 12; i++) {
    const curve = new THREE.LineCurve3(innerVertex[i], outerVertex[i]);
    const tube = new THREE.TubeGeometry(curve, 8, 0.015, 8);
    curvedLines.push(
      new THREE.Mesh(tube, new THREE.MeshBasicMaterial({ color: lineColor }))
    );
  }

  return { centerLines, curvedLines };
}
```

### 3. Custom Hooks Architecture (React + Three.js)

The `ThreeScene.jsx` component was refactored from **2,700 lines to 199 lines** (93% reduction) using custom hooks:

```javascript
// ThreeScene.jsx - Clean composition
function ThreeScene(props) {
  // Hook 1: Initialize scene, camera, renderer, lights
  const { sceneRef, cameraRef, rendererRef } = useSceneInitialization();

  // Hook 2: Create and update 3D objects
  const { objects, materialsRef } = useObjectManager(
    sceneRef,
    props.objectType,
    props.objectCount,
    props.scale
  );

  // Hook 3: Control camera position
  useCameraController(cameraRef, props.cameraView);

  // Hook 4: Update material properties
  useMaterialUpdates(objects, materialsRef, {
    metalness: props.metalness,
    emissiveIntensity: props.emissiveIntensity,
    baseColor: props.baseColor,
    wireframeIntensity: props.wireframeIntensity,
    hyperframeColor: props.hyperframeColor,
    hyperframeLineColor: props.hyperframeLineColor,
  });

  // Hook 5: Update lighting
  useLightingUpdates(sceneRef, {
    ambientColor: props.ambientLightColor,
    ambientIntensity: props.ambientLightIntensity,
    directionalColor: props.directionalLightColor,
    directionalIntensity: props.directionalLightIntensity,
    directionalPosition: [
      props.directionalLightX,
      props.directionalLightY,
      props.directionalLightZ,
    ],
  });

  // Hook 6: Handle environment effects
  useSceneEffects(sceneRef, props.environment, props.environmentHue);

  // Hook 7: Run animation loop
  useAnimationLoop(
    sceneRef,
    cameraRef,
    rendererRef,
    objects,
    props.animationStyle
  );

  return <canvas id="three-canvas" />;
}
```

**Benefits:**

- **Testability**: Each hook can be unit tested independently
- **Reusability**: Hooks can be used in other Three.js projects
- **Maintainability**: Changes to one system don't affect others
- **Readability**: Main component is now a simple orchestration layer

### 4. FBX Animation Pipeline with Root Motion Fix

**Problem**: Mixamo animations often include root motion (position keyframes), causing characters to drift from their intended position.

**Solution**: Strip position tracks before playing animation.

```javascript
// Showcase/models/FBXModel.jsx
useEffect(() => {
  const loader = new FBXLoader();

  loader.load(fbxUrl, (fbx) => {
    // Scale and position model
    fbx.scale.setScalar(galleryScale);
    fbx.position.y = positionY;
    fbx.position.x = offsetX;
    fbx.position.z = offsetZ;
    fbx.rotation.y = (rotationY * Math.PI) / 180;

    // Setup animation mixer
    if (fbx.animations && fbx.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(fbx);
      mixerRef.current = mixer;

      // Clone animation and remove position tracks
      const clip = fbx.animations[0].clone();
      clip.tracks = clip.tracks.filter(
        (track) => !track.name.includes(".position") // Keep rotation/scale, remove position
      );

      // Play modified animation
      const action = mixer.clipAction(clip);
      action.play();
    }

    modelRef.current.add(fbx);
  });
}, [fbxUrl]);

// Update animation in render loop
useFrame((state, delta) => {
  if (mixerRef.current) {
    mixerRef.current.update(delta);
  }
});
```

**Result**: Character maintains consistent positioning throughout all animation loops while keeping all bone animations intact.

### 5. Progressive Unlock System with Backend Integration

**Backend Unlock Logic:**

```javascript
// backend/routes/scenes.js
router.post("/scenes", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Save scene to database
    const scene = await Scene.create({
      userId,
      name: req.body.name,
      config: req.body.config,
      isPublic: req.body.isPublic || false,
    });

    // Count user's total scenes
    const sceneCount = await Scene.countDocuments({ userId });

    // Check unlock progression
    const newlyUnlocked = checkAndUnlockAnimations(req.user, sceneCount);

    // Save updated user with unlocks
    if (newlyUnlocked.length > 0) {
      await req.user.save();
    }

    res.json({
      success: true,
      scene,
      newlyUnlocked, // Frontend uses this to show unlock modal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function
function checkAndUnlockAnimations(user, sceneNumber) {
  const UNLOCK_PROGRESSION = [
    {
      sceneNumber: 1,
      type: "noetech",
      noetechKey: "icarus-x",
      animationId: "solar-ascension",
    },
    {
      sceneNumber: 2,
      type: "noetech",
      noetechKey: "vectra",
      animationId: "holographic-spellcast",
    },
    {
      sceneNumber: 3,
      type: "noetech",
      noetechKey: "nexus",
      animationId: "warrior-flip",
    },
    {
      sceneNumber: 4,
      type: "animation",
      noetechKey: "icarus-x",
      animationId: "phoenix-dive",
    },
  ];

  const unlockConfig = UNLOCK_PROGRESSION.find(
    (u) => u.sceneNumber === sceneNumber
  );

  if (unlockConfig && !user.hasUnlockedAnimation(unlockConfig.animationId)) {
    user.unlockedAnimations.push({
      animationId: unlockConfig.animationId,
      noetechKey: unlockConfig.noetechKey,
      unlockType: unlockConfig.type,
      unlockedAt: new Date(),
    });
    return [unlockConfig];
  }

  return [];
}
```

**Frontend Integration:**

```javascript
// services/sceneApi.js
export async function saveScene(sceneData, token) {
  const response = await fetch(`${API_URL}/scenes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sceneData),
  });

  const result = await response.json();

  // Show unlock notification if new content unlocked
  if (result.newlyUnlocked && result.newlyUnlocked.length > 0) {
    showUnlockNotification(result.newlyUnlocked[0]);
  }

  // Update AuthContext with new user data
  await refreshUserData();

  return result;
}
```

### 6. Contextual Save Button System

**Three Button States Based on Scene Context:**

```javascript
// SaveControls.jsx
function SaveControls({ sceneConfig }) {
  const { currentSceneId, loadedConfig } = useScene();
  const { token, isAuthenticated } = useAuth();

  // Determine which buttons to show
  const isEditingOwnScene = currentSceneId && loadedConfig;
  const isFreshCreation = !currentSceneId && !loadedConfig;

  if (isFreshCreation) {
    return <button onClick={handleSaveNew}>Save Scene</button>;
  }

  if (isEditingOwnScene) {
    return (
      <>
        <button onClick={handleTransmute}>Transmute</button>
        <button onClick={handleSaveAsNew}>Save As New</button>
      </>
    );
  }

  return null;
}

// Handle transmute (update existing)
const handleTransmute = async () => {
  await updateScene(currentSceneId, sceneConfig, token);
  alert("Scene transmuted successfully!");
};

// Handle save as new (create variant)
const handleSaveAsNew = async () => {
  const name = prompt("Name for new scene:");
  await saveScene({ name, config: sceneConfig }, token);
};
```

### 7. Navigation Blocking with Unsaved Changes

**Prevent accidental data loss:**

```javascript
// App.jsx - GeomLab component
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
const [showSavePrompt, setShowSavePrompt] = useState(false);
const [allowNavigation, setAllowNavigation] = useState(false);

// Mark as unsaved when any control changes
useEffect(() => {
  setHasUnsavedChanges(true);
}, [metalness, emissiveIntensity, baseColor /* ...all 20 controls */]);

// Intercept link clicks
useEffect(() => {
  const handleClick = (e) => {
    if (!hasUnsavedChanges || allowNavigation) return;

    const link = e.target.closest("a");
    if (link && link.href) {
      const targetPath = new URL(link.href).pathname;

      if (targetPath !== location.pathname) {
        e.preventDefault();
        e.stopPropagation();
        setNextPath(targetPath);
        setShowSavePrompt(true);
      }
    }
  };

  document.addEventListener("click", handleClick, true); // Capture phase!
  return () => document.removeEventListener("click", handleClick, true);
}, [hasUnsavedChanges, allowNavigation]);

// Prevent browser navigation (close/refresh)
useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (hasUnsavedChanges && !allowNavigation) {
      e.preventDefault();
      e.returnValue = ""; // Chrome requires this
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [hasUnsavedChanges, allowNavigation]);
```

### 8. Quantum Portal Worlds Theme System

**Dynamic UI that responds to user interaction:**

```javascript
// Quantum state collapse on scroll/click
const [portalState, setPortalState] = useState(() =>
  quantumCollapse(portalWorlds)
);

useEffect(() => {
  const handleQuantumCollapse = () => {
    const newPortalState = quantumCollapse(portalWorlds);
    const newGlyphState = quantumCollapse(glyphSets);

    setPortalState(newPortalState);
    setGlyphState(newGlyphState);
  };

  window.addEventListener("scroll", handleQuantumCollapse);
  window.addEventListener("click", handleQuantumCollapse);

  return () => {
    window.removeEventListener("scroll", handleQuantumCollapse);
    window.removeEventListener("click", handleQuantumCollapse);
  };
}, []);

// Apply colors to UI elements
  style={{
    background: `linear-gradient(90deg,
    rgba(0,0,0,0.82) 80%,
    ${portalState.colors[1]}22 100%)`,
  }}
>
  <Logo
    style={{
      filter: `drop-shadow(0 0 4px ${portalState.colors[1]}66)`,
    }}
  />
  <QuantumGlyph
    style={{
      color: `${portalState.colors[2]}99`,
    }}
  >
    {glyphState}
  </QuantumGlyph>
</nav>;
```

**Portal Worlds Configuration:**

```javascript
const portalWorlds = [
  {
    name: "Fractal",
    colors: ["#ff00cc", "#00fff7", "#1a003a"], // Pink, cyan, dark purple
    energy: "chaotic",
  },
  {
    name: "Nebula",
    colors: ["#ffea00", "#7300ff", "#003a2a"], // Yellow, purple, dark teal
    energy: "cosmic",
  },
  {
    name: "Inferno",
    colors: ["#ff3300", "#cc00ff", "#0a0f1a"], // Red, magenta, dark blue
    energy: "volatile",
  },
  // ... 2 more dimensions
];
```

### FBX Animation Pipeline with Root Motion Handling

```javascript
// Strip position tracks to prevent animation drift
const clip = fbx.animations[0].clone();
clip.tracks = clip.tracks.filter((track) => !track.name.includes(".position"));
const action = mixer.clipAction(clip);
action.play();
```

### Progressive Animation Unlock System

```javascript
// Backend unlock checking with scene progression
const checkAndUnlockAnimations = (user, sceneNumber) => {
  const unlockConfig = UNLOCK_PROGRESSION.find(
    (u) => u.sceneNumber === sceneNumber
  );
  if (unlockConfig && !user.hasUnlockedAnimation(unlockConfig.animationId)) {
    user.unlockedAnimations.push({
      animationId: unlockConfig.animationId,
      noetechKey: unlockConfig.noetechKey,
      unlockedAt: new Date(),
    });
    return [unlockConfig];
  }
  return [];
};
```

### Real-time Material System

```javascript
// Modern PBR material properties
materialConfig = {
  metalness: 0.8, // 0 = dielectric, 1 = metallic
  emissiveIntensity: 1.2, // Glow effect intensity
  wireframeIntensity: 75, // Wireframe opacity blend
  hyperframeColor: "#00ffff", // Inner structure color
  environmentHue: 180, // Universal hue shift 0-360°
};
```

---

## 🎯 User Experience Flow

1. **Enter Geometry Lab** → Interactive 3D shape manipulation
2. **Save First Scene** → Unlocks Icarus-X Noetech with "Solar Ascension" animation
3. **Visit Showcase** → Browse unlocked character in gallery
4. **Save Second Scene** → Unlocks Vectra Noetech with "Holographic Spellcast" animation
5. **Save Third Scene** → Unlocks Nexus-Prime Noetech with "Warrior Flip" animation
6. **Save Fourth Scene** → Unlocks "Phoenix Dive" animation for Icarus-X → **Switcher appears!**
7. **Toggle Animations** → Switch between "Solar Ascension" and "Phoenix Dive" in full viewer
8. **Continue Progress** → Unlock more animations as you save additional scenes

---

## 📦 Installation

### Prerequisites

- **Node.js** 18+
- **MongoDB** 5.0+ (or MongoDB Atlas account)
- **Git**

### Quick Start (Development)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/nexus-geom-3D.git
cd nexus-geom-3D

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd backend
npm install

# 4. Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 5. Start MongoDB (if running locally)
mongod

# 6. Start backend server (from backend directory)
npm run dev
# Server runs on http://localhost:3000

# 7. Start frontend (from root directory)
cd ..
npm run dev
# App runs on http://localhost:5173
```

### Environment Configuration

**Frontend `.env`:**

```env
VITE_API_URL=http://localhost:3000/api
```

**Backend `.env`:**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/nexus-geom
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexus-geom

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Server
PORT=3000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:5173
```

### Production Deployment

**Frontend (Vercel):**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL production
# Enter: https://your-backend.railway.app/api
```

**Backend (Railway/Render):**

```bash
# Render: Connect GitHub repo, set environment variables
# Railway: railway up, configure environment variables

# Environment variables to set:
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<secure-random-string>
CLIENT_URL=<your-frontend-url>
NODE_ENV=production
```

---

## 📚 Usage Guide

### For First-Time Users

#### 1. **Create Your Account**

```
1. Navigate to Sign Up page
2. Enter username (3-30 characters)
3. Enter email address
4. Create password (minimum 6 characters)
5. Click "Sign Up"
```

#### 2. **Enter the Geometry Lab**

```
1. After login, click "Geom Lab" in navigation
2. You'll see a default icosahedron with rotate animation
3. The control panel is on the right side
```

#### 3. **Experiment with Controls**

**Material Section:**

- **Scale**: Drag slider to resize object (0.1 - 3.0)
- **Metalness**: Adjust how metallic the surface appears (0 - 1)
- **Emissive Intensity**: Control self-illumination glow (0 - 2)
- **Base Color**: Click color picker to change object color
- **Wireframe Intensity**: Blend between solid and wireframe (0 - 100%)

**Hyperframe Section:**

- **Hyperframe Color**: Color of inner geometric structures
- **Hyperframe Line Color**: Color of connecting rods

**Scene Section:**

- **Object Type**: Choose from 6 geometries (dropdown)
- **Animation Style**: Select from 6 animation algorithms
- **Environment**: Change background theme
- **Environment Hue**: Shift all colors (0-360°)
- **Camera View**: Switch perspective (Free, Orbit, Top, Side, Cinematic)

**Lighting Section:**

- **Ambient Light**: Global illumination color and intensity
- **Directional Light**: Sunlight simulation with position controls (X, Y, Z)

#### 4. **Save Your First Scene**

```
1. Click "Save Scene" button (top-left)
2. Enter a name (required)
3. Add description (optional)
4. Click "Save"
5. Success modal appears
6. Unlock notification: "Icarus-X Noetech Unlocked!"
```

#### 5. **Explore the Showcase**

```
1. Click "Showcase" in navigation
2. View unlocked character: Icarus-X in rotating cube
3. Click card to open full-screen viewer
4. Use mouse to orbit camera around character
5. Press ESC or click X to close
```

#### 6. **Manage Your Scenes**

```
1. Click "My Scenes" in navigation
2. View all saved scenes in grid layout
3. Click "Load" to edit a scene
4. Click "Delete" to remove (with confirmation)
5. Sort by: Newest, Oldest, Most Viewed, Name
```

### For Developers

#### Running Tests

```bash
# Frontend tests
npm test

# Backend tests (if implemented)
cd backend
npm test
```

#### Code Structure

```javascript
// Example: Adding a new animation algorithm

// 1. Add to animationLoop.js
export const animationStyles = {
  // ...existing animations
  pulse: (objects, time) => {
    objects.forEach((obj) => {
      const scale = 1 + Math.sin(time * 2) * 0.2;
      obj.solidMesh.scale.set(scale, scale, scale);
      obj.wireframeMesh.scale.copy(obj.solidMesh.scale);
    });
  },
};

// 2. Update Controls.jsx dropdown
<option value="pulse">Pulse</option>;

// 3. Update validation in backend/routes/scenes.js
body("config.animationStyle")
  .optional()
  .isIn(["rotate", "float", "spiral", "chaos", "alien", "magnetic", "pulse"]);
```

#### Adding New Geometry

```javascript
// 1. Create wireframe builder
// factories/wireframeBuilders/myShapeWireframe.js
export function createMyShapeWireframe(scale, color) {
  // Implementation
}

// 2. Add to objectFactory.js
case 'myshape':
  wireframeMesh = createMyShapeWireframe(scale, wireframeColor);
  break;

// 3. Update Controls.jsx
<option value="myshape">My Shape</option>
```

### Common Workflows

#### Workflow 1: Create and Share a Scene

```
1. Geom Lab → Adjust controls → Create unique composition
2. Click "Save Scene" → Name it → Save
3. Navigate to "My Scenes"
4. Verify scene appears in gallery
5. (Future: Click "Share" to get public link)
```

#### Workflow 2: Remix an Existing Scene

```
1. My Scenes → Click "Load" on any scene
2. Geom Lab opens with all settings restored
3. Modify any controls (colors, animation, lighting)
4. Click "Save As New" → Enter new name → Save
5. Original scene remains unchanged
6. New variant appears in gallery
```

#### Workflow 3: Update an Existing Scene (Transmute)

```
1. My Scenes → Click "Load" on scene to edit
2. Make changes in Geom Lab
3. Click "Transmute" button (replaces "Save Scene")
4. Existing scene updates with new configuration
5. Timestamp updates to current time
```

#### Workflow 4: Progressive Unlock Journey

```
Scene 1: Save → Unlock Icarus-X (Solar Ascension)
Scene 2: Save → Unlock Vectra (Holographic Spellcast)
Scene 3: Save → Unlock Nexus-Prime (Warrior Flip)
Scene 4: Save → Unlock Phoenix Dive for Icarus-X
         → Animation switcher appears in Icarus-X viewer!
Scene 5+: Continue unlocking more animations
```

### Keyboard Shortcuts (Geom Lab)

| Key      | Action                         |
| -------- | ------------------------------ |
| `S`      | Open Save modal                |
| `Esc`    | Close modal / Cancel           |
| `E`      | Open Exit confirmation         |
| `Ctrl+Z` | (Future: Undo last change)     |
| `Ctrl+Y` | (Future: Redo last change)     |
| `Space`  | (Future: Pause/Play animation) |

### Troubleshooting

**Issue: "Cannot connect to server"**

```
Solution:
1. Check backend is running on port 3000
2. Verify VITE_API_URL in frontend .env
3. Check CORS settings in backend
4. Verify MongoDB is running
```

**Issue: "Scenes not loading"**

```
Solution:
1. Check JWT token in localStorage (DevTools → Application)
2. Verify token hasn't expired
3. Check network tab for API errors
4. Ensure user is authenticated
```

**Issue: "3D scene not rendering"**

```
Solution:
1. Check browser supports WebGL (chrome://gpu)
2. Update graphics drivers
3. Try different browser
4. Check console for Three.js errors
```

**Issue: "Unlock notification not appearing"**

```
Solution:
1. Check backend unlock logic in scenes.js
2. Verify user.unlockedAnimations array updates
3. Check frontend refreshUser() call after save
4. Inspect network response for newlyUnlocked property
```

---

## 🔌 API Reference

- MongoDB 5.0+
- Git

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/nexus-geom-3D.git
cd nexus-geom-3D

# Install dependencies
npm install

# Start development server
npm run dev

# Application runs on http://localhost:5173
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/nexus-geom
JWT_SECRET=your-super-secret-key
PORT=3000

# Start backend server
npm run dev

# API runs on http://localhost:3000
```

### Environment Variables

```env
# Frontend (.env)
VITE_API_URL=http://localhost:3000/api

# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/nexus-geom
JWT_SECRET=your-jwt-secret-key-here
CLIENT_URL=http://localhost:5173
PORT=3000
```

---

## 🏗️ Project Structure

```
nexus-geom-3D/
├── backend/                          # Express.js API server
│   ├── config/db.js                 # MongoDB connection
│   ├── models/                       # Mongoose schemas
│   │   ├── User.js                  # User authentication & animation progress
│   │   └── Scene.js                 # Scene configuration storage
│   ├── routes/                       # API endpoints
│   │   ├── auth.js                  # Authentication routes
│   │   └── scenes.js                # Scene CRUD + unlock logic
│   ├── middleware/auth.js            # JWT authentication middleware
│   └── index.js                     # Server entry point
│
├── src/                             # React frontend
│   ├── components/                  # Reusable UI components
│   │   ├── Controls/               # 3D scene control panels
│   │   ├── Effects/                # Particle systems & visual effects
│   │   ├── HUD/                    # Heads-up display elements
│   │   ├── Modals/                 # Modal dialogs & overlays
│   │   └── Scenes/                 # 3D scene rendering components
│   │
│   ├── context/                     # React Context providers
│   │   ├── AuthContext.jsx         # Authentication state management
│   │   └── SceneContext.jsx        # Scene configuration state
│   │
│   ├── features/                    # Complex feature modules
│   │   └── sceneControls/          # 3D geometry manipulation
│   │       ├── factories/          # Object creation factories
│   │       ├── hooks/              # Custom React hooks
│   │       └── utils/              # Animation & geometry utilities
│   │
│   ├── Showcase/                    # Character animation system
│   │   ├── components/             # Gallery & viewer components
│   │   ├── data/mockAnimations.js  # Animation configuration
│   │   └── models/FBXModel.jsx     # FBX model loader & animator
│   │
│   ├── services/                    # API integration
│   │   └── sceneApi.js             # Scene CRUD operations
│   │
│   └── styles/                      # Global styling & themes
│       └── shared.module.scss      # Shared UI components
│
├── public/                          # Static assets
│   ├── models/                     # FBX animation files
│   └── fonts/                      # Custom typography
│
└── docs/                           # Comprehensive documentation
    ├── technical/                  # Technical specifications
    ├── reference/                  # API reference guides
    └── study-plan/                 # Development roadmap
```

---

## 🔌 API Reference

### Base URL

```
Development: http://localhost:3000/api
Production: https://your-backend.railway.app/api
```

### Authentication Endpoints

#### POST `/auth/signup`

Create a new user account.

**Request Body:**

```json
{
  "username": "string (3-30 chars, required)",
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "artcreator",
    "email": "art@example.com",
    "scenesSaved": 0,
    "unlockedAnimations": []
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Username already exists"
}
```

---

#### POST `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "artcreator",
    "email": "art@example.com",
    "scenesSaved": 5,
    "unlockedAnimations": [
      {
        "animationId": "solar-ascension",
        "noetechKey": "icarus-x",
        "unlockType": "noetech",
        "unlockedAt": "2025-11-01T10:30:00.000Z"
      }
    ]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

#### GET `/auth/me`

Get current authenticated user profile.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "artcreator",
    "email": "art@example.com",
    "scenesSaved": 5,
    "unlockedAnimations": [...],
    "createdAt": "2025-10-25T08:00:00.000Z"
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

---

### Scene Management Endpoints

#### POST `/scenes`

Create a new scene (triggers unlock progression check).

**Headers:**

```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "string (max 100 chars, required)",
  "description": "string (max 500 chars, optional)",
  "config": {
    "scale": "number (0.1-3, default: 1)",
    "metalness": "number (0-1, default: 0.5)",
    "emissiveIntensity": "number (0-2, default: 0)",
    "baseColor": "string (hex color, default: '#ff00ff')",
    "wireframeIntensity": "number (0-100, default: 50)",
    "hyperframeColor": "string (hex color, default: '#ff4500')",
    "hyperframeLineColor": "string (hex color, default: '#00ff00')",
    "cameraView": "string (free|orbit|top|side|cinematic, default: 'free')",
    "environment": "string (nebula|matrix|space|sunset, default: 'nebula')",
    "environmentHue": "number (0-360, default: 0)",
    "objectCount": "number (1-10, default: 1)",
    "animationStyle": "string (rotate|float|spiral|chaos|alien|magnetic, default: 'rotate')",
    "objectType": "string (quantummanifold|compoundquantummanifold|icosahedron|sphere|compoundsphere|compoundfloatingcity|hessianpolychoron|mobiussphere|cube|box|cpdtesseract|cpd-megatesseract|cpd-megatesseract-2|cpd-megatesseract-3|cpd-megatesseract-4|octahedron|tetrahedron|120cell|compound120cell|600cell|compound600cell|24cell|compound24cell|16cell, default: 'icosahedron')",
    "ambientLightColor": "string (hex color, default: '#ffffff')",
    "ambientLightIntensity": "number (0-2, default: 0.5)",
    "directionalLightColor": "string (hex color, default: '#ffffff')",
    "directionalLightIntensity": "number (0-5, default: 1.0)",
    "directionalLightX": "number (default: 10)",
    "directionalLightY": "number (default: 10)",
    "directionalLightZ": "number (default: 5)"
  }
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Scene created successfully",
  "scene": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Cosmic Sphere",
    "description": "My first creation",
    "userId": "507f1f77bcf86cd799439011",
    "config": { ...all config properties },
    "createdAt": "2025-11-02T14:20:00.000Z",
    "updatedAt": "2025-11-02T14:20:00.000Z"
  },
  "newlyUnlocked": [
    {
      "type": "noetech",
      "noetechKey": "icarus-x",
      "animationId": "solar-ascension",
      "sceneNumber": 1
    }
  ]
}
```

**Error Response (400):**

```json
{
  "success": false,
  "errors": [
    {
      "field": "name",
      "message": "Name is required and must be under 100 characters"
    }
  ]
}
```

---

#### GET `/scenes/my-scenes`

Get all scenes created by authenticated user.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**

```
?sort=newest|oldest|name (optional, default: newest)
?limit=number (optional, default: 50)
?page=number (optional, default: 1)
```

**Success Response (200):**

```json
{
  "success": true,
  "count": 5,
  "scenes": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Cosmic Sphere",
      "description": "My first creation",
      "config": { ...scene config },
      "createdAt": "2025-11-02T14:20:00.000Z",
      "updatedAt": "2025-11-02T14:20:00.000Z"
    },
    ...more scenes
  ]
}
```

---

#### GET `/scenes/:id`

Get a specific scene by ID.

**Headers:**

```
Authorization: Bearer <jwt-token> (required if private scene)
```

**Success Response (200):**

```json
{
  "success": true,
  "scene": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Cosmic Sphere",
    "description": "My first creation",
    "userId": "507f1f77bcf86cd799439011",
    "config": { ...complete scene config },
    "createdAt": "2025-11-02T14:20:00.000Z",
    "updatedAt": "2025-11-02T14:20:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Scene not found"
}
```

---

#### PUT `/scenes/:id`

Update an existing scene (owner only).

**Headers:**

```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "config": {
    ...any config properties to update
  }
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Scene updated successfully",
  "scene": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Updated Scene Name",
    "config": { ...updated config },
    "updatedAt": "2025-11-02T16:45:00.000Z"
  }
}
```

**Error Response (403):**

```json
{
  "success": false,
  "message": "Not authorized to update this scene"
}
```

---

#### DELETE `/scenes/:id`

Delete a scene (owner only).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Scene deleted successfully"
}
```

**Error Response (403):**

```json
{
  "success": false,
  "message": "Not authorized to delete this scene"
}
```

---

### Scene Configuration Object

Complete reference for the `config` object structure:

```javascript
{
  // MATERIAL PROPERTIES
  scale: Number,                    // Object size multiplier (0.1 - 3.0)
  metalness: Number,                // Material metalness (0 = plastic, 1 = metal)
  emissiveIntensity: Number,        // Self-illumination glow (0 - 2)
  baseColor: String,                // Hex color code (e.g., "#ff00ff")
  wireframeIntensity: Number,       // Wireframe visibility (0 - 100)

  // HYPERFRAME PROPERTIES
  hyperframeColor: String,          // Inner structure color (hex)
  hyperframeLineColor: String,      // Connecting rod color (hex)

  // SCENE PROPERTIES
  cameraView: String,               // "free" | "orbit" | "top" | "side" | "cinematic"
  environment: String,              // "nebula" | "matrix" | "space" | "sunset"
  environmentHue: Number,           // Hue rotation (0 - 360 degrees)
  objectCount: Number,              // Number of objects (1 - 10)
  animationStyle: String,           // "rotate" | "float" | "spiral" | "chaos" | "alien" | "magnetic"
  objectType: String,               // 24 types: quantum manifolds, 4D polytopes, compound tesseracts, classical shapes

  // LIGHTING PROPERTIES
  ambientLightColor: String,        // Global light color (hex)
  ambientLightIntensity: Number,    // Global light intensity (0 - 2)
  directionalLightColor: String,    // Sun light color (hex)
  directionalLightIntensity: Number, // Sun light intensity (0 - 5)
  directionalLightX: Number,        // Light X position
  directionalLightY: Number,        // Light Y position
  directionalLightZ: Number         // Light Z position
}
```

---

### Error Codes

| Code | Meaning               | Common Causes                    |
| ---- | --------------------- | -------------------------------- |
| 400  | Bad Request           | Invalid input, validation errors |
| 401  | Unauthorized          | Missing/invalid JWT token        |
| 403  | Forbidden             | Not owner of resource            |
| 404  | Not Found             | Scene/user doesn't exist         |
| 409  | Conflict              | Username/email already exists    |
| 500  | Internal Server Error | Database error, server crash     |

---

### Rate Limiting

```
- Signup: 5 requests per hour per IP
- Login: 10 requests per hour per IP
- Scene Creation: 100 per day per user
- Scene Updates: 500 per day per user
- Scene Reads: Unlimited
```

---

### Webhook Events (Future Implementation)

```json
// Scene Created Event
{
  "event": "scene.created",
  "data": {
    "sceneId": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "sceneName": "Cosmic Sphere"
  },
  "timestamp": "2025-11-02T14:20:00.000Z"
}

// Unlock Triggered Event
{
  "event": "unlock.triggered",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "unlockType": "noetech",
    "noetechKey": "icarus-x",
    "animationId": "solar-ascension",
    "sceneNumber": 1
  },
  "timestamp": "2025-11-02T14:20:00.000Z"
}
```

---

## 🤝 Contributing

### Character Unlock Progression

| Scene # | Unlock Type | Character   | Animation/Note                      |
| ------- | ----------- | ----------- | ----------------------------------- |
| 1       | Noetech     | Icarus-X    | Unlocks character + Solar Ascension |
| 2       | Noetech     | Vectra      | Unlocks character + Holographic     |
| 3       | Noetech     | Nexus-Prime | Unlocks character + Warrior Flip    |
| 4       | Animation   | Icarus-X    | **Phoenix Dive** (switcher appears) |

### Animation Data Structure

```javascript
{
  id: 4,
  noetechKey: "icarus-x",
  animationId: "phoenix-dive",
  name: "Icᐱrus-X #001",
  animation: "Phoenix Dive",
  variant: "Crimson Descent",
  description: "The Seraph's devastating descent from celestial heights...",
  fbxUrl: "/models/icarus-bangs.fbx",
  isDefaultAnimation: false,  // Hidden until unlocked
  background: "linear-gradient(180deg, rgba(20,0,0,0.95) 0%, rgba(255,69,0,0.8) 20%...)"
}
```

### Gallery vs Viewer Logic

- **Gallery**: Shows only `isDefaultAnimation: true` animations
- **Viewer**: Shows animation switcher when multiple animations unlocked for same character
- **Switcher**: Dynamically filters `getUnlockedAnimationsForNoetech(noetechKey)`

---

## 🎯 Geometry Animation Algorithms

### Transform-Based Animations

```javascript
// Alien (Omni-directional Oscillation)
rotate: [
  Math.sin(time * 0.5) * 0.3,
  Math.cos(time * 0.7) * 0.2,
  Math.sin(time * 0.9) * 0.4
],
position: [
  Math.sin(time * 0.6) * 2,
  Math.cos(time * 0.8) * 1.5,
  Math.sin(time * 1.1) * 2.5
]
```

### Vertex-Deformation Animations

```javascript
// Magnetic Fields - Vertex manipulation
vertices.forEach((vertex, i) => {
  const distance = vertex.distanceTo(attractorPoint);
  const force = Math.max(0, 1 - distance / maxDistance);
  vertex.multiplyScalar(1 + force * 0.5);
});
geometry.attributes.position.needsUpdate = true;
```

---

## 🌟 Advanced Features

### Portal Worlds Theme System

Dynamic interface theming that responds to user interaction:

- **5 Quantum Dimensions**: Fractal, Nebula, Inferno, Emerald, Singularity
- **Real-time Color Propagation**: Navigation, backgrounds, glyphs update instantly
- **Parallax Depth Layers**: 3D background effects with mouse tracking
- **Mathematical Symbols**: Greek notation (ψ, Ω, Σ) that change with each "quantum collapse"

### Hyperframe Wireframe System

Advanced wireframe rendering with:

- **Thick Cylinder Edges**: Replace thin lines with 3D cylinders
- **Inner Structures**: Geometry-specific patterns (spherical spirals, cube inner frames)
- **Connecting Rods**: Link inner and outer structures
- **Synchronized Deformation**: All components follow mesh transformations

### Material Property System

Modern PBR materials with:

- **Metalness Control**: 0 (plastic) to 1 (chrome) with visual feedback
- **Emissive Intensity**: Self-illumination with base color tinting
- **Environment Hue Shift**: Universal color adjustment (0-360°)
- **Wireframe Intensity**: Blend between solid and wireframe modes

---

## 🏆 Technical Achievements

### Code Architecture

- **93% Reduction**: Refactored main ThreeScene.jsx from 2,700 to 199 lines
- **Custom Hooks**: 6 specialized hooks for 3D scene management
- **Factory Pattern**: Modularized object creation with reusable components
- **Separation of Concerns**: Clean boundaries between UI, 3D logic, and data

### Performance Optimizations

- **Efficient Animation Loops**: 60fps with complex multi-component objects
- **Memory Management**: Proper cleanup of Three.js objects and event listeners
- **Lazy Loading**: FBX models loaded on-demand with React Suspense
- **Instanced Rendering**: Optimized wireframe rendering for complex shapes

### User Experience Design

- **Progressive Disclosure**: Features unlock as users engage with the platform
- **Contextual UI**: Interface adapts based on authentication and scene state
- **Responsive Design**: Desktop-first with mobile adaptations
- **Accessibility**: Keyboard navigation and screen reader considerations

---

## 🔮 Future Roadmap

### Phase 1: Enhanced Animation System

- [ ] 50+ character animations from complete Mixamo pipeline
- [ ] Color variant system (5 themes per character)
- [ ] Animation speed controls and effect modifiers
- [ ] User-generated character upload system

### Phase 2: Social Platform Features

- [ ] Public scene gallery with discovery algorithms
- [ ] Scene remixing and collaborative editing
- [ ] User profiles with portfolio showcases
- [ ] Like, comment, and sharing systems

### Phase 3: Advanced Capabilities

- [ ] AI-powered scene generation via OpenAI integration
- [ ] VR/AR viewing modes with WebXR
- [ ] Animation recording and video export
- [ ] Marketplace for user-created content

### Phase 4: Professional Tools

- [ ] Scene version control and branching
- [ ] Team collaboration workspaces
- [ ] API for third-party integrations
- [ ] Enterprise deployment options

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### Getting Started

1. **Fork the Repository**

   ```bash
   # Click "Fork" button on GitHub
   # Clone your fork
   git clone https://github.com/YOUR-USERNAME/nexus-geom-3D.git
   cd nexus-geom-3D
   ```

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Your Changes**

   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed
   - Test your changes thoroughly

4. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "feat: add new animation algorithm"
   # or
   git commit -m "fix: resolve wireframe sync issue"
   ```

5. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   # Go to GitHub and create Pull Request
   ```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: code formatting (no logic change)
refactor: code restructuring
test: adding tests
chore: maintenance tasks
```

**Examples:**

```
feat: add pulse animation algorithm
fix: resolve FBX root motion drift
docs: update API reference for scene endpoints
refactor: extract material factory to separate file
test: add unit tests for wireframe builders
chore: update dependencies to latest versions
```

### Code Style Guidelines

**JavaScript/React:**

```javascript
// Use functional components with hooks
function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects here
    return () => cleanup();
  }, [dependencies]);

  return <div>...</div>;
}

// Use descriptive variable names
const ambientLightIntensity = 0.5; // Good
const ali = 0.5; // Bad

// Add comments for complex logic
// Calculate vertex deformation based on magnetic field strength
const deformationFactor = Math.max(0, 1 - distance / maxDistance);
```

**SCSS:**

```scss
// Use BEM naming convention
.component {
  &__element {
    // Element styles
  }

  &--modifier {
    // Modifier styles
  }
}

// Use CSS modules for component-scoped styles
.button {
  padding: 1rem 2rem;

  &--primary {
    background: var(--color-primary);
  }
}
```

**File Organization:**

```
// Group related functions
// Separate concerns clearly
// Export at the bottom

// Imports
import React from 'react';
import { useEffect } from 'react';

// Constants
const MAX_SCALE = 3.0;

// Helper functions
function calculatePosition() { ... }

// Main component
function Component() { ... }

// Export
export default Component;
```

### Development Workflow

**Setup:**

```bash
# Install dependencies
npm install
cd backend && npm install

# Create .env files
cp .env.example .env
cp backend/.env.example backend/.env

# Start development servers
npm run dev              # Frontend
cd backend && npm run dev # Backend
```

**Testing:**

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

**Before Submitting PR:**

```bash
# 1. Ensure no console errors
# 2. Test all affected features
# 3. Update documentation
# 4. Run linter
npm run lint

# 5. Format code
npm run format
```

### Areas Where We Need Help

#### High Priority

- 🎨 **UI/UX Improvements**: Enhance mobile responsiveness
- 🐛 **Bug Fixes**: Address issues in GitHub Issues
- 📚 **Documentation**: Improve API docs, add tutorials
- ♿ **Accessibility**: ARIA labels, keyboard navigation

#### Medium Priority

- 🎭 **New Animations**: Add character animations from Mixamo
- 🎨 **Themes**: Create new Portal World themes
- 🔧 **Geometries**: Implement new 3D shapes
- 📊 **Analytics**: User behavior tracking

#### Future Features

- 🤝 **Social Features**: Comments, likes, sharing
- 🎥 **Recording**: Export animations as videos
- 🌐 **i18n**: Multi-language support
- 🔌 **API Expansion**: Public API for third-party apps

### Bug Report Template

When reporting bugs, please include:

```markdown
**Description:**
Clear description of the bug

**Steps to Reproduce:**

1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
If applicable

**Environment:**

- OS: [e.g., macOS 14.0]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 20.10.0]
- Device: [Desktop/Mobile]
```

### Feature Request Template

```markdown
**Feature Description:**
Clear description of the feature

**Use Case:**
Why is this feature needed?

**Proposed Solution:**
How should it work?

**Alternatives Considered:**
Other approaches you've thought about

**Additional Context:**
Mockups, examples, references
```

### Pull Request Template

```markdown
**Description:**
What does this PR do?

**Related Issues:**
Fixes #123

**Type of Change:**

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Testing:**

- [ ] Tested locally
- [ ] Added unit tests
- [ ] Updated documentation

**Screenshots:**
(if applicable)

**Checklist:**

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Code Review**: Maintainer reviews code quality
3. **Testing**: Feature is tested manually
4. **Approval**: Changes are approved for merge
5. **Merge**: PR is merged to main branch

### Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow community guidelines

### Questions?

- 💬 **Discussions**: GitHub Discussions for questions
- 🐛 **Issues**: GitHub Issues for bugs/features
- 📧 **Email**: contact@nexusgeom.dev
- 💬 **Discord**: Join our community server

---

## 📚 Additional Resources

### Documentation

- **[Full Documentation](./docs/README.md)** - Comprehensive guides and references
- **[Architecture Diagram](./docs/ARCHITECTURE_DIAGRAM.md)** - Visual system architecture
- **[Study Plan](./docs/study-plan/STUDY_PLAN.md)** - Learn the codebase step-by-step
- **[Hooks Guide](./docs/hooks-customHooks/CUSTOM_HOOKS_GUIDE.md)** - Custom React hooks documentation
- **[Project Assessment](./docs/PROJECT_ASSESSMENT_OCTOBER_2025.md)** - Technical analysis and CRUD evaluation
- **[Testing Guide](./docs/TESTING_GUIDE.md)** - Testing strategies and examples

### Learning Resources

**Three.js:**

- [Three.js Official Docs](https://threejs.org/docs/)
- [Three.js Journey](https://threejs-journey.com/) - Comprehensive Three.js course
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber/)
- [Discover Three.js](https://discoverthreejs.com/) - Free online book

**React:**

- [React Documentation](https://react.dev/)
- [React Patterns](https://reactpatterns.com/)
- [Custom Hooks Guide](https://usehooks.com/)

**Full-Stack Development:**

- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB University](https://university.mongodb.com/)
- [JWT.io](https://jwt.io/introduction)

### Related Projects

- [Three.js Examples](https://threejs.org/examples/)
- [PMND Ecosystem](https://github.com/pmndrs) - React Three Fiber ecosystem
- [Poly Haven](https://polyhaven.com/) - Free 3D assets
- [Mixamo](https://www.mixamo.com/) - Free character animations

### Tools & Libraries

**3D Tools:**

- [Blender](https://www.blender.org/) - 3D modeling and animation
- [Meshy.ai](https://www.meshy.ai/) - AI 3D model generation
- [Sketchfab](https://sketchfab.com/) - 3D model hosting

**Development Tools:**

- [VS Code](https://code.visualstudio.com/) - Recommended editor
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Browser debugging

**Deployment:**

- [Vercel](https://vercel.com/) - Frontend hosting
- [Railway](https://railway.app/) - Backend hosting
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database hosting
- [Render](https://render.com/) - Alternative hosting

### Community

- **GitHub Discussions**: Ask questions and share ideas
- **Discord Server**: Real-time chat with community
- **Twitter**: [@NexusGeomLab](https://twitter.com/nexusgeomlab)
- **YouTube**: [Tutorial playlist](https://youtube.com/nexusgeom)

### Performance Benchmarks

| Metric                  | Target  | Current | Status |
| ----------------------- | ------- | ------- | ------ |
| First Contentful Paint  | < 1.5s  | 1.2s    | ✅     |
| Time to Interactive     | < 3.5s  | 2.8s    | ✅     |
| 3D Frame Rate (Desktop) | 60 FPS  | 60 FPS  | ✅     |
| 3D Frame Rate (Mobile)  | 30 FPS  | 28 FPS  | ⚠️     |
| API Response Time (avg) | < 200ms | 145ms   | ✅     |
| Bundle Size (gzipped)   | < 250KB | 218KB   | ✅     |
| Lighthouse Score        | > 90    | 93      | ✅     |

### Browser Support

| Browser       | Version | Status       |
| ------------- | ------- | ------------ |
| Chrome        | 90+     | ✅ Supported |
| Firefox       | 88+     | ✅ Supported |
| Safari        | 14+     | ✅ Supported |
| Edge          | 90+     | ✅ Supported |
| Opera         | 76+     | ✅ Supported |
| Mobile Safari | 14+     | ⚠️ Limited   |
| Mobile Chrome | 90+     | ⚠️ Limited   |

**Note**: Mobile devices may experience reduced performance with complex scenes.

### Feature Roadmap

**Q4 2025:**

- ✅ Core geometry editor
- ✅ Authentication system
- ✅ Scene save/load
- ✅ Animation showcase
- ✅ Progressive unlocks

**Q1 2026:**

- 🔄 Public scene gallery
- 🔄 Scene remixing
- 🔄 Social features (likes, comments)
- 🔄 User profiles

**Q2 2026:**

- 📅 AI scene generation
- 📅 Animation recording
- 📅 VR/AR support
- 📅 Collaborative editing

**Q3 2026:**

- 📅 Marketplace
- 📅 API v2
- 📅 Mobile app
- 📅 Enterprise features

### Changelog

**v1.0.0** (November 2025)

- Initial release
- Core geometry editor with 6 shapes
- 6 animation algorithms
- Full authentication system
- Scene CRUD operations
- Character animation showcase
- Progressive unlock system

**v0.9.0** (October 2025)

- Beta release
- Refactored ThreeScene.jsx (93% reduction)
- Custom hooks architecture
- Backend integration
- Showcase gallery

**v0.5.0** (September 2025)

- Alpha release
- Basic 3D rendering
- Control panel UI
- Material system
- Lighting controls

### Acknowledgments

**Special Thanks:**

- Three.js community for incredible 3D library
- React Three Fiber team for React integration
- Mixamo for character animations
- All contributors and testers

**Inspired By:**

- [Bruno Simon's Portfolio](https://bruno-simon.com/)
- [AlteredQualia's Demos](http://alteredqualia.com/)
- [Mrdoob's Three.js Editor](https://threejs.org/editor/)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

This project is free to use, modify, and distribute. Attribution appreciated but not required.

---

## 🎯 For Job Interviews

### What This Project Demonstrates

- **Advanced React Patterns**: Context, custom hooks, complex state management
- **3D Graphics Programming**: Three.js mastery with vertex manipulation and animation systems
- **Full-Stack Architecture**: Express.js API with MongoDB and JWT authentication
- **User Experience Design**: Progressive disclosure, gamification, responsive design
- **Code Organization**: Factory patterns, modular architecture, clean separation of concerns
- **Performance Optimization**: 60fps 3D rendering with complex multi-component objects

### Key Talking Points

1. **"I built a complete 3D pipeline"** - From Meshy.ai generation to web deployment
2. **"Advanced animation synchronization"** - Multiple components moving in perfect unison
3. **"Gamified progression system"** - Users unlock animations through scene creation
4. **"Full-stack authentication"** - JWT tokens with secure scene saving and loading
5. **"93% code reduction"** - Refactored monolithic component into modular architecture

### Live Demo Script

1. **Geometry Lab**: Show real-time 3D manipulation with material controls
2. **Animation Showcase**: Demonstrate character gallery with unlock progression
3. **Save System**: Create account, save scene, show unlock notification
4. **Multi-Animation**: Return to showcase, demonstrate animation switcher
5. **Technical Deep-Dive**: Show code architecture and explain complex systems

---

## 📬 Contact & Support

### Get in Touch

- 📧 **Email**: pablocordero.dev@gmail.com
- 💼 **LinkedIn**: [linkedin.com/in/pablocordero](https://linkedin.com/in/pablocordero)
- 🐙 **GitHub**: [github.com/pablocordero](https://github.com/pablocordero)
- 🌐 **Portfolio**: [pablocordero.dev](https://pablocordero.dev)
- 🐦 **Twitter**: [@pablodev](https://twitter.com/pablodev)

### Report Issues

Found a bug? Have a feature request?

- **GitHub Issues**: [Create an issue](https://github.com/pablocordero/nexus-geom-3D/issues)
- **Security Issues**: Please email directly for security concerns

### Community & Discussion

- **GitHub Discussions**: [Join the conversation](https://github.com/pablocordero/nexus-geom-3D/discussions)
- **Discord**: [Join our server](https://discord.gg/nexusgeom) (Coming soon)

---

## 🌟 Show Your Support

If you find this project helpful or interesting:

- ⭐ **Star this repository** on GitHub
- 🍴 **Fork it** to experiment with your own ideas
- 📣 **Share it** with your network
- 💬 **Provide feedback** through issues or discussions
- 🤝 **Contribute** to make it even better

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/pablocordero/nexus-geom-3D?style=social)
![GitHub forks](https://img.shields.io/github/forks/pablocordero/nexus-geom-3D?style=social)
![GitHub issues](https://img.shields.io/github/issues/pablocordero/nexus-geom-3D)
![GitHub pull requests](https://img.shields.io/github/issues-pr/pablocordero/nexus-geom-3D)
![License](https://img.shields.io/github/license/pablocordero/nexus-geom-3D)
![Code size](https://img.shields.io/github/languages/code-size/pablocordero/nexus-geom-3D)

---

<div align="center">

### Built with ❤️ and ☕ by Pablo Cordero

**Transforming mathematical concepts into interactive digital art experiences**

---

**Tech Stack**: React • Three.js • Express.js • MongoDB • Vite • SCSS

**Features**: 3D Rendering • Real-time Controls • JWT Auth • Progressive Unlocks • Gamification

**Architecture**: Custom Hooks • Factory Pattern • REST API • Modular Design

---

_"The universe is written in the language of mathematics, and its alphabet is circles, triangles, and other geometrical figures."_ - Galileo Galilei

---

### 🚀 [View Live Demo](https://nexus-geom-3d.vercel.app) | 📖 [Read Full Docs](./docs) | 💻 [Contribute](./#contributing)

---

Made in 2025 | Last Updated: November 2, 2025

</div>
