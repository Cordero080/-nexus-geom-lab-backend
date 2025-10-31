# Nexus Geom Lab - Architecture Diagram

**Full-Stack React + Three.js 3D Geometric Art Platform**

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                   FRONTEND                                          │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              GLOBAL STATE LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────┐                    ┌─────────────────┐                        │
│  │   AuthContext   │                    │  SceneContext   │                        │
│  ├─────────────────┤                    ├─────────────────┤                        │
│  │ • user          │                    │ • currentSceneId│                        │
│  │ • token         │                    │ • sceneOwner    │                        │
│  │ • isAuth        │                    │ • sceneName     │                        │
│  │ • login()       │                    │ • loadScene()   │                        │
│  │ • logout()      │                    │ • saveScene()   │                        │
│  └─────────────────┘                    └─────────────────┘                        │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              COMPONENT LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │                              App.jsx                                           │ │
│  │                        (State Management Hub)                                  │ │
│  ├─────────────────────────────────────────────────────────────────────────────────┤ │
│  │                           20 Scene Config States:                              │ │
│  │                                                                                 │ │
│  │  MATERIAL:           HYPERFRAME:         SCENE:             LIGHTING:          │ │
│  │  • metalness         • hyperframeColor   • cameraView       • ambientLight*   │ │
│  │  • emissiveIntensity • hyperframeLineColor • environment    • directionalLight*│ │
│  │  • baseColor         • scale             • environmentHue   • positions       │ │
│  │  • wireframeIntensity                    • objectCount                        │ │
│  │                                          • animationStyle                     │ │
│  │                                          • objectType                         │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                         │                                           │
│                                         ▼                                           │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐               │
│  │  Controls.jsx   │────▶│  ThreeScene.jsx │◀────│ SaveControls.jsx│               │
│  ├─────────────────┤     ├─────────────────┤     ├─────────────────┤               │
│  │ • Material UI   │     │ • Receives all  │     │ • Collects state│               │
│  │ • Scene UI      │     │   20 props      │     │ • API calls     │               │
│  │ • Lighting UI   │     │ • Passes to     │     │ • Scene saving  │               │
│  │ • Event handlers│     │   custom hooks  │     │ • User feedback │               │
│  │ • User interaction      │ • Renders 3D    │     └─────────────────┘               │
│  └─────────────────┘     └─────────────────┘                                       │
│           │                       │                                                 │
│           │                       ▼                                                 │
│           │              ┌─────────────────┐                                        │
│           │              │ Custom Hooks    │                                        │
│           │              │ Layer           │                                        │
│           │              ├─────────────────┤                                        │
│           │              │useObjectManager │                                        │
│           │              │useMaterialUpdate│                                        │
│           │              │useLightingUpdate│                                        │
│           │              │useAnimationLoop │                                        │
│           │              │useSceneSetup    │                                        │
│           │              │useEnvironment   │                                        │
│           │              └─────────────────┘                                        │
│           │                       │                                                 │
│           └───────────────────────┼─────────────────────────────────────────────────┤
│                                   ▼                                                 │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           THREE.JS RENDERING ENGINE                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │   Scene     │  │   Camera    │  │  Renderer   │  │  Controls   │                │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤                │
│  │ • Objects   │  │ • Position  │  │ • WebGL     │  │ • Orbit     │                │
│  │ • Lights    │  │ • Target    │  │ • Canvas    │  │ • Free      │                │
│  │ • Background│  │ • FOV       │  │ • Shadows   │  │ • Top-down  │                │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                │
│                                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │ Materials   │  │ Geometries  │  │ Lighting    │  │ Animation   │                │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤                │
│  │ • Standard  │  │ • Icosahedron│ │ • Ambient   │  │ • Rotation  │                │
│  │ • Metalness │  │ • Tesseract │  │ • Directional│ │ • Floating  │                │
│  │ • Emissive  │  │ • 120-Cell  │  │ • Shadows   │  │ • Omni-Intel│                │
│  │ • Wireframe │  │ • 20+ Types │  │ • Colors    │  │ • Time-based│                │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                   BACKEND                                          │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                               API ROUTES                                           │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────┐     ┌─────────────────────────────┐               │
│  │       AUTH ROUTES           │     │       SCENE ROUTES          │               │
│  ├─────────────────────────────┤     ├─────────────────────────────┤               │
│  │ POST /api/auth/signup       │     │ POST /api/scenes            │               │
│  │ POST /api/auth/login        │     │ GET  /api/scenes/my-scenes  │               │
│  │ GET  /api/auth/me           │     │ PUT  /api/scenes/:id        │               │
│  │                             │     │ DELETE /api/scenes/:id      │               │
│  │ • JWT Token Generation      │     │                             │               │
│  │ • Password Hashing          │     │ • Authorization Checks      │               │
│  │ • User Validation           │     │ • Ownership Validation      │               │
│  │ • Noetech Unlocking         │     │ • Config Validation         │               │
│  └─────────────────────────────┘     └─────────────────────────────┘               │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE LAYER                                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                 MongoDB                                             │
│                                                                                     │
│  ┌─────────────────────────────┐     ┌─────────────────────────────┐               │
│  │       USER COLLECTION       │     │      SCENE COLLECTION       │               │
│  ├─────────────────────────────┤     ├─────────────────────────────┤               │
│  │ • _id (ObjectId)            │     │ • _id (ObjectId)            │               │
│  │ • username (String)         │     │ • name (String)             │               │
│  │ • email (String)            │     │ • description (String)      │               │
│  │ • password (Hashed)         │     │ • userId (ObjectId ref)     │               │
│  │ • scenesSaved (Number)      │◀───┤│ • config (Object):          │               │
│  │ • unlockedNoetechs (Array)  │    ││   - All 20 scene states    │               │
│  │ • createdAt (Date)          │    ││ • createdAt (Date)          │               │
│  └─────────────────────────────┘    │└─────────────────────────────┘               │
│                                     │                                               │
│                                     │ Relationship: 1 User → Many Scenes           │
│                                     └───────────────────────────────────────────────│
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                DATA FLOWS                                          │
└─────────────────────────────────────────────────────────────────────────────────────┘

