import React, { useEffect } from "react";
import QuantumCursorUniverse from "./QuantumCursorUniverse";
import "./QuantumCursor.css";

/**
 * QuantumCursor component creates an advanced interactive cursor system
 * with particles, energy waves, and special effects that respond to user input
 */
export default function QuantumCursor() {
  useEffect(() => {
    // Initialize the quantum cursor system after mount
    const universe = new QuantumCursorUniverse();
    return () => {
      // Cleanup function that could be expanded if needed
    };
  }, []);

  // Render cursor elements - actual behavior is managed by QuantumCursorUniverse class
  return (
    <>
      <div className="cursor" id="cursor"></div>
      <div className="gravity-field" id="gravity-field"></div>
      <div className="wormhole" id="wormhole"></div>
      <div className="dimensional-rift" id="dimensional-rift"></div>
    </>
  );
}