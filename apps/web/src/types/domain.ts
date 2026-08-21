export type CreditAction =
  | "ats_check"
  | "cv_optimize"
  | "interview_generate"
  | "interview_feedback"
  | "stripe_purchase"
  | "signup_bonus"
  | "refund"

export interface InterviewQuestion {
  id: number
  type: "hr" | "technical" | "behavioral"
  question: string
  difficulty: "easy" | "medium" | "hard"
}

export interface InterviewAnswer {
  questionId: number
  answer: string
  answeredAt?: string
}

export interface InterviewFeedback {
  score: number
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
  exampleAnswer: string
  summary: string
}
