# Documentation Index

Your study materials organized by topic and learning stage.

---

## Quick Navigation

### Just Starting? 👉 BEGIN HERE

1. **STUDY_PLAN.md** ← Start with the 4-day learning plan
2. Follow the order: Foundation → Auth → 3D Rendering → Save/Load

### Need Help Understanding Data Flow? 👉 READ THIS

3. **hooks-customHooks/UNDERSTANDING_DATA_FLOW.md** ← Visual diagrams + examples
4. Shows you HOW props flow through your app

### Need a Quick Reference?

5. **hooks-customHooks/HOOKS_INVENTORY.md** ← Table format, no explanations
6. **hooks-customHooks/CUSTOM_HOOKS_GUIDE.md** ← Detailed hook documentation

---

## Documentation Files by Purpose

### Learning (New to the App)

| File                                         | Purpose                    | Read When                  |
| -------------------------------------------- | -------------------------- | -------------------------- |
| STUDY_PLAN.md                                | 4-day learning curriculum  | Starting to learn your app |
| hooks-customHooks/UNDERSTANDING_DATA_FLOW.md | How props flow through app | Confused about parameters  |

### Reference (Look Up Specific Topics)

| File                                    | Purpose                      | Read When                  |
| --------------------------------------- | ---------------------------- | -------------------------- |
| hooks-customHooks/HOOKS_INVENTORY.md    | All 11 hooks in table format | Need quick hook info       |
| hooks-customHooks/CUSTOM_HOOKS_GUIDE.md | Detailed hook documentation  | Need full hook explanation |

### Presentation Prep (Portfolio/Interviews) 🎤

| File                                                 | Purpose                           | Read When                    |
| ---------------------------------------------------- | --------------------------------- | ---------------------------- |
| study-plan-update/HOMEPAGE_FEATURES_STUDY_GUIDE.md   | Feature catalog with demo scripts | Preparing to present         |
| study-plan-update/HOMEPAGE_ARCHITECTURE_REFERENCE.md | Component structure & study paths | Learning HomePage structure  |
| study-plan-update/PRESENTATION_PREP_FLOWS.md         | General presentation strategies   | Planning your presentation   |
| refactoring/HOMEPAGE_MODULARIZATION.md               | Refactoring process & benefits    | Discussing code organization |

### Refactoring & Code Organization 🔧

| File                                   | Purpose                       | Read When                       |
| -------------------------------------- | ----------------------------- | ------------------------------- |
| refactoring/REFACTORING_PROGRESS.md    | Overall refactoring log       | Want to see all improvements    |
| refactoring/HOMEPAGE_MODULARIZATION.md | HomePage component extraction | Learning component architecture |
| refactoring/CSS_MODULES_MIGRATION.md   | CSS refactoring process       | Understanding styling approach  |
| refactoring/SHOWCASE_REORGANIZATION.md | Showcase page improvements    | Studying that page structure    |

## How to Use These Docs

### Scenario 1: "I want to understand my whole app"

→ Read **STUDY_PLAN.md** (follow the 4-day plan)

### Scenario 2: "I'm confused about where sceneRef comes from"

→ Read **UNDERSTANDING_DATA_FLOW.md** (scroll to "All Hooks Documented This Way")

### Scenario 3: "I need to know what useObjectManager does"

→ Read **CUSTOM_HOOKS_GUIDE.md** (search for useObjectManager)

### Scenario 4: "I forgot which hook manages lighting"

→ Read **HOOKS_INVENTORY.md** (check the category table)

### Scenario 5: "I'm debugging and need to trace data flow"

→ Read **UNDERSTANDING_DATA_FLOW.md** (check "Debug with console.log" section)

---

## 10 Core Files You'll Study

These are referenced in STUDY_PLAN.md:

### Frontend

1. `src/App.jsx` - App structure
2. `src/features/sceneControls/ThreeScene.jsx` - 3D rendering
3. `src/components/Controls/Controls.jsx` - User controls
4. `src/context/AuthContext.jsx` - Auth state
5. `src/services/sceneApi.jsx` - API calls
6. `src/components/Controls/SaveButton/SaveButton.jsx` - Save logic
7. `src/Showcase/ShowcaseGallery.jsx` - Gallery display

### Backend

8. `backend/models/User.js` - User schema
9. `backend/routes/auth.js` - Auth routes
10. `backend/routes/scenes.js` - Scene routes

---

## Study Phases

### Phase 1: Foundation (1 hour)

Learn the basic structure

- App.jsx
- AuthContext.jsx
- UNDERSTANDING_DATA_FLOW.md (intro only)

### Phase 2: Authentication (2.5 hours)

Learn how users sign up and login

- auth.js (backend routes)
- User.js (database schema)
- sceneApi.jsx (API calls)

### Phase 3: 3D Rendering (2 hours)

Learn how 3D scenes are displayed

- ThreeScene.jsx
- Controls.jsx

### Phase 4: Save & Load (2.5 hours)

Learn how scenes are saved and loaded

- SaveButton.jsx
- scenes.js (backend routes)
- ShowcaseGallery.jsx

### Phase 5: Deep Dive (As needed)

Learn hook details

- CUSTOM_HOOKS_GUIDE.md
- HOOKS_INVENTORY.md

**Total Time: ~7-10 hours**

