import { Injectable } from '@nestjs/common';
import { Explanation } from '../runtime/kg/graph-reasoning-engine.service';
import { CopilotContext } from './copilot-context.service';

export interface CopilotResponse {
  message: string;
  reasoning: string[];
  sources: string[];
  confidence: number;
  data: any;
  suggestedQuestions: string[];
}

@Injectable()
export class ResponseBuilderService {
  buildResponse(
    intent: any,
    reasoningResult: Explanation,
    data: any,
    businessContext?: CopilotContext,
  ): CopilotResponse {
    let message = '';
    let suggestedQuestions: string[] = [];

    switch (intent.type) {
      case 'search_candidates':
        message = this.buildSearchCandidatesResponse(intent, data, businessContext);
        suggestedQuestions = [
          'Pourquoi ce candidat ?',
          'Et le deuxième ?',
          'Si on retire une compétence ?',
        ];
        break;
      case 'search_jobs':
        message = this.buildSearchJobsResponse(intent, data);
        suggestedQuestions = [
          'Pourquoi ce poste ?',
          'Quels sont les prérequis ?',
          'Y a-t-il des postes similaires ?',
        ];
        break;
      case 'explain_score':
        message = this.buildExplainScoreResponse(data);
        suggestedQuestions = [
          'Quelles compétences manquent ?',
          'Comment améliorer le score ?',
          'Quels candidats sont meilleurs ?',
        ];
        break;
      case 'propose_training':
        message = this.buildProposeTrainingResponse(data);
        suggestedQuestions = [
          'Combien de temps ?',
          'Quelle formation prioritaire ?',
          'Y a-t-il des alternatives ?',
        ];
        break;
      case 'propose_evolution':
        message = this.buildProposeEvolutionResponse(data, businessContext);
        suggestedQuestions = [
          'Quels sont les étapes intermédiaires ?',
          'Quelle formation commencer ?',
          'Combien de temps pour atteindre ce poste ?',
        ];
        break;
      default:
        message = this.buildGeneralResponse(reasoningResult, businessContext);
        suggestedQuestions = [
          'Quelles sont mes compétences ?',
          'Comment optimiser mon CV ?',
          'Quels postes correspondent à mon profil ?',
        ];
    }

    return {
      message,
      reasoning: reasoningResult.reasoningTrace.steps.map((s) => s.reasoning),
      sources: reasoningResult.evidence.map((e) => e.claim),
      confidence: reasoningResult.reasoningTrace.confidence,
      data: reasoningResult,
      suggestedQuestions,
    };
  }

  private buildSearchCandidatesResponse(intent: any, data: any, businessContext?: CopilotContext): string {
    const parts = [];

    if (businessContext?.cvData?.skills && businessContext.cvData.skills.length > 0) {
      parts.push(
        `Basé sur votre profil qui inclut: ${businessContext.cvData.skills.join(', ')}`,
      );
    }

    if (data.skills && data.skills.length > 0) {
      parts.push(
        `J'ai recherché des candidats avec les compétences: ${data.skills.join(', ')}`,
      );
    }

    if (data.seniority) {
      parts.push(`Niveau ${data.seniority}`);
    }

    if (data.jobTitle) {
      parts.push(`Pour le poste de ${data.jobTitle}`);
    }

    if (data.constraint) {
      parts.push(`En excluant ${data.constraint}`);
    }

    parts.push("J'ai trouvé plusieurs candidats correspondant à ces critères.");
    parts.push('Les résultats sont classés par ordre de pertinence.');
    parts.push(
      'Cette analyse est basée sur le Knowledge Graph et le KP-002 Compétences.',
    );

    return parts.join('. ');
  }

