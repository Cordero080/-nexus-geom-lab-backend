import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RotatingCube from '../RotatingCube/RotatingCube';
import ScrambleButton from '../../ui/ScrambleButton/ScrambleButton';
import SpeedControl from './SpeedControl/SpeedControl';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { mockAnimations } from '../Showcase/data/mockAnimations';
import IcarusEnvironment from './backgrounds/IcarusEnvironment';
import NexusEnvironment from './backgrounds/NexusEnvironment';
import styles from './ShowcaseViewer.module.scss';
import sharedStyles from '../../../styles/shared.module.scss';

export default function ShowcaseViewer({ animation, onClose }) {
  // Store the mounted state to handle animations properly
  const [mounted, setMounted] = React.useState(false);
  
  // Animation speed state
  const [speed, setSpeed] = useState(1.0);
  
  // Animation switcher state
  const { getUnlockedAnimationsForNoetech, user } = useAuth();
  const [currentAnimation, setCurrentAnimation] = useState(animation);
  
  // Get all unlocked animations for this Noetech
  const unlockedAnimationsForNoetech = getUnlockedAnimationsForNoetech(currentAnimation.noetechKey);
  
  // Check if the Noetech itself is unlocked (for default animation)
  const isNoetechUnlocked = user?.unlockedNoetechs?.includes(currentAnimation.noetechKey);
  
  // Get all animations for this Noetech that are unlocked
  const availableAnimations = mockAnimations.filter(anim => {
    if (anim.noetechKey !== currentAnimation.noetechKey) return false;
    
    // Default animation is available if Noetech is unlocked
    if (anim.isDefaultAnimation && isNoetechUnlocked) return true;
    
    // Additional animations are available if in unlockedAnimations array
    return unlockedAnimationsForNoetech.some(ua => ua.animationId === anim.animationId);
  });
  
  // Show switcher only if multiple animations are available
  const showAnimationSwitcher = availableAnimations.length > 1;
  
  // CHARACTER NAVIGATION: Get all unlocked characters (Noetechs)
  const allUnlockedCharacters = mockAnimations.filter(anim => {
    if (!anim.isDefaultAnimation) return false;
    return user?.unlockedNoetechs?.includes(anim.noetechKey);
  });
  
  // DEBUG: Log character navigation state
  console.log('🎮 Character Navigation Debug:', {
    allUnlockedCharacters: allUnlockedCharacters.map(a => ({ name: a.name, key: a.noetechKey })),
    currentCharacter: currentAnimation.name,
    unlockedNoetechs: user?.unlockedNoetechs
  });
  
  // Find current character index
  const currentCharacterIndex = allUnlockedCharacters.findIndex(
    anim => anim.noetechKey === currentAnimation.noetechKey
  );
  
  // Navigation functions
  const goToPreviousCharacter = () => {
    if (currentCharacterIndex > 0) {
      setCurrentAnimation(allUnlockedCharacters[currentCharacterIndex - 1]);
    }
  };
  
  const goToNextCharacter = () => {
    if (currentCharacterIndex < allUnlockedCharacters.length - 1) {
      setCurrentAnimation(allUnlockedCharacters[currentCharacterIndex + 1]);
    }
  };
  
  const hasMultipleCharacters = allUnlockedCharacters.length > 1;
  
  console.log('🎮 Navigation State:', {
    hasMultipleCharacters,
    currentIndex: currentCharacterIndex,
    totalCharacters: allUnlockedCharacters.length
  });
  
  // TEMP: Force show navigation for testing (set to true to always show)
  const showNavForTesting = true;
  
  console.log('🔍 Should show nav buttons?', (hasMultipleCharacters || showNavForTesting));
  
  // Run once component mounts
  React.useEffect(() => {
    // Immediately freeze background scrolling
    document.body.style.overflow = 'hidden';
    // Add class to body for navbar styling
    document.body.classList.add('showcase-viewer-active');
    
    // Slight delay before showing the content (but backdrop appears immediately)
    setTimeout(() => setMounted(true), 50);
    
    return () => {
      // Restore scrolling when component unmounts
      document.body.style.overflow = '';
      // Remove class from body
      document.body.classList.remove('showcase-viewer-active');
    };
  }, []);

  return (
    <>
      {/* Immediate backdrop that appears instantly */}
      <div className={styles['viewer-backdrop']} />
      
      <div 
        className={`${styles['viewer-overlay']} viewer-overlay-${currentAnimation?.id || 1}`}
        style={{
          opacity: mounted ? 1 : 0
        }}
      >
        <div className={styles['viewer-back-button-container']}>
          <ScrambleButton
            className={styles['viewer-back-button']}
            onClick={onClose}
            variant="secondary"
          >
            ← Back
          </ScrambleButton>
        </div>
        
        {/* Character Navigation - Previous/Next buttons */}
        {(hasMultipleCharacters || showNavForTesting) && (
          <>
            <button
              className={`${styles['viewer-nav-button']} ${styles['viewer-nav-prev']}`}
              onClick={goToPreviousCharacter}
              disabled={currentCharacterIndex === 0}
              title="Previous Character"
            >
              <span className={styles['nav-arrow']}>‹</span>
              <span className={styles['nav-label']}>Previous Character</span>
            </button>
            
            <button
              className={`${styles['viewer-nav-button']} ${styles['viewer-nav-next']}`}
              onClick={goToNextCharacter}
              disabled={currentCharacterIndex === allUnlockedCharacters.length - 1}
              title="Next Character"
            >
              <span className={styles['nav-label']}>Next Character</span>
              <span className={styles['nav-arrow']}>›</span>
            </button>
          </>
        )}
        
        {/* Animation Switcher - only show if multiple animations available */}
        {showAnimationSwitcher && (
          <div className={styles['animation-switcher']}>
            <h3 className={styles['switcher-title']}>Available Animations:</h3>
            <div className={styles['animation-buttons']}>
              {availableAnimations.map((anim) => (
                <button
                  key={anim.id}
                  className={`${styles['animation-button']} ${currentAnimation.id === anim.id ? styles['active'] : ''}`}
                  onClick={() => setCurrentAnimation(anim)}
                >
                  <span className={styles['button-animation']}>{anim.animation}</span>
                  <span className={styles['button-variant']}>{anim.variant}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <button className={`${styles['viewer-close']} ${sharedStyles.angledCorners}`} onClick={onClose}>
          ✕
        </button>
      
      <div className={styles['viewer-canvas-container']}>
            <Canvas
              camera={{ position: [0, 0.8, 8], fov: 60 }}
              style={{ width: '100%', height: '100%', flex: '1 1 auto' }}
        >
          {/* Render Icarus-X Three.js environment background */}
          {(currentAnimation?.id === 1 || currentAnimation?.id === 4) && (
            <IcarusEnvironment />
          )}
          
          {/* Render Nexus-Prime skybox environment background */}
          {currentAnimation?.id === 3 && (
            <NexusEnvironment />
          )}
          
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
          
          {/* Character-specific lighting for nexus-prime (ninja) */}
          {currentAnimation?.id === 3 && (
            <>
              {/* Purple ninja spotlight - illuminates mesh against green background */}
              <spotLight 
                position={[2, 4, 3]} 
                angle={0.6} 
                penumbra={0.3} 
                intensity={10.0} 
                color="#ffffff"
                target-position={[0, -1, 0]}
              />
              {/* Secondary purple rim light */}
              <spotLight 
                position={[-2, 3, 2]} 
                angle={0.5} 
                penumbra={0.4} 
                intensity={8.0} 
                color="#ffffff"
                target-position={[0, -1, 0]}
              />
              {/* Purple ambient boost for mesh visibility */}
              <pointLight position={[0, 2, 1]} intensity={6.0} color="#ffffff" distance={10} />
            </>
          )}
          
          {/* Big cube - pass size as prop */}
          <RotatingCube 
            size={4.5} 
            fbxUrl={currentAnimation?.fbxUrl} 
            scale={currentAnimation?.scale} 
            rotation={currentAnimation?.rotation} 
            positionY={currentAnimation?.positionY} 
            offsetX={currentAnimation?.offsetX} 
            offsetZ={currentAnimation?.offsetZ} 
            cubeY={-0.1} 
            allowNaturalYMovement={currentAnimation?.allowNaturalYMovement} 
            animationId={currentAnimation?.id}
            speed={speed}
          />
          
          {/* OrbitControls lets user rotate with mouse */}
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minDistance={5}
            maxDistance={15}
            autoRotate={true}
            autoRotateSpeed={0.5 * speed}
          />
        </Canvas>
      </div>
      
      {/* Speed Control */}
      <SpeedControl speed={speed} onSpeedChange={setSpeed} />
      
      <div className="viewer-info">
        <h2 className="viewer-title">{currentAnimation?.name || 'Cosmic Entity #001'}</h2>
        <p className="viewer-description">
          {currentAnimation?.description || 'A consciousness evolving inside a geometric vessel'}
        </p>
        <div className="viewer-meta">
          <span className="meta-tag">Animation: {currentAnimation?.animation || 'Idle'}</span>
          <span className="meta-tag">Variant: {currentAnimation?.variant || 'Cosmic Blue'}</span>
        </div>
      </div>
    </div>
    </>
  );
}
