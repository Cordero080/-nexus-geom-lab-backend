# HomePage.jsx - Complete Source Code

**File**: `src/HomePage/HomePage.jsx`  
**Lines**: 379  
**Purpose**: Main landing page component with quantum-themed parallax scroll system

---

## 🎯 Component Overview

The HomePage component implements a multi-scene parallax scrolling experience with quantum-themed visual effects, dynamic color palettes, and interactive cursor system.

### Key Features

- 5 quantum portal world color palettes that change on scroll/click
- 2-layer parallax SVG backgrounds (mouse + scroll reactive)
- 4 distinct quantum-themed scenes with clip-path backgrounds
- Interactive cursor system (4 layers: cursor, gravity field, wormhole, dimensional rift)
- Dynamic quantum navbar with glitch effects
- Greek symbol glyphs that change with portal states
- Floating 3D title with glitch animations
- Scene fade transitions based on scroll position

---

## 📦 Imports

```jsx
import React, { useEffect, useRef, useState } from "react";

// Quantum Uncertainty Utility
function quantumCollapse(states) {
  return states[Math.floor(Math.random() * states.length)];
}

import Quote from "./Quote";
import ProgressBar from "./ProgressBar";
import Scene from "./Scene";
import "./Home.css";
import { BeamScanButton } from "../components/HUD";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
```

---

## 🎨 Quantum Portal Worlds Configuration

### Portal Worlds (Color Palettes)

```jsx
const portalWorlds = [
  { colors: ["#ff00cc", "#00fff7", "#1a003a"], label: "Fractal" },
  { colors: ["#ffea00", "#00ffb3", "#003a2a"], label: "Nebula" },
  { colors: ["#ff3300", "#cc00ff", "#0a0f1a"], label: "Inferno" },
  { colors: ["#00ff33", "#00aaff", "#003a3a"], label: "Emerald" },
  { colors: ["#fff", "#00fff7", "#0a0f1a"], label: "Singularity" },
];
```

**Usage**: Each portal world has 3 colors used for:

- `colors[0]` - Primary accent (start gradient)
- `colors[1]` - Secondary accent (mid gradient, glyph color)
- `colors[2]` - Tertiary accent (end gradient, shadows)

### Greek Glyph Sets

```jsx
const glyphSets = [
  ["ψ", "Ω", "Σ"],
  ["λ", "Φ", "Ξ"],
  ["π", "Δ", "Γ"],
  ["μ", "θ", "ζ"],
  ["τ", "β", "η"],
];
```

**Display Location**: Navbar next to logo (lines 164-177)

---

## 🔄 State Management

### React State

```jsx
const [portalState, setPortalState] = useState(() =>
  quantumCollapse(portalWorlds)
);
const [glyphState, setGlyphState] = useState(() => quantumCollapse(glyphSets));
const [activeScene, setActiveScene] = useState(0);
```

### Refs for Parallax

```jsx
const parallaxRef = useRef(null);
const fgRef = useRef(null);
const bgRef = useRef(null);
```

### Authentication

```jsx
const { isAuthenticated, logout } = useAuth();
```

---

## 🎬 Effects & Event Handlers

### 1. Quantum Collapse on Scroll (Lines 39-47)

```jsx
useEffect(() => {
  const handle = () => {
    setPortalState(quantumCollapse(portalWorlds));
    setGlyphState(quantumCollapse(glyphSets));
  };
  window.addEventListener("scroll", handle);
  return () => window.removeEventListener("scroll", handle);
}, []);
```

**Trigger**: User scrolls page  
**Effect**: Randomly selects new portal world and glyph set  
**Visual Impact**: Background colors, navbar gradient, glyph symbols, hero stat label all change with 1.2s transition

### 2. Wormhole Ripple Effect (Lines 62-81)

```jsx
useEffect(() => {
  const handleClick = (e) => {
    const wormhole = document.getElementById("wormhole");
    if (!wormhole) return;
    const size = 170;
    const x = e.clientX - size / 2;
    const y = e.clientY - size / 2;
    wormhole.style.left = `${x}px`;
    wormhole.style.top = `${y}px`;
    wormhole.classList.remove("ripple");
    void wormhole.offsetWidth;
    wormhole.classList.add("ripple");
  };
  window.addEventListener("click", handleClick);
  return () => {
    window.removeEventListener("click", handleClick);
    const wormhole = document.getElementById("wormhole");
    if (wormhole) {
      wormhole.classList.remove("ripple");
      wormhole.style.left = "";
      wormhole.style.top = "";
    }
  };
}, []);
```

**Trigger**: User clicks anywhere on page  
**Effect**: Positions wormhole div at click location and triggers ripple animation

### 3. Parallax Layers (Lines 83-103)

