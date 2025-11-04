import React from 'react';
import TesseractGeometry from '../../TesseractGeometry';
import GlitchBurst from './GlitchBurst';

/**
 * IcarusCube - Dedicated cube configuration for Icarus character
 * Includes basic tesseract and glitch burst effects
 */
export default function IcarusCube({ size, animationTime, animationId }) {
  // Define punch times based on which Icarus animation is playing
  const punchTimes = animationId === 1 
    ? [1.1, 2.9, 3.4] // Solar Ascension punch moments
    : animationId === 4 
    ? [0.8, 1.2, 2.2] // Phoenix Dive punch moments (Qi Flow)
    : [];
  
  return (
    <>
      {/* Icarus's Basic Tesseract - Standard 4D hypercube wireframe */}
      <TesseractGeometry size={size} />
      
      {/* Glitch Burst effects at punch moments */}
      {punchTimes.length > 0 && (
        <GlitchBurst 
          triggerTimes={punchTimes} 
          animationTime={animationTime} 
        />
      )}
      
      {/* Interior point light - Pink/Magenta */}
      <pointLight
        position={[0, 0, 0]}
        color="#ff00ff"
        intensity={1.5}
        distance={size}
      />
    </>
  );
}
