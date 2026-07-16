"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Target, ArrowUpRight, ArrowDownRight, ArrowUpLeft, ArrowDownLeft } from "lucide-react";

interface PriorityItem {
  id: string;
  title: string;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
}

interface PriorityMatrixProps {
  items?: PriorityItem[];
}

const defaultItems: PriorityItem[] = [
  {
    id: "1",
    title: "Ajouter des mots-clés de l'offre",
    impact: "high",
    effort: "low",
  },
  {
    id: "2",
    title: "Quantifier les réalisations",
    impact: "high",
    effort: "medium",
  },
  {
    id: "3",
    title: "Adapter le titre du CV",
    impact: "medium",
    effort: "low",
  },
  {
    id: "4",
    title: "Restructurer les expériences",
    impact: "high",
    effort: "high",
  },
  {
    id: "5",
    title: "Simplifier la mise en page",
    impact: "medium",
    effort: "low",
  },
  {
    id: "6",
    title: "Réécrire le résumé",
    impact: "high",
    effort: "medium",
  },
];

export function PriorityMatrix({ items = defaultItems }: PriorityMatrixProps) {
  const getQuadrant = (impact: PriorityItem["impact"], effort: PriorityItem["effort"]) => {
    if (impact === "high" && effort === "low") return "quick-wins";
    if (impact === "high" && effort === "medium") return "major-projects";
    if (impact === "high" && effort === "high") return "major-projects";
    if (impact === "medium" && effort === "low") return "fill-ins";
    if (impact === "medium" && effort === "medium") return "fill-ins";
    if (impact === "medium" && effort === "high") return "time-sinks";
    if (impact === "low" && effort === "low") return "thankless-tasks";
    if (impact === "low" && effort === "medium") return "thankless-tasks";
    return "time-sinks";
  };

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case "quick-wins":
        return "bg-green-50 border-green-200";
      case "major-projects":
        return "bg-blue-50 border-blue-200";
      case "fill-ins":
        return "bg-yellow-50 border-yellow-200";
      case "time-sinks":
        return "bg-gray-50 border-gray-200";
      case "thankless-tasks":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getQuadrantLabel = (quadrant: string) => {
    switch (quadrant) {
      case "quick-wins":
        return "Gains rapides";
      case "major-projects":
        return "Projets majeurs";
      case "fill-ins":
        return "Remplissage";
      case "time-sinks":
        return "Perte de temps";
      case "thankless-tasks":
        return "Tâches ingrates";
      default:
        return "";
    }
  };

  const getQuadrantIcon = (quadrant: string) => {
    switch (quadrant) {
      case "quick-wins":
        return <ArrowUpRight className="w-4 h-4" />;
      case "major-projects":
        return <Target className="w-4 h-4" />;
      case "fill-ins":
        return <ArrowUpLeft className="w-4 h-4" />;
      case "time-sinks":
        return <ArrowDownRight className="w-4 h-4" />;
      case "thankless-tasks":
        return <ArrowDownLeft className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const quadrants = [
    { id: "quick-wins", label: "Gains rapides", icon: <ArrowUpRight className="w-5 h-5" /> },
    { id: "major-projects", label: "Projets majeurs", icon: <Target className="w-5 h-5" /> },
    { id: "fill-ins", label: "Remplissage", icon: <ArrowUpLeft className="w-5 h-5" /> },
    { id: "time-sinks", label: "Perte de temps", icon: <ArrowDownRight className="w-5 h-5" /> },
  ];

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Target className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <CardTitle className="text-gray-900">Matrice de priorités</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Impact vs Effort
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {quadrants.map((quadrant) => {
            const quadrantItems = items.filter(
              (item) => getQuadrant(item.impact, item.effort) === quadrant.id
            );

            return (
              <motion.div
                key={quadrant.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`
                  p-4 rounded-lg border-2
                  ${getQuadrantColor(quadrant.id)}
                `}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-gray-600">{quadrant.icon}</div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {quadrant.label}
                  </h4>
                  <span className="text-xs text-gray-500 ml-auto">
                    {quadrantItems.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {quadrantItems.map((item) => (
                    <div
                      key={item.id}
                      className="text-xs text-gray-700 bg-white/50 rounded px-2 py-1.5"
                    >
                      {item.title}
                    </div>
                  ))}
                  {quadrantItems.length === 0 && (
                    <div className="text-xs text-gray-400 italic">
                      Aucun élément
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-200" />
              <span className="text-gray-600">Impact élevé / Effort faible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-200" />
              <span className="text-gray-600">Impact élevé / Effort élevé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-200" />
              <span className="text-gray-600">Impact moyen / Effort faible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="text-gray-600">Impact faible / Effort élevé</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
