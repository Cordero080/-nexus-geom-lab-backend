/**
 * Core Utility Helpers
 *
 * Reusable pure functions for common operations across the application.
 * These functions have no side effects and can be easily tested.
 */

/**
 * QUANTUM COLLAPSE UTILITY
 *
 * Simulates quantum superposition collapse - randomly selects one state from multiple possibilities.
 * Inspired by quantum mechanics where particles exist in multiple states simultaneously
 * until "observed" (measured), at which point they collapse into a single definite state.
 *
 * @param {Array} states - Array of possible quantum states to collapse into
 * @returns {*} - Randomly selected state from the array
 */
export function quantumCollapse(states) {
  return states[Math.floor(Math.random() * states.length)];
}

/**
 * Format date for consistent display across the application
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Generate placeholder gradient based on ID for consistent colors
 * @param {string} id - Unique identifier to generate consistent color
 * @returns {string} CSS linear-gradient string
 */
export function getPlaceholderGradient(id) {
  const colors = [
    ["#667eea", "#764ba2"], // Purple
    ["#f093fb", "#f5576c"], // Pink
    ["#4facfe", "#00f2fe"], // Blue
    ["#43e97b", "#38f9d7"], // Green
    ["#fa709a", "#fee140"], // Orange/Pink
    ["#30cfd0", "#330867"], // Teal/Purple
  ];

  // Simple hash to pick consistent color
  const hash =
    id?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
  const [color1, color2] = colors[hash % colors.length];

  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
}

/**
 * Clamp a number between min and max values
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
export function radToDeg(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Generate a random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Check if a value is a valid email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Capitalize the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
