// @ts-nocheck
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
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
import { Button } from "@/components/design-system";
import { Card, CardContent } from "@/components/design-system";
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
      <Card variant="elevated">
        <CardContent className="max-w-xl mx-auto text-center py-20 px-6">
          <div className="w-24 h-24 mx-auto bg-error/10 rounded-[2.5rem] flex items-center justify-center text-5xl mb-8">
            ⚠️
          </div>
          <h2 className="text-3xl font-semibold text-text mb-4">
            Action requise
          </h2>
          <p className="text-text-secondary mb-10 leading-relaxed">
            Vous devez d'abord sélectionner un CV dans votre espace profil pour
            lancer l'optimisation.
          </p>
          <Button asChild size="lg">
            <Link href="/dashboard/ats">
              Retour à l'Analyseur ATS <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingCv) {
    return (
      <Card variant="elevated">
        <CardContent className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-text-muted font-medium uppercase tracking-wider text-xs">
            Préparation de l'éditeur
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-text">
            Éditeur <span className="text-primary">Premium</span>
          </h1>
          <p className="text-text-secondary mt-2">
            Réécriture stratégique de vos expériences pour maximiser l'impact.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-surface border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
            Moteur Premium
          </span>
        </div>
      </div>

      {!result ? (
        <div className="max-w-4xl mx-auto">
          <Card variant="elevated">
            <CardContent className="p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-primary/80 to-primary" />

              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-[2rem] flex items-center justify-center text-5xl mb-8">
                ✨
              </div>
              <h2 className="text-3xl font-semibold text-text mb-6">
                Prêt à transformer votre candidature ?
              </h2>

              <div className="grid md:grid-cols-2 gap-6 text-left mb-12">
                <Card variant="default">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-text-muted uppercase tracking-wider">
                      <FileText className="w-3.5 h-3.5" /> Document Source
                    </div>
                    <div className="font-semibold text-text truncate">
                      {cvData?.file_name}
                    </div>
                  </CardContent>
                </Card>
                <Card variant="default">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-text-muted uppercase tracking-wider">
                      <Target className="w-3.5 h-3.5" /> Score Actuel
                    </div>
                    <div className="font-semibold text-text flex items-center gap-2 text-2xl">
                      {lastReport?.score ?? "—"}%
                      {lastReport && lastReport.score < 65 && (
                        <span className="text-xs font-medium bg-error/10 text-error px-2 py-1 rounded-lg uppercase tracking-wider">
                          Action Requise
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 p-6 bg-error/5 text-error rounded-lg border border-error/20 font-medium flex flex-col items-center gap-2"
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
                  className="px-12 h-16 text-lg"
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin mr-3" />
                      Réécriture en cours...
                    </>
                  ) : (
                    <>
                      Générer mon CV Optimisé{" "}
                      <Sparkles className="ml-3 w-5 h-5 group-hover:scale-125 transition-transform" />
                    </>
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 text-text-muted font-medium uppercase tracking-wider text-xs">
                  <Zap className="w-3.5 h-3.5 text-warning" />{" "}
                  Coût : 1 crédit
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8">
            {/* Résumé */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="elevated">
                <CardContent className="p-8 md:p-10">
                  <h3 className="text-xl font-semibold text-text mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Layout className="w-5 h-5" />
                    </div>
                    Accroche Professionnelle
                  </h3>
                  <div className="p-8 bg-primary/5 rounded-lg border border-primary/10 text-text font-medium leading-relaxed italic text-lg relative">
                    <span className="absolute top-4 left-4 text-4xl text-primary/20 font-serif">
                      "
                    </span>
                    {result.improvedSummary}
                    <span className="absolute bottom-2 right-4 text-4xl text-primary/20 font-serif rotate-180">
                      "
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Expériences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="elevated">
                <CardContent className="p-8 md:p-10">
                  <h3 className="text-xl font-semibold text-text mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 text-success flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    Réécriture Stratégique (Before/After)
                  </h3>
                  <div className="space-y-10">
                    {result.improvedBullets.map((bullet, idx) => (
                      <div key={idx} className="group grid gap-4">
                        <Card variant="default">
                          <CardContent className="relative p-6 opacity-60">
                            <div className="absolute -top-3 left-6 bg-gray-200 text-text-muted text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wider">
                              Original
                            </div>
                            <p className="text-sm font-medium text-text-muted line-through decoration-gray-300 decoration-1">
                              {bullet.original}
                            </p>
                          </CardContent>
                        </Card>
                        <Card variant="elevated" className="border-2 border-success/20 group-hover:border-success transition-colors">
                          <CardContent className="relative p-6">
                            <div className="absolute -top-3 left-6 bg-success text-white text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Optimisé
                            </div>
                            <p className="text-base font-semibold text-text leading-relaxed">
                              {bullet.improved}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="xl:col-span-4 space-y-8">
            {/* PDF EXPORT - PRIORITÉ CRITIQUE */}
            <ExportButton cvData={result.cvData} />

            {/* Mots-clés */}
            <Card variant="elevated">
              <CardContent className="p-8">
                <h3 className="text-sm font-medium text-text uppercase tracking-wider mb-6">
                  Mots-clés stratégiques injectés
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywordsAdded.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 bg-primary/10 text-primary text-xs font-medium rounded-lg border border-primary/20"
                    >
                      +{kw}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Raccordement Interview */}
            <Card variant="elevated" className="bg-gradient-to-br from-primary to-primary/80 text-white">
              <CardContent className="p-10 relative group">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-6">
                  <Mic2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Passez à l'action !</h3>
                <p className="text-sm font-medium text-white/80 mb-8 leading-relaxed">
                  Votre CV est prêt. La prochaine étape cruciale est de vous
                  entraîner à l'oral pour ce poste.
                </p>
                <Button
                  asChild
                  variant="secondary"
                  className="w-full bg-white text-primary hover:bg-gray-100 border-none font-medium h-14 rounded-lg"
                >
                  <Link href={`/dashboard/interview/session?cvId=${cvId}`}>
                    Lancer la simulation <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <button
              onClick={() => setResult(null)}
              className="w-full py-4 text-xs font-medium text-text-muted uppercase tracking-wider hover:text-text transition-colors"
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
