# CSS Architecture Guide

## Overview

Nexus Geom Lab uses a **hybrid CSS architecture** combining global styles (via `index.css`) and component-scoped CSS Modules (`.module.scss` files).

---

## 🎨 Architecture Pattern

```
Global Styles (index.css)
    ↓
Organized by @import structure
    ↓
Component-Scoped Styles (.module.scss)
    ↓
Prevents style conflicts & enables modular design
```

---

## 📁 Global Styles Structure

### index.css - Central Import Hub

**Location:** `src/index.css`

**Purpose:** Single entry point for all global styles, organized by concern.

```css
/* ============================================
   Modular CSS Architecture
   
   Organization:
   - core/: Foundation (fonts, reset, animations)
   - layout/: Structural components (cursor, navigation)
   - shared/: Reusable UI elements (titles, buttons)
   - components/: Page-specific styles (homepage)
   ============================================ */

/* Core Foundation */
@import "./styles/core/fonts.css";
@import "./styles/core/reset.css";
@import "./styles/core/animations.css";

/* Layout Components */
@import "./styles/layout/cursor.css";
@import "./styles/layout/navigation.css";

/* Shared UI Elements */
@import "./styles/shared/titles.css";
@import "./styles/shared/buttons.css";

/* Page-Specific Components */
@import "./styles/components/homepage.css";
```

---

## 📂 Global Styles Breakdown

### 1. core/ - Foundation Layer

**Purpose:** Base styles that apply across the entire application.

```
styles/core/
├── fonts.css       → Font-face declarations, font-family definitions
├── reset.css       → CSS reset, normalize, box-sizing defaults
└── animations.css  → Keyframe animations, global animation utilities
```

**When to use:**

- Font imports (Google Fonts, custom fonts)
- Global CSS resets
- Reusable @keyframes animations
- CSS custom properties (variables)

**Example:**

```css
/* fonts.css */
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");

:root {
  --font-primary: "Orbitron", sans-serif;
}
```

---

### 2. layout/ - Structural Layer

**Purpose:** Styles for structural elements that appear across multiple pages.

```
styles/layout/
├── cursor.css      → Custom cursor styles
└── navigation.css  → Navigation bar, header, footer
```

**When to use:**

- Custom cursor effects
- Global navigation styles
- Layout grids/containers used across pages
- Scroll behavior

**Example:**

```css
/* cursor.css */
body {
  cursor: url("/cursor.png"), auto;
}

.clickable {
  cursor: pointer;
}
```

---

### 3. shared/ - Shared UI Layer

**Purpose:** Reusable UI patterns used across multiple features.

```
styles/shared/
├── titles.css      → Heading styles, quantum titles
└── buttons.css     → Global button styles, hover effects
```

**When to use:**

- Title/heading patterns
- Button base styles (before component overrides)
- Shared UI utilities
- Common color schemes

**Example:**

```css
/* titles.css */
.quantum-title {
  font-family: var(--font-primary);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #00ffff;
}
```

---

### 4. components/ - Page-Specific Layer

**Purpose:** Styles specific to particular pages that don't fit CSS Modules.

```
styles/components/
└── homepage.css    → Homepage-specific global styles
```

**When to use:**

- Page-specific animations
- Complex background effects
- Styles that need to be global for the page

**Example:**

```css
/* homepage.css */
.quantum-background {
  background: radial-gradient(circle at center, #1a1a2e, #0a0a0f);
  animation: quantum-pulse 4s ease-in-out infinite;
}
```

---

## 🧩 CSS Modules Pattern

### What are CSS Modules?

Files ending in `.module.scss` are **scoped to their component**, preventing global namespace pollution.

### Benefits:

✅ **No naming conflicts** - Styles are locally scoped  
✅ **Clear ownership** - Each component owns its styles  
✅ **Easy to refactor** - Delete component → styles go with it  
✅ **Type safety** - Import as object with IntelliSense

