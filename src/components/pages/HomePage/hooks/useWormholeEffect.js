import { useEffect } from "react";

/**
 * Custom hook for wormhole ripple effect on click
 * Positions wormhole element at click coordinates and triggers ripple animation
 */
export default function useWormholeEffect() {
  useEffect(() => {
    const handleClick = (e) => {
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
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
      const wormhole = document.getElementById("wormhole");
      if (wormhole) {
        wormhole.classList.remove("ripple");
        wormhole.style.left = "";
        wormhole.style.top = "";
      }
    };
  }, []);
}
