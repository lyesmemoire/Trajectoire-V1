import { IdentityCardData } from "./identity-card";
import { ARCHETYPES_META } from "../archetypes/career-archetypes";

/**
 * Generates compelling social media copy for sharing.
 */
export function generateShareCopy(data: IdentityCardData): string {
  const templates = [
    `Je pensais être bon sous pression. 
    
L'IA de StudioEntretien a analysé mon comportement en temps réel et a révélé mon identité : ${data.label}.

🎯 Résultat : Top ${data.percentile}% en résilience.
⚔️ ${data.stats.interruptionsHandled} interruptions gérées sans perdre le fil.

Découvrez votre Career DNA ici : https://studioentretien.fr`,

    `L'entretien d'embauche n'est plus un mystère. 
    
Mon profil a été classé comme "${data.label}" par @StudioEntretien. L'analyse montre que ma force principale est : ${data.topStrengths[0]}.

Passé de ${ARCHETYPES_META[data.evolution?.from || "stress_reactive"].label} à ${data.label} en 3 sessions. 📈

Et vous, comment réagissez-vous quand un recruteur vous coupe ?`,

    `Identité Professionnelle révélée. 🧬

Le système StudioEntretien vient de confirmer mon DNA : ${data.label}. 
Un mélange de clarté technique (${data.stats.clarityScore}%) et de leadership affirmé.

Prêt pour le prochain défi. 💪`,
  ];

  return templates[Math.floor(Math.random() * templates.length)]!;
}
