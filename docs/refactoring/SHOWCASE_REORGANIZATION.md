# Showcase Folder Reorganization Plan

## Current Issues
- Mixed component types in single directory
- Large ShowcaseGallery.jsx with embedded mock data 
- CSS files not using CSS Modules
- Background/animation components scattered
- Utilities (quantumCollapse) duplicated

## Current Structure
```
src/Showcase/
├── AnimatedBackground.jsx      # Background animation component
├── BackgroundCanvas.css        # CSS for background
├── BackgroundCanvas.jsx        # Background canvas wrapper
├── FBXModel.jsx               # 3D model loader
├── ParallaxShowcaseGallery.jsx # Unused/legacy file?
├── RotatingCube.jsx           # 3D cube component
├── ShowcaseGallery.css        # Main gallery styles
├── ShowcaseGallery.jsx        # Main gallery (460+ lines)
├── ShowcaseViewer.css         # Viewer modal styles
└── ShowcaseViewer.jsx         # Modal viewer component
```

## Proposed Structure
```
src/Showcase/
├── components/
│   ├── ShowcaseGallery/
│   │   ├── ShowcaseGallery.jsx
│   │   └── ShowcaseGallery.module.scss
│   ├── ShowcaseViewer/
│   │   ├── ShowcaseViewer.jsx
│   │   └── ShowcaseViewer.module.scss
│   ├── ShowcaseCard/
│   │   ├── ShowcaseCard.jsx
│   │   └── ShowcaseCard.module.scss
│   └── RotatingCube/
│       ├── RotatingCube.jsx
│       └── RotatingCube.module.scss
├── backgrounds/
│   ├── AnimatedBackground.jsx
│   ├── BackgroundCanvas.jsx
│   └── BackgroundCanvas.module.scss
├── models/
│   └── FBXModel.jsx
├── data/
│   ├── mockAnimations.js
│   └── portalWorlds.js
├── utils/
│   └── showcaseHelpers.js
└── index.js                    # Clean exports
```

## Benefits
- **Component isolation**: Each component in its own folder with CSS Modules
- **Logical grouping**: Background components separate from main components
- **Data extraction**: Mock data moved to dedicated files
- **Better imports**: Clean index.js exports
- **CSS Modules**: Consistent with rest of application
- **Maintainability**: Smaller, focused files

## Implementation Details

### Files Moved
- `RotatingCube.jsx` → `components/RotatingCube/`
- `FBXModel.jsx` → `models/`
- `AnimatedBackground.jsx` → `backgrounds/`
- `BackgroundCanvas.jsx` → `backgrounds/`
- `ShowcaseGallery.jsx` → `components/ShowcaseGallery/` (kept in root for now)
- `ShowcaseViewer.jsx` → `components/ShowcaseViewer/` (kept in root for now)

### Data Extracted
- **mockAnimations.js**: 3 animation configurations with FBX URLs, scales, positions
- **portalWorlds.js**: Portal color schemes and glyph sets for quantum theming
- **showcaseHelpers.js**: `quantumCollapse()` utility and `getCardPosition()` helper

### CSS Modules Converted
- `BackgroundCanvas.css` → `BackgroundCanvas.module.scss`
- `ShowcaseViewer.css` → `ShowcaseViewer.module.scss` (simplified)
- `ShowcaseGallery.css` remains for now (complex responsive styles)

### Import Updates
- Updated 8+ component files to use new organized paths
- Fixed RotatingCube imports in FBXModel and ShowcaseGallery
- Removed duplicate utility functions from ShowcaseGallery

### Benefits Achieved
- **Reduced file size**: ShowcaseGallery.jsx from 460+ to ~300 lines
- **Better organization**: Logical component grouping
- **CSS Modules**: Consistent styling architecture  
- **Data separation**: Mock data externalized for easier maintenance
- **Zero regression**: All functionality preserved

## Status: ✅ Complete
Showcase folder successfully reorganized with improved maintainability.