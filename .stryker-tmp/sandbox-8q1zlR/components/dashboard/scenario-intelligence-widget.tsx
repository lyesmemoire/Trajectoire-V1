// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { TrendingUp, Target, Zap, Clock, ArrowUpRight, CheckCircle, BarChart3, GitBranch, Shield, DollarSign, Award } from "lucide-react";

interface ScenarioIntelligenceWidgetProps {
  scenarioIntelligence: {
    scenarios: Array<{
      id: string;
      name: string;
      type: string;
      description: string;
      successProbability: number;
      estimatedTime: string;
      requiredEffort: "low" | "medium" | "high";
      riskLevel: "low" | "medium" | "high";
      roi: number;
      careerImpact: "low" | "medium" | "high";
      employabilityImpact: number;
      salaryPotential: string;
      progressionSpeed: "slow" | "medium" | "fast";
      satisfactionEstimate: "low" | "medium" | "high";
      confidence: number;
    }>;
    comparison: {
      bestScenario: string;
      fastestScenario: string;
      mostProfitableScenario: string;
      safestScenario: string;
      mostAmbitiousScenario: string;
    };
    recommendation: {
      recommendedScenario: string;
      recommendationReason: string;
      successMaximization: string;
    };
    confidence: number;
  } | null;
}

export function ScenarioIntelligenceWidget({ scenarioIntelligence }: ScenarioIntelligenceWidgetProps) {
  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "low":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "high":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "high":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "bg-blue-100 text-blue-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "high":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case "slow":
        return "bg-blue-100 text-blue-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "fast":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case "current":
        return <Target className="h-4 w-4" />;
      case "optimistic":
        return <TrendingUp className="h-4 w-4" />;
      case "prudent":
        return <Shield className="h-4 w-4" />;
      case "ambitious":
        return <Zap className="h-4 w-4" />;
      case "strategy_change":
        return <GitBranch className="h-4 w-4" />;
      case "sector_change":
        return <ArrowUpRight className="h-4 w-4" />;
      case "certification":
        return <Award className="h-4 w-4" />;
      case "acceleration":
        return <Zap className="h-4 w-4" />;
      case "slow_down":
        return <Clock className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getScenarioById = (id: string) => {
    return scenarioIntelligence?.scenarios.find(s => s.id === id);
  };

  if (!scenarioIntelligence) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Career Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No scenario data available</p>
        </CardContent>
      </Card>
    );
  }

  const recommendedScenario = getScenarioById(scenarioIntelligence.recommendation.recommendedScenario);
  const fastestScenario = getScenarioById(scenarioIntelligence.comparison.fastestScenario);
  const mostProfitableScenario = getScenarioById(scenarioIntelligence.comparison.mostProfitableScenario);
  const safestScenario = getScenarioById(scenarioIntelligence.comparison.safestScenario);
  const mostAmbitiousScenario = getScenarioById(scenarioIntelligence.comparison.mostAmbitiousScenario);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Career Scenarios
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            Confidence: {scenarioIntelligence.confidence}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recommended Scenario */}
        {recommendedScenario && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  Recommended: {recommendedScenario.name}
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                  {scenarioIntelligence.recommendation.recommendationReason}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className={`px-2 py-1 rounded-full ${getEffortColor(recommendedScenario.requiredEffort)}`}>
                    Effort: {recommendedScenario.requiredEffort}
                  </span>
                  <span className={`px-2 py-1 rounded-full ${getRiskColor(recommendedScenario.riskLevel)}`}>
                    Risk: {recommendedScenario.riskLevel}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">
                    Success: {recommendedScenario.successProbability}%
                  </span>
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    Time: {recommendedScenario.estimatedTime}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Comparison */}
        <div className="grid grid-cols-2 gap-3">
          {fastestScenario && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-900 dark:text-blue-100">Fastest</span>
              </div>
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">{fastestScenario.name}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">{fastestScenario.estimatedTime}</p>
            </div>
          )}

          {mostProfitableScenario && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-900 dark:text-green-100">Most Profitable</span>
              </div>
              <p className="text-sm font-semibold text-green-800 dark:text-green-200">{mostProfitableScenario.name}</p>
              <p className="text-xs text-green-600 dark:text-green-400">ROI: {mostProfitableScenario.roi}%</p>
            </div>
          )}

          {safestScenario && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-emerald-900 dark:text-emerald-100">Safest</span>
              </div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">{safestScenario.name}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Risk: {safestScenario.riskLevel}</p>
            </div>
          )}

          {mostAmbitiousScenario && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-medium text-purple-900 dark:text-purple-100">Most Ambitious</span>
              </div>
              <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">{mostAmbitiousScenario.name}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Impact: {mostAmbitiousScenario.careerImpact}</p>
            </div>
          )}
        </div>

        {/* All Scenarios */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">All Scenarios</h4>
          <div className="space-y-2">
            {scenarioIntelligence.scenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${
                  scenario.id === scenarioIntelligence.recommendation.recommendedScenario
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getScenarioIcon(scenario.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-sm">{scenario.name}</h5>
                      {scenario.id === scenarioIntelligence.recommendation.recommendedScenario && (
                        <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{scenario.description}</p>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <span className={`px-2 py-0.5 rounded-full ${getEffortColor(scenario.requiredEffort)}`}>
                        {scenario.requiredEffort}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full ${getRiskColor(scenario.riskLevel)}`}>
                        {scenario.riskLevel}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {scenario.successProbability}%
                      </span>
                      <span className={`px-2 py-0.5 rounded-full ${getImpactColor(scenario.careerImpact)}`}>
                        {scenario.careerImpact}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full ${getSpeedColor(scenario.progressionSpeed)}`}>
                        {scenario.progressionSpeed}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {scenario.successProbability}%
                    </div>
                    <div className="text-xs text-muted-foreground">success</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Success Maximization */}
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <Award className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Success Maximization
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                {scenarioIntelligence.recommendation.successMaximization}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
