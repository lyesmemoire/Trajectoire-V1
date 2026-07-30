import { ContradictionAssessment } from "./ContradictionLedger";

// ===================================================================
// CONTRADICTION VALIDATOR — Business Logic for Contradiction Detection
// ===================================================================

export interface ContradictionValidatorContext {
  observationA: any;
  observationB: any;
  contradictionType: string;
  severity: string;
}

export interface ContradictionValidatorResult {
  hasContradiction: boolean;
  confidence: number;
  reason: string;
}

export class ContradictionValidator {
  /**
   * Validate if two observations contradict each other
   * This contains all business logic for contradiction detection
   */
  validate(context: ContradictionValidatorContext): ContradictionValidatorResult {
    const { observationA, observationB, contradictionType, severity } = context;

    const contentA = (observationA.data?.content || observationA.content || "").toLowerCase();
    const contentB = (observationB.data?.content || observationB.content || "").toLowerCase();

    // Pattern matching based on contradiction type
    const patterns: Record<string, () => boolean> = {
      "factual-number-mismatch": () => this.matchesNumberMismatch(contentA, contentB),
      "factual-entity-mismatch": () => this.matchesEntityMismatch(contentA, contentB),
      "temporal-overlap": () => this.matchesTemporalOverlap(contentA, contentB),
      "temporal-sequence": () => this.matchesTemporalSequence(contentA, contentB),
      "technical-incompatibility": () => this.matchesTechnicalIncompatibility(contentA, contentB),
    };

    const matcher = patterns[contradictionType];
    const hasContradiction = matcher ? matcher() : false;

    const confidence = this.calculateConfidence(contradictionType, severity, hasContradiction);
    const reason = this.buildReason(contradictionType, hasContradiction, contentA, contentB);

    return {
      hasContradiction,
      confidence,
      reason,
    };
  }

  private matchesNumberMismatch(contentA: string, contentB: string): boolean {
    const numbersA: string[] = contentA.match(/\d+/g) || [];
    const numbersB: string[] = contentB.match(/\d+/g) || [];
    return numbersA.length > 0 && numbersB.length > 0 && 
           numbersA.some((n) => !numbersB.includes(n));
  }

  private matchesEntityMismatch(contentA: string, contentB: string): boolean {
    const entitiesA = this.extractEntities(contentA);
    const entitiesB = this.extractEntities(contentB);
    return entitiesA.length > 0 && entitiesB.length > 0 && 
           !entitiesA.some(e => entitiesB.includes(e));
  }

  private matchesTemporalOverlap(contentA: string, contentB: string): boolean {
    return contentA.includes("while") || contentB.includes("while") ||
           contentA.includes("simultaneously") || contentB.includes("simultaneously");
  }

  private matchesTemporalSequence(contentA: string, contentB: string): boolean {
    return contentA.includes("before") || contentB.includes("before") ||
           contentA.includes("after") || contentB.includes("after");
  }

  private matchesTechnicalIncompatibility(contentA: string, contentB: string): boolean {
    const techA = this.extractTechnologies(contentA);
    const techB = this.extractTechnologies(contentB);
    return this.checkIncompatibility(techA, techB);
  }

  private extractEntities(content: string): string[] {
    const entityPatterns = [
      /airbus|boeing|google|microsoft|amazon|apple|meta|netflix|spotify/gi,
      /kubernetes|docker|aws|azure|gcp|terraform|ansible/gi,
    ];
    const entities: string[] = [];
    for (const pattern of entityPatterns) {
      const matches = content.match(pattern);
      if (matches) entities.push(...matches);
    }
    return [...new Set(entities.map(e => e.toLowerCase()))];
  }

  private extractTechnologies(content: string): string[] {
    const techPatterns = [
      /java|python|javascript|typescript|go|rust|c\+\+|c#/gi,
      /react|angular|vue|svelte|next\.js|nuxt/gi,
      /kubernetes|docker|terraform|ansible|chef|puppet/gi,
      /aws|azure|gcp|heroku|vercel|netlify/gi,
    ];
    const techs: string[] = [];
    for (const pattern of techPatterns) {
      const matches = content.match(pattern);
      if (matches) techs.push(...matches);
    }
    return [...new Set(techs.map(t => t.toLowerCase()))];
  }

  private checkIncompatibility(techA: string[], techB: string[]): boolean {
    const incompatiblePairs = [
      ["react", "angular"],
      ["vue", "angular"],
      ["kubernetes", "docker swarm"],
    ];
    
    for (const [t1, t2] of incompatiblePairs) {
      if (techA.includes(t1) && techB.includes(t2)) return true;
      if (techA.includes(t2) && techB.includes(t1)) return true;
    }
    
    return false;
  }

  private calculateConfidence(contradictionType: string, severity: string, hasContradiction: boolean): number {
    if (!hasContradiction) return 0;
    
    let baseConfidence = 0.5;
    
    switch (severity) {
      case "CRITICAL":
        baseConfidence = 0.95;
        break;
      case "HIGH":
        baseConfidence = 0.85;
        break;
      case "MEDIUM":
        baseConfidence = 0.7;
        break;
      case "LOW":
        baseConfidence = 0.5;
        break;
    }
    
    return baseConfidence;
  }

  private buildReason(contradictionType: string, hasContradiction: boolean, contentA: string, contentB: string): string {
    if (!hasContradiction) {
      return `No ${contradictionType} contradiction detected between observations`;
    }

    return `${contradictionType} contradiction detected based on pattern matching between observations`;
  }
}
