/**
 * Al-Asmaa — Mini-Games Module
 * Falling Names, Memory, Mots Mêlés (Word Search)
 */
const MiniGames = (() => {
  'use strict';

  const STORAGE_KEY = 'al-asmaa-minigames';
  let names = [];

  // ============================================================================
  // SHARED UTILITIES
  // ============================================================================

  function loadScores() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }

  function saveScores(s) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
  }

  function escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const audioCtx = typeof AudioContext !== 'undefined' ? new AudioContext() : null;
  let mgSoundEnabled = true;

  const SOUND_BTN_HTML = '<span class="mg-sound-icon mg-sound-on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg></span><span class="mg-sound-icon mg-sound-off"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg></span>';

  function playSound(type) {
    if (!audioCtx || !mgSoundEnabled) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.setValueAtTime(659, now + 0.08);
      osc.frequency.setValueAtTime(784, now + 0.16);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now); osc.stop(now + 0.35);
    } else if (type === 'wrong') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.setValueAtTime(150, now + 0.15);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'gameover') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.6);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.start(now); osc.stop(now + 0.7);
    } else if (type === 'flip') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'match') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(660, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now); osc.stop(now + 0.25);
    } else if (type === 'win') {
      osc.type = 'sine';
      [523, 659, 784, 1047].forEach((f, i) => {
        osc.frequency.setValueAtTime(f, now + i * 0.12);
      });
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now); osc.stop(now + 0.6);
    }
  }

  function heartSVG() {
    return '<svg class="mg-heart" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m${s < 10 ? '0' : ''}${s}s` : `${s}s`;
  }

  function updateBest(gameId, value, lower) {
    const scores = loadScores();
    if (scores[gameId] == null || (lower ? value < scores[gameId] : value > scores[gameId])) {
      scores[gameId] = value;
      saveScores(scores);
      return true;
    }
    return false;
  }

  // ============================================================================
  // HUB
  // ============================================================================

  const hubEl = () => document.getElementById('miniGamesHub');
  const activeEl = () => document.getElementById('miniGamesActive');

  const GAMES = [
    {
      id: 'falling',
      title: 'Noms Tombants',
      desc: 'Tape la translitération avant que les noms ne touchent le sol',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v8"/><path d="m8 6 4 4 4-4"/><path d="M12 18v4"/><circle cx="12" cy="18" r="2"/><path d="M4 22h16"/></svg>',
      scoreKey: 'falling', scoreLabel: 'score',
      launch: showFallingDifficulty
    },
    {
      id: 'memory',
      title: 'Memory',
      desc: 'Retrouve les paires arabe / français en retournant les cartes',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="8" height="8" rx="1.5"/><rect x="14" y="4" width="8" height="8" rx="1.5"/><rect x="2" y="14" width="8" height="8" rx="1.5" opacity=".4"/><rect x="14" y="14" width="8" height="8" rx="1.5" opacity=".4"/></svg>',
      scoreKey: 'memory_easy', scoreLabel: 'coups', scoreLower: true,
      launch: () => showMemoryDifficulty()
    },
    {
      id: 'wordsearch',
      title: 'Mots Mêlés',
      desc: 'Trouve les noms cachés dans la grille grâce aux indices',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>',
      scoreKey: 'wordsearch', scoreLabel: 'temps', scoreLower: true,
      launch: initWordSearch
    }
  ];

  const PLAY_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>';

  function renderHub() {
    if (names.length === 0) names = typeof ASMA_UL_HUSNA !== 'undefined' ? ASMA_UL_HUSNA : [];
    const scores = loadScores();
    const hub = hubEl();
    const active = activeEl();
    hub.classList.remove('hidden');
    active.classList.add('hidden');
    active.innerHTML = '';

    let html = `
      <div class="mg-topbar-hero">
        <div class="mg-topbar-ornament-tl"></div>
        <div class="mg-topbar-ornament-br"></div>
        <div class="mg-topbar">
          <button class="btn-back mg-quit-btn" id="btnMiniGamesBack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div class="mg-topbar-center">
            <span class="mg-topbar-title">Mini-jeux</span>
            <span class="mg-topbar-subtitle">Apprends en t'amusant</span>
          </div>
          <div class="mg-topbar-badge">3 jeux</div>
        </div>
        <div class="mg-topbar-hero-body">
          <div class="mg-topbar-hero-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4M8 10v4"/><circle cx="17" cy="11" r="1"/><circle cx="15" cy="13" r="1"/></svg>
          </div>
          <h2 class="mg-topbar-hero-title">3 mini-jeux pour mémoriser les 99 Noms d'Allah</h2>
          <div class="mg-topbar-hero-sep"></div>
          <p class="mg-topbar-hero-sub">Challenge-toi et révise de façon ludique.</p>
        </div>
      </div>
      <div class="mg-hub">`;

    GAMES.forEach(g => {
      let best;
      if (g.id === 'falling') {
        // Best across all falling difficulties
        best = Math.max(scores.falling_slow || 0, scores.falling_normal || 0, scores.falling_fast || 0) || null;
        if (best === 0) best = null;
      } else {
        best = scores[g.scoreKey];
      }
      const bestStr = best != null
        ? (g.id === 'wordsearch' ? formatTime(best) : best)
        : null;
      html += `
        <div class="mg-hub-card" data-game="${g.id}">
          <div class="mg-hub-banner">
            <div class="mg-hub-ico">${g.icon}</div>
          </div>
          <div class="mg-hub-body">
            <div class="mg-hub-title">${escHtml(g.title)}</div>
            <div class="mg-hub-desc">${escHtml(g.desc)}</div>
            ${bestStr != null ? '<div class="mg-hub-best">Record : ' + bestStr + '</div>' : ''}
            <button class="mg-hub-play">Jouer ${PLAY_SVG}</button>
          </div>
        </div>`;
    });
    html += '</div>';
    hub.innerHTML = html;

    hub.querySelectorAll('.mg-hub-card').forEach(card => {
      card.addEventListener('click', () => {
        const game = GAMES.find(g => g.id === card.dataset.game);
        if (game) game.launch();
      });
    });
  }

  function backToHub() {
    if (fallingState.raf) { cancelAnimationFrame(fallingState.raf); fallingState.raf = null; }
    if (memoryState.timer) { clearInterval(memoryState.timer); memoryState.timer = null; }
    if (wsState.timer) { clearInterval(wsState.timer); wsState.timer = null; }
    renderHub();
  }

  function switchToGame(html) {
    hubEl().classList.add('hidden');
    const active = activeEl();
    active.classList.remove('hidden');
    active.innerHTML = '<div class="mg-top-controls"><button class="btn-back mg-game-back mg-quit-btn" id="btnMiniGamesBack"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button><button class="mg-sound-toggle' + (mgSoundEnabled ? '' : ' muted') + '" id="mgSoundToggle" title="Activer/Désactiver les sons">' + SOUND_BTN_HTML + '</button></div>' + html;
    // Attach sound toggle handler directly
    const soundBtn = document.getElementById('mgSoundToggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mgSoundEnabled = !mgSoundEnabled;
        soundBtn.classList.toggle('muted', !mgSoundEnabled);
      });
    }
  }

  function buildEndHTML(opts) {
    return `
      <div class="mg-end-overlay">
        <div class="mg-end-card">
          <div class="mg-end-glow"></div>
          <div class="mg-end-title">${opts.title}</div>
          ${opts.stars ? `<div class="mg-end-stars">${[1,2,3].map(i => `<span class="mg-end-star ${i <= opts.stars ? 'active' : ''}">\u2726</span>`).join('')}</div>` : ''}
          <div class="mg-end-score">${opts.score}</div>
          <div class="mg-end-detail">${opts.detail}</div>
          <div class="mg-end-best">${opts.bestText}</div>
          <div class="mg-end-actions">
            <button class="mg-btn-primary" id="${opts.replayId}">Rejouer</button>
            <button class="mg-btn-ghost mg-btn-quit" id="${opts.backId}">Retour</button>
          </div>
        </div>
      </div>`;
  }

  // ============================================================================
  // FALLING NAMES
  // ============================================================================

  const fallingState = {
    raf: null, score: 0, lives: 3, level: 1,
    fallingNames: [], spawnTimer: 0, lastTime: 0,
    usedIds: [], paused: false, difficulty: 'normal'
  };

  // Difficulty SVG icons (stroke-based, matching app style)
  const DIFF_ICONS = {
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89-.82C8 16 10 13 17 8z"/><path d="M3 21c5-6 7-8 14-13"/></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c1 5 6 8 6 13a6 6 0 1 1-12 0c0-5 5-8 6-13z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></svg>'
  };

  const FALLING_CONFIGS = {
    slow:   { label: 'Tranquille', desc: 'Vitesse douce pour bien apprendre', ico: DIFF_ICONS.leaf,  speedBase: 25, speedPerLevel: 5, spawnBase: 4.5, spawnStep: 0.2 },
    normal: { label: 'Normal',     desc: 'Rythme \u00e9quilibr\u00e9 pour progresser',   ico: DIFF_ICONS.flame, speedBase: 40, speedPerLevel: 8, spawnBase: 3.5, spawnStep: 0.3 },
    fast:   { label: 'Intense',    desc: 'Pour les plus rapides au clavier', ico: DIFF_ICONS.bolt,  speedBase: 58, speedPerLevel: 10, spawnBase: 2.8, spawnStep: 0.35 }
  };

  function showFallingDifficulty() {
    switchToGame(`
      <div class="mg-diff-screen">
        <div class="mg-diff-title">Noms Tombants</div>
        <div class="mg-diff-sub">Choisis ta vitesse de d\u00e9part</div>
        <div class="mg-diff-grid">
          ${Object.entries(FALLING_CONFIGS).map(([key, cfg]) => `
            <button class="mg-diff-btn" data-diff="${key}">
              <span class="mg-diff-ico">${cfg.ico}</span>${cfg.label}<span class="mg-diff-label">${cfg.desc}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `);
    activeEl().querySelectorAll('.mg-diff-btn').forEach(btn => {
      btn.addEventListener('click', () => initFalling(btn.dataset.diff));
    });
  }

  function initFalling(difficulty) {
    difficulty = difficulty || 'normal';
    Object.assign(fallingState, {
      score: 0, lives: 3, level: 1, fallingNames: [],
      spawnTimer: 0, lastTime: 0, usedIds: [], paused: false,
      difficulty
    });
    if (fallingState.raf) cancelAnimationFrame(fallingState.raf);

    switchToGame(`
      <div class="mg-game-header">
        <div class="mg-stat">
          <span class="mg-stat-label">Score</span>
          <span class="mg-stat-value" id="mgFallingScore">0</span>
        </div>
        <div class="mg-level-badge" id="mgFallingLevel">Niv. 1</div>
        <div class="mg-lives" id="mgFallingLives">
          ${heartSVG()}${heartSVG()}${heartSVG()}
        </div>
      </div>
      <div class="mg-falling-zone" id="mgFallingZone"></div>
      <div class="mg-falling-input-zone">
        <input class="mg-falling-input" id="mgFallingInput" type="text"
               placeholder="Tape la translitération..." autocomplete="off" autocapitalize="off" spellcheck="false">
      </div>
    `);

    const input = document.getElementById('mgFallingInput');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        tryFallingAnswer(input.value.trim());
        input.value = '';
      }
    });
    input.addEventListener('input', () => {
      const val = input.value.trim();
      if (val.length >= 3) {
        const result = checkFallingInputAuto(val);
        if (result) {
          input.classList.add('correct');
          setTimeout(() => input.classList.remove('correct'), 300);
          catchFallingName(result);
          input.value = '';
        }
      }
    });
    input.focus();

    fallingState.lastTime = performance.now();
    fallingState.raf = requestAnimationFrame(fallingLoop);
  }

  function fallingLoop(timestamp) {
    if (fallingState.paused) return;
    const dt = (timestamp - fallingState.lastTime) / 1000;
    fallingState.lastTime = timestamp;

    const cfg = FALLING_CONFIGS[fallingState.difficulty] || FALLING_CONFIGS.normal;
    const baseSpeed = cfg.speedBase + fallingState.level * cfg.speedPerLevel;
    const spawnInterval = Math.max(1.0, cfg.spawnBase - fallingState.level * cfg.spawnStep);
    const maxSimultaneous = Math.min(1 + Math.floor(fallingState.level / 3), 4);

    fallingState.spawnTimer += dt;
    if (fallingState.spawnTimer >= spawnInterval && fallingState.fallingNames.length < maxSimultaneous) {
      fallingState.spawnTimer = 0;
      spawnFallingName();
    }

    const zone = document.getElementById('mgFallingZone');
    if (!zone) return;
    const zoneH = zone.offsetHeight;
    const dangerY = zoneH * 0.7;

    fallingState.fallingNames.forEach(fn => {
      fn.y += baseSpeed * dt;
      if (fn.el) {
        fn.el.style.top = fn.y + 'px';
        // Add danger class near bottom
        fn.el.classList.toggle('danger', !fn.gone && fn.y > dangerY && fn.y < zoneH - 44);
      }
      if (!fn.gone && fn.y >= zoneH - 44) {
        fn.gone = true;
        fn.el.classList.remove('danger');
        fn.el.classList.add('missed');
        fallingState.lives--;
        playSound('wrong');
        // Red glow + shake on zone
        zone.classList.add('hit');
        setTimeout(() => zone.classList.remove('hit'), 500);
        updateFallingUI();
        setTimeout(() => { if (fn.el && fn.el.parentNode) fn.el.parentNode.removeChild(fn.el); }, 350);
      }
    });

    fallingState.fallingNames = fallingState.fallingNames.filter(fn => !fn.gone);

    if (fallingState.lives <= 0) {
      endFalling();
      return;
    }

    fallingState.raf = requestAnimationFrame(fallingLoop);
  }

  function spawnFallingName() {
    const zone = document.getElementById('mgFallingZone');
    if (!zone) return;
    const onScreenIds = fallingState.fallingNames.map(fn => fn.name.id);
    const available = names.filter(n => !onScreenIds.includes(n.id));
    if (available.length === 0) return;
    const name = available[Math.floor(Math.random() * available.length)];

    const el = document.createElement('div');
    el.className = 'mg-falling-name';
    el.textContent = name.arabic;
    const maxLeft = Math.max(0, zone.offsetWidth - 160);
    el.style.left = Math.floor(Math.random() * maxLeft) + 'px';
    el.style.top = '-50px';
    zone.appendChild(el);

    fallingState.fallingNames.push({ name, el, y: -50, gone: false });
  }

  // Strip non-alpha for length comparison
  function alphaOnly(s) { return s.toLowerCase().replace(/[^a-z]/g, ''); }

  // Strict check for auto-validation (on input): requires near-complete input
  function checkFallingInputAuto(input) {
    const normInput = alphaOnly(input);
    for (const fn of fallingState.fallingNames) {
      if (fn.gone) continue;
      const normTarget = alphaOnly(fn.name.transliteration);
      // Input must be at least target length - 1 (accounts for variant spellings)
      if (normInput.length < normTarget.length - 1) continue;
      const result = Validator.validate(input, [], [fn.name]);
      if (result.valid) return fn;
    }
    return null;
  }

  // Loose check for Enter key: uses Validator directly (fuzzy ok)
  function checkFallingInputLoose(input) {
    for (const fn of fallingState.fallingNames) {
      if (fn.gone) continue;
      const result = Validator.validate(input, [], [fn.name]);
      if (result.valid) return fn;
    }
    return null;
  }

  function tryFallingAnswer(input) {
    if (!input) return;
    const fn = checkFallingInputLoose(input);
    if (fn) catchFallingName(fn);
  }

  function catchFallingName(fn) {
    fn.gone = true;
    fn.el.classList.remove('danger');
    fn.el.classList.add('caught');
    fallingState.score++;
    fallingState.usedIds.push(fn.name.id);
    playSound('correct');

    // Floating +1 score popup
    const zone = document.getElementById('mgFallingZone');
    if (zone) {
      const pop = document.createElement('div');
      pop.className = 'mg-score-pop';
      pop.textContent = '+1';
      pop.style.left = fn.el.style.left;
      pop.style.top = (fn.y - 10) + 'px';
      zone.appendChild(pop);
      setTimeout(() => { if (pop.parentNode) pop.parentNode.removeChild(pop); }, 700);
    }

    const newLevel = Math.floor(fallingState.score / 5) + 1;
    if (newLevel > fallingState.level) fallingState.level = newLevel;

    updateFallingUI();
    setTimeout(() => { if (fn.el && fn.el.parentNode) fn.el.parentNode.removeChild(fn.el); }, 450);
  }

  function updateFallingUI() {
    const scoreEl = document.getElementById('mgFallingScore');
    if (scoreEl) scoreEl.textContent = fallingState.score;
    const levelEl = document.getElementById('mgFallingLevel');
    if (levelEl) levelEl.textContent = 'Niv. ' + fallingState.level;
    const livesEl = document.getElementById('mgFallingLives');
    if (livesEl) {
      livesEl.querySelectorAll('.mg-heart').forEach((h, i) => {
        h.classList.toggle('lost', i >= fallingState.lives);
      });
    }
  }

  function endFalling() {
    fallingState.paused = true;
    if (fallingState.raf) { cancelAnimationFrame(fallingState.raf); fallingState.raf = null; }
    playSound('gameover');

    const scoreKey = 'falling_' + fallingState.difficulty;
    const isNew = updateBest(scoreKey, fallingState.score, false);
    const best = loadScores()[scoreKey] || 0;

    const zone = document.getElementById('mgFallingZone');
    if (!zone) return;
    zone.innerHTML = buildEndHTML({
      title: 'Partie termin\u00e9e',
      score: fallingState.score,
      detail: 'noms attrap\u00e9s',
      bestText: isNew ? 'Nouveau record !' : 'Meilleur : ' + best,
      replayId: 'mgFallingReplay',
      backId: 'mgFallingBack'
    });

    document.getElementById('mgFallingReplay').addEventListener('click', () => initFalling(fallingState.difficulty));
    document.getElementById('mgFallingBack').addEventListener('click', backToHub);
  }

  // ============================================================================
  // MEMORY
  // ============================================================================

  const memoryState = {
    pairs: [], flipped: [], matched: [],
    moves: 0, elapsed: 0, timer: null,
    locked: false, difficulty: 'easy'
  };

  const MEMORY_CONFIGS = {
    easy:   { pairs: 4, cols: 2 },
    medium: { pairs: 6, cols: 3 },
    hard:   { pairs: 8, cols: 4 }
  };

  function showMemoryDifficulty() {
    switchToGame(`
      <div class="mg-diff-screen">
        <div class="mg-diff-title">Memory</div>
        <div class="mg-diff-sub">Choisis la difficult\u00e9</div>
        <div class="mg-diff-grid">
          <button class="mg-diff-btn" data-diff="easy">
            <span class="mg-diff-ico">${DIFF_ICONS.leaf}</span>Facile<span class="mg-diff-label">4 paires \u00b7 8 cartes</span>
          </button>
          <button class="mg-diff-btn" data-diff="medium">
            <span class="mg-diff-ico">${DIFF_ICONS.flame}</span>Moyen<span class="mg-diff-label">6 paires \u00b7 12 cartes</span>
          </button>
          <button class="mg-diff-btn" data-diff="hard">
            <span class="mg-diff-ico">${DIFF_ICONS.bolt}</span>Difficile<span class="mg-diff-label">8 paires \u00b7 16 cartes</span>
          </button>
        </div>
      </div>
    `);
    activeEl().querySelectorAll('.mg-diff-btn').forEach(btn => {
      btn.addEventListener('click', () => initMemory(btn.dataset.diff));
    });
  }

  function initMemory(difficulty) {
    const cfg = MEMORY_CONFIGS[difficulty] || MEMORY_CONFIGS.easy;
    Object.assign(memoryState, {
      difficulty, moves: 0, elapsed: 0, flipped: [], matched: [], locked: false
    });
    if (memoryState.timer) clearInterval(memoryState.timer);

    const picked = shuffle(names).slice(0, cfg.pairs);
    const cards = [];
    picked.forEach(n => {
      cards.push({ id: n.id, type: 'arabic', text: n.arabic, pairId: n.id });
      cards.push({ id: n.id, type: 'french', text: n.french, pairId: n.id });
    });
    memoryState.pairs = shuffle(cards);

    switchToGame(`
      <div class="mg-game-header">
        <div class="mg-stat">
          <span class="mg-stat-label">Coups</span>
          <span class="mg-stat-value" id="mgMemoryMoves">0</span>
        </div>
        <div class="mg-stat">
          <span class="mg-stat-label">Temps</span>
          <span class="mg-stat-value" id="mgMemoryTimer">0:00</span>
        </div>
        <div class="mg-stat">
          <span class="mg-stat-label">Paires</span>
          <span class="mg-stat-value" id="mgMemoryPairs">0/${cfg.pairs}</span>
        </div>
      </div>
      <div class="mg-memory-wrap" id="mgMemoryWrap">
        <div class="mg-memory-grid" data-cols="${cfg.cols}" id="mgMemoryGrid"></div>
      </div>
    `);

    renderMemoryGrid();

    memoryState.timer = setInterval(() => {
      memoryState.elapsed++;
      const el = document.getElementById('mgMemoryTimer');
      if (el) {
        const m = Math.floor(memoryState.elapsed / 60);
        const s = memoryState.elapsed % 60;
        el.textContent = m + ':' + (s < 10 ? '0' : '') + s;
      }
    }, 1000);
  }

  function renderMemoryGrid() {
    const grid = document.getElementById('mgMemoryGrid');
    if (!grid) return;
    grid.innerHTML = '';
    memoryState.pairs.forEach((card, idx) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'mg-memory-card';
      cardEl.dataset.idx = idx;
      cardEl.innerHTML = `
        <div class="mg-memory-card-inner">
          <div class="mg-memory-card-face mg-memory-card-back"></div>
          <div class="mg-memory-card-face mg-memory-card-front ${card.type}">
            ${escHtml(card.text)}
          </div>
        </div>`;
      cardEl.addEventListener('click', () => flipMemoryCard(idx));
      grid.appendChild(cardEl);
    });
  }

  function flipMemoryCard(idx) {
    if (memoryState.locked) return;
    if (memoryState.flipped.includes(idx)) return;
    if (memoryState.matched.includes(idx)) return;

    playSound('flip');
    memoryState.flipped.push(idx);
    const cardEl = document.querySelector(`.mg-memory-card[data-idx="${idx}"]`);
    if (cardEl) cardEl.classList.add('flipped');

    if (memoryState.flipped.length === 2) {
      memoryState.moves++;
      document.getElementById('mgMemoryMoves').textContent = memoryState.moves;
      memoryState.locked = true;

      const [a, b] = memoryState.flipped;
      const cardA = memoryState.pairs[a];
      const cardB = memoryState.pairs[b];

      if (cardA.pairId === cardB.pairId && a !== b) {
        memoryState.matched.push(a, b);
        playSound('match');
        const elA = document.querySelector(`.mg-memory-card[data-idx="${a}"]`);
        const elB = document.querySelector(`.mg-memory-card[data-idx="${b}"]`);
        if (elA) elA.classList.add('matched');
        if (elB) elB.classList.add('matched');

        const cfg = MEMORY_CONFIGS[memoryState.difficulty];
        document.getElementById('mgMemoryPairs').textContent =
          (memoryState.matched.length / 2) + '/' + cfg.pairs;

        memoryState.flipped = [];
        memoryState.locked = false;

        if (memoryState.matched.length === memoryState.pairs.length) {
          endMemory();
        }
      } else {
        const elA = document.querySelector(`.mg-memory-card[data-idx="${a}"]`);
        const elB = document.querySelector(`.mg-memory-card[data-idx="${b}"]`);
        if (elA) elA.classList.add('no-match');
        if (elB) elB.classList.add('no-match');
        setTimeout(() => {
          if (elA) elA.classList.remove('flipped', 'no-match');
          if (elB) elB.classList.remove('flipped', 'no-match');
          memoryState.flipped = [];
          memoryState.locked = false;
        }, 900);
      }
    }
  }

  function endMemory() {
    if (memoryState.timer) { clearInterval(memoryState.timer); memoryState.timer = null; }
    playSound('win');

    const cfg = MEMORY_CONFIGS[memoryState.difficulty];
    const ratio = cfg.pairs / memoryState.moves;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;

    const scoreKey = 'memory_' + memoryState.difficulty;
    const isNew = updateBest(scoreKey, memoryState.moves, true);
    const best = loadScores()[scoreKey];

    // Overlay on top of the grid wrapper
    const wrap = document.getElementById('mgMemoryWrap');
    if (!wrap) return;

    const overlay = document.createElement('div');
    overlay.innerHTML = buildEndHTML({
      title: 'Bravo !',
      stars,
      score: memoryState.moves,
      detail: 'coups en ' + formatTime(memoryState.elapsed),
      bestText: isNew ? 'Nouveau record !' : 'Meilleur : ' + best + ' coups',
      replayId: 'mgMemoryReplay',
      backId: 'mgMemoryBack'
    });
    wrap.appendChild(overlay.firstElementChild);

    document.getElementById('mgMemoryReplay').addEventListener('click', () => initMemory(memoryState.difficulty));
    document.getElementById('mgMemoryBack').addEventListener('click', backToHub);
  }

  // ============================================================================
  // WORD SEARCH
  // ============================================================================

  const wsState = {
    grid: [], size: 12, words: [], foundWords: [],
    selecting: false, selStart: null, selCells: [],
    elapsed: 0, timer: null, foundCellKeys: new Set()
  };

  const WS_DIRECTIONS = [
    { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 },
    { dr: 0, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: -1 },
    { dr: 1, dc: -1 }, { dr: -1, dc: 1 }
  ];

  function initWordSearch() {
    Object.assign(wsState, {
      elapsed: 0, foundWords: [], selecting: false,
      selStart: null, selCells: [], foundCellKeys: new Set()
    });
    if (wsState.timer) clearInterval(wsState.timer);

    const isMobile = window.innerWidth < 600;
    wsState.size = isMobile ? 10 : 12;
    const wordCount = isMobile ? 6 : 8;

    const picked = shuffle(names).slice(0, wordCount + 4);
    wsState.words = [];
    wsState.grid = [];

    for (let r = 0; r < wsState.size; r++) {
      wsState.grid[r] = [];
      for (let c = 0; c < wsState.size; c++) wsState.grid[r][c] = '';
    }

    const placed = [];
    for (const name of picked) {
      if (placed.length >= wordCount) break;
      const word = name.transliteration.replace(/[-\s\u2019\u2018''`]/g, '').toUpperCase();
      if (word.length > wsState.size) continue;
      if (placeWord(word, name)) placed.push({ word, name });
    }
    wsState.words = placed;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < wsState.size; r++) {
      for (let c = 0; c < wsState.size; c++) {
        if (!wsState.grid[r][c]) wsState.grid[r][c] = letters[Math.floor(Math.random() * 26)];
      }
    }

    renderWordSearch();

    wsState.timer = setInterval(() => {
      wsState.elapsed++;
      const el = document.getElementById('mgWSTimer');
      if (el) el.textContent = formatTime(wsState.elapsed);
    }, 1000);
  }

  function placeWord(word, name) {
    const dirs = shuffle([...WS_DIRECTIONS]);
    const positions = [];
    for (let r = 0; r < wsState.size; r++)
      for (let c = 0; c < wsState.size; c++) positions.push({ r, c });
    const shuffledPos = shuffle(positions);
    for (const dir of dirs) {
      for (const pos of shuffledPos) {
        if (canPlace(word, pos.r, pos.c, dir)) {
          doPlace(word, pos.r, pos.c, dir, name);
          return true;
        }
      }
    }
    return false;
  }

  function canPlace(word, r, c, dir) {
    for (let i = 0; i < word.length; i++) {
      const nr = r + dir.dr * i, nc = c + dir.dc * i;
      if (nr < 0 || nr >= wsState.size || nc < 0 || nc >= wsState.size) return false;
      if (wsState.grid[nr][nc] && wsState.grid[nr][nc] !== word[i]) return false;
    }
    return true;
  }

  function doPlace(word, r, c, dir, name) {
    const cells = [];
    for (let i = 0; i < word.length; i++) {
      const nr = r + dir.dr * i, nc = c + dir.dc * i;
      wsState.grid[nr][nc] = word[i];
      cells.push(nr + ',' + nc);
    }
    name._wsCells = cells;
    name._wsWord = word;
  }

  function renderWordSearch() {
    const size = wsState.size;
    switchToGame(`
      <div class="mg-game-header">
        <div class="mg-stat">
          <span class="mg-stat-label">Temps</span>
          <span class="mg-stat-value" id="mgWSTimer">0s</span>
        </div>
        <div class="mg-stat">
          <span class="mg-stat-label">Trouv\u00e9s</span>
          <span class="mg-stat-value" id="mgWSFound">0/${wsState.words.length}</span>
        </div>
      </div>
      <div class="mg-ws-wrap" id="mgWSWrap">
        <div class="mg-ws-layout">
          <div class="mg-ws-grid-wrap">
            <div class="mg-ws-grid" data-size="${size}" id="mgWSGrid"></div>
          </div>
          <div class="mg-ws-clues" id="mgWSClues">
            ${wsState.words.map((w, i) => `
              <div class="mg-ws-clue" data-idx="${i}">
                <span class="mg-ws-clue-word">${escHtml(w.name.transliteration)}</span>
                ${escHtml(w.name.french)}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `);

    const grid = document.getElementById('mgWSGrid');
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement('div');
        cell.className = 'mg-ws-cell';
        cell.textContent = wsState.grid[r][c];
        cell.dataset.r = r;
        cell.dataset.c = c;
        grid.appendChild(cell);
      }
    }

    grid.addEventListener('pointerdown', wsPointerDown);
    grid.addEventListener('pointermove', wsPointerMove);
    grid.addEventListener('pointerup', wsPointerUp);
    grid.addEventListener('pointerleave', wsPointerUp);
  }

  function wsGetCell(e) {
    const el = e.target.closest('.mg-ws-cell');
    if (!el) return null;
    return { r: parseInt(el.dataset.r), c: parseInt(el.dataset.c), el };
  }

  function wsPointerDown(e) {
    const cell = wsGetCell(e);
    if (!cell) return;
    e.preventDefault();
    wsState.selecting = true;
    wsState.selStart = cell;
    wsState.selCells = [cell];
    cell.el.classList.add('selecting');
    e.target.closest('.mg-ws-grid').setPointerCapture(e.pointerId);
  }

  function wsPointerMove(e) {
    if (!wsState.selecting) return;
    const grid = document.getElementById('mgWSGrid');
    if (!grid) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || !el.classList.contains('mg-ws-cell')) return;

    const r = parseInt(el.dataset.r), c = parseInt(el.dataset.c);
    const start = wsState.selStart;
    const dr = r - start.r, dc = c - start.c;
    const absDr = Math.abs(dr), absDc = Math.abs(dc);

    if (absDr !== 0 && absDc !== 0 && absDr !== absDc) return;
    if (absDr === 0 && absDc === 0) {
      wsClearSelecting();
      start.el = grid.querySelector(`.mg-ws-cell[data-r="${start.r}"][data-c="${start.c}"]`);
      if (start.el) start.el.classList.add('selecting');
      wsState.selCells = [start];
      return;
    }

    const len = Math.max(absDr, absDc);
    const stepR = dr === 0 ? 0 : dr / len, stepC = dc === 0 ? 0 : dc / len;

    wsClearSelecting();
    const newCells = [];
    for (let i = 0; i <= len; i++) {
      const cellEl = grid.querySelector(`.mg-ws-cell[data-r="${start.r + stepR * i}"][data-c="${start.c + stepC * i}"]`);
      if (cellEl) {
        cellEl.classList.add('selecting');
        newCells.push({ r: start.r + stepR * i, c: start.c + stepC * i, el: cellEl });
      }
    }
    wsState.selCells = newCells;
  }

  function wsClearSelecting() {
    const grid = document.getElementById('mgWSGrid');
    if (!grid) return;
    grid.querySelectorAll('.mg-ws-cell.selecting').forEach(el => el.classList.remove('selecting'));
  }

  function wsPointerUp() {
    if (!wsState.selecting) return;
    wsState.selecting = false;

    const selectedKeys = wsState.selCells.map(c => c.r + ',' + c.c);
    const selectedWord = wsState.selCells.map(c => wsState.grid[c.r][c.c]).join('');

    let found = false;
    for (let i = 0; i < wsState.words.length; i++) {
      const w = wsState.words[i];
      if (wsState.foundWords.includes(i)) continue;
      if (selectedWord === w.word || selectedWord === w.word.split('').reverse().join('')) {
        const wordCells = w.name._wsCells;
        const keysMatch = selectedKeys.length === wordCells.length &&
          (selectedKeys.every((k, j) => k === wordCells[j]) ||
           selectedKeys.every((k, j) => k === wordCells[wordCells.length - 1 - j]));
        if (keysMatch) {
          found = true;
          wsState.foundWords.push(i);
          playSound('correct');
          wsState.selCells.forEach(c => {
            c.el.classList.remove('selecting');
            c.el.classList.add('found');
            wsState.foundCellKeys.add(c.r + ',' + c.c);
          });
          const clueEl = document.querySelector(`.mg-ws-clue[data-idx="${i}"]`);
          if (clueEl) clueEl.classList.add('found');
          document.getElementById('mgWSFound').textContent =
            wsState.foundWords.length + '/' + wsState.words.length;
          if (wsState.foundWords.length === wsState.words.length) endWordSearch();
          break;
        }
      }
    }

    if (!found) {
      wsState.selCells.forEach(c => {
        c.el.classList.remove('selecting');
        c.el.classList.add('wrong');
        setTimeout(() => c.el.classList.remove('wrong'), 300);
      });
    }

    wsClearSelecting();
    wsState.selCells = [];
  }

  function endWordSearch() {
    if (wsState.timer) { clearInterval(wsState.timer); wsState.timer = null; }
    playSound('win');

    const isNew = updateBest('wordsearch', wsState.elapsed, true);
    const best = loadScores().wordsearch;

    // Overlay on top of the game wrapper
    const wrap = document.getElementById('mgWSWrap');
    if (!wrap) return;

    const overlay = document.createElement('div');
    overlay.innerHTML = buildEndHTML({
      title: 'Tous les mots trouv\u00e9s !',
      score: formatTime(wsState.elapsed),
      detail: wsState.words.length + ' mots',
      bestText: isNew ? 'Nouveau record !' : 'Meilleur : ' + formatTime(best),
      replayId: 'mgWSReplay',
      backId: 'mgWSBack'
    });
    wrap.appendChild(overlay.firstElementChild);

    document.getElementById('mgWSReplay').addEventListener('click', initWordSearch);
    document.getElementById('mgWSBack').addEventListener('click', backToHub);
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  return {
    renderHub,
    backToHub,
    toggleSound() {
      mgSoundEnabled = !mgSoundEnabled;
      const btn = document.getElementById('mgSoundToggle');
      if (btn) btn.classList.toggle('muted', !mgSoundEnabled);
    },
    init() { names = typeof ASMA_UL_HUSNA !== 'undefined' ? ASMA_UL_HUSNA : []; }
  };
})();
