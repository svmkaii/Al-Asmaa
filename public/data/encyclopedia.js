/**
 * Al-Asmaa — Encyclopedie enrichie des 99 Noms d'Allah
 * Sources verifiees — fevrier 2026
 *
 * Savants de reference :
 * Abu Hanifa (m. 150 H) — Al-Fiqh al-Akbar
 * Malik ibn Anas (m. 179 H) — Al-Muwatta
 * Ash-Shafi'i (m. 204 H) — Al-Risala
 * Al-Bukhari (m. 256 H) — Sahih al-Bukhari
 * Muslim (m. 261 H) — Sahih Muslim
 * An-Nawawi (m. 676 H) — Riyad al-Salihin / Sharh Sahih Muslim
 * Al-Qurtubi (m. 671 H) — Tafsir al-Qurtubi
 * Ibn Kathir (m. 774 H) — Tafsir Ibn Kathir
 *
 * Quran : quran.com | Hadith : sunnah.com
 */

const SCHOLARLY_SOURCES = {
 // === 8 savants principaux ===
 abu_hanifa: {
 author: "Abu Hanifa al-Nu'man (m. 150 H / 767)",
 title: "Al-Fiqh al-Akbar",
 citation: "Al-Fiqh al-Akbar, traite fondateur de la croyance islamique, par l'imam Abu Hanifa.",
 links: [
 { label: "Al-Fiqh al-Akbar — traduction anglaise (Archive.org)", url: "https://archive.org/details/al-fiqh-al-akbar", lang: "en" },
 { label: "La croyance de l'imam Abu Hanifa — Islamhouse (PDF)", url: "https://d1.islamhouse.com/data/fr/ih_articles/single/fr-aqeedah-tahawiyyah.pdf", lang: "fr" }
 ]
 },
 malik: {
 author: "Malik ibn Anas (m. 179 H / 795)",
 title: "Al-Muwatta",
 citation: "Al-Muwatta, premier recueil de hadith et de fiqh systematique, par l'imam Malik ibn Anas.",
 links: [
 { label: "Al-Muwatta — collection complete (Sunnah.com)", url: "https://sunnah.com/malik", lang: "en" },
 { label: "Al-Muwatta de l'imam Malik — Islamhouse (PDF)", url: "https://d1.islamhouse.com/data/fr/ih_books/single2/fr_Al_Mouwattaa.pdf", lang: "fr" }
 ]
 },
 shafii_imam: {
 author: "Muhammad ibn Idris Ash-Shafi'i (m. 204 H / 820)",
 title: "Al-Risala",
 citation: "Al-Risala, traite fondateur des usul al-fiqh (principes de jurisprudence), par l'imam Ash-Shafi'i.",
 links: [
 { label: "Al-Risala — traduction Majid Khadduri (Archive.org)", url: "https://archive.org/details/imam-shafi-treatise-on-the-foundations-of-islamic-jurisprudence", lang: "en" },
 { label: "Biographie et oeuvre de l'imam Ash-Shafi'i — Islamhouse", url: "https://d1.islamhouse.com/data/fr/ih_articles/single/fr-biographie-imam-chafii.pdf", lang: "fr" }
 ]
 },
 bukhari: {
 author: "Muhammad ibn Isma'il Al-Bukhari (m. 256 H / 870)",
 title: "Sahih al-Bukhari",
 citation: "Sahih al-Bukhari, le recueil de hadiths le plus authentique selon le consensus des savants, par l'imam Al-Bukhari.",
 links: [
 { label: "Sahih al-Bukhari — collection complete (Sunnah.com)", url: "https://sunnah.com/bukhari", lang: "en" },
 { label: "Sahih al-Bukhari — traduction francaise (Archive.org)", url: "https://archive.org/details/sahih-al-bukhari-en-francais", lang: "fr" }
 ]
 },
 muslim: {
 author: "Muslim ibn al-Hajjaj (m. 261 H / 875)",
 title: "Sahih Muslim",
 citation: "Sahih Muslim, second recueil de hadiths le plus authentique, par l'imam Muslim.",
 links: [
 { label: "Sahih Muslim — collection complete (Sunnah.com)", url: "https://sunnah.com/muslim", lang: "en" },
 { label: "Sahih Muslim — traduction francaise (Archive.org)", url: "https://archive.org/details/sahih-muslim-en-francais", lang: "fr" }
 ]
 },
 nawawi: {
 author: "Yahya ibn Sharaf An-Nawawi (m. 676 H / 1277)",
 title: "Riyad al-Salihin / Sharh Sahih Muslim",
 citation: "Riyad al-Salihin (Les Jardins des Vertueux) et Sharh Sahih Muslim, oeuvres majeures de l'imam An-Nawawi.",
 links: [
 { label: "Riyad al-Salihin — collection complete (Sunnah.com)", url: "https://sunnah.com/riyadussalihin", lang: "en" },
 { label: "Les Jardins des Vertueux — traduction francaise (Archive.org)", url: "https://archive.org/details/riyad-es-salihin-les-jardins-des-vertueux", lang: "fr" }
 ]
 },
 qurtubi: {
 author: "Abu Abdillah Al-Qurtubi (m. 671 H / 1273)",
 title: "Al-Jami' li-Ahkam al-Quran (Tafsir al-Qurtubi)",
 citation: "Al-Jami' li-Ahkam al-Quran, tafsir encyclopedique de reference, par l'imam Al-Qurtubi.",
 links: [
 { label: "Tafsir Al-Qurtubi — Quran.com", url: "https://quran.com/en/1:1/tafsirs/en-tafisr-al-qurtubi", lang: "en" },
 { label: "Les 99 plus beaux Noms d'Allah — IslamWeb", url: "https://www.islamweb.net/fr/article/164167/Les-99-plus-beaux-Noms-dAllah", lang: "fr" }
 ]
 },
 ibn_kathir: {
 author: "Isma'il ibn Umar Ibn Kathir (m. 774 H / 1373)",
 title: "Tafsir al-Quran al-Azim (Tafsir Ibn Kathir)",
 citation: "Tafsir Ibn Kathir, exegese coranique de reference par l'imam Ibn Kathir.",
 links: [
 { label: "Tafsir Ibn Kathir — Quran.com", url: "https://quran.com/en/1:1/tafsirs/en-tafsir-ibn-kathir", lang: "en" },
 { label: "Tafsir Ibn Kathir complet — traduction francaise (Archive.org)", url: "https://archive.org/details/tafsir-ibn-kathir-francais", lang: "fr" }
 ]
 },
 ghazali_maqsad: {
 author: "Abu Hamid Al-Ghazali (m. 505 H / 1111)",
 title: "Al-Maqsad al-Asna fi Sharh Asma' Allah al-Husna",
 citation: "The Ninety-Nine Beautiful Names of God, translated by D. Burrell and N. Daher, Islamic Texts Society.",
 links: [
 { label: "The Ninety-Nine Beautiful Names of God (Archive.org)", url: "https://archive.org/details/al-ghazali-the-ninety-nine-beautiful-names-of-god", lang: "en" },
 { label: "Les 99 Noms d'Allah — Islamhouse (PDF)", url: "https://d1.islamhouse.com/data/fr/ih_articles/single/fr-Islamhouse_les_99_Noms_d_AllahH.pdf", lang: "fr" }
 ]
 },
 qurtubi_asna: {
 author: "Abu Abdillah Al-Qurtubi (m. 671 H / 1273)",
 title: "Al-Asna fi Sharh Asma' Allah al-Husna",
 citation: "Al-Asna fi Sharh Asma' Allah al-Husna, exegese sur les Noms divins, par l'imam Al-Qurtubi.",
 links: [
 { label: "Les 99 plus beaux Noms d'Allah — IslamWeb", url: "https://www.islamweb.net/fr/article/164167/Les-99-plus-beaux-Noms-dAllah", lang: "fr" },
 { label: "Tafsir Al-Qurtubi — Quran.com", url: "https://quran.com/en/1:1/tafsirs/en-tafisr-al-qurtubi", lang: "en" }
 ]
 },
 qurtubi_tafsir: {
 author: "Abu Abdillah Al-Qurtubi (m. 671 H / 1273)",
 title: "Al-Jami' li-Ahkam al-Quran (Tafsir al-Qurtubi)",
 citation: "Al-Jami' li-Ahkam al-Quran, tafsir encyclopedique, par l'imam Al-Qurtubi.",
 links: [
 { label: "Tafsir Al-Qurtubi — Quran.com", url: "https://quran.com/en/1:1/tafsirs/en-tafisr-al-qurtubi", lang: "en" },
 { label: "Les 99 plus beaux Noms d'Allah — IslamWeb", url: "https://www.islamweb.net/fr/article/164167/Les-99-plus-beaux-Noms-dAllah", lang: "fr" }
 ]
 },
 ibn_qayyim: {
 author: "Ibn al-Qayyim al-Jawziyya (m. 751 H / 1350)",
 title: "Bada'i al-Fawa'id",
 citation: "Bada'i al-Fawa'id, par Ibn al-Qayyim.",
 links: [
 { label: "Oeuvres d'Ibn al-Qayyim — Kalamullah", url: "https://kalamullah.com/ibn-qayyim.html", lang: "en" },
 { label: "Livre des Noms et Attributs d'Allah (Archive.org)", url: "https://archive.org/details/LivreDesNomsEtAttributsDallahKitabAssmaAllahAlHoussna", lang: "fr" }
 ]
 },
 ibn_taymiyyah: {
 author: "Ibn Taymiyyah (m. 728 H / 1328)",
 title: "Majmu' al-Fatawa",
 citation: "Majmu' al-Fatawa, par Cheikh al-Islam Ibn Taymiyyah.",
 links: [
 { label: "Explication des plus beaux Noms d'Allah (Archive.org)", url: "https://archive.org/details/explication-des-plus-beaux-noms-d-allah-abd-ar-rahman-ibn-nasir-as-saadi", lang: "fr" }
 ]
 },
 zajjaj: {
 author: "Abu Ishaq Az-Zajjaj (m. 311 H / 923)",
 title: "Tafsir Asma' Allah al-Husna",
 citation: "Tafsir Asma' Allah al-Husna, analyse linguistique des Noms divins, par Az-Zajjaj.",
 links: [
 { label: "Comprendre les Noms d'Allah (Archive.org)", url: "https://archive.org/details/abdarazzaq-ibn-abdalmohsin-al-badr-comprendre-les-noms-d-allah", lang: "fr" }
 ]
 },
 bayhaqi_asma: {
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

const ENCYCLOPEDIA_DATA = {
 1: {
 detailedMeaning: "Ar-Rahman derive de la racine r-h-m (la misericorde) selon le schema morphologique fa'lan, qui exprime l'intensite maximale et la plenitude de l'attribut. Il designe Celui dont la misericorde englobe toute la creation sans distinction, croyants et non-croyants, dans ce bas monde. Ce nom est exclusif a Allah et ne peut etre attribue a aucune creature. Linguistiquement, la forme fa'lan indique une misericorde debordante et universelle. Ar-Rahman est Celui qui veut le bien pour toutes les creatures, leur accorde l'existence et les guide vers ce qui leur est profitable.",
 quranVerses: [
 { surah: "Al-Fatiha", surahNumber: 1, ayah: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "Au nom d'Allah, le Tout Misericordieux, le Tres Misericordieux.", link: "https://quran.com/fr/1:1" },
 { surah: "Ta-Ha", surahNumber: 20, ayah: 5, arabic: "الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ", translation: "Le Tout Misericordieux S'est etabli sur le Trone.", link: "https://quran.com/fr/20:5" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Fatiha 1:1", url: "https://quran.com/fr/1:1" }
 ]
 },
 2: {
 detailedMeaning: "Ar-Rahim derive de la meme racine r-h-m que Ar-Rahman, mais selon le schema fa'il, qui designe un attribut constant et permanent. Il indique la misericorde speciale qu'Allah reserve aux croyants dans l'au-dela, comme l'atteste le verset : Il est Misericordieux envers les croyants (33:43). Si Ar-Rahman exprime la volonte universelle de bien, Ar-Rahim en est la realisation pour ceux qui acceptent la guidance divine. Ar-Rahman decrit l'attribut de misericorde inherent a l'essence divine, tandis qu'Ar-Rahim decrit l'acte de misericorde envers les croyants.",
 quranVerses: [
 { surah: "Al-Fatiha", surahNumber: 1, ayah: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "Au nom d'Allah, le Tout Misericordieux, le Tres Misericordieux.", link: "https://quran.com/fr/1:1" },
 { surah: "Al-Ahzab", surahNumber: 33, ayah: 43, arabic: "وَكَانَ بِالْمُؤْمِنِينَ رَحِيمًا", translation: "Et Il est Misericordieux envers les croyants.", link: "https://quran.com/fr/33:43" }
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
 detailedMeaning: "Al-Malik derive de la racine m-l-k qui implique la possession absolue et le pouvoir de commandement (amr) et d'interdiction (nahy). Il designe le Roi absolu dont la souverainete est parfaite et complete, ne dependant d'aucun conseiller ni assistant. Le vrai Roi est Celui qui n'a besoin de rien dans Son essence et dont toute chose a besoin, car toute existence est dans Son royaume. Linguistiquement, la royaute (mulk) implique linguistiquement la capacite de disposer de toute chose selon Sa volonte. Il possede le pouvoir absolu d'ordonner et d'interdire, de recompenser et de punir.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ", translation: "C'est Lui Allah, en dehors de qui il n'y a pas de divinite, le Souverain, le Saint, la Paix.", link: "https://quran.com/fr/59:23" },
 { surah: "Al-Mu'minun", surahNumber: 23, ayah: 116, arabic: "فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ", translation: "Exalte soit Allah, le vrai Souverain.", link: "https://quran.com/fr/23:116" }
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
 detailedMeaning: "Al-Quddus derive de la racine q-d-s (la purete, la saintete) selon le schema fu''us, forme d'intensite exprimant la purete totale et absolue. Il designe Celui qui est exempt de tout defaut, de toute imperfection et de toute ressemblance avec les creatures. Al-Quddus est Celui qui est au-dela de tout ce que les sens peuvent percevoir, de tout ce que l'imagination peut representer et de tout ce que la pensee peut concevoir. Les anges Le glorifient constamment en disant Subbuh, Quddus, Seigneur des anges et de l'Esprit, comme rapporte dans Sahih Muslim (487).",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ", translation: "C'est Lui Allah, en dehors de qui il n'y a pas de divinite, le Souverain, le Saint.", link: "https://quran.com/fr/59:23" },
 { surah: "Al-Jumu'a", surahNumber: 62, ayah: 1, arabic: "يُسَبِّحُ لِلَّهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ الْمَلِكِ الْقُدُّوسِ", translation: "Ce qui est dans les cieux et sur la terre glorifie Allah, le Souverain, le Saint.", link: "https://quran.com/fr/62:1" }
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
 detailedMeaning: "As-Salam derive de la racine s-l-m qui porte les sens de paix, d'integrite et d'immunite contre tout defaut. As-Salam est Celui dont l'essence est exempte de tout defaut, dont les attributs sont exempts de toute imperfection, et dont les actes sont exempts de tout mal. Il salue Ses serviteurs au Paradis, comme l'indique le verset : Paix, parole d'un Seigneur Misericordieux (36:58). Le Prophete (paix sur lui) disait apres chaque priere : Allahumma anta As-Salam wa minka as-salam, confirmant qu'Il est la source de toute paix et que toute paix emane de Lui.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ", translation: "Le Souverain, le Saint, la Paix, le Garant de la foi, le Protecteur.", link: "https://quran.com/fr/59:23" },
 { surah: "Ya-Sin", surahNumber: 36, ayah: 58, arabic: "سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ", translation: "Paix ! Parole d'un Seigneur Tres Misericordieux.", link: "https://quran.com/fr/36:58" }
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
 detailedMeaning: "Al-Mu'min derive de la racine hamza-mim-nun (a-m-n) qui exprime la securite et la confirmation. Linguistiquement, il porte deux sens linguistiques : Celui qui confirme (musaddiq) Ses messagers par les miracles et Ses propres paroles, et Celui qui accorde la securite (mu'ammin) a Ses creatures contre l'injustice. Il confirme Ses promesses et protege Ses serviteurs du chatiment quand ils Lui obeissent. Al-Mu'min est Celui de qui emane la securite et la tranquillite, qui met Ses serviteurs a l'abri de toute oppression et temoigne de Sa propre unicite.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ", translation: "La Paix, le Garant de la foi, le Protecteur.", link: "https://quran.com/fr/59:23" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" }
 ]
 },
 7: {
 detailedMeaning: "Al-Muhaymin derive selon certains grammairiens de haymana (veiller, proteger), et selon d'autres de la racine a-m-n avec ajout du ha', signifiant le Gardien fidele. Il designe Celui qui veille sur toute Sa creation, qui la protege, la preserve et en est le Temoin. Al-Muhaymin est Celui qui reunit la science, la preservation et la domination : Il connait tout, garde tout et controle tout de maniere absolue. Il englobe les sens de temoin (shahid), gardien (hafiz) et dominant (musaytiir) sur toute la creation.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ", translation: "Le Garant de la foi, le Protecteur Supreme, le Tout Puissant, le Contraignant.", link: "https://quran.com/fr/59:23" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" }
 ]
 },
 8: {
 detailedMeaning: "Al-'Aziz derive de la racine 'a-z-z qui comporte trois sens linguistiques : la rarete absolue (al-ladhi la nazira lahu), car Il est sans egal ; l'invincibilite (al-ladhi la yughlab), car rien ne peut Le vaincre ; et la puissance (al-qawiy), car Il domine toute chose. La forme fa'il indique un attribut permanent et inherent a Son essence. Il est rare dans Son essence, Ses attributs et Ses actes, sans aucun semblable, et Sa puissance est inaccessible a toute creature.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ", translation: "Le Tout Puissant, le Contraignant, le Majestueux.", link: "https://quran.com/fr/59:23" },
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 6, arabic: "هُوَ الَّذِي يُصَوِّرُكُمْ فِي الْأَرْحَامِ كَيْفَ يَشَاءُ لَا إِلَٰهَ إِلَّا هُوَ الْعَزِيزُ الْحَكِيمُ", translation: "C'est Lui qui vous donne forme dans les matrices comme Il veut. Il n'y a de divinite que Lui, le Tout Puissant, le Sage.", link: "https://quran.com/fr/3:6" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" }
 ]
 },
 9: {
 detailedMeaning: "Al-Jabbar derive de la racine j-b-r selon le schema fa''al, forme d'intensite. Ce nom comporte trois sens : Celui qui contraint Ses creatures selon Sa volonte (al-jabr bi-ma'na al-ijbar), Celui qui repare et restaure l'etat de Ses creatures (jabr al-kasr), et le Tres Haut au-dessus de toute chose (al-'ali). Il est Celui dont la volonte s'accomplit sans resistance et qui, par Sa bonte, repare les coeurs brises des opprimes. Linguistiquement, ces deux sens fondamentaux — la contrainte irresistible et la reparation bienveillante — sont etablis.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ", translation: "Le Tout Puissant, le Contraignant, le Majestueux.", link: "https://quran.com/fr/59:23" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" }
 ]
 },
 10: {
 detailedMeaning: "Al-Mutakabbir derive de la racine k-b-r selon le schema mutafa''il. Il designe Celui a qui appartient exclusivement la grandeur supreme (al-kibriya'), au-dessus de tout attribut des creatures. Linguistiquement, contrairement aux creatures qui s'attribuent faussement la grandeur, Allah la possede legitimement. La kibriya' est un attribut exclusif d'Allah, comme l'atteste le hadith : La grandeur est Mon manteau et la majeste est Mon pagne ; quiconque Me dispute l'un des deux, Je le jetterai en Enfer (Muslim 2620). Ce nom rappelle que toute pretention a la grandeur de la part des creatures est illegitime.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ سُبْحَانَ اللَّهِ عَمَّا يُشْرِكُونَ", translation: "Le Tout Puissant, le Contraignant, le Majestueux. Gloire a Allah, au-dessus de ce qu'ils Lui associent.", link: "https://quran.com/fr/59:23" }
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
 detailedMeaning: "Al-Khaliq derive de la racine kh-l-q qui signifie creer et estimer (taqdir). Linguistiquement, le khalq implique la planification et la determination (taqdir) avant la mise en existence. Trois etapes de la creation divine sont distinguees : Al-Khaliq est le planificateur (muqaddir) qui determine les choses avant de les creer, Al-Bari' est celui qui les fait exister, et Al-Musawwir est celui qui leur donne forme. Il a fait exister les choses apres leur inexistence, les tirant du neant selon Son decret eternel.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 24, arabic: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ", translation: "C'est Lui Allah, le Createur, le Producteur, le Faconneur.", link: "https://quran.com/fr/59:24" },
 { surah: "Ar-Ra'd", surahNumber: 13, ayah: 16, arabic: "قُلِ اللَّهُ خَالِقُ كُلِّ شَيْءٍ", translation: "Dis : Allah est le Createur de toute chose.", link: "https://quran.com/fr/13:16" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hashr 59:24", url: "https://quran.com/fr/59:24" }
 ]
 },
 12: {
 detailedMeaning: "Al-Bari' derive de la racine b-r-' qui signifie produire, faire exister et distinguer. Il est le producteur (bari') en tant qu'Il initie l'existence des etres, apres que Al-Khaliq les a planifies et avant que Al-Musawwir ne leur donne forme. Il produit les creatures et les fait passer du neant a l'existence en les distinguant les unes des autres par des caracteristiques propres. Linguistiquement, la racine b-r-' porte aussi le sens d'etre exempt de defaut, ce qui indique que Sa creation est produite sans imperfection dans l'acte createur.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 24, arabic: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ", translation: "C'est Lui Allah, le Createur, le Producteur, le Faconneur.", link: "https://quran.com/fr/59:24" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hashr 59:24", url: "https://quran.com/fr/59:24" }
 ]
 },
 13: {
 detailedMeaning: "Al-Musawwir derive de la racine s-w-r qui signifie donner forme et apparence. Il designe Celui qui faconne chaque creature et lui confere son image et ses traits distinctifs. Il est le faconneur (musawwir) en tant qu'Il arrange les formes des etres de la meilleure maniere, comme l'artisan qui donne la forme finale apres la planification et la construction. Le verset : Dans quelque forme qu'Il a voulue, Il t'a compose (82:8) illustre cette attribution. Aucun visage ne ressemble a un autre parmi les milliards de creatures, ce qui temoigne de l'infinite de Sa puissance creatrice.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 24, arabic: "الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ", translation: "Le Createur, le Producteur, le Faconneur. A Lui les plus beaux noms.", link: "https://quran.com/fr/59:24" },
 { surah: "Al-Infitar", surahNumber: 82, ayah: 8, arabic: "فِي أَيِّ صُورَةٍ مَّا شَاءَ رَكَّبَكَ", translation: "Dans quelque forme qu'Il a voulue, Il t'a compose.", link: "https://quran.com/fr/82:8" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hashr 59:24", url: "https://quran.com/fr/59:24" }
 ]
 },
 14: {
 detailedMeaning: "Al-Ghaffar derive de la racine gh-f-r (couvrir, cacher) selon le schema fa''al, forme intensive qui indique la repetition et l'abondance du pardon. Linguistiquement, le ghafr signifie linguistiquement couvrir et dissimuler, indiquant qu'Allah couvre les peches de Ses serviteurs sans les exposer. Il pardonne encore et encore a chaque repentir sincere, peu importe le nombre de retours au peche. Ce nom se distingue d'Al-Ghafur : Al-Ghaffar met l'accent sur la frequence et la repetition du pardon, tandis qu'Al-Ghafur souligne son etendue et sa completude.",
 quranVerses: [
 { surah: "Nuh", surahNumber: 71, ayah: 10, arabic: "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا", translation: "J'ai dit : Implorez le pardon de votre Seigneur, car Il est Grand Pardonneur.", link: "https://quran.com/fr/71:10" },
 { surah: "Az-Zumar", surahNumber: 39, ayah: 53, arabic: "إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا", translation: "Certes, Allah pardonne tous les peches.", link: "https://quran.com/fr/39:53" }
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
 detailedMeaning: "Al-Qahhar derive de la racine q-h-r (dominer, soumettre) selon le schema fa''al, forme intensive exprimant la domination absolue et irresistible. Linguistiquement, il designe la soumission totale de toute la creation a Sa puissance, sans qu'aucune resistance ne soit possible. Il brise le dos des tyrans et des rebelles, et que toute la creation, rois et sujets, est soumise a Sa majeste. Ce nom apparait souvent couple avec Al-Wahid dans le Coran (13:16 ; 14:48), soulignant qu'il n'y a qu'un seul Dominateur et que toute domination Lui appartient exclusivement.",
 quranVerses: [
 { surah: "Ar-Ra'd", surahNumber: 13, ayah: 16, arabic: "قُلِ اللَّهُ خَالِقُ كُلِّ شَيْءٍ وَهُوَ الْوَاحِدُ الْقَهَّارُ", translation: "Dis : Allah est le Createur de toute chose et Il est l'Unique, le Dominateur Supreme.", link: "https://quran.com/fr/13:16" },
 { surah: "Ibrahim", surahNumber: 14, ayah: 48, arabic: "يَوْمَ تُبَدَّلُ الْأَرْضُ غَيْرَ الْأَرْضِ وَالسَّمَاوَاتُ وَبَرَزُوا لِلَّهِ الْوَاحِدِ الْقَهَّارِ", translation: "Le jour ou la terre sera remplacee par une autre et les cieux aussi, et ils comparaitront devant Allah, l'Unique, le Dominateur Supreme.", link: "https://quran.com/fr/14:48" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Ra'd 13:16", url: "https://quran.com/fr/13:16" }
 ]
 },
 16: {
 detailedMeaning: "Al-Wahhab derive de la racine w-h-b (donner) selon le schema fa''al, forme intensive indiquant la multiplicite et la continuite des dons. Le vrai don est celui qui est accorde sans contrepartie, sans interet et sans attendre de recompense ; seul Allah donne de cette maniere absolue. Linguistiquement, cette forme intensive indique des dons incessants, varies et inconditionnels : la vie, la sante, la subsistance, la foi et la sagesse. Le verset coranique Seigneur, accorde-nous une misericorde de Ta part, c'est Toi le Donateur Supreme (3:8) illustre cette invocation par ce nom.",
 quranVerses: [
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 8, arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ", translation: "Seigneur, ne fais pas devier nos coeurs apres que Tu nous aies guides, et accorde-nous une misericorde de Ta part. C'est Toi le Donateur Supreme.", link: "https://quran.com/fr/3:8" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ali 'Imran 3:8", url: "https://quran.com/fr/3:8" }
 ]
 },
 17: {
 detailedMeaning: "Ar-Razzaq derive de la racine r-z-q (pourvoir, accorder la subsistance) selon le schema fa''al, forme intensive qui indique une subsistance complete et incessante. Il cree la subsistance (rizq) et la fait parvenir a chaque creature, qu'elle soit croyante ou non. Les savants distinguent deux types de rizq : la subsistance materielle (nourriture, boisson, sante) qui nourrit le corps, et la subsistance spirituelle (science, foi, guidance) qui nourrit l'ame. Linguistiquement, le rizq englobe tout ce dont le corps et l'ame ont besoin, et que nul etre vivant n'est oublie, comme l'atteste le verset : Il n'y a point de creature sur terre dont la subsistance n'incombe a Allah (11:6).",
 quranVerses: [
 { surah: "Adh-Dhariyat", surahNumber: 51, ayah: 58, arabic: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ", translation: "C'est Allah qui est le Pourvoyeur, le Detenteur de la force, l'Inebranlable.", link: "https://quran.com/fr/51:58" }
 ],
 hadithReferences: [
 { collection: "Sahih Muslim", number: "2713", text: "O Allah, Tu es le Premier et rien n'est avant Toi, Tu es le Dernier et rien n'est apres Toi, Tu es l'Apparent et rien n'est au-dessus de Toi, Tu es le Cache et rien n'est en-dessous de Toi.", link: "https://sunnah.com/muslim:2713" }
 ],
 sources: [
 { label: "Quran.com - Adh-Dhariyat 51:58", url: "https://quran.com/fr/51:58" }
 ]
 },
 18: {
 detailedMeaning: "Al-Fattah derive de la racine f-t-h (ouvrir, juger) selon le schema fa''al, forme intensive. Ce nom comporte deux sens linguistiques principaux : Celui qui ouvre les portes fermees (fath) de la misericorde, de la subsistance, de la connaissance et de la victoire, et Celui qui juge entre les gens avec verite (fath bi-ma'na al-hukm). Ces deux sens sont confirmes : Il ouvre ce qui est ferme et tranche entre Ses serviteurs avec equite. Le verset Notre Seigneur nous reunira puis Il jugera entre nous en verite, Il est Al-Fattah, l'Omniscient (34:26) illustre ce double sens de jugement et d'ouverture.",
 quranVerses: [
 { surah: "Saba", surahNumber: 34, ayah: 26, arabic: "قُلْ يَجْمَعُ بَيْنَنَا رَبُّنَا ثُمَّ يَفْتَحُ بَيْنَنَا بِالْحَقِّ وَهُوَ الْفَتَّاحُ الْعَلِيمُ", translation: "Dis : Notre Seigneur nous reunira puis Il jugera entre nous en verite. Il est le Juge Supreme, l'Omniscient.", link: "https://quran.com/fr/34:26" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Saba 34:26", url: "https://quran.com/fr/34:26" }
 ]
 },
 19: {
 detailedMeaning: "Al-'Alim derive de la racine 'a-l-m (savoir) et designe Celui dont la science est parfaite, eternelle et englobante. Sa science n'est pas derivee des choses connues, mais que les choses sont connues par Sa science ; elle n'augmente pas par l'apprentissage et ne diminue pas par l'oubli. Linguistiquement, c'est un adjectif qualificatif indiquant une science qui ne connait ni debut ni accroissement et qui precede toute existence. Sa science englobe le passe, le present, le futur, le visible et l'invisible, comme l'atteste le verset : Et Il est Omniscient de toute chose (2:29), repete sous diverses formes plus de 150 fois dans le Coran.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 29, arabic: "وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ", translation: "Et Il est Omniscient de toute chose.", link: "https://quran.com/fr/2:29" },
 { surah: "Al-Hujurat", surahNumber: 49, ayah: 16, arabic: "وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ", translation: "Et Allah est Omniscient de toute chose.", link: "https://quran.com/fr/49:16" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:29", url: "https://quran.com/fr/2:29" }
 ]
 },
 20: {
 detailedMeaning: "Al-Qabid derive de la racine q-b-d (saisir, resserrer), designant Celui qui retient et resserre, que ce soit la subsistance, les coeurs ou les ames au moment de la mort. Al-Qabid est Celui qui resserre les coeurs par la crainte et les provisions par Sa sagesse, et que ce resserrement est une epreuve qui mene a l'elevation. Le resserrement et l'expansion sont entre les mains d'Allah seul, et que le croyant doit patienter dans le resserrement, comme l'affirme le verset : Allah restreint et etend, et c'est a Lui que vous serez ramenes (2:245). Ce nom se comprend en pair avec Al-Basit.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 245, arabic: "وَاللَّهُ يَقْبِضُ وَيَبْسُطُ وَإِلَيْهِ تُرْجَعُونَ", translation: "Allah restreint et etend, et c'est a Lui que vous serez ramenes.", link: "https://quran.com/fr/2:245" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:245", url: "https://quran.com/fr/2:245" }
 ]
 },
 21: {
 detailedMeaning: "Al-Basit derive de la racine b-s-t (etendre, deployer), et constitue l'oppose complementaire d'Al-Qabid. Linguistiquement, ce terme designe Celui qui deploie Ses bienfaits et elargit les coeurs. Al-Basit est Celui qui etend la subsistance a qui Il veut et elargit les coeurs par la connaissance et la lumiere de la foi. Le serviteur reconnait que toute expansion vient d'Allah, qu'elle soit materielle ou spirituelle. Le verset : Allah restreint et etend, et c'est a Lui que vous serez ramenes (2:245) confirme que l'extension comme la restriction relevent de Sa seule volonte et sagesse parfaite.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 245, arabic: "وَاللَّهُ يَقْبِضُ وَيَبْسُطُ وَإِلَيْهِ تُرْجَعُونَ", translation: "Allah restreint et etend, et c'est a Lui que vous serez ramenes.", link: "https://quran.com/fr/2:245" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:245", url: "https://quran.com/fr/2:245" }
 ]
 },
 22: {
 detailedMeaning: "Al-Khafid derive de la racine kh-f-d (abaisser), designant l'action de rabaisser et d'humilier. Linguistiquement, ce nom indique qu'Allah abaisse les orgueilleux et les rebelles selon Sa volonte souveraine. Al-Khafid est Celui qui abaisse les incroyants par le malheur et les tyrans par la destruction, humiliant quiconque se rebelle. Le croyant tire lecon de ce nom en s'humiliant devant Allah et en evitant l'arrogance, car c'est elle la cause de l'abaissement. Le verset : Elle abaissera certains et en elevera d'autres (56:3) montre que ce nom se comprend en pair avec Ar-Rafi', illustrant la maitrise d'Allah sur le rang de Ses creatures.",
 quranVerses: [
 { surah: "Al-Waqi'a", surahNumber: 56, ayah: 3, arabic: "خَافِضَةٌ رَّافِعَةٌ", translation: "Elle abaissera certains et en elevera d'autres.", link: "https://quran.com/fr/56:3" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Waqi'a 56:3", url: "https://quran.com/fr/56:3" }
 ]
 },
 23: {
 detailedMeaning: "Ar-Rafi' derive de la racine r-f-' (elever), designant l'elevation en rang et en dignite dans ce monde et dans l'au-dela. Linguistiquement, cette elevation concerne le statut terrestre comme la station eschatologique. Ar-Rafi' eleve Ses allies par la proximite et l'obeissance, et abaisse Ses ennemis par l'eloignement. L'elevation veritable vient d'Allah seul et que le croyant la recherche par la foi et la science. Le verset : Allah elevera ceux d'entre vous qui croient et ceux qui auront recu la science, de plusieurs degres (58:11) confirme que la foi et le savoir constituent la plus haute forme d'honneur.",
 quranVerses: [
 { surah: "Al-An'am", surahNumber: 6, ayah: 83, arabic: "نَرْفَعُ دَرَجَاتٍ مَّن نَّشَاءُ", translation: "Nous elevons en rang qui Nous voulons.", link: "https://quran.com/fr/6:83" },
 { surah: "Al-Mujadala", surahNumber: 58, ayah: 11, arabic: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ", translation: "Allah elevera ceux d'entre vous qui croient et ceux qui auront recu la science, de plusieurs degres.", link: "https://quran.com/fr/58:11" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Mujadala 58:11", url: "https://quran.com/fr/58:11" }
 ]
 },
 24: {
 detailedMeaning: "Al-Mu'izz derive de la racine 'a-z-z (rendre puissant, honorer), designant Celui qui confere la 'izza, c'est-a-dire la puissance et l'honneur veritables. Linguistiquement, ce terme implique l'octroi d'une dignite que nul ne peut retirer sans la permission divine. La vraie 'izza est celle de la foi et de la piete, non celle des richesses et du pouvoir mondain. Le croyant cherche la dignite par l'obeissance a Allah, car l'honneur veritable est dans la soumission au Tout Puissant. Le verset : Tu honores qui Tu veux et Tu humilies qui Tu veux (3:26) montre que toute puissance et tout honneur relevent exclusivement de la volonte divine.",
 quranVerses: [
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 26, arabic: "قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَن تَشَاءُ وَتَنزِعُ الْمُلْكَ مِمَّن تَشَاءُ وَتُعِزُّ مَن تَشَاءُ وَتُذِلُّ مَن تَشَاءُ", translation: "Dis : O Allah, Maitre de l'autorite absolue. Tu donnes l'autorite a qui Tu veux, et Tu arraches l'autorite a qui Tu veux ; Tu honores qui Tu veux et Tu humilies qui Tu veux.", link: "https://quran.com/fr/3:26" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ali 'Imran 3:26", url: "https://quran.com/fr/3:26" }
 ]
 },
 25: {
 detailedMeaning: "Al-Mudhill derive de la racine dh-l-l (humilier, avilir), et constitue l'oppose d'Al-Mu'izz. Linguistiquement, le dhull designe la bassesse et l'humiliation imposee aux rebelles. Al-Mudhill abaisse par la deshonneur quiconque se rebelle contre Lui, humiliant les tyrans et les oppresseurs. L'humiliation est le chatiment de l'orgueil, et que le croyant craint ce nom en evitant la desobeissance et en se soumettant humblement. Le verset : Tu honores qui Tu veux et Tu humilies qui Tu veux, le bien est en Ta main (3:26) montre que l'abaissement comme l'elevation relevent de la sagesse et de la justice d'Allah.",
 quranVerses: [
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 26, arabic: "وَتُعِزُّ مَن تَشَاءُ وَتُذِلُّ مَن تَشَاءُ بِيَدِكَ الْخَيْرُ", translation: "Tu honores qui Tu veux et Tu humilies qui Tu veux. Le bien est en Ta main.", link: "https://quran.com/fr/3:26" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ali 'Imran 3:26", url: "https://quran.com/fr/3:26" }
 ]
 },
 26: {
 detailedMeaning: "As-Sami' derive de la racine s-m-' (entendre), constituant un attribut de perception (sifa idrak) indiquant une audition parfaite sans organe ni intermediaire. Linguistiquement, ce terme designe une audition absolue et sans limite. As-Sami' est Celui a qui aucun son n'echappe, meme le bruit de la fourmi noire sur la pierre noire dans la nuit noire. Cette audition est un attribut reel, sans ressemblance avec celle des creatures, et que le croyant qui sait qu'Allah l'entend veille a ses paroles et multiplie les invocations. Le verset : Allah a bien entendu la parole de celle qui discutait avec toi (58:1) atteste de cette audition omnipresente.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 127, arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ", translation: "Seigneur, accepte de nous. C'est Toi l'Audient, l'Omniscient.", link: "https://quran.com/fr/2:127" },
 { surah: "Al-Mujadala", surahNumber: 58, ayah: 1, arabic: "قَدْ سَمِعَ اللَّهُ قَوْلَ الَّتِي تُجَادِلُكَ فِي زَوْجِهَا", translation: "Allah a bien entendu la parole de celle qui discutait avec toi au sujet de son epoux.", link: "https://quran.com/fr/58:1" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Mujadala 58:1", url: "https://quran.com/fr/58:1" }
 ]
 },
 27: {
 detailedMeaning: "Al-Basir derive de la racine b-s-r (voir), constituant un attribut de perception indiquant une vision parfaite et penetrante englobant le visible et l'invisible sans organe. Linguistiquement, ce terme designe une vision absolue et sans voile. Al-Basir voit toute chose, jusqu'au mouvement de la fourmi noire sur le rocher noir dans l'obscurite de la nuit. Cette vision est un attribut reel, sans ressemblance avec celle des creatures, et que le serviteur qui le sait adore Allah avec excellence (ihsan). Le verset : Il est avec vous ou que vous soyez, et Allah observe parfaitement ce que vous faites (57:4) confirme cette vision omnipresente.",
 quranVerses: [
 { surah: "Al-Isra", surahNumber: 17, ayah: 1, arabic: "سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى", translation: "Gloire a Celui qui a fait voyager Son serviteur la nuit, de la Mosquee Sacree a la Mosquee la plus eloignee.", link: "https://quran.com/fr/17:1" },
 { surah: "Al-Hadid", surahNumber: 57, ayah: 4, arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ", translation: "Et Il est avec vous ou que vous soyez. Et Allah observe parfaitement ce que vous faites.", link: "https://quran.com/fr/57:4" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hadid 57:4", url: "https://quran.com/fr/57:4" }
 ]
 },
 28: {
 detailedMeaning: "Al-Hakam derive de la racine h-k-m (juger, decider), designant le juge dont la sentence est definitive et sans appel. Linguistiquement, ce terme implique un pouvoir de decision absolue que nul ne peut contester ni infirmer. Al-Hakam est Celui qui juge entre les creatures avec verite, Son jugement reposant sur une science et une justice parfaites. Le croyant se soumet a Son jugement sans rechercher d'autre legislation, car c'est Lui le Juge supreme dont la sentence est verite. Le Prophete (paix sur lui) a dit : Allah est Al-Hakam, et c'est a Lui que revient le jugement (Abu Dawud 4955), confirmant l'exclusivite de ce droit divin.",
 quranVerses: [
 { surah: "Ghafir", surahNumber: 40, ayah: 48, arabic: "إِنَّ اللَّهَ قَدْ حَكَمَ بَيْنَ الْعِبَادِ", translation: "Certes, Allah juge entre les serviteurs.", link: "https://quran.com/fr/40:48" }
 ],
 hadithReferences: [
 { collection: "Sunan Abu Dawud", number: "4955", text: "Le Prophete (paix sur lui) a dit : Allah est Al-Hakam, et c'est a Lui que revient le jugement.", link: "https://sunnah.com/abudawud:4955" }
 ],
 sources: [
 { label: "Quran.com - Ghafir 40:48", url: "https://quran.com/fr/40:48" }
 ]
 },
 29: {
 detailedMeaning: "Al-'Adl est un masdar (nom verbal) utilise comme qualificatif, derive de la racine '-d-l (etre juste). Linguistiquement, son emploi comme nom verbal renforce le sens : Il est la justice meme, non pas simplement juste. Al-'Adl est Celui dont les actes sont tous bons et sages, qui place chaque chose a sa place avec une justesse parfaite. La justice d'Allah est parfaite, qu'Il ne lese personne et que le croyant s'en remet a Sa justice sans Lui reprocher aucun de Ses decrets, meme dans l'epreuve. Le verset : Certes, Allah ne commet aucune injustice, fut-ce du poids d'un atome (4:40) atteste de cette justice absolue qui s'etend a toute la creation.",
 quranVerses: [
 { surah: "An-Nisa", surahNumber: 4, ayah: 40, arabic: "إِنَّ اللَّهَ لَا يَظْلِمُ مِثْقَالَ ذَرَّةٍ", translation: "Certes, Allah ne commet aucune injustice, fut-ce du poids d'un atome.", link: "https://quran.com/fr/4:40" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - An-Nisa 4:40", url: "https://quran.com/fr/4:40" }
 ]
 },
 30: {
 detailedMeaning: "Al-Latif derive de la racine l-t-f qui porte deux sens : la connaissance des details subtils (lutf) et la bienveillance delicate envers les creatures (talattuf). Cette double signification fait la richesse de ce nom. Al-Latif connait les subtilites de toute chose et est doux envers Ses serviteurs par des voies imperceptibles. La douceur d'Allah se manifeste dans les bienfaits subtils accordes par des voies imprevues, et que le croyant place sa confiance en Lui sachant qu'Il agit pour son bien. Le verset : Allah est Doux envers Ses serviteurs, Il pourvoit qui Il veut (42:19) confirme cette bienveillance delicate.",
 quranVerses: [
 { surah: "Al-An'am", surahNumber: 6, ayah: 103, arabic: "لَّا تُدْرِكُهُ الْأَبْصَارُ وَهُوَ يُدْرِكُ الْأَبْصَارَ وَهُوَ اللَّطِيفُ الْخَبِيرُ", translation: "Les regards ne peuvent L'atteindre, cependant qu'Il atteint tous les regards. Il est le Doux, le Parfaitement Informe.", link: "https://quran.com/fr/6:103" },
 { surah: "Ash-Shura", surahNumber: 42, ayah: 19, arabic: "اللَّهُ لَطِيفٌ بِعِبَادِهِ يَرْزُقُ مَن يَشَاءُ", translation: "Allah est Doux envers Ses serviteurs. Il pourvoit qui Il veut.", link: "https://quran.com/fr/42:19" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ash-Shura 42:19", url: "https://quran.com/fr/42:19" }
 ]
 },
 31: {
 detailedMeaning: "Al-Khabir derive de la racine kh-b-r (connaitre en profondeur), designant une connaissance qui penetre au-dela des apparences pour saisir les realites cachees. Linguistiquement, ce terme implique une science atteignant les profondeurs des choses, la ou nulle creature ne peut acceder. Al-Khabir est Celui dont la science atteint les mysteres des consciences et les secrets des coeurs. Le croyant qui realise qu'Allah connait ses pensees intimes est pousse a purifier son coeur. Le verset : Ne connait-Il pas ce qu'Il a cree, Lui le Doux, le Parfaitement Informe ? (67:14) illustre que cette connaissance decoule de Sa qualite de Createur.",
 quranVerses: [
 { surah: "Al-An'am", surahNumber: 6, ayah: 103, arabic: "وَهُوَ اللَّطِيفُ الْخَبِيرُ", translation: "Il est le Doux, le Parfaitement Informe.", link: "https://quran.com/fr/6:103" },
 { surah: "Al-Mulk", surahNumber: 67, ayah: 14, arabic: "أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ", translation: "Ne connait-Il pas ce qu'Il a cree, Lui le Doux, le Parfaitement Informe ?", link: "https://quran.com/fr/67:14" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Mulk 67:14", url: "https://quran.com/fr/67:14" }
 ]
 },
 32: {
 detailedMeaning: "Al-Halim derive de la racine h-l-m (etre clement, patient), s'opposant a la precipitation (ajala). Linguistiquement, le hilm designe le fait de retarder la punition malgre la capacite de l'infliger, distinguant la clemence de la faiblesse. Al-Halim ne Se hate pas de punir, voyant la desobeissance mais accordant un delai avec clemence pour le repentir. Le croyant ne doit pas etre trompe par ce delai mais profiter de la patience d'Allah pour se repentir sincerement. Le verset : Et Allah est Pardonneur et Clement (2:225) associe le pardon a la clemence, montrant leur complementarite dans la misericorde divine.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 225, arabic: "وَاللَّهُ غَفُورٌ حَلِيمٌ", translation: "Et Allah est Pardonneur et Clement.", link: "https://quran.com/fr/2:225" },
 { surah: "Al-Baqara", surahNumber: 2, ayah: 263, arabic: "وَاللَّهُ غَنِيٌّ حَلِيمٌ", translation: "Et Allah est Riche et Clement.", link: "https://quran.com/fr/2:263" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:225", url: "https://quran.com/fr/2:225" }
 ]
 },
 33: {
 detailedMeaning: "Al-'Azim derive de la racine '-z-m (etre immense), constituant un adjectif qualificatif indiquant une grandeur qui depasse toute mesure et toute comprehension. Linguistiquement, cette immensite ne peut etre saisie par aucun esprit cree. Al-'Azim est Celui dont la grandeur ne peut etre apprehendee, les creatures etant incapables de saisir Sa realite en essence, en attributs et en actes. Le croyant glorifie Allah en disant Subhana Rabbiya al-'Azim, reconnaissant Son immensite. Le verset : Et Il est le Tres Haut, le Tres Grand (2:255) dans Ayat al-Kursi consacre cette grandeur comme attribut fondamental de l'essence divine.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 255, arabic: "وَهُوَ الْعَلِيُّ الْعَظِيمُ", translation: "Et Il est le Tres Haut, le Tres Grand.", link: "https://quran.com/fr/2:255" },
 { surah: "Ash-Shura", surahNumber: 42, ayah: 4, arabic: "وَهُوَ الْعَلِيُّ الْعَظِيمُ", translation: "Et c'est Lui le Tres Haut, le Tres Grand.", link: "https://quran.com/fr/42:4" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:255", url: "https://quran.com/fr/2:255" }
 ]
 },
 34: {
 detailedMeaning: "Al-Ghafur suit le schema fa'ul derive de la racine gh-f-r (couvrir, pardonner), forme exprimant l'etendue et la completude du pardon. Linguistiquement, cette forme indique un pardon vaste couvrant entierement le peche, le distinguant d'Al-Ghaffar qui souligne la repetition. Al-Ghafur couvre les peches de Ses serviteurs sans les leur reprocher apres le repentir. Le croyant ne desespere jamais de Sa misericorde, car Il pardonne a celui qui revient sincerement. Le verset : Ne desesperez pas de la misericorde d'Allah, car Allah pardonne tous les peches (39:53) illustre ce pardon divin qui n'exclut aucune faute pour celui qui se repent.",
 quranVerses: [
 { surah: "Az-Zumar", surahNumber: 39, ayah: 53, arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا", translation: "Dis : O Mes serviteurs qui avez commis des exces a votre propre detriment, ne desesperez pas de la misericorde d'Allah. Car Allah pardonne tous les peches.", link: "https://quran.com/fr/39:53" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Az-Zumar 39:53", url: "https://quran.com/fr/39:53" }
 ]
 },
 35: {
 detailedMeaning: "Ash-Shakur suit le schema fa'ul derive de la racine sh-k-r (remercier, reconnaitre), designant Celui qui recompense le peu par le beaucoup. Linguistiquement, cette forme exprime une gratitude divine sans mesure. Ash-Shakur recompense l'obeissance au-dela de ce qu'elle merite, donnant une recompense eternelle pour des actes ephemeres. Le croyant est motive a multiplier les actes d'adoration, sachant qu'Allah recompense au-dela du merite. Le verset : Il est certes Pardonneur et Reconnaissant (35:30) associe le pardon a la reconnaissance, montrant qu'Allah efface les fautes et recompense les bonnes oeuvres.",
 quranVerses: [
 { surah: "Fatir", surahNumber: 35, ayah: 30, arabic: "إِنَّهُ غَفُورٌ شَكُورٌ", translation: "Il est certes Pardonneur et Reconnaissant.", link: "https://quran.com/fr/35:30" },
 { surah: "Fatir", surahNumber: 35, ayah: 34, arabic: "إِنَّ رَبَّنَا لَغَفُورٌ شَكُورٌ", translation: "Notre Seigneur est certes Pardonneur et Reconnaissant.", link: "https://quran.com/fr/35:34" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Fatir 35:30", url: "https://quran.com/fr/35:30" }
 ]
 },
 36: {
 detailedMeaning: "Al-'Aliyy derive de la racine '-l-w (etre eleve), designant une elevation en trois types : elevation de l'essence (dhat), des attributs (sifat) et de la domination (qahr). Al-'Aliyy est eleve au-dessus de toute chose, Sa hauteur etant celle de la majeste et de la domination, non une hauteur spatiale. Cette elevation est un attribut reel : Il est au-dessus de Sa creation, sur Son Trone, comme l'affirment le Coran et la Sunna, et le croyant dirige ses mains et son coeur vers le haut dans l'invocation. Le verset : Et Il est le Tres Haut, le Tres Grand (2:255) dans Ayat al-Kursi consacre cette elevation absolue.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 255, arabic: "وَهُوَ الْعَلِيُّ الْعَظِيمُ", translation: "Et Il est le Tres Haut, le Tres Grand.", link: "https://quran.com/fr/2:255" },
 { surah: "An-Nisa", surahNumber: 4, ayah: 34, arabic: "إِنَّ اللَّهَ كَانَ عَلِيًّا كَبِيرًا", translation: "Certes, Allah est Tres Haut, Tres Grand.", link: "https://quran.com/fr/4:34" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:255", url: "https://quran.com/fr/2:255" }
 ]
 },
 37: {
 detailedMeaning: "Al-Kabir derive de la racine k-b-r (etre grand), designant Celui dont la grandeur depasse celle de tout autre etre en essence, en attributs et en actes. Linguistiquement, ce terme implique une suprematie totale et incommensurable. Al-Kabir possede la perfection de l'essence et des attributs, la grandeur veritable n'appartenant qu'a Lui seul. Le Takbir (Allahu Akbar) prononce dans la priere est une affirmation de ce nom et une reconnaissance de Sa suprematie. Le verset : Le Connaisseur de l'invisible et du visible, le Tres Grand, le Tres Eleve (13:9) associe Sa grandeur a Sa science du visible et de l'invisible.",
 quranVerses: [
 { surah: "Ar-Ra'd", surahNumber: 13, ayah: 9, arabic: "عَالِمُ الْغَيْبِ وَالشَّهَادَةِ الْكَبِيرُ الْمُتَعَالِ", translation: "Le Connaisseur de l'invisible et du visible, le Tres Grand, le Tres Eleve.", link: "https://quran.com/fr/13:9" },
 { surah: "Al-Hajj", surahNumber: 22, ayah: 62, arabic: "وَأَنَّ اللَّهَ هُوَ الْعَلِيُّ الْكَبِيرُ", translation: "Et Allah est le Tres Haut, le Tres Grand.", link: "https://quran.com/fr/22:62" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Ra'd 13:9", url: "https://quran.com/fr/13:9" }
 ]
 },
 38: {
 detailedMeaning: "Al-Hafiz derive de la racine h-f-z (preserver, garder), englobant la preservation de l'existence, la protection contre le mal et la conservation des actes dans le registre divin. Linguistiquement, ce terme couvre toutes les formes de garde emanant de la volonte divine. Al-Hafiz preserve toute chose de la perte et de la corruption, gardant les cieux et la terre sans lassitude. Il preserve le Coran de toute falsification et les actes des creatures pour le Jour du Compte. Le verset : C'est Nous qui avons fait descendre le Rappel et c'est Nous qui en sommes les gardiens (15:9) illustre cette preservation du Livre sacre a la creation.",
 quranVerses: [
 { surah: "Hud", surahNumber: 11, ayah: 57, arabic: "إِنَّ رَبِّي عَلَىٰ كُلِّ شَيْءٍ حَفِيظٌ", translation: "Certes, mon Seigneur est le Gardien de toute chose.", link: "https://quran.com/fr/11:57" },
 { surah: "Al-Hijr", surahNumber: 15, ayah: 9, arabic: "إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ", translation: "C'est Nous qui avons fait descendre le Rappel et c'est Nous qui en sommes les gardiens.", link: "https://quran.com/fr/15:9" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Hud 11:57", url: "https://quran.com/fr/11:57" }
 ]
 },
 39: {
 detailedMeaning: "Al-Muqit derive de la racine q-w-t (nourrir, sustenter), designant Celui qui fournit la nourriture (qut) necessaire au maintien de la vie, tant physique que spirituelle. Linguistiquement, ce terme implique la fourniture de toute subsistance et le maintien en existence de chaque creature. Al-Muqit cree la nourriture des corps et des ames, maintenant les creatures en vie et pourvoyant a chacune selon son besoin. Le croyant se repose sur Allah pour sa subsistance, sachant qu'Al-Muqit ne neglige aucune creature. Le verset : Et Allah est le Garant de toute chose (4:85) confirme cette prise en charge universelle.",
 quranVerses: [
 { surah: "An-Nisa", surahNumber: 4, ayah: 85, arabic: "وَكَانَ اللَّهُ عَلَىٰ كُلِّ شَيْءٍ مُّقِيتًا", translation: "Et Allah est le Garant de toute chose.", link: "https://quran.com/fr/4:85" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - An-Nisa 4:85", url: "https://quran.com/fr/4:85" }
 ]
 },
 40: {
 detailedMeaning: "Al-Hasib derive de la racine h-s-b qui porte deux sens : le compte (hisab) et la suffisance (hasb). Linguistiquement, il est a la fois Celui qui tient les comptes avec une precision absolue et Celui qui suffit comme garant. Al-Hasib est Celui qui suffit a Ses serviteurs et qui tient le compte precis de toute chose, Sa comptabilite etant parfaite et exhaustive. Allah demandera des comptes le Jour du Jugement, et que le croyant se prepare en examinant ses propres actes avant d'etre examine. Le verset : Lis ton livre, tu te suffis aujourd'hui comme comptable contre toi-meme (17:14) montre la precision du registre divin dont chaque ame sera temoin.",
 quranVerses: [
 { surah: "An-Nisa", surahNumber: 4, ayah: 6, arabic: "وَكَفَىٰ بِاللَّهِ حَسِيبًا", translation: "Et Allah suffit comme Celui qui demande des comptes.", link: "https://quran.com/fr/4:6" },
 { surah: "Al-Isra", surahNumber: 17, ayah: 14, arabic: "اقْرَأْ كِتَابَكَ كَفَىٰ بِنَفْسِكَ الْيَوْمَ عَلَيْكَ حَسِيبًا", translation: "Lis ton livre. Tu te suffis aujourd'hui comme comptable contre toi-meme.", link: "https://quran.com/fr/17:14" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - An-Nisa 4:6", url: "https://quran.com/fr/4:6" }
 ]
 },
 41: {
 detailedMeaning: "Al-Jalil derive de la racine j-l-l (etre majestueux), et le jalal designe la grandeur accompagnee de splendeur et de magnificence. Linguistiquement, ce terme exprime la majeste absolue de l'essence divine, inspirant veneration et emerveillement. Al-Jalil est Celui dont les attributs sont majestueux et sublimes, la majeste (jalal) etant la grandeur alliee a la beaute, reunissant puissance et noblesse. Le croyant adore Allah avec crainte devant Sa majeste et espoir en Sa generosite. Le verset : Seule subsistera la Face de ton Seigneur, plein de majeste et de noblesse (55:27) consacre la perennite de cette majeste divine.",
 quranVerses: [
 { surah: "Ar-Rahman", surahNumber: 55, ayah: 27, arabic: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ", translation: "Seule subsistera la Face de ton Seigneur, plein de majeste et de noblesse.", link: "https://quran.com/fr/55:27" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Rahman 55:27", url: "https://quran.com/fr/55:27" }
 ]
 },
 42: {
 detailedMeaning: "Al-Karim derive de la racine k-r-m (etre genereux, noble), designant a la fois la noblesse de l'essence (sharaf) et la generosite des actes (jud). Linguistiquement, ce terme couvre toute forme de noblesse et de largesse, englobant le don, le pardon et la bienveillance. Al-Karim pardonne quand Il a le pouvoir de punir, tient Ses promesses et Ses dons depassent toute esperance. Sa generosite est sans limites et que le croyant L'invoque avec confiance sachant qu'Il ne decoit jamais. Le verset : O homme, qu'est-ce qui t'a trompe au sujet de ton Seigneur le Genereux ? (82:6) interpelle l'homme sur sa negligence face a cette generosite.",
 quranVerses: [
 { surah: "An-Naml", surahNumber: 27, ayah: 40, arabic: "وَمَن شَكَرَ فَإِنَّمَا يَشْكُرُ لِنَفْسِهِ وَمَن كَفَرَ فَإِنَّ رَبِّي غَنِيٌّ كَرِيمٌ", translation: "Quiconque est reconnaissant, c'est dans son propre interet. Et quiconque est ingrat, mon Seigneur est Riche et Genereux.", link: "https://quran.com/fr/27:40" },
 { surah: "Al-Infitar", surahNumber: 82, ayah: 6, arabic: "يَا أَيُّهَا الْإِنسَانُ مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ", translation: "O homme ! Qu'est-ce qui t'a trompe au sujet de ton Seigneur le Genereux ?", link: "https://quran.com/fr/82:6" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - An-Naml 27:40", url: "https://quran.com/fr/27:40" }
 ]
 },
 43: {
 detailedMeaning: "Ar-Raqib derive de la racine r-q-b (observer, surveiller), designant une observation permanente et attentive, sans distraction. Linguistiquement, ce terme implique une vigilance constante embrassant toute la creation. Ar-Raqib est Celui de qui rien ne se cache, Sa surveillance etant perpetuelle, englobant les actes apparents comme les pensees secretes. Le croyant cultive la muraqaba (conscience de la surveillance divine), sachant qu'Allah observe chacun de ses actes. Le verset : Puis quand Tu m'as rappele, c'est Toi qui etais leur observateur attentif (5:117) montre qu'apres les Prophetes, seul Allah demeure l'Observateur de Ses serviteurs.",
 quranVerses: [
 { surah: "Al-Ahzab", surahNumber: 33, ayah: 52, arabic: "وَكَانَ اللَّهُ عَلَىٰ كُلِّ شَيْءٍ رَّقِيبًا", translation: "Et Allah observe toute chose.", link: "https://quran.com/fr/33:52" },
 { surah: "Al-Ma'ida", surahNumber: 5, ayah: 117, arabic: "فَلَمَّا تَوَفَّيْتَنِي كُنتَ أَنتَ الرَّقِيبَ عَلَيْهِمْ", translation: "Puis quand Tu m'as rappele, c'est Toi qui etais leur observateur attentif.", link: "https://quran.com/fr/5:117" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Ahzab 33:52", url: "https://quran.com/fr/33:52" }
 ]
 },
 44: {
 detailedMeaning: "Al-Mujib derive de la racine j-w-b (repondre), designant Celui qui donne une reponse (ijaba) a toute demande, par l'exaucement, la recompense ou le secours. Linguistiquement, ce terme implique une reponse active et effective, non une simple ecoute passive. Al-Mujib repond aux supplications par l'exaucement, aux obeissances par la recompense et aux necessites par le secours. Le croyant invoque avec certitude, sachant qu'aucune du'a sincere n'est perdue. Le verset : Je suis tout proche, Je reponds a l'appel de celui qui M'invoque (2:186) consacre cette proximite divine et cette promesse d'exaucement pour quiconque se tourne vers Lui.",
 quranVerses: [
 { surah: "Hud", surahNumber: 11, ayah: 61, arabic: "إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ", translation: "Mon Seigneur est proche et Il repond.", link: "https://quran.com/fr/11:61" },
 { surah: "Al-Baqara", surahNumber: 2, ayah: 186, arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ", translation: "Et quand Mes serviteurs t'interrogent a Mon sujet, Je suis tout proche. Je reponds a l'appel de celui qui M'invoque.", link: "https://quran.com/fr/2:186" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:186", url: "https://quran.com/fr/2:186" }
 ]
 },
 45: {
 detailedMeaning: "Al-Wasi' derive de la racine w-s-' (etre vaste), designant l'absence de toute limite dans les attributs d'Allah. Linguistiquement, Sa science, Sa misericorde et Sa generosite n'ont pas de bornes, embrassant la creation sans s'epuiser. Al-Wasi' est Celui dont la richesse et la science sont sans limites, dont la misericorde embrasse toute chose et dont les dons depassent toute mesure. Le croyant invoque Allah sachant que Ses tresors ne s'epuisent jamais. Le verset : Ou que vous vous tourniez, la est la Face d'Allah, Allah est Vaste et Omniscient (2:115) illustre cette vastitude infinie qui transcende toute direction.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 115, arabic: "فَأَيْنَمَا تُوَلُّوا فَثَمَّ وَجْهُ اللَّهِ إِنَّ اللَّهَ وَاسِعٌ عَلِيمٌ", translation: "Ou que vous vous tourniez, la est la Face d'Allah. Allah est Vaste et Omniscient.", link: "https://quran.com/fr/2:115" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:115", url: "https://quran.com/fr/2:115" }
 ]
 },
 46: {
 detailedMeaning: "Al-Hakim derive de la racine h-k-m qui porte les sens de sagesse (hikma) et de jugement (hukm), designant Celui qui place chaque chose a sa juste place. Linguistiquement, ce terme implique la maitrise de l'ordonnancement et l'infaillibilite du decret. Al-Hakim juge avec justesse et que Sa sagesse se manifeste dans la creation comme dans la legislation. Le croyant accepte les decrets d'Allah avec soumission, sachant que derriere chaque epreuve se cache une sagesse divine. Le verset : A Lui les plus beaux noms, et Il est le Tout Puissant, le Sage (59:24) associe Sa sagesse a Sa puissance, montrant que Ses actes sont parfaitement ordonnes.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 129, arabic: "إِنَّكَ أَنتَ الْعَزِيزُ الْحَكِيمُ", translation: "Certes, c'est Toi le Tout Puissant, le Sage.", link: "https://quran.com/fr/2:129" },
 { surah: "Al-Hashr", surahNumber: 59, ayah: 24, arabic: "لَهُ الْأَسْمَاءُ الْحُسْنَىٰ يُسَبِّحُ لَهُ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ وَهُوَ الْعَزِيزُ الْحَكِيمُ", translation: "A Lui les plus beaux noms. Ce qui est dans les cieux et la terre Le glorifie. Il est le Tout Puissant, le Sage.", link: "https://quran.com/fr/59:24" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:129", url: "https://quran.com/fr/2:129" }
 ]
 },
 47: {
 detailedMeaning: "Al-Wadud derive de la racine w-d-d (aimer) selon le schema fa'ul, qui peut exprimer aussi bien le sens actif (Celui qui aime) que le sens passif (Celui qui est aime). Linguistiquement, Al-Wadud combine les deux sens simultanement : Il aime Ses serviteurs obeissants et Il est aime par eux. Al-Wadud est Celui qui place l'amour de Lui dans les coeurs de Ses serviteurs et que Son amour est la source de tout bien. Le Coran associe ce nom au pardon dans la sourate Al-Buruj (85:14) : Et c'est Lui le Pardonneur, le Plein d'amour, et a la misericorde dans la sourate Hud (11:90) : Mon Seigneur est Misericordieux et plein d'amour.",
 quranVerses: [
 { surah: "Hud", surahNumber: 11, ayah: 90, arabic: "وَاسْتَغْفِرُوا رَبَّكُمْ ثُمَّ تُوبُوا إِلَيْهِ إِنَّ رَبِّي رَحِيمٌ وَدُودٌ", translation: "Implorez le pardon de votre Seigneur puis revenez a Lui. Mon Seigneur est Misericordieux et plein d'amour.", link: "https://quran.com/fr/11:90" },
 { surah: "Al-Buruj", surahNumber: 85, ayah: 14, arabic: "وَهُوَ الْغَفُورُ الْوَدُودُ", translation: "Et c'est Lui le Pardonneur, le Plein d'amour.", link: "https://quran.com/fr/85:14" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Buruj 85:14", url: "https://quran.com/fr/85:14" }
 ]
 },
 48: {
 detailedMeaning: "Al-Majid derive de la racine m-j-d (etre glorieux) et combine linguistiquement la vastitude des attributs (sa'at as-sifat) et la noblesse de l'essence (sharaf adh-dhat). Al-Majid est Celui dont la noblesse de l'essence, la generosite des actes et la beaute des attributs sont au plus haut degre de perfection. La gloire d'Allah combine noblesse et generosite, et que le croyant glorifie Allah dans la priere d'Ibrahim. Le Coran declare dans Al-Buruj (85:15) qu'Il est le Maitre du Trone, le Glorieux, et dans Hud (11:73) qu'Il est Digne de louange et de gloire.",
 quranVerses: [
 { surah: "Hud", surahNumber: 11, ayah: 73, arabic: "رَحْمَتُ اللَّهِ وَبَرَكَاتُهُ عَلَيْكُمْ أَهْلَ الْبَيْتِ إِنَّهُ حَمِيدٌ مَّجِيدٌ", translation: "La misericorde d'Allah et Ses benedictions soient sur vous, gens de la maison. Il est certes Digne de louange et de gloire.", link: "https://quran.com/fr/11:73" },
 { surah: "Al-Buruj", surahNumber: 85, ayah: 15, arabic: "ذُو الْعَرْشِ الْمَجِيدُ", translation: "Le Maitre du Trone, le Glorieux.", link: "https://quran.com/fr/85:15" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Buruj 85:15", url: "https://quran.com/fr/85:15" }
 ]
 },
 49: {
 detailedMeaning: "Al-Ba'ith derive de la racine b-'-th (envoyer, ressusciter). Linguistiquement, ce nom comporte linguistiquement deux sens fondamentaux : la resurrection des morts (ba'th al-mawta) et l'envoi des messagers (ba'th ar-rusul). Al-Ba'ith est Celui qui ressuscite les morts, qui envoie les messagers et qui suscite dans les coeurs la lumiere de la foi. La resurrection est une verite certaine qu'il faut croire fermement, car Allah ressuscitera chaque creature pour le Compte final, et cette croyance est un pilier fondamental de la foi. Le Coran affirme dans la sourate Al-Hajj (22:7) : Allah ressuscitera ceux qui sont dans les tombes.",
 quranVerses: [
 { surah: "Al-Hajj", surahNumber: 22, ayah: 7, arabic: "وَأَنَّ السَّاعَةَ آتِيَةٌ لَّا رَيْبَ فِيهَا وَأَنَّ اللَّهَ يَبْعَثُ مَن فِي الْقُبُورِ", translation: "Et l'Heure viendra sans aucun doute, et Allah ressuscitera ceux qui sont dans les tombes.", link: "https://quran.com/fr/22:7" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hajj 22:7", url: "https://quran.com/fr/22:7" }
 ]
 },
 50: {
 detailedMeaning: "Ash-Shahid derive de la racine sh-h-d (temoigner, etre present). Linguistiquement, ce nom designe linguistiquement Celui dont la science est directe et presente, temoignant de toute chose sans intermediaire. Ash-Shahid est Celui de qui rien n'est absent, present par Sa science dont le temoignage couvre tout l'univers. Le temoignage d'Allah est un attribut lie a Sa science parfaite, incitant le croyant a la droiture en secret comme en public. Le Coran affirme dans Al-Buruj (85:9) : Allah est temoin de toute chose, et dans An-Nisa (4:166) qu'Il temoigne de ce qu'Il a revele en toute connaissance.",
 quranVerses: [
 { surah: "Al-Buruj", surahNumber: 85, ayah: 9, arabic: "وَاللَّهُ عَلَىٰ كُلِّ شَيْءٍ شَهِيدٌ", translation: "Et Allah est temoin de toute chose.", link: "https://quran.com/fr/85:9" },
 { surah: "An-Nisa", surahNumber: 4, ayah: 166, arabic: "لَّٰكِنِ اللَّهُ يَشْهَدُ بِمَا أَنزَلَ إِلَيْكَ أَنزَلَهُ بِعِلْمِهِ", translation: "Mais Allah temoigne de ce qu'Il t'a revele, Il l'a revele en toute connaissance.", link: "https://quran.com/fr/4:166" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Buruj 85:9", url: "https://quran.com/fr/85:9" }
 ]
 },
 51: {
 detailedMeaning: "Al-Haqq derive de la racine h-q-q (etre vrai, certain). Linguistiquement, ce nom designe linguistiquement l'existence necessaire et certaine, par opposition au batil (faux) qui est contingent et ephemere. Al-Haqq est Celui dont l'existence est indeniable et necessaire. Le croyant s'attache a la Verite en suivant Sa revelation et en rejetant tout ce qui la contredit. Le Coran declare dans Luqman (31:30) : Allah est la Verite et ce qu'ils invoquent en dehors de Lui est le faux. Le Prophete (paix sur lui) invoquait : Tu es Al-Haqq, Ta promesse est verite, Ta parole est verite, comme rapporte dans Sahih Bukhari (1120).",
 quranVerses: [
 { surah: "Al-Hajj", surahNumber: 22, ayah: 6, arabic: "ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ وَأَنَّهُ يُحْيِي الْمَوْتَىٰ", translation: "C'est parce qu'Allah est la Verite et c'est Lui qui donne la vie aux morts.", link: "https://quran.com/fr/22:6" },
 { surah: "Luqman", surahNumber: 31, ayah: 30, arabic: "ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ وَأَنَّ مَا يَدْعُونَ مِن دُونِهِ الْبَاطِلُ", translation: "C'est parce qu'Allah est la Verite et que ce qu'ils invoquent en dehors de Lui est le faux.", link: "https://quran.com/fr/31:30" }
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
 detailedMeaning: "Al-Wakil derive de la racine w-k-l (confier, mandater). Linguistiquement, ce nom designe linguistiquement Celui a qui les affaires sont confiees et qui les gere avec perfection et suffisance. Al-Wakil est Celui a qui sont confiees les affaires de Ses creatures, et que celui qui se remet a Lui ne sera jamais decu. Le tawakkul est une realite du coeur qui decoule de la connaissance de ce nom, et que le croyant prend les moyens tout en s'en remettant a Allah pour le resultat. Le Coran affirme dans Ali 'Imran (3:173) : Allah nous suffit, Il est notre meilleur Garant, comme rapporte dans Tirmidhi (2517).",
 quranVerses: [
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 173, arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", translation: "Allah nous suffit, Il est notre meilleur Garant.", link: "https://quran.com/fr/3:173" },
 { surah: "Al-Ahzab", surahNumber: 33, ayah: 3, arabic: "وَتَوَكَّلْ عَلَى اللَّهِ وَكَفَىٰ بِاللَّهِ وَكِيلًا", translation: "Et place ta confiance en Allah. Allah suffit comme Garant.", link: "https://quran.com/fr/33:3" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ali 'Imran 3:173", url: "https://quran.com/fr/3:173" }
 ]
 },
 53: {
 detailedMeaning: "Al-Qawi derive de la racine q-w-y (etre fort). Linguistiquement, ce nom designe linguistiquement une force parfaite et complete (quwwa kamila) qui ne connait ni faiblesse ni diminution. Al-Qawi est Celui dont la force est parfaite et complete, qui ne connait ni faiblesse ni impuissance dans aucun de Ses actes. La force d'Allah est un attribut reel et absolu, et que le croyant ne se confie qu'en la force d'Allah et ne craint que Lui, car toute force dans l'univers n'est qu'un reflet de Sa puissance. Le Coran associe frequemment ce nom a Al-'Aziz, comme dans Al-Hajj (22:74) : Certes, Allah est Fort et Tout Puissant, et dans Al-Hadid (57:25).",
 quranVerses: [
 { surah: "Al-Hajj", surahNumber: 22, ayah: 74, arabic: "إِنَّ اللَّهَ لَقَوِيٌّ عَزِيزٌ", translation: "Certes, Allah est Fort et Tout Puissant.", link: "https://quran.com/fr/22:74" },
 { surah: "Al-Hadid", surahNumber: 57, ayah: 25, arabic: "إِنَّ اللَّهَ قَوِيٌّ عَزِيزٌ", translation: "Certes, Allah est Fort et Tout Puissant.", link: "https://quran.com/fr/57:25" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hajj 22:74", url: "https://quran.com/fr/22:74" }
 ]
 },
 54: {
 detailedMeaning: "Al-Matin derive de la racine m-t-n (etre ferme, solide). Linguistiquement, ce nom designe linguistiquement une fermete et une solidite absolues, et que la matana est la force constante qui ne faiblit jamais. Al-Matin est Celui dont la force ne faiblit pas et dont la puissance ne s'epuise jamais, et que Sa fermete est sans faille. La fermete d'Allah est absolue et inebranlable, et que le croyant puise dans ce nom la force de rester ferme dans sa foi et sa pratique. Le Coran reunit ce nom avec la subsistance et la force dans la sourate Adh-Dhariyat (51:58) : C'est Allah qui est le Pourvoyeur, le Detenteur de la force, l'Inebranlable.",
 quranVerses: [
 { surah: "Adh-Dhariyat", surahNumber: 51, ayah: 58, arabic: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ", translation: "C'est Allah qui est le Pourvoyeur, le Detenteur de la force, l'Inebranlable.", link: "https://quran.com/fr/51:58" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Adh-Dhariyat 51:58", url: "https://quran.com/fr/51:58" }
 ]
 },
 55: {
 detailedMeaning: "Al-Wali derive de la racine w-l-y (etre proche, allier). Linguistiquement, la wilaya implique linguistiquement la proximite (qurb), le soutien (nusra) et la prise en charge (tawalli) des affaires des croyants. Al-Wali est Celui qui prend en charge les affaires de Ses serviteurs croyants et les protege de tout mal. L'alliance d'Allah est le fondement de la walaya, et que quiconque fait du mal a Ses allies, Allah lui declare la guerre, comme rapporte dans Sahih Bukhari (6502). Le Coran affirme dans Al-Baqara (2:257) : Allah est l'Allie de ceux qui croient, Il les fait sortir des tenebres vers la lumiere.",
 quranVerses: [
 { surah: "Ash-Shura", surahNumber: 42, ayah: 9, arabic: "أَمِ اتَّخَذُوا مِن دُونِهِ أَوْلِيَاءَ فَاللَّهُ هُوَ الْوَلِيُّ", translation: "Ont-ils pris des allies en dehors de Lui ? C'est Allah qui est l'Allie.", link: "https://quran.com/fr/42:9" },
 { surah: "Al-Baqara", surahNumber: 2, ayah: 257, arabic: "اللَّهُ وَلِيُّ الَّذِينَ آمَنُوا يُخْرِجُهُم مِّنَ الظُّلُمَاتِ إِلَى النُّورِ", translation: "Allah est l'Allie de ceux qui croient. Il les fait sortir des tenebres vers la lumiere.", link: "https://quran.com/fr/2:257" }
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
 detailedMeaning: "Al-Hamid derive de la racine h-m-d (louer). Linguistiquement, le hamd est linguistiquement la louange pour une perfection volontaire, a la difference du madh qui peut etre pour une qualite involontaire. Al-Hamid est Celui qui est loue pour tous Ses attributs et Ses actes, et qu'Il est le seul digne de louange absolue et inconditionnelle. La louange revient a Allah en toute circonstance, dans l'aisance comme dans l'epreuve, et que le croyant dit Alhamdulillah en tout etat, reconnaissant que tout ce qu'Allah decrete est digne de louange. Le Coran l'associe a Al-'Aziz dans Ibrahim (14:1) : vers le chemin du Tout Puissant, du Digne de louange.",
 quranVerses: [
 { surah: "Ibrahim", surahNumber: 14, ayah: 1, arabic: "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ لِتُخْرِجَ النَّاسَ مِنَ الظُّلُمَاتِ إِلَى النُّورِ بِإِذْنِ رَبِّهِمْ إِلَىٰ صِرَاطِ الْعَزِيزِ الْحَمِيدِ", translation: "Un Livre que Nous avons fait descendre vers toi afin que tu fasses sortir les gens des tenebres vers la lumiere, par la permission de leur Seigneur, vers le chemin du Tout Puissant, du Digne de louange.", link: "https://quran.com/fr/14:1" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ibrahim 14:1", url: "https://quran.com/fr/14:1" }
 ]
 },
 57: {
 detailedMeaning: "Al-Muhsi derive de la racine h-s-y (denombrer). Linguistiquement, l'ihsa' est linguistiquement le fait de connaitre le nombre exact de chaque chose, aussi innombrable soit-elle pour les creatures. Al-Muhsi est Celui qui connait le nombre de toute chose, qu'Il a tout denombre dans Sa science et que rien ne Lui echappe, aussi petit soit-il. Le denombrement d'Allah est lie a Sa science parfaite et englobante, et que le Jour du Jugement chaque acte sera presente et compte. Le Coran declare dans Maryam (19:94) : Il les a certes recenses et bien comptes, et dans Ya-Sin (36:12) : Nous avons denombre toute chose dans un registre explicite.",
 quranVerses: [
 { surah: "Maryam", surahNumber: 19, ayah: 94, arabic: "لَّقَدْ أَحْصَاهُمْ وَعَدَّهُمْ عَدًّا", translation: "Il les a certes recenses et bien comptes.", link: "https://quran.com/fr/19:94" },
 { surah: "Ya-Sin", surahNumber: 36, ayah: 12, arabic: "وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ فِي إِمَامٍ مُّبِينٍ", translation: "Et Nous avons denombre toute chose dans un registre explicite.", link: "https://quran.com/fr/36:12" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Maryam 19:94", url: "https://quran.com/fr/19:94" }
 ]
 },
 58: {
 detailedMeaning: "Al-Mubdi' derive de la racine b-d-' (commencer, initier) selon le schema muf'il, indiquant l'agent causal. Linguistiquement, l'ibda' est linguistiquement le fait de faire exister quelque chose pour la premiere fois, sans modele anterieur. Al-Mubdi' est Celui qui a donne l'existence a toute chose a partir du neant, sans cause anterieure ni modele preetabli. La creation initiale temoigne de la puissance d'Allah, et que Celui qui a cree une premiere fois peut recreer, ce qui renforce la foi en la resurrection. Le Coran affirme dans Al-Buruj (85:13) : C'est Lui qui commence et qui recommence, et dans Yunus (10:4).",
 quranVerses: [
 { surah: "Al-Buruj", surahNumber: 85, ayah: 13, arabic: "إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ", translation: "C'est Lui qui commence et qui recommence.", link: "https://quran.com/fr/85:13" },
 { surah: "Yunus", surahNumber: 10, ayah: 4, arabic: "إِنَّهُ يَبْدَأُ الْخَلْقَ ثُمَّ يُعِيدُهُ", translation: "C'est Lui qui commence la creation puis la recommence.", link: "https://quran.com/fr/10:4" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Buruj 85:13", url: "https://quran.com/fr/85:13" }
 ]
 },
 59: {
 detailedMeaning: "Al-Mu'id derive de la racine '-w-d (revenir, recommencer) selon le schema muf'il. Linguistiquement, l'i'ada est linguistiquement le fait de refaire ce qui a deja ete fait, c'est-a-dire la recreation apres la premiere creation. Al-Mu'id ramene les creatures a la vie apres la mort pour le Jour de la Retribution, et que cela est facile pour Lui. Le croyant ne doute pas de la resurrection, car Celui qui a cree la premiere fois est certainement capable de recreer. Le Coran declare dans Ar-Rum (30:27) : C'est Lui qui commence la creation puis la recommence, et cela Lui est plus facile encore.",
 quranVerses: [
 { surah: "Al-Buruj", surahNumber: 85, ayah: 13, arabic: "إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ", translation: "C'est Lui qui commence et qui recommence.", link: "https://quran.com/fr/85:13" },
 { surah: "Ar-Rum", surahNumber: 30, ayah: 27, arabic: "وَهُوَ الَّذِي يَبْدَأُ الْخَلْقَ ثُمَّ يُعِيدُهُ وَهُوَ أَهْوَنُ عَلَيْهِ", translation: "C'est Lui qui commence la creation puis la recommence, et cela Lui est plus facile encore.", link: "https://quran.com/fr/30:27" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Rum 30:27", url: "https://quran.com/fr/30:27" }
 ]
 },
 60: {
 detailedMeaning: "Al-Muhyi derive de la racine h-y-y (vivre) selon le schema muf'il, indiquant l'agent qui cause la vie. Linguistiquement, l'ihya' est linguistiquement le fait de donner la vie, que ce soit au corps par l'ame, au coeur par la foi, ou a la terre par la pluie. Al-Muhyi cree la vie sous toutes ses formes, et que la plus noble est celle du coeur par la lumiere de la foi. Le corps sans foi est un cadavre meme s'il est en mouvement. Le Coran invite a contempler ce signe dans Ar-Rum (30:50) : Regarde les traces de la misericorde d'Allah, comment Il redonne la vie a la terre apres sa mort.",
 quranVerses: [
 { surah: "Ar-Rum", surahNumber: 30, ayah: 50, arabic: "فَانظُرْ إِلَىٰ آثَارِ رَحْمَتِ اللَّهِ كَيْفَ يُحْيِي الْأَرْضَ بَعْدَ مَوْتِهَا", translation: "Regarde les traces de la misericorde d'Allah, comment Il redonne la vie a la terre apres sa mort.", link: "https://quran.com/fr/30:50" },
 { surah: "Al-Hajj", surahNumber: 22, ayah: 6, arabic: "وَأَنَّهُ يُحْيِي الْمَوْتَىٰ وَأَنَّهُ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", translation: "Et c'est Lui qui donne la vie aux morts et Il est Omnipotent.", link: "https://quran.com/fr/22:6" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Rum 30:50", url: "https://quran.com/fr/30:50" }
 ]
 },
 61: {
 detailedMeaning: "Al-Mumit derive de la racine m-w-t (mourir) selon le schema muf'il, indiquant l'agent causal. Linguistiquement, l'imata est linguistiquement le fait d'oter la vie, et que la mort est une creature d'Allah, non pas un simple neant, mais un etat decrete. Al-Mumit est Celui qui fait mourir les vivants selon Sa sagesse et Son decret eternel. La mort est un passage decrete avec sagesse, et que le croyant s'y prepare en multipliant les bonnes actions. Le Coran declare dans Al-Mulk (67:2) : Celui qui a cree la mort et la vie afin de vous eprouver, et dans Ali 'Imran (3:185) : Toute ame goutera la mort.",
 quranVerses: [
 { surah: "Al-Mulk", surahNumber: 67, ayah: 2, arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا", translation: "Celui qui a cree la mort et la vie afin de vous eprouver, qui de vous est le meilleur en oeuvres.", link: "https://quran.com/fr/67:2" },
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 185, arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", translation: "Toute ame goutera la mort.", link: "https://quran.com/fr/3:185" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Mulk 67:2", url: "https://quran.com/fr/67:2" }
 ]
 },
 62: {
 detailedMeaning: "Al-Hayy derive de la racine h-y-y (vivre). Linguistiquement, c'est linguistiquement un adjectif indiquant une vie parfaite, eternelle, qui ne connait ni commencement ni fin ni affaiblissement. Tous les attributs d'action decoulent de la vie, car seul le vivant peut savoir, vouloir et agir. Al-Hayy est le Vivant qui ne meurt pas et dont la vie est inherente a Son essence. Al-Hayy et Al-Qayyum sont les deux plus grands noms d'Allah et que tous les autres attributs en decoulent. Le Coran les associe dans Ayat al-Kursi (2:255), et le Prophete (paix sur lui) a confirme cela dans Tirmidhi (3524).",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 255, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", translation: "Allah ! Point de divinite a part Lui, le Vivant, Celui qui subsiste par Lui-meme.", link: "https://quran.com/fr/2:255" },
 { surah: "Ghafir", surahNumber: 40, ayah: 65, arabic: "هُوَ الْحَيُّ لَا إِلَٰهَ إِلَّا هُوَ فَادْعُوهُ مُخْلِصِينَ لَهُ الدِّينَ", translation: "C'est Lui le Vivant, point de divinite a part Lui. Invoquez-Le avec devotion sincere.", link: "https://quran.com/fr/40:65" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:255", url: "https://quran.com/fr/2:255" }
 ]
 },
 63: {
 detailedMeaning: "Al-Qayyum derive de la racine q-w-m (se tenir, subsister) selon le schema fa''ul, forme d'intensite indiquant la pleinitude de l'attribut. Linguistiquement, il designe Celui qui subsiste par Lui-meme (qa'im bi-nafsihi) et par qui toute chose subsiste (muqim li-ghayrihi). Tous les noms d'Allah reviennent a Al-Hayy et Al-Qayyum. Le Coran associe constamment ces deux noms, comme dans Ayat al-Kursi (2:255) : le Vivant, le Subsistant, ni somnolence ni sommeil ne Le saisissent, et dans Ali 'Imran (3:2). La subsistance de tout l'univers depend de Lui a chaque instant, tandis que Lui ne depend de rien.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 255, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ", translation: "Allah ! Point de divinite a part Lui, le Vivant, le Subsistant. Ni somnolence ni sommeil ne Le saisissent.", link: "https://quran.com/fr/2:255" },
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 2, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", translation: "Allah ! Point de divinite a part Lui, le Vivant, le Subsistant.", link: "https://quran.com/fr/3:2" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:255", url: "https://quran.com/fr/2:255" }
 ]
 },
 64: {
 detailedMeaning: "Al-Wajid derive de la racine w-j-d (trouver, posseder). Linguistiquement, ce nom designe linguistiquement Celui qui possede tout et ne manque de rien, et qu'al-wujud exprime a la fois l'existence et la possession. Al-Wajid est Celui a qui rien ne manque, qui trouve tout ce qu'Il desire et possede tout ce qu'Il veut, sans peine ni effort. Allah est l'Opulent qui ne manque de rien, et que le croyant cherche sa richesse aupres d'Allah seul. La racine w-j-d apparait dans le Coran sous la forme verbale, notamment dans Ad-Duha (93:7) : Ne t'a-t-Il pas trouve egare et Il t'a guide, illustrant Sa sollicitude.",
 quranVerses: [
 { surah: "Ad-Duha", surahNumber: 93, ayah: 7, arabic: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ", translation: "Ne t'a-t-Il pas trouve egare et Il t'a guide.", link: "https://quran.com/fr/93:7" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ad-Duha 93:7", url: "https://quran.com/fr/93:7" }
 ]
 },
 65: {
 detailedMeaning: "Al-Majid derive de la racine m-j-d. Linguistiquement, sa forme avec le shadda (majjid) est une intensification combinant la vastitude des attributs et la noblesse absolue de l'essence. Al-Majid est Celui dont la noblesse est eminente et les bienfaits abondants, alliant la grandeur du rang a la generosite des actes. La gloire d'Allah se manifeste par la perfection de Ses attributs et l'abondance de Ses bienfaits, et que le croyant invoque Sa gloire dans les prieres sur le Prophete. Le Coran associe ce nom a la louange dans Hud (11:73) : Il est certes Digne de louange et de gloire.",
 quranVerses: [
 { surah: "Hud", surahNumber: 11, ayah: 73, arabic: "إِنَّهُ حَمِيدٌ مَّجِيدٌ", translation: "Il est certes Digne de louange et de gloire.", link: "https://quran.com/fr/11:73" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Hud 11:73", url: "https://quran.com/fr/11:73" }
 ]
 },
 66: {
 detailedMeaning: "Al-Wahid derive de la racine w-h-d (etre unique). Linguistiquement, la wahda d'Allah est linguistiquement de trois types : unicite de l'essence, des attributs et des actes divins. Al-Wahid est Celui qui n'a pas de second dans Son essence, pas de semblable dans Ses attributs et pas de partenaire dans Ses actes. L'unicite d'Allah est le fondement du tawhid et le premier devoir du serviteur. Le Coran proclame dans Al-Baqara (2:163) : Votre Dieu est un Dieu unique, et dans Al-Ikhlas (112:1) : Dis, Il est Allah, Unique. Le Prophete (paix sur lui) a dit : Allah etait et rien n'etait avec Lui, comme rapporte dans Sahih Bukhari (7392).",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 163, arabic: "وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ لَّا إِلَٰهَ إِلَّا هُوَ الرَّحْمَٰنُ الرَّحِيمُ", translation: "Et votre Dieu est un Dieu unique. Point de divinite a part Lui, le Tout Misericordieux, le Tres Misericordieux.", link: "https://quran.com/fr/2:163" },
 { surah: "Al-Ikhlas", surahNumber: 112, ayah: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Dis : Il est Allah, Unique.", link: "https://quran.com/fr/112:1" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Ikhlas 112:1", url: "https://quran.com/fr/112:1" }
 ]
 },
 67: {
 detailedMeaning: "As-Samad derive de la racine s-m-d qui designe la pleinitude et la permanence. Linguistiquement, ce nom designe linguistiquement Celui vers qui convergent toutes les requetes (yusmadu ilayhi) car Il est plein et parfait. As-Samad est le Maitre dont la souverainete est complete, Celui vers qui on se dirige dans les besoins et a qui on s'adresse dans les epreuves. As-Samad est Celui qui reunit toutes les qualites de perfection, qu'Il est le Plein qui n'a aucun vide et le Riche dont rien ne manque. Le Coran mentionne ce nom dans la sourate Al-Ikhlas (112:2) : Allah, As-Samad, dans un contexte qui affirme Son unicite absolue et Son independance de toute creature.",
 quranVerses: [
 { surah: "Al-Ikhlas", surahNumber: 112, ayah: 2, arabic: "اللَّهُ الصَّمَدُ", translation: "Allah, le Soutien universel.", link: "https://quran.com/fr/112:2" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Ikhlas 112:2", url: "https://quran.com/fr/112:2" }
 ]
 },
 68: {
 detailedMeaning: "Al-Qadir derive de la racine q-d-r (pouvoir, decreter) selon le schema fa'il, indiquant un attribut permanent. Linguistiquement, al-qudra est linguistiquement le pouvoir de faire exister les choses conformement a la volonte et a la science divines. Al-Qadir fait exister les choses conformement a Sa volonte et que Sa puissance n'est entravee par rien. La puissance d'Allah est un attribut reel et absolu, que rien n'est impossible pour Lui et que Sa volonte s'accomplit sans entrave. Le Coran repete : Certes, Allah est Omnipotent (2:20), et dans Al-An'am (6:65) : Il est capable de vous envoyer un chatiment d'au-dessus de vous.",
 quranVerses: [
 { surah: "Al-An'am", surahNumber: 6, ayah: 65, arabic: "قُلْ هُوَ الْقَادِرُ عَلَىٰ أَن يَبْعَثَ عَلَيْكُمْ عَذَابًا مِّن فَوْقِكُمْ", translation: "Dis : Il est capable de vous envoyer un chatiment d'au-dessus de vous.", link: "https://quran.com/fr/6:65" },
 { surah: "Al-Baqara", surahNumber: 2, ayah: 20, arabic: "إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", translation: "Certes, Allah est Omnipotent.", link: "https://quran.com/fr/2:20" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-An'am 6:65", url: "https://quran.com/fr/6:65" }
 ]
 },
 69: {
 detailedMeaning: "Al-Muqtadir derive de la racine q-d-r (pouvoir) selon le schema mufta'il. Linguistiquement, c'est une forme intensive d'Al-Qadir, indiquant que la puissance divine s'exerce de maniere effective et totale sur toute chose. Al-Muqtadir signifie que la puissance d'Allah s'exerce effectivement et sans entrave. Ce nom rappelle que les chatiments d'Allah s'abattent avec precision sur ceux qui nient Ses signes. Le Coran utilise ce nom dans Al-Qamar (54:42) : Nous les saisimes de la saisie d'un Tout Puissant Omnipotent, et dans Al-Kahf (18:45) : Allah est Omnipotent.",
 quranVerses: [
 { surah: "Al-Qamar", surahNumber: 54, ayah: 42, arabic: "كَذَّبُوا بِآيَاتِنَا كُلِّهَا فَأَخَذْنَاهُمْ أَخْذَ عَزِيزٍ مُّقْتَدِرٍ", translation: "Ils denoncerent Nos signes, tous. Nous les saisimes de la saisie d'un Tout Puissant Omnipotent.", link: "https://quran.com/fr/54:42" },
 { surah: "Al-Kahf", surahNumber: 18, ayah: 45, arabic: "وَكَانَ اللَّهُ عَلَىٰ كُلِّ شَيْءٍ مُّقْتَدِرًا", translation: "Et Allah est Omnipotent.", link: "https://quran.com/fr/18:45" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Qamar 54:42", url: "https://quran.com/fr/54:42" }
 ]
 },
 70: {
 detailedMeaning: "Al-Muqaddim derive de la racine q-d-m (avancer, preceder). Linguistiquement, le taqdim est linguistiquement le fait de mettre en avant et de faire preceder certaines choses sur d'autres selon un ordre sage. Al-Muqaddim est Celui qui avance les choses a leur place et a leur temps selon un ordre parfait. Allah avance ce qu'Il veut dans l'ordre et le temps, et que le croyant accepte Sa volonte, sachant que tout est dispose selon une sagesse parfaite. Le Prophete (paix sur lui) invoquait : Tu es Al-Muqaddim et Al-Mu'akhkhir, comme rapporte dans Sahih Bukhari (1120). Ce nom se comprend en pair avec Al-Mu'akhkhir.",
 quranVerses: [
 { surah: "Qaf", surahNumber: 50, ayah: 28, arabic: "قَالَ لَا تَخْتَصِمُوا لَدَيَّ وَقَدْ قَدَّمْتُ إِلَيْكُم بِالْوَعِيدِ", translation: "Il dira : Ne vous disputez pas devant Moi. Je vous avais avertis.", link: "https://quran.com/fr/50:28" }
 ],
 hadithReferences: [
 { collection: "Sahih Bukhari", number: "1120", text: "Le Prophete (paix sur lui) disait : O Allah, pardonne-moi ce que j'ai fait et ce que je ferai, ce que j'ai cache et ce que j'ai rendu public. Tu es Al-Muqaddim et Al-Mu'akhkhir.", link: "https://sunnah.com/bukhari:1120" }
 ],
 sources: [
 { label: "Quran.com - Qaf 50:28", url: "https://quran.com/fr/50:28" }
 ]
 },
 71: {
 detailedMeaning: "Al-Mu'akhkhir derive de la racine '-kh-r (retarder, reporter). Linguistiquement, le ta'khir est linguistiquement le fait de repousser et de retarder, complement naturel du taqdim (avancement). Al-Mu'akhkhir retarde les choses selon Sa sagesse, et qu'Il retarde le chatiment des pecheurs pour leur donner une chance de se repentir. Le report du chatiment est un signe de Sa patience et une occasion de repentir pour les desobeissants. Le Coran illustre ce sens dans Ibrahim (14:42) : Il les ajourne seulement jusqu'au jour ou les yeux seront fixes. Ce nom se comprend en pair avec Al-Muqaddim.",
 quranVerses: [
 { surah: "Ibrahim", surahNumber: 14, ayah: 42, arabic: "وَلَا تَحْسَبَنَّ اللَّهَ غَافِلًا عَمَّا يَعْمَلُ الظَّالِمُونَ إِنَّمَا يُؤَخِّرُهُمْ لِيَوْمٍ تَشْخَصُ فِيهِ الْأَبْصَارُ", translation: "Ne pense surtout pas qu'Allah est inattentif a ce que font les injustes. Il les ajourne seulement jusqu'au jour ou les yeux seront fixes.", link: "https://quran.com/fr/14:42" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ibrahim 14:42", url: "https://quran.com/fr/14:42" }
 ]
 },
 72: {
 detailedMeaning: "Al-Awwal derive de la racine '-w-l (etre premier). Linguistiquement, ce nom designe linguistiquement la primaute absolue dans l'existence : rien ne Le precede et Son existence n'a pas de commencement. Al-Awwal est Celui qui existait avant toute chose et que Son existence precede toute existence. L'eternite d'Allah dans le passe est un fondement de la foi, et qu'Il existait et rien n'existait avec Lui. Le Coran reunit ce nom avec trois autres dans Al-Hadid (57:3) : C'est Lui le Premier et le Dernier, l'Apparent et le Cache. Le Prophete (paix sur lui) invoquait : Tu es Al-Awwal et rien n'est avant Toi, comme rapporte dans Sahih Muslim (2713).",
 quranVerses: [
 { surah: "Al-Hadid", surahNumber: 57, ayah: 3, arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ", translation: "C'est Lui le Premier et le Dernier, l'Apparent et le Cache. Et Il est Omniscient.", link: "https://quran.com/fr/57:3" }
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
 detailedMeaning: "Al-Akhir derive de la racine '-kh-r (etre dernier) et designe Celui qui demeure apres la disparition de toute chose. Linguistiquement, linguistiquement, il designe Celui dont l'existence n'a pas de fin, a la difference de tout ce qui est cree. Il est eternel sans fin comme Il est eternel sans commencement, demeurant apres la disparition de toute chose. L'eternite d'Allah dans le futur est certaine et que le croyant s'attache a l'Eternel plutot qu'a l'ephemere. Ce nom apparait dans le verset d'Al-Hadid (57:3) aux cotes d'Al-Awwal, Az-Zahir et Al-Batin, formant un ensemble qui affirme la souverainete temporelle et spatiale absolue d'Allah.",
 quranVerses: [
 { surah: "Al-Hadid", surahNumber: 57, ayah: 3, arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ", translation: "C'est Lui le Premier et le Dernier, l'Apparent et le Cache.", link: "https://quran.com/fr/57:3" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hadid 57:3", url: "https://quran.com/fr/57:3" }
 ]
 },
 74: {
 detailedMeaning: "Az-Zahir derive de la racine z-h-r (apparaitre, etre manifeste) et designe Celui dont l'existence est evidente par les preuves et les signes. Linguistiquement, linguistiquement, ce nom indique Celui dont l'existence est rendue manifeste par la multitude des preuves dans la creation. Tout dans la creation pointe vers Lui, car Ses signes sont si nombreux que Son existence est plus evidente que toute autre realite. Rien n'est au-dessus de Lui, comme l'affirme le hadith : Tu es Az-Zahir et rien n'est au-dessus de Toi. Ce nom figure dans Al-Hadid (57:3) avec Al-Awwal, Al-Akhir et Al-Batin, affirmant Sa transcendance.",
 quranVerses: [
 { surah: "Al-Hadid", surahNumber: 57, ayah: 3, arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ", translation: "C'est Lui le Premier et le Dernier, l'Apparent et le Cache.", link: "https://quran.com/fr/57:3" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hadid 57:3", url: "https://quran.com/fr/57:3" }
 ]
 },
 75: {
 detailedMeaning: "Al-Batin derive de la racine b-t-n (etre cache, interieur) et designe Celui dont l'essence est cachee aux sens et a l'imagination, tout en etant connu par les preuves rationnelles. Linguistiquement, linguistiquement, l'essence divine ne peut etre apprehendee par aucune perception sensorielle. Son essence ne peut etre saisie par aucune creature dans ce monde. Allah est cache aux regards ici-bas, mais qu'Il sera vu dans l'au-dela par les croyants. Ce nom figure dans Al-Hadid (57:3) : Il est le Premier et le Dernier, l'Apparent et le Cache, et Il est Omniscient, montrant que Sa science embrasse tout.",
 quranVerses: [
 { surah: "Al-Hadid", surahNumber: 57, ayah: 3, arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ", translation: "C'est Lui le Premier et le Dernier, l'Apparent et le Cache. Et Il est Omniscient.", link: "https://quran.com/fr/57:3" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hadid 57:3", url: "https://quran.com/fr/57:3" }
 ]
 },
 76: {
 detailedMeaning: "Al-Wali derive de la racine w-l-y dans le sens de gouverner (wilaya) et designe Celui qui gere et administre les affaires de la creation avec autorite. Linguistiquement, linguistiquement, ce nom exprime la gouvernance totale et l'administration souveraine de toute chose. L'univers est Son royaume et que Sa gestion couvre chaque detail de la creation. Allah gouverne selon Son decret et que rien ne se produit sans Sa permission et Sa volonte. Ce nom apparait en lien avec le verset d'Ar-Ra'd (13:11), soulignant que la protection divine s'exerce par l'intermediaire de Ses anges et de Son decret.",
 quranVerses: [
 { surah: "Ar-Ra'd", surahNumber: 13, ayah: 11, arabic: "لَهُ مُعَقِّبَاتٌ مِّن بَيْنِ يَدَيْهِ وَمِنْ خَلْفِهِ يَحْفَظُونَهُ مِنْ أَمْرِ اللَّهِ", translation: "Il a des anges qui se succedent devant et derriere lui et le protegent par l'ordre d'Allah.", link: "https://quran.com/fr/13:11" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Ra'd 13:11", url: "https://quran.com/fr/13:11" }
 ]
 },
 77: {
 detailedMeaning: "Al-Muta'ali derive de la racine '-l-w sur le schema mutafa'il, exprimant l'elevation absolue au-dessus de tout, depassant toute description et toute limitation. Linguistiquement, linguistiquement, cette forme indique une transcendance active et permanente qui surpasse tout. Il est eleve au-dessus de tout ce que les creatures peuvent Lui attribuer et que Sa transcendance depasse toute comprehension. Cette elevation est un attribut affirme par le Coran et la Sunna. Ce nom apparait dans Ar-Ra'd (13:9) couple avec Al-Kabir : le Connaisseur de l'invisible et du visible, le Tres Grand, le Tres Eleve, affirmant Sa majeste supreme.",
 quranVerses: [
 { surah: "Ar-Ra'd", surahNumber: 13, ayah: 9, arabic: "عَالِمُ الْغَيْبِ وَالشَّهَادَةِ الْكَبِيرُ الْمُتَعَالِ", translation: "Le Connaisseur de l'invisible et du visible, le Tres Grand, le Tres Eleve.", link: "https://quran.com/fr/13:9" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Ra'd 13:9", url: "https://quran.com/fr/13:9" }
 ]
 },
 78: {
 detailedMeaning: "Al-Barr derive de la racine b-r-r (etre bienfaisant, pieux) et designe Celui dont la bonte englobante touche tout etre. Linguistiquement, linguistiquement, al-birr designe la bonte universelle qui s'etend a toute creature sans distinction. Sa bienfaisance atteint toutes les creatures, obeissantes ou desobeissantes, car Sa bonte n'est pas conditionnee par le merite. Il est bon envers tous, meme ceux qui Lui desobeissent, leur accordant sante et subsistance comme delai pour le repentir. Ce nom apparait dans At-Tur (52:28) couple avec Ar-Rahim : C'est Lui le Bienfaisant, le Misericordieux, soulignant l'alliance de la bonte et de la misericorde.",
 quranVerses: [
 { surah: "At-Tur", surahNumber: 52, ayah: 28, arabic: "إِنَّا كُنَّا مِن قَبْلُ نَدْعُوهُ إِنَّهُ هُوَ الْبَرُّ الرَّحِيمُ", translation: "Nous L'invoquions auparavant. C'est Lui le Bienfaisant, le Misericordieux.", link: "https://quran.com/fr/52:28" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - At-Tur 52:28", url: "https://quran.com/fr/52:28" }
 ]
 },
 79: {
 detailedMeaning: "At-Tawwab derive de la racine t-w-b (revenir) selon le schema fa''al, forme intensive exprimant la repetition et la constance dans l'acceptation du repentir. Linguistiquement, la tawba d'Allah signifie qu'Il Se tourne vers Son serviteur avec misericorde, facilitant et acceptant son retour. Il ne cesse d'accepter le repentir quel que soit le nombre des retours, car Il inspire le repentir puis l'accepte. Cette porte reste ouverte tant que le soleil ne se leve pas de l'ouest. Ce nom apparait dans Al-Baqara (2:37) et An-Nasr (110:3), et le hadith rapporte qu'Allah est plus heureux du repentir de Son serviteur que celui qui retrouve sa monture egaree.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 37, arabic: "فَتَلَقَّىٰ آدَمُ مِن رَّبِّهِ كَلِمَاتٍ فَتَابَ عَلَيْهِ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ", translation: "Adam recut de son Seigneur des paroles, et Allah agrea son repentir. Car c'est Lui le Repentant, le Misericordieux.", link: "https://quran.com/fr/2:37" },
 { surah: "An-Nasr", surahNumber: 110, ayah: 3, arabic: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا", translation: "Glorifie ton Seigneur et implore Son pardon. Il est certes Celui qui accepte le repentir.", link: "https://quran.com/fr/110:3" }
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
 detailedMeaning: "Al-Muntaqim derive de la racine n-q-m (tirer vengeance) et designe Celui qui inflige le chatiment juste a celui qui persiste dans la transgression apres les avertissements. Linguistiquement, linguistiquement, l'intiqam est la retribution meritee qui suit l'obstination dans le mal. Il ne se venge que de ceux qui le meritent, apres leur avoir accorde des delais, et que Sa vengeance est justice pure. Le croyant se hate de se repentir pour eviter cette vengeance. Ce nom est atteste dans As-Sajda (32:22) : Nous nous vengerons des criminels, et Ali 'Imran (3:4) : Allah est Tout Puissant, Detenteur de la vengeance.",
 quranVerses: [
 { surah: "As-Sajda", surahNumber: 32, ayah: 22, arabic: "إِنَّا مِنَ الْمُجْرِمِينَ مُنتَقِمُونَ", translation: "Nous nous vengerons des criminels.", link: "https://quran.com/fr/32:22" },
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 4, arabic: "وَاللَّهُ عَزِيزٌ ذُو انتِقَامٍ", translation: "Et Allah est Tout Puissant, Detenteur de la vengeance.", link: "https://quran.com/fr/3:4" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - As-Sajda 32:22", url: "https://quran.com/fr/32:22" }
 ]
 },
 81: {
 detailedMeaning: "Al-'Afuw derive de la racine '-f-w (effacer) et designe Celui qui efface les peches de maniere totale et definitive. Linguistiquement, linguistiquement, le 'afw est superieur au ghufran : le pardon couvre le peche tandis que l'effacement le supprime entierement du registre. L'effacement ne laisse aucune trace contrairement au simple pardon. Le croyant invoque Al-'Afuw dans la Nuit du Destin, comme l'a enseigne le Prophete a Aisha : Allahumma innaka 'Afuwwun tuhibbu al-'afwa fa'fu 'anni. Ce nom apparait dans An-Nisa (4:149) couple avec Al-Qadir, et Ash-Shura (42:25) : Il accepte le repentir et efface les mauvaises actions.",
 quranVerses: [
 { surah: "An-Nisa", surahNumber: 4, ayah: 149, arabic: "فَإِنَّ اللَّهَ كَانَ عَفُوًّا قَدِيرًا", translation: "Certes, Allah est Indulgent et Omnipotent.", link: "https://quran.com/fr/4:149" },
 { surah: "Ash-Shura", surahNumber: 42, ayah: 25, arabic: "وَهُوَ الَّذِي يَقْبَلُ التَّوْبَةَ عَنْ عِبَادِهِ وَيَعْفُو عَنِ السَّيِّئَاتِ", translation: "C'est Lui qui accepte le repentir de Ses serviteurs et efface les mauvaises actions.", link: "https://quran.com/fr/42:25" }
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
 detailedMeaning: "Ar-Ra'uf derive de la racine r-'-f (etre compatissant) et designe Celui dont la compassion est le degre le plus delicat de la misericorde. Linguistiquement, linguistiquement, la ra'fa est plus tendre et plus intime que la rahma generale, representant la fine fleur de la misericorde. C'est le sommet de la misericorde divine, surpassant en douceur toute autre clemence. Cette compassion se manifeste par l'allegement des obligations et la facilitation de la religion. Ce nom apparait dans Al-Baqara (2:207) : Allah est Compatissant envers les serviteurs, et dans Al-Hajj (22:65) couple avec Ar-Rahim, soulignant l'alliance de compassion et de misericorde.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 207, arabic: "وَاللَّهُ رَءُوفٌ بِالْعِبَادِ", translation: "Et Allah est Compatissant envers les serviteurs.", link: "https://quran.com/fr/2:207" },
 { surah: "Al-Hajj", surahNumber: 22, ayah: 65, arabic: "إِنَّ اللَّهَ بِالنَّاسِ لَرَءُوفٌ رَّحِيمٌ", translation: "Certes, Allah est plein de Compassion et de Misericorde envers les gens.", link: "https://quran.com/fr/22:65" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:207", url: "https://quran.com/fr/2:207" }
 ]
 },
 83: {
 detailedMeaning: "Malik-ul-Mulk est une construction d'annexion (idafa) signifiant le Possesseur de toute royaute. Linguistiquement, linguistiquement, le mulk designe la souverainete totale et le pouvoir absolu de disposition. Toute royaute appartient a Allah et que les rois de la terre ne sont que des depositaires temporaires de Son pouvoir. Les gouvernants ne detiennent qu'un pouvoir emprunte et temporaire. Ce nom est atteste dans Ali 'Imran (3:26) : Dis : O Allah, Maitre de l'autorite absolue, Tu donnes l'autorite a qui Tu veux et Tu arraches l'autorite a qui Tu veux, affirmant Sa souverainete sans partage.",
 quranVerses: [
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 26, arabic: "قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَن تَشَاءُ وَتَنزِعُ الْمُلْكَ مِمَّن تَشَاءُ", translation: "Dis : O Allah, Maitre de l'autorite absolue. Tu donnes l'autorite a qui Tu veux et Tu arraches l'autorite a qui Tu veux.", link: "https://quran.com/fr/3:26" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ali 'Imran 3:26", url: "https://quran.com/fr/3:26" }
 ]
 },
 84: {
 detailedMeaning: "Dhul-Jalali wal-Ikram est compose de dhu (possesseur), jalal (majeste) et ikram (generosite), reunissant les attributs de grandeur et de bonte. Linguistiquement, linguistiquement, ce nom rassemble deux dimensions complementaires de la perfection divine. La majeste inspire la veneration et la crainte, tandis que la generosite inspire la gratitude. Le croyant invoque Allah par ce nom comme l'a ordonne le Prophete. Ce nom apparait dans Ar-Rahman (55:27) : Seule subsistera la Face de ton Seigneur, plein de majeste et de noblesse, et le hadith rapporte par At-Tirmidhi enjoint de persister a invoquer Ya Dhal-Jalali wal-Ikram.",
 quranVerses: [
 { surah: "Ar-Rahman", surahNumber: 55, ayah: 27, arabic: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ", translation: "Seule subsistera la Face de ton Seigneur, plein de majeste et de noblesse.", link: "https://quran.com/fr/55:27" },
 { surah: "Ar-Rahman", surahNumber: 55, ayah: 78, arabic: "تَبَارَكَ اسْمُ رَبِّكَ ذِي الْجَلَالِ وَالْإِكْرَامِ", translation: "Beni soit le nom de ton Seigneur, plein de majeste et de noblesse.", link: "https://quran.com/fr/55:78" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Rahman 55:27", url: "https://quran.com/fr/55:27" }
 ]
 },
 85: {
 detailedMeaning: "Al-Muqsit derive de la racine q-s-t (etre equitable) sur le schema muf'il, forme causale indiquant Celui qui etablit la justice. Linguistiquement, linguistiquement, le qist est la justice dans l'application, le fait de donner a chacun ce qui lui revient sans exces ni manquement. Il recompense l'obeissant et punit le desobeissant, chacun selon ce qu'il merite. Le Jour du Jugement les balances seront etablies avec equite et qu'aucune ame ne sera lesee. Ce nom est lie au verset d'Al-Anbiya (21:47) : Nous placerons les balances de la justice le Jour de la Resurrection, aucune ame ne sera lesee en rien, affirmant la retribution parfaite.",
 quranVerses: [
 { surah: "Al-Anbiya", surahNumber: 21, ayah: 47, arabic: "وَنَضَعُ الْمَوَازِينَ الْقِسْطَ لِيَوْمِ الْقِيَامَةِ فَلَا تُظْلَمُ نَفْسٌ شَيْئًا", translation: "Nous placerons les balances de la justice le Jour de la Resurrection. Aucune ame ne sera lesee en rien.", link: "https://quran.com/fr/21:47" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Anbiya 21:47", url: "https://quran.com/fr/21:47" }
 ]
 },
 86: {
 detailedMeaning: "Al-Jami' derive de la racine j-m-' (rassembler, reunir) selon le schema fa'il, designant un attribut permanent. Linguistiquement, linguistiquement, le jam' est la reunion de choses dispersees, que ce soient les creatures pour le Jugement ou les bienfaits pour Ses serviteurs. Il rassemble les creatures le Jour du Jugement et reunit les bienfaits pour Ses serviteurs. Le croyant s'y prepare par la foi et les bonnes oeuvres. Ce nom apparait dans Ali 'Imran (3:9) : Tu es Celui qui rassemblera les gens, un jour au sujet duquel il n'y a aucun doute, et dans At-Taghabun (64:9) au sujet du Jour du Rassemblement.",
 quranVerses: [
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 9, arabic: "رَبَّنَا إِنَّكَ جَامِعُ النَّاسِ لِيَوْمٍ لَّا رَيْبَ فِيهِ", translation: "Seigneur, Tu es Celui qui rassemblera les gens, un jour au sujet duquel il n'y a aucun doute.", link: "https://quran.com/fr/3:9" },
 { surah: "At-Taghabun", surahNumber: 64, ayah: 9, arabic: "يَوْمَ يَجْمَعُكُمْ لِيَوْمِ الْجَمْعِ ذَٰلِكَ يَوْمُ التَّغَابُنِ", translation: "Le jour ou Il vous rassemblera pour le Jour du Rassemblement, ce sera le jour de la revelation des pertes.", link: "https://quran.com/fr/64:9" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ali 'Imran 3:9", url: "https://quran.com/fr/3:9" }
 ]
 },
 87: {
 detailedMeaning: "Al-Ghani derive de la racine gh-n-y (etre riche, se suffire) et designe Celui dont l'autosuffisance est absolue : Il n'a besoin de rien tandis que tout a besoin de Lui. Linguistiquement, linguistiquement, le ghina est l'independance totale de toute creature et de tout besoin. Meme si toutes les creatures L'adoraient ou Le reniaient, cela n'ajouterait rien a Sa richesse. Cette richesse est inherente a Son essence. Ce nom apparait dans Fatir (35:15) : O hommes, vous etes les indigents ayant besoin d'Allah, et c'est Allah le Riche, le Digne de louange, soulignant le contraste entre la richesse divine et la pauvrete des creatures.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 263, arabic: "وَاللَّهُ غَنِيٌّ حَلِيمٌ", translation: "Et Allah est Riche et Clement.", link: "https://quran.com/fr/2:263" },
 { surah: "Fatir", surahNumber: 35, ayah: 15, arabic: "يَا أَيُّهَا النَّاسُ أَنتُمُ الْفُقَرَاءُ إِلَى اللَّهِ وَاللَّهُ هُوَ الْغَنِيُّ الْحَمِيدُ", translation: "O hommes, vous etes les indigents ayant besoin d'Allah, et c'est Allah le Riche, le Digne de louange.", link: "https://quran.com/fr/35:15" }
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
 detailedMeaning: "Al-Mughni derive de la racine gh-n-y sous la forme af'ala (causale), indiquant Celui qui rend riche et autosuffisant. Linguistiquement, linguistiquement, l'ighna' est le fait de rendre riche, que ce soit par les biens materiels ou la richesse du coeur. La vraie richesse n'est pas l'abondance des biens mais la richesse du coeur, et que c'est Allah seul qui accorde cette independance. Le croyant demande la richesse a Allah seul et Lui en est reconnaissant. Ce nom apparait dans An-Najm (53:48) : C'est Lui qui enrichit et qui donne satisfaction, et dans At-Tawba (9:28) : Si vous craignez la pauvrete, Allah vous enrichira de Sa grace.",
 quranVerses: [
 { surah: "An-Najm", surahNumber: 53, ayah: 48, arabic: "وَأَنَّهُ هُوَ أَغْنَىٰ وَأَقْنَىٰ", translation: "Et c'est Lui qui enrichit et qui donne satisfaction.", link: "https://quran.com/fr/53:48" },
 { surah: "At-Tawba", surahNumber: 9, ayah: 28, arabic: "وَإِنْ خِفْتُمْ عَيْلَةً فَسَوْفَ يُغْنِيكُمُ اللَّهُ مِن فَضْلِهِ", translation: "Et si vous craignez la pauvrete, Allah vous enrichira de Sa grace.", link: "https://quran.com/fr/9:28" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - An-Najm 53:48", url: "https://quran.com/fr/53:48" }
 ]
 },
 89: {
 detailedMeaning: "Al-Mani' derive de la racine m-n-' (empecher, interdire) et designe Celui qui retient et empeche selon Sa sagesse. Linguistiquement, linguistiquement, le man' est le fait de retenir et d'empecher, que ce soit le mal d'atteindre les proteges ou le bien d'atteindre ceux qui n'en sont pas dignes. Il est le Bouclier des croyants, empechant le mal de les atteindre et retenant ce qu'Il veut. Le croyant cherche refuge aupres d'Allah et sait que seul Allah peut le proteger. Ce nom se comprend en lien avec An-Nas (114:1) : Dis : Je cherche protection aupres du Seigneur des hommes, soulignant qu'Allah seul est le veritable protecteur.",
 quranVerses: [
 { surah: "An-Nas", surahNumber: 114, ayah: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", translation: "Dis : Je cherche protection aupres du Seigneur des hommes.", link: "https://quran.com/fr/114:1" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - An-Nas 114:1", url: "https://quran.com/fr/114:1" }
 ]
 },
 90: {
 detailedMeaning: "Ad-Darr derive de la racine d-r-r (nuire) et designe Celui qui decrete l'epreuve selon Sa sagesse. Linguistiquement, linguistiquement, le darr est le contraire du naf' (profit) et que ce nom ne s'emploie pas seul mais en pair avec An-Nafi', exprimant la souverainete totale d'Allah. L'epreuve contient toujours une sagesse cachee et un bien potentiel, et qu'il ne faut pas invoquer ce nom isolement. Nul ne peut nuire sans la permission d'Allah et que le croyant patiente dans l'epreuve. Ce nom est atteste dans Al-An'am (6:17) : Si Allah te touche d'un mal, nul ne peut l'enlever sauf Lui.",
 quranVerses: [
 { surah: "Al-An'am", surahNumber: 6, ayah: 17, arabic: "وَإِن يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ", translation: "Si Allah te touche d'un mal, nul ne peut l'enlever sauf Lui.", link: "https://quran.com/fr/6:17" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-An'am 6:17", url: "https://quran.com/fr/6:17" }
 ]
 },
 91: {
 detailedMeaning: "An-Nafi' derive de la racine n-f-' (profiter) et designe Celui qui est la source veritable de tout profit pour Ses creatures. Linguistiquement, linguistiquement, le naf' est tout ce qui apporte un bien ou un avantage, et qu'Allah seul en est la source. Les creatures ne peuvent ni profiter ni nuire par elles-memes, car tout est entre les mains d'Allah. Tout profit vient d'Allah seul et que le croyant ne demande qu'a Lui. Ce nom est atteste dans Al-Fath (48:11) : Qui peut quoi que ce soit pour vous contre Allah, s'Il vous veut du mal ou du bien, et le hadith d'At-Tirmidhi enseigne que nul ne pourrait profiter que par ce qu'Allah a ecrit.",
 quranVerses: [
 { surah: "Al-Fath", surahNumber: 48, ayah: 11, arabic: "قُلْ فَمَن يَمْلِكُ لَكُم مِّنَ اللَّهِ شَيْئًا إِنْ أَرَادَ بِكُمْ ضَرًّا أَوْ أَرَادَ بِكُمْ نَفْعًا", translation: "Dis : Qui donc peut quoi que ce soit pour vous contre Allah, s'Il vous veut du mal ou s'Il vous veut du bien ?", link: "https://quran.com/fr/48:11" }
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
 detailedMeaning: "An-Nur derive de la racine n-w-r (eclairer) et designe Celui par qui tout est eclaire et manifeste. Linguistiquement, linguistiquement, le nur est ce qui rend les choses visibles, et qu'Allah est appele Nur car c'est par Lui que tout est eclaire. Par Sa lumiere, les cieux et la terre sont illumines et leurs habitants guides. Il est la Lumiere en Soi et que toute lumiere dans l'univers n'est qu'un reflet de Sa lumiere. Le voile d'Allah est la lumiere, et que s'Il le levait, la splendeur de Son visage brulerait tout. Ce nom est atteste dans le celebre verset d'An-Nur (24:35) : Allah est la Lumiere des cieux et de la terre.",
 quranVerses: [
 { surah: "An-Nur", surahNumber: 24, ayah: 35, arabic: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", translation: "Allah est la Lumiere des cieux et de la terre.", link: "https://quran.com/fr/24:35" }
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
 detailedMeaning: "Al-Hadi derive de la racine h-d-y (guider) et designe Celui qui guide Ses creatures vers ce qui leur est profitable. Linguistiquement, linguistiquement, la hidaya comporte plusieurs degres : la guidance generale (dalala), la guidance par inspiration (ilham) et la guidance par la revelation (wahiy). La guidance supreme est celle de la foi, et qu'Allah guide chaque creature vers ce qui lui convient. C'est le plus grand bienfait et que le croyant la demande constamment dans Al-Fatiha. Ce nom apparait dans Al-Hajj (22:54) : Allah guide ceux qui croient vers un droit chemin, et dans Al-Furqan (25:31) : Ton Seigneur suffit comme Guide et Secoureur.",
 quranVerses: [
 { surah: "Al-Hajj", surahNumber: 22, ayah: 54, arabic: "وَإِنَّ اللَّهَ لَهَادِ الَّذِينَ آمَنُوا إِلَىٰ صِرَاطٍ مُّسْتَقِيمٍ", translation: "Et certes, Allah guide ceux qui croient vers un droit chemin.", link: "https://quran.com/fr/22:54" },
 { surah: "Al-Furqan", surahNumber: 25, ayah: 31, arabic: "وَكَفَىٰ بِرَبِّكَ هَادِيًا وَنَصِيرًا", translation: "Et ton Seigneur suffit comme Guide et Secoureur.", link: "https://quran.com/fr/25:31" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hajj 22:54", url: "https://quran.com/fr/22:54" }
 ]
 },
 94: {
 detailedMeaning: "Al-Badi' derive de la racine b-d-' (innover, creer de maniere inedite) et designe Celui qui cree sans modele prealable ni precedent. Linguistiquement, linguistiquement, l'ibda' est la creation sans modele precedent, temoignant d'une puissance creatrice absolue. Il a invente les choses de maniere inedite et que Sa creation est unique et incomparable. La diversite de Sa creation est une preuve eclatante de Son unicite et de Sa sagesse. Ce nom apparait dans Al-Baqara (2:117) : Createur des cieux et de la terre, lorsqu'Il decide une chose, Il dit seulement : Sois ! Et elle est, et dans Al-An'am (6:101) : Createur originel des cieux et de la terre.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 117, arabic: "بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ وَإِذَا قَضَىٰ أَمْرًا فَإِنَّمَا يَقُولُ لَهُ كُن فَيَكُونُ", translation: "Createur des cieux et de la terre. Lorsqu'Il decide une chose, Il dit seulement : Sois ! Et elle est.", link: "https://quran.com/fr/2:117" },
 { surah: "Al-An'am", surahNumber: 6, ayah: 101, arabic: "بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ", translation: "Createur originel des cieux et de la terre.", link: "https://quran.com/fr/6:101" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:117", url: "https://quran.com/fr/2:117" }
 ]
 },
 95: {
 detailedMeaning: "Al-Baqi derive de la racine b-q-y (demeurer, persister) et designe Celui dont la permanence est eternelle, l'oppose du fana' (aneantissement) qui touche toute la creation. Linguistiquement, linguistiquement, le baqa' est la permanence absolue et inalterable, sans changement ni fin. Il demeure apres l'aneantissement de toute chose creee, car Son existence est necessaire et non contingente. Le croyant s'attache a l'Eternel et ne se lamente pas pour ce monde ephemere. Ce nom est atteste dans Ar-Rahman (55:27) : Seule subsistera la Face de ton Seigneur, plein de majeste et de noblesse, et dans Al-Qasas (28:88) : Toute chose perira sauf Sa Face.",
 quranVerses: [
 { surah: "Ar-Rahman", surahNumber: 55, ayah: 27, arabic: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ", translation: "Seule subsistera la Face de ton Seigneur, plein de majeste et de noblesse.", link: "https://quran.com/fr/55:27" },
 { surah: "Al-Qasas", surahNumber: 28, ayah: 88, arabic: "كُلُّ شَيْءٍ هَالِكٌ إِلَّا وَجْهَهُ", translation: "Toute chose perira sauf Sa Face.", link: "https://quran.com/fr/28:88" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Rahman 55:27", url: "https://quran.com/fr/55:27" }
 ]
 },
 96: {
 detailedMeaning: "Al-Warith derive de la racine w-r-th (heriter) et designe Celui qui demeure apres la fin de toute creature, heritant de tout. Linguistiquement, linguistiquement, l'irth designe ce qui reste apres la disparition du premier possesseur, et qu'Allah herite de tout car Il demeure eternellement. Il herite de la terre et de ce qui s'y trouve quand toute creature aura peri. Le croyant se detache des biens sachant qu'ils ne sont que pret temporaire. Ce nom apparait dans Al-Hijr (15:23) : C'est Nous qui donnons la vie et la mort, et c'est Nous les Heritiers, et dans Maryam (19:40) : C'est Nous qui heriterons de la terre et de ceux qui s'y trouvent.",
 quranVerses: [
 { surah: "Al-Hijr", surahNumber: 15, ayah: 23, arabic: "وَإِنَّا لَنَحْنُ نُحْيِي وَنُمِيتُ وَنَحْنُ الْوَارِثُونَ", translation: "Et c'est Nous qui donnons la vie et qui donnons la mort, et c'est Nous les Heritiers.", link: "https://quran.com/fr/15:23" },
 { surah: "Maryam", surahNumber: 19, ayah: 40, arabic: "إِنَّا نَحْنُ نَرِثُ الْأَرْضَ وَمَنْ عَلَيْهَا وَإِلَيْنَا يُرْجَعُونَ", translation: "C'est Nous qui heriterons de la terre et de ceux qui s'y trouvent. Et c'est vers Nous qu'ils seront ramenes.", link: "https://quran.com/fr/19:40" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hijr 15:23", url: "https://quran.com/fr/15:23" }
 ]
 },
 97: {
 detailedMeaning: "Ar-Rashid derive de la racine r-sh-d (etre bien guide, diriger avec sagesse) et designe Celui qui dirige toute chose vers sa fin avec sagesse et bon ordre. Linguistiquement, linguistiquement, le rushd est la bonne direction et la sagesse dans la conduite des affaires, l'oppose de l'egarement (ghayy). Ses decisions menent toujours au meilleur resultat et que Sa direction est infaillible. Le croyant suit la guidance d'Allah telle qu'elle est venue dans le Coran et la Sunna. Ce nom se comprend en lien avec le verset de Hud (11:87), et il est souvent cite aux cotes d'Al-Hadi pour souligner la perfection de la guidance divine.",
 quranVerses: [
 { surah: "Hud", surahNumber: 11, ayah: 87, arabic: "أَصَلَاتُكَ تَأْمُرُكَ أَن نَّتْرُكَ مَا يَعْبُدُ آبَاؤُنَا", translation: "Est-ce que ta priere te commande de nous faire abandonner ce qu'adoraient nos ancetres ?", link: "https://quran.com/fr/11:87" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Hud 11:87", url: "https://quran.com/fr/11:87" }
 ]
 },
 98: {
 detailedMeaning: "As-Sabur derive de la racine s-b-r (patienter) selon le schema fa'ul, forme intensive exprimant la perfection de la patience. Linguistiquement, linguistiquement, le sabr est la maitrise de soi face a ce qui provoque, et que le retard du chatiment est un choix sage. Il ne Se hate pas de punir les desobeissants, leur donnant un delai non par impuissance mais par sagesse et misericorde. Il voit la desobeissance mais accorde un sursis, esperant le repentir. Le croyant profite de ce delai pour se repentir. Ce nom est atteste par le hadith rapporte par Al-Bukhari : Personne n'est plus patient face a une parole blessante qu'Allah.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 153, arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", translation: "O les croyants ! Cherchez secours dans la patience et la priere. Certes, Allah est avec les patients.", link: "https://quran.com/fr/2:153" }
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
 detailedMeaning: "Allah est le nom supreme (ism al-dhat) qui designe l'Etre necessaire doue de tous les attributs de perfection. Linguistiquement, les grammairiens divergent sur sa derivation : certains le derivent de a-l-h (adorer), d'autres considerent qu'il est un nom originel non derive (ghayru mushtaqq). Ce nom est le plus grand de tous les noms divins, contenant tous les attributs de perfection, et que tous les autres noms Lui sont subordonnes. C'est le nom le plus complet car il englobe tous les autres. Il est le fondement de tous les beaux noms. Ce nom est au coeur du Coran, dans Al-Ikhlas (112:1), Al-Hashr (59:22) et Ta-Ha (20:14).",
 quranVerses: [
 { surah: "Al-Ikhlas", surahNumber: 112, ayah: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Dis : Il est Allah, Unique.", link: "https://quran.com/fr/112:1" },
 { surah: "Al-Hashr", surahNumber: 59, ayah: 22, arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ هُوَ الرَّحْمَٰنُ الرَّحِيمُ", translation: "C'est Lui Allah. Nulle divinite a part Lui, le Connaisseur de l'invisible et du visible. C'est Lui le Tout Misericordieux, le Tres Misericordieux.", link: "https://quran.com/fr/59:22" },
 { surah: "Ta-Ha", surahNumber: 20, ayah: 14, arabic: "إِنَّنِي أَنَا اللَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدْنِي", translation: "C'est Moi Allah. Point de divinite que Moi. Adore-Moi donc.", link: "https://quran.com/fr/20:14" }
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