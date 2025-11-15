import React from 'react';
import * as THREE from 'three';
import CompoundTesseractGeometry from './CompoundTesseractGeometry';
import RadialSquares from './RadialSquares';

/**
 * VectraCube - Dedicated cube configuration for Vectra character
 * Includes compound tesseract and radial expanding effect
 */
export default function VectraCube({ size, animationTime }) {
  return (
    <>
      {/* Vectra's Compound Tesseract - 5 asymmetric nested cubes */}
      <CompoundTesseractGeometry size={size} />

      {/* Radial expanding tesseract effect - triggers at 1 second */}
      <RadialSquares animationTime={animationTime} cubeSize={size} />

      {/* Interior point light - Pink/Magenta */}
      <pointLight position={[0, 0, 0]} color="#ff00ff" intensity={1.5} distance={size} />
    </>
  );
}
