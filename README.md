# Al-Asmaa — Les 99 Noms d'Allah

Jeu multijoueur en réseau local pour apprendre les 99 Noms d'Allah en s'amusant.

Chaque joueur utilise **son propre téléphone** comme manette. Un écran central (TV, PC, tablette) peut servir de vue spectateur.

---

## Installation

### Prérequis

- **Node.js** version 16 ou supérieur ([nodejs.org](https://nodejs.org))
- Tous les appareils doivent être sur le **même réseau WiFi**

### Étapes

```bash
# 1. Cloner ou télécharger le projet
cd al-asmaa

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur
node server.js
```

Le serveur affiche deux URLs :
- **Local** : `http://localhost:3000` (sur la machine hôte)
- **Réseau** : `http://192.168.x.x:3000` (pour les autres appareils)

---

## Comment jouer

### 1. Créer une partie (l'hôte)

1. Ouvrir `http://localhost:3000` dans un navigateur
2. Cliquer sur **"Créer une partie"**
3. Choisir la difficulté et le nombre de vies
4. Un **code de room** et un **QR code** s'affichent

### 2. Rejoindre (les joueurs)

Chaque joueur prend son téléphone et :
- **Scanne le QR code** affiché sur l'écran de l'hôte, OU
- Tape l'URL réseau dans son navigateur (ex: `http://192.168.1.42:3000`)
- Entre son **prénom** et clique **"Rejoindre"**

### 3. Lancer

Quand tous les joueurs sont connectés, l'hôte clique **"Lancer la partie"**.

### 4. Pendant le jeu

- Quand c'est ton tour, **tape le nom** d'un des 99 Noms d'Allah
- Des **suggestions** apparaissent pendant la saisie
- Appuie sur **Entrée** ou clique une suggestion pour valider
- La bombe passe au joueur suivant
- Si le temps s'écoule... BOOM ! Tu perds une vie

### 5. Mode spectateur (optionnel)

Pour afficher le jeu sur un grand écran (TV via Chromecast, etc.) :
- Ouvrir `http://192.168.x.x:3000` et cliquer **"Spectateur"**
- Entrer le code de la room

---

## Tolérance de saisie

Le système accepte plusieurs orthographes pour chaque nom :
- **Ar-Rahman**, **arrahman**, **rahman**, **arrahmane** sont tous valides
- Le **clavier arabe** est aussi supporté (ex: الرحمن)
- Tolérance aux fautes de frappe (distance de Levenshtein)

---

## Structure du projet

```
al-asmaa/
  server.js              # Serveur Express + Socket.io
  package.json           # Dépendances
  public/
    index.html           # Page d'accueil + vue hôte
    player.html          # Vue joueur (téléphone)
    spectator.html       # Vue grand écran
    css/
      style.css          # Styles principaux
      animations.css     # Animations avancées
    js/
      app.js             # Logique hôte
      player-app.js      # Logique joueur
      spectator-app.js   # Logique spectateur
      bomb.js            # Timer, audio, explosions
      validator.js       # Validation des noms
    data/
      names.js           # Base de données des 99 noms
```

---

## Instructions par plateforme

### Windows

```cmd
cd C:\chemin\vers\al-asmaa
npm install
node server.js
```

### macOS / Linux

```bash
cd /chemin/vers/al-asmaa
npm install
node server.js
```

### Depuis un téléphone

1. S'assurer d'être sur le **même réseau WiFi** que l'ordinateur qui fait tourner le serveur
2. Ouvrir le navigateur (Chrome, Safari, Firefox)
3. Taper l'URL réseau affichée par le serveur (ex: `http://192.168.1.42:3000`)
4. Ou scanner le QR code affiché sur l'écran de l'hôte

---

## Technologies

- **Express** + **Socket.io** pour le multijoueur temps réel
- **Web Audio API** pour les sons procéduraux (pas de fichiers audio)
- **CSS pur** pour toutes les animations (pas de bibliothèque)
- **QR Code** généré côté serveur pour rejoindre facilement

---

## Licence

Projet éducatif — usage libre et respectueux.

بسم الله الرحمن الرحيم
