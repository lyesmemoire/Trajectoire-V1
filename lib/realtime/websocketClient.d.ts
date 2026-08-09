export declare class RealtimeWebSocketClient {
    private url;
    private sessionId;
    private ws;
    onTranscript: ((msg: unknown) => void) | null;
    onOpen: (() => void) | null;
    onClose: (() => void) | null;
    onMessage: ((msg: unknown) => void) | null;
    onPong: ((rtt: number) => void) | null;
    onAudioChunk: ((chunk: Uint8Array) => void) | null;
    private lastPingTimestamp;
    constructor(url: string, sessionId: string);
    connect(): void;
    /** Send a ping with timestamp */
    ping(): void;
    sendPCM(payload: number[]): void;
    disconnect(): void;
}
//# sourceMappingURL=websocketClient.d.ts.map