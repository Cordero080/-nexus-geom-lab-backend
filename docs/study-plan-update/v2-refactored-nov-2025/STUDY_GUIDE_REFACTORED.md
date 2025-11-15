# Study Guide: Refactored Architecture

**Purpose**: Key concepts to study in the newly refactored codebase  
**Audience**: Future me, technical interviewers, code reviewers  
**Focus**: Understanding architectural patterns and data flow

---

## 🎯 Study Goals

After working through this guide, you should be able to:

1. **Trace data flow** from user interaction → state change → UI update
2. **Explain architectural patterns** (custom hooks, DRY, error boundaries)
3. **Navigate codebase** using new path alias system
4. **Understand build optimizations** (console removal, env vars)
5. **Articulate design decisions** made during refactoring

---

## 📚 Core Concepts to Master

### 1. Path Alias System

**What**: Clean absolute imports instead of relative paths

**Files to Study:**
- `vite.config.js` (lines 13-23) - Alias configuration
- `jsconfig.json` - VS Code autocomplete setup
- `src/App.jsx` (lines 1-20) - Usage examples
- `src/main.jsx` (lines 1-7) - Usage examples

**Key Questions:**
- How does Vite resolve `@/components` to `./src/components`?
- Why do we need both `vite.config.js` and `jsconfig.json`?
- What happens if you import `@/utils/helper` vs `../../../../utils/helper`?
- How do path aliases make refactoring easier?

**Hands-On Exercise:**
```javascript
// Convert this:
import Controls from '../../../components/features/Controls/Controls';
import useSceneState from '../../hooks/useSceneState';

// To this:
import Controls from '@/components/features/Controls/Controls';
import useSceneState from '@/hooks/useSceneState';
```

**Deep Dive:**
1. Open `vite.config.js` and read the `resolve.alias` block
2. Open `App.jsx` and find all `@/` imports
3. Try adding a new alias (e.g., `@data` for `src/data/`)
4. Test autocomplete in VS Code by typing `@/`

---

### 2. Custom Hooks Pattern (useSceneState)

**What**: Extracting stateful logic into reusable hooks

**Files to Study:**
- `src/hooks/useSceneState.js` (full file, 131 lines) - Hook implementation
- `src/App.jsx` (lines 40-92) - Hook usage in component

**Key Questions:**
- Why extract state to a hook instead of keeping in App.jsx?
- How is state organized? (Hint: 5 logical domains)
- Why return a flat object instead of nested objects?
- Could this hook be used in other components? How?
- What's the difference between this and Context API?

**State Organization Map:**
```
useSceneState()
  ├─ Material Properties (4 states)
  │    ├─ metalness
  │    ├─ emissiveIntensity
  │    ├─ baseColor
  │    └─ wireframeIntensity
  ├─ Hyperframe (2 states)
  │    ├─ hyperframeColor
  │    └─ hyperframeLineColor
  ├─ Scene Behavior (6 states)
  │    ├─ cameraView
  │    ├─ environment
  │    ├─ environmentHue
  │    ├─ objectCount
  │    ├─ animationStyle
  │    └─ objectType
  ├─ Lighting (7 states)
  │    ├─ ambientLightColor
  │    ├─ ambientLightIntensity
  │    ├─ directionalLightColor
  │    ├─ directionalLightIntensity
  │    ├─ directionalLightX
  │    ├─ directionalLightY
  │    └─ directionalLightZ
  └─ Animation (3 states)
       ├─ scale
       ├─ objectSpeed
       └─ orbSpeed
```

**Hands-On Exercise:**
1. Open `src/hooks/useSceneState.js`
2. Count the useState calls (should be 22)
3. Trace the return object - note how each state has its setter
4. Open `App.jsx` and find the destructuring of the hook
5. Try adding a new state to the hook (e.g., `backgroundColor`)

