
import React, { useState, useEffect, useRef } from 'react';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Canvas } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import RotatingCube from './RotatingCube';
import ShowcaseViewer from './ShowcaseViewer';
import './ShowcaseGallery.css';

export default function ShowcaseGallery() {
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [preloadedModels, setPreloadedModels] = useState({});
  const [modelLoaded, setModelLoaded] = useState({});
  const [loadingModels, setLoadingModels] = useState(new Set());
  const location = useLocation();
  const containerRef = useRef(null);

  // Close viewer when navigating and manage document body overflow
  useEffect(() => {
    setSelectedAnimation(null);
  }, [location]);
  
  // Prevent background scrolling and manage visibility when viewer is open
  useEffect(() => {
    if (selectedAnimation) {
      // Disable scrolling on body when viewer is open
      document.body.style.overflow = 'hidden';
      
      // Hide the container when viewer is open
      if (containerRef.current) {
        containerRef.current.style.visibility = 'hidden';
      }
    } else {
      // Re-enable scrolling when viewer is closed
      document.body.style.overflow = '';
      
      // Show the container when viewer is closed
      if (containerRef.current) {
        containerRef.current.style.visibility = 'visible';
      }
    }
    
    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = '';
    };
  }, [selectedAnimation]);

  // Scroll progress bar and title fade
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const scrollProgress = (container.scrollTop / (container.scrollHeight - container.clientHeight)) * 100;
      const progressBar = document.querySelector('.scroll-progress');
      if (progressBar) {
        progressBar.style.width = scrollProgress + '%';
      }
      
      // Fade out title when scrolling
      const titleOverlay = document.querySelector('.showcase-title-overlay');
      if (titleOverlay) {
        const scrollTop = container.scrollTop;
        const fadeStart = 100; // Start fading after 100px
        const fadeEnd = 300; // Fully faded by 300px
        
        if (scrollTop < fadeStart) {
          titleOverlay.style.opacity = '1';
        } else if (scrollTop > fadeEnd) {
          titleOverlay.style.opacity = '0';
        } else {
          const fadeProgress = (scrollTop - fadeStart) / (fadeEnd - fadeStart);
          titleOverlay.style.opacity = String(1 - fadeProgress);
        }
      }
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('parallax-info-visible');
          }
        });
      },
      { threshold: 0.3 }
    );

    const infoElements = document.querySelectorAll('.parallax-info');
    infoElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [modelLoaded]);

  // Mock data
  const mockAnimations = [
    {
      id: 1,
      name: 'Blu-Khan #001',
      animation: '',
      variant: 'Cosmic Blue',
      description: 'The Cyber-Sentient Known As ',
      fbxUrl: '/models/blue_robot.fbx',
      scale: 0.001275,
      background: 'linear-gradient(180deg, rgba(10, 0, 21, 0.95) 0%, rgba(8, 141, 236, 0.78) 30%, rgba(214, 67, 243, 0.6) 70%, rgba(0, 102, 255, 0.5) 100%)',
      // Enhanced viewer background (brighter version specifically for this model)
      viewerBackground: 'linear-gradient(135deg, #1c0038 0%, #3b78ff 50%, #1c0038 100%)'
    },
    {
      id: 2,
      name: 'Prismia #002',
      animation: 'Break Dance',
      variant: 'Spectral',
      description: 'The Iridescent Anomaly Woven from Pure Hologram',
      fbxUrl: '/models/white-cat-break-1.fbx',
      scale: 0.00024,
      galleryScale: 0.000147,
      rotation: [0, 0, 0],
      positionY: -2.2,
      galleryPositionY: -1.5,
      offsetX: 0.05,
      offsetZ: 0,
      background: 'linear-gradient(180deg, rgba(0, 102, 255, 0.5) 0%, rgba(117, 250, 217, 0.7) 30%, rgba(214, 67, 243, 0.6) 70%, rgba(0, 255, 255, 0.5) 100%)',
      // Enhanced viewer background (brighter cyan-themed background for this model)
      viewerBackground: 'linear-gradient(135deg, #003045 0%, #00e5ff 50%, #003045 100%)'
    },
    {
      id: 3,
      name: 'Magna-tek #003',
      animation: 'Combat Stance',
      variant: 'Crimson Flame',
      description: 'Fiery Radiance Made Manifest...The Mythic Sentinel of Sector 080',
      fbxUrl: '/models/red-tech-cat.fbx',
      scale: 0.02375,
      galleryScale: 0.01425,
      rotation: [0, 0, 0],
      positionY: -2.2,
      galleryPositionY: -1.5,
      offsetX: -0.4,
      offsetZ: 0.1,
      background: 'linear-gradient(180deg, rgba(0, 255, 255, 0.5) 0%, rgba(255, 51, 0, 0.7) 30%, rgba(214, 67, 243, 0.6) 70%, rgba(96, 4, 46, 0.8) 100%)',
      // Enhanced viewer background (brighter fire-themed background for this model)
      viewerBackground: 'linear-gradient(135deg, #300a00 0%, #ff3000 50%, #300a00 100%)'
    },
    {
      id: 4,
      name: 'Nexus-Prime #004',
      animation: 'Warrior Flip',
      variant: 'Shadow Striker',
      description: 'The Quantum Architect of the Digital Nexus...Master of Dimensional Combat',
      fbxUrl: '/models/alien_front_flip.fbx',
      scale: 0.0023,
      galleryScale: 0.002,
      rotation: [0, 0, 0],
      positionY: -2.8,
      galleryPositionY: -2.0,
      offsetX: 0.2,
      offsetZ: -0.1,
      background: 'linear-gradient(180deg, rgba(5, 5, 15, 0.95) 0%, rgba(139, 0, 0, 0.8) 20%, rgba(220, 20, 60, 0.6) 40%, rgba(178, 34, 34, 0.7) 60%, rgba(25, 25, 112, 0.8) 80%, rgba(0, 0, 0, 0.9) 100%)',
      // Enhanced viewer background (ominous deep space with crimson solar flares)
      viewerBackground: 'linear-gradient(135deg, #000008 0%, #1a0000 15%, #8b0000 30%, #dc143c 50%, #8b0000 70%, #1a0000 85%, #000008 100%)'
    },
    {
      id: 5,
      name: 'Icarus-X #005',
      animation: 'Solar Ascension',
      variant: 'Golden Phoenix',
      description: 'The Transcendent Seraph...Reborn from Digital Ashes to Touch the Infinite',
      fbxUrl: '/models/icarus.fbx',
      scale: 0.02,
      galleryScale: 0.015,
      rotation: [0, 0, 0],
      positionY: -1.8,
      galleryPositionY: -1.5,
      offsetX: 0,
      offsetZ: 0,
      background: 'linear-gradient(180deg, rgba(15, 5, 0, 0.95) 0%, rgba(255, 140, 0, 0.8) 20%, rgba(255, 215, 0, 0.7) 40%, rgba(255, 165, 0, 0.6) 60%, rgba(255, 69, 0, 0.7) 80%, rgba(139, 69, 19, 0.9) 100%)',
      // Enhanced viewer background (radiant golden sunrise with warm amber tones)
      viewerBackground: 'linear-gradient(135deg, #2d1810 0%, #ff8c00 25%, #ffd700 50%`, #ff8c00 75%, #2d1810 100%)'
    }
  ];

  // Load first model immediately, others on-demand (lazy loading)
  useEffect(() => {
    let isMounted = true;
    const loader = new FBXLoader();
    // Only preload the first model to avoid initial freeze
    const firstModel = mockAnimations[0];
    
    if (firstModel) {
      loader.load(
        firstModel.fbxUrl,
        (fbx) => {
          if (!isMounted) return;
          setPreloadedModels({ [firstModel.id]: fbx });
        },
        undefined,
        (err) => console.error(`Failed to preload first model:`, err)
      );
    }
    return () => { isMounted = false; };
  }, []);

  // Load model on demand when user interacts with a card
  const loadModelOnDemand = (animationId) => {
    if (preloadedModels[animationId] || loadingModels.has(animationId)) {
      return; // Already loaded or loading
    }

    setLoadingModels(prev => new Set(prev).add(animationId));
    const animation = mockAnimations.find(a => a.id === animationId);
    
    if (!animation) return;

    const loader = new FBXLoader();
    loader.load(
      animation.fbxUrl,
      (fbx) => {
        setPreloadedModels(prev => ({
          ...prev,
          [animationId]: fbx
        }));
        setLoadingModels(prev => {
          const newSet = new Set(prev);
          newSet.delete(animationId);
          return newSet;
        });
      },
      undefined,
      (err) => {
        console.error(`Failed to load model ${animationId}:`, err);
        setLoadingModels(prev => {
          const newSet = new Set(prev);
          newSet.delete(animationId);
          return newSet;
        });
      }
    );
  };

  // Determine position for each card
  const getCardPosition = (index) => {
    const positions = ['center', 'left', 'right'];
    return positions[index % positions.length];
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ visibility: selectedAnimation ? 'hidden' : 'visible' }} />

      <div 
        className="parallax-showcase-container" 
        ref={containerRef}
        style={{ visibility: selectedAnimation ? 'hidden' : 'visible' }}
      >
        {/* Fixed Title Overlay */}
        <div className="showcase-title-overlay">
          <h1 className="showcase-main-title">Technosentient Nexus</h1>
          <p className="showcase-main-subtitle">
            A Museum of Cybergalactic Consciousness
          </p>
        </div>

        {/* Parallax Scenes */}
        {mockAnimations.map((animation, index) => {
          const position = getCardPosition(index);
          return (
            <div
              key={animation.id}
              className={`parallax-scene parallax-scene-${position} scene-${animation.id}`}
              style={animation.background ? { background: animation.background } : {}}
            >
              <div
                className={`parallax-model-card parallax-model-card-${animation.id}`}
                onClick={() => {
                  loadModelOnDemand(animation.id);
                  setSelectedAnimation(animation);
                }}
                onMouseEnter={() => {
                  setHoveredCard(animation.id);
                  // Preload on hover for smoother experience
                  loadModelOnDemand(animation.id);
                }}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Canvas
                  camera={{ position: [0, 1, 6], fov: 60 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    opacity: 1, // Always visible for debugging
                    transition: 'opacity 0.7s',
                    background: animation.background
                  }}
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
                    size={3.4}
                    isPlaying={true}
                    onModelLoaded={() => {
                      console.log(`Model loaded: ${animation.name} (ID: ${animation.id})`);
                      setModelLoaded((prev) => ({ ...prev, [animation.id]: true }));
                    }}
                    preloadedModel={preloadedModels[animation.id]}
                  />
                </Canvas>                {/* Loading Spinner */}
                {(!modelLoaded[animation.id] || loadingModels.has(animation.id)) && (
                  <div className="loader-container">
                    <div className="loader-spinner" />
                    {loadingModels.has(animation.id) && (
                      <div className="loading-text">Loading 3D Model...</div>
                    )}
                  </div>
                )}
              </div>

              {/* Info Panel */}
              <div className="parallax-info">
                <h2 className="parallax-title" data-text={animation.name}>
                  {animation.name}
                </h2>
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