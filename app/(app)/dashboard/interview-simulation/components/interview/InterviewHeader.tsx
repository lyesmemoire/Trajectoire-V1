import { Mic, Wifi } from "lucide-react";
import { motion } from "framer-motion";
import { InterviewConfig } from "../../types/interview";

interface InterviewHeaderProps {
  config: InterviewConfig;
  elapsedTime: number;
  currentQuestion: number;
  totalQuestions: number;
}

export function InterviewHeader({ config, elapsedTime, currentQuestion, totalQuestions }: InterviewHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getCompanyName = () => {
    switch (config.interviewType) {
      case "technical": return "InnovationTech";
      case "commercial": return "GlobalSales";
      case "direction": return "ExecutivePartners";
      default: return "TalentCorp";
    }
  };

  const getPositionName = () => {
    switch (config.interviewType) {
      case "technical": return "Lead Developer";
      case "commercial": return "Account Manager";
      case "direction": return "Directeur Division";
      default: return "Chef de Projet";
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 bg-white border-b border-gray-200/60 shadow-sm"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Entreprise</p>
              <p className="text-sm font-semibold text-gray-900">{getCompanyName()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Poste</p>
              <p className="text-sm font-semibold text-gray-900">{getPositionName()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Temps écoulé</p>
              <p className="text-sm font-semibold text-gray-900">{formatTime(elapsedTime)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Question</p>
              <p className="text-sm font-semibold text-gray-900">{currentQuestion} / {totalQuestions}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
              <Mic className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Micro connecté</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200">
              <Wifi className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Connexion stable</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
