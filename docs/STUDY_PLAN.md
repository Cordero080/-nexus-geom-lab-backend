# Study Plan: Learning Your App from Core to Advanced

## Overview

This study plan organizes **10 core files** by the overall app flow. Study them in this order to understand how data, users, and 3D scenes move through your application.

---

## Phase 1: Foundation (Understanding the Big Picture)

### Step 1.1: App Structure

**File:** `App.jsx`  
**What to learn:** How everything connects  
**Time:** 30 minutes

**Key questions to answer:**

- What state does App.jsx manage?
- What components does it render?
- How do props flow down to children?
- What's the role of Providers (Auth, Scene)?

**Your checklist:**

- [ ] Read App.jsx completely
- [ ] List all state variables
- [ ] Trace one prop from App.jsx to ThreeScene.jsx
- [ ] Understand Provider pattern (wrap context around app)

---

### Step 1.2: Context (State Management)

**File:** `AuthContext.jsx`  
**What to learn:** How user login/signup data persists  
**Time:** 20 minutes

**Key questions to answer:**

- How does `useAuth()` work?
- Where is auth data stored (localStorage)?
- What's the difference between `useContext` and `useAuth()`?
- How do login/signup trigger API calls?

**Your checklist:**

- [ ] Understand Provider wrapping pattern
- [ ] See how `useAuth()` accesses context
- [ ] Find where user data is stored
- [ ] Trace login → setUser → useAuth()

---

## Phase 2: User Lifecycle (Authentication Flow)

### Step 2.1: Backend Auth Routes

**File:** `backend/routes/auth.js`  
**What to learn:** Signup/login server-side logic  
**Time:** 40 minutes

**Key questions to answer:**

- How does password hashing work (bcrypt)?
- What's JWT and why do we need it?
- What happens when user clicks "Sign Up"?
- What's stored in the JWT token?

**Your checklist:**

- [ ] Find signup route handler
- [ ] Find login route handler
- [ ] See password comparison logic
- [ ] Understand token creation and return

---

### Step 2.2: User Database Schema

**File:** `backend/models/User.js`  
**What to learn:** What user data is stored  
**Time:** 15 minutes

**Key questions to answer:**

- What fields does a User have?
- What's `unlockedNoetechs`? (feature unlocking)
- Are passwords hashed when stored?
- What's the relationship to Scenes?

**Your checklist:**

- [ ] List all User fields
- [ ] See password pre-save hashing
- [ ] Understand unlockedNoetechs array
- [ ] Find Scene relationship

---

### Step 2.3: API Calls from Frontend

**File:** `src/services/sceneApi.jsx`  
**What to learn:** How frontend talks to backend  
**Time:** 30 minutes

**Key questions to answer:**

- How are fetch requests made?
- Where's the backend URL?
- How is the JWT token sent?
- What endpoints exist?

**Your checklist:**

- [ ] Find signup() function
- [ ] Find login() function
- [ ] See Authorization header pattern
- [ ] Understand error handling

---

## Phase 3: 3D Scene Rendering (Core Graphics)

### Step 3.1: Scene Setup

**File:** `src/features/sceneControls/ThreeScene.jsx`  
**What to learn:** How 3D rendering is orchestrated  
**Time:** 45 minutes

**Key questions to answer:**

- How do props become 3D visuals?
- What are all the `useRef` calls doing?
- How do hooks organize the rendering?
- What gets rendered in the DOM?

**Your checklist:**

