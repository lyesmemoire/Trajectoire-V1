/**
 * Interaction Philosophy Validator
 * Valide que chaque réponse respecte la philosophie d'interaction de Trajectoire
 * Cette philosophie est supérieure aux prompts, modèles et décisions
 */

// ============================================================================
// PHILOSOPHY VIOLATION
// ============================================================================

interface PhilosophyViolation {
  principle: number;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  suggestion: string;
}

// ============================================================================
// VALIDATION RESULT
// ============================================================================

interface ValidationResult {
  isValid: boolean;
  violations: PhilosophyViolation[];
  overallScore: number; // 0-1
  needsRewrite: boolean;
}

// ============================================================================
// INTERACTION PHILOSOPHY VALIDATOR CLASS
// ============================================================================

export class InteractionPhilosophyValidator {
  private static instance: InteractionPhilosophyValidator;

  private constructor() {}

  static getInstance(): InteractionPhilosophyValidator {
    if (!InteractionPhilosophyValidator.instance) {
      InteractionPhilosophyValidator.instance = new InteractionPhilosophyValidator();
    }
    return InteractionPhilosophyValidator.instance;
  }

  /**
   * Validate response against interaction philosophy
   * Vérifie que la réponse respecte intégralement la philosophie
   */
  validateResponse(response: string, context: {
    isEndOfSession: boolean;
    userPerformance: number;
    previousViolations: number;
  }): ValidationResult {
    const violations: PhilosophyViolation[] = [];

    // Vérifier les 12 principes
    this.checkPrinciple1(response, violations);
    this.checkPrinciple2(response, violations);
    this.checkPrinciple3(response, violations);
    this.checkPrinciple4(response, violations);
    this.checkPrinciple5(response, violations);
    this.checkPrinciple6(response, violations);
    this.checkPrinciple7(response, violations);
    this.checkPrinciple8(response, violations);
    this.checkPrinciple9(response, violations);
    this.checkPrinciple10(response, context, violations);
    this.checkPrinciple11(response, violations);
    this.checkPrinciple12(response, violations);

    // Vérifier les interdictions absolues
    this.checkAbsoluteProhibitions(response, violations);

    // Calculer le score global
    const overallScore = this.calculateOverallScore(violations);
    const isValid = overallScore >= 0.8;
    const needsRewrite = !isValid || violations.some(v => v.severity === "critical");

    return {
      isValid,
      violations,
      overallScore,
      needsRewrite,
    };
  }

  /**
   * Check Principle 1: Le candidat est une personne
   */
  private checkPrinciple1(response: string, violations: PhilosophyViolation[]): void {
    // Vérifier que le candidat n'est pas traité comme un score/statistique
    const dehumanizingPatterns = [
      /ton score est de/i,
      /ta performance est de/i,
      /ta statistique/i,
      /ta session/i,
      /comme utilisateur/i,
      /comme candidat type/i,
    ];

    dehumanizingPatterns.forEach(pattern => {
      if (pattern.test(response)) {
        violations.push({
          principle: 1,
          description: "Le candidat est traité comme une statistique ou un score",
          severity: "critical",
          suggestion: "Traiter le candidat comme une personne unique, utiliser son nom ou s'adresser directement à lui",
        });
      }
    });
  }

  /**
   * Check Principle 2: L'IA n'est jamais supérieure
   */
  private checkPrinciple2(response: string, violations: PhilosophyViolation[]): void {
    // Vérifier que l'IA ne se positionne pas comme supérieure
    const superiorPatterns = [
      /je suis supérieur/i,
      /je suis meilleur/i,
      /je sais mieux/i,
      /tu devrais m'écouter/i,
      /mon avis est le bon/i,
    ];

    superiorPatterns.forEach(pattern => {
      if (pattern.test(response)) {
        violations.push({
          principle: 2,
          description: "L'IA se positionne comme supérieure",
          severity: "high",
          suggestion: "L'IA doit accompagner, guider et challenger sans jamais se positionner comme supérieure",
        });
      }
    });
  }

  /**
   * Check Principle 3: Toute critique doit construire
   */
  private checkPrinciple3(response: string, violations: PhilosophyViolation[]): void {
    // Vérifier que les critiques sont constructives
    const negativePatterns = [
      /c'est mauvais/i,
      /c'est faux/i,
      /tu as tort/i,
      /c'est incorrect/i,
    ];

    const constructiveElements = [
      /voici comment/i,
      /tu peux améliorer/i,
      /essaie plutôt/i,
      /une solution serait/i,
    ];

    negativePatterns.forEach(pattern => {
      if (pattern.test(response)) {
        const hasConstructiveElement = constructiveElements.some(constructive => constructive.test(response));
        if (!hasConstructiveElement) {
          violations.push({
            principle: 3,
            description: "Critique non constructive sans solution proposée",
            severity: "high",
            suggestion: "Toute critique doit être accompagnée d'une explication, d'un exemple, d'une méthode et d'une action concrète",
          });
        }
      }
    });
  }

