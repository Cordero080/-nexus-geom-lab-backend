# Interactive Effects System

## 🎨 Cursor Effects (4 Layers)

### 1. Main Cursor (#cursor)

- Radial gradient (cyan to magenta)
- 20px circle
- z-index: 99999

### 2. Gravity Field (#gravity-field)

- Larger follower effect
- Styled in index.css

### 3. Wormhole (#wormhole)

- Click-triggered ripple
- 170px size
- Positioned at click coordinates
- `.ripple` class triggers animation

### 4. Dimensional Rift (#dimensional-rift)

- Additional layer effect
- Styled in index.css

---

## 🌊 Parallax System

### Two-Layer Architecture

**Background Layer** (bgRef)

- Movement: `0.08x` scroll, `30px` mouse horizontal, `20px` mouse vertical
- Contains quantum-reactive SVG gradient

**Foreground Layer** (fgRef)

- Movement: `0.18x` scroll, `80px` mouse horizontal, `40px` mouse vertical
- Contains static white/cyan gradient

### Event Handlers

- `scroll` - Updates layer positions based on scrollY
- `mousemove` - Adds 3D depth based on cursor position

---

## ✨ Scene Transitions

### Fade Logic

- Active detection: 33% viewport intersection
- Transition: 1.1s cubic-bezier fade
- Z-index switching: inactive (1) → active (2)

### Scene Activation Flow

```
Scroll Event
    ↓
Check each scene's getBoundingClientRect()
    ↓
Find scene at 33% viewport
    ↓
setActiveScene(index)
    ↓
CSS applies .active class
    ↓
Opacity: 0 → 1 (1.1s fade)
```

---

## 🎬 Wormhole Ripple

### Click Handler

```javascript
const handleClick = (e) => {
  const wormhole = document.getElementById("wormhole");
  const x = e.clientX - size / 2;
  const y = e.clientY - size / 2;
  wormhole.style.left = `${x}px`;
  wormhole.style.top = `${y}px`;
  wormhole.classList.remove("ripple");
  void wormhole.offsetWidth; // Force reflow
  wormhole.classList.add("ripple");
};
```

### Effect

- Positions div at click location
- Triggers ripple animation
- Resets on cleanup

---

## 🎯 Performance

- **GPU Acceleration**: `transform: translateZ(0)`
- **Will-change**: Applied to parallax elements
- **Cubic-bezier easing**: Smooth 60fps animations
- **Pointer-events**: Disabled on decorative elements
