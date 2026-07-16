// @ts-nocheck
import { Mic, Volume2, Clock, Pause, Play, Square, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/design-system";
import { MicroState } from "../../types/interview";

interface MicrophoneControlsProps {
  microState: MicroState;
  onToggle: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onFinish?: () => void;
}

export function MicrophoneControls({ microState, onToggle, onPause, onResume, onFinish }: MicrophoneControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg p-8">
        <div className="flex flex-col items-center">
          <motion.div
            animate={
              microState === "listening" 
                ? { scale: [1, 1.02, 1], opacity: [1, 0.8, 1] }
                : microState === "speaking"
                ? { scale: [1, 1.08, 1] }
                : microState === "analyzing"
                ? { rotate: 360 }
                : microState === "thinking"
                ? { scale: [1, 0.95, 1] }
                : { scale: 1 }
            }
            transition={{
              duration: microState === "analyzing" ? 1 : microState === "thinking" ? 2 : 2,
              repeat: microState === "analyzing" ? 1 : Infinity,
              ease: "easeInOut",
            }}
            className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 cursor-pointer transition-colors ${
              microState === "idle" 
                ? "bg-gradient-to-br from-gray-400 to-gray-500" 
                : microState === "listening"
                ? "bg-gradient-to-br from-blue-400 to-blue-500"
                : microState === "speaking"
                ? "bg-gradient-to-br from-green-400 to-green-500"
                : microState === "analyzing" || microState === "thinking"
                ? "bg-gradient-to-br from-purple-400 to-purple-500"
                : "bg-gradient-to-br from-gray-400 to-gray-500"
            }`}
            onClick={onToggle}
          >
            {microState === "idle" && <Mic className="w-16 h-16 text-white" />}
            {microState === "listening" && <Mic className="w-16 h-16 text-white" />}
            {microState === "speaking" && <Volume2 className="w-16 h-16 text-white" />}
            {(microState === "analyzing" || microState === "thinking") && <Settings className="w-16 h-16 text-white animate-spin" />}
          </motion.div>
          <p className="text-sm text-gray-600 mb-6">
            {microState === "idle" && "Appuyez pour commencer"}
            {microState === "listening" && "Je vous écoute..."}
            {microState === "speaking" && "Vous parlez..."}
            {microState === "analyzing" && "Analyse en cours..."}
            {microState === "thinking" && "Réflexion..."}
          </p>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600">Niveau sonore: {microState === "speaking" ? "75%" : "0%"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600">Temps de réponse: 01:23</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onPause}>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
            <Button variant="outline" size="sm" onClick={onResume}>
              <Play className="w-4 h-4 mr-2" />
              Reprendre
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={onFinish}>
              <Square className="w-4 h-4 mr-2" />
              Terminer ma réponse
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
