# Audio Reactive System Documentation

## Overview

The audio reactive system transforms microphone input into dynamic 3D geometry animations and color changes. It uses real-time frequency analysis (FFT) to map different audio ranges to specific visual behaviors, creating an immersive audio-visual experience.

---

## System Architecture

### Core Components

1. **`useAudioAnalyzer`** (`/src/features/audio/hooks/useAudioAnalyzer.js`)

   - Captures microphone input via Web Audio API
   - Analyzes frequency data using FFT (Fast Fourier Transform)
   - Outputs normalized frequency bands: bass, mids, highs, overall

2. **`useAudioReactive`** (`/src/features/audio/hooks/useAudioReactive.js`)
   - Consumes frequency data from analyzer
   - Applies transformations to geometry (rotation, scale, position)
   - Manages color cycling system
   - Implements momentum-based physics

---

## Frequency Mapping

### Bass Frequencies (20-250 Hz)

**What it controls:**

- **X-axis Rotation** (horizontal tumbling)

  - Velocity multiplier: `1.0`
  - Primary visual indicator of bass presence
  - Fast, dramatic spinning

- **Scale/Pulsing** (growth)

  - Only activates when bass exceeds **0.6 threshold** (60% of normalized range)
  - Max growth: **20%** (scaleFactor = 1.2)
  - **Design Decision**: Keeps object stable during normal audio, only "pulses" with loud bass kicks

- **Z-Position Movement** (forward/backward depth)
  - Moves object toward/away from camera
  - Movement amount: `normalizedBass * 0.5`
  - Creates depth perception tied to bass intensity

**Why these choices:**

- Bass is the most visceral frequency range in music
- X-axis rotation is highly visible and dramatic
- Growth only on loud bass prevents constant jittering
- Z-movement adds 3D depth without being disorienting

---

### Mid Frequencies (250-2000 Hz)

**What it controls:**

- **Y-axis Rotation** (vertical spinning)
  - Velocity multiplier: `0.03` (very slow)
  - Subtle, gradual rotation
- **Z-axis Rotation** (rolling)
  - Velocity multiplier: `0.75` (medium speed)
  - Secondary rotation layer

**Why these choices:**

- Mids are less prominent than bass, so lower multipliers prevent overwhelming the visual
- Y-axis rotation is slower to provide subtle contrast to fast X-axis bass rotation
- Z-axis at medium speed fills in the motion without competing with bass

---

### High Frequencies (2000-20000 Hz)

**Current Status:** Not actively used for geometry transformations

**Why:**

- Highs are analyzed but not mapped to visual changes
- Initial testing showed highs were too erratic and distracting
- Could be mapped to particle effects, color intensity, or lighting in future versions

**Potential Future Uses:**

- Particle burst effects
- Material shininess/metalness
- Emissive glow intensity
- Edge highlighting

---

## Noise Filtering System

### Thresholds

```javascript
const bassThreshold = 0.55; // 55% threshold
const midsThreshold = 0.5; // 50% threshold
```

**How it works:**

1. Raw frequency data (0-1 range) is checked against threshold
2. If below threshold → value set to 0 (no reaction)
3. If above threshold → subtract threshold and rescale to 0-1

**Example:**

```
Raw bass = 0.7
Threshold = 0.55
Active bass = 0.7 - 0.55 = 0.15
Normalized = 0.15 / (1 - 0.55) = 0.33 (33% strength)
```

**Design Decisions:**

- **Why 55%/50%?** Testing showed these values filter out ambient noise (crickets, room tone, breathing) while still responding to intentional sounds
- **Lower = more sensitive** (reacts to quieter sounds)
- **Higher = less sensitive** (only loud sounds trigger reactions)
- Current values strike balance between responsiveness and stability

---

## Physics System

### Momentum & Friction

**Velocity Accumulation:**

```javascript
velocity.x += normalizedBass * 1.0; // Bass adds to X rotation
velocity.y += normalizedMids * 0.03; // Mids add to Y rotation
velocity.z += normalizedMids * 0.75; // Mids add to Z rotation
```

**Friction Application:**

```javascript
const friction = 0.5; // 50% friction per frame
velocity.x *= friction;
velocity.y *= friction;
velocity.z *= friction;
```

**How it feels:**

- Object speeds up gradually as audio continues
- When audio stops, object decelerates smoothly (not instant stop)
- **50% friction** means velocity halves each frame when no audio
- Creates natural, organic movement

**Design Decision:**

- 50% friction feels "snappy" - stops quickly but not jarringly
- Lower friction (0.7-0.9) would spin longer after audio stops
- Higher friction (0.3) would stop too abruptly
- Current value provides responsive feel with natural physics

