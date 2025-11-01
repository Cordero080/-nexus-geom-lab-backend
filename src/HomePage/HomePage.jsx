
import React, { useEffect, useRef, useState } from 'react';

// Quantum Uncertainty Utility
function quantumCollapse(states) {
  return states[Math.floor(Math.random() * states.length)];
}
import Quote from './Quote';
import ProgressBar from './ProgressBar';
import Scene from './Scene';
import sharedStyles from '../styles/shared.module.scss';
// import './bg.css';
// import './index.css';
import './Home.css';
import { BeamScanButton } from '../components/features/HUD';
import { Link } from 'react-router-dom';
import { GEOM_LAB_LINK_TEXT, SHOWCASE_LINK_TEXT } from '../nav/navLabels';
import { useAuth } from '../context/AuthContext';

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
  
  // Quantum Uncertainty UI State (same as Showcase)
  const portalWorlds = [
    { colors: ["#ff00cc", "#00fff7", "#1a003a"], label: "Fractal" },
    { colors: ["#ffea00", "#7300ffff", "#003a2a"], label: "Nebula" },
    { colors: ["#ff3300", "#cc00ff", "#0a0f1a"], label: "Inferno" },
    { colors: ["#00ff33", "#00aaff", "#003a3a"], label: "Emerald" },
    { colors: ["#ffffff", "#00fff7", "#0a0f1a"], label: "Singularity" },
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

      // Legacy layers for backward compatibility
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${mx * 8 * motionDampen}px, ${-scrollY * 0.015 + my * 6 * motionDampen}px, 0)`;
        bgRef.current.style.opacity = String(1 - progress * 0.4);
      }
      
      if (fgRef.current) {
        fgRef.current.style.transform = `translate3d(${mx * 20 * motionDampen}px, ${-scrollY * 0.04 + my * 12 * motionDampen}px, 0)`;
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
        
        // Apply 3D transforms to scenes - Skip for superposition scene
        if (index !== 3) {
          scene.style.transform = `
            perspective(1500px) 
            translateZ(${sceneDepth}px) 
            scale(${sceneScale})
            rotateX(${sceneTilt}deg)
          `;
          scene.style.opacity = String(1 - normalizedDist * 0.3);
        } else {
          // Keep superposition scene flat
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

  return (
    <>
      {/* Enhanced Holographic Cursor System */}
      <div className="cursor" id="cursor"></div>
      <div className="gravity-field" id="gravity-field"></div>
      <div className="wormhole" id="wormhole"></div>
      <div className="dimensional-rift" id="dimensional-rift"></div>

      {/* VINE-INSPIRED QUANTUM NAVIGATION */}
      <nav
        className="quantum-nav"
        id="quantum-nav"
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
            color: portalState.colors[2] + '99',
            letterSpacing: '0.12em',
            verticalAlign: 'middle',
            opacity: 0.55,
            filter: `blur(0.2px) drop-shadow(0 0 2px ${portalState.colors[1]}44)`,
            transition: 'color 1.2s, filter 1.2s, opacity 1.2s'
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

      {/* Dynamic Portal Background - With fade-out like Showcase */}
      <div style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '40vh', 
        zIndex: -100, 
        pointerEvents: 'none',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)',
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)'
      }} aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 1920 400" style={{position:'absolute',top:0,left:0,width:'100vw',height:'40vh',pointerEvents:'none', background: `linear-gradient(120deg, ${portalState.colors[0]} 0%, ${portalState.colors[1]} 60%, ${portalState.colors[2]} 100%)`, transition: 'background 3s cubic-bezier(0.4,0,0.2,1)'}}>
          <defs>
            <linearGradient id="homepage-bg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.18"/>
              <stop offset="100%" stopColor={portalState.colors[1]} stopOpacity="0.08"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1920" height="400" fill="rgba(0,0,0,0.1)"/>
          <polygon points="0,0 1920,0 1920,400 0,300" fill="url(#homepage-bg-grad1)"/>
          <ellipse cx="1600" cy="80" rx="320" ry="60" fill={portalState.colors[2] + '22'}/>
        </svg>
      </div>

      {/* Enhanced Multi-Layer 3D Parallax System */}
      
      {/* Layer 1: Deep Background - Atmospheric Base */}
      <div ref={layer1Ref} className="parallax-layer parallax-layer-1" aria-hidden="true" data-depth="0.1">
        <div className="atmospheric-base" style={{
          background: `radial-gradient(ellipse at 30% 20%, ${portalState.colors[0]}15 0%, transparent 50%), 
                       radial-gradient(ellipse at 70% 80%, ${portalState.colors[1]}20 0%, transparent 50%),
                       linear-gradient(135deg, ${portalState.colors[2]}08 0%, ${portalState.colors[0]}12 100%)`,
          transition: 'background 1.5s cubic-bezier(0.4,0,0.2,1)'
        }}>
          <div className="particle-field">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="bg-particle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                opacity: Math.random() * 0.3
              }}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Layer 2: Mid Background - Geometric Shapes */}
      <div ref={layer2Ref} className="parallax-layer parallax-layer-2" aria-hidden="true" data-depth="0.25">
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position:'absolute',top:0,left:0,width:'100vw',height:'100vh',pointerEvents:'none'}}>
          <defs>
            <linearGradient id="bg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.25"/>
              <stop offset="50%" stopColor={portalState.colors[1]} stopOpacity="0.15"/>
              <stop offset="100%" stopColor={portalState.colors[2]} stopOpacity="0.08"/>
            </linearGradient>
            <linearGradient id="bg-grad2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={portalState.colors[2]} stopOpacity="0.20"/>
              <stop offset="100%" stopColor={portalState.colors[0]} stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          {/* Large background shapes with color bleed */}
          <polygon points="0,0 1920,0 1600,600 0,400" fill="url(#bg-grad1)" className="shape-morph-1"/>
          <polygon points="320,600 1920,500 1920,1080 0,1080" fill="url(#bg-grad2)" className="shape-morph-2"/>
          <ellipse cx="1600" cy="200" rx="400" ry="150" fill={portalState.colors[1]+"18"} className="floating-orb-1"/>
          <ellipse cx="300" cy="800" rx="300" ry="100" fill={portalState.colors[2]+"22"} className="floating-orb-2"/>
        </svg>
      </div>

      {/* Layer 3: Grid/Lines Layer */}
      <div ref={layer3Ref} className="parallax-layer parallax-layer-3" aria-hidden="true" data-depth="0.4">
        <div className="quantum-grid" style={{
          backgroundImage: `
            linear-gradient(rgba(${parseInt(portalState.colors[0].slice(1,3), 16)}, ${parseInt(portalState.colors[0].slice(3,5), 16)}, ${parseInt(portalState.colors[0].slice(5,7), 16)}, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(${parseInt(portalState.colors[1].slice(1,3), 16)}, ${parseInt(portalState.colors[1].slice(3,5), 16)}, ${parseInt(portalState.colors[1].slice(5,7), 16)}, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}>
          <div className="energy-lines">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="energy-line" style={{
                background: `linear-gradient(90deg, transparent, ${portalState.colors[i % 3]}40, transparent)`,
                top: `${(i + 1) * 12}%`,
                animationDelay: `${i * 0.5}s`
              }}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Layer 4: Foreground Shapes - Higher contrast */}
      <div ref={layer4Ref} className="parallax-layer parallax-layer-4" aria-hidden="true" data-depth="0.6">
        <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{position:'absolute',top:0,left:0,width:'100vw',height:'100vh',pointerEvents:'none'}}>
          <defs>
            <linearGradient id="fg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15"/>
              <stop offset="50%" stopColor={portalState.colors[1]} stopOpacity="0.25"/>
              <stop offset="100%" stopColor={portalState.colors[2]} stopOpacity="0.12"/>
            </linearGradient>
            <radialGradient id="fg-radial" cx="0.5" cy="0.5" r="0.8">
              <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.3"/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
          </defs>
          <polygon points="1920,0 1920,500 800,600 0,300" fill="url(#fg-grad1)" className="fg-shape-1"/>
          <polygon points="1200,400 1920,350 1920,1080 600,1080" fill="url(#fg-radial)" className="fg-shape-2"/>
          <circle cx="400" cy="300" r="150" fill={portalState.colors[0]+"25"} className="floating-orb-3"/>
          <circle cx="1500" cy="700" r="200" fill={portalState.colors[2]+"20"} className="floating-orb-4"/>
        </svg>
      </div>

      {/* Layer 5: Detail/Accent Layer */}
      <div ref={layer5Ref} className="parallax-layer parallax-layer-5" aria-hidden="true" data-depth="0.8">
        <div className="detail-elements">
          <div className="quantum-sparks">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="spark" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: portalState.colors[i % 3],
                animationDelay: `${Math.random() * 5}s`
              }}></div>
            ))}
          </div>
          <div className="holographic-frames">
            <div className="holo-frame frame-1" style={{borderColor: portalState.colors[0]+"60"}}></div>
            <div className="holo-frame frame-2" style={{borderColor: portalState.colors[1]+"60"}}></div>
            <div className="holo-frame frame-3" style={{borderColor: portalState.colors[2]+"60"}}></div>
          </div>
        </div>
      </div>
      {/* Parallax Container */}
      <div className="parallax-container" id="parallax-container" ref={parallaxRef}>
        {/* Scene 1: Reality Layer */}
        <section className={`quantum-scene${activeScene === 0 ? ' active' : ''}`} id="reality" data-scene="0">
          <div className="scene-background bg-reality"></div>
          <div className="scene-content">
            <div className="particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
            <div className="terminal-header">
              <span className="coordinates">37.7749° N, 122.4194° W</span>
              <span className="timestamp" id="timestamp"></span>
            </div>
            <h1 className="quantum-title">
              <span className="title-word" data-word="N3XUS">
                <ScrambleOnHover originalText="N3XUS" finalText="アトリエ" delay={3000} />
              </span><br></br>
              <span className="title-word" data-word="GE0M">GE<span className="slashed-zero">0</span>M</span><br></br>
              <span className="title-word" data-word="LVB">L<span className="title-inverted-v">V</span>B</span>
              {/* Show quantum glyphs globally */}
              
            </h1>
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
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginTop: '48px',
                marginBottom: '24px'
              }}>
                <BeamScanButton
                  onClick={() => window.location.href = '/geom-lab'}
                  label={<>ENTER GE0M L<span className="nav-inverted-a">V</span>B</>}
                  style={{
                    fontSize: '24px',
                    padding: '24px 180px',
                    letterSpacing: '0.2em'
                  }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', marginTop: '32px' }}>
                <BeamScanButton
                  onClick={() => window.location.href = '/login'}
                  label={<>LOGI<span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>N</span></>}
                />
                <BeamScanButton
                  onClick={() => window.location.href = '/signup'}
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
          <div className="scene-background bg-probability"></div>
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
          <div className="scene-background bg-entanglement"></div>
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
            <div className="console-line">&gt;&gt;&gt; Result: "ETHEREAL" ✨</div>
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