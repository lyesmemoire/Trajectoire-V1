// @ts-nocheck
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { InterviewReport } from "../../types/interviewReport";
import { Shield, Heart, Crown, Zap, Target, User } from "lucide-react";

interface PostureAnalysisProps {
  report: InterviewReport;
}

export function PostureAnalysis({ report }: PostureAnalysisProps) {
  const metrics = [
    { key: "confidence", label: "Confiance", icon: Shield, data: report.postureAnalysis.confidence },
    { key: "calmness", label: "Calme", icon: Heart, data: report.postureAnalysis.calmness },
    { key: "leadership", label: "Leadership", icon: Crown, data: report.postureAnalysis.leadership },
    { key: "energy", label: "Énergie", icon: Zap, data: report.postureAnalysis.energy },
    { key: "impact", label: "Impact", icon: Target, data: report.postureAnalysis.impact },
    { key: "presence", label: "Présence", icon: User, data: report.postureAnalysis.presence },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <Card className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Analyse de la posture</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.08, duration: 0.4 }}
                className="p-4 rounded-lg border border-gray-200 bg-gray-50 text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <metric.icon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{metric.data.score}%</div>
                <div className="text-sm font-medium text-gray-900 mb-2">{metric.label}</div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.data.score}%` }}
                    transition={{ delay: 1 + index * 0.08, duration: 0.5 }}
                    className={`h-full ${getScoreColor(metric.data.score)}`}
                  />
                </div>
                <p className="text-xs text-gray-600">{metric.data.feedback}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
