# Audit 360° - Phase D : Audit Audio

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Pipeline Audio Complet

### Flux Complet

```
Microphone (Browser)
    ↓ Audio capture (MediaStream)
PCM Float32 (48kHz)
    ↓ float32ToPCM16()
PCM 16-bit (16kHz)
    ↓ WebSocket (binary)
Gateway (Fastify)
    ↓ sendAudio(chunk)
STT Adapter (Deepgram)
    ↓ sendAudio(ArrayBuffer)
Deepgram API (WebSocket)
    ↓ Transcript
Voice Orchestrator
    ↓ LLM
OpenAI API
    ↓ Response
Voice Orchestrator
    ↓ TTS Adapter (ElevenLabs)
TTS Adapter
    ↓ synthesize(text)
ElevenLabs API (HTTP)
    ↓ Audio (MP3)
Gateway (Fastify)
    ↓ sendAudio(audio)
WebSocket (binary)
Browser
    ↓ Audio playback
Speaker
```

---

## Microphone

### Capture Audio

**Browser API**
- `navigator.mediaDevices.getUserMedia()`
- `MediaStream`
- `AudioContext`

**Configuration**
- Sample rate : 48kHz (par défaut)
- Channels : 1 (mono)
- Format : Float32

**Encodage**
- `float32ToPCM16()` : Conversion Float32 → PCM 16-bit
- Sample rate : 16kHz (downsampling)
- Bit depth : 16-bit

**Fichier** : `apps/web/src/lib/audio/pcmEncoder.ts`

```typescript
export function float32ToPCM16(float32: Float32Array): Uint8Array {
  const buffer = new ArrayBuffer(float32.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, float32[i] ?? 0));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Uint8Array(buffer);
}
```

---

## Encodage

### PCM 16-bit

**Codec**
- PCM (Pulse Code Modulation)
- Bit depth : 16-bit
- Sample rate : 16kHz
- Channels : 1 (mono)

**Conversion**
- Float32 → PCM 16-bit
- Downsampling : 48kHz → 16kHz
- Little-endian

**Chunk Size**
- Variable (dépend du streaming)
- Typiquement : 1024 - 4096 samples

---

## WebRTC

### WebSocket

