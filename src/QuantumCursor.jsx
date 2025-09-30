
import React, { useEffect } from "react";
import QuantumCursorUniverse from "./QuantumCursorUniverse";

export default function QuantumCursor() {
  useEffect(() => {
    // Initialize the quantum cursor system after mount
    const universe = new QuantumCursorUniverse();
    return () => {
      // No teardown logic in original script; could add cleanup if needed
    };
  }, []);

  // Render only the cursor and gravity field globally
  return (
    <>
      <div className="cursor" id="cursor"></div>
      <div className="gravity-field" id="gravity-field"></div>
    </>
  );
}
