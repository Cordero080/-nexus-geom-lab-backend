import React from 'react';
import { Canvas } from '@react-three/fiber';
import AnimatedBackground from './AnimatedBackground';
import styles from './BackgroundCanvas.module.scss';

export default function BackgroundCanvas() {
  return (
    <div className={styles.backgroundCanvas}>
      <Canvas
        camera={{ position: [0, 0, 200], fov: 50 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          background: '#0a0015',
        }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
        <AnimatedBackground />
      </Canvas>
    </div>
  );
}
