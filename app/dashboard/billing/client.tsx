"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function BillingClient() {
  const [loading, setLoading] = useState(false);

  const handlePortal = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stripe/customer-portal", { method: "POST" });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Une erreur est survenue");
        setLoading(false);
      }
    } catch (err) {
      alert("Erreur lors de la redirection vers Stripe.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePortal}
      disabled={loading}
      className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
          Chargement...
        </>
      ) : (
        "Gérer mon abonnement"
      )}
    </button>
  );
}
