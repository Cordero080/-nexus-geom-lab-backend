import React, { useState, useEffect } from 'react';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Canvas } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import RotatingCube from './RotatingCube';
import ShowcaseViewer from './ShowcaseViewer';
import './ShowcaseGallery.css';

export default function ShowcaseGallery() {
  // ...existing code...
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [preloadedModels, setPreloadedModels] = useState({}); // { [id]: fbx }
  const [modelLoaded, setModelLoaded] = useState({}); // { [id]: true }
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
      scale: 0.00024,
      galleryScale: 0.000147,
      rotation: [0, 0, 0],
      positionY: -2.2,
      galleryPositionY: -1.5,
      offsetX: 0.05,
      offsetZ: 0,
      background: 'linear-gradient(135deg, #0a0015 0%, #75fad9ff 25%, #d643f3ed 50%, #00ffff 75%, #0a0015 100%)'
    },
    {
      id: 3,
      name: 'Fire-Tech Warrior #003',
      animation: 'Combat Stance',
      variant: 'Crimson Flame',
      description: 'A battle-hardened entity radiating pure kinetic energy, ready to strike.',
      fbxUrl: '/models/red-tech-cat.fbx',
      scale: 0.02375,
      galleryScale: 0.01425,
      rotation: [0, 0, 0],
      positionY: -2.2,
      galleryPositionY: -1.5,
      offsetX: -0.4,
      offsetZ: 0.1,
      background: 'linear-gradient(180deg, #0a0015 0%, #ff3300 20%, #d643f3ed 50%, #60042eff 80%, #0a0015 100%)'
    }
  ];

  // Preload all FBX models in parallel on mount
  useEffect(() => {
    let isMounted = true;
    const loader = new FBXLoader();
    const promises = mockAnimations.map((animation) => {
      return new Promise((resolve, reject) => {
        loader.load(
          animation.fbxUrl,
          (fbx) => resolve({ id: animation.id, fbx }),
          undefined,
          (err) => reject(err)
        );
      });
    });
    Promise.all(promises).then((results) => {
      if (!isMounted) return;
      const models = {};
      results.forEach(({ id, fbx }) => {
        models[id] = fbx;
      });
      setPreloadedModels(models);
    });
    return () => { isMounted = false; };
  }, []);

  // Determine position for each card: center, left, right pattern
  const getCardPosition = (index) => {
    const positions = ['center', 'left', 'right'];
    return positions[index % positions.length];
  };

  return (
    <>
      <div className="parallax-showcase-container">
        {mockAnimations.map((animation, index) => {
          const position = getCardPosition(index);
          return (
            <div
              key={animation.id}
              className={`parallax-scene parallax-scene-${position}`}
              style={animation.background ? { background: animation.background } : {}}
            >
              <div
                className="parallax-model-card"
                onClick={() => setSelectedAnimation(animation)}
                onMouseEnter={() => setHoveredCard(animation.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Canvas
                  camera={{ position: [0, 2, 4], fov: 65 }}
                  style={{ width: '100%', height: '100%', opacity: modelLoaded[animation.id] ? 1 : 0, transition: 'opacity 0.7s'}}
                >
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
                  <RotatingCube
                    fbxUrl={animation.fbxUrl}
                    scale={animation.galleryScale || animation.scale}
                    rotation={animation.rotation}
                    positionY={animation.galleryPositionY || animation.positionY}
                    offsetX={animation.offsetX}
                    offsetZ={animation.offsetZ}
                    cubeY={0.3}
                    isPlaying={hoveredCard === animation.id}
                    onModelLoaded={() => setModelLoaded(prev => ({...prev, [animation.id]: true}))}
                    preloadedModel={preloadedModels[animation.id]}
                  />
                </Canvas>
                {!modelLoaded[animation.id] && (
                  <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,0,21,0.7)', zIndex: 2}}>
                    <div className="loader-spinner" />
                  </div>
                )}
              </div>
              
              <div className="parallax-info">
                <h2 className="parallax-title">{animation.name}</h2>
                <p className="parallax-animation">{animation.animation}</p>
                <p className="parallax-description">{animation.description}</p>
              </div>
            </div>
          );
        })}
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
