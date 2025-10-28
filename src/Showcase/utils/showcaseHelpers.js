// Quantum utility functions for Showcase components

export function quantumCollapse(states) {
  return states[Math.floor(Math.random() * states.length)];
}

export function getCardPosition(index) {
  const positions = ['center', 'left', 'right'];
  return positions[index % positions.length];
}