import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/design-system";
import { InterviewReport } from "../../types/interviewReport";
import { Heart, ArrowRight } from "lucide-react";

interface MotivationProps {
  report: InterviewReport;
}

export function Motivation({ report }: MotivationProps) {
  const getMessage = () => {
    if (report.globalScore >= 80) {
      return {
        title: "Excellent travail !",
        message: "Vous avez démontré un niveau exceptionnel. Continuez à vous entraîner pour maintenir cette excellence et viser des postes de plus haute responsabilité.",
        emoji: "🏆",
      };
    }
    if (report.globalScore >= 60) {
      return {
        title: "Bravo pour votre progression !",
        message: "Vous êtes sur la bonne voie. Chaque simulation vous rapproche de vos objectifs. Continuez à pratiquer et vous verrez des résultats encore plus impressionnants.",
        emoji: "🚀",
      };
    }
    return {
      title: "Ne lâchez rien !",
      message: "Chaque expert a commencé par là. Votre persévérance est votre plus grand atout. Continuez à vous entraîner, les progrès viendront avec la pratique.",
      emoji: "💪",
    };
  };

  const motivation = getMessage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 shadow-sm rounded-lg">
        <CardContent className="p-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5, type: "spring" }}
              className="text-6xl mb-4"
            >
              {motivation.emoji}
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.4 }}
              className="text-2xl font-semibold text-gray-900 mb-4"
            >
              {motivation.title}
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.4 }}
              className="text-gray-700 mb-6 max-w-2xl mx-auto"
            >
              {motivation.message}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.4 }}
              className="flex items-center justify-center gap-4"
            >
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Vous n'avez jamais reçu un retour aussi détaillé</span>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.4 }}
              className="mt-6 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors mx-auto"
            >
              Recommencer une simulation
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