---

## File Organization

```
docs/
├── STUDY_PLAN.md                    ← 4-day curriculum (START HERE)
├── DOCUMENTATION_INDEX.md            ← This file
├── hooks-customHooks/
│   ├── CUSTOM_HOOKS_GUIDE.md        ← Detailed hook docs (11 hooks)
│   ├── HOOKS_INVENTORY.md           ← Quick reference tables
│   └── UNDERSTANDING_DATA_FLOW.md   ← How data flows through app
└── [other original docs]
```

---

## What Each Document Teaches You

| Document                   | Teaches You                | Format                  |
| -------------------------- | -------------------------- | ----------------------- |
| STUDY_PLAN.md              | Complete app learning path | Sequential curriculum   |
| UNDERSTANDING_DATA_FLOW.md | How props flow through app | Step-by-step + diagrams |
| CUSTOM_HOOKS_GUIDE.md      | What each hook does        | Detailed with examples  |
| HOOKS_INVENTORY.md         | Quick hook lookup          | Tables + categories     |

---

## Key Concepts Covered

### Architecture

- ✅ Frontend: React + Three.js (3D graphics)
- ✅ Backend: Node.js + Express + MongoDB
- ✅ Communication: REST API + JWT tokens

### Data Flow

- ✅ How props flow from App.jsx → ThreeScene.jsx
- ✅ How state updates trigger re-renders
- ✅ How API calls communicate with backend

### User Journey

- ✅ Signup/Login flow
- ✅ 3D scene interaction
- ✅ Scene saving and loading
- ✅ Gallery browsing

### Code Organization

- ✅ useRef for Three.js object persistence
- ✅ Custom hooks for separation of concerns
- ✅ Context for global state (Auth, Scene)
- ✅ API service layer for backend calls

---

## Recommended Learning Path

```
Day 1 Morning:
  → STUDY_PLAN.md (read intro + Phase 1)
  → Start with App.jsx

Day 1 Afternoon:
  → AuthContext.jsx
  → UNDERSTANDING_DATA_FLOW.md (Core Concept section)

Day 2 Morning:
  → backend/routes/auth.js
  → backend/models/User.js

Day 2 Afternoon:
  → sceneApi.jsx
  → Review UNDERSTANDING_DATA_FLOW.md (parameter section)

Day 3 Morning:
  → ThreeScene.jsx
  → HOOKS_INVENTORY.md (scan for reference)

Day 3 Afternoon:
  → Controls.jsx
  → Trace one feature end-to-end

Day 4 Morning:
  → SaveButton.jsx
  → backend/routes/scenes.js

Day 4 Afternoon:
  → ShowcaseGallery.jsx
  → CUSTOM_HOOKS_GUIDE.md (reference as needed)
```

---

## Tips for Effective Learning

### 1. Read Files in Order

Study Phase 1 before Phase 2, etc. Don't jump around.

### 2. Use Documentation

When confused about parameters, consult UNDERSTANDING_DATA_FLOW.md immediately.

### 3. Answer Key Questions

Each section in STUDY_PLAN.md has questions. Answer them before moving on.

### 4. Trace One Feature

Pick something simple and trace it through all files. Example:

- "What happens when I change the base color?"
- "What happens when I click Save Scene?"

### 5. Create Personal Notes

As you learn, write your own version of the docs in simpler language.

### 6. Use Console.log for Debugging

When stuck, add console logs to trace data flow. See UNDERSTANDING_DATA_FLOW.md for examples.

---

## Still Confused About Something?

**Common Questions:**

Q: "Where does `sceneRef` come from?"
A: Read UNDERSTANDING_DATA_FLOW.md → "All Hooks Documented This Way" → useSceneInitialization()

Q: "What does useObjectManager do?"
A: Read CUSTOM_HOOKS_GUIDE.md → "useObjectManager()" section

Q: "What hooks exist?"
A: Read HOOKS_INVENTORY.md → "Hooks by Location" table

Q: "How do props flow from App to ThreeScene?"
A: Read UNDERSTANDING_DATA_FLOW.md → "Visual Diagram: The Complete Flow"

Q: "What's the complete user journey?"
A: Read STUDY_PLAN.md → "Complete App Flow (What You'll Understand)"

Q: "Which feature should I demo for my presentation?"
A: Read HOMEPAGE_FEATURES_STUDY_GUIDE.md → "Recommended Presentation Feature" (Text Scramble is top pick!)

Q: "How is HomePage organized?"
A: Read HOMEPAGE_ARCHITECTURE_REFERENCE.md → "File Tree" + "Study Paths by Interest"

Q: "What refactoring was done?"
A: Read REFACTORING_PROGRESS.md → See both geometry extraction (89%) and HomePage modularization (62%)

---

## Success Milestones

- ✅ **After Phase 1**: Understand overall app structure
- ✅ **After Phase 2**: Understand authentication system
- ✅ **After Phase 3**: Understand 3D rendering pipeline
- ✅ **After Phase 4**: Understand save/load system
- ✅ **After Phase 5**: Can confidently modify any file

---

## Next Steps

1. Open **STUDY_PLAN.md**
2. Start with Phase 1
3. Read the files in order
4. Answer the key questions
5. Come back to this index if you get lost

Good luck! 🚀