---

## Color Cycling System

### Overview

Mesh and hyperframe change colors **independently** every 3 full rotations, creating dynamic, evolving color combinations.

### Color Palettes

**Mesh Colors (Dark):**

```javascript
0x670d48, // Dark magenta (base color)
0x0d6748, // Dark teal
0x67480d, // Dark amber
0x0d4867, // Dark blue
0x48670d, // Dark olive green
0x480d67, // Dark purple
0x670d30, // Dark crimson
0x30670d, // Dark lime
```

**Hyperframe Colors (Bright):**

```javascript
0xff1a8c, // Bright magenta
0x1affb3, // Bright teal
0xffb31a, // Bright amber
0x1a8cff, // Bright blue
0xb3ff1a, // Bright lime green
0xb31aff, // Bright purple
0xff1a66, // Bright pink-red
0x66ff1a, // Bright chartreuse
```

### Rotation Tracking

**Mesh:**

- Tracks **X-axis rotation** only
- Changes color every 3 full rotations (3 × 2π radians)
- Driven primarily by bass

**Hyperframe:**

- Tracks **combined X+Y rotation** (`rotationX + rotationY`)
- Changes color every 3 full combined rotations
- Faster color changes due to dual-axis tracking
- More responsive to varied audio

### Design Decisions

**Why separate tracking?**

- Mesh and hyperframe drift out of sync → creates unexpected, dynamic color pairings
- Prevents colors from always changing together
- More visually interesting evolution

**Why every 3 rotations?**

- 5 rotations felt too slow (took too long to see color changes)
- 1-2 rotations felt too chaotic (colors changing constantly)
- 3 is the "Goldilocks zone" - frequent enough to be exciting, slow enough to appreciate

**Why darker mesh + brighter hyperframe?**

- Creates depth and layering
- Bright hyperframe "pops" against darker solid mesh
- Mirrors real-world lighting (bright highlights on darker surfaces)
- Prevents visual overload (all bright would be overwhelming)

**Why complementary colors?**

