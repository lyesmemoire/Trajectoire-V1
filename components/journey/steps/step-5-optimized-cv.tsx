import { useState, useEffect } from "react";
import { Button } from "@/components/design-system/button";
import { FileText, Check, RefreshCw, Download } from "lucide-react";
import { ErrorAlert } from "@/components/ui/error-alert";

interface Step5OptimizedCVProps {
  journey: any;
  journeyId: string;
  onNext: () => void;
  onPrevious: () => void;
}

export function Step5OptimizedCV({ journey, journeyId, onNext, onPrevious }: Step5OptimizedCVProps) {
  const [optimizedCv, setOptimizedCv] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    if (journey.data?.optimizedCv) {
      setOptimizedCv(journey.data.optimizedCv);
    } else {
      optimizeCV();
    }
  }, [journey]);

  const optimizeCV = async () => {
    setError(null);
    setIsOptimizing(true);
    try {
      const response = await fetch("/api/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "optimizeCv",
          journeyId,
          stepData: { cvId: journey.data?.cvId },
        }),
      });

      const result = await response.json();
      if (result.success) {
        setOptimizedCv(result.data);
        setCanProceed(true);
      } else {
        setError(result.error || "Erreur lors de l'optimisation du CV");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAccept = () => {
    setIsAccepted(true);
    setTimeout(() => onNext(), 1000);
  };

  const handleRegenerate = () => {
    setOptimizedCv(null);
    optimizeCV();
  };

  if (isOptimizing) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <div className="text-gray-500">Optimisation du CV en cours...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">CV optimisé</h2>
        <p className="text-gray-600">
          Votre CV a été optimisé pour maximiser votre compatibilité avec l'offre d'emploi.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {optimizedCv && (
        <div className="space-y-4">
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Version optimisée</h3>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Télécharger
              </Button>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{optimizedCv}</pre>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Améliorations apportées</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Mots-clés de l'offre intégrés naturellement</li>
              <li>• Structure optimisée pour les ATS</li>
              <li>• Formulation impactante des réalisations</li>
              <li>• Mise en valeur des compétences pertinentes</li>
            </ul>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Précédent
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRegenerate} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Relancer
          </Button>
          <Button onClick={handleAccept} disabled={!canProceed || isAccepted} className="flex items-center gap-2">
            {isAccepted ? <Check className="w-4 h-4" /> : null}
            {isAccepted ? "Accepté" : "Accepter et continuer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
