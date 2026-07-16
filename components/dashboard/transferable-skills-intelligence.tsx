"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { CheckCircle, AlertCircle, XCircle, ArrowRight, TrendingUp } from "lucide-react";

interface TransferableSkill {
  missingSkill: string;
  sourceSkill: string | null;
  transferPath: string[];
  transferConfidence: number;
  transferExplanation: string;
}

interface TransferableSkillsData {
  directTransferable: TransferableSkill[];
  partialTransferable: TransferableSkill[];
  notTransferable: TransferableSkill[];
}

interface TransferableSkillsIntelligenceProps {
  transferableData: TransferableSkillsData | null;
}

export function TransferableSkillsIntelligence({ transferableData }: TransferableSkillsIntelligenceProps) {
  if (!transferableData) {
    return (
      <Card className="bg-white border border-gray-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Compétences Transférables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 text-sm py-8">
            Aucune donnée de transférabilité disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  const { directTransferable, partialTransferable, notTransferable } = transferableData;

  const totalSkills = directTransferable.length + partialTransferable.length + notTransferable.length;
  const averageConfidence = totalSkills > 0
    ? Math.round(
        (directTransferable.reduce((sum, s) => sum + s.transferConfidence, 0) +
         partialTransferable.reduce((sum, s) => sum + s.transferConfidence, 0)) /
        (directTransferable.length + partialTransferable.length || 1)
      )
    : 0;

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Compétences Transférables</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-4 gap-4">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">Directes</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{directTransferable.length}</div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-medium text-yellow-700">Partielles</span>
              </div>
              <div className="text-2xl font-bold text-yellow-900">{partialTransferable.length}</div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-700">Non transférables</span>
              </div>
              <div className="text-2xl font-bold text-red-900">{notTransferable.length}</div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Confiance moyenne</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{averageConfidence}%</div>
            </m.div>
          </div>

          {/* Direct Transferable */}
          {directTransferable.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Compétences directement transférables</span>
              </div>
              <div className="space-y-2">
                {directTransferable.map((skill, index) => (
                  <m.div
                    key={skill.missingSkill}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-green-900">{skill.missingSkill}</span>
                      <span className="text-xs font-medium text-green-700">{skill.transferConfidence}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>{skill.sourceSkill}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span>{skill.missingSkill}</span>
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          )}

          {/* Partial Transferable */}
          {partialTransferable.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-900">Compétences partiellement transférables</span>
              </div>
              <div className="space-y-2">
                {partialTransferable.map((skill, index) => (
                  <m.div
                    key={skill.missingSkill}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-yellow-900">{skill.missingSkill}</span>
                      <span className="text-xs font-medium text-yellow-700">{skill.transferConfidence}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>{skill.sourceSkill}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span>{skill.missingSkill}</span>
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          )}

          {/* Not Transferable */}
          {notTransferable.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Compétences non transférables</span>
              </div>
              <div className="space-y-2">
                {notTransferable.map((skill, index) => (
                  <m.div
                    key={skill.missingSkill}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-900">{skill.missingSkill}</span>
                      <span className="text-xs text-red-600">Aucun transfert possible</span>
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
