// ANIMATION CONFIGURATION
// Y-axis movement implementation: src/Showcase/models/FBXModel.jsx
// Usage in showcase viewer: src/Showcase/components/ShowcaseViewer/ShowcaseViewer.jsx
export const mockAnimations = [
  {
    id: 1,
    noetechKey: "icarus-x",
    animationId: "solar-ascension",
    name: "Icᐱrus-X #001",
    animation: "Solar ᐱscension",
    variant: "Golden Phoenix",
    description:
      "The Transcendent Seraph...Reborn from Digital Ashes to Touch the Infinite",
    fbxUrl: "/models/icarus-bangs.fbx",
    scale: 0.023,
    galleryScale: 0.015,
    rotation: [0, 0, 0],
    positionY: -2.8,
    galleryPositionY: -2.0,
    offsetX: -0.2,
    offsetZ: 0.15,
    isDefaultAnimation: true,
    background:
      "linear-gradient(180deg, rgba(15, 5, 0, 0.95) 0%, rgba(255, 140, 0, 0.8) 20%, rgba(255, 215, 0, 0.7) 40%, rgba(255, 165, 0, 0.6) 60%, rgba(255, 69, 0, 0.7) 80%, rgba(139, 69, 19, 0.9) 100%)",
    viewerBackground:
      "linear-gradient(135deg, #2d1810 0%, #ff8c00 25%, #ffd700 50%, #ff8c00 75%, #2d1810 100%)",
  },
  {
    id: 4,
    noetechKey: "icarus-x",
    animationId: "phoenix-dive",
    name: "Icᐱrus-X #001",
    animation: "Qi Flow",
    variant: "Crimson Descent",
    description:
      "The Seraph's devastating descent from celestial heights...Wings ablaze with divine fury",
    fbxUrl: "/models/icarus-ninja-2.fbx",
    scale: 0.023,
    galleryScale: 0.015,
    rotation: [0, 0, 0],
    positionY: -2.8,
    galleryPositionY: 0.1,
    offsetX: -0.2,
    offsetZ: -0.5,
    isDefaultAnimation: false,
    background:
      "linear-gradient(180deg, rgba(20, 0, 0, 0.95) 0%, rgba(255, 69, 0, 0.8) 20%, rgba(220, 20, 60, 0.7) 40%, rgba(139, 0, 0, 0.6) 60%, rgba(178, 34, 34, 0.7) 80%, rgba(75, 0, 0, 0.9) 100%)",
    viewerBackground:
      "linear-gradient(135deg, #2d1010 0%, #ff4500 25%, #dc143c 50%, #ff4500 75%, #2d1010 100%)",
  },
  {
    id: 2,
    noetechKey: "vectra",
    animationId: "holographic-spellcast",
    name: "Vectrᐱ   ᐱPEX #002",
    animation: "Holographic Spellcast",
    variant: "Spectral",
    description: "The Ominous Anomaly Woven from Pure Hologram",
    fbxUrl: "/models/diabla-roja.fbx",
    scale: 0.025,
    galleryScale: 0.018,
    rotation: [0, 0, 0],
    positionY: -2.3,
    galleryPositionY: -1.5,
    offsetX: 0,
    offsetZ: 0,
    // Y-AXIS MOVEMENT CONTROL:
    // allowNaturalYMovement: true  = Model moves naturally in Y-axis (spellcasting gestures)
    // allowNaturalYMovement: false = Model feet anchored to ground (y=0)
    // Implementation: src/Showcase/models/FBXModel.jsx (line ~50-65)
    allowNaturalYMovement: true,
    isDefaultAnimation: true,
    background:
      "linear-gradient(180deg, rgba(0, 102, 255, 0.5) 0%, rgba(117, 250, 217, 0.7) 30%, rgba(214, 67, 243, 0.6) 70%, rgba(0, 255, 255, 0.5) 100%)",
  },
  {
    id: 3,
    noetechKey: "nexus",
    animationId: "warrior-flip",
    name: "Nexus-Prime #003",
    animation: "Warrior Flip",
    variant: "Shadow Striker",
    description:
      "The Quantum ᐱrchitect of the Digital Nexus...Master of hyperdimensional Combat",
    fbxUrl: "/models/green-plexus-upper.fbx",
    scale: 0.024,
    galleryScale: 0.018,
    rotation: [0, 0, 0],
    positionY: -3.1,
    galleryPositionY: -1.9,
    offsetX: 0.2,
    offsetZ: -0.1,
    // Y-AXIS MOVEMENT CONTROL:
    // allowNaturalYMovement: true  = Model moves naturally in Y-axis (jumps, flips, etc.)
    // allowNaturalYMovement: false = Model feet anchored to ground (y=0)
    // Set to false for grounded animations, true for acrobatic/flying animations
    // Implementation: src/Showcase/models/FBXModel.jsx (line ~50-65)
    allowNaturalYMovement: false,
    isDefaultAnimation: true,
    background:
      "linear-gradient(180deg, rgba(0, 20, 10, 0.95) 0%, rgba(0, 100, 50, 0.8) 15%, rgba(34, 139, 34, 0.7) 30%, rgba(0, 255, 127, 0.5) 45%, rgba(46, 125, 50, 0.7) 65%, rgba(0, 50, 25, 0.9) 85%, rgba(0, 0, 0, 0.95) 100%)",
    viewerBackground:
      "linear-gradient(135deg, #001a0d 0%, #003d1a 20%, #228b22 40%, #00ff7f 50%, #32cd32 60%, #006400 80%, #001a0d 100%)",
  },
];
