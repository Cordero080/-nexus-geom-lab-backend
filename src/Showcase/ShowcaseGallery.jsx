
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Canvas } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RotatingCube from './components/RotatingCube/RotatingCube';
import ShowcaseViewer from './components/ShowcaseViewer/ShowcaseViewer';
import { mockAnimations } from './data/mockAnimations';
import { portalWorlds, glyphSets } from './data/portalWorlds';
import { quantumCollapse, getCardPosition } from './utils/showcaseHelpers';
import './ShowcaseGallery.css';
import sharedStyles from '../styles/shared.module.scss';

const HERO_TAGLINES = [
  'The Noetech Digital Pantheon',
  'The Cypher Animate',
  'Moyocoya, monemilia in Ometeotl',
  // The dual god dreams us into existence through creation
  '青龍の魂' // “blue dragon spirit” (Japanese, with Chinese roots)
];

const CUTOUT_VARIANTS = ['reality', 'probability', 'entanglement', 'superposition'];

export default function ShowcaseGallery() {
  // Stores current randomly-selected portal world colors (tweak by editing portalWorlds in ./data/portalWorlds.js)
  const [portalState, setPortalState] = useState(() => quantumCollapse(portalWorlds));
  // Stores current randomly-selected glyph set (tweak by editing glyphSets in ./data/portalWorlds.js)
  const [glyphState, setGlyphState] = useState(() => quantumCollapse(glyphSets));
  // Tracks which tagline is currently displayed, cycles through HERO_TAGLINES (change interval timing at useEffect line ~64)
  const [taglineIndex, setTaglineIndex] = useState(0);

  // Parallax layer refs
  // Refs to background/foreground layers for parallax animation (tweak parallax speed in handleParallax effect at line ~128)
  const bgRef = useRef(null);
  // Ref to foreground parallax layer (tweak opacity/speed in handleParallax effect)
  const fgRef = useRef(null);
  // Array of refs for scene background cutouts (used for individual clip-path transformations)
  const bgCutoutRefs = useRef([]);
  // Helper to assign cutout refs by index (used when rendering scenes)
  const assignCutoutRef = useCallback((index) => (el) => {
    bgCutoutRefs.current[index] = el || null;
  }, []);

  // Tracks which 3D model card is currently being viewed in fullscreen viewer
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  // Tracks which card is being hovered (used to trigger model animation on hover)
  const [hoveredCard, setHoveredCard] = useState(null);
  // Cache of preloaded FBX models to avoid re-loading (tweak preload strategy in useEffect at line ~255)
  const [preloadedModels, setPreloadedModels] = useState({});
  // Tracks which models have finished loading (used for loading spinner display)
  const [modelLoaded, setModelLoaded] = useState({});
  // Set of model IDs currently being loaded (prevents duplicate loading requests)
  const [loadingModels, setLoadingModels] = useState(new Set());
  // Set of card IDs visible on screen (lazy-loads 3D models only for visible cards)
  const [visibleCards, setVisibleCards] = useState(new Set([1])); // Only render first card initially
  // Router location hook to detect navigation and close fullscreen viewer
  const location = useLocation();
  // Ref to main scroll container (used for scroll calculations and event listeners)
  const containerRef = useRef(null);
  // Gets current authenticated user and their unlocked animations
  const { user, isAnimationUnlocked } = useAuth();
  
  // Helper to check if a Noetech (character) is unlocked
  const isNoetechUnlocked = (noetechKey) => {
    if (!user) return false;
    return user.unlockedNoetechs?.includes(noetechKey) || false;
  };
  
  // Card refs for 3D tilt effect
  // Object storing refs to each card element (used for parallax transform calculations)
  const cardRefs = useRef({});

  // Close viewer when navigating and manage document body overflow
  // Closes fullscreen viewer when user navigates to a different page (clean up on route change)
  useEffect(() => {
    setSelectedAnimation(null);
  }, [location]);

  // Tagline rotation effect
  // Cycles through HERO_TAGLINES array every 4200ms (change interval timing to speed up/slow down tagline rotation)
  useEffect(() => {
    if (HERO_TAGLINES.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % HERO_TAGLINES.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, []);
  
  // Manage scroll lock when fullscreen viewer is open
  // Prevents background scrolling and hides content behind viewer when selectedAnimation is set (improve UX during fullscreen)
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

  // Track scroll progress for future scroll-based animations
  // Updates width of .scroll-progress element to show scroll position (currently non-visual but useful for debugging)
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

  // Multi-layer parallax effect on scroll and mouse movement
  // Creates depth effect by moving background/foreground layers at different speeds - tweak multipliers (mx*15, mx*45, etc) to adjust parallax intensity
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
      
      // Subtle motion damping (less aggressive than before)
      const motionDampen = 1 - progress * 0.3;
      
      // REFINED MULTI-LAYER PARALLAX
      // Background layer moves slow (0.04x scroll) - tweak 15, 8 multipliers for mouse parallax intensity
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${mx * 15 * motionDampen}px, ${-scrollY * 0.04 + my * 8 * motionDampen}px, 0)`;
        bgRef.current.style.opacity = String(1 - progress * 0.4); // Less fade
      }
      
      // Foreground layer moves faster (0.12x scroll) - tweak 45, 25 multipliers for stronger parallax
      if (fgRef.current) {
        fgRef.current.style.transform = `translate3d(${mx * 45 * motionDampen}px, ${-scrollY * 0.12 + my * 25 * motionDampen}px, 0)`;
        fgRef.current.style.opacity = String(0.9 - progress * 0.6); // Less fade
      }
      
      // Clip-path layer parallax (mirroring Home page geometric cutout system)
      // Backgrounds are now inside each scene, so they transition naturally as scenes scroll
      // No need for separate parallax calculation—just let scenes flow
      
      // Subtle scene depth effect
      // Apply subtle scale/opacity based on distance from viewport center - tweak 0.02, 0.1 for stronger depth
      const scenes = document.querySelectorAll('.parallax-scene');
      scenes.forEach((scene, index) => {
        if (!scene) return;
        
        const rect = scene.getBoundingClientRect();
        const sceneCenter = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const distFromCenter = sceneCenter - viewportCenter;
        const normalizedDist = Math.min(1, Math.abs(distFromCenter) / (window.innerHeight / 2));
        
        // Very subtle scale and depth - no rotation that breaks viewport
        const sceneScale = 1 - normalizedDist * 0.02; // Minimal scaling
        const sceneOpacity = 1 - normalizedDist * 0.1; // Subtle opacity shift
        
        scene.style.transform = `scale(${sceneScale})`;
        scene.style.opacity = String(sceneOpacity);
      });
      
      // Card parallax with entrance animation
      // Each card slides in from sides as it approaches viewport center - tweak 30 for slide distance, 0.8 for fade intensity
      Object.entries(cardRefs.current).forEach(([cardId, cardElement]) => {
        if (!cardElement) return;
        
        const rect = cardElement.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const cardCenter = rect.top + rect.height / 2;
        const distFromCenter = cardCenter - viewportCenter;
        const normalizedDist = Math.min(1, Math.abs(distFromCenter) / (window.innerHeight / 2));
        
        // Subtle reveal effect without breaking transforms
        const isAboveCenter = distFromCenter < 0;
        const slideDistance = normalizedDist * 30; // Reduced from 80
        const translateX = isAboveCenter ? -slideDistance : slideDistance;
        
        // Fade in as cards approach center
        const opacity = Math.max(0.3, 1 - normalizedDist * 0.8); // Increased min opacity
        
        // Subtle glow that doesn't overwhelm
        const glowOpacity = (1 - normalizedDist) * 0.5; // Reduced intensity
        
        // Apply subtle entrance animation (no translateZ)
        cardElement.style.transform = `translateX(${translateX}px)`;
        cardElement.style.opacity = String(opacity);
        
        // Refined glow effect
        cardElement.style.boxShadow = `
          0 8px 32px rgba(0, 0, 0, 0.4),
          0 0 ${15 + normalizedDist * 25}px rgba(0, 255, 255, ${0.2 * glowOpacity}),
          0 0 ${8 + normalizedDist * 15}px rgba(255, 0, 255, ${0.15 * glowOpacity})
        `;
      });
      
      // Keep title styling clean
      const showcaseTitle = document.querySelector('.showcase-main-title');
      if (showcaseTitle) {
        // Reset any dynamic styling to keep it clean white
        showcaseTitle.style.textShadow = '';
      }
    };
    
    const parallaxContainer = containerRef.current;
    parallaxContainer?.addEventListener('scroll', handleParallax);
    window.addEventListener('mousemove', handleParallax);
    handleParallax();
    return () => {
      parallaxContainer?.removeEventListener('scroll', handleParallax);
      window.removeEventListener('mousemove', handleParallax);
    };
  }, []);

  // Quantum collapse on scroll/click (theme color shift)
  // Changes background colors whenever user scrolls or clicks - tweak portalState colors in ./data/portalWorlds.js or disable by commenting out event listeners
  useEffect(() => {
    let lastChangeTime = 0;
    const collapse = () => {
      const now = Date.now();
      // Only allow color change every 500ms for smooth frequent transitions
      if (now - lastChangeTime < 500) return;
      lastChangeTime = now;
      setPortalState(quantumCollapse(portalWorlds));
      setGlyphState(quantumCollapse(glyphSets));
    };
    const collapseContainer = containerRef.current;
    collapseContainer?.addEventListener('scroll', collapse);
    window.addEventListener('click', collapse);
    return () => {
      collapseContainer?.removeEventListener('scroll', collapse);
      window.removeEventListener('click', collapse);
    };
  }, []);

  // Lazy load card visibility - only render 3D models for cards currently visible on screen
  // Uses IntersectionObserver to detect when cards enter viewport then adds them to visibleCards set - tweak threshold: 0.05 or rootMargin: '800px' to change preload distance
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

  // Preload first 3D model immediately to avoid blank card on initial load
  // Only preloads mockAnimations[0] initially - others load on-demand - tweak to preload more models by editing firstModel selection
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
        (err) => {/* Model preload failed silently */}
      );
    }
    return () => { isMounted = false; };
  }, []);

  // Load model on demand when user hovers or clicks a card
  // Prevents loading all 3D models at once - only loads when needed - disable by commenting out loadModelOnDemand() calls to preload everything
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
        setLoadingModels(prev => {
          const newSet = new Set(prev);
          newSet.delete(animationId);
          return newSet;
        });
      }
    );
  };

  // Compute display values for title coordinate chips
  // glyphSignature joins glyph array with pipes - portalLabel shows portal name - cycleLabel tracks tagline count - these update when state changes
  const glyphSignature = Array.isArray(glyphState) ? glyphState.join(' | ') : '';
  const portalLabel = portalState?.label ?? 'Nexus';
  const cycleLabel = `Cycle ${String(taglineIndex + 1).padStart(2, '0')}`;

  return (
    <>
      {/* Scroll Progress Bar */}
      {/* Geometric Background Layers (consistency with Home/Scenes) */}
      <div ref={bgRef} className="parallax-bg-layer" aria-hidden="true">
        {/* Abstract SVG/gradient background shapes, now quantum-reactive */}
        <svg width="100%" height="100%" viewBox="0 0 1920 400" style={{position:'absolute',top:0,left:0,width:'100vw',height:'40vh',pointerEvents:'none', background: `linear-gradient(120deg, ${portalState.colors[0]} 0%, ${portalState.colors[1]} 60%, ${portalState.colors[2]} 100%)`, transition: 'background 3s cubic-bezier(0.4,0,0.2,1)'}}>
          <defs>
            <linearGradient id="showcase-bg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.18"/>
              <stop offset="100%" stopColor={portalState.colors[1]} stopOpacity="0.08"/>
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
    {/* Geometric cutout backgrounds with clip-paths (matching Home page) */}
      <div className="scroll-progress" style={{ visibility: selectedAnimation ? 'hidden' : 'visible' }} />

      <div 
        className="parallax-showcase-container" 
        ref={containerRef}
        style={{ visibility: selectedAnimation ? 'hidden' : 'visible' }}
      >
        <header className="showcase-hero">
          <div className="showcase-title-stack">
            <h1
              className="showcase-main-title"
              data-text="MVCHINV NEXUS"
              aria-label="MVCHINV NEXUS"
            >
              M<span className="showcase-title-inverted">V</span>CHIN
              <span className="showcase-title-inverted">V</span>&nbsp;NEXUS
            </h1>
            <div className="showcase-title-coordinates" aria-hidden="true">
              <span className="coordinate-chip">Portal: {portalLabel}</span>
              {glyphSignature ? (
                <span className="coordinate-chip">Glyphs {glyphSignature}</span>
              ) : null}
              <span className="coordinate-chip">{cycleLabel}</span>
            </div>
          </div>
          <p className={`${sharedStyles.pageSubtitle} showcase-main-subtitle`}>
            {HERO_TAGLINES.map((tagline, idx) => (
              <span
                key={tagline}
                className={`showcase-tagline${idx === taglineIndex ? ' is-active' : ''}`}
                aria-hidden={idx !== taglineIndex}
              >
                {tagline}
              </span>
            ))}
            <span className="sr-only" aria-live="polite">{HERO_TAGLINES[taglineIndex]}</span>
          </p>
        </header>

        {/* Parallax Scenes - Only show default animations in gallery */}
        {mockAnimations
          .filter(animation => animation.isDefaultAnimation)
          .map((animation, index) => {
          const position = getCardPosition(index);
          const isVisible = visibleCards.has(animation.id);
          
          // Check unlock status based on animation type
          // - Default animations: Check if the Noetech (character) is unlocked
          // - Additional animations: Check if the specific animation is unlocked
          const isUnlocked = animation.isDefaultAnimation 
            ? isNoetechUnlocked(animation.noetechKey)
            : isAnimationUnlocked(animation.noetechKey, animation.animationId);
          
          const cutoutVariantIndex = index % CUTOUT_VARIANTS.length;
          const cutoutVariant = CUTOUT_VARIANTS[cutoutVariantIndex];
          
          return (
            <div
              key={animation.id}
              className={`parallax-scene parallax-scene-${position} scene-${animation.id}`}
              data-card-id={animation.id}
            >
              <div className={`scene-background bg-gallery-${cutoutVariant}`} ref={assignCutoutRef(cutoutVariantIndex)} aria-hidden="true" />
              <div
                ref={(el) => {
                  if (el) cardRefs.current[animation.id] = el;
                }}
                className={`parallax-model-card parallax-model-card-${animation.id} ${isUnlocked ? '' : 'locked'}`}
                onClick={() => {
                  if (!isUnlocked) {
                    alert('Locked — Save scenes to unlock animations.');
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
                    <div className="lock-hint">Save scenes to unlock animations</div>
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
                      modelId={animation.id}
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