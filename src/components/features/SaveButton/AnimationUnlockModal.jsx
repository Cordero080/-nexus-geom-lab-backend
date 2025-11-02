import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScrambleButton from "../../ui/ScrambleButton/ScrambleButton";

export default function AnimationUnlockModal({
  isOpen,
  onClose,
  unlockedAnimations,
  savedSceneId
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    navigate('/showcase');
  };

  return (
    <div className="save-modal-overlay unlock-modal-overlay" onClick={handleClose}>
      <div className="save-modal unlock-modal" onClick={(e) => e.stopPropagation()}>
        <div className="unlock-modal__content">
          <div className="unlock-modal__icon">🎭</div>
          <h2 className="unlock-modal__title">Animation Unlocked!</h2>
          <div className="unlock-modal__noetechs">
            {unlockedAnimations.map((animation, index) => (
              <div key={index} className="unlock-modal__noetech-name">
                {animation.noetechName.toUpperCase()}
              </div>
            ))}
          </div>
          <div className="unlock-modal__animation-details">
            {unlockedAnimations.map((animation, index) => (
              <div key={index} className="unlock-modal__animation-name">
                "{animation.animationName}"
              </div>
            ))}
          </div>
          <p className="unlock-modal__message">
            New animation now available for this Noetech in the showcase!
          </p>
          <div className="unlock-modal__actions">
            <ScrambleButton
              variant="primary"
              onClick={() => navigate('/showcase')}
              className="save-modal__btn"
            >
              View Showcase
            </ScrambleButton>
            <ScrambleButton
              variant="secondary"
              onClick={() => {
                onClose();
                navigate('/scenes', { state: { highlightSceneId: savedSceneId } });
              }}
              className="save-modal__btn"
            >
              View My Scenes
            </ScrambleButton>
          </div>
        </div>
      </div>
    </div>
  );
}
