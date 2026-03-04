/**
 * Al-Asmaa — Serveur Multijoueur
 * Express + Socket.io pour le jeu en réseau local
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const QRCode = require('qrcode');
const compression = require('compression');
const os = require('os');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const {
  NameEntryGenerator,
  AuditTrail,
  EntryRepository,
  applyHumanReview,
  createInsufficientEvidenceFallback
} = require('./religious-integrity');

// --- Constantes ---
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_DEV = NODE_ENV === 'development';

// --- Logger conditionnel (silencieux en production sauf erreurs) ---
const log = {
  info:  (...args) => { if (IS_DEV) console.log(...args); },
  warn:  (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
  always: (...args) => console.log(...args)
};

// --- Sanitization & Validation (shared module) ---
const {
  sanitizeHtml,
  normalizeForValidation,
  normalizeArabicForValidation,
  normalizeCollapsed,
  serverValidateAnswer: _serverValidateAnswer
} = require('./lib/validation');

// Charger les données des 99 noms (sans vm.runInNewContext pour la sécurité)
let ASMA_UL_HUSNA = [];
try {
  const namesCode = fs.readFileSync(path.join(__dirname, 'public', 'data', 'names.js'), 'utf-8');
  // Le fichier utilise la syntaxe JS (clés non quotées), on utilise Function
  // Sûr ici car c'est un fichier local contrôlé par le développeur
  const fn = new Function(namesCode + '; return ASMA_UL_HUSNA;');
  ASMA_UL_HUSNA = fn();
  log.always(`[Names] ${ASMA_UL_HUSNA.length} noms chargés`);
} catch (err) {
  log.error('[Names] Erreur chargement names.js:', err.message);
}
const MAX_NAME_LENGTH = 20;
const MAX_CHAT_LENGTH = 200;
const MAX_TYPING_LENGTH = 40;
const MAX_PLAYERS = 8;
const ROOM_CODE_LENGTH = 6;
const HOST_DISCONNECT_TIMEOUT = 60000;
const QR_COLORS = { dark: '#d4a843', light: '#050810' };

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: IS_DEV ? '*' : (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
    methods: ['GET', 'POST']
  }
});

const integrityRepository = new EntryRepository({
  baseDir: path.join(__dirname, 'data', 'encyclopedia', 'entries'),
  candidatesDir: path.join(__dirname, 'data', 'encyclopedia', 'candidates')
});
const integrityAuditTrail = new AuditTrail({
  filePath: path.join(__dirname, 'data', 'encyclopedia', 'audit', 'audit-trail.jsonl')
});
const integrityGenerator = new NameEntryGenerator({
  auditTrail: integrityAuditTrail
});
const EDITORIAL_REVIEW_TOKEN = process.env.EDITORIAL_REVIEW_TOKEN || '';

function normalizeSlugParam(input) {
  const slug = String(input || '').toLowerCase().trim();
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }
  return slug;
}

function hasEditorialAccess(req) {
  if (!EDITORIAL_REVIEW_TOKEN) {
    return false;
  }
  const auth = String(req.headers.authorization || '');
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
  return token === EDITORIAL_REVIEW_TOKEN;
}

// Compression gzip/brotli
app.use(compression({ threshold: 1024 }));

// Headers de sécurité + performance
app.use((req, res, next) => {
  // Sécurité
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'SAMEORIGIN');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.set('X-DNS-Prefetch-Control', 'on');
  res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  if (!IS_DEV) {
    res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.set('Content-Security-Policy', [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' wss: ws: https://www.google-analytics.com https://www.googletagmanager.com https://translate.google.com",
      "media-src 'self' https://translate.google.com",
      "frame-ancestors 'self'"
    ].join('; '));
  }
  next();
});

// Servir les fichiers statiques avec cache optimisé
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  lastModified: true,
  maxAge: IS_DEV ? 0 : '1h',
  setHeaders: (res, filePath) => {
    if (IS_DEV) {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return;
    }
    // Cache long pour assets immutables (versionnées via ?v=)
    if (/\.(svg|png|jpg|jpeg|webp|woff2?|ttf|eot)$/i.test(filePath)) {
      res.set('Cache-Control', 'public, max-age=2592000, immutable'); // 30 jours
    } else if (/\.(css|js)$/i.test(filePath)) {
      res.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600'); // 1 jour + SWR
    } else if (/\.(html)$/i.test(filePath)) {
      res.set('Cache-Control', 'public, max-age=600, stale-while-revalidate=86400'); // 10 min + SWR
    }
  }
}));

app.use(express.json({ limit: '500kb' }));

// Stockage des rooms en mémoire
const rooms = {};
const iqRooms = {};

// Cleanup IQ rooms: lobby inactive >15min, other states >2h
setInterval(() => {
  const now = Date.now();
  for (const code of Object.keys(iqRooms)) {
    const room = iqRooms[code];
    const age = now - (room.updatedAt || room.createdAt || 0);
    // Lobby inactif depuis >15min
    if (room.state === 'lobby' && age > 15 * 60 * 1000) {
      delete iqRooms[code];
      log.info(`[IQ Cleanup] Room ${code} supprimée (lobby inactif >15min)`);
    }
    // Autres états inactifs >2h
    else if (age > 2 * 60 * 60 * 1000) {
      delete iqRooms[code];
      log.info(`[IQ Cleanup] Room ${code} supprimée (inactive >2h)`);
    }
  }
}, 5 * 60 * 1000); // Toutes les 5 minutes

// Cleanup classic rooms: lobby >1h sans activité, finished/playing >2h
setInterval(() => {
  const now = Date.now();
  for (const code of Object.keys(rooms)) {
    const room = rooms[code];
    const age = now - (room._lastActivity || room._createdAt || now);
    // Lobby inactif depuis >1h
    if (room.state === 'lobby' && age > 60 * 60 * 1000) {
      io.to(code).emit('room-closed');
      delete rooms[code]; delete qrCache[code];
      log.info(`[Cleanup] Room ${code} supprimée (lobby inactif >1h)`);
    }
    // Partie ended/finished depuis >30min ou playing depuis >3h (zombie)
    else if ((room.state === 'finished' || room.state === 'ended') && age > 30 * 60 * 1000) {
      delete rooms[code]; delete qrCache[code];
      log.info(`[Cleanup] Room ${code} supprimée (${room.state} >30min)`);
    }
    else if (room.state === 'playing' && age > 3 * 60 * 60 * 1000) {
      io.to(code).emit('room-closed');
      delete rooms[code]; delete qrCache[code];
      log.info(`[Cleanup] Room ${code} supprimée (playing zombie >3h)`);
    }
  }
}, 10 * 60 * 1000); // Toutes les 10 minutes

// Générer un code de room unique à 6 caractères
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
  } while (rooms[code]);
  return code;
}

// Obtenir l'adresse IP locale
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const PORT = process.env.PORT || 3000;
const LOCAL_IP = getLocalIP();

// --- TTS Proxy : Google Translate TTS pour la prononciation arabe ---
const https = require('https');
app.get('/api/tts', (req, res) => {
  const text = req.query.q;
  if (!text || text.length > 200) {
    return res.status(400).send('Missing or too long q parameter');
  }
  const encoded = encodeURIComponent(text);
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=ar&client=tw-ob`;

  https.get(ttsUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://translate.google.com/'
    }
  }, (upstream) => {
    if (upstream.statusCode !== 200) {
      return res.status(502).send('TTS upstream error');
    }
    res.set('Content-Type', 'audio/mpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    upstream.pipe(res);
  }).on('error', () => {
    res.status(502).send('TTS fetch failed');
  });
});

// Route pour rejoindre via URL — vérifie que la room existe
app.get('/join/:code', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  const code = (req.params.code || '').toUpperCase().trim();
  const room = rooms[code];
  if (!room || room.state === 'finished' || room.state === 'ended') {
    return res.status(404).sendFile(path.join(__dirname, 'public', 'room-not-found.html'));
  }
  res.sendFile(path.join(__dirname, 'public', 'player.html'));
});

// Route pour le lobby hôte via URL — vérifie que la room existe
app.get('/lobby/:code', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  const code = (req.params.code || '').toUpperCase().trim();
  const room = rooms[code];
  if (!room || room.state === 'finished' || room.state === 'ended') {
    return res.status(404).sendFile(path.join(__dirname, 'public', 'room-not-found.html'));
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route API pour obtenir les infos serveur
app.get('/api/server-info', (req, res) => {
  res.json({ ip: LOCAL_IP, port: PORT });
});

// Route API pour générer un QR code
app.get('/api/qrcode/:code', async (req, res) => {
  try {
    const pathPrefix = req.query.path === 'iq' ? '/iq/' : '/join/';
    const url = `http://${LOCAL_IP}:${PORT}${pathPrefix}${req.params.code}`;
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#d4a843',
        light: '#050810'
      }
    });
    res.json({ qr: qrDataUrl, url });
  } catch (err) {
    res.status(500).json({ error: 'Erreur génération QR code' });
  }
});

// Route API pour vérifier si une room existe
app.get('/api/check-room/:code', (req, res) => {
  const code = (req.params.code || '').toUpperCase().trim();
  const room = rooms[code];
  if (room && room.state !== 'finished' && room.state !== 'ended') {
    return res.json({
      exists: true,
      gameType: 'classic',
      state: room.state,
      playerCount: room.players.length,
      maxPlayers: room.maxPlayers,
      isFull: room.players.length >= room.maxPlayers
    });
  }
  const iqRoom = iqRooms[code];
  if (iqRoom) {
    return res.json({
      exists: true,
      gameType: 'ilm-quest',
      state: iqRoom.state,
      playerCount: iqRoom.playerCount || iqRoom.players.length,
      maxPlayers: iqRoom.maxPlayers || 8,
      isFull: (iqRoom.playerCount || iqRoom.players.length) >= (iqRoom.maxPlayers || 8)
    });
  }
  res.json({ exists: false });
});

// Route API pour lister les rooms publiques
app.get('/api/public-rooms', (req, res) => {
  const allRooms = Object.values(rooms);
  const publicRooms = allRooms
    .filter(r => {
      if (r.visibility !== 'public' || r.state !== 'lobby') return false;
      // Exclure les rooms dont l'hôte est déconnecté (ghost rooms)
      const hostSocket = io.sockets.sockets.get(r.host);
      if (!hostSocket || !hostSocket.connected) return false;
      // Exclure les rooms marquées pour destruction
      if (r._destroyTimer) return false;
      return true;
    })
    .map(r => ({
      code: r.code,
      hostName: r.hostName,
      playerCount: r.players.filter(p => p.connected !== false).length,
      maxPlayers: r.maxPlayers,
      isFull: r.players.length >= r.maxPlayers,
      difficulty: r.config.difficulty,
      gameType: 'classic'
    }));

  // Add public IQ rooms — only if recently active (< 10 min)
  const now = Date.now();
  const iqPublic = Object.values(iqRooms)
    .filter(r => {
      if (r.visibility !== 'public' || r.state !== 'lobby') return false;
      // Exclure les rooms inactives depuis plus de 10 minutes
      if (now - (r.updatedAt || r.createdAt || 0) > 10 * 60 * 1000) return false;
      return true;
    })
    .map(r => ({
      code: r.code,
      hostName: r.hostName,
      playerCount: r.playerCount || r.players.length,
      maxPlayers: r.maxPlayers || 8,
      isFull: (r.playerCount || r.players.length) >= (r.maxPlayers || 8),
      difficulty: r.difficulty,
      targetScore: r.targetScore,
      gameType: 'ilm-quest'
    }));

  res.json({ rooms: [...publicRooms, ...iqPublic] });
});

// DEBUG — voir toutes les rooms (dev seulement)
if (IS_DEV) {
  app.get('/api/debug-rooms', (req, res) => {
    const all = Object.values(rooms).map(r => ({
      code: r.code, visibility: r.visibility, state: r.state,
      host: r.hostName, players: r.players.length
    }));
    const allIq = Object.values(iqRooms).map(r => ({
      code: r.code, visibility: r.visibility, state: r.state,
      host: r.hostName, players: r.playerCount, gameType: 'ilm-quest'
    }));
    res.json({ total: all.length + allIq.length, rooms: all, iqRooms: allIq });
  });
}

// --- IQ Rooms REST API ---
app.post('/api/iq-rooms', (req, res) => {
  const { code, hostName, visibility, difficulty, targetScore, maxPlayers } = req.body;
  if (!code || !hostName) {
    return res.status(400).json({ error: 'code et hostName requis' });
  }
  const roomCode = code.toUpperCase().trim();
  const hostPlayer = req.body.hostPlayer || null;
  iqRooms[roomCode] = {
    code: roomCode,
    hostName,
    visibility: visibility || 'private',
    difficulty: difficulty || 'mixte',
    targetScore: targetScore || 5000,
    maxPlayers: Math.min(Math.max(parseInt(maxPlayers) || 8, 2), 8),
    state: 'lobby',
    playerCount: 1,
    players: hostPlayer ? [hostPlayer] : [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  log.info(`[IQ] Room ${roomCode} créée par ${hostName} (${visibility})`);
  res.json({ success: true, code: roomCode });
});

// Join an IQ room (adds player to server-side list)
app.post('/api/iq-rooms/:code/join', (req, res) => {
  const code = (req.params.code || '').toUpperCase().trim();
  const room = iqRooms[code];
  if (!room) return res.status(404).json({ error: 'Room introuvable' });
  if (room.state !== 'lobby') return res.status(409).json({ error: 'Partie déjà en cours' });
  const { player } = req.body;
  if (!player || !player.id || !player.name) return res.status(400).json({ error: 'player requis' });
  player.name = sanitizeHtml((player.name || '').substring(0, 20));
  // Check max players
  const max = room.maxPlayers || 8;
  if (room.players.length >= max && !room.players.find(p => p.id === player.id)) {
    return res.status(409).json({ error: 'Salon complet' });
  }
  // Avoid duplicates
  if (!room.players.find(p => p.id === player.id)) {
    room.players.push(player);
    room.playerCount = room.players.length;
    room.updatedAt = Date.now();
    log.info(`[IQ] ${player.name} rejoint ${code} (${room.players.length} joueurs)`);
  }
  res.json({ success: true, players: room.players });
});

// Get players for an IQ room (polling endpoint)
app.get('/api/iq-rooms/:code/players', (req, res) => {
  const code = (req.params.code || '').toUpperCase().trim();
  const room = iqRooms[code];
  if (!room) return res.status(404).json({ error: 'Room introuvable' });
  const response = { players: room.players, state: room.state };
  // Include game data when game has started (for cross-device sync)
  if (room.state === 'playing' && room.questions) {
    response.questions = room.questions;
    response.targetScore = room.targetScore;
    response.difficulty = room.difficulty;
    log.info(`[IQ GET /players] ${code}: state=playing, sending ${room.questions.length} questions`);
  }
  res.json(response);
});

// Remove a player from an IQ room
app.post('/api/iq-rooms/:code/leave', (req, res) => {
  const code = (req.params.code || '').toUpperCase().trim();
  const room = iqRooms[code];
  if (!room) return res.json({ success: true });
  const { playerId } = req.body;
  if (playerId) {
    room.players = room.players.filter(p => p.id !== playerId);
    room.playerCount = room.players.length;
    room.updatedAt = Date.now();
  }
  res.json({ success: true });
});

app.get('/api/iq-rooms/:code', (req, res) => {
  const code = (req.params.code || '').toUpperCase().trim();
  const room = iqRooms[code];
  if (!room) return res.status(404).json({ error: 'Room introuvable' });
  res.json(room);
});

app.patch('/api/iq-rooms/:code', (req, res) => {
  const code = (req.params.code || '').toUpperCase().trim();
  const room = iqRooms[code];
  if (!room) {
    log.info(`[IQ PATCH] Room ${code} NOT FOUND`);
    return res.status(404).json({ error: 'Room introuvable' });
  }
  const allowed = ['state', 'playerCount', 'visibility', 'questions', 'difficulty', 'targetScore'];
  const updated = [];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      room[key] = req.body[key];
      updated.push(key + (key === 'questions' && req.body[key] ? '(' + req.body[key].length + ')' : '=' + req.body[key]));
    }
  }
  room.updatedAt = Date.now();
  log.info(`[IQ PATCH] Room ${code}: ${updated.join(', ')}`);
  res.json({ success: true });
});

app.delete('/api/iq-rooms/:code', (req, res) => {
  const code = (req.params.code || '').toUpperCase().trim();
  if (iqRooms[code]) {
    delete iqRooms[code];
    log.info(`[IQ] Room ${code} supprimée`);
  }
  res.json({ success: true });
});

// sendBeacon uses POST, not DELETE
app.post('/api/iq-rooms/:code/close', (req, res) => {
  const code = (req.params.code || '').toUpperCase().trim();
  if (iqRooms[code]) {
    delete iqRooms[code];
    log.info(`[IQ] Room ${code} fermée (beacon)`);
  }
  res.json({ success: true });
});

// =============================================================================
// ROUTES SEO — Pages de contenu
// =============================================================================

const SITE_URL = process.env.SITE_URL || 'https://al-asmaa.app';

// Helper : générer un slug à partir de la translittération
function toSlug(transliteration) {
  return transliteration
    .toLowerCase()
    .replace(/[''`\u2019\u2018]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

// Template HTML commun pour les pages SEO
function seoPageHead(title, description, canonicalPath, extraMeta = '') {
  return `<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#050810">
  <meta name="author" content="Wazko">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta name="keywords" content="99 noms d'Allah, Asmaul Husna, Asma ul Husna, apprendre noms Allah, jeu islamique, mémoriser 99 noms, Coran">
  <link rel="canonical" href="${SITE_URL}${canonicalPath}">
  <link rel="alternate" hreflang="fr" href="${SITE_URL}${canonicalPath}">
  <link rel="alternate" hreflang="x-default" href="${SITE_URL}${canonicalPath}">
  <link rel="icon" type="image/svg+xml" href="/contenu/al_asma_logo_icon.svg">
  <link rel="apple-touch-icon" href="/icons/icon-192.svg">
  <link rel="manifest" href="/manifest.json">

  <!-- Resource hints -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${SITE_URL}${canonicalPath}">
  <meta property="og:image" content="${SITE_URL}/icons/icon-512.svg">
  <meta property="og:image:width" content="512">
  <meta property="og:image:height" content="512">
  <meta property="og:image:alt" content="Al-Asmaa — Les 99 Noms d'Allah">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:site_name" content="Al-Asmaa">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${SITE_URL}/icons/icon-512.svg">
  <meta name="twitter:image:alt" content="Al-Asmaa">
  ${extraMeta}

  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400;500;600;700&family=Syne:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="/css/style.css?v=21.0">
  <link rel="stylesheet" href="/css/animations.css?v=15.0">
  <style>
    .seo-page { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; min-height: 100vh;
      font-family: 'Outfit', sans-serif; }
    .seo-page h1 { color: var(--gold); font-family: 'Syne', 'Outfit', sans-serif; font-size: 2rem; margin-bottom: 1rem; }
    .seo-page h2 { color: var(--gold-light); font-family: 'Syne', 'Outfit', sans-serif; font-size: 1.4rem; margin: 2rem 0 0.8rem; }
    .seo-page p, .seo-page li { color: var(--text-secondary); font-family: 'Outfit', sans-serif; line-height: 1.7; }
    .seo-page a { color: var(--gold); text-decoration: underline; }
    .seo-page .breadcrumb { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem; }
    .seo-page .breadcrumb a { color: var(--gold); text-decoration: none; }
    .seo-page .back-home { display: inline-block; margin-top: 2rem; padding: 0.7rem 1.5rem;
      background: var(--gold); color: var(--bg-deep); border-radius: 8px; text-decoration: none; font-family: 'Syne', 'Outfit', sans-serif; font-weight: 700; }
    .name-card-seo { background: var(--bg-glass); border: 1px solid var(--border-subtle);
      border-radius: 12px; padding: 1.5rem; margin: 1rem 0; }
    .name-card-seo .arabic { font-size: 2.5rem; text-align: center; color: var(--gold);
      font-family: 'Reem Kufi', serif; direction: rtl; margin-bottom: 0.5rem; }
    .name-card-seo .translit { text-align: center; font-family: 'Syne', 'Outfit', sans-serif; font-size: 1.3rem; font-weight: 600; color: var(--text-primary); }
    .name-card-seo .meaning { text-align: center; font-family: 'Outfit', sans-serif; font-size: 1rem; color: var(--gold-light); margin-top: 0.3rem; }
    .names-table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
    .names-table th { background: var(--bg-glass); color: var(--gold); font-family: 'Syne', 'Outfit', sans-serif; padding: 0.8rem; text-align: left;
      border-bottom: 2px solid var(--gold); }
    .names-table td { padding: 0.7rem 0.8rem; border-bottom: 1px solid var(--border-subtle); }
    .names-table td:nth-child(2) { font-family: 'Reem Kufi', serif; font-size: 1.3rem; direction: rtl; text-align: right; color: var(--gold); }
    .names-table tr:hover { background: rgba(212,162,76,0.05); }
    .names-table a { color: var(--text-primary); text-decoration: none; }
    .names-table a:hover { color: var(--gold); }

    /* ========== Legal Pages — Ultra Premium ========== */
    .seo-page:has(.legal-hero) { max-width: 1060px; }

    /* Page background — subtle static gradient instead of canvas orbs */
    body:has(.legal-hero) { background:
      radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,162,76,0.04) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 20% 80%, rgba(100,80,200,0.03) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 60%, rgba(60,140,200,0.02) 0%, transparent 60%),
      var(--bg-deep); }

    /* Hero — immersive layered gradient */
    .legal-hero { position: relative; text-align: center; padding: 5rem 2rem 3.5rem; margin: -2rem -1.5rem 0;
      background: linear-gradient(180deg, rgba(212,162,76,0.08) 0%, rgba(212,162,76,0.03) 30%, rgba(12,16,32,0.5) 70%, transparent 100%);
      border-bottom: none; overflow: hidden; }
    .legal-hero::before { content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse 80% 70% at 50% -10%, rgba(212,162,76,0.12) 0%, transparent 70%);
      pointer-events: none; }
    .legal-hero::after { content: ''; position: absolute; bottom: 0; left: 5%; right: 5%; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212,162,76,0.35), transparent); }

    .legal-star { display: block; margin: 0 auto 1.8rem; width: 48px; height: 48px;
      opacity: 0.7; filter: drop-shadow(0 0 14px rgba(212,162,76,0.4));
      animation: legalStarGlow 4s ease-in-out infinite; }
    @keyframes legalStarGlow {
      0%, 100% { opacity: 0.5; filter: drop-shadow(0 0 10px rgba(212,162,76,0.25)); transform: scale(1) rotate(0deg); }
      50% { opacity: 0.9; filter: drop-shadow(0 0 24px rgba(212,162,76,0.6)); transform: scale(1.08) rotate(8deg); } }

    .legal-hero h1 { font-family: 'Syne', 'Outfit', sans-serif; font-size: 2.6rem; font-weight: 800; margin: 0 0 1rem;
      background: linear-gradient(135deg, #FFE7A3 0%, #F6C864 20%, #D89E2C 45%, #F4D27E 70%, #FFE7A3 100%);
      background-size: 250% 250%; animation: legalTitleShimmer 5s ease infinite;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.2;
      letter-spacing: -0.02em; text-shadow: none; }
    @keyframes legalTitleShimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

    .legal-hero-date { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Outfit', sans-serif; font-size: 0.76rem;
      color: var(--text-muted); padding: 0.4rem 1rem; background: rgba(15,19,36,0.7);
      border: 1px solid rgba(212,162,76,0.12); border-radius: var(--radius-pill);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 2px 12px rgba(0,0,0,0.2); }

    .legal-breadcrumb { font-family: 'Outfit', sans-serif; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1.5rem; position: relative; z-index: 1; }
    .legal-breadcrumb a { color: var(--gold); text-decoration: none; transition: color 0.2s; }
    .legal-breadcrumb a:hover { color: var(--gold-light); }

    /* TOC — frosted glass card */
    .legal-toc { background: linear-gradient(160deg, rgba(15,19,36,0.92), rgba(20,25,48,0.78));
      border: 1px solid rgba(212,162,76,0.15); border-radius: 16px;
      padding: 1.75rem 2rem; margin: 2.5rem 0 3rem;
      box-shadow: 0 4px 30px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.03) inset;
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      position: relative; overflow: hidden; }
    .legal-toc::before { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212,162,76,0.25), transparent); }
    .legal-toc::after { content: ''; position: absolute; inset: 0; border-radius: 16px;
      background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 50%); pointer-events: none; }
    .legal-toc-title { font-family: 'Syne', 'Outfit', sans-serif; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em;
      color: var(--gold); margin: 0 0 0.85rem; display: flex; align-items: center; gap: 0.5rem; }
    .legal-toc-title svg { width: 14px; height: 14px; stroke: var(--gold); }
    .legal-toc-grid { list-style: none; padding: 0; margin: 0;
      display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.4rem; }
    .legal-toc-grid a { display: flex; align-items: center; gap: 0.55rem; padding: 0.5rem 0.7rem;
      font-family: 'Outfit', sans-serif; font-size: 0.82rem; color: var(--text-secondary); text-decoration: none;
      border-radius: 10px; transition: all 0.25s ease; }
    .legal-toc-grid a:hover { color: var(--gold-light); background: rgba(212,162,76,0.08); transform: translateX(4px); }
    .legal-toc-n { display: inline-flex; align-items: center; justify-content: center;
      min-width: 22px; height: 22px; font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700;
      color: var(--gold); background: rgba(212,162,76,0.12); border-radius: 6px; flex-shrink: 0; }

    /* Sections — premium glass cards with reveal */
    .legal-section { background: linear-gradient(165deg, rgba(15,19,36,0.90), rgba(22,28,52,0.75));
      border: 1px solid rgba(212,162,76,0.08); border-radius: 16px;
      padding: 2.25rem 2.5rem; margin-bottom: 1rem;
      box-shadow: 0 2px 12px rgba(0,0,0,0.25), 0 8px 32px rgba(0,0,0,0.15);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      opacity: 0; transform: translateY(24px);
      transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1),
                  border-color 0.3s ease, box-shadow 0.3s ease;
      position: relative; overflow: hidden; }
    .legal-section::before { content: ''; position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212,162,76,0.18), transparent); pointer-events: none; }
    .legal-section::after { content: ''; position: absolute; inset: 0; border-radius: 16px;
      background: linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 40%); pointer-events: none; }
    .legal-section.is-visible { opacity: 1; transform: none; }
    .legal-section:hover { border-color: rgba(212,162,76,0.18);
      box-shadow: 0 2px 12px rgba(0,0,0,0.25), 0 12px 40px rgba(0,0,0,0.18), 0 0 30px rgba(212,162,76,0.04); }

    .legal-section-head { display: flex; align-items: center; gap: 0.85rem;
      margin-bottom: 1.1rem; padding-bottom: 0.85rem; border-bottom: 1px solid rgba(212,162,76,0.08); }
    .legal-section-n { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;
      font-family: 'Syne', sans-serif; font-size: 0.82rem; font-weight: 700; color: var(--bg-deep);
      background: linear-gradient(135deg, var(--gold-light), var(--gold-deep)); border-radius: 10px;
      flex-shrink: 0; box-shadow: 0 2px 10px rgba(212,162,76,0.3), inset 0 1px 0 rgba(255,255,255,0.2); }
    .legal-section h2 { font-family: 'Syne', 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 700;
      color: var(--text-primary); margin: 0; line-height: 1.3; }
    .legal-section p { color: var(--text-secondary); font-family: 'Outfit', sans-serif; font-size: 0.92rem; line-height: 1.85; margin: 0.65rem 0 0; }
    .legal-section p:first-of-type { margin-top: 0; }
    .legal-section strong { color: var(--text-primary); font-weight: 600; }
    .legal-section em { color: var(--text-muted); font-style: italic; }
    .legal-section a { color: var(--gold); text-decoration: underline; text-underline-offset: 3px;
      text-decoration-color: rgba(212,162,76,0.3); transition: all 0.2s; }
    .legal-section a:hover { color: var(--gold-light); text-decoration-color: var(--gold-light); }
    .legal-section code { font-size: 0.8rem; padding: 0.15rem 0.45rem; background: rgba(212,162,76,0.08);
      border: 1px solid rgba(212,162,76,0.12); border-radius: 6px; color: var(--gold-light); }

    /* Lists */
    .legal-ul { list-style: none; padding: 0; margin: 0.65rem 0 0; }
    .legal-ul li { position: relative; padding: 0.5rem 0 0.5rem 1.5rem;
      color: var(--text-secondary); font-family: 'Outfit', sans-serif; font-size: 0.88rem; line-height: 1.75; }
    .legal-ul li::before { content: ''; position: absolute; left: 0.15rem; top: 1rem;
      width: 6px; height: 6px; background: linear-gradient(135deg, var(--gold-light), var(--gold)); border-radius: 50%;
      box-shadow: 0 0 6px rgba(212,162,76,0.3); }
    .legal-ul li strong { color: var(--text-primary); }

    /* Shield list (privacy positive) */
    .legal-shield li { padding-left: 1.85rem; }
    .legal-shield li::before { content: '\\2713'; width: 20px; height: 20px;
      background: rgba(45,212,160,0.12); color: var(--emerald); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.62rem; font-weight: 700; top: 0.55rem; left: 0;
      box-shadow: 0 0 8px rgba(45,212,160,0.15); }

    /* Highlight box */
    .legal-highlight { background: linear-gradient(135deg, rgba(212,162,76,0.05), rgba(212,162,76,0.02));
      border-left: 3px solid var(--gold);
      border-radius: 0 12px 12px 0; padding: 1.1rem 1.4rem; margin: 0.85rem 0 0;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
    .legal-highlight p { margin: 0; font-size: 0.87rem; }

    /* Cross navigation — premium cards */
    .legal-cross { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;
      margin-top: 3rem; padding-top: 2.5rem; border-top: 1px solid rgba(212,162,76,0.1); }
    .legal-cross a { display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
      padding: 1.5rem 1rem; background: linear-gradient(165deg, rgba(15,19,36,0.92), rgba(22,28,52,0.80));
      border: 1px solid rgba(212,162,76,0.10); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      border-radius: 16px; text-decoration: none; transition: all 0.35s cubic-bezier(0.22,1,0.36,1); text-align: center;
      position: relative; overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.2); }
    .legal-cross a::before { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212,162,76,0.2), transparent);
      opacity: 0; transition: opacity 0.35s; }
    .legal-cross a:hover::before { opacity: 1; }
    .legal-cross a:hover { border-color: rgba(212,162,76,0.30); background: linear-gradient(165deg, rgba(22,28,52,0.97), rgba(35,42,70,0.88));
      transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 0 24px rgba(212,162,76,0.08); }
    .legal-cross-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, rgba(212,162,76,0.12), rgba(212,162,76,0.06));
      border: 1px solid rgba(212,162,76,0.15); border-radius: 12px; padding: 8px;
      transition: all 0.35s ease;
      box-shadow: 0 2px 8px rgba(212,162,76,0.08); }
    .legal-cross a:hover .legal-cross-icon { background: linear-gradient(135deg, rgba(212,162,76,0.20), rgba(212,162,76,0.10));
      border-color: rgba(212,162,76,0.3);
      box-shadow: 0 0 16px rgba(212,162,76,0.2); }
    .legal-cross-icon svg { width: 100%; height: 100%; stroke: var(--gold); fill: none;
      stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
    .legal-cross-label { font-family: 'Syne', 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 700; color: var(--text-primary); }
    .legal-cross-sub { font-family: 'Outfit', sans-serif; font-size: 0.7rem; color: var(--text-muted); }
    .legal-cross .is-current { opacity: 0.3; pointer-events: none; border-style: dashed; }

    /* Back button — gold surface with glow + shimmer */
    @keyframes legalShimmer {
      0%        { left: -130%; }
      35%       { left: 160%;  }
      36%, 100% { left: -130%; }
    }
    @keyframes legalBackPulse {
      0%, 100% { box-shadow: 0 0 20px rgba(212,162,76,0.08), 0 4px 28px rgba(0,0,0,0.35); }
      50% { box-shadow: 0 0 32px rgba(212,162,76,0.18), 0 4px 28px rgba(0,0,0,0.35); }
    }
    .legal-back {
      display: inline-flex; align-items: center; gap: 0.75rem;
      margin-top: 2.5rem; padding: 1.15rem 3rem;
      position: relative; overflow: hidden;
      background: linear-gradient(165deg, #c49535, #dab04e 35%, #f0cc6a 55%, #dab04e 75%, #b08930);
      color: #0d0800 !important; font-family: 'Syne', 'Outfit', sans-serif; font-weight: 800; font-size: 0.94rem;
      letter-spacing: 0.05em; text-transform: uppercase;
      border-radius: var(--radius-pill);
      text-decoration: none !important;
      border: 1.5px solid rgba(255,230,140,0.30);
      text-shadow: 0 1px 0 rgba(255,255,255,0.15);
      box-shadow:
        0 1px 2px rgba(0,0,0,0.4),
        0 4px 16px rgba(180,140,50,0.25),
        0 10px 40px rgba(180,140,50,0.12),
        inset 0 1px 0 rgba(255,255,255,0.35),
        inset 0 -2px 0 rgba(0,0,0,0.08);
      animation: legalBackPulse 3s ease-in-out infinite;
      transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), filter 0.35s ease, border-color 0.35s ease; }
    .legal-back::before {
      content: ''; position: absolute; top: 0; left: -130%; width: 65%; height: 100%;
      background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.08) 75%, transparent 100%);
      pointer-events: none;
      animation: legalShimmer 4s ease-in-out infinite; }
    .legal-back:hover {
      transform: translateY(-4px) scale(1.04);
      filter: brightness(1.1) drop-shadow(0 8px 24px rgba(212,162,76,0.30));
      border-color: rgba(255,230,140,0.50); }
    .legal-back:active { transform: translateY(-1px) scale(0.97); filter: brightness(0.92); transition-duration: 0.08s; }
    .legal-back svg { width: 20px; height: 20px; stroke: #0d0800; stroke-width: 2.8; transition: transform 0.3s cubic-bezier(0.22,1,0.36,1); }
    .legal-back:hover svg { transform: translateX(-6px); }

    /* Responsive */
    @media (max-width: 768px) {
      .legal-hero { padding: 3rem 1rem 2.5rem; margin: -2rem -1.5rem 0; }
      .legal-hero h1 { font-size: 1.8rem; }
      .legal-toc { padding: 1.15rem 1.25rem; }
      .legal-toc-grid { grid-template-columns: 1fr; }
      .legal-section { padding: 1.4rem 1.25rem; margin-bottom: 0.75rem; }
      .legal-section h2 { font-size: 1.05rem; }
      .legal-section p { font-size: 0.86rem; }
      .legal-section-n { width: 28px; height: 28px; font-size: 0.72rem; border-radius: 8px; }
      .legal-cross { grid-template-columns: 1fr; gap: 0.75rem; }
    }
    @media (prefers-reduced-motion: reduce) {
      .legal-section { opacity: 1; transform: none; transition: none; }
      .legal-star { animation: none; opacity: 0.6; }
      .legal-back::before { animation: none; }
      .legal-back { animation: none; }
    }
  </style>
  <script src="/js/consent.js?v=1.0"></script>
</head>
<body>
  <div class="seo-page">`;
}

function seoPageFoot(jsonLd = '') {
  return `
    <a href="/" class="back-home">Retour au jeu</a>
    <footer style="margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--border-subtle);font-family:'Outfit',sans-serif;font-size:0.75rem;color:var(--text-muted);line-height:1.8;">
      <nav aria-label="Liens légaux" style="display:flex;gap:1.2rem;flex-wrap:wrap;">
        <a href="/mentions-legales" style="color:var(--text-muted);text-decoration:none;">Mentions légales</a>
        <a href="/politique-de-confidentialite" style="color:var(--text-muted);text-decoration:none;">Confidentialité</a>
        <a href="/conditions-utilisation" style="color:var(--text-muted);text-decoration:none;">CGU</a>
        <a href="/encyclopedie" style="color:var(--text-muted);text-decoration:none;">Les 99 Noms</a>
        <a href="/guide" style="color:var(--text-muted);text-decoration:none;">Guide</a>
        <a href="#" onclick="event.preventDefault();alAsmaaOpenConsentBanner()" style="color:var(--text-muted);text-decoration:none;">Cookies</a>
      </nav>
      <p style="margin-top:0.5rem;">&copy; ${new Date().getFullYear()} Al-Asmaa &mdash; Projet éducatif gratuit et open source.</p>
    </footer>
  </div>
  ${jsonLd}
  <script src="/js/background.js?v=15.0"></script>
</body>
</html>`;
}

function legalPageFoot(currentPath) {
  const pages = [
    { path: '/mentions-legales',
      icon: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
      label: 'Mentions l\u00e9gales', sub: '\u00c9diteur, h\u00e9bergement, propri\u00e9t\u00e9' },
    { path: '/politique-de-confidentialite',
      icon: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
      label: 'Confidentialit\u00e9', sub: 'Donn\u00e9es, cookies, RGPD' },
    { path: '/conditions-utilisation',
      icon: '<svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/></svg>',
      label: 'CGU', sub: "Conditions d'utilisation" }
  ];

  const crossNav = pages.map(p => {
    const cls = p.path === currentPath ? ' is-current' : '';
    return `<a href="${p.path}" class="${cls}">
        <span class="legal-cross-icon">${p.icon}</span>
        <span class="legal-cross-label">${p.label}</span>
        <span class="legal-cross-sub">${p.sub}</span>
      </a>`;
  }).join('\n      ');

  return `
    <nav class="legal-cross" aria-label="Pages l\u00e9gales">
      ${crossNav}
    </nav>

    <div style="text-align:center">
      <a href="/" class="legal-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Retour au jeu
      </a>
    </div>

    <footer style="margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--border-subtle);text-align:center;font-family:'Outfit',sans-serif;font-size:0.72rem;color:var(--text-muted);line-height:1.8;">
      <nav aria-label="Liens l\u00e9gaux" style="display:flex;gap:1.2rem;flex-wrap:wrap;justify-content:center;margin-bottom:0.5rem;">
        <a href="/mentions-legales" style="color:var(--text-muted);text-decoration:none;">Mentions l\u00e9gales</a>
        <a href="/politique-de-confidentialite" style="color:var(--text-muted);text-decoration:none;">Confidentialit\u00e9</a>
        <a href="/conditions-utilisation" style="color:var(--text-muted);text-decoration:none;">CGU</a>
        <a href="/encyclopedie" style="color:var(--text-muted);text-decoration:none;">Les 99 Noms</a>
        <a href="/guide" style="color:var(--text-muted);text-decoration:none;">Guide</a>
        <a href="#" onclick="event.preventDefault();alAsmaaOpenConsentBanner()" style="color:var(--text-muted);text-decoration:none;">Cookies</a>
      </nav>
      <p>&copy; ${new Date().getFullYear()} Al-Asmaa &mdash; Projet \u00e9ducatif gratuit et open source.</p>
    </footer>
  </div>
  <script>
  document.addEventListener('DOMContentLoaded', function() {
    var sections = document.querySelectorAll('.legal-section');
    if (!sections.length) return;
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
      sections.forEach(function(s, i) {
        s.style.transitionDelay = (i < 5 ? i * 0.07 : 0) + 's';
        obs.observe(s);
      });
    } else {
      sections.forEach(function(s) { s.classList.add('is-visible'); });
    }
    document.querySelectorAll('.legal-toc-grid a').forEach(function(a) {
      a.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });
  });
  </script>
