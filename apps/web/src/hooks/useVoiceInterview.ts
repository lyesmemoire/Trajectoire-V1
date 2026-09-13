"use client";

import { useState, useRef, useCallback } from "react";

export type VoiceState =
  | "idle"
  | "recording"
  | "transcribing"
  | "speaking"
  | "error";

export interface UseVoiceInterviewOptions {
  /** Called with the final transcribed text so the parent can submit it. */
  onTranscript: (text: string) => void;
  /** Called when a voice error occurs — text mode is unaffected. */
  onError?: (message: string) => void;
}

/**
 * useVoiceInterview
 *
 * Minimal hook that wires the browser microphone to the interview brain.
 *
 * Flow:
 *   1. startRecording()  — captures microphone via MediaRecorder
 *   2. stopRecording()   — sends audio blob to /api/interview/transcribe (STT)
 *   3. Calls onTranscript(text) — parent submits to /api/simulation/message
 *   4. speakText(text)   — converts brain response to audio via /api/interview/speak (TTS)
 *
 * Constraints:
 * - No API key is ever sent to or from the client.
 * - If STT/TTS fails (e.g. key not configured), the error is surfaced via onError;
 *   text mode remains fully functional.
 */
export function useVoiceInterview({
  onTranscript,
  onError,
}: UseVoiceInterviewOptions) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");

  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── RECORDING ──────────────────────────────────────────────────────────────

  const startRecording = useCallback(async () => {
    if (voiceState === "recording") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Prefer audio/webm (Chrome/Firefox); fall back to browser default
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

      const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.start();
      mediaRecRef.current = rec;
      setVoiceState("recording");
    } catch {
      setVoiceState("error");
      onError?.("Microphone inaccessible. Vérifiez les permissions.");
    }
  }, [voiceState, onError]);

  const stopRecording = useCallback(() => {
    const rec = mediaRecRef.current;
    if (!rec || rec.state === "inactive") return;

    setVoiceState("transcribing");

    rec.onstop = async () => {
      // Stop all mic tracks to release the device
      streamRef.current?.getTracks().forEach((t) => t.stop());

      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", blob, "recording.webm");

      try {
        const res = await fetch("/api/interview/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            data.error ?? `Erreur transcription (HTTP ${res.status})`
          );
        }

        const { text } = await res.json();

        if (!text?.trim()) {
          throw new Error("Audio inaudible ou trop court.");
        }

        setVoiceState("idle");
        onTranscript(text.trim());
      } catch (err: unknown) {
        setVoiceState("error");
        onError?.(
          err instanceof Error ? err.message : "Erreur de transcription."
        );
      }
    };

    rec.stop();
  }, [onTranscript, onError]);

  // ── TTS ────────────────────────────────────────────────────────────────────

  const speakText = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setVoiceState("speaking");

      try {
        const res = await fetch("/api/interview/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            data.error ?? `Erreur TTS (HTTP ${res.status})`
          );
        }

        const arrayBuffer = await res.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          URL.revokeObjectURL(url);
          setVoiceState("idle");
        };

        audio.onerror = () => {
          URL.revokeObjectURL(url);
          setVoiceState("error");
          onError?.("Erreur de lecture audio.");
        };

        await audio.play();
      } catch (err: unknown) {
        // TTS failure is non-blocking — text is still visible
        setVoiceState("error");
        onError?.(
          err instanceof Error ? err.message : "Synthèse vocale indisponible."
        );
      }
    },
    [onError]
  );

  const cancelSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setVoiceState("idle");
  }, []);

  return {
    voiceState,
    startRecording,
    stopRecording,
    speakText,
    cancelSpeaking,
    isRecording: voiceState === "recording",
    isSpeaking: voiceState === "speaking",
    isTranscribing: voiceState === "transcribing",
  };
}
