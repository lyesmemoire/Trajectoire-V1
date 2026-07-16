# Intelligence Engine Clustering

## Overview

Clustering analysis of 29+ Intelligence Engines to identify families, common patterns, and differences. This analysis informs the Intelligence Engine Standard design.

**Date**: 2026-07-13  
**Context**: Sprint 6.9 - Phase 1 Completion & Phase 2 Preparation  
**Objective**: Cluster Intelligence Engines by functionality and identify common patterns

---

## Clustering Methodology

Engines are clustered based on:
1. **Functional Domain** (career analysis, planning, decision, etc.)
2. **Input/Output Pattern** (CandidateGraph-only vs. additional inputs)
3. **Context Dependencies** (CandidateAIBrain-only vs. engine-to-engine)
4. **LLM Provider** (OpenAI vs. Anthropic)
5. **Complexity** (simple vs. complex output structures)

---

## Engine Clusters

### Cluster 1: Career Analysis (6 engines)

**Engines**:
1. CareerCopilotForecastEngine
2. CareerCopilotMarketIntelligenceEngine
3. CareerCopilotEvidenceIntelligenceEngine
4. CareerCopilotSuccessIntelligenceEngine
5. CareerCopilotGapIntelligenceEngine
6. CareerCopilotPersonalizationIntelligenceEngine

**Common Characteristics**:
- Input: CandidateGraph only
- Output: Analysis of career aspects (forecast, market, evidence, success, gaps, personalization)
- Context: CandidateAIBrain + other engines
- LLM Provider: Anthropic Claude 3.5 Sonnet
- Complexity: Medium to High

**Differences**:
- Forecast: Career trajectory prediction
- Market Intelligence: Market trends and opportunities
- Evidence: Evidence validation
- Success: Success factors and optimization
- Gap: Skill and experience gaps
- Personalization: Personalized recommendations

**Context Dependencies**:
- Forecast: 5 other engines
- Market Intelligence: 10 other engines
- Evidence: 0 other engines
- Success: 12 other engines
- Gap: 0 other engines
- Personalization: 0 other engines

---

### Cluster 2: Planning (3 engines)

**Engines**:
1. CareerCopilotPlanningIntelligenceEngine
2. CareerCopilotProgressionPlanEngine
3. ActionPlanAIEngine

**Common Characteristics**:
- Input: CandidateGraph only
- Output: Planning data (roadmap, milestones, progression plan, action plan)
- Context: CandidateAIBrain + other engines
- LLM Provider: Anthropic Claude 3.5 Sonnet
- Complexity: High

**Differences**:
- Planning Intelligence: Comprehensive career planning (current position, target position, gap analysis, roadmap, milestones, priorities, risk analysis)
- Progression Plan: Progression milestones and tasks
- Action Plan: Specific actions to take

**Context Dependencies**:
- Planning Intelligence: 18 other engines (highest dependency)
- Progression Plan: 2 other engines
- Action Plan: 0 other engines

---

### Cluster 3: Decision & Strategy (2 engines)

**Engines**:
1. CareerCopilotDecisionIntelligenceEngine
2. CareerCopilotAdaptiveStrategyEngine

**Common Characteristics**:
- Input: CandidateGraph only
- Output: Decision and strategy data (priority, strategy adaptation)
- Context: CandidateAIBrain + other engines
- LLM Provider: Anthropic Claude 3.5 Sonnet
- Complexity: Medium

**Differences**:
- Decision Intelligence: Arbitrate and determine priority
- Adaptive Strategy: Detect and adapt career strategy

**Context Dependencies**:
- Decision Intelligence: 10 other engines
- Adaptive Strategy: 9 other engines

---

### Cluster 4: Goal & Execution (2 engines)

**Engines**:
1. CareerCopilotGoalIntelligenceEngine
2. CareerCopilotExecutionIntelligenceEngine

**Common Characteristics**:
- Input: CandidateGraph only
- Output: Goal and execution data (goals, next best action)
- Context: CandidateAIBrain + other engines
- LLM Provider: Anthropic Claude 3.5 Sonnet
- Complexity: High

**Differences**:
- Goal Intelligence: Manage and optimize goals (primary goal, secondary goals, new goals, completed goals, merged goals, deleted goals, postponed goals)
- Execution Intelligence: Track execution and next best action

**Context Dependencies**:
- Goal Intelligence: 14 other engines
- Execution Intelligence: 0 other engines

