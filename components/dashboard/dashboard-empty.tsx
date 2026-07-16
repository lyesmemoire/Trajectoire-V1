"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { FileText, Target, Play, TrendingUp, ArrowRight } from "lucide-react";

export function DashboardEmpty() {
  const actions = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Créer votre premier CV",
      description: "Commencez par optimiser votre CV pour passer les filtres ATS",
      href: "/dashboard/cvs/new",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Définir votre objectif",
      description: "Précisez le poste que vous visez pour un accompagnement personnalisé",
      href: "/dashboard/profile",
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "Lancer une simulation",
      description: "Entraînez-vous avec notre IA pour votre prochain entretien",
      href: "/dashboard/interview-simulation",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <TrendingUp className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-3">
          Bienvenue sur Trajectoire
        </h1>
        <p className="text-gray-600 text-[15px] max-w-md mx-auto">
          Commencez votre parcours de préparation en créant votre premier CV ou en définissant votre objectif de carrière.
        </p>
      </m.div>

      {/* Quick start actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {actions.map((action, index) => (
          <m.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="bg-white border border-gray-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {action.description}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full group"
                >
                  <a href={action.href}>
                    Commencer
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </m.div>
        ))}
      </div>

      {/* Motivation block */}
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-200/60 shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="font-serif text-lg text-white leading-relaxed">
              « Le voyage de mille miles commence par un seul pas. »
            </p>
            <p className="text-sm text-gray-300 mt-2">— Lao Tseu</p>
          </CardContent>
        </Card>
      </m.div>
    </div>
  );
}
