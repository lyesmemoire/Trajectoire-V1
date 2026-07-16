"use client";

import { useState, useRef } from "react";
import { CheckCircle2, Mic, AlertCircle } from "lucide-react";
import { Button } from "@/components/design-system";
import { motion } from "framer-motion";

interface WindowWithAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext;
}

interface Props {
  onSuccess: (stream: MediaStream) => void;
}

export function MicrophoneCheck({ onSuccess }: Props) {
  const [status, setStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const testMicrophone = async () => {
    setStatus("testing");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextCtor = window.AudioContext || (window as WindowWithAudioContext).webkitAudioContext;
      const audioContext = new (AudioContextCtor as typeof AudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      let detected = false;
      const check = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setVolume(avg);

        if (avg > 15 && !detected) {
          detected = true;
          setStatus("success");
          setTimeout(() => {
            onSuccess(stream);
          }, 1500);
        } else if (status === "testing") {
          requestAnimationFrame(check);
        }
      };
      check();

      // Timeout after 10s if no voice detected
      setTimeout(() => {
        if (!detected) setStatus("error");
      }, 10000);
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl max-w-md mx-auto text-center space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">
          Test rapide du micro
        </h2>
        <p className="text-slate-500 font-medium">
          Cela prend moins de 10 secondes.
        </p>
      </div>

      <div className="relative flex items-center justify-center h-32">
        {status === "idle" && (
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
            <Mic className="w-8 h-8" />
          </div>
        )}
        {status === "testing" && (
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"
            >
              <Mic className="w-8 h-8" />
            </motion.div>
            <p className="absolute -bottom-8 text-[10px] font-black text-blue-600 uppercase tracking-widest">
              Parlez maintenant...
            </p>
          </div>
        )}
        {status === "success" && (
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        )}
        {status === "error" && (
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
            <AlertCircle className="w-10 h-10" />
          </div>
        )}
      </div>

      {status === "success" ? (
        <p className="text-emerald-600 font-black uppercase text-xs tracking-widest">
          Votre voix est détectée.
        </p>
      ) : (
        <Button
          onClick={testMicrophone}
          disabled={status === "testing"}
          variant={status === "error" ? "error" : "primary"}
          className="w-full py-8 rounded-2xl text-lg"
        >
          {status === "error" ? "Réessayer le test" : "Tester mon micro"}
        </Button>
      )}
    </div>
  );
}
