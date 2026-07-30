# Blueprint V3 Enterprise Executability Audit

**Date**: 2026-07-24T10:06:40.347Z
**Total Files**: 8326

## Scores

| Metric | Score | Status |
|--------|-------|--------|
| executability | 45.27% | ❌ Fair |
| compilation | 2.53% | 🔴 Poor |
| runtime | 42.73% | ❌ Fair |
| cognitive | 1.53% | 🔴 Poor |
| orchestration | 1.03% | 🔴 Poor |
| observability | 1.43% | 🔴 Poor |
| determinism | 0.94% | 🔴 Poor |

## File Categories

- **static**: 2496 files
- **compilable**: 211 files
- **executable**: 3558 files
- **documentary**: 48 files
- **unused**: 211 files
- **redundant**: 0 files
- **generated**: 2013 files

## Findings

⚠️ **WARNING**: High number of static files (2496) - consider making them compilable
❌ **ERROR**: 211 potentially unused files detected
🔴 **CRITICAL**: Low executability score (45.27%) - need more executable/compilable files
🔴 **CRITICAL**: Low compilation score (2.53%) - need more compilable files

## Detailed File Lists

### STATIC (2496 files)

Showing first 50 of 2496 files:

- .env.example
- .env.local
- .env.migrations
- .env.test
- ANALYTICS_EVENTS.md
- apply-premium-upgrade.ps1
- apps\api\nest-cli.json
- apps\api\package-lock.json
- apps\api\package.json
- apps\api\README.md
- apps\api\test\jest-e2e.json
- apps\api\tsconfig.build.json
- apps\api\tsconfig.json
- apps\api\tsconfig.test.json
- apps\realtime-gateway\ARCHITECTURE.md
- apps\realtime-gateway\package-lock.json
- apps\realtime-gateway\package.json
- apps\realtime-gateway\runtime-migration-checklist.md
- apps\realtime-gateway\src\voice-interview\ARCHITECTURE.md
- apps\realtime-gateway\tsconfig.json
- apps\realtime-gateway\tsconfig.test.json
- apps\web\.env.local
- apps\web\.env.local.txt
- apps\web\AGENTS.md
- apps\web\CLAUDE.md
- apps\web\debug-storybook.log
- apps\web\package-lock.json
- apps\web\package.json
- apps\web\public\file.svg
- apps\web\public\globe.svg
- apps\web\public\images\hero-professional old.webp
- apps\web\public\images\hero-professional.jpg
- apps\web\public\next.svg
- apps\web\public\vercel.svg
- apps\web\public\window.svg
- apps\web\README.md
- apps\web\SENTRY_ENV.md
- apps\web\src\app\favicon.ico
- apps\web\src\app\globals.css
- apps\web\src\core\p5\bridge\normalization-contract.d.ts.map
- apps\web\src\core\p5\bridge\normalization-contract.js.map
- apps\web\src\core\p5\bridge\normalize-decision.d.ts.map
- apps\web\src\core\p5\bridge\normalize-decision.js.map
- apps\web\src\core\p5\bridge\validation.d.ts.map
- apps\web\src\core\p5\bridge\validation.js.map
- apps\web\src\core\p5\execution-contract.d.ts.map
- apps\web\src\core\p5\execution-contract.js.map
- apps\web\src\core\p5\execution-engine.d.ts.map
- apps\web\src\core\p5\execution-engine.js.map
- apps\web\src\core\p5\integration\execution-facade.d.ts.map

### COMPILABLE (211 files)

Showing first 50 of 211 files:

