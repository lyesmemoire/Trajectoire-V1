-- SIL v1.0 — PostgreSQL Schema Initialization
-- This script runs automatically on first container boot.

-- ============================================
-- 1. EVENTS TABLE (EventStore — Source of Truth)
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  tenant_id    TEXT NOT NULL,
  session_id   TEXT NOT NULL,
  event_id     TEXT NOT NULL,
  sequence     BIGINT NOT NULL DEFAULT 0,
  type         TEXT NOT NULL DEFAULT 'UNKNOWN',
  payload      JSONB,
  hash         TEXT NOT NULL,
  previous_hash TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (tenant_id, session_id, sequence),
  UNIQUE (tenant_id, session_id, event_id)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_events_session
  ON events (tenant_id, session_id, sequence);

CREATE INDEX IF NOT EXISTS idx_events_lookup
  ON events (tenant_id, session_id, event_id);

CREATE INDEX IF NOT EXISTS idx_events_created_at
  ON events (created_at);


-- ============================================
-- 2. LEDGER BATCHES TABLE (Merkle Audit Layer)
-- ============================================
CREATE TABLE IF NOT EXISTS ledger_batches (
  batch_id        TEXT PRIMARY KEY,
  tenant_id       TEXT,
  session_id      TEXT,
  start_sequence  BIGINT NOT NULL,
  end_sequence    BIGINT NOT NULL,
  root_hash       TEXT NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ledger_range
  ON ledger_batches (start_sequence, end_sequence);

CREATE INDEX IF NOT EXISTS idx_ledger_session
  ON ledger_batches (tenant_id, session_id);


-- ============================================
-- 3. CHECKPOINTS TABLE (Snapshot Recovery)
-- ============================================
CREATE TABLE IF NOT EXISTS checkpoints (
  tenant_id    TEXT NOT NULL,
  session_id   TEXT NOT NULL,
  last_sequence BIGINT NOT NULL,
  state        JSONB,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (tenant_id, session_id)
);
