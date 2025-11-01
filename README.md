# Nexus-Geom 3D 🌌

## Interactive 3D Geometry Platform with Character Animation Showcase

<div align="center">

![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-Latest-000000?style=for-the-badge&logo=three.js)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb)

**A Multi-Dimensional 3D Art Platform** combining interactive geometry manipulation, character animation showcases, and progressive unlock systems.

[🚀 Live Demo](https://nexus-geom-3d.vercel.app) | [📖 Documentation](./docs) | [🎮 Animation System](#animation-unlock-system)

</div>

---

## ✨ What Makes This Special

This isn't just another 3D viewer - it's a **complete interactive art platform** that demonstrates advanced web development skills through immersive 3D experiences. The project showcases the intersection of **geometric mathematics**, **character animation**, and **gamified progression systems**.

### 🎯 Core Experiences

**1. Interactive Geometry Lab**

- Real-time manipulation of complex 3D shapes with synchronized wireframe structures
- 6 animation algorithms: Rotate, Float, Spiral, Chaos, Alien Oscillation, Magnetic Fields
- Advanced lighting systems with environment-responsive controls
- Material properties with metalness, emissive intensity, and hyperframe coloring

**2. Character Animation Showcase**

- Curated gallery of animated 3D characters in rotating transparent energy cubes
- Custom lighting per animation with character-specific gradient backgrounds
- Full FBX model pipeline integration with Mixamo animations
- **NEW**: Multi-animation system per character with unlock progression

**3. Progressive Unlock System**

- Scene-based progression that unlocks Noetechs first, then additional animations
- **Scene 1**: Unlocks Icarus-X Noetech (with "Solar Ascension" default animation)
- **Scene 2**: Unlocks Vectra Noetech (with "Holographic Spellcast" default animation)
- **Scene 3**: Unlocks Nexus-Prime Noetech (with "Warrior Flip" default animation)
- **Scene 4+**: Unlocks additional animations for existing Noetechs (animation switcher appears!)

### 🌟 Latest Update: Animation Unlock System

**Progressive Unlock Flow**: The system unlocks Noetechs first (characters), then adds additional animations to those characters:

**Unlock Progression:**

1. **Scene 1** → Unlocks **Icarus-X** Noetech (with "Solar Ascension" default)
2. **Scene 2** → Unlocks **Vectra** Noetech (with "Holographic Spellcast" default)
3. **Scene 3** → Unlocks **Nexus-Prime** Noetech (with "Warrior Flip" default)
4. **Scene 4** → Unlocks **"Phoenix Dive"** animation for Icarus-X → **Switcher appears!**

**Key Features:**

- **Gallery View**: Shows only unlocked Noetechs with their default animations
- **Animation Switcher**: Appears in full viewer when multiple animations unlocked for same character
- **Custom Notifications**: Cyberpunk-themed unlock modals distinguish between Noetechs and animations
- **Persistent Progress**: All unlocks saved to user profile and synchronized across sessions

---

## 🎨 Visual Showcase

### Interactive Geometry Lab

```
Mathematical Definitions → Three.js Geometries → Vertex Manipulation →
Wireframe Synchronization → Animation Loops → User Controls
```

- **Complex Multi-Component Objects**: Each shape consists of solid mesh + thick wireframe cylinders + inner structures + connecting rods
- **Synchronized Deformation**: All components move in perfect unison during animations
- **Real-time Material Updates**: Metalness, emissive intensity, hyperframe coloring with live preview

### Character Animation Gallery

```
Meshy.ai (Model Generation) → Mixamo (50+ Animations) →
Blender (Texturing/Optimization) → FBXLoader →
React Three Fiber → Interactive Showcase
```

- **Ethereal Presentation**: Characters suspended in rotating transparent cubes with interior lighting
- **Multi-Animation Support**: Characters can have multiple unlockable animations with smooth switcher interface
- **Custom Backgrounds**: Character-specific gradient themes (blue tech, cyan glow, fire orange, emerald crystal)

---

## 🚀 Technical Architecture

### Frontend Stack

- **React 18** with hooks and context for state management
- **Three.js & React Three Fiber** for 3D rendering and interactions
- **Vite** for lightning-fast development and optimized builds
- **SCSS Modules** with CSS-in-JS for component-scoped styling
- **Custom Hooks** for complex 3D logic separation

### Backend Stack

- **Express.js** RESTful API with comprehensive validation
- **MongoDB** with Mongoose ODM for flexible document storage
- **JWT Authentication** with bcrypt password hashing
- **User & Scene Models** with animation unlock progression tracking

### Animation System Architecture

```javascript
// New unlock progression system - Noetechs first, then additional animations
const UNLOCK_PROGRESSION = [
  { sceneNumber: 1, type: "noetech", noetechKey: "icarus-x" }, // Unlocks Icarus-X character
  { sceneNumber: 2, type: "noetech", noetechKey: "vectra" }, // Unlocks Vectra character
  { sceneNumber: 3, type: "noetech", noetechKey: "nexus" }, // Unlocks Nexus-Prime character
  {
    sceneNumber: 4,
    type: "animation",
    noetechKey: "icarus-x",
    animationId: "phoenix-dive",
  }, // Adds animation to Icarus-X
];
```

---

## 🎮 Core Features

### 🔧 Advanced 3D Geometry Editor

- **6 Geometric Primitives**: Sphere, Cube, Octahedron, Tetrahedron, Icosahedron, Torus
- **Complex Animation Systems**:
  - Transform-based (Rotate, Float, Spiral, Alien)
  - Vertex-deformation (Magnetic Fields)
- **Synchronized Wireframes**: Thick cylinder-based wireframes that follow mesh deformations
- **Hyperframe Structures**: Inner geometric patterns with connecting rods
- **Real-time Material Controls**: PBR materials with metalness and emissive properties

### 🎭 Character Animation Showcase

- **Multi-Character Gallery**: Icarus-X, Vectra, Nexus-Prime with unique visual themes
- **Animation Progression**: Unlock system that adds animations to existing characters
- **Interactive Viewer**: Full-screen experience with orbital camera controls
- **Dynamic Lighting**: Character-specific spectral lighting (cyan, magenta, blue directional)

### 🔐 Authentication & Progression

- **JWT-based Authentication** with secure user sessions
- **Scene Saving System**: Full configuration persistence and loading
- **Animation Unlock Tracking**: Progress saved per user with unlock notifications
- **User Profile Management**: Scene collection and animation progress

### 🎨 Quantum Portal Worlds Theme System

- **5 Dimensional Realities**: Each with unique color palettes and energy signatures
- **Real-time Transitions**: Interface colors shift based on user interaction
- **Quantum Mechanics Simulation**: UI exists in superposition until "observed" (clicked/scrolled)
- **Mathematical Greek Symbols**: ψ, Ω, Σ, λ, Φ, Ξ that change with each quantum collapse

---

## 🛠️ Advanced Technical Implementation

### Synchronized Multi-Component 3D Objects

```javascript
// Each geometry consists of multiple synchronized components
const sceneObject = {
  solidMesh: mainGeometry, // Primary visible shape
  wireframeMesh: cylinderWireframe, // Thick wireframe edges
  centerLines: innerStructures, // Spiral patterns, inner shapes
  curvedLines: connectingRods, // Green connection rods
};

// All components move in unison during animations
animationStyles.alien(objects, time); // Omni-directional oscillation
```

### FBX Animation Pipeline with Root Motion Handling

```javascript
// Strip position tracks to prevent animation drift
const clip = fbx.animations[0].clone();
clip.tracks = clip.tracks.filter((track) => !track.name.includes(".position"));
const action = mixer.clipAction(clip);
action.play();
```

### Progressive Animation Unlock System

```javascript
// Backend unlock checking with scene progression
const checkAndUnlockAnimations = (user, sceneNumber) => {
  const unlockConfig = UNLOCK_PROGRESSION.find(
    (u) => u.sceneNumber === sceneNumber
  );
  if (unlockConfig && !user.hasUnlockedAnimation(unlockConfig.animationId)) {
    user.unlockedAnimations.push({
      animationId: unlockConfig.animationId,
      noetechKey: unlockConfig.noetechKey,
      unlockedAt: new Date(),
    });
    return [unlockConfig];
  }
  return [];
};
```

### Real-time Material System

```javascript
// Modern PBR material properties
materialConfig = {
  metalness: 0.8, // 0 = dielectric, 1 = metallic
  emissiveIntensity: 1.2, // Glow effect intensity
  wireframeIntensity: 75, // Wireframe opacity blend
  hyperframeColor: "#00ffff", // Inner structure color
  environmentHue: 180, // Universal hue shift 0-360°
};
```

---

## 🎯 User Experience Flow

1. **Enter Geometry Lab** → Interactive 3D shape manipulation
2. **Save First Scene** → Unlocks Icarus-X Noetech with "Solar Ascension" animation
3. **Visit Showcase** → Browse unlocked character in gallery
4. **Save Second Scene** → Unlocks Vectra Noetech with "Holographic Spellcast" animation
5. **Save Third Scene** → Unlocks Nexus-Prime Noetech with "Warrior Flip" animation
6. **Save Fourth Scene** → Unlocks "Phoenix Dive" animation for Icarus-X → **Switcher appears!**
7. **Toggle Animations** → Switch between "Solar Ascension" and "Phoenix Dive" in full viewer
8. **Continue Progress** → Unlock more animations as you save additional scenes

---

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+
- MongoDB 5.0+
- Git

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/nexus-geom-3D.git
cd nexus-geom-3D

# Install dependencies
npm install

# Start development server
npm run dev

# Application runs on http://localhost:5173
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/nexus-geom
JWT_SECRET=your-super-secret-key
PORT=3000

# Start backend server
npm run dev

# API runs on http://localhost:3000
```

### Environment Variables

```env
# Frontend (.env)
VITE_API_URL=http://localhost:3000/api

# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/nexus-geom
JWT_SECRET=your-jwt-secret-key-here
CLIENT_URL=http://localhost:5173
PORT=3000
```

---

## 🏗️ Project Structure

```
nexus-geom-3D/
├── backend/                          # Express.js API server
│   ├── config/db.js                 # MongoDB connection
│   ├── models/                       # Mongoose schemas
│   │   ├── User.js                  # User authentication & animation progress
│   │   └── Scene.js                 # Scene configuration storage
│   ├── routes/                       # API endpoints
│   │   ├── auth.js                  # Authentication routes
│   │   └── scenes.js                # Scene CRUD + unlock logic
│   ├── middleware/auth.js            # JWT authentication middleware
│   └── index.js                     # Server entry point
│
├── src/                             # React frontend
│   ├── components/                  # Reusable UI components
│   │   ├── Controls/               # 3D scene control panels
│   │   ├── Effects/                # Particle systems & visual effects
│   │   ├── HUD/                    # Heads-up display elements
│   │   ├── Modals/                 # Modal dialogs & overlays
│   │   └── Scenes/                 # 3D scene rendering components
│   │
│   ├── context/                     # React Context providers
│   │   ├── AuthContext.jsx         # Authentication state management
│   │   └── SceneContext.jsx        # Scene configuration state
│   │
│   ├── features/                    # Complex feature modules
│   │   └── sceneControls/          # 3D geometry manipulation
│   │       ├── factories/          # Object creation factories
│   │       ├── hooks/              # Custom React hooks
│   │       └── utils/              # Animation & geometry utilities
│   │
│   ├── Showcase/                    # Character animation system
│   │   ├── components/             # Gallery & viewer components
│   │   ├── data/mockAnimations.js  # Animation configuration
│   │   └── models/FBXModel.jsx     # FBX model loader & animator
│   │
│   ├── services/                    # API integration
│   │   └── sceneApi.js             # Scene CRUD operations
│   │
│   └── styles/                      # Global styling & themes
│       └── shared.module.scss      # Shared UI components
│
├── public/                          # Static assets
│   ├── models/                     # FBX animation files
│   └── fonts/                      # Custom typography
│
└── docs/                           # Comprehensive documentation
    ├── technical/                  # Technical specifications
    ├── reference/                  # API reference guides
    └── study-plan/                 # Development roadmap
```

---

## 🔌 API Reference

### Authentication Endpoints

```http
POST   /api/auth/signup              # Create new user account
POST   /api/auth/login               # Authenticate user & return JWT
GET    /api/auth/me                  # Get current user profile
```

### Scene Management

```http
POST   /api/scenes                   # Save new scene (triggers unlock check)
GET    /api/scenes/my-scenes         # Get user's saved scenes
GET    /api/scenes/:id               # Load specific scene configuration
PUT    /api/scenes/:id               # Update existing scene
DELETE /api/scenes/:id               # Delete scene (owner only)
```

### Scene Configuration Format

```json
{
  "name": "Cosmic Icosahedron",
  "description": "A mystical geometric form",
  "config": {
    "objectType": "icosahedron",
    "animationStyle": "alien",
    "scale": 1.5,
    "metalness": 0.8,
    "emissiveIntensity": 1.2,
    "baseColor": "#ff00ff",
    "wireframeIntensity": 75,
    "hyperframeColor": "#00ffff",
    "hyperframeLineColor": "#ff00ff",
    "environment": "nebula",
    "environmentHue": 180,
    "ambientLightIntensity": 0.5,
    "directionalLightIntensity": 1.0,
    "directionalLightX": 10,
    "directionalLightY": 10,
    "directionalLightZ": 5,
    "cameraView": "free"
  }
}
```

---

## 🎨 Animation System Deep Dive

### Character Unlock Progression

| Scene # | Unlock Type | Character   | Animation/Note                      |
| ------- | ----------- | ----------- | ----------------------------------- |
| 1       | Noetech     | Icarus-X    | Unlocks character + Solar Ascension |
| 2       | Noetech     | Vectra      | Unlocks character + Holographic     |
| 3       | Noetech     | Nexus-Prime | Unlocks character + Warrior Flip    |
| 4       | Animation   | Icarus-X    | **Phoenix Dive** (switcher appears) |

### Animation Data Structure

```javascript
{
  id: 4,
  noetechKey: "icarus-x",
  animationId: "phoenix-dive",
  name: "Icᐱrus-X #001",
  animation: "Phoenix Dive",
  variant: "Crimson Descent",
  description: "The Seraph's devastating descent from celestial heights...",
  fbxUrl: "/models/icarus-bangs.fbx",
  isDefaultAnimation: false,  // Hidden until unlocked
  background: "linear-gradient(180deg, rgba(20,0,0,0.95) 0%, rgba(255,69,0,0.8) 20%...)"
}
```

### Gallery vs Viewer Logic

- **Gallery**: Shows only `isDefaultAnimation: true` animations
- **Viewer**: Shows animation switcher when multiple animations unlocked for same character
- **Switcher**: Dynamically filters `getUnlockedAnimationsForNoetech(noetechKey)`

---

## 🎯 Geometry Animation Algorithms

### Transform-Based Animations

```javascript
// Alien (Omni-directional Oscillation)
rotate: [
  Math.sin(time * 0.5) * 0.3,
  Math.cos(time * 0.7) * 0.2,
  Math.sin(time * 0.9) * 0.4
],
position: [
  Math.sin(time * 0.6) * 2,
  Math.cos(time * 0.8) * 1.5,
  Math.sin(time * 1.1) * 2.5
]
```

### Vertex-Deformation Animations

```javascript
// Magnetic Fields - Vertex manipulation
vertices.forEach((vertex, i) => {
  const distance = vertex.distanceTo(attractorPoint);
  const force = Math.max(0, 1 - distance / maxDistance);
  vertex.multiplyScalar(1 + force * 0.5);
});
geometry.attributes.position.needsUpdate = true;
```

---

## 🌟 Advanced Features

### Portal Worlds Theme System

Dynamic interface theming that responds to user interaction:

- **5 Quantum Dimensions**: Fractal, Nebula, Inferno, Emerald, Singularity
- **Real-time Color Propagation**: Navigation, backgrounds, glyphs update instantly
- **Parallax Depth Layers**: 3D background effects with mouse tracking
- **Mathematical Symbols**: Greek notation (ψ, Ω, Σ) that change with each "quantum collapse"

### Hyperframe Wireframe System

Advanced wireframe rendering with:

- **Thick Cylinder Edges**: Replace thin lines with 3D cylinders
- **Inner Structures**: Geometry-specific patterns (spherical spirals, cube inner frames)
- **Connecting Rods**: Link inner and outer structures
- **Synchronized Deformation**: All components follow mesh transformations

### Material Property System

Modern PBR materials with:

- **Metalness Control**: 0 (plastic) to 1 (chrome) with visual feedback
- **Emissive Intensity**: Self-illumination with base color tinting
- **Environment Hue Shift**: Universal color adjustment (0-360°)
- **Wireframe Intensity**: Blend between solid and wireframe modes

---

## 🏆 Technical Achievements

### Code Architecture

- **93% Reduction**: Refactored main ThreeScene.jsx from 2,700 to 199 lines
- **Custom Hooks**: 6 specialized hooks for 3D scene management
- **Factory Pattern**: Modularized object creation with reusable components
- **Separation of Concerns**: Clean boundaries between UI, 3D logic, and data

### Performance Optimizations

- **Efficient Animation Loops**: 60fps with complex multi-component objects
- **Memory Management**: Proper cleanup of Three.js objects and event listeners
- **Lazy Loading**: FBX models loaded on-demand with React Suspense
- **Instanced Rendering**: Optimized wireframe rendering for complex shapes

### User Experience Design

- **Progressive Disclosure**: Features unlock as users engage with the platform
- **Contextual UI**: Interface adapts based on authentication and scene state
- **Responsive Design**: Desktop-first with mobile adaptations
- **Accessibility**: Keyboard navigation and screen reader considerations

---

## 🔮 Future Roadmap

### Phase 1: Enhanced Animation System

- [ ] 50+ character animations from complete Mixamo pipeline
- [ ] Color variant system (5 themes per character)
- [ ] Animation speed controls and effect modifiers
- [ ] User-generated character upload system

### Phase 2: Social Platform Features

- [ ] Public scene gallery with discovery algorithms
- [ ] Scene remixing and collaborative editing
- [ ] User profiles with portfolio showcases
- [ ] Like, comment, and sharing systems

### Phase 3: Advanced Capabilities

- [ ] AI-powered scene generation via OpenAI integration
- [ ] VR/AR viewing modes with WebXR
- [ ] Animation recording and video export
- [ ] Marketplace for user-created content

### Phase 4: Professional Tools

- [ ] Scene version control and branching
- [ ] Team collaboration workspaces
- [ ] API for third-party integrations
- [ ] Enterprise deployment options

---

## 🤝 Contributing

### Development Setup

1. **Fork & Clone**: Create your own copy of the repository
2. **Install Dependencies**: `npm install` in both root and backend directories
3. **Environment Setup**: Copy `.env.example` files and configure
4. **Run Development**: `npm run dev` for both frontend and backend
5. **Create Features**: Work on feature branches with descriptive names

### Code Standards

- **ES6+ JavaScript**: Modern syntax with async/await patterns
- **React Hooks**: Functional components with custom hooks for complex logic
- **SCSS Modules**: Component-scoped styling with consistent naming
- **ESLint Configuration**: Automated code quality and style enforcement

### Animation Contributions

To add new character animations:

1. **Create FBX**: Generate model in Meshy.ai + animate in Mixamo
2. **Optimize in Blender**: Texture, scale, and export optimizations
3. **Update mockAnimations.js**: Add configuration with proper positioning
4. **Test Integration**: Ensure smooth loading and animation playback

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

This project is free to use, modify, and distribute. Attribution appreciated but not required.

---

## 🎯 For Job Interviews

### What This Project Demonstrates

- **Advanced React Patterns**: Context, custom hooks, complex state management
- **3D Graphics Programming**: Three.js mastery with vertex manipulation and animation systems
- **Full-Stack Architecture**: Express.js API with MongoDB and JWT authentication
- **User Experience Design**: Progressive disclosure, gamification, responsive design
- **Code Organization**: Factory patterns, modular architecture, clean separation of concerns
- **Performance Optimization**: 60fps 3D rendering with complex multi-component objects

### Key Talking Points

1. **"I built a complete 3D pipeline"** - From Meshy.ai generation to web deployment
2. **"Advanced animation synchronization"** - Multiple components moving in perfect unison
3. **"Gamified progression system"** - Users unlock animations through scene creation
4. **"Full-stack authentication"** - JWT tokens with secure scene saving and loading
5. **"93% code reduction"** - Refactored monolithic component into modular architecture

### Live Demo Script

1. **Geometry Lab**: Show real-time 3D manipulation with material controls
2. **Animation Showcase**: Demonstrate character gallery with unlock progression
3. **Save System**: Create account, save scene, show unlock notification
4. **Multi-Animation**: Return to showcase, demonstrate animation switcher
5. **Technical Deep-Dive**: Show code architecture and explain complex systems

---

<div align="center">

**Built with ❤️ by Pablo Cordero**

[Portfolio](https://pablocordero.dev) | [LinkedIn](https://linkedin.com/in/pablocordero) | [GitHub](https://github.com/pablocordero)

_Transforming mathematical concepts into interactive digital art experiences_

</div>
