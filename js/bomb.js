/**
 * Al-Asmaa — Bomb Mechanics
 * Timer, sounds (Web Audio API), animations
 */

const Bomb = (() => {
  let audioCtx = null;
  let tickInterval = null;
  let timerInterval = null;
  let currentTime = 0;
  let totalTime = 0;
  let isRunning = false;
  let onExplode = null;
  let onTick = null;
  let tickRate = 1000;
  let vibrationSupported = 'vibrate' in navigator;

  // --- Web Audio API Sound Generation ---

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTick(fast) {
    if (!App.getSettings().sound) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fast ? 1200 : 800, ctx.currentTime);
      gain.gain.setValueAtTime(fast ? 0.15 : 0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) { /* ignore audio errors */ }
  }

  function playExplosion() {
    if (!App.getSettings().sound) return;
    if (App.getSettings().silentMode) return;
    try {
      const ctx = getAudioContext();
      const duration = 0.8;

      // Noise buffer for explosion
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Low-pass filter for rumble
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + duration);

      // Sub-bass impact
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(60, ctx.currentTime);
      sub.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.4);
      subGain.gain.setValueAtTime(0.4, ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(ctx.currentTime);
      sub.stop(ctx.currentTime + 0.4);
    } catch (e) { /* ignore audio errors */ }
  }

  function playVictory() {
    if (!App.getSettings().sound) return;
    try {
      const ctx = getAudioContext();
      // Simple ascending melody
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.2);
        osc.stop(ctx.currentTime + i * 0.2 + 0.4);
      });
    } catch (e) { /* ignore audio errors */ }
  }

  function playCorrect() {
    if (!App.getSettings().sound) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.setValueAtTime(800, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) { /* ignore audio errors */ }
  }

  function playWrong() {
    if (!App.getSettings().sound) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) { /* ignore audio errors */ }
  }

  // --- Timer Mechanics ---

  function start(minSeconds, maxSeconds, explodeCallback, tickCallback) {
    stop();
    totalTime = minSeconds + Math.random() * (maxSeconds - minSeconds);
    currentTime = totalTime;
    isRunning = true;
    onExplode = explodeCallback;
    onTick = tickCallback;

    updateDisplay();
    startTicking();

    timerInterval = setInterval(() => {
      currentTime -= 0.1;
      if (currentTime <= 0) {
        currentTime = 0;
        explode();
        return;
      }
      updateDisplay();

      // Adjust tick speed based on remaining time
      const ratio = currentTime / totalTime;
      if (ratio < 0.15) {
        setTickRate(150);
      } else if (ratio < 0.25) {
        setTickRate(300);
      } else if (ratio < 0.5) {
        setTickRate(600);
      }
    }, 100);
  }

  function stop() {
    isRunning = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (tickInterval) {
      clearInterval(tickInterval);
      tickInterval = null;
    }
  }

  function pause() {
    if (!isRunning) return;
    isRunning = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (tickInterval) {
      clearInterval(tickInterval);
      tickInterval = null;
    }
  }

  function resume() {
    if (isRunning || currentTime <= 0) return;
    isRunning = true;
    startTicking();
    timerInterval = setInterval(() => {
      currentTime -= 0.1;
      if (currentTime <= 0) {
        currentTime = 0;
        explode();
        return;
      }
      updateDisplay();
      const ratio = currentTime / totalTime;
      if (ratio < 0.15) setTickRate(150);
      else if (ratio < 0.25) setTickRate(300);
      else if (ratio < 0.5) setTickRate(600);
    }, 100);
  }

  function startTicking() {
    tickRate = 1000;
    if (tickInterval) clearInterval(tickInterval);
    tickInterval = setInterval(() => {
      const ratio = currentTime / totalTime;
      playTick(ratio < 0.25);
    }, tickRate);
  }

  function setTickRate(newRate) {
    if (Math.abs(tickRate - newRate) < 50) return;
    tickRate = newRate;
    if (tickInterval) clearInterval(tickInterval);
    tickInterval = setInterval(() => {
      const ratio = currentTime / totalTime;
      playTick(ratio < 0.25);
    }, tickRate);
  }

  function explode() {
    stop();
    playExplosion();
    if (vibrationSupported && App.getSettings().sound) {
      navigator.vibrate([200, 100, 200]);
    }
    if (onExplode) onExplode();
  }

  function updateDisplay() {
    const ratio = currentTime / totalTime;
    const bombContainer = document.querySelector('.bomb-container');
    const fuseBarFill = document.querySelector('.fuse-bar-fill');
    const timerText = document.querySelector('.timer-text');

    if (fuseBarFill) {
      fuseBarFill.style.width = (ratio * 100) + '%';
      fuseBarFill.className = 'fuse-bar-fill';
      if (ratio > 0.5) fuseBarFill.classList.add('safe');
      else if (ratio > 0.25) fuseBarFill.classList.add('warning');
      else fuseBarFill.classList.add('danger');
    }

    if (timerText) {
      timerText.textContent = Math.ceil(currentTime) + 's';
      timerText.className = 'timer-text';
      if (ratio > 0.5) timerText.classList.add('safe');
      else if (ratio > 0.25) timerText.classList.add('warning');
      else timerText.classList.add('danger');
    }

    if (bombContainer) {
      bombContainer.classList.remove('warning', 'danger');
      if (ratio <= 0.25) bombContainer.classList.add('danger');
      else if (ratio <= 0.5) bombContainer.classList.add('warning');
    }

    // Vibrate in danger zone
    if (ratio < 0.2 && vibrationSupported && App.getSettings().sound && isRunning) {
      navigator.vibrate(30);
    }

    if (onTick) onTick(currentTime, totalTime);
  }

  // --- Explosion Particles ---

  function createExplosionParticles(centerX, centerY) {
    if (App.getSettings().silentMode) {
      // Silent mode: subtle flash only
      const flash = document.createElement('div');
      flash.className = 'silent-flash';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 500);
      return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'explosion-overlay active';
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 300);

    // Fire particles
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle fire';
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 200;
      const duration = 0.5 + Math.random() * 0.8;
      p.style.left = centerX + 'px';
      p.style.top = centerY + 'px';
      p.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
      p.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
      p.style.setProperty('--duration', duration + 's');
      p.style.width = (4 + Math.random() * 8) + 'px';
      p.style.height = p.style.width;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), duration * 1000);
    }

    // Smoke particles
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      p.className = 'particle smoke';
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 120;
      const duration = 0.8 + Math.random() * 1;
      p.style.left = centerX + 'px';
      p.style.top = centerY + 'px';
      p.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
      p.style.setProperty('--ty', Math.sin(angle) * distance - 50 + 'px');
      p.style.setProperty('--duration', duration + 's');
      document.body.appendChild(p);
      setTimeout(() => p.remove(), duration * 1000);
    }

    // Embers
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle ember';
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 250;
      const duration = 0.8 + Math.random() * 1.5;
      p.style.left = centerX + 'px';
      p.style.top = centerY + 'px';
      p.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
      p.style.setProperty('--ty', Math.sin(angle) * distance - 80 + 'px');
      p.style.setProperty('--duration', duration + 's');
      document.body.appendChild(p);
      setTimeout(() => p.remove(), duration * 1000);
    }
  }

  // --- Victory animation ---

  function createVictoryAnimation() {
    playVictory();

    const overlay = document.createElement('div');
    overlay.className = 'victory-overlay';
    overlay.innerHTML = `
      <div class="victory-text">ماشاء الله</div>
      <div class="victory-subtitle">${UI.t('allNamesCompleted')}</div>
      <button class="btn btn-primary mt-24" onclick="this.parentElement.classList.remove('active');this.parentElement.remove();" style="width:auto;padding:12px 40px;">OK</button>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));

    // Star particles
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        const star = document.createElement('div');
        star.className = 'victory-star';
        star.textContent = ['✨', '⭐', '🌟'][Math.floor(Math.random() * 3)];
        const x = Math.random() * window.innerWidth;
        const duration = 1 + Math.random() * 2;
        star.style.left = x + 'px';
        star.style.top = (window.innerHeight * 0.3 + Math.random() * window.innerHeight * 0.4) + 'px';
        star.style.setProperty('--tx', (Math.random() * 100 - 50) + 'px');
        star.style.setProperty('--ty', -(50 + Math.random() * 150) + 'px');
        star.style.setProperty('--duration', duration + 's');
        document.body.appendChild(star);
        setTimeout(() => star.remove(), duration * 1000);
      }, i * 100);
    }
  }

  // --- Bomb SVG HTML ---

  function getBombHTML() {
    return `
      <div class="bomb-container">
        <svg class="bomb-svg" viewBox="0 0 120 120">
          <!-- Bomb body -->
          <circle cx="60" cy="70" r="40" class="bomb-body"/>
          <!-- Highlight -->
          <ellipse cx="48" cy="55" rx="12" ry="8" class="bomb-highlight" transform="rotate(-20 48 55)"/>
          <!-- Fuse base -->
          <rect x="52" y="28" width="16" height="8" rx="3" fill="#555"/>
          <!-- Fuse line -->
          <path d="M60 28 Q65 15 58 8 Q50 0 60 -5" class="bomb-fuse-line"/>
          <!-- Fuse spark position marker -->
          <circle cx="60" cy="-5" r="0" class="fuse-tip"/>
        </svg>
        <div class="fuse-spark" style="top:22%;left:50%;"></div>
      </div>
      <div class="fuse-bar">
        <div class="fuse-bar-fill safe" style="width:100%"></div>
      </div>
      <div class="timer-text safe"></div>
    `;
  }

  // --- Public API ---
  return {
    start,
    stop,
    pause,
    resume,
    playCorrect,
    playWrong,
    playVictory,
    playExplosion,
    createExplosionParticles,
    createVictoryAnimation,
    getBombHTML,
    getAudioContext,
    get isRunning() { return isRunning; },
    get currentTime() { return currentTime; },
    get totalTime() { return totalTime; }
  };
})();
