// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Zap, Clock, CheckCircle, ArrowRight } from "lucide-react";

interface QuickWin {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  impact: "high" | "medium" | "low";
}

interface QuickWinsProps {
  wins?: QuickWin[];
}

const defaultWins: QuickWin[] = [
  {
    id: "1",
    title: "Ajouter des mots-clés de l'offre",
    description: "Intégrez 3-5 termes clés de l'offre dans votre résumé",
    timeEstimate: "5 min",
    impact: "high",
  },
  {
    id: "2",
    title: "Quantifier vos réalisations",
    description: "Ajoutez des chiffres et pourcentages à vos expériences",
    timeEstimate: "10 min",
    impact: "high",
  },
  {
    id: "3",
    title: "Adapter le titre du CV",
    description: "Utilisez exactement le titre du poste visé",
    timeEstimate: "2 min",
    impact: "medium",
  },
  {
    id: "4",
    title: "Simplifier la mise en page",
    description: "Supprimez les éléments graphiques complexes pour l'ATS",
    timeEstimate: "5 min",
    impact: "medium",
  },
  {
    id: "5",
    title: "Vérifier l'orthographe",
    description: "Relisez attentivement pour éliminer les fautes",
    timeEstimate: "3 min",
    impact: "high",
  },
];

export function QuickWins({ wins = defaultWins }: QuickWinsProps) {
  const getImpactColor = (impact: QuickWin["impact"]) => {
    switch (impact) {
      case "high":
        return "bg-green-100 text-green-700 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getImpactLabel = (impact: QuickWin["impact"]) => {
    switch (impact) {
      case "high":
        return "Impact élevé";
      case "medium":
        return "Impact moyen";
      case "low":
        return "Impact faible";
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <Zap className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <CardTitle className="text-gray-900">Gains rapides</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              5 modifications en moins de 15 minutes
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {wins.map((win, index) => (
            <motion.div
              key={win.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="group p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-gray-900 transition-colors duration-200 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-transparent group-hover:text-gray-900 transition-colors duration-200" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                      {win.title}
                    </h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${getImpactColor(
                        win.impact
                      )}`}
                    >
                      {getImpactLabel(win.impact)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{win.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{win.timeEstimate}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
