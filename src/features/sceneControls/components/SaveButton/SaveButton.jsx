// 📁 FILE: SaveButton.jsx
// 🔄 Save button component in GeomLab interface
// ⬆️ RECEIVES: sceneConfig (PROP - object with all control values from App.jsx)
// ⬇️ RENDERS: Save button that triggers save flow when clicked

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { saveScene } from '../../../services/sceneApi';
import { createSaveHandler } from './saveButtonHandlers';
import ScrambleButton from '@/components/ui/ScrambleButton/ScrambleButton';
import styles from './SaveButton.module.scss';

function SaveButton({ sceneConfig }) {
  const { token, addUnlockedNoetechs } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // Create save handler using factory from utils
  const handleSave = createSaveHandler({
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
        {isSaving ? 'Saving...' : 'Save'}
      </ScrambleButton>
    </div>
  );
}

export default SaveButton;

// 1. ------This component's ONLY job:
// Render a button and trigger save flow

// 2. ------It doesn't do the actual saving:
//  That's delegated to `createSaveHandler`

// 3. ------It gets auth data from context:
// `useAuth()` hook

// 4. ------It manages button loading state:** `isSaving` toggles button text

// ----------🔴 WHAT HAPPENS WHEN USER CLICKS:**
// ```
// User clicks button
//     ↓
// onClick={handleSave} triggers
//     ↓
// handleSave() function executes
//     ↓
// [NEXT FILE: saveButtonHandlers.js
