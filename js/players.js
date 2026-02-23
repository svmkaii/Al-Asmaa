/**
 * Al-Asmaa — Player Management
 */

const Players = (() => {
  let players = [];
  let currentIndex = 0;
  let teams = [[], []];

  function create(name) {
    return {
      id: Date.now() + Math.random(),
      name: name.trim(),
      lives: 3,
      score: 0,
      faults: 0,
      namesUsed: [],
      eliminated: false,
      stats: {
        totalNamesEver: 0,
        fastestResponse: Infinity,
        gamesPlayed: 0
      }
    };
  }

  function setPlayers(names, livesCount) {
    players = names.map(n => {
      const p = create(n);
      p.lives = livesCount || 3;
      return p;
    });
    currentIndex = 0;
  }

  function getPlayers() {
    return players;
  }

  function getActivePlayers() {
    return players.filter(p => !p.eliminated);
  }

  function getCurrentPlayer() {
    return players[currentIndex];
  }

  function getCurrentIndex() {
    return currentIndex;
  }

  function nextPlayer() {
    const active = getActivePlayers();
    if (active.length === 0) return null;

    do {
      currentIndex = (currentIndex + 1) % players.length;
    } while (players[currentIndex].eliminated);

    return players[currentIndex];
  }

  function loseLife(playerOrIndex) {
    const p = typeof playerOrIndex === 'number' ? players[playerOrIndex] : playerOrIndex;
    p.lives--;
    p.faults++;
    if (p.lives <= 0) {
      p.eliminated = true;
    }
    return p;
  }

  function addScore(playerOrIndex, points) {
    const p = typeof playerOrIndex === 'number' ? players[playerOrIndex] : playerOrIndex;
    p.score += points;
    return p;
  }

  function addNameUsed(playerOrIndex, nameId) {
    const p = typeof playerOrIndex === 'number' ? players[playerOrIndex] : playerOrIndex;
    p.namesUsed.push(nameId);
    p.stats.totalNamesEver++;
    return p;
  }

  function getAliveCount() {
    return getActivePlayers().length;
  }

  function isGameOver() {
    return getAliveCount() <= 1 && players.length > 1;
  }

  function getWinner() {
    const active = getActivePlayers();
    if (active.length === 1) return active[0];
    // If multiple still alive, winner by score
    return [...active].sort((a, b) => b.score - a.score)[0];
  }

  function getRanking() {
    return [...players].sort((a, b) => {
      if (a.eliminated !== b.eliminated) return a.eliminated ? 1 : -1;
      return b.score - a.score;
    });
  }

  function reset() {
    players.forEach(p => {
      p.lives = 3;
      p.score = 0;
      p.faults = 0;
      p.namesUsed = [];
      p.eliminated = false;
    });
    currentIndex = 0;
  }

  // --- Team Mode ---

  function createTeams() {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    teams = [[], []];
    shuffled.forEach((p, i) => {
      teams[i % 2].push(p);
    });
    return teams;
  }

  function getTeams() {
    return teams;
  }

  function setTeams(t) {
    teams = t;
  }

  // --- Duel Mode ---

  function setupDuel(player1Index, player2Index) {
    currentIndex = player1Index;
    return {
      player1: players[player1Index],
      player2: players[player2Index]
    };
  }

  // --- Tournament Bracket ---

  function createBracket() {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const rounds = [];
    let current = shuffled;

    while (current.length > 1) {
      const pairs = [];
      for (let i = 0; i < current.length; i += 2) {
        if (i + 1 < current.length) {
          pairs.push([current[i], current[i + 1]]);
        } else {
          pairs.push([current[i], null]); // bye
        }
      }
      rounds.push(pairs);
      current = pairs.map(p => p[0]); // placeholder
    }

    return { rounds, shuffled };
  }

  // --- Stats persistence ---

  function savePlayerStats(playerName) {
    const stats = JSON.parse(localStorage.getItem('al-asmaa-player-stats') || '{}');
    const player = players.find(p => p.name === playerName);
    if (!player) return;

    if (!stats[playerName]) {
      stats[playerName] = {
        gamesPlayed: 0,
        totalNames: 0,
        namesSet: []
      };
    }

    stats[playerName].gamesPlayed++;
    stats[playerName].totalNames += player.namesUsed.length;

    // Track unique names cited ever
    const existing = new Set(stats[playerName].namesSet);
    player.namesUsed.forEach(id => existing.add(id));
    stats[playerName].namesSet = Array.from(existing);

    localStorage.setItem('al-asmaa-player-stats', JSON.stringify(stats));
  }

  function getPlayerStats(playerName) {
    const stats = JSON.parse(localStorage.getItem('al-asmaa-player-stats') || '{}');
    return stats[playerName] || { gamesPlayed: 0, totalNames: 0, namesSet: [] };
  }

  function getAllPlayerStats() {
    return JSON.parse(localStorage.getItem('al-asmaa-player-stats') || '{}');
  }

  return {
    create,
    setPlayers,
    getPlayers,
    getActivePlayers,
    getCurrentPlayer,
    getCurrentIndex,
    nextPlayer,
    loseLife,
    addScore,
    addNameUsed,
    getAliveCount,
    isGameOver,
    getWinner,
    getRanking,
    reset,
    createTeams,
    getTeams,
    setTeams,
    setupDuel,
    createBracket,
    savePlayerStats,
    getPlayerStats,
    getAllPlayerStats
  };
})();
