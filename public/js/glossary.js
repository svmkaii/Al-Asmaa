/**
 * Al-Asmaa — Module Lexique interactif
 * Surligne les termes techniques dans l'encyclopedie et affiche un lexique deroulant.
 *
 * API publique :
 *   Glossary.processText(text)       — Scan text, wrap terms in <span class="glossary-term">
 *   Glossary.renderLexiqueSection()  — HTML de la section Lexique (termes trouves dans la page)
 *   Glossary.bindEvents(container)   — Click delegation : terme -> scroll + open definition
 */
const Glossary = (() => {
  // --- State ---
  let compiledPatterns = null;   // Lazy-compiled regex list
  const foundTerms = new Set();  // Terms found in current page render

  // Category metadata (dot color + label)
  const CATEGORY_META = {
    morphologie: { color: '#60a5fa', label: 'Morphologie' },
    grammaire:   { color: '#4ade80', label: 'Grammaire' },
    theologie:   { color: '#c084fc', label: 'Th\u00e9ologie' },
    concept:     { color: '#f59e0b', label: 'Concept' }
  };

  // SVG icons
  const CHEVRON_SVG = '<svg class="glossary-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
  const LEXIQUE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M12 6v7"/><path d="M8 13h8"/></svg>';

  // --- Compile regex patterns (once) ---
  function getPatterns() {
    if (compiledPatterns) return compiledPatterns;

    // Apostrophe character class for flexible matching
    const APOS = "['\u2019\u2018'`\u02BC]";

    // Sort by term length descending to avoid partial matches
    const sorted = GLOSSARY_DATA.slice().sort((a, b) => b.term.length - a.term.length);

    compiledPatterns = sorted.map(entry => {
      // Build pattern from term: replace apostrophes with flexible class
      const escaped = escapeForRegex(entry.term).replace(/['\u2019\u2018'`\u02BC]/g, APOS);

      // Terms containing apostrophe or spaces use lookaround for boundaries
      const hasApostrophe = /['\u2019\u2018'`\u02BC]/.test(entry.term);
      const hasSpace = /\s/.test(entry.term);

      let pattern;
      if (hasApostrophe) {
        // Use word boundary where possible, lookaround for apostrophe terms
        pattern = '(?<=^|[\\s,;:.!()])' + escaped + '(?=$|[\\s,;:.!()])';
      } else if (hasSpace) {
        // Multi-word terms: word boundary at start and end
        pattern = '\\b' + escaped + '\\b';
      } else {
        pattern = '\\b' + escaped + '\\b';
      }

      return {
        regex: new RegExp(pattern, 'gi'),
        entry: entry
      };
    });

    return compiledPatterns;
  }

  function escapeForRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // --- Reset found terms (called before each page render) ---
  function reset() {
    foundTerms.clear();
  }

  // --- Process text: highlight glossary terms ---
  function processText(text) {
    if (!text || typeof GLOSSARY_DATA === 'undefined') return text || '';

    const patterns = getPatterns();

    // We work on plain text to avoid matching inside HTML tags.
    // Strategy: split text into HTML tags and text segments, only process text segments.
    const segments = text.split(/(<[^>]+>)/g);

    for (let i = 0; i < segments.length; i++) {
      // Skip HTML tags
      if (segments[i].charAt(0) === '<') continue;
      // Skip empty segments
      if (!segments[i]) continue;

      let seg = segments[i];
      // Track positions already wrapped to avoid double-matching
      const protected_ = [];

      patterns.forEach(({ regex, entry }) => {
        regex.lastIndex = 0;
        const termKey = entry.term.toLowerCase();

        seg = seg.replace(regex, (match, offset) => {
          // Check if this position overlaps with an already-wrapped term
          const end = offset + match.length;
          for (const p of protected_) {
            if (offset < p.end && end > p.start) return match;
          }

          foundTerms.add(termKey);
          const replacement = '<span class="glossary-term" data-glossary-term="' + termKey + '">' + match + '</span>';

          // Track the new wrapped position (accounting for added HTML length)
          protected_.push({ start: offset, end: end });

          return replacement;
        });
      });

      segments[i] = seg;
    }

    return segments.join('');
  }

  // --- Render the Lexique section (only if terms were found) ---
  function renderLexiqueSection() {
    if (foundTerms.size === 0 || typeof GLOSSARY_DATA === 'undefined') return '';

    // Gather matching entries
    const entries = GLOSSARY_DATA.filter(e => foundTerms.has(e.term.toLowerCase()));
    if (entries.length === 0) return '';

    // Sort by category then alphabetically
    const catOrder = { morphologie: 0, grammaire: 1, theologie: 2, concept: 3 };
    entries.sort((a, b) => {
      const ca = catOrder[a.category] || 99;
      const cb = catOrder[b.category] || 99;
      if (ca !== cb) return ca - cb;
      return a.term.localeCompare(b.term, 'fr');
    });

    let itemsHtml = '';
    entries.forEach((entry, idx) => {
      const meta = CATEGORY_META[entry.category] || { color: '#9ca3af', label: entry.category };
      const termId = 'glossary-def-' + entry.term.toLowerCase().replace(/[^a-z0-9]/g, '-');

      itemsHtml += '<div class="glossary-item" id="' + termId + '">' +
        '<button class="glossary-item-header" aria-expanded="false" aria-controls="glossary-body-' + idx + '">' +
          '<span class="glossary-item-dot" style="background:' + meta.color + ';"></span>' +
          '<span class="glossary-item-term">' + entry.term + '</span>' +
          '<span class="glossary-item-cat">' + meta.label + '</span>' +
          CHEVRON_SVG +
        '</button>' +
        '<div class="glossary-item-body" id="glossary-body-' + idx + '" aria-hidden="true">' +
          '<p>' + entry.definition + '</p>' +
        '</div>' +
      '</div>';
    });

    // Use encySection-style layout
    const sectionHtml =
      '<div class="ency-section-divider"><div class="ency-section-divider-diamond"></div></div>' +
      '<div class="ency-open-section glossary-section">' +
        '<div class="ency-detail-label">' +
          '<span class="ency-detail-label-icon">' + LEXIQUE_ICON + '</span> ' +
          'Lexique ' +
          '<span class="glossary-count-badge">' + entries.length + '</span>' +
        '</div>' +
        '<div class="ency-open-section-body">' +
          '<div class="glossary-items">' + itemsHtml + '</div>' +
        '</div>' +
      '</div>';

    return sectionHtml;
  }

  // --- Safe CSS escape (fallback for older browsers) ---
  function safeCssEscape(str) {
    if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(str);
    return str.replace(/([^\w-])/g, '\\$1');
  }

  // --- Toggle accordion item ---
  function toggleAccordion(header, container) {
    if (!header) return;
    var expanded = header.getAttribute('aria-expanded') === 'true';
    var bodyId = header.getAttribute('aria-controls');
    var body = bodyId ? container.querySelector('#' + safeCssEscape(bodyId)) : header.parentElement.querySelector('.glossary-item-body');
    header.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    if (body) body.setAttribute('aria-hidden', expanded ? 'true' : 'false');
  }

  // --- Bind events: click on term -> scroll to definition, accordion toggle ---
  function bindEvents(container) {
    if (!container) return;

    // Click delegation for glossary terms in text
    container.addEventListener('click', function(e) {
      var termSpan = e.target.closest('.glossary-term');
      if (termSpan) {
        e.preventDefault();
        e.stopPropagation();
        var termKey = termSpan.getAttribute('data-glossary-term');
        if (!termKey) return;
        var defId = 'glossary-def-' + termKey.replace(/[^a-z0-9]/g, '-');
        var defEl = container.querySelector('#' + safeCssEscape(defId));
        // Fallback: search by data attribute if ID lookup fails
        if (!defEl) {
          var items = container.querySelectorAll('.glossary-item');
          for (var i = 0; i < items.length; i++) {
            if (items[i].id === defId || items[i].id.indexOf(defId.substring(0, 20)) === 0) {
              defEl = items[i];
              break;
            }
          }
        }
        if (defEl) {
          // Open the accordion item
          var header = defEl.querySelector('.glossary-item-header');
          var body = defEl.querySelector('.glossary-item-body');
          if (header && body && header.getAttribute('aria-expanded') !== 'true') {
            header.setAttribute('aria-expanded', 'true');
            body.setAttribute('aria-hidden', 'false');
          }

          // Scroll to it with a short delay to let the accordion open
          setTimeout(function() {
            defEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 50);

          // Highlight animation
          defEl.classList.add('glossary-highlight');
          setTimeout(function() {
            defEl.classList.remove('glossary-highlight');
          }, 1500);
        }
        return;
      }

      // Click delegation for accordion headers
      var header = e.target.closest('.glossary-item-header');
      if (header) {
        e.preventDefault();
        e.stopPropagation();
        toggleAccordion(header, container);
      }
    });
  }

  // --- Public API ---
  return {
    processText: function(text) {
      return processText(text);
    },
    renderLexiqueSection: function() {
      var html = renderLexiqueSection();
      reset(); // Clear found terms for next render
      return html;
    },
    bindEvents: function(container) {
      bindEvents(container);
    },
    reset: function() {
      reset();
    }
  };
})();
