import { motion } from "framer-motion";
import { LiveScores } from "../../types/interview";

interface LiveEvaluationProps {
  scores: LiveScores;
}

export function LiveEvaluation({ scores }: LiveEvaluationProps) {
  return (
    <div className="space-y-3">
      {Object.entries(scores).map(([key, value]) => (
        <div key={key} className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-900 capitalize">{key}</p>
            <p className="text-xs text-gray-600">{value}%</p>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
