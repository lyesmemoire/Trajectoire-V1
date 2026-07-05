"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Button } from "@/components/design-system";
import {
  FileText,
  Video,
  MessageSquare,
  Calendar,
  ArrowRight,
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
      title: "Nouveau CV",
      description: "Créer un CV optimisé",
      icon: <FileText className="w-5 h-5" />,
      href: "/dashboard/cvs/new",
      variant: "primary",
    },
    {
      id: "2",
      title: "Session coaching",
      description: "Réserver un entraînement",
      icon: <Video className="w-5 h-5" />,
      href: "/dashboard/schedule",
      variant: "secondary",
    },
    {
      id: "3",
      title: "Contacter coach",
      description: "Envoyer un message",
      icon: <MessageSquare className="w-5 h-5" />,
      href: "/dashboard/messages",
      variant: "outline",
    },
    {
      id: "4",
      title: "Voir calendrier",
      description: "Gérer vos sessions",
      icon: <Calendar className="w-5 h-5" />,
      href: "/dashboard/calendar",
      variant: "outline",
    },
  ];

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Button
                asChild
                variant={action.variant}
                className="w-full h-auto p-4 flex flex-col items-start gap-2"
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
