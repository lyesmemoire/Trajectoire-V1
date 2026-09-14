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
    } catch (err: unknown) {
      setVoiceState("error");
      console.error("[voice] microphone start failed", {
        name: err instanceof DOMException ? err.name : undefined,
        message: err instanceof Error ? err.message : String(err),
      });

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        onError?.("Le microphone n'est pas disponible dans ce navigateur ou ce contexte.");
      } else if (err instanceof DOMException && err.name === "NotAllowedError") {
        onError?.("Accès au microphone refusé. Autorisez le microphone dans votre navigateur.");
      } else if (err instanceof DOMException && err.name === "NotFoundError") {
        onError?.("Aucun microphone détecté.");
      } else {
        onError?.("Impossible de démarrer le microphone. Consultez la console pour le diagnostic.");
      }
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

  // WebAudio TTS
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextPlaybackTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const ttsAbortControllerRef = useRef<AbortController | null>(null);

  // ── TTS STREAMING ───────────────────────────────────────────────────────────
  const speakText = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      // Stop any existing playback
      cancelSpeaking();

      setVoiceState("speaking");
      metricsRef.current.ttsRequestStartedAt = performance.now();
      metricsRef.current.ttsFirstByteAt = undefined;
      metricsRef.current.audioPlaybackStartedAt = undefined;

      const abortController = new AbortController();
      ttsAbortControllerRef.current = abortController;

      try {
        const res = await fetch("/api/interview/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: abortController.signal,
        });

        if (!res.ok) throw new Error("Erreur TTS");
        if (!res.body) throw new Error("No response body");

        // Initialize AudioContext if needed
        if (!audioContextRef.current || audioContextRef.current.state === "closed") {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const audioCtx = audioContextRef.current;
        if (audioCtx.state === "suspended") await audioCtx.resume();

        nextPlaybackTimeRef.current = audioCtx.currentTime;

        const reader = res.body.getReader();
        let firstByteRecorded = false;
        let playbackStarted = false;
        let leftoverByte: number | null = null;

        while (true) {
          const { done, value } = await reader.read();

          if (!firstByteRecorded && value && value.byteLength > 0) {
            firstByteRecorded = true;
            metricsRef.current.ttsFirstByteAt = performance.now();
          }

          if (done) break;

          // Process chunks (16-bit PCM little-endian)
          let bufferToProcess = value;
          if (leftoverByte !== null) {
            bufferToProcess = new Uint8Array(value.byteLength + 1);
            bufferToProcess[0] = leftoverByte;
            bufferToProcess.set(value, 1);
            leftoverByte = null;
          }

          if (bufferToProcess.byteLength % 2 !== 0) {
            leftoverByte = bufferToProcess[bufferToProcess.byteLength - 1]!;
            bufferToProcess = bufferToProcess.slice(0, -1);
          }

          if (bufferToProcess.byteLength > 0) {
            const length = bufferToProcess.byteLength / 2;
            const float32 = new Float32Array(length);
            const dataView = new DataView(bufferToProcess.buffer, bufferToProcess.byteOffset, bufferToProcess.byteLength);

            for (let i = 0; i < length; i++) {
              const int16 = dataView.getInt16(i * 2, true);
              float32[i] = int16 < 0 ? int16 / 32768 : int16 / 32767;
            }

            const audioBuffer = audioCtx.createBuffer(1, length, 24000);
            audioBuffer.getChannelData(0).set(float32);

            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);

            const startAt = Math.max(audioCtx.currentTime, nextPlaybackTimeRef.current);

            // Record playback start before source.start() — one time only for the first chunk
            if (!playbackStarted) {
              playbackStarted = true;
              // audioPlaybackStartedAt = wall-clock time when the first audio sample is scheduled
              metricsRef.current.audioPlaybackStartedAt =
                performance.now() + (startAt - audioCtx.currentTime) * 1000;

              if (process.env.NODE_ENV === "development") {
                source.onended = () => {
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
                    brainLatencyMs: Math.round(
                      (m.brainResponseAt ?? m.ttsRequestStartedAt ?? 0) - (m.brainRequestStartedAt ?? 0)
                    ),
                    ttsFirstByteMs: Math.round((m.ttsFirstByteAt ?? 0) - (m.ttsRequestStartedAt ?? 0)),
                    endToAudioMs: Math.round((m.audioPlaybackStartedAt ?? 0) - (m.speechEndedAt ?? 0)),
                  };
                  console.debug("[VoiceLatency] Full turn metrics:", metrics);
                };
              }
            }

            source.start(startAt);

            nextPlaybackTimeRef.current = startAt + audioBuffer.duration;
            activeSourcesRef.current.push(source);

            source.addEventListener("ended", () => {
              activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
              if (activeSourcesRef.current.length === 0 && voiceState === "speaking") {
                setVoiceState("idle");
              }
            });
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // Normal cancellation
          return;
        }
        setVoiceState("error");
        onError?.(err instanceof Error ? err.message : "Synthèse vocale indisponible.");
      }
    },
    [voiceState, onError, cancelSpeaking]
  );

  const markBrainResponse = useCallback(() => {
    metricsRef.current.brainResponseAt = performance.now();
  }, []);

  function cancelSpeaking() {
    if (ttsAbortControllerRef.current) {
      ttsAbortControllerRef.current.abort();
      ttsAbortControllerRef.current = null;
    }

    activeSourcesRef.current.forEach((source) => {
      try { source.stop(); } catch (e) {}
    });
    activeSourcesRef.current = [];
    nextPlaybackTimeRef.current = 0;

    setVoiceState("idle");
  }

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