</body>
</html>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// --- Routes SPA (servent index.html pour la navigation client-side) ---
['/entrainement', '/encyclopedie', '/guide', '/99-noms-allah', '/mini-jeux'].forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
});

// Route SPA pour les noms individuels (/nom/:slug → encyclopédie detail)
app.get('/nom/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route SPA pour Ilm Quest (/iq/:code → join IQ room client-side)
app.get('/iq/:code', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- API : Leaderboard (persisté sur disque) ---
const LEADERBOARD_FILE = path.join(__dirname, 'data', 'leaderboard.json');
const MAX_LEADERBOARD = 50;
let leaderboard = { quiz: [], daily: [] };
let _leaderboardDirty = false;

// Charger le leaderboard depuis le disque au démarrage
try {
  if (fs.existsSync(LEADERBOARD_FILE)) {
    const raw = fs.readFileSync(LEADERBOARD_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.quiz && parsed.daily) leaderboard = parsed;
  }
} catch { /* Fichier absent ou corrompu — on repart à vide */ }

function saveLeaderboard() {
  if (!_leaderboardDirty) return;
  try {
    const dir = path.dirname(LEADERBOARD_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(leaderboard, null, 2));
    _leaderboardDirty = false;
  } catch { /* Silencieux en cas d'erreur d'écriture */ }
}

// Flush toutes les 5 minutes + au shutdown
setInterval(saveLeaderboard, 5 * 60 * 1000);

// ============================================================================
// API Encyclopedie integrite religieuse (mode strict)
// ============================================================================

app.get('/api/encyclopedia-integrity/:slug', (req, res) => {
  const slug = normalizeSlugParam(req.params.slug);
  if (!slug) {
    return res.status(400).json({ error: 'INVALID_SLUG' });
  }

  const entry = integrityRepository.loadEntry(slug);
  if (!entry) {
    const fallback = createInsufficientEvidenceFallback(
      { slug },
      'INSUFFICIENT_EVIDENCE:no_entry_file'
    );
    return res.status(404).json({
      error: 'ENTRY_NOT_FOUND',
      entry: fallback
    });
  }

  if (entry.public_display_allowed !== true) {
    return res.status(403).json({
      error: 'ENTRY_NOT_PUBLIC',
      entry: {
        slug: entry.slug,
        editorial_review: entry.editorial_review,
        public_display_allowed: false,
        publication_blockers: entry.publication_blockers || []
      }
    });
  }

  return res.json({ entry });
});

app.post('/api/encyclopedia-integrity/generate/:slug', async (req, res) => {
  if (!hasEditorialAccess(req)) {
    return res.status(401).json({ error: 'UNAUTHORIZED_REVIEW_ACCESS' });
  }

  const slug = normalizeSlugParam(req.params.slug);
  if (!slug) {
    return res.status(400).json({ error: 'INVALID_SLUG' });
  }

  const candidate = integrityRepository.loadCandidate(slug);
  if (!candidate) {
    return res.status(404).json({ error: 'CANDIDATE_NOT_FOUND' });
  }

  try {
    const entry = await integrityGenerator.generateFromCandidate(candidate);
    const filePath = integrityRepository.saveEntry(entry);

    return res.json({
      slug: entry.slug,
      editorial_status: entry.editorial_review.status,
      public_display_allowed: entry.public_display_allowed,
      publication_blockers: entry.publication_blockers || [],
      output_path: filePath
    });
  } catch (error) {
    return res.status(500).json({ error: 'GENERATION_FAILED', message: error.message });
  }
});

app.post('/api/encyclopedia-integrity/review/:slug', (req, res) => {
  if (!hasEditorialAccess(req)) {
    return res.status(401).json({ error: 'UNAUTHORIZED_REVIEW_ACCESS' });
  }

  const slug = normalizeSlugParam(req.params.slug);
  if (!slug) {
    return res.status(400).json({ error: 'INVALID_SLUG' });
  }

  const entry = integrityRepository.loadEntry(slug);
  if (!entry) {
    return res.status(404).json({ error: 'ENTRY_NOT_FOUND' });
  }

  try {
    const reviewed = applyHumanReview(entry, {
      status: req.body.status,
      reviewer_id: req.body.reviewer_id,
      notes: req.body.notes
    });
    integrityRepository.saveEntry(reviewed);
    integrityAuditTrail.log({
      slug,
      stage: 'human_review',
      reviewer_id: req.body.reviewer_id || null,
      status: req.body.status,
      reason: req.body.notes || null
    });
    return res.json({
      slug,
      editorial_review: reviewed.editorial_review,
      public_display_allowed: reviewed.public_display_allowed,
      publication_blockers: reviewed.publication_blockers || []
    });
  } catch (error) {
    return res.status(400).json({ error: 'INVALID_REVIEW', message: error.message });
  }
});

app.get('/api/leaderboard/:type', (req, res) => {
  const type = req.params.type;
  if (!leaderboard[type]) return res.status(400).json({ error: 'Type invalide' });
  res.json(leaderboard[type].slice(0, 20));
});

app.post('/api/leaderboard/:type', (req, res) => {
  const type = req.params.type;
  if (!leaderboard[type]) return res.status(400).json({ error: 'Type invalide' });

  const { name, score } = req.body;
  if (!name || typeof name !== 'string' || name.length > MAX_NAME_LENGTH) {
    return res.status(400).json({ error: 'Nom invalide' });
  }
  if (typeof score !== 'number' || score < 0 || score > 10000) {
    return res.status(400).json({ error: 'Score invalide' });
  }

  const entry = { name: name.substring(0, MAX_NAME_LENGTH), score, date: new Date().toISOString() };
  leaderboard[type].push(entry);
  leaderboard[type].sort((a, b) => b.score - a.score);
  if (leaderboard[type].length > MAX_LEADERBOARD) {
    leaderboard[type] = leaderboard[type].slice(0, MAX_LEADERBOARD);
  }
  _leaderboardDirty = true;

  const rank = leaderboard[type].findIndex(e => e === entry) + 1;
  res.json({ rank, total: leaderboard[type].length });
});

// --- Route : /mentions-legales ---
app.get('/mentions-legales', (req, res) => {
  const title = 'Mentions Légales | Al-Asmaa';
  const desc = 'Mentions légales du site Al-Asmaa, application éducative pour apprendre les 99 Noms d\'Allah.';

  let html = seoPageHead(title, desc, '/mentions-legales');

  html += `
    <div class="legal-hero">
      <nav class="legal-breadcrumb" aria-label="Fil d'Ariane">
        <a href="/">Accueil</a> <span style="margin:0 .4rem;opacity:.5">&rsaquo;</span> Mentions légales
      </nav>
      <svg class="legal-star" viewBox="0 0 100 100" fill="none"><path d="M50 2L56 44L98 50L56 56L50 98L44 56L2 50L44 44Z" fill="url(#lsg)"/><path d="M50 18L54 45L82 50L54 55L50 82L46 55L18 50L46 45Z" fill="url(#lsg)" opacity=".3"/><defs><linearGradient id="lsg" x1="0" y1="0" x2="100" y2="100"><stop offset="0%" stop-color="#f0cc7a"/><stop offset="100%" stop-color="#d4a24c"/></linearGradient></defs></svg>
      <h1>Mentions Légales</h1>
    </div>

    <nav class="legal-toc" aria-label="Sommaire">
      <div class="legal-toc-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        Sommaire
      </div>
      <ul class="legal-toc-grid">
        <li><a href="#ml1"><span class="legal-toc-n">1</span>Éditeur du site</a></li>
        <li><a href="#ml2"><span class="legal-toc-n">2</span>Hébergement</a></li>
        <li><a href="#ml3"><span class="legal-toc-n">3</span>Propriété intellectuelle</a></li>
        <li><a href="#ml4"><span class="legal-toc-n">4</span>Limitation de responsabilité</a></li>
        <li><a href="#ml5"><span class="legal-toc-n">5</span>Données personnelles</a></li>
        <li><a href="#ml6"><span class="legal-toc-n">6</span>Mesure d'audience</a></li>
        <li><a href="#ml7"><span class="legal-toc-n">7</span>Droit applicable</a></li>
      </ul>
    </nav>

    <section class="legal-section" id="ml1">
      <div class="legal-section-head">
        <span class="legal-section-n">1</span>
        <h2>Éditeur du site</h2>
      </div>
      <p>
        <strong>Al-Asmaa</strong> est un projet éducatif personnel, gratuit et sans but lucratif
        (ci-après &laquo;&nbsp;le développeur&nbsp;&raquo;).
        Ce site n'est rattaché à aucune activité professionnelle ou commerciale.
      </p>
      <ul class="legal-ul">
        <li>Nom du projet : Al-Asmaa</li>
        <li>Nature : site personnel non commercial</li>
        <li>Contact : <a href="mailto:al.asmaa.pro@gmail.com">al.asmaa.pro@gmail.com</a></li>
      </ul>
    </section>

    <section class="legal-section" id="ml2">
      <div class="legal-section-head">
        <span class="legal-section-n">2</span>
        <h2>Hébergement</h2>
      </div>
      <p>Le site est hébergé par :</p>
      <ul class="legal-ul">
        <li>DYJIX SAS</li>
        <li>149 Avenue du Maine, 75014 Paris, France</li>
        <li>Téléphone : +33 1 89 16 28 08</li>
        <li>Site : <a href="https://dyjix.eu" target="_blank" rel="noopener">dyjix.eu</a></li>
      </ul>
    </section>

    <section class="legal-section" id="ml3">
      <div class="legal-section-head">
        <span class="legal-section-n">3</span>
        <h2>Propriété intellectuelle</h2>
      </div>
      <p>
        Le code source, le design et les contenus originaux de l'application Al-Asmaa sont la
        propriété de leur auteur. Les textes coraniques et les hadiths cités sur ce site sont
        issus des sources islamiques authentiques et appartiennent au patrimoine commun de la Oumma.
      </p>
      <p>
        Les données encyclopédiques (significations, commentaires savants, hadiths) sont compilées
        à partir de sources classiques de la tradition islamique et sont proposées dans un but
        purement éducatif et de vulgarisation.
      </p>
      <p>
        Toute reproduction intégrale de l'application à des fins commerciales est interdite sans
        autorisation préalable du développeur.
      </p>
    </section>

    <section class="legal-section" id="ml4">
      <div class="legal-section-head">
        <span class="legal-section-n">4</span>
        <h2>Limitation de responsabilité</h2>
      </div>
      <p>
        Al-Asmaa est fourni &laquo;&nbsp;en l'état&nbsp;&raquo;, sans garantie d'aucune sorte. Le développeur
        s'efforce de fournir des informations exactes mais ne peut garantir l'exactitude,
        l'exhaustivité ou l'actualité des contenus. L'utilisateur est invité à vérifier
        les informations auprès de sources savantes reconnues.
      </p>
      <p>
        Le développeur ne garantit pas la disponibilité ininterrompue du service ni l'absence
        de bugs. En aucun cas il ne pourra être tenu responsable de dommages directs ou
        indirects liés à l'utilisation de l'application.
      </p>
    </section>

    <section class="legal-section" id="ml5">
      <div class="legal-section-head">
        <span class="legal-section-n">5</span>
        <h2>Données personnelles</h2>
      </div>
      <p>
        Pour toute information relative au traitement de vos données personnelles, consultez notre
        <a href="/politique-de-confidentialite">Politique de Confidentialité</a>.
      </p>
    </section>

    <section class="legal-section" id="ml6">
      <div class="legal-section-head">
        <span class="legal-section-n">6</span>
        <h2>Mesure d'audience</h2>
      </div>
      <p>
        Le site utilise <strong>Google Analytics</strong> (Google LLC) à des fins de mesure d'audience
        anonyme. Ce service ne se charge qu'après votre <strong>consentement explicite</strong> via
        le bandeau de consentement affiché lors de votre première visite.
      </p>
      <p>
        Vous pouvez modifier votre choix à tout moment en cliquant sur
        « <a href="#" onclick="event.preventDefault();alAsmaaOpenConsentBanner()">Gérer mes cookies</a> »
        ci-dessous ou via le lien « Cookies » présent en bas de chaque page.
        Pour plus de détails, consultez la
        <a href="/politique-de-confidentialite">Politique de Confidentialité</a>.
      </p>
    </section>

    <section class="legal-section" id="ml7">
      <div class="legal-section-head">
        <span class="legal-section-n">7</span>
        <h2>Droit applicable</h2>
      </div>
      <p>
        Les présentes mentions légales sont soumises au droit français. En cas de litige,
        une résolution amiable sera recherchée en priorité. À défaut, les tribunaux français
        seront seuls compétents.
      </p>
    </section>`;

  html += legalPageFoot('/mentions-legales');
  res.send(html);
});

// --- Route : /politique-de-confidentialite ---
app.get('/politique-de-confidentialite', (req, res) => {
  const title = 'Politique de Confidentialité | Al-Asmaa';
  const desc = 'Politique de confidentialité d\'Al-Asmaa : traitement des données, cookies, droits des utilisateurs.';
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  let html = seoPageHead(title, desc, '/politique-de-confidentialite');

  html += `
    <div class="legal-hero">
      <nav class="legal-breadcrumb" aria-label="Fil d'Ariane">
        <a href="/">Accueil</a> <span style="margin:0 .4rem;opacity:.5">&rsaquo;</span> Politique de confidentialité
      </nav>
      <svg class="legal-star" viewBox="0 0 100 100" fill="none"><path d="M50 2L56 44L98 50L56 56L50 98L44 56L2 50L44 44Z" fill="url(#lsg)"/><path d="M50 18L54 45L82 50L54 55L50 82L46 55L18 50L46 45Z" fill="url(#lsg)" opacity=".3"/><defs><linearGradient id="lsg" x1="0" y1="0" x2="100" y2="100"><stop offset="0%" stop-color="#f0cc7a"/><stop offset="100%" stop-color="#d4a24c"/></linearGradient></defs></svg>
      <h1>Politique de Confidentialité</h1>
      <span class="legal-hero-date">Mise à jour : ${dateStr}</span>
    </div>

    <nav class="legal-toc" aria-label="Sommaire">
      <div class="legal-toc-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        Sommaire
      </div>
      <ul class="legal-toc-grid">
        <li><a href="#pc1"><span class="legal-toc-n">1</span>Qui sommes-nous ?</a></li>
        <li><a href="#pc2"><span class="legal-toc-n">2</span>Données collectées</a></li>
        <li><a href="#pc3"><span class="legal-toc-n">3</span>Ce que nous ne collectons pas</a></li>
        <li><a href="#pc4"><span class="legal-toc-n">4</span>Cookies et mesure d'audience</a></li>
        <li><a href="#pc5"><span class="legal-toc-n">5</span>Base légale du traitement</a></li>
        <li><a href="#pc6"><span class="legal-toc-n">6</span>Stockage local</a></li>
        <li><a href="#pc7"><span class="legal-toc-n">7</span>Service Worker</a></li>
        <li><a href="#pc8"><span class="legal-toc-n">8</span>Services tiers</a></li>
        <li><a href="#pc9"><span class="legal-toc-n">9</span>Transferts de données</a></li>
        <li><a href="#pc10"><span class="legal-toc-n">10</span>Signalements</a></li>
        <li><a href="#pc11"><span class="legal-toc-n">11</span>Sécurité</a></li>
        <li><a href="#pc12"><span class="legal-toc-n">12</span>Droits des utilisateurs</a></li>
        <li><a href="#pc13"><span class="legal-toc-n">13</span>Mineurs</a></li>
        <li><a href="#pc14"><span class="legal-toc-n">14</span>Modifications</a></li>
      </ul>
    </nav>

    <!-- 1. Qui sommes-nous -->
    <section class="legal-section" id="pc1">
      <div class="legal-section-head">
        <span class="legal-section-n">1</span>
        <h2>Qui sommes-nous ?</h2>
      </div>
      <p>
        <strong>Al-Asmaa</strong> est une application web éducative gratuite, sans publicité et
        sans but lucratif, dans le but d'aider les musulmans
        à apprendre et mémoriser les 99 Noms d'Allah.
      </p>
      <p>
        En tant que responsable du traitement au sens du RGPD, le développeur s'engage à protéger
        la vie privée des utilisateurs et à ne collecter que les données strictement nécessaires
        au fonctionnement du site.
      </p>
      <p>Contact : <em><a href="mailto:al.asmaa.pro@gmail.com">al.asmaa.pro@gmail.com</a></em></p>
    </section>

    <!-- 2. Données collectées -->
    <section class="legal-section" id="pc2">
      <div class="legal-section-head">
        <span class="legal-section-n">2</span>
        <h2>Quelles données collectons-nous ?</h2>
      </div>
      <p>Al-Asmaa collecte le <strong>minimum de données nécessaire</strong> à son fonctionnement :</p>
      <ul class="legal-ul">
        <li><strong>Pseudo de jeu</strong> : choisi librement par l'utilisateur, stocké dans le navigateur
          (<code>localStorage</code>). Le pseudo est transmis au serveur uniquement pendant une partie
          multijoueur et supprimé à la fin de la session.</li>
        <li><strong>Progression d'apprentissage</strong> : scores SRS, flashcards consultées, résultats de quiz.
          Toutes ces données sont stockées <strong>uniquement dans le navigateur</strong> (<code>localStorage</code>)
          et ne quittent jamais votre appareil.</li>
        <li><strong>Données de session multijoueur</strong> : lors d'une partie, le pseudo et les réponses sont
          transmis via WebSocket. Ces données sont conservées en mémoire serveur <strong>uniquement
          pendant la durée de la partie</strong> et supprimées à la déconnexion.</li>
        <li><strong>Leaderboard</strong> : si vous soumettez un score au classement, votre pseudo et votre
          score sont enregistrés sur le serveur. Ces données ne contiennent aucune information
          personnelle identifiante au-delà du pseudo choisi.</li>
        <li><strong>Données d'audience (sous consentement)</strong> : si vous acceptez les cookies via le bandeau
          de consentement, Google Analytics collecte des données anonymes de navigation
          (pages visitées, durée de session, type d'appareil, pays). <strong>Ces données ne sont jamais
          collectées sans votre accord préalable.</strong> Voir la <a href="#pc4">section 4</a> pour le
          détail complet.</li>
      </ul>
    </section>

    <!-- 3. Ce que nous ne collectons pas -->
    <section class="legal-section" id="pc3">
      <div class="legal-section-head">
        <span class="legal-section-n">3</span>
        <h2>Ce que nous ne collectons PAS</h2>
      </div>
      <div class="legal-highlight">
        <p><strong>Al-Asmaa respecte votre vie privée.</strong> Nous ne collectons aucune donnée superflue.</p>
      </div>
      <ul class="legal-ul legal-shield">
        <li>Aucune adresse email (sauf si vous nous contactez volontairement)</li>
        <li>Aucune donnée de géolocalisation précise</li>
        <li>Aucun identifiant publicitaire</li>
        <li>Aucun pixel de suivi ou retargeting (Facebook Pixel, etc.)</li>
        <li>Aucune donnée revendue ou partagée avec des tiers à des fins commerciales</li>
        <li>Aucun compte utilisateur ni mot de passe</li>
        <li>Aucun fingerprinting de navigateur</li>
      </ul>
    </section>

    <!-- 4. Cookies et mesure d'audience -->
    <section class="legal-section" id="pc4">
      <div class="legal-section-head">
        <span class="legal-section-n">4</span>
        <h2>Cookies et mesure d'audience</h2>
      </div>

      <h3 style="color:var(--gold-light);font-size:1rem;margin:1.5rem 0 0.6rem;">4.1 &mdash; Principe de consentement préalable</h3>
      <p>
        <strong>Conformément au RGPD (art.&nbsp;6-1-a) et à la directive ePrivacy</strong>,
        aucun cookie de mesure d'audience n'est déposé sur votre navigateur tant que vous n'avez pas
        donné votre <strong>consentement explicite</strong>.
      </p>
      <p>
        Lors de votre première visite, un bandeau de consentement vous propose deux choix clairs :
        <strong>Accepter</strong> ou <strong>Refuser</strong> les cookies d'analyse.
        Tant que vous n'avez pas fait votre choix, Google Analytics n'est <strong>pas chargé</strong>
        et aucun cookie n'est déposé.
      </p>

      <h3 style="color:var(--gold-light);font-size:1rem;margin:1.5rem 0 0.6rem;">4.2 &mdash; Google Analytics (GA4)</h3>
      <p>
        Si vous acceptez, Al-Asmaa charge <strong>Google Analytics 4</strong> (propriété
        <code>G-LQ6P2VEF0R</code>), un service de mesure d'audience fourni par Google LLC
        (1600 Amphitheatre Parkway, Mountain View, CA 94043, États-Unis).
      </p>
      <p>Ce service nous permet de comprendre :</p>
      <ul class="legal-ul">
        <li>Quelles pages sont les plus consultées</li>
        <li>Combien de temps les utilisateurs restent sur le site</li>
        <li>Quel type d'appareil et de navigateur est utilisé</li>
        <li>De quel pays proviennent les visites</li>
      </ul>
      <p>
        Ces informations sont <strong>anonymes</strong> et servent uniquement à améliorer l'application.
        Elles ne permettent en aucun cas de vous identifier personnellement.
      </p>

      <h3 style="color:var(--gold-light);font-size:1rem;margin:1.5rem 0 0.6rem;">4.3 &mdash; Liste des cookies déposés</h3>
      <div style="overflow-x:auto;margin:1rem 0;">
        <table class="names-table" style="font-size:0.82rem;">
          <thead>
            <tr>
              <th style="font-size:0.78rem;">Cookie</th>
              <th style="text-align:left;font-family:inherit;font-size:0.78rem;direction:ltr;">Fournisseur</th>
              <th style="text-align:left;font-family:inherit;font-size:0.78rem;direction:ltr;">Finalité</th>
              <th style="text-align:left;font-family:inherit;font-size:0.78rem;direction:ltr;">Durée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-family:monospace;font-size:0.82rem;direction:ltr;text-align:left;color:var(--gold);"><code>_ga</code></td>
              <td style="font-family:inherit;font-size:0.82rem;direction:ltr;text-align:left;">Google</td>
              <td style="font-family:inherit;font-size:0.82rem;direction:ltr;text-align:left;">Distinguer les utilisateurs uniques</td>
              <td style="font-family:inherit;font-size:0.82rem;direction:ltr;text-align:left;">2 ans</td>
            </tr>
            <tr>
              <td style="font-family:monospace;font-size:0.82rem;direction:ltr;text-align:left;color:var(--gold);"><code>_ga_*</code></td>
              <td style="font-family:inherit;font-size:0.82rem;direction:ltr;text-align:left;">Google</td>
              <td style="font-family:inherit;font-size:0.82rem;direction:ltr;text-align:left;">Maintenir l'état de la session GA4</td>
              <td style="font-family:inherit;font-size:0.82rem;direction:ltr;text-align:left;">2 ans</td>
            </tr>
            <tr>
              <td style="font-family:monospace;font-size:0.82rem;direction:ltr;text-align:left;color:var(--gold);"><code>_gid</code></td>
              <td style="font-family:inherit;font-size:0.82rem;direction:ltr;text-align:left;">Google</td>
              <td style="font-family:inherit;font-size:0.82rem;direction:ltr;text-align:left;">Distinguer les utilisateurs (24h)</td>
              <td style="font-family:inherit;font-size:0.82rem;direction:ltr;text-align:left;">24 heures</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        En dehors de ces cookies de mesure d'audience (et uniquement si vous les acceptez),
        Al-Asmaa ne dépose <strong>aucun autre cookie</strong> sur votre navigateur.
      </p>

      <h3 style="color:var(--gold-light);font-size:1rem;margin:1.5rem 0 0.6rem;">4.4 &mdash; Gérer votre consentement</h3>
      <p>
        Votre choix (accepter ou refuser) est sauvegardé dans le <code>localStorage</code>
        de votre navigateur sous la clé <code>al-asmaa-cookie-consent</code>.
        Il n'est jamais transmis au serveur.
      </p>
      <p><strong>Vous pouvez modifier votre choix à tout moment</strong> de deux façons :</p>
      <ul class="legal-ul">
        <li>En cliquant sur le lien « <strong>Cookies</strong> » présent en bas de chaque page du site</li>
        <li>En cliquant sur le bouton ci-dessous :</li>
      </ul>
      <p style="text-align:center;margin:1.2rem 0;">
        <a href="#" onclick="event.preventDefault();alAsmaaOpenConsentBanner()"
           style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.7rem 1.5rem;
                  background:linear-gradient(175deg,#e8b84a 0%,#c9952e 50%,#a67c2e 100%);
                  color:#1a1000;font-weight:700;font-size:0.85rem;border-radius:12px;text-decoration:none;
                  box-shadow:0 4px 16px rgba(212,162,76,0.3),inset 0 1px 0 rgba(255,230,160,0.4);
                  transition:all .2s;border:1px solid rgba(255,230,160,0.2);">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
          Gérer mes cookies
        </a>
      </p>

      <h3 style="color:var(--gold-light);font-size:1rem;margin:1.5rem 0 0.6rem;">4.5 &mdash; Que se passe-t-il si vous refusez ?</h3>
      <p>
        Si vous cliquez sur « Refuser » ou retirez votre consentement :
      </p>
      <ul class="legal-ul">
        <li>Google Analytics <strong>n'est pas chargé</strong> (aucun script, aucune requête vers Google)</li>
        <li>Les cookies GA existants (<code>_ga</code>, <code>_ga_*</code>, <code>_gid</code>) sont
          <strong>automatiquement supprimés</strong></li>
        <li>L'application fonctionne normalement &mdash; aucune fonctionnalité n'est restreinte</li>
      </ul>
    </section>

    <!-- 5. Base légale -->
    <section class="legal-section" id="pc5">
      <div class="legal-section-head">
        <span class="legal-section-n">5</span>
        <h2>Base légale du traitement</h2>
      </div>
      <p>Les traitements de données réalisés par Al-Asmaa reposent sur les bases légales suivantes :</p>
      <ul class="legal-ul">
        <li><strong>Consentement</strong> (art.&nbsp;6-1-a du RGPD) : pour le dépôt de cookies
          Google Analytics. Ce consentement est recueilli via le bandeau de consentement et peut
          être retiré à tout moment.</li>
        <li><strong>Intérêt légitime</strong> (art.&nbsp;6-1-f du RGPD) : pour le fonctionnement technique
          du site (WebSocket, anti-spam sur les signalements, Service Worker).</li>
        <li><strong>Exécution du service</strong> : pour les données de jeu (pseudo, scores) nécessaires
          au fonctionnement du multijoueur et du leaderboard.</li>
      </ul>
    </section>

    <!-- 6. Stockage local -->
    <section class="legal-section" id="pc6">
      <div class="legal-section-head">
        <span class="legal-section-n">6</span>
        <h2>Stockage local (<code>localStorage</code>)</h2>
      </div>
      <p>
        Les données de progression, de préférence et de consentement cookies sont stockées via
        <code>localStorage</code>, une technologie de stockage local du navigateur. Ces données
        <strong>ne sont jamais envoyées automatiquement au serveur</strong>.
      </p>
      <p>Principales clés utilisées :</p>
      <ul class="legal-ul">
        <li><code>al-asmaa-cookie-consent</code> &mdash; votre choix de consentement cookies (<em>accepted</em> ou <em>refused</em>)</li>
        <li><code>al-asmaa-srs-*</code> &mdash; progression d'apprentissage (SRS)</li>
        <li><code>al-asmaa-settings</code> &mdash; préférences de l'application</li>
        <li><code>al-asmaa-player-name</code> &mdash; pseudo de jeu choisi</li>
      </ul>
      <p>
        Vous pouvez à tout moment supprimer ces données en vidant le stockage local de votre
        navigateur (Paramètres &gt; Données de navigation &gt; Stockage local).
      </p>
    </section>

    <!-- 7. Service Worker -->
    <section class="legal-section" id="pc7">
      <div class="legal-section-head">
        <span class="legal-section-n">7</span>
        <h2>Service Worker et mise en cache</h2>
      </div>
      <p>
        Al-Asmaa utilise un Service Worker pour permettre un fonctionnement hors-ligne.
        Ce dernier met en cache les fichiers statiques de l'application (CSS, JavaScript, images)
        sur votre appareil. Aucune donnée personnelle n'est impliquée dans ce cache.
      </p>
    </section>

    <!-- 8. Services tiers -->
    <section class="legal-section" id="pc8">
      <div class="legal-section-head">
        <span class="legal-section-n">8</span>
        <h2>Services tiers</h2>
      </div>
      <p>L'application interagit avec les services tiers suivants :</p>
      <ul class="legal-ul">
        <li><strong>Google Analytics 4</strong> (mesure d'audience) &mdash; chargé <strong>uniquement
          après consentement</strong>. Voir la <a href="#pc4">section 4</a> pour tous les détails.</li>
        <li><strong>Google Translate</strong> &mdash; utilisé pour la fonctionnalité d'écoute audio des noms.
          Lorsque vous écoutez la prononciation d'un nom, une requête est envoyée à Google Translate.
          Aucune donnée personnelle n'est transmise.</li>
        <li><strong>Stripe / PayPal</strong> &mdash; si vous effectuez un don volontaire, vous êtes redirigé vers
          la plateforme de paiement choisie. Al-Asmaa ne collecte ni ne stocke aucune donnée bancaire.
          Le traitement du paiement est entièrement géré par Stripe ou PayPal selon leurs propres
          conditions et politiques de confidentialité.</li>
        <li><strong>Partage social</strong> &mdash; lorsque vous utilisez les boutons de partage (WhatsApp, Twitter, Telegram),
          vous êtes redirigé vers le service choisi. Al-Asmaa ne transmet aucune donnée à ces services
          &mdash; seul le texte que vous choisissez de partager est concerné.</li>
      </ul>
    </section>

    <!-- 9. Transferts de données -->
    <section class="legal-section" id="pc9">
      <div class="legal-section-head">
        <span class="legal-section-n">9</span>
        <h2>Transferts de données hors UE</h2>
      </div>
      <p>
        Si vous acceptez les cookies de mesure d'audience, Google Analytics peut transférer des
        données anonymes vers les serveurs de Google LLC situés aux États-Unis. Ces transferts
        sont encadrés par les
        <a href="https://business.safety.google/adprocessorterms/" target="_blank" rel="noopener">clauses contractuelles types</a>
        de Google et le
        <a href="https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/eu-us-data-transfers_fr" target="_blank" rel="noopener">cadre de protection des données UE-États-Unis</a>.
      </p>
      <p>
        Les données collectées sont anonymes (aucun identifiant personnel) et ne concernent que
        des statistiques de navigation agrégées. Google agit en tant que sous-traitant conformément
        à sa <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">politique de confidentialité</a>.
      </p>
      <p>
        Si vous refusez les cookies, <strong>aucune donnée n'est transmise à Google</strong>.
      </p>
    </section>

    <!-- 10. Signalements -->
    <section class="legal-section" id="pc10">
      <div class="legal-section-head">
        <span class="legal-section-n">10</span>
        <h2>Signalements</h2>
      </div>
      <p>
        La fonctionnalité &laquo;&nbsp;Signaler un problème&nbsp;&raquo; collecte les données suivantes :
      </p>
      <ul class="legal-ul">
        <li>Le type de signalement (bug, erreur de contenu, suggestion)</li>
        <li>La page concernée</li>
        <li>La description rédigée par l'utilisateur</li>
        <li>L'identifiant du navigateur (<code>User-Agent</code>), pour faciliter le diagnostic technique</li>
        <li>L'adresse IP, utilisée <strong>uniquement</strong> pour limiter les abus (anti-spam).
          L'IP n'est pas stockée de manière permanente.</li>
      </ul>
      <p>
        Ces signalements sont conservés sur le serveur et peuvent être envoyés par email au
        développeur. Ils ne contiennent aucune donnée personnelle identifiante sauf si
        l'utilisateur en inclut volontairement dans sa description.
      </p>
    </section>

    <!-- 11. Sécurité -->
    <section class="legal-section" id="pc11">
      <div class="legal-section-head">
        <span class="legal-section-n">11</span>
        <h2>Sécurité</h2>
      </div>
      <p>
        Nous mettons en &oelig;uvre des mesures de sécurité appropriées pour protéger les données :
      </p>
      <ul class="legal-ul">
        <li>Communication chiffrée via HTTPS (TLS) en production</li>
        <li>En-têtes de sécurité HTTP (Content-Security-Policy, X-Content-Type-Options, X-Frame-Options)</li>
        <li>Validation et assainissement de toutes les entrées utilisateur</li>
        <li>Protection contre les injections (XSS, injection de code)</li>
        <li>Limitation de débit sur les événements de jeu et les signalements</li>
        <li>Consentement préalable avant tout dépôt de cookie tiers</li>
      </ul>
      <p>
        Toutefois, aucune transmission sur Internet ne peut être garantie à 100&nbsp;% sûre.
      </p>
    </section>

    <!-- 12. Droits des utilisateurs -->
    <section class="legal-section" id="pc12">
      <div class="legal-section-head">
        <span class="legal-section-n">12</span>
        <h2>Droits des utilisateurs</h2>
      </div>
      <p>
        Conformément au Règlement Général sur la Protection des Données (RGPD, art.&nbsp;15 à 21),
        vous disposez des droits suivants :
      </p>
      <ul class="legal-ul">
        <li><strong>Droit d'accès</strong> (art.&nbsp;15) : vos données locales sont accessibles directement
          via les outils développeur de votre navigateur (onglet Application &gt; Local Storage).</li>
        <li><strong>Droit de rectification</strong> (art.&nbsp;16) : vous pouvez modifier votre pseudo et vos
          données locales à tout moment depuis l'application.</li>
        <li><strong>Droit de suppression</strong> (art.&nbsp;17) : videz le <code>localStorage</code> de votre navigateur pour
          supprimer vos données locales. Pour le leaderboard, contactez le développeur.</li>
        <li><strong>Droit d'opposition</strong> (art.&nbsp;21) : vous pouvez refuser ou retirer votre consentement
          aux cookies à tout moment en cliquant sur
          « <a href="#" onclick="event.preventDefault();alAsmaaOpenConsentBanner()">Gérer mes cookies</a> »
          ou via le lien « Cookies » en bas de chaque page.</li>
        <li><strong>Droit au retrait du consentement</strong> (art.&nbsp;7-3) : le retrait du consentement est aussi
          simple que son octroi. Il suffit de cliquer sur « Gérer mes cookies » pour rouvrir le bandeau.</li>
        <li><strong>Droit de portabilité</strong> (art.&nbsp;20) : vous pouvez exporter vos données
          <code>localStorage</code> au format JSON depuis les outils développeur.</li>
      </ul>
      <p>
        Pour toute question, demande d'exercice de vos droits, ou réclamation :
        <em><a href="mailto:al.asmaa.pro@gmail.com">al.asmaa.pro@gmail.com</a></em>
      </p>
      <p>
        Vous disposez également du droit d'introduire une réclamation auprès de la
        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener">CNIL</a>
        (Commission Nationale de l'Informatique et des Libertés).
      </p>
    </section>

    <!-- 13. Mineurs -->
    <section class="legal-section" id="pc13">
      <div class="legal-section-head">
        <span class="legal-section-n">13</span>
        <h2>Mineurs</h2>
      </div>
      <p>
        Al-Asmaa est une application éducative adaptée à tous les âges, incluant un mode enfant.
        Aucune inscription ni donnée personnelle identifiante n'est requise pour utiliser l'application.
      </p>
      <p>
        Si un mineur utilise le site, les cookies de mesure d'audience ne seront déposés que si
        le consentement a été donné via le bandeau. Les données éventuellement collectées par
        Google Analytics restent anonymes et ne permettent pas d'identifier l'utilisateur.
      </p>
    </section>

    <!-- 14. Modifications -->
    <section class="legal-section" id="pc14">
      <div class="legal-section-head">
        <span class="legal-section-n">14</span>
        <h2>Modifications</h2>
      </div>
      <p>
        Cette politique peut être mise à jour pour refléter les évolutions légales ou les changements
        dans le fonctionnement du site. La date de dernière modification est indiquée en haut de
        cette page. En cas de modification substantielle, un nouveau consentement cookies pourra
        être demandé.
      </p>
    </section>`;

  html += legalPageFoot('/politique-de-confidentialite');
  res.send(html);
});

// --- Route : /conditions-utilisation ---
app.get('/conditions-utilisation', (req, res) => {
  const title = 'Conditions Générales d\'Utilisation | Al-Asmaa';
  const desc = 'Conditions générales d\'utilisation de l\'application Al-Asmaa pour l\'apprentissage des 99 Noms d\'Allah.';
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  let html = seoPageHead(title, desc, '/conditions-utilisation');

  html += `
    <div class="legal-hero">
      <nav class="legal-breadcrumb" aria-label="Fil d'Ariane">
        <a href="/">Accueil</a> <span style="margin:0 .4rem;opacity:.5">&rsaquo;</span> Conditions d'utilisation
      </nav>
      <svg class="legal-star" viewBox="0 0 100 100" fill="none"><path d="M50 2L56 44L98 50L56 56L50 98L44 56L2 50L44 44Z" fill="url(#lsg)"/><path d="M50 18L54 45L82 50L54 55L50 82L46 55L18 50L46 45Z" fill="url(#lsg)" opacity=".3"/><defs><linearGradient id="lsg" x1="0" y1="0" x2="100" y2="100"><stop offset="0%" stop-color="#f0cc7a"/><stop offset="100%" stop-color="#d4a24c"/></linearGradient></defs></svg>
      <h1>Conditions Générales d'Utilisation</h1>
      <span class="legal-hero-date">Mise à jour : ${dateStr}</span>
    </div>

    <nav class="legal-toc" aria-label="Sommaire">
      <div class="legal-toc-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        Sommaire
      </div>
      <ul class="legal-toc-grid">
        <li><a href="#cu1"><span class="legal-toc-n">1</span>Objet</a></li>
        <li><a href="#cu2"><span class="legal-toc-n">2</span>Description du service</a></li>
        <li><a href="#cu3"><span class="legal-toc-n">3</span>Accès au service</a></li>
        <li><a href="#cu4"><span class="legal-toc-n">4</span>Comportement</a></li>
        <li><a href="#cu5"><span class="legal-toc-n">5</span>Contenu éducatif</a></li>
        <li><a href="#cu6"><span class="legal-toc-n">6</span>Propriété intellectuelle</a></li>
        <li><a href="#cu7"><span class="legal-toc-n">7</span>Responsabilité</a></li>
        <li><a href="#cu8"><span class="legal-toc-n">8</span>Dons et soutien</a></li>
        <li><a href="#cu9"><span class="legal-toc-n">9</span>Liens tiers</a></li>
        <li><a href="#cu10"><span class="legal-toc-n">10</span>Modification des CGU</a></li>
        <li><a href="#cu11"><span class="legal-toc-n">11</span>Droit applicable</a></li>
        <li><a href="#cu12"><span class="legal-toc-n">12</span>Contact</a></li>
      </ul>
    </nav>

    <section class="legal-section" id="cu1">
      <div class="legal-section-head">
        <span class="legal-section-n">1</span>
        <h2>Objet</h2>
      </div>
      <p>
        Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation
        de l'application web <strong>Al-Asmaa</strong>, accessible à l'adresse
        <a href="${SITE_URL}">${SITE_URL}</a>. En utilisant l'application, vous acceptez
        sans réserve les présentes conditions.
      </p>
    </section>

    <section class="legal-section" id="cu2">
      <div class="legal-section-head">
        <span class="legal-section-n">2</span>
        <h2>Description du service</h2>
      </div>
      <p>
        Al-Asmaa est une application éducative <strong>gratuite et sans publicité</strong> permettant
        d'apprendre et de mémoriser les 99 Noms d'Allah (Asmaul Husna). Elle propose :
      </p>
      <ul class="legal-ul">
        <li>Un jeu multijoueur en temps réel (La Bombe des Noms)</li>
        <li>Un mode Ilm Quest (quiz multijoueur en ligne)</li>
        <li>Une encyclopédie détaillée des 99 Noms avec sources savantes</li>
        <li>Des modes d'apprentissage : flashcards, quiz, écoute audio, défi quotidien</li>
        <li>Un système de répétition espacée (SRS)</li>
        <li>Des mini-jeux éducatifs</li>
        <li>Un mode entraînement individuel</li>
      </ul>
    </section>

    <section class="legal-section" id="cu3">
      <div class="legal-section-head">
        <span class="legal-section-n">3</span>
        <h2>Accès au service</h2>
      </div>
      <p>
        L'application est accessible gratuitement depuis tout navigateur web moderne.
        Aucune inscription n'est requise. L'utilisateur choisit un pseudo temporaire
        pour les parties multijoueur, sans obligation de fournir de données personnelles.
      </p>
    </section>

    <section class="legal-section" id="cu4">
      <div class="legal-section-head">
        <span class="legal-section-n">4</span>
        <h2>Comportement de l'utilisateur</h2>
      </div>
      <p>L'utilisateur s'engage à :</p>
      <ul class="legal-ul">
        <li>Utiliser l'application de manière respectueuse, conformément à son objectif éducatif</li>
        <li>Ne pas choisir de pseudo injurieux, offensant ou contraire à l'éthique islamique</li>
        <li>Ne pas tenter de perturber le fonctionnement de l'application (spam, exploitation
          de failles, attaques par déni de service)</li>
        <li>Ne pas utiliser de bots ou de scripts automatisés pour fausser les scores</li>
      </ul>
    </section>

    <section class="legal-section" id="cu5">
      <div class="legal-section-head">
        <span class="legal-section-n">5</span>
        <h2>Contenu éducatif</h2>
      </div>
      <p>
        Les informations relatives aux 99 Noms d'Allah (significations, versets coraniques,
        hadiths, commentaires savants) sont fournies à titre éducatif et de vulgarisation.
        Elles sont compilées à partir de sources islamiques reconnues mais ne constituent
        pas un avis religieux (<em>fatwa</em>).
      </p>
      <p>
        L'utilisateur est encouragé à approfondir ses connaissances auprès de savants
        et d'ouvrages de référence. Le développeur décline toute responsabilité en cas
        d'erreur ou d'imprécision dans le contenu.
      </p>
    </section>

    <section class="legal-section" id="cu6">
      <div class="legal-section-head">
        <span class="legal-section-n">6</span>
        <h2>Propriété intellectuelle</h2>
      </div>
      <p>
        Le code, le design et les contenus originaux d'Al-Asmaa sont la propriété de leur
        auteur. Les textes sacrés (Coran, Sunna) sont du domaine commun. Toute reproduction
        intégrale de l'application à des fins commerciales est interdite sans autorisation
        préalable.
      </p>
    </section>

    <section class="legal-section" id="cu7">
      <div class="legal-section-head">
        <span class="legal-section-n">7</span>
        <h2>Limitation de responsabilité</h2>
      </div>
      <p>
        L'application est fournie &laquo;&nbsp;en l'état&nbsp;&raquo;. Le développeur ne garantit pas la disponibilité
        ininterrompue du service ni l'absence de bugs. En aucun cas le développeur ne pourra
        être tenu responsable de dommages directs ou indirects liés à l'utilisation de
        l'application.
      </p>
    </section>

    <section class="legal-section" id="cu8">
      <div class="legal-section-head">
        <span class="legal-section-n">8</span>
        <h2>Dons et soutien</h2>
      </div>
      <p>
        Al-Asmaa propose une fonctionnalité de don volontaire via <strong>Stripe</strong> (paiement
        par carte) et <strong>PayPal</strong>. Ces dons sont facultatifs et ne conditionnent en rien
        l'accès aux fonctionnalités de l'application.
      </p>
      <p>
        Al-Asmaa ne collecte ni ne stocke aucune donnée bancaire. Le traitement des paiements
        est entièrement délégué à Stripe ou PayPal. Aucun remboursement n'est possible sur les
        dons effectués, sauf erreur technique avérée.
      </p>
    </section>

    <section class="legal-section" id="cu9">
      <div class="legal-section-head">
        <span class="legal-section-n">9</span>
        <h2>Liens vers des tiers</h2>
      </div>
      <p>
        L'application peut contenir des liens vers des sites externes (associations caritatives,
        réseaux sociaux). Le développeur n'est pas responsable du contenu ni des pratiques
        de ces sites tiers.
      </p>
    </section>

    <section class="legal-section" id="cu10">
      <div class="legal-section-head">
        <span class="legal-section-n">10</span>
        <h2>Modification des CGU</h2>
      </div>
      <p>
        Le développeur se réserve le droit de modifier les présentes CGU. Les modifications
        prennent effet dès leur publication. La date de dernière mise à jour est indiquée
        en haut de cette page.
      </p>
    </section>

    <section class="legal-section" id="cu11">
      <div class="legal-section-head">
        <span class="legal-section-n">11</span>
        <h2>Droit applicable</h2>
      </div>
      <p>
        Les présentes CGU sont régies par le droit français. En cas de litige, une résolution
        amiable sera recherchée en priorité. À défaut, les tribunaux français seront compétents.
      </p>
    </section>

    <section class="legal-section" id="cu12">
      <div class="legal-section-head">
        <span class="legal-section-n">12</span>
        <h2>Contact</h2>
      </div>
      <p>
        Pour toute question relative aux présentes conditions : <em><a href="mailto:al.asmaa.pro@gmail.com">al.asmaa.pro@gmail.com</a></em>
      </p>
    </section>`;

  html += legalPageFoot('/conditions-utilisation');
  res.send(html);
});

// --- Route : /sitemap.xml ---
app.get('/sitemap.xml', (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${SITE_URL}/encyclopedie</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${SITE_URL}/guide</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/entrainement</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/mentions-legales</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>${SITE_URL}/politique-de-confidentialite</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>${SITE_URL}/conditions-utilisation</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>`;

  ASMA_UL_HUSNA.forEach(name => {
    const slug = toSlug(name.transliteration);
    xml += `\n  <url><loc>${SITE_URL}/nom/${slug}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`;
  });

  xml += `\n</urlset>`;
  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

// --- Route : /robots.txt ---
app.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Allow: /nom/
Allow: /encyclopedie
Allow: /guide
Allow: /entrainement
Allow: /mentions-legales
Allow: /politique-de-confidentialite
Allow: /conditions-utilisation

Disallow: /api/
Disallow: /join/
Disallow: /lobby/
Disallow: /socket.io/

Sitemap: ${SITE_URL}/sitemap.xml
`);
});

// --- Page 404 (doit être APRÈS toutes les autres routes) ---
// Note : ce middleware sera ajouté après les routes statiques

// --- Server-side bomb timer (fallback si le client ne emit pas bomb-explode) ---
function startServerBombTimer(room) {
  clearServerBombTimer(room);
  if (!room.game || room.state !== 'playing' || room.game.paused) return;
  const grace = 3000; // 3s de marge après la durée client
  const timeout = (room.game.timerDuration * 1000) + grace;
  room._serverBombTimer = setTimeout(() => {
    if (!room || room.state !== 'playing' || room.game.paused) return;
    const currentPlayer = room.players[room.game.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.eliminated) return;
    // Garde anti-race : ignorer si une réponse récente
    if (room.game._lastAnswerTime && Date.now() - room.game._lastAnswerTime < 500) return;
    log.info(`[Server Timer] Explosion forcée pour ${currentPlayer.name} dans ${room.code}`);
    currentPlayer.lives--;
    if (currentPlayer.lives <= 0) {
      currentPlayer.eliminated = true;
      io.to(room.code).emit('player-eliminated', {
        player: currentPlayer,
        players: room.players,
        remainingPlayers: room.players.filter(p => !p.eliminated).length
      });
      const alivePlayers = room.players.filter(p => !p.eliminated);
      if (alivePlayers.length <= 1) { endGame(room); return; }
    }
    io.to(room.code).emit('bomb-exploded', {
      player: currentPlayer,
      lives: currentPlayer.lives,
      eliminated: currentPlayer.eliminated
    });
    nextPlayer(room);
    const timer = room.game.timerConfig;
    room.game.timerDuration = randomBetween(timer.min, timer.max);
    room.game.timerStart = Date.now();
    room.game.round++;
    io.to(room.code).emit('new-round', {
      currentPlayer: room.players[room.game.currentPlayerIndex],
      round: room.game.round,
      timerDuration: room.game.timerDuration,
      players: room.players
    });
    startServerBombTimer(room);
  }, timeout);
}

function clearServerBombTimer(room) {
  if (room._serverBombTimer) {
    clearTimeout(room._serverBombTimer);
    room._serverBombTimer = null;
  }
}

// --- Rate limiting par socket pour les events critiques ---
function createSocketThrottle(intervalMs = 150) {
  const lastCall = {};
  return function throttle(event) {
    const now = Date.now();
    if (lastCall[event] && now - lastCall[event] < intervalMs) return true; // bloqué
    lastCall[event] = now;
    return false; // autorisé
  };
}

// Logique Socket.io
io.on('connection', (socket) => {
  log.info(`[Connexion] ${socket.id}`);
  const throttle = createSocketThrottle(150);

  // Créer une room
  socket.on('create-room', (data, callback) => {
    log.info(`[create-room] data reçue:`, JSON.stringify({ visibility: data.visibility, hostName: data.hostName, difficulty: data.difficulty }));

    // Nettoyer TOUTES les rooms dont ce socket est l'hôte (évite les ghost rooms)
    for (const oldCode of Object.keys(rooms)) {
      const oldRoom = rooms[oldCode];
      if (oldRoom.host === socket.id) {
        clearServerBombTimer(oldRoom);
        if (oldRoom._destroyTimer) clearTimeout(oldRoom._destroyTimer);
        io.to(oldCode).emit('room-closed');
        const oldSockets = io.sockets.adapter.rooms.get(oldCode);
        if (oldSockets) {
          for (const sid of [...oldSockets]) {
            const s = io.sockets.sockets.get(sid);
            if (s && s.id !== socket.id) {
              s.leave(oldCode);
              s.roomCode = null;
            }
          }
        }
        socket.leave(oldCode);
        delete rooms[oldCode]; delete qrCache[oldCode];
        log.info(`[Cleanup] Ancienne room ${oldCode} supprimée (hôte crée une nouvelle room)`);
      }
    }

    const code = generateRoomCode();
    const hostName = sanitizeHtml((data.hostName || 'Hôte').substring(0, 20));
    const room = {
      code,
      host: socket.id,
      players: [],
      spectators: [],
      state: 'lobby', // lobby, playing, paused, ended
      visibility: data.visibility || 'private', // 'public' | 'private'
      hostName: hostName,
      maxPlayers: Math.min(Math.max(parseInt(data.maxPlayers) || 8, 2), 8),
      kickedNames: [],
      config: {
        difficulty: data.difficulty || 'intermediate',
        lives: data.lives || 3,
        mode: data.mode || 'classic',
        jokers: Math.min(Math.max(parseInt(data.jokers) || 2, 0), 3)
      },
      game: null,
      _createdAt: Date.now(),
      _lastActivity: Date.now()
    };

    // Ajouter l'hôte comme premier joueur
    const hostPlayer = {
      id: socket.id,
      name: hostName,
      color: generatePlayerColor(0),
      ready: true,
      lives: room.config.lives,
      score: 0,
      namesUsed: [],
      eliminated: false,
      connected: true,
      isHost: true
    };
    room.players.push(hostPlayer);

    rooms[code] = room;
    socket.join(code);
    socket.roomCode = code;
    socket.isHost = true;
    socket.playerId = socket.id;
    socket.playerName = hostName;

    log.info(`[Room créée] ${code} par ${hostName} (${socket.id}) — visibilité: ${room.visibility}`);

    getQRCode(code).then(({ qr, url }) => {
      callback({ success: true, code, qr, url, ip: LOCAL_IP, port: PORT, player: hostPlayer, players: room.players, maxPlayers: room.maxPlayers });
    }).catch(() => {
      const url = `http://${LOCAL_IP}:${PORT}/join/${code}`;
      callback({ success: true, code, qr: null, url, ip: LOCAL_IP, port: PORT, player: hostPlayer, players: room.players, maxPlayers: room.maxPlayers });
    });
  });

  // Reconnexion de l'hôte (refresh /lobby/CODE)
  socket.on('host-reconnect', (data, callback) => {
    const code = (data.code || '').toUpperCase().trim();
    const room = rooms[code];

    if (!room) {
      return callback({ success: false });
    }

    // Si l'ancien hôte est encore connecté ET c'est un socket différent → refuser
    const oldHostSocket = io.sockets.sockets.get(room.host);
    if (oldHostSocket && oldHostSocket.connected && oldHostSocket.id !== socket.id) {
      return callback({ success: false });
    }

    // Annuler le timer de suppression s'il existe
    if (room._destroyTimer) {
      clearTimeout(room._destroyTimer);
      room._destroyTimer = null;
      log.info(`[Reconnexion] Timer annulé pour ${code}`);
    }

    // Ré-attacher le socket comme hôte
    const hostPlayer = room.players.find(p => p.isHost);
    if (hostPlayer) {
      hostPlayer.id = socket.id;
      hostPlayer.connected = true;
    }

    room.host = socket.id;
    socket.join(code);
    socket.roomCode = code;
    socket.isHost = true;
    socket.playerId = socket.id;
    socket.playerName = room.hostName;

    // Notifier les joueurs que l'hôte est revenu
    io.to(code).emit('host-reconnected');

    getQRCode(code).then(({ qr, url }) => {
      callback({
        success: true, code,
        players: room.players, config: room.config,
        maxPlayers: room.maxPlayers, visibility: room.visibility,
        state: room.state, game: room.game,
        qr, url
      });
    }).catch(() => {
      const url = `http://${LOCAL_IP}:${PORT}/join/${code}`;
      callback({
        success: true, code,
        players: room.players, config: room.config,
        maxPlayers: room.maxPlayers, visibility: room.visibility,
        state: room.state, game: room.game,
        qr: null, url
      });
    });

    log.info(`[Host reconnect] ${room.hostName} → Room ${code}`);
  });

  // Rejoindre une room
  socket.on('join-room', (data, callback) => {
    const code = (data.code || '').toUpperCase().trim();
    const name = sanitizeHtml((data.name || 'Joueur').substring(0, 20));
    const room = rooms[code];

    if (!room) {
      return callback({ success: false, message: 'Room introuvable' });
    }
    room._lastActivity = Date.now();
    if (room.kickedNames.includes(name)) {
      return callback({ success: false, message: 'Tu as été exclu de cette room' });
    }

    // Vérifier que ce n'est pas l'hôte qui essaie de rejoindre sa propre room
    if (room.players.find(p => p.id === socket.id)) {
      return callback({ success: false, message: 'Tu es déjà dans cette room' });
    }

    // Reconnexion : chercher un joueur déconnecté avec le même nom
    const existing = room.players.find(p => p.name === name && !p.isHost);
    if (existing) {
      // Si le joueur est encore connecté → refuser (pseudo déjà pris)
      const oldSocket = io.sockets.sockets.get(existing.id);
      if (existing.connected && oldSocket && oldSocket.connected) {
        return callback({ success: false, message: 'Ce pseudo est déjà utilisé dans cette partie' });
      }

      // Joueur déconnecté → autoriser la reconnexion
      if (existing.id !== socket.id && oldSocket) {
        oldSocket.leave(code);
        oldSocket.roomCode = null;
        oldSocket.playerId = null;
      }

      // Réattacher le nouveau socket au joueur existant
      existing.id = socket.id;
      existing.connected = true;
      existing.ready = false; // Reset ready — player must re-confirm after refresh

      socket.join(code);
      socket.roomCode = code;
      socket.playerId = socket.id;
      socket.playerName = name;

      log.info(`[Joueur reconnecté] ${name} → Room ${code}`);

      io.to(code).emit('player-joined', {
        player: existing,
        players: room.players,
        count: room.players.filter(p => p.connected).length
      });

      return callback({
        success: true, player: existing, players: room.players, config: room.config,
        state: room.state, game: room.game
      });
    }

    // Nouveau joueur
    if (room.state !== 'lobby') {
      return callback({ success: false, message: 'Partie déjà en cours' });
    }
    if (room.players.length >= room.maxPlayers) {
      return callback({ success: false, message: `Room pleine (max ${room.maxPlayers} joueurs)` });
    }

    const player = {
      id: socket.id,
      name: name,
      color: generatePlayerColor(room.players.length),
      ready: false,
      lives: room.config.lives,
      score: 0,
      namesUsed: [],
      eliminated: false,
      connected: true
    };

    room.players.push(player);
    socket.join(code);
    socket.roomCode = code;
    socket.playerId = socket.id;
    socket.playerName = name;

    log.info(`[Joueur rejoint] ${name} → Room ${code}`);

    // Informer tous les joueurs de la room
    io.to(code).emit('player-joined', {
      player,
      players: room.players,
      count: room.players.length
    });

    callback({ success: true, player, players: room.players, config: room.config });
  });

  // Rejoindre en tant que spectateur
  socket.on('join-spectator', (data, callback) => {
    const code = (data.code || '').toUpperCase().trim();
    const room = rooms[code];

    if (!room) {
      return callback({ success: false, message: 'Room introuvable' });
    }

    room.spectators.push(socket.id);
    socket.join(code);
    socket.roomCode = code;
    socket.isSpectator = true;

    callback({
      success: true,
      players: room.players,
      config: room.config,
      state: room.state,
      game: room.game
    });
  });

  // Quitter la room (hôte annule la partie)
  socket.on('leave-room', () => {
    const code = socket.roomCode;
    const room = rooms[code];
    if (!room || room.host !== socket.id) return;

    // Clear bomb timer if game is in progress
    clearServerBombTimer(room);

    // Annuler le timer de suppression s'il existe
    if (room._destroyTimer) {
      clearTimeout(room._destroyTimer);
      room._destroyTimer = null;
    }

    // Prévenir tous les joueurs
    io.to(code).emit('room-closed');

    // Faire sortir tous les sockets de la room
    const sockets = io.sockets.adapter.rooms.get(code);
    if (sockets) {
      for (const sid of [...sockets]) {
        const s = io.sockets.sockets.get(sid);
        if (s) {
          s.leave(code);
          s.roomCode = null;
          s.isHost = false;
        }
      }
    }

    // Supprimer la room immédiatement
    delete rooms[code]; delete qrCache[code];
    socket.roomCode = null;
    socket.isHost = false;
    log.info(`[Room fermée] ${code} (hôte a quitté)`);
  });

  // Joueur quitte le lobby
  socket.on('player-leave', () => {
    const code = socket.roomCode;
    const room = rooms[code];
    if (!room || room.state !== 'lobby') return;

    room.players = room.players.filter(p => p.id !== socket.id);
    socket.leave(code);
    socket.roomCode = null;

    io.to(code).emit('player-left', {
      players: room.players,
      count: room.players.length
    });

    log.info(`[Joueur parti] ${socket.playerName} a quitté ${code}`);
  });

  // Joueur prêt
  socket.on('player-ready', () => {
    const room = rooms[socket.roomCode];
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.ready = !player.ready;
      io.to(socket.roomCode).emit('player-ready-changed', {
        playerId: socket.id,
        ready: player.ready,
        players: room.players
      });
    }
  });

  // Mettre à jour la configuration (hôte seulement)
  socket.on('update-config', (config) => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;

    if (config.maxPlayers !== undefined) {
      room.maxPlayers = Math.min(Math.max(parseInt(config.maxPlayers) || 8, 2), 8);
    }
    // Mise à jour sécurisée : seules les clés autorisées sont acceptées
    const allowedKeys = ['difficulty', 'lives', 'mode', 'jokers'];
    for (const key of allowedKeys) {
      if (config[key] !== undefined) {
        room.config[key] = config[key];
      }
    }
    // Valider les valeurs
    const validDifficulties = ['beginner', 'intermediate', 'expert', 'ultimate'];
    if (!validDifficulties.includes(room.config.difficulty)) room.config.difficulty = 'intermediate';
    room.config.lives = Math.min(Math.max(parseInt(room.config.lives) || 3, 1), 10);
    room.config.jokers = Math.min(Math.max(parseInt(room.config.jokers) || 2, 0), 3);
    io.to(socket.roomCode).emit('config-updated', { ...room.config, maxPlayers: room.maxPlayers });
  });

  // Lancer la partie (hôte seulement)
  socket.on('start-game', (callback) => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) {
      return callback && callback({ success: false, message: 'Non autorisé' });
    }
    if (room.players.length < 2) {
      return callback && callback({ success: false, message: 'Minimum 2 joueurs' });
    }
    if (!room.players.every(p => p.ready)) {
      return callback && callback({ success: false, message: 'Tous les joueurs doivent être prêts' });
    }

    room.state = 'playing';

    // Initialiser l'état du jeu
    const difficultyTimers = {
      beginner: { min: 12, max: 20 },
      intermediate: { min: 7, max: 12 },
      expert: { min: 3, max: 7 },
      ultimate: { min: 2, max: 15 }
    };

    const timer = difficultyTimers[room.config.difficulty] || difficultyTimers.intermediate;

    room.game = {
      currentPlayerIndex: 0,
      round: 1,
      usedNames: [],
      timerDuration: randomBetween(timer.min, timer.max),
      timerStart: Date.now(),
      timerConfig: timer,
      totalNames: 99,
      mode: room.config.mode,
      paused: false
    };

    // Lancer le timer serveur de sécurité
    startServerBombTimer(room);

    // Réinitialiser les joueurs
    room.players.forEach(p => {
      p.lives = room.config.lives;
      p.score = 0;
      p.namesUsed = [];
      p.eliminated = false;
      p.jokersRemaining = room.config.jokers;
    });

    log.info(`[Partie lancée] Room ${room.code} — ${room.players.length} joueurs — Mode: ${room.config.mode}`);

    io.to(socket.roomCode).emit('game-started', {
      players: room.players,
      config: room.config,
      game: room.game,
      currentPlayer: room.players[0]
    });

    callback && callback({ success: true });
  });

  // Soumettre une réponse
  socket.on('submit-answer', (data, callback) => {
    if (throttle('submit-answer')) return;
    const room = rooms[socket.roomCode];
    if (!room || room.state !== 'playing') return;
    room._lastActivity = Date.now();

    const currentPlayer = room.players[room.game.currentPlayerIndex];
    if (!currentPlayer) return;

    // Permettre à l'hôte de soumettre pour lui-même quand c'est son tour
    if (currentPlayer.id !== socket.id) {
      return callback && callback({ success: false, message: 'Ce n\'est pas ton tour' });
    }

    const answer = (data.answer || '').substring(0, 100);

    // Validation côté SERVEUR (ne fait plus confiance au client)
    const validation = serverValidateAnswer(answer, room.game.usedNames);

    if (validation.valid && validation.nameId) {
      // Réponse correcte validée par le serveur
      clearServerBombTimer(room);
      room.game._lastAnswerTime = Date.now();
      room.game.usedNames.push(validation.nameId);
      currentPlayer.namesUsed.push(validation.nameId);

      // Calculer le score basé sur le temps restant
      const elapsed = (Date.now() - room.game.timerStart) / 1000;
      const remaining = room.game.timerDuration - elapsed;
      const bonus = Math.max(0, Math.round(remaining * 10));
      currentPlayer.score += 10 + bonus;

      // Vérifier si tous les 99 noms sont cités
      if (room.game.usedNames.length >= 99) {
        io.to(socket.roomCode).emit('all-names-complete', {
          players: room.players
        });
        endGame(room);
        callback && callback({ success: true, result: 'complete' });
        return;
      }

      // Passer au joueur suivant
      nextPlayer(room);

      // Nouveau timer pour le prochain joueur
      const timer = room.game.timerConfig;
      room.game.timerDuration = randomBetween(timer.min, timer.max);
      room.game.timerStart = Date.now();

      io.to(socket.roomCode).emit('answer-result', {
        playerId: socket.id,
        playerName: currentPlayer.name,
        result: 'correct',
        answer,
        nameId: validation.nameId,
        score: currentPlayer.score,
        usedNames: room.game.usedNames,
        usedCount: room.game.usedNames.length,
        nextPlayer: room.players[room.game.currentPlayerIndex],
        timerDuration: room.game.timerDuration,
        players: room.players
      });

      startServerBombTimer(room);
      callback && callback({ success: true, result: 'correct' });
    } else if (validation.message === 'already-used') {
      // Nom déjà cité
      io.to(socket.roomCode).emit('answer-result', {
        playerId: socket.id,
        playerName: currentPlayer.name,
        result: 'already-used',
        answer,
        nameId: validation.nameId,
        message: 'Déjà cité !'
      });
      callback && callback({ success: true, result: 'already-used' });
    } else {
      // Nom inconnu / invalide
      io.to(socket.roomCode).emit('answer-result', {
        playerId: socket.id,
        playerName: currentPlayer.name,
        result: 'invalid',
        answer,
        message: 'Nom inconnu !'
      });
      callback && callback({ success: true, result: 'invalid' });
    }
  });

  // Bombe explose (timeout)
  socket.on('bomb-explode', () => {
    if (throttle('bomb-explode')) return;
    const room = rooms[socket.roomCode];
    if (!room || room.state !== 'playing') return;
    clearServerBombTimer(room);

    // Seul l'hôte peut déclencher l'explosion (éviter les doublons)
    if (room.host !== socket.id) return;

    // Garde anti-race condition : ignorer si une réponse vient d'être validée
    if (room.game._lastAnswerTime && Date.now() - room.game._lastAnswerTime < 500) return;

    const currentPlayer = room.players[room.game.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.eliminated) return;

    currentPlayer.lives--;

    log.info(`[Explosion] ${currentPlayer.name} — Vies restantes: ${currentPlayer.lives}`);

    if (currentPlayer.lives <= 0) {
      currentPlayer.eliminated = true;

      io.to(socket.roomCode).emit('player-eliminated', {
        player: currentPlayer,
        players: room.players,
        remainingPlayers: room.players.filter(p => !p.eliminated).length
      });

      // Vérifier fin de partie
      const alivePlayers = room.players.filter(p => !p.eliminated);
      if (alivePlayers.length <= 1) {
        endGame(room);
        return;
      }
    }

    io.to(socket.roomCode).emit('bomb-exploded', {
      player: currentPlayer,
      lives: currentPlayer.lives,
      eliminated: currentPlayer.eliminated
    });

    // Passer au joueur suivant
    nextPlayer(room);

    // Nouveau timer
    const timer = room.game.timerConfig;
    room.game.timerDuration = randomBetween(timer.min, timer.max);
    room.game.timerStart = Date.now();
    room.game.round++;

    io.to(socket.roomCode).emit('new-round', {
      currentPlayer: room.players[room.game.currentPlayerIndex],
      round: room.game.round,
      timerDuration: room.game.timerDuration,
      players: room.players
    });
    startServerBombTimer(room);
  });

  // Passer la bombe (après réponse correcte, le timer se reset)
  socket.on('bomb-pass', () => {
    if (throttle('bomb-pass')) return;
    const room = rooms[socket.roomCode];
    if (!room || room.state !== 'playing') return;
    // Only the host can trigger bomb-pass
    if (room.host !== socket.id) return;
    clearServerBombTimer(room);

    const timer = room.game.timerConfig;
    room.game.timerDuration = randomBetween(timer.min, timer.max);
    room.game.timerStart = Date.now();

    io.to(socket.roomCode).emit('bomb-passed', {
      currentPlayer: room.players[room.game.currentPlayerIndex],
      timerDuration: room.game.timerDuration
    });
    startServerBombTimer(room);
  });

  // Pause de la partie (hôte)
  socket.on('pause-game', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id || !room.game) return;

    room.game.paused = !room.game.paused;

    if (room.game.paused) {
      clearServerBombTimer(room);
      // Sauvegarder le temps restant à la pause
      const elapsed = (Date.now() - room.game.timerStart) / 1000;
      room.game._pausedRemaining = Math.max(0, room.game.timerDuration - elapsed);
    } else {
      // Reprendre avec le temps restant
      if (room.game._pausedRemaining !== undefined) {
        room.game.timerDuration = room.game._pausedRemaining;
        room.game.timerStart = Date.now();
        delete room.game._pausedRemaining;
      }
      startServerBombTimer(room);
    }

    io.to(socket.roomCode).emit('game-paused', {
      paused: room.game.paused,
      remaining: room.game.paused ? room.game._pausedRemaining : room.game.timerDuration
    });
  });

  // Kick un joueur (hôte seulement)
  socket.on('kick-player', (data) => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;

    const targetId = data.playerId;
    if (targetId === socket.id) return; // ne pas se kick soi-même

    const targetPlayer = room.players.find(p => p.id === targetId);
    if (!targetPlayer) return;

    // Ajouter aux bannis (par nom pour persister après reconnexion)
    room.kickedNames.push(targetPlayer.name);

    // Si en jeu, ajuster le currentPlayerIndex avant de retirer le joueur
    let wasCurrentTurn = false;
    if (room.state === 'playing' && room.game) {
      clearServerBombTimer(room);
      const kickedIndex = room.players.indexOf(targetPlayer);
      wasCurrentTurn = kickedIndex === room.game.currentPlayerIndex;
      if (kickedIndex !== -1 && kickedIndex < room.game.currentPlayerIndex) {
        room.game.currentPlayerIndex--;
      }
    }

    // Retirer de la liste des joueurs
    room.players = room.players.filter(p => p.id !== targetId);

    // Ajuster l'index si nécessaire après retrait
    if (room.state === 'playing' && room.game && room.players.length > 0) {
      if (room.game.currentPlayerIndex >= room.players.length) {
        room.game.currentPlayerIndex = 0;
      }

      // Vérifier fin de partie
      const alivePlayers = room.players.filter(p => !p.eliminated);
      if (alivePlayers.length <= 1) {
        endGame(room);
      } else {
        // Trouver le prochain joueur actif (skip eliminated/disconnected)
        nextPlayer(room);
        // Relancer un round seulement si c'était le tour du joueur kick
        if (wasCurrentTurn) {
          const timer = room.game.timerConfig;
          room.game.timerDuration = randomBetween(timer.min, timer.max);
          room.game.timerStart = Date.now();
          room.game.round++;
        }
        io.to(socket.roomCode).emit('new-round', {
          currentPlayer: room.players[room.game.currentPlayerIndex],
          round: room.game.round,
          timerDuration: room.game.timerDuration,
          players: room.players,
          reason: 'kick'
        });
        startServerBombTimer(room);
      }
    }

    // Notifier le joueur kick
    const targetSocket = io.sockets.sockets.get(targetId);
    if (targetSocket) {
      targetSocket.emit('kicked-from-room', { message: 'Tu as été exclu de la partie' });
      targetSocket.leave(socket.roomCode);
      targetSocket.roomCode = null;
    }

    // Notifier le reste de la room
    io.to(socket.roomCode).emit('player-kicked', {
      kickedPlayer: targetPlayer,
      players: room.players,
      count: room.players.length
    });

    log.info(`[Kick] ${targetPlayer.name} exclu de Room ${room.code}`);
  });

  // Mettre à jour la visibilité (hôte seulement, lobby seulement)
  socket.on('update-visibility', (data) => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id || room.state !== 'lobby') return;

    const vis = data.visibility;
    if (vis !== 'public' && vis !== 'private') return;

    room.visibility = vis;
    io.to(socket.roomCode).emit('visibility-updated', { visibility: vis });
  });

  // Déconnexion
  socket.on('disconnect', () => {
    log.info(`[Déconnexion] ${socket.id}`);

    const room = rooms[socket.roomCode];
    if (!room) return;

    if (socket.isHost) {
      // L'hôte se déconnecte — marquer comme déconnecté dans les joueurs aussi
      const hostPlayer = room.players.find(p => p.id === socket.id);
      if (hostPlayer) {
        hostPlayer.connected = false;
      }

      io.to(socket.roomCode).emit('host-disconnected', { timeout: 60 });

      // Si en jeu et c'est le tour de l'hôte, passer au suivant
      if (room.state === 'playing' && room.game) {
        clearServerBombTimer(room);
        const currentPlayer = room.players[room.game.currentPlayerIndex];
        if (currentPlayer && currentPlayer.id === socket.id) {
          nextPlayer(room);
          const timer = room.game.timerConfig;
          room.game.timerDuration = randomBetween(timer.min, timer.max);
          room.game.timerStart = Date.now();

          io.to(socket.roomCode).emit('new-round', {
            currentPlayer: room.players[room.game.currentPlayerIndex],
            round: room.game.round,
            timerDuration: room.game.timerDuration,
            players: room.players,
            reason: 'host-disconnect'
          });
        }
        startServerBombTimer(room);
      }

      // Supprimer la room après 60s si l'hôte ne revient pas
      const disconnectedCode = socket.roomCode;
      const disconnectedHostId = socket.id;
      room._destroyTimer = setTimeout(() => {
        if (rooms[disconnectedCode] && rooms[disconnectedCode].host === disconnectedHostId) {
          // Notifier tous les clients restants
          io.to(disconnectedCode).emit('room-closed');
          delete rooms[disconnectedCode]; delete qrCache[disconnectedCode];
          log.info(`[Room supprimée] ${disconnectedCode} (hôte absent 60s)`);
        }
      }, 60000); // 1 minute
    } else if (socket.isSpectator) {
      room.spectators = room.spectators.filter(id => id !== socket.id);
    } else {
      // Joueur se déconnecte
      const player = room.players.find(p => p.id === socket.id);
      if (player) {
        if (room.state === 'lobby') {
          // En lobby : retirer complètement le joueur (pas de fantôme)
          room.players = room.players.filter(p => p.id !== socket.id);

          io.to(socket.roomCode).emit('player-left', {
            players: room.players,
            count: room.players.length
          });

          log.info(`[Déconnexion lobby] ${player.name} retiré de Room ${socket.roomCode}`);
        } else if (room.state === 'playing') {
          // En jeu : marquer comme déconnecté (permet la reconnexion)
          player.connected = false;

          io.to(socket.roomCode).emit('player-disconnected', {
            player,
            players: room.players
          });

          // Si c'est le joueur actif, passer au suivant
          if (room.game) {
            const currentPlayer = room.players[room.game.currentPlayerIndex];
            if (currentPlayer && currentPlayer.id === socket.id) {
              clearServerBombTimer(room);
              nextPlayer(room);
              const timer = room.game.timerConfig;
              room.game.timerDuration = randomBetween(timer.min, timer.max);
              room.game.timerStart = Date.now();

              io.to(socket.roomCode).emit('new-round', {
                currentPlayer: room.players[room.game.currentPlayerIndex],
                round: room.game.round,
                timerDuration: room.game.timerDuration,
                players: room.players,
                reason: 'disconnect'
              });
              startServerBombTimer(room);
            }
          }

          // Grace period : si pas reconnecté en 30s, éliminer le joueur
          const disconnectedPlayerName = player.name;
          const disconnectedRoomCode = socket.roomCode;
          setTimeout(() => {
            const r = rooms[disconnectedRoomCode];
            if (!r || r.state !== 'playing') return;
            const p = r.players.find(pl => pl.name === disconnectedPlayerName);
            if (!p || p.connected || p.eliminated) return;
            // Toujours déconnecté → éliminer
            p.eliminated = true;
            p.lives = 0;
            log.info(`[Timeout] ${disconnectedPlayerName} éliminé (déconnecté >30s) dans ${disconnectedRoomCode}`);
            io.to(disconnectedRoomCode).emit('player-eliminated', {
              player: p,
              players: r.players,
              remainingPlayers: r.players.filter(x => !x.eliminated).length
            });
            const alivePlayers = r.players.filter(x => !x.eliminated);
            if (alivePlayers.length <= 1) {
              endGame(r);
            }
          }, 30000);
        }
      }
    }
  });

  // Joueur quitte la partie volontairement
  socket.on('leave-game', () => {
    const room = rooms[socket.roomCode];
    if (!room) return;
    const code = socket.roomCode;

    // Si c'est l'hôte → détruire la room et notifier tout le monde
    if (socket.isHost) {
      log.info(`[Host Leave] L'hôte a quitté la room ${code} — suppression`);
      clearServerBombTimer(room);
      // D'abord retirer l'hôte de la room pour qu'il ne reçoive plus d'événements
      socket.leave(code);
      socket.roomCode = null;
      socket.isHost = false;
      // Notifier les autres joueurs
      io.to(code).emit('host-left-game');
      // Retirer tous les sockets restants de la room
      const sockets = io.sockets.adapter.rooms.get(code);
      if (sockets) {
        for (const sid of [...sockets]) {
          const s = io.sockets.sockets.get(sid);
          if (s) {
            s.leave(code);
            s.roomCode = null;
          }
        }
      }
      // Annuler le timer de destruction si existant
      if (room._destroyTimer) clearTimeout(room._destroyTimer);
      delete rooms[code]; delete qrCache[code];
      return;
    }

    if (room.state !== 'playing') return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const playerName = player.name;
    const wasCurrentTurn = room.players[room.game.currentPlayerIndex]?.id === socket.id;

    // Clear bomb timer if it was the leaving player's turn
    if (wasCurrentTurn) {
      clearServerBombTimer(room);
    }

    // Retirer le joueur
    room.players = room.players.filter(p => p.id !== socket.id);
    socket.leave(code);

    log.info(`[Leave] ${playerName} a quitté la partie dans la room ${code}`);

    // Notifier les autres
    io.to(code).emit('player-left-game', {
      playerName,
      playerColor: player.color,
      players: room.players
    });

    // Ajuster l'index et vérifier la fin de partie
    if (room.players.length > 0 && room.game) {
      if (room.game.currentPlayerIndex >= room.players.length) {
        room.game.currentPlayerIndex = 0;
      }

      const alivePlayers = room.players.filter(p => !p.eliminated);
      if (alivePlayers.length <= 1) {
        // Un seul joueur restant → fin de partie
        endGame(room);
        return;
      }

      if (wasCurrentTurn) {
        // Skip eliminated/disconnected players
        let tries = 0;
        while ((room.players[room.game.currentPlayerIndex]?.eliminated || !room.players[room.game.currentPlayerIndex]?.connected) && tries < room.players.length) {
          room.game.currentPlayerIndex = (room.game.currentPlayerIndex + 1) % room.players.length;
          tries++;
        }
        const timer = room.game.timerConfig;
        room.game.timerDuration = randomBetween(timer.min, timer.max);
        room.game.timerStart = Date.now();
        room.game.round++;
        io.to(code).emit('new-round', {
          currentPlayer: room.players[room.game.currentPlayerIndex],
          round: room.game.round,
          timerDuration: room.game.timerDuration,
          players: room.players,
          reason: 'player-left'
        });
        startServerBombTimer(room);
      }
    }
  });

  // Vérifier si la room existe encore (utilisé par les joueurs en attente de replay)
  socket.on('check-replay', (callback) => {
    if (typeof callback !== 'function') return;
    const room = rooms[socket.roomCode];
    callback({ alive: !!room });
  });

  // Rejouer — l'hôte remet la room en lobby
  socket.on('replay-game', () => {
    log.info(`[Replay] replay-game reçu de ${socket.id}, roomCode=${socket.roomCode}, isHost=${socket.isHost}`);
    const code = socket.roomCode;
    const room = rooms[code];
    if (!room) {
      log.info(`[Replay] Room ${code} n'existe pas`);
      socket.emit('replay-error', { message: 'Salon introuvable' });
      return;
    }
    if (!socket.isHost) {
      log.info(`[Replay] Socket ${socket.id} n'est pas l'hôte`);
      socket.emit('replay-error', { message: "Seul l'hôte peut relancer" });
      return;
    }

    // Guard: only allow replay from ended state
    if (room.state !== 'ended') {
      log.info(`[Replay] Room ${code} state=${room.state}, pas ended — ignoré`);
      socket.emit('replay-error', { message: 'La partie n\'est pas terminée' });
      return;
    }

    // Clear any remaining bomb timer
    clearServerBombTimer(room);

    // Reset la room en lobby
    room.state = 'lobby';
    room.game = null;

    // Reset les joueurs (garder les connectés, retirer les déconnectés)
    // L'hôte est toujours prêt (il contrôle le démarrage)
    room.players = room.players.filter(p => p.connected !== false).map(p => ({
      ...p,
      ready: p.isHost ? true : false,
      lives: room.config.lives,
      score: 0,
      namesUsed: [],
      eliminated: false,
      jokersRemaining: room.config.jokers || 0
    }));

    log.info(`[Replay] Room ${code} remise en lobby avec ${room.players.length} joueurs`);

    io.to(code).emit('replay-lobby', {
      players: room.players,
      config: room.config,
      code: code
    });
  });

  // Player typing — broadcast to ALL others in room
  socket.on('player-typing', (data) => {
    const room = rooms[socket.roomCode];
    if (!room || room.state !== 'playing') return;
    const currentPlayer = room.players[room.game.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.id !== socket.id) {
      log.info(`[Typing REJECTED] socket=${socket.id} expected=${currentPlayer?.id} name=${currentPlayer?.name}`);
      return;
    }
    socket.to(socket.roomCode).emit('player-typing', {
      text: (data.text || '').substring(0, 40),
      playerId: socket.id
    });
  });

  // Utiliser un joker — renvoie un indice (nom français + catégorie)
  socket.on('use-joker', (callback) => {
    if (throttle('use-joker')) return;
    const room = rooms[socket.roomCode];
    if (!room || room.state !== 'playing' || !room.game) {
      return callback && callback({ success: false, message: 'Partie non en cours' });
    }

    const currentPlayer = room.players[room.game.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.id !== socket.id) {
      return callback && callback({ success: false, message: 'Ce n\'est pas ton tour' });
    }

    const player = room.players.find(p => p.id === socket.id);
    if (!player || player.jokersRemaining <= 0) {
      return callback && callback({ success: false, message: 'Plus de jokers' });
    }

    // Trouver un nom non encore cité
    const usedIds = room.game.usedNames;
    const available = ASMA_UL_HUSNA.filter(n => !usedIds.includes(n.id));
    if (available.length === 0) {
      return callback && callback({ success: false, message: 'Tous les noms sont déjà cités' });
    }

    const hint = available[Math.floor(Math.random() * available.length)];
    player.jokersRemaining--;

    log.info(`[Joker] ${player.name} utilise un joker — indice: ${hint.french} (${hint.category}) — restants: ${player.jokersRemaining}`);

    callback && callback({
      success: true,
      french: hint.french,
      category: hint.category,
      jokersRemaining: player.jokersRemaining
    });
  });

  // Chat / messages
  socket.on('chat-message', (data) => {
    if (throttle('chat-message')) return;
    const room = rooms[socket.roomCode];
    if (!room) return;

    io.to(socket.roomCode).emit('chat-message', {
      from: sanitizeHtml(socket.playerName || 'Spectateur'),
      message: sanitizeHtml((data.message || '').substring(0, 200)),
      timestamp: Date.now()
    });
  });

});

