# CSS Modules + SCSS Migration Plan

**Goal:** Migrate all styles to CSS Modules + SCSS while following instructor requirements:

1. All handlers → `src/utils/` folder
2. Each component → own folder with `.jsx` + `.module.scss` together

**Status:** Planning Phase

---

## ✅ Prerequisites

- [x] Install `sass` package
- [ ] Create `src/utils/handlers/` directory structure
- [ ] Test migration on one simple component
- [ ] Validate app still works

---

## 🎯 Migration Strategy

### Phase 1: Setup & Test (LOW RISK)

**Start with simplest component to validate approach**

1. **CustomSelect** (✅ Already has its own folder)
   - Extract handlers → `src/utils/handlers/customSelectHandlers.js`
   - Rename `CustomSelect.css` → `CustomSelect.module.scss`
   - Update imports to use CSS Modules
   - Test functionality

### Phase 2: Small Components (LOW RISK)

2. **ScrambleButton**
3. **BeamScanButton**
4. **ExitButton**
5. **SaveButton**

### Phase 3: Medium Components (MEDIUM RISK)

6. **SceneCard**
7. **CustomCursor / QuantumCursor**
8. **Controls** (complex, many handlers)

### Phase 4: Large Components (HIGH RISK - Save for Last)

9. **NavBar**
10. **HomePage**
11. **ShowcaseGallery**
12. **MyScenesPage**

---

## 📋 Component Checklist

### Components Already in Folders (✅ Structure Good)

- [x] `CustomSelect/` - Has folder
- [x] `ScrambleButton/` - Has folder
- [x] `Controls/SaveButton/` - Has folder
- [x] `Controls/ExitButton/` - Has folder
- [x] `HUD/BeamScanButton/` - Has folder
- [x] `Scenes/` - Has folder (SceneCard)
- [x] `Effects/` - Has folder (CustomCursor, QuantumCursor)

### Components NOT in Folders (❌ Need Restructure)

- [ ] `Controls/Controls.jsx` - Needs `Controls/Controls/` folder
- [ ] `nav/NavBar.jsx` - Should be `components/NavBar/NavBar.jsx`
- [ ] `HomePage/HomePage.jsx` - Should be `pages/HomePage/HomePage.jsx` (already correct location)
- [ ] `Showcase/ShowcaseGallery.jsx` - Needs `Showcase/ShowcaseGallery/` folder

### Global Styles (Keep as Regular SCSS)

- `src/index.css` → `src/index.scss` (global reset/base styles)
- `src/styles/shared.css` → `src/styles/_shared.scss` (SCSS partial for variables/mixins)

---

## 🛠️ Migration Pattern

### Before (Current):

```
src/components/CustomSelect/
├── CustomSelect.jsx         # Component with handlers inside
└── CustomSelect.css         # Regular CSS
```

### After (Target):

```
src/
├── components/CustomSelect/
│   ├── CustomSelect.jsx            # Component (imports handlers from utils)
│   └── CustomSelect.module.scss    # CSS Modules + SCSS
└── utils/handlers/
    └── customSelectHandlers.js     # Extracted handlers
```

---

## 📝 Code Pattern Example

### 1. Extract Handlers to Utils

**Create:** `src/utils/handlers/customSelectHandlers.js`

```javascript
/**
 * Handler for clicking outside dropdown to close it
 * @param {HTMLElement} selectRef - Ref to select container
 * @param {Function} setIsOpen - State setter for dropdown open state
 */
export const createClickOutsideHandler = (selectRef, setIsOpen) => {
  return (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
};

/**
 * Handler for selecting an option
 * @param {Function} onChange - Callback when value changes
 * @param {Function} setIsOpen - State setter for dropdown open state
 */
export const createSelectHandler = (onChange, setIsOpen) => {
  return (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };
};
```

### 2. Convert CSS to CSS Module + SCSS

**Rename:** `CustomSelect.css` → `CustomSelect.module.scss`

```scss
// Variables (later move to shared partial)
$select-border-color: rgba(255, 255, 255, 0.2);
$select-bg: rgba(0, 0, 0, 0.8);
$select-hover: rgba(255, 255, 255, 0.1);

.customSelect {
  position: relative;
  min-width: 200px;

  &__trigger {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    background: $select-bg;
    border: 1px solid $select-border-color;
    cursor: pointer;

    &.open {
      border-color: cyan;
    }

    &:hover {
      background: $select-hover;
    }
  }

  &__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: $select-bg;
    border: 1px solid $select-border-color;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
  }

  &__option {
    padding: 8px 12px;
    cursor: pointer;

    &:hover {
      background: $select-hover;
    }

    &.selected {
      background: rgba(0, 255, 255, 0.2);
    }
  }
}
```

### 3. Update Component to Use CSS Modules + Utils

**Update:** `CustomSelect.jsx`

