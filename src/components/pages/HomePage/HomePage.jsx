
import React, { useEffect, useRef, useState } from 'react';

// Components
import Quote from '../../shared/Quote/Quote';
import ProgressBar from './ProgressBar';
import Scene from './Scene';
import ScrambleOnHover from './components/ScrambleOnHover';
import QuantumNav from './components/QuantumNav';
import BackgroundLayers from './components/BackgroundLayers';
import HessianPolychoronAnimation from './HessianPolychoronAnimation';
import QuantumManifoldAnimation from './QuantumManifoldAnimation';

// Styles
import styles from './HomeIndex.module.scss';

// Utilities
import quantumCollapse from './utils/quantumCollapse';
import { portalWorlds, glyphSets } from './utils/portalWorlds';

// Custom Hooks
import useQuantumState from './hooks/useQuantumState';
import useParallax from './hooks/useParallax';

// External
import BeamScanButton from '../../ui/BeamScanButton/BeamScanButton';
import { Link } from 'react-router-dom';
import { GEOM_LAB_LINK_TEXT, SHOWCASE_LINK_TEXT } from '../../layout/NavBar/navLabels';
import { useAuth } from '../../../features/auth/context/AuthContext';

export default function HomePage() {
  const { isAuthenticated, logout } = useAuth();
  
  // Custom Hooks
  const { portalState, glyphState, handleQuantumCollapse } = useQuantumState();
  const {
    parallaxRef,
    fgRef,
    bgRef,
    layer1Ref,
    layer2Ref,
    layer3Ref,
    layer4Ref,
    layer5Ref,
  } = useParallax();

  // Local state
  const [activeScene, setActiveScene] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [probabilityFlipped, setProbabilityFlipped] = useState(false);
  const [superpositionDisassembled, setSuperpositionDisassembled] = useState(false);


  // Scene fade/scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      const container = parallaxRef.current;
      const scenes = Array.from(container.querySelectorAll('.quantum-scene'));
      const scrollY = window.scrollY;
      let found = 0;
      for (let i = 0; i < scenes.length; i++) {
        const rect = scenes[i].getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.33 && rect.bottom > window.innerHeight * 0.33) {
          found = i;
          break;
        }
      }
      setActiveScene(found);
      
      // Check if we've scrolled past the probability description text itself
      const probabilityDescription = document.querySelector('#probability .scene-description');
      if (probabilityDescription) {
        const descRect = probabilityDescription.getBoundingClientRect();
        // Flip when the description itself passes the middle of viewport
        setProbabilityFlipped(descRect.top < window.innerHeight / 3);
      }
      
      // Check if we've entered the superposition section
      const superpositionSection = document.querySelector('#superposition');
      if (superpositionSection) {
        const superRect = superpositionSection.getBoundingClientRect();
        // Disassemble when superposition section enters viewport
        setSuperpositionDisassembled(superRect.top < window.innerHeight * 0.1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const handleNavScroll = () => {
      if (window.scrollY > 50) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };
    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll();
    return () => window.removeEventListener('scroll', handleNavScroll);
  }, []);

  return (
    <>
      {/* VINE-INSPIRED QUANTUM NAVIGATION */}
      <QuantumNav 
        portalState={portalState}
        glyphState={glyphState}
        navScrolled={navScrolled}
        isAuthenticated={isAuthenticated}
        logout={logout}
        currentPage="home"
      />

      {/* Background Layers */}
      <BackgroundLayers 
        portalState={portalState}
        bgRef={bgRef}
        fgRef={fgRef}
      />

      {/* Parallax Container */}
      <div className={styles.parallaxContainer} id="parallax-container" ref={parallaxRef}>
        {/* Scene 1: Reality Layer */}
        {/* Scene 1: Reality Layer */}
        <section className={`quantum-scene reality-scene-section${activeScene === 0 ? ' active' : ''}`} id="reality" data-scene="0">
          <div 
            className={`${styles.bgReality} bg-reality-position`}
            aria-hidden="true"
          ></div>
          <div className="scene-content scene-content-wrapper">
            <div className="particles particles-wrapper">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
            <div className="terminal-header">
              <span className="coordinates">φ-SPACE_MANIFOLD: 1.618033988749</span> 

              {/* φ (Phi): The golden ratio constant (1.618...)
SPACE: Mathematical/geometric term for a set of points with structure
MANIFOLD: A mathematical surface or multi-dimensional space that can be curved or complex (like tesseracts constructed in Geom Lab - they're 4D manifolds projected into 3D) In plain English: "A dimension where everything follows the golden ratio's harmonic proportions" */}

              <span className="timestamp" id="timestamp"></span>
            </div>
            <div className="title-wrapper">
              <h1 className={`quantum-title ${styles.quantumTitle} quantum-title-h1`}>
                <span className="title-word title-word-span" data-word="N3XUS">
                  <ScrambleOnHover originalText="N3XUS" finalText="アトリエ" delay={3000} />
                </span><br></br>
                <span className="title-word title-word-span" data-word="GE0M">
                  GE<span className="slashed-zero">0</span>M
                </span><br></br>
                <span className="title-word title-word-span" data-word="LVB">
                  L<span className="title-inverted-v">V</span>B
                </span>
              </h1>
            </div>
            <p className="quantum-subtitle">
              / / I N T E R A C T I V E _ C O N S O L E _ A W A I T S . . .
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-label">MODULES LOADED-</span>
                <span className="stat-value" data-stat="modules">080</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">QUANTUM STATE-</span>
                <span 
                  className="stat-value stat-value-dynamic" 
                  data-stat="state"
                  style={{
                    '--stat-color': portalState.colors[0],
                    '--stat-text-shadow': `0 0 8px ${portalState.colors[1]}, 0 0 2px ${portalState.colors[2]}`
                  }}
                >{portalState.label.toUpperCase()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">NETWORK  STATUS</span>
                <span className="stat-value" data-stat="network">-CONNECTED</span>
              </div>
            </div>
            
            {/* Show Enter Geom Lab only when logged in, Login/Signup when logged out */}
            {isAuthenticated ? (
              <div 
                className="button-wrapper-auth"
              >
                <BeamScanButton
                  onClick={(e) => {
                    window.location.href = '/geom-lab';
                  }}
                  label={<>ENTER GE0M L<span className="nav-inverted-v">V</span>B</>}
                  className="home-enter-geom-lab-btn"
                />
              </div>
            ) : (
              <div 
                className="button-wrapper-no-auth"
              >
                <BeamScanButton
                  onClick={(e) => {
                    window.location.href = '/login';
                  }}
                  label={<>LOGI<span className="inverted-n-span">N</span></>}
                />
                <BeamScanButton
                  onClick={(e) => {
                    window.location.href = '/signup';
                  }}
                  label="SIGN UP"
                  delayedString={true}
                />
              </div>
            )}
            
            <div className="reality-particles"></div>
          </div>
        </section>

        {/* Scene 2: Probability Wave */}
        <section className={`quantum-scene${activeScene === 1 ? ' active' : ''}`} id="probability" data-scene="1">
          <div className="scene-background bg-probability" aria-hidden="true"></div>
          <div className="scene-content">
            <h2 className="scene-title">PROBABILITY CLOUD</h2>
            <p className={`scene-description${probabilityFlipped ? ' flipped' : ''}`}>
              Where code exists in superposition until observed
            </p>
            <div className="probability-waves"></div>
            <div className="code-snippets">
              {/* <div className="floating-code">import name from './exportingFile.js';</div>
              <div className="floating-code">console.future(identity);</div>
              <div className="floating-code">PABLO D C0RDER0</div> */}
              <Quote />
              
      
            </div>
          </div>
          
        </section>

        {/* Scene 3: Quantum Entanglement */}
        <section className={`quantum-scene${activeScene === 2 ? ' active' : ''}`} id="entanglement" data-scene="2">
          <div className="scene-background bg-entanglement" aria-hidden="true"></div>
          <HessianPolychoronAnimation isActive={activeScene === 2} />
          <div className="scene-content entanglement-scene-content">
            <div className="entanglement-network"></div>
            <div className="connected-nodes">
              <div className="quantum-bridge"></div>
            </div>
          </div>
          
        </section>

        <Scene
          id="superposition"
          isActive={activeScene === 3}
          backgroundClass="bg-superposition"
          animation={<QuantumManifoldAnimation isActive={activeScene === 3} />}
        >
          <div className="superposition-scene-div">
            <h2 className="scene-title">SUPERPOSITION STATE</h2>
            <p className={`scene-description${superpositionDisassembled ? ' disassemble' : ''}`}>
              All possibilities exist simultaneously
            </p>
            <div className="superposition-field"></div>
            {/* <div className="quantum-console">
              <div className="console-line">&gt;&gt;&gt; Initializing quantum state...</div>
              <div className="console-line">&gt;&gt;&gt; PVBLO C0RDER0 = ψ(quantum_state)</div>
              <div className="console-line">&gt;&gt;&gt; Observation collapsed wave function</div>
              <div className="console-line">&gt;&gt;&gt; Result: "ETHEREAL"</div>
            </div> */}
          </div>
        </Scene>
      </div>

      <ProgressBar
        portalState={portalState}
        glyphState={glyphState}
        onQuantumCollapse={handleQuantumCollapse}
      />
    </>
  );
}