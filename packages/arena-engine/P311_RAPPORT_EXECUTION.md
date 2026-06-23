# ✅ P3.11 — Recruiter Mind Model (état mental unifié)

> Date : 2026-06-04 · Additif, déterministe, **iso-comportement** (123 tests inchangés).
> La simulation passe d'« empilement de règles » à **agent cohérent avec état mental**.

---

## 🎯 Résultat

Un **`RecruiterMindState`** unifié, DÉRIVÉ des sous-états de simulation, donne au
recruteur une « conscience » cohérente : émotion, confiance, suspicion, engagement,
pression, fatigue, momentum — exposé par le pipeline et capable de piloter le persona.

---

## ✅ Validation

| Critère | Résultat |
| :-- | :-: |
| Tests P3.11 | ✅ **9/9** |
| Tous tests | ✅ **132/132** |
| **Iso-comportement** | ✅ 123 tests antérieurs inchangés |
| Lint / gateway tsc / `pnpm -r build` | ✅ tous EXIT 0 |

---

## 🔧 Ce qui a été fait

### `core/simulation/recruiter-mind.ts` (NOUVEAU)
```ts
RecruiterMindState = {
  emotion: "calm"|"neutral"|"annoyed"|"curious"|"impressed"|"suspicious",
  trust, suspicion, engagement, pressure, fatigue,   // 0–1
  confidenceInCandidate, momentum                    // -1 → 1
}
```
- `deriveRecruiterMind(sim)` : mapping déterministe depuis pressure + hidden-eval + turn.
  - bluff → suspicion ↑, trust ↓ · cohérence → trust ↑ · stabilité-bluff → confiance candidat · pression>0.8 → suspicion/annoyed · turns → fatigue.
- `personaFromMind(mind)` : **MindState pilote le persona** (suspicion→AGGRESSIVE, confiance→TECH/CTO, faible engagement→MENTOR).
- `describeMind(mind)` : résumé lisible (debug/rapport).

### Pipeline (`pipeline.ts`)
- `PipelineTurn` expose désormais `mind: RecruiterMindState`, dérivé à chaque tour.

### Stratégie (validée avec toi)
- **MindState dérivé** (vue unifiée + mutateurs) : les modules P3.8 restent **source de vérité** → zéro régression. MindState = couche de lecture/cohérence d'agent.

---

## 🧩 Architecture (état figé)
```
V2 (décision pure)
  ↓  SimulationContract (P3.10)
Simulation (pressure/memory/hidden-eval/persona)  ← source de vérité
  ↓  deriveRecruiterMind
RecruiterMindState (conscience unifiée, P3.11)
  ↓  pipeline (orchestration)
question façonnée
```

---

## 🔥 Ce que ça débloque
- Recruteur qui « change d'humeur » de façon cohérente entre tours.
- Suspicion/confiance persistantes (mémoire émotionnelle).
- Persona dérivable de l'état mental (plus de règles éparses).
- **P4 devient trivial** : silences/hésitations/émotions = mapping `emotion → UX`, sans toucher V2 ni la décision.

---

## ✨ Décision / correctif signalé
- État initial **bienveillant** par défaut (trust ~0.7, confiance ~0.5 → emotion possible « impressed ») : c'est volontaire (le recruteur démarre ouvert). Test ajusté en conséquence.
- Aucun module P3.8 modifié → iso-comportement strict garanti par les 123 tests.

## ⏭️ Suite : **P4 — Real Interview Experience Layer** (silences, hésitations, micro-interruptions, dynamique émotionnelle) = pur mapping depuis `RecruiterMindState`, dans la couche simulation.