FLOW 1: User Interface Interaction
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  User moves slider                                                                  │
│         │                                                                           │
│         ▼                                                                           │
│  ┌──────────────┐    onChange event    ┌──────────────┐                            │
│  │ Controls.jsx │──────────────────────▶│   Handler    │                            │
│  │  (Slider)    │                      │  Function    │                            │
│  └──────────────┘                      └──────────────┘                            │
│                                                │                                    │
│                                                ▼                                    │
│                                        ┌──────────────┐                            │
│                                        │   App.jsx    │                            │
│                                        │ setBaseColor │                            │
│                                        │   (state)    │                            │
│                                        └──────────────┘                            │
│                                                │                                    │
│                                                ▼ React Rerender                    │
│                                        ┌──────────────┐                            │
│                                        │ ThreeScene   │                            │
│                                        │ (receives    │                            │
│                                        │  new prop)   │                            │
│                                        └──────────────┘                            │
│                                                │                                    │
│                                                ▼                                    │
│                                        ┌──────────────┐                            │
│                                        │Custom Hooks  │                            │
│                                        │useObjectMgr  │                            │
│                                        └──────────────┘                            │
│                                                │                                    │
│                                                ▼                                    │
│                                        ┌──────────────┐                            │
│                                        │  Three.js    │                            │
│                                        │   Material   │                            │
│                                        │   Update     │                            │
│                                        └──────────────┘                            │
│                                                │                                    │
│                                                ▼                                    │
│                                        ┌──────────────┐                            │
│                                        │   Screen     │                            │
│                                        │ Re-renders   │                            │
│                                        └──────────────┘                            │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

