# index.css Shared Styles Analysis

## CSS Import Structure (from code inspection)

### main.jsx

```jsx
import "./index.css"; // ← GLOBAL ENTRY POINT
```

### App.jsx

```jsx
import "./cursor-override.module.scss";
import sharedStyles from "./styles/shared.module.scss";
```

### NavBar.jsx (Component used in App.jsx)

```jsx
import "./nav.css"; // ← SEPARATE NAV FILE (has its own styles)
import sharedStyles from "../../../styles/shared.module.scss";
```

### Page Components Import:

- **HomePage**: `import styles from './HomeIndex.module.scss'`
- **LoginPage**: `import "./LoginPage.css"` + `import "../../layout/NavBar/nav.css"` + `import homeStyles from "../HomePage/HomeIndex.module.scss"`
- **SignUpPage**: `import "./SignUpPage.css"` + `import "../../layout/NavBar/nav.css"` + `import homeStyles from "../HomePage/HomeIndex.module.scss"`
- **MyScenesPage**: `import "./MyScenesPage.css"` + `import "../../layout/NavBar/nav.css"` + `import sharedStyles from "../../../styles/shared.module.scss"` + `import homeStyles from "../HomePage/HomeIndex.module.scss"`

### Key Finding:

**nav.css is SEPARATE from index.css** - it's imported directly by NavBar component and multiple pages!

---

## Shared Across Multiple Pages

### 1. **Navigation Bar** (All pages)

**Classes used in:** HomePage, LoginPage, SignUpPage, MyScenesPage, GeomLab

- `.quantum-nav`
- `.quantum-nav.geom-lab-navbar` (variant)
- `.nav-logo`
- `.logo-text`
- `.logo-particles`
- `.nav-links`
- `.nav-link`
- `.nav-link--home` (variant)
- `.nav-quantum-field`
- `.nav-terminal`
- `.nav-inverted-a`

**Status:** ✅ TRULY SHARED - Keep in global styles

---

### 2. **Title Effects** (HomePage, LoginPage, SignUpPage)

**Classes used in:** HomePage, LoginPage, SignUpPage

- `.title-word` (HomePage uses data attributes)
- `.title-word-left` (LoginPage, SignUpPage)
- `.title-word-right` (LoginPage, SignUpPage)
- `.title-glow`
- `.title-char`
- `.title-inverted-v`
- `.title-separator`
- `.slashed-zero`

**Status:** ✅ TRULY SHARED - Keep in global styles

---

### 3. **BeamScanButton Component** (HomePage, LoginPage, SignUpPage)

**Component:** `<BeamScanButton />` from `/features/HUD`
**Classes in index.css:**

- `.beam-btn`
- `.beam-btn-label`
- `.beam-btn-code`
- `.beam-btn::after`

**Status:** ✅ TRULY SHARED - Keep in global styles (component has its own module.scss too)

---

### 4. **Cursor System** (All pages via App.jsx)

**Classes:**

- `.cursor`
- `.quantum-cursor-container`
- `.gravity-field`
- `.wormhole`
- `.dimensional-rift`
- `.quantum-particle`
- `.energy-wave`

**Status:** ✅ TRULY SHARED - Keep in global styles

---

### 5. **Parallax Background Layers** (LoginPage, SignUpPage, MyScenesPage)

**Classes:**

- `.parallax-bg-layer`
- `.parallax-fg-layer`
- `.bg-gallery-layer`
- `.bg-gallery-reality`

**Status:** ✅ TRULY SHARED - Keep in global styles

---

## Page-Specific (NOT in index.css)

### HomePage Only

- `.hero-stats`
- `.quantum-console`
- `.scene-*` classes
- `.entanglement-network`
- Most are in `HomeIndex.module.scss`

### LoginPage Only

- `.login-*` classes (in LoginPage.css)

### SignUpPage Only

- `.signup-*` classes (in SignUpPage.css)

---

## Animation Keyframes (in index.css)

### Shared Animations:

- `@keyframes mysteriousFadeIn` - body fade in
- `@keyframes navScan` - nav bar scan effect
- `@keyframes titleFloat` - title floating
- `@keyframes titleFloatLayer1/2/3` - parallax title layers
- `@keyframes simpleFadeIn` - generic fade
- `@keyframes particleArrival*` - particle animations
- `@keyframes quantumTitleGlitch*` - title glitch effects
- `@keyframes quantumFloat` - general quantum float
- `@keyframes gradientShift` - gradient animation
- `@keyframes beam-bar-move` - beam button animation
- `@keyframes code-mask-bar` - beam button code mask
- `@keyframes glitchShift1/2` - glitch effects

**Status:** ✅ ALL SHARED - Keep in global animations file

---

## Recommendation for Modularization

### Files to Create:

1. **`styles/core/fonts.css`**

   - Font imports (@import Google Fonts)
   - @font-face declarations

2. **`styles/core/reset.css`**

   - `body` base styles
   - `body::before` (portal background)
   - Global pointer-events rules

3. **`styles/core/animations.css`**

   - All @keyframes

4. **`styles/layout/cursor.css`**

   - Cursor system classes

5. **`styles/layout/navigation.css`**

   - `.quantum-nav` and all nav-related classes

6. **`styles/shared/titles.css`**

   - `.title-word*` classes
   - `.title-glow`
   - `.title-char`
   - `.slashed-zero`
   - `.title-inverted-v`

7. **`styles/shared/buttons.css`**

   - `.beam-btn*` classes
   - (Note: BeamScanButton.module.scss has additional component-specific styles)

8. **`styles/shared/parallax.css`**

   - `.parallax-bg-layer`
   - `.parallax-fg-layer`
   - `.bg-gallery-*` classes

9. **`styles/theme/portal-background.css`**
   - Portal color CSS variables
   - Background gradients

---

## Summary

**Total Shared Components Identified:** 8 major groups
**Safe to Modularize:** Yes - all are globally scoped and multi-page
**Breaking Risk:** Low - using CSS @import maintains cascade order
**Recommended Approach:** Create modular files, import them in index.css

**Next Steps:**

1. Create directory structure
2. Split index.css by category
3. Update index.css to import new files
4. Test all pages (HomePage, LoginPage, SignUpPage, MyScenesPage, GeomLab)
5. Verify no visual regressions
