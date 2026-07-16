import { Recommendation, CandidateProfile, JobAnalysis, InterviewAnalysis } from "../types";

/**
 * Recommendation Engine
 * 
 * Responsibilities:
 * - Generate personalized recommendations based on profile, job, and interview data
 * - Avoid generic advice - every recommendation is context-specific
 * - Provide actionable, time-bound recommendations with expected impact
 * - Prioritize recommendations based on urgency and impact
 */

export class RecommendationEngine {
  /**
   * Generate next simulation recommendation
   */
  static generateNextSimulation(difficulty: string, score: number): {
    type: string;
    reason: string;
    improvements: string[];
    difficulty: string;
  } {
    const nextDifficulty = score >= 75 
      ? difficulty === "expert" ? "expert" : "expert"
      : score >= 50
      ? difficulty === "beginner" ? "intermediate" : difficulty
      : difficulty === "expert" ? "intermediate" : "beginner";
    
    return {
      type: "direction",
      difficulty: nextDifficulty,
      reason: score >= 75
        ? "Vous avez démontré une excellente maîtrise. Passez au niveau expert pour challenger vos compétences."
        : score >= 50
        ? "Continuez à vous entraîner à ce niveau pour consolider vos acquis avant de monter en difficulté."
        : "Je recommande de commencer par un niveau plus accessible pour construire votre confiance.",
      improvements: score >= 75
        ? ["Vision stratégique", "Gestion de crise", "Leadership transformationnel"]
        : score >= 50
        ? ["Structure STAR", "Quantification", "Communication"]
        : ["Méthode STAR", "Confiance", "Posture"],
    };
  }

  /**
   * Generate detected weaknesses (raw data for UI projection)
   */
  static generateWeaknesses(score: number): Array<{
    id: string;
    category: string;
    priority: "low" | "medium" | "high";
    confidence: number;
    impact: "low" | "medium" | "high";
    evidence: string;
    suggestion: string;
  }> {
    const allWeaknesses = [
      { 
        id: "w-1", 
        category: "Quantification", 
        priority: "high" as const,
        confidence: 0.87,
        impact: "high" as const,
        evidence: "Impact mentionné sans chiffres concrets",
        suggestion: "Ajouter des métriques à chaque résultat",
      },
      { 
        id: "w-2", 
        category: "Concision", 
        priority: "medium" as const,
        confidence: 0.72,
        impact: "medium" as const,
        evidence: "Réponses parfois longues",
        suggestion: "Aller droit au but",
      },
      { 
        id: "w-3", 
        category: "Précision", 
        priority: "medium" as const,
        confidence: 0.68,
        impact: "medium" as const,
        evidence: "Conclusions manquant de précision",
        suggestion: "Terminer par un résultat chiffré",
      },
      { 
        id: "w-4", 
        category: "Structure", 
        priority: "low" as const,
        confidence: 0.55,
        impact: "low" as const,
        evidence: "Certaines réponses manquent de structure",
        suggestion: "Utiliser systématiquement la méthode STAR",
      },
    ];
    
    return allWeaknesses.slice(0, Math.max(1, 4 - Math.floor(score / 30)));
  }

