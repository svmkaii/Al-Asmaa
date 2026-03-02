/**
 * Ilm Quest — Jeu de quiz islamique multijoueur
 * Utilise Socket.io pour le multijoueur cross-device + BroadcastChannel en bonus
 */
const IlmQuest = (() => {
  'use strict';

  // --- État du jeu ---
  let state = {
    phase: 'lobby', // 'lobby' | 'playing' | 'reveal' | 'results'
    roomCode: '',
    isHost: false,
    playerId: '',
    playerName: '',
    players: [],
    difficulty: 'mixte',
    targetScore: 5000,
    maxPlayers: 8,
    visibility: 'private',
    questions: [],
    currentQuestionIndex: 0,
    currentQuestion: null,
    timerTotal: 30,
    timerRemaining: 30,
    timerInterval: null,
    answers: {},       // { playerId: { answerIndex, time } }
    scores: {},        // { playerId: score }
    streaks: {},       // { playerId: streak }
    revealTimeout: null,
    autoNextTimeout: null,
    channel: null,
    socket: null,
    winner: null,
    iqParticlesAnimId: null
  };

  // --- Constantes ---
  const TIMER_DURATION = 30;
  const POINTS_TABLE = [
    { max: 5, points: 1000 },
    { max: 10, points: 800 },
    { max: 20, points: 600 },
    { max: 30, points: 300 }
  ];
  const STREAK_BONUS = 100;
  const ROOM_CODE_LENGTH = 6;
  const AUTO_NEXT_DELAY = 5000;

  // --- Utilitaires ---
  function generateId() {
    return Math.random().toString(36).substring(2, 10);
  }

  function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  function getInitials(name) {
    return name.substring(0, 2).toUpperCase();
  }

  function getPlayerColor(index) {
    const colors = ['#d4a24c', '#2dd4a0', '#60a5fa', '#ef4444', '#a78bfa', '#f59e0b', '#ec4899', '#14b8a6'];
    return colors[index % colors.length];
  }

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function calculatePoints(timeSpent) {
    for (const tier of POINTS_TABLE) {
      if (timeSpent <= tier.max) return tier.points;
    }
    return 100;
  }

  function filterQuestions(difficulty) {
    let pool = [...ILM_QUEST_QUESTIONS];
    if (difficulty !== 'mixte') {
      pool = pool.filter(q => q.difficulty === difficulty);
    }
    return shuffleArray(pool);
  }

  // --- Socket.io + BroadcastChannel ---
  function initChannel(code) {
    // BroadcastChannel (same-browser bonus)
    if (state.channel) state.channel.close();
    try {
      state.channel = new BroadcastChannel('ilm-quest-' + code);
      state.channel.onmessage = (e) => handleMessage(e.data);
    } catch (err) { state.channel = null; }

    // Socket.io — dedicated /iq namespace (isolated from main app socket)
    if (state.socket) {
      state.socket.off('iq-message');
      state.socket.emit('iq-leave');
    }
    state.socket = io('/iq');
    console.log('[IQ Socket] /iq socket, connected:', state.socket.connected, 'id:', state.socket.id);
    // Reconnect if previously disconnected (io() caches per namespace)
    if (state.socket.disconnected) {
      console.log('[IQ Socket] Reconnecting...');
      state.socket.connect();
    }

    function doJoin() {
      if (!state.socket || !state.roomCode) return;
      console.log('[IQ Socket] doJoin, connected:', state.socket.connected, 'room:', state.roomCode);
      state.socket.emit('iq-join', {
        code: state.roomCode,
        playerId: state.playerId,
        playerName: state.playerName,
        isHost: state.isHost
      }, (res) => {
        if (res && res.error) console.warn('[IQ Socket] join error:', res.error);
        else console.log('[IQ Socket] joined room OK');
      });
    }

    // Join on every (re)connect — ensures room membership is restored
    state.socket.off('connect');
    state.socket.on('connect', () => {
      console.log('[IQ Socket] Connected, id:', state.socket.id);
      doJoin();
    });
    state.socket.off('connect_error');
    state.socket.on('connect_error', (err) => {
      console.error('[IQ Socket] Connection error:', err.message);
    });

    // If already connected, join immediately
    if (state.socket.connected) doJoin();

    state.socket.off('iq-message');
    state.socket.on('iq-message', (msg) => handleMessage(msg));
  }

  function broadcast(msg) {
    console.log('[IQ Broadcast]', msg.type, state.isHost ? '(host)' : '(guest)');
    // Socket.io (primary — cross-device)
    if (state.socket) state.socket.emit('iq-broadcast', msg);
    // BroadcastChannel (bonus — same-browser)
    if (state.channel) {
      try { state.channel.postMessage(msg); } catch (e) {}
    }
  }

  function handleMessage(msg) {
    if (!msg || !msg.type) return;
    console.log('[IQ Received]', msg.type, state.isHost ? '(host)' : '(guest)');

    switch (msg.type) {
      case 'player-join':
        if (state.isHost) handlePlayerJoin(msg);
        break;
      case 'player-list':
        if (!state.isHost) {
          state.players = msg.players;
          state.scores = msg.scores || {};
          state.streaks = msg.streaks || {};
          renderLobbyPlayers();
        }
        break;
      case 'game-start':
        if (state.isHost) break; // Host already started
        if (state.phase === 'playing') break; // Already in game (via polling)
        stopPlayerPolling();
        state.questions = msg.questions;
        state.targetScore = msg.targetScore;
        state.difficulty = msg.difficulty;
        state.phase = 'playing';
        state.currentQuestionIndex = 0;
        state.players.forEach(p => {
          state.scores[p.id] = 0;
          state.streaks[p.id] = 0;
        });
        showIlmQuestGame();
        loadQuestion(0);
        startGamePolling();
        break;
      case 'answer':
        if (state.isHost) handleRemoteAnswer(msg);
        break;
      case 'answers-update':
        if (!state.isHost) {
          state.answers = msg.answers;
          renderPlayerAnswerStatus();
          // Show "all answered" feedback on guest too
          if (msg.allAnswered) {
            clearInterval(state.timerInterval);
          }
        }
        break;
      case 'reveal':
        clearTimeout(state._revealFallback);
        state.answers = msg.answers;
        state.scores = msg.scores;
        state.streaks = msg.streaks;
        doReveal();
        break;
      case 'request-reveal':
        // Guest requested reveal (fallback) — host re-sends if in reveal phase
        if (state.isHost && state.phase === 'reveal') {
          broadcast({
            type: 'reveal',
            answers: state.answers,
            scores: state.scores,
            streaks: state.streaks
          });
        }
        break;
      case 'next-question':
        state.currentQuestionIndex = msg.questionIndex;
        loadQuestion(msg.questionIndex);
        break;
      case 'game-over':
        state.winner = msg.winner;
        state.scores = msg.scores;
        state.streaks = msg.streaks;
        state.phase = 'results';
        showIlmQuestResults();
        break;
      case 'player-leave':
        state.players = state.players.filter(p => p.id !== msg.playerId);
        if (state.phase === 'lobby') renderLobbyPlayers();
        break;
      case 'host-left':
        if (!state.isHost) handleHostLeft();
        break;
      case 'player-left-game':
        handlePlayerLeftGame({ id: msg.playerId, name: msg.playerName });
        break;
      case 'host-config':
        if (!state.isHost) {
          state.difficulty = msg.difficulty;
          state.targetScore = msg.targetScore;
        }
        break;
      case 'join-rejected':
        if (!state.isHost && msg.targetId === state.playerId) {
          if (typeof Bomb !== 'undefined') Bomb.showToast('Partie déjà en cours', 'warning');
          leaveGame();
          history.replaceState({}, '', '/');
          document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
          const home = document.getElementById('pageHome');
          if (home) home.classList.add('active');
        }
        break;
    }
  }

  // --- Gestion des joueurs ---
  function handlePlayerJoin(msg) {
    console.log('[IQ Host] handlePlayerJoin called, phase:', state.phase, 'player:', msg.player?.name);
    // Reject mid-game joins
    if (state.phase !== 'lobby') {
      broadcast({ type: 'join-rejected', reason: 'game-in-progress', targetId: msg.player.id });
      return;
    }
    if (state.players.find(p => p.id === msg.player.id)) {
      console.log('[IQ Host] Player already in list, re-broadcasting player-list');
      broadcast({ type: 'player-list', players: state.players, scores: state.scores, streaks: state.streaks });
      return;
    }
    state.players.push(msg.player);
    state.scores[msg.player.id] = 0;
    state.streaks[msg.player.id] = 0;
    // Update server player count
    fetch('/api/iq-rooms/' + encodeURIComponent(state.roomCode), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerCount: state.players.length })
    }).catch(() => {});
    renderLobbyPlayers();
    updateStartButton();
    // Broadcast updated player list
    broadcast({
      type: 'player-list',
      players: state.players,
      scores: state.scores,
      streaks: state.streaks
    });
  }

  function handleRemoteAnswer(msg) {
    if (state.answers[msg.playerId]) return; // Already answered
    state.answers[msg.playerId] = {
      answerIndex: msg.answerIndex,
      time: msg.time
    };
    // Broadcast anonymized answer status (no reveal yet)
    broadcast({
      type: 'answers-update',
      answers: Object.fromEntries(
        Object.entries(state.answers).map(([id, a]) => [id, { answered: true }])
      )
    });
    renderPlayerAnswerStatus();
    checkAllAnswered();
  }

  // --- Config page (before lobby) ---
  function showCreatePage() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById('pageIlmQuestCreate');
    if (page) page.classList.add('active');

    // Update pseudo preview
    updateIqPseudoPreview();
    setupCreatePageEvents();
  }

  function updateIqPseudoPreview() {
    const name = getPlayerName();
    const nameEl = document.getElementById('iqCreatePseudoName');
    const avatarEl = document.getElementById('iqCreatePseudoAvatar');
    if (nameEl) nameEl.textContent = name || 'Choisir ton pseudo';
    if (avatarEl && name && name !== 'Joueur') {
      avatarEl.textContent = name.substring(0, 2).toUpperCase();
    }
  }

  function setupCreatePageEvents() {
    // Difficulty selection
    document.querySelectorAll('#iqDiffGrid .create-diff-card').forEach(card => {
      card.onclick = () => {
        document.querySelectorAll('#iqDiffGrid .create-diff-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.difficulty = card.dataset.value;
      };
    });

    // Score target selection
    document.querySelectorAll('#iqScoreGrid .iq-target-card').forEach(card => {
      card.onclick = () => {
        document.querySelectorAll('#iqScoreGrid .iq-target-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.targetScore = parseInt(card.dataset.value);
      };
    });

    // Back button
    const backBtn = document.getElementById('iqCreateBack');
    if (backBtn) {
      backBtn.onclick = () => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const sel = document.getElementById('pageGameSelect');
        if (sel) sel.classList.add('active');
      };
    }

    // Pseudo preview click → open pseudo modal
    const pseudoPreview = document.getElementById('iqCreatePseudoPreview');
    if (pseudoPreview) {
      pseudoPreview.onclick = () => {
        const modal = document.getElementById('pseudoModal');
        const input = document.getElementById('inputPseudo');
        if (modal && input) {
          input.value = getPlayerName();
          modal.classList.remove('hidden');
          setTimeout(() => input.focus(), 100);
        }
      };
    }

    // Max players stepper
    const stepperEl = document.getElementById('iqStepperPlayers');
    if (stepperEl) {
      const min = parseInt(stepperEl.dataset.min);
      const max = parseInt(stepperEl.dataset.max);
      let val = parseInt(stepperEl.dataset.value);
      const valueEl = document.getElementById('iqStepperPlayersValue');
      const iconsEl = document.getElementById('iqStepperPlayersIcons');
      const minusBtn = stepperEl.querySelector('.stepper-minus');
      const plusBtn = stepperEl.querySelector('.stepper-plus');

      function updatePlayerStepper() {
        if (valueEl) valueEl.textContent = val;
        minusBtn.classList.toggle('disabled', val <= min);
        plusBtn.classList.toggle('disabled', val >= max);
        if (iconsEl) {
          let html = '';
          for (let i = 0; i < max; i++) {
            html += '<span class="stepper-icon' + (i < val ? ' active' : '') + '"></span>';
          }
          iconsEl.innerHTML = html;
        }
        state.maxPlayers = val;
      }

      minusBtn.onclick = () => {
        if (val <= min) return;
        val--;
        stepperEl.dataset.value = val;
        if (valueEl) { valueEl.classList.add('bump'); setTimeout(() => valueEl.classList.remove('bump'), 150); }
        updatePlayerStepper();
      };
      plusBtn.onclick = () => {
        if (val >= max) return;
        val++;
        stepperEl.dataset.value = val;
        if (valueEl) { valueEl.classList.add('bump'); setTimeout(() => valueEl.classList.remove('bump'), 150); }
        updatePlayerStepper();
      };

      updatePlayerStepper();
    }

    // Visibility selection
    document.querySelectorAll('#iqVisGrid .create-vis-card').forEach(card => {
      card.onclick = () => {
        document.querySelectorAll('#iqVisGrid .create-vis-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.visibility = card.dataset.value;
      };
    });

    // Confirm create button
    const confirmBtn = document.getElementById('iqBtnConfirmCreate');
    if (confirmBtn) {
      confirmBtn.onclick = () => createGame();
    }
  }

  // --- Server polling for player sync ---
  const POLL_INTERVAL = 2000;

  function startPlayerPolling() {
    stopPlayerPolling();
    state._pollTimer = setInterval(pollServerPlayers, POLL_INTERVAL);
    // First poll immediately
    pollServerPlayers();
  }

  function stopPlayerPolling() {
    if (state._pollTimer) {
      clearInterval(state._pollTimer);
      state._pollTimer = null;
    }
  }

  function pollServerPlayers() {
    if (!state.roomCode || state.phase !== 'lobby') {
      console.log('[IQ Poll] Stopping: roomCode=' + state.roomCode + ' phase=' + state.phase);
      stopPlayerPolling();
      return;
    }
    fetch('/api/iq-rooms/' + encodeURIComponent(state.roomCode) + '/players')
      .then(r => {
        console.log('[IQ Poll] Response status:', r.status);
        return r.json();
      })
      .then(data => {
        console.log('[IQ Poll] Data received: state=' + data.state + ' players=' + (data.players ? data.players.length : 'none') + ' hasQuestions=' + !!data.questions);
        if (!data.players || state.phase !== 'lobby') return;
        // Check if game started — questions are included directly in response
        if (data.state === 'playing' && !state.isHost) {
          console.log('[IQ Poll] GAME START DETECTED! questions:', data.questions ? data.questions.length : 0);
          if (data.questions) {
            stopPlayerPolling();
            state.questions = data.questions;
            state.targetScore = data.targetScore || state.targetScore;
            state.difficulty = data.difficulty || state.difficulty;
            state.phase = 'playing';
            state.currentQuestionIndex = 0;
            state.players.forEach(p => {
              state.scores[p.id] = 0;
              state.streaks[p.id] = 0;
            });
            showIlmQuestGame();
            loadQuestion(0);
            startGamePolling();
          }
          // If no questions yet (PATCH still in flight), polling continues and retries
          return;
        }
        const serverPlayers = data.players;
        // Only update if player list changed
        if (serverPlayers.length !== state.players.length ||
            serverPlayers.some((sp, i) => !state.players[i] || sp.id !== state.players[i].id)) {
          state.players = serverPlayers;
          // Init scores/streaks for new players
          serverPlayers.forEach(p => {
            if (state.scores[p.id] === undefined) state.scores[p.id] = 0;
            if (state.streaks[p.id] === undefined) state.streaks[p.id] = 0;
          });
          renderLobbyPlayers();
          updateStartButton();
          // Host also broadcasts via BroadcastChannel for real-time sync
          if (state.isHost) {
            broadcast({ type: 'player-list', players: state.players, scores: state.scores, streaks: state.streaks });
          }
        }
      })
      .catch(err => console.warn('[IQ Poll] fetch error:', err));
  }

  // --- Lobby ---
  async function createGame() {
    const name = getPlayerName();
    if (!name) return;

    state.roomCode = generateRoomCode();
    state.isHost = true;
    state.playerId = generateId();
    state.playerName = name;
    state.phase = 'lobby';
    const hostPlayer = {
      id: state.playerId,
      name: name,
      color: getPlayerColor(0),
      isHost: true
    };
    state.players = [hostPlayer];
    state.scores = { [state.playerId]: 0 };
    state.streaks = { [state.playerId]: 0 };
    state.answers = {};

    // Register on server with host player
    try {
      await fetch('/api/iq-rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: state.roomCode,
          hostName: name,
          hostPlayer: hostPlayer,
          visibility: state.visibility,
          difficulty: state.difficulty,
          targetScore: state.targetScore,
          maxPlayers: state.maxPlayers
        })
      });
    } catch (e) {
      console.warn('[IQ] Server registration failed', e);
    }

    history.pushState({ iqRoom: state.roomCode }, '', '/iq/' + state.roomCode);

    initChannel(state.roomCode);
    showIlmQuestLobby();
    renderLobbyPlayers();
    updateStartButton();
    startPlayerPolling();

    // Cleanup on tab close
    window.addEventListener('beforeunload', iqBeforeUnload);
  }

  function iqBeforeUnload() {
    if (state.isHost && state.roomCode) {
      navigator.sendBeacon('/api/iq-rooms/' + encodeURIComponent(state.roomCode) + '/close', '');
    }
  }

  async function joinGame(code) {
    const name = getPlayerName();
    if (!name) return false;

    const upperCode = code.toUpperCase();

    // Check server for room state
    try {
      const res = await fetch('/api/check-room/' + encodeURIComponent(upperCode));
      const data = await res.json();
      if (!data.exists) {
        if (typeof showIqUnavailable === 'function') showIqUnavailable('expired');
        return false;
      }
      if (data.gameType === 'ilm-quest' && data.state !== 'lobby') {
        if (typeof showIqUnavailable === 'function') showIqUnavailable('started');
        return false;
      }
    } catch (e) {
      // Network error
    }

    state.roomCode = upperCode;
    state.isHost = false;
    state.playerId = generateId();
    state.playerName = name;
    state.phase = 'lobby';

    const player = {
      id: state.playerId,
      name: name,
      color: getPlayerColor(Math.floor(Math.random() * 8)),
      isHost: false
    };

    // Register on server — this is the primary join mechanism
    try {
      const joinRes = await fetch('/api/iq-rooms/' + encodeURIComponent(upperCode) + '/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player })
      });
      const joinData = await joinRes.json();
      if (joinData.error) {
        if (typeof showIqUnavailable === 'function') {
          showIqUnavailable(joinRes.status === 409 ? 'started' : 'expired');
        }
        return false;
      }
      // Sync player list from server
      if (joinData.players) {
        state.players = joinData.players;
        joinData.players.forEach(p => {
          if (state.scores[p.id] === undefined) state.scores[p.id] = 0;
          if (state.streaks[p.id] === undefined) state.streaks[p.id] = 0;
        });
      }
    } catch (e) {
      console.warn('[IQ] Server join failed', e);
    }

    history.pushState({ iqRoom: upperCode }, '', '/iq/' + upperCode);

    initChannel(state.roomCode);
    showIlmQuestLobby();
    renderLobbyPlayers();
    updateStartButton();
    startPlayerPolling();

    // Also notify via BroadcastChannel (bonus — works if host is on same browser)
    broadcast({ type: 'player-join', player: player });

    return true;
  }

  function getPlayerName() {
    // Reuse existing pseudo system (key = 'al-asmaa-pseudo')
    try {
      const name = localStorage.getItem('al-asmaa-pseudo');
      if (name) return name;
    } catch (e) {}
    return 'Joueur';
  }

  // --- Démarrage du jeu ---
  async function startGame() {
    console.log('[IQ startGame] called, isHost:', state.isHost, 'players:', state.players.length, 'roomCode:', state.roomCode);
    if (!state.isHost || state.players.length < 2) return;

    stopPlayerPolling();
    const questions = filterQuestions(state.difficulty);
    console.log('[IQ startGame] questions generated:', questions.length);
    state.questions = questions;
    state.currentQuestionIndex = 0;
    state.phase = 'playing';

    // PATCH server state + questions — await to guarantee data is on server before guests poll
    const patchBody = JSON.stringify({ state: 'playing', questions: questions, targetScore: state.targetScore, difficulty: state.difficulty });
    console.log('[IQ startGame] PATCH body size:', patchBody.length, 'bytes');
    try {
      const patchRes = await fetch('/api/iq-rooms/' + encodeURIComponent(state.roomCode), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: patchBody
      });
      console.log('[IQ startGame] PATCH response:', patchRes.status, patchRes.statusText);
      if (!patchRes.ok) {
        const errText = await patchRes.text();
        console.error('[IQ startGame] PATCH FAILED:', errText);
      }
    } catch (e) {
      console.error('[IQ startGame] PATCH network error:', e);
    }

    // Reset scores
    state.players.forEach(p => {
      state.scores[p.id] = 0;
      state.streaks[p.id] = 0;
    });

    broadcast({
      type: 'game-start',
      questions: questions,
      targetScore: state.targetScore,
      difficulty: state.difficulty
    });

    showIlmQuestGame();
    loadQuestion(0);
    startGamePolling();
  }

  // --- Gameplay ---
  function loadQuestion(index) {
    if (index >= state.questions.length) {
      // Restart question pool if needed
      state.questions = shuffleArray(state.questions);
      index = 0;
      state.currentQuestionIndex = 0;
    }

    clearInterval(state.timerInterval);
    clearTimeout(state.revealTimeout);
    clearTimeout(state.autoNextTimeout);
    clearTimeout(state._revealFallback);

    state.currentQuestion = state.questions[index];
    state.currentQuestionIndex = index;
    state.answers = {};
    state.timerRemaining = TIMER_DURATION;
    state.phase = 'playing';

    renderQuestion();
    startTimer();
  }

  function startTimer() {
    const startTime = Date.now();
    const el = document.getElementById('iqTimerCircle');
    const timeEl = document.getElementById('iqTimerText');
    const pointsEl = document.getElementById('iqPotentialPoints');
    const totalDash = 283; // 2 * PI * 45

    state.timerInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      state.timerRemaining = Math.max(0, TIMER_DURATION - elapsed);
      const fraction = state.timerRemaining / TIMER_DURATION;

      // Update SVG circle
      if (el) {
        el.style.strokeDashoffset = totalDash * (1 - fraction);
        // Color: green → orange → red
        if (fraction > 0.5) el.style.stroke = '#2dd4a0';
        else if (fraction > 0.2) el.style.stroke = '#f59e0b';
        else el.style.stroke = '#ef4444';
      }

      // Update time text
      if (timeEl) timeEl.textContent = Math.ceil(state.timerRemaining);

      // Update potential points
      const pts = calculatePoints(TIMER_DURATION - state.timerRemaining);
      if (pointsEl) pointsEl.textContent = pts + ' pts';

      if (state.timerRemaining <= 0) {
        clearInterval(state.timerInterval);
        onTimerEnd();
      }
    }, 50);
  }

  function onTimerEnd() {
    if (state.isHost) {
      triggerReveal();
    }
    // Guest: if no reveal received after timer ends, timer is stuck.
    // This is a safety net in case the Socket.io message was lost.
    if (!state.isHost && state.phase === 'playing') {
      state._revealFallback = setTimeout(() => {
        if (state.phase === 'playing') {
          console.warn('[IQ] Guest: no reveal received, requesting from host');
          broadcast({ type: 'request-reveal' });
        }
      }, 2000);
    }
  }

  function submitAnswer(answerIndex) {
    if (state.answers[state.playerId]) return; // Already answered
    if (state.phase !== 'playing') return;

    const timeSpent = TIMER_DURATION - state.timerRemaining;
    state.answers[state.playerId] = {
      answerIndex: answerIndex,
      time: timeSpent
    };

    // Broadcast answer to host
    if (!state.isHost) {
      broadcast({
        type: 'answer',
        playerId: state.playerId,
        answerIndex: answerIndex,
        time: timeSpent
      });
    }

    // Disable buttons
    disableAnswerButtons(answerIndex);
    renderPlayerAnswerStatus();

    if (state.isHost) {
      // Broadcast anonymized update
      broadcast({
        type: 'answers-update',
        answers: Object.fromEntries(
          Object.entries(state.answers).map(([id, a]) => [id, { answered: true }])
        )
      });
      checkAllAnswered();
    }
  }

  function checkAllAnswered() {
    const allAnswered = state.players.every(p => state.answers[p.id]);
    if (allAnswered && state.isHost) {
      clearInterval(state.timerInterval);
      // Notify guests that everyone answered → their timer stops immediately
      broadcast({
        type: 'answers-update',
        answers: Object.fromEntries(
          Object.entries(state.answers).map(([id, a]) => [id, { answered: true }])
        ),
        allAnswered: true
      });
      // Reveal after short pause
      setTimeout(() => triggerReveal(), 500);
    }
  }

  function triggerReveal() {
    state.phase = 'reveal';
    clearInterval(state.timerInterval);

    const correctIndex = state.currentQuestion.correct;

    // Calculate scores
    state.players.forEach(p => {
      const answer = state.answers[p.id];
      if (answer && answer.answerIndex === correctIndex) {
        const pts = calculatePoints(answer.time);
        const streakBonus = state.streaks[p.id] * STREAK_BONUS;
        state.scores[p.id] = (state.scores[p.id] || 0) + pts + streakBonus;
        state.streaks[p.id] = (state.streaks[p.id] || 0) + 1;
      } else {
        state.streaks[p.id] = 0;
      }
    });

    // Broadcast reveal
    broadcast({
      type: 'reveal',
      answers: state.answers,
      scores: state.scores,
      streaks: state.streaks
    });

    doReveal();

    // Check for winner
    if (state.isHost) {
      const winner = state.players.find(p => state.scores[p.id] >= state.targetScore);
      if (winner) {
        setTimeout(() => {
          state.winner = winner;
          state.phase = 'results';
          broadcast({
            type: 'game-over',
            winner: winner,
            scores: state.scores,
            streaks: state.streaks
          });
          showIlmQuestResults();
        }, 3000);
        return;
      }

      // Auto next question after delay
      state.autoNextTimeout = setTimeout(() => {
        const nextIdx = state.currentQuestionIndex + 1;
        broadcast({ type: 'next-question', questionIndex: nextIdx });
        loadQuestion(nextIdx);
      }, AUTO_NEXT_DELAY);
    }
  }

  function doReveal() {
    state.phase = 'reveal';
    clearInterval(state.timerInterval);
    clearTimeout(state._revealFallback);
    renderReveal();
  }

  // --- Rendu ---
  function showIlmQuestLobby() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const lobby = document.getElementById('pageIlmQuestLobby');
    if (lobby) lobby.classList.add('active');

    // Room code
    const codeEl = document.getElementById('iqRoomCode');
    if (codeEl) codeEl.textContent = state.roomCode;

    // QR code
    const qrImg = document.getElementById('iqQrCodeImg');
    if (qrImg) {
      fetch('/api/qrcode/' + encodeURIComponent(state.roomCode) + '?path=iq')
        .then(r => r.json())
        .then(data => {
          if (data.qr) qrImg.src = data.qr;
          const urlEl = document.getElementById('iqRoomUrlDisplay');
          if (urlEl && data.url) urlEl.textContent = data.url;
        })
        .catch(() => {});
    }

    // Config badges
    const diffLabels = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé', mixte: 'Mixte' };
    const diffBadge = document.getElementById('iqBadgeDiff');
    if (diffBadge) {
      diffBadge.innerHTML = '<svg class="badge-icon" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> ' + (diffLabels[state.difficulty] || 'Mixte');
    }
    const scoreBadge = document.getElementById('iqBadgeScore');
    if (scoreBadge) {
      scoreBadge.innerHTML = '<svg class="badge-icon" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg> ' + state.targetScore.toLocaleString('fr-FR') + ' pts';
    }

    // Visibility badge
    const visBadge = document.getElementById('iqLobbyVisBadge');
    if (visBadge) {
      const isPublic = state.visibility === 'public';
      visBadge.innerHTML = isPublic
        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg> Publique'
        : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Privée';
    }
    const visBadgeRow = document.getElementById('iqBadgeVis');
    if (visBadgeRow) {
      const isPublic = state.visibility === 'public';
      visBadgeRow.innerHTML = isPublic
        ? '<svg class="badge-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg> Publique'
        : '<svg class="badge-icon" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Privée';
    }

    // Show/hide start section based on host
    const startSection = lobby.querySelector('.lobby-start-section');
    if (startSection) startSection.style.display = state.isHost ? '' : 'none';

    // Waiting text for non-host
    const waitingText = document.getElementById('iqWaitingText');
    if (waitingText) {
      waitingText.innerHTML = state.isHost
        ? 'En attente de joueurs<span class="lobby-dots"><span>.</span><span>.</span><span>.</span></span>'
        : 'En attente du lancement par l\'hôte<span class="lobby-dots"><span>.</span><span>.</span><span>.</span></span>';
    }

    renderLobbyPlayers();
    updateStartButton();
    setupLobbyEvents();
    initIqLobbyParticles();
  }

  function initIqLobbyParticles() {
    if (state.iqParticlesAnimId) cancelAnimationFrame(state.iqParticlesAnimId);
    const canvas = document.getElementById('iqLobbyParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(45, 212, 160, ' + p.alpha + ')';
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      state.iqParticlesAnimId = requestAnimationFrame(draw);
    }
    draw();

    // Cleanup observer
    const obs = new MutationObserver(() => {
      const page = document.getElementById('pageIlmQuestLobby');
      if (page && !page.classList.contains('active')) {
        cancelAnimationFrame(state.iqParticlesAnimId);
        obs.disconnect();
      }
    });
    const lobbyPage = document.getElementById('pageIlmQuestLobby');
    if (lobbyPage) obs.observe(lobbyPage, { attributes: true, attributeFilter: ['class'] });
  }

  function setupLobbyEvents() {
    // Start button
    const startBtn = document.getElementById('iqBtnStart');
    if (startBtn) {
      startBtn.onclick = () => startGame();
    }

    // Copy code block
    const codeCopy = document.getElementById('iqLobbyCodeCopy');
    if (codeCopy) {
      codeCopy.onclick = () => {
        navigator.clipboard.writeText(state.roomCode).then(() => {
          // Flash animation on code block
          codeCopy.classList.add('iq-code-flash');
          setTimeout(() => codeCopy.classList.remove('iq-code-flash'), 700);

          // Ripple effect on the code value
          const codeVal = codeCopy.querySelector('.lobby-code-value');
          if (codeVal) {
            codeVal.classList.add('iq-code-pop');
            setTimeout(() => codeVal.classList.remove('iq-code-pop'), 500);
          }

          // Show "Copié !" badge
          const copied = document.getElementById('iqCodeCopied');
          if (copied) {
            copied.classList.add('visible');
            setTimeout(() => copied.classList.remove('visible'), 2000);
          }
        });
      };
    }

    // Copy URL
    const urlCopy = document.getElementById('iqLobbyUrlCopy');
    if (urlCopy) {
      urlCopy.onclick = () => {
        const urlEl = document.getElementById('iqRoomUrlDisplay');
        const url = urlEl ? urlEl.textContent : (window.location.origin + '/iq/' + state.roomCode);
        navigator.clipboard.writeText(url).then(() => {
          const copied = document.getElementById('iqUrlCopied');
          if (copied) {
            copied.textContent = 'Lien copié !';
            copied.style.display = '';
            copied.classList.add('visible');
            setTimeout(() => { copied.classList.remove('visible'); copied.style.display = 'none'; }, 2000);
          }
        });
      };
    }

    // Back button
    const backBtn = document.getElementById('iqLobbyBack');
    if (backBtn) {
      backBtn.onclick = () => {
        leaveGame();
        history.pushState({}, '', '/');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const home = document.getElementById('pageHome');
        if (home) home.classList.add('active');
      };
    }
  }

  var _prevIqPlayerIds = [];

  function renderLobbyPlayers() {
    var container = document.getElementById('iqPlayerList');
    if (!container) return;

    var currentIds = state.players.map(function(p) { return p.id; });

    if (state.players.length === 0) {
      container.innerHTML = '<div class="lobby-empty-state">Les joueurs apparaîtront ici</div>';
    } else {
      container.innerHTML = state.players.map(function(p, idx) {
        var isMe = p.id === state.playerId;
        var initial = p.name.charAt(0).toUpperCase();
        var isNew = _prevIqPlayerIds.indexOf(p.id) === -1;
        var cardClass = 'lobby-player-card' + (isNew ? ' lobby-card-enter' : '');

        var hostTag = p.isHost ? '<span class="lobby-card-host">Hôte</span>' : '';
        var kickBtn = (state.isHost && !isMe) ? '<button class="lobby-card-kick" data-kick-id="' + p.id + '" title="Exclure"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' : '';

        return '<div class="' + cardClass + '" style="--player-color:' + p.color + '; --card-stagger:' + idx + '">' +
          '<div class="lobby-card-avatar">' + initial + '</div>' +
          '<div class="lobby-card-info">' +
            '<div class="lobby-card-name">' + p.name + ' ' + hostTag + '</div>' +
            '<div class="lobby-card-status">En attente</div>' +
          '</div>' +
          kickBtn +
        '</div>';
      }).join('');
    }

    // Bind kick buttons
    container.querySelectorAll('.lobby-card-kick').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (state.socket) state.socket.emit('kick-player', { playerId: btn.dataset.kickId });
      });
    });

    _prevIqPlayerIds = currentIds;

    // Update player count
    var countEl = document.getElementById('iqPlayerCount');
    if (countEl) countEl.textContent = state.players.length;

    // Update ring progress
    var ring = document.getElementById('iqLobbyRingProgress');
    if (ring) {
      var maxP = 8;
      var circumference = 113.1;
      var offset = circumference - (state.players.length / maxP) * circumference;
      ring.style.strokeDashoffset = offset;
    }
  }

  function updateStartButton() {
    const btn = document.getElementById('iqBtnStart');
    const hint = document.getElementById('iqStartHint');
    const startSection = document.querySelector('#pageIlmQuestLobby .lobby-start-section');
    if (!btn) return;
    if (!state.isHost) {
      if (startSection) startSection.style.display = 'none';
      return;
    }
    if (startSection) startSection.style.display = '';
    btn.disabled = state.players.length < 2;
    if (hint) {
      hint.textContent = state.players.length < 2
        ? 'Minimum 2 joueurs pour commencer'
        : state.players.length + ' joueur' + (state.players.length > 1 ? 's' : '') + ' — prêt à lancer !';
    }
  }

  function showIlmQuestGame() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const game = document.getElementById('pageIlmQuestGame');
    if (game) game.classList.add('active');
  }

  function renderQuestion() {
    const q = state.currentQuestion;
    if (!q) return;

    // Re-trigger entrance animations
    document.querySelectorAll('#pageIlmQuestGame .iq-stagger').forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight; // force reflow
      el.style.animation = '';
    });

    // Question text
    const questionEl = document.getElementById('iqQuestionText');
    if (questionEl) questionEl.textContent = q.question;

    // Difficulty badge
    const badgeEl = document.getElementById('iqDiffBadge');
    if (badgeEl) {
      const labels = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };
      badgeEl.textContent = labels[q.difficulty] || q.difficulty;
      badgeEl.className = 'iq-diff-badge iq-diff-' + q.difficulty;
    }

    // Question number
    const numEl = document.getElementById('iqQuestionNum');
    if (numEl) numEl.textContent = `Question ${state.currentQuestionIndex + 1}`;

    // Answers
    const answersContainer = document.getElementById('iqAnswers');
    if (answersContainer) {
      answersContainer.innerHTML = q.answers.map((a, i) => `
        <button class="iq-answer-btn iq-ans-enter" style="animation-delay:${0.15 + i * 0.06}s" data-index="${i}" onclick="IlmQuest.submitAnswer(${i})">
          <span class="iq-answer-letter">${String.fromCharCode(65 + i)}</span>
          <span class="iq-answer-text">${a}</span>
        </button>
      `).join('');
    }

    // Reset timer visual
    const el = document.getElementById('iqTimerCircle');
    if (el) {
      el.style.strokeDashoffset = '0';
      el.style.stroke = '#2dd4a0';
    }
    const timeEl = document.getElementById('iqTimerText');
    if (timeEl) timeEl.textContent = TIMER_DURATION;
    const pointsEl = document.getElementById('iqPotentialPoints');
    if (pointsEl) pointsEl.textContent = '1000 pts';

    // Score bars
    renderScoreBars();

    // Player answer status
    renderPlayerAnswerStatus();

    // Hide source block
    const sourceBlock = document.getElementById('iqSourceBlock');
    if (sourceBlock) sourceBlock.classList.remove('iq-visible');

    // Show answer area, hide reveal
    const revealOverlay = document.getElementById('iqRevealOverlay');
    if (revealOverlay) revealOverlay.classList.remove('iq-visible');
  }

  function renderScoreBars() {
    const container = document.getElementById('iqScoreBars');
    if (!container) return;

    const maxScore = state.targetScore || 5000;
    const sorted = [...state.players].sort((a, b) => (state.scores[b.id] || 0) - (state.scores[a.id] || 0));

    // Toggle 2-column layout for 5+ players
    if (sorted.length >= 5) {
      container.classList.add('iq-sb-multi');
    } else {
      container.classList.remove('iq-sb-multi');
    }

    container.innerHTML = sorted.map(p => {
      const score = state.scores[p.id] || 0;
      const pct = Math.min(100, (score / maxScore) * 100);
      const streak = state.streaks[p.id] || 0;
      return `
        <div class="iq-score-row">
          <div class="iq-score-player">
            <div class="iq-score-avatar" style="background:${p.color}">${getInitials(p.name)}</div>
            <span class="iq-score-name">${p.name}</span>
            ${streak >= 2 ? `<span class="iq-streak-badge">${streak}x</span>` : ''}
          </div>
          <div class="iq-score-bar-wrap">
            <div class="iq-score-bar-fill" style="width:${pct}%;background:${p.color}"></div>
          </div>
          <div class="iq-score-value">${score}</div>
        </div>
      `;
    }).join('');
  }

  function renderPlayerAnswerStatus() {
    const container = document.getElementById('iqPlayerStatus');
    if (!container) return;

    container.innerHTML = state.players.map(p => {
      const answered = state.answers[p.id];
      const statusClass = answered ? 'iq-answered' : 'iq-waiting';
      return `
        <div class="iq-status-player ${statusClass}">
          <div class="iq-status-avatar" style="background:${p.color}">${getInitials(p.name)}</div>
          <div class="iq-status-icon">${answered ? '?' : '...'}</div>
        </div>
      `;
    }).join('');
  }

  function disableAnswerButtons(selectedIndex) {
    document.querySelectorAll('#iqAnswers .iq-answer-btn').forEach((btn, i) => {
      btn.disabled = true;
      if (i === selectedIndex) btn.classList.add('iq-selected');
    });
  }

  function renderReveal() {
    const q = state.currentQuestion;
    if (!q) return;

    // Reveal correct answer on buttons
    document.querySelectorAll('#iqAnswers .iq-answer-btn').forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correct) {
        btn.classList.add('iq-correct');
      } else if (state.answers[state.playerId] && state.answers[state.playerId].answerIndex === i) {
        btn.classList.add('iq-wrong');
      }
    });

    // Reveal player answers
    const container = document.getElementById('iqPlayerStatus');
    if (container) {
      container.innerHTML = state.players.map(p => {
        const answer = state.answers[p.id];
        const isCorrect = answer && answer.answerIndex === q.correct;
        const icon = answer ? (isCorrect ? '&#10003;' : '&#10007;') : '&#8212;';
        const statusClass = answer ? (isCorrect ? 'iq-status-correct' : 'iq-status-wrong') : 'iq-status-timeout';
        return `
          <div class="iq-status-player iq-revealed ${statusClass}">
            <div class="iq-status-avatar" style="background:${p.color}">${getInitials(p.name)}</div>
            <div class="iq-status-icon-reveal">${icon}</div>
          </div>
        `;
      }).join('');
    }

    // Show source block
    const sourceBlock = document.getElementById('iqSourceBlock');
    if (sourceBlock && q.source) {
      const s = q.source;
      sourceBlock.innerHTML = `
        <div class="iq-source-content">
          ${s.arabic ? `<div class="iq-source-arabic" dir="rtl">${s.arabic}</div>` : ''}
          ${s.translation ? `<div class="iq-source-translation">${s.translation}</div>` : ''}
          <div class="iq-source-ref">${s.reference}${s.scholar ? ' — ' + s.scholar : ''}</div>
        </div>
      `;
      sourceBlock.classList.add('iq-visible');
    }

    // Update scores
    renderScoreBars();
  }

  // --- Results ---
  function showIlmQuestResults() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const results = document.getElementById('pageIlmQuestResults');
    if (results) results.classList.add('active');

    stopGamePolling();
    clearInterval(state.timerInterval);
    clearTimeout(state.revealTimeout);
    clearTimeout(state.autoNextTimeout);

    renderResults();
    launchConfetti();
  }

  function renderResults() {
    const sorted = [...state.players].sort((a, b) => (state.scores[b.id] || 0) - (state.scores[a.id] || 0));
    const isTie = sorted.length >= 2 && (state.scores[sorted[0].id] || 0) === (state.scores[sorted[1].id] || 0);
    const totalQuestions = (state.currentQuestionIndex || 0) + 1;

    // SVG icons
    var ICONS = {
      trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
      crown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>',
      medal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/></svg>',
      handshake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1"/><path d="M13 17a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-1"/><path d="M8 7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v1H8V7Z"/><path d="M12 11v2"/></svg>'
    };

    // --- Banner ---
    var banner = document.getElementById('iqResultsBanner');
    var iconEl = document.getElementById('iqBannerIcon');
    var titleEl = document.getElementById('iqBannerTitle');
    var subEl = document.getElementById('iqBannerSubtitle');
    var particles = document.getElementById('iqBannerParticles');
    var glow = document.getElementById('iqResultsGlow');

    if (banner) {
      banner.className = 'iq-res-banner';
      if (glow) glow.className = 'iq-res-glow';

      if (isTie) {
        banner.classList.add('tie');
        if (glow) glow.classList.add('tie');
        if (iconEl) iconEl.innerHTML = ICONS.handshake;
        if (titleEl) titleEl.textContent = '\u00c9GALIT\u00c9';
        if (subEl) subEl.textContent = 'Scores identiques \u2014 pas de vainqueur !';
      } else {
        banner.classList.add('victory');
        if (glow) glow.classList.add('victory');
        if (iconEl) iconEl.innerHTML = ICONS.trophy;
        if (titleEl) titleEl.textContent = 'VICTOIRE';
        if (subEl) subEl.textContent = sorted[0] ? sorted[0].name + ' remporte la partie !' : '';
      }
      spawnIqBannerParticles(particles, isTie ? 'tie' : 'gold');
    }

    // --- Bg Orbs ---
    spawnIqBgOrbs('iqResultsBgOrbs');

    // --- Stats ---
    var bestScore = sorted.length > 0 ? (state.scores[sorted[0].id] || 0) : 0;
    var statQ = document.getElementById('iqStatQuestions');
    var statP = document.getElementById('iqStatPlayers');
    var statB = document.getElementById('iqStatBestScore');
    setTimeout(function() {
      iqAnimateCounter(statQ, 0, totalQuestions, 1000);
      iqAnimateCounter(statP, 0, sorted.length, 800);
      iqAnimateCounter(statB, 0, bestScore, 1200);
    }, 600);

    // --- Premium Podium ---
    var podium = document.getElementById('iqPodium');
    if (podium) {
      if (isTie) podium.classList.add('iq-podium-tie');
      else podium.classList.remove('iq-podium-tie');

      var top3 = sorted.slice(0, 3);
      var ordered = top3.length >= 2 ? [top3[1], top3[0], top3[2]].filter(Boolean) : top3;
      var places = ['second', 'first', 'third'];
      var labels = ['2', '1', '3'];
      var barHeights = [76, 110, 52];

      podium.innerHTML = ordered.map(function(p, i) {
        if (!p) return '';
        var score = state.scores[p.id] || 0;
        var isFirst = places[i] === 'first';
        var showCrown = isFirst && !isTie;
        var tieClass = isTie && (places[i] === 'first' || places[i] === 'second') ? ' iq-pod-tied' : '';
        return '<div class="iq-pod-col ' + places[i] + tieClass + '" style="--pod-index:' + i + '">' +
          '<div class="iq-pod-avatar" style="background:' + p.color + ';">' +
            (showCrown ? '<span class="iq-pod-crown">' + ICONS.crown + '</span>' : '') +
            getInitials(p.name) +
          '</div>' +
          '<div class="iq-pod-name">' + p.name + '</div>' +
          '<div class="iq-pod-score">' + score + ' PTS</div>' +
          '<div class="iq-pod-bar">' + (isTie && (places[i] === 'first' || places[i] === 'second') ? '=' : labels[i]) + '</div>' +
        '</div>';
      }).join('');
    }

    // --- Leaderboard ---
    var stats = document.getElementById('iqStats');
    if (stats && sorted.length > 3) {
      stats.innerHTML = '<div class="iq-res-lb-title">Classement complet</div>' +
        sorted.slice(3).map(function(p, idx) {
          var score = state.scores[p.id] || 0;
          return '<div class="iq-res-lb-row" style="--row-index:' + idx + '">' +
            '<div class="iq-res-lb-rank">' + (idx + 4) + '</div>' +
            '<div class="iq-res-lb-avatar" style="background:' + p.color + '">' + getInitials(p.name) + '</div>' +
            '<div class="iq-res-lb-name">' + p.name + '</div>' +
            '<div class="iq-res-lb-score">' + score + ' pts</div>' +
          '</div>';
        }).join('');
    } else if (stats) {
      stats.innerHTML = '';
    }

    // --- Replay button ---
    var replayBtn = document.getElementById('iqBtnReplay');
    if (replayBtn) {
      replayBtn.onclick = function() {
        if (state.isHost) {
          state.phase = 'lobby';
          state.players.forEach(function(p) {
            state.scores[p.id] = 0;
            state.streaks[p.id] = 0;
          });
          state.answers = {};
          state.winner = null;
          broadcast({
            type: 'player-list',
            players: state.players,
            scores: state.scores,
            streaks: state.streaks
          });
          showIlmQuestLobby();
        }
      };
    }

    // --- Back button ---
    var backBtn = document.getElementById('iqResultsBack');
    if (backBtn) {
      backBtn.onclick = function() {
        leaveGame();
        history.pushState({}, '', '/');
        document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
        var home = document.getElementById('pageHome');
        if (home) home.classList.add('active');
      };
    }
  }

  // --- IQ Banner Particles ---
  function spawnIqBannerParticles(container, color) {
    if (!container) return;
    container.innerHTML = '';
    var palettes = {
      gold: ['#ffd866', '#d4a24c', '#f0cc7a', '#fff6c2', '#a67c2e'],
      tie: ['#a78bfa', '#818cf8', '#c4b5fd', '#7c3aed', '#ddd6fe']
    };
    var colors = palettes[color] || palettes.gold;
    for (var i = 0; i < 40; i++) {
      var p = document.createElement('div');
      p.className = 'iq-res-particle' + (Math.random() > 0.5 ? ' diamond' : '');
      var size = 3 + Math.random() * 8;
      var left = Math.random() * 100;
      var delay = Math.random() * 3;
      var dur = 2 + Math.random() * 3;
      var ty = -(30 + Math.random() * 100);
      var tx = -30 + Math.random() * 60;
      p.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + left + '%;bottom:0;background:' + colors[Math.floor(Math.random() * colors.length)] + ';animation-delay:' + delay + 's;--dur:' + dur + 's;--ty:' + ty + 'px;--tx:' + tx + 'px;--op:' + (0.4 + Math.random() * 0.5) + ';';
      container.appendChild(p);
    }
  }

  // --- IQ Background Orbs ---
  function spawnIqBgOrbs(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    for (var i = 0; i < 6; i++) {
      var orb = document.createElement('div');
      orb.className = 'iq-res-bg-orb';
      var size = 120 + Math.random() * 200;
      var x = Math.random() * 100;
      var y = Math.random() * 100;
      var delay = Math.random() * 5;
      var dur = 8 + Math.random() * 12;
      var hue = 30 + Math.random() * 20;
      orb.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + x + '%;top:' + y + '%;--orb-dur:' + dur + 's;--orb-delay:' + delay + 's;background:radial-gradient(circle,hsla(' + hue + ',60%,55%,0.08) 0%,transparent 70%);';
      container.appendChild(orb);
    }
  }

  // --- IQ Animated Counter ---
  function iqAnimateCounter(el, from, to, duration) {
    if (!el) return;
    var start = performance.now();
    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // --- Confetti ---
  function launchConfetti() {
    var canvas = document.getElementById('iqConfettiCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var pieces = [];
    var colors = ['#d4a24c', '#f0cc7a', '#2dd4a0', '#60a5fa', '#a78bfa', '#ef4444', '#f59e0b'];

    for (var i = 0; i < 150; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        w: Math.random() * 10 + 4,
        h: Math.random() * 7 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3.5 + 2,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12
      });
    }

    var frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(function(p) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        p.vy += 0.04;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame / 220);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 280) requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    animate();
  }

  // --- Game polling (cross-device quit detection) ---
  const GAME_POLL_INTERVAL = 3000;

  function startGamePolling() {
    stopGamePolling();
    state._gamePoller = setInterval(pollGameState, GAME_POLL_INTERVAL);
  }

  function stopGamePolling() {
    if (state._gamePoller) {
      clearInterval(state._gamePoller);
      state._gamePoller = null;
    }
  }

  function pollGameState() {
    if (!state.roomCode || state.phase === 'lobby' || state.phase === 'results') {
      stopGamePolling();
      return;
    }
    fetch('/api/iq-rooms/' + encodeURIComponent(state.roomCode) + '/players')
      .then(r => {
        if (r.status === 404) {
          // Room deleted → host left
          if (!state.isHost) handleHostLeft();
          return null;
        }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        const serverPlayers = data.players;
        // Detect players who left
        const leftPlayers = state.players.filter(p => !serverPlayers.find(sp => sp.id === p.id));
        if (leftPlayers.length > 0) {
          leftPlayers.forEach(lp => {
            if (lp.id !== state.playerId) {
              handlePlayerLeftGame(lp);
            }
          });
        }
      })
      .catch(() => {});
  }

  // --- Quitter la partie en cours ---
  function quitGame() {
    const dlg = document.getElementById('dlgLeaveConfirm');
    if (!dlg) return;
    const title = dlg.querySelector('.dlg-title');
    const msg = dlg.querySelector('.dlg-message');
    const cancelBtn = document.getElementById('dlgLeaveCancel');
    const confirmBtn = document.getElementById('dlgLeaveConfirmBtn');

    if (state.isHost) {
      if (title) title.textContent = 'Quitter la partie ?';
      if (msg) msg.textContent = 'La partie sera terminée pour tous les joueurs.';
    } else {
      if (title) title.textContent = 'Quitter la partie ?';
      if (msg) msg.textContent = 'Tu seras retiré de la partie en cours.';
    }

    dlg.classList.add('visible');

    cancelBtn.onclick = () => dlg.classList.remove('visible');
    confirmBtn.onclick = () => {
      dlg.classList.remove('visible');
      executeQuit();
    };
  }

  function executeQuit() {
    stopGamePolling();
    if (state.isHost) {
      broadcast({ type: 'host-left' });
    } else {
      broadcast({ type: 'player-left-game', playerId: state.playerId, playerName: state.playerName });
    }
    leaveGame();
    goHome();
  }

  function goHome(popupOptions) {
    history.pushState({}, '', '/');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const home = document.getElementById('pageHome');
    if (home) home.classList.add('active');
    if (popupOptions) showRedirectPopup(popupOptions);
  }

  function showRedirectPopup(opts) {
    const dlg = document.getElementById('dlgIqRedirect');
    if (!dlg) return;
    const icon = document.getElementById('dlgIqRedirectIcon');
    const title = document.getElementById('dlgIqRedirectTitle');
    const msg = document.getElementById('dlgIqRedirectMessage');
    const okBtn = document.getElementById('dlgIqRedirectOk');

    if (title) title.textContent = opts.title || 'Partie terminée';
    if (msg) msg.textContent = opts.message || '';
    if (icon) {
      icon.className = 'dlg-icon ' + (opts.type || 'warning');
      const svgMap = {
        warning: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
        info: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
      };
      icon.innerHTML = svgMap[opts.type] || svgMap.warning;
    }

    dlg.classList.add('visible');
    if (okBtn) {
      okBtn.onclick = () => dlg.classList.remove('visible');
    }
  }

  function handleHostLeft() {
    stopGamePolling();
    stopPlayerPolling();
    clearInterval(state.timerInterval);
    clearTimeout(state.revealTimeout);
    clearTimeout(state.autoNextTimeout);
    cleanupSocket();
    if (state.channel) {
      try { state.channel.close(); } catch (e) {}
      state.channel = null;
    }
    window.removeEventListener('beforeunload', iqBeforeUnload);
    state.phase = 'lobby';
    state.roomCode = '';
    state.players = [];
    state.answers = {};
    state.scores = {};
    state.streaks = {};
    state.winner = null;
    goHome({
      title: "L'hôte a quitté",
      message: "L'hôte a quitté la partie. La session a été terminée pour tous les joueurs.",
      type: 'warning'
    });
  }

  function handlePlayerLeftGame(player) {
    // Don't process if it's ourselves
    if (player.id === state.playerId) return;
    // Don't process if player already removed
    if (!state.players.find(p => p.id === player.id)) return;

    // Remove from players
    state.players = state.players.filter(p => p.id !== player.id);
    delete state.scores[player.id];
    delete state.streaks[player.id];
    delete state.answers[player.id];

    if (state.isHost) {
      // Update server player count
      fetch('/api/iq-rooms/' + encodeURIComponent(state.roomCode), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerCount: state.players.length })
      }).catch(() => {});

      if (state.players.length < 2) {
        // Not enough players to continue
        broadcast({ type: 'host-left' });
        stopGamePolling();
        clearInterval(state.timerInterval);
        clearTimeout(state.revealTimeout);
        clearTimeout(state.autoNextTimeout);
        leaveGame();
        goHome({
          title: 'Pas assez de joueurs',
          message: player.name + ' a quitté la partie. Il n\'y a plus assez de joueurs pour continuer.',
          type: 'warning'
        });
        return;
      }

      // Check if all remaining players answered (for reveal trigger)
      checkAllAnswered();
    }

    // In-game leave popup
    showIqLeavePopup(player);

    // Update UI
    renderScoreBars();
    renderPlayerAnswerStatus();
  }

  function showIqLeavePopup(player) {
    var existing = document.querySelector('.iq-leave-popup');
    if (existing) existing.remove();

    var initial = player.name.charAt(0).toUpperCase();
    var popup = document.createElement('div');
    popup.className = 'iq-leave-popup';
    popup.innerHTML =
      '<div class="iq-leave-popup-avatar" style="background:' + (player.color || 'var(--gold)') + '">' + initial + '</div>' +
      '<div class="iq-leave-popup-text"><span class="iq-leave-popup-name">' + player.name + '</span> a quitté</div>';

    var gamePage = document.getElementById('pageIlmQuestGame');
    if (gamePage) gamePage.appendChild(popup);

    requestAnimationFrame(function() {
      popup.classList.add('iq-leave-popup-in');
    });

    setTimeout(function() {
      popup.classList.remove('iq-leave-popup-in');
      popup.classList.add('iq-leave-popup-out');
      setTimeout(function() { popup.remove(); }, 400);
    }, 2800);
  }

  // --- Socket cleanup helper ---
  function cleanupSocket() {
    if (state.socket) {
      state.socket.emit('iq-leave');
      state.socket.off('iq-message');
      state.socket.off('connect');
      state.socket.disconnect();
      state.socket = null;
    }
  }

  // --- Nettoyage ---
  function leaveGame() {
    stopPlayerPolling();
    stopGamePolling();
    broadcast({ type: 'player-leave', playerId: state.playerId });

    cleanupSocket();
    // BroadcastChannel cleanup
    if (state.channel) {
      try { state.channel.close(); } catch (e) {}
      state.channel = null;
    }
    clearInterval(state.timerInterval);
    clearTimeout(state.revealTimeout);
    clearTimeout(state.autoNextTimeout);
    if (state.iqParticlesAnimId) {
      cancelAnimationFrame(state.iqParticlesAnimId);
      state.iqParticlesAnimId = null;
    }

    // Cleanup server room
    if (state.roomCode) {
      if (state.isHost) {
        fetch('/api/iq-rooms/' + encodeURIComponent(state.roomCode), { method: 'DELETE' }).catch(() => {});
      } else {
        fetch('/api/iq-rooms/' + encodeURIComponent(state.roomCode) + '/leave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId: state.playerId })
        }).catch(() => {});
      }
    }

    window.removeEventListener('beforeunload', iqBeforeUnload);
    state.phase = 'lobby';
    state.roomCode = '';
    state.players = [];
    state.answers = {};
    state.scores = {};
    state.streaks = {};
    state.winner = null;
  }

  // --- API publique ---
  return {
    createGame,
    joinGame,
    startGame,
    submitAnswer,
    leaveGame,
    quitGame,
    showCreatePage,
    showIlmQuestLobby,
    updateCreatePseudoPreview: updateIqPseudoPreview,
    getState: () => state
  };
})();
