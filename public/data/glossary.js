/**
 * Al-Asmaa — Lexique interactif
 * Dictionnaire de termes techniques (linguistique arabe, theologie, morphologie)
 * Utilise par le module Glossary pour surligner et definir les termes dans l'encyclopedie.
 */

const GLOSSARY_DATA = [
  // ========================
  // MORPHOLOGIE
  // ========================
  {
    term: "fa'lan",
    aliases: ["fa\u2019lan", "fa\u2018lan", "fa`lan", "fa\u2019l\u0101n", "fa\u2018l\u0101n"],
    category: "morphologie",
    definition: "Schema morphologique arabe exprimant l\u2019intensite maximale d\u2019un attribut. Forme hyperbolique indiquant que la qualite atteint son degre le plus eleve, comme dans Ar-Rahman (le Tout-Misericordieux)."
  },
  {
    term: "fa'il",
    aliases: ["fa\u2019il", "fa\u2018il", "fa`il", "fa\u2019\u012Bl", "fa\u2018\u012Bl"],
    category: "morphologie",
    definition: "Schema morphologique arabe indiquant une qualite permanente et constante. Designe un attribut intrinseque et durable, comme dans Ar-Rahim (le Tres-Misericordieux)."
  },
  {
    term: "fu''us",
    aliases: ["fu\u2019\u2019us", "fu\u2018\u2018us", "fu``us", "fu\u2019\u2019\u016Bs", "fu\u2018\u2018\u016Bs"],
    category: "morphologie",
    definition: "Schema de pluriel intensif en arabe, exprimant la plenitude et l\u2019intensite d\u2019une qualite. Utilise pour des noms comme Al-Quddus (le Tres-Saint)."
  },
  {
    term: "fa''al",
    aliases: ["fa\u2019\u2019al", "fa\u2018\u2018al", "fa``al", "fa\u2019\u2019\u0101l", "fa\u2018\u2018\u0101l"],
    category: "morphologie",
    definition: "Schema d\u2019intensite et de repetition en arabe, indiquant une action constante et abondante. Utilise pour des noms comme Al-Ghaffar (le Tres-Pardonnant) ou Al-Wahhab (le Donateur)."
  },
  {
    term: "fa'ul",
    aliases: ["fa\u2019ul", "fa\u2018ul", "fa`ul", "fa\u2019\u016Bl", "fa\u2018\u016Bl"],
    category: "morphologie",
    definition: "Schema morphologique arabe exprimant l\u2019abondance et la plenitude d\u2019une qualite. Indique que l\u2019agent effectue l\u2019action de maniere profuse, comme dans Al-Ghafur (le Tout-Pardonnant)."
  },
  {
    term: "mu'fil",
    aliases: ["mu\u2019fil", "mu\u2018fil", "mu`fil"],
    category: "morphologie",
    definition: "Schema du participe actif de la forme IV (causative) en arabe. Designe celui qui cause ou produit une action, comme Al-Mu\u2019min (Celui qui accorde la securite)."
  },
  {
    term: "mufa''il",
    aliases: ["mufa\u2019\u2019il", "mufa\u2018\u2018il", "mufa``il"],
    category: "morphologie",
    definition: "Schema du participe actif de la forme II (intensive/causative) en arabe. Indique celui qui accomplit une action de maniere intensive, comme Al-Musawwir (le Formateur)."
  },
  {
    term: "mutafa''il",
    aliases: ["mutafa\u2019\u2019il", "mutafa\u2018\u2018il", "mutafa``il", "mutaf\u0101\u2019il"],
    category: "morphologie",
    definition: "Schema du participe actif de la forme V ou VI en arabe, exprimant la grandeur intrinseque. Utilise pour Al-Mutakabbir (Celui qui possede la grandeur supreme)."
  },
  {
    term: "participe actif",
    aliases: [],
    category: "morphologie",
    definition: "Forme verbale arabe (ism al-fa\u2019il) designant celui qui accomplit l\u2019action. Equivalent du \u00ab\u2009sujet agissant\u2009\u00bb, comme dans f\u0101\u2019il (celui qui fait). Tres frequent dans les Noms divins."
  },
  {
    term: "nom d'action",
    aliases: ["nom d\u2019action", "nom d\u2018action"],
    category: "morphologie",
    definition: "Forme nominale arabe (masdar) exprimant l\u2019action pure, sans reference au temps ni a l\u2019agent. Designe le concept abstrait de l\u2019acte, comme As-Salam (la Paix) ou Al-Haqq (la Verite)."
  },
  {
    term: "adjectif superlatif",
    aliases: [],
    category: "morphologie",
    definition: "Forme af\u2019al en arabe, exprimant le degre supreme d\u2019une qualite. Indique que l\u2019attribut depasse toute comparaison, comme Al-Awwal (le Premier absolu)."
  },
  {
    term: "forme intensive",
    aliases: [],
    category: "morphologie",
    definition: "Categorie de schemas morphologiques arabes (fa\u2019\u2019al, fa\u2019\u016Bl, etc.) exprimant l\u2019intensite, la repetition ou l\u2019abondance de l\u2019action. Indique que la qualite est portee a son maximum."
  },
  {
    term: "forme causative",
    aliases: ["forme causative (IV)"],
    category: "morphologie",
    definition: "Quatrieme forme verbale arabe (if\u2019al), indiquant que le sujet cause ou provoque l\u2019action. Le prefixe \u00ab\u2009mu-\u2009\u00bb dans le participe actif signale cette forme, comme Al-Mu\u2019izz (Celui qui accorde la puissance)."
  },

  // ========================
  // GRAMMAIRE
  // ========================
  {
    term: "racine",
    aliases: [],
    category: "grammaire",
    definition: "Ensemble de consonnes (generalement trois) formant la base semantique d\u2019un mot arabe. Tous les mots derives d\u2019une meme racine partagent un champ de sens commun. Ex : r-h-m donne rahma (misericorde), Rahman, Rahim."
  },
  {
    term: "schema morphologique",
    aliases: ["sch\u00e9ma morphologique"],
    category: "grammaire",
    definition: "Patron vocalique applique a une racine consonantique arabe pour former un mot avec un sens specifique. Le systeme des schemas (awzan) est le mecanisme central de la derivation en arabe. Ex : fa\u2019lan, fa\u2019il, fa\u2019\u2019al."
  },

  // ========================
  // THEOLOGIE
  // ========================
  {
    term: "madhab",
    aliases: ["madhhab", "madh-hab"],
    category: "theologie",
    definition: "Ecole juridique islamique suivant une methodologie specifique d\u2019interpretation des sources. Les quatre principales sont : hanafite, malikite, chafiite et hanbalite."
  },
  {
    term: "Sunna",
    aliases: ["sunna", "sunnah"],
    category: "theologie",
    definition: "Tradition prophetique : ensemble des paroles, actes et approbations du Prophete Muhammad (paix sur lui). Deuxieme source du droit islamique apres le Coran."
  },
  {
    term: "hadith",
    aliases: ["Hadith", "ahadith"],
    category: "theologie",
    definition: "Recit transmis rapportant une parole, un acte ou une approbation du Prophete (paix sur lui). Chaque hadith comprend une chaine de transmission (isnad) et un contenu (matn)."
  },
  {
    term: "sahih",
    aliases: ["Sahih"],
    category: "theologie",
    definition: "Qualification d\u2019un hadith dont la chaine de transmission est ininterrompue, les rapporteurs fiables et le contenu exempt de defaut. Grade le plus eleve d\u2019authentification."
  },
  {
    term: "tafsir",
    aliases: ["Tafsir", "tafs\u012Br"],
    category: "theologie",
    definition: "Exegese et commentaire du Coran. Science islamique consacree a l\u2019explication des versets coraniques, mobilisant la langue arabe, les hadiths et le contexte de revelation."
  },
  {
    term: "ruku'",
    aliases: ["ruku\u2019", "ruku\u2018", "rouku", "ruku"],
    category: "theologie",
    definition: "Inclinaison rituelle dans la priere islamique, ou le fidele se penche en posant les mains sur les genoux. Symbolise l\u2019humilite devant Allah."
  },
  {
    term: "sujud",
    aliases: ["soujoud", "sujoud"],
    category: "theologie",
    definition: "Prosternation rituelle dans la priere, front et nez poses au sol. Position la plus proche d\u2019Allah selon le hadith, moment privilegie pour l\u2019invocation."
  },
  {
    term: "du'a",
    aliases: ["du\u2019a", "du\u2018a", "dou\u2019a", "doua", "du\u2019\u0101\u2019"],
    category: "theologie",
    definition: "Invocation personnelle adressee a Allah, distincte de la priere rituelle. Le croyant peut invoquer Allah en tout temps et en toute langue pour demander Son aide."
  },
  {
    term: "dhikr",
    aliases: ["zikr", "dikr"],
    category: "theologie",
    definition: "Rappel et mention d\u2019Allah par des formules specifiques (tasbih, tahmid, takbir, etc.). Pratique spirituelle centrale en Islam visant a maintenir la conscience de Dieu."
  },
  {
    term: "tawba",
    aliases: ["tawbah", "tawb\u0101"],
    category: "theologie",
    definition: "Repentir sincere devant Allah, impliquant le regret, l\u2019abandon du peche et la resolution de ne pas y revenir. Allah est At-Tawwab, Celui qui accepte constamment le repentir."
  },

  // ========================
  // CONCEPTS
  // ========================
  {
    term: "amr",
    aliases: [],
    category: "concept",
    definition: "Commandement ou ordre divin. Designe aussi bien les decrets d\u2019Allah que Ses prescriptions legislatives. Concept central dans la theologie islamique (al-amr bi-l-ma\u2019ruf)."
  },
  {
    term: "nahy",
    aliases: ["nahi"],
    category: "concept",
    definition: "Interdiction divine. Pendant de l\u2019amr (commandement), designe ce qu\u2019Allah a prohibe. Les savants classifient les actes entre amr (injonctions) et nahy (interdictions)."
  },
  {
    term: "mulk",
    aliases: ["moulk"],
    category: "concept",
    definition: "Royaute, souverainete et possession absolue. Designe le domaine de pouvoir d\u2019Allah sur toute la creation. Present dans le Nom divin Malik al-Mulk (Possesseur du Royaume)."
  },
  {
    term: "jalal",
    aliases: ["jal\u0101l", "djal\u0101l"],
    category: "concept",
    definition: "Majeste divine, grandeur et splendeur absolues. Les attributs de jalal expriment la puissance, la grandeur et la transcendance d\u2019Allah. Present dans Dhu-l-Jalal (Possesseur de la Majeste)."
  },
  {
    term: "ikram",
    aliases: ["ikr\u0101m"],
    category: "concept",
    definition: "Generosite et honneur divins. Attribut par lequel Allah honore et gratifie Ses creatures. Associe a jalal dans le Nom divin Dhu-l-Jalali wa-l-Ikram."
  },
  {
    term: "hilm",
    aliases: [],
    category: "concept",
    definition: "Patience, mansuetude et retenue dans l\u2019exercice de la puissance. Qualite divine par laquelle Allah ne precipite pas le chatiment malgre les desobeissances. Racine du Nom Al-Halim."
  },
  {
    term: "hikma",
    aliases: ["hikmah"],
    category: "concept",
    definition: "Sagesse divine. Capacite de placer chaque chose a sa juste place. Allah agit toujours avec hikma, et rien dans Sa creation n\u2019est depourvu de sagesse. Racine du Nom Al-Hakim."
  },
  {
    term: "hukm",
    aliases: [],
    category: "concept",
    definition: "Jugement et gouvernance. Designe a la fois le pouvoir legislatif divin et l\u2019arbitrage entre les creatures. Allah est Al-Hakam (le Juge) qui tranche avec justice."
  },
  {
    term: "rizq",
    aliases: [],
    category: "concept",
    definition: "Subsistance et provision accordees par Allah a chaque creature. Englobe la nourriture, les biens, la sante et meme les bienfaits spirituels. Allah est Ar-Razzaq, le Pourvoyeur absolu."
  },
  {
    term: "rahma",
    aliases: ["rahmah"],
    category: "concept",
    definition: "Misericorde divine, concept fondamental en Islam. Englobe la bonte, la compassion et la clemence d\u2019Allah. Racine r-h-m partagee par Ar-Rahman et Ar-Rahim."
  }
];
