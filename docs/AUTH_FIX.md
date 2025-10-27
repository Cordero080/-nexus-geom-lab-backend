# Authentication & Backend Connection Fix

## Problems Solved

### 1. CORS Error - Port 5000 Conflict

**Issue:** Backend couldn't run on port 5000 (occupied by Apple AirPlay service on macOS)

**Solution:** Changed backend port to 3000

- Updated `backend/.env`: `PORT=3000`
- Updated `src/services/sceneApi.jsx`: `API_BASE_URL = 'http://localhost:3000'`

### 2. React Link Component Error

**Issue:** Homepage crashed due to lowercase `<link>` tag in NavBar

**Solution:** Fixed typo in `src/nav/NavBar.jsx`

- Changed `<link to="/showcase">` to `<Link to="/showcase">`
- Added missing `/` in login path: `<Link to="/login">`

### 3. Authentication State Race Condition

**Issue:** Users were redirected to login page immediately after clicking "Enter Geom-Lab" button

**Root Cause:**

- Protected routes checked `isAuthenticated` before localStorage was loaded
- Component rendered → checked auth (false) → redirected to login
- Then localStorage loaded → auth became true (too late)

**Solution:** Added loading state to AuthContext

```javascript
// AuthContext.jsx
const [isLoading, setIsLoading] = useState(true);

// Wait for localStorage check before rendering routes
React.useEffect(() => {
  // Load user/token from localStorage
  setIsLoading(false); // Done checking
}, []);
```

```javascript
// App.jsx
if (isLoading) {
  return <LoadingScreen />;
}
// Now safe to check isAuthenticated
```

### 4. Login/Signup Redirect Flow

**Issue:** Users expected to see homepage after auth, not immediately enter geom-lab

**Solution:** Updated redirects in LoginPage and SignUpPage

- Changed `navigate('/geom-lab')` to `navigate('/')`
- Users now land on homepage → click "Enter Geom-Lab" button → access lab

## Files Modified

1. `backend/.env` - Changed PORT to 3000
2. `src/services/sceneApi.jsx` - Updated API_BASE_URL to port 3000
3. `src/nav/NavBar.jsx` - Fixed Link component typo
4. `src/context/AuthContext.jsx` - Added isLoading state and debugging logs
5. `src/App.jsx` - Added loading screen while checking auth
6. `src/pages/LoginPage/LoginPage.jsx` - Changed redirect to homepage
7. `src/pages/SignUpPage/SignUpPage.jsx` - Changed redirect to homepage

## Backend Response Format

```javascript
// POST /api/auth/signup or /api/auth/login
{
  success: true,
  token: "jwt_token_string",
  user: {
    id: "user_id",
    username: "username",
    email: "email@example.com",
    unlockedNoetechs: ["icarus-x"]
  }
}
```

## Testing the Fix

1. Start backend: `cd backend && npm run dev` (runs on port 3000)
2. Start frontend: `npm run dev` (runs on port 5173)
3. Sign up → redirected to homepage
4. Click "Enter Geom-Lab" → access granted (no redirect loop)
5. Refresh page → auth persists from localStorage
