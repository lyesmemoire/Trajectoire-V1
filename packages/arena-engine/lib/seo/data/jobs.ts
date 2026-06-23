export interface Job {
  id: string;
  title: string;
  category:
    | "engineering"
    | "product"
    | "design"
    | "data"
    | "marketing"
    | "sales";
  level: "junior" | "mid" | "senior" | "lead" | "executive";
  avgSalary: number; // En K€
  description: string;
  keywords: string[];
}

export const jobs: Job[] = [
  // Engineering
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    category: "engineering",
    level: "mid",
    avgSalary: 55,
    description:
      "Développeur spécialisé dans les interfaces utilisateur avec React, Vue ou Angular.",
    keywords: [
      "react",
      "vue",
      "angular",
      "javascript",
      "typescript",
      "css",
      "html",
    ],
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    category: "engineering",
    level: "mid",
    avgSalary: 60,
    description:
      "Développeur côté serveur expert en Node.js, Python, Java ou Go.",
    keywords: [
      "node.js",
      "python",
      "java",
      "go",
      "api",
      "database",
      "microservices",
    ],
  },
  {
    id: "fullstack-developer",
    title: "Fullstack Developer",
    category: "engineering",
    level: "mid",
    avgSalary: 58,
    description: "Développeur polyvalent maîtrisant frontend et backend.",
    keywords: ["react", "node.js", "typescript", "postgresql", "rest api"],
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    category: "engineering",
    level: "senior",
    avgSalary: 70,
    description: "Expert en automatisation, CI/CD, et infrastructure cloud.",
    keywords: [
      "kubernetes",
      "docker",
      "aws",
      "terraform",
      "ci/cd",
      "monitoring",
    ],
  },
  {
    id: "software-engineer",
    title: "Software Engineer",
    category: "engineering",
    level: "mid",
    avgSalary: 65,
    description:
      "Ingénieur logiciel généraliste travaillant sur des systèmes complexes.",
    keywords: [
      "algorithms",
      "data structures",
      "system design",
      "testing",
      "agile",
    ],
  },

  // Product
  {
    id: "product-manager",
    title: "Product Manager",
    category: "product",
    level: "senior",
    avgSalary: 75,
    description:
      "Responsable de la vision produit, de la roadmap et de la stratégie.",
    keywords: ["roadmap", "user stories", "analytics", "stakeholders", "agile"],
  },
  {
    id: "product-owner",
    title: "Product Owner",
    category: "product",
    level: "mid",
    avgSalary: 60,
    description:
      "Interface entre l'équipe dev et les stakeholders, gestion du backlog.",
    keywords: ["scrum", "backlog", "user stories", "sprint planning", "jira"],
  },

  // Data
  {
    id: "data-scientist",
    title: "Data Scientist",
    category: "data",
    level: "senior",
    avgSalary: 70,
    description:
      "Expert en machine learning, statistiques et analyse prédictive.",
    keywords: [
      "python",
      "machine learning",
      "statistics",
      "pandas",
      "scikit-learn",
    ],
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    category: "data",
    level: "senior",
    avgSalary: 68,
    description:
      "Architecte de pipelines de données et d'infrastructures Big Data.",
    keywords: ["spark", "airflow", "sql", "etl", "data warehouse", "kafka"],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    category: "data",
    level: "mid",
    avgSalary: 50,
    description: "Analyse de données pour générer des insights business.",
    keywords: ["sql", "tableau", "power bi", "excel", "business intelligence"],
  },

  // Design
  {
    id: "ux-designer",
    title: "UX Designer",
    category: "design",
    level: "mid",
    avgSalary: 52,
    description:
      "Conception d'expériences utilisateur basées sur la recherche.",
    keywords: [
      "user research",
      "wireframes",
      "prototyping",
      "figma",
      "user testing",
    ],
  },
  {
    id: "ui-designer",
    title: "UI Designer",
    category: "design",
    level: "mid",
    avgSalary: 50,
    description: "Design d'interfaces visuelles et systèmes de design.",
    keywords: [
      "figma",
      "sketch",
      "design system",
      "visual design",
      "typography",
    ],
  },

  // Marketing
  {
    id: "growth-manager",
    title: "Growth Manager",
    category: "marketing",
    level: "senior",
    avgSalary: 65,
    description: "Expert en acquisition et rétention utilisateurs.",
    keywords: ["seo", "sem", "analytics", "a/b testing", "funnel optimization"],
  },
  {
    id: "content-marketing-manager",
    title: "Content Marketing Manager",
    category: "marketing",
    level: "mid",
    avgSalary: 50,
    description: "Stratégie de contenu et storytelling de marque.",
    keywords: ["seo", "content strategy", "copywriting", "editorial calendar"],
  },

  // Sales
  {
    id: "sales-engineer",
    title: "Sales Engineer",
    category: "sales",
    level: "senior",
    avgSalary: 80,
    description: "Expert technique accompagnant les ventes complexes.",
    keywords: ["technical sales", "demos", "proof of concept", "b2b", "saas"],
  },
  {
    id: "account-executive",
    title: "Account Executive",
    category: "sales",
    level: "mid",
    avgSalary: 55,
    description: "Commercial gérant un portefeuille de clients.",
    keywords: [
      "b2b sales",
      "crm",
      "pipeline management",
      "prospecting",
      "negotiation",
    ],
  },
];

export function getJobBySlug(slug: string): Job | undefined {
  return jobs.find((job) => job.id === slug);
}

export function getAllJobSlugs(): string[] {
  return jobs.map((job) => job.id);
}
