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

// --- Sanitization XSS ---
function sanitizeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Charger les données des 99 noms (sans vm.runInNewContext pour la sécurité)
let ASMA_UL_HUSNA = [];
try {
  const namesCode = fs.readFileSync(path.join(__dirname, 'public', 'data', 'names.js'), 'utf-8');
  // Le fichier utilise la syntaxe JS (clés non quotées), on utilise Function
  // Sûr ici car c'est un fichier local contrôlé par le développeur
  const fn = new Function(namesCode + '; return ASMA_UL_HUSNA;');
  ASMA_UL_HUSNA = fn();
  console.log(`[Names] ${ASMA_UL_HUSNA.length} noms chargés`);
} catch (err) {
  console.error('[Names] Erreur chargement names.js:', err.message);
}

// --- Constantes ---
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_DEV = NODE_ENV === 'development';
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
      console.log(`[IQ Cleanup] Room ${code} supprimée (lobby inactif >15min)`);
    }
    // Autres états inactifs >2h
    else if (age > 2 * 60 * 60 * 1000) {
      delete iqRooms[code];
      console.log(`[IQ Cleanup] Room ${code} supprimée (inactive >2h)`);
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
      console.log(`[Cleanup] Room ${code} supprimée (lobby inactif >1h)`);
    }
    // Partie ended/finished depuis >30min ou playing depuis >3h (zombie)
    else if ((room.state === 'finished' || room.state === 'ended') && age > 30 * 60 * 1000) {
      delete rooms[code]; delete qrCache[code];
      console.log(`[Cleanup] Room ${code} supprimée (${room.state} >30min)`);
    }
    else if (room.state === 'playing' && age > 3 * 60 * 60 * 1000) {
      io.to(code).emit('room-closed');
      delete rooms[code]; delete qrCache[code];
      console.log(`[Cleanup] Room ${code} supprimée (playing zombie >3h)`);
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
  console.log(`[IQ] Room ${roomCode} créée par ${hostName} (${visibility})`);
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
    console.log(`[IQ] ${player.name} rejoint ${code} (${room.players.length} joueurs)`);
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
    console.log(`[IQ GET /players] ${code}: state=playing, sending ${room.questions.length} questions`);
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
    console.log(`[IQ PATCH] Room ${code} NOT FOUND`);
    return res.status(404).json({ error: 'Room introuvable' });
  }
  const allowed = ['state', 'playerCount', 'visibility', 'questions', 'difficulty', 'targetScore'];
  const updated = [];
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      room[key] = req.body[key];
      updated.push(key + (key === 'questions' ? '(' + req.body[key].length + ')' : '=' + req.body[key]));
    }
  }
  room.updatedAt = Date.now();
  console.log(`[IQ PATCH] Room ${code}: ${updated.join(', ')}`);
  res.json({ success: true });
});

app.delete('/api/iq-rooms/:code', (req, res) => {
  const code = (req.params.code || '').toUpperCase().trim();
  if (iqRooms[code]) {
    delete iqRooms[code];
    console.log(`[IQ] Room ${code} supprimée`);
  }
  res.json({ success: true });
});

