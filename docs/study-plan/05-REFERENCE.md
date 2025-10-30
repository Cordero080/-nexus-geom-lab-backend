# Priority 5: Reference Materials (Use as Needed)

**Time: Anytime**  
**When to use: When implementing features or debugging**

After you complete Priorities 1-4, you have the foundation. Use these materials to look up specific information.

---

## What's in This Section

You have three reference documents that go deeper into specific topics.

---

## Reference 1: Understanding Data Flow

**Document:** `docs/hooks-customHooks/UNDERSTANDING_DATA_FLOW.md`

### Use When:

- Confused about parameter destructuring
- Can't figure out where a variable comes from
- Want to understand how props flow through a component
- Debugging parameter issues

### Key Sections:

- **Core Concept** - Explains destructuring completely
- **Full Data Flow Example** - Shows one complete flow
- **Visual Diagram** - Big picture of how everything connects
- **Common Patterns** - Recurring code patterns you'll see
- **Debugging Tip** - How to use console.log to trace flow

### Example Use:

```
You see: const { sceneRef, objectsRef } = refs;
You're confused where sceneRef comes from?
→ Go to UNDERSTANDING_DATA_FLOW.md
→ Read "Core Concept" section
→ Scroll to "useObjectManager() example"
→ Now you understand!
```

---

## Reference 2: Hooks Quick Lookup

**Document:** `docs/hooks-customHooks/HOOKS_INVENTORY.md`

### Use When:

- Need quick info about a specific hook
- Want to see all hooks in one place
- Looking for what a hook returns
- Checking which file a hook is in

### Key Sections:

- **Hooks by Location** - Where each hook lives
- **Hooks by Category** - Organized by purpose
- **Quick Reference Tables** - Parameters, returns, etc.
- **Common Issues & Solutions** - Troubleshooting

### Example Use:

```
You need to know what useObjectManager returns?
→ Go to HOOKS_INVENTORY.md
→ Search for useObjectManager in table
→ See: "Returns: void (manages refs)"
→ Quick answer without reading full guide!
```

---

## Reference 3: Detailed Hook Guide

**Document:** `docs/hooks-customHooks/CUSTOM_HOOKS_GUIDE.md`

### Use When:

- Need to understand HOW a hook works
- Want example code for using a hook
- Learning about a hook you've never seen
- Need full documentation of all parameters

### Key Sections:

- **Each hook has:**
  - Location (file path)
  - Purpose (what it does)
  - What it does (detailed explanation)
  - Parameters (all inputs)
  - Returns (all outputs)
  - Example Usage (copy-paste code)

### Example Use:

```
You need to use useAnimationLoop() for the first time?
→ Go to CUSTOM_HOOKS_GUIDE.md
→ Search for useAnimationLoop
→ Read "What it does" section
→ Copy the "Example Usage" code
→ Modify for your needs
```

---

## Decision Tree: Which Reference to Use

### "I don't understand the parameter here"

↓ → Read **UNDERSTANDING_DATA_FLOW.md**

### "I forgot what this hook does"

↓ → Read **HOOKS_INVENTORY.md** (quick table)

### "I need to use this hook but don't know how"

↓ → Read **CUSTOM_HOOKS_GUIDE.md** (full with examples)

### "I'm debugging and props aren't flowing right"

↓ → Read **UNDERSTANDING_DATA_FLOW.md** (sections on debugging)

### "I need to add a new hook call - where's the pattern?"

↓ → Read **CUSTOM_HOOKS_GUIDE.md** (look for similar hook)

### "I just need a quick reminder what hook does what"

↓ → Read **HOOKS_INVENTORY.md** (tables)

---

## Complete File Locations

### Frontend Files (Already Studied)

```
src/
├── App.jsx                        Priority 1
├── context/
│   └── AuthContext.jsx            Priority 1 & 2
├── services/
│   └── sceneApi.jsx               Priority 2
├── components/
│   ├── Controls/
│   │   ├── Controls.jsx           Priority 3
│   │   └── SaveButton/
│   │       └── SaveButton.jsx     Priority 4
│   └── ...
├── features/sceneControls/
│   ├── ThreeScene.jsx             Priority 3
│   └── hooks/
│       ├── useObjectManager.js    Priority 5 (Reference)
│       ├── useMaterialUpdates.js  Priority 5 (Reference)
│       ├── useSceneInitialization.js
│       ├── useLightingUpdates.js
│       ├── useCameraController.js
│       ├── useAnimationLoop.js
│       ├── useObjectInteraction.js
│       └── useSceneEffects.js
├── Showcase/
│   └── ShowcaseGallery.jsx        Priority 4
└── utils/
    └── textScrambler.jsx          Advanced
```

### Backend Files (Already Studied)

```
backend/
├── routes/
│   ├── auth.js                    Priority 2
│   └── scenes.js                  Priority 4
├── models/
│   └── User.js                    Priority 2
└── ...
```

### Documentation Files (This Folder)

