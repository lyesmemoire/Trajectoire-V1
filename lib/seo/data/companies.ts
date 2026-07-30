export interface Company {
  id: string;
  name: string;
  category: "gafam" | "unicorn" | "enterprise" | "startup";
  industry: string;
  employeeCount: string;
  headquarters: string;
  description: string;
}

export const companies: Compunknown[] = [
  // GAFAM
  {
    id: "google",
    name: "Google",
    category: "gafam",
    industry: "Tech",
    employeeCount: "150K+",
    headquarters: "Mountain View, CA",
    description:
      "Leader mondial de la recherche en ligne et du cloud computing.",
  },
  {
    id: "meta",
    name: "Meta",
    category: "gafam",
    industry: "Social Media",
    employeeCount: "80K+",
    headquarters: "Menlo Park, CA",
    description: "Réseau social et technologies immersives (VR/AR).",
  },
  {
    id: "amazon",
    name: "Amazon",
    category: "gafam",
    industry: "E-commerce / Cloud",
    employeeCount: "1.5M+",
    headquarters: "Seattle, WA",
    description: "Leader e-commerce et cloud computing (AWS).",
  },
  {
    id: "apple",
    name: "Apple",
    category: "gafam",
    industry: "Hardware / Software",
    employeeCount: "160K+",
    headquarters: "Cupertino, CA",
    description: "Conception de produits et services premium.",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    category: "gafam",
    industry: "Software / Cloud",
    employeeCount: "220K+",
    headquarters: "Redmond, WA",
    description: "Leader du software et cloud computing (Azure).",
  },

  // Unicorns France
  {
    id: "blablacar",
    name: "BlaBlaCar",
    category: "unicorn",
    industry: "Mobility",
    employeeCount: "700+",
    headquarters: "Paris, France",
    description: "Plateforme de covoiturage leader en Europe.",
  },
  {
    id: "doctolib",
    name: "Doctolib",
    category: "unicorn",
    industry: "HealthTech",
    employeeCount: "2500+",
    headquarters: "Paris, France",
    description: "Prise de rendez-vous médicaux et téléconsultation.",
  },
  {
    id: "ledger",
    name: "Ledger",
    category: "unicorn",
    industry: "FinTech / Crypto",
    employeeCount: "700+",
    headquarters: "Paris, France",
    description: "Wallets hardware pour crypto-monnaies.",
  },
  {
    id: "contentsquare",
    name: "Contentsquare",
    category: "unicorn",
    industry: "Analytics",
    employeeCount: "1200+",
    headquarters: "Paris, France",
    description: "Plateforme d'analyse d'expérience utilisateur.",
  },
  {
    id: "sorare",
    name: "Sorare",
    category: "unicorn",
    industry: "Gaming / NFT",
    employeeCount: "300+",
    headquarters: "Paris, France",
    description: "Jeux de cartes NFT football.",
  },

  // Enterprises
  {
    id: "airbus",
    name: "Airbus",
    category: "enterprise",
    industry: "Aerospace",
    employeeCount: "130K+",
    headquarters: "Toulouse, France",
    description: "Leader mondial de l'aéronautique.",
  },
  {
    id: "thales",
    name: "Thales",
    category: "enterprise",
    industry: "Defense / Tech",
    employeeCount: "80K+",
    headquarters: "Paris, France",
    description: "Systèmes électroniques et sécurité.",
  },
  {
    id: "dassault-systemes",
    name: "Dassault Systèmes",
    category: "enterprise",
    industry: "Software",
    employeeCount: "20K+",
    headquarters: "Vélizy, France",
    description: "Solutions 3D et PLM.",
  },

  // Startups
  {
    id: "alan",
    name: "Alan",
    category: "startup",
    industry: "InsurTech",
    employeeCount: "500+",
    headquarters: "Paris, France",
    description: "Assurance santé digitale.",
  },
  {
    id: "qonto",
    name: "Qonto",
    category: "startup",
    industry: "FinTech",
    employeeCount: "1000+",
    headquarters: "Paris, France",
    description: "Néobanque pour entreprises.",
  },
];

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((company) => company.id === slug);
}

export function getAllCompanySlugs(): string[] {
  return companies.map((company) => company.id);
}
