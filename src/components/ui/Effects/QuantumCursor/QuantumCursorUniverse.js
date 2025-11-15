/**
 * QUANTUM CONSTELLATION CURSOR UNIVERSE ENGINE
 * Controls the behavior of the QuantumCursor component
 * Creates particle effects, energy waves, and interactive cursor elements
 */
export default class QuantumCursorUniverse {
  constructor() {
    this.cursor = document.getElementById('cursor');
    this.gravityField = document.getElementById('gravity-field');
    this.dimensionalRift = document.getElementById('dimensional-rift');

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.velocity = 0;
    this.angle = 0;

    this.particles = [];
    this.trailParticles = []; // New: Dedicated trail particles
    this.energyWaves = [];
    this.maxParticles = 10;
    this.maxTrailParticles = 500; // Much larger pool to prevent cutoff
    this.maxEnergyWaves = 3; // Hexagon formation

    this.isMouseMoving = false;
    this.moveTimeout = null;
    this.quantumState = 0;
    this.dimensionalTear = false;
    this.isOverControl = false; // Track if mouse is over a control element
    this.frameCount = 0;

    this.init();
  }

  init() {
    // Don't set cursor style here - we'll let the CSS handle it

    this.createParticleSystem();
    this.createTrailParticleSystem(); // New: Trail particles
    this.createEnergyWaves();

    document.addEventListener('mousemove', (e) => this.updateMousePosition(e));
    document.addEventListener('click', (e) => {
      if (!this.isInGeomLab() && !this.isOverControl) {
        this.createWormhole();
      }
    });
    document.addEventListener('mousedown', (e) => {
      // Disable dimensional rift effect in the geom-lab route and over controls
      if (!this.isInGeomLab() && !this.isOverControl) {
        this.createDimensionalRift();
      }
    });
    document.addEventListener('mouseup', () => this.closeDimensionalRift());

    this.animate();
  }

  // Helper method to check if we're currently in the geom-lab route
  isInGeomLab() {
    return window.location.pathname.includes('/geom-lab');
  }

  updateMousePosition(e) {
    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    // Calculate velocity and angle for trail effects
    const dx = this.mouseX - this.prevMouseX;
    const dy = this.mouseY - this.prevMouseY;
    this.velocity = Math.sqrt(dx * dx + dy * dy);
    this.angle = Math.atan2(dy, dx);

    // Check if mouse is over an interactive control element
    const target = e.target;
    this.isOverControl =
      target.tagName === 'INPUT' ||
      target.tagName === 'SELECT' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'LABEL' ||
      target.classList.contains('section-header') ||
      target.classList.contains('controls');

    // Show/hide cursor based on our context
    if (this.cursor) {
      // Only hide cursor in geom-lab page, always show on homepage
      if (this.isInGeomLab()) {
        this.cursor.style.opacity = '0'; // Hide only in geom-lab
      } else {
        this.cursor.style.opacity = '1'; // Always show on homepage, regardless of what element we're over
      }
    }

    this.isMouseMoving = true;
    clearTimeout(this.moveTimeout);
    this.moveTimeout = setTimeout(() => {
      this.isMouseMoving = false;
    }, 100);

    // Only create particles when not in geom-lab
    if (!this.isInGeomLab()) {
      this.createQuantumParticles();
      this.spawnTrailParticles(); // New: Spawn trail particles
    }
  }

  createParticleSystem() {
    for (let i = 0; i < this.maxParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'quantum-particle';
      document.body.appendChild(particle);

      this.particles.push({
        element: particle,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        life: Math.random(),
        maxLife: Math.random() * 4 + 2,
        hue: Math.random() * 360,
        baseSize: 0.8 + Math.random() * 0.4,
      });
    }
  }

  createEnergyWaves() {
    for (let i = 0; i < this.maxEnergyWaves; i++) {
      const wave = document.createElement('div');
      wave.className = 'energy-wave';
      document.body.appendChild(wave);

      this.energyWaves.push({
        element: wave,
        angle: (40 / this.maxEnergyWaves) * i,
        distance: 20,
        speed: Math.random() * 2.5 + 0.8,
      });
    }
  }

  // New: Create trail particle system
  createTrailParticleSystem() {
    for (let i = 0; i < this.maxTrailParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'trail-particle';
      document.body.appendChild(particle);

      this.trailParticles.push({
        element: particle,
        x: -100,
        y: -100,
        targetX: -100,
        targetY: -100,
        life: 0,
        maxLife: 1.0, // Much longer lifetime for extended dragon trail
        size: 40 + Math.random() * 6,
        delay: i * 0.02, // Stagger the particles
        hue: 0,
        active: false,
      });
    }
  }

