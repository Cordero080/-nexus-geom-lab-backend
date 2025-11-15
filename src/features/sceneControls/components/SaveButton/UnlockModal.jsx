// 📁 FILE: UnlockModal.jsx
// ⬆️ RECEIVES: isOpen={true}, unlockedNoetechs=['icarus-x']
// ⬇️ RENDERS: Modal with unlock notification

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrambleButton from '@/components/ui/ScrambleButton/ScrambleButton';

export default function UnlockModal({ isOpen, onClose, unlockedNoetechs, savedSceneId }) {
  const navigate = useNavigate();

  // Play unlock sound effect when modal opens
  useEffect(() => {
    if (isOpen) {
      const audio = new Audio('/soundEffects/unlock.wav');
      audio.volume = 0.5; // Set volume to 50%
      audio.play().catch((err) => {
        console.log('Audio play failed:', err);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;
  // ↑ If modal not open, render nothing

  const handleClose = () => {
    onClose();
    navigate('/scenes', { state: { highlightSceneId: savedSceneId } });
  };

  return (
    <div className="save-modal-overlay unlock-modal-overlay" onClick={handleClose}>
      <div className="save-modal unlock-modal" onClick={(e) => e.stopPropagation()}>
        <div className="unlock-modal__content">
          <div className="unlock-modal__icon">⬡</div>
          <h2 className="unlock-modal__title">¡Noetech Unlocked!</h2>
          <div className="unlock-modal__noetechs">
            {unlockedNoetechs.map((noetech, index) => (
              <div key={index} className="unlock-modal__noetech-name">
                {noetech.toUpperCase()}
              </div>
            ))}
          </div>
          {/* ↑ Shows: "ICARUS-X" */}
          <p className="unlock-modal__message">¡You can now view this in the showcase!</p>
          <div className="unlock-modal__actions">
            <ScrambleButton
              variant="primary"
              onClick={() => navigate('/showcase')}
              className="save-modal__btn"
            >
              View Showcase
            </ScrambleButton>
            <ScrambleButton variant="secondary" onClick={handleClose} className="save-modal__btn">
              View My Scenes
            </ScrambleButton>
          </div>
        </div>
      </div>
    </div>
  );
}
