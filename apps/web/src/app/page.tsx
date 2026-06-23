"use client";

import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import Recognition from "@/components/home/Recognition";
import ProblemGrid from "@/components/home/ProblemGrid";
import Method from "@/components/home/Method";
import BenefitsBento from "@/components/home/BenefitsBento";
import Results from "@/components/home/Results";
import FAQ from "@/components/home/FAQ";
import Pricing from "@/components/home/Pricing";
import CTA from "@/components/home/CTA";
import Footer from "@/components/home/Footer";

const Dashboard = dynamic(() => import("@/components/home/Dashboard"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-[#1F1F1F] animate-pulse rounded-2xl" />
  ),
});

const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-white/50 animate-pulse rounded-2xl" />
  ),
});

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <TrustBar />
      <Recognition />
      <ProblemGrid />
      <Method />
      <BenefitsBento />
      <Dashboard />
      <Results />
      <Testimonials />
      <FAQ />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}