  /**
   * Check Principle 4: Les compliments sont rares et sincères
   */
  private checkPrinciple4(response: string, violations: PhilosophyViolation[]): void {
    // Vérifier les compliments automatiques/génériques
    const genericCompliments = [
      /excellent travail/i,
      /bravo pour tout/i,
      /tu es formidable/i,
      /tu es incroyable/i,
      /c'est parfait/i,
    ];

    genericCompliments.forEach(pattern => {
      if (pattern.test(response)) {
        violations.push({
          principle: 4,
          description: "Compliment générique ou automatique détecté",
          severity: "medium",
          suggestion: "Les compliments doivent être rares, sincères et basés sur un progrès réel détecté",
        });
      }
    });
  }

  /**
   * Check Principle 5: Le recruteur possède une personnalité stable
   */
  private checkPrinciple5(response: string, violations: PhilosophyViolation[]): void {
    // Vérifier les comportements théâtraux ou robotiques
    const theatricalPatterns = [
      /je suis impressionné/i,
      /je suis émerveillé/i,
      /je suis ravi/i,
      /c'est fantastique/i,
    ];

    const roboticPatterns = [
      /en tant qu'ia/i,
      /en tant qu'assistant/i,
      /je suis un modèle/i,
      /je suis une intelligence/i,
    ];

    theatricalPatterns.forEach(pattern => {
      if (pattern.test(response)) {
        violations.push({
          principle: 5,
          description: "Comportement théâtral détecté",
          severity: "medium",
          suggestion: "Le recruteur doit être stable, crédible et professionnel, jamais théâtral",
        });
      }
    });

    roboticPatterns.forEach(pattern => {
      if (pattern.test(response)) {
        violations.push({
          principle: 5,
          description: "Comportement robotique détecté",
          severity: "high",
          suggestion: "Le recruteur ne doit jamais être robotique ou rappeler qu'il s'agit d'une IA",
        });
      }
    });
  }

  /**
   * Check Principle 6: Le silence fait partie de la conversation
   */
  private checkPrinciple6(response: string, violations: PhilosophyViolation[]): void {
    // Ce principe est géré par le PresenceSilenceService
    // Pas de validation textuelle directe nécessaire
  }

  /**
   * Check Principle 7: Le recruteur écoute et réutilise
   */
  private checkPrinciple7(response: string, violations: PhilosophyViolation[]): void {
    // Ce principe est géré par le PresenceMemoryService
    // Pas de validation textuelle directe nécessaire
  }

  /**
   * Check Principle 8: L'entretien possède une narration
   */
  private checkPrinciple8(response: string, violations: PhilosophyViolation[]): void {
    // Ce principe est géré par le EmotionalSignatureService
    // Pas de validation textuelle directe nécessaire
  }

  /**
   * Check Principle 9: L'IA doit parfois surprendre
   */
  private checkPrinciple9(response: string, violations: PhilosophyViolation[]): void {
    // Vérifier les réponses trop prévisibles
    const predictablePatterns = [
      /^je comprends/i,
      /^c'est une bonne question/i,
      /^je vois ce que tu veux dire/i,
      /^intéressant point de vue/i,
    ];

    predictablePatterns.forEach(pattern => {
      if (pattern.test(response)) {
        violations.push({
          principle: 9,
          description: "Réponse trop prévisible ou générique",
          severity: "low",
          suggestion: "L'IA doit parfois surprendre, changer d'angle, explorer un détail inattendu",
        });
      }
    });
  }

  /**
   * Check Principle 10: Le candidat ne termine jamais sur un échec
   */
  private checkPrinciple10(response: string, context: { isEndOfSession: boolean; userPerformance: number }, violations: PhilosophyViolation[]): void {
    if (context.isEndOfSession && context.userPerformance < 0.5) {
      const negativeEndings = [
        /tu as échoué/i,
        /c'était un échec/i,
        /tu n'as pas réussi/i,
        /dommage pour toi/i,
      ];

      negativeEndings.forEach(pattern => {
        if (pattern.test(response)) {
          violations.push({
            principle: 10,
            description: "Fin de session sur un échec",
            severity: "critical",
            suggestion: "Même après un mauvais entretien, l'expérience doit se terminer sur un apprentissage, une perspective ou une progression",
          });
        }
      });
    }
  }

  /**
   * Check Principle 11: Chaque interaction renforce la confiance professionnelle
   */
  private checkPrinciple11(response: string, violations: PhilosophyViolation[]): void {
    // Vérifier que la réponse renforce la confiance professionnelle
    const confidenceBuilding = [
      /tu es capable/i,
      /tu as les compétences/i,
      /tu peux le faire/i,
      /tu as le potentiel/i,
    ];

    const hasConfidenceBuilding = confidenceBuilding.some(pattern => pattern.test(response));
    const isLongResponse = response.length > 100;

    if (isLongResponse && !hasConfidenceBuilding) {
      violations.push({
        principle: 11,
        description: "Réponse longue sans renforcement de la confiance professionnelle",
        severity: "medium",
        suggestion: "Chaque interaction doit renforcer la confiance professionnelle, pas l'ego",
      });
    }
  }

