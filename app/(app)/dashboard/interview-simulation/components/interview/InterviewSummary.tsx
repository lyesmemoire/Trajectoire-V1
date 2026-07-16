import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/design-system";

interface InterviewSummaryProps {
  onContinue: () => void;
}

export function InterviewSummary({ onContinue }: InterviewSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/60 shadow-sm rounded-lg p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-white mx-auto mb-6 flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4">
            Merci.
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Nous avons terminé cet entretien.
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Je vais maintenant analyser vos réponses en détail.
          </p>
          <p className="text-gray-700 mb-8 leading-relaxed">
            Vous recevrez un rapport extrêmement détaillé avec des recommandations personnalisées.
          </p>
          <Button onClick={onContinue} className="bg-blue-600 hover:bg-blue-700">
            Voir mon rapport
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
