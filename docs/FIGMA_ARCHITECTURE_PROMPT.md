# Figma Prompt: Nexus Geom Lab Architecture Diagram

## **Prompt for Figma/AI Design Tool:**

Create a professional software architecture diagram for "Nexus Geom Lab" - a React + Three.js full-stack 3D geometric art platform. Use clean, modern design with:

**Visual Style:**

- Dark theme with neon accents (cyan #07a2c1, magenta #fd0a6f, teal #2eaca4)
- Rounded rectangles for components
- Sharp arrows for data flow
- Monospace font for code elements
- Clean sans-serif for labels

**Layout Structure (Top to Bottom):**

### **1. FRONTEND SECTION**

**Global State Layer:**

- Two rounded boxes side by side:
  - "AuthContext" (user, token, isAuth, login(), logout())
  - "SceneContext" (currentSceneId, sceneOwner, sceneName)

**Component Layer:**

- Large central box "App.jsx (State Management Hub)"
- Inside: Grid of 20 scene states in 4 columns:
  - MATERIAL: metalness, emissiveIntensity, baseColor, wireframeIntensity
  - HYPERFRAME: hyperframeColor, hyperframeLineColor, scale
  - SCENE: cameraView, environment, environmentHue, objectCount, animationStyle, objectType
  - LIGHTING: ambientLight*, directionalLight*, positions
- Three boxes below connected with arrows:
  - "Controls.jsx (UI)" → "ThreeScene.jsx (Props)" ← "SaveControls.jsx (API)"

**Custom Hooks Layer:**

- Horizontal row of 6 connected boxes:
  - useObjectManager, useMaterialUpdates, useLightingUpdates, useAnimationLoop, useSceneSetup, useEnvironment

**Three.js Engine:**

- Grid of 8 boxes in 2 rows:
  - Top: Scene, Camera, Renderer, Controls
  - Bottom: Materials, Geometries, Lighting, Animation

### **2. BACKEND SECTION**

**API Routes:**

- Two columns of endpoint boxes:
  - AUTH ROUTES: POST /auth/signup, POST /auth/login, GET /auth/me
  - SCENE ROUTES: POST /api/scenes, GET /api/scenes/my-scenes, PUT /api/scenes/:id, DELETE /api/scenes/:id

**Database:**

- Two connected boxes showing MongoDB collections:
  - USER (username, email, password, scenesSaved, unlockedNoetechs)
  - SCENE (name, userId, config, createdAt)
- Arrow showing "1 User → Many Scenes"

### **3. DATA FLOWS (Side Panel)**

**Flow 1 - UI Interaction:**

- Vertical flow with 7 connected steps:
  1. "User moves slider"
  2. "Controls.jsx onChange"
  3. "Handler Function"
  4. "App.jsx setState"
  5. "React Rerender"
  6. "ThreeScene Hook"
  7. "Three.js Update"

**Flow 2 - Save Operation:**

- Vertical flow with 6 connected steps:
  1. "User clicks Save"
  2. "Collect sceneConfig"
  3. "API Call POST/PUT"
  4. "Backend Validation"
  5. "MongoDB Save"
  6. "Success Response"

### **4. TECH STACK (Bottom)**

- Four grouped boxes:
  - Frontend: React 19.1.1, Vite 7.1.6, Three.js 0.180.0
  - Backend: Express.js, Node.js, JWT Auth
  - Database: MongoDB, Mongoose
  - Deploy: Vercel, Railway, Atlas

**Color Coding:**

- Frontend components: Cyan borders (#07a2c1)
- Backend components: Magenta borders (#fd0a6f)
- Database: Teal borders (#2eaca4)
- Data flows: Gold arrows (#c8922e)
- State/Props: Light blue backgrounds
- API endpoints: Dark purple backgrounds

**Annotations:**

- Add small icons: ⚛️ React, 🎮 Three.js, 🛡️ Auth, 💾 Database
- Include connection lines with arrow directions
- Label major data flow paths
- Add "FRONTEND" and "BACKEND" section headers

**Canvas Size:** 1920x1080 landscape orientation for presentation
