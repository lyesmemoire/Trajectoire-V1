# ✅ P3.10 — Architecture Lock & Pipeline Formalization

> Date : 2026-06-04 · **Verrouillage architectural**, iso-comportement strict.
> Objectif : purifier V2, externaliser la simulation, formaliser le pipeline.

---

## 🎯 Résultat

Les frontières sont verrouillées **avant** d'ajouter du comportement (P4) :
- **V2 = moteur de décision pur** (ne connaît plus la simulation).
- **Simulation = état externe** (ne vit plus dans l'état V2).
- **Integration = pipeline explicite** (orchestrateur V2 → Simulation).

```
transcript → V2 (décision pure) → SimulationContract → Simulation (état externe)
           → façonnage de sortie → question
```

---

## ✅ Validation

| Critère | Résultat |
| :-- | :-: |
| Tests P3.10 | ✅ **7/7** |
| Tous tests | ✅ **123/123** |
| **V2 purifié** (iso-comportement) | ✅ 116 tests V2/sim **inchangés** |
| V2 n'importe ni integration ni pipeline ni simulation-state | ✅ vérifié |
| Lint | ✅ 0 erreur |
| Build gateway (`tsc` strict) | ✅ EXIT 0 |
| `pnpm -r build` | ✅ EXIT 0 |

---

## 🔧 Ce qui a été fait

### 1. V2 purifié (`interview-engine-v2.ts`)
- **Supprimé** : `state.simulation`, `enableSimulation`, `previousSessions`, et tout le bloc de binding inline (init + `nextV2Step`).
- V2 redevient : `nextV2Step(state, transcript) → { question, evaluation, signals, …, updatedState }`. **Aucune notion de simulation.**

### 2. SimulationContract figé (`pipeline.ts`)
```ts
interface SimulationContract {
  input: V2Decision;       // décision brute extraite de la sortie V2
  state: SimulationState;  // état externe
  output: SimulationContext;
}
```

### 3. Pipeline explicite (`pipeline.ts`, NOUVEAU)
- `initInterviewPipeline(input)` → `{ question, state: { v2, simulation } }` (+ hook cross-session à l'ouverture).
- `runInterviewPipeline(state, transcript)` → V2 décide (pur) → `deriveSignal` → `updateSimulation` → `applySimulationToQuestion`.
- **L'état simulation vit dans le pipeline, pas dans V2.**

### 4. Tests
- Ancien `p39-binding.test.ts` (binding inline dans V2) **supprimé** → remplacé par `p310-pipeline.test.ts` (7 cas) : V2 pur (plus de champ simulation), pipeline orchestrateur, substance de question identique, cross-session, entretien complet → rapport.

---

## 🔒 Garanties de verrouillage (respect de la spec)
- ✅ **V2 ne connaît pas la simulation** : il n'importe ni `integration`, ni `pipeline`, ni `simulation-state`. Dépendance **unidirectionnelle** : pipeline → V2 (jamais l'inverse).
- ✅ **Simulation externe** : son état est porté par `PipelineState`, pas par `InterviewStateV2`.
- ✅ **Integration = pipeline explicite** (plus de binding implicite inline).
- ✅ **Critère « supprime la simulation, V2 marche »** : prouvé par les 116 tests V2 inchangés.
- ✅ **Zéro impact transport** (périmètre core uniquement, comme validé).

---

## 📝 Note de transparence
V2 importe encore `evaluation` / `interview-report` / `recruiter-report` via `../simulation/index`
(héritage du refactor P3.7 : la couche `simulation` regroupe aussi l'évaluation, qui EST
de la logique V2). Ce ne sont **pas** des modules comportementaux (pression/persona/pipeline).
Le découplage comportemental visé est donc respecté. Un nettoyage cosmétique (séparer
`evaluation` de `simulation/index`) est possible plus tard, non bloquant.

---

## 🚀 Pourquoi c'était la bonne étape
P4 (silences, hésitations, interruptions, émotions) aurait pollué V2 sans ce verrou.
Maintenant : V2 stable, simulation isolée, pipeline = point d'extension unique.
**P4 devient trivial** : on enrichit la simulation + le façonnage, sans jamais toucher V2.

## ⏭️ Suite
- (Optionnel) brancher le pipeline dans le transport (`?engine=v2&sim=1`) — le transport reste « bête » : il appelle `runInterviewPipeline`, rien d'autre.
- P4 — Real Interview Experience Layer, entièrement dans la couche simulation.
