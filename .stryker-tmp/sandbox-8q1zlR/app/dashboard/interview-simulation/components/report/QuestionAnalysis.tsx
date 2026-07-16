// @ts-nocheck
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { InterviewReport } from "../../types/interviewReport";
import { CheckCircle2, XCircle, MessageSquare } from "lucide-react";

interface QuestionAnalysisProps {
  report: InterviewReport;
}

export function QuestionAnalysis({ report }: QuestionAnalysisProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <Card className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Analyse question par question</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {report.questionAnalysis.map((qa, index) => (
            <motion.div
              key={qa.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
              className="border border-gray-200 rounded-lg p-5 bg-gray-50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                  </div>
                  <p className="text-gray-900 font-medium mb-2">{qa.question}</p>
                  <p className="text-sm text-gray-600">{qa.responseSummary}</p>
                </div>
                <div className="ml-4 text-center">
                  <div className="text-3xl font-bold text-gray-900">{qa.score}%</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Points positifs
                  </h4>
                  <ul className="space-y-1">
                    {qa.positives.map((point, i) => (
                      <li key={i} className="text-sm text-gray-600">• {point}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Points à améliorer
                  </h4>
                  <ul className="space-y-1">
                    {qa.weaknesses.map((point, i) => (
                      <li key={i} className="text-sm text-gray-600">• {point}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Ce que le recruteur a pensé :</span> {qa.recruiterThoughts}
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                  <p className="text-sm text-purple-800">
                    <span className="font-medium">Ce qu'il aurait aimé entendre :</span> {qa.recruiterExpectations}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