---

### Cluster 5: Application & Opportunity (2 engines)

**Engines**:
1. CareerCopilotApplicationIntelligenceEngine
2. CareerCopilotOpportunityIntelligenceEngine

**Common Characteristics**:
- Input: CandidateGraph + additional input (applications/opportunities array)
- Output: Application and opportunity data (tracked applications, analyzed opportunities)
- Context: CandidateAIBrain + other engines
- LLM Provider: Anthropic Claude 3.5 Sonnet
- Complexity: High

**Differences**:
- Application Intelligence: Track and analyze job applications
- Opportunity Intelligence: Analyze career opportunities

**Context Dependencies**:
- Application Intelligence: 10 other engines
- Opportunity Intelligence: 10 other engines

---

### Cluster 6: Scenario & Digital Twin (2 engines)

**Engines**:
1. CareerCopilotScenarioIntelligenceEngine
2. CareerCopilotDigitalTwinEngine

**Common Characteristics**:
- Input: CandidateGraph only
- Output: Scenario and digital twin data (scenarios, digital twin portrait)
- Context: CandidateAIBrain + other engines
- LLM Provider: Anthropic Claude 3.5 Sonnet
- Complexity: High

**Differences**:
- Scenario Intelligence: Generate career scenarios (what-if analysis)
- Digital Twin: Generate digital twin portrait (living portrait of professional evolution)

**Context Dependencies**:
- Scenario Intelligence: 14 other engines
- Digital Twin: 6 other engines

---

### Cluster 7: Constraint & Resource (2 engines)

**Engines**:
1. CareerCopilotConstraintIntelligenceEngine
2. CareerCopilotResourceIntelligenceEngine

**Common Characteristics**:
- Input: CandidateGraph + optional current event
- Output: Constraint and resource data (constraints, resources, optimization)
- Context: CandidateAIBrain + other engines
- LLM Provider: Anthropic Claude 3.5 Sonnet
- Complexity: High

**Differences**:
- Constraint Intelligence: Analyze constraints and limitations
- Resource Intelligence: Analyze resources and optimization

**Context Dependencies**:
- Constraint Intelligence: 1 other engine
- Resource Intelligence: 0 other engines

---

### Cluster 8: Outcome & Learning (2 engines)

**Engines**:
1. CareerCopilotOutcomeIntelligenceEngine
2. CareerCopilotKnowledgeEvolutionEngine

**Common Characteristics**:
- Input: CandidateGraph + optional current event
- Output: Outcome and learning data (recommendation effectiveness, knowledge evolution)
- Context: CandidateAIBrain + other engines
- LLM Provider: Anthropic Claude 3.5 Sonnet
- Complexity: Medium

**Differences**:
- Outcome Intelligence: Track recommendation outcomes and learnings
- Knowledge Evolution: Track knowledge evolution

**Context Dependencies**:
- Outcome Intelligence: 3 other engines
- Knowledge Evolution: 0 other engines

---

### Cluster 9: Coaching & Reflection (2 engines)

**Engines**:
1. CareerCopilotCoachingIntelligenceEngine
2. CareerCopilotReflectionIntelligenceEngine

**Common Characteristics**:
- Input: CandidateGraph only
- Output: Coaching and reflection data (coaching guidance, reflection insights)
- Context: CandidateAIBrain + other engines
- LLM Provider: Anthropic Claude 3.5 Sonnet
- Complexity: Medium

**Differences**:
- Coaching Intelligence: Generate coaching guidance
- Reflection Intelligence: Generate reflection and insights

**Context Dependencies**:
- Coaching Intelligence: 1 other engine
- Reflection Intelligence: 0 other engines

---

### Cluster 10: Specialized Analysis (7 engines)

**Engines**:
1. CareerCopilotMissionIntelligenceEngine
2. CareerCopilotNarrativeIntelligenceEngine
3. CareerCopilotTransferableSkillsIntelligenceEngine
4. CareerCopilotAutonomousIntelligenceEngine
5. CareerCopilotConfidenceEngine
6. CareerCopilotMetaIntelligenceEngine
7. CareerCopilotAccountabilityEngine

**Common Characteristics**:
- Input: CandidateGraph only
- Output: Specialized analysis data (mission, narrative, transferable skills, autonomous behavior, confidence, meta-intelligence, accountability)
- Context: CandidateAIBrain only
- LLM Provider: Anthropic Claude 3.5 Sonnet
- Complexity: Low to Medium

