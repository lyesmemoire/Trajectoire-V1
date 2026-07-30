// apps/web/src/application/services/CVHIIOSBridge.ts
//
// RESPONSABILITÉ : Pont entre CV et HIIOS
// INITIALISE le kernel HIIOS avec les données du CV
//

import { z } from 'zod'
import { EvidenceEngine } from '@/application/hiios/layer0-kernel/EvidenceEngine'
import { HypothesisEngine } from '@/application/hiios/layer0-kernel/HypothesisEngine'
import { SkillGraph } from '@/application/hiios/layer0-kernel/SkillGraph'
import { KernelState } from '@/application/hiios/layer0-kernel/KernelState'
import {
  Evidence,
  EvidenceType,
  EvidenceReliability,
  EvidenceDirection,
} from '@/application/hiios/interfaces/IHIIOSKernel'

// Schéma CV (identique à l'API CV analyze)
const CvAnalysisSchema = z.object({
  personal: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
  }),
  currentPosition: z.object({
    title: z.string().optional(),
    company: z.string().optional(),
    yearsInRole: z.number().optional(),
  }).optional(),
  totalExperience: z.number().optional(),
  experiences: z.array(z.object({
    company: z.string(),
    title: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    current: z.boolean().optional(),
    highlights: z.array(z.string()).optional(),
  })),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string().optional(),
    field: z.string().optional(),
    year: z.number().optional(),
  })),
  skills: z.object({
    technical: z.array(z.string()),
    soft: z.array(z.string()),
    languages: z.array(z.string()),
  }),
  careerDNA: z.object({
    seniority: z.enum(['junior', 'mid', 'senior', 'executive']),
    strengths: z.array(z.string()),
    patterns: z.array(z.string()),
    targetRoles: z.array(z.string()),
    industries: z.array(z.string()),
    redFlags: z.array(z.string()),
  }),
})

export type CvAnalysis = z.infer<typeof CvAnalysisSchema>

export interface HIIOSContext {
  sessionId: string
  kernelState: KernelState
  evidenceEngine: EvidenceEngine
  hypothesisEngine: HypothesisEngine
  skillGraph: SkillGraph
}

export class CVHIIOSBridge {

  /**
   * Initialise le kernel HIIOS avec les données du CV
   */
  static initializeFromCV(cvData: CvAnalysis, userId: string): HIIOSContext {
    const sessionId = `session_${userId}_${Date.now()}`

    // 1. Initialiser les moteurs dans le bon ordre
    // KernelState initialise tous les moteurs internement
    const kernelState = new KernelState(sessionId, userId)
    
    const evidenceEngine = kernelState.evidence
    const hypothesisEngine = kernelState.hypothesis
    const skillGraph = kernelState.skills

    // 2. Extraire les compétences du CV
    const allSkills = [
      ...cvData.skills.technical,
      ...cvData.skills.soft,
      ...cvData.skills.languages,
    ]

    // 3. Générer des preuves initiales à partir du CV
    const initialEvidences = this.generateInitialEvidences(cvData, allSkills)
    initialEvidences.forEach(evidence => {
      evidenceEngine.add(evidence)
    })

    // 4. Générer des hypothèses initiales
    const initialHypotheses = this.generateInitialHypotheses(
      cvData,
      allSkills,
      0 // turn 0
    )
    initialHypotheses.forEach(hypothesis => {
      hypothesisEngine.generate(hypothesis)
    })

    // 5. Mettre à jour le skill graph avec les preuves
    // Mettre à jour chaque nœud avec les preuves correspondantes
    for (const node of skillGraph.getAllNodes()) {
      skillGraph.updateFromEvidence(node.id)
    }

    // 6. Stocker le profil candidat dans les métadonnées de session
    (kernelState.session as any).candidateProfile = {
      seniority: cvData.careerDNA.seniority,
      totalExperience: cvData.totalExperience ?? 0,
      targetRoles: cvData.careerDNA.targetRoles,
      industries: cvData.careerDNA.industries,
      strengths: cvData.careerDNA.strengths,
      patterns: cvData.careerDNA.patterns,
    }

    return {
      sessionId,
      kernelState,
      evidenceEngine,
      hypothesisEngine,
      skillGraph,
    }
  }

