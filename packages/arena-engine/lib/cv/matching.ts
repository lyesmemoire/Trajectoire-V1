import { ParsedCV, JobTarget, AlignmentScore } from "../../types/cv";

// Dictionnaire de normalisation pour éviter les faux négatifs
const SKILL_ALIASES: Record<string, string[]> = {
  "react.js": ["react", "reactjs"],
  "node.js": ["node", "nodejs"],
  "vue.js": ["vue", "vuejs"],
  "amazon web services": ["aws"],
  "google cloud platform": ["gcp"],
  "typescript": ["ts"],
  "javascript": ["js"],
  "postgresql": ["postgres", "pgsql"],
  "ci/cd": ["cicd", "intégration continue", "continuous integration"],
  "ux/ui": ["ui/ux", "user experience", "user interface"]
};

function normalizeSkill(skill: string): string {
  return skill.toLowerCase().trim().replace(/[\.\-]/g, "");
}

function expandAliases(skill: string): string[] {
  const lower = skill.toLowerCase().trim();
  for (const [key, aliases] of Object.entries(SKILL_ALIASES)) {
    if (lower === key || aliases.includes(lower)) {
      return [key, ...aliases].map(normalizeSkill);
    }
  }
  return [normalizeSkill(skill)];
}

export function evaluateAlignment(cv: ParsedCV, job: JobTarget): AlignmentScore {
  // Construire un "gros sac de mots" normalisé à partir du CV
  const cvCorpus = new Set<string>();

  // Ajouter les skills explicites
  for (const skillCategory of cv.skills) {
    for (const skill of skillCategory.items) {
      expandAliases(skill).forEach(alias => cvCorpus.add(alias));
    }
  }

  // Chercher aussi dans le texte brut des bullets (les candidats oublient souvent de lister leurs skills)
  const allBulletsText = cv.experiences
    .flatMap(exp => exp.bullets)
    .join(" ")
    .toLowerCase();

  const foundSkills: string[] = [];
  const missingSkills: string[] = [];

  // On vérifie uniquement les Hard Skills pour le score déterministe (les soft skills sont trop vagues)
  for (const reqSkill of job.mustHaveHardSkills) {
    const aliases = expandAliases(reqSkill);
    
    // Le skill est-il dans les tags explicites ?
    const inTags = aliases.some(alias => cvCorpus.has(alias));
    
    // Le skill est-il caché dans un bullet ?
    const inText = aliases.some(alias => {
      // Regex boundaries pour éviter que "java" matche "javascript"
      const regex = new RegExp(`\\b${alias}\\b`, 'i');
      return regex.test(allBulletsText);
    });

    if (inTags || inText) {
      foundSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  }

  // Calcul du score simple : Pourcentage de Hard Skills trouvés
  const total = job.mustHaveHardSkills.length;
  const overallMatch = total > 0 ? Math.round((foundSkills.length / total) * 100) : 100;

  // Synthèse narrative (déterministe, pas d'hallucination LLM)
  let narrativeSynthesis = "";
  if (total === 0) {
    narrativeSynthesis = "Cette offre ne spécifie aucune compétence technique stricte. Concentrez-vous sur l'impact de vos expériences.";
  } else if (overallMatch >= 80) {
    narrativeSynthesis = `Excellent alignement technique (${overallMatch}%). Votre profil correspond fortement aux attentes du poste. Veillez à bien chiffrer vos accomplissements pour verrouiller l'entretien.`;
  } else if (overallMatch >= 40) {
    narrativeSynthesis = `Alignement partiel (${overallMatch}%). Il vous manque certaines compétences clés (ex: ${missingSkills.slice(0, 2).join(", ")}). Si vous les maîtrisez, utilisez le bouton "Adapter à l'Offre" pour les faire ressortir dans vos expériences.`;
  } else {
    narrativeSynthesis = `Alignement technique faible (${overallMatch}%). De nombreux prérequis critiques sont absents de votre CV (notamment ${missingSkills.slice(0, 3).join(", ")}). Réévaluez votre pertinence pour cette offre ou mettez à jour votre CV si ces oublis sont involontaires.`;
  }

  return {
    overallMatch,
    foundSkills,
    missingSkills,
    partialSkills: [], // Fallback IA sémantique plus tard
    narrativeSynthesis
  };
}
