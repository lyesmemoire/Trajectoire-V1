# AI Platform Retrospective

## Overview

This retrospective evaluates the AI Domain Standard after the Forecast audit, which revealed that not all AI features are suitable for the conversational domain pattern.

**Date**: Sprint 6.8  
**Trigger**: Forecast audit revealed it's an intelligence engine, not a conversational domain  
**Conclusion**: AI Domain Standard is correctly scoped for conversational domains only  

---

## Key Finding

### Forecast is NOT a Conversational Domain

**Discovery**: Forecast is an intelligence engine that performs synchronous analysis, not a chat-based conversational system.

**Pattern**: Intelligence Engine Pattern (vs Conversational Domain Pattern)

**Characteristics**:
- Synchronous operation (not streaming)
- Input: CandidateGraph (not message + history)
- Output: JSON forecast (not streaming text)
- Uses aiOrchestrator (not LLM Provider Port)
- Uses CandidateAIBrain (not context builder)
- Uses EventBus (not domain events)

**Conclusion**: Forecast should NOT be migrated using AI Domain Standard.

---

## AI Domain Standard Evaluation

### What Worked Well

#### 1. Clear Scope Definition
The standard correctly defines itself as for "conversational AI domains" with:
- Streaming responses
- Chat-based interaction
- useChat integration
- Route handlers

**Verdict**: ✅ Scope is appropriate and well-defined.

#### 2. Reference Implementations
Career Copilot and Interview provide excellent reference implementations that demonstrate:
- Clean architecture
- Server-only protection
- Streaming pattern
- Proper layering

**Verdict**: ✅ Reference implementations are solid.

#### 3. Template Quality
The `lib/_templates/ai-domain/` template is comprehensive and provides:
- Complete structure
- Clear instructions
- Placeholder naming
- All necessary files

**Verdict**: ✅ Template is well-designed.

#### 4. AI Core Abstractions
The `lib/ai-core/` abstractions are correctly scoped following Rule of Three:
- Errors (DomainError, ValidationError, ProviderError)
- LLM Provider Port
- Stream Adapter

**Verdict**: ✅ Abstractions are minimal and appropriate.

### What Needs Clarification

#### 1. Domain Classification
The standard does not clearly define what constitutes an "AI domain" vs an "intelligence engine."

**Issue**: Forecast was initially classified as a domain but is actually an intelligence engine.

**Recommendation**: Add a classification section to AI_DOMAIN_STANDARD.md:
```
## Domain Classification

### Conversational Domains
- Chat-based interaction
- Streaming responses
- Message + history input
- useChat integration
- Examples: Career Copilot, Interview

### Intelligence Engines
- Synchronous analysis
- Structured input/output
- No streaming
- No useChat integration
- Examples: Forecast, Outcome Engine
```

**Impact**: Low (documentation only)

#### 2. Intelligence Engine Standard
The standard does not address intelligence engines, which are a different pattern.

**Issue**: If multiple intelligence engines exist, they may need their own standard.

**Recommendation**: Evaluate if intelligence engines need a separate standard:
- Audit all intelligence engines (Forecast, Outcome Engine, etc.)
- If 3+ exist, create an Intelligence Engine Standard
- Pattern: Similar to AI Domain Standard but for synchronous analysis

**Impact**: Medium (requires investigation)

### What is Missing

#### 1. Domain Classification Guide
The standard lacks a guide for classifying AI features as domains vs engines.

**Recommendation**: Add a classification guide to AI_DOMAIN_STANDARD.md:
```
## Classification Guide

Use this checklist to determine if an AI feature is a conversational domain:

✅ Conversational Domain if:
- User sends messages
- System responds with streaming text
- Interaction is chat-based
- useChat hook is appropriate

❌ Intelligence Engine if:
- System performs analysis
- Input is structured data
- Output is structured JSON
- No streaming required
```

**Impact**: Low (documentation only)

#### 2. Migration Readiness Assessment
The standard does not provide a pre-migration assessment checklist.

**Recommendation**: Add a pre-migration assessment to AI_MIGRATION_CHECKLIST.md:
```
## Pre-Migration Assessment

Before migrating, verify:
- [ ] Feature is conversational (chat-based)
- [ ] Feature uses streaming
- [ ] Feature has message + history input
- [ ] useChat is appropriate
- [ ] No synchronous analysis pattern
```

**Impact**: Low (documentation only)

---

## Abstractions Reused

### Successfully Reused

#### 1. Error Classes
- **DomainError**: Base error class
- **ValidationError**: Validation error
- **ProviderError**: Provider error

**Usage**: Used in Career Copilot and Interview
**Verdict**: ✅ Correctly extracted following Rule of Three

#### 2. LLM Provider Port
- **LLMProviderPort**: Interface for LLM providers
- **LLMCompletionInput/Output**: Completion types
- **LLMStreamChunk**: Stream chunk type

**Usage**: Used in Career Copilot and Interview
**Verdict**: ✅ Correctly extracted following Rule of Three

