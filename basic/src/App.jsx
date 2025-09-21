import { useState } from 'react'
import ThreeScene from './ThreeScene'
import Controls from './Controls'

function App() {
  // React state - data that can change and triggers re-renders
  const [shininess, setShininess] = useState(100) // Changed from 1000 to 100
  const [specularColor, setSpecularColor] = useState('#00ff00') // Valid 6-character hex color

  return (
    <>
      {/* Pass BOTH values down to ThreeScene */}
      <ThreeScene 
        shininess={shininess} 
        specularColor={specularColor} 
      />
      
      {/* Pass BOTH setter functions down to Controls */}
      <Controls 
        shininess={shininess} 
        onShininessChange={setShininess}
        specularColor={specularColor}
        onSpecularColorChange={setSpecularColor}
      />
    </>
  )
}

export default App