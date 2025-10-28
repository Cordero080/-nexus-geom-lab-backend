# Practice: Creating saveScene() API Function

## Step-by-Step Instructions (Type Each Step)

### Step 1: Create the File

**File Path:** `/src/services/sceneApi.js`

### Step 2: Add Imports at Top

```javascript
// Import statement for getting the base API URL from environment variables
```

### Step 3: Function Signature

```javascript
// Export async function named saveScene
// Parameters: sceneData (object), token (string)
```

### Step 4: Declare Variables

```javascript
// Variable for API endpoint URL (combine base URL + '/api/scenes')
// Variable for request configuration object
```

### Step 5: Structure the Fetch Call

```javascript
// Try-catch block
// Inside try: fetch call with URL and config
// Await the fetch response
```

### Step 6: Headers Configuration

```javascript
// Headers object with:
// - Content-Type: application/json
// - Authorization: Bearer + token
```

### Step 7: Request Configuration

```javascript
// Config object with:
// - method: POST
// - headers: (from step 6)
// - body: JSON.stringify the sceneData
```

### Step 8: Handle Successful Response

```javascript
// Check if response.ok
// If ok: parse JSON and return the data
// If not ok: throw error with response.statusText
```

### Step 9: Handle Errors

```javascript
// In catch block:
// Log the error to console
// Throw new error with user-friendly message
```

### Step 10: Complete Function Structure

```javascript
export const saveScene = async (sceneData, token) => {
  // Your code here following steps 4-9
};
```

---

## Quick Reference for Typing:

**Base URL:** `const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';`

**Endpoint:** `${API_BASE_URL}/api/scenes`

**Authorization Header:** `Authorization: 'Bearer ${token}'`

**Content-Type:** `'Content-Type': 'application/json'`

**Response Check:** `if (!response.ok) { throw new Error(response.statusText); }`

**JSON Parse:** `const data = await response.json();`

**Error Message:** `'Failed to save scene. Please try again.'`

---

## Testing Notes:

- Function should return the saved scene data from backend
- Token comes from AuthContext after user login
- sceneData should include: name, description, sceneConfig, isPublic
- Error handling should provide user-friendly messages

**Practice Goal:** Type this function from scratch using the steps above! 🎯
