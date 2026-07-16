# AI Component Classification

## Overview

This document classifies all AI components in Trajectoire into distinct families based on their architectural patterns, input/output characteristics, and use cases.

**Purpose**: Provide clear governance for AI component architecture  
**Status**: Official Classification  
**Version**: 1.0  

---

## Taxonomy

### Family 1: Conversational Domain

**Pattern**: Chat-based interaction with streaming responses

**Characteristics**:
- useChat integration
- Streaming responses (AsyncGenerator)
- Route handler (HTTP boundary)
- Message + history input
- Interactive UI
- Server-only protection

**Input**: Message + history + context  
**Output**: Streaming text + metadata  
**Streaming**: ✅ Yes  
**Conversation**: ✅ Yes  
**Background**: ❌ No  
**Server-only**: ✅ Yes  
**Provider**: LLM Provider Port (ai-core)  
**Standard**: AI Domain Standard  

**Components**:
- ✅ Career Copilot (migrated)
- ✅ Interview (migrated)

**Note**: Learning is not an independent AI domain. It is a presentational component within the Digital Twin domain. Daily Coach is an Intelligence Engine, not a Conversational Domain. Planning is an Intelligence Engine, not a Conversational Domain.

---

### Family 2: Intelligence Engine

**Pattern**: Synchronous analysis with structured input/output

**Characteristics**:
- Synchronous operation (not streaming)
- Structured business input (CandidateGraph, etc.)
- Structured JSON output
- Uses aiOrchestrator
- Uses CandidateAIBrain
- Uses EventBus
- No streaming
- No useChat

**Input**: Structured data (CandidateGraph, events, etc.)  
**Output**: Structured JSON (analysis, forecast, etc.)  
**Streaming**: ❌ No  
**Conversation**: ❌ No  
**Background**: ❌ No  
**Server-only**: ✅ Yes  
**Provider**: aiOrchestrator (OpenAI GPT-4)  
**Standard**: Intelligence Engine Standard (to be defined)  

**Components**:
- ❌ ATSAIEngine (ATS analysis)
- ❌ DailyCoachAIEngine (daily coaching)
- ❌ CareerCopilotPlanningIntelligenceEngine (planning intelligence)
- ❌ CareerCopilotProgressionPlanEngine (progression plan)
- ❌ ActionPlanAIEngine (action plan)
- ❌ CareerCopilotForecastEngine (forecast analysis)
- ❌ CareerCopilotMarketIntelligenceEngine (market trends)
- ❌ CareerCopilotEvidenceIntelligenceEngine (evidence validation)
- ❌ CareerCopilotResourceIntelligenceEngine (resource analysis)
- ❌ CareerCopilotScenarioIntelligenceEngine (scenario simulation)
- ❌ CareerCopilotSuccessIntelligenceEngine (success optimization)
- ❌ CareerCopilotConstraintIntelligenceEngine (constraint analysis)
- ❌ CareerCopilotOutcomeIntelligenceEngine (outcome prediction)
- ❌ CareerCopilotDigitalTwinEngine (digital twin modeling)
- ❌ CareerCopilotGoalIntelligenceEngine (goal tracking)
- ❌ CareerCopilotApplicationIntelligenceEngine (application analysis)
- ❌ CareerCopilotOpportunityIntelligenceEngine (opportunity detection)
- ❌ CareerCopilotDecisionIntelligenceEngine (decision support)
- ❌ CareerCopilotAdaptiveStrategyEngine (strategy adaptation)
- ❌ CareerCopilotMissionIntelligenceEngine (mission alignment)
- ❌ CareerCopilotNarrativeIntelligenceEngine (narrative construction)
- ❌ CareerCopilotCoachingIntelligenceEngine (coaching recommendations)
- ❌ CareerCopilotExecutionIntelligenceEngine (execution tracking)
- ❌ CareerCopilotGapIntelligenceEngine (gap analysis)
- ❌ CareerCopilotPersonalizationIntelligenceEngine (personalization)
- ❌ CareerCopilotReflectionIntelligenceEngine (reflection analysis)
- ❌ CareerCopilotTransferableSkillsIntelligenceEngine (skill transfer)
- ❌ CareerCopilotAutonomousIntelligenceEngine (autonomous behavior)
- ❌ CareerCopilotKnowledgeEvolutionEngine (knowledge tracking)

**Total**: 29+ intelligence engines

---

### Family 3: Background Agent

**Pattern**: Autonomous, scheduled, event-driven automation

**Characteristics**:
- Autonomous execution
- Scheduled or event-triggered
- Event Bus integration
- No user interaction
- Background processing
- Server-only

**Input**: Events, schedules, triggers  
**Output**: Actions, state updates, notifications  
**Streaming**: ❌ No  
**Conversation**: ❌ No  
**Background**: ✅ Yes  
**Server-only**: ✅ Yes  
**Provider**: Various (depends on agent)  
**Standard**: Background Agent Standard (to be defined)  

