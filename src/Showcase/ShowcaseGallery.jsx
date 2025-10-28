
import React, { useState, useEffect, useRef } from 'react';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Canvas } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RotatingCube from './RotatingCube';
import ShowcaseViewer from './ShowcaseViewer';
import './ShowcaseGallery.css';
import sharedStyles from '../styles/shared.module.scss';

export default function ShowcaseGallery() {
  // Quantum Uncertainty Utility
  function quantumCollapse(states) {
    return states[Math.floor(Math.random() * states.length)];
  }

  // Portal Worlds and Glyphs (quantum-reactive theming)
  const portalWorlds = [
    { colors: ['#ff00cc', '#00fff7', '#1a003a'], label: 'Fractal' },
    { colors: ['#ffea00', '#7300ffff', '#003a2a'], label: 'Nebula' },
    { colors: ['#ff3300', '#cc00ff', '#0a0f1a'], label: 'Inferno' },
    { colors: ['#00ff33', '#00aaff', '#003a3a'], label: 'Emerald' },
    { colors: ['#ffffff', '#00fff7', '#0a0f1a'], label: 'Singularity' },
  ];
  const glyphSets = [
    ['ψ', 'Ω', 'Σ'],
    ['λ', 'Φ', 'Ξ'],
    ['π', 'Δ', 'Γ'],
    ['μ', 'θ', 'ζ'],
    ['τ', 'β', 'η'],
  ];

  const [portalState, setPortalState] = useState(() => quantumCollapse(portalWorlds));
  const [glyphState, setGlyphState] = useState(() => quantumCollapse(glyphSets));

  // Parallax layer refs
  const bgRef = useRef(null);
  const fgRef = useRef(null);
  const bgCutoutRef = useRef(null);
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [preloadedModels, setPreloadedModels] = useState({});
  const [modelLoaded, setModelLoaded] = useState({});
  const [loadingModels, setLoadingModels] = useState(new Set());
  const [visibleCards, setVisibleCards] = useState(new Set([1])); // Only render first card initially
  const location = useLocation();
  const containerRef = useRef(null);
  const { user } = useAuth();

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

  // Scroll progress bar (non-visual, for future use)
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const scrollProgress = (container.scrollTop / (container.scrollHeight - container.clientHeight)) * 100;
      const progressBar = document.querySelector('.scroll-progress');
      if (progressBar) {
        progressBar.style.width = scrollProgress + '%';
      }
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  // Quantum parallax background (scroll + mouse driven)
  useEffect(() => {
    const handleParallax = (e) => {
      const container = containerRef.current;
      const scrollY = container ? container.scrollTop : 0;
      const maxScroll = container ? (container.scrollHeight - container.clientHeight) || 1 : 1;
      const progress = Math.min(1, scrollY / maxScroll);
      let mx = 0, my = 0;
      if (e && e.type === 'mousemove') {
        mx = (e.clientX / window.innerWidth) - 0.5;
        my = (e.clientY / window.innerHeight) - 0.5;
      }
      // Slightly reduce motion and opacity as user scrolls down (like Home)
      const motionDampen = 1 - progress * 0.5; // up to 50% less motion at bottom
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${mx * 30 * motionDampen}px, ${-scrollY * 0.08 * motionDampen + my * 20 * motionDampen}px, 0)`;
        bgRef.current.style.opacity = String(1 - progress * 0.75); // fade out by ~75%
      }
      if (fgRef.current) {
        fgRef.current.style.transform = `translate3d(${mx * 80 * motionDampen}px, ${-scrollY * 0.18 * motionDampen + my * 40 * motionDampen}px, 0)`;
        fgRef.current.style.opacity = String(0.9 - progress * 0.9); // fade to ~0
      }
      // Clip-path layer fade-in like Home/Scenes
      if (bgCutoutRef.current) {
        const progress = Math.min(1, scrollY / (maxScroll * 0.25)); // appear over first 25% scroll
        bgCutoutRef.current.style.opacity = String(progress);
      }
    };
    const container = containerRef.current;
    container?.addEventListener('scroll', handleParallax);
    window.addEventListener('mousemove', handleParallax);
    handleParallax();
    return () => {
      container?.removeEventListener('scroll', handleParallax);
      window.removeEventListener('mousemove', handleParallax);
    };
  }, []);

  // Quantum collapse on scroll/click (theme color shift)
  useEffect(() => {
    const collapse = () => {
      setPortalState(quantumCollapse(portalWorlds));
      setGlyphState(quantumCollapse(glyphSets));
    };
    const container = containerRef.current;
    container?.addEventListener('scroll', collapse);
    window.addEventListener('click', collapse);
    return () => {
      container?.removeEventListener('scroll', collapse);
      window.removeEventListener('click', collapse);
    };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('parallax-info-visible');
            // Extract card ID from data attribute and mark as visible
            const cardId = parseInt(entry.target.dataset.cardId);
            if (cardId) {
              setVisibleCards(prev => new Set(prev).add(cardId));
            }
          }
        });
      },
      { threshold: 0.05, rootMargin: '800px' } // Start loading 800px before visible (about 1 screen ahead)
    );

    const infoElements = document.querySelectorAll('.parallax-scene');
    infoElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Mock data
  const mockAnimations = [
    {
      id: 1,
      noetechKey: 'icarus-x',
      name: 'Icarus-X #001',
      animation: 'Solar Ascension',
      variant: 'Golden Phoenix',
      description: 'The Transcendent Seraph...Reborn from Digital Ashes to Touch the Infinite',
      fbxUrl: '/models/icarus-bangs.fbx',
      scale: 0.023,
      galleryScale: 0.015,
      rotation: [0, 0, 0],
      positionY: -2.8,
      galleryPositionY: -1.5,
      offsetX: -0.2,
      offsetZ: 0.15,
      background: 'linear-gradient(180deg, rgba(15, 5, 0, 0.95) 0%, rgba(255, 140, 0, 0.8) 20%, rgba(255, 215, 0, 0.7) 40%, rgba(255, 165, 0, 0.6) 60%, rgba(255, 69, 0, 0.7) 80%, rgba(139, 69, 19, 0.9) 100%)',
      viewerBackground: 'linear-gradient(135deg, #2d1810 0%, #ff8c00 25%, #ffd700 50%, #ff8c00 75%, #2d1810 100%)'
    },
    {
      id: 2,
      noetechKey: 'vectra',
      name: 'Vectra APEX #002',
      animation: 'Break Dance',
      variant: 'Spectral',
      description: 'The Ominous Anomaly Woven from Pure Hologram',
      fbxUrl: '/models/diabla-roja.fbx',
      scale: 0.025,
      galleryScale: 0.018,
      rotation: [0, 0, 0],
      positionY: -2.3,
      galleryPositionY: -1.5,
      offsetX: 0,
      offsetZ: 0,
      allowNaturalYMovement: true,
      background: 'linear-gradient(180deg, rgba(0, 102, 255, 0.5) 0%, rgba(117, 250, 217, 0.7) 30%, rgba(214, 67, 243, 0.6) 70%, rgba(0, 255, 255, 0.5) 100%)'
    },
    {
      id: 3,
      noetechKey: 'nexus',
      name: 'Nexus-Prime #003',
      animation: 'Warrior Flip',
      variant: 'Shadow Striker',
      description: 'The Quantum Architect of the Digital Nexus...Master of hyperdimensional Combat',
      fbxUrl: '/models/iron-man-2.fbx',
      scale: 0.0230,
      galleryScale: 0.0180,
      rotation: [0, 0, 0],
      positionY: -2.6,
      galleryPositionY: -1.8,
      offsetX: 0.2,
      offsetZ: -0.1,
      background: 'linear-gradient(180deg, rgba(5, 5, 15, 0.95) 0%, rgba(139, 0, 0, 0.8) 20%, rgba(220, 20, 60, 0.6) 40%, rgba(178, 34, 34, 0.7) 60%, rgba(25, 25, 112, 0.8) 80%, rgba(0, 0, 0, 0.9) 100%)',
      viewerBackground: 'linear-gradient(135deg, #000008 0%, #1a0000 15%, #8b0000 30%, #dc143c 50%, #8b0000 70%, #1a0000 85%, #000008 100%)'
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
      {/* Geometric Background Layers (consistency with Home/Scenes) */}
      <div ref={bgRef} className="parallax-bg-layer" aria-hidden="true">
        {/* Abstract SVG/gradient background shapes */}
        <svg width="100%" height="100%" viewBox="0 0 1920 400" style={{position:'absolute',top:0,left:0,width:'100vw',height:'40vh',pointerEvents:'none', background: `linear-gradient(120deg, ${portalState.colors[0]} 0%, ${portalState.colors[1]} 60%, ${portalState.colors[2]} 100%)`, transition: 'background 1.2s cubic-bezier(0.4,0,0.2,1)'}}>
          <defs>
            <linearGradient id="showcase-bg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.08"/>
            </linearGradient>
          </defs>
          <polygon points="0,0 1920,0 1600,400 0,300" fill="url(#showcase-bg-grad1)"/>
          <ellipse cx="1600" cy="80" rx="220" ry="60" fill={portalState.colors[2] + '22'}/>
        </svg>
      </div>
      <div ref={fgRef} className="parallax-fg-layer" aria-hidden="true">
        {/* Foreground SVG/gradient shapes */}
        <svg width="100%" height="100%" viewBox="0 0 1920 400" style={{position:'absolute',top:0,left:0,width:'100vw',height:'40vh',pointerEvents:'none'}}>
          <defs>
            <linearGradient id="showcase-fg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.22"/>
            </linearGradient>
          </defs>
          <polygon points="1920,0 1920,400 400,400 0,200" fill="url(#showcase-fg-grad1)"/>
          <ellipse cx="320" cy="120" rx="180" ry="40" fill="#ffffff22"/>
        </svg>
      </div>
    {/* Sectioned geometric background layers (match Home's multiple diagonal cuts) */}

      <div className="scroll-progress" style={{ visibility: selectedAnimation ? 'hidden' : 'visible' }} />

      <div 
        className="parallax-showcase-container" 
        ref={containerRef}
        style={{ visibility: selectedAnimation ? 'hidden' : 'visible' }}
      >
        {/* Layered cutouts aligned to hero + each scene */}
        <div className="bg-gallery-layer bg-gallery-reality" aria-hidden="true" style={{ top: '0vh' }} />
        <div className="bg-gallery-layer bg-gallery-probability" aria-hidden="true" style={{ top: '100vh' }} />
        <div className="bg-gallery-layer bg-gallery-entanglement" aria-hidden="true" style={{ top: '200vh' }} />
        <div className="bg-gallery-layer bg-gallery-superposition" aria-hidden="true" style={{ top: '300vh' }} />
        {/* Hero Title Section (separate from scenes to avoid overlap) */}
        <header className="showcase-hero">
          <h1 className="showcase-main-title">Machina NEXUS</h1>
          <p className="showcase-main-subtitle">The Noetech Digital Pantheon</p>
        </header>

        {/* Parallax Scenes */}
        {mockAnimations.map((animation, index) => {
          const position = getCardPosition(index);
          const isVisible = visibleCards.has(animation.id);
          const unlocked = Array.isArray(user?.unlockedNoetechs) && user?.unlockedNoetechs?.length
            ? user.unlockedNoetechs
            : ['icarus-x'];
          const isUnlocked = unlocked.includes(animation.noetechKey);
          
          return (
            <div
              key={animation.id}
              className={`parallax-scene parallax-scene-${position} scene-${animation.id}`}
              data-card-id={animation.id}
            >
              <div
                className={`parallax-model-card parallax-model-card-${animation.id} ${isUnlocked ? '' : 'locked'}`}
                onClick={() => {
                  if (!isUnlocked) {
                    alert('Locked — Save a scene to unlock this Noetech.');
                    return;
                  }

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
                {!isUnlocked && (
                  <div className="lock-overlay">
                    <div className={`lock-badge ${sharedStyles.angledCornersSm}`}>Locked</div>
                    <div className="lock-hint">Save a scene to unlock</div>
                  </div>
                )}
                {isVisible ? (
                  <Canvas
                    camera={{ position: [0, 1, 6], fov: 60 }}
                    style={{
                      width: '100%',
                      height: '100%',
                      opacity: 1,
                      transition: 'opacity 0.7s'
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
                      isPlaying={hoveredCard === animation.id}
                      onModelLoaded={() => {
                        setModelLoaded((prev) => ({ ...prev, [animation.id]: true }));
                      }}
                      preloadedModel={preloadedModels[animation.id]}
                      allowNaturalYMovement={animation.allowNaturalYMovement}
                    />
                  </Canvas>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent'
                  }}>
                    <div className="loader-spinner" />
                  </div>
                )}
                {/* Loading Spinner */}
                {isVisible && (!modelLoaded[animation.id] || loadingModels.has(animation.id)) && (
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