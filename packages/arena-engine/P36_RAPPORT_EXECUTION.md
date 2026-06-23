# ✅ P3.6 — Rapport d'exécution : Interview Engine V2 (niveau recruteur senior)

> Date : 2026-06-04 · Déterministe, sans LLM/DB. Module ISOLÉ `core/v2/`.
> Le moteur V1 (P3.1→P3.5) reste 100% intact — ses 67 tests restent verts.

---

## 🎯 Résultat

Un **simulateur d'entretien adaptatif** : profil candidat dérivé de l'analyse →
plan d'entretien → flux dynamique (warmup → exploration → technique → challenge →
pression → closing) avec relances ciblées, questions pièges et bilan multidimensionnel.

---

## ✅ Validation

| Critère | Résultat |
| :-- | :-: |
| Tests P3.6 | ✅ **11/11** |
| Tous tests | ✅ **78/78** |
| Lint | ✅ 0 erreur |
| Build gateway (`tsc` strict) | ✅ EXIT 0 |
| `pnpm -r build` | ✅ EXIT 0 |

---

## 🔧 Les 11 blocs livrés (`core/v2/`)

| # | Bloc | Fichier |
| :-- | :-- | :-- |
| 1 | **CandidateProfile** dérivé (skills, séniorité, gaps) | `candidate-profile.ts` |
| 2 | **Banque de questions** versionnée (8 catégories, difficulté, triggers) | `question-bank.ts` |
| 3+8 | **Machine à états** 6 phases + plan ordonné | `interview-plan-builder.ts` |
| 4 | **Personas** (3 + 4 avancés : technical_lead, eng_manager, hr, founder) | `personas.ts` |
| 5 | **Relances intelligentes** (ciblées sur la faiblesse détectée) | `interview-engine-v2.ts` |
| 6 | **Signaux faibles** (confidence, specificity, ownership, technicalDepth, quantified) | `answer-signals.ts` |
| 7 | **Questions pièges** (déclenchées si compétence revendiquée) | `trap-question-engine.ts` |
| 8 | **Pression progressive** (via plan + persona.pressureLevel) | `interview-plan-builder.ts` |
| 9 | **Mémoire conversationnelle** (anti-répétition, forces/faiblesses) | `interview-engine-v2.ts` |
| 10 | **Score multidimensionnel** (6 axes + overall) | `interview-report.ts` |
| 11 | **Recommandation finale** (`strong_hire`…`reject` + justification) | `interview-report.ts` |

**API publique** : `initInterviewV2({ profile, persona })` → `{ state, question }` ;
`nextV2Step(state, transcript)` → `{ question, updatedState, evaluationScore, signals, finished, recommendation? }`.

---

## 🧩 Conformité au plan
- Profil normalisé : le moteur **ne relit jamais le CV** directement ✅
- Catalogue versionné (`QUESTION_BANK_VERSION = v2.0.0`) ✅
- Phases dynamiques (avance si réponse OK + quota, **reste/relance** si réponse faible) ✅
- Personas avec `tone/pressureLevel/followupDepth/technicalFocus` ✅
- Relances contextuelles selon signaux (chiffres, ownership, profondeur tech) ✅
- Pièges déclenchés **uniquement** si `claimsSkill(profile, skill)` ✅
- Mémoire empêchant les répétitions ✅
- Rapport 6 dimensions + reco argumentée ✅

---

## 🚧 Compatibilité & isolation
- 100% dans `core/v2/`, exporté via `voice-interview` sous le namespace **`V2`**.
- **Réutilise `evaluation.ts` (V1)** pour le score STAR de base (cohérence).
- Aucune dépendance LLM/DB ; déterministe (test « même entrée → même question »).
- Pas branché au transport WS pour l'instant (V1 reste le runtime actif) → **opt-in** quand on voudra basculer `/product/interview` sur V2.

---

## ✨ Décisions signalées
- **Module parallèle V2** (pas de remplacement de V1) → zéro risque, bascule progressive possible.
- **Correctif de terminaison** : `finished` calculé sur le quota de `closing` avant tout reset de compteur (sinon boucle infinie) — attrapé par les tests.
- **Pièges en phase technique** seulement pour personas à fort `technicalFocus` (≥4).

---

## ⏭️ Suite
- Brancher V2 dans `voice-orchestrator` / `voice-websocket` (opt-in via flag), exposer le rapport multidimensionnel + reco dans l'UI.
- P4 : analytics, persistance optionnelle des rapports, calibrage fin.
