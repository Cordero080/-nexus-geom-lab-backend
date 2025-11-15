import { updateEnvironment } from './threeSetup/environmentSetup';
import {
  __UP,
  __Q,
  __TMP,
  __A,
  __B,
  __M,
  __Inv,
  nearestVertexIndex,
  updateThickWireframeCylinders,
} from './utils/geometryHelpers';
import React, { useRef, useEffect } from 'react';
import './ThreeScene.css';

// CORE INFRASTRUCTURE HOOKS - Run ONCE on mount, create fundamental Three.js objects
import { useSceneInitialization } from './hooks/core/useSceneInitialization';
import { useObjectManager } from './hooks/core/useObjectManager';

// PROPERTY UPDATE HOOKS - React to prop changes, modify existing objects
import { useCameraController } from './hooks/updates/useCameraController';
import { useMaterialUpdates } from './hooks/updates/useMaterialUpdates';
import { useLightingUpdates } from './hooks/updates/useLightingUpdates';

// VISUAL EFFECTS HOOKS - Add environmental effects and lighting
import { useMetalnessLighting } from './hooks/effects/useMetalnessLighting';
import { useMouseTracking, useEnvironmentUpdate } from './hooks/effects/useSceneEffects';
import { useNebulaParticles } from './hooks/effects/useNebulaParticles';

// USER INTERACTION HOOKS - Handle animation loops and user input
import { useAnimationLoop } from './hooks/interaction/useAnimationLoop';
import { useObjectInteraction } from './hooks/interaction/useObjectInteraction';

// AUDIO FEATURES
import { useAudioAnalyzer } from '../audio/hooks/useAudioAnalyzer';
import { useAudioReactive } from '../audio/hooks/useAudioReactive';
import AudioToggle from '../audio/components/AudioToggle';

