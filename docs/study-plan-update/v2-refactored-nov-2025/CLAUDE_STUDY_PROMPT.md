# Claude Study Prompt: Refactored Architecture

**Purpose**: A prompt to give Claude to help study the refactored Nexus-Geom-Lab architecture  
**Use Case**: Paste this into Claude when you want help understanding data flows and patterns  
**Context**: After Nov 14-15, 2025 refactorings (geometry consolidation + state extraction + quick wins + architecture flattening + props consolidation)

---

## 📋 The Prompt

```
UPDATED 11/15/25 - I'm Pablo - bootcamp student (6 months, not 9), career-changer from martial arts (3rd degree black belt Okinawan Goju Ryu). Just presented capstone "Nexus Geom Lab" - gamified 4D geometry exploration platform.

## PROJECT OVERVIEW
- Full-stack: React + Three.js + Node + MongoDB + JWT auth
- 48 modular components: 11 custom hooks + 37 geometry functions
- Refactored from 3,700 lines → 199 lines (93% reduction)
- Gamification: unlock animated characters by saving scenes
- TWO 3D systems:
  * Raw Three.js for Geom Lab (precise control, custom math shapes)
  * React Three Fiber for Showcase (FBX models, simpler displays)

## RECENT PRESENTATION (Wednesday)
Mixed reactions:
- Instructor: "Came out awesome, not out of left field for you, I'll text you"
- Evan (assistant instructor): "Epilepsy warning" joke, then "good job though"
- Students: "Pablo loves neon" → "wow this looks crazy"
- Some awkwardness - I had longest presentation, most complex project
- Instructor held back praise to not make class feel inadequate
- I think they suspect heavy AI use (I was transparent about it)

## POST-PRESENTATION REFACTORING (Last 2 Days - Nov 14-15)
Completed 8 major improvements:
1. useSceneState hook - extracted 22 useState from App.jsx
2. Duplicate utils cleanup - removed 519 lines
3. Path aliases - @/ imports instead of ../../../
4. .env.example - documented environment variables
5. Error boundary - production error handling
6. Console.log cleanup - removed debug statements
7. **Architecture flattening (Nov 15)** - moved HomePage hooks/styles/utils to top-level, merged /shared/ into /ui/
8. **Props consolidation (Nov 15)** - replaced 42 individual props with 2 objects (config + onChange)

## NEW ARCHITECTURE PATTERN (Nov 15 - IMPORTANT)
**Flattened structure for consistency:**
- All hooks now in `/src/hooks/` (useSceneState, useParallax, useQuantumState)
- All styles in `/src/styles/` (homepage.scss, titles.scss, etc.)
- All utils in `/src/utils/` (portalWorlds.js, quantumCollapse.js, etc.)
- `/shared/` merged into `/ui/` (ErrorBoundary, HomeBackground, Quote now in /ui/)
- **Every page** (HomePage, MyScenesPage, Showcase) now has ONLY `components/` subfolder
- Top-level = shared, page-level = page-specific

**Props consolidation pattern (Nov 15 - CRITICAL FOR STUDY):**
- **Before**: App.jsx passed 42 individual props (21 values + 21 setters) to Controls
- **After**: App.jsx passes 2 objects: `config` (values) + `onChange` (setters)
- **Before**: ThreeScene received 21 individual props
- **After**: ThreeScene receives 1 `config` object
- **Result**: 70% reduction in JSX (~100 lines → ~30 lines in App.jsx)

**Why this matters for study:**
- Consistent pattern across all pages
- Clear decision rules: hooks/utils/styles → top-level, components → page-level
- Easier navigation (predictable structure)
- **Props pattern**: Always group related values into objects, not individual props
- **Cleaner component APIs**: Functions receive objects, not dozens of params

## COPILOT-GENERATED STUDY DOCS (IN /docs/study-plan-update/v2-refactored-nov-2025/)
**Updated Nov 15 with architecture flattening + props consolidation:**

1. **REFACTORING_CHANGELOG.md**
   - All refactoring history (Nov 14-15)
   - Added Refactoring #4: Architecture Flattening
   - Added Refactoring #5: Props Consolidation
   - Before/after folder structures
   - What moved where (6 files to top-level, 3 to /ui/)
   - Props consolidation code examples

2. **STUDY_GUIDE_REFACTORED.md**
   - Added Section 5: Architecture Flattening
   - Added Section 6: Props Consolidation
   - Decision rules for file placement
   - Updated study checklist

3. **CLAUDE_STUDY_PROMPT.md** (THIS FILE)
   - Updated with Nov 15 context
   - Added Question 9: Architecture Flattening
   - Added Question 10: Props Consolidation Pattern
   - Updated file references (new paths)

4. **STUDY_PLAN_V2.md**
   - 4-week practical execution plan
   - Daily trace exercises

5. **STUDY_METHOD_PHILOSOPHY.md**
   - Core learning principles
   - Study session template

## MY STUDY METHOD (CRITICAL - THIS IS HOW I LEARN)
**The 4-5 File Trace Pattern (UPDATED for props consolidation):**
1. **src/hooks/useSceneState.js** (state hook - NEW location after flattening)
2. App.jsx (uses hook, creates config object, passes to children)
3. Controls.jsx (receives config + onChange objects, NOT 42 individual props)
4. ThreeScene.jsx (receives config object, destructures values at top)
5. features/sceneControls/hooks/ (useEffect watches state, updates Three.js)

**Key concepts I struggled with:**
- refs as "boxes": `useRef(null)` creates box → `ref.current = thing` fills box
- useEffect as "liaison": Bridges React state changes to Three.js updates
- .current pattern: ALWAYS use .current to access ref contents
- **Object props pattern**: Group related data instead of prop drilling
- **Destructuring at component top**: Clean access to config values

**Study exercises we did:**
- Traced metalness flow: useSceneState → App.jsx → Controls → ThreeScene → useMaterialUpdates
- Traced camera flow: User clicks button → onCameraViewChange → setCameraView → useCameraController
- Understood dependency arrays: [metalness] watches for changes
- **NEW: Traced props consolidation**: How config object replaces 21 individual props

## CURRENT STUDY FOCUS
Reference the docs in `/docs/study-plan-update/v2-refactored-nov-2025/` to help me:
- Trace data flow with new useSceneState hook
- Understand path aliases (@/ imports) in practice
- **Understand new flattened architecture (where files moved, why consistency matters)**
- **Understand props consolidation pattern (config + onChange objects)**
- Study updated architecture using my 4-5 file method
- Compare old trace patterns vs new refactored patterns

## MY LEARNING STYLE
- Hands-on tracing through files
- Need specific questions, not broad ones
- One step at a time, building complexity
- Visual learner (need to SEE the files open)
- Get frustrated with long explanations - prefer concise breakdowns
- Need encouragement when doubting

## TONE PREFERENCES
- Don't over-explain or use too much formatting
- Be direct, not verbose
- When I say "I'm done with this shit" - recognize burnout, offer breaks
- I respond well to: "You're on track" / "This is normal" / "Take the win"

Can you help me study the refactored architecture using my trace method and the Copilot-generated study docs?
```

