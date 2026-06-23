// types/database.ts â€” VERSION MISE Ã€ JOUR
// Source de vÃ©ritÃ© des types correspondant exactement au schÃ©ma SQL

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          credits?: number;
          updated_at?: string;
        };
      };
      cvs: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          storage_path: string;
          extracted_text: string | null; // RENOMMÃ‰ depuis content
          word_count: number;
          page_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          file_name: string;
          storage_path: string;
          extracted_text?: string | null;
          word_count?: number;
          page_count?: number;
        };
        Update: {
          extracted_text?: string | null;
          word_count?: number;
          page_count?: number;
          updated_at?: string;
        };
      };
      ats_reports: {
        Row: {
          id: string;
          user_id: string;
          cv_id: string;
          job_description: string | null;
          score: number;
          matched_keywords: string[] | null;
          missing_keywords: string[] | null;
          strengths: string[] | null;
          weaknesses: string[] | null;
          suggestions: string[] | null;
          total_keywords: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          cv_id: string;
          job_description?: string | null;
          score?: number;
          matched_keywords?: string[] | null;
          missing_keywords?: string[] | null;
          strengths?: string[] | null;
          weaknesses?: string[] | null;
          suggestions?: string[] | null;
          total_keywords?: number;
        };
        Update: {
          score?: number;
          matched_keywords?: string[] | null;
          missing_keywords?: string[] | null;
          strengths?: string[] | null;
          weaknesses?: string[] | null;
          suggestions?: string[] | null;
          total_keywords?: number;
        };
      };
      interview_sessions: {
        Row: {
          id: string;
          user_id: string;
          cv_id: string;
          job_title: string | null;
          job_description: string | null;
          questions: InterviewQuestion[];
          answers: InterviewAnswer[];
          feedback: InterviewFeedback | null;
          score: number | null;
          status: "in_progress" | "completed" | "abandoned";
          tokens_used: number;
          tokens_used_feedback: number;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          cv_id: string;
          job_title?: string | null;
          job_description?: string | null;
          questions?: InterviewQuestion[];
          answers?: InterviewAnswer[];
          status?: "in_progress" | "completed" | "abandoned";
          tokens_used?: number;
        };
        Update: {
          answers?: InterviewAnswer[];
          feedback?: InterviewFeedback;
          score?: number;
          status?: "in_progress" | "completed" | "abandoned";
          tokens_used_feedback?: number;
          completed_at?: string;
        };
      };
      credit_usage: {
        Row: {
          id: string;
          user_id: string;
          action: CreditAction;
          credits_spent: number;
          tokens_used: number; // RENOMMÃ‰ depuis tokens
          estimated_cost_eur: number; // RENOMMÃ‰ depuis estimated_cost
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          user_id: string;
          action: CreditAction;
          credits_spent: number;
          tokens_used?: number;
          estimated_cost_eur?: number;
          metadata?: Record<string, unknown>;
        };
        Update: never;
      };
      stripe_events: {
        Row: {
          id: string;
          event_id: string;
          user_id: string | null;
          credits_added: number | null;
          processed_at: string;
          created_at: string;
        };
        Insert: {
          event_id: string;
          user_id?: string | null;
          credits_added?: number | null;
          processed_at?: string;
        };
        Update: never;
      };
      premium_interview_sessions: {
        Row: {
          id: string;
          user_id: string;
          job_title: string;
          company: string | null;
          persona:
            | "big_tech_senior"
            | "startup_founder"
            | "corporate_hr"
            | "technical_lead"
            | "aggressive_recruiter";
          difficulty: "normal" | "hard" | "elite";
          phase:
            | "intro"
            | "cv_deep_dive"
            | "technical_case"
            | "behavioral"
            | "pressure_test"
            | "closing";
          stress_level: number;
          technical_score: number;
          coherence_score: number;
          communication_score: number | null;
          confidence_score: number;
          stress_score: number | null;
          tags: string[] | null;
          transcript: any;
          memory: any | null;
          is_processing: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_title: string;
          company?: string | null;
          persona:
            | "big_tech_senior"
            | "startup_founder"
            | "corporate_hr"
            | "technical_lead"
            | "aggressive_recruiter";
          difficulty: "normal" | "hard" | "elite";
          phase?:
            | "intro"
            | "cv_deep_dive"
            | "technical_case"
            | "behavioral"
            | "pressure_test"
            | "closing";
          stress_level?: number;
          technical_score?: number;
          coherence_score?: number;
          communication_score?: number | null;
          confidence_score?: number;
          stress_score?: number | null;
          tags?: string[] | null;
          transcript?: any;
          memory?: any;
          is_processing?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_title?: string;
          company?: string | null;
          persona?:
            | "big_tech_senior"
            | "startup_founder"
            | "corporate_hr"
            | "technical_lead"
            | "aggressive_recruiter";
          difficulty?: "normal" | "hard" | "elite";
          phase?:
            | "intro"
            | "cv_deep_dive"
            | "technical_case"
            | "behavioral"
            | "pressure_test"
            | "closing";
          stress_level?: number;
          technical_score?: number;
          coherence_score?: number;
          communication_score?: number | null;
          confidence_score?: number;
          stress_score?: number | null;
          tags?: string[] | null;
          transcript?: any;
          memory?: any;
          is_processing?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      deduct_credits_atomic: {
        Args: { uid: string; amt: number };
        Returns: number;
      };
      add_credits_atomic: {
        Args: { uid: string; amt: number };
        Returns: number;
      };
      process_stripe_payment: {
        Args: {
          p_event_id: string;
          p_user_id: string;
          p_credits: number;
          p_amount_cents: number;
          p_pack_name: string;
        };
        Returns: {
          success: boolean;
          reason?: string;
          credits_added?: number;
          new_balance?: number;
          event_id?: string;
        };
      };
      reserve_credits_atomic: {
        Args: {
          p_user_id: string;
          p_amount: number;
          p_action: string;
          p_idemp_key: string;
        };
        Returns: string;
      };
      commit_credits_atomic: {
        Args: {
          p_tx_id: string;
          p_tokens: number;
        };
        Returns: void;
      };
      rollback_credits_atomic: {
        Args: {
          p_tx_id: string;
          p_reason: string;
        };
        Returns: void;
      };
    };
  };
}

// Types mÃ©tier partagÃ©s
export type CreditAction =
  | "ats_check"
  | "cv_optimize"
  | "interview_generate"
  | "interview_feedback"
  | "stripe_purchase"
  | "signup_bonus"
  | "refund";

export interface InterviewQuestion {
  id: number;
  type: "hr" | "technical" | "behavioral";
  question: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface InterviewAnswer {
  questionId: number;
  answer: string;
  answeredAt?: string;
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  exampleAnswer: string;
  summary: string;
}
