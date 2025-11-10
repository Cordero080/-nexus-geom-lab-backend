import React from 'react';
import CompoundTesseractGeometry from '../Vectra/CompoundTesseractGeometry';

/**
 * NexusCube - Dedicated cube configuration for Nexus Prime character
 * Now uses Vectra's compound tesseract (5 nested cubes with asymmetric scaling)
 */
export default function NexusCube({ size }) {
  return (
    <>
      {/* Vectra's Compound Tesseract - 5 asymmetric nested cubes */}
      <CompoundTesseractGeometry size={size} />
      
      {/* Green reflective lighting - unique to Nexus Prime */}
      <pointLight 
        position={[4, 12, 4]} 
        color="#10c22e" 
        intensity={1.5} 
        distance={size} 
      />
    </>
  );
}
