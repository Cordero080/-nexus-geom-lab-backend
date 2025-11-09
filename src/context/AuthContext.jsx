/**
 * Context = React pattern for sharing state across many components without prop drilling.
 * AuthContext - Manages global auth state (user, token, unlocked animations) accessible from any component.
 * 
 * Access: const { isAuthenticated, login, logout, user, token } = useAuth();
 * 
 * Login Flow:
 *   1. login(email, password) → sceneApi.login() → POST /api/auth/login
 *   2. Backend verifies credentials → returns { token, user }
 *   3. Store in state (setUser, setToken) + localStorage
 * 
 * Save Scene Flow (with unlock system):
 *   1. SaveControls calls saveScene(sceneData, token)
 *   2. Backend verifies token (middleware/auth.js) → attaches req.user
 *   3. Backend saves scene → checks unlock criteria → may return 
 * // ⬆️  MAY RECEIVE: ['icarus-x'] from saveButtonHandlers.jsunlockedAnimations
 *   4. Frontend calls addUnlockedAnimations() → updates state + localStorage
 *   5. Shows UnlockModal with newly unlocked animations/noetechs
 * // ⬆️ RECEIVES: ['icarus-x'] from saveButtonHandlers.js
 */

import { signup as signupApi, login as loginApi } from '../services/sceneApi';
import React, { createContext, useContext, useState, useCallback } from "react";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // User state - starts as null (not authenticated)
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unlockedAnimations, setUnlockedAnimations] = useState([]);

  // Check if user is authenticated
  // !!user converts to boolean !!token converts to boolean
  const isAuthenticated = !!user && !!token;

  // Check if animation is unlocked for a specific noetech (e.g., "tesseract-pulse")
  const isAnimationUnlocked = useCallback((noetechKey, animationId) => {
    return unlockedAnimations.some(
      ua => ua.noetechKey === noetechKey && ua.animationId === animationId
    );
  }, [unlockedAnimations]);

  // Get list of all animations user has unlocked for a noetech (used in Showcase filters)
  const getUnlockedAnimationsForNoetech = useCallback((noetechKey) => {
    return unlockedAnimations.filter(ua => ua.noetechKey === noetechKey);
  }, [unlockedAnimations]);


  // Login: Calls API → Updates state → Saves to localStorage
  const login = useCallback(async (email, password) => {
    // Mock login for now
    try {
      const data = await loginApi(email, password);
      
      // Extract user token from response
      const { user: userData, token: userToken } = data;
      
      
      setUser(userData);
      setToken(userToken);
      setUnlockedAnimations(userData.unlockedAnimations || []);

      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userToken);


      return data;
    } catch (error) {
      throw error;
    }
  }, []);
    

  // Signup: Creates new account → Calls API → Updates state → Saves to localStorage
  const signup = useCallback(async (username, email, password) => {
    
    try {
      // Call API
      const data = await signupApi(username, email, password);
      
      //extract user and token from response
      const { user: userData, token: userToken } = data;
      
      
      // Update state
      setUser(userData);
      setToken(userToken);
      setUnlockedAnimations(userData.unlockedAnimations || []);

      // Store local storage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userToken);
      
      
      return data;
    } catch (error) {
      throw error;
    }
  }, []);
  // Logout: Clears all state + localStorage
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setUnlockedAnimations([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  /**
   * Initialize auth from localStorage on mount
   */
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        setUnlockedAnimations(parsedUser.unlockedAnimations || []);
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    
    // Always set loading to false after checking localStorage
    setIsLoading(false);
  }, []);

//----------------------------UNLOCKED NOETECHS------------------------
  // Legacy: Adds newly unlocked noetechs from save responses (before animation system)
//----------------------------UNLOCKED NOETECHS------------------------
  const addUnlockedNoetechs = useCallback((newKeys) => {
    // newKeys = ['icarus-x'] ( from saveButtonHandlers)

    if (!newKeys || newKeys.length === 0) return;
    // Check if array exists and items
    // ['icarus-x'].length = 1, so continue (when array empty, in case of user first save executed)

    setUser((prev) => {

      // setUser = STATE SETTER for useState
      // prev = PREVIOUS user state Object
      // Example prev:
      // ↑ Example prev:
    //   {
    //     id: '507f...',
    //     username: 'pablo',
    //     email: 'pablo@test.com',
    //     unlockedNoetechs: []  ← Currently empty
    //   }

      if (!prev) return prev; // require logged-in user
      // prev = latest STATE
      // When user is logged in:
      //  ↑ If prev is null, return null (don't try to update)
// ↑ Prevents error: "Cannot read property 'unlockedNoetechs' of null"
      const prevList = Array.isArray(prev.unlockedNoetechs) ? prev.
      // Get existing unlocks : []
      unlockedNoetechs : [];
      const merged = Array.from(new Set([...prevList, ...newKeys]));
      // Merge arrays and remove duplicates
       // ↑ [...[], ...['icarus-x']] = ['icarus-x']
        // ↑ Set removes duplicates
        // ↑ Array.from converts Set back to array
          // ↑ merged = ['icarus-x']
      const updated = { ...prev, unlockedNoetechs: merged };
       // ↑ Create NEW user object with updated unlocks
        // ↑ Spread operator (...prev) copies all properties
        // ↑ unlockedNoetechs: merged overwrites old value
      try {
        localStorage.setItem("user", JSON.stringify(updated));
        // ↑ localStorage.setItem = BROWSER API
        // needs to be a string to be inserted into the browsers locasl storage and persist
         // ↑ Saves data to browser storage (persists after refresh)
          // ↑ "user" = KEY name
      // ↑ JSON.stringify(updated) = Converts object to string
      } catch {}
      return updated;
      // ↑ Return new state to React
    // ↑ This triggers re-render of components using user state
    });
  }, []);

  // Adds newly unlocked animations from API responses (called after saving scenes)
  const addUnlockedAnimations = useCallback((newAnimations) => {
    if (!newAnimations || newAnimations.length === 0) return;
    
    setUnlockedAnimations((prev) => {
      // Merge new animations with existing ones, avoiding duplicates
      const existingKeys = prev.map(ua => `${ua.noetechKey}-${ua.animationId}`);
      const uniqueNew = newAnimations.filter(
        newAnim => !existingKeys.includes(`${newAnim.noetechKey}-${newAnim.animationId}`)
      );
      
      const updated = [...prev, ...uniqueNew];
      
      // Also update user object and localStorage
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        const updatedUser = { ...prevUser, unlockedAnimations: updated };
        try {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch {}
        return updatedUser;
      });
      
      return updated;
    });
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading, // Export loading state
    login,
    signup,
    logout,
    addUnlockedNoetechs, // Legacy support
    unlockedAnimations,
    setUnlockedAnimations,
    isAnimationUnlocked,
    getUnlockedAnimationsForNoetech,
    addUnlockedAnimations,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
