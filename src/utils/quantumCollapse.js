/**
 * Quantum Uncertainty Utility
 * Randomly selects one state from an array of possible states
 * @param {Array} states - Array of possible quantum states
 * @returns {*} Randomly selected state
 */
export default function quantumCollapse(states) {
  return states[Math.floor(Math.random() * states.length)];
}