**Components**:
- ❌ behavior.agent.ts (behavior tracking)
- ❌ billing.agent.ts (billing automation)
- ❌ interview.agent.ts (interview automation)

**Total**: 3 agents

---

### Family 4: Decision Engine

**Pattern**: Rule-based scoring and recommendations

**Characteristics**:
- Rule-based logic
- Score calculation
- Recommendation generation
- No AI/LLM required
- Deterministic output
- Pure TypeScript

**Input**: Profile, job, interview data  
**Output**: Scores, recommendations, decisions  
**Streaming**: ❌ No  
**Conversation**: ❌ No  
**Background**: ❌ No  
**Server-only**: ✅ Yes  
**Provider**: None (rule-based)  
**Standard**: Decision Engine Standard (to be defined)  

**Components**:
- ❌ careerEngine.ts (career progression logic)
- ❌ candidateProfile.ts (profile management)
- ❌ careerAnalysisAIEngine.ts (analysis logic)
- ❌ scoreEngine (score calculation)
- ❌ coachEngine (coaching logic)
- ❌ recommendationEngine (recommendations)
- ❌ progressEngine (progress tracking)
- ❌ insightEngine (insight generation)
- ❌ decisionEngine (decision logic)
- ❌ memoryEngine (memory tracking)

**Total**: 10+ decision engines

---

### Family 5: Knowledge Service

**Pattern**: Embeddings, search, vector store operations

**Characteristics**:
- Vector embeddings
- Semantic search
- RAG (Retrieval-Augmented Generation)
- Vector store operations
- Knowledge retrieval

**Input**: Queries, documents, text  
**Output**: Embeddings, search results, retrieved context  
**Streaming**: ❌ No  
**Conversation**: ❌ No  
**Background**: ❌ No  
**Server-only**: ✅ Yes  
**Provider**: Embedding Provider Port  
**Standard**: Knowledge Service Standard (to be defined)  

**Components**:
- ❌ embedding-provider.port.ts (embedding interface)
- ❌ rag.ts (RAG implementation)
- ❌ track-skills.ts (skill tracking with embeddings)

**Total**: 3 knowledge services

---

### Family 6: AI Infrastructure

**Pattern**: Shared AI infrastructure and utilities

**Characteristics**:
- Shared ports and adapters
- AI SDK integration
- Streaming utilities
- Caching and optimization
- Not domain-specific

**Input**: Various (depends on component)  
**Output**: Various (depends on component)  
**Streaming**: ✅ Some  
**Conversation**: ❌ No  
**Background**: ❌ No  
**Server-only**: ✅ Yes  
**Provider**: Various  
**Standard**: AI Infrastructure Standard (implicit)  

**Components**:
- ✅ ai-core (shared abstractions)
- ❌ llm-provider.port.ts (LLM interface)
- ❌ streaming-provider.port.ts (streaming interface)
- ❌ moderation-provider.port.ts (moderation interface)
- ❌ stream.adapter.ts (stream adapter)
- ❌ cache.ts (caching)
- ❌ chunker.ts (text chunking)
- ❌ trimmer.ts (text trimming)

**Total**: 8 infrastructure components

---

## Classification Matrix

