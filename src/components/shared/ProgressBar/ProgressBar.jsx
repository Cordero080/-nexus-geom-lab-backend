import React, { useRef, useEffect, useState } from 'react';

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
  const [caGrid, setCaGrid] = useState(() => createGrid(48, 18));
  // Evolve CA every 120ms
  useEffect(() => {
    const interval = setInterval(() => {
      setCaGrid(g => nextGrid(g));
    }, 120);
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
          style={{ position: 'absolute', left: 0, top: 0, zIndex: 0, cursor: 'pointer' }}
          onClick={handleCaClick}
        >
          {/* Self-organizing cellular automata pattern */}
          {caGrid.map((row, y) =>
            row.map((cell, x) =>
              cell ? (
                <rect
                  key={x + '-' + y}
                  x={(x / caGrid[0].length) * 100 + '%'}
                  y={(y / caGrid.length) * 100 + '%'}
                  width={(1 / caGrid[0].length) * 100 + '%'}
                  height={(1 / caGrid.length) * 100 + '%'}
                  fill="#00fff7"
                  opacity={0.13 + 0.18 * Math.sin(anim + x * 0.2 + y * 0.3)}
                />
              ) : null
            )
          )}
        </svg>
      ),
    },
    {
      className: 'parallax-mid',
      style: (progress) => ({
        transform: `translateY(${-progress * 120}px) scale(1.04) rotate(${anim*8}deg)`,
        opacity: 0.8,
        zIndex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        pointerEvents: 'none',
        background: 'none',
      }),
      content: (
        <svg width="100%" height="100%" style={{ position: 'absolute', left: 0, top: 0 }} onClick={onQuantumCollapse}>
          {/* Quantum glyphs/runes - collapse to new set on click */}
          <g opacity="0.18">
            <text x="50%" y="40%" textAnchor="middle" fontSize="60" fill="#00fff7" fontFamily="monospace" letterSpacing="0.2em" style={{filter:'blur(0.5px)'}}>{glyphState[0]}</text>
            <text x="50%" y="70%" textAnchor="middle" fontSize="38" fill="#ff00cc" fontFamily="monospace" letterSpacing="0.2em" style={{filter:'blur(0.7px)'}}>{glyphState[1]}</text>
            <text x="50%" y="55%" textAnchor="middle" fontSize="28" fill="#ffff00" fontFamily="monospace" letterSpacing="0.2em" style={{filter:'blur(0.3px)'}}>{glyphState[2]}</text>
          </g>
        </svg>
      ),
    },
    {
      className: 'parallax-fg',
      style: (progress) => ({
        transform: `translateY(${-progress * 220}px) scale(1)`,
        opacity: 1,
        zIndex: 2,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        pointerEvents: 'none',
        background: 'none',
      }),
      content: (
        <svg width="100%" height="100%" style={{ position: 'absolute', left: 0, top: 0 }} onClick={onQuantumCollapse}>
          <defs>
            {/* Portal edge glow */}
            <radialGradient id="portal-glow" cx="50%" cy="60%" r="30%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#00fff7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0a0f1a" stopOpacity="0" />
            </radialGradient>
            {/* Quantum-collapsed world inside portal */}
            <radialGradient id="fractal-world" cx="50%" cy="60%" r="80%">
              <stop offset="0%" stopColor={portalState.colors[0]} stopOpacity="0.7" />
              <stop offset="40%" stopColor={portalState.colors[1]} stopOpacity="0.5" />
              <stop offset="100%" stopColor={portalState.colors[2]} stopOpacity="0.2" />
            </radialGradient>
            {/* Edge distortion filter */}
            <filter id="portal-distort" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="turbulence" baseFrequency="0.08" numOctaves="2" seed="7" result="turb" />
              <feDisplacementMap in2="turb" in="SourceGraphic" scale="18" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          {/* Portal: grows/rips open as you scroll, collapses to new world on click */}
          <g>
            {/* Quantum-collapsed world revealed inside portal */}
            <ellipse
              cx="50%"
              cy="60%"
              rx={8 + 24 * scrollState.progress}
              ry={8 + 24 * scrollState.progress}
              fill="url(#fractal-world)"
              filter="url(#portal-distort)"
              style={{ transition: 'rx 0.7s, ry 0.7s' }}
            />
            {/* Portal edge glow */}
            <ellipse
              cx="50%"
              cy="60%"
              rx={12 + 24 * scrollState.progress}
              ry={12 + 24 * scrollState.progress}
              fill="none"
              stroke="url(#portal-glow)"
              strokeWidth="8"
              opacity="0.7"
              filter="url(#portal-distort)"
              style={{ transition: 'rx 0.7s, ry 0.7s' }}
            />
            {/* Portal core */}
            <ellipse
              cx="50%"
              cy="60%"
              rx={6 + 6 * Math.abs(Math.sin(anim*2))}
              ry={6 + 6 * Math.abs(Math.cos(anim*2))}
              fill="#fff"
              opacity="0.8"
              style={{ filter: 'blur(2px)' }}
            />
          </g>
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
    ? 'none'
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
      <div className="progress-bar" style={{ marginBottom: '50px', width: 'auto', position: 'relative', zIndex: 3 }}>
        <div
          ref={textRef}
          className="floating-code parallax-holo"
          style={{
            opacity,
            filter,
            transform,
            color,
            transition: atBottom
              ? 'all 0.7s cubic-bezier(0.4,0,0.2,1)'
              : 'transform 1.2s cubic-bezier(0.4,0,0.2,1), opacity 1.2s, filter 1.2s, color 1.2s',
            willChange: 'transform, opacity, filter, color',
            mixBlendMode: atBottom ? 'normal' : 'screen',
          }}
        >
        </div>
      </div>
    </section>
  );
}