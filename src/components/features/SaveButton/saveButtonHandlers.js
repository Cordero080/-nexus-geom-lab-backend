/**
 * 🏭 FACTORY FUNCTION - Creates save handlers for SaveButton
 * 
 *RECEIVES: Config object with functions and data
// ⬇️ RETURNS: Async function that executes entire save flow

 * FLOW STEP 2: After user clicks Save button → This handles the actual save logic
 *
 * Used in SaveButton.jsx as:
 *   const handleSave = createSaveHandler({ ...dependencies });
 *   <button onClick={handleSave}>Save</button>
 *
 * WHAT IT DOES:
 * 1. Prompts user for scene name
 * 2. Calls API to save scene (→ sceneApi.jsx → backend)
 * 3. Updates unlocked noetechs in AuthContext
 * 4. Navigates to /scenes page
 *
 * WHY A FACTORY: Keeps SaveButton.jsx clean by separating business logic
 */
export const createSaveHandler = ({
  token,
  saveScene,
  addUnlockedNoetechs, // Pass: context update function
  navigate,
  setIsSaving, // Pass: state setter for button
  sceneConfig, // Pass: scene data to save
  onSuccess,
}) => {
  return async () => {
    // Note: Authentication is guaranteed by route protection in App.jsx
    // Users can only access GeomLab if authenticated

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

      // Call API     await saveScene = sends data to backend and gets response
      const response = await saveScene(sceneData, token);

      // Handle unlocked noetechs
      if (response.unlockedNoetechs && response.unlockedNoetechs.length > 0) {
        try {
          addUnlockedNoetechs(response.unlockedNoetechs);
        } catch (err) {
          // Silently fail if context update fails
        }
      }

      // Show success modal (passed from component)
      if (onSuccess) {
        onSuccess({
          title: name,
          unlockedNoetechs: response.unlockedNoetechs || [],
        });
      } else {
        // Fallback to alert for backward compatibility
        let message = `"${name}" saved successfully!`;
        if (response.unlockedNoetechs && response.unlockedNoetechs.length > 0) {
          message += `\n\nUnlocked: ${response.unlockedNoetechs.join(", ")}!`;
        }
        alert(message);
      }

      // Navigate to scenes page with highlight
      const savedSceneId = response.scene?.id || response.id;
      navigate("/scenes", { state: { highlightSceneId: savedSceneId } });
    } catch (error) {
      alert(`Failed to save scene: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
};
