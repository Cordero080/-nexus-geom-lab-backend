# State Sharing & Controlled UI Patterns

Use this guide to explain foundational React state patterns that show up throughout Nexus Geom.

## 1. Lifting State Up

**Concept:** Move shared data into the closest common ancestor so multiple children can read and mutate it without drifting out of sync.

**Project Example:**

- `src/App.jsx` owns the entire scene configuration—material knobs, lighting, camera mode, environment, animation. Those values flow down to `Controls` (for editing) and `ThreeScene` (for rendering) as props.
- Because `App.jsx` holds the state, changing a slider immediately re-renders both the UI and the Three.js scene without extra listeners.
- When we save scenes, `App.jsx` packages the same state into the `sceneConfig` object so API calls stay consistent.

**Talking Points:**

- Lifting state avoided prop drilling because we expose setters directly to `Controls` (`onMetalnessChange`, `onScaleChange`, etc.).
- It also made it trivial to add navigation blocking—`useEffect` watches the lifted values and flips `hasUnsavedChanges` when any knob moves.

## 2. Controlled Components

**Concept:** Inputs receive their current value via props and report changes through callbacks; React is the source of truth.

**Project Example:**

- `src/components/Controls/Controls.jsx` wires every slider, color picker, checkbox, and select as a controlled input: `value={metalness}` with `onChange={handleMetalnessChange}`. Those handlers simply call the setter from `App.jsx`.
- `LightingControls.jsx` follows the same model for ambient/directional sliders, guaranteeing the UI always reflects state from the parent.

**Benefits to Emphasize:**

- Makes it easy to display derived info alongside inputs (`valueDisplay` spans show formatted numbers).
- Enables instant undo/reset features because you can centralize default values in one place (`App.jsx`).
- Keeps Three.js props trustworthy—no surprises from uncontrolled DOM state.

## 3. Controlled Forms

**Concept:** Manage an entire form through React state so validation, submission, and feedback logic live in one place.

**Project Example:**

- `src/pages/SignUpPage/SignUpPage.jsx` keeps `formData` in a single `useState` object. Each `input` uses `value={formData.field}` and `onChange={handleChange}` so we can validate, show errors, and block submission from the same component.
- `handleSubmit` reads the controlled state, calls `useAuth().signup`, and navigates via `useNavigate` only when validation succeeds.
- The login page mirrors this pattern, so you can highlight consistency across auth screens.

**Talking Points:**

- Controlled forms make inline validation straightforward—`handleChange` clears field-level errors the moment users type.
- Because errors and loading state are also controlled, we can disable buttons and swap labels (`INITIALIZING...`) without extra DOM queries.

## 4. When to Reach for Context

While not strictly part of “lifting state,” contexts combine well with the above patterns:

- `AuthContext` lifts user/session data above the entire app, exposing controlled actions via the `useAuth` hook.
- `SceneContext` lifts scene metadata (name, ownership, mode) so modals and pages know whether they are editing or remixing.

Frame these together when presenting: you lift state when the same data feeds multiple siblings, and you introduce context when the sharing scope spans entire feature areas.
