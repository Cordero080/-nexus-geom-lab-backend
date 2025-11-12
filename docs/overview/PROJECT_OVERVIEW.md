# Nexus-Geom 3D - Project Overview

## What Is This Project?

**Nexus-Geom 3D** is a full-stack interactive 3D geometry platform that visualizes hyperdimensional (4D) shapes in 3D space with gamified progression, audio reactivity, and scene management. Built with React, Three.js, and MongoDB, it transforms abstract mathematical concepts into an engaging visual experience.

---

## The Vision

Coming from art and motion graphics, I wanted to **visualize how compound polytopes (4D shapes) work in 3D space**. I designed the spatial relationships and aesthetic direction, then collaborated with AI tools to handle the mathematical implementation.

**Core Philosophy:**

- Make complex 4D geometry accessible and interactive
- Gamify geometric exploration through progressive unlocks
- Create a cohesive quantum/sci-fi aesthetic
- Build a full-stack platform for saving and sharing creations

---

## What Users Can Do

### 1. Explore 24 Advanced Geometries

From basic shapes to complex 4D polytopes:

- Classical 3D shapes (sphere, cube, icosahedron, etc.)
- Hyperdimensional structures (tesseracts, 120-cell, 600-cell)
- Compound polytopes (nested and interpenetrating shapes)
- Quantum manifolds (custom mathematical surfaces)

### 2. Real-Time Interactive Controls

Manipulate geometry with live visual feedback:

- **Material Properties**: Metalness, emissive glow, wireframe intensity
- **Animation Styles**: Rotate, float, vertex deformation, 5-phase choreography
- **Lighting System**: Ambient + directional lights with full 3D positioning
- **Environment Themes**: Quantum backgrounds with 360° hue rotation
- **Camera Views**: Free orbit, side-lock, top-down, isometric

### 3. Audio Reactive Visualizations

Geometry responds to microphone input in real-time:

- **Bass frequencies** (20-250 Hz) → X-axis rotation + scale pulsing + depth movement
- **Mid frequencies** (250-2000 Hz) → Y/Z-axis rotation
- **Dynamic color cycling**: Mesh and hyperframe change colors independently every 3 rotations
- **Smooth transitions**: Colors blend gradually using lerp interpolation
- **Smart noise filtering**: Adaptive thresholds prevent reactions to ambient sound
- **Momentum physics**: Natural acceleration/deceleration with 50% friction

### 4. Save & Manage Personal Scenes

Full CRUD system with MongoDB backend:

- **Create scenes**: Save any combination of geometry, animation, colors, lighting
- **Personal gallery**: "My Scenes" page showing all saved configurations
- **Update scenes**: "Transmute" button updates existing scenes
- **Delete scenes**: Remove unwanted creations
- **Load scenes**: Instantly restore saved configurations

### 5. Progressive Character Unlocks

Gamified system rewarding scene creation:

- **3 animated characters**: Nexus Prime, Icarus-X, Vectra
- **Multiple animations per character**: Unlock new moves by saving scenes
- **Unique visual effects**:
  - Nexus Prime: Quantum shockwaves with spectral colors
  - Icarus-X: Digital glitch bursts and energy particles
  - Vectra: Holographic spellcast effects
- **Animation switcher**: Toggle between unlocked moves
- **Speed controls**: Slow down/speed up to appreciate details

### 6. Character Showcase Experience

Professional presentation of 3D characters:

- **Custom environments**: Character-specific skyboxes and particle effects
- **Interactive effects**: Cursor gravity fields, dimensional rifts
- **Text scrambling**: Katakana + code symbol animations
- **Glassmorphic UI**: Modern, transparent design with backdrop filters
- **Responsive design**: Optimized for desktop and mobile

---

## Technical Architecture

### Frontend Stack

- **React 19**: Modern component-based UI
- **Three.js 0.180**: 3D rendering and geometry
- **React Three Fiber**: React renderer for Three.js
- **Vite**: Fast build tool and dev server
- **SCSS Modules**: Component-scoped styling

### Backend Stack