- apps\api\src\app.controller.spec.ts
- apps\realtime-gateway\src\runtime\collector\tests\collector.test.ts
- apps\realtime-gateway\src\runtime\tests\infrastructure-purity.test.ts
- apps\realtime-gateway\src\runtime\tests\session-registry.test.ts
- apps\realtime-gateway\src\runtime\tests\stt-adapter.test.ts
- apps\realtime-gateway\src\runtime\tests\tts-adapter.test.ts
- apps\realtime-gateway\src\runtime\tests\ws-adapter.test.ts
- apps\realtime-gateway\src\voice-interview\core\strategies\munition-selector.test.ts
- apps\realtime-gateway\src\__tests__\composition-rules.test.ts
- apps\realtime-gateway\src\__tests__\integration-lifecycle.test.ts
- apps\realtime-gateway\src\__tests__\interviewer-brain.test.ts
- apps\realtime-gateway\src\__tests__\voice-orchestrator.test.ts
- apps\realtime-gateway\tests\runtime\kernel\causalChainIntegrity.test.ts
- apps\realtime-gateway\tests\runtime\kernel\mutationResistance.test.ts
- apps\realtime-gateway\tests\runtime\kernel\reducerIntegrity.test.ts
- apps\realtime-gateway\tests\runtime\kernel\replayCorruption.test.ts
- apps\realtime-gateway\tests\runtime\replay\replayDrift.test.ts
- apps\realtime-gateway\tests\runtime\serialization\canonicalSerialization.test.ts
- apps\realtime-gateway\tests\runtime\serialization\serializationEdgeCases.test.ts
- apps\web\src\core\p5\bridge\tests\event-batch.test.ts
- apps\web\src\core\p5\bridge\tests\normalize-decision.test.ts
- apps\web\src\core\p5\bridge\tests\validation.test.ts
- apps\web\src\core\p5\integration\tests\execution-facade.test.ts
- apps\web\src\core\p5\integration\tests\execution-session.test.ts
- apps\web\src\core\p5\integration\tests\governor-adapter.test.ts
- apps\web\src\core\p5\integration\tests\runtime-state-store.test.ts
- apps\web\src\core\p5\journal\tests\journal.test.ts
- apps\web\src\core\p5\journal\tests\replay-determinism.test.ts
- apps\web\src\core\p5\journal\tests\replay-verifier.test.ts
- apps\web\src\core\p5\journal\tests\replay.test.ts
- apps\web\src\core\p5\snapshot\tests\recovery.test.ts
- apps\web\src\core\p5\snapshot\tests\snapshot-hash.test.ts
- apps\web\src\core\p5\snapshot\tests\snapshot-immutability.test.ts
- apps\web\src\core\p5\snapshot\tests\snapshot-roundtrip.test.ts
- apps\web\src\core\p5\tests\clamping.test.ts
- apps\web\src\core\p5\tests\execution-engine.test.ts
- apps\web\src\core\p5\tests\immutability.test.ts
- apps\web\src\core\p5\tests\reduceMind.test.ts
- apps\web\src\core\p5\timeline\tests\append-tick.test.ts
- apps\web\src\core\p5\timeline\tests\timeline-replay.test.ts
- apps\web\src\core\p5\timeline\tests\timeline-verifier.test.ts
- apps\web\src\core\p5\timeline\tests\timeline-window.test.ts
- apps\web\src\core\p5\timeline\tests\timeline.test.ts
- apps\web\src\core\p5\transaction\tests\commit.test.ts
- apps\web\src\core\p5\transaction\tests\rollback.test.ts
- apps\web\src\core\p5\transaction\tests\transaction.test.ts
- apps\web\src\core\p5\transaction\tests\verifier.test.ts
- apps\web\src\core\p6\lifecycle\tests\reducer.test.ts
- apps\web\src\core\p6\orchestrator\tests\determinism.test.ts
- apps\web\src\core\p6\orchestrator\tests\failure-path.test.ts

### EXECUTABLE (3558 files)

Showing first 50 of 3558 files:

