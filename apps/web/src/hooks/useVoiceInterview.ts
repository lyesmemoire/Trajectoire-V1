"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export type InterviewState =
  | "connecting"
  | "ai_speaking"
  | "user_speaking"
  | "processing"
  | "finished"
  | "error"

export function useVoiceInterview(wsUrl: string, token: string) {
  const [state, setState] = useState<InterviewState>("connecting")
  const [transcript, setTranscript] = useState("")
  const processedEvents = useRef<Set<string>>(new Set())

  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const workletNodeRef = useRef<AudioWorkletNode | null>(null)
  const playbackSourceRef = useRef<AudioBufferSourceNode | null>(null)

  // 🔊 Lecture TTS optimisée
  const playAudioBuffer = useCallback(async (arrayBuffer: ArrayBuffer) => {
    if (!audioContextRef.current) return

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
  }, [])

  // 🎤 Démarrage micro
  const startMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })

      mediaStreamRef.current = stream

      const audioContext = new AudioContext({ sampleRate: 16000 })
      audioContextRef.current = audioContext

      await audioContext.audioWorklet.addModule("/audio-processor.js")

      const source = audioContext.createMediaStreamSource(stream)
      const worklet = new AudioWorkletNode(audioContext, "pcm-processor")

      worklet.port.onmessage = (event) => {
        // Envoi binaire continu si l'utilisateur parle
        if (wsRef.current?.readyState === WebSocket.OPEN && state === "user_speaking") {
          wsRef.current.send(event.data)
        }
      }

      source.connect(worklet)
      worklet.connect(audioContext.destination)

      workletNodeRef.current = worklet
    } catch (err) {
      console.error("Erreur micro:", err)
      setState("error")
    }
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

    wsRef.current?.send(JSON.stringify({ type: "interrupt" }))
    setState("user_speaking")
  }, [])

  // 🚀 Init WS
  useEffect(() => {
    if (!wsUrl || !token) return;

    const ws = new WebSocket(wsUrl)
    ws.binaryType = "arraybuffer"
    wsRef.current = ws

    ws.onopen = () => {
      setState("user_speaking")
      startMicrophone()
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

    ws.onerror = () => setState("error")

    return () => {
      ws.close()

      playbackSourceRef.current?.stop()
      workletNodeRef.current?.disconnect()

      mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsUrl, token]) // playAudioBuffer et startMicrophone retirés pour éviter reconnexion infinie

  return {
    state,
    transcript,
    stopSpeaking,
    interruptAI,
  }
}
