// This function receives props from the parent (App.jsx)
function Controls({ shininess, onShininessChange, specularColor, onSpecularColorChange }) {
  
  // Event handler for shininess slider
  const handleShininessChange = (event) => {
    const newShininess = parseFloat(event.target.value)
    console.log('Shininess changed to:', newShininess)
    onShininessChange(newShininess) // Call the function passed from parent
  }

  // Event handler for color picker
  const handleColorChange = (event) => {
    const newColor = event.target.value  // Gets the hex color (like "#ff0000")
    console.log('Color picker changed to:', newColor) // NEW DEBUG LINE
    console.log('Specular color changed to:', newColor)
    onSpecularColorChange(newColor) // Call the function passed from parent
  }

  return (
    <div className="controls">
      {/* Debug info */}
      <p>Current shininess: {shininess}</p>
      <p>Current color: {specularColor}</p>
      
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
      
      {/* NEW: Specular color control */}
      <label>
        Specular Color:
      </label>
      <input 
        type="color" 
        value={specularColor}
        onChange={handleColorChange}
      />
    </div>
  )
}

export default Controls