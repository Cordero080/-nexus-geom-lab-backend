// sceneApi.jsx - Handles all scene-related API calls

// THIS file contains functions that communicate with the backend

// BASE URL FOR API -> where the backend server lives
// Basically a variable that stores the address of the backend server

// Frontend (React app) runs on one port (like 5173)
// Backend (Express server) runs on another port (like 5000)
// They need to talk to each other, so we store the backend's address

// The || part (OR operator):

// First, try to get URL from environment variable (for production)
// If that doesn't exist, use http://localhost:5000 (for development)

// Real example:

// Development: Uses http://localhost:3000
// Production: Uses https://your-backend.onrender.com
// In development, use a relative base URL so Vite's dev proxy can forward to the backend
// In production, use VITE_API_BASE_URL (or fall back to localhost:3000 if not provided)
const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');

export const saveScene = async (sceneData, token) => {
// try to make the API call
try {
  // Build the full URL for the API endpoint
  //Combines base URL + the specific route for saving scenes
  const url = `${API_BASE_URL}/api/scenes`;

  // Make the HTTP request to the backend
  // fetch() sends the request and waits for response
  // A built-in JavaScript function that makes HTTP requests to servers.
  const response = await fetch(url, { //"Wait for this to finish before moving to next line"
    method: 'POST',
    headers: {   // Envelope information
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` //  ID card
      // Why "Bearer"?
// It's a standard format: Bearer <token>
// Like saying "The bearer of this token is authenticated"
    },
    body: JSON.stringify(sceneData) // The actual letter contents
//     **Why stringify?**
// - JavaScript objects can't be sent over the internet
// - We convert to text (string) format
// - Server converts it back to an object
  });

  // Check if the request was successful 
  // Response.ok => is true if status 200-299
  if(!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Convert response back to JavaScript object
  // Backend sent JSON, we convert it back
  const data = await  response.json();

  // Return the saved scne date to whoever called this function
return data;
} catch (error) {
  // IF API fails, log error and throw a user message for user to see
  console.error('Error saving scene:', error);
throw new Error('Failed to save scene. Please try again.');
}

};

export const deleteScene = async (sceneId, token) => {
  try {
    const url = `${API_BASE_URL}/api/scenes/${sceneId}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { //  no body, content type not needed
        'Authorization': `Bearer ${token}` 
      }
      // DELETE requests don't need a body for deletion
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting scene:', error);
    throw new Error('Failed to delete scene. Please try again.');
  }
};

export const getMyScenes = async (token) => {
// try to fetch user's scenes from backend
try {
  // Build the full URL for getting user's scenes
  // Combines base URL + the specific route for user's scenes
  const url = `${API_BASE_URL}/api/scenes/my-scenes`;

  // Make the HTTP request to the backend
  // GET request - we're asking for data, not sending any
  const response = await fetch(url, { //"Wait for this to finish before moving to next line"
    method: 'GET',
    headers: {   // Only need Authorization for GET requests
      'Authorization': `Bearer ${token}` //  ID card to prove who we are
      // No Content-Type needed for GET - we're not sending data
    }
    // No body needed for GET requests - we're just asking for data
  });

  // Check if the request was successful 
  // Response.ok => is true if status 200-299
  if(!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Convert response back to JavaScript object
  // Backend sent JSON with scenes array, we extract it
  const data = await response.json();

  // Return the array of user's scenes to whoever called this function
  return data.scenes || [];
} catch (error) {
  // IF API fails, log error and throw a user message for user to see
  console.error('Error fetching my scenes:', error);
throw new Error('Failed to fetch your scenes. Please try again.');
}

};

export const updateScene = async (sceneId, sceneData, token) => {
// try to update an existing scene
try {
  // Build the full URL for updating a specific scene
  // Combines base URL + scenes route + specific scene ID
  const url = `${API_BASE_URL}/api/scenes/${sceneId}`;

  // Make the HTTP request to the backend
  // PUT request - we're updating existing data
  const response = await fetch(url, { //"Wait for this to finish before moving to next line"
    method: 'PUT',
    headers: {   // Envelope information
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` //  ID card
      // PUT needs both Content-Type and Authorization
    },
    body: JSON.stringify(sceneData) // The updated scene data
//     **Why stringify?**
// - JavaScript objects can't be sent over the internet
// - We convert to text (string) format
// - Server converts it back to an object
  });

  // Check if the request was successful 
  // Response.ok => is true if status 200-299
  if(!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Convert response back to JavaScript object
  // Backend sent updated scene data, we convert it back
  const data = await response.json();

  // Return the updated scene data to whoever called this function
return data;
} catch (error) {
  // IF API fails, log error and throw a user message for user to see
  console.error('Error updating scene:', error);
throw new Error('Failed to update scene. Please try again.');
}

};

export const signup = async (username, email, password) => {
// try to create a new user account
try {
  // Build the full URL for user signup
  // Combines base URL + auth route + signup endpoint
  const url = `${API_BASE_URL}/api/auth/signup`;

  // Make the HTTP request to the backend
  // POST request - we're creating new user data
  const response = await fetch(url, { //"Wait for this to finish before moving to next line"
    method: 'POST',
    headers: {   // Envelope information
      'Content-Type': 'application/json'
      // No Authorization needed - user doesn't have token yet!
    },
    body: JSON.stringify({ username, email, password }) // The new user data
//     **Why stringify?**
// - JavaScript objects can't be sent over the internet
// - We convert to text (string) format
// - Server converts it back to an object
  });

  // Check if the request was successful 
  // Response.ok => is true if status 200-299
  if(!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Convert response back to JavaScript object
  // Backend sent token and user info, we convert it back
  const data = await response.json();

  // Return the token and user data to whoever called this function
return data;
} catch (error) {
  // IF API fails, log error and throw a user message for user to see
  console.error('Error signing up:', error);
throw new Error('Failed to create account. Please try again.');
}

};

export const login = async (email, password) => {
// try to log in an existing user
try {
  // Build the full URL for user login
  // Combines base URL + auth route + login endpoint
  const url = `${API_BASE_URL}/api/auth/login`;

  // Make the HTTP request to the backend
  // POST request - we're sending login credentials
  const response = await fetch(url, { //"Wait for this to finish before moving to next line"
    method: 'POST',
    headers: {   // Envelope information
      'Content-Type': 'application/json'
      // No Authorization needed - user doesn't have token yet!
    },
    body: JSON.stringify({ email, password }) // The login credentials
//     **Why stringify?**
// - JavaScript objects can't be sent over the internet
// - We convert to text (string) format
// - Server converts it back to an object
  });

  // Check if the request was successful 
  // Response.ok => is true if status 200-299
  if(!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Convert response back to JavaScript object
  // Backend sent token and user info, we convert it back
  const data = await response.json();

  // Return the token and user data to whoever called this function
return data;
} catch (error) {
  // IF API fails, log error and throw a user message for user to see
  console.error('Error logging in:', error);
throw new Error('Failed to log in. Please check your credentials.');
}

};

export const getCurrentUser = async (token) => {
// try to get current user's information
try {
  // Build the full URL for getting current user data
  // Combines base URL + auth route + me endpoint
  const url = `${API_BASE_URL}/api/auth/me`;

  // Make the HTTP request to the backend
  // GET request - we're asking for user data, not sending any
  const response = await fetch(url, { //"Wait for this to finish before moving to next line"
    method: 'GET',
    headers: {   // Only need Authorization for GET requests
      'Authorization': `Bearer ${token}` //  ID card to prove who we are
      // No Content-Type needed for GET - we're not sending data
    }
    // No body needed for GET requests - we're just asking for data
  });

  // Check if the request was successful 
  // Response.ok => is true if status 200-299
  if(!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Convert response back to JavaScript object
  // Backend sent user data, we convert it back
  const data = await response.json();

  // Return the user data to whoever called this function
return data;
} catch (error) {
  // IF API fails, log error and throw a user message for user to see
  console.error('Error fetching current user:', error);
throw new Error('Failed to fetch user data. Please try again.');
}

};