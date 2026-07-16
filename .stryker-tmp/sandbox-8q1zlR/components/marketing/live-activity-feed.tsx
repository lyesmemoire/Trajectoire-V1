// @ts-nocheck
"use client";

import { Sparkles, Zap, ShieldCheck, Activity } from "lucide-react";

const FEED_EVENTS = [
  {
    user: "Alex M.",
    action: "Identité révélée",
    detail: "Strategic Operator",
    icon: <Sparkles className="w-3 h-3" />,
  },
  {
    user: "Sarah K.",
    action: "Résilience Élite",
    detail: "19 interruptions gérées",
    icon: <Zap className="w-3 h-3" />,
  },
  {
    user: "Kevin L.",
    action: "Mutation Détectée",
    detail: "Stress Reactive → Leader",
    icon: <ShieldCheck className="w-3 h-3" />,
  },
  {
    user: "Marie P.",
    action: "Score Recovery",
    detail: "Top 3% Mondial",
    icon: <Activity className="w-3 h-3" />,
  },
];

export function LiveActivityFeed() {
  return (
    <section className="py-8 border-y border-white/[0.05] bg-[#050816] overflow-hidden whitespace-nowrap">
      <div className="flex gap-20 animate-scroll-rtl">
        {[...FEED_EVENTS, ...FEED_EVENTS, ...FEED_EVENTS].map((activity, i) => (
          <div
            key={i}
            className="flex items-center gap-5 flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-500"
          >
            <div className="w-2 h-2 rounded-full bg-[#7C3AED] shadow-[0_0_10px_#7C3AED]" />
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">
              <span className="text-white">{activity.user}</span> •{" "}
              {activity.action} :{" "}
              <span className="text-[#06B6D4] italic">{activity.detail}</span>
            </p>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes scroll-rtl {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.33%);
          }
        }
        .animate-scroll-rtl {
          animation: scroll-rtl 60s linear infinite;
        }
      `}</style>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-40 px-6 bg-[#050816]">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="text-center space-y-6">
          <h2 className="text-4xl lg:text-7xl font-black text-white leading-tight tracking-tight italic">
            "Ceux qui l'utilisent dominent l'arène."
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs">
            Plus de 2 000 transformations validées
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {[
            {
              quote:
                "J'ai réalisé que mon leadership s'effondrait après la 3ème interruption. Ce miroir comportemental a été mon déclic pour Google.",
              author: "Julien R.",
              role: "Lead Dev @ Thales",
            },
            {
              quote:
                "Victor est une simulation terrifiante. En affrontant son scepticisme tous les jours, le vrai entretien est devenu une simple formalité.",
              author: "Clémence V.",
              role: "Consultante Senior",
            },
            {
              quote:
                "On ne prépare pas des questions, on prépare son esprit. StudioEntretien m'a donné une assurance vocale que je n'imaginais pas.",
              author: "Omar D.",
              role: "Product Manager",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="p-12 rounded-[3.5rem] bg-[#0B1023] border border-white/[0.08] flex flex-col justify-between group hover:bg-[#0F172A] hover:border-white/10 transition-all duration-500 shadow-2xl"
            >
              <div className="space-y-8">
                <div className="text-5xl text-white/10 font-serif">“</div>
                <p className="text-xl font-medium text-slate-200 leading-relaxed italic">
                  {t.quote}
                </p>
              </div>
              <div className="mt-12 pt-8 border-t border-white/[0.05] flex items-center gap-5">
                <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center font-black text-white text-xl shadow-lg">
                  {t.author[0]}
                </div>
                <div>
                  <p className="font-black text-white text-base tracking-tight">
                    {t.author}
                  </p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
