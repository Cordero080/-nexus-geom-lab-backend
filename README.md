# Nexus-Geom Backend API

A Node.js/Express backend for the Nexus-Geom 3D geometry playground application. This API provides user authentication and personal scene management with gamified animation unlocking.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

Server runs on: `http://localhost:3000`

## 🎯 Project Overview

**Frontend:** React + Three.js (separate repository)  
**Backend:** Express + Node.js + MongoDB  
**Purpose:** Full-stack bootcamp capstone project

### What Users Can Do
- Create and authenticate user accounts
- Save 3D geometry scenes with full configuration
- Load and edit their personal scenes
- Delete scenes they no longer want
- **Unlock animations** by saving more scenes (gamification)

### What This Backend Does NOT Include
- ❌ Public gallery (removed)
- ❌ Social features (likes, views, sharing)
- ❌ Scene remixing from other users

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js          # User authentication & animation unlocks
│   └── Scene.js         # 3D scene configurations
├── routes/
│   ├── auth.js          # Signup/login endpoints
│   └── scenes.js        # Scene CRUD operations (4 routes)
├── middleware/
│   ├── auth.js          # JWT token verification
│   └── unlockChecker.js # Animation unlock logic
├── config/
│   └── db.js            # MongoDB connection
├── .env                 # Environment variables
├── .gitignore           # Git exclusions
├── package.json         # Dependencies & scripts
└── index.js             # Express server entry point
```

## 🛠 Recent Fixes Applied (October 2025)

### Critical Issues Resolved:

1. **Animation System Overhaul**
   - ✅ Changed from numeric IDs (1,2,3) to string names ("rotate", "float", "spiral", "chaos", "alien")
   - ✅ Updated User model methods: `hasUnlockedAnimation()`, `unlockAnimation()`
   - ✅ Fixed default unlocked animations: `["rotate"]` instead of `[1]`

2. **Animation Unlock Thresholds Corrected**
   - ✅ Fixed unlock logic in `unlockChecker.js`
   - ✅ New thresholds: 1 scene→"float", 3→"spiral", 5→"chaos", 10→"alien"
   - ✅ Everyone starts with "rotate" unlocked

3. **Removed Public Gallery Features**
   - ✅ Removed `isPublic`, `views`, `likes` fields from Scene model
   - ✅ Removed public gallery routes
   - ✅ Users only see their own scenes

4. **Config Update Logic Fixed**
   - ✅ PUT route now **merges** config instead of replacing wholesale
   - ✅ Prevents data loss during partial updates

5. **File Structure Cleanup**
   - ✅ Removed empty `server.js` file (using `index.js`)
   - ✅ Added explicit PORT to `.env`

## 🗃 Database Models

### User Model
```javascript
{
  username: String (required, unique, 3-30 chars),
  email: String (required, unique, lowercase),
  password: String (hashed with bcrypt, min 6 chars),
  unlockedAnimations: [String] (default: ["rotate"]),
  createdAt: Date
}
```

**Methods:**
- `hasUnlockedAnimation(animationName)` - Check if animation is unlocked
- `unlockAnimation(animationName)` - Add animation to unlocked array
- `comparePassword(candidatePassword)` - Verify password

### Scene Model
```javascript
{
  name: String (required, max 100 chars),
  description: String (optional, max 500 chars),
  userId: ObjectId (reference to User),
  config: {
    // Material Properties
    scale: Number,
    metalness: Number,
    emissiveIntensity: Number,
    baseColor: String (hex color),
    wireframeIntensity: Number,
    
    // Hyperframe
    hyperframeColor: String (hex color),
    hyperframeLineColor: String (hex color),
    
    // Scene Behavior
    cameraView: String,
    environment: String,
    environmentHue: Number (0-360),
    objectCount: Number,
    animationStyle: String (enum: "rotate", "float", "spiral", "chaos", "alien"),
    objectType: String,
    
    // Lighting
    ambientLightColor: String,
    ambientLightIntensity: Number,
    directionalLightColor: String,
    directionalLightIntensity: Number,
    directionalLightX: Number,
    directionalLightY: Number,
    directionalLightZ: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication Routes

**POST `/api/auth/signup`**
```json
Request:
{
  "username": "artist123",
  "email": "artist@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "...",
    "username": "artist123",
    "email": "artist@example.com",
    "unlockedAnimations": ["rotate"]
  }
}
```

**POST `/api/auth/login`**
```json
Request:
{
  "email": "artist@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "...",
    "username": "artist123",
    "unlockedAnimations": ["rotate", "float"]
  }
}
```

**GET `/api/auth/me`** (Protected)
```json
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "user": {
    "id": "...",
    "username": "artist123",
    "email": "artist@example.com",
    "unlockedAnimations": ["rotate", "float"],
    "createdAt": "..."
  }
}
```

### Scene Routes (All Protected)

**POST `/api/scenes`** - Create Scene
```json
Headers: Authorization: Bearer {token}

Request:
{
  "name": "Purple Dream",
  "description": "My first geometric art",
  "config": {
    "objectType": "icosahedron",
    "baseColor": "#ff00ff",
    "scale": 1.5,
    "animationStyle": "rotate"
  }
}

Response:
{
  "success": true,
  "message": "Scene created successfully",
  "scene": { ... },
  "unlockedAnimations": ["float"] // If any unlocked
}
```

**GET `/api/scenes/my-scenes`** - Get User's Scenes
```json
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "count": 5,
  "scenes": [
    {
      "_id": "...",
      "name": "Purple Dream",
      "description": "...",
      "config": { ... },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

**PUT `/api/scenes/:id`** - Update Scene
```json
Headers: Authorization: Bearer {token}

Request:
{
  "name": "Updated Name",
  "config": {
    "baseColor": "#00ffff"
    // Only fields being updated - merges with existing config
  }
}

Response:
{
  "success": true,
  "message": "Scene updated successfully",
  "scene": { ... }
}
```

**DELETE `/api/scenes/:id`** - Delete Scene
```json
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Scene deleted successfully"
}
```

## 🎮 Animation Unlock System

### Default Unlocked
- **"rotate"** - Everyone starts with this animation

### Unlock Thresholds
- **1 scene saved** → Unlock "float"
- **3 scenes saved** → Unlock "spiral"  
- **5 scenes saved** → Unlock "chaos"
- **10 scenes saved** → Unlock "alien"

### How It Works
1. User creates/saves a scene
2. `unlockChecker.js` middleware counts their total scenes
3. If threshold reached, animation is added to `user.unlockedAnimations`
4. Response includes `unlockedAnimations` array for frontend notification
5. Frontend can show "New Animation Unlocked!" message

## 🔧 Environment Variables

Create a `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexus-geom
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:5173
PORT=3000
```

## 📦 Dependencies

```json
{
  "dependencies": {
    "express": "^5.1.0",
    "mongoose": "^8.19.2",
    "bcryptjs": "^3.0.2",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^17.2.3",
    "cors": "^2.8.5",
    "express-validator": "^7.2.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

## 🧪 Testing the API

### Using curl:
```bash
# Health check
curl http://localhost:3000/

# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'

# Login (save the token from response)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Create scene (replace TOKEN with actual token)
curl -X POST http://localhost:3000/api/scenes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name": "Test Scene", "config": {"animationStyle": "rotate"}}'

# Get my scenes
curl -X GET http://localhost:3000/api/scenes/my-scenes \
  -H "Authorization: Bearer TOKEN"
```

### Using Browser:
Visit `http://localhost:3000/` to see the health check response.

## 🚀 Deployment

**For production:**
- Use MongoDB Atlas (free tier)
- Deploy to Railway, Render, or Heroku
- Set environment variables on hosting platform
- Update CORS to allow your frontend domain

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication  
- ✅ Input validation with express-validator
- ✅ CORS protection
- ✅ Ownership verification for scene operations
- ✅ Error handling middleware

## 📈 Performance Features

- ✅ MongoDB indexing on userId and email
- ✅ Efficient scene counting for unlock logic
- ✅ Selective field population
- ✅ Request validation to prevent bad data

---

## 📞 Support

This backend is designed for the Nexus-Geom 3D geometry playground. It provides secure, personal scene management with gamified progression through animation unlocks.

**Key Focus:** Simple, personal scene library management - no social features or public galleries.