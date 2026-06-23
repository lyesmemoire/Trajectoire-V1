# ✅ Refactor — P3.7 → couche de simulation (préparation P3.8)

> Date : 2026-06-04 · **Iso-comportement strict** (94 tests inchangés restent verts).
> Objectif : passer d'un « module dans V2 » à une **couche de simulation transverse**
> propre, avant d'ajouter P3.8 (sinon complexité explosive).

---

## 🎯 Résultat

La logique réaliste (P3.6 + P3.7) est réorganisée en **4 couches transverses** dans
`core/simulation/`. Le moteur V2 **délègue** à ces couches ; son API publique
(`initInterviewV2`, `nextV2Step`) est **inchangée**.

```
core/simulation/
├── perception.ts        ← signaux, bluff, contradictions (+ perceive() agrégateur)
├── interviewer-brain.ts ← personas, banque de questions, parcours métier, plan
├── adaptive.ts          ← difficulté dynamique, arbre technique
├── evaluation-layer.ts  ← scores STAR, rapport multidim, crédibilité, rapport recruteur
└── index.ts
```

---

## ✅ Validation

| Critère | Résultat |
| :-- | :-: |
| Tests avant refactor (baseline) | 94 ✅ |
| Tests après refactor | ✅ **100/100** (94 inchangés + 6 nouveaux pour la couche) |
| **Iso-comportement** | ✅ les 94 tests passent **sans modification** |
| Lint | ✅ 0 erreur |
| Build gateway (`tsc` strict) | ✅ EXIT 0 |
| `pnpm -r build` | ✅ EXIT 0 |

---

## 🔧 Ce qui a été fait
- **Création de `core/simulation/`** : 4 façades qui **regroupent par responsabilité**
  la logique existante (réexports + un agrégateur `perceive()`).
  **Aucune logique métier réécrite** → garantie iso-comportement.
- **`interview-engine-v2.ts`** : bloc d'imports remplacé par un import unique depuis
  `../simulation/index`. Le corps de l'engine est **identique**.
- **Export `Simulation`** ajouté à l'index du module (à côté de `V2`).
- **Tests** `p38-simulation-layer.test.ts` (6) : surface des 4 couches + `perceive()`
  prouvé **égal** à l'usage direct des modules (`toEqual`).

---

## 🧠 Pourquoi ce refactor d'abord (décision validée)
- P3.8 (pression temporelle, memory decay, cross-session, scores invisibles) serait
  devenu ingérable empilé sur `interview-engine-v2`. Avec la couche en place, chaque
  pilier P3.8 a une **place naturelle** :
  - pression temporelle → `adaptive.ts`
  - memory decay / cross-session → `perception.ts` + état
  - scores invisibles → `evaluation-layer.ts`
- Le refactor à **iso-fonctionnalité** + les 94 tests = filet de sécurité → zéro régression.

---

## 🧩 Architecture cible (ton Option B)
- **V2 = API** (`initInterviewV2`/`nextV2Step`), surface stable pour le transport.
- **Simulation = moteur comportemental** qui influence V2 via les 4 couches.
- V1 (P3.1→P3.5) toujours intact ; V2 activable via `?engine=v2`.

---

## ⏭️ Prêt pour P3.8
Pression temporelle (stress) · memory decay / contradictions progressives ·
cohérence cross-session · évaluation invisible — chacun dans sa couche dédiée.