  /**
   * Génère des preuves initiales à partir du CV
   */
  private static generateInitialEvidences(
    cvData: CvAnalysis,
    skills: string[]
  ): Omit<Evidence, 'id' | 'timestamp'>[] {
    const evidences: Omit<Evidence, 'id' | 'timestamp'>[] = []

    // Preuve : Expérience totale
    if (cvData.totalExperience && cvData.totalExperience > 0) {
      evidences.push({
        turn: 0,
        type: EvidenceType.CITATION,
        rawContent: `${cvData.totalExperience} années d'expérience totale`,
        weight: 0.8,
        reliability: EvidenceReliability.HIGH,
        context: 'CV - Expérience',
        skillsImpacted: skills,
        hypothesesImpacted: ['experience_sufficiency'],
        direction: EvidenceDirection.CONFIRMS,
        biasCheck: { hasBias: false },
      })
    }

    // Preuve : Compétences techniques
    if (cvData.skills.technical.length > 0) {
      evidences.push({
        turn: 0,
        type: EvidenceType.CITATION,
        rawContent: `Compétences techniques : ${cvData.skills.technical.join(', ')}`,
        weight: 0.85,
        reliability: EvidenceReliability.HIGH,
        context: 'CV - Compétences',
        skillsImpacted: cvData.skills.technical,
        hypothesesImpacted: ['technical_proficiency'],
        direction: EvidenceDirection.CONFIRMS,
        biasCheck: { hasBias: false },
      })
    }

    // Preuve : Seniorité
    evidences.push({
      turn: 0,
      type: EvidenceType.CITATION,
      rawContent: `Seniorité identifiée : ${cvData.careerDNA.seniority}`,
      weight: 0.75,
      reliability: EvidenceReliability.MEDIUM,
      context: 'CV - Seniorité',
      skillsImpacted: skills,
      hypothesesImpacted: ['seniority_match'],
      direction: EvidenceDirection.CONFIRMS,
      biasCheck: { hasBias: false },
    })

    // Preuve : Points forts
    if (cvData.careerDNA.strengths.length > 0) {
      evidences.push({
        turn: 0,
        type: EvidenceType.PATTERN,
        rawContent: `Points forts : ${cvData.careerDNA.strengths.join(', ')}`,
        weight: 0.7,
        reliability: EvidenceReliability.MEDIUM,
        context: 'CV - Points forts',
        skillsImpacted: skills,
        hypothesesImpacted: ['strength_alignment'],
        direction: EvidenceDirection.CONFIRMS,
        biasCheck: { hasBias: false },
      })
    }

    return evidences
  }

  /**
   * Génère des hypothèses initiales
   */
  private static generateInitialHypotheses(
    cvData: CvAnalysis,
    skills: string[],
    turn: number
  ): Array<{
    label: string
    description: string
    skill_node_id: string
    prior: number
    created_at_turn: number
  }> {
    const hypotheses: Array<{
      label: string
      description: string
      skill_node_id: string
      prior: number
      created_at_turn: number
    }> = []

    // Hypothèse : Expérience suffisante pour le rôle cible
    const experienceYears = cvData.totalExperience ?? 0
    const experiencePrior = Math.min(experienceYears / 10, 1) // 10 ans = prior 1.0

    hypotheses.push({
      label: 'Expérience suffisante pour le rôle',
      description: 'Le candidat possède suffisamment d\'expérience pour le rôle cible',
      skill_node_id: 'experience',
      prior: experiencePrior,
      created_at_turn: turn,
    })

    // Hypothèse : Compétences techniques alignées
    const technicalPrior = cvData.skills.technical.length > 0 ? 0.8 : 0.3

    hypotheses.push({
      label: 'Compétences techniques alignées',
      description: 'Les compétences techniques du candidat correspondent aux exigences du poste',
      skill_node_id: 'technical_skills',
      prior: technicalPrior,
      created_at_turn: turn,
    })

    // Hypothèse : Seniorité correspond au rôle cible
    const seniorityPrior = cvData.careerDNA.seniority === 'senior' || cvData.careerDNA.seniority === 'executive' ? 0.8 : 0.5

    hypotheses.push({
      label: 'Seniorité correspond au rôle cible',
      description: 'Le niveau de seniorité du candidat correspond au rôle cible',
      skill_node_id: 'seniority',
      prior: seniorityPrior,
      created_at_turn: turn,
    })

    return hypotheses
  }
}
