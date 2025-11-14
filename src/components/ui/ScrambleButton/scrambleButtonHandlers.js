/**
 * Scramble Button Handlers
 *
 * Event handlers for ScrambleButton component functionality.
 * Includes mouse movement tracking and click ripple effects.
 */

/**
 * Creates a mouse move handler for beam effect positioning
 * @param {React.RefObject} buttonRef - Ref to button element
 * @returns {Function} Mouse move handler
 */
export const createMouseMoveHandler = (buttonRef) => {
  return (e) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top; // y position within the element

    // Update CSS variables for the beam position
    buttonRef.current.style.setProperty('--x', `${x}px`);
    buttonRef.current.style.setProperty('--y', `${y}px`);
  };
};

/**
 * Creates a click handler with ripple effect
 * @param {React.RefObject} buttonRef - Ref to button element
 * @param {Function} setRipples - State setter for ripples array
 * @param {Function} onClick - Original onClick callback
 * @returns {Function} Click handler with ripple effect
 */
export const createClickHandler = (buttonRef, setRipples, onClick) => {
  return (e) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create a new ripple with unique ID
    const id = Date.now();
    const newRipple = { id, x, y };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 1000);

    // Call the original onClick handler
    if (onClick) onClick(e);
  };
};

/**
 * Creates hover state handlers
 * @param {Function} setIsHovering - State setter for hover state
 * @returns {Object} Object with onMouseEnter and onMouseLeave handlers
 */
export const createHoverHandlers = (setIsHovering) => {
  return {
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => setIsHovering(false),
  };
};
