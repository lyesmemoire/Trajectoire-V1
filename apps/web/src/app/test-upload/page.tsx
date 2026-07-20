"use client";

/**
 * Page de test pour CvUpload
 * Page temporaire pour valider la migration L2.1
 */

import { CvUpload } from "@/components/product/CvUpload";

export default function TestUploadPage() {
  return (
    <main style={{ padding: 40, maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>Test Upload CV</h1>
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, background: "#fff" }}>
        <CvUpload onExtract={(text, meta) => console.log("Extracted:", text, meta)} />
      </div>
    </main>
  );
}
