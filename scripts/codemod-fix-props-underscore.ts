#!/usr/bin/env tsx
/**
 * Codemod pour corriger les erreurs Props_Underscore
 * 
 * Ce script corrige automatiquement:
 * - _Props → Props
 * - _onClick → onClick
 * - _onFile → onFile
 * - _onChange → onChange
 * - _onContinue → onContinue
 * - _onSelect → onSelect
 * - _aiCredits → aiCredits
 * - _previous → previous
 * - _isLoading → isLoading
 * - _disabled → disabled
 * - _diff → diff
 * - _score → score
 * - _events → events
 * - _to → to
 * - _status → status
 * - _className → className
 * - _credits → credits
 * - _dashboardLink → dashboardLink
 * - _magicLink → magicLink
 * - _number → number
 * - _string → string
 * - _unknown → unknown
 * - _null → null
 * - _undefined → undefined
 * - _Buffer → Buffer
 * - _Float32Array → Float32Array
 * - _VoiceSignals → VoiceSignals
 * - _EvaluationContext → EvaluationContext
 * - _TrackAIUsageInput → TrackAIUsageInput
 * - _ExplanationGraph → ExplanationGraph
 * - _ReportInput → ReportInput
 * - _ReportSummary → ReportSummary
 * - _GovernorDecision → GovernorDecision
 * - _MindState → MindState
 * - _MindSnapshot → MindSnapshot
 * - _RuntimeDecision → RuntimeDecision
 * - _Transaction → Transaction
 * - _Timeline → Timeline
 * - _VoiceExecutionPlan → VoiceExecutionPlan
 * - _CohortStats → CohortStats
 * - _RiskScoreInput → RiskScoreInput
 * - _RuminationInput → RuminationInput
 * - _FrequencyGuardInput → FrequencyGuardInput
 * - _EmailTemplateParams → EmailTemplateParams
 * - _RiskScoreOutput → RiskScoreOutput
 * - _RecoveryEmailInput → RecoveryEmailInput
 * - _LLMTrace → LLMTrace
 * - _AnswerAnalysis → AnswerAnalysis
 * - _InterviewStyle → InterviewStyle
 * - _PremiumInterviewSession → PremiumInterviewSession
 * - _InterruptionSignals → InterruptionSignals
 * - _InterviewPhase → InterviewPhase
 * - _ReturnScoreInput → ReturnScoreInput
 * - _ShutdownOptions → ShutdownOptions
 * - _IdentityCardData → IdentityCardData
 * - _RawSignal → RawSignal
 * - _Job → Job
 * - _BillingState → BillingState
 * - _LogLevel → LogLevel
 * - _Error → Error
 * - _AnalyticsEvent → AnalyticsEvent
 * - _ScoreProfile → ScoreProfile
 * - _InteractionSignals → InteractionSignals
 * - _IntegritySignals → IntegritySignals
 * - _RawSignals → RawSignals
 * - _1200 → 1200
 * - _Compunknown → Compunknown
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const WEB_DIR = path.join(ROOT, 'apps', 'web', 'src');

// Mapping des corrections
const corrections: Record<string, string> = {
  '_Props': 'Props',
  '_onClick': 'onClick',
  '_onFile': 'onFile',
  '_onChange': 'onChange',
  '_onContinue': 'onContinue',
  '_onSelect': 'onSelect',
  '_aiCredits': 'aiCredits',
  '_previous': 'previous',
  '_isLoading': 'isLoading',
  '_disabled': 'disabled',
  '_diff': 'diff',
  '_score': 'score',
  '_events': 'events',
  '_to': 'to',
  '_status': 'status',
  '_className': 'className',
  '_credits': 'credits',
  '_dashboardLink': 'dashboardLink',
  '_magicLink': 'magicLink',
  '_number': 'number',
  '_string': 'string',
  '_unknown': 'unknown',
  '_null': 'null',
  '_undefined': 'undefined',
  '_Buffer': 'Buffer',
  '_Float32Array': 'Float32Array',
  '_VoiceSignals': 'VoiceSignals',
  '_EvaluationContext': 'EvaluationContext',
  '_TrackAIUsageInput': 'TrackAIUsageInput',
  '_ExplanationGraph': 'ExplanationGraph',
  '_ReportInput': 'ReportInput',
  '_ReportSummary': 'ReportSummary',
  '_GovernorDecision': 'GovernorDecision',
  '_MindState': 'MindState',
  '_MindSnapshot': 'MindSnapshot',
  '_RuntimeDecision': 'RuntimeDecision',
  '_Transaction': 'Transaction',
  '_Timeline': 'Timeline',
  '_VoiceExecutionPlan': 'VoiceExecutionPlan',
  '_CohortStats': 'CohortStats',
  '_RiskScoreInput': 'RiskScoreInput',
  '_RuminationInput': 'RuminationInput',
  '_FrequencyGuardInput': 'FrequencyGuardInput',
  '_EmailTemplateParams': 'EmailTemplateParams',
  '_RiskScoreOutput': 'RiskScoreOutput',
  '_RecoveryEmailInput': 'RecoveryEmailInput',
  '_LLMTrace': 'LLMTrace',
  '_AnswerAnalysis': 'AnswerAnalysis',
  '_InterviewStyle': 'InterviewStyle',
  '_PremiumInterviewSession': 'PremiumInterviewSession',
  '_InterruptionSignals': 'InterruptionSignals',
  '_InterviewPhase': 'InterviewPhase',
  '_ReturnScoreInput': 'ReturnScoreInput',
  '_ShutdownOptions': 'ShutdownOptions',
  '_IdentityCardData': 'IdentityCardData',
  '_RawSignal': 'RawSignal',
  '_Job': 'Job',
  '_BillingState': 'BillingState',
  '_LogLevel': 'LogLevel',
  '_Error': 'Error',
  '_AnalyticsEvent': 'AnalyticsEvent',
  '_ScoreProfile': 'ScoreProfile',
  '_InteractionSignals': 'InteractionSignals',
  '_IntegritySignals': 'IntegritySignals',
  '_RawSignals': 'RawSignals',
  '_1200': '1200',
  '_Compunknown': 'Compunknown',
};

async function main() {
  console.log('🔧 Codemod Props_Underscore - Correction automatique');
  console.log('📁 Répertoire:', WEB_DIR);
  console.log('');

  // Trouver tous les fichiers TypeScript/TSX
  const files = await glob('**/*.{ts,tsx}', {
    cwd: WEB_DIR,
    absolute: true,
  });

  console.log(`📊 ${files.length} fichiers trouvés`);
  console.log('');

  let totalCorrections = 0;
  let filesModified = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;
    let fileCorrections = 0;

    // Appliquer toutes les corrections
    for (const [from, to] of Object.entries(corrections)) {
      const regex = new RegExp(`\\b${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, to);
        fileCorrections += matches.length;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf-8');
      filesModified++;
      totalCorrections += fileCorrections;
      console.log(`✅ ${path.relative(WEB_DIR, file)}: ${fileCorrections} corrections`);
    }
  }

  console.log('');
  console.log('📈 Résumé:');
  console.log(`   Fichiers modifiés: ${filesModified}`);
  console.log(`   Corrections totales: ${totalCorrections}`);
  console.log('');
  console.log('✨ Codemod terminé avec succès');
}

main().catch(console.error);
