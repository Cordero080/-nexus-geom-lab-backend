import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RotatingCube from '../RotatingCube/RotatingCube';
import './ShowcaseViewer.module.scss';
import sharedStyles from '../../../styles/shared.module.scss';

export default function ShowcaseViewer({ animation, onClose }) {
  // Store the mounted state to handle animations properly
  const [mounted, setMounted] = React.useState(false);
  
  // Run once component mounts
  React.useEffect(() => {
    // Immediately freeze background scrolling
    document.body.style.overflow = 'hidden';
    
    // Slight delay before showing the content (but backdrop appears immediately)
    setTimeout(() => setMounted(true), 50);
    
    return () => {
      // Restore scrolling when component unmounts
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      {/* Immediate backdrop that appears instantly */}
      <div className="viewer-backdrop" />
      
      <div 
        className={`viewer-overlay viewer-overlay-${animation?.id || 1}`}
        style={{
          opacity: mounted ? 1 : 0
        }}
      >
        <button className={`viewer-back-button-bottom ${sharedStyles.angledCorners}`} onClick={onClose}>
          ← Back
        </button>
        
        <button className={`viewer-close ${sharedStyles.angledCorners}`} onClick={onClose}>
          ✕
        </button>
      
      <div className="viewer-canvas-container">
            <Canvas
              camera={{ position: [0, 0.8, 8], fov: 60 }}
              style={{ width: '100%', height: '100%', flex: '1 1 auto' }}
        >
          <ambientLight intensity={0.64} />
          {/* Spectral skylight - colorful lights from above */}
          <spotLight 
            position={[0, 10, 2]} 
            angle={0.4} 
            penumbra={0.4} 
            intensity={3.2} 
            color="#00ffff"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <spotLight 
            position={[0, 10, -2]} 
            angle={0.4} 
            penumbra={0.4} 
            intensity={2.4} 
            color="#ff00ff"
          />
          <pointLight position={[0, 8, 0]} intensity={2.4} color="#8800ff" distance={15} />
          {/* Directional light from top right corner */}
          <directionalLight 
            position={[10, 8, 5]} 
            intensity={3} 
            color="#0088ff"
          />
          {/* Dramatic spotlights for spectral effect */}
          <spotLight 
            position={[0, 8, 5]} 
            angle={0.4} 
            penumbra={0.3} 
            intensity={2.4} 
            color="#00ffff"
          />
          <spotLight 
            position={[0, -5, 5]} 
            angle={0.4} 
            penumbra={0.4} 
            intensity={1.6} 
            color="#ff00ff"
          />
          <pointLight position={[5, 6, 3]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-5, 0, 3]} intensity={1.2} color="#ffffff" />
          <pointLight position={[0, 0, -5]} intensity={0.8} color="#ffff00" />
          
          {/* Big cube - pass size as prop */}
          <RotatingCube size={4.5} fbxUrl={animation?.fbxUrl} scale={animation?.scale} rotation={animation?.rotation} positionY={animation?.positionY} offsetX={animation?.offsetX} offsetZ={animation?.offsetZ} cubeY={-0.1} allowNaturalYMovement={animation?.allowNaturalYMovement} />
          
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
    </>
  );
}
