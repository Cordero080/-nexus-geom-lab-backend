# Study Plan Index - Organized by Priority

**Total Study Time: 7-10 hours**

Start at Priority 1 and work your way down. Each priority builds on the previous one.

---

## Priority 1: Core Foundation (MUST KNOW)

**Time: 3 hours**  
**What you'll understand: How your app is structured and how data flows**

### 1.1 App Structure

📄 **File:** `src/App.jsx`  
⏱️ **Time:** 30 minutes

**Why this first:** Everything else depends on understanding App.jsx. It's the entry point.

**Key questions:**

- What state does App.jsx manage?
- What components does it render?
- How do props flow down?

### 1.2 Authentication State Management

📄 **File:** `src/context/AuthContext.jsx`  
⏱️ **Time:** 30 minutes

**Why:** Users need to login before doing anything else.

**Key questions:**

- How does `useAuth()` work?
- Where is auth data stored?
- What happens on login/signup?

### 1.3 Understanding Data Flow

📄 **Document:** `docs/hooks-customHooks/UNDERSTANDING_DATA_FLOW.md`  
⏱️ **Time:** 1 hour

**Why:** This teaches you HOW parameters work (the most confusing part).

**Read these sections:**

- Core Concept: Parameter Destructuring
- Visual Diagram: The Complete Flow
- Full Data Flow Example: useObjectManager()

### 1.4 Quick Reference: What Each Hook Does

📄 **Document:** `docs/hooks-customHooks/HOOKS_INVENTORY.md`  
⏱️ **Time:** 30 minutes

**Why:** Get a bird's eye view of all 11 hooks.

**Just scan:**

- Hooks by Location table
- Hooks by Category table

---

## Priority 2: How Users Get Into Your App (CRITICAL)

**Time: 2 hours**  
**What you'll understand: Signup → Login → Authentication flow**

### 2.1 Backend Authentication Logic

📄 **File:** `backend/routes/auth.js`  
⏱️ **Time:** 45 minutes

**Why:** Need to understand what happens on the server when users sign up/login.

**Key questions:**

- How is password hashing done?
- What's JWT and why do we need it?
- What gets sent back to frontend?

### 2.2 User Database Schema

📄 **File:** `backend/models/User.js`  
⏱️ **Time:** 20 minutes

**Why:** Need to know what user data is stored.

**Key questions:**

- What fields does a User have?
- What's `unlockedNoetechs`?

### 2.3 Frontend API Calls

📄 **File:** `src/services/sceneApi.jsx`  
⏱️ **Time:** 35 minutes

**Why:** Need to know how frontend talks to backend.

**Key questions:**

- How are fetch requests made?
- How is the JWT token sent?
- What are the available endpoints?

---

## Priority 3: How the 3D Scene Works (HIGH PRIORITY)

**Time: 2.5 hours**  
**What you'll understand: How users see and interact with 3D geometry**

### 3.1 3D Scene Orchestration

📄 **File:** `src/features/sceneControls/ThreeScene.jsx`  
⏱️ **Time:** 1 hour

**Why:** This is where ALL 3D rendering happens.

**Key questions:**

- How do props become 3D visuals?
- What are all the useRef calls doing?
- How do the 11 hooks work together?

**Pro tip:** Read this AFTER Priority 1 so parameter destructuring makes sense.

### 3.2 User Controls

📄 **File:** `src/components/Controls/Controls.jsx`  
⏱️ **Time:** 45 minutes

**Why:** Need to understand how users manipulate the 3D scene.

**Key questions:**

- What UI controls what 3D property?
- How do sliders update App state?
- How does Controls → App → ThreeScene flow work?

**Exercise:** Trace one slider change completely.

### 3.3 Detailed Hook Documentation (Reference)

📄 **Document:** `docs/hooks-customHooks/CUSTOM_HOOKS_GUIDE.md`  
⏱️ **Time:** 30 minutes (reference only)

**Why:** For deep understanding of specific hooks.

**When to read:** When you encounter a hook you don't understand.

---

## Priority 4: How Scenes Get Saved (IMPORTANT)

**Time: 2 hours**  
**What you'll understand: Save/Load/Gallery system**

### 4.1 Save Button Flow

📄 **File:** `src/components/Controls/SaveButton/SaveButton.jsx`  
⏱️ **Time:** 35 minutes

**Why:** Users need to save their 3D creations.

**Key questions:**

- What happens when user clicks "Save"?
- What data gets captured?
- How is it sent to backend?

### 4.2 Backend Scene Routes

📄 **File:** `backend/routes/scenes.js`  
⏱️ **Time:** 45 minutes

**Why:** Need to understand server-side scene storage.

**Key questions:**

- How are scenes stored in the database?
- What's POST vs PUT?
- How does authorization work?

### 4.3 Gallery Display

📄 **File:** `src/Showcase/ShowcaseGallery.jsx`  
⏱️ **Time:** 40 minutes

**Why:** Users need to browse and load saved scenes.

**Key questions:**

- How does gallery fetch scenes?
- What happens when user clicks a scene card?
- How do public vs private scenes work?

---

## Priority 5: Reference Materials (AS NEEDED)

**Time: Anytime**  
**What you'll use: Looking up specific information**

### 5.1 Data Flow Deep Dive

📄 **Document:** `docs/hooks-customHooks/UNDERSTANDING_DATA_FLOW.md`  
**Use:** When confused about parameter destructuring or prop flow

