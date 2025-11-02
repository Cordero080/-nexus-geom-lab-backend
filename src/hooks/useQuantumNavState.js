import { useState, useEffect, useCallback } from "react";
import { quantumCollapse } from "../utils/coreHelpers";

const PORTAL_WORLDS = [
  { colors: ["#ff00cc", "#00fff7", "#1a003a"], label: "Fractal" },
  { colors: ["#ffea00", "#7300ff", "#003a2a"], label: "Nebula" },
  { colors: ["#ff3300", "#cc00ff", "#0a0f1a"], label: "Inferno" },
  { colors: ["#00ff33", "#00aaff", "#003a3a"], label: "Emerald" },
  { colors: ["#ffffff", "#00fff7", "#0a0f1a"], label: "Singularity" },
];

const GLYPH_SETS = [
  ["ψ", "Ω", "Σ"],
  ["λ", "Φ", "Ξ"],
  ["π", "Δ", "Γ"],
  ["μ", "θ", "ζ"],
  ["τ", "β", "η"],
];

export function useQuantumNavState() {
  const [portalState, setPortalState] = useState(() =>
    quantumCollapse(PORTAL_WORLDS)
  );
  const [glyphState, setGlyphState] = useState(() =>
    quantumCollapse(GLYPH_SETS)
  );

  const handleQuantumCollapse = useCallback(() => {
    setPortalState(quantumCollapse(PORTAL_WORLDS));
    setGlyphState(quantumCollapse(GLYPH_SETS));
  }, []);

  useEffect(() => {
    const onScroll = () => handleQuantumCollapse();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("click", handleQuantumCollapse);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", handleQuantumCollapse);
    };
  }, [handleQuantumCollapse]);

  return { portalState, glyphState, handleQuantumCollapse };
}
