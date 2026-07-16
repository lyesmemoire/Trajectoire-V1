// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Button } from "@/components/design-system";
import {
  CheckCircle,
  XCircle,
  Target,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface AtsReportPremiumProps {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchedKeywords?: string[];
  missingKeywords?: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  personalizedAdvice?: string[];
  suggestedCorrections?: { before: string; after: string; reason: string }[];
  cvId: string;
}

export function AtsReportPremium({
  score,
  matchedSkills,
  missingSkills,
  matchedKeywords,
  missingKeywords,
  strengths,
  weaknesses,
  recommendations,
  personalizedAdvice,
  suggestedCorrections,
  cvId,
}: AtsReportPremiumProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return "from-green-50 to-green-100 border-green-200";
    if (score >= 50) return "from-yellow-50 to-yellow-100 border-yellow-200";
    return "from-red-50 to-red-100 border-red-200";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent — Candidature très compétitive";
    if (score >= 75) return "Bon — Bien positionné, quelques ajustements";
    if (score >= 60) return "Correct — Améliorations nécessaires";
    if (score >= 40) return "Faible — Refonte significative recommandée";
    return "Critique — CV inadapté à cette offre";
  };

  return (
    <div className="space-y-6">
      {/* Score Principal - Grand cercle animé */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`
          relative bg-gradient-to-br ${getScoreBg(score)} 
          border-2 rounded-lg p-8 text-center
        `}
      >
        <div className="relative inline-block">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-40 h-40 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center shadow-sm"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-sm text-gray-600 mt-1"
              >
                Score ATS
              </motion.div>
            </div>
          </motion.div>
          
          {/* Animated ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 border-current opacity-20"
            style={{ color: score >= 75 ? "#16a34a" : score >= 50 ? "#ca8a04" : "#dc2626" }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-lg font-medium text-gray-900 mt-6"
        >
          {getScoreLabel(score)}
        </motion.p>

        {/* Progression détaillée */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-6 space-y-3"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Compétences</span>
            <span className="font-medium text-gray-900">
              {matchedSkills.length} / {matchedSkills.length + missingSkills.length}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(matchedSkills.length / (matchedSkills.length + missingSkills.length || 1)) * 100}%` }}
              transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-green-500 rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Mots-clés</span>
            <span className="font-medium text-gray-900">
              {(matchedKeywords || []).length} / {(matchedKeywords || []).length + (missingKeywords || []).length}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((matchedKeywords || []).length / ((matchedKeywords || []).length + (missingKeywords || []).length || 1)) * 100}%` }}
              transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-blue-500 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Compétences */}
      <div className="grid sm:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="bg-white border border-gray-200/60 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <CardTitle className="text-gray-900">Compétences détectées</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
                    className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-lg border border-green-200"
                  >
                    {skill}
                  </motion.span>
                ))}
                {matchedSkills.length === 0 && (
                  <p className="text-sm text-gray-400 italic">Aucune compétence détectée</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="bg-white border border-gray-200/60 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-gray-900">Compétences manquantes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
                    className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg border border-red-200"
                  >
                    {skill}
                  </motion.span>
                ))}
                {missingSkills.length === 0 && (
                  <p className="text-sm text-gray-400 italic">Aucune compétence manquante</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Mots-clés */}
      <div className="grid sm:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="bg-white border border-gray-200/60 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <CardTitle className="text-gray-900">Mots-clés détectés</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(matchedKeywords || []).map((keyword, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
                    className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-lg border border-green-200"
                  >
                    {keyword}
                  </motion.span>
                ))}
                {(!matchedKeywords || matchedKeywords.length === 0) && (
                  <p className="text-sm text-gray-400 italic">Aucun mot-clé détecté</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="bg-white border border-gray-200/60 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-gray-900">Mots-clés manquants</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(missingKeywords || []).map((keyword, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
                    className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg border border-red-200"
                  >
                    {keyword}
                  </motion.span>
                ))}
                {(!missingKeywords || missingKeywords.length === 0) && (
                  <p className="text-sm text-gray-400 italic">Aucun mot-clé manquant</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Points forts / faibles */}
      <div className="grid sm:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="bg-white border border-gray-200/60 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <CardTitle className="text-gray-900">Points forts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {strengths.map((strength, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.3 }}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </motion.li>
                ))}
                {strengths.length === 0 && (
                  <p className="text-sm text-gray-400 italic">Aucun point fort identifié</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="bg-white border border-gray-200/60 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-gray-900">Points à améliorer</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {weaknesses.map((weakness, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.3 }}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>{weakness}</span>
                  </motion.li>
                ))}
                {weaknesses.length === 0 && (
                  <p className="text-sm text-gray-400 italic">Aucun point faible identifié</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recommandations */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="bg-white border border-gray-200/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gray-600" />
              <CardTitle className="text-gray-900">Actions recommandées</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recommendations.map((rec, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.05, duration: 0.3 }}
                  className="flex items-start gap-3 text-sm text-gray-700 p-3 bg-gray-50 rounded-lg"
                >
                  <Target className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </motion.li>
              ))}
              {recommendations.length === 0 && (
                <p className="text-sm text-gray-400 italic">Aucune recommandation</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Conseils personnalisés */}
      {(personalizedAdvice && personalizedAdvice.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="bg-white border border-gray-200/60 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-gray-900">Conseils personnalisés</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {personalizedAdvice.map((advice, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.05, duration: 0.3 }}
                    className="flex items-start gap-3 text-sm text-gray-700 p-3 bg-blue-50 rounded-lg border border-blue-100"
                  >
                    <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{advice}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Corrections recommandées avec Avant / Après */}
      {(suggestedCorrections && suggestedCorrections.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="bg-white border border-gray-200/60 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-gray-900">Corrections recommandées</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestedCorrections.map((correction, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
                    className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-red-600 uppercase tracking-wider">
                        <XCircle className="w-3 h-3" />
                        Avant
                      </div>
                      <p className="text-sm text-gray-700 bg-red-50 p-3 rounded border border-red-100">
                        {correction.before}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-green-600 uppercase tracking-wider">
                        <CheckCircle className="w-3 h-3" />
                        Après
                      </div>
                      <p className="text-sm text-gray-700 bg-green-50 p-3 rounded border border-green-100">
                        {correction.after}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 italic">
                      {correction.reason}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* CTA Continuer vers simulation */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-200/60 shadow-sm">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Prêt pour l'entretien ?</h3>
                <p className="text-sm text-gray-300">
                  Entraînez-vous avec notre IA pour votre prochain entretien
                </p>
              </div>
            </div>
            <Button
              asChild
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <a href={`/dashboard/interview-simulation?cvId=${cvId}`}>
                Préparer mon entretien
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
