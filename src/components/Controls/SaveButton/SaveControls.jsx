import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext";
import { useScene } from "../../../context/SceneContext";
import { saveScene, updateScene } from "../../../services/sceneApi";
import ScrambleButton from '../../ScrambleButton/ScrambleButton';
import styles from "./SaveButton.module.scss";
import sharedStyles from "../../../styles/shared.module.scss";

/**
 * SaveControls Component
 * 
 * Handles saving scenes with two modes:
 * 1. "Save" - Update existing scene (only if user owns it)
 * 2. "Save As New" - Create a new copy (always available)
 * 
 * Props: sceneConfig (object with all scene settings), textColor (optional custom color)
 */
function SaveControls({ sceneConfig, textColor }) {
  const { token, isAuthenticated, addUnlockedNoetechs, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { currentSceneId, sceneName, isOwnScene } = useScene();

  // Local state
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newSceneName, setNewSceneName] = useState('');
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockedNoetechs, setUnlockedNoetechs] = useState([]);
  const [showSuccessSaveModal, setShowSuccessSaveModal] = useState(false);
  const [savedSceneName, setSavedSceneName] = useState('');
  const [savedSceneId, setSavedSceneId] = useState(null);

  // Check if user owns the currently loaded scene
  const canUpdate = currentSceneId && isOwnScene(user?.id);

  // Handle opening the save modal
  const handleOpenModal = () => {
    if (!isAuthenticated) {
      alert('Brilliant work! but... you must log in (To save)');
      return;
    }
    
    // Pre-fill with current scene name if editing
    setNewSceneName(canUpdate ? sceneName : '');
    setShowModal(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setShowModal(false);
    setNewSceneName('');
  };

  /**
   * Save - Update existing scene
   * Only available if user owns the scene
   */
  const handleSave = async () => {
    // Check if auth is still loading
    if (isLoading) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated || !token) {
      alert('Please log in to save scenes');
      navigate('/login');
      return;
    }

    if (!canUpdate) {
      alert('You cannot update a scene you do not own.');
      return;
    }

    setIsSaving(true);

    try {
      // Prepare scene data for update
      const sceneData = {
        name: sceneName, // Keep existing name
        description: '', // Could expand to include description editing
        config: sceneConfig
      };

      // Call API to update existing scene
      const result = await updateScene(currentSceneId, sceneData, token);
      
      // Handle unlocked noetechs if any
      if (result.unlockedNoetechs && result.unlockedNoetechs.length > 0) {
        try {
          addUnlockedNoetechs(result.unlockedNoetechs);
          setUnlockedNoetechs(result.unlockedNoetechs);
        } catch (e) {
          // Silently handle noetech unlock errors
        }
      }
      
      // Close save modal
      handleCloseModal();
      
      // Show unlock modal if noetechs were unlocked
      if (result.unlockedNoetechs && result.unlockedNoetechs.length > 0) {
        setUnlockedNoetechs(result.unlockedNoetechs);
        setSavedSceneId(currentSceneId);
        setShowUnlockModal(true);
      } else {
        // Show success save modal if no unlocks
        setSavedSceneName(sceneName);
        setSavedSceneId(currentSceneId);
        setShowSuccessSaveModal(true);
      }

    } catch (error) {
      alert(`Failed to update scene: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Save As New - Create a new copy
   * Available for all scenes (owned or remixed)
   */
  const handleSaveAsNew = async () => {
    // Check if auth is still loading
    if (isLoading) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated || !token) {
      alert('Please log in to save scenes');
      navigate('/login');
      return;
    }

    // Validate name input
    const name = newSceneName.trim();
    if (!name) {
      alert('Please enter a name for your scene');
      return;
    }

    setIsSaving(true);

    try {
      
      // Prepare scene data for new scene
      const sceneData = {
        name: name,
        description: '',
        config: sceneConfig
      };

      // Call API to save as new scene
      const result = await saveScene(sceneData, token);

      
      // Handle unlocked noetechs if any
      if (result.unlockedNoetechs && result.unlockedNoetechs.length > 0) {
        try {
          addUnlockedNoetechs(result.unlockedNoetechs);
          setUnlockedNoetechs(result.unlockedNoetechs);
        } catch (e) {
        }
      }
      
      // Close save modal
      handleCloseModal();
      
      // Show unlock modal if noetechs were unlocked
      if (result.unlockedNoetechs && result.unlockedNoetechs.length > 0) {
        setUnlockedNoetechs(result.unlockedNoetechs);
        const newSceneId = result.scene._id || result.scene.id;
        setSavedSceneId(newSceneId);
        setShowUnlockModal(true);
      } else {
        // Show success save modal if no unlocks
        setSavedSceneName(name);
        const newSceneId = result.scene._id || result.scene.id;
        setSavedSceneId(newSceneId);
        setShowSuccessSaveModal(true);
      }

    } catch (error) {
      alert(`Failed to save scene: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Main Save Button */}
      <div className={styles.saveButtonContainer}>
        <ScrambleButton
          onClick={handleOpenModal}
          variant="primary"
          className={`${styles.saveButton} ${isSaving ? styles.saving : ''}`}
        >
          {isSaving ? 'Saving...' : 'Save Scene'}
        </ScrambleButton>
      </div>

      {/* Save Modal */}
      {showModal && (
        <div className="save-modal-overlay" onClick={handleCloseModal}>
          <div className="save-modal" onClick={(e) => e.stopPropagation()}>
            <button className="save-modal__close" onClick={handleCloseModal}>
              ✕
            </button>
            
            <h2 className="save-modal__title">Save Scene</h2>
            
            {/* Fresh scene - just show name input */}
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

            {/* Editing existing scene - show current name */}
            {currentSceneId && (
              <div className="save-modal__info">
                <p className="save-modal__current-name">
                  Current: <strong>{sceneName}</strong>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="save-modal__actions">
              {/* Save (Update) - Only if user owns the scene */}
              {canUpdate && (
                <ScrambleButton
                  variant="primary"
                  onClick={handleSave}
                  className="save-modal__btn"
                >
                  {isSaving ? 'Updating...' : isLoading ? 'Loading...' : 'Save (Update)'}
                </ScrambleButton>
              )}

              {/* Save As New - Only if editing an existing scene (own or someone else's) */}
              {currentSceneId && (
                <div className="save-modal__save-as-new-section">
                  <input
                    type="text"
                    className={`save-modal__input holographic-input ${sharedStyles.angledCorners}`}
                    value={newSceneName}
                    onChange={(e) => setNewSceneName(e.target.value)}
                    placeholder="New scene name..."
                  />
                  <ScrambleButton
                    variant="secondary"
                    onClick={handleSaveAsNew}
                    className="save-modal__btn"
                  >
                    {isSaving ? 'Creating...' : isLoading ? 'Loading...' : 'Save As New'}
                  </ScrambleButton>
                </div>
              )}

              {/* Fresh scene - just Save button */}
              {!currentSceneId && (
                <ScrambleButton
                  variant="primary"
                  onClick={handleSaveAsNew}
                  className="save-modal__btn"
                >
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
      )}

      {/* Noetech Unlock Modal */}
      {showUnlockModal && (
        <div className="save-modal-overlay unlock-modal-overlay" onClick={() => {
          setShowUnlockModal(false);
          navigate('/scenes', { state: { highlightSceneId: savedSceneId } });
        }}>
          <div className="save-modal unlock-modal" onClick={(e) => e.stopPropagation()}>
            <div className="unlock-modal__content">
              <div className="unlock-modal__icon">⬡</div>
              <h2 className="unlock-modal__title">Noetech Unlocked!</h2>
              <div className="unlock-modal__noetechs">
                {unlockedNoetechs.map((noetech, index) => (
                  <div key={index} className="unlock-modal__noetech-name">
                    {noetech.toUpperCase()}
                  </div>
                ))}
              </div>
              <p className="unlock-modal__message">
                You can now view this in the showcase!
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
                    setShowUnlockModal(false);
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
      )}

      {/* Success Save Modal */}
      {showSuccessSaveModal && (
        <div className="save-modal-overlay unlock-modal-overlay" onClick={() => {
          setShowSuccessSaveModal(false);
          navigate('/scenes', { state: { highlightSceneId: savedSceneId } });
        }}>
          <div className="save-modal unlock-modal" onClick={(e) => e.stopPropagation()}>
            <div className="unlock-modal__content">
              <div className="unlock-modal__icon">⬢</div>
              <h2 className="unlock-modal__title">Scene Saved!</h2>
              <div className="unlock-modal__noetechs">
                <div className="unlock-modal__noetech-name">
                  {savedSceneName.toUpperCase()}
                </div>
              </div>
              <p className="unlock-modal__message">
                Your masterpiece has been saved successfully!
              </p>
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
                  onClick={() => {
                    setShowSuccessSaveModal(false);
                    // Stay on current page
                  }}
                  className="save-modal__btn"
                >
                  Continue Creating
                </ScrambleButton>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default SaveControls;
