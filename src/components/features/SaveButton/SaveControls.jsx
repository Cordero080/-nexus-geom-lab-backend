import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { useScene } from '../../../context/SceneContext';
import { saveScene, updateScene } from '../../../services/sceneApi';
import ScrambleButton from '../../ui/ScrambleButton/ScrambleButton';
import SaveModal from './SaveModal';
import UnlockModal from './UnlockModal';
import AnimationUnlockModal from './AnimationUnlockModal';
import SuccessSaveModal from './SuccessSaveModal';
import styles from './SaveButton.module.scss';

/**
 * SaveControls Component - Handles saving scenes
 * Modes: 1) Save - Update existing, 2) Save As New - Create copy
 */
function SaveControls({ sceneConfig }) {
  const { token, isAuthenticated, addUnlockedNoetechs, addUnlockedAnimations, user, isLoading } =
    useAuth();
  const navigate = useNavigate();
  const { currentSceneId, sceneName, isOwnScene } = useScene();
  const unlockAudioRef = useRef(null);

  // Local state
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newSceneName, setNewSceneName] = useState('');
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockedNoetechs, setUnlockedNoetechs] = useState([]);
  const [showAnimationUnlockModal, setShowAnimationUnlockModal] = useState(false);
  const [unlockedAnimations, setUnlockedAnimations] = useState([]);
  const [showSuccessSaveModal, setShowSuccessSaveModal] = useState(false);
  const [savedSceneName, setSavedSceneName] = useState('');
  const [savedSceneId, setSavedSceneId] = useState(null);

  // Preload unlock audio on mount
  useEffect(() => {
    unlockAudioRef.current = new Audio('/soundEffects/unlock.wav');
    unlockAudioRef.current.volume = 0.5;
  }, []);

  // Play unlock sound effect
  const playUnlockSound = () => {
    try {
      if (unlockAudioRef.current) {
        unlockAudioRef.current.currentTime = 0;
        unlockAudioRef.current.play().catch((err) => {
          console.log('Audio play failed:', err);
        });
      }
    } catch (err) {
      console.log('Audio play error:', err);
    }
  };

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
        config: sceneConfig,
      };

      // Call API to update existing scene
      const response = await updateScene(currentSceneId, sceneData, token);

      // Handle unlocked animations if any
      if (response.unlockedAnimations && response.unlockedAnimations.length > 0) {
        try {
          addUnlockedAnimations(response.unlockedAnimations);
          setUnlockedAnimations(response.unlockedAnimations);
        } catch (e) {
          // Silently handle animation unlock errors
        }
      }

      // Handle unlocked noetechs if any (legacy support)
      if (response.unlockedNoetechs && response.unlockedNoetechs.length > 0) {
        try {
          addUnlockedNoetechs(response.unlockedNoetechs);
          setUnlockedNoetechs(response.unlockedNoetechs);
        } catch (e) {
          // Silently handle noetech unlock errors
        }
      }

      // Close save modal
      handleCloseModal();

      // Show animation unlock modal if animations were unlocked
      if (response.unlockedAnimations && response.unlockedAnimations.length > 0) {
        setUnlockedAnimations(response.unlockedAnimations);
        setSavedSceneId(currentSceneId);
        playUnlockSound();
        setShowAnimationUnlockModal(true);
      } else if (response.unlockedNoetechs && response.unlockedNoetechs.length > 0) {
        setUnlockedNoetechs(response.unlockedNoetechs);
        setSavedSceneId(currentSceneId);
        playUnlockSound();
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
        config: sceneConfig,
      };

      // Call API to save as new scene
      const response = await saveScene(sceneData, token);

      // Handle unlocked animations if any
      if (response.unlockedAnimations && response.unlockedAnimations.length > 0) {
        try {
          addUnlockedAnimations(response.unlockedAnimations);
          setUnlockedAnimations(response.unlockedAnimations);
        } catch (e) {
          // Silently handle animation unlock errors
        }
      }

      // Handle unlocked noetechs if any (legacy support)
      if (response.unlockedNoetechs && response.unlockedNoetechs.length > 0) {
        try {
          addUnlockedNoetechs(response.unlockedNoetechs);
          setUnlockedNoetechs(response.unlockedNoetechs);
        } catch (e) {
          // Silently handle noetech unlock errors
        }
      }

      // Close save modal
      handleCloseModal();

      // Show animation unlock modal if animations were unlocked
      if (response.unlockedAnimations && response.unlockedAnimations.length > 0) {
        setUnlockedAnimations(response.unlockedAnimations);
        const newSceneId = response.scene._id || response.scene.id;
        setSavedSceneId(newSceneId);
        playUnlockSound();
        setShowAnimationUnlockModal(true);
      } else if (response.unlockedNoetechs && response.unlockedNoetechs.length > 0) {
        setUnlockedNoetechs(response.unlockedNoetechs);
        const newSceneId = response.scene._id || response.scene.id;
        setSavedSceneId(newSceneId);
        playUnlockSound();
        setShowUnlockModal(true);
      } else {
        // Show success save modal if no unlocks
        setSavedSceneName(name);
        const newSceneId = response.scene._id || response.scene.id;
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
          {isSaving ? 'Saving...' : 'Save'}
        </ScrambleButton>
      </div>

      {/* Modals */}
      <SaveModal
        isOpen={showModal}
        onClose={handleCloseModal}
        sceneName={sceneName}
        newSceneName={newSceneName}
        setNewSceneName={setNewSceneName}
        currentSceneId={currentSceneId}
        canUpdate={canUpdate}
        isSaving={isSaving}
        isLoading={isLoading}
        onSave={handleSave}
        onSaveAsNew={handleSaveAsNew}
      />

      <UnlockModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        unlockedNoetechs={unlockedNoetechs}
        savedSceneId={savedSceneId}
      />

      <AnimationUnlockModal
        isOpen={showAnimationUnlockModal}
        onClose={() => setShowAnimationUnlockModal(false)}
        unlockedAnimations={unlockedAnimations}
        savedSceneId={savedSceneId}
      />

      <SuccessSaveModal
        isOpen={showSuccessSaveModal}
        onClose={() => setShowSuccessSaveModal(false)}
        savedSceneName={savedSceneName}
        savedSceneId={savedSceneId}
      />
    </>
  );
}

export default SaveControls;