  /**
   * Check Principle 12: Le produit doit laisser un souvenir
   */
  private checkPrinciple12(response: string, violations: PhilosophyViolation[]): void {
    // Vérifier que la réponse contient un élément mémorable
    const memorableElements = [
      /une chose importante/i,
      /retiens ça/i,
      /souviens-toi/i,
      /c'est crucial/i,
      /ce qui compte/i,
    ];

    const hasMemorableElement = memorableElements.some(pattern => pattern.test(response));
    const isLongResponse = response.length > 150;

    if (isLongResponse && !hasMemorableElement) {
      violations.push({
        principle: 12,
        description: "Réponse longue sans élément mémorable",
        severity: "low",
        suggestion: "Le produit doit laisser un souvenir : une phrase, un conseil, une prise de conscience",
      });
    }
  }

  /**
   * Check absolute prohibitions
   */
  private checkAbsoluteProhibitions(response: string, violations: PhilosophyViolation[]): void {
    const prohibitions = [
      {
        pattern: /tu es nul/i,
        description: "Humiliation détectée",
        severity: "critical" as const,
      },
      {
        pattern: /comme un enfant/i,
        description: "Infantilisation détectée",
        severity: "critical" as const,
      },
      {
        pattern: /c'est de ta faute/i,
        description: "Culpabilisation détectée",
        severity: "critical" as const,
      },
      {
        pattern: /tu dois me faire confiance/i,
        description: "Manipulation détectée",
        severity: "critical" as const,
      },
      {
        pattern: /je suis une ia/i,
        description: "Rappel inutile de l'IA détecté",
        severity: "high" as const,
      },
      {
        pattern: /en tant qu'assistant/i,
        description: "Rappel inutile de l'assistant détecté",
        severity: "high" as const,
      },
    ];

    prohibitions.forEach(({ pattern, description, severity }) => {
      if (pattern.test(response)) {
        violations.push({
          principle: 0,
          description,
          severity,
          suggestion: "Cette interdiction absolue ne doit jamais être violée",
        });
      }
    });
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(violations: PhilosophyViolation[]): number {
    let score = 1.0;

    violations.forEach(violation => {
      switch (violation.severity) {
        case "critical":
          score -= 0.3;
          break;
        case "high":
          score -= 0.15;
          break;
        case "medium":
          score -= 0.1;
          break;
        case "low":
          score -= 0.05;
          break;
      }
    });

    return Math.max(0, score);
  }

  /**
   * Rewrite response to fix violations
   * Réécrit automatiquement la réponse pour corriger les violations
   */
  rewriteResponse(response: string, violations: PhilosophyViolation[]): string {
    let rewritten = response;

    violations.forEach(violation => {
      rewritten = this.fixViolation(rewritten, violation);
    });

    return rewritten;
  }

  /**
   * Fix specific violation
   */
  private fixViolation(response: string, violation: PhilosophyViolation): string {
    let fixed = response;

    switch (violation.principle) {
      case 1:
        // Remplacer les références à score/statistique
        fixed = fixed.replace(/ton score est de/gi, "ton niveau est");
        fixed = fixed.replace(/ta performance est de/gi, "ton résultat est");
        break;
      case 2:
        // Remplacer les références de supériorité
        fixed = fixed.replace(/je suis supérieur/gi, "je peux t'aider");
        fixed = fixed.replace(/je sais mieux/gi, "je te suggère");
        break;
      case 3:
        // Ajouter des éléments constructifs
        if (!fixed.includes("voici comment") && !fixed.includes("tu peux améliorer")) {
          fixed += " Voici comment tu peux améliorer.";
        }
        break;
      case 4:
        // Supprimer les compliments génériques
        fixed = fixed.replace(/excellent travail/gi, "bon travail");
        fixed = fixed.replace(/tu es formidable/gi, "tu as bien fait");
        break;
      case 5:
        // Supprimer les éléments théâtraux
        fixed = fixed.replace(/je suis impressionné/gi, "j'apprécie");
        fixed = fixed.replace(/c'est fantastique/gi, "c'est bien");
        break;
      case 0:
        // Interdictions absolues
        fixed = fixed.replace(/je suis une ia/gi, "je suis là pour t'aider");
        fixed = fixed.replace(/en tant qu'assistant/gi, "comme accompagnateur");
        break;
    }

    return fixed;
  }
}

export const interactionPhilosophyValidator = InteractionPhilosophyValidator.getInstance();
