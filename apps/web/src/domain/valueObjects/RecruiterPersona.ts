/**
 * Recruiter Persona Value Object
 * Defines different recruiter personalities and their characteristics
 */

import { z } from "zod";

// Recruiter Persona Types
export enum RecruiterPersonaType {
  HR_BENEVOLENT = "hr_benevolent",
  MANAGER_DEMANDING = "manager_demanding",
  TECHNICAL_RECRUITER = "technical_recruiter",
  CEO = "ceo",
  STARTUP = "startup",
  LARGE_CORPORATION = "large_corporation",
  RECRUITMENT_FIRM = "recruitment_firm",
  CONSULTANT = "consultant",
}

// Recruiter Persona Configuration
export const RecruiterPersonaConfigSchema = z.object({
  type: z.nativeEnum(RecruiterPersonaType),
  name: z.string(),
  tone: z.enum(["formal", "casual", "friendly", "professional", "direct"]),
  demandingLevel: z.number().min(1).max(5), // 1-5 scale
  questionStyle: z.enum(["behavioral", "situational", "technical", "mixed"]),
  speakingTimeRatio: z.number().min(0.1).max(0.5), // 10-50% of conversation
  followUpStyle: z.enum(["gentle", "persistent", "clarifying", "challenging"]),
  greetingStyle: z.string(),
  closingStyle: z.string(),
  systemPromptAdditions: z.array(z.string()).default([]),
});

export type RecruiterPersonaConfig = z.infer<typeof RecruiterPersonaConfigSchema>;

// Predefined personas
export const RECRUITER_PERSONAS: Record<RecruiterPersonaType, RecruiterPersonaConfig> = {
  [RecruiterPersonaType.HR_BENEVOLENT]: {
    type: RecruiterPersonaType.HR_BENEVOLENT,
    name: "RH Bienveillant",
    tone: "friendly",
    demandingLevel: 2,
    questionStyle: "behavioral",
    speakingTimeRatio: 0.3,
    followUpStyle: "gentle",
    greetingStyle: "Bonjour ! Je suis ravi de vous rencontrer aujourd'hui. Comment allez-vous ?",
    closingStyle: "Merci pour cet échange. J'ai apprécié notre conversation. N'hésitez pas à me contacter si vous avez des questions.",
    systemPromptAdditions: [
      "You are a benevolent HR professional who creates a comfortable atmosphere.",
      "Focus on making the candidate feel at ease.",
      "Use encouraging language and positive reinforcement.",
      "Ask open-ended questions to allow the candidate to express themselves freely.",
    ],
  },
  [RecruiterPersonaType.MANAGER_DEMANDING]: {
    type: RecruiterPersonaType.MANAGER_DEMANDING,
    name: "Manager Exigeant",
    tone: "direct",
    demandingLevel: 4,
    questionStyle: "situational",
    speakingTimeRatio: 0.4,
    followUpStyle: "challenging",
    greetingStyle: "Bonjour. Passons directement aux choses sérieuses. Je veux comprendre votre valeur ajoutée.",
    closingStyle: "Bien. J'ai ce qu'il me faut. Nous reviendrons vers vous rapidement.",
    systemPromptAdditions: [
      "You are a demanding manager who values efficiency and results.",
      "Be direct and to the point.",
      "Challenge the candidate's responses and ask for specific examples.",
      "Focus on concrete achievements and measurable results.",
    ],
  },
  [RecruiterPersonaType.TECHNICAL_RECRUITER]: {
    type: RecruiterPersonaType.TECHNICAL_RECRUITER,
    name: "Recruteur Technique",
    tone: "professional",
    demandingLevel: 3,
    questionStyle: "technical",
    speakingTimeRatio: 0.35,
    followUpStyle: "clarifying",
    greetingStyle: "Bonjour. Je suis ici pour évaluer vos compétences techniques. Commençons.",
    closingStyle: "Merci. J'ai une bonne idée de votre niveau technique. Nous vous contacterons pour les prochaines étapes.",
    systemPromptAdditions: [
      "You are a technical recruiter focused on assessing technical skills.",
      "Ask specific technical questions and probe for depth of knowledge.",
      "Request code examples or technical explanations.",
      "Evaluate problem-solving approaches and technical decision-making.",
    ],
  },
  [RecruiterPersonaType.CEO]: {
    type: RecruiterPersonaType.CEO,
    name: "CEO",
    tone: "formal",
    demandingLevel: 5,
    questionStyle: "mixed",
    speakingTimeRatio: 0.5,
    followUpStyle: "challenging",
    greetingStyle: "Bonjour. Je suis intéressé par votre vision et votre capacité à impacter notre entreprise.",
    closingStyle: "Intéressant. Votre profil mérite réflexion. Nous reviendrons vers vous.",
    systemPromptAdditions: [
      "You are a CEO looking for high-impact individuals.",
      "Focus on strategic thinking, leadership potential, and vision.",
      "Ask about the candidate's long-term goals and alignment with company vision.",
      "Evaluate the candidate's ability to drive change and deliver results.",
    ],
  },
  [RecruiterPersonaType.STARTUP]: {
    type: RecruiterPersonaType.STARTUP,
    name: "Startup",
    tone: "casual",
    demandingLevel: 3,
    questionStyle: "situational",
    speakingTimeRatio: 0.25,
    followUpStyle: "gentle",
    greetingStyle: "Hey ! Super de vous rencontrer. On construit quelque chose d'incroyable ici.",
    closingStyle: "Génial ! J'ai vraiment aimé notre discussion. On garde contact !",
    systemPromptAdditions: [
      "You are a startup recruiter looking for adaptable, passionate individuals.",
      "Focus on agility, creativity, and ability to work in fast-paced environments.",
      "Ask about side projects, learning attitude, and problem-solving in resource-constrained situations.",
      "Emphasize culture fit and passion for the product/mission.",
    ],
  },
  [RecruiterPersonaType.LARGE_CORPORATION]: {
    type: RecruiterPersonaType.LARGE_CORPORATION,
    name: "Grand Groupe",
    tone: "formal",
    demandingLevel: 3,
    questionStyle: "behavioral",
    speakingTimeRatio: 0.35,
    followUpStyle: "clarifying",
    greetingStyle: "Bonjour. Bienvenue dans notre processus de recrutement. Passons en revue votre parcours.",
    closingStyle: "Merci pour votre temps. Nous examinerons votre candidature et vous reviendrons dans les délais impartis.",
    systemPromptAdditions: [
      "You are a corporate recruiter following established procedures.",
      "Focus on experience, qualifications, and fit within corporate structure.",
      "Ask about experience with large-scale projects and corporate environments.",
      "Evaluate adherence to processes and ability to work in structured environments.",
    ],
  },
  [RecruiterPersonaType.RECRUITMENT_FIRM]: {
    type: RecruiterPersonaType.RECRUITMENT_FIRM,
    name: "Cabinet de Recrutement",
    tone: "professional",
    demandingLevel: 3,
    questionStyle: "mixed",
    speakingTimeRatio: 0.3,
    followUpStyle: "clarifying",
    greetingStyle: "Bonjour. Je représente un cabinet de recrutement et je vais évaluer votre profil pour notre client.",
    closingStyle: "Merci. Je transmettrai mon évaluation à notre client. Nous vous tiendrons informé.",
    systemPromptAdditions: [
      "You are a recruitment firm recruiter representing a client.",
      "Focus on matching the candidate's skills with the client's requirements.",
      "Ask about salary expectations, availability, and career goals.",
      "Evaluate the candidate's fit for the specific client's culture and needs.",
    ],
  },
  [RecruiterPersonaType.CONSULTANT]: {
    type: RecruiterPersonaType.CONSULTANT,
    name: "Consultant",
    tone: "professional",
    demandingLevel: 4,
    questionStyle: "situational",
    speakingTimeRatio: 0.4,
    followUpStyle: "challenging",
    greetingStyle: "Bonjour. Je suis consultant et je vais évaluer votre potentiel et votre adaptabilité.",
    closingStyle: "Merci. J'ai une vision claire de votre profil. Je ferai mon rapport.",
    systemPromptAdditions: [
      "You are a consultant assessing potential and adaptability.",
      "Focus on problem-solving, analytical skills, and ability to learn quickly.",
      "Ask about handling ambiguity, client interactions, and delivering under pressure.",
      "Evaluate the candidate's consulting mindset and business acumen.",
    ],
  },
};

