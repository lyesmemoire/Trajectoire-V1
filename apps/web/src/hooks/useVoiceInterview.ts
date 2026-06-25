"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { createLogger } from "@/lib/logger"

const logger = createLogger({ component: "useVoiceInterview" });

export type InterviewState =
  | "connecting"
  | "ai_speaking"
  | "user_speaking"
  | "processing"
  | "finished"
  | "error"

export type VoiceConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

export type VoiceInterviewError =
  | "MIC_DENIED"
  | "MIC_NOT_FOUND"
  | "WORKLET_UNSUPPORTED"
  | "WS_FAILED"
  | "WS_TIMEOUT"
  | "RECONNECT_EXHAUSTED"
  | null;

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_BASE_DELAY_MS = 1000;

export function useVoiceInterview(wsUrl: string, token: string) {
  // Existing business states
  const [state, setState] = useState<InterviewState>("connecting")
  const [transcript, setTranscript] = useState("")
  const processedEvents = useRef<Set<string>>(new Set())

  // New infrastructure states
  const [connectionStatus, setConnectionStatus] = useState<VoiceConnectionStatus>("idle");
  const [error, setError] = useState<VoiceInterviewError>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const workletNodeRef = useRef<AudioWorkletNode | null>(null)
  const playbackSourceRef = useRef<AudioBufferSourceNode | null>(null)

  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 🔊 Lecture TTS optimisée
  const playAudioBuffer = useCallback(async (arrayBuffer: ArrayBuffer) => {
    if (!audioContextRef.current || audioContextRef.current.state === "closed") return

    try {
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer.slice(0))
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContextRef.current.destination)

      playbackSourceRef.current = source
      setState("ai_speaking")

      source.start()

      source.onended = () => {
        setState("user_speaking")
      }
    } catch (e) {
      logger.error({ error: e }, "Erreur lecture audio");
    }
  }, [])

  async function requestMicAccess(): Promise<MediaStream | null> {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
    } catch (err) {
      if (err instanceof DOMException) {
        setError(
          err.name === "NotAllowedError" ? "MIC_DENIED" :
          err.name === "NotFoundError"   ? "MIC_NOT_FOUND" :
          "WS_FAILED"
        );
      } else {
        setError("WS_FAILED");
      }
      setState("error");
      return null;
    }
  }

  async function initAudio(
    stream: MediaStream,
    audioCtx: AudioContext,
    ws: WebSocket
  ): Promise<boolean> {
    const source = audioCtx.createMediaStreamSource(stream);

    // Tentative AudioWorklet (moderne — Chrome, Edge, Firefox récent)
    if (typeof AudioWorkletNode !== "undefined") {
      try {
        await audioCtx.audioWorklet.addModule("/audio-processor.js");
        const workletNode = new AudioWorkletNode(audioCtx, "pcm-processor");

        workletNode.port.onmessage = (event) => {
          if (ws.readyState === WebSocket.OPEN && state === "user_speaking") {
            ws.send(event.data);
          }
        };

        source.connect(workletNode);
        workletNodeRef.current = workletNode;
        return true;
      } catch (workletErr) {
        logger.warn({ error: workletErr }, "AudioWorklet échoué, fallback ScriptProcessor");
      }
    }

    // Fallback ScriptProcessor (déprécié mais support universel)
    try {
      const scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
      scriptProcessor.onaudioprocess = (event) => {
        if (ws.readyState === WebSocket.OPEN && state === "user_speaking") {
          const pcmData = event.inputBuffer.getChannelData(0);
          ws.send(pcmData.buffer.slice(0));
        }
      };
      source.connect(scriptProcessor);
      scriptProcessor.connect(audioCtx.destination);
      return true;
    } catch (fallbackErr) {
      logger.error({ error: fallbackErr }, "ScriptProcessor aussi échoué");
      setError("WORKLET_UNSUPPORTED");
      setState("error");
      return false;
    }
  }

  // 🎤 Démarrage micro
  const startMicrophone = useCallback(async (ws: WebSocket) => {
    const stream = await requestMicAccess();
    if (!stream) return;

    mediaStreamRef.current = stream;

    const audioContext = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioContext;

    await initAudio(stream, audioContext, ws);
  }, [state])

  // 🧠 Stop user speech
  const stopSpeaking = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "end_speech" }))
      setState("processing")
    }
  }, [])

  // 🛑 Interrupt AI
  const interruptAI = useCallback(() => {
    if (playbackSourceRef.current) {
      playbackSourceRef.current.stop()
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "interrupt" }))
    }
    setState("user_speaking")
  }, [])

  const connectWebSocket = useCallback(() => {
    if (!wsUrl || !token) return;

    // Si on a déjà épuisé les reconnexions, on ne fait rien
    if (reconnectAttemptRef.current > MAX_RECONNECT_ATTEMPTS) {
      return;
    }

    if (reconnectAttemptRef.current === 0) {
      setConnectionStatus("connecting");
    }

    const ws = new WebSocket(wsUrl)
    ws.binaryType = "arraybuffer"
    wsRef.current = ws

    ws.onopen = () => {
      reconnectAttemptRef.current = 0;
      setReconnectAttempt(0);
      setConnectionStatus("connected");
      setError(null);
      
      setState("user_speaking")
      startMicrophone(ws)
    }

    ws.onmessage = async (event) => {
      if (typeof event.data === "string") {
        const data = JSON.parse(event.data)

        if (data.eventId) {
          if (processedEvents.current.has(data.eventId)) return
          processedEvents.current.add(data.eventId)
        }

        if (data.type === "transcript") {
          setTranscript(data.text)
        }

        if (data.type === "feedback_text") {
          setState("processing") // L'IA a fini de réfléchir, l'audio arrive
        }

        if (data.type === "summary") {
          setState("finished")
        }
      } else {
        await playAudioBuffer(event.data)
      }
    }

    ws.onerror = () => {
      setError("WS_FAILED");
      // onclose traitera la reconnexion
    }

    ws.onclose = (event) => {
      // Code 1000 = fermeture intentionnelle (stopSpeaking, cleanup)
      if (event.code === 1000) {
        setConnectionStatus("disconnected");
        return;
      }

      // Fermeture anormale → tentative de reconnexion
      if (reconnectAttemptRef.current >= MAX_RECONNECT_ATTEMPTS) {
        setError("RECONNECT_EXHAUSTED");
        setState("error");
        setConnectionStatus("disconnected");
        return;
      }

      const attempt = reconnectAttemptRef.current;
      const delay = RECONNECT_BASE_DELAY_MS * Math.pow(2, attempt);
      reconnectAttemptRef.current += 1;
      setReconnectAttempt(reconnectAttemptRef.current);
      setConnectionStatus("reconnecting");

      reconnectTimerRef.current = setTimeout(() => {
        connectWebSocket();
      }, delay);
    }
  }, [wsUrl, token, playAudioBuffer, startMicrophone]);

  // 🚀 Init WS
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      reconnectAttemptRef.current = 0;

      if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
        wsRef.current.close(1000, "Client disconnect");
      }

      playbackSourceRef.current?.stop()
      workletNodeRef.current?.disconnect()

      mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close()
      }
    }
  }, [connectWebSocket])

  return {
    // Existing business logic
    state,
    transcript,
    stopSpeaking,
    interruptAI,
    // New infrastructure logic
    connectionStatus,
    error,
    reconnectAttempt,
    maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS,
  }
}
