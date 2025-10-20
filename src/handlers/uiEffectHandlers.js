/**
 * UI Effect Handlers for interactive UI features
 * These handlers manage various UI effects, animations, and interactions
 */

export const handleQuantumCollapse =
  (portalWorlds, glyphSets, setPortalState, setGlyphState) => () => {
    setPortalState(quantumCollapse(portalWorlds));
    setGlyphState(quantumCollapse(glyphSets));
  };

export const handleWormholeClick = () => (e) => {
  const wormhole = document.getElementById("wormhole");
  if (!wormhole) return;
  const size = 170;
  const x = e.clientX - size / 2;
  const y = e.clientY - size / 2;
  wormhole.style.left = `${x}px`;
  wormhole.style.top = `${y}px`;
  wormhole.classList.remove("ripple");
  void wormhole.offsetWidth;
  wormhole.classList.add("ripple");
};

export const handleParallax = (bgRef, fgRef) => (e) => {
  const scrollY = window.scrollY;
  const wh = window.innerHeight;
  // Mouse position (centered -0.5 to 0.5)
  let mx = 0,
    my = 0;
  if (e && e.type === "mousemove") {
    mx = e.clientX / window.innerWidth - 0.5;
    my = e.clientY / window.innerHeight - 0.5;
  }
  // Parallax: background moves slowest, foreground fastest
  if (bgRef.current) {
    bgRef.current.style.transform = `translate3d(${mx * 30}px, ${
      -scrollY * 0.08 + my * 20
    }px, 0)`;
  }
  if (fgRef.current) {
    fgRef.current.style.transform = `translate3d(${mx * 80}px, ${
      -scrollY * 0.18 + my * 40
    }px, 0)`;
  }
};

export const handleSceneScroll = (parallaxRef, setActiveScene) => () => {
  if (!parallaxRef.current) return;
  const container = parallaxRef.current;
  const scenes = Array.from(container.querySelectorAll(".quantum-scene"));
  const scrollY = window.scrollY;
  let found = 0;
  for (let i = 0; i < scenes.length; i++) {
    const rect = scenes[i].getBoundingClientRect();
    if (
      rect.top <= window.innerHeight * 0.33 &&
      rect.bottom > window.innerHeight * 0.33
    ) {
      found = i;
      break;
    }
  }
  setActiveScene(found);
};

// Utility function for quantum effects
export const quantumCollapse = (states) => {
  return states[Math.floor(Math.random() * states.length)];
};
