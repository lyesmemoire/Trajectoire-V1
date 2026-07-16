import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { InterviewReport } from "../../types/interviewReport";
import { ArrowRight, Target, TrendingUp } from "lucide-react";

interface NextSimulationProps {
  report: InterviewReport;
}

export function NextSimulation({ report }: NextSimulationProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "expert":
        return "bg-red-100 text-red-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <Card className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Prochaine simulation recommandée</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="p-5 rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xl font-semibold text-gray-900">{report.nextSimulation.type}</h4>
              <span className={`text-xs px-3 py-1 rounded-full ${getDifficultyColor(report.nextSimulation.difficulty)}`}>
                {report.nextSimulation.difficulty}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-4">{report.nextSimulation.reason}</p>
          </div>

          <div className="mb-4">
            <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Ce que cette simulation améliorera
            </h5>
            <ul className="space-y-2">
              {report.nextSimulation.improvements.map((improvement, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + index * 0.1, duration: 0.3 }}
                  className="text-sm text-gray-600 flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  {improvement}
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.4 }}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Commencer cette simulation
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
