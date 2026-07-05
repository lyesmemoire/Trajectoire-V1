"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { StatCard } from "@/components/design-system";
import { TrendingUp, MessageSquare, CheckCircle2, Target, ArrowRight, Download, Share2 } from "lucide-react";

export default function InterviewResultPage() {
  const overallScore = 78;
  const metrics = [
    {
      title: "Clarté",
      value: "85%",
      change: { value: 10, period: "vs moyenne" },
      icon: MessageSquare,
    },
    {
      title: "Structure",
      value: "72%",
      change: { value: -5, period: "vs objectif" },
      icon: Target,
    },
    {
      title: "Confiance",
      value: "80%",
      change: { value: 15, period: "vs début" },
      icon: TrendingUp,
    },
  ];

  const feedback = [
    {
      category: "Points forts",
      items: [
        "Excellente introduction, vous avez capté l'attention",
        "Exemples concrets et pertinents",
        "Ton de voix professionnel et engageant",
      ],
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
    },
    {
      category: "À améliorer",
      items: [
        "Structurez davantage vos réponses (méthode STAR)",
        "Ajoutez plus de détails quantifiables",
        "Préparez des questions à poser au recruteur",
      ],
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
    },
  ];

  const recommendations = [
    {
      title: "Pratiquez la méthode STAR",
      description: "Situation, Tâche, Action, Résultat - structurez vos réponses",
      priority: "high",
    },
    {
      title: "Enrichissez vos exemples",
      description: "Ajoutez des chiffres et des résultats mesurables",
      priority: "medium",
    },
    {
      title: "Travaillez votre posture",
      description: "Améliorez votre langage corporel et votre contact visuel",
      priority: "low",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Résultats de la Simulation
        </h1>
        <p className="text-gray-600">
          Analyse détaillée de votre performance et recommandations personnalisées.
        </p>
      </div>

      {/* Overall Score */}
      <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium mb-2">Score global</h2>
              <div className="text-6xl font-bold mb-2">{overallScore}%</div>
              <p className="text-blue-100">
                Performance solide avec des axes d'amélioration identifiés
              </p>
            </div>
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-16 h-16" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <StatCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedback.map((section, index) => (
          <Card key={index} className={section.color}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${section.iconColor}`}>
                <CheckCircle2 className="w-5 h-5" />
                {section.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 shrink-0" />
                    <span className="text-gray-900">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations personnalisées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-200"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    rec.priority === "high"
                      ? "bg-red-100 text-red-600"
                      : rec.priority === "medium"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    rec.priority === "high"
                      ? "bg-red-100 text-red-600"
                      : rec.priority === "medium"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {rec.priority === "high" ? "Prioritaire" : "Normal"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => window.location.href = "/dashboard/interview-simulation"}>
          <ArrowRight className="w-4 h-4 mr-2" />
          Nouvelle simulation
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Télécharger le rapport
        </Button>
        <Button variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Partager
        </Button>
      </div>

      {/* Progress Plan CTA */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Créez votre plan de progression
              </h3>
              <p className="text-gray-600">
                Transformez ces recommandations en actions concrètes avec un plan personnalisé.
              </p>
            </div>
            <Button onClick={() => window.location.href = "/dashboard/progress-plan"}>
              Créer mon plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