- .dockerignore
- .env
- .gitattributes
- .gitignore
- .npmrc
- apps\api\.prettierrc
- apps\api\eslint.config.mjs
- apps\api\src\app.controller.ts
- apps\api\src\app.module.ts
- apps\api\src\app.service.ts
- apps\api\src\common\events.ts
- apps\api\src\common\playback-queue.ts
- apps\api\src\common\session.types.ts
- apps\api\src\llm\providers\gemini.provider.ts
- apps\api\src\main.ts
- apps\api\src\orchestrator\fsm.engine.ts
- apps\api\src\orchestrator\handlers.ts
- apps\api\src\orchestrator\orchestrator.service.ts
- apps\api\src\session\session.manager.ts
- apps\api\src\voice\providers\asr\deepgram.provider.ts
- apps\api\src\voice\providers\tts\elevenlabs.provider.ts
- apps\api\test\app.e2e-spec.ts
- apps\realtime-gateway\.env
- apps\realtime-gateway\apps\realtime-gateway\src\interview\runtime\integrity\RuntimeAssertions.ts
- apps\realtime-gateway\apps\realtime-gateway\src\interview\runtime\integrity\SnapshotEquivalence.ts
- apps\realtime-gateway\apps\realtime-gateway\src\interview\runtime\replay\player\ReplayPlaybackEngine.ts
- apps\realtime-gateway\apps\realtime-gateway\src\interview\runtime\types\ConfidenceScore.ts
- apps\realtime-gateway\apps\realtime-gateway\src\interview\runtime\types\Milliseconds.ts
- apps\realtime-gateway\apps\realtime-gateway\src\interview\runtime\types\PipelineExecutionId.ts
- apps\realtime-gateway\apps\realtime-gateway\src\interview\runtime\types\runtime.ts
- apps\realtime-gateway\fix-imports.cjs
- apps\realtime-gateway\fix-stubs.cjs
- apps\realtime-gateway\replace-deep-freeze.cjs
- apps\realtime-gateway\scripts\benchmark-analyzer.ts
- apps\realtime-gateway\scripts\fix-core-imports.mjs
- apps\realtime-gateway\scripts\fix-imports.mjs
- apps\realtime-gateway\scripts\simulation\generate-dataset.ts
- apps\realtime-gateway\scripts\simulation\run-simulation.ts
- apps\realtime-gateway\scripts\stress-runtime.ts
- apps\realtime-gateway\scripts\test-cv-engine.ts
- apps\realtime-gateway\src\ai\deepgram.ts
- apps\realtime-gateway\src\ai\memory.ts
- apps\realtime-gateway\src\ai\openai.ts
- apps\realtime-gateway\src\ai\orchestrator.ts
- apps\realtime-gateway\src\ai\promptBuilder.ts
- apps\realtime-gateway\src\ai\responseStreamer.ts
- apps\realtime-gateway\src\ai\tts\openai.ts
- apps\realtime-gateway\src\ai\tts\provider.ts
- apps\realtime-gateway\src\config\env.ts
- apps\realtime-gateway\src\contracts\events.ts

### DOCUMENTARY (48 files)

- ADMIN_DASHBOARD_AUDIT.md
- ANALYSE_COMPOSANTS_UI.md
- ANALYSE_DECISION_ENGINE.md
- architecture\SPRINT2.5_AUDIT_CONVERSATIONSERVICE.md
- architecture\SPRINT2.5_AUDIT_QUOTASERVICE.md
- architecture\SPRINT2.5_AUDIT_REPORTSERVICE.md
- architecture\SPRINT2.5_AUDIT_SIMULATIONSERVICE.md
- architecture\SPRINT4_INDEX_AUDIT.md
- architecture\SPRINT4_N_PLUS_1_AUDIT.md
- architecture\SPRINT4_SQL_AUDIT.md
- architecture\SPRINT5_AUDIT_LOG.md
- architecture\SPRINT_PRODUIT4_4_SIMPLIFICATION_REPORT.md
- architecture\STRICT_AUDIT_ENTERPRISE.md
- ARCHITECTURE_CONSOLIDATION_REPORT.md
- AUDIT_COMPLET_2026.md
- AUDIT_COMPLET_CTO_2026.md
- AUDIT_DEPENDANCES_TSC.md
- AUDIT_GLOBAL_AVANCEMENT.md
- AUDIT_SOLIDITE.md
- BEA-011_ARCHITECTURE_CERTIFICATION_REPORT.md
- BEHAVIORAL_DRIFT_REPORT.md
- BLUEPRINT_PROOF_REPORT.md
- BLUEPRINT_V3_COMPILER_FINAL_REPORT.md
- CAREER_DNA_AUDIT.md
- CV_SUITE_AUDIT.md
- docs\AUDIT_360_PHASE_A_SYSTEM_MAP.md
- docs\AUDIT_360_PHASE_B_RUNTIME_FLOW.md
- docs\AUDIT_360_PHASE_C_OPENAI.md
- docs\AUDIT_360_PHASE_D_AUDIO.md
- docs\AUDIT_360_PHASE_E_DOMAIN.md
- docs\AUDIT_360_PHASE_F_EVENTS.md
- docs\AUDIT_360_PHASE_G_DATA.md
- docs\AUDIT_360_PHASE_H_PERFORMANCE.md
- docs\AUDIT_360_PHASE_I_SECURITY.md
- docs\AUDIT_360_PHASE_J_TECHNICAL.md
- docs\AUDIT_PHASE0_EXISTING.md
- DUPLICATION_REPORT.md
- GLOBAL_ARCHITECTURE_AUDIT.md
- GLOBAL_DUPLICATION_REPORT.md
- HOME_PAGE_CTA_AUDIT.md
- MARKETING_CLEANUP_REPORT.md
- PRE_LAUNCH_AUDIT.md
- RAPPORT_ANALYSE_UX.md
- RECOVERY_VALIDATION_REPORT.md
- REFACTORING_REPORT.md
- REFERRAL_AUDIT.md
- REPLAY_AUDIT.md
- STRIPE_CREDITS_AUDIT.md

