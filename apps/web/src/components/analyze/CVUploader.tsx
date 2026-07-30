"use client"

import { useCallback, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  file: File | null
  onFile: (file: File | null) => void
}

export function CVUploader({ file, onFile }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateAndSetFile = useCallback((f: File | undefined) => {
    if (!f) return
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]
    if (!allowed.includes(f.type)) {
      setError("Format non supporté (PDF, DOCX ou TXT).")
      onFile(null)
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("Fichier trop volumineux (max 5MB).")
      onFile(null)
      return
    }
    setError(null)
    onFile(f)
  }, [onFile])

  return (
    <div className="w-full">
      <motion.label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          validateAndSetFile(e.dataTransfer.files?.[0])
        }}
        className={`relative flex flex-col items-center justify-center w-full min-h-[120px] p-4 border border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
          isDragging 
            ? "border-bronze-400 bg-bronze-50" 
            : "border-ivoire-300 bg-white/80 hover:border-bronze-400"
        }`}
      >
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => validateAndSetFile(e.target.files?.[0])}
        />
        <div className="flex flex-col items-center text-center">
          <p className="font-semibold text-base text-ink-900">
            {file ? file.name : "Importer votre CV"}
          </p>
          <p className="text-sm mt-1 text-ink-600">
            Glissez-déposez ou cliquez pour parcourir
          </p>
        </div>
        <AnimatePresence>
          {file && (
            <motion.button
              initial={{ opacity: 0, y: 5 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 5 }}
              whileHover={{ scale: 1.05 }}
              onClick={(e) => { e.preventDefault(); onFile(null); }}
              className="absolute top-2 right-2 text-xs text-ink-400 hover:text-ink-600 transition-colors bg-ivoire-100 px-2 py-1 rounded-md"
            >
              Retirer
            </motion.button>
          )}
        </AnimatePresence>
      </motion.label>
      
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="text-brick-500 text-sm mt-2 text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
