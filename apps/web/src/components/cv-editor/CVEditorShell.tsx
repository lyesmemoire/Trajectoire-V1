"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ParsedCV } from "@/types/cv";
import { ExperienceEditor } from "./ExperienceEditor";
import { Loader2, Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Helper to proceed to interview lab only if cookie is present
const handleProceed = async (router: any) => {
  const hasCookie = document.cookie
    .split("; ")
    .some((c) => c.startsWith("cv-editor-completed=true"));
  if (!hasCookie) {
    toast.error("Veuillez exporter votre CV avant de commencer l'entretien.");
    return;
  }
  router.push("/interview-lab");
};

export function CVEditorShell({
  initialCV,
  aiCredits,
}: {
  initialCV: any;
  aiCredits: number;
}) {
  // Default blank CV
  const defaultCV: ParsedCV = {
    personalInfo: { fullName: "", email: "", phone: "", location: "" },
    summary: "",
    experiences: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
  };

  const [cv, setCv] = useState<ParsedCV>(
    initialCV ? (initialCV as ParsedCV) : defaultCV,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const router = useRouter();
  const [credits, setCredits] = useState<number>(aiCredits ?? 0);
  const [mounted, setMounted] = useState(false);

  // Mount guard to ensure hooks run consistently
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Autosave logic (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveCV(cv);
    }, 5000); // 5 seconds debounce
    return () => clearTimeout(timer);
  }, [cv]);

  // Defensive parse of pending CV rewrite data
  useEffect(() => {
    const raw = localStorage.getItem("pendingCVRewrite");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      // You may set state with parsed data here if needed
    } catch (err) {
      console.error("[CV_EDITOR_PARSE_ERROR]", err);
    }
  }, []);

  const saveCV = async (currentCV: ParsedCV) => {
    setIsSaving(true);
    try {
      // Not implemented in this phase's API, but simulating a save route
      // await fetch('/api/cv/save', { method: 'POST', body: JSON.stringify({ cv: currentCV }) });
      setIsSaving(false);
    } catch (err) {
      console.error("Autosave failed", err);
      setIsSaving(false);
    }
  };

  const exportDocx = async () => {
    // Prevent double export / race conditions
    if (isExporting) return;
    setIsExporting(true);
    try {
      const res = await fetch("/api/cv/export-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv }),
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cv.personalInfo.fullName.replace(/\s+/g, "_")}_CV.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("CV exporté avec succès !");
      // After successful export, mark flow as completed via API (ensures server flag)
      await fetch("/api/user/set-cv-editor-completed", { method: "POST" });
      // Also set local storage for immediate UI state
      localStorage.setItem("cv-editor-completed", "true");
      const secureFlag =
        process.env.NODE_ENV === "production" ? "; Secure" : "";
      document.cookie = `cv-editor-completed=true; Path=/; Max-Age=86400; SameSite=Lax${secureFlag}`;
      setExported(true);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'export.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleRewrite = async (
    action: string,
    content: string,
    sectionIndex?: number,
  ) => {
    if (credits <= 0) {
      toast.error("Crédits IA épuisés.");
      return;
    }

    const loadingToast = toast.loading("Amélioration IA en cours...");

    try {
      const res = await fetch("/api/cv/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, content }),
      });

      if (!res.ok) {
        if (res.status === 403) throw new Error("Crédits IA épuisés");
        throw new Error("Erreur IA");
      }

      const { result } = await res.json();

      // Update state based on action
      if (action === "improve_experience" && sectionIndex !== undefined) {
        const newExperiences = [...cv.experiences];
        newExperiences[sectionIndex]!.description = result;
        setCv({ ...cv, experiences: newExperiences });
      } else if (action === "rewrite_summary") {
        setCv({ ...cv, summary: result });
      }

      setCredits((prev: number) => prev - 1);
      toast.success("Section améliorée !");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erreur lors de l'amélioration.");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      {/* Toolbar */}
      <div className="flex justify-between items-center pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
          <span className="flex items-center gap-2">
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Sauvegarde..." : "Sauvegardé"}
          </span>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
            {credits} crédits IA
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={exportDocx}
            disabled={isExporting}
            className="gap-2 rounded-full px-6"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Exporter DOCX
          </Button>
          <Button
            onClick={handleProceed}
            disabled={!exported}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full"
          >
            Commencer l'entretien IA
          </Button>
        </div>
      </div>

      {/* Basic Editor Sections */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Informations Personnelles</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            value={cv.personalInfo.fullName}
            onChange={(e) =>
              setCv({
                ...cv,
                personalInfo: { ...cv.personalInfo, fullName: e.target.value },
              })
            }
            placeholder="Nom complet"
            className="p-3 rounded-xl border border-slate-200"
          />
          <input
            value={cv.personalInfo.email}
            onChange={(e) =>
              setCv({
                ...cv,
                personalInfo: { ...cv.personalInfo, email: e.target.value },
              })
            }
            placeholder="Email"
            className="p-3 rounded-xl border border-slate-200"
          />
        </div>

        <h2 className="text-xl font-bold mt-8">Résumé</h2>
        <textarea
          value={cv.summary}
          onChange={(e) => setCv({ ...cv, summary: e.target.value })}
          className="w-full p-4 min-h-[120px] rounded-xl border border-slate-200"
        />
        <Button
          variant="outline"
          onClick={() => handleRewrite("rewrite_summary", cv.summary || "")}
        >
          Améliorer le résumé
        </Button>

        <h2 className="text-xl font-bold mt-8">Expériences</h2>
        {cv.experiences.map((exp, idx) => (
          <ExperienceEditor
            key={idx}
            experience={exp}
            onChange={(updatedExp) => {
              const newExps = [...cv.experiences];
              newExps[idx] = updatedExp;
              setCv({ ...cv, experiences: newExps });
            }}
            onRewrite={() =>
              handleRewrite("improve_experience", exp.description || "", idx)
            }
          />
        ))}
      </div>
    </div>
  );
}