```jsx
import React, { useState, useRef, useEffect } from "react";
import {
  createClickOutsideHandler,
  createSelectHandler,
} from "../../utils/handlers/customSelectHandlers";
import styles from "./CustomSelect.module.scss";

const CustomSelect = ({ value, onChange, options, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Use handler from utils
  useEffect(() => {
    const handleClickOutside = createClickOutsideHandler(selectRef, setIsOpen);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Use handler from utils
  const handleSelect = createSelectHandler(onChange, setIsOpen);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={styles.customSelect} ref={selectRef}>
      <div
        className={`${styles.customSelect__trigger} ${
          isOpen ? styles.open : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.customSelect__value}>
          {selectedOption?.label}
        </span>
        <span className={styles.customSelect__arrow}>{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className={styles.customSelect__dropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.customSelect__option} ${
                option.value === value ? styles.selected : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
```

---

## 🚨 Safety Rules

1. **NEVER migrate more than one component per commit**
2. **ALWAYS test the app after each migration**
3. **Use git to track changes** - easy rollback if something breaks
4. **Start with simplest components first**
5. **Keep old CSS files until migration is complete and tested**

---

## 🎨 SCSS Benefits We'll Gain

### Variables

```scss
// _variables.scss
$color-primary: cyan;
$color-secondary: magenta;
$glass-bg: rgba(0, 0, 0, 0.8);
$glass-border: rgba(255, 255, 255, 0.2);
```

### Nesting

```scss
.controls {
  &__section {
    &--open {
      // Deep nesting made easy
    }
  }
}
```

### Mixins

```scss
@mixin glass-morphism {
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.card {
  @include glass-morphism;
}
```

---

## 📊 Progress Tracking

- [x] Phase 1: Setup + Test with CustomSelect ✅ **COMPLETE**

  - [x] Install sass package
  - [x] Create utils/handlers directory
  - [x] Extract CustomSelect handlers to utils
  - [x] Convert CustomSelect.css → CustomSelect.module.scss
  - [x] Update component to use CSS Modules + utils
  - [x] Test app - NO ERRORS ✅

- [x] Phase 2: Controls Component ✅ **COMPLETE** (Commit: 3ada85e)

  - [x] Migrate Controls/controls.css → Controls.module.scss (600+ lines)
  - [x] Update all className attributes to use CSS Modules syntax
  - [x] Convert kebab-case classes to camelCase (controls-toggle-btn → controlsToggleBtn)
  - [x] Preserve all complex styling: animations, gradients, scrollbars, responsiveness
  - [x] Test app - NO VISUAL CHANGES ✅

- [ ] Phase 3: Effects Components (2 components)

  - [ ] CustomCursor.css → CustomCursor.module.scss
  - [ ] QuantumCursor.css → QuantumCursor.module.scss

- [ ] Phase 4: Scene Components (1 component)

  - [ ] SceneCard.css → SceneCard.module.scss

- [ ] Phase 5: Large Page Components (4 components)

  - [ ] NavBar (nav.css)
  - [ ] HomePage
  - [ ] ShowcaseGallery
  - [ ] MyScenesPage/LoginPage/SignUpPage

- [ ] Create shared SCSS partials (\_variables, \_mixins, \_functions)
- [ ] Update global styles to SCSS
- [ ] Remove old .css files

---

---

## 🎨 Shared Styling Architecture

### Nav Link Styles (Unified)

**Location:** `src/nav/nav.css`

All navigation links share a common base style defined in `nav.css`:

- `.nav-link` - Base cyan color, hover magenta
- `.nav-link--home` - Brighter gold with glow for visual priority (matches LOGOUT brightness)
- `.nav-terminal .terminal-cursor` - LOGOUT button style (cyan, hover magenta glow)

**Pages using shared nav styles:**

- `NavBar.jsx` (shared component)
- `HomePage.jsx` (inline nav)
- `MyScenesPage.jsx` (inline nav)
- `LoginPage.jsx` (inline nav)
- `SignUpPage.jsx` (inline nav)

**Implementation notes:**

- Page-specific CSS (e.g., `LoginPage.css`) must import `nav.css` if rendering inline nav
- Use increased specificity (`.nav-links .nav-link.nav-link--home`) + `!important` to override page-level `.nav-link` rules
- HOME link uses `nav-link--home` class for gold accent and brightness boost

### Background System (Shared Geometry)

**Common patterns across Home, Scenes, and Showcase:**

1. **Parallax layers** (fixed position):

   - `.parallax-bg-layer` (z-index: -2)
   - `.parallax-fg-layer` (z-index: -1)
   - Both use SVG gradients reactive to portal/quantum state colors
   - Bottom-edge fade via `mask-image` to avoid horizontal banding

2. **Geometric clip-path backgrounds** (match Home's diagonal cuts):

   - `.bg-gallery-reality` - Top/bottom diagonal
   - `.bg-gallery-probability` - Offset top angle
   - `.bg-gallery-entanglement` - Bottom-right diagonal
   - `.bg-gallery-superposition` - Aggressive bottom-left angle

3. **Base gradient** (neutral, consistent):
   ```css
   background: linear-gradient(120deg, #0a0f1a 60%, #1a2a3a 100%),
     repeating-linear-gradient(-30deg, #00f0ff22 0 2px, transparent 2px 40px);
   ```

**Pages using shared background system:**

- `HomePage.jsx` - Multiple layered sections with clip-paths
- `MyScenesPage.jsx` - Single `.bg-gallery-reality` layer
- `ShowcaseGallery.jsx` - Layered sections at 0/100/200/300vh offsets

**Showcase-specific additions:**

- Scroll-based parallax fade (opacity decreases with scroll)
- Motion dampening (parallax effect tapers as user scrolls down)
- Container-scoped scroll (not body scroll) for snap points

---

## Next Action

**Start with CustomSelect migration** - it's:

- Already in its own folder ✅
- Has only 2 handlers (easy to extract)
- Self-contained (low risk)
- Small file (~50 lines)

Would you like me to proceed with migrating CustomSelect as a test case?
