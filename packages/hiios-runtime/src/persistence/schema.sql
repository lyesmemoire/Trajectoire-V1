-- HIIOS v4 Enterprise — Persistence Layer Schema
-- PostgreSQL Schema with Event Sourcing

-- ─────────────────────────────────────────────
-- INTERVIEWS
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  recruiter_id UUID NOT NULL,
  candidate_id UUID NOT NULL,
  target_role VARCHAR(100) NOT NULL,
  interview_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'created',
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT fk_organization FOREIGN KEY (organization_id) REFERENCES organizations(id),
  CONSTRAINT fk_recruiter FOREIGN KEY (recruiter_id) REFERENCES users(id),
  CONSTRAINT fk_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

CREATE INDEX idx_interviews_organization ON interviews(organization_id);
CREATE INDEX idx_interviews_recruiter ON interviews(recruiter_id);
CREATE INDEX idx_interviews_status ON interviews(status);

-- ─────────────────────────────────────────────
-- EVENT STORE (Event Sourcing)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS interview_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL,
  sequence_number INTEGER NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  event_version INTEGER NOT NULL DEFAULT 1,
  payload JSONB NOT NULL,
  metadata JSONB,
  actor_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_interview FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
  CONSTRAINT uq_interview_sequence UNIQUE (interview_id, sequence_number)
);

CREATE INDEX idx_events_interview ON interview_events(interview_id);
CREATE INDEX idx_events_type ON interview_events(event_type);
CREATE INDEX idx_events_created ON interview_events(created_at);

-- ─────────────────────────────────────────────
-- DECISIONS
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS interview_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL,
  recommendation VARCHAR(50) NOT NULL,
  global_confidence DECIMAL(3,2) NOT NULL,
  global_confidence_level VARCHAR(50),
  rationale JSONB NOT NULL,
  skill_assessments JSONB NOT NULL,
  key_strengths TEXT[],
  key_risks TEXT[],
  open_questions TEXT[],
  next_steps TEXT[],
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_decision_interview FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
);

CREATE INDEX idx_decisions_interview ON interview_decisions(interview_id);

-- ─────────────────────────────────────────────
-- AUDIT TRAIL
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  actor_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_audit_interview FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
);

CREATE INDEX idx_audit_interview ON audit_logs(interview_id);
CREATE INDEX idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- ─────────────────────────────────────────────
-- PROMPT REGISTRY
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS prompt_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL UNIQUE,
  version VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  template TEXT NOT NULL,
  variables JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_prompts_category ON prompt_registry(category);
CREATE INDEX idx_prompts_active ON prompt_registry(is_active);

-- ─────────────────────────────────────────────
-- COST TRACKING
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS llm_call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(200) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  prompt_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  cost DECIMAL(10,6) NOT NULL,
  latency_ms INTEGER NOT NULL,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_logs_session ON llm_call_logs(session_id);
CREATE INDEX idx_logs_provider ON llm_call_logs(provider);
CREATE INDEX idx_logs_created ON llm_call_logs(created_at);

-- ─────────────────────────────────────────────
-- ORGANIZATIONS (référence)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  plan VARCHAR(50) DEFAULT 'free',
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- USERS (référence)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'recruiter',
  permissions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_user_organization FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);

-- ─────────────────────────────────────────────
-- CANDIDATES (référence)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255),
  resume_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_candidate_organization FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE INDEX idx_candidates_organization ON candidates(organization_id);
