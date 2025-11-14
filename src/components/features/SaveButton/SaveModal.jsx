import ScrambleButton from '../../ui/ScrambleButton/ScrambleButton';
import sharedStyles from '../../../styles/shared.module.scss';

export default function SaveModal({
  isOpen,
  onClose,
  sceneName,
  newSceneName,
  setNewSceneName,
  currentSceneId,
  canUpdate,
  isSaving,
  isLoading,
  onSave,
  onSaveAsNew,
}) {
  if (!isOpen) return null;

  return (
    <div className="save-modal-overlay" onClick={onClose}>
      <div className="save-modal" onClick={(e) => e.stopPropagation()}>
        <button className="save-modal__close" onClick={onClose}>
          ✕
        </button>
        <h2 className="save-modal__title">Save Scene</h2>

        {!currentSceneId && (
          <div className="save-modal__input-group">
            <label htmlFor="scene-name">Scene Name:</label>
            <input
              id="scene-name"
              type="text"
              className={`save-modal__input holographic-input ${sharedStyles.angledCorners}`}
              value={newSceneName}
              onChange={(e) => setNewSceneName(e.target.value)}
              placeholder="Enter scene name..."
              autoFocus
            />
          </div>
        )}

        {currentSceneId && (
          <div className="save-modal__info">
            <p className="save-modal__current-name">
              Current: <strong>{sceneName}</strong>
            </p>
          </div>
        )}

        <div className="save-modal__actions">
          {canUpdate && (
            <ScrambleButton variant="primary" onClick={onSave} className="save-modal__btn">
              {isSaving ? 'Updating...' : isLoading ? 'Loading...' : 'Save (Update)'}
            </ScrambleButton>
          )}

          {currentSceneId && (
            <div className="save-modal__save-as-new-section">
              <input
                type="text"
                className={`save-modal__input holographic-input ${sharedStyles.angledCorners}`}
                value={newSceneName}
                onChange={(e) => setNewSceneName(e.target.value)}
                placeholder="New scene name..."
              />
              <ScrambleButton variant="secondary" onClick={onSaveAsNew} className="save-modal__btn">
                {isSaving ? 'Creating...' : isLoading ? 'Loading...' : 'Save As New'}
              </ScrambleButton>
            </div>
          )}

          {!currentSceneId && (
            <ScrambleButton variant="primary" onClick={onSaveAsNew} className="save-modal__btn">
              {isSaving ? 'Saving...' : isLoading ? 'Loading...' : 'Save Scene'}
            </ScrambleButton>
          )}
        </div>

        <div className="save-modal__hint">
          {currentSceneId && canUpdate
            ? 'Tip: Use "Save" to update, or "Save As New" to create a copy'
            : currentSceneId
              ? 'Tip: Save as a new scene in your collection'
              : 'Tip: Create your first scene'}
        </div>
      </div>
    </div>
  );
}
