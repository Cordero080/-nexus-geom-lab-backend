# index.css - Global HomePage Styles

**File**: `src/index.css`  
**Lines**: 523  
**Purpose**: Global styles for cursor, navbar, title animations, and buttons

---

## 🎯 Key Sections

### 1. Cursor System

```css
.cursor {
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 99999;
  opacity: 0;
  background: radial-gradient(circle, #00ffff 0%, #ff00cc 100%);
  box-shadow: 0 0 30px #00ffff, 0 0 60px #ff00cc;
  transition: opacity 0.2s;
}
```

### 2. Quantum Title Animation

```css
h1.quantum-title {
  font-size: clamp(46px, 7.6vw, 114px);
  font-weight: 800;
  background: linear-gradient(
    135deg,
    #00ffff72,
    #ff00668d,
    #ffff0094,
    #00ff33,
    #cc00ff,
    #ff3300
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: quantumTitleFloat 7.5s cubic-bezier(0.77, 0, 0.18, 1) infinite alternate,
    quantumTitleGlitch 3.2s steps(1, end) infinite;
}
```

### 3. Navbar Scan Animation

```css
.quantum-nav::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    #00ffff,
    #ff00ff,
    #ffff00,
    transparent
  );
  animation: navScan 8s ease-in-out infinite;
}
```

### 4. BeamScanButton

```css
.beam-btn::after {
  content: "";
  position: absolute;
  left: -50%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 45%,
    #fff 49%,
    #1dedf4 51%,
    transparent 25%
  );
  animation: beam-bar-move 2.5s cubic-bezier(0.77, 0, 0.18, 1) infinite;
}
```

---

## 🎬 Animations

- `navScan` - 8s navbar scan line
- `quantumTitleFloat` - 7.5s 3D title float
- `quantumTitleGlitch` - 3.2s glitch effects
- `gradientShift` - 4s color gradient movement
- `beam-bar-move` - 2.5s button scan animation