---

## 📍 CSS Modules Usage by Component Type

### features/ Components

**Pattern:** Each feature folder contains its own `.module.scss`

```
features/
├── Controls/
│   ├── Controls.jsx
│   └── Controls.module.scss        → Scoped to Controls
│
├── SaveButton/
│   ├── SaveButton.jsx
│   └── SaveButton.module.scss      → Scoped to SaveButton
│
└── SceneCard/
    ├── SceneCard.jsx
    └── SceneCard.module.scss       → Scoped to SceneCard
```

**Example Usage:**

```jsx
import styles from "./Controls.module.scss";

export default function Controls() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Controls</h2>
      <div className={styles.controlGroup}>{/* controls */}</div>
    </div>
  );
}
```

**Generated HTML:**

```html
<div class="Controls_container__x7z9m">
  <h2 class="Controls_title__k3p2a">Controls</h2>
  <div class="Controls_controlGroup__m4n8q"></div>
</div>
```

---

### pages/ Components

**Pattern:** Page components use CSS Modules for page-specific layout.

```
pages/
├── HomePage/
│   ├── HomePage.jsx
│   ├── HomePage.module.scss        → Scoped to HomePage
│   └── HomeIndex.module.scss       → Alternative index styles
│
└── MyScenesPage/
    ├── MyScenesPage.jsx
    └── MyScenesPage.module.scss    → Scoped to MyScenesPage
```

**Example:**

```scss
// HomePage.module.scss
.heroSection {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.title {
  font-size: 4rem;
  color: var(--quantum-purple);
  animation: fadeIn 1s ease-in;
}
```

---

### shared/ Components

**Pattern:** Shared components use CSS Modules for reusability.

```
shared/
├── ProgressBar/
│   ├── ProgressBar.jsx
│   └── ProgressBar.module.scss
│
└── SuccessModal/
    ├── SuccessModal.jsx
    └── SuccessModal.module.scss
```

**Why CSS Modules here?**

- Prevents conflicts when used in multiple features
- Each instance is styled consistently
- Easy to override via props + additional classes

---

### ui/ Components

**Pattern:** Pure UI components with CSS Modules.

```
ui/
├── CustomSelect/
│   ├── CustomSelect.jsx
│   └── CustomSelect.module.scss
│
└── Modals/
    ├── SuccessModal.jsx
    └── SuccessModal.module.scss
```

---

## 🎯 When to Use Global vs Modules

### Use GLOBAL styles (index.css) when:

- ✅ Fonts and typography (font-face)
- ✅ CSS resets and normalizers
- ✅ Global animations (@keyframes)
- ✅ CSS custom properties (variables)
- ✅ Body/html base styles
- ✅ Custom cursor effects
- ✅ Cross-page layouts (navigation, footer)

### Use CSS MODULES when:

- ✅ Component-specific styles
- ✅ Unique layouts per component
- ✅ Preventing naming conflicts
- ✅ Styles that move with component
- ✅ Feature-specific designs

---

## 🧪 Real-World Example

### Scenario: Styling a New Feature

**Task:** Create a "FavoritesButton" component

**Step 1: Create Files**

```
features/FavoritesButton/
├── FavoritesButton.jsx
└── FavoritesButton.module.scss
```

**Step 2: Write Scoped Styles**

```scss
// FavoritesButton.module.scss
.button {
  background: transparent;
  border: 2px solid var(--quantum-purple);
  color: var(--quantum-purple);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--quantum-purple);
    color: white;
    transform: translateY(-2px);
  }
}

.icon {
  margin-right: 0.5rem;
  transition: transform 0.3s ease;
}

.button:hover .icon {
  transform: scale(1.2) rotate(15deg);
}
```

**Step 3: Import and Use**

