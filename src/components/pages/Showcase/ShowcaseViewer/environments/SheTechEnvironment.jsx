import React from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * SheTechEnvironment - Cyberpunk fantasy horizon background
 * Creates a glowing neon cityscape horizon effect
 * Styles defined in: sheTechEnvironment.module.scss
 */

// Cyberpunk color palette - matches SCSS gradient
const COLORS = {
  hotPink: '#ff0096',
  cyan: '#00ffff',
  purple: '#8a2be2',
  deepPink: '#ff1493',
  indigo: '#4b0082',
  darkPurple: '#3d0052',
  veryDarkPurple: '#1b0028',
  almostBlack: '#0a0014',
};

export default function SheTechEnvironment() {
  const { scene } = useThree();

  React.useEffect(() => {
    // Create cyberpunk gradient background
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    // Create radial gradient from bottom (horizon glow)
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height,
      0,
      canvas.width / 2,
      canvas.height,
      canvas.height
    );

    // Cyberpunk color stops - glowing horizon
    gradient.addColorStop(0, COLORS.hotPink);
    gradient.addColorStop(0.15, COLORS.cyan);
    gradient.addColorStop(0.3, COLORS.purple);
    gradient.addColorStop(0.45, COLORS.deepPink);
    gradient.addColorStop(0.6, COLORS.indigo);
    gradient.addColorStop(0.75, COLORS.darkPurple);
    gradient.addColorStop(0.9, COLORS.veryDarkPurple);
    gradient.addColorStop(1, COLORS.almostBlack);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create texture and apply to scene
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    scene.background = texture;

    return () => {
      scene.background = null;
      texture.dispose();
    };
  }, [scene]);

  return null;
}
