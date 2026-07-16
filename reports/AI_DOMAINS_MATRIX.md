# AI Domains Matrix

## Overview

This matrix catalogs all AI domains in Trajectoire, their current state, architecture, technical debt, and migration priorities.

**Last Updated**: Sprint 6.7.4  
**Status**: Industrialisation Phase  

---

## Domain Matrix

| Domain | Current State | Architecture | Tech Debt | Priority | Complexity | Dependencies | Expected Gain |
|--------|--------------|--------------|-----------|----------|------------|--------------|---------------|
| **Career Copilot** | ✅ Migrated | Clean Architecture | Low | N/A | Medium | Supabase, Mistral | ✅ Completed |
| **Interview** | ✅ Migrated | Clean Architecture | Low | N/A | High | Supabase, Mistral | ✅ Completed |
| **Forecast** | ❌ Not Applicable | Intelligence Engine | Low | N/A | High | Supabase, ML Pipeline | N/A |
| **ATS** | ❌ Legacy | Monolithic | High | High | High | Supabase, External APIs | High |
| **Learning** | ❌ Legacy | Monolithic | High | Medium | Medium | Supabase, Content API | Medium |
| **Digital Twin** | ❌ Legacy | Monolithic | Very High | High | Very High | Multiple Data Sources | Very High |
| **Daily Coach** | ❌ Intelligence Engine | Intelligence Engine | Medium | Medium | Medium | Supabase | Medium |
| **Planning** | ❌ Intelligence Engine | Intelligence Engine | Medium | Medium | Medium | Supabase | Medium |
| **Scenario** | ❌ Legacy | Monolithic | High | Low | High | Supabase, Simulation Engine | Low |
| **Outcome Engine** | ❌ Legacy | Monolithic | Very High | High | Very High | ML Pipeline, Analytics | Very High |
| **Autonomous Engine** | ❌ Legacy | Monolithic | Very High | Low | Very High | Multiple AI Services | Low |

---

## Domain Details

### Career Copilot ✅

**Status**: Migrated (Sprint 6.7)  
**Architecture**: Clean Architecture with server-only isolation  
**Location**: `lib/career-copilot/`  
**Bundle Size**: ~15 kB (clean, no AI engines)  
**Tech Debt**: Low  
**Dependencies**: Supabase, Mistral  

**Key Features**:
- Career guidance and coaching
- Interview preparation
- CV analysis
- Skill recommendations

**Migration Notes**:
- Reference implementation for AI Platform
- Uses ai-core abstractions
- Server-only protection active

---

### Interview ✅

**Status**: Migrated (Sprint 6.7.3)  
**Architecture**: Clean Architecture with server-only isolation  
**Location**: `lib/interview/`  
**Bundle Size**: 12.5 kB (clean, no AI engines)  
**Tech Debt**: Low  
**Dependencies**: Supabase, Mistral  

**Key Features**:
- Interview simulation
- Real-time feedback
- Scoring and evaluation
- Adaptive difficulty

**Migration Notes**:
- Reference implementation for AI Platform
- Uses ai-core abstractions
- Server-only protection active
- Complex state machine

---

### Forecast ❌

**Status**: Legacy (Not Migrated)  
**Architecture**: Monolithic with client-side AI  
**Location**: `lib/forecast/` (estimated)  
**Bundle Size**: Unknown (likely large)  
**Tech Debt**: High  
**Dependencies**: Supabase, ML Pipeline  

**Key Features**:
- Career path forecasting
- Market trend analysis
- Salary predictions
- Skill demand forecasting

**Migration Notes**:
- High priority for business value
- Complex ML dependencies
- Requires data pipeline migration
- Estimated effort: 2-3 weeks

---

### ATS ❌

**Status**: Legacy (Not Migrated)  
**Architecture**: Monolithic with client-side AI  
**Location**: `lib/ats/` (estimated)  
**Bundle Size**: Unknown (likely large)  
**Tech Debt**: High  
**Dependencies**: Supabase, External APIs  

