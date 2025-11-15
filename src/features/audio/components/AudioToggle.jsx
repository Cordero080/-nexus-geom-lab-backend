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
        <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {isActive ? (
            <>
              {/* Speaker cone */}
              <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor" />
              {/* Sound waves - animate with audio */}
              <path d="M15 9C16.5 10.5 16.5 13.5 15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity={hasAudio ? 0.6 + bass * 0.4 : 0.4} />
              <path d="M18 7C20 9 20 15 18 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity={hasAudio ? 0.6 + mids * 0.4 : 0.4} />
              <path d="M21 5C24 8 24 16 21 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity={hasAudio ? 0.6 + highs * 0.4 : 0.4} />
            </>
          ) : (
            <>
              {/* Muted speaker */}
              <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor" />
              <line x1="16" y1="9" x2="22" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="22" y1="9" x2="16" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
        </svg>
        <span className={styles.label}>
          {isActive ? (hasAudio ? 'DETECTING' : 'LISTENING') : 'AUDIO OFF'}
        </span>
      </button>

      {/* Vertical Equalizer (only when active) */}
      {isActive && (
        <div className={styles.visualizer}>
          <div className={styles.frequencyBar}>
            <div className={styles.barTrackVertical}>
              <div
                className={styles.barFillVertical}
                style={{
                  height: `${bass * 100}%`,
                  backgroundColor: '#ff0064',
                }}
              />
            </div>
            <div className={styles.barLabel}>Bass</div>
          </div>
          <div className={styles.frequencyBar}>
            <div className={styles.barTrackVertical}>
              <div
                className={styles.barFillVertical}
                style={{
                  height: `${mids * 100}%`,
                  backgroundColor: '#00ff88',
                }}
              />
            </div>
            <div className={styles.barLabel}>Mids</div>
          </div>
          <div className={styles.frequencyBar}>
            <div className={styles.barTrackVertical}>
              <div
                className={styles.barFillVertical}
                style={{
                  height: `${highs * 100}%`,
                  backgroundColor: '#00ffff',
                }}
              />
            </div>
            <div className={styles.barLabel}>High</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioToggle;
