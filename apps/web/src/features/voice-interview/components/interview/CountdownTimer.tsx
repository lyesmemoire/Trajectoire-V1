import React, { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  onComplete: () => void;
}

export const CountdownTimer = memo(function CountdownTimer({ onComplete }: CountdownTimerProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // 6 seconds total: 3 stages of 2 seconds
    const timer1 = setTimeout(() => setStage(1), 2000);
    const timer2 = setTimeout(() => setStage(2), 4000);
    const timer3 = setTimeout(() => onComplete(), 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  const messages = [
    "Prenez quelques instants pour vous installer.",
    "Respirez tranquillement...",
    "L'entretien va commencer."
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-12">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 4, 
          ease: "easeInOut",
          repeat: Infinity
        }}
        className="w-32 h-32 rounded-full bg-sky-100 flex items-center justify-center"
      >
        <div className="w-16 h-16 rounded-full bg-sky-200" />
      </motion.div>

      <div className="h-12 overflow-hidden relative w-full flex justify-center">
        <motion.p
          key={stage}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-2xl text-slate-600 absolute"
        >
          {messages[stage] || ""}
        </motion.p>
      </div>
    </div>
  );
});
