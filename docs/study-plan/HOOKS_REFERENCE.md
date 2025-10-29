# React & Scene Hooks Reference

A quick study sheet covering every hook we actively use in Nexus Geom so you can explain what each one contributes during reviews or interviews.

## 1. Core React Hooks

### useState

- **Where:** `src/App.jsx`, `src/components/Controls/Controls.jsx`, `src/pages/SignUpPage/SignUpPage.jsx`, and most form-driven components.
- **Why:** Holds UI state (scene config sliders, modal visibility, form fields). Because values live in React state, updates trigger re-renders across components that consume them.
- **Callout:** In `App.jsx` we lift dozens of scene knobs into one parent so `Controls` and `ThreeScene` stay synchronized without prop drilling chains.

### useEffect

- **Where:** `src/App.jsx` (navigation blocking, config loading, beforeunload guard), `src/features/sceneControls/hooks/*`, `src/pages/SignUpPage/SignUpPage.jsx` (cursor/parallax), etc.
- **Why:** Bridges React state changes to imperative side effects—adding DOM listeners, syncing Three.js materials, updating localStorage, or starting the render loop.
- **Callout:** Emphasize how dependency arrays limit work to only the knobs that actually changed (e.g., `useMaterialUpdates` isolates scale vs. emissive vs. wireframe updates).

### useRef

- **Where:** `src/features/sceneControls/ThreeScene.jsx` and related hooks, `src/pages/SignUpPage/SignUpPage.jsx` (parallax layers), `AuthContext` debug logging.
- **Why:** Stores mutable objects (Three.js scene, camera, renderer, cached materials) without triggering re-renders. Also keeps derived values like the active base color stabilized between rebuilds.
- **Callout:** Mention how refs make React → Three.js interop possible by persisting renderer resources outside the reconciliation cycle.

### useCallback

- **Where:** `src/context/AuthContext.jsx`, `src/context/SceneContext.jsx`, `src/features/sceneControls/hooks/useObjectInteraction.js`.
- **Why:** Memoizes functions that are passed to child components or stored in refs so identity stays stable and dependency arrays stay honest.
- **Callout:** In `AuthContext` and `SceneContext`, memoization prevents unnecessary rerenders of consumers when we expose actions like `login`, `saveScene`, or `resetScene`.

### useMemo

- **Where:** `src/Showcase/backgrounds/AnimatedBackground.jsx`.
- **Why:** Caches heavy geometry creation so the background mesh is built once per dependency change instead of every frame.
- **Callout:** Pair this with a note on balancing memoization cost vs. rebuild savings for geometry-heavy components.

### useContext

- **Where:** `src/context/AuthContext.jsx` (`useAuth`), `src/context/SceneContext.jsx` (`useScene`), consumed throughout pages (`src/App.jsx`, `src/pages/LoginPage/LoginPage.jsx`, etc.).
- **Why:** Lets components access shared state (current user, loaded scene metadata) without manual prop threads.
- **Callout:** You created ergonomic wrappers—`useAuth()` and `useScene()`—that throw helpful errors if consumed outside providers.

## 2. React Router Hooks

### useNavigate & useLocation

- **Where:** `src/App.jsx`, `src/pages/SignUpPage/SignUpPage.jsx`, `src/pages/LoginPage/LoginPage.jsx`, navigation utilities.
- **Why:** Imperatively redirect users (protecting routes, handling post-signup navigation) and read the current route for cursor/theme toggles.
- **Callout:** Tie into the navigation-blocking effect in `App.jsx` that checks `hasUnsavedChanges` before allowing route changes.

## 3. @react-three/fiber Hook

### useFrame

- **Where:** `src/Showcase/backgrounds/AnimatedBackground.jsx`, `src/Showcase/models/FBXModel.jsx`, `src/Showcase/components/RotatingCube/RotatingCube.jsx`.
- **Why:** Runs code on every render tick, enabling smooth animation updates that stay in sync with the Three.js render loop.
- **Callout:** Contrast this with your custom animation loop in `sceneControls` to show you understand both declarative and imperative render strategies.

## 4. Custom Scene Hooks

These live in `src/features/sceneControls/hooks` and encapsulate the Three.js bridge work:

- **useSceneInitialization:** Boots the scene, camera, renderer, lights, and window resize listener once on mount. Reference `useSceneInitialization.js` lines 17-70.
- **useObjectManager:** Rebuilds geometry when structural props change (`objectCount`, `objectType`, hyperframe parameters) while caching base color via a ref. See `useObjectManager.js` lines 18-99.
- **useMaterialUpdates:** Applies live material tweaks (scale, emissive glow, wireframe mix) via targeted effects that dedupe shared materials. File `useMaterialUpdates.js`.
- **useLightingUpdates:** Keeps ambient and directional lights in sync with UI sliders, clamping intensity/position to safe ranges.
- **useCameraController:** Repositions camera based on mode (`free`, `orbit`, `top`).
- **useMouseTracking & useEnvironmentUpdate:** Tracks cursor for spectral orbs and swaps backgrounds when environment or hue changes.
- **useObjectInteraction:** Performs raycasts on mouse move to inject manual rotation offsets so hover interactions override the default animation.
- **useAnimationLoop:** Starts and cleans up the manual `requestAnimationFrame` loop, piping in animation style, camera mode, and user-rotation overrides.

## 5. Context Convenience Hooks

- **useAuth (AuthContext):** Wraps `useContext` to expose `user`, `token`, `login`, `signup`, `logout`, and `addUnlockedNoetechs`. Highlight that it guards against accidental use outside `<AuthProvider>`.
- **useScene (SceneContext):** Provides scene metadata, computed helpers like `isOwnScene`, and mutation methods (`saveScene`, `loadScene`, `deleteScene`, `resetScene`). Reinforce that context centralizes scene ownership logic while keeping UI components lean.

Keep this sheet handy when walking interviewers through the architecture—it shows you understand not just what hooks are present, but why each one exists and how they cooperate inside the Three.js control pipeline.
