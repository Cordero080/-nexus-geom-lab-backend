# useEffect Analysis Guide

## Files to Share with Claude

To get a comprehensive explanation of all useEffect usage in your app, share these files with Claude:

### 1. Main App State Management

- `/src/App.jsx` - Contains 4 useEffect blocks managing:
  - Unsaved changes tracking
  - Navigation blocking
  - Pending navigation execution
  - Loaded config application
  - Browser navigation prevention

### 2. Three.js Scene Bridge

- `/src/features/sceneControls/ThreeScene.jsx` - Shows how props flow from App.jsx to custom hooks (contains 2 useEffect blocks for speed refs)

### 3. Custom Hooks (7 files)

- `/src/features/sceneControls/hooks/useSceneInitialization.js` - Scene setup (1 useEffect)
- `/src/features/sceneControls/hooks/useObjectManager.js` - Object creation (2 useEffect blocks)
- `/src/features/sceneControls/hooks/useCameraController.js` - Camera positioning (1 useEffect)
- `/src/features/sceneControls/hooks/useMaterialUpdates.js` - Material properties (8 useEffect blocks)
- `/src/features/sceneControls/hooks/useLightingUpdates.js` - Lighting updates (2 useEffect blocks)
- `/src/features/sceneControls/hooks/useAnimationLoop.js` - Animation loop (1 useEffect)
- `/src/features/sceneControls/hooks/useNebulaParticles.js` - Particle system (1 useEffect)

### 4. HomePage Scroll Effects

- `/src/components/pages/HomePage/HomePage.jsx` - Scroll listeners (3 useEffect blocks)

## What to Ask Claude

"I need help understanding all the useEffect usage in my React + Three.js app. For each useEffect:

1. Show me the code block
2. Explain the dependency array
3. Explain what it does
4. Explain why useEffect is needed (what would break without it)
5. Show the data flow: State → Props → useEffect → Three.js API → Visual"

## Total useEffect Count

- **App.jsx**: 5 useEffect blocks
- **ThreeScene.jsx**: 2 useEffect blocks
- **useSceneInitialization**: 1 useEffect
- **useObjectManager**: 2 useEffect blocks
- **useCameraController**: 1 useEffect
- **useMaterialUpdates**: 8 useEffect blocks
- **useLightingUpdates**: 2 useEffect blocks
- **useAnimationLoop**: 1 useEffect
- **useNebulaParticles**: 1 useEffect
- **HomePage**: 3 useEffect blocks

**Total: 26 useEffect blocks across the application**
