import { useState } from 'react'
import ThreeScene from './ThreeScene'
import Controls from './Controls'

// Updated default colors for psychedelic theme
const defaultBaseColor = '#ff00ff'; // Vibrant magenta
const defaultSpecularColor = '#00ffff'; // Bright cyan
const defaultWireframeColor = '#ffff00'; // Bright yellow
const defaultIntricateWireframeSpiralColor = '#ff4500'; // Vivid orange-red
const defaultIntricateWireframeEdgeColor = '#00ff00'; // Bright green

function App() {
  // ==========================================
  // APP.JSX IS THE "BRAIN" - STORES ALL DATA
  // ==========================================
  // This is where ALL the actual values live. Controls.jsx just sends us requests to change these.
  // When these change, React automatically re-renders both Controls.jsx AND ThreeScene.jsx with new values.

  // MATERIAL PROPERTIES STATE
  // These control how the 3D objects look and feel
  const [shininess, setShininess] = useState(100)                    // Controlled by: shininess slider in Controls.jsx
  const [specularColor, setSpecularColor] = useState(defaultSpecularColor)      // Controlled by: specular color picker in Controls.jsx
  const [specularIntensity, setSpecularIntensity] = useState(1.0)    // Controlled by: specular intensity slider in Controls.jsx
  const [baseColor, setBaseColor] = useState(defaultBaseColor)              // Controlled by: base color picker in Controls.jsx
  const [wireframeIntensity, setWireframeIntensity] = useState(50)    // Controlled by: wireframe slider in Controls.jsx (TESTING: set to 50% for visibility)
  
  // INTRICATE WIREFRAME STATE
  // These control the colors of the intricate wireframe details
  const [intricateWireframeSpiralColor, setIntricateWireframeSpiralColor] = useState(defaultIntricateWireframeSpiralColor) // Controlled by: intricate wireframe spiral color picker in Controls.jsx
  const [intricateWireframeEdgeColor, setIntricateWireframeEdgeColor] = useState(defaultIntricateWireframeEdgeColor)     // Controlled by: intricate wireframe edge color picker in Controls.jsx
  
  // SCENE BEHAVIOR STATE
  // These control how the scene behaves and looks
  const [cameraView, setCameraView] = useState('free')               // Controlled by: camera dropdown in Controls.jsx
  const [environment, setEnvironment] = useState('purple')           // Controlled by: environment dropdown in Controls.jsx
  const [objectCount, setObjectCount] = useState(1)                  // Controlled by: object count slider in Controls.jsx
  const [animationStyle, setAnimationStyle] = useState('rotate')     // Controlled by: animation dropdown in Controls.jsx
  const [objectType, setObjectType] = useState('icosahedron')        // Controlled by: object type dropdown in Controls.jsx

  // LIGHTING STATE
  // These control all the lights in the 3D scene
  const [ambientLightColor, setAmbientLightColor] = useState('#ffffff')           // Controlled by: ambient light color picker in Controls.jsx
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(0.5)         // Controlled by: ambient light intensity slider in Controls.jsx
  const [directionalLightColor, setDirectionalLightColor] = useState('#ffffff')   // Controlled by: directional light color picker in Controls.jsx
  const [directionalLightIntensity, setDirectionalLightIntensity] = useState(1.0) // Controlled by: directional light intensity slider in Controls.jsx
  const [directionalLightX, setDirectionalLightX] = useState(10)                  // Controlled by: directional light X slider in Controls.jsx
  const [directionalLightY, setDirectionalLightY] = useState(10)                  // Controlled by: directional light Y slider in Controls.jsx
  const [directionalLightZ, setDirectionalLightZ] = useState(5)                   // Controlled by: directional light Z slider in Controls.jsx
  const [scale, setScale] = useState(1)                   // Controlled by: directional light Z slider in Controls.jsx  

  return (
    <>
      {/* 
        =====================================================
        SENDING DATA TO THREESCENE.JSX (THE 3D RENDERER)
        =====================================================
        We give ThreeScene ALL our current values so it can render the 3D scene.
        When any of these values change (because Controls.jsx requested it), 
        ThreeScene automatically re-renders with the new values.
      */}
      <ThreeScene 

        // SCALE
       scale={scale}
        // MATERIAL PROPS - How objects look
        shininess={shininess}                             // Current shininess value → used by 3D materials
        specularColor={specularColor}                     // Current specular color → used by 3D materials
        specularIntensity={specularIntensity}             // Current specular intensity → used by 3D materials
        baseColor={baseColor}                             // Current base color → used by 3D materials
        wireframeIntensity={wireframeIntensity}           // Current wireframe intensity → used by 3D materials
        
        // INTRICATE WIREFRAME PROPS - How intricate wireframe looks
        intricateWireframeSpiralColor={intricateWireframeSpiralColor}   // Current spiral color → used by intricate wireframe spiral lines
        intricateWireframeEdgeColor={intricateWireframeEdgeColor}       // Current edge color → used by intricate wireframe edge connections
        
        // SCENE BEHAVIOR PROPS - How scene behaves
        cameraView={cameraView}                           // Current camera view → controls camera position/movement
        environment={environment}                         // Current environment → controls background/lighting setup
        objectCount={objectCount}                         // Current object count → controls how many objects to render
        animationStyle={animationStyle}                   // Current animation → controls how objects move
        objectType={objectType}                           // Current object type → controls which 3D shape to show
        
        // LIGHTING PROPS - How scene is lit
        ambientLightColor={ambientLightColor}             // Current ambient color → controls overall scene lighting color
        ambientLightIntensity={ambientLightIntensity}     // Current ambient intensity → controls overall scene brightness
        directionalLightColor={directionalLightColor}     // Current directional color → controls main light color
        directionalLightIntensity={directionalLightIntensity} // Current directional intensity → controls main light brightness
        directionalLightX={directionalLightX}             // Current light X position → controls where main light is positioned
        directionalLightY={directionalLightY}             // Current light Y position → controls where main light is positioned
        directionalLightZ={directionalLightZ}             // Current light Z position → controls where main light is positioned
      />
      
      {/* 
        ========================================================
        SENDING DATA TO CONTROLS.JSX (THE USER INTERFACE)
        ========================================================
        We give Controls.jsx TWO things for each property:
        1. The CURRENT VALUE (so sliders/inputs show the right position)
        2. The SETTER FUNCTION (so Controls.jsx can request changes)
        
        When user interacts with Controls.jsx:
        User moves slider → Controls.jsx calls our setter → We update state → Everything re-renders
      */}
      <Controls 
        // MATERIAL CONTROLS - Pairs of current value + change handler

        // SCALE for material size
        scale={scale}
        onScaleChange={setScale}

        shininess={shininess}                                     // Current value → shows in Controls.jsx slider position
        onShininessChange={setShininess}                          // Change handler → Controls.jsx calls this to update shininess
        
        specularColor={specularColor}                             // Current value → shows in Controls.jsx color picker
        onSpecularColorChange={setSpecularColor}                  // Change handler → Controls.jsx calls this to update specular color
        
        specularIntensity={specularIntensity}                     // Current value → shows in Controls.jsx slider position
        onSpecularIntensityChange={setSpecularIntensity}          // Change handler → Controls.jsx calls this to update specular intensity
        
        baseColor={baseColor}                                     // Current value → shows in Controls.jsx color picker
        onBaseColorChange={setBaseColor}                          // Change handler → Controls.jsx calls this to update base color
        
        wireframeIntensity={wireframeIntensity}                   // Current value → shows in Controls.jsx slider position
        onWireframeIntensityChange={setWireframeIntensity}        // Change handler → Controls.jsx calls this to update wireframe
        
        // INTRICATE WIREFRAME CONTROLS - Pairs of current value + change handler
        intricateWireframeSpiralColor={intricateWireframeSpiralColor}         // Current value → shows in Controls.jsx color picker
        onIntricateWireframeSpiralColorChange={setIntricateWireframeSpiralColor} // Change handler → Controls.jsx calls this to change spiral color
        
        intricateWireframeEdgeColor={intricateWireframeEdgeColor}             // Current value → shows in Controls.jsx color picker
        onIntricateWireframeEdgeColorChange={setIntricateWireframeEdgeColor}   // Change handler → Controls.jsx calls this to change edge color
        
        // SCENE BEHAVIOR CONTROLS - Pairs of current value + change handler
        cameraView={cameraView}                                   // Current value → shows in Controls.jsx dropdown selection
        onCameraViewChange={setCameraView}                        // Change handler → Controls.jsx calls this to change camera
        
        environment={environment}                                 // Current value → shows in Controls.jsx dropdown selection
        onEnvironmentChange={setEnvironment}                      // Change handler → Controls.jsx calls this to change environment
        
        objectCount={objectCount}                                 // Current value → shows in Controls.jsx slider position
        onObjectCountChange={setObjectCount}                      // Change handler → Controls.jsx calls this to change object count
        
        animationStyle={animationStyle}                           // Current value → shows in Controls.jsx dropdown selection
        onAnimationStyleChange={setAnimationStyle}                // Change handler → Controls.jsx calls this to change animation
        
        objectType={objectType}                                   // Current value → shows in Controls.jsx dropdown selection
        onObjectTypeChange={setObjectType}                        // Change handler → Controls.jsx calls this to change object type
        
        // LIGHTING CONTROLS - Pairs of current value + change handler
        ambientLightColor={ambientLightColor}                     // Current value → shows in Controls.jsx color picker
        onAmbientLightColorChange={setAmbientLightColor}          // Change handler → Controls.jsx calls this to change ambient color
        
        ambientLightIntensity={ambientLightIntensity}             // Current value → shows in Controls.jsx slider position
        onAmbientLightIntensityChange={setAmbientLightIntensity}  // Change handler → Controls.jsx calls this to change ambient intensity
        
        directionalLightColor={directionalLightColor}             // Current value → shows in Controls.jsx color picker
        onDirectionalLightColorChange={setDirectionalLightColor} // Change handler → Controls.jsx calls this to change directional color
        
        directionalLightIntensity={directionalLightIntensity}     // Current value → shows in Controls.jsx slider position
        onDirectionalLightIntensityChange={setDirectionalLightIntensity} // Change handler → Controls.jsx calls this to change directional intensity
        
        directionalLightX={directionalLightX}                     // Current value → shows in Controls.jsx slider position
        onDirectionalLightXChange={setDirectionalLightX}          // Change handler → Controls.jsx calls this to change light X position
        
        directionalLightY={directionalLightY}                     // Current value → shows in Controls.jsx slider position
        onDirectionalLightYChange={setDirectionalLightY}          // Change handler → Controls.jsx calls this to change light Y position
        
        directionalLightZ={directionalLightZ}                     // Current value → shows in Controls.jsx slider position
        onDirectionalLightZChange={setDirectionalLightZ}          // Change handler → Controls.jsx calls this to change light Z position
      />
    </>
  )
}

export default App

/*
===========================================
SUMMARY: HOW THE DATA FLOWS IN THIS APP
===========================================

1. APP.JSX (this file) = The "BRAIN"
   - Stores all the actual data using useState
   - Gives current values to BOTH Controls.jsx and ThreeScene.jsx
   - Gives setter functions to Controls.jsx so it can request changes

2. CONTROLS.JSX = The "INTERFACE" 
   - Creates sliders, color pickers, dropdowns for user interaction
   - When user interacts, calls the setter functions App.jsx gave it
   - Shows current values by reading the values App.jsx gave it

3. THREESCENE.JSX = The "RENDERER"
   - Uses the current values App.jsx gives it to render the 3D scene
   - Automatically re-renders when App.jsx state changes

FLOW: User moves slider in Controls.jsx → Controls.jsx calls App.jsx setter → App.jsx updates state → Both Controls.jsx and ThreeScene.jsx re-render with new values
*/