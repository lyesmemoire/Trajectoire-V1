# ✅ P3.2 — Rapport d'exécution : Voice runtime (TTS + boucle conversationnelle)

> Date : 2026-06-04 · Étend le module `voice-interview/` (P3.1) sans le casser.
> Cycle complet : STT → engine → nextQuestion → TTS → playback → boucle.

---

## 🎯 Résultat

Le moteur P3.1 devient un **cycle conversationnel complet**. Chaque tour =
`1 réponse → 1 évaluation STAR → 1 décision engine → 1 question suivante → 1 audio (ou fallback texte)`.

---

## ✅ Validation

| Critère | Résultat |
| :-- | :-: |
| Tests P3.2 | ✅ **11/11** |
| Tous tests (produit + voice) | ✅ **40/40** |
| Lint module vocal | ✅ 0 erreur |
| Build `realtime-gateway` (`tsc` strict) | ✅ EXIT 0 |
| `pnpm -r build` (api + gateway) | ✅ EXIT 0 |

---

## 🔧 Ce qui a été fait (ordre strict du plan)

1. **`adapters/tts.ts`** (NOUVEAU) — abstraction `TTSAdapter` + `DefaultTTSAdapter`.
   - Provider réel optionnel (OpenAI/ElevenLabs branchables plus tard).
   - **Fallback déterministe** : `createSilentWav()` (WAV PCM silencieux) si provider absent/KO.
   - `synthesize()` ne **rejette jamais**.
2. **`core/voice-orchestrator.ts`** (NOUVEAU) — cœur P3.2.
   - `openingTurn(state, tts?)` et `processVoiceTurn(state, transcript, tts?)`.
   - Sortie canonique **`VoiceTurnResult`** `{ transcript, score, feedback, nextQuestion, signal, finished, audio?, audioFallback, state }`.
   - `safeSynthesize()` : audio si possible, sinon `audioFallback: true`.
3. **`core/feedback-text.ts`** (NOUVEAU) — feedback texte court, calme, non jugeant, dérivé du signal + STAR.
4. **`sessions/session-manager.ts`** (ÉTENDU, non-breaking) — ajout `currentTurn`, `lastAudioResponse?`, `history[]` + méthode `recordTurn()`. Toujours **in-memory + TTL**.
5. **`adapters/voice-websocket.ts`** (NOUVEAU) — transport conversationnel complet.
   - Events client→serveur : audio binaire + `{ type: "end_speech" }`.
   - Events serveur→client : `ready`, `transcript`, `feedback_text`, `next_question_audio`, `error`.
   - `handleVoiceConnectionV2()` — **P3.1 `handleVoiceConnection` reste intact**.
6. **`index.ts`** — surface publique étendue (TTS, orchestrator, V2).
7. **Tests** — `tests/voice-interview/p32.test.ts` (TTS fallback/provider/crash, orchestrator, feedback, recordTurn, websocket V2 mock bout-en-bout).

---

## 🧱 VoiceTurnResult (contrat canonique P3.2)
```ts
type VoiceTurnResult = {
  transcript: string;
  score: number;
  feedback: string;
  nextQuestion: string;
  signal: "probe" | "deepen" | "move-on";
  finished: boolean;
  audio?: ArrayBuffer;     // absent si TTS indisponible
  audioFallback: boolean;  // true => réponse texte seule
  state: InterviewState;
};
```

---

## 🚧 Règles strictes respectées
- ❌ Pas de DB, pas de Supabase, pas d'OpenAI obligatoire, pas de couplage `/product`, pas d'état global.
- ✅ Sessions in-memory + TTL, adapters optionnels, **fallback déterministe obligatoire** (jamais de crash audio).
- ✅ Zéro impact P1/P2/P3 texte : UI, API et scoring **inchangés** (smoke 7/7 + interview 7/7 toujours verts).

---

## ✨ Décisions signalées
- **Nouveau fichier `voice-websocket.ts`** (V2) plutôt que muter `websocket.ts` (P3.1) → zéro régression.
- **`feedback-text.ts` séparé** pour garder l'orchestrateur lisible et le texte testable isolément.
- **Fallback "WAV silencieux"** plutôt que `null` → le client reçoit toujours un format audio valide même sans provider.

---

## 🧪 Relancer
```bash
pnpm install
pnpm exec vitest run tests/voice-interview   # 26/26 (P3.1 + P3.2)
pnpm --filter realtime-gateway build         # tsc EXIT 0
```

## ⏭️ Suite : P3.3 — branchement transport réel (Fastify WS route) + provider TTS réel + UI vocale `/product/interview`
