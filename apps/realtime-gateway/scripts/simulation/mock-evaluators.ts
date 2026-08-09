/**
 * Mock evaluators for V3 simulation without LLM dependency
 * Uses heuristics based on response characteristics
 */

export interface BluffEvaluation {
  bluff_score: number;
  buzzword_density: number;
  vagueness_level: number;
  evasion_detected: boolean;
  theoretical_response: boolean;
  concrete_examples_present: boolean;
  verdict: "No Bluff" | "Possible Bluff" | "Likely Bluff";
  analysis_summary: string;
}

export interface ConsistencyEvaluation {
  consistency_score: number;
  gap_detected: boolean;
  gap_details: string[];
}

export interface HrNarrativeEvaluation {
  narrative_score: number;
  clarity_score: number;
  structure_score: number;
  overall_score: number;
}

export interface TechDirectorEvaluation {
  technical_depth_score: number;
  precision_score: number;
  concrete_examples_score: number;
  overall_score: number;
}

export interface PressureEvaluation {
  pressure_score: number;
  stress_signals: string[];
}

export interface LeadershipEvaluation {
  strategic_thinking_score: number;
  conflict_leadership_score: number;
  organizational_impact_score: number;
  overall_score: number;
}

// Heuristics for bluff detection
export async function evaluateBluff(question: string, transcript: string): Promise<BluffEvaluation> {
  const vagueWords = ["peut-être", "je crois", "en gros", "à peu près", "je pense", "c'est évident", "tout seul", "automatiquement", "euh", "je ne suis pas sûr", "c'est difficile à dire", "je ne sais pas trop"];
  const buzzwords = ["microservices", "scalabilité", "cloud", "agilité", "devops", "kubernetes", "docker", "serverless", "transformation digitale", "innovation", "disruptif", "excellence opérationnelle", "holistique", "stratégique", "modernes", "émergent", "paradigme"];
  const concreteIndicators = ["j'ai mis en place", "j'ai implémenté", "nous avons utilisé", "spécifiquement", "concrètement", "par exemple", "réduit de", "augmenté de", "%", "ms", "kafka", "redis", "elasticsearch", "postgresql", "rust", "golang", "java", "node.js"];
  
  let vaguenessCount = 0;
  let buzzwordCount = 0;
  let concreteCount = 0;
  
  const lowerTranscript = transcript.toLowerCase();
  vagueWords.forEach(w => { if (lowerTranscript.includes(w)) vaguenessCount++; });
  buzzwords.forEach(w => { if (lowerTranscript.includes(w)) buzzwordCount++; });
  concreteIndicators.forEach(w => { if (lowerTranscript.includes(w)) concreteCount++; });
  
  const vaguenessLevel = Math.min(10, vaguenessCount * 1.5);
  const buzzwordDensity = Math.min(10, buzzwordCount * 2);
  const concretePresent = concreteCount > 0;
  
  const evasionDetected = transcript.length < 50 || vaguenessCount > 2;
  const theoretical = !concretePresent && buzzwordCount > 1;
  
  let bluffScore = (vaguenessLevel + buzzwordDensity) / 2;
  if (concretePresent) bluffScore -= 3;
  if (theoretical) bluffScore += 3;
  if (evasionDetected) bluffScore += 2;
  
  bluffScore = Math.max(0, Math.min(10, bluffScore));
  
  let verdict: "No Bluff" | "Possible Bluff" | "Likely Bluff" = "No Bluff";
  if (bluffScore > 6) verdict = "Likely Bluff";
  else if (bluffScore > 3.5) verdict = "Possible Bluff";
  
  return {
    bluff_score: bluffScore,
    buzzword_density: buzzwordDensity,
    vagueness_level: vaguenessLevel,
    evasion_detected: evasionDetected,
    theoretical_response: theoretical,
    concrete_examples_present: concretePresent,
    verdict,
    analysis_summary: `Heuristic evaluation: ${concreteCount} concrete indicators, ${vaguenessCount} vague markers, ${buzzwordCount} buzzwords.`
  };
}

export async function evaluateConsistencyGap(question: string, transcript: string, cv: string): Promise<ConsistencyEvaluation> {
  // Check for specific metrics, technologies, and concrete details
  const hasNumbers = /\d+/.test(transcript);
  const hasPercentage = /[0-9]+%/.test(transcript);
  const hasTimeUnit = /[0-9]+(ms|s|min|h|jours|mois|ans)/.test(transcript);
  const hasTechStack = /(java|node|go|rust|python|kafka|redis|postgresql|mongodb|kubernetes|docker|graphql|rest|api)/i.test(transcript);
  const hasSpecificTech = /[A-Z]{2,}/.test(transcript);
  
  const specificityScore = (hasNumbers ? 2 : 0) + (hasPercentage ? 2 : 0) + (hasTimeUnit ? 2 : 0) + (hasTechStack ? 2 : 0) + (hasSpecificTech ? 2 : 0);
  const score = Math.min(10, 5 + specificityScore);
  
  const gaps: string[] = [];
  if (!hasNumbers) gaps.push("No quantitative metrics");
  if (!hasTechStack) gaps.push("No specific technologies mentioned");
  
  return {
    consistency_score: score,
    gap_detected: specificityScore < 4,
    gap_details: gaps
  };
}

