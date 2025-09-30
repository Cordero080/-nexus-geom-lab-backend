// QUANTUM CONSTELLATION CURSOR UNIVERSE ENGINE
export default class QuantumCursorUniverse {
  constructor() {
    this.cursor = document.getElementById("cursor");
    this.gravityField = document.getElementById("gravity-field");
    this.wormhole = document.getElementById("wormhole");
    this.dimensionalRift = document.getElementById("dimensional-rift");

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetX = 0;
    this.targetY = 0;

    this.particles = [];
    this.energyWaves = [];
    this.maxParticles = 50;
    this.maxEnergyWaves = 6; // Hexagon formation

    this.isMouseMoving = false;
    this.moveTimeout = null;
    this.quantumState = 0;
    this.wormholeActive = false;
    this.dimensionalTear = false;

    this.init();
  }

  init() {
    document.body.style.cursor = "none";
    this.createParticleSystem();
    this.createEnergyWaves();

    document.addEventListener("mousemove", (e) => this.updateMousePosition(e));
    document.addEventListener("click", () => this.createWormhole());
    document.addEventListener("mousedown", () => this.createDimensionalRift());
    document.addEventListener("mouseup", () => this.closeDimensionalRift());

    this.animate();
  }

  updateMousePosition(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.isMouseMoving = true;
    this.cursor.style.opacity = "1";
    clearTimeout(this.moveTimeout);
    this.moveTimeout = setTimeout(() => {
      this.isMouseMoving = false;
    }, 100);
    this.createQuantumParticles();
  }

  createParticleSystem() {
    for (let i = 0; i < this.maxParticles; i++) {
      const particle = document.createElement("div");
      particle.className = "quantum-particle";
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
      const wave = document.createElement("div");
      wave.className = "energy-wave";
      document.body.appendChild(wave);

      this.energyWaves.push({
        element: wave,
        angle: (360 / this.maxEnergyWaves) * i,
        distance: 50,
        speed: Math.random() * 1.5 + 0.8,
      });
    }
  }

  createQuantumParticles() {
    const particle =
      this.particles[Math.floor(Math.random() * this.particles.length)];
    if (particle) {
      particle.x = this.mouseX + (Math.random() - 0.5) * 100;
      particle.y = this.mouseY + (Math.random() - 0.5) * 100;
      particle.vx = (Math.random() - 0.5) * 8;
      particle.vy = (Math.random() - 0.5) * 8;
      particle.life = particle.maxLife;
      particle.hue = Math.random() * 360;
    }
  }

  createWormhole() {
    this.wormholeActive = true;
    this.wormhole.style.opacity = "1";
    this.wormhole.style.left = this.mouseX - 75 + "px";
    this.wormhole.style.top = this.mouseY - 75 + "px";

    // Trigger ripple animation
    this.wormhole.classList.remove("ripple");
    void this.wormhole.offsetWidth;
    this.wormhole.classList.add("ripple");

    // Suck in nearby particles
    this.particles.forEach((particle) => {
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        particle.vx += dx * 0.1;
        particle.vy += dy * 0.1;
      }
    });

    setTimeout(() => {
      this.wormholeActive = false;
      this.wormhole.style.opacity = "0";
      this.wormhole.classList.remove("ripple");
    }, 700);
  }

  createDimensionalRift() {
    this.dimensionalTear = true;
    this.dimensionalRift.style.opacity = "1";
    this.dimensionalRift.style.left = this.mouseX - 150 + "px";
    this.dimensionalRift.style.top = this.mouseY + "px";
    this.dimensionalRift.style.transform = `rotate(${Math.random() * 360}deg)`;
  }

  closeDimensionalRift() {
    this.dimensionalTear = false;
    this.dimensionalRift.style.opacity = "0";
  }

  updatePhysics() {
    this.targetX += (this.mouseX - this.targetX) * 0.15;
    this.targetY += (this.mouseY - this.targetY) * 0.15;
    this.cursor.style.left = this.targetX - 10 + "px";
    this.cursor.style.top = this.targetY - 10 + "px";
    this.gravityField.style.left = this.mouseX - 90 + "px";
    this.gravityField.style.top = this.mouseY - 90 + "px";

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

      particle.element.style.left = particle.x + "px";
      particle.element.style.top = particle.y + "px";
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
      const dynamicDistance =
        wave.distance + Math.sin(this.quantumState + index) * 10;
      const waveX = this.mouseX + Math.cos(radians) * dynamicDistance;
      const waveY = this.mouseY + Math.sin(radians) * dynamicDistance;

      wave.element.style.left = waveX + "px";
      wave.element.style.top = waveY - 30 + "px";
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

    this.quantumState += 0.015;
  }

  animate() {
    this.updatePhysics();
    requestAnimationFrame(() => this.animate());
  }
}
