/**
 * Al-Asmaa — Encyclopedie enrichie des 99 Noms d'Allah
 * Sources vérifiées — février 2026
 *
 * Savants de référence :
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
 citation: "Al-Fiqh al-Akbar, traité fondateur de la croyance islamique, par l'imam Abu Hanifa.",
 links: [
 { label: "Al-Fiqh al-Akbar — traduction anglaise (Archive.org)", url: "https://archive.org/details/al-fiqh-al-akbar", lang: "en" },
 { label: "La croyance de l'imam Abu Hanifa — Islamhouse (PDF)", url: "https://d1.islamhouse.com/data/fr/ih_articles/single/fr-aqeedah-tahawiyyah.pdf", lang: "fr" }
 ]
 },
 malik: {
 author: "Malik ibn Anas (m. 179 H / 795)",
 title: "Al-Muwatta",
 citation: "Al-Muwatta, premier recueil de hadith et de fiqh systématique, par l'imam Malik ibn Anas.",
 links: [
 { label: "Al-Muwatta — collection complète (Sunnah.com)", url: "https://sunnah.com/malik", lang: "en" },
 { label: "Al-Muwatta de l'imam Malik — Islamhouse (PDF)", url: "https://d1.islamhouse.com/data/fr/ih_books/single2/fr_Al_Mouwattaa.pdf", lang: "fr" }
 ]
 },
 shafii_imam: {
 author: "Muhammad ibn Idris Ash-Shafi'i (m. 204 H / 820)",
 title: "Al-Risala",
 citation: "Al-Risala, traité fondateur des usul al-fiqh (principes de jurisprudence), par l'imam Ash-Shafi'i.",
 links: [
 { label: "Al-Risala — traduction Majid Khadduri (Archive.org)", url: "https://archive.org/details/imam-shafi-treatise-on-the-foundations-of-islamic-jurisprudence", lang: "en" },
 { label: "Biographie et œuvre de l'imam Ash-Shafi'i — Islamhouse", url: "https://d1.islamhouse.com/data/fr/ih_articles/single/fr-biographie-imam-chafii.pdf", lang: "fr" }
 ]
 },
 bukhari: {
 author: "Muhammad ibn Isma'il Al-Bukhari (m. 256 H / 870)",
 title: "Sahih al-Bukhari",
 citation: "Sahih al-Bukhari, le recueil de hadiths le plus authentique selon le consensus des savants, par l'imam Al-Bukhari.",
 links: [
 { label: "Sahih al-Bukhari — collection complète (Sunnah.com)", url: "https://sunnah.com/bukhari", lang: "en" },
 { label: "Sahih al-Bukhari — traduction francaise (Archive.org)", url: "https://archive.org/details/sahih-al-bukhari-en-francais", lang: "fr" }
 ]
 },
 muslim: {
 author: "Muslim ibn al-Hajjaj (m. 261 H / 875)",
 title: "Sahih Muslim",
 citation: "Sahih Muslim, second recueil de hadiths le plus authentique, par l'imam Muslim.",
 links: [
 { label: "Sahih Muslim — collection complète (Sunnah.com)", url: "https://sunnah.com/muslim", lang: "en" },
 { label: "Sahih Muslim — traduction francaise (Archive.org)", url: "https://archive.org/details/sahih-muslim-en-francais", lang: "fr" }
 ]
 },
 nawawi: {
 author: "Yahya ibn Sharaf An-Nawawi (m. 676 H / 1277)",
 title: "Riyad al-Salihin / Sharh Sahih Muslim",
 citation: "Riyad al-Salihin (Les Jardins des Vertueux) et Sharh Sahih Muslim, œuvres majeures de l'imam An-Nawawi.",
 links: [
 { label: "Riyad al-Salihin — collection complète (Sunnah.com)", url: "https://sunnah.com/riyadussalihin", lang: "en" },
 { label: "Les Jardins des Vertueux — traduction francaise (Archive.org)", url: "https://archive.org/details/riyad-es-salihin-les-jardins-des-vertueux", lang: "fr" }
 ]
 },
 qurtubi: {
 author: "Abu Abdillah Al-Qurtubi (m. 671 H / 1273)",
 title: "Al-Jami' li-Ahkam al-Quran (Tafsir al-Qurtubi)",
 citation: "Al-Jami' li-Ahkam al-Quran, tafsir encyclopédique de référence, par l'imam Al-Qurtubi.",
 links: [
 { label: "Tafsir Al-Qurtubi — Quran.com", url: "https://quran.com/en/1:1/tafsirs/en-tafisr-al-qurtubi", lang: "en" },
 { label: "Les 99 plus beaux Noms d'Allah — IslamWeb", url: "https://www.islamweb.net/fr/article/164167/Les-99-plus-beaux-Noms-dAllah", lang: "fr" }
 ]
 },
 ibn_kathir: {
 author: "Isma'il ibn Umar Ibn Kathir (m. 774 H / 1373)",
 title: "Tafsir al-Quran al-Azim (Tafsir Ibn Kathir)",
 citation: "Tafsir Ibn Kathir, exégèse coranique de référence par l'imam Ibn Kathir.",
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
 citation: "Al-Asna fi Sharh Asma' Allah al-Husna, exégèse sur les Noms divins, par l'imam Al-Qurtubi.",
 links: [
 { label: "Les 99 plus beaux Noms d'Allah — IslamWeb", url: "https://www.islamweb.net/fr/article/164167/Les-99-plus-beaux-Noms-dAllah", lang: "fr" },
 { label: "Tafsir Al-Qurtubi — Quran.com", url: "https://quran.com/en/1:1/tafsirs/en-tafisr-al-qurtubi", lang: "en" }
 ]
 },
 qurtubi_tafsir: {
 author: "Abu Abdillah Al-Qurtubi (m. 671 H / 1273)",
 title: "Al-Jami' li-Ahkam al-Quran (Tafsir al-Qurtubi)",
 citation: "Al-Jami' li-Ahkam al-Quran, tafsir encyclopédique, par l'imam Al-Qurtubi.",
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
 { label: "Œuvres d'Ibn al-Qayyim — Kalamullah", url: "https://kalamullah.com/ibn-qayyim.html", lang: "en" },
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
 detailedMeaning: "Ar-Rahman dérive de la racine r-h-m (la miséricorde) selon le schéma morphologique fa'lan, qui exprime l'intensité maximale et la plénitude de l'attribut. Il désigne Celui dont la miséricorde englobe toute la création sans distinction, croyants et non-croyants, dans ce bas monde. Ce nom est exclusif à Allah et ne peut être attribué à aucune créature. Linguistiquement, la forme fa'lan indique une miséricorde débordante et universelle. Ar-Rahman est Celui qui veut le bien pour toutes les créatures, leur accorde l'existence et les guide vers ce qui leur est profitable.",
 quranVerses: [
 { surah: "Al-Fatiha", surahNumber: 1, ayah: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.", link: "https://quran.com/fr/1:1" },
 { surah: "Ta-Ha", surahNumber: 20, ayah: 5, arabic: "الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ", translation: "Le Tout Miséricordieux S'est établi sur le Trône.", link: "https://quran.com/fr/20:5" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Fatiha 1:1", url: "https://quran.com/fr/1:1" }
 ]
 },
 2: {
 detailedMeaning: "Ar-Rahim dérive de la même racine r-h-m que Ar-Rahman, mais selon le schéma fa'il, qui désigne un attribut constant et permanent. Il indique la miséricorde spéciale qu'Allah réserve aux croyants dans l'au-delà, comme l'atteste le verset : Il est Miséricordieux envers les croyants (33:43). Si Ar-Rahman exprime la volonté universelle de bien, Ar-Rahim en est la réalisation pour ceux qui acceptent la guidance divine. Ar-Rahman décrit l'attribut de miséricorde inhérent à l'essence divine, tandis qu'Ar-Rahim décrit l'acte de miséricorde envers les croyants.",
 quranVerses: [
 { surah: "Al-Fatiha", surahNumber: 1, ayah: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.", link: "https://quran.com/fr/1:1" },
 { surah: "Al-Ahzab", surahNumber: 33, ayah: 43, arabic: "وَكَانَ بِالْمُؤْمِنِينَ رَحِيمًا", translation: "Et Il est Miséricordieux envers les croyants.", link: "https://quran.com/fr/33:43" }
 ],
 hadithReferences: [
 { collection: "Sahih Bukhari", number: "6000", text: "Allah a divisé la miséricorde en cent parties. Il en a retenu auprès de Lui quatre-vingt-dix-neuf et a fait descendre sur terre une seule partie.", link: "https://sunnah.com/bukhari:6000" }
 ],
 sources: [
 { label: "Quran.com - Al-Ahzab 33:43", url: "https://quran.com/fr/33:43" },
 { label: "Sunnah.com - Bukhari 6000", url: "https://sunnah.com/bukhari:6000" }
 ]
 },
 3: {
 detailedMeaning: "Al-Malik dérive de la racine m-l-k qui implique la possession absolue et le pouvoir de commandement (amr) et d'interdiction (nahy). Il désigne le Roi absolu dont la souveraineté est parfaite et complète, ne dépendant d'aucun conseiller ni assistant. Le vrai Roi est Celui qui n'a besoin de rien dans Son essence et dont toute chose a besoin, car toute existence est dans Son royaume. Linguistiquement, la royauté (mulk) implique la capacité de disposer de toute chose selon Sa volonté. Il possède le pouvoir absolu d'ordonner et d'interdire, de récompenser et de punir.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ", translation: "C'est Lui Allah, en dehors de qui il n'y a pas de divinité, le Souverain, le Saint, la Paix.", link: "https://quran.com/fr/59:23" },
 { surah: "Al-Mu'minun", surahNumber: 23, ayah: 116, arabic: "فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ", translation: "Exalte soit Allah, le vrai Souverain.", link: "https://quran.com/fr/23:116" }
 ],
 hadithReferences: [
 { collection: "Sahih Muslim", number: "2788", text: "Allah saisira la terre le Jour de la Résurrection et pliera les cieux de Sa main droite, puis dira : Je suis le Roi, où sont les rois de la terre ?", link: "https://sunnah.com/muslim:2788" }
 ],
 sources: [
 { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" },
 { label: "Sunnah.com - Muslim 2788", url: "https://sunnah.com/muslim:2788" }
 ]
 },
 4: {
 detailedMeaning: "Al-Quddus dérive de la racine q-d-s (la pureté, la sainteté) selon le schéma fu''us, forme d'intensité exprimant la pureté totale et absolue. Il désigne Celui qui est exempt de tout défaut, de toute imperfection et de toute ressemblance avec les créatures. Al-Quddus est Celui qui est au-delà de tout ce que les sens peuvent percevoir, de tout ce que l'imagination peut représenter et de tout ce que la pensée peut concevoir. Les anges Le glorifient constamment en disant Subbuh, Quddus, Seigneur des anges et de l'Esprit, comme rapporté dans Sahih Muslim (487).",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ", translation: "C'est Lui Allah, en dehors de qui il n'y a pas de divinité, le Souverain, le Saint.", link: "https://quran.com/fr/59:23" },
 { surah: "Al-Jumu'a", surahNumber: 62, ayah: 1, arabic: "يُسَبِّحُ لِلَّهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ الْمَلِكِ الْقُدُّوسِ", translation: "Ce qui est dans les cieux et sur la terre glorifie Allah, le Souverain, le Saint.", link: "https://quran.com/fr/62:1" }
 ],
 hadithReferences: [
 { collection: "Sahih Muslim", number: "487", text: "Le Prophète (paix sur lui) disait dans son ruku' et son sujud : Subbuh, Quddus, Seigneur des anges et de l'Esprit.", link: "https://sunnah.com/muslim:487" }
 ],
 sources: [
 { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" },
 { label: "Sunnah.com - Muslim 487", url: "https://sunnah.com/muslim:487" }
 ]
 },
 5: {
 detailedMeaning: "As-Salam dérive de la racine s-l-m qui porte les sens de paix, d'intégrité et d'immunité contre tout défaut. As-Salam est Celui dont l'essence est exempte de tout défaut, dont les attributs sont exempts de toute imperfection, et dont les actes sont exempts de tout mal. Il salue Ses serviteurs au Paradis, comme l'indique le verset : Paix, parole d'un Seigneur Miséricordieux (36:58). Le Prophète (paix sur lui) disait après chaque prière : Allahumma anta As-Salam wa minka as-salam, confirmant qu'Il est la source de toute paix et que toute paix émane de Lui.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ", translation: "Le Souverain, le Saint, la Paix, le Garant de la foi, le Protecteur.", link: "https://quran.com/fr/59:23" },
 { surah: "Ya-Sin", surahNumber: 36, ayah: 58, arabic: "سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ", translation: "Paix ! Parole d'un Seigneur Très Miséricordieux.", link: "https://quran.com/fr/36:58" }
 ],
 hadithReferences: [
 { collection: "Sahih Muslim", number: "592", text: "Le Prophète (paix sur lui) disait après chaque prière : Allahumma anta As-Salam wa minka as-salam, tabarakta ya dhal-jalali wal-ikram.", link: "https://sunnah.com/muslim:592" }
 ],
 sources: [
 { label: "Quran.com - Ya-Sin 36:58", url: "https://quran.com/fr/36:58" },
 { label: "Sunnah.com - Muslim 592", url: "https://sunnah.com/muslim:592" }
 ]
 },
 6: {
 detailedMeaning: "Al-Mu'min dérive de la racine hamza-mim-nun (a-m-n) qui exprime la sécurité et la confirmation. Linguistiquement, il porte deux sens linguistiques : Celui qui confirmé (musaddiq) Ses messagers par les miracles et Ses propres paroles, et Celui qui accorde la sécurité (mu'ammin) à Ses créatures contre l'injustice. Il confirmé Ses promesses et protège Ses serviteurs du châtiment quand ils Lui obéissent. Al-Mu'min est Celui de qui émane la sécurité et la tranquillite, qui met Ses serviteurs à l'abri de toute oppression et témoigne de Sa propre unicité.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ", translation: "La Paix, le Garant de la foi, le Protecteur.", link: "https://quran.com/fr/59:23" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" }
 ]
 },
 7: {
 detailedMeaning: "Al-Muhaymin dérive selon certains grammairiens de haymana (veiller, proteger), et selon d'autres de la racine a-m-n avec ajout du ha', signifiant le Gardien fidèle. Il désigne Celui qui veille sur toute Sa création, qui la protège, la préserve et en est le Témoin. Al-Muhaymin est Celui qui réunit la science, la préservation et la domination : Il connaît tout, garde tout et contrôle tout de manière absolue. Il englobe les sens de témoin (shahid), gardien (hafiz) et dominant (musaytiir) sur toute la création.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ", translation: "Le Garant de la foi, le Protecteur Suprême, le Tout Puissant, le Contraignant.", link: "https://quran.com/fr/59:23" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" }
 ]
 },
 8: {
 detailedMeaning: "Al-'Aziz dérive de la racine 'a-z-z qui comporte trois sens linguistiques : la rareté absolue (al-ladhi la nazira lahu), car Il est sans égal ; l'invincibilité (al-ladhi la yughlab), car rien ne peut Le vaincre ; et la puissance (al-qawiy), car Il domine toute chose. La forme fa'il indique un attribut permanent et inhérent à Son essence. Il est rare dans Son essence, Ses attributs et Ses actes, sans aucun semblable, et Sa puissance est inaccessible à toute créature.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ", translation: "Le Tout Puissant, le Contraignant, le Majestueux.", link: "https://quran.com/fr/59:23" },
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 6, arabic: "هُوَ الَّذِي يُصَوِّرُكُمْ فِي الْأَرْحَامِ كَيْفَ يَشَاءُ لَا إِلَٰهَ إِلَّا هُوَ الْعَزِيزُ الْحَكِيمُ", translation: "C'est Lui qui vous donne forme dans les matrices comme Il veut. Il n'y a de divinité que Lui, le Tout Puissant, le Sage.", link: "https://quran.com/fr/3:6" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" }
 ]
 },
 9: {
 detailedMeaning: "Al-Jabbar dérive de la racine j-b-r selon le schéma fa''al, forme d'intensité. Ce nom comporte trois sens : Celui qui contraint Ses créatures selon Sa volonté (al-jabr bi-ma'na al-ijbar), Celui qui répare et restaure l'état de Ses créatures (jabr al-kasr), et le Très Haut au-dessus de toute chose (al-'ali). Il est Celui dont la volonté s'accomplit sans résistance et qui, par Sa bonté, répare les cœurs brisés des opprimés. Linguistiquement, ces deux sens fondamentaux — la contrainte irrésistible et la réparation bienveillante — sont établis.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ", translation: "Le Tout Puissant, le Contraignant, le Majestueux.", link: "https://quran.com/fr/59:23" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" }
 ]
 },
 10: {
 detailedMeaning: "Al-Mutakabbir dérive de la racine k-b-r selon le schéma mutafa''il. Il désigne Celui à qui appartient exclusivement la grandeur suprême (al-kibriya'), au-dessus de tout attribut des créatures. Linguistiquement, contrairement aux créatures qui s'attribuent faussement la grandeur, Allah la possède légitimement. La kibriya' est un attribut exclusif d'Allah, comme l'attesté le hadith : La grandeur est Mon manteau et la majesté est Mon pagne ; quiconque Me dispute l'un des deux, Je le jetterai en Enfer (Muslim 2620). Ce nom rappelle que toute prétention a la grandeur de la part des créatures est illégitime.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 23, arabic: "الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ سُبْحَانَ اللَّهِ عَمَّا يُشْرِكُونَ", translation: "Le Tout Puissant, le Contraignant, le Majestueux. Gloire a Allah, au-dessus de ce qu'ils Lui associent.", link: "https://quran.com/fr/59:23" }
 ],
 hadithReferences: [
 { collection: "Sahih Muslim", number: "2620", text: "Allah dit : La grandeur est Mon manteau et la majesté est Mon pagne. Quiconque Me dispute l'un des deux, Je le jetterai en Enfer.", link: "https://sunnah.com/muslim:2620" }
 ],
 sources: [
 { label: "Quran.com - Al-Hashr 59:23", url: "https://quran.com/fr/59:23" },
 { label: "Sunnah.com - Muslim 2620", url: "https://sunnah.com/muslim:2620" }
 ]
 },
 11: {
 detailedMeaning: "Al-Khaliq dérive de la racine kh-l-q qui signifie créer et estimer (taqdir). Linguistiquement, le khalq implique la planification et la détermination (taqdir) avant la mise en existence. Trois etapes de la création divine sont distinguees : Al-Khaliq est le planificateur (muqaddir) qui détermine les choses avant de les créer, Al-Bari' est celui qui les fait exister, et Al-Musawwir est celui qui leur donne forme. Il a fait exister les choses après leur inexistence, les tirant du néant selon Son décret eternel.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 24, arabic: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ", translation: "C'est Lui Allah, le Créateur, le Producteur, le Façonneur.", link: "https://quran.com/fr/59:24" },
 { surah: "Ar-Ra'd", surahNumber: 13, ayah: 16, arabic: "قُلِ اللَّهُ خَالِقُ كُلِّ شَيْءٍ", translation: "Dis : Allah est le Créateur de toute chose.", link: "https://quran.com/fr/13:16" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hashr 59:24", url: "https://quran.com/fr/59:24" }
 ]
 },
 12: {
 detailedMeaning: "Al-Bari' dérive de la racine b-r-' qui signifie produire, faire exister et distinguer. Il est le producteur (bari') en tant qu'Il initie l'existence des êtres, après que Al-Khaliq les a planifies et avant que Al-Musawwir ne leur donne forme. Il produit les créatures et les fait passer du néant à l'existence en les distinguant les unes des autres par des caractéristiques propres. Linguistiquement, la racine b-r-' porte aussi le sens d'être exempt de défaut, ce qui indique que Sa création est produite sans imperfection dans l'acte créateur.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 24, arabic: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ", translation: "C'est Lui Allah, le Créateur, le Producteur, le Façonneur.", link: "https://quran.com/fr/59:24" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hashr 59:24", url: "https://quran.com/fr/59:24" }
 ]
 },
 13: {
 detailedMeaning: "Al-Musawwir dérive de la racine s-w-r qui signifie donner forme et apparence. Il désigne Celui qui façonné chaque créature et lui confere son image et ses traits distinctifs. Il est le façonneur (musawwir) en tant qu'Il arrange les formes des êtres de la meilleure manière, comme l'artisan qui donne la forme finale après la planification et la construction. Le verset : Dans quelque forme qu'Il a voulue, Il t'a compose (82:8) illustre cette attribution. Aucun visage ne ressemble à un autre parmi les milliards de créatures, ce qui témoigne de l'infinite de Sa puissance créatrice.",
 quranVerses: [
 { surah: "Al-Hashr", surahNumber: 59, ayah: 24, arabic: "الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ", translation: "Le Créateur, le Producteur, le Façonneur. A Lui les plus beaux noms.", link: "https://quran.com/fr/59:24" },
 { surah: "Al-Infitar", surahNumber: 82, ayah: 8, arabic: "فِي أَيِّ صُورَةٍ مَّا شَاءَ رَكَّبَكَ", translation: "Dans quelque forme qu'Il a voulue, Il t'a compose.", link: "https://quran.com/fr/82:8" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hashr 59:24", url: "https://quran.com/fr/59:24" }
 ]
 },
 14: {
 detailedMeaning: "Al-Ghaffar dérive de la racine gh-f-r (couvrir, cacher) selon le schéma fa''al, forme intensive qui indique la répétition et l'abondance du pardon. Linguistiquement, le ghafr signifie couvrir et dissimuler, indiquant qu'Allah couvre les péchés de Ses serviteurs sans les exposer. Il pardonne encore et encore à chaque repentir sincère, peu importe le nombre de retours au péché. Ce nom se distingue d'Al-Ghafur : Al-Ghaffar met l'accent sur la fréquence et la répétition du pardon, tandis qu'Al-Ghafur souligne son etendue et sa completude.",
 quranVerses: [
 { surah: "Nuh", surahNumber: 71, ayah: 10, arabic: "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا", translation: "J'ai dit : Implorez le pardon de votre Seigneur, car Il est Grand Pardonneur.", link: "https://quran.com/fr/71:10" },
 { surah: "Az-Zumar", surahNumber: 39, ayah: 53, arabic: "إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا", translation: "Certes, Allah pardonne tous les péchés.", link: "https://quran.com/fr/39:53" }
 ],
 hadithReferences: [
 { collection: "Sahih Muslim", number: "2749", text: "Par Celui qui tient mon âme en Sa main, si vous ne pechiez pas, Allah vous remplacerait par un peuple qui pecherait puis demanderait pardon, et Il leur pardonnerait.", link: "https://sunnah.com/muslim:2749" }
 ],
 sources: [
 { label: "Quran.com - Az-Zumar 39:53", url: "https://quran.com/fr/39:53" },
 { label: "Sunnah.com - Muslim 2749", url: "https://sunnah.com/muslim:2749" }
 ]
 },
 15: {
 detailedMeaning: "Al-Qahhar dérive de la racine q-h-r (dominer, soumettre) selon le schéma fa''al, forme intensive exprimant la domination absolue et irrésistible. Linguistiquement, il désigne la soumission totale de toute la création a Sa puissance, sans qu'aucune résistance ne soit possible. Il brisé le dos des tyrans et des rebelles. Toute la création, rois et sujets, est soumise à Sa majesté. Ce nom apparait souvent couple avec Al-Wahid dans le Coran (13:16 ; 14:48), soulignant qu'il n'y a qu'un seul Dominateur et que toute domination Lui appartient exclusivement.",
 quranVerses: [
 { surah: "Ar-Ra'd", surahNumber: 13, ayah: 16, arabic: "قُلِ اللَّهُ خَالِقُ كُلِّ شَيْءٍ وَهُوَ الْوَاحِدُ الْقَهَّارُ", translation: "Dis : Allah est le Créateur de toute chose et Il est l'Unique, le Dominateur Suprême.", link: "https://quran.com/fr/13:16" },
 { surah: "Ibrahim", surahNumber: 14, ayah: 48, arabic: "يَوْمَ تُبَدَّلُ الْأَرْضُ غَيْرَ الْأَرْضِ وَالسَّمَاوَاتُ وَبَرَزُوا لِلَّهِ الْوَاحِدِ الْقَهَّارِ", translation: "Le jour ou la terre sera remplacee par une autre et les cieux aussi, et ils comparaitront devant Allah, l'Unique, le Dominateur Suprême.", link: "https://quran.com/fr/14:48" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Ra'd 13:16", url: "https://quran.com/fr/13:16" }
 ]
 },
 16: {
 detailedMeaning: "Al-Wahhab dérive de la racine w-h-b (donner) selon le schéma fa''al, forme intensive indiquant la multiplicite et la continuite des dons. Le vrai don est celui qui est accorde sans contrepartie, sans intérêt et sans attendre de récompense ; seul Allah donne de cette manière absolue. Linguistiquement, cette forme intensive indique des dons incessants, varies et inconditionnels : la vie, la sante, la subsistance, la foi et la sagesse. Le verset coranique Seigneur, accorde-nous une miséricorde de Ta part, c'est Toi le Donateur Suprême (3:8) illustre cette invocation par ce nom.",
 quranVerses: [
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 8, arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ", translation: "Seigneur, ne fais pas dévier nos cœurs après que Tu nous aies guidés, et accorde-nous une miséricorde de Ta part. C'est Toi le Donateur Suprême.", link: "https://quran.com/fr/3:8" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ali 'Imran 3:8", url: "https://quran.com/fr/3:8" }
 ]
 },
 17: {
 detailedMeaning: "Ar-Razzaq dérive de la racine r-z-q (pourvoir, accorder la subsistance) selon le schéma fa''al, forme intensive qui indique une subsistance complète et incessante. Il crée la subsistance (rizq) et la fait parvenir à chaque créature, qu'elle soit croyante ou non. Les savants distinguent deux types de rizq : la subsistance matérielle (nourriture, boisson, sante) qui nourrit le corps, et la subsistance spirituelle (science, foi, guidance) qui nourrit l'âme. Linguistiquement, le rizq englobe tout ce dont le corps et l'âme ont besoin. Nul être vivant n'est oublie, comme l'atteste le verset : Il n'y a point de créature sur terre dont la subsistance n'incombe a Allah (11:6).",
 quranVerses: [
 { surah: "Adh-Dhariyat", surahNumber: 51, ayah: 58, arabic: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ", translation: "C'est Allah qui est le Pourvoyeur, le Détenteur de la force, l'Inébranlable.", link: "https://quran.com/fr/51:58" }
 ],
 hadithReferences: [
 { collection: "Sahih Muslim", number: "2713", text: "O Allah, Tu es le Premier et rien n'est avant Toi, Tu es le Dernier et rien n'est après Toi, Tu es l'Apparent et rien n'est au-dessus de Toi, Tu es le Caché et rien n'est en-dessous de Toi.", link: "https://sunnah.com/muslim:2713" }
 ],
 sources: [
 { label: "Quran.com - Adh-Dhariyat 51:58", url: "https://quran.com/fr/51:58" }
 ]
 },
 18: {
 detailedMeaning: "Al-Fattah dérive de la racine f-t-h (ouvrir, juger) selon le schéma fa''al, forme intensive. Ce nom comporte deux sens linguistiques principaux : Celui qui ouvre les portes fermees (fath) de la miséricorde, de la subsistance, de la connaissance et de la victoire, et Celui qui juge entre les gens avec vérité (fath bi-ma'na al-hukm). Ces deux sens sont confirmes : Il ouvre ce qui est ferme et tranche entre Ses serviteurs avec équité. Le verset Notre Seigneur nous réunira puis Il jugera entre nous en vérité, Il est Al-Fattah, l'Omniscient (34:26) illustre ce double sens de jugement et d'ouverture.",
 quranVerses: [
 { surah: "Saba", surahNumber: 34, ayah: 26, arabic: "قُلْ يَجْمَعُ بَيْنَنَا رَبُّنَا ثُمَّ يَفْتَحُ بَيْنَنَا بِالْحَقِّ وَهُوَ الْفَتَّاحُ الْعَلِيمُ", translation: "Dis : Notre Seigneur nous réunira puis Il jugera entre nous en vérité. Il est le Juge Suprême, l'Omniscient.", link: "https://quran.com/fr/34:26" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Saba 34:26", url: "https://quran.com/fr/34:26" }
 ]
 },
 19: {
 detailedMeaning: "Al-'Alim dérive de la racine 'a-l-m (savoir) et désigne Celui dont la science est parfaite, éternelle et englobante. Sa science n'est pas derivee des choses connues, mais que les choses sont connues par Sa science ; elle n'augmente pas par l'apprentissage et ne diminue pas par l'oubli. Linguistiquement, c'est un adjectif qualificatif indiquant une science qui ne connaît ni debut ni accroissement et qui précède toute existence. Sa science englobe le passe, le présent, le futur, le visible et l'invisible, comme l'atteste le verset : Et Il est Omniscient de toute chose (2:29), répété sous diverses formes plus de 150 fois dans le Coran.",
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
 detailedMeaning: "Al-Qabid dérive de la racine q-b-d (saisir, resserrer), designant Celui qui retient et resserre, que ce soit la subsistance, les cœurs où les âmes au moment de la mort. Al-Qabid est Celui qui resserre les cœurs par la crainte et les provisions par Sa sagesse. Ce resserrement est une épreuve qui mene à l'élévation. Le resserrement et l'expansion sont entre les mains d'Allah seul, et le croyant doit patienter dans le resserrement, comme l'affirme le verset : Allah restreint et etend, et c'est à Lui que vous serez ramenes (2:245). Ce nom se comprend en pair avec Al-Basit.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 245, arabic: "وَاللَّهُ يَقْبِضُ وَيَبْسُطُ وَإِلَيْهِ تُرْجَعُونَ", translation: "Allah restreint et etend, et c'est à Lui que vous serez ramenes.", link: "https://quran.com/fr/2:245" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:245", url: "https://quran.com/fr/2:245" }
 ]
 },
 21: {
 detailedMeaning: "Al-Basit dérive de la racine b-s-t (étendre, déployer), et constitue l'opposé complémentaire d'Al-Qabid. Linguistiquement, ce terme désigne Celui qui déploie Ses bienfaits et élargit les cœurs. Al-Basit est Celui qui etend la subsistance à qui Il veut et élargit les cœurs par la connaissance et la lumière de la foi. Le serviteur reconnait que toute expansion vient d'Allah, qu'elle soit matérielle ou spirituelle. Le verset : Allah restreint et etend, et c'est à Lui que vous serez ramenes (2:245) confirme que l'extension comme la restriction relevent de Sa seule volonté et sagesse parfaite.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 245, arabic: "وَاللَّهُ يَقْبِضُ وَيَبْسُطُ وَإِلَيْهِ تُرْجَعُونَ", translation: "Allah restreint et etend, et c'est à Lui que vous serez ramenes.", link: "https://quran.com/fr/2:245" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:245", url: "https://quran.com/fr/2:245" }
 ]
 },
 22: {
 detailedMeaning: "Al-Khafid dérive de la racine kh-f-d (abaisser), designant l'action de rabaisser et d'humilier. Linguistiquement, ce nom indique qu'Allah abaisse les orgueilleux et les rebelles selon Sa volonté souveraine. Al-Khafid est Celui qui abaisse les incroyants par le malheur et les tyrans par la destruction, humiliant quiconque se rebelle. Le croyant tire leçon de ce nom en s'humiliant devant Allah et en evitant l'arrogance, car c'est elle la cause de l'abaissement. Le verset : Elle abaissera certains et en elevera d'autres (56:3) montre que ce nom se comprend en pair avec Ar-Rafi', illustrant la maîtrise d'Allah sur le rang de Ses créatures.",
 quranVerses: [
 { surah: "Al-Waqi'a", surahNumber: 56, ayah: 3, arabic: "خَافِضَةٌ رَّافِعَةٌ", translation: "Elle abaissera certains et en elevera d'autres.", link: "https://quran.com/fr/56:3" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Waqi'à 56:3", url: "https://quran.com/fr/56:3" }
 ]
 },
 23: {
 detailedMeaning: "Ar-Rafi' dérive de la racine r-f-' (elever), designant l'élévation en rang et en dignité dans ce monde et dans l'au-delà. Linguistiquement, cette élévation concerné le statut terrestre comme la station eschatologique. Ar-Rafi' élève Ses allies par la proximité et l'obéissance, et abaisse Ses ennemis par l'éloignement. L'élévation véritable vient d'Allah seul et le croyant la recherche par la foi et la science. Le verset : Allah elevera ceux d'entre vous qui croient et ceux qui auront reçu la science, de plusieurs degrés (58:11) confirme que la foi et le savoir constituent la plus haute forme d'honneur.",
 quranVerses: [
 { surah: "Al-An'am", surahNumber: 6, ayah: 83, arabic: "نَرْفَعُ دَرَجَاتٍ مَّن نَّشَاءُ", translation: "Nous elevons en rang qui Nous voulons.", link: "https://quran.com/fr/6:83" },
 { surah: "Al-Mujadala", surahNumber: 58, ayah: 11, arabic: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ", translation: "Allah elevera ceux d'entre vous qui croient et ceux qui auront reçu la science, de plusieurs degrés.", link: "https://quran.com/fr/58:11" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Mujadala 58:11", url: "https://quran.com/fr/58:11" }
 ]
 },
 24: {
 detailedMeaning: "Al-Mu'izz dérive de la racine 'a-z-z (rendre puissant, honorer), designant Celui qui confere la 'izza, c'est-a-dire la puissance et l'honneur véritables. Linguistiquement, ce terme implique l'octroi d'une dignité que nul ne peut retirer sans la permission divine. La vraie 'izza est celle de la foi et de la piete, non celle des richesses et du pouvoir mondain. Le croyant cherche la dignité par l'obéissance a Allah, car l'honneur véritable est dans la soumission au Tout Puissant. Le verset : Tu honores qui Tu veux et Tu humilies qui Tu veux (3:26) montre que toute puissance et tout honneur relevent exclusivement de la volonté divine.",
 quranVerses: [
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 26, arabic: "قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَن تَشَاءُ وَتَنزِعُ الْمُلْكَ مِمَّن تَشَاءُ وَتُعِزُّ مَن تَشَاءُ وَتُذِلُّ مَن تَشَاءُ", translation: "Dis : O Allah, Maître de l'autorité absolue. Tu donnes l'autorité à qui Tu veux, et Tu arraches l'autorité à qui Tu veux ; Tu honores qui Tu veux et Tu humilies qui Tu veux.", link: "https://quran.com/fr/3:26" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ali 'Imran 3:26", url: "https://quran.com/fr/3:26" }
 ]
 },
 25: {
 detailedMeaning: "Al-Mudhill dérive de la racine dh-l-l (humilier, avilir), et constitue l'opposé d'Al-Mu'izz. Linguistiquement, le dhull désigne la bassesse et l'humiliation imposee aux rebelles. Al-Mudhill abaisse par la déshonneur quiconque se rebelle contre Lui, humiliant les tyrans et les oppresseurs. L'humiliation est le châtiment de l'orgueil, et le croyant craint ce nom en evitant la désobéissance et en se soumettant humblement. Le verset : Tu honores qui Tu veux et Tu humilies qui Tu veux, le bien est en Ta main (3:26) montre que l'abaissement comme l'élévation relevent de la sagesse et de la justice d'Allah.",
 quranVerses: [
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 26, arabic: "وَتُعِزُّ مَن تَشَاءُ وَتُذِلُّ مَن تَشَاءُ بِيَدِكَ الْخَيْرُ", translation: "Tu honores qui Tu veux et Tu humilies qui Tu veux. Le bien est en Ta main.", link: "https://quran.com/fr/3:26" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ali 'Imran 3:26", url: "https://quran.com/fr/3:26" }
 ]
 },
 26: {
 detailedMeaning: "As-Sami' dérive de la racine s-m-' (entendre), constituant un attribut de perception (sifa idrak) indiquant une audition parfaite sans organe ni intermédiaire. Linguistiquement, ce terme désigne une audition absolue et sans limite. As-Sami' est Celui à qui aucun son n'echappe, même le bruit de la fourmi noire sur la pierre noire dans la nuit noire. Cette audition est un attribut reel, sans ressemblance avec celle des créatures, et le croyant qui sait qu'Allah l'entend veille à ses paroles et multiplie les invocations. Le verset : Allah a bien entendu la parole de celle qui discutait avec toi (58:1) atteste de cette audition omnipresente.",
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
 detailedMeaning: "Al-Basir dérive de la racine b-s-r (voir), constituant un attribut de perception indiquant une vision parfaite et pénétrante englobant le visible et l'invisible sans organe. Linguistiquement, ce terme désigne une vision absolue et sans voile. Al-Basir voit toute chose, jusqu'au mouvement de la fourmi noire sur le rocher noir dans l'obscurite de la nuit. Cette vision est un attribut reel, sans ressemblance avec celle des créatures. Le serviteur qui le sait adore Allah avec excellence (ihsan). Le verset : Il est avec vous où que vous soyez, et Allah observe parfaitement ce que vous faites (57:4) confirme cette vision omnipresente.",
 quranVerses: [
 { surah: "Al-Isra", surahNumber: 17, ayah: 1, arabic: "سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى", translation: "Gloire a Celui qui a fait voyager Son serviteur la nuit, de la Mosquee Sacree à la Mosquee la plus eloignee.", link: "https://quran.com/fr/17:1" },
 { surah: "Al-Hadid", surahNumber: 57, ayah: 4, arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ", translation: "Et Il est avec vous où que vous soyez. Et Allah observe parfaitement ce que vous faites.", link: "https://quran.com/fr/57:4" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hadid 57:4", url: "https://quran.com/fr/57:4" }
 ]
 },
 28: {
 detailedMeaning: "Al-Hakam dérive de la racine h-k-m (juger, decider), designant le juge dont la sentence est définitive et sans appel. Linguistiquement, ce terme implique un pouvoir de décision absolue que nul ne peut contester ni infirmer. Al-Hakam est Celui qui juge entre les créatures avec vérité, Son jugement reposant sur une science et une justice parfaites. Le croyant se soumet à Son jugement sans rechercher d'autre législation, car c'est Lui le Juge suprême dont la sentence est vérité. Le Prophète (paix sur lui) a dit : Allah est Al-Hakam, et c'est à Lui que revient le jugement (Abu Dawud 4955), confirmant l'exclusivite de ce droit divin.",
 quranVerses: [
 { surah: "Ghafir", surahNumber: 40, ayah: 48, arabic: "إِنَّ اللَّهَ قَدْ حَكَمَ بَيْنَ الْعِبَادِ", translation: "Certes, Allah juge entre les serviteurs.", link: "https://quran.com/fr/40:48" }
 ],
 hadithReferences: [
 { collection: "Sunan Abu Dawud", number: "4955", text: "Le Prophète (paix sur lui) a dit : Allah est Al-Hakam, et c'est à Lui que revient le jugement.", link: "https://sunnah.com/abudawud:4955" }
 ],
 sources: [
 { label: "Quran.com - Ghafir 40:48", url: "https://quran.com/fr/40:48" }
 ]
 },
 29: {
 detailedMeaning: "Al-'Adl est un masdar (nom verbal) utilise comme qualificatif, dérive de la racine '-d-l (être juste). Linguistiquement, son emploi comme nom verbal renforce le sens : Il est la justice même, non pas simplement juste. Al-'Adl est Celui dont les actes sont tous bons et sages, qui place chaque chose à sa place avec une justesse parfaite. La justice d'Allah est parfaite, qu'Il ne lese personne et le croyant s'en remet à Sa justice sans Lui reprocher aucun de Ses décrets, même dans l'épreuve. Le verset : Certes, Allah ne commet aucune injustice, fut-ce du poids d'un atome (4:40) atteste de cette justice absolue qui s'etend à toute la création.",
 quranVerses: [
 { surah: "An-Nisa", surahNumber: 4, ayah: 40, arabic: "إِنَّ اللَّهَ لَا يَظْلِمُ مِثْقَالَ ذَرَّةٍ", translation: "Certes, Allah ne commet aucune injustice, fut-ce du poids d'un atome.", link: "https://quran.com/fr/4:40" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - An-Nisa 4:40", url: "https://quran.com/fr/4:40" }
 ]
 },
 30: {
 detailedMeaning: "Al-Latif dérive de la racine l-t-f qui porte deux sens : la connaissance des details subtils (lutf) et la bienveillance delicate envers les créatures (talattuf). Cette double signification fait la richesse de ce nom. Al-Latif connaît les subtilites de toute chose et est doux envers Ses serviteurs par des voies imperceptibles. La douceur d'Allah se manifeste dans les bienfaits subtils accordés par des voies imprévues, et le croyant place sa confiance en Lui sachant qu'Il agit pour son bien. Le verset : Allah est Doux envers Ses serviteurs, Il pourvoit qui Il veut (42:19) confirme cette bienveillance delicate.",
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
 detailedMeaning: "Al-Khabir dérive de la racine kh-b-r (connaître en profondeur), designant une connaissance qui pénètre au-delà des apparences pour saisir les réalités cachées. Linguistiquement, ce terme implique une science atteignant les profondeurs des choses, la ou nulle créature ne peut acceder. Al-Khabir est Celui dont la science atteint les mystères des consciences et les secrets des cœurs. Le croyant qui réalise qu'Allah connaît ses pensées intimes est poussé à purifier son cœur. Le verset : Ne connaît-Il pas ce qu'Il a crée, Lui le Doux, le Parfaitement Informe ? (67:14) illustre que cette connaissance découle de Sa qualité de Créateur.",
 quranVerses: [
 { surah: "Al-An'am", surahNumber: 6, ayah: 103, arabic: "وَهُوَ اللَّطِيفُ الْخَبِيرُ", translation: "Il est le Doux, le Parfaitement Informe.", link: "https://quran.com/fr/6:103" },
 { surah: "Al-Mulk", surahNumber: 67, ayah: 14, arabic: "أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ", translation: "Ne connaît-Il pas ce qu'Il a crée, Lui le Doux, le Parfaitement Informe ?", link: "https://quran.com/fr/67:14" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Mulk 67:14", url: "https://quran.com/fr/67:14" }
 ]
 },
 32: {
 detailedMeaning: "Al-Halim dérive de la racine h-l-m (être clement, patient), s'opposant à la precipitation (ajala). Linguistiquement, le hilm désigne le fait de retarder la punition malgre la capacité de l'infliger, distinguant la clémence de la faiblesse. Al-Halim ne Se hate pas de punir, voyant la désobéissance mais accordant un délai avec clémence pour le repentir. Le croyant ne doit pas être trompe par ce délai mais profiter de la patience d'Allah pour se repentir sincèrement. Le verset : Et Allah est Pardonneur et Clement (2:225) associé le pardon a la clémence, montrant leur complémentarité dans la miséricorde divine.",
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
 detailedMeaning: "Al-'Azim dérive de la racine '-z-m (être immense), constituant un adjectif qualificatif indiquant une grandeur qui dépasse toute mesure et toute comprehension. Linguistiquement, cette immensité ne peut être saisie par aucun esprit crée. Al-'Azim est Celui dont la grandeur ne peut être apprehendee, les créatures etant incapables de saisir Sa réalité en essence, en attributs et en actes. Le croyant glorifie Allah en disant Subhana Rabbiya al-'Azim, reconnaissant Son immensité. Le verset : Et Il est le Très Haut, le Très Grand (2:255) dans Ayat al-Kursi consacre cette grandeur comme attribut fondamental de l'essence divine.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 255, arabic: "وَهُوَ الْعَلِيُّ الْعَظِيمُ", translation: "Et Il est le Très Haut, le Très Grand.", link: "https://quran.com/fr/2:255" },
 { surah: "Ash-Shura", surahNumber: 42, ayah: 4, arabic: "وَهُوَ الْعَلِيُّ الْعَظِيمُ", translation: "Et c'est Lui le Très Haut, le Très Grand.", link: "https://quran.com/fr/42:4" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:255", url: "https://quran.com/fr/2:255" }
 ]
 },
 34: {
 detailedMeaning: "Al-Ghafur suit le schéma fa'ul dérive de la racine gh-f-r (couvrir, pardonner), forme exprimant l'etendue et la completude du pardon. Linguistiquement, cette forme indique un pardon vaste couvrant entièrement le péché, le distinguant d'Al-Ghaffar qui souligne la répétition. Al-Ghafur couvre les péchés de Ses serviteurs sans les leur reprocher après le repentir. Le croyant ne desespere jamais de Sa miséricorde, car Il pardonne a celui qui revient sincèrement. Le verset : Ne désespérez pas de la miséricorde d'Allah, car Allah pardonne tous les péchés (39:53) illustre ce pardon divin qui n'exclut aucune faute pour celui qui se repent.",
 quranVerses: [
 { surah: "Az-Zumar", surahNumber: 39, ayah: 53, arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا", translation: "Dis : O Mes serviteurs qui avez commis des excès a votre propre détriment, ne désespérez pas de la miséricorde d'Allah. Car Allah pardonne tous les péchés.", link: "https://quran.com/fr/39:53" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Az-Zumar 39:53", url: "https://quran.com/fr/39:53" }
 ]
 },
 35: {
 detailedMeaning: "Ash-Shakur suit le schéma fa'ul dérive de la racine sh-k-r (remercier, reconnaitre), designant Celui qui récompense le peu par le beaucoup. Linguistiquement, cette forme exprime une gratitude divine sans mesure. Ash-Shakur récompense l'obéissance au-delà de ce qu'elle mérité, donnant une récompense éternelle pour des actes ephemeres. Le croyant est motivé a multiplier les actes d'adoration, sachant qu'Allah récompense au-delà du mérité. Le verset : Il est certes Pardonneur et Reconnaissant (35:30) associé le pardon a la reconnaissance, montrant qu'Allah efface les fautes et récompense les bonnes œuvres.",
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
 detailedMeaning: "Al-'Aliyy dérive de la racine '-l-w (être élève), designant une élévation en trois types : élévation de l'essence (dhat), des attributs (sifat) et de la domination (qahr). Al-'Aliyy est élève au-dessus de toute chose, Sa hauteur etant celle de la majesté et de la domination, non une hauteur spatiale. Cette élévation est un attribut reel : Il est au-dessus de Sa création, sur Son Trône, comme l'affirment le Coran et la Sunna, et le croyant dirige ses mains et son cœur vers le haut dans l'invocation. Le verset : Et Il est le Très Haut, le Très Grand (2:255) dans Ayat al-Kursi consacre cette élévation absolue.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 255, arabic: "وَهُوَ الْعَلِيُّ الْعَظِيمُ", translation: "Et Il est le Très Haut, le Très Grand.", link: "https://quran.com/fr/2:255" },
 { surah: "An-Nisa", surahNumber: 4, ayah: 34, arabic: "إِنَّ اللَّهَ كَانَ عَلِيًّا كَبِيرًا", translation: "Certes, Allah est Très Haut, Très Grand.", link: "https://quran.com/fr/4:34" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:255", url: "https://quran.com/fr/2:255" }
 ]
 },
 37: {
 detailedMeaning: "Al-Kabir dérive de la racine k-b-r (être grand), designant Celui dont la grandeur dépasse celle de tout autre être en essence, en attributs et en actes. Linguistiquement, ce terme implique une suprématie totale et incommensurable. Al-Kabir possède la perfection de l'essence et des attributs, la grandeur véritable n'appartenant qu'a Lui seul. Le Takbir (Allahu Akbar) prononcé dans la prière est une affirmation de ce nom et une reconnaissance de Sa suprématie. Le verset : Le Connaisseur de l'invisible et du visible, le Très Grand, le Très Élève (13:9) associé Sa grandeur à Sa science du visible et de l'invisible.",
 quranVerses: [
 { surah: "Ar-Ra'd", surahNumber: 13, ayah: 9, arabic: "عَالِمُ الْغَيْبِ وَالشَّهَادَةِ الْكَبِيرُ الْمُتَعَالِ", translation: "Le Connaisseur de l'invisible et du visible, le Très Grand, le Très Élève.", link: "https://quran.com/fr/13:9" },
 { surah: "Al-Hajj", surahNumber: 22, ayah: 62, arabic: "وَأَنَّ اللَّهَ هُوَ الْعَلِيُّ الْكَبِيرُ", translation: "Et Allah est le Très Haut, le Très Grand.", link: "https://quran.com/fr/22:62" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Ra'd 13:9", url: "https://quran.com/fr/13:9" }
 ]
 },
 38: {
 detailedMeaning: "Al-Hafiz dérive de la racine h-f-z (preserver, garder), englobant la préservation de l'existence, la protection contre le mal et la conservation des actes dans le registre divin. Linguistiquement, ce terme couvre toutes les formes de garde emanant de la volonté divine. Al-Hafiz préserve toute chose de la perte et de la corruption, gardant les cieux et la terre sans lassitude. Il préserve le Coran de toute falsification et les actes des créatures pour le Jour du Compte. Le verset : C'est Nous qui avons fait descendre le Rappel et c'est Nous qui en sommes les gardiens (15:9) illustre cette préservation du Livre sacre à la création.",
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
 detailedMeaning: "Al-Muqit dérive de la racine q-w-t (nourrir, sustenter), designant Celui qui fournit la nourriture (qut) nécessaire au maintien de la vie, tant physique que spirituelle. Linguistiquement, ce terme implique la fourniture de toute subsistance et le maintien en existence de chaque créature. Al-Muqit crée la nourriture des corps et des âmes, maintenant les créatures en vie et pourvoyant a chacune selon son besoin. Le croyant se repose sur Allah pour sa subsistance, sachant qu'Al-Muqit ne négligé aucune créature. Le verset : Et Allah est le Garant de toute chose (4:85) confirme cette prise en charge universelle.",
 quranVerses: [
 { surah: "An-Nisa", surahNumber: 4, ayah: 85, arabic: "وَكَانَ اللَّهُ عَلَىٰ كُلِّ شَيْءٍ مُّقِيتًا", translation: "Et Allah est le Garant de toute chose.", link: "https://quran.com/fr/4:85" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - An-Nisa 4:85", url: "https://quran.com/fr/4:85" }
 ]
 },
 40: {
 detailedMeaning: "Al-Hasib dérive de la racine h-s-b qui porte deux sens : le compte (hisab) et la suffisance (hasb). Linguistiquement, il est à la fois Celui qui tient les comptes avec une précision absolue et Celui qui suffit comme garant. Al-Hasib est Celui qui suffit à Ses serviteurs et qui tient le compte precis de toute chose, Sa comptabilite etant parfaite et exhaustive. Allah demandera des comptes le Jour du Jugement, et le croyant se prepare en examinant ses propres actes avant d'être examine. Le verset : Lis ton livre, tu te suffis aujourd'hui comme comptable contre toi-même (17:14) montre la précision du registre divin dont chaque âme sera témoin.",
 quranVerses: [
 { surah: "An-Nisa", surahNumber: 4, ayah: 6, arabic: "وَكَفَىٰ بِاللَّهِ حَسِيبًا", translation: "Et Allah suffit comme Celui qui demande des comptes.", link: "https://quran.com/fr/4:6" },
 { surah: "Al-Isra", surahNumber: 17, ayah: 14, arabic: "اقْرَأْ كِتَابَكَ كَفَىٰ بِنَفْسِكَ الْيَوْمَ عَلَيْكَ حَسِيبًا", translation: "Lis ton livre. Tu te suffis aujourd'hui comme comptable contre toi-même.", link: "https://quran.com/fr/17:14" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - An-Nisa 4:6", url: "https://quran.com/fr/4:6" }
 ]
 },
 41: {
 detailedMeaning: "Al-Jalil dérive de la racine j-l-l (être majestueux), et le jalal désigne la grandeur accompagnee de splendeur et de magnificence. Linguistiquement, ce terme exprime la majesté absolue de l'essence divine, inspirant vénération et émerveillement. Al-Jalil est Celui dont les attributs sont majestueux et sublimes, la majesté (jalal) etant la grandeur alliee à la beauté, réunissant puissance et noblesse. Le croyant adore Allah avec crainte devant Sa majesté et espoir en Sa générosité. Le verset : Seule subsistera la Face de ton Seigneur, plein de majesté et de noblesse (55:27) consacre la pérennité de cette majesté divine.",
 quranVerses: [
 { surah: "Ar-Rahman", surahNumber: 55, ayah: 27, arabic: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ", translation: "Seule subsistera la Face de ton Seigneur, plein de majesté et de noblesse.", link: "https://quran.com/fr/55:27" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Rahman 55:27", url: "https://quran.com/fr/55:27" }
 ]
 },
 42: {
 detailedMeaning: "Al-Karim dérive de la racine k-r-m (être généreux, noble), designant à la fois la noblesse de l'essence (sharaf) et la générosité des actes (jud). Linguistiquement, ce terme couvre toute forme de noblesse et de largesse, englobant le don, le pardon et la bienveillance. Al-Karim pardonne quand Il à le pouvoir de punir, tient Ses promesses et Ses dons depassent toute espérance. Sa générosité est sans limites et le croyant L'invoque avec confiance sachant qu'Il ne decoit jamais. Le verset : O homme, qu'est-ce qui t'a trompe au sujet de ton Seigneur le Genereux ? (82:6) interpelle l'homme sur sa négligence face à cette générosité.",
 quranVerses: [
 { surah: "An-Naml", surahNumber: 27, ayah: 40, arabic: "وَمَن شَكَرَ فَإِنَّمَا يَشْكُرُ لِنَفْسِهِ وَمَن كَفَرَ فَإِنَّ رَبِّي غَنِيٌّ كَرِيمٌ", translation: "Quiconque est reconnaissant, c'est dans son propre intérêt. Et quiconque est ingrat, mon Seigneur est Riche et Genereux.", link: "https://quran.com/fr/27:40" },
 { surah: "Al-Infitar", surahNumber: 82, ayah: 6, arabic: "يَا أَيُّهَا الْإِنسَانُ مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ", translation: "O homme ! Qu'est-ce qui t'a trompe au sujet de ton Seigneur le Genereux ?", link: "https://quran.com/fr/82:6" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - An-Naml 27:40", url: "https://quran.com/fr/27:40" }
 ]
 },
 43: {
 detailedMeaning: "Ar-Raqib dérive de la racine r-q-b (observer, surveiller), designant une observation permanente et attentive, sans distraction. Linguistiquement, ce terme implique une vigilance constante embrassant toute la création. Ar-Raqib est Celui de qui rien ne se caché, Sa surveillance etant perpétuelle, englobant les actes apparents comme les pensées secrètes. Le croyant cultive la muraqaba (conscience de la surveillance divine), sachant qu'Allah observe chacun de ses actes. Le verset : Puis quand Tu m'as rappele, c'est Toi qui etais leur observateur attentif (5:117) montre qu'après les Prophètes, seul Allah demeure l'Observateur de Ses serviteurs.",
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
 detailedMeaning: "Al-Mujib dérive de la racine j-w-b (repondre), designant Celui qui donne une réponse (ijaba) à toute demande, par l'exaucement, la récompense ou le secours. Linguistiquement, ce terme implique une réponse active et effective, non une simple ecoute passive. Al-Mujib répond aux supplications par l'exaucement, aux obéissances par la récompense et aux nécessités par le secours. Le croyant invoque avec certitude, sachant qu'aucune du'à sincère n'est perdue. Le verset : Je suis tout proche, Je reponds à l'appel de celui qui M'invoque (2:186) consacre cette proximité divine et cette promesse d'exaucement pour quiconque se tourne vers Lui.",
 quranVerses: [
 { surah: "Hud", surahNumber: 11, ayah: 61, arabic: "إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ", translation: "Mon Seigneur est proche et Il répond.", link: "https://quran.com/fr/11:61" },
 { surah: "Al-Baqara", surahNumber: 2, ayah: 186, arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ", translation: "Et quand Mes serviteurs t'interrogent a Mon sujet, Je suis tout proche. Je reponds à l'appel de celui qui M'invoque.", link: "https://quran.com/fr/2:186" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:186", url: "https://quran.com/fr/2:186" }
 ]
 },
 45: {
 detailedMeaning: "Al-Wasi' dérive de la racine w-s-' (être vaste), designant l'absence de toute limite dans les attributs d'Allah. Linguistiquement, Sa science, Sa miséricorde et Sa générosité n'ont pas de bornes, embrassant la création sans s'épuiser. Al-Wasi' est Celui dont la richesse et la science sont sans limites, dont la miséricorde embrasse toute chose et dont les dons depassent toute mesure. Le croyant invoque Allah sachant que Ses tresors ne s'epuisent jamais. Le verset : Ou que vous vous tourniez, la est la Face d'Allah, Allah est Vaste et Omniscient (2:115) illustre cette vastitude infinie qui transcende toute direction.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 115, arabic: "فَأَيْنَمَا تُوَلُّوا فَثَمَّ وَجْهُ اللَّهِ إِنَّ اللَّهَ وَاسِعٌ عَلِيمٌ", translation: "Ou que vous vous tourniez, la est la Face d'Allah. Allah est Vaste et Omniscient.", link: "https://quran.com/fr/2:115" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:115", url: "https://quran.com/fr/2:115" }
 ]
 },
 46: {
 detailedMeaning: "Al-Hakim dérive de la racine h-k-m qui porte les sens de sagesse (hikma) et de jugement (hukm), designant Celui qui place chaque chose à sa juste place. Linguistiquement, ce terme implique la maîtrise de l'ordonnancement et l'infaillibilité du décret. Al-Hakim juge avec justesse et que Sa sagesse se manifeste dans la création comme dans la législation. Le croyant accepte les décrets d'Allah avec soumission, sachant que derrière chaque épreuve se caché une sagesse divine. Le verset : A Lui les plus beaux noms, et Il est le Tout Puissant, le Sage (59:24) associé Sa sagesse à Sa puissance, montrant que Ses actes sont parfaitement ordonnés.",
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
 detailedMeaning: "Al-Wadud dérive de la racine w-d-d (aimer) selon le schéma fa'ul, qui peut exprimer aussi bien le sens actif (Celui qui aime) que le sens passif (Celui qui est aime). Linguistiquement, Al-Wadud combine les deux sens simultanement : Il aime Ses serviteurs obéissants et Il est aime par eux. Al-Wadud est Celui qui place l'amour de Lui dans les cœurs de Ses serviteurs et que Son amour est la source de tout bien. Le Coran associe ce nom au pardon dans la sourate Al-Buruj (85:14) : Et c'est Lui le Pardonneur, le Plein d'amour, et à la miséricorde dans la sourate Hud (11:90) : Mon Seigneur est Miséricordieux et plein d'amour.",
 quranVerses: [
 { surah: "Hud", surahNumber: 11, ayah: 90, arabic: "وَاسْتَغْفِرُوا رَبَّكُمْ ثُمَّ تُوبُوا إِلَيْهِ إِنَّ رَبِّي رَحِيمٌ وَدُودٌ", translation: "Implorez le pardon de votre Seigneur puis revenez a Lui. Mon Seigneur est Miséricordieux et plein d'amour.", link: "https://quran.com/fr/11:90" },
 { surah: "Al-Buruj", surahNumber: 85, ayah: 14, arabic: "وَهُوَ الْغَفُورُ الْوَدُودُ", translation: "Et c'est Lui le Pardonneur, le Plein d'amour.", link: "https://quran.com/fr/85:14" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Buruj 85:14", url: "https://quran.com/fr/85:14" }
 ]
 },
 48: {
 detailedMeaning: "Al-Majid dérive de la racine m-j-d (être glorieux) et combine linguistiquement la vastitude des attributs (sa'at as-sifat) et la noblesse de l'essence (sharaf adh-dhat). Al-Majid est Celui dont la noblesse de l'essence, la générosité des actes et la beauté des attributs sont au plus haut degré de perfection. La gloire d'Allah combine noblesse et générosité, et le croyant glorifie Allah dans la prière d'Ibrahim. Le Coran déclare dans Al-Buruj (85:15) qu'Il est le Maître du Trône, le Glorieux, et dans Hud (11:73) qu'Il est Digne de louange et de gloire.",
 quranVerses: [
 { surah: "Hud", surahNumber: 11, ayah: 73, arabic: "رَحْمَتُ اللَّهِ وَبَرَكَاتُهُ عَلَيْكُمْ أَهْلَ الْبَيْتِ إِنَّهُ حَمِيدٌ مَّجِيدٌ", translation: "La miséricorde d'Allah et Ses bénédictions soient sur vous, gens de la maison. Il est certes Digne de louange et de gloire.", link: "https://quran.com/fr/11:73" },
 { surah: "Al-Buruj", surahNumber: 85, ayah: 15, arabic: "ذُو الْعَرْشِ الْمَجِيدُ", translation: "Le Maître du Trône, le Glorieux.", link: "https://quran.com/fr/85:15" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Buruj 85:15", url: "https://quran.com/fr/85:15" }
 ]
 },
 49: {
 detailedMeaning: "Al-Ba'ith dérive de la racine b-'-th (envoyer, ressusciter). Linguistiquement, ce nom comporte deux sens fondamentaux : la résurrection des morts (ba'th al-mawta) et l'envoi des messagers (ba'th ar-rusul). Al-Ba'ith est Celui qui ressuscite les morts, qui envoie les messagers et qui suscite dans les cœurs la lumière de la foi. La résurrection est une vérité certaine qu'il faut croire fermement, car Allah ressuscitera chaque créature pour le Compte final, et cette croyance est un pilier fondamental de la foi. Le Coran affirme dans la sourate Al-Hajj (22:7) : Allah ressuscitera ceux qui sont dans les tombes.",
 quranVerses: [
 { surah: "Al-Hajj", surahNumber: 22, ayah: 7, arabic: "وَأَنَّ السَّاعَةَ آتِيَةٌ لَّا رَيْبَ فِيهَا وَأَنَّ اللَّهَ يَبْعَثُ مَن فِي الْقُبُورِ", translation: "Et l'Heure viendra sans aucun doute, et Allah ressuscitera ceux qui sont dans les tombes.", link: "https://quran.com/fr/22:7" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hajj 22:7", url: "https://quran.com/fr/22:7" }
 ]
 },
 50: {
 detailedMeaning: "Ash-Shahid dérive de la racine sh-h-d (témoigner, être présent). Linguistiquement, ce nom désigne Celui dont la science est directe et présente, témoignant de toute chose sans intermédiaire. Ash-Shahid est Celui de qui rien n'est absent, présent par Sa science dont le témoignage couvre tout l'univers. Le témoignage d'Allah est un attribut lié à Sa science parfaite, incitant le croyant à la droiture en secret comme en public. Le Coran affirme dans Al-Buruj (85:9) : Allah est témoin de toute chose, et dans An-Nisa (4:166) qu'Il témoigne de ce qu'Il a révélé en toute connaissance.",
 quranVerses: [
 { surah: "Al-Buruj", surahNumber: 85, ayah: 9, arabic: "وَاللَّهُ عَلَىٰ كُلِّ شَيْءٍ شَهِيدٌ", translation: "Et Allah est témoin de toute chose.", link: "https://quran.com/fr/85:9" },
 { surah: "An-Nisa", surahNumber: 4, ayah: 166, arabic: "لَّٰكِنِ اللَّهُ يَشْهَدُ بِمَا أَنزَلَ إِلَيْكَ أَنزَلَهُ بِعِلْمِهِ", translation: "Mais Allah témoigne de ce qu'Il t'a révélé, Il l'a révélé en toute connaissance.", link: "https://quran.com/fr/4:166" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Buruj 85:9", url: "https://quran.com/fr/85:9" }
 ]
 },
 51: {
 detailedMeaning: "Al-Haqq dérive de la racine h-q-q (être vrai, certain). Linguistiquement, ce nom désigne l'existence nécessaire et certaine, par opposition au batil (faux) qui est contingent et éphémère. Al-Haqq est Celui dont l'existence est indeniable et nécessaire. Le croyant s'attache à la Vérité en suivant Sa révélation et en rejetant tout ce qui la contredit. Le Coran déclare dans Luqman (31:30) : Allah est la Vérité et ce qu'ils invoquent en dehors de Lui est le faux. Le Prophète (paix sur lui) invoquait : Tu es Al-Haqq, Ta promesse est vérité, Ta parole est vérité, comme rapporté dans Sahih Bukhari (1120).",
 quranVerses: [
 { surah: "Al-Hajj", surahNumber: 22, ayah: 6, arabic: "ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ وَأَنَّهُ يُحْيِي الْمَوْتَىٰ", translation: "C'est parce qu'Allah est la Vérité et c'est Lui qui donne la vie aux morts.", link: "https://quran.com/fr/22:6" },
 { surah: "Luqman", surahNumber: 31, ayah: 30, arabic: "ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ وَأَنَّ مَا يَدْعُونَ مِن دُونِهِ الْبَاطِلُ", translation: "C'est parce qu'Allah est la Vérité et que ce qu'ils invoquent en dehors de Lui est le faux.", link: "https://quran.com/fr/31:30" }
 ],
 hadithReferences: [
 { collection: "Sahih Bukhari", number: "1120", text: "Le Prophète (paix sur lui) disait dans sa prière nocturne : O Allah, Tu es Al-Haqq, Ta promesse est vérité, Ta parole est vérité et Ta rencontre est vérité.", link: "https://sunnah.com/bukhari:1120" }
 ],
 sources: [
 { label: "Quran.com - Al-Hajj 22:6", url: "https://quran.com/fr/22:6" },
 { label: "Sunnah.com - Bukhari 1120", url: "https://sunnah.com/bukhari:1120" }
 ]
 },
 52: {
 detailedMeaning: "Al-Wakil dérive de la racine w-k-l (confier, mandater). Linguistiquement, ce nom désigne Celui à qui les affaires sont confiees et qui les gere avec perfection et suffisance. Al-Wakil est Celui à qui sont confiees les affaires de Ses créatures. Celui qui se remet à Lui ne sera jamais decu. Le tawakkul est une réalité du cœur qui découle de la connaissance de ce nom, et le croyant prend les moyens tout en s'en remettant a Allah pour le résultat. Le Coran affirme dans Ali 'Imran (3:173) : Allah nous suffit, Il est notre meilleur Garant, comme rapporté dans Tirmidhi (2517).",
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
 detailedMeaning: "Al-Qawi dérive de la racine q-w-y (être fort). Linguistiquement, ce nom désigne une force parfaite et complète (quwwa kamila) qui ne connaît ni faiblesse ni diminution. Al-Qawi est Celui dont la force est parfaite et complète, qui ne connaît ni faiblesse ni impuissance dans aucun de Ses actes. La force d'Allah est un attribut reel et absolu, et le croyant ne se confie qu'en la force d'Allah et ne craint que Lui, car toute force dans l'univers n'est qu'un reflet de Sa puissance. Le Coran associe fréquemment ce nom a Al-'Aziz, comme dans Al-Hajj (22:74) : Certes, Allah est Fort et Tout Puissant, et dans Al-Hadid (57:25).",
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
 detailedMeaning: "Al-Matin dérive de la racine m-t-n (être ferme, solide). Linguistiquement, ce nom désigne une fermeté et une solidité absolues. La matana est la force constante qui ne faiblit jamais. Al-Matin est Celui dont la force ne faiblit pas et dont la puissance ne s'épuise jamais. Sa fermeté est sans faille. La fermeté d'Allah est absolue et inébranlable, et le croyant puise dans ce nom la force de rester ferme dans sa foi et sa pratique. Le Coran réunit ce nom avec la subsistance et la force dans la sourate Adh-Dhariyat (51:58) : C'est Allah qui est le Pourvoyeur, le Détenteur de la force, l'Inébranlable.",
 quranVerses: [
 { surah: "Adh-Dhariyat", surahNumber: 51, ayah: 58, arabic: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ", translation: "C'est Allah qui est le Pourvoyeur, le Détenteur de la force, l'Inébranlable.", link: "https://quran.com/fr/51:58" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Adh-Dhariyat 51:58", url: "https://quran.com/fr/51:58" }
 ]
 },
 55: {
 detailedMeaning: "Al-Wali dérive de la racine w-l-y (être proche, allier). Linguistiquement, la wilaya implique la proximité (qurb), le soutien (nusra) et la prise en charge (tawalli) des affaires des croyants. Al-Wali est Celui qui prend en charge les affaires de Ses serviteurs croyants et les protège de tout mal. L'alliance d'Allah est le fondement de la walaya, et que quiconque fait du mal à Ses allies, Allah lui déclare la guerre, comme rapporté dans Sahih Bukhari (6502). Le Coran affirme dans Al-Baqara (2:257) : Allah est l'Allie de ceux qui croient, Il les fait sortir des tenebres vers la lumière.",
 quranVerses: [
 { surah: "Ash-Shura", surahNumber: 42, ayah: 9, arabic: "أَمِ اتَّخَذُوا مِن دُونِهِ أَوْلِيَاءَ فَاللَّهُ هُوَ الْوَلِيُّ", translation: "Ont-ils pris des allies en dehors de Lui ? C'est Allah qui est l'Allie.", link: "https://quran.com/fr/42:9" },
 { surah: "Al-Baqara", surahNumber: 2, ayah: 257, arabic: "اللَّهُ وَلِيُّ الَّذِينَ آمَنُوا يُخْرِجُهُم مِّنَ الظُّلُمَاتِ إِلَى النُّورِ", translation: "Allah est l'Allie de ceux qui croient. Il les fait sortir des tenebres vers la lumière.", link: "https://quran.com/fr/2:257" }
 ],
 hadithReferences: [
 { collection: "Sahih Bukhari", number: "6502", text: "Allah a dit : Quiconque prend pour ennemi un de Mes allies, Je lui déclare la guerre.", link: "https://sunnah.com/bukhari:6502" }
 ],
 sources: [
 { label: "Quran.com - Al-Baqara 2:257", url: "https://quran.com/fr/2:257" },
 { label: "Sunnah.com - Bukhari 6502", url: "https://sunnah.com/bukhari:6502" }
 ]
 },
 56: {
 detailedMeaning: "Al-Hamid dérive de la racine h-m-d (louer). Linguistiquement, le hamd est la louange pour une perfection volontaire, à la différence du madh qui peut être pour une qualité involontaire. Al-Hamid est Celui qui est loue pour tous Ses attributs et Ses actes, et qu'Il est le seul digne de louange absolue et inconditionnelle. La louange revient à Allah en toute circonstance, dans l'aisance comme dans l'épreuve, et le croyant dit Alhamdulillah en tout état, reconnaissant que tout ce qu'Allah décrète est digne de louange. Le Coran l'associe a Al-'Aziz dans Ibrahim (14:1) : vers le chemin du Tout Puissant, du Digne de louange.",
 quranVerses: [
 { surah: "Ibrahim", surahNumber: 14, ayah: 1, arabic: "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ لِتُخْرِجَ النَّاسَ مِنَ الظُّلُمَاتِ إِلَى النُّورِ بِإِذْنِ رَبِّهِمْ إِلَىٰ صِرَاطِ الْعَزِيزِ الْحَمِيدِ", translation: "Un Livre que Nous avons fait descendre vers toi afin que tu fasses sortir les gens des tenebres vers la lumière, par la permission de leur Seigneur, vers le chemin du Tout Puissant, du Digne de louange.", link: "https://quran.com/fr/14:1" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ibrahim 14:1", url: "https://quran.com/fr/14:1" }
 ]
 },
 57: {
 detailedMeaning: "Al-Muhsi dérive de la racine h-s-y (dénombrer). Linguistiquement, l'ihsa' est le fait de connaître le nombre exact de chaque chose, aussi innombrable soit-elle pour les créatures. Al-Muhsi est Celui qui connaît le nombre de toute chose, qu'Il à tout dénombre dans Sa science et que rien ne Lui echappe, aussi petit soit-il. Le denombrement d'Allah est lié à Sa science parfaite et englobante. Le Jour du Jugement chaque acte sera présenté et compte. Le Coran déclare dans Maryam (19:94) : Il les a certes recenses et bien comptes, et dans Ya-Sin (36:12) : Nous avons dénombre toute chose dans un registre explicite.",
 quranVerses: [
 { surah: "Maryam", surahNumber: 19, ayah: 94, arabic: "لَّقَدْ أَحْصَاهُمْ وَعَدَّهُمْ عَدًّا", translation: "Il les a certes recenses et bien comptes.", link: "https://quran.com/fr/19:94" },
 { surah: "Ya-Sin", surahNumber: 36, ayah: 12, arabic: "وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ فِي إِمَامٍ مُّبِينٍ", translation: "Et Nous avons dénombre toute chose dans un registre explicite.", link: "https://quran.com/fr/36:12" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Maryam 19:94", url: "https://quran.com/fr/19:94" }
 ]
 },
 58: {
 detailedMeaning: "Al-Mubdi' dérive de la racine b-d-' (commencer, initier) selon le schéma muf'il, indiquant l'agent causal. Linguistiquement, l'ibda' est le fait de faire exister quelque chose pour la première fois, sans modèle antérieur. Al-Mubdi' est Celui qui a donne l'existence à toute chose a partir du néant, sans cause antérieure ni modèle préétabli. La création initiale témoigne de la puissance d'Allah. Celui qui a crée une première fois peut recréer, ce qui renforce la foi en la résurrection. Le Coran affirme dans Al-Buruj (85:13) : C'est Lui qui commence et qui recommence, et dans Yunus (10:4).",
 quranVerses: [
 { surah: "Al-Buruj", surahNumber: 85, ayah: 13, arabic: "إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ", translation: "C'est Lui qui commence et qui recommence.", link: "https://quran.com/fr/85:13" },
 { surah: "Yunus", surahNumber: 10, ayah: 4, arabic: "إِنَّهُ يَبْدَأُ الْخَلْقَ ثُمَّ يُعِيدُهُ", translation: "C'est Lui qui commence la création puis la recommence.", link: "https://quran.com/fr/10:4" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Buruj 85:13", url: "https://quran.com/fr/85:13" }
 ]
 },
 59: {
 detailedMeaning: "Al-Mu'id dérive de la racine '-w-d (revenir, recommencer) selon le schéma muf'il. Linguistiquement, l'i'ada est le fait de refaire ce qui a déjà ete fait, c'est-a-dire la recréation après la première création. Al-Mu'id ramene les créatures à la vie après la mort pour le Jour de la Rétribution. Cela est facile pour Lui. Le croyant ne doute pas de la résurrection, car Celui qui a crée la première fois est certainement capable de recréer. Le Coran déclare dans Ar-Rum (30:27) : C'est Lui qui commence la création puis la recommence, et cela Lui est plus facile encore.",
 quranVerses: [
 { surah: "Al-Buruj", surahNumber: 85, ayah: 13, arabic: "إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ", translation: "C'est Lui qui commence et qui recommence.", link: "https://quran.com/fr/85:13" },
 { surah: "Ar-Rum", surahNumber: 30, ayah: 27, arabic: "وَهُوَ الَّذِي يَبْدَأُ الْخَلْقَ ثُمَّ يُعِيدُهُ وَهُوَ أَهْوَنُ عَلَيْهِ", translation: "C'est Lui qui commence la création puis la recommence, et cela Lui est plus facile encore.", link: "https://quran.com/fr/30:27" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Rum 30:27", url: "https://quran.com/fr/30:27" }
 ]
 },
 60: {
 detailedMeaning: "Al-Muhyi dérive de la racine h-y-y (vivre) selon le schéma muf'il, indiquant l'agent qui cause la vie. Linguistiquement, l'ihya' est le fait de donner la vie, que ce soit au corps par l'âme, au cœur par la foi, ou à la terre par la pluie. Al-Muhyi crée la vie sous toutes ses formes. La plus noble est celle du cœur par la lumière de la foi. Le corps sans foi est un cadavre même s'il est en mouvement. Le Coran invite à contempler ce signe dans Ar-Rum (30:50) : Regarde les traces de la miséricorde d'Allah, comment Il redonne la vie à la terre après sa mort.",
 quranVerses: [
 { surah: "Ar-Rum", surahNumber: 30, ayah: 50, arabic: "فَانظُرْ إِلَىٰ آثَارِ رَحْمَتِ اللَّهِ كَيْفَ يُحْيِي الْأَرْضَ بَعْدَ مَوْتِهَا", translation: "Regarde les traces de la miséricorde d'Allah, comment Il redonne la vie à la terre après sa mort.", link: "https://quran.com/fr/30:50" },
 { surah: "Al-Hajj", surahNumber: 22, ayah: 6, arabic: "وَأَنَّهُ يُحْيِي الْمَوْتَىٰ وَأَنَّهُ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", translation: "Et c'est Lui qui donne la vie aux morts et Il est Omnipotent.", link: "https://quran.com/fr/22:6" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Rum 30:50", url: "https://quran.com/fr/30:50" }
 ]
 },
 61: {
 detailedMeaning: "Al-Mumit dérive de la racine m-w-t (mourir) selon le schéma muf'il, indiquant l'agent causal. Linguistiquement, l'imata est le fait d'oter la vie. La mort est une créature d'Allah, non pas un simple néant, mais un état décrète. Al-Mumit est Celui qui fait mourir les vivants selon Sa sagesse et Son décret eternel. La mort est un passage décrète avec sagesse, et le croyant s'y prepare en multipliant les bonnes actions. Le Coran déclare dans Al-Mulk (67:2) : Celui qui a crée la mort et la vie afin de vous éprouver, et dans Ali 'Imran (3:185) : Toute âme goûtera la mort.",
 quranVerses: [
 { surah: "Al-Mulk", surahNumber: 67, ayah: 2, arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا", translation: "Celui qui a crée la mort et la vie afin de vous éprouver, qui de vous est le meilleur en œuvres.", link: "https://quran.com/fr/67:2" },
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 185, arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", translation: "Toute âme goûtera la mort.", link: "https://quran.com/fr/3:185" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Mulk 67:2", url: "https://quran.com/fr/67:2" }
 ]
 },
 62: {
 detailedMeaning: "Al-Hayy dérive de la racine h-y-y (vivre). Linguistiquement, c'est linguistiquement un adjectif indiquant une vie parfaite, éternelle, qui ne connaît ni commencement ni fin ni affaiblissement. Tous les attributs d'action decoulent de la vie, car seul le vivant peut savoir, vouloir et agir. Al-Hayy est le Vivant qui ne meurt pas et dont la vie est inhérente à Son essence. Al-Hayy et Al-Qayyum sont les deux plus grands noms d'Allah et que tous les autres attributs en decoulent. Le Coran les associé dans Ayat al-Kursi (2:255), et le Prophète (paix sur lui) a confirmé cela dans Tirmidhi (3524).",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 255, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", translation: "Allah ! Point de divinité a part Lui, le Vivant, Celui qui subsiste par Lui-même.", link: "https://quran.com/fr/2:255" },
 { surah: "Ghafir", surahNumber: 40, ayah: 65, arabic: "هُوَ الْحَيُّ لَا إِلَٰهَ إِلَّا هُوَ فَادْعُوهُ مُخْلِصِينَ لَهُ الدِّينَ", translation: "C'est Lui le Vivant, point de divinité a part Lui. Invoquez-Le avec dévotion sincère.", link: "https://quran.com/fr/40:65" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:255", url: "https://quran.com/fr/2:255" }
 ]
 },
 63: {
 detailedMeaning: "Al-Qayyum dérive de la racine q-w-m (se tenir, subsister) selon le schéma fa''ul, forme d'intensité indiquant la pleinitude de l'attribut. Linguistiquement, il désigne Celui qui subsiste par Lui-même (qa'im bi-nafsihi) et par qui toute chose subsiste (muqim li-ghayrihi). Tous les noms d'Allah reviennent a Al-Hayy et Al-Qayyum. Le Coran associe constamment ces deux noms, comme dans Ayat al-Kursi (2:255) : le Vivant, le Subsistant, ni somnolence ni sommeil ne Le saisissent, et dans Ali 'Imran (3:2). La subsistance de tout l'univers dépend de Lui à chaque instant, tandis que Lui ne dépend de rien.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 255, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ", translation: "Allah ! Point de divinité a part Lui, le Vivant, le Subsistant. Ni somnolence ni sommeil ne Le saisissent.", link: "https://quran.com/fr/2:255" },
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 2, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", translation: "Allah ! Point de divinité a part Lui, le Vivant, le Subsistant.", link: "https://quran.com/fr/3:2" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:255", url: "https://quran.com/fr/2:255" }
 ]
 },
 64: {
 detailedMeaning: "Al-Wajid dérive de la racine w-j-d (trouver, posséder). Linguistiquement, ce nom désigne Celui qui possède tout et ne manque de rien, et qu'al-wujud exprime à la fois l'existence et la possession. Al-Wajid est Celui à qui rien ne manque, qui trouve tout ce qu'Il desire et possède tout ce qu'Il veut, sans peine ni effort. Allah est l'Opulent qui ne manque de rien, et le croyant cherche sa richesse auprès d'Allah seul. La racine w-j-d apparait dans le Coran sous la forme verbale, notamment dans Ad-Duha (93:7) : Ne t'a-t-Il pas trouve egare et Il t'a guide, illustrant Sa sollicitude.",
 quranVerses: [
 { surah: "Ad-Duha", surahNumber: 93, ayah: 7, arabic: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ", translation: "Ne t'a-t-Il pas trouve egare et Il t'a guide.", link: "https://quran.com/fr/93:7" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ad-Duha 93:7", url: "https://quran.com/fr/93:7" }
 ]
 },
 65: {
 detailedMeaning: "Al-Majid dérive de la racine m-j-d. Linguistiquement, sa forme avec le shadda (majjid) est une intensification combinant la vastitude des attributs et la noblesse absolue de l'essence. Al-Majid est Celui dont la noblesse est éminente et les bienfaits abondants, alliant la grandeur du rang à la générosité des actes. La gloire d'Allah se manifeste par la perfection de Ses attributs et l'abondance de Ses bienfaits, et le croyant invoque Sa gloire dans les prières sur le Prophète. Le Coran associe ce nom à la louange dans Hud (11:73) : Il est certes Digne de louange et de gloire.",
 quranVerses: [
 { surah: "Hud", surahNumber: 11, ayah: 73, arabic: "إِنَّهُ حَمِيدٌ مَّجِيدٌ", translation: "Il est certes Digne de louange et de gloire.", link: "https://quran.com/fr/11:73" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Hud 11:73", url: "https://quran.com/fr/11:73" }
 ]
 },
 66: {
 detailedMeaning: "Al-Wahid dérive de la racine w-h-d (être unique). Linguistiquement, la wahda d'Allah est de trois types : unicité de l'essence, des attributs et des actes divins. Al-Wahid est Celui qui n'a pas de second dans Son essence, pas de semblable dans Ses attributs et pas de partenaire dans Ses actes. L'unicité d'Allah est le fondement du tawhid et le premier devoir du serviteur. Le Coran proclame dans Al-Baqara (2:163) : Votre Dieu est un Dieu unique, et dans Al-Ikhlas (112:1) : Dis, Il est Allah, Unique. Le Prophète (paix sur lui) a dit : Allah etait et rien n'etait avec Lui, comme rapporté dans Sahih Bukhari (7392).",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 163, arabic: "وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ لَّا إِلَٰهَ إِلَّا هُوَ الرَّحْمَٰنُ الرَّحِيمُ", translation: "Et votre Dieu est un Dieu unique. Point de divinité a part Lui, le Tout Miséricordieux, le Très Miséricordieux.", link: "https://quran.com/fr/2:163" },
 { surah: "Al-Ikhlas", surahNumber: 112, ayah: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Dis : Il est Allah, Unique.", link: "https://quran.com/fr/112:1" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Ikhlas 112:1", url: "https://quran.com/fr/112:1" }
 ]
 },
 67: {
 detailedMeaning: "As-Samad dérive de la racine s-m-d qui désigne la pleinitude et la permanence. Linguistiquement, ce nom désigne Celui vers qui convergent toutes les requetes (yusmadu ilayhi) car Il est plein et parfait. As-Samad est le Maître dont la souveraineté est complète, Celui vers qui on se dirige dans les besoins et à qui on s'adresse dans les épreuves. As-Samad est Celui qui réunit toutes les qualités de perfection, qu'Il est le Plein qui n'a aucun vide et le Riche dont rien ne manque. Le Coran mentionne ce nom dans la sourate Al-Ikhlas (112:2) : Allah, As-Samad, dans un contexte qui affirme Son unicité absolue et Son indépendance de toute créature.",
 quranVerses: [
 { surah: "Al-Ikhlas", surahNumber: 112, ayah: 2, arabic: "اللَّهُ الصَّمَدُ", translation: "Allah, le Soutien universel.", link: "https://quran.com/fr/112:2" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Ikhlas 112:2", url: "https://quran.com/fr/112:2" }
 ]
 },
 68: {
 detailedMeaning: "Al-Qadir dérive de la racine q-d-r (pouvoir, décréter) selon le schéma fa'il, indiquant un attribut permanent. Linguistiquement, al-qudra est le pouvoir de faire exister les choses conformement à la volonté et à la science divines. Al-Qadir fait exister les choses conformement à Sa volonté et que Sa puissance n'est entravee par rien. La puissance d'Allah est un attribut reel et absolu, que rien n'est impossible pour Lui et que Sa volonté s'accomplit sans entrave. Le Coran répété : Certes, Allah est Omnipotent (2:20), et dans Al-An'am (6:65) : Il est capable de vous envoyer un châtiment d'au-dessus de vous.",
 quranVerses: [
 { surah: "Al-An'am", surahNumber: 6, ayah: 65, arabic: "قُلْ هُوَ الْقَادِرُ عَلَىٰ أَن يَبْعَثَ عَلَيْكُمْ عَذَابًا مِّن فَوْقِكُمْ", translation: "Dis : Il est capable de vous envoyer un châtiment d'au-dessus de vous.", link: "https://quran.com/fr/6:65" },
 { surah: "Al-Baqara", surahNumber: 2, ayah: 20, arabic: "إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", translation: "Certes, Allah est Omnipotent.", link: "https://quran.com/fr/2:20" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-An'am 6:65", url: "https://quran.com/fr/6:65" }
 ]
 },
 69: {
 detailedMeaning: "Al-Muqtadir dérive de la racine q-d-r (pouvoir) selon le schéma mufta'il. Linguistiquement, c'est une forme intensive d'Al-Qadir, indiquant que la puissance divine s'exerce de manière effective et totale sur toute chose. Al-Muqtadir signifie que la puissance d'Allah s'exerce effectivement et sans entrave. Ce nom rappelle que les châtiments d'Allah s'abattent avec précision sur ceux qui nient Ses signes. Le Coran utilise ce nom dans Al-Qamar (54:42) : Nous les saisimes de la saisie d'un Tout Puissant Omnipotent, et dans Al-Kahf (18:45) : Allah est Omnipotent.",
 quranVerses: [
 { surah: "Al-Qamar", surahNumber: 54, ayah: 42, arabic: "كَذَّبُوا بِآيَاتِنَا كُلِّهَا فَأَخَذْنَاهُمْ أَخْذَ عَزِيزٍ مُّقْتَدِرٍ", translation: "Ils dénoncèrent Nos signes, tous. Nous les saisimes de la saisie d'un Tout Puissant Omnipotent.", link: "https://quran.com/fr/54:42" },
 { surah: "Al-Kahf", surahNumber: 18, ayah: 45, arabic: "وَكَانَ اللَّهُ عَلَىٰ كُلِّ شَيْءٍ مُّقْتَدِرًا", translation: "Et Allah est Omnipotent.", link: "https://quran.com/fr/18:45" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Qamar 54:42", url: "https://quran.com/fr/54:42" }
 ]
 },
 70: {
 detailedMeaning: "Al-Muqaddim dérive de la racine q-d-m (avancer, précéder). Linguistiquement, le taqdim est le fait de mettre en avant et de faire précéder certaines choses sur d'autres selon un ordre sage. Al-Muqaddim est Celui qui avance les choses à leur place et à leur temps selon un ordre parfait. Allah avance ce qu'Il veut dans l'ordre et le temps, et le croyant accepte Sa volonté, sachant que tout est dispose selon une sagesse parfaite. Le Prophète (paix sur lui) invoquait : Tu es Al-Muqaddim et Al-Mu'akhkhir, comme rapporté dans Sahih Bukhari (1120). Ce nom se comprend en pair avec Al-Mu'akhkhir.",
 quranVerses: [
 { surah: "Qaf", surahNumber: 50, ayah: 28, arabic: "قَالَ لَا تَخْتَصِمُوا لَدَيَّ وَقَدْ قَدَّمْتُ إِلَيْكُم بِالْوَعِيدِ", translation: "Il dira : Ne vous disputez pas devant Moi. Je vous avais avertis.", link: "https://quran.com/fr/50:28" }
 ],
 hadithReferences: [
 { collection: "Sahih Bukhari", number: "1120", text: "Le Prophète (paix sur lui) disait : O Allah, pardonne-moi ce que j'ai fait et ce que je ferai, ce que j'ai caché et ce que j'ai rendu public. Tu es Al-Muqaddim et Al-Mu'akhkhir.", link: "https://sunnah.com/bukhari:1120" }
 ],
 sources: [
 { label: "Quran.com - Qaf 50:28", url: "https://quran.com/fr/50:28" }
 ]
 },
 71: {
 detailedMeaning: "Al-Mu'akhkhir dérive de la racine '-kh-r (retarder, reporter). Linguistiquement, le ta'khir est le fait de repousser et de retarder, complément naturel du taqdim (avancement). Al-Mu'akhkhir retarde les choses selon Sa sagesse, et qu'Il retarde le châtiment des pecheurs pour leur donner une chance de se repentir. Le report du châtiment est un signe de Sa patience et une occasion de repentir pour les désobéissants. Le Coran illustre ce sens dans Ibrahim (14:42) : Il les ajourne seulement jusqu'au jour où les yeux seront fixes. Ce nom se comprend en pair avec Al-Muqaddim.",
 quranVerses: [
 { surah: "Ibrahim", surahNumber: 14, ayah: 42, arabic: "وَلَا تَحْسَبَنَّ اللَّهَ غَافِلًا عَمَّا يَعْمَلُ الظَّالِمُونَ إِنَّمَا يُؤَخِّرُهُمْ لِيَوْمٍ تَشْخَصُ فِيهِ الْأَبْصَارُ", translation: "Ne pense surtout pas qu'Allah est inattentif à ce que font les injustes. Il les ajourne seulement jusqu'au jour où les yeux seront fixes.", link: "https://quran.com/fr/14:42" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ibrahim 14:42", url: "https://quran.com/fr/14:42" }
 ]
 },
 72: {
 detailedMeaning: "Al-Awwal dérive de la racine '-w-l (être premier). Linguistiquement, ce nom désigne la primaute absolue dans l'existence : rien ne Le précède et Son existence n'a pas de commencement. Al-Awwal est Celui qui existait avant toute chose et que Son existence précède toute existence. L'éternité d'Allah dans le passe est un fondement de la foi, et qu'Il existait et rien n'existait avec Lui. Le Coran réunit ce nom avec trois autres dans Al-Hadid (57:3) : C'est Lui le Premier et le Dernier, l'Apparent et le Caché. Le Prophète (paix sur lui) invoquait : Tu es Al-Awwal et rien n'est avant Toi, comme rapporté dans Sahih Muslim (2713).",
 quranVerses: [
 { surah: "Al-Hadid", surahNumber: 57, ayah: 3, arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ", translation: "C'est Lui le Premier et le Dernier, l'Apparent et le Caché. Et Il est Omniscient.", link: "https://quran.com/fr/57:3" }
 ],
 hadithReferences: [
 { collection: "Sahih Muslim", number: "2713", text: "Le Prophète (paix sur lui) disait : O Allah, Tu es Al-Awwal et rien n'est avant Toi, Tu es Al-Akhir et rien n'est après Toi.", link: "https://sunnah.com/muslim:2713" }
 ],
 sources: [
 { label: "Quran.com - Al-Hadid 57:3", url: "https://quran.com/fr/57:3" },
 { label: "Sunnah.com - Muslim 2713", url: "https://sunnah.com/muslim:2713" }
 ]
 },
 73: {
 detailedMeaning: "Al-Akhir dérive de la racine '-kh-r (être dernier) et désigne Celui qui demeure après la disparition de toute chose. Linguistiquement, il désigne Celui dont l'existence n'a pas de fin, à la différence de tout ce qui est crée. Il est eternel sans fin comme Il est eternel sans commencement, demeurant après la disparition de toute chose. L'éternité d'Allah dans le futur est certaine et le croyant s'attache à l'Éternel plutot qu'a l'éphémère. Ce nom apparait dans le verset d'Al-Hadid (57:3) aux côtés d'Al-Awwal, Az-Zahir et Al-Batin, formant un ensemble qui affirme la souveraineté temporelle et spatiale absolue d'Allah.",
 quranVerses: [
 { surah: "Al-Hadid", surahNumber: 57, ayah: 3, arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ", translation: "C'est Lui le Premier et le Dernier, l'Apparent et le Caché.", link: "https://quran.com/fr/57:3" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hadid 57:3", url: "https://quran.com/fr/57:3" }
 ]
 },
 74: {
 detailedMeaning: "Az-Zahir dérive de la racine z-h-r (apparaître, être manifeste) et désigne Celui dont l'existence est évidente par les preuves et les signes. Linguistiquement, ce nom indique Celui dont l'existence est rendue manifeste par la multitude des preuves dans la création. Tout dans la création pointe vers Lui, car Ses signes sont si nombreux que Son existence est plus évidente que toute autre réalité. Rien n'est au-dessus de Lui, comme l'affirme le hadith : Tu es Az-Zahir et rien n'est au-dessus de Toi. Ce nom figure dans Al-Hadid (57:3) avec Al-Awwal, Al-Akhir et Al-Batin, affirmant Sa transcendance.",
 quranVerses: [
 { surah: "Al-Hadid", surahNumber: 57, ayah: 3, arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ", translation: "C'est Lui le Premier et le Dernier, l'Apparent et le Caché.", link: "https://quran.com/fr/57:3" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hadid 57:3", url: "https://quran.com/fr/57:3" }
 ]
 },
 75: {
 detailedMeaning: "Al-Batin dérive de la racine b-t-n (être caché, intérieur) et désigne Celui dont l'essence est cachée aux sens et à l'imagination, tout en etant connu par les preuves rationnelles. Linguistiquement, l'essence divine ne peut être apprehendee par aucune perception sensorielle. Son essence ne peut être saisie par aucune créature dans ce monde. Allah est caché aux regards ici-bas, mais qu'Il sera vu dans l'au-delà par les croyants. Ce nom figure dans Al-Hadid (57:3) : Il est le Premier et le Dernier, l'Apparent et le Caché, et Il est Omniscient, montrant que Sa science embrasse tout.",
 quranVerses: [
 { surah: "Al-Hadid", surahNumber: 57, ayah: 3, arabic: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ", translation: "C'est Lui le Premier et le Dernier, l'Apparent et le Caché. Et Il est Omniscient.", link: "https://quran.com/fr/57:3" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hadid 57:3", url: "https://quran.com/fr/57:3" }
 ]
 },
 76: {
 detailedMeaning: "Al-Wali dérive de la racine w-l-y dans le sens de gouverner (wilaya) et désigne Celui qui gere et administre les affaires de la création avec autorité. Linguistiquement, ce nom exprime la gouvernance totale et l'administration souveraine de toute chose. L'univers est Son royaume et que Sa gestion couvre chaque détail de la création. Allah gouverne selon Son décret que rien ne se produit sans Sa permission et Sa volonté. Ce nom apparait en lien avec le verset d'Ar-Ra'd (13:11), soulignant que la protection divine s'exerce par l'intermédiaire de Ses anges et de Son décret.",
 quranVerses: [
 { surah: "Ar-Ra'd", surahNumber: 13, ayah: 11, arabic: "لَهُ مُعَقِّبَاتٌ مِّن بَيْنِ يَدَيْهِ وَمِنْ خَلْفِهِ يَحْفَظُونَهُ مِنْ أَمْرِ اللَّهِ", translation: "Il à des anges qui se succedent devant et derrière lui et le protegent par l'ordre d'Allah.", link: "https://quran.com/fr/13:11" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Ra'd 13:11", url: "https://quran.com/fr/13:11" }
 ]
 },
 77: {
 detailedMeaning: "Al-Muta'ali dérive de la racine '-l-w sur le schéma mutafa'il, exprimant l'élévation absolue au-dessus de tout, dépassant toute description et toute limitation. Linguistiquement, cette forme indique une transcendance active et permanente qui surpasse tout. Il est élève au-dessus de tout ce que les créatures peuvent Lui attribuer et que Sa transcendance dépasse toute comprehension. Cette élévation est un attribut affirme par le Coran et la Sunna. Ce nom apparait dans Ar-Ra'd (13:9) couple avec Al-Kabir : le Connaisseur de l'invisible et du visible, le Très Grand, le Très Élève, affirmant Sa majesté suprême.",
 quranVerses: [
 { surah: "Ar-Ra'd", surahNumber: 13, ayah: 9, arabic: "عَالِمُ الْغَيْبِ وَالشَّهَادَةِ الْكَبِيرُ الْمُتَعَالِ", translation: "Le Connaisseur de l'invisible et du visible, le Très Grand, le Très Élève.", link: "https://quran.com/fr/13:9" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Ra'd 13:9", url: "https://quran.com/fr/13:9" }
 ]
 },
 78: {
 detailedMeaning: "Al-Barr dérive de la racine b-r-r (être bienfaisant, pieux) et désigne Celui dont la bonté englobante touche tout être. Linguistiquement, al-birr désigne la bonté universelle qui s'etend à toute créature sans distinction. Sa bienfaisance atteint toutes les créatures, obéissantes ou désobéissantes, car Sa bonté n'est pas conditionnee par le mérité. Il est bon envers tous, même ceux qui Lui désobéissent, leur accordant sante et subsistance comme délai pour le repentir. Ce nom apparait dans At-Tur (52:28) couple avec Ar-Rahim : C'est Lui le Bienfaisant, le Miséricordieux, soulignant l'alliance de la bonté et de la miséricorde.",
 quranVerses: [
 { surah: "At-Tur", surahNumber: 52, ayah: 28, arabic: "إِنَّا كُنَّا مِن قَبْلُ نَدْعُوهُ إِنَّهُ هُوَ الْبَرُّ الرَّحِيمُ", translation: "Nous L'invoquions auparavant. C'est Lui le Bienfaisant, le Miséricordieux.", link: "https://quran.com/fr/52:28" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - At-Tur 52:28", url: "https://quran.com/fr/52:28" }
 ]
 },
 79: {
 detailedMeaning: "At-Tawwab dérive de la racine t-w-b (revenir) selon le schéma fa''al, forme intensive exprimant la répétition et la constance dans l'acceptation du repentir. Linguistiquement, la tawba d'Allah signifie qu'Il Se tourne vers Son serviteur avec miséricorde, facilitant et acceptant son retour. Il ne cesse d'accepter le repentir quel que soit le nombre des retours, car Il inspiré le repentir puis l'accepte. Cette porte reste ouverte tant que le soleil ne se leve pas de l'ouest. Ce nom apparait dans Al-Baqara (2:37) et An-Nasr (110:3), et le hadith rapporté qu'Allah est plus heureux du repentir de Son serviteur que celui qui retrouve sa monture egaree.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 37, arabic: "فَتَلَقَّىٰ آدَمُ مِن رَّبِّهِ كَلِمَاتٍ فَتَابَ عَلَيْهِ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ", translation: "Adam recut de son Seigneur des paroles, et Allah agrea son repentir. Car c'est Lui le Repentant, le Miséricordieux.", link: "https://quran.com/fr/2:37" },
 { surah: "An-Nasr", surahNumber: 110, ayah: 3, arabic: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا", translation: "Glorifie ton Seigneur et implore Son pardon. Il est certes Celui qui accepte le repentir.", link: "https://quran.com/fr/110:3" }
 ],
 hadithReferences: [
 { collection: "Sahih Muslim", number: "2747", text: "Allah est plus heureux du repentir de Son serviteur que l'un de vous qui retrouve sa monture egaree dans le désert.", link: "https://sunnah.com/muslim:2747" }
 ],
 sources: [
 { label: "Quran.com - Al-Baqara 2:37", url: "https://quran.com/fr/2:37" },
 { label: "Sunnah.com - Muslim 2747", url: "https://sunnah.com/muslim:2747" }
 ]
 },
 80: {
 detailedMeaning: "Al-Muntaqim dérive de la racine n-q-m (tirer vengeance) et désigne Celui qui inflige le châtiment juste a celui qui persiste dans la transgression après les avertissements. Linguistiquement, l'intiqam est la rétribution méritee qui suit l'obstination dans le mal. Il ne se venge que de ceux qui le méritent, après leur avoir accorde des délais. Sa vengeance est justice pure. Le croyant se hate de se repentir pour eviter cette vengeance. Ce nom est attesté dans As-Sajda (32:22) : Nous nous vengerons des criminels, et Ali 'Imran (3:4) : Allah est Tout Puissant, Détenteur de la vengeance.",
 quranVerses: [
 { surah: "As-Sajda", surahNumber: 32, ayah: 22, arabic: "إِنَّا مِنَ الْمُجْرِمِينَ مُنتَقِمُونَ", translation: "Nous nous vengerons des criminels.", link: "https://quran.com/fr/32:22" },
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 4, arabic: "وَاللَّهُ عَزِيزٌ ذُو انتِقَامٍ", translation: "Et Allah est Tout Puissant, Détenteur de la vengeance.", link: "https://quran.com/fr/3:4" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - As-Sajda 32:22", url: "https://quran.com/fr/32:22" }
 ]
 },
 81: {
 detailedMeaning: "Al-'Afuw dérive de la racine '-f-w (effacer) et désigne Celui qui efface les péchés de manière totale et définitive. Linguistiquement, le 'afw est supérieur au ghufran : le pardon couvre le péché tandis que l'effacement le supprime entièrement du registre. L'effacement ne laisse aucune trace contrairement au simple pardon. Le croyant invoque Al-'Afuw dans la Nuit du Destin, comme l'a enseigne le Prophète a Aisha : Allahumma innaka 'Afuwwun tuhibbu al-'afwa fa'fu 'anni. Ce nom apparait dans An-Nisa (4:149) couple avec Al-Qadir, et Ash-Shura (42:25) : Il accepte le repentir et efface les mauvaises actions.",
 quranVerses: [
 { surah: "An-Nisa", surahNumber: 4, ayah: 149, arabic: "فَإِنَّ اللَّهَ كَانَ عَفُوًّا قَدِيرًا", translation: "Certes, Allah est Indulgent et Omnipotent.", link: "https://quran.com/fr/4:149" },
 { surah: "Ash-Shura", surahNumber: 42, ayah: 25, arabic: "وَهُوَ الَّذِي يَقْبَلُ التَّوْبَةَ عَنْ عِبَادِهِ وَيَعْفُو عَنِ السَّيِّئَاتِ", translation: "C'est Lui qui accepte le repentir de Ses serviteurs et efface les mauvaises actions.", link: "https://quran.com/fr/42:25" }
 ],
 hadithReferences: [
 { collection: "Tirmidhi", number: "3513", text: "Aisha demanda au Prophète (paix sur lui) : Si je sais quelle nuit est la Nuit du Destin, que dois-je dire ? Il repondit : Dis : Allahumma innaka 'Afuwwun tuhibbu al-'afwa fa'fu 'anni.", link: "https://sunnah.com/tirmidhi:3513" }
 ],
 sources: [
 { label: "Quran.com - An-Nisa 4:149", url: "https://quran.com/fr/4:149" },
 { label: "Sunnah.com - Tirmidhi 3513", url: "https://sunnah.com/tirmidhi:3513" }
 ]
 },
 82: {
 detailedMeaning: "Ar-Ra'uf dérive de la racine r-'-f (être compatissant) et désigne Celui dont la compassion est le degré le plus delicat de la miséricorde. Linguistiquement, la ra'fa est plus tendre et plus intime que la rahma générale, représentant la fine fleur de la miséricorde. C'est le sommet de la miséricorde divine, surpassant en douceur toute autre clémence. Cette compassion se manifeste par l'allègement des obligations et la facilitation de la religion. Ce nom apparait dans Al-Baqara (2:207) : Allah est Compatissant envers les serviteurs, et dans Al-Hajj (22:65) couple avec Ar-Rahim, soulignant l'alliance de compassion et de miséricorde.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 207, arabic: "وَاللَّهُ رَءُوفٌ بِالْعِبَادِ", translation: "Et Allah est Compatissant envers les serviteurs.", link: "https://quran.com/fr/2:207" },
 { surah: "Al-Hajj", surahNumber: 22, ayah: 65, arabic: "إِنَّ اللَّهَ بِالنَّاسِ لَرَءُوفٌ رَّحِيمٌ", translation: "Certes, Allah est plein de Compassion et de Miséricorde envers les gens.", link: "https://quran.com/fr/22:65" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:207", url: "https://quran.com/fr/2:207" }
 ]
 },
 83: {
 detailedMeaning: "Malik-ul-Mulk est une construction d'annexion (idafa) signifiant le Possesseur de toute royauté. Linguistiquement, le mulk désigne la souveraineté totale et le pouvoir absolu de disposition. Toute royauté appartient à Allah et que les rois de la terre ne sont que des dépositaires temporaires de Son pouvoir. Les gouvernants ne detiennent qu'un pouvoir emprunté et temporaire. Ce nom est attesté dans Ali 'Imran (3:26) : Dis : O Allah, Maître de l'autorité absolue, Tu donnes l'autorité à qui Tu veux et Tu arraches l'autorité à qui Tu veux, affirmant Sa souveraineté sans partage.",
 quranVerses: [
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 26, arabic: "قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَن تَشَاءُ وَتَنزِعُ الْمُلْكَ مِمَّن تَشَاءُ", translation: "Dis : O Allah, Maître de l'autorité absolue. Tu donnes l'autorité à qui Tu veux et Tu arraches l'autorité à qui Tu veux.", link: "https://quran.com/fr/3:26" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ali 'Imran 3:26", url: "https://quran.com/fr/3:26" }
 ]
 },
 84: {
 detailedMeaning: "Dhul-Jalali wal-Ikram est compose de dhu (possesseur), jalal (majesté) et ikram (générosité), réunissant les attributs de grandeur et de bonté. Linguistiquement, ce nom rassemble deux dimensions complémentaires de la perfection divine. La majesté inspiré la vénération et la crainte, tandis que la générosité inspiré la gratitude. Le croyant invoque Allah par ce nom comme l'a ordonne le Prophète. Ce nom apparait dans Ar-Rahman (55:27) : Seule subsistera la Face de ton Seigneur, plein de majesté et de noblesse, et le hadith rapporté par At-Tirmidhi enjoint de persister a invoquer Ya Dhal-Jalali wal-Ikram.",
 quranVerses: [
 { surah: "Ar-Rahman", surahNumber: 55, ayah: 27, arabic: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ", translation: "Seule subsistera la Face de ton Seigneur, plein de majesté et de noblesse.", link: "https://quran.com/fr/55:27" },
 { surah: "Ar-Rahman", surahNumber: 55, ayah: 78, arabic: "تَبَارَكَ اسْمُ رَبِّكَ ذِي الْجَلَالِ وَالْإِكْرَامِ", translation: "Beni soit le nom de ton Seigneur, plein de majesté et de noblesse.", link: "https://quran.com/fr/55:78" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Rahman 55:27", url: "https://quran.com/fr/55:27" }
 ]
 },
 85: {
 detailedMeaning: "Al-Muqsit dérive de la racine q-s-t (être équitable) sur le schéma muf'il, forme causale indiquant Celui qui etablit la justice. Linguistiquement, le qist est la justice dans l'application, le fait de donner a chacun ce qui lui revient sans excès ni manquement. Il récompense l'obéissant et punit le désobéissant, chacun selon ce qu'il mérité. Le Jour du Jugement les balances seront etablies avec équité et qu'aucune âme ne sera lesee. Ce nom est lié au verset d'Al-Anbiya (21:47) : Nous placerons les balances de la justice le Jour de la Résurrection, aucune âme ne sera lesee en rien, affirmant la rétribution parfaite.",
 quranVerses: [
 { surah: "Al-Anbiya", surahNumber: 21, ayah: 47, arabic: "وَنَضَعُ الْمَوَازِينَ الْقِسْطَ لِيَوْمِ الْقِيَامَةِ فَلَا تُظْلَمُ نَفْسٌ شَيْئًا", translation: "Nous placerons les balances de la justice le Jour de la Résurrection. Aucune âme ne sera lesee en rien.", link: "https://quran.com/fr/21:47" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Anbiya 21:47", url: "https://quran.com/fr/21:47" }
 ]
 },
 86: {
 detailedMeaning: "Al-Jami' dérive de la racine j-m-' (rassembler, réunir) selon le schéma fa'il, designant un attribut permanent. Linguistiquement, le jam' est la réunion de choses dispersées, que ce soient les créatures pour le Jugement où les bienfaits pour Ses serviteurs. Il rassemble les créatures le Jour du Jugement et réunit les bienfaits pour Ses serviteurs. Le croyant s'y prepare par la foi et les bonnes œuvres. Ce nom apparait dans Ali 'Imran (3:9) : Tu es Celui qui rassemblera les gens, un jour au sujet duquel il n'y à aucun doute, et dans At-Taghabun (64:9) au sujet du Jour du Rassemblement.",
 quranVerses: [
 { surah: "Ali 'Imran", surahNumber: 3, ayah: 9, arabic: "رَبَّنَا إِنَّكَ جَامِعُ النَّاسِ لِيَوْمٍ لَّا رَيْبَ فِيهِ", translation: "Seigneur, Tu es Celui qui rassemblera les gens, un jour au sujet duquel il n'y à aucun doute.", link: "https://quran.com/fr/3:9" },
 { surah: "At-Taghabun", surahNumber: 64, ayah: 9, arabic: "يَوْمَ يَجْمَعُكُمْ لِيَوْمِ الْجَمْعِ ذَٰلِكَ يَوْمُ التَّغَابُنِ", translation: "Le jour où Il vous rassemblera pour le Jour du Rassemblement, ce sera le jour de la révélation des pertes.", link: "https://quran.com/fr/64:9" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ali 'Imran 3:9", url: "https://quran.com/fr/3:9" }
 ]
 },
 87: {
 detailedMeaning: "Al-Ghani dérive de la racine gh-n-y (être riche, se suffire) et désigne Celui dont l'autosuffisance est absolue : Il n'a besoin de rien tandis que tout a besoin de Lui. Linguistiquement, le ghina est l'indépendance totale de toute créature et de tout besoin. Même si toutes les créatures L'adoraient ou Le reniaient, cela n'ajouterait rien à Sa richesse. Cette richesse est inhérente à Son essence. Ce nom apparait dans Fatir (35:15) : O hommes, vous etes les indigents ayant besoin d'Allah, et c'est Allah le Riche, le Digne de louange, soulignant le contraste entre la richesse divine et la pauvrete des créatures.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 263, arabic: "وَاللَّهُ غَنِيٌّ حَلِيمٌ", translation: "Et Allah est Riche et Clement.", link: "https://quran.com/fr/2:263" },
 { surah: "Fatir", surahNumber: 35, ayah: 15, arabic: "يَا أَيُّهَا النَّاسُ أَنتُمُ الْفُقَرَاءُ إِلَى اللَّهِ وَاللَّهُ هُوَ الْغَنِيُّ الْحَمِيدُ", translation: "O hommes, vous etes les indigents ayant besoin d'Allah, et c'est Allah le Riche, le Digne de louange.", link: "https://quran.com/fr/35:15" }
 ],
 hadithReferences: [
 { collection: "Sahih Muslim", number: "2577", text: "Allah dit : O Mes serviteurs, vous ne pourriez jamais Me nuire ni Me profiter. O Mes serviteurs, si les premiers et les derniers parmi vous avaient le cœur le plus pieux, cela n'ajouterait rien a Ma souveraineté.", link: "https://sunnah.com/muslim:2577" }
 ],
 sources: [
 { label: "Quran.com - Fatir 35:15", url: "https://quran.com/fr/35:15" },
 { label: "Sunnah.com - Muslim 2577", url: "https://sunnah.com/muslim:2577" }
 ]
 },
 88: {
 detailedMeaning: "Al-Mughni dérive de la racine gh-n-y sous la forme af'ala (causale), indiquant Celui qui rend riche et autosuffisant. Linguistiquement, l'ighna' est le fait de rendre riche, que ce soit par les biens materiels ou la richesse du cœur. La vraie richesse n'est pas l'abondance des biens mais la richesse du cœur. C'est Allah seul qui accorde cette indépendance. Le croyant demande la richesse a Allah seul et Lui en est reconnaissant. Ce nom apparait dans An-Najm (53:48) : C'est Lui qui enrichit et qui donne satisfaction, et dans At-Tawba (9:28) : Si vous craignez la pauvrete, Allah vous enrichira de Sa grâce.",
 quranVerses: [
 { surah: "An-Najm", surahNumber: 53, ayah: 48, arabic: "وَأَنَّهُ هُوَ أَغْنَىٰ وَأَقْنَىٰ", translation: "Et c'est Lui qui enrichit et qui donne satisfaction.", link: "https://quran.com/fr/53:48" },
 { surah: "At-Tawba", surahNumber: 9, ayah: 28, arabic: "وَإِنْ خِفْتُمْ عَيْلَةً فَسَوْفَ يُغْنِيكُمُ اللَّهُ مِن فَضْلِهِ", translation: "Et si vous craignez la pauvrete, Allah vous enrichira de Sa grâce.", link: "https://quran.com/fr/9:28" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - An-Najm 53:48", url: "https://quran.com/fr/53:48" }
 ]
 },
 89: {
 detailedMeaning: "Al-Mani' dérive de la racine m-n-' (empecher, interdire) et désigne Celui qui retient et empeche selon Sa sagesse. Linguistiquement, le man' est le fait de retenir et d'empecher, que ce soit le mal d'atteindre les protégés ou le bien d'atteindre ceux qui n'en sont pas dignes. Il est le Bouclier des croyants, empechant le mal de les atteindre et retenant ce qu'Il veut. Le croyant cherche refuge auprès d'Allah et sait que seul Allah peut le proteger. Ce nom se comprend en lien avec An-Nas (114:1) : Dis : Je cherche protection auprès du Seigneur des hommes, soulignant qu'Allah seul est le véritable protecteur.",
 quranVerses: [
 { surah: "An-Nas", surahNumber: 114, ayah: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", translation: "Dis : Je cherche protection auprès du Seigneur des hommes.", link: "https://quran.com/fr/114:1" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - An-Nas 114:1", url: "https://quran.com/fr/114:1" }
 ]
 },
 90: {
 detailedMeaning: "Ad-Darr dérive de la racine d-r-r (nuire) et désigne Celui qui décrète l'épreuve selon Sa sagesse. Linguistiquement, le darr est le contraire du naf' (profit) et que ce nom ne s'emploie pas seul mais en pair avec An-Nafi', exprimant la souveraineté totale d'Allah. L'épreuve contient toujours une sagesse cachée et un bien potentiel. Il ne faut pas invoquer ce nom isolement. Nul ne peut nuire sans la permission d'Allah et le croyant patiente dans l'épreuve. Ce nom est attesté dans Al-An'am (6:17) : Si Allah te touche d'un mal, nul ne peut l'enlever sauf Lui.",
 quranVerses: [
 { surah: "Al-An'am", surahNumber: 6, ayah: 17, arabic: "وَإِن يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ", translation: "Si Allah te touche d'un mal, nul ne peut l'enlever sauf Lui.", link: "https://quran.com/fr/6:17" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-An'am 6:17", url: "https://quran.com/fr/6:17" }
 ]
 },
 91: {
 detailedMeaning: "An-Nafi' dérive de la racine n-f-' (profiter) et désigne Celui qui est la source véritable de tout profit pour Ses créatures. Linguistiquement, le naf' est tout ce qui apporte un bien ou un avantage, et qu'Allah seul en est la source. Les créatures ne peuvent ni profiter ni nuire par elles-mêmes, car tout est entre les mains d'Allah. Tout profit vient d'Allah seul et le croyant ne demande qu'à Lui. Ce nom est attesté dans Al-Fath (48:11) : Qui peut quoi que ce soit pour vous contre Allah, s'Il vous veut du mal ou du bien, et le hadith d'At-Tirmidhi enseigne que nul ne pourrait profiter que par ce qu'Allah a écrit.",
 quranVerses: [
 { surah: "Al-Fath", surahNumber: 48, ayah: 11, arabic: "قُلْ فَمَن يَمْلِكُ لَكُم مِّنَ اللَّهِ شَيْئًا إِنْ أَرَادَ بِكُمْ ضَرًّا أَوْ أَرَادَ بِكُمْ نَفْعًا", translation: "Dis : Qui donc peut quoi que ce soit pour vous contre Allah, s'Il vous veut du mal ou s'Il vous veut du bien ?", link: "https://quran.com/fr/48:11" }
 ],
 hadithReferences: [
 { collection: "Tirmidhi", number: "2516", text: "Le Prophète (paix sur lui) a dit à Ibn Abbas : Sache que si la communauté entière se réunissait pour te profiter, ils ne pourraient te profiter que par ce qu'Allah a écrit pour toi.", link: "https://sunnah.com/tirmidhi:2516" }
 ],
 sources: [
 { label: "Quran.com - Al-Fath 48:11", url: "https://quran.com/fr/48:11" },
 { label: "Sunnah.com - Tirmidhi 2516", url: "https://sunnah.com/tirmidhi:2516" }
 ]
 },
 92: {
 detailedMeaning: "An-Nur dérive de la racine n-w-r (eclairer) et désigne Celui par qui tout est eclaire et manifeste. Linguistiquement, le nur est ce qui rend les choses visibles, et qu'Allah est appele Nur car c'est par Lui que tout est eclaire. Par Sa lumière, les cieux et la terre sont illumines et leurs habitants guides. Il est la Lumière en Soi et que toute lumière dans l'univers n'est qu'un reflet de Sa lumière. Le voile d'Allah est la lumière, et que s'Il le levait, la splendeur de Son visage brulerait tout. Ce nom est attesté dans le célébre verset d'An-Nur (24:35) : Allah est la Lumière des cieux et de la terre.",
 quranVerses: [
 { surah: "An-Nur", surahNumber: 24, ayah: 35, arabic: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ", translation: "Allah est la Lumière des cieux et de la terre.", link: "https://quran.com/fr/24:35" }
 ],
 hadithReferences: [
 { collection: "Sahih Muslim", number: "179", text: "Le Prophète (paix sur lui) a dit : Son voile est la lumière. S'Il le levait, les lumières de Son visage bruleraient tout ce que Son regard atteindrait.", link: "https://sunnah.com/muslim:179" }
 ],
 sources: [
 { label: "Quran.com - An-Nur 24:35", url: "https://quran.com/fr/24:35" },
 { label: "Sunnah.com - Muslim 179", url: "https://sunnah.com/muslim:179" }
 ]
 },
 93: {
 detailedMeaning: "Al-Hadi dérive de la racine h-d-y (guider) et désigne Celui qui guide Ses créatures vers ce qui leur est profitable. Linguistiquement, la hidaya comporte plusieurs degrés : la guidance générale (dalala), la guidance par inspiration (ilham) et la guidance par la révélation (wahiy). La guidance suprême est celle de la foi, et qu'Allah guide chaque créature vers ce qui lui convient. C'est le plus grand bienfait et le croyant la demande constamment dans Al-Fatiha. Ce nom apparait dans Al-Hajj (22:54) : Allah guide ceux qui croient vers un droit chemin, et dans Al-Furqan (25:31) : Ton Seigneur suffit comme Guide et Secoureur.",
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
 detailedMeaning: "Al-Badi' dérive de la racine b-d-' (innover, créer de manière inedite) et désigne Celui qui crée sans modèle prealable ni précédent. Linguistiquement, l'ibda' est la création sans modèle précédent, témoignant d'une puissance créatrice absolue. Il a invente les choses de manière inedite et que Sa création est unique et incomparable. La diversité de Sa création est une preuve eclatante de Son unicité et de Sa sagesse. Ce nom apparait dans Al-Baqara (2:117) : Créateur des cieux et de la terre, lorsqu'Il décidé une chose, Il dit seulement : Sois ! Et elle est, et dans Al-An'am (6:101) : Créateur originel des cieux et de la terre.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 117, arabic: "بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ وَإِذَا قَضَىٰ أَمْرًا فَإِنَّمَا يَقُولُ لَهُ كُن فَيَكُونُ", translation: "Créateur des cieux et de la terre. Lorsqu'Il décidé une chose, Il dit seulement : Sois ! Et elle est.", link: "https://quran.com/fr/2:117" },
 { surah: "Al-An'am", surahNumber: 6, ayah: 101, arabic: "بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ", translation: "Créateur originel des cieux et de la terre.", link: "https://quran.com/fr/6:101" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Baqara 2:117", url: "https://quran.com/fr/2:117" }
 ]
 },
 95: {
 detailedMeaning: "Al-Baqi dérive de la racine b-q-y (demeurer, persister) et désigne Celui dont la permanence est éternelle, l'opposé du fana' (anéantissement) qui touche toute la création. Linguistiquement, le baqa' est la permanence absolue et inaltérable, sans changement ni fin. Il demeure après l'anéantissement de toute chose créée, car Son existence est nécessaire et non contingente. Le croyant s'attache à l'Éternel et ne se lamente pas pour ce monde éphémère. Ce nom est attesté dans Ar-Rahman (55:27) : Seule subsistera la Face de ton Seigneur, plein de majesté et de noblesse, et dans Al-Qasas (28:88) : Toute chose perira sauf Sa Face.",
 quranVerses: [
 { surah: "Ar-Rahman", surahNumber: 55, ayah: 27, arabic: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ", translation: "Seule subsistera la Face de ton Seigneur, plein de majesté et de noblesse.", link: "https://quran.com/fr/55:27" },
 { surah: "Al-Qasas", surahNumber: 28, ayah: 88, arabic: "كُلُّ شَيْءٍ هَالِكٌ إِلَّا وَجْهَهُ", translation: "Toute chose perira sauf Sa Face.", link: "https://quran.com/fr/28:88" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Ar-Rahman 55:27", url: "https://quran.com/fr/55:27" }
 ]
 },
 96: {
 detailedMeaning: "Al-Warith dérive de la racine w-r-th (hériter) et désigne Celui qui demeure après la fin de toute créature, heritant de tout. Linguistiquement, l'irth désigne ce qui reste après la disparition du premier possesseur, et qu'Allah hérite de tout car Il demeure eternellement. Il hérite de la terre et de ce qui s'y trouve quand toute créature aura peri. Le croyant se detache des biens sachant qu'ils ne sont que prêt temporaire. Ce nom apparait dans Al-Hijr (15:23) : C'est Nous qui donnons la vie et la mort, et c'est Nous les Héritiers, et dans Maryam (19:40) : C'est Nous qui hériterons de la terre et de ceux qui s'y trouvent.",
 quranVerses: [
 { surah: "Al-Hijr", surahNumber: 15, ayah: 23, arabic: "وَإِنَّا لَنَحْنُ نُحْيِي وَنُمِيتُ وَنَحْنُ الْوَارِثُونَ", translation: "Et c'est Nous qui donnons la vie et qui donnons la mort, et c'est Nous les Héritiers.", link: "https://quran.com/fr/15:23" },
 { surah: "Maryam", surahNumber: 19, ayah: 40, arabic: "إِنَّا نَحْنُ نَرِثُ الْأَرْضَ وَمَنْ عَلَيْهَا وَإِلَيْنَا يُرْجَعُونَ", translation: "C'est Nous qui hériterons de la terre et de ceux qui s'y trouvent. Et c'est vers Nous qu'ils seront ramenes.", link: "https://quran.com/fr/19:40" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Al-Hijr 15:23", url: "https://quran.com/fr/15:23" }
 ]
 },
 97: {
 detailedMeaning: "Ar-Rashid dérive de la racine r-sh-d (être bien guide, diriger avec sagesse) et désigne Celui qui dirige toute chose vers sa fin avec sagesse et bon ordre. Linguistiquement, le rushd est la bonne direction et la sagesse dans la conduite des affaires, l'opposé de l'égarement (ghayy). Ses décisions menent toujours au meilleur résultat et que Sa direction est infaillible. Le croyant suit la guidance d'Allah telle qu'elle est venue dans le Coran et la Sunna. Ce nom se comprend en lien avec le verset de Hud (11:87), et il est souvent cite aux côtés d'Al-Hadi pour souligner la perfection de la guidance divine.",
 quranVerses: [
 { surah: "Hud", surahNumber: 11, ayah: 87, arabic: "أَصَلَاتُكَ تَأْمُرُكَ أَن نَّتْرُكَ مَا يَعْبُدُ آبَاؤُنَا", translation: "Est-ce que ta prière te commande de nous faire abandonner ce qu'adoraient nos ancetres ?", link: "https://quran.com/fr/11:87" }
 ],
 hadithReferences: [],
 sources: [
 { label: "Quran.com - Hud 11:87", url: "https://quran.com/fr/11:87" }
 ]
 },
 98: {
 detailedMeaning: "As-Sabur dérive de la racine s-b-r (patienter) selon le schéma fa'ul, forme intensive exprimant la perfection de la patience. Linguistiquement, le sabr est la maîtrise de soi face à ce qui provoque. Le retard du châtiment est un choix sage. Il ne Se hate pas de punir les désobéissants, leur donnant un délai non par impuissance mais par sagesse et miséricorde. Il voit la désobéissance mais accorde un sursis, esperant le repentir. Le croyant profite de ce délai pour se repentir. Ce nom est attesté par le hadith rapporté par Al-Bukhari : Personne n'est plus patient face à une parole blessante qu'Allah.",
 quranVerses: [
 { surah: "Al-Baqara", surahNumber: 2, ayah: 153, arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", translation: "O les croyants ! Cherchez secours dans la patience et la prière. Certes, Allah est avec les patients.", link: "https://quran.com/fr/2:153" }
 ],
 hadithReferences: [
 { collection: "Sahih Bukhari", number: "6099", text: "Le Prophète (paix sur lui) a dit : Personne n'est plus patient face à une parole blessante qu'Allah. On Lui attribué un fils et Il continue à leur accorder la sante et la subsistance.", link: "https://sunnah.com/bukhari:6099" }
 ],
 sources: [
 { label: "Quran.com - Al-Baqara 2:153", url: "https://quran.com/fr/2:153" },
 { label: "Sunnah.com - Bukhari 6099", url: "https://sunnah.com/bukhari:6099" }
 ]
 },
 99: {
 detailedMeaning: "Allah est le nom suprême (ism al-dhat) qui désigne l'Être nécessaire doue de tous les attributs de perfection. Linguistiquement, les grammairiens divergent sur sa dérivation : certains le derivent de a-l-h (adorer), d'autres considerent qu'il est un nom originel non dérive (ghayru mushtaqq). Ce nom est le plus grand de tous les noms divins, contenant tous les attributs de perfection, et que tous les autres noms Lui sont subordonnes. C'est le nom le plus complet car il englobe tous les autres. Il est le fondement de tous les beaux noms. Ce nom est au cœur du Coran, dans Al-Ikhlas (112:1), Al-Hashr (59:22) et Ta-Ha (20:14).",
 quranVerses: [
 { surah: "Al-Ikhlas", surahNumber: 112, ayah: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Dis : Il est Allah, Unique.", link: "https://quran.com/fr/112:1" },
 { surah: "Al-Hashr", surahNumber: 59, ayah: 22, arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ هُوَ الرَّحْمَٰنُ الرَّحِيمُ", translation: "C'est Lui Allah. Nulle divinité a part Lui, le Connaisseur de l'invisible et du visible. C'est Lui le Tout Miséricordieux, le Très Miséricordieux.", link: "https://quran.com/fr/59:22" },
 { surah: "Ta-Ha", surahNumber: 20, ayah: 14, arabic: "إِنَّنِي أَنَا اللَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدْنِي", translation: "C'est Moi Allah. Point de divinité que Moi. Adore-Moi donc.", link: "https://quran.com/fr/20:14" }
 ],
 hadithReferences: [
 { collection: "Sahih Bukhari", number: "2736", text: "Le Prophète (paix sur lui) a dit : Allah a quatre-vingt-dix-neuf noms, cent moins un. Quiconque les memorise entrera au Paradis.", link: "https://sunnah.com/bukhari:2736" },
 { collection: "Sahih Muslim", number: "2677", text: "Le Prophète (paix sur lui) a dit : Allah a quatre-vingt-dix-neuf noms. Quiconque les énumère (ahsaha) entrera au Paradis.", link: "https://sunnah.com/muslim:2677" }
 ],
 sources: [
 { label: "Quran.com - Al-Ikhlas 112:1", url: "https://quran.com/fr/112:1" },
 { label: "Quran.com - Al-Hashr 59:22", url: "https://quran.com/fr/59:22" },
 { label: "Sunnah.com - Bukhari 2736", url: "https://sunnah.com/bukhari:2736" }
 ]
 }
};

// Enrichir ASMA_UL_HUSNA avec les données encyclopediques
(function enrichEncyclopedia() {
 ASMA_UL_HUSNA.forEach(function(name) {
 if (ENCYCLOPEDIA_DATA[name.id]) {
 name.encyclopedia = ENCYCLOPEDIA_DATA[name.id];
 }
 });
})();