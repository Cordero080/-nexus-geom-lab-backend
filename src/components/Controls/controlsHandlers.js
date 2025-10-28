/**
 * Controls Component Handlers
 *
 * Event handlers for Controls component functionality.
 * Co-located with component following React best practices.
 */

/**
 * Creates handler for metalness slider changes
 * @param {Function} onMetalnessChange - Callback to update metalness
 * @returns {Function} Event handler
 */
export const createMetalnessHandler = (onMetalnessChange) => {
  return (event) => {
    const newMetalness = parseFloat(event.target.value);
    onMetalnessChange(newMetalness);
  };
};

/**
 * Creates handler for scale slider changes
 * @param {Function} onScaleChange - Callback to update scale
 * @returns {Function} Event handler
 */
export const createScaleHandler = (onScaleChange) => {
  return (event) => {
    onScaleChange(parseFloat(event.target.value));
  };
};

/**
 * Creates handler for emissive intensity slider changes
 * @param {Function} onEmissiveIntensityChange - Callback to update emissive intensity
 * @returns {Function} Event handler
 */
export const createEmissiveIntensityHandler = (onEmissiveIntensityChange) => {
  return (event) => {
    const newIntensity = parseFloat(event.target.value);
    onEmissiveIntensityChange(newIntensity);
  };
};

/**
 * Creates handler for base color picker changes
 * @param {Function} onBaseColorChange - Callback to update base color
 * @returns {Function} Event handler
 */
export const createBaseColorHandler = (onBaseColorChange) => {
  return (event) => {
    const newColor = event.target.value;
    onBaseColorChange(newColor);
  };
};

/**
 * Creates handler for wireframe intensity slider changes
 * @param {Function} onWireframeIntensityChange - Callback to update wireframe intensity
 * @returns {Function} Event handler
 */
export const createWireframeIntensityHandler = (onWireframeIntensityChange) => {
  return (event) => {
    const newIntensity = parseFloat(event.target.value);
    onWireframeIntensityChange(newIntensity);
  };
};

/**
 * Creates handler for wireframe toggle checkbox
 * @param {Function} onWireframeIntensityChange - Callback to update wireframe intensity
 * @returns {Function} Event handler
 */
export const createWireframeToggleHandler = (onWireframeIntensityChange) => {
  return (event) => {
    onWireframeIntensityChange(event.target.checked ? 100 : 0);
  };
};

/**
 * Creates handler for hyperframe color picker changes
 * @param {Function} onHyperframeColorChange - Callback to update hyperframe color
 * @returns {Function} Event handler
 */
export const createHyperframeColorHandler = (onHyperframeColorChange) => {
  return (event) => {
    const newColor = event.target.value;
    onHyperframeColorChange(newColor);
  };
};

/**
 * Creates handler for hyperframe line color picker changes
 * @param {Function} onHyperframeLineColorChange - Callback to update hyperframe line color
 * @returns {Function} Event handler
 */
export const createHyperframeLineColorHandler = (
  onHyperframeLineColorChange
) => {
  return (event) => {
    const newColor = event.target.value;
    onHyperframeLineColorChange(newColor);
  };
};

/**
 * Creates handler for camera view dropdown changes
 * @param {Function} onCameraViewChange - Callback to update camera view
 * @returns {Function} Event handler
 */
export const createCameraViewHandler = (onCameraViewChange) => {
  return (event) => {
    const newView = event.target.value;
    onCameraViewChange(newView);
  };
};

/**
 * Creates handler for environment dropdown changes
 * @param {Function} onEnvironmentChange - Callback to update environment
 * @returns {Function} Event handler
 */
export const createEnvironmentHandler = (onEnvironmentChange) => {
  return (event) => {
    const newEnv = event.target.value;
    onEnvironmentChange(newEnv);
  };
};

/**
 * Creates handler for environment hue slider changes
 * @param {Function} onEnvironmentHueChange - Callback to update environment hue
 * @returns {Function} Event handler
 */
export const createEnvironmentHueHandler = (onEnvironmentHueChange) => {
  return (event) => {
    const newHue = parseInt(event.target.value, 10);
    onEnvironmentHueChange(newHue);
  };
};

/**
 * Creates handler for object count slider changes
 * @param {Function} onObjectCountChange - Callback to update object count
 * @returns {Function} Event handler
 */
export const createObjectCountHandler = (onObjectCountChange) => {
  return (event) => {
    const newCount = parseInt(event.target.value);
    onObjectCountChange(newCount);
  };
};

/**
 * Creates handler for animation style dropdown changes
 * @param {Function} onAnimationStyleChange - Callback to update animation style
 * @returns {Function} Event handler
 */
export const createAnimationStyleHandler = (onAnimationStyleChange) => {
  return (event) => {
    const newStyle = event.target.value;
    onAnimationStyleChange(newStyle);
  };
};

/**
 * Creates handler for object type dropdown changes
 * @param {Function} onObjectTypeChange - Callback to update object type
 * @returns {Function} Event handler
 */
export const createObjectTypeHandler = (onObjectTypeChange) => {
  return (event) => {
    const newType = event.target.value;
    onObjectTypeChange(newType);
  };
};
