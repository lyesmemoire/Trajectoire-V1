import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { InterviewReport } from "../../types/interviewReport";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface STARAnalysisProps {
  report: InterviewReport;
}

export function STARAnalysis({ report }: STARAnalysisProps) {
  const getPartStatus = (present: boolean, quality: number) => {
    if (!present) return { icon: XCircle, color: "text-red-500", bg: "bg-red-100" };
    if (quality >= 70) return { icon: CheckCircle, color: "text-green-500", bg: "bg-green-100" };
    return { icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-100" };
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 70) return "bg-green-500";
    if (quality >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <Card className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Analyse STAR</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {report.starAnalysis.map((analysis, index) => (
              <motion.div
                key={analysis.questionId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                className="border border-gray-200 rounded-lg p-5 bg-gray-50"
              >
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{analysis.overallScore}%</span>
                    <span className="text-sm text-gray-600">Score STAR global</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: "situation", label: "Situation", data: analysis.situation },
                    { key: "task", label: "Tâche", data: analysis.task },
                    { key: "action", label: "Action", data: analysis.action },
                    { key: "result", label: "Résultat", data: analysis.result },
                  ].map((part) => {
                    const status = getPartStatus(part.data.present, part.data.quality);
                    const Icon = status.icon;
                    return (
                      <div key={part.key} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-full ${status.bg}`}>
                            <Icon className={`w-4 h-4 ${status.color}`} />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{part.label}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                                  animate={{ width: `${part.data.quality}%` }}
                                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                                  className={`h-full ${getQualityColor(part.data.quality)}`}
                                />
                          </div>
                          <p className="text-xs text-gray-600">{part.data.feedback}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
