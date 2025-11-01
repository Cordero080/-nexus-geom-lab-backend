import React, { useRef } from 'react';
import styles from './BeamScanButton.module.scss';
import sharedStyles from '../../../../styles/shared.module.scss';

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
 * @param {Object} props.style - Optional inline styles to apply to button
 * @param {string} props.className - Optional additional CSS classes
 * @param {boolean} props.delayedString - If true, uses delayed quantum string animation
 */
export default function BeamScanButton({ onClick, label = 'Enter Playground', code = RAW_CODE, style, className = '', delayedString = false }) {
  const btnRef = useRef(null);

  return (
    <button
      ref={btnRef}
      className={`${styles.beamScanBtn} ${delayedString ? styles.delayedString : ''} ${sharedStyles.angledCorners} ${className}`}
      onClick={onClick}
      tabIndex={0}
      style={style}
    >
      <span className={styles.beamScanLabel}>{label}</span>
      <span className={styles.beamScanCode} aria-hidden="true">
        <pre>{code}</pre>
      </span>
      <span className={styles.beamScanEffect} aria-hidden="true" />
    </button>
  );
}