  // New: Spawn trail particles based on movement
  spawnTrailParticles() {
    this.frameCount++;

    // Spawn more particles when moving faster
    const spawnRate = Math.min(Math.floor(this.velocity / 1.5), 5); // More particles

    if (this.frameCount % 1 === 0 && this.velocity > 0.5) {
      // Every frame, lower threshold
      for (let i = 0; i < spawnRate; i++) {
        const particle = this.trailParticles.find((p) => !p.active);
        if (particle) {
          // Spawn at the visual cursor position (targetX/targetY) not the mouse position
          particle.x = this.targetX;
          particle.y = this.targetY;
          particle.targetX = particle.x;
          particle.targetY = particle.y;
          particle.life = particle.maxLife;
          particle.active = true;
          particle.size = 3 + Math.min(this.velocity / 10, 8); // Size based on velocity

          // Mostly blue to magenta (220-300), with occasional teal accent (170-190)
          const useTeal = Math.random() < 0.15; // 15% chance for teal accent
          particle.hue = useTeal
            ? 170 + Math.random() * 20 // Teal accent
            : 220 + ((this.quantumState * 100 + this.velocity * 5) % 80); // Blue to magenta
        }
      }
    }
  }

  createQuantumParticles() {
    const particle = this.particles[Math.floor(Math.random() * this.particles.length)];
    if (particle) {
      particle.x = this.mouseX + (Math.random() - 0.5) * 30;
      particle.y = this.mouseY + (Math.random() - 0.5) * 200;
      particle.vx = (Math.random() - 0.5) * 8;
      particle.vy = (Math.random() - 0.5) * 8;
      particle.life = particle.maxLife;
      // Mostly blue to magenta, with occasional teal accent
      const useTeal = Math.random() < 0.15;
      particle.hue = useTeal ? 170 + Math.random() * 20 : 220 + Math.random() * 80;
    }
  }

  createDimensionalRift() {
    this.dimensionalTear = true;
    if (this.dimensionalRift) {
      this.dimensionalRift.style.opacity = '1';
      this.dimensionalRift.style.left = this.mouseX - 150 + 'px';
      this.dimensionalRift.style.top = this.mouseY + 'px';
      this.dimensionalRift.style.transform = `rotate(${Math.random() * 360}deg)`;
    }
  }

  createWormhole() {
    const wormhole = document.getElementById('wormhole');
    if (wormhole) {
      wormhole.style.opacity = '1';
      wormhole.style.left = this.mouseX + 'px';
      wormhole.style.top = this.mouseY + 'px';
      wormhole.style.transform = 'translate(-50%, -50%) scale(0)';

      // Animate wormhole ripple
      requestAnimationFrame(() => {
        wormhole.style.transition = 'all 0.8s ease-out';
        wormhole.style.transform = 'translate(-50%, -50%) scale(3)';
        wormhole.style.opacity = '0';
      });

      // Reset after animation
      setTimeout(() => {
        wormhole.style.transition = 'none';
        wormhole.style.transform = 'translate(-50%, -50%) scale(0)';
      }, 800);
    }
  }

  closeDimensionalRift() {
    this.dimensionalTear = false;
    if (this.dimensionalRift) {
      this.dimensionalRift.style.opacity = '0';
    }
  }

