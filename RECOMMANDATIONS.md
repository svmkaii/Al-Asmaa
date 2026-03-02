# RECOMMANDATIONS.md — Analyse post-refonte Al-Asmaa v2

**Date :** 2026-02-23

---

## 1. Analyse UX complète

### Points de friction identifiés

1. **Première connexion** : Le joueur doit manuellement taper l'URL réseau s'il ne peut pas scanner le QR code. Un lien cliquable ou un système de discovery (mDNS/Bonjour) améliorerait l'expérience.

2. **Retour visuel du timer** : Le joueur qui tape ne voit qu'un mini timer sur son écran. Ajouter un feedback haptique progressif (vibrations de plus en plus rapides) renforcerait l'urgence.

3. **Transition post-explosion** : L'animation d'explosion coupe l'action. Le joueur éliminé pourrait voir un résumé instantané de ses stats pendant la transition.

4. **Suggestions autocomplete** : Sur mobile, le clavier virtuel masque parfois les suggestions. Prévoir un ajustement de scroll automatique quand le clavier s'ouvre.

5. **Reconnexion** : Si un joueur perd sa connexion WiFi momentanément, il est déconnecté sans possibilité de revenir. Un système de reconnexion automatique avec token serait nécessaire.

### Micro-interactions manquantes

- Animation de "shake" sur l'input quand un nom invalide est soumis
- Compteur de score qui "pop" visuellement quand il augmente
- Animation de particules dorées quand un joueur atteint un palier (10, 25, 50 noms)
- Son subtil quand un autre joueur donne une bonne réponse (feedback social)
- Badge animé quand c'est la dernière vie

### Accessibilité mobile

