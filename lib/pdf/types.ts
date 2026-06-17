export interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    location?: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
    mention?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  certifications?: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
}

export type TemplateId = "modern" | "classic" | "minimal";

export interface ExportOptions {
  template: TemplateId;
  colorScheme: "blue" | "green" | "purple" | "dark";
  fontSize: "compact" | "normal" | "large";
}
