# HomePage Documentation

Complete documentation for the Nexus Geom HomePage component, including all code, styles, effects, and interactive features.

## 📁 Documentation Structure

- **[HomePage.jsx-CODE.md](./HomePage.jsx-CODE.md)** - Complete HomePage component source code with annotations
- **[QUANTUM-PORTAL-SYSTEM.md](./QUANTUM-PORTAL-SYSTEM.md)** - Color-changing scroll mechanism explained
- **[STYLES-Home.css.md](./STYLES-Home.css.md)** - Scene backgrounds, parallax effects, and animations
- **[STYLES-index.css.md](./STYLES-index.css.md)** - Global styles (navbar, title, cursor, buttons)
- **[COMPONENT-ARCHITECTURE.md](./COMPONENT-ARCHITECTURE.md)** - Component tree and relationships
- **[EFFECTS-SYSTEM.md](./EFFECTS-SYSTEM.md)** - Interactive effects (cursor, parallax, wormhole)

## 🎨 Key Features

### Quantum Portal Worlds System

- **5 Color Palettes**: Fractal, Nebula, Inferno, Emerald, Singularity
- **Dynamic Switching**: Random state change on scroll/click
- **Smooth Transitions**: 1.2s cubic-bezier animations
- **Visual Impact**: Background gradients, glyphs, navbar, stats all react

### Parallax Architecture

- **2 SVG Layers**: Background (0.08x) + Foreground (0.18x) movement
- **Mouse Reactive**: 3D depth effect following cursor
- **Scroll Reactive**: Vertical parallax on scroll

### 4 Quantum Scenes

1. **Reality Layer** - Hero section with stats, title, enter button
2. **Probability Cloud** - Floating code snippets and quote
3. **Quantum Entanglement** - Network visualization (needs CSS)
4. **Superposition State** - Quantum console output

### Interactive Effects

- **Holographic Cursor** - Radial gradient with shadow trail
- **Gravity Field** - Cursor follower effect
- **Wormhole Ripple** - Click-triggered expanding circle
- **Dimensional Rift** - Additional cursor layer

### UI Components

- **Quantum Navbar** - Fixed top bar with glitch logo, quantum glyphs, navigation links
- **Quantum Title** - 3D floating animation with glitch effects
- **Hero Stats** - Dynamic module count, quantum state label, network status
- **BeamScanButton** - Animated scan bar with code overlay
- **ProgressBar** - Floating holographic text with quantum state controls

## 🔧 Technologies

- **React 18+** - Hooks (useState, useEffect, useRef)
- **CSS3** - Gradients, clip-paths, animations, transitions
- **JavaScript** - Event listeners (scroll, mousemove, click)
- **SVG** - Parallax background/foreground layers

## 📊 File Locations

```
src/
├── HomePage/
│   ├── HomePage.jsx          # Main component (379 lines)
│   ├── Home.css              # Scene backgrounds (224 lines)
│   ├── Quote.jsx             # Quote component
│   ├── ProgressBar.jsx       # Quantum state controls
│   └── Scene.jsx             # Scene wrapper component
├── index.css                 # Global styles (523 lines)
└── components/
    └── HUD/
        └── BeamScanButton/   # Enter button component
```

## 🎯 Color System

### Portal Worlds (5 Palettes)

```javascript
portalWorlds = [
  { colors: ["#ff00cc", "#00fff7", "#1a003a"], label: "Fractal" },
  { colors: ["#ffea00", "#00ffb3", "#003a2a"], label: "Nebula" },
  { colors: ["#ff3300", "#cc00ff", "#0a0f1a"], label: "Inferno" },
  { colors: ["#00ff33", "#00aaff", "#003a3a"], label: "Emerald" },
  { colors: ["#fff", "#00fff7", "#0a0f1a"], label: "Singularity" },
];
```

### Scene Backgrounds

- **Reality**: `#0a0f1a → #1a2a3a` (dark blue gradient)
- **Probability**: `#0a0f1a → #1a003a` (dark purple gradient)
- **Entanglement**: `#0a0f1a → #003a2a` (dark teal gradient)
- **Superposition**: `#0a0f1a → #003a3a` (dark cyan gradient)

## 🔄 State Management

### React State

- `portalState` - Current color palette from portalWorlds
- `glyphState` - Current Greek symbols from glyphSets
- `activeScene` - Current scene index (0-3)

### Refs

- `parallaxRef` - Container for scene fade logic
- `fgRef` - Foreground SVG parallax layer
- `bgRef` - Background SVG parallax layer

## 📈 Performance

- **Will-change properties** for parallax elements
- **Transform3d** for GPU acceleration
- **Cubic-bezier timing** for smooth animations
- **Debounced scroll handlers** via React useEffect

## 🐛 Known Issues

- **Scene 3 Network Elements**: `.entanglement-network`, `.connected-nodes`, `.node`, `.quantum-bridge` have no CSS styling (invisible placeholders)
- **Cursor on Mobile**: Cursor effects designed for desktop (should be hidden on touch devices)

## 🚀 Future Enhancements

1. Implement Scene 3 network visualization CSS
2. Add touch event handling for mobile
3. Create scene-specific particle effects
4. Add sound effects for quantum state changes
5. Implement scene transition animations beyond fade