| Component | Family | Input | Output | Streaming | Conversation | Background | Server-only | Provider | Standard |
|-----------|--------|-------|--------|-----------|--------------|------------|------------|----------|----------|
| Career Copilot | Conversational Domain | Message + history | Streaming text | ✅ | ✅ | ❌ | ✅ | LLM Provider Port | AI Domain Standard |
| Interview | Conversational Domain | Message + history | Streaming text | ✅ | ✅ | ❌ | ✅ | LLM Provider Port | AI Domain Standard |
| Planning Intelligence Engine | Intelligence Engine | CandidateGraph + brain | JSON planning | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Progression Plan Engine | Intelligence Engine | CandidateGraph + brain | JSON progression | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Action Plan Engine | Intelligence Engine | CandidateGraph + brain | JSON actions | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Forecast Engine | Intelligence Engine | CandidateGraph | JSON forecast | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| ATS Engine | Intelligence Engine | CV + job description | JSON analysis | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Daily Coach Engine | Intelligence Engine | CandidateGraph + brain | JSON coaching | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Market Intelligence | Intelligence Engine | CandidateGraph | JSON analysis | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Evidence Intelligence | Intelligence Engine | CandidateGraph | JSON evidence | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Resource Intelligence | Intelligence Engine | CandidateGraph | JSON resources | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Scenario Intelligence | Intelligence Engine | CandidateGraph | JSON scenarios | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Success Intelligence | Intelligence Engine | CandidateGraph | JSON success | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Constraint Intelligence | Intelligence Engine | CandidateGraph | JSON constraints | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Outcome Intelligence | Intelligence Engine | CandidateGraph | JSON outcomes | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Digital Twin Engine | Intelligence Engine | CandidateGraph | JSON twin | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Goal Intelligence | Intelligence Engine | CandidateGraph | JSON goals | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Application Intelligence | Intelligence Engine | CandidateGraph | JSON applications | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Opportunity Intelligence | Intelligence Engine | CandidateGraph | JSON opportunities | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Decision Intelligence | Intelligence Engine | CandidateGraph | JSON decisions | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Adaptive Strategy | Intelligence Engine | CandidateGraph | JSON strategy | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Mission Intelligence | Intelligence Engine | CandidateGraph | JSON mission | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Narrative Intelligence | Intelligence Engine | CandidateGraph | JSON narrative | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Coaching Intelligence | Intelligence Engine | CandidateGraph | JSON coaching | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Execution Intelligence | Intelligence Engine | CandidateGraph | JSON execution | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Gap Intelligence | Intelligence Engine | CandidateGraph | JSON gaps | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Personalization Intelligence | Intelligence Engine | CandidateGraph | JSON personalization | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Planning Intelligence | Intelligence Engine | CandidateGraph | JSON planning | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Reflection Intelligence | Intelligence Engine | CandidateGraph | JSON reflection | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Transferable Skills | Intelligence Engine | CandidateGraph | JSON skills | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Autonomous Intelligence | Intelligence Engine | CandidateGraph | JSON autonomous | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| Knowledge Evolution | Intelligence Engine | CandidateGraph | JSON knowledge | ❌ | ❌ | ❌ | ✅ | aiOrchestrator | Intelligence Engine Standard |
| behavior.agent | Background Agent | Events | Actions | ❌ | ❌ | ✅ | ✅ | Various | Background Agent Standard |
| billing.agent | Background Agent | Events | Actions | ❌ | ❌ | ✅ | ✅ | Various | Background Agent Standard |
| interview.agent | Background Agent | Events | Actions | ❌ | ❌ | ✅ | ✅ | Various | Background Agent Standard |
| careerEngine | Decision Engine | Profile + job | Scores | ❌ | ❌ | ❌ | ✅ | None (rule-based) | Decision Engine Standard |
| candidateProfile | Decision Engine | Profile data | Profile | ❌ | ❌ | ❌ | ✅ | None (rule-based) | Decision Engine Standard |
| careerAnalysisAIEngine | Decision Engine | Profile + job | Analysis | ❌ | ❌ | ❌ | ✅ | None (rule-based) | Decision Engine Standard |
| scoreEngine | Decision Engine | Multiple data | Scores | ❌ | ❌ | ❌ | ✅ | None (rule-based) | Decision Engine Standard |
| coachEngine | Decision Engine | Profile + job | Plan | ❌ | ❌ | ❌ | ✅ | None (rule-based) | Decision Engine Standard |
| recommendationEngine | Decision Engine | Profile + job | Recommendations | ❌ | ❌ | ❌ | ✅ | None (rule-based) | Decision Engine Standard |
| progressEngine | Decision Engine | History | Progress | ❌ | ❌ | ❌ | ✅ | None (rule-based) | Decision Engine Standard |
| insightEngine | Decision Engine | Profile + job | Insights | ❌ | ❌ | ❌ | ✅ | None (rule-based) | Decision Engine Standard |
| decisionEngine | Decision Engine | Profile + job | Decisions | ❌ | ❌ | ❌ | ✅ | None (rule-based) | Decision Engine Standard |
| memoryEngine | Decision Engine | Events | Memory | ❌ | ❌ | ❌ | ✅ | None (rule-based) | Decision Engine Standard |
| embedding-provider.port | Knowledge Service | Text | Embeddings | ❌ | ❌ | ❌ | ✅ | Embedding Provider | Knowledge Service Standard |
| rag.ts | Knowledge Service | Query | Retrieved context | ❌ | ❌ | ❌ | ✅ | Embedding Provider | Knowledge Service Standard |
| track-skills.ts | Knowledge Service | Skills | Embeddings | ❌ | ❌ | ❌ | ✅ | Embedding Provider | Knowledge Service Standard |
| ai-core | AI Infrastructure | Various | Various | ✅ Some | ❌ | ❌ | ✅ | Various | AI Infrastructure Standard |
| llm-provider.port | AI Infrastructure | Prompts | Completions | ✅ | ❌ | ❌ | ✅ | LLM Provider | AI Infrastructure Standard |
| streaming-provider.port | AI Infrastructure | Prompts | Streams | ✅ | ❌ | ❌ | ✅ | LLM Provider | AI Infrastructure Standard |
| moderation-provider.port | AI Infrastructure | Text | Moderation | ❌ | ❌ | ❌ | ✅ | Moderation Provider | AI Infrastructure Standard |
| stream.adapter.ts | AI Infrastructure | Events | Streams | ✅ | ❌ | ❌ | ✅ | AI SDK | AI Infrastructure Standard |
| cache.ts | AI Infrastructure | Various | Cached data | ❌ | ❌ | ❌ | ✅ | None | AI Infrastructure Standard |
| chunker.ts | AI Infrastructure | Text | Chunks | ❌ | ❌ | ❌ | ✅ | None | AI Infrastructure Standard |
| trimmer.ts | AI Infrastructure | Text | Trimmed text | ❌ | ❌ | ❌ | ✅ | None | AI Infrastructure Standard |

