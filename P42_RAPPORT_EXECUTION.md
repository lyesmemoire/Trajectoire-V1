# P4.2 — Runtime Voice Binding Layer — Rapport d'exécution

## Résumé

Ajout d'une **couche runtime** qui *réalise* les paramètres UX déclaratifs
(`PerceptionUX`, sortie gouvernée du pipeline P4/P4.1) en effets concrets de
transport vocal : délais réels, silences appuyés, interruptions (barge-in
recruteur), débit de parole. La couche est **pure, déterministe (Clock + RNG
injectables), additive et iso-comportement**. Le transport reste « bête ».

Scope retenu (validé) : **couche pure testable + câblage WS/TTS réel derrière un
flag** (`?sim=1`). Sémantique d'interruption : **les deux** — barge-in candidat
(existant P3.4, intact) + interruption recruteur (nouvelle, bornée par
`interruptionChance` ≤ 0.35 garanti par le governor).

## Problèmes détectés

- **Environnement éphémère** : `.git`, `node_modules` et le PATH ne persistent
  pas entre blocs/tours. De plus, des `write_file` espacés d'un long
  `pnpm install` ont été perdus → désormais **fichiers créés via heredoc dans le
  même bloc que les tests**, pnpm réinstallé dans chaque bloc.
- **Timeout de tests async** : `clock.advance()` était appelé avant que
  `runVoiceTurn` n'enregistre ses `sleep` (promesse pas encore au premier
  `await`) → sleeps jamais résolus. Corrigé par un helper `drive()` qui cède la
  main (microtask) entre chaque pas de temps virtuel.

## Actions effectuées

Nouveaux fichiers (`apps/realtime-gateway/src/voice-interview/runtime/`), dans
l'ordre strict :

1. **`clock.ts`** — `Clock` (`now`/`sleep`), `SystemClock` (prod),
   `FakeClock` (temps virtuel, tests). Frontière d'effet temporel unique.
2. **`rng.ts`** — `Rng`, `SeededRng` (mulberry32). Tire les probabilités UX de
   façon reproductible (même seed → même scénario).
3. **`turn-timing.ts`** — `buildTurnPlan(ux, text, rng)` : `PerceptionUX` →
   `TurnPlan` (délai, silence appuyé, interruption, durée modulée par
   `speechRate`). 100% pur. + `estimateSpeakMs`, `interruptAtMs`.
4. **`voice-runtime.ts`** — `runVoiceTurn` : `TurnPlan` → séquence de
   `VoiceInstruction` + réalisation des délais via la Clock. Aucune I/O réseau.
5. **`transport-binding.ts`** — `bindAndPlay` : exécute les instructions via
   `TTSAdapter` + `VoiceSink` (interface « bête »). Ne décide rien.
6. **`voice-sink-ws.ts`** — `createWsVoiceSink` : pont **additif** vers le WS V2
   existant (callbacks `sendJson`/`sendAudio`), protocole `sim_*`. Activable
   derrière un flag, sans réécrire `voice-websocket-v2.ts`.
7. **`index.ts`** — façade.

Tests : `tests/voice-interview/p42-runtime-binding.test.ts` (8 tests) —
déterminisme (même seed → même plan ; 100 seeds → les deux issues), réalisation
bornée (débit module la durée + plancher, `totalLeadMs`, `silenceProbability=0`),
runtime + Clock virtuelle, transport bête, pont WS.

## Garanties d'architecture

- **Additif** : aucun fichier existant modifié (le WS V2 n'est pas touché ; le
  branchement réel se fait via le pont, opt-in).
- **Déterministe** : Clock + RNG injectables → tests reproductibles, pas de
  `setTimeout`/`Math.random` directs dans la logique.
- **Iso-comportement** : **167 tests verts** (159 + 8). 0 test cassé.
- **Découplage** : « je supprime la simulation/runtime → V2 continue ». Le
  runtime consomme `PerceptionUX` (read-only) ; il n'écrit ni dans V2 ni dans la
  simulation.
- **Transport bête** : `transport-binding` + `voice-sink-ws` ne font que
  traduire des instructions déjà décidées.

## Validation

| Vérification | Résultat |
|---|---|
| `vitest` P4.2 | **8/8** |
| `vitest` suite complète | **167/167** (18 fichiers) |
| `eslint` runtime | **0 erreur** |
| `tsc --noEmit` gateway (strict, exactOptionalPropertyTypes) | **EXIT 0** |

## Prochaines étapes

1. **Câblage serveur réel** : appeler `runVoiceTurn` + `bindAndPlay(createWsVoiceSink(...))`
   dans `handleVoiceConnectionV2Engine` derrière `?engine=v2&sim=1`
   (`SystemClock` + `SeededRng(sessionSeed)`), en gardant le flux par défaut
   intact. À valider sur un environnement avec vrai réseau/TTS.
2. **Test E2E vocal** réel (latence STT/TTS) — hors sandbox.
3. **Stress-test global** (1000 interviews simulées, stabilité longue durée)
   en réutilisant `SeededRng` pour la reproductibilité.
