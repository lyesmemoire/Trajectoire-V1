"use client";

import React from "react";
import { Experience } from "@/types/cv";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ExperienceEditor = React.memo(function ExperienceEditor({
  experience, onChange, onRewrite, _}: {
  experience: Experience;
  onChange: (exp: Experience) => void;
  onRewrite: () => void;
}) {
  return (
    <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          value={experience.position}
          onChange={(e) =>
            onChange({ ...experience, position: e.target.value })
          }
          placeholder="Titre du poste"
          className="p-3 rounded-xl border border-slate-200 bg-white"
        />
        <input
          value={experience.company}
          onChange={(e) => onChange({ ...experience, company: e.target.value })}
          placeholder="Entreprise"
          className="p-3 rounded-xl border border-slate-200 bg-white"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <label className="text-sm font-semibold text-slate-700">
            Description
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRewrite}
            className="text-blue-600 hover:text-blue-700 gap-1.5 h-8"
          >
            <Sparkles className="w-3.5 h-3.5" /> Améliorer via IA
          </Button>
        </div>
        <textarea
          value={experience.description}
          onChange={(e) =>
            onChange({ ...experience, description: e.target.value })
          }
          placeholder="Description de l'expérience..."
          className="w-full p-4 min-h-[100px] rounded-xl border border-slate-200 bg-white"
        />

        {/* Bullets (simplifié pour cet exemple) */}
        {experience.bullets.map((bullet, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              value={bullet}
              onChange={(e) => {
                const newBullets = [...experience.bullets];
                newBullets[idx] = e.target.value;
                onChange({ ...experience, bullets: newBullets });
              }}
              className="flex-1 p-2 rounded-lg border border-slate-200 bg-white text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
});
