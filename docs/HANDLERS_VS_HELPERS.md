# Project Structure Guide: Handlers vs Helpers

## 📚 Understanding the Difference

### HANDLERS (Event Handlers)

**Definition:** Functions that respond to user interactions and UI events.

**Characteristics:**

- Handle user events: `onClick`, `onChange`, `onMouseMove`, `onSubmit`, etc.
- Transform UI events into state updates or actions
- Often have side effects (updating state, calling APIs)
- Specific to component behavior
- **NOT reusable** across different components

**Examples:**

```javascript
// Event handlers - respond to user actions
const handleMetalnessChange = (event) => {
  setMetalness(event.target.value);
};

const handleColorChange = (event) => {
  setColor(event.target.value);
};

const handleSubmit = (event) => {
  event.preventDefault();
  saveData(formData);
};

const handleClickOutside = (event) => {
  if (!ref.current.contains(event.target)) {
    setIsOpen(false);
  }
};
```

**Where they live:** **Co-located with the component**

```
src/components/CustomSelect/
├── CustomSelect.jsx
├── CustomSelect.module.scss
└── customSelectHandlers.js      ← Handlers HERE
```

---

### HELPERS (Utility Functions)

**Definition:** Pure functions for calculations, transformations, and data manipulation.

**Characteristics:**

- Pure functions (same input → same output, no side effects)
- No state manipulation
- No DOM interaction
- No event handling
- **Reusable** across multiple components
- Can be tested in isolation

**Examples:**

```javascript
// Helpers - pure utility functions

// Math calculations
export const calculateVertices = (radius, segments) => {
  const vertices = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    vertices.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    });
  }
  return vertices;
};

// Text transformation
export const scrambleText = (text) => {
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
  return text
    .split("")
    .map((char) =>
      Math.random() > 0.5
        ? char
        : chars[Math.floor(Math.random() * chars.length)]
    )
    .join("");
};

// Date formatting
export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Data validation
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

**Where they live:** **`src/utils/` folder**

```
src/utils/
├── geometryHelpers.js           ← Math/geometry utilities
├── textScrambler.js             ← Text transformation
├── dateFormatter.js             ← Date utilities
└── validators.js                ← Validation helpers
```

---

## 🎯 Quick Decision Guide

**Ask yourself: "What does this function do?"**

### Is it a HANDLER?

- ✅ Responds to user interaction (click, change, hover)
- ✅ Updates component state
- ✅ Has side effects
- ✅ Only used by this specific component
- **→ Co-locate with component**

### Is it a HELPER?

- ✅ Pure calculation or transformation
- ✅ No state updates
- ✅ No DOM manipulation
- ✅ Could be reused by other components
- **→ Put in `src/utils/`**

---

## 📁 Real-World Examples from Your Project

### Example 1: CustomSelect Component

**HANDLERS** (in `components/CustomSelect/customSelectHandlers.js`):

```javascript
// These respond to user events - co-located!
export const createClickOutsideHandler = (selectRef, setIsOpen) => {
  return (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false); // ← Side effect: updates state
    }
  };
};

export const createSelectHandler = (onChange, setIsOpen) => {
  return (optionValue) => {
    onChange(optionValue); // ← Side effect: calls callback
    setIsOpen(false); // ← Side effect: updates state
  };
};
```

**HELPERS** (in `utils/textScrambler.js`):

```javascript
// Pure function - can be reused anywhere!
export const scrambleText = (text) => {
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
  return text
    .split("")
    .map((char) =>
      Math.random() > 0.5
        ? char
        : chars[Math.floor(Math.random() * chars.length)]
    )
    .join("");
};

export const getScrambledText = () => {
  const codeSnippets = ["const x = 42;", "if (true) {...}", "function() { }"];
  return codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
};
```

---

### Example 2: ScrambleButton Component

**HANDLERS** (in `components/ScrambleButton/scrambleButtonHandlers.js`):

```javascript
// Mouse tracking - responds to user movement
export const createMouseMoveHandler = (buttonRef) => {
  return (e) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Side effect: updates CSS variables
    buttonRef.current.style.setProperty("--x", `${x}px`);
    buttonRef.current.style.setProperty("--y", `${y}px`);
  };
};

