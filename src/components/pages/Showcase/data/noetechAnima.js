// ANIMATION CONFIGURATION
// Y-axis movement implementation: src/Showcase/models/FBXModel.jsx
// Usage in showcase viewer: src/Showcase/components/ShowcaseViewer/ShowcaseViewer.jsx
// Backgrounds are handled by environment components in ShowcaseViewer/environments/
export const noetechAnima = [
  {
    id: 1,
    noetechKey: 'icarus-x',
    animationId: 'solar-ascension',
    name: 'Icᐱrus-X #001',
    animation: 'Solar ᐱscension',
    variant: 'Code Breaker',
    description:
      'A Digital Phoenix ascending through cascading data streams...Breaking through firewalls of light',
    fbxUrl: '/models/icarus-bangs.fbx',
    scale: 0.023,
    galleryScale: 0.015,
    rotation: [0, 0, 0],
    positionY: -2.8,
    galleryPositionY: -2.0,
    offsetX: -0.2,
    offsetZ: 0.15,
    isDefaultAnimation: true,
  },
  {
    id: 4,
    noetechKey: 'icarus-x',
    animationId: 'phoenix-dive',
    name: 'Icᐱrus-X #001',
    animation: 'Qi Flow',
    variant: 'System Breach',
    description:
      'Diving through layers of encrypted geometries...Shattering digital barriers with each strike',
    fbxUrl: '/models/icarus-ninja-2.fbx',
    scale: 0.023,
    galleryScale: 0.015,
    rotation: [0, 0, 0],
    positionY: -2.8,
    galleryPositionY: 0.1,
    offsetX: -0.2,
    offsetZ: -0.5,
    isDefaultAnimation: false,
  },
  {
    id: 2,
    noetechKey: 'vectra',
    animationId: 'holographic-spellcast',
    name: 'Vectrᐱ   ᐱPEX #002',
    animation: 'Holographic Spellcast',
    variant: 'Spectral',
    description: 'The Ominous Anomaly Woven from Pure Hologram',
    fbxUrl: '/models/diabla-roja.fbx',
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
  },
  {
    id: 3,
    noetechKey: 'nexus',
    animationId: 'warrior-flip',
    name: 'Nexus-Prime #003',
    animation: 'Warrior Flip',
    variant: 'Shadow Striker',
    description: 'The ᐱrchitect of the Digital Nexus...Master of Cybergalactic Combat',
    fbxUrl: '/models/green-plexus-upper.fbx',
    scale: 0.02744,
    galleryScale: 0.02058,
    rotation: [0, 0, 0],
    positionY: -2.97,
    galleryPositionY: -2.27,
    offsetX: 0.2,
    offsetZ: -0.1,
    // Y-AXIS MOVEMENT CONTROL:
    // allowNaturalYMovement: true  = Model moves naturally in Y-axis (jumps, flips, etc.)
    // allowNaturalYMovement: false = Model feet anchored to ground (y=0)
    // Set to false for grounded animations, true for acrobatic/flying animations
    // Implementation: src/Showcase/models/FBXModel.jsx (line ~50-65)
    allowNaturalYMovement: false,
    isDefaultAnimation: true,
  },
  {
    id: 5,
    noetechKey: 'she-tech',
    animationId: 'cyber-dance',
    name: 'She-Tech #004',
    animation: 'Cyber Dance',
    variant: 'Neon Mystic',
    description: 'Digital Sorceress channeling pure energy...Dancing through datastreams',
    fbxUrl: '/models/anime-tech-capo.fbx',
    scale: 0.025,
    galleryScale: 0.018,
    rotation: [0, 1, 0],
    positionY: -5,
    galleryPositionY: -0.8,
    offsetX: -3,
    offsetZ: 1,
    allowNaturalYMovement: true,
    isDefaultAnimation: true,
  },
];
