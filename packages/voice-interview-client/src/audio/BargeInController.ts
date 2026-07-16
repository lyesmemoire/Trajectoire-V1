/**
 * Barge-in controller: interrupts TTS playback when user starts speaking.
 */

import { AudioPlayer } from "./AudioPlayer.js";

export class BargeInController {
  private readonly player: AudioPlayer;
  private readonly enabled: boolean;
  private onBargeIn: (() => void) | null = null;

  constructor(player: AudioPlayer, enabled: boolean) {
    this.player = player;
    this.enabled = enabled;
  }

  setBargeInCallback(callback: () => void): void {
    this.onBargeIn = callback;
  }

  handleSpeechDetected(): void {
    if (!this.enabled) return;

    if (this.player.state === "playing") {
      void this.player.stopPlayback();
      this.onBargeIn?.();
    }
  }

  get isEnabled(): boolean {
    return this.enabled;
  }
}
