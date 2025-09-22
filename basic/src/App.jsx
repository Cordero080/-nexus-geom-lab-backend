import { useState } from 'react'
import ThreeScene from './ThreeScene'
import Controls from './Controls'

function App() {
  // React state - data that can change and triggers re-renders
  const [shininess, setShininess] = useState(100)
  const [specularColor, setSpecularColor] = useState('#00ff00')
  const [specularIntensity, setSpecularIntensity] = useState(1.0) // New: controls strength of specular highlights
  const [baseColor, setBaseColor] = useState('#222222')
  const [wireframeIntensity, setWireframeIntensity] = useState(0)
  
  // Dynamic scene controls
  const [cameraView, setCameraView] = useState('free') // 'free', 'orbit', 'top', 'side', 'cinematic'
  const [environment, setEnvironment] = useState('purple') // 'purple', 'space', 'sunset', 'matrix'
  const [objectCount, setObjectCount] = useState(1) // Number of objects (1-10)
  const [animationStyle, setAnimationStyle] = useState('rotate') // 'rotate', 'float', 'spiral', 'chaos'
  const [objectType, setObjectType] = useState('icosahedron') // Object type selection

  // NEW: Lighting controls
  const [ambientLightColor, setAmbientLightColor] = useState('#ffffff') // Ambient light color (white for better visibility)
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(0.5) // Ambient light intensity (increased from 0.1)
  const [directionalLightColor, setDirectionalLightColor] = useState('#ffffff') // Directional light color (white for better visibility)
  const [directionalLightIntensity, setDirectionalLightIntensity] = useState(1.0) // Directional light intensity (reduced from 5)
  const [directionalLightX, setDirectionalLightX] = useState(10) // Directional light X position
  const [directionalLightY, setDirectionalLightY] = useState(10) // Directional light Y position
  const [directionalLightZ, setDirectionalLightZ] = useState(5) // Directional light Z position

  return (
    <>
      {/* Pass ALL values down to ThreeScene */}
      <ThreeScene 
        shininess={shininess} 
        specularColor={specularColor} 
        specularIntensity={specularIntensity}
        baseColor={baseColor}
        wireframeIntensity={wireframeIntensity}
        cameraView={cameraView}
        environment={environment}
        objectCount={objectCount}
        animationStyle={animationStyle}
        objectType={objectType}
        ambientLightColor={ambientLightColor} // NEW: Pass ambient light color
        ambientLightIntensity={ambientLightIntensity} // NEW: Pass ambient light intensity
        directionalLightColor={directionalLightColor} // NEW: Pass directional light color
        directionalLightIntensity={directionalLightIntensity} // NEW: Pass directional light intensity
        directionalLightX={directionalLightX} // NEW: Pass directional light X position
        directionalLightY={directionalLightY} // NEW: Pass directional light Y position
        directionalLightZ={directionalLightZ} // NEW: Pass directional light Z position
      />
      
      {/* Pass ALL setter functions down to Controls */}
      <Controls 
        shininess={shininess} 
        onShininessChange={setShininess}
        specularColor={specularColor}
        onSpecularColorChange={setSpecularColor}
        specularIntensity={specularIntensity}
        onSpecularIntensityChange={setSpecularIntensity}
        baseColor={baseColor}
        onBaseColorChange={setBaseColor}
        wireframeIntensity={wireframeIntensity}
        onWireframeIntensityChange={setWireframeIntensity}
        cameraView={cameraView}
        onCameraViewChange={setCameraView}
        environment={environment}
        onEnvironmentChange={setEnvironment}
        objectCount={objectCount}
        onObjectCountChange={setObjectCount}
        animationStyle={animationStyle}
        onAnimationStyleChange={setAnimationStyle}
        objectType={objectType}
        onObjectTypeChange={setObjectType}
        ambientLightColor={ambientLightColor} // NEW: Pass ambient light color
        onAmbientLightColorChange={setAmbientLightColor} // NEW: Pass ambient light color setter
        ambientLightIntensity={ambientLightIntensity} // NEW: Pass ambient light intensity
        onAmbientLightIntensityChange={setAmbientLightIntensity} // NEW: Pass ambient light intensity setter
        directionalLightColor={directionalLightColor} // NEW: Pass directional light color
        onDirectionalLightColorChange={setDirectionalLightColor} // NEW: Pass directional light color setter
        directionalLightIntensity={directionalLightIntensity} // NEW: Pass directional light intensity
        onDirectionalLightIntensityChange={setDirectionalLightIntensity} // NEW: Pass directional light intensity setter
        directionalLightX={directionalLightX} // NEW: Pass directional light X position
        onDirectionalLightXChange={setDirectionalLightX} // NEW: Pass directional light X position setter
        directionalLightY={directionalLightY} // NEW: Pass directional light Y position
        onDirectionalLightYChange={setDirectionalLightY} // NEW: Pass directional light Y position setter
        directionalLightZ={directionalLightZ} // NEW: Pass directional light Z position
        onDirectionalLightZChange={setDirectionalLightZ} // NEW: Pass directional light Z position setter
      />
    </>
  )
}

export default App