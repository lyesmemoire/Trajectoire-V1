// @ts-nocheck
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { InterviewReport } from "../../types/interviewReport";
import { Progress } from "@/components/design-system";

interface GlobalScoreProps {
  report: InterviewReport;
}

export function GlobalScore({ report }: GlobalScoreProps) {
  const scoreEntries = Object.entries(report.scores) as [keyof typeof report.scores, typeof report.scores[keyof typeof report.scores]][];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "excellent":
        return "text-green-600";
      case "bon":
        return "text-blue-600";
      case "moyen":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getLabel = (key: string) => {
    const labels: Record<string, string> = {
      communication: "Communication",
      leadership: "Leadership",
      confidence: "Confiance",
      structure: "Structure",
      impact: "Impact",
      argumentation: "Argumentation",
      stressManagement: "Gestion du stress",
      listening: "Écoute",
    };
    return labels[key] || key;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <Card className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Score global par compétence</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scoreEntries.map(([key, score], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.4 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{getLabel(key)}</span>
                  <span className={`text-2xl font-bold ${getLevelColor(score.level)}`}>
                    {score.score}%
                  </span>
                </div>
                <Progress value={score.score} className="h-2" />
                <div className="text-sm text-gray-600">{score.explanation}</div>
                <div className="text-xs text-gray-500 italic">{score.justification}</div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                  {score.level}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
