import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useScene } from '../../../context/SceneContext';
import { saveScene } from '../../../services/sceneApi';
import { createSaveHandler } from '../../../utils/handlers/saveButtonHandlers';
import ScrambleButton from '../../ui/ScrambleButton/ScrambleButton';
import styles from './SaveButton.module.scss';

// Save button component - handles saving scenes to backend
// Props: sceneConfig (object with all scene settings), textColor (optional custom color)

function SaveButton ({ sceneConfig, textColor }) {
  const { token, isAuthenticated, addUnlockedNoetechs } = useAuth();
  const navigate = useNavigate();
  const { sceneName, setSceneName } = useScene();
  const [isSaving, setIsSaving] = useState(false);

  // Create save handler using factory from utils
  const handleSave = createSaveHandler({
    isAuthenticated,
    token,
    saveScene,
    addUnlockedNoetechs,
    navigate,
    setIsSaving,
    sceneConfig,
  });

  return (
    <div className={styles.saveButtonContainer}>
      <ScrambleButton
        onClick={handleSave}
        variant="primary"
        className={`${styles.saveButton} ${isSaving ? styles.saving : ''}`}
      >
        {isSaving ? 'Saving...' : 'Save Scene'}
      </ScrambleButton>
    </div>
  );
}

export default SaveButton;