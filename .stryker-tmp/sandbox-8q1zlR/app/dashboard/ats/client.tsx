// @ts-nocheck
"use client";

import { useState, useEffect, Suspense, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { runATSAnalysis } from "./actions";
import {
  Target,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/design-system";
import { Card, CardContent } from "@/components/design-system";
import { AtsAnalysisAnimation } from "@/components/candidate/ats-analysis-animation";
import { AtsReportPremium } from "@/components/candidate/ats-report-premium";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ATSResult {
  reportId: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  feedback: string;
  confidence: number;
  isPartial: boolean;
  lockedInsights?: boolean;
}

interface CV {
  id: string;
  file_name: string;
}

// ─── Score color helper ─────────────────────────────────────────────────────

function getScoreColor(score: number) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-error";
}

function getScoreBg(score: number) {
  if (score >= 75) return "bg-success/10 border-success/20";
  if (score >= 50) return "bg-warning/10 border-warning/20";
  return "bg-error/10 border-error/20";
}

function getScoreLabel(score: number) {
  if (score >= 85) return "Excellent — Candidature très compétitive";
  if (score >= 75) return "Bon — Bien positionné, quelques ajustements";
  if (score >= 60) return "Correct — Améliorations nécessaires";
  if (score >= 40) return "Faible — Refonte significative recommandée";
  return "Critique — CV inadapté à cette offre";
}

// ─── Main Component ─────────────────────────────────────────────────────────

function ATSContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCvId = searchParams.get("cvId");

  const [cvs, setCvs] = useState<CV[]>([]);
  const [selectedCvId, setSelectedCvId] = useState<string>(initialCvId || "");
  const [isLoadingCvs, setIsLoadingCvs] = useState(true);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showAnimation, setShowAnimation] = useState(false);

  // ── Fetch CVs on mount ──────────────────────────────────────────────────

  useEffect(() => {
    async function loadCVs() {
      const { data } = await supabase
        .from("cvs")
        .select("id, file_name")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setCvs(data);
        if (!selectedCvId) setSelectedCvId((data[0] as any).id);
      }
      setIsLoadingCvs(false);
    }
    loadCVs();
  }, []);  

  // ── Run analysis ────────────────────────────────────────────────────────

  const handleAnalyze = () => {
    if (!selectedCvId || jobDescription.length < 50) return;

    setError(null);
    setResult(null);
    setIsBlocked(false);
    setShowAnimation(true);

    startTransition(async () => {
      try {
        const data = await runATSAnalysis(selectedCvId, jobDescription);
        setShowAnimation(false);
        setResult(data as any);
      } catch (err: any) {
        setShowAnimation(false);
        const message = err?.message || "Erreur inconnue";

        if (message === "upgrade_required") {
          setIsBlocked(true);
          return;
        }

        setError(message);
      }
    });
  };

  // ── No CVs state ────────────────────────────────────────────────────────

  if (!isLoadingCvs && cvs.length === 0) {
    return (
      <Card variant="elevated">
        <CardContent className="py-20 text-center">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-text mb-3">Aucun CV disponible</h2>
          <p className="text-text-secondary mb-8">
            Ajoutez un CV depuis votre espace Documents pour lancer une analyse ATS.
          </p>
          <Button asChild>
            <Link href="/dashboard/cvs">
              Aller à Mes CV <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── Main UI ─────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-semibold text-text tracking-tight">
          Analyse <span className="text-primary">ATS</span>
        </h1>
        <p className="text-text-secondary mt-2">
          Comparez votre CV à une offre d'emploi et obtenez un score de compatibilité.
        </p>
      </div>

      {/* Input Section */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card variant="elevated">
            <CardContent className="p-8 space-y-6">
              {/* CV Selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  1. Sélectionner un CV
                </label>
                <select
                  value={selectedCvId}
                  onChange={(e) => setSelectedCvId(e.target.value)}
                  disabled={isLoadingCvs}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-medium text-text outline-none focus:border-primary transition-colors"
                >
                  {cvs.map((cv) => (
                    <option key={cv.id} value={cv.id}>
                      {cv.file_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  2. Coller l'offre d'emploi
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Collez ici le texte de l'offre d'emploi (minimum 50 caractères)..."
                  className="w-full h-64 p-4 rounded-lg border border-gray-200 bg-gray-50 focus:border-primary outline-none text-text font-medium resize-none leading-relaxed transition-colors"
                />
                <p className="text-xs text-text-muted">
                  {jobDescription.length} / 50 caractères minimum
                </p>
              </div>

              {/* Submit */}
              <Button
                onClick={handleAnalyze}
                disabled={isPending || jobDescription.length < 50 || !selectedCvId}
                className="w-full py-6 rounded-lg text-lg h-auto"
                size="lg"
              >
                {isPending ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyse en cours...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <Target className="w-5 h-5" />
                    Lancer l'analyse ATS
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Result Section */}
        <div className="lg:col-span-7">
          {error && (
            <Card variant="elevated" className="mb-6 bg-error/5 border-error/20">
              <CardContent className="p-6 flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-error shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-text">Erreur</h3>
                  <p className="text-text-secondary text-sm mt-1">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {showAnimation && (
            <Card className="bg-white border border-gray-200/60 shadow-sm">
              <CardContent className="p-8">
                <AtsAnalysisAnimation onComplete={() => {}} />
              </CardContent>
            </Card>
          )}

          {!result && !isPending && !error && !isBlocked && (
            <Card variant="default">
              <CardContent className="h-full bg-gray-50 border-2 border-dashed border-gray-200 p-16 flex flex-col items-center justify-center text-center space-y-4">
                <Target className="w-10 h-10 text-text-muted" />
                <p className="text-sm font-medium uppercase tracking-wider text-text-muted">
                  Prêt pour l'analyse
                </p>
                <p className="text-xs text-text-muted max-w-xs">
                  Sélectionnez un CV et collez une offre d'emploi pour obtenir votre score ATS.
                </p>
              </CardContent>
            </Card>
          )}

          {isBlocked && (
            <Card variant="elevated">
              <CardContent className="h-full p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-warning" />
                </div>
                <p className="text-xl font-semibold text-text mb-2">
                  Analyse gratuite utilisée
                </p>
                <p className="text-text-secondary mb-8 max-w-sm">
                  Continuez avec un plan adapté à vos ambitions pour débloquer l'analyse illimitée.
                </p>
                <Button asChild size="lg">
                  <Link href="/dashboard/billing">
                    Découvrir les plans <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {result && (
            <AtsReportPremium
              score={result.score}
              matchedSkills={result.matchedSkills}
              missingSkills={result.missingSkills}
              strengths={result.feedback ? [result.feedback] : []}
              weaknesses={[]}
              recommendations={result.feedback ? [result.feedback] : []}
              cvId={selectedCvId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Result Display ─────────────────────────────────────────────────────────

function ResultDisplay({ result, cvId }: { result: ATSResult; cvId: string }) {
  const isLocked = result.lockedInsights === true;

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <Card variant="elevated" className={getScoreBg(result.score)}>
        <CardContent className="p-8">
          <div className="flex items-baseline gap-4 mb-3">
            <span className={`text-6xl font-semibold ${getScoreColor(result.score)}`}>
              {result.score}%
            </span>
            <span className="text-sm font-medium text-text-muted uppercase tracking-wider">
              Score ATS
            </span>
          </div>
          <p className="text-text font-medium">{getScoreLabel(result.score)}</p>
        </CardContent>
      </Card>

      {/* Locked Banner */}
      {isLocked && (
        <>
          <p className="text-sm text-text-secondary mb-2">
            Vous voyez une version partielle de votre analyse.
          </p>
          <Card variant="elevated" className="bg-primary/5 border-primary/10">
            <CardContent className="p-6 space-y-4">
              <p className="font-semibold text-primary text-lg flex items-center gap-2">
                🔒 Débloquez l'analyse complète
              </p>
              <ul className="text-sm space-y-2 text-text font-medium">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"/> Plan d'action détaillé</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"/> Compétences manquantes</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"/> Analyse section par section</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"/> Suivi de progression illimité</li>
              </ul>

              <Button asChild size="lg" className="mt-4">
                <Link href="/dashboard/billing">
                  Voir les plans
                </Link>
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* Skills Grid */}
      <div className={`grid ${isLocked ? 'grid-cols-1' : 'sm:grid-cols-2'} gap-6`}>
        {/* Matched */}
        <Card variant="elevated">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <h3 className="font-semibold text-text">Compétences matchées</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.matchedSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-success/10 text-success text-xs font-medium rounded-lg border border-success/20"
                >
                  {skill}
                </span>
              ))}
              {result.matchedSkills.length === 0 && (
                <p className="text-sm text-text-muted italic">Aucune compétence matchée</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Missing */}
        {!isLocked && (
          <Card variant="elevated">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-error" />
                <h3 className="font-semibold text-text">Compétences manquantes</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-error/10 text-error text-xs font-medium rounded-lg border border-error/20"
                  >
                    {skill}
                  </span>
                ))}
                {result.missingSkills.length === 0 && (
                  <p className="text-sm text-text-muted italic">Aucune compétence manquante</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Feedback */}
      <Card variant="elevated">
        <CardContent className="p-6 space-y-3">
          <h3 className="font-semibold text-text">Recommandations</h3>
          <p className="text-text-secondary leading-relaxed">{result.feedback}</p>
        </CardContent>
      </Card>

      {/* CTA: Optimize */}
      <Card variant="elevated" className="bg-primary/5 border-primary/10">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold text-text">Envie d'améliorer ce score ?</h3>
              <p className="text-sm text-text-secondary">Lancez l'optimisation pour réécrire votre CV.</p>
            </div>
          </div>
          <Button asChild size="lg">
            <Link href={`/dashboard/optimize?cvId=${cvId}`}>
              Optimiser <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function ATSDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      }
    >
      <ATSContent />
    </Suspense>
  );
}
