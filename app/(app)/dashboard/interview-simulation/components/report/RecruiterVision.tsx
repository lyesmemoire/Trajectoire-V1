import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { InterviewReport } from "../../types/interviewReport";
import { CheckCircle, AlertCircle, XCircle, User } from "lucide-react";

interface RecruiterVisionProps {
  report: InterviewReport;
}

export function RecruiterVision({ report }: RecruiterVisionProps) {
  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case "poursuivre":
        return "bg-green-100 text-green-700 border-green-200";
      case "hésitant":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-red-100 text-red-700 border-red-200";
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case "poursuivre":
        return CheckCircle;
      case "hésitant":
        return AlertCircle;
      default:
        return XCircle;
    }
  };

  const DecisionIcon = getDecisionIcon(report.recruiterVision.overallDecision);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <Card className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Vision du recruteur</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 p-5 rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100 flex-shrink-0">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Si j'étais votre recruteur...</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{report.recruiterVision.summary}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Pourquoi je poursuivrais votre candidature
              </h4>
              <ul className="space-y-2">
                {report.recruiterVision.wouldContinue.map((reason, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                    className="text-sm text-gray-600 flex items-start gap-2"
                  >
                    <span className="text-green-500 mt-0.5">•</span>
                    {reason}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                Pourquoi j'aurais encore quelques réserves
              </h4>
              <ul className="space-y-2">
                {report.recruiterVision.wouldHaveReservations.map((reason, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1, duration: 0.3 }}
                    className="text-sm text-gray-600 flex items-start gap-2"
                  >
                    <span className="text-yellow-500 mt-0.5">•</span>
                    {reason}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className={`p-4 rounded-lg border ${getDecisionColor(report.recruiterVision.overallDecision)} flex items-center gap-3`}
          >
            <DecisionIcon className="w-6 h-6" />
            <div>
              <div className="font-medium capitalize">Décision : {report.recruiterVision.overallDecision}</div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
