
import React, { useEffect, useRef, useState } from 'react';

// Quantum Uncertainty Utility
function quantumCollapse(states) {
  return states[Math.floor(Math.random() * states.length)];
}
import Quote from './Quote';
import ProgressBar from './ProgressBar';
import Scene from './Scene';
import styles from './HomeIndex.module.scss';
import { BeamScanButton } from '../../features/HUD';
import { Link } from 'react-router-dom';
import { GEOM_LAB_LINK_TEXT, SHOWCASE_LINK_TEXT } from '../../layout/NavBar/navLabels';
import { useAuth } from '../../../context/AuthContext';

// Scrambling component for N3XUS title
function ScrambleOnHover({ originalText, finalText, delay = 3000 }) {
  const [displayText, setDisplayText] = useState(originalText);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const katakanaChars = [
    'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ',
    'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト',
    'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
    'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ',
    'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン'
  ];

  useEffect(() => {
    if (isHovered) {
      // Start scrambling after delay
      timeoutRef.current = setTimeout(() => {
        const duration = 2000;
        const chars = finalText.split('');
        const settled = new Array(chars.length).fill(false);
        const startTime = Date.now();
        const settleInterval = duration / chars.length;
        let frameDelay = 50; // Start at 50ms

        intervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = elapsed / duration;
          
          // Speed up over time (crescendo effect)
          frameDelay = Math.max(10, 50 - (progress * 40)); // 50ms -> 10ms
          
          // Settle characters progressively
          chars.forEach((char, i) => {
            if (elapsed > settleInterval * (i + 1)) {
              settled[i] = true;
            }
          });

          // Generate scrambled text
          const scrambled = chars.map((char, i) => {
            if (settled[i]) return char;
            return katakanaChars[Math.floor(Math.random() * katakanaChars.length)];
          }).join('');

          setDisplayText(scrambled);

          // Complete
          if (elapsed >= duration) {
            setDisplayText(finalText);
            clearInterval(intervalRef.current);
          }
        }, frameDelay);
      }, delay);
    } else {
      // Reset on mouse leave
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayText(originalText);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, originalText, finalText, delay]);

  return (
    <span 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: 'pointer', fontFamily: "'Future Z', 'Orbitron', 'Rajdhani', sans-serif" }}
    >
      {displayText}
    </span>
  );
}

