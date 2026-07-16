// @ts-nocheck
export interface PersonaConfig {
  id: string;
  name: string;
  title: string;
  avatar: string;
  pressureLevel: number;
  empathyLevel: number;
  interruptionRate: number;
  preferredStrategies: string[];
  description: string;
}

export const PERSONAS: Record<string, PersonaConfig> = {
  faang: {
    id: "faang",
    name: "Alex",
    title: "Senior Tech Lead (ex-Meta)",
    avatar: "👨‍💻",
    pressureLevel: 65,
    empathyLevel: 40,
    interruptionRate: 35,
    preferredStrategies: ["deep_dive", "contradiction"],
    description:
      "Extrêmement rigoureux sur la data et l'impact réel. Ne tolère pas le flou.",
  },
  stress: {
    id: "stress",
    name: "Victor",
    title: "Executive Director @ Goldman Sachs",
    avatar: "🕴️",
    pressureLevel: 95,
    empathyLevel: 10,
    interruptionRate: 60,
    preferredStrategies: ["pressure", "contradiction"],
    description:
      "Évalue votre capacité à rester calme sous une pression extrême.",
  },
  supportive: {
    id: "supportive",
    name: "Clara",
    title: "People Director @ Alan",
    avatar: "👩‍💼",
    pressureLevel: 25,
    empathyLevel: 90,
    interruptionRate: 5,
    preferredStrategies: ["supportive", "clarification"],
    description:
      "Bienveillante, cherche la cohérence culturelle et le potentiel à long terme.",
  },
};

export function getPersonaConfig(id: string): PersonaConfig {
  return PERSONAS[id] || PERSONAS.faang!;
}