// sendBeacon uses POST, not DELETE
app.post('/api/iq-rooms/:code/close', (req, res) => {
  const code = (req.params.code || '').toUpperCase().trim();
  if (iqRooms[code]) {
    delete iqRooms[code];
    console.log(`[IQ] Room ${code} fermée (beacon)`);
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

  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap">
  <link rel="stylesheet" href="/css/style.css?v=15.0">
  <link rel="stylesheet" href="/css/animations.css?v=15.0">
  <style>
    .seo-page { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; min-height: 100vh; }
    .seo-page h1 { color: var(--gold); font-size: 2rem; margin-bottom: 1rem; }
    .seo-page h2 { color: var(--gold-light); font-size: 1.4rem; margin: 2rem 0 0.8rem; }
    .seo-page p, .seo-page li { color: var(--text-secondary); line-height: 1.7; }
    .seo-page a { color: var(--gold); text-decoration: underline; }
    .seo-page .breadcrumb { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem; }
    .seo-page .breadcrumb a { color: var(--gold); text-decoration: none; }
    .seo-page .back-home { display: inline-block; margin-top: 2rem; padding: 0.7rem 1.5rem;
      background: var(--gold); color: var(--bg-deep); border-radius: 8px; text-decoration: none; font-weight: 600; }
    .name-card-seo { background: var(--bg-glass); border: 1px solid var(--border-subtle);
      border-radius: 12px; padding: 1.5rem; margin: 1rem 0; }
    .name-card-seo .arabic { font-size: 2.5rem; text-align: center; color: var(--gold);
      font-family: 'Amiri', serif; direction: rtl; margin-bottom: 0.5rem; }
    .name-card-seo .translit { text-align: center; font-size: 1.3rem; color: var(--text-primary); }
    .name-card-seo .meaning { text-align: center; font-size: 1rem; color: var(--gold-light); margin-top: 0.3rem; }
    .names-table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
    .names-table th { background: var(--bg-glass); color: var(--gold); padding: 0.8rem; text-align: left;
      border-bottom: 2px solid var(--gold); }
    .names-table td { padding: 0.7rem 0.8rem; border-bottom: 1px solid var(--border-subtle); }
    .names-table td:nth-child(2) { font-family: 'Amiri', serif; font-size: 1.3rem; direction: rtl; text-align: right; color: var(--gold); }
    .names-table tr:hover { background: rgba(212,162,76,0.05); }
    .names-table a { color: var(--text-primary); text-decoration: none; }
    .names-table a:hover { color: var(--gold); }

    /* ========== Legal Pages Premium ========== */
    .seo-page:has(.legal-hero) { max-width: 1060px; }
    .legal-hero { position: relative; text-align: center; padding: 3.5rem 2rem 2.5rem; margin: -2rem -1.5rem 0;
      background: linear-gradient(180deg, rgba(212,162,76,0.07) 0%, transparent 100%);
      border-bottom: 1px solid var(--border-card); overflow: hidden; }
    .legal-hero::before { content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse at 50% 0%, rgba(212,162,76,0.12) 0%, transparent 70%); pointer-events: none; }
    .legal-star { display: block; margin: 0 auto 1.25rem; width: 48px; height: 48px;
      animation: legalStarGlow 4s ease-in-out infinite; }
    @keyframes legalStarGlow {
      0%, 100% { opacity: 0.45; filter: drop-shadow(0 0 6px rgba(212,162,76,0.15)); }
      50% { opacity: 0.85; filter: drop-shadow(0 0 16px rgba(212,162,76,0.45)); } }
    .legal-hero h1 { font-family: var(--font-display); font-size: 2.6rem; font-weight: 700; margin: 0 0 0.75rem;
      background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 50%, var(--gold-deep) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.25; }
    .legal-hero-date { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.78rem;
      color: var(--text-muted); padding: 0.3rem 0.85rem; background: var(--bg-glass);
      border: 1px solid var(--border-subtle); border-radius: var(--radius-pill); backdrop-filter: blur(8px); }
    .legal-breadcrumb { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1.5rem; position: relative; z-index: 1; }
    .legal-breadcrumb a { color: var(--gold); text-decoration: none; transition: color 0.2s; }
    .legal-breadcrumb a:hover { color: var(--gold-light); }

    /* TOC */
    .legal-toc { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius);
      padding: 1.5rem 2rem; margin: 2rem 0 2.5rem; box-shadow: var(--shadow-card); }
    .legal-toc-title { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em;
      color: var(--gold); margin: 0 0 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
    .legal-toc-title svg { width: 14px; height: 14px; stroke: var(--gold); }
    .legal-toc-grid { list-style: none; padding: 0; margin: 0;
      display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.35rem; }
    .legal-toc-grid a { display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.6rem;
      font-size: 0.8rem; color: var(--text-secondary); text-decoration: none;
      border-radius: var(--radius-sm); transition: all 0.2s ease; }
    .legal-toc-grid a:hover { color: var(--gold-light); background: rgba(212,162,76,0.06); transform: translateX(3px); }
    .legal-toc-n { display: inline-flex; align-items: center; justify-content: center;
      min-width: 20px; height: 20px; font-size: 0.65rem; font-weight: 700;
      color: var(--gold); background: rgba(212,162,76,0.1); border-radius: 5px; flex-shrink: 0; }

    /* Sections */
    .legal-section { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius);
      padding: 2rem 2.5rem; margin-bottom: 1.25rem; box-shadow: var(--shadow-card);
      opacity: 0; transform: translateY(20px);
      transition: opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1); }
    .legal-section.is-visible { opacity: 1; transform: none; }
    .legal-section-head { display: flex; align-items: center; gap: 0.75rem;
      margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle); }
    .legal-section-n { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px;
      font-size: 0.8rem; font-weight: 700; color: var(--bg-deep);
      background: linear-gradient(135deg, var(--gold-light), var(--gold)); border-radius: 8px;
      flex-shrink: 0; box-shadow: 0 2px 8px rgba(212,162,76,0.25); }
    .legal-section h2 { font-family: var(--font-display); font-size: 1.2rem; font-weight: 600;
      color: var(--text-primary); margin: 0; line-height: 1.3; }
    .legal-section p { color: var(--text-secondary); font-size: 0.92rem; line-height: 1.8; margin: 0.6rem 0 0; }
    .legal-section p:first-of-type { margin-top: 0; }
    .legal-section strong { color: var(--text-primary); font-weight: 600; }
    .legal-section em { color: var(--text-muted); }
    .legal-section a { color: var(--gold); text-decoration: underline; text-underline-offset: 2px; transition: color 0.2s; }
    .legal-section a:hover { color: var(--gold-light); }
    .legal-section code { font-size: 0.8rem; padding: 0.12rem 0.4rem; background: rgba(212,162,76,0.08);
      border: 1px solid var(--border-subtle); border-radius: 4px; color: var(--gold-light); }

    /* Lists */
    .legal-ul { list-style: none; padding: 0; margin: 0.6rem 0 0; }
    .legal-ul li { position: relative; padding: 0.45rem 0 0.45rem 1.4rem;
      color: var(--text-secondary); font-size: 0.86rem; line-height: 1.7; }
    .legal-ul li::before { content: ''; position: absolute; left: 0.1rem; top: 0.95rem;
      width: 5px; height: 5px; background: var(--gold); border-radius: 50%; opacity: 0.5; }
    .legal-ul li strong { color: var(--text-primary); }

    /* Shield list (privacy positive) */
    .legal-shield li { padding-left: 1.75rem; }
    .legal-shield li::before { content: '\\2713'; width: 18px; height: 18px;
      background: rgba(45,212,160,0.1); color: var(--emerald); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.6rem; font-weight: 700; top: 0.55rem; left: 0; }

    /* Highlight box */
    .legal-highlight { background: rgba(212,162,76,0.05); border-left: 3px solid var(--gold);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0; padding: 1rem 1.25rem; margin: 0.75rem 0 0; }
    .legal-highlight p { margin: 0; font-size: 0.85rem; }

    /* Cross navigation */
    .legal-cross { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;
      margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid var(--border-subtle); }
    .legal-cross a { display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
      padding: 1.2rem 0.75rem; background: var(--bg-card); border: 1px solid var(--border-subtle);
      border-radius: var(--radius); text-decoration: none; transition: all var(--transition); text-align: center; }
    .legal-cross a:hover { border-color: var(--border-active); background: var(--bg-card-hover);
      transform: translateY(-3px); box-shadow: var(--shadow-gold); }
    .legal-cross-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
      background: rgba(212,162,76,0.08); border-radius: 10px; padding: 7px; }
    .legal-cross-icon svg { width: 100%; height: 100%; stroke: var(--gold); fill: none;
      stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
    .legal-cross-label { font-size: 0.78rem; font-weight: 600; color: var(--text-primary); }
    .legal-cross-sub { font-size: 0.68rem; color: var(--text-muted); }
    .legal-cross .is-current { opacity: 0.35; pointer-events: none; border-style: dashed; }

    /* Back button */
    .legal-back { display: inline-flex; align-items: center; gap: 0.5rem;
      margin-top: 1.5rem; padding: 0.75rem 1.75rem;
      background: linear-gradient(135deg, var(--gold), var(--gold-deep));
      color: var(--bg-deep); font-weight: 600; font-size: 0.88rem;
      border-radius: var(--radius-pill); text-decoration: none;
      box-shadow: var(--shadow-gold); transition: all var(--transition); }
    .legal-back:hover { transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(212,162,76,0.35); filter: brightness(1.1); }
    .legal-back svg { width: 16px; height: 16px; }

    /* Responsive */
    @media (max-width: 768px) {
      .legal-hero { padding: 2rem 1rem 1.5rem; margin: -2rem -1.5rem 0; }
      .legal-hero h1 { font-size: 1.7rem; }
      .legal-toc { padding: 1rem 1.15rem; }
      .legal-toc-grid { grid-template-columns: 1fr; }
      .legal-section { padding: 1.25rem; margin-bottom: 0.75rem; }
      .legal-section h2 { font-size: 1rem; }
      .legal-section p { font-size: 0.86rem; }
      .legal-section-n { width: 26px; height: 26px; font-size: 0.72rem; }
      .legal-cross { grid-template-columns: 1fr; }
    }
    @media (prefers-reduced-motion: reduce) {
      .legal-section { opacity: 1; transform: none; transition: none; }
      .legal-star { animation: none; opacity: 0.6; }
    }
  </style>
</head>
<body>
  <div class="bg-pattern"></div>
  <div class="seo-page">`;
}

function seoPageFoot(jsonLd = '') {
  return `
    <a href="/" class="back-home">Retour au jeu</a>
    <footer style="margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--border-subtle);font-size:0.75rem;color:var(--text-muted);line-height:1.8;">
      <nav aria-label="Liens légaux" style="display:flex;gap:1.2rem;flex-wrap:wrap;">
        <a href="/mentions-legales" style="color:var(--text-muted);text-decoration:none;">Mentions légales</a>
        <a href="/politique-de-confidentialite" style="color:var(--text-muted);text-decoration:none;">Confidentialité</a>
        <a href="/conditions-utilisation" style="color:var(--text-muted);text-decoration:none;">CGU</a>
        <a href="/encyclopedie" style="color:var(--text-muted);text-decoration:none;">Les 99 Noms</a>
        <a href="/guide" style="color:var(--text-muted);text-decoration:none;">Guide</a>
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

    <footer style="margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--border-subtle);text-align:center;font-size:0.72rem;color:var(--text-muted);line-height:1.8;">
      <nav aria-label="Liens l\u00e9gaux" style="display:flex;gap:1.2rem;flex-wrap:wrap;justify-content:center;margin-bottom:0.5rem;">
        <a href="/mentions-legales" style="color:var(--text-muted);text-decoration:none;">Mentions l\u00e9gales</a>
        <a href="/politique-de-confidentialite" style="color:var(--text-muted);text-decoration:none;">Confidentialit\u00e9</a>
        <a href="/conditions-utilisation" style="color:var(--text-muted);text-decoration:none;">CGU</a>
        <a href="/encyclopedie" style="color:var(--text-muted);text-decoration:none;">Les 99 Noms</a>
        <a href="/guide" style="color:var(--text-muted);text-decoration:none;">Guide</a>
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
  <script src="/js/background.js?v=15.0"></script>
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

// --- API : Leaderboard (en mémoire) ---
const leaderboard = { quiz: [], daily: [] };
const MAX_LEADERBOARD = 50;

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
        <li><a href="#ml6"><span class="legal-toc-n">6</span>Droit applicable</a></li>
      </ul>
    </nav>

    <section class="legal-section" id="ml1">
      <div class="legal-section-head">
        <span class="legal-section-n">1</span>
        <h2>Éditeur du site</h2>
      </div>
      <p>
        <strong>Al-Asmaa</strong> est un projet éducatif personnel, gratuit et sans but lucratif,
        créé et développé par <strong>Wazko</strong>.
      </p>
      <p>Contact : <em>contact [at] al-asmaa.app</em></p>
    </section>

    <section class="legal-section" id="ml2">
      <div class="legal-section-head">
        <span class="legal-section-n">2</span>
        <h2>Hébergement</h2>
      </div>
      <p>
        Le site est hébergé par le service choisi par le développeur. Les informations
        d'hébergement précises peuvent être obtenues en contactant l'éditeur.
      </p>
    </section>

    <section class="legal-section" id="ml3">
      <div class="legal-section-head">
        <span class="legal-section-n">3</span>
        <h2>Propriété intellectuelle</h2>
      </div>
      <p>
        Le code source de l'application Al-Asmaa est un projet personnel. Les textes coraniques
        et les hadiths cités sur ce site sont issus des sources islamiques authentiques et
        appartiennent au patrimoine commun de la Oumma.
      </p>
      <p>
        Les données encyclopédiques (significations, commentaires savants, hadiths) sont compilées
        à partir de sources classiques de la tradition islamique et sont proposées dans un but
        purement éducatif et de vulgarisation.
      </p>
    </section>

    <section class="legal-section" id="ml4">
      <div class="legal-section-head">
        <span class="legal-section-n">4</span>
        <h2>Limitation de responsabilité</h2>
      </div>
      <p>
        Al-Asmaa est fourni &laquo;&nbsp;en l'état&nbsp;&raquo;, sans garantie d'aucune sorte. Le développeur s'efforce
        de fournir des informations exactes mais ne peut garantir l'exactitude, l'exhaustivité
        ou l'actualité des contenus. L'utilisateur est invité à vérifier les informations
        auprès de sources savantes reconnues.
      </p>
    </section>

    <section class="legal-section" id="ml5">
      <div class="legal-section-head">
        <span class="legal-section-n">5</span>
        <h2>Données personnelles</h2>
      </div>
      <p>
        Pour toute question relative à vos données personnelles, consultez notre
        <a href="/politique-de-confidentialite">Politique de Confidentialité</a>.
      </p>
    </section>

    <section class="legal-section" id="ml6">
      <div class="legal-section-head">
        <span class="legal-section-n">6</span>
        <h2>Droit applicable</h2>
      </div>
      <p>
        Les présentes mentions légales sont soumises au droit français. En cas de litige,
        les tribunaux français seront seuls compétents.
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
        <li><a href="#pc4"><span class="legal-toc-n">4</span>Cookies et stockage local</a></li>
        <li><a href="#pc5"><span class="legal-toc-n">5</span>Service Worker</a></li>
        <li><a href="#pc6"><span class="legal-toc-n">6</span>Partage avec des tiers</a></li>
        <li><a href="#pc7"><span class="legal-toc-n">7</span>Sécurité</a></li>
        <li><a href="#pc8"><span class="legal-toc-n">8</span>Droits des utilisateurs</a></li>
        <li><a href="#pc9"><span class="legal-toc-n">9</span>Mineurs</a></li>
        <li><a href="#pc10"><span class="legal-toc-n">10</span>Modifications</a></li>
      </ul>
    </nav>

    <section class="legal-section" id="pc1">
      <div class="legal-section-head">
        <span class="legal-section-n">1</span>
        <h2>Qui sommes-nous ?</h2>
      </div>
      <p>
        <strong>Al-Asmaa</strong> est une application web éducative gratuite, sans publicité et
        sans but lucratif. Elle est développée par Wazko dans le but d'aider les musulmans
        à apprendre et mémoriser les 99 Noms d'Allah.
      </p>
    </section>

    <section class="legal-section" id="pc2">
      <div class="legal-section-head">
        <span class="legal-section-n">2</span>
        <h2>Quelles données collectons-nous ?</h2>
      </div>
      <p>Al-Asmaa collecte le <strong>minimum de données nécessaire</strong> à son fonctionnement :</p>
      <ul class="legal-ul">
        <li><strong>Pseudo de jeu</strong> : choisi librement par l'utilisateur, stocké uniquement dans le navigateur
          (<code>localStorage</code>). Aucun pseudo n'est conservé côté serveur de manière permanente.</li>
        <li><strong>Progression d'apprentissage</strong> : scores SRS, flashcards consultées, résultats de quiz.
          Toutes ces données sont stockées <strong>uniquement dans le navigateur</strong> (<code>localStorage</code>)
          et ne quittent jamais votre appareil.</li>
        <li><strong>Données de session multijoueur</strong> : lors d'une partie, le pseudo et les réponses sont
          transmis via WebSocket. Ces données sont conservées en mémoire serveur <strong>uniquement
          pendant la durée de la partie</strong> et supprimées à la déconnexion.</li>
        <li><strong>Leaderboard</strong> : si vous soumettez un score au classement, votre pseudo et votre
          score sont conservés en mémoire serveur. Ces données sont volatiles et perdues au
          redémarrage du serveur.</li>
      </ul>
    </section>

    <section class="legal-section" id="pc3">
      <div class="legal-section-head">
        <span class="legal-section-n">3</span>
        <h2>Ce que nous ne collectons PAS</h2>
      </div>
      <div class="legal-highlight">
        <p><strong>Al-Asmaa respecte votre vie privée.</strong> Nous ne collectons aucune donnée superflue.</p>
      </div>
      <ul class="legal-ul legal-shield">
        <li>Aucune adresse email</li>
        <li>Aucune donnée de géolocalisation</li>
        <li>Aucun identifiant publicitaire</li>
        <li>Aucun traceur tiers (Google Analytics, Facebook Pixel, etc.)</li>
        <li>Aucune donnée revendue à des tiers</li>
      </ul>
    </section>

    <section class="legal-section" id="pc4">
      <div class="legal-section-head">
        <span class="legal-section-n">4</span>
        <h2>Cookies et stockage local</h2>
      </div>
      <p>
        Al-Asmaa <strong>n'utilise aucun cookie</strong>. Les données de progression et de préférence
        sont stockées via <code>localStorage</code>, une technologie de stockage local qui reste
        sur votre navigateur et n'est jamais envoyée automatiquement au serveur.
      </p>
      <p>
        Vous pouvez à tout moment supprimer ces données en vidant le stockage local de votre
        navigateur (Paramètres &gt; Données de navigation &gt; Stockage local).
      </p>
    </section>

    <section class="legal-section" id="pc5">
      <div class="legal-section-head">
        <span class="legal-section-n">5</span>
        <h2>Service Worker et mise en cache</h2>
      </div>
      <p>
        Al-Asmaa utilise un Service Worker pour permettre un fonctionnement hors-ligne.
        Ce dernier met en cache les fichiers statiques de l'application (CSS, JavaScript, images)
        sur votre appareil. Aucune donnée personnelle n'est impliquée dans ce cache.
      </p>
    </section>

    <section class="legal-section" id="pc6">
      <div class="legal-section-head">
        <span class="legal-section-n">6</span>
        <h2>Partage avec des tiers</h2>
      </div>
      <p>
        Al-Asmaa ne partage <strong>aucune donnée</strong> avec des tiers. Aucun service d'analyse,
        de publicité ou de profilage n'est intégré à l'application.
      </p>
      <p>
        Lorsque vous utilisez la fonctionnalité de partage social, vous êtes redirigé vers
        le service tiers choisi (WhatsApp, Twitter, Telegram). Al-Asmaa ne transmet aucune
        donnée à ces services &mdash; seul le texte que vous choisissez de partager est concerné.
      </p>
    </section>

    <section class="legal-section" id="pc7">
      <div class="legal-section-head">
        <span class="legal-section-n">7</span>
        <h2>Sécurité</h2>
      </div>
      <p>
        Nous mettons en &oelig;uvre des mesures de sécurité appropriées : headers de sécurité HTTP,
        validation des entrées utilisateur, protection contre les injections. Toutefois,
        aucune transmission sur Internet ne peut être garantie à 100&nbsp;% sûre.
      </p>
    </section>

    <section class="legal-section" id="pc8">
      <div class="legal-section-head">
        <span class="legal-section-n">8</span>
        <h2>Droits des utilisateurs</h2>
      </div>
      <p>
        Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
      </p>
      <ul class="legal-ul">
        <li><strong>Droit d'accès</strong> : vos données étant stockées localement, vous y avez accès directement
          via les outils développeur de votre navigateur.</li>
        <li><strong>Droit de suppression</strong> : videz le <code>localStorage</code> de votre navigateur pour supprimer
          toutes vos données. Aucune donnée n'est retenue côté serveur.</li>
        <li><strong>Droit de portabilité</strong> : vous pouvez exporter vos données <code>localStorage</code> au format JSON.</li>
      </ul>
      <p>Pour toute question : <em>contact [at] al-asmaa.app</em></p>
    </section>

    <section class="legal-section" id="pc9">
      <div class="legal-section-head">
        <span class="legal-section-n">9</span>
        <h2>Mineurs</h2>
      </div>
      <p>
        Al-Asmaa est une application éducative adaptée à tous les âges, incluant un mode enfant.
        Aucune donnée personnelle n'étant collectée, aucun consentement parental spécifique n'est requis.
      </p>
    </section>

    <section class="legal-section" id="pc10">
      <div class="legal-section-head">
        <span class="legal-section-n">10</span>
        <h2>Modifications</h2>
      </div>
      <p>
        Cette politique peut être mise à jour. La date de dernière modification est indiquée
        en haut de cette page. Nous vous encourageons à la consulter régulièrement.
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
        <li>Un jeu multijoueur en réseau local</li>
        <li>Une encyclopédie détaillée des 99 Noms</li>
        <li>Des modes d'apprentissage : flashcards, quiz, écoute, défi quotidien</li>
        <li>Un système de répétition espacée (SRS)</li>
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
        Al-Asmaa propose une fonctionnalité de don volontaire via PayPal et Stripe. Ces dons
        sont facultatifs et ne conditionnent en rien l'accès aux fonctionnalités. Aucun
        remboursement n'est possible sur les dons effectués, sauf erreur technique avérée.
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
        Pour toute question relative aux présentes conditions : <em>contact [at] al-asmaa.app</em>
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
  room.game._serverTimer = setTimeout(() => {
    if (!room || room.state !== 'playing' || room.game.paused) return;
    const currentPlayer = room.players[room.game.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.eliminated) return;
    // Garde anti-race : ignorer si une réponse récente
    if (room.game._lastAnswerTime && Date.now() - room.game._lastAnswerTime < 500) return;
    console.log(`[Server Timer] Explosion forcée pour ${currentPlayer.name} dans ${room.code}`);
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
  if (room.game && room.game._serverTimer) {
    clearTimeout(room.game._serverTimer);
    room.game._serverTimer = null;
  }
}

// Logique Socket.io
io.on('connection', (socket) => {
  console.log(`[Connexion] ${socket.id}`);

  // Créer une room
  socket.on('create-room', (data, callback) => {
    console.log(`[create-room] data reçue:`, JSON.stringify({ visibility: data.visibility, hostName: data.hostName, difficulty: data.difficulty }));

    // Nettoyer TOUTES les rooms dont ce socket est l'hôte (évite les ghost rooms)
    for (const oldCode of Object.keys(rooms)) {
      const oldRoom = rooms[oldCode];
      if (oldRoom.host === socket.id) {
        clearServerBombTimer(oldRoom);
        if (oldRoom._destroyTimer) clearTimeout(oldRoom._destroyTimer);
        io.to(oldCode).emit('room-closed');
        const oldSockets = io.sockets.adapter.rooms.get(oldCode);
        if (oldSockets) {
          for (const sid of oldSockets) {
            const s = io.sockets.sockets.get(sid);
            if (s && s.id !== socket.id) {
              s.leave(oldCode);
              s.roomCode = null;
            }
          }
        }
        socket.leave(oldCode);
        delete rooms[oldCode]; delete qrCache[oldCode];
        console.log(`[Cleanup] Ancienne room ${oldCode} supprimée (hôte crée une nouvelle room)`);
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

    console.log(`[Room créée] ${code} par ${hostName} (${socket.id}) — visibilité: ${room.visibility}`);

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
      console.log(`[Reconnexion] Timer annulé pour ${code}`);
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

    console.log(`[Host reconnect] ${room.hostName} → Room ${code}`);
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

    // Reconnexion : chercher un joueur existant avec le même nom (connecté ou non)
    const existing = room.players.find(p => p.name === name && !p.isHost);
    if (existing) {
      // Force-déconnecter l'ancien socket s'il est encore actif
      if (existing.id !== socket.id) {
        const oldSocket = io.sockets.sockets.get(existing.id);
        if (oldSocket) {
          oldSocket.leave(code);
          oldSocket.roomCode = null;
          oldSocket.playerId = null;
        }
      }

      // Réattacher le nouveau socket au joueur existant
      existing.id = socket.id;
      existing.connected = true;
      existing.ready = false; // Reset ready — player must re-confirm after refresh

      socket.join(code);
      socket.roomCode = code;
      socket.playerId = socket.id;
      socket.playerName = name;

      console.log(`[Joueur reconnecté] ${name} → Room ${code}`);

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

    console.log(`[Joueur rejoint] ${name} → Room ${code}`);

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
      for (const sid of sockets) {
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
    console.log(`[Room fermée] ${code} (hôte a quitté)`);
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

    console.log(`[Joueur parti] ${socket.playerName} a quitté ${code}`);
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
      paused: false,
      _serverTimer: null
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

    console.log(`[Partie lancée] Room ${room.code} — ${room.players.length} joueurs — Mode: ${room.config.mode}`);

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

    console.log(`[Explosion] ${currentPlayer.name} — Vies restantes: ${currentPlayer.lives}`);

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

    console.log(`[Kick] ${targetPlayer.name} exclu de Room ${room.code}`);
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
    console.log(`[Déconnexion] ${socket.id}`);

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
          console.log(`[Room supprimée] ${disconnectedCode} (hôte absent 60s)`);
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

          console.log(`[Déconnexion lobby] ${player.name} retiré de Room ${socket.roomCode}`);
        } else {
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
            console.log(`[Timeout] ${disconnectedPlayerName} éliminé (déconnecté >30s) dans ${disconnectedRoomCode}`);
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
      console.log(`[Host Leave] L'hôte a quitté la room ${code} — suppression`);
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
        for (const sid of sockets) {
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

    console.log(`[Leave] ${playerName} a quitté la partie dans la room ${code}`);

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

  // Rejouer — l'hôte remet la room en lobby
  socket.on('replay-game', () => {
    console.log(`[Replay] replay-game reçu de ${socket.id}, roomCode=${socket.roomCode}, isHost=${socket.isHost}`);
    const code = socket.roomCode;
    const room = rooms[code];
    if (!room) {
      console.log(`[Replay] Room ${code} n'existe pas`);
      socket.emit('replay-error', { message: 'Salon introuvable' });
      return;
    }
    if (!socket.isHost) {
      console.log(`[Replay] Socket ${socket.id} n'est pas l'hôte`);
      socket.emit('replay-error', { message: "Seul l'hôte peut relancer" });
      return;
    }

    // Guard: only allow replay from ended state
    if (room.state !== 'ended') {
      console.log(`[Replay] Room ${code} state=${room.state}, pas ended — ignoré`);
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

    console.log(`[Replay] Room ${code} remise en lobby avec ${room.players.length} joueurs`);

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
      console.log(`[Typing REJECTED] socket=${socket.id} expected=${currentPlayer?.id} name=${currentPlayer?.name}`);
      return;
    }
    socket.to(socket.roomCode).emit('player-typing', {
      text: (data.text || '').substring(0, 40),
      playerId: socket.id
    });
  });

  // Utiliser un joker — renvoie un indice (nom français + catégorie)
  socket.on('use-joker', (callback) => {
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

    console.log(`[Joker] ${player.name} utilise un joker — indice: ${hint.french} (${hint.category}) — restants: ${player.jokersRemaining}`);

    callback && callback({
      success: true,
      french: hint.french,
      category: hint.category,
      jokersRemaining: player.jokersRemaining
    });
  });

  // Chat / messages
  socket.on('chat-message', (data) => {
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
  console.log('[IQ Socket] New /iq connection:', socket.id);

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

    console.log(`[IQ Socket] ${data.playerName} joined iq-${code} (host: ${data.isHost}, state: ${room.state})`);
    if (callback) callback({ success: true });
  });

  socket.on('iq-broadcast', (data) => {
    if (!socket.iqRoom) return;
    socket.to('iq-' + socket.iqRoom).emit('iq-message', data);
  });

  socket.on('iq-leave', () => {
    if (socket.iqRoom) {
      socket.leave('iq-' + socket.iqRoom);
      console.log(`[IQ Socket] ${socket.iqPlayerName || socket.id} left iq-${socket.iqRoom}`);
      socket.iqRoom = null;
    }
  });

  socket.on('disconnect', () => {
    if (socket.iqRoom) {
      if (socket.iqIsHost) {
        iqNsp.to('iq-' + socket.iqRoom).emit('iq-message', { type: 'host-left' });
        if (iqRooms[socket.iqRoom]) {
          delete iqRooms[socket.iqRoom];
          console.log(`[IQ Socket] Host disconnected, room ${socket.iqRoom} deleted`);
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

// --- Validation serveur des réponses ---

function normalizeForValidation(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[-\s\u2019\u2018''`\u02BC]/g, '')
    .replace(/^(ash|adh|dhul|al|ar|as|at|az|ad|an)/, '')
    .trim();
}

function normalizeArabicForValidation(str) {
  return str
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function levenshteinDistance(a, b) {
  const aLen = a.length, bLen = b.length;
  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;
  const matrix = [];
  for (let i = 0; i <= bLen; i++) matrix[i] = [i];
  for (let j = 0; j <= aLen; j++) matrix[0][j] = j;
  for (let i = 1; i <= bLen; i++) {
    for (let j = 1; j <= aLen; j++) {
      matrix[i][j] = b[i-1] === a[j-1]
        ? matrix[i-1][j-1]
        : Math.min(matrix[i-1][j-1]+1, matrix[i][j-1]+1, matrix[i-1][j]+1);
    }
  }
  return matrix[bLen][aLen];
}

function serverValidateAnswer(input, usedNames) {
  if (!input || input.trim().length === 0) {
    return { valid: false, nameId: null, message: 'empty' };
  }
  const normalizedInput = normalizeForValidation(input);
  const arabicInput = normalizeArabicForValidation(input);

  // Phase 1 : match exact
  for (const name of ASMA_UL_HUSNA) {
    if (normalizeForValidation(name.transliteration) === normalizedInput ||
        normalizeArabicForValidation(name.arabic) === arabicInput) {
      if (usedNames.includes(name.id)) return { valid: false, nameId: name.id, message: 'already-used' };
      return { valid: true, nameId: name.id, canonicalName: name.transliteration, message: 'correct' };
    }
    if (name.variants) {
      for (const v of name.variants) {
        if (normalizeForValidation(v) === normalizedInput || normalizeArabicForValidation(v) === arabicInput) {
          if (usedNames.includes(name.id)) return { valid: false, nameId: name.id, message: 'already-used' };
          return { valid: true, nameId: name.id, canonicalName: name.transliteration, message: 'correct' };
        }
      }
    }
  }

  // Phase 2 : match flou (Levenshtein)
  let bestMatch = null, bestDist = Infinity;
  for (const name of ASMA_UL_HUSNA) {
    const nameNorm = normalizeForValidation(name.transliteration);
    const dist = levenshteinDistance(normalizedInput, nameNorm);
    const maxDist = nameNorm.length > 6 ? 2 : 1;
    if (dist <= maxDist && dist < bestDist) {
      bestDist = dist;
      bestMatch = name;
    }
  }
  if (bestMatch) {
    if (usedNames.includes(bestMatch.id)) return { valid: false, nameId: bestMatch.id, message: 'already-used' };
    return { valid: true, nameId: bestMatch.id, canonicalName: bestMatch.transliteration, message: 'correct' };
  }

  return { valid: false, nameId: null, message: 'unknown' };
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

  console.log(`[Fin de partie] Room ${room.code} — ${room.game.usedNames.length}/99 noms cités${isTie ? ' (égalité)' : ''}`);
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
    if (err) console.error('[Mail] Connexion Gmail échouée :', err.message);
    else console.log('[Mail] Connexion Gmail OK —', REPORT_EMAIL);
  });
} else {
  console.warn('[Mail] REPORT_EMAIL ou REPORT_EMAIL_PASSWORD manquant dans .env — les signalements seront sauvegardés localement uniquement.');
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
      console.log(`[Report] Email envoyé — ${safeType} — ${safePage || '(aucune page)'}`);
    } catch (mailErr) {
      console.error('[Report] Erreur email :', mailErr.message);
    }
  }

  console.log(`[Report] ${safeType} — ${safePage || '(aucune page)'} — ${safeDesc.slice(0, 60)}...`);
  res.json({ success: true, id: report.id });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', rooms: Object.keys(rooms).length });
});

// --- Middleware 404 catch-all (DOIT être après toutes les routes) ---
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// --- Error handler 500 ---
app.use((err, req, res, next) => {
  console.error('[Erreur 500]', err.stack || err.message);
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
    console.warn(`[Port] ${port} déjà utilisé, tentative sur ${port + 1}...`);
  }
  return null;
}

(async () => {
  const freePort = await findFreePort(PORT);
  if (!freePort) {
    console.error(`[Erreur] Aucun port libre entre ${PORT} et ${PORT + MAX_PORT_RETRIES - 1}.`);
    console.error('[Erreur] Fermez les autres serveurs ou utilisez PORT=XXXX node server.js');
    process.exit(1);
  }

  server.on('error', (err) => {
    console.error('[Erreur serveur]', err.message);
    process.exit(1);
  });

  server.listen(freePort, HOST, () => {
    const pad = (s, len) => s + ' '.repeat(Math.max(0, len - s.length));
    console.log('');
    console.log('  ╔══════════════════════════════════════════╗');
    console.log('  ║         AL-ASMAA — Serveur               ║');
    console.log('  ╠══════════════════════════════════════════╣');
    console.log(`  ║  ${pad(`Local:    http://localhost:${freePort}`, 40)}║`);
    console.log(`  ║  ${pad(`Réseau:   http://${LOCAL_IP}:${freePort}`, 40)}║`);
    console.log(`  ║  ${pad(`Mode:     ${NODE_ENV}`, 40)}║`);
    console.log('  ║                                          ║');
    console.log('  ║  Partagez l\'URL réseau pour que les      ║');
    console.log('  ║  autres joueurs rejoignent sur le        ║');
    console.log('  ║  même réseau WiFi.                       ║');
    console.log('  ╚══════════════════════════════════════════╝');
    if (freePort !== PORT) {
      console.log(`  ⚠  Le port ${PORT} était occupé — lancé sur ${freePort}`);
    }
    console.log('');
  });
})();

// Graceful shutdown
function gracefulShutdown(signal) {
  console.log(`\n[${signal}] Arrêt en cours...`);
  // Notifier tous les clients
  for (const code of Object.keys(rooms)) {
    io.to(code).emit('server-shutdown', { message: 'Le serveur s\'arrête' });
  }
  io.close(() => {
    server.close(() => {
      console.log('[Serveur] Arrêté proprement.');
      process.exit(0);
    });
  });
  // Forcer l'arrêt après 5s
  setTimeout(() => process.exit(1), 5000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
