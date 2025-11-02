# Component Architecture

## 🏗️ Component Tree

```
HomePage (src/HomePage/HomePage.jsx)
│
├── Cursor System (4 divs)
│   ├── #cursor
│   ├── #gravity-field
│   ├── #wormhole
│   └── #dimensional-rift
│
├── Quantum Navigation (nav.quantum-nav)
│   ├── Logo + Quantum Glyphs
│   ├── Navigation Links (HOME, SCENES, SHOWCASE)
│   └── Logout Button (conditional: isAuthenticated)
│
├── Parallax Layers (2 SVG backgrounds)
│   ├── Background Layer (ref: bgRef)
│   └── Foreground Layer (ref: fgRef)
│
├── Parallax Container (ref: parallaxRef)
│   │
│   ├── Scene 1: Reality Layer (#reality)
│   │   ├── 6 Particles
│   │   ├── Terminal Header (coordinates + timestamp)
│   │   ├── Quantum Title (h1 with 3D float)
│   │   ├── Hero Stats (modules, quantum state, network)
│   │   └── BeamScanButton ("Enter GE0M LAB")
│   │
│   ├── Scene 2: Probability Wave (#probability)
│   │   ├── Probability Waves (animation container)
│   │   ├── Floating Code (3 snippets)
│   │   └── Quote Component
│   │
│   ├── Scene 3: Quantum Entanglement (#entanglement)
│   │   ├── Entanglement Network (container)
│   │   └── Connected Nodes (2 nodes + quantum bridge)
│   │
│   └── Scene 4: Superposition State (#superposition)
│       ├── Superposition Field
│       └── Quantum Console (4 output lines)
│
└── ProgressBar (quantum state controls)
    ├── portalState (current colors)
    ├── glyphState (current symbols)
    └── onQuantumCollapse (manual trigger)
```

---

## 📦 Component Files

### Core Components

- **HomePage.jsx** (379 lines) - Main container
- **Quote.jsx** - Quote display in Scene 2
- **ProgressBar.jsx** - Floating controls with quantum state
- **Scene.jsx** - Wrapper for Scene 4

### External Components

- **BeamScanButton** (`src/components/HUD/BeamScanButton/`)

---

## 🔄 State Flow

```
User Scrolls
    ↓
Scroll Event Handler
    ↓
quantumCollapse(portalWorlds)
    ↓
setPortalState(newState)
    ↓
React Re-render
    ↓
Inline Styles Update
    ↓
CSS Transitions (1.2s)
    ↓
Visual Color Change
```

---

## 📊 Props & Context

### HomePage Props

- `isAuthenticated` (from AuthContext)
- `logout` (from AuthContext)

### ProgressBar Props

```jsx
<ProgressBar
  portalState={portalState}
  glyphState={glyphState}
  onQuantumCollapse={handleQuantumCollapse}
/>
```

### Scene Props

```jsx
<Scene
  id="superposition"
  isActive={activeScene === 3}
  backgroundClass="bg-superposition"
>
```

### BeamScanButton Props

```jsx
<BeamScanButton
  onClick={() => (window.location.href = "/geom-lab")}
  label="Enter GE0M LAB"
  style={{ margin: "32px auto 0", display: "block" }}
/>
```
