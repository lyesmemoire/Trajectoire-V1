"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UploadDashboard() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    cvId: string;
    fileName: string;
  } | null>(null);

  const handleUpload = async (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Seuls les fichiers PDF sont acceptés pour le moment.");
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);
    setError(null);
    setSuccessData(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors du téléversement du CV.");
      }

      setSuccessData({
        cvId: data.cvId,
        fileName: data.fileName,
      });

      // Redirection automatique vers l'analyse ATS
      setTimeout(() => {
        router.push(`/dashboard/ats?cvId=${data.cvId}`);
      }, 2000);
    } catch (err) {
      console.error("[Upload] Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur inconnue est survenue.",
      );
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          Mon Espace <span className="text-blue-600">CV</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
          Importez votre CV actuel pour activer l'analyse ATS et personnaliser
          vos simulations d'entretien.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 text-red-700 p-5 rounded-[1.5rem] border border-red-100 flex items-center gap-3 font-bold shadow-sm"
          >
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {!file && !successData && !isUploading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`group relative border-[3px] border-dashed rounded-[3rem] p-16 md:p-24 text-center transition-all duration-300 cursor-pointer overflow-hidden ${
              isDragging
                ? "border-blue-500 bg-blue-50/50 scale-[1.01]"
                : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/30"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 mb-8 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Upload className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                Glissez-déposez votre CV
              </h3>
              <p className="text-slate-500 font-bold mb-10 max-w-sm mx-auto">
                Format PDF uniquement. Prêt pour l'analyse ATS ?
              </p>

              <div className="relative">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf"
                  onChange={onFileChange}
                  disabled={isUploading}
                />
                <Button variant="primary" size="lg" className="rounded-2xl">
                  Parcourir mes fichiers
                </Button>
              </div>
            </div>
          </motion.div>
        ) : isUploading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[3rem] border border-slate-200 p-24 text-center shadow-xl shadow-slate-200/50"
          >
            <div className="w-24 h-24 mx-auto bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-8 relative">
              <Loader2 className="w-12 h-12 animate-spin" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 italic">
              Extraction de vos données...
            </h3>
            <div className="flex flex-col items-center gap-2">
              <span className="text-slate-400 font-bold font-mono text-sm bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                {file?.name}
              </span>
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest mt-4">
                Analyse en cours par notre IA
              </p>
            </div>
          </motion.div>
        ) : successData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] border-2 border-emerald-100 p-16 md:p-24 text-center shadow-2xl shadow-emerald-500/10"
          >
            <div className="w-24 h-24 mx-auto bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mb-8 shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-3">
              Fichier analysé avec succès !
            </h3>
            <p className="text-slate-500 font-bold mb-10">
              Votre profil est maintenant prêt pour l'optimisation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href={`/dashboard/ats?cvId=${successData.cvId}`}>
                  Lancer l'analyse ATS <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                onClick={() => {
                  setFile(null);
                  setSuccessData(null);
                  setError(null);
                }}
                variant="ghost"
                className="font-black text-slate-500 hover:text-slate-900"
              >
                <RefreshCw className="mr-2 w-4 h-4" /> Changer de CV
              </Button>
            </div>
          </motion.div>
        ) : null}
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-8">
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/50">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-4">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="font-black text-slate-900 mb-2">Pourquoi un PDF ?</h4>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            Le PDF est le standard de l'industrie. Il préserve votre mise en
            page tout en étant parfaitement lisible par notre moteur
            d'extraction IA.
          </p>
        </div>
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/50">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm mb-4">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="font-black text-slate-900 mb-2">Données sécurisées</h4>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            Vos documents sont cryptés et ne sont jamais partagés. Vous gardez
            le contrôle total sur la suppression de vos données à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
}
