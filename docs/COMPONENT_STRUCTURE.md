# Component Structure Guide

## Overview

This document maps out the current component organization in Nexus Geom Lab. The structure follows a **feature-based** architecture with clear separation between business logic, pages, layout, shared components, and pure UI elements.

---

## 📁 Directory Structure

```
src/components/
├── features/      → Feature-specific business logic components
├── pages/         → Page-level components (routes)
├── layout/        → Layout wrappers and structural components
├── shared/        → Reusable components used across multiple features
└── ui/            → Pure presentational UI components
```

---

## 🎯 features/ - Business Logic Components

**Purpose:** Components that contain business logic specific to a feature domain.

```
features/
├── Controls/
│   ├── MaterialControls.jsx      → Metalness, emissive, color sliders
│   ├── SceneControls.jsx          → Object type, count, animation style
│   ├── LightingPanel.jsx          → Grouped lighting controls
│   └── Controls.jsx               → Main control panel container
│
├── LightingControls/
│   ├── AmbientLightControls.jsx  → Ambient light configuration
│   ├── DirectionalLightControls.jsx → Directional light setup
│   └── index.js                   → Exports all lighting controls
│
├── SaveButton/
│   ├── SaveButton.jsx             → Save scene modal & logic
│   └── SaveButton.module.scss     → Component styles
│
├── SceneCard/
│   ├── SceneCard.jsx              → Gallery card for saved scenes
│   └── SceneCard.module.scss      → Card styling
│
├── Scenes/
│   ├── ThreeScene.jsx             → Main 3D rendering component
│   ├── ThreeScene.module.scss     → Scene container styles
│   └── Canvas wrapper for Three.js
│
├── Showcase/
│   ├── ShowcaseGallery.jsx        → Grid of showcase items
│   ├── ShowcaseCard.jsx           → Individual showcase card
│   └── Showcase.module.scss       → Gallery styles
│
└── ShowcaseViewer/
    ├── ShowcaseViewer.jsx         → Full-screen 3D model viewer
    ├── RotatingCube.jsx           → Character display container
    ├── FBXModel.jsx               → FBX model loader
    └── ShowcaseViewer.module.scss → Viewer styles
```

### Key Patterns in features/:

- Each feature has its own folder
- Colocated styles (`.module.scss`)
- Self-contained business logic
- May connect to context (SceneContext, AuthContext)

---

## 📄 pages/ - Page-Level Components

**Purpose:** Components that represent entire pages/routes.

```
pages/
├── HomePage/
│   ├── HomePage.jsx                      → Landing page
│   ├── HomePage.module.scss              → Page styles
│   ├── HessianPolychoronAnimation.jsx    → 4D polytope animation
│   ├── QuantumManifoldAnimation.jsx      → Klein bottle animation
│   ├── QuantumBackground.jsx             → Parallax background
│   └── hooks/
│       ├── useParallax.js                → Background parallax logic
│       └── useQuantumState.js            → Homepage animation state
│
└── MyScenesPage/
    ├── MyScenesPage.jsx                  → User's saved scenes gallery
    └── MyScenesPage.module.scss          → Gallery page styles
```

### Key Patterns in pages/:

- One component per route
- May contain page-specific animations/effects
- Page-specific hooks in dedicated `hooks/` folder
- Compose feature components for page layout

---

## 🏗️ layout/ - Layout Components

**Purpose:** Structural components for page layout.

```
layout/
├── Header.jsx              → Site header/navigation
├── Footer.jsx              → Site footer
├── MainLayout.jsx          → Main page wrapper
└── Layout.module.scss      → Layout styles
```

### Key Patterns in layout/:

- Define overall page structure
- Provide navigation
- Apply global layout styling
- Used across multiple pages

---

## 🔄 shared/ - Shared Components

**Purpose:** Reusable components used by multiple features.

```
shared/
├── Modal/
│   ├── Modal.jsx
│   └── Modal.module.scss
│
├── LoadingSpinner/
│   ├── LoadingSpinner.jsx
│   └── LoadingSpinner.module.scss
│
└── ErrorBoundary/
    └── ErrorBoundary.jsx
```

### Key Patterns in shared/:

- Feature-agnostic
- Highly reusable
- Minimal business logic
- Configurable via props

---

## 🎨 ui/ - Pure UI Components

**Purpose:** Presentational-only components (buttons, inputs, cards).

```
ui/
├── Button/
│   ├── Button.jsx
│   └── Button.module.scss
│
├── Input/
│   ├── Input.jsx
│   └── Input.module.scss
│
├── Card/
│   ├── Card.jsx
│   └── Card.module.scss
│
└── ScrambleButton/
    ├── ScrambleButton.jsx       → Button with text scramble effect
    └── ScrambleButton.module.scss
```

