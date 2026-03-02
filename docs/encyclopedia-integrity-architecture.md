# Architecture Encyclopedie Asma al-Husna (Mode Strict)

## 1) Configuration centrale

```js
const STRICT_RELIGIOUS_MODE = true;
const SOURCE_ALLOWLIST = [...];
const APPROVED_DOMAINS = SOURCE_ALLOWLIST;
const APPROVED_SCHOLARS = [...];
```

Fichiers:
- `religious-integrity/config.js`
- `religious-integrity/domain-validator.js`
- `religious-integrity/scholar-validator.js`

## 2) Pipeline obligatoire (6 etapes)

1. Collecte controlee:
   - source parsee et normalisee
   - rejet si domaine hors allowlist, niveau invalide, scholar invalide
   - fichier: `religious-integrity/source-collector.js`
2. Verification d'autorite:
   - scholar obligatoire pour niveaux 2 et 4
   - rejet immediate sinon
3. Verification de lien:
   - HEAD puis GET (fallback)
   - suivi redirections (`final_url`)
   - rejet 404/403/5xx/page generique
   - `manual_check_required` si localisateur precis absent
   - fichier: `religious-integrity/link-verifier.js`
4. Verification d'attribution:
   - chaque claim doit avoir des sources valides
   - rejet des generalisations de madhhab sans preuve explicite
   - fichier: `religious-integrity/attribution-verifier.js`
5. Synthese controlee:
   - generation stricte de `NameEncyclopediaEntry`
   - fallback `INSUFFICIENT_EVIDENCE` si preuves insuffisantes
   - fichier: `religious-integrity/entry-generator.js`
6. Blocage editorial:
   - publication interdite tant que review humaine != approved
   - publication interdite si lien/attribution/conflit non valide
   - fichier: `religious-integrity/publication-guard.js`

## 3) Schema de donnees

Le schema cible est implemente dans la generation JSON (`entry-generator.js`) et persiste en:
- `data/encyclopedia/entries/<slug>.json`

Champs principaux:
- identite (`slug`, `arabic`, `transliteration`, `french_name`)
- `canonical_status`
- `primary_evidence.quran[]`, `primary_evidence.hadith[]`
- `scholarly_explanations[]`
- `interpretation_notes`
- `attribution_integrity`
- `link_verification[]`
- `editorial_review`
- `public_display_allowed`

## 4) Audit trail

Toute action est journalisee en JSONL:
- `data/encyclopedia/audit/audit-trail.jsonl`

Evenements traces:
- collecte/rejet source
- verification de lien
- blocage publication
- review humaine

Fichier: `religious-integrity/audit-trail.js`

## 5) API serveur

Routes:
- `GET /api/encyclopedia-integrity/:slug`
  - retourne une fiche uniquement si `public_display_allowed === true`
  - sinon bloque (403) + statut
- `POST /api/encyclopedia-integrity/generate/:slug`
  - regenere la fiche depuis candidate JSON (acces editorial token)
- `POST /api/encyclopedia-integrity/review/:slug`
  - applique review humaine (`approved|rejected|needs_human_review`)

Implantation:
- `server.js`
- `religious-integrity/review-service.js`
- `religious-integrity/entry-repository.js`

## 6) Protection frontend

En mode strict:
- detail encyclopedie bloque si `encyclopediaIntegrity.public_display_allowed !== true`
- affichage d'un fallback explicite au lieu de contenu doctrinal

Implantation:
- `public/js/app.js`

## 7) Anti-hallucination

Garde-fous actifs:
- refus generation sans source approuvee
- refus claim sans source
- refus assertion madhhab sans preuve explicite
- refus publication sans review humaine
- fallback automatique `INSUFFICIENT_EVIDENCE`

## 8) Industrialisation 99 noms

Workflow recommande:
1. Construire les 99 candidats via:
   - `npm run build:candidates`
   - ce script genere 1 fichier candidat par nom a partir des donnees existantes + liens tafsir par madhhab
2. Executer:
   - `npm run generate:entries`
3. Nettoyer les entrees orphelines:
   - `npm run cleanup:entries`
4. Traiter les blocages (liens, claims, attribution)
5. Soumettre chaque fiche a revue humaine religieuse
6. Publier uniquement les fiches `approved` et sans blockers

Etat actuel du lot genere:
- 99 candidats / 99 entrees
- 580 liens verifies passes (0 failed, 0 manual)
- blocage restant volontaire: `human_review_not_approved`

## 9) Validation humaine religieuse obligatoire

Obligatoire avant publication:
- confirmation des citations arabes/fr exactes
- validation des localisateurs (chapitre/section/ancre)
- validation des nuances aqida/tafsir
- validation des attributions de madhhab explicites
- arbitrage des conflits de sources
- signature review (`reviewer_id`, note, statut approved)