- Based on base color (#670d48 - dark magenta)
- Rotates through color wheel (magenta → teal → amber → blue → green → purple)
- Ensures colors work well together aesthetically
- Provides variety without clashing

---

## Performance Considerations

### FFT Size

```javascript
analyzer.fftSize = 512;
```

**Trade-offs:**

- **Smaller FFT (256)** = Faster analysis, less frequency resolution
- **Larger FFT (2048)** = More accurate frequencies, slower processing
- **512** = Sweet spot for real-time reactivity with acceptable accuracy

### Smoothing

```javascript
analyzer.smoothingTimeConstant = 0;
```

**Why 0?**

- No smoothing = instant response to audio changes
- Value of 0.8-0.9 would create lag/averaging
- Current setting prioritizes snappy, immediate reactions

### Animation Frame Rate

- Runs in `requestAnimationFrame` loop (60 FPS)
- Calculations are lightweight (no heavy geometry modifications)
- Color changes are infrequent (every 3 rotations)

---

## Control Parameters Reference

### Location in Code

`/src/features/audio/hooks/useAudioReactive.js`

### Adjustable Parameters

| Parameter                | Line       | Current Value | What it controls                         |
| ------------------------ | ---------- | ------------- | ---------------------------------------- |
| `bassThreshold`          | ~35        | 0.55          | Minimum bass level to trigger reactions  |
| `midsThreshold`          | ~36        | 0.5           | Minimum mids level to trigger reactions  |
| `growthThreshold`        | ~75        | 0.6           | How loud bass needs to be before scaling |
| `scaleAmount multiplier` | ~78        | 0.2           | Max growth amount (20% bigger)           |
| `velocity.y multiplier`  | ~83        | 0.03          | Y-axis rotation speed from mids          |
| `velocity.x multiplier`  | ~84        | 1.0           | X-axis rotation speed from bass          |
| `velocity.z multiplier`  | ~85        | 0.75          | Z-axis rotation speed from mids          |
| `friction`               | ~88        | 0.5           | How quickly rotation slows down          |
| Rotation trigger         | ~105, ~127 | `% 3 === 0`   | Color change every N rotations           |

### How to Tune

**More sensitive to quiet sounds:**

- Lower `bassThreshold` (try 0.4-0.5)
- Lower `midsThreshold` (try 0.3-0.4)

**Less sensitive (only loud sounds):**

- Raise `bassThreshold` (try 0.6-0.7)
- Raise `midsThreshold` (try 0.6-0.7)

**Faster spinning:**

- Increase velocity multipliers (bass: try 1.5-2.0)
- Decrease friction (try 0.6-0.8)

**Slower spinning:**

- Decrease velocity multipliers (bass: try 0.5-0.8)
- Increase friction (try 0.3-0.4)

**More frequent color changes:**

- Change rotation trigger from `% 3` to `% 2` or `% 1`

**Less frequent color changes:**

- Change rotation trigger from `% 3` to `% 5` or `% 7`

---

## Future Enhancements

### Potential Features

1. **High frequency mapping**
   - Particle bursts on sharp transients
   - Material shininess modulation
2. **User-customizable palettes**

   - Color picker for custom cycling palettes
   - Preset themes (warm, cool, neon, etc.)

3. **Multiple color change modes**

   - Time-based (every N seconds)
   - Audio intensity-based (change on loud peaks)
   - Beat detection (change on detected beats)

4. **Advanced audio analysis**

   - Beat detection (BPM)
   - Onset detection (sudden transients)
   - Spectral centroid (brightness of sound)

5. **Visual feedback**
   - Real-time frequency spectrum display
   - Threshold indicators
   - Rotation counter display

---

## Technical Notes

### Browser Compatibility

- Requires modern browser with Web Audio API support
- Works in Chrome, Firefox, Edge, Safari
- Requires HTTPS or localhost (microphone permissions)

### Microphone Permissions

- User must grant permission on first use
- Permission persists per-domain
- Clear error messages if denied

### Audio Processing Flags

```javascript
audio: {
  echoCancellation: false,
  noiseSuppression: false,
  autoGainControl: false,
}
```

**Why all false?**

- We want raw audio for accurate frequency analysis
- Browser processing can dampen bass/transients
- Manual threshold system handles noise filtering

---

## Credits & Inspiration

**Design Philosophy:**

- Audio should enhance, not distract
- Natural physics feel more organic than instant snapping
- Visual rewards (color changes) should be tied to user engagement (spinning from audio)
- Balance between responsiveness and stability

**Influences:**

- Music visualizers (Milkdrop, Plane9)
- VJ software (Resolume, TouchDesigner)
- Game audio-reactive systems (Audiosurf, Beat Saber)

---

## Stretch Goals & Future Features

### 🎯 Immediate Enhancements

#### 1. Smooth Color Transitions (Gradient Blending)

**Status:** Ready to implement

Instead of instant color snapping, lerp (linearly interpolate) between colors over time:

```javascript
// Blend from current color to target color over N frames
material.color.lerp(targetColor, 0.1); // 10% blend per frame
```

**Benefits:**

- Smoother, more organic visual flow
- Reduces jarring color switches
- More "musical" feel to color changes

---

### 🎵 Beat Detection & Rhythm

#### 2. Beat Detection System

Detect bass drum hits and trigger instant effects:

- **Pulse kicks**: Quick scale burst on each beat
- **Camera shake**: Subtle camera movement on heavy beats
- **Particle bursts**: Spawn particles on beat hits
- **Flash effects**: Brief emissive intensity spike

**Technical approach:**

- Track bass peaks over time
- Detect sudden increases (onset detection)
- Debounce to prevent multiple triggers
- Calculate BPM from beat intervals

#### 3. BPM-Synced Animations

- Auto-detect song tempo
- Sync rotation speed to detected BPM
- Color changes align with musical phrases (every 4/8/16 beats)
- Camera movements follow rhythm

---

### 🎨 Advanced Color Systems

#### 4. Multiple Color Modes

**Gradient Mode**: Colors blend smoothly instead of snapping (see #1)

**Beat-Synced Mode**: Colors change on detected beats, not rotation count

**Spectrum Mode**: Map frequency spectrum directly to rainbow gradient

- Bass = red/orange
- Mids = green/yellow
- Highs = blue/purple

**Complementary Split Mode**: Mesh and hyperframe use opposite color wheel sides

- Always contrasting colors
- Automatically harmonious

#### 5. User-Customizable Palettes

- Color picker for custom cycling palettes
- Save/load palette presets
- Random palette generator
- Import palettes from images

---

### 🔊 High Frequency Utilization

#### 6. Material Shimmer

Modulate metalness/roughness with hi-hats and cymbals:

```javascript
material.metalness = baseMetal + normalizedHighs * 0.3;
material.roughness = baseRough - normalizedHighs * 0.2;
```

#### 7. Edge Glow Effects

Emissive intensity pulses with high transients:

- Sharp sounds (snares, hi-hats) = brief glow
- Creates sparkle/shimmer effect
- Complements bass-driven rotation

#### 8. Particle Trails

Spawn particle systems on high frequency spikes:

- Leave colored trails during movement
- Particles fade out over time
- Color matches current mesh/hyperframe color

---

### 🌊 Multi-Object Choreography

#### 9. Frequency-Based Object Assignment

With multiple objects:

- Object 1 → Bass only (red colors)
- Object 2 → Mids only (green colors)
- Object 3 → Highs only (blue colors)

#### 10. Wave Propagation

Color changes ripple across objects:

- First object changes color
- Delay 200ms → Second object changes
- Creates "wave" or "domino" effect

#### 11. Audio Intensity Orbiting

Objects orbit faster/slower based on overall volume:

```javascript
orbitSpeed = baseSpeed + audioData.overall * speedMultiplier;
```

---

### 📊 Visualizer & Feedback

#### 12. Live Frequency Spectrum Display

Overlay showing real-time frequency bars:

- Bass (red), Mids (green), Highs (blue)
- Shows what frequencies are active
- Helps users understand what's driving animations

#### 13. Rotation Counter

Display showing:

- Current rotation count
- Progress to next color change (e.g., "2.7 / 3 rotations")
- Builds anticipation

#### 14. Waveform Display

Real-time audio waveform visualization:

- Shows current audio amplitude
- Separate waveforms for bass/mids/highs
- Educational and aesthetic

---

### 🎥 Camera Reactions

#### 15. Bass-Driven Zoom

Camera moves closer during loud bass:

```javascript
camera.position.z = baseDistance - normalizedBass * zoomAmount;
```

#### 16. FOV Pulse

Field of view expands/contracts with rhythm:

- Creates breathing/pulsing perspective
- Subtle but impactful

#### 17. Tempo-Synced Orbit

Camera orbit speed matches detected BPM:

- Smooth, musical camera movement
- Enhances rhythm connection

---

### 🌀 Vertex Deformation

#### 18. Waveform Vertex Displacement

Deform geometry vertices based on audio:

- Each vertex moves in/out with frequency data
- Creates organic, flowing shapes
- Bass = large deformations, Highs = small ripples

#### 19. Geometry Morphing

Transition between different geometries based on audio intensity:

- Quiet = Sphere
- Medium = Icosahedron
- Loud = Complex polyhedron

---

### 🎛️ User Controls

#### 20. Real-Time Sensitivity Sliders

UI controls for:

- Bass/Mids/Highs thresholds
- Rotation speed multipliers
- Friction amount
- Color change frequency

#### 21. Feature Toggles

Enable/disable individual features:

- ☑ Rotation
- ☑ Scaling
- ☑ Color cycling
- ☑ Z-position movement

#### 22. Audio Presets

Save/load complete audio configurations:

- "Chill" - subtle reactions
- "Intense" - aggressive responses
- "Visualizer" - max everything
- Custom user presets

---

### 💡 Lighting Integration

#### 23. Frequency-Mapped Lights

Light colors follow audio spectrum:

```javascript
bassLight.color = new Color(bass, 0, 0); // Red
midsLight.color = new Color(0, mids, 0); // Green
highsLight.color = new Color(0, 0, highs); // Blue
```

#### 24. Volume-Driven Intensity

All lights pulse brighter with overall audio level:

```javascript
light.intensity = baseIntensity + audioData.overall * multiplier;
```

#### 25. Dynamic Point Lights

Spawn temporary lights at vertex positions during loud sections:

- Appear on bass hits
- Fade out over 1-2 seconds
- Create dynamic lighting scenery

---

### 🌟 Echo & History Effects

#### 26. Ghost Trails

Leave semi-transparent copies of mesh behind during movement:

- More ghosts = louder audio
- Fade out over time
- Creates motion blur effect

#### 27. Volume Memory

Object maintains larger scale for seconds after loud bass:

- Slow decay back to normal size
- Visual "echo" of audio intensity

#### 28. Rhythm Learning

System analyzes audio over time:

- Detects repeated patterns
- Predicts upcoming beats
- Pre-animates anticipatory movements

---

### 🎯 Priority Recommendations

**Quick Wins (Easy to implement):**

1. ✅ **Smooth color transitions** (lerp blending) - READY TO BUILD
2. High frequency → emissive intensity
3. Real-time sensitivity sliders

**Medium Effort (High Impact):** 4. Beat detection system 5. Multi-object frequency assignment 6. Visualizer overlay

**Advanced (Long-term):** 7. Vertex deformation 8. Geometry morphing 9. Rhythm learning AI

---

## Next Steps

Ready to implement smooth color transitions! This will make the color cycling feel more polished and musical.
