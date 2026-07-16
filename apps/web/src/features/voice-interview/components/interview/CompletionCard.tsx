import React, { memo } from "react";
import { motion } from "framer-motion";

export const CompletionCard = memo(function CompletionCard() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-center max-w-2xl px-8"
      >
        <h2 className="text-4xl font-light text-text-primary mb-8 tracking-wide">
          Merci.
        </h2>
        
        <p className="text-2xl text-text-secondary font-light leading-relaxed mb-4">
          Votre entretien est terminé.
        </p>
        <p className="text-xl text-text-muted font-light leading-relaxed mb-12">
          Vous pouvez maintenant fermer cette fenêtre.
        </p>
        
        <p className="text-lg text-text-muted font-light italic">
          Vous recevrez prochainement les résultats de votre entretien.
        </p>
      </motion.div>
    </div>
  );
});