// ==========================================================================
// ILM QUEST — Dedicated /iq namespace (isolated from main app socket)
// ==========================================================================
const iqNsp = io.of('/iq');
iqNsp.on('connection', (socket) => {
  log.info('[IQ Socket] New /iq connection:', socket.id);

  socket.on('iq-join', (data, callback) => {
    const code = (data.code || '').toUpperCase().trim();
    const room = iqRooms[code];
    if (!room) { if (callback) callback({ error: 'Room introuvable' }); return; }
    // Allow join/rejoin at any state (needed for reconnection during gameplay)
    // New player prevention is handled by the REST /join endpoint

    socket.iqRoom = code;
    socket.iqPlayerId = data.playerId;
    socket.iqPlayerName = data.playerName;
    socket.iqIsHost = !!data.isHost;
    socket.join('iq-' + code);

    log.info(`[IQ Socket] ${data.playerName} joined iq-${code} (host: ${data.isHost}, state: ${room.state})`);
    if (callback) callback({ success: true });
  });

  socket.on('iq-broadcast', (data) => {
    if (!socket.iqRoom) return;
    socket.to('iq-' + socket.iqRoom).emit('iq-message', data);
  });

  socket.on('iq-leave', () => {
    if (socket.iqRoom) {
      socket.leave('iq-' + socket.iqRoom);
      log.info(`[IQ Socket] ${socket.iqPlayerName || socket.id} left iq-${socket.iqRoom}`);
      socket.iqRoom = null;
    }
  });

  socket.on('disconnect', () => {
    if (socket.iqRoom) {
      if (socket.iqIsHost) {
        iqNsp.to('iq-' + socket.iqRoom).emit('iq-message', { type: 'host-left' });
        if (iqRooms[socket.iqRoom]) {
          delete iqRooms[socket.iqRoom];
          log.info(`[IQ Socket] Host disconnected, room ${socket.iqRoom} deleted`);
        }
      } else {
        iqNsp.to('iq-' + socket.iqRoom).emit('iq-message', {
          type: 'player-left-game',
          playerId: socket.iqPlayerId,
          playerName: socket.iqPlayerName
        });
        const room = iqRooms[socket.iqRoom];
        if (room) {
          room.players = room.players.filter(p => p.id !== socket.iqPlayerId);
          room.playerCount = room.players.length;
          room.updatedAt = Date.now();
        }
      }
    }
  });
});

