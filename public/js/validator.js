/**
 * Al-Asmaa — Validateur de noms
 * Systeme de validation tolerant pour la saisie des 99 noms d'Allah
 *
 * Ce module fournit :
 *  - La normalisation de texte (latin et arabe)
 *  - La validation d'une reponse (match exact, variantes, puis collapsed)
 *  - Des suggestions d'autocompletion en temps reel
 */
const Validator = (() => {
  // ---------------------------------------------------------------------------
  // Normalisation
  // ---------------------------------------------------------------------------

  /**
   * Normalise une chaine latine pour la comparaison :
   *  - passage en minuscules
   *  - decomposition Unicode (NFD) puis suppression des diacritiques latins
   *  - suppression des tashkeel arabes eventuels
   *  - suppression des tirets, espaces, apostrophes et variantes d'apostrophes
   *  - retrait du prefixe article (al-, ar-, as-, at-, etc.)
   */
  function normalize(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')           // Diacritiques latins (accents, cedilles, etc.)
      .replace(/[\u064B-\u065F\u0670]/g, '')     // Tashkeel arabe (fatha, damma, kasra, shadda, sukun, etc.)
      .replace(/[-\s\u2019\u2018''`\u02BC]/g, '') // Tirets, espaces, apostrophes (droites, courbes, modificatrices)
      .replace(/^(ash|adh|dhul|al|ar|as|at|az|ad|an)/, '') // Prefixes articles courants
      .trim();
  }

  /**
   * Normalise specifiquement une chaine arabe :
   *  - suppression des tashkeel (voyelles courtes, shadda, sukun, alef khanjariyya)
   *  - suppression des espaces
   */
  function normalizeArabic(str) {
    return str
      .replace(/[\u064B-\u065F\u0670]/g, '') // Fatha, Damma, Kasra, Shadda, Sukun, Alef khanjariyya
      .replace(/\s+/g, '')
      .trim();
  }

  /**
   * Normalisation "collapsed" : tolere les doubles lettres, espaces, tirets
   * mais preserve les consonnes (pas de substitution).
   * NE supprime PAS le prefixe article — il est collapsé naturellement.
   */
  function normalizeCollapsed(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/[-\s\u2019\u2018''`\u02BC]/g, '')
      .replace(/(.)\1+/g, '$1')
      .trim();
  }

  // ---------------------------------------------------------------------------
  // Validation d'une reponse
  // ---------------------------------------------------------------------------

  /**
   * Verifie si l'input du joueur correspond a l'un des 99 noms.
   *
   * Strategie en trois phases :
   *  1. Match exact sur la translitteration normalisee, l'arabe, et les variantes
   *  2. Match collapsed (tolere doubles lettres uniquement)
   *  3. Aucun match => reponse inconnue
   *
   * @param {string}   input     - Texte saisi par le joueur
   * @param {number[]} usedNames - IDs des noms deja trouves dans la partie
   * @param {Object[]} namesData - Liste des 99 noms (id, transliteration, arabic, variants[])
   * @returns {{ valid: boolean, nameId: number|null, canonicalName: string|null, message: string }}
   */
  function validateAnswer(input, usedNames, namesData) {
    // Entree vide
    if (!input || input.trim().length === 0) {
      return { valid: false, nameId: null, canonicalName: null, message: 'Entree vide' };
    }

    const normalizedInput = normalize(input);
    const arabicInput = normalizeArabic(input);

    // --- Phase 1 : Match exact (translitteration, arabe, variantes) -----------

    for (const name of namesData) {
      // Comparaison sur la translitteration normalisee
      if (normalize(name.transliteration) === normalizedInput) {
        if (usedNames.includes(name.id)) {
          return { valid: false, nameId: name.id, canonicalName: name.transliteration, message: 'already-used' };
        }
        return { valid: true, nameId: name.id, canonicalName: name.transliteration, message: 'correct' };
      }

      // Comparaison sur le texte arabe normalise
      if (normalizeArabic(name.arabic) === arabicInput) {
        if (usedNames.includes(name.id)) {
          return { valid: false, nameId: name.id, canonicalName: name.transliteration, message: 'already-used' };
        }
        return { valid: true, nameId: name.id, canonicalName: name.transliteration, message: 'correct' };
      }

      // Comparaison sur les variantes declarees
      if (name.variants) {
        for (const variant of name.variants) {
          if (normalize(variant) === normalizedInput || normalizeArabic(variant) === arabicInput) {
            if (usedNames.includes(name.id)) {
              return { valid: false, nameId: name.id, canonicalName: name.transliteration, message: 'already-used' };
            }
            return { valid: true, nameId: name.id, canonicalName: name.transliteration, message: 'correct' };
          }
        }
      }
    }

    // --- Phase 2 : Match collapsed (tolere doubles lettres) -------------------

    const collapsedInput = normalizeCollapsed(input);

    for (const name of namesData) {
      if (normalizeCollapsed(name.transliteration) === collapsedInput) {
        if (usedNames.includes(name.id)) {
          return { valid: false, nameId: name.id, canonicalName: name.transliteration, message: 'already-used' };
        }
        return { valid: true, nameId: name.id, canonicalName: name.transliteration, message: 'correct' };
      }

      if (name.variants) {
        for (const variant of name.variants) {
          if (normalizeCollapsed(variant) === collapsedInput) {
            if (usedNames.includes(name.id)) {
              return { valid: false, nameId: name.id, canonicalName: name.transliteration, message: 'already-used' };
            }
            return { valid: true, nameId: name.id, canonicalName: name.transliteration, message: 'correct' };
          }
        }
      }
    }

    // --- Phase 3 : Aucun match ------------------------------------------------

    return { valid: false, nameId: null, canonicalName: null, message: 'unknown' };
  }

  // ---------------------------------------------------------------------------
  // Suggestions d'autocompletion
  // ---------------------------------------------------------------------------

  /**
   * Retourne une liste de suggestions en temps reel basee sur l'input partiel.
   *
   * Les resultats sont classes par pertinence :
   *  3 = commence par l'input
   *  2 = contient l'input (ou variante/arabe correspond)
   *  1 = match collapsed (debut du nom correspond apres collapsage)
   *
   * Les noms deja utilises sont exclus des suggestions.
   *
   * @param {string}   input      - Texte saisi (au moins 2 caracteres)
   * @param {number[]} usedNames  - IDs des noms deja trouves
   * @param {Object[]} namesData  - Liste des 99 noms
   * @param {number}   maxResults - Nombre maximum de suggestions (defaut : 5)
   * @returns {Object[]} Liste de noms enrichis d'un champ `relevance`
   */
  function getSuggestions(input, usedNames, namesData, maxResults = 5) {
    if (!input || input.trim().length < 2) return [];

    const normalizedInput = normalize(input);
    const collapsedInput = normalizeCollapsed(input);
    const results = [];

    for (const name of namesData) {
      // Exclure les noms deja utilises
      if (usedNames.includes(name.id)) continue;

      const nameNorm = normalize(name.transliteration);

      // Priorite haute : commence par l'input
      if (nameNorm.startsWith(normalizedInput)) {
        results.push({ ...name, relevance: 3 });
        continue;
      }

      // Priorite moyenne : contient l'input
      if (nameNorm.includes(normalizedInput)) {
        results.push({ ...name, relevance: 2 });
        continue;
      }

      // Priorite basse : collapsed match sur le debut du nom
      const nameCollapsed = normalizeCollapsed(name.transliteration);
      if (nameCollapsed.startsWith(collapsedInput)) {
        results.push({ ...name, relevance: 1 });
        continue;
      }

      // Recherche dans les variantes
      if (name.variants) {
        for (const variant of name.variants) {
          const varNorm = normalize(variant);
          if (varNorm.startsWith(normalizedInput) || varNorm.includes(normalizedInput)) {
            if (!results.find(r => r.id === name.id)) {
              results.push({ ...name, relevance: 2 });
            }
            break;
          }
        }
      }

      // Recherche en arabe si l'input contient des caracteres arabes
      if (input.match(/[\u0600-\u06FF]/)) {
        const arabicNorm = normalizeArabic(name.arabic);
        const arabicInputNorm = normalizeArabic(input);
        if (arabicNorm.includes(arabicInputNorm)) {
          if (!results.find(r => r.id === name.id)) {
            results.push({ ...name, relevance: 2 });
          }
        }
      }
    }

    // Trier par pertinence decroissante et limiter le nombre de resultats
    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, maxResults);
  }

  // ---------------------------------------------------------------------------
  // API publique
  // ---------------------------------------------------------------------------

  return {
    validate: validateAnswer,
    suggest: getSuggestions,
    normalize,
    normalizeArabic,
    normalizeCollapsed
  };
})();
