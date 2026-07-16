// @ts-nocheck
"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export type MicStatus =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "error"
  | "disconnected";

export function useMicrophoneManager() {
  const [status, setStatus] = useState<MicStatus>("idle");
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  const checkMicrophoneHealth = useCallback(() => {
    if (!streamRef.current) return;
    const audioTrack = streamRef.current.getAudioTracks()[0];

    // Detect if track was killed by OS (Incoming call, Siri, etc.)
    if (
      !audioTrack ||
      audioTrack.readyState === "ended" ||
      !audioTrack.enabled
    ) {
      console.warn(
        "[Mic Manager] Audio track lost - OS Intervention suspected",
      );
      setStatus("disconnected");
    }
  }, []);

  const requestPermission = useCallback(async () => {
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });

      streamRef.current = stream;

      // Initialize AudioContext to monitor state (Running/Suspended)
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();

      setStatus("granted");
      return stream;
    } catch (err) {
      console.error("[Mic Manager] Permission error:", err);
      setStatus("denied");
      return null;
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Tab resumed - crucial for Safari iOS
        if (audioContextRef.current?.state === "suspended") {
          audioContextRef.current.resume().catch(() => {});
        }
        checkMicrophoneHealth();
      }
    };

    const handleDeviceChange = () => {
      console.info("[Mic Manager] Audio device changed (Bluetooth/AirPods?)");
      checkMicrophoneHealth();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange,
      );
      stopStream();
    };
  }, [checkMicrophoneHealth, stopStream]);

  return {
    status,
    requestPermission,
    stopStream,
    stream: streamRef.current,
    audioContext: audioContextRef.current,
  };
}
