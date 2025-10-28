# Save & Edit Workflow

## Overview

The application now supports two save modes:

1. **Save (Update)** - Update an existing scene you own
2. **Save As New** - Create a new copy of any scene

## User Flow

### Scenario 1: Creating a Fresh Scene

1. User creates geometry in the lab
2. Clicks "Save Scene" button
3. Modal opens showing:
   - Name input field
   - "Save As New" button (only option)
4. User enters name and clicks "Save As New"
5. New scene is created and user is redirected to `/scenes` page
6. The newly saved scene is highlighted with a glowing border for 3 seconds

### Scenario 2: Editing Your Own Scene

1. User loads their own scene from `/scenes` page
2. Makes modifications in the lab
3. Clicks "Save Scene" button
4. Modal opens showing:
   - Current scene name display
   - "Save (Update)" button - Updates the existing scene
   - Name input + "Save As New" button - Creates a copy with new name
5. Options:
   - Click "Save" to update existing scene
   - OR enter new name and click "Save As New" to create copy
6. User is redirected to `/scenes` page with appropriate scene highlighted

### Scenario 3: Remixing Someone Else's Scene

1. User loads another user's scene from showcase/gallery
2. Makes modifications in the lab
3. Clicks "Save Scene" button
4. Modal opens showing:
   - Name input field
   - "Save As New" button (only option - cannot update others' scenes)
5. User enters name and clicks "Save As New"
6. New scene is created under their account
7. User is redirected to `/scenes` page with new scene highlighted

## Technical Implementation

### Components

#### SaveControls.jsx

- Main save button that opens modal
- Modal with conditional UI based on ownership
- Handles both save and save-as-new operations
- Uses `isOwnScene()` from SceneContext to determine ownership

### API Calls

#### Save (Update Existing)

```javascript
PUT /api/scenes/:sceneId
Headers: Authorization: Bearer <token>
Body: {
  name: "Scene Name",
  description: "",
  config: { ...sceneConfig }
}
```

#### Save As New (Create Copy)

```javascript
POST /api/scenes
Headers: Authorization: Bearer <token>
Body: {
  name: "New Scene Name",
  description: "",
  config: { ...sceneConfig }
}
```

### Scene Ownership Tracking

The `SceneContext` tracks:

- `currentSceneId` - ID of loaded scene (null if fresh)
- `sceneOwner` - User ID who owns the scene
- `isOwnScene(userId)` - Function to check if user owns the scene

When a scene is loaded:

```javascript
loadScene(scene, currentUserId) {
  setCurrentSceneId(scene.id)
  setSceneOwner(scene.userId)
  // If currentUserId === scene.userId, user owns the scene
}
```

### Modal Logic

The SaveControls component determines which buttons to show:

```javascript
const canUpdate = currentSceneId && isOwnScene(user?.id);

// Show "Save (Update)" button only if canUpdate is true
// Always show "Save As New" button
```

## UI/UX Features

### Modal Styling

- Cyberpunk/futuristic theme matching app aesthetic
- Cyan/magenta gradient accents
- Glowing borders and animations
- Responsive layout

### Button States

- **Save (Update)**: Blue gradient, 💾 icon
- **Save As New**: Pink/magenta gradient, ✨ icon
- Both buttons show loading state ("Updating..." / "Creating...")

### Feedback

- Alert messages confirm successful save/update
- Navigation to `/scenes` page after save
- 3-second highlight on saved/updated scene
- Noetech unlocks displayed in success message

## Edge Cases Handled

1. **Not logged in**: Shows alert prompting user to log in
2. **Empty name**: Validation prevents saving with empty name
3. **Network errors**: Try-catch blocks show error alerts
4. **Concurrent saves**: Button disabled during save operation
5. **Scene deletion**: Context resets if deleted scene was loaded
6. **Highlight persistence**: Auto-clears after 3 seconds to prevent confusion

## Future Enhancements

Potential improvements:

- [ ] Add description field to save modal
- [ ] Show scene preview thumbnail in modal
- [ ] Add "Discard Changes" option when editing
- [ ] Implement autosave/draft functionality
- [ ] Add version history for scenes
- [ ] Show diff/comparison when updating existing scene
- [ ] Add confirmation modal for overwriting changes
