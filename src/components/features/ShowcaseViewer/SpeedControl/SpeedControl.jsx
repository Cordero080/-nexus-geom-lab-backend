import { useState } from 'react';
import styles from './speedControl.module.scss';

/**
 * SpeedControl Component
 * 
 * PURPOSE: Provides a slider to control animation speed globally
 * 
 * USAGE:
 * <SpeedControl speed={speed} onSpeedChange={setSpeed} />
 * 
 * PROPS:
 * - speed: Current speed multiplier (0.1 to 5.0, default 1.0)
 * - onSpeedChange: Callback function to update speed in parent
 */

function SpeedControl({ speed = 1.0, onSpeedChange }) {
  const handleSpeedChange = (event) => {
    const newSpeed = parseFloat(event.target.value);
    onSpeedChange(newSpeed);
  };

  return (
    <div className={styles['speed-control-container']}>
      <div className={styles['speed-control-header']}>
        <span className={styles['speed-control-label']}>Animation Speed</span>
        <span className={styles['speed-control-value']}>{speed.toFixed(1)}x</span>
      </div>
      
      <div className={styles['speed-control-slider-wrapper']}>
        <input
          type="range"
          min="0.1"
          max="5.0"
          step="0.1"
          value={speed}
          onChange={handleSpeedChange}
          className={styles['speed-control-slider']}
        />
        
        <div className={styles['speed-control-markers']}>
          <span className={styles['speed-marker']}>0.1x</span>
          <span className={styles['speed-marker']}>1.0x</span>
          <span className={styles['speed-marker']}>5.0x</span>
        </div>
      </div>
      
      <div className={styles['speed-control-presets']}>
        <button 
          className={styles['speed-preset-btn']}
          onClick={() => onSpeedChange(0.25)}
        >
          Slow
        </button>
        <button 
          className={styles['speed-preset-btn']}
          onClick={() => onSpeedChange(1.0)}
        >
          Normal
        </button>
        <button 
          className={styles['speed-preset-btn']}
          onClick={() => onSpeedChange(2.5)}
        >
          Fast
        </button>
      </div>
    </div>
  );
}

export default SpeedControl;