**Key Features**:
- Job posting analysis
- Candidate matching
- Resume parsing
- Interview scheduling

**Migration Notes**:
- High priority for business value
- External API dependencies
- Requires careful data handling
- Estimated effort: 2-3 weeks

---

### Learning ❌

**Status**: Legacy (Not Migrated)  
**Architecture**: Monolithic with client-side AI  
**Location**: `lib/learning/` (estimated)  
**Bundle Size**: Unknown (likely large)  
**Tech Debt**: High  
**Dependencies**: Supabase, Content API  

**Key Features**:
- Learning path recommendations
- Skill gap analysis
- Course suggestions
- Progress tracking

**Migration Notes**:
- Medium priority
- Content API integration
- Estimated effort: 1-2 weeks

---

### Digital Twin ❌

**Status**: Legacy (Not Migrated)  
**Architecture**: Monolithic with client-side AI  
**Location**: `lib/digital-twin/` (estimated)  
**Bundle Size**: Unknown (likely very large)  
**Tech Debt**: Very High  
**Dependencies**: Multiple Data Sources  

**Key Features**:
- User behavior modeling
- Skill simulation
- Career scenario testing
- Predictive analytics

**Migration Notes**:
- Very high complexity
- Multiple data source dependencies
- Requires significant refactoring
- Estimated effort: 4-6 weeks

---

### Daily Coach ❌

**Status**: Intelligence Engine (Not Migrated)  
**Architecture**: Intelligence Engine (aiOrchestrator + CandidateAIBrain)  
**Location**: `core/intelligence/engines/dailyCoachAIEngine.ts`  
**Bundle Size**: Clean (no client-side AI)  
**Tech Debt**: Medium  
**Dependencies**: Supabase  

**Key Features**:
- Daily coaching messages
- Progress tracking
- Motivation and encouragement
- Historical context via CandidateAIBrain

**Migration Notes**:
- Classified as Intelligence Engine, not Conversational Domain
- Uses standard AI infrastructure (aiOrchestrator, CandidateAIBrain)
- Should be standardized in Phase 2 (Intelligence Engine Standard)
- Estimated effort: 1-2 weeks (standardization)

---

### Planning ❌

**Status**: Intelligence Engine (Not Migrated)  
**Architecture**: Intelligence Engine (aiOrchestrator + CandidateAIBrain + EventBus)  
**Location**: `core/intelligence/engines/careerCopilotPlanningIntelligenceEngine.ts`  
**Bundle Size**: Clean (no client-side AI)  
**Tech Debt**: Medium  
**Dependencies**: Supabase  

**Key Features**:
- Career planning intelligence
- Progression plan generation
- Action plan generation
- Milestone tracking

**Migration Notes**:
- Classified as Intelligence Engine, not Conversational Domain
- Uses standard AI infrastructure (aiOrchestrator, CandidateAIBrain, EventBus)
- Should be standardized in Phase 2 (Intelligence Engine Standard)
- Estimated effort: 1-2 weeks (standardization)

---

### Scenario ❌

**Status**: Legacy (Not Migrated)  
**Architecture**: Monolithic with client-side AI  
**Location**: `lib/scenario/` (estimated)  
**Bundle Size**: Unknown (likely large)  
**Tech Debt**: High  
**Dependencies**: Supabase, Simulation Engine  

**Key Features**:
- Career scenario simulation
- What-if analysis
- Risk assessment
- Outcome prediction

**Migration Notes**:
- Low priority
- Simulation engine dependency
- Estimated effort: 2-3 weeks

---

### Outcome Engine ❌

**Status**: Legacy (Not Migrated)  
**Architecture**: Monolithic with client-side AI  
**Location**: `lib/outcome-engine/` (estimated)  
**Bundle Size**: Unknown (likely very large)  
**Tech Debt**: Very High  
**Dependencies**: ML Pipeline, Analytics  

