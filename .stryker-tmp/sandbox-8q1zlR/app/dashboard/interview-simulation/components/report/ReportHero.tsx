// @ts-nocheck
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/design-system";
import { InterviewReport } from "../../types/interviewReport";

interface ReportHeroProps {
  report: InterviewReport;
}

export function ReportHero({ report }: ReportHeroProps) {
  const getSubtitle = () => {
    if (report.globalScore >= 80) {
      return "Excellent performance. Vous démontrez un niveau professionnel remarquable.";
    }
    if (report.globalScore >= 60) {
      return "Vous avez montré un bon potentiel. Certaines compétences sont déjà solides, d'autres méritent encore quelques entraînements.";
    }
    return "Des bases solides sont en place. Avec de la pratique, vous pourrez atteindre un niveau supérieur.";
  };

  const getLevelColor = () => {
    switch (report.level) {
      case "expert":
        return "text-green-600";
      case "avancé":
        return "text-blue-600";
      case "intermédiaire":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getProgressionIcon = () => {
    if (report.progression.trend === "up") return "↑";
    if (report.progression.trend === "down") return "↓";
    return "→";
  };

  const getProgressionColor = () => {
    if (report.progression.trend === "up") return "text-green-600";
    if (report.progression.trend === "down") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <Card className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl font-semibold text-gray-900 mb-4"
            >
              Votre entretien est terminé.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              {getSubtitle()}
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {report.globalScore}%
              </div>
              <div className="text-sm text-gray-600">Score global</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-center"
            >
              <div className={`text-2xl font-semibold ${getLevelColor()} mb-1 capitalize`}>
                {report.level}
              </div>
              <div className="text-sm text-gray-600">Niveau atteint</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-center"
            >
              <div className={`text-2xl font-semibold ${getProgressionColor()} mb-1`}>
                {getProgressionIcon()} {Math.abs(report.progression.change)}%
              </div>
              <div className="text-sm text-gray-600">Progression</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="text-center"
            >
              <div className="text-2xl font-semibold text-gray-900 mb-1">
                {Math.floor(report.duration / 60)}:{(report.duration % 60).toString().padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-600">Durée</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="text-center col-span-2 md:col-span-1"
            >
              <div className="text-lg font-semibold text-gray-900 mb-1 truncate">
                {report.company}
              </div>
              <div className="text-sm text-gray-600">Entreprise</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="text-center col-span-2 md:col-span-1"
            >
              <div className="text-lg font-semibold text-gray-900 mb-1 truncate">
                {report.position}
              </div>
              <div className="text-sm text-gray-600">Poste</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-6 pt-6 border-t border-gray-200 text-center"
          >
            <div className="text-sm text-gray-500">
              {report.date.toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