**Data Flow Trace:**
```
User moves metalness slider
  ↓
Controls.jsx receives onMetalnessChange prop
  ↓
Calls setMetalness (from useSceneState hook)
  ↓
Hook updates metalness state
  ↓
App.jsx re-renders with new metalness value
  ↓
Passes metalness prop to ThreeScene
  ↓
ThreeScene updates 3D material properties
```

---

### 3. DRY Principle (Don't Repeat Yourself)

**What**: Shared geometry helper function eliminates duplication

**Files to Study:**
- `src/features/sceneControls/utils/geometryHelpers.js` (lines 1-93) - Shared function
- `src/features/sceneControls/geometries/polytopes/compoundTesseract.js` (line 3) - Import usage
- `src/features/sceneControls/geometries/polytopes/megaTesseract.js` (line 3) - Import usage

**Key Questions:**
- What problem did duplication cause?
- How many files had identical `createTesseractWithFaces` functions? (Answer: 8)
- How many lines of code were removed? (Answer: ~560)
- What happens when we find a bug in `createTesseractWithFaces` now?
- Why is this called "single source of truth"?

**Before/After Comparison:**
```javascript
// BEFORE: 8 files with 80 identical lines each = 640 lines total
// compoundTesseract.js
function createTesseractWithFaces(options) {
  // ... 80 lines of code ...
}

// megaTesseract.js
function createTesseractWithFaces(options) {
  // ... SAME 80 lines of code ...
}

// compoundMegaTesseract1.js
function createTesseractWithFaces(options) {
  // ... SAME 80 lines of code ...
}

// ... 5 more files with identical code ...
```

```javascript
// AFTER: 1 shared file = 80 lines total
// geometryHelpers.js
export function createTesseractWithFaces(options) {
  // ... 80 lines of code (ONCE) ...
}

// All 7 polytope files now just import it:
import { createTesseractWithFaces } from '../utils/geometryHelpers';
```

**Hands-On Exercise:**
1. Open `src/features/sceneControls/utils/geometryHelpers.js`
2. Read the `createTesseractWithFaces` function signature
3. Note the parameters: `{ scale, hyperframeColor, baseColor, options }`
4. Find where it's imported in `compoundTesseract.js`
5. Search project for "createTesseractWithFaces" - should find 8 imports, 1 definition

**Impact Analysis:**
- **Maintenance**: Bug fix = 1 change instead of 8
- **Consistency**: All tesseracts use same creation logic
- **Readability**: Polytope files are cleaner (no 80-line function)
- **Testing**: Test the shared function once

---

### 4. Error Boundaries in React

**What**: Catch component errors to prevent app crashes

**Files to Study:**
- `src/components/shared/ErrorBoundary/ErrorBoundary.jsx` (full file, 75 lines)
- `src/components/shared/ErrorBoundary/ErrorBoundary.css` (full file, 88 lines)
- `src/main.jsx` (lines 30-34) - Wrapping app in boundary

**Key Questions:**
- Why must ErrorBoundary be a class component?
- What lifecycle methods does it use?
- What types of errors CAN it catch?
- What types of errors CAN'T it catch?
- Why do we show error details only in dev mode?

**Error Boundary Lifecycle:**
```
Component throws error during render
  ↓
static getDerivedStateFromError(error)
  ↓
Updates state: { hasError: true }
  ↓
componentDidCatch(error, errorInfo)
  ↓
Logs error, stores errorInfo in state
  ↓
render() method checks state.hasError
  ↓
Shows fallback UI instead of broken component
```

**What It Catches:**
- ✅ Rendering errors
- ✅ Lifecycle method errors
- ✅ Constructor errors in component tree

**What It Doesn't Catch:**
- ❌ Event handler errors (use try/catch)
- ❌ Async code (promises, setTimeout)
- ❌ Server-side rendering errors
- ❌ Errors in the boundary itself

**Hands-On Exercise:**
1. Open `ErrorBoundary.jsx` and find `getDerivedStateFromError`
2. Find `componentDidCatch` - note the logging
3. Look at the render method's conditional logic
4. Open `main.jsx` - see how app is wrapped
5. Create a test component that throws an error, verify boundary catches it