---

## 🎯 Example Study Questions

Copy the prompt above, then add one of these specific questions:

### Question 1: State Flow Tracing
```
WHAT I NEED HELP WITH:
Trace the complete data flow when a user moves the metalness slider:

1. Start: User moves slider in MaterialPropertiesSection.jsx
2. End: Three.js material updates in the 3D scene

Please show:
- Each file involved (with line numbers if possible)
- How useSceneState hook manages the state
- How props flow from App.jsx → Controls → ThreeScene
- Where the actual 3D material update happens
- Why this pattern is better than keeping state in App.jsx directly
```

### Question 2: Custom Hook Pattern
```
WHAT I NEED HELP WITH:
Help me understand the useSceneState custom hook pattern:

1. Why extract 22 useState calls into a custom hook?
2. How is the state organized? (I see material, hyperframe, scene, lighting, animation domains)
3. Why return a flat object instead of nested objects?
4. Could this hook be used in other components besides App.jsx? How?
5. What's the difference between this approach and using Context API?

Show me:
- The hook's structure in useSceneState.js
- How App.jsx consumes it
- Pros/cons of this pattern
- When to use custom hooks vs other state management
```

### Question 3: DRY Principle Application
```
WHAT I NEED HELP WITH:
Explain the geometry helpers consolidation:

1. What was the problem? (I know 8 files had createTesseractWithFaces)
2. Show me before/after structure
3. How do all 7 polytope files now use the shared function?
4. What happens when I need to fix a bug in createTesseractWithFaces now vs before?
5. Are there other opportunities for consolidation in the project?

Walk me through:
- The shared function in utils/geometryHelpers.js
- Import statements in the polytope files
- Benefits beyond just "less code"
```

