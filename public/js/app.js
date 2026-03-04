/**
 * Al-Asmaa — Application Principale (vue Hôte)
 * Gère la création de room, le lobby et la vue hôte pendant le jeu
 */
(() => {
  'use strict';
  // console.log('[Host] v14.0 — premium results page redesign');

  // --- État ---
  let socket = null;
  let roomCode = '';
  let players = [];
  let gameState = null;
  let config = { difficulty: 'intermediate', lives: 3, mode: 'classic', maxPlayers: 8, jokers: 2 };
  let jokersRemaining = 0;
  let hostPlayer = null;   // Host's player object
  let isMyTurn = false;    // Whether it's currently the host's turn
  let activePlayerId = null; // ID of the current active player
  let currentTypingText = '';  // What the active player is currently typing (from socket)
  let myTypingText = '';       // What the host is currently typing locally
  let visibility = 'private';  // Room visibility ('public' | 'private')
  let browseInterval = null;   // Polling interval for public rooms

  // SVG icon templates (Lucide-style)
  const ICONS = {
    clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    zap: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    flame: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    skull: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M8 20v2h8v-2"/><path d="m12.5 17-.5-1-.5 1h1z"/><path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20"/></svg>',
    lock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    globe: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
    heart: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    users: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  };

  // --- Références DOM ---
  const pages = {
    home: document.getElementById('pageHome'),
    gameSelect: document.getElementById('pageGameSelect'),
    createRoom: document.getElementById('pageCreateRoom'),
    hostLobby: document.getElementById('pageHostLobby'),
    hostGame: document.getElementById('pageHostGame'),
    results: document.getElementById('pageResults'),
    encyclopedia: document.getElementById('pageEncyclopedia'),
    training: document.getElementById('pageTraining'),
    miniGames: document.getElementById('pageMiniGames'),
    guide: document.getElementById('pageGuide'),
    ilmQuestCreate: document.getElementById('pageIlmQuestCreate'),
    ilmQuestLobby: document.getElementById('pageIlmQuestLobby'),
    ilmQuestGame: document.getElementById('pageIlmQuestGame'),
    ilmQuestResults: document.getElementById('pageIlmQuestResults')
  };

  // URL mapping for pushState routing
  const pageRoutes = {
    home: '/',
    encyclopedia: '/encyclopedie',
    training: '/entrainement',
    miniGames: '/mini-jeux',
    guide: '/guide'
  };
  const routeToPage = {};
  Object.entries(pageRoutes).forEach(([k, v]) => { routeToPage[v] = k; });
  // Alias: /99-noms-allah → encyclopedia
  routeToPage['/99-noms-allah'] = 'encyclopedia';

  // Slug helper for name URLs
  function toSlug(transliteration) {
    return transliteration.toLowerCase()
      .replace(/[''`\u2019\u2018]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
  // Pre-build slug → name map
  const slugToName = {};
  ASMA_UL_HUSNA.forEach(n => { slugToName[toSlug(n.transliteration)] = n; });
  const STRICT_RELIGIOUS_MODE = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('strict_religious') === '1') return true;
      if (params.get('strict_religious') === '0') return false;
      const stored = localStorage.getItem('strict_religious_mode');
      if (stored === 'true') return true;
      if (stored === 'false') return false;
    } catch (_) {}
    // Mode preview par defaut: contenu complet visible
    return false;
  })();
  const integrityEntryCache = new Map();

  async function preloadIntegrityEntryForName(name) {
    if (!STRICT_RELIGIOUS_MODE || !name) return null;
    const slug = toSlug(name.transliteration);
    if (integrityEntryCache.has(slug)) {
      name.encyclopediaIntegrity = integrityEntryCache.get(slug);
      return name.encyclopediaIntegrity;
    }
    try {
      const response = await fetch('/api/encyclopedia-integrity/' + encodeURIComponent(slug));
      const payload = await response.json();
      const entry = payload && payload.entry
        ? payload.entry
        : {
          slug: slug,
          public_display_allowed: false,
          editorial_review: { status: 'needs_human_review' },
          publication_blockers: ['INSUFFICIENT_EVIDENCE']
        };
      integrityEntryCache.set(slug, entry);
      name.encyclopediaIntegrity = entry;
      return entry;
    } catch (_) {
      const fallback = {
        slug: slug,
        public_display_allowed: false,
        editorial_review: { status: 'needs_human_review' },
        publication_blockers: ['INTEGRITY_SERVICE_UNAVAILABLE']
      };
      integrityEntryCache.set(slug, fallback);
      name.encyclopediaIntegrity = fallback;
      return fallback;
    }
  }

  // Encyclopedia state
  let encyFilter = 'all';
  let encySearch = '';
  let encyDetailIndex = -1;

  // Training state
  let trainingCategory = 'all';
  let trainingMode = null;
  let trainingSession = [];
  let trainingIndex = 0;
  let trainingScore = 0;
  let trainingStreak = 0;
  let matchingState = null;
  let quizTimerInterval = null;

  // --- Utilitaire debounce ---
  function debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // --- Pseudo System ---
  const PSEUDO_KEY = 'al-asmaa-pseudo';

  function getPseudo() {
    return localStorage.getItem(PSEUDO_KEY) || '';
  }

  function savePseudo(name) {
    localStorage.setItem(PSEUDO_KEY, name);
    updatePseudoBadge();
    updateCreatePseudoPreview();
    // Also update Ilm Quest create page pseudo preview if visible
    if (typeof IlmQuest !== 'undefined' && IlmQuest.updateCreatePseudoPreview) {
      IlmQuest.updateCreatePseudoPreview();
    }
  }

  function updatePseudoBadge() {
    const pseudo = getPseudo();
    const nameEl = document.getElementById('pseudoName');
    const avatarEl = document.getElementById('pseudoAvatar');
    if (nameEl) {
      nameEl.textContent = pseudo || 'Choisir ton pseudo';
    }
    if (avatarEl) {
      avatarEl.innerHTML = pseudo ? pseudo.charAt(0).toUpperCase() : ICONS.user;
      avatarEl.style.fontSize = pseudo ? '1rem' : '';
      avatarEl.style.fontWeight = pseudo ? '700' : '';
      avatarEl.style.color = pseudo ? 'var(--gold-light)' : '';
    }
  }

  function openPseudoModal() {
    const modal = document.getElementById('pseudoModal');
    const input = document.getElementById('inputPseudo');
    if (!modal || !input) return;
    input.value = getPseudo();
    modal.classList.remove('hidden');
    setTimeout(() => input.focus(), 100);
  }

  function closePseudoModal() {
    if (!getPseudo()) return; // Don't close until a pseudo is saved
    const modal = document.getElementById('pseudoModal');
    if (modal) modal.classList.add('hidden');
  }

  function setupPseudoSystem() {
    const badge = document.getElementById('pseudoBadge');
    const saveBtn = document.getElementById('btnPseudoSave');
    const input = document.getElementById('inputPseudo');
    const modal = document.getElementById('pseudoModal');

    if (badge) badge.addEventListener('click', openPseudoModal);

    if (input && saveBtn) {
      input.addEventListener('input', () => {
        saveBtn.disabled = input.value.trim().length < 1;
      });
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim().length >= 1) {
          savePseudo(input.value.trim());
          closePseudoModal();
        }
      });
      saveBtn.addEventListener('click', () => {
        if (input.value.trim().length >= 1) {
          savePseudo(input.value.trim());
          closePseudoModal();
        }
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closePseudoModal();
      });
    }

    updatePseudoBadge();

    // Force pseudo modal on first visit
    if (!getPseudo()) {
      openPseudoModal();
    }
  }

  // --- Hero Particles ---
  function spawnHeroParticles(x, y, count) {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = 40 + Math.random() * 80;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const dur = 0.6 + Math.random() * 0.6;
      p.style.cssText = `left:${x - rect.left}px;top:${y - rect.top}px;--tx:${tx}px;--ty:${ty}px;--dur:${dur}s;width:${2 + Math.random() * 4}px;height:${2 + Math.random() * 4}px;`;
      container.appendChild(p);
      setTimeout(() => p.remove(), dur * 1000);
    }
  }

  function setupHeroInteractions() {
    const heroArabic = document.getElementById('heroArabic');
    if (!heroArabic) return;
    heroArabic.addEventListener('click', (e) => {
      spawnHeroParticles(e.clientX, e.clientY, 16);
    });
    heroArabic.addEventListener('mouseenter', (e) => {
      spawnHeroParticles(e.clientX, e.clientY, 8);
    });
  }

  // --- Scroll Reveal ---
  function setupScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // --- Initialisation ---
  function init() {
    // Cacher l'écran de chargement
    setTimeout(() => {
      const loading = document.getElementById('loadingScreen');
      if (loading) loading.classList.add('hidden');
    }, 1000);

    // Connexion Socket.io
    socket = io();

    // Vérifier si on revient d'un join échoué
    const joinParams = new URLSearchParams(window.location.search);
    const joinReason = joinParams.get('join');
    if (joinReason) {
      // Nettoyer l'URL
      window.history.replaceState({}, '', '/');
      // Afficher le toast après le chargement
      setTimeout(() => {
        if (joinReason === 'started') {
          Bomb.showToast('Cette partie a déjà commencé', 'warning');
        } else if (joinReason === 'full') {
          Bomb.showToast('Ce salon est complet', 'warning');
        } else if (joinReason === 'expired') {
          Bomb.showToast('Ce salon n\u2019existe plus', 'warning');
        }
      }, 1200);
    }

    // Pseudo system
    setupPseudoSystem();
    setupHeroInteractions();
    setupDonateCollapse();
    setupReportSystem();

    // Événements UI
    setupHomeEvents();
    setupCreateEvents();
    setupLobbyEvents();
    setupGameEvents();
    setupResultsEvents();
    setupEncyclopediaEvents();
    setupTrainingEvents();
    setupMiniGamesEvents();
    setupGuideEvents();

    // Événements Socket.io
    setupSocketEvents();

    // Scroll animations
    setupScrollReveal();

    // Détection URL /lobby/CODE pour reconnexion hôte
    const lobbyMatch = window.location.pathname.match(/\/lobby\/([A-Z0-9]+)/i);
    if (lobbyMatch) {
      const code = lobbyMatch[1].toUpperCase();
      const tryReconnect = () => {
        socket.emit('host-reconnect', { code }, (response) => {
          if (response && response.success) {
            roomCode = response.code;
            players = response.players || [];
            config = { ...config, ...response.config };
            config.maxPlayers = response.maxPlayers;
            visibility = response.visibility || 'private';
            hostPlayer = players.find(p => p.isHost) || players[0];

            // Partie en cours → restaurer le jeu
            if (response.state === 'playing' && response.game) {
              gameState = response.game;
              if (hostPlayer) {
                jokersRemaining = hostPlayer.jokersRemaining !== undefined ? hostPlayer.jokersRemaining : (config.jokers || 0);
              }
              const currentPlayer = players[response.game.currentPlayerIndex] || null;
              activePlayerId = currentPlayer ? currentPlayer.id : null;

              showPage('hostGame');
              document.getElementById('gameModeLabel').textContent = 'Classique';
              renderHostArena();
              updateHostControls(currentPlayer);
              updateTurnIndicator(currentPlayer);
              updateNamesCount();
              renderScoreboard('hostScoreboard', players, hostPlayer ? hostPlayer.id : null);

              // Reprendre le timer avec le temps restant
              const elapsed = (Date.now() - response.game.timerStart) / 1000;
              const remaining = Math.max(1, response.game.timerDuration - elapsed);
              Bomb.start(remaining, () => {
                socket.emit('bomb-explode');
              });

              Bomb.showToast('Partie restaurée !', 'correct');
            } else {
              // Lobby → afficher le lobby
              document.getElementById('roomCodeDisplay').textContent = response.code;
              if (response.qr) {
                document.getElementById('qrCodeImg').src = response.qr;
              }
              document.getElementById('roomUrlDisplay').textContent = response.url;

              previousPlayerIds = [];
              updateLobbyConfigSummary();
              renderLobbyPlayers();
              showPage('hostLobby');
              initLobbyParticles();
            }
          } else {
            Bomb.showToast('Salon introuvable', 'warning');
            history.replaceState({}, '', '/');
            showPage('home');
          }
        });
      };
      if (socket.connected) {
        tryReconnect();
      } else {
        socket.once('connect', tryReconnect);
      }
    }

    // Détection URL /iq/CODE pour rejoindre une partie Ilm Quest
    const iqMatch = window.location.pathname.match(/\/iq\/([A-Z0-9]+)/i);
    if (iqMatch) {
      const iqCode = iqMatch[1].toUpperCase();
      const pseudo = getPseudo();
      if (!pseudo) {
        // Need pseudo first — open modal, then join after save
        openPseudoModal();
        const saveBtn = document.getElementById('btnPseudoSave');
        const oneTimeJoin = () => {
          saveBtn.removeEventListener('click', oneTimeJoin);
          setTimeout(() => attemptIqJoin(iqCode), 100);
        };
        if (saveBtn) saveBtn.addEventListener('click', oneTimeJoin);
      } else {
        setTimeout(() => attemptIqJoin(iqCode), 200);
      }
    }
  }

  function attemptIqJoin(code) {
    fetch('/api/check-room/' + encodeURIComponent(code))
      .then(r => r.json())
      .then(data => {
        if (data.exists && data.gameType === 'ilm-quest' && data.state === 'lobby') {
          IlmQuest.joinGame(code);
        } else if (data.exists && data.gameType === 'ilm-quest') {
          showIqUnavailable('started');
        } else if (data.exists && data.gameType === 'classic' && data.state === 'lobby') {
          window.location.href = '/join/' + code + '?name=' + encodeURIComponent(getPseudo());
        } else if (data.exists) {
          showIqUnavailable('started');
        } else {
          showIqUnavailable('expired');
        }
      })
      .catch(() => {
        showIqUnavailable('error');
      });
  }

  window.showIqUnavailable = showIqUnavailable;
  function showIqUnavailable(reason) {
    history.replaceState({}, '', '/');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    var page = document.getElementById('pageIqUnavailable');
    if (!page) { showPage('home'); return; }
    page.classList.add('active');

    var iconEl = document.getElementById('iqUnavailIcon');
    var titleEl = document.getElementById('iqUnavailTitle');
    var descEl = document.getElementById('iqUnavailDesc');

    if (reason === 'started') {
      if (iconEl) iconEl.innerHTML = '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
      if (titleEl) titleEl.textContent = 'Partie en cours';
      if (descEl) descEl.textContent = 'Cette partie a déjà commencé. Tu ne peux plus la rejoindre.';
    } else if (reason === 'expired') {
      if (iconEl) iconEl.innerHTML = '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
      if (titleEl) titleEl.textContent = 'Partie expirée';
      if (descEl) descEl.textContent = 'Ce salon n\u2019existe plus ou a déjà été terminé.';
    } else {
      if (iconEl) iconEl.innerHTML = '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
      if (titleEl) titleEl.textContent = 'Erreur de connexion';
      if (descEl) descEl.textContent = 'Impossible de joindre le serveur. Vérifie ta connexion et réessaie.';
    }

    var homeBtn = document.getElementById('iqUnavailHome');
    if (homeBtn) {
      homeBtn.onclick = function() {
        document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
        var home = document.getElementById('pageHome');
        if (home) home.classList.add('active');
      };
    }
  }

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

  // --- Navigation ---
  function showPage(pageId, pushHistory) {
    // Auto-cleanup: si on quitte le lobby/jeu classique, fermer la room
    const leavingLobby = pages.hostLobby && pages.hostLobby.classList.contains('active');
    const leavingGame = pages.hostGame && pages.hostGame.classList.contains('active');
    const leavingResults = pages.results && pages.results.classList.contains('active');
    const goingToRoomPage = (pageId === 'hostLobby' || pageId === 'hostGame' || pageId === 'results');
    if ((leavingLobby || leavingGame || leavingResults) && !goingToRoomPage && roomCode && socket) {
      socket.emit(leavingResults ? 'leave-game' : 'leave-room');
      roomCode = '';
      players = [];
      hostPlayer = null;
      gameState = null;
      isMyTurn = false;
      activePlayerId = null;
    }

    // Auto-cleanup: si on quitte une page Ilm Quest, notifier les joueurs
    const leavingIqLobby = pages.ilmQuestLobby && pages.ilmQuestLobby.classList.contains('active');
    const leavingIqGame = pages.ilmQuestGame && pages.ilmQuestGame.classList.contains('active');
    const goingToIqPage = (pageId === 'ilmQuestLobby' || pageId === 'ilmQuestGame');
    if ((leavingIqLobby || leavingIqGame) && !goingToIqPage && typeof IlmQuest !== 'undefined') {
      const iqState = IlmQuest.getState();
      if (iqState.isHost && iqState.roomCode) {
        IlmQuest.executeQuit();
      }
    }

    Object.values(pages).forEach(p => {
      if (p) p.classList.remove('active');
    });
    if (pages[pageId]) {
      pages[pageId].classList.add('active');
    }
    // Update URL for main pages
    if (pushHistory !== false && pageRoutes[pageId]) {
      const url = pageRoutes[pageId];
      if (window.location.pathname !== url) {
        history.pushState({ page: pageId }, '', url);
      }
    }
    // Refresh home stats when returning to home
    if (pageId === 'home') {
      updateHomeStats();
    }
  }

  // Handle browser back/forward
  window.addEventListener('popstate', (e) => {
    // Check for /nom/:slug in state or URL
    if (e.state && e.state.nameSlug) {
      const name = slugToName[e.state.nameSlug];
      if (name) { openEncyclopediaDetailByName(name, false); return; }
    }
    const path = window.location.pathname;
    const nomMatch = path.match(/^\/nom\/([a-z0-9-]+)$/);
    if (nomMatch) {
      const name = slugToName[nomMatch[1]];
      if (name) { openEncyclopediaDetailByName(name, false); return; }
    }
    // Handle /iq/:code
    const iqPopMatch = path.match(/^\/iq\/([A-Z0-9]+)$/i);
    if (iqPopMatch) {
      attemptIqJoin(iqPopMatch[1].toUpperCase());
      return;
    }
    const pageId = (e.state && e.state.page) ? e.state.page : routeToPage[path] || 'home';
    if (pageId === 'encyclopedia') { showEncyclopedia(); showPage('encyclopedia', false); }
    else if (pageId === 'training') { showTraining(); showPage('training', false); }
    else if (pageId === 'miniGames') { showPage('miniGames', false); MiniGames.renderHub(); }
    else if (pageId === 'guide') { showPage('guide', false); revealGuideElements(); }
    else { showPage('home', false); }
  });

  // Handle initial URL on page load
  (function handleInitialRoute() {
    const path = window.location.pathname;
    // Check for /nom/:slug pattern
    const nomMatch = path.match(/^\/nom\/([a-z0-9-]+)$/);
    if (nomMatch) {
      const slug = nomMatch[1];
      const name = slugToName[slug];
      if (name) {
        setTimeout(() => {
          openEncyclopediaDetailByName(name);
        }, 100);
        return;
      }
    }
    const pageId = routeToPage[path];
    if (pageId && pageId !== 'home') {
      setTimeout(() => {
        if (pageId === 'encyclopedia') showEncyclopedia();
        else if (pageId === 'training') showTraining();
        else if (pageId === 'miniGames') showMiniGames();
        else if (pageId === 'guide') { showPage('guide'); revealGuideElements(); }
        else showPage(pageId);
      }, 100);
    }
  })();

  // --- PAGE ACCUEIL ---
  function setupHomeEvents() {
    // Créer une partie — ouvre la sélection de jeu
    document.getElementById('btnCreateRoom').addEventListener('click', () => {
      stopBrowsePolling();
      showPage('gameSelect');
    });

    // --- Game Selection ---
    setupGameSelectEvents();

    // --- Join Modal ---
    const joinModal = document.getElementById('joinModal');
    const codeInput = document.getElementById('inputRoomCode');
    const joinBtn = document.getElementById('btnJoinConfirm');

    document.getElementById('btnJoinRoom').addEventListener('click', () => {
      const pseudo = getPseudo();
      if (!pseudo) {
        Bomb.showToast('Choisis un pseudo d\'abord', 'warning');
        openPseudoModal();
        return;
      }
      joinModal.classList.remove('hidden');
      codeInput.value = '';
      joinBtn.disabled = true;
      setTimeout(() => codeInput.focus(), 100);
    });

    joinModal.addEventListener('click', (e) => {
      if (e.target === joinModal) joinModal.classList.add('hidden');
    });

    codeInput.addEventListener('input', () => {
      joinBtn.disabled = codeInput.value.trim().length < 4;
    });

    function shakeJoinModal() {
      const card = joinModal.querySelector('.modal-card');
      card.classList.add('shake-invalid');
      codeInput.classList.add('input-invalid');
      setTimeout(() => {
        card.classList.remove('shake-invalid');
        codeInput.classList.remove('input-invalid');
        joinBtn.disabled = codeInput.value.trim().length < 4;
      }, 600);
    }

    function attemptJoin() {
      const code = codeInput.value.trim().toUpperCase();
      if (code.length < 4) return;
      joinBtn.disabled = true;
      fetch('/api/check-room/' + encodeURIComponent(code))
        .then(r => r.json())
        .then(data => {
          if (!data.exists) {
            shakeJoinModal();
            return;
          }
          if (data.gameType === 'classic' && data.state === 'lobby') {
            joinModal.classList.add('hidden');
            window.location.href = '/join/' + code + '?name=' + encodeURIComponent(getPseudo());
          } else if (data.gameType === 'ilm-quest' && data.state === 'lobby') {
            joinModal.classList.add('hidden');
            IlmQuest.joinGame(code);
          } else if (data.exists) {
            joinModal.classList.add('hidden');
            showIqUnavailable('started');
          } else {
            shakeJoinModal();
          }
        })
        .catch(() => {
          shakeJoinModal();
        });
    }

    codeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && codeInput.value.trim().length >= 4) {
        attemptJoin();
      }
    });

    joinBtn.addEventListener('click', attemptJoin);


    // Parcourir
    document.getElementById('btnBrowseRooms').addEventListener('click', openBrowseModal);

    // Bouton refresh rooms
    document.getElementById('btnRefreshRooms').addEventListener('click', fetchPublicRooms);

    // Fermer le popup browse
    document.getElementById('btnCloseBrowse').addEventListener('click', closeBrowseModal);
    document.getElementById('browseModal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeBrowseModal();
    });

    // Home redesign init
    updateHomeStats();
  }

  // --- HOME STATS ---
  function updateHomeStats() {
    const statsEl = document.getElementById('homeStatsMini');
    if (!statsEl) return;

    const progress = (typeof Training !== 'undefined' && Training.getProgress) ? Training.getProgress() : { mastered: 0 };
    const streakData = JSON.parse(localStorage.getItem('al-asmaa-streak') || '{"count":0,"lastDate":""}');
    const streak = streakData.count || 0;
    const mastered = progress.mastered || 0;

    if (mastered === 0 && streak === 0) {
      statsEl.classList.add('hidden');
    } else {
      statsEl.classList.remove('hidden');
      const masteredEl = document.getElementById('homeStatMastered');
      const streakEl = document.getElementById('homeStatStreak');
      if (masteredEl) masteredEl.textContent = mastered;
      if (streakEl) streakEl.textContent = streak;
    }
  }


  // --- BROWSE PUBLIC ROOMS ---
  function openBrowseModal() {
    const modal = document.getElementById('browseModal');
    modal.classList.remove('closing');
    modal.classList.add('open');
    fetchPublicRooms();
    browseInterval = setInterval(fetchPublicRooms, 4000);
  }

  function closeBrowseModal() {
    const modal = document.getElementById('browseModal');
    modal.classList.add('closing');
    modal.classList.remove('open');
    stopBrowsePolling();
    const onEnd = () => {
      modal.classList.remove('closing');
      modal.removeEventListener('transitionend', onEnd);
    };
    modal.addEventListener('transitionend', onEnd, { once: true });
    setTimeout(() => modal.classList.remove('closing'), 350);
  }

  function stopBrowsePolling() {
    if (browseInterval) {
      clearInterval(browseInterval);
      browseInterval = null;
    }
  }

  function fetchPublicRooms() {
    fetch('/api/public-rooms')
      .then(r => r.json())
      .then(data => {
        // console.log('[Parcourir] Réponse API:', data);
        renderPublicRooms(data.rooms || []);
      })
      .catch((err) => {
        console.error('[Parcourir] Erreur:', err);
        renderPublicRooms([]);
      });
  }

  function renderPublicRooms(rooms) {
    const list = document.getElementById('publicRoomsList');
    if (!list) return;

    // Update count badge
    const countEl = document.getElementById('browseCount');
    if (countEl) {
      countEl.textContent = rooms.length === 0 ? 'Aucun salon' : rooms.length + (rooms.length === 1 ? ' salon en ligne' : ' salons en ligne');
    }

    if (rooms.length === 0) {
      list.innerHTML = `
        <div class="browse-empty">
          <div class="browse-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="browse-empty-text">Aucune partie en cours</div>
          <div class="browse-empty-hint">Crée une partie en mode <strong>Publique</strong> pour qu'elle apparaisse ici</div>
        </div>`;
      return;
    }

    const diffLabelsClassic = { beginner: 'Débutant', intermediate: 'Moyen', expert: 'Expert', ultimate: 'Ultime' };
    const diffLabelsIq = { debutant: 'Débutant', intermediaire: 'Moyen', avance: 'Avancé', mixte: 'Mixte' };
    const diffSvg = { beginner: ICONS.clock, intermediate: ICONS.zap, expert: ICONS.flame, ultimate: ICONS.skull };

    list.innerHTML = rooms.map(r => {
      const isIq = r.gameType === 'ilm-quest';
      const isFull = r.isFull || r.playerCount >= r.maxPlayers;
      const diffLabel = isIq
        ? (diffLabelsIq[r.difficulty] || r.difficulty)
        : (diffLabelsClassic[r.difficulty] || r.difficulty);
      const diffIcon = isIq ? ICONS.zap : (diffSvg[r.difficulty] || '');
      const typeTag = isIq
        ? '<span class="browse-room-tag browse-tag-iq">Ilm Quest</span>'
        : '<span class="browse-room-tag browse-tag-classic">Classic</span>';
      const fullTag = isFull ? '<span class="browse-room-tag browse-tag-full">Complet</span>' : '';
      return `
      <div class="browse-room${isFull ? ' browse-room-full' : ''}">
        <div class="browse-room-avatar">${escapeHtml(r.hostName.charAt(0).toUpperCase())}</div>
        <div class="browse-room-info">
          <div class="browse-room-host">${escapeHtml(r.hostName)}</div>
          <div class="browse-room-meta">
            ${typeTag}
            ${fullTag}
            <span class="browse-room-tag">${ICONS.users} ${r.playerCount}/${r.maxPlayers}</span>
            <span class="browse-room-tag">${diffIcon} ${diffLabel}</span>
          </div>
        </div>
        <button class="browse-room-join" data-join-code="${r.code}" data-game-type="${r.gameType || 'classic'}" ${isFull ? 'disabled' : ''}>
          ${isFull ? 'Complet' : 'Rejoindre'}
        </button>
      </div>`;
    }).join('');

    // Bind join buttons
    list.querySelectorAll('[data-join-code]').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.joinCode;
        const gameType = btn.dataset.gameType;
        const pseudo = getPseudo();
        if (!pseudo) {
          Bomb.showToast('Choisis un pseudo d\'abord', 'warning');
          return;
        }
        closeBrowseModal();
        if (gameType === 'ilm-quest') {
          IlmQuest.joinGame(code);
        } else {
          window.location.href = '/join/' + code + '?name=' + encodeURIComponent(pseudo);
        }
      });
    });
  }

  // --- PAGE CRÉATION DE PARTIE ---
  function updateCreatePseudoPreview() {
    const pseudo = getPseudo();
    const nameEl = document.getElementById('createPseudoName');
    const avatarEl = document.getElementById('createPseudoAvatar');
    if (nameEl) nameEl.textContent = pseudo || 'Choisir ton pseudo';
    if (avatarEl) {
      avatarEl.innerHTML = pseudo ? pseudo.charAt(0).toUpperCase() : ICONS.user;
      avatarEl.style.fontSize = pseudo ? '1rem' : '';
      avatarEl.style.fontWeight = pseudo ? '700' : '';
      avatarEl.style.color = pseudo ? 'var(--gold-light)' : '';
    }
  }

  // ── Donate collapse smooth animation ──
  function setupDonateCollapse() {
    const details = document.querySelector('.donate-collapse');
    if (!details) return;
    const summary = details.querySelector('.donate-summary');
    const body = details.querySelector('.donate-body');
    let animation = null;
    let isClosing = false;
    let isExpanding = false;

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      details.style.overflow = 'hidden';

      if (isClosing || !details.open) {
        open();
      } else if (isExpanding || details.open) {
        shrink();
      }
    });

    function shrink() {
      isClosing = true;
      summary.classList.remove('is-open');

      const startH = details.offsetHeight;
      const endH = summary.offsetHeight;

      if (animation) animation.cancel();

      animation = details.animate(
        { height: [startH + 'px', endH + 'px'] },
        { duration: 350, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
      );

      body.style.transition = 'opacity 0.2s ease';
      body.style.opacity = '0';

      animation.onfinish = () => onAnimFinish(false);
      animation.oncancel = () => { isClosing = false; };
    }

    function open() {
      details.style.height = details.offsetHeight + 'px';
      details.open = true;
      summary.classList.add('is-open');

      requestAnimationFrame(() => {
        isExpanding = true;
        const startH = details.offsetHeight;
        const endH = summary.offsetHeight + body.scrollHeight;

        if (animation) animation.cancel();

        animation = details.animate(
          { height: [startH + 'px', endH + 'px'] },
          { duration: 400, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
        );

        body.style.transition = 'opacity 0.3s ease 0.1s';
        body.style.opacity = '1';

        animation.onfinish = () => onAnimFinish(true);
        animation.oncancel = () => { isExpanding = false; };
      });
    }

    function onAnimFinish(isOpen) {
      details.open = isOpen;
      animation = null;
      isClosing = false;
      isExpanding = false;
      details.style.height = '';
      details.style.overflow = '';
      if (!isOpen) {
        body.style.opacity = '';
        body.style.transition = '';
      }
    }
  }

  // --- Stepper component ---
  function initStepper(id, onChange) {
    const el = document.getElementById(id);
    if (!el) return;
    const min = parseInt(el.dataset.min);
    const max = parseInt(el.dataset.max);
    let val = parseInt(el.dataset.value);
    const valueEl = el.querySelector('.stepper-value');
    const minusBtn = el.querySelector('.stepper-minus');
    const plusBtn = el.querySelector('.stepper-plus');

    function updateBtns() {
      minusBtn.classList.toggle('disabled', val <= min);
      plusBtn.classList.toggle('disabled', val >= max);
    }

    function bump() {
      valueEl.classList.add('bump');
      setTimeout(() => valueEl.classList.remove('bump'), 150);
    }

    minusBtn.addEventListener('click', () => {
      if (val <= min) return;
      val--;
      el.dataset.value = val;
      valueEl.textContent = val;
      bump();
      updateBtns();
      onChange(val);
    });

    plusBtn.addEventListener('click', () => {
      if (val >= max) return;
      val++;
      el.dataset.value = val;
      valueEl.textContent = val;
      bump();
      updateBtns();
      onChange(val);
    });

    updateBtns();
  }

  function renderPlayerIcons(count) {
    const container = document.getElementById('stepperPlayersIcons');
    if (!container) return;
    let html = '';
    for (let i = 0; i < 8; i++) {
      html += '<span class="stepper-icon' + (i < count ? ' active' : '') + '"></span>';
    }
    container.innerHTML = html;
  }

  // --- GAME SELECTION (Ilm Quest / Classic) ---
  function setupGameSelectEvents() {
    // Back to home
    const backBtn = document.getElementById('btnGameSelectBack');
    if (backBtn) {
      backBtn.addEventListener('click', () => showPage('home'));
    }

    // Classic mode — go to existing create room
    const classicBtn = document.getElementById('btnSelectClassic');
    if (classicBtn) {
      classicBtn.addEventListener('click', () => {
        updateCreatePseudoPreview();
        showPage('createRoom');
      });
    }

    // Ilm Quest — show config page
    const ilmQuestBtn = document.getElementById('btnSelectIlmQuest');
    if (ilmQuestBtn) {
      ilmQuestBtn.addEventListener('click', () => {
        IlmQuest.showCreatePage();
      });
    }

  }

  function setupCreateEvents() {
    // Back button — go to game selection instead of home
    document.getElementById('btnCreateBack').addEventListener('click', () => {
      showPage('gameSelect');
    });

    // Pseudo preview opens modal
    document.getElementById('createPseudoPreview').addEventListener('click', () => {
      openPseudoModal();
    });

    // Difficulty cards
    document.querySelectorAll('#createDiffGrid .create-diff-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('#createDiffGrid .create-diff-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        config.difficulty = card.dataset.value;
      });
    });

    // Lives hearts
    document.querySelectorAll('#createLivesRow .create-heart').forEach(heart => {
      heart.addEventListener('click', () => {
        const val = parseInt(heart.dataset.value);
        config.lives = val;
        document.querySelectorAll('#createLivesRow .create-heart').forEach(h => {
          const hVal = parseInt(h.dataset.value);
          h.classList.toggle('active', hVal <= val);
        });
      });
    });

    // Stepper: Jokers
    initStepper('stepperJokers', (val) => {
      config.jokers = val;
      // Update dots
      const dotsEl = document.getElementById('stepperJokersDots');
      if (dotsEl) {
        let dotsHtml = '';
        for (let i = 0; i < 3; i++) {
          dotsHtml += '<span class="stepper-dot' + (i < val ? ' active' : '') + '"></span>';
        }
        dotsEl.innerHTML = dotsHtml;
      }
    });

    // Stepper: Max players
    initStepper('stepperPlayers', (val) => {
      config.maxPlayers = val;
      renderPlayerIcons(val);
    });
    // Render initial player icons
    renderPlayerIcons(config.maxPlayers);

    // Visibility cards
    document.querySelectorAll('#createVisGrid .create-vis-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('#createVisGrid .create-vis-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        visibility = card.dataset.value;
      });
    });

    // Confirm create button
    document.getElementById('btnConfirmCreate').addEventListener('click', () => {
      const hostName = getPseudo() || 'Hôte';

      // console.log('[Créer] Socket connecté:', socket.connected);
      // console.log('[Créer] Données envoyées:', { ...config, hostName, visibility });

      Bomb.initAudio();
      AudioFX.init();

      socket.emit('create-room', { ...config, hostName, visibility }, (response) => {
        // console.log('[Créer] Réponse serveur:', response);
        if (response.success) {
          roomCode = response.code;
          hostPlayer = response.player;
          players = response.players || [];

          document.getElementById('roomCodeDisplay').textContent = response.code;
          if (response.qr) {
            document.getElementById('qrCodeImg').src = response.qr;
          }
          document.getElementById('roomUrlDisplay').textContent = response.url;

          const maxDisplay = document.getElementById('maxPlayersDisplay');
          if (maxDisplay) maxDisplay.textContent = response.maxPlayers || config.maxPlayers;

          previousPlayerIds = [];
          updateLobbyConfigSummary();
          renderLobbyPlayers();
          history.pushState({}, '', '/lobby/' + response.code);
          showPage('hostLobby');
          initLobbyParticles();
        }
      });
    });
  }

  // --- Lobby config summary badges ---
  function updateLobbyConfigSummary() {
    const diffData = {
      beginner: { icon: ICONS.clock, label: 'Débutant' },
      intermediate: { icon: ICONS.zap, label: 'Moyen' },
      expert: { icon: ICONS.flame, label: 'Expert' },
      ultimate: { icon: ICONS.skull, label: 'Ultime' }
    };
    const visData = {
      private: { icon: ICONS.lock, label: 'Privée' },
      public: { icon: ICONS.globe, label: 'Publique' }
    };

    const badgeDiff = document.getElementById('lobbyBadgeDiff');
    const badgeLives = document.getElementById('lobbyBadgeLives');
    const badgeMax = document.getElementById('lobbyBadgeMax');
    const badgeVis = document.getElementById('lobbyBadgeVis');
    const visBadge = document.getElementById('lobbyVisBadge');

    const diff = diffData[config.difficulty] || diffData.intermediate;
    const vis = visData[visibility] || visData.private;

    if (badgeDiff) badgeDiff.innerHTML = diff.icon + ' ' + diff.label;
    if (badgeLives) badgeLives.innerHTML = ICONS.heart + ' ' + config.lives + ' vie' + (config.lives > 1 ? 's' : '');
    if (badgeMax) badgeMax.innerHTML = ICONS.users + ' ' + config.maxPlayers + ' max';
    if (badgeVis) badgeVis.innerHTML = vis.icon + ' ' + vis.label;
    if (visBadge) visBadge.innerHTML = vis.icon + ' ' + vis.label;
  }

  // --- PAGE LOBBY HÔTE ---
  let previousPlayerIds = [];

  function setupLobbyEvents() {
    // Bouton retour — quitter le lobby (showPage auto-emits leave-room)
    document.getElementById('btnLobbyBack').addEventListener('click', () => {
      previousPlayerIds = [];
      showPage('home');
    });

    // Copier le code room au clic sur le bloc code
    document.getElementById('lobbyCodeCopy').addEventListener('click', () => {
      copyToClipboard(roomCode, 'lobbyCodeCopied');
    });

    // Copier l'URL au clic
    document.getElementById('lobbyUrlCopy').addEventListener('click', () => {
      const url = document.getElementById('roomUrlDisplay').textContent;
      copyToClipboard(url, 'lobbyUrlCopied');
      // Feedback visuel sur le bouton
      const urlBtn = document.getElementById('lobbyUrlCopy');
      urlBtn.classList.add('copied');
      setTimeout(() => urlBtn.classList.remove('copied'), 1500);
    });

    // Bouton lancer
    document.getElementById('btnStartGame').addEventListener('click', () => {
      socket.emit('start-game', (response) => {
        if (!response.success) {
          Bomb.showToast(response.message, 'error');
        }
      });
    });
  }

  function copyToClipboard(text, badgeId) {
    const badge = document.getElementById(badgeId);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showCopiedBadge(badge));
    } else {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showCopiedBadge(badge);
    }
  }

  function showCopiedBadge(badge) {
    if (!badge) return;
    badge.classList.add('visible');
    setTimeout(() => badge.classList.remove('visible'), 1500);
  }

  function updatePlayerCountRing() {
    const ring = document.getElementById('lobbyRingProgress');
    if (!ring) return;
    const circumference = 2 * Math.PI * 18; // ~113.1
    const max = config.maxPlayers || 8;
    const ratio = Math.min(players.length / max, 1);
    ring.style.strokeDashoffset = circumference * (1 - ratio);
  }

  // --- Lobby ambient particles ---
  function initLobbyParticles() {
    const canvas = document.getElementById('lobbyParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId = null;

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
        ctx.fillStyle = `rgba(212, 162, 76, ${p.alpha})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    // Cleanup observer
    const obs = new MutationObserver(() => {
      const page = document.getElementById('pageHostLobby');
      if (page && !page.classList.contains('active')) {
        cancelAnimationFrame(animId);
        obs.disconnect();
      }
    });
    obs.observe(document.getElementById('pageHostLobby'), { attributes: true, attributeFilter: ['class'] });
  }

  // --- PAGE JEU HÔTE ---
  function setupGameEvents() {
    // Leave game button (host) — premium dialog
    const leaveBtn = document.getElementById('btnHostLeaveGame');
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
        // Stop everything before leaving
        Bomb.stop();
        Bomb.resetDisplay();
        socket.emit('leave-game');
        // Reset state
        gameState = null;
        players = [];
        hostPlayer = null;
        isMyTurn = false;
        activePlayerId = null;
        roomCode = '';
        history.replaceState({}, '', '/');
        showPage('home');
      });
    }

    // Host answer input — pas de suggestions, seulement typing + Enter
    const hostInput = document.getElementById('hostAnswerInput');
    const submitBtn = document.getElementById('btnHostSubmit');

    if (hostInput) {
      hostInput.addEventListener('input', () => {
        if (isMyTurn) {
          myTypingText = hostInput.value;
          updateHostTypingDisplay();
          if (socket) socket.emit('player-typing', { text: hostInput.value });
        }
      });

      hostInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitHostAnswer();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', submitHostAnswer);
    }

    // Joker button
    const jokerBtn = document.getElementById('hostBtnJoker');
    if (jokerBtn) {
      jokerBtn.addEventListener('click', () => useJoker('hostBtnJoker'));
    }
  }

  function submitHostAnswer() {
    if (!isMyTurn || !gameState) return;

    const hostInput = document.getElementById('hostAnswerInput');
    if (!hostInput) return;
    const answer = hostInput.value.trim();
    if (!answer) return;

    const usedNames = gameState.usedNames || [];
    const result = Validator.validate(answer, usedNames, ASMA_UL_HUSNA);

    socket.emit('submit-answer', {
      answer,
      nameId: result.nameId,
      valid: result.valid
    }, (response) => {
      // Clear input after submission
      hostInput.value = '';
    });

    // Clear typing broadcast
    myTypingText = '';
    updateHostTypingDisplay();
    if (socket) socket.emit('player-typing', { text: '' });
  }

  function updateHostControls(currentPlayer) {
    const controls = document.getElementById('hostPlayerControls');
    if (!controls || !hostPlayer) return;

    isMyTurn = currentPlayer && currentPlayer.id === hostPlayer.id && !hostPlayer.eliminated;

    if (isMyTurn) {
      controls.classList.remove('hidden');
      const hostInput = document.getElementById('hostAnswerInput');
      if (hostInput) {
        hostInput.value = '';
        setTimeout(() => hostInput.focus(), 100);
      }
    } else {
      controls.classList.add('hidden');
    }
    updateJokerButton('hostBtnJoker');
  }

  // --- Joker system ---
  function updateJokerButton(btnId) {
    const btn = document.getElementById(btnId);
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

  function useJoker(btnId) {
    if (!isMyTurn || jokersRemaining <= 0) return;
    socket.emit('use-joker', (response) => {
      if (response && response.success) {
        jokersRemaining = response.jokersRemaining;
        updateJokerButton(btnId);
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

    // Créer la popup d'indice
    let popup = document.getElementById('jokerHintPopup');
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'jokerHintPopup';
      popup.className = 'joker-hint-popup';
      document.body.appendChild(popup);
    }
    popup.innerHTML = `
      <div class="joker-hint-content">
        <div class="joker-hint-badge">Indice</div>
        <div class="joker-hint-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold-bright)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg></div>
        <div class="joker-hint-french">${escapeHtml(french)}</div>
        <div class="joker-hint-divider"></div>
        <div class="joker-hint-category">${escapeHtml(catLabel)}</div>
      </div>`;
    popup.classList.remove('hiding');
    popup.classList.add('visible');
    setTimeout(() => {
      popup.classList.add('hiding');
      setTimeout(() => {
        popup.classList.remove('visible', 'hiding');
      }, 350);
    }, 3600);
  }

  // --- PAGE RÉSULTATS ---
  function setupResultsEvents() {
    const replayBtn = document.getElementById('btnPlayAgain');
    const replayOrigHTML = replayBtn ? replayBtn.innerHTML : '';
    if (!replayBtn) return;

    replayBtn.addEventListener('click', () => {
      // console.log('[Host] btnPlayAgain cliqué — emit replay-game');
      replayBtn.disabled = true;
      replayBtn.textContent = 'Chargement...';
      socket.emit('replay-game');
      // Timeout sécurité — si replay-lobby n'arrive pas après 6s
      setTimeout(() => {
        if (replayBtn.disabled && pages.results.classList.contains('active')) {
          // console.log('[Host] replay timeout — re-enable button');
          replayBtn.disabled = false;
          replayBtn.innerHTML = replayOrigHTML;
          Bomb.showToast('Erreur de connexion, réessayez', 'error');
        }
      }, 6000);
    });

    // Erreur replay
    socket.on('replay-error', (data) => {
      // console.log('[Host] replay-error:', data);
      Bomb.showToast(data.message || 'Erreur', 'error');
      replayBtn.disabled = false;
      replayBtn.innerHTML = replayOrigHTML;
    });

    document.getElementById('btnBackHome').addEventListener('click', () => {
      // Notifier les joueurs que l'hôte quitte depuis les résultats
      if (socket && roomCode) {
        socket.emit('leave-game');
        roomCode = '';
        players = [];
        hostPlayer = null;
        gameState = null;
        isMyTurn = false;
        activePlayerId = null;
      }
      history.replaceState({}, '', '/');
      showPage('home');
    });
  }

  // --- ÉVÉNEMENTS SOCKET.IO ---
  function setupSocketEvents() {
    // --- Gestion déconnexion/reconnexion ---
    let disconnectTimer = null;

    socket.on('disconnect', () => {
      const overlay = document.getElementById('disconnectOverlay');
      if (overlay) overlay.classList.remove('hidden');
      Bomb.stop();
      // Match server's 60s host disconnect timeout
      disconnectTimer = setTimeout(() => {
        Bomb.showToast('Connexion perdue', 'error');
        gameState = null;
        isMyTurn = false;
        activePlayerId = null;
        history.replaceState({}, '', '/');
        showPage('home');
        if (overlay) overlay.classList.add('hidden');
      }, 60000);
    });

    socket.on('connect', () => {
      const overlay = document.getElementById('disconnectOverlay');
      if (overlay && !overlay.classList.contains('hidden')) {
        overlay.classList.add('hidden');
        // Auto-reconnect as host if we have a room code
        if (roomCode) {
          socket.emit('host-reconnect', { code: roomCode }, (response) => {
            if (response && response.success) {
              players = response.players || [];
              hostPlayer = players.find(p => p.isHost) || players[0];
              if (response.state === 'playing' && response.game) {
                gameState = response.game;
                const currentPlayer = players[response.game.currentPlayerIndex] || null;
                activePlayerId = currentPlayer ? currentPlayer.id : null;
                isMyTurn = currentPlayer && hostPlayer && currentPlayer.id === hostPlayer.id && !hostPlayer.eliminated;
                renderHostArena();
                updateHostControls(currentPlayer);
                updateTurnIndicator(currentPlayer);
                renderScoreboard('hostScoreboard', players, hostPlayer ? hostPlayer.id : null);
                const elapsed = (Date.now() - response.game.timerStart) / 1000;
                const remaining = Math.max(1, response.game.timerDuration - elapsed);
                Bomb.start(remaining, () => { socket.emit('bomb-explode'); });
              } else {
                renderLobbyPlayers();
              }
              Bomb.showToast('Reconnecté !', 'correct');
            } else {
              Bomb.showToast('Salon perdu', 'warning');
              history.replaceState({}, '', '/');
              showPage('home');
            }
          });
        } else {
          Bomb.showToast('Reconnecté !', 'correct');
        }
      }
      if (disconnectTimer) {
        clearTimeout(disconnectTimer);
        disconnectTimer = null;
      }
    });

    // Room fermée par le serveur (hôte absent trop longtemps)
    socket.on('room-closed', () => {
      Bomb.showToast('Le salon a été fermé', 'warning');
      history.replaceState({}, '', '/');
      showPage('home');
    });

    // Un joueur rejoint
    socket.on('player-joined', (data) => {
      players = data.players;
      renderLobbyPlayers();
      Bomb.showToast(`${data.player.name} a rejoint !`, 'info');
    });

    // Joueur a quitté
    socket.on('player-left', (data) => {
      players = data.players;
      renderLobbyPlayers();
    });

    // Joueur ready/not ready
    socket.on('player-ready-changed', (data) => {
      players = data.players;
      renderLobbyPlayers();
    });

    // Partie lancée
    socket.on('game-started', (data) => {
      players = data.players;
      gameState = data.game;
      config = data.config;

      // Update hostPlayer reference from the players list
      if (hostPlayer) {
        const updated = players.find(p => p.id === hostPlayer.id);
        if (updated) hostPlayer = updated;
      }

      // Init jokers from host player
      if (hostPlayer) {
        jokersRemaining = hostPlayer.jokersRemaining !== undefined ? hostPlayer.jokersRemaining : (config.jokers || 0);
      }

      showPage('hostGame');
      document.getElementById('gameModeLabel').textContent = 'Classique';
      activePlayerId = data.currentPlayer ? data.currentPlayer.id : null;
      renderHostArena();
      updateHostControls(data.currentPlayer);
      updateTurnIndicator(data.currentPlayer);
      updateNamesCount();
      renderScoreboard('hostScoreboard', players, hostPlayer ? hostPlayer.id : null);

      // Démarrer le timer local (l'hôte gère le timer)
      Bomb.start(data.game.timerDuration, () => {
        socket.emit('bomb-explode');
      });
    });

    // Résultat d'une réponse
    socket.on('answer-result', (data) => {
      if (!gameState) return; // Host already left
      if (data.result === 'correct') {
        currentTypingText = '';
        myTypingText = '';
        Bomb.showFeedback('correct');

        // Afficher le nom
        const name = ASMA_UL_HUSNA.find(n => n.id === data.nameId);
        if (name) {
          Bomb.showNamePopup(name);
        }

        // Mettre à jour le compteur
        if (data.usedCount !== undefined) {
          gameState.usedNames = data.usedNames || gameState.usedNames;
          updateNamesCount();
        }

        // Update players data from server (includes scores)
        if (data.players) {
          players = data.players;
          if (hostPlayer) {
            const updatedHost = players.find(p => p.id === hostPlayer.id);
            if (updatedHost) hostPlayer = updatedHost;
          }
        }

        renderScoreboard('hostScoreboard', players, hostPlayer ? hostPlayer.id : null);

        // Mettre à jour les joueurs
        if (data.nextPlayer) {
          activePlayerId = data.nextPlayer.id;
          updateHostControls(data.nextPlayer);
          updateTurnIndicator(data.nextPlayer);
        }

        // Update host player data from server
        if (hostPlayer) {
          const updatedHost = players.find(p => p.id === hostPlayer.id);
          if (updatedHost) hostPlayer = updatedHost;
        }

        // Nouveau timer
        Bomb.stop();
        Bomb.resetDisplay();
        setTimeout(() => {
          Bomb.start(data.timerDuration || gameState.timerDuration, () => {
            socket.emit('bomb-explode');
          });
        }, 300);

        renderHostArena();

      } else if (data.result === 'already-used') {
        Bomb.showFeedback('already-used');
        Bomb.showToast('Déjà cité !', 'warning');
        showArenaLock();

      } else if (data.result === 'invalid') {
        Bomb.showFeedback('invalid');
        Bomb.showToast('Nom inconnu !', 'error');
        showArenaError();
      }
    });

    // Bombe explose — animate, don't re-render (new-round will)
    socket.on('bomb-exploded', (data) => {
      if (!gameState) return; // Host already left
      Bomb.triggerExplosionAnimation();
      animateBombHit('gameArena', data.player.id);

      // Update local player data
      const bombed = players.find(p => p.id === data.player.id);
      if (bombed) {
        bombed.lives = data.lives;
        if (data.eliminated) bombed.eliminated = true;
      }
      if (hostPlayer && data.player.id === hostPlayer.id) {
        hostPlayer.lives = data.lives;
        if (data.eliminated) hostPlayer.eliminated = true;
      }
    });

    // Joueur éliminé — update state, animation is already playing
    socket.on('player-eliminated', (data) => {
      players = data.players;
      AudioFX.playElimination();
      Bomb.showToast(`${data.player.name} est éliminé !`, 'error');

      // Si l'hôte est éliminé, cacher les contrôles mais garder le timer
      if (hostPlayer && data.player.id === hostPlayer.id) {
        hostPlayer.eliminated = true;
        const controls = document.getElementById('hostPlayerControls');
        if (controls) controls.classList.add('hidden');
        isMyTurn = false;
      }

      // If game is ending, trigger explosion (bomb-exploded won't fire)
      if (data.remainingPlayers <= 1) {
        Bomb.triggerExplosionAnimation();
        animateBombHit('gameArena', data.player.id);
      }

      // DON'T renderHostArena() — animation is playing, new-round will re-render
    });

    // Joueur quitte la partie
    socket.on('player-left-game', (data) => {
      players = data.players;
      showClassicLeavePopup(data.playerName, data.playerColor);
      renderHostArena();
      renderScoreboard('hostScoreboard', players, hostPlayer ? hostPlayer.id : null);
    });

    // Nouveau tour — delay re-render to let explosion animation finish
    socket.on('new-round', (data) => {
      if (!gameState) return; // Host already left
      currentTypingText = '';
      myTypingText = '';
      players = data.players;
      gameState.round = data.round;
      activePlayerId = data.currentPlayer ? data.currentPlayer.id : null;

      // Update host player data
      if (hostPlayer) {
        const updatedHost = players.find(p => p.id === hostPlayer.id);
        if (updatedHost) hostPlayer = updatedHost;
      }

      // Update isMyTurn IMMEDIATELY so typing events use the correct value
      isMyTurn = data.currentPlayer && hostPlayer && data.currentPlayer.id === hostPlayer.id && !hostPlayer.eliminated;

      Bomb.stop();
      Bomb.resetDisplay();

      // Delay re-render and timer to let bomb animation play
      setTimeout(() => {
        // Guard: don't switch if game ended
        if (pages.results.classList.contains('active')) return;

        updateHostControls(data.currentPlayer);
        updateTurnIndicator(data.currentPlayer);
        renderHostArena();
        renderScoreboard('hostScoreboard', players, hostPlayer ? hostPlayer.id : null);
        Bomb.start(data.timerDuration, () => {
          socket.emit('bomb-explode');
        });
      }, 950);
    });

    // Tous les noms cités
    socket.on('all-names-complete', () => {
      Bomb.stop();
      Bomb.showConfetti();
      Bomb.showToast('Tous les 99 noms ont été cités !', 'correct');
    });

    // Fin de partie
    socket.on('game-over', (data) => {
      // Si l'hôte a déjà quitté (page home affichée), ignorer
      if (pages.home.classList.contains('active')) return;
      Bomb.stop();
      Bomb.resetDisplay();
      AudioFX.playVictory();
      showResults(data);
    });

    // Replay — retour en lobby
    socket.on('replay-lobby', (data) => {
      // console.log('[Host] replay-lobby reçu:', data.code, 'players:', data.players.length);
      players = data.players;
      config = data.config || config;
      gameState = null;
      isMyTurn = false;
      activePlayerId = null;
      jokersRemaining = 0;
      // Update hostPlayer from new player list
      if (hostPlayer) {
        const updated = players.find(p => p.id === hostPlayer.id);
        if (updated) hostPlayer = updated;
      }
      // Reset ready state for lobby button
      previousPlayerIds = [];
      // Re-enable replay button in case it was disabled
      const replayBtn = document.getElementById('btnPlayAgain');
      if (replayBtn) {
        replayBtn.disabled = false;
        replayBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg> Rejouer';
      }
      // Update lobby display
      roomCode = data.code || roomCode;
      const codeDisplay = document.getElementById('roomCodeDisplay');
      if (codeDisplay) codeDisplay.textContent = roomCode;
      const urlDisplay = document.getElementById('roomUrlDisplay');
      if (urlDisplay) urlDisplay.textContent = window.location.origin + '/lobby/' + roomCode;
      updateLobbyConfigSummary();
      renderLobbyPlayers();
      history.replaceState({}, '', '/lobby/' + roomCode);
      showPage('hostLobby');
      initLobbyParticles();
      Bomb.showToast('Nouvelle partie !', 'correct');
    });

    // Joueur déconnecté
    socket.on('player-disconnected', (data) => {
      players = data.players;
      renderLobbyPlayers();
      renderHostArena();
      showClassicLeavePopup(data.player.name, data.player.color, true);
    });

    // Joueur kick
    socket.on('player-kicked', (data) => {
      players = data.players;
      renderLobbyPlayers();
      renderHostArena();
      Bomb.showToast(`${data.kickedPlayer.name} a été exclu`, 'warning');
    });

    // Visibilité mise à jour
    socket.on('visibility-updated', (data) => {
      visibility = data.visibility;
      updateLobbyConfigSummary();
    });

    // Player typing (from active player)
    socket.on('player-typing', (data) => {
      currentTypingText = data.text || '';
      updateHostTypingDisplay();
    });

    // Pause
    socket.on('game-paused', (data) => {
      if (data.paused) {
        Bomb.stop();
        Bomb.showToast('Partie en pause', 'info');
      } else {
        Bomb.showToast('Reprise !', 'info');
        // Relancer le timer avec le temps restant
        Bomb.start(Bomb.getRemaining() || 5, () => {
          socket.emit('bomb-explode');
        });
      }
    });
  }

  // --- RENDU ---

  function renderLobbyPlayers() {
    const list = document.getElementById('lobbyPlayersList');
    if (!list) return;

    const currentIds = players.map(p => p.id);

    if (players.length === 0) {
      list.innerHTML = '<div class="lobby-empty-state">Les joueurs apparaîtront ici</div>';
    } else {
      list.innerHTML = players.map((p, idx) => {
        const isMe = hostPlayer && p.id === hostPlayer.id;
        const initial = p.name.charAt(0).toUpperCase();
        const isNew = !previousPlayerIds.includes(p.id);
        const cardClass = `lobby-player-card${p.ready ? ' ready' : ''}${isNew ? ' lobby-card-enter' : ''}`;

        const kickBtn = !isMe ? `<button class="lobby-card-kick" data-kick-id="${p.id}" title="Exclure"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>` : '';
        const hostTag = isMe ? '<span class="lobby-card-host">Hôte</span>' : '';
        const readyDot = p.ready ? '<span class="lobby-card-ready-dot"></span>' : '';

        return `
          <div class="${cardClass}" style="--player-color: ${p.color}; --card-stagger: ${idx}">
            <div class="lobby-card-avatar">
              ${initial}
            </div>
            <div class="lobby-card-info">
              <div class="lobby-card-name">${escapeHtml(p.name)} ${hostTag}</div>
              <div class="lobby-card-status">${p.ready ? 'Prêt' : 'En attente'}</div>
            </div>
            ${readyDot}
            ${kickBtn}
          </div>
        `;
      }).join('');
    }

    // Bind kick buttons
    list.querySelectorAll('.lobby-card-kick').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        socket.emit('kick-player', { playerId: btn.dataset.kickId });
      });
    });

    previousPlayerIds = currentIds;

    // Update player count display
    const countEl = document.getElementById('playerCount');
    if (countEl) countEl.textContent = players.length;

    // Update the SVG progress ring
    updatePlayerCountRing();

    // Update waiting indicator text
    const waitText = document.getElementById('lobbyWaitingText');
    const waitIndicator = document.getElementById('lobbyWaitingIndicator');
    if (waitText && waitIndicator) {
      if (players.length >= 2) {
        waitText.innerHTML = 'Prêts à jouer !';
        waitText.classList.add('ready');
      } else {
        waitText.innerHTML = 'En attente de joueurs<span class="lobby-dots"><span>.</span><span>.</span><span>.</span></span>';
        waitText.classList.remove('ready');
      }
    }

    // Update header subtitle
    const headerSub = document.querySelector('.lobby-header-sub');
    if (headerSub) {
      if (players.length >= 2 && players.every(p => p.ready)) {
        headerSub.textContent = 'Tout le monde est prêt !';
        headerSub.style.color = 'var(--emerald)';
      } else if (players.length >= 2) {
        headerSub.textContent = players.length + ' joueurs connectés';
        headerSub.style.color = '';
      } else {
        headerSub.textContent = 'En attente des joueurs';
        headerSub.style.color = '';
      }
    }

    // Update start button and hint — require >= 2 players AND all ready
    const startBtn = document.getElementById('btnStartGame');
    const startHint = document.getElementById('lobbyStartHint');
    const allReady = players.length >= 2 && players.every(p => p.ready);
    if (startBtn) startBtn.disabled = !allReady;
    if (startHint) {
      if (players.length < 2) {
        startHint.textContent = 'Minimum 2 joueurs pour commencer';
        startHint.classList.remove('hidden');
      } else if (!allReady) {
        const notReady = players.filter(p => !p.ready).length;
        startHint.textContent = `${notReady} joueur${notReady > 1 ? 's' : ''} pas encore prêt${notReady > 1 ? 's' : ''}`;
        startHint.classList.remove('hidden');
      } else {
        startHint.classList.add('hidden');
      }
    }
  }

  // --- Typing display, Error cross & Bomb animations ---

  function updateHostTypingDisplay() {
    const arena = document.getElementById('gameArena');
    if (!arena) return;

    const text = isMyTurn ? myTypingText : currentTypingText;
    const hasText = text && text.trim();

    // Update bubble under active player
    const bubble = arena.querySelector('.arena-player.active .arena-player-typing');
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
    const cross = document.querySelector('#gameArena .arena-error-cross');
    if (!cross) return;
    cross.classList.remove('animate');
    void cross.offsetWidth;
    cross.classList.add('animate');
    setTimeout(() => cross.classList.remove('animate'), 900);
  }

  function showArenaLock() {
    const lock = document.querySelector('#gameArena .arena-lock-overlay');
    if (!lock) return;
    lock.classList.remove('animate');
    void lock.offsetWidth;
    lock.classList.add('animate');
    setTimeout(() => lock.classList.remove('animate'), 1500);
  }

  function animateBombHit(containerId, playerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Bomb explosion flash
    const bomb = container.querySelector('.arena-center-bomb');
    if (bomb) {
      bomb.classList.add('exploding');
      setTimeout(() => bomb.classList.remove('exploding'), 750);
    }

    // Spawn explosion particles
    spawnExplosionParticles(container);

    // Find the affected player
    const playerEl = container.querySelector(`[data-player-id="${playerId}"]`);
    if (!playerEl) return;

    // Red flash on avatar
    playerEl.classList.add('just-hit');
    setTimeout(() => playerEl.classList.remove('just-hit'), 700);

    // Shake the avatar
    const avatarWrap = playerEl.querySelector('.arena-avatar-wrap');
    if (avatarWrap) {
      avatarWrap.classList.add('shaking');
      setTimeout(() => avatarWrap.classList.remove('shaking'), 650);
    }

    // Last alive heart flies away
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

  function renderArena(containerId, playersList, currentActiveId, configLives, myId, isHost) {
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

    const startAngle = -Math.PI / 2; // First player at top
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

    // Center bomb
    let bombHtml;
    if (isHost) {
      bombHtml = `
        <div class="arena-center-bomb">
          <div class="bomb-wrapper arena-bomb-wrapper">
            <svg class="timer-ring" viewBox="0 0 210 210">
              <circle class="timer-ring-bg" cx="105" cy="105" r="100"/>
              <circle class="timer-ring-progress" id="timerRing" cx="105" cy="105" r="100"
                      stroke-dasharray="628.32" stroke-dashoffset="0"/>
            </svg>
            <svg class="bomb-svg" viewBox="0 0 160 180">
              <defs>
                <radialGradient id="bombGrad" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stop-color="#555"/>
                  <stop offset="40%" stop-color="#333"/>
                  <stop offset="100%" stop-color="#111"/>
                </radialGradient>
              </defs>
              <ellipse cx="80" cy="170" rx="50" ry="8" fill="rgba(0,0,0,0.3)"/>
              <circle cx="80" cy="100" r="55" fill="url(#bombGrad)"/>
              <rect x="70" y="42" width="20" height="14" rx="3" fill="#555"/>
              <path d="M80 42 Q85 30 95 28 Q105 26 100 15" fill="none" stroke="#8B4513" stroke-width="3" stroke-linecap="round"/>
              <g>
                <circle cx="100" cy="14" r="6" fill="rgba(255,165,0,0.4)" class="fuse-glow"/>
                <circle cx="100" cy="12" r="4" fill="#ffd93d" class="fuse-spark"/>
                <circle cx="100" cy="10" r="2" fill="#fff" class="fuse-spark"/>
              </g>
            </svg>
            <div class="bomb-timer-text" id="bombTimerText">--</div>
          </div>
        </div>`;
    } else {
      bombHtml = `
        <div class="arena-center-bomb">
          <svg class="arena-bomb-icon" viewBox="0 0 160 180" width="44" height="48">
            <defs>
              <radialGradient id="arenaBombG" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stop-color="#4a4a4a"/>
                <stop offset="50%" stop-color="#2a2a2a"/>
                <stop offset="100%" stop-color="#111"/>
              </radialGradient>
            </defs>
            <circle cx="80" cy="100" r="55" fill="url(#arenaBombG)"/>
            <rect x="70" y="42" width="20" height="14" rx="3" fill="#555"/>
            <path d="M80 42 Q85 30 95 28 Q105 26 100 15" fill="none" stroke="#8B4513" stroke-width="3" stroke-linecap="round"/>
            <g>
              <circle cx="100" cy="14" r="6" fill="rgba(255,165,0,0.4)" class="fuse-glow"/>
              <circle cx="100" cy="12" r="4" fill="#ffd93d" class="fuse-spark"/>
            </g>
          </svg>
        </div>`;
    }

    // Error cross overlay (inside circle)
    const errorCrossHtml = `
      <div class="arena-error-cross">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--ruby)" stroke-width="3" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </div>`;

    // Lock overlay for already-used names
    const lockOverlayHtml = `
      <div class="arena-lock-overlay">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>`;

    container.innerHTML = `
      <div class="arena-circle" style="width:${size}px;height:${size}px;">
        ${bombHtml}
        ${errorCrossHtml}
        ${lockOverlayHtml}
        ${playersHtml}
      </div>`;
  }

  function renderHostArena() {
    renderArena('gameArena', players, activePlayerId, config.lives, hostPlayer ? hostPlayer.id : null, true);
  }

  function updateNamesCount() {
    const count = gameState ? gameState.usedNames.length : 0;
    const el = document.getElementById('namesUsedCount');
    if (el) el.textContent = count + '/99';

    // Update progress ring
    const ring = document.getElementById('hostProgressRing');
    if (ring) {
      const circumference = 2 * Math.PI * 26; // ~163.36
      const ratio = count / 99;
      ring.style.strokeDashoffset = circumference * (1 - ratio);
    }

    // Update progress bar
    const fill = document.getElementById('hostProgressFill');
    if (fill) fill.style.width = ((count / 99) * 100) + '%';
    const label = document.getElementById('hostProgressLabel');
    if (label) label.textContent = count;
  }

  function updateTurnIndicator(currentPlayer) {
    const avatar = document.getElementById('hostTurnAvatar');
    const name = document.getElementById('hostTurnName');
    const banner = document.getElementById('hostTurnIndicator');
    if (!avatar || !name) return;

    if (currentPlayer) {
      avatar.textContent = currentPlayer.name.charAt(0).toUpperCase();
      avatar.style.background = currentPlayer.color;
      const isMeTurn = hostPlayer && currentPlayer.id === hostPlayer.id;
      name.textContent = isMeTurn ? "C'est ton tour !" : `${currentPlayer.name} joue...`;
      if (banner) banner.classList.toggle('is-my-turn', isMeTurn);
    } else {
      avatar.textContent = '?';
      avatar.style.background = '';
      name.textContent = 'En attente...';
      if (banner) banner.classList.remove('is-my-turn');
    }
  }

  // --- Scoreboard ---
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

  function showResults(data) {
    showPage('results');

    // Detect tie
    const isTie = data.isTie || (data.ranking.length >= 2 && data.ranking[0].score === data.ranking[1].score);

    document.getElementById('resultsSubtitle').textContent =
      `${data.usedCount} noms cités en ${data.totalRounds} tours`;

    // Determine my rank
    const myId = hostPlayer ? hostPlayer.id : null;
    const myRank = myId ? data.ranking.findIndex(p => p.id === myId) : -1;

    // Spawn background orbs
    spawnBgOrbs('resultsBgOrbs');

    // Animate banner (with tie awareness)
    renderResultsBanner('resultsBanner', 'resultsBannerIcon', 'resultsBannerTitle', 'resultsBannerRank', 'resultsBannerParticles', 'resultsGlow', myRank, isTie);

    // Confetti for victory or tie only
    if (isTie || myRank === 0) {
      Bomb.showConfetti();
    }

    // Podium
    renderPodium(data.ranking, 'podiumContainer', isTie);

    // Animated stats
    animateStats({
      namesCount: 'resultsNamesCount',
      accuracy: 'resultsAccuracy',
      rounds: 'resultsRounds',
      namesResultsCount: 'namesResultsCount'
    }, data);

    // Grille des noms
    renderNamesGrid(data.usedNames, 'namesResultsGrid');
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

    // Reset classes
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
      const hue = 30 + Math.random() * 20;
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
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(from + (to - from) * eased);
      el.textContent = val + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

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
      const isMe = hostPlayer && p.id === hostPlayer.id;
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

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ================================================================
  //  ENCYCLOPEDIA — Premium Redesign
  // ================================================================

  // Category accent colors for cards
  const CATEGORY_COLORS = {
    mercy:       { accent: 'rgba(239, 68, 68, 0.35)',  glow: 'rgba(239, 68, 68, 0.1)' },
    power:       { accent: 'rgba(245, 158, 11, 0.35)', glow: 'rgba(245, 158, 11, 0.1)' },
    wisdom:      { accent: 'rgba(234, 179, 8, 0.35)',   glow: 'rgba(234, 179, 8, 0.1)' },
    creation:    { accent: 'rgba(34, 197, 94, 0.35)',   glow: 'rgba(34, 197, 94, 0.1)' },
    knowledge:   { accent: 'rgba(96, 165, 250, 0.35)', glow: 'rgba(96, 165, 250, 0.1)' },
    justice:     { accent: 'rgba(167, 139, 250, 0.35)', glow: 'rgba(167, 139, 250, 0.1)' },
    beauty:      { accent: 'rgba(45, 212, 160, 0.35)', glow: 'rgba(45, 212, 160, 0.1)' },
    sovereignty: { accent: 'rgba(212, 162, 76, 0.4)',   glow: 'rgba(212, 162, 76, 0.12)' }
  };

  function setupEncyclopediaEvents() {
    document.getElementById('btnEncyclopedia').addEventListener('click', () => {
      showEncyclopedia();
    });

    document.getElementById('btnEncyclopediaBack').addEventListener('click', () => {
      showPage('home');
    });

    // Search with clear button
    const searchInput = document.getElementById('encySearchInput');
    const searchClear = document.getElementById('encySearchClear');

    searchInput.addEventListener('input', debounce((e) => {
      encySearch = e.target.value.trim().toLowerCase();
      searchClear.classList.toggle('hidden', !encySearch);
      renderEncyclopediaGrid();
      updateEncyHeaderCount();
    }, 300));

    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      encySearch = '';
      searchClear.classList.add('hidden');
      renderEncyclopediaGrid();
      updateEncyHeaderCount();
      searchInput.focus();
    });

    document.getElementById('encyBackToGrid').addEventListener('click', () => {
      document.getElementById('encyDetail').classList.add('hidden');
      document.getElementById('encyGridView').classList.remove('hidden');
      history.pushState({ page: 'encyclopedia' }, '', '/encyclopedie');
    });

    document.getElementById('encyPrev').addEventListener('click', () => {
      navigateEncyDetail(-1);
    });

    document.getElementById('encyNext').addEventListener('click', () => {
      navigateEncyDetail(1);
    });

    // Keyboard navigation in detail view
    document.addEventListener('keydown', (e) => {
      const detailEl = document.getElementById('encyDetail');
      if (detailEl.classList.contains('hidden')) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); navigateEncyDetail(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); navigateEncyDetail(1); }
      else if (e.key === 'Escape') {
        e.preventDefault();
        detailEl.classList.add('hidden');
        document.getElementById('encyGridView').classList.remove('hidden');
        history.pushState({ page: 'encyclopedia' }, '', '/encyclopedie');
      }
    });
  }

  function navigateEncyDetail(direction) {
    const filtered = getFilteredNames();
    const newIndex = encyDetailIndex + direction;
    if (newIndex < 0 || newIndex >= filtered.length) return;

    const container = document.getElementById('encyDetailContent');
    const animOut = direction > 0 ? 'encySwipeLeft' : 'encySwipeRight';
    const animIn = direction > 0 ? 'encySwipeEnter' : 'encySwipeEnterReverse';

    container.style.animation = animOut + ' 0.15s ease-out forwards';
    setTimeout(() => {
      encyDetailIndex = newIndex;
      const name = filtered[encyDetailIndex];
      preloadIntegrityEntryForName(name).finally(() => {
        renderEncyclopediaDetail(name, filtered);
      });
      container.style.animation = animIn + ' 0.25s ease-out forwards';
      setTimeout(() => { container.style.animation = ''; }, 260);
      // Update URL to /nom/:slug
      const slug = toSlug(name.transliteration);
      history.replaceState({ page: 'encyclopedia', nameSlug: slug }, '', '/nom/' + slug);
    }, 140);
  }

  function showEncyclopedia() {
    showPage('encyclopedia');
    encyFilter = 'all';
    encySearch = '';
    document.getElementById('encySearchInput').value = '';
    document.getElementById('encySearchClear').classList.add('hidden');
    document.getElementById('encyDetail').classList.add('hidden');
    document.getElementById('encyGridView').classList.remove('hidden');
    renderEncyclopediaCategoryChips();
    renderEncyclopediaGrid();
    updateEncyHeaderCount();
  }

  // Open encyclopedia directly on a specific name (for /nom/:slug routing)
  async function openEncyclopediaDetailByName(name, pushHistory) {
    showPage('encyclopedia', false);
    encyFilter = 'all';
    encySearch = '';
    renderEncyclopediaCategoryChips();
    renderEncyclopediaGrid();
    updateEncyHeaderCount();
    // Find index in full list
    const filtered = getFilteredNames();
    const idx = filtered.findIndex(n => n.id === name.id);
    if (idx === -1) return;
    encyDetailIndex = idx;
    document.getElementById('encyGridView').classList.add('hidden');
    const detailEl = document.getElementById('encyDetail');
    detailEl.classList.remove('hidden');
    await preloadIntegrityEntryForName(filtered[idx]);
    renderEncyclopediaDetail(filtered[idx], filtered);
    detailEl.scrollTop = 0;
    // Push URL
    if (pushHistory !== false) {
      const slug = toSlug(name.transliteration);
      const url = '/nom/' + slug;
      if (window.location.pathname !== url) {
        history.pushState({ page: 'encyclopedia', nameSlug: slug }, '', url);
      }
    }
  }

  function updateEncyHeaderCount() {
    const count = getFilteredNames().length;
    const el = document.getElementById('encyHeaderCount');
    if (el) el.textContent = count + ' / ' + ASMA_UL_HUSNA.length;
  }

  // SVG icon paths for category chips (replaces emojis)
  const CATEGORY_ICONS = {
    all:         '<svg class="ency-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    mercy:       '<svg class="ency-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    power:       '<svg class="ency-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    wisdom:      '<svg class="ency-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 10-5.12 5.12L8 12.24"/></svg>',
    creation:    '<svg class="ency-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
    knowledge:   '<svg class="ency-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
    justice:     '<svg class="ency-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 4.5V12l-9 4.5L3 12V7.5Z"/><path d="M12 12v9"/><path d="m12 3 0 9"/></svg>',
    beauty:      '<svg class="ency-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
    sovereignty: '<svg class="ency-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M4 20h16"/></svg>'
  };

  function renderEncyclopediaCategoryChips() {
    const container = document.getElementById('encyCategoryChips');
    const totalCount = ASMA_UL_HUSNA.length;
    let html = `<button class="ency-chip ency-chip-all ${encyFilter === 'all' ? 'active' : ''}" data-cat="all" role="tab" aria-selected="${encyFilter === 'all'}" tabindex="0">
      ${CATEGORY_ICONS.all}
      <span class="ency-chip-label">Tous</span>
      <span class="ency-chip-count">${totalCount}</span>
    </button>`;
    Object.keys(CATEGORIES).forEach(key => {
      const cat = CATEGORIES[key];
      const count = ASMA_UL_HUSNA.filter(n => n.category === key).length;
      const icon = CATEGORY_ICONS[key] || '';
      html += `<button class="ency-chip ${encyFilter === key ? 'active' : ''}" data-cat="${key}" role="tab" aria-selected="${encyFilter === key}" tabindex="0">
        ${icon}
        <span class="ency-chip-label">${cat.fr}</span>
        <span class="ency-chip-count">${count}</span>
      </button>`;
    });
    container.innerHTML = html;

    container.querySelectorAll('.ency-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        encyFilter = chip.dataset.cat;
        renderEncyclopediaCategoryChips();
        renderEncyclopediaGrid();
        updateEncyHeaderCount();
      });
    });
  }

  function getFilteredNames() {
    let names = ASMA_UL_HUSNA;
    if (encyFilter !== 'all') {
      names = names.filter(n => n.category === encyFilter);
    }
    if (encySearch) {
      names = names.filter(n =>
        n.transliteration.toLowerCase().includes(encySearch) ||
        n.french.toLowerCase().includes(encySearch) ||
        n.english.toLowerCase().includes(encySearch) ||
        n.arabic.includes(encySearch) ||
        String(n.id) === encySearch
      );
    }
    return names;
  }

  function renderEncyclopediaGrid() {
    const grid = document.getElementById('encyGrid');
    const names = getFilteredNames();

    if (names.length === 0) {
      grid.innerHTML = `<div class="ency-empty">
        <div class="ency-empty-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
        <div class="ency-empty-text">Aucun nom trouvé</div>
      </div>`;
      return;
    }

    grid.innerHTML = names.map((name, idx) => {
      const delay = Math.min(idx * 20, 500);
      const colors = CATEGORY_COLORS[name.category] || CATEGORY_COLORS.sovereignty;
      return `
        <div class="ency-card" data-idx="${idx}" role="listitem" tabindex="0" aria-label="${name.transliteration} — ${name.french}" style="--stagger-delay: ${delay}ms; --card-accent: ${colors.accent}; --card-glow: ${colors.glow};">
          <div class="ency-card-number-badge" aria-hidden="true">${name.id}</div>
          <div class="ency-card-arabic" aria-hidden="true">${name.arabic}</div>
          <div class="ency-card-translit">${name.transliteration}</div>
          <div class="ency-card-meaning">${name.french}</div>
          <div class="ency-card-cat-dot" aria-hidden="true"></div>
        </div>
      `;
    }).join('');

    const openCard = async (card) => {
      const idx = parseInt(card.dataset.idx);
      encyDetailIndex = idx;
      const filtered = getFilteredNames();
      const name = filtered[idx];
      document.getElementById('encyGridView').classList.add('hidden');
      const detailEl = document.getElementById('encyDetail');
      detailEl.classList.remove('hidden');
      detailEl.style.animation = 'none';
      detailEl.offsetHeight; // force reflow
      detailEl.style.animation = '';
      await preloadIntegrityEntryForName(name);
      renderEncyclopediaDetail(name, filtered);
      detailEl.scrollTop = 0;
      // Push /nom/:slug URL
      const slug = toSlug(name.transliteration);
      history.pushState({ page: 'encyclopedia', nameSlug: slug }, '', '/nom/' + slug);
    };
    grid.querySelectorAll('.ency-card').forEach(card => {
      card.addEventListener('click', () => openCard(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(card); }
      });
    });
  }

  function renderVerseCardPublic(verse) {
    return `<div class="ency-verse-card">
      <div class="ency-verse-arabic">${verse.arabic}</div>
      <div class="ency-verse-translation">${verse.translation}</div>
      <div class="ency-verse-ref">
        <span>${verse.surah} ${verse.surahNumber}:${verse.ayah}</span>
      </div>
    </div>`;
  }

  function buildDirectScholarLinks(comment, ency) {
    const out = [];
    const seen = new Set();
    const add = function(link) {
      if (!link || !link.url || !link.lang) return;
      if (link.lang !== 'en' && link.lang !== 'fr') return;
      if (seen.has(link.url)) return;
      seen.add(link.url);
      out.push(link);
    };

    const firstVerse = ency && ency.quranVerses && ency.quranVerses.length > 0 ? ency.quranVerses[0] : null;
    const firstHadith = ency && ency.hadithReferences && ency.hadithReferences.length > 0 ? ency.hadithReferences[0] : null;
    const verseRef = firstVerse ? (firstVerse.surahNumber + ':' + firstVerse.ayah) : '';
    const scholar = (comment && comment.scholar ? comment.scholar : '').toLowerCase();
    const key = (comment && comment.sourceKey ? comment.sourceKey : '').toLowerCase();

    if (firstVerse && (/ibn kathir/.test(scholar) || key === 'ibn_kathir')) {
      add({
        label: 'Tafsir Ibn Kathir (' + verseRef + ')',
        url: 'https://www.alim.org/quran/tafsir/ibn-kathir/surah/' + firstVerse.surahNumber + '/' + firstVerse.ayah + '/',
        lang: 'en'
      });
      add({
        label: 'Verset ' + verseRef + ' (Quran.com FR)',
        url: firstVerse.link,
        lang: 'fr'
      });
    }

    if (firstHadith && ((/nawawi/.test(scholar) || key === 'nawawi') || (/bukhari/.test(scholar) || key === 'bukhari') || (/muslim/.test(scholar) || key === 'muslim'))) {
      add({
        label: firstHadith.collection + ' ' + firstHadith.number + ' (Sunnah.com)',
        url: firstHadith.link,
        lang: 'en'
      });
    }

    // Fallbacks to keep at least one precise FR/EN link per comment card
    if (firstVerse) {
      add({
        label: 'Verset ' + verseRef + ' (Quran.com FR)',
        url: firstVerse.link,
        lang: 'fr'
      });
    }
    if (firstHadith) {
      add({
        label: firstHadith.collection + ' ' + firstHadith.number + ' (Sunnah.com)',
        url: firstHadith.link,
        lang: 'en'
      });
    }

    return out;
  }

  function isPreciseCitationUrl(url) {
    if (!url || typeof url !== 'string') return false;
    const u = url.toLowerCase();
    if (/quran\.com\/(?:[a-z]{2}\/)?\d+:\d+(?:\/|$)/.test(u)) return true;
    if (/quran\.com\/en\/\d+:\d+\/tafsirs\//.test(u)) return true;
    if (/sunnah\.com\/[a-z]+:\d+[a-z]?$/.test(u)) return true;
    if (/alim\.org\/quran\/tafsir\/ibn-kathir\/surah\/\d+\/\d+\/?$/.test(u)) return true;
    if (/islamqa\.info\/(fr|en)\/answers\/\d+\/?$/.test(u)) return true;
    return false;
  }

  function mergeAndFilterLinks(directLinks, links) {
    const out = [];
    const seen = new Set();
    const push = function(l) {
      if (!l || !l.url || !l.lang) return;
      if (l.lang !== 'en' && l.lang !== 'fr') return;
      if (!isPreciseCitationUrl(l.url)) return;
      if (seen.has(l.url)) return;
      seen.add(l.url);
      out.push(l);
    };
    (directLinks || []).forEach(push);
    (links || []).forEach(push);
    return out;
  }

  function renderScholarCardPublic(comment, ency) {
    const src = typeof SCHOLARLY_SOURCES !== 'undefined' && SCHOLARLY_SOURCES[comment.sourceKey] ? SCHOLARLY_SOURCES[comment.sourceKey] : null;
    const title = comment.title || (src ? src.title : '');
    const citation = (src && src.citation) ? src.citation : '';
    let citationHtml = '';
    if (citation) {
      citationHtml = '<div class="ency-scholar-citation">' + citation + '</div>';
    }
    return `<div class="ency-scholar-card">
      <div class="ency-scholar-name">${comment.scholar}</div>
      ${title ? '<div class="ency-scholar-work">' + title + '</div>' : ''}
      <div class="ency-scholar-text">${Glossary.processText(comment.text)}</div>
      ${citationHtml}
    </div>`;
  }

  function renderHadithCardPublic(hadith) {
    return `<div class="ency-hadith-card">
      <div class="ency-hadith-collection">${hadith.collection} ${hadith.number ? '#' + hadith.number : ''}</div>
      <div class="ency-hadith-text">${hadith.text}</div>
    </div>`;
  }

  // SVG section icons (replaces emojis in detail view)
  const SECTION_ICONS = {
    note:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>',
    book:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
    scroll:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/></svg>',
    link:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    quran:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>',
    hadith:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/></svg>',
    scholar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>'
  };

  function encySection(icon, title, contentHtml) {
    return `
      <div class="ency-section-divider ency-reveal"><div class="ency-section-divider-diamond"></div></div>
      <div class="ency-open-section ency-reveal">
        <div class="ency-detail-label"><span class="ency-detail-label-icon">${icon}</span> ${title}</div>
        <div class="ency-open-section-body">${contentHtml}</div>
      </div>`;
  }

  function renderScholarsSection(scholarComments, ency) {
    let html = '';
    scholarComments.forEach(function(c) {
      html += renderScholarCardPublic(c, ency);
    });
    return html;
  }

  // =====================================================================
  //  ENCYCLOPEDIA V2 — Onglets trilingues
  // =====================================================================

  var currentEncyTab = 'ling';

  function renderTrilingualBlock(title, texts) {
    if (!texts) return '';
    var html = '<div class="ency-v2-trilingual">';
    if (title) html += '<div class="ency-v2-trilingual-title">' + title + '</div>';
    if (texts.fr) html += '<div class="ency-v2-lang-row"><span class="ency-lang-fr">FR</span><span>' + texts.fr + '</span></div>';
    if (texts.en) html += '<div class="ency-v2-lang-row"><span class="ency-lang-en">EN</span><span>' + texts.en + '</span></div>';
    if (texts.ar) html += '<div class="ency-v2-lang-row rtl"><span class="ency-lang-ar">AR</span><span>' + texts.ar + '</span></div>';
    html += '</div>';
    return html;
  }

  function tabHasContent(tabId, v2) {
    switch (tabId) {
      case 'ling': return !!(v2.identification || v2.linguistic);
      case 'theo': return !!(v2.theology && v2.theology.explanation);
      case 'quran': return !!((v2.quranOccurrences && v2.quranOccurrences.length) || (v2.sunnaOccurrences && v2.sunnaOccurrences.length));
      case 'scholars': return !!(v2.madhabOpinions && (v2.madhabOpinions.hanafi || v2.madhabOpinions.maliki || v2.madhabOpinions.shafii || v2.madhabOpinions.hanbali));
      case 'sources': return !!(v2.verifiedLinks || (v2.linguistic && v2.linguistic.dictionary_sources && v2.linguistic.dictionary_sources.length));
      case 'practice': return !!(v2.practice || (v2.commonMistakes && v2.commonMistakes.length));
      default: return false;
    }
  }

  function renderTabLinguistic(name, v2) {
    var html = '';
    var id = v2.identification;
    if (id) {
      html += '<div class="ency-v2-block">';
      html += '<div class="ency-v2-block-title">Identification</div>';
      html += '<div class="ency-v2-grid">';
      html += '<div class="ency-v2-field"><div class="ency-v2-field-label">Translitteration ALA-LC</div><div class="ency-v2-field-value">' + (id.transliteration_alalc || '') + '</div></div>';
      html += '<div class="ency-v2-field"><div class="ency-v2-field-label">Phonetique FR</div><div class="ency-v2-field-value">' + (id.phonetic_fr || '') + '</div></div>';
      html += '<div class="ency-v2-field"><div class="ency-v2-field-label">Racine</div><div class="ency-v2-field-value ar">' + (id.root || '') + '</div></div>';
      html += '<div class="ency-v2-field"><div class="ency-v2-field-label">Racine (latin)</div><div class="ency-v2-field-value">' + (id.root_latin || '') + '</div></div>';
      html += '<div class="ency-v2-field"><div class="ency-v2-field-label">Forme grammaticale</div><div class="ency-v2-field-value">' + (id.grammatical_form || '') + '</div></div>';
      html += '<div class="ency-v2-field"><div class="ency-v2-field-label">Forme (arabe)</div><div class="ency-v2-field-value ar">' + (id.grammatical_form_ar || '') + '</div></div>';
      html += '</div>';
      if (id.theological_implication) {
        html += renderTrilingualBlock('Implication theologique', id.theological_implication);
      }
      html += '</div>';
    }

    var ling = v2.linguistic;
    if (ling) {
      if (ling.classical_meaning) {
        html += renderTrilingualBlock('Sens classique', ling.classical_meaning);
      }
      if (ling.differences_with_synonyms) {
        html += '<div class="ency-v2-block">';
        html += '<div class="ency-v2-block-title">Differences avec les synonymes</div>';
        html += '<div class="ency-v2-trilingual">';
        if (ling.differences_with_synonyms.fr) html += '<div class="ency-v2-lang-row"><span class="ency-lang-fr">FR</span><span>' + ling.differences_with_synonyms.fr + '</span></div>';
        if (ling.differences_with_synonyms.en) html += '<div class="ency-v2-lang-row"><span class="ency-lang-en">EN</span><span>' + ling.differences_with_synonyms.en + '</span></div>';
        html += '</div></div>';
      }
      if (ling.pre_islamic_usage) {
        html += '<div class="ency-v2-block">';
        html += '<div class="ency-v2-block-title">Usage pre-islamique</div>';
        html += '<div class="ency-v2-trilingual">';
        if (ling.pre_islamic_usage.fr) html += '<div class="ency-v2-lang-row"><span class="ency-lang-fr">FR</span><span>' + ling.pre_islamic_usage.fr + '</span></div>';
        if (ling.pre_islamic_usage.en) html += '<div class="ency-v2-lang-row"><span class="ency-lang-en">EN</span><span>' + ling.pre_islamic_usage.en + '</span></div>';
        html += '</div></div>';
      }
      if (ling.semantic_evolution) {
        html += '<div class="ency-v2-block">';
        html += '<div class="ency-v2-block-title">Evolution semantique</div>';
        html += '<div class="ency-v2-trilingual">';
        if (ling.semantic_evolution.fr) html += '<div class="ency-v2-lang-row"><span class="ency-lang-fr">FR</span><span>' + ling.semantic_evolution.fr + '</span></div>';
        if (ling.semantic_evolution.en) html += '<div class="ency-v2-lang-row"><span class="ency-lang-en">EN</span><span>' + ling.semantic_evolution.en + '</span></div>';
        html += '</div></div>';
      }
      if (ling.dictionary_sources && ling.dictionary_sources.length > 0) {
        html += '<div class="ency-v2-block">';
        html += '<div class="ency-v2-block-title">Sources lexicographiques</div>';
        ling.dictionary_sources.forEach(function(ds) {
          var src = (typeof SCHOLARLY_SOURCES_V2 !== 'undefined' && SCHOLARLY_SOURCES_V2[ds.sourceKey]) ? SCHOLARLY_SOURCES_V2[ds.sourceKey] : null;
          var srcTitle = src ? src.title : ds.sourceKey;
          html += '<div class="ency-v2-source-card">';
          html += '<div class="ency-v2-source-entry"><strong>' + srcTitle + '</strong>';
          if (ds.entry) html += ' — entree : ' + ds.entry;
          if (ds.volume) html += ', vol. ' + ds.volume;
          if (ds.page) html += ', p. ' + ds.page;
          html += '</div>';
          if (ds.text_ar) html += '<div class="ency-v2-source-text-ar">' + ds.text_ar + '</div>';
          if (ds.text_fr) html += '<div class="ency-v2-source-text-fr">' + ds.text_fr + '</div>';
          html += '</div>';
        });
        html += '</div>';
      }
    }
    return html || '<div class="ency-v2-placeholder">Contenu en preparation...</div>';
  }

  function renderTabTheology(name, v2) {
    var html = '';
    var theo = v2.theology;
    if (!theo) return '<div class="ency-v2-placeholder">Contenu en preparation...</div>';

    if (theo.attribute_type_labels) {
      html += '<div class="ency-v2-block">';
      html += '<div class="ency-v2-block-title">Type d\'attribut</div>';
      html += renderTrilingualBlock(null, theo.attribute_type_labels);
      html += '</div>';
    }

    if (theo.explanation) {
      html += renderTrilingualBlock('Explication', theo.explanation);
    }

    if (theo.debates && theo.debates.length > 0) {
      html += '<div class="ency-v2-block">';
      html += '<div class="ency-v2-block-title">Debats theologiques</div>';
      theo.debates.forEach(function(d) {
        html += '<div class="ency-v2-debate">';
        html += '<div class="ency-v2-debate-school">' + d.school + '</div>';
        if (d.scholars && d.scholars.length) {
          html += '<div class="ency-v2-debate-scholars">Savants : ' + d.scholars.join(', ') + '</div>';
        }
        if (d.position) {
          html += '<div style="padding: 0 14px;">';
          html += renderTrilingualBlock(null, d.position);
          html += '</div>';
        }
        html += '</div>';
      });
      html += '</div>';
    }
    return html;
  }

  function renderV2VerseCard(verse) {
    var html = '<div class="ency-v2-verse-card">';
    if (verse.arabic_text) html += '<div class="ency-v2-verse-arabic">' + verse.arabic_text + '</div>';
    var ref = (verse.surah_name_fr || '') + ' (' + verse.surahNumber + ':' + verse.ayahNumber + ')';
    html += '<div class="ency-v2-verse-ref">';
    if (verse.link) html += '<a href="' + verse.link + '" target="_blank" rel="noopener">' + ref + '</a>';
    else html += ref;
    if (verse.morphology_link) html += ' &middot; <a href="' + verse.morphology_link + '" target="_blank" rel="noopener">Morphologie</a>';
    html += '</div>';
    if (verse.translation_fr) {
      html += '<div class="ency-v2-lang-row"><span class="ency-lang-fr">FR</span><span>' + verse.translation_fr.text + '</span></div>';
    }
    if (verse.translation_en) {
      html += '<div class="ency-v2-lang-row"><span class="ency-lang-en">EN</span><span>' + verse.translation_en.text + '</span></div>';
    }
    if (verse.context) {
      html += '<div style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.04);">';
      if (verse.context.fr) html += '<div class="ency-v2-lang-row" style="font-size:0.78rem; color:rgba(255,255,255,0.55);"><span class="ency-lang-fr">FR</span><span>' + verse.context.fr + '</span></div>';
      if (verse.context.en) html += '<div class="ency-v2-lang-row" style="font-size:0.78rem; color:rgba(255,255,255,0.55);"><span class="ency-lang-en">EN</span><span>' + verse.context.en + '</span></div>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function renderV2HadithCard(hadith) {
    var html = '<div class="ency-v2-hadith-card">';
    html += '<div class="ency-v2-hadith-meta">';
    html += '<span class="ency-v2-hadith-collection">' + hadith.collection + (hadith.number ? ' #' + hadith.number : '') + '</span>';
    if (hadith.authentication) html += '<span class="ency-v2-hadith-grading">' + hadith.authentication + '</span>';
    html += '</div>';
    if (hadith.text_ar) html += '<div class="ency-v2-hadith-arabic">' + hadith.text_ar + '</div>';
    if (hadith.text_fr) html += '<div class="ency-v2-lang-row"><span class="ency-lang-fr">FR</span><span>' + hadith.text_fr + '</span></div>';
    if (hadith.text_en) html += '<div class="ency-v2-lang-row"><span class="ency-lang-en">EN</span><span>' + hadith.text_en + '</span></div>';
    if (hadith.link) html += '<div style="margin-top:8px;"><a class="ency-link" href="' + hadith.link + '" target="_blank" rel="noopener">Sunnah.com <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></div>';
    html += '</div>';
    return html;
  }

  function renderTabQuranHadith(name, v2) {
    var html = '';
    if (v2.quranOccurrences && v2.quranOccurrences.length > 0) {
      html += '<div class="ency-v2-block">';
      html += '<div class="ency-v2-block-title">References coraniques (' + v2.quranOccurrences.length + ')</div>';
      v2.quranOccurrences.forEach(function(v) { html += renderV2VerseCard(v); });
      html += '</div>';
    }
    if (v2.sunnaOccurrences && v2.sunnaOccurrences.length > 0) {
      html += '<div class="ency-v2-block">';
      html += '<div class="ency-v2-block-title">References prophetiques (' + v2.sunnaOccurrences.length + ')</div>';
      v2.sunnaOccurrences.forEach(function(h) { html += renderV2HadithCard(h); });
      html += '</div>';
    }
    if (!html) html = '<div class="ency-v2-placeholder">Contenu en preparation...</div>';
    return html;
  }

  function buildDirectV2ScholarLinks(comment, v2) {
    var out = [];
    var seen = {};
    function add(link) {
      if (!link || !link.url || !link.lang) return;
      if (link.lang !== 'en' && link.lang !== 'fr') return;
      if (!isPreciseCitationUrl(link.url)) return;
      if (seen[link.url]) return;
      seen[link.url] = true;
      out.push(link);
    }

    var scholar = ((comment && comment.scholar) || '').toLowerCase();
    var key = ((comment && comment.sourceKey) || '').toLowerCase();
    var firstVerse = null;
    if (v2 && v2.quranOccurrences && v2.quranOccurrences.length) {
      for (var i = 0; i < v2.quranOccurrences.length; i++) {
        var v = v2.quranOccurrences[i];
        if (v && (v.link || (v.surahNumber && v.ayahNumber))) {
          firstVerse = v;
          break;
        }
      }
    }
    var firstHadith = null;
    if (v2 && v2.sunnaOccurrences && v2.sunnaOccurrences.length) {
      for (var j = 0; j < v2.sunnaOccurrences.length; j++) {
        var h = v2.sunnaOccurrences[j];
        if (h && h.link) {
          firstHadith = h;
          break;
        }
      }
    }

    if (firstVerse && firstVerse.surahNumber && firstVerse.ayahNumber) {
      var verseRef = firstVerse.surahNumber + ':' + firstVerse.ayahNumber;
      if (/ibn kathir/.test(scholar) || key === 'ibn_kathir') {
        add({ label: 'Tafsir Ibn Kathir (' + verseRef + ')', url: 'https://www.alim.org/quran/tafsir/ibn-kathir/surah/' + firstVerse.surahNumber + '/' + firstVerse.ayahNumber + '/', lang: 'en' });
      }
      if (firstVerse.link) add({ label: 'Verset ' + verseRef + ' (Quran.com FR)', url: firstVerse.link, lang: 'fr' });
    }

    if (firstHadith && ((/nawawi/.test(scholar) || key === 'nawawi') || (/bukhari/.test(scholar) || key === 'bukhari') || (/muslim/.test(scholar) || key === 'muslim'))) {
      add({ label: (firstHadith.collection || 'Hadith') + (firstHadith.number ? ' ' + firstHadith.number : '') + ' (Sunnah.com)', url: firstHadith.link, lang: 'en' });
    }

    if (firstHadith && firstHadith.link) {
      add({ label: (firstHadith.collection || 'Hadith') + (firstHadith.number ? ' ' + firstHadith.number : '') + ' (Sunnah.com)', url: firstHadith.link, lang: 'en' });
    }

    return out;
  }

  function renderV2ScholarCard(comment, color, v2) {
    var html = '<div class="ency-v2-scholar-card" style="--scholar-color: ' + (color || 'rgba(255,255,255,0.15)') + ';">';
    html += '<div style="margin-bottom:6px;">';
    html += '<span style="font-weight:700; color: var(--gold); font-size:0.88rem;">' + comment.scholar + '</span>';
    var src = (typeof SCHOLARLY_SOURCES_V2 !== 'undefined' && SCHOLARLY_SOURCES_V2[comment.sourceKey]) ? SCHOLARLY_SOURCES_V2[comment.sourceKey] : null;
    if (src) html += '<span style="display:block; font-size:0.72rem; color:rgba(255,255,255,0.45); font-style:italic;">' + src.title + '</span>';
    if (comment.page_ref) html += '<span style="display:block; font-size:0.68rem; color:rgba(255,255,255,0.35);">' + comment.page_ref + '</span>';
    html += '</div>';
    if (comment.text_fr) html += '<div class="ency-v2-lang-row"><span class="ency-lang-fr">FR</span><span>' + comment.text_fr + '</span></div>';
    if (comment.text_en) html += '<div class="ency-v2-lang-row"><span class="ency-lang-en">EN</span><span>' + comment.text_en + '</span></div>';
    if (comment.text_ar) html += '<div class="ency-v2-lang-row rtl"><span class="ency-lang-ar">AR</span><span>' + comment.text_ar + '</span></div>';
    // Citation
    if (src && src.citation) {
      html += '<div class="ency-scholar-citation">' + src.citation + '</div>';
    }
    html += '</div>';
    return html;
  }

  function renderTabScholars(name, v2) {
    var opinions = v2.madhabOpinions;
    if (!opinions) return '<div class="ency-v2-placeholder">Contenu en preparation...</div>';

    // Flatten all scholar opinions into a single list
    var allComments = [];
    ['hanafi', 'maliki', 'shafii', 'hanbali'].forEach(function(m) {
      var items = opinions[m] || [];
      items.forEach(function(c) { allComments.push(c); });
    });

    if (allComments.length === 0) return '<div class="ency-v2-placeholder">Contenu en preparation...</div>';

    var colors = ['#60a5fa', '#4ade80', '#c084fc', '#f59e0b', '#22d3ee', '#fb923c', '#f472b6', '#a78bfa'];
    var html = '';
    allComments.forEach(function(c, idx) {
      html += renderV2ScholarCard(c, colors[idx % colors.length], v2);
    });
    return html;
  }

  function renderTabSources(name, v2) {
    var html = '';

    // Dictionary sources (if any)
    if (v2.linguistic && v2.linguistic.dictionary_sources && v2.linguistic.dictionary_sources.length > 0) {
      html += '<div class="ency-v2-block">';
      html += '<div class="ency-v2-block-title">Sources lexicographiques</div>';
      v2.linguistic.dictionary_sources.forEach(function(ds) {
        var src = (typeof SCHOLARLY_SOURCES_V2 !== 'undefined' && SCHOLARLY_SOURCES_V2[ds.sourceKey]) ? SCHOLARLY_SOURCES_V2[ds.sourceKey] : null;
        var srcTitle = src ? src.title : ds.sourceKey;
        var srcAuthor = src ? src.author : '';
        html += '<div class="ency-v2-source-card">';
        html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">';
        html += '<strong style="font-size:0.82rem; color:rgba(255,255,255,0.9);">' + srcTitle + '</strong>';
        html += '</div>';
        if (srcAuthor) html += '<div style="font-size:0.7rem; color:rgba(255,255,255,0.4); margin-bottom:4px;">' + srcAuthor + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }

    // All scholarly sources cited
    if (v2.madhabOpinions) {
      var seenSources = {};
      var allSources = [];
      ['hanafi', 'maliki', 'shafii', 'hanbali'].forEach(function(m) {
        var items = v2.madhabOpinions[m] || [];
        items.forEach(function(c) {
          if (c.sourceKey && !seenSources[c.sourceKey]) {
            seenSources[c.sourceKey] = true;
            var src = (typeof SCHOLARLY_SOURCES_V2 !== 'undefined' && SCHOLARLY_SOURCES_V2[c.sourceKey]) ? SCHOLARLY_SOURCES_V2[c.sourceKey] : null;
            if (src) allSources.push(src);
          }
        });
      });
      if (allSources.length > 0) {
        html += '<div class="ency-v2-block">';
        html += '<div class="ency-v2-block-title">Ouvrages savants cites</div>';
        allSources.forEach(function(src) {
          html += '<div class="ency-v2-source-card">';
          html += '<div style="font-size:0.82rem; font-weight:600; color:rgba(255,255,255,0.9); margin-bottom:2px;">' + src.title + '</div>';
          html += '<div style="font-size:0.72rem; color:rgba(255,255,255,0.5);">' + src.author + '</div>';
          html += '</div>';
        });
        html += '</div>';
      }
    }
    if (!html) html = '<div class="ency-v2-placeholder">Contenu en preparation...</div>';
    return html;
  }

  function renderTabPractice(name, v2) {
    var html = '';
    var prac = v2.practice;
    if (prac) {
      if (prac.spiritual_impact) {
        html += '<div class="ency-v2-block">';
        html += '<div class="ency-v2-block-title">Impact spirituel</div>';
        html += '<div class="ency-v2-trilingual">';
        if (prac.spiritual_impact.fr) html += '<div class="ency-v2-lang-row"><span class="ency-lang-fr">FR</span><span>' + prac.spiritual_impact.fr + '</span></div>';
        if (prac.spiritual_impact.en) html += '<div class="ency-v2-lang-row"><span class="ency-lang-en">EN</span><span>' + prac.spiritual_impact.en + '</span></div>';
        html += '</div></div>';
      }

      if (prac.authentic_duas && prac.authentic_duas.length > 0) {
        html += '<div class="ency-v2-block">';
        html += '<div class="ency-v2-block-title">Invocations (Du\'a)</div>';
        prac.authentic_duas.forEach(function(dua) {
          html += '<div class="ency-v2-dua-card">';
          if (dua.arabic) html += '<div class="ency-v2-dua-arabic">' + dua.arabic + '</div>';
          if (dua.transliteration) html += '<div class="ency-v2-dua-translit">' + dua.transliteration + '</div>';
          if (dua.fr) html += '<div class="ency-v2-lang-row"><span class="ency-lang-fr">FR</span><span>' + dua.fr + '</span></div>';
          if (dua.en) html += '<div class="ency-v2-lang-row"><span class="ency-lang-en">EN</span><span>' + dua.en + '</span></div>';
          html += '<div class="ency-v2-dua-source">';
          if (dua.link) html += '<a href="' + dua.link + '" target="_blank" rel="noopener">' + dua.source + '</a>';
          else html += dua.source;
          html += ' ';
          html += dua.verified ? '<span class="ency-v2-badge-verified">\u2713 Verifie</span>' : '<span class="ency-v2-badge-unverified">\u26A0 Non verifie</span>';
          html += '</div>';
          html += '</div>';
        });
        html += '</div>';
      }

      if (prac.dhikr && prac.dhikr.length > 0) {
        html += '<div class="ency-v2-block">';
        html += '<div class="ency-v2-block-title">Dhikr</div>';
        prac.dhikr.forEach(function(d) {
          html += '<div class="ency-v2-dua-card">';
          if (d.formula_ar) html += '<div class="ency-v2-dua-arabic">' + d.formula_ar + '</div>';
          if (d.instruction_fr) html += '<div class="ency-v2-lang-row"><span class="ency-lang-fr">FR</span><span>' + d.instruction_fr + '</span></div>';
          if (d.instruction_en) html += '<div class="ency-v2-lang-row"><span class="ency-lang-en">EN</span><span>' + d.instruction_en + '</span></div>';
          html += '<div class="ency-v2-dua-source">' + (d.source || '') + ' ';
          html += d.verified ? '<span class="ency-v2-badge-verified">\u2713 Verifie</span>' : '<span class="ency-v2-badge-unverified">\u26A0 Non verifie</span>';
          html += '</div>';
          html += '</div>';
        });
        html += '</div>';
      }

      if (prac.derived_names) {
        html += '<div class="ency-v2-block">';
        html += '<div class="ency-v2-block-title">Prenoms derives</div>';
        html += '<div class="ency-v2-trilingual">';
        if (prac.derived_names.fr) html += '<div class="ency-v2-lang-row"><span class="ency-lang-fr">FR</span><span>' + prac.derived_names.fr + '</span></div>';
        if (prac.derived_names.en) html += '<div class="ency-v2-lang-row"><span class="ency-lang-en">EN</span><span>' + prac.derived_names.en + '</span></div>';
        html += '</div></div>';
      }
    }

    // Common mistakes (Section 9)
    if (v2.commonMistakes && v2.commonMistakes.length > 0) {
      html += '<div class="ency-v2-block">';
      html += '<div class="ency-v2-block-title">Erreurs courantes</div>';
      v2.commonMistakes.forEach(function(err) {
        html += '<div class="ency-v2-debate" style="border-left: 3px solid #ef4444;">';
        html += '<div class="ency-v2-debate-school" style="color: #fca5a5;">Erreur</div>';
        html += '<div style="padding: 6px 14px;">';
        if (err.mistake && err.mistake.fr) html += '<div class="ency-v2-lang-row" style="color:#fca5a5;"><span class="ency-lang-fr">FR</span><span>' + err.mistake.fr + '</span></div>';
        if (err.mistake && err.mistake.en) html += '<div class="ency-v2-lang-row" style="color:#fca5a5;"><span class="ency-lang-en">EN</span><span>' + err.mistake.en + '</span></div>';
        html += '</div>';
        html += '<div class="ency-v2-debate-school" style="color: #4ade80;">Correction</div>';
        html += '<div style="padding: 6px 14px;">';
        if (err.correction && err.correction.fr) html += '<div class="ency-v2-lang-row"><span class="ency-lang-fr">FR</span><span>' + err.correction.fr + '</span></div>';
        if (err.correction && err.correction.en) html += '<div class="ency-v2-lang-row"><span class="ency-lang-en">EN</span><span>' + err.correction.en + '</span></div>';
        html += '</div>';
        if (err.source) html += '<div style="padding:4px 14px 8px; font-size:0.7rem; color:rgba(255,255,255,0.35);">Source : ' + err.source + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }

    if (!html) html = '<div class="ency-v2-placeholder">Contenu en preparation...</div>';
    return html;
  }

  function renderEncyTabs(name, v2) {
    var tabs = [
      { id: 'ling',    label: 'Linguistique',    render: renderTabLinguistic },
      { id: 'theo',    label: 'Theologie',        render: renderTabTheology },
      { id: 'quran',   label: 'Coran & Hadith',   render: renderTabQuranHadith },
      { id: 'scholars', label: 'Savants',            render: renderTabScholars },
      { id: 'sources', label: 'Sources',           render: renderTabSources },
      { id: 'practice',label: 'Pratique',          render: renderTabPractice }
    ];

    // If saved tab has no content, fall back to first tab with content
    var activeTab = currentEncyTab;
    if (!tabHasContent(activeTab, v2)) {
      activeTab = 'ling';
      for (var i = 0; i < tabs.length; i++) {
        if (tabHasContent(tabs[i].id, v2)) { activeTab = tabs[i].id; break; }
      }
    }
    currentEncyTab = activeTab;

    var html = '<div class="ency-tabs-nav">';
    tabs.forEach(function(t) {
      var hasContent = tabHasContent(t.id, v2);
      html += '<div class="ency-tab' + (t.id === activeTab ? ' active' : '') + '" data-tab="' + t.id + '">';
      html += t.label;
      if (!hasContent) html += '<span class="ency-tab-badge">--</span>';
      html += '</div>';
    });
    html += '</div>';

    tabs.forEach(function(t) {
      html += '<div class="ency-tab-panel' + (t.id === activeTab ? ' active' : '') + '" data-tab-panel="' + t.id + '">';
      html += t.render(name, v2);
      html += '</div>';
    });

    // Meta info
    if (v2._meta) {
      html += '<div style="padding:12px 16px; font-size:0.68rem; color:rgba(255,255,255,0.25); text-align:right; border-top:1px solid rgba(255,255,255,0.04);">';
      html += 'V2 · ' + v2._meta.lastUpdated;
      if (!v2._meta.verified) html += ' · <span class="ency-v2-badge-unverified">\u26A0 A verifier</span>';
      else html += ' · <span class="ency-v2-badge-verified">\u2713 Verifie</span>';
      html += '</div>';
    }

    return html;
  }

  function setupEncyTabListeners(container) {
    // Main tabs
    var tabs = container.querySelectorAll('.ency-tab[data-tab]');
    var panels = container.querySelectorAll('.ency-tab-panel[data-tab-panel]');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var target = tab.getAttribute('data-tab');
        currentEncyTab = target;
        tabs.forEach(function(t) { t.classList.toggle('active', t.getAttribute('data-tab') === target); });
        panels.forEach(function(p) { p.classList.toggle('active', p.getAttribute('data-tab-panel') === target); });
      });
    });

    // Sub-tabs (if any)
    var subtabs = container.querySelectorAll('.ency-subtab[data-subtab]');
    var subpanels = container.querySelectorAll('.ency-subtab-panel[data-subtab-panel]');
    subtabs.forEach(function(st) {
      st.addEventListener('click', function() {
        var target = st.getAttribute('data-subtab');
        subtabs.forEach(function(s) { s.classList.toggle('active', s.getAttribute('data-subtab') === target); });
        subpanels.forEach(function(p) { p.classList.toggle('active', p.getAttribute('data-subtab-panel') === target); });
      });
    });
  }

  // =====================================================================
  //  END V2 FUNCTIONS
  // =====================================================================

  function renderEncyclopediaDetail(name, filtered) {
    const container = document.getElementById('encyDetailContent');
    const cat = CATEGORIES[name.category] || {};
    const ency = name.encyclopedia;
    const colors = CATEGORY_COLORS[name.category] || CATEGORY_COLORS.sovereignty;

    // Update progress bar
    const progressPercent = ((encyDetailIndex + 1) / filtered.length) * 100;
    document.getElementById('encyDetailProgress').style.setProperty('--progress', progressPercent + '%');

    // Update nav counter
    document.getElementById('encyNavCounter').textContent = (encyDetailIndex + 1) + ' / ' + filtered.length;

    // Update prev/next button states
    document.getElementById('encyPrev').disabled = encyDetailIndex <= 0;
    document.getElementById('encyNext').disabled = encyDetailIndex >= filtered.length - 1;

    // Set category accent on detail card
    container.style.setProperty('--card-accent', colors.accent);

    // Reset glossary found terms for this render
    if (typeof Glossary !== 'undefined') Glossary.reset();

    let html = `
      <div class="ency-hero">
        <div class="ency-hero-pattern"></div>
        <div class="ency-hero-ornament-tl"></div>
        <div class="ency-hero-ornament-br"></div>
        <div class="ency-hero-number">N\u00b0 ${name.id} / 99</div>
        <div class="ency-detail-arabic">${name.arabic}</div>
        <div class="ency-detail-translit">${name.transliteration}</div>
        <div class="ency-detail-meaning">${name.french}</div>
        <div class="ency-detail-english">${name.english}</div>
        <div class="ency-detail-badge">${CATEGORY_ICONS[name.category] || ''} ${cat.fr || ''}</div>
        ${name.rootWord ? '<div class="ency-detail-root">' + name.rootWord + '</div>' : ''}
      </div>`;

    const integrityEntry = name.encyclopediaIntegrity || null;
    if (STRICT_RELIGIOUS_MODE && (!integrityEntry || integrityEntry.public_display_allowed !== true)) {
      const blockers = integrityEntry && Array.isArray(integrityEntry.publication_blockers)
        ? integrityEntry.publication_blockers
        : ['INSUFFICIENT_EVIDENCE'];
      const status = integrityEntry && integrityEntry.editorial_review
        ? integrityEntry.editorial_review.status
        : 'needs_human_review';
      html += `
        <section class="ency-section">
          <div class="ency-section-title"><span class="ico">\u26A0</span> Verification editoriale requise</div>
          <div class="ency-detail-text">
            Cette fiche est bloquee en mode strict. Aucun contenu doctrinal detaille n'est affiche tant que
            la validation religieuse et la verification des sources ne sont pas completes.
          </div>
          <div class="ency-sources" style="margin-top:12px;">
            <div class="ency-source-item"><strong>Statut review:</strong> ${status}</div>
            <div class="ency-source-item"><strong>Blocages:</strong> ${blockers.join(', ')}</div>
          </div>
        </section>`;
      container.innerHTML = html;
      const page = document.getElementById('pageEncyclopedia');
      if (page) page.scrollTop = 0;
      window.scrollTo(0, 0);
      setupDetailSwipe(container, filtered);
      setupEncyScrollReveal(container);
      return;
    }

    // --- Linear display (V1) — same layout for all names ---

    // --- Linguistic note ---
    if (name.linguisticNote) {
      html += encySection(SECTION_ICONS.note, 'Note linguistique',
        '<div class="ency-detail-text">' + Glossary.processText(name.linguisticNote) + '</div>');
    }

    // --- Detailed meaning ---
    var rawMeaning = ency ? ency.detailedMeaning : name.description;
    var meaningContent = '<div class="ency-detail-text">' + Glossary.processText(rawMeaning) + '</div>';
    html += encySection(SECTION_ICONS.book, 'Signification d\u00e9taill\u00e9e', meaningContent);

    // --- Quran verses ---
    if (ency && ency.quranVerses && ency.quranVerses.length > 0) {
      let versesHtml = '';
      ency.quranVerses.forEach(function(v) { versesHtml += renderVerseCardPublic(v); });
      html += encySection(SECTION_ICONS.quran, 'R\u00e9f\u00e9rences coraniques', versesHtml);
    } else if (name.quranVerse) {
      html += encySection(SECTION_ICONS.quran, 'Source coranique',
        '<div class="ency-source-card"><div class="ency-source-text">' + name.quranVerse + '</div></div>');
    }

    // --- Scholar comments ---
    if (ency && ency.scholarComments && ency.scholarComments.length > 0) {
      html += encySection(SECTION_ICONS.scholar, 'Commentaires des savants', renderScholarsSection(ency.scholarComments, ency));
    }

    // --- Hadith references ---
    if (ency && ency.hadithReferences && ency.hadithReferences.length > 0) {
      let hadithHtml = '';
      ency.hadithReferences.forEach(function(h) { hadithHtml += renderHadithCardPublic(h); });
      html += encySection(SECTION_ICONS.hadith, 'R\u00e9f\u00e9rences proph\u00e9tiques', hadithHtml);
    }

    html += Glossary.renderLexiqueSection();
    container.innerHTML = html;
    Glossary.bindEvents(container);

    // Scroll to top of detail
    const page = document.getElementById('pageEncyclopedia');
    if (page) page.scrollTop = 0;
    window.scrollTo(0, 0);

    // Swipe handlers for mobile navigation
    setupDetailSwipe(container, filtered);
    setupEncyScrollReveal(container);
  }

  function setupDetailSwipe(container, filtered) {
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 60;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > minSwipeDistance) {
        if (diff > 0 && encyDetailIndex < filtered.length - 1) {
          navigateEncyDetail(1);
        } else if (diff < 0 && encyDetailIndex > 0) {
          navigateEncyDetail(-1);
        }
      }
    }, { passive: true });
  }

  function setupEncyScrollReveal(container) {
    var revealEls = container.querySelectorAll('.ency-reveal');
    if (!revealEls.length) return;
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function(el) { el.classList.add('revealed'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el) { observer.observe(el); });
  }

  // ================================================================
  //  TRAINING — Premium Redesign
  // ================================================================

  function setupTrainingEvents() {
    document.getElementById('btnTraining').addEventListener('click', () => {
      showTraining();
    });

    // Kids mode toggle in training
    const kidsToggle = document.getElementById('kidsToggle');
    if (kidsToggle) {
      kidsToggle.addEventListener('click', () => {
        if (typeof Modes !== 'undefined') Modes.toggleKidsMode();
      });
    }

    // Back button — use delegation since it's inside trainingHome hero
    document.getElementById('pageTraining').addEventListener('click', (e) => {
      const backBtn = e.target.closest('#btnTrainingBack');
      if (!backBtn) return;
      const session = document.getElementById('trainingSession');
      const modesPanel = document.getElementById('modesPanel');
      const home = document.getElementById('trainingHome');
      if (!session.classList.contains('hidden') || !modesPanel.classList.contains('hidden')) {
        session.classList.add('hidden');
        modesPanel.classList.add('hidden');
        home.classList.remove('hidden');
        renderTrainingHome();
      } else {
        showPage('home');
      }
    });
  }

  // ================================================================
  // MINI-GAMES
  // ================================================================

  function setupMiniGamesEvents() {
    document.getElementById('btnMiniGames').addEventListener('click', () => {
      showMiniGames();
    });
    // Back button is now inside renderHub(), use delegation
    document.getElementById('pageMiniGames').addEventListener('click', (e) => {
      const backBtn = e.target.closest('#btnMiniGamesBack');
      if (!backBtn) return;
      if (!document.getElementById('miniGamesActive').classList.contains('hidden')) {
        MiniGames.backToHub();
      } else {
        showPage('home');
      }
    });
  }

  function showMiniGames() {
    showPage('miniGames');
    MiniGames.renderHub();
  }

  // ================================================================
  // GUIDE
  // ================================================================

  function revealGuideElements() {
    const guideReveals = document.querySelectorAll('#pageGuide .reveal');
    if (!guideReveals.length) return;
    guideReveals.forEach(el => el.classList.remove('visible'));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    guideReveals.forEach(el => obs.observe(el));
  }

  function setupGuideEvents() {
    const btnGuide = document.getElementById('btnGuide');
    if (btnGuide) {
      btnGuide.addEventListener('click', () => {
        showPage('guide');
        revealGuideElements();
      });
    }
    const btnGuideBack = document.getElementById('btnGuideBack');
    if (btnGuideBack) {
      btnGuideBack.addEventListener('click', () => {
        showPage('home');
      });
    }
    const btnGuideToTraining = document.getElementById('btnGuideToTraining');
    if (btnGuideToTraining) {
      btnGuideToTraining.addEventListener('click', () => {
        showTraining();
      });
    }
    const btnGuideToEncyclopedia = document.getElementById('btnGuideToEncyclopedia');
    if (btnGuideToEncyclopedia) {
      btnGuideToEncyclopedia.addEventListener('click', () => {
        showEncyclopedia();
      });
    }
  }

  // --- TTS helper for training modes ---
  function speakArabic(text) {
    let clean = text.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
    const lastArabicIdx = clean.search(/[\u0621-\u064A][^\u0621-\u064A]*$/);
    if (lastArabicIdx !== -1) {
      clean = clean.slice(0, lastArabicIdx + 1) + '\u0652' + clean.slice(lastArabicIdx + 1);
    }
    const encoded = encodeURIComponent(clean);
    const audio = new Audio('/api/tts?q=' + encoded);
    audio.play().catch(() => {
      if ('speechSynthesis' in window) {
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = 'ar-SA';
        utt.rate = 0.8;
        window.speechSynthesis.speak(utt);
      }
    });
  }

  function showTraining() {
    showPage('training');
    trainingMode = null;
    document.getElementById('trainingSession').classList.add('hidden');
    document.getElementById('modesPanel').classList.add('hidden');
    document.getElementById('trainingHome').classList.remove('hidden');
    trainingCategory = 'all';
    renderTrainingHome();
  }

  function renderTrainingHome() {
    const prog = Training.getProgress();
    // Update topbar badge
    const badgeCount = document.getElementById('trTopbarBadgeCount');
    if (badgeCount) badgeCount.textContent = prog.mastered + ' / ' + prog.total;
    const R = 30;
    const C = 2 * Math.PI * R;
    const off = C - (prog.percentage / 100) * C;

    let sub = 'Commence ton parcours !';
    if (prog.percentage >= 100) sub = 'Tu les connais tous, ma sha Allah !';
    else if (prog.percentage >= 75) sub = 'Encore un peu, tu y es presque !';
    else if (prog.percentage >= 50) sub = 'Belle progression, continue !';
    else if (prog.percentage >= 25) sub = 'Bon début, ne lâche rien !';
    else if (prog.mastered > 0) sub = 'Les premiers pas sont faits !';

    // Compute useful stats
    const lastScore = parseInt(localStorage.getItem('al-asmaa-last-score') || '0');
    const lastMode = localStorage.getItem('al-asmaa-last-mode') || '';
    const lastModeLabel = { flashcards: 'Flashcards', quiz: 'Quiz', matching: 'Association', writing: 'Écriture', listen: 'Écoute' }[lastMode] || '';

    // Streak: consecutive days with activity
    const streakData = JSON.parse(localStorage.getItem('al-asmaa-streak') || '{"count":0,"lastDate":""}');
    const todayStr = new Date().toISOString().split('T')[0];
    const streak = streakData.count || 0;

    // SRS due count
    const progressData = JSON.parse(localStorage.getItem('al-asmaa-training-progress') || '{}');
    const now = Date.now();
    let dueCount = 0;
    Object.values(progressData).forEach(entry => {
      if (entry && entry.score > 0 && entry.score < 4 && (entry.lastSeen + entry.interval) < now) dueCount++;
    });

    // --- Progress card ---
    document.getElementById('trainingProgressCard').innerHTML = `
      <div class="tr-progress">
        <div class="tr-progress-top">
          <div class="tr-ring">
            <svg viewBox="0 0 70 70">
              <circle class="tr-ring-bg" cx="35" cy="35" r="${R}"/>
              <circle class="tr-ring-fill" cx="35" cy="35" r="${R}"
                      stroke-dasharray="${C}" stroke-dashoffset="${C}" data-target="${off}"/>
            </svg>
            <div class="tr-ring-label">${prog.percentage}<small>%</small></div>
          </div>
          <div class="tr-progress-info">
            <div class="tr-progress-title">${prog.mastered} / ${prog.total} maîtrisés</div>
            <div class="tr-progress-sub">${sub}</div>
          </div>
        </div>
        <div class="tr-stats">
          <div class="tr-stat">
            <span class="tr-stat-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </span>
            <span class="tr-stat-num emerald">${prog.mastered}</span>
            <span class="tr-stat-lbl">Maîtrisés</span>
          </div>
          <div class="tr-stat">
            <span class="tr-stat-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            </span>
            <span class="tr-stat-num amber">${prog.inProgress}</span>
            <span class="tr-stat-lbl">En cours</span>
          </div>
          <div class="tr-stat">
            <span class="tr-stat-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <span class="tr-stat-num ${dueCount > 0 ? 'ruby' : 'emerald'}">${dueCount}</span>
            <span class="tr-stat-lbl">À revoir</span>
          </div>
        </div>
        ${(lastScore > 0 || streak > 0) ? `<div class="tr-progress-secondary">
          ${lastScore > 0 ? `<span class="tr-secondary-item">Dernier score : <strong>${lastScore}</strong>${lastModeLabel ? ' (' + lastModeLabel + ')' : ''}</span>` : ''}
          ${streak > 0 ? `<span class="tr-secondary-item">Série : <strong>${streak}</strong> jour${streak > 1 ? 's' : ''}</span>` : ''}
        </div>` : ''}
        ${lastMode ? `<button class="tr-continue-btn" id="btnContinueMode">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Continuer — ${lastModeLabel}
        </button>` : ''}
        ${prog.mastered > 0 ? '<button class="tr-reset-btn" id="btnResetProgress">Réinitialiser</button>' : ''}
      </div>
    `;

    // Animate ring
    requestAnimationFrame(() => {
      const ring = document.querySelector('.tr-ring-fill');
      if (ring) setTimeout(() => { ring.style.strokeDashoffset = ring.dataset.target; }, 80);
    });

    const continueBtn = document.getElementById('btnContinueMode');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        startTrainingSession(lastMode);
      });
    }

    const resetBtn = document.getElementById('btnResetProgress');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        // Custom confirm dialog
        const existing = document.getElementById('trResetDialog');
        if (existing) existing.remove();
        const dialog = document.createElement('div');
        dialog.id = 'trResetDialog';
        dialog.className = 'tr-dialog-overlay';
        dialog.innerHTML = `
          <div class="tr-dialog">
            <div class="tr-dialog-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--ruby)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h3 class="tr-dialog-title">Réinitialiser la progression ?</h3>
            <p class="tr-dialog-text">Tous tes noms maîtrisés, scores et séries seront effacés. Cette action est irréversible.</p>
            <div class="tr-dialog-actions">
              <button class="tr-dialog-btn tr-dialog-cancel" id="trResetCancel">Annuler</button>
              <button class="tr-dialog-btn tr-dialog-confirm" id="trResetConfirm">Réinitialiser</button>
            </div>
          </div>
        `;
        document.body.appendChild(dialog);
        requestAnimationFrame(() => dialog.classList.add('show'));

        document.getElementById('trResetCancel').addEventListener('click', () => {
          dialog.classList.remove('show');
          setTimeout(() => dialog.remove(), 300);
        });
        dialog.addEventListener('click', (e) => {
          if (e.target === dialog) {
            dialog.classList.remove('show');
            setTimeout(() => dialog.remove(), 300);
          }
        });
        document.getElementById('trResetConfirm').addEventListener('click', () => {
          Training.resetProgress();
          dialog.classList.remove('show');
          setTimeout(() => { dialog.remove(); renderTrainingHome(); }, 300);
        });
      });
    }

    // --- Mode cards ---
    const modesContainer = document.getElementById('trainingModes');
    const modeIcons = {
      flashcards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="16" height="16" rx="2"/><rect x="6" y="2" width="16" height="16" rx="2" fill="var(--bg-card)" stroke="currentColor"/><path d="M12 8v6M9 11h6"/></svg>',
      quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>',
      matching: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="6" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M7.5 6h9M7.5 18h9" stroke-dasharray="2 2" opacity="0.5"/><path d="M7.5 7l9 9.5"/><path d="M7.5 17l9-9.5"/></svg>',
      writing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
      listen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>',
    };

    const modeColors = {
      flashcards: 'var(--gold)',
      quiz: 'var(--sapphire)',
      matching: 'var(--emerald)',
      writing: 'var(--amber-warm)',
      listen: '#a78bfa',
    };

    // Count names available for each mode
    const sessionCount = Training.getSessionNames('flashcards', 'all').length;

    const modes = [
      { id: 'flashcards', title: 'Flashcards', desc: 'Cartes recto-verso', count: sessionCount },
      { id: 'quiz', title: 'Quiz', desc: 'Choix multiples', count: sessionCount },
      { id: 'matching', title: 'Association', desc: 'Relier noms et sens', count: sessionCount },
      { id: 'writing', title: 'Écriture', desc: 'Taper la translittération', count: sessionCount },
      { id: 'listen', title: 'Écoute', desc: 'Prononciation arabe', count: ASMA_UL_HUSNA.length },
    ];

    modesContainer.innerHTML = `
      <div class="tr-heading">Choisir un mode</div>
      <div class="tr-modes">
        ${modes.map((m, i) => `
          <button class="tr-mode" data-mode="${m.id}" style="--mode-color:${modeColors[m.id]};--mode-delay:${i * 0.06}s">
            <div class="tr-mode-gradient"></div>
            <div class="tr-mode-ico">${modeIcons[m.id]}</div>
            <div class="tr-mode-txt">
              <div class="tr-mode-name">${m.title}</div>
              <div class="tr-mode-sub">${m.desc}</div>
            </div>
            <div class="tr-mode-badge">${m.count} noms</div>
            <svg class="tr-mode-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        `).join('')}
      </div>
    `;

    modesContainer.querySelectorAll('.tr-mode').forEach(card => {
      card.addEventListener('click', () => {
        startTrainingSession(card.dataset.mode);
      });
    });
  }

  // New modes handled by Modes module
  const MODES_JS_MODES = ['listen'];

  function startTrainingSession(mode) {
    // Delegate to Modes module for new modes
    if (MODES_JS_MODES.includes(mode)) {
      document.getElementById('trainingHome').classList.add('hidden');
      document.getElementById('trainingSession').classList.add('hidden');
      const modesPanel = document.getElementById('modesPanel');
      modesPanel.classList.remove('hidden');

      // Init Modes if not done
      if (typeof Modes !== 'undefined') {
        const encycData = typeof ENCYCLOPEDIA_DATA !== 'undefined' ? ENCYCLOPEDIA_DATA : {};
        Modes.init(ASMA_UL_HUSNA, encycData);
        Modes.switchMode(mode);
      }
      return;
    }

    trainingMode = mode;
    trainingSession = Training.getSessionNames(mode, trainingCategory);
    trainingIndex = 0;
    trainingScore = 0;
    trainingStreak = 0;
    if (quizTimerInterval) { clearInterval(quizTimerInterval); quizTimerInterval = null; }

    // Save last used mode for "Continue" button
    localStorage.setItem('al-asmaa-last-mode', mode);

    // Update streak
    const todayStr = new Date().toISOString().split('T')[0];
    const streakData = JSON.parse(localStorage.getItem('al-asmaa-streak') || '{"count":0,"lastDate":""}');
    if (streakData.lastDate !== todayStr) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      streakData.count = streakData.lastDate === yesterday ? streakData.count + 1 : 1;
      streakData.lastDate = todayStr;
      localStorage.setItem('al-asmaa-streak', JSON.stringify(streakData));
    }

    if (trainingSession.length === 0) {
      Bomb.showToast('Aucun nom disponible pour cette catégorie', 'warning');
      return;
    }

    document.getElementById('trainingHome').classList.add('hidden');
    document.getElementById('modesPanel').classList.add('hidden');
    document.getElementById('trainingSession').classList.remove('hidden');

    renderTrainingSessionHeader();

    switch (mode) {
      case 'flashcards': renderFlashcard(); break;
      case 'quiz': renderQuiz(); break;
      case 'matching': renderMatching(); break;
      case 'writing': renderWriting(); break;
    }
  }

  function renderTrainingSessionHeader() {
    const header = document.getElementById('trainingSessionHeader');
    const labels = { flashcards: 'Flashcards', quiz: 'Quiz', matching: 'Association', writing: 'Écriture' };
    const pct = trainingSession.length > 0 ? Math.round(((trainingIndex + 1) / trainingSession.length) * 100) : 0;
    header.innerHTML = `
      <div class="tr-sh">
        <button class="btn-back tr-sh-back" id="btnTrainingBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div class="tr-sh-mode">${labels[trainingMode] || ''}</div>
        <div class="tr-sh-right">
          <div class="tr-sh-bar"><div class="tr-sh-fill" style="width:${pct}%"></div></div>
          <div class="tr-sh-count">${trainingIndex + 1}/${trainingSession.length}</div>
        </div>
      </div>
    `;
  }

  function advanceTraining() {
    trainingIndex++;
    if (trainingIndex >= trainingSession.length) {
      renderTrainingComplete();
      return;
    }
    renderTrainingSessionHeader();
    switch (trainingMode) {
      case 'flashcards': renderFlashcard(); break;
      case 'quiz': renderQuiz(); break;
      case 'matching': renderMatching(); break;
      case 'writing': renderWriting(); break;
    }
  }

  function renderTrainingComplete() {
    const body = document.getElementById('trainingSessionBody');
    const total = trainingSession.length;
    const score = Math.round(trainingScore);
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;

    // Save last score
    localStorage.setItem('al-asmaa-last-score', pct.toString());
    const completeIcons = {
      perfect: '<svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
      great: '<svg viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      good: '<svg viewBox="0 0 24 24" fill="none" stroke="var(--sapphire)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 00-6 0v0"/><path d="M18 8h-8a4 4 0 00-4 4v8h16v-8a4 4 0 00-4-4z"/></svg>',
      retry: '<svg viewBox="0 0 24 24" fill="none" stroke="var(--amber-warm)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>'
    };
    let icon = completeIcons.retry, msg = 'Révise et réessaie !';
    if (pct === 100) { icon = completeIcons.perfect; msg = 'Parfait, ma sha Allah !'; }
    else if (pct >= 80) { icon = completeIcons.great; msg = 'Excellent travail !'; }
    else if (pct >= 50) { icon = completeIcons.good; msg = 'Bon effort, continue !'; }

    body.innerHTML = `
      <div class="mode-complete">
        <div class="complete-icon">${icon}</div>
        <h2>${msg}</h2>
        <div class="quiz-result-stats">
          <div class="stat"><span class="stat-val">${score}</span><span class="stat-label">Score</span></div>
          <div class="stat"><span class="stat-val">${total}</span><span class="stat-label">Questions</span></div>
          <div class="stat"><span class="stat-val">${pct}%</span><span class="stat-label">Réussite</span></div>
        </div>
        <div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;margin-top:1rem;">
          <button class="btn-mode" id="btnTrainAgain">Rejouer</button>
          <button class="btn-mode btn-secondary" id="btnTrainHome">Retour</button>
        </div>
      </div>
    `;
    document.getElementById('btnTrainAgain').addEventListener('click', () => {
      startTrainingSession(trainingMode);
    });
    document.getElementById('btnTrainHome').addEventListener('click', () => {
      document.getElementById('trainingSession').classList.add('hidden');
      document.getElementById('trainingHome').classList.remove('hidden');
      renderTrainingHome();
    });
  }

  // --- Flashcards (Premium 3D Flip) ---
  function renderFlashcard() {
    const name = trainingSession[trainingIndex];
    const body = document.getElementById('trainingSessionBody');
    const cat = CATEGORIES[name.category] || {};
    body.innerHTML = `
      <div class="fc-progress">${trainingIndex + 1} / ${trainingSession.length}</div>
      <div class="fc-card-wrapper fc-slide-in">
      <div class="fc-card" id="flashcard" role="button" tabindex="0" aria-label="Cliquer pour retourner la carte">
        <div class="fc-front">
          <div class="fc-arabic" lang="ar" dir="rtl">${name.arabic}</div>
          <button class="fc-speak-btn" id="fcSpeakBtn" aria-label="Écouter">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
          </button>
          <div class="fc-hint">Touche pour retourner</div>
        </div>
        <div class="fc-back">
          <div class="fc-back-header">
            <div class="fc-translit">${name.transliteration}</div>
            <div class="fc-meaning">${name.french}</div>
          </div>
          <div class="fc-back-details">
            ${name.english ? '<div class="fc-english">' + name.english + '</div>' : ''}
            ${cat.fr ? '<div class="fc-category">' + cat.fr + '</div>' : ''}
            ${name.quranVerse ? '<div class="fc-verse">' + name.quranVerse + '</div>' : ''}
            ${name.description ? '<div class="fc-detail">' + (name.description || '').substring(0, 180) + (name.description.length > 180 ? '...' : '') + '</div>' : ''}
          </div>
          <div class="fc-rating" id="flashcardActions">
            <button class="fc-rate-btn fc-hard" data-quality="0">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 105.64-8.36L1 10"/></svg>
              À revoir
            </button>
            <button class="fc-rate-btn fc-ok" data-quality="1">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12c0-3 2.5-6 5-7.5s5.5-1 7.5 1"/><path d="M22 12c0 3-2.5 6-5 7.5s-5.5 1-7.5-1"/></svg>
              Presque
            </button>
            <button class="fc-rate-btn fc-easy" data-quality="2">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Acquis
            </button>
          </div>
        </div>
      </div>
      </div>
    `;

    const card = document.getElementById('flashcard');
    const actions = document.getElementById('flashcardActions');
    const speakBtn = document.getElementById('fcSpeakBtn');

    speakBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      speakArabic(name.arabic);
      speakBtn.classList.add('fc-speak-pulse');
      setTimeout(() => speakBtn.classList.remove('fc-speak-pulse'), 600);
    });

    card.addEventListener('click', (e) => {
      if (e.target.closest('.fc-rate-btn') || e.target.closest('.fc-speak-btn')) return;
      card.classList.toggle('flipped');
    });

    actions.querySelectorAll('.fc-rate-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const quality = parseInt(btn.dataset.quality);
        btn.classList.add('selected');
        Training.recordAnswer(name.id, quality);
        if (quality >= 1) trainingScore++;
        body.querySelector('.fc-card-wrapper').classList.add('fc-slide-out');
        setTimeout(() => advanceTraining(), 400);
      });
    });
  }

  // --- Quiz (Premium Animated) ---
  function renderQuiz() {
    if (quizTimerInterval) { clearInterval(quizTimerInterval); quizTimerInterval = null; }

    const name = trainingSession[trainingIndex];
    const body = document.getElementById('trainingSessionBody');

    const others = ASMA_UL_HUSNA.filter(n => n.id !== name.id);
    const wrongChoices = shuffleArray(others).slice(0, 3);
    const choices = shuffleArray([name, ...wrongChoices]);
    const pct = trainingSession.length > 0 ? Math.round((trainingIndex / trainingSession.length) * 100) : 0;

    const QUIZ_TIME = 15; // seconds per question
    let timeLeft = QUIZ_TIME;

    const letters = ['A', 'B', 'C', 'D'];
    const catColors = CATEGORY_COLORS[name.category] || CATEGORY_COLORS.sovereignty;
    body.innerHTML = `
      <div class="quiz-stage">
        <div class="quiz-header">
          <div class="quiz-progress">Question ${trainingIndex + 1}<span class="quiz-progress-total">/${trainingSession.length}</span></div>
          <div class="quiz-meta">
            ${trainingStreak > 0 ? '<div class="quiz-streak"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg><span>' + trainingStreak + '</span></div>' : ''}
            <div class="quiz-score"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${trainingScore}</div>
          </div>
        </div>
        <div class="quiz-timer-wrap">
          <div class="quiz-timer-track"><div class="quiz-timer-bar" id="quizTimerBar"></div></div>
          <span class="quiz-timer-text" id="quizTimerText">${QUIZ_TIME}s</span>
        </div>
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width: ${pct}%"></div></div>
        <div class="quiz-question-card" style="--q-accent: ${catColors.accent}; --q-glow: ${catColors.glow};">
          <div class="quiz-question-number">#${name.id}</div>
          <span class="quiz-arabic" lang="ar" dir="rtl">${name.arabic}</span>
          <span class="quiz-transliteration">${name.transliteration}</span>
          <div class="quiz-prompt">Quelle est la signification ?</div>
        </div>
        <div class="quiz-choices" id="quizOptions">
          ${choices.map((c, i) => `
            <button class="quiz-choice" data-id="${c.id}" style="--choice-delay: ${i * 0.06}s;">
              <span class="choice-letter">${letters[i]}</span>
              <span class="choice-text">${c.french}</span>
              <span class="choice-check"></span>
            </button>
          `).join('')}
        </div>
        <div class="quiz-feedback hidden" id="quizFeedback"></div>
      </div>
    `;

    // Timer
    const timerBar = document.getElementById('quizTimerBar');
    const timerText = document.getElementById('quizTimerText');
    let answered = false;

    quizTimerInterval = setInterval(() => {
      if (answered) return;
      timeLeft--;
      if (timerText) timerText.textContent = timeLeft + 's';
      if (timerBar) timerBar.style.width = ((timeLeft / QUIZ_TIME) * 100) + '%';
      if (timeLeft <= 5 && timerBar) timerBar.classList.add('quiz-timer-urgent');
      if (timeLeft <= 0) {
        clearInterval(quizTimerInterval);
        answered = true;
        // Auto-fail on timeout
        document.querySelectorAll('#quizOptions .quiz-choice').forEach(o => {
          o.disabled = true;
          o.style.pointerEvents = 'none';
          if (parseInt(o.dataset.id) === name.id) o.classList.add('correct');
        });
        const feedback = document.getElementById('quizFeedback');
        if (feedback) {
          feedback.classList.remove('hidden');
          feedback.className = 'quiz-feedback quiz-feedback-wrong';
          feedback.innerHTML = '<svg class="fb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><div class="fb-body"><span class="fb-title">Temps écoulé !</span><span class="fb-detail">Réponse : ' + name.transliteration + ' (' + name.french + ')</span></div>';
        }
        trainingStreak = 0;
        Training.recordAnswer(name.id, 0);
        setTimeout(() => advanceTraining(), 2000);
      }
    }, 1000);

    document.querySelectorAll('#quizOptions .quiz-choice').forEach(opt => {
      opt.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        clearInterval(quizTimerInterval);

        const chosen = parseInt(opt.dataset.id);
        const correct = chosen === name.id;

        if (correct) {
          trainingStreak++;
          trainingScore++;
        } else {
          trainingStreak = 0;
        }

        document.querySelectorAll('#quizOptions .quiz-choice').forEach(o => {
          o.disabled = true;
          o.style.pointerEvents = 'none';
          if (parseInt(o.dataset.id) === name.id) {
            o.classList.add('correct');
          } else if (o === opt && !correct) {
            o.classList.add('wrong');
          }
        });

        const feedback = document.getElementById('quizFeedback');
        if (feedback) {
          feedback.classList.remove('hidden');
          feedback.className = 'quiz-feedback ' + (correct ? 'quiz-feedback-correct' : 'quiz-feedback-wrong');
          feedback.innerHTML = correct
            ? '<svg class="fb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><div class="fb-body"><span class="fb-title">Correct !</span><span class="fb-detail">' + name.transliteration + ' = ' + name.french + '</span></div>' + (trainingStreak > 1 ? '<span class="quiz-streak-badge">' + trainingStreak + ' de suite !</span>' : '')
            : '<svg class="fb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg><div class="fb-body"><span class="fb-title">Incorrect</span><span class="fb-detail">Réponse : ' + name.transliteration + ' (' + name.french + ')</span></div>';
        }

        Training.recordAnswer(name.id, correct ? 2 : 0);

        setTimeout(() => advanceTraining(), correct ? 1200 : 2000);
      });
    });
  }

  // --- Matching (Drag-to-Connect) ---
  function renderMatching() {
    const body = document.getElementById('trainingSessionBody');
    const batchSize = 5;
    const batchStart = trainingIndex;
    const batch = trainingSession.slice(batchStart, batchStart + batchSize);

    if (batch.length === 0) {
      renderTrainingComplete();
      return;
    }

    const shuffledMeanings = shuffleArray(batch);

    matchingState = {
      pairs: batch,
      selectedName: null,
      matched: new Set(),
      lines: {}
    };

    const matchStartTime = Date.now();

    body.innerHTML = `
      <div class="match-game" id="matchGame">
        <div class="match-header-bar">
          <div class="match-instruction">Relie chaque nom à sa <span>signification</span></div>
          <div class="match-timer" id="matchTimer">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span id="matchTimerText">0:00</span>
          </div>
        </div>
        <svg class="match-svg" id="matchSvg"></svg>
        <div class="match-columns">
          <div class="match-col" id="matchNames">
            ${batch.map((n, i) => `
              <div class="match-item match-name" data-id="${n.id}" style="animation: fadeInUp 0.3s ease ${i * 0.06}s both;">
                <div class="match-name-content">
                  <span class="match-arabic">${n.arabic}</span>
                  <span class="match-translit">${n.transliteration}</span>
                </div>
                <div class="match-dot" data-dot="name-${n.id}"></div>
              </div>
            `).join('')}
          </div>
          <div class="match-col" id="matchMeanings">
            ${shuffledMeanings.map((n, i) => `
              <div class="match-item match-meaning" data-id="${n.id}" style="animation: fadeInUp 0.3s ease ${0.2 + i * 0.06}s both;">
                <div class="match-dot" data-dot="meaning-${n.id}"></div>
                <span class="match-meaning-text">${n.french}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="match-score">${matchingState.matched.size} / ${batch.length} <span>associations</span></div>
      </div>
    `;

    // Session timer
    const matchTimerText = document.getElementById('matchTimerText');
    const matchTimerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - matchStartTime) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      if (matchTimerText) matchTimerText.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
      if (matchingState.matched.size === batch.length) clearInterval(matchTimerInterval);
    }, 1000);

    const game = document.getElementById('matchGame');
    const svg = document.getElementById('matchSvg');
    let drawingLine = null;
    let drawingFromId = null;
    let isDragging = false;

    function getDotCenter(dotEl) {
      const gameRect = game.getBoundingClientRect();
      const dotRect = dotEl.getBoundingClientRect();
      return {
        x: dotRect.left + dotRect.width / 2 - gameRect.left,
        y: dotRect.top + dotRect.height / 2 - gameRect.top
      };
    }

    function createSvgLine(x1, y1, x2, y2, cls) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.classList.add('match-line', cls);
      svg.appendChild(line);
      return line;
    }

    function spawnParticles(x, y) {
      const colors = ['#2dd4a0', '#d4a24c', '#5eead4', '#ffd866', '#60a5fa'];
      for (let i = 0; i < 10; i++) {
        const p = document.createElement('div');
        p.className = 'match-particle';
        const angle = (Math.PI * 2 / 10) * i + Math.random() * 0.5;
        const dist = 20 + Math.random() * 35;
        p.style.cssText = 'left:' + x + 'px;top:' + y + 'px;background:' + colors[i % colors.length] + ';--tx:' + Math.cos(angle) * dist + 'px;--ty:' + Math.sin(angle) * dist + 'px;--duration:' + (0.4 + Math.random() * 0.3) + 's;';
        game.appendChild(p);
        setTimeout(() => p.remove(), 800);
      }
    }

    function checkComplete() {
      if (matchingState.matched.size === batch.length) {
        clearInterval(matchTimerInterval);
        const elapsed = Math.floor((Date.now() - matchStartTime) / 1000);
        const scoreEl = game.querySelector('.match-score');
        if (scoreEl) scoreEl.innerHTML = '<span class="match-complete-msg">Bravo ! Terminé en ' + elapsed + 's</span>';
        game.classList.add('match-all-done');
        trainingIndex = batchStart + batchSize - 1;
        setTimeout(() => advanceTraining(), 1200);
      }
    }

    function updateScore() {
      const scoreEl = game.querySelector('.match-score');
      if (scoreEl) scoreEl.innerHTML = matchingState.matched.size + ' / ' + batch.length + ' <span>associations</span>';
    }

    function handleMatchSuccess(nameId, nameEl, meaningEl) {
      const nameDot = nameEl.querySelector('.match-dot');
      const meaningDot = meaningEl.querySelector('.match-dot');
      const nc = getDotCenter(nameDot);
      const mc = getDotCenter(meaningDot);

      // Remove drawing line if any, create matched line
      if (drawingLine) { drawingLine.remove(); drawingLine = null; }
      const line = createSvgLine(nc.x, nc.y, mc.x, mc.y, 'matched');

      matchingState.matched.add(nameId);
      matchingState.lines[nameId] = line;
      nameEl.classList.add('matched');
      meaningEl.classList.add('matched');

      spawnParticles((nc.x + mc.x) / 2, (nc.y + mc.y) / 2);
      Training.recordAnswer(nameId, 2);
      trainingScore++;
      updateScore();
      checkComplete();
    }

    function handleMatchError(nameId, meaningEl) {
      if (drawingLine) {
        drawingLine.classList.remove('drawing');
        drawingLine.classList.add('error');
        const errLine = drawingLine;
        setTimeout(() => errLine.remove(), 500);
        drawingLine = null;
      }
      meaningEl.classList.add('error');
      Training.recordAnswer(nameId, 0);
      setTimeout(() => meaningEl.classList.remove('error'), 500);
    }

    function cleanupDrag() {
      if (drawingLine) { drawingLine.remove(); drawingLine = null; }
      drawingFromId = null;
      isDragging = false;
      document.querySelectorAll('.match-item').forEach(b => {
        if (!b.classList.contains('matched')) b.classList.remove('active');
      });
    }

    // --- Pointer events for drag-to-connect ---
    const nameItems = document.querySelectorAll('#matchNames .match-item');
    const meaningItems = document.querySelectorAll('#matchMeanings .match-item');

    nameItems.forEach(nameEl => {
      nameEl.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        const id = parseInt(nameEl.dataset.id);
        if (matchingState.matched.has(id)) return;

        nameEl.setPointerCapture(e.pointerId);
        isDragging = false;
        drawingFromId = id;

        document.querySelectorAll('#matchNames .match-item').forEach(b => {
          if (!b.classList.contains('matched')) b.classList.remove('active');
        });
        nameEl.classList.add('active');

        const dot = nameEl.querySelector('.match-dot');
        const c = getDotCenter(dot);
        drawingLine = createSvgLine(c.x, c.y, c.x, c.y, 'drawing');
      });

      nameEl.addEventListener('pointermove', (e) => {
        if (drawingFromId === null || !drawingLine) return;
        isDragging = true;
        const gameRect = game.getBoundingClientRect();
        drawingLine.setAttribute('x2', e.clientX - gameRect.left);
        drawingLine.setAttribute('y2', e.clientY - gameRect.top);

        // Highlight target meaning on hover
        meaningItems.forEach(el => {
          const r = el.getBoundingClientRect();
          const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
          el.classList.toggle('active', inside && !matchingState.matched.has(parseInt(el.dataset.id)));
        });
      });

      nameEl.addEventListener('pointerup', (e) => {
        if (drawingFromId === null) return;

        if (isDragging) {
          // Find meaning element under pointer
          let targetMeaning = null;
          meaningItems.forEach(el => {
            const r = el.getBoundingClientRect();
            if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
              targetMeaning = el;
            }
          });

          if (targetMeaning) {
            const meaningId = parseInt(targetMeaning.dataset.id);
            if (!matchingState.matched.has(meaningId)) {
              if (drawingFromId === meaningId) {
                handleMatchSuccess(meaningId, nameEl, targetMeaning);
              } else {
                handleMatchError(drawingFromId, targetMeaning);
              }
            } else {
              cleanupDrag();
            }
          } else {
            cleanupDrag();
          }
        } else {
          // Was a click, not a drag — set selected for click-based fallback
          if (drawingLine) { drawingLine.remove(); drawingLine = null; }
          matchingState.selectedName = drawingFromId;
        }

        drawingFromId = null;
        isDragging = false;
        meaningItems.forEach(b => {
          if (!b.classList.contains('matched')) b.classList.remove('active');
        });
      });

      nameEl.addEventListener('pointercancel', cleanupDrag);
    });

    // Click-based fallback on meaning items
    meaningItems.forEach(mEl => {
      mEl.addEventListener('click', () => {
        if (matchingState.selectedName === null) return;
        const meaningId = parseInt(mEl.dataset.id);
        if (matchingState.matched.has(meaningId)) return;

        const nameEl = document.querySelector('#matchNames .match-item[data-id="' + matchingState.selectedName + '"]');
        if (!nameEl) return;

        if (matchingState.selectedName === meaningId) {
          handleMatchSuccess(meaningId, nameEl, mEl);
        } else {
          handleMatchError(matchingState.selectedName, mEl);
        }

        matchingState.selectedName = null;
        document.querySelectorAll('#matchNames .match-item').forEach(b => {
          if (!b.classList.contains('matched')) b.classList.remove('active');
        });
      });
    });

    trainingIndex = batchStart + batchSize - 1;
    renderTrainingSessionHeader();
  }

  // --- Writing (Enhanced) ---
  function renderWriting() {
    const name = trainingSession[trainingIndex];
    const body = document.getElementById('trainingSessionBody');
    let hintUsed = false;

    // Transliteration keyboard keys
    const translitKeys = [
      ['a', 'b', 'd', 'f', 'g', 'h', 'i'],
      ['j', 'k', 'l', 'm', 'n', 'q', 'r'],
      ['s', 't', 'u', 'w', 'y', 'z', "'"],
      ['-', 'Dh', 'Gh', 'Kh', 'Sh', 'Th']
    ];

    body.innerHTML = `
      <div class="writing-game" style="animation: modeSlideIn 0.4s ease;">
        <div class="writing-card">
          <div class="writing-prompt-header">
            <div class="writing-prompt-arabic" lang="ar" dir="rtl">${name.arabic}</div>
          </div>
          <div class="writing-prompt-meaning">${name.french}</div>
          <div class="writing-input-wrap">
            <input type="text" class="writing-input" id="writingInput"
                   placeholder="Tape la translittération..." autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="40">
            <button class="writing-check-btn" id="btnWritingCheck">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          </div>
          <div class="writing-keyboard" id="writingKeyboard">
            ${translitKeys.map(row => '<div class="wk-row">' + row.map(k => '<button class="wk-key" data-key="' + k + '">' + k + '</button>').join('') + '</div>').join('')}
          </div>
          <div class="writing-actions">
            <button class="writing-hint-btn" id="btnWritingHint">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              Indice
            </button>
          </div>
          <div class="writing-feedback" id="writingFeedback"></div>
        </div>
      </div>
    `;

    const input = document.getElementById('writingInput');
    const checkBtn = document.getElementById('btnWritingCheck');
    const feedback = document.getElementById('writingFeedback');
    const hintBtn = document.getElementById('btnWritingHint');

    // Virtual keyboard
    document.getElementById('writingKeyboard').addEventListener('click', (e) => {
      const key = e.target.closest('.wk-key');
      if (!key || input.disabled) return;
      input.value += key.dataset.key;
      input.focus();
    });

    hintBtn.addEventListener('click', () => {
      if (hintUsed) return;
      hintUsed = true;
      const translit = name.transliteration;
      const hint = translit.substring(0, Math.ceil(translit.length / 3)) + '...';
      hintBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg> ' + hint;
      hintBtn.style.borderColor = 'var(--sapphire)';
      hintBtn.style.color = 'var(--sapphire)';
    });

    function spawnWritingConfetti() {
      const card = body.querySelector('.writing-card');
      if (!card) return;
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'writing-confetti';
        const colors = ['var(--gold)', 'var(--emerald)', '#ffd866', '#60a5fa', '#f472b6'];
        p.style.cssText = 'left:' + (20 + Math.random() * 60) + '%;background:' + colors[i % colors.length] + ';animation-delay:' + (Math.random() * 0.3) + 's;';
        card.appendChild(p);
        setTimeout(() => p.remove(), 1200);
      }
    }

    function checkWritingAnswer() {
      if (!input.value.trim()) return;
      const answer = input.value.trim().toLowerCase().replace(/[-' ]/g, '');
      const expected = name.transliteration.toLowerCase().replace(/[-' ]/g, '');
      const correct = answer === expected;

      if (correct) {
        feedback.innerHTML = '<span class="writing-correct">Correct ! — ' + name.transliteration + '</span>';
        input.classList.add('correct');
        Training.recordAnswer(name.id, hintUsed ? 1 : 2);
        if (!hintUsed) trainingScore++;
        else trainingScore += 0.5;
        spawnWritingConfetti();
      } else {
        feedback.innerHTML = '<span class="writing-wrong">Réponse : ' + name.transliteration + '</span>';
        input.classList.add('wrong');
        input.classList.add('writing-shake');
        Training.recordAnswer(name.id, 0);
      }

      input.disabled = true;
      checkBtn.disabled = true;
      setTimeout(() => advanceTraining(), 1500);
    }

    checkBtn.addEventListener('click', checkWritingAnswer);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkWritingAnswer();
    });

    setTimeout(() => input.focus(), 200);
  }

  // --- Report System ---
  function setupReportSystem() {
    const openBtn = document.getElementById('btnOpenReport');
    const modal = document.getElementById('reportModal');
    const closeBtn = document.getElementById('btnCloseReport');
    const form = document.getElementById('reportForm');
    const desc = document.getElementById('reportDesc');
    const charCount = document.getElementById('reportCharCount');
    const submitBtn = document.getElementById('btnReportSubmit');
    const successView = document.getElementById('reportSuccess');
    const doneBtn = document.getElementById('btnReportDone');

    if (!openBtn || !modal || !form) return;

    function openReportModal() {
      modal.classList.remove('hidden');
      form.style.display = '';
      successView.classList.add('hidden');
      form.reset();
      if (charCount) charCount.textContent = '0';
      const charFill = document.getElementById('reportCharFill');
      if (charFill) charFill.style.width = '0%';
      submitBtn.disabled = true;
      resetSubmitBtn();
    }

    function closeReportModal() {
      modal.classList.add('hidden');
    }

    function resetSubmitBtn() {
      const textEl = submitBtn.querySelector('.report-submit-text');
      const loaderEl = submitBtn.querySelector('.report-submit-loader');
      if (textEl) textEl.classList.remove('hidden');
      if (loaderEl) loaderEl.classList.add('hidden');
      submitBtn.disabled = !desc.value.trim();
    }

    openBtn.addEventListener('click', openReportModal);
    closeBtn.addEventListener('click', closeReportModal);
    if (doneBtn) doneBtn.addEventListener('click', closeReportModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeReportModal();
    });

    const charFillEl = document.getElementById('reportCharFill');
    desc.addEventListener('input', () => {
      const len = desc.value.length;
      if (charCount) charCount.textContent = len;
      if (charFillEl) charFillEl.style.width = Math.min(len / 1000 * 100, 100) + '%';
      submitBtn.disabled = !desc.value.trim();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!desc.value.trim()) return;

      const textEl = submitBtn.querySelector('.report-submit-text');
      const loaderEl = submitBtn.querySelector('.report-submit-loader');
      if (textEl) textEl.classList.add('hidden');
      if (loaderEl) loaderEl.classList.remove('hidden');
      submitBtn.disabled = true;

      const type = form.querySelector('input[name="reportType"]:checked')?.value || 'bug';
      const page = document.getElementById('reportPage')?.value.trim() || '';
      const description = desc.value.trim();

      try {
        const res = await fetch('/api/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, page, description })
        });
        if (res.status === 429) {
          resetSubmitBtn();
          if (typeof Bomb !== 'undefined' && Bomb.showToast) {
            Bomb.showToast('Trop de signalements. R\u00e9essaie dans quelques minutes.', 'warning');
          }
          return;
        }
        if (!res.ok) throw new Error('Erreur serveur');
        form.style.display = 'none';
        successView.classList.remove('hidden');
      } catch {
        resetSubmitBtn();
        if (typeof Bomb !== 'undefined' && Bomb.showToast) {
          Bomb.showToast('Erreur lors de l\u2019envoi. R\u00e9essaie.', 'error');
        }
      }
    });
  }

  // --- Lancement ---
  document.addEventListener('DOMContentLoaded', init);
})();
