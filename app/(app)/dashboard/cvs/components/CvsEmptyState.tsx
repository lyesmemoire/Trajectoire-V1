"use client";

import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Button, Card, CardContent, Reveal } from "@/components/design-system";

export function CvsEmptyState() {
  return (
    <Reveal direction="up" delay={0.2}>
      <Card className="bg-white border border-gray-200/60 shadow-sm">
        <CardContent className="py-20 px-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Aucun CV pour le moment</h3>
          <p className="text-gray-600 max-w-sm mx-auto mb-6 text-[15px]">
            Ajoutez votre premier CV en format PDF pour débloquer l'analyse ATS et l'optimisation.
          </p>
          <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
            <Link href="/cv">
              <Plus className="w-5 h-5 mr-2" /> Ajouter un CV
            </Link>
          </Button>
        </CardContent>
      </Card>
    </Reveal>
  );
}