- **Node.js 20+**: JavaScript runtime
- **Express.js**: RESTful API framework
- **MongoDB 5.0**: NoSQL database for scenes and users
- **Mongoose**: MongoDB object modeling
- **JWT**: Secure authentication tokens
- **bcrypt**: Password hashing

### Key Systems

**1. Custom Hooks Architecture (21 hooks)**

- Scene management hooks (initialization, lighting, camera, effects)
- Material update hooks (color, metalness, wireframe, hyperframe)
- Animation hooks (rotation, vertex deformation, omni-intellect)
- Audio hooks (analyzer, reactive animations)
- Interaction hooks (mouse controls, object selection)

**2. Factory Pattern for Geometry**

- `objectFactory.js`: Orchestrates complete object creation
- `materialCache.js`: Pools materials for performance
- Specialized wireframe builders for each geometry type
- Hyperframe assemblers for 4D visualizations

**3. Audio Reactive System**

- `useAudioAnalyzer`: Web Audio API + FFT analysis
- `useAudioReactive`: Maps frequency data to geometry transformations
- Momentum-based physics for natural movement
- Independent color cycling for mesh and hyperframe

**4. Authentication Flow**

- JWT tokens stored in localStorage
- Protected routes require authentication
- Secure password hashing with bcrypt
- CORS configuration for cross-origin requests

**5. State Management**

- Context API for scene state sharing
- 21 synchronized state variables for 3D controls
- Refs for performance-critical values (avoiding re-renders)
- Optimistic UI updates with backend sync

---

## Feature Highlights

### 🎨 Visual Features

- **24 hyperdimensional geometries** with custom wireframes and hyperframes
- **Dynamic color palettes** with smooth lerp transitions
- **Audio reactive colors** changing every 3 rotations independently
- **6 animation algorithms** including complex choreography
- **Quantum environments** with interactive backgrounds
- **Glassmorphic UI** with modern design language

### 🎮 Interactive Features

- **Real-time 3D manipulation** with 21 synchronized controls
- **Microphone-driven animations** with FFT analysis
- **Progressive character unlocks** tied to scene creation
- **Speed controls** for animation playback
- **Hover previews** for geometry selection
- **Text scrambling effects** on UI elements

### 💾 Platform Features

- **Full-stack CRUD** for scene management
- **JWT authentication** with secure routes
- **MongoDB persistence** for users and scenes
- **Unsaved changes detection** with navigation blocking
- **RESTful API** with proper error handling
- **Responsive design** for desktop and mobile

### 🔊 Audio Features

- **Real-time FFT analysis** (Fast Fourier Transform)
- **Adaptive noise filtering** (55% bass, 50% mids thresholds)
- **Frequency mapping** to geometric transformations
- **Color cycling** based on rotation count
- **Smooth color transitions** using lerp blending
- **Momentum physics** with natural deceleration

---

## Project Statistics

**Code Architecture:**

- **2,700 → 199 lines**: 93% reduction through custom hooks refactoring
- **21 synchronized state variables** for real-time 3D control
- **21 custom hooks** organizing scene logic
- **60fps rendering** with optimized Three.js loop

**Content:**

- **24 unique geometries** with custom implementations
- **3 animated characters** with multiple animation sets
- **6 animation algorithms** including complex choreography
- **8+ color palettes** for mesh and hyperframe

**Testing:**

- Jest unit tests for critical functions
- Integration tests for scene management
- Error boundary components for crash resilience

---

## User Journey

### First-Time Visitor

1. **Landing Page**: Quantum background with character portals
2. **Sign Up**: Create account with username/password
3. **Geometry Lab**: Explore 24 shapes with real-time controls
4. **Save Scene**: Create first scene to unlock Icarus-X character
5. **Character Showcase**: View unlocked character with animations

### Returning User

1. **Login**: JWT authentication restores session
2. **My Scenes**: Browse personal gallery of saved configurations
3. **Load Scene**: Click to restore previous creation
4. **Modify**: Adjust colors, lighting, animation
5. **Transmute**: Update existing scene with changes
6. **Progression**: Save more scenes to unlock additional characters/animations

### Advanced User

