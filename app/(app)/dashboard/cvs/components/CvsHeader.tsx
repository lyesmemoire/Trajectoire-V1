"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/design-system";
import { Reveal } from "@/components/design-system";

export function CvsHeader() {
  return (
    <Reveal direction="up" className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="font-serif text-4xl font-semibold text-gray-900 tracking-tight">
          Mes Documents
        </h1>
        <p className="text-gray-600 mt-2 text-[15px]">
          Centralisez vos CV pour lancer des analyses ATS et des optimisations ciblées.
        </p>
      </div>
      <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
        <Link href="/cv">
          <Plus className="w-5 h-5 mr-2" /> Ajouter un CV
        </Link>
      </Button>
    </Reveal>
  );
}
