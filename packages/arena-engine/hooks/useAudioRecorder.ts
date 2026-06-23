import { useState, useRef, useCallback } from "react";

interface AudioRecorderState {
  isRecording: boolean;
  duration: number;
  audioBlob: Blob | null;
  error: string | null;
}

interface UseAudioRecorderReturn extends AudioRecorderState {
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  reset: () => void;
}

const MAX_DURATION_SECONDS = 180; // 3 min max par réponse

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    duration: 0,
    audioBlob: null,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const durationRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,       // Mono — Whisper n'a pas besoin de stéréo
          sampleRate: 16000,     // Optimal pour Whisper
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Format supporté par Whisper et les navigateurs modernes
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      durationRef.current = 0;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        stream.getTracks().forEach((track) => track.stop());
        setState((prev) => ({ ...prev, isRecording: false, audioBlob: blob }));
      };

      // Chunk toutes les 250ms pour un éventuel streaming futur
      mediaRecorder.start(250);

      // Timer d'affichage + arrêt forcé à MAX_DURATION
      timerRef.current = setInterval(() => {
        durationRef.current += 1;
        setState((prev) => ({ ...prev, duration: durationRef.current }));

        if (durationRef.current >= MAX_DURATION_SECONDS) {
          stopRecording();
        }
      }, 1000);

      setState({ isRecording: true, duration: 0, audioBlob: null, error: null });
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Accès au microphone refusé. Vérifiez les permissions."
          : "Impossible d'accéder au microphone.";

      setState((prev) => ({ ...prev, error: message }));
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    stopRecording();
    setState({ isRecording: false, duration: 0, audioBlob: null, error: null });
  }, [stopRecording]);

  return { ...state, startRecording, stopRecording, reset };
}
