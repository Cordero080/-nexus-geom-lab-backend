import { useState } from 'react' // NEW: Import useState for collapsible sections

// This function receives props from the parent (App.jsx)
function Controls({ 
  shininess, onShininessChange, 
  specularColor, onSpecularColorChange, 
  specularIntensity, onSpecularIntensityChange,
  baseColor, onBaseColorChange, 
  wireframeIntensity, onWireframeIntensityChange,
  cameraView, onCameraViewChange,
  environment, onEnvironmentChange,
  objectCount, onObjectCountChange,
  animationStyle, onAnimationStyleChange,
  objectType, onObjectTypeChange,
  // Added lighting control props
  ambientLightColor, onAmbientLightColorChange,
  ambientLightIntensity, onAmbientLightIntensityChange,
  directionalLightColor, onDirectionalLightColorChange,
  directionalLightIntensity, onDirectionalLightIntensityChange,
  directionalLightX, onDirectionalLightXChange,
  directionalLightY, onDirectionalLightYChange,
  directionalLightZ, onDirectionalLightZChange
}) {
  
  // NEW: State for collapsible sections
  const [materialOpen, setMaterialOpen] = useState(true)
  const [sceneOpen, setSceneOpen] = useState(true) 
  const [lightingOpen, setLightingOpen] = useState(true) // Changed to true so lighting controls are visible by default

  // Event handler for shininess slider
  const handleShininessChange = (event) => {
    const newShininess = parseFloat(event.target.value)
    console.log('Shininess changed to:', newShininess)
    onShininessChange(newShininess) // Call the function passed from parent
  }

  // Event handler for specular color picker
  const handleSpecularColorChange = (event) => {
    const newColor = event.target.value  // Gets the hex color (like "#ff0000")
    console.log('Color picker changed to:', newColor) // NEW DEBUG LINE
    console.log('Specular color changed to:', newColor)
    onSpecularColorChange(newColor) // Call the function passed from parent
  }

  // Event handler for specular intensity slider
  const handleSpecularIntensityChange = (event) => {
    const newIntensity = parseFloat(event.target.value)
    console.log('Specular intensity changed to:', newIntensity)
    onSpecularIntensityChange(newIntensity) // Call the function passed from parent
  }

  // Event handler for base color picker
  const handleBaseColorChange = (event) => {
    const newColor = event.target.value
    console.log('Base color changed to:', newColor)
    onBaseColorChange(newColor) // Call the function passed from parent
  }

  // Event handler for wireframe intensity slider
  const handleWireframeIntensityChange = (event) => {
    const newIntensity = parseFloat(event.target.value)
    console.log('Wireframe intensity changed to:', newIntensity)
    onWireframeIntensityChange(newIntensity) // Call the function passed from parent
  }

  // Event handlers for dynamic controls
  const handleCameraViewChange = (event) => {
    const newView = event.target.value
    console.log('Camera view changed to:', newView)
    onCameraViewChange(newView)
  }

  const handleEnvironmentChange = (event) => {
    const newEnv = event.target.value
    console.log('Environment changed to:', newEnv)
    onEnvironmentChange(newEnv)
  }

  const handleObjectCountChange = (event) => {
    const newCount = parseInt(event.target.value)
    console.log('Object count changed to:', newCount)
    onObjectCountChange(newCount)
  }

  const handleAnimationStyleChange = (event) => {
    const newStyle = event.target.value
    console.log('Animation style changed to:', newStyle)
    onAnimationStyleChange(newStyle)
  }

  // Event handler for object type
  const handleObjectTypeChange = (event) => {
    const newType = event.target.value
    console.log('Object type changed to:', newType)
    onObjectTypeChange(newType)
  }

  // Event handlers for lighting controls
  const handleAmbientLightColorChange = (event) => {
    const newColor = event.target.value
    console.log('Ambient light color changed to:', newColor)
    onAmbientLightColorChange(newColor)
  }

  const handleAmbientLightIntensityChange = (event) => {
    const newIntensity = parseFloat(event.target.value)
    console.log('Ambient light intensity changed to:', newIntensity)
    onAmbientLightIntensityChange(newIntensity)
  }

  const handleDirectionalLightColorChange = (event) => {
    const newColor = event.target.value
    console.log('Directional light color changed to:', newColor)
    onDirectionalLightColorChange(newColor)
  }

  const handleDirectionalLightIntensityChange = (event) => {
    const newIntensity = parseFloat(event.target.value)
    console.log('Directional light intensity changed to:', newIntensity)
    onDirectionalLightIntensityChange(newIntensity)
  }

  const handleDirectionalLightXChange = (event) => {
    const newX = parseFloat(event.target.value)
    console.log('Directional light X changed to:', newX)
    onDirectionalLightXChange(newX)
  }

  const handleDirectionalLightYChange = (event) => {
    const newY = parseFloat(event.target.value)
    console.log('Directional light Y changed to:', newY)
    onDirectionalLightYChange(newY)
  }

  const handleDirectionalLightZChange = (event) => {
    const newZ = parseFloat(event.target.value)
    console.log('Directional light Z changed to:', newZ)
    onDirectionalLightZChange(newZ)
  }

  return (
    <div className="controls">
      {/* Debug info */}
      <p>Current shininess: {shininess}</p>
      <p>Current specular: {specularColor}</p>
      <p>Current specular intensity: {specularIntensity}</p>
      <p>Current base: {baseColor}</p>
      <p>Current wireframe intensity: {wireframeIntensity}%</p>
      <p>Camera: {cameraView} | Environment: {environment}</p>
      <p>Objects: {objectCount} | Animation: {animationStyle}</p>
      <p>Object Type: {objectType}</p>
      {/* Added lighting debug info */}
      <p>Ambient: {ambientLightColor} @ {ambientLightIntensity}</p>
      <p>Directional: {directionalLightColor} @ {directionalLightIntensity}</p>
      <p>Dir Position: ({directionalLightX}, {directionalLightY}, {directionalLightZ})</p>
      
      <hr />

      {/* NEW: MATERIAL PROPERTIES SECTION */}
      <div 
        className={`section-header ${materialOpen ? 'material-open' : 'material-closed'}`}
        onClick={() => setMaterialOpen(!materialOpen)}
      >
        <span>🎨 MATERIAL PROPERTIES</span>
        <span>{materialOpen ? '▼' : '▶'}</span>
      </div>
      
      <div className={`section-content ${materialOpen ? 'material-open open' : 'closed'}`}>
        {/* Base Color control */}
        <label>
          Base Color:
        </label>
        <input 
          type="color" 
          value={baseColor}
          onChange={handleBaseColorChange}
        />
        
        {/* Specular color control */}
        <label>
          Specular Color:
        </label>
        <input 
          type="color" 
          value={specularColor}
          onChange={handleSpecularColorChange}
        />

        {/* Specular intensity control */}
        <label>
          Specular Intensity: <span className="value-display">{specularIntensity}</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="2" 
          step="0.1"
          value={specularIntensity}
          onChange={handleSpecularIntensityChange}
        />
        
        {/* Shininess control */}
        <label>
          Shininess: <span className="value-display">{shininess}</span>
        </label>
        <input 
          type="range" 
          min="1" 
          max="2000" 
          value={shininess}
          onChange={handleShininessChange}
        />

        {/* Wireframe intensity slider */}
        <label>
          Wireframe Intensity: <span className="value-display">{wireframeIntensity}%</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={wireframeIntensity}
          onChange={handleWireframeIntensityChange}
        />
      </div>

      {/* NEW: SCENE CONTROLS SECTION */}
      <div 
        className={`section-header ${sceneOpen ? 'scene-open' : 'scene-closed'}`}
        onClick={() => setSceneOpen(!sceneOpen)}
      >
        <span>🎬 CAMERA & SCENE</span>
        <span>{sceneOpen ? '▼' : '▶'}</span>
      </div>
      
      <div className={`section-content ${sceneOpen ? 'scene-open open' : 'closed'}`}>
        {/* Camera View Control */}
        <label>
          Camera View:
        </label>
        <select value={cameraView} onChange={handleCameraViewChange}>
          <option value="free">Free Camera</option>
          <option value="orbit">Orbit View</option>
          <option value="top">Top Down</option>
          <option value="side">Side View</option>
          <option value="cinematic">Cinematic</option>
        </select>

        {/* Environment Control */}
        <label>
          Environment:
        </label>
        <select value={environment} onChange={handleEnvironmentChange}>
          <option value="purple">Purple Gradient</option>
          <option value="space">Space Scene</option>
          <option value="sunset">Sunset Sky</option>
          <option value="matrix">Matrix Code</option>
        </select>

        {/* Object Count Control */}
        <label>
          Object Count: <span className="value-display">{objectCount}</span>
        </label>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={objectCount}
          onChange={handleObjectCountChange}
        />

        {/* Object Type Control */}
        <label>
          Object Type:
        </label>
        <select value={objectType} onChange={handleObjectTypeChange}>
          <option value="icosahedron">💎 Icosahedron</option>
          <option value="sphere">⚪ Sphere</option>
          <option value="box">📦 Box</option>
          <option value="octahedron">🔷 Octahedron</option>
          <option value="tetrahedron">🔺 Tetrahedron</option>
          <option value="torusknot">🌀 Torus Knot</option>
        </select>

        {/* Animation Style Control */}
        <label>
          Animation Style:
        </label>
        <select value={animationStyle} onChange={handleAnimationStyleChange}>
          <option value="rotate">Simple Rotation</option>
          <option value="float">Floating Dance</option>
          <option value="spiral">Spiral Motion</option>
          <option value="chaos">Chaotic Movement</option>
          <option value="dna">🧬 DNA Helix</option>
          <option value="liquid">🌊 Liquid Metal</option>
          <option value="magnetic">🧲 Magnetic Field</option>
        </select>
      </div>

      {/* NEW: LIGHTING CONTROLS SECTION */}
      <div 
        className={`section-header ${lightingOpen ? 'lighting-open' : 'lighting-closed'}`}
        onClick={() => setLightingOpen(!lightingOpen)}
      >
        <span>💡 LIGHTING CONTROLS</span>
        <span>{lightingOpen ? '▼' : '▶'}</span>
      </div>
      
      <div className={`section-content ${lightingOpen ? 'lighting-open open' : 'closed'}`}>
        {/* Ambient Light Controls */}
        <label>
          Ambient Light Color:
        </label>
        <input 
          type="color" 
          value={ambientLightColor}
          onChange={handleAmbientLightColorChange}
        />

        <label>
          Ambient Light Intensity: <span className="value-display">{ambientLightIntensity.toFixed(2)}</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="2" 
          step="0.05"
          value={ambientLightIntensity}
          onChange={handleAmbientLightIntensityChange}
        />

        {/* Directional Light Controls */}
        <label>
          Directional Light Color:
        </label>
        <input 
          type="color" 
          value={directionalLightColor}
          onChange={handleDirectionalLightColorChange}
        />

        <label>
          Directional Light Intensity: <span className="value-display">{directionalLightIntensity.toFixed(1)}</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="20" 
          step="0.5"
          value={directionalLightIntensity}
          onChange={handleDirectionalLightIntensityChange}
        />

        {/* Directional Light Position Controls */}
        <label>
          Directional Light X: <span className="value-display">{directionalLightX.toFixed(1)}</span>
        </label>
        <input 
          type="range" 
          min="-20" 
          max="20" 
          step="0.5"
          value={directionalLightX}
          onChange={handleDirectionalLightXChange}
        />

        <label>
          Directional Light Y: <span className="value-display">{directionalLightY.toFixed(1)}</span>
        </label>
        <input 
          type="range" 
          min="-20" 
          max="20" 
          step="0.5"
          value={directionalLightY}
          onChange={handleDirectionalLightYChange}
        />

        <label>
          Directional Light Z: <span className="value-display">{directionalLightZ.toFixed(1)}</span>
        </label>
        <input 
          type="range" 
          min="-20" 
          max="20" 
          step="0.5"
          value={directionalLightZ}
          onChange={handleDirectionalLightZChange}
        />
      </div>

    </div>
  )
}

export default Controls