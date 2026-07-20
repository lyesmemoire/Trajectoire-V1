export interface QuestionTemplate {
  category: "hr" | "technical" | "behavioral" | "case-study";
  level: "junior" | "mid" | "senior";
  question: string;
  why: string; // Pourquoi cette question est posée
  idealAnswer: string; // Structure de réponse recommandée
}

export const questionTemplates: QuestionTemplate[] = [
  // HR
  {
    category: "hr",
    level: "junior",
    question: "Pourquoi voulez-vous rejoindre {company} ?",
    why: "Évalue votre motivation et votre connaissance de l'entreprise.",
    idealAnswer:
      "Mentionnez des valeurs concrètes de l'entreprise, des projets récents qui vous inspirent, et comment vos compétences s'alignent avec leurs besoins.",
  },
  {
    category: "hr",
    level: "mid",
    question: "Où vous voyez-vous dans 5 ans ?",
    why: "Vérifie l'ambition et l'alignement avec les opportunités d'évolution.",
    idealAnswer:
      "Parlez d'évolution de compétences techniques, de leadership potentiel, et d'impact sur l'organisation.",
  },

  // Technical
  {
    category: "technical",
    level: "mid",
    question: "Expliquez la différence entre {concept1} et {concept2}.",
    why: "Teste la compréhension des fondamentaux techniques.",
    idealAnswer:
      "Définissez chaque concept, donnez des cas d'usage concrets, et expliquez les trade-offs.",
  },
  {
    category: "technical",
    level: "senior",
    question: "Comment architeceriez-vous {system} pour gérer {scale} ?",
    why: "Évalue la capacité à concevoir des systèmes scalables.",
    idealAnswer:
      "Discutez de la décomposition en microservices, du choix de bases de données, du caching, et des stratégies de scaling.",
  },

  // Behavioral (STAR method)
  {
    category: "behavioral",
    level: "mid",
    question: "Parlez-moi d'un moment où vous avez échoué.",
    why: "Évalue l'humilité et la capacité d'apprentissage.",
    idealAnswer:
      "Utilisez la méthode STAR : Situation, Task, Action, Result. Insistez sur ce que vous avez appris.",
  },
  {
    category: "behavioral",
    level: "senior",
    question: "Comment gérez-vous les conflits au sein d'une équipe ?",
    why: "Teste le leadership et l'intelligence émotionnelle.",
    idealAnswer:
      "Donnez un exemple concret, montrez votre écoute active, et la résolution par le compromis ou la data.",
  },

  // Case Study
  {
    category: "case-study",
    level: "senior",
    question:
      "Si vous étiez PM de {product}, quelle serait votre priorité N°1 ?",
    why: "Évalue la capacité d'analyse produit et de priorisation.",
    idealAnswer:
      "Analysez les métriques actuelles, identifiez les pain points utilisateurs, proposez une solution data-driven.",
  },
];

export function getQuestionsForJob(
  jobCategory: string,
  level: string,
): QuestionTemplate[] {
  return questionTemplates.filter(
    (q) => q.level === level || q.level === "mid", // Mid-level questions sont universelles
  );
}
