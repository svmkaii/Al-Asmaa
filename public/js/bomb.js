/**
 * Al-Asmaa — Bomb Module v3.0
 * Timer, procedural audio, cinematic explosion, rich confetti
 * Maintains backward-compatible API: Bomb.start(), Bomb.stop(), etc.
 */
const Bomb = (() => {
  // --- Audio ---
  let audioCtx = null;
  let soundEnabled = true;

  // --- Timer ---
  let rafId = null;
  let timerStart = 0;
  let timerDuration = 10;
  let isRunning = false;
  let onExplodeCallback = null;
  let lastTickTime = 0;
  let stoppedRemaining = 0;
  let lastVibrateTime = 0;

  // =========================================================================
  // AUDIO ENGINE
  // =========================================================================

  function initAudio() {
    if (audioCtx) {
      // Résumer si suspendu (requis après un geste utilisateur sur mobile)
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return;
    }
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) {
      console.warn('Web Audio API unavailable');
    }
  }

  function playTick(fast) {
    if (!audioCtx || !soundEnabled) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = fast ? 1200 : 800;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
  }

  function playExplosion() {
    if (!audioCtx || !soundEnabled) return;
    try {
      // White noise burst
      const bufferSize = audioCtx.sampleRate * 0.5;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.08));
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.45, audioCtx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      noise.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noise.start();

      // Sub-bass rumble
      const bass = audioCtx.createOscillator();
      const bassGain = audioCtx.createGain();
      bass.frequency.setValueAtTime(60, audioCtx.currentTime);
      bass.frequency.exponentialRampToValueAtTime(15, audioCtx.currentTime + 0.5);
      bassGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      bass.connect(bassGain);
      bassGain.connect(audioCtx.destination);
      bass.start(audioCtx.currentTime);
      bass.stop(audioCtx.currentTime + 0.6);

      // Mid crack
      const crack = audioCtx.createOscillator();
      const crackGain = audioCtx.createGain();
      crack.frequency.setValueAtTime(400, audioCtx.currentTime);
      crack.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);
      crack.type = 'sawtooth';
      crackGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      crackGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      crack.connect(crackGain);
      crackGain.connect(audioCtx.destination);
      crack.start(audioCtx.currentTime);
      crack.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
  }

  function playCorrect() {
    if (!audioCtx || !soundEnabled) return;
    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const t = audioCtx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch (e) {}
  }

  function playError() {
    if (!audioCtx || !soundEnabled) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 200;
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  }

  // =========================================================================
  // TIMER (uses requestAnimationFrame)
  // =========================================================================

  function startTimer(duration, onExplode) {
    initAudio();
    stopTimer();
    getDomElements(); // Rafraîchir les références DOM

    timerDuration = duration;
    timerStart = performance.now();
    isRunning = true;
    onExplodeCallback = onExplode;
    lastTickTime = 0;

    function tick(now) {
      if (!isRunning) return;

      const elapsed = (now - timerStart) / 1000;
      const remaining = Math.max(0, timerDuration - elapsed);
      const percent = remaining / timerDuration;

      updateTimerDisplay(remaining, percent);

      // Tick sounds
      const tickRate = percent > 0.5 ? 1 : percent > 0.3 ? 0.5 : 0.25;
      if (elapsed - lastTickTime >= tickRate) {
        playTick(percent < 0.3);
        lastTickTime = elapsed;
      }

      // Haptic in danger zone (throttled to every 250ms)
      if (percent < 0.2 && navigator.vibrate && elapsed - (lastVibrateTime || 0) >= 0.25) {
        navigator.vibrate(20);
        lastVibrateTime = elapsed;
      }

      // Explosion
      if (remaining <= 0) {
        isRunning = false;
        rafId = null;
        playExplosion();
        triggerExplosionAnimation();
        if (onExplodeCallback) onExplodeCallback();
        return;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
  }

  function stopTimer() {
    if (isRunning) {
      const elapsed = (performance.now() - timerStart) / 1000;
      stoppedRemaining = Math.max(0, timerDuration - elapsed);
    }
    isRunning = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function getRemaining() {
    if (!isRunning) return stoppedRemaining;
    const elapsed = (performance.now() - timerStart) / 1000;
    return Math.max(0, timerDuration - elapsed);
  }

  // =========================================================================
  // DISPLAY UPDATE (cached DOM selectors for 60fps performance)
  // =========================================================================

  let cachedTimerTexts = null;
  let cachedTimerRings = null;
  let cachedBombSvgs = null;
  let cachedBombWrappers = null;

  function getDomElements() {
    cachedTimerTexts = document.querySelectorAll('[id$="TimerText"]');
    cachedTimerRings = document.querySelectorAll('[id$="TimerRing"]');
    cachedBombSvgs = document.querySelectorAll('.bomb-svg');
    cachedBombWrappers = document.querySelectorAll('.bomb-wrapper');
  }

  function updateTimerDisplay(remaining, percent) {
    if (!cachedTimerTexts || cachedTimerTexts.length === 0) getDomElements();

    // Timer text elements
    cachedTimerTexts.forEach(el => {
      el.textContent = remaining.toFixed(1);
      el.className = 'bomb-timer-text';
      if (percent < 0.1) el.classList.add('danger');
      else if (percent < 0.3) el.classList.add('warning');
    });

    // SVG ring
    const circumference = 628.32;
    const offset = circumference * (1 - percent);
    cachedTimerRings.forEach(el => {
      el.style.strokeDashoffset = offset;
      el.className = 'timer-ring-progress';
      if (percent < 0.1) el.classList.add('danger');
      else if (percent < 0.3) el.classList.add('warning');
    });

    // Bomb SVG visual state
    cachedBombSvgs.forEach(el => {
      el.className = 'bomb-svg';
      if (percent < 0.1) el.classList.add('critical');
      else if (percent < 0.3) el.classList.add('danger');
      else if (percent < 0.5) el.classList.add('warning');
    });

    // Dynamic glow on bomb wrapper
    cachedBombWrappers.forEach(wrapper => {
      if (percent < 0.1) {
        wrapper.style.filter = 'drop-shadow(0 0 20px rgba(255, 23, 68, 0.5))';
      } else if (percent < 0.3) {
        wrapper.style.filter = 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.3))';
      } else {
        wrapper.style.filter = 'none';
      }
    });

    // Strobe for last seconds
    const strobe = document.getElementById('strobeOverlay');
    if (strobe) {
      if (percent < 0.1 && percent > 0) {
        strobe.classList.add('active');
      } else {
        strobe.classList.remove('active');
      }
    }
  }

  // =========================================================================
  // CINEMATIC EXPLOSION ANIMATION
  // =========================================================================

  function triggerExplosionAnimation() {
    const overlay = document.getElementById('explosionOverlay');
    if (!overlay) return;

    overlay.style.display = 'block';
    overlay.innerHTML = '';

    // Kill strobe
    const strobe = document.getElementById('strobeOverlay');
    if (strobe) strobe.classList.remove('active');

    // Screen shake
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
      appContainer.classList.add('screen-shake');
      setTimeout(() => appContainer.classList.remove('screen-shake'), 500);
    }

    // White flash
    const flash = document.createElement('div');
    flash.className = 'explosion-white-flash';
    overlay.appendChild(flash);

    // Fireball
    const fireball = document.createElement('div');
    fireball.className = 'explosion-fireball';
    overlay.appendChild(fireball);

    // Smoke ring
    const smokeRing = document.createElement('div');
    smokeRing.className = 'explosion-smoke-ring';
    overlay.appendChild(smokeRing);

    // Shockwave
    const shockwave = document.createElement('div');
    shockwave.className = 'explosion-shockwave';
    overlay.appendChild(shockwave);

    // 16 shards with varied shapes — cyan + violet added
    const colors = [
      '#ff6b35', '#ffd93d', '#ff1744', '#ff8c42',
      '#00e5ff', '#b388ff', '#f0a030', '#f5c45a',
      '#ff4500', '#ffa500', '#00e5ff', '#b388ff'
    ];
    const clipPaths = [
      'none',
      'none',
      'polygon(50% 0%, 0% 100%, 100% 100%)',
      'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
      'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
    ];

    for (let i = 0; i < 16; i++) {
      const shard = document.createElement('div');
      shard.className = `explosion-shard shard-${i}`;
      const size = 8 + Math.random() * 14;
      shard.style.width = `${size}px`;
      shard.style.height = `${size}px`;
      shard.style.background = colors[i % colors.length];
      shard.style.boxShadow = `0 0 6px ${colors[i % colors.length]}`;

      const shapeIdx = Math.floor(Math.random() * clipPaths.length);
      if (shapeIdx === 0) {
        shard.style.borderRadius = '50%';
      } else if (shapeIdx === 1) {
        shard.style.borderRadius = '2px';
      } else {
        shard.style.clipPath = clipPaths[shapeIdx];
        shard.style.borderRadius = '0';
      }

      overlay.appendChild(shard);
    }

    // 20 embers with random trajectories
    for (let i = 0; i < 20; i++) {
      const ember = document.createElement('div');
      ember.className = 'explosion-ember';
      const angle = (Math.PI * 2 * i) / 20 + (Math.random() - 0.5) * 0.5;
      const distance = 80 + Math.random() * 220;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance - Math.random() * 80;
      const emberColor = colors[Math.floor(Math.random() * colors.length)];

      ember.style.top = '50%';
      ember.style.left = '50%';
      ember.style.background = emberColor;
      ember.style.boxShadow = `0 0 4px ${emberColor}, 0 0 8px ${emberColor}`;
      ember.style.width = `${2 + Math.random() * 4}px`;
      ember.style.height = `${2 + Math.random() * 4}px`;
      ember.style.setProperty('--ember-x', `${x}px`);
      ember.style.setProperty('--ember-y', `${y}px`);
      ember.style.animation = `emberFly ${0.5 + Math.random() * 0.7}s ease-out forwards`;
      ember.style.animationDelay = `${Math.random() * 0.12}s`;

      overlay.appendChild(ember);
    }

    // Cleanup
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.innerHTML = '';
    }, 1800);
  }

  // =========================================================================
  // FEEDBACK & POPUPS
  // =========================================================================

  function showFeedback(type) {
    const flash = document.getElementById('feedbackFlash');
    if (!flash) return;

    flash.className = 'feedback-flash';
    void flash.offsetWidth; // force reflow
    flash.classList.add(type);

    if (type === 'correct') playCorrect();
    if (type === 'invalid') playError();
  }

  function showNamePopup(name) {
    const popup = document.getElementById('namePopup');
    if (!popup) return;

    const arabic = document.getElementById('namePopupArabic');
    const translit = document.getElementById('namePopupTranslit');
    const meaning = document.getElementById('namePopupMeaning');

    if (arabic) arabic.textContent = name.arabic;
    if (translit) translit.textContent = name.transliteration;
    if (meaning) meaning.textContent = name.french;

    popup.classList.remove('hidden', 'hiding');
    popup.style.animation = 'none';
    void popup.offsetWidth;
    popup.style.animation = '';

    setTimeout(() => {
      popup.classList.add('hiding');
      setTimeout(() => {
        popup.classList.add('hidden');
        popup.classList.remove('hiding');
      }, 350);
    }, 2200);
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
      info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
      correct: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML =
      '<span class="toast-icon">' + (icons[type] || icons.info) + '</span>' +
      '<span class="toast-msg">' + message + '</span>' +
      '<div class="toast-progress"></div>';
    container.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  // =========================================================================
  // CONFETTI
  // =========================================================================

  function showConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;

    const colors = [
      '#f0a030', '#f5c45a', '#00e5ff', '#40efff',
      '#00e676', '#ff1744', '#b388ff', '#d1b3ff',
      '#f59e0b', '#ff6b35', '#ffd93d', '#69f0ae'
    ];
    const shapes = ['confetti-square', 'confetti-rect', 'confetti-circle', 'confetti-star', 'confetti-diamond'];
    const falls = ['confetti-fall-1', 'confetti-fall-2', 'confetti-fall-3', 'confetti-fall-4', 'confetti-fall-5', 'confetti-fall-6'];

    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('div');
      piece.className = `confetti ${shapes[Math.floor(Math.random() * shapes.length)]} ${falls[Math.floor(Math.random() * falls.length)]}`;
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 2.5}s`;
      piece.style.animationDuration = `${2.5 + Math.random() * 2.5}s`;
      piece.style.opacity = 0.7 + Math.random() * 0.3;
      container.appendChild(piece);
    }

    setTimeout(() => {
      container.innerHTML = '';
    }, 6000);
  }

  // =========================================================================
  // RESET
  // =========================================================================

  function resetDisplay() {
    const timerTexts = document.querySelectorAll('[id$="TimerText"]');
    timerTexts.forEach(el => {
      el.textContent = '--';
      el.className = 'bomb-timer-text';
    });

    const timerRings = document.querySelectorAll('[id$="TimerRing"]');
    timerRings.forEach(el => {
      el.style.strokeDashoffset = '0';
      el.className = 'timer-ring-progress';
    });

    const bombSvgs = document.querySelectorAll('.bomb-svg');
    bombSvgs.forEach(el => {
      el.className = 'bomb-svg';
    });

    const bombWrappers = document.querySelectorAll('.bomb-wrapper');
    bombWrappers.forEach(w => w.style.filter = 'none');

    const strobe = document.getElementById('strobeOverlay');
    if (strobe) strobe.classList.remove('active');
  }

  // =========================================================================
  // PUBLIC API (backward compatible)
  // =========================================================================
  return {
    start: startTimer,
    stop: stopTimer,
    getRemaining,
    resetDisplay,
    showFeedback,
    showNamePopup,
    showToast,
    showConfetti,
    triggerExplosionAnimation,
    playCorrect,
    playError,
    playExplosion,
    initAudio,
    setSound(enabled) { soundEnabled = enabled; },
    get isRunning() { return isRunning; }
  };
})();