---

## Summary Statistics

| Family | Count | Migrated | Not Migrated | Standard Status |
|--------|-------|----------|--------------|-----------------|
| Conversational Domain | 2 | 2 | 0 | ✅ Defined (AI Domain Standard) |
| Intelligence Engine | 29+ | 0 | 29+ | ❌ Not defined |
| Background Agent | 3 | 0 | 3 | ❌ Not defined |
| Decision Engine | 10+ | 0 | 10+ | ❌ Not defined |
| Knowledge Service | 3 | 0 | 3 | ❌ Not defined |
| AI Infrastructure | 8 | 1 (ai-core) | 7 | ⚠️ Partially defined |

**Total**: 55+ AI components  
**Migrated**: 2 (3.6%)  
**Not Migrated**: 53+ (96.4%)

**Note**: Learning is not an independent AI domain. It is a presentational component within the Digital Twin domain. Daily Coach is an Intelligence Engine, not a Conversational Domain. Planning is an Intelligence Engine, not a Conversational Domain.

---

## Key Insights

### 1. Intelligence Engines Dominate
- 29+ intelligence engines exist
- All follow similar pattern (aiOrchestrator + CandidateAIBrain + EventBus)
- Strong candidate for Intelligence Engine Standard

### 2. Conversational Domains Are Complete
- Only 2 true conversational domains identified
- 2 migrated (Career Copilot, Interview)
- 0 remaining (Phase 1 complete)

### 3. Decision Engines Are Rule-Based
- 10+ decision engines exist
- No AI/LLM required
- Pure TypeScript, deterministic
- Different pattern from intelligence engines

### 4. Background Agents Are Few
- Only 3 background agents
- Autonomous, event-driven
- Distinct pattern from other families

### 5. Knowledge Services Are Emerging
- 3 knowledge services identified
- RAG, embeddings, vector store
- Emerging pattern, may grow

### 6. AI Infrastructure Is Shared
- 8 infrastructure components
- Shared across all families
- ai-core is the only migrated component

---

## Recommendations

### Immediate (Documentation)

1. **Define Intelligence Engine Standard**
   - 24+ engines exist (meets Rule of Three)
   - Common pattern: aiOrchestrator + CandidateAIBrain + EventBus
   - Extract common abstractions to intelligence-core

2. **Define Decision Engine Standard**
   - 10+ engines exist (meets Rule of Three)
   - Common pattern: rule-based, deterministic
   - Extract common abstractions to decision-core

3. **Define Background Agent Standard**
   - Only 3 agents exist (below Rule of Three)
   - Document pattern but defer standard creation

4. **Define Knowledge Service Standard**
   - Only 3 services exist (below Rule of Three)
   - Document pattern but defer standard creation

### Short-term (Migration)

5. **Continue Conversational Domain Migration**
   - Sprint 6.8: ATS
   - Sprint 6.9: Learning
   - Sprint 6.10: Daily Coach
   - Sprint 6.11: Planning

### Medium-term (Standardization)

6. **Create Intelligence Engine Standard**
   - After 3+ conversational domains migrated
   - Extract common intelligence engine patterns
   - Create intelligence-core module

7. **Create Decision Engine Standard**
   - Extract common decision engine patterns
   - Create decision-core module

### Long-term (Platform Evolution)

8. **Evaluate Background Agent Standard**
   - If more agents are created
   - Create background-core module

9. **Evaluate Knowledge Service Standard**
   - If more services are created
   - Create knowledge-core module

---

## Conclusion

Trajectoire has 54+ AI components across 6 distinct families:

1. **Conversational Domain** (6) - Chat-based, streaming ✅ Standard defined
2. **Intelligence Engine** (24+) - Synchronous analysis ❌ Standard not defined
3. **Background Agent** (3) - Autonomous automation ❌ Standard not defined
4. **Decision Engine** (10+) - Rule-based scoring ❌ Standard not defined
5. **Knowledge Service** (3) - Embeddings/RAG ❌ Standard not defined
6. **AI Infrastructure** (8) - Shared utilities ⚠️ Partially defined

**Priority**: Continue conversational domain migration, then define Intelligence Engine Standard (24+ engines meet Rule of Three).