- [ ] Count all the `useRef()` calls and their purpose
- [ ] Read all hook calls (don't dive deep yet)
- [ ] Find the return/render section
- [ ] Understand prop-to-hook flow

---

### Step 3.2: User Controls

**File:** `src/components/Controls/Controls.jsx`  
**What to learn:** How users manipulate the 3D scene  
**Time:** 40 minutes

**Key questions to answer:**

- What UI elements control what 3D properties?
- How do sliders/buttons update App.jsx state?
- What's the Controls → App.jsx → ThreeScene.jsx flow?
- How do event handlers work?

**Your checklist:**

- [ ] Find color picker (baseColor)
- [ ] Find scale slider
- [ ] Find object count selector
- [ ] Trace one slider change: UI → setter → state update → ThreeScene re-render

---

### Step 3.3: Hooks Deep Dive (Reference)

**File:** `docs/hooks-customHooks/UNDERSTANDING_DATA_FLOW.md`  
**What to learn:** How individual hooks work  
**Time:** 60 minutes (reference material - read as needed)

**When to read this:**

- After understanding ThreeScene.jsx structure
- When you need to know HOW a specific hook works
- To understand the parameter destructuring pattern

**Your checklist:**

- [ ] Bookmark this file
- [ ] Read the "Core Concept" section
- [ ] Study 1-2 hook examples deeply
- [ ] Use as reference when confused about parameters

---

## Phase 4: Scene Management (Save/Load/Gallery)

### Step 4.1: Save Button Flow

**File:** `src/components/Controls/SaveButton/SaveButton.jsx`  
**What to learn:** How scenes get saved  
**Time:** 35 minutes

**Key questions to answer:**

- What happens when user clicks "Save Scene"?
- What data gets sent to backend?
- How is the scene configuration captured?
- Where does the API call go?

**Your checklist:**

- [ ] Find onClick handler
- [ ] See useScene() context usage
- [ ] Understand scene metadata (name, description, isPublic)
- [ ] Trace save: Button → useScene.saveScene() → API call

---

### Step 4.2: Backend Scene Routes

**File:** `backend/routes/scenes.js`  
**What to learn:** Server-side scene storage  
**Time:** 40 minutes

**Key questions to answer:**

- How are scenes stored in the database?
- How does authorization work (own scenes only)?
- What's the POST vs PUT difference?
- How does GET fetch user scenes?

**Your checklist:**

- [ ] Find POST /scenes (create)
- [ ] Find PUT /scenes/:id (update)
- [ ] Find GET /scenes (list user's scenes)
- [ ] See authorization middleware

---

### Step 4.3: Gallery Display

**File:** `src/Showcase/ShowcaseGallery.jsx`  
**What to learn:** How saved scenes are displayed  
**Time:** 35 minutes

**Key questions to answer:**

- How does the gallery fetch scenes?
- How are cards rendered for each scene?
- What happens when user clicks a scene card?
- How do public scenes differ from private?

**Your checklist:**

- [ ] Find useEffect that fetches scenes
- [ ] See card rendering logic
- [ ] Understand onClick handler (load scene)
- [ ] Find filtering logic (public vs user's scenes)

---

## Phase 5: Advanced Topics (Reference Materials)

**Time to study:** As needed, when implementing features

### 5.1: Hooks Reference

- `CUSTOM_HOOKS_GUIDE.md` - Detailed hook documentation
- `HOOKS_INVENTORY.md` - Quick reference tables

### 5.2: Scene Context

- `src/context/SceneContext.jsx` - Scene state management
- Understand: currentSceneId, sceneMode, loadedConfig

### 5.3: Material Updates

- `src/features/sceneControls/hooks/useMaterialUpdates.js`
- Reference when debugging render issues

---

## Study Checklist

### Phase 1: Foundation ✓

- [ ] App.jsx structure understood
- [ ] AuthContext pattern understood
- [ ] Props flow direction clear

### Phase 2: Auth ✓

- [ ] Signup/login routes read
- [ ] User.js schema understood
- [ ] API calls understood
- [ ] JWT concept clear

### Phase 3: 3D Rendering ✓

- [ ] ThreeScene.jsx orchestration clear
- [ ] Controls.jsx interaction understood
- [ ] Hooks pattern understood
- [ ] One complete feature traced (e.g., color change)

### Phase 4: Save/Load ✓

- [ ] SaveButton flow understood
- [ ] Scene routes understood
- [ ] Gallery display understood
- [ ] Complete save/load flow traced

### Phase 5: Reference

- [ ] Bookmarked for future lookup
- [ ] Know when to consult each doc

---

## Complete App Flow (What You'll Understand)

After studying this plan, you'll understand:

```
1. USER CREATION (Phase 2)
   User clicks "Sign Up"
   → Controls send data to API
   → Backend auth.js creates user
   → JWT token created
   → User logged in via AuthContext.jsx
   → localStorage stores token/user

2. 3D SCENE INTERACTION (Phase 3)
   User moves slider in Controls.jsx
   → Updates App.jsx state
   → Props flow to ThreeScene.jsx
   → Hooks detect prop changes
   → 3D scene updates (Three.js rendered)
   → User sees new geometry/colors

3. SCENE SAVING (Phase 4)
   User clicks "Save Scene"
   → SaveButton captures current config
   → useScene() calls saveScene()
   → API call to backend scenes.js
   → Backend stores in database
   → User gets scene ID back

4. SCENE LOADING (Phase 4)
   User views gallery (ShowcaseGallery.jsx)
   → Fetches public scenes from backend
   → Renders scene cards
   → User clicks card
   → Scene config loaded into state
   → ThreeScene.jsx updates with loaded config
   → User sees previously saved scene
```

---

## Time Estimate

| Phase                 | Time        | Status             |
| --------------------- | ----------- | ------------------ |
| Phase 1: Foundation   | 1 hour      | Start here         |
| Phase 2: Auth         | 2 hours     | Then this          |
| Phase 3: 3D Rendering | 2 hours     | Then this          |
| Phase 4: Save/Load    | 2 hours     | Then this          |
| **Total**             | **7 hours** | Core understanding |
| Phase 5: Reference    | As needed   | Anytime            |

---

## Tips for Effective Learning

### 1. **Study ONE file at a time**

Don't jump between files. Complete a section.

### 2. **Answer the key questions**

Before moving on, you should be able to answer them.

### 3. **Trace one feature end-to-end**

Pick something simple (e.g., "What happens when I change the color?") and trace it through all 10 files.

### 4. **Use your docs folder**

- Refer to `UNDERSTANDING_DATA_FLOW.md` when confused about parameters
- Use `HOOKS_INVENTORY.md` as a quick reference

### 5. **Debug with console.log**

When you're stuck, add console logs to trace data flow.

### 6. **Create your own notes**

As you study, create a personal "mental model" document.

---

## Your 10 Core Files Summary

| #   | File                | Phase | Purpose               | Time  |
| --- | ------------------- | ----- | --------------------- | ----- |
| 1   | App.jsx             | 1     | App structure & state | 30min |
| 2   | AuthContext.jsx     | 1-2   | User state management | 20min |
| 3   | auth.js (backend)   | 2     | Signup/login logic    | 40min |
| 4   | User.js             | 2     | User schema           | 15min |
| 5   | sceneApi.jsx        | 2     | API calls             | 30min |
| 6   | ThreeScene.jsx      | 3     | 3D rendering          | 45min |
| 7   | Controls.jsx        | 3     | User controls         | 40min |
| 8   | SaveButton.jsx      | 4     | Save logic            | 35min |
| 9   | scenes.js (backend) | 4     | Save/load routes      | 40min |
| 10  | ShowcaseGallery.jsx | 4     | Gallery display       | 35min |

---

## Recommended Reading Order

### Day 1 (Foundation - 3 hours)

1. App.jsx
2. AuthContext.jsx
3. Reference: UNDERSTANDING_DATA_FLOW.md (Core Concept section only)

### Day 2 (Auth - 2.5 hours)

4. auth.js
5. User.js
6. sceneApi.jsx

### Day 3 (3D Rendering - 2 hours)

7. ThreeScene.jsx
8. Controls.jsx

### Day 4 (Save/Load - 2.5 hours)

9. SaveButton.jsx
10. scenes.js
11. ShowcaseGallery.jsx

### Ongoing (Reference)

- CUSTOM_HOOKS_GUIDE.md
- HOOKS_INVENTORY.md

---

## Success Criteria

By the end of this study plan, you should be able to:

✅ **Explain the entire user journey**

- From signup → login → interact with 3D → save scene → view gallery

✅ **Trace any data change**

- Pick a feature and follow it through all 10 files

✅ **Understand the architecture**

- Frontend: React + Three.js
- Backend: Node.js + MongoDB
- How they communicate: REST API + JWT

✅ **Know where to find things**

- When you need to add a feature, know which file to edit

✅ **Understand your own code**

- No more confusion about where things come from or why they break

---

## After You Complete This Plan

You'll be ready to:

- Add new features confidently
- Debug issues efficiently
- Understand new code quickly
- Help others learn your codebase
- Refactor without breaking things

Good luck! 🚀
