# Home.css - Scene Backgrounds & Animations

**File**: `src/HomePage/Home.css`  
**Lines**: 224  
**Purpose**: Scene-specific styles for HomePage backgrounds, parallax effects, and animations

---

## 🎨 Scene Backgrounds with Clip-Paths

### Scene 1: Reality Layer

```css
.bg-reality {
  background: linear-gradient(120deg, #0a0f1a 60%, #1a2a3a 100%),
    repeating-linear-gradient(-30deg, #00f0ff22 0 2px, transparent 2px 40px);
  clip-path: polygon(0 0, 100% 0, 100% 80%, 60% 100%, 0 80%);
  min-height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
```

**Visual Design**:

- **Base Gradient**: Dark navy (`#0a0f1a`) to steel blue (`#1a2a3a`), 120° angle
- **Overlay Pattern**: Cyan stripes at -30° angle (2px lines, 40px spacing, 22 alpha)
- **Shape**: Polygon with angled bottom (cuts from 80% right to 100% bottom to 80% left)

### Scene 2: Probability Wave

```css
.bg-probability {
  background: linear-gradient(135deg, #0a0f1a 60%, #1a003a 100%),
    repeating-linear-gradient(45deg, #00ffb366 0 4px, transparent 4px 40px);
  clip-path: polygon(0 10%, 100% 0, 100% 90%, 0 100%);
  min-height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
```

**Visual Design**:

- **Base Gradient**: Dark navy to deep purple (`#1a003a`), 135° angle
- **Overlay Pattern**: Mint green stripes at 45° angle (4px lines, 40px spacing, 66 alpha)
- **Shape**: Polygon with diagonal cut (top-left 10% down, bottom-left 100%)

### Scene 3: Quantum Entanglement

```css
.bg-entanglement {
  background: linear-gradient(110deg, #0a0f1a 60%, #003a2a 100%),
    repeating-linear-gradient(-60deg, #00fff966 0 3px, transparent 3px 30px);
  clip-path: polygon(0 0, 100% 10%, 100% 100%, 40% 90%, 0 100%);
  min-height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
```

**Visual Design**:

- **Base Gradient**: Dark navy to dark teal (`#003a2a`), 110° angle
- **Overlay Pattern**: Bright cyan stripes at -60° angle (3px lines, 30px spacing, 66 alpha)
- **Shape**: Polygon with angled bottom right (cuts from 100% 10% to 40% 90%)

### Scene 4: Superposition State

```css
.bg-superposition {
  background: linear-gradient(160deg, #0a0f1a 60%, #003a3a 100%),
    repeating-linear-gradient(70deg, #00aaff44 0 2px, transparent 2px 50px);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 20% 90%, 0 100%);
  min-height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
```

**Visual Design**:

- **Base Gradient**: Dark navy to dark cyan (`#003a3a`), 160° angle
- **Overlay Pattern**: Blue stripes at 70° angle (2px lines, 50px spacing, 44 alpha)
- **Shape**: Polygon with sharp bottom cut (20% at 90% height)

---

## 🌊 Scene Fade Transitions

### Scene States

```css
.quantum-scene {
  opacity: 1;
  pointer-events: auto;
  transition: opacity 1.1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  width: 100vw;
  min-height: 100vh;
  z-index: 1;
}

.quantum-scene:not(.active) {
  opacity: 0;
  pointer-events: none;
  z-index: 1;
}

.quantum-scene.active {
  opacity: 1;
  pointer-events: auto;
  position: relative;
  z-index: 2;
}
```

**Behavior**:

- Default: Visible, interactive
- `.active`: Full opacity, z-index 2 (front layer)
- Not active: Transparent, no pointer events, z-index 1 (back layer)
- **Transition**: 1.1s smooth fade with cubic-bezier easing

### Container

```css
.parallax-container {
  position: relative;
  min-height: 100vh;
}
```

---

## ✨ Holographic Parallax Text (ProgressBar)

### Base State

```css
.parallax-holo {
  will-change: transform, opacity, filter;
  perspective: 800px;
  transition: none;
  display: inline-block;
  font-size: 2.2em;
  font-family: "Orbitron", "JetBrains Mono", monospace;
  font-weight: 900;
  letter-spacing: 0.04em;
  color: #00fff7;
  text-shadow: 0 0 24px #00fff7cc, 0 0 60px #00fff744, 0 0 2px #fff;
  filter: blur(0.5px) brightness(1.1) saturate(1.2);
  opacity: 0.7;
  transform: translateZ(0px) scale(1);
  transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.2s,
    filter 1.2s;
}
```

