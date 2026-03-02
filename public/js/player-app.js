/**
 * Al-Asmaa — Application Joueur
 * Gère la vue mobile du joueur : rejoindre, lobby, saisie, résultats
 */
(() => {
  'use strict';
  // console.log('[Player] v14.0 — premium results page redesign');

  // --- État ---
  let socket = null;
  let roomCode = '';
  let myPlayer = null;
  let players = [];
  let gameConfig = {};
  let gameState = null;
  let isMyTurn = false;
  let usedNames = [];
  // selectedSuggestion removed (autocomplete supprimé)
  let activePlayerId = null;
  let currentTypingText = '';
  let myTypingText = '';
  let jokersRemaining = 0;

  // --- Leave popup ---
  function showClassicLeavePopup(name, color, isDisconnect) {
    var existing = document.querySelector('.classic-leave-popup');
    if (existing) existing.remove();

    var safeName = name || '';
    var initial = safeName ? safeName.charAt(0).toUpperCase() : '?';
    var label = isDisconnect ? 's\u2019est déconnecté' : 'a quitté';
    var popup = document.createElement('div');
    popup.className = 'classic-leave-popup';

    var avatar = document.createElement('div');
    avatar.className = 'classic-leave-popup-avatar';
    avatar.style.background = color || 'var(--gold)';
    avatar.textContent = initial;

    var text = document.createElement('div');
    text.className = 'classic-leave-popup-text';
    var nameSpan = document.createElement('span');
    nameSpan.className = 'classic-leave-popup-name';
    nameSpan.textContent = safeName;
    text.appendChild(nameSpan);
    text.appendChild(document.createTextNode(' ' + label));

    popup.appendChild(avatar);
    popup.appendChild(text);
    document.body.appendChild(popup);

    requestAnimationFrame(function() { popup.classList.add('popup-in'); });
    setTimeout(function() {
      popup.classList.remove('popup-in');
      popup.classList.add('popup-out');
      setTimeout(function() { popup.remove(); }, 400);
    }, 2800);
  }

  // --- Références DOM ---
  const pages = {
    join: document.getElementById('pageJoin'),
    lobby: document.getElementById('pageLobby'),
    game: document.getElementById('pagePlayerGame'),
    results: document.getElementById('pageResults')
  };

  // --- Initialisation ---
  function init() {
    // Extraire le code room depuis l'URL
    const pathMatch = window.location.pathname.match(/\/join\/([A-Z0-9]+)/i);
    if (pathMatch) {
      roomCode = pathMatch[1].toUpperCase();
    }

    // Extraire le nom depuis le query string
    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get('name');

    document.getElementById('displayRoomCode').textContent = roomCode || '---';

    // Connexion Socket.io
    socket = io();

    // Determine name: URL param > localStorage pseudo > none
    const storedPseudo = localStorage.getItem('al-asmaa-pseudo') || '';
    const nameToUse = nameParam || storedPseudo;

    // Pseudo obligatoire : si pas de pseudo, rediriger vers l'accueil
    if (!nameToUse) {
      window.location.href = '/';
      return;
    }

    // Check room state before proceeding
    if (roomCode) {
      fetch('/api/check-room/' + encodeURIComponent(roomCode))
        .then(r => r.json())
        .then(data => {
          if (!data.exists) {
            showPlayerUnavailable('expired');
          } else if (data.state === 'playing') {
            // Partie en cours → tenter la reconnexion (le serveur accepte si le nom existe)
            joinRoom(nameToUse);
          } else if (data.state !== 'lobby') {
            showPlayerUnavailable('started');
          } else if (data.isFull) {
            showPlayerUnavailable('full');
          } else {
            // Room OK + pseudo dispo → join direct
            joinRoom(nameToUse);
          }
        })
        .catch(() => {
          // Network error, try joining anyway
          joinRoom(nameToUse);
        });
    }

    // Événements UI
    setupJoinEvents();
    setupLobbyEvents();
    setupGameEvents();
    setupResultsEvents();

    // Événements Socket.io
    setupSocketEvents();
  }

  function showPlayerUnavailable(reason) {
    // Rediriger vers l'accueil avec le motif en query param
    window.location.href = '/?join=' + encodeURIComponent(reason);
  }

  // --- Navigation ---
  function showPage(pageId) {
    Object.values(pages).forEach(p => {
      if (p) p.classList.remove('active');
    });
    if (pages[pageId]) {
      pages[pageId].classList.add('active');
    }
  }

  // --- REJOINDRE ---
  function setupJoinEvents() {
    // Plus besoin d'événements : le pseudo est déjà défini, join automatique
  }

  function joinRoom(name) {
    if (!roomCode || !name) return;

    Bomb.initAudio();
    AudioFX.init();

    socket.emit('join-room', { code: roomCode, name }, (response) => {
      // Cacher l'écran de chargement
      const loading = document.getElementById('loadingScreen');
      if (loading) loading.classList.add('hidden');

      if (response.success) {
        myPlayer = response.player;
        players = response.players;
        gameConfig = response.config;

        // Reconnexion en cours de partie
        if (response.state === 'playing' && response.game) {
          gameState = response.game;
          usedNames = response.game.usedNames || [];

          // Restaurer les jokers
          jokersRemaining = myPlayer.jokersRemaining !== undefined ? myPlayer.jokersRemaining : 0;

          // Déterminer le joueur actif
          const currentPlayer = players[response.game.currentPlayerIndex];
          activePlayerId = currentPlayer ? currentPlayer.id : null;
          isMyTurn = currentPlayer && currentPlayer.id === myPlayer.id;

          showGamePage();
          updateGameUI();
          renderScoreboard('playerScoreboard', players, myPlayer.id);

          // Timer avec temps restant
          const elapsed = (Date.now() - response.game.timerStart) / 1000;
          const remaining = Math.max(1, response.game.timerDuration - elapsed);
          Bomb.start(remaining, null);

          Bomb.showToast('Reconnecté à la partie !', 'correct');
        } else {
          document.getElementById('lobbyRoomCode').textContent = roomCode;
          renderLobbyPlayers();
          showPage('lobby');
        }
      } else {
        // Rejoindre échoué → retour accueil avec message
        window.location.href = '/?join=expired';
      }
    });
  }

  // --- LOBBY ---
  let isReady = false;

  function setupLobbyEvents() {
    const readyBtn = document.getElementById('btnToggleReady');
    const readyLabel = readyBtn.querySelector('.plobby-ready-label');
    const readyIcon = readyBtn.querySelector('.plobby-ready-icon');

    readyBtn.addEventListener('click', () => {
      socket.emit('player-ready');
      isReady = !isReady;
      if (readyLabel) readyLabel.textContent = isReady ? 'Annuler' : 'Prêt';
      if (readyIcon) readyIcon.style.display = isReady ? 'none' : '';
      readyBtn.classList.toggle('plobby-ready-active', isReady);
    });

    document.getElementById('btnPlayerLeave').addEventListener('click', () => {
      socket.emit('player-leave');
      window.location.href = '/';
    });

    // Init player lobby particles
    initPlayerLobbyParticles();
  }

  function initPlayerLobbyParticles() {
    const canvas = document.getElementById('playerLobbyParticles');
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

    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.4,
        dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.35 + 0.08
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 162, 76, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  function renderLobbyPlayers() {
    const list = document.getElementById('lobbyPlayersListPlayer');
    const count = document.getElementById('lobbyPlayerCount');
    if (!list) return;

    if (count) count.textContent = players.length;

    list.innerHTML = players.map((p, i) => `
      <div class="plobby-player${p.ready ? ' is-ready' : ''}" style="animation-delay: ${i * 0.06}s; --p-color: ${p.color};">
        <div class="plobby-player-avatar" style="--p-color: ${p.color};">
          ${p.name.charAt(0).toUpperCase()}
        </div>
        <div class="plobby-player-info">
          <div class="plobby-player-name">
            ${escapeHtml(p.name)}
            ${p.id === (myPlayer && myPlayer.id) ? '<span class="plobby-player-you">toi</span>' : ''}
            ${p.isHost ? '<span class="plobby-player-host">hôte</span>' : ''}
          </div>
        </div>
        <div class="plobby-player-ready ${p.ready ? 'is-ready' : ''}">
          ${p.ready ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </div>
      </div>
    `).join('');
  }

  // --- JEU ---
  function setupGameEvents() {
    const answerInput = document.getElementById('answerInput');
    const submitBtn = document.getElementById('btnSubmitAnswer');

    // Saisie — broadcast typing + Enter pour valider
    answerInput.addEventListener('input', () => {
      if (isMyTurn) {
        myTypingText = answerInput.value;
        updatePlayerTypingDisplay();
        if (socket) socket.emit('player-typing', { text: answerInput.value });
      }
    });

    answerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitAnswer();
      }
    });

    // Bouton valider (backup tactile)
    submitBtn.addEventListener('click', submitAnswer);

    // Joker button
    const jokerBtn = document.getElementById('playerBtnJoker');
    if (jokerBtn) {
      jokerBtn.addEventListener('click', () => useJoker());
    }

    // Leave game button — premium dialog
    const leaveBtn = document.getElementById('btnLeaveGame');
    if (leaveBtn) {
      leaveBtn.addEventListener('click', () => {
        const dlg = document.getElementById('dlgLeaveConfirm');
        if (dlg) dlg.classList.add('visible');
      });
    }

    const dlgLeaveOverlay = document.getElementById('dlgLeaveConfirm');
    const dlgLeaveCancel = document.getElementById('dlgLeaveCancel');
    const dlgLeaveConfirmBtn = document.getElementById('dlgLeaveConfirmBtn');
    // Close on overlay click
    if (dlgLeaveOverlay) {
      dlgLeaveOverlay.addEventListener('click', (e) => {
        if (e.target === dlgLeaveOverlay) dlgLeaveOverlay.classList.remove('visible');
      });
    }
    if (dlgLeaveCancel) {
      dlgLeaveCancel.addEventListener('click', () => {
        document.getElementById('dlgLeaveConfirm').classList.remove('visible');
      });
    }
    if (dlgLeaveConfirmBtn) {
      dlgLeaveConfirmBtn.addEventListener('click', () => {
        document.getElementById('dlgLeaveConfirm').classList.remove('visible');
        socket.emit('leave-game');
        window.location.href = '/';
      });
    }
  }

  // --- Joker system ---
  function updateJokerButton() {
    const btn = document.getElementById('playerBtnJoker');
    if (!btn) return;
    const badge = btn.querySelector('.gp-joker-badge');
    if (badge) badge.textContent = jokersRemaining;
    if (jokersRemaining <= 0) {
      btn.classList.add('hidden');
    } else {
      btn.classList.remove('hidden');
      if (isMyTurn) {
        btn.disabled = false;
        btn.classList.remove('disabled');
      } else {
        btn.disabled = true;
        btn.classList.add('disabled');
      }
    }
  }

  function useJoker() {
    if (!isMyTurn || jokersRemaining <= 0) return;
    socket.emit('use-joker', (response) => {
      if (response && response.success) {
        jokersRemaining = response.jokersRemaining;
        updateJokerButton();
        showJokerHint(response.french, response.category);
      } else {
        Bomb.showToast(response.message || 'Joker indisponible', 'warning');
      }
    });
  }

  function showJokerHint(french, category) {
    const categoryLabels = {
      mercy: 'Miséricorde', sovereignty: 'Souveraineté', beauty: 'Beauté',
      majesty: 'Majesté', power: 'Puissance', knowledge: 'Connaissance',
      creation: 'Création', provision: 'Subsistance', justice: 'Justice',
      guidance: 'Guidance', protection: 'Protection', uniqueness: 'Unicité'
    };
    const catLabel = categoryLabels[category] || category;

    let popup = document.getElementById('jokerHintPopup');
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'jokerHintPopup';
      popup.className = 'joker-hint-popup';
      document.body.appendChild(popup);
    }
    popup.innerHTML = `
      <div class="joker-hint-content">
        <div class="joker-hint-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold-bright)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg></div>
        <div class="joker-hint-french">${escapeHtml(french)}</div>
        <div class="joker-hint-category">${escapeHtml(catLabel)}</div>
      </div>`;
    popup.classList.add('visible');
    setTimeout(() => popup.classList.remove('visible'), 4000);
  }

  let submitLocked = false;

  function submitAnswer() {
    const answerInput = document.getElementById('answerInput');
    const val = answerInput.value.trim();
    if (!val || !isMyTurn || submitLocked) return;

    submitLocked = true;

    // Valider localement d'abord
    const result = Validator.validate(val, usedNames, ASMA_UL_HUSNA);

    socket.emit('submit-answer', {
      answer: val,
      nameId: result.nameId,
      valid: result.valid
    }, (response) => {
      // Déverrouiller après réponse serveur
      submitLocked = false;
    });

    // Reset l'input + clear typing broadcast
    answerInput.value = '';
    myTypingText = '';
    updatePlayerTypingDisplay();
    if (socket) socket.emit('player-typing', { text: '' });

    // Sécurité : déverrouiller après 3s en cas de non-réponse
    setTimeout(() => { submitLocked = false; }, 3000);
  }

  // --- RÉSULTATS ---
  function setupResultsEvents() {
    document.getElementById('btnPlayerBackHome').addEventListener('click', () => {
      window.location.href = '/';
    });

    const replayBtn = document.getElementById('btnPlayerReplay');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        // Attendre que l'hôte relance — afficher un état d'attente
        replayBtn.disabled = true;
        replayBtn.textContent = 'En attente de l\'hôte...';
      });
    }
  }

  // --- ÉVÉNEMENTS SOCKET.IO ---
  function setupSocketEvents() {
    // --- Gestion déconnexion/reconnexion ---
    let disconnectTimer = null;

    socket.on('disconnect', () => {
      const overlay = document.getElementById('disconnectOverlay');
      if (overlay) overlay.classList.remove('hidden');
      Bomb.stop();
      // Match server's 60s grace period (30s player elimination + margin)
      disconnectTimer = setTimeout(() => {
        window.location.href = '/?join=expired';
      }, 60000);
    });

    socket.on('connect', () => {
      const overlay = document.getElementById('disconnectOverlay');
      if (overlay && !overlay.classList.contains('hidden')) {
        overlay.classList.add('hidden');
        Bomb.showToast('Reconnecté !', 'correct');
        // Re-join the room after reconnection (new socket ID)
        if (roomCode && myPlayer) {
          socket.emit('join-room', { code: roomCode, name: myPlayer.name }, (response) => {
            if (response && response.success) {
              myPlayer = response.player;
              players = response.players;
              if (response.state === 'playing' && response.game) {
                gameState = response.game;
                activePlayerId = response.game.currentPlayerIndex != null
                  ? players[response.game.currentPlayerIndex]?.id : null;
                isMyTurn = activePlayerId === myPlayer.id && !myPlayer.eliminated;
                updateGameUI();
                renderPlayerArena();
                renderScoreboard('playerScoreboard', players, myPlayer.id);
              } else {
                renderLobbyPlayers();
              }
            }
          });
        }
      }
      if (disconnectTimer) {
        clearTimeout(disconnectTimer);
        disconnectTimer = null;
      }
    });

    // Joueur rejoint
    socket.on('player-joined', (data) => {
      players = data.players;
      renderLobbyPlayers();
    });

    // Ready changed
    socket.on('player-ready-changed', (data) => {
      players = data.players;
      renderLobbyPlayers();
    });

    // Joueur a quitté
    socket.on('player-left', (data) => {
      players = data.players;
      renderLobbyPlayers();
    });

    // Config mise à jour
    socket.on('config-updated', (cfg) => {
      gameConfig = cfg;
    });

    // Partie lancée
    socket.on('game-started', (data) => {
      players = data.players;
      gameConfig = data.config;
      gameState = data.game;
      usedNames = [];

      // Trouver mon joueur mis à jour
      myPlayer = players.find(p => p.id === myPlayer.id) || myPlayer;
      jokersRemaining = myPlayer.jokersRemaining !== undefined ? myPlayer.jokersRemaining : 0;

      // Déterminer si c'est mon tour
      const currentPlayer = data.currentPlayer;
      activePlayerId = currentPlayer ? currentPlayer.id : null;
      isMyTurn = currentPlayer && currentPlayer.id === myPlayer.id;

      showGamePage();
      updateGameUI();
      renderScoreboard('playerScoreboard', players, myPlayer.id);

      // Start visual timer (player doesn't control explosion — host does)
      const bombTime = (data.game && data.game.timerDuration) || gameConfig.bombTime || 10;
      Bomb.start(bombTime, null);
    });

    // Résultat d'une réponse
    socket.on('answer-result', (data) => {
      if (data.result === 'correct') {
        currentTypingText = '';
        Bomb.showFeedback('correct');

        const name = ASMA_UL_HUSNA.find(n => n.id === data.nameId);
        if (name) {
          Bomb.showNamePopup(name);
        }

        // Mettre à jour les noms utilisés
        if (data.usedNames) {
          usedNames = data.usedNames;
        } else if (data.nameId) {
          usedNames.push(data.nameId);
        }

        // Mettre à jour les joueurs depuis le serveur
        if (data.players) {
          players = data.players;
          myPlayer = players.find(p => p.id === myPlayer.id) || myPlayer;
        } else if (data.playerId === myPlayer.id && data.score !== undefined) {
          myPlayer.score = data.score;
        }

        renderScoreboard('playerScoreboard', players, myPlayer.id);

        // Déterminer le prochain tour
        if (data.nextPlayer) {
          activePlayerId = data.nextPlayer.id;
          isMyTurn = data.nextPlayer.id === myPlayer.id;
        }

        updateGameUI();
        renderPlayerArena();

        // Restart visual timer for next turn
        Bomb.stop();
        Bomb.resetDisplay();
        setTimeout(() => {
          const dur = data.timerDuration || (gameState && gameState.timerDuration) || gameConfig.bombTime || 10;
          Bomb.start(dur, null);
        }, 300);

      } else if (data.result === 'already-used') {
        Bomb.showFeedback('already-used');
        Bomb.showToast('Déjà cité !', 'warning');
        showArenaError();

      } else if (data.result === 'invalid') {
        Bomb.showFeedback('invalid');
        Bomb.showToast('Nom inconnu !', 'error');
        showArenaError();
      }
    });

    // Bombe explose — animate, don't re-render (new-round will re-render)
    socket.on('bomb-exploded', (data) => {
      Bomb.stop();
      Bomb.triggerExplosionAnimation();

      // Animate bomb hit in the arena
      animateBombHit('playerArena', data.player.id);

      if (data.player.id === myPlayer.id) {
        myPlayer.lives = data.lives;
        if (data.eliminated) {
          myPlayer.eliminated = true;
        }
      }

      // Update local player lives
      const bombed = players.find(p => p.id === data.player.id);
      if (bombed) {
        bombed.lives = data.lives;
        if (data.eliminated) bombed.eliminated = true;
      }
      // DON'T renderPlayerArena() — let animation play, new-round will re-render
    });

    // Joueur éliminé — update state, DON'T re-render (animation is playing)
    socket.on('player-eliminated', (data) => {
      players = data.players;

      if (data.player.id === myPlayer.id) {
        myPlayer.eliminated = true;
        AudioFX.playElimination();
      }

      // If game is ending (only 1 left), trigger explosion animation
      // because bomb-exploded won't fire in this case
      if (data.remainingPlayers <= 1) {
        Bomb.triggerExplosionAnimation();
        animateBombHit('playerArena', data.player.id);
      }

      Bomb.showToast(`${data.player.name} est éliminé !`, 'error');
      // DON'T render — new-round or game-over will handle the transition
    });

    // Joueur quitte la partie
    socket.on('player-left-game', (data) => {
      players = data.players;
      showClassicLeavePopup(data.playerName, data.playerColor);
      renderPlayerArena();
      renderScoreboard('playerScoreboard', players, myPlayer.id);
    });

    // L'hôte a quitté — popup premium + retour à l'accueil
    socket.on('host-left-game', () => {
      Bomb.stop();
      Bomb.resetDisplay();
      gameState = null;
      isMyTurn = false;
      activePlayerId = null;
      // Fermer tout dialog ouvert
      const leaveDlg = document.getElementById('dlgLeaveConfirm');
      if (leaveDlg) leaveDlg.classList.remove('visible');
      // Afficher le popup d'info
      const dlg = document.getElementById('dlgHostLeft');
      if (dlg) {
        dlg.classList.add('visible');
        const okBtn = document.getElementById('dlgHostLeftOk');
        if (okBtn) {
          const newOk = okBtn.cloneNode(true);
          okBtn.parentNode.replaceChild(newOk, okBtn);
          newOk.addEventListener('click', () => {
            window.location.href = '/';
          });
        }
      } else {
        window.location.href = '/';
      }
    });

    // Nouveau tour — delay to let explosion animation finish
    socket.on('new-round', (data) => {
      players = data.players;
      myPlayer = players.find(p => p.id === myPlayer.id) || myPlayer;
      activePlayerId = data.currentPlayer ? data.currentPlayer.id : null;
      currentTypingText = '';
      myTypingText = '';

      // Update isMyTurn IMMEDIATELY so typing events use the correct value
      isMyTurn = !myPlayer.eliminated && data.currentPlayer && data.currentPlayer.id === myPlayer.id;

      Bomb.stop();
      Bomb.resetDisplay();

      // Delay UI update so bomb/shake/heart animations can play
      setTimeout(() => {
        // Guard: don't switch if game ended (results page is showing)
        if (pages.results.classList.contains('active')) return;

        updateGameUI();
        renderPlayerArena();
        renderScoreboard('playerScoreboard', players, myPlayer.id);

        // Restart visual timer
        const dur = data.timerDuration || (gameState && gameState.timerDuration) || gameConfig.bombTime || 10;
        Bomb.start(dur, null);
      }, 950);
    });

    // Bombe passée (reset timer visuel)
    socket.on('bomb-passed', (data) => {
      Bomb.stop();
      Bomb.resetDisplay();
      if (data && data.timerDuration) {
        Bomb.start(data.timerDuration, null);
      }
    });

    // Tous les noms complétés
    socket.on('all-names-complete', () => {
      Bomb.stop();
      Bomb.showConfetti();
      Bomb.showToast('Tous les 99 noms ont été cités !', 'correct');
    });

    // Fin de partie
    socket.on('game-over', (data) => {
      Bomb.stop();
      Bomb.resetDisplay();
      AudioFX.playVictory();
      showResultsPage(data);
    });

    // Replay — retour en lobby
    socket.on('replay-lobby', (data) => {
      // console.log('[Player] replay-lobby reçu:', data.code, 'players:', data.players.length);
      players = data.players;
      myPlayer = players.find(p => p.id === myPlayer.id) || myPlayer;
      gameState = null;
      isMyTurn = false;
      activePlayerId = null;
      usedNames = [];
      jokersRemaining = 0;
      isReady = false;
      const readyBtn = document.getElementById('btnToggleReady');
      if (readyBtn) {
        const label = readyBtn.querySelector('.plobby-ready-label');
        const icon = readyBtn.querySelector('.plobby-ready-icon');
        if (label) label.textContent = 'Prêt';
        if (icon) icon.style.display = '';
        readyBtn.classList.remove('plobby-ready-active');
      }
      // Re-enable replay button
      const replayBtn = document.getElementById('btnPlayerReplay');
      if (replayBtn) {
        replayBtn.disabled = false;
        replayBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg> Rejouer';
      }
      showPage('lobby');
      renderLobbyPlayers();
      Bomb.showToast('Nouvelle partie !', 'correct');
    });

    // Déconnexion de l'hôte — compteur 60s
    let hostCountdown = null;

    socket.on('host-disconnected', (data) => {
      Bomb.stop();
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

    // Room fermée — redirection accueil
    socket.on('room-closed', () => {
      if (hostCountdown) {
        clearInterval(hostCountdown);
        hostCountdown = null;
      }
      Bomb.showToast('L\'hôte a quitté — retour à l\'accueil', 'error');
      setTimeout(() => { window.location.href = '/'; }, 2500);
    });

    // Joueur kick
    socket.on('kicked-from-room', (data) => {
      Bomb.showToast(data.message || 'Tu as été exclu', 'error');
      setTimeout(() => { window.location.href = '/'; }, 2000);
    });

    socket.on('player-kicked', (data) => {
      players = data.players;
      renderLobbyPlayers();
      Bomb.showToast(`${data.kickedPlayer.name} a été exclu`, 'warning');
    });

    // Joueur déconnecté
    socket.on('player-disconnected', (data) => {
      players = data.players;
      showClassicLeavePopup(data.player.name, data.player.color, true);
    });

    // Player typing (from active player)
    socket.on('player-typing', (data) => {
      // Only accept typing from the active player — don't override activePlayerId
      if (data.playerId && data.playerId === activePlayerId && data.playerId !== myPlayer.id) {
        currentTypingText = data.text || '';
        updatePlayerTypingDisplay();
      }
    });

    // Pause
    socket.on('game-paused', (data) => {
      if (data.paused) {
        Bomb.stop();
        Bomb.showToast('Partie en pause', 'info');
      } else {
        Bomb.showToast('Reprise !', 'info');
        Bomb.start(Bomb.getRemaining() || 5, null);
      }
    });
  }

  // --- Affichage des pages de jeu ---

  function showGamePage() {
    showPage('game');
    renderPlayerArena();
  }

  function updateGameUI() {
    const controls = document.getElementById('playerControls');
    const label = document.getElementById('playerGameLabel');

    if (myPlayer.eliminated) {
      controls.classList.add('hidden');
      label.textContent = 'Éliminé !';
      label.style.color = 'var(--ruby)';
    } else if (isMyTurn) {
      controls.classList.remove('hidden');
      label.textContent = "C'est ton tour !";
      label.style.color = 'var(--gold-bright)';
      const input = document.getElementById('answerInput');
      if (input) { input.value = ''; setTimeout(() => input.focus(), 100); }
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      AudioFX.playWarning();
    } else {
      controls.classList.add('hidden');
      const activeP = players.find(p => p.id === activePlayerId);
      label.textContent = activeP ? `${activeP.name} joue...` : 'En attente...';
      label.style.color = '';
    }
    updateCounters();
    updateJokerButton();
    updateTurnIndicator();
  }

  function showResultsPage(data) {
    showPage('results');

    // Detect tie
    const isTie = data.isTie || (data.ranking.length >= 2 && data.ranking[0].score === data.ranking[1].score);

    document.getElementById('playerResultsSubtitle').textContent =
      `${data.usedCount} noms cités en ${data.totalRounds} tours`;

    // Determine my rank
    const myRank = myPlayer ? data.ranking.findIndex(p => p.id === myPlayer.id) : -1;

    // Spawn background orbs
    spawnBgOrbs('playerResultsBgOrbs');

    // Animate banner (with tie awareness)
    renderResultsBanner('playerResultsBanner', 'playerResultsBannerIcon', 'playerResultsBannerTitle', 'playerResultsBannerRank', 'playerResultsBannerParticles', 'playerResultsGlow', myRank, isTie);

    // Confetti for victory or tie only, not for defeat
    if (!isTie && myRank === 0) {
      Bomb.showConfetti();
    } else if (isTie) {
      Bomb.showConfetti();
    }

    // Podium
    renderPodium(data.ranking, 'playerPodiumContainer', isTie);

    // Animated stats
    animateStats({
      namesCount: 'playerResultsNamesCount',
      accuracy: 'playerResultsAccuracy',
      rounds: 'playerResultsRounds',
      namesResultsCount: 'playerNamesResultsCount'
    }, data);

    // Grille des noms with staggered animation
    renderNamesGrid(data.usedNames, 'playerNamesResultsGrid');
  }

  // SVG icons for results
  const RES_ICONS = {
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
    medal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
    crown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>',
    handshake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1"/><path d="M13 17a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-1"/><path d="M8 7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v1H8V7Z"/><path d="M12 11v2"/><path d="m15 4 2-2"/><path d="m9 4-2-2"/></svg>'
  };

  function renderResultsBanner(bannerId, iconId, titleId, rankId, particlesId, glowId, myRank, isTie) {
    const banner = document.getElementById(bannerId);
    const iconEl = document.getElementById(iconId);
    const title = document.getElementById(titleId);
    const rankEl = document.getElementById(rankId);
    const particles = document.getElementById(particlesId);
    const glow = document.getElementById(glowId);
    if (!banner) return;

    banner.className = 'res-banner';
    if (glow) glow.className = 'res-glow';

    if (isTie) {
      banner.classList.add('tie');
      if (glow) glow.classList.add('tie');
      if (iconEl) iconEl.innerHTML = RES_ICONS.handshake;
      if (title) title.textContent = 'ÉGALITÉ';
      if (rankEl) rankEl.textContent = 'Aucun vainqueur — scores identiques !';
      spawnBannerParticles(particles, 'tie');
    } else if (myRank === 0) {
      banner.classList.add('victory');
      if (glow) glow.classList.add('victory');
      if (iconEl) iconEl.innerHTML = RES_ICONS.trophy;
      if (title) title.textContent = 'VICTOIRE';
      if (rankEl) rankEl.textContent = 'Tu as remporté la partie !';
      spawnBannerParticles(particles, 'gold');
    } else if (myRank === 1) {
      banner.classList.add('place-2');
      if (glow) glow.classList.add('silver');
      if (iconEl) iconEl.innerHTML = RES_ICONS.medal;
      if (title) title.textContent = '2ÈME PLACE';
      if (rankEl) rankEl.textContent = 'Si proche de la victoire...';
      spawnBannerParticles(particles, 'silver');
    } else if (myRank === 2) {
      banner.classList.add('place-3');
      if (glow) glow.classList.add('bronze');
      if (iconEl) iconEl.innerHTML = RES_ICONS.medal;
      if (title) title.textContent = '3ÈME PLACE';
      if (rankEl) rankEl.textContent = 'Sur le podium !';
      spawnBannerParticles(particles, 'bronze');
    } else {
      banner.classList.add('defeat');
      if (iconEl) iconEl.innerHTML = RES_ICONS.shield;
      if (title) title.textContent = 'DÉFAITE';
      if (rankEl) rankEl.textContent = myRank >= 0 ? `${myRank + 1}ème place` : 'Fin de partie';
    }
  }

  function spawnBannerParticles(container, color) {
    if (!container) return;
    container.innerHTML = '';
    const palettes = {
      gold: ['#ffd866', '#d4a24c', '#f0cc7a', '#fff6c2', '#a67c2e'],
      silver: ['#c0c0c0', '#e8e8e8', '#a0a0a0', '#d4d4d4', '#b0b0b0'],
      bronze: ['#cd7f32', '#e8a960', '#b87333', '#d4a060', '#a0693e'],
      tie: ['#a78bfa', '#818cf8', '#c4b5fd', '#7c3aed', '#ddd6fe']
    };
    const colors = palettes[color] || palettes.gold;
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'res-banner-particle' + (Math.random() > 0.5 ? ' diamond' : '');
      const size = 3 + Math.random() * 8;
      const left = Math.random() * 100;
      const delay = Math.random() * 3;
      const dur = 2 + Math.random() * 3;
      const ty = -(30 + Math.random() * 100);
      const tx = -30 + Math.random() * 60;
      p.style.cssText = `width:${size}px;height:${size}px;left:${left}%;bottom:0;background:${colors[Math.floor(Math.random() * colors.length)]};animation-delay:${delay}s;--dur:${dur}s;--ty:${ty}px;--tx:${tx}px;--op:${0.4 + Math.random() * 0.5};`;
      container.appendChild(p);
    }
  }

  function spawnBgOrbs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const orb = document.createElement('div');
      orb.className = 'res-bg-orb';
      const size = 120 + Math.random() * 200;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 5;
      const dur = 8 + Math.random() * 12;
      const hue = 30 + Math.random() * 20; // gold range
      orb.style.cssText = `width:${size}px;height:${size}px;left:${x}%;top:${y}%;--orb-dur:${dur}s;--orb-delay:${delay}s;background:radial-gradient(circle,hsla(${hue},60%,55%,0.08) 0%,transparent 70%);`;
      container.appendChild(orb);
    }
  }

  function animateStats(ids, data) {
    const namesEl = document.getElementById(ids.namesCount);
    const accEl = document.getElementById(ids.accuracy);
    const roundsEl = document.getElementById(ids.rounds);
    const countEl = document.getElementById(ids.namesResultsCount);

    const usedCount = data.usedCount || 0;
    const accuracy = Math.round((usedCount / 99) * 100);
    const rounds = data.totalRounds || 0;

    if (countEl) countEl.textContent = `${usedCount}/99`;

    // Animate counters after a delay
    setTimeout(() => {
      animateCounter(namesEl, 0, usedCount, 1200);
      animateCounter(accEl, 0, accuracy, 1400, '%');
      animateCounter(roundsEl, 0, rounds, 1000);
    }, 800);
  }

  function animateCounter(el, from, to, duration, suffix) {
    if (!el) return;
    suffix = suffix || '';
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(from + (to - from) * eased);
      el.textContent = val + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function updateCounters() {
    const count = usedNames.length;
    const names = document.getElementById('playerNamesCount');
    if (names) names.textContent = count + '/99';

    // Update progress ring
    const ring = document.getElementById('playerProgressRing');
    if (ring) {
      const circumference = 2 * Math.PI * 26; // ~163.36
      const ratio = count / 99;
      ring.style.strokeDashoffset = circumference * (1 - ratio);
    }

    // Update progress bar
    const fill = document.getElementById('playerProgressFill');
    if (fill) fill.style.width = ((count / 99) * 100) + '%';
    const label = document.getElementById('playerProgressLabel');
    if (label) label.textContent = count;
  }

  function updateTurnIndicator() {
    const avatar = document.getElementById('playerTurnAvatar');
    const label = document.getElementById('playerGameLabel');
    const banner = document.getElementById('playerTurnIndicator');
    if (!avatar || !label) return;

    const activeP = players.find(p => p.id === activePlayerId);
    if (activeP) {
      avatar.textContent = activeP.name.charAt(0).toUpperCase();
      avatar.style.background = activeP.color;
    }
    if (banner) banner.classList.toggle('is-my-turn', isMyTurn);
  }

  function renderScoreboard(containerId, playersList, myId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const sorted = [...playersList].sort((a, b) => b.score - a.score);
    container.innerHTML = sorted.map((p, i) => {
      const isMe = p.id === myId;
      const initial = p.name.charAt(0).toUpperCase();
      return `
        <div class="sb-row ${p.eliminated ? 'eliminated' : ''} ${isMe ? 'is-me' : ''}">
          <span class="sb-rank">${i + 1}</span>
          <span class="sb-avatar" style="background: ${p.color};">${initial}</span>
          <span class="sb-name">${escapeHtml(p.name)}${isMe ? ' <small>(toi)</small>' : ''}</span>
          <span class="sb-score">${p.score}</span>
        </div>`;
    }).join('');
  }

  // --- Typing display, Error cross & Bomb animations ---

  function updatePlayerTypingDisplay() {
    const arena = document.getElementById('playerArena');
    if (!arena) return;

    const text = isMyTurn ? myTypingText : currentTypingText;
    const hasText = text && text.trim();

    // Try finding bubble by active class first, then fallback to activePlayerId
    let bubble = arena.querySelector('.arena-player.active .arena-player-typing');
    if (!bubble && activePlayerId) {
      const playerEl = arena.querySelector(`[data-player-id="${activePlayerId}"]`);
      if (playerEl) {
        bubble = playerEl.querySelector('.arena-player-typing');
        // If no bubble exists yet (arena not re-rendered), create one
        if (!bubble) {
          bubble = document.createElement('div');
          bubble.className = 'arena-player-typing';
          playerEl.appendChild(bubble);
        }
      }
    }

    if (bubble) {
      if (hasText) {
        bubble.textContent = text;
        bubble.classList.add('visible');
      } else {
        bubble.textContent = '';
        bubble.classList.remove('visible');
      }
    }
  }

  function showArenaError() {
    const container = document.getElementById('playerArena');
    if (!container) return;
    const cross = container.querySelector('.arena-error-cross');
    if (!cross) return;
    cross.classList.remove('animate');
    void cross.offsetWidth;
    cross.classList.add('animate');
    setTimeout(() => cross.classList.remove('animate'), 900);
  }

  function animateBombHit(containerId, playerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. Bomb explosion flash
    const bomb = container.querySelector('.arena-center-bomb');
    if (bomb) {
      bomb.classList.add('exploding');
      setTimeout(() => bomb.classList.remove('exploding'), 750);
    }

    // 2. Spawn explosion particles
    spawnExplosionParticles(container);

    // 3. Find the affected player
    const playerEl = container.querySelector(`[data-player-id="${playerId}"]`);
    if (!playerEl) return;

    // 4. Red flash on avatar
    playerEl.classList.add('just-hit');
    setTimeout(() => playerEl.classList.remove('just-hit'), 700);

    // 5. Shake the avatar
    const avatarWrap = playerEl.querySelector('.arena-avatar-wrap');
    if (avatarWrap) {
      avatarWrap.classList.add('shaking');
      setTimeout(() => avatarWrap.classList.remove('shaking'), 650);
    }

    // 6. Last alive heart flies away
    const hearts = playerEl.querySelectorAll('.arena-heart.alive');
    if (hearts.length > 0) {
      const lastHeart = hearts[hearts.length - 1];
      lastHeart.classList.remove('alive');
      lastHeart.classList.add('flying');
      setTimeout(() => {
        lastHeart.classList.remove('flying');
        lastHeart.classList.add('lost');
      }, 900);
    }
  }

  function spawnExplosionParticles(container) {
    const circle = container.querySelector('.arena-circle');
    if (!circle) return;
    const bomb = container.querySelector('.arena-center-bomb');
    if (!bomb) return;

    const bombRect = bomb.getBoundingClientRect();
    const circleRect = circle.getBoundingClientRect();
    const cx = bombRect.left + bombRect.width / 2 - circleRect.left;
    const cy = bombRect.top + bombRect.height / 2 - circleRect.top;

    const colors = ['#ff6b35', '#ffd93d', '#ff4444', '#ff8c00', '#ffaa00', '#ef4444'];

    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div');
      p.className = 'arena-explosion-particle';
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.4;
      const dist = 25 + Math.random() * 55;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const dur = 0.45 + Math.random() * 0.45;
      const size = 3 + Math.random() * 7;
      p.style.cssText = `left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random() * colors.length)]};--tx:${tx}px;--ty:${ty}px;--dur:${dur}s;`;
      circle.appendChild(p);
      setTimeout(() => p.remove(), dur * 1000 + 50);
    }
  }

  // --- Arena (circle layout) ---

  function renderArena(containerId, playersList, currentActiveId, configLives, myId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const count = playersList.length;
    if (count === 0) { container.innerHTML = ''; return; }

    const isCompact = container.classList.contains('arena-compact');

    // Circle sizing — use maximum available space
    const pad = isCompact ? 42 : 50;
    const avail = container.clientWidth || 340;
    const radius = Math.max(60, Math.floor(avail / 2) - pad);

    const size = (radius + pad) * 2;
    const cx = size / 2;
    const cy = size / 2;

    const startAngle = -Math.PI / 2;
    const step = (2 * Math.PI) / count;

    const playersHtml = playersList.map((p, i) => {
      const isActive = p.id === currentActiveId;
      const isMe = p.id === myId;
      const initial = p.name.charAt(0).toUpperCase();

      const angle = startAngle + i * step;
      const px = cx + radius * Math.cos(angle);
      const py = cy + radius * Math.sin(angle);

      const livesHtml = Array(configLives).fill(0).map((_, j) =>
        `<svg class="arena-heart ${j < p.lives ? 'alive' : 'lost'}" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>`
      ).join('');

      const classes = [
        'arena-player',
        isActive ? 'active' : '',
        p.eliminated ? 'eliminated' : '',
        isMe ? 'is-me' : ''
      ].filter(Boolean).join(' ');

      // Typing text for the active player
      let typingHtml = '';
      if (isActive) {
        const txt = isMe ? myTypingText : currentTypingText;
        const hasTxt = txt && txt.trim();
        typingHtml = `<div class="arena-player-typing ${hasTxt ? 'visible' : ''}">${hasTxt ? escapeHtml(txt) : ''}</div>`;
      }

      return `
        <div class="${classes}" data-player-id="${p.id}"
             style="--player-color: ${p.color}; left: ${px.toFixed(1)}px; top: ${py.toFixed(1)}px;">
          <div class="arena-lives">${livesHtml}</div>
          <div class="arena-avatar-wrap">
            ${isActive ? '<div class="arena-active-ring"></div>' : ''}
            <div class="arena-avatar">${initial}</div>
            ${p.eliminated ? '<div class="arena-elim-badge"><svg viewBox="0 0 24 24" fill="none" stroke="var(--ruby)" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>' : ''}
          </div>
          <div class="arena-name ${p.eliminated ? 'crossed' : ''}">${escapeHtml(p.name)}</div>
          ${isMe ? '<div class="arena-me-tag">Toi</div>' : ''}
          ${typingHtml}
        </div>`;
    }).join('');

    const bombHtml = `
      <div class="arena-center-bomb">
        <div class="bomb-wrapper arena-bomb-wrapper">
          <svg class="timer-ring" viewBox="0 0 210 210">
            <circle class="timer-ring-bg" cx="105" cy="105" r="100"/>
            <circle class="timer-ring-progress" id="playerTimerRing" cx="105" cy="105" r="100"
                    stroke-dasharray="628.32" stroke-dashoffset="0"/>
          </svg>
          <svg class="bomb-svg" viewBox="0 0 160 180">
            <defs>
              <radialGradient id="arenaBombG" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stop-color="#555"/>
                <stop offset="40%" stop-color="#333"/>
                <stop offset="100%" stop-color="#111"/>
              </radialGradient>
            </defs>
            <ellipse cx="80" cy="170" rx="50" ry="8" fill="rgba(0,0,0,0.3)"/>
            <circle cx="80" cy="100" r="55" fill="url(#arenaBombG)"/>
            <rect x="70" y="42" width="20" height="14" rx="3" fill="#555"/>
            <path d="M80 42 Q85 30 95 28 Q105 26 100 15" fill="none" stroke="#8B4513" stroke-width="3" stroke-linecap="round"/>
            <g>
              <circle cx="100" cy="14" r="6" fill="rgba(255,165,0,0.4)" class="fuse-glow"/>
              <circle cx="100" cy="12" r="4" fill="#ffd93d" class="fuse-spark"/>
              <circle cx="100" cy="10" r="2" fill="#fff" class="fuse-spark"/>
            </g>
          </svg>
          <div class="bomb-timer-text" id="playerTimerText">--</div>
        </div>
      </div>`;

    // Error cross overlay (inside circle)
    const errorCrossHtml = `
      <div class="arena-error-cross">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--ruby)" stroke-width="3" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </div>`;

    container.innerHTML = `
      <div class="arena-circle" style="width:${size}px;height:${size}px;">
        ${bombHtml}
        ${errorCrossHtml}
        ${playersHtml}
      </div>`;
  }

  function renderPlayerArena() {
    if (!myPlayer) return;
    renderArena('playerArena', players, activePlayerId, gameConfig.lives || 3, myPlayer.id);
  }

  // --- RENDU ---

  function renderPodium(ranking, containerId, isTie) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (isTie) container.classList.add('is-tie');
    else container.classList.remove('is-tie');

    const top3 = ranking.slice(0, 3);
    const ordered = top3.length >= 2 ? [top3[1], top3[0], top3[2]].filter(Boolean) : top3;
    const places = ['second', 'first', 'third'];
    const labels = ['2', '1', '3'];

    container.innerHTML = ordered.map((p, i) => {
      const isFirst = places[i] === 'first';
      const isMe = myPlayer && p.id === myPlayer.id;
      // In tie mode, don't show crown and equalize visual treatment
      const showCrown = isFirst && !isTie;
      const tieClass = isTie && (places[i] === 'first' || places[i] === 'second') ? ' pod-tied' : '';
      return `
        <div class="pod-col ${places[i]}${tieClass}" style="--pod-index:${i}">
          <div class="pod-avatar" style="background: ${p.color};">
            ${showCrown ? '<span class="pod-crown">' + RES_ICONS.crown + '</span>' : ''}
            ${p.name.charAt(0).toUpperCase()}
          </div>
          <div class="pod-name ${isMe ? 'pod-me' : ''}">${escapeHtml(p.name)}${isMe ? ' (toi)' : ''}</div>
          <div class="pod-score">${p.score} PTS</div>
          <div class="pod-bar">${isTie && (places[i] === 'first' || places[i] === 'second') ? '=' : labels[i]}</div>
        </div>`;
    }).join('');
  }

  function renderNamesGrid(usedNameIds, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = usedNameIds.map((id, idx) => {
      const name = ASMA_UL_HUSNA.find(n => n.id === id);
      if (!name) return '';
      return `<div class="res-name-chip found" style="--chip-index:${idx}" title="${name.transliteration || ''}">${name.arabic}</div>`;
    }).join('');
  }

  // --- Utilitaires ---
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Lancement ---
  document.addEventListener('DOMContentLoaded', init);
})();
