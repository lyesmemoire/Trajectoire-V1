// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  FileText,
  Loader2,
  Target,
  ClipboardCheck,
  AlertCircle,
} from "lucide-react";
import { detectJobSource, JobSourceType } from "@/lib/jobs/detect-source";
import { normalizeJobInput } from "@/lib/jobs/normalize-job-input";

interface Props {
  onContentReady: (content: string, type: JobSourceType) => void;
  isLoading: boolean;
}

export function UniversalJobInput({ onContentReady, isLoading }: Props) {
  const [input, setInput] = useState("");
  const [sourceType, setSourceType] = useState<JobSourceType>("INVALID");
  const [isFocused, setIsFocused] = useState(false);
  const inputStartTime = useRef<number | null>(null);

  useEffect(() => {
    setSourceType(detectJobSource(input));
  }, [input]);

  const handleFocus = () => {
    setIsFocused(true);
    if (!inputStartTime.current) {
      inputStartTime.current = Date.now();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    // Analytics logic could be triggered here to measure "Focus -> Paste" time
  };

  const handleSubmit = () => {
    if (sourceType === "INVALID") return;
    const normalized = normalizeJobInput(input);
    onContentReady(normalized, sourceType);
  };

  return (
    <div className="w-full space-y-6">
      <div className="relative group">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          onPaste={handlePaste}
          placeholder="Collez l'annonce brute ou le lien (LinkedIn, Indeed...)"
          className="w-full h-56 p-8 rounded-[2.5rem] bg-white/[0.03] border-2 border-white/10 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all resize-none font-medium leading-relaxed text-lg shadow-inner"
          disabled={isLoading}
        />

        {/* Visual Cues for Human interaction */}
        <AnimatePresence>
          {sourceType !== "INVALID" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-md"
            >
              {sourceType.startsWith("URL") ? (
                <Link2 className="w-3 h-3 text-blue-400" />
              ) : (
                <FileText className="w-3 h-3 text-blue-400" />
              )}
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                {sourceType === "RAW_TEXT"
                  ? "Contenu Détecté"
                  : "Source Détectée"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {input.length > 0 && !isLoading && (
          <button
            onClick={() => setInput("")}
            className="absolute bottom-4 left-8 text-[10px] font-black uppercase text-slate-500 hover:text-rose-500 transition-colors"
          >
            Effacer
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={handleSubmit}
          disabled={isLoading || sourceType === "INVALID"}
          className="group relative h-20 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:opacity-50 text-white font-black text-xl rounded-3xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center overflow-hidden active:scale-[0.98]"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="animate-pulse">Extraction en cours...</span>
            </div>
          ) : (
            <span className="flex items-center gap-3">
              Obtenir mon Diagnostic{" "}
              <Target className="w-6 h-6 group-hover:scale-125 transition-transform" />
            </span>
          )}

          {/* Hover Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>

        <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-1.5">
            <ClipboardCheck className="w-3 h-3 text-emerald-500" />{" "}
            Auto-détection active
          </div>
          <div className="w-1 h-1 bg-slate-800 rounded-full" />
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 text-blue-500" /> Zéro Configuration
          </div>
        </div>
      </div>
    </div>
  );
}