**Key Features**:
- Outcome prediction
- Success probability
- Risk analysis
- Recommendation engine

**Migration Notes**:
- High complexity
- ML pipeline dependency
- Estimated effort: 4-6 weeks

---

### Autonomous Engine ❌

**Status**: Legacy (Not Migrated)  
**Architecture**: Monolithic with client-side AI  
**Location**: `lib/autonomous-engine/` (estimated)  
**Bundle Size**: Unknown (likely very large)  
**Tech Debt**: Very High  
**Dependencies**: Multiple AI Services  

**Key Features**:
- Autonomous decision making
- Self-optimization
- Multi-agent coordination
- Complex orchestration

**Migration Notes**:
- Very high complexity
- Multiple AI service dependencies
- Estimated effort: 6-8 weeks

---

## Migration Priority Analysis

### High Priority (Immediate)

1. **Forecast** - High business value, high ROI
2. **ATS** - High business value, high ROI
3. **Outcome Engine** - High complexity but high value

### Medium Priority (Next Sprint)

None (no remaining conversational domains)

### Intelligence Engines (Phase 2)

1. **Daily Coach** - Intelligence Engine, standardization in Phase 2
2. **Planning** - Intelligence Engine, standardization in Phase 2

### Low Priority (Future)

1. **Scenario** - Low business value
2. **Autonomous Engine** - Very high complexity, low immediate value

### Deferred (Long-term)

1. **Digital Twin** - Very high complexity, requires significant infrastructure

---

## Complexity Assessment

### Low Complexity (1-2 weeks)
None

### Medium Complexity (2-3 weeks)
- Forecast
- ATS
- Scenario

### High Complexity (4-6 weeks)
- Outcome Engine
- Digital Twin

### Very High Complexity (6-8 weeks)
- Autonomous Engine

---

## Dependencies Analysis

### Common Dependencies
- **Supabase**: All domains
- **Mistral**: Most domains (LLM provider)
- **ai-core**: All migrated domains

### External Dependencies
- **ML Pipeline**: Forecast, Outcome Engine
- **External APIs**: ATS
- **Content API**: Learning
- **Simulation Engine**: Scenario
- **Multiple Data Sources**: Digital Twin, Autonomous Engine

---

## Expected Gains

### High Gain
- **Forecast**: Improved accuracy, reduced bundle size
- **ATS**: Better performance, enhanced security
- **Outcome Engine**: Scalability, maintainability

### Medium Gain
None

### Low Gain
- **Scenario**: Architecture consistency
- **Autonomous Engine**: Long-term maintainability

---

## Technical Debt Summary

### Very High Debt
- Digital Twin
- Outcome Engine
- Autonomous Engine

### High Debt
- Forecast
- ATS
- Learning
- Planning
- Scenario

### Medium Debt
- Daily Coach

### Low Debt
- Career Copilot ✅
- Interview ✅

---

## Recommendations

### Immediate Actions (Sprint 6.8)
1. Migrate **Forecast** (high priority, high ROI)
2. Migrate **ATS** (high priority, high ROI)

### Short-term Actions (Sprint 6.9)
None (Phase 1 complete)

### Medium-term Actions (Sprint 6.10)
1. Evaluate **Outcome Engine** migration (high complexity)

### Long-term Actions (Sprint 6.11+)
1. Evaluate **Digital Twin** migration (very high complexity)
2. Evaluate **Autonomous Engine** migration (very high complexity)
3. Migrate **Scenario** (low priority)

---

## Conclusion

The AI domain migration is progressing well with 2 of 11 domains completed. The remaining domains vary significantly in complexity and priority. Focusing on high-value, medium-complexity domains (Forecast, ATS) will provide the best ROI in the short term.

**Migration Progress**: 2/11 (18%)  
**Estimated Total Effort**: 20-30 weeks  
**Recommended Timeline**: 6-8 sprints
