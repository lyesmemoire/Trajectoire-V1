"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui";
import { Target, Brain, TrendingUp, CheckCircle2, ArrowRight, Calendar, TrendingDown, X, Sparkles } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const KPIS = [
  { icon: Target, label: "Préparation", value: "87", sublabel: "Score / 100", color: "text-brand-primary", trend: "+5" },
  { icon: Brain, label: "Leadership", value: "84", sublabel: "Score / 100", color: "text-brand-accent", trend: "+3" },
  { icon: TrendingUp, label: "Stress", value: "71", sublabel: "Score / 100", color: "text-success", trend: "-8" },
  { icon: CheckCircle2, label: "Confiance", value: "91", sublabel: "Score / 100", color: "text-brand-primary", trend: "+7" },
];

const PROGRESSION_DATA = [
  { week: "S1", score: 72 },
  { week: "S2", score: 76 },
  { week: "S3", score: 79 },
  { week: "S4", score: 82 },
  { week: "S5", score: 85 },
  { week: "S6", score: 87 },
  { week: "S7", score: 89 },
  { week: "S8", score: 91 },
];

const INSIGHTS = [
  "Posture exécutive renforcée",
  "Gestion du stress maîtrisée",
  "Cohérence CV / discours validée",
];

const RECOMMENDATIONS = [
  {
    priority: "high" as const,
    title: "🎯 Lancez votre première simulation",
    description: "C'est le moment idéal pour tester vos compétences. Commencez par une simulation d'entretien de promotion.",
    action: "Commencer la simulation",
    icon: Target,
    isFirstAction: true,
  },
  {
    priority: "medium" as const,
    title: "Renforcer votre leadership",
    description: "Focus sur les situations de prise de décision en équipe.",
    action: "Voir exercices",
    icon: Brain,
  },
  {
    priority: "low" as const,
    title: "Maintenir la gestion du stress",
    description: "Continuez les exercices de respiration avant les moments à fort enjeu.",
    action: "Voir techniques",
    icon: TrendingDown,
  },
];

function WelcomeTour({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Target,
      title: "Vos KPIs",
      description: "Suivez votre progression en temps réel sur 4 dimensions clés : Préparation, Leadership, Stress et Confiance.",
    },
    {
      icon: TrendingUp,
      title: "Graphique de progression",
      description: "Visualisez votre évolution sur les 8 dernières semaines avec les tendances de vos scores.",
    },
    {
      icon: CheckCircle2,
      title: "Recommandations",
      description: "Des actions personnalisées basées sur votre profil pour améliorer vos performances.",
    },
    {
      icon: Sparkles,
      title: "Commencez maintenant",
      description: "Lancez votre première simulation d'entretien pour mettre en pratique vos compétences.",
    },
  ];

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card padding="xl" className="max-w-md w-full bg-white shadow-elevated">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-primary text-white flex items-center justify-center">
              <StepIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink">{currentStepData.title}</h3>
              <p className="text-sm text-ink-muted mt-1">Étape {currentStep + 1} sur {steps.length}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ink-muted hover:text-ink hover:bg-surface-muted rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-ink-muted mb-8 leading-relaxed">
          {currentStepData.description}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-surface-muted rounded-full h-2 mb-8">
          <div
            className="bg-brand-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex-1 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-surface-muted text-ink hover:bg-surface-muted/80"
          >
            Précédent
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl font-semibold transition-colors bg-brand-primary text-white hover:bg-brand-primary-hover"
          >
            {currentStep === steps.length - 1 ? "Commencer" : "Suivant"}
          </button>
        </div>
      </Card>
    </div>
  );
}

export default function DashboardOverview() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [revealedSections, setRevealedSections] = useState<string[]>(["kpis"]);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem("hasSeenWelcome", "true");
    }
  }, []);

  const revealSection = (sectionId: string) => {
    setRevealedSections(prev => [...prev, sectionId]);
  };

  return (
    <>
      {showWelcome && <WelcomeTour onClose={() => setShowWelcome(false)} />}
      
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-ink">Bienvenue, Jean 👋</h2>
          <p className="text-ink-muted mt-1">Voici votre progression et vos recommandations.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPIS.map((kpi) => {
            const Icon = kpi.icon;
            const isPositive = kpi.trend.startsWith("+");
            return (
              <Card key={kpi.label} padding="lg" hover>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={kpi.color}>
                      <Icon size={16} />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      {kpi.label}
                    </span>
                  </div>
                  <span className={`text-xs font-medium ${isPositive ? "text-success" : "text-danger"}`}>
                    {kpi.trend}
                  </span>
                </div>
                <div className="font-bold text-3xl text-ink">{kpi.value}</div>
                <div className="text-xs text-ink-muted mt-2">{kpi.sublabel}</div>
              </Card>
            );
          })}
        </div>

        {/* Progression Chart */}
        {revealedSections.includes("chart") ? (
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-ink">Progression globale</h3>
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Calendar size={16} />
                <span>8 dernières semaines</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PROGRESSION_DATA}>
                  <defs>
                    <linearGradient id="colorProgression" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A3C34" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1A3C34" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8E4" />
                  <XAxis 
                    dataKey="week" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    domain={[60, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "white", 
                      border: "1px solid #E2E8E4", 
                      borderRadius: "8px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#1A3C34" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorProgression)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        ) : (
          <Card padding="lg" className="bg-surface-muted border-dashed border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-ink">Progression globale</h3>
                <p className="text-sm text-ink-muted mt-1">Visualisez votre évolution sur 8 semaines</p>
              </div>
              <button
                onClick={() => revealSection("chart")}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary-hover transition-colors"
              >
                Débloquer
              </button>
            </div>
          </Card>
        )}

        {/* Insights & Recommendations Grid */}
        {revealedSections.includes("recommendations") ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Insights */}
            <Card padding="lg">
              <h3 className="text-lg font-semibold text-ink mb-4">Insights comportementaux</h3>
              <div className="space-y-3">
                {INSIGHTS.map((insight) => (
                  <div key={insight} className="flex items-center gap-3 p-3 rounded-lg bg-surface-muted">
                    <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                    <span className="text-sm font-medium text-ink">{insight}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommendations */}
            <Card padding="lg">
              <h3 className="text-lg font-semibold text-ink mb-4">Recommandations</h3>
              <div className="space-y-4">
                {RECOMMENDATIONS.map((rec) => {
                  const Icon = rec.icon;
                  const priorityColors = {
                    high: "bg-danger/10 text-danger border-danger/20",
                    medium: "bg-warning/10 text-warning border-warning/20",
                    low: "bg-success/10 text-success border-success/20",
                  };
                  return (
                    <div key={rec.title} className={`p-4 rounded-xl border ${priorityColors[rec.priority]} ${rec.isFirstAction ? "ring-2 ring-brand-primary ring-offset-2" : ""}`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${rec.isFirstAction ? "bg-brand-primary text-white" : "bg-white"}`}>
                          <Icon size={18} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-ink text-sm">{rec.title}</h4>
                          <p className="text-xs text-ink-muted mt-1">{rec.description}</p>
                          <button className="flex items-center gap-1 text-xs font-semibold text-brand-primary mt-2 hover:underline">
                            {rec.action}
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        ) : (
          <Card padding="lg" className="bg-surface-muted border-dashed border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-ink">Insights & Recommandations</h3>
                <p className="text-sm text-ink-muted mt-1">Découvrez vos forces et actions prioritaires</p>
              </div>
              <button
                onClick={() => revealSection("recommendations")}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary-hover transition-colors"
              >
                Débloquer
              </button>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
