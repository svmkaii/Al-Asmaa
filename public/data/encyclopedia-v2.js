/**
 * Al-Asmaa — Encyclopédie V2 : Fiches ultra-completes trilingues
 * AR / EN / FR — 9 sections par nom
 *
 * Savants de référence :
 *   Abu Hanifa, Malik ibn Anas, Ash-Shafi'i, Al-Bukhari,
 *   Muslim, An-Nawawi, Al-Qurtubi, Ibn Kathir
 *
 * AVERTISSEMENT : Les numeros de volume/page doivent être verifies par un specialiste.
 * Les textes arabes des hadiths doivent être croises avec sunnah.com.
 * Chaque information non confirmee est marquee avec le flag verified: false.
 */

var SCHOLARLY_SOURCES_V2 = {
  // === 8 savants principaux ===
  abu_hanifa_fiqh_akbar: {
    author: "Abu Hanifa al-Nu'man (m. 150 H / 767)",
    title: "Al-Fiqh al-Akbar",
    citation: "Al-Fiqh al-Akbar, traite fondateur de la croyance islamique, par l'imam Abu Hanifa.",
    links: [
      { label: "Al-Fiqh al-Akbar — traduction anglaise (Archive.org)", url: "https://archive.org/details/al-fiqh-al-akbar", lang: "en" },
      { label: "La croyance de l'imam Abu Hanifa — Islamhouse (PDF)", url: "https://d1.islamhouse.com/data/fr/ih_articles/single/fr-aqeedah-tahawiyyah.pdf", lang: "fr" }
    ]
  },
  malik_muwatta: {
    author: "Malik ibn Anas (m. 179 H / 795)",
    title: "Al-Muwatta",
    citation: "Al-Muwatta, premier recueil de hadith et de fiqh systématique, par l'imam Malik ibn Anas.",
    links: [
      { label: "Al-Muwatta — collection complète (Sunnah.com)", url: "https://sunnah.com/malik", lang: "en" },
      { label: "Al-Muwatta de l'imam Malik — Islamhouse (PDF)", url: "https://d1.islamhouse.com/data/fr/ih_books/single2/fr_Al_Mouwattaa.pdf", lang: "fr" }
    ]
  },
  shafii_risala: {
    author: "Muhammad ibn Idris Ash-Shafi'i (m. 204 H / 820)",
    title: "Al-Risala",
    citation: "Al-Risala, traite fondateur des usul al-fiqh, par l'imam Ash-Shafi'i.",
    links: [
      { label: "Al-Risala — traduction Majid Khadduri (Archive.org)", url: "https://archive.org/details/imam-shafi-treatise-on-the-foundations-of-islamic-jurisprudence", lang: "en" },
      { label: "Biographie et oeuvre de l'imam Ash-Shafi'i — Islamhouse", url: "https://d1.islamhouse.com/data/fr/ih_articles/single/fr-biographie-imam-chafii.pdf", lang: "fr" }
    ]
  },
  bukhari_sahih: {
    author: "Muhammad ibn Isma'il Al-Bukhari (m. 256 H / 870)",
    title: "Sahih al-Bukhari",
    citation: "Sahih al-Bukhari, le recueil de hadiths le plus authentique, par l'imam Al-Bukhari.",
    links: [
      { label: "Sahih al-Bukhari — collection complète (Sunnah.com)", url: "https://sunnah.com/bukhari", lang: "en" },
      { label: "Sahih al-Bukhari — traduction francaise (Archive.org)", url: "https://archive.org/details/sahih-al-bukhari-en-francais", lang: "fr" }
    ]
  },
  muslim_sahih: {
    author: "Muslim ibn al-Hajjaj (m. 261 H / 875)",
    title: "Sahih Muslim",
    citation: "Sahih Muslim, second recueil de hadiths le plus authentique, par l'imam Muslim.",
    links: [
      { label: "Sahih Muslim — collection complète (Sunnah.com)", url: "https://sunnah.com/muslim", lang: "en" },
      { label: "Sahih Muslim — traduction francaise (Archive.org)", url: "https://archive.org/details/sahih-muslim-en-francais", lang: "fr" }
    ]
  },
  nawawi_riyad: {
    author: "Yahya ibn Sharaf An-Nawawi (m. 676 H / 1277)",
    title: "Riyad al-Salihin / Sharh Sahih Muslim",
    citation: "Riyad al-Salihin et Sharh Sahih Muslim, oeuvres majeures de l'imam An-Nawawi.",
    links: [
      { label: "Riyad al-Salihin — collection complète (Sunnah.com)", url: "https://sunnah.com/riyadussalihin", lang: "en" },
      { label: "Les Jardins des Vertueux — traduction francaise (Archive.org)", url: "https://archive.org/details/riyad-es-salihin-les-jardins-des-vertueux", lang: "fr" }
    ]
  },
  qurtubi_tafsir: {
    author: "Abu Abdillah Al-Qurtubi (m. 671 H / 1273)",
    title: "Al-Jami' li-Ahkam al-Quran (Tafsir al-Qurtubi)",
    citation: "Al-Jami' li-Ahkam al-Quran, tafsir encyclopedique de référence, par l'imam Al-Qurtubi.",
    links: [
      { label: "Tafsir Al-Qurtubi — Quran.com", url: "https://quran.com/en/1:1/tafsirs/en-tafisr-al-qurtubi", lang: "en" },
      { label: "Les 99 plus beaux Noms d'Allah — IslamWeb", url: "https://www.islamweb.net/fr/article/164167/Les-99-plus-beaux-Noms-dAllah", lang: "fr" }
    ]
  },
  ibn_kathir_tafsir: {
    author: "Isma'il ibn Umar Ibn Kathir (m. 774 H / 1373)",
    title: "Tafsir al-Quran al-Azim (Tafsir Ibn Kathir)",
    citation: "Tafsir Ibn Kathir, exégèse coranique de référence par l'imam Ibn Kathir.",
    links: [
      { label: "Tafsir Ibn Kathir — Quran.com", url: "https://quran.com/en/1:1/tafsirs/en-tafsir-ibn-kathir", lang: "en" },
      { label: "Tafsir Ibn Kathir complet — traduction francaise (Archive.org)", url: "https://archive.org/details/tafsir-ibn-kathir-francais", lang: "fr" }
    ]
  },

  // === Dictionnaires classiques (utilises dans la section linguistique) ===
  lisan_al_arab: {
    author: "Ibn Manzur (m. 711 H / 1311)",
    title: "Lisan al-Arab",
    citation: "Lisan al-Arab, le plus grand dictionnaire classique de la langue arabe, par Ibn Manzur.",
    links: [
      { label: "Lisan al-Arab — Wikipedia", url: "https://en.wikipedia.org/wiki/Lisan_al-Arab", lang: "en" },
      { label: "Comprendre les Noms d'Allah (Archive.org)", url: "https://archive.org/details/abdarazzaq-ibn-abdalmohsin-al-badr-comprendre-les-noms-d-allah", lang: "fr" }
    ]
  },
  raghib_mufradat: {
    author: "Al-Raghib al-Isfahani (m. 502 H / 1108)",
    title: "Mufradat Alfaz al-Quran",
    citation: "Mufradat Alfaz al-Quran, lexique de référence des termes coraniques, par al-Raghib al-Isfahani.",
    links: [
      { label: "Al-Raghib al-Isfahani — Wikipedia", url: "https://en.wikipedia.org/wiki/Al-Raghib_al-Isfahani", lang: "en" },
      { label: "Noms et Attributs d'Allah — Sajidine", url: "https://www.sajidine.com/Allah/noms-attributs/index.php", lang: "fr" }
    ]
  },
  maqayis_lugha: {
    author: "Ibn Faris (m. 395 H / 1004)",
    title: "Mu'jam Maqayis al-Lugha",
    citation: "Mu'jam Maqayis al-Lugha, dictionnaire étymologique de référence, par Ibn Faris.",
    links: [
      { label: "Ibn Faris — Wikipedia", url: "https://en.wikipedia.org/wiki/Ibn_Faris", lang: "en" },
      { label: "Noms et Attributs d'Allah — Sajidine", url: "https://www.sajidine.com/Allah/noms-attributs/index.php", lang: "fr" }
    ]
  },
  tahdhib_lugha: {
    author: "Abu Mansur al-Azhari (m. 370 H / 980)",
    title: "Tahdhib al-Lugha",
    citation: "Tahdhib al-Lugha, dictionnaire classique de référence, par al-Azhari.",
    links: [
      { label: "Al-Azhari — Wikipedia", url: "https://en.wikipedia.org/wiki/Al-Azhari", lang: "en" }
    ]
  },
  qamus_muhit: {
    author: "Al-Firuzabadi (m. 817 H / 1414)",
    title: "Al-Qamus al-Muhit",
    citation: "Al-Qamus al-Muhit, dictionnaire arabe majeur, par al-Firuzabadi.",
    links: [
      { label: "Al-Qamus al-Muhit — Wikipedia", url: "https://en.wikipedia.org/wiki/Al-Qamus_al-Muhit", lang: "en" }
    ]
  },
  taj_al_arus: {
    author: "Al-Zabidi (m. 1205 H / 1791)",
    title: "Taj al-Arus min Jawahir al-Qamus",
    citation: "Taj al-Arus, dictionnaire encyclopedique monumental, par al-Zabidi.",
    links: [
      { label: "Taj al-Arus — Wikipedia", url: "https://en.wikipedia.org/wiki/Taj_al-Arus", lang: "en" }
    ]
  },

  // === Alias pour retrocompat avec les donnees V2 existantes ===
  maturidi_tawhid: {
    author: "Abu Mansur al-Maturidi (m. 333 H / 944)",
    title: "Kitab al-Tawhid",
    citation: "Kitab al-Tawhid, par l'imam al-Maturidi.",
    links: [
      { label: "L'ecole Maturidite — Wikipedia", url: "https://en.wikipedia.org/wiki/Maturidi", lang: "en" }
    ]
  },
  tahawi_aqida: {
    author: "Abu Ja'far al-Tahawi (m. 321 H / 933)",
    title: "Al-Aqida al-Tahawiyya",
    citation: "Al-Aqida al-Tahawiyya, par l'imam al-Tahawi.",
    links: [
      { label: "Commentary on the Creed of al-Tahawi (Archive.org)", url: "https://archive.org/details/commentary-on-the-creed-of-at-tahawi", lang: "en" }
    ]
  },
  taftazani_aqaid: {
    author: "Sa'd al-Din al-Taftazani (m. 792 H / 1390)",
    title: "Sharh al-Aqa'id al-Nasafiyya",
    citation: "Sharh al-Aqa'id al-Nasafiyya, par al-Taftazani.",
    links: [
      { label: "Al-Taftazani — Wikipedia", url: "https://en.wikipedia.org/wiki/Al-Taftazani", lang: "en" }
    ]
  },
  nasafi_madarik: {
    author: "Abu al-Barakat al-Nasafi (m. 710 H / 1310)",
    title: "Madarik al-Tanzil wa Haqa'iq al-Ta'wil",
    citation: "Madarik al-Tanzil, par l'imam al-Nasafi.",
    links: [
      { label: "Al-Nasafi — Wikipedia", url: "https://en.wikipedia.org/wiki/Abu_al-Barakat_al-Nasafi", lang: "en" }
    ]
  },
  ghazali_maqsad: {
    author: "Abu Hamid Al-Ghazali (m. 505 H / 1111)",
    title: "Al-Maqsad al-Asna fi Sharh Asma' Allah al-Husna",
    citation: "The Ninety-Nine Beautiful Names of God, by Al-Ghazali.",
    links: [
      { label: "The Ninety-Nine Beautiful Names of God (Archive.org)", url: "https://archive.org/details/al-ghazali-the-ninety-nine-beautiful-names-of-god", lang: "en" }
    ]
  },
  qurtubi_asna: {
    author: "Abu Abdillah Al-Qurtubi (m. 671 H / 1273)",
    title: "Al-Asna fi Sharh Asma' Allah al-Husna",
    citation: "Al-Asna fi Sharh Asma' Allah al-Husna, par l'imam Al-Qurtubi.",
    links: [
      { label: "Les 99 plus beaux Noms d'Allah — IslamWeb", url: "https://www.islamweb.net/fr/article/164167/Les-99-plus-beaux-Noms-dAllah", lang: "fr" }
    ]
  },
  ibn_qayyim: {
    author: "Ibn al-Qayyim al-Jawziyya (m. 751 H / 1350)",
    title: "Bada'i al-Fawa'id",
    citation: "Bada'i al-Fawa'id, par Ibn al-Qayyim.",
    links: [
      { label: "Oeuvres d'Ibn al-Qayyim — Kalamullah", url: "https://kalamullah.com/ibn-qayyim.html", lang: "en" }
    ]
  },
  ibn_taymiyyah: {
    author: "Ibn Taymiyyah (m. 728 H / 1328)",
    title: "Majmu' al-Fatawa",
    citation: "Majmu' al-Fatawa, par Ibn Taymiyyah.",
    links: [
      { label: "Explication des plus beaux Noms d'Allah (Archive.org)", url: "https://archive.org/details/explication-des-plus-beaux-noms-d-allah-abd-ar-rahman-ibn-nasir-as-saadi", lang: "fr" }
    ]
  },
  zajjaj: {
    author: "Abu Ishaq Az-Zajjaj (m. 311 H / 923)",
    title: "Tafsir Asma' Allah al-Husna",
    citation: "Tafsir Asma' Allah al-Husna, par Az-Zajjaj.",
    links: [
      { label: "Comprendre les Noms d'Allah (Archive.org)", url: "https://archive.org/details/abdarazzaq-ibn-abdalmohsin-al-badr-comprendre-les-noms-d-allah", lang: "fr" }
    ]
  },
  bayhaqi_asna: {
    author: "Abu Bakr Al-Bayhaqi (m. 458 H / 1066)",
    title: "Al-Asma' wa al-Sifat",
    citation: "Al-Asma' wa al-Sifat, par l'imam Al-Bayhaqi.",
    links: [
      { label: "Noms et Attributs divins — IslamQA", url: "https://islamqa.info/fr/categories/topics/18/les-noms-et-attributs-divins", lang: "fr" }
    ]
  },
  khattabi: {
    author: "Abu Sulayman Al-Khattabi (m. 388 H / 998)",
    title: "Sha'n ad-Du'a",
    citation: "Sha'n ad-Du'a, par l'imam Al-Khattabi.",
    links: [
      { label: "Explication des 99 Noms d'Allah — Islam.ms", url: "https://www.islam.ms/explication-99-noms-parfaits-Allah-Dieu", lang: "fr" }
    ]
  }
};

