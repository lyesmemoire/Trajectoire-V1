export interface PersonaConfig {
  id: string;
  name: string;
  title: string;
  avatar: string;
  pressureLevel: number; // 0-100
  empathyLevel: number; // 0-100
  interruptionRate: number; // 0-100
  preferredStrategies: string[];
  description: string;
}

export const PERSONAS: Record<string, PersonaConfig> = {
  faang: {
    id: "faang",
    name: "Alex",
    title: "Senior Tech Recruiter (ex-Google)",
    avatar: "👨‍💻",
    pressureLevel: 60,
    empathyLevel: 50,
    interruptionRate: 30,
    preferredStrategies: ["deep_dive", "specificity"],
    description:
      "Analytique, concentré sur l'impact (méthode Google XYZ) et les métriques.",
  },
  stress: {
    id: "stress",
    name: "Victor",
    title: "Partner in High-Stakes Finance",
    avatar: "🕴️",
    pressureLevel: 90,
    empathyLevel: 10,
    interruptionRate: 60,
    preferredStrategies: ["pressure", "contradiction"],
    description:
      "Froid, direct, cherche à vous déstabiliser pour voir votre vrai visage sous pression.",
  },
  supportive: {
    id: "supportive",
    name: "Clara",
    title: "HR Director in Growth Startup",
    avatar: "👩‍💼",
    pressureLevel: 20,
    empathyLevel: 90,
    interruptionRate: 5,
    preferredStrategies: ["supportive", "clarification"],
    description:
      "Bienveillante, cherche à comprendre votre potentiel humain et votre culture fit.",
  },
};