**Fallback UI Elements:**
```jsx
<div className="error-boundary">
  <h1>⚠️ Something Went Wrong</h1>
  <p>The application encountered an unexpected error.</p>
  <button onClick={handleReset}>Try Again</button>  {/* Resets error state */}
  <button onClick={() => window.location.href = '/'}>Go Home</button>  {/* Navigate away */}
  {import.meta.env.DEV && <details>...</details>}  {/* Dev mode: show stack trace */}
</div>
```

---

### 5. Environment Variables

**What**: Configuration values that change per environment

**Files to Study:**
- `.env.example` (template file)
- `.gitignore` (lines with `.env`)
- `vite.config.js` (usage of env vars, if any)

**Key Questions:**
- Why is `.env` in `.gitignore` but `.env.example` is committed?
- What does the `VITE_` prefix mean?
- How do you access env vars in code? (Hint: `import.meta.env`)
- Why separate dev/production environment variables?

**Environment Variable Workflow:**
```
Developer Setup:
  1. Clone repo
  2. Copy .env.example to .env
  3. Fill in actual values (API keys, URLs)
  4. .env is gitignored (secrets stay local)

Production Deployment:
  1. Set env vars in hosting platform (Vercel, Render)
  2. Build process injects values
  3. App uses import.meta.env.VITE_API_URL
```

**Hands-On Exercise:**
1. Open `.env.example` - read the comments
2. Create `.env` file (copy from .env.example)
3. Add a test variable: `VITE_TEST_MODE=true`
4. In a component, try: `console.log(import.meta.env.VITE_TEST_MODE)`
5. Verify it's undefined without the `VITE_` prefix

**Security Notes:**
- ✅ `.env` is in `.gitignore` (never commit secrets)
- ✅ `.env.example` has placeholders, not real values
- ✅ Use `VITE_` prefix for client-side vars
- ❌ Never put sensitive keys in client-side code (API keys should be backend-only)

---

### 6. Build Optimization (Console Removal)

**What**: Auto-remove debug statements in production

**Files to Study:**
- `vite.config.js` (lines 3, 10-15) - Plugin configuration
- `package.json` (check devDependencies) - Plugin installed

**Key Questions:**
- Why remove console logs only in production, not dev?
- Which console methods are removed? Which are kept?
- How does the plugin know production vs dev?
- What's the performance impact of console statements?

**Plugin Configuration:**
```javascript
import removeConsole from 'vite-plugin-remove-console';

plugins: [
  react(),
  removeConsole({
    includes: ['log', 'warn', 'info', 'debug'], // Remove these
    excludes: ['error'], // Keep console.error for tracking
  }),
]
```

**What Happens:**
```javascript
// Your code (development):
console.log('User clicked button');
console.warn('This might be slow');
console.error('API failed:', error);

// Production build output:
// (console.log and console.warn are removed)
console.error('API failed:', error); // Kept!
```

**Hands-On Exercise:**
1. Run `npm run dev` - check browser console for logs
2. Run `npm run build` - build for production
3. Run `npm run preview` - preview production build
4. Check browser console - most logs should be gone
5. Verify `console.error` statements still appear

---

## 🗺️ Updated File Structure Map

### Before Refactoring
```
src/
├── App.jsx (553 lines - MASSIVE STATE MANAGEMENT)
│   ├─ 22 useState calls scattered
│   └─ Complex prop passing
├── utils/
│   └─ geometryHelpers.js (orphaned, never imported)
└── features/sceneControls/geometries/polytopes/
    ├─ compoundTesseract.js (has createTesseractWithFaces - 80 lines)
    ├─ megaTesseract.js (has createTesseractWithFaces - 80 lines)
    └─ ... (6 more files with identical function)
```