  /**
   * Generate personalized recommendations
   */
  static generateRecommendations(
    profile: CandidateProfile,
    job: JobAnalysis,
    interviewAnalysis: InterviewAnalysis
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // STAR method recommendations
    if (interviewAnalysis.starQuality < 70) {
      recommendations.push({
        id: `rec-star-${Date.now()}`,
        category: "STAR Method",
        priority: "high",
        title: "Maîtriser la méthode STAR pour structurer vos réponses",
        description: "Vos réponses manquent de structure. La méthode STAR (Situation, Tâche, Action, Résultat) vous permettra d'organiser vos pensées de manière cohérente.",
        why: "Les recruteurs recherchent des réponses structurées. Une mauvaise structure rend vos exemples difficiles à suivre et réduit votre crédibilité.",
        how: "Pour chaque question, commencez par décrire le contexte (Situation), définissez votre objectif (Tâche), expliquez vos actions (Action), et terminez par le résultat (Résultat). Préparez 3 exemples STAR avant chaque entretien.",
        impact: "Amélioration de 15-20 points sur la note de structure et meilleure mémorabilité de vos réponses par le recruteur.",
        estimatedTime: "2 heures de préparation + 30 minutes par exemple",
        expectedGain: "+15 points sur la note de structure",
        concreteExample: "Au lieu de 'J'ai géré un projet difficile', dites : 'Situation : Mon équipe avait 3 semaines de retard sur un projet critique. Tâche : Je devais rattraper le retard sans sacrifier la qualité. Action : J'ai réorganisé les sprints, priorisé les fonctionnalités et négocié des ressources supplémentaires. Résultat : Nous avons livré dans les délais avec 95% de satisfaction client.'",
      });
    }

    // Quantification recommendations
    if (interviewAnalysis.impact < 70) {
      recommendations.push({
        id: `rec-impact-${Date.now()}`,
        category: "Business Impact",
        priority: "high",
        title: "Quantifier systématiquement l'impact de vos actions",
        description: "Vous parlez de résultats mais sans les chiffrer. Les recruteurs ont besoin de données concrètes pour évaluer votre performance.",
        why: `Pour le poste de ${job.position}, l'exigence de niveau d'impact est de ${job.leadershipExpectations.level}/100. Sans chiffres, vos accomplissements paraissent vagues.`,
        how: "Pour chaque résultat, identifiez : le pourcentage d'amélioration, le gain financier, le temps économisé, ou le nombre de personnes impactées. Préparez un tableau de vos 5 plus grands résultats avec leurs métriques.",
        impact: "Crédibilité immédiate et différenciation par rapport aux autres candidats qui restent vagues.",
        estimatedTime: "3 heures pour auditer vos résultats et les chiffrer",
        expectedGain: "+20 points sur la note d'impact",
        concreteExample: "Au lieu de 'J'ai amélioré les ventes', dites : 'J'ai augmenté le chiffre d'affaires de 23% en 6 mois, passant de 1.2M€ à 1.47M€, en optimisant le processus de qualification des leads.'",
      });
    }

    // Communication style recommendations
    if (interviewAnalysis.clarity < 70) {
      recommendations.push({
        id: `rec-clarity-${Date.now()}`,
        category: "Communication",
        priority: "medium",
        title: "Améliorer la clarté de votre communication",
        description: "Vos réponses sont parfois confuses ou trop longues. La clarté est essentielle pour un poste de ce niveau.",
        why: `Le poste exige un niveau de clarté de ${job.communicationExpectations.clarity}/100. Un manque de clarté peut être interprété comme un manque de maîtrise du sujet.`,
        how: "Utilisez la règle des 3 points : commencez chaque réponse par 'Il y a 3 points clés à retenir'. Ensuite, énumérez-les avec des connecteurs logiques. Entraînez-vous avec un chronomètre : 2 minutes max par réponse.",
        impact: "Meilleure compréhension par le recruteur et perception de compétence accrue.",
        estimatedTime: "1 heure par jour pendant 5 jours",
        expectedGain: "+15 points sur la note de communication",
        concreteExample: "Au lieu de raconter toute l'histoire, dites : 'Il y a 3 points clés : premièrement, j'ai identifié le problème. Deuxièmement, j'ai mis en place une solution. Troisièmement, j'ai mesuré les résultats. En détail...'",
      });
    }

    // Leadership recommendations
    if (interviewAnalysis.leadership < job.leadershipExpectations.level - 10) {
      recommendations.push({
        id: `rec-leadership-${Date.now()}`,
        category: "Leadership",
        priority: "high",
        title: "Démontrer un leadership adapté au niveau attendu",
        description: `Le poste exige un niveau de leadership de ${job.leadershipExpectations.level}/100. Vos exemples actuels ne démontrent pas ce niveau.`,
        why: job.seniority === "senior" || job.seniority === "expert"
          ? "À ce niveau, on attend non seulement que vous gériez une équipe, mais que vous développiez les talents et influenciez la stratégie organisationnelle."
          : "Pour ce poste, vous devez montrer que vous pouvez guider et inspirer, pas seulement exécuter.",
        how: "Préparez des exemples où vous avez : 1) Transformé une équipe sous-performante, 2) Mentoré un collaborateur vers une promotion, 3) Influencé une décision stratégique. Utilisez le 'nous' pour montrer la fédération.",
        impact: "Validation de votre capacité à occuper le poste et différenciation par rapport aux candidats opérationnels.",
        estimatedTime: "4 heures de préparation d'exemples + 2 heures de pratique",
        expectedGain: "+20 points sur la note de leadership",
        concreteExample: "Au lieu de 'J'ai dirigé une équipe', dites : 'J'ai repris une équipe de 12 personnes avec un turnover de 40%. En 9 mois, j'ai réduit le turnover à 5% en mettant en place un programme de mentorat, en clarifiant les objectifs individuels et en créant une culture de reconnaissance. 3 de mes collaborateurs ont été promus.'",
      });
    }

    // Confidence recommendations
    if (interviewAnalysis.confidence < 70) {
      recommendations.push({
        id: `rec-confidence-${Date.now()}`,
        category: "Confidence",
        priority: "medium",
        title: "Renforcer votre confiance en entretien",
        description: "Votre posture suggère un manque de confiance qui peut être interprété comme un manque de compétence.",
        why: "La confiance est perçue comme un indicateur de compétence. Un manque d'assurance peut faire douter de votre capacité à gérer des situations complexes.",
        how: "Préparez 10 réponses complètes à vos questions les plus difficiles. Enregistrez-vous et écoutez pour identifier les hésitations. Pratiquez la posture : voix posée, contact visuel, sourire naturel. Utilisez des affirmations positives avant l'entretien.",
        impact: "Perception immédiate de compétence et d'expérience.",
        estimatedTime: "30 minutes par jour pendant 10 jours",
        expectedGain: "+15 points sur la note de confiance",
        concreteExample: "Au lieu de 'Je pense que je pourrais...', dites 'Je suis confiant dans ma capacité à...'. Au lieu de 'Peut-être que j'ai...', dites 'J'ai démontré que...'",
      });
    }

    // Recurring error recommendations
    const activeErrors = profile.history.recurringErrors.filter(e => e.status === "active");
    activeErrors.forEach(error => {
      recommendations.push({
        id: `rec-error-${error.pattern}-${Date.now()}`,
        category: "Recurring Error",
        priority: error.severity === "high" ? "high" : error.severity === "medium" ? "medium" : "low",
        title: `Corriger l'erreur récurrente : ${error.pattern}`,
        description: `Cette erreur apparaît depuis le ${error.firstOccurrence.toLocaleDateString()} et s'est produite ${error.frequency} fois. Elle nuit à votre progression.`,
        why: "Les erreurs récurrentes signalent un schéma comportemental qui doit être consciemment corrigé pour progresser.",
        how: "Identifiez le déclencheur de cette erreur. Créez un rappel visuel (post-it, notification) pour vous en souvenir avant chaque entretien. Pratiquez la correction spécifique jusqu'à ce qu'elle devienne automatique.",
        impact: "Élimination d'un obstacle majeur à votre progression et amélioration de votre taux de réussite.",
        estimatedTime: "1 semaine de pratique consciente",
        expectedGain: "+10 points sur la note globale",
        concreteExample: "Si l'erreur est 'réponses trop longues', créez un rappel '3 points max' et pratiquez à vous limiter à 90 secondes par réponse.",
      });
    });

    // Skill gap recommendations
    const skillGaps = job.requiredSkills.filter(jobSkill => {
      const candidateSkill = profile.skills.hardSkills.find(s => s.name === jobSkill.name);
      return !candidateSkill || candidateSkill.level < jobSkill.level - 15;
    });

    skillGaps.slice(0, 3).forEach(skill => {
      recommendations.push({
        id: `rec-skill-${skill.name}-${Date.now()}`,
        category: "Skill Gap",
        priority: "medium",
        title: `Combler l'écart de compétence : ${skill.name}`,
        description: `Le poste exige un niveau de ${skill.level}/100 en ${skill.name}. Votre niveau actuel est insuffisant.`,
        why: "Cette compétence est explicitement requise pour le poste. Un écart significatif peut être un éliminatoire.",
        how: "Identifiez les ressources d'apprentissage adaptées (cours, documentation, mentor). Bloquez 2 heures par jour pendant 2 semaines pour un apprentissage intensif. Pratiquez sur des projets réels ou exercices.",
        impact: "Validation de votre fit technique pour le poste et élimination d'un risque d'élimination.",
        estimatedTime: "20-30 heures selon votre niveau actuel",
        expectedGain: `Atteindre le niveau requis de ${skill.level}/100`,
        concreteExample: `Pour ${skill.name}, commencez par les fondamentaux, puis progressez vers des cas d'usage complexes. Documentez votre progression et créez un portfolio de projets.`,
      });
    });

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return recommendations.slice(0, 10); // Limit to top 10 recommendations
  }

