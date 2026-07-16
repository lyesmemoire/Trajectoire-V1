import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { InterviewReport } from "../../types/interviewReport";
import { Lightbulb, ArrowRight } from "lucide-react";

interface ImprovementsProps {
  report: InterviewReport;
}

export function Improvements({ report }: ImprovementsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Priorité haute";
      case "medium":
        return "Priorité moyenne";
      default:
        return "Priorité faible";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <Card className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Axes d'amélioration</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {report.improvements.map((improvement, index) => (
              <motion.div
                key={improvement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                className="p-5 rounded-lg border border-gray-200 bg-gray-50"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-amber-100 flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">{improvement.category}</span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(improvement.priority)}`}>
                        {getPriorityLabel(improvement.priority)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{improvement.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ArrowRight className="w-4 h-4" />
                      <span className="font-medium">Suggestion :</span>
                      <span>{improvement.suggestion}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