### 5.2 Quick Hook Lookup

📄 **Document:** `docs/hooks-customHooks/HOOKS_INVENTORY.md`  
**Use:** When you need quick info about a specific hook

### 5.3 Complete Hook Guide

📄 **Document:** `docs/hooks-customHooks/CUSTOM_HOOKS_GUIDE.md`  
**Use:** When you need detailed explanation of a hook with examples

---

## Study Schedule (Recommended)

### Day 1 - Priority 1 (3 hours)

Morning:

- [ ] Read App.jsx (30 min)
- [ ] Read AuthContext.jsx (30 min)

Afternoon:

- [ ] Read UNDERSTANDING_DATA_FLOW.md - Core Concept section (30 min)
- [ ] Scan HOOKS_INVENTORY.md (30 min)

### Day 2 - Priority 2 (2 hours)

Morning:

- [ ] Read backend/routes/auth.js (45 min)
- [ ] Read backend/models/User.js (20 min)

Afternoon:

- [ ] Read sceneApi.jsx (35 min)

### Day 3 - Priority 3 (2.5 hours)

Morning:

- [ ] Read ThreeScene.jsx (1 hour)

Afternoon:

- [ ] Read Controls.jsx (45 min)
- [ ] Reference CUSTOM_HOOKS_GUIDE.md as needed (30 min)

### Day 4 - Priority 4 (2 hours)

Morning:

- [ ] Read SaveButton.jsx (35 min)
- [ ] Read backend/routes/scenes.js (45 min)

Afternoon:

- [ ] Read ShowcaseGallery.jsx (40 min)

### Ongoing - Priority 5

Use reference docs as needed when implementing or debugging.

---

## What You'll Understand After Each Priority

### After Priority 1 ✅

- How your app is structured
- How React components connect
- How authentication context works
- What parameters in functions mean
- Bird's eye view of all 11 hooks

### After Priority 2 ✅

- Complete signup/login flow
- How passwords are hashed
- How JWT tokens work
- How frontend talks to backend
- User database structure

### After Priority 3 ✅

- How 3D scenes are rendered
- How user controls affect 3D visuals
- How all 11 hooks work together
- How props flow from App → ThreeScene → Hooks
- How Three.js objects persist between renders

### After Priority 4 ✅

- How scenes are saved to the database
- How scenes are loaded from the database
- How the gallery displays scenes
- Complete user workflow from login → interact → save → view

### After Priority 5 ✅

- Deep understanding of any specific hook
- Can debug any issue by tracing data flow
- Ready to add new features

---

## One Feature Traced End-to-End

To verify you understand everything, trace this feature:

**"What happens when I change the base color?"**

You should be able to map:

1. **Controls.jsx** - User moves color slider
2. **App.jsx** - Color change updates state
3. **Props flow** - New color prop passed to ThreeScene
4. **ThreeScene.jsx** - Receives color prop
5. **useMaterialUpdates()** - Hook detects color change
6. **Three.js** - Material color updated
7. **Scene** - Rendered with new color

If you can trace this completely, you understand your app! 🎉

---

## Success Checklist

### Priority 1 Complete When:

- [ ] You can explain how App.jsx connects everything
- [ ] You understand useAuth() and context
- [ ] You can read parameter destructuring without confusion
- [ ] You know what 11 hooks exist (roughly)

### Priority 2 Complete When:

- [ ] You can explain the signup flow
- [ ] You understand JWT tokens
- [ ] You can trace a login from UI to database
- [ ] You know what's stored in User schema

### Priority 3 Complete When:

- [ ] You can explain how ThreeScene works
- [ ] You understand how props become visuals
- [ ] You can trace one feature (color change) end-to-end
- [ ] You know which hook does what

### Priority 4 Complete When:

- [ ] You can explain the complete save flow
- [ ] You understand scenes.js routes
- [ ] You can trace saving and loading
- [ ] You understand the gallery system

### Priority 5 Complete When:

- [ ] You can debug by reading docs
- [ ] You can add new features confidently
- [ ] You can explain your app to others

---

## Common Questions Answered

**Q: "Should I read all the code files in one sitting?"**  
A: No! Follow the schedule. One file per session.

**Q: "What if I don't understand something?"**  
A: Check Priority 5 reference docs first. Then re-read the file.

**Q: "Can I skip a priority?"**  
A: Not recommended. Priority 2 builds on Priority 1, etc.

**Q: "How long will this take?"**  
A: 7-10 hours spread over 4 days. Or 2 weeks if 1 hour/day.

**Q: "What should I have as my goal?"**  
A: Finish Priority 4 and be able to trace one feature completely.

---

## Files in This Study Plan

```
docs/study-plan/
├── 00-INDEX.md                    ← You are here
├── 01-PRIORITY-1-FOUNDATION.md
├── 02-PRIORITY-2-AUTHENTICATION.md
├── 03-PRIORITY-3-3D-RENDERING.md
├── 04-PRIORITY-4-SAVE-LOAD.md
└── 05-REFERENCE.md
```

---

## Next Steps

1. ✅ You're reading this now
2. Open **01-PRIORITY-1-FOUNDATION.md**
3. Follow the study schedule
4. Mark off each item as you complete it
5. Use reference docs as needed
6. Come back to this index if confused

**Ready? → Go to 01-PRIORITY-1-FOUNDATION.md**