### Question 4: Path Alias System
```
WHAT I NEED HELP WITH:
Understanding the path alias system:

1. How does @/components resolve to ./src/components?
2. Why do I need both vite.config.js and jsconfig.json?
3. Show me examples of before/after imports in App.jsx
4. How does this make refactoring easier?
5. What happens when I move a file to a different folder?

Please show:
- The configuration in vite.config.js
- VS Code support via jsconfig.json
- Concrete examples from the codebase
- Best practices for organizing imports
```

### Question 5: Error Boundary Lifecycle
```
WHAT I NEED HELP WITH:
Deep dive into the ErrorBoundary component:

1. Why must it be a class component, not functional?
2. Explain getDerivedStateFromError vs componentDidCatch
3. What types of errors CAN it catch? What CAN'T it catch?
4. Walk through the error lifecycle step-by-step
5. Where else in my app should I add error boundaries?

Show me:
- The ErrorBoundary.jsx implementation line by line
- How main.jsx wraps the app
- What happens when ThreeScene.jsx throws an error
- The fallback UI and recovery mechanisms
```

### Question 6: Build Optimization
```
WHAT I NEED HELP WITH:
Understanding the production build optimizations:

1. How does vite-plugin-remove-console work?
2. Why remove console.log but keep console.error?
3. What's the difference between dev build and production build?
4. Show me what the output code looks like after processing
5. What other build optimizations could I add?

Walk me through:
- The plugin configuration in vite.config.js
- Development vs production behavior
- Performance impact of console statements
- Environment variable usage in builds
```

### Question 7: Complete Feature Flow
```
WHAT I NEED HELP WITH:
Trace a complete feature from UI to 3D scene:

Feature: User changes base color

Show me:
1. The color picker component (which file? which prop?)
2. How the color value flows through Controls.jsx
3. useSceneState hook's role in managing color state
4. App.jsx passing color to ThreeScene
5. ThreeScene applying color to Three.js material
6. Any color format conversions (HTML input vs Three.js)

Include:
- File paths and approximate line numbers
- Before/after refactoring comparison
- Error handling for invalid colors
- Why this architecture scales well
```

### Question 8: Adding a New Feature
```
WHAT I NEED HELP WITH:
I want to add a "fog intensity" slider. Walk me through:

1. Where to add the state in useSceneState.js
2. How to destructure it in App.jsx
3. Which Control section component to modify
4. How to pass it to ThreeScene
5. How ThreeScene would apply fog to the 3D scene
6. Testing the complete flow

Show me:
- Exact code additions needed
- Following existing patterns in the codebase
- Best practices from the refactored architecture
- Common pitfalls to avoid
```

### Question 9: Architecture Flattening (Nov 15, 2025)
```
WHAT I NEED HELP WITH:
Explain the architecture flattening refactor from November 15:

1. What was inconsistent before? (HomePage had hooks/styles/utils, other pages didn't)
2. Show the before/after folder structure
3. Where did useParallax.js and useQuantumState.js move to?
4. Where did ErrorBoundary, HomeBackground, and Quote move to?
5. What's the pattern now - where should I put new hooks/styles/utils?
6. Why is this consistency important for scalability?
7. How does git mv preserve file history?

Show me:
- Complete before/after directory tree
- Updated import paths in HomePage.jsx and other affected files
- The decision rules for where to put new files
- How to follow this pattern when creating new pages
- Why we merged /shared/ into /ui/
```

### Question 10: Props Consolidation Pattern (Nov 15, 2025)
```
WHAT I NEED HELP WITH:
Explain the props consolidation refactor from November 15:

1. What was the problem with passing 42 individual props?
2. Show me the before/after in App.jsx (how props are passed)
3. Show me the before/after in ThreeScene.jsx (how props are received)
4. Show me the before/after in Controls.jsx (how props are received)
5. How does destructuring work at the component top?
6. Why is `config` read-only and `onChange` write-only?
7. What's the benefit of this pattern when adding new features?

Walk me through:
- App.jsx creating the sceneConfig object
- App.jsx creating the onChange object with all setters
- ThreeScene receiving config, destructuring at top
- Controls receiving config + onChange, using both
- How child components (MaterialPropertiesSection, etc.) still work
- Before/after comparison: adding a new "fog intensity" feature
```

---

## 🔄 How to Use This Prompt

### Step 1: Copy Base Prompt
Copy the "The Prompt" section at the top (PROJECT CONTEXT through RESPONSE FORMAT).

