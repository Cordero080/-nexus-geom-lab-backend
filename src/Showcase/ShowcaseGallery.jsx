import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import RotatingCube from './RotatingCube';
import ShowcaseViewer from './ShowcaseViewer';
import './ShowcaseGallery.css';

export default function ShowcaseGallery() {
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const location = useLocation();
  
  // Close viewer when navigating (e.g., clicking Showcase link in nav)
  useEffect(() => {
    setSelectedAnimation(null);
  }, [location]);
  
  // Mock data - will come from backend later
  const mockAnimations = [
    {
      id: 1,
      name: 'Cosmic Entity #001',
      animation: 'Idle',
      variant: 'Cosmic Blue',
      description: 'A consciousness evolving inside a geometric vessel, suspended in the void between dimensions.',
      fbxUrl: '/models/blue_robot.fbx',
      scale: 0.001275,
      background: 'linear-gradient(225deg, #0a0015 0%, #0066ff 20%, #d643f3ed 50%, #0066ff 80%, #0a0015 100%)'
    },
    {
      id: 2,
      name: 'Tech Feline #002',
      animation: 'Break Dance',
      variant: 'Arctic White',
      description: 'A technological guardian frozen in digital meditation, awaiting its next command.',
      fbxUrl: '/models/white-cat-break-1.fbx',
      scale: 0.00024368,
      galleryScale: 0.0001617,
      rotation: [0, 0, 0],
      positionY: -2.2,
      galleryPositionY: -1.5,
      offsetX: 0.05,
      offsetZ: 0,
      background: 'linear-gradient(135deg, #0a0015 0%, #75fad9ff 25%, #d643f3ed 50%, #00ffff 75%, #0a0015 100%)'
    }
  ];
  
  return (
    <>
      <div className="showcase-container">
        <div className="showcase-header">
          <h1 className="showcase-title">The Transcendence Chamber</h1>
          <p className="showcase-subtitle">
            A collection of consciousness evolving inside geometric vessels
          </p>
        </div>
        
        <div className="showcase-grid">
          {mockAnimations.map((animation) => (
            <div 
              key={animation.id}
              className="showcase-card"
              onClick={() => setSelectedAnimation(animation)}
              style={animation.background ? { background: animation.background } : {}}
            >
              <Canvas
                camera={{ position: [0, 2, 4], fov: 65 }}
                style={{ width: '100%', height: '100%' }}
              >
                <ambientLight intensity={0.5} />
                {/* Dramatic spotlights shining through the character */}
                <spotLight 
                  position={[0, 5, 3]} 
                  angle={0.5} 
                  penumbra={0.5} 
                  intensity={2} 
                  color="#00ffff"
                  castShadow
                />
                <spotLight 
                  position={[0, -3, 3]} 
                  angle={0.4} 
                  penumbra={0.5} 
                  intensity={1.5} 
                  color="#ff00ff"
                />
                <pointLight position={[3, 0, 2]} intensity={1} color="#ffffff" />
                <pointLight position={[-3, 0, 2]} intensity={1} color="#ffffff" />
                <RotatingCube 
                  fbxUrl={animation.fbxUrl} 
                  scale={animation.galleryScale || animation.scale} 
                  rotation={animation.rotation} 
                  positionY={animation.galleryPositionY || animation.positionY} 
                  offsetX={animation.offsetX} 
                  offsetZ={animation.offsetZ}
                  cubeY={0.3}
                />
              </Canvas>
              
              <div className="card-info">
                <h3>{animation.name}</h3>
                <p>Animation: {animation.animation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Full screen viewer modal */}
      {selectedAnimation && (
        <ShowcaseViewer 
          animation={selectedAnimation}
          onClose={() => setSelectedAnimation(null)}
        />
      )}
    </>
  );
}
