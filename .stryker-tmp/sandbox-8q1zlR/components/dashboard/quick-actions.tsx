// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Button } from "@/components/design-system";
import {
  FileText,
  Video,
  ArrowRight,
  Upload,
  Target,
  Play,
  TrendingUp,
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  variant: "primary" | "secondary" | "outline";
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      id: "1",
      title: "Importer un CV",
      description: "Analyser votre CV existant",
      icon: <Upload className="w-5 h-5" />,
      href: "/dashboard/cvs/import",
      variant: "primary",
    },
    {
      id: "2",
      title: "Créer un CV",
      description: "CV optimisé ATS",
      icon: <FileText className="w-5 h-5" />,
      href: "/dashboard/cvs/new",
      variant: "secondary",
    },
    {
      id: "3",
      title: "Analyser une offre",
      description: "Décrypter le poste",
      icon: <Target className="w-5 h-5" />,
      href: "/dashboard/ats",
      variant: "outline",
    },
    {
      id: "4",
      title: "Lancer une simulation",
      description: "Entraînement IA",
      icon: <Play className="w-5 h-5" />,
      href: "/dashboard/interview-simulation",
      variant: "outline",
    },
    {
      id: "5",
      title: "Continuer",
      description: "Dernière simulation",
      icon: <Video className="w-5 h-5" />,
      href: "/dashboard/interview-result",
      variant: "outline",
    },
    {
      id: "6",
      title: "Plan de progression",
      description: "Voir votre parcours",
      icon: <TrendingUp className="w-5 h-5" />,
      href: "/dashboard/progress-plan",
      variant: "outline",
    },
  ];

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Button
                asChild
                variant={action.variant}
                className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
              >
                <a href={action.href}>
                  <span className="flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-2 w-full">
                      {action.icon}
                      <span className="font-medium text-sm">{action.title}</span>
                    </div>
                    <span className="text-xs text-gray-600">{action.description}</span>
                    <ArrowRight className="w-4 h-4 ml-auto self-end text-gray-400" />
                  </span>
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
