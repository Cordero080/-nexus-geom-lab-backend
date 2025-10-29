# Scene Card Placeholders (Shape-Aware)

This feature shows a small geometric wireframe in a scene card’s thumbnail area when no image is available, using the scene’s saved shape type.

## What it does

- Reads `scene.config.objectType` (e.g., `box`, `icosahedron`, `sphere`, `torus`, `octahedron`).
- Renders a matching lightweight inline SVG outline:
  - `box`/`cube`: isometric cube (front + back squares connected)
  - `icosahedron`: stylized polyhedron (nested hex-like faces + connectors)
  - `octahedron`: diamond/dihedral outline with cross connectors
  - `sphere`: circle with equator + longitude arcs
  - `torus`: donut-shaped ring (two ellipses)
  - fallback: generic hex wireframe (if type missing/unknown)
- Uses a cyan→magenta gradient stroke and a subtle float/dash animation for visual polish.

## Why it helps

- Gives immediate “information scent” (shape hint) when thumbnails are missing or still loading.
- Keeps cards from looking empty, improving perceived performance.
- Matches the app’s geometric aesthetic without extra assets.

## Where

- Component: `src/components/Scenes/SceneCard.jsx`
- Styles: `src/components/Scenes/SceneCard.css`

## How it determines the shape

- Primary: `scene.config?.objectType` (saved with each scene)
- Secondary: `scene.objectType` (if present)
- Fallback: generic hex wireframe

## Customization

- Add more mappings: extend the `switch (objectType)` in `SceneCard.jsx` with a new SVG block.
- Colors: adjust gradient stops in the `<linearGradient>` inside the placeholder SVG.
- Motion: tweak or remove `geoFloat` / `dashMove` keyframes in `SceneCard.css`. Add a prefers-reduced-motion rule if needed.

## Accessibility & Performance

- Pure SVG (no external image requests). Lightweight DOM.
- Animations are subtle and low-frequency; consider honoring `prefers-reduced-motion` if your audience benefits.
