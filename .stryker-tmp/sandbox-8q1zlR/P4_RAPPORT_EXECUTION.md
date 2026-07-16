# ✅ P4 — Real Interview Experience Layer (Perceptual Engine)

> Date : 2026-06-04 · Couche de **mise en scène UX**, pas de logique. Déterministe.
> Additif, iso-comportement (138 tests inchangés). Repose sur la stabilité garantie (Step B).

---

## 🎯 Résultat

P4 ne « simule » rien de nouveau : il **projette** un état mental STABLE
(`RecruiterMindState`) en **paramètres d'expérience** (timing, silence, interruption,
ton, tranchant, débit). C'est ce qui fait *ressentir* un entretien.

```
RecruiterMindState (stable, borné)
        ↓  perceiveUX (pure)
PerceptionUX { delayBeforeReplyMs, silenceProbability, interruptionChance,
               toneShift, questionSharpness, speechRate, emotion }
        ↓  runtime (voix/UI)
```

---

## ✅ Validation

| Critère | Résultat |
| :-- | :-: |
| Tests P4 | ✅ **8/8** |
| Tous tests | ✅ **146/146** |
| Iso-comportement | ✅ 138 tests inchangés |
| Lint / gateway tsc / `pnpm -r build` | ✅ tous EXIT 0 |

---

## 🔧 Ce qui a été fait

### `core/simulation/perception-ux.ts` (NOUVEAU)
- `perceiveUX(mind)` : mapping **déterministe** mind → UX.
  - pression haute → ton plus sec, question plus tranchante, réponse plus rapide ;
  - confiance/engagement → ton plus doux ;
  - suspicion → silence appuyé (outil d'évaluation) ;
  - interruption **uniquement** sous forte pression + faible engagement ;
  - fatigue → débit légèrement plus lent.
- **Règles anti-overacting** : toutes les sorties **bornées** (delay 250–1600 ms, silence ≤ 0.45,
  interruption ≤ 0.35, débit 0.85–1.2, ton/sharpness normalisés).
- `smoothUX(prev, next, blend)` : **anti-saccade** (lissage entre tours) → pas de recruteur « bipolaire ».

### Pipeline (`pipeline.ts`)
- `PipelineTurn` expose désormais `ux: PerceptionUX`, dérivé du `mind` à chaque tour.

### Tests (`p4-perception-ux.test.ts`, 8)
- déterminisme · bornes en état extrême · sémantique (tension vs calme) · interruption conditionnelle ·
  lissage · pipeline expose `ux` · **200 tours → ux toujours borné** (intègre la stabilité Step B).

---

## 🧩 Conformité stricte à la spec
- ✅ **Pas de logique métier**, pas de décision, pas de nouvelle simulation.
- ✅ **Projection perceptive** d'un état stable uniquement.
- ✅ **Pur & testable** (le tirage aléatoire éventuel des probabilités se fait côté runtime,
  pas dans le moteur → déterminisme préservé).
- ✅ S'appuie sur l'invariant de stabilité (entrées bornées → sorties bornées).

---

## 🎬 Les « 4 layers UX » de ton blueprint, couverts
1. **Perceptual Engine** → `perceiveUX` (mind → paramètres) ✅
2. **Speech Timing** → `delayBeforeReplyMs`, `speechRate`, `silenceProbability` ✅
3. **Emotional Voice** → `toneShift`, `emotion`, `questionSharpness` ✅
4. **Interaction Friction** → `interruptionChance`, silence comme outil ✅

> Le **branchement runtime** (appliquer ces paramètres au vrai TTS/WS : retarder l'audio,
> moduler le débit, déclencher une interruption) reste l'étape d'intégration transport
> suivante — volontairement séparée pour garder P4 pur et le transport « bête ».

---

## 🚀 Bilan
Le système **fait désormais ressentir** un entretien : timing humain, silences,
montée de tension, interruptions — tout dérivé d'un agent **stable et borné**.
De « simule un entretien » → « fait vivre un entretien ».
