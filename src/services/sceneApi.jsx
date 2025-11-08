
// 📁 FILE: sceneApi.jsx
// 🔄 Makes HTTP request to backend
// ⬆️ RECEIVES: sceneData (object), token (string) from saveButtonHandlers.js
// ⬇️ SENDS: HTTP POST request to backend server
// ⬇️ RETURNS: Response data back to saveButtonHandlers.js


const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');

export const saveScene = async (sceneData, token) => {

// ↑ sceneData = { name: 'My Scene', config: { metalness: 0.5, baseColor: '#ff00ff', ... } }
  // ↑ token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' (JWT string)
try {
   // ↑ try = Start error handling block
  const url = `${API_BASE_URL}/api/scenes`;
// ↑ fetch = BROWSER FUNCTION for HTTP requests
    // ↑ API_BASE_URL = 'http://localhost:5001/api' (from environment variable)
    // ↑ Full URL = 'http://localhost:5001/api/scenes'
    // ↑ await = WAITS for network request to complete
  
  const response = await fetch(url, { //"Wait for this to finish before moving to next line"
    method: 'POST',
    headers: {   // Envelope information
      'Content-Type': 'application/json',
      // ↑ Tells backend: "I'm sending JSON data"

      'Authorization': `Bearer ${token}` //  ID card
      // ↑ JWT token goes in Authorization header
      // ↑ Backend will read this to know WHO is making the request
      // ↑ Format: "Bearer eyJhbGci..."

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
  // IF API fails, throw a user message for user to see
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
  // Validates HTTP status before parsing JSON
  if(!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Convert response back to JavaScript object
  // Backend sent JSON with scenes array, we extract it
  const data = await response.json();

  // Return the array of user's scenes to whoever called this function
  return data.scenes || [];
} catch (error) {
  // IF API fails, throw a user message for user to see
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
  // IF API fails, throw a user message for user to see
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
  // IF API fails, throw a user message for user to see
throw new Error('Failed to fetch user data. Please try again.');
}

};