FLOW 2: Scene Save Operation
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  User clicks "Save Scene"                                                          │
│         │                                                                           │
│         ▼                                                                           │
│  ┌──────────────┐    onClick    ┌──────────────┐                                   │
│  │SaveControls  │──────────────▶│   Collect    │                                   │
│  │   Button     │               │ sceneConfig  │                                   │
│  └──────────────┘               └──────────────┘                                   │
│                                         │                                           │
│                                         ▼                                           │
│                                 ┌──────────────┐                                   │
│                                 │   API Call   │                                   │
│                                 │ POST/PUT     │                                   │
│                                 │ /api/scenes  │                                   │
│                                 └──────────────┘                                   │
│                                         │                                           │
│                                         ▼ HTTP Request                             │
│                                 ┌──────────────┐                                   │
│                                 │   Backend    │                                   │
│                                 │   Routes     │                                   │
│                                 └──────────────┘                                   │
│                                         │                                           │
│                                         ▼                                           │
│                                 ┌──────────────┐                                   │
│                                 │  Validation  │                                   │
│                                 │ Authorization│                                   │
│                                 └──────────────┘                                   │
│                                         │                                           │
│                                         ▼                                           │
│                                 ┌──────────────┐                                   │
│                                 │   MongoDB    │                                   │
│                                 │   Insert/    │                                   │
│                                 │   Update     │                                   │
│                                 └──────────────┘                                   │
│                                         │                                           │
│                                         ▼ Success Response                         │
│                                 ┌──────────────┐                                   │
│                                 │   Frontend   │                                   │
│                                 │   Success    │                                   │
│                                 │   Modal      │                                   │
│                                 └──────────────┘                                   │
│                                         │                                           │
│                                         ▼                                           │
│                                 ┌──────────────┐                                   │
│                                 │   Noetech    │                                   │
│                                 │   Unlock     │                                   │
│                                 │   Check      │                                   │
│                                 └──────────────┘                                   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            TECHNOLOGY STACK                                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  Frontend:                          Backend:                                       │
│  • React 19.1.1                    • Express.js 5.1.0                             │
│  • Vite 7.1.6                      • Node.js                                      │
│  • Three.js 0.180.0                • Mongoose 8.19.2                              │
│  • React Three Fiber 9.4.0         • JWT Authentication                           │
│  • React Router 7.9.3              • bcrypt Password Hashing                      │
│  • SCSS/CSS Modules                • Express Validator                             │
│                                                                                     │
│  Database:                          Deployment:                                    │
│  • MongoDB (Local/Atlas)           • Vercel (Frontend)                             │
│  • Collections: Users, Scenes      • Railway (Backend)                             │
│  • Indexes: userId, createdAt      • MongoDB Atlas (Database)                      │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              KEY FEATURES                                          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ✅ Complete CRUD Operations        ✅ Real-time 3D Rendering                     │
│  ✅ JWT Authentication              ✅ 20+ Geometric Objects                       │
│  ✅ Progressive Feature Unlocking   ✅ Advanced Material System                    │
│  ✅ Scene Save/Load System          ✅ Dynamic Lighting Controls                   │
│  ✅ User Authorization              ✅ Multiple Camera Views                       │
│  ✅ Mobile Responsive Design        ✅ Environment Backgrounds                     │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

**Legend:**

- `▶` Data flow direction
- `┌─┐` Component/System boundaries
- `├─┤` Internal structure
- `◀──┤` Database relationships
- `│▼│` Vertical data flow

**Architecture Principles:**

1. **Unidirectional Data Flow**: State flows down, events flow up
2. **Separation of Concerns**: UI, Logic, and Rendering are separate layers
3. **Single Source of Truth**: App.jsx manages all scene configuration
4. **Authorization Security**: Owner-only access to scene modifications
5. **Real-time Updates**: Immediate visual feedback for all user interactions