// --- Validation serveur des réponses (imported from lib/validation.js) ---
// Wrapper: pass ASMA_UL_HUSNA automatically
function serverValidateAnswer(input, usedNames) {
  return _serverValidateAnswer(input, usedNames, ASMA_UL_HUSNA);
}

// --- Fonctions utilitaires ---

function nextPlayer(room) {
  const activePlayers = room.players.filter(p => !p.eliminated && p.connected);
  if (activePlayers.length === 0) return;

  let nextIndex = room.game.currentPlayerIndex;
  do {
    nextIndex = (nextIndex + 1) % room.players.length;
  } while (
    (room.players[nextIndex].eliminated || !room.players[nextIndex].connected) &&
    nextIndex !== room.game.currentPlayerIndex
  );

  room.game.currentPlayerIndex = nextIndex;
}

function endGame(room) {
  clearServerBombTimer(room);
  room.state = 'ended';

  // Calculer le classement
  const ranking = [...room.players].sort((a, b) => {
    if (a.eliminated && !b.eliminated) return 1;
    if (!a.eliminated && b.eliminated) return -1;
    return b.score - a.score;
  });

  // Détecter les égalités
  const isTie = ranking.length >= 2 && ranking[0].score === ranking[1].score;

  io.to(room.code).emit('game-over', {
    ranking,
    isTie,
    usedNames: room.game.usedNames,
    usedCount: room.game.usedNames.length,
    totalRounds: room.game.round
  });

  log.info(`[Fin de partie] Room ${room.code} — ${room.game.usedNames.length}/99 noms cités${isTie ? ' (égalité)' : ''}`);
}

