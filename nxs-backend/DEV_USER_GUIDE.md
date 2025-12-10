# Development User Setup Guide

## Overview

The backend includes utilities for creating and managing test users during development. This guide explains how to seed dev users and test the progressive Noetech unlock system.

## Dev User Seeding

### Quick Setup

```bash
cd backend
npm run seed
# or: node seedDevUser.js
```

### What This Does

- Creates or finds dev user with credentials from `.env` (or defaults)
- **Resets user to follow new progression system** (0 scenes saved, no Noetechs unlocked)
- Generates fresh JWT token for testing
- Displays login credentials and API testing commands

### Default Credentials

- **Email**: `dev@test.com`
- **Username**: `devuser`
- **Password**: `dev123`
- **Initial State**: 0 scenes saved, no Noetechs unlocked

## Progressive Unlock Testing

### Noetech Unlock Progression

1. **Save 1st scene** → Unlocks `icarus-x` ✨
2. **Save 2nd scene** → Unlocks `vectra` ✨
3. **Save 3rd scene** → Unlocks `nexus` ✨

### Testing Flow

1. **Reset to clean state**:

   ```bash
   cd backend
   node seedDevUser.js
   ```

2. **Login to frontend**:

   - Go to `http://localhost:5173/login`
   - Email: `dev@test.com`
   - Password: `dev123`

3. **Test unlock progression**:
   - Visit Showcase → All Noetechs should be locked 🔒
   - Go to Geometry Lab → Create and save scene #1
   - Return to Showcase → `icarus-x` should be unlocked ✨
   - Repeat for scenes #2 and #3

### Quick Reset (Alternative)

If you just need to reset unlock progression without re-seeding:

```bash
cd backend
npm run reset
# or: node resetDevUser.js
```

This resets the existing dev user to:

- 0 scenes saved
- No Noetechs unlocked
- Ready for testing unlock progression

### Checking User Status

```bash
cd backend
npm run users
# or: node showUsers.js
```

## Environment Variables

Create `.env` file with custom dev user (optional):

```env
DEV_USER_EMAIL=your@email.com
DEV_USER_PASSWORD=yourpassword
DEV_USER_USERNAME=yourusername
```

## Troubleshooting

### Backend Not Running

```bash
cd backend
npm run dev  # Starts nodemon server
```

### MongoDB Connection Issues

- Check `.env` has valid `MONGODB_URI`
- Ensure MongoDB Atlas cluster is running
- Verify network access in Atlas settings

### Frontend Login Issues

- Ensure backend is running on port 3000
- Clear browser localStorage: `localStorage.clear()`
- Check browser console for API errors

## API Testing

After seeding, you get a JWT token for direct API testing:

```bash
# Check user stats
curl -X GET http://localhost:3000/api/dev/my-stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Reset user data
curl -X POST http://localhost:3000/api/dev/reset-my-data \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
