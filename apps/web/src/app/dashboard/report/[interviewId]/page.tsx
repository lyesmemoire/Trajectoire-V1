"use client";

import { useEffect, useState } from "react";
import UnifiedHeader from "../../../../components/report/UnifiedHeader";
import ExecutiveOverview from "../../../../components/report/ExecutiveOverview";
import DualBreakdown from "../../../../components/report/DualBreakdown";
import IntegritySection from "../../../../components/report/IntegritySection";
import ExecutiveImpression from "../../../../components/report/ExecutiveImpression";
import DecisionSimulation from "../../../../components/report/DecisionSimulation";

interface ReportData {
  finalExecutiveScore: number;
  percentile: number;
  integrityRiskIndex: number;
  integrityRiskLevel: "Low" | "Moderate" | "High" | "Critical";
  cvScore: number;
  interviewScore: number;
  communicationScore: number;
  technicalDepthScore: number;
  quantificationDepthScore: number;
  leadershipCompositeScore: number;
  consistencyGap: number;
  executiveImpression: string;
  decisionSimulation: {
    hr: "PASS" | "BORDERLINE" | "FAIL";
    technical: "PASS" | "BORDERLINE" | "FAIL";
    committee: "PASS" | "BORDERLINE" | "FAIL";
  };
  metadata: {
    engineVersion: string;
    timestamp: string;
  };
  isPremium?: boolean;
}

export default function ReportPage({ params }: { params: { interviewId: string } }) {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/interviews/${params.interviewId}/report`);
        if (!res.ok) throw new Error("Failed to load report");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [params.interviewId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#9CA3AF] font-sans">Chargement du dossier exécutif...</div>;
  if (error || !data) return <div className="min-h-screen flex items-center justify-center text-red-500 font-sans">Erreur: {error || "Données introuvables"}</div>;

  return (
    <div className="max-w-4xl mx-auto py-20 px-8 text-[#E5E7EB] font-sans">
      <UnifiedHeader 
        targetRole="Engineering Manager" // In reality, fetch from context
        date={data.metadata.timestamp}
      />

      <main className="mt-16 space-y-16">
        <ExecutiveOverview 
          finalScore={data.finalExecutiveScore}
          percentile={data.percentile}
          integrityRiskLevel={data.integrityRiskLevel}
        />

        <DualBreakdown 
          cvScore={data.cvScore}
          interviewScore={data.interviewScore}
          technicalDepthScore={data.technicalDepthScore}
          communicationScore={data.communicationScore}
          quantificationDepthScore={data.quantificationDepthScore}
          leadershipCompositeScore={data.leadershipCompositeScore}
        />

        <IntegritySection consistencyGap={data.consistencyGap} />
        
        {/* ── Premium Wall / Cabinet Blur ── */}
        <div className="relative mt-16">
          <div className={`transition-all duration-700 ${!data.isPremium ? 'blur-md grayscale opacity-40 pointer-events-none select-none' : ''}`}>
            <div className="space-y-16">
              <ExecutiveImpression impressionText={data.executiveImpression} />
              
              <DecisionSimulation 
                hr={data.decisionSimulation.hr}
                technical={data.decisionSimulation.technical}
                committee={data.decisionSimulation.committee}
              />
            </div>
          </div>

          {!data.isPremium && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="pointer-events-auto max-w-lg w-full bg-[#111827]/90 border border-[#1F2937] p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center">
                
                <div className="w-full text-center mb-10">
                  <h3 className="font-serif text-xl text-[#E5E7EB] tracking-wide mb-1">
                    Executive Assessment Preview
                  </h3>
                  <p className="text-[#9CA3AF] text-sm font-light">
                    Accès limité. Aperçu de votre évaluation.
                  </p>
                </div>

                <div className="w-full border-t border-[#1F2937] pt-8 text-center mb-8">
                  <h3 className="font-serif text-xl text-[#E5E7EB] tracking-wide mb-1">
                    Executive Report – 29€ / mois
                  </h3>
                  <p className="text-[#9CA3AF] text-sm font-light leading-relaxed mb-6">
                    Rapport complet. Historique. Analyse détaillée.
                  </p>
                  
                  <button 
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/stripe/checkout", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ priceId: "price_premium_access" })
                        });
                        const { url } = await res.json();
                        if (url) window.location.href = url;
                      } catch (e) {
                        console.error("Checkout failed", e);
                      }
                    }}
                    className="bg-[#E5E7EB] text-[#0B0F14] px-8 py-3 text-sm font-medium hover:bg-white transition-colors duration-200"
                  >
                    Accéder au rapport complet
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-[#9CA3AF] text-xs font-light italic">
                    Version initiale disponible à 19€/mois pour les premiers utilisateurs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
