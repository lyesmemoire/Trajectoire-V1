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
          ? "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed"
          : "bg-indigo-500 text-white  hover: hover:bg-indigo-400"
      }`}
    >
      {loading ? "Analyse en cours..." : "Analyser"}
    </motion.button>
  )
}
