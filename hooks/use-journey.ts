import { useState, useEffect } from "react";

interface JourneyResponse {
  id: string;
  userId: string;
  currentStep: string;
  status: string;
  progress: number;
  completedSteps: string[];
  availableActions: string[];
  data: any;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export function useJourney(userId: string) {
  const [journey, setJourney] = useState<JourneyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const startJourney = async (): Promise<ApiResponse | null> => {
    try {
      const response = await fetch("/api/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
      const result: ApiResponse = await response.json();
      if (result.success) {
        await fetchJourney();
      }
      return result;
    } catch (err) {
      setError("Erreur lors du démarrage du parcours");
      return null;
    }
  };

  const resumeJourney = async (journeyId: string): Promise<void> => {
    try {
      const response = await fetch("/api/journey", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resume", journeyId }),
      });
      const result: ApiResponse = await response.json();
      if (result.success) {
        await fetchJourney(journeyId);
      }
    } catch (err) {
      setError("Erreur lors de la reprise du parcours");
    }
  };

  const fetchJourney = async (journeyId?: string) => {
    try {
      setIsLoading(true);
      const url = journeyId ? `/api/journey?journeyId=${journeyId}` : "/api/journey";
      const response = await fetch(url);
      const result: ApiResponse = await response.json();
      if (result.success && result.data) {
        setJourney(result.data);
      }
    } catch (err) {
      setError("Erreur lors du chargement du parcours");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, [userId]);

  return { journey, isLoading, error, startJourney, resumeJourney };
}
