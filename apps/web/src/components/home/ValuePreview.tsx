"use client";

import { useState } from "react";
import { Card, Button, Badge, LinkButton } from "@/components/ui";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const QUESTIONS = [
  {
    id: "stress",
    question: "Comment gérez-vous le stress lors d'entretiens à fort enjeu ?",
    options: [
      { value: "low", label: "Mal, je perds mes moyens" },
      { value: "medium", label: "Moyennement bien" },
      { value: "high", label: "Très bien, je reste calme" },
    ],
  },
  {
    id: "decision",
    question: "Prenez-vous vos décisions de carrière sur la base de...",
    options: [
      { value: "low", label: "L'intuition et le feeling" },
      { value: "medium", label: "Conseils de proches" },
      { value: "high", label: "Données objectives et analyse" },
    ],
  },
  {
    id: "preparation",
    question: "Comment préparez-vous vos entretiens de promotion ?",
    options: [
      { value: "low", label: "Je me contente de relire mon CV" },
      { value: "medium", label: "Je prépare quelques points clés" },
      { value: "high", label: "Je m'entraîne avec des simulations" },
    ],
  },
];

export default function ValuePreview() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: string) => {
    const questionId = QUESTIONS[currentStep].id;
    setAnswers({ ...answers, [questionId]: value });

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateScore = () => {
    const scores = Object.values(answers).map((v) => {
      if (v === "high") return 3;
      if (v === "medium") return 2;
      return 1;
    });
    const total = scores.reduce((sum, s) => sum + s, 0);
    const max = QUESTIONS.length * 3;
    return Math.round((total / max) * 100);
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-success" };
    if (score >= 60) return { label: "Bon", color: "text-brand-primary" };
    if (score >= 40) return { label: "Moyen", color: "text-warning" };
    return { label: "À améliorer", color: "text-danger" };
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  if (showResult) {
    const score = calculateScore();
    const { label, color } = getScoreLabel(score);

    return (
      <Card padding="xl" className="bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 border-border">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center mx-auto mb-6">
            <Sparkles size={32} />
          </div>
          
          <h3 className="text-2xl font-bold text-ink mb-2">Votre score de préparation</h3>
          <div className="text-5xl font-bold text-ink mb-2">{score}%</div>
          <Badge variant="success" className={`mb-6 ${color}`}>{label}</Badge>

          <p className="text-ink-muted mb-8 max-w-md mx-auto">
            Ce score est basé sur 3 dimensions clés de votre préparation aux moments à fort enjeu.
            Trajectoire peut vous aider à l'améliorer significativement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkButton
              href="/register"
              variant="primary"
              size="md"
              rightIcon={<ArrowRight size={18} />}
              fullWidth
            >
              Obtenir mon profil complet
            </LinkButton>
            <Button
              onClick={reset}
              variant="outline"
              size="md"
              fullWidth
            >
              Recommencer
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const currentQuestion = QUESTIONS[currentStep];

  return (
    <Card padding="xl" className="bg-white border-border">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="primary">Mini-évaluation gratuite</Badge>
          <span className="text-sm text-ink-muted">
            Question {currentStep + 1} / {QUESTIONS.length}
          </span>
        </div>
        <div className="w-full bg-surface-muted rounded-full h-2">
          <div
            className="bg-brand-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-xl font-bold text-ink mb-8">{currentQuestion.question}</h3>

      <div className="space-y-3">
        {currentQuestion.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            className="w-full p-4 text-left rounded-xl border border-border hover:border-brand-primary hover:bg-brand-primary/5 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-ink font-medium group-hover:text-brand-primary transition-colors">
                {option.label}
              </span>
              <div className="w-5 h-5 rounded-full border-2 border-border group-hover:border-brand-primary transition-colors" />
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-ink-muted mt-6 text-center">
        Cette mini-évaluation est indicative. Un profil complet nécessite une évaluation approfondie.
      </p>
    </Card>
  );
}
