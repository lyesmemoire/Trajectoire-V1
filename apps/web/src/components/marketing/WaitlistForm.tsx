"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Step = "email" | "pressure" | "weakness" | "intent" | "done";

export function WaitlistForm() {
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    pressureType: "",
    weakness: "",
    intentReason: "",
    isWillingToRetry: true,
  });

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setStep("done");
    } catch (e) {
      toast.error("Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {step === "email" && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <Input
              type="email"
              placeholder="votre@email.fr"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="h-16 rounded-2xl bg-white/[0.03] border-white/10 text-white text-center font-bold text-lg focus:ring-blue-500"
            />
            <Button
              onClick={() => formData.email && setStep("pressure")}
              className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg"
            >
              Demander un accès <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        )}

        {step === "pressure" && (
          <motion.div
            key="pressure"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 text-center"
          >
            <h3 className="text-xl font-black text-white italic">
              Quel type d'entretien vous met le plus sous pression ?
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {["Tech", "Product", "Consulting", "Leadership", "Autre"].map(
                (opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setFormData({ ...formData, pressureType: opt });
                      setStep("weakness");
                    }}
                    className="p-5 rounded-xl bg-white/[0.02] border border-white/10 text-slate-300 hover:bg-blue-600/10 hover:border-blue-500 transition-all font-bold"
                  >
                    {opt}
                  </button>
                ),
              )}
            </div>
          </motion.div>
        )}

        {step === "weakness" && (
          <motion.div
            key="weakness"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 text-center"
          >
            <h3 className="text-xl font-black text-white italic">
              Quel est votre plus grand point faible ?
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                "Réponses trop vagues",
                "Stress paralysant",
                "Difficulté à décider",
                "Manque de structure",
                "Trop parler",
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setFormData({ ...formData, weakness: opt });
                    setStep("intent");
                  }}
                  className="p-5 rounded-xl bg-white/[0.02] border border-white/10 text-slate-300 hover:bg-blue-600/10 hover:border-blue-500 transition-all font-bold"
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "intent" && (
          <motion.div
            key="intent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 text-center"
          >
            <div className="space-y-4 text-left">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                Pourquoi voulez-vous essayer StudioEntretien ?
              </label>
              <textarea
                value={formData.intentReason}
                onChange={(e) =>
                  setFormData({ ...formData, intentReason: e.target.value })
                }
                placeholder="Dites-nous en quelques mots..."
                className="w-full h-32 p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-white outline-none focus:border-blue-500 resize-none font-medium"
              />
            </div>
            <Button
              onClick={submit}
              disabled={loading || !formData.intentReason}
              className="w-full h-16 rounded-2xl bg-blue-600 text-white font-black text-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : (
                "Envoyer ma demande d'accès"
              )}
            </Button>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 py-10"
          >
            <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20 flex items-center justify-center text-4xl mx-auto shadow-inner animate-pulse">
              ✅
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-white tracking-tight">
                Demande enregistrée.
              </h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                Nous ouvrons l'accès progressivement afin de préserver la
                qualité des sessions et du replay comportemental.
              </p>
            </div>
            <div className="pt-6 border-t border-white/5">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">
                Vérifiez vos emails dans les prochaines 48h
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
