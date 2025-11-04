// (We rename them signupApi and loginApi to avoid conflict with your context function names)

import { signup as signupApi, login as loginApi, getCurrentUser } from '../services/sceneApi';
import React, { createContext, useContext, useState, useCallback } from "react";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // User state - starts as null (not authenticated)
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unlockedAnimations, setUnlockedAnimations] = useState([]);

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token;

  // Helper function to check if specific animation is unlocked
  const isAnimationUnlocked = useCallback((noetechKey, animationId) => {
    return unlockedAnimations.some(
      ua => ua.noetechKey === noetechKey && ua.animationId === animationId
    );
  }, [unlockedAnimations]);

  // Helper function to get all unlocked animations for a Noetech
  const getUnlockedAnimationsForNoetech = useCallback((noetechKey) => {
    return unlockedAnimations.filter(ua => ua.noetechKey === noetechKey);
  }, [unlockedAnimations]);

  // Debug logging removed for production

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User data and token
   */
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
    

  /**
   * Signup new user
   * @param {string} username - Username
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User data and token
   */
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
  /**
   * Logout user
   */
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

  // Merge new unlocked noetechs into the current user and persist (LEGACY)
  const addUnlockedNoetechs = useCallback((newKeys) => {
    if (!newKeys || newKeys.length === 0) return;
    setUser((prev) => {
      if (!prev) return prev; // require logged-in user
      const prevList = Array.isArray(prev.unlockedNoetechs) ? prev.unlockedNoetechs : [];
      const merged = Array.from(new Set([...prevList, ...newKeys]));
      const updated = { ...prev, unlockedNoetechs: merged };
      try {
        localStorage.setItem("user", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // NEW: Add unlocked animations from API responses
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
