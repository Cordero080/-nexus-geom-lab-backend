import React from 'react';
import styles from './AudioToggle.module.scss';

/**
 * Audio Reactive Toggle Button
 *
 * Floating button to enable/disable audio reactivity
 * Shows visual indicator when active
 */
function AudioToggle({ isActive, onToggle, audioData }) {
  const { bass, mids, highs } = audioData || { bass: 0, mids: 0, highs: 0 };

  // Check if any audio is being detected
  const hasAudio = bass > 0.05 || mids > 0.05 || highs > 0.05;

  return (
    <div className={styles.audioToggleContainer}>
      {/* Main Toggle Button */}
      <button
        onClick={onToggle}
        className={`${styles.toggleButton} ${isActive ? styles.active : ''} ${isActive && hasAudio ? styles.detecting : ''}`}
        title={isActive ? 'Disable Audio Reactivity' : 'Enable Audio Reactivity'}
      >
        <span className={styles.icon}>{isActive ? (hasAudio ? '�' : '�🎤') : '🔇'}</span>
        <span className={styles.label}>
          {isActive ? (hasAudio ? 'DETECTING' : 'LISTENING') : 'AUDIO OFF'}
        </span>
      </button>

      {/* Frequency Visualizer (only when active) */}
      {isActive && (
        <div className={styles.visualizer}>
          <div className={styles.frequencyBar}>
            <div className={styles.barLabel}>Bass</div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{
                  width: `${bass * 100}%`,
                  backgroundColor: '#ff0064',
                }}
              />
            </div>
          </div>
          <div className={styles.frequencyBar}>
            <div className={styles.barLabel}>Mids</div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{
                  width: `${mids * 100}%`,
                  backgroundColor: '#00ff88',
                }}
              />
            </div>
          </div>
          <div className={styles.frequencyBar}>
            <div className={styles.barLabel}>High</div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{
                  width: `${highs * 100}%`,
                  backgroundColor: '#00ffff',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioToggle;
