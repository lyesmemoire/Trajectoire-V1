# BCM State Registry

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | BCM-STATE-REGISTRY |
| **Title** | Blueprint Cognitive Model State Registry |
| **Version** | 1.0.0 |
| **Status** | Final |
| **Created** | 2026-01-15 |
| **Author** | Chief Cognitive Architect |
| **Purpose** | Comprehensive registry of all cognitive states |
| **Scope** | Entire Blueprint Enterprise platform |

---

## Vision

The BCM State Registry provides a comprehensive catalog of all cognitive states defined across the Blueprint Cognitive Model. It ensures consistent understanding and usage of cognitive states throughout the platform.

---

## State Registry

### Observation States

**Observing**: State when cognitive system is observing
- **Theory**: BCM-001 Observation Theory
- **Type**: ActiveState
- **Transitions**: Observing → Observed

**Observed**: State when observation has been completed
- **Theory**: BCM-001 Observation Theory
- **Type**: CompletedState
- **Transitions**: Observed → Perceiving

### Perception States

**Perceiving**: State when cognitive system is perceiving
- **Theory**: BCM-002 Perception Theory
- **Type**: ActiveState
- **Transitions**: Perceiving → Perceived

**Perceived**: State when perception has been completed
- **Theory**: BCM-002 Perception Theory
- **Type**: CompletedState
- **Transitions**: Perceived → Evidencing

### Evidence States

**Evidencing**: State when cognitive system is gathering evidence
- **Theory**: BCM-003 Evidence Theory
- **Type**: ActiveState
- **Transitions**: Evidencing → Evidenced

**Evidenced**: State when evidence has been gathered
- **Theory**: BCM-003 Evidence Theory
- **Type**: CompletedState
- **Transitions**: Evidenced → Confiding

### Confidence States

**Confiding**: State when cognitive system is assessing confidence
- **Theory**: BCM-004 Confidence Theory
- **Type**: ActiveState
- **Transitions**: Confiding → Confided

**Confided**: State when confidence has been assessed
- **Theory**: BCM-004 Confidence Theory
- **Type**: CompletedState
- **Transitions**: Confided → Knowing

### Knowledge States

**Knowing**: State when cognitive system is acquiring knowledge
- **Theory**: BCM-005 Knowledge Theory
- **Type**: ActiveState
- **Transitions**: Knowing → Known

**Known**: State when knowledge has been acquired
- **Theory**: BCM-005 Knowledge Theory
- **Type**: CompletedState
- **Transitions**: Known → Believing

### Belief States

**Believing**: State when cognitive system is forming beliefs
- **Theory**: BCM-006 Belief Theory
- **Type**: ActiveState
- **Transitions**: Believing → Believed

**Believed**: State when belief has been formed
- **Theory**: BCM-006 Belief Theory
- **Type**: CompletedState
- **Transitions**: Believed → Hypothesizing

### Hypothesis States

**Hypothesizing**: State when cognitive system is forming hypotheses
- **Theory**: BCM-007 Hypothesis Theory
- **Type**: ActiveState
- **Transitions**: Hypothesizing → Hypothesized

**Hypothesized**: State when hypothesis has been formed
- **Theory**: BCM-007 Hypothesis Theory
- **Type**: CompletedState
- **Transitions**: Hypothesized → Reasoning

### Reasoning States

**Reasoning**: State when cognitive system is reasoning
- **Theory**: BCM-008 Reasoning Theory
- **Type**: ActiveState
- **Transitions**: Reasoning → Reasoned

**Reasoned**: State when reasoning has been completed
- **Theory**: BCM-008 Reasoning Theory
- **Type**: CompletedState
- **Transitions**: Reasoned → Deciding

### Decision States

**Deciding**: State when cognitive system is making decisions
- **Theory**: BCM-009 Decision Theory
- **Type**: ActiveState
- **Transitions**: Deciding → Decided

**Decided**: State when decision has been made
- **Theory**: BCM-009 Decision Theory
- **Type**: CompletedState
- **Transitions**: Decided → Planning

### Planning States

**Planning**: State when cognitive system is planning
- **Theory**: BCM-010 Planning Theory
- **Type**: ActiveState
- **Transitions**: Planning → Planned

