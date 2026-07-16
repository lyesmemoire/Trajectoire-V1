import { useState, useEffect } from "react";
import { Button } from "@/components/design-system/button";
import { User, Check, Edit2 } from "lucide-react";
import { ErrorAlert } from "@/components/ui/error-alert";

interface Step2ProfileProps {
  journey: any;
  journeyId: string;
  onNext: () => void;
  onPrevious: () => void;
}

export function Step2Profile({ journey, journeyId, onNext, onPrevious }: Step2ProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/candidate/profile");
      const result = await response.json();
      if (result.success) {
        setProfile(result.data);
      } else {
        setError(result.error || "Erreur lors du chargement du profil");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = async () => {
    setError(null);
    try {
      const response = await fetch("/api/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateCareerProfile",
          journeyId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsValidated(true);
        setCanProceed(true);
        setTimeout(() => onNext(), 1000);
      } else {
        setError(result.error || "Erreur lors de la validation du profil");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Chargement du profil...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Profil extrait</h2>
        <p className="text-gray-600">
          Vérifiez et validez les informations extraites de votre CV.
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {profile && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold">Informations personnelles</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Nom:</span> {profile.name || "Non renseigné"}</p>
              <p><span className="font-medium">Email:</span> {profile.email || "Non renseigné"}</p>
              <p><span className="font-medium">Téléphone:</span> {profile.phone || "Non renseigné"}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Expérience</h3>
            <div className="space-y-2 text-sm">
              {profile.experience?.map((exp: any, index: number) => (
                <div key={index} className="border-l-2 border-blue-200 pl-3">
                  <p className="font-medium">{exp.title}</p>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-gray-400 text-xs">{exp.period}</p>
                </div>
              )) || <p className="text-gray-400">Aucune expérience</p>}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Compétences</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {skill}
                </span>
              )) || <p className="text-gray-400">Aucune compétence</p>}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Précédent
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Edit2 className="w-4 h-4" />
            Modifier
          </Button>
          <Button onClick={handleValidate} disabled={!canProceed || isValidated} className="flex items-center gap-2">
            {isValidated ? <Check className="w-4 h-4" /> : null}
            {isValidated ? "Validé" : "Valider et continuer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
