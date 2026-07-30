# BCM Relation Registry

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | BCM-RELATION-REGISTRY |
| **Title** | Blueprint Cognitive Model Relation Registry |
| **Version** | 1.0.0 |
| **Status** | Final |
| **Created** | 2026-01-15 |
| **Author** | Chief Cognitive Architect |
| **Purpose** | Comprehensive registry of all cognitive relations |
| **Scope** | Entire Blueprint Enterprise platform |

---

## Vision

The BCM Relation Registry provides a comprehensive catalog of all cognitive relations defined across the Blueprint Cognitive Model. It ensures consistent understanding and usage of cognitive relations throughout the platform.

---

## Relation Registry

### Observation Relations

**ObservationRelation**: Relation between observations and their sources
- **Theory**: BCM-001 Observation Theory
- **Type**: SourceRelation
- **Direction**: Observation → Source
- **Properties**: source_type, source_id, timestamp

**ObservationSequenceRelation**: Relation between observations in temporal sequence
- **Theory**: BCM-001 Observation Theory
- **Type**: TemporalRelation
- **Direction**: Observation → Observation
- **Properties**: sequence_order, temporal_distance, timestamp

### Perception Relations

**PerceptionRelation**: Relation between perceptions and observations
- **Theory**: BCM-002 Perception Theory
- **Type**: InterpretationRelation
- **Direction**: Perception → Observation
- **Properties**: interpretation_type, confidence, timestamp

**PerceptionAssociationRelation**: Relation between associated perceptions
- **Theory**: BCM-002 Perception Theory
- **Type**: AssociationRelation
- **Direction**: Perception → Perception
- **Properties**: association_strength, association_type, timestamp

### Evidence Relations

**EvidenceRelation**: Relation between evidence and beliefs
- **Theory**: BCM-003 Evidence Theory
- **Type**: SupportRelation
- **Direction**: Evidence → Belief
- **Properties**: support_type, support_strength, timestamp

**EvidenceContradictionRelation**: Relation between contradictory evidence
- **Theory**: BCM-003 Evidence Theory
- **Type**: ContradictionRelation
- **Direction**: Evidence → Evidence
- **Properties**: contradiction_type, contradiction_strength, timestamp

### Confidence Relations

**ConfidenceRelation**: Relation between confidence and cognitive entities
- **Theory**: BCM-004 Confidence Theory
- **Type**: ConfidenceRelation
- **Direction**: Confidence → CognitiveEntity
- **Properties**: confidence_type, confidence_value, timestamp

**ConfidenceDependencyRelation**: Relation between dependent confidences
- **Theory**: BCM-004 Confidence Theory
- **Type**: DependencyRelation
- **Direction**: Confidence → Confidence
- **Properties**: dependency_type, dependency_strength, timestamp

### Knowledge Relations

**KnowledgeRelation**: Relation between knowledge and sources
- **Theory**: BCM-005 Knowledge Theory
- **Type**: SourceRelation
- **Direction**: Knowledge → Source
- **Properties**: source_type, source_id, timestamp

**KnowledgeHierarchyRelation**: Relation between knowledge in hierarchy
- **Theory**: BCM-005 Knowledge Theory
- **Type**: HierarchyRelation
- **Direction**: Knowledge → Knowledge
- **Properties**: hierarchy_type, hierarchy_level, timestamp

### Belief Relations

**BeliefRelation**: Relation between beliefs and propositions
- **Theory**: BCM-006 Belief Theory
- **Type**: PropositionRelation
- **Direction**: Belief → Proposition
- **Properties**: proposition_type, certainty, timestamp

**BeliefContradictionRelation**: Relation between contradictory beliefs
- **Theory**: BCM-006 Belief Theory
- **Type**: ContradictionRelation
- **Direction**: Belief → Belief
- **Properties**: contradiction_type, contradiction_strength, timestamp

### Hypothesis Relations

**HypothesisRelation**: Relation between hypotheses and evidence
- **Theory**: BCM-007 Hypothesis Theory
- **Type**: EvidenceRelation
- **Direction**: Hypothesis → Evidence
- **Properties**: evidence_type, evidence_strength, timestamp

**HypothesisDependencyRelation**: Relation between dependent hypotheses
- **Theory**: BCM-007 Hypothesis Theory
- **Type**: DependencyRelation
- **Direction**: Hypothesis → Hypothesis
- **Properties**: dependency_type, dependency_strength, timestamp

### Reasoning Relations

**ReasoningRelation**: Relation between reasoning and premises
- **Theory**: BCM-008 Reasoning Theory
- **Type**: PremiseRelation
- **Direction**: Reasoning → Premise
- **Properties**: premise_type, premise_role, timestamp

