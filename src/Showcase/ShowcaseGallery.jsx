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
  const mockAnimation = {
    id: 1,
    name: 'Cosmic Entity #001',
    animation: 'Idle',
    variant: 'Cosmic Blue',
    description: 'A consciousness evolving inside a geometric vessel, suspended in the void between dimensions.'
  };
  
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
          {/* Single cube for now - we'll add more later */}
          <div 
            className="showcase-card"
            onClick={() => setSelectedAnimation(mockAnimation)}
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
            <RotatingCube fbxUrl="/models/blue_robot.fbx" />
          </Canvas>
          
          <div className="card-info">
            <h3>Cosmic Entity #001</h3>
            <p>Animation: Idle</p>
          </div>
          </div>
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
