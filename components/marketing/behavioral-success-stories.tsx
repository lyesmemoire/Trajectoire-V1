"use client";

import { Zap } from "lucide-react";

const STORIES = [
  {
    role: "Senior Product Manager",
    before: "Réponses longues. Justification permanente sous interruption.",
    moment: "Victor a percé sa défense sur la question du budget.",
    after: "Structure chirurgicale. Décisions assumées. +24% de clarté.",
    avatar: "M",
  },
  {
    role: "Lead Developer",
    before: "Expertise réelle mais ton hésitant. 'Je pense que...'.",
    moment: "Le moment où elle a arrêté de douter de sa légitimité technique.",
    after: "Affirmation des choix d'architecture. Storytelling impactant.",
    avatar: "S",
  },
];

export function BehavioralSuccessStories() {
  return (
    <section className="py-40 px-6 bg-[#050816]">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="text-center space-y-6">
          <h2 className="text-4xl lg:text-7xl font-black text-white leading-tight tracking-tight">
            De la justification <br />{" "}
            <span className="text-blue-500 italic">à l'affirmation.</span>
          </h2>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">
            Étudiez les mutations comportementales de ceux qui ont déjà dominé
            l'arène.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {STORIES.map((s, i) => (
            <div
              key={i}
              className="bg-[#0B1023] rounded-[3.5rem] p-12 border border-white/[0.08] shadow-2xl relative overflow-hidden group"
            >
              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white">
                    {s.avatar}
                  </div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    {s.role}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase">
                      Avant la mutation
                    </p>
                    <p className="text-sm font-medium text-slate-400 italic">
                      "{s.before}"
                    </p>
                  </div>
                  <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                    <p className="text-[10px] font-black text-blue-400 uppercase mb-2 flex items-center gap-2">
                      <Zap className="w-3 h-3" /> Turning Point
                    </p>
                    <p className="text-sm font-bold text-white">"{s.moment}"</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-emerald-500 uppercase">
                      Après l'entraînement
                    </p>
                    <p className="text-sm font-black text-white">{s.after}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
