# Priority 3: 3D Rendering (How the Scene Works)

**Total Time: 2.5 hours**  
**Prerequisite: Complete Priority 1 & 2**  
**Goal: Understand how 3D geometry is displayed and controlled**

Now you know how users get in. Learn how they see the 3D scene!

---

## What You'll Learn

After Priority 3, you'll understand:

- How Three.js rendering is orchestrated
- How props become 3D visuals
- How all 11 hooks work together
- How user controls affect the 3D scene
- How to trace a feature from UI to 3D render

---

## Task 3.1: ThreeScene.jsx Orchestration (1 hour)

**File:** `src/features/sceneControls/ThreeScene.jsx`

### Context

This is where your 3D rendering happens. Think of it as the "conductor" that coordinates all the hooks that make the 3D scene work.

### Before Reading

Ask yourself: "How does a React component display 3D graphics from Three.js?"

### While Reading

Answer these questions:

1. **What props does ThreeScene receive?**

   - Look at the function parameters
   - Count them (there are many!)
   - What do they control?

2. **What are all the useRef() calls?**

   - Find them at the top
   - What does each one store?
   - Why are refs used instead of state?

3. **How many hooks are called?**

   - Count them
   - Which hooks initialize things?
   - Which update things?

4. **What gets rendered?**

   - Look at the return statement
   - What's in the JSX?
   - What's the `ref={mountRef}` doing?

5. **How does this connect to App.jsx?**
   - What props come from App.jsx?
   - How do they flow into ThreeScene?

### Key Concept: Refs vs State

- **State:** React re-renders when it changes (good for UI)
- **Refs:** Persist but DON'T trigger re-renders (good for Three.js objects)

Three.js objects need refs because you don't want React to re-render the entire 3D scene every frame.

### After Reading

Complete this checklist:

- [ ] Count all useRef() calls
- [ ] List all props received
- [ ] Count all hooks called
- [ ] Understand why refs are used
- [ ] Know what gets rendered in JSX

### Key Insight

ThreeScene.jsx is like an "orchestra conductor." It receives props from App.jsx and coordinates 11 hooks to make the 3D scene work.

---

## Task 3.2: Controls.jsx User Interface (45 minutes)

**File:** `src/components/Controls/Controls.jsx`

### Context

This is where users interact with the 3D scene. Sliders, buttons, dropdowns - all controlled here.

### Before Reading

Ask yourself: "How do I let users change what they see in 3D?"

### While Reading

Answer these questions:

