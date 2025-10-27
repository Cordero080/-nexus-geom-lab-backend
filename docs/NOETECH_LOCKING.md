# Noetech Locking System

This document describes how Noetechs are locked and unlocked in the app, the default behavior, and how to change it.

## Overview

- By default, only the Noetech key `icarus-x` is unlocked.
- All other Noetechs (e.g., `vectra`, `nexus`) are locked until the user saves a scene.
- When a scene is saved, the backend may return `unlockedNoetechs` in the response. These are merged into the user’s unlocked list and immediately reflected in the UI.

## UX Behavior

- Locked items display a subtle lock overlay in the Showcase gallery.
- Clicking a locked card shows a short hint: "Locked — Save a scene to unlock this Noetech."
- Once unlocked, the overlay disappears and the card becomes interactive.

## Data Flow

1. User saves a scene via the Save button.
2. Backend responds with `{ unlockedNoetechs: ["vectra", ...] }` when applicable.
3. Frontend merges these into `user.unlockedNoetechs` and persists them to `localStorage`.
4. UI updates immediately; previously locked cards become clickable.

## Key Files

- Frontend state
  - `src/context/AuthContext.jsx`
    - Adds `addUnlockedNoetechs(newKeys: string[])` to merge and persist new unlocks.
  - `src/components/Controls/SaveButton/SaveButton.jsx`
    - On save success, if `result.unlockedNoetechs?.length`, calls `addUnlockedNoetechs(...)` and shows a friendly alert.
- Showcase gating
  - `src/Showcase/ShowcaseGallery.jsx`
    - Each mock animation has a `noetechKey` (e.g., `icarus-x`, `vectra`, `nexus`).
    - Computes `isUnlocked` from `user.unlockedNoetechs` (defaults to `["icarus-x"]` when logged out).
    - Renders a `.lock-overlay` for locked cards and prevents click.
  - `src/Showcase/ShowcaseGallery.css`
    - `.parallax-model-card.locked`, `.lock-overlay`, `.lock-badge`, `.lock-hint` styles.

## Defaults and Configuration

- Default unlocked when not logged in or no user list present: `["icarus-x"]`.
- To adjust default keys globally, change the fallback in `ShowcaseGallery.jsx`.
- To adjust per-user defaults, ensure your backend returns `user.unlockedNoetechs` at login/signup.

## Backend Contract

- Save scene response may include an array `unlockedNoetechs`.
- Auth endpoints should return `user` with a persisted `unlockedNoetechs` array (e.g., `["icarus-x"]`).

## Troubleshooting

- "Unlocked card still shows as locked":
  - Confirm backend response includes `unlockedNoetechs`.
  - Check that `addUnlockedNoetechs` is called (console logs in AuthContext can help).
  - Verify `localStorage.user` contains the updated `unlockedNoetechs` array.
- "All cards locked even when logged in":
  - The app falls back to `["icarus-x"]` if `user.unlockedNoetechs` is missing or empty. Ensure the auth response includes the correct unlocked list.

## Notes

- Prior dev-time defaults that unlocked extra Noetechs have been superseded by the authenticated user data + save-to-unlock flow.
- Gating is currently applied to the Showcase gallery; apply the same `isUnlocked` check in any other UI that surfaces Noetechs.
