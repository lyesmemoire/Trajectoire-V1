// @ts-nocheck
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { InterviewReport } from "../../types/interviewReport";
import { Star, Award, Trophy, Sparkles } from "lucide-react";

interface HighlightsProps {
  report: InterviewReport;
}

export function Highlights({ report }: HighlightsProps) {
  const getIcon = (category: string) => {
    switch (category) {
      case "leadership":
        return Trophy;
      case "communication":
        return Sparkles;
      case "conflict":
        return Award;
      default:
        return Star;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-green-100 text-green-700 border-green-200";
      case "medium":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <Card className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Moments forts</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.highlights.map((highlight: typeof report.highlights[0], index: number) => {
              const Icon = getIcon(highlight.category);
              return (
                <motion.div
                  key={highlight.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  className="p-5 rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-100">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{highlight.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{highlight.description}</p>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor(highlight.impact)} capitalize`}>
                        Impact {highlight.impact}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {report.highlights.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Continuez à pratiquer pour débloquer vos moments forts !</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
