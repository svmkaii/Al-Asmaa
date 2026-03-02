# AUDIT — Al-Asmaa v2.0 (Multiplayer)

**Date :** 2026-02-23
**Version :** v2.0.0 (Express + Socket.io multiplayer)

---

## 1. ARCHITECTURE

| Fichier | Lignes | Role |
|---------|--------|------|
| `server.js` | 557 | Express + Socket.io, rooms, game logic |
| `public/index.html` | 402 | Vue Hote (accueil, lobby, jeu, resultats) |
| `public/player.html` | 275 | Vue Joueur mobile (join, lobby, jeu, resultats) |
| `public/spectator.html` | 165 | Vue Spectateur grand ecran |
| `public/css/style.css` | ~1900 | Styles principaux |
| `public/css/animations.css` | ~400 | Animations explosion, confetti, transitions |
| `public/js/app.js` | 477 | Logique hote (UI, socket events, rendu) |
| `public/js/player-app.js` | 547 | Logique joueur (join, saisie, suggestions) |
| `public/js/spectator-app.js` | 289 | Logique spectateur |
| `public/js/bomb.js` | 442 | Module bombe IIFE (timer, audio, explosion, confetti) |
| `public/js/validator.js` | 278 | Validation noms (exact, variantes, Levenshtein) |
| `public/data/names.js` | ~700 | 99 noms avec variantes |
| `package.json` | 17 | express, socket.io, qrcode |

**Fichiers manquants :** background.js, audio.js, manifest.json, sw.js

---

## 2. PROBLEMES DESIGN

- Palette trop sombre (#0a0f1e) — elements se fondent dans le fond
- Etoiles/particules CSS statiques, pas de parallax ni interactivite
- Glassmorphism opacity 0.08 — cartes quasi invisibles
- Typographie arabe (Amiri) sans glow ni gradient visible
- Boutons sans profondeur reelle
- Bombe SVG basique (pas de details metalliques)
- Timer ring 4px trop fin, pas de glow
- Pas de micro-interactions (ripple, haptic)
- Confetti CSS sans physique
- Pas de systeme de particules JS

## 3. PROBLEMES TECHNIQUES

- `bomb.js` IIFE non extensible
- Pas de module audio separe
- Pas de PWA (manifest.json, service worker)
- Inline styles dans templates JS (spectator-app.js:194)
- `escapeHtml()` dupliquee x3
- Pas de gestion reconnexion Socket.io
- `names.js` manque: categoryIcon, quranArabic, memorization, difficulty
- Pas de prefers-reduced-motion global
- Google Fonts bloque le rendu
- Timer utilise setInterval(50ms) au lieu de requestAnimationFrame
- Pas de will-change, pas de lazy loading

---

## 4. PLAN DE REFONTE TOTALE

12 etapes: nouveau design system, animations, bomb class, pages redesignees,
audio engine, PWA, micro-interactions. Voir implementation ci-dessous.
