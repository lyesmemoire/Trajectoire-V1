# ADR-019: AI Component Classification

## Status

**Status**: Accepted  
**Date**: 2026-07-13  
**Decision Makers**: AI Platform Team  
**Context**: Sprint 6.8.1 - AI Platform Classification  

---

## Context

### Problem

Trajectoire's AI platform has evolved organically, resulting in multiple AI components with different architectural patterns:

- **Conversational Domains**: Chat-based systems with streaming (Career Copilot, Interview)
- **Intelligence Engines**: Synchronous analysis with structured I/O (Forecast, Market Intelligence, etc.)
- **Decision Engines**: Rule-based scoring without AI/LLM (careerEngine, scoreEngine, etc.)
- **Background Agents**: Autonomous automation (behavior.agent, billing.agent, etc.)
- **Knowledge Services**: Embeddings and RAG (embedding-provider, rag.ts, etc.)

Initially, the AI Domain Standard was designed for conversational domains. However, the Forecast audit revealed that not all AI components fit this pattern. Forecast is an intelligence engine, not a conversational domain, and cannot be migrated using the AI Domain Standard.

### Discovery

During Sprint 6.8.1, a comprehensive audit revealed:

- **54+ AI components** across the platform
- **6 distinct architectural families** with different patterns
- **24+ intelligence engines** following the aiOrchestrator + CandidateAIBrain + EventBus pattern
- **10+ decision engines** following rule-based, deterministic patterns
- **3 background agents** following autonomous, event-driven patterns
- **3 knowledge services** following embeddings/RAG patterns

### Key Insight

The AI Domain Standard is correctly scoped for conversational domains only. Other families require their own standards. Attempting to force all AI components into a single standard would result in:

- **Inappropriate abstractions**: Streaming pattern for synchronous analysis
- **Unnecessary complexity**: useChat for non-chat systems
- **Poor fit**: Conversational pattern for rule-based engines

---

## Decision

### 1. Classify All AI Components by Family

All AI components in Trajectoire are classified into 6 families:

| Family | Pattern | Count | Standard Status |
|--------|---------|-------|-----------------|
| Conversational Domain | Chat-based, streaming | 6 | ✅ AI Domain Standard |
| Intelligence Engine | Synchronous analysis | 24+ | ❌ Intelligence Engine Standard (to be defined) |
| Decision Engine | Rule-based scoring | 10+ | ❌ Decision Engine Standard (defined, not applied) |
| Background Agent | Autonomous automation | 3 | ⚠️ Background Agent Standard (draft, deferred) |
| Knowledge Service | Embeddings/RAG | 3 | ⚠️ Knowledge Service Standard (to be defined if needed) |
| AI Infrastructure | Shared utilities | 8 | ✅ AI Infrastructure Standard (implicit) |

**Reference**: See `AI_COMPONENT_CLASSIFICATION.md` for complete classification matrix.

### 2. Define Standards per Family

Each family has its own standard:

#### AI Domain Standard (Conversational Domains)

**Scope**: Chat-based systems with streaming responses  
**Characteristics**:
- useChat integration
- Streaming responses (AsyncGenerator)
- Route handler (HTTP boundary)
- Message + history input
- Interactive UI
- Server-only protection

**Components**: Career Copilot, Interview, ATS, Learning, Daily Coach, Planning  
**Status**: ✅ Defined and applied (2/6 migrated)  
**Reference**: `AI_DOMAIN_STANDARD.md`

#### Intelligence Engine Standard

**Scope**: Synchronous analysis with structured I/O  
**Characteristics**:
- Synchronous operation (no streaming)
- Structured business input (CandidateGraph, events, etc.)
- Structured JSON output
- Uses aiOrchestrator
- Uses CandidateAIBrain
- Uses EventBus
- No useChat

**Components**: 24+ intelligence engines (Forecast, Market Intelligence, etc.)  
**Status**: ❌ Defined (see `AI_ENGINE_STANDARD.md`), not yet applied  
**Reference**: `AI_ENGINE_STANDARD.md`

#### Decision Engine Standard

**Scope**: Rule-based scoring and recommendations  
**Characteristics**:
- Rule-based logic
- Score calculation
- Recommendation generation
- No AI/LLM required
- Deterministic output
- Pure TypeScript

**Components**: 10+ decision engines (careerEngine, scoreEngine, etc.)  
**Status**: ❌ Defined (see `DECISION_ENGINE_STANDARD.md`), not yet applied  
**Reference**: `DECISION_ENGINE_STANDARD.md`

#### Background Agent Standard

**Scope**: Autonomous, scheduled, event-driven automation  
**Characteristics**:
- Autonomous execution
- Scheduled or event-triggered
- Event Bus integration
- No user interaction
- Background processing

**Components**: 3 agents (behavior.agent, billing.agent, interview.agent)  
**Status**: ⚠️ Draft (see `BACKGROUND_AGENT_STANDARD.md`), formalization deferred (below Rule of Three)  
**Reference**: `BACKGROUND_AGENT_STANDARD.md`

