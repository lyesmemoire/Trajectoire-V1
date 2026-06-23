export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PlanType       = "free" | "pro";
export type ObjectiveType  = "promotion" | "interview" | "transition" | "direction" | "clarity" | "other";
export type PriorityType   = "high" | "medium" | "low";
export type NotifType      = "success" | "info" | "warning";
export type SimulationType = "interview" | "presentation" | "negotiation" | "feedback";
export type MilestoneStatus = "pending" | "current" | "done";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:          string;
          first_name:  string;
          last_name:   string;
          role:        string | null;
          objective:   ObjectiveType | null;
          plan:        PlanType;
          avatar_url:  string | null;
          created_at:  string;
          updated_at:  string;
        };
        Insert: {
          id:          string;
          first_name?: string;
          last_name?:  string;
          role?:       string | null;
          objective?:  ObjectiveType | null;
          plan?:       PlanType;
          avatar_url?: string | null;
        };
        Update: {
          first_name?: string;
          last_name?:  string;
          role?:       string | null;
          objective?:  ObjectiveType | null;
          plan?:       PlanType;
          avatar_url?: string | null;
        };
      };

      evaluations: {
        Row: {
          id:               string;
          user_id:          string;
          confidence_score: number | null;
          stress_score:     number | null;
          preparedness:     number | null;
          decision_score:   number | null;
          raw_answers:      Json | null;
          completed_at:     string | null;
          created_at:       string;
        };
        Insert: {
          user_id:          string;
          confidence_score?: number | null;
          stress_score?:    number | null;
          preparedness?:    number | null;
          decision_score?:  number | null;
          raw_answers?:     Json | null;
          completed_at?:    string | null;
        };
        Update: {
          confidence_score?: number | null;
          stress_score?:    number | null;
          preparedness?:    number | null;
          decision_score?:  number | null;
          raw_answers?:     Json | null;
          completed_at?:    string | null;
        };
      };

      competency_scores: {
        Row: {
          id:            string;
          evaluation_id: string;
          user_id:       string;
          name:          string;
          score:         number;
          prev_score:    number | null;
          created_at:    string;
        };
        Insert: {
          evaluation_id: string;
          user_id:       string;
          name:          string;
          score:         number;
          prev_score?:   number | null;
        };
        Update: {
          score?:      number;
          prev_score?: number | null;
        };
      };

      simulations: {
        Row: {
          id:           string;
          user_id:      string;
          type:         SimulationType;
          score:        number | null;
          feedback:     string | null;
          duration_sec: number | null;
          completed_at: string | null;
          created_at:   string;
        };
        Insert: {
          user_id:      string;
          type:         SimulationType;
          score?:       number | null;
          feedback?:    string | null;
          duration_sec?: number | null;
          completed_at?: string | null;
        };
        Update: {
          score?:       number | null;
          feedback?:    string | null;
          duration_sec?: number | null;
          completed_at?: string | null;
        };
      };

      action_items: {
        Row: {
          id:         string;
          user_id:    string;
          label:      string;
          done:       boolean;
          priority:   PriorityType;
          due_date:   string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id:   string;
          label:     string;
          done?:     boolean;
          priority?: PriorityType;
          due_date?: string | null;
        };
        Update: {
          label?:    string;
          done?:     boolean;
          priority?: PriorityType;
          due_date?: string | null;
        };
      };

      plan_milestones: {
        Row: {
          id:         string;
          user_id:    string;
          week_label: string;
          title:      string;
          status:     MilestoneStatus;
          position:   number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id:    string;
          week_label: string;
          title:      string;
          status?:    MilestoneStatus;
          position?:  number;
        };
        Update: {
          status?:   MilestoneStatus;
          position?: number;
          title?:    string;
        };
      };

      notifications: {
        Row: {
          id:         string;
          user_id:    string;
          type:       NotifType;
          title:      string;
          body:       string;
          read:       boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type?:   NotifType;
          title:   string;
          body:    string;
          read?:   boolean;
        };
        Update: {
          read?: boolean;
        };
      };

      progression_snapshots: {
        Row: {
          id:           string;
          user_id:      string;
          week_label:   string;
          confidence:   number | null;
          preparedness: number | null;
          recorded_at:  string;
        };
        Insert: {
          user_id:      string;
          week_label:   string;
          confidence?:  number | null;
          preparedness?: number | null;
        };
        Update: {
          confidence?:  number | null;
          preparedness?: number | null;
        };
      };
    };

    Views: {
      dashboard_summary: {
        Row: {
          user_id:              string;
          first_name:           string;
          last_name:            string;
          role:                 string | null;
          plan:                 PlanType;
          objective:            ObjectiveType | null;
          last_evaluation_id:   string | null;
          confidence_score:     number | null;
          stress_score:         number | null;
          preparedness:         number | null;
          decision_score:       number | null;
          last_evaluated_at:    string | null;
          total_evaluations:    number;
          total_simulations:    number;
          pending_actions:      number;
          unread_notifications: number;
        };
      };
    };

    Functions: {};
    Enums: {
      plan_type:        PlanType;
      objective_type:   ObjectiveType;
      priority_type:    PriorityType;
      notif_type:       NotifType;
      simulation_type:  SimulationType;
      milestone_status: MilestoneStatus;
    };
  };
}

/* ── Shorthand row types ── */
export type Profile            = Database["public"]["Tables"]["profiles"]["Row"];
export type Evaluation         = Database["public"]["Tables"]["evaluations"]["Row"];
export type CompetencyScore    = Database["public"]["Tables"]["competency_scores"]["Row"];
export type Simulation         = Database["public"]["Tables"]["simulations"]["Row"];
export type ActionItem         = Database["public"]["Tables"]["action_items"]["Row"];
export type PlanMilestone      = Database["public"]["Tables"]["plan_milestones"]["Row"];
export type Notification       = Database["public"]["Tables"]["notifications"]["Row"];
export type ProgressionSnapshot = Database["public"]["Tables"]["progression_snapshots"]["Row"];
export type DashboardSummary   = Database["public"]["Views"]["dashboard_summary"]["Row"];
