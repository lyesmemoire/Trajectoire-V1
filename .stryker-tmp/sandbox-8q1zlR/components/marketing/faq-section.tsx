// @ts-nocheck
"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "En quoi Trajectoire est différent d'un coach IA classique ?",
    a: "Contrairement aux outils qui se contentent de noter vos réponses, nous simulons la pression psychologique. Notre IA vous interrompt, manifeste du scepticisme et analyse votre capacité à rebondir.",
  },
  {
    q: "Le Career DNA est-il reconnu par les recruteurs ?",
    a: "C'est un outil de connaissance de soi. Il vous permet d'identifier vos patterns comportementaux réels pour mieux les maîtriser le jour J. De nombreux candidats l'utilisent pour préparer leurs entretiens FAANG ou Executive.",
  },
  {
    q: "Puis-je vraiment tester gratuitement ?",
    a: "Oui. L'inscription vous donne accès à une session complète incluant l'analyse de tension et la révélation de votre premier archétype.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-32 px-6 bg-slate-950">
      <div className="max-w-3xl mx-auto space-y-12">
        <h2 className="text-3xl lg:text-5xl font-black text-center">
          Questions fréquentes
        </h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full p-8 flex items-center justify-between text-left hover:bg-white/[0.03] transition-all"
              >
                <span className="font-bold text-lg">{faq.q}</span>
                {open === i ? (
                  <Minus className="w-5 h-5 text-blue-500" />
                ) : (
                  <Plus className="w-5 h-5 text-slate-500" />
                )}
              </button>
              {open === i && (
                <div className="px-8 pb-8 text-slate-400 font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
