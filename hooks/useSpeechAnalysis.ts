"use client";

import { useState, useRef, useCallback } from "react";
import {
  SpeechAnalyzer,
  SpeechAnalysisResult,
} from "@/lib/audio/speech-analyzer";

export function useSpeechAnalysis() {
  const [state, setState] = useState<
    "idle" | "recording" | "transcribing" | "analyzing" | "done" | "error"
  >("idle");
  const [result, setResult] = useState<SpeechAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzerRef = useRef<SpeechAnalyzer | null>(null);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      analyzerRef.current = new SpeechAnalyzer();
      await analyzerRef.current.connectStream(stream);
      analyzerRef.current.startVolumeTracking();

      const mediaRec = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRec.start();
      mediaRecRef.current = mediaRec;
      startTimeRef.current = Date.now();
      setState("recording");
    } catch (err) {
      setError("Erreur microphone");
      setState("error");
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!mediaRecRef.current || !analyzerRef.current) return;
    setState("transcribing");
    mediaRecRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const duration = (Date.now() - startTimeRef.current) / 1000;
      try {
        const formData = new FormData();
        formData.append("file", blob, "recording.webm");
        const res = await fetch("/api/interview/transcribe", {
          method: "POST",
          body: formData,
        });
        const { text } = await res.json();
        setState("analyzing");
        const analysis = analyzerRef.current!.analyzeTranscript(text, duration);
        setResult(analysis);
        setState("done");
      } catch (e) {
        setState("error");
      }
    };
    mediaRecRef.current.stop();
  }, []);

  return { state, result, error, startRecording, stopRecording };
}
