import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import ProblemGrid from "@/components/home/ProblemGrid";
import ScienceLegitimacy from "@/components/home/ScienceLegitimacy";
import TrustBar from "@/components/home/TrustBar";
import Method from "@/components/home/Method";
import Pricing from "@/components/home/Pricing";
import CTA from "@/components/home/CTA";
import WhyTrajectoire from "@/components/home/WhyTrajectoire";
import TimelineMethod from "@/components/home/TimelineMethod";
import Security from "@/components/home/Security";
import FAQ from "@/components/home/FAQ";
import ValuePreview from "@/components/home/ValuePreview";
import { Container } from "@/components/ui";

import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("@/components/home/Dashboard"));
const Results = dynamic(() => import("@/components/home/Results"));
const Testimonials = dynamic(() => import("@/components/home/Testimonials"));

export const metadata: Metadata = {
  title: "Trajectoire – Reprenez le contrôle. Passez de l'intuition à la certitude.",
  description: "Trajectoire aide les cadres et dirigeants à prendre les bonnes décisions avec clarté et confiance.",
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col overflow-hidden">
        <Hero />
        <div className="py-20 bg-surface-muted">
          <Container>
            <ValuePreview />
          </Container>
        </div>
        <TrustBar />
        <ProblemGrid />
        <WhyTrajectoire />
        <Dashboard />
        <Results />
        <Testimonials />
        <Method />
        <TimelineMethod />
        <ScienceLegitimacy />
        <Security />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}