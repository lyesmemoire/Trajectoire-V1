export class RealtimeWebSocketClient {
    url;
    sessionId;
    ws = null;
    onTranscript = null;
    onOpen = null;
    onClose = null;
    onMessage = null;
    onPong = null;
    onAudioChunk = null;
    lastPingTimestamp = 0;
    constructor(url, sessionId) {
        this.url = url;
        this.sessionId = sessionId;
    }
    connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = () => {
            this.ws?.send(JSON.stringify({
                protocolVersion: 1,
                type: "start",
                sessionId: this.sessionId,
            }));
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
                const msg = JSON.parse(event.data);
                // generic handler
                this.onMessage?.(msg);
                if (msg.type === "transcript" && this.onTranscript) {
                    this.onTranscript(msg.payload);
                }
                else if (msg.type === "pong" && typeof msg.payload === "number") {
                    const rtt = performance.now() - msg.payload;
                    this.onPong?.(rtt);
                }
            }
            catch (error) {
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
    }
    sendPCM(payload) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                protocolVersion: 1,
                type: "pcm",
                sessionId: this.sessionId,
                payload,
            }));
        }
    }
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}
//# sourceMappingURL=websocketClient.js.map