**Planned**: State when plan has been created
- **Theory**: BCM-010 Planning Theory
- **Type**: CompletedState
- **Transitions**: Planned → Executing

### Memory States

**Encoding**: State when memory is being encoded
- **Theory**: BCM-011 Memory Theory
- **Type**: ActiveState
- **Transitions**: Encoding → Encoded

**Encoded**: State when memory has been encoded
- **Theory**: BCM-011 Memory Theory
- **Type**: CompletedState
- **Transitions**: Encoded → Retrieving

**Retrieving**: State when memory is being retrieved
- **Theory**: BCM-011 Memory Theory
- **Type**: ActiveState
- **Transitions**: Retrieving → Retrieved

**Retrieved**: State when memory has been retrieved
- **Theory**: BCM-011 Memory Theory
- **Type**: CompletedState
- **Transitions**: Retrieved → Consolidating

**Consolidating**: State when memory is being consolidated
- **Theory**: BCM-011 Memory Theory
- **Type**: ActiveState
- **Transitions**: Consolidating → Consolidated

**Consolidated**: State when memory has been consolidated
- **Theory**: BCM-011 Memory Theory
- **Type**: CompletedState
- **Transitions**: Consolidated → Evicting

**Evicting**: State when memory is being evicted
- **Theory**: BCM-011 Memory Theory
- **Type**: ActiveState
- **Transitions**: Evicting → Evicted

**Evicted**: State when memory has been evicted
- **Theory**: BCM-011 Memory Theory
- **Type**: CompletedState
- **Transitions**: Evicted → Learning

### Learning States

**Learning**: State when cognitive system is learning
- **Theory**: BCM-012 Learning Theory
- **Type**: ActiveState
- **Transitions**: Learning → Learned

**Learned**: State when learning has been completed
- **Theory**: BCM-012 Learning Theory
- **Type**: CompletedState
- **Transitions**: Learned → Adapting

### Adaptation States

**Adapting**: State when cognitive system is adapting
- **Theory**: BCM-013 Adaptation Theory
- **Type**: ActiveState
- **Transitions**: Adapting → Adapted

**Adapted**: State when adaptation has been completed
- **Theory**: BCM-013 Adaptation Theory
- **Type**: CompletedState
- **Transitions**: Adapted → MetaReasoning

### Meta-Reasoning States

**Reflecting**: State when cognitive system is reflecting
- **Theory**: BCM-014 Meta-Reasoning Theory
- **Type**: ActiveState
- **Transitions**: Reflecting → Reflected

**Reflected**: State when reflection has been completed
- **Theory**: BCM-014 Meta-Reasoning Theory
- **Type**: CompletedState
- **Transitions**: Reflected → Evaluating

**Evaluating**: State when cognitive system is evaluating
- **Theory**: BCM-014 Meta-Reasoning Theory
- **Type**: ActiveState
- **Transitions**: Evaluating → Evaluated

**Evaluated**: State when evaluation has been completed
- **Theory**: BCM-014 Meta-Reasoning Theory
- **Type**: CompletedState
- **Transitions**: Evaluated → SelfEvaluating

### Self Evaluation States

**SelfEvaluating**: State when cognitive system is self-evaluating
- **Theory**: BCM-015 Self Evaluation Theory
- **Type**: ActiveState
- **Transitions**: SelfEvaluating → SelfEvaluated

**SelfEvaluated**: State when self evaluation has been completed
- **Theory**: BCM-015 Self Evaluation Theory
- **Type**: CompletedState
- **Transitions**: SelfEvaluated → Observing

### Graph States

**Creating**: State when graph is being created
- **Theory**: BCM-016 Cognitive Graph Model
- **Type**: ActiveState
- **Transitions**: Creating → Created

**Created**: State when graph has been created
- **Theory**: BCM-016 Cognitive Graph Model
- **Type**: CompletedState
- **Transitions**: Created → Updating

**Updating**: State when graph is being updated
- **Theory**: BCM-016 Cognitive Graph Model
- **Type**: ActiveState
- **Transitions**: Updating → Updated

**Updated**: State when graph has been updated
- **Theory**: BCM-016 Cognitive Graph Model
- **Type**: CompletedState
- **Transitions**: Updated → Traversing

