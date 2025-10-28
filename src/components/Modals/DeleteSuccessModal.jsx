import React from 'react';
import styles from './DeleteSuccessModal.module.scss';
import sharedStyles from '../../styles/shared.module.scss';

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
            💥
          </div>
          <p className={styles.modalMessage}>
            "{sceneName}" has been obliterated from existence.
          </p>
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

export default DeleteSuccessModal;