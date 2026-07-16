"use client";

import { X, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/design-system";
import { CVData, ExportOptions } from "@/lib/pdf/types";
import dynamic from "next/dynamic";

// Chargement dynamique pour éviter les erreurs SSR liées à react-pdf
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    ),
  },
);

const ModernTemplate = dynamic(
  () => import("@/lib/pdf/templates/modern").then((mod) => mod.ModernTemplate),
  { ssr: false },
);

interface PDFPreviewModalProps {
  cvData: CVData;
  options: ExportOptions;
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
}

export function PDFPreviewModal({
  cvData,
  options,
  isOpen,
  onClose,
  onExport,
}: PDFPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Aperçu du CV Optimisé
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Template Modern · Prêt pour l'envoi
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={onExport} size="sm" variant="primary">
              <Download className="w-4 h-4 mr-2" /> Télécharger
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Viewer */}
        <div className="flex-1 bg-slate-100 p-4 overflow-hidden">
          <PDFViewer
            width="100%"
            height="100%"
            style={{ borderRadius: "1rem", border: "none" }}
          >
            <ModernTemplate data={cvData} options={options} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}
