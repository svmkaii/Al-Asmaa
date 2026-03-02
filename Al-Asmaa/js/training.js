/**
 * Al-Asmaa — Training Module (Spaced Repetition)
 */

const Training = (() => {
  const STORAGE_KEY = 'al-asmaa-training-progress';
  const BASE_INTERVAL = 3600000; // 1 hour in milliseconds
  const SESSION_SIZE = 10;
  const MASTERED_THRESHOLD = 4;

  // --- localStorage helpers ---

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  // --- Status helpers ---

  function getStatusFromEntry(entry) {
    if (!entry || entry.score === 0) return 'new';
    if (entry.score >= MASTERED_THRESHOLD) return 'mastered';
    return 'learning';
  }

  function getNameStatus(nameId) {
    const progress = loadProgress();
    return getStatusFromEntry(progress[nameId]);
  }

  function getAllStatuses() {
    const progress = loadProgress();
    const statuses = {};
    ASMA_UL_HUSNA.forEach(function (name) {
      statuses[name.id] = getStatusFromEntry(progress[name.id]);
    });
    return statuses;
  }

  // --- Progress summary ---

  function getProgress() {
    const progress = loadProgress();
    const total = ASMA_UL_HUSNA.length;
    let mastered = 0;
    let inProgress = 0;
    let newCount = 0;

    ASMA_UL_HUSNA.forEach(function (name) {
      var status = getStatusFromEntry(progress[name.id]);
      if (status === 'mastered') mastered++;
      else if (status === 'learning') inProgress++;
      else newCount++;
    });

    var percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;

    return {
      mastered: mastered,
      inProgress: inProgress,
      newCount: newCount,
      total: total,
      percentage: percentage
    };
  }

  // --- Spaced repetition scheduling ---

  function isDueForReview(entry, now) {
    if (!entry) return false;
    if (entry.score === 0) return false;
    return (entry.lastSeen + entry.interval) < now;
  }

  function getSessionNames(mode, category) {
    var progress = loadProgress();
    var now = Date.now();

    // Filter names by category if specified
    var pool = ASMA_UL_HUSNA;
    if (category && category !== 'all') {
      pool = pool.filter(function (name) {
        return name.category === category;
      });
    }

    // Separate names into priority groups
    var dueForReview = [];
    var lowScore = [];
    var newNames = [];

    pool.forEach(function (name) {
      var entry = progress[name.id];
      if (!entry || entry.score === 0) {
        newNames.push(name);
      } else if (isDueForReview(entry, now)) {
        dueForReview.push(name);
      } else if (entry.score < MASTERED_THRESHOLD) {
        lowScore.push(name);
      }
    });

    // Sort due-for-review by how overdue they are (most overdue first)
    dueForReview.sort(function (a, b) {
      var entryA = progress[a.id];
      var entryB = progress[b.id];
      var overdueA = now - (entryA.lastSeen + entryA.interval);
      var overdueB = now - (entryB.lastSeen + entryB.interval);
      return overdueB - overdueA;
    });

    // Sort low-score names by score ascending (lowest first)
    lowScore.sort(function (a, b) {
      return progress[a.id].score - progress[b.id].score;
    });

    // Build session: prioritize due names, then low scores, then new
    var session = [];

    // 1) Names due for review
    for (var i = 0; i < dueForReview.length && session.length < SESSION_SIZE; i++) {
      session.push(dueForReview[i]);
    }

    // 2) Names with lowest scores (still learning)
    for (var j = 0; j < lowScore.length && session.length < SESSION_SIZE; j++) {
      session.push(lowScore[j]);
    }

    // 3) New names
    for (var k = 0; k < newNames.length && session.length < SESSION_SIZE; k++) {
      session.push(newNames[k]);
    }

    // If we still have room and there are mastered names not due, fill with them
    if (session.length < SESSION_SIZE) {
      var remaining = pool.filter(function (name) {
        return !session.some(function (s) { return s.id === name.id; });
      });
      for (var m = 0; m < remaining.length && session.length < SESSION_SIZE; m++) {
        session.push(remaining[m]);
      }
    }

    return session;
  }

  // --- Record an answer ---

  function recordAnswer(nameId, quality) {
    var progress = loadProgress();
    var now = Date.now();

    var entry = progress[nameId] || {
      score: 0,
      lastSeen: now,
      interval: BASE_INTERVAL,
      repetitions: 0
    };

    switch (quality) {
      case 0: // Wrong
        entry.score = Math.max(0, entry.score - 1);
        entry.interval = BASE_INTERVAL; // Reset interval
        break;
      case 1: // Hard
        entry.score = Math.min(5, entry.score + 1);
        entry.interval = entry.interval * 2; // Double interval
        break;
      case 2: // Easy
        entry.score = Math.min(5, entry.score + 2);
        entry.interval = entry.interval * 2; // Double interval
        break;
      default:
        break;
    }

    entry.lastSeen = now;
    entry.repetitions++;

    progress[nameId] = entry;
    saveProgress(progress);

    return getStatusFromEntry(entry);
  }

  // --- Reset ---

  function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // --- Public API ---

  return {
    getProgress: getProgress,
    getSessionNames: getSessionNames,
    recordAnswer: recordAnswer,
    resetProgress: resetProgress,
    getNameStatus: getNameStatus,
    getAllStatuses: getAllStatuses
  };
})();
