/**
 * lib/voice/client.ts — Client WebSocket vocal navigateur (P3.3 + P3.4).
 * Optimized for Ultra-Low Latency (< 1.5s perceived RTT).
 */
const RECONNECT_DELAYS = [1000, 2000, 5000, 10000];
const DEBUG = typeof process !== "undefined" && process.env.NEXT_PUBLIC_VOICE_DEBUG === "true";
function dbg(...args) {
    if (DEBUG)
        console.debug("[voice]", ...args);
}
export class VoiceClient {
    options;
    cb;
    ws = null;
    media = null;
    recorder = null;
    audioCtx = null;
    analyser = null;
    monitorRAF = null;
    audioQueue = [];
    playing = false;
    currentSource = null;
    sessionId = null;
    reconnectAttempt = 0;
    manualStop = false;
    seenEvents = new Set();
    state = "idle";
    // Latency Tracking
    speechEndTimestamp = 0;
    llmStartTimestamp = 0;
    firstTokenTimestamp = 0;
    ttsStartTimestamp = 0;
    audioPlayStartTimestamp = 0;
    streamAbortController = null;
    constructor(options, cb = {}) {
        this.options = options;
        this.cb = cb;
        this.ensureCtx(); // Pre-initialize AudioContext
    }
    getState() {
        return this.state;
    }
    setState(s) {
        this.state = s;
        this.cb.onState?.(s);
        dbg("state", s);
    }
    fail(message) {
        this.cb.onError?.(message);
        this.setState("error");
    }
    async start() {
        this.manualStop = false;
        this.setState("connecting");
        const ok = await this.connect();
        if (!ok)
            return;
        await this.startMic();
    }
    buildUrl() {
        const url = new URL(this.options.url);
        url.pathname = "/api/voice";
        if (this.options.gap)
            url.searchParams.set("gap", this.options.gap);
        if (this.options.question)
            url.searchParams.set("question", this.options.question);
        if (this.sessionId)
            url.searchParams.set("resume", this.sessionId);
        return url.toString();
    }
    connect() {
        return new Promise((resolve) => {
            let settled = false;
            try {
                this.ws = new WebSocket(this.buildUrl());
                this.ws.binaryType = "arraybuffer";
            }
            catch (error) {
                this.fail("URL WebSocket invalide.");
                return resolve(false);
            }
            this.ws.onopen = () => {
                this.reconnectAttempt = 0;
                settled = true;
                resolve(true);
            };
            this.ws.onmessage = (ev) => this.onMessage(ev);
            this.ws.onerror = () => dbg("ws error");
            this.ws.onclose = () => {
                if (!settled) {
                    settled = true;
                    resolve(false);
                }
                if (!this.manualStop)
                    this.scheduleReconnect();
            };
        });
    }
    scheduleReconnect() {
        const delay = RECONNECT_DELAYS[Math.min(this.reconnectAttempt, RECONNECT_DELAYS.length - 1)] ?? 10000;
        this.reconnectAttempt += 1;
        this.setState("connecting");
        setTimeout(async () => {
            if (this.manualStop)
                return;
            const ok = await this.connect();
            if (ok)
                this.setState("listening");
        }, delay);
    }
    async startMic() {
        try {
            this.media = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        catch (error) {
            this.fail("Micro refusé ou indisponible.");
            return;
        }
        try {
            this.recorder = new MediaRecorder(this.media);
            this.recorder.ondataavailable = async (e) => {
                if (e.data.size > 0 && this.ws?.readyState === WebSocket.OPEN) {
                    this.ws.send(await e.data.arrayBuffer());
                }
            };
            this.recorder.start(250);
            this.setupBargeIn();
            this.setState("listening");
        }
        catch (error) {
            this.fail("Capture audio non supportée par ce navigateur.");
        }
    }
    setupBargeIn() {
        try {
            const ctx = this.ensureCtx();
            const source = ctx.createMediaStreamSource(this.media);
            this.analyser = ctx.createAnalyser();
            this.analyser.fftSize = 512;
            source.connect(this.analyser);
            const data = new Uint8Array(this.analyser.frequencyBinCount);
            const threshold = this.options.bargeInThreshold ?? 0.08;
            const monitor = () => {
                if (!this.analyser)
                    return;
                this.analyser.getByteTimeDomainData(data);
                let sum = 0;
                for (let i = 0; i < data.length; i++) {
                    const v = (data[i] - 128) / 128;
                    sum += v * v;
                }
                const rms = Math.sqrt(sum / data.length);
                if (this.state === "speaking" && rms > threshold) {
                    this.bargeIn();
                }
                this.monitorRAF = requestAnimationFrame(monitor);
            };
            this.monitorRAF = requestAnimationFrame(monitor);
        }
        catch (error) {
            dbg("barge-in unavailable");
        }
    }
    bargeIn() {
        this.abortAudio();
        if (this.streamAbortController) {
            this.streamAbortController.abort();
            this.streamAbortController = null;
        }
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: "interrupt" }));
        }
        this.setState("listening");
    }
    endSpeech() {
        this.speechEndTimestamp = performance.now();
        this.llmStartTimestamp = performance.now();
        this.firstTokenTimestamp = 0;
        this.ttsStartTimestamp = 0;
        this.setState("thinking");
        this.ws?.send(JSON.stringify({ type: "end_speech" }));
    }
    stop() {
        this.manualStop = true;
        if (this.monitorRAF)
            cancelAnimationFrame(this.monitorRAF);
        this.monitorRAF = null;
        this.analyser = null;
        this.abortAudio();
        try {
            this.recorder?.stop();
        }
        catch (error) { }
        this.media?.getTracks().forEach((t) => t.stop());
        try {
            this.ws?.close();
        }
        catch (error) { }
        this.recorder = null;
        this.media = null;
        this.ws = null;
        this.setState("idle");
    }
    async onMessage(ev) {
        if (ev.data instanceof ArrayBuffer) {
            if (!this.firstTokenTimestamp)
                this.firstTokenTimestamp = performance.now();
            if (!this.ttsStartTimestamp)
                this.ttsStartTimestamp = performance.now();
            this.enqueueAudio(ev.data);
            return;
        }
        if (typeof ev.data !== "string")
            return;
        let msg = {};
        try {
            msg = JSON.parse(ev.data);
        }
        catch (error) {
            return;
        }
        if (typeof msg.eventId === "string") {
            if (this.seenEvents.has(msg.eventId))
                return;
            this.seenEvents.add(msg.eventId);
        }
        switch (msg.type) {
            case "ready":
                if (typeof msg.sessionId === "string")
                    this.sessionId = msg.sessionId;
                break;
            case "transcript":
                if (!this.firstTokenTimestamp)
                    this.firstTokenTimestamp = performance.now();
                this.cb.onTranscript?.(String(msg.text ?? ""), !!msg.final);
                break;
            case "feedback_text":
                this.cb.onFeedback?.({
                    feedback: String(msg.feedback ?? ""),
                    score: Number(msg.score ?? 0),
                    question: String(msg.question ?? ""),
                    signal: String(msg.signal ?? ""),
                    finished: !!msg.finished,
                });
                break;
            case "error":
                this.fail(String(msg.message ?? "Erreur serveur."));
                break;
        }
    }
    ensureCtx() {
        if (!this.audioCtx) {
            const Ctor = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new Ctor();
        }
        return this.audioCtx;
    }
    enqueueAudio(buf) {
        this.audioQueue.push(buf);
        void this.drainQueue();
    }
    async drainQueue() {
        if (this.playing)
            return;
        this.playing = true;
        try {
            while (this.audioQueue.length > 0) {
                const buf = this.audioQueue.shift();
                await this.playOne(buf);
            }
        }
        finally {
            this.playing = false;
            if (this.state === "speaking")
                this.setState("listening");
        }
    }
    async playOne(buf) {
        try {
            const ctx = this.ensureCtx();
            if (ctx.state === "suspended")
                await ctx.resume().catch(() => { });
            this.setState("speaking");
            const decoded = await ctx.decodeAudioData(buf.slice(0));
            await new Promise((resolve) => {
                const src = ctx.createBufferSource();
                this.currentSource = src;
                src.buffer = decoded;
                src.connect(ctx.destination);
                src.onended = () => {
                    if (this.currentSource === src)
                        this.currentSource = null;
                    resolve();
                };
                this.audioPlayStartTimestamp = performance.now();
                console.log("[AUDIO_RTT]", {
                    total: this.audioPlayStartTimestamp - this.speechEndTimestamp,
                    llm: this.firstTokenTimestamp - this.llmStartTimestamp,
                    tts: this.audioPlayStartTimestamp - this.ttsStartTimestamp,
                });
                src.start();
            });
        }
        catch (error) {
            dbg("playback skipped");
        }
    }
    abortAudio() {
        this.audioQueue = [];
        try {
            this.currentSource?.stop();
        }
        catch (error) { }
        this.currentSource = null;
        this.playing = false;
    }
    /**
     * Premium Streaming Pipeline: LLM Stream -> Sentence Chunking -> TTS Stream.
     * Optimizes TTFP (Time To First Phoneme) by not waiting for the full LLM response.
     */
    async processPremiumAudio(transcript, context) {
        this.streamAbortController = new AbortController();
        try {
            this.llmStartTimestamp = performance.now();
            const response = await fetch("/api/ai/stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript, context }),
                signal: this.streamAbortController.signal,
            });
            if (!response.ok)
                throw new Error("Stream LLM failed");
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";
            let tokenCount = 0;
            while (reader) {
                const { value, done } = await reader.read();
                if (done)
                    break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n\n");
                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            const token = data.text;
                            if (!token)
                                continue;
                            if (!this.firstTokenTimestamp)
                                this.firstTokenTimestamp = performance.now();
                            accumulatedText += token;
                            tokenCount++;
                            // TRIGGER: Play audio if sentence ends OR if we have a minimum of 12 tokens
                            if (/[.!?]/.test(token) || tokenCount >= 12) {
                                const sentence = accumulatedText.trim();
                                if (sentence) {
                                    this.ttsStartTimestamp = performance.now();
                                    this.sendToTTS(sentence);
                                }
                                accumulatedText = "";
                                tokenCount = 0;
                            }
                        }
                        catch (error) {
                            dbg("Error parsing SSE token", e);
                        }
                    }
                }
            }
        }
        catch (error) {
            if (error.name === 'AbortError') {
                dbg("LLM Stream aborted by barge-in");
            }
            else {
                dbg("Premium Pipeline Error", error);
                this.fail("Erreur lors de la génération de la réponse.");
            }
        }
    }
    async sendToTTS(text) {
        try {
            const res = await fetch("/api/ai/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ textChunk: text }),
            });
            if (!res.ok)
                throw new Error("TTS failed");
            const audioBuffer = await res.arrayBuffer();
            this.enqueueAudio(audioBuffer);
        }
        catch (error) {
            dbg("TTS Error", error);
        }
    }
}
//# sourceMappingURL=client.js.map