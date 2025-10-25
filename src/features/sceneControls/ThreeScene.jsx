import { updateEnvironment } from './environmentSetup';
import { __UP, __Q, __TMP, __A, __B, __M, __Inv, nearestVertexIndex, updateThickWireframeCylinders } from '../../utils/geometryHelpers';
import React, { useRef } from 'react';
import './ThreeScene.css';
import { useSceneInitialization } from './hooks/useSceneInitialization';
import { useObjectManager } from './hooks/useObjectManager';
import { useCameraController } from './hooks/useCameraController';
import { useMaterialUpdates } from './hooks/useMaterialUpdates';
import { useLightingUpdates } from './hooks/useLightingUpdates';
import { useMouseTracking, useEnvironmentUpdate } from './hooks/useSceneEffects';
import { useAnimationLoop } from './hooks/useAnimationLoop';
import { useObjectInteraction } from './hooks/useObjectInteraction';



// ========================================================================
// THREESCENE.JSX - THE 3D RENDERER (RECEIVES PROPS FROM APP.JSX)
// ========================================================================
// This component ONLY receives data - it doesn't manage any state itself.
// All the values come from App.jsx as props, and when App.jsx changes them,
// this component automatically re-renders the 3D scene with new values.

function ThreeScene({ 
	// MATERIAL PROPS - How the 3D objects should look (FROM App.jsx state)
	scale,                 // Current scale value → will update Three.js object scale
	metalness,           // Current metalness value → will update Three.js material.metalness (0-1)
	emissiveIntensity,   // Current emissive intensity → will update Three.js material.emissive (multiplied by baseColor)
	baseColor,           // Current base color → will update Three.js material.color
	wireframeIntensity,  // Current wireframe intensity → will update Three.js material.wireframe
	
	// INTRICATE WIREFRAME PROPS - How the intricate wireframe should look (FROM App.jsx state)
	hyperframeColor,  // Current spiral color → will update intricate wireframe spiral lines
	hyperframeLineColor,    // Current edge color → will update intricate wireframe edge connections
	
	// SCENE BEHAVIOR PROPS - How the scene should behave (FROM App.jsx state)
	cameraView,          // Current camera view → will position/animate camera
	environment,         // Current environment → will change background/lighting
	environmentHue,      // Current environment hue shift (0-360) → will shift colors of background and orbs
	objectCount,         // Current object count → will create this many objects
	animationStyle,      // Current animation → will control how objects move
	objectType,          // Current object type → will determine which 3D shape to show
	
	// LIGHTING PROPS - How the scene should be lit (FROM App.jsx state)
	ambientLightColor,       // Current ambient light color → will update ambient light
	ambientLightIntensity,   // Current ambient light intensity → will update ambient light
	directionalLightColor,   // Current directional light color → will update directional light
	directionalLightIntensity, // Current directional light intensity → will update directional light
	directionalLightX,       // Current light X position → will position directional light
	directionalLightY,       // Current light Y position → will position directional light
	directionalLightZ        // Current light Z position → will position directional light
}) {
	// ========================================
	// REFS - STORING THREE.JS OBJECTS
	// ========================================
	// useRef lets us store Three.js objects that persist between re-renders
	// These are NOT React state - they're just containers for Three.js objects
	
	const mountRef = useRef(null)              // Where to attach the 3D canvas to the DOM
	const sceneRef = useRef(null)              // The Three.js scene object
	const materialRef = useRef(null)           // Reference to main material for debugging
	const cameraRef = useRef(null)             // The Three.js camera object
	const rendererRef = useRef(null)           // The Three.js renderer object
	const objectsRef = useRef([])              // Array of all 3D objects in the scene
	const animationIdRef = useRef(null)        // ID for the animation loop (so we can cancel it)
	const ambientLightRef = useRef(null)       // Reference to ambient light (so we can update it)
	const directionalLightRef = useRef(null)   // Reference to directional light (so we can update it)

	// =============================================
	// CUSTOM HOOKS - ORGANIZED SCENE MANAGEMENT
	// =============================================
	
	// Initialize scene, camera, renderer, lights (runs once on mount)
	useSceneInitialization(
		{ sceneRef, cameraRef, rendererRef, mountRef, ambientLightRef, directionalLightRef, animationIdRef },
		{ ambientLightColor, ambientLightIntensity, directionalLightColor, directionalLightIntensity, 
		  directionalLightX, directionalLightY, directionalLightZ }
	);

	// Track mouse for orb interaction
	useMouseTracking(rendererRef, cameraRef);

	// Update environment (background and orbs)
	useEnvironmentUpdate(sceneRef, environment, environmentHue);

	// Manage object creation and updates
	useObjectManager(
		{ sceneRef, objectsRef, materialRef },
		{ objectCount, objectType, baseColor, metalness, emissiveIntensity, 
		  wireframeIntensity, hyperframeColor, hyperframeLineColor }
	);

	// Control camera position
	useCameraController(cameraRef, cameraView);

	// Update material properties
	useMaterialUpdates(objectsRef, {
		scale, metalness, emissiveIntensity, baseColor, wireframeIntensity,
		hyperframeColor, hyperframeLineColor
	});

	// Update lighting
	useLightingUpdates(
		{ ambientLightRef, directionalLightRef },
		{ ambientLightColor, ambientLightIntensity, directionalLightColor, directionalLightIntensity,
		  directionalLightX, directionalLightY, directionalLightZ }
	);

	// Handle object interaction (mouse-over rotation interference)
	const { getUserRotation, decayUserRotations } = useObjectInteraction(
		{ sceneRef, cameraRef, rendererRef }
	);

	// Start animation loop with user rotation support
	useAnimationLoop(
		{ rendererRef, sceneRef, cameraRef, animationIdRef, objectsRef },
		{ animationStyle, cameraView },
		{ getUserRotation, decayUserRotations }
	);

	// ===============================================
	// RENDER METHOD - WHAT GETS DISPLAYED IN THE DOM
	// ===============================================
	// This component renders a parent div with a CSS gradient background, and the Three.js canvas inside
	// Helper: map environment names to CSS class names
	function getBackgroundClass(env) {
		switch (env) {
			case 'nebula': return 'bg-gradient bg-gradient-nebula';
			case 'space': return 'bg-gradient bg-gradient-space';
			case 'sunset': return 'bg-gradient bg-gradient-sunset';
			case 'matrix': return 'bg-gradient bg-gradient-matrix';
			default: return 'bg-gradient bg-gradient-default';
		}
	}

	return (
		<div 
			style={{
				position: 'relative',
				width: '100%',
				height: '100vh',
				minHeight: '100vh'
			}}
		>
			{/* Background overlay with hue shift */}
			<div 
				className={getBackgroundClass(environment)}
				style={{
					pointerEvents: 'none',
					'--hue-shift': `${environmentHue}deg`,
					filter: environment === 'matrix' ? 'none' : `hue-rotate(${environmentHue}deg)`
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
					height: '100%'
				}}
			/>
		</div>
	);
}



export default ThreeScene

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