// ThreeScene: 3D renderer that receives a config object from App.jsx
function ThreeScene({ config }) {
  // Destructure all configuration values from the single config object
  const {
    // Material props
    scale,
    objectSpeed,
    orbSpeed,
    metalness,
    emissiveIntensity,
    baseColor,
    wireframeIntensity,
    // Hyperframe props
    hyperframeColor,
    hyperframeLineColor,
    // Scene behavior props
    cameraView,
    environment,
    environmentHue,
    objectCount,
    animationStyle,
    objectType,
    // Lighting props
    ambientLightColor,
    ambientLightIntensity,
    directionalLightColor,
    directionalLightIntensity,
    directionalLightX,
    directionalLightY,
    directionalLightZ,
  } = config;
  // Three.js object references
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const materialRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const objectsRef = useRef([]);
  const animationIdRef = useRef(null);
  const ambientLightRef = useRef(null);
  const directionalLightRef = useRef(null);
  const objectSpeedRef = useRef(objectSpeed);
  const orbSpeedRef = useRef(orbSpeed);

  // Update speed refs when speed props change (without restarting animation)
  useEffect(() => {
    objectSpeedRef.current = objectSpeed;
  }, [objectSpeed]);

  useEffect(() => {
    orbSpeedRef.current = orbSpeed;
  }, [orbSpeed]);

  // Audio reactivity
  const { bass, mids, highs, overall, isActive, toggleAudio } = useAudioAnalyzer();
  useAudioReactive(
    objectsRef,
    { bass, mids, highs, overall },
    isActive,
    baseColor,
    hyperframeColor,
    hyperframeLineColor
  );

  /* ========================================================================
   * HOOK EXECUTION ORDER - Critical for Three.js scene setup
   * ========================================================================
   *
   * 1. CORE INFRASTRUCTURE (runs ONCE on mount)
   *    - Creates scene, camera, renderer, lights
   *    - Creates 3D objects
   *    - Everything else depends on these being initialized first
   *
   * 2. VISUAL EFFECTS
   *    - Adds particles, environment effects, extra lighting
   *    - Depends on scene being initialized
   *
   * 3. PROPERTY UPDATES
   *    - Reacts to prop changes
   *    - Updates materials, lighting, camera position
   *    - Depends on objects existing
   *
   * 4. USER INTERACTION
   *    - Handles mouse events and animation loop
   *    - Runs last, orchestrates everything
   * ======================================================================== */

  // 1. CORE INFRASTRUCTURE - Initialize scene, camera, renderer, and lights
  useSceneInitialization(
    {
      sceneRef,
      cameraRef,
      rendererRef,
      mountRef,
      ambientLightRef,
      directionalLightRef,
      animationIdRef,
    },
    {
      ambientLightColor,
      ambientLightIntensity,
      directionalLightColor,
      directionalLightIntensity,
      directionalLightX,
      directionalLightY,
      directionalLightZ,
    }
  );

  useObjectManager(
    { sceneRef, objectsRef, materialRef },
    {
      objectCount,
      objectType,
      baseColor,
      metalness,
      emissiveIntensity,
      wireframeIntensity,
      hyperframeColor,
      hyperframeLineColor,
    }
  );

  // 2. VISUAL EFFECTS - Add environmental effects
  useMouseTracking(rendererRef, cameraRef);
  useEnvironmentUpdate(sceneRef, environment, environmentHue);
  useNebulaParticles(sceneRef, environment, environmentHue, orbSpeedRef);
  useMetalnessLighting(sceneRef, metalness, baseColor);

  // 3. PROPERTY UPDATES - React to prop changes
  useCameraController(cameraRef, cameraView);

  useMaterialUpdates(objectsRef, {
    scale,
    metalness,
    emissiveIntensity,
    baseColor,
    wireframeIntensity,
    hyperframeColor,
    hyperframeLineColor,
  });

  useLightingUpdates(
    { ambientLightRef, directionalLightRef },
    {
      ambientLightColor,
      ambientLightIntensity,
      directionalLightColor,
      directionalLightIntensity,
      directionalLightX,
      directionalLightY,
      directionalLightZ,
      metalness,
    }
  );

  // 4. USER INTERACTION - Handle mouse-over object rotation and animation loop
  const { getUserRotation, decayUserRotations } = useObjectInteraction({
    sceneRef,
    cameraRef,
    rendererRef,
  });

  useAnimationLoop(
    { rendererRef, sceneRef, cameraRef, animationIdRef, objectsRef, objectSpeedRef, orbSpeedRef },
    { animationStyle, cameraView },
    { getUserRotation, decayUserRotations }
  );

  // Map environment to CSS background class
  function getBackgroundClass(env) {
    switch (env) {
      case 'nebula':
        return 'bg-gradient bg-gradient-nebula';
      case 'space':
        return 'bg-gradient bg-gradient-space';
      case 'sunset':
        return 'bg-gradient bg-gradient-sunset';
      case 'matrix':
        return 'bg-gradient bg-gradient-matrix';
      default:
        return 'bg-gradient bg-gradient-default';
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '100vh',
      }}
    >
      {/* Background overlay with hue shift */}
      <div
        className={getBackgroundClass(environment)}
        style={{
          pointerEvents: 'none',
          '--hue-shift': `${environmentHue}deg`,
          filter: environment === 'matrix' ? 'none' : `hue-rotate(${environmentHue}deg)`,
        }}
      />
      {/* Three.js canvas container - NOT affected by hue shift */}
      <div
        ref={mountRef}
        className="three-scene-container"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
        }}
      />
      {/* Foreground layer that bleeds over 3D objects (space environment only) */}
      {environment === 'space' && (
        <div
          className="bg-gradient-space-foreground"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 3,
            pointerEvents: 'none',
            filter: `hue-rotate(${environmentHue}deg)`,
          }}
        />
      )}
      {/* Audio Reactive Toggle */}
      <AudioToggle isActive={isActive} onToggle={toggleAudio} audioData={{ bass, mids, highs }} />
    </div>
  );
}

export default ThreeScene;

/*
=================================================================
SUMMARY: HOW THREESCENE.JSX RECEIVES AND USES PROPS FROM APP.JSX
=================================================================

1. PROPS FLOW IN FROM APP.JSX
	 - All the values (shininess, colors, counts, etc.) come from App.jsx state
	 - When App.jsx state changes, this component automatically re-renders

2. USEEFFECTS LISTEN FOR SPECIFIC PROP CHANGES
	 - Each useEffect has a dependency array that lists which props it cares about
	 - When those specific props change, only that useEffect runs (not the whole component)

3. PROPS GET CONVERTED TO THREE.JS ACTIONS
	 - shininess prop → material.shininess property
	 - specularColor prop → material.specular.setHex() call
	 - objectCount prop → creates that many 3D objects
	 - animationStyle prop → determines which animation code runs

4. THE REACT → THREE.JS BRIDGE
	 - React handles the UI state and prop flow
	 - Three.js handles the 3D rendering and animation
	 - useRef stores Three.js objects that persist between React re-renders
	 - useEffect bridges React prop changes to Three.js object updates

5. KEY INSIGHT: SEPARATION OF CONCERNS
	 - App.jsx = Data management (what the values should be)
	 - Controls.jsx = User interface (how users change the values)  
	 - ThreeScene.jsx = Visual rendering (how the values look in 3D)

FLOW: User interacts with Controls.jsx → Controls.jsx calls App.jsx setters → App.jsx updates state → ThreeScene.jsx receives new props → useEffects update Three.js objects → 3D scene re-renders
*/
