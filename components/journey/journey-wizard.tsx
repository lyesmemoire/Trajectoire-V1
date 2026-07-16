"use client";

import { useState, useEffect } from "react";
import { useJourney } from "@/hooks/use-journey";
import { ProgressStepper } from "./progress-stepper";
import { StepNavigation } from "./step-navigation";
import { Step1UploadCV } from "./steps/step-1-upload-cv";
import { Step2Profile } from "./steps/step-2-profile";
import { Step3JobOffer } from "./steps/step-3-job-offer";
import { Step4ATS } from "./steps/step-4-ats";
import { Step5OptimizedCV } from "./steps/step-5-optimized-cv";
import { Step6Interview } from "./steps/step-6-interview";
import { Step7Report } from "./steps/step-7-report";
import { Card } from "@/components/design-system/card";
import { Button } from "@/components/design-system/button";
import { Loader2 } from "lucide-react";

const STEPS = [
  { id: "CV_UPLOAD", label: "Déposer votre CV", component: Step1UploadCV },
  { id: "CAREER_PROFILE", label: "Profil extrait", component: Step2Profile },
  { id: "JOB_OFFER_IMPORT", label: "Offre d'emploi", component: Step3JobOffer },
  { id: "ATS_ANALYSIS", label: "Analyse ATS", component: Step4ATS },
  { id: "CV_OPTIMIZATION", label: "CV optimisé", component: Step5OptimizedCV },
  { id: "INTERVIEW_SIMULATION", label: "Simulation entretien", component: Step6Interview },
  { id: "FINAL_REPORT", label: "Rapport final", component: Step7Report },
];

interface JourneyWizardProps {
  userId: string;
}

export function JourneyWizard({ userId }: JourneyWizardProps) {
  const { journey, isLoading, error, startJourney, resumeJourney } = useJourney(userId);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [journeyId, setJourneyId] = useState<string | null>(null);

  useEffect(() => {
    if (journey) {
      setJourneyId(journey.id);
      const stepIndex = STEPS.findIndex((step) => step.id === journey.currentStep);
      if (stepIndex !== -1) {
        setCurrentStepIndex(stepIndex);
      }
    }
  }, [journey]);

  const handleStart = async () => {
    const result = await startJourney();
    if (result?.success && result.data?.journeyId) {
      setJourneyId(result.data.journeyId);
    }
  };

  const handleResume = async () => {
    if (journeyId) {
      await resumeJourney(journeyId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md p-6">
          <h2 className="text-xl font-semibold mb-4">Erreur</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={handleStart}>Commencer</Button>
        </Card>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md p-6">
          <h2 className="text-2xl font-bold mb-4">Bienvenue sur Trajectoire</h2>
          <p className="text-gray-600 mb-6">
            Lancez votre parcours d'optimisation de candidature en quelques étapes simples.
          </p>
          <Button onClick={handleStart} className="w-full">
            Commencer le parcours
          </Button>
        </Card>
      </div>
    );
  }

  const currentStep = STEPS[currentStepIndex];
  if (!currentStep) {
    return null;
  }
  const CurrentStepComponent = currentStep.component;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <ProgressStepper
          steps={STEPS}
          currentStepIndex={currentStepIndex}
          completedSteps={journey.completedSteps}
        />

        <Card className="mt-8 p-6">
          <CurrentStepComponent
            journey={journey}
            journeyId={journeyId!}
            onNext={() => setCurrentStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1))}
            onPrevious={() => setCurrentStepIndex((prev) => Math.max(prev - 1, 0))}
          />
        </Card>

        <StepNavigation
          currentStepIndex={currentStepIndex}
          totalSteps={STEPS.length}
          onPrevious={() => setCurrentStepIndex((prev) => Math.max(prev - 1, 0))}
          onNext={() => setCurrentStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1))}
          canGoNext={currentStepIndex < STEPS.length - 1}
          canGoPrevious={currentStepIndex > 0}
        />
      </div>
    </div>
  );
}