function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function generatePlayerColor(index) {
  const colors = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12',
    '#9b59b6', '#1abc9c', '#e67e22', '#e91e63'
  ];
  return colors[index % colors.length];
}

// Cache QR code par room
const qrCache = {};

async function getQRCode(code) {
  if (qrCache[code]) return qrCache[code];
  const url = `http://${LOCAL_IP}:${PORT}/join/${code}`;
  const qr = await QRCode.toDataURL(url, {
    width: 300, margin: 2, color: QR_COLORS
  });
  qrCache[code] = { qr, url };
  return qrCache[code];
}

// --- Bug / Content Report ---
// --- Report rate limiting (par IP) ---
const reportRateMap = new Map();
const REPORT_MAX = 3;           // max 3 signalements
const REPORT_WINDOW = 15 * 60 * 1000; // par fenêtre de 15 minutes

function isReportRateLimited(ip) {
  const now = Date.now();
  const entry = reportRateMap.get(ip);
  if (!entry || now - entry.start > REPORT_WINDOW) {
    reportRateMap.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > REPORT_MAX;
}

// Nettoyage périodique de la map (toutes les 30 min)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of reportRateMap) {
    if (now - entry.start > REPORT_WINDOW) reportRateMap.delete(ip);
  }
}, 30 * 60 * 1000);

