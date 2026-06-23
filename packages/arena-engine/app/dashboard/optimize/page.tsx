"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  FileText,
  Target,
  ChevronRight,
  RefreshCw,
  Layout,
  Mic2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/cv/ExportButton";
import { CVData } from "@/lib/pdf/types";

interface OptimizeResult {
  improvedSummary: string;
  improvedBullets: Array<{ original: string; improved: string }>;
  keywordsAdded: string[];
  generalAdvice: string;
  cvData: CVData; // Données structurées pour le PDF
}

function OptimizeDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cvId = searchParams.get("cvId");

  const [isLoadingCv, setIsLoadingCv] = useState(true);
  const [cvData, setCvData] = useState<{ file_name: string } | null>(null);
  const [lastReport, setLastReport] = useState<{
    score: number;
    job_description: string;
  } | null>(null);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizeResult | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!cvId) {
        setIsLoadingCv(false);
        return;
      }

      const supabase = createClient();

      const { data: cv } = await supabase
        .from("cvs")
        .select("file_name")
        .eq("id", cvId)
        .single();

      if (cv) {
        setCvData(cv);
      }

      const { data: report } = await supabase
        .from("ats_reports")
        .select("score, job_description")
        .eq("cv_id", cvId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (report) {
        setLastReport(report);
      }

      setIsLoadingCv(false);
    }

    fetchData();
  }, [cvId]);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvId,
          jobDescription: lastReport?.job_description,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'optimisation.");
      }

      setResult(data);
    } catch (err) {
      console.error("[Optimize Error]:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsOptimizing(false);
    }
  };

  if (!cvId) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-6">
        <div className="w-24 h-24 mx-auto bg-red-50 rounded-[2.5rem] flex items-center justify-center text-5xl mb-8">
          ⚠️
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">
          Action requise
        </h2>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
          Vous devez d'abord sélectionner un CV dans votre espace profil pour
          lancer l'optimisation IA.
        </p>
        <Button asChild size="lg" variant="primary">
          <Link href="/dashboard/ats">
            Retour à l'Analyseur ATS <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </Button>
      </div>
    );
  }

  if (isLoadingCv) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">
          Préparation de l'éditeur
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Éditeur <span className="text-violet-600">IA Premium</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Réécriture stratégique de vos expériences pour maximiser l'impact.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
          <Sparkles className="w-4 h-4 text-violet-500 fill-violet-500" />
          <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
            Moteur Mistral Large
          </span>
        </div>
      </div>

      {!result ? (
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] border border-slate-100 p-10 md:p-16 shadow-xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600" />

            <div className="w-24 h-24 mx-auto bg-violet-50 rounded-[2rem] flex items-center justify-center text-5xl mb-8 shadow-inner">
              ✨
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-6">
              Prêt à transformer votre candidature ?
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-left mb-12">
              <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <FileText className="w-3.5 h-3.5" /> Document Source
                </div>
                <div className="font-black text-slate-900 truncate">
                  {cvData?.file_name}
                </div>
              </div>
              <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Target className="w-3.5 h-3.5" /> Score Actuel
                </div>
                <div className="font-black text-slate-900 flex items-center gap-2 text-2xl">
                  {lastReport?.score ?? "—"}%
                  {lastReport && lastReport.score < 65 && (
                    <span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-1 rounded-lg uppercase tracking-wider animate-pulse">
                      Action Requise
                    </span>
                  )}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-6 bg-red-50 text-red-700 rounded-[1.5rem] border border-red-100 font-bold flex flex-col items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                  {error.includes("credit") && (
                    <Link
                      href="/dashboard/credits"
                      className="text-sm underline underline-offset-4"
                    >
                      Acheter des crédits pour continuer
                    </Link>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <Button
                onClick={handleOptimize}
                disabled={isOptimizing}
                size="lg"
                className="px-12 h-16 rounded-[1.5rem] bg-slate-900 text-white hover:bg-slate-800 shadow-2xl shadow-slate-900/20 text-lg group"
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin mr-3" />
                    Réécriture par l'IA...
                  </>
                ) : (
                  <>
                    Générer mon CV Optimisé{" "}
                    <Sparkles className="ml-3 w-5 h-5 text-violet-400 fill-violet-400 group-hover:scale-125 transition-transform" />
                  </>
                )}
              </Button>
              <div className="flex items-center justify-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{" "}
                Coût : 1 crédit
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="grid xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8">
            {/* Résumé */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-sm"
            >
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Layout className="w-5 h-5" />
                </div>
                Accroche Professionnelle
              </h3>
              <div className="p-8 bg-violet-50/50 rounded-[2rem] border border-violet-100 text-slate-700 font-medium leading-relaxed italic text-lg relative">
                <span className="absolute top-4 left-4 text-4xl text-violet-200 font-serif">
                  “
                </span>
                {result.improvedSummary}
                <span className="absolute bottom-2 right-4 text-4xl text-violet-200 font-serif rotate-180">
                  “
                </span>
              </div>
            </motion.div>

            {/* Expériences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-sm"
            >
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                Réécriture Stratégique (Before/After)
              </h3>
              <div className="space-y-10">
                {result.improvedBullets.map((bullet, idx) => (
                  <div key={idx} className="group grid gap-4">
                    <div className="relative p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 opacity-60">
                      <div className="absolute -top-3 left-6 bg-slate-200 text-slate-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        Original
                      </div>
                      <p className="text-sm font-medium text-slate-500 line-through decoration-slate-300 decoration-1">
                        {bullet.original}
                      </p>
                    </div>
                    <div className="relative p-6 bg-white rounded-[1.5rem] border-2 border-emerald-100 shadow-lg shadow-emerald-500/5 group-hover:border-emerald-500 transition-colors">
                      <div className="absolute -top-3 left-6 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Optimisé ATS
                      </div>
                      <p className="text-base font-black text-slate-900 leading-relaxed">
                        {bullet.improved}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="xl:col-span-4 space-y-8">
            {/* PDF EXPORT - PRIORITÉ CRITIQUE */}
            <ExportButton cvData={result.cvData} />

            {/* Mots-clés */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">
                Mots-clés stratégiques injectés
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.keywordsAdded.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-2 bg-blue-50 text-blue-700 text-[11px] font-black rounded-xl border border-blue-100"
                  >
                    +{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Raccordement Interview */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-xl relative group">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-[1rem] bg-white/10 flex items-center justify-center mb-6">
                <Mic2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-3">Passez à l'action !</h3>
              <p className="text-sm font-medium text-blue-100 mb-8 leading-relaxed">
                Votre CV est prêt. La prochaine étape cruciale est de vous
                entraîner à l'oral pour ce poste.
              </p>
              <Button
                asChild
                variant="secondary"
                className="w-full bg-white text-blue-600 hover:bg-slate-100 border-none font-black h-14 rounded-2xl"
              >
                <Link href={`/dashboard/interview/session?cvId=${cvId}`}>
                  Lancer la simulation <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
            >
              Générer une nouvelle version
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OptimizeDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
        </div>
      }
    >
      <OptimizeDashboardContent />
    </Suspense>
  );
}
