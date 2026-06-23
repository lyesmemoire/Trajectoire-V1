# ✅ P4.1 — Emotional UX Control System (Perception Composition Governor)

> Date : 2026-06-04 · Système de **contraintes**, pas de comportement. Déterministe.
> Additif, iso-comportement (146 tests inchangés). Aucun impact V2 / simulation core / décision.

---

## 🎯 Résultat

On ne « génère » plus d'UX : on **contrôle la composition** des effets perceptifs pour
qu'elle reste **globalement bornée et stable**, même quand chaque couche est déjà sûre
individuellement. Résout le risque que tu pointais : la *latence/intensité comportementale
cumulative* (combinaison d'effets safe → expérience perçue trop agressive).

```
RecruiterMindState → base UX (P4)
   → emotional budget → composition rules → global guardrails → anti-drift
   → Final UX (safe, bounded, human-like)
```

---

## ✅ Validation

| Critère | Résultat |
| :-- | :-: |
| Tests P4.1 | ✅ **13/13** |
| Tous tests | ✅ **159/159** |
| Iso-comportement | ✅ 146 tests inchangés |
| Lint / gateway tsc / `pnpm -r build` | ✅ tous EXIT 0 |

---

## 🔧 Les 5 modules (ordre strict, `core/simulation/governor/`)

1. **`emotional-budget.ts`** — budget total/session, coût par effet (interruption chère,
   silence moyen, ton continu), régen lente. `scale` atténue quand le budget baisse.
2. **`composition-rules.ts`** — anti-contradiction (calm bloque l'agression ;
   interruption ⊕ silence long résolu) + cohérence persona (RH/MENTOR adoucis).
3. **`guardrails.ts`** — bornes dures (silence ≤ 0.6, interruption ≤ 0.35), limite de
   delta de ton par tour (anti-saut), **pas deux extrêmes consécutifs** (fenêtre de stabilité).
4. **`anti-drift.ts`** — attracteurs d'état par émotion + amortissement des oscillations
   (mémoire des 3 derniers tons).
5. **`ux-pipeline.ts`** — `governUX()` : orchestre les 4 étapes dans l'ordre, état unifié `GovernorState`.

### Intégration pipeline
- `PipelineState.governor` (état persistant) ; `runInterviewPipeline` applique `governUX`
  sur l'UX brute. **L'UX exposée est désormais gouvernée.**

---

## 🧩 Conformité stricte à la spec
- ✅ **Contraintes, pas comportement** : aucun effet inventé, uniquement correction/atténuation.
- ✅ Pas de modif V2, simulation core, ni pipeline décisionnel.
- ✅ Déterministe (`toEqual` sur entrées identiques).
- ✅ **Bornes GLOBALES** (composition), pas seulement par champ.

---

## 🧪 Preuve anti-drift composé (le test clé)
`500 tours agressifs (faible + bluff + contradiction)` → l'UX **gouvernée** reste **toujours
dans les bornes** (interruption ≤ 0.35, silence ≤ 0.6, ton borné, delay fini). Le système
ne dérive pas malgré l'empilement d'effets, et ne se fige jamais (régen budget, scale > 0).

---

## ✨ Décisions / correctifs signalés
- Budget calibré : un effet fort est soutenable ~10 tours puis **atténué** (réaliste,
  pas de coupure brutale). Régen garantit que le système ne se bloque jamais.
- Correctif typage : persona `"RH"` (et non `"HR"`) — attrapé par le build strict du gateway.
- Le **tirage aléatoire** des probabilités reste côté runtime → governor 100% déterministe/testable.

---

## 🚀 Bilan
Intervo = **constrained behavioral simulation engine** :
V2 (logique) · Simulation (comportement) · Mind (cognition) · UX P4 (perception) ·
**P4.1 (stabilité globale)**. Le système peut être doux / agressif / analytique / stressant
**sans jamais dériver**.

## ⏭️ Suite possible
- **P4.2 — Runtime binding** (appliquer delay/speechRate/interruption au vrai TTS/WS).
- **Stress-test global** (1000 interviews simulées, stabilité longue durée + métriques).