```jsx
useEffect(() => {
  const handleParallax = (e) => {
    const scrollY = window.scrollY;
    const wh = window.innerHeight;
    // Mouse position (centered -0.5 to 0.5)
    let mx = 0,
      my = 0;
    if (e && e.type === "mousemove") {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    }
    // Parallax: background moves slowest, foreground fastest
    if (bgRef.current) {
      bgRef.current.style.transform = `translate3d(${mx * 30}px, ${
        -scrollY * 0.08 + my * 20
      }px, 0)`;
    }
    if (fgRef.current) {
      fgRef.current.style.transform = `translate3d(${mx * 80}px, ${
        -scrollY * 0.18 + my * 40
      }px, 0)`;
    }
  };
  window.addEventListener("scroll", handleParallax);
  window.addEventListener("mousemove", handleParallax);
  handleParallax();
  return () => {
    window.removeEventListener("scroll", handleParallax);
    window.removeEventListener("mousemove", handleParallax);
  };
}, []);
```

**Parallax Multipliers**:

- Background: `0.08x` scroll, `30px` mouse horizontal, `20px` mouse vertical
- Foreground: `0.18x` scroll, `80px` mouse horizontal, `40px` mouse vertical

### 4. Scene Fade Logic (Lines 105-123)

```jsx
useEffect(() => {
  const handleScroll = () => {
    if (!parallaxRef.current) return;
    const container = parallaxRef.current;
    const scenes = Array.from(container.querySelectorAll(".quantum-scene"));
    const scrollY = window.scrollY;
    let found = 0;
    for (let i = 0; i < scenes.length; i++) {
      const rect = scenes[i].getBoundingClientRect();
      if (
        rect.top <= window.innerHeight * 0.33 &&
        rect.bottom > window.innerHeight * 0.33
      ) {
        found = i;
        break;
      }
    }
    setActiveScene(found);
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll();
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

**Logic**: Scene becomes active when its top edge crosses 33% viewport height  
**CSS Effect**: `.quantum-scene.active` has `opacity: 1`, others have `opacity: 0`

---

## 🎭 JSX Structure

### Cursor System (Lines 128-131)

```jsx
<div className="cursor" id="cursor"></div>
<div className="gravity-field" id="gravity-field"></div>
<div className="wormhole" id="wormhole"></div>
<div className="dimensional-rift" id="dimensional-rift"></div>
```

**Purpose**: 4-layer holographic cursor effect  
**Styling**: Defined in `index.css`

### Quantum Navigation (Lines 133-201)

```jsx
<nav
  className="quantum-nav"
  id="quantum-nav"
  style={{
    background: `linear-gradient(90deg, rgba(0,0,0,0.82) 80%, ${portalState.colors[1]}22 100%)`,
    boxShadow: `0 2px 16px 0 ${portalState.colors[2]}11`,
    transition: "background 1.2s cubic-bezier(0.4,0,0.2,1), box-shadow 1.2s",
  }}
>
  <div className="nav-logo">
    <span
      className="logo-text"
      data-text="JS_LAB_V2.0"
      style={{
        color: "#fff",
        filter: `drop-shadow(0 0 4px ${portalState.colors[1]}66)`,
        transition: "filter 1.2s",
      }}
    >
      PVBL0_P!ST0LA_V2.0
    </span>
    {/* Quantum glyphs in navbar */}
    <span
      style={{
        marginLeft: 10,
        fontSize: 16,
        color: portalState.colors[1],
        letterSpacing: "0.12em",
        verticalAlign: "middle",
        opacity: 0.8,
        filter: `blur(0.3px) drop-shadow(0 0 4px ${portalState.colors[1]}88)`,
        transition: "color 1.2s, filter 1.2s, opacity 1.2s",
        textShadow: `0 0 8px ${portalState.colors[1]}, 0 0 2px ${portalState.colors[0]}`,
      }}
    >
      {glyphState.join(" ")}
    </span>
    <div className="logo-particles"></div>
  </div>
  <div className="nav-links">
    <a href="#reality" className="nav-link nav-link--home" data-dimension="0">
      // HOME
    </a>
    <Link to="/scenes" className="nav-link" data-dimension="1">
      // SCENES
    </Link>
    <Link to="/showcase" className="nav-link" data-dimension="2">
      // SHOWCASE
    </Link>
    {isAuthenticated && (
      <div className="nav-terminal">
        <button
          onClick={logout}
          className="terminal-cursor"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "inherit",
            color: "#00ff88",
          }}
        >
          [LOGOUT]
        </button>
      </div>
    )}
  </div>
  <div className="nav-quantum-field"></div>
