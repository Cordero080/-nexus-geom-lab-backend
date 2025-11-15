import React, { useRef, useEffect } from 'react';
import './HomeBackground.css';

const FALLBACK_COLORS = ['#ff00cc', '#00fff7', '#1a003a'];

function withAlpha(hex, alpha) {
  if (!hex) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  const normalized = hex.replace('#', '');
  let r;
  let g;
  let b;

  if (normalized.length === 3) {
    r = parseInt(normalized[0] + normalized[0], 16);
    g = parseInt(normalized[1] + normalized[1], 16);
    b = parseInt(normalized[2] + normalized[2], 16);
  } else {
    const base = normalized.slice(0, 6);
    r = parseInt(base.slice(0, 2), 16);
    g = parseInt(base.slice(2, 4), 16);
    b = parseInt(base.slice(4, 6), 16);
  }

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * HomePage's multi-layer 3D parallax background system
 * 5 depth layers with atmospheric perspective, particle fields, and gradient veils
 * Can be reused across pages for consistent visual identity
 */
export default function HomeBackground({ portalState, children }) {
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);
  const layer4Ref = useRef(null);
  const layer5Ref = useRef(null);
  const colors = portalState?.colors ?? FALLBACK_COLORS;
  const primary = colors[0] ?? FALLBACK_COLORS[0];
  const secondary = colors[1] ?? FALLBACK_COLORS[1];
  const tertiary = colors[2] ?? FALLBACK_COLORS[2];

  useEffect(() => {
    const handleParallax = (e) => {
      const scrollY = window.scrollY;
      const wh = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - wh;
      const progress = Math.min(1, scrollY / maxScroll);

      let mx = 0,
        my = 0;
      if (e && e.type === 'mousemove') {
        mx = e.clientX / window.innerWidth - 0.5;
        my = e.clientY / window.innerHeight - 0.5;
      }

      const motionDampen = 1 - progress * 1.3;

      // Layer 1 (Deepest - Atmospheric base): Slowest movement
      if (layer1Ref.current) {
        layer1Ref.current.style.transform = `
          translate3d(${mx * 5 * motionDampen}px, ${-scrollY * 0.008 + my * 3 * motionDampen}px, 0) 
          scale(${1 - progress * 0.05})
        `;
        layer1Ref.current.style.opacity = String(0.8 - progress * 0.3);
        layer1Ref.current.style.filter = `blur(${progress * 2}px) hue-rotate(${progress * 15}deg)`;
      }

      // Layer 2 (Deep background): Color fields
      if (layer2Ref.current) {
        layer2Ref.current.style.transform = `
          translate3d(${mx * 12 * motionDampen}px, ${-scrollY * 0.02 + my * 8 * motionDampen}px, 0)
          scale(${1 - progress * 0.08}) 
          rotateZ(${mx * 2}deg)
        `;
        layer2Ref.current.style.opacity = String(0.9 - progress * 0.4);
        layer2Ref.current.style.filter = `blur(${progress * 1.5}px) saturate(${1 + progress * 0.3})`;
      }

      // Layer 3 (Grid layer): Mid-depth
      if (layer3Ref.current) {
        layer3Ref.current.style.transform = `
          translate3d(${mx * 18 * motionDampen}px, ${-scrollY * 0.035 + my * 12 * motionDampen}px, 0)
          scale(${1 - progress * 0.1})
          rotateX(${my * 3}deg)
        `;
        layer3Ref.current.style.opacity = String(0.7 - progress * 0.5);
        layer3Ref.current.style.filter = `blur(${progress * 1}px) brightness(${1 + progress * 0.2})`;
      }

      // Layer 4 (Foreground gradients): More dramatic movement
      if (layer4Ref.current) {
        layer4Ref.current.style.transform = `
          translate3d(${mx * 25 * motionDampen}px, ${-scrollY * 0.05 + my * 18 * motionDampen}px, 0)
          scale(${1 - progress * 0.12})
          rotateY(${mx * 4}deg)
        `;
        layer4Ref.current.style.opacity = String(0.9 - progress * 0.6);
        layer4Ref.current.style.filter = `blur(${progress * 0.5}px) contrast(${1 + progress * 0.3})`;
      }

      // Layer 5 (Surface sheen): Fastest, sharpest
      if (layer5Ref.current) {
        layer5Ref.current.style.transform = `
          translate3d(${mx * 35 * motionDampen}px, ${-scrollY * 0.08 + my * 25 * motionDampen}px, 0)
          scale(${1 - progress * 0.15})
          rotateZ(${-mx * 6}deg)
          rotateX(${my * 5}deg)
        `;
        layer5Ref.current.style.opacity = String(1 - progress * 0.7);
        layer5Ref.current.style.filter = `blur(${progress * 0.3}px) brightness(${1 + progress * 0.4})`;
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

  return (
    <>
      {/* Enhanced Multi-Layer 3D Parallax System */}

      {/* Layer 1: Deep Background - Atmospheric Base */}
      <div
        ref={layer1Ref}
        className="parallax-layer parallax-layer-1"
        aria-hidden="true"
        data-depth="0.1"
      >
        <div
          className="atmospheric-base"
          style={{
            background: portalState
              ? `radial-gradient(ellipse at 30% 20%, ${portalState.colors[0]}15 0%, transparent 50%), 
                       radial-gradient(ellipse at 70% 80%, ${portalState.colors[1]}20 0%, transparent 50%),
                       linear-gradient(135deg, ${portalState.colors[2]}08 0%, ${portalState.colors[0]}12 100%)`
              : '',
            transition: 'background 1.5s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div className="particle-field">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="bg-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  opacity: Math.random() * 0.3,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Layer 2: Mid Background - Color fields */}
      <div
        ref={layer2Ref}
        className="parallax-layer parallax-layer-2"
        aria-hidden="true"
        data-depth="0.25"
      >
        <div
          className="parallax-gradient parallax-gradient--deep"
          style={{
            background: `
              radial-gradient(circle at 15% 18%, ${withAlpha(primary, 0.35)} 0%, transparent 58%),
              radial-gradient(circle at 82% 78%, ${withAlpha(secondary, 0.32)} 0%, transparent 62%),
              radial-gradient(circle at 50% 94%, ${withAlpha(tertiary, 0.22)} 0%, transparent 70%),
              linear-gradient(125deg, ${withAlpha(tertiary, 0.65)} 0%, ${withAlpha(primary, 0.35)} 45%, ${withAlpha(secondary, 0.28)} 100%)
            `,
          }}
        ></div>
      </div>

      {/* Layer 3: Grid/Lines Layer */}
      <div
        ref={layer3Ref}
        className="parallax-layer parallax-layer-3"
        aria-hidden="true"
        data-depth="0.4"
      >
        <div
          className="parallax-grid"
          style={{
            backgroundImage: `
              linear-gradient(${withAlpha('#ffffff', 0.05)} 1px, transparent 1px),
              linear-gradient(90deg, ${withAlpha('#ffffff', 0.04)} 1px, transparent 1px)
            `,
          }}
        >
          <div
            className="parallax-grid__sheen"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${withAlpha(secondary, 0.1)} 35%, transparent 75%)`,
            }}
          ></div>
        </div>
      </div>

      {/* Layer 4: Foreground gradients */}
      <div
        ref={layer4Ref}
        className="parallax-layer parallax-layer-4"
        aria-hidden="true"
        data-depth="0.6"
      >
        <div
          className="parallax-gradient parallax-gradient--core"
          style={{
            background: `
              linear-gradient(140deg, ${withAlpha(primary, 0.42)} 0%, ${withAlpha(primary, 0.12)} 32%, transparent 55%),
              linear-gradient(220deg, ${withAlpha(secondary, 0.25)} 0%, transparent 60%),
              radial-gradient(circle at 32% 65%, ${withAlpha(primary, 0.35)} 0%, transparent 60%)
            `,
          }}
        ></div>
        <div
          className="parallax-gradient parallax-gradient--rays"
          style={{
            backgroundImage: `repeating-linear-gradient(115deg, ${withAlpha('#ffffff', 0.12)} 0 2px, transparent 2px 28px)`,
          }}
        ></div>
      </div>

      {/* Layer 5: Detail/Accent Layer */}
      <div
        ref={layer5Ref}
        className="parallax-layer parallax-layer-5"
        aria-hidden="true"
        data-depth="0.8"
      >
        <div
          className="parallax-gradient parallax-gradient--surface"
          style={{
            background: `
              radial-gradient(circle at 20% 25%, ${withAlpha(primary, 0.35)} 0%, transparent 52%),
              radial-gradient(circle at 78% 28%, ${withAlpha(secondary, 0.25)} 0%, transparent 55%),
              linear-gradient(90deg, ${withAlpha('#ffffff', 0.12)} 0%, transparent 45%, ${withAlpha('#ffffff', 0.08)} 100%)
            `,
          }}
        ></div>
        <div
          className="parallax-scan"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${withAlpha(tertiary, 0.18)} 45%, transparent 90%)`,
          }}
        ></div>
      </div>

      {children}
    </>
  );
}
