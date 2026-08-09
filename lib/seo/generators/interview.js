import { questionTemplates } from "../data/questions";
export function generateInterviewContent(job, company) {
    // Sélection de 10 questions pertinentes
    const relevantQuestions = questionTemplates
        .filter((q) => q.level === job.level || q.level === "mid")
        .slice(0, 10)
        .map((q) => ({
        question: q.question
            .replace("{company}", company.name)
            .replace("{concept1}", job.keywords[0] || "X")
            .replace("{concept2}", job.keywords[1] || "Y")
            .replace("{system}", `un système ${job.title}`)
            .replace("{scale}", "1M d'utilisateurs")
            .replace("{product}", `le produit phare de ${company.name}`),
        category: q.category,
        why: q.why,
        idealAnswer: q.idealAnswer,
    }));
    return {
        title: `Questions Entretien ${job.title} chez ${company.name} (2024)`,
        description: `Préparez votre entretien ${job.title} chez ${company.name} avec notre guide complet : 10 questions types, conseils d'experts, et exemples de réponses gagnantes.`,
        introduction: `Vous avez décroché un entretien pour le poste de **${job.title}** chez **${company.name}** ? Félicitations ! Cette opportunité est hautement compétitive, avec des centaines de candidats pour chaque poste.

Ce guide vous prépare aux **10 questions les plus fréquentes** posées lors des entretiens ${job.title} chez ${company.name}, avec des **exemples de réponses** et des **conseils d'experts** pour maximiser vos chances.`,
        companyOverview: `**${company.name}** (${company.headquarters}) est ${company.description}. Avec plus de **${company.employeeCount} employés** dans le secteur **${company.industry}**, l'entreprise recherche des profils ${job.title} capables de travailler à grande échelle sur des produits utilisés par des millions d'utilisateurs.`,
        jobOverview: `Le rôle de **${job.title}** chez ${company.name} implique :
- ${job.description}
- Maîtrise des technologies : **${job.keywords.join(", ")}**
- Salaire moyen en France : **${job.avgSalary}K€/an**
- Niveau : **${job.level}**`,
        questions: relevantQuestions,
        preparationTips: [
            `Étudiez les produits de ${company.name} en profondeur (utilisez-les quotidiennement si possible).`,
            `Préparez 3 projets concrets où vous avez utilisé : ${job.keywords.slice(0, 3).join(", ")}.`,
            `Entraînez-vous aux questions techniques sur un tableau blanc ou en live coding.`,
            `Préparez des questions intelligentes à poser au recruteur (sur la roadmap, la stack technique, la culture d'équipe).`,
            `Relisez votre CV et soyez prêt à justifier chaque expérience en 2 minutes max.`,
        ],
        ctaText: `Optimisez votre CV ${job.title} pour ${company.name}`,
    };
}
//# sourceMappingURL=interview.js.map