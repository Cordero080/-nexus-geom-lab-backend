import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RotatingCube from './RotatingCube';
import './ShowcaseViewer.css';

export default function ShowcaseViewer({ animation, onClose }) {
  return (
    <div className="viewer-overlay">
      <button className="viewer-back-button" onClick={onClose}>
        ← Back to Gallery
      </button>
      
      <button className="viewer-close" onClick={onClose}>
        ✕
      </button>
      
      <div className="viewer-canvas-container">
        <Canvas
          camera={{ position: [0, 0.8, 8], fov: 60 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.8} />
          {/* Spectral skylight - colorful lights from above */}
          <spotLight 
            position={[0, 10, 2]} 
            angle={0.4} 
            penumbra={0.4} 
            intensity={4} 
            color="#00ffff"
            castShadow
          />
          <spotLight 
            position={[0, 10, -2]} 
            angle={0.4} 
            penumbra={0.4} 
            intensity={3} 
            color="#ff00ff"
          />
          <pointLight position={[0, 8, 0]} intensity={3} color="#8800ff" distance={15} />
          {/* Directional light from right corner */}
          <directionalLight 
            position={[10, 2, 5]} 
            intensity={3} 
            color="#0088ff"
          />
          {/* Dramatic spotlights for spectral effect */}
          <spotLight 
            position={[0, 8, 5]} 
            angle={0.4} 
            penumbra={0.3} 
            intensity={3} 
            color="#00ffff"
            castShadow
          />
          <spotLight 
            position={[0, -5, 5]} 
            angle={0.4} 
            penumbra={0.4} 
            intensity={2} 
            color="#ff00ff"
          />
          <pointLight position={[5, 0, 3]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-5, 0, 3]} intensity={1.5} color="#ffffff" />
          <pointLight position={[0, 0, -5]} intensity={1} color="#ffff00" />
          
          {/* Big cube - pass size as prop */}
          <RotatingCube size={5} fbxUrl="/models/blue_robot.fbx" />
          
          {/* OrbitControls lets user rotate with mouse */}
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minDistance={5}
            maxDistance={15}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>
      
      <div className="viewer-info">
        <h2 className="viewer-title">{animation?.name || 'Cosmic Entity #001'}</h2>
        <p className="viewer-description">
          {animation?.description || 'A consciousness evolving inside a geometric vessel'}
        </p>
        <div className="viewer-meta">
          <span className="meta-tag">Animation: {animation?.animation || 'Idle'}</span>
          <span className="meta-tag">Variant: {animation?.variant || 'Cosmic Blue'}</span>
        </div>
      </div>
    </div>
  );
}
