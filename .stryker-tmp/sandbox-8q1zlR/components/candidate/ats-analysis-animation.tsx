// @ts-nocheck
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, FileText, Target, Brain, TrendingUp, Sparkles } from "lucide-react";

interface AnalysisStep {
  id: string;
  label: string;
  status: "pending" | "in_progress" | "completed";
  icon: React.ReactNode;
}

interface AtsAnalysisAnimationProps {
  onComplete?: () => void;
}

const steps: Omit<AnalysisStep, "status">[] = [
  { id: "1", label: "Lecture du CV", icon: <FileText className="w-5 h-5" /> },
  { id: "2", label: "Analyse des compétences", icon: <Brain className="w-5 h-5" /> },
  { id: "3", label: "Extraction des expériences", icon: <Target className="w-5 h-5" /> },
  { id: "4", label: "Analyse de l'offre", icon: <FileText className="w-5 h-5" /> },
  { id: "5", label: "Comparaison sémantique", icon: <TrendingUp className="w-5 h-5" /> },
  { id: "6", label: "Calcul du score", icon: <Sparkles className="w-5 h-5" /> },
  { id: "7", label: "Génération des recommandations", icon: <CheckCircle className="w-5 h-5" /> },
];

export function AtsAnalysisAnimation({ onComplete }: AtsAnalysisAnimationProps) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [analysisSteps, setAnalysisSteps] = React.useState<AnalysisStep[]>(
    steps.map((step) => ({ ...step, status: "pending" as const }))
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setAnalysisSteps((prev) => {
          const newSteps = prev.map((step, idx) => {
            if (idx === currentStepIndex) {
              return { ...step, status: "completed" as const };
            }
            if (idx === currentStepIndex + 1) {
              return { ...step, status: "in_progress" as const };
            }
            return step;
          });
          return newSteps;
        });
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, 800);

    return () => clearInterval(interval);
  }, [currentStepIndex, onComplete]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-2">
          Analyse ATS en cours
        </h2>
        <p className="text-gray-600 text-sm">
          Comparaison intelligente de votre CV avec l'offre d'emploi
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gray-900 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 text-right">
          {currentStepIndex + 1} / {steps.length} étapes
        </p>
      </motion.div>

      {/* Steps Timeline */}
      <div className="space-y-3">
        {analysisSteps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4"
          >
            <div className="flex-shrink-0">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${
                    step.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : step.status === "in_progress"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-400"
                  }
                `}
              >
                {step.status === "in_progress" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : step.status === "completed" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.icon
                )}
              </div>
            </div>
            <div className="flex-1">
              <p
                className={`
                  text-sm font-medium transition-colors duration-300
                  ${
                    step.status === "completed"
                      ? "text-gray-900"
                      : step.status === "in_progress"
                      ? "text-gray-900"
                      : "text-gray-400"
                  }
                `}
              >
                {step.label}
              </p>
            </div>
            {step.status === "in_progress" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-gray-500"
              >
                En cours...
              </motion.div>
            )}
            {step.status === "completed" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-green-600 font-medium"
              >
                ✓
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Completion Message */}
      <AnimatePresence>
        {currentStepIndex === steps.length && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-center py-6"
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Analyse terminée
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