### Key Patterns in ui/:

- Zero business logic
- Pure presentation
- Highly composable
- May use design system tokens

---

## 🔌 Integration with Other Layers

### How Components Connect:

```
pages/HomePage.jsx
  ↓ imports
features/Showcase/ShowcaseGallery.jsx
  ↓ imports
shared/Modal.jsx
  ↓ imports
ui/Button.jsx
```

### Data Flow:

```
Context (AuthContext, SceneContext)
  ↓ useContext()
pages/MyScenesPage.jsx
  ↓ props
features/SceneCard.jsx
  ↓ props
ui/Card.jsx + ui/Button.jsx
```

---

## 🎯 Decision Guidelines

### When creating a new component, ask:

#### Is it page-specific?

**YES** → `pages/[PageName]/`

#### Does it contain feature business logic?

**YES** → `features/[FeatureName]/`

#### Is it layout/structure?

**YES** → `layout/`

#### Is it reusable across features?

**YES** → `shared/`

#### Is it pure UI with no logic?

**YES** → `ui/`

---

## 📊 Component Dependency Flow

```
┌─────────────────────────────────────┐
│         Context Providers           │
│   (AuthContext, SceneContext)       │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│           App.jsx                   │
│     (Router + Global State)         │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         layout/                     │
│    (Header, Footer, MainLayout)     │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│          pages/                     │
│   (HomePage, MyScenesPage)          │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│        features/                    │
│  (Controls, Scenes, Showcase)       │
└─────────────┬───────────────────────┘
              ↓
┌──────────────┬──────────────────────┐
│   shared/    │       ui/            │
│  (Modal,     │  (Button, Input,     │
│   Spinner)   │   Card)              │
└──────────────┴──────────────────────┘
```

**Flow Direction:** Top → Down  
**Data Flow:** Context → Pages → Features → UI  
**Event Flow:** UI → Features → Pages → Context

---

## 🚀 Best Practices

### 1. Colocate Related Files

```
SaveButton/
├── SaveButton.jsx
├── SaveButton.module.scss
├── SaveButton.test.jsx       (when tests added)
└── index.js                  (optional barrel export)
```

### 2. Use CSS Modules

- Scoped styles per component
- Prevents global namespace pollution
- Clear style ownership

### 3. Feature Folders Own Their Logic

- Don't spread feature logic across multiple folders
- Keep related components together
- Easier to refactor/remove features

### 4. Avoid Deep Nesting

- Max 2-3 levels deep in features/
- Extract to new feature if folder grows too large

### 5. Shared vs UI Distinction

- **shared/**: Used by 2+ features, may have some logic
- **ui/**: Pure presentation, used everywhere, zero logic

---

## 📝 Real-World Examples

### Example 1: Adding a New Feature

**Task:** Add a "Favorites" feature to save favorite scenes

**Structure:**

```
features/Favorites/
├── FavoritesButton.jsx        → Star/heart button
├── FavoritesModal.jsx         → Modal showing favorites
├── FavoritesList.jsx          → List of favorited scenes
├── useFavorites.js            → Custom hook for logic
└── Favorites.module.scss      → Styles
```

### Example 2: Creating a Reusable Component

**Task:** Create a tooltip component

**Structure:**

```
shared/Tooltip/
├── Tooltip.jsx
├── Tooltip.module.scss
└── index.js
```

**Usage:**

```jsx
import Tooltip from "@/components/shared/Tooltip";

<Tooltip content="Save your scene">
  <Button>Save</Button>
</Tooltip>;
```

### Example 3: Building a New Page

**Task:** Add an "About" page

**Structure:**

```
pages/AboutPage/
├── AboutPage.jsx
├── AboutPage.module.scss
└── TeamSection.jsx            → Page-specific component
```

---

## 🔧 Refactoring History

This structure is the result of the "Monster Refactor" that:

- Separated ThreeScene from monolithic structure
- Extracted controls into feature components
- Created clear separation of concerns
- Improved maintainability and testability

**See:** `docs/archive/refactoring/MonsterRefactor.md` for full history.

---

## 🎓 Key Takeaways

1. **Feature-based** organization scales better than type-based
2. **Colocation** keeps related code together
3. **Clear boundaries** between features, pages, shared, and UI
4. **Data flows down**, events flow up
5. **Easy to reason about** - clear where new code belongs

This structure supports **growth**, **collaboration**, and **maintainability** as the project evolves.
