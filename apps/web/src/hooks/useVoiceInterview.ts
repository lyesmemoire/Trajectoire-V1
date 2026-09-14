"use client";

import { useState, useRef, useCallback } from "react";

export type VoiceState =
  | "idle"
  | "connecting"
  | "recording"
  | "transcribing"
  | "speaking"
  | "error";

export interface UseVoiceInterviewOptions {
  onTranscript: (text: string) => void;
  onPartialTranscript?: (text: string) => void;
  onError?: (message: string) => void;
}

export interface VoiceLatencyMetrics {
  speechStartedAt: number;
  speechEndedAt: number;
  transcriptFinalAt: number;
  brainRequestStartedAt: number;
  brainResponseAt: number;
  ttsRequestStartedAt: number;
  ttsFirstByteAt: number;
  audioPlaybackStartedAt: number;
  sttFinalizeMs: number;
  brainLatencyMs: number;
  ttsFirstByteMs: number;
  endToAudioMs: number;
}

export function useVoiceInterview({
  onTranscript,
  onPartialTranscript,
  onError,
}: UseVoiceInterviewOptions) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");

  // WebRTC
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Fallback MediaRecorder
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isWebRTCReady = useRef(false);

  // Dedup logic (one final submission per turn/item)
  const transcriptSentRef = useRef(false);
  const submittedTranscriptItems = useRef(new Set<string>());

  // Partial transcript accumulator
  const partialTextRef = useRef("");

  // Playback (TTS)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Telemetry
  const metricsRef = useRef<Partial<VoiceLatencyMetrics>>({});

  // ── RECORDING ───────────────────────────────────────────────────────────────

  const startRecording = useCallback(async () => {
    if (voiceState === "recording" || voiceState === "connecting") return;

    setVoiceState("connecting");
    transcriptSentRef.current = false;
    partialTextRef.current = "";
    isWebRTCReady.current = false;
    metricsRef.current = { speechStartedAt: performance.now() };

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // ── Fallback MediaRecorder ──
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

      // ── WebRTC Setup ──
      try {
        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        pc.addTrack(stream.getTracks()[0]!, stream);

        const dc = pc.createDataChannel("oai-events");
        dcRef.current = dc;

        dc.addEventListener("open", () => {
          isWebRTCReady.current = true;
          // Trigger transcription on server via config if needed,
          // though OpenAI will detect speech automatically and emit input_audio_transcription events.
        });

        dc.addEventListener("message", (e) => {
          const event = JSON.parse(e.data);

          if (event.type === "conversation.item.input_audio_transcription.delta") {
            partialTextRef.current += event.delta;
            if (onPartialTranscript) onPartialTranscript(partialTextRef.current);
          } else if (event.type === "conversation.item.input_audio_transcription.completed") {
            const itemId = event.item_id;

            // Deduplicate to avoid multiple submissions for the same audio item
            if (itemId && submittedTranscriptItems.current.has(itemId)) return;
            if (itemId) submittedTranscriptItems.current.add(itemId);

            const final = event.transcript || partialTextRef.current;
            if (!transcriptSentRef.current) {
              transcriptSentRef.current = true;
              metricsRef.current.transcriptFinalAt = performance.now();
              if (process.env.NODE_ENV === "development") {
                const m = metricsRef.current;
                console.debug("[VoiceLatency] STT finalize (WebRTC Live):", {
                  sttFinalizeMs: Math.round(
                    (m.transcriptFinalAt ?? 0) - (m.speechEndedAt ?? 0)
                  ),
                });
              }
              setVoiceState("idle");
              onTranscript(final);
            }
          }
        });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Fetch ephemeral token from our server route
        const resToken = await fetch("/api/interview/realtime-transcription", {
          method: "POST",
        });
        if (!resToken.ok) throw new Error("Erreur token WebRTC");
        const { client_secret } = await resToken.json();

        // Send SDP to OpenAI Live API
        const baseUrl = "https://api.openai.com/v1/realtime"; // NOTE: While route used /live/sessions, SDP exchange is on /v1/realtime
        const model = "gpt-live-transcribe"; // or simply whatever the API dictates
        const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${client_secret}`,
            "Content-Type": "application/sdp",
          },
        });

        if (!sdpResponse.ok) throw new Error("Erreur OpenAI WebRTC");

        const answer = { type: "answer" as RTCSdpType, sdp: await sdpResponse.text() };
        await pc.setRemoteDescription(answer);

      } catch (webrtcError) {
        console.warn("WebRTC live transcription failed, relying on fallback.", webrtcError);
        isWebRTCReady.current = false;
      }

      setVoiceState("recording");
    } catch {
      setVoiceState("error");
      onError?.("Microphone inaccessible. Vérifiez les permissions.");
    }
  }, [voiceState, onError, onPartialTranscript, onTranscript]);

  const stopRecording = useCallback(() => {
    if (voiceState !== "recording") return;

    metricsRef.current.speechEndedAt = performance.now();
    setVoiceState("transcribing");

    // Commit WebRTC buffer if active
    if (isWebRTCReady.current && dcRef.current?.readyState === "open") {
      dcRef.current.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
      // CRITICAL: We DO NOT send response.create because we do NOT want the assistant to generate text.
      // We solely rely on input_audio_transcription.completed which fires automatically after commit.
    }

    const rec = mediaRecRef.current;
    if (!rec || rec.state === "inactive") return;

    rec.onstop = async () => {
      // Release mic
      streamRef.current?.getTracks().forEach((t) => t.stop());

      // If WebRTC is handling it, we wait for input_audio_transcription.completed
      // We set a timeout: if WebRTC doesn't finalize in 5s, we fallback to standard API.
      const fallbackTimeout = setTimeout(async () => {
        if (transcriptSentRef.current) return;

        console.warn("WebRTC timeout, using fallback MediaRecorder STT.");
        try {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("file", blob, "recording.webm");

          metricsRef.current.brainRequestStartedAt = performance.now();
          const res = await fetch("/api/interview/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error("Erreur fallback transcription");
          const { text } = await res.json();

          metricsRef.current.transcriptFinalAt = performance.now();

          if (text?.trim() && !transcriptSentRef.current) {
            transcriptSentRef.current = true;
            setVoiceState("idle");
            onTranscript(text.trim());
          }
        } catch (err: unknown) {
          if (!transcriptSentRef.current) {
            setVoiceState("error");
            onError?.(err instanceof Error ? err.message : "Erreur transcription.");
          }
        }
      }, isWebRTCReady.current ? 5000 : 0);
    };

    rec.stop();

    // Clean up WebRTC after a delay to ensure transcript arrives
    setTimeout(() => {
      pcRef.current?.close();
      pcRef.current = null;
      dcRef.current = null;
    }, 10000);

  }, [voiceState, onTranscript, onError]);

  // ── TTS ─────────────────────────────────────────────────────────────────────
  const speakText = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setVoiceState("speaking");
      metricsRef.current.ttsRequestStartedAt = performance.now();

      try {
        const res = await fetch("/api/interview/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) throw new Error("Erreur TTS");

        metricsRef.current.ttsFirstByteAt = performance.now();

        const arrayBuffer = await res.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onplay = () => {
          metricsRef.current.audioPlaybackStartedAt = performance.now();

          if (process.env.NODE_ENV === "development") {
            const m = metricsRef.current;
            const metrics: VoiceLatencyMetrics = {
              speechStartedAt: m.speechStartedAt ?? 0,
              speechEndedAt: m.speechEndedAt ?? 0,
              transcriptFinalAt: m.transcriptFinalAt ?? 0,
              brainRequestStartedAt: m.brainRequestStartedAt ?? 0,
              brainResponseAt: m.brainResponseAt ?? 0,
              ttsRequestStartedAt: m.ttsRequestStartedAt ?? 0,
              ttsFirstByteAt: m.ttsFirstByteAt ?? 0,
              audioPlaybackStartedAt: m.audioPlaybackStartedAt ?? 0,
              sttFinalizeMs: Math.round((m.transcriptFinalAt ?? 0) - (m.speechEndedAt ?? 0)),
              brainLatencyMs: Math.round((m.brainResponseAt ?? m.ttsRequestStartedAt ?? 0) - (m.brainRequestStartedAt ?? 0)),
              ttsFirstByteMs: Math.round((m.ttsFirstByteAt ?? 0) - (m.ttsRequestStartedAt ?? 0)),
              endToAudioMs: Math.round((m.audioPlaybackStartedAt ?? 0) - (m.speechEndedAt ?? 0)),
            };
            console.debug("[VoiceLatency] Full turn metrics:", metrics);
          }
        };

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
        setVoiceState("error");
        onError?.(err instanceof Error ? err.message : "Synthèse vocale indisponible.");
      }
    },
    [onError]
  );

  const markBrainResponse = useCallback(() => {
    metricsRef.current.brainResponseAt = performance.now();
  }, []);

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
    markBrainResponse,
    isRecording: voiceState === "recording",
    isSpeaking: voiceState === "speaking",
    isTranscribing: voiceState === "transcribing",
  };
}