</nav>
```

**Dynamic Styles**:

- Background gradient uses `portalState.colors[1]` with 22 alpha
- Box shadow uses `portalState.colors[2]` with 11 alpha
- Logo drop shadow uses `portalState.colors[1]` with 66 alpha
- Glyphs colored with `portalState.colors[1]`, glow with `colors[0]`

### Parallax Background Layer (Lines 203-213)

```jsx
<div ref={bgRef} className="parallax-bg-layer" aria-hidden="true">
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 1920 400"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "40vh",
      pointerEvents: "none",
      background: `linear-gradient(120deg, ${portalState.colors[0]} 0%, ${portalState.colors[1]} 60%, ${portalState.colors[2]} 100%)`,
      transition: "background 1.2s cubic-bezier(0.4,0,0.2,1)",
    }}
  >
    <defs>
      <linearGradient id="bg-grad1" x1="0" y1="0" x2="1" y2="1">
        <stop
          offset="0%"
          stopColor={portalState.colors[0]}
          stopOpacity="0.18"
        />
        <stop
          offset="100%"
          stopColor={portalState.colors[1]}
          stopOpacity="0.08"
        />
      </linearGradient>
    </defs>
    <polygon points="0,0 1920,0 1600,400 0,300" fill="url(#bg-grad1)" />
    <ellipse
      cx="1600"
      cy="80"
      rx="220"
      ry="60"
      fill={portalState.colors[2] + "22"}
    />
  </svg>
</div>
```

**Dynamic Elements**:

- SVG background: 3-color gradient from portal state
- Polygon fill: Gradient using colors[0] and colors[1]
- Ellipse fill: colors[2] with 22 alpha

### Parallax Foreground Layer (Lines 214-227)

```jsx
<div ref={fgRef} className="parallax-fg-layer" aria-hidden="true">
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 1920 400"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "40vh",
      pointerEvents: "none",
    }}
  >
    <defs>
      <linearGradient id="fg-grad1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.22" />
      </linearGradient>
    </defs>
    <polygon points="1920,0 1920,400 400,400 0,200" fill="url(#fg-grad1)" />
    <ellipse cx="320" cy="120" rx="180" ry="40" fill="#fff2" />
  </svg>
</div>
```

**Static Colors**: White and cyan (not portal-reactive)

---

## 🌌 Scene 1: Reality Layer (Lines 229-288)

```jsx
<section
  className={`quantum-scene${activeScene === 0 ? " active" : ""}`}
  id="reality"
  data-scene="0"
>
  <div className="scene-background bg-reality"></div>
  <div className="scene-content">
    <div className="particles">
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
    </div>
    <div className="terminal-header">
      <span className="coordinates">37.7749° N, 122.4194° W</span>
      <span className="timestamp" id="timestamp"></span>
    </div>
    <h1 className="quantum-title" data-text="MODERN JAVASCRIPT SYNTAX LAB">
      <span className="title-word" data-word="0">
        N3XUS
      </span>
      <br></br>
      <span className="title-word" data-word="1">
        GE<span className="zero-char">0</span>M
      </span>
      <br></br>
      <span className="title-word" data-word="2">
        3D
      </span>
    </h1>
    <p className="quantum-subtitle">
      / / I N T E R A C T I V E _ C O N S O L E _ A W A I T S . . .
    </p>
    <div className="hero-stats">
      <div className="stat-item">
        <span className="stat-label">MODULES LOADED-</span>
        <span className="stat-value" data-stat="modules">
          080
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-label">QUANTUM STATE-</span>
        <span
          className="stat-value"
          data-stat="state"
          style={{
            color: portalState.colors[0],
            textShadow: `0 0 8px ${portalState.colors[1]}, 0 0 2px ${portalState.colors[2]}`,
            transition: "color 1.2s, text-shadow 1.2s",
          }}
        >
          {portalState.label.toUpperCase()}
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-label">NETWORK STATUS</span>
        <span className="stat-value" data-stat="network">
          -CONNECTED
        </span>
      </div>
    </div>

    <BeamScanButton
      onClick={() => (window.location.href = "/geom-lab")}
      label="Enter GE0M LAB"
      style={{ margin: "32px auto 0", display: "block" }}
    />

    <div className="reality-particles"></div>
  </div>
</section>
```

**Key Elements**:

- 6 animated particles
- Terminal header with coordinates
- 3D floating title with glitch effects
- Hero stats with dynamic quantum state label
- BeamScanButton to enter main app

---

## 🌊 Scene 2: Probability Wave (Lines 290-312)

```jsx
<section
  className={`quantum-scene${activeScene === 1 ? " active" : ""}`}
  id="probability"
  data-scene="1"
>
  <div className="scene-background bg-probability"></div>
  <div className="scene-content">
    <h2 className="scene-title">PROBABILITY CLOUD</h2>
    <p className="scene-description">
      Where code exists in superposition until observed
    </p>
    <div className="probability-waves"></div>
    <div className="code-snippets">
      <div className="floating-code">
        import name from './exportingFile.js';
      </div>
      <div className="floating-code">console.future(identity);</div>
      <div className="floating-code">PABLO D C0RDER0</div>
      <Quote />
    </div>
  </div>
