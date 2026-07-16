import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BillingClient } from "./client";
import { CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { Badge } from "@/components/design-system";

export const metadata = {
  title: "Abonnement - Trajectoire",
};

const PLAN_DISPLAY: Record<string, { name: string; desc: string; variant: "default" | "primary" | "secondary" }> = {
  free: {
    name: "Gratuit",
    desc: "1 analyse ATS complète à vie.",
    variant: "default"
  },
  essentiel: {
    name: "Essentiel",
    desc: "Analyses illimitées, historique et plan d'action.",
    variant: "primary"
  },
  performance: {
    name: "Performance",
    desc: "Notre formule la plus populaire avec optimisation ciblée.",
    variant: "secondary"
  },
  strategique: {
    name: "Stratégique",
    desc: "L'arsenal complet pour cadres dirigeants.",
    variant: "default"
  }
};

export default async function BillingPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch billing data
  const { data: usage } = await supabase
    .from("user_usage")
    .select("plan_type, current_period_end, subscription_status")
    .eq("user_id", user.id)
    .single();

  const planType = (usage?.plan_type as string) || "free";
  const displayPlan = (PLAN_DISPLAY[planType] || PLAN_DISPLAY.free) as { name: string; desc: string; variant: "default" | "primary" | "secondary" };

  const isCanceled = usage?.subscription_status === "canceled";
  const isPastDue = usage?.subscription_status === "past_due";

  let formattedDate = "";
  if (usage?.current_period_end) {
    formattedDate = new Date(usage.current_period_end).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-text flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-primary" />
          Abonnement
        </h1>
        <p className="text-text-secondary mt-2">
          Gérez votre forfait, vos factures et vos moyens de paiement.
        </p>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-2">
                Forfait actuel
              </h2>
              <Badge variant={displayPlan.variant} className="mb-3">
                {displayPlan.name}
              </Badge>
              <p className="text-text-secondary">
                {displayPlan.desc}
              </p>
            </div>

            <div className="shrink-0">
              {planType === "free" ? (
                <Button asChild>
                  <a href="/pricing">
                    Voir les offres
                  </a>
                </Button>
              ) : (
                <BillingClient />
              )}
            </div>
          </div>
        </CardHeader>

        {planType !== "free" && (
          <CardContent>
            <h3 className="text-lg font-semibold text-text mb-4">Statut de l'abonnement</h3>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {isPastDue ? (
                  <AlertCircle className="w-5 h-5 text-error" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                )}
                <span className="text-text">
                  Statut : {" "}
                  {isPastDue ? (
                    <span className="text-error font-medium">Paiement en échec</span>
                  ) : (
                    <span className="text-text font-medium capitalize">{usage?.subscription_status || "Actif"}</span>
                  )}
                </span>
              </div>

              {formattedDate && (
                <div className="flex items-center gap-3 text-text-secondary">
                  <div className="w-5" />
                  <span>
                    {isCanceled ? "Prendra fin le :" : "Prochain renouvellement le :"} {" "}
                    <span className="font-semibold text-text">{formattedDate}</span>
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      <Card variant="default">
        <CardContent className="p-8">
          <h3 className="text-lg font-semibold text-text mb-2">Besoin d'aide ?</h3>
          <p className="text-text-secondary mb-4">
            Vous avez une question sur la facturation ou vous souhaitez un devis sur-mesure pour votre entreprise ?
          </p>
          <Button asChild variant="outline">
            <a href="mailto:support@trajectoire.app">
              Contacter le support
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