**Traversing**: State when graph is being traversed
- **Theory**: BCM-016 Cognitive Graph Model
- **Type**: ActiveState
- **Transitions**: Traversing → Traversed

**Traversed**: State when graph has been traversed
- **Theory**: BCM-016 Cognitive Graph Model
- **Type**: CompletedState
- **Transitions**: Traversed → Querying

**Querying**: State when graph is being queried
- **Theory**: BCM-016 Cognitive Graph Model
- **Type**: ActiveState
- **Transitions**: Querying → Queried

**Queried**: State when graph has been queried
- **Theory**: BCM-016 Cognitive Graph Model
- **Type**: CompletedState
- **Transitions**: Queried → Creating

### State Machine States

**Creating**: State when state machine is being created
- **Theory**: BCM-017 Cognitive State Machine
- **Type**: ActiveState
- **Transitions**: Creating → Created

**Created**: State when state machine has been created
- **Theory**: BCM-017 Cognitive State Machine
- **Type**: CompletedState
- **Transitions**: Created → Running

**Running**: State when state machine is running
- **Theory**: BCM-017 Cognitive State Machine
- **Type**: ActiveState
- **Transitions**: Running → Paused

**Paused**: State when state machine is paused
- **Theory**: BCM-017 Cognitive State Machine
- **Type**: PausedState
- **Transitions**: Paused → Running

**Stopped**: State when state machine is stopped
- **Theory**: BCM-017 Cognitive State Machine
- **Type**: StoppedState
- **Transitions**: Stopped → Creating

**Error**: State when state machine is in error
- **Theory**: BCM-017 Cognitive State Machine
- **Type**: ErrorState
- **Transitions**: Error → Stopped

### Metric States

**Collecting**: State when metric is being collected
- **Theory**: BCM-018 Cognitive Metrics
- **Type**: ActiveState
- **Transitions**: Collecting → Collected

**Collected**: State when metric has been collected
- **Theory**: BCM-018 Cognitive Metrics
- **Type**: CompletedState
- **Transitions**: Collected → Calculating

**Calculating**: State when metric is being calculated
- **Theory**: BCM-018 Cognitive Metrics
- **Type**: ActiveState
- **Transitions**: Calculating → Calculated

**Calculated**: State when metric has been calculated
- **Theory**: BCM-018 Cognitive Metrics
- **Type**: CompletedState
- **Transitions**: Calculated → Aggregating

**Aggregating**: State when metric is being aggregated
- **Theory**: BCM-018 Cognitive Metrics
- **Type**: ActiveState
- **Transitions**: Aggregating → Aggregated

**Aggregated**: State when metric has been aggregated
- **Theory**: BCM-018 Cognitive Metrics
- **Type**: CompletedState
- **Transitions**: Aggregated → Analyzing

**Analyzing**: State when metric is being analyzed
- **Theory**: BCM-018 Cognitive Metrics
- **Type**: ActiveState
- **Transitions**: Analyzing → Analyzed

**Analyzed**: State when metric has been analyzed
- **Theory**: BCM-018 Cognitive Metrics
- **Type**: CompletedState
- **Transitions**: Analyzed → Collecting

### Mathematics States

**Formalizing**: State when mathematics is being formalized
- **Theory**: BCM-019 Cognitive Mathematics
- **Type**: ActiveState
- **Transitions**: Formalizing → Formalized

**Formalized**: State when mathematics has been formalized
- **Theory**: BCM-019 Cognitive Mathematics
- **Type**: CompletedState
- **Transitions**: Formalized → Proving

**Proving**: State when theorem is being proved
- **Theory**: BCM-019 Cognitive Mathematics
- **Type**: ActiveState
- **Transitions**: Proving → Proved

**Proved**: State when theorem has been proved
- **Theory**: BCM-019 Cognitive Mathematics
- **Type**: CompletedState
- **Transitions**: Proved → Verifying

**Verifying**: State when proof is being verified
- **Theory**: BCM-019 Cognitive Mathematics
- **Type**: ActiveState
- **Transitions**: Verifying → Verified

**Verified**: State when proof has been verified
- **Theory**: BCM-019 Cognitive Mathematics
- **Type**: CompletedState
- **Transitions**: Verified → Applying

