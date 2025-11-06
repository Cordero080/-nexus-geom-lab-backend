# Metalness Material & Lighting System

## Overview

This document covers the metalness material property and its dedicated lighting system, which is unique from standard materials.

---

## What is Metalness?

Metalness is a PBR (Physically Based Rendering) material property that determines how metallic a surface appears:

- **0.0**: Non-metallic (dielectric) - like plastic, wood, fabric
- **1.0**: Fully metallic - like chrome, gold, polished metal

### Key Characteristics

1. **Requires lighting to be visible**: Metallic surfaces reflect their environment
2. **Works with roughness**: Controls how sharp/blurry the reflections are
3. **Needs reflections**: Without lights or environment maps, appears black/dark
4. **Color behavior**: Metallic surfaces tint reflections with their base color

---

## Materials Supporting Metalness

### MeshStandardMaterial

```javascript
const material = new THREE.MeshStandardMaterial({
  color: 0xff0000, // Base color
  metalness: 1.0, // 0-1: metallic amount
  roughness: 0.2, // 0-1: surface roughness
  envMapIntensity: 1.0, // Environment map influence
});
```

### MeshPhysicalMaterial

Extended version with additional properties:

```javascript
const material = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1.0,
  roughness: 0.2,
  clearcoat: 1.0, // Clear coating layer
  clearcoatRoughness: 0.1,
  reflectivity: 1.0, // Dielectric reflectivity
});
```

---

## Roughness Pairing

Metalness always works with roughness:

| Roughness | Appearance                      | Best For                     |
| --------- | ------------------------------- | ---------------------------- |
| 0.0 - 0.2 | Mirror-like, sharp reflections  | Polished metal, chrome       |
| 0.3 - 0.5 | Semi-glossy                     | Brushed metal, painted metal |
| 0.6 - 0.8 | Matte with subtle reflections   | Worn metal, cast iron        |
| 0.9 - 1.0 | Diffuse, no visible reflections | Rust, oxidized metal         |

---

## Dedicated Lighting Hook

### Location

`/src/features/sceneControls/hooks/useMetalnessLighting.js`

### Purpose

Adds **5 directional lights** specifically when metalness is high, giving metallic surfaces more to reflect from multiple angles.

### Activation

```javascript
if (metalness > 0.4) {
  // Add extra lights
}
```

Lights only appear when metalness exceeds 0.4 threshold.

---

## Light Configuration

### 1. Left Rim Light

```javascript
Purpose: Illuminates left edge of object
Position: (-10, 5, 0)
Intensity: metalness * 3
Effect: Creates left-side highlights on metallic surfaces
```

### 2. Right Rim Light

```javascript
Purpose: Illuminates right edge of object
Position: (10, 5, 0)
Intensity: metalness * 3
Effect: Creates right-side highlights on metallic surfaces
```

### 3. Back Light

```javascript
Purpose: Lights up rear of object
Position: (0, 5, -10)
Intensity: metalness * 3
Effect: Prevents back side from being too dark
```

### 4. Volume Light (Bottom-Right)

```javascript
Purpose: Soft volumetric lighting
Position: (8, -6, 12)
Intensity: metalness * 1.5
Effect: Subtle depth and dimension, softer than rim lights
```

### 5. South Light (8 O'Clock)

```javascript
Purpose: Strong south/bottom illumination
Position: (6, -8, 12)
Intensity: metalness * 3
Effect: Illuminates underside, provides dramatic angle
```

---

## Why Multiple Lights?

Metallic surfaces are **reflective**, not emissive. They need:

1. **Light sources to reflect**: Without lights, they appear black
2. **Multiple angles**: Metallic look visible from all viewpoints
3. **Varying intensities**: Creates realistic highlights and falloff
4. **Dynamic response**: As metalness increases, reflections intensify

### Without Extra Lights

- Metallic objects may look dark or flat
- Metallic effect only visible from limited angles
- Lacks the characteristic metallic "shine"

### With Extra Lights

- Visible metallic reflections from all angles
- Edge highlights (rim lighting) emphasize form
- Gradual intensity scaling with metalness value

---

## Adjusting Metalness Lighting

### Changing Intensity Multipliers

**Location**: Each light creation section in `useMetalnessLighting.js`

```javascript
// Creation
const light = new THREE.DirectionalLight("#ffffff", metalness * X);

// Update (MUST MATCH)
lightRef.current.intensity = metalness * X;
```

**Guidelines**:

- **1-2**: Subtle metallic hints
- **3-4**: Standard metallic appearance
- **5-7**: Strong, dramatic metallic shine
- **8+**: Extreme highlights (careful of oversaturation)

### Changing Light Positions

Modify `position.set(x, y, z)` to move light sources:

```javascript
// Example: Move south light further forward and lower
southLight.position.set(6, -10, 15);
```

**Coordinate system**:

- **x**: left(-) / right(+)
- **y**: down(-) / up(+)
- **z**: back(-) / forward(+)