// =====================================================================
//  ENCYCLOPEDIA_V2 — Entrees ultra-completes trilingues
// =====================================================================

var ENCYCLOPEDIA_V2 = {

  // ===================================================================
  //  1 — AR-RAHMAN (Le Tout Miséricordieux)
  // ===================================================================
  1: {

    // -----------------------------------------------------------------
    //  Section 1 : IDENTIFICATION
    // -----------------------------------------------------------------
    identification: {
      transliteration_alalc: "al-Rahmān",
      phonetic_fr: "ar-rah-MANE",
      root: "ر ح م",
      root_latin: "r-h-m",
      grammatical_form: "fa'lān",
      grammatical_form_ar: "فَعْلَان",
      grammatical_category: "sighat_mubalaghah",
      theological_implication: {
        fr: "La forme fa'lān exprimé l'intensité maximale et la plénitude de l'attribut. Ar-Rahman désigne une miséricorde débordante, englobant toute la création sans distinction.",
        en: "The fa'lān pattern expresses the utmost intensity and fullness of the attribute. Ar-Rahman denotes an overflowing mercy encompassing all of creation without distinction.",
        ar: "صيغة فَعْلَان تدلّ على الامتلاء والشمول، فالرحمن هو ذو الرحمة الشاملة لجميع الخلائق بلا تفريق"
      }
    },

    // -----------------------------------------------------------------
    //  Section 2 : LINGUISTIQUE
    // -----------------------------------------------------------------
    linguistic: {
      classical_meaning: {
        fr: "Ar-Rahman dérive de la racine r-h-m (رحم) qui exprime la miséricorde, la tendresse et la compassion. Sur le schéma fa'lān, il indique celui dont la miséricorde est à son comble, englobant toutes les créatures dans ce bas monde.",
        en: "Ar-Rahman derives from the root r-h-m (رحم) expressing mercy, tenderness and compassion. In the fa'lān pattern, it indicates the One whose mercy is at its peak, encompassing all creatures in this world.",
        ar: "الرحمن مشتق من الرحمة على وزن فعلان، وهو يدل على الامتلاء والمبالغة، فهو سبحانه ذو الرحمة الواسعة الشاملة لجميع المخلوقات"
      },
      differences_with_synonyms: {
        fr: "Ar-Rahman vs Ar-Rahim : Ar-Rahman est la miséricorde universelle englobant toute la création (croyants et non-croyants) dans le bas monde. Ar-Rahim est la miséricorde spéciale réservée aux croyants dans l'au-delà. Ibn al-Qayyim précise : « Ar-Rahman est la description de l'Essence, Ar-Rahim est la description de l'acte. »",
        en: "Ar-Rahman vs Ar-Rahim: Ar-Rahman is the universal mercy encompassing all creation (believers and non-believers) in this world. Ar-Rahim is the special mercy reserved for believers in the Hereafter. Ibn al-Qayyim clarifies: 'Ar-Rahman describes the Essence, Ar-Rahim describes the act.'"
      },
      pre_islamic_usage: {
        fr: "Le terme 'rahman' était connu en arabe pré-islamique et en langues sémitiques proches (hébreu: rahamim, syriaque: rahmana). Il était utilisé dans les inscriptions sud-arabiques pour désigner la divinité. Cependant, son usage comme nom propre exclusif à Allah est une innovation coranique.",
        en: "The term 'rahman' was known in pre-Islamic Arabic and related Semitic languages (Hebrew: rahamim, Syriac: rahmana). It was used in South Arabian inscriptions to refer to the deity. However, its use as a proper name exclusive to Allah is a Quranic innovation."
      },
      semantic_evolution: {
        fr: "De la racine r-h-m qui désigne aussi l'uterus (rahim), établissant un lien sémantique entre la miséricorde divine et la tendresse maternelle. Le Prophète (paix sur lui) a dit : « Allah a dérivé Ar-Rahim de Ar-Rahman » (Tirmidhi 1907). La forme fa'lān n'a pas d'équivalent féminin ni de pluriel, soulignant l'unicité de cet attribut.",
        en: "From the root r-h-m which also denotes the womb (rahim), establishing a semantic link between divine mercy and maternal tenderness. The Prophet (peace be upon him) said: 'Allah derived Ar-Rahim from Ar-Rahman' (Tirmidhi 1907). The fa'lān form has no feminine or plural equivalent, underscoring the uniqueness of this attribute."
      },
      dictionary_sources: [
        {
          sourceKey: "lisan_al_arab",
          entry: "ر ح م",
          volume: "12",
          page: "230",
          text_ar: "الرَّحْمَنُ: اسم من أسماء الله تعالى، وهو فَعْلَان من الرحمة، وهو من الأسماء المختصة بالله تعالى لا يُسمَّى به غيره",
          text_fr: "Ar-Rahman : nom parmi les noms d'Allah, sur le schéma fa'lān de la miséricorde, nom exclusif à Allah qu'on ne donne à personne d'autre."
        },
        {
          sourceKey: "raghib_mufradat",
          entry: "ر ح م",
          volume: "",
          page: "",
          text_ar: "الرحمة: رقّة تقتضي الإحسان إلى المرحوم. والرحمن أبلغ من الرحيم",
          text_fr: "La miséricorde : une tendresse qui implique la bienfaisance envers celui qui en bénéficie. Ar-Rahman est plus intense que Ar-Rahim."
        },
        {
          sourceKey: "maqayis_lugha",
          entry: "ر ح م",
          volume: "2",
          page: "498",
          text_ar: "الراء والحاء والميم أصل واحد يدلّ على الرقة والعطف والرأفة",
          text_fr: "Ra-Ha-Mim : racine unique indiquant la douceur, la bienveillance et la clémence."
        }
      ]
    },

    // -----------------------------------------------------------------
    //  Section 3 : THEOLOGIE
    // -----------------------------------------------------------------
    theology: {
      attribute_type: "dhatiyya",
      attribute_type_labels: {
        fr: "Attribut d'Essence (dhatiyya)",
        en: "Attribute of Essence (dhatiyya)",
        ar: "صفة ذاتية"
      },
      explanation: {
        fr: "Ar-Rahman est un attribut d'Essence (sifa dhatiyya) car la miséricorde est inhérente à l'Essence divine de toute éternité. Elle n'est pas contingente à la création ni à un acte temporel. C'est pourquoi ce nom est exclusif à Allah et ne peut être attribué a aucune créature.",
        en: "Ar-Rahman is an attribute of Essence (sifa dhatiyya) because mercy is inherent to the divine Essence from all eternity. It is not contingent upon creation nor upon a temporal act. This is why this name is exclusive to Allah and cannot be attributed to any créature.",
        ar: "الرحمن صفة ذاتية لأن الرحمة ثابتة لله تعالى أزلاً وأبداً، لا تتوقف على وجود المخلوقات ولا على فعل حادث، ولذلك هو اسم خاص بالله لا يُطلق على غيره"
      },
      debates: [
        {
          school: "Ash'ari / Maliki-Shafi'i",
          position: {
            fr: "Les Ash'arites considèrent que la miséricorde d'Allah n'impliqué pas d'émotion (infi'al) mais signifié la volonté de bienfaisance (irada al-ihsan). Al-Qurtubi et Al-Ghazali suivent cette position : la miséricorde divine est une volonté effective de faire le bien, non un état émotionnel.",
            en: "The Ash'arites consider that Allah's mercy does not imply émotion (infi'al) but means the will to do good (irada al-ihsan). Al-Qurtubi and Al-Ghazali follow this position: divine mercy is an effective will to do good, not an emotional state.",
            ar: "يرى الأشاعرة أن رحمة الله لا تستلزم انفعالاً بل هي إرادة الإحسان إلى المرحوم"
          },
          scholars: ["Al-Qurtubi", "Al-Ghazali", "Al-Bayhaqi"],
          sources: ["qurtubi_asna", "ghazali_maqsad", "bayhaqi_asna"]
        },
        {
          school: "Maturidi / Hanafi",
          position: {
            fr: "Les Maturidites affirment également que la miséricorde est un attribut reel d'Allah mais l'interpretent comme une bienveillance (in'am) et une grâce (ihsan) envers les créatures, sans impliquer de faiblesse ou d'émotion. Al-Maturidi insiste sur la différence entre l'attribut divin et l'attribut humain de même nom.",
            en: "The Maturidites also affirm that mercy is a real attribute of Allah but interpret it as benevolence (in'am) and grâce (ihsan) toward creatures, without implying weakness or émotion. Al-Maturidi insists on the différence between the divine attribute and the human attribute of the same name.",
            ar: "يقول الماتريدية إن الرحمة صفة حقيقية لله تعالى، لكنها تُفسَّر بالإنعام والإحسان إلى المخلوقات دون أن تستلزم ضعفاً أو انفعالاً"
          },
          scholars: ["Al-Maturidi", "Al-Tahawi", "Al-Taftazani"],
          sources: ["maturidi_tawhid", "tahawi_aqida", "taftazani_aqaid"]
        },
        {
          school: "Athari / Hanbali",
          position: {
            fr: "Les Atharites (Ibn Taymiyyah, Ibn al-Qayyim) affirment la miséricorde comme attribut reel d'Allah tel que décrit dans le Coran et la Sunna, sans la reduire à une simple volonté. Ils affirment une miséricorde reelle (haqiqiyya) qui sied à la majesté divine, sans la comparer aux créatures (bila takyif). Ibn al-Qayyim distingué entre la miséricorde comme attribut d'Essence (permanente) et ses manifestations dans la création.",
            en: "The Atharis (Ibn Taymiyyah, Ibn al-Qayyim) affirm mercy as a real attribute of Allah as described in the Quran and Sunnah, without reducing it to a mere will. They affirm a real mercy (haqiqiyya) befitting divine majesty, without comparing it to creatures (bila takyif). Ibn al-Qayyim distinguishes between mercy as an attribute of Essence (permanent) and its manifestations in creation.",
            ar: "يُثبت الأثرية (ابن تيمية وابن القيم) الرحمة صفة حقيقية لله كما وردت في الكتاب والسنة، من غير تأويل ولا تشبيه، بل هي رحمة حقيقية تليق بجلال الله"
          },
          scholars: ["Ibn Taymiyyah", "Ibn al-Qayyim"],
          sources: ["ibn_taymiyyah", "ibn_qayyim"]
        }
      ]
    },

    // -----------------------------------------------------------------
    //  Section 4 : OCCURRENCES CORANIQUES
    // -----------------------------------------------------------------
    quranOccurrences: [
      {
        surahNumber: 1,
        ayahNumber: 1,
        surah_name_ar: "الفاتحة",
        surah_name_fr: "Al-Fatiha",
        arabic_text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        translation_fr: { text: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.", translator: "Muhammad Hamidullah" },
        translation_en: { text: "In the name of Allah, the Most Gracious, the Most Merciful.", translator: "Sahih International" },
        context: {
          fr: "La Basmala ouvre le Coran et mentionné les deux noms de la miséricorde divine. Ar-Rahman y précède Ar-Rahim, indiquant la priorité de la miséricorde universelle.",
          en: "The Basmala opens the Quran and mentions both names of divine mercy. Ar-Rahman precedes Ar-Rahim, indicating the priority of universal mercy."
        },
        link: "https://quran.com/fr/1:1",
        morphology_link: "https://corpus.quran.com/wordmorphology.jsp?location=(1:1:2)"
      },
      {
        surahNumber: 1,
        ayahNumber: 3,
        surah_name_ar: "الفاتحة",
        surah_name_fr: "Al-Fatiha",
        arabic_text: "الرَّحْمَٰنِ الرَّحِيمِ",
        translation_fr: { text: "Le Tout Miséricordieux, le Très Miséricordieux.", translator: "Muhammad Hamidullah" },
        translation_en: { text: "The Most Gracious, the Most Merciful.", translator: "Sahih International" },
        context: {
          fr: "Apres la louange à Allah (al-hamdu lillah), les deux attributs de miséricorde sont mentionnes, soulignant que la seigneurie divine est fondee sur la miséricorde.",
          en: "After the praise of Allah (al-hamdu lillah), both attributes of mercy are mentioned, emphasizing that divine lordship is founded on mercy."
        },
        link: "https://quran.com/fr/1:3",
        morphology_link: "https://corpus.quran.com/wordmorphology.jsp?location=(1:3:1)"
      },
      {
        surahNumber: 20,
        ayahNumber: 5,
        surah_name_ar: "طه",
        surah_name_fr: "Ta-Ha",
        arabic_text: "الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ",
        translation_fr: { text: "Le Tout Miséricordieux S'est établi sur le Trone.", translator: "Muhammad Hamidullah" },
        translation_en: { text: "The Most Merciful [who is] above the Throne established.", translator: "Sahih International" },
        context: {
          fr: "Ce verset associe Ar-Rahman à l'Istiwa' (l'établissement sur le Trone), liant la souveraineté absolue à la miséricorde. Selon Al-Qurtubi, le choix du nom Ar-Rahman ici indiqué que Son regne est fonde sur la miséricorde.",
          en: "This verse associates Ar-Rahman with al-Istiwa' (establishment on the Throne), linking absolute sovereignty to mercy. According to Al-Qurtubi, the choice of Ar-Rahman here indicates that His reign is founded on mercy."
        },
        link: "https://quran.com/fr/20:5",
        morphology_link: "https://corpus.quran.com/wordmorphology.jsp?location=(20:5:1)"
      },
      {
        surahNumber: 55,
        ayahNumber: 1,
        surah_name_ar: "الرحمن",
        surah_name_fr: "Ar-Rahman",
        arabic_text: "الرَّحْمَٰنُ",
        translation_fr: { text: "Le Tout Miséricordieux.", translator: "Muhammad Hamidullah" },
        translation_en: { text: "The Most Merciful.", translator: "Sahih International" },
        context: {
          fr: "La sourate 55 porte le nom Ar-Rahman et s'ouvre par ce nom seul, soulignant sa centralite. Le premier bienfait mentionné ensuite est l'enseignement du Coran (verset 2), liant la miséricorde à la révélation.",
          en: "Surah 55 bears the name Ar-Rahman and opens with this name alone, underscoring its centrality. The first blessing mentioned next is the teaching of the Quran (verse 2), linking mercy to révélation."
        },
        link: "https://quran.com/fr/55:1",
        morphology_link: "https://corpus.quran.com/wordmorphology.jsp?location=(55:1:1)"
      },
      {
        surahNumber: 25,
        ayahNumber: 60,
        surah_name_ar: "الفرقان",
        surah_name_fr: "Al-Furqan",
        arabic_text: "وَإِذَا قِيلَ لَهُمُ اسْجُدُوا لِلرَّحْمَٰنِ قَالُوا وَمَا الرَّحْمَٰنُ",
        translation_fr: { text: "Et quand on leur dit : « Prosternez-vous devant le Tout Miséricordieux », ils disent : « Qu'est-ce que le Tout Miséricordieux ? »", translator: "Muhammad Hamidullah" },
        translation_en: { text: "And when it is said to them, 'Prostrate to the Most Merciful,' they say, 'And what is the Most Merciful?'", translator: "Sahih International" },
        context: {
          fr: "Ce verset montre que les mecreants de Quraysh ne connaissaient pas le nom Ar-Rahman, ce qui confirme son caractère revelationnel et exclusivement divin.",
          en: "This verse shows that the disbelievers of Quraysh did not know the name Ar-Rahman, confirming its revelatory and exclusively divine character."
        },
        link: "https://quran.com/fr/25:60",
        morphology_link: "https://corpus.quran.com/wordmorphology.jsp?location=(25:60:7)"
      }
    ],

    // -----------------------------------------------------------------
    //  Section 5 : OCCURRENCES DANS LA SUNNA
    // -----------------------------------------------------------------
    sunnaOccurrences: [
      {
        collection: "Sahih Muslim",
        number: "2752",
        book: "Kitab al-Tawba",
        text_ar: "جَعَلَ اللَّهُ الرَّحْمَةَ مِائَةَ جُزْءٍ فَأَمْسَكَ عِنْدَهُ تِسْعَةً وَتِسْعِينَ جُزْءًا وَأَنْزَلَ فِي الْأَرْضِ جُزْءًا وَاحِدًا فَمِنْ ذَلِكَ الْجُزْءِ يَتَرَاحَمُ الْخَلْقُ",
        text_fr: "Allah a crée la miséricorde en cent parties. Il en a retenu quatre-vingt-dix-neuf aupres de Lui et en a fait descendre une seule sur terre. C'est de cette partie que les créatures tirent leur compassion mutuelle.",
        text_en: "Allah created mercy in one hundred parts. He retained with Him ninety-nine parts and sent down to earth one part. It is from that part that creatures show compassion to one another.",
        authentication: "Sahih (authentique)",
        grading_source: "Muslim",
        link: "https://sunnah.com/muslim:2752"
      },
      {
        collection: "Jami' al-Tirmidhi",
        number: "1907",
        book: "Kitab al-Birr wa al-Sila",
        text_ar: "الرَّحِمُ شُجْنَةٌ مِنَ الرَّحْمَنِ فَمَنْ وَصَلَهَا وَصَلَهُ اللَّهُ وَمَنْ قَطَعَهَا قَطَعَهُ اللَّهُ",
        text_fr: "Les liens de parente (rahim) derivent d'Ar-Rahman. Quiconque les maintient, Allah maintiendra ses liens avec lui, et quiconque les rompt, Allah rompra ses liens avec lui.",
        text_en: "The womb (rahim) derives from Ar-Rahman. Whoever maintains ties of kinship, Allah will maintain His ties with him, and whoever severs them, Allah will sever His ties with him.",
        authentication: "Sahih (authentique)",
        grading_source: "Al-Tirmidhi, Al-Albani",
        link: "https://sunnah.com/tirmidhi:1907"
      },
      {
        collection: "Sahih al-Bukhari",
        number: "6000",
        book: "Kitab al-Adab",
        text_ar: "مَنْ لاَ يَرْحَمُ لاَ يُرْحَمُ",
        text_fr: "Celui qui ne fait pas miséricorde ne recevra pas la miséricorde.",
        text_en: "He who does not show mercy will not be shown mercy.",
        authentication: "Sahih (authentique)",
        grading_source: "Al-Bukhari",
        link: "https://sunnah.com/bukhari:6000"
      }
    ],

    // -----------------------------------------------------------------
    //  Section 6 : AVIS DES MADHABS
    // -----------------------------------------------------------------
    madhabOpinions: {
      hanafi: [
        {
          scholar: "Abu Hanifa",
          sourceKey: "abu_hanifa_fiqh_akbar",
          text_fr: "Allah possède des attributs eternels qui ne sont ni Lui ni autres que Lui. Parmi eux, la miséricorde (rahma) est un attribut reel de Son Essence, qu'on affirmé sans la comparer a celle des créatures.",
          text_en: "Allah possesses eternal attributes that are neither Him nor other than Him. Among them, mercy (rahma) is a real attribute of His Essence, affirmed without comparing it to that of creatures.",
          text_ar: "لله تعالى صفات أزلية قائمة بذاته ليست هي هو ولا هي غيره، ومنها الرحمة صفة حقيقية تثبت له من غير تشبيه",
          page_ref: "Al-Fiqh al-Akbar",
          link_ar: "https://shamela.ws/book/5765",
          link_en: "",
          link_fr: ""
        },
        {
          scholar: "Al-Maturidi",
          sourceKey: "maturidi_tawhid",
          text_fr: "Ar-Rahman signifié Celui dont la miséricorde englobe toutes les créatures. C'est un attribut propre à Allah qu'on ne donne à personne d'autre, car il impliqué une miséricorde illimitee et inconditionnelle.",
          text_en: "Ar-Rahman means the One whose mercy encompasses all creatures. It is an attribute proper to Allah that is not given to anyone else, as it implies an unlimited and unconditional mercy.",
          text_ar: "الرحمن هو ذو الرحمة الشاملة لجميع المخلوقات، وهو اسم خاص بالله لا يسمى به غيره لأنه يقتضي رحمة غير محدودة ولا مشروطة",
          page_ref: "Kitab al-Tawhid",
          link_ar: "https://shamela.ws/book/7655",
          link_en: "",
          link_fr: ""
        },
        {
          scholar: "Al-Nasafi",
          sourceKey: "nasafi_madarik",
          text_fr: "Dans son tafsir de la Basmala, Al-Nasafi expliqué qu'Ar-Rahman est plus intense (ablaghu) qu'Ar-Rahim car la forme fa'lān denote la plénitude, tandis que fa'il denote la continuite. Le premier englobe le monde, le second est spécifique aux croyants.",
          text_en: "In his tafsir of the Basmala, Al-Nasafi explains that Ar-Rahman is more intense (ablaghu) than Ar-Rahim because the fa'lān form denotes fullness while fa'il denotes continuity. The former encompasses the world, the latter is specific to believers.",
          text_ar: "الرحمن أبلغ من الرحيم لأن فَعْلان يدل على الامتلاء وفَعِيل يدل على الدوام، فالأول يعمّ الدنيا والثاني يخص المؤمنين",
          page_ref: "Madarik al-Tanzil, Tafsir al-Basmala",
          link_ar: "https://shamela.ws/book/23635",
          link_en: "",
          link_fr: ""
        }
      ],
      maliki: [
        {
          scholar: "Al-Qurtubi",
          sourceKey: "qurtubi_asna",
          text_fr: "Ar-Rahman est un nom propre à Allah, il ne peut être donne a autre que Lui. il indique que Sa miséricorde embrasse toute chose dans ce monde. La preuve en est le verset : « Ma miséricorde embrasse toute chose » (7:156). C'est un nom exclusif que les Arabes eux-memes ne connaissaient pas avant la Révélation.",
          text_en: "Ar-Rahman is a proper name of Allah that cannot be given to anyone else. It indicates that His mercy embraces everything in this world. The proof is the verse: 'My mercy encompasses all things' (7:156). It is an exclusive name that even the Arabs did not know before the Révélation.",
          text_ar: "الرحمن اسم خاص بالله تعالى لا يجوز أن يُسمَّى به غيره، يدل على أن رحمته وسعت كل شيء في الدنيا، والدليل قوله تعالى: ﴿وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ﴾",
          page_ref: "Al-Asna fi Sharh Asma' Allah al-Husna",
          link_ar: "https://shamela.ws/book/23627",
          link_en: "",
          link_fr: "https://www.islamweb.net/fr/article/164167/Les-99-plus-beaux-Noms-dAllah"
        }
      ],
      shafii: [
        {
          scholar: "Al-Ghazali",
          sourceKey: "ghazali_maqsad",
          text_fr: "Ar-Rahman est Celui qui veut le bien pour toutes les créatures, leur accorde l'existence et les guide vers ce qui leur est profitable. Sa miséricorde ne se limite pas a repondre aux besoins, mais elle devance les demandes et previent les maux. La part du serviteur dans ce nom est de faire miséricorde aux créatures d'Allah par la douceur et la bienveillance.",
          text_en: "Ar-Rahman is the One who wills good for all creatures, grants them existence and guides them toward what benefits them. His mercy is not limited to responding to needs but anticipates requests and prevents harm. The servant's share of this name is to show mercy to Allah's créatures through gentleness and benevolence.",
          text_ar: "الرحمن هو الذي يريد الخير لجميع المخلوقات ويمنحهم الوجود ويهديهم إلى ما ينفعهم، ورحمته لا تقتصر على قضاء الحاجات بل تسبق السؤال وتدفع الأذى",
          page_ref: "Al-Maqsad al-Asna, chapitre Ar-Rahman",
          link_ar: "https://shamela.ws/book/6465",
          link_en: "https://archive.org/details/al-ghazali-the-ninety-nine-beautiful-names-of-god",
          link_fr: "https://d1.islamhouse.com/data/fr/ih_articles/single/fr-Islamhouse_les_99_Noms_d_AllahH.pdf"
        },
        {
          scholar: "Al-Bayhaqi",
          sourceKey: "bayhaqi_asna",
          text_fr: "Al-Bayhaqi rapporte que la miséricorde d'Allah se manifesté dans la création, la subsistance, la guidee et le pardon. Le nom Ar-Rahman englobe toutes ces dimensions et se distingué d'Ar-Rahim par son caractère global et inconditionnel.",
          text_en: "Al-Bayhaqi reports that Allah's mercy manifests in creation, sustenance, guidance and forgiveness. The name Ar-Rahman encompasses all these dimensions and is distinguished from Ar-Rahim by its global and unconditional character.",
          text_ar: "ذكر البيهقي أن رحمة الله تتجلى في الخلق والرزق والهداية والمغفرة، واسم الرحمن يشمل جميع هذه الأبعاد ويتميز عن الرحيم بعمومه وإطلاقه",
          page_ref: "Al-Asma' wa al-Sifat",
          link_ar: "https://shamela.ws/book/9270",
          link_en: "",
          link_fr: ""
        },
        {
          scholar: "Al-Khattabi",
          sourceKey: "khattabi",
          text_fr: "Ar-Rahman est un nom qui ne convient qu'a Allah seul parmi toute la création. Il est plus spécifique que le nom Allah en un sens, car même ceux qui ne croient pas en Allah comme divinité ne peuvent appliquer Ar-Rahman a quiconque d'autre.",
          text_en: "Ar-Rahman is a name that befits no one but Allah alone among all creation. It is more specific than the name Allah in a sense, because even those who do not believe in Allah as God cannot apply Ar-Rahman to anyone else.",
          text_ar: "الرحمن اسم لا يصلح إلا لله وحده من بين جميع الخلق، وهو أخص من اسم الله من وجه لأن حتى من لم يؤمن بالله إلهاً لا يستطيع أن يسمي غيره بالرحمن",
          page_ref: "Sha'n ad-Du'a",
          link_ar: "https://shamela.ws/book/95700",
          link_en: "",
          link_fr: ""
        }
      ],
      hanbali: [
        {
          scholar: "Ibn al-Qayyim",
          sourceKey: "ibn_qayyim",
          text_fr: "Ar-Rahman est la description de l'Essence (wasf dhati), Ar-Rahim est la description de l'acte (wasf fi'li). Le premier indiqué que la miséricorde est un attribut établi dans l'Essence divine, le second indiqué qu'elle se manifesté envers les créatures. C'est pourquoi Ar-Rahman ne s'emploie jamais pour un autre qu'Allah, tandis qu'Ar-Rahim peut qualifier une créature.",
          text_en: "Ar-Rahman describes the Essence (wasf dhati), Ar-Rahim describes the act (wasf fi'li). The former indicates that mercy is an attribute established in the divine Essence, the latter indicates that it manifests toward creatures. This is why Ar-Rahman is never used for anyone other than Allah, while Ar-Rahim can qualify a créature.",
          text_ar: "الرحمن وصف ذاتي والرحيم وصف فعلي، فالأول يدل على أن الرحمة صفة قائمة بالذات الإلهية والثاني يدل على تعلقها بالمخلوقات، ولذلك لا يقال لغير الله رحمن ويقال رحيم",
          page_ref: "Bada'i al-Fawa'id",
          link_ar: "https://shamela.ws/book/12003",
          link_en: "https://kalamullah.com/ibn-qayyim.html",
          link_fr: ""
        },
        {
          scholar: "Ibn Taymiyyah",
          sourceKey: "ibn_taymiyyah",
          text_fr: "La miséricorde d'Allah est une miséricorde reelle (haqiqiyya) qui convient a Sa majesté, sans similitude avec la miséricorde des créatures. On l'affirmé telle qu'elle est venue dans les textes, sans negation (ta'til), sans interprétation figuree (ta'wil), sans modalite (takyif) et sans comparaison (tamthil).",
          text_en: "Allah's mercy is a real mercy (haqiqiyya) befitting His majesty, without resemblance to the mercy of creatures. It is affirmed as it came in the texts, without negation (ta'til), without figurative interprétation (ta'wil), without attribution of modality (takyif) and without comparison (tamthil).",
          text_ar: "رحمة الله رحمة حقيقية تليق بجلاله من غير مشابهة لرحمة المخلوقين، تُثبَت كما جاءت في النصوص بلا تعطيل ولا تأويل ولا تكييف ولا تمثيل",
          page_ref: "Majmu' al-Fatawa",
          link_ar: "https://shamela.ws/book/7289",
          link_en: "",
          link_fr: ""
        }
      ]
    },

    // -----------------------------------------------------------------
    //  Section 7 : LIENS VERIFIES
    // -----------------------------------------------------------------
    verifiedLinks: {
      quran_com: "https://quran.com/fr/55",
      sunnah_com: "https://sunnah.com/search?q=rahman",
      corpus_quran: "https://corpus.quran.com/qurandictionary.jsp?q=rHm",
      shamela: "https://shamela.ws/search?q=الرحمن&cat=0",
      dorar: "https://www.dorar.net/aqadia/1636",
      islamweb: "https://www.islamweb.net/fr/article/164167/Les-99-plus-beaux-Noms-dAllah",
      islamqa: "https://islamqa.info/fr/answers/128577"
    },

    // -----------------------------------------------------------------
    //  Section 8 : PRATIQUE
    // -----------------------------------------------------------------
    practice: {
      spiritual_impact: {
        fr: "Connaitre Ar-Rahman inspire une confiance totale en la miséricorde d'Allah, dissipe le desespoir et pousse à la repentance. Le croyant qui medite ce nom developpe la compassion envers les créatures, car la miséricorde humaine est une manifestation infime de la miséricorde divine.",
        en: "Knowing Ar-Rahman inspires total trust in Allah's mercy, dispels despair and encourages repentance. The believer who meditates on this name develops compassion toward creatures, as human mercy is a tiny manifestation of divine mercy."
      },
      authentic_duas: [
        {
          arabic: "رَبَّنَا وَسِعْتَ كُلَّ شَيْءٍ رَحْمَةً وَعِلْمًا",
          transliteration: "Rabbana wasi'ta kulla shay'in rahmatan wa 'ilman",
          fr: "Seigneur ! Tu embrasses toute chose de Ta miséricorde et de Ton savoir.",
          en: "Our Lord, You have encompassed all things in mercy and knowledge.",
          source: "Coran 40:7",
          link: "https://quran.com/fr/40:7",
          verified: true
        },
        {
          arabic: "رَبِّ اغْفِرْ وَارْحَمْ وَأَنتَ خَيْرُ الرَّاحِمِينَ",
          transliteration: "Rabbi ighfir warham wa anta khayru al-rahimin",
          fr: "Seigneur ! Pardonne et fais miséricorde. Tu es le Meilleur des miséricordieux.",
          en: "My Lord, forgive and have mercy, and You are the best of the merciful.",
          source: "Coran 23:118",
          link: "https://quran.com/fr/23:118",
          verified: true
        }
      ],
      dhikr: [
        {
          formula_ar: "يا رحمن يا رحيم",
          instruction_fr: "Invoquer ce dhikr apres les prieres obligatoires en meditant sur l'immensitede la miséricorde divine.",
          instruction_en: "Invoke this dhikr after the obligatory prayers while meditating on the immensity of divine mercy.",
          source: "Pratique générale des savants",
          verified: false
        }
      ],
      derived_names: {
        fr: "Abd-Ar-Rahman (عبد الرحمن) — Le serviteur du Tout Miséricordieux. C'est l'un des noms les plus aimes d'Allah selon le hadith : « Les noms les plus aimes d'Allah sont Abdullah et Abdurrahman » (Sahih Muslim 2132).",
        en: "Abd-Ar-Rahman (عبد الرحمن) — The servant of the Most Merciful. It is one of the most beloved names to Allah according to the hadith: 'The most beloved names to Allah are Abdullah and Abdurrahman' (Sahih Muslim 2132)."
      }
    },

    // -----------------------------------------------------------------
    //  Section 9 : ERREURS COURANTES
    // -----------------------------------------------------------------
    commonMistakes: [
      {
        mistake: {
          fr: "Confondre Ar-Rahman et Ar-Rahim comme de simples synonymes.",
          en: "Confusing Ar-Rahman and Ar-Rahim as mere synonyms."
        },
        correction: {
          fr: "Ar-Rahman désigne la miséricorde universelle englobant toute la création dans le bas monde (attribut d'Essence), tandis qu'Ar-Rahim désigne la miséricorde spéciale réservée aux croyants dans l'au-delà (attribut d'acte).",
          en: "Ar-Rahman denotes the universal mercy encompassing all creation in this world (attribute of Essence), while Ar-Rahim denotes the special mercy reserved for believers in the Hereafter (attribute of act)."
        },
        source: "Ibn al-Qayyim, Bada'i al-Fawa'id"
      },
      {
        mistake: {
          fr: "Penser qu'Ar-Rahman peut être attribué à une créature.",
          en: "Thinking that Ar-Rahman can be attributed to a créature."
        },
        correction: {
          fr: "Ar-Rahman est un nom exclusif à Allah. Al-Qurtubi, Az-Zajjaj et la majorite des savants affirment qu'il est interdit de nommer quiconque « Rahman » sans le prefixe « Abd » (serviteur).",
          en: "Ar-Rahman is a name exclusive to Allah. Al-Qurtubi, Az-Zajjaj and the majority of scholars state that it is forbidden to name anyone 'Rahman' without the prefix 'Abd' (servant)."
        },
        source: "Al-Qurtubi, Al-Asna ; Az-Zajjaj, Tafsir Asma' Allah"
      },
      {
        mistake: {
          fr: "Interpreter la miséricorde divine comme une émotion semblable à la compassion humaine.",
          en: "Interpreting divine mercy as an émotion similar to human compassion."
        },
        correction: {
          fr: "Selon les Ash'arites et les Maturidites, la miséricorde divine est une volonté de bienfaisance (irada al-ihsan), non un état émotionnel. Selon les Atharites, c'est un attribut reel qui sied à la majesté divine sans ressembler aux créatures.",
          en: "According to the Ash'arites and Maturidites, divine mercy is a will to do good (irada al-ihsan), not an emotional state. According to the Atharis, it is a real attribute befitting divine majesty without resembling creatures."
        },
        source: "Al-Ghazali, Al-Maqsad al-Asna ; Ibn Taymiyyah, Majmu' al-Fatawa"
      }
    ],

    // -----------------------------------------------------------------
    //  META
    // -----------------------------------------------------------------
    _meta: {
      version: "2.0",
      lastUpdated: "2026-02-26",
      completeness: "full",
      verified: false
    }
  }

};

// =====================================================================
//  IIFE : Fusion V2 dans ASMA_UL_HUSNA
// =====================================================================
(function enrichEncyclopediaV2() {
  if (typeof ASMA_UL_HUSNA === 'undefined') return;
  if (typeof ENCYCLOPEDIA_V2 === 'undefined') return;
  ASMA_UL_HUSNA.forEach(function(name) {
    if (ENCYCLOPEDIA_V2[name.id]) {
      name.encyclopediaV2 = ENCYCLOPEDIA_V2[name.id];
    }
  });
})();
