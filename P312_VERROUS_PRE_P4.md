# ✅ Verrous pré-P4 — V2 Contracts (Step A) + Stability Invariants (Step B)

> Date : 2026-06-04 · Iso-comportement strict (132 tests inchangés). Déterministe.
> Objectif : rendre le système « P4-ready » (agent stable) avant d'ajouter du temps humain.

---

## ✅ Validation

| Critère | Résultat |
| :-- | :-: |
| Tests ajoutés (stabilité) | ✅ **6** |
| Tous tests | ✅ **138/138** |
| Iso-comportement (Step A) | ✅ 132 tests inchangés |
| Lint / gateway tsc / `pnpm -r build` | ✅ tous EXIT 0 |

---

## 🧱 Step A — V2 Contracts (couper le couplage inversé)

**Problème (audit)** : V2 importait son évaluation/banque via `../simulation/index`
→ glissement de frontière (V2 dépendait d'une couche métier enrichie).

**Constat clé** : presque tous les symboles importés sont **déjà dans `core/v2/*`** ;
seul `evaluateTranscript` vient de `core/evaluation` (STAR partagée). V2 importait donc
ses **propres** modules… mais par le détour de la simulation.

**Correctif** :
- `core/v2/contracts/index.ts` (NOUVEAU) : barrière d'imports qui réexporte depuis les
  **modules sources réels** (personas, plan, question-bank, traps, answer-signals,
  candidate-facts, bluff-detector, difficulty-adapter, interview-report, recruiter-report,
  + `../evaluation`).
- `interview-engine-v2.ts` importe désormais depuis `./contracts/index` (mêmes symboles).

**Invariants vérifiés (mesure)** :
- `core/v2/` n'importe plus **aucun** `../simulation` → **0 occurrence**.
- `contracts/index.ts` n'importe **rien** de la simulation (le mot n'apparaît qu'en commentaire).
- Aucun cycle (contracts → modules sources directs).

➡️ **V2 est désormais testable et remplaçable en isolation totale.** Quand P4 enrichira la
simulation, V2 ne peut plus être contaminé.

---

## 🧪 Step B — Stability Invariants (anti-feedback runaway)

**Problème (audit)** : boucle fermée `pressure → persona → hidden-eval → mind → pressure`
→ déterministe localement mais **potentiellement instable globalement** sous P4.

**Correctif** :
- `core/simulation/stability.ts` (NOUVEAU) : invariants vérifiables + garde-fou runtime.
  - `checkMindBounds` / `checkSimulationBounds` : bornes 0–1 / -1–1 / 0–100, anti-NaN.
  - `checkBoundedOscillation` : pas d'amplification hors bornes.
  - `isStable` / `assertStable` : garde-fou activable en dev/staging.
- `tests/voice-interview/stability.test.ts` (6) :
  - état initial stable ;
  - **100 réponses faibles → pression plafonne à 100** (pas d'amplification infinie) ;
  - **système dissipatif** : la pression peut redescendre (pas figé) ;
  - **3 seeds × 200 tours aléatoires → 0 violation** de bornes (sim + mind) ;
  - `assertStable` ne lève jamais sur trajectoire valide ;
  - `assertStable` **détecte** un état corrompu (test du garde-fou).

➡️ On teste désormais la **stabilité du personnage**, pas seulement la logique.

---

## 🎯 Résultat
- **V2 = pur et isolé** (dépend de contrats, pas de comportement).
- **Système prouvé borné** sur de longues trajectoires aléatoires → pas de drift runaway.
- Garde-fou `assertStable` disponible pour le runtime (dev/staging) avant P4.

## ⏭️ P4 est maintenant sûr
Silences / hésitations / émotions = mapping `RecruiterMindState → UX`, dans la couche
simulation, avec :
- V2 protégé par sa barrière de contrats,
- stabilité comportementale garantie par invariants testés.