#### 3. Stream Adapter
- **StreamAdapter**: Converts domain events to AI SDK stream

**Usage**: Used in Career Copilot and Interview
**Verdict**: ✅ Correctly extracted following Rule of Three

### Not Applicable to Forecast

Forecast does not use these abstractions because:
- It uses aiOrchestrator (not LLM Provider Port)
- It's synchronous (not streaming)
- It uses CandidateAIBrain (not context builder)

**Verdict**: ✅ Correct - Forecast is a different pattern

---

## Duplications Subsisting

### No Critical Duplications

The standard correctly avoids premature abstraction. Only abstractions used in 3+ places are extracted to ai-core.

**Verdict**: ✅ No unnecessary duplications

### Potential Future Abstractions

If more domains are migrated, the following may become candidates for ai-core:

#### 1. Context Builder Pattern
If 3+ domains use Supabase context builders:
- Extract common SupabaseContextBuilder base class
- Extract common data fetching patterns

**Current**: 2 domains (Career Copilot, Interview)
**Threshold**: 3 domains
**Action**: Wait for third domain migration

#### 2. Engine Pattern
If 3+ domains use similar engine patterns:
- Extract common engine base class
- Extract common prompt building logic

**Current**: 2 domains (Career Copilot, Interview)
**Threshold**: 3 domains
**Action**: Wait for third domain migration

**Verdict**: ✅ Correctly deferred following Rule of Three

---

## Standard Strengths

1. **Clear Scope**: Well-defined for conversational domains
2. **Solid Architecture**: Clean architecture with proper layering
3. **Server-Only Protection**: Effective isolation of AI logic
4. **Streaming Pattern**: Well-designed streaming implementation
5. **Template Quality**: Comprehensive and easy to use
6. **Documentation**: Thorough and clear
7. **Rule of Three**: Correctly applied to avoid premature abstraction

---

## Standard Weaknesses

1. **Domain Classification**: No clear guide for classifying domains vs engines
2. **Intelligence Engine Pattern**: No standard for intelligence engines
3. **Pre-Migration Assessment**: No checklist to assess migration suitability

**Impact**: Low (documentation only, no code changes needed)

---

## Recommendations

### Immediate (Documentation Only)

1. **Add Classification Guide** to AI_DOMAIN_STANDARD.md
   - Define conversational domains vs intelligence engines
   - Provide classification checklist
   - Add examples

2. **Add Pre-Migration Assessment** to AI_MIGRATION_CHECKLIST.md
   - Add assessment checklist
   - Verify conversational pattern
   - Verify streaming requirement

### Short-term (Investigation)

3. **Audit Intelligence Engines**
   - Identify all intelligence engines in codebase
   - Evaluate if they need a separate standard
   - If 3+ exist, create Intelligence Engine Standard

### Medium-term (Standard Evolution)

4. **Evaluate ai-core Expansion**
   - After third domain migration
   - Evaluate context builder pattern
   - Evaluate engine pattern
   - Extract if Rule of Three is met

### Long-term (Platform Evolution)

5. **Consider Multi-Pattern Platform**
   - Support both conversational domains and intelligence engines
   - Create separate standards for each pattern
   - Provide clear guidance on when to use each

---

## Conclusion

The AI Domain Standard is **correctly scoped and well-designed** for conversational AI domains. The Forecast audit revealed that not all AI features fit this pattern, which is expected and appropriate.

**Key Takeaways**:
1. ✅ Standard is correctly scoped for conversational domains
2. ✅ Reference implementations are solid
3. ✅ Template is comprehensive
4. ✅ Abstractions are minimal and appropriate
5. ⚠️ Domain classification needs clarification
6. ⚠️ Intelligence engines may need separate standard

**Recommendation**: Add classification documentation but do NOT modify the standard. The standard is working as intended.

**Next Steps**:
1. Add classification guide to AI_DOMAIN_STANDARD.md
2. Add pre-migration assessment to AI_MIGRATION_CHECKLIST.md
3. Audit intelligence engines to evaluate need for separate standard
4. Proceed with ATS migration (Sprint 6.8)

---

## Appendix

### Files Updated

1. `reports/FORECAST_AUDIT.md` - Forecast audit report
2. `reports/AI_DOMAINS_MATRIX.md` - Updated to mark Forecast as Not Applicable
3. `AI_PLATFORM_ROADMAP.md` - Updated to remove Forecast, reorganize sprints

### Files to Update

1. `AI_DOMAIN_STANDARD.md` - Add classification guide
2. `AI_MIGRATION_CHECKLIST.md` - Add pre-migration assessment

### Files to Create

1. `INTELLIGENCE_ENGINE_STANDARD.md` - If 3+ intelligence engines exist

---

## Status

**AI Domain Standard**: ✅ STABLE (no changes needed except documentation)  
**Forecast Migration**: ❌ NOT APPLICABLE (intelligence engine pattern)  
**Next Migration**: ATS (Sprint 6.8)  
**Overall Platform**: ✅ ON TRACK