  /**
   * Generate quick wins (easy improvements with high impact)
   */
  static generateQuickWins(profile: CandidateProfile, interviewAnalysis: InterviewAnalysis): Recommendation[] {
    const quickWins: Recommendation[] = [];

    if (interviewAnalysis.clarity < 80 && interviewAnalysis.clarity >= 60) {
      quickWins.push({
        id: `quick-clarity-${Date.now()}`,
        category: "Quick Win",
        priority: "high",
        title: "Utiliser la règle des 3 points",
        description: "Commencez chaque réponse par 'Il y a 3 points clés' pour structurer immédiatement.",
        why: "C'est une technique simple qui améliore instantanément la perception de clarté.",
        how: "Pratiquez pendant 30 minutes. Appliquez systématiquement.",
        impact: "Amélioration immédiate de la clarté perçue.",
        estimatedTime: "30 minutes",
        expectedGain: "+10 points sur la note de clarté",
        concreteExample: "'Il y a 3 points clés : premièrement... deuxièmement... troisièmement...'",
      });
    }

    if (interviewAnalysis.impact < 80 && interviewAnalysis.impact >= 60) {
      quickWins.push({
        id: `quick-impact-${Date.now()}`,
        category: "Quick Win",
        priority: "high",
        title: "Ajouter un chiffre à chaque réponse",
        description: "Même une estimation approximative est mieux que pas de chiffre du tout.",
        why: "Les chiffres créent de la crédibilité instantanée.",
        how: "Pour chaque résultat, demandez-vous : combien ? quel pourcentage ? quelle durée ?",
        impact: "Perception d'impact business immédiate.",
        estimatedTime: "15 minutes de réflexion",
        expectedGain: "+10 points sur la note d'impact",
        concreteExample: "Au lieu de 'J'ai amélioré', dites 'J'ai amélioré d'environ 20%'.",
      });
    }

    if (profile.behavior.confidenceLevel < 80 && profile.behavior.confidenceLevel >= 60) {
      quickWins.push({
        id: `quick-confidence-${Date.now()}`,
        category: "Quick Win",
        priority: "medium",
        title: "Remplacer 'je pense' par 'je suis confiant'",
        description: "Un simple changement de langage change la perception.",
        why: "Le langage hésitant suggère un manque de confiance.",
        how: "Consciemment, remplacez les expressions de doute par des affirmations.",
        impact: "Perception de confiance immédiate.",
        estimatedTime: "10 minutes de pratique mentale",
        expectedGain: "+5 points sur la note de confiance",
        concreteExample: "Au lieu de 'Je pense que je peux', dites 'Je suis confiant que je peux'.",
      });
    }

    return quickWins;
  }
}
