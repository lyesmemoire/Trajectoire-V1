// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, Lock, ArrowUp } from "lucide-react";

type Status = "idle" | "reading" | "done" | "error";

interface CvUploadPremiumProps {
  onExtract?: (text: string, meta?: { pages: number }) => void;
  onSuccess?: (cvId: string, fileName: string) => void;
  endpoint?: "product" | "dashboard";
}

export function CvUploadPremium({ onExtract, onSuccess, endpoint = "product" }: CvUploadPremiumProps) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [message, setMessage] = React.useState<string>("");
  const [dragOver, setDragOver] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setStatus("reading");
    setMessage("Lecture du CV en cours...");
    setProgress(0);

    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    const form = new FormData();
    form.append("file", file);

    try {
      const apiUrl = endpoint === "dashboard" ? "/api/upload" : "/api/product/upload";
      const res = await fetch(apiUrl, {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error ?? "Échec de l'upload.");
        return;
      }

      if (endpoint === "dashboard") {
        // Dashboard endpoint returns { success, cvId, fileName }
        if (!data.success || !data.cvId) {
          setStatus("error");
          setMessage(data?.error ?? "Échec de l'upload.");
          return;
        }
        setStatus("done");
        setMessage("CV téléchargé avec succès");
        onSuccess?.(data.cvId, data.fileName);
      } else {
        // Product endpoint returns { cvText, meta }
        if (!data.cvText) {
          setStatus("error");
          setMessage(data?.error ?? "Échec de l'extraction.");
          return;
        }
        setStatus("done");
        setMessage(
          `Extraction réussie — ${data.meta?.pages ?? "?"} page(s) lue(s).`,
        );
        onExtract?.(data.cvText, data.meta);
      }
    } catch {
      clearInterval(progressInterval);
      setStatus("error");
      setMessage("Impossible de contacter le serveur.");
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const getStatusColor = () => {
    switch (status) {
      case "error":
        return "border-red-500 bg-red-50";
      case "done":
        return "border-green-500 bg-green-50";
      case "reading":
        return "border-gray-900 bg-gray-50";
      default:
        return dragOver
          ? "border-gray-900 bg-gray-100"
          : "border-gray-300 bg-white hover:border-gray-400";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "error":
        return <AlertCircle className="w-12 h-12 text-red-500" />;
      case "done":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "reading":
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <ArrowUp className="w-12 h-12 text-gray-900" />
          </motion.div>
        );
      default:
        return <Upload className="w-12 h-12 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-300
          ${getStatusColor()}
          ${dragOver ? "scale-[1.02] shadow-sm" : "shadow-sm hover:shadow-md"}
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {getStatusIcon()}
          </motion.div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {status === "idle" && "Glissez votre CV ici"}
              {status === "reading" && "Analyse en cours..."}
              {status === "done" && "CV téléchargé avec succès"}
              {status === "error" && "Erreur lors du téléchargement"}
            </h3>
            <p className="text-sm text-gray-600">
              {status === "idle" && "ou cliquez pour sélectionner un fichier"}
              {status === "reading" && "Veuillez patienter pendant l'extraction"}
              {status === "done" && "Votre CV est prêt pour l'analyse"}
              {status === "error" && "Veuillez réessayer avec un autre fichier"}
            </p>
          </div>

          {status === "idle" && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FileText className="w-4 h-4" />
              <span>PDF uniquement • Max 10 Mo</span>
            </div>
          )}

          {status === "reading" && (
            <div className="w-full max-w-xs">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gray-900 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{progress}%</p>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </motion.div>

      {status !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            flex items-center gap-2 text-sm p-3 rounded-lg
            ${status === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}
          `}
        >
          {status === "done" && <CheckCircle className="w-4 h-4" />}
          {status === "error" && <AlertCircle className="w-4 h-4" />}
          {status === "reading" && <ArrowUp className="w-4 h-4 animate-pulse" />}
          <span>{message}</span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg"
      >
        <Lock className="w-4 h-4" />
        <span>Vos données sont chiffrées et ne sont jamais partagées.</span>
      </motion.div>
    </div>
  );
}