**ReasoningConclusionRelation**: Relation between reasoning and conclusion
- **Theory**: BCM-008 Reasoning Theory
- **Type**: ConclusionRelation
- **Direction**: Reasoning → Conclusion
- **Properties**: conclusion_type, confidence, timestamp

### Decision Relations

**DecisionRelation**: Relation between decisions and alternatives
- **Theory**: BCM-009 Decision Theory
- **Type**: AlternativeRelation
- **Direction**: Decision → Alternative
- **Properties**: alternative_type, alternative_value, timestamp

**DecisionCriteriaRelation**: Relation between decisions and criteria
- **Theory**: BCM-009 Decision Theory
- **Type**: CriteriaRelation
- **Direction**: Decision → Criteria
- **Properties**: criteria_type, criteria_weight, timestamp

### Planning Relations

**PlanRelation**: Relation between plans and goals
- **Theory**: BCM-010 Planning Theory
- **Type**: GoalRelation
- **Direction**: Plan → Goal
- **Properties**: goal_type, goal_priority, timestamp

**PlanActionRelation**: Relation between plans and actions
- **Theory**: BCM-010 Planning Theory
- **Type**: ActionRelation
- **Direction**: Plan → Action
- **Properties**: action_type, action_order, timestamp

### Memory Relations

**MemoryRelation**: Relation between memories and content
- **Theory**: BCM-011 Memory Theory
- **Type**: ContentRelation
- **Direction**: Memory → Content
- **Properties**: content_type, content_size, timestamp

**MemoryAssociationRelation**: Relation between associated memories
- **Theory**: BCM-011 Memory Theory
- **Type**: AssociationRelation
- **Direction**: Memory → Memory
- **Properties**: association_strength, association_type, timestamp

### Learning Relations

**LearningRelation**: Relation between learning and sources
- **Theory**: BCM-012 Learning Theory
- **Type**: SourceRelation
- **Direction**: Learning → Source
- **Properties**: source_type, source_id, timestamp

**LearningDependencyRelation**: Relation between dependent learnings
- **Theory**: BCM-012 Learning Theory
- **Type**: DependencyRelation
- **Direction**: Learning → Learning
- **Properties**: dependency_type, dependency_strength, timestamp

### Adaptation Relations

**AdaptationRelation**: Relation between adaptations and triggers
- **Theory**: BCM-013 Adaptation Theory
- **Type**: TriggerRelation
- **Direction**: Adaptation → Trigger
- **Properties**: trigger_type, trigger_id, timestamp

**AdaptationDependencyRelation**: Relation between dependent adaptations
- **Theory**: BCM-013 Adaptation Theory
- **Type**: DependencyRelation
- **Direction**: Adaptation → Adaptation
- **Properties**: dependency_type, dependency_strength, timestamp

### Meta-Reasoning Relations

**MetaReasoningRelation**: Relation between meta-reasoning and target reasoning
- **Theory**: BCM-014 Meta-Reasoning Theory
- **Type**: TargetRelation
- **Direction**: MetaReasoning → Reasoning
- **Properties**: target_type, target_id, timestamp

**MetaReasoningEvaluationRelation**: Relation between meta-reasoning and evaluation
- **Theory**: BCM-014 Meta-Reasoning Theory
- **Type**: EvaluationRelation
- **Direction**: MetaReasoning → Evaluation
- **Properties**: evaluation_type, evaluation_result, timestamp

### Self Evaluation Relations

**SelfEvaluationRelation**: Relation between self evaluation and target
- **Theory**: BCM-015 Self Evaluation Theory
- **Type**: TargetRelation
- **Direction**: SelfEvaluation → Target
- **Properties**: target_type, target_id, timestamp

**SelfEvaluationAssessmentRelation**: Relation between self evaluation and assessment
- **Theory**: BCM-015 Self Evaluation Theory
- **Type**: AssessmentRelation
- **Direction**: SelfEvaluation → Assessment
- **Properties**: assessment_type, assessment_result, timestamp

### Graph Relations

**NodeRelation**: Relation between graph and nodes
- **Theory**: BCM-016 Cognitive Graph Model
- **Type**: ContainmentRelation
- **Direction**: Graph → Node
- **Properties**: node_type, node_id, timestamp

**EdgeRelation**: Relation between graph and edges
- **Theory**: BCM-016 Cognitive Graph Model
- **Type**: ContainmentRelation
- **Direction**: Graph → Edge
- **Properties**: edge_type, edge_id, timestamp

**SourceRelation**: Relation between edge and source node
- **Theory**: BCM-016 Cognitive Graph Model
- **Type**: SourceRelation
- **Direction**: Edge → Node
- **Properties**: source_id, timestamp

**TargetRelation**: Relation between edge and target node
- **Theory**: BCM-016 Cognitive Graph Model
- **Type**: TargetRelation
- **Direction**: Edge → Node
- **Properties**: target_id, timestamp

