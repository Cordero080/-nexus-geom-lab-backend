# Deploying a React App to GitHub Pages

## Overview

This document explains how we deployed the Nexus Geom Lab React application to GitHub Pages, a free static file hosting service.

---

## The Challenge

GitHub Pages only serves **static files** (HTML, CSS, JavaScript). It cannot run Node.js or any server-side code. React apps are typically developed with JSX, ES modules, and require a build step - they don't work directly in browsers.

**The solution:** Build the React app into static files, then deploy those.

---

## Step-by-Step Process

### 1. What `npm run build` Does

When you run `npm run build`, Vite (our build tool) compiles the React app:

| Before Build (Source Code) | After Build (dist/ folder) |
|---------------------------|---------------------------|
| JSX files (`App.jsx`) | Plain JavaScript |
| ES modules (`import/export`) | Bundled single file |
| SCSS/CSS modules | Compiled CSS |
| Development code | Minified, optimized code |

**Example transformation:**
```jsx
// Before: src/App.jsx
import { useState } from 'react';
export default function App() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

```javascript
// After: dist/assets/index-abc123.js
// Minified, bundled, browser-ready JavaScript
```

The `dist/` folder contains everything needed to run the app - no Node.js required.

---

### 2. What the `gh-pages` Branch Is For

GitHub Pages serves websites from a specific branch. We use a **separate branch** called `gh-pages` that only contains the built files.

```
main branch (source code)          gh-pages branch (deployed files)
├── src/                           ├── index.html
│   ├── App.jsx                    ├── assets/
│   ├── components/                │   ├── index-abc123.js
│   └── ...                        │   └── index-xyz789.css
├── package.json                   └── ...
└── vite.config.js
```

**Why separate branches?**
- `main` = Your development code (JSX, source files)
- `gh-pages` = Production build (static files only)

The `gh-pages` npm package handles pushing to this branch automatically.

---

### 3. How the `dist` Folder Relates to GitHub Pages

```
npm run build          npm run deploy           GitHub Pages
     │                      │                        │
     ▼                      ▼                        ▼
Creates dist/    →    Pushes dist/ to     →    Serves files at
folder locally        gh-pages branch          cordero080.github.io/nexus-geom-lab
```

The deploy script in `package.json`:
```json
{
  "scripts": {
    "build": "vite build",
    "deploy": "gh-pages -d dist"
  }
}
```

- `vite build` creates the `dist/` folder
- `gh-pages -d dist` pushes that folder to the `gh-pages` branch

---

### 4. Why This Works with Static Files Only

React is a **client-side** framework. After building:

1. User visits `https://cordero080.github.io/nexus-geom-lab/`
2. GitHub Pages sends `index.html` (static file)
3. Browser loads `index.html`
4. `index.html` includes `<script src="assets/index-abc123.js">`
5. Browser downloads and runs the JavaScript
6. **React runs entirely in the browser** - renders components, handles state, etc.

```
GitHub Pages (Server)              User's Browser
┌─────────────────────┐           ┌─────────────────────┐
│ Just sends files:   │           │ Runs React:         │
│ - index.html        │  ──────►  │ - Renders JSX       │
│ - index.js          │           │ - Manages state     │
│ - styles.css        │           │ - Handles events    │
└─────────────────────┘           └─────────────────────┘
        Static                         Dynamic
```

**The server does nothing except send files. All the "React magic" happens in the browser.**

---

## Configuration Required

### vite.config.js

```javascript
export default defineConfig({
  base: '/nexus-geom-lab/', // Must match repo name for GitHub Pages
  // ... other config
});
```

The `base` option is critical - it tells Vite that the app will be served from a subdirectory (`/nexus-geom-lab/`) not the root (`/`).

### package.json

```json
{
  "homepage": "https://cordero080.github.io/nexus-geom-lab",
  "scripts": {
    "build": "vite build",
    "deploy": "gh-pages -d dist"
  }
}
```

---

## The Backend Is Separate

The React frontend on GitHub Pages communicates with a **separate backend** hosted on Render:

```
┌─────────────────────────────┐         ┌─────────────────────────────┐
│   GitHub Pages (Frontend)   │         │    Render (Backend)         │
│   Static React App          │ ◄─────► │    Node.js + Express        │
│   cordero080.github.io      │  HTTP   │    + MongoDB                │
│                             │  API    │                             │
│   - UI rendering            │ calls   │   - Authentication          │
│   - User interactions       │         │   - Database operations     │
│   - Client-side routing     │         │   - Business logic          │
└─────────────────────────────┘         └─────────────────────────────┘
```

This is called a **decoupled architecture** or **JAMstack** approach.

---

## Deployment Commands

```bash
# 1. Build the app
npm run build

# 2. Deploy to GitHub Pages
npm run deploy

# Or do both at once:
npm run build && npm run deploy
```

---

## Troubleshooting

### Blank page after deploy?
- Check `base` in `vite.config.js` matches your repo name
- Check browser console for 404 errors on assets

### Routes not working (404 on refresh)?
- GitHub Pages doesn't support client-side routing natively
- Need to add a `404.html` that redirects to `index.html`
- Or use hash-based routing (`/#/login` instead of `/login`)

### CORS errors?
- Backend must allow the GitHub Pages origin
- We configured this in the Express backend's CORS settings

---

## Summary

| Component | What It Does |
|-----------|-------------|
| `npm run build` | Compiles React → static files in `dist/` |
| `gh-pages` branch | Holds only the built files |
| `npm run deploy` | Pushes `dist/` to `gh-pages` branch |
| GitHub Pages | Serves static files to users |
| Browser | Runs React code client-side |

**Key insight:** React apps become plain HTML/CSS/JS after building. GitHub Pages just serves those files. The browser does all the work.
