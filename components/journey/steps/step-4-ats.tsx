import { useState, useEffect } from "react";
import { Button } from "@/components/design-system/button";
import { BarChart, Check, AlertTriangle } from "lucide-react";
import { ErrorAlert } from "@/components/ui/error-alert";

interface Step4ATSProps {
  journey: any;
  journeyId: string;
  onNext: () => void;
  onPrevious: () => void;
}

export function Step4ATS({ journey, journeyId, onNext, onPrevious }: Step4ATSProps) {
  const [atsResult, setAtsResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    if (journey.data?.atsAnalysisResult) {
      setAtsResult(journey.data.atsAnalysisResult);
      setIsLoading(false);
    } else {
      runATSAnalysis();
    }
  }, [journey]);

  const runATSAnalysis = async () => {
    setError(null);
    try {
      const response = await fetch("/api/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyzeAts",
          journeyId,
          stepData: { cvText: journey.data?.cvText || "" },
        }),
      });

      const result = await response.json();
      if (result.success) {
        setAtsResult(result.data);
        setCanProceed(true);
      } else {
        setError(result.error || "Erreur lors de l'analyse ATS");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Analyse ATS en cours...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Résultats de l'analyse ATS</h2>
        <p className="text-gray-600">
          Découvrez comment votre CV est évalué par les systèmes de recrutement automatisés.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {atsResult && (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Score de compatibilité</h3>
              <div className="text-3xl font-bold text-blue-600">{atsResult.score}%</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${atsResult.score}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Check className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Mots-clés trouvés</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {atsResult.matchedKeywords?.map((keyword: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-800">Mots-clés manquants</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {atsResult.missingKeywords?.map((keyword: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Points forts</h3>
            <ul className="space-y-2">
              {atsResult.strengths?.map((strength: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Recommandations</h3>
            <ul className="space-y-2">
              {atsResult.recommendations?.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <BarChart className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Précédent
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Continuer vers l'optimisation
        </Button>
      </div>
    </div>
  );
}
