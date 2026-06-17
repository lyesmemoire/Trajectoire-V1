"use client";

import { useEffect, useRef, useState } from "react";
import { RealtimeWebSocketClient } from "@/lib/realtime/websocketClient";
import { MicrophoneCapture } from "@/lib/realtime/microphone";
import { float32ToPCM16 } from "@/lib/realtime/pcmEncoder";
import { useAudioPlayback } from "@/lib/realtime/useAudioPlayback";
import { useTranscriptStore } from "@/lib/realtime/transcriptStore";

export default function RealtimeDebugPage() {
  const [aiResponse, setAiResponse] = useState("");
  const [metrics, setMetrics] = useState({
    wsRttMs: 0,
    deepgramRttMs: 0,
    aiFirstTokenMs: 0,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const wsClientRef = useRef<RealtimeWebSocketClient | null>(null);
  const micRef = useRef<MicrophoneCapture | null>(null);
  const transcripts = useTranscriptStore((state) => state.transcripts);
  const clearTranscripts = useTranscriptStore((state) => state.clear);

  const lastTranscriptFinalAt = useRef(0);
  const aiStarted = useRef(false);
  const lastAudioSentAt = useRef(0);

  // Ping RTT interval
  useEffect(() => {
    const interval = setInterval(() => {
      wsClientRef.current?.ping();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      wsClientRef.current?.disconnect();
      micRef.current?.stop();
    };
  }, []);

  // Audio playback hook
  const {
    onAudioChunk,
    reset: resetAudio,
    isPlaying: isAudioPlaying,
  } = useAudioPlayback();

  // Auto‑scroll transcript list
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts]);

  const handleStart = async () => {
    clearTranscripts();
    const sessionId = Math.random().toString(36).substring(7);
    const wsUrl = "ws://localhost:3000/api/signal";
    const ws = new RealtimeWebSocketClient(wsUrl, sessionId);
    wsClientRef.current = ws;

    ws.onOpen = () => setIsConnected(true);
    ws.onClose = () => setIsConnected(false);
    ws.onTranscript = (msg) => {
      useTranscriptStore.getState().addTranscript(msg);
    };
    ws.onMessage = (msg) => {
      if (msg.type === "transcript" && msg.payload.isFinal) {
        lastTranscriptFinalAt.current = performance.now();
        aiStarted.current = false;
        setAiResponse("");
        setMetrics((prev) => ({
          ...prev,
          deepgramRttMs: performance.now() - lastAudioSentAt.current,
        }));
      }
      if (msg.type === "ai_text") {
        if (!aiStarted.current) {
          aiStarted.current = true;
          resetAudio();
          setMetrics((prev) => ({
            ...prev,
            aiFirstTokenMs: performance.now() - lastTranscriptFinalAt.current,
          }));
        }
        setAiResponse((prev) => prev + msg.payload);
      }
    };
    ws.onAudioChunk = (chunk) => {
      onAudioChunk(chunk);
    };
    ws.onPong = (rtt) => {
      setMetrics((prev) => ({ ...prev, wsRttMs: rtt }));
    };
    ws.connect();

    // Start microphone capture
    const mic = new MicrophoneCapture();
    micRef.current = mic;
    mic.onAudioData = (float32Array) => {
      const pcm16Bytes = float32ToPCM16(float32Array);
      lastAudioSentAt.current = performance.now();
      ws.sendPCM(pcm16Bytes);
    };
    await mic.start();
    setIsRecording(true);
  };

  const handleStop = () => {
    wsClientRef.current?.disconnect();
    micRef.current?.stop();
    resetAudio();
    setIsConnected(false);
    setIsRecording(false);
  };

  // Helper for status pills
  const statusPill = (label: string, variant: string, active: boolean) => (
    <span
      className={`rt-pill rt-pill-${variant} ${active ? "" : "rt-pill-muted"}`}
    >
      {label}
    </span>
  );

  return (
    <div className="rt-page">
      <div className="rt-container">
        <h1 className="rt-header">Realtime Pipeline Debug</h1>
        <p className="rt-subheader">
          Milestone 2 — Live PCM Streaming &amp; Transcription validation.
        </p>
        <div className="rt-status-pills rt-grid">
          {statusPill("WS Connected", "primary", isConnected)}
          {statusPill("Listening", "primary", isRecording)}
          {statusPill("AI Speaking", "speaking", isAudioPlaying)}
          {statusPill("Interrupted", "error", false)}
        </div>
        <div className="rt-grid">
          {!isRecording ? (
            <button
              onClick={handleStart}
              className="rt-button rt-button-primary"
            >
              Start Capture &amp; Streaming
            </button>
          ) : (
            <button onClick={handleStop} className="rt-button rt-button-danger">
              Stop Capture
            </button>
          )}
        </div>
        <div className="rt-panel">
          <h2 className="rt-panel-title">Live Transcripts</h2>
          <div className="rt-transcript-list">
            {transcripts.map((t) => (
              <p
                key={t.id}
                className={`rt-transcript-item ${t.isFinal ? "rt-transcript-final" : "rt-transcript-interim"}`}
              >
                {t.text}
              </p>
            ))}
            {transcripts.length === 0 && (
              <p className="rt-transcript-empty">Waiting for speech...</p>
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>
        <div className="rt-panel">
          <h2 className="rt-panel-title">AI Response</h2>
          <div
            className={`rt-ai-response ${isAudioPlaying ? "rt-speaking" : ""}`}
          >
            {aiResponse || "Waiting for AI response..."}
          </div>
        </div>
        <div className="rt-panel">
          <h2 className="rt-panel-title">Latency Metrics</h2>
          <div className="rt-grid">
            <div className="rt-card">
              <div className="rt-metric-label">WS RTT</div>
              <div className="rt-metric-value">
                {metrics.wsRttMs.toFixed(0)} ms
              </div>
            </div>
            <div className="rt-card">
              <div className="rt-metric-label">Deepgram RTT</div>
              <div className="rt-metric-value">
                {metrics.deepgramRttMs.toFixed(0)} ms
              </div>
            </div>
            <div className="rt-card">
              <div className="rt-metric-label">AI First Token</div>
              <div className="rt-metric-value">
                {metrics.aiFirstTokenMs.toFixed(0)} ms
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
