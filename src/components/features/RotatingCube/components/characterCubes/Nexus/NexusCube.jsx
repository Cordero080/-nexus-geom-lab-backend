import React from 'react';
import TesseractGeometry from '../../TesseractGeometry';
import TripleTesseractGeometry from './TripleTesseractGeometry';

/**
 * NexusCube - Dedicated cube configuration for Nexus Prime character
 * Includes basic tesseract, triple tesseract, and green lighting
 */
export default function NexusCube({ size, fourthTesseractInnerRef, fourthTesseractOuterRef }) {
  return (
    <>
      {/* Nexus's Basic Tesseract */}
      <TesseractGeometry size={size} />
      
      {/* Triple Tesseract - Multiple animated layers */}
      <TripleTesseractGeometry 
        size={size} 
        fourthTesseractInnerRef={fourthTesseractInnerRef}
        fourthTesseractOuterRef={fourthTesseractOuterRef}
      />
      
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
