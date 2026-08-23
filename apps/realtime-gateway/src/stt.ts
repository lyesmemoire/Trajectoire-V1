import { envServer } from "./config/env.js";
/**
 * stt.ts — Wrapper Deepgram Live Transcription (Speech-to-Text)
 * Correction B6 :
 * La classe SttSession expose une méthode close() qui ferme proprement
 * la connexion Deepgram. Elle est appelée depuis destroySession() dans
 * session-manager.ts via le callback onDestroy enregistré à la création.
 * Sans ce cleanup :
 * Le stream Deepgram reste ouvert après déconnexion du client WS
 * Deepgram continue à transcrire (et facturer) en silence
 * Les handlers émettent des événements vers des références mortes
 */
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import type { ListenLiveClient } from "@deepgram/sdk";

// ── Types ─────────────────────────────────────────────────────────────────

export interface SttConfig {
  /** Callback appelé avec chaque transcription finale */
  onTranscript: (text: string, confidence: number) => void;
  /* Callback optionnel sur erreur Deepgram */
  onError?: (err: Error) => void;
}

// ── SttSession ────────────────────────────────────────────────────────────

/**
 * Session de transcription vocale en temps réel via Deepgram.
 * Une instance par session WebSocket — fermée explicitement via close().
 */
export class SttSession {
  private client: ListenLiveClient | null = null;
  private closed = false;
  private readonly config: SttConfig;
  constructor(config: SttConfig) {
    this.config = config;
  }

  /**
   * Ouvre la connexion Deepgram et attache les handlers.
   * Doit être appelé une seule fois par session.
   */
  async open(): Promise<void> {
    const apiKey = envServer.DEEPGRAM_API_KEY;
    if (!apiKey) throw new Error("DEEPGRAM_API_KEY manquant");

    const deepgram = createClient(apiKey);

    this.client = deepgram.listen.live({
      model: "nova-2",
      language: "fr",
      smart_format: true,
      interim_results: false,
    });

    this.client.on(LiveTranscriptionEvents.Open, () => {
      console.log("[STT] Connexion Deepgram ouverte");
    });

    this.client.on(LiveTranscriptionEvents.Transcript, (data) => {
      if (this.closed) return;

      const transcript =
        data?.channel?.alternatives?.[0]?.transcript ?? "";
      const confidence =
        data?.channel?.alternatives?.[0]?.confidence ?? 0;

      if (transcript.trim().length > 0) {
        this.config.onTranscript(transcript, confidence);
      }
    });

    this.client.on(LiveTranscriptionEvents.Error, (err) => {
      if (this.closed) return;
      console.error("[STT] Erreur Deepgram:", err);
      this.config.onError?.(
        err instanceof Error ? err : new Error(String(err))
      );
    });

    this.client.on(LiveTranscriptionEvents.Close, () => {
      console.log("[STT] Connexion Deepgram fermée");
    });
  }

  /**
   * Envoie un chunk audio brut (PCM/WAV) à Deepgram pour transcription.
   * Sans effet si la session est déjà fermée.
   */
  sendAudio(chunk: Buffer | ArrayBuffer): void {
    if (this.closed || !this.client) return;
    // Deepgram SDK attend SocketDataLike (ArrayBuffer | SharedArrayBuffer | Blob).
    // Buffer Node.js partage son backing ArrayBuffer avec d'autres allocations —
    // on extrait la portion exacte pour éviter de transmettre des octets parasites.
    const arrayBuffer =
      chunk instanceof ArrayBuffer
        ? chunk
        : chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength);
    this.client.send(arrayBuffer as ArrayBuffer);
  }
  /**
   * Ferme proprement la connexion Deepgram.
   * B6 : appelée par session-manager.destroySession() via le callback
   * onDestroy enregistré dans ActiveSession.sttCleanup.
   * Idempotente : sans effet si déjà fermée.
   */
  close(): void {
    if (this.closed) return;
    this.closed = true;

    if (this.client) {
      // Suppression des listeners avant fermeture pour éviter les callbacks
      // orphelins qui tenteraient des setState ou des logs après destruction
      this.client.removeAllListeners();
      this.client.finish();
      this.client = null;
    }

    console.log("[STT] Session fermée proprement");
  }
}
