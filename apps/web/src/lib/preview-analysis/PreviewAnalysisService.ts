// apps/web/src/lib/preview-analysis/PreviewAnalysisService.ts
//
// Service pour PreviewAnalysis
// Logique métier pour la sauvegarde temporaire des analyses ATS

import { previewAnalysisRepository, PreviewAnalysisData } from './PreviewAnalysisRepository'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger/Logger'

export interface AnalyzePreviewRequest {
  cvText: string
  jobText?: string
  ipHash?: string
  fingerprint?: string
}

export interface AnalyzePreviewResponse {
  previewToken: string
  analysis: {
    atsScore: number
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
    cvExtract: any
    jobExtract?: any
  }
}

export class PreviewAnalysisService {
  /**
   * Créer une analyse preview anonyme
   */
  async analyzePreview(request: AnalyzePreviewRequest): Promise<AnalyzePreviewResponse> {
    // Integration with ATS service pending - using simulation for MVP
    const analysisResult = await this.simulateATSAnalysis(request.cvText, request.jobText)

    // Sauvegarder dans PreviewAnalysis
    const token = await previewAnalysisRepository.create({
      ipHash: request.ipHash,
      fingerprint: request.fingerprint,
      cvExtract: analysisResult.cvExtract,
      jobExtract: analysisResult.jobExtract,
      analysisResult: analysisResult,
      atsScore: analysisResult.atsScore,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      recommendations: analysisResult.recommendations,
      rawPayload: request,
      status: 'completed',
    })

    return {
      previewToken: token,
      analysis: analysisResult,
    }
  }

  /**
   * Revendiquer une preview analysis pour un utilisateur
   */
  async claimPreview(token: string, userId: string): Promise<void> {
    // Vérifier que le token est valide
    const isValid = await previewAnalysisRepository.isValidToken(token)
    if (!isValid) {
      throw new Error('Invalid or expired preview token')
    }

    // Récupérer la preview analysis
    const preview = await previewAnalysisRepository.findByToken(token)
    if (!preview) {
      throw new Error('Preview analysis not found')
    }

    // Vérifier qu'elle n'est pas déjà revendiquée
    if (preview.claimedByUserId) {
      throw new Error('Preview analysis already claimed')
    }

    // Revendiquer pour l'utilisateur
    await previewAnalysisRepository.claimForUser(token, userId)

    // Créer le CandidateProfile si nécessaire
    await this.createCandidateProfile(userId, preview)

    // Créer la CVAnalysis permanente
    await this.createPermanentAnalysis(userId, preview)

    // Créer les Skills
    await this.createSkills(userId, preview)

    // Créer l'Experience
    await this.createExperience(userId, preview)

    // Créer l'Education
    await this.createEducation(userId, preview)

    // Créer les Languages
    await this.createLanguages(userId, preview)

    // Créer l'ATS History
    await this.createATSHistory(userId, preview)

    // Alimenter le Knowledge Graph
    await this.feedKnowledgeGraph(userId, preview)
  }

  /**
   * Récupérer une preview analysis par token
   */
  async getPreviewAnalysis(token: string) {
    const preview = await previewAnalysisRepository.findByToken(token)
    
    if (!preview) {
      throw new Error('Preview analysis not found')
    }

    if (preview.expiresAt < new Date()) {
      throw new Error('Preview analysis expired')
    }

    return preview
  }

  /**
   * Récupérer la preview analysis revendiquée d'un utilisateur
   */
  async getUserClaimedPreview(userId: string) {
    return previewAnalysisRepository.findByUserId(userId)
  }

  /**
   * Nettoyer les tokens expirés
   */
  async cleanupExpired(): Promise<number> {
    return previewAnalysisRepository.deleteExpired()
  }

