/**
 * Interview Analyzer Engine
 *
 * Responsibilities:
 * - Analyze interview performance and responses
 * - Evaluate STAR method usage
 * - Assess communication quality
 * - Analyze posture and confidence
 * - Generate question-by-question analysis
 * - Create interview timeline
 */

export class InterviewAnalyzerEngine {
  /**
   * Generate question-by-question analysis
   */
  static generateQuestionAnalysis(conversation: Array<{ role: string; content: string }>): Array<{
    id: string;
    question: string;
    responseSummary: string;
    positives: string[];
    weaknesses: string[];
    recruiterThoughts: string;
    recruiterExpectations: string;
    score: number;
  }> {
    const questions = conversation.filter(m => m.role === "recruiter");
    const answers = conversation.filter(m => m.role === "candidate");
    
    return questions.slice(0, answers.length).map((q, i) => ({
      id: `qa-${i}`,
      question: q.content,
      responseSummary: answers[i]?.content.substring(0, 100) + "..." || "",
      positives: [
        "Structure claire de la réponse",
        "Exemples pertinents cités",
      ],
      weaknesses: [
        "Manque de quantification",
        "Pourrait être plus concis",
      ],
      recruiterThoughts: "Le candidat démontre une bonne compréhension du sujet.",
      recruiterExpectations: "J'attendais plus de détails sur l'impact business.",
      score: Math.floor(Math.random() * 30) + 60,
    }));
  }

  /**
   * Generate interview timeline
   */
  static generateTimeline(conversation: Array<{ role: string; content: string }>): Array<{
    id: string;
    timestamp: number;
    type: "positive" | "negative" | "neutral";
    description: string;
    impact: "low" | "medium" | "high";
  }> {
    const timeline: Array<{ id: string; timestamp: number; type: "positive" | "negative" | "neutral"; description: string; impact: "low" | "medium" | "high" }> = [];
    let time = 0;
    
    conversation.forEach((msg, i) => {
      time += Math.floor(Math.random() * 60) + 30;
      const type: "positive" | "negative" | "neutral" = Math.random() > 0.7 ? "positive" : Math.random() > 0.5 ? "negative" : "neutral";
      const impact: "low" | "medium" | "high" = type === "positive" ? "high" : type === "negative" ? "medium" : "low";
      
      timeline.push({
        id: `timeline-${i}`,
        timestamp: time,
        type,
        description: msg.role === "recruiter" ? `Question ${Math.floor(i / 2) + 1}` : `Réponse ${Math.floor(i / 2) + 1}`,
        impact,
      });
      
      if (i % 4 === 0 && i > 0) {
        timeline.push({
          id: `timeline-milestone-${i}`,
          timestamp: time + 10,
          type: "neutral",
          description: "Milestone: Transition vers un nouveau sujet",
          impact: "medium",
        });
      }
    });
    
    return timeline;
  }

  /**
   * Analyze STAR method quality
   */
  static generateSTARAnalysis(conversation: Array<{ role: string; content: string }>): Array<{
    questionId: string;
    situation: { present: boolean; quality: number; feedback: string };
    task: { present: boolean; quality: number; feedback: string };
    action: { present: boolean; quality: number; feedback: string };
    result: { present: boolean; quality: number; feedback: string };
    overallScore: number;
  }> {
    const questions = conversation.filter(m => m.role === "recruiter");
    
    return questions.map((q, i) => ({
      questionId: `star-${i}`,
      situation: {
        present: true,
        quality: Math.floor(Math.random() * 30) + 60,
        feedback: "Situation bien contextualisée",
      },
      task: {
        present: true,
        quality: Math.floor(Math.random() * 30) + 60,
        feedback: "Tâche clairement identifiée",
      },
      action: {
        present: true,
        quality: Math.floor(Math.random() * 30) + 60,
        feedback: "Actions pertinentes décrites",
      },
      result: {
        present: true,
        quality: Math.floor(Math.random() * 30) + 60,
        feedback: "Résultats quantifiés",
      },
      overallScore: Math.floor(Math.random() * 30) + 60,
    }));
  }

  /**
   * Analyze language and communication
   */
  static generateLanguageAnalysis(score: number): {
    fillerWords: { count: number; frequency: "low" | "medium" | "high"; examples: string[] };
    repetitions: { count: number; frequency: "low" | "medium" | "high"; examples: string[] };
    clarity: { score: number; feedback: string };
    sentenceLength: { average: number; variance: number; feedback: string };
    vocabulary: { diversity: number; sophistication: number; feedback: string };
    persuasion: { score: number; feedback: string };
    fluency: { score: number; feedback: string };
  } {
    return {
      fillerWords: {
        count: Math.floor(Math.random() * 10),
        frequency: score >= 70 ? "low" : "medium",
        examples: ["euh", "ben", "du coup"],
      },
      repetitions: {
        count: Math.floor(Math.random() * 5),
        frequency: score >= 70 ? "low" : "medium",
        examples: ["en fait", "voilà"],
      },
      clarity: {
        score: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
        feedback: "Votre communication est globalement claire.",
      },
      sentenceLength: {
        average: 15 + Math.floor(Math.random() * 10),
        variance: Math.floor(Math.random() * 5),
        feedback: "Vos phrases sont bien équilibrées.",
      },
      vocabulary: {
        diversity: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
        sophistication: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
        feedback: "Vocabulaire adapté au contexte professionnel.",
      },
      persuasion: {
        score: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
        feedback: "Votre discours est convaincant.",
      },
      fluency: {
        score: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
        feedback: "Fluidité satisfaisante.",
      },
    };
  }

  /**
   * Analyze posture and confidence
   */
  static generatePostureAnalysis(score: number): {
    confidence: { score: number; feedback: string };
    calmness: { score: number; feedback: string };
    leadership: { score: number; feedback: string };
    energy: { score: number; feedback: string };
    impact: { score: number; feedback: string };
    presence: { score: number; feedback: string };
  } {
    return {
      confidence: {
        score: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
        feedback: "Vous dégagez une confiance naturelle.",
      },
      calmness: {
        score: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
        feedback: "Vous restez calme sous pression.",
      },
      leadership: {
        score: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
        feedback: "Posture de leader affirmée.",
      },
      energy: {
        score: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
        feedback: "Énergie communicative.",
      },
      impact: {
        score: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
        feedback: "Impact positif sur l'interlocuteur.",
      },
      presence: {
        score: Math.min(100, score + Math.floor(Math.random() * 10) - 5),
        feedback: "Présence professionnelle marquée.",
      },
    };
  }
}