#### Knowledge Service Standard

**Scope**: Embeddings, search, vector store operations  
**Characteristics**:
- Vector embeddings
- Semantic search
- RAG (Retrieval-Augmented Generation)
- Vector store operations

**Components**: 3 services (embedding-provider, rag.ts, track-skills.ts)  
**Status**: ⚠️ To be defined if more services are created (below Rule of Three)  
**Reference**: Not yet defined

### 3. Apply Rule of Three for Abstraction Extraction

Common abstractions are only extracted when used in 3+ components:

- **ai-core**: ✅ Extracted (used in Career Copilot, Interview, and other domains)
- **intelligence-core**: ❌ To be extracted (24+ engines meet Rule of Three)
- **decision-core**: ❌ To be extracted (10+ engines meet Rule of Three)
- **agent-core**: ⚠️ Deferred (only 3 agents, below Rule of Three)
- **knowledge-core**: ⚠️ Deferred (only 3 services, below Rule of Three)

### 4. Organize Roadmap by Family

The AI Platform Roadmap is reorganized by family:

- **Phase 1 (Sprint 6.8-6.11)**: Conversational Domain Standard (ATS, Learning, Daily Coach, Planning)
- **Phase 2 (Sprint 6.12-6.14+)**: Intelligence Engine Standard (24+ engines)
- **Phase 3 (Sprint 6.13-6.14+)**: Decision Engine Standard (10+ engines)
- **Phase 4 (Sprint 6.14+)**: Background Agent Standard (3 agents, evaluation)
- **Phase 5 (Sprint 6.14+)**: Knowledge Service Standard (3 services, evaluation)

**Reference**: See `AI_PLATFORM_ROADMAP.md` for complete roadmap.

---

## Consequences

### Positive

1. **Clear Governance**: Each component family has a clear standard and migration path
2. **Appropriate Abstractions**: Standards are tailored to each family's pattern
3. **No Forced Migrations**: Components are not forced into inappropriate patterns
4. **Rule of Three Compliance**: Abstractions are only extracted when justified
5. **Maintainability**: Clear separation of concerns reduces complexity
6. **Scalability**: Standards enable rapid component creation within each family

### Negative

1. **Multiple Standards**: Development team must learn multiple standards
2. **Documentation Overhead**: Each family requires its own documentation
3. **Decision Complexity**: Choosing the right standard for new components
4. **Migration Complexity**: Different families have different migration processes

### Mitigations

1. **Training**: Provide training on all standards
2. **Decision Guide**: Create a classification guide for choosing standards
3. **Templates**: Provide templates for each standard
4. **Documentation**: Maintain clear, comprehensive documentation

---

## Rationale

### Why Multiple Standards?

Different AI components have fundamentally different architectural patterns:

- **Conversational domains** require streaming, chat interfaces, and user interaction
- **Intelligence engines** require synchronous analysis, structured I/O, and no user interaction
- **Decision engines** require rule-based logic, determinism, and no AI/LLM
- **Background agents** require autonomy, scheduling, and event-driven execution
- **Knowledge services** require embeddings, vector search, and RAG

Forcing all components into a single standard would result in:

- **Inappropriate abstractions**: Streaming pattern for synchronous analysis
- **Unnecessary complexity**: useChat for non-chat systems
- **Poor fit**: Conversational pattern for rule-based engines
- **Technical Debt**: Workarounds to make components fit the wrong pattern

### Why Forecast Doesn't Follow AI Domain Standard

Forecast is an intelligence engine, not a conversational domain:

**Pattern Mismatch**:
- Forecast: Synchronous analysis, structured I/O, no streaming
- AI Domain Standard: Streaming, chat-based, interactive

**Architecture Mismatch**:
- Forecast: Uses aiOrchestrator + CandidateAIBrain + EventBus
- AI Domain Standard: Uses LLM Provider Port + Context Builder

**Use Case Mismatch**:
- Forecast: Analysis triggered by user action (button click)
- AI Domain Standard: Chat interaction with message history

**Conclusion**: Forecast cannot be migrated using AI Domain Standard. It requires Intelligence Engine Standard.

### How to Choose the Right Standard

Use this decision tree:

```
Is the component chat-based with user interaction?
├─ Yes → Conversational Domain Standard
│         - useChat integration
│         - Streaming responses
│         - Message + history input
│
└─ No → Does it use AI/LLM for analysis?
          ├─ Yes → Intelligence Engine Standard
          │         - Synchronous analysis
          │         - Structured I/O
          │         - aiOrchestrator integration
          │
          └─ No → Is it rule-based and deterministic?
                    ├─ Yes → Decision Engine Standard
                    │         - Rule-based logic
                    │         - No AI/LLM
                    │         - Deterministic output
                    │
                    └─ No → Is it autonomous or scheduled?
                              ├─ Yes → Background Agent Standard
                              │         - Autonomous execution
                              │         - Scheduled or event-triggered
                              │         - EventBus integration
                              │
                              └─ No → Does it use embeddings/RAG?
                                        ├─ Yes → Knowledge Service Standard
                                        │         - Vector embeddings
                                        │         - Semantic search
                                        │         - RAG
                                        │
                                        └─ No → AI Infrastructure Standard
                                                  - Shared utilities
                                                  - Cross-family abstractions
```

