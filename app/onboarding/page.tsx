"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { WowTracker } from "@/lib/analytics/time-to-wow";
import { UniversalJobInput } from "@/components/onboarding/UniversalJobInput";
import { JobSourceType } from "@/lib/jobs/detect-source";

type Step = "upload" | "job" | "truth";

export default function TruthTunnelPage() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [truth, setTruth] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!sessionStorage.getItem("wow_start_time")) {
      WowTracker.start();
    }
  }, []);

  const handleUpload = async (f: File) => {
    setFile(f);
    setLoading(true);
    // Instant feedback during "fake" or real parsing
    await new Promise((r) => setTimeout(r, 1500));
    WowTracker.trackWow("cv_upload_completed");
    // Reset flow flags for new upload
    localStorage.removeItem("cv-editor-completed");
    localStorage.removeItem("pendingCVRewrite");
    document.cookie = "cv-editor-completed=; Path=/; Max-Age=0; SameSite=Lax";
    setLoading(false);
    setStep("job");
  };

  const handleJobContent = async (content: string, type: JobSourceType) => {
    setJobDescription(content);
    setLoading(true);
    // Simulate high-credibility doubt extraction (Mistral call simulation)
    await new Promise((r) => setTimeout(r, 2200));

    const truthData = {
      truth:
        "Votre CV décrit des responsabilités, mais l'IA ne détecte aucun impact mesurable.",
      doubt:
        "Le recruteur doutera de votre séniorité réelle sans chiffres clés.",
      action: "Ajoutez 3 résultats chiffrés dans votre dernière expérience.",
    };
    setTruth(truthData);
    localStorage.setItem("pendingTruthTunnel", JSON.stringify(truthData));

    WowTracker.trackWow("recruiter_doubt_revealed");
    setStep("truth");
    setLoading(false);
  };

  const handleTraining = async () => {
    try {
      // Set pending CV rewrite data for cv-editor flow
      localStorage.setItem(
        "pendingCVRewrite",
        JSON.stringify({
          analysis: truth,
          jobDescription,
          uploadedAt: Date.now(),
        }),
      );
      router.push("/cv-editor");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {/* STEP 1: UPLOAD CV */}
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12 text-center"
            >
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9]">
                  Déposez votre CV.
                </h1>
                <p className="text-xl text-slate-400 font-medium">
                  Nous allons extraire votre première vérité en 30 secondes.
                </p>
              </div>

              <div
                className="border-2 border-dashed border-white/10 rounded-[3.5rem] p-20 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group relative overflow-hidden"
                onClick={() => document.getElementById("cv-input")?.click()}
              >
                <input
                  type="file"
                  id="cv-input"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    e.target.files?.[0] && handleUpload(e.target.files[0])
                  }
                />
                {loading ? (
                  <div className="space-y-6">
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
                    <p className="text-xs font-black uppercase tracking-widest text-blue-400 animate-pulse">
                      Extraction de vos capacités...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-white/10 shadow-2xl">
                      <Upload className="w-10 h-10 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-white transition-colors">
                      PDF ou DOCX accepté
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2: JOB DESCRIPTION */}
          {step === "job" && (
            <motion.div
              key="job"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    CV Analysé avec succès
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black italic text-white leading-tight">
                  "Votre CV ressemble à 73% des CV rejetés <br /> par manque de
                  preuves concrètes."
                </h2>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                  Diagnostiquons maintenant vos doutes recruteurs
                </p>
              </div>

              <div className="bg-[#0B1023] rounded-[3.5rem] border border-white/10 p-12 shadow-2xl relative">
                <UniversalJobInput
                  onContentReady={handleJobContent}
                  isLoading={loading}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 3: THE USEFUL TRUTH */}
          {step === "truth" && (
            <motion.div
              key="truth"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-none text-white">
                  Diagnostic de Crédibilité
                </h2>
                <p className="text-lg text-slate-400 font-medium">
                  Voici l'hésitation n°1 du recruteur face à votre profil.
                </p>
              </div>

              <div className="bg-white rounded-[3.5rem] p-12 space-y-12 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)]">
                <div className="space-y-8 text-left">
                  <div className="flex gap-6 items-start">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 shadow-sm border border-blue-100">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        La Vérité IA
                      </p>
                      <p className="text-lg font-bold text-slate-900 leading-relaxed">
                        {truth.truth}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0 shadow-sm border border-rose-100">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Le Doute Recruteur
                      </p>
                      <p className="text-lg font-bold text-slate-900 leading-relaxed">
                        {truth.doubt}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-slate-950 rounded-[2.5rem] text-white space-y-5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <UserCheck className="w-32 h-32" />
                  </div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] relative z-10">
                    Action Recommandée
                  </p>
                  <p className="text-2xl font-black italic relative z-10 leading-tight">
                    "{truth.action}"
                  </p>
                </div>

                <div className="pt-6 flex flex-col gap-6">
                  <Button
                    onClick={handleTraining}
                    size="lg"
                    className="h-24 px-12 rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-2xl shadow-[0_25px_50px_-12px_rgba(37,99,235,0.5)] transition-all hover:scale-105 active:scale-95 group"
                  >
                    S'entraîner à lever ce doute{" "}
                    <ArrowRight className="ml-3 w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </Button>
                  <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                    <span className="w-12 h-px bg-slate-100" /> Session vocale
                    avec Victor <span className="w-12 h-px bg-slate-100" />
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
