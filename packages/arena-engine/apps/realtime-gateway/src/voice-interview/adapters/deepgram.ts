/**
 * adapters/deepgram.ts — Adapter STT streaming (I/O uniquement, P3.1).
 *
 * Couche infra : transforme un flux audio PCM en transcripts via Deepgram (SDK v3).
 * Aucune logique d'entretien ici — il se contente d'émettre des events.
 * Le core (interview-engine) ne dépend JAMAIS de ce fichier.
 */

import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";

export interface DeepgramAdapterCallbacks {
  /** Transcript partiel (interim). */
  onTranscript?: (partial: string) => void;
  /** Transcript final d'un segment. */
  onFinalTranscript?: (text: string) => void;
  onError?: (err: unknown) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface DeepgramAdapterOptions {
  apiKey?: string;
  model?: string;
  sampleRate?: number;
  userId?: string;
}

/**
 * Adapter d'écoute Deepgram en temps réel.
 * Lance une connexion `listen.live` et route les événements vers les callbacks.
 */
export class DeepgramAdapter {
  private connection: ReturnType<
    ReturnType<typeof createClient>["listen"]["live"]
  > | null = null;
  private readonly callbacks: DeepgramAdapterCallbacks;
  private readonly options: Required<DeepgramAdapterOptions>;
  private finopsBlocked = false;
  private readonly userId: string;

  constructor(
    callbacks: DeepgramAdapterCallbacks = {},
    options: DeepgramAdapterOptions = {},
  ) {
    this.userId = options.userId || "anonymous";
    this.callbacks = callbacks;
    this.options = {
      apiKey: options.apiKey ?? process.env.DEEPGRAM_API_KEY ?? "",
      model: options.model ?? "nova-2-general",
      sampleRate: options.sampleRate ?? 16000,
      userId: this.userId,
    };
  }

  /** True si une clé API est configurée (sinon l'adapter est inerte). */
  isConfigured(): boolean {
    return this.options.apiKey.length > 0;
  }

  /** Ouvre la connexion streaming. No-op si non configuré. */
  async start(): Promise<void> {
    if (!this.isConfigured()) {
      this.callbacks.onError?.(new Error("DEEPGRAM_API_KEY manquante"));
      return;
    }

    const { recordAndInspectSttUsage } = await import("../../../../../../lib/security/finops-firewall.js");
    const finops = await recordAndInspectSttUsage(this.userId, 16000 * 2);
    if (!finops.allowed) {
      console.warn("[DeepgramAdapter] FinOps firewall engaged. Halting external STT connection, switching to passive text mode.");
      this.finopsBlocked = true;
      return;
    }

    try {
      const dg = createClient(this.options.apiKey);
      const conn = dg.listen.live({
        model: this.options.model,
        encoding: "linear16",
        sample_rate: this.options.sampleRate,
        channels: 1,
        punctuate: true,
        interim_results: true,
      });

      conn.on(LiveTranscriptionEvents.Open, () => this.callbacks.onOpen?.());
      conn.on(LiveTranscriptionEvents.Close, () => this.callbacks.onClose?.());
      conn.on(LiveTranscriptionEvents.Error, (err: unknown) =>
        this.callbacks.onError?.(err),
      );
      conn.on(LiveTranscriptionEvents.Transcript, (data: unknown) => {
        const parsed = extractTranscript(data);
        if (!parsed) return;
        if (parsed.isFinal) this.callbacks.onFinalTranscript?.(parsed.text);
        else this.callbacks.onTranscript?.(parsed.text);
      });

      this.connection = conn;
    } catch (err) {
      this.callbacks.onError?.(err);
    }
  }

  /** Envoie un chunk audio PCM-16. */
  async sendAudio(chunk: Uint8Array): Promise<void> {
    if (this.finopsBlocked) return;
    try {
      const { recordAndInspectSttUsage } = await import("../../../../../../lib/security/finops-firewall.js");
      const finops = await recordAndInspectSttUsage(this.userId, chunk.byteLength);
      if (!finops.allowed) {
        this.finopsBlocked = true;
        return;
      }

      // Le SDK Deepgram accepte les buffers binaires ; on normalise en ArrayBuffer.
      const ab = chunk.buffer.slice(
        chunk.byteOffset,
        chunk.byteOffset + chunk.byteLength,
      ) as ArrayBuffer;
      this.connection?.send(ab);
    } catch (err) {
      this.callbacks.onError?.(err);
    }
  }

  /** Ferme proprement la connexion et retire tous les listeners. */
  stop(): void {
    try {
      if (this.connection) {
        this.connection.removeAllListeners();
        this.connection.finish?.();
      }
    } catch {
      /* ignore */
    }
    this.connection = null;
  }
}

/** Extrait { text, isFinal } d'un événement Deepgram, de façon défensive. */
export function extractTranscript(
  data: unknown,
): { text: string; isFinal: boolean } | null {
  if (typeof data !== "object" || data === null) return null;
  const d = data as {
    is_final?: boolean;
    channel?: { alternatives?: Array<{ transcript?: string }> };
  };
  const text = d.channel?.alternatives?.[0]?.transcript ?? "";
  if (!text) return null;
  return { text, isFinal: !!d.is_final };
}
