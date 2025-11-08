/**
 * 🔐 AUTHCONTEXT - Global authentication state manager
 * 
 * MANAGES: User login/signup/logout + unlocked animations/noetechs
 * 
 * USED BY: All components via useAuth() hook
 *   Example: const { isAuthenticated, login, logout } = useAuth();
 * 
 * FLOW:
 * 1. User logs in → Stores user/token in state + localStorage
 * 2. User saves scene → Backend may unlock animations → Updates state
 * 3. App.jsx checks isAuthenticated → Shows/hides protected routes
 * 
 * PERSISTENCE: Uses localStorage to remember user between page refreshes
 * 
 * 📌 useCallback: Wraps functions so they don't get recreated on every render
 *    - Without it: login() would be a "new" function each render → causes unnecessary re-renders
 *    - With it: login() stays the same function → components using it don't re-render needlessly
 *    - Think of it as "memorizing" the function for performance
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

  // Legacy: Adds newly unlocked noetechs from save responses (before animation system)
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
