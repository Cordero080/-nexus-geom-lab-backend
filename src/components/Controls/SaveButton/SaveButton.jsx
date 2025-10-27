import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useScene } from '../../../context/SceneContext';
import { saveScene } from '../../../services/sceneApi';
import './SaveButton.css';
import '../../../styles/shared.css';

// Save button component - handles saving scenes to backend
// Props: sceneConfig (object with all scene settings), textColor (optional custom color)

function SaveButton ({ sceneConfig, textColor }) {
  //get authentication state and token from AuthContext
  const { user, token, isAuthenticated } = useAuth();

  //get scene context functions and state
  const { sceneName, setSceneName } = useScene();
  //local state to track if we're currently saving
  const [ isSaving, setIsSaving] = useState(false);
  // Handle save button click
  const handleSave =  async () => {
    // Check id user is logged in first
    if (!isAuthenticated) {
      alert('Brilliant work! but... you must log in (To save)')
      return; // stop here if not logged in
    }

    //ask user for scene name
    const name = prompt('Name your masterpiece:');
    //if yser cancelled or entered empty name, stop
    if((!name || name.trim() === '')) {
      return;
    }
// start saving - show "Saving.." on button
setIsSaving(true);

try {
  //Prepare scene data to send to backend
  const sceneData = {
    name: name.trim(),
    description: '', // Optional, could add description prompt
    config: sceneConfig //All the 3D settings
  };
  // Call API to save scene
  const result = await saveScene(sceneData, token);

  //Success! show confirmation
  let message = `"${name}" saved successfully!`;
  // if any noetechs were unlocked, show them
  if (result.unlockedNoetechs && result.unlockedNoetechs.length > 0) {
    message += `\n\nUnlocked: ${result.unlockedNoetechs.join(', ')}!`;
  }
  alert(message);

} catch (error) {
  //Something went wrong --> show error
  alert(`Failed to save scene: ${error.message}`);
} finally {
  // Always stop the saving state (whether success or error)
  setIsSaving(false);
}

};

// Render the button
return (
  <button 
    onClick={handleSave}
    disabled={isSaving} // prevents button from being clicked multiple times
    className={`save-button angled-corners ${isSaving ? 'saving' : ''}`}
    style={textColor ? { color: textColor } : {}} // Apply custom text color if provided
  >
    <div className="beam-scan-effect"></div>
    {isSaving ? 'Saving...' : 'Save Scene'} 
  </button>
);
}

export default SaveButton;