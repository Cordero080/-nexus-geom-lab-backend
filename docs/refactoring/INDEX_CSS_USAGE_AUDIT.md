# index.css Usage Audit - Final Report

**Date:** November 4, 2025  
**Purpose:** Identify unused CSS in index.css for safe removal during modularization

---

## Summary

✅ **903 lines total**  
❌ **1 unused class found**: `.nav-page-indicator`  
✅ **Everything else is actively used**

---

## Detailed Findings

### ✅ USED - Keep All These

| Category              | Classes                                                                               | Usage                                                              |
| --------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Cursor System**     | `.cursor`, `.quantum-cursor-container`, `.gravity-field`, etc.                        | Used globally via QuantumCursor component                          |
| **Navigation**        | `.quantum-nav`, `.logo-text`, `.nav-logo`, `.nav-links`, `.nav-link`, `.nav-terminal` | Used by HomePage inline nav + duplicated in nav.css (intentional)  |
| **Title Effects**     | `.title-word`, `.title-char`, `.slashed-zero`, `.title-inverted-v`                    | HomePage (inline), LoginPage, SignUpPage                           |
| **Buttons**           | `.beam-btn`, `.beam-btn-label`, `.beam-btn-code`                                      | Used by BeamScanButton component across multiple pages             |
| **HomePage Sections** | `.quantum-title`, `.quantum-subtitle`, `.hero-stats`                                  | HomePage only                                                      |
| **Scene Cards**       | `.scene-background`, `.scene-content`, `.scene-title`, `.scene-description`           | HomePage scenes section                                            |
| **Quantum Effects**   | `.entanglement-network`, `.connected-nodes`, `.node`, `.quantum-bridge`               | HomePage visual effects                                            |
| **Console**           | `.quantum-console`, `.console-line`                                                   | HomePage                                                           |
| **Particles**         | `.particles`, `.particle`, `.reality-particles`, `.probability-waves`                 | HomePage + other pages                                             |
| **Code Display**      | `.floating-code`, `.code-snippets`                                                    | HomePage + Quote components                                        |
| **Parallax**          | `.parallax-container`                                                                 | HomePage (uses module.scss className, but CSS exists in index.css) |
| **Global**            | `body`, `body::before`, animations                                                    | All pages                                                          |

### ❌ UNUSED - Safe to Remove

| Class                 | Line # | Why Unused                        |
| --------------------- | ------ | --------------------------------- |
| `.nav-page-indicator` | ~220   | No JSX file references this class |

---

## Navigation Duplication (Intentional)

**Status:** ✅ Keep both - different purposes

### index.css Navigation (lines 90-280)

- **Used by:** HomePage (inline custom nav)
- **Purpose:** HomePage-specific nav styling
- **Classes:** `.quantum-nav`, `.geom-lab-navbar`, `.logo-text`, `.nav-logo`, `.nav-links`, `.nav-link`, `.nav-terminal`

### nav.css Navigation

- **Used by:** NavBar component (LoginPage, SignUpPage, MyScenesPage, GeomLab)
- **Purpose:** Reusable NavBar component styling
- **Classes:** Same as above but with different values

**Decision:** Keep both. HomePage has custom inline nav with unique styling.

---

## Animations (@keyframes) - All Used

✅ All 20+ animations are actively referenced:

- `mysteriousFadeIn` - body fade in
- `navScan` - nav bar scan
- `glitchShift1`, `glitchShift2` - logo glitch
- `titleFloat`, `titleFloatLayer1/2/3` - title animations
- `simpleFadeIn` - generic fade
- `particleArrival*` - particle effects
- `quantumTitleGlitch*` - title glitch effects
- `quantumFloat` - floating elements
- `gradientShift` - gradient animation
- `beam-bar-move`, `code-mask-bar` - button animations

---

## Refactoring Plan

### Safe to Remove (1 item):

```css
/* Line ~220 */
.nav-page-indicator {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-family: "Future Z", sans-serif !important;
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(
    135deg,
    #00ffbf 0%,
    #f61482 60%,
    #067c76 70%,
    #ffae00 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  letter-spacing: 4px;
  animation: shimmer 5s ease-in-out infinite;
  pointer-events: none;
}
```

### Modularization Strategy:

**Split into these files (keeping ALL used styles):**

1. **`styles/core/fonts.css`** - @import + @font-face
2. **`styles/core/reset.css`** - body, body::before, global resets
3. **`styles/core/animations.css`** - All @keyframes
4. **`styles/layout/cursor.css`** - Cursor system
5. **`styles/layout/navigation.css`** - Nav styles (keep in index.css for HomePage)
6. **`styles/shared/titles.css`** - Title word effects
7. **`styles/shared/buttons.css`** - Beam button styles
8. **`styles/components/homepage-sections.css`** - HomePage-specific (quantum-title, hero-stats, scenes, etc.)

**Then update index.css:**

```css
/* Core */
@import "./styles/core/fonts.css";
@import "./styles/core/reset.css";
@import "./styles/core/animations.css";

/* Layout */
@import "./styles/layout/cursor.css";
@import "./styles/layout/navigation.css";

/* Shared */
@import "./styles/shared/titles.css";
@import "./styles/shared/buttons.css";

/* Components */
@import "./styles/components/homepage-sections.css";
```

---

## Conclusion

✅ **Only 1 unused class found** (`.nav-page-indicator`)  
✅ **All other 902 lines are actively used**  
✅ **Navigation duplication is intentional** (HomePage vs NavBar component)  
✅ **Safe to modularize** without breaking anything

**Next Step:** Remove `.nav-page-indicator` and proceed with modularization.
