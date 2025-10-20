import React, { useEffect, useRef } from "react";
import QuantumCursorUniverse from "./QuantumCursorUniverse";
import "./QuantumCursor.css";

/**
 * QuantumCursor component creates an interactive, particle-based cursor
 * that follows the mouse movement with quantum-inspired effects
 */
export default function QuantumCursor() {
  const universeRef = useRef(null);
  
  useEffect(() => {
    console.log("QuantumCursor mounted - initializing universe");
    
    // Ensure proper body classes for homepage cursor styling
    document.body.classList.remove('playground-page');
    
    // Force cursor to be hidden with !important
    document.documentElement.style.setProperty('cursor', 'none', 'important');
    document.body.style.setProperty('cursor', 'none', 'important');
    
    // Initialize the quantum cursor system after mount
    const universe = new QuantumCursorUniverse();
    universeRef.current = universe;
    
    // Cleanup function to remove particles and restore cursor
    return () => {
      console.log("QuantumCursor unmounted - cleaning up");
      
      // Remove any created particles when component unmounts
      if (universeRef.current) {
        // Clean up particles
        universeRef.current.particles.forEach(particle => {
          if (particle.element && particle.element.parentNode) {
            particle.element.parentNode.removeChild(particle.element);
          }
        });
        
        // Clean up energy waves
        universeRef.current.energyWaves.forEach(wave => {
          if (wave.element && wave.element.parentNode) {
            wave.element.parentNode.removeChild(wave.element);
          }
        });
      }
    };
  }, []);
  
  return (
    <div className="quantum-cursor-container">
      <div id="cursor" className="cursor"></div>
      <div id="gravity-field" className="gravity-field"></div>
      <div id="wormhole" className="wormhole"></div>
      <div id="dimensional-rift" className="dimensional-rift"></div>
    </div>
  );
}