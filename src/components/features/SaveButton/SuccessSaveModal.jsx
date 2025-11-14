import { useNavigate } from 'react-router-dom';
import ScrambleButton from '../../ui/ScrambleButton/ScrambleButton';

export default function SuccessSaveModal({ isOpen, onClose, savedSceneName, savedSceneId }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      className="save-modal-overlay unlock-modal-overlay"
      onClick={() => {
        onClose();
        navigate('/scenes', { state: { highlightSceneId: savedSceneId } });
      }}
    >
      <div className="save-modal unlock-modal" onClick={(e) => e.stopPropagation()}>
        <div className="unlock-modal__content">
          <div className="unlock-modal__icon">⬢</div>
          <h2 className="unlock-modal__title">Scene Saved!</h2>
          <div className="unlock-modal__noetechs">
            <div className="unlock-modal__noetech-name">{savedSceneName.toUpperCase()}</div>
          </div>
          <p className="unlock-modal__message">Your masterpiece has been saved successfully!</p>
          <div className="unlock-modal__actions">
            <ScrambleButton
              variant="primary"
              onClick={() => navigate('/scenes', { state: { highlightSceneId: savedSceneId } })}
              className="save-modal__btn"
            >
              View My Scenes
            </ScrambleButton>
            <ScrambleButton
              variant="secondary"
              onClick={() => onClose()}
              className="save-modal__btn"
            >
              Continue Creating
            </ScrambleButton>
          </div>
        </div>
      </div>
    </div>
  );
}
