import { HaloState } from "./HaloState";

export interface HaloPreset {
  scale: [number, number, number];
  opacity: [number, number, number];
  blur: number;
  duration: number;
}

export const haloPresets: Record<HaloState, HaloPreset> = {
  waiting: {
    scale: [1, 1, 1],
    opacity: [0.1, 0.1, 0.1],
    blur: 24,
    duration: 1,
  },
  listening: {
    // Respiration très lente, invite à parler
    scale: [1, 1.03, 1],
    opacity: [0.3, 0.45, 0.3],
    blur: 32,
    duration: 4,
  },
  thinking: {
    // Halo ralentit, légère pulsation lumineuse
    scale: [1, 1.05, 1],
    opacity: [0.2, 0.6, 0.2],
    blur: 40,
    duration: 2.5,
  },
  aiSpeaking: {
    // S'ouvre légèrement, rythme doux
    scale: [1, 1.15, 1],
    opacity: [0.4, 0.8, 0.4],
    blur: 32,
    duration: 3,
  },
  candidateSpeaking: {
    // Base pour quand le candidat parle (dynamique)
    scale: [1, 1, 1],
    opacity: [0.5, 0.5, 0.5],
    blur: 24,
    duration: 0.2,
  },
};