**Effects**:

- Cyan color with layered glow (24px + 60px + 2px shadows)
- Slight blur for holographic feel
- 3D perspective setup
- GPU-accelerated transforms

### Animated State

```css
.parallax-holo.animate {
  opacity: 0;
  filter: blur(8px) brightness(2.2) saturate(2.5);
  transform: translateZ(180px) scale(2.2) skewY(-6deg) rotateX(18deg);
  pointer-events: none;
  transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.2s,
    filter 1.2s;
}
```

**3D Transform Breakdown**:

- `translateZ(180px)` - Moves text 180px forward in 3D space
- `scale(2.2)` - Enlarges to 220% size
- `skewY(-6deg)` - Tilts vertically by -6°
- `rotateX(18deg)` - Rotates on X-axis by 18°
- Heavy blur (8px) with 220% brightness
- Fades to transparent

### Return Transition

```css
.parallax-holo {
  transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.2s,
    filter 1.2s;
}
```

**Purpose**: Ensures smooth return when `.animate` class is removed

---

## 🎬 Quote Highlight Animation

```css
.floating-code.quote-highlight {
  line-height: 2.1;
  margin: 120px 0 32px 0;
  padding: 24px 32px;
  border: none;
  border-radius: 18px;
  font-size: 1.5em;
  font-style: italic;
  font-family: "Orbitron", "JetBrains Mono", monospace;
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
  background-clip: text;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(45, 86, 86, 0.4);
  animation: logoGlitch 6s ease-in-out infinite, gradientShift 4s ease-in-out
      infinite;
  letter-spacing: 0.01em;
  z-index: -1;
  opacity: 0.7;
}
```

**Visual Effects**:

- **Gradient Text**: 6-color gradient clipped to text (cyan, pink, yellow, green, purple, red)
- **Gradient Size**: 300% for animation overflow
- **Animations**:
  - `logoGlitch` - 6s glitch effects
  - `gradientShift` - 4s color movement
- **Spacing**: 120px top margin, 24px/32px padding, 18px border radius

---

## 🧭 Quantum Navigation Styles

### Nav Bar

```css
.quantum-nav {
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 2px solid #00ffff44;
  box-shadow: 0 2px 24px #00ffff22;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 110px;
  font-family: "JetBrains Mono", monospace;
}
```

**Layout**:

- Fixed at top, full width
- 110px height
- Flexbox with space-between
- Semi-transparent dark background
- Cyan border and glow

### Logo Container

```css
.nav-logo {
  display: flex;
  align-items: center;
  position: relative;
}
```

### Logo Text with Gradient

```css
.logo-text {
  position: relative;
  font-family: "JetBrains Mono", monospace;
  font-size: 28px;
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
  background-clip: text;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(45, 86, 86, 0.4);
  animation: logoGlitch 6s ease-in-out infinite, gradientShift 4s ease-in-out
      infinite;
}
```

### Glitch Layers

```css
.logo-text::before {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 2px;
  color: #ff00ff;
  animation: glitchShift1 3s ease-in-out infinite;
  z-index: -1;
  opacity: 0.7;
}

.logo-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: -2px;
  color: #00ffff;
  animation: glitchShift2 4s ease-in-out infinite;
  z-index: -2;
  opacity: 0.5;
}
```

**Pseudo-elements**:

- `::before` - Magenta offset layer (2px right, 70% opacity)
- `::after` - Cyan offset layer (2px left, 50% opacity)
- Both use `attr(data-text)` to duplicate text content

### Navigation Links

```css
.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-link {
  color: #00ffff;
  text-decoration: none;
  font-size: 18px;
  font-family: "JetBrains Mono", monospace;
  font-weight: 700;
  letter-spacing: 1px;
  position: relative;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #ff00cc;
  text-shadow: 0 0 10px #ff00cc;
}
```

**Interaction**:

- Default: Cyan color
- Hover: Magenta with glow
- Fast 0.2s transition

### Terminal Display

```css
.nav-terminal {
  font-size: 14px;
  color: #00ff99;
  margin-left: 20px;
  font-family: "JetBrains Mono", monospace;
}
```

### Quantum Field (Bottom Bar)

