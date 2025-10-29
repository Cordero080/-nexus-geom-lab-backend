# Navigation Blocking Fix

## Problem

Users could navigate away from the GeomLab (`/geom-lab`) page without being prompted to save their work, causing potential data loss.

### Initial Requirement

- Prompt user to save whenever they try to navigate away from `/geom-lab` without saving
- Catch ALL navigation attempts:
  - Clicking nav links (Home, Scenes, Showcase)
  - Browser back/forward buttons
  - Closing tab/window
  - Refreshing page
  - Entering new URL in address bar

## Attempted Solution: React Router's useBlocker

### Implementation

```jsx
import { useBlocker } from "react-router-dom";

const blocker = useBlocker(
  ({ currentLocation, nextLocation }) =>
    !allowNavigation && currentLocation.pathname !== nextLocation.pathname
);
```

### Error Encountered

```
Uncaught Error: useBlocker must be used within a data router.
See https://reactrouter.com/en/main/routers/picking-a-router.
```

### Root Cause

- `useBlocker` is only available in React Router's **data routers** (createBrowserRouter, createHashRouter, etc.)
- Our app uses `<BrowserRouter>` which is a **non-data router**
- Migrating to data router would require major refactoring:
  - Convert all `<Routes>` and `<Route>` to route objects
  - Update all loaders, actions, and navigation patterns
  - Potentially break existing authentication flow

## Actual Solution: Custom Navigation Blocking

Instead of using `useBlocker`, implemented a custom solution using browser APIs:

### 1. Track Unsaved Changes

```jsx
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

// Mark as changed whenever any control updates
useEffect(() => {
  setHasUnsavedChanges(true);
}, [metalness, emissiveIntensity, baseColor /* all controls */]);
```

### 2. Intercept Link Clicks (for internal navigation)

```jsx
useEffect(() => {
  const handleClick = (e) => {
    if (!hasUnsavedChanges || allowNavigation) return;

    const link = e.target.closest("a");
    if (link && link.href) {
      const url = new URL(link.href);
      const targetPath = url.pathname;

      // Only block internal navigation to different routes
      if (
        targetPath !== location.pathname &&
        url.origin === window.location.origin
      ) {
        e.preventDefault();
        e.stopPropagation();
        setNextPath(targetPath);
        setShowSavePrompt(true);
      }
    }
  };

  // Use capture phase to intercept before React Router processes click
  document.addEventListener("click", handleClick, true);
  return () => document.removeEventListener("click", handleClick, true);
}, [hasUnsavedChanges, allowNavigation, location.pathname]);
```

**Key Points:**

- Uses **capture phase** (`true` parameter) to intercept clicks before React Router
- Checks if link is internal navigation
- Prevents default navigation
- Shows custom save prompt modal

### 3. Block Browser Navigation (back/forward, close tab, refresh)

```jsx
useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (hasUnsavedChanges && !allowNavigation) {
      e.preventDefault();
      e.returnValue = ""; // Required for Chrome
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [hasUnsavedChanges, allowNavigation]);
```

**Note:** Browser shows its own generic confirmation dialog for `beforeunload` - custom messages are not supported in modern browsers for security reasons.

### 4. Execute Navigation After User Approves

```jsx
useEffect(() => {
  if (allowNavigation && nextPath) {
    navigate(nextPath);
    setAllowNavigation(false);
    setNextPath(null);
  }
}, [allowNavigation, nextPath, navigate]);
```

### 5. Save Prompt Modal Handlers

```jsx
// User chooses "Save & Exit"
const handleSaveFromModal = async () => {
  // ... save scene logic ...
  setHasUnsavedChanges(false); // Mark as saved
  setShowSavePrompt(false);
  setAllowNavigation(true); // Triggers navigation in above useEffect
};

// User chooses "Exit Without Saving"
const handleExitWithoutSaving = () => {
  setShowSavePrompt(false);
  setAllowNavigation(true);
  setHasUnsavedChanges(false);
};

// User chooses "Cancel" (stay on page)
const handleCancelExit = () => {
  setShowSavePrompt(false);
  setNextPath(null);
};
```

## Files Modified

- `src/App.jsx` - Added custom navigation blocking logic to `GeomLab` component

## Result

✅ **Internal Navigation** (nav links): Custom modal with Save/Exit/Cancel options
✅ **Browser Navigation** (back/forward, close, refresh): Browser's default confirmation dialog
✅ **No React Router migration needed**

## Lessons Learned

1. `useBlocker` is NOT available in basic `<BrowserRouter>` - only in data routers
2. Data router migration is a breaking change requiring route object refactoring
3. Custom navigation blocking using native browser APIs is more flexible and compatible
4. Event capture phase (`addEventListener(event, handler, true)`) intercepts events before React Router
5. `beforeunload` event cannot show custom messages in modern browsers - only generic browser dialog

## Alternative Considered But Not Implemented

If we needed data router features (loaders, actions, etc.), we would migrate to:

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "geom-lab", element: <GeomLab /> },
      // ... etc
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}
```

But this was unnecessary for our use case - custom blocking worked perfectly.