```jsx
import styles from "./FavoritesButton.module.scss";
import { Star } from "lucide-react";

export default function FavoritesButton({ onClick }) {
  return (
    <button className={styles.button} onClick={onClick}>
      <Star className={styles.icon} />
      Add to Favorites
    </button>
  );
}
```

---

## 🎨 Naming Conventions

### Global CSS (index.css imports)

```css
/* Use kebab-case for class names */
.quantum-title {
}
.control-panel {
}
.hero-section {
}
```

### CSS Modules (.module.scss)

```scss
/* Use camelCase for class names */
.heroSection {
}
.controlPanel {
}
.quantumTitle {
}

/* Nested selectors with & */
.button {
  &:hover {
  }
  &.active {
  }
  &.disabled {
  }
}
```

---

## 🔧 SCSS Features Available

### Variables (CSS Custom Properties)

```scss
:root {
  --quantum-purple: #aa00ff;
  --quantum-cyan: #00ffff;
  --spacing-unit: 8px;
}

.component {
  color: var(--quantum-purple);
  padding: calc(var(--spacing-unit) * 2);
}
```

### Nesting

```scss
.card {
  background: white;

  .title {
    font-size: 1.5rem;
  }

  .content {
    padding: 1rem;

    p {
      margin-bottom: 0.5rem;
    }
  }
}
```

### Parent Selector (&)

```scss
.button {
  background: blue;

  &:hover {
    background: darkblue;
  }

  &.primary {
    background: purple;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

---

## 📊 CSS Organization Best Practices

### 1. One Component = One Module File

```
✅ Good:
features/SaveButton/
├── SaveButton.jsx
└── SaveButton.module.scss

❌ Bad:
features/SaveButton/
├── SaveButton.jsx
├── button.module.scss
├── modal.module.scss
└── form.module.scss
```

### 2. Keep Global Styles Minimal

**Global styles should only include:**

- Foundational styles (fonts, reset)
- Truly global utilities
- Base theme variables

**Everything else → CSS Modules**

### 3. Avoid Deep Nesting

```scss
✅Good (2-3 levels max): .card {
  .header {
    .title {
    }
  }
}

❌Bad (too deep): .card {
  .container {
    .wrapper {
      .header {
        .title {
          .text {
          }
        }
      }
    }
  }
}
```

### 4. Use Composition Over Inheritance

```scss
// Don't duplicate styles
❌ Bad:
.button { /* 20 lines */ }
.primaryButton { /* same 20 lines + extras */ }

// Compose in JSX instead
✅ Good:
.button { /* base styles */ }
.primary { /* additional styles */ }

// In component:
<button className={`${styles.button} ${styles.primary}`}>
```

---

## 🚀 Migration Strategy

### If You Need to Add Global Styles

1. **Determine category:** core, layout, shared, or components?
2. **Create or update file** in appropriate `styles/` folder
3. **Add @import** to `index.css`
4. **Use kebab-case** class names

### If You Need Component Styles

1. **Create `.module.scss`** next to component
2. **Use camelCase** class names
3. **Import and use** scoped styles
4. **No @import needed** in index.css

---

## 📝 Current State Summary

### Global Styles (8 files):

- ✅ **core/**: fonts.css, reset.css, animations.css
- ✅ **layout/**: cursor.css, navigation.css
- ✅ **shared/**: titles.css, buttons.css
- ✅ **components/**: homepage.css

### CSS Modules (~60 files):

- ✅ Component-scoped across features/, pages/, shared/, ui/
- ✅ Prevents conflicts
- ✅ Colocated with components

---

## 🎓 Key Takeaways

1. **Global for foundation**, modules for components
2. **index.css is organized** by @import structure
3. **CSS Modules prevent conflicts** and improve maintainability
4. **Colocation** keeps styles with components
5. **Use SCSS features** (nesting, &, variables)
6. **Naming matters**: kebab-case (global), camelCase (modules)

This architecture supports **scalability**, **maintainability**, and **developer experience** as the project grows.