**Differences**:
- Mission Intelligence: Analyze mission alignment
- Narrative Intelligence: Construct career narrative
- Transferable Skills: Analyze transferable skills
- Autonomous Intelligence: Generate autonomous behavior
- Confidence: Analyze confidence
- Meta-Intelligence: Meta-analysis
- Accountability: Track accountability

**Context Dependencies**:
- All: 0 other engines (CandidateAIBrain only)

---

### Cluster 11: External Analysis (2 engines)

**Engines**:
1. ATSAIEngine
2. DailyCoachAIEngine

**Common Characteristics**:
- Input: Direct input (not CandidateGraph)
- Output: Analysis data (ATS analysis, daily coaching)
- Context: No CandidateAIBrain (ATS) or CandidateAIBrain only (Daily Coach)
- LLM Provider: OpenAI GPT-4 Turbo
- Complexity: Low to Medium

**Differences**:
- ATS: Analyze CV against job description (no CandidateAIBrain)
- Daily Coach: Generate daily coaching messages (CandidateAIBrain)

**Context Dependencies**:
- ATS: 0 other engines
- Daily Coach: 0 other engines

---

## Cluster Summary

| Cluster | Count | Engines | Complexity | Context Dependencies | LLM Provider |
|---------|-------|---------|------------|---------------------|--------------|
| Career Analysis | 6 | Forecast, Market, Evidence, Success, Gap, Personalization | Medium-High | 0-12 engines | Anthropic |
| Planning | 3 | Planning Intelligence, Progression Plan, Action Plan | High | 0-18 engines | Anthropic |
| Decision & Strategy | 2 | Decision, Adaptive Strategy | Medium | 9-10 engines | Anthropic |
| Goal & Execution | 2 | Goal, Execution | High | 0-14 engines | Anthropic |
| Application & Opportunity | 2 | Application, Opportunity | High | 10 engines | Anthropic |
| Scenario & Digital Twin | 2 | Scenario, Digital Twin | High | 6-14 engines | Anthropic |
| Constraint & Resource | 2 | Constraint, Resource | High | 0-1 engine | Anthropic |
| Outcome & Learning | 2 | Outcome, Knowledge Evolution | Medium | 0-3 engines | Anthropic |
| Coaching & Reflection | 2 | Coaching, Reflection | Medium | 0-1 engine | Anthropic |
| Specialized Analysis | 7 | Mission, Narrative, Transferable Skills, Autonomous, Confidence, Meta, Accountability | Low-Medium | 0 engines | Anthropic |
| External Analysis | 2 | ATS, Daily Coach | Low-Medium | 0 engines | OpenAI |

---

## Common Patterns Across Clusters

### Pattern 1: Universal Dependencies

**All Clusters**:
- aiOrchestrator: 100% (29/29 engines)
- EventBus: 100% (29/29 engines)
- Prompt: 100% (29/29 engines)

**Most Clusters**:
- CandidateAIBrain: 97% (28/29 engines, ATS is the exception)

### Pattern 2: Input Structure

**Most Clusters** (10/11):
- Input: CandidateGraph only
- Additional Input: 2/11 clusters (Application & Opportunity, Constraint & Resource)

**Exception**:
- External Analysis: Direct input (not CandidateGraph)

### Pattern 3: Output Structure

**All Clusters**:
- Output: Structured JSON
- No streaming
- Synchronous

### Pattern 4: LLM Provider

**Most Clusters** (10/11):
- LLM Provider: Anthropic Claude 3.5 Sonnet

**Exception**:
- External Analysis: OpenAI GPT-4 Turbo

### Pattern 5: Context Dependencies

**High Dependency Clusters** (5/11):
- Planning: 0-18 engines
- Career Analysis: 0-12 engines
- Goal & Execution: 0-14 engines
- Application & Opportunity: 10 engines
- Scenario & Digital Twin: 6-14 engines

**Low Dependency Clusters** (6/11):
- Decision & Strategy: 9-10 engines
- Constraint & Resource: 0-1 engine
- Outcome & Learning: 0-3 engines
- Coaching & Reflection: 0-1 engine
- Specialized Analysis: 0 engines
- External Analysis: 0 engines

---

## Differences Across Clusters

### Difference 1: Functional Domain

