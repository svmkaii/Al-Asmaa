/**
 * Al-Asmaa — Encyclopedie enrichie des 99 Noms d'Allah
 * Sources : Al-Qurtubi, Al-Ghazali, Ibn al-Qayyim, Sahih Bukhari, Sahih Muslim
 */

const SCHOLARLY_SOURCES = {
  ghazali_maqsad: {
    author: "Abu Hamid Al-Ghazali",
    title: "Al-Maqsad al-Asna fi Sharh Asma' Allah al-Husna",
    tradition: "Sunnite"
  },
  qurtubi_asna: {
    author: "Abu Abdillah Al-Qurtubi",
    title: "Al-Asna fi Sharh Asma' Allah al-Husna",
    tradition: "Sunnite Malikite"
  },
  qurtubi_tafsir: {
    author: "Abu Abdillah Al-Qurtubi",
    title: "Al-Jami' li-Ahkam al-Quran (Tafsir al-Qurtubi)",
    tradition: "Sunnite Malikite"
  },
  ibn_qayyim: {
    author: "Ibn al-Qayyim al-Jawziyya",
    title: "Bada'i al-Fawa'id",
    tradition: "Sunnite"
  }
};

const ENCYCLOPEDIA_DATA = {
  1: {
    detailedMeaning: "Ar-Rahman designe Celui dont la misericorde englobe absolument toute la creation, sans distinction entre croyants et non-croyants. Ce nom est exclusif a Allah et ne peut etre attribue a aucune creature. Il exprime l'immensité et la totalite de la misericorde divine dans ce bas monde. La forme fa'lan en arabe indique l'intensite maximale de cet attribut.",
    quranVerses: [
      { surah: "Al-Fatiha", surahNumber: 1, ayah: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "Au nom d'Allah, le Tout Misericordieux, le Tres Misericordieux.", link: "https://quran.com/fr/1:1" },
      { surah: "Ta-Ha", surahNumber: 20, ayah: 5, arabic: "الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ", translation: "Le Tout Misericordieux S'est etabli sur le Trone.", link: "https://quran.com/fr/20:5" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Ar-Rahman est un nom propre a Allah, il ne peut etre donne a autre que Lui. Il indique que Sa misericorde embrasse toute chose dans ce monde." },
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Ar-Rahman est Celui qui veut le bien pour toutes les creatures, leur accorde l'existence et les guide vers ce qui leur est profitable." }
    ],
    hadithReferences: [
      { collection: "Sahih Muslim", number: "2752", text: "Lorsqu'Allah a cree la creation, Il a ecrit dans Son Livre qui est aupres de Lui au-dessus du Trone : Ma misericorde l'emporte sur Ma colere.", link: "https://sunnah.com/muslim:2752" }
    ],
    sources: [
      { label: "Quran.com - Al-Fatiha 1:1", url: "https://quran.com/fr/1:1" },
      { label: "Sunnah.com - Muslim 2752", url: "https://sunnah.com/muslim:2752" }
    ]
  },
  2: {
    detailedMeaning: "Ar-Rahim designe Celui dont la misericorde speciale est reservee aux croyants dans l'au-dela. Tandis qu'Ar-Rahman couvre la misericorde universelle, Ar-Rahim concerne la misericorde particuliere qui se manifeste par le pardon, la recompense et l'entree au Paradis. La forme fa'il indique une qualite permanente et constante.",
    quranVerses: [
      { surah: "Al-Fatiha", surahNumber: 1, ayah: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "Au nom d'Allah, le Tout Misericordieux, le Tres Misericordieux.", link: "https://quran.com/fr/1:1" },
      { surah: "Al-Ahzab", surahNumber: 33, ayah: 43, arabic: "وَكَانَ بِالْمُؤْمِنِينَ رَحِيمًا", translation: "Et Il est Misericordieux envers les croyants.", link: "https://quran.com/fr/33:43" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Ar-Rahim est specifique aux croyants. Allah dit : Il est Misericordieux envers les croyants (33:43). C'est la misericorde de l'au-dela." },
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Si Ar-Rahman exprime la volonte universelle de bien, Ar-Rahim en est la realisation pour ceux qui acceptent la guidance divine." }
    ],
    hadithReferences: [
      { collection: "Sahih Bukhari", number: "6000", text: "Allah a divise la misericorde en cent parties. Il en a retenu aupres de Lui quatre-vingt-dix-neuf et a fait descendre sur terre une seule partie.", link: "https://sunnah.com/bukhari:6000" }
    ],
    sources: [
      { label: "Quran.com - Al-Ahzab 33:43", url: "https://quran.com/fr/33:43" },
      { label: "Sunnah.com - Bukhari 6000", url: "https://sunnah.com/bukhari:6000" }
    ]
  },
  3: {
    detailedMeaning: "Al-Malik designe le Roi absolu et le Souverain de toute la creation. Sa royaute est parfaite et complete, ne dependant d'aucun conseiller ni assistant. Il possede toute chose et dispose de toute chose selon Sa volonte. Aucune royaute terrestre ne peut se comparer a la Sienne.",
    quranVerses: [
      { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ", translation: "C'est Lui Allah, en dehors de qui il n'y a pas de divinite, le Souverain, le Saint, la Paix.", link: "https://quran.com/fr/59:23" },
      { surah: "Al-Mu'minun", surahNumber: 23, ayah: 116, arabic: "فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ", translation: "Exalte soit Allah, le vrai Souverain.", link: "https://quran.com/fr/23:116" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Malik est Celui qui possede le pouvoir absolu d'ordonner et d'interdire, de recompenser et de punir, sans que personne ne puisse s'y opposer." },
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Le vrai Roi est Celui qui n'a besoin de rien et dont toute chose a besoin. Tout ce qui existe est dans Son royaume." }
    ],
    hadithReferences: [
      { collection: "Sahih Muslim", number: "2788", text: "Allah saisira la terre le Jour de la Resurrection et pliera les cieux de Sa main droite, puis dira : Je suis le Roi, ou sont les rois de la terre ?", link: "https://sunnah.com/muslim:2788" }
    ],
    sources: [
      { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" },
      { label: "Sunnah.com - Muslim 2788", url: "https://sunnah.com/muslim:2788" }
    ]
  },
  4: {
    detailedMeaning: "Al-Quddus designe Celui qui est absolument pur de tout defaut, de toute imperfection et de toute ressemblance avec les creatures. Il est saint et sacre au-dela de toute description humaine. Les anges Le glorifient constamment en disant : Quddus, Quddus, Seigneur des anges et de l'Esprit.",
    quranVerses: [
      { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ", translation: "C'est Lui Allah, en dehors de qui il n'y a pas de divinite, le Souverain, le Saint.", link: "https://quran.com/fr/59:23" },
      { surah: "Al-Jumu'a", surahNumber: 62, ayah: 1, arabic: "يُسَبِّحُ لِلَّهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ الْمَلِكِ الْقُدُّوسِ", translation: "Ce qui est dans les cieux et sur la terre glorifie Allah, le Souverain, le Saint.", link: "https://quran.com/fr/62:1" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Quddus signifie le Pur, le Beni, celui qui est exempt de toute imperfection. Il est au-dessus de tout ce que les esprits peuvent concevoir." },
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Quddus est Celui qui est exempt de tout attribut saisissable par les sens, representable par l'imagination ou accessible a la pensee humaine." }
    ],
    hadithReferences: [
      { collection: "Sahih Muslim", number: "487", text: "Le Prophete (paix sur lui) disait dans son ruku' et son sujud : Subbuh, Quddus, Seigneur des anges et de l'Esprit.", link: "https://sunnah.com/muslim:487" }
    ],
    sources: [
      { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" },
      { label: "Sunnah.com - Muslim 487", url: "https://sunnah.com/muslim:487" }
    ]
  },
  5: {
    detailedMeaning: "As-Salam designe Celui qui est la source de toute paix et securite. Il est exempt de tout defaut et de toute imperfection. Il accorde la paix a Ses creatures et les salue dans l'au-dela. Le salut islamique (Salam) derive de ce nom divin, rappelant que la paix veritable vient d'Allah seul.",
    quranVerses: [
      { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ", translation: "Le Souverain, le Saint, la Paix, le Garant de la foi, le Protecteur.", link: "https://quran.com/fr/59:23" },
      { surah: "Ya-Sin", surahNumber: 36, ayah: 58, arabic: "سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ", translation: "Paix ! Parole d'un Seigneur Tres Misericordieux.", link: "https://quran.com/fr/36:58" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "As-Salam est Celui qui est sauf de tout defaut et de toute fin. Il salue Ses serviteurs au Paradis, comme il est dit : Paix, parole d'un Seigneur Misericordieux." },
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "As-Salam est Celui dont l'Essence est exempte de tout defaut, dont les attributs sont exempts de toute imperfection, et dont les actes sont exempts de tout mal." }
    ],
    hadithReferences: [
      { collection: "Sahih Muslim", number: "592", text: "Le Prophete (paix sur lui) disait apres chaque priere : Allahumma anta As-Salam wa minka as-salam, tabarakta ya dhal-jalali wal-ikram.", link: "https://sunnah.com/muslim:592" }
    ],
    sources: [
      { label: "Quran.com - Ya-Sin 36:58", url: "https://quran.com/fr/36:58" },
      { label: "Sunnah.com - Muslim 592", url: "https://sunnah.com/muslim:592" }
    ]
  },
  6: {
    detailedMeaning: "Al-Mu'min designe Celui qui accorde la securite a Ses serviteurs et confirme leur foi. Il les protege de l'injustice et tient Sa promesse de recompense. Ce nom signifie aussi Celui qui Se confirme Lui-meme dans Sa veracite, en temoignant de Son propre unicite.",
    quranVerses: [
      { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ", translation: "La Paix, le Garant de la foi, le Protecteur.", link: "https://quran.com/fr/59:23" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Mu'min signifie Celui qui confirme Ses promesses, qui protege Ses serviteurs et leur accorde la securite contre Son chatiment quand ils Lui obeissent." },
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Mu'min est Celui de qui emane la securite et la tranquillite. Il met Ses serviteurs a l'abri de toute oppression." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" }
    ]
  },
  7: {
    detailedMeaning: "Al-Muhaymin designe Celui qui veille sur toute Sa creation, qui protege et preserve toute chose. Il est le Gardien supreme qui observe et controle tout. Ce nom implique une surveillance totale et bienveillante de l'univers tout entier.",
    quranVerses: [
      { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ", translation: "Le Garant de la foi, le Protecteur Supreme, le Tout Puissant, le Contraignant.", link: "https://quran.com/fr/59:23" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Muhaymin signifie le Temoin fidele, le Gardien qui veille sur toute chose. Il englobe la science, la preservation et la domination." },
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Muhaymin est Celui dont le regard embrasse toute chose, qui connait tout et preserve tout de la corruption." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" }
    ]
  },
  8: {
    detailedMeaning: "Al-Aziz designe le Tout Puissant, l'Invincible que rien ne peut vaincre ni affaiblir. Sa puissance est absolue et rien dans la creation ne peut s'y opposer. Il est aussi Celui qui est rare dans Sa perfection, sans egal ni pareil, et dont la grandeur est inaccessible.",
    quranVerses: [
      { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ", translation: "Le Tout Puissant, le Contraignant, le Majestueux.", link: "https://quran.com/fr/59:23" },
      { surah: "Ali 'Imran", surahNumber: 3, ayah: 6, arabic: "هُوَ الَّذِي يُصَوِّرُكُمْ فِي الْأَرْحَامِ كَيْفَ يَشَاءُ لَا إِلَٰهَ إِلَّا هُوَ الْعَزِيزُ الْحَكِيمُ", translation: "C'est Lui qui vous donne forme dans les matrices comme Il veut. Il n'y a de divinite que Lui, le Tout Puissant, le Sage.", link: "https://quran.com/fr/3:6" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Aziz est Celui qui est invincible, que rien ne peut dominer. Il est rare dans Son essence, Ses attributs et Ses actes, sans aucun semblable." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" }
    ]
  },
  9: {
    detailedMeaning: "Al-Jabbar designe Celui qui contraint toute la creation selon Sa volonte, et qui repare ce qui est brise. Ce nom a un double sens : la domination supreme sur toute chose, et la compassion de Celui qui restaure les coeurs brises et soulage les affliges.",
    quranVerses: [
      { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ", translation: "Le Tout Puissant, le Contraignant, le Majestueux.", link: "https://quran.com/fr/59:23" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Jabbar a trois sens : Celui qui contraint Ses creatures selon Sa volonte, Celui qui repare l'etat de Ses creatures, et le Tres Haut au-dessus de toute chose." },
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Jabbar est Celui dont la volonte s'accomplit sans resistance, et qui par Sa bonte repare les coeurs brises des opprimes." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" }
    ]
  },
  10: {
    detailedMeaning: "Al-Mutakabbir designe Celui a qui appartient toute grandeur et majeste, au-dessus de tout attribut des creatures. L'orgueil est un droit exclusif d'Allah car Lui seul merite cette grandeur supreme. Ce nom rappelle que toute pretention a la grandeur de la part des creatures est illegitime.",
    quranVerses: [
      { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ سُبْحَانَ اللَّهِ عَمَّا يُشْرِكُونَ", translation: "Le Tout Puissant, le Contraignant, le Majestueux. Gloire a Allah, au-dessus de ce qu'ils Lui associent.", link: "https://quran.com/fr/59:23" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Mutakabbir est Celui qui possede la grandeur absolue. La grandeur (kibriya') est un attribut exclusif d'Allah qu'aucune creature ne peut revendiquer." }
    ],
    hadithReferences: [
      { collection: "Sahih Muslim", number: "2620", text: "Allah dit : La grandeur est Mon manteau et la majeste est Mon pagne. Quiconque Me dispute l'un des deux, Je le jetterai en Enfer.", link: "https://sunnah.com/muslim:2620" }
    ],
    sources: [
      { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" },
      { label: "Sunnah.com - Muslim 2620", url: "https://sunnah.com/muslim:2620" }
    ]
  },
  11: {
    detailedMeaning: "Al-Khaliq designe Celui qui a cree toute chose a partir du neant, qui a determine et planifie la creation avant de lui donner l'existence. Il est le Createur de toutes les formes, de toutes les substances et de tous les etres. Sa creation est parfaite et reflechie.",
    quranVerses: [
      { surah: "Al-Hashr", surahNumber: 59, ayah: 24, arabic: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ", translation: "C'est Lui Allah, le Createur, le Producteur, le Faconneur.", link: "https://quran.com/fr/59:24" },
      { surah: "Ar-Ra'd", surahNumber: 13, ayah: 16, arabic: "قُلِ اللَّهُ خَالِقُ كُلِّ شَيْءٍ", translation: "Dis : Allah est le Createur de toute chose.", link: "https://quran.com/fr/13:16" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Khaliq est Celui qui a fait exister les choses apres leur inexistence, qui les a tirees du neant et les a amenees a l'etre selon Son decret eternel." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Hashr 59:24", url: "https://quran.com/fr/59:24" }
    ]
  },
  12: {
    detailedMeaning: "Al-Bari' designe Celui qui donne l'existence aux creatures en les distinguant les unes des autres. Apres avoir planifie la creation (Al-Khaliq), Il la produit et la realise en donnant a chaque etre son existence distincte. Chaque creature est unique dans sa forme et ses caracteristiques.",
    quranVerses: [
      { surah: "Al-Hashr", surahNumber: 59, ayah: 24, arabic: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ", translation: "C'est Lui Allah, le Createur, le Producteur, le Faconneur.", link: "https://quran.com/fr/59:24" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Bari' est Celui qui produit les creatures et les fait passer du neant a l'existence. Il distingue chaque etre par des caracteristiques propres." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Hashr 59:24", url: "https://quran.com/fr/59:24" }
    ]
  },
  13: {
    detailedMeaning: "Al-Musawwir designe Celui qui faconne Ses creatures et leur donne leurs formes et apparences distinctes. Il est l'Artiste divin qui dessine les traits de chaque etre avec une precision et une beaute infinies. Aucun visage ne ressemble a un autre, temoignant de Sa puissance creatrice.",
    quranVerses: [
      { surah: "Al-Hashr", surahNumber: 59, ayah: 24, arabic: "الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ", translation: "Le Createur, le Producteur, le Faconneur. A Lui les plus beaux noms.", link: "https://quran.com/fr/59:24" },
      { surah: "Al-Infitar", surahNumber: 82, ayah: 8, arabic: "فِي أَيِّ صُورَةٍ مَّا شَاءَ رَكَّبَكَ", translation: "Dans quelque forme qu'Il a voulue, Il t'a compose.", link: "https://quran.com/fr/82:8" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Musawwir est Celui qui invente les formes de toutes les creatures et les organise de la meilleure maniere. Il faconne l'embryon dans le ventre de la mere." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Hashr 59:24", url: "https://quran.com/fr/59:24" }
    ]
  },
  14: {
    detailedMeaning: "Al-Ghaffar designe Celui qui pardonne les peches de maniere repetee et abondante. La forme fa''al indique l'intensite et la repetition du pardon. Peu importe la gravite ou le nombre des peches, Allah pardonne a celui qui se repent sincerement. Il couvre les fautes et ne les expose pas.",
    quranVerses: [
      { surah: "Nuh", surahNumber: 71, ayah: 10, arabic: "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا", translation: "J'ai dit : Implorez le pardon de votre Seigneur, car Il est Grand Pardonneur.", link: "https://quran.com/fr/71:10" },
      { surah: "Az-Zumar", surahNumber: 39, ayah: 53, arabic: "إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا", translation: "Certes, Allah pardonne tous les peches.", link: "https://quran.com/fr/39:53" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Ghaffar est Celui qui couvre les peches de Ses serviteurs et ne les expose pas, qui pardonne encore et encore a chaque repentir sincere." }
    ],
    hadithReferences: [
      { collection: "Sahih Muslim", number: "2749", text: "Par Celui qui tient mon ame en Sa main, si vous ne pechiez pas, Allah vous remplacerait par un peuple qui pecherait puis demanderait pardon, et Il leur pardonnerait.", link: "https://sunnah.com/muslim:2749" }
    ],
    sources: [
      { label: "Quran.com - Az-Zumar 39:53", url: "https://quran.com/fr/39:53" },
      { label: "Sunnah.com - Muslim 2749", url: "https://sunnah.com/muslim:2749" }
    ]
  },
  15: {
    detailedMeaning: "Al-Qahhar designe le Dominateur Supreme qui soumet toute la creation par Sa puissance absolue. Rien ne peut resister a Sa volonte. Il domine tout ce qui est autre que Lui, et toute creature est soumise a Sa grandeur. Ce nom rappelle la transcendance totale d'Allah sur l'univers.",
    quranVerses: [
      { surah: "Ar-Ra'd", surahNumber: 13, ayah: 16, arabic: "قُلِ اللَّهُ خَالِقُ كُلِّ شَيْءٍ وَهُوَ الْوَاحِدُ الْقَهَّارُ", translation: "Dis : Allah est le Createur de toute chose et Il est l'Unique, le Dominateur Supreme.", link: "https://quran.com/fr/13:16" },
      { surah: "Ibrahim", surahNumber: 14, ayah: 48, arabic: "يَوْمَ تُبَدَّلُ الْأَرْضُ غَيْرَ الْأَرْضِ وَالسَّمَاوَاتُ وَبَرَزُوا لِلَّهِ الْوَاحِدِ الْقَهَّارِ", translation: "Le jour ou la terre sera remplacee par une autre et les cieux aussi, et ils comparaitront devant Allah, l'Unique, le Dominateur Supreme.", link: "https://quran.com/fr/14:48" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Qahhar est Celui qui brise le dos des tyrans et des rebelles. Toute la creation est soumise a Sa majeste, les rois comme les sujets." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ar-Ra'd 13:16", url: "https://quran.com/fr/13:16" }
    ]
  },
  16: {
    detailedMeaning: "Al-Wahhab designe le Donateur Supreme qui donne sans cesse, sans contrepartie et sans condition. Ses dons sont infinis et varies : la vie, la sante, la subsistance, la foi, la sagesse. Il donne par pure generosite, sans que rien ne L'y oblige et sans attendre de recompense.",
    quranVerses: [
      { surah: "Ali 'Imran", surahNumber: 3, ayah: 8, arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ", translation: "Seigneur, ne fais pas devier nos coeurs apres que Tu nous aies guides, et accorde-nous une misericorde de Ta part. C'est Toi le Donateur Supreme.", link: "https://quran.com/fr/3:8" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Wahhab est Celui qui donne gratuitement, dont les bienfaits sont sans fin. Il donne sans qu'on Lui demande et sans contrepartie." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ali 'Imran 3:8", url: "https://quran.com/fr/3:8" }
    ]
  },
  17: {
    detailedMeaning: "Ar-Razzaq designe le Pourvoyeur qui assure la subsistance de toutes Ses creatures sans exception. Il nourrit le croyant et le non-croyant, l'humain et l'animal, le visible et l'invisible. Sa subsistance englobe la nourriture physique et spirituelle. Nul etre vivant n'est oublie.",
    quranVerses: [
      { surah: "Adh-Dhariyat", surahNumber: 51, ayah: 58, arabic: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ", translation: "C'est Allah qui est le Pourvoyeur, le Detenteur de la force, l'Inebranlable.", link: "https://quran.com/fr/51:58" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Ar-Razzaq est Celui qui cree la subsistance et la fait parvenir a Ses creatures. La subsistance comprend tout ce dont le corps et l'ame ont besoin." }
    ],
    hadithReferences: [
      { collection: "Sahih Muslim", number: "2713", text: "O Allah, Tu es le Premier et rien n'est avant Toi, Tu es le Dernier et rien n'est apres Toi, Tu es l'Apparent et rien n'est au-dessus de Toi, Tu es le Cache et rien n'est en-dessous de Toi.", link: "https://sunnah.com/muslim:2713" }
    ],
    sources: [
      { label: "Quran.com - Adh-Dhariyat 51:58", url: "https://quran.com/fr/51:58" }
    ]
  },
  18: {
    detailedMeaning: "Al-Fattah designe Celui qui ouvre toutes les portes fermees, qu'il s'agisse des portes de la misericorde, de la subsistance, de la connaissance ou de la victoire. Il juge entre Ses serviteurs avec verite et ouvre les voies de la guidance pour ceux qui Le cherchent sincerement.",
    quranVerses: [
      { surah: "Saba", surahNumber: 34, ayah: 26, arabic: "قُلْ يَجْمَعُ بَيْنَنَا رَبُّنَا ثُمَّ يَفْتَحُ بَيْنَنَا بِالْحَقِّ وَهُوَ الْفَتَّاحُ الْعَلِيمُ", translation: "Dis : Notre Seigneur nous reunira puis Il jugera entre nous en verite. Il est le Juge Supreme, l'Omniscient.", link: "https://quran.com/fr/34:26" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Fattah est le Juge entre Ses serviteurs, et aussi Celui qui ouvre les portes de la subsistance et de la misericorde. Il ouvre ce qui est ferme." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Saba 34:26", url: "https://quran.com/fr/34:26" }
    ]
  },
  19: {
    detailedMeaning: "Al-'Alim designe Celui dont la science est parfaite, englobante et eternelle. Il connait tout ce qui a ete, tout ce qui est et tout ce qui sera. Rien ne Lui echappe, ni dans les cieux ni sur la terre, ni le visible ni l'invisible, ni le passe ni le futur. Sa science n'est precedee d'aucune ignorance.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 29, arabic: "وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ", translation: "Et Il est Omniscient de toute chose.", link: "https://quran.com/fr/2:29" },
      { surah: "Al-Hujurat", surahNumber: 49, ayah: 16, arabic: "وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ", translation: "Et Allah est Omniscient de toute chose.", link: "https://quran.com/fr/49:16" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-'Alim est Celui a qui rien n'echappe. Sa science est eternelle, elle n'augmente pas par l'apprentissage et ne diminue pas par l'oubli." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Baqara 2:29", url: "https://quran.com/fr/2:29" }
    ]
  },
  20: {
    detailedMeaning: "Al-Qabid designe Celui qui retient et resserre la subsistance ou autre chose selon Sa sagesse. Il eprouve Ses serviteurs en restreignant parfois leurs provisions, leur sante ou leur aisance, afin de les purifier et de les rapprocher de Lui. Ce nom se comprend en pair avec Al-Basit.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 245, arabic: "وَاللَّهُ يَقْبِضُ وَيَبْسُطُ وَإِلَيْهِ تُرْجَعُونَ", translation: "Allah restreint et etend, et c'est a Lui que vous serez ramenes.", link: "https://quran.com/fr/2:245" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Qabid est Celui qui resserre les coeurs par la crainte, et les provisions par Sa sagesse. Le resserrement est une epreuve qui mene a l'elevation." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Baqara 2:245", url: "https://quran.com/fr/2:245" }
    ]
  },
  21: {
    detailedMeaning: "Al-Basit designe Celui qui etend et deploie la subsistance, la joie et la misericorde. Il elargit les coeurs par la foi et la serenite, et etend les provisions selon Sa sagesse. Ce nom est le complement d'Al-Qabid : ensemble, ils montrent qu'Allah gere tout avec equilibre.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 245, arabic: "وَاللَّهُ يَقْبِضُ وَيَبْسُطُ وَإِلَيْهِ تُرْجَعُونَ", translation: "Allah restreint et etend, et c'est a Lui que vous serez ramenes.", link: "https://quran.com/fr/2:245" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Basit est Celui qui etend la subsistance a qui Il veut et elargit les coeurs par la connaissance et la lumiere de la foi." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Baqara 2:245", url: "https://quran.com/fr/2:245" }
    ]
  },
  22: {
    detailedMeaning: "Al-Khafid designe Celui qui abaisse les orgueilleux, les tyrans et les rebelles. Il rabaisse qui Il veut selon Sa justice. Ce nom rappelle que toute elevation sans l'accord d'Allah est vouee a l'echec, et que l'humilite devant le Createur est la vraie noblesse.",
    quranVerses: [
      { surah: "Al-Waqi'a", surahNumber: 56, ayah: 3, arabic: "خَافِضَةٌ رَّافِعَةٌ", translation: "Elle abaissera certains et en elevera d'autres.", link: "https://quran.com/fr/56:3" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Khafid est Celui qui abaisse les incroyants par le malheur et les tyrans par la destruction. Il humilie qui se rebelle contre Sa volonte." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Waqi'a 56:3", url: "https://quran.com/fr/56:3" }
    ]
  },
  23: {
    detailedMeaning: "Ar-Rafi' designe Celui qui eleve en rang, en honneur et en dignite. Il eleve les croyants par la foi et la science, et eleve qui Il veut parmi Ses creatures. L'elevation veritable n'est pas celle du statut social mais celle que confere la proximite d'Allah.",
    quranVerses: [
      { surah: "Al-An'am", surahNumber: 6, ayah: 83, arabic: "نَرْفَعُ دَرَجَاتٍ مَّن نَّشَاءُ", translation: "Nous elevons en rang qui Nous voulons.", link: "https://quran.com/fr/6:83" },
      { surah: "Al-Mujadala", surahNumber: 58, ayah: 11, arabic: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ", translation: "Allah elevera ceux d'entre vous qui croient et ceux qui auront recu la science, de plusieurs degres.", link: "https://quran.com/fr/58:11" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Ar-Rafi' est Celui qui eleve Ses allies par la proximite et l'obeissance, et abaisse Ses ennemis par l'eloignement et la rebellion." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Mujadala 58:11", url: "https://quran.com/fr/58:11" }
    ]
  },
  24: {
    detailedMeaning: "Al-Mu'izz designe Celui qui accorde la puissance, l'honneur et la dignite a qui Il veut. La vraie puissance vient uniquement d'Allah. Il honore Ses serviteurs obeissants et accorde la victoire aux croyants. Nul ne peut obtenir l'honneur veritable sans Sa permission.",
    quranVerses: [
      { surah: "Ali 'Imran", surahNumber: 3, ayah: 26, arabic: "قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَن تَشَاءُ وَتَنزِعُ الْمُلْكَ مِمَّن تَشَاءُ وَتُعِزُّ مَن تَشَاءُ وَتُذِلُّ مَن تَشَاءُ", translation: "Dis : O Allah, Maitre de l'autorite absolue. Tu donnes l'autorite a qui Tu veux, et Tu arraches l'autorite a qui Tu veux ; Tu honores qui Tu veux et Tu humilies qui Tu veux.", link: "https://quran.com/fr/3:26" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Mu'izz est Celui qui accorde l'honneur. La vraie 'izza (puissance) est celle de la foi et de la piete, non celle des richesses et du pouvoir mondain." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ali 'Imran 3:26", url: "https://quran.com/fr/3:26" }
    ]
  },
  25: {
    detailedMeaning: "Al-Mudhill designe Celui qui humilie et abaisse les arrogants et ceux qui se detournent de Son chemin. Il retire l'honneur a qui Il veut et impose l'humiliation aux rebelles et aux tyrans. Ce nom se comprend en pair avec Al-Mu'izz.",
    quranVerses: [
      { surah: "Ali 'Imran", surahNumber: 3, ayah: 26, arabic: "وَتُعِزُّ مَن تَشَاءُ وَتُذِلُّ مَن تَشَاءُ بِيَدِكَ الْخَيْرُ", translation: "Tu honores qui Tu veux et Tu humilies qui Tu veux. Le bien est en Ta main.", link: "https://quran.com/fr/3:26" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Mudhill est Celui qui abaisse par la deshonneur et l'humiliation quiconque se rebelle contre Lui. Il humilie les tyrans et les oppresseurs." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ali 'Imran 3:26", url: "https://quran.com/fr/3:26" }
    ]
  },
  26: {
    detailedMeaning: "As-Sami' designe Celui qui entend toute chose, que ce soit le murmure le plus faible, la pensee interieure ou l'appel du coeur. Son audition est parfaite et absolue, elle englobe tout son et toute parole sans aucun instrument ni intermediaire. Il entend la supplication de chaque creature.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 127, arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ", translation: "Seigneur, accepte de nous. C'est Toi l'Audient, l'Omniscient.", link: "https://quran.com/fr/2:127" },
      { surah: "Al-Mujadala", surahNumber: 58, ayah: 1, arabic: "قَدْ سَمِعَ اللَّهُ قَوْلَ الَّتِي تُجَادِلُكَ فِي زَوْجِهَا", translation: "Allah a bien entendu la parole de celle qui discutait avec toi au sujet de son epoux.", link: "https://quran.com/fr/58:1" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "As-Sami' est Celui a qui aucun son n'echappe, meme le bruit de la fourmi noire sur la pierre noire dans la nuit noire." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Mujadala 58:1", url: "https://quran.com/fr/58:1" }
    ]
  },
  27: {
    detailedMeaning: "Al-Basir designe Celui qui voit toute chose, du plus grand au plus infime. Sa vision est parfaite et penetrante, elle englobe le visible et l'invisible, l'apparent et le cache. Rien n'echappe a Son regard, ni les actes ni les intentions. Il voit les efforts de Ses serviteurs.",
    quranVerses: [
      { surah: "Al-Isra", surahNumber: 17, ayah: 1, arabic: "سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى", translation: "Gloire a Celui qui a fait voyager Son serviteur la nuit, de la Mosquee Sacree a la Mosquee la plus eloignee.", link: "https://quran.com/fr/17:1" },
      { surah: "Al-Hadid", surahNumber: 57, ayah: 4, arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ", translation: "Et Il est avec vous ou que vous soyez. Et Allah observe parfaitement ce que vous faites.", link: "https://quran.com/fr/57:4" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Basir est Celui qui voit toute chose, le mouvement de la fourmi noire sur le rocher noir dans l'obscurite de la nuit. Rien ne Lui est cache." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Hadid 57:4", url: "https://quran.com/fr/57:4" }
    ]
  },
  28: {
    detailedMeaning: "Al-Hakam designe le Juge Supreme dont le jugement est sans appel et absolument juste. Il tranche entre Ses creatures avec verite et equite. Nul ne peut reviser Son jugement ni s'y opposer. Son arbitrage est parfait car il repose sur une science et une sagesse infinies.",
    quranVerses: [
      { surah: "Ghafir", surahNumber: 40, ayah: 48, arabic: "إِنَّ اللَّهَ قَدْ حَكَمَ بَيْنَ الْعِبَادِ", translation: "Certes, Allah juge entre les serviteurs.", link: "https://quran.com/fr/40:48" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Hakam est Celui qui juge entre les creatures. Son jugement ne peut etre infirme et nul ne peut s'opposer a Son decret." }
    ],
    hadithReferences: [
      { collection: "Sunan Abu Dawud", number: "4955", text: "Le Prophete (paix sur lui) a dit : Allah est Al-Hakam, et c'est a Lui que revient le jugement.", link: "https://sunnah.com/abudawud:4955" }
    ],
    sources: [
      { label: "Quran.com - Ghafir 40:48", url: "https://quran.com/fr/40:48" }
    ]
  },
  29: {
    detailedMeaning: "Al-'Adl designe Celui qui est parfaitement juste dans tous Ses actes et decrets. Il ne commet jamais la moindre injustice envers Ses creatures. Sa justice est absolue et se manifeste dans la creation, la legislation, la retribution et le jugement final. Tout ce qu'Il fait est sagesse et equite.",
    quranVerses: [
      { surah: "An-Nisa", surahNumber: 4, ayah: 40, arabic: "إِنَّ اللَّهَ لَا يَظْلِمُ مِثْقَالَ ذَرَّةٍ", translation: "Certes, Allah ne commet aucune injustice, fut-ce du poids d'un atome.", link: "https://quran.com/fr/4:40" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-'Adl est Celui dont les actes sont tous bons et sages. Il place chaque chose a sa place avec une justesse parfaite." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - An-Nisa 4:40", url: "https://quran.com/fr/4:40" }
    ]
  },
  30: {
    detailedMeaning: "Al-Latif designe Celui qui est infiniment doux et subtil dans Ses bienfaits. Il connait les details les plus fins de toute chose et accorde Ses graces de maniere delicate et imperceptible. Il aide Ses serviteurs par des voies qu'ils ne soupconnent pas et leur apporte le bien la ou ils ne l'attendent pas.",
    quranVerses: [
      { surah: "Al-An'am", surahNumber: 6, ayah: 103, arabic: "لَّا تُدْرِكُهُ الْأَبْصَارُ وَهُوَ يُدْرِكُ الْأَبْصَارَ وَهُوَ اللَّطِيفُ الْخَبِيرُ", translation: "Les regards ne peuvent L'atteindre, cependant qu'Il atteint tous les regards. Il est le Doux, le Parfaitement Informe.", link: "https://quran.com/fr/6:103" },
      { surah: "Ash-Shura", surahNumber: 42, ayah: 19, arabic: "اللَّهُ لَطِيفٌ بِعِبَادِهِ يَرْزُقُ مَن يَشَاءُ", translation: "Allah est Doux envers Ses serviteurs. Il pourvoit qui Il veut.", link: "https://quran.com/fr/42:19" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Latif a deux sens : Celui qui connait les subtilites et les details caches de toute chose, et Celui qui est doux et bienveillant envers Ses serviteurs." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ash-Shura 42:19", url: "https://quran.com/fr/42:19" }
    ]
  },
  31: {
    detailedMeaning: "Al-Khabir designe Celui qui connait parfaitement les realites interieures et cachees de toute chose. Sa connaissance penetre au-dela des apparences pour saisir l'essence profonde de chaque etre et de chaque situation. Rien ne Lui est cache, ni les intentions secretes ni les pensees intimes.",
    quranVerses: [
      { surah: "Al-An'am", surahNumber: 6, ayah: 103, arabic: "وَهُوَ اللَّطِيفُ الْخَبِيرُ", translation: "Il est le Doux, le Parfaitement Informe.", link: "https://quran.com/fr/6:103" },
      { surah: "Al-Mulk", surahNumber: 67, ayah: 14, arabic: "أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ", translation: "Ne connait-Il pas ce qu'Il a cree, Lui le Doux, le Parfaitement Informe ?", link: "https://quran.com/fr/67:14" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Khabir est Celui dont la science atteint les profondeurs cachees des choses, les mysteres des consciences et les secrets des coeurs." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Mulk 67:14", url: "https://quran.com/fr/67:14" }
    ]
  },
  32: {
    detailedMeaning: "Al-Halim designe Celui qui est d'une clemence et d'une patience infinies. Malgre les peches et la desobeissance de Ses creatures, Il ne Se hate pas de les punir. Il leur accorde un delai pour se repentir et revenir a Lui. Sa clemence n'est pas faiblesse mais maitrise parfaite.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 225, arabic: "وَاللَّهُ غَفُورٌ حَلِيمٌ", translation: "Et Allah est Pardonneur et Clement.", link: "https://quran.com/fr/2:225" },
      { surah: "Al-Baqara", surahNumber: 2, ayah: 263, arabic: "وَاللَّهُ غَنِيٌّ حَلِيمٌ", translation: "Et Allah est Riche et Clement.", link: "https://quran.com/fr/2:263" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Halim est Celui qui ne Se hate pas de punir. Il voit la desobeissance mais accorde un delai avec clemence et patience." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Baqara 2:225", url: "https://quran.com/fr/2:225" }
    ]
  },
  33: {
    detailedMeaning: "Al-'Azim designe Celui dont la grandeur depasse toute comprehension et imagination. Sa grandeur est absolue et infinie, englobant la grandeur de l'essence, des attributs et des actes. Tout ce qui est grand dans la creation est insignifiant compare a Sa grandeur.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 255, arabic: "وَهُوَ الْعَلِيُّ الْعَظِيمُ", translation: "Et Il est le Tres Haut, le Tres Grand.", link: "https://quran.com/fr/2:255" },
      { surah: "Ash-Shura", surahNumber: 42, ayah: 4, arabic: "وَهُوَ الْعَلِيُّ الْعَظِيمُ", translation: "Et c'est Lui le Tres Haut, le Tres Grand.", link: "https://quran.com/fr/42:4" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-'Azim est Celui dont la grandeur ne peut etre saisie par les esprits. Les creatures ne peuvent apprehender la realite de Sa grandeur." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Baqara 2:255", url: "https://quran.com/fr/2:255" }
    ]
  },
  34: {
    detailedMeaning: "Al-Ghafur designe Celui qui pardonne abondamment et couvre les peches. Tandis qu'Al-Ghaffar souligne la repetition du pardon, Al-Ghafur met l'accent sur l'etendue et la completude du pardon. Il efface les peches et les remplace par des bonnes actions pour ceux qui se repentent.",
    quranVerses: [
      { surah: "Az-Zumar", surahNumber: 39, ayah: 53, arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا", translation: "Dis : O Mes serviteurs qui avez commis des exces a votre propre detriment, ne desesperez pas de la misericorde d'Allah. Car Allah pardonne tous les peches.", link: "https://quran.com/fr/39:53" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Ghafur est Celui dont le pardon est vaste et complet. Il couvre les peches de Ses serviteurs et ne les leur reproche pas apres le repentir." }
    ],
    hadithReferences: [
      { collection: "Sahih Bukhari", number: "7405", text: "Allah descend chaque nuit au ciel le plus bas quand il reste le dernier tiers de la nuit et dit : Qui M'invoque pour que Je l'exauce ? Qui Me demande pour que Je lui donne ? Qui Me demande pardon pour que Je lui pardonne ?", link: "https://sunnah.com/bukhari:7405" }
    ],
    sources: [
      { label: "Quran.com - Az-Zumar 39:53", url: "https://quran.com/fr/39:53" },
      { label: "Sunnah.com - Bukhari 7405", url: "https://sunnah.com/bukhari:7405" }
    ]
  },
  35: {
    detailedMeaning: "Ash-Shakur designe Celui qui reconnait et recompense genereusement le moindre bien accompli par Ses serviteurs. Il multiplie la recompense des bonnes actions et ne laisse aucun effort sans retribution. Meme le plus petit acte de devotion est amplifie par Sa gratitude divine.",
    quranVerses: [
      { surah: "Fatir", surahNumber: 35, ayah: 30, arabic: "إِنَّهُ غَفُورٌ شَكُورٌ", translation: "Il est certes Pardonneur et Reconnaissant.", link: "https://quran.com/fr/35:30" },
      { surah: "Fatir", surahNumber: 35, ayah: 34, arabic: "إِنَّ رَبَّنَا لَغَفُورٌ شَكُورٌ", translation: "Notre Seigneur est certes Pardonneur et Reconnaissant.", link: "https://quran.com/fr/35:34" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Ash-Shakur est Celui qui recompense l'obeissance au-dela de ce qu'elle merite. Il donne une recompense eternelle pour des actes ephemeres." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Fatir 35:30", url: "https://quran.com/fr/35:30" }
    ]
  },
  36: {
    detailedMeaning: "Al-'Aliyy designe le Tres Haut, Celui qui est au-dessus de toute Sa creation par Son essence, Ses attributs et Sa domination. Sa transcendance est absolue. Rien ne Le surpasse et rien ne Lui est egal. Il est eleve au-dessus de toute description et de toute limitation.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 255, arabic: "وَهُوَ الْعَلِيُّ الْعَظِيمُ", translation: "Et Il est le Tres Haut, le Tres Grand.", link: "https://quran.com/fr/2:255" },
      { surah: "An-Nisa", surahNumber: 4, ayah: 34, arabic: "إِنَّ اللَّهَ كَانَ عَلِيًّا كَبِيرًا", translation: "Certes, Allah est Tres Haut, Tres Grand.", link: "https://quran.com/fr/4:34" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-'Aliyy est Celui qui est eleve au-dessus de toute chose. Sa hauteur est celle de la majeste et de la domination, non une hauteur spatiale." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Baqara 2:255", url: "https://quran.com/fr/2:255" }
    ]
  },
  37: {
    detailedMeaning: "Al-Kabir designe le Tres Grand, Celui dont la grandeur depasse toute mesure. Il possede la grandeur absolue et la perfection totale. Toute grandeur dans la creation n'est qu'un reflet infime de Sa grandeur. Les creatures ne peuvent mesurer ni comprendre l'etendue de Sa grandeur.",
    quranVerses: [
      { surah: "Ar-Ra'd", surahNumber: 13, ayah: 9, arabic: "عَالِمُ الْغَيْبِ وَالشَّهَادَةِ الْكَبِيرُ الْمُتَعَالِ", translation: "Le Connaisseur de l'invisible et du visible, le Tres Grand, le Tres Eleve.", link: "https://quran.com/fr/13:9" },
      { surah: "Al-Hajj", surahNumber: 22, ayah: 62, arabic: "وَأَنَّ اللَّهَ هُوَ الْعَلِيُّ الْكَبِيرُ", translation: "Et Allah est le Tres Haut, le Tres Grand.", link: "https://quran.com/fr/22:62" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Kabir est Celui qui possede la perfection de l'essence et des attributs. La grandeur veritable n'appartient qu'a Lui seul." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ar-Ra'd 13:9", url: "https://quran.com/fr/13:9" }
    ]
  },
  38: {
    detailedMeaning: "Al-Hafiz designe Celui qui preserve et protege toute chose. Il garde l'univers de la destruction, les ames des perils, et les actes des creatures dans un registre precis. Rien ne se perd ni ne s'altere sans Sa permission. Il preserve le Coran de toute falsification.",
    quranVerses: [
      { surah: "Hud", surahNumber: 11, ayah: 57, arabic: "إِنَّ رَبِّي عَلَىٰ كُلِّ شَيْءٍ حَفِيظٌ", translation: "Certes, mon Seigneur est le Gardien de toute chose.", link: "https://quran.com/fr/11:57" },
      { surah: "Al-Hijr", surahNumber: 15, ayah: 9, arabic: "إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ", translation: "C'est Nous qui avons fait descendre le Rappel et c'est Nous qui en sommes les gardiens.", link: "https://quran.com/fr/15:9" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Hafiz est Celui qui preserve toute chose de la perte et de la corruption. Il garde les cieux et la terre et ne Se lasse pas de leur garde." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Hud 11:57", url: "https://quran.com/fr/11:57" }
    ]
  },
  39: {
    detailedMeaning: "Al-Muqit designe Celui qui nourrit et sustente toute creature, tant sur le plan physique que spirituel. Il maintient chaque etre en existence et lui fournit ce dont il a besoin. Il est aussi Celui qui a la capacite totale sur toute chose, le Garant de la subsistance de toute la creation.",
    quranVerses: [
      { surah: "An-Nisa", surahNumber: 4, ayah: 85, arabic: "وَكَانَ اللَّهُ عَلَىٰ كُلِّ شَيْءٍ مُّقِيتًا", translation: "Et Allah est le Garant de toute chose.", link: "https://quran.com/fr/4:85" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Muqit est Celui qui cree la nourriture des corps et des ames, qui maintient les creatures en vie et pourvoit a chacune selon son besoin." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - An-Nisa 4:85", url: "https://quran.com/fr/4:85" }
    ]
  },
  40: {
    detailedMeaning: "Al-Hasib designe Celui qui demande des comptes a Ses creatures et qui suffit comme Garant. Il tient le registre de tous les actes et demandera des comptes le Jour du Jugement. Rien n'echappe a Son calcul. Il est aussi Celui qui suffit a Ses serviteurs en tant que Protecteur.",
    quranVerses: [
      { surah: "An-Nisa", surahNumber: 4, ayah: 6, arabic: "وَكَفَىٰ بِاللَّهِ حَسِيبًا", translation: "Et Allah suffit comme Celui qui demande des comptes.", link: "https://quran.com/fr/4:6" },
      { surah: "Al-Isra", surahNumber: 17, ayah: 14, arabic: "اقْرَأْ كِتَابَكَ كَفَىٰ بِنَفْسِكَ الْيَوْمَ عَلَيْكَ حَسِيبًا", translation: "Lis ton livre. Tu te suffis aujourd'hui comme comptable contre toi-meme.", link: "https://quran.com/fr/17:14" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Hasib est Celui qui suffit a Ses serviteurs et qui tient le compte precis de toute chose. Sa comptabilite est parfaite et exhaustive." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - An-Nisa 4:6", url: "https://quran.com/fr/4:6" }
    ]
  },
  41: {
    detailedMeaning: "Al-Jalil designe Celui qui possede la majeste et la splendeur supremes. Sa grandeur est eclatante et Sa gloire est infinie. Il allie la beaute parfaite a la grandeur absolue. Il est digne de veneration et de glorification par toute Sa creation.",
    quranVerses: [
      { surah: "Ar-Rahman", surahNumber: 55, ayah: 27, arabic: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ", translation: "Seule subsistera la Face de ton Seigneur, plein de majeste et de noblesse.", link: "https://quran.com/fr/55:27" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Jalil est Celui dont les attributs sont majestueux et sublimes. La majeste (jalal) est la grandeur alliee a la beaute." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ar-Rahman 55:27", url: "https://quran.com/fr/55:27" }
    ]
  },
  42: {
    detailedMeaning: "Al-Karim designe le Tres Genereux dont les dons sont infinis et sans condition. Sa generosite depasse toute imagination : Il donne avant qu'on ne Lui demande, Il pardonne quand Il pourrait punir, Il recompense au-dela du merite. Il est noble dans Son essence et genereux dans Ses actes.",
    quranVerses: [
      { surah: "An-Naml", surahNumber: 27, ayah: 40, arabic: "وَمَن شَكَرَ فَإِنَّمَا يَشْكُرُ لِنَفْسِهِ وَمَن كَفَرَ فَإِنَّ رَبِّي غَنِيٌّ كَرِيمٌ", translation: "Quiconque est reconnaissant, c'est dans son propre interet. Et quiconque est ingrat, mon Seigneur est Riche et Genereux.", link: "https://quran.com/fr/27:40" },
      { surah: "Al-Infitar", surahNumber: 82, ayah: 6, arabic: "يَا أَيُّهَا الْإِنسَانُ مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ", translation: "O homme ! Qu'est-ce qui t'a trompe au sujet de ton Seigneur le Genereux ?", link: "https://quran.com/fr/82:6" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Karim est Celui qui pardonne quand Il a le pouvoir de punir, qui tient Ses promesses et dont les dons depassent l'esperance." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - An-Naml 27:40", url: "https://quran.com/fr/27:40" }
    ]
  },
  43: {
    detailedMeaning: "Ar-Raqib designe Celui qui observe et surveille toute chose en permanence et sans distraction. Rien ne Lui echappe, ni les actes apparents ni les pensees cachees. Sa vigilance est constante et Sa surveillance est totale. Il voit chaque mouvement et entend chaque parole.",
    quranVerses: [
      { surah: "Al-Ahzab", surahNumber: 33, ayah: 52, arabic: "وَكَانَ اللَّهُ عَلَىٰ كُلِّ شَيْءٍ رَّقِيبًا", translation: "Et Allah observe toute chose.", link: "https://quran.com/fr/33:52" },
      { surah: "Al-Ma'ida", surahNumber: 5, ayah: 117, arabic: "فَلَمَّا تَوَفَّيْتَنِي كُنتَ أَنتَ الرَّقِيبَ عَلَيْهِمْ", translation: "Puis quand Tu m'as rappele, c'est Toi qui etais leur observateur attentif.", link: "https://quran.com/fr/5:117" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Ar-Raqib est Celui de qui rien ne peut se cacher. Sa surveillance est perpetuelle et totale sur toute la creation." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Ahzab 33:52", url: "https://quran.com/fr/33:52" }
    ]
  },
  44: {
    detailedMeaning: "Al-Mujib designe Celui qui repond aux invocations de Ses serviteurs et exauce leurs prieres. Il est proche de ceux qui L'invoquent et ne repousse jamais celui qui Le sollicite avec sincerite. Sa reponse peut etre immediate ou differee, mais elle est toujours empreinte de sagesse.",
    quranVerses: [
      { surah: "Hud", surahNumber: 11, ayah: 61, arabic: "إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ", translation: "Mon Seigneur est proche et Il repond.", link: "https://quran.com/fr/11:61" },
      { surah: "Al-Baqara", surahNumber: 2, ayah: 186, arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ", translation: "Et quand Mes serviteurs t'interrogent a Mon sujet, Je suis tout proche. Je reponds a l'appel de celui qui M'invoque.", link: "https://quran.com/fr/2:186" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Mujib est Celui qui repond aux supplications par l'exaucement, aux obeissances par la recompense et aux necessites par le secours." }
    ],
    hadithReferences: [
      { collection: "Tirmidhi", number: "3573", text: "Le Prophete (paix sur lui) a dit : Invoquez Allah avec la certitude d'etre exauces, et sachez qu'Allah n'exauce pas l'invocation d'un coeur distrait.", link: "https://sunnah.com/tirmidhi:3573" }
    ],
    sources: [
      { label: "Quran.com - Al-Baqara 2:186", url: "https://quran.com/fr/2:186" },
      { label: "Sunnah.com - Tirmidhi 3573", url: "https://sunnah.com/tirmidhi:3573" }
    ]
  },
  45: {
    detailedMeaning: "Al-Wasi' designe Celui dont la misericorde, la science et la generosite englobent toute chose. Il n'y a aucune limite a Ses attributs. Sa largesse embrasse tous les etres et toutes les situations. Rien ne peut epuiser Ses tresors ni limiter Sa generosite.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 115, arabic: "فَأَيْنَمَا تُوَلُّوا فَثَمَّ وَجْهُ اللَّهِ إِنَّ اللَّهَ وَاسِعٌ عَلِيمٌ", translation: "Ou que vous vous tourniez, la est la Face d'Allah. Allah est Vaste et Omniscient.", link: "https://quran.com/fr/2:115" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Wasi' est Celui dont la richesse et la science n'ont pas de limites. Sa misericorde embrasse toute chose et Ses dons sont illimites." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Baqara 2:115", url: "https://quran.com/fr/2:115" }
    ]
  },
  46: {
    detailedMeaning: "Al-Hakim designe Celui qui agit avec une sagesse parfaite et infaillible. Chacun de Ses actes et de Ses decrets est empreint de sagesse, meme si les creatures ne la percoivent pas immediatement. Il place chaque chose a sa juste place et au moment opportun.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 129, arabic: "إِنَّكَ أَنتَ الْعَزِيزُ الْحَكِيمُ", translation: "Certes, c'est Toi le Tout Puissant, le Sage.", link: "https://quran.com/fr/2:129" },
      { surah: "Al-Hashr", surahNumber: 59, ayah: 24, arabic: "لَهُ الْأَسْمَاءُ الْحُسْنَىٰ يُسَبِّحُ لَهُ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ وَهُوَ الْعَزِيزُ الْحَكِيمُ", translation: "A Lui les plus beaux noms. Ce qui est dans les cieux et la terre Le glorifie. Il est le Tout Puissant, le Sage.", link: "https://quran.com/fr/59:24" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Hakim est Celui qui juge avec justesse et place chaque chose a sa place. Sa sagesse se manifeste dans la creation et dans la legislation." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Baqara 2:129", url: "https://quran.com/fr/2:129" }
    ]
  },
  47: {
    detailedMeaning: "Al-Wadud designe Celui qui aime Ses serviteurs pieux d'un amour veritable et qui est aime par eux. Son amour se manifeste par Sa bienveillance, Son pardon et Sa generosite. Il aime ceux qui Le suivent et met l'amour entre les coeurs de Ses serviteurs.",
    quranVerses: [
      { surah: "Hud", surahNumber: 11, ayah: 90, arabic: "وَاسْتَغْفِرُوا رَبَّكُمْ ثُمَّ تُوبُوا إِلَيْهِ إِنَّ رَبِّي رَحِيمٌ وَدُودٌ", translation: "Implorez le pardon de votre Seigneur puis revenez a Lui. Mon Seigneur est Misericordieux et plein d'amour.", link: "https://quran.com/fr/11:90" },
      { surah: "Al-Buruj", surahNumber: 85, ayah: 14, arabic: "وَهُوَ الْغَفُورُ الْوَدُودُ", translation: "Et c'est Lui le Pardonneur, le Plein d'amour.", link: "https://quran.com/fr/85:14" }
    ],
    scholarComments: [
      { scholar: "Ibn al-Qayyim", sourceKey: "ibn_qayyim", text: "Al-Wadud est Celui qui aime Ses serviteurs obeissants et qui place l'amour de Lui dans leurs coeurs. Son amour est la source de tout bien." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Buruj 85:14", url: "https://quran.com/fr/85:14" }
    ]
  },
  48: {
    detailedMeaning: "Al-Majid designe Celui qui possede toute la gloire et la magnificence. Il est noble par Son essence, genereux dans Ses actes et glorieux dans Ses attributs. Sa gloire allie la grandeur a la bonte, la puissance a la generosite.",
    quranVerses: [
      { surah: "Hud", surahNumber: 11, ayah: 73, arabic: "رَحْمَتُ اللَّهِ وَبَرَكَاتُهُ عَلَيْكُمْ أَهْلَ الْبَيْتِ إِنَّهُ حَمِيدٌ مَّجِيدٌ", translation: "La misericorde d'Allah et Ses benedictions soient sur vous, gens de la maison. Il est certes Digne de louange et de gloire.", link: "https://quran.com/fr/11:73" },
      { surah: "Al-Buruj", surahNumber: 85, ayah: 15, arabic: "ذُو الْعَرْشِ الْمَجِيدُ", translation: "Le Maitre du Trone, le Glorieux.", link: "https://quran.com/fr/85:15" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Majid est Celui dont la noblesse de l'essence, la generosite des actes et la beaute des attributs sont au plus haut degre de perfection." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Buruj 85:15", url: "https://quran.com/fr/85:15" }
    ]
  },
  49: {
    detailedMeaning: "Al-Ba'ith designe Celui qui ressuscite les morts le Jour du Jugement et les rassemble pour le Compte final. Il est aussi Celui qui envoie les prophetes et les messagers pour guider l'humanite. Il reveille les consciences et fait renaître l'espoir dans les coeurs.",
    quranVerses: [
      { surah: "Al-Hajj", surahNumber: 22, ayah: 7, arabic: "وَأَنَّ السَّاعَةَ آتِيَةٌ لَّا رَيْبَ فِيهَا وَأَنَّ اللَّهَ يَبْعَثُ مَن فِي الْقُبُورِ", translation: "Et l'Heure viendra sans aucun doute, et Allah ressuscitera ceux qui sont dans les tombes.", link: "https://quran.com/fr/22:7" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Ba'ith est Celui qui ressuscite les morts, qui envoie les messagers et qui suscite dans les coeurs la lumiere de la foi." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Hajj 22:7", url: "https://quran.com/fr/22:7" }
    ]
  },
  50: {
    detailedMeaning: "Ash-Shahid designe Celui qui est temoin de toute chose, present partout par Sa science. Il voit et entend tout, connait l'apparent et le cache. Le Jour du Jugement, Il temoignera des actes de chaque creature. Rien n'echappe a Son temoignage.",
    quranVerses: [
      { surah: "Al-Buruj", surahNumber: 85, ayah: 9, arabic: "وَاللَّهُ عَلَىٰ كُلِّ شَيْءٍ شَهِيدٌ", translation: "Et Allah est temoin de toute chose.", link: "https://quran.com/fr/85:9" },
      { surah: "An-Nisa", surahNumber: 4, ayah: 166, arabic: "لَّٰكِنِ اللَّهُ يَشْهَدُ بِمَا أَنزَلَ إِلَيْكَ أَنزَلَهُ بِعِلْمِهِ", translation: "Mais Allah temoigne de ce qu'Il t'a revele, Il l'a revele en toute connaissance.", link: "https://quran.com/fr/4:166" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Ash-Shahid est Celui de qui rien n'est absent. Il est present par Sa science et Son temoignage couvre tout l'univers." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Buruj 85:9", url: "https://quran.com/fr/85:9" }
    ]
  },
  51: {
    detailedMeaning: "Al-Haqq designe Celui dont l'existence est la seule Verite absolue et certaine. Il est la Realite ultime, par opposition a tout ce qui est ephemere et illusoire. Sa parole est verite, Sa promesse est verite, Sa rencontre est verite, Son Paradis et Son Enfer sont verite.",
    quranVerses: [
      { surah: "Al-Hajj", surahNumber: 22, ayah: 6, arabic: "ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ وَأَنَّهُ يُحْيِي الْمَوْتَىٰ", translation: "C'est parce qu'Allah est la Verite et c'est Lui qui donne la vie aux morts.", link: "https://quran.com/fr/22:6" },
      { surah: "Luqman", surahNumber: 31, ayah: 30, arabic: "ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ وَأَنَّ مَا يَدْعُونَ مِن دُونِهِ الْبَاطِلُ", translation: "C'est parce qu'Allah est la Verite et que ce qu'ils invoquent en dehors de Lui est le faux.", link: "https://quran.com/fr/31:30" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Haqq est Celui dont l'existence est indeniable et necessaire. Tout en dehors de Lui est contingent et ephemere." }
    ],
    hadithReferences: [
      { collection: "Sahih Bukhari", number: "1120", text: "Le Prophete (paix sur lui) disait dans sa priere nocturne : O Allah, Tu es Al-Haqq, Ta promesse est verite, Ta parole est verite et Ta rencontre est verite.", link: "https://sunnah.com/bukhari:1120" }
    ],
    sources: [
      { label: "Quran.com - Al-Hajj 22:6", url: "https://quran.com/fr/22:6" },
      { label: "Sunnah.com - Bukhari 1120", url: "https://sunnah.com/bukhari:1120" }
    ]
  },
  52: {
    detailedMeaning: "Al-Wakil designe Celui a qui l'on peut confier toutes ses affaires avec une confiance totale. Il gere les affaires de Ses creatures avec perfection et sagesse. Il suffit comme Garant et Protecteur. Se remettre a Lui (tawakkul) est le fondement de la foi.",
    quranVerses: [
      { surah: "Ali 'Imran", surahNumber: 3, ayah: 173, arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", translation: "Allah nous suffit, Il est notre meilleur Garant.", link: "https://quran.com/fr/3:173" },
      { surah: "Al-Ahzab", surahNumber: 33, ayah: 3, arabic: "وَتَوَكَّلْ عَلَى اللَّهِ وَكَفَىٰ بِاللَّهِ وَكِيلًا", translation: "Et place ta confiance en Allah. Allah suffit comme Garant.", link: "https://quran.com/fr/33:3" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Wakil est Celui a qui sont confiees les affaires de Ses creatures. Celui qui se remet a Lui ne sera jamais decu." }
    ],
    hadithReferences: [
      { collection: "Tirmidhi", number: "2517", text: "Le Prophete (paix sur lui) a dit : Si vous vous en remettiez a Allah d'un veritable tawakkul, Il vous accorderait la subsistance comme Il la donne aux oiseaux.", link: "https://sunnah.com/tirmidhi:2517" }
    ],
    sources: [
      { label: "Quran.com - Ali 'Imran 3:173", url: "https://quran.com/fr/3:173" },
      { label: "Sunnah.com - Tirmidhi 2517", url: "https://sunnah.com/tirmidhi:2517" }
    ]
  },
  53: {
    detailedMeaning: "Al-Qawi designe Celui dont la force est infinie et absolue, qui ne connait aucune faiblesse ni fatigue. Sa force ne diminue jamais et rien ne peut Lui resister. Il est la source de toute force dans l'univers et nul ne peut echapper a Sa puissance.",
    quranVerses: [
      { surah: "Al-Hajj", surahNumber: 22, ayah: 74, arabic: "إِنَّ اللَّهَ لَقَوِيٌّ عَزِيزٌ", translation: "Certes, Allah est Fort et Tout Puissant.", link: "https://quran.com/fr/22:74" },
      { surah: "Al-Hadid", surahNumber: 57, ayah: 25, arabic: "إِنَّ اللَّهَ قَوِيٌّ عَزِيزٌ", translation: "Certes, Allah est Fort et Tout Puissant.", link: "https://quran.com/fr/57:25" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Qawi est Celui dont la force est parfaite et complete, qui ne connait ni faiblesse ni impuissance dans aucun de Ses actes." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Hajj 22:74", url: "https://quran.com/fr/22:74" }
    ]
  },
  54: {
    detailedMeaning: "Al-Matin designe Celui dont la puissance est inebranlable et constante. Il n'est affecte par aucune fatigue, aucune difficulte. Sa fermete est absolue dans l'execution de Sa volonte. Rien ne peut flechir Sa determination ni affaiblir Sa resolution.",
    quranVerses: [
      { surah: "Adh-Dhariyat", surahNumber: 51, ayah: 58, arabic: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ", translation: "C'est Allah qui est le Pourvoyeur, le Detenteur de la force, l'Inebranlable.", link: "https://quran.com/fr/51:58" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Matin est Celui dont la force ne faiblit pas et dont la puissance ne s'epuise jamais. Sa fermete est sans faille." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Adh-Dhariyat 51:58", url: "https://quran.com/fr/51:58" }
    ]
  },
  55: {
    detailedMeaning: "Al-Wali designe l'Allie protecteur des croyants. Il les soutient, les guide et les defend. Il est leur ami et leur defenseur dans ce monde et dans l'au-dela. Son alliance est la plus precieuse des protections, et ceux qu'Il prend sous Sa garde ne connaissent ni crainte ni tristesse.",
    quranVerses: [
      { surah: "Ash-Shura", surahNumber: 42, ayah: 9, arabic: "أَمِ اتَّخَذُوا مِن دُونِهِ أَوْلِيَاءَ فَاللَّهُ هُوَ الْوَلِيُّ", translation: "Ont-ils pris des allies en dehors de Lui ? C'est Allah qui est l'Allie.", link: "https://quran.com/fr/42:9" },
      { surah: "Al-Baqara", surahNumber: 2, ayah: 257, arabic: "اللَّهُ وَلِيُّ الَّذِينَ آمَنُوا يُخْرِجُهُم مِّنَ الظُّلُمَاتِ إِلَى النُّورِ", translation: "Allah est l'Allie de ceux qui croient. Il les fait sortir des tenebres vers la lumiere.", link: "https://quran.com/fr/2:257" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Wali est Celui qui prend en charge les affaires de Ses serviteurs croyants, les assiste et les protege de tout mal." }
    ],
    hadithReferences: [
      { collection: "Sahih Bukhari", number: "6502", text: "Allah a dit : Quiconque prend pour ennemi un de Mes allies, Je lui declare la guerre.", link: "https://sunnah.com/bukhari:6502" }
    ],
    sources: [
      { label: "Quran.com - Al-Baqara 2:257", url: "https://quran.com/fr/2:257" },
      { label: "Sunnah.com - Bukhari 6502", url: "https://sunnah.com/bukhari:6502" }
    ]
  },
  56: {
    detailedMeaning: "Al-Hamid designe Celui qui merite toute la louange pour la perfection de Ses attributs et la bonte de Ses actes. Il est loue en toute circonstance, dans l'aisance comme dans l'epreuve. Toute louange Lui revient de droit, que les creatures Le louent ou non.",
    quranVerses: [
      { surah: "Ibrahim", surahNumber: 14, ayah: 1, arabic: "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ لِتُخْرِجَ النَّاسَ مِنَ الظُّلُمَاتِ إِلَى النُّورِ بِإِذْنِ رَبِّهِمْ إِلَىٰ صِرَاطِ الْعَزِيزِ الْحَمِيدِ", translation: "Un Livre que Nous avons fait descendre vers toi afin que tu fasses sortir les gens des tenebres vers la lumiere, par la permission de leur Seigneur, vers le chemin du Tout Puissant, du Digne de louange.", link: "https://quran.com/fr/14:1" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Hamid est Celui qui est loue pour tous Ses attributs et Ses actes. Il est le seul digne de louange absolue et inconditionnelle." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ibrahim 14:1", url: "https://quran.com/fr/14:1" }
    ]
  },
  57: {
    detailedMeaning: "Al-Muhsi designe Celui qui connait le nombre exact de toute chose dans Sa creation. Il denombre les gouttes de pluie, les grains de sable, les feuilles des arbres et les souffles des creatures. Sa science numerique est parfaite et rien ne Lui echappe.",
    quranVerses: [
      { surah: "Maryam", surahNumber: 19, ayah: 94, arabic: "لَّقَدْ أَحْصَاهُمْ وَعَدَّهُمْ عَدًّا", translation: "Il les a certes recenses et bien comptes.", link: "https://quran.com/fr/19:94" },
      { surah: "Ya-Sin", surahNumber: 36, ayah: 12, arabic: "وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ فِي إِمَامٍ مُّبِينٍ", translation: "Et Nous avons denombre toute chose dans un registre explicite.", link: "https://quran.com/fr/36:12" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Muhsi est Celui qui connait le nombre de toute chose. Il a tout denombre dans Sa science et rien ne Lui echappe, aussi petit soit-il." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Maryam 19:94", url: "https://quran.com/fr/19:94" }
    ]
  },
  58: {
    detailedMeaning: "Al-Mubdi' designe Celui qui a initie la creation pour la premiere fois, sans modele prealable et sans precedent. Il a fait exister l'univers a partir du neant absolu. Cette premiere creation temoigne de Sa puissance infinie et de Sa volonte creative.",
    quranVerses: [
      { surah: "Al-Buruj", surahNumber: 85, ayah: 13, arabic: "إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ", translation: "C'est Lui qui commence et qui recommence.", link: "https://quran.com/fr/85:13" },
      { surah: "Yunus", surahNumber: 10, ayah: 4, arabic: "إِنَّهُ يَبْدَأُ الْخَلْقَ ثُمَّ يُعِيدُهُ", translation: "C'est Lui qui commence la creation puis la recommence.", link: "https://quran.com/fr/10:4" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Mubdi' est Celui qui a donne l'existence a toute chose a partir du neant, sans cause anterieure ni modele preetabli." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Buruj 85:13", url: "https://quran.com/fr/85:13" }
    ]
  },
  59: {
    detailedMeaning: "Al-Mu'id designe Celui qui ramene la creation a la vie apres la mort. Comme Il a cree une premiere fois, Il recree pour la resurrection et le Jugement dernier. La recreation est plus facile que la creation initiale, et elle est une certitude promise par Allah.",
    quranVerses: [
      { surah: "Al-Buruj", surahNumber: 85, ayah: 13, arabic: "إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ", translation: "C'est Lui qui commence et qui recommence.", link: "https://quran.com/fr/85:13" },
      { surah: "Ar-Rum", surahNumber: 30, ayah: 27, arabic: "وَهُوَ الَّذِي يَبْدَأُ الْخَلْقَ ثُمَّ يُعِيدُهُ وَهُوَ أَهْوَنُ عَلَيْهِ", translation: "C'est Lui qui commence la creation puis la recommence, et cela Lui est plus facile encore.", link: "https://quran.com/fr/30:27" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Mu'id est Celui qui ramene les creatures a la vie apres la mort pour le Jour de la Retribution. Cela est facile pour Lui." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ar-Rum 30:27", url: "https://quran.com/fr/30:27" }
    ]
  },
  60: {
    detailedMeaning: "Al-Muhyi designe Celui qui donne la vie a toute creature. Il donne la vie aux corps en y insufflant l'ame, et la vie aux coeurs en y insufflant la foi et la guidance. Il fait revivre la terre apres sa mort par la pluie, et ressuscitera les morts le Jour du Jugement.",
    quranVerses: [
      { surah: "Ar-Rum", surahNumber: 30, ayah: 50, arabic: "فَانظُرْ إِلَىٰ آثَارِ رَحْمَتِ اللَّهِ كَيْفَ يُحْيِي الْأَرْضَ بَعْدَ مَوْتِهَا", translation: "Regarde les traces de la misericorde d'Allah, comment Il redonne la vie a la terre apres sa mort.", link: "https://quran.com/fr/30:50" },
      { surah: "Al-Hajj", surahNumber: 22, ayah: 6, arabic: "وَأَنَّهُ يُحْيِي الْمَوْتَىٰ وَأَنَّهُ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", translation: "Et c'est Lui qui donne la vie aux morts et Il est Omnipotent.", link: "https://quran.com/fr/22:6" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Muhyi est Celui qui cree la vie sous toutes ses formes. La vie la plus noble est celle du coeur par la lumiere de la foi." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ar-Rum 30:50", url: "https://quran.com/fr/30:50" }
    ]
  },
  61: {
    detailedMeaning: "Al-Mumit designe Celui qui decrete la mort de toute creature vivante au moment qu'Il a fixe. La mort n'est pas un neant mais un passage decrete par Allah avec sagesse. Chaque ame goutera la mort, et ce nom rappelle la souverainete d'Allah sur la vie et la mort.",
    quranVerses: [
      { surah: "Al-Mulk", surahNumber: 67, ayah: 2, arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا", translation: "Celui qui a cree la mort et la vie afin de vous eprouver, qui de vous est le meilleur en oeuvres.", link: "https://quran.com/fr/67:2" },
      { surah: "Ali 'Imran", surahNumber: 3, ayah: 185, arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", translation: "Toute ame goutera la mort.", link: "https://quran.com/fr/3:185" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Mumit est Celui qui fait mourir les vivants. La mort est une creature d'Allah, decretee selon Sa sagesse et Son decret eternel." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Mulk 67:2", url: "https://quran.com/fr/67:2" }
    ]
  },
  62: {
    detailedMeaning: "Al-Hayy designe le Vivant eternel dont la vie est parfaite et ne connait ni commencement ni fin. Sa vie n'est precedee d'aucune mort et ne sera suivie d'aucune fin. Il est le Vivant par essence, tandis que toute autre vie depend de Lui. Ce nom est considere comme l'un des plus grands noms d'Allah.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 255, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", translation: "Allah ! Point de divinite a part Lui, le Vivant, Celui qui subsiste par Lui-meme.", link: "https://quran.com/fr/2:255" },
      { surah: "Ghafir", surahNumber: 40, ayah: 65, arabic: "هُوَ الْحَيُّ لَا إِلَٰهَ إِلَّا هُوَ فَادْعُوهُ مُخْلِصِينَ لَهُ الدِّينَ", translation: "C'est Lui le Vivant, point de divinite a part Lui. Invoquez-Le avec devotion sincere.", link: "https://quran.com/fr/40:65" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Hayy est Celui dont la vie est eternelle et parfaite. Tous les attributs d'action decoulent de la vie, car seul le vivant peut savoir, vouloir et agir." },
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Hayy est le Vivant qui ne meurt pas. Sa vie est inherente a Son essence et ne depend d'aucune cause exterieure." }
    ],
    hadithReferences: [
      { collection: "Tirmidhi", number: "3524", text: "Le Prophete (paix sur lui) a dit : Le plus grand nom d'Allah se trouve dans ces deux versets : votre Dieu est un Dieu unique, et : Allah, point de divinite a part Lui, le Vivant, le Subsistant.", link: "https://sunnah.com/tirmidhi:3524" }
    ],
    sources: [
      { label: "Quran.com - Al-Baqara 2:255", url: "https://quran.com/fr/2:255" },
      { label: "Sunnah.com - Tirmidhi 3524", url: "https://sunnah.com/tirmidhi:3524" }
    ]
  },
  63: {
    detailedMeaning: "Al-Qayyum designe Celui qui subsiste par Lui-meme et par qui toute chose subsiste. Il n'a besoin de rien tandis que tout l'univers a besoin de Lui a chaque instant. Sans Lui, rien ne pourrait exister ni se maintenir. Ce nom est lie a Al-Hayy et fait partie du plus grand nom d'Allah.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 255, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ", translation: "Allah ! Point de divinite a part Lui, le Vivant, le Subsistant. Ni somnolence ni sommeil ne Le saisissent.", link: "https://quran.com/fr/2:255" },
      { surah: "Ali 'Imran", surahNumber: 3, ayah: 2, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", translation: "Allah ! Point de divinite a part Lui, le Vivant, le Subsistant.", link: "https://quran.com/fr/3:2" }
    ],
    scholarComments: [
      { scholar: "Ibn al-Qayyim", sourceKey: "ibn_qayyim", text: "Al-Qayyum est Celui qui subsiste par Lui-meme et fait subsister toute chose. Tous les noms d'Allah reviennent a Al-Hayy et Al-Qayyum." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Baqara 2:255", url: "https://quran.com/fr/2:255" }
    ]
  },
  64: {
    detailedMeaning: "Al-Wajid designe Celui qui possede tout et qui trouve toute chose qu'Il veut sans effort. Rien ne Lui manque et rien ne Lui echappe. Il est l'Opulent par essence, possedant toute perfection et toute richesse. Aucun besoin ne L'atteint.",
    quranVerses: [
      { surah: "Ad-Duha", surahNumber: 93, ayah: 7, arabic: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ", translation: "Ne t'a-t-Il pas trouve egare et Il t'a guide.", link: "https://quran.com/fr/93:7" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Wajid est Celui a qui rien ne manque. Il trouve tout ce qu'Il desire et possede tout ce qu'Il veut, sans peine ni effort." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ad-Duha 93:7", url: "https://quran.com/fr/93:7" }
    ]
  },
  65: {
    detailedMeaning: "Al-Majid designe Celui dont la noblesse et la gloire sont immenses et absolues. Il est genereux dans Ses dons, noble dans Son essence et glorieux dans Ses actes. Ce nom combine la grandeur avec la bonte, la majeste avec la generosite.",
    quranVerses: [
      { surah: "Hud", surahNumber: 11, ayah: 73, arabic: "إِنَّهُ حَمِيدٌ مَّجِيدٌ", translation: "Il est certes Digne de louange et de gloire.", link: "https://quran.com/fr/11:73" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Majid est Celui dont la noblesse est eminente et les bienfaits sont abondants. Il allie la grandeur du rang a la generosite des actes." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Hud 11:73", url: "https://quran.com/fr/11:73" }
    ]
  },
  66: {
    detailedMeaning: "Al-Wahid designe l'Unique dans Son essence, Ses attributs et Ses actes. Il n'a pas d'associe, pas de semblable et pas d'egal. Son unicite est absolue et constitue le fondement de la foi islamique (Tawhid). Rien dans la creation ne Lui ressemble.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 163, arabic: "وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ لَّا إِلَٰهَ إِلَّا هُوَ الرَّحْمَٰنُ الرَّحِيمُ", translation: "Et votre Dieu est un Dieu unique. Point de divinite a part Lui, le Tout Misericordieux, le Tres Misericordieux.", link: "https://quran.com/fr/2:163" },
      { surah: "Al-Ikhlas", surahNumber: 112, ayah: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Dis : Il est Allah, Unique.", link: "https://quran.com/fr/112:1" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Wahid est Celui qui n'a pas de second dans Son essence, pas de semblable dans Ses attributs et pas de partenaire dans Ses actes." }
    ],
    hadithReferences: [
      { collection: "Sahih Bukhari", number: "7392", text: "Le Prophete (paix sur lui) a dit : Allah etait et rien n'etait avec Lui.", link: "https://sunnah.com/bukhari:7392" }
    ],
    sources: [
      { label: "Quran.com - Al-Ikhlas 112:1", url: "https://quran.com/fr/112:1" },
      { label: "Sunnah.com - Bukhari 7392", url: "https://sunnah.com/bukhari:7392" }
    ]
  },
  67: {
    detailedMeaning: "As-Samad designe Celui vers qui toute la creation se tourne pour ses besoins. Il est le Maitre absolu, plein et parfait, qui n'a besoin de rien. Toute creature depend de Lui, tandis que Lui ne depend de personne. Il est la Refuge ultime vers lequel convergent toutes les requetes.",
    quranVerses: [
      { surah: "Al-Ikhlas", surahNumber: 112, ayah: 2, arabic: "اللَّهُ الصَّمَدُ", translation: "Allah, le Soutien universel.", link: "https://quran.com/fr/112:2" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_tafsir", text: "As-Samad est le Maitre dont la souverainete est complete, Celui vers qui on se dirige dans les besoins et a qui on s'adresse dans les epreuves." },
      { scholar: "Ibn al-Qayyim", sourceKey: "ibn_qayyim", text: "As-Samad est Celui qui reunit toutes les qualites de perfection. Il est le Plein qui n'a aucun vide, le Riche dont rien ne manque." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Ikhlas 112:2", url: "https://quran.com/fr/112:2" }
    ]
  },
  68: {
    detailedMeaning: "Al-Qadir designe Celui qui a le pouvoir absolu de faire ce qu'Il veut, quand Il veut et comme Il veut. Sa capacite est illimitee et rien ne peut L'en empecher. Il cree, detruit, donne la vie, donne la mort, recompense et punit selon Sa volonte.",
    quranVerses: [
      { surah: "Al-An'am", surahNumber: 6, ayah: 65, arabic: "قُلْ هُوَ الْقَادِرُ عَلَىٰ أَن يَبْعَثَ عَلَيْكُمْ عَذَابًا مِّن فَوْقِكُمْ", translation: "Dis : Il est capable de vous envoyer un chatiment d'au-dessus de vous.", link: "https://quran.com/fr/6:65" },
      { surah: "Al-Baqara", surahNumber: 2, ayah: 20, arabic: "إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", translation: "Certes, Allah est Omnipotent.", link: "https://quran.com/fr/2:20" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Qadir est Celui qui fait exister les choses conformement a Sa volonte et a Sa science. Sa puissance n'est entravee par rien." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-An'am 6:65", url: "https://quran.com/fr/6:65" }
    ]
  },
  69: {
    detailedMeaning: "Al-Muqtadir designe Celui dont la puissance s'exerce de maniere absolue et sans effort sur toute chose. Ce nom renforce Al-Qadir en soulignant que Sa puissance se realise effectivement et parfaitement. Rien ne peut echapper a Son emprise ni resister a Sa volonte.",
    quranVerses: [
      { surah: "Al-Qamar", surahNumber: 54, ayah: 42, arabic: "كَذَّبُوا بِآيَاتِنَا كُلِّهَا فَأَخَذْنَاهُمْ أَخْذَ عَزِيزٍ مُّقْتَدِرٍ", translation: "Ils denoncerent Nos signes, tous. Nous les saisimes de la saisie d'un Tout Puissant Omnipotent.", link: "https://quran.com/fr/54:42" },
      { surah: "Al-Kahf", surahNumber: 18, ayah: 45, arabic: "وَكَانَ اللَّهُ عَلَىٰ كُلِّ شَيْءٍ مُّقْتَدِرًا", translation: "Et Allah est Omnipotent.", link: "https://quran.com/fr/18:45" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Muqtadir est une forme intensive de Al-Qadir. Il indique que la puissance d'Allah s'exerce effectivement et sans entrave sur toute chose." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Qamar 54:42", url: "https://quran.com/fr/54:42" }
    ]
  },
  70: {
    detailedMeaning: "Al-Muqaddim designe Celui qui avance et met en avant ce qu'Il veut parmi Ses creatures. Il avance certaines personnes en rang, en honneur ou en temps selon Sa sagesse. Ce nom se comprend en pair avec Al-Mu'akhkhir et exprime la souverainete d'Allah sur l'ordre des choses.",
    quranVerses: [
      { surah: "Qaf", surahNumber: 50, ayah: 28, arabic: "قَالَ لَا تَخْتَصِمُوا لَدَيَّ وَقَدْ قَدَّمْتُ إِلَيْكُم بِالْوَعِيدِ", translation: "Il dira : Ne vous disputez pas devant Moi. Je vous avais avertis.", link: "https://quran.com/fr/50:28" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Muqaddim est Celui qui avance les choses a leur place et a leur temps selon un ordre parfait. Il met en avant les causes avant les effets." }
    ],
    hadithReferences: [
      { collection: "Sahih Bukhari", number: "1120", text: "Le Prophete (paix sur lui) disait : O Allah, pardonne-moi ce que j'ai fait et ce que je ferai, ce que j'ai cache et ce que j'ai rendu public. Tu es Al-Muqaddim et Al-Mu'akhkhir.", link: "https://sunnah.com/bukhari:1120" }
    ],
    sources: [
      { label: "Quran.com - Qaf 50:28", url: "https://quran.com/fr/50:28" }
    ]
  },
  71: {
    detailedMeaning: "Al-Mu'akhkhir designe Celui qui retarde et repousse ce qu'Il veut selon Sa sagesse parfaite. Il retarde le chatiment pour laisser place au repentir, retarde certains evenements pour une sagesse que Lui seul connait. Ce nom est le complement d'Al-Muqaddim.",
    quranVerses: [
      { surah: "Ibrahim", surahNumber: 14, ayah: 42, arabic: "وَلَا تَحْسَبَنَّ اللَّهَ غَافِلًا عَمَّا يَعْمَلُ الظَّالِمُونَ إِنَّمَا يُؤَخِّرُهُمْ لِيَوْمٍ تَشْخَصُ فِيهِ الْأَبْصَارُ", translation: "Ne pense surtout pas qu'Allah est inattentif a ce que font les injustes. Il les ajourne seulement jusqu'au jour ou les yeux seront fixes.", link: "https://quran.com/fr/14:42" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Mu'akhkhir est Celui qui retarde les choses et les reporte selon Sa sagesse. Il retarde le chatiment des pecheurs pour leur donner une chance de se repentir." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ibrahim 14:42", url: "https://quran.com/fr/14:42" }
    ]
  },
  72: {
    detailedMeaning: "Al-Awwal designe le Premier, avant qui rien n'existait. Il est eternel sans commencement, Son existence n'a pas de debut. Avant la creation du temps, de l'espace et de l'univers, Allah existait seul. Ce nom affirme l'eternite passee d'Allah.",
    quranVerses: [
      { surah: "Al-Hadid", surahNumber: 57, ayah: 3, arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ", translation: "C'est Lui le Premier et le Dernier, l'Apparent et le Cache. Et Il est Omniscient.", link: "https://quran.com/fr/57:3" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Awwal est Celui qui existait avant toute chose. Il n'a pas de commencement et Son existence precede toute existence." }
    ],
    hadithReferences: [
      { collection: "Sahih Muslim", number: "2713", text: "Le Prophete (paix sur lui) disait : O Allah, Tu es Al-Awwal et rien n'est avant Toi, Tu es Al-Akhir et rien n'est apres Toi.", link: "https://sunnah.com/muslim:2713" }
    ],
    sources: [
      { label: "Quran.com - Al-Hadid 57:3", url: "https://quran.com/fr/57:3" },
      { label: "Sunnah.com - Muslim 2713", url: "https://sunnah.com/muslim:2713" }
    ]
  },
  73: {
    detailedMeaning: "Al-Akhir designe le Dernier, apres qui rien ne sera. Il est eternel sans fin, Son existence ne cessera jamais. Quand toute la creation aura peri, Allah demeurera seul. Ce nom affirme l'eternite future d'Allah et Sa permanence absolue.",
    quranVerses: [
      { surah: "Al-Hadid", surahNumber: 57, ayah: 3, arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ", translation: "C'est Lui le Premier et le Dernier, l'Apparent et le Cache.", link: "https://quran.com/fr/57:3" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Akhir est Celui qui demeure apres la disparition de toute chose. Il est eternel sans fin comme Il est eternel sans commencement." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Hadid 57:3", url: "https://quran.com/fr/57:3" }
    ]
  },
  74: {
    detailedMeaning: "Az-Zahir designe Celui dont l'existence est manifeste et evidente par les signes qu'Il a places dans la creation. Tout dans l'univers temoigne de Son existence, de Sa puissance et de Sa sagesse. Il est au-dessus de toute chose par Sa domination et Sa grandeur.",
    quranVerses: [
      { surah: "Al-Hadid", surahNumber: 57, ayah: 3, arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ", translation: "C'est Lui le Premier et le Dernier, l'Apparent et le Cache.", link: "https://quran.com/fr/57:3" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Az-Zahir est Celui dont l'existence est evidente par la multitude de Ses signes. Tout dans la creation pointe vers Lui." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Hadid 57:3", url: "https://quran.com/fr/57:3" }
    ]
  },
  75: {
    detailedMeaning: "Al-Batin designe Celui qui est cache aux sens mais connu par la foi, la reflexion et les signes de la creation. Son essence ne peut etre percue par les yeux ni saisie par l'imagination. Il connait les secrets les plus intimes et les pensees les plus cachees.",
    quranVerses: [
      { surah: "Al-Hadid", surahNumber: 57, ayah: 3, arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ", translation: "C'est Lui le Premier et le Dernier, l'Apparent et le Cache. Et Il est Omniscient.", link: "https://quran.com/fr/57:3" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Batin est Celui qui est cache aux regards et aux sens. Son essence ne peut etre apprehendee par aucune creature." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Hadid 57:3", url: "https://quran.com/fr/57:3" }
    ]
  },
  76: {
    detailedMeaning: "Al-Wali designe Celui qui gere et administre toute Sa creation avec autorite et sagesse. Il est le Maitre de l'univers qui dirige toute chose selon Son decret. Sa gouvernance est parfaite et ne connait ni defaillance ni interruption.",
    quranVerses: [
      { surah: "Ar-Ra'd", surahNumber: 13, ayah: 11, arabic: "لَهُ مُعَقِّبَاتٌ مِّن بَيْنِ يَدَيْهِ وَمِنْ خَلْفِهِ يَحْفَظُونَهُ مِنْ أَمْرِ اللَّهِ", translation: "Il a des anges qui se succedent devant et derriere lui et le protegent par l'ordre d'Allah.", link: "https://quran.com/fr/13:11" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Wali est Celui qui gouverne toute chose. L'univers est Son royaume et Sa gestion couvre chaque detail de la creation." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ar-Ra'd 13:11", url: "https://quran.com/fr/13:11" }
    ]
  },
  77: {
    detailedMeaning: "Al-Muta'ali designe Celui qui est exalte au-dessus de toute chose et de tout attribut cree. Sa transcendance est absolue : Il est au-dela de ce que les esprits peuvent concevoir et de ce que les langues peuvent decrire. Rien ne peut L'atteindre ni Le limiter.",
    quranVerses: [
      { surah: "Ar-Ra'd", surahNumber: 13, ayah: 9, arabic: "عَالِمُ الْغَيْبِ وَالشَّهَادَةِ الْكَبِيرُ الْمُتَعَالِ", translation: "Le Connaisseur de l'invisible et du visible, le Tres Grand, le Tres Eleve.", link: "https://quran.com/fr/13:9" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Muta'ali est Celui qui est eleve au-dessus de tout ce que les creatures peuvent Lui attribuer. Sa transcendance est au-dela de toute comprehension." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ar-Ra'd 13:9", url: "https://quran.com/fr/13:9" }
    ]
  },
  78: {
    detailedMeaning: "Al-Barr designe Celui dont la bonte et la bienveillance touchent toute Sa creation. Sa bonté envers Ses serviteurs se manifeste dans chaque bienfait, chaque facilite et chaque grace. Il est bon meme envers ceux qui Lui desobeissent, leur accordant un delai pour se repentir.",
    quranVerses: [
      { surah: "At-Tur", surahNumber: 52, ayah: 28, arabic: "إِنَّا كُنَّا مِن قَبْلُ نَدْعُوهُ إِنَّهُ هُوَ الْبَرُّ الرَّحِيمُ", translation: "Nous L'invoquions auparavant. C'est Lui le Bienfaisant, le Misericordieux.", link: "https://quran.com/fr/52:28" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Barr est Celui dont la bonte est universelle et dont la bienfaisance atteint toutes les creatures, obeissantes ou desobeissantes." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - At-Tur 52:28", url: "https://quran.com/fr/52:28" }
    ]
  },
  79: {
    detailedMeaning: "At-Tawwab designe Celui qui accepte le repentir de Ses serviteurs et revient vers eux avec Sa misericorde. Il facilite le chemin du repentir et inspire a Ses serviteurs le desir de revenir a Lui. La forme fa''al indique qu'Il accepte le repentir de maniere repetee et constante.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 37, arabic: "فَتَلَقَّىٰ آدَمُ مِن رَّبِّهِ كَلِمَاتٍ فَتَابَ عَلَيْهِ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ", translation: "Adam recut de son Seigneur des paroles, et Allah agrea son repentir. Car c'est Lui le Repentant, le Misericordieux.", link: "https://quran.com/fr/2:37" },
      { surah: "An-Nasr", surahNumber: 110, ayah: 3, arabic: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا", translation: "Glorifie ton Seigneur et implore Son pardon. Il est certes Celui qui accepte le repentir.", link: "https://quran.com/fr/110:3" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "At-Tawwab est Celui qui ne cesse d'accepter le repentir de Ses serviteurs, quel que soit le nombre de leurs retours. Il inspire le repentir puis l'accepte." }
    ],
    hadithReferences: [
      { collection: "Sahih Muslim", number: "2747", text: "Allah est plus heureux du repentir de Son serviteur que l'un de vous qui retrouve sa monture egaree dans le desert.", link: "https://sunnah.com/muslim:2747" }
    ],
    sources: [
      { label: "Quran.com - Al-Baqara 2:37", url: "https://quran.com/fr/2:37" },
      { label: "Sunnah.com - Muslim 2747", url: "https://sunnah.com/muslim:2747" }
    ]
  },
  80: {
    detailedMeaning: "Al-Muntaqim designe Celui qui tire vengeance des oppresseurs et des injustes. Sa vengeance n'est pas motivee par la colere aveugle mais par la justice parfaite. Il punit ceux qui persistent dans la transgression apres les avertissements et les delais accordes.",
    quranVerses: [
      { surah: "As-Sajda", surahNumber: 32, ayah: 22, arabic: "إِنَّا مِنَ الْمُجْرِمِينَ مُنتَقِمُونَ", translation: "Nous nous vengerons des criminels.", link: "https://quran.com/fr/32:22" },
      { surah: "Ali 'Imran", surahNumber: 3, ayah: 4, arabic: "وَاللَّهُ عَزِيزٌ ذُو انتِقَامٍ", translation: "Et Allah est Tout Puissant, Detenteur de la vengeance.", link: "https://quran.com/fr/3:4" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Muntaqim ne se venge que de ceux qui le meritent, apres leur avoir accorde des delais et des avertissements. Sa vengeance est justice pure." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - As-Sajda 32:22", url: "https://quran.com/fr/32:22" }
    ]
  },
  81: {
    detailedMeaning: "Al-'Afuw designe Celui qui efface les peches et les fait disparaitre totalement. Plus que le pardon, l'effacement signifie que le peche est supprime du registre comme s'il n'avait jamais existe. Allah aime etre invoque par ce nom, particulierement durant la Nuit du Destin.",
    quranVerses: [
      { surah: "An-Nisa", surahNumber: 4, ayah: 149, arabic: "فَإِنَّ اللَّهَ كَانَ عَفُوًّا قَدِيرًا", translation: "Certes, Allah est Indulgent et Omnipotent.", link: "https://quran.com/fr/4:149" },
      { surah: "Ash-Shura", surahNumber: 42, ayah: 25, arabic: "وَهُوَ الَّذِي يَقْبَلُ التَّوْبَةَ عَنْ عِبَادِهِ وَيَعْفُو عَنِ السَّيِّئَاتِ", translation: "C'est Lui qui accepte le repentir de Ses serviteurs et efface les mauvaises actions.", link: "https://quran.com/fr/42:25" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-'Afuw est Celui qui efface les peches. L'effacement est superieur au pardon, car le pardon peut laisser une trace tandis que l'effacement la supprime entierement." }
    ],
    hadithReferences: [
      { collection: "Tirmidhi", number: "3513", text: "Aisha demanda au Prophete (paix sur lui) : Si je sais quelle nuit est la Nuit du Destin, que dois-je dire ? Il repondit : Dis : Allahumma innaka 'Afuwwun tuhibbu al-'afwa fa'fu 'anni.", link: "https://sunnah.com/tirmidhi:3513" }
    ],
    sources: [
      { label: "Quran.com - An-Nisa 4:149", url: "https://quran.com/fr/4:149" },
      { label: "Sunnah.com - Tirmidhi 3513", url: "https://sunnah.com/tirmidhi:3513" }
    ]
  },
  82: {
    detailedMeaning: "Ar-Ra'uf designe Celui dont la compassion envers Ses serviteurs est immense et profonde. Sa compassion est plus tendre et plus intime que la misericorde generale. Il allege les obligations, facilite les epreuves et enveloppe Ses serviteurs de Sa sollicitude.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 207, arabic: "وَاللَّهُ رَءُوفٌ بِالْعِبَادِ", translation: "Et Allah est Compatissant envers les serviteurs.", link: "https://quran.com/fr/2:207" },
      { surah: "Al-Hajj", surahNumber: 22, ayah: 65, arabic: "إِنَّ اللَّهَ بِالنَّاسِ لَرَءُوفٌ رَّحِيمٌ", translation: "Certes, Allah est plein de Compassion et de Misericorde envers les gens.", link: "https://quran.com/fr/22:65" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Ar-Ra'uf est Celui dont la compassion est la plus tendre. La ra'fa est la fine fleur de la misericorde, son degre le plus delicat et le plus intime." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Baqara 2:207", url: "https://quran.com/fr/2:207" }
    ]
  },
  83: {
    detailedMeaning: "Malik-ul-Mulk designe le Possesseur absolu de toute royaute et de tout pouvoir. Il donne la souverainete a qui Il veut et la retire a qui Il veut. Toute royaute terrestre n'est qu'un pret temporaire de Sa part. Il est le vrai Roi des rois.",
    quranVerses: [
      { surah: "Ali 'Imran", surahNumber: 3, ayah: 26, arabic: "قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَن تَشَاءُ وَتَنزِعُ الْمُلْكَ مِمَّن تَشَاءُ", translation: "Dis : O Allah, Maitre de l'autorite absolue. Tu donnes l'autorite a qui Tu veux et Tu arraches l'autorite a qui Tu veux.", link: "https://quran.com/fr/3:26" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_tafsir", text: "Malik-ul-Mulk signifie que toute royaute et toute souverainete appartiennent a Allah. Les rois de la terre ne sont que des depositaires temporaires de Son pouvoir." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ali 'Imran 3:26", url: "https://quran.com/fr/3:26" }
    ]
  },
  84: {
    detailedMeaning: "Dhul-Jalali wal-Ikram designe Celui qui reunit la majeste supreme et la generosite parfaite. Il est digne d'etre glorifie pour Sa grandeur et remercie pour Sa bonte. Ce nom combine les attributs de jalal (majeste) et ikram (generosite), montrant qu'Allah allie puissance et bienveillance.",
    quranVerses: [
      { surah: "Ar-Rahman", surahNumber: 55, ayah: 27, arabic: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ", translation: "Seule subsistera la Face de ton Seigneur, plein de majeste et de noblesse.", link: "https://quran.com/fr/55:27" },
      { surah: "Ar-Rahman", surahNumber: 55, ayah: 78, arabic: "تَبَارَكَ اسْمُ رَبِّكَ ذِي الْجَلَالِ وَالْإِكْرَامِ", translation: "Beni soit le nom de ton Seigneur, plein de majeste et de noblesse.", link: "https://quran.com/fr/55:78" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Ce nom rassemble deux attributs : la majeste qui inspire la veneration, et la generosite qui inspire la gratitude. Il est digne des deux a la fois." }
    ],
    hadithReferences: [
      { collection: "Tirmidhi", number: "3544", text: "Le Prophete (paix sur lui) a dit : Persistez a dire : Ya Dhal-Jalali wal-Ikram (O Possesseur de la majeste et de la noblesse).", link: "https://sunnah.com/tirmidhi:3544" }
    ],
    sources: [
      { label: "Quran.com - Ar-Rahman 55:27", url: "https://quran.com/fr/55:27" },
      { label: "Sunnah.com - Tirmidhi 3544", url: "https://sunnah.com/tirmidhi:3544" }
    ]
  },
  85: {
    detailedMeaning: "Al-Muqsit designe Celui qui agit avec une equite parfaite et qui etablit la justice. Il ne commet aucune injustice et retribue chaque ame selon ce qu'elle a merite. Sa justice est absolue et s'applique a toute la creation sans favoritisme ni partialite.",
    quranVerses: [
      { surah: "Al-Anbiya", surahNumber: 21, ayah: 47, arabic: "وَنَضَعُ الْمَوَازِينَ الْقِسْطَ لِيَوْمِ الْقِيَامَةِ فَلَا تُظْلَمُ نَفْسٌ شَيْئًا", translation: "Nous placerons les balances de la justice le Jour de la Resurrection. Aucune ame ne sera lesee en rien.", link: "https://quran.com/fr/21:47" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Muqsit est Celui qui juge avec equite. Il recompense l'obeissant et punit le desobeissant, chacun selon ce qu'il merite exactement." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Anbiya 21:47", url: "https://quran.com/fr/21:47" }
    ]
  },
  86: {
    detailedMeaning: "Al-Jami' designe Celui qui rassemblera toute la creation le Jour du Jugement pour le Compte final. Il rassemble aussi les coeurs, les bienfaits, et toutes les qualites de perfection. Rien ne Lui echappe et Il reunira toute chose pour le jugement final.",
    quranVerses: [
      { surah: "Ali 'Imran", surahNumber: 3, ayah: 9, arabic: "رَبَّنَا إِنَّكَ جَامِعُ النَّاسِ لِيَوْمٍ لَّا رَيْبَ فِيهِ", translation: "Seigneur, Tu es Celui qui rassemblera les gens, un jour au sujet duquel il n'y a aucun doute.", link: "https://quran.com/fr/3:9" },
      { surah: "At-Taghabun", surahNumber: 64, ayah: 9, arabic: "يَوْمَ يَجْمَعُكُمْ لِيَوْمِ الْجَمْعِ ذَٰلِكَ يَوْمُ التَّغَابُنِ", translation: "Le jour ou Il vous rassemblera pour le Jour du Rassemblement, ce sera le jour de la revelation des pertes.", link: "https://quran.com/fr/64:9" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Jami' est Celui qui rassemble les creatures le Jour du Jugement et qui reunit les bienfaits pour Ses serviteurs." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ali 'Imran 3:9", url: "https://quran.com/fr/3:9" }
    ]
  },
  87: {
    detailedMeaning: "Al-Ghani designe Celui qui n'a besoin de rien ni de personne, absolument autosuffisant. Sa richesse est inherente a Son essence et ne depend d'aucune creature. Il est riche par Lui-meme tandis que toute la creation est pauvre et dependante de Lui.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 263, arabic: "وَاللَّهُ غَنِيٌّ حَلِيمٌ", translation: "Et Allah est Riche et Clement.", link: "https://quran.com/fr/2:263" },
      { surah: "Fatir", surahNumber: 35, ayah: 15, arabic: "يَا أَيُّهَا النَّاسُ أَنتُمُ الْفُقَرَاءُ إِلَى اللَّهِ وَاللَّهُ هُوَ الْغَنِيُّ الْحَمِيدُ", translation: "O hommes, vous etes les indigents ayant besoin d'Allah, et c'est Allah le Riche, le Digne de louange.", link: "https://quran.com/fr/35:15" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Ghani est Celui qui n'a besoin de rien. Meme si toutes les creatures L'adoraient ou Le reniaient, cela n'ajouterait ni n'enleverait rien a Sa richesse." }
    ],
    hadithReferences: [
      { collection: "Sahih Muslim", number: "2577", text: "Allah dit : O Mes serviteurs, vous ne pourriez jamais Me nuire ni Me profiter. O Mes serviteurs, si les premiers et les derniers parmi vous avaient le coeur le plus pieux, cela n'ajouterait rien a Ma souverainete.", link: "https://sunnah.com/muslim:2577" }
    ],
    sources: [
      { label: "Quran.com - Fatir 35:15", url: "https://quran.com/fr/35:15" },
      { label: "Sunnah.com - Muslim 2577", url: "https://sunnah.com/muslim:2577" }
    ]
  },
  88: {
    detailedMeaning: "Al-Mughni designe Celui qui enrichit Ses serviteurs et les rend autosuffisants. Il accorde la richesse materielle et spirituelle a qui Il veut. Il enrichit les coeurs par la foi et les ames par la contentement. La vraie richesse est celle que confere Allah.",
    quranVerses: [
      { surah: "An-Najm", surahNumber: 53, ayah: 48, arabic: "وَأَنَّهُ هُوَ أَغْنَىٰ وَأَقْنَىٰ", translation: "Et c'est Lui qui enrichit et qui donne satisfaction.", link: "https://quran.com/fr/53:48" },
      { surah: "At-Tawba", surahNumber: 9, ayah: 28, arabic: "وَإِنْ خِفْتُمْ عَيْلَةً فَسَوْفَ يُغْنِيكُمُ اللَّهُ مِن فَضْلِهِ", translation: "Et si vous craignez la pauvrete, Allah vous enrichira de Sa grace.", link: "https://quran.com/fr/9:28" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Mughni est Celui qui accorde la richesse qui rend independant. La vraie richesse n'est pas l'abondance des biens mais la richesse du coeur." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - An-Najm 53:48", url: "https://quran.com/fr/53:48" }
    ]
  },
  89: {
    detailedMeaning: "Al-Mani' designe Celui qui empeche et retient ce qui pourrait nuire a Ses serviteurs. Il protege ceux qu'Il veut et empeche le mal de les atteindre. Il empeche aussi Sa grace d'atteindre ceux qui ne la meritent pas, selon Sa sagesse parfaite.",
    quranVerses: [
      { surah: "An-Nas", surahNumber: 114, ayah: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", translation: "Dis : Je cherche protection aupres du Seigneur des hommes.", link: "https://quran.com/fr/114:1" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Mani' est Celui qui empeche le mal d'atteindre Ses serviteurs et qui retient ce qu'Il veut selon Sa sagesse. Il est le Bouclier des croyants." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - An-Nas 114:1", url: "https://quran.com/fr/114:1" }
    ]
  },
  90: {
    detailedMeaning: "Ad-Darr designe Celui qui decrete l'epreuve et le mal apparent comme test pour Ses serviteurs. Les epreuves sont des moyens de purification et d'elevation spirituelle. Ce nom se comprend en pair avec An-Nafi' : Allah seul detient le pouvoir de nuire et de profiter.",
    quranVerses: [
      { surah: "Al-An'am", surahNumber: 6, ayah: 17, arabic: "وَإِن يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ", translation: "Si Allah te touche d'un mal, nul ne peut l'enlever sauf Lui.", link: "https://quran.com/fr/6:17" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Ad-Darr ne doit pas etre invoque seul mais en pair avec An-Nafi'. L'epreuve d'Allah contient toujours une sagesse cachee et un bien potentiel." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-An'am 6:17", url: "https://quran.com/fr/6:17" }
    ]
  },
  91: {
    detailedMeaning: "An-Nafi' designe Celui qui accorde le bienfait et le profit a Ses creatures. Tout bien qui atteint une creature vient de Lui. Il est la seule source de tout profit veritable, dans ce monde et dans l'au-dela. Lui seul peut accorder le vrai benefice.",
    quranVerses: [
      { surah: "Al-Fath", surahNumber: 48, ayah: 11, arabic: "قُلْ فَمَن يَمْلِكُ لَكُم مِّنَ اللَّهِ شَيْئًا إِنْ أَرَادَ بِكُمْ ضَرًّا أَوْ أَرَادَ بِكُمْ نَفْعًا", translation: "Dis : Qui donc peut quoi que ce soit pour vous contre Allah, s'Il vous veut du mal ou s'Il vous veut du bien ?", link: "https://quran.com/fr/48:11" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "An-Nafi' est Celui de qui vient tout profit. Les creatures ne peuvent ni profiter ni nuire par elles-memes : tout cela est entre les mains d'Allah." }
    ],
    hadithReferences: [
      { collection: "Tirmidhi", number: "2516", text: "Le Prophete (paix sur lui) a dit a Ibn Abbas : Sache que si la communaute entiere se reunissait pour te profiter, ils ne pourraient te profiter que par ce qu'Allah a ecrit pour toi.", link: "https://sunnah.com/tirmidhi:2516" }
    ],
    sources: [
      { label: "Quran.com - Al-Fath 48:11", url: "https://quran.com/fr/48:11" },
      { label: "Sunnah.com - Tirmidhi 2516", url: "https://sunnah.com/tirmidhi:2516" }
    ]
  },
  92: {
    detailedMeaning: "An-Nur designe la Lumiere des cieux et de la terre. Allah est la source de toute lumiere, physique et spirituelle. Il guide les coeurs par la lumiere de la foi et illumine l'univers par Sa lumiere. Sans Sa lumiere, tout serait dans les tenebres.",
    quranVerses: [
      { surah: "An-Nur", surahNumber: 24, ayah: 35, arabic: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", translation: "Allah est la Lumiere des cieux et de la terre.", link: "https://quran.com/fr/24:35" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_tafsir", text: "An-Nur signifie que par Sa lumiere, les cieux et la terre sont illumines. Il guide les habitants des cieux et de la terre par Sa lumiere." },
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "An-Nur est Celui par qui tout est eclaire et manifeste. Il est la Lumiere en Soi, et toute lumiere dans l'univers n'est qu'un reflet de Sa lumiere." }
    ],
    hadithReferences: [
      { collection: "Sahih Muslim", number: "179", text: "Le Prophete (paix sur lui) a dit : Son voile est la lumiere. S'Il le levait, les lumieres de Son visage bruleraient tout ce que Son regard atteindrait.", link: "https://sunnah.com/muslim:179" }
    ],
    sources: [
      { label: "Quran.com - An-Nur 24:35", url: "https://quran.com/fr/24:35" },
      { label: "Sunnah.com - Muslim 179", url: "https://sunnah.com/muslim:179" }
    ]
  },
  93: {
    detailedMeaning: "Al-Hadi designe Celui qui guide Ses serviteurs vers le droit chemin et les conduit vers la verite. Il guide par Sa revelation, par Ses signes dans la creation et par l'inspiration qu'Il met dans les coeurs. La guidance est un don precieux d'Allah qu'Il accorde a qui Il veut.",
    quranVerses: [
      { surah: "Al-Hajj", surahNumber: 22, ayah: 54, arabic: "وَإِنَّ اللَّهَ لَهَادِ الَّذِينَ آمَنُوا إِلَىٰ صِرَاطٍ مُّسْتَقِيمٍ", translation: "Et certes, Allah guide ceux qui croient vers un droit chemin.", link: "https://quran.com/fr/22:54" },
      { surah: "Al-Furqan", surahNumber: 25, ayah: 31, arabic: "وَكَفَىٰ بِرَبِّكَ هَادِيًا وَنَصِيرًا", translation: "Et ton Seigneur suffit comme Guide et Secoureur.", link: "https://quran.com/fr/25:31" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Hadi est Celui qui guide Ses creatures vers ce qui leur est profitable dans leur religion et leur vie. La guidance supreme est celle de la foi." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Hajj 22:54", url: "https://quran.com/fr/22:54" }
    ]
  },
  94: {
    detailedMeaning: "Al-Badi' designe Celui qui a cree les cieux et la terre de maniere inedite, sans modele prealable et sans precedent. Sa creation est originale et unique, temoignant d'une creativite et d'une puissance infinies. Il est l'Inventeur de toute chose nouvelle.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 117, arabic: "بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ وَإِذَا قَضَىٰ أَمْرًا فَإِنَّمَا يَقُولُ لَهُ كُن فَيَكُونُ", translation: "Createur des cieux et de la terre. Lorsqu'Il decide une chose, Il dit seulement : Sois ! Et elle est.", link: "https://quran.com/fr/2:117" },
      { surah: "Al-An'am", surahNumber: 6, ayah: 101, arabic: "بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ", translation: "Createur originel des cieux et de la terre.", link: "https://quran.com/fr/6:101" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Badi' est Celui qui a invente les choses de maniere inedite, sans modele precedent. Sa creation est unique et incomparable." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Baqara 2:117", url: "https://quran.com/fr/2:117" }
    ]
  },
  95: {
    detailedMeaning: "Al-Baqi designe Celui qui demeure eternellement, apres la disparition de toute chose. Tandis que toute la creation est perissable, Allah seul est eternel et permanent. Sa permanence est absolue et inalterable, ne connaissant ni changement ni fin.",
    quranVerses: [
      { surah: "Ar-Rahman", surahNumber: 55, ayah: 27, arabic: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ", translation: "Seule subsistera la Face de ton Seigneur, plein de majeste et de noblesse.", link: "https://quran.com/fr/55:27" },
      { surah: "Al-Qasas", surahNumber: 28, ayah: 88, arabic: "كُلُّ شَيْءٍ هَالِكٌ إِلَّا وَجْهَهُ", translation: "Toute chose perira sauf Sa Face.", link: "https://quran.com/fr/28:88" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Al-Baqi est Celui dont l'existence est permanente et eternelle. Il demeure apres l'aneantissement de toute chose creee." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Ar-Rahman 55:27", url: "https://quran.com/fr/55:27" }
    ]
  },
  96: {
    detailedMeaning: "Al-Warith designe Celui qui herite de tout apres la fin de toute la creation. Quand tous les etres auront peri, Allah seul demeurera, heritant de toute chose. Ce nom affirme Sa permanence absolue et la nature temporaire de toute la creation.",
    quranVerses: [
      { surah: "Al-Hijr", surahNumber: 15, ayah: 23, arabic: "وَإِنَّا لَنَحْنُ نُحْيِي وَنُمِيتُ وَنَحْنُ الْوَارِثُونَ", translation: "Et c'est Nous qui donnons la vie et qui donnons la mort, et c'est Nous les Heritiers.", link: "https://quran.com/fr/15:23" },
      { surah: "Maryam", surahNumber: 19, ayah: 40, arabic: "إِنَّا نَحْنُ نَرِثُ الْأَرْضَ وَمَنْ عَلَيْهَا وَإِلَيْنَا يُرْجَعُونَ", translation: "C'est Nous qui heriterons de la terre et de ceux qui s'y trouvent. Et c'est vers Nous qu'ils seront ramenes.", link: "https://quran.com/fr/19:40" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Al-Warith est Celui qui demeure apres la fin de toute chose. Il herite de la terre et de ce qui s'y trouve quand toute creature aura peri." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Al-Hijr 15:23", url: "https://quran.com/fr/15:23" }
    ]
  },
  97: {
    detailedMeaning: "Ar-Rashid designe Celui qui dirige toute chose vers sa finalite avec une sagesse parfaite. Il guide Ses creatures vers ce qui est juste et bon, et Ses decrets menent toujours au resultat le plus sage. Sa direction est infaillible et ne connait ni erreur ni egarement.",
    quranVerses: [
      { surah: "Hud", surahNumber: 11, ayah: 87, arabic: "أَصَلَاتُكَ تَأْمُرُكَ أَن نَّتْرُكَ مَا يَعْبُدُ آبَاؤُنَا", translation: "Est-ce que ta priere te commande de nous faire abandonner ce qu'adoraient nos ancetres ?", link: "https://quran.com/fr/11:87" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Ar-Rashid est Celui qui dirige toute chose vers sa fin avec sagesse et bon ordre. Ses decisions menent toujours au meilleur resultat." }
    ],
    hadithReferences: [],
    sources: [
      { label: "Quran.com - Hud 11:87", url: "https://quran.com/fr/11:87" }
    ]
  },
  98: {
    detailedMeaning: "As-Sabur designe Celui dont la patience est sans limite et qui ne precipite pas le chatiment. Malgre la desobeissance de Ses creatures, Il leur accorde des delais pour se repentir. Sa patience n'est pas faiblesse mais puissance maitrisee et sagesse parfaite.",
    quranVerses: [
      { surah: "Al-Baqara", surahNumber: 2, ayah: 153, arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", translation: "O les croyants ! Cherchez secours dans la patience et la priere. Certes, Allah est avec les patients.", link: "https://quran.com/fr/2:153" }
    ],
    scholarComments: [
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "As-Sabur est Celui qui ne Se hate pas de punir les desobeissants. Il leur donne un delai avec patience, non par impuissance mais par sagesse et misericorde." },
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "As-Sabur est Celui qui ne precipite rien avant son temps. Il voit la desobeissance mais accorde un sursis, espérant le repentir de Ses serviteurs." }
    ],
    hadithReferences: [
      { collection: "Sahih Bukhari", number: "6099", text: "Le Prophete (paix sur lui) a dit : Personne n'est plus patient face a une parole blessante qu'Allah. On Lui attribue un fils et Il continue a leur accorder la sante et la subsistance.", link: "https://sunnah.com/bukhari:6099" }
    ],
    sources: [
      { label: "Quran.com - Al-Baqara 2:153", url: "https://quran.com/fr/2:153" },
      { label: "Sunnah.com - Bukhari 6099", url: "https://sunnah.com/bukhari:6099" }
    ]
  },
  99: {
    detailedMeaning: "Allah est le nom supreme qui englobe tous les attributs de perfection divine. C'est le nom propre de Dieu en islam, dont tous les autres noms sont des attributs. Il est le nom le plus majestueux, le plus complet et le plus englobant. Tous les autres noms Lui sont subordonnes.",
    quranVerses: [
      { surah: "Al-Ikhlas", surahNumber: 112, ayah: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Dis : Il est Allah, Unique.", link: "https://quran.com/fr/112:1" },
      { surah: "Al-Hashr", surahNumber: 59, ayah: 22, arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ هُوَ الرَّحْمَٰنُ الرَّحِيمُ", translation: "C'est Lui Allah. Nulle divinite a part Lui, le Connaisseur de l'invisible et du visible. C'est Lui le Tout Misericordieux, le Tres Misericordieux.", link: "https://quran.com/fr/59:22" },
      { surah: "Ta-Ha", surahNumber: 20, ayah: 14, arabic: "إِنَّنِي أَنَا اللَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدْنِي", translation: "C'est Moi Allah. Point de divinite que Moi. Adore-Moi donc.", link: "https://quran.com/fr/20:14" }
    ],
    scholarComments: [
      { scholar: "Al-Qurtubi", sourceKey: "qurtubi_asna", text: "Le nom Allah est le plus grand de tous les noms divins. Il contient en lui tous les attributs de perfection et de majeste. Tous les autres noms Lui sont subordonnes." },
      { scholar: "Al-Ghazali", sourceKey: "ghazali_maqsad", text: "Allah est le nom qui designe l'Etre necessaire, doue de tous les attributs de perfection. C'est le nom le plus complet car il englobe tous les autres." },
      { scholar: "Ibn al-Qayyim", sourceKey: "ibn_qayyim", text: "Le nom Allah est le fondement de tous les beaux noms. Tous les autres noms sont des attributs de Celui qui se nomme Allah." }
    ],
    hadithReferences: [
      { collection: "Sahih Bukhari", number: "2736", text: "Le Prophete (paix sur lui) a dit : Allah a quatre-vingt-dix-neuf noms, cent moins un. Quiconque les memorise entrera au Paradis.", link: "https://sunnah.com/bukhari:2736" },
      { collection: "Sahih Muslim", number: "2677", text: "Le Prophete (paix sur lui) a dit : Allah a quatre-vingt-dix-neuf noms. Quiconque les enumere (ahsaha) entrera au Paradis.", link: "https://sunnah.com/muslim:2677" }
    ],
    sources: [
      { label: "Quran.com - Al-Ikhlas 112:1", url: "https://quran.com/fr/112:1" },
      { label: "Quran.com - Al-Hashr 59:22", url: "https://quran.com/fr/59:22" },
      { label: "Sunnah.com - Bukhari 2736", url: "https://sunnah.com/bukhari:2736" }
    ]
  }
};

// Enrichir ASMA_UL_HUSNA avec les donnees encyclopediques
(function enrichEncyclopedia() {
  ASMA_UL_HUSNA.forEach(function(name) {
    if (ENCYCLOPEDIA_DATA[name.id]) {
      name.encyclopedia = ENCYCLOPEDIA_DATA[name.id];
    }
  });
})();