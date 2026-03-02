/**
 * Al-Asmaa — Application Spectateur
 * Vue grand écran / TV pour suivre la partie
 */
(() => {
  'use strict';

  let socket = null;
  let roomCode = '';
  let players = [];
  let usedNames = [];
  let gameState = null;
  let gameConfig = {};

  const pages = {
    lobby: document.getElementById('spectatorLobby'),
    game: document.getElementById('spectatorGame'),
    results: document.getElementById('spectatorResults')
  };

  function init() {
    // Extraire le code room depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    roomCode = (urlParams.get('code') || '').toUpperCase();

    if (!roomCode) {
      Bomb.showToast('Code de room manquant', 'error');
      return;
    }

    socket = io();
    AudioFX.init();

    // Rejoindre en tant que spectateur
    socket.emit('join-spectator', { code: roomCode }, (response) => {
      if (response.success) {
        players = response.players;
        gameConfig = response.config || {};
        renderLobbyPlayers();

        if (response.state === 'playing') {
          gameState = response.game;
          showPage('game');
          renderGamePlayers();
        }
      } else {
        Bomb.showToast(response.message || 'Room introuvable', 'error');
      }
    });

    setupSocketEvents();
  }

  function showPage(pageId) {
    Object.values(pages).forEach(p => {
      if (p) p.classList.remove('active');
    });
    if (pages[pageId]) {
      pages[pageId].classList.add('active');
    }
  }

  function setupSocketEvents() {
    // --- Disconnect / reconnect handling ---
    let disconnectTimer = null;

    socket.on('disconnect', () => {
      Bomb.showToast('Connexion perdue...', 'warning');
      disconnectTimer = setTimeout(() => {
        window.location.href = '/';
      }, 60000);
    });

    socket.on('connect', () => {
      if (disconnectTimer) {
        clearTimeout(disconnectTimer);
        disconnectTimer = null;
        // Re-join as spectator after reconnection
        if (roomCode) {
          socket.emit('join-spectator', { code: roomCode }, (response) => {
            if (response && response.success) {
              players = response.players;
              gameConfig = response.config || gameConfig;
              if (response.state === 'playing') {
                gameState = response.game;
                showPage('game');
                renderGamePlayers();
              } else {
                renderLobbyPlayers();
              }
              Bomb.showToast('Reconnecté !', 'correct');
            }
          });
        }
      }
    });

    // --- Lobby events ---
    socket.on('player-joined', (data) => {
      players = data.players;
      renderLobbyPlayers();
    });

    socket.on('player-left', (data) => {
      players = data.players;
      renderLobbyPlayers();
    });

    socket.on('player-ready-changed', (data) => {
      players = data.players;
      renderLobbyPlayers();
    });

    socket.on('config-updated', (cfg) => {
      gameConfig = cfg;
    });

    // --- Game events ---
    socket.on('game-started', (data) => {
      players = data.players;
      gameState = data.game;
      gameConfig = data.config || gameConfig;
      usedNames = [];

      showPage('game');
      renderGamePlayers();
      updateActivePlayer(data.currentPlayer);
      updateNamesCount();
    });

    socket.on('answer-result', (data) => {
      if (data.result === 'correct') {
        Bomb.showFeedback('correct');

        const name = ASMA_UL_HUSNA.find(n => n.id === data.nameId);
        if (name) {
          Bomb.showNamePopup(name);
          showLastName(name);
          addNameTag(name);
        }

        if (data.usedNames) usedNames = data.usedNames;
        if (data.players) players = data.players;
        if (data.nextPlayer) updateActivePlayer(data.nextPlayer);
        updateNamesCount();
        renderGamePlayers();

      } else if (data.result === 'already-used') {
        Bomb.showFeedback('already-used');
        Bomb.showToast('Déjà cité !', 'warning');

      } else if (data.result === 'invalid') {
        Bomb.showFeedback('invalid');
        Bomb.showToast('Nom inconnu !', 'error');
      }
    });

    socket.on('bomb-exploded', (data) => {
      Bomb.triggerExplosionAnimation();
      Bomb.playExplosion();
      // Update local player data
      const bombed = players.find(p => p.id === data.player.id);
      if (bombed) {
        bombed.lives = data.lives;
        if (data.eliminated) bombed.eliminated = true;
      }
      renderGamePlayers();
    });

    socket.on('player-eliminated', (data) => {
      players = data.players;
      Bomb.showToast(`${data.player.name} est éliminé !`, 'error');
      renderGamePlayers();
    });

    socket.on('new-round', (data) => {
      players = data.players;
      if (data.currentPlayer) {
        updateActivePlayer(data.currentPlayer);
        // Update gameState currentPlayerIndex
        if (gameState) {
          gameState.currentPlayerIndex = players.findIndex(p => p.id === data.currentPlayer.id);
        }
      }
      renderGamePlayers();
    });

    socket.on('bomb-passed', (data) => {
      // Visual update only — spectator doesn't control timer
    });

    socket.on('all-names-complete', () => {
      Bomb.showConfetti();
      Bomb.showToast('Tous les 99 noms !', 'correct');
    });

    socket.on('game-over', (data) => {
      showPage('results');
      AudioFX.playVictory();
      Bomb.showConfetti();

      document.getElementById('specResultsSubtitle').textContent =
        `${data.usedCount} noms cités en ${data.totalRounds} tours`;
      document.getElementById('specResultsNamesCount').textContent = data.usedCount;

      renderPodium(data.ranking);
      renderNamesGrid(data.usedNames);
    });

    // Player left during game
    socket.on('player-left-game', (data) => {
      players = data.players;
      Bomb.showToast(`${data.playerName} a quitté`, 'warning');
      renderGamePlayers();
    });

    // Host left during game
    socket.on('host-left-game', () => {
      Bomb.showToast('L\'hôte a quitté la partie', 'error');
      setTimeout(() => { window.location.href = '/'; }, 2500);
    });

    // Replay — back to lobby
    socket.on('replay-lobby', (data) => {
      players = data.players;
      gameConfig = data.config || gameConfig;
      gameState = null;
      usedNames = [];
      showPage('lobby');
      renderLobbyPlayers();
      Bomb.showToast('Nouvelle partie !', 'correct');
    });

    // Joueur kick
    socket.on('player-kicked', (data) => {
      players = data.players;
      renderGamePlayers();
      renderLobbyPlayers();
      Bomb.showToast(`${data.kickedPlayer.name} a été exclu`, 'warning');
    });

    // Déconnexions
    socket.on('player-disconnected', (data) => {
      players = data.players;
      renderGamePlayers();
    });

    // Pause
    socket.on('game-paused', (data) => {
      if (data.paused) {
        Bomb.showToast('Partie en pause', 'info');
      } else {
        Bomb.showToast('Reprise !', 'info');
      }
    });

    let hostCountdown = null;

    socket.on('host-disconnected', (data) => {
      const seconds = (data && data.timeout) || 60;
      let remaining = seconds;
      Bomb.showToast(`L'hôte s'est déconnecté — fermeture dans ${remaining}s`, 'warning');

      if (hostCountdown) clearInterval(hostCountdown);
      hostCountdown = setInterval(() => {
        remaining--;
        if (remaining > 0 && remaining % 15 === 0) {
          Bomb.showToast(`L'hôte est absent — fermeture dans ${remaining}s`, 'warning');
        }
        if (remaining <= 0) {
          clearInterval(hostCountdown);
          hostCountdown = null;
        }
      }, 1000);
    });

    socket.on('host-reconnected', () => {
      if (hostCountdown) {
        clearInterval(hostCountdown);
        hostCountdown = null;
      }
      Bomb.showToast('L\'hôte est de retour', 'info');
    });

    socket.on('room-closed', () => {
      if (hostCountdown) {
        clearInterval(hostCountdown);
        hostCountdown = null;
      }
      Bomb.showToast('L\'hôte a quitté — retour à l\'accueil', 'error');
      setTimeout(() => { window.location.href = '/'; }, 2500);
    });
  }

  // --- RENDU ---

  function renderLobbyPlayers() {
    const list = document.getElementById('specLobbyPlayers');
    if (!list) return;

    document.getElementById('specLobbyCount').textContent = players.length;

    list.innerHTML = players.map(p => `
      <div class="player-card" style="--player-color: ${p.color};">
        <div class="player-avatar" style="background: ${p.color};">
          ${p.name.charAt(0).toUpperCase()}
        </div>
        <div class="player-info">
          <div class="player-name">${escapeHtml(p.name)}</div>
        </div>
      </div>
    `).join('');
  }

  function renderGamePlayers() {
    const list = document.getElementById('specPlayersList');
    if (!list) return;

    list.innerHTML = players.map(p => {
      const isActive = gameState && players[gameState.currentPlayerIndex] &&
                       players[gameState.currentPlayerIndex].id === p.id;

      const maxLives = (gameConfig && gameConfig.lives) || 3;
      const hearts = Array(maxLives).fill(0).map((_, i) =>
        `<svg class="life-icon ${i < p.lives ? '' : 'lost'}" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>`
      ).join('');

      return `
        <div class="spectator-player-row ${isActive ? 'active' : ''} ${p.eliminated ? 'eliminated' : ''}" style="--player-color: ${p.color};">
          <div class="player-avatar-sm" style="background: ${p.color};">
            ${p.name.charAt(0).toUpperCase()}
          </div>
          <div class="player-info">
            <div class="player-name">${escapeHtml(p.name)}</div>
            <div class="player-score-label">${p.score} PTS</div>
          </div>
          <div class="spectator-lives">${hearts}</div>
        </div>
      `;
    }).join('');
  }

  function updateActivePlayer(player) {
    const el = document.getElementById('specActivePlayer');
    if (el && player) {
      el.textContent = player.name;
      el.style.color = player.color || 'var(--text-primary)';
    }
  }

  function updateNamesCount() {
    const el = document.getElementById('specNamesCount');
    if (el) el.textContent = usedNames.length;
  }

  function showLastName(name) {
    const card = document.getElementById('specLastName');
    const arabic = document.getElementById('specLastArabic');
    const translit = document.getElementById('specLastTranslit');
    const meaning = document.getElementById('specLastMeaning');

    if (card) card.classList.remove('hidden');
    if (arabic) arabic.textContent = name.arabic;
    if (translit) translit.textContent = name.transliteration;
    if (meaning) meaning.textContent = name.french;
  }

  function addNameTag(name) {
    const list = document.getElementById('specNamesUsedList');
    if (!list) return;

    const tag = document.createElement('span');
    tag.className = 'name-tag name-validated';
    tag.textContent = name.transliteration;
    list.appendChild(tag);
    list.scrollTop = list.scrollHeight;
  }

  function renderPodium(ranking) {
    const container = document.getElementById('specPodiumContainer');
    if (!container) return;

    const top3 = ranking.slice(0, 3);
    const ordered = top3.length >= 2 ? [top3[1], top3[0], top3[2]].filter(Boolean) : top3;
    const places = ['second', 'first', 'third'];
    const labels = ['2', '1', '3'];

    const badgeColors = ['var(--gold-bright)', 'var(--accent)', 'var(--violet)'];
    const rankColors = [badgeColors[1], badgeColors[0], badgeColors[2]]; // 2nd, 1st, 3rd order

    container.innerHTML = ordered.map((p, i) => `
      <div class="podium-place" style="animation: staggerInLeft 0.5s ease-out ${i * 0.15}s both;">
        <div class="podium-rank-badge" style="
          width: 32px; height: 32px; border-radius: 50%;
          background: ${rankColors[i]}; color: var(--bg-deep);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-size: 0.8rem; font-weight: 800;
          box-shadow: 0 0 16px ${rankColors[i]};
        ">${labels[i]}</div>
        <div class="podium-avatar" style="background: ${p.color};">
          ${p.name.charAt(0).toUpperCase()}
        </div>
        <div class="podium-player-name">${escapeHtml(p.name)}</div>
        <div class="podium-score">${p.score} PTS</div>
        <div class="podium-bar ${places[i]}">${labels[i]}</div>
      </div>
    `).join('');
  }

  function renderNamesGrid(usedNameIds) {
    const grid = document.getElementById('specNamesResultsGrid');
    if (!grid) return;

    grid.innerHTML = usedNameIds.map(id => {
      const name = ASMA_UL_HUSNA.find(n => n.id === id);
      if (!name) return '';
      return `
        <div class="name-result-card">
          <div class="name-result-arabic">${name.arabic}</div>
          <div class="name-result-translit">${name.transliteration}</div>
          <div class="name-result-meaning">${name.french}</div>
        </div>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  document.addEventListener('DOMContentLoaded', init);
})();