**Applying**: State when mathematics is being applied
- **Theory**: BCM-019 Cognitive Mathematics
- **Type**: ActiveState
- **Transitions**: Applying → Applied

**Applied**: State when mathematics has been applied
- **Theory**: BCM-019 Cognitive Mathematics
- **Type**: CompletedState
- **Transitions**: Applied → Formalizing

### Guarantee States

**Specifying**: State when guarantee is being specified
- **Theory**: BCM-020 Cognitive Guarantees
- **Type**: ActiveState
- **Transitions**: Specifying → Specified

**Specified**: State when guarantee has been specified
- **Theory**: BCM-020 Cognitive Guarantees
- **Type**: CompletedState
- **Transitions**: Specified → Formalizing

**Formalized**: State when guarantee has been formalized
- **Theory**: BCM-020 Cognitive Guarantees
- **Type**: CompletedState
- **Transitions**: Formalized → Verifying

**Verifying**: State when guarantee is being verified
- **Theory**: BCM-020 Cognitive Guarantees
- **Type**: ActiveState
- **Transitions**: Verifying → Verified

**Verified**: State when guarantee has been verified
- **Theory**: BCM-020 Cognitive Guarantees
- **Type**: CompletedState
- **Transitions**: Verified → Enforcing

**Enforcing**: State when guarantee is being enforced
- **Theory**: BCM-020 Cognitive Guarantees
- **Type**: ActiveState
- **Transitions**: Enforcing → Enforced

**Enforced**: State when guarantee has been enforced
- **Theory**: BCM-020 Cognitive Guarantees
- **Type**: CompletedState
- **Transitions**: Enforced → Monitoring

**Monitoring**: State when guarantee is being monitored
- **Theory**: BCM-020 Cognitive Guarantees
- **Type**: ActiveState
- **Transitions**: Monitoring → Violated

**Violated**: State when guarantee has been violated
- **Theory**: BCM-020 Cognitive Guarantees
- **Type**: ErrorState
- **Transitions**: Violated → Resolved

**Resolved**: State when violation has been resolved
- **Theory**: BCM-020 Cognitive Guarantees
- **Type**: CompletedState
- **Transitions**: Resolved → Monitoring

---

## State Relationships

### State Dependency Graph

```
Observing → Observed → Perceiving → Perceived → Evidencing → Evidenced → Confiding → Confided → Knowing → Known → Believing → Believed → Hypothesizing → Hypothesized → Reasoning → Reasoned → Deciding → Decided → Planning → Planned → Executing → Encoding → Encoded → Retrieving → Retrieved → Consolidating → Consolidated → Learning → Learned → Adapting → Adapted → Reflecting → Reflected → Evaluating → Evaluated → SelfEvaluating → SelfEvaluated → Observing
```

### State Composition

**Composite States**: States that contain other states
- Reasoning contains Believing
- DecisionMaking contains Hypothesizing
- Planning contains Deciding
- MetaReasoning contains Reasoning
- SelfEvaluation contains Evaluating

### State Inheritance

**Base States**: States that serve as base for other states
- CognitiveState (base for all cognitive states)
- ActiveState (base for active states)
- CompletedState (base for completed states)
- ErrorState (base for error states)

---

## State Lifecycle

### State Transitions

**State Transition**: The process of moving from one state to another
- **Trigger**: Event that triggers transition
- **Guard**: Condition that must be satisfied
- **Action**: Action executed during transition
- **Effect**: Effect of transition

### State Lifecycle Events

**StateEntered**: Emitted when state is entered
**StateExited**: Emitted when state is exited
**StateTransitioned**: Emitted when state transition occurs

---

## State Storage

### Storage Requirements

**Persistence**: All states must be stored persistently
**Indexing**: All states must be indexed for retrieval
**Versioning**: All states must be versioned
**Backup**: All states must be backed up

### Storage Locations

**Primary Storage**: Main storage for active states
**Archive Storage**: Main storage for archived states
**Backup Storage**: Storage for backup copies

---

## Document End

**This document provides the comprehensive state registry for the Blueprint Cognitive Model.**

**All cognitive states must conform to this registry.**

**The BCM State Registry is signed by the Chief Cognitive Architect.**
