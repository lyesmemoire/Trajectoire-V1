import { useState } from "react";
import { Button } from "@/components/design-system/button";
import { Briefcase, Link as LinkIcon, FileText } from "lucide-react";
import { ErrorAlert } from "@/components/ui/error-alert";

interface Step3JobOfferProps {
  journey: any;
  journeyId: string;
  onNext: () => void;
  onPrevious: () => void;
}

export function Step3JobOffer({ journeyId, onNext, onPrevious }: Step3JobOfferProps) {
  const [sourceType, setSourceType] = useState<"URL" | "TEXT">("URL");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canProceed, setCanProceed] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "uploadJobOffer",
          journeyId,
          stepData: sourceType === "URL"
            ? { description: url, source: url, sourceType: "URL_LINKEDIN" }
            : { description: text, sourceType: "RAW_TEXT" },
        }),
      });

      const result = await response.json();
      if (result.success) {
        setUploadSuccess(true);
        setCanProceed(true);
        setTimeout(() => onNext(), 1000);
      } else {
        setError(result.error || "Erreur lors de l'import de l'offre");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Importez l'offre d'emploi</h2>
        <p className="text-gray-600">
          Ajoutez l'offre d'emploi pour personnaliser l'optimisation de votre CV.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      <div className="flex gap-2">
        <Button
          variant={sourceType === "URL" ? "default" : "outline"}
          onClick={() => setSourceType("URL")}
          className="flex items-center gap-2"
        >
          <LinkIcon className="w-4 h-4" />
          URL
        </Button>
        <Button
          variant={sourceType === "TEXT" ? "default" : "outline"}
          onClick={() => setSourceType("TEXT")}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Texte
        </Button>
      </div>

      {sourceType === "URL" ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium">URL de l'offre</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://linkedin.com/jobs/..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500">
            LinkedIn, Indeed, WTTJ ou autre plateforme
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Description de l'offre</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Collez la description complète de l'offre ici..."
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Précédent
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || uploadSuccess || (sourceType === "URL" && !url) || (sourceType === "TEXT" && !text)}
        >
          {isSubmitting ? "Importation..." : uploadSuccess ? "Importé" : "Importer"}
        </Button>
      </div>

      {uploadSuccess && (
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Précédent
          </Button>
          <Button onClick={onNext} disabled={!canProceed}>
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
