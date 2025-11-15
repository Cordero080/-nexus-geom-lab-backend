# Claude Study Prompt: Refactored Architecture

**Purpose**: A prompt to give Claude to help study the refactored Nexus-Geom-Lab architecture  
**Use Case**: Paste this into Claude when you want help understanding data flows and patterns  
**Context**: After Nov 14-15, 2025 refactorings (geometry consolidation + state extraction + quick wins + architecture flattening)

---

## 📋 The Prompt

```
I'm studying my refactored React + Three.js application architecture and need help tracing data flows and understanding patterns.

PROJECT CONTEXT:
- Nexus-Geom-Lab: 3D geometry visualization app
- Stack: React 19.1, Three.js 0.180, Vite 7.1
- Recently refactored: November 14-15, 2025
- Key improvements: Custom hooks, DRY principles, path aliases, error boundaries, flattened architecture

RECENT REFACTORINGS:
1. Extracted scene state to useSceneState custom hook (22 useState calls → 1 hook)
2. Consolidated duplicate geometry helpers (8 files with identical function → 1 shared utility)
3. Added path aliases (@/ imports instead of ../../)
4. Added error boundary for graceful error handling
5. Configured console log removal for production builds
6. **Flattened architecture (Nov 15)**: Moved HomePage hooks/styles/utils to top-level, merged /shared/ into /ui/

KEY FILES TO REFERENCE:
- src/hooks/useSceneState.js - Custom state management hook
- src/hooks/useParallax.js - Scroll parallax hook (moved from HomePage)
- src/hooks/useQuantumState.js - Quantum state hook (moved from HomePage)
- src/App.jsx - Main component using the hooks
- src/features/sceneControls/utils/geometryHelpers.js - Shared geometry utilities
- src/components/ui/ErrorBoundary/ErrorBoundary.jsx - Error handling (merged from /shared/)
- src/components/ui/HomeBackground/ - Background component (merged from /shared/)
- src/components/ui/Quote/ - Quote component (merged from /shared/)
- src/utils/portalWorlds.js - Portal configs (moved from HomePage)
- src/utils/quantumCollapse.js - Quantum utility (moved from HomePage)
- src/styles/homepage.scss - HomePage styles (moved from HomePage subfolder)
- src/styles/titles.scss - Title styles (moved from HomePage subfolder)
- vite.config.js - Build configuration with path aliases

ARCHITECTURE PATTERN (Nov 15):
- Top-level folders (/hooks/, /styles/, /utils/) contain ALL shared code
- /components/ui/ contains ALL reusable UI components (no more /shared/)
- Page folders (HomePage, MyScenesPage, Showcase) ONLY have components/ subfolders
- Consistent pattern across all pages

STUDY APPROACH I'M USING:
1. Trace data flows across 4-5 files
2. Follow imports using path aliases
3. Understand before/after refactoring
4. Document patterns in my own words
5. Build mental model of architecture
6. Understand architectural consistency principles

WHAT I NEED HELP WITH:
[Specify your question here - see examples below]

RESPONSE FORMAT I PREFER:
- Step-by-step traces with file paths
- Code snippets showing exact lines
- Before/after comparisons when relevant
- Visual diagrams when helpful (ASCII or mermaid)
- Explanation of WHY patterns were chosen, not just WHAT they do
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