  updatePhysics() {
    this.targetX += (this.mouseX - this.targetX) * 0.15;
    this.targetY += (this.mouseY - this.targetY) * 0.15;

    if (this.cursor) {
      this.cursor.style.left = this.targetX + 'px';
      this.cursor.style.top = this.targetY + 'px';

      // Electric blues to vibrant magenta - full cyberpunk spectrum (220-300 hue range)
      const baseHue = 220 + ((this.quantumState * 100) % 80); // Cycles through 220-300 (deep blue to magenta)
      const pulseScale = 0.7 + Math.sin(this.quantumState * 3) * 0.2; // Smaller base size
      const ringPulse = 1 + Math.sin(this.quantumState * 2) * 0.15;

      // Multiple layered box-shadows to create concentric color rings (smaller)
      this.cursor.style.boxShadow = `
        0 0 4px 1px hsl(${baseHue}, 100%, 70%),
        0 0 8px 2px hsl(${220 + ((baseHue + 30) % 80)}, 100%, 60%),
        0 0 12px 3px hsl(${220 + ((baseHue + 50) % 80)}, 80%, 55%),
        0 0 16px 4px hsl(${260}, 70%, 50%, 0.6),
        inset 0 0 4px hsl(${220 + ((baseHue + 20) % 80)}, 100%, 80%)
      `;

      this.cursor.style.background = `
        radial-gradient(circle,
          hsl(${baseHue}, 100%, 95%) 0%,
          hsl(${220 + ((baseHue + 30) % 80)}, 100%, 85%) 30%,
          hsl(${220 + ((baseHue + 50) % 80)}, 90%, 75%) 60%,
          hsl(${270}, 80%, 65%) 100%
        )
      `;

      this.cursor.style.transform = `translate(-50%, -50%) scale(${pulseScale * ringPulse})`;
      this.cursor.style.width = '24px'; // Decreased by 15% from 28px
      this.cursor.style.height = '24px';
    }

    // Adjust gravity field visibility
    if (this.gravityField) {
      this.gravityField.style.left = this.mouseX - 90 + 'px';
      this.gravityField.style.top = this.mouseY - 90 + 'px';

      // Only hide gravity field in geom-lab, always show on homepage
      if (this.isInGeomLab()) {
        this.gravityField.style.opacity = '0';
      } else {
        this.gravityField.style.opacity = '0.7';
      }
    }

    this.particles.forEach((particle) => {
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0 && distance < 200) {
        const force = Math.min(30 / (distance * 0.5), 0.3);
        particle.vx += (dx / distance) * force * 0.08;
        particle.vy += (dy / distance) * force * 0.08;
      }

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.985;
      particle.vy *= 0.985;

      if (particle.x < -10) particle.x = window.innerWidth + 10;
      if (particle.x > window.innerWidth + 10) particle.x = -10;
      if (particle.y < -10) particle.y = window.innerHeight + 10;
      if (particle.y > window.innerHeight + 10) particle.y = -10;

      particle.life -= 0.008;
      if (particle.life <= 0) {
        particle.life = particle.maxLife;
        particle.x = Math.random() * window.innerWidth;
        particle.y = Math.random() * window.innerHeight;
        particle.vx = (Math.random() - 0.5) * 1;
        particle.vy = (Math.random() - 0.5) * 1;
      }

      particle.element.style.left = particle.x + 'px';
      particle.element.style.top = particle.y + 'px';
      const hueShift = (particle.hue + this.quantumState * 50) % 360;
      particle.element.style.background = `
        radial-gradient(circle, 
          hsl(${hueShift}, 100%, 80%) 0%, 
          hsl(${(hueShift + 60) % 360}, 100%, 60%) 30%,
          hsl(${(hueShift + 120) % 360}, 80%, 50%) 60%,
          transparent 100%
        )
      `;
      const lifeOpacity = Math.min(particle.life / particle.maxLife, 1);
      particle.element.style.opacity = lifeOpacity * 0.9;
      particle.element.style.transform = `scale(${0.8 + lifeOpacity * 0.4})`;
    });

    this.energyWaves.forEach((wave, index) => {
      wave.angle += wave.speed * 0.8;
      const radians = (wave.angle * Math.PI) / 180;
      const dynamicDistance = wave.distance + Math.sin(this.quantumState + index) * 10;
      const waveX = this.mouseX + Math.cos(radians) * dynamicDistance;
      const waveY = this.mouseY + Math.sin(radians) * dynamicDistance;

      wave.element.style.left = waveX + 'px';
      wave.element.style.top = waveY - 30 + 'px';
      wave.element.style.transform = `rotate(${wave.angle}deg) scale(${
        0.8 + Math.sin(this.quantumState * 2) * 0.3
      })`;

      const waveOpacity = this.isMouseMoving ? 0.7 : 0.4;
      wave.element.style.opacity = waveOpacity;

      const hue = (index * 60 + this.quantumState * 30) % 360;
      wave.element.style.background = `rgba(0, 255, 255, 0.6)`;
      wave.element.style.borderColor = `hsl(${hue}, 100%, 70%)`;
      wave.element.style.boxShadow = `0 0 8px hsl(${hue}, 100%, 70%)`;
    });

    // Update trail particles
    this.trailParticles.forEach((particle) => {
      if (particle.active) {
        // Smooth interpolation towards target
        particle.targetX += (particle.x - particle.targetX) * 0.1;
        particle.targetY += (particle.y - particle.targetY) * 0.1;

        // Decay life
        particle.life -= 0.02;

        if (particle.life <= 0) {
          particle.active = false;
          particle.element.style.opacity = '0';
        } else {
          const lifeRatio = particle.life / particle.maxLife;
          const opacity = Math.min(lifeRatio * 1.2, 0.9);

          particle.element.style.left = particle.targetX + 'px';
          particle.element.style.top = particle.targetY + 'px';
          particle.element.style.opacity = opacity;

          // Dynamic color shift
          const currentHue = (particle.hue + (1 - lifeRatio) * 60) % 360;
          particle.element.style.background = `
            radial-gradient(circle,
              hsl(${currentHue}, 100%, 70%) 0%,
              hsl(${(currentHue + 30) % 360}, 100%, 60%) 40%,
              transparent 100%
            )
          `;
          particle.element.style.boxShadow = `
            0 0 ${particle.size * 2}px hsl(${currentHue}, 100%, 70%),
            0 0 ${particle.size * 4}px hsl(${(currentHue + 60) % 360}, 80%, 60%, 0.5)
          `;

          // Size based on life (shrink as it fades)
          const currentSize = particle.size * (0.3 + lifeRatio * 0.7);
          particle.element.style.width = currentSize + 'px';
          particle.element.style.height = currentSize + 'px';
        }
      }
    });

    this.quantumState += 0.015;
  }

  animate() {
    this.updatePhysics();
    requestAnimationFrame(() => this.animate());
  }
}