export default function HomePage() {
  const { isAuthenticated, logout } = useAuth();
  
  // DEBUG: Log all clicks to see what's blocking
  useEffect(() => {
    const debugClickHandler = (e) => {
      console.log('🔴 CLICK DETECTED ON:', e.target);
      console.log('🔴 Target classList:', e.target.classList);
      console.log('🔴 Target id:', e.target.id);
      console.log('🔴 Target tagName:', e.target.tagName);
      console.log('🔴 Computed pointer-events:', window.getComputedStyle(e.target).pointerEvents);
      console.log('🔴 Computed z-index:', window.getComputedStyle(e.target).zIndex);
      console.log('🔴 Current target:', e.currentTarget);
      
      // Check all elements at this point
      const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
      console.log('🔴 All elements at click point:', elementsAtPoint);
      elementsAtPoint.forEach((el, index) => {
        const styles = window.getComputedStyle(el);
        console.log(`  ${index}:`, {
          tag: el.tagName,
          class: el.className,
          id: el.id,
          pointerEvents: styles.pointerEvents,
          zIndex: styles.zIndex,
          position: styles.position
        });
      });
    };
    
    let lastLogTime = 0;
    const debugMouseMoveHandler = (e) => {
      const now = Date.now();
      // Only log every 500ms to avoid spam
      if (now - lastLogTime < 500) return;
      lastLogTime = now;
      
      const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
      const button = elementsAtPoint.find(el => 
        el.tagName === 'BUTTON' || 
        el.classList.contains('beamScanBtn') ||
        (el.className && el.className.includes && el.className.includes('beamScan'))
      );
      
      if (button) {
        console.log('🟡 HOVERING OVER BUTTON:', button);
        console.log('🟡 Button pointer-events:', window.getComputedStyle(button).pointerEvents);
        console.log('🟡 Button z-index:', window.getComputedStyle(button).zIndex);
        console.log('🟡 Elements ABOVE button (blocking it):');
        const elementsAbove = elementsAtPoint.slice(0, elementsAtPoint.indexOf(button));
        elementsAbove.forEach((el, i) => {
          const styles = window.getComputedStyle(el);
          console.log(`  ${i}:`, {
            tag: el.tagName,
            class: el.className,
            id: el.id,
            pointerEvents: styles.pointerEvents,
            zIndex: styles.zIndex
          });
        });
      }
    };
    
    document.addEventListener('click', debugClickHandler, true);
    document.addEventListener('mousemove', debugMouseMoveHandler);
    return () => {
      document.removeEventListener('click', debugClickHandler, true);
      document.removeEventListener('mousemove', debugMouseMoveHandler);
    };
  }, []);
  
  // Quantum Uncertainty UI State (same as Showcase)
  const portalWorlds = [
    { colors: ["#aa0088", "#00aa99", "#0d001f"], label: "Fractal" },
    { colors: ["#aa8800", "#440066", "#001f1a"], label: "Nebula" },
    { colors: ["#aa1100", "#770066", "#050a0f"], label: "Inferno" },
    { colors: ["#00aa11", "#0066aa", "#001f1f"], label: "Emerald" },
    { colors: ["#999999", "#00aa99", "#050a0f"], label: "Singularity" },
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

  // Collapse state on scroll or click
  useEffect(() => {
    const handle = () => {
      setPortalState(quantumCollapse(portalWorlds));
      setGlyphState(quantumCollapse(glyphSets));
    };
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);
  // Also collapse on click/tap
  function handleQuantumCollapse() {
    setPortalState(quantumCollapse(portalWorlds));
    setGlyphState(quantumCollapse(glyphSets));
  }
  const [activeScene, setActiveScene] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const parallaxRef = useRef(null);
  const fgRef = useRef(null);
  const bgRef = useRef(null);
  
  // Additional layer refs for enhanced parallax
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);
  const layer4Ref = useRef(null);
  const layer5Ref = useRef(null);

  // Quantum wormhole ripple effect (homepage only)
  useEffect(() => {
    const handleClick = (e) => {
      const wormhole = document.getElementById('wormhole');
      if (!wormhole) return;
      const size = 170;
      const x = e.clientX - size / 2;
      const y = e.clientY - size / 2;
      wormhole.style.left = `${x}px`;
      wormhole.style.top = `${y}px`;
      wormhole.classList.remove('ripple');
      void wormhole.offsetWidth;
      wormhole.classList.add('ripple');
    };
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
      const wormhole = document.getElementById('wormhole');
      if (wormhole) {
        wormhole.classList.remove('ripple');
        wormhole.style.left = '';
        wormhole.style.top = '';
      }
    };
  }, []);

  // Enhanced Multi-Layer Parallax: scroll and mousemove
  useEffect(() => {
    const handleParallax = (e) => {
      const scrollY = window.scrollY;
      const wh = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - wh;
      const progress = Math.min(1, scrollY / maxScroll);
      
      // Mouse position (centered -0.5 to 0.5)
      let mx = 0, my = 0;
      if (e && e.type === 'mousemove') {
        mx = (e.clientX / window.innerWidth) - 0.5;
        my = (e.clientY / window.innerHeight) - 0.5;
      }
      
      // Motion damping based on scroll progress
      const motionDampen = 1 - progress * 1.3;
      
      // ENHANCED MULTI-LAYER PARALLAX DEPTH SYSTEM WITH ATMOSPHERIC PERSPECTIVE
      
      // Layer 1 (Deepest - Atmospheric base): Slowest movement, most blue-shifted
      if (layer1Ref.current) {
        const depth1 = 0.1;
        layer1Ref.current.style.transform = `
          translate3d(${mx * 5 * motionDampen}px, ${-scrollY * 0.008 + my * 3 * motionDampen}px, 0) 
          scale(${1 - progress * 0.05})
        `;
        layer1Ref.current.style.opacity = String(0.8 - progress * 0.3);
        layer1Ref.current.style.filter = `blur(${progress * 2}px) hue-rotate(${progress * 15}deg)`;
      }

      // Layer 2 (Deep background): Geometric shapes with color bleed
      if (layer2Ref.current) {
        const depth2 = 0.25;
        layer2Ref.current.style.transform = `
          translate3d(${mx * 12 * motionDampen}px, ${-scrollY * 0.02 + my * 8 * motionDampen}px, 0)
          scale(${1 - progress * 0.08}) 
          rotateZ(${mx * 2}deg)
        `;
        layer2Ref.current.style.opacity = String(0.9 - progress * 0.4);
        layer2Ref.current.style.filter = `blur(${progress * 1.5}px) saturate(${1 + progress * 0.3})`;
      }

      // Layer 3 (Grid layer): Mid-depth with subtle rotation
      if (layer3Ref.current) {
        const depth3 = 0.4;
        layer3Ref.current.style.transform = `
          translate3d(${mx * 18 * motionDampen}px, ${-scrollY * 0.035 + my * 12 * motionDampen}px, 0)
          scale(${1 - progress * 0.1})
          rotateX(${my * 3}deg)
        `;
        layer3Ref.current.style.opacity = String(0.7 - progress * 0.5);
        layer3Ref.current.style.filter = `blur(${progress * 1}px) brightness(${1 + progress * 0.2})`;
      }

      // Layer 4 (Foreground shapes): More dramatic movement
      if (layer4Ref.current) {
        const depth4 = 0.6;
        layer4Ref.current.style.transform = `
          translate3d(${mx * 25 * motionDampen}px, ${-scrollY * 0.05 + my * 18 * motionDampen}px, 0)
          scale(${1 - progress * 0.12})
          rotateY(${mx * 4}deg)
        `;
        layer4Ref.current.style.opacity = String(0.9 - progress * 0.6);
        layer4Ref.current.style.filter = `blur(${progress * 0.5}px) contrast(${1 + progress * 0.3})`;
      }

      // Layer 5 (Detail layer): Fastest, sharpest movement
      if (layer5Ref.current) {
        const depth5 = 0.8;
        layer5Ref.current.style.transform = `
          translate3d(${mx * 35 * motionDampen}px, ${-scrollY * 0.08 + my * 25 * motionDampen}px, 0)
          scale(${1 - progress * 0.15})
          rotateZ(${-mx * 6}deg)
          rotateX(${my * 5}deg)
        `;
        layer5Ref.current.style.opacity = String(1 - progress * 0.7);
        layer5Ref.current.style.filter = `blur(${progress * 0.3}px) brightness(${1 + progress * 0.4})`;
      }

      // Parallax layers matching spec (bgRef and fgRef)
      if (bgRef.current) {
        // Background layer: 0.08x scroll speed, ±30px horizontal, ±20px vertical
        bgRef.current.style.transform = `translate3d(${mx * 30 * motionDampen}px, ${-scrollY * 0.08 + my * 20 * motionDampen}px, 0)`;
        bgRef.current.style.opacity = String(1 - progress * 0.4);
      }
      
      if (fgRef.current) {
        // Foreground layer: 0.18x scroll speed, ±80px horizontal, ±40px vertical
        fgRef.current.style.transform = `translate3d(${mx * 80 * motionDampen}px, ${-scrollY * 0.18 + my * 40 * motionDampen}px, 0)`;
        fgRef.current.style.opacity = String(0.9 - progress * 0.6);
      }
      
      // Layer 3 (Fast): Apply depth to quantum scenes
      const scenes = document.querySelectorAll('.quantum-scene');
      scenes.forEach((scene, index) => {
        if (!scene) return;
        
        const rect = scene.getBoundingClientRect();
        const sceneCenter = rect.top + rect.height / 2;
        const viewportCenter = wh / 2;
        const distFromCenter = sceneCenter - viewportCenter;
        const normalizedDist = Math.min(1, Math.abs(distFromCenter) / (wh / 2));
        
        // Scene depth layering (different scenes at different depths)
        const sceneDepth = index * 100 + (progress * 200);
        const sceneScale = 1 - normalizedDist * 0.08;
        const sceneTilt = -(distFromCenter / viewportCenter) * 1.5;  // Reduced from 5 to 1.5 and inverted
        
        // Apply 3D transforms to scenes - Skip for entanglement (scene 2) and superposition (scene 3)
        if (index !== 2 && index !== 3) {
          scene.style.transform = `
            perspective(1500px) 
            translateZ(${sceneDepth}px) 
            scale(${sceneScale})
            rotateX(${sceneTilt}deg)
          `;
          scene.style.opacity = String(1 - normalizedDist * 0.3);
        } else {
          // Keep entanglement and superposition scenes flat to show parallax layers
          scene.style.transform = 'none';
          scene.style.opacity = '1';
        }
      });
      
      // Layer 4 (Fastest): N3XUS Title Enhancement
      const titleElement = document.querySelector('.n3xus-title, .scramble-title');
      if (titleElement) {
        const titleDepth = 300 - scrollY * 0.5;
        const titleGlow = Math.max(0, 1 - progress * 2);
        const titleScale = 1 + progress * 0.2;
        
        titleElement.style.transform = `
          perspective(1000px)
          translateZ(${titleDepth}px)
          scale(${titleScale})
          rotateY(${mx * 8}deg)
        `;
        
        // Add holographic glow that responds to scroll
        titleElement.style.textShadow = `
          0 0 ${20 + progress * 40}px rgba(0, 255, 247, ${titleGlow}),
          0 0 ${40 + progress * 80}px rgba(255, 0, 204, ${titleGlow * 0.7}),
          0 0 4px #fff
        `;
      }
      
      // Layer 5: Ensure "Be the defiance" is always visible
      const defianceText = document.querySelector('.floating-code');
      if (defianceText) {
        // Ensure it stays on top and visible
        defianceText.style.zIndex = '100';
        defianceText.style.position = 'relative';
        
        // Add slight parallax but keep it visible
        const defianceGlow = Math.max(0.5, 1 - progress * 0.5);
        defianceText.style.textShadow = `
          0 0 ${30}px rgba(0, 255, 247, ${defianceGlow}),
          0 0 ${50}px rgba(255, 0, 204, ${defianceGlow * 0.8}),
          0 0 8px #fff
        `;
      }
    };
    
    window.addEventListener('scroll', handleParallax);
    window.addEventListener('mousemove', handleParallax);
    handleParallax();
    return () => {
      window.removeEventListener('scroll', handleParallax);
      window.removeEventListener('mousemove', handleParallax);
    };
  }, []);

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
      <nav
        className="quantum-nav"
        id="quantum-nav"
        style={{
          background: navScrolled 
            ? `linear-gradient(135deg, ${portalState.colors[0]}15, ${portalState.colors[1]}10, rgba(0,0,0,0.9))` 
            : `linear-gradient(135deg, ${portalState.colors[0]}25, ${portalState.colors[1]}20, rgba(0,0,0,0.85))`,
          backdropFilter: navScrolled ? 'blur(20px)' : 'blur(30px)',
          borderBottom: `2px solid ${portalState.colors[1]}44`,
          boxShadow: `0 2px 24px ${portalState.colors[1]}22`,
          transition: 'all 1.2s ease'
        }}
      >
        <div className="nav-logo">
          <span
            className="logo-text"
            data-text="N3XUS_GEOM"
            style={{
              color: '#fff',
              filter: `drop-shadow(0 0 4px ${portalState.colors[1]}66)`,
              transition: 'filter 1.2s'
            }}
          >N3XUS_GEOM</span>
          {/* Subtle quantum glyphs in navbar */}
          <span style={{
            marginLeft: 10,
            fontSize: 16,
            color: portalState.colors[1],
            letterSpacing: '0.12em',
            verticalAlign: 'middle',
            opacity: 0.8,
            filter: `blur(0.3px) drop-shadow(0 0 4px ${portalState.colors[1]}88)`,
            transition: 'color 1.2s, filter 1.2s, opacity 1.2s',
            textShadow: `0 0 8px ${portalState.colors[1]}, 0 0 2px ${portalState.colors[0]}`
          }}>
            {glyphState.join(' ')}
          </span>
          <div className="logo-particles"></div>
        </div>
        <div className="nav-links">
          {isAuthenticated && (
            <>
              {/* Hide HOME link since we're on this page */}
              <Link to="/scenes" className="nav-link" data-dimension="1">// SCENES</Link>
              <Link to="/showcase" className="nav-link" data-dimension="2">{SHOWCASE_LINK_TEXT}</Link>
              <Link to="/geom-lab" className="nav-link" data-dimension="3">{GEOM_LAB_LINK_TEXT}</Link>
              <div className="nav-terminal">
                <button 
                  onClick={logout}
                  className="terminal-cursor"
                >
                  [L0GOUT]
                </button>
              </div>
            </>
          )}
        </div>
        <div className="nav-quantum-field"></div>
      </nav>

      {/* Base Dark Layer */}
      <div className={styles.baseDark}></div>

      {/* Quantum Portal Background Layer */}
      <div 
        className={styles.quantumPortalLayer}
        style={{
          background: `
            radial-gradient(circle at 30% 120%, 
              ${portalState.colors[0]} 0%, 
              ${portalState.colors[1]} 30%, 
              ${portalState.colors[2]} 60%, 
              transparent 80%
            ),
            radial-gradient(circle at 70% 130%, 
              ${portalState.colors[1]} 0%, 
              ${portalState.colors[2]} 40%, 
              ${portalState.colors[0]} 70%,
              transparent 90%
            )
          `
        }}
      />

      {/* Inverted veil to cover quantum colors at top */}
      <div className={styles.quantumVeil}></div>

      {/* Dark Top Veil */}
      <div className={styles.darkTopVeil}></div>

      {/* Dynamic Portal Background - With fade-out like Showcase */}
      <div style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: -3, 
        pointerEvents: 'none',
      }} aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          background: `linear-gradient(120deg, 
            ${portalState.colors[0]} 0%, 
            ${portalState.colors[1]} 60%, 
            ${portalState.colors[2]} 100%
          )`,
          transition: 'background 1.2s cubic-bezier(0.4,0,0.2,1)',
          filter: 'brightness(1.3) saturate(1.8)',
        }}>
          <defs>
            <linearGradient id="portal-glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.6"/>
              <stop offset="50%" stopColor={portalState.colors[1]} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={portalState.colors[2]} stopOpacity="0.6"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1920" height="1080" fill="url(#portal-glow)"/>
        </svg>
      </div>

      {/* 3D Parallax Layers */}
      <div ref={bgRef} className={styles.parallaxBgLayer} aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 1920 400" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '40vh',
          pointerEvents: 'none',
          opacity: 0.05
        }}>
          <defs>
            <linearGradient id="homepage-parallax-bg-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="1"/>
              <stop offset="100%" stopColor="#0a0f1a" stopOpacity="1"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1920" height="400" fill="url(#homepage-parallax-bg-grad)"/>
        </svg>
      </div>
      <div ref={fgRef} className={styles.parallaxFgLayer} aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 1920 400" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '40vh',
          pointerEvents: 'none',
          opacity: 0.02
        }}>
          <defs>
            <linearGradient id="homepage-parallax-fg-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="1"/>
              <stop offset="100%" stopColor="#0a0f1a" stopOpacity="1"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1920" height="400" fill="url(#homepage-parallax-fg-grad)"/>
        </svg>
      </div>

      {/* Parallax Container */}
      <div className={styles.parallaxContainer} id="parallax-container" ref={parallaxRef}>
        {/* Scene 1: Reality Layer */}
        {/* Scene 1: Reality Layer */}
        <section className={`quantum-scene${activeScene === 0 ? ' active' : ''}`} id="reality" data-scene="0" style={{ position: 'relative', zIndex: 1 }}>
          <div 
            className={styles.bgReality}
            style={{ position: 'absolute', zIndex: -1 }}
            aria-hidden="true"
          ></div>
          <div className="scene-content" style={{
              position: 'relative',
              zIndex: 10,
              pointerEvents: 'auto'
            }}>
            <div className="particles" style={{
              position: 'relative',
              zIndex: -1,
              pointerEvents: 'none'
            }}>
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
            <div style={{
              position: 'relative',
              zIndex: 10,
              pointerEvents: 'none'
            }}>
              <h1 className={`quantum-title ${styles.quantumTitle}`} style={{
                position: 'relative',
                zIndex: 10,
                pointerEvents: 'auto',
                marginBottom: '-10px'
              }}>
                <span className="title-word" data-word="N3XUS" style={{
                  position: 'relative',
                  zIndex: 10
                }}>
                  <ScrambleOnHover originalText="N3XUS" finalText="アトリエ" delay={3000} />
                </span><br></br>
                <span className="title-word" data-word="GE0M" style={{
                  position: 'relative',
                  zIndex: 10
                }}>
                  GE<span className="slashed-zero">0</span>M
                </span><br></br>
                <span className="title-word" data-word="LVB" style={{
                  position: 'relative',
                  zIndex: 10
                }}>
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
                <span className="stat-value" data-stat="state" style={{
                  color: portalState.colors[0],
                  textShadow: `0 0 8px ${portalState.colors[1]}, 0 0 2px ${portalState.colors[2]}`,
                  transition: 'color 1.2s, text-shadow 1.2s'
                }}>{portalState.label.toUpperCase()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">NETWORK  STATUS</span>
                <span className="stat-value" data-stat="network">-CONNECTED</span>
              </div>
            </div>
            
            {/* Show Enter Geom Lab only when logged in, Login/Signup when logged out */}
            {isAuthenticated ? (
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginTop: '48px',
                  marginBottom: '24px',
                  position: 'relative',
                  zIndex: 100,
                  pointerEvents: 'auto'
                }}
                onClick={(e) => {
                  console.log('🔵 DIV WRAPPER CLICKED (authenticated)', e.target);
                }}
              >
                <BeamScanButton
                  onClick={(e) => {
                    console.log('🟢 ENTER GEOM LAB BUTTON CLICKED!', e);
                    window.location.href = '/geom-lab';
                  }}
                  label={<>ENTER GE0M L<span className="nav-inverted-a">V</span>B</>}
                  className="home-enter-geom-lab-btn"
                />
              </div>
            ) : (
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '48px', 
                  justifyContent: 'center', 
                  marginTop: '32px',
                  position: 'relative',
                  zIndex: 100,
                  pointerEvents: 'auto'
                }}
                onClick={(e) => {
                  console.log('🔵 DIV WRAPPER CLICKED (not authenticated)', e.target);
                }}
              >
                <BeamScanButton
                  onClick={(e) => {
                    console.log('🟢 LOGIN BUTTON CLICKED!', e);
                    window.location.href = '/login';
                  }}
                  label={<>LOGI<span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>N</span></>}
                />
                <BeamScanButton
                  onClick={(e) => {
                    console.log('🟢 SIGNUP BUTTON CLICKED!', e);
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
            <p className="scene-description">
              Where code exists in superposition until observed
            </p>
            <div className="probability-waves"></div>
            <div className="code-snippets">
              <div className="floating-code">import name from './exportingFile.js';</div>
              <div className="floating-code">console.future(identity);</div>
              <div className="floating-code">PABLO D C0RDER0</div>
              <Quote />
              
      
            </div>
          </div>
          
        </section>

        {/* Scene 3: Quantum Entanglement */}
        <section className={`quantum-scene${activeScene === 2 ? ' active' : ''}`} id="entanglement" data-scene="2">
          <div className="scene-background bg-entanglement" aria-hidden="true"></div>
          <div className="scene-content">
            <h2 className="scene-title">QUANTUM ENTANGLEMENT</h2>
            <p className="scene-description">
              Modules connected across infinite space
            </p>
            <div className="entanglement-network"></div>
            <div className="connected-nodes">
              <div className="node" data-module="export">NO</div>
              <div className="node" data-module="import">TRY</div>
              <div className="quantum-bridge"></div>
            </div>
          </div>
          
        </section>

        <Scene
          id="superposition"
          isActive={activeScene === 3}
          backgroundClass="bg-superposition"
        >
          <h2 className="scene-title">SUPERPOSITION STATE</h2>
          <p className="scene-description">
            All possibilities exist simultaneously
          </p>
          <div className="superposition-field"></div>
          <div className="quantum-console">
            <div className="console-line">&gt;&gt;&gt; Initializing quantum state...</div>
            <div className="console-line">&gt;&gt;&gt; PABLO PISTOLA = ψ(quantum_state)</div>
            <div className="console-line">&gt;&gt;&gt; Observation collapsed wave function</div>
            <div className="console-line" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <svg width="40" height="40" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ethereal-grad-left" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.9"/>
                    <stop offset="50%" stopColor={portalState.colors[1]} stopOpacity="0.7"/>
                    <stop offset="100%" stopColor={portalState.colors[2]} stopOpacity="0.9"/>
                  </linearGradient>
                  <filter id="ethereal-glow-left">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <polygon 
                  points="10,2 16,6 16,14 10,18 4,14 4,6" 
                  stroke="url(#ethereal-grad-left)" 
                  strokeWidth="1.5" 
                  fill="none"
                  filter="url(#ethereal-glow-left)"
                />
                <circle cx="10" cy="10" r="3" fill={portalState.colors[0]} opacity="0.8"/>
                <circle cx="10" cy="2" r="1.5" fill={portalState.colors[1]} opacity="0.9"/>
                <circle cx="16" cy="6" r="1.5" fill={portalState.colors[2]} opacity="0.9"/>
                <circle cx="16" cy="14" r="1.5" fill={portalState.colors[0]} opacity="0.9"/>
                <circle cx="10" cy="18" r="1.5" fill={portalState.colors[1]} opacity="0.9"/>
                <circle cx="4" cy="14" r="1.5" fill={portalState.colors[2]} opacity="0.9"/>
                <circle cx="4" cy="6" r="1.5" fill={portalState.colors[0]} opacity="0.9"/>
              </svg>
              &gt;&gt;&gt; Result: "ETHEREAL"
              <svg width="40" height="40" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ethereal-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.9"/>
                    <stop offset="50%" stopColor={portalState.colors[1]} stopOpacity="0.7"/>
                    <stop offset="100%" stopColor={portalState.colors[2]} stopOpacity="0.9"/>
                  </linearGradient>
                  <filter id="ethereal-glow">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <polygon 
                  points="10,2 16,6 16,14 10,18 4,14 4,6" 
                  stroke="url(#ethereal-grad)" 
                  strokeWidth="1.5" 
                  fill="none"
                  filter="url(#ethereal-glow)"
                />
                <circle cx="10" cy="10" r="3" fill={portalState.colors[0]} opacity="0.8"/>
                <circle cx="10" cy="2" r="1.5" fill={portalState.colors[1]} opacity="0.9"/>
                <circle cx="16" cy="6" r="1.5" fill={portalState.colors[2]} opacity="0.9"/>
                <circle cx="16" cy="14" r="1.5" fill={portalState.colors[0]} opacity="0.9"/>
                <circle cx="10" cy="18" r="1.5" fill={portalState.colors[1]} opacity="0.9"/>
                <circle cx="4" cy="14" r="1.5" fill={portalState.colors[2]} opacity="0.9"/>
                <circle cx="4" cy="6" r="1.5" fill={portalState.colors[0]} opacity="0.9"/>
              </svg>
            </div>
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