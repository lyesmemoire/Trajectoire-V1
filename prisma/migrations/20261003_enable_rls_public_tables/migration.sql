-- Migration : activer la RLS sur les tables de l'application (audit CTO du 2026-10-02)
--
-- Problème : "CVAnalysis" (texte des CV) n'avait pas de RLS et le rôle `authenticated` y avait
-- un droit SELECT : tout compte connecté pouvait lire les analyses de TOUS les utilisateurs via
-- l'API REST publique de Supabase (/rest/v1/CVAnalysis).
--
-- Correctif :
--   1. "CVAnalysis" : RLS + politique « chacun ne lit que ses lignes ». Le droit SELECT est
--      conservé exprès : UnifiedInterviewContextService lit "CVAnalysis" avec le client Supabase
--      de l'utilisateur (rôle `authenticated`), filtré sur son propre userId.
--   2. Les 41 autres tables de `public` sans RLS : RLS activée SANS politique (refus par défaut
--      pour `anon` et `authenticated`). Aucun de ces rôles n'y a de droit aujourd'hui (vérifié
--      avec has_table_privilege), donc aucun changement de comportement : c'est un verrou de
--      défense en profondeur contre un futur GRANT accidentel.
--
-- Sans effet sur l'application : Prisma se connecte avec `postgres` (BYPASSRLS = true) et le client
-- service Supabase avec `service_role` (BYPASSRLS = true). Les deux ignorent la RLS.
-- Idempotente : ENABLE ROW LEVEL SECURITY peut être rejouée, la politique est recréée.
--
-- Retour arrière (à ne lancer que sur décision explicite) :
--   DROP POLICY IF EXISTS "cvanalysis_select_own" ON public."CVAnalysis";
--   ALTER TABLE public."CVAnalysis" DISABLE ROW LEVEL SECURITY;   -- et idem pour les autres tables

-- 1. CVAnalysis : lecture de ses propres analyses uniquement -----------------------------------
ALTER TABLE public."CVAnalysis" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cvanalysis_select_own" ON public."CVAnalysis";
CREATE POLICY "cvanalysis_select_own"
  ON public."CVAnalysis"
  FOR SELECT
  TO authenticated
  USING ("userId" = (SELECT auth.uid())::text);

-- 2. Autres tables : RLS activée, aucune politique (refus par défaut) --------------------------
ALTER TABLE public."AIUsageLog"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Account"                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AdminAuditLog"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."BehaviorEvent"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."BehavioralPattern"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CareerProfile"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."InterviewEvent"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."InterviewSession"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PreviewAnalysis"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ProcessedWebhook"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PromptVersion"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PublicChallenge"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PublicChallengeEntry"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."RecoveryEmailLog"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Session"                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SimulationSession"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Subscription"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."UserAnalytics"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."UserBehaviorProfile"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."UserPredictionSnapshot"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."UserPurchase"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."WaitlistEntry"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."_prisma_migrations"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_workspaces     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_memories            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_stories             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_rewrites                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_lineage               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovered_jobs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_sources          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graph_edges                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graph_nodes                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graph_snapshots            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graph_versions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graphs                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idempotency                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_memories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_stories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_events              ENABLE ROW LEVEL SECURITY;