### After Refactoring
```
src/
├── App.jsx (cleaner - uses @/ imports)
│   └─ Imports useSceneState from @/hooks/useSceneState
│
├── hooks/
│   └─ useSceneState.js ← NEW (131 lines)
│       └─ All scene state organized by domain
│
├── components/shared/
│   └─ ErrorBoundary/ ← NEW
│       ├─ ErrorBoundary.jsx (75 lines)
│       └─ ErrorBoundary.css (88 lines)
│
├── features/sceneControls/
│   ├─ utils/
│   │   └─ geometryHelpers.js (now contains shared createTesseractWithFaces)
│   └─ geometries/polytopes/
│       ├─ compoundTesseract.js (imports shared function)
│       ├─ megaTesseract.js (imports shared function)
│       └─ ... (all import instead of duplicating)
│
├── main.jsx (wrapped in ErrorBoundary, uses @/ imports)
│
Root files:
├── vite.config.js (path aliases + console removal)
├── jsconfig.json ← NEW (VS Code support)
└── .env.example ← NEW (env var docs)
```

---

## 📖 File Path Reference

### Key Files to Have Open While Studying

**State Management:**
- `src/hooks/useSceneState.js` - Custom hook with all state
- `src/App.jsx` - Hook usage in component

**Shared Utilities:**
- `src/features/sceneControls/utils/geometryHelpers.js` - Shared geometry functions

**Error Handling:**
- `src/components/shared/ErrorBoundary/ErrorBoundary.jsx` - Error boundary logic
- `src/main.jsx` - App wrapper

**Configuration:**
- `vite.config.js` - Build config, path aliases, console removal
- `jsconfig.json` - VS Code path support
- `.env.example` - Environment variables template
- `package.json` - Dependencies (vite-plugin-remove-console)

**Documentation:**
- `docs/REFACTORING_CHANGELOG.md` - What changed and why
- `docs/reference/workflows/QUICK_WINS_GUIDE.md` - Implementation details
- `docs/reference/workflows/SCENE_STATE_REFACTOR.md` - State refactor deep dive

---

## 🎓 Study Method: Trace & Document

### Recommended Approach

1. **Start with data flow** (user interaction → state → UI)
2. **Open 4-5 files side by side** (trace imports across files)
3. **Follow the call stack** (use browser DevTools, add breakpoints)
4. **Document what you learn** (write it in your own words)
5. **Explain to someone** (rubber duck debugging)

### Example Study Session: Metalness Slider

**Open these files:**
1. `src/components/features/Controls/sections/MaterialPropertiesSection.jsx` - UI slider
2. `src/components/features/Controls/Controls.jsx` - Handler passing
3. `src/App.jsx` - Hook usage
4. `src/hooks/useSceneState.js` - State definition
5. `src/features/sceneControls/ThreeScene.jsx` - 3D updates

**Trace the flow:**
```
1. User moves slider in MaterialPropertiesSection
   └─ File: MaterialPropertiesSection.jsx, line ~90
   
2. onChange event calls onMetalnessChange(newValue)
   └─ Prop passed from Controls.jsx
   
3. Controls.jsx passes setMetalness from App.jsx
   └─ File: Controls.jsx, line ~40
   
4. setMetalness comes from useSceneState hook
   └─ File: App.jsx, destructured from hook
   
5. useSceneState sets new metalness value
   └─ File: useSceneState.js, line ~10
   
6. App.jsx re-renders, passes new metalness to ThreeScene
   └─ File: App.jsx, ThreeScene props
   
7. ThreeScene updates 3D material
   └─ File: ThreeScene.jsx, useMaterialUpdates hook
```

---

## 🧪 Hands-On Exercises

### Exercise 1: Add a New State Variable

**Goal:** Understand the custom hook pattern

**Steps:**
1. Open `src/hooks/useSceneState.js`
2. Add a new state: `const [fogIntensity, setFogIntensity] = useState(0);`
3. Add to return object: `fogIntensity, setFogIntensity,`
4. Open `src/App.jsx`
5. Destructure the new state: `fogIntensity, setFogIntensity,`
6. Pass to ThreeScene: `<ThreeScene fogIntensity={fogIntensity} ... />`
7. Test that it works