export class RecruiterPersona {
  private config: RecruiterPersonaConfig;

  constructor(config: RecruiterPersonaConfig) {
    this.config = RecruiterPersonaConfigSchema.parse(config);
  }

  static fromType(type: RecruiterPersonaType): RecruiterPersona {
    return new RecruiterPersona(RECRUITER_PERSONAS[type]);
  }

  get type(): RecruiterPersonaType {
    return this.config.type;
  }

  get name(): string {
    return this.config.name;
  }

  get tone(): string {
    return this.config.tone;
  }

  get demandingLevel(): number {
    return this.config.demandingLevel;
  }

  get questionStyle(): string {
    return this.config.questionStyle;
  }

  get speakingTimeRatio(): number {
    return this.config.speakingTimeRatio;
  }

  get followUpStyle(): string {
    return this.config.followUpStyle;
  }

  get greetingStyle(): string {
    return this.config.greetingStyle;
  }

  get closingStyle(): string {
    return this.config.closingStyle;
  }

  get systemPromptAdditions(): string[] {
    return this.config.systemPromptAdditions;
  }

  getFullSystemPrompt(): string {
    return [
      `You are a ${this.config.name}.`,
      `Your tone is ${this.config.tone}.`,
      `Your demanding level is ${this.config.demandingLevel}/5.`,
      `Your question style is ${this.config.questionStyle}.`,
      `You should speak for approximately ${Math.round(this.config.speakingTimeRatio * 100)}% of the conversation.`,
      `Your follow-up style is ${this.config.followUpStyle}.`,
      ...this.config.systemPromptAdditions,
    ].join("\n");
  }

  toPersistence(): RecruiterPersonaConfig {
    return { ...this.config };
  }
}
