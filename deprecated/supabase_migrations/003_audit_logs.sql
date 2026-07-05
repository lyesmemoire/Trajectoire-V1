-- ============================================================
-- Migration: 003_audit_logs.sql
-- Description: Create audit_logs table for security and fraud detection
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- peut être null si fail signup
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour des recherches rapides
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON audit_logs(ip_address);

-- RLS: Seulement le service_role peut lire/écrire
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Pas de policy pour les utilisateurs anonymes ou authentifiés
-- afin de s'assurer que seuls les process backend (Service Role) peuvent y toucher