### Changing Activation Threshold

```javascript
if (metalness > 0.4) { // Change 0.4 to desired threshold
```

**Lower threshold (0.2-0.3)**:

- Lights activate earlier
- Subtle metallic materials get lighting

**Higher threshold (0.5-0.7)**:

- Lights only for very metallic materials
- Saves performance for non-metallic objects

### Adding New Lights

1. Create ref: `const newLightRef = useRef(null);`
2. Add creation/update logic in first useEffect
3. Add cleanup in removal section
4. Add cleanup in second useEffect (unmount)

---

## Environment Maps

For even better metallic appearance, add environment maps:

```javascript
const loader = new THREE.CubeTextureLoader();
const envMap = loader.load([
  "px.jpg",
  "nx.jpg",
  "py.jpg",
  "ny.jpg",
  "pz.jpg",
  "nz.jpg",
]);

material.envMap = envMap;
material.envMapIntensity = 1.0; // Adjust 0-2
```

Environment maps provide:

- Realistic reflections of surroundings
- Reduces need for many lights
- Better sense of space and depth

---

## Common Adjustments

### Too Bright/Washed Out

- Lower intensity multipliers (try metalness _ 2 instead of _ 3)
- Increase roughness value
- Lower envMapIntensity if using environment maps

### Too Dark/Not Metallic Enough

- Increase intensity multipliers (try metalness _ 4 or _ 5)
- Add more lights from different angles
- Lower roughness value
- Check metalness value is > 0.4

### Harsh/Unrealistic

- Reduce rim light intensity
- Add more volume/fill lights with lower intensity
- Increase roughness slightly (0.3-0.5)
- Use colored lights instead of pure white

### Flat/No Dimension

- Ensure lights are at different angles
- Add back light for depth
- Vary light intensities (some bright, some subtle)
- Check object geometry has proper normals

---

## Metalness vs. Non-Metalness

### Non-Metallic Materials (metalness: 0)

- Absorb and scatter light
- Color comes from diffuse reflection
- Examples: wood, plastic, fabric, painted surfaces

### Metallic Materials (metalness: 1)

- Reflect environment
- Color tints the reflections
- Examples: gold, silver, chrome, polished metal

### Partially Metallic (metalness: 0.3-0.7)

- Blend of both behaviors
- Useful for: worn metal, painted metal, hybrid materials

---

## Performance Considerations

### 5 Directional Lights Impact

- **Low**: Directional lights are efficient
- **Shadows**: Can be expensive if enabled
- **Threshold gating**: Only active when needed (metalness > 0.4)

### Optimization Tips

1. Don't enable shadows on all lights
2. Use lower intensity multipliers when possible
3. Consider removing volume light if not needed
4. Use environment map instead of many lights

---

## Integration with Project

### Where It's Used

- **Hook**: `useMetalnessLighting.js`
- **Called from**: Main scene setup (ThreeScene.jsx)
- **Triggered by**: Metalness slider in UI controls

### Material Controls

Metalness is adjusted via UI slider, which:

1. Updates material.metalness property
2. Triggers lighting hook to add/remove lights
3. Scales light intensity proportionally

---

## Best Practices

1. **Match creation and update intensities**: Prevents flickering
2. **Position lights around object**: Coverage from multiple angles
3. **Vary intensities**: Not all lights should be same brightness
4. **Consider roughness**: Low roughness needs more/brighter lights
5. **Use environment maps**: Better than many lights for realism
6. **Profile performance**: Monitor FPS with all lights active
7. **Disable unused lights**: Comment out if not needed for scene

---

## Troubleshooting

### Metallic objects appear black

- Check metalness > 0.4 to activate lights
- Verify lights are added to scene
- Ensure object has proper UVs and normals
- Try adding environment map

### Lights don't update with metalness slider

- Verify creation and update intensities match
- Check useEffect dependencies include metalness
- Ensure refs are properly maintained

### Inconsistent appearance across browsers

- Use standard PBR materials (MeshStandardMaterial)
- Test with environment maps
- Verify WebGL support

### Performance drops with metalness

- Disable shadows on directional lights
- Lower particle count if using particle system
- Consider LOD (Level of Detail) for complex objects

---

## Related Documentation

- `LIGHTING_CONTROLS.md` - General lighting system
- `PARTICLE_CONTROLS.md` - Particle system (doesn't use metalness)
- Three.js Documentation: [MeshStandardMaterial](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)

---

## Quick Reference

**Typical Metalness Settings**:

```javascript
// Chrome/Mirror
metalness: 1.0, roughness: 0.0

// Brushed Metal
metalness: 1.0, roughness: 0.4

// Gold
metalness: 1.0, roughness: 0.2, color: 0xffd700

// Iron/Steel
metalness: 1.0, roughness: 0.5, color: 0x888888

// Painted Metal
metalness: 0.5, roughness: 0.6

// Non-metal
metalness: 0.0, roughness: 0.8
```
