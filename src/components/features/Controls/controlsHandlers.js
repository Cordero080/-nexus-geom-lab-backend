/**
 * Controls Component Event Handlers
 *
 * Factory functions that create event handlers for Controls.jsx input elements.
 * These handlers are registered in Controls.jsx and passed down to section components (_sections/).
 * Flow: User input → Handler → Callback to App.jsx → State update → Re-render with new props.
 *
 * parseFloat(): Converts a string to a decimal number (e.g., "1.5" → 1.5). Used for slider values.
 * parseInt(): Converts a string to an integer (e.g., "42" → 42). Used for whole number inputs.
 */

// Parses float from slider input and updates metalness material property
export const createMetalnessHandler = (onMetalnessChange) => {
  return (event) => {
    const newMetalness = parseFloat(event.target.value);
    onMetalnessChange(newMetalness);
  };
};

// Parses float from slider input and updates object scale
export const createScaleHandler = (onScaleChange) => {
  return (event) => {
    onScaleChange(parseFloat(event.target.value));
  };
};

// Parses float from slider input and updates emissive intensity for glow effect
export const createEmissiveIntensityHandler = (onEmissiveIntensityChange) => {
  return (event) => {
    const newIntensity = parseFloat(event.target.value);
    onEmissiveIntensityChange(newIntensity);
  };
};

// Extracts hex color from color picker and ensures alpha channel is included
export const createBaseColorHandler = (onBaseColorChange) => {
  return (event) => {
    const newColor = event.target.value;
    // Ensure alpha channel is preserved (add 'ff' if not present)
    const colorWithAlpha = newColor.length === 7 ? newColor + "ff" : newColor;
    onBaseColorChange(colorWithAlpha);
  };
};

// Parses float from slider input and updates wireframe visibility intensity
export const createWireframeIntensityHandler = (onWireframeIntensityChange) => {
  return (event) => {
    const newIntensity = parseFloat(event.target.value);
    onWireframeIntensityChange(newIntensity);
  };
};

// Toggles wireframe on/off by setting intensity to 100 or 0
export const createWireframeToggleHandler = (onWireframeIntensityChange) => {
  return (event) => {
    onWireframeIntensityChange(event.target.checked ? 100 : 0);
  };
};

// Extracts hex color from color picker and updates hyperframe face color
export const createHyperframeColorHandler = (onHyperframeColorChange) => {
  return (event) => {
    const newColor = event.target.value;
    onHyperframeColorChange(newColor);
  };
};

// Extracts hex color from color picker and updates hyperframe line/edge color
export const createHyperframeLineColorHandler = (
  onHyperframeLineColorChange
) => {
  return (event) => {
    const newColor = event.target.value;
    onHyperframeLineColorChange(newColor);
  };
};

// Extracts selected value from dropdown and updates camera view preset
export const createCameraViewHandler = (onCameraViewChange) => {
  return (event) => {
    const newView = event.target.value;
    onCameraViewChange(newView);
  };
};

// Extracts selected value from dropdown and updates environment preset
export const createEnvironmentHandler = (onEnvironmentChange) => {
  return (event) => {
    const newEnv = event.target.value;
    onEnvironmentChange(newEnv);
  };
};

// Parses integer from slider input and updates environment hue rotation
export const createEnvironmentHueHandler = (onEnvironmentHueChange) => {
  return (event) => {
    const newHue = parseInt(event.target.value, 10);
    onEnvironmentHueChange(newHue);
  };
};

// Parses integer from slider input and updates number of objects in scene
export const createObjectCountHandler = (onObjectCountChange) => {
  return (event) => {
    const newCount = parseInt(event.target.value);
    onObjectCountChange(newCount);
  };
};

// Receives value directly from CustomSelect and updates animation style
export const createAnimationStyleHandler = (onAnimationStyleChange) => {
  return (value) => {
    onAnimationStyleChange(value);
  };
};

// Receives value directly from CustomSelect and updates object geometry type
export const createObjectTypeHandler = (onObjectTypeChange) => {
  return (value) => {
    onObjectTypeChange(value);
  };
};
