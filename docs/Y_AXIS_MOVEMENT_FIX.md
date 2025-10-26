# Y-Axis Movement Restriction Fix

## Problem Overview
Character animations in the showcase were having their Y-axis (vertical) movement restricted, preventing natural jumping, bouncing, and vertical motion that are essential for animations like break dancing.

## Root Cause
The FBX animation system was filtering out ALL root position tracks to prevent character drift across the stage. However, this also removed natural Y-axis movement that should be preserved for certain animations.

## Solution Implemented
Added `allowNaturalYMovement` prop to allow selective Y-axis movement while still preventing X/Z drift.

### Changes Made

#### 1. FBXModel.jsx
Added `allowNaturalYMovement` parameter to the component:
```javascript
export default function FBXModel({ 
  url, 
  scale = 0.01, 
  rotation = [0, 0, 0], 
  positionY = -1.8, 
  offsetX = 0, 
  offsetZ = 0, 
  isPlaying = true, 
  onModelLoaded, 
  allowNaturalYMovement = false 
}) {
```

Modified the animation track filtering logic:
```javascript
// If allowNaturalYMovement is true, keep Y position for root
if (allowNaturalYMovement && isRootPosition) {
  // Keep only Y-axis movement, remove X and Z
  return track.name.includes('.position');
}
```

#### 2. RotatingCube.jsx
Added `allowNaturalYMovement` parameter and passed it to FBXModel:
```javascript
export default function RotatingCube({ 
  size = 3, 
  fbxUrl = null, 
  scale = 0.001275, 
  rotation = [0, 0, 0], 
  positionY = -1.8, 
  offsetX = 0, 
  offsetZ = 0, 
  cubeY = -0.5, 
  isPlaying = true, 
  onModelLoaded, 
  preloadedModel = null, 
  allowNaturalYMovement = false 
}) {
```

```javascript
<FBXModel 
  url={fbxUrl} 
  scale={scale} 
  rotation={rotation} 
  positionY={positionY} 
  offsetX={offsetX} 
  offsetZ={offsetZ} 
  isPlaying={isPlaying} 
  onModelLoaded={onModelLoaded} 
  preloadedModel={preloadedModel} 
  allowNaturalYMovement={allowNaturalYMovement} 
/>
```

#### 3. ShowcaseGallery.jsx
Added the prop to character data and passed it through to RotatingCube:
```javascript
{
  id: 2,
  name: 'Vectra APEX #002',
  animation: 'Break Dance',
  variant: 'Spectral',
  description: 'The Ominous Anomaly Woven from Pure Hologram',
  fbxUrl: '/models/diabla-roja.fbx',
  scale: 0.025,
  galleryScale: 0.018,
  rotation: [0, 0, 0],
  positionY: -2.3,
  galleryPositionY: -1.5,
  offsetX: 0,
  offsetZ: 0,
  allowNaturalYMovement: true,  // <-- Enables Y-axis movement
  background: 'linear-gradient(180deg, rgba(0, 102, 255, 0.5) 0%, rgba(117, 250, 217, 0.7) 30%, rgba(214, 67, 243, 0.6) 70%, rgba(0, 255, 255, 0.5) 100%)'
}
```

```javascript
<RotatingCube
  fbxUrl={animation.fbxUrl}
  scale={animation.galleryScale || animation.scale}
  rotation={animation.rotation}
  positionY={animation.galleryPositionY || animation.positionY}
  offsetX={animation.offsetX}
  offsetZ={animation.offsetZ}
  cubeY={0.3}
  size={3.4}
  isPlaying={hoveredCard === animation.id}
  onModelLoaded={() => {
    setModelLoaded((prev) => ({ ...prev, [animation.id]: true }));
  }}
  preloadedModel={preloadedModels[animation.id]}
  allowNaturalYMovement={animation.allowNaturalYMovement}  // <-- Pass through
/>
```

#### 4. ShowcaseViewer.jsx
Passed the prop through to RotatingCube in the viewer:
```javascript
<RotatingCube 
  size={4.5} 
  fbxUrl={animation?.fbxUrl} 
  scale={animation?.scale} 
  rotation={animation?.rotation} 
  positionY={animation?.positionY} 
  offsetX={animation?.offsetX} 
  offsetZ={animation?.offsetZ} 
  cubeY={-0.1} 
  allowNaturalYMovement={animation?.allowNaturalYMovement}  // <-- Pass through
/>
```

## Result
- Characters with `allowNaturalYMovement: false` or undefined stay grounded with no drift (default behavior)
- Characters with `allowNaturalYMovement: true` (like Vectra's break dance) can jump, bounce, and move vertically naturally
- X and Z axes are still restricted to prevent stage drift
- The fix works in both the gallery view and the full-screen viewer

## Characters Affected
- **Vectra APEX #002**: Break dance animation now includes natural jumping and vertical movement
- Other characters maintain grounded animations as intended

## Date Fixed
October 26, 2025

## Recovery Source
This fix was recovered from the `nexus-geom-2` Time Machine backup from October 25, 2025.