**What you learned:**
- How custom hooks encapsulate state
- How to extend the state management system
- Component re-render triggers

---

### Exercise 2: Convert a Relative Import to Path Alias

**Goal:** Master the path alias system

**Steps:**
1. Find a file with relative imports (e.g., `src/components/features/Showcase/ShowcaseGallery.jsx`)
2. Identify imports like `import NavBar from '../../layout/NavBar/NavBar';`
3. Convert to: `import NavBar from '@/components/layout/NavBar/NavBar';`
4. Verify VS Code autocomplete works (type `@/` and see suggestions)
5. Run dev server, ensure no errors

**What you learned:**
- How path aliases work
- Benefits of absolute imports
- Build-time module resolution

---

### Exercise 3: Test the Error Boundary

**Goal:** Understand error handling

**Steps:**
1. Create a test component that throws:
```jsx
// src/components/BuggyComponent.jsx
function BuggyComponent() {
  throw new Error('Test error!');
  return <div>This won't render</div>;
}
```
2. Import in App.jsx: `import BuggyComponent from '@/components/BuggyComponent';`
3. Add to JSX: `<BuggyComponent />`
4. Check browser - should see error boundary fallback UI
5. Click "Try Again" - note what happens
6. Click "Go Home" - navigate away
7. Remove BuggyComponent

**What you learned:**
- How error boundaries catch errors
- Fallback UI behavior
- Error recovery mechanisms

---

### Exercise 4: Find Remaining Duplicate Code

**Goal:** Apply DRY principle