Each cluster has a distinct functional domain:
- Career Analysis: Analyze career aspects
- Planning: Generate plans
- Decision & Strategy: Make decisions and adapt strategy
- Goal & Execution: Manage goals and execution
- Application & Opportunity: Track applications and opportunities
- Scenario & Digital Twin: Generate scenarios and digital twin
- Constraint & Resource: Analyze constraints and resources
- Outcome & Learning: Track outcomes and learning
- Coaching & Reflection: Provide coaching and reflection
- Specialized Analysis: Specialized analysis
- External Analysis: External analysis (ATS, Daily Coach)

### Difference 2: Complexity

**High Complexity Clusters** (5/11):
- Planning
- Goal & Execution
- Application & Opportunity
- Scenario & Digital Twin
- Constraint & Resource

**Medium Complexity Clusters** (4/11):
- Career Analysis
- Decision & Strategy
- Outcome & Learning
- Coaching & Reflection

**Low Complexity Clusters** (2/11):
- Specialized Analysis
- External Analysis

### Difference 3: Context Dependencies

**High Dependency Clusters** (5/11):
- Planning: 18 engines (highest)
- Career Analysis: 12 engines
- Goal & Execution: 14 engines
- Application & Opportunity: 10 engines
- Scenario & Digital Twin: 14 engines

**Low Dependency Clusters** (6/11):
- Decision & Strategy: 9-10 engines
- Constraint & Resource: 0-1 engine
- Outcome & Learning: 0-3 engines
- Coaching & Reflection: 0-1 engine
- Specialized Analysis: 0 engines
- External Analysis: 0 engines

### Difference 4: LLM Provider

**Most Clusters** (10/11):
- Anthropic Claude 3.5 Sonnet

**Exception**:
- External Analysis: OpenAI GPT-4 Turbo

---

## Key Insights

### 1. Clear Functional Clustering

Engines naturally cluster into 11 functional domains. Each cluster has a distinct purpose and output structure.

### 2. Universal Pattern

All engines follow the same pattern (aiOrchestrator + CandidateAIBrain + EventBus), regardless of cluster.

### 3. Complexity Variation

Complexity varies significantly across clusters, from low (Specialized Analysis) to high (Planning).

### 4. Context Dependency Variation

Context dependencies vary significantly across clusters, from 0 engines (Specialized Analysis) to 18 engines (Planning).

### 5. LLM Provider Consistency

93% of engines use Anthropic Claude 3.5 Sonnet. Only 2 engines use OpenAI GPT-4 Turbo.

### 6. Input Structure Consistency

91% of engines use CandidateGraph as input. Only 2 clusters use additional input parameters.

### 7. High Dependency Clusters

5 clusters have high context dependencies (10+ engines). These are the most complex and interconnected.

### 8. Low Dependency Clusters

6 clusters have low context dependencies (0-3 engines). These are the simplest and most independent.

---

## Recommendations

### Immediate (Sprint 6.9)

1. **Standardize High Dependency Clusters First**
   - Planning (18 engines)
   - Goal & Execution (14 engines)
   - Scenario & Digital Twin (14 engines)
   - Career Analysis (12 engines)
   - Application & Opportunity (10 engines)

2. **Create Cluster-Specific Abstractions**
   - Create context builders for each cluster
   - Create output validators for each cluster
   - Create dependency managers for high dependency clusters

### Short-term (Sprint 6.10)

3. **Standardize Low Dependency Clusters**
   - Specialized Analysis (0 engines)
   - External Analysis (0 engines)
   - Constraint & Resource (0-1 engine)
   - Coaching & Reflection (0-1 engine)
   - Outcome & Learning (0-3 engines)

4. **Create Intelligence Engine Standard**
   - Based on universal pattern
   - Include cluster-specific variations
   - Document best practices

### Medium-term (Sprint 6.11+)

5. **Refactor Engines by Cluster**
   - Migrate high dependency clusters first
   - Migrate low dependency clusters second
   - Reduce code duplication
   - Improve maintainability

---

## Conclusion

Trajectoire's 29+ Intelligence Engines naturally cluster into 11 functional domains. All engines follow the same universal pattern (aiOrchestrator + CandidateAIBrain + EventBus), but vary significantly in complexity and context dependencies. High dependency clusters (Planning, Goal & Execution, Scenario & Digital Twin, Career Analysis, Application & Opportunity) are the most complex and should be standardized first.

**Status**: Clustering complete ✅  
**Next Steps**: Abstraction identification and Intelligence Engine Standard definition
