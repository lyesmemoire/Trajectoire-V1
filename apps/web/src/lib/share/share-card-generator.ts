import {
  CareerArchetype,
  ARCHETYPES_META,
} from "../archetypes/career-archetypes";

export interface ShareCardData {
  name: string;
  archetype: string;
  icon: string;
  percentile: number;
  topSkill: string;
}

/**
 * Generates data for a social media sharing card (LinkedIn/Twitter).
 */
export function generateShareData(name: string, archetype: CareerArchetype, percentile: number, ): ShareCardData {
  const meta = ARCHETYPES_META[archetype];

  return {
    name,
    archetype: meta.label,
    icon: meta.icon,
    percentile,
    topSkill: meta.strengths[0]!,
  };
}