### Step 2: Choose Study Question
Pick one of the example questions above, or write your own.

### Step 3: Paste Into Claude
Open a new Claude conversation, paste the combined prompt.

### Step 4: Follow Up
Ask follow-up questions based on Claude's response:
- "Can you show me the exact code for that?"
- "What would happen if I did X instead?"
- "Show me a diagram of that flow"
- "Compare this to how it worked before refactoring"

### Step 5: Document Learning
Write down your understanding in your own words after the conversation.

---

## 💡 Tips for Effective Study Sessions

### Do This:
✅ Ask specific questions about exact files and functions  
✅ Request code snippets with file paths and line numbers  
✅ Ask for before/after comparisons  
✅ Request explanations of WHY, not just WHAT  
✅ Follow up with "why is that better?" questions  
✅ Ask Claude to point out potential issues or improvements  

### Avoid This:
❌ Vague questions like "explain the app"  
❌ Asking Claude to write new features without understanding first  
❌ Accepting explanations you don't fully understand  
❌ Skipping the documentation step after learning  
❌ Not tracing the code yourself alongside Claude's explanation  

---

## 📊 Study Session Template

Use this template for each study session:

```
SESSION: [Date]
TOPIC: [What pattern/flow am I studying?]
FILES OPEN: [List 4-5 files I'm tracing through]

QUESTION FOR CLAUDE:
[Paste the base prompt + specific question]

CLAUDE'S EXPLANATION:
[Summarize key points in my own words]

CODE TRACE:
[Write out the step-by-step flow myself]

WHAT I LEARNED:
1. [Key insight]
2. [Pattern identified]
3. [Why it matters]

FOLLOW-UP QUESTIONS:
- [Things I still don't understand]
- [Deeper dives needed]

NEXT SESSION:
[What to study next based on today's learning]
```

---

## 🎯 Recommended Study Sequence

### Week 1: Foundations
**Day 1:** Path alias system + custom hooks basics  
**Day 2:** useSceneState hook deep dive  
**Day 3:** Trace one complete state flow (metalness slider)  
**Day 4:** DRY principle + geometry consolidation  
**Day 5:** Error boundaries + error handling  

### Week 2: Data Flows
**Day 1:** Material properties flow (color, metalness, emissive)  
**Day 2:** Lighting system flow (ambient + directional)  
**Day 3:** Animation flow (scale, speeds, styles)  
**Day 4:** Camera control flow (free, orbit, top)  
**Day 5:** Environment system flow (backgrounds, hue)  

### Week 3: Advanced Patterns
**Day 1:** Build optimization (console removal, env vars)  
**Day 2:** Three.js integration patterns  
**Day 3:** Component composition (Controls sections)  
**Day 4:** Handler patterns (createSliderHandler)  
**Day 5:** Performance optimizations  

### Week 4: Application
**Day 1:** Add a new state variable end-to-end  
**Day 2:** Create a new control section  
**Day 3:** Add error boundary to a specific feature  
**Day 4:** Consolidate more duplicate code  
**Day 5:** Refactor another large component using patterns learned  

---

## 📚 Related Documentation

Read these before or after Claude study sessions:

- `REFACTORING_CHANGELOG.md` - What changed and why
- `STUDY_GUIDE_REFACTORED.md` - Concepts to understand
- `STUDY_PLAN_V2.md` - Structured learning path
- `docs/reference/workflows/QUICK_WINS_GUIDE.md` - Implementation details
- `docs/reference/workflows/SCENE_STATE_REFACTOR.md` - State refactor rationale

---

## 🧠 Meta-Learning: Why This Approach Works

### Active vs Passive Learning
- **Passive**: Reading code → low retention
- **Active**: Tracing flows with Claude → high retention

### Incremental Complexity
- Start with simple flows (one slider)
- Build to complex (full save/load system)
- Each session builds on previous knowledge

### Multiple Modalities
- Reading Claude's explanations
- Writing my own summaries
- Tracing code manually
- Explaining to others (rubber duck)

### Spaced Repetition
- Revisit same concepts in different contexts
- Week 1: Learn pattern
- Week 2: Apply pattern
- Week 3: Teach pattern

### Socratic Method
- Don't just ask "how does this work?"
- Ask "why is this better than X?"
- Ask "what would break if I changed Y?"
- Ask "how would I extend this for Z?"

---

**Created**: November 14, 2025  
**For**: Future me studying the refactored architecture  
**Update**: Modify this prompt as architecture evolves
