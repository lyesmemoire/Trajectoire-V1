"use client";

import Link from "next/link";
import { FileText, Clock, Target } from "lucide-react";
import { Button, Card, CardContent, StaggerChildren } from "@/components/design-system";
import { Sparkline } from "../Sparkline";
import { DeleteButton } from "../DeleteButton";
import type { DashboardCv } from "../types";

export function CvsList({ cvs }: { cvs: DashboardCv[] }) {
  if (!cvs || cvs.length === 0) return null;

  return (
    <StaggerChildren staggerDelay={0.05} className="space-y-6">
      {cvs.map((cv) => {
        const scoreDelta =
          cv.score !== null && cv.previousScore !== null
            ? cv.score - cv.previousScore
            : null;

        let sparklineColor = "#6366f1"; // indigo
        if (scoreDelta !== null) {
          if (scoreDelta > 0) sparklineColor = "#10b981"; // emerald
          else if (scoreDelta < 0) sparklineColor = "#ef4444"; // red
        }

        let primaryAction = null;
        let secondaryAction = null;

        if (cv.totalAnalyses === 0) {
          primaryAction = {
            label: "🎯 Lancer l'analyse ATS",
            href: `/dashboard/ats?cvId=${cv.id}`,
            style: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20",
          };
        } else if (scoreDelta !== null && scoreDelta < 0 && cv.score !== null && cv.score < 80) {
          primaryAction = {
            label: "🛠 Corriger la baisse",
            href: `/dashboard/optimize?cvId=${cv.id}`,
            style: "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20",
          };
        } else if (cv.score !== null && cv.score < 60) {
          primaryAction = {
            label: "✨ Réécrire avec l'IA",
            href: `/dashboard/optimize?cvId=${cv.id}`,
            style: "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20",
          };
        } else if (cv.score !== null && cv.score < 80) {
          primaryAction = {
            label: scoreDelta !== null && scoreDelta > 0 ? "📈 Continuer l'amélioration" : "📈 Améliorer le score",
            href: `/dashboard/optimize?cvId=${cv.id}`,
            style: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20",
          };
        } else {
          primaryAction = {
            label: "🚀 Exporter ce CV",
            href: `/dashboard/export?cvId=${cv.id}`,
            style: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20",
          };
          secondaryAction = {
            label: "Re-tester",
            href: `/dashboard/ats?cvId=${cv.id}`,
          };
        }

        return (
          <div key={cv.id}>
            <Card
              className={`
                bg-white border shadow-sm hover:shadow-md transition-all duration-200
                ${cv.isLatest ? "border-gray-900/20" : "border-gray-200/60"}
              `}
            >
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center shrink-0 ${
                      cv.isLatest ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                    }`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-serif text-xl font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                          {cv.title || "Document sans titre"}
                        </h3>
                        {cv.isLatest && (
                          <span className="px-3 py-1 bg-gray-900 text-white text-xs font-medium uppercase tracking-wider rounded-full">
                            CV Actif
                          </span>
                        )}
                        {cv.isBest && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium uppercase tracking-wider rounded-full">
                            🏆 Meilleur CV
                          </span>
                        )}
                      </div>

                      {/* CV Metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          Ajouté le {new Date(cv.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        {cv.totalAnalyses > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Target className="w-4 h-4" />
                            {cv.totalAnalyses} analyse{cv.totalAnalyses > 1 ? "s" : ""} ATS
                          </div>
                        )}
                      </div>

                      {/* Badges CV-Level */}
                      {cv.score !== null && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-medium text-gray-900">Dernier score : {cv.score}%</span>

                          {/* Delta Progression */}
                          {scoreDelta !== null && (
                            <span
                              className={`text-xs font-medium ${
                                scoreDelta > 0
                                  ? "text-green-700 bg-green-100 px-2 py-0.5 rounded-md"
                                  : scoreDelta < 0
                                  ? "text-red-700 bg-red-100 px-2 py-0.5 rounded-md"
                                  : "text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md"
                              }`}
                            >
                              {scoreDelta > 0 && "📈 +"}
                              {scoreDelta < 0 && "📉 "}
                              {scoreDelta === 0 && "〰️ "}
                              {scoreDelta}%
                            </span>
                          )}

                          {/* Score Rating */}
                          {cv.score >= 80 && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium uppercase tracking-wider rounded-md">
                              🔥 Excellent
                            </span>
                          )}
                          {cv.score < 60 && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium uppercase tracking-wider rounded-md">
                              ⚠️ À optimiser
                            </span>
                          )}
                        </div>
                      )}

                      {/* Sparkline */}
                      {cv.totalAnalyses >= 3 && (
                        <div className="w-full max-w-[250px] pt-1">
                          <Sparkline data={cv.sparklineData} color={sparklineColor} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {secondaryAction && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={secondaryAction.href}>
                          <Target className="w-4 h-4 mr-2" />
                          <span>{secondaryAction.label}</span>
                        </Link>
                      </Button>
                    )}

                    <Button
                      asChild
                      size="sm"
                      className={primaryAction.style || "bg-gray-900 hover:bg-gray-800 text-white"}
                    >
                      <Link href={primaryAction.href}>
                        <span>{primaryAction.label}</span>
                      </Link>
                    </Button>

                    <div className="w-px h-8 bg-gray-200 hidden md:block mx-2"></div>
                    <DeleteButton cvId={cv.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </StaggerChildren>
  );
}
