// @ts-nocheck
"use client";

import { useState } from "react";
import { Download, Loader2, Eye, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/design-system";
import { CVData, ExportOptions } from "@/lib/pdf/types";
import { PDFPreviewModal } from "./PDFPreviewModal";

interface ExportButtonProps {
  cvData: CVData;
  disabled?: boolean;
}

export function ExportButton({ cvData, disabled }: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedColor, setSelectedColor] =
    useState<ExportOptions["colorScheme"]>("blue");

  const handleExport = async () => {
    setIsLoading(true);
    const options: ExportOptions = {
      template: "modern",
      colorScheme: selectedColor,
      fontSize: "normal",
    };

    try {
      const response = await fetch("/api/cv/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData, options }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la génération");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeName = cvData.personalInfo.name.replace(/\s+/g, "_");
      a.download = `CV_${safeName}_${new Date().getFullYear()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Impossible de générer le PDF. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const colorOptions: Array<{
    id: ExportOptions["colorScheme"];
    color: string;
  }> = [
    { id: "blue", color: "bg-blue-600" },
    { id: "green", color: "bg-emerald-600" },
    { id: "purple", color: "bg-violet-600" },
    { id: "dark", color: "bg-slate-900" },
  ];

  return (
    <div className="flex flex-col gap-6 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-lg font-black text-slate-900">
            Finalisez votre CV
          </h4>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Format PDF · Optimisé ATS
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Couleur d'accent
        </label>
        <div className="flex gap-3">
          {colorOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedColor(opt.id)}
              className={`w-8 h-8 rounded-full border-4 transition-all ${
                selectedColor === opt.id
                  ? "border-slate-200 scale-110"
                  : "border-transparent opacity-60 hover:opacity-100"
              } ${opt.color}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => setShowPreview(true)}
          variant="outline"
          className="flex-1 rounded-2xl h-14 font-black"
          disabled={disabled || isLoading}
        >
          <Eye className="w-5 h-5 mr-2" /> Aperçu
        </Button>
        <Button
          onClick={handleExport}
          variant="primary"
          className="flex-1 rounded-2xl h-14 font-black shadow-blue-500/20"
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Download className="w-5 h-5 mr-2" />
          )}
          {isLoading ? "Génération..." : "Télécharger PDF"}
        </Button>
      </div>

      <div className="pt-4 border-t border-slate-50 flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
        <CheckCircle2 className="w-3.5 h-3.5" /> Garanti lisible par tous les
        ATS
      </div>

      {showPreview && (
        <PDFPreviewModal
          cvData={cvData}
          options={{
            template: "modern",
            colorScheme: selectedColor,
            fontSize: "normal",
          }}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onExport={() => {
            setShowPreview(false);
            handleExport();
          }}
        />
      )}
    </div>
  );
}
