import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { InterviewReport } from "../../types/interviewReport";
import { Calendar, Target, CheckCircle2 } from "lucide-react";

interface ActionPlanProps {
  report: InterviewReport;
}

export function ActionPlan({ report }: ActionPlanProps) {
  const plans = [
    { title: "7 jours", steps: report.actionPlan.sevenDays, color: "from-green-50 to-emerald-50", borderColor: "border-green-200" },
    { title: "30 jours", steps: report.actionPlan.thirtyDays, color: "from-blue-50 to-indigo-50", borderColor: "border-blue-200" },
    { title: "90 jours", steps: report.actionPlan.ninetyDays, color: "from-purple-50 to-pink-50", borderColor: "border-purple-200" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <Card className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Plan d'action personnalisé</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, planIndex) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + planIndex * 0.1, duration: 0.4 }}
                className={`p-5 rounded-lg border ${plan.borderColor} bg-gradient-to-br ${plan.color}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-gray-700" />
                  <h4 className="font-semibold text-gray-900">{plan.title}</h4>
                </div>
                <div className="space-y-3">
                  {plan.steps.map((step, stepIndex) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 + planIndex * 0.1 + stepIndex * 0.05, duration: 0.3 }}
                      className="p-3 rounded-lg bg-white border border-gray-200"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 text-sm mb-1">{step.objective}</h5>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              <span>Durée: {step.duration}</span>
                            </div>
                            <p>Résultat attendu: {step.expectedResult}</p>
                            {step.resources && step.resources.length > 0 && (
                              <p>Ressources: {step.resources.join(", ")}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
