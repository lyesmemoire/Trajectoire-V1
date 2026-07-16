// @ts-nocheck
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { InterviewReport } from "../../types/interviewReport";
import { MessageSquare, Repeat, BookOpen, TrendingUp, Volume2 } from "lucide-react";

interface LanguageAnalysisProps {
  report: InterviewReport;
}

export function LanguageAnalysis({ report }: LanguageAnalysisProps) {
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "low":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <Card className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Analyse du langage</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <h4 className="font-medium text-gray-900">Mots parasites</h4>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">{report.languageAnalysis.fillerWords.count}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getFrequencyColor(report.languageAnalysis.fillerWords.frequency)}`}>
                    {report.languageAnalysis.fillerWords.frequency}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {report.languageAnalysis.fillerWords.examples.map((word, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-gray-200 rounded">{word}</span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <Repeat className="w-5 h-5 text-gray-600" />
                  <h4 className="font-medium text-gray-900">Répétitions</h4>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">{report.languageAnalysis.repetitions.count}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getFrequencyColor(report.languageAnalysis.repetitions.frequency)}`}>
                    {report.languageAnalysis.repetitions.frequency}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {report.languageAnalysis.repetitions.examples.map((word, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-gray-200 rounded">{word}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Clarté", score: report.languageAnalysis.clarity.score, feedback: report.languageAnalysis.clarity.feedback, icon: BookOpen },
                { label: "Vocabulaire", score: report.languageAnalysis.vocabulary.diversity, feedback: report.languageAnalysis.vocabulary.feedback, icon: BookOpen },
                { label: "Pouvoir de conviction", score: report.languageAnalysis.persuasion.score, feedback: report.languageAnalysis.persuasion.feedback, icon: TrendingUp },
                { label: "Fluidité", score: report.languageAnalysis.fluency.score, feedback: report.languageAnalysis.fluency.feedback, icon: Volume2 },
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <metric.icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">{metric.label}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.score}%` }}
                        transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                        className={`h-full ${getScoreColor(metric.score)}`}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900">{metric.score}%</span>
                  </div>
                  <p className="text-xs text-gray-600">{metric.feedback}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
