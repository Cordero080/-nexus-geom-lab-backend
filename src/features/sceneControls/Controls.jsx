
import './controls.css';
import { useState } from 'react';

/*
 * CONTROLS.JSX - DETAILED DATA FLOW EXPLANATION
 * 
 * PURPOSE: This component creates the user interface that allows users to control the 3D scene
 * 
 * COMPLETE DATA FLOW TRACE:
 * 1. USER INTERACTION: User moves slider, clicks color picker, selects dropdown option
 * 2. BROWSER EVENT: Browser creates 'change' event with event.target.value containing new value
 * 3. REACT HANDLER: onChange attribute calls our handler function (e.g., handleShininessChange)
 * 4. VALUE EXTRACTION: Handler extracts value from event.target.value (usually a string)
 * 5. TYPE CONVERSION: Handler converts string to appropriate type (parseFloat, parseInt, or keep as string)
 * 6. PARENT CALLBACK: Handler calls the setter function passed from App.jsx (e.g., onShininessChange)
 * 7. STATE UPDATE: App.jsx updates its state using the setter function (e.g., setShininess)
 * 8. RE-RENDER CASCADE: App.jsx re-renders and passes new values to both Controls and ThreeScene
 * 9. UI SYNC: Controls displays updated value, ThreeScene updates 3D scene
 * 
 * KEY CONCEPTS:
 * - VALUES FLOW DOWN: App.jsx → Controls (as props like 'shininess')
 * - FUNCTIONS FLOW DOWN: App.jsx → Controls (as props like 'onShininessChange')
 * - UPDATES FLOW UP: Controls → App.jsx (via function calls)
 * - parseFloat() converts "1.5" → 1.5 (decimal numbers)
 * - parseInt() converts "5" → 5 (whole numbers)
 * - Color values stay as strings like "#ff0000"
 * 
 * EXAMPLE TRACE: User moves shininess slider
 * 1. User drags slider → Browser fires onChange event
 * 2. onChange={handleShininessChange} calls our function
 * 3. handleShininessChange gets event, extracts event.target.value
 * 4. parseFloat(event.target.value) converts "100" → 100
 * 5. onShininessChange(100) calls App.jsx's setShininess function
 * 6. App.jsx state updates, re-renders, passes new shininess value back down
 * 7. ThreeScene receives new shininess and updates 3D material
 */

// PROPS RECEIVED FROM App.jsx - These are the data connections
function Controls({ 
	// MATERIAL PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
	scale, onScaleChange,                            // Current scale value + function to update it
	shininess, onShininessChange,                    // Current shininess value + function to update it
	specularColor, onSpecularColorChange,            // Current specular color + function to update it
	specularIntensity, onSpecularIntensityChange,    // Current specular intensity + function to update it
	baseColor, onBaseColorChange,                    // Current base color + function to update it
	wireframeIntensity, onWireframeIntensityChange,  // Current wireframe intensity + function to update it
  
	// INTRICATE WIREFRAME PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
	intricateWireframeSpiralColor, onIntricateWireframeSpiralColorChange,    // Current spiral color + function to update it
	intricateWireframeEdgeColor, onIntricateWireframeEdgeColorChange,        // Current edge color + function to update it
  
	// SCENE PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
	cameraView, onCameraViewChange,                  // Current camera view mode + function to update it
	environment, onEnvironmentChange,                // Current environment setting + function to update it
	objectCount, onObjectCountChange,                // Current object count + function to update it
	animationStyle, onAnimationStyleChange,          // Current animation style + function to update it
	objectType, onObjectTypeChange,                  // Current object type + function to update it
  
	// LIGHTING PROPERTIES (current values FROM App.jsx + setter functions FROM App.jsx)
	ambientLightColor, onAmbientLightColorChange,           // Current ambient light color + function to update it
	ambientLightIntensity, onAmbientLightIntensityChange,   // Current ambient light intensity + function to update it
	directionalLightColor, onDirectionalLightColorChange,   // Current directional light color + function to update it
	directionalLightIntensity, onDirectionalLightIntensityChange, // Current directional light intensity + function to update it
	directionalLightX, onDirectionalLightXChange,           // Current directional light X position + function to update it
	directionalLightY, onDirectionalLightYChange,           // Current directional light Y position + function to update it
	directionalLightZ, onDirectionalLightZChange            // Current directional light Z position + function to update it
}) {
	// ...existing code from Controls.jsx...
}

export default Controls;
