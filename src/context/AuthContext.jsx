// (We rename them signupApi and loginApi to avoid conflict with your context function names)

import { signup as signupApi, login as loginApi, getCurrentUser } from '../services/sceneApi';
import React, { createContext, useContext, useState, useCallback } from "react";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Default to signed in state for development
  const defaultUser = {
    id: "dev_user_123",
    username: "dev_builder",
    email: "dev@nexusgeom.com",
    unlockedNoetechs: ["icarus-x", "vectra", "nexus"] // Unlocked for dev
  };
  const defaultToken = "dev_jwt_token_12345";

  // User state - default to authenticated for development
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token;

  // Debug logging
  React.useEffect(() => {
    console.log('🔐 Auth State:', { 
      user: user, 
      token: token ? `${token.substring(0, 20)}...` : null, 
      isAuthenticated: isAuthenticated 
    });
  }, [user, token, isAuthenticated]);

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
      console.log('📥 Login API response:', data);
      
      // Extract user token from response
      const { user: userData, token: userToken } = data;
      
      console.log('👤 User data:', userData);
      console.log('🔑 Token:', userToken);
      
      setUser(userData);
      setToken(userToken);

      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userToken);

      console.log('✅ Login complete, stored in localStorage');

      return data;
    } catch (error) {
      console.error("Login failed", error);
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
      console.log('📥 Signup API response:', data);
      
      //extract user and token from response
      const { user: userData, token: userToken } = data;
      
      console.log('👤 User data:', userData);
      console.log('🔑 Token:', userToken);
      
      // Update state
      setUser(userData);
      setToken(userToken);

      // Store local storage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userToken);
      
      console.log('✅ Signup complete, stored in localStorage');
      
      return data;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  }, []);
  /**
   * Logout user
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  /**
   * Initialize auth from localStorage on mount
   */
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    console.log('🔄 Initializing auth from localStorage:', {
      hasUser: !!storedUser,
      hasToken: !!storedToken,
      storedUser: storedUser,
      storedToken: storedToken ? `${storedToken.substring(0, 20)}...` : null
    });

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        console.log('✅ Auth restored from localStorage');
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    
    // Always set loading to false after checking localStorage
    setIsLoading(false);
  }, []);

  // Merge new unlocked noetechs into the current user and persist
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

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading, // Export loading state
    login,
    signup,
    logout,
    addUnlockedNoetechs,
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
