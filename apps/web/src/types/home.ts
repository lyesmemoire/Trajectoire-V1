export interface NavItem {
  label: string;
  href: string;
}

export interface TrustStat {
  value: string;
  label: string;
  icon?: string;
}

export interface ProblemCard {
  icon: string;
  text: string;
}

export interface MethodStep {
  number: string;
  title: string;
  description: string;
  result: string;
  duration: string;
}

export interface BenefitCard {
  id: string;
  span: number;
  title: string;
  description: string;
  visual: "radar" | "progress" | "list" | "bar" | "play" | "feedback";
  colSpan?: string;
}

export interface DashboardWidget {
  id: string;
  label: string;
  value: number;
  unit: string;
  type: "radial" | "bar" | "radar" | "area" | "score";
  color: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  result: string;
  initials: string;
  color: string;
}

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  label: string;
  price: string;
  period?: string;
  badge?: string;
  features: PricingFeature[];
  cta: string;
  href: string;
  featured: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ResultStat {
  value: string;
  label: string;
  detail: string;
}

export interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

export interface ProgressionDataPoint {
  week: string;
  confidence: number;
  preparedness: number;
}

export interface StressDataPoint {
  category: string;
  value: number;
}
