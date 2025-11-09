
// 📁 FILE: sceneApi.jsx
// 🔄 Makes HTTP request to backend
// ⬆️ RECEIVES: sceneData (object), token (string) from saveButtonHandlers.js
// ⬇️ SENDS: HTTP POST request to backend server
// ⬇️ RETURNS: Response data back to saveButtonHandlers.js
//AGAIN=========================>
// 📁 FILE: sceneApi.jsx (line 44)
// ⬆️ SENT: HTTP POST request to backend
// ⬇️ WAITING: For backend to process and respond
// ⬇️ RECEIVES: Response from backend


const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');
  // import.meta.env.VITE_API_BASE_URL = URL from .env file in production
  // this is where the frontend knows where to send requests

export const saveScene = async (sceneData, token) => {

  // ↑ sceneData = { name: 'My Scene', config: { metalness: 0.5, baseColor: '#ff00ff', ... } }
  // ↑ token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' (JWT string)

  try {
    const url = `${API_BASE_URL}/api/scenes`; // this is the route we are posting to, a.k.a. backend endpoint

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(sceneData)
    });
    // fetch() sent request and is now WAITING 
    // Backend processed everything we just traced
    // Backend sent response back over network

    if(!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // check if request succeeded (status 200-299) otherwise throw error
    const data = await response.json();
    //  response.json() = PARSES JSON string back to JS object
    // Backend sent: '{"success": ture, "unlockedNoetechs": ["icarus-x"], ... }
// This converts to {success: true, unlockedNoetechs: ['icarus-x'], ...}
// data = OBJECT with all the response data from backend
// Example:
// {
//   success: true,
//   message: "Scene created successfully",
//   scene: { _id: '...', name: 'My Scene', ... },
//   totalScenes: 1,
//   unlockedNoetechs: ['icarus-x'] <--- THE UNLOCK
// }

    return data;
     // ↑ Returns data to saveButtonHandlers.js
  } catch (error) {
    throw new Error('Failed to save scene. Please try again.');
  }
};

export const deleteScene = async (sceneId, token) => {
  try {
    const url = `${API_BASE_URL}/api/scenes/${sceneId}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` 
      }
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
  try {
    const url = `${API_BASE_URL}/api/scenes/my-scenes`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if(!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.scenes || [];
  } catch (error) {
    throw new Error('Failed to fetch your scenes. Please try again.');
  }
};

export const updateScene = async (sceneId, sceneData, token) => {
  try {
    const url = `${API_BASE_URL}/api/scenes/${sceneId}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(sceneData)
    });

    if(!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to update scene. Please try again.');
  }
};