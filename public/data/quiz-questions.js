/**
 * Ilm Quest — Questions de quiz islamique
 * 30+ questions sourcées couvrant les thèmes fondamentaux
 */
const ILM_QUEST_QUESTIONS = [
  // ===== 5 PILIERS DE L'ISLAM =====
  {
    id: 1,
    difficulty: 'debutant',
    type: 'qcm',
    question: 'Quel est le premier pilier de l\'Islam ?',
    answers: ['La Shahada (attestation de foi)', 'La Salat (prière)', 'Le Hajj (pèlerinage)', 'La Zakat (aumône)'],
    correct: 0,
    source: {
      type: 'hadith',
      arabic: 'بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
      translation: 'L\'Islam est bâti sur cinq piliers : l\'attestation qu\'il n\'y a de divinité digne d\'adoration qu\'Allah et que Muhammad est Son messager…',
      reference: 'Sahih Al-Boukhari, hadith n°8 ; Sahih Muslim, hadith n°16',
      scholar: ''
    }
  },
  {
    id: 2,
    difficulty: 'debutant',
    type: 'qcm',
    question: 'Combien de prières obligatoires le musulman doit-il accomplir chaque jour ?',
    answers: ['3', '4', '5', '7'],
    correct: 2,
    source: {
      type: 'hadith',
      arabic: 'خَمْسُ صَلَوَاتٍ كَتَبَهُنَّ اللَّهُ عَلَى الْعِبَادِ',
      translation: 'Cinq prières qu\'Allah a prescrites à Ses serviteurs.',
      reference: 'Sahih Muslim, hadith n°82',
      scholar: ''
    }
  },
  {
    id: 3,
    difficulty: 'intermediaire',
    type: 'qcm',
    question: 'Quel est le seuil minimal de richesse (Nisab) pour que la Zakat soit obligatoire sur l\'or ?',
    answers: ['20 dinars (85g d\'or)', '40 dinars (170g d\'or)', '10 dinars (42.5g d\'or)', '50 dinars (212g d\'or)'],
    correct: 0,
    source: {
      type: 'scholar',
      arabic: 'وَلَيْسَ فِيمَا دُونَ خَمْسِ أَوَاقٍ مِنَ الْوَرِقِ صَدَقَةٌ',
      translation: 'Le Nisab de l\'or est de 20 dinars, soit environ 85 grammes d\'or.',
      reference: 'Sahih Al-Boukhari, hadith n°1459',
      scholar: 'Cheikh Al-Fawzan, Al-Mulakhkhas Al-Fiqhi'
    }
  },
  {
    id: 4,
    difficulty: 'debutant',
    type: 'vrai_faux',
    question: 'Le jeûne du mois de Ramadan est le quatrième pilier de l\'Islam.',
    answers: ['Vrai', 'Faux'],
    correct: 0,
    source: {
      type: 'hadith',
      arabic: 'وَصَوْمِ رَمَضَانَ',
      translation: '…et le jeûne du Ramadan (4ème pilier dans l\'ordre du hadith de Jibril).',
      reference: 'Sahih Al-Boukhari, hadith n°8 ; Sahih Muslim, hadith n°16',
      scholar: ''
    }
  },
  {
    id: 5,
    difficulty: 'intermediaire',
    type: 'qcm',
    question: 'Lequel de ces actes annule le jeûne selon la majorité des savants ?',
    answers: ['Se brosser les dents avec un siwak', 'Manger ou boire volontairement', 'Se parfumer', 'Prendre une douche'],
    correct: 1,
    source: {
      type: 'scholar',
      arabic: 'مَنْ أَكَلَ أَوْ شَرِبَ نَاسِيًا فَلْيُتِمَّ صَوْمَهُ فَإِنَّمَا أَطْعَمَهُ اللَّهُ وَسَقَاهُ',
      translation: 'Celui qui mange ou boit par oubli, qu\'il continue son jeûne, car c\'est Allah qui l\'a nourri et abreuvé.',
      reference: 'Sahih Al-Boukhari, hadith n°1933 ; Sahih Muslim, hadith n°1155',
      scholar: 'Imam An-Nawawi, Al-Majmu\''
    }
  },

  // ===== 6 PILIERS DE LA FOI =====
  {
    id: 6,
    difficulty: 'debutant',
    type: 'qcm',
    question: 'Combien y a-t-il de piliers de la foi (Iman) en Islam ?',
    answers: ['5', '6', '7', '4'],
    correct: 1,
    source: {
      type: 'hadith',
      arabic: 'أَنْ تُؤْمِنَ بِاللَّهِ وَمَلائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الآخِرِ وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ',
      translation: 'Que tu crois en Allah, en Ses Anges, en Ses Livres, en Ses Messagers, au Jour Dernier, et que tu crois au Destin, son bien et son mal.',
      reference: 'Sahih Muslim, hadith n°8 (hadith de Jibril)',
      scholar: ''
    }
  },
  {
    id: 7,
    difficulty: 'intermediaire',
    type: 'qcm',
    question: 'Dans le hadith de Jibril, quel est le sixième pilier de la foi ?',
    answers: ['La croyance aux Anges', 'La croyance au Jour Dernier', 'La croyance au Destin (Al-Qadr)', 'La croyance aux Prophètes'],
    correct: 2,
    source: {
      type: 'hadith',
      arabic: 'وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ',
      translation: '…et que tu crois au Destin, son bien et son mal.',
      reference: 'Sahih Muslim, hadith n°8 (hadith de Jibril)',
      scholar: ''
    }
  },
  {
    id: 8,
    difficulty: 'avance',
    type: 'qcm',
    question: 'Quel ange a été chargé de transmettre la Révélation aux Prophètes ?',
    answers: ['Mikail', 'Israfil', 'Jibril (Gabriel)', 'Malik'],
    correct: 2,
    source: {
      type: 'quran',
      arabic: 'قُلْ مَن كَانَ عَدُوًّا لِّجِبْرِيلَ فَإِنَّهُ نَزَّلَهُ عَلَىٰ قَلْبِكَ بِإِذْنِ اللَّهِ',
      translation: 'Dis : « Quiconque est ennemi de Jibril, c\'est lui qui l\'a fait descendre sur ton cœur, par la permission d\'Allah. »',
      reference: 'Sourate Al-Baqara, verset 97',
      scholar: 'Tafsir Ibn Kathir'
    }
  },
  {
    id: 9,
    difficulty: 'debutant',
    type: 'vrai_faux',
    question: 'La croyance aux Livres révélés fait partie des piliers de la foi.',
    answers: ['Vrai', 'Faux'],
    correct: 0,
    source: {
      type: 'hadith',
      arabic: 'وَكُتُبِهِ',
      translation: '…et en Ses Livres (parmi les piliers de la foi mentionnés dans le hadith de Jibril).',
      reference: 'Sahih Muslim, hadith n°8 (hadith de Jibril)',
      scholar: ''
    }
  },

  // ===== NOMS ET ATTRIBUTS D'ALLAH (AQIDA) =====
  {
    id: 10,
    difficulty: 'debutant',
    type: 'qcm',
    question: 'Combien de Noms parfaits Allah possède-t-Il selon le hadith célèbre ?',
    answers: ['77', '99', '100', '114'],
    correct: 1,
    source: {
      type: 'hadith',
      arabic: 'إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا مِائَةً إِلاَّ وَاحِدًا مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ',
      translation: 'Allah possède quatre-vingt-dix-neuf Noms, cent moins un. Quiconque les apprend (les retient) entrera au Paradis.',
      reference: 'Sahih Al-Boukhari, hadith n°2736 ; Sahih Muslim, hadith n°2677',
      scholar: ''
    }
  },
  {
    id: 11,
    difficulty: 'intermediaire',
    type: 'qcm',
    question: 'Que signifie le Nom d\'Allah « Al-Wadud » (الودود) ?',
    answers: ['Le Très Miséricordieux', 'Le Bien-Aimant', 'Le Très Sage', 'Le Tout-Puissant'],
    correct: 1,
    source: {
      type: 'quran',
      arabic: 'وَهُوَ الْغَفُورُ الْوَدُودُ',
      translation: 'Et c\'est Lui le Pardonneur, le Bien-Aimant.',
      reference: 'Sourate Al-Buruj, verset 14',
      scholar: 'Ibn Al-Uthaymin, Sharh Al-Aqida Al-Wasitiyya'
    }
  },
  {
    id: 12,
    difficulty: 'avance',
    type: 'qcm',
    question: 'Selon la Aqida des Ahl As-Sunna, comment doit-on comprendre les Attributs d\'Allah ?',
    answers: [
      'On les interprète métaphoriquement (ta\'wil)',
      'On les affirme tels qu\'ils sont, sans les assimiler ni les nier (ithbat bila tashbih wa la ta\'til)',
      'On les nie car ils impliquent de l\'anthropomorphisme',
      'On les ignore et on ne les mentionne pas'
    ],
    correct: 1,
    source: {
      type: 'scholar',
      arabic: 'لَيْسَ كَمِثْلِهِ شَيْءٌ وَهُوَ السَّمِيعُ الْبَصِيرُ',
      translation: 'Il n\'y a rien qui Lui ressemble, et c\'est Lui l\'Audient, le Clairvoyant.',
      reference: 'Sourate Ash-Shura, verset 11',
      scholar: 'Ibn Al-Uthaymin, Sharh Al-Aqida Al-Wasitiyya'
    }
  },
  {
    id: 13,
    difficulty: 'avance',
    type: 'qcm',
    question: 'Quel Nom d\'Allah signifie « Celui qui accorde la sécurité » ?',
    answers: ['Al-Muhaymin (المهيمن)', 'Al-Mu\'min (المؤمن)', 'Al-Hafiz (الحفيظ)', 'As-Salam (السلام)'],
    correct: 1,
    source: {
      type: 'quran',
      arabic: 'هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ',
      translation: 'C\'est Lui Allah, nulle divinité autre que Lui, le Souverain, le Pur, la Paix, Celui qui accorde la sécurité…',
      reference: 'Sourate Al-Hashr, verset 23',
      scholar: 'Cheikh Al-Fawzan, Al-Mulakhkhas Al-Fiqhi'
    }
  },

  // ===== SEERAH DU PROPHÈTE ﷺ =====
  {
    id: 14,
    difficulty: 'debutant',
    type: 'qcm',
    question: 'Dans quelle ville est né le Prophète Muhammad ﷺ ?',
    answers: ['Médine', 'La Mecque', 'Ta\'if', 'Jérusalem'],
    correct: 1,
    source: {
      type: 'scholar',
      arabic: 'وُلِدَ النَّبِيُّ ﷺ بِمَكَّةَ عَامَ الْفِيلِ',
      translation: 'Le Prophète ﷺ est né à La Mecque l\'année de l\'Éléphant.',
      reference: 'Ibn Kathir, Al-Bidaya wan-Nihaya, vol. 2',
      scholar: 'Ibn Kathir'
    }
  },
  {
    id: 15,
    difficulty: 'intermediaire',
    type: 'qcm',
    question: 'À quel âge le Prophète ﷺ a-t-il reçu la première révélation ?',
    answers: ['25 ans', '30 ans', '40 ans', '50 ans'],
    correct: 2,
    source: {
      type: 'scholar',
      arabic: 'أُنْزِلَ عَلَيْهِ الْوَحْيُ وَهُوَ ابْنُ أَرْبَعِينَ سَنَةً',
      translation: 'La révélation lui fut descendue alors qu\'il avait quarante ans.',
      reference: 'Ibn Kathir, Al-Bidaya wan-Nihaya, vol. 3',
      scholar: 'Ibn Kathir'
    }
  },
  {
    id: 16,
    difficulty: 'intermediaire',
    type: 'qcm',
    question: 'Quelle est la première sourate révélée au Prophète ﷺ ?',
    answers: ['Sourate Al-Fatiha', 'Sourate Al-Alaq (les 5 premiers versets)', 'Sourate Al-Baqara', 'Sourate Al-Muddathir'],
    correct: 1,
    source: {
      type: 'hadith',
      arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
      translation: 'Lis ! Au nom de ton Seigneur qui a créé.',
      reference: 'Sahih Al-Boukhari, hadith n°3 ; Sourate Al-Alaq, versets 1-5',
      scholar: 'Ibn Kathir, Al-Bidaya wan-Nihaya'
    }
  },
  {
    id: 17,
    difficulty: 'avance',
    type: 'qcm',
    question: 'En quelle année de la révélation a eu lieu l\'Hégire (migration vers Médine) ?',
    answers: ['La 10ème année', 'La 13ème année', 'La 15ème année', 'La 8ème année'],
    correct: 1,
    source: {
      type: 'scholar',
      arabic: 'هَاجَرَ النَّبِيُّ ﷺ إِلَى الْمَدِينَةِ بَعْدَ ثَلاَثَ عَشْرَةَ سَنَةً مِنَ الْبِعْثَةِ',
      translation: 'Le Prophète ﷺ émigra à Médine treize ans après le début de la Révélation.',
      reference: 'Ibn Kathir, Al-Bidaya wan-Nihaya, vol. 3',
      scholar: 'Ibn Kathir'
    }
  },

  // ===== FIQH (PRIÈRE, ZAKAT, JEÛNE, HAJJ) =====
  {
    id: 18,
    difficulty: 'debutant',
    type: 'qcm',
    question: 'Combien de rak\'aat comporte la prière du Dhuhr (midi) ?',
    answers: ['2', '3', '4', '5'],
    correct: 2,
    source: {
      type: 'scholar',
      arabic: 'صَلاَةُ الظُّهْرِ أَرْبَعُ رَكَعَاتٍ',
      translation: 'La prière du Dhuhr comporte quatre rak\'aat.',
      reference: 'Imam Ash-Shafi\'i, Al-Umm, Kitab As-Salat',
      scholar: 'Imam Ash-Shafi\'i'
    }
  },
  {
    id: 19,
    difficulty: 'intermediaire',
    type: 'qcm',
    question: 'Quel est le pourcentage de Zakat obligatoire sur l\'argent et l\'or ?',
    answers: ['1%', '2.5%', '5%', '10%'],
    correct: 1,
    source: {
      type: 'scholar',
      arabic: 'رُبْعُ الْعُشْرِ',
      translation: 'Le quart du dixième, soit 2.5% de la richesse épargnée pendant un an lunaire.',
      reference: 'Imam Malik, Al-Muwatta, Kitab Az-Zakat',
      scholar: 'Imam Malik'
    }
  },
  {
    id: 20,
    difficulty: 'avance',
    type: 'qcm',
    question: 'Selon l\'Imam Abu Hanifa, quel est le nombre minimal de personnes requises pour la prière du Jumu\'a (vendredi) ?',
    answers: ['2 personnes (imam + 1)', '3 personnes (imam + 2)', '4 personnes (imam + 3)', '12 personnes'],
    correct: 1,
    source: {
      type: 'scholar',
      arabic: 'أَقَلُّ الْجَمَاعَةِ فِي الْجُمُعَةِ ثَلاَثَةٌ سِوَى الإِمَامِ عِنْدَ أَبِي حَنِيفَةَ',
      translation: 'Le minimum pour la prière du vendredi est de trois personnes en dehors de l\'imam selon Abu Hanifa (soit imam + 3).',
      reference: 'Abu Hanifa, Al-Fiqh Al-Akbar ; voir aussi Al-Hidaya de Al-Marghinani',
      scholar: 'Imam Abu Hanifa'
    }
  },
  {
    id: 21,
    difficulty: 'intermediaire',
    type: 'vrai_faux',
    question: 'Le Tawaf autour de la Ka\'ba se compose de 7 tours.',
    answers: ['Vrai', 'Faux'],
    correct: 0,
    source: {
      type: 'hadith',
      arabic: 'طَافَ النَّبِيُّ ﷺ بِالْبَيْتِ سَبْعًا',
      translation: 'Le Prophète ﷺ fit le tour de la Maison (Ka\'ba) sept fois.',
      reference: 'Sahih Al-Boukhari, hadith n°1602 ; Sahih Muslim, hadith n°1218',
      scholar: ''
    }
  },

  // ===== TAFSIR DE VERSETS =====
  {
    id: 22,
    difficulty: 'debutant',
    type: 'qcm',
    question: 'Combien de versets comporte la sourate Al-Fatiha ?',
    answers: ['5', '6', '7', '8'],
    correct: 2,
    source: {
      type: 'quran',
      arabic: 'وَلَقَدْ آتَيْنَاكَ سَبْعًا مِّنَ الْمَثَانِي وَالْقُرْآنَ الْعَظِيمَ',
      translation: 'Nous t\'avons certes donné les sept versets que l\'on répète ainsi que le Coran grandiose.',
      reference: 'Sourate Al-Hijr, verset 87 ; Tafsir Ibn Kathir',
      scholar: 'Ibn Kathir'
    }
  },
  {
    id: 23,
    difficulty: 'intermediaire',
    type: 'qcm',
    question: 'Quel est le plus grand verset du Coran ?',
    answers: ['Le verset du Trône (Ayat Al-Kursi)', 'Le premier verset de Al-Baqara', 'Le verset de la lumière (Ayat An-Nur)', 'Le dernier verset de Al-Baqara'],
    correct: 0,
    source: {
      type: 'hadith',
      arabic: 'أَعْظَمُ آيَةٍ فِي كِتَابِ اللَّهِ آيَةُ الْكُرْسِيِّ',
      translation: 'Le plus grand verset du Livre d\'Allah est Ayat Al-Kursi.',
      reference: 'Sahih Muslim, hadith n°810',
      scholar: ''
    }
  },
  {
    id: 24,
    difficulty: 'avance',
    type: 'qcm',
    question: 'Dans Ayat Al-Kursi (Al-Baqara 255), combien d\'Attributs divins sont mentionnés ?',
    answers: ['5', '7', '9', '11'],
    correct: 2,
    source: {
      type: 'quran',
      arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
      translation: 'Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même.',
      reference: 'Sourate Al-Baqara, verset 255 ; Al-Qurtubi, Al-Jami li Ahkam Al-Quran',
      scholar: 'Al-Qurtubi'
    }
  },
  {
    id: 25,
    difficulty: 'intermediaire',
    type: 'qcm',
    question: 'Que demande le croyant dans les deux derniers versets de sourate Al-Baqara (285-286) ?',
    answers: [
      'La richesse et la santé',
      'Le pardon, la miséricorde et la victoire sur les mécréants',
      'Un long âge et une descendance pieuse',
      'La guidance et la science'
    ],
    correct: 1,
    source: {
      type: 'quran',
      arabic: 'رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا',
      translation: 'Seigneur, ne nous châtie pas s\'il nous arrive d\'oublier ou de commettre une erreur.',
      reference: 'Sourate Al-Baqara, versets 285-286 ; Tafsir Ibn Kathir',
      scholar: 'Ibn Kathir'
    }
  },
  {
    id: 26,
    difficulty: 'avance',
    type: 'qcm',
    question: 'Selon le Tafsir d\'Al-Qurtubi, que signifie « الصِّرَاطَ الْمُسْتَقِيمَ » (le droit chemin) dans Al-Fatiha ?',
    answers: [
      'Le Coran et la Sunna',
      'L\'Islam, le chemin d\'Allah',
      'La voie des philosophes',
      'Le chemin vers La Mecque'
    ],
    correct: 1,
    source: {
      type: 'quran',
      arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      translation: 'Guide-nous dans le droit chemin — c\'est-à-dire l\'Islam, la religion d\'Allah.',
      reference: 'Sourate Al-Fatiha, verset 6 ; Al-Qurtubi, Al-Jami li Ahkam Al-Quran',
      scholar: 'Al-Qurtubi'
    }
  },

  // ===== HADITHS CÉLÈBRES =====
  {
    id: 27,
    difficulty: 'debutant',
    type: 'qcm',
    question: 'Complétez ce hadith : « Les actes ne valent que par… »',
    answers: ['…les résultats', '…les intentions (niyyat)', '…la quantité', '…la difficulté'],
    correct: 1,
    source: {
      type: 'hadith',
      arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
      translation: 'Les actes ne valent que par les intentions, et chacun n\'aura que ce qu\'il a eu l\'intention de faire.',
      reference: 'Sahih Al-Boukhari, hadith n°1 ; Sahih Muslim, hadith n°1907',
      scholar: ''
    }
  },
  {
    id: 28,
    difficulty: 'intermediaire',
    type: 'qcm',
    question: 'Quel est le numéro du hadith « Les actes ne valent que par les intentions » dans Sahih Al-Boukhari ?',
    answers: ['Hadith n°1', 'Hadith n°7', 'Hadith n°13', 'Hadith n°40'],
    correct: 0,
    source: {
      type: 'hadith',
      arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
      translation: 'Les actes ne valent que par les intentions.',
      reference: 'Sahih Al-Boukhari, hadith n°1',
      scholar: ''
    }
  },
  {
    id: 29,
    difficulty: 'debutant',
    type: 'vrai_faux',
    question: 'Le hadith « Nul d\'entre vous ne sera véritablement croyant tant qu\'il n\'aimera pas pour son frère ce qu\'il aime pour lui-même » est rapporté par Anas ibn Malik.',
    answers: ['Vrai', 'Faux'],
    correct: 0,
    source: {
      type: 'hadith',
      arabic: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
      translation: 'Nul d\'entre vous ne sera véritablement croyant tant qu\'il n\'aimera pas pour son frère ce qu\'il aime pour lui-même.',
      reference: 'Sahih Al-Boukhari, hadith n°13 ; Sahih Muslim, hadith n°45',
      scholar: 'An-Nawawi, Riyad As-Salihin'
    }
  },
  {
    id: 30,
    difficulty: 'avance',
    type: 'qcm',
    question: 'Dans les « 40 hadiths d\'An-Nawawi », quel hadith dit : « Laisse ce qui te fait douter pour ce qui ne te fait pas douter » ?',
    answers: ['Le 10ème hadith', 'Le 11ème hadith', 'Le 20ème hadith', 'Le 33ème hadith'],
    correct: 1,
    source: {
      type: 'hadith',
      arabic: 'دَعْ مَا يَرِيبُكَ إِلَى مَا لاَ يَرِيبُكَ',
      translation: 'Laisse ce qui te fait douter pour ce qui ne te fait pas douter.',
      reference: 'Rapporté par At-Tirmidhi, hadith n°2518 ; An-Nawawi, Riyad As-Salihin',
      scholar: 'An-Nawawi'
    }
  },

  // ===== QUESTIONS AVANCÉES AQIDA/USUL =====
  {
    id: 31,
    difficulty: 'avance',
    type: 'qcm',
    question: 'Qu\'est-ce que le « Tawhid Al-Uluhiyya » ?',
    answers: [
      'L\'unicité d\'Allah dans Ses Noms et Attributs',
      'L\'unicité d\'Allah dans la seigneurie (Rububiyya)',
      'L\'unicité d\'Allah dans l\'adoration : Lui seul mérite d\'être adoré',
      'L\'unicité d\'Allah dans la législation'
    ],
    correct: 2,
    source: {
      type: 'scholar',
      arabic: 'تَوْحِيدُ الأُلُوهِيَّةِ هُوَ إِفْرَادُ اللَّهِ بِالْعِبَادَةِ',
      translation: 'Le Tawhid Al-Uluhiyya, c\'est vouer l\'adoration exclusivement à Allah.',
      reference: 'Ibn Al-Uthaymin, Sharh Al-Aqida Al-Wasitiyya',
      scholar: 'Ibn Al-Uthaymin'
    }
  },
  {
    id: 32,
    difficulty: 'avance',
    type: 'qcm',
    question: 'Qui est l\'auteur du livre « Al-Aqida Al-Wasitiyya » ?',
    answers: ['Imam Ahmad ibn Hanbal', 'Cheikh Al-Islam Ibn Taymiyya', 'Imam An-Nawawi', 'Imam Al-Ghazali'],
    correct: 1,
    source: {
      type: 'scholar',
      arabic: 'هَذَا اعْتِقَادُ الْفِرْقَةِ النَّاجِيَةِ الْمَنْصُورَةِ',
      translation: 'Ceci est la croyance du groupe sauvé et victorieux.',
      reference: 'Al-Aqida Al-Wasitiyya, Introduction',
      scholar: 'Cheikh Al-Islam Ibn Taymiyya ; commentée par Ibn Al-Uthaymin'
    }
  },
  {
    id: 33,
    difficulty: 'avance',
    type: 'qcm',
    question: 'Quelles sont les trois catégories du Tawhid selon les savants ?',
    answers: [
      'Tawhid Ar-Rububiyya, Al-Uluhiyya, Al-Asma\' was-Sifat',
      'Tawhid Al-\'Ilm, Al-\'Amal, Al-Ikhlas',
      'Tawhid Al-Qawl, Al-Fi\'l, An-Niyya',
      'Tawhid Al-Khalq, Ar-Rizq, Al-Mulk'
    ],
    correct: 0,
    source: {
      type: 'scholar',
      arabic: 'التَّوْحِيدُ ثَلاَثَةُ أَقْسَامٍ: تَوْحِيدُ الرُّبُوبِيَّةِ وَتَوْحِيدُ الأُلُوهِيَّةِ وَتَوْحِيدُ الأَسْمَاءِ وَالصِّفَاتِ',
      translation: 'Le Tawhid se divise en trois catégories : Tawhid Ar-Rububiyya, Tawhid Al-Uluhiyya, et Tawhid Al-Asma\' was-Sifat.',
      reference: 'Ibn Al-Uthaymin, Sharh Al-Aqida Al-Wasitiyya',
      scholar: 'Ibn Al-Uthaymin'
    }
  },
  {
    id: 34,
    difficulty: 'intermediaire',
    type: 'qcm',
    question: 'Quel compagnon est surnommé « As-Siddiq » (le véridique) ?',
    answers: ['Omar ibn Al-Khattab', 'Abu Bakr As-Siddiq', 'Othman ibn Affan', 'Ali ibn Abi Talib'],
    correct: 1,
    source: {
      type: 'hadith',
      arabic: 'أَبُو بَكْرٍ الصِّدِّيقُ',
      translation: 'Abu Bakr le véridique (رضي الله عنه), premier calife de l\'Islam.',
      reference: 'Sahih Al-Boukhari, hadith n°3661',
      scholar: 'Ibn Kathir, Al-Bidaya wan-Nihaya'
    }
  },
  {
    id: 35,
    difficulty: 'intermediaire',
    type: 'qcm',
    question: 'Quelle est la durée de la période de révélation du Coran ?',
    answers: ['10 ans', '20 ans', '23 ans', '30 ans'],
    correct: 2,
    source: {
      type: 'scholar',
      arabic: 'نَزَلَ الْقُرْآنُ فِي ثَلاَثٍ وَعِشْرِينَ سَنَةً',
      translation: 'Le Coran fut révélé en vingt-trois ans.',
      reference: 'Ibn Kathir, Al-Bidaya wan-Nihaya',
      scholar: 'Ibn Kathir'
    }
  },
  {
    id: 36,
    difficulty: 'debutant',
    type: 'qcm',
    question: 'Quel est le dernier des cinq piliers de l\'Islam ?',
    answers: ['La Zakat', 'Le jeûne du Ramadan', 'Le pèlerinage à La Mecque (Hajj)', 'La prière'],
    correct: 2,
    source: {
      type: 'hadith',
      arabic: 'وَحَجِّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلاً',
      translation: '…et le pèlerinage à la Maison sacrée pour celui qui en a la capacité.',
      reference: 'Sahih Al-Boukhari, hadith n°8 ; Sahih Muslim, hadith n°16',
      scholar: ''
    }
  },
  {
    id: 37,
    difficulty: 'avance',
    type: 'qcm',
    question: 'Quel savant est l\'auteur de « Riyad As-Salihin » (Les Jardins des Vertueux) ?',
    answers: ['Imam Al-Boukhari', 'Imam Muslim', 'Imam An-Nawawi', 'Imam Ibn Hajar'],
    correct: 2,
    source: {
      type: 'scholar',
      arabic: 'كِتَابُ رِيَاضِ الصَّالِحِينَ مِنْ كَلاَمِ سَيِّدِ الْمُرْسَلِينَ',
      translation: 'Le livre « Les Jardins des Vertueux » tiré de la parole du Maître des Envoyés.',
      reference: 'An-Nawawi, Riyad As-Salihin, Introduction',
      scholar: 'Imam An-Nawawi (631-676 H)'
    }
  },
  {
    id: 38,
    difficulty: 'intermediaire',
    type: 'vrai_faux',
    question: 'La sourate Al-Ikhlas (Le monothéisme pur) équivaut au tiers du Coran en récompense.',
    answers: ['Vrai', 'Faux'],
    correct: 0,
    source: {
      type: 'hadith',
      arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ تَعْدِلُ ثُلُثَ الْقُرْآنِ',
      translation: '« Dis : Il est Allah, Unique » équivaut au tiers du Coran.',
      reference: 'Sahih Muslim, hadith n°811',
      scholar: ''
    }
  },
  {
    id: 39,
    difficulty: 'debutant',
    type: 'qcm',
    question: 'Quel livre sacré a été révélé au Prophète Moussa (Moïse) عليه السلام ?',
    answers: ['L\'Injil (Évangile)', 'Az-Zabur (Psaumes)', 'At-Tawrah (Torah)', 'Le Coran'],
    correct: 2,
    source: {
      type: 'quran',
      arabic: 'إِنَّا أَنزَلْنَا التَّوْرَاةَ فِيهَا هُدًى وَنُورٌ',
      translation: 'Nous avons fait descendre la Thora dans laquelle il y a guide et lumière.',
      reference: 'Sourate Al-Ma\'ida, verset 44',
      scholar: 'Tafsir Ibn Kathir'
    }
  },
  {
    id: 40,
    difficulty: 'avance',
    type: 'qcm',
    question: 'Combien de conditions la Shahada (attestation de foi) comporte-t-elle selon les savants ?',
    answers: ['3 conditions', '5 conditions', '7 conditions', '9 conditions'],
    correct: 2,
    source: {
      type: 'scholar',
      arabic: 'شُرُوطُ لاَ إِلَهَ إِلاَّ اللَّهُ سَبْعَةٌ',
      translation: 'Les conditions de « La ilaha illa Allah » sont au nombre de sept : la science, la certitude, l\'acceptation, la soumission, la véracité, la sincérité et l\'amour.',
      reference: 'Cheikh Al-Fawzan, Al-Mulakhkhas Al-Fiqhi ; Hafiz Al-Hakami, Ma\'arij Al-Qabul',
      scholar: 'Cheikh Al-Fawzan'
    }
  }
];
