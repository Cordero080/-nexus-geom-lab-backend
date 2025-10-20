/**
 * Control Handlers for material, geometry, and scene properties
 * These handlers bridge between UI components and state updates
 */

// MATERIAL PROPERTY HANDLERS
export const handleShininessChange = (onShininessChange) => (event) => {
  const newShininess = parseFloat(event.target.value);
  console.log("Shininess changed to:", newShininess);
  onShininessChange(newShininess);
};

export const handleSpecularColorChange = (onSpecularColorChange) => (event) => {
  const newColor = event.target.value;
  console.log("Specular color changed to:", newColor);
  onSpecularColorChange(newColor);
};

export const handleSpecularIntensityChange =
  (onSpecularIntensityChange) => (event) => {
    const newIntensity = parseFloat(event.target.value);
    console.log("Specular intensity changed to:", newIntensity);
    onSpecularIntensityChange(newIntensity);
  };

export const handleBaseColorChange = (onBaseColorChange) => (event) => {
  const newColor = event.target.value;
  console.log("Base color changed to:", newColor);
  onBaseColorChange(newColor);
};

export const handleWireframeIntensityChange =
  (onWireframeIntensityChange) => (event) => {
    const newIntensity = parseFloat(event.target.value);
    console.log("Wireframe intensity changed to:", newIntensity);
    onWireframeIntensityChange(newIntensity);
  };

export const handleWireframeToggle =
  (onWireframeIntensityChange) => (event) => {
    onWireframeIntensityChange(event.target.checked ? 100 : 0);
  };

export const handleIntricateWireframeSpiralColorChange =
  (onIntricateWireframeSpiralColorChange) => (event) => {
    const newColor = event.target.value;
    console.log("Intricate wireframe spiral color changed to:", newColor);
    onIntricateWireframeSpiralColorChange(newColor);
  };

export const handleIntricateWireframeEdgeColorChange =
  (onIntricateWireframeEdgeColorChange) => (event) => {
    const newColor = event.target.value;
    console.log("Intricate wireframe edge color changed to:", newColor);
    onIntricateWireframeEdgeColorChange(newColor);
  };

// SCENE CONTROL HANDLERS
export const handleScaleChange = (onScaleChange) => (event) => {
  onScaleChange(parseFloat(event.target.value));
};

export const handleCameraViewChange = (onCameraViewChange) => (event) => {
  const newView = event.target.value;
  console.log("Camera view changed to:", newView);
  onCameraViewChange(newView);
};

export const handleEnvironmentChange = (onEnvironmentChange) => (event) => {
  const newEnv = event.target.value;
  console.log("Environment changed to:", newEnv);
  onEnvironmentChange(newEnv);
};

export const handleObjectCountChange = (onObjectCountChange) => (event) => {
  const newCount = parseInt(event.target.value);
  console.log("Object count changed to:", newCount);
  onObjectCountChange(newCount);
};

export const handleAnimationStyleChange =
  (onAnimationStyleChange) => (event) => {
    const newStyle = event.target.value;
    console.log("Animation style changed to:", newStyle);
    onAnimationStyleChange(newStyle);
  };

export const handleObjectTypeChange = (onObjectTypeChange) => (event) => {
  const newType = event.target.value;
  console.log("Object type changed to:", newType);
  onObjectTypeChange(newType);
};
