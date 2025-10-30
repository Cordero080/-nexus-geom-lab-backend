# Priority 1: Core Foundation

**Total Time: 3 hours**  
**Goal: Understand your app's basic structure and data flow**

This is the foundation everything else builds on. Don't skip this!

---

## What You'll Learn

After Priority 1, you'll understand:

- How your app starts (App.jsx)
- How authentication works globally (AuthContext)
- How data flows through your app
- How parameters are destructured (the confusing part!)
- Basic overview of all 11 hooks

---

## Task 1.1: App.jsx Structure (30 minutes)

**File:** `src/App.jsx`

### Before Reading

Ask yourself: "What is App.jsx responsible for?"

### While Reading

Answer these questions:

1. **What state does App.jsx manage?**

   - Look for `useState()` calls
   - Write down all state variables

2. **What components does it render?**

   - Look for JSX return statement
   - List all components inside

3. **How do props flow down?**

   - Find where ThreeScene is rendered
   - What props does it receive?
   - Find where Controls is rendered
   - What props does it receive?

4. **What Providers wrap the app?**
   - Look for `<Provider>` components
   - Why are they needed?

### After Reading

Complete this checklist:

- [ ] Can list all state variables in App.jsx
- [ ] Can name all rendered components
- [ ] Can trace one prop from App.jsx to a child component
- [ ] Understand why Providers are used

### Key Insight

App.jsx is like the "brain" of your app. Everything flows through here.

---

## Task 1.2: AuthContext.jsx (30 minutes)

**File:** `src/context/AuthContext.jsx`

### Before Reading

Ask yourself: "How does login/signup data stay available everywhere?"

### While Reading

Answer these questions:

1. **What is Context?**

   - Why do we need it?
   - What's inside AuthContext?

2. **What does AuthProvider do?**

   - What state does it manage?
   - What functions does it provide?

3. **How does `useAuth()` hook work?**

   - What does it return?
   - When would you use it in a component?

4. **Where is auth data stored?**

   - Look for `localStorage` calls
   - Why localStorage?

5. **How does login work?**
   - Find the login function
   - Trace: button click → login() → setUser() → useAuth() returns new data

### After Reading

Complete this checklist:

- [ ] Understand what Context is
- [ ] Can explain AuthProvider pattern
- [ ] Know what useAuth() returns
- [ ] Understand localStorage persistence
- [ ] Can trace login flow

### Key Insight

Context lets you access user data from ANY component without prop drilling.

---

## Task 1.3: Understanding Data Flow (1 hour)

**Document:** `docs/hooks-customHooks/UNDERSTANDING_DATA_FLOW.md`

### Read These Sections (in order)

#### Section: "The Core Concept: Destructuring in Function Parameters" (10 min)

- This explains the most confusing part of your code
- Pay attention to the `{ }` curly braces
- They mean "extract these properties from the object"

#### Section: "Full Data Flow Example: useObjectManager()" (20 min)

- Follow the 4-step flow
- See how data moves: ThreeScene.jsx → useObjectManager() → Inside hook
- Notice the destructuring pattern

#### Section: "Visual Diagram: The Complete Flow" (15 min)

- This is the big picture
- How ThreeScene.jsx packages data
- How hooks receive and use it

#### Section: "Common Patterns You'll See" (15 min)

- Pattern 1: Refs Object
- Pattern 2: Props Object
- These patterns repeat throughout your code

### After Reading

Complete this checklist:

- [ ] Understand destructuring in function parameters
- [ ] Can follow the 4-step flow
- [ ] Can read and understand the visual diagram
- [ ] Recognize the common patterns

### Key Insight

Parameter destructuring is your app's "language." Once you understand it, everything clicks.

---

## Task 1.4: Quick Hook Overview (30 minutes)

**Document:** `docs/hooks-customHooks/HOOKS_INVENTORY.md`

### Just Scan (Don't Deep Dive)

**Scan these sections:**

1. "Summary: 11 custom hooks"
2. "Hooks by Location" table
3. "Hooks by Category" table

You don't need to memorize anything. Just get the big picture:

- How many hooks are there? (11)
- What categories do they fall into?
- Where is each one located?

### After Scanning

Complete this checklist:

- [ ] Know there are 11 hooks
- [ ] Can list the 5 categories
- [ ] Know roughly what each category does
- [ ] Know where to find this info if you forget

### Key Insight

You don't need to memorize hooks now. You just need to know they exist and where to find them.

---

## Self-Check: Are You Ready for Priority 2?

Answer these questions. If you answer "yes" to all 5, move forward!

### Question 1: App Structure

"What is the main job of App.jsx?"  
Your answer: ********\_\_\_********

**Good answer:** "App.jsx manages the main state and renders the main components (Controls, ThreeScene, etc.)"

### Question 2: Authentication

"How does useAuth() give you access to user data from any component?"  
Your answer: ********\_\_\_********

**Good answer:** "It uses React Context. AuthProvider wraps the whole app, and useAuth() accesses that context."

### Question 3: Props Flow

"If I want to trace how the 'baseColor' prop flows from App.jsx to the 3D scene, where would I look?"  
Your answer: ********\_\_\_********

**Good answer:** "Look in App.jsx to see it's passed to ThreeScene, then in ThreeScene.jsx to see it's passed to hooks."

### Question 4: Data Destructuring

"What does this mean: `const { sceneRef, objectsRef } = refs;`"  
Your answer: ********\_\_\_********

**Good answer:** "It takes an object called 'refs', pulls out the properties 'sceneRef' and 'objectsRef', and creates variables with those names."

### Question 5: Hooks Overview

"Name 3 of the 11 hooks without looking."  
Your answer: ********\_\_\_********

**Good answer:** "Any 3 from: useObjectManager, useMaterialUpdates, useSceneInitialization, useLightingUpdates, useAnimationLoop, useObjectInteraction, useCameraController, useMouseTracking, useEnvironmentUpdate, useTextScramble, useScene, useAuth"

---

## Tips for Success

### 1. Read Slowly

Don't rush through these files. Take breaks.

### 2. Take Notes

Write down answers to the questions. Don't just read.

### 3. Ask "Why?"

When you see code, ask "Why is this written this way?"

### 4. Use Multiple Tabs

Have App.jsx in one editor tab and AuthContext.jsx in another. Compare them.

### 5. Don't Memorize

Just understand. You don't need to memorize anything.

---

## Common Struggles & Solutions

### Struggle: "There's so much code, I don't know what to focus on"

**Solution:** Focus on the `export` statements and function signatures. Ignore implementation details.

### Struggle: "I don't understand destructuring"

**Solution:** Re-read the "Core Concept" section in UNDERSTANDING_DATA_FLOW.md. Read it 3 times if needed.

### Struggle: "I still don't know what hooks do"

**Solution:** That's fine! You're just supposed to get the overview. Deep dive comes later.

### Struggle: "This is overwhelming"

**Solution:** Take a 15-minute break. Come back refreshed.

---

## You're Done with Priority 1 When

- ✅ You finished all 4 tasks
- ✅ You answered all 5 self-check questions correctly
- ✅ You understand parameter destructuring
- ✅ You can trace a prop from App.jsx to a child component

---

## Next Steps

Once you're confident with Priority 1:

1. Take a 1-hour break
2. Open `01-PRIORITY-2-AUTHENTICATION.md`
3. Follow the tasks there

**Congratulations! You've completed Priority 1! 🎉**
