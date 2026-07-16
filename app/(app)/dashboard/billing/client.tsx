"use client";

import { useState } from "react";
import { Button } from "@/components/design-system";
import { safeFetch, NetworkError, TimeoutError } from "@/lib/api";
import { toast } from "sonner";

export function BillingClient() {
  const [loading, setLoading] = useState(false);

  const handlePortal = async () => {
    try {
      setLoading(true);
      const data = await safeFetch<{ url?: string; error?: string }>(
        "/api/stripe/customer-portal",
        { method: "POST" }
      );

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Une erreur est survenue");
        setLoading(false);
      }
    } catch (err) {
      if (err instanceof NetworkError) {
        toast.error("Connexion impossible. Vérifiez votre réseau.");
      } else if (err instanceof TimeoutError) {
        toast.error("Le serveur met trop de temps à répondre. Réessayez.");
      } else {
        toast.error("Erreur lors de la redirection vers Stripe.");
      }
      setLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handlePortal}
      loading={loading}
    >
      Gérer mon abonnement
    </Button>
  );
}
