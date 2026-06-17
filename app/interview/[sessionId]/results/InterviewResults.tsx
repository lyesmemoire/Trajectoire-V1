"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateSimplifiedReplay } from "@/lib/replay/generate-replay-story";
import { ReplayTracker } from "@/components/replay/ReplayTracker";

export function InterviewResults({ session }: { session: any }) {
  const story = useMemo(() => generateSimplifiedReplay(session), [session]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-24 space-y-16 font-sans antialiased text-slate-900 overflow-hidden">
      {/* 📡 Analytics Invisible */}
      <ReplayTracker sessionId={session.id} score={session.score} />

      {/* 1. HEADLINE UNIQUE */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none">
          {story.headline}
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Lecture rapide : 20 secondes.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* CARTE 1 : LA VÉRITÉ RECRUTEUR */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[3rem] border-2 border-slate-100 p-10 flex flex-col justify-between shadow-xl shadow-slate-200/20"
        >
          <div className="space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {story.recruiterCard.title}
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
                <p className="text-sm font-bold text-slate-700">
                  <span className="text-emerald-600">Ce qui a rassuré :</span>{" "}
                  {story.recruiterCard.content.positive}
                </p>
              </div>
              <div className="flex gap-4">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                <p className="text-sm font-bold text-slate-700">
                  <span className="text-amber-600">
                    Ce qui a créé un doute :
                  </span>{" "}
                  {story.recruiterCard.content.doubt}
                </p>
              </div>
              <div className="flex gap-4">
                <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                <p className="text-sm font-black text-slate-900 bg-blue-50 px-3 py-2 rounded-xl border border-blue-100">
                  Correction : {story.recruiterCard.content.correction}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CARTE 2 : L'ACTION IMMÉDIATE */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 rounded-[3rem] p-10 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Play className="w-32 h-32" />
          </div>

          <div className="space-y-6 relative z-10">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
              Votre prochain entraînement
            </p>
            <h3 className="text-3xl font-black italic leading-tight">
              "{story.nextStep.title}"
            </h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Objectif : {story.nextStep.goal}
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-white/10 relative z-10">
            <Button
              asChild
              size="lg"
              className="w-full h-16 rounded-[1.5rem] bg-white text-slate-950 hover:bg-slate-200 font-black text-lg shadow-xl shadow-white/5"
            >
              <Link href="/dashboard/interview/session">
                Relancer une session
              </Link>
            </Button>
            <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Durée : {story.nextStep.duration} minutes
            </p>
          </div>
        </motion.div>
      </div>

      <footer className="text-center">
        <Link
          href="/dashboard"
          className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-blue-600 transition-colors"
        >
          Retour au tableau de bord
        </Link>
      </footer>
    </div>
  );
}
