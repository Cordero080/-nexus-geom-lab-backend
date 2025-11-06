# Particle Controls Documentation

## Overview

This document explains how to manually adjust nebula particle system animations in the space environment.

---

## Particle System Location

`/src/features/sceneControls/hooks/useNebulaParticles.js`

---

## Particle Configuration

### Basic Settings

#### Particle Count

```javascript
const particleCount = 400;
```

- **Range**: 100-1000+
- Lower = better performance
- Higher = denser, more detailed nebula

#### Particle Size Range

```javascript
sizes[i] = 2 + Math.random() * 3;
```

- **Formula**: `minimum + Math.random() * range`
- Current: 2 to 5 units
- Adjust minimum for smallest particles
- Adjust range multiplier for maximum size

---

## Orbital Groups

The system uses **3 separate orbital groups** with different behaviors:

### Group 0 (Inner Ring)

```javascript
baseRadius: 8 to 33 units
speedMultiplier: 1.5 (faster)
verticalSpread: 6 units
direction: Clockwise (1)
```

### Group 1 (Middle Ring)

```javascript
baseRadius: 35 to 65 units
speedMultiplier: 2.0 (medium-fast)
verticalSpread: 9 units
direction: Counter-clockwise (-1)
```

### Group 2 (Outer Ring)

```javascript
baseRadius: 67 to 90 units
speedMultiplier: 0.7 (slower)
verticalSpread: 12 units
direction: Clockwise (1)
```

---

## Adjustable Parameters

### Orbital Radius

**Location**: Initialization loop, lines ~73-85

```javascript
if (group === 0) {
  baseRadius = 8 + Math.random() * 25; // min to (min + range)
```

**To adjust**:

- Change first number (minimum radius)
- Change second number (range added to minimum)
- Example: `15 + Math.random() * 40` = 15 to 55 units

### Orbital Speed

**Location**: Initialization loop, lines ~95-97

```javascript
orbitSpeeds[i] = (0.0008 + Math.random() * 0.001) * speedMultiplier * direction;
```

**To adjust**:

- Change `0.0008` (base speed)
- Change `0.001` (random variation)
- Change `speedMultiplier` for each group
- Higher = faster rotation

### Rotation Direction

**Location**: Initialization loop, line ~93

```javascript
const direction = group === 1 ? -1 : 1;
```

**To adjust**:

- `1` = clockwise
- `-1` = counter-clockwise
- Modify logic to change which groups rotate which way

### Vertical Spread

**Location**: Initialization loop, lines ~76-84

```javascript
verticalSpread = 6; // Tighter vertical (Group 0)
verticalSpread = 9; // Medium vertical (Group 1)
verticalSpread = 12; // Wider vertical (Group 2)
```

**To adjust**:

- Lower numbers = flatter disk
- Higher numbers = taller cylinder
- Each group can have different spread

---

## Advanced Effects

### Fibonacci Spiral Influence

**Location**: Lines ~99-104

```javascript
const fibonacciAngle = i * goldenAngle;
orbitAngles[i] = orbitAngles[i] * 0.3 + fibonacciAngle * 0.7;
```

**Blend ratio** (currently 70% Fibonacci, 30% random):

- Increase `0.7` for more mathematical pattern
- Increase `0.3` for more randomness
- Must sum to 1.0

### Spiral Expansion

**Location**: Animation loop, line ~235

```javascript
const spiralExpansion =
  Math.sin(timeRef.current * 0.01 + spiralFactors[i] * Math.PI) *
  (group === 0 ? 1.5 : group === 1 ? 2 : 2.5);
```

**To adjust**:

- Change `0.01` (expansion speed)
- Change group multipliers (1.5, 2, 2.5) for wave amplitude
- Higher = more radius pulsing

### Morphing Cycle

**Location**: Animation loop, lines ~222-223

```javascript
const morphCycle = (timeRef.current * 0.05) % (Math.PI * 2); // ~60 second cycle
const morphIntensity = Math.sin(morphCycle) * 0.5 + 0.5; // 0 to 1
```

**To adjust**:

- Change `0.05` (morph speed - lower = slower cycle)
- Morph creates pattern transitions every ~60 seconds
- Affects color shifts and size pulsing

### Turbulence

**Location**: Animation loop, lines ~253-254

```javascript
const turbulence = Math.sin(timeRef.current * 0.3 + phases[i]) * 0.2;
const driftY = Math.sin(timeRef.current * 0.05 + phases[i]) * 0.008;
```

**To adjust**:

- Change multipliers (0.2, 0.008) for drift amount
- Change frequency (0.3, 0.05) for drift speed
- Higher = more chaotic motion

---

## Cellular Automata

### Update Frequency

**Location**: Line ~226

```javascript
if (Math.floor(timeRef.current) % 3 === 0)
```

**To adjust**:

- Change `3` to update more/less frequently
- Higher = slower spreading, better performance
- Lower = faster spreading, more CPU intensive

### Neighbor Detection

**Location**: Line ~235

```javascript
const neighborDistance = 15; // Detection radius
```

**To adjust**:

- Higher = cells sense farther neighbors
- Lower = more localized spreading

### Automata Rules

**Location**: Lines ~247-256

```javascript
// Alive cell: survive with 2-5 neighbors
// Dead cell: born with 3-4 neighbors
```

**To adjust**:

- Change neighbor count thresholds
- Modify for different spreading patterns

### Cell Energy

**Location**: Line ~259

```javascript
cellEnergy[i] = Math.min(1, totalEnergy * 0.15 + cellEnergy[i] * 0.8);
```

**To adjust**:

- Change `0.15` (energy spread rate)
- Change `0.8` (energy retention)
- Change `0.95` (decay rate when dead)

---

## Fractal Generation

