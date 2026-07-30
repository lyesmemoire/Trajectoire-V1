"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Detects prolonged silence during an answer.
 */
export function useSilenceDetection(stream: MediaStream | null, onSilenceThreshold: () => void,
) {
  const [isSilent, setIsSilent] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!stream) return;

    const audioContext = new (
      window.AudioContext || (window  as any).webkitAudioContext
    )();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkVolume = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);

      const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      if (volume < 10) {
        // Threshold for silence
        if (!timerRef.current) {
          timerRef.current = setTimeout(() => {
            setIsSilent(true);
            onSilenceThreshold();
          }, 5000); // 5 seconds of silence
        }
      } else {
        setIsSilent(false);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }

      requestAnimationFrame(checkVolume);
    };

    checkVolume();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      audioContext.close();
    };
  }, [stream, onSilenceThreshold]);

  return isSilent;
}