1. **Audio Reactive Mode**: Enable microphone for music visualization
2. **Custom Palettes**: Experiment with color combinations
3. **Complex Geometries**: Explore 4D polytopes (600-cell, mega-tesseract)
4. **Animation Mastery**: Combine vertex deformation with audio reactivity
5. **Scene Collection**: Curate gallery of unique configurations

---

## Development Approach

### Design-First Methodology

1. **ERD Diagram**: Planned database schema before coding
2. **Wireframes**: Designed user flows and interactions
3. **Aesthetic Vision**: Quantum theme with glassmorphic UI
4. **Progressive System**: Mapped unlock thresholds to scene counts

### Collaboration with AI

- **Human**: Spatial design, aesthetic direction, user experience
- **AI**: Mathematical implementation, Three.js optimization, hook architecture
- **Result**: Blend of artistic vision and technical precision

### Iterative Refinement

- Started with monolithic component (2,700 lines)
- Refactored into modular hooks (21 specialized hooks)
- Optimized audio system with threshold tuning
- Added smooth color transitions based on user feedback

---

## Future Roadmap

### Audio System Enhancements

- Beat detection for rhythm-synced animations
- High frequency mapping to material shimmer
- User-customizable audio sensitivity sliders
- Visual frequency spectrum display

### Visual Enhancements

- Vertex deformation based on audio waveform
- Geometry morphing between shapes
- Particle trails and burst effects
- Dynamic lighting tied to audio

### Platform Features

- Social sharing of scenes
- Community gallery of user creations
- Scene remix/forking system
- Export scenes as videos or images

### Character System

- Additional characters with unique themes
- User-uploaded character models
- Custom animation creation tools
- Character interaction modes

---

## Why This Project Matters

**Educational Value:**

- Makes 4D geometry concepts accessible through 3D visualization
- Demonstrates hyperdimensional thinking in interactive format
- Teaches mathematical concepts through play and exploration

**Technical Achievement:**

- Shows modern React patterns (hooks, context, refs)
- Demonstrates Three.js optimization techniques
- Proves full-stack integration (MERN stack)
- Exhibits audio-visual synchronization

**Creative Expression:**

- Platform for artistic exploration of geometry
- Tools for creating unique visual experiences
- Community for sharing mathematical art
- Bridge between math and aesthetics

**Personal Growth:**

- From artist to full-stack developer
- Collaboration between human creativity and AI capabilities
- Continuous learning through feature iteration
- Building a complete product from concept to deployment

---

## Tech Stack Summary

**Frontend:**

- React 19, Three.js 0.180, React Three Fiber
- Vite, SCSS Modules, Context API

**Backend:**

- Node.js 20+, Express.js, MongoDB 5.0
- Mongoose, JWT, bcrypt

**Development:**

- Git, GitHub, Vercel (deployment)
- Jest (testing), ESLint (linting)

**Audio:**

- Web Audio API, AnalyserNode, FFT
- Custom frequency mapping system

**3D Pipeline:**

- Meshy AI → Mixamo → Blender → React Three Fiber
- Custom geometry factories and builders

---

## Getting Started

Visit the [live demo](https://nexus-geom-3d.vercel.app) or clone the repository:

```bash
git clone https://github.com/pablocordero/nexus-geom-3D.git
cd nexus-geom-3D
npm install
npm run dev
```

See the [main README](../../README.md) for detailed setup instructions.

---

## Documentation Structure

- **`/docs/overview/`** - Project overview and vision (you are here)
- **`/docs/audio-features/`** - Audio reactive system documentation
- **`/docs/hooks-customHooks/`** - Custom hooks architecture
- **`/docs/sceneControls/`** - Scene control system
- **`/docs/reference/`** - Technical references (geometry, rendering, workflows)
- **`/docs/ARCHITECTURE_DIAGRAM.md`** - System architecture
- **`/docs/TESTING_GUIDE.md`** - Testing documentation

---

## Contact & Links

- **Live Demo**: [https://nexus-geom-3d.vercel.app](https://nexus-geom-3d.vercel.app)
- **GitHub**: [https://github.com/Cordero080/nexus-geom-lab](https://github.com/Cordero080/nexus-geom-lab)
- **Developer**: Pablo Cordero

---

_Last Updated: November 11, 2025_
