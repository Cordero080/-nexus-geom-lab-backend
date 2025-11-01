import React from 'react';
import styles from './SuccessModal.module.scss';
import sharedStyles from '../../styles/shared.module.scss';

const SuccessModal = ({ isOpen, onClose, title, message, unlockedNoetechs = [] }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            "{title}" Saved Successfully!
          </h2>
          <button 
            className={`${styles.closeButton} ${sharedStyles.angledCorners}`} 
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className={styles.modalContent}>
          {message && (
            <p className={styles.modalMessage}>{message}</p>
          )}
          
          {unlockedNoetechs.length > 0 && (
            <div className={styles.unlockedSection}>
              <h3 className={styles.unlockedTitle}>🎉 New Noetechs Unlocked!</h3>
              <div className={styles.unlockedList}>
                {unlockedNoetechs.map((noetech, index) => (
                  <span key={index} className={styles.unlockedItem}>
                    {noetech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            className={`${styles.confirmButton} ${sharedStyles.angledCorners}`}
            onClick={onClose}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;