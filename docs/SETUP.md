# Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## Quick Start

### Frontend Setup

```bash
# Clone the repository
cd nexus-geom

# Install dependencies
npm install

# Start development server
npm run dev
# Vite running on http://localhost:5173
```

### Backend Setup (Optional - for scene saving)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start backend server
npm run dev
# Server running on http://localhost:3000
```

## Environment Configuration

### Frontend `.env`

```bash
VITE_API_URL=http://localhost:3000/api
```

### Backend `.env`

```bash
PORT=3000
CLIENT_URL=http://localhost:5173
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
```

## Development Workflow

### Run Both Servers

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

### CORS Configuration

The backend is configured to accept requests from the frontend:

```javascript
// backend/index.js
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
```

## Project Structure

```
nexus-geom/
├── src/                          # Frontend source
│   ├── features/sceneControls/   # 3D geometry system
│   │   └── geometries/           # Modular geometry files
│   ├── Showcase/                 # Animation gallery
│   └── components/               # React components
├── backend/                      # Express API
│   ├── models/                   # Database models
│   ├── routes/                   # API routes
│   └── middleware/               # Auth & validation
└── docs/                         # Documentation
    ├── features/                 # Feature docs
    ├── technical/                # Technical specs
    └── refactoring/              # Refactoring logs
```

## Common Issues

### Port Already in Use

If port 5173 or 3000 is already in use:

```bash
# Kill process on port
lsof -ti:5173 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend Connection Failed

1. Ensure backend server is running
2. Check VITE_API_URL in frontend `.env`
3. Verify CORS configuration in backend

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend

- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start production server

## Next Steps

After setup:

1. Visit http://localhost:5173
2. Explore the geometry lab
3. Check out the animation showcase
4. Save scenes (requires backend running)

For detailed feature documentation, see:

- [Feature Docs](./features/)
- [Technical Specs](./technical/)
