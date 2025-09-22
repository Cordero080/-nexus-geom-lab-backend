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
  animationStyle, onAnimationStyleChange
}) {
  
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
      
      {/* Base Color control */}
      <label>
        Base Color:
      </label>
      <input 
        type="color" 
        value={baseColor}
        onChange={handleBaseColorChange}
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

      <hr style={{margin: '15px 0', border: '1px solid rgba(255,255,255,0.2)'}} />
      
      {/* CAMERA & SCENE CONTROLS */}
      <h3 style={{margin: '10px 0 5px 0', fontSize: '14px', color: '#4ecdc4'}}>🎬 CAMERA & SCENE</h3>
      
      {/* Camera View Control */}
      <label>
        Camera View:
      </label>
      <select value={cameraView} onChange={handleCameraViewChange} style={{
        width: '200px', padding: '5px', background: '#20263951', color: 'white', border: '1px solid #666'
      }}>
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
      <select value={environment} onChange={handleEnvironmentChange} style={{
        width: '200px', padding: '5px', background: '#20263951', color: 'white', border: '1px solid #666666ff'
      }}>
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

      {/* Animation Style Control */}
      <label>
        Animation Style:
      </label>
      <select value={animationStyle} onChange={handleAnimationStyleChange} style={{
        width: '200px', padding: '5px', background: '#20263951', color: 'white', border: '1px solid #666666ff'
      }}>
        <option value="rotate">Simple Rotation</option>
        <option value="float">Floating Dance</option>
        <option value="spiral">Spiral Motion</option>
        <option value="chaos">Chaotic Movement</option>
        <option value="dna">🧬 DNA Helix</option>
        <option value="liquid">🌊 Liquid Metal</option>
        <option value="magnetic">🧲 Magnetic Field</option>
      </select>

    </div>
  )
}

export default Controls