// meta/types.ts
export interface UnifiedSignals {
  content_signals: {
    clarity: number;
    specificity: number;
    ownership: number;
    technical_depth: number;
    behavioral_depth: number;
  };
  risk_signals: {
    bluff_risk: number;
    integrity_risk: number;
    inconsistency_risk: number;
  };
  interaction_signals: {
    engagement: number;
    stress_level: number;
    confidence_level: number;
  };
  legacy_hints: {
    v1_score: number;
    v1_decision_hint: "probe" | "deepen" | "move-on";
  };
  flags: string[];
  analysis_summary: string;
}

export interface MetaDecision {
  meta_decision: {
    action:
      | "dig_deeper"
      | "change_topic"
      | "escalate_pressure"
      | "deescalate_pressure"
      | "test_consistency"
      | "wrap_up";
    target_phase: "hr" | "tech" | "pressure" | "leadership" | "wrap";
    target_pressure_level: number;
  };
  engine_routing: {
    primary_engine: "v1" | "v2" | "v3";
    use_llm_question: boolean;
  };
  safety_adjustments: {
    force_deescalation: boolean;
    max_allowed_pressure_level: number;
  };
  reasoning_summary: string;
}

export interface GeneratedQuestion {
  next_question: {
    interviewer_role: "hr" | "tech" | "exec";
    tone: "friendly" | "neutral" | "executive";
    target_phase: "hr" | "tech" | "pressure" | "leadership" | "wrap";
    target_pressure_level: number;
    question_text: string;
  };
  question_intent: {
    primary_goal:
      | "explore_motivation"
      | "probe_technical_depth"
      | "probe_behavioral_example"
      | "test_consistency"
      | "stress_test"
      | "assess_leadership"
      | "wrap_up";
    focus_skill_or_topic: string;
    expected_answer_style:
      | "narrative"
      | "structured_example"
      | "technical_deep_dive"
      | "strategic_reflection";
  };
}
