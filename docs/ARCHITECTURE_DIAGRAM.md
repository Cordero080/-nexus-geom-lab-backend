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
│                                                                                     │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐               │
│  │ShowcaseViewer   │────▶│ RotatingCube.jsx│◀────│  FBXModel.jsx   │               │
│  ├─────────────────┤     ├─────────────────┤     ├─────────────────┤               │
│  │ • Animation data│     │ • Character     │     │ • 3D Model      │               │
│  │ • Scene configs │     │   container     │     │   Loading       │               │
│  │ • Lighting      │     │ • Conditional   │     │ • FBX Parser    │               │
│  │   controls      │     │   lighting      │     │ • Material      │               │
│  │ • Background    │     │ • Environment   │     │   Application   │               │
│  │   animations    │     │   setup         │     │ • Animation     │               │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘               │
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

---

# Nexus Geom Lab - User Flow Diagram

**Complete User Journey Mapping for 3D Geometry Creation Platform**

```mermaid
flowchart TD
    %% Landing and Authentication
    A[Homepage/Landing] --> B{User Authenticated?}
    B -->|No| C[Sign Up Page]
    B -->|No| D[Sign In Page]
    B -->|Yes| E[Authenticated Homepage]

    C --> F[Registration Form]
    F --> G{Valid Registration?}
    G -->|No| H[Show Validation Errors]
    H --> F
    G -->|Yes| I[Account Created Success]
    I --> J[Auto-Login & Redirect]
    J --> E

    D --> K[Login Form]
    K --> L{Valid Credentials?}
    L -->|No| M[Show Login Error]
    M --> K
    L -->|Yes| N[JWT Token Generated]
    N --> E

    %% Main Navigation from Homepage
    E --> O[Navigation Bar]
    O --> P[Geom Lab]
    O --> Q[My Scenes]
    O --> R[Showcase]
    O --> S[Logout]

    S --> T[Clear Auth Token]
    T --> A

    %% Journey 1: New User Onboarding & First Scene Creation
    P --> U[3D Geom Lab Interface]
    U --> V[Control Panel]
    V --> W[Material Controls]
    V --> X[Scene Controls]
    V --> Y[Lighting Controls]
    V --> Z[Hyperframe Controls]

    W --> AA[Adjust Metalness]
    W --> AB[Change Base Color]
    W --> AC[Set Emissive Intensity]
    W --> AD[Toggle Wireframe]

    X --> AE[Select Object Type]
    X --> AF[Change Environment]
    X --> AG[Set Object Count]
    X --> AH[Choose Animation Style]
    X --> AI[Change Camera View]

    Y --> AJ[Ambient Light Settings]
    Y --> AK[Directional Light Controls]

    Z --> AL[Hyperframe Color]
    Z --> AM[Hyperframe Line Color]
    Z --> AN[Scale Adjustment]

    %% Real-time 3D Preview
    AA --> AO[Real-time 3D Preview Update]
    AB --> AO
    AC --> AO
    AD --> AO
    AE --> AO
    AF --> AO
    AG --> AO
    AH --> AO
    AI --> AO
    AJ --> AO
    AK --> AO
    AL --> AO
    AM --> AO
    AN --> AO

    %% Exit Without Saving Flow
    U --> AP[Exit Button]
    AP --> AQ{Has Unsaved Changes?}
    AQ -->|No| AR[Navigate Away]
    AQ -->|Yes| AS[Unsaved Changes Modal]
    AS --> AT[Save & Exit]
    AS --> AU[Exit Without Saving]
    AS --> AV[Cancel/Stay]

    AT --> AW[Scene Save Process]
    AU --> AR
    AV --> U
    AR --> E

    %% Scene Saving Process
    U --> AX[Save Scene Button]
    AX --> AY[Scene Name Modal]
    AY --> AZ[Enter Scene Name & Description]
    AZ --> BA{Valid Scene Data?}
    BA -->|No| BB[Show Validation Error]
    BB --> AZ
    BA -->|Yes| BC[API Call: POST/PUT /api/scenes]
    BC --> BD{Save Successful?}
    BD -->|No| BE[Show Error Message]
    BE --> AZ
    BD -->|Yes| BF[Scene Saved Success Modal]
    BF --> BG[Check Scene Count]
    BG --> BH{First Scene Saved?}
    BH -->|Yes| BI[Unlock First Showcase Item]
    BH -->|No| BJ[Check for New Unlocks]
    BI --> BK[Achievement Notification]
    BJ --> BL{New Unlock Available?}
    BL -->|Yes| BK
    BL -->|No| BM[Success Feedback Only]
    BK --> BM
    BM --> U

    %% Journey 2: My Scenes Management
    Q --> BN[My Scenes Gallery]
    BN --> BO[Display User's Saved Scenes]
    BO --> BP[Scene Cards with Thumbnails]
    BP --> BQ[Edit Scene Button]
    BP --> BR[Delete Scene Button]
    BP --> BS[View Scene Button]

    %% Edit Scene Flow
    BQ --> BT[Load Scene in Geom Lab]
    BT --> U

    %% View Scene Flow
    BS --> BU[Full 3D Scene Viewer]
    BU --> BV[Orbit Controls Active]
    BU --> BW[Back to Gallery Button]
    BW --> BN

    %% Journey 3: Delete Scene Flow
    BR --> BX[Delete Confirmation Modal]
    BX --> BY[Confirm Delete]
    BX --> BZ[Cancel Delete]
    BZ --> BN
    BY --> CA[API Call: DELETE /api/scenes/:id]
    CA --> CB{Delete Successful?}
    CB -->|No| CC[Show Error Message]
    CC --> BN
    CB -->|Yes| CD[Scene Removed from Gallery]
    CD --> CE[Update Scene Count]
    CE --> CF[Success Notification]
    CF --> BN

    %% Journey 4: Showcase Browsing
    R --> CG[Public Showcase Gallery]
    CG --> CH[Display Featured Geometric Artworks]
    CH --> CI[Locked Items (Grayed Out)]
    CH --> CJ[Unlocked Items (Full Color)]

    CI --> CK[Lock Tooltip: 'Save X scenes to unlock']
    CJ --> CL[Click to View]
    CL --> CM[Full 3D Showcase Viewer]
    CM --> CN[Character/Animation Display]
    CN --> CO[Orbit Controls]
    CN --> CP[Back to Showcase Button]
    CP --> CG

    %% Error States
    BE --> CQ[Network Error Handler]
    CC --> CQ
    CQ --> CR[Retry Button]
    CQ --> CS[Back to Previous Page]
    CR --> CT{Retry Action}
    CT --> BC
    CT --> CA
    CS --> E

    %% Success States
    BF --> CU[Success Toast Notification]
    CF --> CU
    CU --> CV[Auto-dismiss after 3s]

    %% Modal States
    AS --> CW[Modal Overlay Active]
    AY --> CW
    BX --> CW
    CW --> CX[Prevent Background Interaction]

    %% Mobile Responsive Considerations
    U --> CY{Screen Size Check}
    CY -->|Mobile| CZ[Collapsed Control Panel]
    CY -->|Desktop| DA[Full Control Panel]
    CZ --> DB[Expandable Controls]
    DB --> DA

    %% Loading States
    BC --> DC[Loading Spinner]
    BT --> DC
    CA --> DC
    DC --> DD[API Response Wait]
    DD --> BD
    DD --> CB

    %% Authentication Checks
    P --> DE{User Logged In?}
    Q --> DE
    R --> DE
    DE -->|No| DF[Redirect to Login]
    DE -->|Yes| DG[Proceed to Feature]
    DF --> D
    DG --> U
    DG --> BN
    DG --> CG

    %% Session Management
    N --> DH[Store JWT in LocalStorage]
    T --> DI[Clear JWT from LocalStorage]
    DH --> DJ[Set Auth Context]
    DI --> DK[Clear Auth Context]

    %% Styling for different node types
    classDef pageNode fill:#1a1625,stroke:#6366f1,stroke-width:2px,color:#ffffff
    classDef modalNode fill:#7c3aed,stroke:#a855f7,stroke-width:2px,color:#ffffff
    classDef processNode fill:#059669,stroke:#10b981,stroke-width:2px,color:#ffffff
    classDef decisionNode fill:#dc2626,stroke:#ef4444,stroke-width:2px,color:#ffffff
    classDef successNode fill:#16a34a,stroke:#22c55e,stroke-width:2px,color:#ffffff
    classDef errorNode fill:#ea580c,stroke:#f97316,stroke-width:2px,color:#ffffff

    class A,C,D,E,U,BN,CG pageNode
    class AS,AY,BX,BF,BE,CW modalNode
    class BC,BT,CA,DC,AW processNode
    class B,G,L,AQ,BA,BD,BH,BL,CB,CY,DE decisionNode
    class I,BK,BM,CF,CU successNode
    class H,M,BB,CC,CQ errorNode
```