**Steps:**
1. Search project for functions that appear in multiple files
2. Look for similar patterns (e.g., color parsing, validation)
3. Identify potential shared utilities
4. Propose consolidation (don't implement yet)
5. Document findings

**What you learned:**
- How to identify duplication
- When to extract shared functions
- Code organization principles

---

### 5. Architecture Flattening (Nov 15, 2025)

**What**: Consistent folder structure across entire codebase

**Files to Study:**
- `README.md` (lines 293-443) - Complete updated project structure
- `src/hooks/` folder - All custom hooks in one place
- `src/styles/` folder - All styles in one place
- `src/utils/` folder - All utilities in one place
- `src/components/ui/` folder - All reusable UI components

**Key Questions:**
- Why did HomePage have its own hooks/styles/utils folders?
- What's the difference between `/shared/` and `/ui/`? (Answer: Nothing now - merged!)
- Where do page-specific components go? (Answer: In page's `components/` subfolder)
- Where do shared utilities go? (Answer: Top-level `/utils/`)
- Why is consistency important in folder structure?

**Architecture Pattern:**
```
✅ GOOD (After Nov 15 refactor):
src/
├── hooks/              ← ALL custom hooks (shared)
├── styles/             ← ALL styles (shared)
├── utils/              ← ALL utilities (shared)
└── components/
    ├── ui/             ← ALL reusable UI (merged shared/)
    └── pages/
        ├── HomePage/
        │   └── components/   ← Only HomePage-specific components
        ├── MyScenesPage/
        │   └── components/   ← Only MyScenesPage-specific components
        └── Showcase/
            └── components/   ← Only Showcase-specific components

❌ BAD (Before Nov 15 - inconsistent):
src/
├── hooks/              ← Some hooks
├── styles/             ← Some styles
├── utils/              ← Some utils
└── components/
    ├── shared/         ← Confusing: what goes here vs ui/?
    ├── ui/             ← Confusing: what goes here vs shared/?
    └── pages/
        ├── HomePage/
        │   ├── hooks/        ← More hooks? Inconsistent!
        │   ├── styles/       ← More styles? Inconsistent!
        │   ├── utils/        ← More utils? Inconsistent!
        │   └── components/
        ├── MyScenesPage/
        │   └── components/   ← Only components (different from HomePage)
        └── Showcase/
            └── components/   ← Only components (different from HomePage)
```

**What Moved:**
```
HomePage/hooks/useParallax.js        → /src/hooks/useParallax.js
HomePage/hooks/useQuantumState.js    → /src/hooks/useQuantumState.js
HomePage/styles/homepage.scss        → /src/styles/homepage.scss
HomePage/styles/titles.scss          → /src/styles/titles.scss
HomePage/utils/portalWorlds.js       → /src/utils/portalWorlds.js
HomePage/utils/quantumCollapse.js    → /src/utils/quantumCollapse.js
components/shared/ErrorBoundary/     → /src/components/ui/ErrorBoundary/
components/shared/HomeBackground/    → /src/components/ui/HomeBackground/
components/shared/Quote/             → /src/components/ui/Quote/
```

**Hands-On Exercise:**
1. Open `README.md` and find the project structure section
2. Notice how ALL pages now have same pattern (components/ only)
3. Open `src/hooks/` folder - see useParallax, useQuantumState, useSceneState
4. Open `src/components/ui/` - see all reusable components in one place
5. Try to find `/shared/` folder - it doesn't exist anymore!

**Impact Analysis:**
- ✅ **Predictable**: Every page follows same pattern
- ✅ **Scalable**: New pages know exactly where things go
- ✅ **Clear separation**: Top-level = shared, page-level = page-specific
- ✅ **Less confusion**: Only one place for reusable UI (/ui/)
- ✅ **Git history preserved**: Used `git mv` to preserve file history

**Decision Rules:**
```
Q: Where do I put a new custom hook?
A: /src/hooks/ (top-level, always)

Q: Where do I put a new reusable UI component?
A: /src/components/ui/ (no more /shared/)

Q: Where do I put a HomePage-specific component?
A: /src/components/pages/HomePage/components/

Q: Where do I put a shared utility function?
A: /src/utils/ (top-level, always)

Q: Where do I put page-specific styles?
A: /src/styles/ with page prefix (e.g., homepage.scss)
```

---

## 🎯 Study Checklist

After completing this guide, you should be able to:

### Understanding
- [ ] Explain what path aliases are and why they're useful
- [ ] Describe the useSceneState hook and its organization
- [ ] Articulate why DRY principle matters
- [ ] Explain error boundary lifecycle methods
- [ ] Describe how environment variables work in Vite
- [ ] **Explain the flattened architecture pattern and its benefits**
- [ ] **Identify where to put new hooks/styles/utils/components**

### Application
- [ ] Convert a relative import to path alias
- [ ] Add a new state variable to useSceneState
- [ ] Trace data flow from UI event to 3D scene update
- [ ] Identify duplicate code in the project
- [ ] Create an error boundary for a specific feature
- [ ] **Place a new file in the correct folder following architecture pattern**
- [ ] **Migrate a page-specific file to top-level if it becomes shared**

### Communication
- [ ] Explain refactoring decisions to a technical interviewer
- [ ] Walk through the project structure with a new developer
- [ ] Justify architectural choices (hooks vs context, shared utils vs duplication)
- [ ] Present a complete data flow diagram
- [ ] Answer "why did you refactor this way?"
- [ ] **Articulate the consistency principle in folder structure**
- [ ] **Explain when to use page-level vs top-level folders**

---

## 📚 Next Steps

1. **Read** `REFACTORING_CHANGELOG.md` for detailed before/after comparisons
2. **Work through** `CLAUDE_STUDY_PROMPT.md` to trace specific data flows
3. **Complete** `STUDY_PLAN_V2.md` for structured learning path
4. **Practice** explaining each concept out loud
5. **Build** a new feature using these patterns
6. **Review** the updated project structure in README.md

---

**Created**: November 14, 2025  
**Last Updated**: November 15, 2025 (Architecture Flattening Update)
**Related Docs**: REFACTORING_CHANGELOG.md, CLAUDE_STUDY_PROMPT.md, STUDY_PLAN_V2.md
