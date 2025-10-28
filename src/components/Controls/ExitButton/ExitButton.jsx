import React from 'react';
import ScrambleButton from '../../ScrambleButton/ScrambleButton';
import styles from './ExitButton.module.scss';

function ExitButton({ onClick, textColor }) {
  return (
    <div className={styles.exitButtonContainer}>
      <ScrambleButton
        onClick={onClick}
        variant="danger"
        className={styles.exitButton}
      >
        ← Exit Lab
      </ScrambleButton>
    </div>
  );
}

export default ExitButton;