**Key User Journey Descriptions:**

## Journey 1: New User Onboarding

**Path:** Landing → Sign Up → Geom Lab → Create Scene → Save → Unlock Achievement

- **Entry Points:** Homepage, direct link to sign up
- **Success Criteria:** User creates account, saves first scene, unlocks first showcase item
- **Pain Points:** Form validation, understanding 3D controls
- **Optimization:** Tutorial overlay, progressive disclosure of features

## Journey 2: Scene Creation & Management

**Path:** Login → Geom Lab → Adjust Controls → Save → View in Gallery → Edit

- **Entry Points:** Homepage navigation, My Scenes gallery
- **Success Criteria:** Scene saved with custom configuration, easily editable
- **Pain Points:** Complex control interface, saving workflow
- **Optimization:** Auto-save drafts, control grouping, quick presets

## Journey 3: Scene Deletion

**Path:** My Scenes → Select Scene → Delete Button → Confirm → Remove

- **Entry Points:** My Scenes gallery
- **Success Criteria:** Scene safely deleted with confirmation
- **Pain Points:** Accidental deletion, permanent loss
- **Optimization:** Soft delete with recovery, clear confirmation modal

## Journey 4: Showcase Exploration

**Path:** Showcase → Browse Items → Click Unlocked → Full Viewer → Return

- **Entry Points:** Main navigation, achievement notifications
- **Success Criteria:** User discovers new content, motivated to create more
- **Pain Points:** Locked content frustration, unclear unlock requirements
- **Optimization:** Clear unlock progress, preview teasers for locked items

## Journey 5: Exit Without Saving

**Path:** Geom Lab → Exit → Unsaved Changes Modal → Choose Action

- **Entry Points:** Navigation away from Geom Lab
- **Success Criteria:** User doesn't lose work, makes informed decision
- **Pain Points:** Unexpected navigation, lost progress
- **Optimization:** Auto-save drafts, clear modal options, progress indicators

**Critical Success Metrics:**

- Registration completion rate
- First scene save rate
- Scene creation to showcase unlock conversion
- User retention after first session
- Average scenes created per user

**Error Handling Patterns:**

- Network errors with retry functionality
- Validation errors with inline feedback
- Authentication errors with re-login prompts
- 404 errors with navigation suggestions

**Mobile Optimizations:**

- Collapsible control panels
- Touch-friendly 3D navigation
- Simplified creation flow
- Responsive modal sizing

```

```