</section>
```

**Key Elements**:

- Probability waves animation container
- Floating code snippets
- Quote component

---

## 🔗 Scene 3: Quantum Entanglement (Lines 314-331)

```jsx
<section
  className={`quantum-scene${activeScene === 2 ? " active" : ""}`}
  id="entanglement"
  data-scene="2"
>
  <div className="scene-background bg-entanglement"></div>
  <div className="scene-content">
    <h2 className="scene-title">QUANTUM ENTANGLEMENT</h2>
    <p className="scene-description">Modules connected across infinite space</p>
    <div className="entanglement-network"></div>
    <div className="connected-nodes">
      <div className="node" data-module="export">
        NO
      </div>
      <div className="node" data-module="import">
        TRY
      </div>
      <div className="quantum-bridge"></div>
    </div>
  </div>
</section>
```

**⚠️ MISSING CSS**: `.entanglement-network`, `.connected-nodes`, `.node`, `.quantum-bridge` have no styling

---

## ⚡ Scene 4: Superposition State (Lines 333-351)

```jsx
<Scene
  id="superposition"
  isActive={activeScene === 3}
  backgroundClass="bg-superposition"
>
  <h2 className="scene-title">SUPERPOSITION STATE</h2>
  <p className="scene-description">All possibilities exist simultaneously</p>
  <div className="superposition-field"></div>
  <div className="quantum-console">
    <div className="console-line">
      &gt;&gt;&gt; Initializing quantum state...
    </div>
    <div className="console-line">
      &gt;&gt;&gt; PABLO PISTOLA = ψ(quantum_state)
    </div>
    <div className="console-line">
      &gt;&gt;&gt; Observation collapsed wave function
    </div>
    <div className="console-line">&gt;&gt;&gt; Result: "ETHEREAL" ✨</div>
  </div>
</Scene>
```

**Key Elements**:

- Uses Scene wrapper component
- Quantum console with terminal-style output

---

## 📊 ProgressBar Component (Lines 353-358)

```jsx
<ProgressBar
  portalState={portalState}
  glyphState={glyphState}
  onQuantumCollapse={handleQuantumCollapse}
/>
```

**Props**:

- `portalState` - Current portal world (for color styling)
- `glyphState` - Current glyph set (for display)
- `onQuantumCollapse` - Handler to manually trigger state change

---

## 🎬 Manual Quantum Collapse Handler (Lines 48-51)

```jsx
function handleQuantumCollapse() {
  setPortalState(quantumCollapse(portalWorlds));
  setGlyphState(quantumCollapse(glyphSets));
}
```

**Trigger**: ProgressBar button click  
**Effect**: Same as scroll event - randomly selects new portal world and glyph set

---

## 📝 Component Tree

```
HomePage
├── Cursor System (4 divs)
├── Quantum Navigation
│   ├── Logo + Glyphs
│   ├── Navigation Links
│   └── Logout Button (conditional)
├── Parallax Background Layer (SVG)
├── Parallax Foreground Layer (SVG)
├── Parallax Container
│   ├── Scene 1: Reality Layer
│   │   ├── Particles (6)
│   │   ├── Terminal Header
│   │   ├── Quantum Title
│   │   ├── Hero Stats
│   │   └── BeamScanButton
│   ├── Scene 2: Probability Wave
│   │   ├── Probability Waves
│   │   ├── Floating Code (3)
│   │   └── Quote
│   ├── Scene 3: Quantum Entanglement
│   │   ├── Entanglement Network
│   │   └── Connected Nodes (2)
│   └── Scene 4: Superposition State (Scene component)
│       ├── Superposition Field
│       └── Quantum Console (4 lines)
└── ProgressBar
```

---

## 🎨 Dynamic Styling Summary

Elements that react to `portalState` color changes:

1. **Navbar**

   - Background gradient (colors[1])
   - Box shadow (colors[2])
   - Logo drop shadow (colors[1])
   - Glyphs color + glow (colors[0] + colors[1])

2. **Parallax Background SVG**

   - Overall background gradient (all 3 colors)
   - Polygon gradient (colors[0] → colors[1])
   - Ellipse fill (colors[2])

3. **Hero Stats**

   - Quantum state label color (colors[0])
   - Text shadow (colors[1] + colors[2])

4. **All transitions**: `1.2s cubic-bezier(0.4,0,0.2,1)`

---

## 🔧 Utility Function

```jsx
function quantumCollapse(states) {
  return states[Math.floor(Math.random() * states.length)];
}
```

**Purpose**: Randomly select one element from an array  
**Usage**: Called on scroll, click, and initial mount to select portal world and glyph set
