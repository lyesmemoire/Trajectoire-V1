import { useState } from "react";
import { Button } from "@/components/design-system/button";
import { Upload, FileText, Check } from "lucide-react";
import { ErrorAlert } from "@/components/ui/error-alert";

interface Step1UploadCVProps {
  journey: any;
  journeyId: string;
  onNext: () => void;
  onPrevious: () => void;
}

export function Step1UploadCV({ journeyId, onNext, onPrevious }: Step1UploadCVProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canProceed, setCanProceed] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const response = await fetch("/api/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "uploadCv",
          journeyId,
          stepData: {
            file: await file.arrayBuffer(),
            filename: file.name,
            mimeType: file.type,
          },
        }),
      });

      const result = await response.json();
      if (result.success) {
        setUploadSuccess(true);
        setCanProceed(true);
        setTimeout(() => onNext(), 1000);
      } else {
        setError(result.error || "Erreur lors du téléchargement du CV");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Déposez votre CV</h2>
        <p className="text-gray-600">
          Importez votre CV actuel pour commencer l'analyse et l'optimisation.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
          id="cv-upload"
        />
        <label htmlFor="cv-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">
            {file ? file.name : "Cliquez ou glissez-déposez votre CV ici"}
          </p>
          <p className="text-sm text-gray-400">PDF, DOC, DOCX (max 5MB)</p>
        </label>
      </div>

      {file && !uploadSuccess && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium">{file.name}</span>
          </div>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Téléchargement..." : "Télécharger"}
          </Button>
        </div>
      )}

      {uploadSuccess && (
        <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg">
          <Check className="w-5 h-5" />
          <span>CV téléchargé avec succès</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onPrevious} disabled>
          Précédent
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Suivant
        </Button>
      </div>
    </div>
  );
}
