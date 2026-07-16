// @ts-nocheck
"use client";

import { useState, useCallback } from "react";
import type { CVData } from "@/lib/pdf/types";

export function useCVAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvData, setCvData] = useState<CVData | null>(null);

  const analyze = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/cv/analyze", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Échec de l'analyse");
      const data = await res.json();
      setCvData(data.cvData);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, cvData, analyze };
}
