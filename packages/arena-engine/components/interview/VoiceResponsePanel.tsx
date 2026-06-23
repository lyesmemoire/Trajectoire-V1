"use client";

import { useState } from "react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { ResponseScore } from "@/lib/interview/scoring";
import { Mic, MicOff, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceResponsePanelProps {
  sessionId: string;
  questionIndex: number;
  question: string;
  onScoreReceived: (score: ResponseScore) => void;
}

type PanelState = "idle" | "recording" | "transcribing" | "scoring" | "done" | "error";

export function VoiceResponsePanel({
  sessionId,
  questionIndex,
  question,
  onScoreReceived,
}: VoiceResponsePanelProps) {
  const [panelState, setPanelState] = useState<PanelState>("idle");
  const [transcription, setTranscription] = useState<string>("");
  const [score, setScore] = useState<ResponseScore | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { isRecording, duration, audioBlob, startRecording, stopRecording, reset } =
    useAudioRecorder();

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStartRecording = async () => {
    reset();
    setPanelState("recording");
    await startRecording();
  };

  const handleStopAndProcess = async () => {
    stopRecording();
    setPanelState("transcribing");

    // Attendre que le blob soit disponible
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!audioBlob) {
      setErrorMessage("Aucun audio capturé.");
      setPanelState("error");
      return;
    }

    try {
      // Étape 1 : Transcription
      const formData = new FormData();
      formData.append("audio", audioBlob, "response.webm");
      formData.append("sessionId", sessionId);
      formData.append("questionIndex", questionIndex.toString());

      const transcribeRes = await fetch("/api/interview/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!transcribeRes.ok) {
        const err = await transcribeRes.json();
        throw new Error(err.error || "Erreur de transcription.");
      }

      const { transcription: text } = await transcribeRes.json();
      setTranscription(text);
      setPanelState("scoring");

      // Étape 2 : Scoring
      const scoreRes = await fetch("/api/interview/score-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, questionIndex, transcription: text }),
      });

      if (!scoreRes.ok) {
        const err = await scoreRes.json();
        throw new Error(err.error || "Erreur de scoring.");
      }

      const scoreData: ResponseScore = await scoreRes.json();
      setScore(scoreData);
      setPanelState("done");
      onScoreReceived(scoreData);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur inconnue.");
      setPanelState("error");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 space-y-6 shadow-2xl">
      {/* Zone d'enregistrement */}
      <div className="flex flex-col items-center gap-6 py-6">
        {panelState === "idle" && (
          <button
            onClick={handleStartRecording}
            className="flex flex-col items-center justify-center gap-3 w-40 h-40 bg-red-600 hover:bg-red-500 text-white rounded-full font-black uppercase tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)] transition-all duration-300 hover:scale-105"
          >
            <Mic className="w-10 h-10" />
            Parler
          </button>
        )}

        {panelState === "recording" && (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(220,38,38,0.6)]">
                <Mic className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-50" />
            </div>
            <span className="text-red-400 font-mono text-2xl font-bold tracking-widest">
              {formatDuration(duration)}
            </span>
            <button
              onClick={handleStopAndProcess}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all mt-4 border border-slate-700 hover:border-slate-600"
            >
              <MicOff className="w-4 h-4 text-red-500" />
              Terminer
            </button>
          </div>
        )}

        {(panelState === "transcribing" || panelState === "scoring") && (
          <div className="flex flex-col items-center gap-4 text-slate-400 py-10">
            <Loader2 className="w-10 h-10 animate-spin text-red-500" />
            <p className="text-sm font-bold uppercase tracking-widest">
              {panelState === "transcribing"
                ? "Transcription en cours..."
                : "Analyse experte en cours..."}
            </p>
          </div>
        )}

        {panelState === "error" && (
          <div className="flex flex-col items-center gap-3 text-red-400 bg-red-950/50 p-6 rounded-2xl border border-red-900/50 w-full">
            <AlertTriangle className="w-8 h-8" />
            <p className="text-sm font-medium">{errorMessage}</p>
            <button
              onClick={() => setPanelState("idle")}
              className="text-xs font-bold uppercase underline mt-2 hover:text-red-300"
            >
              Réessayer
            </button>
          </div>
        )}
      </div>

      {/* Transcription */}
      {transcription && (
        <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-[10px] text-slate-500 font-bold mb-3 uppercase tracking-widest">
            Votre réponse transcrite
          </p>
          <p className="text-slate-300 text-sm leading-relaxed italic">"{transcription}"</p>
        </div>
      )}

      {/* Score */}
      {score && panelState === "done" && (
        <ScoreDisplay score={score} />
      )}
    </div>
  );
}

function ScoreDisplay({ score }: { score: ResponseScore }) {
  const getScoreColor = (value: number) => {
    if (value >= 75) return "text-emerald-400";
    if (value >= 50) return "text-amber-400";
    return "text-red-400";
  };

  const getBarColor = (value: number) => {
    if (value >= 75) return "bg-emerald-500";
    if (value >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6 border-t border-slate-800 pt-6 animate-in fade-in slide-in-from-bottom-4 mt-6">
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Score global</span>
        <span className={cn("text-3xl font-black", getScoreColor(score.scores.overall))}>
          {score.scores.overall}<span className="text-sm text-slate-600">/100</span>
        </span>
      </div>

      <div className="space-y-4 px-2">
        {Object.entries({
          Cohérence: score.scores.coherence,
          Profondeur: score.scores.depth,
          Clarté: score.scores.clarity,
        }).map(([label, value]) => (
          <div key={label}>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
              <span>{label}</span>
              <span className={getScoreColor(value)}>{value}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-1000", getBarColor(value))}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {score.strengths.length > 0 && (
        <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-2xl p-4">
          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-3">
            Points forts
          </p>
          <ul className="space-y-2">
            {score.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {score.factual_alerts.length > 0 && (
        <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-4">
          <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-3">
            Alertes factuelles
          </p>
          <ul className="space-y-3">
            {score.factual_alerts.map((alert, i) => (
              <li key={i} className="bg-slate-900/50 border border-red-900/30 rounded-xl p-3 text-sm">
                <span className="inline-block px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-black uppercase rounded mb-2 tracking-wider">
                  {alert.type}
                </span>
                <p className="text-slate-400 mt-1 leading-relaxed text-xs">
                  Vous avez dit : <span className="text-white">"{alert.claim_in_answer}"</span>
                </p>
                <p className="text-slate-400 leading-relaxed text-xs mt-1">
                  Le CV dit : <span className="text-amber-300">"{alert.claim_in_cv}"</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
