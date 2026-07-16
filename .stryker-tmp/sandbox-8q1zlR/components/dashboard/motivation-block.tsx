// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/design-system";
import { Quote, Lightbulb } from "lucide-react";

interface MotivationBlockProps {
  quote?: string;
  author?: string;
  tip?: string;
}

const defaultQuote = "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.";
const defaultAuthor = "Winston Churchill";
const defaultTip = "Préparez 3 exemples concrets de vos réussites pour votre prochain entretien.";

export function MotivationBlock({
  quote = defaultQuote,
  author = defaultAuthor,
  tip = defaultTip,
}: MotivationBlockProps) {
  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-200/60 shadow-sm">
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Quote */}
          <div className="space-y-3">
            <Quote className="w-6 h-6 text-gray-400" />
            <blockquote className="font-serif text-lg leading-relaxed text-white">
              « {quote} »
            </blockquote>
            <cite className="text-sm text-gray-300">— {author}</cite>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-700" />

          {/* Tip */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300 mb-1">Conseil du jour</p>
              <p className="text-sm text-gray-400 leading-relaxed">{tip}</p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
