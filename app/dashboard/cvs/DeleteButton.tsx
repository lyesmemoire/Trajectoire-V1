"use client";

import { useState } from "react";
import { deleteCv } from "./actions";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteButton({ cvId }: { cvId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce CV ? Cette action est irréversible.")) return;
    
    setIsDeleting(true);
    try {
      await deleteCv(cvId);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
      title="Supprimer le CV"
    >
      {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
    </button>
  );
}
