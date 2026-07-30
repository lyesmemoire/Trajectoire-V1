// lib/realtime/useAudioPlayback.ts
// Hook to handle real‑time PCM16 audio chunks received via WebSocket.
// It buffers a few chunks before starting playback, converts Int16 PCM to Float32
// (range -1..1), and schedules them on an AudioContext using source.onended for
// precise timing. On interruption it resets the AudioContext and clears the queue.

import { useEffect, useRef, useState } from "react";

/** Minimum number of PCM16 chunks to buffer before starting playback.
 *  This helps avoid gaps when network jitter occurs.
 */
const MIN_CHUNKS_BEFORE_PLAY = 3;

// PCM16 audio parameters – enforced by the backend.
const SAMPLE_RATE = 16000; // Hz
const CHANNELS = 1; // mono

/** Convert a Uint8Array (raw PCM16 little‑endian) to a Float32Array suitable for AudioContext. */
function pcm16ToFloat32(pcm: Uint8Array): Float32Array {
  const dataView = new DataView(pcm.buffer, pcm.byteOffset, pcm.byteLength);
  const samples = pcm.byteLength / 2; // 2 bytes per sample
  const float32 = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    const int16 = dataView.getInt16(i * 2, true); // little‑endian
    float32[i] = int16 / 0x8000; // convert to -1..1 range
  }
  return float32;
}

/** Hook returns a callback to feed incoming audio chunks and a flag indicating playback state. */
export function useAudioPlayback() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const queueRef = useRef<Uint8Array[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  // Track all active audio buffer sources for proper interruption handling.
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Fade configuration - 32 samples at 16kHz ~ 2 ms.
  const FADE_SAMPLES = 32;
  // Simple linear fade-in/out for a Float32Array buffer.
  const applyFade = (buffer: Float32Array): Float32Array => {
    const len = buffer.length;
    const fadeLen = Math.min(FADE_SAMPLES, len);
    // Fade-in
    for (let i = 0; i < fadeLen; i++) {
      buffer[i] = (buffer[i] ?? 0) * (i / fadeLen);
    }
    // Fade‑out
    for (let i = len - fadeLen; i < len; i++) {
      buffer[i] = (buffer[i] ?? 0) * ((len - i) / fadeLen);
    }
    return buffer;
  };
  // Ensure a single AudioContext throughout the component lifecycle.
  useEffect(() => {
    audioCtxRef.current = new (
      window.AudioContext || (window  as any).webkitAudioContext
    )({
      sampleRate: SAMPLE_RATE,
    });
    return () => {
      // Cleanup on unmount – stop all sources and close context.
      activeSourcesRef.current.forEach((src) => {
        try {
          src.stop();
        } catch {}
        src.disconnect();
      });
      activeSourcesRef.current.clear();
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
    };
  }, []);

  /** Reset playback on interruption – clears buffer and stops any pending sources. */
  const reset = () => {
    // Stop all active sources.
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {}
      src.disconnect();
    });
    activeSourcesRef.current.clear();
    queueRef.current = [];
    setIsPlaying(false);
  };

  /** Schedule the next buffered chunk for playback. */
  const scheduleNext = () => {
    if (!audioCtxRef.current) return;
    if (queueRef.current.length === 0) {
      setIsPlaying(false);
      return;
    }
    // Resume context if it was suspended (e.g., due to user interaction requirements).
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    const chunk = queueRef.current.shift()!; // non‑empty guarantee
    let float32 = pcm16ToFloat32(chunk);
    // Apply fade to smooth edges.
    float32 = applyFade(float32);
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const audioBuffer = ctx.createBuffer(CHANNELS, float32.length, SAMPLE_RATE);
    audioBuffer.getChannelData(0).set(float32);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.onended = () => {
      // Remove from active set.
      activeSourcesRef.current.delete(source);
      scheduleNext();
    };
    // Track active source.
    activeSourcesRef.current.add(source);
    source.start();
    setIsPlaying(true);
  };

  /** Public callback – feed a raw PCM16 Uint8Array chunk received from WS. */
  const onAudioChunk = (chunk: Uint8Array) => {
    // Caller may invoke reset() on interruption; we simply enqueue.
    queueRef.current.push(chunk);
    // Start playback when buffered enough and not already playing.
    if (!isPlaying && queueRef.current.length >= MIN_CHUNKS_BEFORE_PLAY) {
      scheduleNext();
    }
  };

  return { onAudioChunk, reset, isPlaying };
}
