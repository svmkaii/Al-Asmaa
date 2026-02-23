/**
 * Al-Asmaa — Main Application Logic
 */

const App = (() => {
  let settings = {
    sound: true,
    silentMode: false,
    colorblind: false,
    largeFont: false,
    language: 'fr',
    defaultDifficulty: 'intermediate'
  };

  let gameConfig = {
    players: [],
    mode: 'classic',
    difficulty: 'intermediate',
    lives: 3
  };

  let nameSearchList = []; // For quick name lookup via buttons

  // --- Settings management ---

  function loadSettings() {
    const saved = localStorage.getItem('al-asmaa-settings');
    if (saved) {
      Object.assign(settings, JSON.parse(saved));
    }
    applySettings();
  }

  function saveSettings() {
    localStorage.setItem('al-asmaa-settings', JSON.stringify(settings));
    applySettings();
  }

  function applySettings() {
    document.body.classList.toggle('colorblind', settings.colorblind);
    document.body.classList.toggle('large-font', settings.largeFont);
    UI.setLang(settings.language);
  }

  function getSettings() {
    return settings;
  }

  function updateSetting(key, value) {
    settings[key] = value;
    saveSettings();
  }

  // --- Page Navigation ---

  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(pageId);
    if (page) page.classList.add('active');
  }

  function goHome() {
    Bomb.stop();
    showPage('page-home');
    updateHomeScreen();
  }

  // --- Home Screen ---

  function updateHomeScreen() {
    const count = parseInt(localStorage.getItem('al-asmaa-community-count') || '0');
    const counterEl = document.getElementById('community-counter');
    if (counterEl) counterEl.textContent = count;

    // Update language-dependent text
    updateAllText();
  }

  function updateAllText() {
    document.querySelectorAll('[data-t]').forEach(el => {
      el.textContent = UI.t(el.dataset.t);
    });
  }

  // --- Player Setup ---

  function showPlayerSetup() {
    showPage('page-setup');
    gameConfig.players = [];
    renderPlayerSetup();
  }

  function renderPlayerSetup() {
    const container = document.getElementById('setup-players-list');
    if (!container) return;

    let html = '';
    gameConfig.players.forEach((name, i) => {
      html += `<span class="player-tag">${name} <span class="remove-player" onclick="App.removePlayer(${i})">&times;</span></span>`;
    });
    container.innerHTML = html;

    const startBtn = document.getElementById('btn-start-game');
    const modeInfo = Modes.getModeInfo()[gameConfig.mode];
    const minPlayers = modeInfo ? modeInfo.minPlayers : 2;
    if (startBtn) {
      startBtn.disabled = gameConfig.players.length < minPlayers;
      startBtn.style.opacity = gameConfig.players.length < minPlayers ? '0.4' : '1';
    }
  }

  function addPlayer() {
    const input = document.getElementById('player-name-input');
    if (!input) return;
    const name = input.value.trim();
    if (!name) return;
    if (gameConfig.players.length >= 8) {
      UI.showToast('Maximum 8 joueurs');
      return;
    }
    if (gameConfig.players.includes(name)) {
      UI.showToast('Ce nom existe déjà');
      return;
    }
    gameConfig.players.push(name);
    input.value = '';
    input.focus();
    renderPlayerSetup();
  }

  function removePlayer(index) {
    gameConfig.players.splice(index, 1);
    renderPlayerSetup();
  }

  // --- Mode Selection ---

  function showModeSelect() {
    showPage('page-mode-select');
    renderModeSelect();
  }

  function renderModeSelect() {
    const container = document.getElementById('mode-list');
    if (!container) return;

    const modes = Modes.getModeInfo();
    let html = '<ul class="menu-list">';
    Object.entries(modes).forEach(([key, info]) => {
      const selected = gameConfig.mode === key ? 'selected' : '';
      html += `<li class="menu-item ${selected}" onclick="App.selectMode('${key}')">
        <span class="menu-item-icon">${info.icon}</span>
        <div class="menu-item-text">
          <div class="menu-item-title">${UI.t(info.nameKey)}</div>
        </div>
      </li>`;
    });
    html += '</ul>';
    container.innerHTML = html;
  }

  function selectMode(mode) {
    gameConfig.mode = mode;
    renderModeSelect();

    // If solo learning, go straight
    if (mode === 'soloLearning') {
      gameConfig.players = ['Solo'];
      gameConfig.lives = 99;
      startGame();
      return;
    }

    // Show player setup
    showPlayerSetup();
  }

  // --- Difficulty Selection ---

  function setDifficulty(diff) {
    gameConfig.difficulty = diff;
    document.querySelectorAll('.diff-option').forEach(el => {
      el.classList.toggle('selected', el.dataset.diff === diff);
    });
  }

  function setLives(count) {
    gameConfig.lives = count;
    document.querySelectorAll('.life-option').forEach(el => {
      el.classList.toggle('selected', parseInt(el.dataset.lives) === count);
    });
  }

  // --- Game Start ---

  function startGame() {
    // Initialize audio context on user interaction
    try { Bomb.getAudioContext(); } catch (e) { /* ok */ }

    Players.setPlayers(gameConfig.players, gameConfig.lives);
    Modes.init(gameConfig.mode, gameConfig.difficulty);

    if (gameConfig.mode === 'soloLearning') {
      startSoloLearning();
      return;
    }

    showPage('page-game');
    startRound();
  }

  // --- Game Loop ---

  function startRound() {
    const state = Modes.getState();
    if (!state.isActive) return;

    // Check if all names used (victory)
    if (Modes.areAllNamesUsed()) {
      handleAllNamesUsed();
      return;
    }

    // Check game over
    if (state.mode !== 'team' && state.mode !== 'duel' && Players.isGameOver()) {
      endGame(false);
      return;
    }

    // Team game over
    if (state.mode === 'team' && Modes.isTeamGameOver()) {
      endGame(false);
      return;
    }

    // Duel game over
    if (state.mode === 'duel' && Modes.isDuelRoundOver()) {
      endGame(false);
      return;
    }

    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;

    // Render game UI
    renderGameUI(gameArea);

    // Start bomb timer
    const timerConfig = Modes.getTimerConfig();
    Bomb.start(timerConfig.min, timerConfig.max, () => {
      // Explosion!
      handleExplosion();
    });
  }

  function renderGameUI(gameArea) {
    const state = Modes.getState();
    const player = Players.getCurrentPlayer();
    const usedNames = Modes.getUsedNames();
    const diffSettings = Modes.getDifficultySettings();

    let html = '';

    // Game header
    html += `<div class="game-header">
      <div class="game-info">${UI.t(Modes.getModeInfo()[state.mode].nameKey)}</div>
      <div class="game-score">${UI.t('namesUsed')}: ${state.namesUsed.length}/99</div>
    </div>`;

    // Phase indicator (Infinite mode)
    if (state.mode === 'infinite') {
      html += `<div id="phase-area" class="text-center"></div>`;
    }

    // Players bar (not for duel/team)
    if (state.mode !== 'duel' && state.mode !== 'team') {
      html += `<div id="players-bar-area"></div>`;
    }

    // Team display
    if (state.mode === 'team') {
      html += `<div id="team-area"></div>`;
    }

    // Duel display
    if (state.mode === 'duel') {
      html += `<div id="duel-area"></div>`;
    }

    // Current player
    if (state.mode !== 'duel' && state.mode !== 'team') {
      html += `<div id="current-player-area"></div>`;
    }

    // Mode-specific displays
    if (state.mode === 'thematic') {
      html += `<div id="category-area"></div>`;
    }
    if (state.mode === 'alphabet' || (state.difficulty === 'ultimate' && state.mode !== 'quizReverse')) {
      html += `<div id="letter-area"></div>`;
    }
    if (state.mode === 'quizReverse') {
      html += `<div id="quiz-area"></div>`;
    }

    // Consultation bar (team mode)
    if (state.mode === 'team') {
      html += `<div id="consultation-area"></div>`;
    }

    // Bomb area
    html += `<div class="bomb-area">${Bomb.getBombHTML()}</div>`;

    // Action buttons
    html += `<div class="btn-group" id="action-buttons">`;
    if (state.mode === 'quizReverse') {
      // Show name selection for quiz
      html += renderNameSelector();
    } else {
      html += `<button class="btn btn-success" onclick="App.handleValidate()">&#10003; ${UI.t('validate')}</button>`;
      html += `<button class="btn btn-danger" onclick="App.handleFault()">&#10007; ${UI.t('fault')}</button>`;
    }
    html += `</div>`;

    // Challenge button (thematic)
    if (state.mode === 'thematic') {
      html += `<button class="btn btn-secondary btn-small mt-8" onclick="App.handleChallenge()">${UI.t('challenge')}</button>`;
    }

    // Names panel
    html += `<div id="names-panel-area"></div>`;

    gameArea.innerHTML = html;

    // Render sub-components
    if (state.mode !== 'duel' && state.mode !== 'team') {
      UI.renderPlayersBar(
        document.getElementById('players-bar-area'),
        Players.getPlayers(),
        Players.getCurrentIndex()
      );
      UI.renderCurrentPlayer(
        document.getElementById('current-player-area'),
        player
      );
    }

    if (state.mode === 'team') {
      UI.renderTeams(
        document.getElementById('team-area'),
        Players.getTeams(),
        Modes.getTeamScores(),
        Modes.getCurrentTeam()
      );
    }

    if (state.mode === 'duel') {
      const players = Players.getPlayers();
      UI.renderDuel(
        document.getElementById('duel-area'),
        [players[0], players[1]],
        Modes.getDuelFaults(),
        Players.getCurrentIndex()
      );
    }

    if (state.mode === 'thematic') {
      UI.renderCategory(document.getElementById('category-area'), state.currentCategory);
    }

    if (state.mode === 'alphabet') {
      UI.renderLetter(document.getElementById('letter-area'), state.currentLetter);
    }

    if (state.mode === 'quizReverse') {
      UI.renderQuiz(document.getElementById('quiz-area'), state.currentQuizName);
    }

    if (state.mode === 'infinite') {
      UI.renderPhaseIndicator(document.getElementById('phase-area'), state.infinitePhase);
    }

    UI.renderNamesPanel(
      document.getElementById('names-panel-area'),
      usedNames,
      diffSettings.hints
    );
  }

  function renderNameSelector() {
    const remaining = Modes.getRemainingNames();
    // Show a searchable list of names
    nameSearchList = remaining;
    let html = `<div style="width:100%">
      <input type="text" id="name-search" class="player-input-group"
        style="width:100%;padding:12px;margin-bottom:8px;border:2px solid rgba(201,168,76,0.3);border-radius:12px;background:rgba(255,255,255,0.08);color:#f5f0e8;font-size:1rem;"
        placeholder="Tapez le nom..." oninput="App.filterNameSearch(this.value)">
      <div id="name-search-results" style="max-height:150px;overflow-y:auto;">`;
    remaining.slice(0, 10).forEach(n => {
      html += `<button class="btn btn-small btn-secondary" style="margin:2px;display:inline-block;width:auto;"
        onclick="App.handleQuizSelect(${n.id})">${n.transliteration} <span style="font-family:'Amiri',serif;">${n.arabic}</span></button>`;
    });
    html += `</div></div>`;
    return html;
  }

  function filterNameSearch(query) {
    const results = document.getElementById('name-search-results');
    if (!results) return;
    query = query.toLowerCase();
    const filtered = nameSearchList.filter(n =>
      n.transliteration.toLowerCase().includes(query) ||
      n.arabic.includes(query) ||
      n.french.toLowerCase().includes(query) ||
      n.english.toLowerCase().includes(query)
    );
    let html = '';
    filtered.slice(0, 15).forEach(n => {
      html += `<button class="btn btn-small btn-secondary" style="margin:2px;display:inline-block;width:auto;"
        onclick="App.handleQuizSelect(${n.id})">${n.transliteration} <span style="font-family:'Amiri',serif;">${n.arabic}</span></button>`;
    });
    results.innerHTML = html;
  }

  // --- Game Actions ---

  function handleValidate() {
    Bomb.stop();
    Bomb.playCorrect();

    const state = Modes.getState();
    const player = Players.getCurrentPlayer();

    // In a real scenario, the group validates. We trust the human arbiters.
    // We need to pick which name was said. Show a name picker.
    showNamePicker((nameId) => {
      if (!nameId) {
        // Cancelled — restart bomb
        const timerConfig = Modes.getTimerConfig();
        Bomb.start(timerConfig.min, timerConfig.max, handleExplosion);
        return;
      }

      // Validate based on mode
      let validation;
      if (state.mode === 'thematic') {
        validation = Modes.validateThematicName(nameId);
      } else if (state.mode === 'alphabet') {
        validation = Modes.validateAlphabetName(nameId);
      } else {
        validation = Modes.validateName(nameId);
      }

      if (!validation.valid) {
        UI.showToast(validation.reason === 'repeat' ? 'Nom déjà cité !' : 'Nom invalide !');
        Bomb.playWrong();
        const timerConfig = Modes.getTimerConfig();
        Bomb.start(timerConfig.min, timerConfig.max, handleExplosion);
        return;
      }

      const name = Modes.getNameById(nameId);
      // Use the name
      Modes.useName(nameId, player);

      // Calculate score
      const score = Modes.calculateScore(Bomb.currentTime, Bomb.totalTime);
      Players.addScore(player, score);

      // Show name info briefly
      UI.showNamePopup(name, 1500);

      // Mode-specific post-validation
      if (state.mode === 'cascade') {
        Modes.decreaseCascadeTimer();
      }

      if (state.mode === 'thematic') {
        // Pick new category every few rounds
        if (state.roundNumber % 3 === 0) {
          Modes.pickRandomCategory();
        }
      }

      if (state.mode === 'alphabet') {
        Modes.pickRandomLetter();
      }

      if (state.mode === 'team') {
        Modes.teamCorrect();
        Modes.switchTeam();
      }

      if (state.mode === 'infinite' && Modes.areAllNamesUsed()) {
        if (state.infinitePhase < 5) {
          Modes.advanceInfinitePhase();
          // Re-init mode-specific stuff for new phase
          const newMode = Modes.getInfiniteModeForPhase();
          if (newMode === 'thematic') Modes.pickRandomCategory();
          if (newMode === 'alphabet') Modes.pickRandomLetter();
          if (newMode === 'quizReverse') Modes.pickQuizName();
        }
      }

      // Move to next player
      if (state.mode === 'duel') {
        // Switch between two duel players
        if (Players.getCurrentIndex() === 0) {
          Players.nextPlayer();
        } else {
          // Back to first
          while (Players.getCurrentIndex() !== 0) Players.nextPlayer();
        }
      } else if (state.mode !== 'team') {
        Players.nextPlayer();
      }

      // Flash correct
      const gameArea = document.getElementById('game-area');
      if (gameArea) gameArea.classList.add('correct-flash');
      setTimeout(() => { if (gameArea) gameArea.classList.remove('correct-flash'); }, 600);

      // Next round
      setTimeout(() => startRound(), 500);
    });
  }

  function handleFault() {
    Bomb.stop();
    Bomb.playWrong();

    const state = Modes.getState();
    const player = Players.getCurrentPlayer();

    if (state.mode === 'duel') {
      const pNum = Players.getCurrentIndex() === 0 ? 1 : 2;
      Modes.duelFault(pNum);

      // Switch player
      if (Players.getCurrentIndex() === 0) {
        Players.nextPlayer();
      } else {
        while (Players.getCurrentIndex() !== 0) Players.nextPlayer();
      }

      if (Modes.isDuelRoundOver()) {
        endGame(false);
        return;
      }
    } else if (state.mode === 'team') {
      Modes.switchTeam();
    } else if (state.mode === 'translation') {
      // Half point loss for wrong translation
      Players.addScore(player, -5);
      Players.nextPlayer();
    } else {
      Players.loseLife(player);

      if (Players.isGameOver()) {
        endGame(false);
        return;
      }

      Players.nextPlayer();
    }

    const gameArea = document.getElementById('game-area');
    if (gameArea) gameArea.classList.add('wrong-flash');
    setTimeout(() => { if (gameArea) gameArea.classList.remove('wrong-flash'); }, 600);

    setTimeout(() => startRound(), 500);
  }

  function handleExplosion() {
    const state = Modes.getState();
    const player = Players.getCurrentPlayer();

    // Get bomb position for particles
    const bombEl = document.querySelector('.bomb-container');
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    if (bombEl) {
      const rect = bombEl.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
    }

    Bomb.createExplosionParticles(cx, cy);

    if (state.mode === 'duel') {
      const pNum = Players.getCurrentIndex() === 0 ? 1 : 2;
      Modes.duelFault(pNum);

      if (Modes.isDuelRoundOver()) {
        setTimeout(() => endGame(false), 800);
        return;
      }

      if (Players.getCurrentIndex() === 0) {
        Players.nextPlayer();
      } else {
        while (Players.getCurrentIndex() !== 0) Players.nextPlayer();
      }
    } else if (state.mode === 'team') {
      Modes.switchTeam();
    } else if (state.mode === 'cascade') {
      // Cascade: first fault ends the game
      setTimeout(() => endGame(false), 800);
      return;
    } else {
      Players.loseLife(player);

      if (Players.isGameOver()) {
        setTimeout(() => endGame(false), 800);
        return;
      }

      Players.nextPlayer();
    }

    setTimeout(() => startRound(), 1000);
  }

  function handleChallenge() {
    const success = Modes.challengeCategory();
    if (success) {
      UI.showToast(UI.t('challenge') + ' - ' + UI.t('category') + ' !');
      const catArea = document.getElementById('category-area');
      if (catArea) {
        UI.renderCategory(catArea, Modes.getState().currentCategory);
      }
    } else {
      UI.showToast('Il reste des noms dans cette catégorie !');
    }
  }

  function handleQuizSelect(nameId) {
    Bomb.stop();
    const validation = Modes.validateQuizAnswer(nameId);
    if (validation.valid) {
      Bomb.playCorrect();
      const player = Players.getCurrentPlayer();
      const name = Modes.getNameById(nameId);
      Modes.useName(nameId, player);
      const score = Modes.calculateScore(Bomb.currentTime, Bomb.totalTime);
      Players.addScore(player, score);
      UI.showNamePopup(name, 1500);

      // Pick next quiz name
      Modes.pickQuizName();
      Players.nextPlayer();
      setTimeout(() => startRound(), 500);
    } else {
      Bomb.playWrong();
      UI.showToast('Mauvaise réponse !');
      if (validation.correct) {
        UI.showNamePopup(validation.correct, 2000);
      }
      Players.loseLife(Players.getCurrentPlayer());
      if (Players.isGameOver()) {
        setTimeout(() => endGame(false), 800);
        return;
      }
      Modes.pickQuizName();
      Players.nextPlayer();
      setTimeout(() => startRound(), 800);
    }
  }

  // --- Name Picker Modal ---

  function showNamePicker(callback) {
    const remaining = Modes.getRemainingNames();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <h3 class="card-title">${UI.t('name')}</h3>
        <input type="text" id="modal-name-search"
          style="width:100%;padding:10px;margin-bottom:12px;border:2px solid rgba(201,168,76,0.3);border-radius:12px;background:rgba(255,255,255,0.08);color:#f5f0e8;font-size:1rem;outline:none;"
          placeholder="Rechercher..." autofocus>
        <div id="modal-name-results" style="max-height:250px;overflow-y:auto;"></div>
        <button class="btn btn-secondary btn-small mt-16" id="modal-cancel">${UI.t('back')}</button>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));

    const searchInput = document.getElementById('modal-name-search');
    const resultsDiv = document.getElementById('modal-name-results');

    function renderResults(query) {
      let filtered = remaining;
      if (query) {
        query = query.toLowerCase();
        filtered = remaining.filter(n =>
          n.transliteration.toLowerCase().includes(query) ||
          n.arabic.includes(query) ||
          n.french.toLowerCase().includes(query) ||
          n.english.toLowerCase().includes(query)
        );
      }
      let html = '';
      filtered.slice(0, 20).forEach(n => {
        html += `<div class="menu-item" data-id="${n.id}" style="padding:10px 14px;margin-bottom:4px;">
          <span style="font-family:'Amiri',serif;font-size:1.2rem;color:var(--gold);min-width:80px;text-align:right;">${n.arabic}</span>
          <span style="flex:1;font-size:0.9rem;">${n.transliteration}</span>
        </div>`;
      });
      resultsDiv.innerHTML = html;

      // Click handlers
      resultsDiv.querySelectorAll('.menu-item').forEach(el => {
        el.addEventListener('click', () => {
          const id = parseInt(el.dataset.id);
          closeModal();
          callback(id);
        });
      });
    }

    renderResults('');

    searchInput.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });

    function closeModal() {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    }

    document.getElementById('modal-cancel').addEventListener('click', () => {
      closeModal();
      callback(null);
    });

    searchInput.focus();
  }

  // --- Handle all names used ---

  function handleAllNamesUsed() {
    const state = Modes.getState();
    Bomb.stop();

    if (state.mode === 'infinite' && state.infinitePhase < 5) {
      Modes.advanceInfinitePhase();
      UI.showToast(`Phase ${state.infinitePhase} !`);
      setTimeout(() => startRound(), 1500);
      return;
    }

    // Collective victory!
    Bomb.createVictoryAnimation();
    setTimeout(() => endGame(true), 3000);
  }

  // --- End Game ---

  function endGame(victory) {
    Bomb.stop();
    Modes.getState().isActive = false;

    const state = Modes.getState();
    const ranking = Players.getRanking();

    // Save result
    Modes.saveGameResult({
      mode: state.mode,
      difficulty: state.difficulty,
      players: ranking.map(p => ({ name: p.name, score: p.score, names: p.namesUsed.length })),
      namesUsed: state.namesUsed.length,
      victory: victory,
      rounds: state.roundNumber
    });

    showPage('page-game');
    const gameArea = document.getElementById('game-area');
    if (gameArea) {
      UI.renderEndScreen(gameArea, { victory });
    }
  }

  // --- Replay ---

  function replayGame() {
    Players.reset();
    startGame();
  }

  // --- Solo Learning ---

  function startSoloLearning() {
    gameConfig.mode = 'soloLearning';
    gameConfig.difficulty = 'beginner';
    gameConfig.players = ['Solo'];
    gameConfig.lives = 99;

    Players.setPlayers(['Solo'], 99);
    Modes.init('soloLearning', 'beginner');

    showPage('page-learn');
    renderSoloLearning();
  }

  function renderSoloLearning() {
    const container = document.getElementById('learn-area');
    if (!container) return;

    const name = Modes.getSoloCurrentName();
    const progress = Modes.getSoloProgress();
    const state = Modes.getState();

    if (!name) {
      // Done
      UI.renderSoloEndScreen(container);
      return;
    }

    let html = `
      <div class="game-header">
        <button class="btn btn-small btn-secondary" onclick="App.goHome()">${UI.t('back')}</button>
        <div class="game-score">${progress.current + 1}/99</div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width:${((progress.current) / 99) * 100}%"></div>
      </div>
    `;

    if (state.soloPhase === 'view') {
      // Show the name
      html += `<div id="flashcard-area"></div>`;
      html += `<div class="btn-group mt-16">
        <button class="btn btn-primary" onclick="App.soloStartRecall()">${UI.t('next')} &rarr;</button>
      </div>`;
    } else {
      // Recall phase: bomb is running, need to remember
      html += `<div class="text-center mb-16">
        <p style="font-size:1.1rem;font-weight:500;color:var(--gold);">Quel était le nom #${name.id} ?</p>
        <p style="font-size:0.85rem;opacity:0.7;">${name.description}</p>
      </div>`;
      html += `<div class="bomb-area">${Bomb.getBombHTML()}</div>`;
      html += `<div class="btn-group mt-16">
        <button class="btn btn-success" onclick="App.soloRecallCorrect()">&#10003; ${UI.t('validate')}</button>
        <button class="btn btn-danger" onclick="App.soloRecallWrong()">&#10007; ${UI.t('fault')}</button>
      </div>`;
    }

    container.innerHTML = html;

    if (state.soloPhase === 'view') {
      UI.renderFlashcard(document.getElementById('flashcard-area'), name, 'view');
    } else {
      // Start bomb for recall
      Bomb.start(5, 10, () => {
        // Time's up — count as wrong
        soloRecallWrong();
      });
    }
  }

  function soloStartRecall() {
    Modes.setSoloPhase('recall');
    renderSoloLearning();
  }

  function soloRecallCorrect() {
    Bomb.stop();
    Bomb.playCorrect();
    Modes.soloCorrect();
    Modes.soloNext();
    Modes.setSoloPhase('view');
    renderSoloLearning();
  }

  function soloRecallWrong() {
    Bomb.stop();
    Bomb.playWrong();
    const name = Modes.getSoloCurrentName();
    if (name) {
      UI.showNamePopup(name, 2000);
    }
    Modes.soloNext();
    Modes.setSoloPhase('view');
    setTimeout(() => renderSoloLearning(), 1000);
  }

  // --- Learn Missed Names ---

  function learnMissedNames() {
    const missed = Modes.getRemainingNames();
    if (missed.length === 0) return;

    showPage('page-learn');
    const container = document.getElementById('learn-area');
    if (!container) return;

    let currentIdx = 0;

    function render() {
      if (currentIdx >= missed.length) {
        container.innerHTML = `
          <div class="text-center mt-24">
            <h2 class="text-gold">${UI.t('victory')}</h2>
            <p class="mt-16">Tous les noms manqués ont été révisés !</p>
            <button class="btn btn-primary mt-24" onclick="App.goHome()">${UI.t('mainMenu')}</button>
          </div>`;
        return;
      }

      const name = missed[currentIdx];
      let html = `
        <div class="game-header">
          <button class="btn btn-small btn-secondary" onclick="App.goHome()">${UI.t('back')}</button>
          <div class="game-score">${currentIdx + 1}/${missed.length}</div>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width:${((currentIdx) / missed.length) * 100}%"></div>
        </div>
        <div id="flashcard-area"></div>
        <div class="btn-group mt-16">
          <button class="btn btn-primary" id="btn-next-missed">${UI.t('next')} &rarr;</button>
        </div>
      `;
      container.innerHTML = html;
      UI.renderFlashcard(document.getElementById('flashcard-area'), name, 'view');
      document.getElementById('btn-next-missed').addEventListener('click', () => {
        currentIdx++;
        render();
      });
    }

    render();
  }

  // --- Score sharing ---

  function shareScore() {
    UI.generateShareImage((blob) => {
      if (!blob) {
        UI.showToast('Erreur lors de la génération');
        return;
      }

      // Try Web Share API first
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], 'al-asmaa-score.png', { type: 'image/png' });
        navigator.share({
          title: 'Al-Asmaa Score',
          files: [file]
        }).catch(() => {
          // Fallback: download
          downloadBlob(blob);
        });
      } else {
        downloadBlob(blob);
      }
    });
  }

  function downloadBlob(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'al-asmaa-score.png';
    a.click();
    URL.revokeObjectURL(url);
    UI.showToast('Image téléchargée !');
  }

  // --- Settings Page ---

  function showSettings() {
    showPage('page-settings');
    renderSettings();
  }

  function renderSettings() {
    const container = document.getElementById('settings-area');
    if (!container) return;

    let html = `
      <div class="game-header">
        <button class="btn btn-small btn-secondary" onclick="App.goHome()">${UI.t('back')}</button>
        <div class="game-info">${UI.t('settings')}</div>
      </div>

      <div class="card">
        <div class="settings-row">
          <span>${UI.t('language')}</span>
          <select class="select-custom" onchange="App.updateSetting('language', this.value); App.renderSettings(); App.updateAllText();">
            <option value="fr" ${settings.language === 'fr' ? 'selected' : ''}>Français</option>
            <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
            <option value="ar" ${settings.language === 'ar' ? 'selected' : ''}>العربية</option>
          </select>
        </div>

        <div class="settings-row">
          <span>${UI.t('sound')}</span>
          <label class="toggle">
            <input type="checkbox" ${settings.sound ? 'checked' : ''}
              onchange="App.updateSetting('sound', this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="settings-row">
          <span>${UI.t('silentMode')}</span>
          <label class="toggle">
            <input type="checkbox" ${settings.silentMode ? 'checked' : ''}
              onchange="App.updateSetting('silentMode', this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="settings-row">
          <span>${UI.t('colorblind')}</span>
          <label class="toggle">
            <input type="checkbox" ${settings.colorblind ? 'checked' : ''}
              onchange="App.updateSetting('colorblind', this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="settings-row">
          <span>${UI.t('largeFont')}</span>
          <label class="toggle">
            <input type="checkbox" ${settings.largeFont ? 'checked' : ''}
              onchange="App.updateSetting('largeFont', this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="settings-row">
          <span>${UI.t('difficultyDefault')}</span>
          <select class="select-custom" onchange="App.updateSetting('defaultDifficulty', this.value)">
            <option value="beginner" ${settings.defaultDifficulty === 'beginner' ? 'selected' : ''}>${UI.t('beginner')}</option>
            <option value="intermediate" ${settings.defaultDifficulty === 'intermediate' ? 'selected' : ''}>${UI.t('intermediate')}</option>
            <option value="expert" ${settings.defaultDifficulty === 'expert' ? 'selected' : ''}>${UI.t('expert')}</option>
            <option value="ultimate" ${settings.defaultDifficulty === 'ultimate' ? 'selected' : ''}>${UI.t('ultimate')}</option>
          </select>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  // --- Scores Page ---

  function showScores() {
    showPage('page-scores');
    renderScores();
  }

  function renderScores() {
    const container = document.getElementById('scores-area');
    if (!container) return;

    const history = Modes.getGameHistory();
    const playerStats = Players.getAllPlayerStats();

    let html = `
      <div class="game-header">
        <button class="btn btn-small btn-secondary" onclick="App.goHome()">${UI.t('back')}</button>
        <div class="game-info">${UI.t('scores')}</div>
      </div>

      <div class="tabs">
        <button class="tab active" onclick="App.showScoreTab('history', this)">${UI.t('history')}</button>
        <button class="tab" onclick="App.showScoreTab('stats', this)">${UI.t('stats')}</button>
      </div>

      <div id="score-tab-history">`;

    if (history.length === 0) {
      html += '<div class="text-center mt-24" style="opacity:0.5;">Aucune partie jouée</div>';
    } else {
      history.forEach((game, i) => {
        const date = new Date(game.date);
        const dateStr = date.toLocaleDateString();
        const modeInfo = Modes.getModeInfo()[game.mode];
        html += `<div class="score-entry">
          <div class="score-rank">${i + 1}</div>
          <div class="score-details">
            <div class="score-mode">${modeInfo ? modeInfo.icon + ' ' + UI.t(modeInfo.nameKey) : game.mode}</div>
            <div class="score-players">${game.players.map(p => p.name).join(', ')}</div>
            <div class="score-date">${dateStr} — ${game.namesUsed}/99 noms${game.victory ? ' ✨' : ''}</div>
          </div>
          <div class="score-value">${game.players[0] ? game.players[0].score : 0}</div>
        </div>`;
      });
    }

    html += `</div>
      <div id="score-tab-stats" class="hidden">`;

    const statEntries = Object.entries(playerStats);
    if (statEntries.length === 0) {
      html += '<div class="text-center mt-24" style="opacity:0.5;">Aucune statistique</div>';
    } else {
      statEntries.forEach(([name, stats]) => {
        const pct = Math.round((stats.namesSet.length / 99) * 100);
        html += `<div class="card">
          <div class="card-title">${name}</div>
          <div style="font-size:0.9rem;">${UI.t('stats')} : ${stats.gamesPlayed} parties</div>
          <div class="progress-bar-container mt-8">
            <div class="progress-bar-fill" style="width:${pct}%"></div>
          </div>
          <div class="progress-text">${stats.namesSet.length}/99 ${UI.t('namesUsed')} (${pct}%)</div>
        </div>`;
      });
    }

    // Hafidh badge
    if (localStorage.getItem('al-asmaa-hafidh') === 'true') {
      html += `<div class="text-center mt-16">
        <div class="badge">
          <span class="badge-icon">🏆</span>
          <span>${UI.t('hafidh')}</span>
        </div>
      </div>`;
    }

    html += '</div>';
    container.innerHTML = html;
  }

  function showScoreTab(tab, el) {
    document.getElementById('score-tab-history').classList.toggle('hidden', tab !== 'history');
    document.getElementById('score-tab-stats').classList.toggle('hidden', tab !== 'stats');
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
  }

  // --- Init ---

  function init() {
    loadSettings();
    UI.initLang();
    updateHomeScreen();
    showPage('page-home');

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  // Expose public API
  return {
    init,
    getSettings,
    updateSetting,
    goHome,
    showModeSelect,
    showPlayerSetup,
    selectMode,
    addPlayer,
    removePlayer,
    setDifficulty,
    setLives,
    startGame,
    handleValidate,
    handleFault,
    handleChallenge,
    handleQuizSelect,
    filterNameSearch,
    replayGame,
    startSoloLearning,
    learnMissedNames,
    shareScore,
    showSettings,
    showScores,
    showScoreTab,
    soloStartRecall,
    soloRecallCorrect,
    soloRecallWrong,
    renderSettings,
    updateAllText,
    showPage
  };
})();
