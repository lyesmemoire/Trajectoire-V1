export interface ChallengeConfig {
  id: string;
  name: string;
  description: string;
  personaId: string;
  duration: number; // minutes
  interruptionRate: number;
  basePressure: number;
  rewardCredits: number;
}

export const CHALLENGES: Record<string, ChallengeConfig> = {
  faang_pressure: {
    id: "faang_pressure",
    name: "FAANG Pressure Test",
    description:
      "20 minutes d'interruption haute et de questions chirurgicales sur l'impact.",
    personaId: "faang",
    duration: 20,
    interruptionRate: 70,
    basePressure: 60,
    rewardCredits: 5,
  },
  executive_presence: {
    id: "executive_presence",
    name: "Executive Presence",
    description:
      "Testez votre capacité à rester concis et stratégique face à un Partner.",
    personaId: "stress",
    duration: 15,
    interruptionRate: 50,
    basePressure: 80,
    rewardCredits: 10,
  },
};
