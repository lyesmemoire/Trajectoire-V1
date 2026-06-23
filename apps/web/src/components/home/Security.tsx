"use client";

import { Shield, Lock, CheckCircle2, Database } from "lucide-react";
import { Container, SectionHeader, Card } from "@/components/ui";

const SECURITY_ITEMS = [
  {
    icon: <Lock size={20} />,
    title: "Données chiffrées",
    description: "Chiffrement de bout en bout de vos évaluations et rapports personnels.",
  },
  {
    icon: <Database size={20} />,
    title: "Aucune revente",
    description: "Votre profil vous appartient. Nous ne monétisons jamais vos données.",
  },
  {
    icon: <Shield size={20} />,
    title: "Conforme RGPD",
    description: "Hébergement européen sécurisé et respect strict des normes.",
  },
  {
    icon: <CheckCircle2 size={20} />,
    title: "Suppression totale",
    description: "Un clic suffit pour effacer définitivement vos traces.",
  },
];

export default function Security() {
  return (
    <section className="py-16 bg-brand-primary text-white">
      <Container>
        <SectionHeader
          badge="Confidentialité absolue"
          badgeVariant="inverse"
          title="Vos données restent privées."
          description="Parce que vos décisions de carrière vous appartiennent."
          inverse={true}
          className="mb-12"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECURITY_ITEMS.map((item, idx) => (
            <Card key={idx} variant="dark" padding="md" className="border-white/10 bg-white/5 flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4">
                {item.icon}
              </div>
              <h3 className="text-body font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/70">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
