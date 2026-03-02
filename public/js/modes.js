/**
 * Al-Asmaa — Modes d'apprentissage v1.0
 * Flashcard, Quiz QCM, Écoute, SRS, Défi quotidien, Progression, Stories, Partage, Mode enfant
 */
const Modes = (() => {
  // ==========================================================================
  // STATE
  // ==========================================================================
  let names = [];
  let encyclopedia = {};
  let currentMode = null;
  let isKidsMode = false;

  // Flashcard state
  let fcIndex = 0;
  let fcNames = [];
  let fcFlipped = false;

  // Quiz state
  let qzNames = [];
  let qzIndex = 0;
  let qzScore = 0;
  let qzTotal = 0;
  let qzStreak = 0;
  let qzBestStreak = 0;
  let qzAnswered = false;

  // Listen state
  let lsIndex = 0;
  let lsNames = [];

  // Daily challenge
  const DAILY_KEY = 'al-asmaa-daily';
  const PROGRESS_KEY = 'al-asmaa-training-progress';

  // ==========================================================================
  // INIT
  // ==========================================================================
  function init(namesData, encycData) {
    names = namesData || [];
    encyclopedia = encycData || {};
    setupModeNav();
    renderProgress();
    checkDailyChallenge();
  }

  function setupModeNav() {
    document.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        switchMode(mode);
      });
    });
  }

  function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));

    const panel = document.getElementById('mode-' + mode);
    const btn = document.querySelector(`[data-mode="${mode}"]`);
    if (panel) panel.classList.remove('hidden');
    if (btn) btn.classList.add('active');

    switch (mode) {
      case 'flashcard': initFlashcard(); break;
      case 'quiz': initQuiz(); break;
      case 'listen': initListen(); break;
      case 'daily': initDaily(); break;
      case 'progress': renderProgress(); break;
      case 'story': initStory(); break;
    }
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
    catch { return {}; }
  }

  function saveProgress(p) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  }

  function getStatus(nameId) {
    const p = loadProgress();
    const e = p[nameId];
    if (!e || e.score === 0) return 'new';
    if (e.score >= 4) return 'mastered';
    return 'learning';
  }

  function recordAnswer(nameId, quality) {
    const p = loadProgress();
    const now = Date.now();
    const entry = p[nameId] || { score: 0, lastSeen: now, interval: 3600000, repetitions: 0 };
    const MAX_INTERVAL = 30 * 24 * 3600000;

    switch (quality) {
      case 0: entry.score = Math.max(0, entry.score - 1); entry.interval = 3600000; break;
      case 1: entry.score = Math.min(5, entry.score + 1); entry.interval = Math.min(entry.interval * 2, MAX_INTERVAL); break;
      case 2: entry.score = Math.min(5, entry.score + 2); entry.interval = Math.min(entry.interval * 2, MAX_INTERVAL); break;
    }
    entry.lastSeen = now;
    entry.repetitions++;
    p[nameId] = entry;
    saveProgress(p);
  }

  function escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  async function submitScore(type, name, score) {
    try {
      const res = await fetch(`/api/leaderboard/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score })
      });
      if (res.ok) return res.json();
    } catch (e) { /* offline — ignore */ }
    return null;
  }

  function getCategoryLabel(cat) {
    const labels = {
      mercy: 'Miséricorde', sovereignty: 'Souveraineté', beauty: 'Beauté',
      power: 'Puissance', justice: 'Justice', knowledge: 'Connaissance',
      creation: 'Création', provision: 'Subsistance', guidance: 'Guidance',
      protection: 'Protection', majesty: 'Majesté', wisdom: 'Sagesse',
      life: 'Vie', uniqueness: 'Unicité', patience: 'Patience'
    };
    return labels[cat] || cat;
  }

  // ==========================================================================
  // 1. MODE FLASHCARD
  // ==========================================================================
  function initFlashcard(customNames) {
    fcNames = customNames || shuffle(names);
    fcIndex = 0;
    fcFlipped = false;
    renderFlashcard();
  }

  function renderFlashcard() {
    const container = document.getElementById('flashcard-content');
    if (!container || fcNames.length === 0) return;

    const name = fcNames[fcIndex];
    const enc = encyclopedia[name.id] || {};
    const status = getStatus(name.id);
    const statusClass = status === 'mastered' ? 'status-mastered' : status === 'learning' ? 'status-learning' : 'status-new';

    container.innerHTML = `
      <div class="fc-progress">${fcIndex + 1} / ${fcNames.length}</div>
      <div class="fc-card ${fcFlipped ? 'flipped' : ''}" id="fcCard">
        <div class="fc-front" role="button" tabindex="0" aria-label="Cliquer pour retourner la carte">
          <span class="fc-status ${statusClass}">${status === 'mastered' ? 'Maîtrisé' : status === 'learning' ? 'En cours' : 'Nouveau'}</span>
          <div class="fc-arabic" lang="ar" dir="rtl">${escHtml(name.arabic)}</div>
          <div class="fc-hint">Toucher pour retourner</div>
        </div>
        <div class="fc-back">
          <div class="fc-translit">${escHtml(name.transliteration)}</div>
          <div class="fc-meaning">${escHtml(name.french)}</div>
          <div class="fc-english">${escHtml(name.english)}</div>
          <div class="fc-category">${getCategoryLabel(name.category)}</div>
          <div class="fc-verse">${escHtml(name.quranVerse)}</div>
          ${enc.detailedMeaning ? `<div class="fc-detail">${escHtml(enc.detailedMeaning).substring(0, 200)}...</div>` : ''}
          <div class="fc-rating">
            <button class="fc-rate-btn fc-hard" data-quality="0">Difficile</button>
            <button class="fc-rate-btn fc-ok" data-quality="1">Correct</button>
            <button class="fc-rate-btn fc-easy" data-quality="2">Facile</button>
          </div>
        </div>
      </div>
      <div class="fc-nav">
        <button class="fc-nav-btn" id="fcPrev" ${fcIndex === 0 ? 'disabled' : ''}>Précédent</button>
        <button class="fc-nav-btn fc-flip-btn" id="fcFlip">Retourner</button>
        <button class="fc-nav-btn" id="fcNext">${fcIndex >= fcNames.length - 1 ? 'Terminer' : 'Suivant'}</button>
      </div>`;

    // Events
    const card = document.getElementById('fcCard');
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.fc-rate-btn')) flipCard();
    });

    document.getElementById('fcFlip').addEventListener('click', flipCard);
    document.getElementById('fcPrev').addEventListener('click', () => { if (fcIndex > 0) { fcIndex--; fcFlipped = false; renderFlashcard(); } });
    document.getElementById('fcNext').addEventListener('click', () => {
      if (fcIndex < fcNames.length - 1) { fcIndex++; fcFlipped = false; renderFlashcard(); }
      else { showFlashcardComplete(); }
    });

    container.querySelectorAll('.fc-rate-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        recordAnswer(name.id, parseInt(btn.dataset.quality));
        btn.classList.add('selected');
        setTimeout(() => {
          if (fcIndex < fcNames.length - 1) { fcIndex++; fcFlipped = false; renderFlashcard(); }
          else showFlashcardComplete();
        }, 400);
      });
    });
  }

  function flipCard() {
    fcFlipped = !fcFlipped;
    const card = document.getElementById('fcCard');
    if (card) card.classList.toggle('flipped', fcFlipped);
  }

  function showFlashcardComplete() {
    const container = document.getElementById('flashcard-content');
    if (!container) return;
    container.innerHTML = `
      <div class="mode-complete">
        <div class="complete-icon">&#x2714;</div>
        <h2>Session terminée !</h2>
        <p>Vous avez révisé ${fcNames.length} noms.</p>
        <button class="btn-mode" onclick="Modes.switchMode('flashcard')">Recommencer</button>
        <button class="btn-mode btn-secondary" onclick="Modes.switchMode('progress')">Voir la progression</button>
      </div>`;
  }

  // ==========================================================================
  // 2. MODE QUIZ (QCM)
  // ==========================================================================
  function initQuiz() {
    qzNames = shuffle(names);
    qzIndex = 0;
    qzScore = 0;
    qzTotal = Math.min(20, qzNames.length);
    qzStreak = 0;
    qzBestStreak = 0;
    qzAnswered = false;
    renderQuiz();
  }

  function renderQuiz() {
    const container = document.getElementById('quiz-content');
    if (!container || qzIndex >= qzTotal) { showQuizResults(container); return; }

    const name = qzNames[qzIndex];
    qzAnswered = false;

    // Générer 3 mauvaises réponses
    const wrongNames = names.filter(n => n.id !== name.id);
    const choices = shuffle([name, ...shuffle(wrongNames).slice(0, 3)]);

    // Type de question aléatoire
    const types = ['ar2fr', 'fr2ar', 'translit2fr'];
    const type = types[Math.floor(Math.random() * types.length)];

    let question, getLabel;
    switch (type) {
      case 'ar2fr':
        question = `<span class="quiz-arabic" lang="ar" dir="rtl">${escHtml(name.arabic)}</span><br>Quelle est la signification ?`;
        getLabel = (n) => n.french;
        break;
      case 'fr2ar':
        question = `<strong>${escHtml(name.french)}</strong><br>Quel est le nom en arabe ?`;
        getLabel = (n) => n.arabic;
        break;
      case 'translit2fr':
        question = `<strong>${escHtml(name.transliteration)}</strong><br>Quelle est la signification ?`;
        getLabel = (n) => n.french;
        break;
    }

    container.innerHTML = `
      <div class="quiz-header">
        <div class="quiz-progress">Question ${qzIndex + 1}/${qzTotal}</div>
        <div class="quiz-score">Score : ${qzScore} | Série : ${qzStreak}</div>
      </div>
      <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width: ${((qzIndex) / qzTotal) * 100}%"></div></div>
      <div class="quiz-question">${question}</div>
      <div class="quiz-choices" id="quizChoices">
        ${choices.map((c, i) => `
          <button class="quiz-choice" data-id="${c.id}" ${type === 'fr2ar' ? 'lang="ar" dir="rtl"' : ''}>
            <span class="choice-letter">${String.fromCharCode(65 + i)}</span>
            ${escHtml(getLabel(c))}
          </button>`).join('')}
      </div>
      <div class="quiz-feedback hidden" id="quizFeedback"></div>`;

    document.querySelectorAll('.quiz-choice').forEach(btn => {
      btn.addEventListener('click', () => checkQuizAnswer(btn, name));
    });
  }

  function checkQuizAnswer(btn, correctName) {
    if (qzAnswered) return;
    qzAnswered = true;

    const isCorrect = parseInt(btn.dataset.id) === correctName.id;

    if (isCorrect) {
      qzScore += 10 + qzStreak * 2;
      qzStreak++;
      if (qzStreak > qzBestStreak) qzBestStreak = qzStreak;
      btn.classList.add('correct');
      recordAnswer(correctName.id, 2);
    } else {
      qzStreak = 0;
      btn.classList.add('wrong');
      recordAnswer(correctName.id, 0);
      // Highlight correct answer
      document.querySelectorAll('.quiz-choice').forEach(b => {
        if (parseInt(b.dataset.id) === correctName.id) b.classList.add('correct');
      });
    }

    const feedback = document.getElementById('quizFeedback');
    if (feedback) {
      feedback.classList.remove('hidden');
      feedback.innerHTML = isCorrect
        ? `<span class="fb-correct">Correct ! ${escHtml(correctName.transliteration)} = ${escHtml(correctName.french)}</span>`
        : `<span class="fb-wrong">La bonne réponse était : ${escHtml(correctName.transliteration)} (${escHtml(correctName.french)})</span>`;
    }

    setTimeout(() => { qzIndex++; renderQuiz(); }, isCorrect ? 1200 : 2500);
  }

  function showQuizResults(container) {
    if (!container) return;
    const percent = Math.round((qzScore / (qzTotal * 10)) * 100);

    // Save best score
    const bestKey = 'al-asmaa-quiz-best';
    const oldBest = parseInt(localStorage.getItem(bestKey) || '0');
    if (qzScore > oldBest) localStorage.setItem(bestKey, qzScore.toString());

    // Submit to leaderboard
    const playerName = localStorage.getItem('al-asmaa-pseudo') || 'Anonyme';
    submitScore('quiz', playerName, qzScore).then(result => {
      const rankEl = document.getElementById('qzLeaderRank');
      if (rankEl && result) rankEl.textContent = `Classement : #${result.rank} sur ${result.total}`;
    });

    container.innerHTML = `
      <div class="mode-complete">
        <div class="complete-icon">${percent >= 80 ? '&#x1F31F;' : percent >= 50 ? '&#x1F44D;' : '&#x1F4AA;'}</div>
        <h2>Quiz terminé !</h2>
        <div class="quiz-result-stats">
          <div class="stat"><span class="stat-val">${qzScore}</span><span class="stat-label">Score</span></div>
          <div class="stat"><span class="stat-val">${qzBestStreak}</span><span class="stat-label">Meilleure série</span></div>
          <div class="stat"><span class="stat-val">${percent}%</span><span class="stat-label">Réussite</span></div>
        </div>
        <p class="leaderboard-rank" id="qzLeaderRank"></p>
        ${qzScore > oldBest ? '<p class="new-record">Nouveau record !</p>' : ''}
        <button class="btn-mode" onclick="Modes.initQuiz()">Rejouer</button>
        <button class="btn-mode btn-secondary" onclick="Modes.shareResult({type:'quiz',score:${qzScore},percent:${percent}})">Partager</button>
      </div>`;
  }

  // ==========================================================================
  // 3. MODE ÉCOUTE — Google Translate TTS (fiable pour l'arabe)
  // ==========================================================================
  let lsAutoRepeat = false;
  let _currentAudio = null;

  function initListen() {
    lsNames = [...names];
    lsIndex = 0;
    lsAutoRepeat = false;
    renderListen();
  }

  function renderListen() {
    const container = document.getElementById('listen-content');
    if (!container || lsNames.length === 0) return;

    // Stop any playing audio
    if (_currentAudio) {
      _currentAudio.pause();
      _currentAudio = null;
    }

    const name = lsNames[lsIndex];

    // Generate audio bars HTML
    const barsHtml = Array.from({length: 15}, () => '<div class="ls-audio-bar"></div>').join('');

    container.innerHTML = `
      <div class="ls-progress">${lsIndex + 1} / ${lsNames.length}</div>
      <div class="ls-card" style="animation: modeSlideIn 0.4s ease;">
        <div class="ls-arabic" lang="ar" dir="rtl">${escHtml(name.arabic)}</div>
        <div class="ls-translit">${escHtml(name.transliteration)}</div>
        <div class="ls-meaning">${escHtml(name.french)}</div>

        <div class="ls-audio-viz" id="lsAudioViz">${barsHtml}</div>

        <button class="ls-play-btn" id="lsPlayBtn" aria-label="Écouter la prononciation">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="27" stroke="currentColor" stroke-width="2" opacity="0.3"/>
            <circle cx="28" cy="28" r="23" stroke="currentColor" stroke-width="2"/>
            <polygon points="22,16 42,28 22,40" fill="currentColor"/>
          </svg>
          <span>Écouter</span>
        </button>

        <div class="ls-controls">
          <div class="ls-speed">
            <button class="ls-speed-btn" data-rate="0.5">Lent</button>
            <button class="ls-speed-btn active" data-rate="1">Normal</button>
            <button class="ls-speed-btn" data-rate="1.5">Rapide</button>
          </div>
          <button class="ls-repeat-btn ${lsAutoRepeat ? 'active' : ''}" id="lsRepeatBtn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
            Répéter
          </button>
        </div>

        <div class="ls-pronunciation">
          <strong>Translittération :</strong> ${escHtml(name.transliteration)}<br>
          <strong>Signification :</strong> ${escHtml(name.french)}${name.english ? '<br><strong>English:</strong> ' + escHtml(name.english) : ''}
        </div>

        <div class="ls-tip">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          Répétez à voix haute après l'écoute pour mieux mémoriser
        </div>
      </div>
      <div class="fc-nav">
        <button class="fc-nav-btn" id="lsPrev" ${lsIndex === 0 ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Précédent
        </button>
        <button class="fc-nav-btn" id="lsAutoPlay" style="background:rgba(212,162,76,0.1);color:var(--gold);border-color:var(--gold);">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Écouter
        </button>
        <button class="fc-nav-btn" id="lsNext" ${lsIndex >= lsNames.length - 1 ? 'disabled' : ''}>
          Suivant
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>`;

    let rate = 1;

    // Play button
    document.getElementById('lsPlayBtn').addEventListener('click', () => speak(name.arabic, rate));

    // Auto-play button in nav
    document.getElementById('lsAutoPlay').addEventListener('click', () => speak(name.arabic, rate));

    // Speed controls
    document.querySelectorAll('.ls-speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        rate = parseFloat(btn.dataset.rate);
        document.querySelectorAll('.ls-speed-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        speak(name.arabic, rate);
      });
    });

    // Repeat toggle
    document.getElementById('lsRepeatBtn').addEventListener('click', () => {
      lsAutoRepeat = !lsAutoRepeat;
      document.getElementById('lsRepeatBtn').classList.toggle('active', lsAutoRepeat);
    });

    // Navigation
    document.getElementById('lsPrev').addEventListener('click', () => {
      if (lsIndex > 0) {
        if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }
        lsIndex--;
        renderListen();
      }
    });
    document.getElementById('lsNext').addEventListener('click', () => {
      if (lsIndex < lsNames.length - 1) {
        if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }
        lsIndex++;
        renderListen();
      }
    });

    // Auto-play on load
    setTimeout(() => speak(name.arabic, rate), 500);
  }

  /**
   * speak() — Pronounce Arabic text using Google Translate TTS.
   * Uses an Audio element with the Google Translate TTS endpoint.
   * Falls back to Web Speech API if Google TTS is blocked.
   */
  function speak(text, rate = 1) {
    // Stop any currently playing audio
    if (_currentAudio) {
      _currentAudio.pause();
      _currentAudio = null;
    }

    const btn = document.getElementById('lsPlayBtn');
    const viz = document.getElementById('lsAudioViz');

    function setPlaying(playing) {
      if (btn) btn.classList.toggle('playing', playing);
      if (viz) viz.classList.toggle('playing', playing);
    }

    function onEnd() {
      setPlaying(false);
      _currentAudio = null;
      if (lsAutoRepeat) {
        setTimeout(() => speak(text, rate), 800);
      }
    }

    function onError() {
      setPlaying(false);
      _currentAudio = null;
      // Fallback: try Web Speech API
      if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        synth.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = 'ar-SA';
        utt.rate = rate;
        setPlaying(true);
        utt.onend = () => {
          setPlaying(false);
          if (lsAutoRepeat) setTimeout(() => speak(text, rate), 800);
        };
        utt.onerror = () => setPlaying(false);
        synth.speak(utt);
      }
    }

    // Force pausal form (waqf): strip ALL diacritics, then add sukun on the
    // last Arabic letter so TTS doesn't add a trailing vowel ("ou"/"i"/"a").
    let clean = text.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
    // Find last Arabic letter and insert sukun (ْ U+0652) after it
    const lastArabicIdx = clean.search(/[\u0621-\u064A][^\u0621-\u064A]*$/);
    if (lastArabicIdx !== -1) {
      clean = clean.slice(0, lastArabicIdx + 1) + '\u0652' + clean.slice(lastArabicIdx + 1);
    }
    const encoded = encodeURIComponent(clean);
    const ttsUrl = `/api/tts?q=${encoded}`;

    setPlaying(true);

    const audio = new Audio(ttsUrl);
    audio.playbackRate = rate;
    _currentAudio = audio;

    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onError);

    audio.play().catch(onError);
  }

  // ==========================================================================
  // 4. MODE SRS (Répétition espacée — amélioré)
  // ==========================================================================
  // Uses the existing Training module from training.js if available,
  // otherwise uses internal progress system

  // ==========================================================================
  // 5. DÉFI QUOTIDIEN
  // ==========================================================================
  function getDailyData() {
    try { return JSON.parse(localStorage.getItem(DAILY_KEY)) || {}; }
    catch { return {}; }
  }

  function saveDailyData(d) {
    localStorage.setItem(DAILY_KEY, JSON.stringify(d));
  }

  function getTodayStr() {
    return new Date().toISOString().split('T')[0];
  }

  function checkDailyChallenge() {
    const badge = document.getElementById('dailyBadge');
    if (!badge) return;
    const data = getDailyData();
    const today = getTodayStr();
    if (!data.date || data.date !== today) {
      badge.classList.remove('hidden');
      badge.textContent = '!';
    } else if (!data.completed) {
      badge.classList.remove('hidden');
      badge.textContent = '...';
    } else {
      badge.classList.add('hidden');
    }
  }

  function initDaily() {
    const container = document.getElementById('daily-content');
    if (!container) return;

    const today = getTodayStr();
    let data = getDailyData();

    // Generate 3 daily names based on date seed
    if (data.date !== today) {
      const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0);
      const startIdx = (seed * 7) % names.length;
      data = {
        date: today,
        nameIds: [
          names[startIdx % names.length].id,
          names[(startIdx + 33) % names.length].id,
          names[(startIdx + 66) % names.length].id
        ],
        completed: false,
        results: {}
      };
      saveDailyData(data);
    }

    const dailyNames = data.nameIds.map(id => names.find(n => n.id === id)).filter(Boolean);

    if (data.completed) {
      renderDailyCompleted(container, dailyNames, data);
      return;
    }

    container.innerHTML = `
      <div class="daily-header" style="animation: modeSlideIn 0.4s ease;">
        <h2>Défi du jour</h2>
        <div class="daily-date">${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <p>Apprenez ces 3 noms aujourd'hui</p>
      </div>
      <div class="daily-names" id="dailyNames">
        ${dailyNames.map((name, i) => `
          <div class="daily-name-card${data.results[name.id] ? ' learned' : ''}" data-id="${name.id}" style="animation: fadeInUp 0.4s ease ${0.1 + i * 0.15}s both;">
            <div class="daily-num">${i + 1}/3</div>
            <div class="daily-arabic" lang="ar" dir="rtl">${escHtml(name.arabic)}</div>
            <div class="daily-translit">${escHtml(name.transliteration)}</div>
            <div class="daily-meaning">${escHtml(name.french)}</div>
            <div class="daily-verse">${escHtml(name.quranVerse)}</div>
            <div class="daily-actions">
              <button class="btn-daily-listen" data-arabic="${escHtml(name.arabic)}">Écouter</button>
              <button class="btn-daily-learned" data-id="${name.id}" ${data.results[name.id] ? 'disabled' : ''}>${data.results[name.id] ? 'Appris !' : 'J\'ai appris !'}</button>
            </div>
          </div>`).join('')}
      </div>
      <div class="daily-streak" style="animation: fadeInUp 0.4s ease 0.5s both;">Série : ${getDailyStreak()} jour(s)</div>`;

    container.querySelectorAll('.btn-daily-listen').forEach(btn => {
      btn.addEventListener('click', () => speak(btn.dataset.arabic, 0.6));
    });

    container.querySelectorAll('.btn-daily-learned').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        data.results[id] = true;
        recordAnswer(id, 2);
        btn.textContent = 'Appris !';
        btn.disabled = true;
        btn.closest('.daily-name-card').classList.add('learned');

        if (Object.keys(data.results).length >= dailyNames.length) {
          data.completed = true;
          data.streak = (data.streak || getDailyStreak()) + 1;
          saveDailyData(data);
          setTimeout(() => renderDailyCompleted(container, dailyNames, data), 600);
        }
        saveDailyData(data);
      });
    });
  }

  function getDailyStreak() {
    const data = getDailyData();
    return data.streak || 0;
  }

  function renderDailyCompleted(container, dailyNames, data) {
    container.innerHTML = `
      <div class="mode-complete">
        <div class="complete-icon">&#x2B50;</div>
        <h2>Défi complété !</h2>
        <p>Vous avez appris 3 noms aujourd'hui.</p>
        <div class="daily-learned-names">
          ${dailyNames.map(n => `<span class="daily-tag">${escHtml(n.transliteration)}</span>`).join('')}
        </div>
        <p class="daily-streak-msg">Série : ${data.streak || 1} jour(s) consécutif(s)</p>
        <button class="btn-mode btn-secondary" onclick="Modes.shareResult({type:'daily',streak:${data.streak || 1},names:${JSON.stringify(dailyNames.map(n => n.transliteration))}})">Partager</button>
      </div>`;
    checkDailyChallenge();
  }

  // ==========================================================================
  // 6. TABLEAU DE PROGRESSION
  // ==========================================================================
  function renderProgress() {
    const container = document.getElementById('progress-content');
    if (!container) return;

    const progress = loadProgress();
    let mastered = 0, learning = 0, newCount = 0;

    names.forEach(n => {
      const s = getStatus(n.id);
      if (s === 'mastered') mastered++;
      else if (s === 'learning') learning++;
      else newCount++;
    });

    const percent = Math.round((mastered / 99) * 100);

    const circumference = 2 * Math.PI * 52;
    const dashOffset = circumference * (1 - percent / 100);

    container.innerHTML = `
      <div class="prog-summary" style="animation: modeSlideIn 0.4s ease;">
        <div class="prog-circle">
          <svg viewBox="0 0 120 120" width="140" height="140">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="8"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--gold)" stroke-width="8"
              stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"
              stroke-linecap="round" transform="rotate(-90 60 60)"
              style="transition: stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;"
              id="progRingFill" data-target="${dashOffset}"/>
            <text x="60" y="55" text-anchor="middle" fill="var(--gold)" font-size="28" font-weight="bold" font-family="var(--font-display)">${percent}%</text>
            <text x="60" y="75" text-anchor="middle" fill="var(--text-muted)" font-size="11" font-family="var(--font-body)">maîtrisé</text>
          </svg>
        </div>
        <div class="prog-stats">
          <div class="prog-stat"><span class="prog-dot mastered"></span> Maîtrisés : ${mastered}/99</div>
          <div class="prog-stat"><span class="prog-dot learning"></span> En cours : ${learning}</div>
          <div class="prog-stat"><span class="prog-dot new"></span> Nouveaux : ${newCount}</div>
        </div>
      </div>

      <h3 class="prog-title">Les 99 Noms</h3>
      <div class="prog-grid">
        ${names.map((n, i) => {
          const s = getStatus(n.id);
          return '<div class="prog-cell ' + s + '" title="' + escHtml(n.transliteration) + ' — ' + escHtml(n.french) + '" data-id="' + n.id + '" style="animation: fadeInUp 0.3s ease ' + (0.01 * i) + 's both;">' +
            '<span class="prog-id">' + n.id + '</span>' +
            '<span class="prog-name">' + escHtml(n.transliteration.split('-').pop()) + '</span>' +
          '</div>';
        }).join('')}
      </div>

      <div class="prog-actions" style="animation: fadeInUp 0.4s ease 1s both;">
        <button class="btn-mode" onclick="Modes.initFlashcard(Modes.getWeakNames())">Réviser les points faibles</button>
        <button class="btn-mode btn-danger" id="btnResetProg">Réinitialiser la progression</button>
      </div>`;

    // Animate progress ring
    requestAnimationFrame(() => {
      setTimeout(() => {
        const ring = document.getElementById('progRingFill');
        if (ring) ring.style.strokeDashoffset = ring.dataset.target;
      }, 100);
    });

    document.getElementById('btnResetProg')?.addEventListener('click', () => {
      if (confirm('Réinitialiser toute la progression ? Cette action est irréversible.')) {
        localStorage.removeItem(PROGRESS_KEY);
        renderProgress();
      }
    });

    container.querySelectorAll('.prog-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const n = names.find(x => x.id === parseInt(cell.dataset.id));
        if (n) {
          initFlashcard([n]);
          switchMode('flashcard');
        }
      });
    });
  }

  function getWeakNames() {
    const progress = loadProgress();
    return names.filter(n => {
      const e = progress[n.id];
      return !e || e.score < 4;
    }).sort((a, b) => {
      const ea = progress[a.id], eb = progress[b.id];
      return (ea?.score || 0) - (eb?.score || 0);
    }).slice(0, 20);
  }

  // ==========================================================================
  // 7. MODE STORY
  // ==========================================================================
  function initStory() {
    renderStory(0);
  }

  function renderStory(index) {
    const container = document.getElementById('story-content');
    if (!container) return;

    const name = names[index];
    const enc = encyclopedia[name.id] || {};

    let storyContent = '';

    if (enc.hadithReferences && enc.hadithReferences.length > 0) {
      const h = enc.hadithReferences[0];
      storyContent += `
        <div class="story-hadith">
          <div class="story-label">Hadith</div>
          <blockquote>${escHtml(h.text)}</blockquote>
          <cite>${escHtml(h.source)}</cite>
        </div>`;
    }

    if (enc.scholarComments && enc.scholarComments.length > 0) {
      const sc = enc.scholarComments[0];
      storyContent += `
        <div class="story-scholar">
          <div class="story-label">Commentaire savant</div>
          <p>${escHtml(sc.text)}</p>
          <cite>${escHtml(sc.scholar || '')}</cite>
        </div>`;
    }

    if (enc.quranVerses && enc.quranVerses.length > 0) {
      const v = enc.quranVerses[0];
      storyContent += `
        <div class="story-verse">
          <div class="story-label">Verset coranique</div>
          <div class="story-arabic" lang="ar" dir="rtl">${escHtml(v.arabic)}</div>
          <div class="story-translation">« ${escHtml(v.translation)} »</div>
          <cite>${escHtml(v.surah)} ${v.surahNumber}:${v.ayah}</cite>
        </div>`;
    }

    if (!storyContent) {
      storyContent = `
        <div class="story-desc">
          <p>${escHtml(name.description)}</p>
          <p><strong>Référence :</strong> ${escHtml(name.quranVerse)}</p>
        </div>`;
    }

    container.innerHTML = `
      <div class="story-header" style="animation: modeSlideIn 0.4s ease;">
        <div class="story-num">Nom #${name.id}</div>
        <div class="story-name-arabic" lang="ar" dir="rtl">${escHtml(name.arabic)}</div>
        <h2 class="story-name">${escHtml(name.transliteration)}</h2>
        <div class="story-meaning">${escHtml(name.french)}</div>
      </div>
      ${storyContent}
      <div class="fc-nav" style="animation: fadeInUp 0.4s ease 0.4s both;">
        <button class="fc-nav-btn" id="storyPrev" ${index === 0 ? 'disabled' : ''}>Précédent</button>
        <button class="fc-nav-btn" id="storyListen" style="background:rgba(212,162,76,0.1);color:var(--gold);border-color:var(--gold);">Écouter</button>
        <button class="fc-nav-btn" id="storyRandom">Au hasard</button>
        <button class="fc-nav-btn" id="storyNext" ${index >= names.length - 1 ? 'disabled' : ''}>Suivant</button>
      </div>`;

    document.getElementById('storyPrev')?.addEventListener('click', () => renderStory(index - 1));
    document.getElementById('storyNext')?.addEventListener('click', () => renderStory(index + 1));
    document.getElementById('storyRandom')?.addEventListener('click', () => renderStory(Math.floor(Math.random() * names.length)));
    document.getElementById('storyListen')?.addEventListener('click', () => speak(name.arabic, 0.7));
  }

  // ==========================================================================
  // 8. PARTAGE SOCIAL
  // ==========================================================================
  function shareResult(data) {
    let text = '';
    if (data.type === 'quiz') {
      text = `J'ai obtenu ${data.score} points (${data.percent}%) au quiz des 99 Noms d'Allah sur Al-Asmaa ! Essayez aussi :`;
    } else if (data.type === 'daily') {
      text = `J'ai complété le défi quotidien Al-Asmaa ! Série : ${data.streak} jour(s). Noms appris : ${data.names.join(', ')}`;
    } else {
      text = `J'apprends les 99 Noms d'Allah avec Al-Asmaa !`;
    }

    const url = typeof SITE_URL !== 'undefined' ? SITE_URL : 'https://al-asmaa.app';

    if (navigator.share) {
      navigator.share({ title: 'Al-Asmaa — Les 99 Noms d\'Allah', text, url }).catch(() => {});
    } else {
      showShareModal(text, url);
    }
  }

  function showShareModal(text, url) {
    const encoded = encodeURIComponent(text + ' ' + url);
    const modal = document.getElementById('shareModal');
    if (!modal) return;

    document.getElementById('shareLinks').innerHTML = `
      <a href="https://wa.me/?text=${encoded}" target="_blank" rel="noopener" class="share-btn whatsapp">WhatsApp</a>
      <a href="https://twitter.com/intent/tweet?text=${encoded}" target="_blank" rel="noopener" class="share-btn twitter">Twitter / X</a>
      <a href="https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}" target="_blank" rel="noopener" class="share-btn telegram">Telegram</a>
      <button class="share-btn copy" id="shareCopyBtn">Copier le lien</button>`;

    modal.classList.remove('hidden');

    document.getElementById('shareCopyBtn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(text + ' ' + url).then(() => {
        document.getElementById('shareCopyBtn').textContent = 'Copié !';
      });
    });

    modal.querySelector('.modal-close')?.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
  }

  // ==========================================================================
  // 9. MODE ENFANT
  // ==========================================================================
  function toggleKidsMode() {
    isKidsMode = !isKidsMode;
    document.body.classList.toggle('kids-mode', isKidsMode);
    const btn = document.getElementById('kidsToggle');
    if (btn) btn.textContent = isKidsMode ? 'Mode Normal' : 'Mode Enfant';

    if (isKidsMode && currentMode) {
      switchMode(currentMode); // re-render with kids styling
    }
  }

  // ==========================================================================
  // PUBLIC API
  // ==========================================================================
  return {
    init,
    switchMode,
    initFlashcard,
    initQuiz,
    initListen,
    initDaily,
    renderProgress,
    initStory,
    shareResult,
    toggleKidsMode,
    getWeakNames
  };
})();
