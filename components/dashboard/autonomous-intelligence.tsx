"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/design-system";
import { Badge } from "@/components/design-system";
import { Progress } from "@/components/design-system";
import { Clock, DollarSign, Zap, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface AutonomousIntelligenceProps {
  autonomousIntelligence: {
    eventClassification: {
      type: "major" | "minor" | "no_impact";
      reason: string;
      affectedAreas: string[];
    };
    orchestration: Record<string, {
      decision: "EXECUTE" | "REUSE" | "IGNORE" | "REVISION";
      reason: string;
      confidence: number;
    }>;
    optimization: {
      llmCallsAvoided: number;
      costSaved: number;
      timeSaved: number;
      reusedAnalyses: number;
    };
    coherence: {
      level: "high" | "medium" | "low";
      conflicts: string[];
      recommendations: string[];
    };
    explanation: {
      summary: string;
      executed: string[];
      reused: string[];
      ignored: string[];
      limitations: string[];
    };
  };
}

export function AutonomousIntelligence({ autonomousIntelligence }: AutonomousIntelligenceProps) {
  const { eventClassification, optimization, coherence, explanation } = autonomousIntelligence;

  const getEventColor = (type: string) => {
    switch (type) {
      case "major":
        return "bg-red-500";
      case "minor":
        return "bg-yellow-500";
      case "no_impact":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCoherenceColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case "EXECUTE":
        return <Zap className="w-4 h-4 text-blue-500" />;
      case "REUSE":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "IGNORE":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case "REVISION":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-serif">Autonomous Intelligence</CardTitle>
          <Badge className={getEventColor(eventClassification.type)}>
            {eventClassification.type.toUpperCase()}
          </Badge>
        </div>
        <CardDescription>{eventClassification.reason}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Event Classification */}
        <div>
          <h4 className="text-sm font-medium mb-2">Zones affectées</h4>
          <div className="flex flex-wrap gap-2">
            {eventClassification.affectedAreas.map((area, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        </div>

        {/* Orchestration Decisions */}
        <div>
          <h4 className="text-sm font-medium mb-3">Décisions d'orchestration</h4>
          <div className="space-y-2">
            {Object.entries(autonomousIntelligence.orchestration).map(([key, value]: [string, any]) => (
              <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getDecisionIcon(value.decision)}
                  <span className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {value.decision}
                  </Badge>
                  <span className="text-xs text-gray-500">{value.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Metrics */}
        <div>
          <h4 className="text-sm font-medium mb-3">Optimisation</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Appels LLM évités</p>
                <p className="text-sm font-semibold">{optimization.llmCallsAvoided}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Coût économisé</p>
                <p className="text-sm font-semibold">${optimization.costSaved.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Temps économisé</p>
                <p className="text-sm font-semibold">{optimization.timeSaved}s</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Analyses réutilisées</p>
                <p className="text-sm font-semibold">{optimization.reusedAnalyses}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coherence Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Niveau de cohérence</h4>
            <span className={`text-sm font-semibold ${getCoherenceColor(coherence.level)}`}>
              {coherence.level.toUpperCase()}
            </span>
          </div>
          <Progress 
            value={coherence.level === "high" ? 90 : coherence.level === "medium" ? 60 : 30}
            className="h-2"
          />
          {coherence.conflicts.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Conflits détectés:</p>
              <ul className="text-xs text-red-600 space-y-1">
                {coherence.conflicts.map((conflict, index) => (
                  <li key={index}>• {conflict}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Explanation */}
        <div>
          <h4 className="text-sm font-medium mb-2">Explication</h4>
          <p className="text-sm text-gray-600 mb-3">{explanation.summary}</p>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-gray-500 mb-1">Exécutées ({explanation.executed.length})</p>
              <ul className="text-blue-600 space-y-1">
                {explanation.executed.slice(0, 3).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Réutilisées ({explanation.reused.length})</p>
              <ul className="text-green-600 space-y-1">
                {explanation.reused.slice(0, 3).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Ignorées ({explanation.ignored.length})</p>
              <ul className="text-gray-600 space-y-1">
                {explanation.ignored.slice(0, 3).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          {explanation.limitations.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Limitations:</p>
              <ul className="text-xs text-orange-600 space-y-1">
                {explanation.limitations.map((limitation, index) => (
                  <li key={index}>• {limitation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
