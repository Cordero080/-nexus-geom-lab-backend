# Testing Guide

## Dev User Authentication

### Default Credentials

- **Email:** `dev@test.com`
- **Password:** `dev123`
- **Username:** `devuser`

### Quick Login Process

1. Clear localStorage (if needed): Open browser console and run `localStorage.clear()`
2. Navigate to `http://localhost:5174/login`
3. Login with credentials above
4. Fresh JWT token generated automatically

---

## Database Management Scripts

All scripts located in `/backend/` directory.

### Show Current Users

```bash
node backend/showUsers.js
```

**What it does:** Lists all users in database with their email, ID, unlocked noetechs, and creation date.

**When to use:** Check what users exist and their current state.

---

### Seed Dev User

```bash
node backend/seedDevUser.js
```

**What it does:**

- If `dev@test.com` exists: Shows login credentials and generates fresh JWT token
- If doesn't exist: Creates new dev user with default unlocks (`icarus-x`)

**Important:** Does NOT reset existing user's data (keeps scenes & unlocks intact)

**When to use:**

- First time setup
- Get fresh JWT token for API testing
- Verify dev user exists

---

### Clear Database

```bash
node backend/clearDatabase.js
```

**What it does:** **DELETES ALL USERS AND SCENES** from database.

**When to use:**

- Start completely fresh
- Reset for presentation/demo
- Clear test data

⚠️ **Warning:** Cannot be undone!

---

## Testing Workflows

### Fresh Start for Presentation

```bash
# 1. Wipe everything
node backend/clearDatabase.js

# 2. Create fresh dev user
node backend/seedDevUser.js

# 3. In browser console
localStorage.clear()

# 4. Login at http://localhost:5174/login
# Email: dev@test.com
# Password: dev123
```

---

### Fix Authentication Issues (401 Errors)

```bash
# If you get 401 "Unauthorized" errors:

# 1. Clear stale token from browser
localStorage.clear()  # Run in browser console

# 2. Login again
# Navigate to /login and use dev@test.com / dev123
```

**Why this happens:** JWT tokens expire or become invalid if:

- Backend JWT_SECRET changes
- Token expires (default: 7 days)
- Database was cleared but localStorage wasn't

---

### Keep Data, Just Re-login

```bash
# In browser console only:
localStorage.clear()

# Then login again at /login
# All your scenes and unlocks are still in database!
```

---

### Test with Multiple Users

```bash
# Option 1: Signup normally through UI
# Navigate to /signup and create new accounts

# Option 2: Modify seedDevUser.js to create additional users
# (Advanced - requires code changes)
```

---

## Dev User State Management

### What Persists

- ✅ Saved scenes (in MongoDB)
- ✅ Unlocked noetechs (in MongoDB)
- ✅ User account (in MongoDB)

### What's Temporary

- ❌ JWT token (in localStorage, expires in 7 days)
- ❌ Login session (cleared on logout or `localStorage.clear()`)

### Reset Only One User's Data

Currently requires manual database operations. Use `clearDatabase.js` for full reset.

---

## Common Issues

### "No token, access denied" (401)

**Solution:** Run `localStorage.clear()` and login again.

### "Invalid token" (401)

**Solution:** Token expired or JWT_SECRET changed. Run `localStorage.clear()` and login again.

### User exists but can't login

**Solution:**

1. Verify password with `node backend/seedDevUser.js` (shows current password)
2. Or reset: `node backend/clearDatabase.js` then `node backend/seedDevUser.js`

### Buttons show "Loading..." forever

**Solution:** Check if backend is running on `http://localhost:3000`

```bash
cd backend
npm run dev
```

---

## API Testing with cURL

Get a token from `seedDevUser.js` output, then:

```bash
# Check your stats
curl -X GET http://localhost:3000/api/dev/my-stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Save a scene
curl -X POST http://localhost:3000/api/scenes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Scene","description":"","config":{}}'

# Get your scenes
curl -X GET http://localhost:3000/api/scenes/my-scenes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Best Practices

### Before Demo/Presentation

1. Clear database for clean slate
2. Seed dev user
3. Clear localStorage
4. Login once to verify everything works
5. Token will persist for rest of demo

### During Development

- Keep dev user logged in (token lasts 7 days)
- Use `showUsers.js` to monitor database state
- Only clear localStorage when troubleshooting auth issues

### For Instructor Testing

Provide these credentials in your submission:

- Email: `dev@test.com`
- Password: `dev123`
- Ensure backend is running and accessible
