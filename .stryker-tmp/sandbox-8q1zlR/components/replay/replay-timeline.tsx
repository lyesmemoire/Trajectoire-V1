// @ts-nocheck
"use client";

import { SessionReplay } from "@/lib/interview/types/replay.types";
import { PressureGraph } from "./pressure-graph";
import { ReplayEventCard } from "./replay-event-card";
import { Trophy, Brain, Target } from "lucide-react";

export function ReplayTimeline({ replay }: { replay: SessionReplay }) {
  return (
    <div className="space-y-10">
      {/* Archetype & Overall Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
          <Brain className="absolute top-0 right-0 w-24 h-24 opacity-10 translate-x-4 -translate-y-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">
            Profil de Session
          </p>
          <h3 className="text-2xl font-black mb-4">{replay.archetype}</h3>
          <p className="text-xs font-medium text-blue-100 leading-relaxed opacity-80">
            Cette session révèle un profil analytique avec une forte capacité
            d'adaptation.
          </p>
        </div>
        <div className="md:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Trophy className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900">
              Bilan Comportemental
            </h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">
              {replay.overallCoaching}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Graph */}
      <PressureGraph data={replay.pressureCurve} events={replay.events} />

      {/* Vertical Timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-8">
          <Target className="w-5 h-5 text-slate-400" />
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Chronologie des moments clés
          </h3>
        </div>

        <div className="max-w-2xl">
          {replay.events.map((event) => (
            <ReplayEventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