```css
.nav-quantum-field {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    #00ffff,
    #ff00cc,
    #ffff00,
    #00ff00,
    #9900ff
  );
  opacity: 0.5;
  filter: blur(1px);
}
```

**Effect**: 5-color gradient bar with blur, 50% opacity

---

## 🎭 Animations

### Logo Glitch

```css
@keyframes logoGlitch {
  0%,
  100% {
    filter: none;
  }
  10% {
    filter: blur(1px) brightness(1.2);
  }
  20% {
    filter: blur(0.5px) brightness(0.8);
  }
  30% {
    filter: blur(2px) brightness(1.4);
  }
  40% {
    filter: blur(0.5px) brightness(1.1);
  }
  50% {
    filter: none;
  }
}
```

**Effect**: Random blur and brightness glitches at 10%, 20%, 30%, 40% keyframes

### Glitch Shift 1

```css
@keyframes glitchShift1 {
  0%,
  100% {
    left: 2px;
  }
  50% {
    left: 6px;
  }
}
```

**Effect**: Pseudo-element shifts from 2px to 6px offset

### Glitch Shift 2

```css
@keyframes glitchShift2 {
  0%,
  100% {
    left: -2px;
  }
  50% {
    left: -6px;
  }
}
```

**Effect**: Pseudo-element shifts from -2px to -6px offset

### Gradient Shift

```css
@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
```

**Effect**: Scrolls gradient from left to right and back

---

## 📐 Design Patterns

### Clip-Path Strategy

Each scene uses a unique polygon to create angular, futuristic cuts:

- **Reality**: Bottom angled cut (symmetric)
- **Probability**: Diagonal cut (asymmetric)
- **Entanglement**: Top-right and bottom cuts
- **Superposition**: Sharp bottom-left cut

### Color Palette

Base backgrounds all start with dark navy (`#0a0f1a`) and transition to:

- **Reality**: Steel blue (`#1a2a3a`) - industrial, grounded
- **Probability**: Deep purple (`#1a003a`) - mysterious, uncertain
- **Entanglement**: Dark teal (`#003a2a`) - connected, organic
- **Superposition**: Dark cyan (`#003a3a`) - quantum, electric

### Stripe Patterns

Each scene has unique stripe overlay:

- **Reality**: -30° cyan stripes (2px/40px)
- **Probability**: 45° mint stripes (4px/40px)
- **Entanglement**: -60° cyan stripes (3px/30px)
- **Superposition**: 70° blue stripes (2px/50px)

### Z-Index Layering

- Backgrounds: `z-index: 0`
- Inactive scenes: `z-index: 1`
- Active scene: `z-index: 2`
- Navbar: `z-index: 10000`

---

## 🎨 Typography

**Font Families** (applied via global styles):

- Primary: `'Orbitron'`
- Code: `'JetBrains Mono'`
- Fallback: `monospace`

**Font Weights**:

- Headings: 800-900
- Body: 700
- Terminal: 400

**Letter Spacing**:

- Titles: 0.04em - 0.14em (wide)
- Code: 1-2px (specific pixel values)

---

## 🔧 Performance Optimizations

### GPU Acceleration

```css
will-change: transform, opacity, filter;
transform: translateZ(0px);
```

**Usage**: Parallax text to hint browser for GPU rendering

### Smooth Transitions

```css
transition: opacity 1.1s cubic-bezier(0.4, 0, 0.2, 1);
```

**Easing**: Custom cubic-bezier for natural motion (ease-in-out variant)

### Absolute Positioning

All scene backgrounds use `position: absolute` to prevent layout reflow during animations

---

## 🎯 Integration with HomePage.jsx

### Dynamic Background Colors

Scene backgrounds (`.bg-*`) are **static** and don't change color.  
The **parallax SVG layers** change color based on `portalState` (see HomePage.jsx lines 203-227).

### Scene Activation

JavaScript controls `.active` class based on scroll position (33% viewport detection).  
CSS handles the visual fade transition.

### Quote Highlight

Used by `<Quote />` component in Scene 2 (Probability Wave).

### Parallax Holo

Used by `<ProgressBar />` component for floating text effect.

---

## 📝 Missing Styles

**Scene 3 Elements** (no CSS defined):

- `.entanglement-network`
- `.connected-nodes`
- `.node`
- `.quantum-bridge`

These elements exist in HomePage.jsx but have **zero styling**, making them invisible placeholders.