  /**
   * Simulation de l'analyse ATS (à remplacer par le vrai service)
   */
  private async simulateATSAnalysis(cvText: string, jobText?: string) {
    // Basic ATS simulation - will be replaced with actual ATS service integration
    
    const cvLength = cvText.length
    const baseScore = Math.min(100, Math.floor(cvLength / 10))
    
    return {
      atsScore: baseScore,
      strengths: ['Expérience professionnelle', 'Compétences techniques'],
      weaknesses: ['Section formation à détailler', 'Mots-clés manquants'],
      recommendations: ['Ajouter plus de détails sur vos projets', 'Inclure les technologies spécifiques'],
      cvExtract: {
        name: 'CV Preview',
        skills: ['JavaScript', 'TypeScript', 'React'],
        experience: '5 ans',
      },
      jobExtract: jobText ? {
        title: 'Poste cible',
        requirements: ['React', 'TypeScript'],
      } : undefined,
    }
  }

  /**
   * Créer le CandidateProfile à partir de la preview
   */
  private async createCandidateProfile(userId: string, preview: any) {
    const existingProfile = await (prisma as any).careerProfile.findUnique({
      where: { userId },
    })

    if (!existingProfile) {
      await (prisma as any).careerProfile.create({
        data: {
          userId,
          employabilityScore: preview.atsScore || 50,
          careerDNA: preview.cvExtract,
        },
      })
    }
  }

  /**
   * Créer la CVAnalysis permanente
   */
  private async createPermanentAnalysis(userId: string, preview: any) {
    await (prisma as any).cVAnalysis.create({
      data: {
        userId,
        fileName: 'CV Preview',
        originalText: '',
        optimizedText: '',
        cvData: preview.cvExtract,
        atsScoreBefore: 0,
        atsScoreAfter: preview.atsScore || 0,
        improvements: preview.recommendations || [],
        keywords: preview.strengths || [],
      },
    })
  }

  /**
   * Créer les Skills à partir de la preview
   */
  private async createSkills(userId: string, preview: any) {
    const cvExtract = preview.cvExtract as any
    const skills = cvExtract?.skills || []

    // Skills creation pending database schema implementation
    logger.debug(`[Skills] Creating ${skills.length} skills for user ${userId}`, { userId, skills })
  }

  /**
   * Créer l'Experience à partir de la preview
   */
  private async createExperience(userId: string, preview: any) {
    const cvExtract = preview.cvExtract as any
    const experience = cvExtract?.experience || []

    // Experience creation pending database schema implementation
    logger.debug(`[Experience] Creating experience for user ${userId}`, { userId, experience })
  }

  /**
   * Créer l'Education à partir de la preview
   */
  private async createEducation(userId: string, preview: any) {
    const cvExtract = preview.cvExtract as any
    const education = cvExtract?.education || []

    // Education creation pending database schema implementation
    logger.debug(`[Education] Creating education for user ${userId}`, { userId, education })
  }

  /**
   * Créer les Languages à partir de la preview
   */
  private async createLanguages(userId: string, preview: any) {
    const cvExtract = preview.cvExtract as any
    const languages = cvExtract?.languages || []

    // Languages creation pending database schema implementation
    logger.debug(`[Languages] Creating ${languages.length} languages for user ${userId}`, { userId, languages })
  }

  /**
   * Créer l'ATS History à partir de la preview
   */
  private async createATSHistory(userId: string, preview: any) {
    // L'ATS History est déjà créée via createPermanentAnalysis
    // Cette méthode peut être utilisée pour créer des entrées supplémentaires
    logger.debug(`[ATSHistory] History entry created for user ${userId}`, { userId })
  }

  /**
   * Alimenter le Knowledge Graph
   */
  private async feedKnowledgeGraph(userId: string, preview: any) {
    // Knowledge Graph integration pending system implementation
    
    logger.debug(`[KnowledgeGraph] Feeding data for user ${userId}`, {
      userId,
      cvExtract: preview.cvExtract,
      atsScore: preview.atsScore,
      skills: preview.cvExtract?.skills,
      experience: preview.cvExtract?.experience,
      education: preview.cvExtract?.education,
    })
  }
}

export const previewAnalysisService = new PreviewAnalysisService()