- **Touch targets** : tous les boutons font au minimum 48px (conforme)
- **Contraste** : texte or (#c9a84c) sur fond sombre (#0a0f1e) — ratio 7.2:1 (AAA conforme)
- **Taille de police** : l'input géant (2rem) est bien lisible sur petit écran
- **Mode paysage** : non optimisé — certains éléments débordent en paysage sur petits écrans
- **Mode sombre** : natif (fond sombre), pas de mode clair à prévoir

---

## 2. Fonctionnalités à ajouter

### PWA installable
- **Priorité** : Critique
- **Effort** : Petit
- **Impact** : Les joueurs peuvent "installer" le jeu sur leur écran d'accueil pour un accès instantané. Ajouter un manifest.json complet et un Service Worker pour le cache offline.

### Système de reconnexion automatique
- **Priorité** : Critique
- **Effort** : Moyen
- **Impact** : Si un joueur perd la connexion WiFi 5 secondes, il peut revenir sans perdre sa progression. Utiliser un token de session stocké en sessionStorage.

### Mode tournoi avec bracket visuel
- **Priorité** : Important
- **Effort** : Grand
- **Impact** : Pour les soirées entre amis ou les événements, un mode tournoi avec arbre de brackets (quarts, demis, finale) apporte une dimension compétitive. Affichage visuel de l'arbre sur la vue spectateur.

### Système de progression persistante
- **Priorité** : Important
- **Effort** : Grand
- **Impact** : Niveaux, badges et streak de jours consécutifs. Stocké en localStorage côté joueur. Badges : "Hafidh" (99 noms cités), "Éclair" (réponse en moins de 1s), "Marathon" (partie de plus de 50 noms).

### Prononciation audio (Text-to-Speech)
- **Priorité** : Important
- **Effort** : Moyen
- **Impact** : Quand un nom est validé, la prononciation arabe correcte est jouée. Utiliser l'API Web Speech ou des fichiers audio pré-enregistrés pour la qualité.

### Replay du tour
- **Priorité** : Nice to have
- **Effort** : Petit
- **Impact** : En fin de partie, chaque joueur peut revoir l'ordre des noms cités, par qui, et en combien de temps. Utile pour l'apprentissage.

### Mode "Défis quotidiens"
- **Priorité** : Nice to have
- **Effort** : Moyen
- **Impact** : Chaque jour, un défi avec des contraintes spécifiques (ex: "Cite 10 noms de la catégorie Miséricorde en 60 secondes"). Renforce l'engagement quotidien.

### Leaderboard entre amis
- **Priorité** : Nice to have
- **Effort** : Grand
- **Impact** : Classement persistant entre les joueurs d'un même groupe. Nécessiterait un stockage côté serveur (fichier JSON ou base SQLite).

### Partage des résultats sur réseaux sociaux
- **Priorité** : Nice to have
- **Effort** : Moyen
- **Impact** : Générer une image (Canvas API) avec le podium et les stats, partageable via Web Share API ou téléchargeable en PNG.

### Chrono global de partie
- **Priorité** : Nice to have
- **Effort** : Petit
- **Impact** : En plus du timer par tour, afficher un chrono global de la partie pour comparer les performances entre sessions.

### Mode "Apprentissage assisté" avec indices
- **Priorité** : Nice to have
- **Effort** : Moyen
- **Impact** : Quand le timer descend sous 50%, un indice apparaît (première lettre, catégorie, ou signification partielle). Configurable par l'hôte.

### Rooms persistantes
- **Priorité** : Nice to have
- **Effort** : Moyen
- **Impact** : Permettre de créer une room "favorite" avec un code fixe, pour que les amis puissent la rejoindre sans nouveau code à chaque fois.

---

## 3. Bugs & problèmes techniques détectés

### Edge cases non gérés

1. **Joueur unique restant** : Si tous les joueurs sauf un se déconnectent, la partie continue indéfiniment. Devrait auto-terminer si un seul joueur reste connecté pendant plus de 30s.

2. **Double soumission** : Si un joueur appuie très vite sur Entrée deux fois, deux réponses peuvent être envoyées. Ajouter un debounce côté client.

3. **Noms composés longs** : "Dhul-Jalali wal-Ikram" et "Malik-ul-Mulk" sont plus difficiles à taper. Les variantes de saisie couvrent-elles tous les cas ? Vérifier que "dhuljalali", "dhoul jalal", "malikulmulk" sont tous acceptés.

4. **Collision de timer** : L'hôte gère le timer et déclenche l'explosion. Si la latence réseau est >500ms, un joueur pourrait soumettre une réponse valide juste au moment de l'explosion côté hôte. Ajouter une grâce de 500ms après explosion pour accepter les réponses en vol.

5. **Room fantôme** : Si le serveur crash sans nettoyer les rooms, elles restent en mémoire. Ajouter un TTL de 2h sur chaque room.

6. **Noms en double dans la liste** : Vérifier qu'aucun nom n'apparaît deux fois dans les résultats si le réseau envoie un événement en doublon.

### Problèmes de performance

- **Particules CSS** : Les 8 étoiles islamiques animées en background consomment du GPU. Sur des téléphones anciens (< 2020), cela peut causer du lag. Prévoir un mode "performance" qui désactive les particules.
- **Rendu DOM** : Le renderGamePlayers() reconstruit tout le HTML à chaque événement. Pour 8 joueurs, c'est acceptable, mais utiliser un diff minimal serait plus efficace.
- **Socket.io polling fallback** : Si WebSocket échoue, Socket.io bascule en long-polling, ce qui augmente la latence. S'assurer que le réseau local supporte WebSocket.

### Compatibilité navigateur

- **Safari iOS** : `backdrop-filter: blur()` nécessite le préfixe `-webkit-` (ajouté)
- **Firefox mobile** : `navigator.vibrate()` n'est pas supporté (fallback visuel OK)
- **Samsung Internet** : Tester le fonctionnement du QR scanner intégré
- **WebSocket sur certains routeurs** : Certains routeurs domestiques bloquent les WebSockets internes. Vérifier le fallback HTTP long-polling.
- **100dvh sur anciens navigateurs** : Fallback `100vh` ajouté

---

## 4. Améliorations du contenu

### Complétude des 99 noms
- Les 99 noms sont tous présents avec arabe, translittération, français, anglais, catégorie, description et verset coranique.
- Chaque nom a un tableau de variantes de saisie pour la tolérance.

### Qualité des traductions
- Les traductions françaises sont conformes aux sources classiques (Ibn Kathir, Al-Ghazali).
- Les traductions anglaises suivent les conventions académiques standardisées.
- **Suggestion** : ajouter une source secondaire (ex: Sahih International, Yusuf Ali) pour chaque traduction.

### Contenu additionnel à envisager

1. **Hadiths liés** : Pour chaque nom, un hadith du Prophète (paix sur lui) mentionnant ce nom ou son attribut. Source : Sahih Al-Bukhari et Muslim.

2. **Contexte coranique étendu** : Au lieu d'une seule référence, lister tous les versets où le nom apparaît. Cela enrichirait la vue résultats et le mode apprentissage.

3. **Douas associées** : Pour les noms les plus courants, ajouter l'invocation traditionnelle utilisant ce nom (ex: "Ya Rahman, accorde-nous Ta miséricorde").

4. **Étymologie arabe** : La racine trilitère de chaque nom (ex: ر-ح-م pour Ar-Rahman) avec son sens fondamental. Utile pour l'apprentissage linguistique.

5. **Audio de récitation** : Des enregistrements audio de la prononciation correcte de chaque nom, idéalement par un récitateur reconnu.

6. **Groupement thématique étendu** : Au-delà des 8 catégories actuelles, ajouter des liens entre noms (paires : Al-Qabid / Al-Basit, Al-Mu'izz / Al-Mudhill) pour une compréhension plus profonde.

---

## Résumé des priorités

| # | Feature | Priorité | Effort |
|---|---------|----------|--------|
| 1 | PWA installable | Critique | Petit |
| 2 | Reconnexion automatique | Critique | Moyen |
| 3 | Debounce double soumission | Critique | Petit |
| 4 | Grâce post-explosion 500ms | Critique | Petit |
| 5 | Mode tournoi bracket | Important | Grand |
| 6 | Progression persistante | Important | Grand |
| 7 | Audio prononciation | Important | Moyen |
| 8 | Mode performance (low-end) | Important | Petit |
| 9 | Replay du tour | Nice to have | Petit |
| 10 | Défis quotidiens | Nice to have | Moyen |
| 11 | Leaderboard | Nice to have | Grand |
| 12 | Partage social | Nice to have | Moyen |
