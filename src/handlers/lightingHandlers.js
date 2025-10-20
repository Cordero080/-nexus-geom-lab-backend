/**
 * Lighting Handlers for light properties and positioning
 * These handlers bridge between UI components and state updates
 */

export const handleAmbientLightColorChange =
  (onAmbientLightColorChange) => (event) => {
    onAmbientLightColorChange(event.target.value);
  };

export const handleAmbientLightIntensityChange =
  (onAmbientLightIntensityChange) => (event) => {
    onAmbientLightIntensityChange(parseFloat(event.target.value));
  };

export const handleDirectionalLightColorChange =
  (onDirectionalLightColorChange) => (event) => {
    onDirectionalLightColorChange(event.target.value);
  };

export const handleDirectionalLightIntensityChange =
  (onDirectionalLightIntensityChange) => (event) => {
    const val = parseFloat(event.target.value);
    console.log("[LightingControls] Directional Light Intensity changed:", val);
    onDirectionalLightIntensityChange(val);
  };

export const handleDirectionalLightXChange =
  (onDirectionalLightXChange) => (event) => {
    const val = parseFloat(event.target.value);
    console.log("[LightingControls] Directional Light X changed:", val);
    onDirectionalLightXChange(val);
  };

export const handleDirectionalLightYChange =
  (onDirectionalLightYChange) => (event) => {
    console.log("[LightingControls] Slider Y changed:", event.target.value);
    onDirectionalLightYChange(parseFloat(event.target.value));
  };

export const handleDirectionalLightZChange =
  (onDirectionalLightZChange) => (event) => {
    onDirectionalLightZChange(parseFloat(event.target.value));
  };
