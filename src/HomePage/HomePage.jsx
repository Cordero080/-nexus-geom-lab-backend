
import React, { useEffect, useRef, useState } from 'react';
// import './bg.css';
// import './index.css';
import './Home.css';
import BeamScanButton from '../BeamScanButton';

export default function HomePage() {
  const [activeScene, setActiveScene] = useState(0);
  const parallaxRef = useRef(null);
  const fgRef = useRef(null);
  const bgRef = useRef(null);

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

  // 3D Parallax Layers: scroll and mousemove
  useEffect(() => {
    const handleParallax = (e) => {
      const scrollY = window.scrollY;
      const wh = window.innerHeight;
      // Mouse position (centered -0.5 to 0.5)
      let mx = 0, my = 0;
      if (e && e.type === 'mousemove') {
        mx = (e.clientX / window.innerWidth) - 0.5;
        my = (e.clientY / window.innerHeight) - 0.5;
      }
      // Parallax: background moves slowest, foreground fastest
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${mx * 30}px, ${-scrollY * 0.08 + my * 20}px, 0)`;
      }
      if (fgRef.current) {
        fgRef.current.style.transform = `translate3d(${mx * 80}px, ${-scrollY * 0.18 + my * 40}px, 0)`;
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
      <nav className="quantum-nav" id="quantum-nav">
        <div className="nav-logo">
          <span className="logo-text" data-text="JS_LAB_V2.0">PVBL0_P!ST0LA_V2.0</span>
          <div className="logo-particles"></div>
        </div>
        <div className="nav-links">
          <a href="#reality" className="nav-link" data-dimension="0">// INIT</a>
          <a href="#probability" className="nav-link" data-dimension="1">// EXEC</a>
          <a href="#entanglement" className="nav-link" data-dimension="2">// DEBUG</a>
          <a href="#superposition" className="nav-link" data-dimension="3">// DEPLOY</a>
          <div className="nav-terminal">
            <span className="terminal-cursor">[ACTIVE]</span>
          </div>
        </div>
        <div className="nav-quantum-field"></div>
      </nav>

      {/* 3D Parallax Layers */}
      <div ref={bgRef} className="parallax-bg-layer" aria-hidden="true">
        {/* Abstract SVG/gradient background shapes */}
        <svg width="100%" height="100%" viewBox="0 0 1920 400" style={{position:'absolute',top:0,left:0,width:'100vw',height:'40vh',pointerEvents:'none'}}>
          <defs>
            <linearGradient id="bg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0ff" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.08"/>
            </linearGradient>
          </defs>
          <polygon points="0,0 1920,0 1600,400 0,300" fill="url(#bg-grad1)"/>
          <ellipse cx="1600" cy="80" rx="220" ry="60" fill="#00f0ff22"/>
        </svg>
      </div>
      <div ref={fgRef} className="parallax-fg-layer" aria-hidden="true">
        {/* Foreground SVG/gradient shapes */}
        <svg width="100%" height="100%" viewBox="0 0 1920 400" style={{position:'absolute',top:0,left:0,width:'100vw',height:'40vh',pointerEvents:'none'}}>
          <defs>
            <linearGradient id="fg-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.22"/>
            </linearGradient>
          </defs>
          <polygon points="1920,0 1920,400 400,400 0,200" fill="url(#fg-grad1)"/>
          <ellipse cx="320" cy="120" rx="180" ry="40" fill="#fff2"/>
        </svg>
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
            <h1 className="quantum-title" data-text="MODERN JAVASCRIPT SYNTAX LAB">
              <span className="title-word" data-word="0">N3XUS</span><br></br>
              <span className="title-word" data-word="1">3D</span>
              <span className="title-word" data-word="2">GE0M</span>
              <span className="title-word" data-word="3">STUDI0</span>
            </h1>
            <p className="quantum-subtitle">
              / / I N T E R A C T I V E _ C O N S O L E _ A W A I T S . . .
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-label">MODULES LOADED</span>
                <span className="stat-value" data-stat="modules">003</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">QUANTUM STATE</span>
                <span className="stat-value" data-stat="state">STABLE</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">NETWORK STATUS</span>
                <span className="stat-value" data-stat="network">CONNECTED</span>
              </div>
            </div>
            <BeamScanButton
              onClick={() => window.location.href = '/playground'}
              label="Enter Playground"
              style={{ margin: '32px auto 0', display: 'block' }}
            />
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
              <div className="floating-code">PABLO DANIEL CORDERO</div>
              <div className="floating-code quote-highlight">
                "The universe is a terrifyingly elegant apparatus, built on the immutable laws of the machine (Newton), yet the joy and the agony (Beethoven) of this existence are all contained within the subjective, anxious leap of self-creation (Kierkegaard). We find that the objective reality of the cosmos (Hawking/Tyson) is, in its essence, the consciousness of a dream (Kastrup/Watts). Therefore, abandon the illusion of a separate self and simply be (Pessoa/Gibran) in this brief, defiant affirmation (Nietzsche) of the present moment."
              </div>
              
      
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

        {/* Scene 4: Superposition */}
        <section className={`quantum-scene${activeScene === 3 ? ' active' : ''}`} id="superposition" data-scene="3">
          <div className="scene-background bg-superposition"></div>
          <div className="scene-content">
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
          </div>
        </section>
      </div>

      {/* Quantum Scroll Progress - moved lower in its own space */}
      <section style={{ marginTop: '120px', marginBottom: '80px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="progress-bar" style={{ marginBottom: '24px', width: 'auto' }}>
          <div className="floating-code">"Be the defiance.</div>
        </div>
        <div className="progress-particles">&gt;&gt;&gt;The illusion is already awake."&gt;&gt;&gt;</div>
      </section>
    </>
  );
}