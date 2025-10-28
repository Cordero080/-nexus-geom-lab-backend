import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useScene } from '../../../context/SceneContext';
import { saveScene, updateScene } from '../../../services/sceneApi';
import './SaveButton.css';
import '../../../styles/shared.css';

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
      
      alert(`"${sceneName}" updated successfully!`);

      // Close modal and navigate
      handleCloseModal();
      
      // Show unlock modal if noetechs were unlocked
      if (result.unlockedNoetechs && result.unlockedNoetechs.length > 0) {
        console.log('Showing unlock modal');
        setShowUnlockModal(true);
      } else {
        console.log('No unlocks, navigating to scenes');
        const savedSceneId = result.scene?._id || result.scene?.id || result._id || result.id || currentSceneId;
        navigate('/scenes', { state: { highlightSceneId: savedSceneId } });
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
      
      alert(`"${name}" saved successfully!`);

      // Close modal
      handleCloseModal();
      
      // Show unlock modal if noetechs were unlocked
      if (result.unlockedNoetechs && result.unlockedNoetechs.length > 0) {
        console.log('Showing unlock modal');
        setShowUnlockModal(true);
      } else {
        console.log('No unlocks, navigating to scenes');
        const savedSceneId = result.scene?._id || result.scene?.id || result._id || result.id;
        navigate('/scenes', { state: { highlightSceneId: savedSceneId } });
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
      <button 
        onClick={handleOpenModal}
        disabled={isSaving}
        className={`save-button angled-corners ${isSaving ? 'saving' : ''}`}
        style={textColor ? { color: textColor } : {}}
      >
        <div className="beam-scan-effect"></div>
        {isSaving ? 'Saving...' : 'Save Scene'}
      </button>

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
                  className="save-modal__input angled-corners"
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
                <button
                  className="save-modal__btn save-modal__btn--save angled-corners"
                  onClick={handleSave}
                  disabled={isSaving || isLoading}
                >
                  {isSaving ? 'Updating...' : isLoading ? 'Loading...' : 'Save (Update)'}
                </button>
              )}

              {/* Save As New - Only if editing an existing scene (own or someone else's) */}
              {currentSceneId && (
                <div className="save-modal__save-as-new-section">
                  <input
                    type="text"
                    className="save-modal__input angled-corners"
                    value={newSceneName}
                    onChange={(e) => setNewSceneName(e.target.value)}
                    placeholder="New scene name..."
                  />
                  <button
                    className="save-modal__btn save-modal__btn--save-as-new angled-corners"
                    onClick={handleSaveAsNew}
                    disabled={isSaving || isLoading || !newSceneName.trim()}
                  >
                    {isSaving ? 'Creating...' : isLoading ? 'Loading...' : 'Save As New'}
                  </button>
                </div>
              )}

              {/* Fresh scene - just Save button */}
              {!currentSceneId && (
                <button
                  className="save-modal__btn save-modal__btn--save angled-corners"
                  onClick={handleSaveAsNew}
                  disabled={isSaving || isLoading || !newSceneName.trim()}
                >
                  {isSaving ? 'Saving...' : isLoading ? 'Loading...' : 'Save Scene'}
                </button>
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
                <button
                  className="save-modal__btn save-modal__btn--save angled-corners"
                  onClick={() => navigate('/showcase')}
                >
                  View Showcase
                </button>
                <button
                  className="save-modal__btn save-modal__btn--cancel angled-corners"
                  onClick={() => {
                    setShowUnlockModal(false);
                    navigate('/scenes');
                  }}
                >
                  View My Scenes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SaveControls;
