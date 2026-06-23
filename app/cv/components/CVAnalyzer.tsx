"use client";

import { useState } from "react";
import {
  Upload,
  Sparkles,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExportButton } from "@/components/cv/ExportButton";
import { UpgradeGate } from "@/components/billing/UpgradeGate";
import { CVEditor } from "./CVEditor";
import type { CVData } from "@/lib/pdf/types";

interface AnalysisResult {
  originalText: string;
  optimizedText: string;
  cvData: CVData;
  improvements: Array<{
    type: "strength" | "addition" | "rewrite" | "warning";
    section: string;
    description: string;
  }>;
  atsScore: { before: number; after: number };
  keywords: { added: string[]; existing: string[] };
}

export function CVAnalyzer({ userId }: { userId: string }) {
  const [step, setStep] = useState<
    "idle" | "uploading" | "analyzing" | "done" | "error"
  >("idle");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"improvements" | "editor">(
    "improvements",
  );

  const handleFile = async (f: File) => {
    setFile(f);
    setStep("uploading");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", f);
      setStep("analyzing");

      const res = await fetch("/api/cv/analyze", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Erreur d'analyse");

      const data = await res.json();
      setResult(data);
      setStep("done");
    } catch (err: any) {
      setError(err.message);
      setStep("error");
    }
  };

  return (
    <div className="space-y-6">
      {step === "idle" && (
        <div
          className="border-4 border-dashed border-slate-200 rounded-[3rem] p-20 text-center hover:border-blue-400 transition-all cursor-pointer bg-white"
          onClick={() => document.getElementById("cv-upload")?.click()}
        >
          <input
            type="file"
            id="cv-upload"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && handleFile(e.target.files[0])
            }
          />
          <Upload className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-black text-slate-900">
            Déposez votre CV ici
          </h3>
          <p className="text-slate-400 font-bold mt-2">
            PDF, DOCX ou TXT supportés
          </p>
        </div>
      )}

      {(step === "uploading" || step === "analyzing") && (
        <div className="bg-white rounded-[3rem] border border-slate-100 p-12 text-center shadow-xl">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-6" />
          <h3 className="text-2xl font-black text-slate-900 mb-2">
            Traitement par Mistral Large...
          </h3>
          <Progress
            value={step === "uploading" ? 30 : 70}
            className="h-2 max-w-md mx-auto"
          />
        </div>
      )}

      {step === "done" && result && (
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm flex items-center justify-between">
              <div className="flex gap-4 bg-slate-100 p-1 rounded-2xl">
                <button
                  onClick={() => setActiveView("improvements")}
                  className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeView === "improvements" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                >
                  Améliorations
                </button>
                <button
                  onClick={() => setActiveView("editor")}
                  className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeView === "editor" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                >
                  Éditeur Live
                </button>
              </div>
              <Button
                onClick={() => setStep("idle")}
                variant="ghost"
                className="font-black text-slate-400"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Changer
              </Button>
            </div>

            {activeView === "improvements" ? (
              <div className="space-y-4">
                {result.improvements.map((imp, i) => {
                  const content = (
                    <div
                      className={`p-6 rounded-[2rem] border flex gap-4 ${imp.type === "strength" ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        {imp.type === "strength" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-400">
                          {imp.section}
                        </span>
                        <p className="text-slate-900 font-bold mt-1">
                          {imp.description}
                        </p>
                      </div>
                    </div>
                  );

                  if (imp.type === "locked") {
                    return (
                      <UpgradeGate 
                        key={i}
                        isAllowed={false} 
                        mode="blur"
                        customTitle="Conseil Premium verrouillé"
                        customMessage="Tu es à 15 minutes d'un entretien parfait. Ne laisse pas une réponse hésitante gâcher des mois de recherche."
                      >
                        {content}
                      </UpgradeGate>
                    );
                  }

                  return <div key={i}>{content}</div>;
                })}
              </div>
            ) : (
              <CVEditor
                original={result.originalText}
                optimized={result.optimizedText}
              />
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
              <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6">
                Score de Compatibilité
              </h4>
              <div className="flex items-end gap-4 mb-6">
                <span className="text-6xl font-black">
                  {result.atsScore.after}%
                </span>
                <span className="text-emerald-400 font-black mb-2 text-sm">
                  +{result.atsScore.after - result.atsScore.before}pts
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${result.atsScore.after}%` }}
                />
              </div>
            </div>

            <ExportButton cvData={result.cvData} />

            <div className="bg-white rounded-[2rem] border border-slate-100 p-8">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                Mots-clés stratégiques
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.keywords.added.map((kw, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-100"
                  >
                    +{kw}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
