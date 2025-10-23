import React, { createContext, useContext, useState, useCallback } from "react";

/**
 * Scene Context - Manages scene state across the application
 * 
 * Tracks:
 * - Current scene ID and ownership
 * - Scene metadata (name, description, isPublic)
 * - Scene mode: fresh, loaded, or remixed
 * 
 * Provides:
 * - saveScene() - Save new or update existing scene
 * - loadScene() - Load scene into editor
 * - deleteScene() - Delete a scene
 * - resetScene() - Reset to fresh state
 */

const SceneContext = createContext(null);

export function SceneProvider({ children }) {
  // Scene state
  const [currentSceneId, setCurrentSceneId] = useState(null);
  const [sceneOwner, setSceneOwner] = useState(null); // User ID who owns the scene
  const [sceneName, setSceneName] = useState("");
  const [sceneDescription, setSceneDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  
  // Scene mode: 'fresh', 'loaded', 'remixed'
  const [sceneMode, setSceneMode] = useState("fresh");

  /**
   * Determine if current user owns the loaded scene
   * @param {string} currentUserId - ID of logged-in user
   * @returns {boolean}
   */
  const isOwnScene = useCallback(
    (currentUserId) => {
      return sceneOwner && sceneOwner === currentUserId;
    },
    [sceneOwner]
  );

  /**
   * Save scene (create new or update existing)
   * @param {Object} sceneData - Complete scene configuration
   * @param {string} userId - ID of user saving the scene
   * @param {string} token - JWT auth token
   * @returns {Promise<Object>} Saved scene data
   */
  const saveScene = useCallback(
    async (sceneData, userId, token) => {
      // TODO: Replace with actual API call when backend is ready
      console.log("💾 Saving scene:", sceneData);

      // Simulate API call
      const mockSavedScene = {
        id: currentSceneId || `scene_${Date.now()}`,
        userId: userId,
        name: sceneData.name,
        description: sceneData.description,
        isPublic: sceneData.isPublic,
        config: sceneData.config,
        createdAt: new Date().toISOString(),
        viewCount: 0,
        likeCount: 0,
      };

      // Update context state
      setCurrentSceneId(mockSavedScene.id);
      setSceneOwner(userId);
      setSceneName(mockSavedScene.name);
      setSceneDescription(mockSavedScene.description);
      setIsPublic(mockSavedScene.isPublic);
      setSceneMode("loaded");

      return mockSavedScene;

      /* 
      // Real implementation when backend is ready:
      const response = await fetch(`${API_URL}/scenes`, {
        method: currentSceneId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sceneData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save scene');
      }
      
      const savedScene = await response.json();
      setCurrentSceneId(savedScene.id);
      setSceneOwner(userId);
      setSceneName(savedScene.name);
      setSceneDescription(savedScene.description);
      setIsPublic(savedScene.isPublic);
      setSceneMode('loaded');
      
      return savedScene;
      */
    },
    [currentSceneId]
  );

  /**
   * Load scene into editor
   * @param {Object} scene - Scene data from API
   * @param {string} currentUserId - ID of logged-in user (null if not logged in)
   */
  const loadScene = useCallback((scene, currentUserId = null) => {
    console.log("📂 Loading scene:", scene);

    setCurrentSceneId(scene.id);
    setSceneOwner(scene.userId);
    setSceneName(scene.name);
    setSceneDescription(scene.description || "");
    setIsPublic(scene.isPublic);

    // Determine scene mode
    if (currentUserId && scene.userId === currentUserId) {
      setSceneMode("loaded"); // User is editing their own scene
    } else {
      setSceneMode("remixed"); // User is remixing someone else's scene
    }
  }, []);

  /**
   * Delete scene
   * @param {string} sceneId - ID of scene to delete
   * @param {string} token - JWT auth token
   * @returns {Promise<void>}
   */
  const deleteScene = useCallback(async (sceneId, token) => {
    // TODO: Replace with actual API call when backend is ready
    console.log("🗑️ Deleting scene:", sceneId);

    // If deleting current scene, reset context
    if (sceneId === currentSceneId) {
      resetScene();
    }

    /* 
    // Real implementation when backend is ready:
    const response = await fetch(`${API_URL}/scenes/${sceneId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete scene');
    }
    
    // If deleting current scene, reset context
    if (sceneId === currentSceneId) {
      resetScene();
    }
    */
  }, [currentSceneId]);

  /**
   * Reset to fresh state (new scene)
   */
  const resetScene = useCallback(() => {
    console.log("🆕 Resetting to fresh scene");

    setCurrentSceneId(null);
    setSceneOwner(null);
    setSceneName("");
    setSceneDescription("");
    setIsPublic(true);
    setSceneMode("fresh");
  }, []);

  const value = {
    // State
    currentSceneId,
    sceneOwner,
    sceneName,
    sceneDescription,
    isPublic,
    sceneMode,

    // Computed
    isOwnScene,

    // Actions
    saveScene,
    loadScene,
    deleteScene,
    resetScene,

    // Setters (for modal forms)
    setSceneName,
    setSceneDescription,
    setIsPublic,
  };

  return (
    <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
  );
}

/**
 * Hook to use Scene Context
 */
export function useScene() {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error("useScene must be used within a SceneProvider");
  }
  return context;
}
