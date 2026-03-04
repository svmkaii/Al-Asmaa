/**
 * Al-Asmaa — Background Atmosphere v7.0
 * Premium flowing color-shifting lueurs — no dots, no particles.
 * Large soft glows that drift, morph and shift hues over time.
 */
class BackgroundAtmosphere {
  constructor(containerId = 'atmosphereCanvas') {
    this.canvas = null;
    this.ctx = null;
    this.orbs = [];
    this.rafId = null;
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.containerId = containerId;
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.time = 0;
  }

  init() {
    if (this.isReduced) return;

    this.canvas = document.createElement('canvas');
    this.canvas.id = this.containerId;
    this.canvas.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      opacity: 1;
    `;

    const bgPattern = document.querySelector('.bg-pattern');
    if (bgPattern) {
      bgPattern.appendChild(this.canvas);
    } else {
      document.body.prepend(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createOrbs();
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
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  // HSL color that shifts over time
  hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  createOrbs() {
    this.orbs = [];

    const hueAnchors = [38, 160, 270, 25, 210, 320];
    const count = Math.max(5, Math.min(8, Math.floor(this.width / 240)));
    const baseSize = Math.min(this.width, this.height);

    for (let i = 0; i < count; i++) {
      this.orbs.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: baseSize * (0.3 + Math.random() * 0.4),
        baseHue: hueAnchors[i % hueAnchors.length],
        hueSpeed: 0.3 + Math.random() * 0.5,       // ~20-30s per full color cycle
        hueRange: 50 + Math.random() * 60,
        saturation: 60 + Math.random() * 25,
        lightness: 45 + Math.random() * 15,
        opacity: 0.03 + Math.random() * 0.03,
        speedX: (Math.random() - 0.5) * 0.8,        // visible drift
        speedY: (Math.random() - 0.5) * 0.6,
        driftAmpX: 0.3 + Math.random() * 0.4,       // sine wander amplitude
        driftAmpY: 0.25 + Math.random() * 0.35,
        driftFreqX: 0.002 + Math.random() * 0.002,
        driftFreqY: 0.0015 + Math.random() * 0.002,
        phase: Math.random() * Math.PI * 2,
        breathSpeed: 0.002 + Math.random() * 0.003,
        breathAmp: 0.3 + Math.random() * 0.35,
        radiusPhase: Math.random() * Math.PI * 2,
        radiusSpeed: 0.001 + Math.random() * 0.002,
        radiusAmp: 0.12 + Math.random() * 0.1,
      });
    }
  }

  bindEvents() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resize();
        this.createOrbs();
      }, 200);
    }, { passive: true });

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
    this.time += 1;
    for (const o of this.orbs) {
      // Drift — base speed + sine wander
      o.x += o.speedX + Math.sin(this.time * o.driftFreqX + o.phase) * o.driftAmpX;
      o.y += o.speedY + Math.cos(this.time * o.driftFreqY + o.phase) * o.driftAmpY;

      // Breathing opacity
      o.phase += o.breathSpeed;
      o.currentOpacity = o.opacity * (1 + Math.sin(o.phase) * o.breathAmp);

      // Radius morphing
      o.radiusPhase += o.radiusSpeed;
      o.currentRadius = o.radius * (1 + Math.sin(o.radiusPhase) * o.radiusAmp);

      // Hue shift — visible color cycling
      o.currentHue = o.baseHue + Math.sin(this.time * 0.005 * o.hueSpeed + o.phase) * o.hueRange;

      // Wrap
      const margin = o.currentRadius * 0.6;
      if (o.x < -margin) o.x = this.width + margin * 0.5;
      if (o.x > this.width + margin) o.x = -margin * 0.5;
      if (o.y < -margin) o.y = this.height + margin * 0.5;
      if (o.y > this.height + margin) o.y = -margin * 0.5;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (const o of this.orbs) {
      const alpha = o.currentOpacity || o.opacity;
      const rad = o.currentRadius || o.radius;
      const hue = o.currentHue || o.baseHue;
      const { r, g, b } = this.hslToRgb(((hue % 360) + 360) % 360, o.saturation, o.lightness);

      const grad = this.ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, rad);
      grad.addColorStop(0,   `rgba(${r},${g},${b},${(alpha * 2).toFixed(4)})`);
      grad.addColorStop(0.3, `rgba(${r},${g},${b},${(alpha * 1.1).toFixed(4)})`);
      grad.addColorStop(0.6, `rgba(${r},${g},${b},${(alpha * 0.35).toFixed(4)})`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);

      this.ctx.beginPath();
      this.ctx.arc(o.x, o.y, rad, 0, Math.PI * 2);
      this.ctx.fillStyle = grad;
      this.ctx.fill();
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
  const bg = new BackgroundAtmosphere();
  bg.init();
  initRipple();
});
