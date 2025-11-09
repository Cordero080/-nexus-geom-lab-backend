import React, { useRef, useEffect } from 'react';
import styles from './BeamScanButton.module.scss';
import sharedStyles from '../../../styles/shared.module.scss';

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

  useEffect(() => {
    if (btnRef.current) {
      console.log('🔵 Button mounted:', btnRef.current);
      console.log('🔵 Button computed styles:', {
        pointerEvents: window.getComputedStyle(btnRef.current).pointerEvents,
        zIndex: window.getComputedStyle(btnRef.current).zIndex,
        position: window.getComputedStyle(btnRef.current).position,
        cursor: window.getComputedStyle(btnRef.current).cursor
      });
      
      // Check if button is receiving events
      btnRef.current.addEventListener('mouseenter', () => {
        console.log('🟢 NATIVE mouseenter fired on button!');
      });
      
      btnRef.current.addEventListener('click', (e) => {
        console.log('🟢 NATIVE click fired on button!', e);
      });
    }
  }, []);

  const handleClick = (e) => {
    console.log('🟢 BeamScanButton INTERNAL click handler triggered!', e);
    console.log('🟢 Event target:', e.target);
    console.log('🟢 Event currentTarget:', e.currentTarget);
    console.log('🟢 Button ref:', btnRef.current);
    console.log('🟢 onClick prop:', onClick);
    
    if (onClick) {
      console.log('🟢 Calling onClick prop...');
      onClick(e);
    } else {
      console.log('🔴 No onClick prop provided!');
    }
  };

  return (
    <button
      ref={btnRef}
      className={`${styles.beamScanBtn} ${delayedString ? styles.delayedString : ''} ${sharedStyles.angledCorners} ${className}`}
      onClick={handleClick}
      onMouseEnter={() => console.log('🟡 React mouseEnter on button')}
      onMouseLeave={() => console.log('🟡 React mouseLeave on button')}
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