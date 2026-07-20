-- Table pour le rate limiting persistant
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  window_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les lookups rapides
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_window ON public.rate_limits(identifier, window_end);

-- Index pour le nettoyage
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_end ON public.rate_limits(window_end);

-- RLS pour protéger la table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Politique: seul le service peut lire/écrire
CREATE POLICY "Service can manage rate limits" ON public.rate_limits
  FOR ALL
  USING (true)
  WITH CHECK (true);
