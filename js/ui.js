/**
 * Al-Asmaa — UI Display & Transitions
 */

const UI = (() => {
  let currentLang = 'fr';

  function t(key) {
    return (UI_TRANSLATIONS[currentLang] && UI_TRANSLATIONS[currentLang][key]) || key;
  }

  function setLang(lang) {
    currentLang = lang;
    document.body.classList.toggle('rtl', lang === 'ar');
    localStorage.setItem('al-asmaa-lang', lang);
  }

  function getLang() {
    return currentLang;
  }

  function initLang() {
    const saved = localStorage.getItem('al-asmaa-lang');
    if (saved) setLang(saved);
  }

  // --- Toast notifications ---
  function showToast(message, duration) {
    duration = duration || 2500;
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  // --- Name popup (brief display after validation) ---
  function showNamePopup(name, duration) {
    duration = duration || 2000;
    const existing = document.querySelector('.name-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.className = 'name-popup';
    const meaningKey = currentLang === 'en' ? 'english' : 'french';
    popup.innerHTML = `
      <div class="name-popup-arabic">${name.arabic}</div>
      <div class="name-popup-translit">${name.transliteration}</div>
      <div class="name-popup-meaning">${name[meaningKey]}</div>
    `;
    document.body.appendChild(popup);
    requestAnimationFrame(() => popup.classList.add('show'));
    setTimeout(() => {
      popup.classList.remove('show');
      setTimeout(() => popup.remove(), 400);
    }, duration);
  }

  // --- Render players bar ---
  function renderPlayersBar(container, players, currentIndex) {
    let html = '<div class="players-bar">';
    players.forEach((p, i) => {
      const isActive = i === currentIndex && !p.eliminated;
      const classes = ['player-avatar'];
      if (isActive) classes.push('active');
      if (p.eliminated) classes.push('eliminated');

      html += `<div class="${classes.join(' ')}">
        <div class="player-avatar-icon">${p.name.charAt(0).toUpperCase()}</div>
        <div class="player-avatar-name">${p.name}</div>
        <div class="player-avatar-lives">`;
      for (let l = 0; l < 3; l++) {
        html += `<span class="heart ${l >= p.lives ? 'lost' : ''}">${l < p.lives ? '❤️' : '🖤'}</span>`;
      }
      html += `</div>
        <div class="player-avatar-score">${p.score}</div>
      </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
  }

  // --- Render names panel ---
  function renderNamesPanel(container, usedNames, showRemaining) {
    let html = `<div class="names-panel">
      <div class="names-panel-title">${t('namesUsed')} (${usedNames.length}/99)</div>`;
    usedNames.forEach(name => {
      html += `<span class="name-chip">
        <span>${name.transliteration}</span>
        <span class="name-arabic">${name.arabic}</span>
      </span>`;
    });
    html += '</div>';

    if (showRemaining) {
      const remaining = Modes.getRemainingNames();
      html += `<div class="names-panel" style="margin-top:8px;">
        <div class="names-panel-title">${t('namesRemaining')} (${remaining.length})</div>`;
      remaining.forEach(name => {
        html += `<span class="name-chip">
          <span>${name.transliteration}</span>
          <span class="name-arabic">${name.arabic}</span>
        </span>`;
      });
      html += '</div>';
    }
    container.innerHTML = html;
  }

  // --- Render current player highlight ---
  function renderCurrentPlayer(container, player) {
    container.innerHTML = `
      <div class="current-player player-turn-enter">
        <div class="current-player-label">${t('round')} ${Modes.getState().roundNumber + 1}</div>
        <div class="current-player-name">${player.name}</div>
      </div>
    `;
  }

  // --- Render category display ---
  function renderCategory(container, category) {
    const cat = CATEGORIES[category];
    const label = currentLang === 'en' ? cat.en : (currentLang === 'ar' ? cat.ar : cat.fr);
    container.innerHTML = `
      <div class="category-display category-change">
        <span class="category-icon">${cat.icon}</span>
        <span class="category-name">${label}</span>
      </div>
    `;
  }

  // --- Render letter display ---
  function renderLetter(container, letter) {
    if (!letter) {
      container.innerHTML = '';
      return;
    }
    container.innerHTML = `
      <div class="letter-display">
        <div class="letter-arabic">${letter.letter}</div>
        <div class="letter-name">${letter.name}</div>
      </div>
    `;
  }

  // --- Render quiz display ---
  function renderQuiz(container, name) {
    if (!name) return;
    const meaning = currentLang === 'en' ? name.english : name.french;
    container.innerHTML = `
      <div class="quiz-display">
        <div class="quiz-meaning">${meaning}</div>
        <div class="quiz-hint">${name.description}</div>
      </div>
    `;
  }

  // --- Render teams ---
  function renderTeams(container, teams, scores, currentTeam) {
    let html = '<div class="teams-container">';
    teams.forEach((team, i) => {
      html += `<div class="team-card ${i === currentTeam ? 'active' : ''}">
        <div class="team-name">${t('team' + (i + 1))}</div>
        <div class="team-score">${scores[i]}/10</div>
        <div class="team-members">${team.map(p => p.name).join(', ')}</div>
      </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
  }

  // --- Render duel ---
  function renderDuel(container, players, faults, currentPlayerIdx) {
    const p1 = players[0];
    const p2 = players[1];
    html = `<div class="duel-container">
      <div class="duel-player ${currentPlayerIdx === 0 ? 'active' : ''}">
        <div class="duel-player-name">${p1.name}</div>
        <div class="duel-faults">`;
    for (let i = 0; i < 3; i++) {
      html += `<div class="fault-dot ${i < faults.p1 ? 'active' : ''}"></div>`;
    }
    html += `</div></div>
      <div class="duel-vs">VS</div>
      <div class="duel-player ${currentPlayerIdx === 1 ? 'active' : ''}">
        <div class="duel-player-name">${p2.name}</div>
        <div class="duel-faults">`;
    for (let i = 0; i < 3; i++) {
      html += `<div class="fault-dot ${i < faults.p2 ? 'active' : ''}"></div>`;
    }
    html += `</div></div></div>`;
    container.innerHTML = html;
  }

  // --- Render consultation bar ---
  function renderConsultationBar(container) {
    container.innerHTML = `
      <div class="consultation-bar">
        <div class="consultation-fill" style="width:100%"></div>
      </div>
      <div class="text-center" style="font-size:0.8rem;opacity:0.7;">${t('consultation')}</div>
    `;
  }

  // --- Render phase indicator ---
  function renderPhaseIndicator(container, phase) {
    container.innerHTML = `
      <div class="phase-indicator phase-transition">
        ${t('phase')} ${phase} — ${Modes.getInfinitePhaseDescription(currentLang)}
      </div>
    `;
  }

  // --- Render end screen ---
  function renderEndScreen(container, gameResult) {
    const ranking = Players.getRanking();
    const usedNames = Modes.getUsedNames();
    const lastNameId = Modes.getState().namesUsed[Modes.getState().namesUsed.length - 1];
    const lastName = lastNameId ? Modes.getNameById(lastNameId) : null;
    const meaningKey = currentLang === 'en' ? 'english' : 'french';

    let html = '<div class="end-screen">';

    // Victory or defeat
    if (gameResult.victory) {
      html += `<h2 class="text-gold" style="font-size:1.8rem;">${t('victory')}</h2>`;
    }

    // Podium (if > 1 player)
    if (ranking.length > 1) {
      html += '<div class="podium">';
      if (ranking[2]) {
        html += `<div class="podium-place third animate">
          <div class="podium-rank">3</div>
          <div class="podium-name">${ranking[2].name}</div>
          <div class="podium-score">${ranking[2].score} pts</div>
        </div>`;
      }
      html += `<div class="podium-place first animate">
        <div class="podium-rank">1</div>
        <div class="podium-name">${ranking[0].name}</div>
        <div class="podium-score">${ranking[0].score} pts</div>
      </div>`;
      if (ranking[1]) {
        html += `<div class="podium-place second animate">
          <div class="podium-rank">2</div>
          <div class="podium-name">${ranking[1].name}</div>
          <div class="podium-score">${ranking[1].score} pts</div>
        </div>`;
      }
      html += '</div>';
    }

    // Last name cited
    if (lastName) {
      html += `<div class="last-name-display">
        <div class="last-name-label">${t('nameOfGame')}</div>
        <div class="last-name-arabic">${lastName.arabic}</div>
        <div class="last-name-trans">${lastName.transliteration} — ${lastName[meaningKey]}</div>
      </div>`;
    }

    // Names review
    if (usedNames.length > 0) {
      html += `<div class="card mt-16">
        <div class="card-title">${t('namesUsed')} (${usedNames.length}/99)</div>
        <div class="names-review">`;
      usedNames.forEach(name => {
        html += `<div class="names-review-item">
          <span class="nr-arabic">${name.arabic}</span>
          <span class="nr-trans">${name.transliteration}</span>
          <span class="nr-meaning">${name[meaningKey]}</span>
        </div>`;
      });
      html += '</div></div>';
    }

    // Action buttons
    html += `<div class="mt-24">
      <button class="btn btn-primary" onclick="App.replayGame()">${t('replay')}</button>
      <button class="btn btn-secondary" onclick="App.showModeSelect()">${t('changeMode')}</button>
      <button class="btn btn-secondary" onclick="App.goHome()">${t('mainMenu')}</button>`;

    // Learn missed names button
    const missed = Modes.getRemainingNames();
    if (missed.length > 0) {
      html += `<button class="btn btn-secondary" onclick="App.learnMissedNames()">${t('learnMissed')}</button>`;
    }

    html += '</div>';

    // Share score button
    html += `<div class="mt-16">
      <button class="btn btn-small btn-secondary" onclick="App.shareScore()">${t('shareScore')}</button>
    </div>`;

    html += '</div>';
    container.innerHTML = html;
  }

  // --- Render solo end screen ---
  function renderSoloEndScreen(container) {
    const progress = Modes.getSoloProgress();
    const meaningKey = currentLang === 'en' ? 'english' : 'french';
    let html = `<div class="end-screen">
      <h2 class="text-gold" style="font-size:1.8rem;">${t('score')}</h2>
      <div class="counter-badge">
        <span class="counter-number">${progress.correct}/99</span>
        <span class="counter-label">${t('memorized')}</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width:${progress.percentage}%"></div>
      </div>
      <div class="progress-text">${progress.percentage}%</div>`;

    // Check for Hafidh badge
    if (progress.correct === 99) {
      html += `<div class="badge badge-unlock mt-16">
        <span class="badge-icon">🏆</span>
        <span>${t('hafidh')}</span>
      </div>
      <p class="mt-8" style="font-size:0.85rem;opacity:0.7;">${t('hafidhDesc')}</p>`;
      // Save badge
      localStorage.setItem('al-asmaa-hafidh', 'true');
    }

    html += `<div class="mt-24">
      <button class="btn btn-primary" onclick="App.startSoloLearning()">${t('replay')}</button>
      <button class="btn btn-secondary" onclick="App.goHome()">${t('mainMenu')}</button>
    </div></div>`;
    container.innerHTML = html;
  }

  // --- Render flashcard ---
  function renderFlashcard(container, name, phase) {
    if (!name) return;
    const meaningKey = currentLang === 'en' ? 'english' : 'french';
    const cat = CATEGORIES[name.category];
    const catLabel = currentLang === 'en' ? cat.en : (currentLang === 'ar' ? cat.ar : cat.fr);

    let html = `<div class="flashcard ${phase === 'recall' ? '' : ''}" onclick="this.classList.toggle('flipped')">
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <span class="flashcard-number">${name.id}/99</span>
          <span class="flashcard-category">${cat.icon} ${catLabel}</span>
          <div class="flashcard-arabic">${name.arabic}</div>
          <div class="flashcard-translit">${name.transliteration}</div>
        </div>
        <div class="flashcard-back">
          <span class="flashcard-number">${name.id}/99</span>
          <div class="flashcard-meaning">${name[meaningKey]}</div>
          <div class="flashcard-desc">${name.description}</div>
          <div class="flashcard-verse">${name.quranVerse}</div>
        </div>
      </div>
    </div>`;
    container.innerHTML = html;
  }

  // --- Score sharing (Canvas API) ---
  function generateShareImage(callback) {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#1a472a';
    ctx.fillRect(0, 0, 600, 400);

    // Border
    ctx.strokeStyle = '#c9a84c';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 580, 380);

    // Title
    ctx.fillStyle = '#c9a84c';
    ctx.font = 'bold 28px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Al-Asmaa \u2014 \u0627\u0644\u0623\u0633\u0645\u0627\u0621', 300, 60);

    // Score info
    const ranking = Players.getRanking();
    const usedNames = Modes.getUsedNames();
    const state = Modes.getState();

    ctx.fillStyle = '#f5f0e8';
    ctx.font = '18px Poppins, sans-serif';
    ctx.fillText(`Mode: ${t(Modes.getModeInfo()[state.mode].nameKey)}`, 300, 110);
    ctx.fillText(`${t('namesUsed')}: ${usedNames.length}/99`, 300, 140);

    // Players
    ctx.font = 'bold 20px Poppins, sans-serif';
    let y = 190;
    ranking.slice(0, 5).forEach((p, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
      ctx.fillStyle = i === 0 ? '#c9a84c' : '#f5f0e8';
      ctx.fillText(`${medal} ${p.name} — ${p.score} pts`, 300, y);
      y += 35;
    });

    // Footer
    ctx.fillStyle = 'rgba(245, 240, 232, 0.4)';
    ctx.font = '12px Poppins, sans-serif';
    ctx.fillText(t('respect'), 300, 375);

    canvas.toBlob(blob => {
      if (callback) callback(blob, canvas);
    });
  }

  return {
    t,
    setLang,
    getLang,
    initLang,
    showToast,
    showNamePopup,
    renderPlayersBar,
    renderNamesPanel,
    renderCurrentPlayer,
    renderCategory,
    renderLetter,
    renderQuiz,
    renderTeams,
    renderDuel,
    renderConsultationBar,
    renderPhaseIndicator,
    renderEndScreen,
    renderSoloEndScreen,
    renderFlashcard,
    generateShareImage
  };
})();
