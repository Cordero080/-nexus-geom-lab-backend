import { useState, useEffect } from "react";
import quantumCollapse from "../utils/quantumCollapse";
import { portalWorlds, glyphSets } from "../utils/portalWorlds";

/**
 * Custom hook for managing quantum state (portal colors and glyphs)
 * Collapses state on scroll or click events
 */
export default function useQuantumState() {
  const [portalState, setPortalState] = useState(() =>
    quantumCollapse(portalWorlds)
  );
  const [glyphState, setGlyphState] = useState(() =>
    quantumCollapse(glyphSets)
  );

  // Collapse state on scroll or click
  useEffect(() => {
    const handle = () => {
      setPortalState(quantumCollapse(portalWorlds));
      setGlyphState(quantumCollapse(glyphSets));
    };
    window.addEventListener("scroll", handle);
    window.addEventListener("click", handle);
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("click", handle);
    };
  }, []);

  // Manual collapse handler
  function handleQuantumCollapse() {
    setPortalState(quantumCollapse(portalWorlds));
    setGlyphState(quantumCollapse(glyphSets));
  }

  return { portalState, glyphState, handleQuantumCollapse };
}
