"use client"

import { motion } from "framer-motion"

interface Props {
  disabled: boolean
  loading: boolean
  onClick: () => void
}

export function AnalyzeButton({ disabled, loading, onClick }: Props) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      disabled={disabled}
      onClick={onClick}
      className={`w-full py-4 rounded-xl font-medium text-base transition-all duration-500 ${
        disabled
          ? "bg-ivoire-100 text-ink-400 border border-ivoire-200 cursor-not-allowed"
          : "bg-ink-900 text-ivoire-50 shadow-premium hover:shadow-premium-lg hover:bg-ink-800"
      }`}
    >
      {loading ? "Analyse en cours..." : "Analyser"}
    </motion.button>
  )
}