// --- Email transporter (Gmail) ---
const REPORT_EMAIL = process.env.REPORT_EMAIL;
const REPORT_EMAIL_PASSWORD = process.env.REPORT_EMAIL_PASSWORD;
let mailTransporter = null;

if (REPORT_EMAIL && REPORT_EMAIL_PASSWORD) {
  mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: REPORT_EMAIL, pass: REPORT_EMAIL_PASSWORD }
  });
  mailTransporter.verify((err) => {
    if (err) log.error('[Mail] Connexion Gmail échouée :', err.message);
    else log.info('[Mail] Connexion Gmail OK —', REPORT_EMAIL);
  });
} else {
  log.warn('[Mail] REPORT_EMAIL ou REPORT_EMAIL_PASSWORD manquant dans .env — les signalements seront sauvegardés localement uniquement.');
}

const REPORT_TYPE_LABELS = { bug: 'Bug technique', content: 'Erreur de contenu', suggestion: 'Suggestion' };

app.post('/api/report', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  if (isReportRateLimited(ip)) {
    return res.status(429).json({ error: 'Trop de signalements. Réessaie dans quelques minutes.' });
  }
  const { type, page, description } = req.body;
  if (!description || typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ error: 'Description requise' });
  }
  const allowed = ['bug', 'content', 'suggestion'];
  const safeType = allowed.includes(type) ? type : 'bug';
  const safePage = typeof page === 'string' ? sanitizeHtml(page.slice(0, 100)) : '';
  const safeDesc = sanitizeHtml(description.trim().slice(0, 1000));

  const report = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    type: safeType,
    page: safePage,
    description: safeDesc,
    date: new Date().toISOString(),
    userAgent: (req.headers['user-agent'] || '').slice(0, 200)
  };

  // Sauvegarde locale (backup)
  const reportsDir = path.join(__dirname, 'data', 'reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
  const reportsFile = path.join(reportsDir, 'reports.json');
  let reports = [];
  try { reports = JSON.parse(fs.readFileSync(reportsFile, 'utf8')); } catch {}
  reports.push(report);
  fs.writeFileSync(reportsFile, JSON.stringify(reports, null, 2), 'utf8');

  // Envoi email
  if (mailTransporter) {
    const typeLabel = REPORT_TYPE_LABELS[safeType] || safeType;
    const typeEmoji = safeType === 'bug' ? '\uD83D\uDC1B' : safeType === 'content' ? '\uD83D\uDCD6' : '\uD83D\uDCA1';
    try {
      await mailTransporter.sendMail({
        from: `"Al-Asmaa Reports" <${REPORT_EMAIL}>`,
        to: REPORT_EMAIL,
        subject: `${typeEmoji} [Al-Asmaa] ${typeLabel}${safePage ? ' — ' + safePage : ''}`,
        html: `
          <div style="font-family: -apple-system, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; background: #0a0e1a; color: #eae6df; border-radius: 16px; overflow: hidden; border: 1px solid rgba(212,162,76,0.15);">
            <div style="background: linear-gradient(135deg, #1a1400, #0a0e1a); padding: 24px 28px 18px; border-bottom: 1px solid rgba(212,162,76,0.12);">
              <div style="font-size: 22px; margin-bottom: 4px;">${typeEmoji}</div>
              <h2 style="margin: 0 0 4px; color: #f0cc7a; font-size: 18px;">${typeLabel}</h2>
              <div style="font-size: 12px; color: #9a978f;">#${report.id} &mdash; ${new Date(report.date).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</div>
            </div>
            <div style="padding: 22px 28px;">
              ${safePage ? `<div style="margin-bottom: 14px;"><div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #d4a24c; margin-bottom: 4px;">Page / Section</div><div style="font-size: 14px; color: #eae6df; background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">${safePage}</div></div>` : ''}
              <div style="margin-bottom: 14px;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #d4a24c; margin-bottom: 4px;">Description</div>
                <div style="font-size: 14px; line-height: 1.6; color: #eae6df; background: rgba(255,255,255,0.04); padding: 12px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); white-space: pre-wrap;">${safeDesc}</div>
              </div>
              <div style="font-size: 11px; color: #5c5952; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 12px; margin-top: 8px;">
                <strong>User-Agent :</strong> ${report.userAgent || 'N/A'}
              </div>
            </div>
          </div>
        `
      });
      log.info(`[Report] Email envoyé — ${safeType} — ${safePage || '(aucune page)'}`);
    } catch (mailErr) {
      log.error('[Report] Erreur email :', mailErr.message);
    }
  }

  log.info(`[Report] ${safeType} — ${safePage || '(aucune page)'} — ${safeDesc.slice(0, 60)}...`);
  res.json({ success: true, id: report.id });
});

// Health check
app.get('/api/health', (req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    rooms: Object.keys(rooms).length,
    iqRooms: Object.keys(iqRooms).length,
    connectedSockets: io.engine.clientsCount || 0,
    memory: {
      rss: Math.round(mem.rss / 1024 / 1024),
      heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotal: Math.round(mem.heapTotal / 1024 / 1024)
    },
    version: '2.0.0',
    env: NODE_ENV
  });
});

// --- Middleware 404 catch-all (DOIT être après toutes les routes) ---
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// --- Error handler 500 ---
app.use((err, req, res, next) => {
  log.error('[Erreur 500]', err.stack || err.message);
  res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
});

// Lancer le serveur avec détection de port occupé
const HOST = process.env.HOST || '0.0.0.0';
const MAX_PORT_RETRIES = 10;

function isPortInUse(port) {
  return new Promise((resolve) => {
    const socket = new (require('net').Socket)();
    socket.setTimeout(300);
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('timeout', () => { socket.destroy(); resolve(false); });
    socket.once('error', () => { socket.destroy(); resolve(false); });
    socket.connect(port, '127.0.0.1');
  });
}

async function findFreePort(startPort) {
  for (let port = startPort; port < startPort + MAX_PORT_RETRIES; port++) {
    if (!(await isPortInUse(port))) return port;
    log.warn(`[Port] ${port} déjà utilisé, tentative sur ${port + 1}...`);
  }
  return null;
}

(async () => {
  const freePort = await findFreePort(PORT);
  if (!freePort) {
    log.error(`[Erreur] Aucun port libre entre ${PORT} et ${PORT + MAX_PORT_RETRIES - 1}.`);
    log.error('[Erreur] Fermez les autres serveurs ou utilisez PORT=XXXX node server.js');
    process.exit(1);
  }

  server.on('error', (err) => {
    log.error('[Erreur serveur]', err.message);
    process.exit(1);
  });

  server.listen(freePort, HOST, () => {
    const pad = (s, len) => s + ' '.repeat(Math.max(0, len - s.length));
    log.always('');
    log.always('  ╔══════════════════════════════════════════╗');
    log.always('  ║         AL-ASMAA — Serveur               ║');
    log.always('  ╠══════════════════════════════════════════╣');
    log.always(`  ║  ${pad(`Local:    http://localhost:${freePort}`, 40)}║`);
    log.always(`  ║  ${pad(`Réseau:   http://${LOCAL_IP}:${freePort}`, 40)}║`);
    log.always(`  ║  ${pad(`Mode:     ${NODE_ENV}`, 40)}║`);
    log.always('  ║                                          ║');
    log.always('  ║  Partagez l\'URL réseau pour que les      ║');
    log.always('  ║  autres joueurs rejoignent sur le        ║');
    log.always('  ║  même réseau WiFi.                       ║');
    log.always('  ╚══════════════════════════════════════════╝');
    if (freePort !== PORT) {
      log.always(`  ⚠  Le port ${PORT} était occupé — lancé sur ${freePort}`);
    }
    log.always('');
  });
})();

// Graceful shutdown
function gracefulShutdown(signal) {
  log.always(`\n[${signal}] Arrêt en cours...`);
  saveLeaderboard();
  // Notifier tous les clients
  for (const code of Object.keys(rooms)) {
    io.to(code).emit('server-shutdown', { message: 'Le serveur s\'arrête' });
  }
  io.close(() => {
    server.close(() => {
      log.always('[Serveur] Arrêté proprement.');
      process.exit(0);
    });
  });
  // Forcer l'arrêt après 5s
  setTimeout(() => process.exit(1), 5000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
