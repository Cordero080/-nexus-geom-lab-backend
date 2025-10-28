import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext";
import { useScene } from "../../../context/SceneContext";
import { saveScene, updateScene } from "../../../services/sceneApi";
import ScrambleButton from '../../ScrambleButton/ScrambleButton';
import { SuccessModal } from '../../Modals';
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState({ title: '', unlockedNoetechs: [], sceneId: null });

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
      console.log('Auth still loading, please wait...');
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
      console.log('🔐 Updating with token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
      
      // Prepare scene data for update
      const sceneData = {
        name: sceneName, // Keep existing name
        description: '', // Could expand to include description editing
        config: sceneConfig
      };

      // Call API to update existing scene
      const result = await updateScene(currentSceneId, sceneData, token);

      console.log('Update result:', result);
      console.log('Unlocked Noetechs:', result.unlockedNoetechs);
      
      // Handle unlocked noetechs if any
      if (result.unlockedNoetechs && result.unlockedNoetechs.length > 0) {
        console.log('Setting unlocked noetechs:', result.unlockedNoetechs);
        try {
          addUnlockedNoetechs(result.unlockedNoetechs);
          setUnlockedNoetechs(result.unlockedNoetechs);
        } catch (e) {
          console.error('Error adding unlocked noetechs:', e);
        }
      }
      
      // Show success modal with unlock info
      setSuccessData({
        title: sceneName,
        unlockedNoetechs: result.unlockedNoetechs || [],
        sceneId: currentSceneId // Pass the scene ID for highlighting
      });
      setShowSuccessModal(true);

      // Close save modal
      handleCloseModal();
      
      // Show unlock modal if noetechs were unlocked (keep existing logic)
      if (result.unlockedNoetechs && result.unlockedNoetechs.length > 0) {
        console.log('Showing unlock modal');
        setShowUnlockModal(true);
      }
      
      // Note: Navigation now handled by success modal onClose

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
      console.log('Auth still loading, please wait...');
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
      console.log('🔐 Saving with token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
      
      // Prepare scene data for new scene
      const sceneData = {
        name: name,
        description: '',
        config: sceneConfig
      };

      // Call API to save as new scene
      const result = await saveScene(sceneData, token);

      console.log('Save result:', result);
      console.log('Unlocked Noetechs:', result.unlockedNoetechs);
      
      // Handle unlocked noetechs if any
      if (result.unlockedNoetechs && result.unlockedNoetechs.length > 0) {
        console.log('Setting unlocked noetechs:', result.unlockedNoetechs);
        try {
          addUnlockedNoetechs(result.unlockedNoetechs);
          setUnlockedNoetechs(result.unlockedNoetechs);
        } catch (e) {
          console.error('Error adding unlocked noetechs:', e);
        }
      }
      
      // Show success modal with unlock info
      setSuccessData({
        title: name,
        unlockedNoetechs: result.unlockedNoetechs || [],
        sceneId: result.scene._id || result.scene.id // Pass the newly created scene ID for highlighting
      });
      setShowSuccessModal(true);

      // Close save modal
      handleCloseModal();
      
      // Show unlock modal if noetechs were unlocked (keep existing logic)
      if (result.unlockedNoetechs && result.unlockedNoetechs.length > 0) {
        console.log('Showing unlock modal');
        setShowUnlockModal(true);
      }
      
      // Note: Navigation now handled by success modal onClose

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
                  className={`save-modal__input ${sharedStyles.angledCorners}`}
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
                    className={`save-modal__input ${sharedStyles.angledCorners}`}
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
          navigate('/scenes');
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
                    navigate('/scenes');
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

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          // Navigate to scenes page with highlight ID after closing success modal
          navigate('/scenes', { 
            state: { highlightSceneId: successData.sceneId } 
          });
        }}
        title={successData.title}
        unlockedNoetechs={successData.unlockedNoetechs}
      />
    </>
  );
}

export default SaveControls;
