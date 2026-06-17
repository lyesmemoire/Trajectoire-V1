// apps/realtime-gateway/src/interview/runtime/replay/player/ReplayPlaybackEngine.ts

export interface ReplayPlaybackState {
  readonly playing: boolean;
}

export type ReplayPlaybackListener = (
  state: ReplayPlaybackState,
) => void;

export interface ReplayPlaybackConfig {
  readonly autoplay?: boolean;
}

export class ReplayPlaybackEngine {
  private listener: ReplayPlaybackListener | null = null;

  constructor(
    private readonly config: ReplayPlaybackConfig = {},
  ) {}

  onStateChange(
    listener: ReplayPlaybackListener,
  ): void {
    this.listener = listener;
  }

  async play(): Promise<void> {
    this.listener?.({
      playing: true,
    });
  }

  stop(): void {
    this.listener?.({
      playing: false,
    });
  }
}
