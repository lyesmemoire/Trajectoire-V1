"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  Activity,
  CheckCircle2,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Target,
  Crosshair,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExportButton } from "@/components/cv/ExportButton";
import { CVEditor } from "./CVEditor";
import type { ParsedCV, JobTarget, AlignmentScore } from "@/types/cv";
import type { GlobalDiagnostic } from "@/lib/cv/scoring";

interface AnalysisResult {
  originalText: string;
  cvData: ParsedCV;
  diagnostic: GlobalDiagnostic;
}

export function CVAnalyzer({ userId }: { userId: string }) {
  const [step, setStep] = useState<
    "idle" | "uploading" | "analyzing" | "done" | "error"
  >("idle");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rewriting, setRewriting] = useState<Record<string, boolean>>({});
  const [suggestions, setSuggestions] = useState<Record<string, { improvedBullet: string; explanation: string; confidence: number }>>({});
  
  const [activeView, setActiveView] = useState<"diagnostic" | "editor">(
    "diagnostic",
  );

  // Job Targeting State
  const [jobText, setJobText] = useState("");
  const [isExtractingJob, setIsExtractingJob] = useState(false);
  const [jobTarget, setJobTarget] = useState<JobTarget | null>(null);
  const [alignmentScore, setAlignmentScore] = useState<AlignmentScore | null>(null);

  // Interview Generation State
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [interviewSessionId, setInterviewSessionId] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<any | null>(null);

  useEffect(() => {
    if (result && jobTarget) {
      import("@/lib/cv/matching").then(({ evaluateAlignment }) => {
        setAlignmentScore(evaluateAlignment(result.cvData, jobTarget));
      });
    }
  }, [result, jobTarget]);

  const handleExtractJob = async () => {
    if (!jobText.trim()) return;
    setIsExtractingJob(true);
    try {
      const res = await fetch("/api/cv/extract-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobText }),
      });
      if (!res.ok) throw new Error("Erreur d'analyse de l'offre");
      const data = await res.json();
      setJobTarget(data);
      setJobText("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsExtractingJob(false);
    }
  };

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
  
  const handleRewriteBullet = async (expIndex: number, bulletIndex: number, originalBullet: string, issues: string[]) => {
    setRewriting(prev => ({ ...prev, [`${expIndex}-${bulletIndex}`]: true }));
    try {
      const res = await fetch("/api/cv/rewrite-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalBullet, issues, jobContext: jobTarget }),
      });
      if (!res.ok) throw new Error("Erreur de réécriture");
      const data = await res.json();
      setSuggestions(prev => ({ ...prev, [`${expIndex}-${bulletIndex}`]: data }));
    } catch (err: any) {
      console.error(err);
    } finally {
      setRewriting(prev => ({ ...prev, [`${expIndex}-${bulletIndex}`]: false }));
    }
  };

  const acceptSuggestion = async (expIndex: number, bulletIndex: number) => {
    if (!result || !suggestions[`${expIndex}-${bulletIndex}`]) return;
    
    const newCvData = { ...result.cvData };
    const newBulletText = suggestions[`${expIndex}-${bulletIndex}`].improvedBullet;
    newCvData.experiences[expIndex].bullets[bulletIndex] = newBulletText;
    
    const { evaluateCV } = await import("@/lib/cv/scoring");
    const newDiagnostic = evaluateCV(newCvData);

    setResult({
      ...result,
      cvData: newCvData,
      diagnostic: newDiagnostic
    });

    setSuggestions(prev => {
      const next = { ...prev };
      delete next[`${expIndex}-${bulletIndex}`];
      return next;
    });
  };

  const rejectSuggestion = (expIndex: number, bulletIndex: number) => {
    setSuggestions(prev => {
      const next = { ...prev };
      delete next[`${expIndex}-${bulletIndex}`];
      return next;
    });
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
            Analyse Structurée en cours...
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
                  onClick={() => setActiveView("diagnostic")}
                  className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeView === "diagnostic" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                >
                  Diagnostic
                </button>
                <button
                  onClick={() => setActiveView("editor")}
                  className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeView === "editor" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                >
                  Vue brute
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

            {activeView === "diagnostic" ? (
              <div className="space-y-8">
                {result.diagnostic.sections.map((section, expIndex) => (
                  <div key={expIndex} className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                    <h3 className="font-black text-lg mb-4 text-slate-800">{section.sectionTitle}</h3>
                    <div className="space-y-4">
                      {section.bullets.map((b, bulletIndex) => {
                        const issues = [];
                        if (!b.metrics.actionVerb) issues.push("Manque de verbe d'action");
                        if (!b.metrics.hasQuantification) issues.push("Manque de métrique chiffrée");
                        if (b.metrics.passive) issues.push("Voix passive détectée");
                        if (b.metrics.tooLong) issues.push("Phrase trop longue (>22 mots)");
                        if (b.metrics.tooShort) issues.push("Phrase trop courte (<8 mots)");
                        
                        const isRewriting = rewriting[`${expIndex}-${bulletIndex}`];
                        const suggestion = suggestions[`${expIndex}-${bulletIndex}`];

                        const renderSuggestionText = (text: string) => {
                          return text.split(/(\[X\](?:%|€|k€)?)/g).map((part, i) => 
                            part.startsWith("[X]") ? <span key={i} className="bg-amber-200 text-amber-900 font-bold px-1 rounded mx-0.5" title="À remplacer par vos vraies métriques">{part}</span> : part
                          );
                        };

                        return (
                          <div key={bulletIndex} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                            <p className="text-sm text-slate-700 mb-3 font-medium">{b.bullet}</p>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              {issues.length === 0 ? (
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1"/> Optimal</Badge>
                              ) : (
                                <>
                                  {issues.map((issue, k) => (
                                    <Badge key={k} variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100"><AlertTriangle className="w-3 h-3 mr-1"/> {issue}</Badge>
                                  ))}
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-6 text-[10px] ml-auto border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold rounded-full"
                                    onClick={() => handleRewriteBullet(expIndex, bulletIndex, b.bullet, issues)}
                                    disabled={isRewriting || !!suggestion}
                                  >
                                    {isRewriting ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : (jobTarget ? <Crosshair className="w-3 h-3 mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />)}
                                    {jobTarget ? "Adapter à l'Offre" : "Corriger avec l'IA"}
                                  </Button>
                                </>
                              )}
                            </div>
                            
                            {suggestion && (
                              <div className="mt-4 p-4 bg-white border border-blue-100 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
                                <div className="flex gap-2 items-start mb-3">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <Sparkles className="w-3 h-3 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">{renderSuggestionText(suggestion.improvedBullet)}</p>
                                    <p className="text-xs text-slate-500 mt-1 italic">« {suggestion.explanation} »</p>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-50">
                                  <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-500" onClick={() => rejectSuggestion(expIndex, bulletIndex)}>Ignorer</Button>
                                  <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700" onClick={() => acceptSuggestion(expIndex, bulletIndex)}>Accepter</Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <CVEditor
                original={result.originalText}
                optimized={JSON.stringify(result.cvData, null, 2)}
              />
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-indigo-500" />
                <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest">
                  Cibler une Offre
                </h4>
              </div>
              
              {!jobTarget ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500">
                    Collez la description d'une offre pour ajuster sémantiquement votre CV.
                  </p>
                  <textarea
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                    placeholder="Collez le texte de l'annonce ici..."
                    value={jobText}
                    onChange={e => setJobText(e.target.value)}
                    disabled={isExtractingJob}
                  />
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                    onClick={handleExtractJob}
                    disabled={isExtractingJob || !jobText.trim()}
                  >
                    {isExtractingJob ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Crosshair className="w-4 h-4 mr-2" />}
                    Analyser l'offre
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-bold text-slate-800 text-sm leading-tight">{jobTarget.title}</h5>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-red-500" onClick={() => { setJobTarget(null); setAlignmentScore(null); }}>
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {alignmentScore && jobTarget && (
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex justify-between text-xs font-black mb-2">
                        <span className="text-slate-400">Match Hard Skills</span>
                        <span className={alignmentScore.overallMatch > 70 ? "text-emerald-500" : alignmentScore.overallMatch > 40 ? "text-amber-500" : "text-red-500"}>
                          {alignmentScore.overallMatch}% <span className="font-normal text-slate-400 text-[10px]">({alignmentScore.foundSkills.length}/{jobTarget.mustHaveHardSkills.length} requis)</span>
                        </span>
                      </div>
                      <Progress 
                        value={alignmentScore.overallMatch} 
                        className="h-2 mb-4" 
                        style={{
                          '--progress-background': alignmentScore.overallMatch > 70 ? '#10b981' : alignmentScore.overallMatch > 40 ? '#f59e0b' : '#ef4444'
                        } as any}
                      />

                      <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {alignmentScore.narrativeSynthesis}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {alignmentScore.foundSkills.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Présents</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {alignmentScore.foundSkills.map((s, i) => <Badge key={i} variant="outline" className="text-[10px] border-emerald-200 bg-emerald-50 text-emerald-700">{s}</Badge>)}
                            </div>
                          </div>
                        )}
                        {alignmentScore.missingSkills.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-red-600 uppercase">Manquants</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {alignmentScore.missingSkills.map((s, i) => <Badge key={i} variant="outline" className="text-[10px] border-red-200 bg-red-50 text-red-700">{s}</Badge>)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* TENSION BLOCK - INTERVIEW BRIDGE */}
                      <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200">
                        {!generatedQuestions ? (
                          <div className="text-center bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <p className="text-sm text-slate-800 font-bold mb-2">
                              Votre CV est aligné à {alignmentScore.overallMatch}%.
                            </p>
                            <p className="text-xs text-slate-500 mb-4">
                              Voulez-vous voir les 3 questions pièges qu'un recruteur va très probablement vous poser ?
                            </p>
                            <Button 
                              onClick={async () => {
                                setIsGeneratingQuestions(true);
                                try {
                                  const res = await fetch("/api/interview/generate-questions", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      cvData: result.cvData,
                                      jobTarget: jobTarget,
                                      missingSkills: alignmentScore.missingSkills
                                    })
                                  });
                                  if (!res.ok) throw new Error("Failed to generate questions");
                                  const data = await res.json();
                                  setInterviewSessionId(data.sessionId);
                                  setGeneratedQuestions(data.preparation);
                                } catch (err) {
                                  console.error(err);
                                } finally {
                                  setIsGeneratingQuestions(false);
                                }
                              }}
                              disabled={isGeneratingQuestions}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                            >
                              {isGeneratingQuestions ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Target className="w-4 h-4 mr-2" />}
                              🎯 Générer mes questions probables
                            </Button>
                          </div>
                        ) : (
                          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center gap-2 mb-4">
                              <Activity className="w-5 h-5 text-red-400" />
                              <h5 className="font-black text-sm uppercase tracking-wide text-red-400">Moment de vérité</h5>
                            </div>
                            <p className="text-sm text-slate-300 mb-4">
                              Un recruteur va très probablement vous attaquer sur ces points :
                            </p>
                            <div className="space-y-3 mb-6">
                              {generatedQuestions.questions.map((q: string, i: number) => (
                                <div key={i} className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                                  <p className="text-sm font-medium text-slate-100"><span className="text-blue-400 font-black mr-2">{i+1}.</span>{q}</p>
                                </div>
                              ))}
                            </div>
                            <Button 
                              onClick={() => window.location.href = `/interview/session/${interviewSessionId}`}
                              className="w-full bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.7)] transition-all"
                            >
                              🎙️ Êtes-vous prêt à y répondre de vive voix ?
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
              <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6">
                Score Structurel du CV
              </h4>
              <div className="flex items-end gap-4 mb-6">
                <span className="text-6xl font-black">
                  {result.diagnostic.overallScore.toFixed(1)}<span className="text-3xl text-slate-400">/10</span>
                </span>
              </div>
              
              <div className="space-y-6 mt-8">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-300">Impact (Verbes d'action)</span>
                    <span className="text-white">{result.diagnostic.impactScore.toFixed(1)}/10</span>
                  </div>
                  <Progress value={result.diagnostic.impactScore * 10} className="h-1.5 bg-slate-800" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-300">Clarté (Concision)</span>
                    <span className="text-white">{result.diagnostic.clarityScore.toFixed(1)}/10</span>
                  </div>
                  <Progress value={result.diagnostic.clarityScore * 10} className="h-1.5 bg-slate-800" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-300">Quantification</span>
                    <span className="text-white">{result.diagnostic.quantificationScore.toFixed(1)}/10</span>
                  </div>
                  <Progress value={result.diagnostic.quantificationScore * 10} className="h-1.5 bg-slate-800" />
                </div>
              </div>
            </div>

            <ExportButton cvData={result.cvData as any} />
          </div>
        </div>
      )}
    </div>
  );
}
