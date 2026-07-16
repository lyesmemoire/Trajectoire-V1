import { motion } from "framer-motion";

interface ThinkingIndicatorProps {
  message: string;
}

export function ThinkingIndicator({ message }: ThinkingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-center py-4"
    >
      <div className="flex items-center gap-3 text-gray-500">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-gray-400"
        />
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-gray-400"
        />
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 rounded-full bg-gray-400"
        />
        <span className="text-sm italic">{message}</span>
      </div>
    </motion.div>
  );
}
