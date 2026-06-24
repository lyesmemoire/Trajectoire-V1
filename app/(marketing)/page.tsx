import { HeroSection } from "@/components/marketing/hero-section";
import { ComparisonSection } from "@/components/marketing/comparison-section";
import { BehavioralEngineSection } from "@/components/marketing/behavior-engine";
import TestimonialsSection from "@/components/marketing/testimonials-section";
import { Pricing } from "@/components/marketing/pricing";
import { FAQSection } from "@/components/marketing/faq-section";
import { FinalCTA } from "@/components/marketing/final-cta";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Navbar />
      <main>
        <HeroSection />
        
        {/* Subtle visual transition for emotional rhythm */}
        <div className="h-px w-full bg-[var(--border)]" />
        
        <ComparisonSection />
        <BehavioralEngineSection />
        <TestimonialsSection />
        <Pricing />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
