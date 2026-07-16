# ✅ P3.9 — Rapport d'exécution : Binding Simulation → V2 (integration layer)

> Date : 2026-06-04 · Couplage propre, **opt-in**, déterministe. Zéro impact transport.
> Critère de design respecté : « je supprime la simulation et V2 continue de fonctionner ».

---

## 🎯 Résultat

La couche de simulation (P3.8) est désormais **injectée dans le flux V2** — sans
dupliquer la logique de décision. V2 décide QUOI demander ; la simulation façonne
COMMENT (ton, longueur, interruption, accroche cross-session) + fait évoluer
pression/mémoire/persona/hidden-eval.

---

## ✅ Validation

| Critère | Résultat |
| :-- | :-: |
| Tests P3.9 | ✅ **7/7** |
| Tous tests | ✅ **123/123** |
| **Découplage** (simulation OFF) | ✅ 116 tests antérieurs **inchangés** |
| Lint | ✅ 0 erreur |
| Build gateway (`tsc` strict) | ✅ EXIT 0 |
| `pnpm -r build` | ✅ EXIT 0 |

---

## 🔧 Ce qui a été fait

### `core/simulation/integration.ts` (NOUVEAU) — le seul point de binding
- `SimulationContext` : `{ recruiterMood, tone, shorten, canInterrupt, responseLatencyBias, crossSessionHook }`.
- `deriveSignal(observation)` : perception/évaluation d'un tour → `SimulationSignal`.
- `buildSimulationContext(state, {opening})` : `SimulationState` → contexte.
- `applySimulationToQuestion(question, ctx)` : **façonne le texte** (ton, concision, mode interrogatoire).
- `applyOpeningContext(question, ctx)` : accroche cross-session à l'ouverture.

### `interview-engine-v2.ts` — binding opt-in
- État V2 : champ optionnel `simulation?: SimulationState`. **Absent → V2 strictement inchangé.**
- `initInterviewV2({ enableSimulation, previousSessions })` : crée la simulation + applique le hook d'ouverture.
- `nextV2Step` : **après** la décision V2 (étape 4), si `simulation` présent → `deriveSignal` → `updateSimulation` → `applySimulationToQuestion`. La **décision n'est jamais modifiée**, seulement le texte de sortie.

---

## 🧩 Respect strict de la spec
- ✅ **Pas de nouveau comportement** : P3.9 injecte la simulation existante.
- ✅ **Pas de duplication V2** : la simulation ne décide aucune question.
- ✅ **Un seul hook d'intégration** (`integration.ts`).
- ✅ **Zéro impact transport/WS**.
- ✅ **Hidden-eval n'influence jamais directement une question** : il alimente pression + persona (via `updateSimulation`), comme spécifié.
- ✅ **Test de découplage** : OFF par défaut, 116 tests inchangés = preuve.

---

## 🧪 Preuve de découplage (test clé)
`p39-binding.test.ts` :
- OFF → même 1ère question qu'avant, `state.simulation === undefined`.
- ON → simulation présente, question façonnée, pression évolue.
- **La substance de la question reste identique ON/OFF** (seul le ton/préfixe change).

---

## ✨ Décisions signalées
- **Opt-in via `enableSimulation`** : bascule progressive, V1/V2 actuels intacts.
- **Façonnage de sortie, pas de décision** : garantit l'absence de 3ᵉ moteur (l'erreur à éviter).
- Branchement transport `?engine=v2&sim=1` possible ensuite (incrément trivial, non inclus pour rester focalisé sur le binding core).

---

## 🚀 État du système
```
transcript → V2 (décision) → [simulation: pression/mémoire/persona/hidden-eval] → texte façonné → question
```
V2 = cerveau logique · Simulation = personnalité vivante · Binding = couche d'injection propre.

## ⏭️ Suite
- Exposer `sim=1` dans `ws.voice.ts` (`engine=v2`) + transmettre `responseLatencyBias`/`canInterrupt` au runtime.
- P4 — Real Interview Experience Layer (silences, hésitations, micro-interruptions).
