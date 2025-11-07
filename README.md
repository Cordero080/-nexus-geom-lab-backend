# Nexus-Geom 3D 🌌

> Interactive 3D geometry platform with 24 hyperdimensional shapes, progressive character unlocks, and full-stack scene management

<div align="center">

![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.180-000000?style=for-the-badge&logo=three.js)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0-47A248?style=for-the-badge&logo=mongodb)

[🚀 Live Demo](https://nexus-geom-3d.vercel.app) • [📖 Full Documentation](./docs) • [� API Docs](./docs/TECHNICAL_SPECIFICATION.md)

</div>

## 📸 Screenshots

<div align="center">

### Landing Page (Homepage)

![Homepage](./screenshots/homepage.png)
_Landing page with quantum background and navigation_

### Homepage (Logged In)

![Homepage Logged In](./screenshots/homepage-logged-in.png)
_Landing page showing authenticated user state with username and My Scenes link_

### Sign Up Page

![Sign Up](./screenshots/signup.png)
_User registration with holographic design_

### Login Page

![Login](./screenshots/login.png)
_Authentication interface with quantum styling_

### Main Geometry Lab Interface

![Main Interface - Quantum Manifold](./screenshots/main-interface-quantum-manifold.png)
_Quantum manifold with custom hyperframe colors in matrix environment_

![Main Interface - Mega Tesseract III](./screenshots/main-interface-mega-tesseract.png)
_Compound mega-tesseract III showing 4D hyperdimensional structure_

### Character Showcase Gallery

![Character Showcase](./screenshots/character-showcase.png)
_Progressive unlock system with animated 3D characters_

### Character Viewer - Animated Detail

![Character Close-up](./screenshots/character-closeup.png)
_Vectra character with holographic spellcast animation and controls_

### Scene Management Dashboard

![Scene Management](./screenshots/scene-management.png)
_Personal scene gallery with save/load functionality_

### Unlock Progression System

![Unlock System](./screenshots/unlock-modal.png)
_Gamified character and animation unlocks with sound effects_

</div>

---

## 🎨 Design & Planning

### Database Schema (ERD)

![ERD Diagram](./screenshots/erd-diagram.png)
_MongoDB schema showing User, Scene, and unlock relationships_

### Application Wireframes

![Wireframe](./screenshots/wireframe.png)
_UI/UX design and user flow planning_

**Design Process:**

- Planned data relationships before coding (ERD)
- Designed user flows and interactions (wireframes)
- Focused on quantum aesthetic with glassmorphic UI
- Progressive unlock system mapped to scene count thresholds

---

## Overview

A full-stack MERN application that transforms abstract 4D geometry into an interactive 3D platform with progressive character unlocks and gamified scene creation.

**The Vision**: Coming from art and motion graphics, I wanted to visualize how compound polytopes (4D shapes) work in 3D space. I designed the spatial relationships and aesthetic direction, then collaborated with AI tools to handle the mathematical implementation.

**What Makes It Different**:

- **Gamification Through Creation**: Saving scenes unlocks animated characters progressively—turning geometric exploration into a reward-based progression system
- **24 Hyperdimensional Shapes**: From basic geometry to compound tesseracts and 4D polytopes (120-cell, 600-cell), with custom wireframe and hyperframe structures
- **Cohesive Quantum Aesthetic**: Glassmorphic UI, interactive backgrounds, and theatrical character presentation
- **Full-Stack Platform**: JWT authentication, MongoDB persistence, RESTful API, and progressive unlock system

**Tech Stack**: React 19 • Three.js 0.180 • Express.js • MongoDB • Node.js 20+

---

## 🎯 Core Features

### 🔧 Interactive Geometry Lab

- **24 Advanced Geometries**: From classical shapes to 4D polytopes and quantum manifolds
- **Real-time Controls**: Material properties (metalness, emissive intensity, wireframe blend)
- **6 Animation Algorithms**: Rotate, Float, Omni-Intellect (5-phase choreography)
- **Dynamic Lighting**: Ambient + directional lights with full 3D positioning
- **Environment System**: Quantum-themed backgrounds with 360° hue shifting

### 🎭 Character Showcase

- **3 Animated Characters**: Icarus-X (Seraph), Vectra (Spellcaster), Nexus-Prime (Warrior)
- **Progressive Unlocks**: Characters unlock as users save scenes (gamification)
- **Multi-Animation System**: Animation switcher appears when multiple animations unlocked
- **FBX Pipeline**: Meshy → Mixamo → Blender → React Three Fiber

### 💾 Scene Management

- **Complete CRUD**: Create, Read, Update, Delete with MongoDB persistence
- **Contextual Save States**: "Save Scene" / "Transmute" / "Save As New" based on context
- **Unsaved Changes Detection**: Navigation blocking prevents accidental data loss
- **Scene Gallery**: User's personal collection with sort/filter options

### 🔐 Authentication & Security

- **JWT-based Security**: bcrypt password hashing, token-based auth
- **Protected Routes**: Scene management requires authentication
- **Session Persistence**: Users stay logged in across browser sessions
- **CORS Configuration**: Secure cross-origin requests
- **Rate Limiting**: API endpoint protection

### 🎨 Interactive UI Features

- **Text Scrambling Effects**: Katakana + code symbol animations on buttons/titles
- **Hover Controls**: Mouse-over geometry selection with real-time preview
- **Ripple Effects**: Material Design click feedback with color variants
- **Quantum Backgrounds**: Interactive color-changing environments
- **Glassmorphic Design**: Modern UI with backdrop filters and transparency
- **Responsive Layout**: Mobile-optimized interface with touch controls

### 🔊 Audio System

- **Unlock Sound Effects**: Audio feedback for character and animation unlocks
- **Sound Validation**: Robust audio system with fallback handling
- **Interactive Feedback**: Audio cues for user actions and achievements

---

## 📊 Key Technical Stats

- **2,700 → 199 lines**: 93% code reduction through custom hooks refactoring
- **21 synchronized state variables**: Real-time 3D manipulation with React state
- **Custom physics**: Transform-based + vertex-deformation animation systems
- **Factory patterns**: Modular wireframe builders for 24 geometry types
- **60fps rendering**: Optimized Three.js animation loop with complex objects

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/pablocordero/nexus-geom-3D.git
cd nexus-geom-3D

# Frontend setup
npm install
npm run dev

# Backend setup (separate terminal)
cd backend
npm install
cp .env.example .env  # Add your MongoDB URI and JWT secret
npm run dev

# Open http://localhost:5173
```

### Environment Variables

**Frontend `.env`:**

```env
VITE_API_URL=http://localhost:3000/api
```

**Backend `.env`:**

```env
MONGODB_URI=mongodb://localhost:27017/nexus-geom
JWT_SECRET=your-super-secret-key
CLIENT_URL=http://localhost:5173
PORT=3000
```

---

## 📁 Project Structure

```
nexus-geom-3D/
├── 📁 public/
│   ├── 📁 fonts/                    # Custom typography
│   ├── 📁 models/                   # 3D FBX character files
│   └── 📁 soundEffects/
│       └── unlock.wav               # Audio feedback system
├── 📁 src/
│   ├── App.jsx                      # Main application component
│   ├── main.jsx                     # React 19.1 entry point
│   ├── 📁 components/
│   │   ├── 📁 features/             # Business logic components
│   │   │   └── 📁 SaveButton/       # Scene management with unlock modals
│   │   ├── 📁 layout/               # App structure components
│   │   ├── 📁 pages/                # Route-level components
│   │   ├── 📁 shared/               # Reusable components
│   │   └── 📁 ui/
│   │       └── 📁 ScrambleButton/   # Interactive text animation system
│   ├── 📁 context/
│   │   ├── AuthContext.jsx          # JWT authentication state
│   │   └── SceneContext.jsx         # 3D scene state management
│   ├── 📁 features/
│   │   └── 📁 sceneControls/
│   │       ├── ThreeScene.jsx       # Main 3D rendering component
│   │       ├── lightingSetup.js     # Three.js lighting system
│   │       ├── sceneSetup.js        # Scene initialization
│   │       └── 📁 hooks/            # Custom React hooks
│   │           ├── useSceneInitialization.js
│   │           ├── useLightingUpdates.js
│   │           ├── useObjectManager.js
│   │           └── useMaterialUpdates.js
│   ├── 📁 hooks/
│   │   └── useQuantumNavState.js    # Navigation state management
│   ├── 📁 services/
│   │   └── sceneApi.jsx             # API integration layer
│   ├── 📁 styles/
│   │   ├── shared.module.scss       # Global SCSS modules
│   │   ├── quantumBackground.css    # Interactive backgrounds
│   │   └── quantumTitles.css        # Text scrambling styles
│   └── 📁 utils/
│       ├── textScrambler.js         # Code symbol animations
│       ├── textScrambler.jsx        # Katakana character effects
│       ├── geometryHelpers.js       # 3D geometry utilities
│       └── threeConstants.js        # Three.js configuration
├── 📁 backend/                      # Express.js REST API
│   ├── index.js                     # Server entry point
│   ├── 📁 models/
│   │   ├── User.js                  # MongoDB user schema
│   │   └── Scene.js                 # Scene persistence schema
│   ├── 📁 routes/
│   │   ├── auth.js                  # Authentication endpoints
│   │   └── scenes.js                # Scene CRUD operations
│   ├── 📁 middleware/
│   │   └── auth.js                  # JWT verification
│   └── resetDevUser.js              # Development utility
├── 📁 docs/                         # Comprehensive documentation
│   ├── TECHNICAL_SPECIFICATION.md   # Full technical docs
│   ├── ARCHITECTURE_DIAGRAM.md      # System architecture
│   └── 📁 study-plan/              # Learning materials
└── package.json                     # React 19.1 + Three.js 0.180
```

---

## 🏗️ Architecture Highlights

### Custom Hooks System

Refactored monolithic 2,700-line component into modular architecture:

- `useSceneInitialization` - Scene, camera, renderer setup
- `useObjectManager` - Geometry creation and updates
- `useMaterialUpdates` - Real-time material property changes
- `useLightingUpdates` - Dynamic lighting control
- `useAnimationLoop` - 60fps animation orchestration

### Advanced Wireframe System

Multi-component 3D objects with synchronized movement:

- **Solid Mesh**: Primary geometry with PBR materials
- **Thick Wireframes**: Cylinder-based edges (not thin lines)
- **Inner Structures**: Geometry-specific patterns (spirals, hyperframes)
- **Connecting Rods**: Dynamic links between inner/outer structures

### Progressive Unlock Logic

```javascript
Scene 1 → Unlock Icarus-X (Solar Ascension)
Scene 2 → Unlock Vectra (Holographic Spellcast)
Scene 3 → Unlock Nexus-Prime (Warrior Flip)
Scene 4+ → Unlock additional animations
         → Animation switcher appears!
```

---

## 🎮 User Experience Flow

1. **Sign Up** → Create account with JWT authentication
2. **Geometry Lab** → Manipulate 24 advanced geometries with real-time controls
3. **Save Scene** → Persist 20+ control values to MongoDB
4. **Unlock Character** → First save unlocks Icarus-X in showcase
5. **Progressive Unlocks** → More scenes = more characters + animations
6. **Animation Switcher** → Toggle between multiple animations per character
7. **Scene Management** → Load/edit/delete from personal gallery

---

## 🔧 Technology Stack

**Frontend:**

- React 19.1 with custom hooks architecture
- React Three Fiber for declarative Three.js components
- Three.js 0.180 for 3D rendering and WebGL
- Vite 7.1 for development and build optimization
- Context API for global state management
- SCSS Modules with glassmorphic design system
- React Router for client-side navigation
- Custom audio integration with Web Audio API

**Backend:**

- Express.js 5.x REST API with middleware pipeline
- MongoDB 5.0 with Mongoose ODM and validation
- JWT authentication with bcrypt password hashing
- CORS configuration for cross-origin requests
- Rate limiting and security headers (Helmet)
- Progressive unlock system with scene counting logic
- Express Validator for request validation

**Development Tools:**

- Jest for unit testing with React Testing Library
- ESLint and Prettier for code quality
- Git hooks for automated testing
- Development user reset utilities
- Hot module replacement with Vite

**Deployment:**

- Frontend: Vercel with environment variables
- Backend: Railway/Render with MongoDB Atlas
- Database: MongoDB Atlas with connection pooling
- CDN: Asset optimization and caching

---

## 📚 Documentation

### Complete Guides

- **[Full Documentation](./docs/FULL_DOCUMENTATION.md)** - Everything you need to know (15,000+ words)
- **[Architecture Diagram](./docs/ARCHITECTURE_DIAGRAM.md)** - Visual system architecture
- **[API Reference](./docs/FULL_DOCUMENTATION.md#api-reference)** - Complete endpoint documentation
- **[Study Plan](./docs/study-plan/STUDY_PLAN.md)** - Learn the codebase step-by-step
- **[Custom Hooks Guide](./docs/hooks-customHooks/CUSTOM_HOOKS_GUIDE.md)** - React hooks documentation

### Quick Links

- **Installation**: See [Quick Start](#-quick-start) above
- **Usage Guide**: See [Full Documentation](./docs/FULL_DOCUMENTATION.md#usage-guide)
- **Troubleshooting**: See [Full Documentation](./docs/FULL_DOCUMENTATION.md#troubleshooting)
- **Contributing**: See [Full Documentation](./docs/FULL_DOCUMENTATION.md#contributing)

---

## 🎯 For Developers

### What This Project Demonstrates

**Advanced React Patterns**

- Custom hooks for 3D scene management
- Context API for authentication and scene state
- Complex state management (20+ synchronized variables)
- Factory patterns for object creation

**3D Graphics Programming**

- Three.js mastery with vertex manipulation
- Multi-component synchronized animations
- Custom wireframe rendering system
- Real-time material property updates

**Full-Stack Architecture**

- Express.js REST API
- MongoDB with Mongoose schemas
- JWT authentication flow
- Progressive unlock system logic

**Code Organization**

- 93% code reduction through refactoring
- Modular architecture with separation of concerns
- Factory pattern for geometry builders
- Clean boundaries between UI, 3D logic, and data

### Key Achievements

- **60fps 3D rendering** with complex multi-component objects
- **Transform-based + vertex-deformation** animation systems
- **Contextual UI** that adapts based on scene state
- **Navigation blocking** to prevent data loss
- **Progressive disclosure** through gamified unlocks
- **Real-time material updates** without scene reconstruction
- **Modular geometry factory** supporting 24 different shapes
- **Advanced lighting system** with ambient/directional controls
- **Sound effect integration** with unlock progression feedback
- **Responsive design** optimized for desktop and mobile

---

## 🚀 Deployment

**Frontend (Vercel):**

```bash
vercel
vercel env add VITE_API_URL production
```

**Backend (Railway):**

```bash
# Set environment variables:
MONGODB_URI=<mongodb-atlas-uri>
JWT_SECRET=<secure-random-string>
CLIENT_URL=<frontend-url>
NODE_ENV=production
```

---

## 🤝 Contributing

We welcome contributions! See [Contributing Guide](./docs/FULL_DOCUMENTATION.md#contributing) for:

- Development workflow
- Code style guidelines
- Commit message conventions
- Pull request process

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

Free to use, modify, and distribute. Attribution appreciated but not required.

---

## 📬 Contact

- 📧 Email: Cordero080@gmail.com
- 🐙 GitHub: [@pablocordero](https://github.com/pablocordero)
- 🐛 Issues: [Report bugs](https://github.com/pablocordero/nexus-geom-3D/issues)

---

<div align="center">

### Built with 🔥 and 🌊 by Pablo Cordero

**Tech Stack**: React • Three.js • Express.js • MongoDB • 4D Mathematics

**Features**: 3D Rendering • Real-time Controls • JWT Auth • Progressive Unlocks

**Architecture**: Custom Hooks • Factory Pattern • REST API • Modular Design

---

_"The universe is written in the language of mathematics, and its alphabet is circles, triangles, and other geometrical figures."_ - Galileo

---

⭐ **Star this repo** if you find it interesting! • 🍴 **Fork it** to experiment with your own ideas

Made in 2025 | Last Updated: November 3, 2025

</div>
