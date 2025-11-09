// Authentication API service
// Handles user authentication operations: signup, login, and fetching current user

const API_BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Sign up a new user
 * @param {string} username - Username for the new account
 * @param {string} email - Email for the new account
 * @param {string} password - Password for the new account
 * @returns {Promise<Object>} Response data with user info and token
 */
export const signup = async (username, email, password) => {
  try {
    const url = `${API_BASE_URL}/api/auth/signup`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to create account. Please try again.");
  }
};

/**
 * Log in an existing user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response data with user info and token
 */
export const login = async (email, password) => {
  try {
    const url = `${API_BASE_URL}/api/auth/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to log in. Please check your credentials.");
  }
};

/**
 * Get current authenticated user's data
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} User data including unlocked animations
 */
export const getCurrentUser = async (token) => {
  try {
    const url = `${API_BASE_URL}/api/auth/me`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch user data. Please try again.");
  }
};
