# Priority 4: Save & Load (How Scenes Persist)

**Total Time: 2 hours**  
**Prerequisite: Complete Priority 1, 2, & 3**  
**Goal: Understand how users save and load their 3D creations**

Now you know how users interact with 3D scenes. Learn how they save their work!

---

## What You'll Learn

After Priority 4, you'll understand:

- How scene configuration is captured
- How scenes are sent to the backend
- How the database stores scenes
- How users browse and load saved scenes
- Complete user workflow from start to finish

---

## Task 4.1: Save Button Flow (35 minutes)

**File:** `src/components/Controls/SaveButton/SaveButton.jsx`

### Context

When a user clicks "Save Scene," something happens. Let's trace it.

### Before Reading

Ask yourself: "What data needs to be saved when a user saves their 3D scene?"

### While Reading

Answer these questions:

1. **What happens on button click?**

   - Find the onClick handler
   - What function does it call?
   - What data does it gather?

2. **What's the scene configuration?**

   - What information about the scene needs saving?
   - Geometry type? Colors? Lighting?
   - Find where this is packaged

3. **How does it use useScene()?**

   - Find the useScene() hook usage
   - What methods does it call?
   - What gets passed to saveScene()?

4. **Error handling:**

   - What if save fails?
   - How is the user notified?
   - What happens to unsaved changes?

5. **After save:**
   - What happens when save succeeds?
   - Does anything update on screen?
   - Can user see their scene ID?

### Key Pattern

```
User clicks "Save Scene"
    ↓
Component gathers current config (colors, geometry, etc.)
    ↓
Calls useScene().saveScene()
    ↓
useScene sends API call to backend
    ↓
Backend stores in database
    ↓
Returns scene ID
    ↓
Frontend updates SceneContext
    ↓
User feedback (toast, modal, etc.)
```

### After Reading

Complete this checklist:

- [ ] Understand what scene configuration contains
- [ ] Know how useScene() is used
- [ ] Can trace button click to backend call
- [ ] Understand what gets saved

### Key Insight

SaveButton doesn't talk directly to backend. It uses useScene() context to manage saving. Separation of concerns!

---

## Task 4.2: Backend Scene Routes (45 minutes)

**File:** `backend/routes/scenes.js`

### Context

This is where the backend receives save requests, stores scenes, and retrieves them.

### Before Reading

Ask yourself: "What happens on the server when someone saves a scene?"

### While Reading

Answer these questions:

1. **POST /scenes (Create new scene):**

   - Find the POST route
   - What data does it expect?
   - How does it know which user is saving?
   - What gets stored in the database?
   - What does it return?

2. **PUT /scenes/:id (Update existing scene):**

   - Find the PUT route
   - How is it different from POST?
   - What validation happens?
   - Can users update other users' scenes?

