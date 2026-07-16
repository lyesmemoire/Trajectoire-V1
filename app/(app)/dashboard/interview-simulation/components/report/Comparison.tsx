import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { InterviewReport } from "../../types/interviewReport";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ComparisonProps {
  report: InterviewReport;
}

export function Comparison({ report }: ComparisonProps) {
  const getGapIcon = (gap: number) => {
    if (gap > 0) return TrendingUp;
    if (gap < 0) return TrendingDown;
    return Minus;
  };

  const getGapColor = (gap: number) => {
    if (gap > 0) return "text-red-600";
    if (gap < 0) return "text-green-600";
    return "text-gray-600";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <Card className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Comparaison avec les attentes</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 text-center">
              <div className="text-sm text-gray-600 mb-1">Votre niveau</div>
              <div className="text-3xl font-bold text-gray-900">{report.comparison.userLevel}%</div>
            </div>
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 text-center">
              <div className="text-sm text-gray-600 mb-1">Attendu pour ce poste</div>
              <div className="text-3xl font-bold text-gray-900">{report.comparison.expectedLevel}%</div>
            </div>
          </div>

          <div className="space-y-4">
            {report.comparison.gaps.map((gap, index) => {
              const GapIcon = getGapIcon(gap.gap);
              return (
                <motion.div
                  key={gap.skill}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">{gap.skill}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(gap.priority)}`}>
                      {gap.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">Vous: {gap.userScore}%</span>
                        <GapIcon className={`w-4 h-4 ${getGapColor(gap.gap)}`} />
                        <span className="text-sm text-gray-600">Attendu: {gap.expectedScore}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(gap.userScore / gap.expectedScore) * 100}%` }}
                          transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                          className={`h-full ${gap.userScore >= gap.expectedScore ? "bg-green-500" : "bg-blue-500"}`}
                        />
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${getGapColor(gap.gap)}`}>
                      {gap.gap > 0 ? "+" : ""}{gap.gap}%
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
