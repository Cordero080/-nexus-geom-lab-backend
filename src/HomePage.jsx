import React, { useEffect } from 'react';
import './bg.css';
import './index.css';
import './home.css';

export default function HomePage() {
  useEffect(() => {
    // Quantum wormhole ripple effect (homepage only)
    const handleClick = (e) => {
      const wormhole = document.getElementById('wormhole');
      if (!wormhole) return;
      // Position wormhole at click
      const size = 170;
      const x = e.clientX - size / 2;
      const y = e.clientY - size / 2;
      wormhole.style.left = `${x}px`;
      wormhole.style.top = `${y}px`;
      // Trigger ripple animation
      wormhole.classList.remove('ripple');
      // Force reflow to restart animation
      void wormhole.offsetWidth;
      wormhole.classList.add('ripple');
    };
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
      // Clean up ripple state
      const wormhole = document.getElementById('wormhole');
      if (wormhole) {
        wormhole.classList.remove('ripple');
        wormhole.style.left = '';
        wormhole.style.top = '';
      }
    };
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

      {/* Parallax Container */}
      <div className="parallax-container" id="parallax-container">
        {/* Scene 1: Reality Layer */}
        <section className="quantum-scene" id="reality" data-scene="0">
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
import BeamScanButton from './BeamScanButton';
            <div className="reality-particles"></div>
          </div>
        </section>

        {/* Scene 2: Probability Wave */}
        <section className="quantum-scene" id="probability" data-scene="1">
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
        <section className="quantum-scene" id="entanglement" data-scene="2">
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
        <section className="quantum-scene" id="superposition" data-scene="3">
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

      {/* Quantum Scroll Progress */}
      <div className="quantum-progress">
        <div className="progress-bar"><div className="floating-code">"Be the defiance.</div></div>
        <div className="progress-particles">&gt;&gt;&gt;The illusion is already awake."&gt;&gt;&gt;</div>
      </div>
      <section></section>
    </>
  );
}