### UNUSED (211 files)

Showing first 50 of 211 files:

- apps\api\src\app.controller.spec.ts
- apps\realtime-gateway\src\runtime\collector\tests\collector.test.ts
- apps\realtime-gateway\src\runtime\tests\infrastructure-purity.test.ts
- apps\realtime-gateway\src\runtime\tests\session-registry.test.ts
- apps\realtime-gateway\src\runtime\tests\stt-adapter.test.ts
- apps\realtime-gateway\src\runtime\tests\tts-adapter.test.ts
- apps\realtime-gateway\src\runtime\tests\ws-adapter.test.ts
- apps\realtime-gateway\src\voice-interview\core\strategies\munition-selector.test.ts
- apps\realtime-gateway\src\__tests__\composition-rules.test.ts
- apps\realtime-gateway\src\__tests__\integration-lifecycle.test.ts
- apps\realtime-gateway\src\__tests__\interviewer-brain.test.ts
- apps\realtime-gateway\src\__tests__\voice-orchestrator.test.ts
- apps\realtime-gateway\tests\runtime\kernel\causalChainIntegrity.test.ts
- apps\realtime-gateway\tests\runtime\kernel\mutationResistance.test.ts
- apps\realtime-gateway\tests\runtime\kernel\reducerIntegrity.test.ts
- apps\realtime-gateway\tests\runtime\kernel\replayCorruption.test.ts
- apps\realtime-gateway\tests\runtime\replay\replayDrift.test.ts
- apps\realtime-gateway\tests\runtime\serialization\canonicalSerialization.test.ts
- apps\realtime-gateway\tests\runtime\serialization\serializationEdgeCases.test.ts
- apps\web\src\core\p5\bridge\tests\event-batch.test.ts
- apps\web\src\core\p5\bridge\tests\normalize-decision.test.ts
- apps\web\src\core\p5\bridge\tests\validation.test.ts
- apps\web\src\core\p5\integration\tests\execution-facade.test.ts
- apps\web\src\core\p5\integration\tests\execution-session.test.ts
- apps\web\src\core\p5\integration\tests\governor-adapter.test.ts
- apps\web\src\core\p5\integration\tests\runtime-state-store.test.ts
- apps\web\src\core\p5\journal\tests\journal.test.ts
- apps\web\src\core\p5\journal\tests\replay-determinism.test.ts
- apps\web\src\core\p5\journal\tests\replay-verifier.test.ts
- apps\web\src\core\p5\journal\tests\replay.test.ts
- apps\web\src\core\p5\snapshot\tests\recovery.test.ts
- apps\web\src\core\p5\snapshot\tests\snapshot-hash.test.ts
- apps\web\src\core\p5\snapshot\tests\snapshot-immutability.test.ts
- apps\web\src\core\p5\snapshot\tests\snapshot-roundtrip.test.ts
- apps\web\src\core\p5\tests\clamping.test.ts
- apps\web\src\core\p5\tests\execution-engine.test.ts
- apps\web\src\core\p5\tests\immutability.test.ts
- apps\web\src\core\p5\tests\reduceMind.test.ts
- apps\web\src\core\p5\timeline\tests\append-tick.test.ts
- apps\web\src\core\p5\timeline\tests\timeline-replay.test.ts
- apps\web\src\core\p5\timeline\tests\timeline-verifier.test.ts
- apps\web\src\core\p5\timeline\tests\timeline-window.test.ts
- apps\web\src\core\p5\timeline\tests\timeline.test.ts
- apps\web\src\core\p5\transaction\tests\commit.test.ts
- apps\web\src\core\p5\transaction\tests\rollback.test.ts
- apps\web\src\core\p5\transaction\tests\transaction.test.ts
- apps\web\src\core\p5\transaction\tests\verifier.test.ts
- apps\web\src\core\p6\lifecycle\tests\reducer.test.ts
- apps\web\src\core\p6\orchestrator\tests\determinism.test.ts
- apps\web\src\core\p6\orchestrator\tests\failure-path.test.ts

