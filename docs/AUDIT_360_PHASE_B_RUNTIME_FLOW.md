# Audit 360° - Phase B : Architecture Runtime

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Flux Runtime Complet

### 1. Connexion WebSocket

```
Utilisateur (Browser)
    ↓ WebSocket (wss://gateway/ws)
Gateway (Fastify)
    ↓ verifyToken()
JWT Validation
    ↓ createVoiceSession()
Session Manager
    ↓ Session créée
WebSocket Connected
```

**Détails**
- **Endpoint** : `/ws`
- **Protocole** : WebSocket (ws:// ou wss://)
- **Authentification** : JWT token
- **Timeout** : Aucun (connexion persistante)
- **Reconnect** : Géré par le client

**Événements**
- Client → Server : `{ type: "auth", token: "...", sessionId: "..." }`
- Server → Client : `{ type: "auth_ok", sessionId: "..." }`

---

### 2. Boucle de Conversation (Tour de Parole)

```
Utilisateur (Browser)
    ↓ Audio chunk (binary)
Gateway (Fastify)
    ↓ sendAudio(chunk)
STT Adapter (Deepgram)
    ↓ onTranscript() / onFinalTranscript()
Transcript
    ↓ { type: "transcript", text: "...", isFinal: true }
Session Manager
    ↓ session.sink.dispatch()
Voice Orchestrator
    ↓ processVoiceTurn()
LLM Strict (OpenAI/Mistral)
    ↓ callLLMStrict()
OpenAI API / Mistral API
    ↓ JSON response
Voice Orchestrator
    ↓ TTS Adapter (ElevenLabs)
TTS Adapter
    ↓ synthesize(text)
Audio
    ↓ sendAudio(audio)
Gateway (Fastify)
    ↓ WebSocket message
Utilisateur (Browser)
```

**Détails**
- **Audio chunk** : Binary data envoyé en continu
- **STT** : Deepgram API (streaming)
- **LLM** : OpenAI API (gpt-4o-mini) ou Mistral API (mistral-small-latest)
- **TTS** : ElevenLabs API
- **Timeout LLM** : 15 secondes
- **Timeout STT** : Aucun (streaming)
- **Timeout TTS** : Dépend du provider

**Événements**
- Client → Server : Audio chunk (binary)
- Server → Client : `{ type: "transcript", text: "...", final: false }` (interim)
- Server → Client : `{ type: "transcript", text: "...", final: true }` (final)
- Client → Server : `{ type: "end_speech" }`
- Server → Client : `{ type: "feedback_text", feedback: "...", score: 0-100, question: "...", signal: "...", finished: boolean }`
- Server → Client : `{ type: "next_question_audio", available: boolean }`
- Server → Client : Audio chunk (binary)

---

### 3. Interruption (Barge-in)

```
Utilisateur (Browser)
    ↓ { type: "interrupt" }
Gateway (Fastify)
    ↓ handleInterrupt()
Session Manager
    ↓ stop TTS
TTS Adapter
    ↓ Audio stopped
Gateway (Fastify)
    ↓ { type: "interrupted" }
Utilisateur (Browser)
    ↓ Stop audio playback
```

**Détails**
- **Trigger** : Client envoie `{ type: "interrupt" }`
- **Action** : Arrêt immédiat du TTS
- **Timeout** : Aucun (immédiat)
- **Recovery** : Reprise écoute audio

**Événements**
- Client → Server : `{ type: "interrupt" }`
- Server → Client : `{ type: "interrupted" }`

---

### 4. Fin de Session

```
Utilisateur (Browser)
    ↓ WebSocket close
Gateway (Fastify)
    ↓ removeVoiceSession()
Session Manager
    ↓ stt.stop()
STT Adapter
    ↓ repository.update({ endedAt })
Repository (Supabase)
    ↓ finalizeInterview()
Post-Interview Processor
    ↓ Scoring async
Repository (Supabase)
```

**Détails**
- **Trigger** : WebSocket close
- **Action** : Arrêt STT, sauvegarde session, scoring async
- **Timeout** : Aucun (fire and forget)
- **Persistence** : Supabase

**Événements**
- Client → Server : WebSocket close
- Server → Client : Aucun (connexion fermée)

---

## Timeouts

### Gateway WebSocket

- **Connection timeout** : Aucun (connexion persistante)
- **Message timeout** : Aucun (messages traités immédiatement)
- **Idle timeout** : Aucun (connexion persistante)

### STT (Deepgram)

- **Streaming timeout** : Aucun (streaming continu)
- **Final transcript timeout** : Dépend du silence (configuré à 1500ms)
- **Error timeout** : Dépend de l'API Deepgram

### LLM (OpenAI/Mistral)

- **Call timeout** : 15 secondes (configurable)
- **Retry timeout** : 15 secondes par tentative
- **Max retries** : 1 (auto-correction Zod)
- **Fallback timeout** : 15 secondes (OpenAI → Mistral)

### TTS (ElevenLabs)

- **Synthesis timeout** : Dépend de la longueur du texte
- **Audio chunk timeout** : Dépend du streaming
- **Error timeout** : Dépend de l'API ElevenLabs

### Session

- **Silence threshold** : 1500ms (configurable)
- **Max turn duration** : 30000ms (30 secondes, configurable)
- **Max questions** : 10 (configurable)

---

## WebSockets

### Gateway WebSocket

**Endpoint** : `/ws`

**Messages Client → Server**
```typescript
// Authentification
{ type: "auth", token: string, sessionId: string }

// Transcript
{ type: "transcript", transcript: string, isFinal: boolean }

// Contrôle
{ type: "end_speech" }
{ type: "interrupt" }

// Audio (binary)
Uint8Array
```

**Messages Server → Client**
```typescript
// Authentification OK
{ type: "auth_ok", sessionId: string }

// Transcript
{ type: "transcript", text: string, final: boolean, eventId: string }

// Feedback
{ type: "feedback_text", feedback: string, score: number, question: string, signal: string, finished: boolean, eventId: string }

// Audio disponible
{ type: "next_question_audio", available: boolean, eventId: string }

// Interruption
{ type: "interrupted", eventId: string }

// Résumé
{ type: "summary", summary: InterviewSummary, eventId: string }

// Erreur
{ type: "error", message: string, eventId: string }

// Audio (binary)
Uint8Array
```

### Voice WebSocket (V2)

**Endpoint** : `/ws` (même endpoint, logique interne)

**Messages Client → Server**
```typescript
// Audio (binary)
Uint8Array

// Contrôle
{ type: "end_speech" }
{ type: "interrupt" }
```

**Messages Server → Client**
```typescript
// Ready
{ type: "ready", sessionId: string, question: string, eventId: string }

// Transcript
{ type: "transcript", text: string, final: boolean, eventId: string }

// Feedback
{ type: "feedback_text", feedback: string, score: number, question: string, signal: string, finished: boolean, eventId: string }

// Audio disponible
{ type: "next_question_audio", available: boolean, eventId: string }

// Interruption
{ type: "interrupted", eventId: string }

// Résumé
{ type: "summary", summary: InterviewSummary, eventId: string }

// Erreur
{ type: "error", message: string, eventId: string }

// Audio (binary)
Uint8Array
```

---

## Événements Internes

### Session Manager

**Événements produits**
- `session_created` : Session créée
- `session_updated` : Session mise à jour
- `session_removed` : Session supprimée

**Événements consommés**
- Aucun (Session Manager est producteur)

### Voice Orchestrator

**Événements produits**
- `transcript` : Transcript reçu
- `ai_chunk` : Chunk de réponse IA
- `ai_done` : Réponse IA terminée
- `ai_error` : Erreur IA
- `ai_audio_chunk` : Chunk audio IA
- `ai_audio_done` : Audio IA terminé
- `interrupt` : Interruption

**Événements consommés**
- `transcript` : Transcript reçu du Session Manager

### LLM Strict

**Événements produits**
- Aucun (LLM Strict est un wrapper)

**Événements consommés**
- Aucun (LLM Strict est appelé directement)

### STT Adapter (Deepgram)

**Événements produits**
- `transcript` : Transcript partiel
- `final_transcript` : Transcript final
- `error` : Erreur STT

**Événements consommés**
- `audio_chunk` : Chunk audio du client

### TTS Adapter (ElevenLabs)

**Événements produits**
- `audio_chunk` : Chunk audio
- `audio_done` : Audio terminé
- `error` : Erreur TTS

**Événements consommés**
- `text` : Texte à synthétiser

---

## Appels Externes

### Deepgram API

**Endpoint** : `wss://api.deepgram.com/v1/listen`

**Appels**
- Streaming STT (WebSocket)

**Timeout**
- Aucun (streaming)

**Retry**
- Aucun (connexion persistante)

### OpenAI API

**Endpoint** : `https://api.openai.com/v1/chat/completions`

**Appels**
- Chat completions (POST)

**Timeout**
- 15 secondes

**Retry**
- 1 retry (auto-correction Zod)

**Fallback**
- Mistral API

### Mistral API

**Endpoint** : `https://api.mistral.ai/v1/chat/completions`

**Appels**
- Chat completions (POST)

**Timeout**
- 15 secondes

**Retry**
- Aucun (fallback uniquement)

### ElevenLabs API

**Endpoint** : `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`

**Appels**
- Text-to-speech (POST)

**Timeout**
- Dépend de la longueur du texte

**Retry**
- Aucun

### Supabase

**Endpoint** : `https://...supabase.co`

**Appels**
- CRUD sur tables
- Authentification
- Storage

**Timeout**
- Dépend de l'opération

**Retry**
- Aucun

### Redis

**Endpoint** : `redis://...`

**Appels**
- Cache
- Session storage
- Rate limiting

**Timeout**
- Dépend de l'opération

**Retry**
- Aucun

---

## Latence

### Mesures actuelles

- **STT latency** : ~500ms (interim), ~1000ms (final)
- **LLM latency** : ~2000ms (gpt-4o-mini)
- **TTS latency** : ~1000ms (ElevenLabs)
- **Total turn latency** : ~4000ms

### Objectifs

- **STT latency** : < 500ms (interim), < 1000ms (final)
- **LLM latency** : < 3000ms
- **TTS latency** : < 1500ms
- **Total turn latency** : < 5000ms

---

## Monitoring

### Métriques collectées

- `session_count` : Nombre de sessions actives
- `turn_latency_ms` : Latence d'un tour
- `stt_latency_ms` : Latence STT
- `llm_latency_ms` : Latence LLM
- `tts_latency_ms` : Latence TTS
- `error_count` : Nombre d'erreurs
- `interrupt_count` : Nombre d'interruptions

### Logging

- **Structured logs** : Pino
- **Level** : info, warn, error
- **Fields** : sessionId, userId, timestamp, event, duration

---

## Conclusion

Le flux runtime est bien structuré avec des timeouts appropriés et des mécanismes de résilience. Les points d'amélioration identifiés sont :

1. **Latence LLM** : Peut être optimisée avec des modèles plus rapides
2. **Retry STT** : Aucun retry en cas d'erreur
3. **Monitoring** : Métriques basiques, à enrichir
4. **Tracing distribué** : Non implémenté

**Prochaine phase** : Audit OpenAI
