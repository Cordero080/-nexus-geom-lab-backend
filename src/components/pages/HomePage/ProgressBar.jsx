import React, { useRef, useEffect, useState } from 'react';
import CompoundIcosahedronAnimation from './CompoundIcosahedronAnimation';

// Utility for quantum collapse (random state selection)
function quantumCollapse(states) {
  return states[Math.floor(Math.random() * states.length)];
}

// --- Cellular Automata for Self-Organizing Pattern ---
function createGrid(cols, rows) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() > 0.8 ? 1 : 0))
  );
}
function nextGrid(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = grid.map(arr => arr.slice());
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let sum = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const ny = (y + i + rows) % rows;
          const nx = (x + j + cols) % cols;
          sum += grid[ny][nx];
        }
      }
      // Conway's Game of Life rules
      if (grid[y][x] === 1) {
        newGrid[y][x] = sum === 2 || sum === 3 ? 1 : 0;
      } else {
        newGrid[y][x] = sum === 3 ? 1 : 0;
      }
    }
  }
  return newGrid;
}
export default function ProgressBar({ portalState, glyphState, onQuantumCollapse }) {
  const textRef = useRef();
  const [scrollState, setScrollState] = useState({ progress: 0, atBottom: false });
  const [pulse, setPulse] = useState(0);
  const [anim, setAnim] = useState(0);

  // --- Cellular Automata State ---
  const [caGrid, setCaGrid] = useState(() => createGrid(60, 24)); // Increased density
  // Evolve CA every 100ms (slightly faster)
  useEffect(() => {
    const interval = setInterval(() => {
      setCaGrid(g => nextGrid(g));
    }, 100);
    return () => clearInterval(interval);
  }, []);
  // Animate for other effects
  useEffect(() => {
    let frame;
    const animate = () => {
      setAnim(Date.now() / 1000);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  // User click: "heal" the pattern (grow cells at click)
  function handleCaClick(e) {
    const rect = e.target.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * caGrid[0].length);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * caGrid.length);
    setCaGrid(g => {
      const newG = g.map(row => row.slice());
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = (x + dx + newG[0].length) % newG[0].length;
          const ny = (y + dy + newG.length) % newG.length;
          newG[ny][nx] = 1;
        }
      }
      return newG;
    });
  }

  const layers = [
    {
      className: 'parallax-bg',
      style: (progress) => ({
        transform: `translateY(${-progress * 60}px) scale(1.1)`,
        opacity: 1,
        zIndex: 0,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 60% 60%, #0a0f1a 60%, #000 100%)',
        overflow: 'hidden',
      }),
      content: (
        <svg
          width="100%" height="100%"
          style={{ position: 'absolute', left: 0, top: 0, zIndex: 0, cursor: 'none' }}
          onClick={handleCaClick}
        >
          <defs>
            {/* Portal-themed gradients for cells */}
            <linearGradient id="cell-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.9"/>
              <stop offset="100%" stopColor={portalState.colors[1]} stopOpacity="0.6"/>
            </linearGradient>
            <linearGradient id="cell-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={portalState.colors[1]} stopOpacity="0.8"/>
              <stop offset="100%" stopColor={portalState.colors[2]} stopOpacity="0.5"/>
            </linearGradient>
            <linearGradient id="cell-grad-3" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={portalState.colors[2]} stopOpacity="0.7"/>
              <stop offset="100%" stopColor={portalState.colors[0]} stopOpacity="0.4"/>
            </linearGradient>
            {/* Glow filter for cells */}
            <filter id="cell-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Self-organizing cellular automata pattern with portal colors */}
          {caGrid.map((row, y) =>
            row.map((cell, x) => {
              if (!cell) return null;
              // Use different gradients based on position for variety
              const gradNum = (x + y) % 3;
              const gradId = `cell-grad-${gradNum + 1}`;
              const baseOpacity = 2.15 + 0.25 * Math.sin(anim + x * 0.2 + y * 0.3);
              
              const cellX = (x / caGrid[0].length) * 100;
              const cellY = (y / caGrid.length) * 100;
              const cellWidth = (5 / caGrid[0].length) * 100;
              const cellHeight = (0.1 / caGrid.length) * 100;
              
              return (
                <rect
                  key={x + '-' + y}
                  x={cellX + '%'}
                  y={cellY + '%'}
                  width={cellWidth + '%'}
                  height={cellHeight + '%'}
                  fill={`url(#${gradId})`}
                  opacity={baseOpacity}
                  filter="url(#cell-glow)"
                  rx="0.3"
                >
                  <animate
                    attributeName="opacity"
                    values={`${baseOpacity};${baseOpacity * 1.5};${baseOpacity}`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </rect>
              );
            })
          )}
        </svg>
      ),
    },
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (!textRef.current) return;
      const rect = textRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      let progress = 1 - Math.max(0, Math.min(1, rect.bottom / windowH));
      progress = Math.max(0, Math.min(1, progress));
      const atBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 2);
      setScrollState({ progress, atBottom });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Time-based pulse effect
  useEffect(() => {
    let frame;
    const animate = () => {
      setPulse(Math.sin(Date.now() / 600)); // slow pulse
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const { progress, atBottom } = scrollState;
  // Combine scroll and pulse for spectral effect
  const pulseNorm = 20.5 + 20.5 * pulse; // 0 to 1
  const opacity = atBottom ? 1 : 0.15 + pulseNorm * 0.5 * progress + 3.35 * progress;
  const blur = atBottom ? 0 : 22 + 88 * (1 - pulseNorm) * progress;
  const color = atBottom ? '#00fff7af' : `rgba(0,255,247,${0.5 + 0.5 * progress})`;
  const filter = `blur(${blur}px) brightness(${1 + progress * 1.2}) saturate(${1.2 + progress * 1.3})`;
  const transform = atBottom
    ? 'translateY(60px)'
    : `translateY(${-40 * (1 - progress)}px) scale(${1 + progress * 0.7 + pulseNorm * 0.1}) skewY(${-6 * progress}deg)`;

  return (
    <section style={{
      marginTop: '120px',
      marginBottom: '80px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      minHeight: '220px',
      overflow: 'hidden',
    }}>
      {/* Multi-layer parallax backgrounds */}
      {layers.map((layer, i) => (
        <div
          key={layer.className}
          className={layer.className}
          style={layer.style(progress)}
        >
          {layer.content}
        </div>
      ))}
      {/* Compound Icosahedron Animation */}
      <CompoundIcosahedronAnimation progress={progress} />
      <div className="progress-bar" style={{ marginBottom: '50px', width: 'auto', position: 'relative', zIndex: 3 }}>
        <div
          ref={textRef}
          className="floating-code parallax-holo"
          style={{
            opacity,
            filter,
            transform,
            color,
            fontSize: atBottom ? '2em' : '2.25em',
            transition: atBottom
              ? 'all 0.7s cubic-bezier(0.4,0,0.2,1)'
              : 'transform 1.2s cubic-bezier(0.4,0,0.2,1), opacity 1.2s, filter 1.2s, color 1.2s',
            willChange: 'transform, opacity, filter, color',
            mixBlendMode: atBottom ? 'normal' : 'screen',
            fontFamily: "'Orbitron', 'Rajdhani', monospace",
          }}
        >
        </div>
      </div>
    </section>
  );
}
