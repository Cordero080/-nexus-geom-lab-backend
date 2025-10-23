import React, { createContext, useContext, useState, useCallback } from "react";

/**
 * Auth Context - Manages authentication state across the application
 * 
 * Tracks:
 * - Current user (id, username, email, token)
 * - Authentication status
 * 
 * Provides:
 * - login() - Authenticate user
 * - signup() - Create new account
 * - logout() - Clear authentication
 * - isAuthenticated - Boolean flag
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Default to signed in state for development
  const defaultUser = {
    id: "dev_user_123",
    username: "dev_builder",
    email: "dev@nexusgeom.com"
  };
  const defaultToken = "dev_jwt_token_12345";

  // User state - default to authenticated for development
  const [user, setUser] = useState(defaultUser);
  const [token, setToken] = useState(defaultToken);

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token;

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User data and token
   */
  const login = useCallback(async (email, password) => {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    // const data = await response.json();

    // Mock login for now
    const mockUser = {
      id: "user_123",
      username: "demo_user",
      email: email,
    };
    const mockToken = "mock_jwt_token_12345";

    setUser(mockUser);
    setToken(mockToken);

    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("token", mockToken);

    return { user: mockUser, token: mockToken };
  }, []);

  /**
   * Signup new user
   * @param {string} username - Username
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User data and token
   */
  const signup = useCallback(async (username, email, password) => {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_URL}/auth/signup`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, email, password })
    // });
    // const data = await response.json();

    // Mock signup for now
    const mockUser = {
      id: "user_" + Date.now(),
      username: username,
      email: email,
    };
    const mockToken = "mock_jwt_token_" + Date.now();

    setUser(mockUser);
    setToken(mockToken);

    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("token", mockToken);

    return { user: mockUser, token: mockToken };
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

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    signup,
    logout,
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
