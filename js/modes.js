/**
 * Al-Asmaa — Game Modes (all 10)
 */

const Modes = (() => {
  // Shared game state
  let state = {
    mode: 'classic',
    difficulty: 'intermediate',
    namesUsed: [],       // IDs of names already used
    namesAvailable: [],  // IDs of names still available
    roundNumber: 0,
    isActive: false,
    currentCategory: null,
    currentLetter: null,
    currentQuizName: null,
    cascadeTimer: 15,
    infinitePhase: 1,
    duelScore: { p1: 0, p2: 0 },
    duelFaults: { p1: 0, p2: 0 },
    duelBestOf: 5,
    duelMaxFaults: 3,
    teamScores: [0, 0],
    currentTeam: 0,
    consultationTime: 10,
    isConsulting: false,
    soloCorrect: 0,
    soloTotal: 0,
    soloCurrentIndex: 0,
    soloPhase: 'view', // 'view' or 'recall'
    timerConfig: { min: 7, max: 12 }
  };

  const DIFFICULTY_SETTINGS = {
    beginner:     { min: 12, max: 20, hints: true,  translation: false },
    intermediate: { min: 7,  max: 12, hints: false, translation: false },
    expert:       { min: 3,  max: 7,  hints: false, translation: true },
    ultimate:     { min: 2,  max: 15, hints: false, translation: true, alphabet: true }
  };

  const MODE_INFO = {
    classic:      { icon: '💣', nameKey: 'classic',      minPlayers: 2 },
    translation:  { icon: '📝', nameKey: 'translation',  minPlayers: 2 },
    thematic:     { icon: '🎯', nameKey: 'thematic',     minPlayers: 2 },
    duel:         { icon: '⚔️', nameKey: 'duel',         minPlayers: 2, maxPlayers: 8 },
    alphabet:     { icon: '🔤', nameKey: 'alphabet',     minPlayers: 2 },
    cascade:      { icon: '🌊', nameKey: 'cascade',      minPlayers: 2 },
    quizReverse:  { icon: '❓', nameKey: 'quizReverse',  minPlayers: 2 },
    team:         { icon: '👥', nameKey: 'team',         minPlayers: 4 },
    infinite:     { icon: '♾️', nameKey: 'infinite',      minPlayers: 2 },
    soloLearning: { icon: '📚', nameKey: 'soloLearning', minPlayers: 1, maxPlayers: 1 }
  };

  function getModeInfo() { return MODE_INFO; }
  function getState() { return state; }

  function init(mode, difficulty) {
    state.mode = mode;
    state.difficulty = difficulty;
    state.namesUsed = [];
    state.namesAvailable = ASMA_UL_HUSNA.map(n => n.id);
    state.roundNumber = 0;
    state.isActive = true;
    state.cascadeTimer = 15;
    state.infinitePhase = 1;
    state.duelScore = { p1: 0, p2: 0 };
    state.duelFaults = { p1: 0, p2: 0 };
    state.teamScores = [0, 0];
    state.currentTeam = 0;
    state.soloCorrect = 0;
    state.soloTotal = 0;
    state.soloCurrentIndex = 0;
    state.soloPhase = 'view';
    state.isConsulting = false;

    const diff = DIFFICULTY_SETTINGS[difficulty];
    state.timerConfig = { min: diff.min, max: diff.max };

    // Force alphabet mode in ultimate difficulty
    if (difficulty === 'ultimate' && mode !== 'soloLearning') {
      // Keep chosen mode but layer alphabet constraint
    }

    if (mode === 'thematic') {
      pickRandomCategory();
    }
    if (mode === 'alphabet') {
      pickRandomLetter();
    }
    if (mode === 'quizReverse') {
      pickQuizName();
    }
    if (mode === 'team') {
      Players.createTeams();
    }
    if (mode === 'duel') {
      state.duelFaults = { p1: 0, p2: 0 };
    }
  }

  // --- Name validation ---

  function validateName(nameId) {
    if (state.namesUsed.includes(nameId)) return { valid: false, reason: 'repeat' };
    if (!state.namesAvailable.includes(nameId)) return { valid: false, reason: 'invalid' };
    return { valid: true };
  }

  function useName(nameId, playerObj) {
    state.namesUsed.push(nameId);
    state.namesAvailable = state.namesAvailable.filter(id => id !== nameId);
    state.roundNumber++;

    if (playerObj) {
      Players.addNameUsed(playerObj, nameId);
    }

    // Update community counter
    const count = parseInt(localStorage.getItem('al-asmaa-community-count') || '0');
    localStorage.setItem('al-asmaa-community-count', count + 1);
  }

  function areAllNamesUsed() {
    return state.namesAvailable.length === 0;
  }

  function getNameById(id) {
    return ASMA_UL_HUSNA.find(n => n.id === id);
  }

  function getRemainingNames() {
    return ASMA_UL_HUSNA.filter(n => state.namesAvailable.includes(n.id));
  }

  function getUsedNames() {
    return state.namesUsed.map(id => getNameById(id)).filter(Boolean);
  }

  // --- Mode-specific logic ---

  // THEMATIC
  function pickRandomCategory() {
    const cats = Object.keys(CATEGORIES);
    state.currentCategory = cats[Math.floor(Math.random() * cats.length)];
    return state.currentCategory;
  }

  function validateThematicName(nameId) {
    const name = getNameById(nameId);
    if (!name) return { valid: false, reason: 'invalid' };
    if (state.namesUsed.includes(nameId)) return { valid: false, reason: 'repeat' };
    if (name.category !== state.currentCategory) return { valid: false, reason: 'wrong_category' };
    return { valid: true };
  }

  function getCategoryNamesRemaining() {
    return ASMA_UL_HUSNA.filter(n =>
      n.category === state.currentCategory && state.namesAvailable.includes(n.id)
    );
  }

  function challengeCategory() {
    if (getCategoryNamesRemaining().length === 0) {
      pickRandomCategory();
      return true;
    }
    return false;
  }

  // ALPHABET
  function pickRandomLetter() {
    // Only pick letters that have available names
    const availableLetters = ARABIC_LETTERS.filter(l => {
      return ASMA_UL_HUSNA.some(n =>
        state.namesAvailable.includes(n.id) && n.arabic.includes(l.letter)
      );
    });
    if (availableLetters.length === 0) {
      state.currentLetter = null;
      return null;
    }
    const pick = availableLetters[Math.floor(Math.random() * availableLetters.length)];
    state.currentLetter = pick;
    return pick;
  }

  function validateAlphabetName(nameId) {
    const name = getNameById(nameId);
    if (!name) return { valid: false, reason: 'invalid' };
    if (state.namesUsed.includes(nameId)) return { valid: false, reason: 'repeat' };
    if (!state.currentLetter) return { valid: false, reason: 'no_letter' };
    // Check if the Arabic name contains the required letter
    if (!name.arabic.includes(state.currentLetter.letter)) {
      return { valid: false, reason: 'wrong_letter' };
    }
    return { valid: true };
  }

  function getLetterNamesRemaining() {
    if (!state.currentLetter) return [];
    return ASMA_UL_HUSNA.filter(n =>
      state.namesAvailable.includes(n.id) && n.arabic.includes(state.currentLetter.letter)
    );
  }

  // CASCADE
  function getCascadeTimer() {
    return state.cascadeTimer;
  }

  function decreaseCascadeTimer() {
    state.cascadeTimer = Math.max(2, state.cascadeTimer - 1);
    return state.cascadeTimer;
  }

  function getCascadeTimerConfig() {
    const t = state.cascadeTimer;
    return { min: t, max: t };
  }

  // QUIZ INVERSE
  function pickQuizName() {
    if (state.namesAvailable.length === 0) {
      state.currentQuizName = null;
      return null;
    }
    const randomId = state.namesAvailable[Math.floor(Math.random() * state.namesAvailable.length)];
    state.currentQuizName = getNameById(randomId);
    return state.currentQuizName;
  }

  function validateQuizAnswer(answerId) {
    if (!state.currentQuizName) return { valid: false, reason: 'no_quiz' };
    if (answerId === state.currentQuizName.id) return { valid: true };
    return { valid: false, reason: 'wrong_answer', correct: state.currentQuizName };
  }

  // DUEL
  function duelFault(playerNum) {
    if (playerNum === 1) state.duelFaults.p1++;
    else state.duelFaults.p2++;
    return state.duelFaults;
  }

  function getDuelFaults() { return state.duelFaults; }

  function isDuelRoundOver() {
    return state.duelFaults.p1 >= state.duelMaxFaults || state.duelFaults.p2 >= state.duelMaxFaults;
  }

  function getDuelWinner() {
    if (state.duelFaults.p1 >= state.duelMaxFaults) return 2;
    if (state.duelFaults.p2 >= state.duelMaxFaults) return 1;
    return 0;
  }

  // TEAM
  function getCurrentTeam() { return state.currentTeam; }
  function getTeamScores() { return state.teamScores; }

  function teamCorrect() {
    state.teamScores[state.currentTeam]++;
    return state.teamScores;
  }

  function switchTeam() {
    state.currentTeam = state.currentTeam === 0 ? 1 : 0;
    return state.currentTeam;
  }

  function isTeamGameOver() {
    return state.teamScores[0] >= 10 || state.teamScores[1] >= 10;
  }

  function getTeamWinner() {
    if (state.teamScores[0] >= 10) return 0;
    if (state.teamScores[1] >= 10) return 1;
    return -1;
  }

  function startConsultation(callback) {
    state.isConsulting = true;
    let remaining = state.consultationTime;
    const interval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(interval);
        state.isConsulting = false;
        if (callback) callback();
      }
      const bar = document.querySelector('.consultation-fill');
      if (bar) {
        bar.style.width = ((remaining / state.consultationTime) * 100) + '%';
      }
    }, 1000);
    return interval;
  }

  // INFINITE
  function getInfinitePhase() { return state.infinitePhase; }

  function advanceInfinitePhase() {
    state.infinitePhase++;
    state.namesUsed = [];
    state.namesAvailable = ASMA_UL_HUSNA.map(n => n.id);
    return state.infinitePhase;
  }

  function getInfinitePhaseDescription(lang) {
    const descriptions = {
      fr: [
        '', // 0
        'Phase 1 : Les 99 noms classiques',
        'Phase 2 : Les 99 noms avec traduction',
        'Phase 3 : Par catégorie',
        'Phase 4 : Quiz inversé',
        'Phase 5 : Alphabet (3s)'
      ],
      en: [
        '',
        'Phase 1: Classic 99 Names',
        'Phase 2: 99 Names + Translation',
        'Phase 3: By Category',
        'Phase 4: Reverse Quiz',
        'Phase 5: Alphabet (3s)'
      ]
    };
    const d = descriptions[lang] || descriptions.fr;
    return d[Math.min(state.infinitePhase, 5)] || d[5];
  }

  function getInfiniteModeForPhase() {
    switch (state.infinitePhase) {
      case 1: return 'classic';
      case 2: return 'translation';
      case 3: return 'thematic';
      case 4: return 'quizReverse';
      case 5: return 'alphabet';
      default: return 'alphabet';
    }
  }

  function getInfiniteTimerConfig() {
    if (state.infinitePhase >= 5) return { min: 3, max: 3 };
    return state.timerConfig;
  }

  // SOLO LEARNING
  function getSoloCurrentName() {
    if (state.soloCurrentIndex >= ASMA_UL_HUSNA.length) return null;
    return ASMA_UL_HUSNA[state.soloCurrentIndex];
  }

  function soloNext() {
    state.soloCurrentIndex++;
    state.soloPhase = 'view';
    state.soloTotal++;
    return getSoloCurrentName();
  }

  function soloCorrect() {
    state.soloCorrect++;
  }

  function getSoloProgress() {
    return {
      current: state.soloCurrentIndex,
      total: 99,
      correct: state.soloCorrect,
      percentage: Math.round((state.soloCorrect / Math.max(1, state.soloTotal)) * 100)
    };
  }

  function setSoloPhase(phase) {
    state.soloPhase = phase;
  }

  // --- Timer helpers ---

  function getTimerConfig() {
    if (state.mode === 'cascade') return getCascadeTimerConfig();
    if (state.mode === 'infinite') return getInfiniteTimerConfig();
    if (state.mode === 'duel') {
      const diff = DIFFICULTY_SETTINGS[state.difficulty];
      return { min: Math.max(3, diff.min), max: Math.min(6, diff.max) };
    }
    return state.timerConfig;
  }

  function getDifficultySettings() {
    return DIFFICULTY_SETTINGS[state.difficulty];
  }

  // --- Score calculation ---

  function calculateScore(timeRemaining, totalTime) {
    const timeBonus = Math.round((timeRemaining / totalTime) * 100);
    const baseScore = 10;
    return baseScore + timeBonus;
  }

  // --- Save game result ---

  function saveGameResult(result) {
    const history = JSON.parse(localStorage.getItem('al-asmaa-history') || '[]');
    result.date = new Date().toISOString();
    result.id = Date.now();
    history.unshift(result);
    // Keep last 20 games
    if (history.length > 20) history.pop();
    localStorage.setItem('al-asmaa-history', JSON.stringify(history));

    // Save per-player stats
    Players.getPlayers().forEach(p => {
      Players.savePlayerStats(p.name);
    });
  }

  function getGameHistory() {
    return JSON.parse(localStorage.getItem('al-asmaa-history') || '[]');
  }

  return {
    getModeInfo,
    getState,
    init,
    validateName,
    useName,
    areAllNamesUsed,
    getNameById,
    getRemainingNames,
    getUsedNames,
    // Thematic
    pickRandomCategory,
    validateThematicName,
    getCategoryNamesRemaining,
    challengeCategory,
    // Alphabet
    pickRandomLetter,
    validateAlphabetName,
    getLetterNamesRemaining,
    // Cascade
    getCascadeTimer,
    decreaseCascadeTimer,
    getCascadeTimerConfig,
    // Quiz
    pickQuizName,
    validateQuizAnswer,
    // Duel
    duelFault,
    getDuelFaults,
    isDuelRoundOver,
    getDuelWinner,
    // Team
    getCurrentTeam,
    getTeamScores,
    teamCorrect,
    switchTeam,
    isTeamGameOver,
    getTeamWinner,
    startConsultation,
    // Infinite
    getInfinitePhase,
    advanceInfinitePhase,
    getInfinitePhaseDescription,
    getInfiniteModeForPhase,
    getInfiniteTimerConfig,
    // Solo
    getSoloCurrentName,
    soloNext,
    soloCorrect,
    getSoloProgress,
    setSoloPhase,
    // Helpers
    getTimerConfig,
    getDifficultySettings,
    calculateScore,
    saveGameResult,
    getGameHistory,
    DIFFICULTY_SETTINGS
  };
})();
