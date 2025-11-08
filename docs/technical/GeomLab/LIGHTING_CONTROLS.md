# Lighting Controls Documentation

## Overview

This document explains how to manually adjust lighting for all animations in the Nexus Geom Lab project.

---

## General Scene Lighting

### Ambient Light

- **Purpose**: Base illumination for all objects
- **Location**: Main scene setup
- **Properties**:
  - `color`: Overall light color
  - `intensity`: Brightness level (typical range: 0.3-1.0)

### Directional Lights

Standard directional lights provide primary illumination from specific angles.

**Parameters**:

```javascript
new THREE.DirectionalLight(color, intensity);
light.position.set(x, y, z);
```

- **color**: Hex color code (e.g., `"#ffffff"` for white)
- **intensity**: Brightness multiplier (typical range: 0.5-5.0)
- **position.set(x, y, z)**:
  - `x`: left(-) / right(+)
  - `y`: down(-) / up(+)
  - `z`: back(-) / forward(+)

---

## Metalness-Specific Lighting

### Hook Location

`/src/features/sceneControls/hooks/useMetalnessLighting.js`

### Activation Threshold

Metalness lights only activate when `metalness > 0.4`

### Current Light Configuration

#### 1. Left Rim Light

```javascript
Intensity: metalness * 3
Position: (-10, 5, 0)
Purpose: Lights up left side of metallic objects
```

#### 2. Right Rim Light

```javascript
Intensity: metalness * 3
Position: (10, 5, 0)
Purpose: Lights up right side of metallic objects
```

#### 3. Back Light

```javascript
Intensity: metalness * 3
Position: (0, 5, -10)
Purpose: Lights up back side of metallic objects
```

#### 4. Volume Light (Bottom-Right)

```javascript
Intensity: metalness * 1.5
Position: (8, -6, 12)
Purpose: Soft light for depth and volume
```

#### 5. South Light (8 O'Clock)

```javascript
Intensity: metalness * 3
Position: (6, -8, 12)
Purpose: Strong illumination from south/bottom angle
```

---

## How to Adjust Lighting

### Changing Light Intensity

1. Locate the light creation section (e.g., `new THREE.DirectionalLight(...)`)
2. Modify the multiplier: `metalness * X` where X is your desired multiplier
3. **IMPORTANT**: Update BOTH locations:
   - Creation line: `new THREE.DirectionalLight("#ffffff", metalness * X)`
   - Update line: `lightRef.current.intensity = metalness * X`

**Intensity Guidelines**:

- **0.5-1.5**: Subtle, soft lighting
- **2-3**: Standard lighting
- **4-7**: Strong, dramatic lighting
- **8+**: Very bright, harsh lighting

### Changing Light Position

Modify the `position.set(x, y, z)` values:

**Example Positions**:

- Top: `(0, 10, 0)`
- Bottom: `(0, -10, 0)`
- Front: `(0, 0, 10)`
- Back: `(0, 0, -10)`
- Left: `(-10, 0, 0)`
- Right: `(10, 0, 0)`

**Diagonal Examples**:

- Top-Front-Right: `(8, 6, 8)`
- Bottom-Back-Left: `(-8, -6, -8)`

### Changing Light Color

Replace `"#ffffff"` with any hex color:

- Warm white: `"#fff5e6"`
- Cool white: `"#e6f2ff"`
- Blue tint: `"#cce6ff"`
- Amber: `"#ffbf80"`

---

## Tips for Metalness Materials

1. **More lights = more reflections**: Metallic surfaces reflect their environment
2. **Angle variation**: Lights from different angles show metallic effect from all viewpoints
3. **Intensity balance**: Too bright washes out; too dim loses metallic shine
4. **Color consideration**: White lights show true metallic color; tinted lights create mood

---

## Common Adjustments

### Make metallic objects brighter overall

- Increase all intensity multipliers by +1 or +2

### Add more dramatic metallic effect

- Increase rim light intensity (multiply by 4-5)
- Add contrasting back light

### Soften metallic appearance

- Reduce all multipliers to 1-2 range
- Lower the activation threshold from 0.4 to 0.3

### Fix dark metallic objects

- Check that lights are positioned around the object
- Ensure metalness value is > 0.4 to activate extra lights
- Consider adding environment map for better reflections

---

## Related Files

- `/src/features/sceneControls/hooks/useMetalnessLighting.js` - Metalness lighting hook
- `/src/features/sceneControls/ThreeScene.jsx` - Main scene setup
- See `PARTICLE_CONTROLS.md` for particle-specific lighting interactions
