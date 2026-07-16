"use client";

import Link from "next/link";
import { Button, Card, CardContent, Reveal } from "@/components/design-system";
import { UploadSection } from "./upload-section";
import { CvsHeader } from "./components/CvsHeader";
import { CvsStats } from "./components/CvsStats";
import { CvsEmptyState } from "./components/CvsEmptyState";
import { CvsList } from "./components/CvsList";
import type { DashboardCvsData } from "./types";

export function CvsPageContent({ data }: { data: DashboardCvsData }) {
  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-8">
      {data.billing.plan === "free" && data.billing.hasUsedFreeTrial && (
        <Reveal direction="up">
          <Card className="bg-yellow-50 border border-yellow-200 shadow-sm">
            <CardContent className="p-6">
              <p className="text-gray-900 font-medium mb-2">
                🎯 Votre analyse gratuite a été utilisée.
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Passez à un plan payant pour des analyses illimitées et un rapport complet.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/billing">
                  Voir les offres
                </Link>
              </Button>
            </CardContent>
          </Card>
        </Reveal>
      )}

      <CvsHeader />

      <CvsStats kpis={data.kpis} />

      <UploadSection />

      {data.cvs.length === 0 ? (
        <CvsEmptyState />
      ) : (
        <CvsList cvs={data.cvs} />
      )}
    </div>
  );
}
