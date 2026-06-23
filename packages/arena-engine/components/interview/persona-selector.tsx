"use client";

import { PERSONAS } from "@/lib/interview/persona-config";
import { motion } from "framer-motion";
import { Brain, ShieldAlert, HeartHandshake, ChevronRight } from "lucide-react";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function PersonaSelector({ selectedId, onSelect }: Props) {
  const iconMap: any = {
    faang: <Brain className="w-6 h-6" />,
    stress: <ShieldAlert className="w-6 h-6" />,
    supportive: <HeartHandshake className="w-6 h-6" />,
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {Object.values(PERSONAS).map((persona) => (
        <motion.button
          key={persona.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(persona.id)}
          className={`relative p-8 rounded-[2.5rem] text-left transition-all border-2 ${
            selectedId === persona.id
              ? "border-blue-600 bg-blue-50/50 ring-4 ring-blue-600/10"
              : "border-slate-100 bg-white hover:border-slate-200"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg ${
              persona.id === "stress"
                ? "bg-rose-600"
                : persona.id === "faang"
                  ? "bg-blue-600"
                  : "bg-emerald-600"
            }`}
          >
            {iconMap[persona.id]}
          </div>

          <h3 className="text-xl font-black text-slate-900">{persona.name}</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            {persona.title}
          </p>

          <p className="text-sm text-slate-500 font-medium mt-4 leading-relaxed line-clamp-2">
            {persona.description}
          </p>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                Pression
              </span>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-1.5 rounded-full ${i <= persona.pressureLevel / 33 ? "bg-rose-500" : "bg-slate-100"}`}
                  />
                ))}
              </div>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${selectedId === persona.id ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-300"}`}
            >
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