3. **GET /scenes (Fetch user's scenes):**

   - Find the GET route
   - What scenes does it return?
   - Just user's scenes? Or all public scenes?
   - How is pagination handled?

4. **Authorization:**

   - How does the backend know which user is requesting?
   - What if someone tries to access another user's scene?
   - Find the middleware that checks this

5. **Error handling:**
   - What if user isn't authenticated?
   - What if scene doesn't exist?
   - What if request is malformed?

### Key Concept: REST Endpoints

- **POST** = Create new (use when no ID)
- **PUT** = Update existing (use when ID exists)
- **GET** = Fetch (read-only)
- **DELETE** = Remove (optional in your app)

### After Reading

Complete this checklist:

- [ ] Understand POST vs PUT difference
- [ ] Know how authorization works
- [ ] Understand what data is stored
- [ ] Can trace save request from frontend to database

### Key Insight

The backend validates everything and protects users' data. It won't let someone save as another user or modify someone else's scene.

---

## Task 4.3: Gallery Display (40 minutes)

**File:** `src/Showcase/ShowcaseGallery.jsx`

### Context

After saving scenes, users want to browse and load them. This is the gallery where scenes are displayed.

### Before Reading

Ask yourself: "How does the gallery show users all the saved scenes?"

### While Reading

Answer these questions:

1. **How does gallery fetch scenes?**

   - Find the useEffect that fetches
   - What API call does it make?
   - When does it fetch? (On mount? On filter change?)

2. **Filtering:**

   - How does it show public vs private scenes?
   - How does it show only user's own scenes?
   - Find the filter logic

3. **Rendering cards:**

   - Find the code that renders scene cards
   - What information shows on each card?
   - (Name, description, preview, etc.?)

4. **Card interactions:**

   - What happens when user clicks a card?
   - How does it load the scene?
   - Find the onClick handler

5. **Loading state:**
   - What shows while fetching?
   - What if there are no scenes?
   - Error states?

### Key Pattern

```
Gallery component mounts
    ↓
useEffect runs
    ↓
Calls API to fetch scenes
    ↓
Receives array of scenes from backend
    ↓
Maps over array and renders cards
    ↓
User sees gallery of scenes
    ↓
User clicks a card
    ↓
loadScene() called via useScene()
    ↓
Scene config loaded into SceneContext
    ↓
ThreeScene receives new props
    ↓
3D scene displays the loaded scene
```

### After Reading

Complete this checklist:

- [ ] Understand how scenes are fetched
- [ ] Know how filtering works
- [ ] Can trace card click to scene loading
- [ ] Understand loading/error states

### Key Insight

Gallery is read-only from the user perspective, but it's the gateway to loading saved scenes.

---

## Complete Save/Load Workflow (End-to-End)

Now understand the complete user journey:

### User Creates a Scene (Priority 3)

1. Adjusts all the controls (colors, geometry, etc.)
2. 3D scene shows their creation

### User Saves the Scene (Task 4.1)

1. Clicks "Save Scene"
2. SaveButton gathers all current settings
3. Calls useScene().saveScene()
4. Sends to backend

### Backend Stores Scene (Task 4.2)

1. Receives POST /scenes with all scene data
2. Validates user is authenticated (JWT token)
3. Stores in MongoDB database
4. Generates scene ID
5. Returns to frontend

### Frontend Gets Scene ID (Task 4.1 again)

1. SceneContext updates with scene ID
2. User sees confirmation
3. Scene is now saved!

### User Later Views Gallery (Task 4.3)

1. Opens gallery/showcase
2. Gallery fetches all user's scenes (or public ones)
3. Shows cards for each scene
4. User browses

### User Loads a Previous Scene (Task 4.3)

1. Clicks on a scene card
2. Gallery fetches scene data
3. Calls useScene().loadScene()
4. SceneContext updates
5. ThreeScene receives new props with all the scene's settings
6. 3D scene updates to show the loaded scene
7. User can now edit it or just view it

---

## Self-Check: Are You Ready for Priority 5?

Answer these questions:

### Question 1: Save Data

"What data gets saved when a user clicks 'Save Scene'?"  
Your answer: ********\_\_\_********

**Good answer:** "Scene configuration: all current settings like colors, geometry type, lighting, camera position, etc."

### Question 2: Authorization

"How does the backend know which user is saving?"  
Your answer: ********\_\_\_********

**Good answer:** "From the JWT token in the Authorization header. It extracts the userId and associates the scene with that user."

### Question 3: POST vs PUT

"When does the backend use POST vs PUT?"  
Your answer: ********\_\_\_********

**Good answer:** "POST when creating a new scene (no ID yet), PUT when updating an existing scene (has ID)."

### Question 4: Gallery Flow

"Trace: User clicks a scene card in gallery → Their 3D scene loads"  
Your answer: ********\_\_\_********

**Good answer:** "Card onClick → useScene().loadScene() → SceneContext updates → Props to ThreeScene → Hooks apply scene settings → 3D renders"

### Question 5: Data Security

"Can users see other users' private scenes?"  
Your answer: ********\_\_\_********

**Good answer:** "No. Backend validates that user owns the scene (via JWT) before returning it."

---

## Tips for Success

### 1. Don't Focus on Exact Code

You don't need to memorize implementation details. Just understand the flow.

### 2. REST Concepts

GET, POST, PUT are verbs:

- GET = read
- POST = create
- PUT = update
  These concepts appear throughout web development.

### 3. JWT is Your Friend

Remember: JWT in Authorization header is how backend verifies who you are.

### 4. Try Saving and Loading

If you have the app running, save a scene and watch the network tab in developer tools. See the actual API calls happen!

---

## Common Struggles

### Struggle: "Why two different files for saving?"

**Solution:** SaveButton (frontend UI) handles user interaction. scenes.js (backend) handles storage. They work together.

### Struggle: "What's the difference between saving and publishing?"

**Solution:** In Priority 4, you're just learning basic save. Public/private is the next layer (isPublic field).

### Struggle: "Gallery seems complicated"

**Solution:** Just focus on the fetch and load flow. Implementation details can come later.

---

## You're Done with Priority 4 When

- ✅ You finished all 3 tasks
- ✅ You answered all 5 self-check questions correctly
- ✅ You can trace save flow completely
- ✅ You can trace load flow completely

---

## You've Completed the Main Study! 🎉

Congratulations! You now understand:

✅ How your app is structured (Priority 1)  
✅ How users authenticate (Priority 2)  
✅ How 3D scenes render (Priority 3)  
✅ How scenes are saved and loaded (Priority 4)

**You understand the complete user journey!**

---

## Next: Reference Materials (As Needed)

When you encounter something confusing, refer to:

- `docs/hooks-customHooks/UNDERSTANDING_DATA_FLOW.md` - Data flow questions
- `docs/hooks-customHooks/HOOKS_INVENTORY.md` - Quick hook lookup
- `docs/hooks-customHooks/CUSTOM_HOOKS_GUIDE.md` - Detailed hook docs

---

## Final Challenge: Trace One Complete Feature

Pick ONE feature and trace it completely through all 10 files:

Examples:

1. "User changes ambient light color"
2. "User saves a scene"
3. "User loads a scene from gallery"

Show the complete path through all files involved. If you can do this, you understand your app!

---

## Congratulations! 🚀

You've completed the study plan. You're now ready to:

- ✅ Modify existing features
- ✅ Add new features
- ✅ Debug issues
- ✅ Understand new code quickly
- ✅ Help others learn the codebase

Welcome to expert level! 🎓