---

## Alternatives Considered

### Alternative 1: Single Standard for All AI Components

**Description**: Force all AI components to use AI Domain Standard.

**Pros**:
- Simpler governance (one standard)
- Less documentation overhead
- Easier for developers to learn

**Cons**:
- Inappropriate abstractions for non-conversational components
- Unnecessary complexity for rule-based engines
- Technical debt from workarounds
- Poor fit for intelligence engines

**Rejected**: The architectural differences are too significant to ignore.

### Alternative 2: No Standards, Ad-Hoc Architecture

**Description**: No formal standards, each component uses its own pattern.

**Pros**:
- Maximum flexibility
- No governance overhead

**Cons**:
- Inconsistent architecture
- High technical debt
- Difficult to maintain
- No clear migration path
- Poor developer experience

**Rejected**: Lack of standards leads to chaos and technical debt.

### Alternative 3: Hybrid Standard (One Standard with Variants)

**Description**: Single standard with optional variants for different patterns.

**Pros**:
- Single standard document
- Some consistency across families

**Cons**:
- Complex standard with many variants
- Difficult to understand
- Still forces inappropriate abstractions
- Confusing for developers

**Rejected**: Hybrid standard would be too complex and still inappropriate for some families.

---

## Implementation

### Phase 1: Documentation (Sprint 6.8.1)

- ✅ Create `AI_COMPONENT_CLASSIFICATION.md`
- ✅ Create `AI_ENGINE_STANDARD.md`
- ✅ Create `DECISION_ENGINE_STANDARD.md`
- ✅ Create `BACKGROUND_AGENT_STANDARD.md`
- ✅ Update `AI_PLATFORM_ROADMAP.md` by family
- ✅ Create `ADR-019_AI_COMPONENT_CLASSIFICATION.md`

### Phase 2: Classification Guide (Sprint 6.8.1)

- Add classification guide to `AI_DOMAIN_STANDARD.md`
- Add pre-migration assessment to `AI_MIGRATION_CHECKLIST.md`
- Create decision tree for choosing standards

### Phase 3: Roadmap Execution (Sprint 6.8+)

- Execute Phase 1: Conversational Domain Standard (Sprint 6.8-6.11)
- Execute Phase 2: Intelligence Engine Standard (Sprint 6.12-6.14+)
- Execute Phase 3: Decision Engine Standard (Sprint 6.13-6.14+)
- Execute Phase 4: Background Agent Standard (Sprint 6.14+)
- Execute Phase 5: Knowledge Service Standard (Sprint 6.14+)

### Phase 4: Verification (Ongoing)

- Verify Career Copilot and Interview remain compliant with AI Domain Standard
- Verify no forbidden imports in UI
- Verify server-only protection active
- Verify bundle size appropriate

---

## References

- `AI_COMPONENT_CLASSIFICATION.md` - Complete classification matrix
- `AI_DOMAIN_STANDARD.md` - Conversational domain standard
- `AI_ENGINE_STANDARD.md` - Intelligence engine standard
- `DECISION_ENGINE_STANDARD.md` - Decision engine standard
- `BACKGROUND_AGENT_STANDARD.md` - Background agent standard
- `AI_PLATFORM_ROADMAP.md` - Migration roadmap by family
- `AI_PLATFORM_RETROSPECTIVE.md` - Evaluation of AI Domain Standard
- `FORECAST_AUDIT.md` - Forecast audit revealing pattern mismatch
- `AI_DOMAINS_MATRIX.md` - Domain status matrix

---

## Conclusion

Trajectoire's AI platform has 54+ components across 6 distinct architectural families. Each family requires its own standard tailored to its pattern. The AI Domain Standard remains valid for conversational domains, while other families have their own standards.

**Key Takeaways**:
1. ✅ Multiple standards are necessary due to architectural differences
2. ✅ Forecast is an intelligence engine, not a conversational domain
3. ✅ Decision tree provided for choosing the right standard
4. ✅ Roadmap organized by family for systematic migration
5. ✅ Rule of Three applied for abstraction extraction

**Next Steps**:
1. Execute Phase 1: Conversational Domain Standard (Sprint 6.8-6.11)
2. Define Intelligence Engine Standard (Sprint 6.12)
3. Apply Decision Engine Standard (Sprint 6.13)
4. Evaluate Background Agent and Knowledge Service standards (Sprint 6.14+)

**Status**: Accepted and implemented in documentation. Roadmap execution begins Sprint 6.8.
