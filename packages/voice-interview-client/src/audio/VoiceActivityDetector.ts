/**
 * Energy-based Voice Activity Detection (VAD).
 * Runs on the main thread using the analyser node data.
 */

export interface VADConfig {
  readonly threshold: number;
  readonly silenceMs: number;
}

export type VADCallback = (isSpeaking: boolean) => void;

export class VoiceActivityDetector {
  private readonly threshold: number;
  private readonly silenceMs: number;
  private isSpeaking: boolean = false;
  private silenceStartedAt: number | null = null;
  private callback: VADCallback | null = null;
  private animationFrameId: number | null = null;
  private getRmsLevel: (() => number) | null = null;

  constructor(config: VADConfig) {
    this.threshold = config.threshold;
    this.silenceMs = config.silenceMs;
  }

  start(getRmsLevel: () => number, callback: VADCallback): void {
    this.getRmsLevel = getRmsLevel;
    this.callback = callback;
    this.isSpeaking = false;
    this.silenceStartedAt = null;
    this.tick();
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.getRmsLevel = null;
    this.callback = null;
    this.isSpeaking = false;
    this.silenceStartedAt = null;
  }

  get speaking(): boolean {
    return this.isSpeaking;
  }

  private tick(): void {
    if (!this.getRmsLevel || !this.callback) return;

    const rms = this.getRmsLevel();
    const now = Date.now();

    if (rms >= this.threshold) {
      // Voice detected
      this.silenceStartedAt = null;
      if (!this.isSpeaking) {
        this.isSpeaking = true;
        this.callback(true);
      }
    } else {
      // Silence
      if (this.isSpeaking) {
        if (this.silenceStartedAt === null) {
          this.silenceStartedAt = now;
        } else if (now - this.silenceStartedAt >= this.silenceMs) {
          this.isSpeaking = false;
          this.silenceStartedAt = null;
          this.callback(false);
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.tick());
  }
}
