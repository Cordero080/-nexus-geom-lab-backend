import React, { useRef } from 'react';
import './BeamScanButton.css';

// Example code to reveal on hover
const RAW_CODE = `function quantumLeap() {
  const energy = Math.random() * 42;
  return energy > 21 ? 'Wormhole!' : 'Try again';
}`;

/**
 * BeamScanButton component creates an interactive button with code-reveal animation
 * The button transitions between a label and code snippet on hover/focus
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Function to call when button is clicked
 * @param {string} props.label - Button label text (default: 'Enter Playground')
 * @param {string} props.code - Optional custom code to display (defaults to RAW_CODE)
 */
export default function BeamScanButton({ onClick, label = 'Enter Playground', code = RAW_CODE }) {
  const btnRef = useRef(null);

  return (
    <button
      ref={btnRef}
      className="beam-scan-btn beam-btn"
      onClick={onClick}
      tabIndex={0}
    >
      <span className="beam-scan-label beam-btn-label">{label}</span>
      <span className="beam-scan-code beam-btn-code" aria-hidden="true">
        <pre>{code}</pre>
      </span>
      <span className="beam-scan-effect" aria-hidden="true" />
    </button>
  );
}