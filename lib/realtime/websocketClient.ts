export class RealtimeWebSocketClient {
  private ws: WebSocket | null = null;
  public onTranscript: ((msg: any) => void) | null = null;
  public onOpen: (() => void) | null = null;
  public onClose: (() => void) | null = null;
  public onMessage: ((msg: any) => void) | null = null;
  public onPong: ((rtt: number) => void) | null = null;
  public onAudioChunk: ((chunk: Uint8Array) => void) | null = null;

  private lastPingTimestamp: number = 0;

  constructor(
    private url: string,
    private sessionId: string,
  ) {}

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.ws?.send(
        JSON.stringify({
          protocolVersion: 1,
          type: "start",
          sessionId: this.sessionId,
        }),
      );
      this.onOpen?.();
    };

    this.ws.onmessage = async (event) => {
      // AUDIO BINARY
      if (event.data instanceof Blob) {
        const arrayBuffer = await event.data.arrayBuffer();
        this.onAudioChunk?.(new Uint8Array(arrayBuffer));
        return;
      }
      try {
        const msg = JSON.parse(event.data as string);
        // generic handler
        this.onMessage?.(msg);
        if (msg.type === "transcript" && this.onTranscript) {
          this.onTranscript(msg.payload);
        } else if (msg.type === "pong" && typeof msg.payload === "number") {
          const rtt = performance.now() - msg.payload;
          this.onPong?.(rtt);
        }
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    this.ws.onclose = () => {
      this.onClose?.();
    };
  }

  /** Send a ping with timestamp */
  ping() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const ts = performance.now();
      this.lastPingTimestamp = ts;
      this.ws.send(JSON.stringify({ type: "ping", payload: ts }));
    }
    // No action needed if not connected
  }

  sendPCM(payload: number[]) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          protocolVersion: 1,
          type: "pcm",
          sessionId: this.sessionId,
          payload,
        }),
      );
    }
    // No action needed if not connected
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    // No action needed if already disconnected
  }
}
