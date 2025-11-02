# Quantum Portal Implementation Changes

## HomePage.jsx Changes

Replace the portal background section with:

```jsx
{
  /* Dynamic Portal Background - Restructured for middle reveal */
}
<div className="quantum-portal-system">
  {/* Base Quantum Layer */}
  <div className="quantum-base-layer">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1920 1080"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
      }}
    >
      <defs>
        <linearGradient id="quantum-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="35%" stopColor={portalState.colors[0]} />
          <stop offset="50%" stopColor={portalState.colors[1]} />
          <stop offset="65%" stopColor={portalState.colors[2]} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="dark-veil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.95)" />
          <stop offset="20%" stopColor="rgba(0,0,0,0.95)" />
          <stop offset="30%" stopColor="rgba(0,0,0,0.85)" />
          <stop offset="40%" stopColor="rgba(0,0,0,0.6)" />
          <stop offset="50%" stopColor="rgba(0,0,0,0.2)" />
          <stop offset="60%" stopColor="rgba(0,0,0,0.6)" />
          <stop offset="70%" stopColor="rgba(0,0,0,0.85)" />
          <stop offset="80%" stopColor="rgba(0,0,0,0.95)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.95)" />
        </linearGradient>
      </defs>
      {/* Quantum Background */}
      <rect width="100%" height="100%" fill="url(#quantum-gradient)" />
      {/* Dark Veil */}
      <rect width="100%" height="100%" fill="url(#dark-veil)" />
    </svg>
  </div>

  {/* Reveal Layer */}
  <div className="quantum-reveal-layer">
    <div className="quantum-cracks">
      {/* Generated crack elements */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="quantum-crack"
          style={{
            left: `${10 + i * 12}%`,
            height: "60%",
            top: "20%",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  </div>

  {/* Effect Layer */}
  <div className="quantum-effect-layer">
    <div className="quantum-particles">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="quantum-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
    <div className="quantum-grid" />
  </div>
</div>;

{
  /* Keep your existing parallax container and content */
}
```

## Add to Home.css (Homepage-specific styles)

```css
/* Quantum Portal System - Homepage Specific */
.quantum-portal-system {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

/* Base Quantum Layer */
.quantum-base-layer {
  position: absolute;
  inset: 0;
  z-index: -200;
  will-change: opacity;
}

/* Reveal Layer with Cracks */
.quantum-reveal-layer {
  position: absolute;
  inset: 0;
  z-index: -100;
  mix-blend-mode: screen;
}

.quantum-cracks {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.quantum-crack {
  position: absolute;
  width: 2px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 30%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.1) 70%,
    transparent 100%
  );
  transform-origin: center;
  animation: crackPulse 4s ease-in-out infinite;
}

/* Effect Layer */
.quantum-effect-layer {
  position: absolute;
  inset: 0;
  z-index: -150;
  mix-blend-mode: screen;
}

.quantum-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.quantum-particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: particleFloat 20s linear infinite;
}

.quantum-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px
    ), linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  transform: perspective(1000px) rotateX(60deg);
  opacity: 0.2;
}

/* Animations */
@keyframes crackPulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scaleY(1);
  }
  50% {
    opacity: 0.8;
    transform: scaleY(1.2);
  }
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(20px);
    opacity: 0;
  }
}

/* Scene Background Modifications */
.scene-background {
  /* Modify clip-paths to create reveal cracks */
  clip-path: polygon(
    0 0,
    15% 0,
    18% 5%,
    35% 0,
    37% 3%,
    60% 0,
    62% 4%,
    85% 0,
    100% 0,
    100% 40%,
    95% 45%,
    100% 50%,
    98% 55%,
    100% 60%,
    100% 100%,
    85% 95%,
    60% 100%,
    58% 97%,
    35% 100%,
    15% 95%,
    0 100%
  );
  /* Add reveal mask */
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.8) 20%,
    rgba(0, 0, 0, 0.2) 40%,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0.2) 60%,
    rgba(0, 0, 0, 0.8) 80%,
    rgba(0, 0, 0, 0.95) 100%
  );
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.8) 20%,
    rgba(0, 0, 0, 0.2) 40%,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0.2) 60%,
    rgba(0, 0, 0, 0.8) 80%,
    rgba(0, 0, 0, 0.95) 100%
  );
}
```

## Update useEffect for Enhanced Portal Animation

Add this effect to your HomePage component:

```jsx
// Enhanced portal animation effect
useEffect(() => {
  const handlePortalReveal = () => {
    const scrollProgress =
      window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight);
    const portalSystem = document.querySelector(".quantum-portal-system");
    const cracks = document.querySelectorAll(".quantum-crack");

    if (portalSystem) {
      // Intensify middle reveal based on scroll
      const intensity = Math.sin(scrollProgress * Math.PI) * 0.5 + 0.5;
      portalSystem.style.setProperty(
        "--reveal-intensity",
        intensity.toString()
      );

      // Animate cracks
      cracks.forEach((crack, i) => {
        const delay = i * 0.1;
        const scale = 1 + Math.sin(scrollProgress * Math.PI * 2 + delay) * 0.2;
        crack.style.transform = `scaleY(${scale})`;
        crack.style.opacity = (0.3 + intensity * 0.5).toString();
      });
    }
  };

  window.addEventListener("scroll", handlePortalReveal);
  handlePortalReveal(); // Initial call

  return () => window.removeEventListener("scroll", handlePortalReveal);
}, []);
```

## Key Notes:

1. These changes only affect the homepage component
2. Your existing title, subtitle, and nav styles remain unchanged
3. The quantum portal system is now positioned in the middle with proper layering
4. Dark veil ensures top stays dark
5. Cracks and reveals are added for dynamic effects
6. Performance optimized with will-change and proper z-indexing

To implement:

1. Add the new JSX code to your HomePage component
2. Add the CSS to your Home.css file
3. Add the new useEffect hook to your HomePage component
4. Test scrolling and ensure the reveals work as expected

All other components and global styles remain unchanged.
