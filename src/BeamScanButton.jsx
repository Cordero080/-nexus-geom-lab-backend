import React, { useRef } from 'react';
import './BeamScanButton.css';

// Example code to reveal
const RAW_CODE = `function quantumLeap() {
  const energy = Math.random() * 42;
  return energy > 21 ? 'Wormhole!' : 'Try again';
}`;

export default function BeamScanButton({ onClick, label = 'Enter Playground' }) {
  const btnRef = useRef(null);

  return (
    <button
      ref={btnRef}
      className="beam-scan-btn"
      onClick={onClick}
      tabIndex={0}
    >
      <span className="beam-scan-label">{label}</span>
      <span className="beam-scan-code" aria-hidden="true">
        <pre>{RAW_CODE}</pre>
      </span>
      <span className="beam-scan-effect" aria-hidden="true" />
    </button>
  );
}
