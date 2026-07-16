"use client";

import { useState } from "react";
import { Check, Copy, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/design-system";

interface CVEditorProps {
  original: string;
  optimized: string;
  onSave?: (text: string) => void;
}

export function CVEditor({ original, optimized, onSave }: CVEditorProps) {
  const [editedText, setEditedText] = useState(optimized);
  const [copied, setCopied] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm bg-white">
      <div className="flex items-center justify-between px-8 py-4 bg-slate-50 border-b border-slate-100">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Éditeur Stratégique
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditedText(optimized)}
            disabled={!isDirty}
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Réinitialiser
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? (
              <Check className="w-4 h-4 mr-2 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? "Copié !" : "Copier"}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              onSave?.(editedText);
              setIsDirty(false);
            }}
            disabled={!isDirty}
          >
            <Save className="w-4 h-4 mr-2" /> Sauvegarder
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 divide-x divide-slate-100">
        <div className="p-8 space-y-4">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Source Originale
          </span>
          <div className="text-xs text-slate-400 font-mono whitespace-pre-wrap leading-relaxed opacity-60">
            {original}
          </div>
        </div>
        <div className="p-8 space-y-4 bg-blue-50/10">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
            Optimisation IA
          </span>
          <textarea
            value={editedText}
            onChange={(e) => {
              setEditedText(e.target.value);
              setIsDirty(true);
            }}
            className="w-full min-h-[500px] text-sm text-slate-700 font-medium bg-transparent border-none outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
