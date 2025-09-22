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
  const [objectType, setObjectType] = useState('icosahedron') // NEW: Object type selection

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
        objectType={objectType} // NEW: Pass object type to ThreeScene
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
        objectType={objectType} // NEW: Pass object type to Controls
        onObjectTypeChange={setObjectType} // NEW: Pass object type setter to Controls
      />
    </>
  )
}

export default App