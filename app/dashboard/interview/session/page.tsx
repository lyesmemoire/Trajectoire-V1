"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  Loader2,
  Target,
  Layout,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { PersonaSelector } from "@/components/interview/persona-selector";
import { PressureMeter } from "@/components/interview/pressure-meter";
import { PERSONAS } from "@/lib/interview/persona-config";
import { useMicrophoneManager } from "@/lib/audio/hooks/useMicrophoneManager";
import { useMobileViewport } from "@/hooks/useMobileViewport";
import { usePerceivedSpeed } from "@/lib/latency/perceived-speed";
import {
  SessionRecovery,
  SessionSnapshot,
} from "@/lib/interview/recovery-logic";

type Phase = "setup" | "interview" | "analyzing" | "results";

export default function InterviewSession() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [personaId, setPersonaId] = useState("faang");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [cvId, setCvId] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [pressureLevel, setPressureLevel] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveredSession, setRecoveredSession] =
    useState<SessionSnapshot | null>(null);

  // 🛡️ Mobile Resilience & Recovery Hooks
  const {
    status: micStatus,
    stream: micStream,
    requestPermission,
  } = useMicrophoneManager();
  const { keyboardOpen } = useMobileViewport();
  const { isThinking, currentCue, startThinking, stopThinking } =
    usePerceivedSpeed();

  const supabase = createClient();

  // 🔄 Initial recovery check
  useEffect(() => {
    const snapshot = SessionRecovery.getValidSnapshot();
    if (snapshot) setRecoveredSession(snapshot);

    const params = new URLSearchParams(window.location.search);
    if (params.get("cvId")) setCvId(params.get("cvId"));
    if (params.get("jobDesc"))
      setJobDescription(decodeURIComponent(params.get("jobDesc")!));
  }, []);

  // 📸 Autosave snapshot every question
  useEffect(() => {
    if (phase === "interview" && session?.id) {
      SessionRecovery.saveSnapshot({
        sessionId: session.id,
        currentIndex,
        personaId,
        jobTitle,
        timestamp: Date.now(),
        isVoiceEnabled,
        pressureLevel,
      });
    }
  }, [
    currentIndex,
    phase,
    session?.id,
    personaId,
    jobTitle,
    isVoiceEnabled,
    pressureLevel,
  ]);

  const speak = useCallback(
    (text: string) => {
      if (!isVoiceEnabled || typeof window === "undefined") return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      window.speechSynthesis.speak(utterance);
    },
    [isVoiceEnabled],
  );

  useEffect(() => {
    if (phase === "interview" && session?.questions?.[currentIndex]) {
      setTimeout(() => {
        speak(session.questions[currentIndex]);
      }, 500);
    }
  }, [currentIndex, phase, session, speak]);

  const startSession = async (resumeData?: SessionSnapshot) => {
    setLoading(true);
    const stream = await requestPermission();
    if (!stream) {
      setLoading(false);
      return;
    }

    if (resumeData) {
      // Logic to fetch the existing session from Supabase would go here
      // For this UI demo, we just restore the local state
      setPersonaId(resumeData.personaId);
      setJobTitle(resumeData.jobTitle);
      setCurrentIndex(resumeData.currentIndex);
      setPressureLevel(resumeData.pressureLevel);
      setIsVoiceEnabled(resumeData.isVoiceEnabled);
      setPhase("interview");
      setLoading(false);
      setRecoveredSession(null);
      return;
    }

    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_title: jobTitle,
          job_description: jobDescription,
          cv_id: cvId,
          persona_id: personaId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSession(data);
        setPhase("interview");
        setPressureLevel(PERSONAS[personaId as keyof typeof PERSONAS]?.pressureLevel ?? 0);
      }
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !session) return;
    setLoading(true);
    startThinking();
    window.speechSynthesis.cancel();

    try {
      const res = await fetch("/api/interview/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          userAnswer: answer.trim(),
          currentQuestion: session.questions[currentIndex],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAnswer("");
        setPressureLevel(data.pressureLevel);
        const newQuestions = [...session.questions];
        newQuestions[currentIndex + 1] = data.nextQuestion;
        setSession({ ...session, questions: newQuestions });
        if (currentIndex < (session.questions?.length || 7) - 1) {
          setCurrentIndex((i) => i + 1);
        } else {
          SessionRecovery.clear(); // Nettoyage en fin de session
          setPhase("analyzing");
          window.location.href = `/interview/${session.id}/results`;
        }
      }
    } finally {
      setLoading(false);
      stopThinking();
    }
  };

  if (phase === "setup") {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Mock Interview <span className="text-blue-600">Lab</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium italic">
            Préparez votre prochaine confrontation.
          </p>
        </div>

        {/* 🔄 RESUME BANNER : Continuity Focus */}
        <AnimatePresence>
          {recoveredSession && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-600 rounded-[2rem] p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 animate-spin-slow" />
                </div>
                <div>
                  <p className="font-black text-lg">Reprise disponible</p>
                  <p className="text-sm font-medium text-blue-100 italic">
                    Votre session pour "{recoveredSession.jobTitle}" a été
                    restaurée.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Button
                  onClick={() => setRecoveredSession(null)}
                  variant="ghost"
                  className="text-white hover:bg-white/10 font-bold px-6"
                >
                  Ignorer
                </Button>
                <Button
                  onClick={() => startSession(recoveredSession)}
                  className="bg-white text-blue-600 hover:bg-slate-100 font-black px-8 rounded-xl h-12 shadow-lg"
                >
                  Reprendre
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-8">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-4">
            <Layout className="w-4 h-4" /> 1. Sélection du Recruteur
          </h2>
          <PersonaSelector selectedId={personaId} onSelect={setPersonaId} />
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm space-y-10">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-4">
              <Target className="w-4 h-4" /> 2. Détails du Poste
            </h2>
            <div className="space-y-6">
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Titre du poste visé"
                className="w-full px-8 py-5 rounded-2xl border-2 border-slate-100 font-bold text-slate-900 bg-slate-50/50 focus:bg-white focus:border-blue-500 outline-none transition-all"
              />
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Description (Optionnel)"
                rows={4}
                className="w-full px-8 py-5 rounded-3xl border-2 border-slate-100 font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none"
              />
            </div>
            <Button
              onClick={() => startSession()}
              disabled={!jobTitle.trim() || loading}
              variant="primary"
              size="lg"
              className="w-full py-10 text-2xl h-auto rounded-[2.5rem]"
            >
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                "Lancer l'entraînement 🎤"
              )}
            </Button>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck className="w-32 h-32" />
              </div>
              <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6 relative z-10">
                Stabilité de Session
              </h4>
              <p className="text-sm font-medium text-slate-400 leading-relaxed italic relative z-10">
                "En cas de coupure mobile ou d'appel, votre progression est
                instantanément sauvegardée. Vous pourrez reprendre là où Victor
                s'est arrêté."
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 h-full flex flex-col overflow-hidden relative font-sans antialiased">
      {/* Dynamic Header */}
      {!keyboardOpen && (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 flex items-center justify-between gap-6 shadow-sm shrink-0">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl">
              {PERSONAS[personaId as keyof typeof PERSONAS]?.avatar}
            </div>
            <div>
              <h2 className="font-black text-slate-900">
                {PERSONAS[personaId as keyof typeof PERSONAS]?.name} · {jobTitle}
              </h2>
              <div className="flex items-center gap-2 mt-0.5 text-emerald-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase">
                  Connexion Restaurée
                </span>
              </div>
            </div>
          </div>
          <PressureMeter level={pressureLevel} />
        </div>
      )}

      {/* Immersive Content Area */}
      <div className="flex-1 overflow-y-auto space-y-8 pb-40">
        <motion.div
          animate={isThinking ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden text-center min-h-[300px] flex flex-col justify-center border border-white/5"
        >
          <div className="relative z-10 space-y-8">
            <h3 className="text-2xl md:text-4xl font-black leading-tight max-w-2xl mx-auto italic">
              {isThinking ? currentCue : session?.questions?.[currentIndex]}
            </h3>
            {!isThinking && (
              <div className="flex justify-center">
                <button
                  onClick={() => speak(session?.questions?.[currentIndex])}
                  className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                >
                  <Volume2 className="w-8 h-8" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <div
          className={`bg-white rounded-[3rem] border border-slate-100 p-8 md:p-12 shadow-sm space-y-6 ${keyboardOpen ? "ring-4 ring-blue-500/5 border-blue-500" : ""}`}
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Votre Réponse
            </p>
            {/* Micro manager status integrated silently here */}
          </div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Le recruteur vous écoute..."
            className="w-full min-h-[150px] text-xl font-medium text-slate-700 bg-transparent border-none outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
          <div className="pt-6 border-t border-slate-50 flex justify-end">
            <Button
              onClick={submitAnswer}
              disabled={!answer.trim() || loading || isThinking}
              variant="primary"
              size="lg"
              className="px-16 h-20 rounded-[2rem] font-black text-xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Suivant"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