```
docs/
├── STUDY_PLAN.md                  ← Original study plan
├── DOCUMENTATION_INDEX.md          ← Navigation map
├── study-plan/                     ← You are here
│   ├── 00-INDEX.md                Main index
│   ├── 01-PRIORITY-1-FOUNDATION.md
│   ├── 02-PRIORITY-2-AUTHENTICATION.md
│   ├── 03-PRIORITY-3-3D-RENDERING.md
│   ├── 04-PRIORITY-4-SAVE-LOAD.md
│   └── 05-REFERENCE.md            ← You are here
└── hooks-customHooks/              ← Reference materials
    ├── UNDERSTANDING_DATA_FLOW.md
    ├── HOOKS_INVENTORY.md
    └── CUSTOM_HOOKS_GUIDE.md
```

---

## Common Questions & Answers

### Q: "I understand Priorities 1-4 but something feels missing"

A: Check the hooks docs. You learned WHAT hooks do, but if you need HOW details, read CUSTOM_HOOKS_GUIDE.md

### Q: "I want to add a new feature - where do I start?"

A:

1. Identify which Priority files are involved
2. Read them again for context
3. Use reference docs for specific hook details
4. Trace similar existing features

### Q: "I'm debugging and can't find where data comes from"

A: Use UNDERSTANDING_DATA_FLOW.md debugging section. Add console.logs to trace.

### Q: "The code is written differently than the docs show"

A: Check if it's been refactored. The general patterns remain the same even if syntax changes.

### Q: "Which files should I read first if I'm new?"

A: Start with 00-INDEX.md (this folder), then follow 01-04 in order.

### Q: "Can I skip parts?"

A: Not recommended. Priority 2 needs Priority 1, Priority 3 needs 1-2, etc.

---

## Using These Materials While Coding

### Scenario 1: Adding a New Control

1. Open Priority 3 (Controls.jsx)
2. Find similar control
3. Copy its pattern
4. Reference CUSTOM_HOOKS_GUIDE.md if you need to add a new hook

### Scenario 2: Debugging a Save Issue

1. Review Priority 4 (SaveButton flow)
2. Check SaveButton.jsx
3. Check backend routes/scenes.js
4. Use UNDERSTANDING_DATA_FLOW.md to trace the issue

### Scenario 3: Learning About a Specific Hook

1. Open HOOKS_INVENTORY.md
2. Find the hook in a table
3. If quick info enough, done!
4. If need more detail, go to CUSTOM_HOOKS_GUIDE.md

### Scenario 4: Understanding Why a Parameter Fails

1. Look at the code
2. Open UNDERSTANDING_DATA_FLOW.md
3. Find the "All Hooks Documented This Way" section
4. Find your hook
5. See step-by-step how parameters are destructured

---

## Tips for Effective Reference Use

### 1. Don't Read Everything

Only read what you need. References are lookup docs, not textbooks.

### 2. Use Find (Ctrl+F or Cmd+F)

All docs are searchable. Search for your hook name or concept.

### 3. Bookmark Important Sections

In your browser, bookmark the reference docs for quick access.

### 4. Print for Quick Reference

Print HOOKS_INVENTORY.md and keep nearby while coding.

### 5. Update as You Learn

When you discover something new, add it to your mental model.

---

## When to Read Each Reference

| Situation                              | Document                   |
| -------------------------------------- | -------------------------- |
| Confused about `const { x, y } = obj;` | UNDERSTANDING_DATA_FLOW.md |
| Forgot what useAnimationLoop does      | HOOKS_INVENTORY.md         |
| Need to implement useAnimationLoop     | CUSTOM_HOOKS_GUIDE.md      |
| Debugging props flow issue             | UNDERSTANDING_DATA_FLOW.md |
| Comparing two hooks                    | HOOKS_INVENTORY.md         |
| Understanding one hook deeply          | CUSTOM_HOOKS_GUIDE.md      |
| Searching for a specific parameter     | HOOKS_INVENTORY.md         |
| Need example code for a hook           | CUSTOM_HOOKS_GUIDE.md      |

---

## You're Ready When

After studying Priorities 1-4 and using these references:

- ✅ You can trace any feature end-to-end
- ✅ You can add new features
- ✅ You can debug issues
- ✅ You know where to find information
- ✅ You can explain your app to others
- ✅ You're not scared of the codebase anymore

---

## Final Thoughts

Congratulations on completing the study plan! 🎉

You now understand:

- How your app is structured
- How data flows through it
- How users authenticate
- How 3D rendering works
- How scenes are saved and loaded

You have three reference documents to look up specific details whenever needed.

**You're no longer learning your app - you're mastering it!**

---

## Next Steps After This

1. **Implement a new feature** - Apply what you've learned
2. **Refactor something** - Improve existing code
3. **Help a colleague** - Explain your app to someone else
4. **Debug something** - Use your understanding to fix issues
5. **Add documentation** - Document YOUR specific features

You're ready for anything! 🚀

---

## Quick Links

- **Back to main index:** `00-INDEX.md`
- **Priority 1:** `01-PRIORITY-1-FOUNDATION.md`
- **Priority 2:** `02-PRIORITY-2-AUTHENTICATION.md`
- **Priority 3:** `03-PRIORITY-3-3D-RENDERING.md`
- **Priority 4:** `04-PRIORITY-4-SAVE-LOAD.md`

---

## Still Stuck?

If these references don't help:

1. Add console.log to trace the flow
2. Use browser DevTools to debug
3. Review the actual Priority files again
4. Compare similar working features

Good luck! 🌟