### REDUNDANT (0 files)


### GENERATED (2013 files)

Showing first 50 of 2013 files:

- BLUEPRINT_GENERATED\BLUEPRINT_MANIFEST.json
- BLUEPRINT_GENERATED\generated-interfaces\Adaptation.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Adaptation.ts
- BLUEPRINT_GENERATED\generated-interfaces\Answer.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Answer.ts
- BLUEPRINT_GENERATED\generated-interfaces\Artifact.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Artifact.ts
- BLUEPRINT_GENERATED\generated-interfaces\Belief.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Belief.ts
- BLUEPRINT_GENERATED\generated-interfaces\Budget.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Budget.ts
- BLUEPRINT_GENERATED\generated-interfaces\Capability.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Capability.ts
- BLUEPRINT_GENERATED\generated-interfaces\CognitiveGuarantee.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\CognitiveGuarantee.ts
- BLUEPRINT_GENERATED\generated-interfaces\CognitiveMathematics.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\CognitiveMathematics.ts
- BLUEPRINT_GENERATED\generated-interfaces\CognitiveMetric.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\CognitiveMetric.ts
- BLUEPRINT_GENERATED\generated-interfaces\CognitiveStateMachine.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\CognitiveStateMachine.ts
- BLUEPRINT_GENERATED\generated-interfaces\Command.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Command.ts
- BLUEPRINT_GENERATED\generated-interfaces\Confidence.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Confidence.ts
- BLUEPRINT_GENERATED\generated-interfaces\Context.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Context.ts
- BLUEPRINT_GENERATED\generated-interfaces\Conversation.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Conversation.ts
- BLUEPRINT_GENERATED\generated-interfaces\Decision.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Decision.ts
- BLUEPRINT_GENERATED\generated-interfaces\Edge.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Edge.ts
- BLUEPRINT_GENERATED\generated-interfaces\Evidence.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Evidence.ts
- BLUEPRINT_GENERATED\generated-interfaces\Execution.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Execution.ts
- BLUEPRINT_GENERATED\generated-interfaces\FeatureFlag.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\FeatureFlag.ts
- BLUEPRINT_GENERATED\generated-interfaces\Hypothesis.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Hypothesis.ts
- BLUEPRINT_GENERATED\generated-interfaces\Knowledge.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Knowledge.ts
- BLUEPRINT_GENERATED\generated-interfaces\Memory.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Memory.ts
- BLUEPRINT_GENERATED\generated-interfaces\MetaReasoning.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\MetaReasoning.ts
- BLUEPRINT_GENERATED\generated-interfaces\Node.schema.json
- BLUEPRINT_GENERATED\generated-interfaces\Node.ts
- BLUEPRINT_GENERATED\generated-interfaces\Observation.schema.json