1. **What UI elements exist?**

   - Sliders for what?
   - Buttons for what?
   - Dropdowns for what?
   - (You don't need to read every one, just scan)

2. **How do event handlers work?**

   - Find an onChange handler
   - What does it do?
   - How does it update App.jsx state?

3. **One complete feature trace:**

   - Pick the "Base Color" control
   - Find the input/slider
   - Find the onChange handler
   - See how it calls App.jsx setter
   - Trace how color flows: onChange → App.jsx → prop to ThreeScene

4. **State management:**
   - Does Controls have its own state?
   - Or does it all come from App.jsx?
   - Why this design?

### Key Pattern

```
User moves slider
    ↓
onChange handler fires
    ↓
Calls App.jsx setter (e.g., setBaseColor)
    ↓
App.jsx state updates
    ↓
New props passed to ThreeScene
    ↓
ThreeScene props change
    ↓
Hooks detect change via useEffect dependency array
    ↓
3D scene updates
    ↓
User sees new result
```

### After Reading

Complete this checklist:

- [ ] Know what controls exist
- [ ] Understand onChange handlers
- [ ] Can trace one feature completely (color → 3D)
- [ ] Understand why props come from App.jsx

### Key Insight

Controls doesn't manage state itself. It's a "remote control" that tells App.jsx what to change.

---

## Task 3.3: Hooks Deep Reference (30 minutes)

**Document:** `docs/hooks-customHooks/CUSTOM_HOOKS_GUIDE.md`

### Context

Now that you understand ThreeScene.jsx and props flow, understand what each hook does.

### What to Read (in order)

1. **Material & Object Management section** (10 min)

   - useObjectManager() - Creates 3D objects
   - useMaterialUpdates() - Changes how objects look

2. **Lighting & Camera section** (10 min)

   - useCameraController() - Changes camera position
   - useLightingUpdates() - Changes lighting

3. **Animation & Interaction section** (10 min)
   - useAnimationLoop() - Makes animation happen
   - useObjectInteraction() - Handles mouse interaction

You don't need to read Effects & UI sections yet. Just focus on core 3D hooks.

### After Reading

Complete this checklist:

- [ ] Understand useObjectManager's job
- [ ] Understand useMaterialUpdates's job
- [ ] Know the difference between them
- [ ] Understand all 6 core 3D hooks

### Key Insight

Different hooks handle different aspects of 3D rendering. Together they make the complete scene.

---

## Complete 3D Rendering Flow (End-to-End)

Now understand the complete pipeline:

### 1. Scene Initialization (runs once)

- useSceneInitialization() → Creates Three.js scene, camera, renderer
- Mount point created in DOM

### 2. Props Change in App.jsx

- User moves color slider in Controls
- App.jsx state updates
- New props passed to ThreeScene

### 3. ThreeScene Detects Props Change

- Component receives new props
- Hooks' useEffect dependency arrays trigger

### 4. Hooks Execute in Order

- useObjectManager() → If geometry props changed, rebuild objects
- useMaterialUpdates() → If color/material props changed, update materials
- useLightingUpdates() → If lighting props changed, update lights
- useCameraController() → If camera props changed, move camera
- useAnimationLoop() → Starts rendering with updated values

### 5. Three.js Renders

- Animation loop calls renderer.render()
- 3D scene displayed with updated properties

### 6. User Sees Result

- 3D geometry appears with new colors/sizes/materials
- All in real-time

---

## Self-Check: Are You Ready for Priority 4?

Answer these questions:

### Question 1: Why Refs?

"Why does ThreeScene use useRef() instead of useState()?"  
Your answer: ********\_\_\_********

**Good answer:** "Because Three.js objects should persist between renders without causing re-renders. Refs do this."

### Question 2: Prop Flow

"Trace: User moves scale slider → 3D object gets bigger. Show me the complete path."  
Your answer: ********\_\_\_********

**Good answer:** "Controls onChange → App.jsx setScale → prop to ThreeScene → useMaterialUpdates hook → Three.js scale.setScalar() → render"

### Question 3: Hook Coordination

"What's the order in which hooks should run and why?"  
Your answer: ********\_\_\_********

**Good answer:** "Objects created first (useObjectManager), then updated (useMaterialUpdates), then animated (useAnimationLoop)."

### Question 4: Controls Design

"Why doesn't Controls manage its own state?"  
Your answer: ********\_\_\_********

**Good answer:** "Because App.jsx needs the state too, to pass to ThreeScene. Centralized state is easier."

### Question 5: Feature Trace

"Pick any feature (e.g., ambient light color). Show me all the files involved."  
Your answer: ********\_\_\_********

**Good answer:** "Controls.jsx (input), App.jsx (state), ThreeScene.jsx (receives prop), useLightingUpdates hook (updates light), backend isn't involved"

---

## Tips for Success

### 1. Read ThreeScene Twice

It's complex. Read it once to get overview, then again to understand details.

### 2. Don't Memorize Hooks

Just understand: different hooks handle different aspects of rendering.

### 3. The Big Picture

Keep thinking: "User clicks something → State changes → Props flow → Hooks run → 3D updates"

### 4. Trace One Feature Completely

Before moving on, pick a real feature and trace it through ALL the files you've learned.

---

## Common Struggles

### Struggle: "There are so many hooks!"

**Solution:** They all follow the same pattern. Don't try to learn each one deeply. Just know which one does what.

### Struggle: "I don't understand why props flow this way"

**Solution:** Re-read Priority 1, section "Understanding Data Flow". That's the foundation.

### Struggle: "ThreeScene.jsx is overwhelming"

**Solution:** Read it section by section. Focus on refs first, then the hook calls, then the render.

---

## You're Done with Priority 3 When

- ✅ You finished all 3 tasks
- ✅ You answered all 5 self-check questions correctly
- ✅ You can trace a feature from UI to 3D render
- ✅ You understand why different hooks exist

---

## Next Steps

Once you're confident with Priority 3:

1. Take a 1-hour break (you deserve it!)
2. Open `03-PRIORITY-4-SAVE-LOAD.md`
3. Learn how users save their creations

**Congratulations! You understand 3D rendering! 🎨**
