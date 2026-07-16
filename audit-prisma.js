import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function auditPrisma() {
  console.log('=== PHASE 1 — AUDIT PRISMA ===\n');
  
  // Models from schema.prisma (public schema)
  const publicModels = [
    'User',
    'CareerProfile',
    'InterviewSession',
    'AIUsageLog',
    'Account',
    'AdminAuditLog',
    'BehaviorEvent',
    'BehavioralPattern',
    'CVAnalysis',
    'InterviewEvent',
    'PublicChallenge',
    'PublicChallengeEntry',
    'RecoveryEmailLog',
    'Session',
    'Subscription',
    'UserBehaviorProfile',
    'UserPredictionSnapshot',
    'WaitlistEntry',
    'ProcessedWebhook',
    'ResumeRewriteHistory',
    'ResumeVersion',
    'UserAnalytics',
    'admin_actions_log',
    'ai_cache',
    'ai_usage_logs',
    'ai_usage_stats',
    'api_rate_limits',
    'arena_events',
    'ats_analyses',
    'audit_logs',
    'credit_ledger',
    'credit_reservations',
    'cv_embeddings',
    'cvs',
    'dashboard_summary',
    'interview_sessions',
    'ip_activity',
    'organizations',
    'premium_interview_sessions',
    'profiles',
    'prompt_versions',
    'resumes',
    'stripe_events',
    'transactions',
    'user_devices',
    'user_risk_scores',
    'user_usage'
  ];

  // Models from schema.prisma (auth schema)
  const authModels = [
    'audit_log_entries',
    'custom_oauth_providers',
    'flow_state',
    'identities',
    'instances',
    'mfa_amr_claims',
    'mfa_challenges',
    'mfa_factors',
    'oauth_authorizations',
    'oauth_client_states',
    'oauth_clients',
    'oauth_consents',
    'one_time_tokens',
    'refresh_tokens',
    'saml_providers',
    'saml_relay_states',
    'schema_migrations',
    'sessions',
    'sso_domains',
    'sso_providers',
    'users',
    'webauthn_challenges',
    'webauthn_credentials'
  ];

  console.log('=== PUBLIC SCHEMA ===\n');
  console.log('Model Prisma\tTable SQL\tExiste\tRelations\tFK\tIndex\tEnum');
  
  for (const model of publicModels) {
    const tableName = model.toLowerCase();
    try {
      const result = await prisma.$queryRaw`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
      `;
      const exists = result[0].count > 0;
      console.log(`${model}\t${tableName}\t${exists ? '✅' : '❌'}\t-\t-\t-\t-`);
    } catch (error) {
      console.log(`${model}\t${tableName}\t❌ ERROR\t-\t-\t-\t-`);
    }
  }

  console.log('\n=== AUTH SCHEMA ===\n');
  console.log('Model Prisma\tTable SQL\tExiste\tRelations\tFK\tIndex\tEnum');
  
  for (const model of authModels) {
    const tableName = model.toLowerCase();
    try {
      const result = await prisma.$queryRaw`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'auth' 
        AND table_name = ${tableName}
      `;
      const exists = result[0].count > 0;
      console.log(`${model}\t${tableName}\t${exists ? '✅' : '❌'}\t-\t-\t-\t-`);
    } catch (error) {
      console.log(`${model}\t${tableName}\t❌ ERROR\t-\t-\t-\t-`);
    }
  }

  await prisma.$disconnect();
}

auditPrisma();
