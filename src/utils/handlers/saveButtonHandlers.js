/**
 * Handler factory for SaveButton save action
 * Separated from component for testability and reusability
 */

/**
 * Creates a save handler with all dependencies injected
 * @param {Object} deps - Dependencies object
 * @param {boolean} deps.isAuthenticated - Auth state
 * @param {string} deps.token - Auth token
 * @param {Function} deps.saveScene - API function to save scene
 * @param {Function} deps.addUnlockedNoetechs - Function to update unlocked noetechs
 * @param {Function} deps.navigate - React Router navigate function
 * @param {Function} deps.setIsSaving - State setter for saving status
 * @param {Object} deps.sceneConfig - Scene configuration object
 * @returns {Function} Async save handler
 */
export const createSaveHandler = ({
  isAuthenticated,
  token,
  saveScene,
  addUnlockedNoetechs,
  navigate,
  setIsSaving,
  sceneConfig,
  onSuccess,
}) => {
  return async () => {
    // Guard: Check authentication
    if (!isAuthenticated) {
      alert("Brilliant work! but... you must log in (To save)");
      return;
    }

    // Prompt for scene name
    const name = prompt("Name your masterpiece:");
    if (!name || name.trim() === "") {
      return;
    }

    // Begin save process
    setIsSaving(true);

    try {
      // Prepare scene data
      const sceneData = {
        name: name.trim(),
        description: "",
        config: sceneConfig,
      };

      // Call API
      const result = await saveScene(sceneData, token);

      // Handle unlocked noetechs
      if (result.unlockedNoetechs && result.unlockedNoetechs.length > 0) {
        try {
          addUnlockedNoetechs(result.unlockedNoetechs);
        } catch (err) {
          // Silently fail if context update fails
        }
      }

      // Show success modal (passed from component)
      if (onSuccess) {
        onSuccess({
          title: name,
          unlockedNoetechs: result.unlockedNoetechs || [],
        });
      } else {
        // Fallback to alert for backward compatibility
        let message = `"${name}" saved successfully!`;
        if (result.unlockedNoetechs && result.unlockedNoetechs.length > 0) {
          message += `\n\nUnlocked: ${result.unlockedNoetechs.join(", ")}!`;
        }
        alert(message);
      }

      // Navigate to scenes page with highlight
      const savedSceneId = result.scene?.id || result.id;
      navigate("/scenes", { state: { highlightSceneId: savedSceneId } });
    } catch (error) {
      alert(`Failed to save scene: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
};
