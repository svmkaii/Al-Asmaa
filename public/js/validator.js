/**
 * Al-Asmaa — Validateur de noms
 * Systeme de validation tolerant pour la saisie des 99 noms d'Allah
 *
 * Ce module fournit :
 *  - La normalisation de texte (latin et arabe)
 *  - La validation d'une reponse (match exact, variantes, puis flou)
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

  // ---------------------------------------------------------------------------
  // Distance de Levenshtein
  // ---------------------------------------------------------------------------

  /**
   * Calcule la distance d'edition (Levenshtein) entre deux chaines.
   * Utilise la programmation dynamique classique en O(n*m).
   *
   * @param {string} a - Premiere chaine
   * @param {string} b - Deuxieme chaine
   * @returns {number} Distance d'edition minimale
   */
  function levenshtein(a, b) {
    const aLen = a.length;
    const bLen = b.length;

    // Cas triviaux
    if (aLen === 0) return bLen;
    if (bLen === 0) return aLen;

    // Matrice (bLen+1) x (aLen+1)
    const matrix = [];

    // Initialisation de la premiere colonne
    for (let i = 0; i <= bLen; i++) {
      matrix[i] = [i];
    }
    // Initialisation de la premiere ligne
    for (let j = 0; j <= aLen; j++) {
      matrix[0][j] = j;
    }

    // Remplissage
    for (let i = 1; i <= bLen; i++) {
      for (let j = 1; j <= aLen; j++) {
        if (b[i - 1] === a[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1]; // Caracteres identiques
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // Substitution
            matrix[i][j - 1] + 1,      // Insertion
            matrix[i - 1][j] + 1       // Suppression
          );
        }
      }
    }

    return matrix[bLen][aLen];
  }

  // ---------------------------------------------------------------------------
  // Validation d'une reponse
  // ---------------------------------------------------------------------------

  /**
   * Verifie si l'input du joueur correspond a l'un des 99 noms.
   *
   * Strategie en trois phases :
   *  1. Match exact sur la translitteration normalisee, l'arabe, et les variantes
   *  2. Match flou (Levenshtein) avec tolerance adaptative
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

    // --- Phase 2 : Match flou (Levenshtein) -----------------------------------

    let bestMatch = null;
    let bestDistance = Infinity;

    for (const name of namesData) {
      const nameNorm = normalize(name.transliteration);
      const dist = levenshtein(normalizedInput, nameNorm);

      // Tolerance adaptative :
      //  - noms de plus de 6 caracteres (normalises) => distance max de 2
      //  - noms plus courts => distance max de 1
      const maxDist = nameNorm.length > 6 ? 2 : 1;

      if (dist <= maxDist && dist < bestDistance) {
        bestDistance = dist;
        bestMatch = name;
      }
    }

    if (bestMatch) {
      if (usedNames.includes(bestMatch.id)) {
        return { valid: false, nameId: bestMatch.id, canonicalName: bestMatch.transliteration, message: 'already-used' };
      }
      return { valid: true, nameId: bestMatch.id, canonicalName: bestMatch.transliteration, message: 'correct' };
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
   *  1 = match flou (distance <= 1 sur le debut)
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

      // Priorite basse : match flou sur le debut du nom
      const dist = levenshtein(normalizedInput, nameNorm.substring(0, normalizedInput.length));
      if (dist <= 1) {
        results.push({ ...name, relevance: 1 });
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
    levenshtein
  };
})();
