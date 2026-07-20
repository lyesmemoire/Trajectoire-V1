"use client";

/**
 * CvUpload — Upload PDF -> texte (P2).
 * Alternative au copier-coller, ne le remplace pas.
 * Envoie le PDF à /api/product/upload (extraction locale, sans stockage)
 * puis injecte le texte via onExtract().
 */

import { useRef, useState } from "react";
import { colors } from "./styles";

type Status = "idle" | "reading" | "done" | "error";

export function CvUpload({
  onExtract,
}: {
  onExtract: (text: string, meta?: { pages: number }) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setStatus("reading");
    setMessage("Lecture du CV…");

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/cv/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      if (!res.ok || !data.extractedText) {
        setStatus("error");
        setMessage(data?.error ?? "Échec de l'extraction.");
        return;
      }

      setStatus("done");
      setMessage(
        `Extraction réussie — ${data.textLength ?? "?"} caractères extraits.`,
      );
      onExtract(data.extractedText);
    } catch {
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

  const borderColor =
    status === "error"
      ? colors.bad
      : status === "done"
        ? colors.good
        : dragOver
          ? colors.brand
          : "#cbd5e1";

  return (
    <div>
      <div
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
        style={{
          border: `2px dashed ${borderColor}`,
          borderRadius: 12,
          padding: "22px 16px",
          textAlign: "center",
          cursor: "pointer",
          background: dragOver ? colors.brandSoft : colors.soft,
          transition: "border-color .2s, background .2s",
        }}
      >
        <div style={{ fontSize: 28 }}>📄</div>
        <p style={{ margin: "8px 0 2px", fontSize: 14, fontWeight: 600 }}>
          Uploader un CV (PDF)
        </p>
        <p style={{ margin: 0, fontSize: 12, color: colors.sub }}>
          Glisse-dépose ton fichier ici, ou clique pour choisir.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {status !== "idle" && (
        <p
          style={{
            marginTop: 8,
            fontSize: 13,
            color:
              status === "error"
                ? colors.bad
                : status === "done"
                  ? colors.good
                  : colors.sub,
          }}
        >
          {status === "reading" ? "⏳ " : status === "done" ? "✔ " : "⚠ "}
          {message}
        </p>
      )}

      <p style={{ marginTop: 8, fontSize: 12, color: colors.sub }}>
        🔒 On ne stocke pas ton CV — analyse locale du contenu uniquement.
      </p>
    </div>
  );
}
