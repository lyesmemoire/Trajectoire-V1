"use client";

import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import CredibilityBar from "@/components/home/CredibilityBar";
import TrustBar from "@/components/home/TrustBar";
import ProblemGrid from "@/components/home/ProblemGrid";
import WhyTrajectoire from "@/components/home/WhyTrajectoire";
import Method from "@/components/home/Method";
import TimelineMethod from "@/components/home/TimelineMethod";
import ScienceLegitimacy from "@/components/home/ScienceLegitimacy";
import Security from "@/components/home/Security";
import Results from "@/components/home/Results";
import FAQ from "@/components/home/FAQ";
import Pricing from "@/components/home/Pricing";
import CTA from "@/components/home/CTA";
import Footer from "@/components/home/Footer";
import { useScrollTracking } from "@/hooks/useScrollTracking";

// We keep Dashboard and Testimonials dynamic if they contain heavy libraries like recharts/framer
const Dashboard = dynamic(() => import("@/components/home/Dashboard"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-surface-muted animate-pulse rounded-2xl" />
  ),
});

const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-surface-muted animate-pulse rounded-2xl" />
  ),
});

export default function HomePage() {
  useScrollTracking();

  return (
    <>
      <Header />
      <Hero />
      <CredibilityBar />
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
      <Footer />
    </>
  );
}