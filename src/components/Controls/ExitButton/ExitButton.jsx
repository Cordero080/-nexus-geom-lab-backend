import React from 'react';
import styles from './ExitButton.module.scss';
import '../../../styles/shared.css';

function ExitButton({ onClick, textColor }) {
  return (
    <button 
      onClick={onClick}
      className={`${styles.exitButton} angled-corners`}
      style={textColor ? { color: textColor } : {}} // Apply custom text color if provided
    >
      <div className={styles.beamScanEffect}></div>
      ← Exit Lab
    </button>
  );
}

export default ExitButton;
