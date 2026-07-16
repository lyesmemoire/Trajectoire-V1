# ✅ P3.3 — Rapport d'exécution : Intégration runtime réel (transport + TTS + UI)

> Date : 2026-06-04 · Transport only, core P3.1/P3.2 inchangé, fallback robuste, mode texte préservé.

---

## 🎯 Résultat

Le moteur vocal (P3.1 + P3.2) devient **utilisable dans le navigateur** :
`micro → WS gateway → STT → orchestrator → TTS → audio → speaker`, avec
dégradation gracieuse (mode texte toujours fonctionnel).

---

## ✅ Validation

| Critère | Résultat |
| :-- | :-: |
| Tests P3.3 (TTS chain) | ✅ **9/9** |
| Tous tests (produit + voice) | ✅ **49/49** |
| Lint (gateway voice + lib voice + UI) | ✅ 0 erreur |
| Build `realtime-gateway` (`tsc` strict) | ✅ EXIT 0 |
| Typecheck web (client + UI) | ✅ 0 erreur |
| `pnpm -r build` (api + gateway) | ✅ EXIT 0 |
| `/product/interview` (mode vocal gracieux) | ✅ HTTP 200 |
| API interview texte (non-régression) | ✅ HTTP 200 |

---

## 🔧 Les 3 blocs livrés (ordre strict)

### Bloc 1 — Système TTS à providers (fallback en chaîne)
`adapters/tts/` (NOUVEAU dossier) :
- `types.ts`, `mock.ts` (silent WAV), `elevenlabs.ts`, `openai.ts` (REST, **import optionnel, jamais bloquant au build**), `index.ts` (`ChainTTSAdapter`).
- Chaîne : **ElevenLabs → OpenAI → mock**. `synthesize()` ne rejette jamais.
- `adapters/tts.ts` conservé en **façade rétro-compatible** (P3.2 intact).

### Bloc 1bis — Transport WebSocket gateway
`server/ws.voice.ts` (NOUVEAU) — route Fastify `/api/voice`, **transport pur** :
connect → `handleVoiceConnectionV2` (P3.2) + `ChainTTSAdapter` ; cleanup délégué à l'adapter.
Branché dans `index.ts` du gateway (sans toucher `registerSignaling`).

### Bloc 3 — Frontend voix
- `lib/voice/client.ts` (NOUVEAU) — `VoiceClient` : WS connect, capture micro (MediaRecorder),
  stream audio par chunks (250ms), réception transcript/feedback/audio, **playback via AudioContext**.
  Machine à états : `idle → connecting → listening → thinking → speaking → error`.
- `app/product/interview/_components/VoiceMode.tsx` (NOUVEAU) — bouton « 🎤 Démarrer l'entretien vocal »,
  états visibles, **dégradation gracieuse** si `NEXT_PUBLIC_VOICE_WS_URL` absent.
- `app/product/interview/page.tsx` — `VoiceMode` ajouté **au-dessus** du mode texte (inchangé).

### Tests
`tests/voice-interview/p33-tts.test.ts` (9) : ordre des providers, cascade sur échec, fallback mock, isConfigured, jamais de throw.

---

## 🚧 Contraintes respectées
- ❌ Pas de DB, pas d'état backend global (session manager in-memory + TTL conservé), **pas de logique métier dans le WS server**, **pas de refactor du core P3.1/P3.2**.
- ✅ Fallback audio toujours fonctionnel (silent WAV), engine déterministe inchangé.
- ✅ Mode texte **activable et intact** (smoke 7/7 + interview 7/7 toujours verts).

---

## ✨ Décisions signalées (anti-dette)
1. **Providers TTS en REST + import optionnel** plutôt que SDK statique → le gateway compile sans dépendre des SDK ; un provider absent se désactive proprement.
2. **`ws.voice.ts` 100% transport** (adaptateur `rawSocket → VoiceWsLike`, défensif v11/anciennes versions de `@fastify/websocket`).
3. **`VoiceMode` composant séparé** + dégradation gracieuse → le mode texte n'est jamais bloqué.
4. **Nouvelle route `/api/voice`** distincte de `/api/signal` existant → zéro régression.

---

## ⚠️ Points de vigilance connus (signalés dans le plan)
- **Latence / fragmentation WS / codec** : MediaRecorder produit du webm/opus ; Deepgram accepte plusieurs encodages — à régler finement en prod (paramétrer `encoding`/`sample_rate` selon le flux navigateur).
- **Autoplay policy** : le playback est tenté dans un `AudioContext` ; en cas de blocage navigateur, retour gracieux à `listening` (pas de crash).
- **Memory leaks** : sessions TTL + cleanup `ws.on("close")` → éviction garantie.

---

## 🧪 Activer le mode vocal
```bash
# .env.local
NEXT_PUBLIC_VOICE_WS_URL=ws://localhost:8080
DEEPGRAM_API_KEY=...        # STT
ELEVENLABS_API_KEY=...      # TTS (optionnel ; sinon OpenAI ; sinon mock)
# Lancer le gateway :
pnpm --filter realtime-gateway build && node apps/realtime-gateway/dist/...   # ou ts-node src/index.ts
# Lancer le web :
pnpm dev   # /product/interview -> bouton "Démarrer l'entretien vocal"
```

## ⏭️ Suite possible (P3.4) : tuning codec/latence, barge-in (interruption), persistance optionnelle des transcripts, métriques.