export async function evaluateHRNarrative(transcript: string): Promise<HrNarrativeEvaluation> {
  const sentences = transcript.split(/[.!?]/).length;
  const avgLength = transcript.length / Math.max(1, sentences);
  
  // Check for hesitations (vague/fragile profiles)
  const hesitations = ["euh", "...", "je ne sais pas", "je ne me souviens pas", "c'est difficile", "peut-être", "je crois"];
  const hesitationCount = hesitations.filter(h => transcript.toLowerCase().includes(h)).length;
  
  // Check for concrete career progression (solid/technical profiles)
  const careerIndicators = ["développeur", "ingénieur", "lead", "senior", "junior", "architecte", "manager"];
  const careerCount = careerIndicators.filter(c => transcript.toLowerCase().includes(c)).length;
  
  // Check for buzzwords (bluff profiles)
  const buzzwords = ["transformation", "innovation", "disruptif", "excellence", "holistique"];
  const buzzwordCount = buzzwords.filter(b => transcript.toLowerCase().includes(b)).length;
  
  const clarityScore = Math.min(10, avgLength / 8) - (hesitationCount * 1.5);
  const structureScore = Math.min(10, sentences * 2) + (careerCount * 1.5) - (buzzwordCount * 1);
  const narrativeScore = (clarityScore + structureScore) / 2;
  
  return {
    narrative_score: Math.max(0, Math.min(10, narrativeScore)),
    clarity_score: Math.max(0, Math.min(10, clarityScore)),
    structure_score: Math.max(0, Math.min(10, structureScore)),
    overall_score: Math.max(0, Math.min(10, narrativeScore))
  };
}

export async function evaluateTechDirector(question: string, transcript: string): Promise<TechDirectorEvaluation> {
  const techTerms = ["api", "sql", "database", "cache", "architecture", "performance", "optimisation", "algorithme", "microservices", "kubernetes", "docker", "redis", "kafka", "postgresql", "elasticsearch", "rust", "golang", "java", "node.js", "typescript", "graphql", "rest", "graphql", "ci/cd", "github", "gitlab", "aws", "gcp", "azure"];
  const techCount = techTerms.filter(t => transcript.toLowerCase().includes(t)).length;
  
  // Check for specific technical patterns
  const hasMetrics = /\d+/.test(transcript);
  const hasLatency = /latence|latency|temps de réponse|response time/i.test(transcript);
  const hasScalability = /scalabilité|scalability|scale|charge|load/i.test(transcript);
  const hasImplementation = /j'ai implémenté|j'ai mis en place|nous avons créé|j'ai écrit|j'ai développé/i.test(transcript);
  
  const depthScore = Math.min(10, techCount * 1.5);
  const precisionScore = (hasMetrics ? 3 : 0) + (hasLatency ? 2 : 0) + (hasScalability ? 2 : 0) + 3;
  const concreteScore = (hasImplementation ? 5 : 0) + (techCount > 2 ? 3 : 0) + 2;
  
  const overallScore = (depthScore + precisionScore + concreteScore) / 3;
  
  return {
    technical_depth_score: depthScore,
    precision_score: Math.min(10, precisionScore),
    concrete_examples_score: Math.min(10, concreteScore),
    overall_score: Math.min(10, overallScore)
  };
}

export async function evaluatePressure(transcript: string): Promise<PressureEvaluation> {
  const hesitationMarkers = ["euh", "...", "je ne sais pas", "je ne me souviens pas", "c'est difficile", "je ne suis pas sûr", "c'est compliqué", "je ne sais pas trop"];
  const stressMarkers = ["stressé", "paniqué", "inquiet", "anxieux", "humiliant", "honteux", "pas à la hauteur", "manque de confiance"];
  const vagueMarkers = ["peut-être", "je crois", "en gros", "à peu près", "je pense"];
  
  const hesitationCount = hesitationMarkers.filter(m => transcript.toLowerCase().includes(m)).length;
  const stressCount = stressMarkers.filter(m => transcript.toLowerCase().includes(m)).length;
  const vagueCount = vagueMarkers.filter(m => transcript.toLowerCase().includes(m)).length;
  
  const score = Math.min(10, (hesitationCount * 2) + (stressCount * 3) + (vagueCount * 1));
  const signals: string[] = [];
  if (hesitationCount > 0) signals.push("hesitation");
  if (stressCount > 0) signals.push("stress");
  if (vagueCount > 2) signals.push("vagueness");
  
  return {
    pressure_score: score,
    stress_signals: signals
  };
}

export async function evaluateLeadership(transcript: string): Promise<LeadershipEvaluation> {
  const leadershipTerms = ["équipe", "mentor", "dirigé", "gestion", "leadership", "collaboration", "alignement", "stakeholder", "gouvernance", "transformation", "exécutif", "comité", "roadmap", "okr", "kpi"];
  const actionTerms = ["j'ai mené", "j'ai dirigé", "j'ai géré", "j'ai créé", "j'ai mis en place", "j'ai établi", "j'ai redéfini", "j'ai organisé"];
  const businessTerms = ["business", "stratégie", "croissance", "revenus", "clients", "marché", "compétitivité", "valeur", "impact", "résultats"];
  
  const leadershipCount = leadershipTerms.filter(t => transcript.toLowerCase().includes(t)).length;
  const actionCount = actionTerms.filter(t => transcript.toLowerCase().includes(t)).length;
  const businessCount = businessTerms.filter(t => transcript.toLowerCase().includes(t)).length;
  
  const strategicScore = Math.min(10, (leadershipCount * 1.5) + (businessCount * 1.5));
  const conflictScore = /conflit|résoudre|discuter|faciliter|médiation|rfc|design review/i.test(transcript) ? 8 : 5;
  const impactScore = (actionCount > 0 ? 3 : 0) + (businessCount > 0 ? 3 : 0) + 4;
  
  const overallScore = (strategicScore + conflictScore + impactScore) / 3;
  
  return {
    strategic_thinking_score: Math.min(10, strategicScore),
    conflict_leadership_score: Math.min(10, conflictScore),
    organizational_impact_score: Math.min(10, impactScore),
    overall_score: Math.min(10, overallScore)
  };
}
