"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Briefcase, Building2, MapPin, DollarSign, Clock, Target, CheckCircle, AlertCircle } from "lucide-react";

interface JobOfferData {
  generalInfo: {
    title?: string;
    company?: string;
    location?: string;
    salary?: string;
    contractType?: string;
    remoteWork?: string;
  };
  seniority: {
    level: string;
  };
  hardSkills: Array<{ name: string; category: string }>;
  softSkills: Array<{ name: string }>;
  requirements: Array<{ description: string; priority: string }>;
  difficulty: {
    technicalComplexity: number;
    businessComplexity: number;
    expectedAutonomy: number;
  };
}

interface JobOfferWidgetProps {
  jobOffer: JobOfferData;
}

export function JobOfferWidget({ jobOffer }: JobOfferWidgetProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "essential":
        return "bg-red-100 text-red-600";
      case "strongly_desired":
        return "bg-yellow-100 text-yellow-600";
      case "bonus":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "essential":
        return "Indispensable";
      case "strongly_desired":
        return "Fortement souhaité";
      case "bonus":
        return "Bonus";
      default:
        return priority;
    }
  };

  const getDifficultyColor = (score: number) => {
    if (score >= 80) return "bg-red-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900">Offre d'emploi</CardTitle>
          <Briefcase className="w-5 h-5 text-gray-600" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* General Information */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Informations générales</h3>
          <div className="space-y-2">
            {jobOffer.generalInfo.title && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{jobOffer.generalInfo.title}</span>
              </div>
            )}
            {jobOffer.generalInfo.company && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{jobOffer.generalInfo.company}</span>
              </div>
            )}
            {jobOffer.generalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{jobOffer.generalInfo.location}</span>
              </div>
            )}
            {jobOffer.generalInfo.salary && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{jobOffer.generalInfo.salary}</span>
              </div>
            )}
            {jobOffer.generalInfo.contractType && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{jobOffer.generalInfo.contractType}</span>
              </div>
            )}
          </div>
        </div>

        {/* Seniority */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Niveau de séniorité</h3>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">{jobOffer.seniority.level}</span>
          </div>
        </div>

        {/* Hard Skills */}
        {jobOffer.hardSkills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Compétences techniques</h3>
            <div className="flex flex-wrap gap-2">
              {jobOffer.hardSkills.map((skill, index) => (
                <m.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                >
                  {skill.name}
                </m.span>
              ))}
            </div>
          </div>
        )}

        {/* Soft Skills */}
        {jobOffer.softSkills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Soft skills</h3>
            <div className="flex flex-wrap gap-2">
              {jobOffer.softSkills.map((skill, index) => (
                <m.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                >
                  {skill.name}
                </m.span>
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        {jobOffer.requirements.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Exigences</h3>
            <div className="space-y-2">
              {jobOffer.requirements.slice(0, 5).map((req, index) => (
                <m.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-2"
                >
                  {req.priority === "essential" ? (
                    <CheckCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{req.description}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${getPriorityColor(req.priority)}`}
                    >
                      {getPriorityLabel(req.priority)}
                    </span>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        )}

        {/* Difficulty */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Difficulté du poste</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Complexité technique</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <m.div
                    initial={{ width: 0 }}
                    animate={{ width: `${jobOffer.difficulty.technicalComplexity}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full ${getDifficultyColor(jobOffer.difficulty.technicalComplexity)}`}
                  />
                </div>
                <span className="text-xs font-medium text-gray-900">{jobOffer.difficulty.technicalComplexity}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Complexité métier</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <m.div
                    initial={{ width: 0 }}
                    animate={{ width: `${jobOffer.difficulty.businessComplexity}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full ${getDifficultyColor(jobOffer.difficulty.businessComplexity)}`}
                  />
                </div>
                <span className="text-xs font-medium text-gray-900">{jobOffer.difficulty.businessComplexity}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Autonomie attendue</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <m.div
                    initial={{ width: 0 }}
                    animate={{ width: `${jobOffer.difficulty.expectedAutonomy}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full ${getDifficultyColor(jobOffer.difficulty.expectedAutonomy)}`}
                  />
                </div>
                <span className="text-xs font-medium text-gray-900">{jobOffer.difficulty.expectedAutonomy}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
