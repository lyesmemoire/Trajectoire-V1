/**
 * tts.ts — Wrapper ElevenLabs Text-to-Speech
 * Correction B6 :
 * synthesize() accepte désormais un AbortSignal optionnel transmis
 * directement au fetch(). Si la session WebSocket est détruite pendant
 * la synthèse (AbortController.abort() dans destroySession()), la
 * requête HTTP vers ElevenLabs est annulée immédiatement.
 * Sans ce signal :
 * ElevenLabs continue à générer et streamer l'audio
 * La requête occupe une connexion HTTP jusqu'à son terme naturel
 * Les crédits ElevenLabs sont consommés pour un audio non livré
 */
// ── Configuration ─────────────────────────────────────────────────────────

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

// Voice ID par défaut — peut être surchargé via variable d'environnement
const DEFAULT_VOICE_ID =
  process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";

// Modèle ElevenLabs optimisé pour la faible latence
const DEFAULT_MODEL = "eleven_turbo_v2_5";

// ── Types ─────────────────────────────────────────────────────────────────

export interface TtsOptions {
  voiceId?: string;
  model?: string;
  /** Signal d'annulation — doit être l'AbortSignal de la session active */
  signal?: AbortSignal;
}

export interface TtsResult {
  /** Audio généré en Buffer (PCM/MP3 selon le format demandé) */
  audio: Buffer;
  /* Durée estimée en secondes (si fournie par l'API) */
  durationS?: number;
}

// ── synthesize ────────────────────────────────────────────────────────────

/**
 * Synthétise un texte en audio via ElevenLabs.
 * @param text Texte à synthétiser (question de l'IA)
 * @param options Configuration et signal d'annulation
 * @returns Buffer audio prêt à être envoyé au client WebSocket
 * @throws {DOMException} Si le signal est aborted — à attraper côté appelant
 *                     avec `if (err.name === "AbortError") return;`
 */
export async function synthesize(text: _string, options: TtsOptions = {}): Promise<TtsResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY manquant");

  const voiceId = options.voiceId ?? DEFAULT_VOICE_ID;
  const model = options.model ?? DEFAULT_MODEL;

  const url = `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`;

  const response = await fetch(url, {
    method: "POST",
    // B6 : signal transmis au fetch — null si absent (RequestInit attend AbortSignal | null)
    signal: options.signal ?? null,
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: model,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `ElevenLabs TTS failed: ${response.status} ${response.statusText} — ${body}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const audio = Buffer.from(arrayBuffer);

  return { audio };
}
