import React from 'react';
import styles from './DeleteSuccessModal.module.scss';
import sharedStyles from '../../../styles/shared.module.scss';
import ScrambleButton from '../ScrambleButton/ScrambleButton';

const DeleteSuccessModal = ({ isOpen, onClose, sceneName }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            DESTROYED!
          </h2>
          <button 
            className={`${styles.closeButton} ${sharedStyles.angledCorners}`} 
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.destructionEffect}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Explosion center */}
              <circle cx="32" cy="32" r="8" fill="#ff4444" opacity="0.9"/>
              {/* Explosion rays */}
              <path d="M32 4 L36 16 L32 24 L28 16 Z" fill="#ff6600" opacity="0.8"/>
              <path d="M60 32 L48 36 L40 32 L48 28 Z" fill="#ff6600" opacity="0.8"/>
              <path d="M32 60 L28 48 L32 40 L36 48 Z" fill="#ff6600" opacity="0.8"/>
              <path d="M4 32 L16 28 L24 32 L16 36 Z" fill="#ff6600" opacity="0.8"/>
              {/* Diagonal rays */}
              <path d="M52 12 L44 20 L36 16 L44 8 Z" fill="#ffaa00" opacity="0.7"/>
              <path d="M52 52 L44 44 L48 36 L56 44 Z" fill="#ffaa00" opacity="0.7"/>
              <path d="M12 52 L20 44 L28 48 L20 56 Z" fill="#ffaa00" opacity="0.7"/>
              <path d="M12 12 L20 20 L16 28 L8 20 Z" fill="#ffaa00" opacity="0.7"/>
              {/* Particles */}
              <circle cx="20" cy="20" r="2" fill="#ff9900" opacity="0.6"/>
              <circle cx="44" cy="20" r="2" fill="#ff9900" opacity="0.6"/>
              <circle cx="44" cy="44" r="2" fill="#ff9900" opacity="0.6"/>
              <circle cx="20" cy="44" r="2" fill="#ff9900" opacity="0.6"/>
              <circle cx="12" cy="32" r="1.5" fill="#ffcc00" opacity="0.5"/>
              <circle cx="52" cy="32" r="1.5" fill="#ffcc00" opacity="0.5"/>
              <circle cx="32" cy="12" r="1.5" fill="#ffcc00" opacity="0.5"/>
              <circle cx="32" cy="52" r="1.5" fill="#ffcc00" opacity="0.5"/>
            </svg>
          </div>
          <p className={styles.modalMessage}>
            "{sceneName}" has been deleted.
          </p>
        </div>
        
        <div className={styles.modalFooter}>
          <ScrambleButton
            className={`${styles.confirmButton} ${sharedStyles.angledCorners}`}
            onClick={onClose}
            variant="danger"
          >
            Continue
          </ScrambleButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteSuccessModal;