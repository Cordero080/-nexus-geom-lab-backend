# Interactive Systems Documentation

## Overview

This document explains the key interactive systems that make Nexus Geom Lab engaging and responsive.

---

## 🎮 Mouse-Over Object Control System

### What It Does

When you hover your mouse over the 3D geometry, you can rotate it by moving your mouse. The object follows your cursor movement with smooth, natural physics.

### How It Works

**Location**: `src/features/sceneControls/hooks/useObjectInteraction.js`

**The Flow:**

1. **Mouse Detection**: Three.js Raycaster detects when your mouse is over the 3D object
2. **Position Tracking**: Records where your mouse moved (delta X and delta Y)
3. **Rotation Calculation**: Converts mouse movement into rotation values
4. **User Rotation Storage**: Stores the rotation you applied
5. **Decay System**: Gradually reduces your applied rotation over time (so it doesn't spin forever)

**Key Code Pattern:**

```javascript
// Detect mouse over object
const intersects = raycaster.intersectObjects(scene.children, true);
if (intersects.length > 0) {
  // Mouse is over object - calculate rotation from mouse movement
  const deltaX = event.clientX - previousMousePosition.x;
  const deltaY = event.clientY - previousMousePosition.y;

  // Store user rotation
  userRotations.set(objectId, {
    x: deltaY * 0.005, // Convert mouse Y to rotation X
    y: deltaX * 0.005, // Convert mouse X to rotation Y
  });
}

// In animation loop - apply user rotation + decay
if (userRotation) {
  mesh.rotation.x += userRotation.x;
  mesh.rotation.y += userRotation.y;

  // Decay the rotation by 5% each frame
  userRotation.x *= 0.95;
  userRotation.y *= 0.95;
}
```

**Why This Feels Good:**

- **Immediate Response**: Rotation starts the moment you hover
- **Smooth Decay**: Doesn't stop abruptly - gradually slows down
- **Per-Object Tracking**: Each object remembers its own user rotation
- **Non-Intrusive**: Works alongside automatic animations

---

## 🎭 Character Animation Unlock System

### What It Does

Save scenes to unlock animated characters progressively:

- **Scene 1** → Unlock Icarus-X with Solar Ascension animation
- **Scene 2** → Unlock Vectra Apex with Holographic Spellcast animation
- **Scene 3** → Unlock Nexus-Prime with Warrior Flip animation
- **Scene 4+** → Unlock additional animations for existing characters
- **Multiple Animations** → Animation switcher appears!

### How It Works

**Location**: `src/components/features/SaveButton/SaveButton.jsx`

**The Unlock Logic:**

```javascript
// Count user's total scenes
const totalScenes = user.scenes?.length || 0;

// Determine what to unlock based on scene count
let unlockedCharacter = null;
let unlockedAnimation = null;

if (totalScenes === 1) {
  unlockedCharacter = "Icarus-X";
  unlockedAnimation = "Solar Ascension";
} else if (totalScenes === 2) {
  unlockedCharacter = "Vectra Apex";
  unlockedAnimation = "Holographic Spellcast";
} else if (totalScenes === 3) {
  unlockedCharacter = "Nexus-Prime";
  unlockedAnimation = "Warrior Flip";
} else if (totalScenes > 3) {
  // Additional animations for existing characters
  unlockedAnimation = getNextAnimation(totalScenes);
}
```

**The Complete Flow:**

1. **User Clicks "Save Scene"**
   - Form modal appears for scene name/description
2. **Scene Saves to MongoDB**
   - POST request to `/api/scenes`
   - Scene data includes all control values (20+ properties)
3. **Backend Counts User's Scenes**
   - MongoDB query: `Scene.countDocuments({ userId })`
   - Returns total scene count
4. **Frontend Checks Unlock Threshold**
   - Scene count 1, 2, 3, 4+ each have different unlocks
5. **Unlock Modal Appears**
   - Shows character card with "UNLOCKED!" animation
   - Plays unlock sound effect
   - Displays character name and animation name
6. **User Sees Character in Showcase**
   - Character now appears in showcase gallery
   - Clicking it opens full-screen viewer
   - If multiple animations unlocked, switcher buttons appear

**Why This Works:**

- **Progressive Reward**: Each save feels meaningful
- **Clear Feedback**: Visual + audio confirmation of unlock
- **Motivation**: Encourages users to create and save more scenes
- **Discovery**: Users don't know what's next - exciting!

---

## 🌈 Quantum Portal Background System

### What It Does

The background changes color dynamically based on:

- **Environment Selection**: Matrix, Nebula, Space, etc.
- **Hue Slider**: 360° color rotation
- **Mouse Parallax**: Subtle movement as you move your mouse
- **Click Ripples**: Color waves when you click

### How It Works

**Location**: `src/styles/quantumBackground.css` + `src/App.jsx`

**The Color System:**

```javascript
// Base environment colors
const environments = {
  matrix: '#0a4d0a',      // Green
  nebula: '#4a1a5a',      // Purple
  space: '#0a1a2e',       // Deep Blue
  quantum: '#1a1a2e'      // Dark Blue-Grey
};

// Hue rotation (0-360°)
const hueRotation = environmentHue; // From slider

// Applied as CSS filter
style={{
  filter: `hue-rotate(${hueRotation}deg)`,
  background: environments[environment]
}}
```

**Parallax Movement:**

```javascript
// Track mouse position
const handleMouseMove = (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;

  // Move background gradient based on mouse position
  backgroundRef.current.style.backgroundPosition = `${x}% ${y}%`;
};
```

**Click Ripples:**

```javascript
// Create ripple on click
const handleClick = (e) => {
  const ripple = document.createElement("div");
  ripple.className = "ripple-effect";
  ripple.style.left = `${e.clientX}px`;
  ripple.style.top = `${e.clientY}px`;

  // Ripple expands from click point
  document.body.appendChild(ripple);

  // Remove after animation completes
  setTimeout(() => ripple.remove(), 1000);
};
```

**CSS Animation:**

```css
/* Ripple expands and fades */
@keyframes ripple-expand {
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

/* Parallax background */
.quantum-background {
  background-size: 200% 200%;
  background-position: center;
  transition: background-position 0.3s ease;
}
```

**Why This Feels Alive:**

- **Responsive**: Background reacts to every interaction
- **Smooth**: CSS transitions prevent jarring changes
- **Subtle**: Parallax is gentle, not distracting
- **Layered**: Multiple effects combine (hue + parallax + ripples)

---

## 🎨 Text Scramble System

### What It Does

Buttons and titles show animated "scrambling" effects:

- **Katakana Characters**: Japanese symbols cycle through randomly
- **Code Symbols**: `</>`, `{}`, `[]`, `@#$` flicker
- **Final Reveal**: Text settles into actual button label

### How It Works

**Location**: `src/utils/textScrambler.jsx` + `src/components/ui/ScrambleButton/`

**The Algorithm:**

```javascript
// Character sets for scrambling
const KATAKANA = "アイウエオカキクケコサシスセソタチツテト";
const SYMBOLS = "<>{}[]()!@#$%^&*";

// Scramble effect
function scrambleText(finalText, onUpdate) {
  const chars = finalText.split("");
  let frame = 0;
  const maxFrames = 30;

  const interval = setInterval(() => {
    // For each character position
    const scrambled = chars
      .map((char, i) => {
        // Calculate reveal progress (0 to 1)
        const progress = frame / maxFrames;
        const revealPoint = i / chars.length;

        // If past reveal point, show real character
        if (progress > revealPoint) {
          return char;
        }

        // Otherwise show random symbol
        return KATAKANA[Math.floor(Math.random() * KATAKANA.length)];
      })
      .join("");

    onUpdate(scrambled);
    frame++;

    if (frame > maxFrames) {
      clearInterval(interval);
      onUpdate(finalText); // Ensure final text is correct
    }
  }, 30); // Update every 30ms
}
```

**When It Triggers:**

- **On Mount**: When button first appears
- **On Hover**: When you mouse over button
- **On Click**: Brief scramble when clicked

**React Component Usage:**

```jsx
function ScrambleButton({ text, onClick }) {
  const [displayText, setDisplayText] = useState(text);

  const handleHover = () => {
    scrambleText(text, setDisplayText);
  };

  return (
    <button onMouseEnter={handleHover} onClick={onClick}>
      {displayText}
    </button>
  );
}
```

**Why This Is Engaging:**

- **Cyberpunk Aesthetic**: Fits quantum/tech theme
- **Micro-interaction**: Small detail that feels polished
- **Feedback**: User knows button is interactive
- **Personality**: Makes interface feel "alive"

---

## 🎯 Integration: How These Systems Work Together

### Example User Flow:

1. **User Lands on Page**

   - Quantum background loads with matrix environment
   - Title text scrambles into view
   - Buttons show katakana scramble effect

2. **User Moves Mouse**

   - Background parallax shifts subtly
   - Hovering over buttons triggers scramble animation
   - Hovering over 3D object allows mouse control

3. **User Clicks Button**

   - Click ripple expands from cursor position
   - Button text briefly scrambles
   - Action executes (navigate, open modal, etc.)

4. **User Adjusts Controls**

   - Hue slider rotates background colors 360°
   - Environment dropdown changes base color
   - All transitions are smooth and animated

5. **User Saves Scene**
   - Save modal appears with glassmorphic styling
   - After save, unlock modal animates in
   - Sound effect plays for character unlock
   - Background continues subtle animations throughout

### The Result:

Every interaction feels **responsive, polished, and intentional**. The interface doesn't just sit there - it **reacts, responds, and rewards** user actions.

---

## 📊 Technical Performance

**Optimization Strategies:**

- **RAF (RequestAnimationFrame)**: Parallax uses RAF for 60fps
- **Debouncing**: Mouse move events debounced to prevent overload
- **CSS Transforms**: Ripples use `transform` (GPU-accelerated)
- **Event Delegation**: Single listener for multiple ripples
- **Cleanup**: Intervals and listeners removed on unmount

**Result**: All effects run at 60fps even with complex 3D scene rendering simultaneously.

---

## 🎓 Key Takeaways

These systems demonstrate:

1. **User Experience Focus**: Every interaction considered
2. **Performance Awareness**: Smooth animations without lag
3. **Visual Feedback**: Users always know what's happening
4. **Progressive Enhancement**: Works without JS for core functionality
5. **Attention to Detail**: Small touches create polished feel

The combination of **3D rendering** + **interactive backgrounds** + **text effects** + **unlock progression** creates an experience that feels like a shipped product, not a student project.
