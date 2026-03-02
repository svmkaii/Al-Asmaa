/**
 * Al-Asmaa — Background Particle System v4.0
 * Canvas-based particles with connection lines, parallax, 3 colors (cyan/gold/violet).
 * Progressively enhanced — falls back to CSS stars if canvas unsupported.
 */
class BackgroundParticles {
  constructor(containerId = 'particleCanvas') {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mouseX = 0.5;
    this.mouseY = 0.5;
    this.rafId = null;
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.containerId = containerId;
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.connectionDistance = 120;
    this.time = 0;
  }

  init() {
    if (this.isReduced) return;

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = this.containerId;
    this.canvas.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      opacity: 0.8;
    `;

    const bgPattern = document.querySelector('.bg-pattern');
    if (bgPattern) {
      bgPattern.appendChild(this.canvas);
    } else {
      document.body.prepend(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    // setTransform au lieu de scale() pour éviter l'accumulation
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  createParticles() {
    const count = Math.min(80, Math.floor((this.width * this.height) / 14000));
    this.particles = [];

    // 5 color palettes for richer depth
    const colors = [
      'rgba(0, 200, 255,',    // cyan
      'rgba(212, 162, 76,',   // gold
      'rgba(160, 120, 255,',  // violet
      'rgba(45, 212, 160,',   // emerald
      'rgba(255, 200, 100,',  // warm gold
    ];

    for (let i = 0; i < count; i++) {
      const colorIdx = i % 5;
      const isLarge = Math.random() < 0.15;
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: isLarge ? (3 + Math.random() * 2.5) : (1 + Math.random() * 2.5),
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.18 - 0.04, // slight upward drift
        opacity: 0.08 + Math.random() * 0.35,
        opacityDir: Math.random() > 0.5 ? 1 : -1,
        parallaxFactor: 0.2 + Math.random() * 0.8,
        color: colors[colorIdx],
        colorIdx: colorIdx,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.001 + Math.random() * 0.004,
        px: 0,
        py: 0
      });
    }
  }

  bindEvents() {
    // Mouse parallax
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX / this.width;
      this.mouseY = e.clientY / this.height;
    }, { passive: true });

    // Gyroscope parallax (mobile)
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null) {
          this.mouseX = 0.5 + (e.gamma / 90) * 0.5;
          this.mouseY = 0.5 + (e.beta / 180) * 0.5;
        }
      }, { passive: true });
    }

    // Resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resize();
        this.createParticles();
      }, 200);
    }, { passive: true });

    // Visibility — pause when hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.animate();
      }
    });
  }

  animate() {
    if (this.rafId) return;

    const loop = () => {
      this.update();
      this.draw();
      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  update() {
    const parallaxX = (this.mouseX - 0.5) * 25;
    const parallaxY = (this.mouseY - 0.5) * 25;
    this.time += 1;

    for (const p of this.particles) {
      // Natural drift with gentle sine wave
      p.x += p.speedX + Math.sin(this.time * 0.003 + p.phase) * 0.08;
      p.y += p.speedY + Math.cos(this.time * 0.002 + p.phase) * 0.06;

      // Parallax offset (applied in draw)
      p.px = parallaxX * p.parallaxFactor;
      p.py = parallaxY * p.parallaxFactor;

      // Smooth sine-based opacity breathing
      p.phase += p.pulseSpeed || 0.002;
      p.opacity = 0.08 + (Math.sin(p.phase) * 0.5 + 0.5) * 0.4;

      // Wrap around
      if (p.x < -20) p.x = this.width + 20;
      if (p.x > this.width + 20) p.x = -20;
      if (p.y < -20) p.y = this.height + 20;
      if (p.y > this.height + 20) p.y = -20;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const particles = this.particles;

    // Draw connection lines between close particles
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      const ax = a.x + a.px;
      const ay = a.y + a.py;

      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const bx = b.x + b.px;
        const by = b.y + b.py;

        const dx = ax - bx;
        const dy = ay - by;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.connectionDistance) {
          const alpha = (1 - dist / this.connectionDistance) * 0.12 * Math.min(a.opacity, b.opacity);
          this.ctx.beginPath();
          this.ctx.moveTo(ax, ay);
          this.ctx.lineTo(bx, by);
          this.ctx.strokeStyle = `${a.color}${alpha})`;
          this.ctx.lineWidth = 0.4;
          this.ctx.stroke();
        }
      }
    }

    // Draw particles with layered glow
    for (const p of particles) {
      const x = p.x + p.px;
      const y = p.y + p.py;

      // Outer soft glow (larger particles only)
      if (p.size > 2) {
        const grad = this.ctx.createRadialGradient(x, y, 0, x, y, p.size * 5);
        grad.addColorStop(0, `${p.color}${p.opacity * 0.15})`);
        grad.addColorStop(1, `${p.color}0)`);
        this.ctx.beginPath();
        this.ctx.arc(x, y, p.size * 5, 0, Math.PI * 2);
        this.ctx.fillStyle = grad;
        this.ctx.fill();
      }

      // Inner halo
      if (p.size > 1.5) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, p.size * 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = `${p.color}${p.opacity * 0.1})`;
        this.ctx.fill();
      }

      // Core particle
      this.ctx.beginPath();
      this.ctx.arc(x, y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.color}${p.opacity})`;
      this.ctx.fill();

      // Bright center dot for larger particles
      if (p.size > 2.5) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, p.size * 0.4, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255,255,255,${p.opacity * 0.4})`;
        this.ctx.fill();
      }
    }
  }

  destroy() {
    this.stop();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// =========================================================================
// RIPPLE MICRO-INTERACTION
// =========================================================================

function initRipple() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn, .config-option, .player-card');
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-wave';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;

    btn.style.position = btn.style.position || 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
  }, { passive: true });
}

// Auto-init when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const bg = new BackgroundParticles();
  bg.init();
  initRipple();
});
