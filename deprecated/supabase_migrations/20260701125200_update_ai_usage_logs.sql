-- ✅ Ajout colonnes observabilité ATS V2

ALTER TABLE public.ai_usage_logs
ADD COLUMN IF NOT EXISTS feature TEXT;

ALTER TABLE public.ai_usage_logs
ADD COLUMN IF NOT EXISTS status TEXT;

ALTER TABLE public.ai_usage_logs
ADD COLUMN IF NOT EXISTS plan_type TEXT;

ALTER TABLE public.ai_usage_logs
ADD COLUMN IF NOT EXISTS error_code TEXT;

ALTER TABLE public.ai_usage_logs
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- ✅ Index pour analytics rapides
CREATE INDEX IF NOT EXISTS idx_ai_usage_feature
ON public.ai_usage_logs(feature);

CREATE INDEX IF NOT EXISTS idx_ai_usage_status
ON public.ai_usage_logs(status);

CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at
ON public.ai_usage_logs(created_at);
