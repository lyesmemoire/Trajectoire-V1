// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

interface DashboardErrorProps {
  error?: string;
  onRetry?: () => void;
}

export function DashboardError({ error = "Une erreur est survenue lors du chargement de vos données.", onRetry }: DashboardErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <Card className="bg-white border border-gray-200/60 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-3">
              Une erreur est survenue
            </h2>
            
            <p className="text-gray-600 text-[15px] mb-8 leading-relaxed">
              {error}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
              )}
              <Button
                asChild
                variant="outline"
              >
                <a href="/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Retour au dashboard
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