### State Machine Relations

**StateRelation**: Relation between state machine and states
- **Theory**: BCM-017 Cognitive State Machine
- **Type**: ContainmentRelation
- **Direction**: StateMachine → State
- **Properties**: state_type, state_id, timestamp

**TransitionRelation**: Relation between state machine and transitions
- **Theory**: BCM-017 Cognitive State Machine
- **Type**: ContainmentRelation
- **Direction**: StateMachine → Transition
- **Properties**: transition_type, transition_id, timestamp

**FromStateRelation**: Relation between transition and from state
- **Theory**: BCM-017 Cognitive State Machine
- **Type**: FromStateRelation
- **Direction**: Transition → State
- **Properties**: from_state_id, timestamp

**ToStateRelation**: Relation between transition and to state
- **Theory**: BCM-017 Cognitive State Machine
- **Type**: ToStateRelation
- **Direction**: Transition → State
- **Properties**: to_state_id, timestamp

### Metric Relations

**MetricRelation**: Relation between metric and target
- **Theory**: BCM-018 Cognitive Metrics
- **Type**: TargetRelation
- **Direction**: Metric → Target
- **Properties**: target_type, target_id, timestamp

**MetricThresholdRelation**: Relation between metric and threshold
- **Theory**: BCM-018 Cognitive Metrics
- **Type**: ThresholdRelation
- **Direction**: Metric → Threshold
- **Properties**: threshold_type, threshold_value, timestamp

### Mathematics Relations

**AxiomRelation**: Relation between mathematics and axioms
- **Theory**: BCM-019 Cognitive Mathematics
- **Type**: ContainmentRelation
- **Direction**: Mathematics → Axiom
- **Properties**: axiom_type, axiom_id, timestamp

**TheoremRelation**: Relation between mathematics and theorems
- **Theory**: BCM-019 Cognitive Mathematics
- **Type**: ContainmentRelation
- **Direction**: Mathematics → Theorem
- **Properties**: theorem_type, theorem_id, timestamp

**ProofRelation**: Relation between theorem and proof
- **Theory**: BCM-019 Cognitive Mathematics
- **Type**: ProofRelation
- **Direction**: Theorem → Proof
- **Properties**: proof_type, proof_id, timestamp

### Guarantee Relations

**GuaranteeRelation**: Relation between guarantee and scope
- **Theory**: BCM-020 Cognitive Guarantees
- **Type**: ScopeRelation
- **Direction**: Guarantee → Scope
- **Properties**: scope_type, scope_id, timestamp

**GuaranteeViolationRelation**: Relation between guarantee and violation
- **Theory**: BCM-020 Cognitive Guarantees
- **Type**: ViolationRelation
- **Direction**: Guarantee → Violation
- **Properties**: violation_type, violation_id, timestamp

---

## Relation Relationships

### Relation Dependency Graph

```
ObservationRelation → PerceptionRelation → EvidenceRelation → ConfidenceRelation → KnowledgeRelation → BeliefRelation → HypothesisRelation → ReasoningRelation → DecisionRelation → PlanRelation → MemoryRelation → LearningRelation → AdaptationRelation → MetaReasoningRelation → SelfEvaluationRelation
```

### Relation Composition

**Composite Relations**: Relations that contain other relations
- ReasoningRelation contains PremiseRelation
- DecisionRelation contains AlternativeRelation
- PlanRelation contains ActionRelation
- MetaReasoningRelation contains EvaluationRelation

### Relation Inheritance

**Base Relations**: Relations that serve as base for other relations
- CognitiveRelation (base for all cognitive relations)
- ContainmentRelation (base for containment relations)
- DependencyRelation (base for dependency relations)

---

## Relation Lifecycle

### Relation States

**Created**: Relation has been created
**Active**: Relation is active and in use
**Archived**: Relation has been archived
**Deleted**: Relation has been deleted

### Relation Lifecycle Events

**RelationCreated**: Emitted when relation is created
**RelationUpdated**: Emitted when relation is updated
**RelationArchived**: Emitted when relation is archived
**RelationDeleted**: Emitted when relation is deleted

---

## Relation Storage

### Storage Requirements

**Persistence**: All relations must be stored persistently
**Indexing**: All relations must be indexed for retrieval
**Versioning**: All relations must be versioned
**Backup**: All relations must be backed up

### Storage Locations

**Primary Storage**: Main storage for active relations
**Archive Storage**: Storage for archived relations
**Backup Storage**: Storage for backup copies

---

## Document End

**This document provides the comprehensive relation registry for the Blueprint Cognitive Model.**

**All cognitive relations must conform to this registry.**

**The BCM Relation Registry is signed by the Chief Cognitive Architect.**
