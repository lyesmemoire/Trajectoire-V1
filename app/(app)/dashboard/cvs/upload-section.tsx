"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CvUploadPremium } from "@/components/candidate/cv-upload-premium";
import { Button } from "@/components/design-system";
import { X, Plus } from "lucide-react";

export function UploadSection() {
  const router = useRouter();
  const [showUpload, setShowUpload] = useState(true);

  const handleUploadSuccess = (_cvId: string, _fileName: string) => {
    // Rafraîchir la page pour afficher le nouveau CV
    router.refresh();
  };

  if (!showUpload) {
    return (
      <div className="mb-8">
        <Button
          onClick={() => setShowUpload(true)}
          variant="outline"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un CV
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-semibold text-gray-900 tracking-tight">
          Ajouter un CV
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowUpload(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <CvUploadPremium
        endpoint="dashboard"
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
