"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type State = "Listening" | "Evaluating" | "Responding";

export default function InterviewRoom({
  sessionId,
}: {
  sessionId: string;
}) {
  const router = useRouter();

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [question, setQuestion] = useState("");
  const [state, setState] = useState<State>("Listening");
  const [error, setError] = useState<string | null>(null);

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    let disposed = false;

    const addTimeout = (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay);
      timeoutsRef.current.push(id);
      return id;
    };

    async function startInterview() {
      try {
        // 1. Open WebSocket
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/api/voice";
        const token = localStorage.getItem("token") || "";
        const ws = new WebSocket(
          `${wsUrl}?engine=v3&sessionId=${sessionId}&token=${token}`
        );

        ws.binaryType = "arraybuffer";
        wsRef.current = ws;

        // 2. Request microphone access (getUserMedia)
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
          },
        });
        streamRef.current = stream;

        ws.onopen = async () => {
          if (disposed) return;
          console.log("WebSocket connected.");

          // 3. Create AudioContext at 16kHz to match Deepgram's expected sample rate
          const audioCtx = new AudioContext({ sampleRate: 16000 });
          audioCtxRef.current = audioCtx;

          // 4. Load the PCM16 AudioWorklet processor
          await audioCtx.audioWorklet.addModule("/pcm16-processor.js");

          // 5. Wire: mic → worklet → WebSocket (binary PCM16)
          const source = audioCtx.createMediaStreamSource(stream);
          const workletNode = new AudioWorkletNode(audioCtx, "pcm16-processor");

          workletNode.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(e.data);
            }
          };

          source.connect(workletNode);
          workletNode.connect(audioCtx.destination); // required for processing to run
        };

        ws.onmessage = (event) => {
          // Binary data = TTS audio from backend, play it
          if (event.data instanceof ArrayBuffer) {
            playTtsAudio(event.data);
            return;
          }

          try {
            const data = JSON.parse(event.data);

            // "ready" = first question from the interviewer
            if (data.type === "ready") {
              setQuestion(data.question);
              setState("Responding");
              // After TTS finishes, switch to Listening (simulated delay)
              addTimeout(() => {
                if (!disposed) setState("Listening");
              }, 4000);
            }

            // "transcript" final = user finished speaking, engine is evaluating
            if (data.type === "transcript" && data.final) {
              setState("Evaluating");
            }

            // "feedback_text" = engine evaluated the answer and has next question
            if (data.type === "feedback_text") {
              // Human micro-delay (600-1200ms) before showing next question
              const delay = 600 + Math.random() * 600;

              if (data.finished) {
                addTimeout(() => {
                  if (!disposed) {
                    cleanup();
                    router.push(`/dashboard/report/${sessionId}`);
                  }
                }, delay);
              } else {
                addTimeout(() => {
                  if (!disposed) {
                    setQuestion(data.question);
                    setState("Responding");
                    // Back to Listening after TTS plays
                    addTimeout(() => {
                      if (!disposed) setState("Listening");
                    }, 4000);
                  }
                }, delay);
              }
            }

            // "summary" = interview complete
            if (data.type === "summary") {
              cleanup();
              router.push(`/dashboard/report/${sessionId}`);
            }

            if (data.type === "error") {
              console.error("Engine error:", data.message);
              setError(data.message);
            }
          } catch {
            // Ignore non-JSON
          }
        };

        ws.onerror = () => {
          if (!disposed) setError("Connection error.");
        };

        ws.onclose = () => {
          console.log("WebSocket closed.");
        };
      } catch (err: any) {
        if (!disposed) setError(err.message || "Microphone access denied.");
      }
    }

    function cleanup() {
      // Clear timeouts
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      timeoutsRef.current = [];
      // Stop all mic tracks
      streamRef.current?.getTracks().forEach((track) => track.stop());
      // Close AudioContext
      audioCtxRef.current?.close().catch(() => {});
      // Close WebSocket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    }

    startInterview();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [sessionId, router]);

  if (error) {
    return (
      <div className="interview-room">
        <div className="interview-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="interview-room">
      <div className="interview-question">
        {question || "Waiting for interviewer..."}
      </div>

      <div className={`interview-state state-${state.toLowerCase()}`}>
        {state === "Listening" && "Listening..."}
        {state === "Evaluating" && "Evaluating..."}
        {state === "Responding" && "Responding..."}
      </div>
    </div>
  );
}

/** Play raw TTS audio buffer through the speakers */
function playTtsAudio(buffer: ArrayBuffer) {
  try {
    const blob = new Blob([buffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => URL.revokeObjectURL(url);
    audio.play().catch(() => {});
  } catch {
    // Ignore playback errors
  }
}
