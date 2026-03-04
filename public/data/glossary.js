/**
 * Al-Asmaa — Lexique interactif
 * Dictionnaire de termes techniques (linguistique arabe, théologie, morphologie)
 * Utilisé par le module Glossary pour surligner et définir les termes dans l'encyclopédie.
 */

const GLOSSARY_DATA = [
  // ========================
  // MORPHOLOGIE
  // ========================
  {
    term: "fa'lan",
    aliases: ["fa\u2019lan", "fa\u2018lan", "fa`lan", "fa\u2019l\u0101n", "fa\u2018l\u0101n"],
    category: "morphologie",
    definition: "Schéma morphologique arabe exprimant l\u2019intensité maximale d\u2019un attribut. Forme hyperbolique indiquant que la qualité atteint son degré le plus élevé, comme dans Ar-Rahman (le Tout-Miséricordieux)."
  },
  {
    term: "fa'il",
    aliases: ["fa\u2019il", "fa\u2018il", "fa`il", "fa\u2019\u012Bl", "fa\u2018\u012Bl"],
    category: "morphologie",
    definition: "Schéma morphologique arabe indiquant une qualité permanente et constante. Désigne un attribut intrinsèque et durable, comme dans Ar-Rahim (le Très-Miséricordieux)."
  },
  {
    term: "fu''us",
    aliases: ["fu\u2019\u2019us", "fu\u2018\u2018us", "fu``us", "fu\u2019\u2019\u016Bs", "fu\u2018\u2018\u016Bs"],
    category: "morphologie",
    definition: "Schéma de pluriel intensif en arabe, exprimant la plénitude et l\u2019intensité d\u2019une qualité. Utilisé pour des noms comme Al-Quddus (le Très-Saint)."
  },
  {
    term: "fa''al",
    aliases: ["fa\u2019\u2019al", "fa\u2018\u2018al", "fa``al", "fa\u2019\u2019\u0101l", "fa\u2018\u2018\u0101l"],
    category: "morphologie",
    definition: "Schéma d\u2019intensité et de répétition en arabe, indiquant une action constante et abondante. Utilisé pour des noms comme Al-Ghaffar (le Très-Pardonnant) ou Al-Wahhab (le Donateur)."
  },
  {
    term: "fa'ul",
    aliases: ["fa\u2019ul", "fa\u2018ul", "fa`ul", "fa\u2019\u016Bl", "fa\u2018\u016Bl"],
    category: "morphologie",
    definition: "Schéma morphologique arabe exprimant l\u2019abondance et la plénitude d\u2019une qualité. Indique que l\u2019agent effectue l\u2019action de manière profuse, comme dans Al-Ghafur (le Tout-Pardonnant)."
  },
  {
    term: "mu'fil",
    aliases: ["mu\u2019fil", "mu\u2018fil", "mu`fil"],
    category: "morphologie",
    definition: "Schéma du participe actif de la forme IV (causative) en arabe. Désigne celui qui cause ou produit une action, comme Al-Mu\u2019min (Celui qui accorde la sécurité)."
  },
  {
    term: "mufa''il",
    aliases: ["mufa\u2019\u2019il", "mufa\u2018\u2018il", "mufa``il"],
    category: "morphologie",
    definition: "Schéma du participe actif de la forme II (intensive/causative) en arabe. Indique celui qui accomplit une action de manière intensive, comme Al-Musawwir (le Formateur)."
  },
  {
    term: "mutafa''il",
    aliases: ["mutafa\u2019\u2019il", "mutafa\u2018\u2018il", "mutafa``il", "mutaf\u0101\u2019il"],
    category: "morphologie",
    definition: "Schéma du participe actif de la forme V ou VI en arabe, exprimant la grandeur intrinsèque. Utilisé pour Al-Mutakabbir (Celui qui possède la grandeur suprême)."
  },
  {
    term: "participe actif",
    aliases: [],
    category: "morphologie",
    definition: "Forme verbale arabe (ism al-fa\u2019il) désignant celui qui accomplit l\u2019action. Équivalent du \u00ab\u2009sujet agissant\u2009\u00bb, comme dans f\u0101\u2019il (celui qui fait). Très fréquent dans les Noms divins."
  },
  {
    term: "nom d'action",
    aliases: ["nom d\u2019action", "nom d\u2018action"],
    category: "morphologie",
    definition: "Forme nominale arabe (masdar) exprimant l\u2019action pure, sans référence au temps ni à l\u2019agent. Désigne le concept abstrait de l\u2019acte, comme As-Salam (la Paix) ou Al-Haqq (la Vérité)."
  },
  {
    term: "adjectif superlatif",
    aliases: [],
    category: "morphologie",
    definition: "Forme af\u2019al en arabe, exprimant le degré suprême d\u2019une qualité. Indique que l\u2019attribut dépasse toute comparaison, comme Al-Awwal (le Premier absolu)."
  },
  {
    term: "forme intensive",
    aliases: [],
    category: "morphologie",
    definition: "Catégorie de schémas morphologiques arabes (fa\u2019\u2019al, fa\u2019\u016Bl, etc.) exprimant l\u2019intensité, la répétition ou l\u2019abondance de l\u2019action. Indique que la qualité est portée à son maximum."
  },
  {
    term: "forme causative",
    aliases: ["forme causative (IV)"],
    category: "morphologie",
    definition: "Quatrième forme verbale arabe (if\u2019al), indiquant que le sujet cause ou provoque l\u2019action. Le préfixe \u00ab\u2009mu-\u2009\u00bb dans le participe actif signale cette forme, comme Al-Mu\u2019izz (Celui qui accorde la puissance)."
  },

  // ========================
  // GRAMMAIRE
  // ========================
  {
    term: "racine",
    aliases: [],
    category: "grammaire",
    definition: "Ensemble de consonnes (généralement trois) formant la base sémantique d\u2019un mot arabe. Tous les mots dérivés d\u2019une même racine partagent un champ de sens commun. Ex : r-h-m donne rahma (miséricorde), Rahman, Rahim."
  },
  {
    term: "schéma morphologique",
    aliases: ["sch\u00e9ma morphologique"],
    category: "grammaire",
    definition: "Patron vocalique appliqué à une racine consonantique arabe pour former un mot avec un sens spécifique. Le système des schémas (awzan) est le mécanisme central de la dérivation en arabe. Ex : fa\u2019lan, fa\u2019il, fa\u2019\u2019al."
  },

  // ========================
  // THÉOLOGIE
  // ========================
  {
    term: "madhab",
    aliases: ["madhhab", "madh-hab"],
    category: "théologie",
    definition: "École juridique islamique suivant une méthodologie spécifique d\u2019interprétation des sources. Les quatre principales sont : hanafite, malikite, chafiite et hanbalite."
  },
  {
    term: "Sunna",
    aliases: ["sunna", "sunnah"],
    category: "théologie",
    definition: "Tradition prophétique : ensemble des paroles, actes et approbations du Prophète Muhammad (paix sur lui). Deuxième source du droit islamique après le Coran."
  },
  {
    term: "hadith",
    aliases: ["Hadith", "ahadith"],
    category: "théologie",
    definition: "Récit transmis rapportant une parole, un acte ou une approbation du Prophète (paix sur lui). Chaque hadith comprend une chaîne de transmission (isnad) et un contenu (matn)."
  },
  {
    term: "sahih",
    aliases: ["Sahih"],
    category: "théologie",
    definition: "Qualification d\u2019un hadith dont la chaîne de transmission est ininterrompue, les rapporteurs fiables et le contenu exempt de défaut. Grade le plus élevé d\u2019authentification."
  },
  {
    term: "tafsir",
    aliases: ["Tafsir", "tafs\u012Br"],
    category: "théologie",
    definition: "Exégèse et commentaire du Coran. Science islamique consacrée à l\u2019explication des versets coraniques, mobilisant la langue arabe, les hadiths et le contexte de révélation."
  },
  {
    term: "ruku'",
    aliases: ["ruku\u2019", "ruku\u2018", "rouku", "ruku"],
    category: "théologie",
    definition: "Inclinaison rituelle dans la prière islamique, où le fidèle se penche en posant les mains sur les genoux. Symbolise l\u2019humilité devant Allah."
  },
  {
    term: "sujud",
    aliases: ["soujoud", "sujoud"],
    category: "théologie",
    definition: "Prosternation rituelle dans la prière, front et nez posés au sol. Position la plus proche d\u2019Allah selon le hadith, moment privilégié pour l\u2019invocation."
  },
  {
    term: "du'a",
    aliases: ["du\u2019a", "du\u2018a", "dou\u2019a", "doua", "du\u2019\u0101\u2019"],
    category: "théologie",
    definition: "Invocation personnelle adressée à Allah, distincte de la prière rituelle. Le croyant peut invoquer Allah en tout temps et en toute langue pour demander Son aide."
  },
  {
    term: "dhikr",
    aliases: ["zikr", "dikr"],
    category: "théologie",
    definition: "Rappel et mention d\u2019Allah par des formules spécifiques (tasbih, tahmid, takbir, etc.). Pratique spirituelle centrale en Islam visant à maintenir la conscience de Dieu."
  },
  {
    term: "tawba",
    aliases: ["tawbah", "tawb\u0101"],
    category: "théologie",
    definition: "Repentir sincère devant Allah, impliquant le regret, l\u2019abandon du péché et la résolution de ne pas y revenir. Allah est At-Tawwab, Celui qui accepte constamment le repentir."
  },

  // ========================
  // CONCEPTS
  // ========================
  {
    term: "amr",
    aliases: [],
    category: "concept",
    definition: "Commandement ou ordre divin. Désigne aussi bien les décrets d\u2019Allah que Ses prescriptions législatives. Concept central dans la théologie islamique (al-amr bi-l-ma\u2019ruf)."
  },
  {
    term: "nahy",
    aliases: ["nahi"],
    category: "concept",
    definition: "Interdiction divine. Pendant de l\u2019amr (commandement), désigne ce qu\u2019Allah a prohibé. Les savants classifient les actes entre amr (injonctions) et nahy (interdictions)."
  },
  {
    term: "mulk",
    aliases: ["moulk"],
    category: "concept",
    definition: "Royauté, souveraineté et possession absolue. Désigne le domaine de pouvoir d\u2019Allah sur toute la création. Présent dans le Nom divin Malik al-Mulk (Possesseur du Royaume)."
  },
  {
    term: "jalal",
    aliases: ["jal\u0101l", "djal\u0101l"],
    category: "concept",
    definition: "Majesté divine, grandeur et splendeur absolues. Les attributs de jalal expriment la puissance, la grandeur et la transcendance d\u2019Allah. Présent dans Dhu-l-Jalal (Possesseur de la Majesté)."
  },
  {
    term: "ikram",
    aliases: ["ikr\u0101m"],
    category: "concept",
    definition: "Générosité et honneur divins. Attribut par lequel Allah honore et gratifie Ses créatures. Associé à jalal dans le Nom divin Dhu-l-Jalali wa-l-Ikram."
  },
  {
    term: "hilm",
    aliases: [],
    category: "concept",
    definition: "Patience, mansuétude et retenue dans l\u2019exercice de la puissance. Qualité divine par laquelle Allah ne précipite pas le châtiment malgré les désobéissances. Racine du Nom Al-Halim."
  },
  {
    term: "hikma",
    aliases: ["hikmah"],
    category: "concept",
    definition: "Sagesse divine. Capacité de placer chaque chose à sa juste place. Allah agit toujours avec hikma, et rien dans Sa création n\u2019est dépourvu de sagesse. Racine du Nom Al-Hakim."
  },
  {
    term: "hukm",
    aliases: [],
    category: "concept",
    definition: "Jugement et gouvernance. Désigne à la fois le pouvoir législatif divin et l\u2019arbitrage entre les créatures. Allah est Al-Hakam (le Juge) qui tranche avec justice."
  },
  {
    term: "rizq",
    aliases: [],
    category: "concept",
    definition: "Subsistance et provision accordées par Allah à chaque créature. Englobe la nourriture, les biens, la santé et même les bienfaits spirituels. Allah est Ar-Razzaq, le Pourvoyeur absolu."
  },
  {
    term: "rahma",
    aliases: ["rahmah"],
    category: "concept",
    definition: "Miséricorde divine, concept fondamental en Islam. Englobe la bonté, la compassion et la clémence d\u2019Allah. Racine r-h-m partagée par Ar-Rahman et Ar-Rahim."
  },

  // ========================
  // CONCEPTS AVANCÉS
  // ========================
  {
    term: "tawhid",
    aliases: ["tawhîd", "tawheed"],
    category: "théologie",
    definition: "Unicité divine, fondement de la foi islamique. Comprend l\u2019unicité de l\u2019essence (dhat), des attributs (sifat) et des actes d\u2019Allah. Premier devoir du serviteur et sens du témoignage de foi."
  },
  {
    term: "tawakkul",
    aliases: ["tawakkoul"],
    category: "concept",
    definition: "Confiance totale en Allah tout en prenant les moyens nécessaires. Réalité du cœur qui consiste à s\u2019en remettre à Allah pour le résultat de ses efforts, fondée sur la connaissance du nom Al-Wakil."
  },
  {
    term: "ihsan",
    aliases: ["ihsân", "ihsane"],
    category: "théologie",
    definition: "Excellence dans l\u2019adoration, plus haut degré de la foi. Défini par le Prophète (paix sur lui) comme le fait d\u2019adorer Allah comme si tu Le voyais, car si tu ne Le vois pas, Lui te voit."
  },
  {
    term: "muraqaba",
    aliases: ["murâqaba", "mouraqaba"],
    category: "concept",
    definition: "Conscience permanente de la surveillance divine. État spirituel où le serviteur veille sur ses actes et ses pensées, sachant qu\u2019Allah l\u2019observe en tout instant. Liée au nom Ar-Raqib."
  },
  {
    term: "walaya",
    aliases: ["wilaya", "wilâya", "walâya"],
    category: "concept",
    definition: "Alliance divine, proximité et soutien qu\u2019Allah accorde à Ses serviteurs croyants. Implique la protection, le secours et la prise en charge. Racine du nom Al-Wali."
  },
  {
    term: "batil",
    aliases: ["bâtil", "baatil"],
    category: "concept",
    definition: "Le faux, le vain, le futile. Opposé d\u2019Al-Haqq (la Vérité). Désigne tout ce qui est dépourvu de réalité et voué à disparaître, comme l\u2019affirme le verset : la vérité est venue et le faux a disparu."
  },
  {
    term: "fana'",
    aliases: ["fanâ\u2019", "fana"],
    category: "concept",
    definition: "Anéantissement, disparition. Désigne la fin de toute chose créée. Opposé du baqa\u2019 (permanence). Toute la création est soumise au fana\u2019, tandis qu\u2019Allah seul est Al-Baqi, le Permanent."
  },
  {
    term: "baqa'",
    aliases: ["baqâ\u2019", "baqa"],
    category: "concept",
    definition: "Permanence éternelle, opposé du fana\u2019 (anéantissement). Attribut exclusif d\u2019Allah dont l\u2019existence est nécessaire et sans fin. Le croyant s\u2019attache à l\u2019Éternel plutôt qu\u2019à l\u2019éphémère."
  },
  {
    term: "kibriya'",
    aliases: ["kibriyâ\u2019", "kibriya"],
    category: "concept",
    definition: "Grandeur suprême et majesté absolue. Attribut exclusif d\u2019Allah que nul ne peut légitimement revendiquer. Le hadith rapporte : La grandeur est Mon manteau et la majesté est Mon pagne."
  },
  {
    term: "'izza",
    aliases: ["\u2018izza", "izza", "\u2019izza"],
    category: "concept",
    definition: "Puissance, honneur et dignité véritables. Allah l\u2019accorde à qui Il veut et la retire à qui Il veut. La vraie \u2018izza est celle de la foi et de la piété, non celle du pouvoir mondain. Racine du nom Al-Mu\u2019izz."
  },
  {
    term: "taqdir",
    aliases: ["taqdîr", "takdir"],
    category: "concept",
    definition: "Détermination et planification divines. Désigne le décret par lequel Allah détermine les choses avant de les créer. Première étape de la création, liée au nom Al-Khaliq."
  },
  {
    term: "sabr",
    aliases: ["sabr"],
    category: "concept",
    definition: "Patience et endurance face aux épreuves et aux tentations. Maîtrise de soi qui ne relève pas de la faiblesse mais de la force. Allah est As-Sabur, Celui dont la patience est parfaite."
  },
  {
    term: "nur",
    aliases: ["nûr", "nour"],
    category: "concept",
    definition: "Lumière divine par laquelle les cieux et la terre sont illuminés. Désigne aussi la lumière de la foi dans le cœur du croyant. Le célèbre verset de la Lumière (24:35) en décrit la portée cosmique."
  },
  {
    term: "hidaya",
    aliases: ["hidâya", "hidayah"],
    category: "concept",
    definition: "Guidance divine vers le droit chemin. Comporte plusieurs degrés : la guidance générale (dalala), l\u2019inspiration intérieure (ilham) et la révélation (wahiy). Le plus grand bienfait d\u2019Allah."
  },
  {
    term: "hisab",
    aliases: ["hisâb", "hissab"],
    category: "concept",
    definition: "Compte et reddition des comptes devant Allah. Désigne le jugement précis de chaque acte le Jour de la Résurrection. Lié au nom Al-Hasib qui signifie aussi Celui qui suffit."
  },
  {
    term: "'afw",
    aliases: ["\u2018afw", "afw", "\u2019afw"],
    category: "concept",
    definition: "Effacement total du péché, supérieur au simple pardon (ghufran) qui couvre le péché sans le supprimer. L\u2019invocation Allahumma innaka \u2018Afuwwun est recommandée durant la Nuit du Destin."
  },
  {
    term: "ra'fa",
    aliases: ["ra\u2019fa", "ra\u2019fah", "raafa"],
    category: "concept",
    definition: "Compassion fine et délicate, degré le plus tendre de la miséricorde. Plus intime que la rahma générale. Se manifeste par l\u2019allègement des obligations religieuses. Racine du nom Ar-Ra\u2019uf."
  },
  {
    term: "Ayat al-Kursi",
    aliases: ["Ayatul Kursi", "verset du Trône"],
    category: "théologie",
    definition: "Verset du Trône (Coran 2:255), considéré comme le plus grand verset du Coran. Réunit les noms Al-Hayy et Al-Qayyum et affirme la souveraineté absolue d\u2019Allah sur les cieux et la terre."
  },
  {
    term: "Takbir",
    aliases: ["takbîr", "tekbir"],
    category: "théologie",
    definition: "Proclamation Allahu Akbar (Allah est le Plus Grand). Prononcée à chaque mouvement de la prière et en de nombreuses occasions. Affirmation de la suprématie et de la grandeur d\u2019Allah."
  },
  {
    term: "hamd",
    aliases: ["hamد"],
    category: "concept",
    definition: "Louange adressée à Allah pour une perfection volontaire, à la différence du madh qui peut porter sur une qualité involontaire. Le croyant dit Alhamdulillah en toute circonstance."
  },
  {
    term: "tasbih",
    aliases: ["tasbîh", "tasbiih"],
    category: "théologie",
    definition: "Glorification d\u2019Allah par la formule Subhanallah (Gloire à Allah). Acte de purification verbale affirmant qu\u2019Allah est exempt de tout défaut et de toute imperfection."
  },
  {
    term: "idafa",
    aliases: ["idâfa", "idhafa"],
    category: "grammaire",
    definition: "Construction d\u2019annexion en grammaire arabe, reliant deux noms pour exprimer la possession ou l\u2019appartenance. Exemple : Malik-ul-Mulk (Possesseur de la Royauté)."
  },
  {
    term: "masdar",
    aliases: ["masdar"],
    category: "grammaire",
    definition: "Nom verbal en arabe, exprimant l\u2019action pure sans référence au temps ni à l\u2019agent. Utilisé comme qualificatif divin pour renforcer le sens, comme Al-\u2018Adl (la Justice même)."
  },
  {
    term: "wahiy",
    aliases: ["wahy", "wahi"],
    category: "théologie",
    definition: "Révélation divine transmise aux prophètes par l\u2019intermédiaire de l\u2019ange Jibril ou directement. Le Coran est la dernière et ultime forme de wahiy adressée à l\u2019humanité."
  },
  {
    term: "intiqam",
    aliases: ["intiqâm"],
    category: "concept",
    definition: "Rétribution et châtiment justes infligés par Allah à ceux qui persistent dans la transgression après les avertissements. La vengeance divine est pure justice, non impulsion. Racine du nom Al-Muntaqim."
  },
  {
    term: "ghayy",
    aliases: ["ghayy"],
    category: "concept",
    definition: "Égarement et déviation du droit chemin. Opposé du rushd (bonne direction). Le Coran distingue clairement la guidance de l\u2019égarement, et Allah est Ar-Rashid, Celui qui dirige vers le bien."
  },
  {
    term: "rushd",
    aliases: ["rouchd"],
    category: "concept",
    definition: "Bonne direction, sagesse dans la conduite et maturité spirituelle. Opposé du ghayy (égarement). Allah est Ar-Rashid, Celui dont la direction est infaillible et mène toujours au bien."
  }
];