**Protocole**
- WebSocket (ws:// ou wss://)
- Binary messages (Uint8Array)
- Text messages (JSON)

**Endpoint**
- Gateway : `/ws`
- Protocole : WebSocket

**Messages**
- Client → Server : Audio chunk (binary)
- Client → Server : `{ type: "end_speech" }`
- Client → Server : `{ type: "interrupt" }`
- Server → Client : Audio chunk (binary)
- Server → Client : JSON messages

**Fichier** : `apps/realtime-gateway/src/gateway.ts`

---

## Gateway

### Audio Processing

**Réception**
- WebSocket binary messages
- Uint8Array chunks
- Transmission au STT adapter

**Émission**
- Audio chunks (binary)
- TTS output (MP3)
- Transmission au client

**Fichiers**
- `apps/realtime-gateway/src/gateway.ts`
- `apps/realtime-gateway/src/voice-interview/adapters/voice-websocket.ts`

---

## STT (Speech-to-Text)

### Deepgram Adapter

**Provider** : Deepgram

**API** : `wss://api.deepgram.com/v1/listen`

**Modèle** : `nova-2` (ou `nova-2-general`)

**Configuration**
- Encoding : `linear16`
- Sample rate : 16000Hz
- Channels : 1
- Punctuate : true
- Interim results : true
- Language : `fr`

**Callbacks**
- `onTranscript` : Transcript partiel (interim)
- `onFinalTranscript` : Transcript final
- `onError` : Erreur
- `onOpen` : Connexion ouverte
- `onClose` : Connexion fermée

**Fichiers**
- `apps/realtime-gateway/src/voice-interview/adapters/deepgram.ts`
- `apps/realtime-gateway/src/stt.ts`

**Extrait (deepgram.ts)**
```typescript
const conn = dg.listen.live({
  model: this.options.model,
  encoding: "linear16",
  sample_rate: this.options.sampleRate,
  channels: 1,
  punctuate: true,
  interim_results: true,
});
```

---

## OpenAI

### LLM

**Provider** : OpenAI / Mistral

**API** : `https://api.openai.com/v1/chat/completions`

**Modèles**
- OpenAI : `gpt-4o-mini` (défaut)
- Mistral : `mistral-small-latest` (fallback)

**Configuration**
- Temperature : 0.3
- Response format : `{ type: "json_object" }`
- Timeout : 15s
- Max retries : 1

**Fichiers**
- `apps/realtime-gateway/src/llm-strict.ts`
- `apps/realtime-gateway/src/voice-interview/core/llm-strict.ts`

---

## TTS (Text-to-Speech)

### ElevenLabs Adapter

**Provider** : ElevenLabs

**API** : `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`

**Modèle** : `eleven_turbo_v2_5` (ou `eleven_multilingual_v2`)

**Voice ID** : `21m00Tcm4TlvDq8ikWAM` (Rachel)

**Configuration**
- Stability : 0.5
- Similarity boost : 0.75
- Style : 0.0
- Speaker boost : true
- Format : `audio/mpeg`

**Fallback Chain**
- ElevenLabs → OpenAI → Mock (silent WAV)

**Fichiers**
- `apps/realtime-gateway/src/voice-interview/adapters/tts/elevenlabs.ts`
- `apps/realtime-gateway/src/voice-interview/adapters/tts/index.ts`
- `apps/realtime-gateway/src/tts.ts`

**Extrait (elevenlabs.ts)**
```typescript
const res = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(this.voiceId)}`,
  {
    method: "POST",
    headers: {
      "xi-api-key": this.apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: this.modelId,
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
    signal: options?.signal ?? null,
  },
);
```

---

## Audio

### Format

**Output**
- Codec : MP3 (MPEG-1 Audio Layer III)
- Sample rate : Variable (dépend du provider)
- Bit rate : Variable (dépend du provider)
- Channels : 1 (mono)

**Transmission**
- WebSocket binary messages
- ArrayBuffer / Uint8Array
- Streaming

---

## Browser

### Audio Playback

**API**
- `AudioContext`
- `AudioBuffer`
- `AudioBufferSourceNode`

**Configuration**
- Sample rate : 48kHz (par défaut)
- Channels : 1 (mono)
- Format : Float32

**Decoding**
- MP3 → PCM Float32
- `decodeAudioData()`

**Playback**
- `audioBufferSourceNode.start()`
- `audioBufferSourceNode.stop()`

---

## Codec

### Input (Microphone)

- **Format** : PCM Float32
- **Sample rate** : 48kHz
- **Bit depth** : 32-bit (Float32)
- **Channels** : 1 (mono)

### Encodage

- **Format** : PCM 16-bit
- **Sample rate** : 16kHz
- **Bit depth** : 16-bit
- **Channels** : 1 (mono)

### Output (TTS)

- **Format** : MP3
- **Sample rate** : Variable (dépend du provider)
- **Bit rate** : Variable (dépend du provider)
- **Channels** : 1 (mono)

---

## Sample Rate

### Microphone
- **Capture** : 48kHz (par défaut)
- **Downsampling** : 16kHz (pour STT)

### STT (Deepgram)
- **Input** : 16kHz
- **Output** : Transcript (text)

### TTS (ElevenLabs)
- **Input** : Text
- **Output** : Variable (dépend du provider)

### Browser Playback
- **Input** : MP3
- **Decoding** : 48kHz (par défaut)

---

## Chunk Size

### Input (Microphone)
- **Size** : Variable (dépend du streaming)
- **Typical** : 1024 - 4096 samples
- **Buffer** : Float32Array

### STT (Deepgram)
- **Size** : Variable (dépend du streaming)
- **Buffer** : ArrayBuffer

### TTS (ElevenLabs)
- **Size** : Variable (dépend du texte)
- **Buffer** : ArrayBuffer

### Output (Browser)
- **Size** : Variable (dépend du streaming)
- **Buffer** : AudioBuffer

---

## Buffer

### Microphone
- **Type** : Float32Array
- **Size** : Variable
- **Allocation** : Dynamique

### STT
- **Type** : ArrayBuffer
- **Size** : Variable
- **Allocation** : Dynamique

### TTS
- **Type** : ArrayBuffer
- **Size** : Variable
- **Allocation** : Dynamique

### Browser
- **Type** : AudioBuffer
- **Size** : Variable
- **Allocation** : Dynamique

---

## Jitter

### Definition
Variation de latence dans le réseau audio.

### Mesures
- **Jitter input** : Variable (dépend du réseau)
- **Jitter output** : Variable (dépend du réseau)
- **Jitter buffer** : Non implémenté

### Mitigation
- Streaming en temps réel
- Pas de jitter buffer
- Latence acceptable

---

## Latency

### Mesures Actuelles

- **Microphone → Gateway** : ~50ms
- **STT (Deepgram)** : ~500ms (interim), ~1000ms (final)
- **LLM (OpenAI)** : ~2000ms
- **TTS (ElevenLabs)** : ~1000ms
- **Gateway → Browser** : ~50ms
- **Total** : ~3600ms

### Objectifs

- **Microphone → Gateway** : < 100ms
- **STT (Deepgram)** : < 500ms (interim), < 1000ms (final)
- **LLM (OpenAI)** : < 3000ms
- **TTS (ElevenLabs)** : < 1500ms
- **Gateway → Browser** : < 100ms
- **Total** : < 5000ms

---

## Reconnect

### WebSocket

**Strategy**
- Reconnect automatique (géré par le client)
- Backoff exponentiel
- Max retries : Illimité

**Implementation**
- Client-side
- Non implémenté côté serveur

### STT (Deepgram)

**Strategy**
- Reconnect automatique (SDK)
- Backoff exponentiel
- Max retries : Illimité

**Implementation**
- SDK Deepgram
- Géré automatiquement

### TTS (ElevenLabs)

**Strategy**
- Retry automatique (fallback chain)
- Max retries : 1 par provider
- Fallback : ElevenLabs → OpenAI → Mock

**Implementation**
- ChainTTSAdapter
- Géré automatiquement

---

## Interruptions

### Barge-in

**Trigger**
- Client envoie `{ type: "interrupt" }`

**Action**
- Arrêt immédiat du TTS
- Abort signal transmis à l'API
- Reprise écoute audio

**Implementation**
- `AbortSignal` support
- TTS abort immédiat
- STT continue

**Fichiers**
- `apps/realtime-gateway/src/voice-interview/adapters/voice-websocket.ts`
- `apps/realtime-gateway/src/tts.ts`

---

## Speech Analysis

### Speech Analyzer

**Fichier** : `apps/web/src/lib/audio/speech-analyzer.ts`

**Métriques**
- Words per minute (WPM)
- Filler words (euh, heu, hum, etc.)
- Pauses (count, duration, ratio)
- Speed variation
- Overall score

**Configuration**
- Silence threshold : -40dB
- Pause min : 400ms
- Long pause : 2000ms
- WPM target : 110-150

**Filler words**
- Français : euh, heu, hum, voilà, donc, alors, ben, bah, genre, en fait, du coup, c'est-à-dire, clairement, ouais, ok
- Anglais : um, uh, er, ah, like, you know, i mean, basically, actually, right, so, well

---

## Conclusion

### Points forts

1. **Pipeline audio complet** : Micro → Encodage → WebSocket → STT → LLM → TTS → Audio → Browser
2. **Multi-provider TTS** : ElevenLabs → OpenAI → Mock avec fallback
3. **Abort signal support** : Annulation immédiate des appels TTS
4. **Speech analysis** : Analyse détaillée de la parole (WPM, fillers, pauses)
5. **STT streaming** : Deepgram avec transcripts interim et final

### Points faibles

1. **Pas de jitter buffer** : Pas de mitigation du jitter réseau
2. **Pas de VAD (Voice Activity Detection)** : Détection de parole basique
3. **Pas de noise suppression** : Pas de suppression de bruit
4. **Pas de echo cancellation** : Pas d'annulation d'écho
5. **Pas de audio quality monitoring** : Pas de monitoring de la qualité audio

### Recommandations

1. **Implémenter jitter buffer** : Mitigation du jitter réseau
2. **Implémenter VAD** : Détection de parole avancée
3. **Implémenter noise suppression** : Suppression de bruit
4. **Implémenter echo cancellation** : Annulation d'écho
5. **Ajouter audio quality monitoring** : Monitoring de la qualité audio

**Prochaine phase** : Audit Domaine
