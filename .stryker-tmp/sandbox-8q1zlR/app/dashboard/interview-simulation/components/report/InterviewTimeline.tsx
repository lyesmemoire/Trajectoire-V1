// @ts-nocheck
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { InterviewReport } from "../../types/interviewReport";

interface InterviewTimelineProps {
  report: InterviewReport;
}

export function InterviewTimeline({ report }: InterviewTimelineProps) {
  const getEventColor = (type: string) => {
    switch (type) {
      case "positive":
        return "bg-green-500";
      case "negative":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getEventBgColor = (type: string) => {
    switch (type) {
      case "positive":
        return "bg-green-50 border-green-200";
      case "negative":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <Card className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Timeline de l'entretien</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
            
            <div className="space-y-6">
              {report.timeline.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  className="relative pl-16"
                >
                  <div className="absolute left-4 top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm z-10">
                    <div className={`w-full h-full rounded-full ${getEventColor(event.type)}`} />
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${getEventBgColor(event.type)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{event.description}</span>
                      <span className="text-xs text-gray-500">{event.timestamp}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-white border capitalize">
                        {event.type}
                      </span>
                      <span className="text-xs text-gray-500">Impact: {event.impact}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
