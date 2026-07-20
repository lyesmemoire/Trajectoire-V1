-- Table pour le monitoring persistant
CREATE TABLE IF NOT EXISTS public.ai_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  latency_ms INTEGER NOT NULL,
  prompt_tokens INTEGER NOT NULL,
  completion_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  model TEXT NOT NULL,
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les erreurs
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour l'audit trail
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les quotas utilisateur
CREATE TABLE IF NOT EXISTS public.user_quotas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  quota_type TEXT NOT NULL,
  quota_limit INTEGER NOT NULL,
  quota_used INTEGER NOT NULL DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_metrics_user_id ON public.ai_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_metrics_created_at ON public.ai_metrics(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_user_quotas_user_id ON public.user_quotas(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quotas_period ON public.user_quotas(period_start, period_end);

-- RLS
ALTER TABLE public.ai_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quotas ENABLE ROW LEVEL SECURITY;

-- Politiques AI Metrics
CREATE POLICY "Users can view own metrics" ON public.ai_metrics
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can insert metrics" ON public.ai_metrics
  FOR INSERT WITH CHECK (true);

-- Politiques Error Logs
CREATE POLICY "Users can view own errors" ON public.error_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can insert errors" ON public.error_logs
  FOR INSERT WITH CHECK (true);

-- Politiques Audit Log
CREATE POLICY "Users can view own audit logs" ON public.audit_log
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can insert audit logs" ON public.audit_log
  FOR INSERT WITH CHECK (true);

-- Politiques User Quotas
CREATE POLICY "Users can view own quotas" ON public.user_quotas
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can manage quotas" ON public.user_quotas
  FOR ALL USING (true) WITH CHECK (true);
