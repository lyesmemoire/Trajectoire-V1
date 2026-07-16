import { useState, useEffect } from "react";
import { Button } from "@/components/design-system/button";
import { Download, Share2, Trophy, Target, TrendingUp } from "lucide-react";
import { ErrorAlert } from "@/components/ui/error-alert";

interface Step7ReportProps {
  journey: any;
  journeyId: string;
  onNext: () => void;
  onPrevious: () => void;
}

export function Step7Report({ journey, journeyId, onPrevious }: Step7ReportProps) {
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (journey.data?.finalReport) {
      setReport(journey.data.finalReport);
    } else {
      generateReport();
    }
  }, [journey]);

  const generateReport = async () => {
    setError(null);
    try {
      const response = await fetch("/api/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generateFinalReport",
          journeyId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setReport(result.data);
      } else {
        setError(result.error || "Erreur lors de la génération du rapport");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    }
  };

  if (!report) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Génération du rapport...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Rapport final</h2>
        <p className="text-gray-600">
          Félicitations ! Voici le bilan complet de votre parcours d'optimisation.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-green-600" />
          <div>
            <h3 className="text-xl font-bold text-green-800">Parcours terminé !</h3>
            <p className="text-green-600">Vous avez complété toutes les étapes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Niveau de préparation</h3>
          </div>
          <div className="text-2xl font-bold text-blue-600">{report.readiness_level}</div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">Évaluation globale</h3>
          </div>
          <div className="text-2xl font-bold text-purple-600">{report.overall_assessment}</div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">Scores par dimension</h3>
        <div className="space-y-3">
          {Object.entries(report.dimension_scores || {}).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{key.replace(/_/g, " ")}</span>
                <span className="font-medium">{value as number}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${value as number}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold mb-3">Points forts</h3>
        <ul className="space-y-2">
          {report.strengths?.map((strength: string, index: number) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5" />
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {report.development_areas && report.development_areas.length > 0 && (
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold mb-3">Axes d'amélioration</h3>
          <ul className="space-y-2">
            {report.development_areas.map((area: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-1.5" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">Cohérence du CV</h3>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          report.cv_coherence?.is_coherent ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {report.cv_coherence?.is_coherent ? "✓ Cohérent" : "✗ Incohérent"}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Revoir les étapes
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Partager
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Télécharger le rapport
          </Button>
        </div>
      </div>
    </div>
  );
}
