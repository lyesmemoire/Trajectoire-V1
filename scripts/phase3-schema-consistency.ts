/**
 * PHASE 3: Prisma/Database Schema Consistency
 * Compare Prisma schema with database schema
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

async function checkSchemaConsistency() {
  const prisma = new PrismaClient();

  try {
    console.log('=== PHASE 3: PRISMA/DATABASE SCHEMA CONSISTENCY ===\n');
    
    // Load inventory from Phase 2
    const inventoryPath = join(process.cwd(), 'SECURITY-FIX-004.3-SCHEMA-INVENTORY.json');
    const inventory = JSON.parse(readFileSync(inventoryPath, 'utf-8'));
    
    const dbTables = new Set(
      Array.isArray(inventory.tables) 
        ? inventory.tables.map((t: any) => t.table_name) 
        : []
    );
    
    // Prisma models from schema.prisma (extracted from the file)
    const prismaModels = [
      'User', 'CareerProfile', 'InterviewSession', 'AIUsageLog', 'Account',
      'AdminAuditLog', 'BehaviorEvent', 'BehavioralPattern', 'CVAnalysis',
      'InterviewEvent', 'ProcessedWebhook', 'PreviewAnalysis', 'PromptVersion',
      'PublicChallenge', 'PublicChallengeEntry', 'RecoveryEmailLog', 'Session',
      'Subscription', 'UserAnalytics', 'UserBehaviorProfile', 'UserPredictionSnapshot',
      'WaitlistEntry', 'PremiumInterviewSession', 'SimulationSession', 'CreditTransaction',
      'CreditUsage', 'StripeEvent', 'Idempotency', 'CvRewrite', 'Graph',
      'GraphNode', 'GraphEdge', 'GraphVersion', 'GraphSnapshot', 'DataLineage'
    ];
    
    // Map Prisma model names to expected DB table names
    const prismaToDbMap: Record<string, string> = {
      'User': 'User',
      'CareerProfile': 'CareerProfile',
      'InterviewSession': 'InterviewSession',
      'AIUsageLog': 'AIUsageLog',
      'Account': 'Account',
      'AdminAuditLog': 'AdminAuditLog',
      'BehaviorEvent': 'BehaviorEvent',
      'BehavioralPattern': 'BehavioralPattern',
      'CVAnalysis': 'CVAnalysis',
      'InterviewEvent': 'InterviewEvent',
      'ProcessedWebhook': 'ProcessedWebhook',
      'PreviewAnalysis': 'PreviewAnalysis',
      'PromptVersion': 'PromptVersion',
      'PublicChallenge': 'PublicChallenge',
      'PublicChallengeEntry': 'PublicChallengeEntry',
      'RecoveryEmailLog': 'RecoveryEmailLog',
      'Session': 'Session',
      'Subscription': 'Subscription',
      'UserAnalytics': 'UserAnalytics',
      'UserBehaviorProfile': 'UserBehaviorProfile',
      'UserPredictionSnapshot': 'UserPredictionSnapshot',
      'WaitlistEntry': 'WaitlistEntry',
      'PremiumInterviewSession': 'premium_interview_sessions',
      'SimulationSession': 'SimulationSession',
      'CreditTransaction': 'credit_transactions',
      'CreditUsage': 'credit_usage',
      'StripeEvent': 'stripe_events',
      'Idempotency': 'idempotency',
      'CvRewrite': 'cv_rewrites',
      'Graph': 'graphs',
      'GraphNode': 'graph_nodes',
      'GraphEdge': 'graph_edges',
      'GraphVersion': 'graph_versions',
      'GraphSnapshot': 'graph_snapshots',
      'DataLineage': 'data_lineage'
    };
    
    console.log('=== PRISMA MODELS WITHOUT DB TABLE ===');
    const missingInDb: string[] = [];
    for (const model of prismaModels) {
      const expectedTable = prismaToDbMap[model];
      if (!dbTables.has(expectedTable)) {
        console.log(`${model} -> ${expectedTable}: ❌ MISSING`);
        missingInDb.push(model);
      } else {
        console.log(`${model} -> ${expectedTable}: ✅ EXISTS`);
      }
    }
    
    console.log('\n=== DB TABLES WITHOUT PRISMA MODEL ===');
    const extraInDb: string[] = [];
    for (const table of dbTables) {
      const hasModel = Object.values(prismaToDbMap).includes(table as string);
      if (!hasModel) {
        console.log(`${table}: ❌ EXTRA (no Prisma model)`);
        extraInDb.push(table as string);
      }
    }
    
    const consistency = {
      prisma_models_count: prismaModels.length,
      db_tables_count: dbTables.size,
      missing_in_db: missingInDb,
      extra_in_db: extraInDb,
      status: missingInDb.length === 0 && extraInDb.length === 0 ? 'PASS' : 'FAIL'
    };
    
    console.log('\n=== CONSISTENCY SUMMARY ===');
    console.log(`Prisma Models: ${consistency.prisma_models_count}`);
    console.log(`DB Tables: ${consistency.db_tables_count}`);
    console.log(`Missing in DB: ${consistency.missing_in_db.length}`);
    console.log(`Extra in DB: ${consistency.extra_in_db.length}`);
    console.log(`Status: ${consistency.status}`);
    
    console.log('\n✅ PHASE 3 COMPLETE');
    
    return consistency;
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkSchemaConsistency();
