# ✅ P3.7 — Rapport d'exécution : Interview Realism Engine

> Date : 2026-06-04 · Déterministe, sans LLM/DB. Additif sur le moteur V2 (`core/v2/`).
> V1 (P3.1→P3.5) inchangé. V2 (P3.6) enrichi : ses tests restent verts.

---

## 🎯 Résultat

L'entretien teste désormais **cohérence, profondeur, authenticité** : il détecte les
incohérences CV↔réponses, repère le bluff, adapte la difficulté, varie les comportements
recruteur, suit un parcours métier et produit un **rapport recruteur final** argumenté.

---

## ✅ Validation

| Critère | Résultat |
| :-- | :-: |
| Tests P3.7 | ✅ **16/16** |
| Tous tests | ✅ **94/94** |
| Lint | ✅ 0 erreur |
| Build gateway (`tsc` strict) | ✅ EXIT 0 |
| `pnpm -r build` | ✅ EXIT 0 |

---

## 🔧 Les 6 sous-blocs

| Étape | Livrable | Fichier |
| :-- | :-- | :-- |
| **P3.7.1** | CandidateFacts + détection de contradictions (écart d'années) + question de recadrage | `candidate-facts.ts` |
| **P3.7.2** | Détection de bluff (vagueness, buzzwordDensity, lackOfExamples, inabilityToGoDeeper) + **score de crédibilité** | `bluff-detector.ts` |
| **P3.7.3** | Difficulté adaptative + arbre de progression technique (Docker→Kubernetes→Helm→GitOps→ArgoCD) | `difficulty-adapter.ts` |
| **P3.7.4** | Personas recruteur actifs (déjà dans `personas.ts`, désormais reliés au comportement de sélection) | `personas.ts` + engine |
| **P3.7.5** | Parcours métier (DevOps, Backend, Frontend, Fullstack, Data, Product, Eng. Manager) | `role-tracks.ts` |
| **P3.7.6** | Rapport recruteur final (crédibilité, contradictions, bluff, niveau recommandé, décision) | `recruiter-report.ts` |

### Intégration moteur (`interview-engine-v2.ts`)
- État enrichi : `facts`, `difficulty`, `signalsList`, `bluffList`, `contradictionList`.
- `nextV2Step` : **priorité de réaction** = recadrage contradiction > relance (faible/bluff) > question banque.
- En fin d'entretien : `recruiterReport` (en plus de `recommendation`).
- `NextV2Result` expose désormais `bluff` et `contradiction?` par tour.

---

## 🧠 Ce que ça change pour le candidat
> « Je vois que tu revendiques Kubernetes... » → question ciblée → réponse vague →
> relance d'approfondissement → contradiction d'années détectée → recadrage →
> difficulté qui monte si bon / descend si faible → **bilan recruteur** (forces,
> faiblesses, contradictions, signaux de bluff, crédibilité, niveau, décision).

---

## ✨ Décisions & correctifs signalés
- **Modules additifs dans `core/v2/`** → V2 P3.6 intact, bascule transparente (l'engine V2 enrichi est déjà branché via P3.6.1 `?engine=v2`).
- **Détection d'années resserrée** (fenêtre après le skill) pour éviter de capter l'année d'une techno voisine — bug attrapé par les tests et corrigé.
- **Seuil de spécificité** : une vraie « réponse forte » doit être suffisamment développée (cohérent avec un entretien réel) — ajusté dans les tests.
- Pénalité de décision si ≥ 2 contradictions ou bluff élevé (réalisme recruteur).

---

## ⏭️ Suite
- Exposer le `recruiterReport` via le transport V2 (message `summary_v2` enrichi) + affichage UI.
- Brancher `inferRoleTrack` dans le plan d'entretien pour des parcours réellement spécifiques au poste.
- P4 : analytics / persistance optionnelle / calibrage fin des seuils.