### Julia Set Parameters

**Location**: Lines ~267-269

```javascript
const fractalTime = timeRef.current * 0.02;
const cX = Math.cos(fractalTime) * 0.7; // Complex constant
const cY = Math.sin(fractalTime) * 0.3;
```

**To adjust**:

- Change `0.02` (rotation speed of fractal pattern)
- Change `0.7` and `0.3` (fractal shape constants)
- Experiment with values 0.1 to 1.0

### Iteration Depth

**Location**: Line ~280

```javascript
const maxIterations = 20;
```

**To adjust**:

- Higher = more detailed fractal, slower performance
- Lower = simpler fractal, better performance
- Range: 10-50 typical

---

## Color Controls

### Base Color Range

**Location**: Initialization loop, line ~128

```javascript
const hue = (sheet / 5) * 0.2 + 0.55; // Purple to pink range
```

**To adjust**:

- Change `0.55` (base hue: 0=red, 0.33=green, 0.66=blue)
- Change `0.2` (hue variation range)

### Color Cycling

**Location**: Animation loop, lines ~306-320

```javascript
const baseHue = (Math.sin(colorPhase) * 0.1 + 0.6 + environmentHue / 360) % 1;
const morphHue = (spiralFactors[i] + morphCycle * 0.1) % 1;
```

**To adjust**:

- Change blend ratios for more/less rainbow effect
- Modify saturation: `1.7 + morphIntensity * 0.2`
- Modify lightness: `0.5` (base) or add variation

### Cellular Automata Color Effect

**Location**: Lines ~324-326

```javascript
if (cellStates[i] === 1) {
  hue = (hue + cellEnergy[i] * 0.2) % 1; // Energy shifts hue
}
```

**To adjust**:

- Change `0.2` (how much energy shifts color)
- Modify brightness boost in lines 332-334

### Fractal Color Influence

**Location**: Lines ~329-330

```javascript
const fractalHue = (fractalIterations[i] + timeRef.current * 0.01) % 1;
hue = hue * 0.7 + fractalHue * 0.3; // 70% base, 30% fractal
```

**To adjust**:

- Change blend ratio (0.7 / 0.3)
- Higher fractal influence = more color variation across disk

---

## Size Effects

### Base Size Morphing

**Location**: Line ~343

```javascript
let baseSize = (2 + Math.random() * 2) * (1 + morphIntensity * 0.3);
```

**To adjust**:

- Change range (2 to 4 currently)
- Change morph amplitude (0.3 = 30% size increase)

### Cellular Automata Size Effect

**Location**: Lines ~346-348

```javascript
if (cellStates[i] === 1) {
  baseSize *= 1 + cellEnergy[i] * 0.5; // Up to 50% larger
}
```

**To adjust**:

- Change `0.5` for more/less size increase
- Alive cells glow larger

### Fractal Size Pulsing

**Location**: Lines ~351-353

```javascript
if (fractalIterations[i] > 0.7) {
  baseSize *= 1 + Math.sin(timeRef.current * 2 + i) * 0.2;
}
```

**To adjust**:

- Change `0.7` threshold (which particles pulse)
- Change pulse frequency (2) and amplitude (0.2)

---

## Material Properties

### Texture Gradient

**Location**: Lines ~144-148

```javascript
gradient.addColorStop(0, "rgba(221, 35, 218, 1)");
gradient.addColorStop(0.3, "rgba(83, 242, 10, 0.83)");
gradient.addColorStop(0.6, "rgba(221, 8, 186, 0.58)");
gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
```

**To adjust**:

- Change RGBA values for different colors
- Adjust color stop positions (0, 0.3, 0.6, 1)
- Alpha channel (last number) controls transparency

### PointsMaterial Settings

**Location**: Lines ~153-161

```javascript
size: 3,
opacity: 0.5,
blending: THREE.AdditiveBlending,
```

**To adjust**:

- `size`: Base particle size (3 units currently)
- `opacity`: Overall transparency (0-1)
- `blending`: Change to `THREE.NormalBlending` for different look

---

## Performance Optimization

### Reduce Particle Count

Lower `particleCount` from 400 to 200-300

### Reduce Update Frequency

Increase cellular automata check: `% 3` to `% 5` or `% 10`

### Simplify Fractals

Lower `maxIterations` from 20 to 10-15

### Disable Effects

Comment out cellular automata or fractal sections if not needed

---

## Integration with Scene

### Speed Control

Particles respond to the `orbSpeedRef` slider:

```javascript
const speed = orbSpeedRef?.current || 1.0;
timeRef.current += 0.1 * speed;
```

All animation speeds scale with this multiplier.

### Environment Activation

Particles only appear in 'space' environment:

```javascript
if (environment !== "space") {
  // Cleanup and don't render
}
```

---

## Quick Adjustment Guide

**Want slower orbits?**

- Reduce `speedMultiplier` for each group

**Want tighter rings?**

- Reduce `baseRadius` ranges
- Reduce `verticalSpread` values

**Want more dramatic spreading?**

- Increase cellular automata `neighborDistance`
- Reduce update frequency `% 3` to `% 2`

**Want calmer particles?**

- Reduce turbulence multipliers
- Increase morph cycle time (lower `0.05`)
- Reduce fractal influence blend

**Want more visible fractal patterns?**

- Increase fractal color blend from 0.3 to 0.5+
- Lower fractal pulse threshold from 0.7 to 0.5

---

## Related Files

- `/src/features/sceneControls/hooks/useNebulaParticles.js` - Main particle system
- `/src/features/sceneControls/ThreeScene.jsx` - Scene integration
- See `LIGHTING_CONTROLS.md` for lighting interactions
- See `METALNESS_MATERIAL.md` for metalness-specific rendering