// Click handler with ripple effect
export const createClickHandler = (buttonRef, setRipples, onClick) => {
  return (e) => {
    // ... creates ripple effect (side effects)
    setRipples((prev) => [...prev, newRipple]); // ← Updates state
    onClick?.(e); // ← Calls callback
  };
};
```

**HELPERS** (already in `utils/geometryHelpers.js`):

```javascript
// Pure math functions - no side effects
export const calculateSphereVertices = (radius, segments) => {
  const vertices = [];
  for (let lat = 0; lat <= segments; lat++) {
    const theta = (lat * Math.PI) / segments;
    for (let lon = 0; lon <= segments; lon++) {
      const phi = (lon * 2 * Math.PI) / segments;
      vertices.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.cos(theta),
        z: radius * Math.sin(theta) * Math.sin(phi),
      });
    }
  }
  return vertices;
};
```

---

## 🏗️ Recommended Project Structure

```
src/
├── components/
│   ├── CustomSelect/
│   │   ├── CustomSelect.jsx
│   │   ├── CustomSelect.module.scss
│   │   └── customSelectHandlers.js       ← HANDLERS (event handling)
│   │
│   ├── ScrambleButton/
│   │   ├── ScrambleButton.jsx
│   │   ├── ScrambleButton.module.scss
│   │   └── scrambleButtonHandlers.js     ← HANDLERS (event handling)
│   │
│   └── Controls/
│       ├── Controls.jsx
│       ├── Controls.module.scss
│       └── controlsHandlers.js           ← HANDLERS (event handling)
│
└── utils/
    ├── geometryHelpers.js                ← HELPERS (math/geometry)
    ├── textScrambler.js                  ← HELPERS (text transformation)
    ├── dateFormatter.js                  ← HELPERS (date formatting)
    ├── validators.js                     ← HELPERS (validation logic)
    └── threeConstants.js                 ← HELPERS (constants)
```

---

## ✅ Benefits of This Structure

### Co-located Handlers

- **Easy to find:** All ScrambleButton code is in one place
- **Easy to delete:** Remove the whole folder when component is removed
- **Clear ownership:** These handlers belong to this component
- **Better for code splitting:** Bundlers can optimize per-component

### Centralized Helpers

- **Reusable:** One place for shared logic
- **Testable:** Pure functions are easy to test
- **Consistent:** Same logic used everywhere
- **DRY principle:** Don't Repeat Yourself

---

## 🚫 Common Mistakes to Avoid

### ❌ DON'T: Put handlers in utils

```
src/utils/handlers/
└── customSelectHandlers.js    ← BAD: Too far from component
```

### ❌ DON'T: Put helpers in component folders

```
src/components/CustomSelect/
└── textScrambler.js            ← BAD: Should be in utils (reusable!)
```

### ❌ DON'T: Mix handlers and helpers in same file

```javascript
// BAD: Mixing concerns
export const handleClick = (e) => { ... };     // Handler
export const formatDate = (date) => { ... };   // Helper (should be in utils!)
```

---

## 📖 Summary

| Aspect           | HANDLERS           | HELPERS                   |
| ---------------- | ------------------ | ------------------------- |
| **Purpose**      | Respond to events  | Transform/calculate data  |
| **Reusability**  | Component-specific | Shared across components  |
| **Side Effects** | Yes (state, DOM)   | No (pure functions)       |
| **Location**     | With component     | `src/utils/`              |
| **Examples**     | onClick, onChange  | scrambleText, formatDate  |
| **Testing**      | Requires mocking   | Easy to test in isolation |

---

## 🎓 Your Instructor's Guidance

When your instructor said:

> "Put all handlers in utils"

They likely meant **HELPERS** (utility functions), not event handlers. This is a common terminology mix-up!

**Correct interpretation:**

- ✅ HELPERS → `src/utils/`
- ✅ HANDLERS → Co-located with component

**This follows modern React best practices and keeps your code organized!** 🎯
