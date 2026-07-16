"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { CheckCircle, XCircle, PlusCircle, Layers, Code, Globe, Award, Briefcase } from "lucide-react";

interface MatchingCoreData {
  hardSkills: {
    matched: Array<{ name: string }>;
    missing: Array<{ name: string }>;
    additional: Array<{ name: string }>;
  };
  softSkills: {
    matched: Array<{ name: string }>;
    missing: Array<{ name: string }>;
    additional: Array<{ name: string }>;
  };
  technologies: {
    allMatched: string[];
    allMissing: string[];
    allAdditional: string[];
  };
  languages: {
    matched: Array<{ language: string }>;
    missing: Array<{ language: string }>;
  };
  certifications: {
    matched: Array<{ name: string }>;
    missing: Array<{ name: string }>;
  };
  experience: {
    candidateYears: number;
    requiredYears?: string;
  };
}

interface MatchingIntelligenceProps {
  matchingData: MatchingCoreData | null;
}

export function MatchingIntelligence({ matchingData }: MatchingIntelligenceProps) {
  if (!matchingData) {
    return (
      <Card className="bg-white border border-gray-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Matching Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 text-sm py-8">
            Aucune donnée de matching disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  const { hardSkills, softSkills, technologies, languages, certifications, experience } = matchingData;

  const matchedCount = hardSkills.matched.length + softSkills.matched.length + technologies.allMatched.length;
  const missingCount = hardSkills.missing.length + softSkills.missing.length + technologies.allMissing.length;
  const additionalCount = hardSkills.additional.length + softSkills.additional.length + technologies.allAdditional.length;

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Matching Intelligence</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">Correspondances</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{matchedCount}</div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-700">Manquants</span>
              </div>
              <div className="text-2xl font-bold text-red-900">{missingCount}</div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <PlusCircle className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Additionnels</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{additionalCount}</div>
            </m.div>
          </div>

          {/* Hard Skills */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Compétences Techniques</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Correspondances</span>
                <span className="font-medium text-green-600">{hardSkills.matched.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Manquants</span>
                <span className="font-medium text-red-600">{hardSkills.missing.length}</span>
              </div>
            </div>
          </div>

          {/* Soft Skills */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Soft Skills</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Correspondances</span>
                <span className="font-medium text-green-600">{softSkills.matched.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Manquants</span>
                <span className="font-medium text-red-600">{softSkills.missing.length}</span>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Technologies</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Compatibles</span>
                <span className="font-medium text-green-600">{technologies.allMatched.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Manquantes</span>
                <span className="font-medium text-red-600">{technologies.allMissing.length}</span>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Langues</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Compatibles</span>
                <span className="font-medium text-green-600">{languages.matched.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Manquantes</span>
                <span className="font-medium text-red-600">{languages.missing.length}</span>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Certifications</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Correspondances</span>
                <span className="font-medium text-green-600">{certifications.matched.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Manquantes</span>
                <span className="font-medium text-red-600">{certifications.missing.length}</span>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Expérience</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Années d'expérience</span>
                <span className="font-medium text-gray-900">{experience.candidateYears} ans</span>
              </div>
              {experience.requiredYears && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Requis</span>
                  <span className="font-medium text-gray-900">{experience.requiredYears}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