  private buildSearchJobsResponse(intent: any, data: any, businessContext?: CopilotContext): string {
    const parts = [];

    if (businessContext?.cvData?.skills && businessContext.cvData.skills.length > 0) {
      parts.push(
        `Basé sur vos compétences: ${businessContext.cvData.skills.join(', ')}`,
      );
    }

    if (data.skills && data.skills.length > 0) {
      parts.push(
        `J'ai recherché des postes correspondant à vos compétences: ${data.skills.join(', ')}`,
      );
    }

    if (data.seniority) {
      parts.push(`Niveau ${data.seniority}`);
    }

    parts.push(
      "J'ai trouvé plusieurs postes qui correspondent à votre profil.",
    );
    parts.push('Les résultats sont classés par ordre de pertinence.');
    parts.push(
      'Cette analyse est basée sur le Knowledge Graph et le KP-001 Métiers.',
    );

    return parts.join('. ');
  }

  private buildExplainScoreResponse(data: any): string {
    if (!data) {
      return "Je n'ai pas de rapport de matching disponible dans le contexte. Veuillez d'abord effectuer un matching.";
    }

    const parts = [];
    parts.push(`Le score de ${data.scores.global}% est calculé comme suit:`);

    data.scores.dimensions.forEach((dim: any) => {
      parts.push(
        `${dim.name}: ${dim.score}% (poids: ${Math.round(dim.weight * 100)}%)`,
      );
    });

    parts.push('Ce score repose sur:');
    parts.push('- Les compétences communes avec le poste');
    parts.push("- Le niveau d'expérience requis");
    parts.push('- Le niveau de formation');
    parts.push('- Les certifications');
    parts.push('- Les compétences transférables');

    if (data.missingSkills && data.missingSkills.length > 0) {
      parts.push(
        `Compétences manquantes: ${data.missingSkills.map((s: any) => s.name || s).join(', ')}`,
      );
    }

    if (data.transferableSkills && data.transferableSkills.length > 0) {
      parts.push(
        `Compétences transférables: ${data.transferableSkills.map((t: any) => `${t.from} → ${t.to}`).join(', ')}`,
      );
    }

    return parts.join('. ');
  }

  private buildProposeTrainingResponse(data: any): string {
    const parts = [];
    parts.push('Voici les recommandations de formation:');
    parts.push(
      "Basé sur l'analyse du Knowledge Graph et du KP-002 Compétences",
    );
    parts.push(
      'Les formations sont classées par priorité selon les écarts de compétences',
    );
    parts.push(
      'Chaque formation est liée à une compétence manquante identifiée',
    );
    parts.push(
      'Le temps estimé dépend du niveau actuel et de la complexité de la compétence',
    );

    return parts.join('. ');
  }

  private buildProposeEvolutionResponse(data: any, businessContext?: CopilotContext): string {
    const parts = [];
    parts.push('Voici le parcours de carrière recommandé:');
    
    if (businessContext?.cvData?.skills && businessContext.cvData.skills.length > 0) {
      parts.push(
        `Basé sur vos compétences actuelles: ${businessContext.cvData.skills.join(', ')}`,
      );
    }
    
    parts.push("Basé sur l'analyse du Knowledge Graph et du KP-001 Métiers");
    parts.push('Le parcours identifie les compétences à acquérir');
    parts.push('Les formations recommandées sont classées par priorité');
    parts.push(
      'Les métiers intermédiaires sont identifiés comme étapes de progression',
    );
    parts.push(
      'Le temps estimé est calculé en fonction des écarts de compétences',
    );

    return parts.join('. ');
  }

  private buildGeneralResponse(reasoningResult: Explanation, businessContext?: CopilotContext): string {
    const parts = [];
    
    parts.push(reasoningResult.detailedExplanation);
    
    if (businessContext?.cvData?.skills && businessContext.cvData.skills.length > 0) {
      parts.push(
        `Cette analyse est basée sur votre profil qui inclut: ${businessContext.cvData.skills.join(', ')}`,
      );
    }
    
    if (businessContext?.jobData?.skills && businessContext.jobData.skills.length > 0) {
      parts.push(
        `Les exigences du poste incluent: ${businessContext.jobData.skills.join(', ')}`,
      );
    }
    
    parts.push('Cette réponse est basée sur le Knowledge Graph et les données réelles de votre profil.');

    return parts.join('. ');
  }
}
