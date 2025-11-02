# Quantum Portal Worlds System

## 🌀 Overview

The color-changing scroll mechanism that makes backgrounds and UI elements shift through different quantum states.

---

## 🎨 Portal Worlds Configuration

```javascript
const portalWorlds = [
  { colors: ["#ff00cc", "#00fff7", "#1a003a"], label: "Fractal" },
  { colors: ["#ffea00", "#00ffb3", "#003a2a"], label: "Nebula" },
  { colors: ["#ff3300", "#cc00ff", "#0a0f1a"], label: "Inferno" },
  { colors: ["#00ff33", "#00aaff", "#003a3a"], label: "Emerald" },
  { colors: ["#fff", "#00fff7", "#0a0f1a"], label: "Singularity" },
];
```

**Color Array Usage**:

- `colors[0]` - Primary gradient start, stat label
- `colors[1]` - Mid gradient, navbar, glyphs
- `colors[2]` - Gradient end, shadows

---

## ⚡ How It Works

### 1. Random State Selection

```javascript
function quantumCollapse(states) {
  return states[Math.floor(Math.random() * states.length)];
}
```

### 2. Scroll Event Trigger

```javascript
useEffect(() => {
  const handle = () => {
    setPortalState(quantumCollapse(portalWorlds));
    setGlyphState(quantumCollapse(glyphSets));
  };
  window.addEventListener("scroll", handle);
  return () => window.removeEventListener("scroll", handle);
}, []);
```

### 3. Dynamic Inline Styles

```jsx
<svg style={{
  background: `linear-gradient(120deg,
    ${portalState.colors[0]} 0%,
    ${portalState.colors[1]} 60%,
    ${portalState.colors[2]} 100%)`,
  transition: 'background 1.2s cubic-bezier(0.4,0,0.2,1)'
}}>
```

### 4. CSS Transitions

All dynamic elements use `transition: 1.2s cubic-bezier(0.4,0,0.2,1)` for smooth color shifts.

---

## 🎯 Affected Elements

1. **Parallax Background SVG** - Full 3-color gradient
2. **Navbar** - Background gradient, box shadow
3. **Logo** - Drop shadow filter
4. **Quantum Glyphs** - Color, text shadow, filter
5. **Hero Stat Label** - Color, text shadow
6. **SVG Shapes** - Polygon/ellipse fills

---

## 🔄 Trigger Methods

- **Scroll** - Automatic on page scroll
- **Click** - Manual via ProgressBar button (`onQuantumCollapse`)
