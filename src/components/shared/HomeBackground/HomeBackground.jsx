import React, { useRef, useEffect } from 'react';
import './HomeBackground.css';

/**
 * HomePage's multi-layer 3D parallax background system
 * 5 depth layers with atmospheric perspective, particle fields, and geometric shapes
 * Can be reused across pages for consistent visual identity
 */
export default function HomeBackground({ portalState, children }) {
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);
  const layer4Ref = useRef(null);
  const layer5Ref = useRef(null);
  const bgRef = useRef(null);
  const fgRef = useRef(null);

  useEffect(() => {
    const handleParallax = (e) => {
      const scrollY = window.scrollY;
      const wh = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - wh;
      const progress = Math.min(1, scrollY / maxScroll);
      
      let mx = 0, my = 0;
      if (e && e.type === 'mousemove') {
        mx = (e.clientX / window.innerWidth) - 0.5;
        my = (e.clientY / window.innerHeight) - 0.5;
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

      // Layer 2 (Deep background): Geometric shapes
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

      // Layer 4 (Foreground shapes): More dramatic movement
      if (layer4Ref.current) {
        layer4Ref.current.style.transform = `
          translate3d(${mx * 25 * motionDampen}px, ${-scrollY * 0.05 + my * 18 * motionDampen}px, 0)
          scale(${1 - progress * 0.12})
          rotateY(${mx * 4}deg)
        `;
        layer4Ref.current.style.opacity = String(0.9 - progress * 0.6);
        layer4Ref.current.style.filter = `blur(${progress * 0.5}px) contrast(${1 + progress * 0.3})`;
      }

      // Layer 5 (Detail layer): Fastest, sharpest
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

      // Legacy layers
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${mx * 8 * motionDampen}px, ${-scrollY * 0.015 + my * 6 * motionDampen}px, 0)`;
        bgRef.current.style.opacity = String(1 - progress * 0.4);
      }
      
      if (fgRef.current) {
        fgRef.current.style.transform = `translate3d(${mx * 20 * motionDampen}px, ${-scrollY * 0.04 + my * 12 * motionDampen}px, 0)`;
        fgRef.current.style.opacity = String(0.9 - progress * 0.6);
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
      <div ref={layer1Ref} className="parallax-layer parallax-layer-1" aria-hidden="true" data-depth="0.1">
        <div className="atmospheric-base" style={{
          background: portalState ? `radial-gradient(ellipse at 30% 20%, ${portalState.colors[0]}15 0%, transparent 50%), 
                       radial-gradient(ellipse at 70% 80%, ${portalState.colors[1]}20 0%, transparent 50%),
                       linear-gradient(135deg, ${portalState.colors[2]}08 0%, ${portalState.colors[0]}12 100%)` : '',
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
              <stop offset="0%" stopColor={portalState?.colors[0] || '#ff00cc'} stopOpacity="0.25"/>
              <stop offset="50%" stopColor={portalState?.colors[1] || '#00fff7'} stopOpacity="0.15"/>
              <stop offset="100%" stopColor={portalState?.colors[2] || '#1a003a'} stopOpacity="0.08"/>
            </linearGradient>
            <linearGradient id="bg-grad2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={portalState?.colors[2] || '#1a003a'} stopOpacity="0.20"/>
              <stop offset="100%" stopColor={portalState?.colors[0] || '#ff00cc'} stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          <polygon points="0,0 1920,0 1600,600 0,400" fill="url(#bg-grad1)" className="shape-morph-1"/>
          <polygon points="320,600 1920,500 1920,1080 0,1080" fill="url(#bg-grad2)" className="shape-morph-2"/>
          <ellipse cx="1600" cy="200" rx="400" ry="150" fill={(portalState?.colors[1] || '#00fff7')+"18"} className="floating-orb-1"/>
          <ellipse cx="300" cy="800" rx="300" ry="100" fill={(portalState?.colors[2] || '#1a003a')+"22"} className="floating-orb-2"/>
        </svg>
      </div>

      {/* Layer 3: Grid/Lines Layer */}
      <div ref={layer3Ref} className="parallax-layer parallax-layer-3" aria-hidden="true" data-depth="0.4">
        <div className="quantum-grid" style={{
          backgroundImage: portalState ? `
            linear-gradient(rgba(${parseInt(portalState.colors[0].slice(1,3), 16)}, ${parseInt(portalState.colors[0].slice(3,5), 16)}, ${parseInt(portalState.colors[0].slice(5,7), 16)}, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(${parseInt(portalState.colors[1].slice(1,3), 16)}, ${parseInt(portalState.colors[1].slice(3,5), 16)}, ${parseInt(portalState.colors[1].slice(5,7), 16)}, 0.1) 1px, transparent 1px)
          ` : '',
          backgroundSize: '100px 100px'
        }}>
          <div className="energy-lines">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="energy-line" style={{
                background: `linear-gradient(90deg, transparent, ${(portalState?.colors[i % 3] || '#00fff7')}40, transparent)`,
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
              <stop offset="50%" stopColor={portalState?.colors[1] || '#00fff7'} stopOpacity="0.25"/>
              <stop offset="100%" stopColor={portalState?.colors[2] || '#1a003a'} stopOpacity="0.12"/>
            </linearGradient>
            <radialGradient id="fg-radial" cx="0.5" cy="0.5" r="0.8">
              <stop offset="0%" stopColor={portalState?.colors[0] || '#ff00cc'} stopOpacity="0.3"/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
          </defs>
          <polygon points="1920,0 1920,500 800,600 0,300" fill="url(#fg-grad1)" className="fg-shape-1"/>
          <polygon points="1200,400 1920,350 1920,1080 600,1080" fill="url(#fg-radial)" className="fg-shape-2"/>
          <circle cx="400" cy="300" r="150" fill={(portalState?.colors[0] || '#ff00cc')+"25"} className="floating-orb-3"/>
          <circle cx="1500" cy="700" r="200" fill={(portalState?.colors[2] || '#1a003a')+"20"} className="floating-orb-4"/>
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
                background: portalState?.colors[i % 3] || '#00fff7',
                animationDelay: `${Math.random() * 5}s`
              }}></div>
            ))}
          </div>
          <div className="holographic-frames">
            <div className="holo-frame frame-1" style={{borderColor: (portalState?.colors[0] || '#ff00cc')+"60"}}></div>
            <div className="holo-frame frame-2" style={{borderColor: (portalState?.colors[1] || '#00fff7')+"60"}}></div>
            <div className="holo-frame frame-3" style={{borderColor: (portalState?.colors[2] || '#1a003a')+"60"}}></div>
          </div>
        </div>
      </div>

      {children}
    </>
  );
}
